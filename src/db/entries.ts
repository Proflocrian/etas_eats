import { entryDateTime } from '../lib/calendar'
import {
  db,
  type DistributivePartial,
  type Entry,
  type NewEntry,
  type SymptomEntry,
  type TriggerableEntry,
} from './db'

export async function addEntry(input: NewEntry): Promise<number> {
  const now = Date.now()
  const record = { ...input, createdAt: now, updatedAt: now } as Entry
  return db.entries.add(record) as Promise<number>
}

export async function getEntry(id: number): Promise<Entry | undefined> {
  return db.entries.get(id)
}

// Order within a single day: by time, then by creation order.
function byTimeThenCreated(a: Entry, b: Entry): number {
  if (a.time !== b.time) return a.time < b.time ? -1 : 1
  return a.createdAt - b.createdAt
}

// Entries for one 'DD-MM-YYYY' date, ordered by time then creation.
export async function getEntriesByDate(date: string): Promise<Entry[]> {
  const entries = await db.entries.where('date').equals(date).toArray()
  return entries.sort(byTimeThenCreated)
}

// Entries for several 'DD-MM-YYYY' dates, grouped by date and ordered within
// each day. Every requested key is present in the result (empty array if none),
// so callers can index by date without null checks. Used to load a week/day.
export async function getEntriesByDates(
  dateKeys: string[],
): Promise<Record<string, Entry[]>> {
  const grouped: Record<string, Entry[]> = {}
  for (const key of dateKeys) grouped[key] = []

  const entries = await db.entries.where('date').anyOf(dateKeys).toArray()
  for (const entry of entries) {
    ;(grouped[entry.date] ??= []).push(entry)
  }

  for (const key of Object.keys(grouped)) grouped[key].sort(byTimeThenCreated)
  return grouped
}

// Every entry in chronological order - used for CSV export.
export async function getAllEntries(): Promise<Entry[]> {
  const entries = await db.entries.toArray()
  return entries.sort((a, b) => {
    const da = toSortableDate(a.date)
    const dbb = toSortableDate(b.date)
    if (da !== dbb) return da < dbb ? -1 : 1
    if (a.time !== b.time) return a.time < b.time ? -1 : 1
    return a.createdAt - b.createdAt
  })
}

// 'DD-MM-YYYY' -> 'YYYYMMDD' so dates compare chronologically.
function toSortableDate(date: string): string {
  const [d, m, y] = date.split('-')
  return `${y}${m}${d}`
}

// A lexically comparable 'YYYYMMDDHH:MM' key for an entry's datetime.
function dateTimeKey(e: { date: string; time: string }): string {
  return `${toSortableDate(e.date)}${e.time}`
}

// Newest-first by datetime.
function byDateTimeDesc(a: Entry, b: Entry): number {
  const ka = dateTimeKey(a)
  const kb = dateTimeKey(b)
  return ka === kb ? b.createdAt - a.createdAt : ka < kb ? 1 : -1
}

// The most recent symptom entries, newest first (for the Triggers view).
export async function getRecentSymptoms(limit = 5): Promise<SymptomEntry[]> {
  const symptoms = (await db.entries
    .where('entryType')
    .equals('symptom')
    .toArray()) as SymptomEntry[]
  return symptoms.sort(byDateTimeDesc).slice(0, limit)
}

// Up to `limit` Food/Activity entries strictly before a datetime and within
// `maxHoursBefore` of it, closest (most recent) first. Spans days.
export async function getEntriesBefore(
  dateKey: string,
  time: string,
  limit = 5,
  maxHoursBefore = 48,
): Promise<TriggerableEntry[]> {
  const entries = (await db.entries
    .where('entryType')
    .anyOf(['food', 'activity'])
    .toArray()) as TriggerableEntry[]
  const target = entryDateTime(dateKey, time).getTime()
  const earliest = target - maxHoursBefore * 60 * 60 * 1000
  return entries
    .filter((e) => {
      const t = entryDateTime(e.date, e.time).getTime()
      return t < target && t >= earliest
    })
    .sort(byDateTimeDesc)
    .slice(0, limit)
}

// All Food/Activity entries flagged as possible triggers, newest first.
export async function getPossibleTriggers(): Promise<TriggerableEntry[]> {
  const entries = (await db.entries
    .where('entryType')
    .anyOf(['food', 'activity'])
    .toArray()) as TriggerableEntry[]
  return entries.filter((e) => e.possibleTrigger).sort(byDateTimeDesc)
}

export async function updateEntry(
  id: number,
  changes: DistributivePartial<NewEntry>,
): Promise<number> {
  const patch = { ...changes, updatedAt: Date.now() }
  return db.entries.update(id, patch as DistributivePartial<Entry>)
}

// Replace an entry wholesale. Used when editing: if the entryType changed, a
// merging update would leave stale fields from the old variant, so we put the
// full record. Caller preserves id and createdAt; updatedAt is bumped here.
export async function replaceEntry(entry: Entry): Promise<number> {
  return db.entries.put({ ...entry, updatedAt: Date.now() }) as Promise<number>
}

export async function deleteEntry(id: number): Promise<void> {
  return db.entries.delete(id)
}
