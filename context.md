# Current Instructions

Nice, good summary. No we're going to be working on v1.2 today, these are some of the new features; 

1. Adjustable time slots for entrys (still 30m increments)
  - Ofc, backwards compatible with old DB entries
  - Needs to look appropriate on the calendar view
2. Actually implement notifications
3. For Food | Activity entries, lets add an optional "Photo" field
  - The idea would be an `Photo (Optional) (+)` entry, and when the `+` button is pushed, it allows her to take a photo
  - And when she views the entry in the future, she can see the photo.
  - This ofc still works offline, and we dont want to like duplicate data (ie the photo itself shouldnt exist in two places on her phone at once)
  - So i dont have a great idea on how to implmenet this - do you?

For now we can just work on feature 1. Lmk if you have any questions. 

---

- The `Date`, `Start` and `Duration` labels, should all have the same styling as the other labels inside the EntryDetailSheet and EntryForm (ie the same as the `Meal | Snack | Drink` label.)
- There should be two fields on that row, `Duration [dropdown] | End Time [dropdown]`, the way they work should be obvious, If she says `2hrs` in the duration, the end field updates to the right time, and vv. 
- Likewise the `Date` and `Start` row, the two fields should take an equal amount of horizontal space on their row (does that make sense?)
- Finally, the CalendarView, should work they way Google Calendar does (overlapping blocks get "thinner", see an example screenshot of google calendar at the root `google_calendar_eg.jpeg`). 

Lmk if you have any other questions?


# EtasEats - GERD Food & Symptom Diary PWA

## Overview
A personal, installable PWA built as a birthday gift for a single user - my girlfriend, Greta.
It started as a plain food diary and has grown into a **GERD (reflux) tracker**: she logs
what she eats, what she does, and the symptoms she feels, then looks back over the hours
before a flare-up to spot her own triggers. The whole thing is offline-first, single-user,
and wrapped in a lot of personalised in-jokes (lock screen, placeholders, GERD wiki, Settings).

Everything is local to the device. There is no backend.

## Stack (as actually built)
- **Framework:** React 19 + TypeScript, built with **Vite 8**.
- **PWA:** `vite-plugin-pwa` (`registerType: 'autoUpdate'`) - service worker + web app manifest.
- **Local storage:** **IndexedDB** via **Dexie.js** (typed CRUD, schema migrations).
- **Styling:** **Tailwind CSS v4** (`@tailwindcss/vite`). Touch-first, mindful of iOS safe-area insets.
- **Fonts:** self-bundled via `@fontsource(-variable)` so they are precached and work offline.
- **Calendar:** hand-built 30-minute-slot grid (no `react-day-picker` / FullCalendar).
- **CSV export:** CSV built in-app, shared via the Web Share API (native iOS share sheet).
- **Tooling:** `oxlint` (lint), `vitest` + `fake-indexeddb` (tests), **pnpm** (via corepack).
- **Hosting:** GitHub Pages (Cloudflare Pages / Netlify are equivalent fallbacks).

Scripts: `pnpm dev`, `pnpm build` (`tsc -b && vite build`), `pnpm lint`, `pnpm test`, `pnpm preview`.

## Architecture
Single-page app, offline-first, no backend in phase 1. Source lives in `src/`:

- **`db/`** - data layer.
  - `db.ts` - Dexie instance, the `Entry` type, and schema versions/migrations.
  - `entries.ts` - the typed CRUD + query DAL (`addEntry`, `getEntriesByDate(s)`,
    `getAllEntries`, `getAllSymptoms`, `getEntriesBefore`, `getPossibleTriggers`,
    `updateEntry`, `replaceEntry`, `deleteEntry`, `clearAllEntries`).
  - `entries.test.ts` - DAL tests (run against fake-indexeddb).
- **`lib/`** - framework-free logic + cross-cutting concerns.
  - `calendar.ts` (+ `.test.ts`) - pure date/time + 30-min-slot helpers. Date key is `DD-MM-YYYY`.
  - `date-i18n.ts` - localised month/weekday/date/gap formatting.
  - `period.ts` - the `all | 3d | week | month` range filter used by Tracker/Analysis.
  - `theme.ts` - the whole theming system: `Palette`, the 4 `THEMES`, `applyTheme` (writes
    CSS custom properties onto `:root`), entry-type emoji/labels/colours, decor flags.
  - `theme-context.tsx` - React context mirroring the active theme (for DOM that differs per theme).
  - `i18n.ts` + `i18n-context.tsx` - the string dictionaries (en/it/nl) and `useI18n()` / `t()`.
  - `entryTypes.ts` - symptom labels/options and the playful food/activity placeholders.
  - `lock.ts` - voucher-code gate (`UNLOCK_CODE`, stored in localStorage).
  - `pwa.ts` - installed-standalone detection.
  - `use-back-to-close.ts` - closes sheets/dialogs on device Back.
- **`components/`** - UI building blocks (calendar grid, entry form, bottom nav, filter
  chips/bar, bottom sheets, dialogs, trackers, trigger/symptom lists, lock screen, decor).
- **`views/`** - the top-level screens (one per nav tab, plus modals/landing).
- **`assets/`** - hero image + leopard-print SVG tiles (theme treatments).
- **`App.tsx`** - shell: install gate -> lock gate -> tab router + background decor layers.
- **`main.tsx`** - root render; applies the saved theme before first paint, wraps in providers.

State pattern: the active tab drives the browser history (device Back navigates tabs), and
each view keeps its filter/anchor state in module-level variables so it survives a remount
on tab switch.

## Data model - `Entry`
A discriminated union on `entryType` (`'food' | 'activity' | 'symptom'`). Shared fields:
`id` (auto-increment), `date` (`DD-MM-YYYY` grouping key), `time` (`HH:MM` slot start),
optional `notes`, and managed `createdAt` / `updatedAt`.

- **`food`** - `food` (free text), optional `quantity`, `possibleTrigger: boolean`.
- **`activity`** - `activity` (free text), `possibleTrigger: boolean`.
- **`symptom`** - `symptomTypes: SymptomTypeEnum[]` (one or more of heartburn, regurgitation,
  abdominal-pain, nausea, bloating, other).

Dexie schema is at **version 4**; `db.ts` carries the upgrade steps (single `symptomType` ->
`symptomTypes[]`; added `possibleTrigger`; removed the old food sub-kind). Keep adding a new
`db.version(n)` with an `.upgrade()` when the shape changes - never mutate an existing version.

## Views (bottom-nav tabs)
- **Calendar** (`CalendarView`) - week/day 30-min grid; tap a slot to add, tap an entry to
  edit; type filters + a "triggers only" filter. Home tab the app always launches on.
- **Tracker** (`TrackerView`) - a flat, filterable list of entries grouped by day over a period.
- **Analysis** (`AnalysisView`) - two sub-tabs: *Last Symptoms* (recent symptoms + what was
  logged in the 48h before each) and *Trigger List* (entries flagged as possible triggers).
- **Settings** (`SettingsView`) - theme picker, language, CSV export, WhatsApp support/donate
  links, battery gag, and the "danger area" (delete all data / remove vouchers).
- **About** (`AboutView`) + **GERD wiki** (`GerdView`) - personalised help/legal/rewards and
  the reflux reference content.
- **InstallPrompt** / **LockScreen** - the landing page shown in a plain browser tab, and the
  voucher-code gate shown before the app proper.

## Themes
Four full themes, selectable in Settings, all driven by CSS custom properties written by
`applyTheme`, so colours swap live:
- `etas-eats` - default, clean UberEats-style (white, black, one green).
- `cunty-leopard` - leopard print + metallic gold, serif display.
- `trashy-2000s` - Y2K bubblegum pink, velour nav, rhinestones, star glimmer.
- `eleven-eleven` - dark denim with a marbled-wave motif and a 🩵 accent.

Each theme supplies a full `Palette` plus optional `decor` flags (patterned backgrounds,
special FABs, print trims, waves, etc.) that toggle extra DOM in the components.

## Notifications (Phase 2 - still deferred, not built)
- iOS Web Push (16.4+) is server-triggered, not locally scheduled. No reliable browser API
  fires a local notification at a fixed time while the PWA is closed.
- **Plan:** grant permission once, capture the push subscription; a **GitHub Actions cron**
  workflow runs twice daily and sends pushes via `web-push`, the subscription held as a repo
  secret. Stays free; only a push token leaves the device - all diary data stays local.
- Reliability on iOS is decent but not guaranteed. The offline-first app shipped first; this
  bolts on afterwards without architectural changes.

## Ground Rules

- **Plan first.** Produce a numbered step-by-step plan and present it before touching any file. Do not proceed until explicitly approved.
- **Ask questions upfront.** If anything about a feature or the codebase is unclear, ask before starting. Do not make assumptions on ambiguous points.
- **Permission before changes.** State what you intend to do and wait for explicit approval - even for small edits - unless inside an already-approved plan.
- **Small steps.** Implement and verify one step at a time. Do not make sweeping changes across multiple files at once.
- **No git operations.** Never commit, push, `git mv`, create branches, or do anything git-related. The user handles all of this.
- **No em-dashes in UI text.** Use a regular hyphen-dash (`-`) not an em-dash.
- **Token efficiency.** Read relevant files, and keep your output simple.
