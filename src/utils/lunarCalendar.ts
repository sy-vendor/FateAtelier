// 农历数据表（1900-2100年）
export const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520,
  0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0,
  0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6,
  0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0,
  0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0,
  0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4,
  0x0a2d0, 0x0d150, 0x0f252
]

/**
 * 获取闰月
 * @param year 年份（1900-2100）
 * @returns 闰月月份，0表示无闰月
 */
export function getLeapMonth(year: number): number {
  const idx = year - 1900
  if (idx < 0 || idx >= lunarInfo.length) return 0
  const info = lunarInfo[idx]
  return info & 0xf
}

/**
 * 获取农历某月的天数
 * @param year 年份
 * @param month 月份（1-12为平月，13-24为闰月）
 * @returns 该月的天数（29或30）
 */
export function getLunarMonthDays(year: number, month: number): number {
  const idx = year - 1900
  if (idx < 0 || idx >= lunarInfo.length) return 0
  const info = lunarInfo[idx]
  const lm = getLeapMonth(year)
  if (month > 12) {
    const base = month - 12
    if (base !== lm) return 0
    return (info & (0x10000 >> base)) ? 30 : 29
  }
  return (info & (0x10000 >> month)) ? 30 : 29
}

/**
 * 获取农历年的总天数
 * @param year 年份
 * @returns 该年的总天数
 */
export function getLunarYearDays(year: number): number {
  const idx = year - 1900
  if (idx < 0 || idx >= lunarInfo.length) return 0
  let sum = 0
  for (let m = 1; m <= 12; m++) {
    sum += getLunarMonthDays(year, m)
  }
  const lm = getLeapMonth(year)
  if (lm) {
    sum += getLunarMonthDays(year, lm + 12)
  }
  return sum
}

/**
 * 农历转阳历
 * @param lunarYear 农历年
 * @param lunarMonth 农历月（1-12为平月，>12为闰月，如13表示闰正月）
 * @param lunarDay 农历日
 * @returns 对应的阳历日期，转换失败返回null
 */
export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number): Date | null {
  // 参数验证
  if (lunarYear < 1900 || lunarYear > 2100) {
    return null
  }
  
  const yearIndex = lunarYear - 1900
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) {
    return null
  }
  
  const leapMonth = getLeapMonth(lunarYear)
  
  // 处理闰月标记：>12 表示闰某月
  const isLeapMonth = lunarMonth > 12
  const baseMonth = isLeapMonth ? lunarMonth - 12 : lunarMonth

  // 月份有效性
  if (baseMonth < 1 || baseMonth > 12) {
    return null
  }
  // 如果指明闰月，但该年没有该闰月，则无效
  if (isLeapMonth && baseMonth !== leapMonth) {
    return null
  }
  
  // 检查日期是否有效
  const monthDays = getLunarMonthDays(lunarYear, lunarMonth) // 支持 >12（闰月）
  if (lunarDay < 1 || lunarDay > monthDays) {
    return null
  }
  
  // 计算从1900年1月31日（农历正月初一）到目标日期的总天数
  let totalDays = 0
  
  // 1900年1月31日是农历正月初一对应的阳历日期
  const baseDate = new Date(1900, 0, 31)
  
  // 计算从1900年到目标年份的总天数
  for (let y = 1900; y < lunarYear; y++) {
    totalDays += getLunarYearDays(y)
  }
  
  // 计算目标年份从正月到目标月份的天数
  // 需要考虑闰月的位置（闰月在该月之后）
  for (let m = 1; m < baseMonth; m++) {
    totalDays += getLunarMonthDays(lunarYear, m) // 平月
    // 若该年此月之后有闰月（即本月是闰月的前一个月），则额外叠加闰月天数
    if (leapMonth > 0 && m === leapMonth) {
      totalDays += getLunarMonthDays(lunarYear, leapMonth + 12)
    }
  }
  // 如果目标就是闰月，则需要再累加该月的平月天数（闰月发生在该平月之后）
  if (isLeapMonth) totalDays += getLunarMonthDays(lunarYear, baseMonth)
  
  // 加上目标日期
  totalDays += lunarDay - 1
  
  // 计算对应的阳历日期
  const solarDate = new Date(baseDate)
  solarDate.setDate(solarDate.getDate() + totalDays)
  
  return solarDate
}

/**
 * 精确计算节气的日期
 * @param year 年份
 * @param termIndex 节气索引（0=立春, 1=雨水, ..., 11=大寒）
 * @returns 节气日期
 */
export function getSolarTermDate(year: number, termIndex: number): Date {
  const solarLongitude = [315, 330, 345, 0, 15, 30, 45, 60, 75, 90, 105, 120]
  const targetLongitude = solarLongitude[termIndex]
  const springEquinox = new Date(year, 2, 20)
  const daysFromEquinox = (targetLongitude - 0 + 360) % 360
  const days = Math.round(daysFromEquinox * 365.2422 / 360)
  const termDate = new Date(springEquinox)
  termDate.setDate(termDate.getDate() + days)
  return termDate
}

/**
 * 计算立春日期
 * @param year 年份
 * @returns 立春日期
 */
export function getLichunDate(year: number): Date {
  return getSolarTermDate(year, 0)
}

