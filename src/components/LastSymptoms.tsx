import { useCallback, useEffect, useState } from 'react'
import type { SymptomEntry, SymptomTypeEnum, TriggerableEntry } from '../db/db'
import { getAllSymptoms, getEntriesBefore, updateEntry } from '../db/entries'
import { entryDateTime, formatGap, formatLongDate, parseDateKey } from '../lib/calendar'
import { entryTitle } from '../lib/entryTypes'
import { type Period, periodStart, withinPeriod } from '../lib/period'
import { COLORS, ENTRY_TYPE_META } from '../lib/theme'
import { useBackToClose } from '../lib/use-back-to-close'
import { PrintTrim } from './decor'
import { EntryDetailSheet } from './EntryDetailSheet'
import { YesNoSwitch } from './YesNoSwitch'

interface Group {
  symptom: SymptomEntry
  priors: TriggerableEntry[]
}

export function LastSymptoms({
  symptomTypes,
  period,
}: {
  symptomTypes: Set<SymptomTypeEnum>
  period: Period
}) {
  const [groups, setGroups] = useState<Group[]>([])
  const [selected, setSelected] = useState<TriggerableEntry | null>(null)
  useBackToClose(selected !== null, () => setSelected(null))

  const load = useCallback(async () => {
    const start = periodStart(period, new Date())
    const symptoms = (await getAllSymptoms()).filter(
      (s) =>
        withinPeriod(s.date, start) &&
        (symptomTypes.size === 0 || s.symptomTypes.some((t) => symptomTypes.has(t))),
    )
    const next = await Promise.all(
      symptoms.map(async (symptom) => ({
        symptom,
        priors: await getEntriesBefore(symptom.date, symptom.time, Infinity),
      })),
    )
    setGroups(next)
  }, [symptomTypes, period])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    load()
  }, [load])

  async function setTrigger(e: TriggerableEntry, value: boolean) {
    if (e.possibleTrigger === value) return
    await updateEntry(e.id as number, { possibleTrigger: value })
    // Reflect it everywhere this entry appears (optimistic).
    setGroups((gs) =>
      gs.map((g) => ({
        ...g,
        priors: g.priors.map((p) =>
          p.id === e.id ? ({ ...p, possibleTrigger: value } as TriggerableEntry) : p,
        ),
      })),
    )
  }

  if (groups.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-text-muted">
        No symptoms in this range. Add one on the calendar and it'll show up here.
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3 px-3 pb-3 pt-2">
      {groups.map(({ symptom, priors }) => {
        const symptomAt = entryDateTime(symptom.date, symptom.time)
        return (
          <div
            key={symptom.id}
            className="overflow-hidden rounded-xl border"
            style={{
              backgroundColor: COLORS.cardBg,
              borderColor: COLORS.cardBorder,
              boxShadow: COLORS.cardShadow,
            }}
          >
            <PrintTrim height={6} />
            <div className="p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span
                className="font-display font-semibold"
                style={{ color: ENTRY_TYPE_META.symptom.border }}
              >
                {entryTitle(symptom)}
              </span>
              <span className="shrink-0 text-xs text-text-muted">
                {formatLongDate(parseDateKey(symptom.date))} · {symptom.time}
              </span>
            </div>

            {symptom.notes && (
              <p className="mb-2 pl-1 text-sm italic text-text-secondary">
                {symptom.notes}
              </p>
            )}

            {priors.length === 0 ? (
              <p className="pl-1 text-sm text-text-muted">
                Nothing entered within the last 48 hours of this Symptom Entry - are
                you using the app babe? 👀
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-xs font-medium text-text-muted">
                    Before this
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    Possible trigger
                  </span>
                </div>
                {priors.map((p) => {
                  const mins =
                    (symptomAt.getTime() - entryDateTime(p.date, p.time).getTime()) /
                    60000
                  const meta = ENTRY_TYPE_META[p.entryType]
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 border-t border-divider py-2"
                    >
                      <button
                        type="button"
                        onClick={() => setSelected(p)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left active:opacity-70"
                      >
                        <span className="w-24 shrink-0 text-xs text-text-muted">
                          {formatGap(mins)}
                        </span>
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: meta.border }}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
                          {entryTitle(p)}
                        </span>
                      </button>
                      <YesNoSwitch
                        value={p.possibleTrigger}
                        onChange={(v) => setTrigger(p, v)}
                        size="sm"
                        accentColor={COLORS.triggerPillBorder}
                        accentText={COLORS.triggerSwitchText}
                      />
                    </div>
                  )
                })}
              </>
            )}
            </div>
          </div>
        )
      })}
      </div>

      {selected && (
        <EntryDetailSheet
          entry={selected}
          onClose={() => setSelected(null)}
          onChanged={() => load()}
        />
      )}
    </>
  )
}
