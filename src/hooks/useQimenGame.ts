import { useCallback, useMemo, useRef, useState } from 'react'
import { digitsOnly } from '../utils/birthDateUtils'
import { DIRECTION_ANGLES, QIMEN_PHASE_STEP, type QimenPhase } from '../utils/qimenData'
import { calculateQimenPan } from '../utils/qimenEngine'

function parseDateParts(year: string, month: string, day: string, hour: string) {
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  const h = parseInt(hour, 10)
  if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h)) return null
  if (m < 1 || m > 12 || d < 1 || d > 31 || h < 0 || h > 23) return null
  return { year: y, month: m, day: d, hour: h }
}

export function useQimenGame() {
  const today = new Date()
  const [queryYear, setQueryYear] = useState(String(today.getFullYear()))
  const [queryMonth, setQueryMonth] = useState(String(today.getMonth() + 1))
  const [queryDay, setQueryDay] = useState(String(today.getDate()))
  const [queryHour, setQueryHour] = useState(String(today.getHours()))
  const [selectedDirection, setSelectedDirection] = useState('东')
  const [phase, setPhase] = useState<QimenPhase>('idle')
  const [focusedPalaceIndex, setFocusedPalaceIndex] = useState<number | null>(null)
  const insightRef = useRef<HTMLDivElement>(null)

  const ritualStep = QIMEN_PHASE_STEP[phase]

  const dateParts = useMemo(
    () => parseDateParts(queryYear, queryMonth, queryDay, queryHour),
    [queryYear, queryMonth, queryDay, queryHour],
  )

  const result = useMemo(() => {
    if (!dateParts) return null
    return calculateQimenPan(
      dateParts.year,
      dateParts.month,
      dateParts.day,
      dateParts.hour,
      selectedDirection,
    )
  }, [dateParts, selectedDirection])

  const selectedPalace = useMemo(() => {
    if (!result) return null
    if (focusedPalaceIndex !== null) return result.palaces[focusedPalaceIndex]
    return result.palaces.find((p) => p.direction === selectedDirection) ?? null
  }, [result, focusedPalaceIndex, selectedDirection])

  const compassAngle = DIRECTION_ANGLES[selectedDirection] ?? 90

  const scrollToInsight = useCallback(() => {
    requestAnimationFrame(() => {
      insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const setYear = useCallback((value: string) => {
    setQueryYear(digitsOnly(value, 4))
    setPhase((p) => (p === 'idle' ? 'timed' : p))
  }, [])

  const setMonth = useCallback((value: string) => {
    setQueryMonth(digitsOnly(value, 2))
    setPhase((p) => (p === 'idle' ? 'timed' : p))
  }, [])

  const setDay = useCallback((value: string) => {
    setQueryDay(digitsOnly(value, 2))
    setPhase((p) => (p === 'idle' ? 'timed' : p))
  }, [])

  const setHour = useCallback((value: string) => {
    setQueryHour(digitsOnly(value, 2))
    setPhase((p) => (p === 'idle' ? 'timed' : p))
  }, [])

  const resetToNow = useCallback(() => {
    const now = new Date()
    setQueryYear(String(now.getFullYear()))
    setQueryMonth(String(now.getMonth() + 1))
    setQueryDay(String(now.getDate()))
    setQueryHour(String(now.getHours()))
    setPhase('timed')
  }, [])

  const selectDirection = useCallback(
    (direction: string) => {
      setSelectedDirection(direction)
      setFocusedPalaceIndex(null)
      setPhase((p) => (p === 'insight' ? 'insight' : 'directed'))
    },
    [],
  )

  const selectPalace = useCallback(
    (index: number, direction: string) => {
      setSelectedDirection(direction)
      setFocusedPalaceIndex(index)
      setPhase('insight')
      window.setTimeout(scrollToInsight, 80)
    },
    [scrollToInsight],
  )

  const auspiciousDirections = useMemo(() => {
    if (!result) return []
    return result.palaces
      .filter((p) => p.auspicious && p.direction !== '中')
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [result])

  const inauspiciousDirections = useMemo(() => {
    if (!result) return []
    return result.palaces
      .filter((p) => !p.auspicious && p.direction !== '中')
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
  }, [result])

  return {
    queryYear,
    queryMonth,
    queryDay,
    queryHour,
    setYear,
    setMonth,
    setDay,
    setHour,
    selectedDirection,
    phase,
    ritualStep,
    result,
    selectedPalace,
    focusedPalaceIndex,
    compassAngle,
    insightRef,
    resetToNow,
    selectDirection,
    selectPalace,
    auspiciousDirections,
    inauspiciousDirections,
    dateValid: dateParts !== null,
  }
}
