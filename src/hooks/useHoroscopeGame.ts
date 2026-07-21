import { useCallback, useMemo, useState } from 'react'
import { toast } from '../utils/toast'
import { digitsOnly, type CalendarType } from '../utils/birthDateUtils'
import { lunarToSolar } from '../utils/lunarCalendar'
import {
  ZODIAC_SIGNS,
  type HoroscopePeriod,
} from '../utils/horoscopeData'
import {
  analyzeZodiacPairing,
  generateHoroscope,
  getHoroscopeSeed,
  getZodiacSignByDate,
  type PairingResult,
} from '../utils/horoscopeEngine'
import { useLocale } from '../i18n/LocaleContext'

export type BirthQueryResult = {
  signIndex: number
  detail?: string
}

function scrollToHoroscopeReading() {
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('horoscope-reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  })
}

export function useHoroscopeGame() {
  const { isEnglish } = useLocale()
  const today = new Date()
  const [period, setPeriod] = useState<HoroscopePeriod>('today')
  const [signIndex, setSignIndex] = useState(0)
  const [engaged, setEngaged] = useState(false)
  const [calendarType, setCalendarType] = useState<CalendarType>('solar')
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [showBirthInput, setShowBirthInput] = useState(false)
  const [isLunarLeapMonth, setIsLunarLeapMonth] = useState(false)
  const [birthQueryResult, setBirthQueryResult] = useState<BirthQueryResult | null>(null)
  const [birthQueryError, setBirthQueryError] = useState<string | null>(null)
  const [showPairing, setShowPairing] = useState(false)
  const [pairingSign1, setPairingSign1] = useState<number | null>(null)
  const [pairingSign2, setPairingSign2] = useState<number | null>(null)
  const [pairingResult, setPairingResult] = useState<PairingResult | null>(null)

  const sign = ZODIAC_SIGNS[signIndex]

  const result = useMemo(() => {
    const seed = getHoroscopeSeed(today, signIndex, period)
    return generateHoroscope(seed, sign.element)
  }, [today, signIndex, period, sign.element])

  const ritualStep = useMemo((): 1 | 2 | 3 | 4 => {
    if (pairingResult) return 4
    if (showPairing || engaged) return 3
    return 1
  }, [pairingResult, showPairing, engaged])

  const lunarSolarPreview = useMemo(() => {
    if (calendarType !== 'lunar' || !birthYear || !birthMonth || !birthDay) return null

    const year = parseInt(birthYear, 10)
    const month = parseInt(birthMonth, 10)
    const day = parseInt(birthDay, 10)

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null

    const solarDate = lunarToSolar(year, isLunarLeapMonth ? month + 12 : month, day)
    if (!solarDate) return null

    return isEnglish
      ? `Gregorian date: ${solarDate.getFullYear()}-${solarDate.getMonth() + 1}-${solarDate.getDate()}`
      : `对应阳历 ${solarDate.getFullYear()}年${solarDate.getMonth() + 1}月${solarDate.getDate()}日`
  }, [calendarType, birthYear, birthMonth, birthDay, isLunarLeapMonth, isEnglish])

  const clearBirthQueryFeedback = useCallback(() => {
    setBirthQueryResult(null)
    setBirthQueryError(null)
  }, [])

  const handleBirthFieldChange = useCallback(
    (setter: (value: string) => void, value: string, maxLength: number) => {
      setter(digitsOnly(value, maxLength))
      clearBirthQueryFeedback()
    },
    [clearBirthQueryFeedback],
  )

  const handleSignChange = useCallback((id: string) => {
    const idx = ZODIAC_SIGNS.findIndex((z) => z.id === id)
    if (idx >= 0) {
      setSignIndex(idx)
      setEngaged(true)
    }
  }, [])

  const handlePeriodChange = useCallback((v: HoroscopePeriod) => {
    setPeriod(v)
    setEngaged(true)
  }, [])

  const handleCalendarTypeChange = useCallback(
    (v: CalendarType) => {
      setCalendarType(v)
      if (v === 'solar') setIsLunarLeapMonth(false)
      clearBirthQueryFeedback()
    },
    [clearBirthQueryFeedback],
  )

  const handleQueryByBirthday = useCallback(() => {
    setBirthQueryError(null)
    setBirthQueryResult(null)

    if (!birthYear || !birthMonth || !birthDay) {
      setBirthQueryError(isEnglish ? 'Please enter the complete date' : '请完整填写年、月、日')
      return
    }

    const year = parseInt(birthYear, 10)
    const month = parseInt(birthMonth, 10)
    const day = parseInt(birthDay, 10)

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setBirthQueryError(isEnglish ? 'Please enter a valid numeric date' : '请输入有效的数字日期')
      return
    }

    if (year < 1900 || year > 2100) {
      setBirthQueryError(isEnglish ? 'Year must be between 1900 and 2100' : '年份需在 1900–2100 之间')
      return
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      setBirthQueryError(isEnglish ? 'Month or day is out of range' : '月日范围不正确')
      return
    }

    if (calendarType === 'solar') {
      const calculatedSign = getZodiacSignByDate(month, day)
      setSignIndex(calculatedSign)
      setEngaged(true)
      setBirthQueryResult({ signIndex: calculatedSign })
      scrollToHoroscopeReading()
      return
    }

    const lunarMonthParam = isLunarLeapMonth ? month + 12 : month
    const solarDate = lunarToSolar(year, lunarMonthParam, day)
    if (!solarDate) {
      setBirthQueryError(isEnglish ? 'Could not convert the lunar date. Check the date and leap month.' : '农历日期转换失败，请检查日期或闰月是否正确')
      return
    }

    const calculatedSign = getZodiacSignByDate(solarDate.getMonth() + 1, solarDate.getDate())
    const solarMonth = solarDate.getMonth() + 1
    const solarDay = solarDate.getDate()
    setSignIndex(calculatedSign)
    setEngaged(true)
    setBirthQueryResult({
      signIndex: calculatedSign,
      detail: isEnglish
        ? `Lunar ${year}-${month}-${day} → Gregorian ${solarDate.getFullYear()}-${solarMonth}-${solarDay}`
        : `农历 ${year}年${isLunarLeapMonth ? '闰' : ''}${month}月${day}日 → 阳历 ${solarDate.getFullYear()}年${solarMonth}月${solarDay}日`,
    })
    scrollToHoroscopeReading()
  }, [birthYear, birthMonth, birthDay, calendarType, isLunarLeapMonth, isEnglish])

  const runPairing = useCallback(() => {
    if (pairingSign1 !== null && pairingSign2 !== null) {
      setPairingResult(analyzeZodiacPairing(pairingSign1, pairingSign2))
      setEngaged(true)
    } else {
      toast.warning(isEnglish ? 'Please choose two zodiac signs' : '请选择两个星座')
    }
  }, [pairingSign1, pairingSign2, isEnglish])

  return {
    period,
    signIndex,
    sign,
    engaged,
    calendarType,
    birthYear,
    birthMonth,
    birthDay,
    showBirthInput,
    setShowBirthInput,
    isLunarLeapMonth,
    setIsLunarLeapMonth,
    birthQueryResult,
    birthQueryError,
    showPairing,
    setShowPairing,
    pairingSign1,
    setPairingSign1,
    pairingSign2,
    setPairingSign2,
    pairingResult,
    result,
    ritualStep,
    lunarSolarPreview,
    handleBirthFieldChange,
    setBirthYear,
    setBirthMonth,
    setBirthDay,
    handleSignChange,
    handlePeriodChange,
    handleCalendarTypeChange,
    handleQueryByBirthday,
    clearBirthQueryFeedback,
    runPairing,
    scrollToHoroscopeReading,
  }
}
