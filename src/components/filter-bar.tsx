import { Fragment } from 'react'
import { useI18n } from '../lib/i18n-context'
import { type Period, PERIOD_OPTIONS } from '../lib/period'
import { COLORS, ENTRY_TYPE_META } from '../lib/theme'
import { FilterChip } from './FilterChip'
import { PrintTrim } from './decor'

export function FilterRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-1.5 pb-1.5">{children}</div>
}

export function FilterDivider() {
  return <div className="mb-1.5 h-[1px] bg-divider" />
}

export function PeriodRow({
  value,
  onChange,
}: {
  value: Period
  onChange: (p: Period) => void
}) {
  const { t } = useI18n()
  return (
    <FilterRow>
      {PERIOD_OPTIONS.map((o, i) => (
        <Fragment key={o.id}>
          {i === 1 && <span className="mx-0.5 w-px shrink-0 self-stretch bg-divider" />}
          <FilterChip
            label={t(`period.${o.id}`)}
            active={value === o.id}
            accent={COLORS.primaryAction}
            onClick={() => onChange(o.id)}
          />
        </Fragment>
      ))}
    </FilterRow>
  )
}

export function FilterCard({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()
  return (
    <div
      className="mx-3 mb-2 overflow-hidden rounded-xl border"
      style={{
        backgroundColor: COLORS.cardBg,
        borderColor: COLORS.cardBorder,
        boxShadow: COLORS.cardShadow,
      }}
    >
      <PrintTrim height={6} />
      <div className="px-3 pb-1 pt-2.5">
        <h2
          className="mb-1.5 font-display font-semibold"
          style={{ color: ENTRY_TYPE_META.symptom.border }}
        >
          {t('filter.filters')}
        </h2>
        <FilterDivider />
        <div className="text-xs">{children}</div>
      </div>
    </div>
  )
}
