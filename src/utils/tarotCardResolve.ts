import { tarotCards, type TarotCard } from '../data/tarotCards'
import type { DrawnCard } from '../types'

/** 用当前牌库回填历史记录里可能缺失字段的旧牌数据 */
export function resolveCanonicalTarotCard(card: TarotCard | Partial<TarotCard> & { id: number }): TarotCard {
  const canonical = tarotCards.find((item) => item.id === card.id)
  if (!canonical) {
    return card as TarotCard
  }
  return {
    ...canonical,
    ...card,
    meaning: card.meaning ?? canonical.meaning,
    description: card.description ?? canonical.description,
    interpretation: card.interpretation ?? canonical.interpretation,
    advice: card.advice ?? canonical.advice,
    categories: card.categories ?? canonical.categories,
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
