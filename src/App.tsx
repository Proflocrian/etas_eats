import { useEffect, useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { Sparkles } from './components/decor'
import { useDecor } from './lib/theme-context'
import { AboutView } from './views/AboutView'
import { CalendarView } from './views/CalendarView'
import { SettingsView } from './views/SettingsView'
import { TriggersView } from './views/TriggersView'

// 2000s background glimmer: stars scattered across the screen, twinkling in place.
const BG_SPARKLES = [
  { left: '8%', top: '12%', size: 14, delay: '0s' },
  { left: '22%', top: '31%', size: 10, delay: '1s' },
  { left: '14%', top: '63%', size: 16, delay: '0.5s' },
  { left: '34%', top: '83%', size: 11, delay: '1.5s' },
  { left: '47%', top: '18%', size: 12, delay: '0.3s' },
  { left: '41%', top: '52%', size: 9, delay: '1.7s' },
  { left: '60%', top: '44%', size: 10, delay: '1.2s' },
  { left: '72%', top: '72%', size: 15, delay: '0.8s' },
  { left: '85%', top: '22%', size: 11, delay: '1.9s' },
  { left: '90%', top: '55%', size: 14, delay: '0.4s' },
  { left: '55%', top: '90%', size: 10, delay: '2.2s' },
  { left: '78%', top: '37%', size: 10, delay: '0.9s' },
]

function App() {
  // Always launch on the Calendar (home); tab is not persisted across launches.
  const [tab, setTab] = useState<Tab>('calendar')
  const decor = useDecor()

  useEffect(() => {
    // Calendar is the base history entry, so Back from it exits the app.
    window.history.replaceState({ tab: 'calendar' }, '')

    // The device/browser Back button navigates between tabs.
    function onPop(e: PopStateEvent) {
      setTab((e.state?.tab as Tab) ?? 'calendar')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Pause the 11:11 wave drift while the app is backgrounded, to save battery.
  useEffect(() => {
    function onVisibility() {
      document.documentElement.classList.toggle('app-hidden', document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Switching tabs pushes history so Back returns to the previous tab.
  function changeTab(next: Tab) {
    if (next === tab) return
    window.history.pushState({ tab: next }, '')
    setTab(next)
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Fixed app-background layer. Flat themes leave --app-bg-layer unset, so the
          body's app-bg colour shows; patterned themes (e.g. leopard) paint a print
          here, behind all content. iOS ignores background-attachment:fixed, hence a
          real fixed element. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: -1, background: 'var(--app-bg-layer, transparent)' }}
      />
      {/* 2000s: stars twinkling in place over the velour, for a little glimmer. */}
      {decor.bgSparkle && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: -1 }}
        >
          <Sparkles stars={BG_SPARKLES} color="#FFFFFF" big />
        </div>
      )}
      {/* min-h-0 lets the active view own its own vertical scroll. */}
      <main className="min-h-0 flex-1 overflow-hidden">
        {tab === 'calendar' && <CalendarView />}
        {tab === 'triggers' && <TriggersView />}
        {tab === 'settings' && <SettingsView />}
        {tab === 'about' && <AboutView />}
      </main>
      <BottomNav active={tab} onChange={changeTab} />
    </div>
  )
}

export default App
