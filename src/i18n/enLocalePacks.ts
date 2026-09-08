import type { TarotCardLocale } from '../data/tarotCards.en'
import type { DivinationStickLocale } from '../data/divinationSticks.en'
import type { DreamSymbolLocale } from '../data/dreamSymbols.en'
import type { AppPage } from '../types/appPage'

export type EnPackId = 'tarot' | 'divination' | 'dream'

export interface EnLocalePacks {
  tarotCardsEn: Record<number, TarotCardLocale>
  divinationSticksEn: Record<number, DivinationStickLocale>
  dreamSymbolsEn: DreamSymbolLocale[]
}

const emptyPacks = (): EnLocalePacks => ({
  tarotCardsEn: {},
  divinationSticksEn: {},
  dreamSymbolsEn: [],
})

let packs: EnLocalePacks = emptyPacks()
const loaded = new Set<EnPackId>()
const loading = new Map<EnPackId, Promise<void>>()
let version = 0
const listeners = new Set<() => void>()

function bump() {
  version += 1
  listeners.forEach((listener) => listener())
}

export function getEnLocalePacks(): EnLocalePacks | null {
  if (loaded.size === 0) return null
  return packs
}

export function getEnLocalePackVersion(): number {
  return version
}

export function subscribeEnLocalePacks(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function isEnPackLoaded(id: EnPackId): boolean {
  return loaded.has(id)
}

/** Load a single English corpus when the matching feature is opened. */
export function ensureEnPack(id: EnPackId): Promise<void> {
  if (loaded.has(id)) return Promise.resolve()
  const existing = loading.get(id)
  if (existing) return existing

  const task = (async () => {
    if (id === 'tarot') {
      const mod = await import('../data/tarotCards.en')
      packs = { ...packs, tarotCardsEn: mod.tarotCardsEn }
    } else if (id === 'divination') {
      const mod = await import('../data/divinationSticks.en')
      packs = { ...packs, divinationSticksEn: mod.divinationSticksEn }
    } else {
      const mod = await import('../data/dreamSymbols.en')
      packs = { ...packs, dreamSymbolsEn: mod.dreamSymbolsEn }
    }
    loaded.add(id)
    loading.delete(id)
    bump()
  })()

  loading.set(id, task)
  return task
}

/** @deprecated Prefer ensureEnPack for the active feature. Kept for rare full warm-ups. */
export function ensureEnLocalePacks(): Promise<EnLocalePacks> {
  return Promise.all([
    ensureEnPack('tarot'),
    ensureEnPack('divination'),
    ensureEnPack('dream'),
  ]).then(() => packs)
}

const PAGE_TO_PACK: Partial<Record<AppPage, EnPackId>> = {
  tarot: 'tarot',
  divination: 'divination',
  dream: 'dream',
}

/** Prefetch only the EN pack needed for the current SPA page (if any). */
export function ensureEnPackForPage(page: AppPage): void {
  const id = PAGE_TO_PACK[page]
  if (id) void ensureEnPack(id)
}
