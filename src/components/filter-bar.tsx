import { type Period, PERIOD_OPTIONS } from '../lib/period'
import { COLORS } from '../lib/theme'
import { FilterChip } from './FilterChip'

export function FilterRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 pb-1.5">{children}</div>
  )
}

export function FilterDivider() {
  return <div className="mx-3 mb-1.5 h-[1px] bg-black" />
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
