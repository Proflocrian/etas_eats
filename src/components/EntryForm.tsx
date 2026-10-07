import { useState } from 'react'
import type {
  Entry,
  EntryTypeEnum,
  FoodEntryTypeEnum,
  NewEntry,
  SymptomTypeEnum,
} from '../db/db'
import { addEntry, deleteEntry, replaceEntry } from '../db/entries'
import {
  dateKeyToInput,
  inputToDateKey,
  slotRangeLabel,
  timeSlots,
} from '../lib/calendar'
import { DateTimeDialog } from './DateTimeDialog'
import {
  ENTRY_TYPE_META,
  ENTRY_TYPE_OPTIONS,
  FOOD_PLACEHOLDERS,
  FOOD_TYPE_LABELS,
  FOOD_TYPE_OPTIONS,
  SYMPTOM_TYPE_LABELS,
  SYMPTOM_TYPE_OPTIONS,
} from '../lib/entryTypes'

function Pill({
  selected,
  onClick,
  children,
  style,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
        selected
          ? 'border-transparent font-semibold'
          : 'border-neutral-300 text-neutral-600'
      }`}
      style={
        selected
          ? (style ?? { backgroundColor: '#e5556e', color: '#fff' })
          : undefined
      }
    >
      {children}
    </button>
  )
}

const inputClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-base text-neutral-800 outline-none focus:border-[#e5556e]'
const labelClass = 'mb-1 block text-sm font-medium text-neutral-600'

export function EntryForm({
  entry,
  initialDateKey,
  initialTime,
  onClose,
  onSaved,
}: {
  entry?: Entry
  initialDateKey: string
  initialTime: string
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = entry !== undefined

  const [dateKey, setDateKey] = useState(initialDateKey)
  const [time, setTime] = useState(initialTime)
  const [entryType, setEntryType] = useState<EntryTypeEnum>(
    entry?.entryType ?? 'food',
  )
  const [foodType, setFoodType] = useState<FoodEntryTypeEnum>(
    entry?.entryType === 'food' ? entry.foodType : 'meal',
  )
  const [symptomTypes, setSymptomTypes] = useState<Set<SymptomTypeEnum>>(
    () => new Set(entry?.entryType === 'symptom' ? entry.symptomTypes : []),
  )
  const [food, setFood] = useState(entry?.entryType === 'food' ? entry.food : '')
  const [activity, setActivity] = useState(
    entry?.entryType === 'activity' ? entry.activity : '',
  )
  const [quantity, setQuantity] = useState(
    entry?.entryType === 'food' ? (entry.quantity ?? '') : '',
  )
  const [notes, setNotes] = useState(entry?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  const missingRequired =
    (entryType === 'food' && food.trim() === '') ||
    (entryType === 'activity' && activity.trim() === '') ||
    (entryType === 'symptom' && symptomTypes.size === 0)

  function toggleSymptom(st: SymptomTypeEnum) {
    setSymptomTypes((prev) => {
      const next = new Set(prev)
      if (next.has(st)) next.delete(st)
      else next.add(st)
      return next
    })
  }

  function buildNewEntry(): NewEntry {
    const base = { date: dateKey, time, notes: notes.trim() || undefined }
    if (entryType === 'food') {
      return {
        ...base,
        entryType: 'food',
        foodType,
        food: food.trim(),
        quantity: quantity.trim() || undefined,
      }
    }
    if (entryType === 'activity') {
      return { ...base, entryType: 'activity', activity: activity.trim() }
    }
    return { ...base, entryType: 'symptom', symptomTypes: [...symptomTypes] }
  }

  async function handleSave() {
    if (missingRequired || saving) return
    setSaving(true)
    const data = buildNewEntry()
    if (entry) {
      await replaceEntry({
        ...data,
        id: entry.id,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      } as Entry)
    } else {
      await addEntry(data)
    }
    onSaved()
  }

  async function handleDelete() {
    if (!entry || saving) return
    setSaving(true)
    await deleteEntry(entry.id as number)
    onSaved()
  }

  // Create a copy of the current fields at a chosen date/time.
  async function handleDuplicate(targetDateKey: string, targetTime: string) {
    if (missingRequired || saving) return
    setSaving(true)
    await addEntry({ ...buildNewEntry(), date: targetDateKey, time: targetTime })
    onSaved()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-h-[92%] overflow-y-auto rounded-t-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-neutral-500 active:bg-neutral-100"
          >
            ✕
          </button>
          <span className="text-sm font-semibold text-neutral-700">
            {isEdit ? 'Edit entry' : 'New entry'}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={missingRequired || saving}
            className="rounded-full bg-[#e5556e] px-5 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Save
          </button>
        </div>

        {/* Fixed content height so switching entry type doesn't resize the
            sheet. Content packs from the top, so shorter variants leave the
            whitespace at the bottom (Notes rises naturally). */}
        <div
          className={`flex flex-col gap-4 px-4 pt-1 ${
            isEdit ? 'min-h-[540px]' : 'min-h-[470px]'
          }`}
        >
          {/* Entry type chips */}
          <div className="flex gap-2 overflow-x-auto">
            {ENTRY_TYPE_OPTIONS.map((t) => {
              const meta = ENTRY_TYPE_META[t]
              return (
                <Pill
                  key={t}
                  selected={entryType === t}
                  onClick={() => setEntryType(t)}
                  style={{ backgroundColor: meta.border, color: '#fff' }}
                >
                  {meta.label}
                </Pill>
              )
            })}
          </div>

          {/* Date + timeslot */}
          <div className="flex gap-2">
            <input
              type="date"
              aria-label="Date"
              className={inputClass}
              value={dateKeyToInput(dateKey)}
              onChange={(e) => {
                if (e.target.value) setDateKey(inputToDateKey(e.target.value))
              }}
            />
            <select
              aria-label="Time slot"
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {timeSlots().map((t) => (
                <option key={t} value={t}>
                  {slotRangeLabel(t)}
                </option>
              ))}
            </select>
          </div>

          {/* Variant-specific fields (natural height). */}
          <div className="flex flex-col gap-4">
          {/* Food fields */}
          {entryType === 'food' && (
            <>
              <div className="flex gap-2 overflow-x-auto">
                {FOOD_TYPE_OPTIONS.map((ft) => (
                  <Pill
                    key={ft}
                    selected={foodType === ft}
                    onClick={() => setFoodType(ft)}
                  >
                    {FOOD_TYPE_LABELS[ft]}
                  </Pill>
                ))}
              </div>
              <div>
                <label className={labelClass} htmlFor="ef-food">
                  Food
                </label>
                <input
                  id="ef-food"
                  className={inputClass}
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder={FOOD_PLACEHOLDERS[foodType]}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="ef-qty">
                  Quantity (optional)
                </label>
                <input
                  id="ef-qty"
                  className={inputClass}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1 bowl | 200g"
                />
              </div>
            </>
          )}

          {/* Activity fields */}
          {entryType === 'activity' && (
            <div>
              <label className={labelClass} htmlFor="ef-activity">
                Activity
              </label>
              <input
                id="ef-activity"
                className={inputClass}
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Gym | Sex with Dyllan"
              />
            </div>
          )}

          {/* Symptom fields - multi-select, at least one required. */}
          {entryType === 'symptom' && (
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_TYPE_OPTIONS.map((st) => (
                <Pill
                  key={st}
                  selected={symptomTypes.has(st)}
                  onClick={() => toggleSymptom(st)}
                >
                  {SYMPTOM_TYPE_LABELS[st]}
                </Pill>
              ))}
            </div>
          )}
          </div>

          {/* Notes (all types) */}
          <div>
            <label className={labelClass} htmlFor="ef-notes">
              Notes (optional)
            </label>
            <textarea
              id="ef-notes"
              className={`${inputClass} min-h-20 resize-none`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="... I love Dyllan 👀"
            />
          </div>

          {/* Duplicate (edit mode only) */}
          {isEdit && (
            <button
              type="button"
              onClick={() => setDuplicating(true)}
              className="self-start text-sm font-medium text-[#e5556e]"
            >
              Duplicate to another time
            </button>
          )}

          {/* Delete (edit mode only) */}
          {isEdit &&
            (confirmDelete ? (
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                <span className="text-sm text-red-700">Are you sure babe?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg px-3 py-1.5 text-sm text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="self-start text-sm font-medium text-red-600"
              >
                Delete entry
              </button>
            ))}
        </div>
      </div>

      {duplicating && (
        <DateTimeDialog
          title="Duplicate to"
          confirmLabel="Duplicate"
          initialDateKey={dateKey}
          initialTime={time}
          onCancel={() => setDuplicating(false)}
          onConfirm={(d, t) => handleDuplicate(d, t)}
        />
      )}
    </div>
  )
}
