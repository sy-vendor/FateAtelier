import { useEffect, useState } from 'react'
import { TarotCard } from '../data/tarotCards'
import { TarotCardVisual } from './tarot/TarotCardVisual'
import './CardDrawAnimation.css'

interface CardDrawAnimationProps {
  card: TarotCard | null
  isReversed: boolean
  onComplete: () => void
}

function CardDrawAnimation({ card, isReversed, onComplete }: CardDrawAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [faceUp, setFaceUp] = useState(false)

  useEffect(() => {
    if (card) {
      setShowAnimation(true)
      setFaceUp(false)

      const revealTimer = setTimeout(() => setFaceUp(true), 1200)
      const completeTimer = setTimeout(() => {
        setShowAnimation(false)
        onComplete()
      }, 2800)

      return () => {
        clearTimeout(revealTimer)
        clearTimeout(completeTimer)
      }
    }
  }, [card, onComplete])

  if (!showAnimation || !card) {
    return null
  }

  return (
    <div className="draw-animation-overlay">
      <div className="draw-animation-container">
        <div className="animation-magic-circle" />
        <TarotCardVisual card={card} faceUp={faceUp} isReversed={isReversed} size="lg" />
      </div>
    </div>
  )
}

export default CardDrawAnimation
