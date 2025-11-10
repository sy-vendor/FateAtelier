import { useState, useEffect } from 'react'
import { TarotCard } from '../data/tarotCards'
import { tarotCards } from '../data/tarotCards'
import { getCardIcon, getSuitIcon } from '../utils/cardIcons'
import { toggleFavorite } from '../utils/favorites'
import './CardBrowser.css'

interface CardBrowserProps {
  onSelectCard: (card: TarotCard) => void
}

function CardBrowser({ onSelectCard }: CardBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all')
  const [showBrowser, setShowBrowser] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const updateFavorites = () => {
      try {
        const saved = localStorage.getItem('tarot-favorites')
        setFavorites(saved ? JSON.parse(saved) : [])
      } catch {
        setFavorites([])
      }
    }
    updateFavorites()
    
    // 监听收藏变化事件（包括storage事件和自定义事件）
    window.addEventListener('storage', updateFavorites)
    window.addEventListener('favorites-changed', updateFavorites)
    
    return () => {
      window.removeEventListener('storage', updateFavorites)
      window.removeEventListener('favorites-changed', updateFavorites)
    }
  }, [])

  const filteredCards = tarotCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'major' && card.type === 'major') ||
                         (card.suit === filterType)
    return matchesSearch && matchesFilter
  })

  if (!showBrowser) {
    return (
      <button className="browser-toggle" onClick={() => setShowBrowser(true)}>
        📚 浏览所有牌面
      </button>
    )
  }

  return (
    <div className="card-browser">
      <div className="browser-header">
        <h2>📚 牌面浏览</h2>
        <button className="close-browser" onClick={() => setShowBrowser(false)}>✕</button>
      </div>

      <div className="browser-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索牌面名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={filterType === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterType('all')}
          >
            全部
          </button>
          <button 
            className={filterType === 'major' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterType('major')}
          >
            大阿卡纳
          </button>
          <button 
            className={filterType === 'wands' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterType('wands')}
          >
            权杖
          </button>
          <button 
            className={filterType === 'cups' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterType('cups')}
          >
            圣杯
          </button>
          <button 
            className={filterType === 'swords' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterType('swords')}
          >
            宝剑
          </button>
          <button 
            className={filterType === 'pentacles' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterType('pentacles')}
          >
            星币
          </button>
        </div>
      </div>

      <div className="browser-results">
        <p className="results-count">找到 {filteredCards.length} 张牌</p>
        <div className="browser-grid">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="browser-card"
            >
              <div 
                className="browser-card-content"
                onClick={() => {
                  onSelectCard(card)
                  setShowBrowser(false)
                }}
              >
                <div className="browser-card-icon">{getCardIcon(card)}</div>
                <div className="browser-card-name">{card.name}</div>
                <div className="browser-card-name-en">{card.nameEn}</div>
                <div className="browser-card-type">
                  {card.type === 'major' ? '大阿卡纳' : 
                   card.suit === 'wands' ? '权杖' : 
                   card.suit === 'cups' ? '圣杯' : 
                   card.suit === 'swords' ? '宝剑' : '星币'}
                  {card.suit && <span className="browser-card-suit">{getSuitIcon(card.suit)}</span>}
                </div>
              </div>
              <button
                className={`favorite-btn ${favorites.includes(card.id) ? 'favorited' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(card.id)
                  // favorites状态会在事件监听器中自动更新
                }}
                title={favorites.includes(card.id) ? '取消收藏' : '收藏'}
              >
                {favorites.includes(card.id) ? '⭐' : '☆'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardBrowser

