import { TarotCard } from '../data/tarotCards'

const FAVORITES_KEY = 'tarot-favorites'

export const getFavorites = (): number[] => {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const addFavorite = (cardId: number): void => {
  const favorites = getFavorites()
  if (!favorites.includes(cardId)) {
    favorites.push(cardId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }
}

export const removeFavorite = (cardId: number): void => {
  const favorites = getFavorites()
  const updated = favorites.filter(id => id !== cardId)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
}

export const isFavorite = (cardId: number): boolean => {
  return getFavorites().includes(cardId)
}

export const toggleFavorite = (cardId: number): boolean => {
  const wasFavorite = isFavorite(cardId)
  if (wasFavorite) {
    removeFavorite(cardId)
  } else {
    addFavorite(cardId)
  }
  
  // 触发自定义事件通知其他组件
  window.dispatchEvent(new CustomEvent('favorites-changed', {
    detail: { cardId, isFavorite: !wasFavorite }
  }))
  
  return !wasFavorite
}

export const getFavoriteCards = (allCards: TarotCard[]): TarotCard[] => {
  const favoriteIds = getFavorites()
  return allCards.filter(card => favoriteIds.includes(card.id))
}

