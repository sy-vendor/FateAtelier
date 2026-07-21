import { BAGUA, DIRECTIONS } from './fengshuiData'
import { isEnglishLocale } from '../i18n/locale'

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const TIANGAN_WUXING: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
}

const DIZHI_WUXING: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
}

function calculateDayPillar(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  return TIANGAN[daysDiff % 10] + DIZHI[daysDiff % 12]
}

export function getTodayAuspiciousDirections(date: Date = new Date()): {
  auspicious: string[]
  inauspicious: string[]
  neutral: string[]
} {
  const dayGanZhi = calculateDayPillar(date)
  const dayGan = dayGanZhi[0]
  const dayZhi = dayGanZhi[1]
  const dayGanWuxing = TIANGAN_WUXING[dayGan] || '土'
  const dayZhiWuxing = DIZHI_WUXING[dayZhi] || '土'
  const todayWuxing = dayGanWuxing
  const isWuxingMatch = dayGanWuxing === dayZhiWuxing

  const wuxingRelations: Record<string, { sheng: string[]; ke: string[]; beiKe: string[] }> = {
    木: { sheng: ['火'], ke: ['土'], beiKe: ['金'] },
    火: { sheng: ['土'], ke: ['金'], beiKe: ['水'] },
    土: { sheng: ['金'], ke: ['水'], beiKe: ['木'] },
    金: { sheng: ['水'], ke: ['木'], beiKe: ['火'] },
    水: { sheng: ['木'], ke: ['火'], beiKe: ['土'] },
  }

  const relations = wuxingRelations[todayWuxing] || { sheng: [], ke: [], beiKe: [] }
  const auspicious: string[] = []
  const inauspicious: string[] = []
  const neutral: string[] = []

  DIRECTIONS.forEach((dir) => {
    if (isWuxingMatch) {
      if (dir.wuxing === todayWuxing) auspicious.push(dir.name)
      else if (relations.beiKe.includes(dir.wuxing)) inauspicious.push(dir.name)
      else neutral.push(dir.name)
    } else {
      if (dir.wuxing === todayWuxing || relations.sheng.includes(dir.wuxing)) {
        auspicious.push(dir.name)
      } else if (relations.beiKe.includes(dir.wuxing)) {
        inauspicious.push(dir.name)
      } else {
        neutral.push(dir.name)
      }
    }
  })

  return { auspicious, inauspicious, neutral }
}

export function getDirectionInterpretation(directionName: string, date: Date = new Date()) {
  const direction = DIRECTIONS.find((d) => d.name === directionName)
  if (!direction) return null

  const { auspicious, inauspicious } = getTodayAuspiciousDirections(date)
  const isAuspicious = auspicious.includes(directionName)
  const isInauspicious = inauspicious.includes(directionName)
  const gua = BAGUA[direction.symbol as keyof typeof BAGUA]
  const en = isEnglishLocale()
  const dirLabel = en ? direction.nameEn : direction.name
  const symbol = en ? direction.symbolEn : direction.symbol
  const wuxing = en ? direction.wuxingEn : direction.wuxing

  return {
    direction: dirLabel,
    directionKey: directionName,
    symbol,
    wuxing,
    color: direction.color,
    guaInfo: gua
      ? {
          ...gua,
          name: en ? gua.nameEn : gua.name,
          nature: en ? gua.natureEn : gua.nature,
          meaning: en ? gua.meaningEn : gua.meaning,
          wuxing: en ? gua.wuxingEn : gua.wuxing,
          auspicious: en ? [...gua.auspiciousEn] : [...gua.auspicious],
        }
      : undefined,
    auspicious: isAuspicious,
    inauspicious: isInauspicious,
    neutral: !isAuspicious && !isInauspicious,
    suitableFor: gua ? (en ? [...gua.auspiciousEn] : [...gua.auspicious]) : [],
    meaning: gua ? (en ? gua.meaningEn : gua.meaning) : '',
    advice: isAuspicious
      ? en
        ? `${dirLabel} is auspicious today — a good time for important plans.`
        : `今日${dirLabel}方位为吉方，适合进行重要活动。`
      : isInauspicious
        ? en
          ? `${dirLabel} is inauspicious today — proceed with care.`
          : `今日${dirLabel}方位为凶方，宜谨慎行事。`
        : en
          ? `${dirLabel} is neutral today — fine for ordinary use.`
          : `今日${dirLabel}方位为平方，可正常使用。`,
  }
}

export function recommendDirectionForPurpose(purpose: string): string[] {
  const purposeMap: Record<string, string[]> = {
    事业: ['正东', '正南', '西北'],
    财运: ['正西', '西南', '东北'],
    学业: ['正东', '东南'],
    健康: ['正北', '东北'],
    感情: ['正南', '西南'],
    搬家: ['正东', '正南', '正西'],
    开业: ['正东', '正南', '东南'],
    出行: ['正东', '正南', '东南'],
  }
  return purposeMap[purpose] || ['正东', '正南', '正西', '正北']
}

// Re-exports for backward compatibility
export { DIRECTIONS as directions, BAGUA as bagua }
