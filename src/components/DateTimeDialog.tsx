import { useState } from 'react'
import {
  dateKeyToInput,
  inputToDateKey,
  slotRangeLabel,
  timeSlots,
} from '../lib/calendar'
import { COLORS } from '../lib/theme'

const inputClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-base text-neutral-800 outline-none focus:border-primary'

// A small centered dialog that asks only for a date + 30-min slot.
export function DateTimeDialog({
  title,
  confirmLabel,
  initialDateKey,
  initialTime,
  onCancel,
  onConfirm,
}: {
  title: string
  confirmLabel: string
  initialDateKey: string
  initialTime: string
  onCancel: () => void
  onConfirm: (dateKey: string, time: string) => void
}) {
  const [dateKey, setDateKey] = useState(initialDateKey)
  const [time, setTime] = useState(initialTime)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xs rounded-2xl p-4"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: COLORS.sheetBg }}
      >
        <h2 className="mb-3 text-base font-semibold text-neutral-800">{title}</h2>

        <div className="flex flex-col gap-2">
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

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-1.5 text-sm text-neutral-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(dateKey, time)}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
