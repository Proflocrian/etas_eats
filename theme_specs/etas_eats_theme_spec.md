# EtasEats theme spec (default theme)

Target: iPhone 15 PWA, 393×852 CSS px, @3x, portrait, iOS safe areas.

## 01 · Concept

White surfaces, black type, one green. Everything structural is greyscale: filled grey pills, grey inputs, hairline dividers. Green appears only where she should act (the FAB, Save, today). Black handles selection and state. Activity and Symptom get a clear blue and a warm orange so the three types separate at a glance on the grid.

## 02 · Variables

| Variable | Value | Note |
|---|---|---|
| primaryAction | `#06C167` | FAB, Save, today marker. Pair with black text/icons (`onPrimary`). |
| appBg | `#FFFFFF` | Pure white everywhere. |
| foodEntryBg | `#E7F8EF` | Green tint |
| foodEntryText | `#05683A` | Deep green, 6.4:1 on bg |
| foodEntryBorder | `#06C167` | Brand green accent |
| activityEntryBg | `#EAF0FE` | Cool blue tint |
| activityEntryText | `#1A4BB0` | Ink blue, 6.9:1 |
| activityEntryBorder | `#276EF1` | Clear blue accent |
| symptomEntryBg | `#FFF0E6` | Warm peach tint |
| symptomEntryText | `#A83A00` | Burnt orange, 6.0:1 |
| symptomEntryBorder | `#FF7A1A` | Warm orange accent |
| allPillBorder | `#000000` | Black: selection reads as "on" without spending green. |
| triggerPillBorder | `#E11900` | Flag red: flag chip + Yes thumb on trigger switches. |
| pillBg | `#F3F3F3` | Filled grey pill. |
| pillBorderIdle | `#F3F3F3` | Same as pillBg, so idle pills look borderless; selected gets a 2px coloured ring. |
| navFont | `#6B6B6B` | Grey, 5.3:1 |
| navSelectedFont | `#000000` | Black, weight 700 |
| navBg | `#FFFFFF` | White + 1px `#EEEEEE` top hairline |
| fabBg | `#06C167` | Green + coloured shadow (treatment #3) |
| settingsButtonBg | `#F6F6F6` | Light grey filled cards on white (no shadow). |
| sheetBg | `#FFFFFF` | White; rounded top + shadow (treatment #2) |
| font | see below | `"Figtree Variable", "Figtree", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif` |

**Entry types on the grid:** text-on-bg contrast is food 6.4:1, activity 6.9:1, symptom 6.0:1. The three hues sit roughly 120° apart (green / blue / orange), so they stay distinct for most colour-vision types; the 3px left accent adds a second cue.

## 03 · Font: Figtree

A free (OFL) geometric grotesque. It has flat terminals, a big x-height and a heavy 800 weight. That brings it close to Uber Move's compact, confident headlines, and it stays open at 11px. Runner-up: DM Sans.

Bundle it so there's no runtime fetch (works offline on GitHub Pages):

```bash
npm i @fontsource-variable/figtree
```

```ts
// main.tsx
import '@fontsource-variable/figtree';
```

Type scale:

| Role | Size / weight | Example |
|---|---|---|
| Large title | 34 / 800, letter-spacing -0.03em | Settings |
| Header | 20 / 800, -0.02em | Oct 26 |
| Section | 18 / 800 | Data & Support |
| Sheet title | 17 / 700 | New entry |
| Body | 16 / 600 | Chocolate |
| Meta | 13 / 500, `#6B6B6B` | 3h before · 13:30 |
| Chip / nav | 11 / 700 | Cocktails |

Use `font-variant-numeric: tabular-nums` on times, dates and the hour gutter so columns don't jitter.

## 04 · Treatments

All pure CSS. No gradients, no raster assets.

**#1 Content card (Triggers cards).** White card on the white app bg, separated by a hairline and a soft two-layer shadow. Radius 16, padding 16. Rows inside use `#EEEEEE` dividers; the last row has none.

```css
background: #fff;
border: 1px solid #EEEEEE;
border-radius: 16px;
box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 4px 14px rgba(0,0,0,.06);
```

**#2 Bottom sheet + dialog.** Rounded top corners, upward shadow, 40% black scrim, grabber pill. Header: a 40px grey circular close button, a centred 17/700 title and a Save pill on the right.

```css
border-radius: 20px 20px 0 0;
box-shadow: 0 -8px 32px rgba(0,0,0,.14);
/* scrim */   background: rgba(0,0,0,.40);
/* grabber */ width: 36px; height: 5px; border-radius: 3px; background: #D6D6D6;
```

**#3 FAB.** A 58px green circle with a black plus (3px stroke). The green-tinted shadow lifts it off the grid without a dark blob.

```css
width: 58px; height: 58px; border-radius: 50%;
background: var(--fabBg); color: #000;
box-shadow: 0 6px 16px rgba(6,193,103,.32), 0 2px 4px rgba(0,0,0,.10);
right: 16px; bottom: calc(49px + env(safe-area-inset-bottom) + 16px);
```

**#4 Filled inputs.** No borders at rest: `#F3F3F3` fill, radius 12, height 50. On focus the field turns white with a 2px black inset ring. 16px text prevents iOS zoom-on-focus.

```css
background: #F3F3F3; border: 0; border-radius: 12px; height: 50px; font-size: 16px;
:focus { background: #fff; box-shadow: inset 0 0 0 2px #000; outline: none; }
```

**#5 Lines & grid.** Hour lines are slightly darker than half-hour lines, so hours read as structure and half-hours barely register.

```
divider:             #EEEEEE
grid hour line:      #EBEBEB
grid half-hour line: #F6F6F6
grid column line:    #F2F2F2
```

## 05 · Per-screen notes

- **Calendar:** grid lines are near-white so the chips carry all the contrast. Chips are 11/700 with a 3px left accent and radius 6; Day view widens them and adds the time range. Hour labels sit in a 44px gutter at 11/500 grey, tabular. Day headers: uppercase 11px weekday, 16/700 date; today is a 30px green disc with a black numeral. Week/Day is a black-thumb segmented control on a grey track.
- **Filter chips:** all grey filled pills (`pillBg`). Selected = a 2px ring in that chip's meaning colour: black for All, the type colour for each type, red for the flag. Thin `#E2E2E2` vertical dividers between groups.
- **Entry form:** the sheet is ~580px tall. Save stays disabled grey (`#EEEEEE` / `#A6A6A6`) until the required field is filled, then turns green with black text. Type pills reuse the filter-chip styling. Labels are 14/700 black; "(optional)" is grey 500.
- **Switches:** grey track with a sliding thumb. No = black thumb, Yes = flag-red thumb. The label on the thumb is white; the other label is grey. The same component appears in the form, the detail sheet and the Triggers rows (compact 96×32 in rows).
- **Triggers:** the top sub-tabs use the same segmented control as Week/Day, full width. Symptom card titles are `symptomEntryText` at 17/800. Trigger List is a grouped grey list (like Settings) with dots and chevrons; tapping a row opens the detail sheet.
- **Settings:** 34/800 large title, 18/800 black section headers. Theme cards are grey filled; the active one gets a 2px black border and a black check disc. EtasEats swatches: green, black, blue, orange, red. Each grouped list is one grey card with `#EAEAEA` internal dividers. Danger Area: red header, `#FFF0EE` row, `#C21500` text.
- **Bottom nav:** white, 1px `#EEEEEE` top hairline, no shadow. 49px bar + `env(safe-area-inset-bottom)`. Emoji 22px; labels 11px, grey 600 when idle, black 700 when selected. No pill or underline; weight and colour are enough.

## 06 · Motion

Animate transform and opacity only. They're cheap to render and easy on the battery.

**Press feedback.** Every tappable pill, button and row scales down slightly on press. The FAB goes a touch further.

```css
.tap { transition: transform 120ms cubic-bezier(.2,.8,.2,1), background-color 120ms; }
.tap:active { transform: scale(.96); }
.fab:active { transform: scale(.92); }
.row:active { background: #EDEDED; }
```

**Sliding thumbs.** In the segmented controls and No/Yes switches, the thumb slides with a slightly springy ease and the label colours crossfade.

```css
.thumb { transition: transform 240ms cubic-bezier(.3,.7,.2,1), background-color 200ms; }
.label { transition: color 200ms; }
```

**Sheet open/close.** The sheet slides up from `translateY(100%)` with an iOS-like decelerate while the scrim fades in. While dragging, set `transition: none` and follow the finger. On release, restore the transition and snap.

```css
.sheet { transition: transform 320ms cubic-bezier(.32,.72,0,1); }
.scrim { transition: opacity 240ms ease; }
```

**Pill selection.** The ring colour fades in instead of snapping.

```css
.pill { transition: border-color 150ms ease, transform 120ms; }
```

**Save confirmation.** The label swaps to "✓ Saved" and the button pops once. The sheet closes ~450ms later, then the new chip fades and scales into its slot.

```css
@keyframes save-pop { 0% { transform: scale(1) } 40% { transform: scale(1.06) } 100% { transform: scale(1) } }
.save.done { animation: save-pop 280ms cubic-bezier(.2,.8,.2,1); }

@keyframes chip-in { from { opacity: 0; transform: scale(.9) } to { opacity: 1; transform: none } }
.chip.new { animation: chip-in 220ms ease-out; }
```

**Reduced motion.** Remove the scale and slide effects. Keep the sheet as a quick fade, and keep the "✓ Saved" label swap so the confirmation still reads.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition-duration: 1ms !important; }
  .sheet { transform: none !important; transition: opacity 150ms !important; }
}
```

## 07 · New variables

These values are hard-coded or derived today. Adding them as per-theme variables won't affect other themes, as long as each theme defines the same keys.

| Variable | Value | Note |
|---|---|---|
| onPrimary | `#000000` | Text/icon on green (Save label, FAB +, today numeral). White on `#06C167` is only 2.5:1; black is 8.4:1, much better outdoors. |
| textPrimary | `#000000` | Body + headings |
| textSecondary | `#6B6B6B` | Meta, hour labels, "3h before" (5.3:1) |
| segmentActiveBg / segmentActiveText | `#000000` / `#FFFFFF` | Week/Day + Triggers tabs. If you'd rather not add it, `primaryAction` works, but black keeps green rare. |
| switchNoBg | `#000000` | No thumb (Yes uses `triggerPillBorder`) |
| inputBg | `#F3F3F3` | Filled inputs, switch + segment tracks (treatment #4) |
| primaryActionDisabled | `#EEEEEE` / `#A6A6A6` | Disabled Save bg / text |
| divider | `#EEEEEE` | Hairlines, nav top border; grid lines per treatment #5 |
| cardShadow | see #1 | Box-shadow string, not a colour |
| sheetShadow / scrim | see #2 | Box-shadow string + `rgba(0,0,0,.40)` |
| danger / dangerBg | `#C21500` / `#FFF0EE` | Danger Area text + row (`#E11900` for the section header) |

### Suggested theme object

```ts
etasEats: {
  primaryAction: '#06C167', appBg: '#FFFFFF',
  foodEntryBg: '#E7F8EF', foodEntryText: '#05683A', foodEntryBorder: '#06C167',
  activityEntryBg: '#EAF0FE', activityEntryText: '#1A4BB0', activityEntryBorder: '#276EF1',
  symptomEntryBg: '#FFF0E6', symptomEntryText: '#A83A00', symptomEntryBorder: '#FF7A1A',
  allPillBorder: '#000000', triggerPillBorder: '#E11900',
  pillBg: '#F3F3F3', pillBorderIdle: '#F3F3F3',
  navFont: '#6B6B6B', navSelectedFont: '#000000', navBg: '#FFFFFF',
  fabBg: '#06C167', settingsButtonBg: '#F6F6F6', sheetBg: '#FFFFFF',
  font: '"Figtree Variable", "Figtree", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
  // new
  onPrimary: '#000000', textPrimary: '#000000', textSecondary: '#6B6B6B',
  segmentActiveBg: '#000000', segmentActiveText: '#FFFFFF', switchNoBg: '#000000',
  inputBg: '#F3F3F3', primaryActionDisabledBg: '#EEEEEE', primaryActionDisabledText: '#A6A6A6',
  divider: '#EEEEEE', gridHourLine: '#EBEBEB', gridHalfLine: '#F6F6F6', gridColLine: '#F2F2F2',
  cardShadow: '0 1px 2px rgba(0,0,0,.04), 0 4px 14px rgba(0,0,0,.06)',
  sheetShadow: '0 -8px 32px rgba(0,0,0,.14)', scrim: 'rgba(0,0,0,.40)',
  fabShadow: '0 6px 16px rgba(6,193,103,.32), 0 2px 4px rgba(0,0,0,.10)',
  danger: '#C21500', dangerHeader: '#E11900', dangerBg: '#FFF0EE',
}
```
