import { tiangan, dizhi, tianganWuxing, dizhiWuxing } from './constants'
import { getSolarTermDate, getLichunDate } from './lunarCalendar'

/**
 * 计算年柱（根据立春分界）
 * @param date 日期
 * @returns 年柱（天干+地支）
 */
export function calculateYearPillar(date: Date): string {
  const year = date.getFullYear()
  const lichun = getLichunDate(year)
  
  let actualYear = year
  if (date < lichun) {
    actualYear = year - 1
  }
  
  const ganIndex = (actualYear - 4) % 10
  const zhiIndex = (actualYear - 4) % 12
  return tiangan[ganIndex] + dizhi[zhiIndex]
}

/**
 * 精确计算节气对应的月份
 * @param year 年份
 * @param month 月份（1-12）
 * @param day 日期
 * @returns 节气月（1-12，立春为正月）
 */
export function getJieqiMonth(year: number, month: number, day: number): number {
  const currentDate = new Date(year, month - 1, day)
  
  let actualYear = year
  const lichunThisYear = getSolarTermDate(year, 0)
  if (currentDate < lichunThisYear) {
    actualYear = year - 1
  }
  
  const solarTerms: Date[] = []
  for (let i = 0; i < 12; i++) {
    solarTerms.push(getSolarTermDate(actualYear, i))
  }
  solarTerms.push(getSolarTermDate(actualYear + 1, 0))
  
  for (let i = 0; i < 12; i++) {
    if (currentDate >= solarTerms[i] && currentDate < solarTerms[i + 1]) {
      return i + 1
    }
  }
  
  return 12
}

/**
 * 计算月柱
 * @param date 日期
 * @param yearPillar 年柱
 * @returns 月柱（天干+地支）
 */
export function calculateMonthPillar(date: Date, yearPillar: string): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const jieqiMonth = getJieqiMonth(year, month, day)
  const monthZhiIndex = (jieqiMonth + 1) % 12
  const monthZhi = dizhi[monthZhiIndex]
  
  const yearGan = yearPillar[0]
  const yearGanIndex = tiangan.indexOf(yearGan)
  
  let monthGanIndex = 0
  if (yearGanIndex === 0 || yearGanIndex === 5) {
    monthGanIndex = (2 + jieqiMonth - 1) % 10
  } else if (yearGanIndex === 1 || yearGanIndex === 6) {
    monthGanIndex = (4 + jieqiMonth - 1) % 10
  } else if (yearGanIndex === 2 || yearGanIndex === 7) {
    monthGanIndex = (6 + jieqiMonth - 1) % 10
  } else if (yearGanIndex === 3 || yearGanIndex === 8) {
    monthGanIndex = (8 + jieqiMonth - 1) % 10
  } else {
    monthGanIndex = (0 + jieqiMonth - 1) % 10
  }
  
  const monthGan = tiangan[monthGanIndex]
  return monthGan + monthZhi
}

/**
 * 计算日柱
 * @param date 日期
 * @returns 日柱（天干+地支）
 */
export function calculateDayPillar(date: Date): string {
  const baseDate = new Date(1900, 0, 1)
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  const ganIndex = (daysDiff + 6) % 10
  const zhiIndex = (daysDiff + 8) % 12
  return tiangan[ganIndex] + dizhi[zhiIndex]
}

/**
 * 计算时柱
 * @param dayPillar 日柱
 * @param hour 小时（0-23）
 * @returns 时柱（天干+地支），无效返回null
 */
export function calculateHourPillar(dayPillar: string, hour: number): string | null {
  if (hour < 0 || hour >= 24) return null
  
  // 时辰对应地支（23-1子时，1-3丑时，...）
  const shichenIndex = Math.floor((hour + 1) / 2) % 12
  const shichenZhi = dizhi[shichenIndex]
  
  // 根据日干推算时干（五鼠遁）
  const dayGan = dayPillar[0]
  const dayGanIndex = tiangan.indexOf(dayGan)
  
  let shichenGanIndex = 0
  if (dayGanIndex === 0 || dayGanIndex === 5) { // 甲己日
    shichenGanIndex = (0 + shichenIndex) % 10
  } else if (dayGanIndex === 1 || dayGanIndex === 6) { // 乙庚日
    shichenGanIndex = (2 + shichenIndex) % 10
  } else if (dayGanIndex === 2 || dayGanIndex === 7) { // 丙辛日
    shichenGanIndex = (4 + shichenIndex) % 10
  } else if (dayGanIndex === 3 || dayGanIndex === 8) { // 丁壬日
    shichenGanIndex = (6 + shichenIndex) % 10
  } else { // 戊癸日
    shichenGanIndex = (8 + shichenIndex) % 10
  }
  
  const shichenGan = tiangan[shichenGanIndex]
  return shichenGan + shichenZhi
}

/**
 * 分析五行（从八字）
 * @param bazi 八字数组 [年柱, 月柱, 日柱, 时柱]
 * @returns 五行统计
 */
export function analyzeWuxingFromBazi(bazi: string[]): { [key: string]: number } {
  const wuxingCount: { [key: string]: number } = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  
  bazi.forEach(pillar => {
    if (pillar.length >= 2) {
      const gan = pillar[0]
      const zhi = pillar[1]
      if (tianganWuxing[gan]) wuxingCount[tianganWuxing[gan]]++
      if (dizhiWuxing[zhi]) wuxingCount[dizhiWuxing[zhi]]++
    }
  })
  
  return wuxingCount
}

