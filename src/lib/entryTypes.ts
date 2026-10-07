import type {
  Entry,
  EntryTypeEnum,
  FoodEntryTypeEnum,
  SymptomTypeEnum,
} from '../db/db'

// Display label + colours for each top-level entry type.
// Colours are applied via inline styles (Tailwind can't JIT dynamic values).
export interface EntryTypeMeta {
  label: string
  bg: string // chip background
  text: string // chip text
  border: string // chip left accent
}

export const ENTRY_TYPE_META: Record<EntryTypeEnum, EntryTypeMeta> = {
  food: { label: 'Food', bg: '#e7f5e9', text: '#1b5e20', border: '#4caf50' },
  activity: { label: 'Activity', bg: '#e6f0fb', text: '#0d47a1', border: '#2196f3' },
  symptom: { label: 'Symptom', bg: '#fde7ea', text: '#9b1c2e', border: '#e5556e' },
}

export const ENTRY_TYPE_OPTIONS: EntryTypeEnum[] = ['food', 'activity', 'symptom']

export const FOOD_TYPE_LABELS: Record<FoodEntryTypeEnum, string> = {
  meal: 'Meal',
  snack: 'Snack',
  drink: 'Drink',
}
export const FOOD_TYPE_OPTIONS: FoodEntryTypeEnum[] = ['meal', 'snack', 'drink']

// Placeholder for the Food text field, by food type.
export const FOOD_PLACEHOLDERS: Record<FoodEntryTypeEnum, string> = {
  meal: 'Fish & Veggies | Girl Dinner (Just Rice)',
  snack: 'Cookie (that Dyllan hid from me)',
  drink: 'Matcha | Cocktail with bbz',
}

export const SYMPTOM_TYPE_LABELS: Record<SymptomTypeEnum, string> = {
  heartburn: 'Heartburn',
  regurgitation: 'Regurgitation',
  'abdominal-pain': 'Abdominal Pain',
  nausea: 'Nausea',
  bloating: 'Bloating',
  other: 'Other (Notes)',
}
export const SYMPTOM_TYPE_OPTIONS: SymptomTypeEnum[] = [
  'heartburn',
  'regurgitation',
  'abdominal-pain',
  'nausea',
  'bloating',
  'other',
]

// The text shown on a calendar chip for an entry.
export function entryTitle(entry: Entry): string {
  switch (entry.entryType) {
    case 'food':
      return entry.food
    case 'activity':
      return entry.activity
    case 'symptom':
      return entry.symptomTypes.map((s) => SYMPTOM_TYPE_LABELS[s]).join(', ')
  }
}
