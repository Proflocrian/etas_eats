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
    `updateEntry`, `replaceEntry`, `deleteEntry`, `clearAllEntries`) + photos
    (`putPhoto`, `getPhoto`, `deletePhoto`).
  - `entries.test.ts` - DAL tests (run against fake-indexeddb).
- **`lib/`** - framework-free logic + cross-cutting concerns.
  - `calendar.ts` (+ `.test.ts`) - pure date/time + 30-min-slot helpers (date key `DD-MM-YYYY`),
    plus entry-duration maths: `daySegments` (split a block across midnight),
    `entryTimeRangeLabel`/`entryEndLabel`, and `overlapColumns` (Google-style side-by-side lanes).
  - `image.ts` - `compressImage`: downscale/JPEG a captured photo before storing.
  - `date-i18n.ts` - localised month/weekday/date/gap/duration formatting.
  - `period.ts` - the `all | 3d | week | month` range filter used by Tracker/Analysis.
  - `theme.ts` - the whole theming system: `Palette`, the 4 `THEMES`, `applyTheme` (writes
    CSS custom properties onto `:root`, and the Android status-bar `theme-color` meta),
    entry-type emoji/labels/colours, decor flags.
  - `theme-context.tsx` - React context mirroring the active theme (for DOM that differs per theme).
  - `i18n.ts` + `i18n-context.tsx` - the string dictionaries (en/it/nl) and `useI18n()` / `t()`.
  - `entryTypes.ts` - symptom labels/options and the playful food/activity placeholders.
  - `lock.ts` - voucher-code gate (`UNLOCK_CODE`, stored in localStorage).
  - `pwa.ts` - installed-standalone detection.
  - `use-back-to-close.ts` - wires device/browser Back to close the top overlay. See below.
- **`components/`** - UI building blocks (calendar grid, entry form, bottom nav, filter
  chips/bar, bottom sheets, dialogs, trackers, trigger/symptom lists, photo viewer, lock
  screen, decor).
- **`views/`** - the top-level screens (one per nav tab, plus modals/landing).
- **`assets/`** - hero image + leopard-print SVG tiles (theme treatments).
- **`App.tsx`** - shell: install gate -> lock gate -> tab router + background decor layers.
- **`main.tsx`** - root render; applies the saved theme before first paint, requests
  persistent storage, wraps in providers.

State pattern: the active tab drives the browser history (device Back navigates tabs), and
each view keeps its filter/anchor state in module-level variables so it survives a remount
on tab switch.

Overlays (sheets, dialogs, the fullscreen photo viewer) use `useBackToClose(isOpen, onClose)`:
it pushes a history entry while open so Back closes just that overlay. Overlays may nest (it
uses a shared stack). **Call it from a component that stays mounted while `isOpen` toggles**
(a view, or whatever renders the overlay) - never from the overlay itself with a constant
`isOpen={true}`, which desyncs history under StrictMode.

## Data model - `Entry`
A discriminated union on `entryType` (`'food' | 'activity' | 'symptom'`). Shared fields:
`id` (auto-increment), `date` (`DD-MM-YYYY` grouping key), `time` (`HH:MM` slot start),
`durationMinutes?` (30..720 in 30-min steps; `undefined` on old rows = 30), optional `notes`,
and managed `createdAt` / `updatedAt`.

- **`food`** - `food` (free text), optional `quantity`, `possibleTrigger: boolean`.
- **`activity`** - `activity` (free text), `possibleTrigger: boolean`.
- **`symptom`** - `symptomTypes: SymptomTypeEnum[]` (one or more of heartburn, regurgitation,
  abdominal-pain, nausea, bloating, other).

**Photos:** an optional photo per Food/Activity entry lives in a separate `photos` table
(`{ entryId, blob, createdAt }`), so entry queries stay light; load it lazily by id. Camera
capture only, downscaled via `lib/image.ts`. `deleteEntry` / `clearAllEntries` clear it too.

Dexie schema is at **version 6**; `db.ts` carries the upgrade steps (v2 `symptomType` ->
`symptomTypes[]`, v3 `possibleTrigger`, v4 drop old food sub-kind, v5 `durationMinutes`, v6
`photos` table). Keep adding a new `db.version(n)` with an `.upgrade()` when the shape
changes - never mutate an existing version.

## Views (bottom-nav tabs)
- **Calendar** (`CalendarView`) - week/day 30-min grid; tap a slot to add, tap an entry to
  edit; type filters + a "triggers only" filter. Home tab the app always launches on. Blocks
  are sized to their `durationMinutes` and can spill one block into the next day (12h cap);
  overlapping blocks split into side-by-side columns (`overlapColumns`). The grid loads one
  extra day before the range so a spill-in tail renders.
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

## Launch splash
Two things show the logo at launch, both on white (`#ffffff`, matching the default theme):
- **In-app splash** - the `#splash` overlay in `index.html` (logo pops in, then fades; removed by `main.tsx`). Pure HTML/CSS, shows on every platform.
- **Native iOS splash** - `apple-touch-startup-image` `<link>`s in `index.html` pointing at PNGs in `public/splash/` (logo centred on white, one exact-size image per iPhone resolution). iOS ignores any whose `media` query doesn't match the device exactly.

To regenerate the iOS PNGs after changing `public/favicon.svg`: `pnpm add -D sharp`, run the script below, replace the startup-image tags in `index.html` with its printed output, then `pnpm remove sharp`.

```js
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'
const BG = '#ffffff', svg = readFileSync('public/favicon.svg')
mkdirSync('public/splash', { recursive: true })
// [cssW, cssH, dpr] for the recent iPhone lineup (portrait).
const devices = [[320,568,2],[375,667,2],[414,736,3],[375,812,3],[414,896,2],[414,896,3],[390,844,3],[428,926,3],[393,852,3],[430,932,3],[402,874,3],[440,956,3]]
for (const [cw, ch, dpr] of devices) {
  const pw = cw*dpr, ph = ch*dpr, logo = Math.round(Math.min(pw, ph) * 0.4)
  const l = await sharp(svg, { density: 384 }).resize(logo, logo).png().toBuffer()
  await sharp({ create: { width: pw, height: ph, channels: 4, background: BG } })
    .composite([{ input: l, gravity: 'center' }]).png().toFile(`public/splash/apple-splash-${pw}-${ph}.png`)
  console.log(`<link rel="apple-touch-startup-image" media="(device-width: ${cw}px) and (device-height: ${ch}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)" href="%BASE_URL%splash/apple-splash-${pw}-${ph}.png" />`)
}
```

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
- **Comments only when necessary.** Don't restate an obvious name; comment the non-obvious (invariants, back-compat defaults, why-not-what). Match the file's existing light comment density.
- **Token efficiency.** Read relevant files, and keep your output simple.
