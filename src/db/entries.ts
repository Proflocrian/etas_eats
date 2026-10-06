import { db, type Entry, type NewEntry } from './db'

export async function addEntry(input: NewEntry): Promise<number> {
  const now = Date.now()
  return db.entries.add({ ...input, createdAt: now, updatedAt: now }) as Promise<number>
}

export async function getEntry(id: number): Promise<Entry | undefined> {
  return db.entries.get(id)
}

// Entries for one 'DD-MM-YYYY' date, ordered by time then creation.
export async function getEntriesByDate(date: string): Promise<Entry[]> {
  const entries = await db.entries.where('date').equals(date).toArray()
  return entries.sort((a, b) =>
    a.time !== b.time ? (a.time < b.time ? -1 : 1) : a.createdAt - b.createdAt,
  )
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

export async function updateEntry(
  id: number,
  changes: Partial<NewEntry>,
): Promise<number> {
  return db.entries.update(id, { ...changes, updatedAt: Date.now() })
}

export async function deleteEntry(id: number): Promise<void> {
  return db.entries.delete(id)
}
