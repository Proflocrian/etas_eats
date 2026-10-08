import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-bundled fonts (offline, precached by the PWA build). One family per theme,
// plus the two display faces. Variable packages register "<Name> Variable".
import '@fontsource-variable/figtree' // EtasEats (default)
import '@fontsource-variable/jost' // Cunty Leopard body
import '@fontsource-variable/bodoni-moda' // Cunty Leopard display (upright)
import '@fontsource-variable/bodoni-moda/wght-italic.css' // Cunty Leopard display (italic)
import '@fontsource-variable/nunito' // Trashy 2000s body
import '@fontsource/yellowtail' // Trashy 2000s display
import '@fontsource-variable/quicksand' // 11:11
import './index.css'
import App from './App.tsx'
import { applyTheme, loadThemeId } from './lib/theme'
import { ThemeProvider } from './lib/theme-context'

// Apply the saved theme before first paint so there's no flash of the default.
applyTheme(loadThemeId())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
