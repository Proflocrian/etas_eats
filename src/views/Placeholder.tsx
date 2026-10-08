// A simple centered screen used for tabs whose mechanics are not built yet.
export function Placeholder({
  emoji,
  title,
  message,
}: {
  emoji: string
  title: string
  message: string
}) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-3 text-center"
      style={{
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: '1.5rem',
        paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
        paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
      }}
    >
      <span className="text-5xl" role="img" aria-label={title}>
        {emoji}
      </span>
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
      <p className="max-w-xs text-neutral-600">{message}</p>
    </div>
  )
}
