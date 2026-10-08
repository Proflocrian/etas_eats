import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  THEMES,
  type Theme,
  type ThemeDecor,
  type ThemeId,
  applyTheme,
  loadThemeId,
  saveThemeId,
} from './theme'

// Active theme as React state, so structural per-theme decor (print trims, special
// FAB, waves, ...) can be conditionally rendered and re-render on a theme switch.
// Colours still flow through CSS vars (applyTheme); this context is only for the
// bits of the UI whose DOM differs between themes.
interface ThemeCtx {
  themeId: ThemeId
  theme: Theme
  setTheme: (id: ThemeId) => void
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // main.tsx already called applyTheme(loadThemeId()) before first paint; mirror it.
  const [themeId, setThemeId] = useState<ThemeId>(() => loadThemeId())

  function setTheme(id: ThemeId) {
    applyTheme(id)
    saveThemeId(id)
    setThemeId(id)
  }

  return (
    <Ctx.Provider value={{ themeId, theme: THEMES[themeId], setTheme }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme must be used within ThemeProvider')
  return v
}

// Convenience: the active theme's decor flags (empty object if none).
export function useDecor(): ThemeDecor {
  return useTheme().theme.decor ?? {}
}
