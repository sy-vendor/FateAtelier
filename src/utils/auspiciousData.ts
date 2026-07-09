export const AUSPICIOUS_BRAND = '吉日良辰'
export const AUSPICIOUS_BRAND_EN = 'Golden Hour'

export type EventType = 'marriage' | 'move' | 'open' | 'travel' | 'sign' | 'ceremony' | 'other'

export interface EventTypeOption {
  id: EventType
  name: string
  icon: string
  description: string
}

export const EVENT_TYPES: EventTypeOption[] = [
  { id: 'marriage', name: '结婚', icon: '💒', description: '选择良辰吉日举办婚礼' },
  { id: 'move', name: '搬家', icon: '🏠', description: '选择吉日乔迁新居' },
  { id: 'open', name: '开业', icon: '🎊', description: '选择吉日开业大吉' },
  { id: 'travel', name: '出行', icon: '✈️', description: '选择吉日出行顺利' },
  { id: 'sign', name: '签约', icon: '📝', description: '选择吉日签约顺利' },
  { id: 'ceremony', name: '仪式', icon: '🎭', description: '选择吉日举办仪式' },
  { id: 'other', name: '其他', icon: '✨', description: '选择吉日进行重要事项' },
]

export const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
export const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const

export const SHICHEN_TIMES: Record<string, { start: string; end: string; name: string }> = {
  子: { start: '23:00', end: '00:59', name: '子时' },
  丑: { start: '01:00', end: '02:59', name: '丑时' },
  寅: { start: '03:00', end: '04:59', name: '寅时' },
  卯: { start: '05:00', end: '06:59', name: '卯时' },
  辰: { start: '07:00', end: '08:59', name: '辰时' },
  巳: { start: '09:00', end: '10:59', name: '巳时' },
  午: { start: '11:00', end: '12:59', name: '午时' },
  未: { start: '13:00', end: '14:59', name: '未时' },
  申: { start: '15:00', end: '16:59', name: '申时' },
  酉: { start: '17:00', end: '18:59', name: '酉时' },
  戌: { start: '19:00', end: '20:59', name: '戌时' },
  亥: { start: '21:00', end: '22:59', name: '亥时' },
}

export type AuspiciousPhase = 'intent' | 'date' | 'scan' | 'revealed'

export const AUSPICIOUS_PHASE_STEP: Record<AuspiciousPhase, 1 | 2 | 3 | 4> = {
  intent: 1,
  date: 2,
  scan: 3,
  revealed: 4,
}

export function formatAuspiciousDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

export function shichenTagClass(isGood: boolean): string {
  return isGood ? 'tag tag--good' : 'tag tag--muted'
}
