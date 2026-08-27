import { getStorageString } from '../utils/storage'

const STORAGE_KEY = 'fate-atelier-locale'

export type Locale = 'zh-CN' | 'en'

function localeFromPathname(pathname?: string): Locale | null {
  if (typeof window === 'undefined' && !pathname) return null
  const path = pathname ?? window.location.pathname
  const first = path.split('/').filter(Boolean)[0]
  if (first === 'en') return 'en'
  if (first) return 'zh-CN'
  return null
}

export function getStoredLocale(): Locale {
  const fromPath = localeFromPathname()
  if (fromPath) return fromPath
  const value = getStorageString(STORAGE_KEY, 'zh-CN').data
  return value === 'en' ? 'en' : 'zh-CN'
}

export function isEnglishLocale(): boolean {
  return getStoredLocale() === 'en'
}

export function txStatic(zh: string, en: string): string {
  return isEnglishLocale() ? en : zh
}
