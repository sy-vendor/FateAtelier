import { useCallback, useEffect, useMemo, useState } from 'react'
import { calculateYearPillar } from '../utils/bazi'
import { dizhiToShengxiao } from '../utils/constants'
import { digitsOnly, type CalendarType } from '../utils/birthDateUtils'
import { lunarToSolar } from '../utils/lunarCalendar'
import {
  SHENGXIAO_LIST,
  COLOR_DATABASE,
} from '../utils/luckyColorData'
import {
  generateLuckyColor,
  generatePersonalizedLuckyColor,
  getCurrentTimeColor,
  getSecondaryColor,
  getZodiacSignByDate,
} from '../utils/luckyColorEngine'
import { toast } from '../utils/toast'
import { txStatic } from '../i18n/locale'

export function useLuckyColorGame() {
  const today = new Date()
  const [queryYear, setQueryYear] = useState(String(today.getFullYear()))
  const [queryMonth, setQueryMonth] = useState(String(today.getMonth() + 1))
  const [queryDay, setQueryDay] = useState(String(today.getDate()))

  const [showPersonalized, setShowPersonalized] = useState(false)
  const [usePersonalized, setUsePersonalized] = useState(false)
  const [calendarType, setCalendarType] = useState<CalendarType>('solar')
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [isLunarLeapMonth, setIsLunarLeapMonth] = useState(false)
  const [zodiacSign, setZodiacSign] = useState<number | undefined>(undefined)
  const [shengxiao, setShengxiao] = useState('')

  const [showDetails, setShowDetails] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  const selectedDate = useMemo(() => {
    const year = parseInt(queryYear, 10)
    const month = parseInt(queryMonth, 10)
    const day = parseInt(queryDay, 10)
    if (isNaN(year) || isNaN(month) || isNaN(day)) return today
    return new Date(year, month - 1, day)
  }, [queryYear, queryMonth, queryDay, today])

  const isToday = selectedDate.toDateString() === today.toDateString()

  const currentTimeSlot = useMemo(() => {
    const hour = isToday ? new Date().getHours() : 12
    if (hour >= 6 && hour < 9) return '早晨 (6-9点)'
    if (hour >= 9 && hour < 12) return '上午 (9-12点)'
    if (hour >= 12 && hour < 18) return '下午 (12-18点)'
    return '晚上 (18-24点)'
  }, [isToday])

  const personalizedResult = useMemo(() => {
    if (!usePersonalized) return null

    let birth: Date | undefined

    if (calendarType === 'solar') {
      if (birthYear && birthMonth && birthDay) {
        const year = parseInt(birthYear, 10)
        const month = parseInt(birthMonth, 10)
        const day = parseInt(birthDay, 10)
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          birth = new Date(year, month - 1, day)
        }
      }
    } else if (birthYear && birthMonth && birthDay) {
      const year = parseInt(birthYear, 10)
      const month = parseInt(birthMonth, 10)
      const day = parseInt(birthDay, 10)
      if (!isNaN(year) && !isNaN(month) && !isNaN(day) && year >= 1900 && year <= 2100) {
        const solarDate = lunarToSolar(year, isLunarLeapMonth ? month + 12 : month, day)
        if (solarDate) birth = solarDate
      }
    }

    let zodiac = zodiacSign
    if (birth && zodiac === undefined) {
      zodiac = getZodiacSignByDate(birth.getMonth() + 1, birth.getDate())
    }

    let sx = shengxiao || undefined
    if (birth && !sx) {
      const yearPillar = calculateYearPillar(birth)
      sx = dizhiToShengxiao[yearPillar[1]]
    }

    return generatePersonalizedLuckyColor(selectedDate, birth, zodiac, sx)
  }, [
    usePersonalized,
    calendarType,
    birthYear,
    birthMonth,
    birthDay,
    isLunarLeapMonth,
    zodiacSign,
    shengxiao,
    selectedDate,
  ])

  const luckyColor = useMemo(() => {
    if (personalizedResult) return personalizedResult.color
    return generateLuckyColor(selectedDate)
  }, [selectedDate, personalizedResult])

  const secondaryColor = useMemo(
    () => getSecondaryColor(luckyColor, selectedDate),
    [luckyColor, selectedDate],
  )

  const displayHex = getCurrentTimeColor(luckyColor, selectedTimeSlot ?? currentTimeSlot)

  const ritualStep = useMemo((): 1 | 2 | 3 | 4 => {
    if (selectedTimeSlot) return 4
    if (showDetails || usePersonalized) return 3
    return 2
  }, [selectedTimeSlot, showDetails, usePersonalized])

  useEffect(() => {
    if (calendarType === 'lunar' && birthYear && birthMonth && birthDay) {
      const year = parseInt(birthYear, 10)
      const month = parseInt(birthMonth, 10)
      const day = parseInt(birthDay, 10)
      if (!isNaN(year) && !isNaN(month) && !isNaN(day) && year >= 1900 && year <= 2100) {
        const shengxiaoIndex = (year - 4) % 12
        setShengxiao(SHENGXIAO_LIST[shengxiaoIndex])
        const solarDate = lunarToSolar(year, isLunarLeapMonth ? month + 12 : month, day)
        if (solarDate) {
          setZodiacSign(getZodiacSignByDate(solarDate.getMonth() + 1, solarDate.getDate()))
        }
      }
    }
  }, [birthYear, birthMonth, birthDay, isLunarLeapMonth, calendarType])

  const handleSolarBirthChange = useCallback((y: string, m: string, d: string) => {
    const year = parseInt(y, 10)
    const month = parseInt(m, 10)
    const day = parseInt(d, 10)
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(year, month - 1, day)
      setZodiacSign(getZodiacSignByDate(month, day))
      const yearPillar = calculateYearPillar(date)
      setShengxiao(dizhiToShengxiao[yearPillar[1]] || '')
    }
  }, [])

  const setQueryField = useCallback((setter: (v: string) => void, value: string, max: number) => {
    setter(digitsOnly(value, max))
  }, [])

  const handleBirthFieldChange = useCallback(
    (fieldId: string, value: string) => {
      const v = digitsOnly(value, fieldId === 'birth-year' ? 4 : 2)
      if (fieldId === 'birth-year') setBirthYear(v)
      if (fieldId === 'birth-month') setBirthMonth(v)
      if (fieldId === 'birth-day') setBirthDay(v)
      if (calendarType === 'solar') {
        handleSolarBirthChange(
          fieldId === 'birth-year' ? v : birthYear,
          fieldId === 'birth-month' ? v : birthMonth,
          fieldId === 'birth-day' ? v : birthDay,
        )
      }
    },
    [calendarType, birthYear, birthMonth, birthDay, handleSolarBirthChange],
  )

  const resetToToday = useCallback(() => {
    setQueryYear(String(today.getFullYear()))
    setQueryMonth(String(today.getMonth() + 1))
    setQueryDay(String(today.getDate()))
    setSelectedTimeSlot(null)
  }, [today])

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHex(type)
      setTimeout(() => setCopiedHex(null), 2000)
    } catch {
      toast.error(txStatic('复制失败，请手动复制', 'Copy failed — please copy manually'))
    }
  }, [])

  const shareColor = useCallback(async () => {
    const shareText = txStatic(
      `今日幸运色：${luckyColor.name}\n颜色代码：${luckyColor.hex}\n含义：${luckyColor.meaning}\n能量：${luckyColor.energy}\n\n来自：命运工坊`,
      `Today's lucky color: ${luckyColor.nameEn ?? luckyColor.name}\nColor code: ${luckyColor.hex}\nMeaning: ${luckyColor.meaningEn ?? luckyColor.meaning}\nEnergy: ${luckyColor.energyEn ?? luckyColor.energy}\n\nFrom: Fate Atelier`,
    )
    if (navigator.share) {
      try {
        await navigator.share({ title: txStatic('每日幸运色', 'Daily Lucky Color'), text: shareText })
        return
      } catch {
        // fall through
      }
    }
    await copyToClipboard(shareText, 'share')
    toast.success(txStatic('已复制分享内容', 'Share content copied'))
  }, [luckyColor, copyToClipboard])

  const handleCalendarTypeChange = useCallback((v: CalendarType) => {
    setCalendarType(v)
    if (v === 'solar') setIsLunarLeapMonth(false)
  }, [])

  return {
    today,
    selectedDate,
    isToday,
    queryYear,
    queryMonth,
    queryDay,
    setQueryField,
    setQueryYear,
    setQueryMonth,
    setQueryDay,
    showPersonalized,
    setShowPersonalized,
    usePersonalized,
    setUsePersonalized,
    calendarType,
    birthYear,
    birthMonth,
    birthDay,
    isLunarLeapMonth,
    setIsLunarLeapMonth,
    zodiacSign,
    setZodiacSign,
    shengxiao,
    setShengxiao,
    showDetails,
    setShowDetails,
    selectedTimeSlot,
    setSelectedTimeSlot,
    copiedHex,
    currentTimeSlot,
    personalizedResult,
    luckyColor,
    secondaryColor,
    displayHex,
    ritualStep,
    resetToToday,
    copyToClipboard,
    shareColor,
    handleBirthFieldChange,
    handleCalendarTypeChange,
    colorDatabase: COLOR_DATABASE,
  }
}
