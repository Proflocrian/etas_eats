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
import { ENTRY_TYPE_META, entryTitle } from '../lib/entryTypes'

const ROW_H = 28 // px per 30-min slot
const HOUR_H = ROW_H * 2
const GUTTER = 52 // px width of the left time gutter

function slotIndexOf(time: string): number {
  return Math.floor(timeToMinutes(time) / SLOT_MINUTES)
}

export function CalendarGrid({
  days,
  entriesByDate,
  onSlotTap,
  onEntryTap,
}: {
  days: Date[]
  entriesByDate: Record<string, Entry[]>
  onSlotTap: (dateKey: string, time: string) => void
  onEntryTap: (entry: Entry) => void
}) {
  const slots = timeSlots()
  const scrollRef = useRef<HTMLDivElement>(null)
  const didScroll = useRef(false)
  // Captured once on mount; used only to highlight today's column.
  const [today] = useState(() => new Date())

  // Open at ~07:00 on first mount so she isn't staring at midnight.
  useLayoutEffect(() => {
    if (didScroll.current) return
    const el = scrollRef.current
    if (el) {
      el.scrollTop = 7 * HOUR_H
      didScroll.current = true
    }
  }, [])

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
                  isToday ? 'bg-[#e5556e] text-white' : 'text-neutral-800'
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
                      <span className="block truncate">{entryTitle(e)}</span>
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
