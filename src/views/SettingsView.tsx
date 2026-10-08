import { useState } from 'react'
import { COLORS, type Palette, type ThemeId, THEMES } from '../lib/theme'
import { useTheme } from '../lib/theme-context'

// Colours shown as a preview swatch row for each theme.
const SWATCH_KEYS: (keyof Palette)[] = [
  'primaryAction',
  'foodEntryBorder',
  'activityEntryBorder',
  'symptomEntryBorder',
  'triggerPillBorder',
]

const LANGUAGES: { id: string; label: string; flag: string }[] = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'it', label: 'Italian', flag: '🇮🇹' },
  { id: 'nl', label: 'Dutch', flag: '🇳🇱' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-1 pb-2 pt-5 text-sm font-semibold text-text-muted">{children}</h2>
  )
}

export function SettingsView() {
  const { themeId, setTheme: selectTheme } = useTheme()
  const [language, setLanguage] = useState('en') // placeholder, non-functional

  return (
    <div
      className="flex h-full flex-col"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <h1 className="font-display shrink-0 px-1 py-2 text-xl font-bold text-text-primary">
        Settings
      </h1>

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        {/* Theme */}
        <SectionTitle>Theme</SectionTitle>
        <div className="flex flex-col gap-2">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const theme = THEMES[id]
            const active = id === themeId
            // Leopard's active card gets the full print/gold treatment (T8); its
            // treatment vars are only set while leopard is the active theme, which
            // is exactly when this card is the active one.
            const leopardActive = id === 'cunty-leopard' && active
            // Trashy 2000s active card: drifting holographic fill + pink rhinestone border.
            const trashyActive = id === 'trashy-2000s' && active
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectTheme(id)}
                aria-pressed={active}
                className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left ${
                  leopardActive ? 'cl-theme-card' : ''
                } ${trashyActive ? 'tt-holo-band' : ''}`}
                style={
                  leopardActive
                    ? { background: 'var(--leopard-bold-sm)', borderColor: '#B8862C' }
                    : trashyActive
                      ? { backgroundImage: 'var(--tt-holo)', borderColor: '#FF5FB0' }
                      : {
                          backgroundColor: COLORS.settingsButtonBg,
                          borderColor: active ? theme.palette.primaryAction : COLORS.cardBorder,
                        }
                }
              >
                <div className="flex items-center gap-3">
                  {leopardActive ? (
                    <span
                      className="rounded-[13px] px-2.5 py-0.5 text-base font-semibold"
                      style={{
                        background: '#17100A',
                        color: '#F3D58C',
                        boxShadow: 'inset 0 0 0 1px #8C6421',
                        fontFamily: theme.fontDisplay ?? theme.font,
                        fontStyle: 'italic',
                      }}
                    >
                      {theme.label}
                    </span>
                  ) : (
                    <span
                      className="text-base font-semibold text-text-primary"
                      style={{
                        fontFamily: theme.fontDisplay ?? theme.font,
                        fontStyle: theme.fontDisplayStyle ?? 'normal',
                      }}
                    >
                      {theme.label}
                    </span>
                  )}
                  <span className="flex gap-1">
                    {SWATCH_KEYS.map((k) => (
                      <span
                        key={k}
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: theme.palette[k] }}
                      />
                    ))}
                  </span>
                </div>
                {active && (
                  <span
                    className="text-lg font-bold"
                    style={{ color: leopardActive ? '#F3D58C' : theme.palette.primaryAction }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Language */}
        <SectionTitle>Language</SectionTitle>
        <div
          className="overflow-hidden rounded-xl border border-card-border"
          style={{ backgroundColor: COLORS.settingsButtonBg }}
        >
          {LANGUAGES.map((lang, i) => {
            const active = lang.id === language
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id)}
                aria-pressed={active}
                className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                  i > 0 ? 'border-t border-divider' : ''
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span className="text-base text-text-primary">{lang.label}</span>
                </span>
                {active && (
                  <span
                    className="text-lg font-bold"
                    style={{ color: COLORS.primaryAction }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Actions */}
        <SectionTitle>Data & Support</SectionTitle>
        <div
          className="overflow-hidden rounded-xl border border-card-border"
          style={{ backgroundColor: COLORS.settingsButtonBg }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                📤
              </span>
              <span className="text-base text-text-primary">Export Data</span>
            </span>
            <span className="text-text-muted" aria-hidden="true">
              ›
            </span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between border-t border-divider px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                📩
              </span>
              <span className="text-base text-text-primary">
                Request Features / Bug Support
              </span>
            </span>
            <span className="text-text-muted" aria-hidden="true">
              ›
            </span>
          </button>
        </div>

        {/* Battery */}
        <SectionTitle>Battery</SectionTitle>
        <div
          className="flex items-center gap-3 rounded-xl border border-card-border px-4 py-3"
          style={{ backgroundColor: COLORS.settingsButtonBg }}
        >
          <span className="text-xl" aria-hidden="true">
            🪫
          </span>
          <span className="text-sm text-text-secondary">
            Battery Percentage: (Probably) Too Low, Charge it babe!
          </span>
        </div>

        {/* Danger Area */}
        <SectionTitle>Danger Area</SectionTitle>
        <div
          className="overflow-hidden rounded-xl border-2 border-danger-border"
          style={{ backgroundColor: COLORS.dangerBg }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                🗑️
              </span>
              <span className="text-base font-semibold text-danger-text">
                Delete All Data
              </span>
            </span>
            <span className="text-danger-text opacity-60" aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
