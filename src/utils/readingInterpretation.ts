import { DrawnCard } from '../types'
import { TarotCard } from '../data/tarotCards'
import { ReadingType } from '../types/reading'
import { resolveDrawnCards } from './tarotCardResolve'
import { isEnglishLocale } from '../i18n/locale'

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

const POSITION_LABEL_EN = {
  past: 'Past',
  present: 'Present',
  future: 'Future',
} as const

/** 三牌时空各列顶部的短副标题（与牌面解读引擎分离，供 UI 展示） */
export const THREE_CARD_POSITION_HINT = {
  过去: '已沉淀的因缘',
  现在: '当下的核心',
  未来: '趋势所向',
} as const

export const THREE_CARD_POSITION_HINT_EN = {
  Past: 'What has settled',
  Present: 'The heart of now',
  Future: 'Where momentum leads',
} as const

export type ThreeCardPosition = keyof typeof THREE_CARD_POSITION_HINT
export type ThreeCardPositionEn = keyof typeof THREE_CARD_POSITION_HINT_EN

export function getThreeCardPositionLabel(index: 0 | 1 | 2, isEnglish = false): string {
  if (isEnglish) return (['Past', 'Present', 'Future'] as const)[index]
  return (['过去', '现在', '未来'] as const)[index]
}

export function getThreeCardPositionHint(label: string, isEnglish = false): string {
  if (isEnglish) {
    return THREE_CARD_POSITION_HINT_EN[label as ThreeCardPositionEn] ?? ''
  }
  return THREE_CARD_POSITION_HINT[label as ThreeCardPosition] ?? ''
}

const POSITION_HINTS = {
  past: [
    '这段经历仍在影响你的判断，值得提炼，不必重演。',
    '它像一条暗线牵引至今：看清当时的选择，才能松开旧有惯性。',
    '过去带来的不只是结果，还有你已经练出的能力与尚未卸下的包袱。',
  ],
  present: [
    '当下的关键不在预测，而在你准备怎样回应。',
    '这张牌把焦点拉回此刻：一个清晰的小决定，胜过反复揣测远方。',
    '你正处在转折的受力点，态度与行动会比外部条件更快改变局面。',
  ],
  future: [
    '这是按当前轨迹延伸的趋势，不是无法更改的定数。',
    '未来的门已露出轮廓，你今天的取舍决定它会向哪一边打开。',
    '把这张牌当作天气预报：顺风时扬帆，起雾时减速，主动权仍在你手中。',
  ],
} as const

const POSITION_HINTS_EN = {
  past: [
    'This experience still shapes how you judge the present—extract what matters, without replaying it.',
    'Like an invisible thread, it pulls you to this day: clarity about your earlier choices loosens old momentum.',
    'What the past gives you is more than an outcome—it is also the skills you have practiced and the burdens you are still carrying.',
  ],
  present: [
    'The key now is not prediction, but how you choose to respond.',
    'This card brings your attention back to this moment: one clear small decision beats endless guessing about the distance.',
    'You are at a turning point. Attitude and action will shift the situation faster than outside conditions.',
  ],
  future: [
    'This is a trend flowing from your current path—not an unchangeable fate.',
    'The door of what’s next is starting to show. Your choices today decide which way it opens.',
    'Treat this card like a weather forecast: sail when it’s favorable, slow down when it’s foggy. The steering power is still yours.',
  ],
} as const

function getTypeLabel(type: ReadingType, customQuestion?: string, isEnglish = false): string {
  switch (type) {
    case 'daily':
      return isEnglish ? 'Daily Fortune' : '今日运势'
    case 'love':
      return isEnglish ? 'Love' : '姻缘感情'
    case 'wealth':
      return isEnglish ? 'Wealth' : '钱财财运'
    case 'career':
      return isEnglish ? 'Career' : '职场事业'
    case 'health':
      return isEnglish ? 'Health' : '健康'
    case 'study':
      return isEnglish ? 'Study' : '学业'
    case 'relationship':
      return isEnglish ? 'Relationships' : '人际关系'
    case 'custom':
      return customQuestion || (isEnglish ? 'Your question' : '您的问题')
    default:
      return isEnglish ? 'Comprehensive Reading' : '综合占卜'
  }
}

function getOrientationLabel(isReversed: boolean, isEnglish = false): string {
  return isEnglish ? (isReversed ? 'Reversed' : 'Upright') : isReversed ? '逆位' : '正位'
}

function getCardReading(
  card: TarotCard,
  isReversed: boolean,
  readingType: ReadingType
): { keywords: string; prose: string; themed: string | null } {
  const orientation = isReversed ? 'reversed' : 'upright'
  const category = TYPE_CATEGORY[readingType]
  const themed = category ? card.categories?.[category]?.[orientation] ?? null : null

  return {
    keywords: card.meaning?.[orientation] ?? '',
    prose: card.interpretation?.[orientation] ?? '',
    themed,
  }
}

function buildTrend(reversedCount: number, majorCount: number, isEnglish = false): string {
  if (reversedCount === 0) {
    return isEnglish
      ? 'All three cards are upright. Your overall energy is clear, and you are walking a path aligned with your inner direction.'
      : '三张牌皆正位，整体气场清明，你正走在与内心方向一致的路上。'
  }
  if (reversedCount === 1) {
    return isEnglish
      ? 'Two upright and one reversed: the overall trend is favorable. Only one area needs special attention and refinement.'
      : '两正一逆，大势向好，唯有一处需要特别留心与调整。'
  }
  if (reversedCount === 2) {
    return isEnglish
      ? 'Reversals are more frequent. Resistance is not small right now—stabilize your footing first, then improve step by step.'
      : '逆位居多，当前阻力不小，宜先稳住阵脚，再图渐进改善。'
  }
  const majorNote =
    majorCount >= 2
      ? isEnglish
        ? 'Major Arcana appears often here—this points to life lessons. Treat it with long-term seriousness, not impulsive choices.'
        : '且大阿卡纳频现，此事关乎人生课题，不可轻率处之。'
      : ''
  return isEnglish
    ? `All three are reversed. You are in a deep adjustment phase—time for inner reflection and rebuilding, not forcing forward.${majorNote}`
    : `三张皆逆，正处于深度调整期，需内省与重构，而非硬推前进。${majorNote}`
}

function buildSummary(
  readingType: ReadingType,
  trend: string,
  customQuestion?: string,
  isEnglish = false
): string {
  const label = getTypeLabel(readingType, customQuestion, isEnglish)

  const openingsZh: Record<ReadingType, string> = {
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

  const openingsEn: Record<ReadingType, string> = {
    general: `In this comprehensive reading, ${trend} three cards link past, present, and future—revealing the thread of what’s happening now.`,
    daily: `For today’s fortune, ${trend} the energy focuses on your choices and mindset right now. Go with the flow.`,
    love: `In matters of love, ${trend} emotional development often has traces. The cards show the feelings behind the past, your stance in the present, and the direction ahead.`,
    wealth: `Regarding wealth, ${trend} your financial situation is shaped by past habits, present decisions, and future planning.`,
    career: `For career, ${trend} your path is woven from previous accumulation, what you do now, and your long-term goals.`,
    health: `For health, ${trend} your wellbeing is the combined result of long-term routines and the choices you make today.`,
    study: `For study, ${trend} progress depends on foundation, focus in the present, and continued effort.`,
    relationship: `For relationships, ${trend} your social dynamics often grow from past experience and how you show up today.`,
    custom: `About “${label}”, ${trend} the cards unfold through time—helping you see where the issue comes from and where it might lead.`,
  }

  if (isEnglish) return openingsEn[readingType] ?? openingsEn.general
  return openingsZh[readingType] ?? openingsZh.general
}

function buildPositionReading(
  drawn: DrawnCard,
  position: keyof typeof POSITION_LABEL,
  readingType: ReadingType,
  customQuestion?: string,
  isEnglish = false
): string {
  const { card, isReversed } = drawn
  const orient = getOrientationLabel(isReversed, isEnglish)
  const { keywords, prose, themed } = getCardReading(card, isReversed, readingType)
  const label = isEnglish ? POSITION_LABEL_EN[position] : POSITION_LABEL[position]
  const hint = (isEnglish ? POSITION_HINTS_EN : POSITION_HINTS)[position][card.id % (isEnglish ? POSITION_HINTS_EN[position].length : POSITION_HINTS[position].length)]
  const cardName = isEnglish ? card.nameEn : card.name
  const focus = themed
    ? isEnglish
      ? `in the context of ${getTypeLabel(readingType, customQuestion, true)}, ${themed}`
      : `放到${getTypeLabel(readingType)}中，${themed}`
    : isEnglish
      ? `It draws your attention to “${keywords}”.`
      : `它把注意力带向「${keywords}」`

  const variantsZh = [
    `${label}位出现${cardName}${orient}。${prose} ${focus}。${hint}`,
    `${cardName}以${orient}落在${label}位，先点出的是：${prose} ${hint} ${focus}。`,
    `读${label}这一格，关键在${cardName}的${orient}状态。${focus}。${prose} ${hint}`,
    `${label}的线索由${cardName}${orient}带来。${focus}。这并不只是一个标签：${prose} ${hint}`,
  ]

  const variantsEn = [
    `${label} position: ${cardName} (${orient}). ${prose} ${focus} ${hint}`,
    `${cardName} in ${label} as ${orient}. First it highlights: ${prose} ${hint} ${focus}`,
    `Reading the ${label} slot, the key is ${cardName}'s ${orient} state. ${focus} ${prose} ${hint}`,
    `The ${label} clues come through ${cardName} ${orient}. ${focus} This is more than a label: ${prose} ${hint}`,
  ]

  const variants = isEnglish ? variantsEn : variantsZh
  return variants[(card.id + Object.keys(POSITION_LABEL).indexOf(position)) % variants.length]
}

function buildAdvice(
  cards: DrawnCard[],
  readingType: ReadingType,
  customQuestion?: string,
  isEnglish = false
): string {
  const present = cards[1]
  const future = cards[2]
  const reversedCount = cards.filter((c) => c.isReversed).length
  const majorCount = cards.filter((c) => c.card.type === 'major').length

  const presentAdvice = present.isReversed
    ? present.card.advice?.reversed ?? ''
    : present.card.advice?.upright ?? ''
  const futureAdvice = future.isReversed
    ? future.card.advice?.reversed ?? ''
    : future.card.advice?.upright ?? ''

  const actionBridges = isEnglish
    ? [
        `Start with one doable step right in front of you: ${presentAdvice}. As the situation moves forward, remember: ${futureAdvice}`,
        `You don't need to solve everything at once. The best move now is ${presentAdvice}. In the next stage, stay alert to ${futureAdvice}`,
        `Turn the reading into action: try ${presentAdvice} today, and use ${futureAdvice} as your decision guide.`,
      ]
    : [
        `先从眼前可做的一步开始：${presentAdvice} 等局面往前走时，再记住：${futureAdvice}`,
        `不必同时解决所有问题。此刻最值得做的是${presentAdvice} 下一阶段则要留意${futureAdvice}`,
        `把解读落到行动上：今天尝试${presentAdvice} 之后的判断标准是${futureAdvice}`,
      ]
  let core = actionBridges[(present.card.id + future.card.id) % actionBridges.length]

  if (majorCount >= 2) {
    core += isEnglish
      ? ' Major Arcana appears repeatedly here. This concerns your life direction—choose with a long-term perspective, not short-term gain or loss.'
      : ' 大阿卡纳多次出现，此事关乎人生方向，宜以长远眼光抉择，勿困于一时得失。'
  } else if (reversedCount >= 2) {
    core += isEnglish
      ? ' Reversals are more prominent. Strengthen your inner foundation and adjust your rhythm first—moving too fast won’t help.'
      : ' 逆位偏多，先修内功、调整节奏，比急于求成更重要。'
  } else if (reversedCount === 0) {
    core += isEnglish
      ? ' Everything is flowing smoothly. Take initiative while staying clear-headed and measured.'
      : ' 牌面通畅，可把握时机积极行动，同时保持清醒与分寸。'
  }

  const prefixesZh: Partial<Record<ReadingType, string>> = {
    daily: '今日指引：',
    love: '感情指引：',
    wealth: '财运指引：',
    career: '事业指引：',
    health: '健康指引：',
    study: '学业指引：',
    relationship: '人际指引：',
    custom: `关于「${getTypeLabel(readingType, customQuestion)}」：`,
  }

  const prefixesEn: Partial<Record<ReadingType, string>> = {
    daily: `Today's guidance:`,
    love: 'Love guidance:',
    wealth: 'Wealth guidance:',
    career: 'Career guidance:',
    health: 'Health guidance:',
    study: 'Study guidance:',
    relationship: 'Relationship guidance:',
    custom: `About “${getTypeLabel(readingType, customQuestion, true)}”:`,
  }

  const prefix = isEnglish
    ? prefixesEn[readingType] ?? 'On-the-ground reminder:'
    : prefixesZh[readingType] ?? '这次的落地提醒：'

  return `${prefix}${core}`
}

function buildCardSynthesis(cards: DrawnCard[], isEnglish = false): string {
  const [past, present, future] = cards
  const cardNamePast = isEnglish ? past.card.nameEn : past.card.name
  const cardNamePresent = isEnglish ? present.card.nameEn : present.card.name
  const cardNameFuture = isEnglish ? future.card.nameEn : future.card.name

  const pastFlow = isEnglish
    ? past.isReversed
      ? 'an old lesson not yet fully integrated'
      : 'experience already gathered'
    : past.isReversed
      ? '尚未理顺的旧课题'
      : '已经积累的经验'

  const presentFlow = isEnglish
    ? present.isReversed
      ? 'a point of tension in the present'
      : 'working in your current reality'
    : present.isReversed
      ? '在当下形成卡点'
      : '正在当下发挥作用'

  const futureFlow = isEnglish
    ? future.isReversed
      ? 'if you don’t adjust, it may keep draining you from within'
      : 'if you move with the flow, the situation gradually opens'
    : future.isReversed
      ? '若不调整，可能继续内耗'
      : '若顺势行动，会逐渐打开局面'

  if (isEnglish) {
    return `The link between these three cards is this: “${cardNamePast}” points to ${pastFlow}. Through “${cardNamePresent}”, ${presentFlow}, it leads to “${cardNameFuture}” and the stage it signals—${futureFlow}.`
  }

  return `三张牌的关联在于：「${past.card.name}」所代表的${pastFlow}，经由「${present.card.name}」${presentFlow}，最终走向「${future.card.name}」所提示的阶段——${futureFlow}。`
}

/** 按最新引擎逻辑重新生成三牌解读（历史/导出/分享应优先调用） */
export function resolveThreeCardInterpretation(reading: {
  type: 'single' | 'three'
  cards: DrawnCard[]
  readingType?: string
  customQuestion?: string
}, isEnglish = isEnglishLocale()): ReadingInterpretation | null {
  if (reading.type !== 'three' || reading.cards.length !== 3) return null
  return generateThreeCardReading(
    resolveDrawnCards(reading.cards),
    (reading.readingType as ReadingType) || 'general',
    reading.customQuestion,
    isEnglish,
  )
}

export const generateThreeCardReading = (
  cards: DrawnCard[],
  readingType: ReadingType = 'general',
  customQuestion?: string,
  isEnglish = isEnglishLocale()
): ReadingInterpretation => {
  const resolvedCards = resolveDrawnCards(cards)
  if (resolvedCards.length !== 3) {
    return {
      summary: isEnglish ? 'You need three cards to generate a three-card spread reading.' : '需要三张牌才能进行时空牌阵解读。',
      past: '',
      present: '',
      future: '',
      advice: '',
    }
  }

  const [pastCard, presentCard, futureCard] = resolvedCards
  const reversedCount = resolvedCards.filter((c) => c.isReversed).length
  const majorCount = resolvedCards.filter((c) => c.card.type === 'major').length
  const trend = buildTrend(reversedCount, majorCount, isEnglish)

  return {
    summary: `${buildSummary(readingType, trend, customQuestion, isEnglish)} ${buildCardSynthesis(resolvedCards, isEnglish)}`,
    past: buildPositionReading(pastCard, 'past', readingType, customQuestion, isEnglish),
    present: buildPositionReading(presentCard, 'present', readingType, customQuestion, isEnglish),
    future: buildPositionReading(futureCard, 'future', readingType, customQuestion, isEnglish),
    advice: buildAdvice(resolvedCards, readingType, customQuestion, isEnglish),
  }
}
