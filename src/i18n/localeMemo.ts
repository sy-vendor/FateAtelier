/**
 * Tie a memoized value to the active locale / English pack revision.
 * Use when the computation reads locale via module globals (isEnglishLocale, EN packs)
 * so React Hook lint sees a real dependency instead of an unused `isEnglish`.
 */
export function withLocaleKey<T>(localeKey: string, value: T): T {
  void localeKey
  return value
}

export function localeMemoKey(isEnglish: boolean, enPackVersion = 0): string {
  return isEnglish ? `en:${enPackVersion}` : 'zh'
}
