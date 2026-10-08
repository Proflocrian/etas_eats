import Dexie, { type EntityTable } from 'dexie'

// Top-level kind of a calendar entry (the discriminant).
export type EntryTypeEnum = 'food' | 'activity' | 'symptom'

// Sub-kinds.
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
  food: string // what was eaten / drunk
  quantity?: string // optional free text, e.g. '1 bowl', '200g'
  calories?: number
  possibleTrigger: boolean // flagged as a possible GERD trigger
}

export interface ActivityEntry extends BaseEntry {
  entryType: 'activity'
  activity: string // what she did, e.g. 'Lay down', 'Walk'
  possibleTrigger: boolean // flagged as a possible GERD trigger
}

export interface SymptomEntry extends BaseEntry {
  entryType: 'symptom'
  symptomTypes: SymptomTypeEnum[] // one or more, at least one
}

export type Entry = FoodEntry | ActivityEntry | SymptomEntry

// Entries that can be flagged as a possible trigger (symptoms cannot).
export type TriggerableEntry = FoodEntry | ActivityEntry

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

// v3: Food/Activity entries gained a `possibleTrigger` flag (default false).
db.version(3)
  .stores({ entries: '++id, date, entryType' })
  .upgrade((tx) =>
    tx
      .table('entries')
      .toCollection()
      .modify((e: { entryType?: string; possibleTrigger?: boolean }) => {
        if (
          (e.entryType === 'food' || e.entryType === 'activity') &&
          e.possibleTrigger === undefined
        ) {
          e.possibleTrigger = false
        }
      }),
  )

// v4: the `foodType` sub-kind ('meal'|'snack'|'drink') was removed; a single
// free-text food field now covers all of them. Strip the stale field.
db.version(4)
  .stores({ entries: '++id, date, entryType' })
  .upgrade((tx) =>
    tx
      .table('entries')
      .toCollection()
      .modify((e: { entryType?: string; foodType?: string }) => {
        if (e.entryType === 'food' && e.foodType !== undefined) {
          delete e.foodType
        }
      }),
  )
