import { useState, useMemo, useEffect } from 'react'
import { tarotCards, TarotCard } from './data/tarotCards'
import CardDisplay from './components/CardDisplay'
import CardDrawer from './components/CardDrawer'
import CardBrowser from './components/CardBrowser'
import ReadingHistory, { ReadingRecord } from './components/ReadingHistory'
import HelpGuide from './components/HelpGuide'
import DailyCard from './components/DailyCard'
import Statistics from './components/Statistics'
import Favorites from './components/Favorites'
import CardDrawAnimation from './components/CardDrawAnimation'
import ThreeCardDrawAnimation from './components/ThreeCardDrawAnimation'
import ReadingTypeSelector from './components/ReadingTypeSelector'
import NameGenerator from './components/NameGenerator'
import Horoscope from './components/Horoscope'
import Almanac from './components/Almanac'
import CyberMerit from './components/CyberMerit'
import BaziFortune from './components/BaziFortune'
import DivinationDraw from './components/DivinationDraw'
import DreamInterpretation from './components/DreamInterpretation'
import FengshuiCompass from './components/FengshuiCompass'
import { getCardIcon, getSuitIcon } from './utils/cardIcons'
import { generateThreeCardReading } from './utils/readingInterpretation'
import { downloadReading } from './utils/exportReading'
import { shareReading } from './utils/shareReading'
import { downloadAllData } from './utils/exportData'
import { DrawnCard } from './types'
import { ReadingType } from './types/reading'
import './App.css'

function App() {
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null)
  const [threeCardReading, setThreeCardReading] = useState<DrawnCard[] | null>(null)
  const [readingHistory, setReadingHistory] = useState<ReadingRecord[]>([])
  const [viewingHistoryReading, setViewingHistoryReading] = useState<ReadingRecord | null>(null)
  const [drawingCard, setDrawingCard] = useState<{ card: TarotCard, isReversed: boolean } | null>(null)
  const [showDrawAnimation, setShowDrawAnimation] = useState(false)
  const [drawingThreeCards, setDrawingThreeCards] = useState<Array<{ card: TarotCard, isReversed: boolean }> | null>(null)
  const [showThreeCardAnimation, setShowThreeCardAnimation] = useState(false)
  const [showReadingTypeSelector, setShowReadingTypeSelector] = useState(false)
  const [selectedReadingType, setSelectedReadingType] = useState<ReadingType>('general')
  const [customQuestion, setCustomQuestion] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<'tarot' | 'name' | 'horoscope' | 'almanac' | 'cybermerit' | 'bazi' | 'divination' | 'dream' | 'fengshui'>('tarot')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselRotation, setCarouselRotation] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [transitionEffect, setTransitionEffect] = useState<string>('')

  // 从localStorage加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('tarot-reading-history')
    if (saved) {
      try {
        setReadingHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load reading history', e)
      }
    }
  }, [])

  // 保存历史记录到localStorage
  useEffect(() => {
    if (readingHistory.length > 0) {
      localStorage.setItem('tarot-reading-history', JSON.stringify(readingHistory))
    }
  }, [readingHistory])

  // 生成三牌占卜的综合解读
  const readingInterpretation = useMemo(() => {
    if (threeCardReading && threeCardReading.length === 3) {
      // 从当前查看的历史记录或状态中获取占卜类型
      const readingType = (viewingHistoryReading?.readingType as ReadingType) || selectedReadingType
      const question = viewingHistoryReading?.customQuestion || customQuestion
      return generateThreeCardReading(threeCardReading, readingType, question)
    }
    return null
  }, [threeCardReading, selectedReadingType, customQuestion, viewingHistoryReading])

  const drawCard = () => {
    if (drawnCards.length >= 78) {
      alert('所有牌都已抽取完毕！')
      return
    }

    const availableCards = tarotCards.filter(
      card => !drawnCards.some((drawn: DrawnCard) => drawn.card.id === card.id)
    )
    
    if (availableCards.length === 0) {
      alert('没有可用的牌了！')
      return
    }
    
    const randomIndex = Math.floor(Math.random() * availableCards.length)
    const card = availableCards[randomIndex]
    const reversed = Math.random() < 0.5

    // 显示抽牌动画
    setDrawingCard({ card, isReversed: reversed })
    setShowDrawAnimation(true)
  }

  const handleDrawAnimationComplete = () => {
    if (drawingCard) {
      const newDrawnCard: DrawnCard = { card: drawingCard.card, isReversed: drawingCard.isReversed }
      const updatedDrawnCards = [...drawnCards, newDrawnCard]
      setDrawnCards(updatedDrawnCards)
      setSelectedCard(newDrawnCard)
      setThreeCardReading(null) // 清除三牌占卜显示

      // 保存到历史记录
      const historyRecord: ReadingRecord = {
        id: Date.now().toString(),
        type: 'single',
        cards: [newDrawnCard],
        timestamp: Date.now()
      }
      setReadingHistory([historyRecord, ...readingHistory])
      
      setDrawingCard(null)
      setShowDrawAnimation(false)
    }
  }

  const drawThreeCards = () => {
    if (drawnCards.length + 3 > 78) {
      alert('剩余的牌不足以抽取三张！')
      return
    }
    // 先显示占卜类型选择器
    setShowReadingTypeSelector(true)
  }

  const handleReadingTypeSelected = (type: ReadingType, question?: string) => {
    setSelectedReadingType(type)
    setCustomQuestion(question)
    setShowReadingTypeSelector(false)

    // 开始抽牌
    const availableCards = tarotCards.filter(
      card => !drawnCards.some((drawn: DrawnCard) => drawn.card.id === card.id)
    )
    const threeDrawnCards: Array<{ card: TarotCard, isReversed: boolean }> = []

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length)
      const card = availableCards[randomIndex]
      threeDrawnCards.push({
        card,
        isReversed: Math.random() < 0.5
      })
      availableCards.splice(randomIndex, 1)
    }

    // 显示三张牌抽牌动画
    setDrawingThreeCards(threeDrawnCards)
    setShowThreeCardAnimation(true)
  }

  const handleThreeCardAnimationComplete = () => {
    if (drawingThreeCards) {
      const threeDrawnCards: DrawnCard[] = drawingThreeCards.map(dc => ({
        card: dc.card,
        isReversed: dc.isReversed
      }))

      setDrawnCards([...drawnCards, ...threeDrawnCards])
      setThreeCardReading(threeDrawnCards) // 设置三牌占卜显示
      setSelectedCard(null) // 清除单张牌显示

      // 生成解读并保存到历史记录
      const interpretation = generateThreeCardReading(threeDrawnCards, selectedReadingType, customQuestion)
      const historyRecord: ReadingRecord = {
        id: Date.now().toString(),
        type: 'three',
        cards: threeDrawnCards,
        timestamp: Date.now(),
        interpretation,
        readingType: selectedReadingType,
        customQuestion: customQuestion
      }
      setReadingHistory([historyRecord, ...readingHistory])
      
      setDrawingThreeCards(null)
      setShowThreeCardAnimation(false)
    }
  }

  const reset = () => {
    setDrawnCards([])
    setSelectedCard(null)
    setThreeCardReading(null)
    setViewingHistoryReading(null)
    setShowReadingTypeSelector(false)
    setSelectedReadingType('general')
    setCustomQuestion(undefined)
  }

  const selectCard = (drawnCard: DrawnCard) => {
    setSelectedCard(drawnCard)
  }

  const updateCardReversed = (cardId: number, isReversed: boolean) => {
    setDrawnCards(drawnCards.map((dc: DrawnCard) => 
      dc.card.id === cardId ? { ...dc, isReversed } : dc
    ))
    if (selectedCard && selectedCard.card.id === cardId) {
      setSelectedCard({ ...selectedCard, isReversed })
    }
    if (threeCardReading) {
      setThreeCardReading(threeCardReading.map((dc: DrawnCard) =>
        dc.card.id === cardId ? { ...dc, isReversed } : dc
      ))
    }
  }

  const handleSelectCardFromBrowser = (card: TarotCard) => {
    const drawnCard: DrawnCard = { card, isReversed: false }
    setSelectedCard(drawnCard)
    setThreeCardReading(null)
    setViewingHistoryReading(null)
  }

  const handleViewHistoryReading = (reading: ReadingRecord) => {
    setViewingHistoryReading(reading)
    if (reading.type === 'single') {
      setSelectedCard(reading.cards[0])
      setThreeCardReading(null)
    } else {
      setThreeCardReading(reading.cards)
      setSelectedCard(null)
      // 恢复占卜类型
      if (reading.readingType) {
        setSelectedReadingType(reading.readingType as ReadingType)
      }
      if (reading.customQuestion) {
        setCustomQuestion(reading.customQuestion)
      }
    }
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteHistoryReading = (id: string) => {
    if (confirm('确定要删除这条占卜记录吗？')) {
      setReadingHistory(readingHistory.filter(r => r.id !== id))
    }
  }

  const handleExportReading = (reading: ReadingRecord) => {
    downloadReading(reading)
  }

  const handleShareReading = async (reading: ReadingRecord) => {
    await shareReading(reading)
  }

  // 获取所有功能列表
  const getFilteredFeatures = () => {
    return [
      { page: 'tarot' as const, icon: '🔮', name: '塔罗占卜' },
      { page: 'name' as const, icon: '✨', name: '智能取名' },
      { page: 'horoscope' as const, icon: '♈', name: '星座运势' },
      { page: 'almanac' as const, icon: '📅', name: '今日黄历' },
      { page: 'cybermerit' as const, icon: '🙏', name: '赛博积德' },
      { page: 'bazi' as const, icon: '☯', name: '八字算命' },
      { page: 'divination' as const, icon: '🎋', name: '抽签求签' },
      { page: 'dream' as const, icon: '💭', name: '梦境解析' },
      { page: 'fengshui' as const, icon: '🧭', name: '风水罗盘' },
    ]
  }

  // 当页面改变时，更新轮播索引和旋转角度
  useEffect(() => {
    const features = getFilteredFeatures()
    const currentIndex = features.findIndex(f => f.page === currentPage)
    if (currentIndex >= 0) {
      const anglePerItem = 360 / features.length
      const targetRotation = -currentIndex * anglePerItem
      
      // 计算最短路径，避免转一圈
      let normalizedRotation = targetRotation
      const currentNormalized = ((carouselRotation % 360) + 360) % 360
      const targetNormalized = ((targetRotation % 360) + 360) % 360
      
      // 如果角度差大于180度，选择另一个方向
      let diff = targetNormalized - currentNormalized
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      
      normalizedRotation = carouselRotation + diff
      
      setCarouselIndex(currentIndex)
      setCarouselRotation(normalizedRotation)
    }
  }, [currentPage])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔮 命运工坊</h1>
        <p className="subtitle">
          {currentPage === 'tarot' ? '探索塔罗牌的奥秘' : 
           currentPage === 'name' ? '智能取名服务' : 
           currentPage === 'horoscope' ? '星座运势 · 娱乐参考' :
           currentPage === 'almanac' ? '今日黄历 · 传统历法' :
           currentPage === 'cybermerit' ? '赛博积德 · 功德无量' :
           currentPage === 'bazi' ? '八字算命 · 传统命理' :
           currentPage === 'divination' ? '抽签求签 · 心诚则灵' :
           currentPage === 'dream' ? '梦境解析 · 探索潜意识' :
           '风水罗盘 · 方位吉凶'}
        </p>
        {/* 3D旋转选择器 */}
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
            const features = getFilteredFeatures()
            const totalFeatures = features.length
            const anglePerItem = 360 / totalFeatures

            if (Math.abs(distance) > minSwipeDistance) {
              // 随机选择一个切换效果
              const effects = ['mystic', 'sparkle', 'glow', 'fade', 'swirl']
              const randomEffect = effects[Math.floor(Math.random() * effects.length)]
              setTransitionEffect(randomEffect)
              
              // 0.6秒后清除效果（与transition时间一致）
              setTimeout(() => setTransitionEffect(''), 600)
              
              if (distance > 0) {
                // 向左滑动，显示下一个（循环）
                const newIndex = (carouselIndex + 1) % totalFeatures
                let targetRotation = carouselRotation - anglePerItem
                
                // 归一化角度到 -180 到 180 度之间，让CSS走最短路径
                while (targetRotation < -180) targetRotation += 360
                while (targetRotation > 180) targetRotation -= 360
                
                setCarouselRotation(targetRotation)
                setCarouselIndex(newIndex)
                setCurrentPage(features[newIndex].page)
              } else if (distance < 0) {
                // 向右滑动，显示上一个（循环）
                const newIndex = (carouselIndex - 1 + totalFeatures) % totalFeatures
                let targetRotation = carouselRotation + anglePerItem
                
                // 归一化角度到 -180 到 180 度之间，让CSS走最短路径
                while (targetRotation < -180) targetRotation += 360
                while (targetRotation > 180) targetRotation -= 360
                
                setCarouselRotation(targetRotation)
                setCarouselIndex(newIndex)
                setCurrentPage(features[newIndex].page)
              }
            }
            setTouchStart(0)
            setTouchEnd(0)
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            setTouchStart(e.clientX)
          }}
          onMouseMove={(e) => {
            if (touchStart) {
              setTouchEnd(e.clientX)
            }
          }}
          onMouseUp={() => {
            if (!touchStart || !touchEnd) {
              setTouchStart(0)
              setTouchEnd(0)
              return
            }
            const distance = touchStart - touchEnd
            const minSwipeDistance = 50
            const features = getFilteredFeatures()
            const totalFeatures = features.length
            const anglePerItem = 360 / totalFeatures

            if (Math.abs(distance) > minSwipeDistance) {
              // 随机选择一个切换效果
              const effects = ['mystic', 'sparkle', 'glow', 'fade', 'swirl']
              const randomEffect = effects[Math.floor(Math.random() * effects.length)]
              setTransitionEffect(randomEffect)
              
              // 0.6秒后清除效果（与transition时间一致）
              setTimeout(() => setTransitionEffect(''), 600)
              
              if (distance > 0) {
                // 向左滑动，显示下一个（循环）
                const newIndex = (carouselIndex + 1) % totalFeatures
                let targetRotation = carouselRotation - anglePerItem
                
                // 归一化角度到 -180 到 180 度之间，让CSS走最短路径
                while (targetRotation < -180) targetRotation += 360
                while (targetRotation > 180) targetRotation -= 360
                
                setCarouselRotation(targetRotation)
                setCarouselIndex(newIndex)
                setCurrentPage(features[newIndex].page)
              } else if (distance < 0) {
                // 向右滑动，显示上一个（循环）
                const newIndex = (carouselIndex - 1 + totalFeatures) % totalFeatures
                let targetRotation = carouselRotation + anglePerItem
                
                // 归一化角度到 -180 到 180 度之间，让CSS走最短路径
                while (targetRotation < -180) targetRotation += 360
                while (targetRotation > 180) targetRotation -= 360
                
                setCarouselRotation(targetRotation)
                setCarouselIndex(newIndex)
                setCurrentPage(features[newIndex].page)
              }
            }
            setTouchStart(0)
            setTouchEnd(0)
          }}
          onMouseLeave={() => {
            setTouchStart(0)
            setTouchEnd(0)
          }}
        >
          <div className="carousel-wrapper">
            {/* 切换特效层 */}
            {transitionEffect && (
              <div className={`transition-effect ${transitionEffect}`}>
                <div className="effect-particles">
                  {[...Array(20)].map((_, i) => {
                    const randomX = Math.random()
                    const randomY = Math.random()
                    return (
                      <div 
                        key={i} 
                        className="particle" 
                        style={{
                          left: '50%',
                          top: '50%',
                          '--random-x': randomX,
                          '--random-y': randomY,
                          animationDelay: `${Math.random() * 0.3}s`,
                          animationDuration: `${0.6 + Math.random() * 0.4}s`
                        } as React.CSSProperties}
                      />
                    )
                  })}
                </div>
                <div className="effect-light" />
              </div>
            )}
            <div 
              className={`carousel-track ${transitionEffect ? `effect-${transitionEffect}` : ''}`}
              style={{ transform: `translateZ(-400px) rotateY(${carouselRotation}deg)` }}
            >
              {getFilteredFeatures().map((feature, index) => {
                const isCenter = index === carouselIndex
                const angle = (360 / Math.max(1, getFilteredFeatures().length)) * index
                return (
                  <div
                    key={feature.page}
                    className={`carousel-item ${isCenter ? 'center' : ''}`}
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(400px)`
                    }}
                    onClick={() => {
                      const features = getFilteredFeatures()
                      const anglePerItem = 360 / features.length
                      
                      // 如果点击的不是当前项，触发切换效果
                      if (index !== carouselIndex) {
                        const effects = ['mystic', 'sparkle', 'glow', 'fade', 'swirl']
                        const randomEffect = effects[Math.floor(Math.random() * effects.length)]
                        setTransitionEffect(randomEffect)
                        setTimeout(() => setTransitionEffect(''), 600)
                      }
                      
                      setCarouselRotation(-index * anglePerItem)
                      setCarouselIndex(index)
                      setCurrentPage(feature.page)
                    }}
                  >
                    <div className="feature-card">
                      <div className="feature-icon">{feature.icon}</div>
                      <div className="feature-name">{feature.name}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {currentPage === 'tarot' && (
          <div className="header-actions">
            <CardBrowser onSelectCard={handleSelectCardFromBrowser} />
            <Favorites onSelectCard={handleSelectCardFromBrowser} />
            <HelpGuide />
          </div>
        )}
      </header>

      <main className="app-main">
        {currentPage === 'name' ? (
          <NameGenerator onBack={() => setCurrentPage('tarot')} />
        ) : currentPage === 'horoscope' ? (
          <Horoscope onBack={() => setCurrentPage('tarot')} />
        ) : currentPage === 'almanac' ? (
          <Almanac onBack={() => setCurrentPage('tarot')} />
        ) : currentPage === 'cybermerit' ? (
          <CyberMerit onBack={() => setCurrentPage('tarot')} />
        ) : currentPage === 'bazi' ? (
          <BaziFortune onBack={() => setCurrentPage('tarot')} />
        ) : currentPage === 'divination' ? (
          <DivinationDraw onBack={() => setCurrentPage('tarot')} />
        ) : currentPage === 'dream' ? (
          <DreamInterpretation onBack={() => setCurrentPage('tarot')} />
        ) : currentPage === 'fengshui' ? (
          <FengshuiCompass onBack={() => setCurrentPage('tarot')} />
        ) : (
          <>
        {/* 单张牌抽牌动画 */}
        {showDrawAnimation && drawingCard && (
          <CardDrawAnimation
            card={drawingCard.card}
            isReversed={drawingCard.isReversed}
            onComplete={handleDrawAnimationComplete}
          />
        )}

        {/* 占卜类型选择器 */}
        {showReadingTypeSelector && (
          <ReadingTypeSelector
            onSelect={handleReadingTypeSelected}
            onCancel={() => setShowReadingTypeSelector(false)}
          />
        )}

        {/* 三张牌抽牌动画 */}
        {showThreeCardAnimation && drawingThreeCards && (
          <ThreeCardDrawAnimation
            cards={drawingThreeCards}
            onComplete={handleThreeCardAnimationComplete}
          />
        )}

        {/* 每日一牌 */}
        <DailyCard onSelectCard={handleSelectCardFromBrowser} />

        <div className="controls">
          <CardDrawer
            onDrawCard={drawCard}
            onDrawThree={drawThreeCards}
            onReset={reset}
            drawnCount={drawnCards.length}
          />
        </div>

        {/* 三牌占卜显示 */}
        {threeCardReading && (
          <div className="three-card-reading">
            <h2 className="reading-title">三牌占卜</h2>
            <div className="three-cards-container">
              {threeCardReading.map((drawnCard, index) => (
                <div key={drawnCard.card.id} className="three-card-item">
                  <div className="card-position-label">
                    {index === 0 ? '过去' : index === 1 ? '现在' : '未来'}
                  </div>
                  <CardDisplay
                    card={drawnCard.card}
                    isReversed={drawnCard.isReversed}
                    onFlip={() => updateCardReversed(drawnCard.card.id, !drawnCard.isReversed)}
                    compact={true}
                  />
                </div>
              ))}
            </div>

            {/* 综合解读 */}
            {readingInterpretation && (
              <div className="reading-interpretation">
                <div className="interpretation-header">
                  <h3 className="interpretation-title">🔮 综合解读</h3>
                  {viewingHistoryReading && (
                    <div className="action-buttons">
                      <button 
                        className="export-btn"
                        onClick={() => handleExportReading(viewingHistoryReading)}
                        title="导出占卜结果"
                      >
                        💾 导出
                      </button>
                      <button 
                        className="share-btn"
                        onClick={() => handleShareReading(viewingHistoryReading)}
                        title="分享占卜结果"
                      >
                        📤 分享
                      </button>
                    </div>
                  )}
                </div>
                <div className="interpretation-content">
                  <div className="interpretation-summary">
                    <h4>整体趋势</h4>
                    <p>{readingInterpretation.summary}</p>
                  </div>
                  
                  <div className="interpretation-stages">
                    <div className="stage-item">
                      <h4>📜 过去</h4>
                      <p>{readingInterpretation.past}</p>
                    </div>
                    <div className="stage-item">
                      <h4>⚡ 现在</h4>
                      <p>{readingInterpretation.present}</p>
                    </div>
                    <div className="stage-item">
                      <h4>🔮 未来</h4>
                      <p>{readingInterpretation.future}</p>
                    </div>
                  </div>

                  <div className="interpretation-advice">
                    <h4>💡 建议</h4>
                    <p>{readingInterpretation.advice}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 单张牌显示 */}
        {selectedCard && !threeCardReading && (
          <div>
            {viewingHistoryReading && viewingHistoryReading.type === 'single' && (
              <div className="export-section">
                <button 
                  className="export-btn"
                  onClick={() => handleExportReading(viewingHistoryReading)}
                >
                  💾 导出
                </button>
                <button 
                  className="share-btn"
                  onClick={() => handleShareReading(viewingHistoryReading)}
                >
                  📤 分享
                </button>
              </div>
            )}
            <CardDisplay
              card={selectedCard.card}
              isReversed={selectedCard.isReversed}
              onFlip={() => updateCardReversed(selectedCard.card.id, !selectedCard.isReversed)}
            />
          </div>
        )}

        {drawnCards.length > 1 && (
          <div className="drawn-cards">
            <h2>已抽取的牌 ({drawnCards.length})</h2>
            <div className="cards-grid">
              {drawnCards.map((drawnCard: DrawnCard) => (
                <div
                  key={drawnCard.card.id}
                  className={`card-thumbnail ${selectedCard?.card.id === drawnCard.card.id ? 'selected' : ''}`}
                  onClick={() => selectCard(drawnCard)}
                >
                  <div className="card-thumbnail-content">
                    <div className="card-thumbnail-icon">
                      {getCardIcon(drawnCard.card)}
                    </div>
                    <div className="card-thumbnail-name">
                      {drawnCard.card.name}
                      {drawnCard.isReversed && <span className="reversed-indicator">逆</span>}
                    </div>
                    <div className="card-thumbnail-type">
                      {drawnCard.card.type === 'major' ? '大阿卡纳' : 
                       drawnCard.card.suit === 'wands' ? '权杖' : 
                       drawnCard.card.suit === 'cups' ? '圣杯' : 
                       drawnCard.card.suit === 'swords' ? '宝剑' : '星币'}
                    </div>
                    {drawnCard.card.suit && (
                      <div className="card-thumbnail-suit">{getSuitIcon(drawnCard.card.suit)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 占卜历史 */}
        <ReadingHistory
          readings={readingHistory}
          onViewReading={handleViewHistoryReading}
          onDeleteReading={handleDeleteHistoryReading}
          onExportAll={() => downloadAllData(readingHistory)}
        />

        {/* 统计信息 */}
        <Statistics readings={readingHistory} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-copyright">© 2025 命运工坊 - 仅供娱乐参考</p>
          <div className="footer-team">
            <p className="team-label">Made with ❤️ by</p>
            <p className="team-name">默默团队</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

