import { describe, expect, it } from 'vitest'
import {
  SLOTS_PER_DAY,
  addDays,
  addWeeks,
  currentSlot,
  dateKeyToInput,
  formatLongDate,
  inputToDateKey,
  isSameDay,
  minutesToTime,
  monthAbbr,
  monthName,
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
})
