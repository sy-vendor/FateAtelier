import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DREAM_PHASE_STEP,
  formatDreamDate,
  getMoodLabel,
  type DreamPhase,
} from '../utils/dreamData'
import { interpretDreamWithMood, rehydrateDreamInterpretation, type DreamInterpretation } from '../utils/dreamEngine'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { toast } from '../utils/toast'
import { confirm } from '../utils/confirm'
import { dreamSymbols } from '../data/dreamSymbols'
import { isEnglishLocale, txStatic } from '../i18n/locale'
import { useLocale } from '../i18n/LocaleContext'
import { getEnLocalePacks } from '../i18n/enLocalePacks'
import { markDailyJourneyComplete } from '../utils/dailyJourney'
import { trackFeatureStart } from '../utils/analytics'

export interface DreamRecord {
  id: string
  content: string
  mood: string
  timestamp: number
  /** Legacy field; new records omit it and re-interpret on view. */
  interpretation?: DreamInterpretation
}

const STORAGE_DEBOUNCE_MS = 400
const INTERPRET_DELAY_MS = 900
const DREAM_HISTORY_CAP = 50

type StoredDreamRecord = {
  id: string
  content: string
  mood: string
  timestamp: number
}

function toStoredDreamRecord(record: DreamRecord): StoredDreamRecord {
  return {
    id: record.id,
    content: record.content,
    mood: record.mood,
    timestamp: record.timestamp,
  }
}

function hydrateDreamRecord(raw: DreamRecord | StoredDreamRecord): DreamRecord {
  return {
    id: raw.id,
    content: raw.content,
    mood: raw.mood,
    timestamp: raw.timestamp,
  }
}

export function useDreamGame() {
  const { isEnglish, enPackVersion } = useLocale()
  const [dreamContent, setDreamContent] = useState(() => {
    const match = window.location.pathname.match(/^\/(?:en\/|zh\/|zh-CN\/)?dream\/symbol\/(\d+)\/?$/)
    const index = match ? Number(match[1]) : -1
    const symbol = index >= 0 ? dreamSymbols[index] : undefined
    if (!symbol) return ''
    if (isEnglishLocale()) {
      const locale = getEnLocalePacks()?.dreamSymbolsEn[index]
      const keyword =
        locale?.keywords.find((word) => /^[a-z]/i.test(word)) ??
        locale?.keywords[0] ??
        symbol.keywords[0]
      return `I dreamed of ${keyword}`
    }
    return `我梦见了${symbol.keywords[0]}`
  })
  const [selectedMood, setSelectedMood] = useState('')
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null)
  const [phase, setPhase] = useState<DreamPhase>('slumber')
  const [inputError, setInputError] = useState('')
  const [history, setHistory] = useState<DreamRecord[]>(() => {
    const result = getStorageItem<Array<DreamRecord | StoredDreamRecord>>('dream-interpretation-history', [])
    if (result.error) {
      requestAnimationFrame(() => toast.error(txStatic('加载历史记录失败', 'Failed to load history')))
    }
    if (result.success && result.data !== undefined && Array.isArray(result.data)) {
      return result.data.map(hydrateDreamRecord).slice(0, DREAM_HISTORY_CAP)
    }
    return []
  })
  const [showHistory, setShowHistory] = useState(false)
  const resultSectionRef = useRef<HTMLDivElement>(null)

  const historyRef = useRef(history)
  historyRef.current = history

  const scrollToResult = useCallback(() => {
    requestAnimationFrame(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      const result = setStorageItem(
        'dream-interpretation-history',
        historyRef.current.map(toStoredDreamRecord),
      )
      if (!result.success && result.error) {
        toast.warning(result.error || txStatic('保存历史记录失败', 'Failed to save history'))
      }
    }, STORAGE_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [history])

  useEffect(() => {
    return () => {
      void setStorageItem(
        'dream-interpretation-history',
        historyRef.current.map(toStoredDreamRecord),
      )
    }
  }, [])

  useEffect(() => {
    if (phase === 'interpreting' || phase === 'revealed') return
    if (!dreamContent.trim()) {
      setPhase('slumber')
      return
    }
    setPhase('recount')
  }, [dreamContent, phase])

  const ritualStep = DREAM_PHASE_STEP[phase]

  const symbolCount = interpretation?.symbols.length ?? 0

  const handleInterpret = useCallback(() => {
    const trimmed = dreamContent.trim()
    if (!trimmed) {
      setInputError(txStatic('请先描述你的梦境，再开始解析', 'Describe your dream before interpreting'))
      return
    }

    setInputError('')
    setPhase('interpreting')
    trackFeatureStart('dream')

    window.setTimeout(() => {
      const result = interpretDreamWithMood(trimmed, selectedMood, isEnglish)
      setInterpretation(result)

      const record: DreamRecord = {
        id: Date.now().toString(),
        content: trimmed,
        mood: selectedMood,
        timestamp: Date.now(),
      }
      setHistory((prev) => [record, ...prev].slice(0, DREAM_HISTORY_CAP))
      setPhase('revealed')
      markDailyJourneyComplete('dream')
      window.setTimeout(scrollToResult, 100)
    }, INTERPRET_DELAY_MS)
  }, [dreamContent, selectedMood, scrollToResult, isEnglish])

  const handleClear = useCallback(() => {
    setDreamContent('')
    setInterpretation(null)
    setInputError('')
    setPhase('slumber')
  }, [])

  const handleViewHistory = useCallback(
    (record: DreamRecord) => {
      setDreamContent(record.content)
      setSelectedMood(record.mood)
      setInterpretation(rehydrateDreamInterpretation(record, isEnglish))
      setShowHistory(false)
      setPhase('revealed')
      window.setTimeout(scrollToResult, 100)
    },
    [scrollToResult, isEnglish],
  )

  useEffect(() => {
    if (phase !== 'revealed' || !dreamContent.trim()) return
    setInterpretation(interpretDreamWithMood(dreamContent, selectedMood, isEnglish))
  }, [isEnglish, enPackVersion]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteHistory = useCallback(async (id: string) => {
    const confirmed = await confirm({
      title: txStatic('删除记录', 'Delete record'),
      message: txStatic('确定要删除这条记录吗？', 'Are you sure you want to delete this record?'),
      confirmText: txStatic('删除', 'Delete'),
      cancelText: txStatic('取消', 'Cancel'),
      type: 'danger',
    })
    if (confirmed) {
      setHistory((prev) => prev.filter((r) => r.id !== id))
    }
  }, [])

  const resetForNewDream = useCallback(() => {
    setDreamContent('')
    setSelectedMood('')
    setInterpretation(null)
    setInputError('')
    setPhase('slumber')
  }, [])

  return {
    dreamContent,
    setDreamContent,
    selectedMood,
    setSelectedMood,
    interpretation,
    phase,
    ritualStep,
    inputError,
    setInputError,
    history,
    showHistory,
    setShowHistory,
    resultSectionRef,
    symbolCount,
    handleInterpret,
    handleClear,
    handleViewHistory,
    handleDeleteHistory,
    resetForNewDream,
    formatDreamDate,
    getMoodLabel,
  }
}
