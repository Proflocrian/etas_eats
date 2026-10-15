import { describe, expect, it } from 'vitest'
import {
  MAX_DURATION_MINUTES,
  SLOTS_PER_DAY,
  addDays,
  addWeeks,
  currentSlot,
  dateKeyToInput,
  daySegments,
  entryDateTime,
  entryEndLabel,
  entryTimeRangeLabel,
  formatGap,
  overlapColumns,
  formatLongDate,
  inputToDateKey,
  isSameDay,
  minutesToTime,
  monthAbbr,
  monthName,
  normalizeDuration,
  parseDateKey,
  shortYear,
  slotRangeLabel,
  startOfWeek,
  timeSlots,
  timeToMinutes,
  toDateKey,
  weekDays,
  weekdayShort,
} from './calendar'

// Reference week: 8 Oct 2026 is a Thursday, so Monday is 5 Oct 2026.
const wed = new Date(2026, 9, 7) // 7 Oct 2026, Wednesday

describe('date keys', () => {
  it('formats a Date as DD-MM-YYYY with padding', () => {
    expect(toDateKey(new Date(2026, 0, 3))).toBe('03-01-2026')
    expect(toDateKey(wed)).toBe('07-10-2026')
  })

  it('round-trips through parseDateKey', () => {
    const d = parseDateKey('05-10-2026')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(9)
    expect(d.getDate()).toBe(5)
    expect(toDateKey(d)).toBe('05-10-2026')
  })
})

describe('week maths', () => {
  it('startOfWeek returns the Monday', () => {
    expect(toDateKey(startOfWeek(wed))).toBe('05-10-2026')
    // Monday maps to itself; Sunday maps back to the same Monday.
    expect(toDateKey(startOfWeek(new Date(2026, 9, 5)))).toBe('05-10-2026')
    expect(toDateKey(startOfWeek(new Date(2026, 9, 11)))).toBe('05-10-2026')
  })

  it('weekDays returns Mon..Sun', () => {
    expect(weekDays(wed).map(toDateKey)).toEqual([
      '05-10-2026',
      '06-10-2026',
      '07-10-2026',
      '08-10-2026',
      '09-10-2026',
      '10-10-2026',
      '11-10-2026',
    ])
  })

  it('addDays and addWeeks roll over months', () => {
    expect(toDateKey(addDays(new Date(2026, 9, 29), 5))).toBe('03-11-2026')
    expect(toDateKey(addWeeks(new Date(2026, 9, 5), 1))).toBe('12-10-2026')
    expect(toDateKey(addWeeks(new Date(2026, 9, 5), -1))).toBe('28-09-2026')
  })

  it('isSameDay ignores time of day', () => {
    expect(isSameDay(new Date(2026, 9, 7, 9, 30), new Date(2026, 9, 7, 23, 0))).toBe(
      true,
    )
    expect(isSameDay(new Date(2026, 9, 7), new Date(2026, 9, 8))).toBe(false)
  })
})

describe('time slots', () => {
  it('produces 48 half-hour slots', () => {
    const slots = timeSlots()
    expect(slots).toHaveLength(SLOTS_PER_DAY)
    expect(slots[0]).toBe('00:00')
    expect(slots[26]).toBe('13:00')
    expect(slots[47]).toBe('23:30')
  })

  it('converts between HH:MM and minutes', () => {
    expect(timeToMinutes('13:00')).toBe(780)
    expect(minutesToTime(780)).toBe('13:00')
    expect(minutesToTime(24 * 60)).toBe('00:00') // wraps
  })

  it('labels a slot as a range, wrapping at midnight', () => {
    expect(slotRangeLabel('13:00')).toBe('13:00-13:30')
    expect(slotRangeLabel('23:30')).toBe('23:30-00:00')
  })
})

describe('display helpers', () => {
  it('names the month and weekday', () => {
    expect(monthName(wed)).toBe('October')
    expect(weekdayShort(new Date(2026, 9, 8))).toBe('Thu')
  })

  it('abbreviates month and year', () => {
    expect(monthAbbr(new Date(2026, 8, 1))).toBe('Sep')
    expect(monthAbbr(wed)).toBe('Oct')
    expect(shortYear(wed)).toBe('26')
  })

  it('formats a long date', () => {
    expect(formatLongDate(new Date(2026, 9, 8))).toBe('Thu, 8 Oct 2026')
  })
})

describe('form helpers', () => {
  it('converts between date key and input value', () => {
    expect(dateKeyToInput('08-10-2026')).toBe('2026-10-08')
    expect(inputToDateKey('2026-10-08')).toBe('08-10-2026')
  })

  it('floors the current time to its slot', () => {
    expect(currentSlot(new Date(2026, 9, 8, 9, 47))).toBe('09:30')
    expect(currentSlot(new Date(2026, 9, 8, 9, 0))).toBe('09:00')
    expect(currentSlot(new Date(2026, 9, 8, 0, 29))).toBe('00:00')
  })

  it('builds a Date from a date key and time', () => {
    const dt = entryDateTime('08-10-2026', '13:30')
    expect(dt.getFullYear()).toBe(2026)
    expect(dt.getMonth()).toBe(9)
    expect(dt.getDate()).toBe(8)
    expect(dt.getHours()).toBe(13)
    expect(dt.getMinutes()).toBe(30)
  })

  it('formats a gap before a symptom', () => {
    expect(formatGap(30)).toBe('30m before')
    expect(formatGap(60)).toBe('1h before')
    expect(formatGap(150)).toBe('2h 30m before')
    expect(formatGap(24 * 60)).toBe('1d before')
    expect(formatGap(26 * 60)).toBe('1d 2h before')
  })
})

describe('entry duration', () => {
  it('normalizes to a 30m step within 30..720', () => {
    expect(normalizeDuration(undefined)).toBe(30)
    expect(normalizeDuration(0)).toBe(30)
    expect(normalizeDuration(44)).toBe(30) // snaps to nearest step
    expect(normalizeDuration(46)).toBe(60)
    expect(normalizeDuration(90)).toBe(90)
    expect(normalizeDuration(10_000)).toBe(MAX_DURATION_MINUTES)
  })

  it('keeps a same-day entry as one segment', () => {
    // 13:00 (780) for 90m stays within the day.
    expect(daySegments(780, 90)).toEqual([
      { dayOffset: 0, topMin: 780, heightMin: 90 },
    ])
  })

  it('splits an entry that crosses midnight into head + tail', () => {
    // 23:30 (1410) for 2h -> 30m head to midnight, 90m tail next day.
    expect(daySegments(1410, 120)).toEqual([
      { dayOffset: 0, topMin: 1410, heightMin: 30 },
      { dayOffset: 1, topMin: 0, heightMin: 90 },
    ])
  })

  it('treats ending exactly at midnight as a single segment', () => {
    // 12:00 (720) + 12h = 24:00 exactly; no next-day block.
    expect(daySegments(720, 720)).toEqual([
      { dayOffset: 0, topMin: 720, heightMin: 720 },
    ])
  })

  it('labels the time range, marking a midnight crossing', () => {
    expect(entryTimeRangeLabel('13:00', 30)).toBe('13:00-13:30')
    expect(entryTimeRangeLabel('13:00', 90)).toBe('13:00-14:30')
    expect(entryTimeRangeLabel('23:30', 120)).toBe('23:30-01:30 (+1d)')
  })

  it('labels just the end time, marking a midnight crossing', () => {
    expect(entryEndLabel('13:00', 90)).toBe('14:30')
    expect(entryEndLabel('23:30', 120)).toBe('01:30 (+1d)')
  })
})

describe('overlap columns', () => {
  it('gives a lone block the full width', () => {
    expect(overlapColumns([{ startMin: 600, endMin: 660 }])).toEqual([{ col: 0, cols: 1 }])
  })

  it('splits overlapping blocks into side-by-side columns, earlier on the left', () => {
    // The screenshot case: Job birthday 13:00-14:00 beside Dance 13:45-15:15.
    expect(
      overlapColumns([
        { startMin: 780, endMin: 840 },
        { startMin: 825, endMin: 915 },
      ]),
    ).toEqual([
      { col: 0, cols: 2 },
      { col: 1, cols: 2 },
    ])
  })

  it('keeps adjacent (touching) blocks full width', () => {
    expect(
      overlapColumns([
        { startMin: 780, endMin: 810 },
        { startMin: 810, endMin: 840 },
      ]),
    ).toEqual([
      { col: 0, cols: 1 },
      { col: 0, cols: 1 },
    ])
  })

  it('reuses a freed column within the same cluster', () => {
    expect(
      overlapColumns([
        { startMin: 0, endMin: 30 },
        { startMin: 10, endMin: 40 },
        { startMin: 35, endMin: 60 },
      ]),
    ).toEqual([
      { col: 0, cols: 2 },
      { col: 1, cols: 2 },
      { col: 0, cols: 2 },
    ])
  })
})
