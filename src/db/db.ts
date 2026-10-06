import Dexie, { type EntityTable } from 'dexie'

export type EntryType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink'

export interface Entry {
  id?: number
  date: string // 'DD-MM-YYYY'
  entryType: EntryType
  time: string // 'HH:MM'
  food: string
  quantity?: string
  notes?: string
  calories?: number
  createdAt: number
  updatedAt: number
}

// Fields supplied on create; id and timestamps are managed by the DAL.
export type NewEntry = Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>

export const db = new Dexie('etas-eats') as Dexie & {
  entries: EntityTable<Entry, 'id'>
}

db.version(1).stores({
  entries: '++id, date, entryType',
})
