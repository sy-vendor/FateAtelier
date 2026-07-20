import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Locale = 'zh-CN' | 'en'

const STORAGE_KEY = 'fate-atelier-locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  isEnglish: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function browserLocale(): Locale {
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
}

function savedLocale(): Locale | null {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'zh-CN' || value === 'en' ? value : null
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => savedLocale() ?? browserLocale())

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    if (savedLocale()) return

    const controller = new AbortController()
    fetch('/api/locale', { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<{ locale?: Locale }> : null)
      .then((result) => {
        if (result?.locale === 'zh-CN' || result?.locale === 'en') setLocaleState(result.locale)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    isEnglish: locale === 'en',
    setLocale: (next) => {
      localStorage.setItem(STORAGE_KEY, next)
      setLocaleState(next)
    },
  }), [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
