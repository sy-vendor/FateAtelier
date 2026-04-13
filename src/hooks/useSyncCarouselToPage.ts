import { useEffect } from 'react'
import type { AppFeature } from '../constants/appFeatures'
import type { AppPage } from '../types/appPage'

/** 在 currentPage 变化时对齐轮播索引与旋转角（不因拖动中的 rotation 重复触发）。 */
export function useSyncCarouselToPage(
  currentPage: AppPage,
  features: readonly AppFeature[],
  setCarouselIndex: (i: number) => void,
  setCarouselRotation: (r: number | ((prev: number) => number)) => void
) {
  useEffect(() => {
    const currentIndex = features.findIndex(f => f.page === currentPage)
    if (currentIndex < 0) return

    setCarouselIndex(currentIndex)
    setCarouselRotation(carouselRotation => {
      const anglePerItem = 360 / features.length
      const targetRotation = -currentIndex * anglePerItem
      const currentNormalized = ((carouselRotation % 360) + 360) % 360
      const targetNormalized = ((targetRotation % 360) + 360) % 360
      let diff = targetNormalized - currentNormalized
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      return carouselRotation + diff
    })
  }, [currentPage, features, setCarouselIndex, setCarouselRotation])
}
