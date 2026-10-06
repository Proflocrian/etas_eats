import { useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { AboutView } from './views/AboutView'
import { CalendarView } from './views/CalendarView'
import { TriggersView } from './views/TriggersView'

function App() {
  const [tab, setTab] = useState<Tab>('calendar')

  return (
    <div className="flex h-full flex-col bg-[#fff8f3]">
      {/* min-h-0 lets the active view own its own vertical scroll. */}
      <main className="min-h-0 flex-1 overflow-hidden">
        {tab === 'calendar' && <CalendarView />}
        {tab === 'triggers' && <TriggersView />}
        {tab === 'about' && <AboutView />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
