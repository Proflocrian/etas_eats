import { useState } from 'react'
import {
  DURATION_OPTIONS,
  dateKeyToInput,
  inputToDateKey,
  timeSlots,
} from '../lib/calendar'
import { formatDuration } from '../lib/date-i18n'
import { useI18n } from '../lib/i18n-context'
import { COLORS } from '../lib/theme'

const inputClass =
  'w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-base text-text-primary outline-none focus:border-primary'
const labelClass = 'mb-1 block text-sm font-bold text-text-primary'

// A small centered dialog asking for a date, 30-min start slot, and duration.
export function DateTimeDialog({
  title,
  confirmLabel,
  initialDateKey,
  initialTime,
  initialDuration,
  onCancel,
  onConfirm,
}: {
  title: string
  confirmLabel: string
  initialDateKey: string
  initialTime: string
  initialDuration: number
  onCancel: () => void
  onConfirm: (dateKey: string, time: string, durationMinutes: number) => void
}) {
  const [dateKey, setDateKey] = useState(initialDateKey)
  const [time, setTime] = useState(initialTime)
  const [durationMinutes, setDurationMinutes] = useState(initialDuration)
  const { t, lang } = useI18n()

  return (
    <div
      className="scrim-fade fixed inset-0 z-[60] flex items-center justify-center px-4"
      onClick={onCancel}
      style={{ backgroundColor: COLORS.scrim }}
    >
      <div
        className="sheet-scope w-full max-w-xs rounded-2xl p-4"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: COLORS.sheetBg, boxShadow: COLORS.sheetShadow }}
      >
        <h2 className="mb-3 text-base font-semibold text-text-primary">{title}</h2>

        <div className="flex flex-col gap-3">
          <label className="block">
            <span className={labelClass}>{t('form.date')}</span>
            <input
              type="date"
              aria-label={t('form.date')}
              className={inputClass}
              value={dateKeyToInput(dateKey)}
              onChange={(e) => {
                if (e.target.value) setDateKey(inputToDateKey(e.target.value))
              }}
            />
          </label>
          <label className="block">
            <span className={labelClass}>{t('form.start')}</span>
            <select
              aria-label={t('form.start')}
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {timeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>{t('form.duration')}</span>
            <select
              aria-label={t('form.duration')}
              className={inputClass}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            >
              {DURATION_OPTIONS.map((min) => (
                <option key={min} value={min}>
                  {formatDuration(min, lang)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-1.5 text-sm text-text-secondary"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(dateKey, time, durationMinutes)}
            className="tap rounded-lg px-4 py-1.5 text-sm font-semibold"
            style={{ background: 'var(--save-bg)', color: 'var(--save-text)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
