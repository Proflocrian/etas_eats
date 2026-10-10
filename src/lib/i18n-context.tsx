import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { type Lang, loadLang, saveLang, translate, translateList } from './i18n'

type TFn = (key: string, vars?: Record<string, string | number>) => string

interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: TFn
  tList: (key: string) => string[]
}

const I18nContext = createContext<I18n | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => loadLang())

  const setLang = useCallback((next: Lang) => {
    saveLang(next)
    setLangState(next)
  }, [])

  const t = useCallback<TFn>((key, vars) => translate(lang, key, vars), [lang])
  const tList = useCallback((key: string) => translateList(lang, key), [lang])

  const value = useMemo(
    () => ({ lang, setLang, t, tList }),
    [lang, setLang, t, tList],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within a LanguageProvider')
  return ctx
}
