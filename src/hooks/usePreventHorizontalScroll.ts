import { useEffect } from 'react'

/** 在轮播外区域抑制水平滑动，避免移动端整页左右晃 */
export function usePreventHorizontalScroll() {
  useEffect(() => {
    const preventHorizontalScroll = (e: TouchEvent) => {
      const carousel = document.querySelector('.carousel-container')
      if (carousel) {
        const touch = e.touches[0] || e.changedTouches[0]
        const rect = carousel.getBoundingClientRect()
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          return
        }
      }

      if (e.touches.length === 1) {
        const t = e.touches[0]
        const startX = t.clientX
        const startY = t.clientY

        const handleMove = (moveEvent: TouchEvent) => {
          if (moveEvent.touches.length === 1) {
            const moveTouch = moveEvent.touches[0]
            const deltaX = Math.abs(moveTouch.clientX - startX)
            const deltaY = Math.abs(moveTouch.clientY - startY)
            if (deltaX > deltaY && deltaX > 10) {
              moveEvent.preventDefault()
            }
          }
        }

        const handleEnd = () => {
          document.removeEventListener('touchmove', handleMove)
          document.removeEventListener('touchend', handleEnd)
        }

        document.addEventListener('touchmove', handleMove, { passive: false })
        document.addEventListener('touchend', handleEnd)
      }
    }

    document.addEventListener('touchstart', preventHorizontalScroll, { passive: false })
    return () => {
      document.removeEventListener('touchstart', preventHorizontalScroll)
    }
  }, [])
}
