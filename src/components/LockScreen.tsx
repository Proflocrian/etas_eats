import { useState } from 'react'
import { UNLOCK_CODE, setUnlocked } from '../lib/lock'
import { COLORS } from '../lib/theme'

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (code.trim().toUpperCase() === UNLOCK_CODE) {
      setUnlocked(true)
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center text-center"
      style={{
        backgroundColor: COLORS.appBg,
        paddingTop: 'max(2rem, env(safe-area-inset-top))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
        paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
      }}
    >
      <div className="w-full max-w-xs">
        <div className="mb-4 text-5xl" aria-hidden="true">
          🎁
        </div>
        <h1 className="mb-3 text-3xl">
          <span className="font-bold text-text-primary">Etas </span>
          <span className="font-bold" style={{ color: COLORS.primaryAction }}>
            Eats
          </span>
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Thank you for installing EtasEats. Please use the provided code to use.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setError(false)
            }}
            placeholder="Enter code"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-center text-base text-text-primary outline-none focus:border-primary"
          />
          {error && (
            <p className="text-sm font-medium text-danger-text">
              Incorrect voucher code, please double check your voucher.
            </p>
          )}
          <button
            type="submit"
            className="tap rounded-lg px-4 py-2.5 text-sm font-semibold"
            style={{ background: 'var(--save-bg)', color: 'var(--save-text)' }}
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
