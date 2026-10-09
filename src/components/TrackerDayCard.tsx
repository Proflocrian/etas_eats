import type { Entry } from '../db/db'
import { formatLongDate, parseDateKey } from '../lib/calendar'
import { entryTitle } from '../lib/entryTypes'
import { COLORS, ENTRY_TYPE_META } from '../lib/theme'
import { PrintTrim } from './decor'

export function TrackerDayCard({
  date,
  entries,
  onSelect,
}: {
  date: string
  entries: Entry[]
  onSelect: (entry: Entry) => void
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        backgroundColor: COLORS.cardBg,
        borderColor: COLORS.cardBorder,
        boxShadow: COLORS.cardShadow,
      }}
    >
      <PrintTrim height={6} />
      <div className="p-3">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="font-display font-semibold text-text-primary">
            {formatLongDate(parseDateKey(date))}
          </span>
          <span className="shrink-0 text-xs text-text-muted">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {entries.map((e) => {
          const flagged =
            (e.entryType === 'food' || e.entryType === 'activity') && e.possibleTrigger
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => onSelect(e)}
              className="flex w-full items-center gap-2 border-t border-divider py-2 text-left active:opacity-70"
            >
              <span className="w-12 shrink-0 text-xs text-text-muted">{e.time}</span>
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: ENTRY_TYPE_META[e.entryType].border }}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
                {entryTitle(e)}
              </span>
              {flagged && (
                <span className="shrink-0" role="img" aria-label="possible trigger">
                  🚩
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
