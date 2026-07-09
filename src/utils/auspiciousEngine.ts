import {
  DIZHI,
  EVENT_TYPES,
  SHICHEN_TIMES,
  TIANGAN,
  type EventType,
} from './auspiciousData'

export interface DayPillar {
  gan: string
  zhi: string
}

export interface ShichenResult {
  isGood: boolean
  reason: string
  score: number
}

export interface ShichenSlot {
  shichen: string
  time: { start: string; end: string; name: string }
  result: ShichenResult
}

export function calculateDayPillar(date: Date): DayPillar {
  const baseDate = new Date(1900, 0, 1)
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  return {
    gan: TIANGAN[daysDiff % 10],
    zhi: DIZHI[daysDiff % 12],
  }
}

export function calculateShichenPillar(date: Date, shichen: string): DayPillar {
  const dayPillar = calculateDayPillar(date)
  const dayGanIndex = TIANGAN.indexOf(dayPillar.gan as (typeof TIANGAN)[number])
  const shichenIndex = DIZHI.indexOf(shichen as (typeof DIZHI)[number])

  const shichenGanMap: Record<number, string[]> = {
    0: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
    1: ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
    2: ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
    3: ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
    4: ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  }

  const ganGroup = dayGanIndex % 5
  return {
    gan: shichenGanMap[ganGroup][shichenIndex],
    zhi: shichen,
  }
}

export function isAuspiciousShichen(date: Date, shichen: string, eventType: EventType): ShichenResult {
  const shichenPillar = calculateShichenPillar(date, shichen)
  const dayPillar = calculateDayPillar(date)

  let score = 50
  const reasons: string[] = []

  const heMap: Record<string, string[]> = {
    子: ['丑'],
    丑: ['子'],
    寅: ['亥'],
    亥: ['寅'],
    卯: ['戌'],
    戌: ['卯'],
    辰: ['酉'],
    酉: ['辰'],
    巳: ['申'],
    申: ['巳'],
    午: ['未'],
    未: ['午'],
  }

  if (heMap[dayPillar.zhi]?.includes(shichenPillar.zhi)) {
    score += 20
    reasons.push('时辰与日柱相合')
  }

  if (shichen === '子' || shichen === '午') {
    if (eventType === 'marriage' || eventType === 'open') {
      score -= 10
      reasons.push('子午时需谨慎')
    }
  }

  const recommendedShichen: Record<EventType, string[]> = {
    marriage: ['巳', '午', '未', '申'],
    move: ['辰', '巳', '午', '未'],
    open: ['巳', '午', '未', '申'],
    travel: ['寅', '卯', '辰', '巳'],
    sign: ['巳', '午', '未', '申'],
    ceremony: ['巳', '午', '未', '申'],
    other: ['巳', '午', '未', '申'],
  }

  if (recommendedShichen[eventType].includes(shichen)) {
    score += 15
    reasons.push(`适合${EVENT_TYPES.find((e) => e.id === eventType)?.name}`)
  }

  return {
    isGood: score >= 60,
    reason: reasons.length > 0 ? reasons.join('、') : '时辰一般',
    score: Math.min(100, Math.max(0, score)),
  }
}

export function getAuspiciousShichens(date: Date, eventType: EventType): ShichenSlot[] {
  return DIZHI.map((shichen) => ({
    shichen,
    time: SHICHEN_TIMES[shichen],
    result: isAuspiciousShichen(date, shichen, eventType),
  })).sort((a, b) => b.result.score - a.result.score)
}
