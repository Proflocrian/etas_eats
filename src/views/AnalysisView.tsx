import { useEffect, useRef, useState } from 'react'
import { FilterChip } from '../components/FilterChip'
import { FilterDivider, FilterRow, PeriodRow } from '../components/filter-bar'
import { LastSymptoms } from '../components/LastSymptoms'
import { TriggerList, type TriggerType } from '../components/TriggerList'
import { WaveAccent } from '../components/decor'
import type { SymptomTypeEnum } from '../db/db'
import { SYMPTOM_TYPE_LABELS } from '../lib/entryTypes'
import type { Period } from '../lib/period'
import { COLORS, ENTRY_TYPE_EMOJI, ENTRY_TYPE_META, FILTER_CHIP_META } from '../lib/theme'
import { useDecor } from '../lib/theme-context'

const HEADER_WAVE_MASK =
  'linear-gradient(180deg,#000 0%,rgba(0,0,0,.6) 45%,transparent 100%)'

type SubTab = 'symptoms' | 'list'

const TABS: { id: SubTab; emoji: string; label: string }[] = [
  { id: 'symptoms', emoji: '🤒', label: 'Last Symptoms' },
  { id: 'list', emoji: '🚩', label: 'Trigger List' },
]

const TRIGGER_TYPES: TriggerType[] = ['food', 'activity']

// Ordered so the two rows of the 3-col grid hold roughly equal total label widths.
const SYMPTOM_FILTER_ORDER: SymptomTypeEnum[] = [
  'heartburn',
  'abdominal-pain',
  'bloating',
  'regurgitation',
  'nausea',
  'other',
]

// Remembered across tab switches (the view remounts) within a session.
let savedSubTab: SubTab = 'symptoms'
let savedSymptomTypes: Set<SymptomTypeEnum> = new Set()
let savedSymptomPeriod: Period = 'week'
let savedTriggerTypes: Set<TriggerType> = new Set()
let savedTriggerPeriod: Period = 'week'

export function AnalysisView() {
  const [tab, setTab] = useState<SubTab>(() => savedSubTab)
  const decor = useDecor()

  const [symptomTypes, setSymptomTypes] = useState<Set<SymptomTypeEnum>>(
    () => savedSymptomTypes,
  )
  const [symptomPeriod, setSymptomPeriod] = useState<Period>(() => savedSymptomPeriod)
  const [triggerTypes, setTriggerTypes] = useState<Set<TriggerType>>(
    () => savedTriggerTypes,
  )
  const [triggerPeriod, setTriggerPeriod] = useState<Period>(() => savedTriggerPeriod)

  useEffect(() => {
    savedSubTab = tab
    savedSymptomTypes = symptomTypes
    savedSymptomPeriod = symptomPeriod
    savedTriggerTypes = triggerTypes
    savedTriggerPeriod = triggerPeriod
  }, [tab, symptomTypes, symptomPeriod, triggerTypes, triggerPeriod])

  function toggleSymptom(t: SymptomTypeEnum) {
    setSymptomTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }
  function toggleTriggerType(t: TriggerType) {
    setTriggerTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

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
      {decor.headerWave && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[120px] overflow-hidden">
          <WaveAccent opacity={0.26} mask={HEADER_WAVE_MASK} />
        </div>
      )}
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

      <div className="relative shrink-0">
        {tab === 'symptoms' ? (
          <>
            <div className="grid grid-cols-3 gap-1.5 px-3 pb-1.5">
              <FilterChip
                className="col-span-3 w-full"
                label={FILTER_CHIP_META.all.display}
                name={FILTER_CHIP_META.all.label}
                active={symptomTypes.size === 0}
                accent={FILTER_CHIP_META.all.border}
                onClick={() => setSymptomTypes(new Set())}
              />
              {SYMPTOM_FILTER_ORDER.map((t) => (
                <FilterChip
                  key={t}
                  className="w-full"
                  label={SYMPTOM_TYPE_LABELS[t]}
                  active={symptomTypes.has(t)}
                  accent={ENTRY_TYPE_META.symptom.border}
                  onClick={() => toggleSymptom(t)}
                />
              ))}
            </div>
            <FilterDivider />
            <PeriodRow value={symptomPeriod} onChange={setSymptomPeriod} />
            <FilterDivider />
          </>
        ) : (
          <>
            <FilterRow>
              <FilterChip
                label={FILTER_CHIP_META.all.display}
                name={FILTER_CHIP_META.all.label}
                active={triggerTypes.size === 0}
                accent={FILTER_CHIP_META.all.border}
                onClick={() => setTriggerTypes(new Set())}
              />
              <span className="mx-0.5 w-px shrink-0 self-stretch bg-divider" />
              {TRIGGER_TYPES.map((t) => (
                <FilterChip
                  key={t}
                  label={ENTRY_TYPE_EMOJI[t]}
                  name={ENTRY_TYPE_META[t].label}
                  active={triggerTypes.has(t)}
                  accent={ENTRY_TYPE_META[t].border}
                  onClick={() => toggleTriggerType(t)}
                />
              ))}
            </FilterRow>
            <FilterDivider />
            <PeriodRow value={triggerPeriod} onChange={setTriggerPeriod} />
            <FilterDivider />
          </>
        )}
      </div>

      <div
        className="relative min-h-0 flex-1 overflow-y-auto"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClickCapture={(e) => {
          if (didSwipe.current) {
            e.stopPropagation()
            didSwipe.current = false
          }
        }}
      >
        {tab === 'symptoms' ? (
          <LastSymptoms symptomTypes={symptomTypes} period={symptomPeriod} />
        ) : (
          <TriggerList entryTypes={triggerTypes} period={triggerPeriod} />
        )}
      </div>
    </div>
  )
}
