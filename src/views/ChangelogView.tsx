import { HeartWatermark } from '../components/decor'
import { useI18n } from '../lib/i18n-context'
import { COLORS } from '../lib/theme'

// Version history. English only (deliberately not translated), newest first.
const CHANGELOG: { version: string; items: string[] }[] = [
  {
    version: 'v1.2',
    items: [
      'Entries can now have a length (30 min up to 12 hours), and can run past midnight',
      'Calendar blocks are sized to their duration; overlapping entries sit side by side',
      'My love can attach a photo to a food or activity entry, with tap-to-fullscreen',
      'Proper launch screens with the logo on iOS and Android',
      'The status bar now matches each theme',
    ],
  },
  {
    version: 'v1.1',
    items: [
      'Full translations: English, Italian and Dutch',
      'The About Page',
      'The GERD Wiki',
      'Added 11:11 theme',
      'Version numbers',
      'Easter eggs and in-jokes hidden throughout',
    ],
  },
  {
    version: 'v1.0',
    items: [
      'The foundations: A calendar to log food, activities and symptoms',
      'Flag possible triggers',
      'Works offline and installs',
      'Export everything to a CSV',
    ],
  },
]

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <>
      <h2 className="px-1 pb-2 pt-5 text-lg font-extrabold text-text-primary">{title}</h2>
      <div
        className="rounded-xl border border-card-border p-4 text-sm text-text-secondary"
        style={{ backgroundColor: COLORS.settingsButtonBg }}
      >
        <ul className="list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export function ChangelogView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n()
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
          {t('about.changelog')}
        </h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        {CHANGELOG.map(({ version, items }) => (
          <Section key={version} title={version} items={items} />
        ))}
      </div>
    </div>
  )
}
