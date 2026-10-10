import { type Lang, translate } from './i18n'

const MONTH_ABBR: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  it: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
  nl: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
}

// Indexed by Date.getDay() (0 = Sunday).
const WEEKDAY_SHORT: Record<Lang, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
  nl: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
}

export function monthAbbr(date: Date, lang: Lang): string {
  return MONTH_ABBR[lang][date.getMonth()]
}

export function weekdayShort(date: Date, lang: Lang): string {
  return WEEKDAY_SHORT[lang][date.getDay()]
}

// e.g. 'Fri, 9 Oct 2026' (en) / 'ven, 9 ott 2026' (it) / 'vr, 9 okt 2026' (nl).
export function formatLongDate(date: Date, lang: Lang): string {
  return `${weekdayShort(date, lang)}, ${date.getDate()} ${monthAbbr(date, lang)} ${date.getFullYear()}`
}

// Human gap before a symptom, e.g. '5h before' / '1d 3h before'.
export function formatGap(minutes: number, lang: Lang): string {
  const mins = Math.max(0, Math.round(minutes))
  let dur: string
  if (mins < 60) {
    dur = translate(lang, 'gap.m', { n: mins })
  } else {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h < 24) {
      dur = m
        ? `${translate(lang, 'gap.h', { n: h })} ${translate(lang, 'gap.m', { n: m })}`
        : translate(lang, 'gap.h', { n: h })
    } else {
      const d = Math.floor(h / 24)
      const rh = h % 24
      dur = rh
        ? `${translate(lang, 'gap.d', { n: d })} ${translate(lang, 'gap.h', { n: rh })}`
        : translate(lang, 'gap.d', { n: d })
    }
  }
  return translate(lang, 'gap.before', { x: dur })
}
