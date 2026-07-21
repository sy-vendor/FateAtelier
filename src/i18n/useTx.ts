import { useCallback } from 'react'
import { useLocale } from './LocaleContext'

export type Tx = (zh: string, en: string) => string

export function useTx(): Tx {
  const { isEnglish } = useLocale()
  return useCallback((zh, en) => (isEnglish ? en : zh), [isEnglish])
}
