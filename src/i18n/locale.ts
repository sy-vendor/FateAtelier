import { getStorageString } from '../utils/storage'

const STORAGE_KEY = 'fate-atelier-locale'

export type Locale = 'zh-CN' | 'en'

export function getStoredLocale(): Locale {
  const value = getStorageString(STORAGE_KEY, 'zh-CN').data
  return value === 'en' ? 'en' : 'zh-CN'
}

export function isEnglishLocale(): boolean {
  return getStoredLocale() === 'en'
}

export function txStatic(zh: string, en: string): string {
  return isEnglishLocale() ? en : zh
}
