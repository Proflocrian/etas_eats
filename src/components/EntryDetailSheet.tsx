import { useState } from 'react'
import type { TriggerableEntry } from '../db/db'
import { updateEntry } from '../db/entries'
import { formatLongDate, parseDateKey, slotRangeLabel } from '../lib/calendar'
import { ENTRY_TYPE_META, FOOD_TYPE_LABELS, entryTitle } from '../lib/entryTypes'
import { YesNoSwitch } from './YesNoSwitch'

// Read-only view of a Food/Activity entry. The only editable thing is the
// possible-trigger flag, which persists immediately.
export function EntryDetailSheet({
  entry,
  onClose,
  onChanged,
}: {
  entry: TriggerableEntry
  onClose: () => void
  onChanged: () => void
}) {
  const [possibleTrigger, setPossibleTrigger] = useState(entry.possibleTrigger)
  const meta = ENTRY_TYPE_META[entry.entryType]

  async function toggle(value: boolean) {
    setPossibleTrigger(value)
    await updateEntry(entry.id as number, { possibleTrigger: value })
    onChanged()
  }

  const rows: { label: string; value: string }[] = [{ label: 'Type', value: meta.label }]
  if (entry.entryType === 'food') {
    rows.push({ label: 'Food type', value: FOOD_TYPE_LABELS[entry.foodType] })
    if (entry.quantity) rows.push({ label: 'Quantity', value: entry.quantity })
  }
  rows.push({
    label: 'When',
    value: `${formatLongDate(parseDateKey(entry.date))} · ${slotRangeLabel(entry.time)}`,
  })
  if (entry.notes) rows.push({ label: 'Notes', value: entry.notes })

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
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-neutral-500 active:bg-neutral-100"
          >
            ✕
          </button>
          <span className="text-sm font-semibold text-neutral-700">Entry details</span>
          <span className="w-9" />
        </div>

        <div className="flex flex-col gap-4 px-4 pb-2">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: meta.border }}
            />
            <span className="text-lg font-semibold text-neutral-800">
              {entryTitle(entry)}
            </span>
          </div>

          <dl className="flex flex-col gap-2">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-3">
                <dt className="w-24 shrink-0 text-sm text-neutral-400">{r.label}</dt>
                <dd className="text-sm text-neutral-800">{r.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
            <span className="text-sm font-medium text-neutral-600">
              Possible Trigger?
            </span>
            <YesNoSwitch value={possibleTrigger} onChange={(v) => toggle(v)} />
          </div>
        </div>
      </div>
    </div>
  )
}
