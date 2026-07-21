import type { HoroscopePeriod, ZodiacElement } from './horoscopeData'
import { ZODIAC_SIGNS } from './horoscopeData'
import { isEnglishLocale } from '../i18n/locale'

export interface HoroscopeResult {
  overall: number
  summary: string
  advice: string
  color: string
  item: string
  details: { key: string; value: number; text: string }[]
  element: ZodiacElement
}

export interface PairingDimension {
  key: string
  value: number
  text: string
}

export interface PairingRelationshipNote {
  type: string
  description: string
}

export interface PairingSignInfo {
  name: string
  symbol: string
  element: ZodiacElement
}

export interface PairingResult {
  sign1: PairingSignInfo
  sign2: PairingSignInfo
  relationships: string[]
  relationshipNotes: PairingRelationshipNote[]
  score: number
  compatibility: string
  summary: string
  analysis: string
  elementDynamic: string
  dimensions: PairingDimension[]
  strengths: string[]
  challenges: string[]
  advice: string
}

// 基于日期和星座的确定性哈希函数
function hash(seed: number): number {
  let h = seed
  h = ((h << 5) - h) + seed
  h = h ^ (h >>> 16)
  h = h * 0x85ebca6b
  h = h ^ (h >>> 13)
  h = h * 0xc2b2ae35
  h = h ^ (h >>> 16)
  return Math.abs(h)
}

export function getHoroscopeSeed(date: Date, signIndex: number, period: HoroscopePeriod): number {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const base = period === 'today' ? (y * 10000 + m * 100 + d) : period === 'week' ? (y * 100 + getWeekNumber(date)) : (y * 100 + m)
  return base * 31 + signIndex * 97
}

// 确定性选择（基于哈希值）
function select<T>(seed: number, list: T[]): T {
  const index = hash(seed) % list.length
  return list[index]
}

function getWeekNumber(date: Date) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = temp.getUTCDay() || 7
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
  return Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

const luckyColors = [
  '蓝色', '金色', '绿色', '银色', '紫色', '红色', '白色', '黑色', '橙色', '青色',
  '粉色', '黄色', '棕色', '灰色', '米色', '深蓝', '浅绿', '珊瑚色', '薄荷绿', '薰衣草紫',
  '玫瑰金', '古铜色', '翡翠绿', '琥珀色', '珍珠白', '星空蓝', '樱花粉', '柠檬黄', '橄榄绿', '酒红色',
  '天蓝色', '象牙白', '墨绿色', '香槟金', '紫罗兰', '珊瑚橙', '薄荷蓝', '焦糖色', '海军蓝', '淡紫色'
]

const luckyItems = [
  '星形吊坠', '天然水晶', '精油香氛', '手账本', '幸运硬币', '羽毛笔', '丝巾', '手链', '耳饰', '胸针',
  '护身符', '平安符', '转运珠', '玉石挂件', '檀香手串', '紫水晶', '粉水晶', '黄水晶', '黑曜石', '玛瑙',
  '琥珀', '珍珠', '翡翠', '和田玉', '红绳手链', '银饰', '金饰', '铜钱', '五帝钱', '八卦镜',
  '风铃', '香囊', '护身卡', '幸运符', '许愿瓶', '能量石', '水晶球', '塔罗牌', '占卜牌', '护身手环',
  '平安扣', '貔貅', '龙龟', '金蟾', '招财猫', '福字挂件', '如意', '葫芦', '佛珠', '念珠',
  '木鱼', '经书', '护身符袋', '能量手链', '五行手链', '生肖挂件', '星座徽章', '幸运钥匙扣', '许愿石', '能量水晶'
]

const luckyColorsEn = [
  'Blue', 'Gold', 'Green', 'Silver', 'Violet', 'Red', 'White', 'Black', 'Orange', 'Teal',
  'Pink', 'Yellow', 'Brown', 'Gray', 'Cream', 'Navy', 'Light Green', 'Coral', 'Mint', 'Lavender',
]

const luckyItemsEn = [
  'Star pendant', 'Natural crystal', 'Essential oil', 'Journal', 'Lucky coin', 'Fountain pen', 'Scarf', 'Bracelet', 'Earrings', 'Brooch',
  'Talisman', 'Safety charm', 'Fortune bead', 'Jade pendant', 'Sandalwood bracelet', 'Amethyst', 'Rose quartz', 'Citrine', 'Obsidian', 'Agate',
]

// 基于种子生成分数（60-100）
function genScore(seed: number): number {
  return 60 + (hash(seed) % 41)
}

function genAdvice(seed: number, element: ZodiacElement): string {
  if (isEnglishLocale()) {
    const common = [
      'Focus on one small goal in front of you; it will make the day feel clearer and more productive.',
      'Take the first workable step, then adjust your direction with what you learn.',
      'A brief review of recent progress can turn experience into your next useful idea.',
      'Slow the pace slightly. Patience will help the important detail come into view.',
      'Talk with someone you trust; a fresh perspective can unlock the next step.',
      'Keep your own rhythm instead of measuring your progress against someone else’s.',
    ]
    const elementHints: Record<ZodiacElement, string[]> = {
      火: ['Lead with enthusiasm, then give yourself a moment to check the pace before acting.'],
      土: ['Build the foundation first. A simple process will make your plan feel dependable.'],
      风: ['Share and capture your ideas; conversation can turn inspiration into something usable.'],
      水: ['Listen to your feelings and intuition. Inner steadiness supports outward progress.'],
    }
    return select(seed, [...common, ...elementHints[element]])
  }
  const common = [
    '把注意力放在当下的小目标上，会更高效也更踏实。',
    '与其纠结未知，不如先迈出第一步再微调方向。',
    '适合做一次小复盘，沉淀经验会带来新的灵感。',
    '保持耐心，节奏放缓反而能看清关键环节。',
    '与可信赖的人交流，会听到点醒你的那句话。',
    '稳住自己的节奏，不必与他人比较速度。',
    '适度肯定自己，稳定的自信会吸引好运靠近。',
    '规律作息与轻运动，会显著提升专注力与状态。',
    '先做减法，清理积压事项给新计划腾出空间。',
    '不必追求一次到位，小步快跑、持续迭代更靠谱。',
    '给自己一个可执行的时间表，别让理想悬在空中。',
    '把复杂问题拆解成三步，逐一推进会轻松很多。',
    '注意界限感，保留属于自己的安静时间。',
    '试着换个表达方式，沟通会更顺畅也更有效。',
    '适合学习新事物，哪怕是十分钟也会有收获。',
    '接纳不确定，先行动后修正，是今天的最佳策略。',
    '善用清单工具，明确优先级后再投入精力。',
    '别忘了奖励自己，一个小小的仪式感能增强动力。',
    '保持弹性预期，容许小波动，你会走得更稳。',
    '遇到阻力时，先处理最容易的部分建立信心。'
  ]
  const elementHints: Record<ZodiacElement, string[]> = {
    '火': [
      '保持热情但别冲动，先做两分钟冷思考再行动。',
      '把能量用在关键一击上，避免分散火力。'
    ],
    '土': [
      '先筑地基再盖楼，流程与秩序会让你更安心。',
      '一步一步落实计划，小步复利最稳健。'
    ],
    '风': [
      '多交流与记录，灵感需要被及时捕捉和落地。',
      '尝试换个角度表达，你的说服力会更强。'
    ],
    '水': [
      '照顾情绪与直觉，内在的安定会带来外在顺利。',
      '适合温柔推进，用柔软化解小阻力。'
    ]
  }
  const pool = [...common, ...elementHints[element]]
  return select(seed, pool)
}

function genAspectText(seed: number, aspect: string, element: ZodiacElement): string {
  if (isEnglishLocale()) {
    const templates = [
      `${aspect} is steady and gradually improving; following your plan will build confidence.`,
      `${aspect} brings a new idea or opening. Capture it, then test one practical version.`,
      `${aspect} benefits from simplifying first so the priority becomes obvious.`,
      `${aspect} rewards patient preparation over rushing for a quick result.`,
      `${aspect} improves through cooperation, honest listening, and a clear next step.`,
      `${aspect} may bring a small detour that helps refine your direction.`,
    ]
    const elementFlavors: Record<ZodiacElement, string[]> = {
      火: [`${aspect} favors a bold move, provided you keep your timing and emotions measured.`],
      土: [`${aspect} responds well to careful structure and attention to useful details.`],
      风: [`${aspect} opens through conversation and exchanging perspectives.`],
      水: [`${aspect} moves more easily when you acknowledge feelings before making decisions.`],
    }
    return select(seed, [...templates, ...elementFlavors[element]])
  }
  const templates = [
    `${aspect}方面起伏不大，稳中有进，按原计划推进更安心。`,
    `${aspect}方面会浮现新的灵感或机会，及时记录并尝试。`,
    `${aspect}方面先做减法，去冗余后重点会更突出。`,
    `${aspect}方面切忌急于求成，把过程做好结果自会靠近。`,
    `${aspect}方面适合协作沟通，倾听能换来更高的效率。`,
    `${aspect}方面可能遇到小波折，但恰好是微调方向的信号。`,
    `${aspect}方面可以设立一个可达成的小目标，增强掌控感。`,
    `${aspect}方面注意边界与节奏，避免被外部节奏牵着走。`,
    `${aspect}方面宜整顿与优化，工具化会让你事半功倍。`,
    `${aspect}方面主动表达诉求，比被动等待更能创造变化。`,
    `${aspect}方面宜稳中求新，保持底线同时尝试细微创新。`,
    `${aspect}方面若遇分歧，先对齐共同目标再谈细节。`,
    `${aspect}方面不妨放慢一步，检视关键假设是否成立。`,
    `${aspect}方面的好运来自准备，预案越充分越安心。`,
    `${aspect}方面宜关注长期复利，小习惯的力量正在累积。`,
    `${aspect}方面留意来自身边人的支持，一句鼓励就是助推器。`,
    `${aspect}方面若卡住，先转向边界问题，容易找到突破口。`,
    `${aspect}方面适合收尾与总结，为下一阶段铺好路。`
  ]
  const elementFlavors: Record<ZodiacElement, string[]> = {
    '火': [
      `${aspect}方面宜主动出击，但要控制节奏与情绪。`,
      `${aspect}方面可设立挑战目标，用热情点燃进度。`
    ],
    '土': [
      `${aspect}方面讲究稳扎稳打，细节打磨会有质变。`,
      `${aspect}方面适合流程化，把控节点更踏实。`
    ],
    '风': [
      `${aspect}方面重在沟通与交换想法，信息越充分越顺畅。`,
      `${aspect}方面适合发散思考，再收敛到可执行方案。`
    ],
    '水': [
      `${aspect}方面以柔克刚，先安抚情绪再推动事项。`,
      `${aspect}方面重视直觉提示，往往能绕开不必要的阻力。`
    ]
  }
  const pool = [...templates, ...elementFlavors[element]]
  return select(seed, pool)
}

export function generateHoroscope(seed: number, element: ZodiacElement): HoroscopeResult {
  // 使用不同的种子偏移来生成不同的值
  const overall = genScore(seed)
  const love = genScore(seed * 31 + 1)
  const career = genScore(seed * 31 + 2)
  const wealth = genScore(seed * 31 + 3)
  const health = genScore(seed * 31 + 4)
  const study = genScore(seed * 31 + 5)
  const color = select(seed * 31 + 6, isEnglishLocale() ? luckyColorsEn : luckyColors)
  const item = select(seed * 31 + 7, isEnglishLocale() ? luckyItemsEn : luckyItems)
  const summary = genAspectText(seed * 31 + 8, isEnglishLocale() ? 'Your overall outlook' : '整体', element)
  const advice = genAdvice(seed * 31 + 9, element)
  const details = [
    { key: isEnglishLocale() ? 'Love' : '爱情', value: love, text: genAspectText(seed * 31 + 10, isEnglishLocale() ? 'Love' : '爱情', element) },
    { key: isEnglishLocale() ? 'Career' : '事业', value: career, text: genAspectText(seed * 31 + 11, isEnglishLocale() ? 'Career' : '事业', element) },
    { key: isEnglishLocale() ? 'Wealth' : '财富', value: wealth, text: genAspectText(seed * 31 + 12, isEnglishLocale() ? 'Wealth' : '财富', element) },
    { key: isEnglishLocale() ? 'Health' : '健康', value: health, text: genAspectText(seed * 31 + 13, isEnglishLocale() ? 'Health' : '健康', element) },
    { key: isEnglishLocale() ? 'Study' : '学业', value: study, text: genAspectText(seed * 31 + 14, isEnglishLocale() ? 'Study' : '学业', element) }
  ]
  return { overall, summary, advice, color, item, details, element }
}

// 根据阳历日期计算星座
export function getZodiacSignByDate(month: number, day: number): number {
  // 星座日期范围（阳历）
  // 摩羯座（跨年）：12月22日 - 1月19日
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 9 // 摩羯座
  }
  // 水瓶座：1月20日 - 2月18日
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 10 // 水瓶座
  }
  // 双鱼座：2月19日 - 3月20日
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 11 // 双鱼座
  }
  // 白羊座：3月21日 - 4月19日
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 0 // 白羊座
  }
  // 金牛座：4月20日 - 5月20日
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 1 // 金牛座
  }
  // 双子座：5月21日 - 6月21日
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return 2 // 双子座
  }
  // 巨蟹座：6月22日 - 7月22日
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return 3 // 巨蟹座
  }
  // 狮子座：7月23日 - 8月22日
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 4 // 狮子座
  }
  // 处女座：8月23日 - 9月22日
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 5 // 处女座
  }
  // 天秤座：9月23日 - 10月23日
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return 6 // 天秤座
  }
  // 天蝎座：10月24日 - 11月22日
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return 7 // 天蝎座
  }
  // 射手座：11月23日 - 12月21日
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return 8 // 射手座
  }

  return 0 // 默认返回白羊座（理论上不会到这里）
}

const RELATIONSHIP_DESCRIPTIONS: Record<string, string> = {
  六合: '黄道十二宫中相隔 60° 的和谐相位，象征天然默契与互补，彼此容易欣赏对方的优点。',
  三合: '相隔 120° 的三合局，代表志趣相投、互相扶持，是稳定且能共同成长的组合。',
  同象: '同属一种元素，价值观与处事节奏相近，理解成本低，但需避免陷入同质化。',
  相同: '同星座组合，彼此像照镜子，共鸣强烈，但也容易放大相同的缺点。',
  对宫: '相隔 180° 的对立相位，吸引力与冲突并存，差异明显，需要更多包容与磨合。',
  相刑: '相隔 90° 的紧张相位，容易在关键议题上僵持，需要学习用不同方式表达需求。',
  普通: '没有显著相合或相冲相位，关系走向更多取决于沟通方式与相处耐心。',
}

const RELATIONSHIP_DESCRIPTIONS_EN: Record<string, string> = {
  六合: 'A harmonious 60° aspect suggesting natural rapport and complementary strengths.',
  三合: 'A supportive 120° trine that favors shared aims and steady growth together.',
  同象: 'The same element style — values and pacing align easily, though sameness can feel flat if you never diversify.',
  相同: 'The same sign pairing mirrors each other strongly — deep resonance, but shared flaws can amplify.',
  对宫: 'An opposition of 180° — attraction and friction coexist, asking for patience and translation.',
  相刑: 'A tense 90° square that can stall on key issues until both sides learn new ways to ask for needs.',
  普通: 'No strong harmony or clash aspect; the tone of the bond depends mainly on communication and care.',
}

const COMPATIBILITY_EN: Record<string, string> = {
  极佳: 'Excellent',
  良好: 'Good',
  中等: 'Moderate',
  一般: 'Fair',
  较差: 'Challenging',
}

const COMPATIBILITY_EN_REVERSE: Record<string, string> = {
  Excellent: '极佳',
  Good: '良好',
  Moderate: '中等',
  Fair: '一般',
  Challenging: '较差',
}

const RELATIONSHIP_EN: Record<string, string> = {
  六合: 'Sextile',
  三合: 'Trine',
  同象: 'Same element',
  相同: 'Same sign',
  对宫: 'Opposition',
  相刑: 'Square',
  普通: 'Neutral',
}

const RELATIONSHIP_EN_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(RELATIONSHIP_EN).map(([zh, en]) => [en, zh]),
)

const DIMENSION_KEY_EN: Record<string, string> = {
  爱情默契: 'Romance',
  沟通理解: 'Communication',
  信任稳定: 'Trust',
  激情吸引: 'Attraction',
  长久潜力: 'Long-term',
}

const ANALYSIS_EN: Record<string, string> = {
  六合: 'A sextile is one of the most supportive pairings — harmony and complementarity come naturally. You tend to find balance in pace and values, and disagreements lean toward negotiation rather than escalation. Keep naming appreciation so the ease never becomes taken for granted.',
  三合: 'A trine favors mutual support and shared growth. You often agree on what matters and show up practically for each other. Shared goals give this bond lasting momentum.',
  同象: 'Same-element pairings understand each other quickly and share topics easily, but similarity can tip into monotony. Keep separate hobbies and solitude so the relationship stays fresh.',
  对宫: 'Opposition pairs feel both magnetic and challenging. Differences are obvious, yet they can become a powerful complement if you treat contrast as learning rather than a project to fix the other person.',
  相刑: 'A square can create friction around key issues. Name boundaries early, pause when stuck, and look for the need beneath the argument before seeking compromise.',
  相同: 'Same-sign pairings feel like looking in a mirror — easy empathy, but shared blind spots can intensify. Build complementary habits so the bond doesn’t only replay one pattern.',
  普通: 'Without a strong harmony or clash aspect, this pairing is wide open. How you communicate and repair will define the tone more than any fixed chart pattern.',
}

const ELEMENT_SAME_DYNAMIC_EN: Record<ZodiacElement, string> = {
  火: 'Two fire signs spark easily and move fast — great for momentum, as long as you leave cooling-off room.',
  土: 'Two earth signs build steadily and practically — reliable, though a little improvisation keeps things alive.',
  风: 'Two air signs thrive on ideas and dialogue — write down conclusions so talk turns into follow-through.',
  水: 'Two water signs feel deeply together — self-soothe first when emotions flood, then reconnect.',
}

const ELEMENT_CROSS_DYNAMIC_EN: Record<string, string> = {
  '火-土': 'Fire brings initiative; earth brings pacing. Translate needs between speed and stability.',
  '火-风': 'Fire wants action; air wants options. Feedback plus patience keeps enthusiasm from scattering.',
  '火-水': 'Fire moves outward; water moves inward. Slow the pace and name feelings to avoid misfires.',
  '土-风': 'Air offers possibilities; earth chooses. Clear roles make decisions lighter.',
  '土-水': 'Earth shows care through action; water through words. Confirm love in both languages.',
  '风-水': 'Air analyzes; water feels. Listen before interpreting, feel before explaining.',
}

const ELEMENT_SAME_DYNAMIC: Record<ZodiacElement, string> = {
  火: '双火象相遇，热情与行动力翻倍，但也容易争强好胜，学会轮流主导关系会更和谐。',
  土: '双土象组合，务实稳重、目标一致，适合共建生活，但要留一点浪漫与弹性空间。',
  风: '双风象配对，思维活跃、话题不断，精神契合度高，需把想法落实成共同行动。',
  水: '双水象联结，情感细腻、共鸣深刻，安全感强，但要避免情绪叠加带来的内耗。',
}

const ELEMENT_CROSS_DYNAMIC: Record<string, string> = {
  '火-土': '火象推动、土象落地，一个冲锋一个守成，节奏不同但可形成互补，关键是尊重彼此步调。',
  '火-风': '风助火势，创意与行动力相互激发，是充满活力、容易擦出火花的组合。',
  '火-水': '水火相济亦相克，情感浓度高但表达方式迥异，需要更多耐心翻译彼此的心意。',
  '土-风': '土象重实际、风象重理念，一个要结果一个要可能性，对齐预期后协作会更顺。',
  '土-水': '土为水筑堤，水润土生机，稳定与温柔并存，适合细水长流的感情经营。',
  '风-水': '风象理性、水象感性，一个讲逻辑一个重感受，深度沟通是这段关系的核心课题。',
}

const ELEMENT_ORDER: Record<ZodiacElement, number> = { 火: 0, 土: 1, 风: 2, 水: 3 }

function pairingSeed(signIndex1: number, signIndex2: number): number {
  const a = Math.min(signIndex1, signIndex2)
  const b = Math.max(signIndex1, signIndex2)
  return a * 12 + b + 1
}

function getElementDynamic(element1: ZodiacElement, element2: ZodiacElement): string {
  if (element1 === element2) {
    return isEnglishLocale() ? ELEMENT_SAME_DYNAMIC_EN[element1] : ELEMENT_SAME_DYNAMIC[element1]
  }
  const [left, right] = [element1, element2].sort(
    (a, b) => ELEMENT_ORDER[a] - ELEMENT_ORDER[b],
  )
  const key = `${left}-${right}`
  return isEnglishLocale()
    ? ELEMENT_CROSS_DYNAMIC_EN[key] ?? ELEMENT_CROSS_DYNAMIC[key]
    : ELEMENT_CROSS_DYNAMIC[key]
}

function localizePairingResult(result: PairingResult): PairingResult {
  if (!isEnglishLocale()) return result

  const primaryRel = result.relationships[0] ?? '普通'
  const sign1Name = ZODIAC_SIGNS.find((s) => s.name === result.sign1.name)?.nameEn ?? result.sign1.name
  const sign2Name = ZODIAC_SIGNS.find((s) => s.name === result.sign2.name)?.nameEn ?? result.sign2.name
  const compatibility = COMPATIBILITY_EN[result.compatibility] ?? result.compatibility
  const relationships = result.relationships.map((rel) => RELATIONSHIP_EN[rel] ?? rel)

  return {
    ...result,
    sign1: { ...result.sign1, name: sign1Name },
    sign2: { ...result.sign2, name: sign2Name },
    relationships,
    relationshipNotes: result.relationships.map((type) => ({
      type: RELATIONSHIP_EN[type] ?? type,
      description: RELATIONSHIP_DESCRIPTIONS_EN[type] ?? RELATIONSHIP_DESCRIPTIONS_EN['普通'],
    })),
    compatibility,
    summary: buildPairingSummaryEn(sign1Name, sign2Name, result.compatibility, primaryRel),
    analysis: ANALYSIS_EN[primaryRel] ?? ANALYSIS_EN['普通'],
    elementDynamic: getElementDynamic(result.sign1.element, result.sign2.element),
    dimensions: result.dimensions.map((dim, index) => ({
      key: DIMENSION_KEY_EN[dim.key] ?? dim.key,
      value: dim.value,
      text: DIMENSION_TEXT_EN[index % DIMENSION_TEXT_EN.length],
    })),
    strengths: STRENGTHS_EN.slice(0, 3),
    challenges: CHALLENGES_EN.slice(0, 3),
    advice: ADVICE_EN[result.compatibility] ?? ADVICE_EN['中等'],
  }
}

function buildPairingSummaryEn(
  sign1Name: string,
  sign2Name: string,
  compatibility: string,
  primaryRel: string,
): string {
  const rel = RELATIONSHIP_EN[primaryRel] ?? primaryRel
  if (compatibility === '极佳') {
    return `${sign1Name} and ${sign2Name} form a high-fit pairing. The ${rel} aspect supports natural chemistry and mutual growth.`
  }
  if (compatibility === '良好') {
    return `${sign1Name} and ${sign2Name} work well overall. The ${rel} dynamic gives the bond a solid base that deepens with care.`
  }
  if (compatibility === '较差' || compatibility === '一般') {
    return `${sign1Name} and ${sign2Name} show clearer differences. The ${rel} aspect asks for patience, translation, and repair skills.`
  }
  return `${sign1Name} and ${sign2Name} sit in a moderate fit — relationship quality hinges on expression and generosity.`
}

const DIMENSION_TEXT_EN = [
  'Chemistry is available here; name preferences early so closeness stays comfortable.',
  'Clear check-ins prevent small misunderstandings from stacking up.',
  'Consistency builds safety faster than dramatic promises.',
  'Keep a little novelty alive so attraction doesn’t flatten into routine.',
  'Shared goals and repair habits decide whether this lasts.',
]

const STRENGTHS_EN = [
  'You can return to shared goals instead of turning every disagreement into a contest.',
  'Different strengths create useful balance when both sides feel respected.',
  'Shared interests make it easier to protect quality time together.',
]

const CHALLENGES_EN = [
  'Different pacing can create misunderstandings if expectations stay unspoken.',
  'Unspoken needs may build tension until one side finally overflows.',
  'Both people need room for individual rhythms and private recovery time.',
]

const ADVICE_EN: Record<string, string> = {
  极佳: 'Keep appreciation explicit, try something new together regularly, and leave space for independent growth.',
  良好: 'Treat friction as information, schedule small relationship check-ins, and express care in the form the other person can receive.',
  中等: 'Align core values before debating details, avoid major decisions when exhausted, and build one shared hobby as a positive link.',
  一般: 'Name boundaries clearly, pause to restate each other’s point in conflict, and use shared interests to soften stalemates.',
  较差: 'State expectations instead of assuming mind-reading, prioritize repair over blame, and honestly review whether the pattern still nourishes you.',
}

function genPairingDimensionText(
  seed: number,
  aspect: string,
  element1: ZodiacElement,
  element2: ZodiacElement,
  relationships: string[],
  value: number,
): string {
  const tone = value >= 80 ? '亮点突出' : value >= 65 ? '整体平稳' : value >= 50 ? '需要经营' : '是主要课题'
  const relHint = relationships.includes('六合') || relationships.includes('三合')
    ? '相位和谐为这项加分，自然默契较高。'
    : relationships.includes('对宫') || relationships.includes('相刑')
      ? '相位紧张时这项更容易起摩擦，宜提前沟通底线。'
      : '没有强烈相位牵引，表现主要取决于双方意愿。'

  const elementHints: Record<string, string[]> = {
    '爱情默契': [
      '情感表达方式相近，容易感知彼此的需要。',
      '一方主动、一方回应，慢慢会形成稳定的互动节奏。',
      '需要更多仪式感来确认彼此的心意。',
    ],
    '沟通理解': [
      '讨论问题时能听懂弦外之音，减少误会。',
      '一方偏理性、一方偏感性，翻译彼此语言是关键。',
      '宜设立固定沟通时间，避免情绪累积。',
    ],
    '信任稳定': [
      '对承诺与边界有共识，安全感较强。',
      '需要用行动而非口头保证来建立信任。',
      '过去经历可能影响信任速度，给予耐心很重要。',
    ],
    '激情吸引': [
      '初识即有化学反应，保持新鲜感是长久课题。',
      '吸引力更多来自精神契合而非外表火花。',
      '稳定后需主动制造惊喜，避免关系趋于平淡。',
    ],
    '长久潜力': [
      '价值观方向一致，适合共同规划未来。',
      '短期热烈，长期需靠制度化的相处习惯维系。',
      '若能在冲突后修复关系，后劲会很足。',
    ],
  }

  const pool = [
    `${aspect}${tone}。${relHint}`,
    `${aspect}方面，${element1}象与${element2}象的组合${select(seed, elementHints[aspect] ?? elementHints['爱情默契'])}`,
    `${aspect}${tone}，${select(seed + 3, elementHints[aspect] ?? elementHints['爱情默契'])}`,
  ]
  return select(seed, pool)
}

function genPairingDimensions(
  seed: number,
  score: number,
  element1: ZodiacElement,
  element2: ZodiacElement,
  relationships: string[],
): PairingDimension[] {
  const keys = ['爱情默契', '沟通理解', '信任稳定', '激情吸引', '长久潜力'] as const
  return keys.map((key, index) => {
    const offset = (hash(seed + index * 17) % 21) - 10
    const value = Math.max(35, Math.min(98, score + offset))
    return {
      key,
      value,
      text: genPairingDimensionText(seed + index * 11, key, element1, element2, relationships, value),
    }
  })
}

function genPairingStrengths(
  seed: number,
  relationships: string[],
  element1: ZodiacElement,
  element2: ZodiacElement,
): string[] {
  const pool = [
    '遇到分歧时愿意回到共同目标，而不是一味争输赢。',
    '能欣赏对方与自己不同的特质，形成互补而非对立。',
    '对彼此的社交圈与私人空间有基本尊重。',
    '在重要决定上愿意协商，而非单方面做主。',
    '有共同的兴趣或目标，容易制造高质量相处时间。',
    '一方擅长表达、一方擅长倾听，沟通结构较健康。',
    '面对压力时能互相支持，而不是相互指责。',
    '对关系有长期经营的意识，不满足于短期热烈。',
    `${element1}象的${element1 === '火' ? '行动力' : element1 === '土' ? '可靠性' : element1 === '风' ? '灵活性' : '共情力'}为关系提供稳定支点。`,
    `${element2}象带来的${element2 === '火' ? '热情' : element2 === '土' ? '务实' : element2 === '风' ? '视野' : '温柔'}让相处更有层次。`,
  ]

  if (relationships.includes('六合') || relationships.includes('三合')) {
    pool.unshift('天然相位和谐，很多默契不需要刻意培养。')
  }
  if (element1 === element2) {
    pool.unshift('同元素背景相近，理解彼此的价值观成本较低。')
  }

  const picks: string[] = []
  for (let i = 0; i < 3; i += 1) {
    const item = select(seed + i * 7, pool.filter((p) => !picks.includes(p)))
    picks.push(item)
  }
  return picks
}

function genPairingChallenges(
  seed: number,
  relationships: string[],
  element1: ZodiacElement,
  element2: ZodiacElement,
): string[] {
  const pool = [
    '节奏不一致时，一方觉得被冷落、另一方觉得被催促。',
    '遇到压力时表达方式不同，容易被误解为冷漠或情绪化。',
    '对安全感的需求不同，需要明确边界与回应频率。',
    '生活习惯与消费观存在差异，宜尽早对齐预期。',
    '在亲友介入或社交安排上，可能出现优先级冲突。',
    '一方爱计划、一方爱即兴，行程协调需要额外耐心。',
    '争执后冷战或翻旧账，会消耗信任存量。',
    '对「浪漫」的定义不同，容易觉得对方不够用心。',
  ]

  if (relationships.includes('对宫') || relationships.includes('相刑')) {
    pool.unshift('对立相位下，小事也容易被放大成原则问题。')
  }
  if (element1 !== element2 && (element1 === '火' && element2 === '水' || element1 === '水' && element2 === '火')) {
    pool.unshift('水火元素差异大，情绪升温时容易说出伤人的话。')
  }

  const picks: string[] = []
  for (let i = 0; i < 3; i += 1) {
    const item = select(seed + i * 13, pool.filter((p) => !picks.includes(p)))
    picks.push(item)
  }
  return picks
}

function genPairingAdvice(
  seed: number,
  compatibility: string,
  relationships: string[],
  element1: ZodiacElement,
  element2: ZodiacElement,
): string {
  const byCompat: Record<string, string[]> = {
    极佳: [
      '保持欣赏与表达感激，别让默契变成理所当然。',
      '定期一起做一件新鲜事，让高契合度持续被激活。',
      '在优势领域互相成就，同时留一点独立成长空间。',
    ],
    良好: [
      '把分歧当作了解彼此的入口，而不是关系的威胁。',
      '建立固定的「关系复盘」时间，小问题不过夜。',
      '用对方能接收的方式表达爱意，比用力过猛更有效。',
    ],
    中等: [
      '先对齐核心价值观，再讨论日常细节，顺序很重要。',
      '减少在疲惫时做重大决定，情绪平稳后再沟通。',
      '找到一项共同爱好，为关系制造稳定的正向连接。',
    ],
    一般: [
      '明确彼此的底线与雷区，比反复试探更省力。',
      '争执时先暂停、再复述对方观点，确认听懂了再继续。',
      '必要时引入第三方视角（朋友或共同兴趣圈）缓和僵局。',
    ],
    较差: [
      '把期待说清楚，避免用「你应该懂我」来要求对方。',
      '冲突后关注修复而非追责，关系比输赢更重要。',
      '若长期消耗大于滋养，需要诚实评估是否调整相处模式。',
    ],
  }

  const elementAdvice: Record<string, string> = {
    '火-火': '约定「冷静角」，争执升温时先各自降温再谈。',
    '土-土': '偶尔打破常规安排，一点即兴能为稳定关系注入活力。',
    '风-风': '把讨论结论写下来，避免想法多、落地少。',
    '水-水': '情绪过载时先自我安抚，再向对方寻求安慰。',
    '火-土': '火象表达需求，土象说明节奏，互相翻译很关键。',
    '火-风': '风象多给反馈，火象多给耐心，别让热情落空。',
    '火-水': '水象说出真实感受，火象放慢语速，减少误伤。',
    '土-风': '风象提供选项，土象做最终决定，分工明确更省心。',
    '土-水': '土象用行动回应，水象用语言表达，双向确认爱意。',
    '风-水': '风象先倾听再分析，水象先感受再表达，顺序对了就顺一半。',
  }

  const compatPool = byCompat[compatibility] ?? byCompat['中等']
  const elementKey = element1 === element2
    ? `${element1}-${element2}`
    : [element1, element2].sort((a, b) => ELEMENT_ORDER[a] - ELEMENT_ORDER[b]).join('-')

  const pool = [...compatPool]
  if (elementAdvice[elementKey]) pool.push(elementAdvice[elementKey])
  if (relationships.includes('对宫')) {
    pool.push('对宫组合宜「求同存异」：争论前先列出三个彼此欣赏的点。')
  }

  return select(seed, pool)
}

function buildPairingSummary(
  sign1Name: string,
  sign2Name: string,
  compatibility: string,
  relationships: string[],
): string {
  const rel = relationships[0] ?? '普通'
  if (compatibility === '极佳') {
    return `${sign1Name}与${sign2Name}属于高契合组合，${rel}相位带来天然默契，适合在互相欣赏中共同成长。`
  }
  if (compatibility === '良好') {
    return `${sign1Name}与${sign2Name}整体协调，${rel}关系为相处打下良好基础，用心经营会更稳。`
  }
  if (compatibility === '较差' || compatibility === '一般') {
    return `${sign1Name}与${sign2Name}差异较为明显，${rel}相位提示需要更多耐心与沟通技巧。`
  }
  return `${sign1Name}与${sign2Name}属于中等契合，关系质量取决于双方的表达与包容。`
}

// 星座配对分析函数
export function analyzeZodiacPairing(signIndex1: number, signIndex2: number): PairingResult {
  const sign1 = ZODIAC_SIGNS[signIndex1]
  const sign2 = ZODIAC_SIGNS[signIndex2]
  const seed = pairingSeed(signIndex1, signIndex2)

  if (signIndex1 === signIndex2) {
    const relationships = ['相同']
    const score = 55
    const compatibility = '中等'
    const analysis = '相同星座的配对，双方性格相似，容易理解彼此，但也可能因为过于相似而缺乏互补性。需要更多的沟通和包容来维持关系。'
    return localizePairingResult({
      sign1: { name: sign1.name, symbol: sign1.symbol, element: sign1.element },
      sign2: { name: sign2.name, symbol: sign2.symbol, element: sign2.element },
      relationships,
      relationshipNotes: relationships.map((type) => ({
        type,
        description: RELATIONSHIP_DESCRIPTIONS[type],
      })),
      score,
      compatibility,
      summary: buildPairingSummary(sign1.name, sign2.name, compatibility, relationships),
      analysis,
      elementDynamic: getElementDynamic(sign1.element, sign2.element),
      dimensions: genPairingDimensions(seed, score, sign1.element, sign2.element, relationships),
      strengths: genPairingStrengths(seed, relationships, sign1.element, sign2.element),
      challenges: genPairingChallenges(seed + 5, relationships, sign1.element, sign2.element),
      advice: genPairingAdvice(seed + 9, compatibility, relationships, sign1.element, sign2.element),
    })
  }

  const element1 = sign1.element
  const element2 = sign2.element

  const relationships: string[] = []
  let score = 50 // 基础分数
  let compatibility = '中等'

  // 检查同象（相同元素）
  if (element1 === element2) {
    relationships.push('同象')
    score += 20
    if (compatibility === '中等') {
      compatibility = '良好'
    }
  }

  // 检查对宫（180度，相差6个位置）
  const diff = Math.abs(signIndex1 - signIndex2)
  if (diff === 6) {
    relationships.push('对宫')
    score -= 25
    compatibility = '较差'
  }

  // 检查三合（120度，相差4个位置）
  if (diff === 4 || diff === 8) {
    relationships.push('三合')
    score += 25
    if (compatibility !== '较差') {
      compatibility = '良好'
    }
  }

  // 检查六合（60度，相差2个位置）
  if (diff === 2 || diff === 10) {
    relationships.push('六合')
    score += 30
    compatibility = '极佳'
  }

  // 检查相刑（90度，相差3个位置）
  if (diff === 3 || diff === 9) {
    relationships.push('相刑')
    score -= 15
    if (compatibility === '极佳' || compatibility === '良好') {
      compatibility = '一般'
    } else if (compatibility === '中等') {
      compatibility = '较差'
    }
  }

  // 如果没有特殊关系
  if (relationships.length === 0) {
    relationships.push('普通')
  }

  // 限制分数范围
  score = Math.max(0, Math.min(100, score))

  // 生成详细分析
  let analysis = ''
  if (relationships.includes('六合')) {
    analysis = '六合是最佳的配对关系，代表和谐、互补，双方性格相投，容易产生默契，是星座配对中最为理想的组合。彼此在生活节奏与价值取向上容易找到平衡点，即使遇到分歧也倾向于协商解决。长期相处时，保持欣赏与表达感激，能让高契合度持续发光。'
  } else if (relationships.includes('三合')) {
    analysis = '三合是良好的配对关系，代表三合局，双方能够互相支持，共同成长，关系稳定和谐。你们容易在重要议题上达成一致，也擅长在对方需要时提供实际支持。若能一起设立共同目标，这段关系会展现出很强的后劲。'
  } else if (relationships.includes('同象')) {
    analysis = '同象星座的配对，双方性格相似，容易理解彼此，有共同的话题和兴趣，但需要注意避免过于相似带来的单调。建议刻意培养一些不同的爱好或社交圈，让关系保持新鲜度，同时尊重彼此需要独处的时间。'
  } else if (relationships.includes('对宫')) {
    analysis = '对宫代表对立冲突，双方性格差异较大，容易产生矛盾和争执，需要更多的理解和包容。但若能互补，也能形成强大的吸引力。关键在于把差异视为学习机会，而非改造对方的理由。争执后及时修复，比争输赢更重要。'
  } else if (relationships.includes('相刑')) {
    analysis = '相刑代表相互制约，双方在相处中可能会有一些摩擦和冲突，需要更多的耐心和理解。建议提前沟通底线与雷区，遇到僵局时暂停争论、确认彼此真实需求，再寻找折中方案。'
  } else {
    analysis = '普通配对关系，双方没有明显的相合或相冲，关系发展主要取决于个人的性格和相处方式。这意味着你们有较大的自由度去定义这段关系——用心经营、建立默契，完全可以走出属于自己的节奏。'
  }

  const relationshipNotes = relationships.map((type) => ({
    type,
    description: RELATIONSHIP_DESCRIPTIONS[type] ?? RELATIONSHIP_DESCRIPTIONS['普通'],
  }))

  return localizePairingResult({
    sign1: { name: sign1.name, symbol: sign1.symbol, element: sign1.element },
    sign2: { name: sign2.name, symbol: sign2.symbol, element: sign2.element },
    relationships,
    relationshipNotes,
    score,
    compatibility,
    summary: buildPairingSummary(sign1.name, sign2.name, compatibility, relationships),
    analysis,
    elementDynamic: getElementDynamic(element1, element2),
    dimensions: genPairingDimensions(seed, score, element1, element2, relationships),
    strengths: genPairingStrengths(seed, relationships, element1, element2),
    challenges: genPairingChallenges(seed + 5, relationships, element1, element2),
    advice: genPairingAdvice(seed + 9, compatibility, relationships, element1, element2),
  })
}

export function compatTagClass(compatibility: string): string {
  const key = COMPATIBILITY_EN_REVERSE[compatibility] ?? compatibility
  if (key === '极佳' || key === '良好') return 'tag tag--good'
  if (key === '中等' || key === '一般') return 'tag tag--ok'
  return 'tag tag--bad'
}

export function relTagClass(rel: string): string {
  const key = RELATIONSHIP_EN_REVERSE[rel] ?? rel
  if (key === '六合' || key === '三合') return 'tag tag--good'
  if (key === '同象' || key === '相同') return 'tag tag--info'
  if (key === '对宫' || key === '相刑') return 'tag tag--bad'
  return 'tag tag--muted'
}
