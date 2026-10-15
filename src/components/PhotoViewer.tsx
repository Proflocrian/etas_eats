import { useEffect } from 'react'
import { useI18n } from '../lib/i18n-context'

// Fullscreen photo overlay: the image at full size (contained to the viewport),
// on a near-black scrim. Close with the ✕, a tap on the scrim, or Escape. The
// device Back button is wired up by the parent (via useBackToClose on the
// viewing flag), not here - calling that hook from this freshly-mounted
// component would churn history under StrictMode.
export function PhotoViewer({
  src,
  alt,
  onClose,
}: {
  src: string
  alt?: string
  onClose: () => void
}) {
  const { t } = useI18n()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="scrim-fade fixed inset-0 z-[70] flex items-center justify-center p-4"
      onClick={(e) => {
        // Don't let the click bubble to the form/sheet scrim behind us.
        e.stopPropagation()
        onClose()
      }}
      style={{ backgroundColor: 'rgba(0,0,0,.92)' }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white active:opacity-70"
        style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        ✕
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
