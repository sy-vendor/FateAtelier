import { useState, useMemo, useEffect, useCallback, Suspense, lazy } from 'react'
import { Analytics } from '@vercel/analytics/react'
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
import ToastContainer from './components/ToastContainer'
import ConfirmDialogContainer from './components/ConfirmDialogContainer'
// import WeatherEffect, { WeatherType } from './components/WeatherEffect'
// 动态导入大型功能组件
const NameGenerator = lazy(() => import('./components/NameGenerator'))
const Horoscope = lazy(() => import('./components/Horoscope'))
const Almanac = lazy(() => import('./components/Almanac'))
const CyberMerit = lazy(() => import('./components/CyberMerit'))
const BaziFortune = lazy(() => import('./components/BaziFortune'))
const DivinationDraw = lazy(() => import('./components/DivinationDraw'))
const DreamInterpretation = lazy(() => import('./components/DreamInterpretation'))
const FengshuiCompass = lazy(() => import('./components/FengshuiCompass'))
const AuspiciousDate = lazy(() => import('./components/AuspiciousDate'))
const NumberEnergy = lazy(() => import('./components/NumberEnergy'))
const LuckyColor = lazy(() => import('./components/LuckyColor'))
const QimenDunjia = lazy(() => import('./components/QimenDunjia'))
const NameTest = lazy(() => import('./components/NameTest'))
const ZiweiDoushu = lazy(() => import('./components/ZiweiDoushu'))
const ShengxiaoPairing = lazy(() => import('./components/ShengxiaoPairing'))
import { getCardIcon, getSuitIcon } from './utils/cardIcons'
import { isFavorite, toggleFavorite } from './utils/favorites'
import { generateThreeCardReading } from './utils/readingInterpretation'
import { downloadReading } from './utils/exportReading'
import { shareReading } from './utils/shareReading'
import { downloadAllData } from './utils/exportData'
import { DrawnCard } from './types'
import { ReadingType } from './types/reading'
import { toast } from './utils/toast'
import { confirm } from './utils/confirm'
import { getStorageItem, setStorageItem } from './utils/storage'
import './App.css'

// const CAROUSEL_EFFECTS = ['mystic', 'sparkle', 'glow', 'fade', 'swirl', 'zoom', 'flip', 'warp'] as const

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
  const [currentPage, setCurrentPage] = useState<'tarot' | 'name' | 'horoscope' | 'almanac' | 'cybermerit' | 'bazi' | 'divination' | 'dream' | 'fengshui' | 'auspicious' | 'numberenergy' | 'luckycolor' | 'qimen' | 'nametest' | 'ziwei' | 'shengxiao'>('tarot')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselRotation, setCarouselRotation] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [, setFavoritesVersion] = useState(0)
  // const [transitionEffect, setTransitionEffect] = useState<string>('')
  // const [weatherType, setWeatherType] = useState<WeatherType>(() => {
  //   // 根据月份自动选择天气（11月-2月：雪花，3-5月：小雨，6-8月：太阳，9-10月：多云）
  //   const month = new Date().getMonth() + 1
  //   if (month === 11 || month === 12 || month === 1 || month === 2) return 'snow'
  //   if (month >= 3 && month <= 5) return 'rain'
  //   if (month >= 6 && month <= 8) return 'sun'
  //   return 'cloudy'
  // })

  // 阻止手机端页面左右滑动
  useEffect(() => {
    const preventHorizontalScroll = (e: TouchEvent) => {
      // 如果触摸点在轮播容器内，不阻止（让轮播正常工作）
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
          return // 在轮播容器内，不阻止
        }
      }
      
      // 检查是否是水平滑动
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        const startX = touch.clientX
        const startY = touch.clientY
        
        const handleMove = (moveEvent: TouchEvent) => {
          if (moveEvent.touches.length === 1) {
            const moveTouch = moveEvent.touches[0]
            const deltaX = Math.abs(moveTouch.clientX - startX)
            const deltaY = Math.abs(moveTouch.clientY - startY)
            
            // 如果水平移动距离大于垂直移动距离，阻止默认行为
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

  // 收藏变化时重新渲染，使单张牌展示的收藏按钮状态更新
  useEffect(() => {
    const handleFavoritesChange = () => setFavoritesVersion(v => v + 1)
    window.addEventListener('favorites-changed', handleFavoritesChange)
    return () => window.removeEventListener('favorites-changed', handleFavoritesChange)
  }, [])

  // 从localStorage加载历史记录
  useEffect(() => {
    const result = getStorageItem<ReadingRecord[]>('tarot-reading-history', [])
    if (result.success && result.data) {
      setReadingHistory(result.data)
    } else if (result.error) {
      toast.error('加载历史记录失败')
    }
  }, [])

  // 保存历史记录到localStorage
  useEffect(() => {
    // 始终保存，包括空数组（用于删除所有记录的情况）
    const result = setStorageItem('tarot-reading-history', readingHistory)
    if (!result.success && result.error) {
      toast.warning(result.error || '保存历史记录失败')
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

  const drawCard = useCallback(() => {
    if (drawnCards.length >= 78) {
      toast.info('所有牌都已抽取完毕！')
      return
    }

    const availableCards = tarotCards.filter(
      card => !drawnCards.some((drawn: DrawnCard) => drawn.card.id === card.id)
    )
    
    if (availableCards.length === 0) {
      toast.info('没有可用的牌了！')
      return
    }
    
    const randomIndex = Math.floor(Math.random() * availableCards.length)
    const card = availableCards[randomIndex]
    const reversed = Math.random() < 0.5

    // 显示抽牌动画
    setDrawingCard({ card, isReversed: reversed })
    setShowDrawAnimation(true)
  }, [drawnCards])

  const handleDrawAnimationComplete = useCallback(() => {
    if (drawingCard) {
      const newDrawnCard: DrawnCard = { card: drawingCard.card, isReversed: drawingCard.isReversed }
      setDrawnCards((prev) => [...prev, newDrawnCard])
      setSelectedCard(newDrawnCard)
      setThreeCardReading(null) // 清除三牌占卜显示

      // 保存到历史记录
      const historyRecord: ReadingRecord = {
        id: Date.now().toString(),
        type: 'single',
        cards: [newDrawnCard],
        timestamp: Date.now()
      }
      setReadingHistory((prev) => [historyRecord, ...prev])
      
      setDrawingCard(null)
      setShowDrawAnimation(false)
    }
  }, [drawingCard])

  const drawThreeCards = useCallback(() => {
    if (drawnCards.length + 3 > 78) {
      toast.warning('剩余的牌不足以抽取三张！')
      return
    }
    // 先显示占卜类型选择器
    setShowReadingTypeSelector(true)
  }, [drawnCards])

  const handleReadingTypeSelected = useCallback((type: ReadingType, question?: string) => {
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
  }, [drawnCards, selectedReadingType, customQuestion])

  const handleThreeCardAnimationComplete = useCallback(() => {
    if (drawingThreeCards) {
      const threeDrawnCards: DrawnCard[] = drawingThreeCards.map(dc => ({
        card: dc.card,
        isReversed: dc.isReversed
      }))

      setDrawnCards((prev) => [...prev, ...threeDrawnCards])
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
      setReadingHistory((prev) => [historyRecord, ...prev])
      
      setDrawingThreeCards(null)
      setShowThreeCardAnimation(false)
    }
  }, [drawingThreeCards, selectedReadingType, customQuestion])

  const reset = useCallback(() => {
    setDrawnCards([])
    setSelectedCard(null)
    setThreeCardReading(null)
    setViewingHistoryReading(null)
    setShowReadingTypeSelector(false)
    setSelectedReadingType('general')
    setCustomQuestion(undefined)
  }, [])

  const selectCard = useCallback((drawnCard: DrawnCard) => {
    setSelectedCard(drawnCard)
  }, [])

  const updateCardReversed = useCallback((cardId: number, isReversed: boolean) => {
    setDrawnCards((prev) => prev.map((dc: DrawnCard) => 
      dc.card.id === cardId ? { ...dc, isReversed } : dc
    ))
    setSelectedCard((prev) => {
      if (prev && prev.card.id === cardId) {
        return { ...prev, isReversed }
      }
      return prev
    })
    setThreeCardReading((prev) => {
      if (prev) {
        return prev.map((dc: DrawnCard) =>
          dc.card.id === cardId ? { ...dc, isReversed } : dc
        )
      }
      return prev
    })
  }, [])

  const handleSelectCardFromBrowser = useCallback((card: TarotCard) => {
    const drawnCard: DrawnCard = { card, isReversed: false }
    setSelectedCard(drawnCard)
    setThreeCardReading(null)
    setViewingHistoryReading(null)
  }, [])

  const handleViewHistoryReading = useCallback((reading: ReadingRecord) => {
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
  }, [])

  const handleDeleteHistoryReading = useCallback(async (id: string) => {
    const confirmed = await confirm({
      title: '删除占卜记录',
      message: '确定要删除这条占卜记录吗？',
      confirmText: '删除',
      cancelText: '取消',
      type: 'danger'
    })
    if (confirmed) {
      setReadingHistory(prev => prev.filter(r => r.id !== id))
    }
  }, [])

  const handleExportReading = useCallback((reading: ReadingRecord) => {
    downloadReading(reading)
  }, [])

  const handleShareReading = useCallback(async (reading: ReadingRecord) => {
    await shareReading(reading)
  }, [])

  // 统一的返回函数，避免重复创建
  const handleBackToTarot = useCallback(() => {
    setCurrentPage('tarot')
  }, [])

  // 获取所有功能列表 - 使用 useMemo 缓存，避免每次渲染都重新创建
  const features = useMemo(() => {
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
      { page: 'auspicious' as const, icon: '⏰', name: '择日吉时' },
      { page: 'numberenergy' as const, icon: '🔢', name: '数字能量' },
      { page: 'luckycolor' as const, icon: '🎨', name: '每日幸运色' },
      { page: 'qimen' as const, icon: '⚡', name: '奇门遁甲' },
      { page: 'nametest' as const, icon: '📝', name: '姓名测试' },
      { page: 'ziwei' as const, icon: '⭐', name: '紫微斗数' },
      { page: 'shengxiao' as const, icon: '🐲', name: '生肖配对' },
    ]
  }, [])

  // 当页面改变时，更新轮播索引和旋转角度
  useEffect(() => {
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
  }, [currentPage, features, carouselRotation])

  // 切换天气类型
  // const cycleWeather = () => {
  //   const weathers: WeatherType[] = ['none', 'snow', 'rain', 'sun', 'cloudy']
  //   const currentIndex = weathers.indexOf(weatherType)
  //   const nextIndex = (currentIndex + 1) % weathers.length
  //   setWeatherType(weathers[nextIndex])
  // }

  // 使用 useMemo 缓存天气图标和标题，避免每次渲染都重新计算
  // const weatherIcon = useMemo(() => {
  //   switch (weatherType) {
  //     case 'snow':
  //       return '❄️'
  //     case 'rain':
  //       return '🌧️'
  //     case 'sun':
  //       return '☀️'
  //     case 'cloudy':
  //       return '☁️'
  //     default:
  //       return '🌨️'
  //   }
  // }, [weatherType])

  // const weatherTitle = useMemo(() => {
  //   switch (weatherType) {
  //     case 'snow':
  //       return '关闭雪花'
  //     case 'rain':
  //       return '关闭小雨'
  //     case 'sun':
  //       return '关闭阳光'
  //     case 'cloudy':
  //       return '关闭多云'
  //     default:
  //       return '切换天气'
  //   }
  // }, [weatherType])

  return (
    <div className="app">
      {/* 天气效果 */}
      {/* <WeatherEffect weatherType={weatherType} intensity="medium" /> */}
      
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
           currentPage === 'fengshui' ? '风水罗盘 · 方位吉凶' :
           currentPage === 'auspicious' ? '择日吉时 · 良辰吉日' :
           currentPage === 'numberenergy' ? '数字能量 · 数字命理' :
           currentPage === 'luckycolor' ? '每日幸运色 · 色彩能量' :
           currentPage === 'qimen' ? '奇门遁甲 · 传统预测术' :
           currentPage === 'nametest' ? '姓名测试 · 五格数理' :
           currentPage === 'ziwei' ? '紫微斗数 · 传统命理学' :
           currentPage === 'shengxiao' ? '生肖配对 · 相合相冲' :
           '探索塔罗牌的奥秘'}
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
            const totalFeatures = features.length
            const anglePerItem = 360 / totalFeatures

            if (Math.abs(distance) > minSwipeDistance) {
              // 随机选择一个切换效果
              // const randomEffect = CAROUSEL_EFFECTS[Math.floor(Math.random() * CAROUSEL_EFFECTS.length)]
              // setTransitionEffect(randomEffect)
              
              // 0.6秒后清除效果（与transition时间一致）
              // setTimeout(() => setTransitionEffect(''), 600)
              
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
            const startX = e.clientX
            const startRotation = carouselRotation
            const currentIndex = carouselIndex
            let isDraggingActive = true
            let lastX = startX
            
            setTouchStart(startX)
            
            // 禁用过渡效果，让拖拽更流畅
            const carouselTrack = document.querySelector('.carousel-track')
            if (carouselTrack) {
              carouselTrack.classList.add('no-transition')
            }
            
            // 添加全局事件监听器，确保即使鼠标移出元素也能继续跟踪
            const handleMouseMove = (moveEvent: MouseEvent) => {
              if (!isDraggingActive) return
              const currentX = moveEvent.clientX
              const deltaX = currentX - startX
              lastX = currentX
              
              setTouchEnd(currentX)
              
              // 实时更新旋转角度（跟随鼠标）
              const totalFeatures = features.length
              const anglePerItem = 360 / totalFeatures
              const sensitivity = 0.4 // 降低灵敏度，让拖拽更平滑
              const rotationDelta = (deltaX / 100) * anglePerItem * sensitivity
              let newRotation = startRotation - rotationDelta
              
              // 归一化角度
              while (newRotation < -180) newRotation += 360
              while (newRotation > 180) newRotation -= 360
              
              setCarouselRotation(newRotation)
            }
            
            const handleMouseUp = () => {
              isDraggingActive = false
              
              // 恢复过渡效果
              const carouselTrack = document.querySelector('.carousel-track')
              if (carouselTrack) {
                // 使用 setTimeout 确保在下一帧移除类，让过渡效果生效
                setTimeout(() => {
                  carouselTrack.classList.remove('no-transition')
                }, 0)
              }
              
              const finalDistance = startX - lastX
              const minSwipeDistance = 30 // 降低阈值，让体验更流畅
              const totalFeatures = features.length
              const anglePerItem = 360 / totalFeatures

              if (Math.abs(finalDistance) > minSwipeDistance) {
                // 随机选择一个切换效果
                // const randomEffect = CAROUSEL_EFFECTS[Math.floor(Math.random() * CAROUSEL_EFFECTS.length)]
                // setTransitionEffect(randomEffect)
                
                // 0.6秒后清除效果（与transition时间一致）
                // setTimeout(() => setTransitionEffect(''), 600)
                
                if (finalDistance > 0) {
                  // 向左滑动，显示下一个（循环）
                  const newIndex = (currentIndex + 1) % totalFeatures
                  let targetRotation = startRotation - anglePerItem
                  
                  // 归一化角度到 -180 到 180 度之间，让CSS走最短路径
                  while (targetRotation < -180) targetRotation += 360
                  while (targetRotation > 180) targetRotation -= 360
                  
                  setCarouselRotation(targetRotation)
                  setCarouselIndex(newIndex)
                  setCurrentPage(features[newIndex].page)
                } else if (finalDistance < 0) {
                  // 向右滑动，显示上一个（循环）
                  const newIndex = (currentIndex - 1 + totalFeatures) % totalFeatures
                  let targetRotation = startRotation + anglePerItem
                  
                  // 归一化角度到 -180 到 180 度之间，让CSS走最短路径
                  while (targetRotation < -180) targetRotation += 360
                  while (targetRotation > 180) targetRotation -= 360
                  
                  setCarouselRotation(targetRotation)
                  setCarouselIndex(newIndex)
                  setCurrentPage(features[newIndex].page)
                }
              } else {
                // 如果拖拽距离不够，回弹到原始位置
                setCarouselRotation(startRotation)
              }
              
              setTouchStart(0)
              setTouchEnd(0)
              
              // 移除全局事件监听器
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            
            // 添加全局事件监听器
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        >
          <div className="carousel-wrapper">
            {/* 切换特效层 */}
            {/* {transitionEffect && (
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
            )} */}
            <div 
              className="carousel-track"
              style={{
                transform: `translateZ(-400px) rotateY(${carouselRotation}deg)`,
                '--carousel-rotation': `${carouselRotation}deg`,
              } as React.CSSProperties}
            >
              {features.map((feature, index) => {
                const isCenter = index === carouselIndex
                const angle = (360 / Math.max(1, features.length)) * index
                // 中间卡片更靠前，避免穿透
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
                      
                      // 如果点击的不是当前项，触发切换效果
                      // if (index !== carouselIndex) {
                      //   const randomEffect = CAROUSEL_EFFECTS[Math.floor(Math.random() * CAROUSEL_EFFECTS.length)]
                      //   setTransitionEffect(randomEffect)
                      //   setTimeout(() => setTransitionEffect(''), 600)
                      // }
                      
                      setCarouselRotation(-index * anglePerItem)
                      setCarouselIndex(index)
                      setCurrentPage(feature.page)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
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
        {currentPage === 'tarot' && (
          <div className="header-actions">
            <CardBrowser onSelectCard={handleSelectCardFromBrowser} />
            <Favorites onSelectCard={handleSelectCardFromBrowser} />
            <HelpGuide />
            {/* <button
              className="weather-toggle-btn"
              onClick={cycleWeather}
              title={weatherTitle}
            >
              {weatherIcon}
            </button> */}
          </div>
        )}
      </header>

      <main className="app-main">
        <Suspense fallback={<div className="loading-fallback">加载中...</div>}>
          {currentPage === 'name' ? (
            <NameGenerator onBack={handleBackToTarot} />
          ) : currentPage === 'horoscope' ? (
            <Horoscope onBack={handleBackToTarot} />
          ) : currentPage === 'almanac' ? (
            <Almanac onBack={handleBackToTarot} />
          ) : currentPage === 'cybermerit' ? (
            <CyberMerit onBack={handleBackToTarot} />
          ) : currentPage === 'bazi' ? (
            <BaziFortune onBack={handleBackToTarot} />
          ) : currentPage === 'divination' ? (
            <DivinationDraw onBack={handleBackToTarot} />
          ) : currentPage === 'dream' ? (
            <DreamInterpretation onBack={handleBackToTarot} />
          ) : currentPage === 'fengshui' ? (
            <FengshuiCompass onBack={handleBackToTarot} />
          ) : currentPage === 'auspicious' ? (
            <AuspiciousDate onBack={handleBackToTarot} />
          ) : currentPage === 'numberenergy' ? (
            <NumberEnergy onBack={handleBackToTarot} />
          ) : currentPage === 'luckycolor' ? (
            <LuckyColor onBack={handleBackToTarot} />
          ) : currentPage === 'qimen' ? (
            <QimenDunjia onBack={handleBackToTarot} />
          ) : currentPage === 'nametest' ? (
            <NameTest onBack={handleBackToTarot} />
          ) : currentPage === 'ziwei' ? (
            <ZiweiDoushu onBack={handleBackToTarot} />
          ) : currentPage === 'shengxiao' ? (
            <ShengxiaoPairing onBack={handleBackToTarot} />
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
              isFavorite={isFavorite(selectedCard.card.id)}
              onToggleFavorite={(card) => toggleFavorite(card.id)}
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
        </Suspense>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-copyright">© 2025 命运工坊 - 仅供娱乐参考</p>
          <div className="footer-team">
            <p className="team-label">Made with ❤️ by</p>
            <p className="team-name">默默团队</p>
          </div>
          <div className="footer-contact">
            <a 
              href="https://github.com/sy-vendor/FateAtelier" 
              className="contact-email"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="命运工坊 GitHub 仓库"
            >
              GitHub - FateAtelier
            </a>
          </div>
        </div>
      </footer>
      <ToastContainer />
      <ConfirmDialogContainer />
      <Analytics />
    </div>
  )
}

export default App

