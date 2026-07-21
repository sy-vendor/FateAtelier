import { tarotCards, type TarotCard } from '../data/tarotCards'
import { resolveCanonicalTarotCard } from './tarotCardResolve'
import { getStorageItem, setStorageItem } from './storage'

const DAILY_SEED_KEY = 'tarot-daily-seed'
const DAILY_CARD_STORAGE_KEY = 'tarot-daily-card'

export interface DailyCardRecord {
  date: string
  cardId: number
  isReversed: boolean
}

function getTodayKey(): string {
  const today = new Date()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${mm}-${dd}`
}

function getOrCreateUserSeed(): string {
  const result = getStorageItem<string>(DAILY_SEED_KEY)
  if (result.success && result.data) return result.data

  const seed =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  setStorageItem(DAILY_SEED_KEY, seed)
  return seed
}

function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function drawFromSeed(dateKey: string, seed: string): { card: TarotCard; isReversed: boolean } {
  const combined = hashString(`${dateKey}:${seed}`)
  const card = resolveCanonicalTarotCard(tarotCards[combined % tarotCards.length])
  const isReversed = (combined >>> 1) % 2 === 1
  return { card, isReversed }
}

function findCardById(cardId: number): TarotCard | undefined {
  const found = tarotCards.find((c) => c.id === cardId)
  return found ? resolveCanonicalTarotCard(found) : undefined
}

/** 每人每日一牌：同用户同日固定，不同用户不同牌 */
export function getDailyTarotDraw(): {
  card: TarotCard
  isReversed: boolean
  revealed: boolean
} {
  const dateKey = getTodayKey()
  const stored = getStorageItem<DailyCardRecord & { cardId?: number }>(DAILY_CARD_STORAGE_KEY)

  if (stored.success && stored.data?.date === dateKey) {
    if (stored.data.cardId !== undefined) {
      const card = findCardById(stored.data.cardId)
      if (card) {
        return {
          card,
          isReversed: stored.data.isReversed,
          revealed: true,
        }
      }
    }

    // 兼容旧数据：仅有 date + isReversed，无 cardId
    const { card } = drawFromSeed(dateKey, getOrCreateUserSeed())
    return {
      card,
      isReversed: stored.data.isReversed,
      revealed: true,
    }
  }

  const { card, isReversed } = drawFromSeed(dateKey, getOrCreateUserSeed())
  return { card, isReversed, revealed: false }
}

export function saveDailyTarotDraw(cardId: number, isReversed: boolean): void {
  setStorageItem(DAILY_CARD_STORAGE_KEY, {
    date: getTodayKey(),
    cardId,
    isReversed,
  } satisfies DailyCardRecord)
}
