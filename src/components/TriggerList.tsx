import { useCallback, useEffect, useState } from 'react'
import type { TriggerableEntry } from '../db/db'
import { getPossibleTriggers } from '../db/entries'
import { ENTRY_TYPE_META, entryTitle } from '../lib/entryTypes'
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
      <p className="px-6 py-10 text-center text-sm text-neutral-400">
        No possible triggers flagged yet. Tick some under Last Symptoms.
      </p>
    )
  }

  return (
    <div className="px-4 py-3">
      <ul className="flex flex-col">
        {items.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => setSelected(e)}
              className="flex w-full items-center gap-2 py-2 text-left active:opacity-70"
            >
              <span className="text-neutral-400">•</span>
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: ENTRY_TYPE_META[e.entryType].border }}
              />
              <span className="flex-1 truncate text-sm text-neutral-800">
                {entryTitle(e)}
              </span>
            </button>
          </li>
        ))}
      </ul>

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
