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

function visibleDays(anchor: Date, mode: ViewMode): Date[] {
  return mode === 'week' ? weekDays(anchor) : [anchor]
}

function FilterChip({
  label,
  active,
  activeStyle,
  onClick,
}: {
  label: string
  active: boolean
  activeStyle: React.CSSProperties
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs ${
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

  // Apply the type filter before handing entries to the grid.
  const visibleByDate =
    activeTypes.size === 0
      ? entriesByDate
      : Object.fromEntries(
          Object.entries(entriesByDate).map(([k, list]) => [
            k,
            list.filter((e) => activeTypes.has(e.entryType)),
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
  const navBtn =
    'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-neutral-700 active:bg-neutral-200'

  return (
    <div
      className="relative flex h-full flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Title + range nav */}
      <div className="flex shrink-0 items-center justify-between px-3 py-2">
        <h1 className="text-lg font-bold text-neutral-800">{monthLabel}</h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={navBtn}
            aria-label={`Previous ${unit}`}
            onClick={() => step(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className={`${navBtn} text-sm font-medium`}
            onClick={() => setAnchor(new Date())}
          >
            Today
          </button>
          <button
            type="button"
            className={navBtn}
            aria-label={`Next ${unit}`}
            onClick={() => step(1)}
          >
            ›
          </button>
        </div>
      </div>

      {/* Week/Day toggle + type filter */}
      <div className="flex shrink-0 items-center justify-between gap-2 px-3 pb-2">
        <div className="flex shrink-0 rounded-lg border border-neutral-300 p-0.5 text-sm">
          {(['week', 'day'] as ViewMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setViewMode(m)}
              className={`rounded-md px-3 py-1 ${
                viewMode === m
                  ? 'bg-[#e5556e] font-semibold text-white'
                  : 'text-neutral-600'
              }`}
            >
              {m === 'week' ? 'Week' : 'Day'}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          <FilterChip
            label="All"
            active={activeTypes.size === 0}
            activeStyle={{ backgroundColor: '#404040', color: '#fff' }}
            onClick={() => setActiveTypes(new Set())}
          />
          {FILTER_ORDER.map((t) => {
            const meta = ENTRY_TYPE_META[t]
            return (
              <FilterChip
                key={t}
                label={meta.label}
                active={activeTypes.has(t)}
                activeStyle={{ backgroundColor: meta.border, color: '#fff' }}
                onClick={() => toggleType(t)}
              />
            )
          })}
        </div>
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
