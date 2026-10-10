import { HeartWatermark } from '../components/decor'
import { useI18n } from '../lib/i18n-context'
import { COLORS } from '../lib/theme'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="px-1 pb-2 pt-5 text-lg font-extrabold text-text-primary">{title}</h2>
      <div
        className="rounded-xl border border-card-border p-4 text-sm text-text-secondary"
        style={{ backgroundColor: COLORS.settingsButtonBg }}
      >
        {children}
      </div>
    </>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function GerdView({ onBack }: { onBack: () => void }) {
  const { t, tList } = useI18n()
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
      <div className="relative flex shrink-0 items-center gap-1 py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label={t('common.back')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-text-secondary active:bg-divider"
        >
          ‹
        </button>
        <h1 className="font-display text-3xl font-extrabold text-text-primary">
          {t('gerd.title')}
        </h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        <Section title={t('gerd.whatIs.title')}>{t('gerd.whatIs.body')}</Section>
        <Section title={t('gerd.symptoms.title')}>
          <Bullets items={tList('gerd.symptoms.items')} />
        </Section>
        <Section title={t('gerd.foods.title')}>
          <Bullets items={tList('gerd.foods.items')} />
        </Section>
        <Section title={t('gerd.habits.title')}>
          <Bullets items={tList('gerd.habits.items')} />
        </Section>
        <Section title={t('gerd.gentle.title')}>
          <Bullets items={tList('gerd.gentle.items')} />
        </Section>
        <Section title={t('gerd.tips.title')}>
          <Bullets items={tList('gerd.tips.items')} />
        </Section>

        <p className="px-1 pt-5 text-xs text-text-muted">{t('gerd.disclaimer')}</p>
      </div>
    </div>
  )
}
