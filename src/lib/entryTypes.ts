import type { Entry, SymptomTypeEnum } from '../db/db'

export const FOOD_PLACEHOLDERS: string[] = [
  'Girl Dinner 💅 (Just Rice)',
  'Cookie (That Dyllan Hid)',
  'Cocktails With Bbz 🍸',
  'Matcha (Smh)',
  'Fish & Veggies (Nice!)',
  'Scrambled Eggs 🥚 (Nice!)',
  'Pizza (Wtf Babe?)',
  'Spicy Noodles (Silly Girl)',
  'Sad Salad 🥗',
  "Dyllan's Stolen Fries",
  "Cwosssant 🥐 (Is It Sunday? 👀)",
  'Midnight Toast 🍞',
  'Smoothie (Pretending Its Healthy)',
  'Chocolate 🍫 (Emotional Support)',
  'Just Snacks Tbh',
  'Water (Finally!) 💧',
]

export const ACTIVITY_PLACEHOLDERS: string[] = [
  'Gym 🏋️‍♀️',
  'Sex with Dyllan 🥵',
  'Nap 😴',
  'Lay Down After Eating (Oops)',
  'Hot Girl Walk 🚶‍♀️',
  'Yoga (Ish) With The Roomies',
  'Doomscrolling',
  'Overthinking',
  'Argued With Dyllan (He Won Xxx)',
  'Ran for the Tram 🏃‍♀️',
  'Cried (Dyllan Slept Too Late 👀)',
  'Pottery (Should Have No Affect Babe)',
  'Was Stressed 🖤',
  'Danced with Dyllan xxx',
]

export const SYMPTOM_TYPE_LABELS: Record<SymptomTypeEnum, string> = {
  heartburn: 'Heartburn',
  regurgitation: 'Regurgitation',
  'abdominal-pain': 'Stomach Pain',
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

// The text shown on a calendar chip for an entry. Pass `t` to translate the symptom
// labels; without it (e.g. CSV export) they fall back to the English labels.
export function entryTitle(entry: Entry, t?: (key: string) => string): string {
  switch (entry.entryType) {
    case 'food':
      return entry.food
    case 'activity':
      return entry.activity
    case 'symptom':
      return entry.symptomTypes
        .map((s) => (t ? t(`symptom.${s}`) : SYMPTOM_TYPE_LABELS[s]))
        .join(', ')
  }
}
