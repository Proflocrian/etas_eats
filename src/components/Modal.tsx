import { useI18n } from '../lib/i18n-context'
import { COLORS, type Palette } from '../lib/theme'

// Echoes the theme swatch row on the Settings theme cards.
const SWATCH_KEYS: (keyof Palette)[] = [
  'primaryAction',
  'foodEntryBorder',
  'activityEntryBorder',
  'symptomEntryBorder',
  'triggerPillBorder',
]

type ModalProps = {
  title: string
  bodyMessage: React.ReactNode
  onClose: () => void
} & (
  | { variant: 'alert'; okLabel?: string; onOk?: () => void }
  | { variant: 'confirm'; onConfirm: () => void; confirmLabel?: string; cancelLabel?: string }
)

export function Modal(props: ModalProps) {
  const { title, bodyMessage, onClose } = props
  const { t } = useI18n()
  // Truly modal: backdrop taps are swallowed, not dismissed. Closes only via the
  // buttons, or via device Back (handled by the host surface's own back-to-close).
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="scrim-fade fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ backgroundColor: COLORS.scrim }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="sheet-scope w-full max-w-xs rounded-2xl p-5 text-center"
        style={{ backgroundColor: COLORS.sheetBg, boxShadow: COLORS.sheetShadow }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mb-3 flex justify-center gap-1">
          {SWATCH_KEYS.map((k) => (
            <span
              key={k}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[k], boxShadow: '0 0 0 1px rgba(0,0,0,.1)' }}
            />
          ))}
        </span>

        <h2 className="font-display mb-2 text-xl font-bold text-text-primary">{title}</h2>
        <p className="mb-5 text-sm text-text-secondary">{bodyMessage}</p>

        {props.variant === 'alert' ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                props.onOk?.()
                onClose()
              }}
              className="tap rounded-lg px-6 py-2 text-sm font-semibold"
              style={{ background: 'var(--save-bg)', color: 'var(--save-text)' }}
            >
              {props.okLabel ?? t('common.ok')}
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="tap rounded-lg border px-5 py-2 text-sm font-medium text-text-secondary"
              style={{ backgroundColor: COLORS.pillBg, borderColor: COLORS.pillBorderIdle }}
            >
              {props.cancelLabel ?? t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                props.onConfirm()
                onClose()
              }}
              className="tap rounded-lg px-5 py-2 text-sm font-semibold"
              style={{ background: 'var(--save-bg)', color: 'var(--save-text)' }}
            >
              {props.confirmLabel ?? t('common.yes')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
