import { COLORS } from '../lib/theme'

// A No/Yes flip-switch. Clicking anywhere toggles it; a highlight slides between
// the two sides. The "Yes" side uses `accentColor` (defaults to primary).
export function YesNoSwitch({
  value,
  onChange,
  size = 'md',
  accentColor = COLORS.primaryAction,
}: {
  value: boolean
  onChange: (value: boolean) => void
  size?: 'sm' | 'md'
  accentColor?: string
}) {
  const pad = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-4 py-0.5 text-sm'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="relative shrink-0 overflow-hidden rounded-full border border-neutral-300"
    >
      {/* Sliding highlight - half the width, slides to the active side. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 rounded-full transition-all duration-200 ease-out"
        style={{
          transform: value ? 'translateX(100%)' : 'translateX(0)',
          backgroundColor: value ? accentColor : '#404040',
        }}
      />
      <span className="relative flex">
        <span
          className={`flex-1 text-center ${pad} ${
            value ? 'text-neutral-500' : 'font-semibold text-white'
          }`}
        >
          No
        </span>
        <span
          className={`flex-1 text-center ${pad} ${
            value ? 'font-semibold text-white' : 'text-neutral-500'
          }`}
        >
          Yes
        </span>
      </span>
    </button>
  )
}
