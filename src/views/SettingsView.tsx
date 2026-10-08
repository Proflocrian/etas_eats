import { useState } from 'react'
import {
  COLORS,
  type Palette,
  type ThemeId,
  THEMES,
  applyTheme,
  loadThemeId,
  saveThemeId,
} from '../lib/theme'

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
    <h2 className="px-1 pb-2 pt-5 text-sm font-semibold text-neutral-500">{children}</h2>
  )
}

export function SettingsView() {
  const [themeId, setThemeId] = useState<ThemeId>(() => loadThemeId())
  const [language, setLanguage] = useState('en') // placeholder, non-functional

  function selectTheme(id: ThemeId) {
    setThemeId(id)
    applyTheme(id)
    saveThemeId(id)
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <h1 className="shrink-0 px-1 py-2 text-xl font-bold text-neutral-800">
        Settings
      </h1>

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        {/* Theme */}
        <SectionTitle>Theme</SectionTitle>
        <div className="flex flex-col gap-2">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const theme = THEMES[id]
            const active = id === themeId
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectTheme(id)}
                aria-pressed={active}
                className="flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left"
                style={{
                  backgroundColor: COLORS.settingsButtonBg,
                  borderColor: active ? theme.palette.primaryAction : '#e5e5e5',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-base font-semibold text-neutral-800"
                    style={{ fontFamily: theme.font }}
                  >
                    {theme.label}
                  </span>
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
                    style={{ color: theme.palette.primaryAction }}
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
          className="overflow-hidden rounded-xl border border-neutral-200"
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
                  i > 0 ? 'border-t border-neutral-100' : ''
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <span className="text-base text-neutral-800">{lang.label}</span>
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
          className="overflow-hidden rounded-xl border border-neutral-200"
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
              <span className="text-base text-neutral-800">Export Data</span>
            </span>
            <span className="text-neutral-300" aria-hidden="true">
              ›
            </span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between border-t border-neutral-100 px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                📩
              </span>
              <span className="text-base text-neutral-800">
                Request Features / Bug Support
              </span>
            </span>
            <span className="text-neutral-300" aria-hidden="true">
              ›
            </span>
          </button>
        </div>

        {/* Battery */}
        <SectionTitle>Battery</SectionTitle>
        <div
          className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3"
          style={{ backgroundColor: COLORS.settingsButtonBg }}
        >
          <span className="text-xl" aria-hidden="true">
            🪫
          </span>
          <span className="text-sm text-neutral-700">
            Battery Percentage: (Probably) Too Low, Charge it babe!
          </span>
        </div>

        {/* Danger Area */}
        <SectionTitle>Danger Area</SectionTitle>
        <div
          className="overflow-hidden rounded-xl border-2 border-red-200"
          style={{ backgroundColor: COLORS.settingsButtonBg }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left active:bg-red-50"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                🗑️
              </span>
              <span className="text-base font-semibold text-red-600">
                Delete All Data
              </span>
            </span>
            <span className="text-red-300" aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
