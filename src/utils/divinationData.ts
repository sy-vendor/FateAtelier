export const DIVINATION_BRAND = '竹语灵签'
export const DIVINATION_BRAND_EN = 'Bamboo Oracle'

export const CATEGORY_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'career', label: '事业' },
  { value: 'love', label: '感情' },
  { value: 'health', label: '健康' },
  { value: 'wealth', label: '财运' },
  { value: 'travel', label: '出行' },
] as const

export type DrawPhase = 'intent' | 'shaking' | 'revealing' | 'done'

export const DRAW_PHASE_STEP: Record<DrawPhase, 1 | 2 | 3 | 4> = {
  intent: 1,
  shaking: 2,
  revealing: 3,
  done: 4,
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label ?? '建议'
}

export function getLevelColor(level: string): string {
  switch (level) {
    case '上上':
      return '#e85d5d'
    case '上':
      return '#e89a3c'
    case '中上':
      return '#d4b04a'
    case '中':
      return '#6dbf7a'
    case '中下':
      return '#5ba8c9'
    case '下':
      return '#9aa3ad'
    case '下下':
      return '#7a818a'
    default:
      return '#888'
  }
}
