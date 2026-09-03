import { tarotCards, type TarotCard } from '../data/tarotCards'
import { tarotCardsEn } from '../data/tarotCards.en'
import type { DrawnCard } from '../types'
import { isEnglishLocale } from '../i18n/locale'

/** 用当前牌库回填历史记录里可能缺失字段的旧牌数据（文案随当前语言切换，不沿用旧语言快照） */
export function resolveCanonicalTarotCard(card: TarotCard | Partial<TarotCard> & { id: number }): TarotCard {
  const canonical = tarotCards.find((item) => item.id === card.id)
  if (!canonical) {
    return card as TarotCard
  }

  const en = isEnglishLocale() ? tarotCardsEn[canonical.id] : undefined
  return {
    ...canonical,
    ...card,
    // Identity from canonical; localized copy never sticks to a prior-language snapshot.
    name: canonical.name,
    nameEn: canonical.nameEn,
    type: canonical.type,
    suit: canonical.suit,
    meaning: en?.meaning ?? canonical.meaning,
    description: en?.description ?? canonical.description,
    interpretation: en?.interpretation ?? canonical.interpretation,
    advice: en?.advice ?? canonical.advice,
    categories: en?.categories ?? canonical.categories,
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
