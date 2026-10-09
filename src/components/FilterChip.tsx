import { PILL_BG_COLOUR, PILL_BORDER_IDLE } from '../lib/theme'

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
      className={`tap min-w-[2.5rem] shrink-0 whitespace-nowrap rounded-full border-2 px-2.5 py-1 text-center text-text-muted ${className} ${
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
