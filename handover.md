# EtasEats - Handover

A context document for picking this project up cold (new chat instance, new dev).
Read this together with `context.md` (the original brief) at the repo root.

## What this is and why

A personal, offline-first **food & symptom diary PWA** - a birthday gift for the
owner's girlfriend (referred to as "Greta"/"Eta"). She has **GERD**, so the goal
is to track what she eats, what she does, and when she feels unwell, then review
what happened just before a symptom to spot likely **triggers**.

Hard constraints (from `context.md`):
- **Single user.** No auth, no accounts, no backend (phase 1).
- **Free.** No paid hosting/services. Deploy to **GitHub Pages**.
- **Offline-first.** All data lives on-device (IndexedDB); CRUD works with no network.
- **Target:** iPhone 15, iOS Safari, installed via Share -> Add to Home Screen.
- Dev happens on **Windows** (this repo); a MacBook is available for Safari checks.

## Ground rules (the owner's working style - follow these)

- **Plan first.** Present a numbered plan and get explicit approval before editing files.
- **Small steps**, verified one at a time (tests/typecheck/lint/build after each).
- **Ask upfront** on genuine ambiguity rather than assuming.
- **No git operations.** The owner handles all commits/branches/pushes. Never run git.
- **No em-dashes in UI text.** Use a normal hyphen `-`.
- Keep output concise; read only what's needed.
- The owner sometimes hand-edits files (e.g. cute placeholder copy). **Re-read a file
  before editing** if there's any chance it changed on disk, and preserve their copy.

## Stack

- **React 19 + TypeScript**, built with **Vite 8**.
- **Tailwind CSS v4** via `@tailwindcss/vite` (no separate config; `@import 'tailwindcss'`
  in `src/index.css`). Dynamic per-type colours are applied with **inline styles**
  (Tailwind can't JIT runtime values).
- **Dexie 4** over IndexedDB for storage.
- **vite-plugin-pwa** (`registerType: 'autoUpdate'`, SW enabled in dev via `devOptions`).
- **Vitest** + **fake-indexeddb** for tests. **oxlint** for linting.
- Package manager: **pnpm**.
- No router - navigation is React state + the History API (see App shell below).
  `react-day-picker` is NOT used (the week/time grid is custom).

### Commands
- `pnpm dev` - dev server (test on device via the LAN URL it prints).
- `pnpm test` - vitest (currently **26 tests**, all green).
- `npx tsc -b` - typecheck.
- `pnpm lint` - oxlint (clean; exit 0).
- `pnpm build` - `tsc -b && vite build` (also generates the service worker).

## Architecture

Layers: **UI components/views** -> **data-access layer (DAL)** -> **Dexie/IndexedDB**.
Pure date/time logic lives in `lib/`. State is local React state; no global store.

### Data model - `src/db/db.ts`
Discriminated union keyed on `entryType`:

- `BaseEntry`: `id?`, `date` ('DD-MM-YYYY'), `time` ('HH:MM'), `notes?`, `createdAt`, `updatedAt`.
- `FoodEntry` (`entryType:'food'`): `foodType` ('meal'|'snack'|'drink'), `food`, `quantity?`,
  `calories?`, `possibleTrigger: boolean`.
- `ActivityEntry` (`entryType:'activity'`): `activity`, `possibleTrigger: boolean`.
- `SymptomEntry` (`entryType:'symptom'`): `symptomTypes: SymptomTypeEnum[]` (>=1).
  Symptom types: `heartburn | regurgitation | abdominal-pain | nausea | bloating | other`.
- `Entry = FoodEntry | ActivityEntry | SymptomEntry`.
- `TriggerableEntry = FoodEntry | ActivityEntry` (symptoms can't be triggers).
- Helper types `DistributiveOmit`/`DistributivePartial` keep union variants intact for
  `NewEntry` and partial updates (a plain `Omit`/`Partial` over a union collapses to shared fields).

**Dexie store:** one table `entries`, schema `'++id, date, entryType'` (indexes unchanged
across versions). **Migrations:**
- v1: initial.
- v2: symptom `symptomType` (string) -> `symptomTypes` (array); old `chest-pain` -> `other`.
- v3: backfill `possibleTrigger = false` on existing Food/Activity records.

Reading an entry returns the **union**, so callers must narrow on `entryType` before
touching variant-specific fields.

### DAL - `src/db/entries.ts`
`addEntry`, `getEntry`, `getEntriesByDate`, `getEntriesByDates` (grouped by day, every
requested day present), `getAllEntries` (chronological, for future CSV), `updateEntry`
(merge - good for single-field flips), `replaceEntry` (full `put` - used on edit so a
changed `entryType` leaves no stale fields; preserves `id`/`createdAt`), `deleteEntry`.
Triggers queries: `getRecentSymptoms(limit=5)`, `getEntriesBefore(date, time, limit=5,
maxHoursBefore=48)` (most recent Food/Activity strictly before a datetime, within 48h,
closest-first), `getPossibleTriggers()`.

### Pure helpers - `src/lib/`
- `calendar.ts` (fully unit-tested): date-key format/parse, `startOfWeek`/`weekDays`
  (Monday-based), `addDays`/`addWeeks`, `timeSlots` (48 x 30-min), `slotRangeLabel`
  ('13:00-13:30'), month/weekday names + `monthAbbr`/`shortYear`, `dateKeyToInput`/
  `inputToDateKey` (native date input <-> key), `currentSlot`, `entryDateTime`,
  `formatGap` ('5h before' / '1d 3h before'). Uses fixed name arrays (no `Intl`) so
  tests are deterministic.
- `entryTypes.ts`: `ENTRY_TYPE_META` (label + colours per type: food=green, activity=blue,
  symptom=pink), option lists, `FOOD_PLACEHOLDERS` (**owner-authored playful copy - don't
  overwrite**), `SYMPTOM_TYPE_LABELS`, and `entryTitle(entry)` (the chip/display text;
  joins multiple symptom labels).

### UI
- `App.tsx` - shell. Holds `tab` ('calendar'|'triggers'|'about'), renders the active view
  + `BottomNav`. **History API**: `replaceState` sets Calendar as the base entry; each tab
  switch `pushState`s so the device Back button returns to the previous tab, and Back from
  Calendar exits the app. Launch always starts on Calendar.
- `components/BottomNav.tsx` - sticky 4-tab bar (Calendar 🗓️ / Triggers ⚠️ / Settings ⚙️
  / About ❓), bottom safe-area aware. Exports the `Tab` type.
- `views/CalendarView.tsx` - the big one. Week/Day view of a time grid; owns the visible
  range (`anchor`), loads via `getEntriesByDates`. Header row 1 = arrows flanking the month
  label + Today + Week/Day toggle; row 2 = right-aligned filter chips - `All` plus emoji
  chips (🍴 Food / 🤒 Symptom / 🏋️ Activity) and a 🚩 toggle that restricts to flagged
  Food/Activity (emoji chips carry aria-labels). FAB (`+`)
  opens the create form (defaults to today + current half-hour). Hosts the create/edit `EntryForm`.
- `components/CalendarGrid.tsx` - presentational grid, parameterized by `days` (7=week,
  1=day). Left hour gutter, 48 half-hour rows, vertical-scroll-only (`touch-action: pan-y`),
  auto-scrolls to ~07:00 on mount. Entries render as colour chips in their start slot;
  same-slot entries split the column; flagged triggers show a 🚩. Today captured once via
  `useState` initializer (keeps the purity lint happy).
- `components/EntryForm.tsx` - bottom-sheet create/edit. Type chips; conditional fields
  (Food: foodType chips + food + quantity; Activity: activity; Symptom: multi-select pills,
  >=1 required to save); editable date + 30-min slot `<select>`; Notes; a "Possible Trigger?"
  `YesNoSwitch` (Food/Activity). Edit adds Delete (two-tap confirm) and Duplicate. **Fixed
  content min-height** (`min-h-[510px]` create / `min-h-[580px]` edit) so switching entry type
  doesn't resize the sheet; shorter variants leave whitespace at the bottom. Saves via
  `addEntry`/`replaceEntry`.
- `components/DateTimeDialog.tsx` - small date + slot picker (used by Duplicate).
- `components/YesNoSwitch.tsx` - reusable No/Yes segmented switch (`size: 'sm'|'md'`).
- `views/TriggersView.tsx` - two sub-tabs: 🤒 Last Symptoms, 🚩 Trigger List.
- `components/LastSymptoms.tsx` - per recent symptom (up to 5), a card: the symptom + time,
  then up to 5 prior Food/Activity entries (within 48h) each with a gap label ('5h before'),
  a type dot, name, and a mini `YesNoSwitch`. Tapping the row (not the switch) opens the
  read-only detail sheet.
- `components/TriggerList.tsx` - bulleted list of flagged entries; tap opens the detail sheet.
- `components/EntryDetailSheet.tsx` - read-only entry info; the only editable control is the
  "Possible Trigger?" switch (persists immediately).
- `views/Placeholder.tsx` + `views/AboutView.tsx` + `views/SettingsView.tsx` - About and
  Settings are still placeholders.

## Conventions / gotchas

- **oxlint:** two intentional `// oxlint-disable-next-line react/set-state-in-effect`
  comments on IndexedDB-load effects (CalendarView, LastSymptoms, TriggerList) - legitimate
  external-store syncs the rule can't see through.
- **EntryForm fixed heights are hand-tuned px.** If you add/remove fields, re-check that the
  tallest variant (Food) doesn't exceed the min-height (which would reintroduce a jump).
- **PWA updates:** `autoUpdate` means a new build may need one relaunch to activate.
- **Pinch-zoom disabled** via the viewport meta in `index.html`.
- Entry `date` is stored `DD-MM-YYYY`; sort/compare via the `toSortableDate`/`dateTimeKey`
  helpers, never lexically on the raw key.

## Status

**Done:** data layer + migrations; calendar Week/Day grid with CRUD; create (tap slot or FAB),
edit, delete, duplicate; filters (type + Triggers); full Triggers feature (Last Symptoms
timeline with trigger flagging, Trigger List, read-only detail); app-like Back navigation.

**Not yet built / next:**
- **CSV export** + Web Share API (in the brief, not started).
- **Phase 2 notifications** (iOS Web Push via a GitHub Actions cron - see `context.md`).
- **About** page content.
- **Visual design pass.** Work so far has deliberately prioritized mechanics over aesthetics;
  colours/spacing are functional placeholders. Font Awesome icons were mentioned as a later
  swap for the emoji.
- Possible niceties discussed: Back button closing an open modal before switching tabs;
  calendar time-editing refinements.

The codebase is small, typed, and tested - prefer extending the DAL + `lib/` helpers (with
tests) and keeping view logic thin.
