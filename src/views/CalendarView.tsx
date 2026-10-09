import { useCallback, useEffect, useState } from 'react'
import { CalendarGrid } from '../components/CalendarGrid'
import { Fab } from '../components/Fab'
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
} from '../lib/theme'
import { useDecor } from '../lib/theme-context'
import { useBackToClose } from '../lib/use-back-to-close'
import { FilterChip } from '../components/FilterChip'
import { WaveAccent } from '../components/decor'

// 11:11 header strip: the wave fades out by ~120px, behind the status bar and the
// month/filter rows only (never the grid).
const HEADER_WAVE_MASK =
  'linear-gradient(180deg,#000 0%,rgba(0,0,0,.6) 45%,transparent 100%)'

type ViewMode = 'week' | 'day'

// Remembered across tab switches (the view remounts) within a session.
let savedAnchor: Date | null = null
let savedViewMode: ViewMode = 'week'
let savedActiveTypes: Set<EntryTypeEnum> = new Set()
let savedOnlyTriggers = false

function visibleDays(anchor: Date, mode: ViewMode): Date[] {
  return mode === 'week' ? weekDays(anchor) : [anchor]
}

export function CalendarView() {
  const decor = useDecor()
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

  // Device Back closes an open entry form instead of switching tabs.
  useBackToClose(creating !== null || editing !== null, () => {
    setCreating(null)
    setEditing(null)
  })

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
      ? `${monthAbbr(first)}-${monthAbbr(last)} ${shortYear(last)}`
      : `${monthAbbr(first)} ${shortYear(first)}-${monthAbbr(last)} ${shortYear(last)}`

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
              e.entryType === 'symptom' ||
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
    'flex h-8 w-7 shrink-0 items-center justify-center rounded-lg text-xl text-text-secondary active:bg-divider'

  return (
    <div
      className="relative flex h-full flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* 11:11: faint wave strip behind the status bar + header rows. */}
      {decor.headerWave && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[120px] overflow-hidden">
          <WaveAccent opacity={0.26} mask={HEADER_WAVE_MASK} />
        </div>
      )}

      {/* Row 1: date nav (arrows flank the month) + Today + Week/Day */}
      <div className="relative flex shrink-0 items-center justify-between gap-2 px-2 py-2">
        <div className="flex min-w-0 items-center gap-0.5">
          <button
            type="button"
            className={arrowBtn}
            aria-label={`Previous ${unit}`}
            onClick={() => step(-1)}
          >
            ‹
          </button>
          <h1 className="font-display truncate text-[22px] font-extrabold text-text-primary">
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
            className="tap rounded-full px-3.5 py-2 text-sm font-medium text-text-secondary"
            style={{ backgroundColor: COLORS.pillBg }}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'week' ? 'day' : 'week')}
            aria-label={
              viewMode === 'week' ? 'Switch to Day view' : 'Switch to Week view'
            }
            className="relative flex w-28 shrink-0 rounded-full p-0.5 text-sm"
            style={{ backgroundColor: COLORS.switchTrack }}
          >
            {/* Inset sliding thumb - slides to the active option. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full transition-transform duration-200 ease-out"
              style={{
                transform: viewMode === 'day' ? 'translateX(100%)' : 'translateX(0)',
                backgroundColor: COLORS.segmentActiveBg,
              }}
            />
            {(['week', 'day'] as ViewMode[]).map((m) => (
              <span
                key={m}
                className={`relative z-10 flex-1 py-1.5 text-center ${
                  viewMode === m ? 'font-semibold text-segment-active-text' : 'text-text-secondary'
                }`}
              >
                {m === 'week' ? 'Week' : 'Day'}
              </span>
            ))}
          </button>
        </div>
      </div>

      {/* Row 2: filters (full width, scrollable) */}
      <div className="relative flex shrink-0 items-center gap-1.5 overflow-x-auto px-3 pb-2">
        <FilterChip
          label={FILTER_CHIP_META.all.display}
          name={FILTER_CHIP_META.all.label}
          className="ml-auto"
          active={activeTypes.size === 0}
          accent={FILTER_CHIP_META.all.border}
          onClick={() => setActiveTypes(new Set())}
        />
        <span className="mx-0.5 w-px shrink-0 self-stretch bg-divider" />
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
        <span className="mx-0.5 w-px shrink-0 self-stretch bg-divider" />
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
      <Fab onClick={openCreate} />

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
