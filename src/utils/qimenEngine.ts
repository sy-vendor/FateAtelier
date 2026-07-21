import { calculateDayPillar, calculateHourPillar } from './bazi'
import { getSolarTermDate } from './lunarCalendar'
import { tiangan, dizhi } from './constants'
import {
  bamen,
  bamenMeanings,
  bashen,
  bashenMeanings,
  jiuxing,
  jiuxingMeanings,
  palacePositions,
  getBamenMeaningEn,
  getJiuxingMeaningEn,
  getBashenMeaningEn,
} from './qimenData'
import { isEnglishLocale } from '../i18n/locale'
import { formatGanZhi } from './ganZhiLabel'

export interface QimenPalace {
  name: string
  direction: string
  bamen: string
  jiuxing: string
  bashen: string
  auspicious: boolean
  score: number
}

export interface QimenPanResult {
  palaces: QimenPalace[]
  overallAnalysis: string
  directionAnalysis: string
  timeAnalysis: string
  yongJu: number
  shiGanZhi: string
}

function getAllSolarTerms(year: number): Date[] {
  const daysPerTerm = 365.2422 / 24
  const lichun = getSolarTermDate(year, 0)
  const allTerms: Date[] = []

  for (let i = 0; i < 24; i++) {
    const termDate = new Date(lichun)
    termDate.setDate(termDate.getDate() + Math.round(i * daysPerTerm))
    allTerms.push(termDate)
  }

  return allTerms
}

function getYongJu(year: number, month: number, day: number): number {
  const currentDate = new Date(year, month - 1, day)
  const thisYearTerms = getAllSolarTerms(year)
  const nextYearTerms = getAllSolarTerms(year + 1)

  let termIndex = -1

  for (let i = 0; i < 24; i++) {
    const termDate = thisYearTerms[i]
    const nextTermDate = i < 23 ? thisYearTerms[i + 1] : nextYearTerms[0]

    if (currentDate >= termDate && currentDate < nextTermDate) {
      termIndex = i
      break
    }
  }

  if (termIndex === -1) {
    const prevYearTerms = getAllSolarTerms(year - 1)
    const dongzhi = prevYearTerms[21]
    const lichun = thisYearTerms[0]

    if (currentDate >= dongzhi && currentDate < lichun) {
      const xiaohan = prevYearTerms[22]
      const dahan = prevYearTerms[23]

      if (currentDate >= dongzhi && currentDate < xiaohan) {
        termIndex = 21
      } else if (currentDate >= xiaohan && currentDate < dahan) {
        termIndex = 22
      } else {
        termIndex = 23
      }
    }
  }

  if (termIndex === -1) return 1

  let ju = 1

  if (termIndex >= 21 || termIndex < 9) {
    if (termIndex === 21 || termIndex === 22) ju = 1
    else if (termIndex === 23 || termIndex === 0) ju = 3
    else if (termIndex === 1 || termIndex === 2) ju = 9
    else if (termIndex === 3 || termIndex === 4) ju = 3
    else if (termIndex === 5 || termIndex === 6) ju = 4
    else if (termIndex === 7 || termIndex === 8) ju = 5
  } else {
    if (termIndex === 9 || termIndex === 10) ju = 9
    else if (termIndex === 11 || termIndex === 12) ju = 3
    else if (termIndex >= 13 && termIndex <= 20) ju = 6
  }

  return ju
}

function getZhiFu(shiGan: string): number {
  const ganIndex = tiangan.indexOf(shiGan)
  const zhiFuMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0]
  return zhiFuMap[ganIndex]
}

function getZhiShi(shiGan: string): number {
  const ganIndex = tiangan.indexOf(shiGan)
  const zhiShiMap = [0, 1, 2, 3, 5, 6, 7, 8, 0, 1]
  return zhiShiMap[ganIndex]
}

function placeJiuxing(yongJu: number, zhiFu: number, shiZhi: string): string[] {
  const result: string[] = new Array(9).fill('')
  result[4] = jiuxing[4]

  const traditionalToCode: Record<number, number> = {
    1: 7,
    2: 2,
    3: 3,
    4: 0,
    5: 4,
    6: 6,
    7: 5,
    8: 8,
    9: 1,
  }

  const isYangDun = yongJu <= 6
  const shiZhiIndex = dizhi.indexOf(shiZhi)
  const zhiToTraditionalPalace = [1, 8, 3, 3, 4, 9, 9, 2, 7, 7, 6, 1]
  const shiGanTraditionalPalace = zhiToTraditionalPalace[shiZhiIndex]
  const shiGanPalace = traditionalToCode[shiGanTraditionalPalace]

  if (shiGanPalace !== 4) {
    result[shiGanPalace] = jiuxing[zhiFu]
  }

  let starIdx = 0

  for (let i = 0; i < 9; i++) {
    if (i === 4) continue

    let targetPalace = 0
    if (isYangDun) {
      targetPalace = (shiGanPalace + i) % 9
      if (targetPalace === 4) targetPalace = (targetPalace + 1) % 9
    } else {
      targetPalace = (shiGanPalace - i + 9) % 9
      if (targetPalace === 4) targetPalace = (targetPalace - 1 + 9) % 9
    }

    if (result[targetPalace]) continue

    while (starIdx === zhiFu || starIdx === 4) {
      starIdx = (starIdx + 1) % 9
    }

    result[targetPalace] = jiuxing[starIdx]
    starIdx = (starIdx + 1) % 9
  }

  return result
}

function placeBamen(zhiShi: number, shiZhi: string): string[] {
  const positions: string[] = new Array(9).fill('')
  positions[4] = ''

  const shiZhiIndex = dizhi.indexOf(shiZhi)
  const zhiToPalace = [1, 8, 3, 3, 0, 4, 4, 2, 6, 6, 7, 1]
  const zhiShiPalace = zhiToPalace[shiZhiIndex]
  const menOrder = [0, 1, 2, 3, 5, 6, 7, 8]

  if (zhiShiPalace !== 4) {
    positions[zhiShiPalace] = bamen[zhiShi]
  }

  let menIdx = 0
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue
    if (positions[i]) continue

    while (menOrder[menIdx] === zhiShi || menOrder[menIdx] === 4) {
      menIdx = (menIdx + 1) % 8
    }
    positions[i] = bamen[menOrder[menIdx]]
    menIdx = (menIdx + 1) % 8
  }

  return positions
}

function placeBashen(zhiFuStarPalace: number): string[] {
  const positions: string[] = new Array(9).fill('')

  if (zhiFuStarPalace === 4) {
    positions[4] = bashen[0]
  } else {
    positions[zhiFuStarPalace] = bashen[0]
    positions[4] = bashen[0]
  }

  let startPalace = zhiFuStarPalace
  if (startPalace === 4) startPalace = 7

  const clockwiseOrder = [7, 8, 0, 1, 2, 3, 5, 6]
  let startIdx = clockwiseOrder.indexOf(startPalace)
  if (startIdx === -1) startIdx = 0

  let shenIdx = 0
  for (let i = 0; i < 8; i++) {
    const palaceIdx = clockwiseOrder[(startIdx + i) % 8]
    if (palaceIdx === 4) continue

    if (positions[palaceIdx] === bashen[0]) {
      shenIdx = (shenIdx + 1) % 8
      continue
    }

    positions[palaceIdx] = bashen[shenIdx]
    shenIdx = (shenIdx + 1) % 8
  }

  return positions
}

export function calculateQimenPan(
  year: number,
  month: number,
  day: number,
  hour: number,
  direction: string,
): QimenPanResult {
  const isEnglish = isEnglishLocale()
  const date = new Date(year, month - 1, day, hour)
  const dayPillar = calculateDayPillar(date)
  const hourPillar = calculateHourPillar(dayPillar, hour)

  if (!hourPillar) {
    throw new Error(`无法计算时干支：hour=${hour}`)
  }

  const shiGanZhi = hourPillar
  const shiGan = shiGanZhi[0]
  const shiZhi = shiGanZhi[1]
  const yongJu = getYongJu(year, month, day)
  const zhiFu = getZhiFu(shiGan)
  const zhiShi = getZhiShi(shiGan)
  const jiuxingPositions = placeJiuxing(yongJu, zhiFu, shiZhi)

  let zhiFuStarPalace = 4
  for (let i = 0; i < 9; i++) {
    if (jiuxingPositions[i] === jiuxing[zhiFu]) {
      zhiFuStarPalace = i
      break
    }
  }

  const bamenPositions = placeBamen(zhiShi, shiZhi)
  const bashenPositions = placeBashen(zhiFuStarPalace)

  const palaces = palacePositions.map((pos, index) => {
    const bamenName = bamenPositions[index]
    const jiuxingName = jiuxingPositions[index]
    const bashenName = bashenPositions[index]

    let score = 50
    if (bamenName && bamenMeanings[bamenName]) {
      score += bamenMeanings[bamenName].auspicious ? 15 : -15
    }
    if (jiuxingMeanings[jiuxingName]) {
      score += jiuxingMeanings[jiuxingName].auspicious ? 15 : -15
    }
    if (bashenMeanings[bashenName]) {
      score += bashenMeanings[bashenName].auspicious ? 10 : -10
    }
    if (pos.direction === direction) score += 20

    const auspicious = score >= 60

    return {
      name: pos.name,
      direction: pos.direction,
      bamen: bamenName,
      jiuxing: jiuxingName,
      bashen: bashenName,
      auspicious,
      score: Math.max(0, Math.min(100, score)),
    }
  })

  const targetPalace = palaces.find((p) => p.direction === direction) || palaces[4]
  const directionEn: Record<string, string> = { 东: 'East', 东南: 'Southeast', 南: 'South', 西南: 'Southwest', 西: 'West', 西北: 'Northwest', 北: 'North', 东北: 'Northeast', 中: 'Center' }
  const directionName = directionEn[direction] ?? direction
  const directionAnalysis = isEnglish
    ? `${directionName} is ${targetPalace.auspicious ? 'auspicious' : 'inauspicious'}: ${targetPalace.bamen ? `${getBamenMeaningEn(targetPalace.bamen)} at the gate, ` : ''}${getJiuxingMeaningEn(targetPalace.jiuxing)} at the star, and ${getBashenMeaningEn(targetPalace.bashen)} in support. ${targetPalace.auspicious ? `Movement toward ${directionName} is favored.` : `Avoid movement toward ${directionName} if possible.`}`
    : targetPalace.auspicious
      ? `${direction}方位为吉，${targetPalace.bamen ? `遇${targetPalace.bamen}，` : ''}${targetPalace.jiuxing}临，${targetPalace.bashen}护，适合${direction}方行动。`
      : `${direction}方位为凶，${targetPalace.bamen ? `遇${targetPalace.bamen}，` : ''}${targetPalace.jiuxing}临，${targetPalace.bashen}现，不宜${direction}方行动。`

  const timeAnalysis = isEnglish
    ? `Hour pillar: ${formatGanZhi(shiGanZhi, true)}; formation: ${yongJu}. This hour is ${targetPalace.auspicious ? 'auspicious' : 'inauspicious'}: ${targetPalace.bamen ? `${getBamenMeaningEn(targetPalace.bamen)} at the gate; ` : ''}${getJiuxingMeaningEn(targetPalace.jiuxing)} at the star; ${getBashenMeaningEn(targetPalace.bashen)} in the spirit.`
    : `时干支：${shiGanZhi}，用局：${yongJu}局。此时${targetPalace.auspicious ? '吉' : '凶'}，${targetPalace.bamen ? `${targetPalace.bamen}主${bamenMeanings[targetPalace.bamen]?.meaning}，` : ''}${targetPalace.jiuxing}主${jiuxingMeanings[targetPalace.jiuxing]?.meaning}，${targetPalace.bashen}主${bashenMeanings[targetPalace.bashen]?.meaning}。`

  const auspiciousCount = palaces.filter((p) => p.auspicious).length
  const overallAnalysis = isEnglish
    ? `Current chart: ${auspiciousCount} auspicious palaces and ${9 - auspiciousCount} inauspicious palaces. The overall trend ${targetPalace.auspicious ? 'is favorable; seize the opportunity.' : 'calls for caution; proceed conservatively.'}`
    : `当前盘面：${auspiciousCount}宫为吉，${9 - auspiciousCount}宫为凶。${targetPalace.auspicious ? '整体趋势向好' : '整体趋势需谨慎'}，建议${targetPalace.auspicious ? '把握时机' : '保守行事'}。`

  return {
    palaces,
    overallAnalysis,
    directionAnalysis,
    timeAnalysis,
    yongJu,
    shiGanZhi,
  }
}
