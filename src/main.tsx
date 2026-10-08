import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyTheme, loadThemeId } from './lib/theme'

// Apply the saved theme before first paint so there's no flash of the default.
applyTheme(loadThemeId())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
