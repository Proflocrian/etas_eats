import { PILL_BG_COLOUR, PILL_BORDER_IDLE, PILL_CLASS } from '../lib/theme'

export function FilterChip({
  label,
  name,
  active,
  accent,
  onClick,
  className = '',
}: {
  label: string
  name?: string // accessible name when the label is an emoji
  active: boolean
  accent: string // selected border colour
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={name ?? label}
      title={name}
      className={`${PILL_CLASS} tap min-w-[2.5rem] whitespace-nowrap text-center text-text-secondary ${className} ${
        active ? 'font-bold' : ''
      }`}
      style={{
        backgroundColor: PILL_BG_COLOUR,
        borderColor: active ? accent : PILL_BORDER_IDLE,
      }}
    >
      {label}
    </button>
  )
}
