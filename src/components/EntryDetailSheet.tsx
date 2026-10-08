import { useRef, useState } from 'react'
import type { TriggerableEntry } from '../db/db'
import { updateEntry } from '../db/entries'
import { formatLongDate, parseDateKey, slotRangeLabel } from '../lib/calendar'
import { entryTitle } from '../lib/entryTypes'
import { COLORS, ENTRY_TYPE_META } from '../lib/theme'
import { SheetGrabber } from './decor'
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

  // Swipe-down-to-dismiss (matches EntryForm). Drag starts only at scrollTop 0;
  // pulling past a third of the sheet height closes.
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

  async function toggle(value: boolean) {
    setPossibleTrigger(value)
    await updateEntry(entry.id as number, { possibleTrigger: value })
    onChanged()
  }

  const rows: { label: string; value: string }[] = [{ label: 'Type', value: meta.label }]
  if (entry.entryType === 'food' && entry.quantity) {
    rows.push({ label: 'Quantity', value: entry.quantity })
  }
  rows.push({
    label: 'When',
    value: `${formatLongDate(parseDateKey(entry.date))} · ${slotRangeLabel(entry.time)}`,
  })
  if (entry.notes) rows.push({ label: 'Notes', value: entry.notes })

  return (
    <div
      className="scrim-fade fixed inset-0 z-50 flex flex-col justify-end"
      onClick={onClose}
      style={{ backgroundColor: COLORS.scrim }}
    >
      <div
        ref={sheetRef}
        className="sheet-scope sheet-enter max-h-[92%] overflow-y-auto overscroll-contain rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          backgroundColor: COLORS.sheetBg,
          boxShadow: COLORS.sheetShadow,
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <SheetGrabber />
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-text-muted active:bg-divider"
          >
            ✕
          </button>
          <span className="font-display text-sm font-semibold text-text-secondary">
            Entry details
          </span>
          <span className="w-9" />
        </div>

        <div className="flex flex-col gap-4 px-4 pb-2">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: meta.border }}
            />
            <span className="font-display text-lg font-semibold text-text-primary">
              {entryTitle(entry)}
            </span>
          </div>

          <dl className="flex flex-col gap-2">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-3">
                <dt className="w-24 shrink-0 text-sm text-text-muted">{r.label}</dt>
                <dd className="text-sm text-text-primary">{r.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center justify-between border-t border-divider pt-3">
            <span className="text-sm font-medium text-text-secondary">
              Possible Trigger?
            </span>
            <YesNoSwitch
              value={possibleTrigger}
              onChange={(v) => toggle(v)}
              accentColor={COLORS.triggerPillBorder}
              accentText={COLORS.triggerSwitchText}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
