import type { TarotCardLocale } from '../data/tarotCards.en'
import type { DivinationStickLocale } from '../data/divinationSticks.en'
import type { DreamSymbolLocale } from '../data/dreamSymbols.en'

export interface EnLocalePacks {
  tarotCardsEn: Record<number, TarotCardLocale>
  divinationSticksEn: Record<number, DivinationStickLocale>
  dreamSymbolsEn: DreamSymbolLocale[]
}

let packs: EnLocalePacks | null = null
let loading: Promise<EnLocalePacks> | null = null
let version = 0
const listeners = new Set<() => void>()

export function getEnLocalePacks(): EnLocalePacks | null {
  return packs
}

export function getEnLocalePackVersion(): number {
  return version
}

export function subscribeEnLocalePacks(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function ensureEnLocalePacks(): Promise<EnLocalePacks> {
  if (packs) return Promise.resolve(packs)
  if (!loading) {
    loading = Promise.all([
      import('../data/tarotCards.en'),
      import('../data/divinationSticks.en'),
      import('../data/dreamSymbols.en'),
    ]).then(([tarot, sticks, dream]) => {
      packs = {
        tarotCardsEn: tarot.tarotCardsEn,
        divinationSticksEn: sticks.divinationSticksEn,
        dreamSymbolsEn: dream.dreamSymbolsEn,
      }
      version += 1
      listeners.forEach((listener) => listener())
      return packs
    })
  }
  return loading
}

/** Kick off EN pack download early when the URL is already English. */
export function prefetchEnLocalePacksIfNeeded(pathname = window.location.pathname): void {
  const first = pathname.split('/').filter(Boolean)[0]
  if (first === 'en') void ensureEnLocalePacks()
}
