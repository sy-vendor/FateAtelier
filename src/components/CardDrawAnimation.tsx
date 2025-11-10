import { useEffect, useState } from 'react'
import { TarotCard } from '../data/tarotCards'
import { getCardIcon } from '../utils/cardIcons'
import './CardDrawAnimation.css'

interface CardDrawAnimationProps {
  card: TarotCard | null
  isReversed: boolean
  onComplete: () => void
}

function CardDrawAnimation({ card, isReversed, onComplete }: CardDrawAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [revealCard, setRevealCard] = useState(false)

  useEffect(() => {
    if (card) {
      setShowAnimation(true)
      setRevealCard(false)
      
      // 延迟显示卡片
      const timer = setTimeout(() => {
        setRevealCard(true)
      }, 1500)

      // 动画完成后回调
      const completeTimer = setTimeout(() => {
        setShowAnimation(false)
        onComplete()
      }, 3000)

      return () => {
        clearTimeout(timer)
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
        <div className="animation-magic-circle"></div>
        <div className="animation-sparkles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
          ))}
        </div>
        
        {revealCard && (
          <div className={`animated-card ${isReversed ? 'reversed' : ''}`}>
            <div className="animated-card-icon">{getCardIcon(card)}</div>
            <div className="animated-card-name">{card.name}</div>
            {isReversed && <div className="animated-reversed-badge">逆位</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default CardDrawAnimation

