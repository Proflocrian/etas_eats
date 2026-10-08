# Design brief: "EtasEats" (default) theme - UberEats look-alike

## What you're designing
EtasEats is an offline-first personal food & symptom diary - a small, playful birthday
gift for one person. The app's name is a play on UberEats ("Eta's Eats"), and this is the
**default theme**, so it should feel like the clean, polished baseline. I need you to design
this ONE named theme, "EtasEats", for an existing React app to **look like the UberEats
mobile app**. You are NOT redesigning the layout or the features - the structure, components
and screens are fixed. You are designing the LOOK: colours, font, surface/card styling,
per-component styling, and a little tasteful motion. Screenshots of every screen in the
current (pre-redesign) default theme are attached for reference (see "Attached screenshots").

Aesthetic direction: **clean, modern, high-contrast, app-like UberEats** - crisp white
surfaces, bold black text, Uber green reserved for high-impact calls-to-action (FAB, Save,
active toggles), generous whitespace, rounded cards and pill buttons, clear hierarchy. Not
maximalist, not decorative - polished and legible. The calendar is a dense time-grid, so keep
it especially clean and scannable.

## Brand palette (use these exactly where brand colour applies)
- **Uber Eats Green** `#06C167` - reserved for high-impact elements / key CTAs (FAB, Save,
  active toggle, today marker). Do not overuse; it should pop.
- **Black** `#000000` - text, key UI.
- **White** `#FFFFFF` - surfaces / backgrounds.
Supporting neutrals (greys for borders, secondary text, idle states) are welcome, matching the
Uber app's clean greyscale.

## Entry-type colours (important - keep types distinguishable)
The calendar shows three entry types that MUST be told apart at a glance in the grid:
- **Food = Uber green `#06C167`** (bg/text/accent tuned so green-on-white chips read well).
- **Activity** and **Symptom** each get a tasteful **on-brand complementary accent** that
  still feels Uber-clean (your choice of two colours - e.g. a neutral/ink tone and a warm
  alert tone - that sit beside green without clashing). They must be clearly distinct from
  each other and from green, and legible as small chips on the grid.
Give me bg / text / border for each of the three types.

## Target device (design to these exact constraints)
- Installed PWA on **iPhone 15, iOS Safari, standalone/full-screen** (no browser chrome).
- Logical viewport **393 x 852 CSS px**, device-pixel-ratio **3x** (so 1179 x 2556 physical).
  Design mobile-portrait only; the app is locked to portrait.
- Respect iOS **safe areas**: a top inset (~59px, Dynamic Island) and a bottom home-indicator
  inset (~34px). The bottom nav sits above the bottom inset; the FAB floats above it.
- Touch-first: tap targets comfortably large; everything readable at arm's length outdoors.

## Hard technical constraints (so the design is actually shippable)
- Free, offline-first, deployed to GitHub Pages. **No paid assets, no external runtime
  fetches.**
- Fonts: UberEats uses "Uber Move" (proprietary, not free). Please recommend the closest
  **free Google Font** - a clean geometric/neo-grotesque sans that reads like Uber Move -
  with a fallback stack. It can be used app-wide since the look is clean.
- Styling is React + Tailwind v4. Theme colours are applied at runtime as CSS custom
  properties on :root, and read in components via inline styles. So any colour you give me
  maps to a named variable (list below). I CAN add new variables / small per-theme touches if
  something needs more than a flat colour (e.g. a subtle card shadow, a gradient on a CTA) -
  tell me when you're introducing something beyond a flat colour and how to build it.

## The exact themeable surface (map your palette to THESE names)
Each of these is one colour today. Give me a hex (or a described treatment) for each:

  primaryAction     - FAB, Save button, active toggles, "today" marker, Yes switch  (Uber green)
  appBg             - whole-app background  (likely white or a very light Uber grey)
  foodEntryBg / foodEntryText / foodEntryBorder         - Food entries (green)
  activityEntryBg / activityEntryText / activityEntryBorder  - Activity entries (on-brand accent)
  symptomEntryBg / symptomEntryText / symptomEntryBorder     - Symptom entries (on-brand accent)
  allPillBorder     - "All" filter chip accent border
  triggerPillBorder - trigger filter chip accent + "Possible Trigger?" switch accent
  pillBg            - constant background of every pill/chip
  pillBorderIdle    - border of an unselected pill/chip
  navFont           - bottom-nav label, unselected
  navSelectedFont   - bottom-nav label, selected
  navBg             - bottom-nav bar background
  fabBg             - floating add-button background
  settingsButtonBg  - settings rows / cards background
  sheetBg           - bottom-sheet + dialog background
  font              - app-wide font-family stack

## Attached screenshots (current default theme)
All are iPhone-portrait captures of the live app. Filenames:
- `calendar_view.png` - the Calendar (Week view time grid, filter chips, FAB). The
  readability-critical screen.
- `entry_form.png` - the create/edit Entry form bottom sheet.
- `entry_details_sheet.png` - the read-only entry detail sheet (opened from Triggers).
- `trigger_tab_last_symptoms.png` - Triggers view, "Last Symptoms" sub-tab (timeline cards).
- `trigger_tab_trigger_list.png` - Triggers view, "Trigger List" sub-tab.
- `settings.png` - the Settings screen (incl. the Theme picker and Danger Area).
(The bottom nav bar is visible along the bottom of most of these.)

## The screens you're theming (shown in the attached screenshots)
1. Calendar (Week + Day) [`calendar_view.png`] - a vertical 48-row half-hour time grid. Top
   row: prev/next arrows, month label, "Today", a sliding Week/Day toggle. Second row: filter
   chips (an "All" chip, three entry-type emoji chips, a trigger flag chip). Entries are small
   colour chips placed in their time slot, with a coloured left accent; flagged ones show a
   flag. A round FAB (+) floats bottom-right. THIS IS THE READABILITY-CRITICAL SCREEN.
2. Entry form [`entry_form.png`] - a bottom sheet (~2/3 height) that slides up: type pills,
   date + time-slot inputs, variant fields (food/activity text, or multi-select symptom
   pills), a No/Yes "Possible Trigger?" flip-switch, notes, and Save. Swipe-down to dismiss.
3. Triggers [`trigger_tab_last_symptoms.png`, `trigger_tab_trigger_list.png`,
   `entry_details_sheet.png`] - two sub-tabs ("Last Symptoms" timeline cards, and a "Trigger
   List"); tapping a row opens a read-only detail sheet.
4. Settings [`settings.png`] - sectioned list: a Theme picker (card per theme with colour
   swatches), and other rows/cards. Plus a red "Danger Area".
5. Bottom nav - sticky 4-tab bar (Calendar / Triggers / Settings / About) with emoji + label.
6. Shared bits: rounded pills/chips (border shows selection), flip-switches with a sliding
   highlight, bottom sheets.

## Surface & layout treatment (keep it Uber-clean)
This theme is about polish, not decoration. Lean into: white/very-light surfaces, crisp black
typography with clear weight hierarchy, Uber green reserved for CTAs, pill-shaped buttons,
rounded cards with subtle shadows/dividers, and generous spacing. Keep the calendar grid light
and legible (clean grid lines, high-contrast chips). Describe the card/shadow/border styling
you want for the sheets, Settings cards, and Triggers cards.

## Motion (a few subtle, tasteful touches)
Include a small amount of clean, app-like motion - nothing flashy, and easy on battery. Think:
button press/active states, the smooth sliding highlights the app's toggles already use, and a
subtle Save confirmation. Describe each animation concretely enough to build in CSS
(transitions/keyframes), and note anything that should respect prefers-reduced-motion.

## What to give me back (output format)
1. A short description of the overall concept/mood.
2. A **filled-in table of every variable name above -> exact hex** (or "see treatment #n"
   for anything that isn't a flat colour).
3. The **font** recommendation (specific free Google Font + fallback stack).
4. **Treatments**: for any non-flat element (card shadows, CTA gradient if any, dividers),
   describe it concretely enough to build - ideally with the CSS approach - and flag if any
   needs a raster asset.
5. **Per-screen notes**: anything screen-specific (how the calendar stays clean and readable,
   nav treatment, FAB, sheet headers, pill styling, the Settings theme-card for this theme).
6. Any **motion** suggestions, each described as implementable CSS.
7. Call out anything that needs a NEW variable or small component beyond the list above.

Make it look like a polished UberEats-quality app - clean, confident, high-contrast - while
staying fully readable and tappable on the iPhone 15.
