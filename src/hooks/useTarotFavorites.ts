import { useCallback, useEffect, useState } from 'react'
import { getFavorites, toggleFavorite as toggleFavoriteStorage } from '../utils/favorites'

export function useTarotFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(getFavorites)

  useEffect(() => {
    const sync = () => setFavoriteIds(getFavorites())
    window.addEventListener('favorites-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('favorites-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isFavorite = useCallback(
    (cardId: number) => favoriteIds.includes(cardId),
    [favoriteIds],
  )

  const toggleFavorite = useCallback((cardId: number) => {
    toggleFavoriteStorage(cardId)
    setFavoriteIds(getFavorites())
  }, [])

  return { isFavorite, toggleFavorite }
}
