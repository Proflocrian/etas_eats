import { UNLOCK_CODE } from '../lib/lock'

// Shown when the app is opened in a normal browser tab (not the installed PWA).
// Styled as a standalone brand landing page - fixed EtasEats green + black, so it
// looks the same regardless of the theme saved from a previous install.
const GREEN = '#06C167'
const CARD = '#141414'

// Render `*word*` segments of an install step as bold.
function Step({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <strong key={i} className="font-bold">
            {p.slice(1, -1)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

const STEPS = [
  'Open this link in *Safari* on your iPhone.',
  'Tap ☰ in the address bar.',
  'Tap *Share*.',
  'Tap *View More ⬇*.',
  'Tap *"Add to Home Screen"*, then *Add*.',
  'Open *EtasEats* from your home screen.',
]

function Badge({ icon, top, bottom }: { icon: string; top: string; bottom: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-white"
      style={{ backgroundColor: CARD }}
    >
      <span className="text-xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] opacity-80">{top}</span>
        <span className="text-sm font-bold">{bottom}</span>
      </span>
    </span>
  )
}

export function InstallPrompt() {
  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{
        backgroundColor: GREEN,
        color: '#0A0A0A',
        paddingTop: 'max(2rem, env(safe-area-inset-top))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
        paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
      }}
    >
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight">
          Eat it?
          <br />
          Track it.
        </h1>

        <p className="mt-4 text-base leading-snug">
          That's right - log every meal, snack (including the cookies and the
          cwoisswants) and symptom in your own private food diary, and let's figure out
          your triggers pretty stuff. Xxx
        </p>

        <h2 className="mt-7 text-lg font-extrabold">How to install:</h2>
        <ol className="mt-2 flex flex-col gap-2">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-3 text-base leading-snug">
              <span className="font-bold tabular-nums">{i + 1}.</span>
              <span>
                <Step text={step} />
              </span>
            </li>
          ))}
          {/* Step 7: the voucher-code card. */}
          <li className="mt-1 flex gap-3">
            <span className="font-bold tabular-nums">7.</span>
            <div
              className="flex-1 rounded-2xl px-4 py-4 text-white"
              style={{ backgroundColor: CARD }}
            >
              <p className="text-sm font-medium">
                Enter your voucher code to unlock the app. 💜
              </p>
              <span
                className="mt-3 inline-block rounded-lg px-4 py-2 font-mono text-base font-bold tracking-wider"
                style={{ backgroundColor: GREEN, color: '#06351E' }}
              >
                {UNLOCK_CODE}
              </span>
            </div>
          </li>
        </ol>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Badge icon="📲" top="Add it to your" bottom="Home Screen" />
          <Badge icon="🧭" top="Opens in" bottom="Safari · Offline" />
        </div>

        <div className="mt-8 text-4xl font-extrabold leading-[0.95]">
          Etas
          <br />
          Eats
        </div>
      </div>
    </div>
  )
}
