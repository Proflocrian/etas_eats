import { useRef, useState } from 'react'
import { clearAllEntries, getAllEntries } from '../db/entries'
import { entriesToCsv } from '../lib/csv'
import { useI18n } from '../lib/i18n-context'
import type { Lang } from '../lib/i18n'
import { setUnlocked } from '../lib/lock'
import { COLORS, type Palette, type ThemeId, THEMES } from '../lib/theme'
import { useTheme } from '../lib/theme-context'
import { HeartClock, HeartWatermark, Sparkles, Star, WaveAccent } from '../components/decor'
import { Modal } from '../components/Modal'

// 11:11 theme card: the wave fades in from the right.
const CARD_WAVE_MASK = 'linear-gradient(90deg,transparent,#000 75%)'

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
  { id: 'it', label: 'Italiano 🤌🤌', flag: '🇮🇹' },
  { id: 'nl', label: 'Nederlands (jij moet practice)', flag: '🇳🇱' },
  { id: 'zh', label: '中國人', flag: '🇨🇳' },
]

const WHATSAPP_PHONE = '447428922494'

// The whatsapp:// scheme opens the app directly; iOS cancels the page navigation,
// so (unlike window.open) nothing blank is left behind in the installed PWA.
function openWhatsApp(text: string) {
  window.location.href = `whatsapp://send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`
}

const FEATURE_REQUEST_TEXT = 'Hi babe, can you please implement ... in EtasEats for me? 💜 Xxx'
const DONATE_TEXT = "Hey babe, here's a nude for you xxx"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-1 pb-2 pt-5 text-lg font-extrabold text-text-primary">{children}</h2>
  )
}

export function SettingsView() {
  const { themeId, setTheme: selectTheme } = useTheme()
  const { lang: currentLang, setLang, t } = useI18n()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [alert, setAlert] = useState<{ title: string; body: React.ReactNode } | null>(
    null,
  )

  // Easter egg: if she cycles through every theme this session (no persistence -
  // leaving the tab unmounts this view and resets it), tease her once.
  const triedThemes = useRef<Set<ThemeId>>(new Set([themeId]))
  const classicGretaShown = useRef(false)

  function chooseTheme(id: ThemeId) {
    selectTheme(id)
    triedThemes.current.add(id)
    if (
      !classicGretaShown.current &&
      triedThemes.current.size === Object.keys(THEMES).length
    ) {
      classicGretaShown.current = true
      setAlert({
        title: t('settings.gretaTease.title'),
        body: t('settings.gretaTease.body'),
      })
    }
  }

  async function exportData() {
    try {
      const csv = entriesToCsv(await getAllEntries())
      const file = new File(
        [`﻿${csv}`],
        `EtasEats-${new Date().toISOString().slice(0, 10)}.csv`,
        { type: 'text/csv' },
      )
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'EtasEats entries' })
      } else {
        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      // Share sheet dismissed (AbortError) is expected; ignore it.
      if ((err as Error)?.name !== 'AbortError') {
        setAlert({ title: 'Export failed', body: "Couldn't export your data, sorry babe." })
      }
    }
  }

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
      <h1 className="font-display relative shrink-0 px-1 py-2 text-4xl font-extrabold text-text-primary">
        {t('settings.title')}
      </h1>

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        {/* Theme */}
        <SectionTitle>{t('settings.theme')}</SectionTitle>
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
            // 11:11 active card: denim card, 🩵 border + halo, wave on the right, a
            // heart-clock icon and a 🩵 check disc.
            const elevenActive = id === 'eleven-eleven' && active
            // The palette preview dots. On leopard's dark espresso plate they take a
            // faint gold ring (so the dark swatches stay visible); elsewhere a hairline.
            const swatchDots = (
              <span className="flex gap-1">
                {SWATCH_KEYS.map((k) => (
                  <span
                    key={k}
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: theme.palette[k],
                      boxShadow: leopardActive
                        ? '0 0 0 1px rgba(245,221,151,.45)'
                        : '0 0 0 1px rgba(0,0,0,.1)',
                    }}
                  />
                ))}
              </span>
            )
            return (
              <button
                key={id}
                type="button"
                onClick={() => chooseTheme(id)}
                aria-pressed={active}
                className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left ${
                  leopardActive ? 'cl-theme-card' : ''
                } ${trashyActive ? 'tt-holo-band relative overflow-hidden' : ''} ${
                  elevenActive ? 'relative overflow-hidden' : ''
                }`}
                style={
                  leopardActive
                    ? { background: 'var(--leopard-bold-sm)', borderColor: '#B8862C' }
                    : trashyActive
                      ? { backgroundImage: 'var(--tt-holo)', borderColor: '#FF5FB0' }
                      : elevenActive
                        ? {
                            backgroundColor: COLORS.settingsButtonBg,
                            borderColor: '#A8D8EA',
                          }
                        : {
                            backgroundColor: COLORS.settingsButtonBg,
                            borderColor: active ? theme.palette.primaryAction : COLORS.cardBorder,
                          }
                }
              >
                {elevenActive && <WaveAccent opacity={0.55} mask={CARD_WAVE_MASK} />}
                {trashyActive && <Sparkles />}
                <div className="relative flex items-center gap-3">
                  {elevenActive && <HeartClock size={22} stroke={1.5} color="#FFFFFF" />}
                  {leopardActive ? (
                    // One espresso plate wrapping the name AND the palette.
                    <span
                      className="flex items-center gap-2.5 rounded-full px-3 py-1"
                      style={{ background: '#17100A', boxShadow: 'inset 0 0 0 1px #8C6421' }}
                    >
                      <span
                        className="text-base font-semibold"
                        style={{
                          color: '#F3D58C',
                          fontFamily: theme.fontDisplay ?? theme.font,
                          fontStyle: 'italic',
                        }}
                      >
                        {theme.label}
                      </span>
                      {swatchDots}
                    </span>
                  ) : (
                    <>
                      {id === 'etas-eats' ? (
                        // Styled like the Uber Eats wordmark: "Eats" in the brand green.
                        <span className="text-base" style={{ fontFamily: theme.font }}>
                          <span className="font-bold text-text-primary">Etas </span>
                          <span
                            className="font-bold"
                            style={{ color: theme.palette.primaryAction }}
                          >
                            Eats
                          </span>
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
                      {swatchDots}
                    </>
                  )}
                </div>
                {active &&
                  (elevenActive ? (
                    <span
                      className="relative flex h-[26px] w-[26px] items-center justify-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: '#A8D8EA', color: '#12304F' }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  ) : trashyActive ? (
                    <span className="relative">
                      <Star size={20} color={theme.palette.primaryAction} />
                    </span>
                  ) : leopardActive ? (
                    // Espresso disc with a gold tick (spec T8).
                    <span
                      className="relative flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        background: '#17100A',
                        color: '#F3D58C',
                        boxShadow: 'inset 0 0 0 1px #8C6421',
                      }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      className="relative text-lg font-bold"
                      style={{ color: theme.palette.primaryAction }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  ))}
              </button>
            )
          })}
        </div>

        {/* Language */}
        <SectionTitle>{t('settings.language')}</SectionTitle>
        <div
          className="overflow-hidden rounded-xl border border-card-border"
          style={{ backgroundColor: COLORS.settingsButtonBg }}
        >
          {LANGUAGES.map((lang, i) => {
            const active = lang.id === currentLang
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() =>
                  lang.id === 'zh'
                    ? setAlert({ title: '傻女孩', body: '你不會說中文' })
                    : setLang(lang.id as Lang)
                }
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
        <SectionTitle>{t('settings.dataSupport')}</SectionTitle>
        <div
          className="overflow-hidden rounded-xl border border-card-border"
          style={{ backgroundColor: COLORS.settingsButtonBg }}
        >
          <button
            type="button"
            onClick={exportData}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                📤
              </span>
              <span className="text-base text-text-primary">
                {t('settings.exportData')}
              </span>
            </span>
            <span className="text-text-muted" aria-hidden="true">
              ›
            </span>
          </button>
          <button
            type="button"
            onClick={() => openWhatsApp(FEATURE_REQUEST_TEXT)}
            className="flex w-full items-center justify-between border-t border-divider px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                📩
              </span>
              <span className="text-base text-text-primary">
                {t('settings.requestFeatures')}
              </span>
            </span>
            <span className="text-text-muted" aria-hidden="true">
              ›
            </span>
          </button>
          <button
            type="button"
            onClick={() => openWhatsApp(DONATE_TEXT)}
            className="flex w-full items-center justify-between border-t border-divider px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                🎁
              </span>
              <span className="text-base text-text-primary">{t('settings.donate')}</span>
            </span>
            <span className="text-text-muted" aria-hidden="true">
              ›
            </span>
          </button>
        </div>

        {/* Battery */}
        <SectionTitle>{t('settings.battery')}</SectionTitle>
        <div
          className="overflow-hidden rounded-xl border border-card-border"
          style={{ backgroundColor: COLORS.settingsButtonBg }}
        >
          <button
            type="button"
            onClick={() =>
              setAlert({
                title: t('settings.batteryAlert.title'),
                body: (
                  <>
                    <em>{t('settings.batteryAlert.pre')}</em>
                    {t('settings.batteryAlert.post')}
                  </>
                ),
              })
            }
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                🪫
              </span>
              <span className="text-base text-text-primary">
                {t('settings.checkBattery')}
              </span>
            </span>
            <span className="text-text-muted" aria-hidden="true">
              ›
            </span>
          </button>
        </div>

        {/* Danger Area */}
        <SectionTitle>{t('settings.dangerArea')}</SectionTitle>
        <div
          className="overflow-hidden rounded-xl border-2 border-danger-border"
          style={{ backgroundColor: COLORS.dangerBg }}
        >
          <button
            type="button"
            onClick={() => {
              setUnlocked(false)
              window.location.reload()
            }}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                🎫
              </span>
              <span className="text-base font-semibold text-danger-text">
                {t('settings.removeVouchers')}
              </span>
            </span>
            <span className="text-danger-text opacity-60" aria-hidden="true">
              ›
            </span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center justify-between border-t border-danger-border px-4 py-3 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                🗑️
              </span>
              <span className="text-base font-semibold text-danger-text">
                {t('settings.deleteAll')}
              </span>
            </span>
            <span className="text-danger-text opacity-60" aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      </div>

      {confirmDelete && (
        <Modal
          variant="confirm"
          title="BABY!!"
          bodyMessage={
            <>
              Do you know what you're doing?? This will delete <em>all</em> data, and
              all entries. Are you sure!?
            </>
          }
          onConfirm={async () => {
            await clearAllEntries()
            setUnlocked(false)
          }}
          onClose={() => setConfirmDelete(false)}
        />
      )}

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
