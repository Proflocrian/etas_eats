import { COLORS } from '../lib/theme'
import { useDecor } from '../lib/theme-context'

function Plus({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// Floating "add" button. Plain circle by default; the leopard theme renders the
// layered treatment (gold-metal ring -> print disc -> espresso core -> gold plus).
export function Fab({ onClick }: { onClick: () => void }) {
  const decor = useDecor()
  const base = 'tap-fab absolute bottom-4 right-4 flex items-center justify-center rounded-full active:brightness-95'

  if (decor.fabTreatment === 'gems') {
    // 14 rhinestones on a 34px-radius ring inside a 74px hit box; a 62px gem FAB centred.
    const gems = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2
      return { left: 37 + 34 * Math.cos(a) - 3.5, top: 37 + 34 * Math.sin(a) - 3.5 }
    })
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Add entry"
        className="tap-fab absolute bottom-4 right-4 flex items-center justify-center active:brightness-95"
        style={{ width: 74, height: 74 }}
      >
        <span
          className="tt-fab-shimmer relative flex items-center justify-center overflow-hidden rounded-full text-white"
          style={{
            width: 62,
            height: 62,
            background: 'radial-gradient(circle at 35% 30%, #FF6FB8, #E0007A 60%, #B0005F)',
            boxShadow: COLORS.fabShadow,
          }}
        >
          <Plus size={26} />
        </span>
        {gems.map((g, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              left: g.left,
              top: g.top,
              width: 7,
              height: 7,
              background: 'radial-gradient(circle at 35% 35%, #fff 0 25%, #FFC7E3 45%, #FF5FB0)',
              boxShadow: '0 0 2px rgba(255,255,255,.9)',
            }}
          />
        ))}
      </button>
    )
  }

  if (decor.fabTreatment === 'heart') {
    // 11:11: the FAB is the 🩵 itself, with the always-on ripple ring around it.
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Add entry"
        className={`tap-fab absolute bottom-4 right-4 flex items-center justify-center active:brightness-95 ${
          decor.fabRipple ? 'tt-fab-ripple' : ''
        }`}
        style={{ width: 56, height: 56 }}
      >
        <span
          className="text-[44px] leading-none"
          style={{ filter: 'drop-shadow(0 3px 6px rgba(8,24,48,.55))' }}
          aria-hidden="true"
        >
          🩵
        </span>
      </button>
    )
  }

  if (decor.fabTreatment === 'leopard') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Add entry"
        className={`${base} cl-fab`}
        style={{
          width: 62,
          height: 62,
          padding: 3,
          background: 'var(--gold-metal)',
          boxShadow: COLORS.fabShadow,
        }}
      >
        <span
          className="flex h-full w-full items-center justify-center rounded-full"
          style={{ background: 'var(--leopard-bold-sm)' }}
        >
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: 30,
              height: 30,
              background: '#2A1810',
              boxShadow: 'inset 0 0 0 1px #B8862C',
              color: '#F3D58C',
            }}
          >
            <Plus size={22} />
          </span>
        </span>
      </button>
    )
  }

  // 11:11: white pearl on denim with a hairline 🩵 ring and an always-on ripple.
  const ripple = !!decor.fabRipple
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add entry"
      className={`${base} h-14 w-14 text-on-primary ${ripple ? 'tt-fab-ripple' : ''}`}
      style={{
        backgroundColor: COLORS.fabBg,
        boxShadow: ripple
          ? `0 0 0 1px rgba(168,216,234,.6), ${COLORS.fabShadow}`
          : COLORS.fabShadow,
      }}
    >
      <Plus size={28} />
    </button>
  )
}
