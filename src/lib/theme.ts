// Central visual theme: colours, emojis, ordering and shared sizing.
// Colours are driven by CSS custom properties so the active theme can be
// swapped at runtime (see THEMES / applyTheme). Edit THEMES to restyle.
import type { EntryTypeEnum } from '../db/db'
import type { Tab } from '../components/BottomNav'

// Every themeable colour. A theme supplies a hex for each of these.
export interface Palette {
  primaryAction: string // FAB, Save, active toggles, today marker, Yes switch
  appBg: string // app background
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
}

// Palette key -> CSS custom property name. `primaryAction` uses --color-primary
// so Tailwind's `primary` utilities (bg-primary, text-primary, ...) pick it up.
const CSS_VARS: Record<keyof Palette, string> = {
  primaryAction: '--color-primary',
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
}

// The colour API the app uses: each value is a `var(--...)` reference, so it
// always reflects the active theme. Keys match Palette.
export const COLORS = Object.fromEntries(
  (Object.keys(CSS_VARS) as (keyof Palette)[]).map((k) => [k, `var(${CSS_VARS[k]})`]),
) as Record<keyof Palette, string>

// ---------------------------------------------------------------------------
// Themes. Add entries here; each supplies a full Palette.
// ---------------------------------------------------------------------------
export type ThemeId = 'etas-eats' | 'cunty-leopard' | 'trashy-2000s' | 'one-eleven'

export interface Theme {
  label: string
  font: string // CSS font-family stack applied app-wide
  palette: Palette
}

export const THEMES: Record<ThemeId, Theme> = {
  'etas-eats': {
    label: 'EtasEats',
    font: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    palette: {
      primaryAction: '#6B00EB',
      appBg: '#fff8f3',
      foodEntryBg: '#e7f5e9',
      foodEntryText: '#1b5e20',
      foodEntryBorder: '#4caf50',
      activityEntryBg: '#e6f0fb',
      activityEntryText: '#0d47a1',
      activityEntryBorder: '#2196f3',
      symptomEntryBg: '#fde7ea',
      symptomEntryText: '#DB6E00',
      symptomEntryBorder: '#FF8F20',
      allPillBorder: '#0C0C0C',
      triggerPillBorder: '#BA0D0D',
      pillBg: '#ffffff',
      pillBorderIdle: '#d4d4d4',
      navFont: '#737373',
      navSelectedFont: '#0C0C0C',
      navBg: '#ffffff',
      fabBg: '#4caf50',
      settingsButtonBg: '#ffffff',
      sheetBg: '#ffffff',
    },
  },
  // Placeholder palettes - random-ish, recolour freely.
  'cunty-leopard': {
    label: 'Cunty Leopard',
    font: "'Georgia', 'Times New Roman', serif",
    palette: {
      primaryAction: '#A8781C',
      appBg: '#F5E9D0',
      foodEntryBg: '#efe3c4',
      foodEntryText: '#5c4512',
      foodEntryBorder: '#C8912B',
      activityEntryBg: '#e7dcc0',
      activityEntryText: '#4a3b1a',
      activityEntryBorder: '#8B5E34',
      symptomEntryBg: '#f3d9d1',
      symptomEntryText: '#6b2310',
      symptomEntryBorder: '#B5462A',
      allPillBorder: '#2b2111',
      triggerPillBorder: '#8B1A1A',
      pillBg: '#fffaf0',
      pillBorderIdle: '#d8cdb3',
      navFont: '#8a7a56',
      navSelectedFont: '#5c4512',
      navBg: '#efe3c4',
      fabBg: '#A8781C',
      settingsButtonBg: '#fffaf0',
      sheetBg: '#fffaf0',
    },
  },
  'trashy-2000s': {
    label: 'Trashy 2000s',
    font: "'Comic Sans MS', 'Comic Sans', cursive",
    palette: {
      primaryAction: '#FF2D95',
      appBg: '#eafaff',
      foodEntryBg: '#dcffe4',
      foodEntryText: '#0a6b2b',
      foodEntryBorder: '#2bd40f',
      activityEntryBg: '#d6f7ff',
      activityEntryText: '#004e66',
      activityEntryBorder: '#00C2D9',
      symptomEntryBg: '#ffe0f3',
      symptomEntryText: '#8a0050',
      symptomEntryBorder: '#FF2D95',
      allPillBorder: '#00111a',
      triggerPillBorder: '#FF2D95',
      pillBg: '#ffffff',
      pillBorderIdle: '#bfe9f2',
      navFont: '#7aa7b3',
      navSelectedFont: '#FF2D95',
      navBg: '#c9f2ff',
      fabBg: '#00C2D9',
      settingsButtonBg: '#ffffff',
      sheetBg: '#ffffff',
    },
  },
  'one-eleven': {
    label: '1:11',
    font: "'Palatino Linotype', 'Palatino', 'Book Antiqua', serif",
    palette: {
      primaryAction: '#7C6CF0',
      appBg: '#f6f4ff',
      foodEntryBg: '#e9f7ef',
      foodEntryText: '#2f6b4f',
      foodEntryBorder: '#6FCF97',
      activityEntryBg: '#eef0ff',
      activityEntryText: '#3a3f8f',
      activityEntryBorder: '#8A7FFF',
      symptomEntryBg: '#fdeef3',
      symptomEntryText: '#8a2e55',
      symptomEntryBorder: '#D98AB0',
      allPillBorder: '#3a3357',
      triggerPillBorder: '#C9A227',
      pillBg: '#ffffff',
      pillBorderIdle: '#ddd8f0',
      navFont: '#9a93c0',
      navSelectedFont: '#7C6CF0',
      navBg: '#efecff',
      fabBg: '#C9A227',
      settingsButtonBg: '#ffffff',
      sheetBg: '#ffffff',
    },
  },
}

export const DEFAULT_THEME: ThemeId = 'etas-eats'

const THEME_STORAGE_KEY = 'etas-eats-theme'

// Write the palette's hexes onto :root as the CSS vars. Colours cascade live.
export function applyTheme(id: ThemeId): void {
  const theme = THEMES[id] ?? THEMES[DEFAULT_THEME]
  const root = document.documentElement
  for (const key of Object.keys(CSS_VARS) as (keyof Palette)[]) {
    root.style.setProperty(CSS_VARS[key], theme.palette[key])
  }
  root.style.setProperty('--app-font', theme.font)
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
  food: '🍴',
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
  triggers: '⚠️',
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
