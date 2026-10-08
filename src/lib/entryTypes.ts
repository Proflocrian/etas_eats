import type { Entry, SymptomTypeEnum } from '../db/db'

export const FOOD_PLACEHOLDERS: string[] = [
  'Girl Dinner 💅 (Just Rice)',
  'Cookie (That Dyllan Hid)',
  'Cocktails with bbz 🍸',
  'Matchaaa 🍵',
  'Fish & Veggies 🐟',
  'Leftover Pizza 🍕 (No Regrets)',
  'Iced Oat Latte ☕',
  'Spicy Noodles 🌶️ (Risky)',
  'Sad Desk Salad 🥗',
  'Midnight Toast 🍞',
  'Smoothie (Pretending Its Healthy)',
  'Chocolate 🍫 (Emotional Support)',
  'Pasta for Two 🍝',
  'Just Snacks Tbh',
  'Water (Finally) 💧',
]

export const ACTIVITY_PLACEHOLDERS: string[] = [
  'Gym 🏋️‍♀️',
  'Sex with Dyllan 🥵',
  'Nap 😴',
  'Lay Down After Eating (Oops)',
  'Hot Girl Walk 🚶‍♀️',
  'Yoga (Ish)',
  'Doomscrolling in Bed 📱',
  'Ran for the Bus 🏃‍♀️',
  'Cried a Little (Normal)',
  'Pilates 🧘‍♀️',
  'Pottery (Should Have No Affect Babe)',
  'Was stressed',
  'Late Night Snack Raid',
  'Danced with Dyllan xxx',
  'Big Stretch 🙆‍♀️',
]

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
