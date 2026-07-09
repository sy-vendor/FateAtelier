export const FENGSHUI_BRAND = '罗盘玄枢'
export const FENGSHUI_BRAND_EN = 'Compass Pivot'

export const FENGSHUI_PURPOSES = ['事业', '财运', '学业', '健康', '感情', '搬家', '开业', '出行'] as const

export type FengshuiPurpose = (typeof FENGSHUI_PURPOSES)[number]

export interface DirectionInfo {
  name: string
  angle: number
  symbol: string
  wuxing: string
  color: string
}

export const DIRECTIONS: DirectionInfo[] = [
  { name: '正东', angle: 90, symbol: '震', wuxing: '木', color: '#4CAF50' },
  { name: '东南', angle: 135, symbol: '巽', wuxing: '木', color: '#8BC34A' },
  { name: '正南', angle: 180, symbol: '离', wuxing: '火', color: '#F44336' },
  { name: '西南', angle: 225, symbol: '坤', wuxing: '土', color: '#FF9800' },
  { name: '正西', angle: 270, symbol: '兑', wuxing: '金', color: '#FFC107' },
  { name: '西北', angle: 315, symbol: '乾', wuxing: '金', color: '#FF9800' },
  { name: '正北', angle: 0, symbol: '坎', wuxing: '水', color: '#2196F3' },
  { name: '东北', angle: 45, symbol: '艮', wuxing: '土', color: '#9E9E9E' },
]

export const BAGUA = {
  乾: { name: '乾', nature: '天', wuxing: '金', meaning: '天、父、刚健', auspicious: ['事业', '权威', '领导'] },
  坤: { name: '坤', nature: '地', wuxing: '土', meaning: '地、母、柔顺', auspicious: ['家庭', '稳定', '包容'] },
  震: { name: '震', nature: '雷', wuxing: '木', meaning: '雷、动、奋发', auspicious: ['行动', '创新', '突破'] },
  巽: { name: '巽', nature: '风', wuxing: '木', meaning: '风、入、柔顺', auspicious: ['沟通', '学习', '灵活'] },
  坎: { name: '坎', nature: '水', wuxing: '水', meaning: '水、险、智慧', auspicious: ['智慧', '流动', '变化'] },
  离: { name: '离', nature: '火', wuxing: '火', meaning: '火、明、光明', auspicious: ['名声', '热情', '光明'] },
  艮: { name: '艮', nature: '山', wuxing: '土', meaning: '山、止、稳重', auspicious: ['稳定', '积累', '守成'] },
  兑: { name: '兑', nature: '泽', wuxing: '金', meaning: '泽、悦、喜悦', auspicious: ['喜悦', '交流', '收获'] },
} as const

export type FengshuiPhase = 'purpose' | 'rotate' | 'select' | 'insight'

export const FENGSHUI_PHASE_STEP: Record<FengshuiPhase, 1 | 2 | 3 | 4> = {
  purpose: 1,
  rotate: 2,
  select: 3,
  insight: 4,
}
