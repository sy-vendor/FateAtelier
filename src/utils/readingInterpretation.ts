import { DrawnCard } from '../types'
import { TarotCard } from '../data/tarotCards'
import { ReadingType } from '../types/reading'

export interface ReadingInterpretation {
  summary: string
  past: string
  present: string
  future: string
  advice: string
}

type CategoryKey = keyof TarotCard['categories']

const TYPE_CATEGORY: Partial<Record<ReadingType, CategoryKey>> = {
  love: 'love',
  career: 'career',
  wealth: 'wealth',
  health: 'health',
  study: 'career',
  relationship: 'love',
}

const POSITION_LABEL = {
  past: '过去',
  present: '现在',
  future: '未来',
} as const

const POSITION_HINT = {
  past: '这段经历仍在影响你的判断与情绪，宜从中提炼教训而非沉溺。',
  present: '这是当下最需要你正视的能量，你的回应将直接塑造下一步。',
  future: '这是趋势所向，并非定数——清醒准备，仍可因行动而改变走向。',
} as const

function getTypeLabel(type: ReadingType, customQuestion?: string): string {
  switch (type) {
    case 'daily':
      return '今日运势'
    case 'love':
      return '姻缘感情'
    case 'wealth':
      return '钱财财运'
    case 'career':
      return '职场事业'
    case 'health':
      return '健康'
    case 'study':
      return '学业'
    case 'relationship':
      return '人际关系'
    case 'custom':
      return customQuestion || '您的问题'
    default:
      return '综合占卜'
  }
}

function getOrientationLabel(isReversed: boolean): string {
  return isReversed ? '逆位' : '正位'
}

function getEnergyLabel(isReversed: boolean, position: keyof typeof POSITION_LABEL): string {
  if (isReversed) {
    return position === 'present' ? '能量受阻，需调整' : '尚有阻滞，宜谨慎'
  }
  return position === 'future' ? '趋势向好，可期' : '能量顺畅'
}

function getCardReading(
  card: TarotCard,
  isReversed: boolean,
  readingType: ReadingType
): { keywords: string; prose: string; themed: string | null } {
  const orientation = isReversed ? 'reversed' : 'upright'
  const category = TYPE_CATEGORY[readingType]
  const themed = category ? card.categories[category][orientation] : null

  return {
    keywords: card.meaning[orientation],
    prose: card.interpretation[orientation],
    themed,
  }
}

function buildTrend(reversedCount: number, majorCount: number): string {
  if (reversedCount === 0) {
    return '三张牌皆正位，整体气场清明，你正走在与内心方向一致的路上。'
  }
  if (reversedCount === 1) {
    return '两正一逆，大势向好，唯有一处需要特别留心与调整。'
  }
  if (reversedCount === 2) {
    return '逆位居多，当前阻力不小，宜先稳住阵脚，再图渐进改善。'
  }
  const majorNote =
    majorCount >= 2
      ? '且大阿卡纳频现，此事关乎人生课题，不可轻率处之。'
      : ''
  return `三张皆逆，正处于深度调整期，需内省与重构，而非硬推前进。${majorNote}`
}

function buildSummary(
  readingType: ReadingType,
  trend: string,
  customQuestion?: string
): string {
  const label = getTypeLabel(readingType, customQuestion)

  const openings: Record<ReadingType, string> = {
    general: `本次综合占卜中，${trend}三张牌串联起过去、现在与未来，为你勾勒当下生命脉络。`,
    daily: `关于今日运势，${trend}今日的能量集中在当下选择与心态，宜顺势而为。`,
    love: `关于姻缘感情，${trend}情感的发展往往有迹可循，牌面示过去的情结、现在的态度与未来的走向。`,
    wealth: `关于钱财财运，${trend}财务局势受过往习惯、当下决策与未来规划共同塑造。`,
    career: `关于职场事业，${trend}事业轨迹由既往积累、现时行动与远期目标交织而成。`,
    health: `关于身心健康，${trend}身心状态是长期习惯与当下选择的叠加结果。`,
    study: `关于学业进修，${trend}学习成效取决于基础、当下专注与持续投入。`,
    relationship: `关于人际关系，${trend}人缘与互动模式，往往根植于过往经验与当下表达。`,
    custom: `关于「${label}」，${trend}牌面从时间维度展开，助你看见问题的来路与去路。`,
  }

  return openings[readingType] ?? openings.general
}

function buildPositionReading(
  drawn: DrawnCard,
  position: keyof typeof POSITION_LABEL,
  readingType: ReadingType
): string {
  const { card, isReversed } = drawn
  const orient = getOrientationLabel(isReversed)
  const energy = getEnergyLabel(isReversed, position)
  const { keywords, prose, themed } = getCardReading(card, isReversed, readingType)
  const label = POSITION_LABEL[position]
  const hint = POSITION_HINT[position]

  let text = `${label}：${card.name}（${orient}）——${energy}。${prose}`
  if (themed) {
    text += ` 就${getTypeLabel(readingType)}而言：${themed}`
  } else {
    text += ` 核心意象：${keywords}。`
  }
  text += ` ${hint}`

  return text
}

function buildAdvice(
  cards: DrawnCard[],
  readingType: ReadingType,
  customQuestion?: string
): string {
  const present = cards[1]
  const future = cards[2]
  const reversedCount = cards.filter((c) => c.isReversed).length
  const majorCount = cards.filter((c) => c.card.type === 'major').length

  const presentAdvice = present.isReversed
    ? present.card.advice.reversed
    : present.card.advice.upright
  const futureAdvice = future.isReversed
    ? future.card.advice.reversed
    : future.card.advice.upright

  let core = `当下之牌建议：${presentAdvice} 未来之牌提示：${futureAdvice}`

  if (majorCount >= 2) {
    core += ' 大阿卡纳多次出现，此事关乎人生方向，宜以长远眼光抉择，勿困于一时得失。'
  } else if (reversedCount >= 2) {
    core += ' 逆位偏多，先修内功、调整节奏，比急于求成更重要。'
  } else if (reversedCount === 0) {
    core += ' 牌面通畅，可把握时机积极行动，同时保持清醒与分寸。'
  }

  const prefixes: Partial<Record<ReadingType, string>> = {
    daily: '今日指引：',
    love: '感情指引：',
    wealth: '财运指引：',
    career: '事业指引：',
    health: '健康指引：',
    study: '学业指引：',
    relationship: '人际指引：',
    custom: `关于「${getTypeLabel(readingType, customQuestion)}」：`,
  }

  const prefix = prefixes[readingType] ?? '综合指引：'
  return `${prefix}${core}`
}

export const generateThreeCardReading = (
  cards: DrawnCard[],
  readingType: ReadingType = 'general',
  customQuestion?: string
): ReadingInterpretation => {
  if (cards.length !== 3) {
    return {
      summary: '需要三张牌才能进行时空牌阵解读。',
      past: '',
      present: '',
      future: '',
      advice: '',
    }
  }

  const [pastCard, presentCard, futureCard] = cards
  const reversedCount = cards.filter((c) => c.isReversed).length
  const majorCount = cards.filter((c) => c.card.type === 'major').length
  const trend = buildTrend(reversedCount, majorCount)

  return {
    summary: buildSummary(readingType, trend, customQuestion),
    past: buildPositionReading(pastCard, 'past', readingType),
    present: buildPositionReading(presentCard, 'present', readingType),
    future: buildPositionReading(futureCard, 'future', readingType),
    advice: buildAdvice(cards, readingType, customQuestion),
  }
}
