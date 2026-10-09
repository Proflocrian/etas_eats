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
  return (
    <FilterRow>
      {PERIOD_OPTIONS.map((o) => (
        <FilterChip
          key={o.id}
          label={o.label}
          active={value === o.id}
          accent={COLORS.primaryAction}
          onClick={() => onChange(o.id)}
        />
      ))}
    </FilterRow>
  )
}

export function FilterCard({ children }: { children: React.ReactNode }) {
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
          Filters
        </h2>
        <FilterDivider />
        {children}
      </div>
    </div>
  )
}
