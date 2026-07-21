import type { MatchedDreamSymbol } from '../data/dreamSymbols'
import { dreamSymbols, findDreamSymbols } from '../data/dreamSymbols'
import { dreamSymbolsEn } from '../data/dreamSymbols.en'
import { isEnglishLocale } from '../i18n/locale'

const MOOD_META: Record<
  string,
  { label: string; tone: string; lean: 'positive' | 'negative' | 'neutral'; suffix: string }
> = {
  calm: {
    label: '安宁',
    tone: '梦中气息平和，心绪如止水',
    lean: 'neutral',
    suffix: '保持这份清明，让梦境的信息在安静中慢慢浮现。',
  },
  fear: {
    label: '恐惧',
    tone: '梦中弥漫着紧张与不安',
    lean: 'negative',
    suffix: '恐惧往往是内心在提醒你：有某事需要被看见，而非被继续压抑。',
  },
  joy: {
    label: '欣喜',
    tone: '梦中带着轻快与喜悦',
    lean: 'positive',
    suffix: '把这份愉悦带回日间，留意是什么在现实中滋养了你。',
  },
  confused: {
    label: '迷茫',
    tone: '梦中混沌难辨，方向不清',
    lean: 'neutral',
    suffix: '迷茫本身即是信号——不必急于定论，先记录感受，答案常在日后浮现。',
  },
  sad: {
    label: '忧伤',
    tone: '梦中含着怅惘与失落',
    lean: 'negative',
    suffix: '允许悲伤存在，它往往指向你真正在意却尚未说出口的事。',
  },
}

const MOOD_META_EN: Record<
  string,
  { label: string; tone: string; lean: 'positive' | 'negative' | 'neutral'; suffix: string }
> = {
  calm: {
    label: 'Calm',
    tone: 'The dream feels steady, with a quiet mind like still water',
    lean: 'neutral',
    suffix: 'Keep this clarity and let the dream’s message surface slowly in the quiet.',
  },
  fear: {
    label: 'Fear',
    tone: 'The dream is filled with tension and unease',
    lean: 'negative',
    suffix: 'Fear is often your inner voice asking you to notice something—not keep burying it.',
  },
  joy: {
    label: 'Joy',
    tone: 'The dream carries lightness and delight',
    lean: 'positive',
    suffix: 'Bring that brightness into the daytime, and notice what in waking life is nourishing you.',
  },
  confused: {
    label: 'Confused',
    tone: 'The dream feels murky, with no clear direction',
    lean: 'neutral',
    suffix: 'Confusion itself is a signal—don’t rush to conclusions. Record the feeling; answers often arrive later.',
  },
  sad: {
    label: 'Sad',
    tone: 'The dream holds longing and loss',
    lean: 'negative',
    suffix: 'Allow sadness to exist. It often points to what you care about but have not yet spoken.',
  },
}

const CATEGORY_NARRATIVE: Record<string, string> = {
  动物: '兽象入梦，多与本能、直觉及生命力相关',
  自然: '山水天象，映照情绪波动与生命节律',
  人物: '梦中之人，常是自我某一面或重要关系的投影',
  建筑: '楼台殿宇，象征内心结构与安全感',
  物品: '器物入梦，关联价值感、身份与日常秩序',
  动作: '行止动静，揭示你正在靠近或逃避的事',
}

const CATEGORY_NARRATIVE_EN: Record<string, string> = {
  动物: 'Animals in dreams often relate to instinct, intuition, and life force',
  自然: 'Nature scenes mirror emotional tides and the body’s rhythms',
  人物: 'People in dreams often reflect a part of the self or an important relationship',
  建筑: 'Places and structures symbolize inner architecture and feelings of safety',
  物品: 'Objects point to value, identity, and the order of daily life',
  动作: 'Actions reveal what you are moving toward—or away from',
}

const FALLBACK_REFLECTIONS = [
  '今夜不妨在睡前写三行梦记：场景、情绪、醒来后的第一感受。',
  '若同一意象反复出现，可试着画下它——图像有时比语言更接近潜意识。',
  '问自己：这个梦若是一封信，它最想告诉我什么？',
  '把梦中最鲜明的一个画面带入白天，观察它何时会再次浮现。',
]

const FALLBACK_REFLECTIONS_EN = [
  'Tonight, write three lines before sleep: the scene, the emotion, and your first feeling upon waking.',
  'If the same image returns, try drawing it—images can reach the unconscious faster than words.',
  'Ask yourself: if this dream were a letter, what would it most want you to know?',
  'Carry the most vivid scene into the day and notice when it quietly returns.',
]

const DREAM_OPENINGS = [
  '这不像一个孤立的画面，更像内心对近期生活做的一次隐喻式整理',
  '梦没有直说答案，而是借意象把你白天忽略的感受放大了',
  '这场梦像一封用图像写成的信，关键不只在发生了什么，更在你当时如何感受',
]

const DREAM_OPENINGS_EN = [
  'This doesn’t feel like an isolated scene—it feels more like your mind arranging recent life into metaphor',
  'The dream doesn’t speak the answer directly; it amplifies feelings you overlooked during the day',
  'This dream is like a letter written in images—the key is not only what happened, but how you felt',
]

function symbolSeed(symbols: MatchedDreamSymbol[]): number {
  return symbols.reduce((sum, symbol) => sum + [...symbol.matchedKeyword].reduce((n, char) => n + char.charCodeAt(0), 0), 0)
}

export interface DreamInterpretation {
  symbols: MatchedDreamSymbol[]
  overview: string
  emotionalTone: string | null
  themes: string
  symbolNarrative: string
  advice: string
  reflection: string
}

function localizeMatchedSymbols(symbols: MatchedDreamSymbol[], isEnglish: boolean): MatchedDreamSymbol[] {
  if (!isEnglish) return symbols

  return symbols.map((symbol) => {
    const index = dreamSymbols.findIndex((item) => item.keywords[0] === symbol.keywords[0])
    const locale = index >= 0 ? dreamSymbolsEn[index] : undefined
    if (!locale) return symbol

    return {
      ...symbol,
      category: locale.category,
      meaning: locale.meaningEn,
      interpretation: locale.interpretationEn,
      positive: locale.positiveEn,
      negative: locale.negativeEn,
      advice: locale.adviceEn,
      themes: locale.themesEn,
    }
  })
}

function findDreamSymbolsLocalized(content: string, isEnglish: boolean): MatchedDreamSymbol[] {
  const matched = findDreamSymbols(content)
  return localizeMatchedSymbols(matched, isEnglish)
}

function pickLeanText(symbol: MatchedDreamSymbol, lean: 'positive' | 'negative' | 'neutral'): string {
  if (lean === 'positive') return symbol.positive
  if (lean === 'negative') return symbol.negative
  return `${symbol.positive} ${symbol.negative}`
}

function buildThemes(symbols: MatchedDreamSymbol[], isEnglish: boolean): string {
  const themeCounts = new Map<string, number>()
  for (const s of symbols) {
    for (const t of s.themes) {
      themeCounts.set(t, (themeCounts.get(t) ?? 0) + 1)
    }
  }
  const sorted = [...themeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  if (sorted.length === 0) return ''

  if (isEnglish) {
    const parts = sorted.map(([t, n]) => (n > 1 ? `${t} (${n}×)` : t))
    const focus = sorted[0][0]
    const tail =
      sorted.length > 1
        ? `“${focus}” is the main axis; the other themes fill in its source and direction.`
        : `A single theme keeps returning—suggesting this may be the issue that matters most right now.`
    return `Dream themes cluster around: ${parts.join(', ')}. ${tail}`
  }

  const parts = sorted.map(([t, n]) => (n > 1 ? `${t}（${n}次）` : t))
  const focus = sorted[0][0]
  const tail =
    sorted.length > 1
      ? `「${focus}」是主轴，其余主题像支线一样补足了它的来源与去向。`
      : `单一主题反复聚焦，说明它可能正是你近期最在意的课题。`
  return `梦意主题集中在：${parts.join('、')}。${tail}`
}

function categoryKeyOf(symbol: MatchedDreamSymbol): string {
  const index = dreamSymbols.findIndex((item) => item.keywords[0] === symbol.keywords[0])
  if (index >= 0) {
    return dreamSymbolsEn[index]?.categoryKey ?? dreamSymbols[index].category
  }
  return symbol.category
}

function buildSymbolNarrative(symbols: MatchedDreamSymbol[], isEnglish: boolean): string {
  const categoryNarrative = isEnglish ? CATEGORY_NARRATIVE_EN : CATEGORY_NARRATIVE
  const openings = isEnglish ? DREAM_OPENINGS_EN : DREAM_OPENINGS

  if (symbols.length === 1) {
    const s = symbols[0]
    const catNote = categoryNarrative[categoryKeyOf(s)] ?? ''
    if (isEnglish) {
      return `In the dream, “${s.matchedKeyword}” stands out most clearly. ${catNote}. ${s.interpretation}`
    }
    return `梦中「${s.matchedKeyword}」最为醒目。${catNote}。${s.interpretation}`
  }

  const categoryKeys = [...new Set(symbols.map((s) => categoryKeyOf(s)))]
  const catNotes = categoryKeys
    .map((c) => categoryNarrative[c] ?? '')
    .filter(Boolean)
    .join(isEnglish ? '; ' : '；')

  const highlights = symbols
    .slice(0, 4)
    .map((s) => (isEnglish ? `“${s.matchedKeyword}” ${s.meaning}` : `「${s.matchedKeyword}」${s.meaning}`))
    .join(isEnglish ? ', ' : '、')

  let narrative = `${openings[symbols.length % openings.length]}${isEnglish ? '. ' : '。'}${
    isEnglish
      ? `Among them, ${symbols.length} images intertwine: ${highlights}`
      : `其中${symbols.length}个意象交织：${highlights}`
  }`
  if (symbols.length > 4) narrative += isEnglish ? ', and more' : '等'
  narrative += isEnglish ? `. ${catNotes}.` : `。${catNotes}。`

  if (symbols.length >= 2) {
    const [a, b] = symbols
    if (isEnglish) {
      const relation =
        a.category === b.category
          ? 'two sides of the same psychological theme'
          : 'a dialogue between inner need and outer circumstance'
      narrative += ` “${a.matchedKeyword}” points to ${a.themes[0]}, while “${b.matchedKeyword}” involves ${b.themes[0]}; placed together, they feel more like ${relation} than unrelated signs.`
    } else {
      const relation = a.category === b.category ? '同一心理课题的两个侧面' : '内在需求与外部处境的对话'
      narrative += `「${a.matchedKeyword}」指向${a.themes[0]}，「${b.matchedKeyword}」牵涉${b.themes[0]}；二者并置，更像${relation}，而不是两个彼此无关的符号。`
    }
  }

  return narrative
}

function buildOverview(
  symbols: MatchedDreamSymbol[],
  moodMeta: { label: string; tone: string; lean: 'positive' | 'negative' | 'neutral'; suffix: string } | undefined,
  isEnglish: boolean,
): string {
  if (symbols.length === 0) {
    const moodPrefix = moodMeta ? `${moodMeta.tone}${isEnglish ? '. ' : '。'}` : ''
    if (isEnglish) {
      return `${moodPrefix}Your dream imagery is quite unique and didn’t match common symbols—that doesn’t make it less meaningful. Unique dreams often point more directly to personal experience than generic symbols. Pay special attention to emotional intensity, color, and repeating details; they often say more than the plot itself.`
    }
    return `${moodPrefix}你的梦境意象较为独特，未命中常见符号库——这并不减损其价值。独特梦境往往直指个人经验，比通用象征更贴近你的处境。请特别留意梦中的情绪强度、色彩与重复出现的细节，它们往往比情节本身更能说明问题。`
  }

  const moodPrefix = moodMeta ? `${moodMeta.tone}${isEnglish ? '. ' : '。'}` : ''
  const categories = [...new Set(symbols.map((s) => s.category))]

  if (symbols.length === 1) {
    const s = symbols[0]
    if (isEnglish) {
      const singleOpenings = [
        `The whole dream keeps the camera on “${s.matchedKeyword}”, carrying the sense of ${s.meaning}`,
        `If only one image remains after waking, “${s.matchedKeyword}” is the center of this dream`,
        `This dream doesn’t scatter many clues—it repeatedly emphasizes “${s.matchedKeyword}” as ${s.themes[0] ?? s.meaning}`,
      ]
      return `${moodPrefix}${singleOpenings[symbolSeed(symbols) % singleOpenings.length]}. ${s.interpretation}`
    }
    const singleOpenings = [
      `整场梦把镜头对准了「${s.matchedKeyword}」，它带着${s.meaning}的意味`,
      `醒来后若只留下一个画面，「${s.matchedKeyword}」就是这场梦的中心`,
      `这个梦没有铺开很多线索，而是用「${s.matchedKeyword}」反复强调${s.themes[0] ?? s.meaning}`,
    ]
    return `${moodPrefix}${singleOpenings[symbolSeed(symbols) % singleOpenings.length]}。${s.interpretation}`
  }

  if (isEnglish) {
    const multiOpenings = [
      `The dream crosses ${categories.length} layers (${categories.join(', ')}), with ${symbols.length} images like different words in the same sentence`,
      `This isn’t a single-symbol dream. ${symbols.length} images move between ${categories.join(', ')}`,
      `If you treat this dream as a painting, ${symbols.length} images form foreground and background, and ${categories.join(', ')} are its main colors`,
    ]
    return `${moodPrefix}${multiOpenings[symbolSeed(symbols) % multiOpenings.length]}. Together they point to a psychological picture more complete than any single image.`
  }

  const multiOpenings = [
    `梦境跨过${categories.join('、')}${categories.length}个层面，${symbols.length}个意象像同一段话里的不同词语`,
    `这不是单一符号的梦。${symbols.length}个意象在${categories.join('、')}之间来回切换`,
    `若把这场梦当成一幅画，${symbols.length}个意象构成前景与背景，而${categories.join('、')}是它使用的主要颜色`,
  ]
  return `${moodPrefix}${multiOpenings[symbolSeed(symbols) % multiOpenings.length]}。它们共同指向一个比单个梦象更完整的心理图景。`
}

function buildAdvice(
  symbols: MatchedDreamSymbol[],
  moodMeta: { label: string; tone: string; lean: 'positive' | 'negative' | 'neutral'; suffix: string } | undefined,
  isEnglish: boolean,
): string {
  const lean = moodMeta?.lean ?? 'neutral'
  if (symbols.length === 0) {
    if (isEnglish) {
      return `Don’t rush to explain. First write down your first feeling after waking, the most obvious color, and the place in the dream you most wanted to leave or approach.${moodMeta ? ` ${moodMeta.suffix}` : ''}`
    }
    return `先别急着解释。请补记醒来后的第一感受、最明显的颜色，以及梦里你最想离开或靠近的地方。${moodMeta ? ` ${moodMeta.suffix}` : ''}`
  }

  const primary = symbols[0]
  const secondary = symbols[1]
  const leanText = pickLeanText(primary, lean)

  if (isEnglish) {
    const connectors = [
      `First acknowledge what the dream made you feel: ${leanText} Then turn it into one small action—${primary.advice}`,
      `Rather than asking for luck or omen, notice the intuition “${primary.matchedKeyword}” stirs in waking life. ${leanText} Today you can try: ${primary.advice}`,
      `What this dream most deserves to bring into the day is awareness of “${primary.themes[0] ?? primary.matchedKeyword}”. ${leanText} A practical next step is: ${primary.advice}`,
    ]
    let result = connectors[symbolSeed(symbols) % connectors.length]
    if (secondary) result += ` If you still have energy, also tend to the side thread of “${secondary.matchedKeyword}”: ${secondary.advice}`
    if (moodMeta) result += ` ${moodMeta.suffix}`
    return result
  }

  const connectors = [
    `先承认这个梦带来的感受：${leanText} 然后把它收束成一个小动作——${primary.advice}`,
    `与其追问吉凶，不如留意「${primary.matchedKeyword}」在现实中引起的直觉。${leanText} 今天可以试试：${primary.advice}`,
    `这场梦最值得带回白天的，是对「${primary.themes[0] ?? primary.matchedKeyword}」的觉察。${leanText} 落地做法是：${primary.advice}`,
  ]
  let result = connectors[symbolSeed(symbols) % connectors.length]
  if (secondary) result += ` 若还有余力，再照看「${secondary.matchedKeyword}」这条支线：${secondary.advice}`
  if (moodMeta) result += ` ${moodMeta.suffix}`
  return result
}

function buildReflection(symbols: MatchedDreamSymbol[], isEnglish: boolean): string {
  const reflections = isEnglish ? FALLBACK_REFLECTIONS_EN : FALLBACK_REFLECTIONS
  if (symbols.length === 0) {
    return reflections[0]
  }
  const primary = symbols[0]
  const idx = primary.keywords[0].charCodeAt(0) % reflections.length
  const base = reflections[idx]
  if (isEnglish) {
    const prompt =
      primary.themes.length > 1
        ? `If “${primary.matchedKeyword}” represents a part of you, what is it protecting—and what is it afraid of?`
        : `In waking life, what person, situation, or unspoken feeling does “${primary.matchedKeyword}” most resemble?`
    return `A question after the dream: ${prompt} ${base}`
  }
  const prompt =
    primary.themes.length > 1
      ? `若「${primary.matchedKeyword}」代表你的一部分，它正在保护什么，又在担心什么？`
      : `「${primary.matchedKeyword}」在现实中最像哪个人、一件事，或一种尚未说出的感受？`
  return `梦后一问：${prompt}${base}`
}

/** 用最新引擎逻辑重新解析梦境（历史回看应优先调用） */
export function rehydrateDreamInterpretation(
  record: {
    content: string
    mood: string
    interpretation?: DreamInterpretation & { overall?: string }
  },
  isEnglish = isEnglishLocale(),
): DreamInterpretation {
  if (record.content.trim()) {
    return interpretDreamWithMood(record.content, record.mood, isEnglish)
  }
  return normalizeDreamInterpretation(
    record.interpretation ?? {
      symbols: [],
      overview: '',
      emotionalTone: null,
      themes: '',
      symbolNarrative: '',
      advice: '',
      reflection: '',
    },
    isEnglish,
  )
}

export function normalizeDreamInterpretation(
  raw: DreamInterpretation & { overall?: string },
  isEnglish = isEnglishLocale(),
): DreamInterpretation {
  return {
    symbols: localizeMatchedSymbols(raw.symbols ?? [], isEnglish),
    overview: raw.overview ?? raw.overall ?? '',
    emotionalTone: raw.emotionalTone ?? null,
    themes: raw.themes ?? '',
    symbolNarrative: raw.symbolNarrative ?? '',
    advice: raw.advice ?? '',
    reflection:
      raw.reflection ??
      (isEnglish
        ? 'Look back at this dream and write down the one image that moved you most.'
        : '回顾这个梦，写下最触动你的一个画面。'),
  }
}

export function interpretDream(content: string, isEnglish = isEnglishLocale()): DreamInterpretation {
  const symbols = findDreamSymbolsLocalized(content, isEnglish)
  return {
    symbols,
    overview: buildOverview(symbols, undefined, isEnglish),
    emotionalTone: null,
    themes: buildThemes(symbols, isEnglish),
    symbolNarrative: buildSymbolNarrative(symbols, isEnglish),
    advice: buildAdvice(symbols, undefined, isEnglish),
    reflection: buildReflection(symbols, isEnglish),
  }
}

export function interpretDreamWithMood(
  content: string,
  mood: string,
  isEnglish = isEnglishLocale(),
): DreamInterpretation {
  const symbols = findDreamSymbolsLocalized(content, isEnglish)
  const moodMeta = mood ? (isEnglish ? MOOD_META_EN[mood] : MOOD_META[mood]) : undefined

  return {
    symbols,
    overview: buildOverview(symbols, moodMeta, isEnglish),
    emotionalTone: moodMeta
      ? isEnglish
        ? `Emotional tone: ${moodMeta.label} — ${moodMeta.tone}`
        : `情绪基调：${moodMeta.label}——${moodMeta.tone}`
      : null,
    themes: buildThemes(symbols, isEnglish),
    symbolNarrative: buildSymbolNarrative(symbols, isEnglish),
    advice: buildAdvice(symbols, moodMeta, isEnglish),
    reflection: buildReflection(symbols, isEnglish),
  }
}
