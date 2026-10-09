import { useRef, useState } from 'react'
import { LastSymptoms } from '../components/LastSymptoms'
import { TriggerList } from '../components/TriggerList'
import { WaveAccent } from '../components/decor'
import { COLORS } from '../lib/theme'
import { useDecor } from '../lib/theme-context'

const HEADER_WAVE_MASK =
  'linear-gradient(180deg,#000 0%,rgba(0,0,0,.6) 45%,transparent 100%)'

type SubTab = 'symptoms' | 'list'

const TABS: { id: SubTab; emoji: string; label: string }[] = [
  { id: 'symptoms', emoji: '🤒', label: 'Last Symptoms' },
  { id: 'list', emoji: '🚩', label: 'Trigger List' },
]

export function TriggersView() {
  const [tab, setTab] = useState<SubTab>('symptoms')
  const decor = useDecor()

  // Horizontal swipe between the two sub-tabs (like the calendar). There are only
  // two tabs, so each direction has at most one destination: swipe left from Last
  // Symptoms -> Trigger List, swipe right from Trigger List -> Last Symptoms.
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const didSwipe = useRef(false)

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
    didSwipe.current = false
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!touchStart.current) return
    const t = e.touches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) didSwipe.current = true
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && tab === 'symptoms') setTab('list')
      else if (dx > 0 && tab === 'list') setTab('symptoms')
    }
  }

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* 11:11: faint wave strip behind the status bar + sub-tab row. */}
      {decor.headerWave && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[120px] overflow-hidden">
          <WaveAccent opacity={0.26} mask={HEADER_WAVE_MASK} />
        </div>
      )}
      {/* 11:11: a large "11:11" fixed low in the background; content scrolls over it. */}
      {decor.triggersEleven && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[118px] text-center"
          style={{
            color: '#F4F7FB',
            opacity: 0.9,
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: '.04em',
          }}
        >
          11:11
        </div>
      )}
      <div className="relative shrink-0 px-3 py-2">
        {/* Sliding segmented control - grey track + inset thumb (matches Week/Day). */}
        <div
          className="relative flex rounded-full p-0.5 text-sm"
          style={{ backgroundColor: COLORS.switchTrack }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full transition-transform duration-200 ease-out"
            style={{
              transform: tab === 'list' ? 'translateX(100%)' : 'translateX(0)',
              backgroundColor: COLORS.segmentActiveBg,
            }}
          />
          {TABS.map(({ id, emoji, label }) => {
            const isActive = tab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-pressed={isActive}
                className={`tap relative z-10 flex flex-1 items-center justify-center gap-1.5 py-2 ${
                  isActive ? 'font-semibold text-segment-active-text' : 'text-text-secondary'
                }`}
              >
                <span role="img" aria-hidden="true">
                  {emoji}
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="relative min-h-0 flex-1 overflow-y-auto"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClickCapture={(e) => {
          // Swallow the tap that ends a swipe so it doesn't open a detail sheet.
          if (didSwipe.current) {
            e.stopPropagation()
            didSwipe.current = false
          }
        }}
      >
        {tab === 'symptoms' ? <LastSymptoms /> : <TriggerList />}
      </div>
    </div>
  )
}
