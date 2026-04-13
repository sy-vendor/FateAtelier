import { useState, useMemo, useEffect, useCallback } from 'react'
import { tarotCards, TarotCard } from '../data/tarotCards'
import type { ReadingRecord } from '../components/ReadingHistory'
import { generateThreeCardReading } from '../utils/readingInterpretation'
import { downloadReading } from '../utils/exportReading'
import { shareReading } from '../utils/shareReading'
import { DrawnCard } from '../types'
import { ReadingType } from '../types/reading'
import { toast } from '../utils/toast'
import { confirm } from '../utils/confirm'
import { getStorageItem, setStorageItem } from '../utils/storage'

export function useTarotGame() {
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null)
  const [threeCardReading, setThreeCardReading] = useState<DrawnCard[] | null>(null)
  const [viewingHistoryReading, setViewingHistoryReading] = useState<ReadingRecord | null>(null)
  const [drawingCard, setDrawingCard] = useState<{ card: TarotCard; isReversed: boolean } | null>(null)
  const [showDrawAnimation, setShowDrawAnimation] = useState(false)
  const [drawingThreeCards, setDrawingThreeCards] = useState<Array<{ card: TarotCard; isReversed: boolean }> | null>(null)
  const [showThreeCardAnimation, setShowThreeCardAnimation] = useState(false)
  const [showReadingTypeSelector, setShowReadingTypeSelector] = useState(false)
  const [selectedReadingType, setSelectedReadingType] = useState<ReadingType>('general')
  const [customQuestion, setCustomQuestion] = useState<string | undefined>(undefined)

  const [readingHistory, setReadingHistory] = useState<ReadingRecord[]>(() => {
    const result = getStorageItem<ReadingRecord[]>('tarot-reading-history', [])
    if (result.error) {
      requestAnimationFrame(() => {
        toast.error('加载历史记录失败')
      })
    }
    if (result.success && result.data !== undefined && Array.isArray(result.data)) {
      return result.data
    }
    return []
  })

  useEffect(() => {
    const result = setStorageItem('tarot-reading-history', readingHistory)
    if (!result.success && result.error) {
      toast.warning(result.error || '保存历史记录失败')
    }
  }, [readingHistory])

  const readingInterpretation = useMemo(() => {
    if (threeCardReading && threeCardReading.length === 3) {
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

    setDrawingCard({ card, isReversed: reversed })
    setShowDrawAnimation(true)
  }, [drawnCards])

  const handleDrawAnimationComplete = useCallback(() => {
    if (drawingCard) {
      const newDrawnCard: DrawnCard = { card: drawingCard.card, isReversed: drawingCard.isReversed }
      setDrawnCards((prev) => [...prev, newDrawnCard])
      setSelectedCard(newDrawnCard)
      setThreeCardReading(null)

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
    setShowReadingTypeSelector(true)
  }, [drawnCards])

  const handleReadingTypeSelected = useCallback((type: ReadingType, question?: string) => {
    setSelectedReadingType(type)
    setCustomQuestion(question)
    setShowReadingTypeSelector(false)

    const availableCards = tarotCards.filter(
      card => !drawnCards.some((drawn: DrawnCard) => drawn.card.id === card.id)
    )
    const threeDrawnCards: Array<{ card: TarotCard; isReversed: boolean }> = []

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length)
      const card = availableCards[randomIndex]
      threeDrawnCards.push({
        card,
        isReversed: Math.random() < 0.5
      })
      availableCards.splice(randomIndex, 1)
    }

    setDrawingThreeCards(threeDrawnCards)
    setShowThreeCardAnimation(true)
  }, [drawnCards])

  const handleThreeCardAnimationComplete = useCallback(() => {
    if (drawingThreeCards) {
      const threeDrawnCards: DrawnCard[] = drawingThreeCards.map(dc => ({
        card: dc.card,
        isReversed: dc.isReversed
      }))

      setDrawnCards((prev) => [...prev, ...threeDrawnCards])
      setThreeCardReading(threeDrawnCards)
      setSelectedCard(null)

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
      if (reading.readingType) {
        setSelectedReadingType(reading.readingType as ReadingType)
      }
      if (reading.customQuestion) {
        setCustomQuestion(reading.customQuestion)
      }
    }
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

  const cancelReadingTypeSelector = useCallback(() => {
    setShowReadingTypeSelector(false)
  }, [])

  return useMemo(
    () => ({
      drawnCards,
      selectedCard,
      threeCardReading,
      readingHistory,
      viewingHistoryReading,
      drawingCard,
      showDrawAnimation,
      drawingThreeCards,
      showThreeCardAnimation,
      showReadingTypeSelector,
      readingInterpretation,
      drawCard,
      handleDrawAnimationComplete,
      drawThreeCards,
      handleReadingTypeSelected,
      handleThreeCardAnimationComplete,
      reset,
      selectCard,
      updateCardReversed,
      handleSelectCardFromBrowser,
      handleViewHistoryReading,
      handleDeleteHistoryReading,
      handleExportReading,
      handleShareReading,
      cancelReadingTypeSelector,
    }),
    [
      drawnCards,
      selectedCard,
      threeCardReading,
      readingHistory,
      viewingHistoryReading,
      drawingCard,
      showDrawAnimation,
      drawingThreeCards,
      showThreeCardAnimation,
      showReadingTypeSelector,
      readingInterpretation,
      drawCard,
      handleDrawAnimationComplete,
      drawThreeCards,
      handleReadingTypeSelected,
      handleThreeCardAnimationComplete,
      reset,
      selectCard,
      updateCardReversed,
      handleSelectCardFromBrowser,
      handleViewHistoryReading,
      handleDeleteHistoryReading,
      handleExportReading,
      handleShareReading,
      cancelReadingTypeSelector,
    ]
  )
}
