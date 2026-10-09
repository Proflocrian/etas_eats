import { COLORS, TAB_EMOJI } from '../lib/theme'
import { useDecor } from '../lib/theme-context'

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
  const decor = useDecor()
  const print = !!decor.navPrint
  const velour = !!decor.navVelour
  const heartMark = !!decor.navHeartMark
  return (
    <nav
      className={`relative flex shrink-0 ${print || velour ? '' : 'border-t border-divider'}`}
      style={{
        background: print
          ? 'var(--leopard-dark)'
          : velour
            ? 'var(--nav-velour)'
            : COLORS.navBg,
      }}
    >
      {/* Gold hairline along the top (leopard). */}
      {print && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[1.5px]"
          style={{ background: 'var(--gold-line)' }}
        />
      )}
      {ITEMS.map(({ tab, label }) => {
        const isActive = tab === active
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            aria-current={isActive ? 'page' : undefined}
            className="tap relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs"
            style={{ color: isActive ? COLORS.navSelectedFont : COLORS.navFont }}
          >
            {/* Gold tab mark hanging from the top on the selected tab (leopard). */}
            {print && isActive && (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-[3px] w-7 -translate-x-1/2 rounded-b-[3px]"
                style={{ background: 'var(--gold-line)' }}
              />
            )}
            {/* 🩵 tab mark on the selected tab (11:11). */}
            {heartMark && isActive && (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-[3px] w-6 -translate-x-1/2 rounded-b-[3px]"
                style={{ background: '#A8D8EA' }}
              />
            )}
            {/* Glass pill + a little star on the selected tab (2000s velour). */}
            {velour && isActive && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 inset-y-1 rounded-[18px]"
                  style={{ background: 'rgba(255,255,255,.18)' }}
                />
                <span
                  aria-hidden="true"
                  className="tt-nav-star absolute right-2 top-1"
                  style={{ color: '#FFF3B0' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
                  </svg>
                </span>
              </>
            )}
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
