import { useRef, useState } from 'react'
import type { Entry, EntryTypeEnum, NewEntry, SymptomTypeEnum } from '../db/db'
import { addEntry, deleteEntry, replaceEntry } from '../db/entries'
import {
  dateKeyToInput,
  entryDateTime,
  inputToDateKey,
  slotRangeLabel,
  timeSlots,
} from '../lib/calendar'
import { DateTimeDialog } from './DateTimeDialog'
import { YesNoSwitch } from './YesNoSwitch'
import {
  ACTIVITY_PLACEHOLDERS,
  FOOD_PLACEHOLDERS,
  SYMPTOM_TYPE_LABELS,
  SYMPTOM_TYPE_OPTIONS,
} from '../lib/entryTypes'
import {
  COLORS,
  ENTRY_TYPE_EMOJI,
  ENTRY_TYPE_META,
  ENTRY_TYPE_ORDER,
  PILL_BG_COLOUR,
  PILL_BORDER_IDLE,
  PILL_CLASS,
} from '../lib/theme'

function Pill({
  selected,
  onClick,
  children,
  accent = COLORS.primaryAction,
  ariaLabel,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  accent?: string // selected border colour (defaults to the brand pink)
  ariaLabel?: string // accessible name when the content is an emoji
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`${PILL_CLASS} text-neutral-600 ${selected ? 'font-semibold' : ''}`}
      style={{
        backgroundColor: PILL_BG_COLOUR,
        borderColor: selected ? accent : PILL_BORDER_IDLE,
      }}
    >
      {children}
    </button>
  )
}

const inputClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-base text-neutral-800 outline-none focus:border-[var(--field-accent)]'
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
  const [possibleTrigger, setPossibleTrigger] = useState(
    entry?.entryType === 'food' || entry?.entryType === 'activity'
      ? entry.possibleTrigger
      : false,
  )
  const [foodPlaceholder] = useState(
    () => FOOD_PLACEHOLDERS[Math.floor(Math.random() * FOOD_PLACEHOLDERS.length)],
  )
  const [activityPlaceholder] = useState(
    () =>
      ACTIVITY_PLACEHOLDERS[
        Math.floor(Math.random() * ACTIVITY_PLACEHOLDERS.length)
      ],
  )
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const [confirmFuture, setConfirmFuture] = useState(false)

  // Swipe-down-to-dismiss (like a native bottom sheet). Dragging starts only
  // when the sheet is scrolled to the top; pulling past a third of its height closes.
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef<number | null>(null)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)

  function onTouchStart(e: React.TouchEvent) {
    if ((sheetRef.current?.scrollTop ?? 0) > 0) return
    dragStartY.current = e.touches[0].clientY
    setDragging(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    if (dragStartY.current === null) return
    const delta = e.touches[0].clientY - dragStartY.current
    setDragY(delta > 0 ? delta : 0)
  }

  function onTouchEnd() {
    if (dragStartY.current === null) return
    const height = sheetRef.current?.clientHeight ?? 0
    const shouldClose = dragY > height / 3
    dragStartY.current = null
    setDragging(false)
    if (shouldClose) onClose()
    else setDragY(0)
  }

  // Input borders turn the entry type's accent colour on focus (idle: neutral).
  const inputStyle = {
    '--field-accent': ENTRY_TYPE_META[entryType].border,
  } as React.CSSProperties

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
        food: food.trim(),
        quantity: quantity.trim() || undefined,
        possibleTrigger,
      }
    }
    if (entryType === 'activity') {
      return {
        ...base,
        entryType: 'activity',
        activity: activity.trim(),
        possibleTrigger,
      }
    }
    return { ...base, entryType: 'symptom', symptomTypes: [...symptomTypes] }
  }

  async function doSave() {
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

  function handleSave() {
    if (missingRequired || saving) return
    // Warn if the entry's datetime is in the future.
    if (entryDateTime(dateKey, time).getTime() > Date.now()) {
      setConfirmFuture(true)
      return
    }
    doSave()
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
        ref={sheetRef}
        className="max-h-[67%] overflow-y-auto overscroll-contain rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          backgroundColor: COLORS.sheetBg,
          paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))',
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? 'none' : 'transform 0.2s ease-out',
        }}
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
            className="rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Save
          </button>
        </div>

        {/* Fixed content height (tuned to the tallest variant, Food) so
            switching entry type doesn't resize the sheet. Hand-tuned px. */}
        <div
          className={`flex flex-col gap-4 px-4 pt-1 ${
            isEdit ? 'min-h-[520px]' : 'min-h-[450px]'
          }`}
        >
          {/* Entry type: editable chips on create, read-only on edit. */}
          {isEdit ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">
                Entry Type:
              </span>
              <span
                aria-label={ENTRY_TYPE_META[entryType].label}
                className={`${PILL_CLASS} font-semibold`}
                style={{
                  backgroundColor: PILL_BG_COLOUR,
                  borderColor: ENTRY_TYPE_META[entryType].border,
                }}
              >
                {ENTRY_TYPE_EMOJI[entryType]}
              </span>
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto">
              {ENTRY_TYPE_ORDER.map((t) => {
                const meta = ENTRY_TYPE_META[t]
                return (
                  <Pill
                    key={t}
                    selected={entryType === t}
                    onClick={() => setEntryType(t)}
                    ariaLabel={meta.label}
                    accent={meta.border}
                  >
                    {ENTRY_TYPE_EMOJI[t]}
                  </Pill>
                )
              })}
            </div>
          )}

          {/* Date + timeslot */}
          <div className="flex gap-2">
            <input
              type="date"
              aria-label="Date"
              className={inputClass}
              style={inputStyle}
              value={dateKeyToInput(dateKey)}
              onChange={(e) => {
                if (e.target.value) setDateKey(inputToDateKey(e.target.value))
              }}
            />
            <select
              aria-label="Time slot"
              className={inputClass}
              style={inputStyle}
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
              <div>
                <label className={labelClass} htmlFor="ef-food">
                  Meal | Snack | Drink
                </label>
                <input
                  id="ef-food"
                  className={inputClass}
                  style={inputStyle}
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder={foodPlaceholder}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="ef-qty">
                  Quantity (optional)
                </label>
                <input
                  id="ef-qty"
                  className={inputClass}
                  style={inputStyle}
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
                style={inputStyle}
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder={activityPlaceholder}
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
                  accent={ENTRY_TYPE_META.symptom.border}
                >
                  {SYMPTOM_TYPE_LABELS[st]}
                </Pill>
              ))}
            </div>
          )}
          </div>

          {/* Possible trigger (Food/Activity only) */}
          {(entryType === 'food' || entryType === 'activity') && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600">
                Possible Trigger?
              </span>
              <YesNoSwitch
                value={possibleTrigger}
                onChange={setPossibleTrigger}
                accentColor={COLORS.triggerPillBorder}
              />
            </div>
          )}

          {/* Notes (all types) */}
          <div>
            <label className={labelClass} htmlFor="ef-notes">
              Notes (optional)
            </label>
            <textarea
              id="ef-notes"
              className={`${inputClass} min-h-20 resize-none`}
              style={inputStyle}
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
              className="self-start text-sm font-medium text-primary"
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

      {confirmFuture && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => {
            e.stopPropagation()
            setConfirmFuture(false)
          }}
        >
          <div
            className="w-full max-w-xs rounded-2xl p-4"
            style={{ backgroundColor: COLORS.sheetBg }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-base font-semibold text-neutral-800">
              Are you sure you wanna save this entry? 👀
            </h2>
            <p className="mb-4 text-sm text-neutral-600">
              This is in the future - have you time travelled babe? If so, give me
              gambling tips xxx
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmFuture(false)}
                className="rounded-lg px-4 py-1.5 text-sm text-neutral-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmFuture(false)
                  doSave()
                }}
                className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
