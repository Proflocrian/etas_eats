import { useState } from 'react'
import { LastSymptoms } from '../components/LastSymptoms'
import { TriggerList } from '../components/TriggerList'

type SubTab = 'symptoms' | 'list'

const TABS: { id: SubTab; emoji: string; label: string }[] = [
  { id: 'symptoms', emoji: '🤒', label: 'Last Symptoms' },
  { id: 'list', emoji: '🚩', label: 'Trigger List' },
]

export function TriggersView() {
  const [tab, setTab] = useState<SubTab>('symptoms')

  return (
    <div
      className="flex h-full flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="shrink-0 px-3 py-2">
        <div className="flex rounded-lg border border-neutral-300 p-0.5 text-sm">
          {TABS.map(({ id, emoji, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 ${
                tab === id
                  ? 'bg-[#e5556e] font-semibold text-white'
                  : 'text-neutral-600'
              }`}
            >
              <span role="img" aria-hidden="true">
                {emoji}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'symptoms' ? <LastSymptoms /> : <TriggerList />}
      </div>
    </div>
  )
}
