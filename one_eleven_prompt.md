# Design brief: "11:11" theme for EtasEats

## What you're designing
EtasEats is an offline-first personal food & symptom diary - a small, playful birthday
gift for one person. I need you to design ONE named visual theme, "11:11", for an existing
React app. You are NOT redesigning the layout or the features - the structure, components and
screens are fixed. You are designing the LOOK of this one theme: colours, font,
background/accent treatment, a recurring heart-clock motif, per-component styling, and a
little tasteful motion. Screenshots of every screen in the current default theme are attached
for reference (see "Attached screenshots" below).

## The meaning (please honour this - it's the heart of the theme)
11:11 is the couple's favourite time of day. At 11:11 they send each other a single light-blue
heart - 🩵 - just to say "thinking of you". The light-blue heart is the symbol of their love.
A reference image is attached (`11_11.png`): a flowing, marbled watercolour of **blue waves** -
deep denim blue, soft powder blue, and pale white/cream ribbons - with a single thin **white
line-art heart** in the centre whose minimalist clock hands point to 11:11 (a small centre
dot). That image is the mood and palette source.

Desired feeling: **cutesy, minimal, classy, modern - romantic and calm, but NOT cheesy.**
Restrained and elegant, never saccharine.

## Reference palette (from the photo - refine as you see fit)
Soft blues on pale/white, e.g. deep denim blue ~`#3C6B9E`, mid blue ~`#6D9BC9`, powder blue
~`#A9C7E0`, pale ice ~`#DCE8F2`, off-white/cream ~`#F4F1EA`, white `#FFFFFF`, and a light-blue
"heart" accent ~`#A3D5E8` (the 🩵). These are a starting point - give me final, refined hexes.

## Overall tone: blue-immersive, but keep it calm and readable
Go **blue-immersive**: blue-dominant surfaces with white/pale text and white line-art detail
(like the photo). BUT the marbled-wave pattern is **accent-only, not wallpaper** - use it as a
hero on a splash/About moment and as subtle accents (header strips, sheet tops), and keep it
**off the calendar grid**. The calendar should sit on a calm, solid or very-soft blue surface
so the small entry chips and grid lines stay clearly legible. Immersion should come from the
blue surfaces and gentle gradients, not from a busy pattern behind dense content.

## The heart-clock (11:11) motif - use sparingly
Incorporate the thin white line-art heart with 11:11 clock hands as a quiet signature. Good
candidate spots (pick a couple, DON'T use it everywhere - restraint is the point):
- a hero emblem on a splash/launch moment and the About screen,
- a faint watermark behind a header or screen background,
- a small touch on the FAB / key buttons (the heart, or a hint of it).
(Not every screen. Keep it special.)

## Entry-type colours (keep the three types distinguishable)
The calendar shows three entry types that MUST be told apart at a glance in the grid: Food,
Activity, Symptom. On a blue-immersive theme this is the tricky part: give each a distinct,
legible accent that harmonises with the blue palette (e.g. shades within the blue/teal family
plus one warmer contrast for Symptom) while staying clearly distinguishable from each other and
readable as small chips. Give me bg / text / border for each of the three types.

## Target device (design to these exact constraints)
- Installed PWA on **iPhone 15, iOS Safari, standalone/full-screen** (no browser chrome).
- Logical viewport **393 x 852 CSS px**, device-pixel-ratio **3x** (so 1179 x 2556 physical).
  Design mobile-portrait only; the app is locked to portrait.
- Respect iOS **safe areas**: a top inset (~59px, Dynamic Island) and a bottom home-indicator
  inset (~34px). The bottom nav sits above the bottom inset; the FAB floats above it.
- Touch-first: tap targets comfortably large; everything readable at arm's length outdoors.

## Hard technical constraints (so the design is actually shippable)
- Free, offline-first, deployed to GitHub Pages. **No paid assets, no external runtime
  fetches.** The marbled-wave accent and the heart-clock motif should be implementable in
  **pure CSS / inline SVG** (the wave as a soft gradient or an SVG shape; the heart-clock as a
  thin-stroke inline SVG). If anything genuinely needs a small raster image, say so explicitly
  and keep it small and tileable.
- Fonts: currently just CSS font-family stacks. Please recommend a **free Google Font** that
  fits "cutesy, minimal, classy, modern, not cheesy" - likely a refined light sans or an
  elegant modern serif - with a fallback stack. Body text must stay readable at small sizes.
- Styling is React + Tailwind v4. Theme colours are applied at runtime as CSS custom
  properties on :root, and read in components via inline styles. So any colour you give me
  maps to a named variable (list below). I CAN add new variables / small per-theme
  functions/components if a treatment needs more than a flat colour (wave accent layer,
  gradient, watermark, the heart-clock SVG). Tell me when you're introducing something beyond a
  flat colour and how to build it.

## The exact themeable surface (map your palette to THESE names)
Each of these is one colour today. Give me a hex (or a described treatment) for each:

  primaryAction     - FAB, Save button, active toggles, "today" marker, Yes switch
  appBg             - whole-app background  (calm blue surface; wave pattern only as accent)
  foodEntryBg / foodEntryText / foodEntryBorder         - Food entries (distinct accent)
  activityEntryBg / activityEntryText / activityEntryBorder  - Activity entries (distinct accent)
  symptomEntryBg / symptomEntryText / symptomEntryBorder     - Symptom entries (distinct accent)
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

NOTE on contrast: the 🩵 light blue is the emotional accent, but a very pale blue can be
low-contrast for a CTA. Feel free to use a deeper blue for high-impact actions (FAB/Save) and
reserve the light-blue heart as the symbolic/decorative accent - your call, just keep CTAs
legible.

## Attached screenshots (current default theme)
All are iPhone-portrait captures of the live app. Filenames:
- `calendar_view.png` - the Calendar (Week view time grid, filter chips, FAB). The
  readability-critical screen.
- `entry_form.png` - the create/edit Entry form bottom sheet.
- `entry_details_sheet.png` - the read-only entry detail sheet (opened from Triggers).
- `trigger_tab_last_symptoms.png` - Triggers view, "Last Symptoms" sub-tab (timeline cards).
- `trigger_tab_trigger_list.png` - Triggers view, "Trigger List" sub-tab.
- `settings.png` - the Settings screen (incl. the Theme picker and Danger Area).
- `11_11.png` - the mood/palette reference (blue marbled waves + white heart-clock at 11:11).
(The bottom nav bar is visible along the bottom of most of the app screenshots.)

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

## Motion (a few subtle, tasteful touches)
Include a small amount of gentle, dreamy motion - nothing distracting, easy on battery. Think:
a very slow drift/shimmer on the wave accent areas, a soft pulse or glow on the heart motif,
and the smooth sliding highlights the app's toggles already use. Keep it calm and romantic.
Describe each animation concretely enough to build in CSS (transitions/keyframes), and note
anything that should respect prefers-reduced-motion.

## What to give me back (output format)
1. A short description of the overall concept/mood.
2. A **filled-in table of every variable name above -> exact hex** (or "see treatment #n"
   for anything that isn't a flat colour).
3. The **font** recommendation (specific free Google Font + fallback stack).
4. **Treatments**: for each non-flat element (wave accent layer, any gradient, the heart-clock
   SVG + where it's used, watermark), describe it concretely enough to build - ideally with the
   CSS/SVG approach - and flag if any needs a raster asset.
5. **Per-screen notes**: anything screen-specific (how the calendar stays calm and readable,
   nav treatment, FAB, sheet headers, pill styling, where the heart-clock appears, the Settings
   theme-card for this theme).
6. Any **motion** suggestions, each described as implementable CSS.
7. Call out anything that needs a NEW variable or small component beyond the list above.

Make it genuinely tender and beautiful - this is a love-letter theme built around 11:11 and the
🩵 - but keep it minimal, classy, and fully readable and tappable on the iPhone 15.
