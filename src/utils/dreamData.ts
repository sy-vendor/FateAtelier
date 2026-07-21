export const DREAM_BRAND = '梦渊解语'
export const DREAM_BRAND_EN = 'Dream Oracle'

export const MOOD_OPTIONS = [
  { value: '', label: '不选' },
  { value: 'calm', label: '安宁' },
  { value: 'fear', label: '恐惧' },
  { value: 'joy', label: '欣喜' },
  { value: 'confused', label: '迷茫' },
  { value: 'sad', label: '忧伤' },
] as const

export type DreamMood = (typeof MOOD_OPTIONS)[number]['value']

export const CATEGORY_COLORS: Record<string, string> = {
  动物: '#a78bfa',
  自然: '#60a5fa',
  人物: '#f472b6',
  建筑: '#fbbf24',
  物品: '#34d399',
  动作: '#fb923c',
  Animals: '#a78bfa',
  Nature: '#60a5fa',
  People: '#f472b6',
  Buildings: '#fbbf24',
  Objects: '#34d399',
  Actions: '#fb923c',
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#888'
}

export type DreamPhase = 'slumber' | 'recount' | 'interpreting' | 'revealed'

export const DREAM_PHASE_STEP: Record<DreamPhase, 1 | 2 | 3 | 4> = {
  slumber: 1,
  recount: 2,
  interpreting: 3,
  revealed: 4,
}

export function formatDreamDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getMoodLabel(mood: string): string {
  return MOOD_OPTIONS.find((opt) => opt.value === mood)?.label ?? ''
}
