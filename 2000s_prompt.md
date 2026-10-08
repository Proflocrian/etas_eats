# Design brief: "Trashy 2000s" theme for EtasEats

## What you're designing
EtasEats is an offline-first personal food & symptom diary - a small, playful birthday
gift for one person. I need you to design ONE named visual theme, "Trashy 2000s", for an
existing React app. You are NOT redesigning the layout or the features - the structure,
components and screens are fixed. You are designing the LOOK of this one theme: colours,
font, background/pattern/texture treatment, per-component styling, and a little tasteful
motion. Screenshots of every screen in the current default theme are attached for
reference (see "Attached screenshots" below).

Muse / reference: **mid-2000s "Posh" Victoria Beckham glam** - tanned, famous, expensive,
oversized-sunglasses energy - but executed as **full trashy Y2K**: loud, bedazzled, fun.
Think gossip-mag, flip-phone, MySpace-glitter era filtered through a girly bling lens.

Aesthetic direction: **maximalist and trashy-glam, but the app must stay fully usable.**
Go loud on chrome, surfaces, sheets and accents - but the calendar is a dense time-grid, so
the grid area itself must stay legible (small text chips in 30-minute rows).

Colour world: **bling bubblegum pink** - hot/bubblegum pink as the hero, with holographic
and baby-blue support and sparkly accents. Girly, loud, 2000s.

Signature motifs to draw on (use tastefully, not all at once everywhere):
- **Rhinestone / diamante bling** - sparkly gem accents, bedazzled edges, sparkle on key bits.
- **Juicy-Couture velour + script** - a plush velour texture feel and a cursive/script display
  font (tracksuit-on-the-butt energy).
- **Stars & sparkles** - Y2K star motifs and twinkle accents as decoration.
(No heavy chrome/metallic look - keep it pink-girly-sparkly, not futuristic-chrome.)

## Target device (design to these exact constraints)
- Installed PWA on **iPhone 15, iOS Safari, standalone/full-screen** (no browser chrome).
- Logical viewport **393 x 852 CSS px**, device-pixel-ratio **3x** (so 1179 x 2556 physical).
  Design mobile-portrait only; the app is locked to portrait.
- Respect iOS **safe areas**: a top inset (~59px, Dynamic Island) and a bottom home-indicator
  inset (~34px). The bottom nav sits above the bottom inset; the FAB floats above it.
- Touch-first: tap targets comfortably large; everything readable at arm's length outdoors.

## Hard technical constraints (so the design is actually shippable)
- Free, offline-first, deployed to GitHub Pages. **No paid assets, no external runtime
  fetches.** Patterns/textures should be implementable in **pure CSS** (gradients / inline
  SVG / small embedded SVG data-URI) wherever possible. If a texture (velour, glitter) or
  motif genuinely needs a raster image, say so explicitly and keep it small and tileable.
- Fonts: currently just CSS font-family stacks. I CAN add a **Google Font** (loaded via
  stylesheet) for this theme - please suggest a specific display/script font (something with
  that Y2K cursive/Juicy energy) plus a readable fallback stack. Body text still needs to be
  readable at small sizes, so the loud font may be for headers/accents only.
- Styling is React + Tailwind v4. Theme colours are applied at runtime as CSS custom
  properties on :root, and read in components via inline styles. So any colour you give me
  maps to a named variable (list below). I CAN add new variables and small per-theme
  functions/components if a treatment needs more than a flat colour (e.g. a patterned/textured
  background layer, a gradient, a sparkle, a bedazzled border). Tell me when you're introducing
  something beyond a flat colour and how to build it.

## The exact themeable surface (map your palette to THESE names)
Each of these is one colour today. Give me a hex (or a described treatment) for each:

  primaryAction     - FAB, Save button, active toggles, "today" marker, Yes switch
  appBg             - whole-app background  (good candidate for a subtle texture/pattern)
  foodEntryBg / foodEntryText / foodEntryBorder         - Food entries: chip bg/text/left-accent
  activityEntryBg / activityEntryText / activityEntryBorder  - Activity entries (same roles)
  symptomEntryBg / symptomEntryText / symptomEntryBorder     - Symptom entries (same roles)
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

## Where to put the bling / texture
Use your judgment on where actual texture and bling (vs. just colour) appears for the best
trashy-glam result - e.g. a subtle velour or glitter **app background**, bedazzled/rhinestone
borders on key buttons, sparkle on the FAB and Save, star accents in the chrome. Just keep the
calendar grid legible: if the background is textured, specify how you keep entry chips and grid
lines readable over it (e.g. a faded/low-contrast texture behind the grid, or a semi-opaque
scrim, or confining the loud stuff to the margins/chrome).

## Motion (a few subtle, tasteful touches)
Include a small amount of tasteful motion - nothing distracting, and easy on battery (this
runs on-device all day). Think along the lines of: a sparkle/twinkle on the Save button, a
gentle shimmer on the FAB, a soft glitter sheen passing over a surface, plus the smooth
sliding highlights the app's toggles already use. Keep it subtle and fun, not seizure-y.
Describe each animation concretely enough to build in CSS (transitions/keyframes), and note
anything that should respect prefers-reduced-motion.

## What to give me back (output format)
1. A short description of the overall concept/mood.
2. A **filled-in table of every variable name above -> exact hex** (or "see treatment #n"
   for anything that isn't a flat colour).
3. The **font** recommendation (specific name + Google Font yes/no + fallback stack; note if
   the loud font is headers-only vs. app-wide).
4. **Treatments**: for each non-flat element (background texture/pattern, any gradient,
   bedazzled/rhinestone borders, glitter/sparkle, star motifs), describe it concretely enough
   to build - ideally with the CSS approach (gradient stops, or an inline-SVG motif I can
   tile), and flag if any needs a raster asset.
5. **Per-screen notes**: anything screen-specific (how the calendar stays readable, nav
   treatment, FAB, sheet headers, pill styling, the Settings theme-card for this theme).
6. Any **motion** suggestions, each described as implementable CSS.
7. Call out anything that needs a NEW variable or small component beyond the list above.

Make it genuinely fun and bedazzled - this is a gift and she loves the trashy 2000s look. But
everything must stay readable and tappable on the iPhone 15.
