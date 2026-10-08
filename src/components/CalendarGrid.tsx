import { useLayoutEffect, useRef, useState } from 'react'
import type { Entry } from '../db/db'
import {
  SLOTS_PER_DAY,
  SLOT_MINUTES,
  dayNumber,
  isSameDay,
  slotRangeLabel,
  timeSlots,
  timeToMinutes,
  toDateKey,
  weekdayShort,
} from '../lib/calendar'
import { entryTitle } from '../lib/entryTypes'
import { ENTRY_TYPE_META } from '../lib/theme'

const ROW_H = 28 // px per 30-min slot
const HOUR_H = ROW_H * 2
const GUTTER = 52 // px width of the left time gutter
const INITIAL_SCROLL_TOP = 6.5 * HOUR_H // open at 06:30

// Remembers the grid scroll position across tab switches (the view remounts)
// within a session. Unset on first app load, so the app opens at 06:30.
let savedScrollTop: number | null = null

function slotIndexOf(time: string): number {
  return Math.floor(timeToMinutes(time) / SLOT_MINUTES)
}

export function CalendarGrid({
  days,
  entriesByDate,
  onSlotTap,
  onEntryTap,
  onStep,
}: {
  days: Date[]
  entriesByDate: Record<string, Entry[]>
  onSlotTap: (dateKey: string, time: string) => void
  onEntryTap: (entry: Entry) => void
  onStep?: (n: number) => void // horizontal swipe: -1 prev, +1 next
}) {
  const slots = timeSlots()
  const scrollRef = useRef<HTMLDivElement>(null)
  // Captured once on mount; used only to highlight today's column.
  const [today] = useState(() => new Date())

  // Restore the remembered scroll on mount; first app load lands at 06:30.
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = savedScrollTop ?? INITIAL_SCROLL_TOP
  }, [])

  // Horizontal swipe -> previous/next range. The grid only scrolls vertically,
  // so a mostly-horizontal drag is free to use for navigation.
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
      onStep?.(dx < 0 ? 1 : -1) // swipe left -> next, right -> prev
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Day header - aligned to the grid columns below via the same gutter. */}
      <div className="flex shrink-0 border-b border-neutral-200">
        <div className="shrink-0" style={{ width: GUTTER }} />
        {days.map((d) => {
          const isToday = isSameDay(d, today)
          return (
            <div
              key={toDateKey(d)}
              className="flex flex-1 flex-col items-center py-1"
            >
              <span className="text-[11px] font-medium text-neutral-500">
                {weekdayShort(d)}
              </span>
              <span
                className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isToday ? 'bg-primary text-white' : 'text-neutral-800'
                }`}
              >
                {dayNumber(d)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Scrollable time grid (vertical only). */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ touchAction: 'pan-y' }}
        onScroll={(e) => {
          savedScrollTop = e.currentTarget.scrollTop
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClickCapture={(e) => {
          // Swallow the tap that ends a swipe so it doesn't open the create form.
          if (didSwipe.current) {
            e.stopPropagation()
            didSwipe.current = false
          }
        }}
      >
        <div className="flex" style={{ height: SLOTS_PER_DAY * ROW_H }}>
          {/* Time gutter - hour labels straddling the hour lines. */}
          <div className="relative shrink-0" style={{ width: GUTTER }}>
            {Array.from({ length: 24 }, (_, h) => (
              <div
                key={h}
                className="absolute right-1 text-right text-[11px] text-neutral-400"
                style={{ top: h * HOUR_H - 6 }}
              >
                {h > 0 ? `${String(h).padStart(2, '0')}:00` : ''}
              </div>
            ))}
          </div>

          {/* One column per day. */}
          {days.map((d) => {
            const key = toDateKey(d)
            const dayEntries = entriesByDate[key] ?? []

            // Group same-slot entries so they can sit side by side.
            const bySlot = new Map<number, Entry[]>()
            for (const e of dayEntries) {
              const idx = slotIndexOf(e.time)
              const group = bySlot.get(idx)
              if (group) group.push(e)
              else bySlot.set(idx, [e])
            }

            return (
              <div key={key} className="relative flex-1 border-l border-neutral-200">
                {/* Tappable empty slots + grid lines. */}
                {slots.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onSlotTap(key, t)}
                    aria-label={`${weekdayShort(d)} ${dayNumber(d)}, ${slotRangeLabel(t)}`}
                    className={`block w-full border-t ${
                      i % 2 === 0 ? 'border-neutral-200' : 'border-neutral-100'
                    }`}
                    style={{ height: ROW_H }}
                  />
                ))}

                {/* Entry chips positioned over their start slot. */}
                {dayEntries.map((e) => {
                  const idx = slotIndexOf(e.time)
                  const group = bySlot.get(idx) ?? [e]
                  const pos = group.indexOf(e)
                  const w = 100 / group.length
                  const meta = ENTRY_TYPE_META[e.entryType]
                  const isTrigger =
                    (e.entryType === 'food' || e.entryType === 'activity') &&
                    e.possibleTrigger
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => onEntryTap(e)}
                      className="absolute overflow-hidden rounded-md px-1 text-left text-[11px] leading-tight"
                      style={{
                        top: idx * ROW_H + 1,
                        height: ROW_H - 2,
                        left: `calc(${pos * w}% + 1px)`,
                        width: `calc(${w}% - 2px)`,
                        backgroundColor: meta.bg,
                        color: meta.text,
                        borderLeft: `3px solid ${meta.border}`,
                      }}
                    >
                      <span className="block truncate">
                        {isTrigger && '🚩 '}
                        {entryTitle(e)}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
