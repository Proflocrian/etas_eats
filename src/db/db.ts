import Dexie, { type EntityTable } from 'dexie'

// Top-level kind of a calendar entry (the discriminant).
export type EntryTypeEnum = 'food' | 'activity' | 'symptom'

// Sub-kinds.
export type FoodEntryTypeEnum = 'meal' | 'snack' | 'drink'
export type SymptomTypeEnum =
  | 'heartburn'
  | 'regurgitation'
  | 'abdominal-pain'
  | 'nausea'
  | 'bloating'
  | 'other'

// Fields shared by every entry.
interface BaseEntry {
  id?: number
  date: string // 'DD-MM-YYYY', calendar grouping key
  time: string // 'HH:MM', slot start
  notes?: string
  createdAt: number
  updatedAt: number
}

export interface FoodEntry extends BaseEntry {
  entryType: 'food'
  foodType: FoodEntryTypeEnum
  food: string // what was eaten / drunk
  quantity?: string // optional free text, e.g. '1 bowl', '200g'
  calories?: number
}

export interface ActivityEntry extends BaseEntry {
  entryType: 'activity'
  activity: string // what she did, e.g. 'Lay down', 'Walk'
}

export interface SymptomEntry extends BaseEntry {
  entryType: 'symptom'
  symptomTypes: SymptomTypeEnum[] // one or more, at least one
}

export type Entry = FoodEntry | ActivityEntry | SymptomEntry

// Distribute Omit/Partial over the union so each variant keeps its own fields
// (a plain Omit/Partial on a union would collapse to the shared fields only).
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never
export type DistributivePartial<T> = T extends unknown ? Partial<T> : never

// Fields supplied on create; id and timestamps are managed by the DAL.
export type NewEntry = DistributiveOmit<Entry, 'id' | 'createdAt' | 'updatedAt'>

export const db = new Dexie('etas-eats') as Dexie & {
  entries: EntityTable<Entry, 'id'>
}

db.version(1).stores({
  entries: '++id, date, entryType',
})

// v2: symptom entries went from a single `symptomType` to `symptomTypes[]`.
// Migrate any existing records; the removed 'chest-pain' maps to 'other'.
db.version(2)
  .stores({ entries: '++id, date, entryType' })
  .upgrade((tx) =>
    tx
      .table('entries')
      .toCollection()
      .modify(
        (e: {
          entryType?: string
          symptomType?: string
          symptomTypes?: SymptomTypeEnum[]
        }) => {
          if (e.entryType === 'symptom' && !e.symptomTypes && e.symptomType) {
            const mapped = e.symptomType === 'chest-pain' ? 'other' : e.symptomType
            e.symptomTypes = [mapped as SymptomTypeEnum]
            delete e.symptomType
          }
        },
      ),
  )
