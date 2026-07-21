import { useCallback, useRef, useState } from 'react'
import { tianganWuxing } from '../utils/constants'
import {
  BAZI_PHASE_STEP,
  SHICHEN_OPTIONS,
  type BaziPhase,
} from '../utils/baziData'
import { computeBaziFortune, type BaziFortuneResult } from '../utils/baziFortuneEngine'
import {
  digitsOnly,
  resolveBirthDate,
  type CalendarType,
} from '../utils/birthDateUtils'
import { txStatic } from '../i18n/locale'

export function useBaziGame() {
  const [calendarType, setCalendarType] = useState<CalendarType>('solar')
  const [solarYear, setSolarYear] = useState('')
  const [solarMonth, setSolarMonth] = useState('')
  const [solarDay, setSolarDay] = useState('')
  const [lunarYear, setLunarYear] = useState('')
  const [lunarMonth, setLunarMonth] = useState('')
  const [lunarDay, setLunarDay] = useState('')
  const [isLunarLeapMonth, setIsLunarLeapMonth] = useState(false)
  const [birthTime, setBirthTime] = useState('子')
  const [phase, setPhase] = useState<BaziPhase>('idle')
  const [inputError, setInputError] = useState('')
  const [result, setResult] = useState<BaziFortuneResult | null>(null)
  const insightRef = useRef<HTMLDivElement>(null)

  const ritualStep = BAZI_PHASE_STEP[phase]

  const scrollToInsight = useCallback(() => {
    requestAnimationFrame(() => {
      insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const markBirth = useCallback(() => {
    setPhase((p) => (p === 'idle' ? 'birth' : p))
  }, [])

  const calculateFortune = useCallback(() => {
    const resolved = resolveBirthDate({
      calendarType,
      solarYear,
      solarMonth,
      solarDay,
      lunarYear,
      lunarMonth,
      lunarDay,
      isLunarLeapMonth,
    })

    if ('error' in resolved) {
      setInputError(txStatic(resolved.error, 'Please enter a valid birth date'))
      return
    }

    setInputError('')
    setPhase('pillars')

    const fortune = computeBaziFortune(resolved.date, birthTime)
    if (!fortune) {
      setInputError(txStatic('请选择有效的出生时辰', 'Please select a valid birth hour'))
      return
    }

    setResult(fortune)
    setPhase('insight')
    window.setTimeout(scrollToInsight, 80)
  }, [
    calendarType,
    solarYear,
    solarMonth,
    solarDay,
    lunarYear,
    lunarMonth,
    lunarDay,
    isLunarLeapMonth,
    birthTime,
    scrollToInsight,
  ])

  const dayMasterWuxing = result ? tianganWuxing[result.bazi[2][0]] ?? '—' : '—'

  return {
    calendarType,
    setCalendarType: (v: CalendarType) => {
      setCalendarType(v)
      if (v === 'solar') setIsLunarLeapMonth(false)
      markBirth()
    },
    solarYear,
    solarMonth,
    solarDay,
    setSolarYear: (v: string) => { setSolarYear(digitsOnly(v, 4)); markBirth() },
    setSolarMonth: (v: string) => { setSolarMonth(digitsOnly(v, 2)); markBirth() },
    setSolarDay: (v: string) => { setSolarDay(digitsOnly(v, 2)); markBirth() },
    lunarYear,
    lunarMonth,
    lunarDay,
    setLunarYear: (v: string) => { setLunarYear(digitsOnly(v, 4)); markBirth() },
    setLunarMonth: (v: string) => { setLunarMonth(digitsOnly(v, 2)); markBirth() },
    setLunarDay: (v: string) => { setLunarDay(digitsOnly(v, 2)); markBirth() },
    isLunarLeapMonth,
    setIsLunarLeapMonth,
    birthTime,
    setBirthTime: (v: string) => { setBirthTime(v); markBirth() },
    phase,
    ritualStep,
    inputError,
    result,
    insightRef,
    calculateFortune,
    dayMasterWuxing,
    shichenOptions: SHICHEN_OPTIONS,
  }
}
