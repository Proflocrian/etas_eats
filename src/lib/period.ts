import { parseDateKey } from './calendar'

export type Period = 'all' | '3d' | 'week' | 'month'

export const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: 'all', label: 'All time' },
  { id: '3d', label: '3 days' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

const PERIOD_DAYS: Record<Exclude<Period, 'all'>, number> = {
  '3d': 3,
  week: 7,
  month: 30,
}

// Earliest date (local midnight) a period includes, or null for 'all time'.
export function periodStart(period: Period, now: Date): Date | null {
  if (period === 'all') return null
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  start.setDate(start.getDate() - (PERIOD_DAYS[period] - 1))
  return start
}

export function withinPeriod(dateKey: string, start: Date | null): boolean {
  return start === null || parseDateKey(dateKey).getTime() >= start.getTime()
}
