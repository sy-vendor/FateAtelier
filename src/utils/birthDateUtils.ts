import { lunarToSolar, solarToLunar } from './lunarCalendar'

export type CalendarType = 'solar' | 'lunar'

export interface BirthDateInput {
  calendarType: CalendarType
  solarYear: string
  solarMonth: string
  solarDay: string
  lunarYear: string
  lunarMonth: string
  lunarDay: string
  isLunarLeapMonth: boolean
}

export interface ResolvedBirthDate {
  date: Date
  lunarYear: number
  lunarMonth: number
  lunarDay: number
  isLeapMonth: boolean
}

function digitsOnly(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

export function parseSolarParts(year: string, month: string, day: string): Date | null {
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null
  if (m < 1 || m > 12 || d < 1 || d > 31) return null
  const date = new Date(y, m - 1, d)
  if (isNaN(date.getTime())) return null
  return date
}

export function resolveBirthDate(input: BirthDateInput): ResolvedBirthDate | { error: string } {
  if (input.calendarType === 'solar') {
    const date = parseSolarParts(input.solarYear, input.solarMonth, input.solarDay)
    if (!date) return { error: '请输入有效的阳历日期' }
    const lunar = solarToLunar(date)
    if (!lunar) return { error: '阳历转农历失败，请检查日期（支持1900-2100年）' }
    return {
      date,
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      isLeapMonth: lunar.isLeapMonth,
    }
  }

  const year = parseInt(input.lunarYear, 10)
  const month = parseInt(input.lunarMonth, 10)
  const day = parseInt(input.lunarDay, 10)
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return { error: '请完整输入农历日期' }
  }
  if (year < 1900 || year > 2100) {
    return { error: '请输入1900-2100年之间的日期' }
  }

  const lunarMonthParam = input.isLunarLeapMonth ? month + 12 : month
  const date = lunarToSolar(year, lunarMonthParam, day)
  if (!date) return { error: '农历日期转换失败，请检查日期或闰月是否正确' }

  return {
    date,
    lunarYear: year,
    lunarMonth: month,
    lunarDay: day,
    isLeapMonth: input.isLunarLeapMonth,
  }
}

export { digitsOnly }
