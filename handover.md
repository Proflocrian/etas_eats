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
- **Target:** iPhone 15, iOS Safari, installed via Share -> Add to Home Screen
  (installs full-screen/standalone - no address bar).
- Dev happens on **Windows** (this repo); a MacBook is available for Safari checks.

## Ground rules (the owner's working style - follow these)

- **Plan first.** Present a numbered plan and get explicit approval before editing files.
- **Small steps.** Prefer a few focused edits, verified as needed.
- **Verify sparingly.** The owner iterates live via `pnpm dev` (often on-device) and
  tests visually. Don't run tsc/test/lint after every small edit - reserve the full
  check for genuinely big or risky changes.
- **Ask upfront** on genuine ambiguity rather than assuming.
- **No git operations.** The owner handles all commits/branches/pushes. Never run git.
- **No em-dashes in UI text.** Use a normal hyphen `-`.
- Keep output concise; read only what's needed.
- The owner frequently hand-edits files between turns (placeholder copy, theme colours,
  emojis). **Re-read a file before editing** if there's any chance it changed on disk,
  and preserve their edits.

## Stack

- **React 19 + TypeScript**, built with **Vite 8**.
- **Tailwind CSS v4** via `@tailwindcss/vite` (no config file; `@import 'tailwindcss'`
  in `src/index.css`). A custom `@theme` colour token (`--color-primary`) generates the
  `primary` utilities (`bg-primary`, `text-primary`, `border-primary`, ...). Dynamic
  per-type/per-theme colours are applied with **inline styles** referencing CSS variables.
- **Dexie 4** over IndexedDB for storage.
- **vite-plugin-pwa** (`registerType: 'autoUpdate'`, SW enabled in dev via `devOptions`;
  manifest `display: 'standalone'`, portrait).
- **Vitest** + **fake-indexeddb** for tests (currently 26, all green). **oxlint** for linting.
- Package manager: **pnpm**.
- No router - navigation is React state + the History API (see App shell below).

### Commands
- `pnpm dev` - dev server (test on device via the LAN URL it prints).
- `pnpm test` - vitest.
- `npx tsc -b` - typecheck.
- `pnpm lint` - oxlint (clean; exit 0).
- `pnpm build` - `tsc -b && vite build` (also generates the service worker).

## Architecture

Layers: **UI components/views** -> **data-access layer (DAL)** -> **Dexie/IndexedDB**.
Pure date/time logic lives in `lib/`; all visual theming lives in `lib/theme.ts`. State
is local React state; no global store.

### Data model - `src/db/db.ts`
Discriminated union keyed on `entryType`:

- `BaseEntry`: `id?`, `date` ('DD-MM-YYYY'), `time` ('HH:MM'), `notes?`, `createdAt`, `updatedAt`.
- `FoodEntry` (`entryType:'food'`): `food` (free text, covers meal/snack/drink),
  `quantity?`, `calories?`, `possibleTrigger: boolean`.
- `ActivityEntry` (`entryType:'activity'`): `activity`, `possibleTrigger: boolean`.
- `SymptomEntry` (`entryType:'symptom'`): `symptomTypes: SymptomTypeEnum[]` (>=1).
  Symptom types: `heartburn | regurgitation | abdominal-pain | nausea | bloating | other`.
- `Entry = FoodEntry | ActivityEntry | SymptomEntry`.
- `TriggerableEntry = FoodEntry | ActivityEntry` (symptoms can't be triggers).
- Helper types `DistributiveOmit`/`DistributivePartial` keep union variants intact for
  `NewEntry` and partial updates.

**Dexie store:** one table `entries`, schema `'++id, date, entryType'` (indexes unchanged
across versions). **Migrations:**
- v1: initial.
- v2: symptom `symptomType` (string) -> `symptomTypes` (array); old `chest-pain` -> `other`.
- v3: backfill `possibleTrigger = false` on existing Food/Activity records.
- v4: strip the removed `foodType` sub-kind off existing Food records.

Reading an entry returns the **union**, so callers must narrow on `entryType` before
touching variant-specific fields.

### DAL - `src/db/entries.ts`
`addEntry`, `getEntry`, `getEntriesByDate`, `getEntriesByDates` (grouped by day, every
requested day present), `getAllEntries` (chronological, for future CSV), `updateEntry`
(merge), `replaceEntry` (full `put` - used on edit so a changed `entryType` leaves no
stale fields; preserves `id`/`createdAt`), `deleteEntry`.
Triggers queries: `getRecentSymptoms(limit=5)`, `getEntriesBefore(date, time, limit=5,
maxHoursBefore=48)` (most recent Food/Activity strictly before a datetime, within 48h,
closest-first), `getPossibleTriggers()`.
Sort/compare via the `toSortableDate`/`dateTimeKey` helpers, never lexically on the raw
'DD-MM-YYYY' key.

### Pure helpers - `src/lib/`
- `calendar.ts` (fully unit-tested): date-key format/parse, `startOfWeek`/`weekDays`
  (Monday-based), `addDays`/`addWeeks`, `timeSlots` (48 x 30-min), `slotRangeLabel`,
  month/weekday names + `monthAbbr`/`shortYear`, `dateKeyToInput`/`inputToDateKey`,
  `currentSlot`, `entryDateTime`, `formatGap` ('5h before'). Fixed name arrays (no `Intl`)
  so tests are deterministic.
- `entryTypes.ts`: `FOOD_PLACEHOLDERS` + `ACTIVITY_PLACEHOLDERS` (**owner-authored playful
  copy - don't overwrite**; one is picked at random each time the form opens),
  `SYMPTOM_TYPE_LABELS`/`SYMPTOM_TYPE_OPTIONS`, and `entryTitle(entry)` (chip/display text).

### Theme - `src/lib/theme.ts` (single source for all visual tokens)
- **`Palette`** - the typed set of every themeable colour: primary action, app bg, per
  entry-type bg/text/border, `allPillBorder`/`triggerPillBorder`, `pillBg`/`pillBorderIdle`,
  `navFont`/`navSelectedFont`/`navBg`, `fabBg`, `settingsButtonBg`, `sheetBg`.
- **`CSS_VARS`** - maps each palette key to a CSS custom property. `primaryAction` uses
  `--color-primary` so the Tailwind `primary` utilities pick it up; the rest use
  `--color-*` names set on `:root` at runtime.
- **`COLORS`** - the colour API the app imports. Each value is a `var(--color-...)` string,
  so everything downstream is theme-reactive with no React re-render (the vars cascade).
- **`THEMES`** + **`DEFAULT_THEME`** (`etas-eats`) - four themes: `etas-eats` (label
  "EtasEats", the default), `cunty-leopard`, `trashy-2000s`, `one-eleven` (label "1:11").
  Each is a `Theme` = `{ label, font, palette }`: a full `Palette` of hexes **plus a `font`**
  (a CSS font-family stack applied app-wide). Add a theme by appending here.
- **`applyTheme(id)`** writes the palette hexes onto `:root` as the `--color-*` vars and the
  font as `--app-font`. **`loadThemeId()`/`saveThemeId()`** persist the choice to
  `localStorage` (try/caught). `main.tsx` calls `applyTheme(loadThemeId())` before first paint.
- Derived maps built from `COLORS`: **`ENTRY_TYPE_META`** (label + bg/text/border per type),
  **`ENTRY_TYPE_EMOJI`**, **`ENTRY_TYPE_ORDER`** (`food, activity, symptom` - used by both
  the calendar filters and the form pills), **`FILTER_CHIP_META`** (`all`/`trigger` chips),
  **`TAB_EMOJI`** (bottom nav), and the shared pill constants **`PILL_CLASS`** (`border-2`),
  **`PILL_BG_COLOUR`**, **`PILL_BORDER_IDLE`**.

To recolour/restyle: edit `THEMES` (per-theme, incl. `font`) or the hex in `index.css`
`@theme --color-primary` (the default/fallback; body font is `var(--app-font, <stack>)`).
**PWA chrome colours are separate literals** - if the brand colour changes, also update
`theme_color` in `vite.config.ts` and `<meta name="theme-color">` in `index.html` (static,
read before CSS loads, can't use the var).

### UI
- `App.tsx` - shell. Holds `tab` ('calendar'|'triggers'|'settings'|'about'), renders the
  active view + `BottomNav`, background from `COLORS.appBg`. **History API**: Calendar is
  the base entry; each tab switch `pushState`s so device Back returns to the previous tab,
  and Back from Calendar exits. Launch always starts on Calendar.
- `components/BottomNav.tsx` - sticky 4-tab bar; emojis from `TAB_EMOJI`, label colours from
  `navFont`/`navSelectedFont`, background from `navBg`; bottom safe-area aware. Exports `Tab`.
- `views/CalendarView.tsx` - Week/Day time grid. Owns the visible range (`anchor`), loads via
  `getEntriesByDates`. Row 1 = arrows + month label + Today + Week/Day toggle; row 2 = filter
  chips (`All` + per-type emoji chips + `🚩` only-triggers toggle), all from theme. `FilterChip`
  keeps a constant bg and changes only its border colour on selection. The **Week/Day toggle** is
  a single click-anywhere flip switch with a sliding highlight. FAB (SVG `+`, `fabBg`) opens the
  create form. **View state (anchor, viewMode, filters) is remembered across tab switches** via
  module-level `saved*` vars (seeded into state, written back in an effect); resets on app launch.
- `components/CalendarGrid.tsx` - presentational grid parameterized by `days` (7=week, 1=day).
  48 half-hour rows, vertical-scroll-only. Entries render as colour chips in their start slot;
  same-slot entries split the column; flagged triggers show a 🚩. **Opens at 06:30** on app load;
  scroll position persists across tab switches (module-level `savedScrollTop`). **Horizontal
  swipe** calls `onStep(-1|+1)` (wired to CalendarView `step`) to go prev/next range; an
  `onClickCapture` guard swallows the tap that ends a swipe so it doesn't open the create form.
- `components/EntryForm.tsx` - create/edit **bottom sheet** (`max-h-[67%]`, content `min-h`
  tuned to the tallest variant so switching entry type doesn't resize it, 2.5rem bottom padding).
  **Swipe-down-to-dismiss**: drag starts only at scrollTop 0, follows the finger, past ~1/3
  height it closes, else snaps back (0.2s). Type chips are emoji pills (create); **in edit mode
  the entry type is read-only** ("Entry Type: {emoji}"). Input borders are neutral at rest and
  turn the current entry type's accent **on focus** (`--field-accent` + `focus:border-[var(...)]`).
  Symptom pills use the symptom accent; `YesNoSwitch` "Possible Trigger?" uses `triggerPillBorder`.
  **Saving a future-dated entry pops a confirm modal** before writing. Edit adds Delete (two-tap
  confirm) and Duplicate. Saves via `addEntry`/`replaceEntry`.
- `components/DateTimeDialog.tsx` - small date + slot picker (used by Duplicate).
- `components/YesNoSwitch.tsx` - No/Yes **flip switch**: click anywhere to toggle, highlight
  slides between sides (0.2s). `size` ('sm'|'md') and `accentColor` (defaults to primary;
  trigger switches pass `triggerPillBorder`).
- `views/TriggersView.tsx` - two sub-tabs: 🤒 Last Symptoms, 🚩 Trigger List. Both sub-tabs,
  when selected, use the symptom colouring (`symptomEntryBg` + `symptomEntryText`).
- `components/LastSymptoms.tsx` - per recent symptom (up to 5): the symptom + time, then up to 5
  prior Food/Activity entries (within 48h) with a gap label, type dot, name, and a mini
  `YesNoSwitch`. Tapping the row opens the read-only detail sheet.
- `components/TriggerList.tsx` - bulleted list of flagged entries; tap opens the detail sheet.
- `components/EntryDetailSheet.tsx` - read-only entry info; the only editable control is the
  "Possible Trigger?" switch (persists immediately).
- `views/SettingsView.tsx` - sections: **Theme** picker (card per theme, swatch preview, label
  shown in that theme's font, active one highlighted; tapping applies + persists instantly) and
  **placeholder** sections that don't act yet - Language (English/Italian/Dutch), Data & Support
  (Export Data 📤, Request Features / Bug Support 📩), Battery (static cute line), and a red
  Danger Area (Delete All Data 🗑️). Cards use `settingsButtonBg`.
- `views/AboutView.tsx` + `views/Placeholder.tsx` - About is still a placeholder.

## Conventions / gotchas

- **oxlint:** a few intentional `// oxlint-disable-next-line react/set-state-in-effect`
  comments on IndexedDB-load effects (CalendarView, LastSymptoms, TriggerList) - legitimate
  external-store syncs the rule can't see through.
- **Theme colours are CSS vars.** `COLORS.x` / `ENTRY_TYPE_META[...].border` are `var(--...)`
  strings - fine in inline styles, not as Tailwind arbitrary classes. For the brand pink in
  class names use the `primary` utilities (`bg-primary`, etc.), not `bg-[#...]`.
- **`overscroll-behavior: none`** is set on `html, body` (index.css) to kill pull-to-refresh /
  scroll-chaining, which the swipe-to-dismiss relies on. The sheet is also `overscroll-contain`.
- **Swipe-to-dismiss** only starts when the sheet is scrolled to the top (so it doesn't fight
  content scroll); touch handlers are passive (no `preventDefault`).
- **Calendar swipe nav** uses the same touch handlers; distinguishes a horizontal swipe from a
  vertical scroll via `|dx| > |dy|*1.5` and a ~50px threshold.
- **Orientation is locked to `portrait`** in the manifest (`vite.config.ts`), so the installed
  PWA never rotates - landscape only appears in the browser / during dev. Layout is
  landscape-tolerant (everything scrolls; left/right safe-area insets handled), the one cramped
  spot being the EntryForm sheet (fixed content `min-h` forces scrolling in a short viewport).
  No landscape-specific styling exists; don't change portrait to chase it.
- **PWA updates:** `autoUpdate` means a new build may need one relaunch to activate.
- **Pinch-zoom disabled** via the viewport meta in `index.html`.
- `calendar_view_ss.jpeg` at the repo root is a current-state screenshot reference.

## Active workstream: theme redesign (started 2026-10-08)

We are turning the four themes from placeholder palettes into genuinely designed looks, using
design specs produced by **Claude Design**. **A new instance picking this up must read the
specs in full before touching any theme code.**

### Where the design material lives
- **Prompts** (what we asked Claude Design for, incl. chosen direction per theme) - repo root:
  `cunty_leopard_prompt.md`, `2000s_prompt.md`, `etaseats_prompt.md`, `one_eleven_prompt.md`.
- **Specs** (what Claude Design returned - the source of truth for implementation) -
  `theme_specs/`: `etas_eats_theme_spec.md`, `cunty_leopard_theme_spec.md`,
  `trashy_2000s_theme_spec.md`, `11_11_theme_spec.md`. **Read all four in full.** (All 4 received.)
- **Assets** - `theme_specs/leopard-bold.svg`, `leopard-soft.svg`, `leopard-dark.svg`:
  seamless 200x200 leopard tiles, three colourways, for Cunty Leopard. NOTE: each carries ~10 KB
  of embedded C2PA metadata (a `<metadata>` block, ~47 KB total) that should be stripped before
  bundling; the print paths are intact and tile correctly.

### Chosen direction per theme (from the prompts / Q&A)
- **EtasEats** (default): a clean **UberEats look-alike** - white/black/`#06C167` green; green =
  Food, with blue (Activity) + orange (Symptom) so the three stay distinct on the grid; font Figtree.
- **Cunty Leopard**: maximalist glam, **classic natural leopard** (tan/caramel/espresso/black on
  cream) + metallic gold; real SVG print as the hero; fonts Jost + Bodoni Moda italic.
- **Trashy 2000s**: **full trashy Y2K, bubblegum pink** (Posh Beckham as muse) - velour, rhinestone
  bling, stars; baby blue + lilac separate entry types, gold for triggers; fonts Nunito + Yellowtail.
- **11:11** (internal id `eleven-eleven`; label `'11:11'` - both FIXED in `theme.ts`. The old
  persisted key `one-eleven` simply falls back to the default `etas-eats`, which is fine): a **dark
  denim** theme. Marbled-wave accents only on sheets, a faint header strip, and the theme card (never
  the grid). Font Quicksand. The 🩵 (`#A8D8EA`) is the rare "this one" accent (selected tab, today,
  Save). Two owner tweaks vs the raw spec: the calendar 11:11 marker is the **actual 🩵 emoji**,
  always shown, nudged to the **11:11 point** in the gutter (~11 min below the 11:00 line); and the
  FAB ripple is **always-on, ~11s loop** (not time-of-day dependent), so **no `useIsEleven()` hook is
  needed**. (Both changes are already written into `11_11_theme_spec.md`.)

### What the specs require beyond today's flat-palette system
The current system is flat hexes -> CSS vars -> `COLORS.x`. The specs go further, in three tiers:
1. **More tokens** (easy): ~15-25 new per-theme values each incl. **string-valued** tokens
   (gradients, box-shadows, `background-image` strings). CSS custom properties hold these fine.
2. **Themify hard-coded neutrals** (mechanical): grid lines, inputs, dividers, text, nav hairline
   are currently literal `neutral-*` Tailwind classes; the specs want them theme-controlled.
3. **Per-theme structural treatments + fonts + motion** (the real work): FAB variants (plain /
   gold 3-layer / 14-gem halo), leopard trims + sheet bands, holo/bedazzle, patterned app bg +
   grid scrim, new small components (`LeopardTrim`, `GoldShimmer`, `Bedazzle`, `Sparkles`,
   `FabGems`, theme-aware FAB), offline-bundled fonts (+ PWA precache), per-theme keyframes behind
   `prefers-reduced-motion`.

### Architecture principles (how we keep it from breaking)
- Add new keys to the `Palette` type so **TypeScript forces every theme to define every key** -
  completeness is compiler-enforced. Non-opted themes get flat fallbacks (`appBgImage: 'none'`,
  `fontDisplay` = `font`, plain shadows).
- **Gate every structural extra behind a per-theme flag/capability** (or a component that renders
  plain/`null` for themes that don't opt in). A theme with no `fabTreatment` keeps today's FAB. The
  11:11 spec's proposed `theme.decor = { sheetWave, headerWave, watermark, elevenRow, fabRipple, ... }`
  flags are exactly this pattern; use one unified decor/flags concept across all themes.
- **Context-dependent tokens** (needed by 11:11): controls look different on the dark app vs on its
  frosted light sheet. Don't branch in every component - let the sheet wrapper **re-map the CSS vars
  for its subtree** (e.g. inside `.sheet`, redefine `--color-pill-bg` to the on-sheet value). Build
  this override hook into the token layer in Phase 1-2. Also note: 11:11 is a dark theme, so Tier 2
  (themifying text/line literals) must be complete, and the iOS status-bar colour is a static global
  (`theme-color` / status-bar-style) that can't be recoloured per theme - a known limitation.
- Fonts bundled for offline (Figtree via `@fontsource-variable/figtree`; Jost/Bodoni + Nunito/
  Yellowtail self-hosted woff2 in `public/fonts`, added to the vite-plugin-pwa precache).
- Tests (`lib/calendar`, `db/*`) are untouched by theming and must stay green.

### Agreed phased plan
1. **Phase 1 - foundation. DONE (2026-10-08).** `theme.ts` now has an expanded `Palette` (universal
   tokens: text x3, onPrimary, divider, cardBorder, grid lines x3 + gridScrim, input bg/border/
   placeholder, switchTrack/switchNoBg, segmentActive bg/text, danger set x4) + optional `Theme`
   fields (`fontDisplay`, `treatments`, `onSheet`, `decor: ThemeDecor`) declared but mostly unused;
   `applyTheme` also sets `--app-font-display`. All four themes carry their real spec palettes + fonts.
   Fonts are **Fontsource** packages (Figtree/Jost/Bodoni Moda+italic/Nunito/Yellowtail/Quicksand),
   imported in `main.tsx`; `vite.config.ts` `workbox.globPatterns` precaches the latin woff2 subsets
   for offline. Verified: tsc clean, 26 tests green, build+SW OK. Treatments/onSheet/decor NOT yet
   populated or wired - that's Phases 2-6. Hard-coded `neutral-*` literals in components untouched,
   so 11:11 (dark) still has dark-on-dark text until Phase 2.
2. **Phase 2 - themify the neutrals. DONE (2026-10-08).** The semantic colours are registered as
   **Tailwind `@theme` tokens** in `index.css` (same pattern as `primary`), so components use
   utilities like `text-text-primary`, `text-text-secondary`/`-muted`, `border-divider`,
   `border-card-border`, `border-grid-line`/`-half`, `border-grid-col`, `bg-input-bg`,
   `border-input-border`, `text-on-primary`, `text-segment-active-text`, `bg-danger-bg`/
   `text-danger-text`/`border-danger-border` - all referencing the runtime `--color-*` vars, so theme
   switching drives them. Placeholder colour via a global `::placeholder` rule. The hard-coded
   `neutral-*`/`white`/`red-*` literals were swapped across every component/view. The Week/Day +
   today + Save + FAB now use `segment-active-*` / `on-primary` (e.g. default's black segment thumb,
   black-on-green actions). **On-sheet override is wired:** `.sheet-scope` (on EntryForm/
   EntryDetailSheet/DateTimeDialog + the future-date modal) remaps text/pill/input/switch vars to
   `*-sheet` values; `applyTheme` always emits those (onSheet override or base), and 11:11's `onSheet`
   is populated - so 11:11's light sheets now read correctly over its dark app. Verified: tsc clean,
   26 tests, build OK, and the new utilities confirmed present in the compiled CSS. Intentionally
   left for per-theme phases: modal scrims (`bg-black/40`), the destructive-red Delete button, and the
   Settings swatch ring (`black/10`).
   - **Phase 2.5 - flip-switch (`YesNoSwitch`) themed. DONE (2026-10-08).** Fully token-driven:
     track=`switchTrack`, No thumb=`switchNoBg`, Yes thumb=passed accent, inactive label=`textMuted`.
     Added tokens `switchNoText` + `triggerSwitchText` for thumb-label contrast (etas/2000s white, leopard
     cream, 11:11 navy / dark-rose); `switchNoText` is on-sheet-scoped. `YesNoSwitch` gained an `accentText`
     prop; the three trigger-switch callers pass `triggerSwitchText`. (Week/Day segment was themed in Phase
     2; the Triggers sub-tabs keep their symptom-coloured look by choice - converting them to a sliding
     segmented control is an open design option, not done.)
3. **Phase 3 - EtasEats slice / treatment + motion pattern. DONE (2026-10-08).** Added string-valued
   treatment tokens `cardShadow`/`sheetShadow`/`fabShadow`/`scrim` to `Palette` (mapped to `--shadow-*`
   / `--color-scrim`, read inline via `COLORS`, NOT in `@theme`; `:root` fallbacks in index.css for
   pre-paint) and **populated all four themes** with their spec shadow/scrim values (so later phases
   inherit them). Wired: Triggers cards -> `cardShadow`; the two sheets + the dialogs -> `sheetShadow`;
   FAB -> `fabShadow`; all overlays -> `scrim` (replacing `bg-black/40`). Added a grabber pill to both
   sheets. Motion primitives live in index.css (all transform/opacity): `.tap` (scale .96) + `.tap-fab`
   (scale .92) press feedback, `sheet-enter` slide-up, `scrim-fade`, and a global `prefers-reduced-motion`
   guard. `.tap` applied to FAB, filter chips, form pills, nav items, and the primary/confirm buttons.
   Verified: tsc clean, 26 tests, build OK, motion CSS confirmed bundled. Deferred (optional, flow-
   touching): the "✓ Saved" confirmation + new-chip-into-slot animation, a sheet *exit* animation, and
   the spec's inset-ring input focus (we keep the existing per-type accent focus border).
4. **Phase 4 - Cunty Leopard** (in sub-steps):
   - **4a - foundation. DONE (2026-10-08).** Stripped C2PA metadata from the 3 tiles -> `src/assets/
     leopard-{soft,bold,dark}.svg`, imported `?url` in `theme.ts`. Added **treatment-var plumbing**:
     `Theme.treatments` keys are literal CSS var names; `applyTheme` clears `ALL_TREATMENT_VARS` then sets
     the active theme's, and sets `--app-font-display-style`. Leopard now defines `treatments`
     (`--app-bg-layer`, `--leopard-bold`, `--leopard-bold-sm`, `--leopard-dark`, `--gold-metal`,
     `--gold-line`), `decor` (patternedBg/fabTreatment:'leopard'/leopardTrim/sheetBand/goldSave/navPrint),
     and `fontDisplayStyle:'italic'`. `App.tsx` renders a fixed `z-index:-1` layer painting
     `var(--app-bg-layer, transparent)` (soft print for leopard; flat body `appBg` for others).
     `CalendarGrid` scroll area now has the `gridScrim` background (mutes print behind the grid;
     transparent on etas/11:11). A `.font-display` class (family + `--app-font-display-style`) is applied
     to the prominent titles (month label, sheet titles, entry name, symptom card title, Settings h1, and
     the per-theme theme-card label) - this also lights up 2000s' Yellowtail headings. Verified: tsc, 26
     tests, build (3 tiles emitted + precached). NOTE: display headings use the display FONT at existing
     sizes; per-theme glam SIZING is a later polish.
   - **4b - trims + sheet band. DONE (2026-10-08).** Added a **theme context** (`lib/theme-context.tsx`:
     `ThemeProvider`/`useTheme`/`useDecor`) so structural decor can render conditionally + re-render on
     theme switch; `main.tsx` wraps `<App>` in it and `SettingsView` now drives the theme through it
     (colours still flow via CSS vars). New `components/decor.tsx`: `<PrintTrim height>` (leopard-bold
     strip + gold hairline, null unless `decor.leopardTrim`) and `<SheetGrabber>` (16px leopard band with
     grabber + gold hairline when `decor.sheetBand`, else the plain grabber pill). Wired: a 5px `PrintTrim`
     between the calendar header and grid; a 6px strip across the top of each Last-Symptoms card (card
     restructured to `overflow-hidden` + inner `p-3`); `SheetGrabber` in both sheets. Verified: tsc, 26
     tests, build. (Settings/Triggers cards other than Last-Symptoms don't carry a strip yet; the special
     Settings theme-card is 4d.)
   - **4c - FAB + Save + nav. DONE (2026-10-08).** New `components/Fab.tsx` (theme-aware): plain green
     circle by default, leopard renders the layered treatment (gold-metal ring -> `--leopard-bold-sm`
     disc -> 30px espresso core with gold `+`); replaces the inline FAB in CalendarView. Gold Save via CSS
     vars: `--save-bg`/`--save-text` default to the theme's primary (index.css `:root`), leopard overrides
     to `var(--gold-metal)` / `#2A1810` (treatments); the three Save/confirm buttons read those vars.
     `BottomNav` uses `useDecor`: on leopard the bar paints `--leopard-dark` print with a `--gold-line`
     top hairline and a gold tab-mark under the selected tab; other themes keep flat `navBg` + divider.
     Also moved the calendar `PrintTrim` INTO `CalendarGrid` (between the date headers and the grid, i.e.
     directly above the grid under the dates) per owner feedback. Verified: tsc, 26 tests, build.
   - **4d - motion + theme-card. DONE (2026-10-08). Phase 4 (Cunty Leopard) COMPLETE.** Added leopard
     motion in index.css behind `cl-*` classes (neutralized by the reduced-motion guard): `cl-save` (M1
     gold sheen on Save while a sheet is open; added in EntryForm when `decor.goldSave`), `cl-fab` (M2 gold
     halo pulsing out of the FAB 3x on mount; on the leopard Fab), `cl-band` (M3 sheen across the sheet
     leopard band; on SheetGrabber's band), and `cl-theme-card` (slow 6s sheen on the active leopard
     Settings card). Implemented T8: the active leopard theme-card gets print fill (`--leopard-bold-sm`),
     a gold border, its name on an espresso plate in Bodoni italic gold, and a gold check (only when
     leopard is active, since its treatment vars are set then). Verified: tsc, 26 tests, build, cl-*
     classes confirmed in CSS. NOTE: spec M4 (toggle overshoot easing) skipped as minor; gradient border
     on the theme card approximated with a solid gold `#B8862C`. The Save `cl-save` shimmer only runs when
     the button is enabled AND the sheet isn't being dragged - the infinite shimmer is a composited layer
     that otherwise desyncs the leopard sheet band during the drag-to-dismiss on iOS (the detail sheet has
     no Save, hence was unaffected). FOLLOW-UP: on the iOS simulator the band still desynced, so
     EntryForm's sheet was split into an **outer wrapper that owns the drag `transform`** and an **inner
     element that owns the scroll** (the classic iOS fix for transforming a scroll container). EntryDetailSheet
     was left single-element (its content doesn't scroll, so it's fine); apply the same split there if its
     content ever grows.
5. **Phase 5 - Trashy 2000s** (in sub-steps):
   - **5a - surfaces. DONE (2026-10-08).** 2000s `treatments`: `--app-bg-layer` = velour (feTurbulence noise
     + star tile + diagonal sheen + pink gradient, one `background` shorthand of inline-SVG data-URIs),
     `--tt-holo` gradient, and a bedazzle `--save-bg` (white stud radial tile over the pink gradient) +
     white `--save-text`. `decor: { patternedBg, sheetBandHolo }`. `SheetGrabber` gained a holo-band branch
     (22px `--tt-holo` band + dark grabber, class `tt-holo-band` with the `tt-sheen` background-position
     drift). Grid scrim/lines already themed from earlier phases. Verified: tsc, 26 tests, build.
   - **5b - gem FAB + velour nav. DONE (2026-10-08).** `Fab.tsx` gained a `fabTreatment: 'gems'` branch:
     a 74px hit box with a 62px radial-pink gem FAB centred and 14 rhinestones on a 34px ring (computed
     positions). `BottomNav` handles `decor.navVelour`: nav paints `--nav-velour` (magenta noise + pink
     gradient) and the selected tab gets a translucent glass pill. 2000s decor now also sets
     `fabTreatment:'gems'` + `navVelour`. Verified: tsc, 26 tests, build.
   - **5c - stars + motion + theme-card. DONE (2026-10-08). Phase 5 (Trashy 2000s) COMPLETE.** FAB shimmer
     (`tt-fab-shimmer` white band sweeping the gem FAB every 6s); a cream Y2K star that pops in on the
     selected nav tab (`tt-nav-star`, inline star SVG); and the 2000s active Settings theme-card gets a
     drifting holographic fill (`tt-holo-band` + `backgroundImage: var(--tt-holo)`) with a pink border (its
     check is already pink via primaryAction, label stays Yellowtail). All behind the reduced-motion guard.
     Verified: tsc, 26 tests, build, classes confirmed in CSS. NOTE (optional, not done): today-marker star
     twinkle, Trigger-List gold-star bullets, and the Settings checkmark-as-star - deferred as granular.
6. **Phase 6 - 11:11** (most structurally complex: dark theme, on-sheet var overrides, wave accents,
   heart-clock SVG + 🩵 emoji marker, frosted `backdrop-filter` panels, always-on FAB ripple).
Each phase is small and independently verifiable on-device.

## Status

**Done:** data layer + migrations (v1-v4); calendar Week/Day grid with CRUD (create via slot
tap or FAB, edit, delete, duplicate); type + trigger filters; full Triggers feature (Last
Symptoms timeline with trigger flagging, Trigger List, read-only detail); app-like Back
navigation; a complete **runtime theming system** (`lib/theme.ts`, CSS vars + per-theme font,
4 themes, persisted) with a **Settings page** (working theme picker + placeholder sections);
EntryForm as a swipe-to-dismiss bottom sheet (fixed height, per-type focus borders, read-only
type on edit, future-date confirm modal); flip switches (Yes/No + Week/Day); calendar swipe
navigation; and persisted calendar view state + 06:30 open position.

**Not yet built / next:**
- **CSV export** + Web Share API (in the brief, not started) - the Settings "Export Data" row is
  a placeholder waiting for this.
- Wire up the other **Settings placeholders**: Language (i18n), Request Features / Bug Support,
  and the Danger Area **Delete All Data** (should clear the Dexie `entries` table).
- **About** page content (still a placeholder).
- **Visual design polish / theme redesign.** IN PROGRESS - see "Active workstream: theme redesign"
  above. The four themes are being rebuilt from Claude Design specs (`theme_specs/`). Phase 1 not
  started yet. Font Awesome icons were mentioned as a later swap for the emoji.
- **Phase 2 notifications** (iOS Web Push via a GitHub Actions cron - see `context.md`).
- Minor: the unselected Triggers sub-tab label is still a structural neutral grey (not themed);
  Back closing an open modal before switching tabs; Duplicate doesn't run the future-date check.

The codebase is small, typed, and tested - prefer extending the DAL + `lib/` helpers (with
tests) and keeping view logic thin, and route all colours through `lib/theme.ts`.
