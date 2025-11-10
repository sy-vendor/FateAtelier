import { useState, useEffect } from 'react'
import { TarotCard } from '../data/tarotCards'
import { tarotCards } from '../data/tarotCards'
import { getFavoriteCards, toggleFavorite } from '../utils/favorites'
import { getCardIcon, getSuitIcon } from '../utils/cardIcons'
import './Favorites.css'

interface FavoritesProps {
  onSelectCard: (card: TarotCard) => void
}

function Favorites({ onSelectCard }: FavoritesProps) {
  const [favoriteCards, setFavoriteCards] = useState<TarotCard[]>([])
  const [showFavorites, setShowFavorites] = useState(false)

  const updateFavorites = () => {
    setFavoriteCards(getFavoriteCards(tarotCards))
  }

  useEffect(() => {
    const handleFavoritesChange = () => {
      updateFavorites()
    }
    
    // 初始化时更新
    updateFavorites()
    
    // 监听收藏变化事件
    window.addEventListener('favorites-changed', handleFavoritesChange)
    
    return () => {
      window.removeEventListener('favorites-changed', handleFavoritesChange)
    }
  }, [])

  const handleToggleFavorite = (card: TarotCard) => {
    toggleFavorite(card.id)
    // updateFavorites会在事件监听器中自动调用
  }

  if (!showFavorites) {
    return (
      <button 
        className="favorites-toggle"
        onClick={() => setShowFavorites(true)}
        title="我的收藏"
      >
        ⭐ 我的收藏 ({favoriteCards.length})
      </button>
    )
  }

  return (
    <div className="favorites-overlay" onClick={() => setShowFavorites(false)}>
      <div className="favorites-container" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-header">
          <h2>⭐ 我的收藏</h2>
          <button className="close-favorites" onClick={() => setShowFavorites(false)}>✕</button>
        </div>

        {favoriteCards.length === 0 ? (
          <div className="favorites-empty">
            <p>还没有收藏任何牌面</p>
            <p className="empty-hint">在浏览牌面时点击⭐图标可以收藏</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoriteCards.map((card) => (
              <div key={card.id} className="favorite-card-item">
                <div 
                  className="favorite-card"
                  onClick={() => {
                    onSelectCard(card)
                    setShowFavorites(false)
                  }}
                >
                  <div className="favorite-card-icon">{getCardIcon(card)}</div>
                  <div className="favorite-card-name">{card.name}</div>
                  <div className="favorite-card-name-en">{card.nameEn}</div>
                  {card.suit && (
                    <div className="favorite-card-suit">{getSuitIcon(card.suit)}</div>
                  )}
                </div>
                <button
                  className="remove-favorite-btn"
                  onClick={() => handleToggleFavorite(card)}
                  title="取消收藏"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites

