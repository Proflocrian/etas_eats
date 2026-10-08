import { COLORS } from '../lib/theme'

// A No/Yes flip-switch. Clicking anywhere toggles it; a highlight slides between
// the two sides. The "Yes" side uses `accentColor` + `accentText` (the thumb's
// fill and label colour); the "No" side uses the themed switch tokens. All
// colours resolve to theme vars, and flip to their on-sheet values inside a
// `.sheet-scope` subtree.
export function YesNoSwitch({
  value,
  onChange,
  size = 'md',
  accentColor = COLORS.primaryAction,
  accentText = COLORS.onPrimary,
}: {
  value: boolean
  onChange: (value: boolean) => void
  size?: 'sm' | 'md'
  accentColor?: string // "Yes" thumb fill
  accentText?: string // "Yes" thumb label colour (pairs with accentColor)
}) {
  const pad = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-4 py-0.5 text-sm'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="relative shrink-0 overflow-hidden rounded-full border border-input-border"
      style={{ backgroundColor: COLORS.switchTrack }}
    >
      {/* Sliding highlight - half the width, slides to the active side. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 rounded-full transition-all duration-200 ease-out"
        style={{
          transform: value ? 'translateX(100%)' : 'translateX(0)',
          backgroundColor: value ? accentColor : COLORS.switchNoBg,
        }}
      />
      <span className="relative flex">
        <span
          className={`flex-1 text-center ${pad} ${value ? '' : 'font-semibold'}`}
          style={{ color: value ? COLORS.textMuted : COLORS.switchNoText }}
        >
          No
        </span>
        <span
          className={`flex-1 text-center ${pad} ${value ? 'font-semibold' : ''}`}
          style={{ color: value ? accentText : COLORS.textMuted }}
        >
          Yes
        </span>
      </span>
    </button>
  )
}
