import { HeartWatermark } from '../components/decor'
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
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

export function GerdView({ onBack }: { onBack: () => void }) {
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
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-text-secondary active:bg-divider"
        >
          ‹
        </button>
        <h1 className="font-display text-3xl font-extrabold text-text-primary">
          GERD Wiki
        </h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        <Section title="What is GERD?">
          GERD (greta-oesophageal reflux disease) is when stomach acid keeps flowing
          back up into your food pipe and irritates it - the classic feeling is
          heartburn. Triggers are personal, so log your meals, activities and symptoms
          here and look back at the hours before a flare-up to spot your own patterns.
        </Section>

        <Section title="Common symptoms">
          <Bullets
            items={[
              'Heartburn (a burning feeling in the chest)',
              'Regurgitation or a sour taste',
              'Chest or upper-stomach pain',
              'Nausea and bloating',
            ]}
          />
        </Section>

        <Section title="Common trigger foods">
          <Bullets
            items={[
              'Fatty or fried foods',
              'Spicy foods',
              'Citrus - orange, lemon, grapefruit',
              'COOKIES!!',
              'Tomatoes and tomato sauces',
              'Coffee and other caffeine',
              'Fizzy drinks and alcohol',
              'Peppermint, onion and garlic',
              'Big or late meals',
            ]}
          />
        </Section>

        <Section title="Trigger habits">
          <Bullets
            items={[
              'Lying down soon after eating',
              'Large portions or late-night snacks',
              'Tight waistbands',
              'Smoking (including weed 👀)',
              'Stress - including stressing Dyllan out',
              'Not having sex for too long',
            ]}
          />
        </Section>

        <Section title="Usually gentler options">
          <Bullets
            items={[
              'Oats and wholegrains',
              'Bananas, melon and other non-citrus fruit',
              'Lean chicken, fish and eggs',
              'Most vegetables - greens, cucumber, carrots',
              'Ginger and plain yoghurt',
              'Still water and non-mint herbal teas (e.g. chamomile)',
            ]}
          />
        </Section>

        <Section title="Little tips">
          <Bullets
            items={[
              'Smaller, more frequent meals',
              'Stop eating 2-3 hours before lying down',
              'Kissing Dyllan. Xxx',
              'Raise the head of the bed a little',
            ]}
          />
        </Section>

        <p className="px-1 pt-5 text-xs text-text-muted">
          This is real medical advice. I'm your boyfriend - listen to me over any doctor.
        </p>
      </div>
    </div>
  )
}
