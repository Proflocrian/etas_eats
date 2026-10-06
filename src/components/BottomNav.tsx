export type Tab = 'calendar' | 'triggers' | 'about'

const ITEMS: { tab: Tab; emoji: string; label: string }[] = [
  { tab: 'calendar', emoji: '🗓️', label: 'Calendar' },
  { tab: 'triggers', emoji: '⚠️', label: 'Triggers' },
  { tab: 'about', emoji: '❓', label: 'About' },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <nav
      className="flex shrink-0 border-t border-neutral-200 bg-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {ITEMS.map(({ tab, emoji, label }) => {
        const isActive = tab === active
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs ${
              isActive ? 'text-[#e5556e]' : 'text-neutral-500'
            }`}
          >
            <span className="text-2xl leading-none" role="img" aria-label={label}>
              {emoji}
            </span>
            <span className="font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
