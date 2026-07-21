import { useEffect, useState } from 'react'
import { TarotCard } from '../data/tarotCards'
import { getThreeCardPositionLabel } from '../utils/readingInterpretation'
import { useLocale } from '../i18n/LocaleContext'
import { TarotCardVisual } from './tarot/TarotCardVisual'
import './ThreeCardDrawAnimation.css'

interface ThreeCardDrawAnimationProps {
  cards: Array<{ card: TarotCard; isReversed: boolean }> | null
  onComplete: () => void
}

function ThreeCardDrawAnimation({ cards, onComplete }: ThreeCardDrawAnimationProps) {
  const { isEnglish } = useLocale()
  const [showAnimation, setShowAnimation] = useState(false)
  const [faceUp, setFaceUp] = useState<boolean[]>([false, false, false])

  useEffect(() => {
    if (cards && cards.length === 3) {
      setShowAnimation(true)
      setFaceUp([false, false, false])

      const timers: ReturnType<typeof setTimeout>[] = []

      timers.push(setTimeout(() => setFaceUp([true, false, false]), 1000))
      timers.push(setTimeout(() => setFaceUp([true, true, false]), 1800))
      timers.push(setTimeout(() => setFaceUp([true, true, true]), 2600))

      const completeTimer = setTimeout(() => {
        setShowAnimation(false)
        onComplete()
      }, 4200)

      return () => {
        timers.forEach(clearTimeout)
        clearTimeout(completeTimer)
      }
    }
  }, [cards, onComplete])

  if (!showAnimation || !cards || cards.length !== 3) {
    return null
  }

  return (
    <div className="three-card-draw-animation-overlay">
      <div className="three-card-draw-animation-container">
        <div className="three-card-magic-circle" />
        <div className="three-cards-animation-wrapper">
          {cards.map((drawnCard, index) => (
            <div key={drawnCard.card.id} className="three-card-animation-item">
              <div className="three-card-position-label">
                {getThreeCardPositionLabel(index as 0 | 1 | 2, isEnglish)}
              </div>
              <TarotCardVisual
                card={drawnCard.card}
                faceUp={faceUp[index]}
                isReversed={drawnCard.isReversed}
                size="md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThreeCardDrawAnimation
