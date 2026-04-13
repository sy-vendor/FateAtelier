import { useRef, type CSSProperties } from 'react'
import type { AppFeature } from '../../constants/appFeatures'
import type { AppPage } from '../../types/appPage'

function normalizeCarouselRotation(rotation: number): number {
  let r = rotation
  while (r < -180) r += 360
  while (r > 180) r -= 360
  return r
}

export interface AppCarouselProps {
  features: AppFeature[]
  carouselIndex: number
  setCarouselIndex: (i: number) => void
  carouselRotation: number
  setCarouselRotation: (r: number | ((prev: number) => number)) => void
  touchStart: number
  setTouchStart: (n: number) => void
  touchEnd: number
  setTouchEnd: (n: number) => void
  setCurrentPage: (page: AppPage) => void
}

function AppCarousel({
  features,
  carouselIndex,
  setCarouselIndex,
  carouselRotation,
  setCarouselRotation,
  touchStart,
  setTouchStart,
  touchEnd,
  setTouchEnd,
  setCurrentPage,
}: AppCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="carousel-container"
      onTouchStart={(e) => {
        e.preventDefault()
        setTouchStart(e.targetTouches[0].clientX)
      }}
      onTouchMove={(e) => {
        if (touchStart) {
          e.preventDefault()
          setTouchEnd(e.targetTouches[0].clientX)
        }
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        if (!touchStart || !touchEnd) {
          setTouchStart(0)
          setTouchEnd(0)
          return
        }
        const distance = touchStart - touchEnd
        const minSwipeDistance = 50
        const totalFeatures = features.length
        const anglePerItem = 360 / totalFeatures

        if (Math.abs(distance) > minSwipeDistance) {
          if (distance > 0) {
            const newIndex = (carouselIndex + 1) % totalFeatures
            setCarouselRotation(normalizeCarouselRotation(carouselRotation - anglePerItem))
            setCarouselIndex(newIndex)
            setCurrentPage(features[newIndex].page)
          } else if (distance < 0) {
            const newIndex = (carouselIndex - 1 + totalFeatures) % totalFeatures
            setCarouselRotation(normalizeCarouselRotation(carouselRotation + anglePerItem))
            setCarouselIndex(newIndex)
            setCurrentPage(features[newIndex].page)
          }
        }
        setTouchStart(0)
        setTouchEnd(0)
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        const startX = e.clientX
        const startRotation = carouselRotation
        const currentIndex = carouselIndex
        let isDraggingActive = true
        let lastX = startX

        setTouchStart(startX)

        const trackEl = trackRef.current
        if (trackEl) {
          trackEl.classList.add('no-transition')
        }

        const handleMouseMove = (moveEvent: MouseEvent) => {
          if (!isDraggingActive) return
          const currentX = moveEvent.clientX
          const deltaX = currentX - startX
          lastX = currentX

          setTouchEnd(currentX)

          const totalFeatures = features.length
          const anglePerItem = 360 / totalFeatures
          const sensitivity = 0.4
          const rotationDelta = (deltaX / 100) * anglePerItem * sensitivity
          const newRotation = normalizeCarouselRotation(startRotation - rotationDelta)

          setCarouselRotation(newRotation)
        }

        const handleMouseUp = () => {
          isDraggingActive = false

          const trackUp = trackRef.current
          if (trackUp) {
            setTimeout(() => {
              trackUp.classList.remove('no-transition')
            }, 0)
          }

          const finalDistance = startX - lastX
          const minSwipeDistance = 30
          const totalFeatures = features.length
          const anglePerItem = 360 / totalFeatures

          if (Math.abs(finalDistance) > minSwipeDistance) {
            if (finalDistance > 0) {
              const newIndex = (currentIndex + 1) % totalFeatures
              setCarouselRotation(normalizeCarouselRotation(startRotation - anglePerItem))
              setCarouselIndex(newIndex)
              setCurrentPage(features[newIndex].page)
            } else if (finalDistance < 0) {
              const newIndex = (currentIndex - 1 + totalFeatures) % totalFeatures
              setCarouselRotation(normalizeCarouselRotation(startRotation + anglePerItem))
              setCarouselIndex(newIndex)
              setCurrentPage(features[newIndex].page)
            }
          } else {
            setCarouselRotation(startRotation)
          }

          setTouchStart(0)
          setTouchEnd(0)

          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }}
    >
      <div className="carousel-wrapper">
        <div
          ref={trackRef}
          className="carousel-track"
          style={{
            transform: `translateZ(-400px) rotateY(${carouselRotation}deg)`,
            '--carousel-rotation': `${carouselRotation}deg`,
          } as CSSProperties}
        >
          {features.map((feature, index) => {
            const isCenter = index === carouselIndex
            const angle = (360 / Math.max(1, features.length)) * index
            const translateZ = isCenter ? 450 : 400
            return (
              <div
                key={feature.page}
                className={`carousel-item ${isCenter ? 'center' : ''}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${translateZ}px)`
                }}
                onClick={() => {
                  const anglePerItem = 360 / features.length
                  setCarouselRotation(-index * anglePerItem)
                  setCarouselIndex(index)
                  setCurrentPage(feature.page)
                }}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    const anglePerItem = 360 / features.length
                    setCarouselRotation(-index * anglePerItem)
                    setCarouselIndex(index)
                    setCurrentPage(feature.page)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`选择${feature.name}功能`}
              >
                <div className="feature-card">
                  <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
                  <div className="feature-name">{feature.name}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AppCarousel
