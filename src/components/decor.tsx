import { useDecor } from '../lib/theme-context'

// 11:11 marbled wave (treatment #2). Fills its nearest positioned, overflow-hidden
// ancestor; the oversized inner is rotated for a diagonal flow and drifts slowly.
// Reads --wave-svg (set only on 11:11), so callers gate it behind a decor flag.
export function WaveAccent({
  opacity = 1,
  mask,
  duration = 110,
}: {
  opacity?: number
  mask?: string // optional CSS mask-image (header/card fades)
  duration?: number // seconds per drift cycle (shared across all 11:11 waves)
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity, maskImage: mask, WebkitMaskImage: mask }}
    >
      {/* A fixed 150px overhang (not %) so the rotated layer covers the corners of
          short/wide containers too (header, theme card). The 478x358 size is a 2px
          underscan of the 480x360 tile, so tiles overlap slightly and hide the seam. */}
      <div
        className="tt-wave absolute"
        style={{
          inset: '-150px',
          background: 'var(--wave-svg) 0 0 / 478px 358px repeat',
          animationDuration: `${duration}s`,
        }}
      />
    </div>
  )
}

// A 4-point Y2K star (2000s). Used as the today marker twinkle, Trigger List
// bullets and the Settings theme-card check.
export function Star({
  size = 12,
  color = '#FFFFFF',
  className,
}: {
  size?: number
  color?: string
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
    </svg>
  )
}

// A scatter of twinkling Y2K stars (2000s). Fills its nearest positioned,
// overflow-hidden ancestor. Staggered delays make it read as glittery.
type SparkleStar = { left: string; top: string; size: number; delay: string }
const DEFAULT_SPARKLES: SparkleStar[] = [
  { left: '8%', top: '30%', size: 11, delay: '0s' },
  { left: '46%', top: '66%', size: 7, delay: '.5s' },
  { left: '70%', top: '20%', size: 13, delay: '1.1s' },
  { left: '88%', top: '58%', size: 8, delay: '1.7s' },
  { left: '28%', top: '48%', size: 6, delay: '2.3s' },
]
export function Sparkles({
  stars = DEFAULT_SPARKLES,
  color = '#FFFFFF',
  big = false,
}: {
  stars?: SparkleStar[]
  color?: string
  big?: boolean // bigger, more frequent twinkle (background field)
}) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className={`${big ? 'tt-twinkle-lg' : 'tt-twinkle'} absolute`}
          style={{ left: s.left, top: s.top, animationDelay: s.delay }}
        >
          <Star size={s.size} color={color} />
        </span>
      ))}
    </span>
  )
}

// 11:11 heart-clock watermark: a large, faint heart-clock bleeding off the
// top-right edge of Settings and About. Renders nothing unless decor.watermark.
export function HeartWatermark() {
  const decor = useDecor()
  if (!decor.watermark) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ right: -70, top: 30, opacity: 0.07 }}
    >
      <HeartClock size={260} stroke={1.2} color="#FFFFFF" />
    </div>
  )
}

// 11:11 line-art heart-clock (treatment #3). Stroke-only; the hour hand points to
// 11 and the minute hand to :11. `vector-effect: non-scaling-stroke` keeps the
// line the given px weight at any size. Used on sheets, the Settings/About
// watermark and the theme card (the calendar 11:11 marker is a 🩵 emoji, not this).
export function HeartClock({
  size = 42,
  stroke = 1.5,
  pulse = false,
  color = '#FFFFFF',
}: {
  size?: number
  stroke?: number
  pulse?: boolean
  color?: string
}) {
  return (
    <svg
      width={size}
      height={(size * 96) / 100}
      viewBox="0 0 100 96"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={pulse ? 'tt-heart-pulse' : undefined}
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        d="M50 88C20 64 6 48 6 32 6 18 16 8 29 8c10 0 17 6 21 14 4-8 11-14 21-14 13 0 23 10 23 24 0 16-14 32-44 56Z"
      />
      <path vectorEffect="non-scaling-stroke" d="M43 38 50 50 68 42" />
      <circle cx="50" cy="50" r="2.6" fill={color} stroke="none" />
    </svg>
  )
}

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
  if (decor.sheetWave) {
    // 11:11: a 66px transparent band over the wave - white grabber, then the
    // pulsing heart-clock centred under it.
    return (
      <div
        aria-hidden="true"
        className="relative flex flex-col items-center gap-2 pt-2"
        style={{ height: 66 }}
      >
        <div
          className="h-[5px] w-10 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,.85)' }}
        />
        <HeartClock size={42} stroke={2.2} pulse color="#FFFFFF" />
      </div>
    )
  }
  if (decor.sheetBandHolo) {
    return (
      <div aria-hidden="true">
        <div
          className="tt-holo-band relative flex items-center justify-center overflow-hidden"
          style={{ height: 22, background: 'var(--tt-holo)' }}
        >
          <Sparkles
            stars={[
              { left: '14%', top: '24%', size: 6, delay: '0s' },
              { left: '42%', top: '56%', size: 5, delay: '.6s' },
              { left: '66%', top: '28%', size: 7, delay: '1.2s' },
              { left: '86%', top: '52%', size: 5, delay: '1.8s' },
            ]}
            color="#FFFFFF"
          />
          <div
            className="relative h-1.5 w-10 rounded-full"
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
