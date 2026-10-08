import { COLORS, TAB_EMOJI } from '../lib/theme'

export type Tab = 'calendar' | 'triggers' | 'settings' | 'about'

const ITEMS: { tab: Tab; label: string }[] = [
  { tab: 'calendar', label: 'Calendar' },
  { tab: 'triggers', label: 'Triggers' },
  { tab: 'settings', label: 'Settings' },
  { tab: 'about', label: 'About' },
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
      className="flex shrink-0 border-t border-neutral-200"
      style={{
        backgroundColor: COLORS.navBg,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {ITEMS.map(({ tab, label }) => {
        const isActive = tab === active
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            aria-current={isActive ? 'page' : undefined}
            className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs"
            style={{ color: isActive ? COLORS.navSelectedFont : COLORS.navFont }}
          >
            <span className="text-2xl leading-none" role="img" aria-label={label}>
              {TAB_EMOJI[tab]}
            </span>
            <span className="font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
