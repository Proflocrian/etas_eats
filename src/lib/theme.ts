// Central visual theme: colours, emojis, ordering and shared sizing.
// Colours are driven by CSS custom properties so the active theme can be
// swapped at runtime (see THEMES / applyTheme). Edit THEMES to restyle.
import type { EntryTypeEnum } from '../db/db'
import type { Tab } from '../components/BottomNav'
// Leopard print tiles (C2PA metadata stripped). Imported as base-aware URLs so
// they work under any deploy path and get precached by the PWA build.
import leopardSoftUrl from '../assets/leopard-soft.svg?url'
import leopardBoldUrl from '../assets/leopard-bold.svg?url'
import leopardDarkUrl from '../assets/leopard-dark.svg?url'

// Every themeable colour. A theme supplies a hex for each of these.
// Phase 1 of the theme redesign expanded this set; see theme_specs/*.md for the
// per-theme source values and handover.md for the plan.
export interface Palette {
  primaryAction: string // FAB, Save, active toggles, today marker, Yes switch
  onPrimary: string // text/icon ON a primaryAction fill (Save label, FAB +, today numeral)
  appBg: string // app background (flat fallback; patterned bg is a later-phase treatment)
  // Calendar entries + pills (bg / text / accent border per entry type).
  foodEntryBg: string
  foodEntryText: string
  foodEntryBorder: string
  activityEntryBg: string
  activityEntryText: string
  activityEntryBorder: string
  symptomEntryBg: string
  symptomEntryText: string
  symptomEntryBorder: string
  allPillBorder: string // "All" filter chip accent
  triggerPillBorder: string // trigger filter chip accent + Possible Trigger switch
  pillBg: string // constant pill/chip background
  pillBorderIdle: string // unselected pill/chip border
  navFont: string // bottom-nav label (unselected)
  navSelectedFont: string // bottom-nav label (selected)
  navBg: string // bottom-nav background
  fabBg: string // floating "add" button background
  settingsButtonBg: string // Settings rows / cards background
  sheetBg: string // bottom-sheet + dialog background
  // --- Added in Phase 1 (universal; every theme must define these) ---
  textPrimary: string // body + headings
  textSecondary: string // secondary text
  textMuted: string // meta / hour labels / "3h before"
  divider: string // hairlines, nav top border
  cardBorder: string // card / row borders
  cardBg: string // content-card fill (Last Symptoms cards); white on etas vs grey rows
  gridLine: string // calendar hour lines
  gridLineHalf: string // calendar half-hour lines
  gridCol: string // calendar day-column dividers
  gridScrim: string // overlay over a patterned bg behind the grid ('transparent' if none)
  inputBg: string // text input fill
  inputBorder: string // text input border (== inputBg for a borderless filled look)
  placeholder: string // input placeholder text
  switchTrack: string // No/Yes + segmented-control track
  switchNoBg: string // the "No" thumb fill
  switchNoText: string // text on the "No" thumb
  triggerSwitchText: string // text on the "Yes" thumb of a trigger switch
  segmentActiveBg: string // Week/Day + Triggers active segment thumb
  segmentActiveText: string // active segment label
  danger: string // destructive accent / button bg
  dangerBg: string // danger row/card background
  dangerText: string // danger text
  dangerBorder: string // danger border / section header
  // String-valued treatment tokens (box-shadow / rgba strings), read inline.
  cardShadow: string // box-shadow for content cards (Triggers)
  sheetShadow: string // box-shadow for bottom sheets + dialogs
  fabShadow: string // box-shadow for the FAB
  scrim: string // overlay fill behind sheets/modals
}

// Palette key -> CSS custom property name. `primaryAction` uses --color-primary
// so Tailwind's `primary` utilities (bg-primary, text-primary, ...) pick it up.
const CSS_VARS: Record<keyof Palette, string> = {
  primaryAction: '--color-primary',
  onPrimary: '--color-on-primary',
  appBg: '--color-app-bg',
  foodEntryBg: '--color-food-bg',
  foodEntryText: '--color-food-text',
  foodEntryBorder: '--color-food-border',
  activityEntryBg: '--color-activity-bg',
  activityEntryText: '--color-activity-text',
  activityEntryBorder: '--color-activity-border',
  symptomEntryBg: '--color-symptom-bg',
  symptomEntryText: '--color-symptom-text',
  symptomEntryBorder: '--color-symptom-border',
  allPillBorder: '--color-all-pill-border',
  triggerPillBorder: '--color-trigger-pill-border',
  pillBg: '--color-pill-bg',
  pillBorderIdle: '--color-pill-border-idle',
  navFont: '--color-nav-font',
  navSelectedFont: '--color-nav-selected-font',
  navBg: '--color-nav-bg',
  fabBg: '--color-fab-bg',
  settingsButtonBg: '--color-settings-button-bg',
  sheetBg: '--color-sheet-bg',
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  textMuted: '--color-text-muted',
  divider: '--color-divider',
  cardBorder: '--color-card-border',
  cardBg: '--color-card-bg',
  gridLine: '--color-grid-line',
  gridLineHalf: '--color-grid-line-half',
  gridCol: '--color-grid-col',
  gridScrim: '--color-grid-scrim',
  inputBg: '--color-input-bg',
  inputBorder: '--color-input-border',
  placeholder: '--color-placeholder',
  switchTrack: '--color-switch-track',
  switchNoBg: '--color-switch-no-bg',
  switchNoText: '--color-switch-no-text',
  triggerSwitchText: '--color-trigger-switch-text',
  segmentActiveBg: '--color-segment-active-bg',
  segmentActiveText: '--color-segment-active-text',
  danger: '--color-danger',
  dangerBg: '--color-danger-bg',
  dangerText: '--color-danger-text',
  dangerBorder: '--color-danger-border',
  cardShadow: '--shadow-card',
  sheetShadow: '--shadow-sheet',
  fabShadow: '--shadow-fab',
  scrim: '--color-scrim',
}

// The colour API the app uses: each value is a `var(--...)` reference, so it
// always reflects the active theme. Keys match Palette.
export const COLORS = Object.fromEntries(
  (Object.keys(CSS_VARS) as (keyof Palette)[]).map((k) => [k, `var(${CSS_VARS[k]})`]),
) as Record<keyof Palette, string>

// ---------------------------------------------------------------------------
// Themes. Add entries here; each supplies a full Palette.
// ---------------------------------------------------------------------------
export type ThemeId = 'etas-eats' | 'cunty-leopard' | 'trashy-2000s' | 'eleven-eleven'

// Per-theme opt-in flags for structural extras (patterned bg, wave accents,
// decorative overlays, special FAB, ...). Populated in later phases; a theme
// that omits a flag gets the plain default. See handover.md.
export interface ThemeDecor {
  fabTreatment?: 'leopard' | 'gems' | 'heart' // non-default FAB rendering
  patternedBg?: boolean // app background is a treatment layer, not a flat fill
  leopardTrim?: boolean // leopard print strips on calendar header + card tops
  sheetBand?: boolean // leopard print band at the top of sheets
  sheetBandHolo?: boolean // holographic band at the top of sheets (2000s)
  y2kStars?: boolean // 2000s star motif: today marker, Trigger List bullets, Settings check
  goldSave?: boolean // gold-metal Save button (leopard)
  navPrint?: boolean // tone-on-tone print + gold tab mark on the nav (leopard)
  navVelour?: boolean // raspberry-velour nav + glass selected pill (2000s)
  navHeartMark?: boolean // 🩵 tab mark on the selected nav tab (11:11)
  bedazzleSave?: boolean // 2000s rhinestone Save: pink gradient + inset dashed ring + glow
  bgSparkle?: boolean // 2000s slow drifting star glimmer over the background
  sheetWave?: boolean // 11:11 marbled-wave sheet background
  headerWave?: boolean // 11:11 faint wave strip under the status bar
  watermark?: boolean // 11:11 heart-clock watermark (Settings/About)
  elevenRow?: boolean // 11:11 always-on heart emoji at the 11:11 gutter point
  triggersEleven?: boolean // 11:11 fixed "11:11" watermark behind the Triggers screen
  fabRipple?: boolean // 11:11 always-on ~11s FAB ripple
}

// 11:11 marbled wave: ~34 sine strokes denim -> powder -> cream plus white
// hairlines on an ice ground, as one 480x360 inline-SVG tile (no raster), built
// once at module load and emitted as `--wave-svg`. SEAMLESS IN BOTH DIRECTIONS:
// every sine period divides W (x=0 matches x=W); each stroke overruns the tile by
// 32px per side so caps never show at the edge; each line is drawn at y-H, y and
// y+H so lines crossing the top/bottom wrap; and every per-line term (phase,
// colour, width, opacity) is periodic over n, so line n flows into line 0. This
// lets the tile `repeat` and drift with no visible seam (spec 11_11_spec_2.md §4).
function makeWave(): string {
  const W = 480,
    H = 360,
    n = 34
  const cols = ['#1F4E86', '#2F67A3', '#5C8FC4', '#8DB4DA', '#B9D3EA', '#DCE8F2', '#F1F0EA']
  const T = (i: number) => (2 * Math.PI * i) / n
  const line = (y0: number, i: number, amp: number) => {
    let d = ''
    for (let x = -32; x <= W + 32; x += 16) {
      const y =
        y0 +
        amp * Math.sin((2 * Math.PI * x) / (W / 2) + 3 * T(i)) +
        5 * Math.sin((2 * Math.PI * x * 3) / W + 5 * T(i))
      d += (x === -32 ? 'M' : 'L') + x + ' ' + y.toFixed(1)
    }
    return d
  }
  const wrap = (y0: number, i: number, attrs: string) =>
    [-H, 0, H]
      .filter((dy) => y0 + dy > -40 && y0 + dy < H + 40)
      .map((dy) => `<path d="${line(y0 + dy, i, 14)}" ${attrs} fill="none"/>`)
      .join('')
  let p = ''
  for (let i = 0; i < n; i++) {
    const y0 = (i * H) / n
    const band = Math.sin(2 * T(i)) + 0.6 * Math.sin(T(i) + 1)
    const ci = Math.max(0, Math.min(6, Math.round(((band + 1.6) / 3.2) * 6)))
    const w = (4 + 7 * Math.abs(Math.sin(4 * T(i)))).toFixed(1)
    const o = (0.55 + 0.4 * Math.abs(Math.cos(3 * T(i)))).toFixed(2)
    p += wrap(y0, i, `stroke="${cols[ci]}" stroke-width="${w}" stroke-opacity="${o}"`)
  }
  for (let i = 0; i < n * 2; i++) {
    const y0 = (i * H) / (n * 2) + 3
    p += wrap(y0, i / 2, 'stroke="#fff" stroke-width="0.8" stroke-opacity="0.35"')
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#E9EEF1"/>${p}</svg>`
  return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")'
}

const WAVE_SVG = makeWave()

export interface Theme {
  label: string
  font: string // CSS font-family stack applied app-wide
  palette: Palette
  // --- Optional per-theme extras (declared now; populated in later phases) ---
  fontDisplay?: string // heading font stack (falls back to `font`)
  fontDisplayStyle?: string // 'italic' | 'normal' for the display font (default normal)
  treatments?: Partial<Record<string, string>> // CSS var name -> value (gradients, print bg strings); emitted by applyTheme
  onSheet?: Partial<Palette> // token overrides applied within a sheet subtree (e.g. 11:11)
  decor?: ThemeDecor // structural opt-ins
}

export const THEMES: Record<ThemeId, Theme> = {
  // Default: clean UberEats look-alike. White surfaces, black type, one green.
  'etas-eats': {
    label: 'EtasEats',
    font: '"Figtree Variable", "Figtree", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    palette: {
      primaryAction: '#06C167',
      onPrimary: '#000000',
      appBg: '#FFFFFF',
      foodEntryBg: '#E7F8EF',
      foodEntryText: '#05683A',
      foodEntryBorder: '#06C167',
      activityEntryBg: '#EAF0FE',
      activityEntryText: '#1A4BB0',
      activityEntryBorder: '#276EF1',
      symptomEntryBg: '#FFF0E6',
      symptomEntryText: '#A83A00',
      symptomEntryBorder: '#FF7A1A',
      allPillBorder: '#000000',
      triggerPillBorder: '#E11900',
      pillBg: '#F3F3F3',
      pillBorderIdle: '#F3F3F3',
      navFont: '#6B6B6B',
      navSelectedFont: '#000000',
      navBg: '#FFFFFF',
      fabBg: '#06C167',
      settingsButtonBg: '#F6F6F6',
      sheetBg: '#FFFFFF',
      textPrimary: '#000000',
      textSecondary: '#6B6B6B',
      textMuted: '#6B6B6B',
      divider: '#EEEEEE',
      cardBorder: '#EEEEEE',
      cardBg: '#FFFFFF',
      gridLine: '#EBEBEB',
      gridLineHalf: '#F6F6F6',
      gridCol: '#F2F2F2',
      gridScrim: 'transparent',
      inputBg: '#F3F3F3',
      inputBorder: '#F3F3F3',
      placeholder: '#9E9E9E',
      switchTrack: '#F3F3F3',
      switchNoBg: '#000000',
      switchNoText: '#FFFFFF',
      triggerSwitchText: '#FFFFFF',
      segmentActiveBg: '#000000',
      segmentActiveText: '#FFFFFF',
      danger: '#C21500',
      dangerBg: '#FFF0EE',
      dangerText: '#C21500',
      dangerBorder: '#E11900',
      cardShadow: '0 1px 2px rgba(0,0,0,.04), 0 4px 14px rgba(0,0,0,.06)',
      sheetShadow: '0 -8px 32px rgba(0,0,0,.14)',
      fabShadow: '0 6px 16px rgba(6,193,103,.32), 0 2px 4px rgba(0,0,0,.10)',
      scrim: 'rgba(0,0,0,.40)',
    },
  },
  // Maximalist glam, classic natural leopard + metallic gold.
  'cunty-leopard': {
    label: 'Cunty Leopard',
    font: '"Jost Variable", "Jost", "Futura", "Avenir Next", -apple-system, system-ui, sans-serif',
    fontDisplay: '"Bodoni Moda Variable", "Bodoni Moda", "Didot", "Bodoni 72", Georgia, serif',
    palette: {
      primaryAction: '#2A1810',
      onPrimary: '#F3D58C',
      appBg: '#F4E6CF',
      foodEntryBg: '#F5E4C3',
      foodEntryText: '#5C3A0E',
      foodEntryBorder: '#C08A34',
      activityEntryBg: '#E7DED3',
      activityEntryText: '#2B211A',
      activityEntryBorder: '#17100A',
      symptomEntryBg: '#F4DCD2',
      symptomEntryText: '#7A2318',
      symptomEntryBorder: '#A3321F',
      allPillBorder: '#17100A',
      triggerPillBorder: '#8B1E1E',
      pillBg: '#FFF8EC',
      pillBorderIdle: '#D8C3A0',
      navFont: '#CDB48C',
      navSelectedFont: '#F3D58C',
      navBg: '#1C130C',
      fabBg: '#EDB066',
      settingsButtonBg: '#FCF5E8',
      sheetBg: '#FCF5E8',
      textPrimary: '#2A1810',
      textSecondary: '#7A6048',
      textMuted: '#8A7058',
      divider: '#E3CCA6',
      cardBorder: '#E3CCA6',
      cardBg: '#FCF5E8',
      gridLine: '#E2CDA8',
      gridLineHalf: '#EEDFC5',
      gridCol: '#E8D6B8',
      gridScrim: 'rgba(252,246,236,.88)',
      inputBg: '#FFFBF3',
      inputBorder: '#D8C3A0',
      placeholder: '#A08868',
      switchTrack: '#FFF8EC',
      switchNoBg: '#2A1810',
      switchNoText: '#FCEFD6',
      triggerSwitchText: '#FCEFD6',
      segmentActiveBg: '#2A1810',
      segmentActiveText: '#F3D58C',
      danger: '#8B1E1E',
      dangerBg: '#F7E4DA',
      dangerText: '#8B1E1E',
      dangerBorder: '#8B1E1E',
      cardShadow: '0 2px 12px rgba(60,35,15,.10)',
      sheetShadow: '0 -10px 30px rgba(23,16,10,.3)',
      fabShadow: '0 8px 18px rgba(42,24,16,.4)',
      scrim: 'rgba(23,16,10,.52)',
    },
    fontDisplayStyle: 'italic',
    decor: {
      patternedBg: true,
      fabTreatment: 'leopard',
      leopardTrim: true,
      sheetBand: true,
      goldSave: true,
      navPrint: true,
    },
    treatments: {
      '--app-bg-layer': `url(${leopardSoftUrl}) 0 0 / 200px 200px #F4E6CF`,
      '--leopard-bold': `url(${leopardBoldUrl}) 0 0 / 180px 180px #EDB066`,
      '--leopard-bold-sm': `url(${leopardBoldUrl}) 0 0 / 120px 120px #EDB066`,
      '--leopard-dark': `url(${leopardDarkUrl}) 0 0 / 170px 170px #1C130C`,
      '--gold-metal':
        'linear-gradient(135deg, #8C6421 0%, #E6C474 28%, #B8862C 50%, #F5DD97 72%, #9A6F25 100%)',
      '--gold-line':
        'linear-gradient(90deg, #8C6421, #F5DD97 30%, #B8862C 55%, #F5DD97 80%, #8C6421)',
      '--save-bg': 'var(--gold-metal)',
      '--save-text': '#2A1810',
    },
  },
  // Full trashy Y2K, bubblegum pink (Posh Beckham muse).
  'trashy-2000s': {
    label: 'Trashy 2000s',
    font: '"Nunito Variable", "Nunito", "Avenir Next Rounded", "Avenir Next", system-ui, sans-serif',
    fontDisplay: '"Yellowtail", "Snell Roundhand", "Brush Script MT", cursive',
    palette: {
      primaryAction: '#E0007A',
      onPrimary: '#FFFFFF',
      appBg: '#FFD3E8',
      foodEntryBg: '#FFE3F1',
      foodEntryText: '#A3005A',
      foodEntryBorder: '#FF1F8E',
      activityEntryBg: '#DDF1FF',
      activityEntryText: '#0A5A94',
      activityEntryBorder: '#4FBFFF',
      symptomEntryBg: '#EEE3FF',
      symptomEntryText: '#6420B0',
      symptomEntryBorder: '#A86BFF',
      allPillBorder: '#3B0A2A',
      triggerPillBorder: '#F5B800',
      pillBg: '#FFFFFF',
      pillBorderIdle: '#F6B3D3',
      navFont: '#FFE0F0',
      navSelectedFont: '#FFFFFF',
      navBg: '#C4006C',
      fabBg: '#E0007A',
      settingsButtonBg: '#FFFFFF',
      sheetBg: '#FFF6FA',
      textPrimary: '#3B0A2A',
      textSecondary: '#8A4A6E',
      textMuted: '#8A4A6E',
      divider: '#F6B3D3',
      cardBorder: '#F6B3D3',
      cardBg: '#FFFFFF',
      gridLine: '#F2A6CA',
      gridLineHalf: '#F9D2E4',
      gridCol: '#F6C3DB',
      gridScrim: 'rgba(255,248,251,.88)',
      inputBg: '#FFFFFF',
      inputBorder: '#F6B3D3',
      placeholder: '#B57A99',
      switchTrack: '#FFFFFF',
      switchNoBg: '#3B0A2A',
      switchNoText: '#FFFFFF',
      triggerSwitchText: '#FFFFFF',
      segmentActiveBg: '#E0007A',
      segmentActiveText: '#FFFFFF',
      danger: '#D0103A',
      dangerBg: '#FFE8EC',
      dangerText: '#B0102E',
      dangerBorder: '#D0103A',
      cardShadow: '0 4px 0 #F9C9DF',
      sheetShadow: '0 -8px 30px rgba(176,0,95,.25)',
      fabShadow: '0 8px 20px rgba(176,0,95,.45)',
      scrim: 'rgba(59,10,42,.42)',
    },
    decor: {
      patternedBg: true,
      sheetBandHolo: true,
      fabTreatment: 'gems',
      navVelour: true,
      y2kStars: true,
      bedazzleSave: true,
      bgSparkle: true,
    },
    treatments: {
      // Raspberry-velour nav: magenta-tinted noise over a pink gradient.
      '--nav-velour': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 .7 0 0 0 0 .85 0 0 0 .22 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E") 0 0/140px 140px, linear-gradient(180deg, #D60A80, #A8005C)`,
      // Velour: feTurbulence noise (magenta) + a sparse star tile + a diagonal nap
      // sheen + the pink base gradient. Single `background` shorthand.
      '--app-bg-layer': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .78 0 0 0 0 0 0 0 0 0 .38 0 0 0 .28 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E") 0 0/140px 140px, url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' fill='%23fff'%3E%3Cpath d='M30 14c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z' opacity='.85'/%3E%3Cpath d='M128 92c.6 5 2.5 7 7.5 7.5-5 .6-7 2.5-7.5 7.5-.6-5-2.5-7-7.5-7.5 5-.6 7-2.5 7.5-7.5z' opacity='.7'/%3E%3Ccircle cx='90' cy='40' r='1.6'/%3E%3Ccircle cx='50' cy='140' r='1.2'/%3E%3Ccircle cx='160' cy='160' r='1.4'/%3E%3C/svg%3E") 0 0/180px 180px, linear-gradient(115deg, transparent 20%, rgba(255,255,255,.4) 42%, transparent 62%), linear-gradient(170deg, #FFC2E0, #FFDCEC 45%, #FFBEDD), #FFD3E8`,
      '--tt-holo':
        'linear-gradient(110deg, #FFC4E6, #C8EEFF 25%, #E2D3FF 50%, #FFF2B8 72%, #FFC4E6)',
      // Rhinestone Save: a clean hot-pink gradient; the dashed ring + glow come
      // from the .tt-save class (decor.bedazzleSave).
      '--save-bg': 'linear-gradient(135deg, #FF5FB0, #E0007A)',
      '--save-text': '#FFFFFF',
    },
  },
  // A quiet room at 11:11. Dark denim, 🩵 accent, marbled-wave accents.
  'eleven-eleven': {
    label: '11:11',
    font: '"Quicksand Variable", "Quicksand", ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
    palette: {
      primaryAction: '#A8D8EA',
      onPrimary: '#12304F',
      appBg: '#23507D',
      foodEntryBg: '#D3EFE8',
      foodEntryText: '#0E4A42',
      foodEntryBorder: '#4FB3A2',
      activityEntryBg: '#E3E1F7',
      activityEntryText: '#352F78',
      activityEntryBorder: '#8E86DA',
      symptomEntryBg: '#FBE1D3',
      symptomEntryText: '#7A3317',
      symptomEntryBorder: '#F2A684',
      allPillBorder: '#F4F7FB',
      triggerPillBorder: '#F2A7B5',
      pillBg: '#2D5B89',
      pillBorderIdle: '#5C82AA',
      navFont: '#9DB9D6',
      navSelectedFont: '#FFFFFF',
      navBg: '#1B3F64',
      fabBg: '#FFFFFF',
      settingsButtonBg: '#2C5986',
      sheetBg: '#F5F8FB',
      textPrimary: '#F4F7FB',
      textSecondary: '#B9CEE3',
      textMuted: '#A9C3DD',
      divider: '#3E6994',
      cardBorder: '#3E6994',
      cardBg: '#2C5986',
      gridLine: '#44709C',
      gridLineHalf: '#305C88',
      gridCol: '#34618D',
      gridScrim: 'transparent',
      inputBg: '#FFFFFF',
      inputBorder: '#CFDCE8',
      placeholder: '#7891AA',
      switchTrack: '#1C426A',
      switchNoBg: '#F4F7FB',
      switchNoText: '#12304F',
      triggerSwitchText: '#4E1626',
      segmentActiveBg: '#A8D8EA',
      segmentActiveText: '#12304F',
      danger: '#E07A80',
      dangerBg: '#3A2F4F',
      dangerText: '#FFD4D6',
      dangerBorder: '#E07A80',
      cardShadow: '0 2px 12px rgba(6,20,40,.28)',
      sheetShadow: '0 -10px 40px rgba(6,20,40,.35)',
      fabShadow: '0 8px 22px rgba(8,24,48,.35)',
      scrim: 'rgba(9,24,44,.55)',
    },
    // On the light frosted sheet, text goes dark-ink and controls go light.
    onSheet: {
      textPrimary: '#16324F',
      textSecondary: '#5B7590',
      textMuted: '#5B7590',
      pillBg: '#FFFFFF',
      pillBorderIdle: '#CFDCE8',
      inputBg: '#FFFFFF',
      inputBorder: '#CFDCE8',
      switchTrack: '#E6EEF5',
      switchNoBg: '#16324F',
      switchNoText: '#FFFFFF',
    },
    decor: {
      patternedBg: true, // denim gradient surface (treatment #1)
      sheetWave: true,
      headerWave: true,
      watermark: true,
      elevenRow: true,
      triggersEleven: true,
      fabRipple: true,
      fabTreatment: 'heart',
      navHeartMark: true,
    },
    treatments: {
      // Treatment #1: a plain vertical denim gradient (no pattern), painted on
      // the fixed app-bg layer so the grid sits on solid denim.
      '--app-bg-layer': 'linear-gradient(180deg, #2A5986 0%, #23507D 34%, #1F4873 100%)',
      // Treatment #2: the marbled wave tile (used by WaveAccent on sheets, the
      // header strip and the 11:11 theme card).
      '--wave-svg': WAVE_SVG,
    },
  },
}

// Tokens that take an on-sheet value inside a `.sheet-scope` subtree (see
// index.css). applyTheme always emits a `<var>-sheet` for each of these (the
// theme's onSheet override, or its base value), so the CSS is never invalid.
const SHEET_SCOPED_KEYS: (keyof Palette)[] = [
  'textPrimary',
  'textSecondary',
  'textMuted',
  'pillBg',
  'pillBorderIdle',
  'inputBg',
  'inputBorder',
  'switchTrack',
  'switchNoBg',
  'switchNoText',
]

// Every treatment CSS var any theme defines - removed before each applyTheme so
// a theme without a given treatment doesn't inherit the previous theme's.
const ALL_TREATMENT_VARS = Array.from(
  new Set(Object.values(THEMES).flatMap((t) => Object.keys(t.treatments ?? {}))),
)

export const DEFAULT_THEME: ThemeId = 'etas-eats'

const THEME_STORAGE_KEY = 'etas-eats-theme'

// Write the palette's hexes onto :root as the CSS vars. Colours cascade live.
export function applyTheme(id: ThemeId): void {
  const theme = THEMES[id] ?? THEMES[DEFAULT_THEME]
  const root = document.documentElement
  for (const key of Object.keys(CSS_VARS) as (keyof Palette)[]) {
    root.style.setProperty(CSS_VARS[key], theme.palette[key])
  }
  // On-sheet variants: the override when the theme defines one, else the base
  // value (so `.sheet-scope`'s var() references are always valid).
  for (const key of SHEET_SCOPED_KEYS) {
    root.style.setProperty(`${CSS_VARS[key]}-sheet`, theme.onSheet?.[key] ?? theme.palette[key])
  }
  // Treatment vars (gradients / print backgrounds): clear all, then set this
  // theme's, so a theme never inherits another's print.
  for (const v of ALL_TREATMENT_VARS) root.style.removeProperty(v)
  if (theme.treatments) {
    for (const [v, val] of Object.entries(theme.treatments)) {
      if (val != null) root.style.setProperty(v, val)
    }
  }
  root.style.setProperty('--app-font', theme.font)
  root.style.setProperty('--app-font-display', theme.fontDisplay ?? theme.font)
  root.style.setProperty('--app-font-display-style', theme.fontDisplayStyle ?? 'normal')
  // The home-indicator strip sits outside the web viewport on iOS standalone and is
  // painted from the body background's solid colour (image/gradient layers are dropped
  // there). Use each theme's flat navBg so the strip matches the nav's base tone.
  root.style.setProperty('--nav-strip-bg', theme.palette.navBg)
}

// Persisted theme choice (localStorage; falls back to default if unavailable).
export function loadThemeId(): ThemeId {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v && v in THEMES) return v as ThemeId
  } catch {
    // ignore (private mode / blocked storage)
  }
  return DEFAULT_THEME
}

export function saveThemeId(id: ThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id)
  } catch {
    // ignore
  }
}

// Top-level entry type -> emoji.
export const ENTRY_TYPE_EMOJI: Record<EntryTypeEnum, string> = {
  food: '🍔',
  symptom: '🤒',
  activity: '💪🏻',
}

// Display label + colours per entry type. `border` is the accent colour used
// around pills/chips and for the little type dots.
export interface EntryTypeMeta {
  label: string
  bg: string // chip background
  text: string // chip text
  border: string // chip left accent / dot colour
}

export const ENTRY_TYPE_META: Record<EntryTypeEnum, EntryTypeMeta> = {
  food: {
    label: 'Food',
    bg: COLORS.foodEntryBg,
    text: COLORS.foodEntryText,
    border: COLORS.foodEntryBorder,
  },
  activity: {
    label: 'Activity',
    bg: COLORS.activityEntryBg,
    text: COLORS.activityEntryText,
    border: COLORS.activityEntryBorder,
  },
  symptom: {
    label: 'Symptom',
    bg: COLORS.symptomEntryBg,
    text: COLORS.symptomEntryText,
    border: COLORS.symptomEntryBorder,
  },
}

// The order entry types appear in everywhere (calendar filters + form pills).
export const ENTRY_TYPE_ORDER: EntryTypeEnum[] = ['food', 'activity', 'symptom']

// The two special (non-entry-type) calendar filter chips, themed like
// ENTRY_TYPE_META. `border` is the selected accent colour; `display` is what's
// rendered; `label` is the accessible name. They share PILL_BG_COLOUR too.
export interface ChipMeta {
  label: string
  display: string
  border: string
}

export const FILTER_CHIP_META: Record<'all' | 'trigger', ChipMeta> = {
  all: { label: 'All types', display: 'All', border: COLORS.allPillBorder },
  trigger: { label: 'Only triggers', display: '🚩', border: COLORS.triggerPillBorder },
}

// Bottom-nav tab -> emoji.
export const TAB_EMOJI: Record<Tab, string> = {
  calendar: '🗓️',
  tracker: '📋',
  analysis: '🔬',
  settings: '⚙️',
  about: '❓',
}

// Shared pill/chip base so the calendar filter chips and the form pills are
// the same size and shape. Callers add their own active/colour styling.
export const PILL_CLASS = 'shrink-0 rounded-full border-2 px-2.5 py-1 text-sm'

// Constant background for every pill/chip, selected or not. Only the border
// colour changes to show selection.
export const PILL_BG_COLOUR = COLORS.pillBg

// Border colour for an unselected pill/chip.
export const PILL_BORDER_IDLE = COLORS.pillBorderIdle
