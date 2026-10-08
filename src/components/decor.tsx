import { useDecor } from '../lib/theme-context'

// A full-strength leopard print strip with a gold hairline under it, used as trim
// between the calendar header and the grid, and across the top of Triggers cards.
// Renders nothing on themes that don't opt in (decor.leopardTrim).
export function PrintTrim({ height = 5 }: { height?: number }) {
  const decor = useDecor()
  if (!decor.leopardTrim) return null
  return (
    <div aria-hidden="true" className="shrink-0">
      <div style={{ height, background: 'var(--leopard-bold)' }} />
      <div style={{ height: 1.5, background: 'var(--gold-line)' }} />
    </div>
  )
}

// The grab handle at the top of a bottom sheet. On themes with decor.sheetBand
// (leopard) it becomes a 16px print band (grabber sitting on it) with a gold
// hairline; otherwise it's the plain neutral grabber pill.
export function SheetGrabber() {
  const decor = useDecor()
  if (decor.sheetBandHolo) {
    return (
      <div aria-hidden="true">
        <div
          className="tt-holo-band flex items-center justify-center"
          style={{ height: 22, background: 'var(--tt-holo)' }}
        >
          <div
            className="h-1.5 w-10 rounded-full"
            style={{ backgroundColor: 'rgba(59,10,42,.35)' }}
          />
        </div>
      </div>
    )
  }
  if (decor.sheetBand) {
    return (
      <div aria-hidden="true">
        <div
          className="cl-band flex items-center justify-center"
          style={{ height: 16, background: 'var(--leopard-bold)' }}
        >
          <div
            className="h-1.5 w-9 rounded-full"
            style={{ backgroundColor: 'rgba(252,245,232,.92)' }}
          />
        </div>
        <div style={{ height: 1.5, background: 'var(--gold-line)' }} />
      </div>
    )
  }
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-2 h-1.5 w-9 rounded-full"
      style={{ backgroundColor: 'rgba(0,0,0,0.18)' }}
    />
  )
}
