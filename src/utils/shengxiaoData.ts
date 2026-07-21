export const SHENGXIAO_BRAND = '生肖缘谱'
export const SHENGXIAO_BRAND_EN = 'Zodiac Bond'

export const SHENGXIAO_LIST = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] as const

export const SHENGXIAO_EN: Record<string, string> = {
  鼠: 'Rat', 牛: 'Ox', 虎: 'Tiger', 兔: 'Rabbit', 龙: 'Dragon', 蛇: 'Snake',
  马: 'Horse', 羊: 'Goat', 猴: 'Monkey', 鸡: 'Rooster', 狗: 'Dog', 猪: 'Pig',
}

export const COMPATIBILITY_EN: Record<string, string> = {
  极佳: 'Excellent',
  良好: 'Good',
  中等: 'Moderate',
  一般: 'Fair',
  较差: 'Poor',
}

export const RELATIONSHIP_EN: Record<string, string> = {
  六合: 'Six Harmonies',
  三合: 'Three Harmonies',
  六冲: 'Six Clashes',
  六害: 'Six Harms',
  三刑: 'Three Punishments',
  相同: 'Same sign',
  普通: 'Ordinary',
}

export function shengxiaoLabel(shengxiao: string, english: boolean): string {
  return english ? SHENGXIAO_EN[shengxiao] ?? shengxiao : shengxiao
}

export function compatibilityLabel(compatibility: string, english: boolean): string {
  return english ? COMPATIBILITY_EN[compatibility] ?? compatibility : compatibility
}

export function relationshipLabel(relationship: string, english: boolean): string {
  return english ? RELATIONSHIP_EN[relationship] ?? relationship : relationship
}

export const shengxiaoToDizhi: Record<string, string> = {
  鼠: '子', 牛: '丑', 虎: '寅', 兔: '卯',
  龙: '辰', 蛇: '巳', 马: '午', 羊: '未',
  猴: '申', 鸡: '酉', 狗: '戌', 猪: '亥',
}

export const liuheMap: Record<string, string> = {
  子: '丑', 丑: '子', 寅: '亥', 亥: '寅',
  卯: '戌', 戌: '卯', 辰: '酉', 酉: '辰',
  巳: '申', 申: '巳', 午: '未', 未: '午',
}

export const liuchongMap: Record<string, string> = {
  子: '午', 午: '子', 丑: '未', 未: '丑',
  寅: '申', 申: '寅', 卯: '酉', 酉: '卯',
  辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
}

export const liuhaiMap: Record<string, string> = {
  子: '未', 未: '子', 丑: '午', 午: '丑',
  寅: '巳', 巳: '寅', 卯: '辰', 辰: '卯',
  申: '亥', 亥: '申', 酉: '戌', 戌: '酉',
}

export const sanheGroups = [
  ['申', '子', '辰'],
  ['亥', '卯', '未'],
  ['寅', '午', '戌'],
  ['巳', '酉', '丑'],
]

export const sanxingGroups = [
  ['子', '卯'],
  ['寅', '巳', '申'],
  ['丑', '未', '戌'],
  ['辰', '午', '酉', '亥'],
]

export type ShengxiaoPhase = 'idle' | 'pick' | 'bond' | 'insight'

export const SHENGXIAO_PHASE_STEP: Record<ShengxiaoPhase, 1 | 2 | 3 | 4> = {
  idle: 1,
  pick: 2,
  bond: 3,
  insight: 4,
}

export function compatTagClass(compatibility: string): string {
  if (compatibility === '极佳' || compatibility === '良好') return 'tag tag--good'
  if (compatibility === '中等' || compatibility === '一般') return 'tag tag--ok'
  return 'tag tag--bad'
}

export function relTagClass(rel: string): string {
  if (rel === '六合' || rel === '三合') return 'tag tag--good'
  if (rel === '相同') return 'tag tag--info'
  if (rel === '六冲' || rel === '六害' || rel === '三刑') return 'tag tag--bad'
  return 'tag tag--muted'
}
