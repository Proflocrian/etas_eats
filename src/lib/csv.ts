import type { Entry } from '../db/db'
import { SYMPTOM_TYPE_LABELS } from './entryTypes'

const HEADERS = [
  'Date',
  'Time',
  'Type',
  'Food',
  'Quantity',
  'Activity',
  'Symptoms',
  'Possible Trigger',
  'Notes',
  'Created',
  'Updated',
]

function esc(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function rowFor(e: Entry): string[] {
  const food = e.entryType === 'food' ? e.food : ''
  const quantity = e.entryType === 'food' ? (e.quantity ?? '') : ''
  const activity = e.entryType === 'activity' ? e.activity : ''
  const symptoms =
    e.entryType === 'symptom'
      ? e.symptomTypes.map((s) => SYMPTOM_TYPE_LABELS[s]).join('; ')
      : ''
  const trigger =
    e.entryType === 'food' || e.entryType === 'activity'
      ? e.possibleTrigger
        ? 'Yes'
        : 'No'
      : ''
  return [
    e.date,
    e.time,
    e.entryType[0].toUpperCase() + e.entryType.slice(1),
    food,
    quantity,
    activity,
    symptoms,
    trigger,
    e.notes ?? '',
    new Date(e.createdAt).toISOString(),
    new Date(e.updatedAt).toISOString(),
  ]
}

export function entriesToCsv(entries: Entry[]): string {
  return [HEADERS, ...entries.map(rowFor)]
    .map((cols) => cols.map(esc).join(','))
    .join('\r\n')
}
