import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getStorageString, setStorageItem } from '../utils/storage'
import { canonicalLocalePath, switchLocalePath } from '../utils/localePath'
import {
  getEnLocalePackVersion,
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
  // Product default is Chinese; only prefer English when the browser is clearly non-zh.
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
}

function savedLocale(): Locale | null {
  const value = getStorageString(STORAGE_KEY).data
  return value === 'zh-CN' || value === 'en' ? value : null
}

/**
 * Resolve locale from URL.
 * Unprefixed → Chinese; `/en/*` → English; legacy `/zh/*` → Chinese (until redirects land).
 */
function localeFromLocation(): Locale {
  const parts = window.location.pathname.split('/').filter(Boolean)
  if (parts[0] === 'en') return 'en'
  if (parts[0] === 'zh' || parts[0] === 'zh-CN') return 'zh-CN'
  return 'zh-CN'
}

function hasExplicitLocalePrefix(): boolean {
  const first = window.location.pathname.split('/').filter(Boolean)[0]
  return first === 'en' || first === 'zh' || first === 'zh-CN'
}

function initialLocale(): Locale {
  if (hasExplicitLocalePrefix()) return localeFromLocation()
  return savedLocale() ?? browserLocale()
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale())
  const [enPackVersion, setEnPackVersion] = useState(() => getEnLocalePackVersion())

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [locale])

  useEffect(() => subscribeEnLocalePacks(() => setEnPackVersion(getEnLocalePackVersion())), [])

  // Prefer explicit URL locale over storage / geo guess; normalize legacy `/zh` paths.
  // Do not persist unprefixed Chinese on first visit — geo may still choose English.
  useEffect(() => {
    const syncFromUrl = () => {
      const fromUrl = localeFromLocation()
      const canonical = canonicalLocalePath(window.location.pathname)
      if (canonical !== window.location.pathname) {
        window.history.replaceState(null, '', canonical)
      }

      if (hasExplicitLocalePrefix()) {
        setStorageItem(STORAGE_KEY, fromUrl)
        setLocaleState((previous) => (previous === fromUrl ? previous : fromUrl))
        return
      }

      const saved = savedLocale()
      if (saved) {
        setLocaleState((previous) => (previous === saved ? previous : saved))
        if (saved === 'en' && !window.location.pathname.startsWith('/en')) {
          window.history.replaceState(null, '', switchLocalePath(window.location.pathname, 'en'))
        } else if (saved === 'zh-CN' && window.location.pathname.startsWith('/en')) {
          window.history.replaceState(null, '', switchLocalePath(window.location.pathname, 'zh-CN'))
        }
        return
      }

      // Unprefixed + no preference: leave initialLocale (browser hint or Chinese) alone
      // so geo can still choose English without a flash race.
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  useEffect(() => {
    // Geo hint only when the user has not chosen / been assigned a locale yet.
    if (savedLocale()) return
    if (hasExplicitLocalePrefix()) return

    const controller = new AbortController()
    const commitChinese = () => {
      if (savedLocale()) return
      setStorageItem(STORAGE_KEY, 'zh-CN')
      setLocaleState('zh-CN')
    }

    const timer = window.setTimeout(commitChinese, 1800)

    fetch('/api/locale', { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<{ locale?: Locale }>) : null))
      .then((result) => {
        if (savedLocale()) return
        if (result?.locale === 'en') {
          setStorageItem(STORAGE_KEY, 'en')
          setLocaleState('en')
          if (!window.location.pathname.startsWith('/en')) {
            window.history.replaceState(null, '', switchLocalePath(window.location.pathname, 'en'))
          }
          return
        }
        commitChinese()
      })
      .catch(() => {
        commitChinese()
      })
      .finally(() => {
        window.clearTimeout(timer)
      })

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [])

  // First paint with non-Chinese browser + no saved locale: land on /en without waiting for geo.
  useEffect(() => {
    if (savedLocale()) return
    if (hasExplicitLocalePrefix()) return
    if (browserLocale() !== 'en') return
    setStorageItem(STORAGE_KEY, 'en')
    setLocaleState('en')
    if (!window.location.pathname.startsWith('/en')) {
      window.history.replaceState(null, '', switchLocalePath(window.location.pathname, 'en'))
    }
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isEnglish: locale === 'en',
      enPackVersion,
      setLocale: (next) => {
        setStorageItem(STORAGE_KEY, next)
        setLocaleState(next)
        const nextPath = switchLocalePath(window.location.pathname, next)
        if (nextPath !== window.location.pathname) {
          window.history.pushState(null, '', nextPath)
        }
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
