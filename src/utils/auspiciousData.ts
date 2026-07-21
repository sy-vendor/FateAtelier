import { isEnglishLocale } from '../i18n/locale'

export const AUSPICIOUS_BRAND = '吉日良辰'
export const AUSPICIOUS_BRAND_EN = 'Golden Hour'

export type EventType = 'marriage' | 'move' | 'open' | 'travel' | 'sign' | 'ceremony' | 'other'

export interface EventTypeOption {
  id: EventType
  name: string
  nameEn: string
  icon: string
  description: string
  descriptionEn: string
}

export const EVENT_TYPES: EventTypeOption[] = [
  { id: 'marriage', name: '结婚', nameEn: 'Wedding', icon: '💒', description: '选择良辰吉日举办婚礼', descriptionEn: 'Choose an auspicious day for your wedding' },
  { id: 'move', name: '搬家', nameEn: 'Moving', icon: '🏠', description: '选择吉日乔迁新居', descriptionEn: 'Choose a good day to move into a new home' },
  { id: 'open', name: '开业', nameEn: 'Business opening', icon: '🎊', description: '选择吉日开业大吉', descriptionEn: 'Choose an auspicious day to open for business' },
  { id: 'travel', name: '出行', nameEn: 'Travel', icon: '✈️', description: '选择吉日出行顺利', descriptionEn: 'Choose a favorable day for travel' },
  { id: 'sign', name: '签约', nameEn: 'Contract signing', icon: '📝', description: '选择吉日签约顺利', descriptionEn: 'Choose a good day to sign agreements' },
  { id: 'ceremony', name: '仪式', nameEn: 'Ceremony', icon: '🎭', description: '选择吉日举办仪式', descriptionEn: 'Choose an auspicious day for a ceremony' },
  { id: 'other', name: '其他', nameEn: 'Other', icon: '✨', description: '选择吉日进行重要事项', descriptionEn: 'Choose an auspicious day for important matters' },
]

export const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
export const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const

export const SHICHEN_TIMES: Record<string, { start: string; end: string; name: string; nameEn: string }> = {
  子: { start: '23:00', end: '00:59', name: '子时', nameEn: 'Zi' },
  丑: { start: '01:00', end: '02:59', name: '丑时', nameEn: 'Chou' },
  寅: { start: '03:00', end: '04:59', name: '寅时', nameEn: 'Yin' },
  卯: { start: '05:00', end: '06:59', name: '卯时', nameEn: 'Mao' },
  辰: { start: '07:00', end: '08:59', name: '辰时', nameEn: 'Chen' },
  巳: { start: '09:00', end: '10:59', name: '巳时', nameEn: 'Si' },
  午: { start: '11:00', end: '12:59', name: '午时', nameEn: 'Wu' },
  未: { start: '13:00', end: '14:59', name: '未时', nameEn: 'Wei' },
  申: { start: '15:00', end: '16:59', name: '申时', nameEn: 'Shen' },
  酉: { start: '17:00', end: '18:59', name: '酉时', nameEn: 'You' },
  戌: { start: '19:00', end: '20:59', name: '戌时', nameEn: 'Xu' },
  亥: { start: '21:00', end: '22:59', name: '亥时', nameEn: 'Hai' },
}

export type AuspiciousPhase = 'intent' | 'date' | 'scan' | 'revealed'

export const AUSPICIOUS_PHASE_STEP: Record<AuspiciousPhase, 1 | 2 | 3 | 4> = {
  intent: 1,
  date: 2,
  scan: 3,
  revealed: 4,
}

export function formatAuspiciousDate(date: Date): string {
  return date.toLocaleDateString(isEnglishLocale() ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

export function shichenTagClass(isGood: boolean): string {
  return isGood ? 'tag tag--good' : 'tag tag--muted'
}
