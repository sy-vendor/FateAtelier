import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import muyuSound from '../video/muyu-2.mp3?url'
import {
  MERIT_GAMES,
  MERIT_PHASE_STEP,
  STORAGE_KEYS,
  type FloatingText,
  type MeritGameType,
  type MeritPhase,
  type ReleaseAnimation,
} from '../utils/cyberMeritData'
import {
  checkMilestone,
  computeReleaseAnimation,
  getRandomMessage,
  getTotalMerit,
  playMeritTone,
} from '../utils/cyberMeritEngine'
import { getStorageItem, setStorageItem } from '../utils/storage'
import { txStatic } from '../i18n/locale'

function loadCount(key: string): number {
  const result = getStorageItem<number>(key, 0)
  if (result.success && typeof result.data === 'number') return result.data
  return 0
}

export function useCyberMeritGame() {
  const [activeGame, setActiveGame] = useState<MeritGameType>('woodfish')
  const [counts, setCounts] = useState<Record<MeritGameType, number>>({
    woodfish: 0,
    release: 0,
    incense: 0,
    prayer: 0,
  })
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isKnocking, setIsKnocking] = useState(false)
  const [releasingAnimal, setReleasingAnimal] = useState<ReleaseAnimation | null>(null)
  const [isBurning, setIsBurning] = useState(false)
  const [isPraying, setIsPraying] = useState(false)
  const [sessionActions, setSessionActions] = useState(0)
  const [milestoneFlash, setMilestoneFlash] = useState(false)

  const woodfishAudioRef = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    woodfishAudioRef.current = new Audio(muyuSound)
    woodfishAudioRef.current.preload = 'auto'
    return () => {
      woodfishAudioRef.current?.pause()
      woodfishAudioRef.current = null
    }
  }, [])

  useEffect(() => {
    setCounts({
      woodfish: loadCount(STORAGE_KEYS.woodfish),
      release: loadCount(STORAGE_KEYS.release),
      incense: loadCount(STORAGE_KEYS.incense),
      prayer: loadCount(STORAGE_KEYS.prayer),
    })
  }, [])

  const totalMerit = useMemo(() => getTotalMerit(counts), [counts])
  const activeGameInfo = MERIT_GAMES.find((g) => g.id === activeGame)!

  const phase: MeritPhase = useMemo(() => {
    if (milestoneFlash) return 'milestone'
    if (sessionActions > 0) return 'accumulate'
    return 'practice'
  }, [milestoneFlash, sessionActions])

  const ritualStep = MERIT_PHASE_STEP[phase]

  const saveCount = useCallback((type: MeritGameType, count: number) => {
    setStorageItem(STORAGE_KEYS[type], count)
  }, [])

  const addFloatingText = useCallback(
    (text: string, x: number, y: number, type: FloatingText['type'] = 'merit') => {
      const id = Date.now() + Math.random()
      setFloatingTexts((prev) => [...prev, { id, text, x, y, type }])
      window.setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    },
    []
  )

  const bumpCount = useCallback(
    (type: MeritGameType, x: number, y: number, meritLabel: string) => {
      let milestoneMsg: string | null = null
      setCounts((prev) => {
        const newCount = prev[type] + 1
        saveCount(type, newCount)
        milestoneMsg = checkMilestone(type, newCount)
        return { ...prev, [type]: newCount }
      })
      setSessionActions((n) => n + 1)

      const message = getRandomMessage(type)
      addFloatingText(meritLabel, x, y, 'merit')
      window.setTimeout(() => addFloatingText(message, x + 20, y - 20, 'message'), 100)
      setCurrentMessage(message)

      if (milestoneMsg) {
        window.setTimeout(() => {
          addFloatingText(`🎉 ${milestoneMsg}`, window.innerWidth / 2, window.innerHeight / 2, 'milestone')
          setCurrentMessage(`🎉 ${milestoneMsg}`)
          setMilestoneFlash(true)
          window.setTimeout(() => setMilestoneFlash(false), 2500)
        }, 200)
      }
    },
    [addFloatingText, saveCount]
  )

  const knockWoodfish = useCallback(
    (event?: React.MouseEvent) => {
      const x = event ? event.clientX : window.innerWidth / 2
      const y = event ? event.clientY : window.innerHeight / 2
      setIsKnocking(true)
      window.setTimeout(() => setIsKnocking(false), 200)
      bumpCount('woodfish', x, y, txStatic('功德+1', 'Merit +1'))
      woodfishAudioRef.current?.play().catch(() => playMeritTone('woodfish'))
    },
    [bumpCount]
  )

  const releaseLife = useCallback(
    (event: React.MouseEvent, animalIndex: number) => {
      const x = event.clientX
      const y = event.clientY
      setReleasingAnimal(computeReleaseAnimation(animalIndex))
      window.setTimeout(() => setReleasingAnimal(null), 1800)
      bumpCount('release', x, y, txStatic('功德+3', 'Merit +3'))
      playMeritTone('release')
    },
    [bumpCount]
  )

  const burnIncense = useCallback(
    (event?: React.MouseEvent) => {
      if (isBurning) return
      const x = event ? event.clientX : window.innerWidth / 2
      const y = event ? event.clientY : window.innerHeight / 2
      setIsBurning(true)
      bumpCount('incense', x, y, txStatic('功德+2', 'Merit +2'))
      playMeritTone('incense')
      window.setTimeout(() => setIsBurning(false), 10000)
    },
    [bumpCount, isBurning]
  )

  const pray = useCallback(
    (event?: React.MouseEvent) => {
      if (isPraying) return
      const x = event ? event.clientX : window.innerWidth / 2
      const y = event ? event.clientY : window.innerHeight / 2
      setIsPraying(true)
      bumpCount('prayer', x, y, txStatic('功德+5', 'Merit +5'))
      playMeritTone('prayer')
      window.setTimeout(() => setIsPraying(false), 3000)
    },
    [bumpCount, isPraying]
  )

  const toggleAutoWoodfish = useCallback(() => {
    setIsAutoPlaying((v) => !v)
  }, [])

  const selectGame = useCallback((game: MeritGameType) => {
    setActiveGame(game)
    setIsAutoPlaying(false)
    setMilestoneFlash(false)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || activeGame !== 'woodfish') return
    const interval = window.setInterval(() => knockWoodfish(), 500)
    return () => clearInterval(interval)
  }, [isAutoPlaying, activeGame, knockWoodfish])

  useEffect(() => {
    if (!currentMessage) return
    const timer = window.setTimeout(() => setCurrentMessage(''), 2500)
    return () => clearTimeout(timer)
  }, [currentMessage])

  return {
    activeGame,
    selectGame,
    counts,
    totalMerit,
    activeGameInfo,
    ritualStep,
    isAutoPlaying,
    toggleAutoWoodfish,
    floatingTexts,
    currentMessage,
    isKnocking,
    releasingAnimal,
    isBurning,
    isPraying,
    knockWoodfish,
    releaseLife,
    burnIncense,
    pray,
  }
}
