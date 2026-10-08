# Cunty Leopard — EtasEats theme spec

Target: iPhone 15 PWA, standalone, 393 × 852 CSS px @3x, portrait. Safe areas: top ~59px, bottom ~34px.
Files in this folder: `leopard-bold.svg` (37.5 KB), `leopard-soft.svg` (37.5 KB), `leopard-dark.svg` (37.5 KB). Source mockup: `Cunty Leopard Theme.dc.html`.

---

## 0 · Concept

Old-money fur coat over a cream silk lining. The leopard is real print, placed like jewellery:

- a **soft, low-contrast print** on the whole app background,
- **full-strength print** on trims, the FAB, sheet headers and the theme card,
- a **black tone-on-tone print** on the bottom nav.

Espresso and oxblood carry meaning; metallic gold is the finish on anything she presses. Headings in Bodoni Moda italic for glam, body in Jost for legibility. The calendar grid gets a cream scrim so every chip stays crisp.

---

## 1 · Variables

| Variable | Value | Notes |
|---|---|---|
| primaryAction | `#2A1810` | Espresso. Week/Day slider, today disc, "No" switch state. Save → T4, FAB → T5 |
| appBg | `#F4E6CF` | Cream + soft leopard — **see T1** |
| foodEntryBg | `#F5E4C3` | Champagne |
| foodEntryText | `#5C3A0E` | Toffee ink |
| foodEntryBorder | `#C08A34` | Caramel gold accent |
| activityEntryBg | `#E7DED3` | Mink |
| activityEntryText | `#2B211A` | Espresso ink |
| activityEntryBorder | `#17100A` | Leopard-spot black |
| symptomEntryBg | `#F4DCD2` | Blush clay |
| symptomEntryText | `#7A2318` | Oxblood ink |
| symptomEntryBorder | `#A3321F` | Rust |
| allPillBorder | `#17100A` | Black, like a spot outline |
| triggerPillBorder | `#8B1E1E` | Oxblood; also the "Yes" switch fill |
| pillBg | `#FFF8EC` | Silk cream, always opaque |
| pillBorderIdle | `#D8C3A0` | Sand |
| navFont | `#CDB48C` | Muted gold on black |
| navSelectedFont | `#F3D58C` | Bright gold + tab mark |
| navBg | `#1C130C` | Black leopard — **see T3** |
| fabBg | `#EDB066` | Flat fallback — **see T5** |
| settingsButtonBg | `#FCF5E8` | Cards, rows, trigger cards |
| sheetBg | `#FCF5E8` | Plus leopard band — **see T6** |
| font | Jost stack | **See §2** |

Food / activity / symptom are gold / black / oxblood: three distinct *values*, not just three hues, so they stay distinguishable at 11px.

---

## 2 · Font

**font** (app-wide) — **Jost**, Google Font, weights 400/500/600/700. Geometric, Futura-like, very readable at 11–12px.

```css
font-family: "Jost", "Futura", "Avenir Next", -apple-system, system-ui, sans-serif;
```

**fontDisplay** (new) — **Bodoni Moda** italic 700–800, Google Font. Only for: month label, sheet titles, Triggers card titles, Settings heading, theme-card name. Never below 18px.

```css
font-family: "Bodoni Moda", "Didot", "Bodoni 72", Georgia, serif;
```

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Jost:wght@400;500;600;700&display=swap">
```

Offline: have the service worker cache the CSS + woff2 on first load, or self-host both families from `/fonts`. Bodoni 72 ships on iOS, so the fallback still looks right.

---

## 3 · Treatments

### The leopard tile (used by T1–T3)

One seamless 200×200 SVG tile, three colourways. ~30 rosettes — each an offset caramel blob under 1–4 chunky round-capped black strokes (some closed, some open "C" shapes) — plus ~30 solid spots. Shapes near an edge are repeated on the opposite edge, so it tiles without seams. Pure SVG, **no raster needed**.

| Colourway | ground | patch | ring | spot | Tile size |
|---|---|---|---|---|---|
| bold | `#EDB066` | `#BE6A2C` | `#120C08` | `#120C08` | 180px (120px for small objects) |
| soft | `#F4E6CF` | `#EBD3AF` | `#DBC09A` | `#DBC09A` | 200px |
| dark | `#1C130C` | `#33221A` | `#0A0705` | `#0A0705` | 170px |

The three SVGs are in this folder. Import them as strings (or inline as constants) and build the CSS values:

```js
const uri = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
root.style.setProperty('--leopard-bold',    `${uri(boldSvg)} 0 0/180px 180px #EDB066`);
root.style.setProperty('--leopard-bold-sm', `${uri(boldSvg)} 0 0/120px 120px #EDB066`);
root.style.setProperty('--leopard-soft',    `${uri(softSvg)} 0 0/200px 200px #F4E6CF`);
root.style.setProperty('--leopard-dark',    `${uri(darkSvg)} 0 0/170px 170px #1C130C`);
// usage: style={{ background: 'var(--leopard-bold)' }}
```

(Or reference the .svg files directly: `background: url(/leopard-bold.svg) 0 0/180px #EDB066` — they'll be precached like any other asset.)

### T1 · appBg
`--leopard-soft` on a `position: fixed; inset: 0; z-index: -1` layer (iOS Safari ignores `background-attachment: fixed`). It doesn't scroll and only paints once.

### T2 · leopardBold
Full-strength print, used **only as trim and on objects**: 5px calendar header trim, 16px sheet band, 6px card top strip, FAB fill, selected theme card. Never directly behind text unless the text sits on an espresso plate.

### T3 · navBg
`--leopard-dark` (black tone-on-tone) + a 1.5px gold hairline (T4, 90deg) on top.

### T4 · Gold metal
```css
--gold-metal: linear-gradient(135deg, #8C6421 0%, #E6C474 28%, #B8862C 50%, #F5DD97 72%, #9A6F25 100%);
--gold-line:  linear-gradient(90deg, #8C6421, #F5DD97 30%, #B8862C 55%, #F5DD97 80%, #8C6421);
```
`--gold-metal`: Save button fill, FAB ring, selected theme-card border. `--gold-line`: hairlines under trims/bands and on top of the nav. Text on gold is always `#2A1810`.

### T5 · FAB
62px circle. Layers, outside in:
1. 3px `--gold-metal` ring (padding on the outer element),
2. `--leopard-bold-sm` disc,
3. 30px espresso `#2A1810` core with inset `0 0 0 1px #B8862C`, gold `#F3D58C` "+" (24px).

Shadow `0 8px 18px rgba(42,24,16,.4)`. Whole 62px is the hit area.

### T6 · Sheets
`sheetBg #FCF5E8`, radius 28px on top corners, shadow `0 -10px 30px rgba(23,16,10,.3)`.
- 16px `--leopard-bold` band at the top, 1.5px `--gold-line` under it.
- Grabber 38×5, radius 3, `rgba(252,245,232,.92)`, sitting on the band.
- Title in fontDisplay italic 21–22px.
- Close button: 40px circle, 1.5px `#D8C3A0` border.
- Backdrop: `rgba(23,16,10,.52)`.

### T7 · Calendar grid scrim
Grid area: `background: rgba(252,246,236,.88)` over T1 — the print becomes a faint watermark.
- Hour lines `#E2CDA8` solid 1px · half-hour `#EEDFC5` 1px dashed · columns `#E8D6B8`.
- Time labels 11px Jost 500 `#8A7058`, tabular numerals.

### T8 · Settings theme card (this theme)
2.5px `--gold-metal` border (wrapper padding), radius 19/17, `--leopard-bold-sm` fill, shadow `0 6px 16px rgba(90,55,20,.28)`. Name on an espresso `#17100A` plate (radius 13, inset 1px `#8C6421`) in Bodoni Moda italic 800 19px `#F3D58C`. Swatches 16px: `#2A1810` (gold ring), `#C08A34`, `#E7DED3`, `#A3321F`, `#8B1E1E`. Check: 30px espresso circle, gold ✓. Other themes' cards keep their own fonts.

---

## 4 · Per-screen notes

**Calendar.** Header chrome sits directly on T1; a 5px T2 trim + gold hairline separates it from the grid, which gets T7. Month label: fontDisplay italic 800 25px `#17100A`. Entry chips are **opaque** with a 3px left accent, radius 6, shadow `0 1px 2px rgba(42,24,16,.12)` so they lift off the scrim; text 11.5px Jost 500. Today = 32px espresso disc, gold `#F3D58C` numeral, `0 0 0 1.5px #D4AF5F` ring. Day names 12px `#7A6048`.

**Filter chips.** 52×36, radius 18, `pillBg`, 2px `pillBorderIdle`; selected = 2.5px in that chip's accent (All → black, food → caramel, activity → black, symptom → rust, flag → oxblood). Dividers 1×26px `#CDB28A`.

**Toggles & tabs.** Track `pillBg` + 1.5px `pillBorderIdle`. Slider `#2A1810` with inset `0 0 0 1px #B8862C`; selected label `#F3D58C` 600, idle `#7A6048`. Trigger switch: No = espresso, Yes = oxblood `#8B1E1E`; active label `#FCEFD6`, inactive `#8A7058`.

**Entry form.** T6 sheet. Save = T4 + M1. Inputs: 48px, radius 12, `#FFFBF3`, 1.5px `#D8C3A0`, placeholder `#A08868`. Field labels Jost 600 15px. Selected type pill: 2.5px in that entry type's border colour. Selected symptom pills: `symptomEntryBg` / `symptomEntryText` / 2px `symptomEntryBorder`.

**Triggers.** Segmented control 50px, radius 16, espresso slider. Cards on `settingsButtonBg`, radius 20, 1px `#E3CCA6`, shadow `0 2px 12px rgba(60,35,15,.1)`, with a 6px T2 strip + gold hairline on top. Symptom titles: fontDisplay 700 18px `symptomEntryText`. Column headers 10.5px, 600, uppercase, tracking .12em, `#9A7A58`. Row dividers `#EEDDC0`.

**Entry details.** T6 sheet. Entry name fontDisplay 700 28px with a 14px dot in the type's border colour. Labels `#8A7058`. Divider: `linear-gradient(90deg, transparent, #C9A24A 20%, #C9A24A 80%, transparent)`.

**Bottom nav.** T3, 62px + 34px safe area. Emoji icons stay. Selected: `navSelectedFont` 600 + a 28×3px `--gold-line` tab mark hanging from the top hairline (radius 0 0 3px 3px). Home indicator over it reads in `#F3E3C6`.

**Settings.** Heading fontDisplay italic 800 38px. Section labels 12px 600 uppercase, tracking .14em, `#7A4E26`. Rows/cards on `settingsButtonBg`, radius 18, 1.5px `#E3CCA6`, row dividers `#EEDDC0`. Language check in `#8C6421`. Theme card → T8.

**Danger Area.** Label `#8B1E1E`. Card `#F7E4DA` with 1.5px `#8B1E1E` border. Button `#8B1E1E` bg / `#FCEFD6` text, 46px, fully rounded.

---

## 5 · Motion

All animations use only `transform` / `opacity`, so they run on the compositor and are cheap on battery.

- **M1 · Save shimmer.** A highlight sweeps across once every 4.5s, then rests. Only mounted while a sheet is open.
- **M2 · FAB halo.** A 2px gold ring scales 1 → 1.4 and fades, 3.6s. Run **3 cycles** after the calendar mounts, then stop.
- **M3 · Sheet band sheen.** One pass across the leopard band, 1.4s, 0.3s after the sheet opens. The same sheen loops slowly (6s) on the selected theme card.
- **M4 · Toggles.** Existing sliders get a slight overshoot.

```css
/* M1 */
@keyframes cl-sheen { 0% { transform: translateX(-120%) } 35%, 100% { transform: translateX(240%) } }
.cl-save { position: relative; overflow: hidden; background: var(--gold-metal); }
.cl-save::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 50%;
  background: linear-gradient(105deg, transparent, rgba(255,250,228,.9), transparent);
  animation: cl-sheen 4.5s ease-in-out infinite;
}

/* M2 */
@keyframes cl-ring { 0% { transform: scale(1); opacity: .75 } 70%, 100% { transform: scale(1.4); opacity: 0 } }
.cl-fab { position: relative; }
.cl-fab::before {
  content: ""; position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid #E6C474; animation: cl-ring 3.6s ease-out 3;
}

/* M3 */
@keyframes cl-band { from { transform: translateX(-140%) } to { transform: translateX(420%) } }
.cl-band { position: relative; overflow: hidden; }
.cl-band::after {
  content: ""; position: absolute; inset: 0 auto 0 0; width: 30%;
  background: linear-gradient(100deg, transparent, rgba(255,244,214,.55), transparent);
  animation: cl-band 1.4s .3s ease-out 1 both;
}
.cl-theme-card::after { /* same as .cl-band::after */ animation: cl-band 6s 1s ease-in-out infinite; }

/* M4 */
.cl-slider { transition: transform .32s cubic-bezier(.3,1.35,.5,1), background-color .2s; }

@media (prefers-reduced-motion: reduce) {
  .cl-save::after, .cl-fab::before, .cl-band::after, .cl-theme-card::after { animation: none; }
  .cl-slider { transition-duration: .01ms; }
}
```

---

## 6 · New variables & components

**New variables**

| Variable | Value |
|---|---|
| fontDisplay | Bodoni Moda stack (§2) |
| textPrimary | `#2A1810` |
| textMuted | `#7A6048` |
| onPrimary | `#F3D58C` |
| hairline | `#E3CCA6` |
| goldMetal | T4 (135deg) |
| goldLine | T4 (90deg) |
| leopardSoft / leopardBold / leopardBoldSm / leopardDark | T1–T3 background strings |
| gridScrim | `rgba(252,246,236,.88)` |
| gridLineHour | `#E2CDA8` |
| gridLineHalf | `#EEDFC5` |
| dangerBg | `#F7E4DA` |
| dangerBorder | `#8B1E1E` |

**Small components**
- `<LeopardTrim height />` — print strip + gold hairline. Used by calendar header (5px), cards (6px), sheets (16px).
- `<GoldShimmer />` — wrapper for the Save button (T4 + M1).
- Theme-aware FAB — renders T5 when the theme defines a `fabTreatment`.

Every other variable falls back to a flat hex, so other themes are unaffected.

---

## Appendix · Tile generator (deterministic)

The SVGs above were produced by this function (seeded, so output is identical every run). Only needed if you want to tweak density or colours.

```js
function tile(g, c, r, s) {
    const N = 200; let seed = 11;
    const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const f = n => Math.round(n * 10) / 10;
    const tor = (a, b) => { let dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y); dx = Math.min(dx, N - dx); dy = Math.min(dy, N - dy); return Math.hypot(dx, dy); };
    const smooth = (p, closed) => {
      const n = p.length, P = i => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
      let d = `M${f(p[0][0])} ${f(p[0][1])}`;
      for (let i = 0; i < (closed ? n : n - 1); i++) {
        const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
        d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      }
      return d + (closed ? 'Z' : '');
    };
    const ros = [], dots = [];
    for (let k = 0; k < 5000 && ros.length < 30; k++) {
      const q = { x: rnd() * N, y: rnd() * N, rad: 8 + rnd() * 5 };
      if (ros.every(p => tor(p, q) > (p.rad + q.rad) * 1.5)) ros.push(q);
    }
    for (let k = 0; k < 3000 && dots.length < 34; k++) {
      const q = { x: rnd() * N, y: rnd() * N, rad: 2.4 + rnd() * 2.4 };
      if (ros.every(p => tor(p, q) > p.rad * 1.35 + q.rad + 3) && dots.every(p => tor(p, q) > p.rad + q.rad + 4)) dots.push(q);
    }
    const shapes = [];
    ros.forEach(({ x, y, rad }) => {
      const rot = rnd() * Math.PI, ell = .72 + rnd() * .28;
      const at = (a, rr) => { const px = Math.cos(a) * rr, py = Math.sin(a) * rr * ell; return [x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)]; };
      const oa = rnd() * 6.283, od = rad * (.3 + rnd() * .2), cx = x + Math.cos(oa) * od, cy = y + Math.sin(oa) * od;
      const patch = Array.from({ length: 7 }, (_, i) => { const a = i / 7 * 6.283, rr = rad * (.7 + rnd() * .35); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * ell]; });
      let str = `<path fill='${c}' d='${smooth(patch, true)}'/><g fill='none' stroke='${r}' stroke-linecap='round' stroke-linejoin='round'>`;
      const open = rnd() < .25, n = open ? 1 + Math.floor(rnd() * 2) : 2 + Math.floor(rnd() * 3);
      const gaps = Array.from({ length: n }, (_, i) => (open && i === 0 ? 1.7 : .72) + rnd() * .4);
      const wts = Array.from({ length: n }, () => .6 + rnd()), wsum = wts.reduce((a, b) => a + b, 0);
      const arc = 6.283 - gaps.reduce((a, b) => a + b, 0);
      let a = rnd() * 6.283;
      for (let i = 0; i < n; i++) {
        const span = arc * wts[i] / wsum, steps = Math.max(2, Math.ceil(span / .45)), pts = [];
        for (let j = 0; j <= steps; j++) pts.push(at(a + span * j / steps, rad * (.92 + rnd() * .16)));
        str += `<path stroke-width='${f(rad * (.5 + rnd() * .18))}' d='${smooth(pts, false)}'/>`;
        a += span + gaps[i];
      }
      shapes.push({ x, y, e: rad * 1.45, str: str + '</g>' });
    });
    dots.forEach(({ x, y, rad }) => {
      const pts = Array.from({ length: 6 }, (_, i) => { const a = i / 6 * 6.283, rr = rad * (.8 + rnd() * .35); return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; });
      shapes.push({ x, y, e: rad * 1.2, str: `<path fill='${s}' d='${smooth(pts, true)}'/>` });
    });
    let out = `<svg xmlns='http://www.w3.org/2000/svg' width='${N}' height='${N}'><rect width='${N}' height='${N}' fill='${g}'/>`;
    shapes.forEach(sh => {
      for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) {
        if (sh.x + ox + sh.e < 0 || sh.x + ox - sh.e > N || sh.y + oy + sh.e < 0 || sh.y + oy - sh.e > N) continue;
        out += ox || oy ? `<g transform='translate(${ox} ${oy})'>${sh.str}</g>` : sh.str;
      }
    });
    return out + '</svg>';
}

// tile(ground, patch, ring, spot)
const bold = tile('#EDB066', '#BE6A2C', '#120C08', '#120C08');
const soft = tile('#F4E6CF', '#EBD3AF', '#DBC09A', '#DBC09A');
const dark = tile('#1C130C', '#33221A', '#0A0705', '#0A0705');
```
