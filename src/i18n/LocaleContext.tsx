import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getStorageString, setStorageItem } from '../utils/storage'
import { switchLocalePath } from '../utils/localePath'
import {
  ensureEnLocalePacks,
  getEnLocalePackVersion,
  prefetchEnLocalePacksIfNeeded,
  subscribeEnLocalePacks,
} from './enLocalePacks'

export type Locale = 'zh-CN' | 'en'

const STORAGE_KEY = 'fate-atelier-locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  isEnglish: boolean
  /** Bumps when English corpora finish loading — use in memo deps for localized results. */
  enPackVersion: number
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function browserLocale(): Locale {
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
}

function savedLocale(): Locale | null {
  const value = getStorageString(STORAGE_KEY).data
  return value === 'zh-CN' || value === 'en' ? value : null
}

/** Resolve locale from URL. `/en/*` → en; other feature paths → zh-CN; `/` keeps preference. */
function localeFromLocation(): Locale | null {
  const parts = window.location.pathname.split('/').filter(Boolean)
  if (parts[0] === 'en') return 'en'
  if (parts.length > 0) return 'zh-CN'
  return null
}

function initialLocale(): Locale {
  return localeFromLocation() ?? savedLocale() ?? browserLocale()
}

prefetchEnLocalePacksIfNeeded()

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale())
  const [enPackVersion, setEnPackVersion] = useState(() => getEnLocalePackVersion())

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [locale])

  useEffect(() => subscribeEnLocalePacks(() => setEnPackVersion(getEnLocalePackVersion())), [])

  useEffect(() => {
    if (locale === 'en') void ensureEnLocalePacks()
  }, [locale])

  // Prefer explicit /en or Chinese feature URLs over storage / geo guess.
  useEffect(() => {
    const syncFromUrl = () => {
      const fromUrl = localeFromLocation()
      if (!fromUrl) return
      if (fromUrl === 'en') void ensureEnLocalePacks()
      setLocaleState((previous) => (previous === fromUrl ? previous : fromUrl))
      setStorageItem(STORAGE_KEY, fromUrl)
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  useEffect(() => {
    if (localeFromLocation() || savedLocale()) return

    const controller = new AbortController()
    fetch('/api/locale', { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<{ locale?: Locale }>) : null))
      .then((result) => {
        if (result?.locale !== 'zh-CN' && result?.locale !== 'en') return
        if (localeFromLocation()) return
        if (result.locale === 'en') void ensureEnLocalePacks()
        setLocaleState(result.locale)
        setStorageItem(STORAGE_KEY, result.locale)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isEnglish: locale === 'en',
      enPackVersion,
      setLocale: (next) => {
        const apply = () => {
          setStorageItem(STORAGE_KEY, next)
          setLocaleState(next)
          const nextPath = switchLocalePath(window.location.pathname, next)
          if (nextPath !== window.location.pathname) {
            window.history.pushState(null, '', nextPath)
          }
        }
        if (next === 'en') {
          void ensureEnLocalePacks().then(apply)
          return
        }
        apply()
      },
    }),
    [locale, enPackVersion],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
