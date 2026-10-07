// Pure date/time helpers for the calendar grid.
// Dates are handled in local time; the storage key format is 'DD-MM-YYYY'.

export const SLOT_MINUTES = 30
export const SLOTS_PER_DAY = (24 * 60) / SLOT_MINUTES // 48

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
