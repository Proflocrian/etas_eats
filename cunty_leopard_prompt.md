# Design brief: "Cunty Leopard" theme for EtasEats

## What you're designing
EtasEats is an offline-first personal food & symptom diary - a small, playful birthday
gift for one person (she loves leopard print). I need you to design ONE named visual
theme, "Cunty Leopard", for an existing React app. You are NOT redesigning the layout or
the features - the structure, components and screens are fixed. You are designing the
LOOK of this one theme: colours, font, background/pattern treatment, per-component
styling, and a little tasteful motion. Screenshots of every screen in the current
default theme are attached for reference (see "Attached screenshots" below).

Aesthetic direction: **maximalist glam, but the app must stay fully usable.** Go bold and
fierce ("cunty") on chrome, surfaces, sheets and accents - but the calendar is a dense
time-grid, so the grid area itself must stay legible (small text chips in 30-minute rows).

Colour world: **classic natural leopard** - tan, caramel, golden-brown, chocolate/espresso
spots and black outlines, over a warm cream background. Elegant and timeless, not neon.
Metallic gold accents are welcome. (Avoid pink-forward; keep it the natural leopard palette.)

## Target device (design to these exact constraints)
- Installed PWA on **iPhone 15, iOS Safari, standalone/full-screen** (no browser chrome).
- Logical viewport **393 x 852 CSS px**, device-pixel-ratio **3x** (so 1179 x 2556 physical).
  Design mobile-portrait only; the app is locked to portrait.
- Respect iOS **safe areas**: a top inset (~59px, Dynamic Island) and a bottom home-indicator
  inset (~34px). The bottom nav sits above the bottom inset; the FAB floats above it.
- Touch-first: tap targets comfortably large; everything readable at arm's length outdoors.

## Hard technical constraints (so the design is actually shippable)
- Free, offline-first, deployed to GitHub Pages. **No paid assets, no external runtime
  fetches.** Patterns should be implementable in **pure CSS** (gradients / inline SVG /
  small embedded SVG data-URI) wherever possible. If a leopard pattern genuinely needs a
  raster image, say so explicitly and keep it small and tileable.
- Fonts: currently just CSS font-family stacks. I CAN add a **Google Font** (loaded via
  stylesheet) for this theme if you recommend one - please suggest a specific glam display
  or elegant font and a fallback stack. Body text still needs to be readable at small sizes.
- Styling is React + Tailwind v4. Theme colours are applied at runtime as CSS custom
  properties on :root, and read in components via inline styles. So any colour you give me
  maps to a named variable (list below). I CAN add new variables and small per-theme
  functions/components if a treatment needs more than a flat colour (e.g. a patterned
  background layer, a gradient, a shimmer). Tell me when you're introducing something beyond
  a flat colour and how to build it.

## The exact themeable surface (map your palette to THESE names)
Each of these is one colour today. Give me a hex (or a described treatment) for each:

  primaryAction     - FAB, Save button, active toggles, "today" marker, Yes switch
  appBg             - whole-app background  (best candidate for a leopard pattern)
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

## Where to put the leopard print
Use your judgment on where actual PRINT (vs. just colour) appears for the best maximalist-glam
result - I lean toward a leopard **app background** as the hero, but you decide the full set
(nav, FAB, sheet headers, cards, chips...). Just keep the calendar grid legible: if the
background is patterned, specify how you keep entry chips and grid lines readable over it
(e.g. a faded/low-contrast pattern behind the grid, or a semi-opaque scrim, or confining the
bold print to the margins/chrome).

## Motion (a few subtle, tasteful touches)
Include a small amount of tasteful motion - nothing distracting, and easy on battery (this
runs on-device all day). Think along the lines of: a gold shimmer or sparkle on the Save
button, a gentle pulse/shine on the FAB, a soft sheen passing over a leopard surface, plus
the smooth sliding highlights the app's toggles already use. Keep it subtle and glam, not
busy. Describe each animation concretely enough to build in CSS (transitions/keyframes), and
note anything that should respect prefers-reduced-motion.

## What to give me back (output format)
1. A short description of the overall concept/mood.
2. A **filled-in table of every variable name above -> exact hex** (or "see treatment #n"
   for anything that isn't a flat colour).
3. The **font** recommendation (specific name + Google Font yes/no + fallback stack).
4. **Treatments**: for each non-flat element (background pattern, any gradient, print areas,
   shimmer/metallic effects), describe it concretely enough to build - ideally with the CSS
   approach (gradient stops, or an inline-SVG leopard-spot motif I can tile), and flag if any
   needs a raster asset.
5. **Per-screen notes**: anything screen-specific (how the calendar stays readable, nav
   treatment, FAB, sheet headers, pill styling, the Settings theme-card for this theme).
6. Any **motion** suggestions, each described as implementable CSS.
7. Call out anything that needs a NEW variable or small component beyond the list above.

Make it genuinely fierce and beautiful - this is a gift and she loves leopard. But everything
must stay readable and tappable on the iPhone 15.
