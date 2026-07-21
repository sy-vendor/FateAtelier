import { useCallback, useRef, useState } from 'react'
import { calculateYearPillar, calculateDayPillar } from '../utils/bazi'
import {
  ZIWEI_PHASE_STEP,
  SHICHEN_OPTIONS,
  type ZiweiPhase,
} from '../utils/ziweiData'
import { buildZiweiChart, type ZiweiChartResult } from '../utils/ziweiEngine'
import {
  digitsOnly,
  resolveBirthDate,
  type CalendarType,
} from '../utils/birthDateUtils'
import { txStatic } from '../i18n/locale'

export function useZiweiGame() {
  const [calendarType, setCalendarType] = useState<CalendarType>('lunar')
  const [solarYear, setSolarYear] = useState('')
  const [solarMonth, setSolarMonth] = useState('')
  const [solarDay, setSolarDay] = useState('')
  const [lunarYear, setLunarYear] = useState('')
  const [lunarMonth, setLunarMonth] = useState('')
  const [lunarDay, setLunarDay] = useState('')
  const [isLunarLeapMonth, setIsLunarLeapMonth] = useState(false)
  const [birthTime, setBirthTime] = useState('子')
  const [phase, setPhase] = useState<ZiweiPhase>('idle')
  const [inputError, setInputError] = useState('')
  const [result, setResult] = useState<ZiweiChartResult | null>(null)
  const [focusedPalaceIndex, setFocusedPalaceIndex] = useState(0)
  const insightRef = useRef<HTMLDivElement>(null)

  const ritualStep = ZIWEI_PHASE_STEP[phase]

  const scrollToInsight = useCallback(() => {
    requestAnimationFrame(() => {
      insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const markBirth = useCallback(() => {
    setPhase((p) => (p === 'idle' ? 'birth' : p))
  }, [])

  const calculateChart = useCallback(() => {
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
    setPhase('stars')

    const yearPillar = calculateYearPillar(resolved.date)
    const dayPillar = calculateDayPillar(resolved.date)
    const chart = buildZiweiChart(
      yearPillar,
      dayPillar,
      resolved.lunarYear,
      resolved.lunarMonth,
      resolved.lunarDay,
      birthTime,
    )

    setResult(chart)
    setFocusedPalaceIndex(0)
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

  const shenGongPalaceIndex = result
    ? (result.shenGong - result.mingGong + 12) % 12
    : -1

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
    focusedPalaceIndex,
    setFocusedPalaceIndex,
    insightRef,
    calculateChart,
    shenGongPalaceIndex,
    shichenOptions: SHICHEN_OPTIONS,
  }
}
