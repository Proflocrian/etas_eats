import { useCallback, useEffect, useState } from 'react'
import { CalendarGrid } from '../components/CalendarGrid'
import { EntryForm } from '../components/EntryForm'
import type { Entry, EntryTypeEnum } from '../db/db'
import { getEntriesByDates } from '../db/entries'
import {
  addDays,
  addWeeks,
  currentSlot,
  isSameDay,
  monthAbbr,
  shortYear,
  toDateKey,
  weekDays,
} from '../lib/calendar'
import { ENTRY_TYPE_META } from '../lib/entryTypes'

type ViewMode = 'week' | 'day'

// Filter chip order requested: All | Food | Symptom | Activity.
const FILTER_ORDER: EntryTypeEnum[] = ['food', 'symptom', 'activity']

const TYPE_EMOJI: Record<EntryTypeEnum, string> = {
  food: '🍴',
  symptom: '🤒',
  activity: '🏋🏼‍♀️',
}

function visibleDays(anchor: Date, mode: ViewMode): Date[] {
  return mode === 'week' ? weekDays(anchor) : [anchor]
}

function FilterChip({
  label,
  name,
  active,
  activeStyle,
  onClick,
  className = '',
}: {
  label: string
  name?: string // accessible name when the label is an emoji
  active: boolean
  activeStyle: React.CSSProperties
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={name ?? label}
      title={name}
      className={`min-w-[2.5rem] shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-center text-sm ${className} ${
        active ? 'border-transparent font-semibold' : 'border-neutral-300 text-neutral-500'
      }`}
      style={active ? activeStyle : undefined}
    >
      {label}
    </button>
  )
}

export function CalendarView() {
  // `anchor` is any date within the visible range.
  const [anchor, setAnchor] = useState<Date>(() => new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  // Empty set means "All types".
  const [activeTypes, setActiveTypes] = useState<Set<EntryTypeEnum>>(new Set())
  const [onlyTriggers, setOnlyTriggers] = useState(false)
  const [entriesByDate, setEntriesByDate] = useState<Record<string, Entry[]>>({})
  const [creating, setCreating] = useState<{ dateKey: string; time: string } | null>(
    null,
  )
  const [editing, setEditing] = useState<Entry | null>(null)

  const reload = useCallback(async () => {
    const keys = visibleDays(anchor, viewMode).map(toDateKey)
    setEntriesByDate(await getEntriesByDates(keys))
  }, [anchor, viewMode])

  // Load from IndexedDB (an external store) on mount and whenever the range
  // changes. setState lands after an await, not synchronously.
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    reload()
  }, [reload])

  const days = visibleDays(anchor, viewMode)
  const first = days[0]
  const last = days[days.length - 1]
  const sameMonth =
    first.getMonth() === last.getMonth() &&
    first.getFullYear() === last.getFullYear()
  const sameYear = first.getFullYear() === last.getFullYear()
  const monthLabel = sameMonth
    ? `${monthAbbr(first)} ${shortYear(first)}`
    : sameYear
      ? `${monthAbbr(first)} - ${monthAbbr(last)} ${shortYear(last)}`
      : `${monthAbbr(first)} ${shortYear(first)} - ${monthAbbr(last)} ${shortYear(last)}`

  // Apply the type + trigger filters before handing entries to the grid.
  const needsFilter = activeTypes.size > 0 || onlyTriggers
  const visibleByDate = !needsFilter
    ? entriesByDate
    : Object.fromEntries(
        Object.entries(entriesByDate).map(([k, list]) => [
          k,
          list.filter((e) => {
            const typeOk = activeTypes.size === 0 || activeTypes.has(e.entryType)
            const triggerOk =
              !onlyTriggers ||
              ((e.entryType === 'food' || e.entryType === 'activity') &&
                e.possibleTrigger)
            return typeOk && triggerOk
          }),
        ]),
      )

  function step(n: number) {
    setAnchor((a) => (viewMode === 'week' ? addWeeks(a, n) : addDays(a, n)))
  }

  function toggleType(t: EntryTypeEnum) {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  // FAB create: default to today if it's in view, else the first visible day.
  function openCreate() {
    const today = new Date()
    const date = days.some((d) => isSameDay(d, today)) ? today : days[0]
    setCreating({ dateKey: toDateKey(date), time: currentSlot() })
  }

  const unit = viewMode === 'week' ? 'week' : 'day'
  const arrowBtn =
    'flex h-8 w-7 shrink-0 items-center justify-center rounded-lg text-lg text-neutral-600 active:bg-neutral-200'

  return (
    <div
      className="relative flex h-full flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Row 1: date nav (arrows flank the month) + Today + Week/Day */}
      <div className="flex shrink-0 items-center justify-between gap-2 px-2 py-2">
        <div className="flex min-w-0 items-center gap-0.5">
          <button
            type="button"
            className={arrowBtn}
            aria-label={`Previous ${unit}`}
            onClick={() => step(-1)}
          >
            ‹
          </button>
          <h1 className="truncate text-base font-bold text-neutral-800">
            {monthLabel}
          </h1>
          <button
            type="button"
            className={arrowBtn}
            aria-label={`Next ${unit}`}
            onClick={() => step(1)}
          >
            ›
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setAnchor(new Date())}
            className="rounded-lg px-2 py-1 text-sm font-medium text-neutral-700 active:bg-neutral-200"
          >
            Today
          </button>
          <div className="flex shrink-0 rounded-lg border border-neutral-300 p-0.5 text-sm">
            {(['week', 'day'] as ViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setViewMode(m)}
                className={`rounded-md px-2.5 py-1 ${
                  viewMode === m
                    ? 'bg-[#e5556e] font-semibold text-white'
                    : 'text-neutral-600'
                }`}
              >
                {m === 'week' ? 'Week' : 'Day'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: filters (full width, scrollable) */}
      <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto px-3 pb-2">
        <FilterChip
          label="All"
          name="All types"
          className="ml-auto"
          active={activeTypes.size === 0}
          activeStyle={{ backgroundColor: '#404040', color: '#fff' }}
          onClick={() => setActiveTypes(new Set())}
        />
        <span className="mx-0.5 w-px shrink-0 self-stretch bg-neutral-200" />
        {FILTER_ORDER.map((t) => {
          const meta = ENTRY_TYPE_META[t]
          return (
            <FilterChip
              key={t}
              label={TYPE_EMOJI[t]}
              name={meta.label}
              active={activeTypes.has(t)}
              activeStyle={{ backgroundColor: meta.border, color: '#fff' }}
              onClick={() => toggleType(t)}
            />
          )
        })}
        <span className="mx-0.5 w-px shrink-0 self-stretch bg-neutral-200" />
        <FilterChip
          label="🚩"
          name="Only triggers"
          active={onlyTriggers}
          activeStyle={{ backgroundColor: '#e5556e', color: '#fff' }}
          onClick={() => setOnlyTriggers((v) => !v)}
        />
      </div>

      <CalendarGrid
        days={days}
        entriesByDate={visibleByDate}
        onSlotTap={(dateKey, time) => setCreating({ dateKey, time })}
        onEntryTap={(entry) => setEditing(entry)}
      />

      {/* Floating add button - create at a chosen date/time. */}
      <button
        type="button"
        onClick={openCreate}
        aria-label="Add entry"
        className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e5556e] text-3xl leading-none text-white shadow-lg active:brightness-95"
      >
        +
      </button>

      {creating && (
        <EntryForm
          initialDateKey={creating.dateKey}
          initialTime={creating.time}
          onClose={() => setCreating(null)}
          onSaved={async () => {
            await reload()
            setCreating(null)
          }}
        />
      )}

      {editing && (
        <EntryForm
          entry={editing}
          initialDateKey={editing.date}
          initialTime={editing.time}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await reload()
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}
