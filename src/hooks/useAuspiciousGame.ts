import { useMemo, useState } from 'react'
import { digitsOnly, parseSolarParts } from '../utils/birthDateUtils'
import {
  type EventType,
} from '../utils/auspiciousData'
import { calculateDayPillar, getAuspiciousShichens } from '../utils/auspiciousEngine'

export function useAuspiciousGame() {
  const today = new Date()
  const [queryYear, setQueryYear] = useState(String(today.getFullYear()))
  const [queryMonth, setQueryMonth] = useState(String(today.getMonth() + 1))
  const [queryDay, setQueryDay] = useState(String(today.getDate()))
  const [selectedEventType, setSelectedEventType] = useState<EventType>('marriage')
  const [dateError, setDateError] = useState('')
  const [hasScanned, setHasScanned] = useState(false)

  const dateObj = useMemo(
    () => parseSolarParts(queryYear, queryMonth, queryDay),
    [queryYear, queryMonth, queryDay]
  )

  const ritualStep: 1 | 2 | 3 | 4 = useMemo(() => {
    if (hasScanned) return 4
    if (dateObj) return 3
    return 2
  }, [hasScanned, dateObj])

  const dayPillar = useMemo(
    () => (dateObj ? calculateDayPillar(dateObj) : null),
    [dateObj]
  )

  const auspiciousShichens = useMemo(
    () => (dateObj ? getAuspiciousShichens(dateObj, selectedEventType) : []),
    [dateObj, selectedEventType]
  )

  const goodShichens = auspiciousShichens.filter((s) => s.result.isGood)
  const bestShichens = goodShichens.slice(0, 3)

  const setYear = (v: string) => {
    setQueryYear(digitsOnly(v, 4))
    setDateError('')
    setHasScanned(false)
  }

  const setMonth = (v: string) => {
    setQueryMonth(digitsOnly(v, 2))
    setDateError('')
    setHasScanned(false)
  }

  const setDay = (v: string) => {
    setQueryDay(digitsOnly(v, 2))
    setDateError('')
    setHasScanned(false)
  }

  const selectEvent = (id: EventType) => {
    setSelectedEventType(id)
    setHasScanned(false)
  }

  const scanTimes = () => {
    if (!dateObj) {
      setDateError('请输入有效的日期')
      return
    }
    setDateError('')
    setHasScanned(true)
  }

  return {
    queryYear,
    queryMonth,
    queryDay,
    setYear,
    setMonth,
    setDay,
    selectedEventType,
    selectEvent,
    dateError,
    ritualStep,
    phase: hasScanned ? 'revealed' as const : dateObj ? 'scan' as const : 'date' as const,
    dateObj,
    dayPillar,
    auspiciousShichens,
    goodShichens,
    bestShichens,
    scanTimes,
    hasScanned,
  }
}
