import { useState } from 'react'
import { HeartWatermark } from '../components/decor'
import { Modal } from '../components/Modal'
import { useI18n } from '../lib/i18n-context'
import { useBackToClose } from '../lib/use-back-to-close'
import { COLORS } from '../lib/theme'
import { GerdView } from './GerdView'

const PHOTO_URL = `${import.meta.env.BASE_URL}us.jpeg`
const APP_VERSION = 'v1.1'

type AboutRow = { emoji: string; label: string; onClick: () => void }

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-1 pb-2 pt-5 text-lg font-extrabold text-text-primary">{children}</h2>
  )
}

function LinkCard({ items }: { items: AboutRow[] }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-card-border"
      style={{ backgroundColor: COLORS.settingsButtonBg }}
    >
      {items.map(({ emoji, label, onClick }, i) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className={`flex w-full items-center justify-between px-4 py-3 text-left ${
            i > 0 ? 'border-t border-divider' : ''
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">
              {emoji}
            </span>
            <span className="text-base text-text-primary">{label}</span>
          </span>
          <span className="text-text-muted" aria-hidden="true">
            ›
          </span>
        </button>
      ))}
    </div>
  )
}

export function AboutView() {
  const [alert, setAlert] = useState<{ title: string; body: React.ReactNode } | null>(
    null,
  )
  const [showGerd, setShowGerd] = useState(false)
  const [photoOk, setPhotoOk] = useState(true)
  const { t } = useI18n()

  useBackToClose(showGerd, () => setShowGerd(false))

  if (showGerd) return <GerdView onBack={() => setShowGerd(false)} />

  const helpRows: AboutRow[] = [
    {
      emoji: '❓',
      label: t('about.howToUse'),
      onClick: () =>
        setAlert({ title: t('about.howToUse'), body: t('about.howToUse.body') }),
    },
    {
      emoji: '💜',
      label: t('about.aboutApp'),
      onClick: () =>
        setAlert({ title: t('about.aboutApp'), body: t('about.aboutApp.body') }),
    },
    { emoji: '📖', label: t('about.gerdWiki'), onClick: () => setShowGerd(true) },
  ]

  const rewardRows: AboutRow[] = [
    {
      emoji: '🎁',
      label: t('about.freeGift'),
      onClick: () =>
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', 'noopener'),
    },
    {
      emoji: '🏍️',
      label: t('about.ride'),
      onClick: () => setAlert({ title: t('about.ride'), body: t('about.ride.body') }),
    },
    {
      emoji: '⭐',
      label: t('about.rate'),
      onClick: () => setAlert({ title: t('about.rate'), body: t('about.rate.body') }),
    },
  ]

  const legalRows: AboutRow[] = [
    {
      emoji: '📄',
      label: t('about.terms'),
      onClick: () => setAlert({ title: t('about.terms'), body: t('about.terms.body') }),
    },
  ]

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <HeartWatermark />

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        {/* Hero: photo-as-icon + wordmark + version (like a normal About screen). */}
        <div className="flex flex-col items-center pb-2 pt-4 text-center">
          <button
            type="button"
            onClick={() =>
              setAlert({ title: t('about.photo.title'), body: t('about.photo.body') })
            }
            className="tap h-28 w-28 overflow-hidden rounded-[28px] border border-card-border"
            style={{
              backgroundColor: COLORS.settingsButtonBg,
              boxShadow: COLORS.cardShadow,
            }}
          >
            {photoOk ? (
              <img
                src={PHOTO_URL}
                alt="Us together"
                className="h-full w-full object-cover"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">
                💜
              </div>
            )}
          </button>
          <div className="mt-3 text-2xl">
            <span className="font-bold text-text-primary">Etas </span>
            <span className="font-bold" style={{ color: COLORS.primaryAction }}>
              Eats
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">{APP_VERSION}</p>
        </div>

        <SectionTitle>{t('about.help')}</SectionTitle>
        <LinkCard items={helpRows} />

        <SectionTitle>{t('about.rewards')}</SectionTitle>
        <LinkCard items={rewardRows} />

        <SectionTitle>{t('about.legal')}</SectionTitle>
        <LinkCard items={legalRows} />
      </div>

      {alert && (
        <Modal
          variant="alert"
          title={alert.title}
          bodyMessage={alert.body}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  )
}
