import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db, type FoodEntry, type NewEntry } from './db'
import {
  addEntry,
  deleteEntry,
  getAllEntries,
  getEntriesBefore,
  getEntriesByDate,
  getEntriesByDates,
  getEntry,
  getPossibleTriggers,
  getRecentSymptoms,
  replaceEntry,
  updateEntry,
} from './entries'

const sample: NewEntry = {
  date: '06-10-2026',
  entryType: 'food',
  time: '13:00',
  food: 'Pasta',
  quantity: '1 bowl',
  possibleTrigger: false,
}

beforeEach(async () => {
  await db.entries.clear()
})

describe('entries data layer', () => {
  it('adds an entry and reads it back with managed fields', async () => {
    const id = await addEntry(sample)
    const entry = await getEntry(id)

    expect(entry).toMatchObject(sample)
    expect(entry?.id).toBe(id)
    expect(entry?.createdAt).toBeTypeOf('number')
    expect(entry?.updatedAt).toBe(entry?.createdAt)
  })

  it('updates an entry and bumps updatedAt', async () => {
    const id = await addEntry(sample)
    const before = await getEntry(id)

    await updateEntry(id, { food: 'Risotto', quantity: '2 bowls' })
    const after = (await getEntry(id)) as FoodEntry | undefined

    expect(after?.food).toBe('Risotto')
    expect(after?.quantity).toBe('2 bowls')
    expect(after?.createdAt).toBe(before?.createdAt)
    expect(after?.updatedAt).toBeGreaterThanOrEqual(before!.updatedAt)
  })

  it('deletes an entry', async () => {
    const id = await addEntry(sample)
    await deleteEntry(id)
    expect(await getEntry(id)).toBeUndefined()
  })

  it('replaceEntry swaps variant without leaving stale fields', async () => {
    const id = await addEntry(sample) // a food entry
    const before = await getEntry(id)

    await replaceEntry({
      id,
      entryType: 'symptom',
      symptomTypes: ['heartburn'],
      date: sample.date,
      time: sample.time,
      createdAt: before!.createdAt,
      updatedAt: before!.updatedAt,
    })
    const after = await getEntry(id)

    expect(after?.entryType).toBe('symptom')
    expect((after as { food?: string }).food).toBeUndefined()
    expect(after?.id).toBe(id)
    expect(after?.createdAt).toBe(before?.createdAt)
    expect(after?.updatedAt).toBeGreaterThanOrEqual(before!.updatedAt)
  })

  it('getEntriesByDate returns only that day, ordered by time', async () => {
    await addEntry({ ...sample, time: '13:00', food: 'Lunch' })
    await addEntry({ ...sample, time: '08:00', food: 'Breakfast' })
    await addEntry({ ...sample, date: '07-10-2026', food: 'Other day' })

    const day = await getEntriesByDate('06-10-2026')
    expect(day.map((e) => (e as FoodEntry).food)).toEqual(['Breakfast', 'Lunch'])
  })

  it('getAllEntries returns every entry in chronological order', async () => {
    await addEntry({ ...sample, date: '07-10-2026', food: 'Second day' })
    await addEntry({ ...sample, date: '06-10-2026', food: 'First day' })
    await addEntry({ ...sample, date: '06-10-2026', time: '08:00', food: 'Earlier' })

    const all = await getAllEntries()
    expect(all.map((e) => (e as FoodEntry).food)).toEqual([
      'Earlier',
      'First day',
      'Second day',
    ])
  })

  it('getEntriesByDates groups by day, sorted, with empty days present', async () => {
    await addEntry({ ...sample, date: '06-10-2026', time: '13:00', food: 'Lunch' })
    await addEntry({ ...sample, date: '06-10-2026', time: '08:00', food: 'Breakfast' })
    await addEntry({ ...sample, date: '08-10-2026', food: 'Thursday' })

    const byDate = await getEntriesByDates(['06-10-2026', '07-10-2026', '08-10-2026'])

    expect(Object.keys(byDate).sort()).toEqual([
      '06-10-2026',
      '07-10-2026',
      '08-10-2026',
    ])
    expect(byDate['06-10-2026'].map((e) => (e as FoodEntry).food)).toEqual([
      'Breakfast',
      'Lunch',
    ])
    expect(byDate['07-10-2026']).toEqual([]) // requested day with no entries
    expect(byDate['08-10-2026'].map((e) => (e as FoodEntry).food)).toEqual([
      'Thursday',
    ])
  })

  it('getRecentSymptoms returns symptoms newest-first, capped', async () => {
    await addEntry({
      date: '06-10-2026',
      time: '08:00',
      entryType: 'symptom',
      symptomTypes: ['heartburn'],
    })
    await addEntry({
      date: '06-10-2026',
      time: '13:00',
      entryType: 'symptom',
      symptomTypes: ['nausea'],
    })
    await addEntry({ ...sample, time: '09:00' }) // food, ignored

    const recent = await getRecentSymptoms(5)
    expect(recent.map((s) => s.time)).toEqual(['13:00', '08:00'])
  })

  it('getEntriesBefore returns food/activity before a datetime, closest first', async () => {
    await addEntry({ ...sample, time: '08:00', food: 'Breakfast' })
    await addEntry({ ...sample, time: '10:00', food: 'Snack' })
    await addEntry({
      date: '06-10-2026',
      time: '11:00',
      entryType: 'activity',
      activity: 'Walk',
      possibleTrigger: false,
    })
    await addEntry({ ...sample, time: '14:00', food: 'After' }) // excluded (after)
    await addEntry({ ...sample, date: '03-10-2026', time: '10:00', food: 'TooOld' }) // >48h before

    const before = await getEntriesBefore('06-10-2026', '13:00', 5)
    expect(
      before.map((e) => (e.entryType === 'food' ? e.food : e.activity)),
    ).toEqual(['Walk', 'Snack', 'Breakfast'])
  })

  it('getPossibleTriggers returns only flagged entries, newest first', async () => {
    await addEntry({ ...sample, time: '08:00', food: 'Plain', possibleTrigger: false })
    await addEntry({ ...sample, time: '09:00', food: 'Spicy', possibleTrigger: true })
    await addEntry({
      date: '07-10-2026',
      time: '07:00',
      entryType: 'activity',
      activity: 'Run',
      possibleTrigger: true,
    })

    const triggers = await getPossibleTriggers()
    expect(
      triggers.map((e) => (e.entryType === 'food' ? e.food : e.activity)),
    ).toEqual(['Run', 'Spicy'])
  })
})
