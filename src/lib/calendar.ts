// Pure date/time helpers for the calendar grid.
// Dates are handled in local time; the storage key format is 'DD-MM-YYYY'.

export const SLOT_MINUTES = 30
export const SLOTS_PER_DAY = (24 * 60) / SLOT_MINUTES // 48
export const MINUTES_PER_DAY = 24 * 60

// An entry lasts 30m..12h, in 30m steps. The 12h cap means it can spill into at
// most the next calendar day (so never more than two rendered blocks).
export const MAX_DURATION_MINUTES = 12 * 60
export const DEFAULT_DURATION_MINUTES = SLOT_MINUTES
export const DURATION_OPTIONS = Array.from(
  { length: MAX_DURATION_MINUTES / SLOT_MINUTES },
  (_, i) => (i + 1) * SLOT_MINUTES,
)

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// Indexed by Date.getDay() (0 = Sunday).
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

// A new Date at local midnight, with any time-of-day stripped.
function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// Date -> 'DD-MM-YYYY'.
export function toDateKey(date: Date): string {
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`
}

// 'DD-MM-YYYY' -> Date at local midnight.
export function parseDateKey(key: string): Date {
  const [d, m, y] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, n: number): Date {
  const d = atMidnight(date)
  d.setDate(d.getDate() + n)
  return d
}

export function addWeeks(date: Date, n: number): Date {
  return addDays(date, n * 7)
}

// Monday of the week containing `date` (local midnight).
export function startOfWeek(date: Date): Date {
  const d = atMidnight(date)
  const daysSinceMonday = (d.getDay() + 6) % 7 // Mon = 0 ... Sun = 6
  d.setDate(d.getDate() - daysSinceMonday)
  return d
}

// The 7 days Mon..Sun of the week containing `date`.
export function weekDays(date: Date): Date[] {
  const monday = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(totalMinutes: number): string {
  const wrapped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  return `${pad2(Math.floor(wrapped / 60))}:${pad2(wrapped % 60)}`
}

// The 48 slot start times, '00:00' .. '23:30'.
export function timeSlots(): string[] {
  return Array.from({ length: SLOTS_PER_DAY }, (_, i) =>
    minutesToTime(i * SLOT_MINUTES),
  )
}

// '13:00' -> '13:00-13:30'. The last slot wraps: '23:30' -> '23:30-00:00'.
export function slotRangeLabel(time: string): string {
  const end = minutesToTime(timeToMinutes(time) + SLOT_MINUTES)
  return `${time}-${end}`
}

export function monthName(date: Date): string {
  return MONTH_NAMES[date.getMonth()]
}

export function monthAbbr(date: Date): string {
  return MONTH_ABBR[date.getMonth()]
}

// Two-digit year, e.g. 2026 -> '26'.
export function shortYear(date: Date): string {
  return String(date.getFullYear()).slice(-2)
}

export function weekdayShort(date: Date): string {
  return WEEKDAY_SHORT[date.getDay()]
}

export function dayNumber(date: Date): number {
  return date.getDate()
}

// e.g. 'Thu, 8 Oct 2026' - used for the entry form's date line.
export function formatLongDate(date: Date): string {
  return `${weekdayShort(date)}, ${date.getDate()} ${MONTH_ABBR[date.getMonth()]} ${date.getFullYear()}`
}

// Conversions to/from the native <input type="date"> value ('YYYY-MM-DD').
export function dateKeyToInput(key: string): string {
  const [d, m, y] = key.split('-')
  return `${y}-${m}-${d}`
}
export function inputToDateKey(value: string): string {
  const [y, m, d] = value.split('-')
  return `${d}-${m}-${y}`
}

// Current time floored to its 30-min slot start, e.g. 09:47 -> '09:30'.
export function currentSlot(now: Date = new Date()): string {
  const mins = now.getHours() * 60 + now.getMinutes()
  return minutesToTime(Math.floor(mins / SLOT_MINUTES) * SLOT_MINUTES)
}

// A Date at the entry's local date + time.
export function entryDateTime(dateKey: string, time: string): Date {
  const d = parseDateKey(dateKey)
  const [h, m] = time.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d
}

// A duration clamped to the valid range and snapped to a 30-min step.
export function normalizeDuration(minutes: number | undefined): number {
  const m = minutes ?? DEFAULT_DURATION_MINUTES
  const snapped = Math.round(m / SLOT_MINUTES) * SLOT_MINUTES
  return Math.min(MAX_DURATION_MINUTES, Math.max(SLOT_MINUTES, snapped))
}

// How an entry occupies the calendar, split across day columns. Returns one
// segment, or two when it crosses midnight (dayOffset 0 = start day, 1 = next).
// topMin/heightMin are minutes within that column's day (0..1440).
export interface DaySegment {
  dayOffset: 0 | 1
  topMin: number
  heightMin: number
}
export function daySegments(startMinutes: number, durationMinutes: number): DaySegment[] {
  const dur = normalizeDuration(durationMinutes)
  const end = startMinutes + dur
  if (end <= MINUTES_PER_DAY) {
    return [{ dayOffset: 0, topMin: startMinutes, heightMin: dur }]
  }
  return [
    { dayOffset: 0, topMin: startMinutes, heightMin: MINUTES_PER_DAY - startMinutes },
    { dayOffset: 1, topMin: 0, heightMin: end - MINUTES_PER_DAY },
  ]
}

// Start-end label, e.g. '13:00-14:30', or '23:30-09:00 (+1d)' across midnight.
export function entryTimeRangeLabel(time: string, durationMinutes: number): string {
  const end = timeToMinutes(time) + normalizeDuration(durationMinutes)
  const crosses = end >= MINUTES_PER_DAY
  return `${time}-${minutesToTime(end)}${crosses ? ' (+1d)' : ''}`
}

// Just the end time, e.g. '14:30', or '01:30 (+1d)' when it crosses midnight.
export function entryEndLabel(time: string, durationMinutes: number): string {
  const end = timeToMinutes(time) + normalizeDuration(durationMinutes)
  return `${minutesToTime(end)}${end >= MINUTES_PER_DAY ? ' (+1d)' : ''}`
}

// Google-Calendar-style column layout for a day's blocks: events that overlap in
// time share the width equally, split into side-by-side columns. Returns, per input
// index, which column the block takes and how many columns its overlap cluster has.
// No right-expansion: a block keeps its column width even where nothing overlaps it.
export interface Lane {
  col: number
  cols: number
}
export function overlapColumns(items: { startMin: number; endMin: number }[]): Lane[] {
  const result: Lane[] = new Array(items.length)
  // Process earliest-starting first (ties: shorter first) so earlier events sit left.
  const order = [...items.keys()].sort(
    (a, b) => items[a].startMin - items[b].startMin || items[a].endMin - items[b].endMin,
  )
  let cluster: number[] = []
  let clusterEnd = -Infinity
  const colEnd: number[] = [] // end-of-last-event per column, reset each cluster
  const colOf = new Map<number, number>()

  const flush = () => {
    for (const idx of cluster) result[idx] = { col: colOf.get(idx)!, cols: colEnd.length }
    cluster = []
    colEnd.length = 0
    clusterEnd = -Infinity
  }

  for (const idx of order) {
    const it = items[idx]
    // A gap with everything so far closes the cluster.
    if (cluster.length && it.startMin >= clusterEnd) flush()
    // First column whose last event has ended; else a new column.
    let col = colEnd.findIndex((end) => end <= it.startMin)
    if (col === -1) {
      col = colEnd.length
      colEnd.push(it.endMin)
    } else {
      colEnd[col] = it.endMin
    }
    colOf.set(idx, col)
    cluster.push(idx)
    clusterEnd = Math.max(clusterEnd, it.endMin)
  }
  if (cluster.length) flush()
  return result
}

// Human gap, e.g. '30m before', '5h before', '5h 30m before', '1d 3h before'.
export function formatGap(minutes: number): string {
  const mins = Math.max(0, Math.round(minutes))
  if (mins < 60) return `${mins}m before`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h < 24) return m ? `${h}h ${m}m before` : `${h}h before`
  const d = Math.floor(h / 24)
  const rh = h % 24
  return rh ? `${d}d ${rh}h before` : `${d}d before`
}
