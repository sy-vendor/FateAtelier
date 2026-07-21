import { tarotCards, type TarotCard } from '../data/tarotCards'
import { tarotCardsEn } from '../data/tarotCards.en'
import type { DrawnCard } from '../types'
import { isEnglishLocale } from '../i18n/locale'

/** 用当前牌库回填历史记录里可能缺失字段的旧牌数据 */
export function resolveCanonicalTarotCard(card: TarotCard | Partial<TarotCard> & { id: number }): TarotCard {
  const canonical = tarotCards.find((item) => item.id === card.id)
  if (!canonical) {
    return card as TarotCard
  }

  const en = isEnglishLocale() ? tarotCardsEn[canonical.id] : undefined
  return {
    ...canonical,
    ...card,
    meaning: en?.meaning ?? card.meaning ?? canonical.meaning,
    description: en?.description ?? card.description ?? canonical.description,
    interpretation: en?.interpretation ?? card.interpretation ?? canonical.interpretation,
    advice: en?.advice ?? card.advice ?? canonical.advice,
    categories: en?.categories ?? card.categories ?? canonical.categories,
  }
}

export function resolveDrawnCard(drawn: DrawnCard): DrawnCard {
  return {
    ...drawn,
    card: resolveCanonicalTarotCard(drawn.card),
  }
}

export function resolveDrawnCards(cards: DrawnCard[]): DrawnCard[] {
  return cards.map(resolveDrawnCard)
}
