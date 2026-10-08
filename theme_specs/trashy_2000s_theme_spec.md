# Trashy 2000s — EtasEats theme spec

Target: installed PWA, iPhone 15, 393×852 CSS px @3x, portrait. Safe areas: ~59px top, ~34px bottom.
All treatments are pure CSS / inline SVG. **No raster assets needed.**

---

## 1 · Concept

Pink velour tracksuit, big sunglasses, flip phone. The parts she holds and taps (background, nav bar, sheets, FAB, Save) are loud hot-pink velour with rhinestones and twinkling stars. The calendar grid sits on a near-white "page" so the data stays crisp. Yellowtail script is used for headings only, like a tracksuit logo; everything readable is in Nunito, which is round and bubbly. Baby blue and lilac separate the entry types, and gold is kept for triggers only.

---

## 2 · Variables

| Variable | Value | Notes |
|---|---|---|
| primaryAction | `#E0007A` | White text 4.7:1. Save, toggles, today marker, Yes knob (Save gets treatment #3 ring) |
| appBg | `#FFD3E8` | Base fill under treatment #1 (velour) |
| foodEntryBg | `#FFE3F1` | |
| foodEntryText | `#A3005A` | 7.4:1 on its bg |
| foodEntryBorder | `#FF1F8E` | Also the food dot |
| activityEntryBg | `#DDF1FF` | Baby blue |
| activityEntryText | `#0A5A94` | 6.4:1 |
| activityEntryBorder | `#4FBFFF` | |
| symptomEntryBg | `#EEE3FF` | Lilac (holo family) |
| symptomEntryText | `#6420B0` | 7.1:1. Also symptom card titles |
| symptomEntryBorder | `#A86BFF` | |
| allPillBorder | `#3B0A2A` | Plum ink, the "black" of this theme |
| triggerPillBorder | `#F5B800` | Gold. Trigger chip, switch track when Yes, trigger stars |
| pillBg | `#FFFFFF` | |
| pillBorderIdle | `#F6B3D3` | Also all input + card borders |
| navFont | `#FFE0F0` | 4.6:1 on navBg |
| navSelectedFont | `#FFFFFF` | + weight 800, glass pill, star (M6) |
| navBg | `#C4006C` | Base under treatment #6 (raspberry velour) |
| fabBg | `#E0007A` | See treatment #7 (gem halo) |
| settingsButtonBg | `#FFFFFF` | Settings cards + Trigger cards |
| sheetBg | `#FFF6FA` | + holo grabber band (treatment #4) |
| font | Nunito stack | See section 3 |

---

## 3 · Fonts

**App-wide (`font`): Nunito** (Google Font, weights 400 / 600 / 700 / 800)
```
"Nunito", "Avenir Next Rounded", "Avenir Next", system-ui, sans-serif
```

**Headers only (new `fontDisplay`): Yellowtail** (Google Font, 400)
```
"Yellowtail", "Snell Roundhand", "Brush Script MT", cursive
```
Use it for the month label, sheet titles ("New entry", "Entry details"), screen titles and the theme-card name. Keep it at 26px or larger. Never use it for entry chips, data or buttons.

**Offline:** download the latin-subset `.woff2` files (both fonts are OFL), serve them from `/fonts`, and declare them with `@font-face { … font-display: swap }`. Add them to the service-worker precache. The app then never calls fonts.googleapis.com.

```css
@font-face { font-family: "Nunito"; src: url("/fonts/nunito-latin-variable.woff2") format("woff2"); font-weight: 400 800; font-display: swap; }
@font-face { font-family: "Yellowtail"; src: url("/fonts/yellowtail-latin-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
```

Download sources: fonts.google.com → Nunito / Yellowtail → "Get font" → download, or the gwfh.mranftl.com helper for ready-made woff2 subsets.

---

## 4 · Treatments

### #1 Velour app background
The texture is a noise tile from an SVG data-URI (feTurbulence, tinted magenta, 28% alpha). On top of it are a sparse star tile, one diagonal "nap sheen" band and the pink base gradient. Safari rasterises each tile once, so it costs nothing per frame. Put it on the app root with `background-attachment: scroll`. Avoid `fixed`, because it janks on iOS.

```css
--tt-noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .78 0 0 0 0 0 0 0 0 0 .38 0 0 0 .28 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");

--tt-stars: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' fill='%23fff'%3E%3Cpath d='M30 14c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z' opacity='.85'/%3E%3Cpath d='M128 92c.6 5 2.5 7 7.5 7.5-5 .6-7 2.5-7.5 7.5-.6-5-2.5-7-7.5-7.5 5-.6 7-2.5 7.5-7.5z' opacity='.7'/%3E%3Ccircle cx='90' cy='40' r='1.6'/%3E%3Ccircle cx='50' cy='140' r='1.2'/%3E%3Ccircle cx='160' cy='160' r='1.4'/%3E%3C/svg%3E");

.app-root {
  background-color: #FFD3E8;
  background-image:
    var(--tt-noise),
    var(--tt-stars),
    linear-gradient(115deg, transparent 20%, rgba(255,255,255,.4) 42%, transparent 62%),
    linear-gradient(170deg, #FFC2E0, #FFDCEC 45%, #FFBEDD);
  background-size: 140px 140px, 180px 180px, 100% 100%, 100% 100%;
}
```

### #2 Calendar grid plate (readability)
The texture stays visible in the margins and the chrome. The grid body (everything right of the time gutter) gets a semi-opaque layer that mutes the velour to a faint blush.

```css
.grid-body     { background: rgba(255,248,251,.88); }      /* gridScrim */
.hour-line     { border-top: 1px solid #F2A6CA; }          /* gridLine */
.half-line     { border-top: 1px dashed #F9D2E4; }         /* gridLineHalf */
.col-line      { border-left: 1px solid #F6C3DB; }         /* gridCol */
.time-label    { color: #8A4A6E; font: 700 11px var(--font); }
.entry-chip    {
  background: var(--xEntryBg); color: var(--xEntryText);
  border-left: 3.5px solid var(--xEntryBorder); border-radius: 7px;
  font: 800 11.5px var(--font);
  box-shadow: 0 1px 0 rgba(160,0,90,.18), 0 0 0 1px #fff;
}
```
No bling inside the grid.

### #3 Rhinestone ring ("bedazzle")
A wrapper with padding and a stud tile clipped by its border-radius. Use it for the Save button, the active Trashy theme card and (thinner) the nav top edge.

```css
.tt-bedazzle {
  padding: 3.5px; border-radius: 999px;
  background:
    radial-gradient(circle at 3.5px 3.5px, #fff 0 .9px, #FFC7E3 1.3px 2.1px, transparent 2.5px) 0 0 / 7px 7px,
    linear-gradient(135deg, #FF5FB0, #E0007A);
  box-shadow: 0 4px 12px rgba(224,0,122,.35);
}
/* Theme card version: padding 4px, radius 22px, tile 8px (circle at 4px 4px, 1px / 1.5–2.4px / 2.9px) */
/* Nav edge: 8px-tall strip at top:-4px, same 8px stud tile, no base colour */
```

### #4 Holographic
```css
--tt-holo: linear-gradient(110deg, #FFC4E6, #C8EEFF 25%, #E2D3FF 50%, #FFF2B8 72%, #FFC4E6);
background: var(--tt-holo); background-size: 300% 100%;
```
Use it on the sheet grabber band (22px tall, grabber 40×5 `rgba(59,10,42,.35)`) and the selected Trashy theme card. Text on top is always plum ink `#3B0A2A`.

### #5 Y2K star
One 4-point path, used for the today twinkle, Save sparkles, nav selected star, Trigger List bullets (gold) and the checkmark replacement in Settings (pink).
```html
<svg viewBox="0 0 24 24"><path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z"/></svg>
```

### #6 Raspberry velour nav
```css
.nav {
  background-color: #C4006C;
  background-image:
    url("data:image/svg+xml,…same noise tile, feColorMatrix values='0 0 0 0 1 0 0 0 0 .7 0 0 0 0 .85 0 0 0 .22 0'…"),
    linear-gradient(180deg, #D60A80, #A8005C);
}
.nav-item.selected { background: rgba(255,255,255,.18); border-radius: 18px; }
```
The bar is 64px plus the 34px home-indicator inset, with the stud strip from #3 along the top edge.

### #7 FAB gem halo
```css
.fab {
  width: 62px; height: 62px; border-radius: 50%; overflow: hidden; position: relative;
  background: radial-gradient(circle at 35% 30%, #FF6FB8, #E0007A 60%, #B0005F);
  box-shadow: 0 8px 20px rgba(176,0,95,.45);
}
.fab-gem {
  width: 7px; height: 7px; border-radius: 50%; position: absolute;
  background: radial-gradient(circle at 35% 35%, #fff 0 25%, #FFC7E3 45%, #FF5FB0);
  box-shadow: 0 0 2px rgba(255,255,255,.9);
}
```
14 gems sit on a 34px radius around the FAB centre, inside a 74px box. The whole 74px box is the tap target. Position: right 16px, bottom = nav height + 16px.

```js
// gem positions inside a 74×74 wrapper
Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return { left: 37 + 34 * Math.cos(a) - 3.5, top: 37 + 34 * Math.sin(a) - 3.5 };
});
```

---

## 5 · Per-screen notes

- **Calendar:** month label in Yellowtail 30px, ink `#3B0A2A`, with `text-shadow: 0 0 1px #fff, 0 2px 0 #fff, 0 0 14px rgba(255,31,142,.55)`. Prev/next arrows in primary pink. Today pill white with an idle border. The Week/Day toggle has a white track and a pink gradient knob (`linear-gradient(135deg,#FF5FB0,#E0007A)`). The selected filter chip gets a 2.5px accent border plus `0 0 0 3px <accent>22`; idle chips use 1.5px `#F6B3D3`. The today marker is a 32px pink gradient disc with `box-shadow: 0 0 0 2px #fff, 0 0 0 4px #FFB3D9, 0 3px 10px rgba(224,0,122,.4)` and a 12px white star (M5). The grid follows treatment #2.
- **Entry form sheet:** radius 28px on top, holo band (#4) at the top, Yellowtail 30px title, rhinestone Save (#3) with sparkles (M2). Inputs are white with radius 14 and a 1.5px `#F6B3D3` border, and focus goes to a 2px `#E0007A` border. Placeholder colour is `#B57A99`. Labels are Nunito 800 15px ink. The selected type pill uses its type's border colour plus a glow.
- **Switches (No/Yes):** white track. "No" knob is plum `#3B0A2A` and "Yes" knob is the pink gradient, with the track border turning 2px `#F5B800` (triggerPillBorder). The label on the knob is white and the other label is `#8A4A6E`. Knob uses M4.
- **Triggers:** white cards, radius 20, 1.5px `#F6B3D3` border, sticker drop `box-shadow: 0 4px 0 #F9C9DF`, on velour. Sub-tab bar: white, radius 16. The active Last Symptoms tab uses the symptom colours (`#EEE3FF` / `#6420B0`) and the active Trigger List tab uses a gold tint (`#FFF1BF` bg, `#7A4E00` text, inset 1.5px `#F5B800`). Entry dots get a double ring (`0 0 0 2px #fff, 0 0 0 3px <dot>`). Trigger List rows use gold stars (#5) as bullets.
- **Entry details sheet:** same shell as the form, read-only. The title is Nunito 800 26px. The Type value is coloured by entry type.
- **Settings:** Yellowtail 44px title with a white emboss and pink glow. Section labels are uppercase Nunito 800 13px `#8A4A6E`. The Trashy card is the only bedazzled card: ring #3 around holo #4, Yellowtail 30px name, gem swatches (`radial-gradient(circle at 35% 30%, #fff 0 15%, <colour> 60%)` with a white 1.5px ring), and a pink star (#5) in place of ✓ when selected. Other themes' cards keep their own fonts. The Danger Area stays red (`#FFE8EC` bg, 2px `#D0103A` border, `#B0102E` text) so it reads as a different thing from the pink.
- **Bottom nav:** treatment #6. Emoji icons stay as they are. Labels Nunito 13px: idle 600 `#FFE0F0`, selected 800 `#FFFFFF` with a glass pill and a small cream star (`#FFF3B0`) that pops in (M6).
- **Theme card swatches** for Trashy 2000s (if the picker reads 5 colours): `#E0007A`, `#4FBFFF`, `#A86BFF`, `#F5B800`, `#FF1F8E`.

---

## 6 · Motion

All animations use transform and opacity only, so they run on the GPU. CSS animations pause automatically when the PWA is in the background.

```css
/* M1 FAB shimmer: 40%-wide white band inside the clipped circle, one pass every 6s */
@keyframes ttShimmer {
  0%, 72% { transform: translateX(-140%) rotate(20deg); }
  100%    { transform: translateX(240%)  rotate(20deg); }
}
.fab::after {
  content: ""; position: absolute; top: -20%; left: 0; width: 40%; height: 140%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  animation: ttShimmer 6s ease-in-out infinite;
}

/* M2 Save twinkle: 3 stars (13 / 10 / 8px) at the ring's corners, delays 0 / .8s / 1.6s */
@keyframes ttTwinkle {
  0%, 100% { transform: scale(.2) rotate(0);     opacity: 0; }
  50%      { transform: scale(1)  rotate(45deg); opacity: 1; }
}
.save-star { animation: ttTwinkle 2.4s ease-in-out infinite; }

/* M3 Sheet sheen: holo band drifts; also run once (1.2s) when the sheet opens */
@keyframes ttSheen { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
.sheet-holo { animation: ttSheen 7s ease-in-out infinite alternate; }
/* battery-saver option: .sheet-holo { animation: ttSheen 1.2s ease-out 1; } */

/* M4 Toggle slide (Week/Day, No/Yes, sub-tabs): slight overshoot */
.knob { transition: transform .32s cubic-bezier(.34,1.56,.64,1); }

/* M5 Today star: 12px star at the today disc's top-right */
.today-star { animation: ttTwinkle 3.2s ease-in-out infinite; }

/* M6 Nav select: star pops in once on tab change */
@keyframes ttPop { 0% { transform: scale(0); } 60% { transform: scale(1.3); } 100% { transform: scale(1); } }
.nav-star { animation: ttPop .5s ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .fab::after, .save-star, .sheet-holo, .today-star, .nav-star { animation: none; }
  .save-star, .today-star { opacity: 1; transform: none; }
  .knob { transition-duration: 1ms; }
}
```

---

## 7 · New variables and components

**New variables**
| Variable | Value |
|---|---|
| textInk | `#3B0A2A` |
| textMuted | `#8A4A6E` |
| placeholder | `#B57A99` |
| fontDisplay | `"Yellowtail", "Snell Roundhand", "Brush Script MT", cursive` |
| gridLine | `#F2A6CA` |
| gridLineHalf | `#F9D2E4` (dashed) |
| gridCol | `#F6C3DB` |
| gridScrim | `rgba(255,248,251,.88)` |
| appBgImage | treatment #1 (background-image + size) |
| navBgImage | treatment #6 |
| holo | treatment #4 |
| cardShadow | `0 4px 0 #F9C9DF` |
| dangerBg | `#FFE8EC` |
| dangerBorder | `#D0103A` |
| dangerText | `#B0102E` |

For other themes, set the image variables to `none` and the new colours to their existing equivalents.

**New small components** (render children unchanged, or nothing, when another theme is active)
- `<Bedazzle>`: wrapper that renders ring #3. Used on Save and the active theme card.
- `<Sparkles count delays>`: absolutely-positioned star SVGs (#5) with M2. Used on Save; one star on the today marker (M5).
- `<FabGems>`: the 14 gems around the FAB (#7).

**Assets:** none. Everything is CSS gradients and inline SVG. Only the two font files need downloading (see section 3).
