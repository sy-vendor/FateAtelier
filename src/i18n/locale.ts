const STORAGE_KEY = 'fate-atelier-locale'

export type Locale = 'zh-CN' | 'en'

export function getStoredLocale(): Locale {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'en' ? 'en' : 'zh-CN'
}

export function isEnglishLocale(): boolean {
  return getStoredLocale() === 'en'
}

export function txStatic(zh: string, en: string): string {
  return isEnglishLocale() ? en : zh
}
