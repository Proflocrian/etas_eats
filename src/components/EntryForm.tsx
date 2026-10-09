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
import { useDecor } from '../lib/theme-context'
import { DateTimeDialog } from './DateTimeDialog'
import { Modal } from './Modal'
import { SheetGrabber, Star, WaveAccent } from './decor'
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
      className={`${PILL_CLASS} tap text-text-secondary ${selected ? 'font-semibold' : ''}`}
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
  'w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-base text-text-primary outline-none focus:border-[var(--field-accent)]'
const labelClass = 'mb-1 block text-sm font-bold text-text-primary'
const optionalClass = 'font-normal text-text-muted'

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
  const decor = useDecor()

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

  // In edit mode, keep Save disabled until something actually changes.
  const unchanged =
    entry !== undefined &&
    dateKey === entry.date &&
    time === entry.time &&
    (notes.trim() || undefined) === (entry.notes?.trim() || undefined) &&
    (entry.entryType === 'food'
      ? food.trim() === entry.food &&
        (quantity.trim() || undefined) === (entry.quantity?.trim() || undefined) &&
        possibleTrigger === entry.possibleTrigger
      : entry.entryType === 'activity'
        ? activity.trim() === entry.activity && possibleTrigger === entry.possibleTrigger
        : symptomTypes.size === entry.symptomTypes.length &&
          entry.symptomTypes.every((s) => symptomTypes.has(s)))

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
      className="scrim-fade fixed inset-0 z-50 flex flex-col justify-end"
      onClick={onClose}
      style={{ backgroundColor: COLORS.scrim }}
    >
      {/* Outer wrapper owns the drag transform; the inner element owns the scroll.
          Keeping them separate avoids an iOS compositing desync where transforming a
          scroll container per-frame makes child layers (the leopard band) drift. */}
      <div
        className="sheet-enter relative flex max-h-[67%] flex-col overflow-hidden rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          backgroundColor: COLORS.sheetBg,
          boxShadow: COLORS.sheetShadow,
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {/* 11:11: the full drifting wave + a gradient scrim behind the content, and
            the grabber/heart band sits on the wave above the frosted panel. */}
        {decor.sheetWave && (
          <>
            <WaveAccent />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(30,70,112,.05), rgba(27,63,100,.35))',
              }}
            />
          </>
        )}
        {/* Grabber/band sits OUTSIDE the scroll container so its animation doesn't
            desync from the drag transform on iOS (the inner element owns the scroll). */}
        <SheetGrabber />
        <div
          ref={sheetRef}
          className={`sheet-scope min-h-0 flex-1 overflow-y-auto overscroll-contain ${
            decor.sheetWave ? 'tt-sheet-panel relative mx-3 mb-[42px] rounded-[22px]' : ''
          }`}
          style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-input-bg text-xl text-text-muted active:opacity-70"
          >
            ✕
          </button>
          <span className="font-display text-base font-bold text-text-primary">
            {isEdit ? 'Edit Entry' : 'New Entry'}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={missingRequired || saving || unchanged}
            className={`tap rounded-full px-5 py-1.5 text-sm font-semibold disabled:opacity-40 ${
              decor.goldSave && !missingRequired && !saving && !unchanged && !dragging
                ? 'cl-save'
                : ''
            } ${decor.bedazzleSave && !missingRequired && !saving && !unchanged ? 'tt-save' : ''}`}
            style={{ background: 'var(--save-bg)', color: 'var(--save-text)' }}
          >
            Save
            {decor.bedazzleSave && !missingRequired && !saving && (
              <span className="tt-twinkle absolute -bottom-1 -right-1" aria-hidden="true">
                <Star size={12} color="#FFF3B0" />
              </span>
            )}
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
              <span className="text-sm font-bold text-text-primary">
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
                  Quantity <span className={optionalClass}>(optional)</span>
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
              <span className="text-sm font-bold text-text-primary">
                Possible Trigger?
              </span>
              <YesNoSwitch
                value={possibleTrigger}
                onChange={setPossibleTrigger}
                accentColor={COLORS.triggerPillBorder}
                accentText={COLORS.triggerSwitchText}
              />
            </div>
          )}

          {/* Notes (all types) */}
          <div>
            <label className={labelClass} htmlFor="ef-notes">
              Notes <span className={optionalClass}>(optional)</span>
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
              style={decor.sheetWave ? { color: '#2B6CB0' } : undefined}
            >
              Duplicate to another time
            </button>
          )}

          {/* Delete (edit mode only) */}
          {isEdit &&
            (confirmDelete ? (
              <div className="flex items-center justify-between rounded-lg bg-danger-bg px-3 py-2">
                <span className="text-sm text-danger-text">Are you sure babe?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg px-3 py-1.5 text-sm text-text-secondary"
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
                className="self-start text-sm font-medium text-danger-text"
                style={decor.sheetWave ? { color: '#C53030' } : undefined}
              >
                Delete entry
              </button>
            ))}
        </div>
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
        <Modal
          variant="confirm"
          title="Are you sure you wanna save this entry? 👀"
          bodyMessage="This is in the future - have you time travelled babe? If so, give me gambling tips xxx"
          confirmLabel="Save"
          onConfirm={doSave}
          onClose={() => setConfirmFuture(false)}
        />
      )}
    </div>
  )
}
