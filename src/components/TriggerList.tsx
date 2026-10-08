import { useCallback, useEffect, useState } from 'react'
import type { TriggerableEntry } from '../db/db'
import { getPossibleTriggers } from '../db/entries'
import { entryTitle } from '../lib/entryTypes'
import { COLORS, ENTRY_TYPE_META } from '../lib/theme'
import { EntryDetailSheet } from './EntryDetailSheet'

export function TriggerList() {
  const [items, setItems] = useState<TriggerableEntry[]>([])
  const [selected, setSelected] = useState<TriggerableEntry | null>(null)

  const load = useCallback(async () => {
    setItems(await getPossibleTriggers())
  }, [])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    load()
  }, [load])

  if (items.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-text-muted">
        No possible triggers flagged yet. Tick some under Last Symptoms.
      </p>
    )
  }

  return (
    <div className="px-4 py-3">
      {/* Grouped card (like a Settings list) - each flagged entry is a tappable
          row with its type dot and a chevron into the detail sheet. */}
      <div
        className="overflow-hidden rounded-xl border border-card-border"
        style={{ backgroundColor: COLORS.settingsButtonBg }}
      >
        {items.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setSelected(e)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left active:opacity-70 ${
              i > 0 ? 'border-t border-divider' : ''
            }`}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: ENTRY_TYPE_META[e.entryType].border }}
            />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
              {entryTitle(e)}
            </span>
            <span className="shrink-0 text-text-muted" aria-hidden="true">
              ›
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <EntryDetailSheet
          entry={selected}
          onClose={() => setSelected(null)}
          onChanged={() => load()}
        />
      )}
    </div>
  )
}
