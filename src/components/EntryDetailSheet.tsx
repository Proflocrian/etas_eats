import { useRef, useState } from 'react'
import type { TriggerableEntry } from '../db/db'
import { updateEntry } from '../db/entries'
import { parseDateKey, slotRangeLabel } from '../lib/calendar'
import { formatLongDate } from '../lib/date-i18n'
import { entryTitle } from '../lib/entryTypes'
import { useI18n } from '../lib/i18n-context'
import { COLORS, ENTRY_TYPE_META } from '../lib/theme'
import { useDecor } from '../lib/theme-context'
import { SheetGrabber, WaveAccent } from './decor'
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
  const decor = useDecor()
  const { t, lang } = useI18n()

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

  const rows: { label: string; value: string }[] = [
    { label: t('detail.type'), value: t(`entryType.${entry.entryType}`) },
  ]
  if (entry.entryType === 'food' && entry.quantity) {
    rows.push({ label: t('form.quantity'), value: entry.quantity })
  }
  rows.push({
    label: t('detail.when'),
    value: `${formatLongDate(parseDateKey(entry.date), lang)} · ${slotRangeLabel(entry.time)}`,
  })
  if (entry.notes) rows.push({ label: t('form.notes'), value: entry.notes })

  return (
    <div
      className="scrim-fade fixed inset-0 z-50 flex flex-col justify-end"
      onClick={onClose}
      style={{ backgroundColor: COLORS.scrim }}
    >
      {/* Outer wrapper owns the drag transform; the inner element owns the scroll
          (matches EntryForm, and lets 11:11's wave sit behind a frosted panel). */}
      <div
        className="sheet-enter relative flex max-h-[92%] flex-col overflow-hidden rounded-t-2xl"
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
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-input-bg text-xl text-text-muted active:opacity-70"
          >
            ✕
          </button>
          <span className="font-display text-base font-bold text-text-primary">
            {t('detail.title')}
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
              {entryTitle(entry, t)}
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
              {t('form.possibleTrigger')}
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
    </div>
  )
}
