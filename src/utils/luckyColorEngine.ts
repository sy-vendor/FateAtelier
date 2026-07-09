import { tianganWuxing } from './constants'
import { calculateYearPillar, calculateMonthPillar, calculateDayPillar, analyzeWuxingFromBazi } from './bazi'
import { getZodiacSignByDate } from './horoscopeEngine'
import {
  COLOR_DATABASE,
  ZODIAC_NAMES,
  type ColorInfo,
} from './luckyColorData'

export type { ColorInfo }

export interface PersonalizedColorResult {
  color: ColorInfo
  reason: string
}

export function generateLuckyColor(date: Date): ColorInfo {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const seed = year * 10000 + month * 100 + day
  const colors = Object.keys(COLOR_DATABASE)
  const colorIndex = seed % colors.length

  return COLOR_DATABASE[colors[colorIndex]]
}

export function generatePersonalizedLuckyColor(
  queryDate: Date,
  birthDate?: Date,
  zodiacSign?: number,
  shengxiao?: string,
): PersonalizedColorResult {
  const colors = Object.keys(COLOR_DATABASE)
  const scoreMap: Record<string, number> = {}

  colors.forEach((colorKey) => {
    scoreMap[colorKey] = 0
  })

  const reasons: string[] = []

  const dateSeed =
    queryDate.getFullYear() * 10000 +
    (queryDate.getMonth() + 1) * 100 +
    queryDate.getDate()
  const baseColorIndex = dateSeed % colors.length
  scoreMap[colors[baseColorIndex]] += 30
  reasons.push(
    `根据日期 ${queryDate.getFullYear()}年${queryDate.getMonth() + 1}月${queryDate.getDate()}日`,
  )

  if (shengxiao) {
    const shengxiaoColors: Record<string, string[]> = {
      鼠: ['black', 'silver', 'blue'],
      牛: ['brown', 'yellow', 'green'],
      虎: ['orange', 'red', 'gold'],
      兔: ['pink', 'white', 'green'],
      龙: ['gold', 'yellow', 'red'],
      蛇: ['purple', 'black', 'red'],
      马: ['red', 'orange', 'yellow'],
      羊: ['pink', 'white', 'green'],
      猴: ['gold', 'yellow', 'orange'],
      鸡: ['gold', 'yellow', 'white'],
      狗: ['brown', 'yellow', 'red'],
      猪: ['pink', 'blue', 'green'],
    }

    const luckyColors = shengxiaoColors[shengxiao] || []
    luckyColors.forEach((colorKey) => {
      if (scoreMap[colorKey] !== undefined) {
        scoreMap[colorKey] += 25
      }
    })
    reasons.push(`生肖${shengxiao}的幸运色`)
  }

  if (zodiacSign !== undefined) {
    const zodiacColors: Record<number, string[]> = {
      0: ['red', 'orange'],
      1: ['green', 'brown', 'pink'],
      2: ['yellow', 'silver', 'blue'],
      3: ['silver', 'white', 'blue'],
      4: ['gold', 'orange', 'red'],
      5: ['brown', 'green', 'white'],
      6: ['pink', 'blue', 'green'],
      7: ['black', 'red', 'purple'],
      8: ['purple', 'red', 'orange'],
      9: ['brown', 'black', 'green'],
      10: ['blue', 'silver', 'white'],
      11: ['teal', 'blue', 'purple'],
    }

    const luckyColors = zodiacColors[zodiacSign] || []
    luckyColors.forEach((colorKey) => {
      if (scoreMap[colorKey] !== undefined) {
        scoreMap[colorKey] += 25
      }
    })
    reasons.push(`星座${ZODIAC_NAMES[zodiacSign]}的幸运色`)
  }

  if (birthDate) {
    const yearPillar = calculateYearPillar(birthDate)
    const monthPillar = calculateMonthPillar(birthDate, yearPillar)
    const dayPillar = calculateDayPillar(birthDate)
    const bazi = [yearPillar, monthPillar, dayPillar]

    const wuxingCount = analyzeWuxingFromBazi(bazi)
    const dayGan = dayPillar[0]
    const dayWuxing = tianganWuxing[dayGan] || '土'

    const maxWuxing = Object.entries(wuxingCount).reduce((a, b) =>
      wuxingCount[a[0]] > wuxingCount[b[0]] ? a : b,
    )[0]

    const wuxingColors: Record<string, string[]> = {
      金: ['gold', 'silver', 'white'],
      木: ['green', 'teal', 'brown'],
      水: ['blue', 'teal', 'black'],
      火: ['red', 'orange', 'purple', 'pink'],
      土: ['brown', 'yellow', 'gold'],
    }

    const dominantWuxing = wuxingCount[dayWuxing] >= 2 ? dayWuxing : maxWuxing
    const luckyColors = wuxingColors[dominantWuxing] || []

    luckyColors.forEach((colorKey) => {
      if (scoreMap[colorKey] !== undefined) {
        scoreMap[colorKey] += 20
      }
    })

    reasons.push(`八字五行${dominantWuxing}的幸运色（日主：${dayWuxing}）`)
  }

  let maxScore = 0
  let bestColor = colors[baseColorIndex]

  Object.entries(scoreMap).forEach(([colorKey, score]) => {
    if (score > maxScore) {
      maxScore = score
      bestColor = colorKey
    }
  })

  return {
    color: COLOR_DATABASE[bestColor],
    reason: reasons.join(' + '),
  }
}

export function getSecondaryColor(mainColor: ColorInfo, seedDate: Date): ColorInfo {
  const compatible = mainColor.compatibleColors
  if (compatible.length === 0 || compatible[0] === '所有颜色') {
    const contrastColors = ['white', 'black', 'silver']
    const seed = seedDate.getDate()
    const selected = contrastColors[seed % contrastColors.length]
    return COLOR_DATABASE[selected] || mainColor
  }

  const seed = seedDate.getDate() + 7
  const selectedName = compatible[seed % compatible.length]
  const found = Object.values(COLOR_DATABASE).find((c) => c.name === selectedName)
  return found || mainColor
}

export function getCurrentTimeColor(color: ColorInfo, timeSlot: string): string {
  if (!color.timeSlots) return color.hex
  const slot = color.timeSlots.find((s) => s.time === timeSlot)
  return slot ? slot.hex : color.hex
}

export { getZodiacSignByDate }
