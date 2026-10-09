import { useCallback, useEffect, useState } from 'react'
import { EntryForm } from '../components/EntryForm'
import { FilterChip } from '../components/FilterChip'
import { FilterCard, FilterDivider, FilterRow, PeriodRow } from '../components/filter-bar'
import { TrackerDayCard } from '../components/TrackerDayCard'
import { HeartWatermark, WaveAccent } from '../components/decor'
import type { Entry, EntryTypeEnum } from '../db/db'
import { getAllEntries } from '../db/entries'
import { parseDateKey } from '../lib/calendar'
import { type Period, periodStart, withinPeriod } from '../lib/period'
import {
  ENTRY_TYPE_EMOJI,
  ENTRY_TYPE_META,
  ENTRY_TYPE_ORDER,
  FILTER_CHIP_META,
} from '../lib/theme'
import { useDecor } from '../lib/theme-context'
import { useBackToClose } from '../lib/use-back-to-close'

const HEADER_WAVE_MASK =
  'linear-gradient(180deg,#000 0%,rgba(0,0,0,.6) 45%,transparent 100%)'

// Remembered across tab switches (the view remounts) within a session.
let savedTypes: Set<EntryTypeEnum> = new Set()
let savedOnlyTriggers = false
let savedPeriod: Period = '3d'

export function TrackerView() {
  const decor = useDecor()
  const [activeTypes, setActiveTypes] = useState<Set<EntryTypeEnum>>(() => savedTypes)
  const [onlyTriggers, setOnlyTriggers] = useState(() => savedOnlyTriggers)
  const [period, setPeriod] = useState<Period>(() => savedPeriod)
  const [days, setDays] = useState<{ date: string; entries: Entry[] }[]>([])
  const [editing, setEditing] = useState<Entry | null>(null)

  useBackToClose(editing !== null, () => setEditing(null))

  useEffect(() => {
    savedTypes = activeTypes
    savedOnlyTriggers = onlyTriggers
    savedPeriod = period
  }, [activeTypes, onlyTriggers, period])

  const load = useCallback(async () => {
    const start = periodStart(period, new Date())
    const all = await getAllEntries()
    const filtered = all.filter((e) => {
      if (!withinPeriod(e.date, start)) return false
      if (activeTypes.size > 0 && !activeTypes.has(e.entryType)) return false
      if (onlyTriggers) {
        if (e.entryType !== 'food' && e.entryType !== 'activity') return false
        if (!e.possibleTrigger) return false
      }
      return true
    })
    const byDay = new Map<string, Entry[]>()
    for (const e of filtered) {
      const group = byDay.get(e.date)
      if (group) group.push(e)
      else byDay.set(e.date, [e])
    }
    setDays(
      [...byDay.entries()]
        .map(([date, entries]) => ({ date, entries }))
        .sort((a, b) => parseDateKey(b.date).getTime() - parseDateKey(a.date).getTime()),
    )
  }, [activeTypes, onlyTriggers, period])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    load()
  }, [load])

  function toggleType(t: EntryTypeEnum) {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
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
      <HeartWatermark />
      {decor.headerWave && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[120px] overflow-hidden">
          <WaveAccent opacity={0.26} mask={HEADER_WAVE_MASK} />
        </div>
      )}

      <div className="relative shrink-0 pt-2">
        <FilterCard>
          <FilterRow>
            <FilterChip
              label={FILTER_CHIP_META.all.display}
              name={FILTER_CHIP_META.all.label}
              active={activeTypes.size === 0}
              accent={FILTER_CHIP_META.all.border}
              onClick={() => setActiveTypes(new Set())}
            />
            <span className="mx-0.5 w-px shrink-0 self-stretch bg-divider" />
            {ENTRY_TYPE_ORDER.map((t) => (
              <FilterChip
                key={t}
                label={ENTRY_TYPE_EMOJI[t]}
                name={ENTRY_TYPE_META[t].label}
                active={activeTypes.has(t)}
                accent={ENTRY_TYPE_META[t].border}
                onClick={() => toggleType(t)}
              />
            ))}
            <span className="mx-0.5 w-px shrink-0 self-stretch bg-divider" />
            <FilterChip
              label={FILTER_CHIP_META.trigger.display}
              name={FILTER_CHIP_META.trigger.label}
              active={onlyTriggers}
              accent={FILTER_CHIP_META.trigger.border}
              onClick={() => setOnlyTriggers((v) => !v)}
            />
          </FilterRow>
          <FilterDivider />
          <PeriodRow value={period} onChange={setPeriod} />
        </FilterCard>
        <div
          className="mx-auto h-[1px] w-3/4"
          style={{ backgroundColor: ENTRY_TYPE_META.symptom.border }}
        />
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {days.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-text-muted">
            No entries in this range. Log some on the calendar and they'll show up here.
          </p>
        ) : (
          <div className="flex flex-col gap-3 px-3 pb-3 pt-2">
            {days.map(({ date, entries }) => (
              <TrackerDayCard
                key={date}
                date={date}
                entries={entries}
                onSelect={setEditing}
              />
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EntryForm
          entry={editing}
          initialDateKey={editing.date}
          initialTime={editing.time}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await load()
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}
