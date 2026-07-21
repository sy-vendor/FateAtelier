export const FENGSHUI_BRAND = '罗盘玄枢'
export const FENGSHUI_BRAND_EN = 'Compass Pivot'

export const FENGSHUI_PURPOSES = ['事业', '财运', '学业', '健康', '感情', '搬家', '开业', '出行'] as const

export type FengshuiPurpose = (typeof FENGSHUI_PURPOSES)[number]

export interface DirectionInfo {
  name: string
  nameEn: string
  angle: number
  symbol: string
  symbolEn: string
  wuxing: string
  wuxingEn: string
  color: string
}

export const DIRECTIONS: DirectionInfo[] = [
  { name: '正东', nameEn: 'East', angle: 90, symbol: '震', symbolEn: 'Zhen', wuxing: '木', wuxingEn: 'Wood', color: '#4CAF50' },
  { name: '东南', nameEn: 'Southeast', angle: 135, symbol: '巽', symbolEn: 'Xun', wuxing: '木', wuxingEn: 'Wood', color: '#8BC34A' },
  { name: '正南', nameEn: 'South', angle: 180, symbol: '离', symbolEn: 'Li', wuxing: '火', wuxingEn: 'Fire', color: '#F44336' },
  { name: '西南', nameEn: 'Southwest', angle: 225, symbol: '坤', symbolEn: 'Kun', wuxing: '土', wuxingEn: 'Earth', color: '#FF9800' },
  { name: '正西', nameEn: 'West', angle: 270, symbol: '兑', symbolEn: 'Dui', wuxing: '金', wuxingEn: 'Metal', color: '#FFC107' },
  { name: '西北', nameEn: 'Northwest', angle: 315, symbol: '乾', symbolEn: 'Qian', wuxing: '金', wuxingEn: 'Metal', color: '#FF9800' },
  { name: '正北', nameEn: 'North', angle: 0, symbol: '坎', symbolEn: 'Kan', wuxing: '水', wuxingEn: 'Water', color: '#2196F3' },
  { name: '东北', nameEn: 'Northeast', angle: 45, symbol: '艮', symbolEn: 'Gen', wuxing: '土', wuxingEn: 'Earth', color: '#9E9E9E' },
]

export const DIRECTION_NAME_EN: Record<string, string> = Object.fromEntries(
  DIRECTIONS.map((d) => [d.name, d.nameEn]),
)

export const WUXING_EN: Record<string, string> = {
  木: 'Wood',
  火: 'Fire',
  土: 'Earth',
  金: 'Metal',
  水: 'Water',
}

export const BAGUA = {
  乾: {
    name: '乾',
    nameEn: 'Qian',
    nature: '天',
    natureEn: 'Heaven',
    wuxing: '金',
    wuxingEn: 'Metal',
    meaning: '天、父、刚健',
    meaningEn: 'Heaven, father, strength',
    auspicious: ['事业', '权威', '领导'],
    auspiciousEn: ['Career', 'Authority', 'Leadership'],
  },
  坤: {
    name: '坤',
    nameEn: 'Kun',
    nature: '地',
    natureEn: 'Earth',
    wuxing: '土',
    wuxingEn: 'Earth',
    meaning: '地、母、柔顺',
    meaningEn: 'Earth, mother, receptivity',
    auspicious: ['家庭', '稳定', '包容'],
    auspiciousEn: ['Family', 'Stability', 'Nurture'],
  },
  震: {
    name: '震',
    nameEn: 'Zhen',
    nature: '雷',
    natureEn: 'Thunder',
    wuxing: '木',
    wuxingEn: 'Wood',
    meaning: '雷、动、奋发',
    meaningEn: 'Thunder, movement, initiative',
    auspicious: ['行动', '创新', '突破'],
    auspiciousEn: ['Action', 'Innovation', 'Breakthrough'],
  },
  巽: {
    name: '巽',
    nameEn: 'Xun',
    nature: '风',
    natureEn: 'Wind',
    wuxing: '木',
    wuxingEn: 'Wood',
    meaning: '风、入、柔顺',
    meaningEn: 'Wind, entry, flexibility',
    auspicious: ['沟通', '学习', '灵活'],
    auspiciousEn: ['Communication', 'Learning', 'Adaptability'],
  },
  坎: {
    name: '坎',
    nameEn: 'Kan',
    nature: '水',
    natureEn: 'Water',
    wuxing: '水',
    wuxingEn: 'Water',
    meaning: '水、险、智慧',
    meaningEn: 'Water, depth, wisdom',
    auspicious: ['智慧', '流动', '变化'],
    auspiciousEn: ['Wisdom', 'Flow', 'Change'],
  },
  离: {
    name: '离',
    nameEn: 'Li',
    nature: '火',
    natureEn: 'Fire',
    wuxing: '火',
    wuxingEn: 'Fire',
    meaning: '火、明、光明',
    meaningEn: 'Fire, clarity, brightness',
    auspicious: ['名声', '热情', '光明'],
    auspiciousEn: ['Recognition', 'Passion', 'Clarity'],
  },
  艮: {
    name: '艮',
    nameEn: 'Gen',
    nature: '山',
    natureEn: 'Mountain',
    wuxing: '土',
    wuxingEn: 'Earth',
    meaning: '山、止、稳重',
    meaningEn: 'Mountain, stillness, steadiness',
    auspicious: ['稳定', '积累', '守成'],
    auspiciousEn: ['Stability', 'Accumulation', 'Preservation'],
  },
  兑: {
    name: '兑',
    nameEn: 'Dui',
    nature: '泽',
    natureEn: 'Lake',
    wuxing: '金',
    wuxingEn: 'Metal',
    meaning: '泽、悦、喜悦',
    meaningEn: 'Lake, joy, exchange',
    auspicious: ['喜悦', '交流', '收获'],
    auspiciousEn: ['Joy', 'Exchange', 'Harvest'],
  },
} as const

export type FengshuiPhase = 'purpose' | 'rotate' | 'select' | 'insight'

export const FENGSHUI_PHASE_STEP: Record<FengshuiPhase, 1 | 2 | 3 | 4> = {
  purpose: 1,
  rotate: 2,
  select: 3,
  insight: 4,
}

export function directionLabel(name: string, english: boolean): string {
  return english ? DIRECTION_NAME_EN[name] ?? name : name
}

export function listJoin(items: string[], english: boolean): string {
  return items.join(english ? ', ' : '、')
}
