import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { divinationSticks, type DivinationStick } from '../data/divinationSticks'
import { resolveCanonicalStick, rehydrateStickReading, type StickReading } from '../utils/divinationEngine'
import {
  createShakeListener,
  isMobileDevice,
  isShakeSupported,
  requestMotionPermission,
  type MotionPermissionState,
} from '../utils/deviceShake'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { toast } from '../utils/toast'
import { confirm } from '../utils/confirm'
import { txStatic } from '../i18n/locale'
import { useLocale } from '../i18n/LocaleContext'
import { DRAW_PHASE_STEP, type DrawPhase } from '../utils/divinationData'

export interface DrawHistory {
  id: string
  stick: DivinationStick
  timestamp: number
  category?: string
}

const STORAGE_DEBOUNCE_MS = 400

function pickStickForCategory(category: string): DivinationStick {
  const pool =
    category.length > 0
      ? divinationSticks.filter((s) => category in (s.categories ?? {}))
      : divinationSticks
  const source = pool.length > 0 ? pool : divinationSticks
  return source[Math.floor(Math.random() * source.length)]
}

function getLinkedStick(): DivinationStick | null {
  const match = window.location.pathname.match(/^\/divination\/stick\/(\d+)\/?$/)
  if (!match) return null
  return divinationSticks.find((stick) => stick.id === Number(match[1])) ?? null
}

export function useDivinationGame() {
  const { isEnglish } = useLocale()
  const linkedStick = useMemo(getLinkedStick, [])
  const [phase, setPhase] = useState<DrawPhase>(linkedStick ? 'done' : 'intent')
  const [isShaking, setIsShaking] = useState(false)
  const [drawnStick, setDrawnStick] = useState<DivinationStick | null>(linkedStick)
  const [showResult, setShowResult] = useState(Boolean(linkedStick))
  const [selectedCategory, setSelectedCategory] = useState('')
  const [drawHistory, setDrawHistory] = useState<DrawHistory[]>(() => {
    const historyResult = getStorageItem<DrawHistory[]>('divination-draw-history', [])
    if (historyResult.error) {
      requestAnimationFrame(() => toast.error(txStatic('加载历史记录失败', 'Failed to load history')))
    }
    if (historyResult.success && historyResult.data !== undefined && Array.isArray(historyResult.data)) {
      return historyResult.data
    }
    return []
  })
  const [showHistory, setShowHistory] = useState(false)
  const [showDetailed, setShowDetailed] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    const favoritesResult = getStorageItem<number[]>('divination-favorites', [])
    if (favoritesResult.error) {
      requestAnimationFrame(() => toast.error(txStatic('加载收藏失败', 'Failed to load favorites')))
    }
    if (favoritesResult.success && favoritesResult.data !== undefined && Array.isArray(favoritesResult.data)) {
      return new Set(favoritesResult.data)
    }
    return new Set()
  })
  const [copied, setCopied] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [motionPermission, setMotionPermission] = useState<MotionPermissionState>('unknown')
  const motionPermissionRef = useRef<MotionPermissionState>('unknown')

  const drawHistoryRef = useRef(drawHistory)
  drawHistoryRef.current = drawHistory
  const favoritesRef = useRef(favorites)
  favoritesRef.current = favorites

  useEffect(() => {
    const id = window.setTimeout(() => {
      const result = setStorageItem('divination-draw-history', drawHistoryRef.current)
      if (!result.success && result.error) {
        toast.warning(result.error || txStatic('保存历史记录失败', 'Failed to save history'))
      }
    }, STORAGE_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [drawHistory])

  useEffect(() => {
    return () => {
      void setStorageItem('divination-draw-history', drawHistoryRef.current)
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      const result = setStorageItem('divination-favorites', Array.from(favoritesRef.current))
      if (!result.success && result.error) {
        toast.warning(result.error || txStatic('保存收藏失败', 'Failed to save favorites'))
      }
    }, STORAGE_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [favorites])

  useEffect(() => {
    return () => {
      void setStorageItem('divination-favorites', Array.from(favoritesRef.current))
    }
  }, [])

  const ensureMotionPermission = useCallback(async () => {
    if (!isShakeSupported() || !isMobileDevice()) return
    if (motionPermissionRef.current === 'granted' || motionPermissionRef.current === 'denied') return

    const state = await requestMotionPermission()
    motionPermissionRef.current = state
    setMotionPermission(state)

    if (state === 'denied') {
      toast.warning(txStatic('未开启运动传感器权限，请点击签筒求签', 'Motion permission denied. Tap the vessel to draw a sign.'))
    }
  }, [])

  const drawStick = useCallback(() => {
    if (isShaking) return

    void ensureMotionPermission()

    setPhase('shaking')
    setIsShaking(true)
    setShowResult(false)
    setDrawnStick(null)

    setTimeout(() => {
      const stick = pickStickForCategory(selectedCategory)
      setDrawnStick(stick)
      setIsShaking(false)
      setPhase('revealing')

      setTimeout(() => {
        setShowResult(true)
        setPhase('done')

        const historyItem: DrawHistory = {
          id: Date.now().toString(),
          stick,
          timestamp: Date.now(),
          category: selectedCategory || undefined,
        }
        setDrawHistory((prev) => [historyItem, ...prev])
      }, 600)
    }, 1800)
  }, [isShaking, selectedCategory, ensureMotionPermission])

  useEffect(() => {
    if (phase !== 'intent' && phase !== 'done') return
    if (!isShakeSupported()) return
    if (motionPermission === 'denied' || motionPermission === 'unsupported') return

    return createShakeListener(drawStick, { threshold: 15, cooldown: 1200 })
  }, [phase, drawStick, motionPermission])

  const stickReading = useMemo((): StickReading | null => {
    if (!drawnStick) return null
    return rehydrateStickReading(drawnStick, selectedCategory || undefined)
  }, [drawnStick, selectedCategory, isEnglish])

  const toggleFavorite = useCallback((stickId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(stickId)) next.delete(stickId)
      else next.add(stickId)
      return next
    })
  }, [])

  const copyToClipboard = useCallback(() => {
    if (!stickReading) return

    const { stick, overview, poemInsight, categoryGuidance, categoryLabel, aspects, advice, auspicious, cautions, timing } =
      stickReading

    const aspectBlock = aspects.map((a) => `【${a.label}】${a.text}`).join('\n')

    const text = `第 ${stick.id} 签 - ${stick.title} (${stick.level})

签诗：
${stick.poem}

签意总览：
${overview}

签诗白话：
${poemInsight}
${categoryGuidance ? `\n所问${categoryLabel}：\n${categoryGuidance}` : ''}

分项详批：
${aspectBlock}

行事建议：
${advice}

宜：${auspicious.join('；')}
忌：${cautions.join('；')}
时运：${timing}
${stick.story ? `\n典故：\n${stick.story}` : ''}

来自 命运工坊 · 竹语灵签`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      toast.error(txStatic('复制失败', 'Copy failed'))
    })
  }, [stickReading])

  const shareStick = useCallback(async () => {
    if (!stickReading) return

    const { stick, overview, categoryGuidance } = stickReading
    const text = `第 ${stick.id} 签 - ${stick.title} (${stick.level})\n\n签诗：${stick.poem}\n\n${overview}${categoryGuidance ? `\n\n${categoryGuidance}` : ''}\n\n来自 命运工坊 · 竹语灵签`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `第 ${stick.id} 签 - ${stick.title}`,
          text,
        })
        return
      } catch {
        // fall through
      }
    }
    copyToClipboard()
  }, [stickReading, copyToClipboard])

  const exportHistory = useCallback(() => {
    const data = JSON.stringify(drawHistoryRef.current, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `抽签历史记录_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const clearHistory = useCallback(async () => {
    const confirmed = await confirm({
      title: txStatic('清空历史记录', 'Clear history'),
      message: txStatic('确定要清空所有历史记录吗？此操作不可恢复。', 'Clear all history? This cannot be undone.'),
      confirmText: txStatic('清空', 'Clear'),
      cancelText: txStatic('取消', 'Cancel'),
      type: 'danger',
    })
    if (confirmed) {
      setDrawHistory([])
      setStorageItem('divination-draw-history', [])
    }
  }, [])

  const filteredHistory = useMemo(() => {
    if (!historySearch) return drawHistory
    const search = historySearch.toLowerCase()
    return drawHistory.filter(
      (item) =>
        item.stick.title.toLowerCase().includes(search) ||
        item.stick.poem.toLowerCase().includes(search) ||
        item.stick.id.toString().includes(search),
    )
  }, [drawHistory, historySearch])

  const resetDraw = useCallback(() => {
    setShowResult(false)
    setDrawnStick(null)
    setShowDetailed(false)
    setCopied(false)
    setPhase('intent')
  }, [])

  const viewHistoryItem = useCallback((item: DrawHistory) => {
    setDrawnStick(resolveCanonicalStick(item.stick))
    setShowResult(true)
    setSelectedCategory(item.category || '')
    setShowDetailed(false)
    setPhase('done')
  }, [])

  return {
    phase,
    ritualStep: DRAW_PHASE_STEP[phase],
    isShaking,
    showResult,
    selectedCategory,
    setSelectedCategory,
    drawHistory,
    showHistory,
    setShowHistory,
    showDetailed,
    setShowDetailed,
    favorites,
    copied,
    historySearch,
    setHistorySearch,
    stickReading,
    filteredHistory,
    drawStick,
    motionPermission,
    ensureMotionPermission,
    toggleFavorite,
    copyToClipboard,
    shareStick,
    exportHistory,
    clearHistory,
    resetDraw,
    viewHistoryItem,
  }
}
