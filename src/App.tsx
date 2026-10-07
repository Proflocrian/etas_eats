import { useEffect, useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { AboutView } from './views/AboutView'
import { CalendarView } from './views/CalendarView'
import { SettingsView } from './views/SettingsView'
import { TriggersView } from './views/TriggersView'

function App() {
  // Always launch on the Calendar (home); tab is not persisted across launches.
  const [tab, setTab] = useState<Tab>('calendar')

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

  // Switching tabs pushes history so Back returns to the previous tab.
  function changeTab(next: Tab) {
    if (next === tab) return
    window.history.pushState({ tab: next }, '')
    setTab(next)
  }

  return (
    <div className="flex h-full flex-col bg-[#fff8f3]">
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
