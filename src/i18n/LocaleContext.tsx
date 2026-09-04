import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getStorageString, setStorageItem } from '../utils/storage'
import { canonicalLocalePath, switchLocalePath } from '../utils/localePath'
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
  // Default product language is English; only prefer Chinese when the browser is clearly zh*.
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
}

function savedLocale(): Locale | null {
  const value = getStorageString(STORAGE_KEY).data
  return value === 'zh-CN' || value === 'en' ? value : null
}

/**
 * Resolve locale from URL.
 * Unprefixed paths → English; `/zh/*` → Chinese; legacy `/en/*` → English.
 * Bare `/` is always English (product default).
 */
function localeFromLocation(): Locale | null {
  const parts = window.location.pathname.split('/').filter(Boolean)
  if (parts[0] === 'zh' || parts[0] === 'zh-CN') return 'zh-CN'
  if (parts[0] === 'en') return 'en'
  return 'en'
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

  // Prefer explicit URL locale over storage / geo guess; normalize legacy `/en` paths.
  useEffect(() => {
    const syncFromUrl = () => {
      const fromUrl = localeFromLocation()
      const canonical = canonicalLocalePath(window.location.pathname)
      if (canonical !== window.location.pathname) {
        window.history.replaceState(null, '', canonical)
      }
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
    // Geo hint only when storage is empty; URL already forces English on unprefixed paths.
    if (savedLocale()) return

    const controller = new AbortController()
    fetch('/api/locale', { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<{ locale?: Locale }>) : null))
      .then((result) => {
        if (result?.locale !== 'zh-CN') return
        if (savedLocale()) return
        setStorageItem(STORAGE_KEY, 'zh-CN')
        setLocaleState('zh-CN')
        if (!window.location.pathname.startsWith('/zh')) {
          window.history.replaceState(null, '', switchLocalePath(window.location.pathname, 'zh-CN'))
        }
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

/** Colocated with provider for app DX; not a Fast Refresh concern for this context module. */
// eslint-disable-next-line react-refresh/only-export-components -- useLocale belongs with LocaleProvider
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
