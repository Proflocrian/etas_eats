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
import {
  COLORS,
  ENTRY_TYPE_EMOJI,
  ENTRY_TYPE_META,
  ENTRY_TYPE_ORDER,
  FILTER_CHIP_META,
  PILL_BG_COLOUR,
  PILL_BORDER_IDLE,
  PILL_CLASS,
} from '../lib/theme'

type ViewMode = 'week' | 'day'

// Remembered across tab switches (the view remounts) within a session.
let savedAnchor: Date | null = null
let savedViewMode: ViewMode = 'week'
let savedActiveTypes: Set<EntryTypeEnum> = new Set()
let savedOnlyTriggers = false

function visibleDays(anchor: Date, mode: ViewMode): Date[] {
  return mode === 'week' ? weekDays(anchor) : [anchor]
}

function FilterChip({
  label,
  name,
  active,
  accent,
  onClick,
  className = '',
}: {
  label: string
  name?: string // accessible name when the label is an emoji
  active: boolean
  accent: string // selected border colour
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
      className={`${PILL_CLASS} min-w-[2.5rem] whitespace-nowrap text-center text-neutral-600 ${className} ${
        active ? 'font-semibold' : ''
      }`}
      style={{
        backgroundColor: PILL_BG_COLOUR,
        borderColor: active ? accent : PILL_BORDER_IDLE,
      }}
    >
      {label}
    </button>
  )
}

export function CalendarView() {
  // `anchor` is any date within the visible range. State is seeded from the
  // session-remembered values so it survives tab switches.
  const [anchor, setAnchor] = useState<Date>(() => savedAnchor ?? new Date())
  const [viewMode, setViewMode] = useState<ViewMode>(() => savedViewMode)
  // Empty set means "All types".
  const [activeTypes, setActiveTypes] = useState<Set<EntryTypeEnum>>(
    () => savedActiveTypes,
  )
  const [onlyTriggers, setOnlyTriggers] = useState(() => savedOnlyTriggers)
  const [entriesByDate, setEntriesByDate] = useState<Record<string, Entry[]>>({})
  const [creating, setCreating] = useState<{ dateKey: string; time: string } | null>(
    null,
  )
  const [editing, setEditing] = useState<Entry | null>(null)

  const reload = useCallback(async () => {
    const keys = visibleDays(anchor, viewMode).map(toDateKey)
    setEntriesByDate(await getEntriesByDates(keys))
  }, [anchor, viewMode])

  // Remember the view state across tab switches (the view remounts).
  useEffect(() => {
    savedAnchor = anchor
    savedViewMode = viewMode
    savedActiveTypes = activeTypes
    savedOnlyTriggers = onlyTriggers
  }, [anchor, viewMode, activeTypes, onlyTriggers])

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
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'week' ? 'day' : 'week')}
            aria-label={
              viewMode === 'week' ? 'Switch to Day view' : 'Switch to Week view'
            }
            className="relative flex w-28 shrink-0 overflow-hidden rounded-lg border border-neutral-300 text-sm"
          >
            {/* Sliding highlight - slides to the active option. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1/2 transition-transform duration-200 ease-out"
              style={{
                transform: viewMode === 'day' ? 'translateX(100%)' : 'translateX(0)',
                backgroundColor: COLORS.primaryAction,
              }}
            />
            {(['week', 'day'] as ViewMode[]).map((m) => (
              <span
                key={m}
                className={`relative z-10 flex-1 py-1 text-center ${
                  viewMode === m ? 'font-semibold text-white' : 'text-neutral-600'
                }`}
              >
                {m === 'week' ? 'Week' : 'Day'}
              </span>
            ))}
          </button>
        </div>
      </div>

      {/* Row 2: filters (full width, scrollable) */}
      <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto px-3 pb-2">
        <FilterChip
          label={FILTER_CHIP_META.all.display}
          name={FILTER_CHIP_META.all.label}
          className="ml-auto"
          active={activeTypes.size === 0}
          accent={FILTER_CHIP_META.all.border}
          onClick={() => setActiveTypes(new Set())}
        />
        <span className="mx-0.5 w-px shrink-0 self-stretch bg-neutral-200" />
        {ENTRY_TYPE_ORDER.map((t) => {
          const meta = ENTRY_TYPE_META[t]
          return (
            <FilterChip
              key={t}
              label={ENTRY_TYPE_EMOJI[t]}
              name={meta.label}
              active={activeTypes.has(t)}
              accent={meta.border}
              onClick={() => toggleType(t)}
            />
          )
        })}
        <span className="mx-0.5 w-px shrink-0 self-stretch bg-neutral-200" />
        <FilterChip
          label={FILTER_CHIP_META.trigger.display}
          name={FILTER_CHIP_META.trigger.label}
          active={onlyTriggers}
          accent={FILTER_CHIP_META.trigger.border}
          onClick={() => setOnlyTriggers((v) => !v)}
        />
      </div>

      <CalendarGrid
        days={days}
        entriesByDate={visibleByDate}
        onSlotTap={(dateKey, time) => setCreating({ dateKey, time })}
        onEntryTap={(entry) => setEditing(entry)}
        onStep={step}
      />

      {/* Floating add button - create at a chosen date/time. */}
      <button
        type="button"
        onClick={openCreate}
        aria-label="Add entry"
        className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg active:brightness-95"
        style={{ backgroundColor: COLORS.fabBg }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
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
