import { useState } from 'react'
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

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {tab === 'symptoms' ? <LastSymptoms /> : <TriggerList />}
      </div>
    </div>
  )
}
