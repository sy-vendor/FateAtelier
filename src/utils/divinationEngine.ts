import type { DivinationStick } from '../data/divinationSticks'
import { divinationSticks } from '../data/divinationSticks'
import { divinationSticksEn } from '../data/divinationSticks.en'
import {
  CATEGORY_DETAIL_KEYS,
  DEFAULT_DETAIL_BY_LEVEL,
  DETAIL_FIELD_LABELS,
  LEVEL_META,
  getCategoryLabel,
  type DetailField,
} from './divinationData'
import { isEnglishLocale } from '../i18n/locale'

export interface ReadingAspect {
  label: string
  text: string
}

export interface StickReading {
  stick: DivinationStick
  overview: string
  poemInsight: string
  categoryGuidance: string | null
  categoryLabel: string | null
  aspects: ReadingAspect[]
  advice: string
  actionSteps: string[]
  auspicious: string[]
  cautions: string[]
  timing: string
  storyNote: string | null
}

const CATEGORY_LABEL_EN_MAP: Record<string, string> = {
  '': 'All',
  career: 'Career',
  love: 'Love',
  health: 'Health',
  wealth: 'Wealth',
  travel: 'Travel',
}

function getCategoryLabelEn(category: string): string {
  return CATEGORY_LABEL_EN_MAP[category] ?? category
}

const DETAIL_FIELD_LABEL_EN: Record<DetailField, string> = {
  home: 'Home',
  business: 'Business',
  travel: 'Travel',
  marriage: 'Marriage',
  wealth: 'Wealth',
  health: 'Health',
  lawsuit: 'Lawsuit',
  lostItem: 'Lost item',
  searchPerson: 'Search person',
  relocation: 'Relocation',
  career: 'Career',
  pregnancy: 'Pregnancy',
  livestock: 'Livestock',
  disputes: 'Disputes',
  illness: 'Illness',
  transaction: 'Transaction',
  traveler: 'Traveler',
}

const LEVEL_META_EN: Record<
  string,
  { tone: string; timing: string; auspicious: string[]; cautions: string[]; poemTone: string }
> = {
  上上: {
    tone: 'an exceptional peak of fortune—everything favors your wishes',
    timing: 'results may appear soon; act while momentum is strong',
    auspicious: [
      'Seize the opportunity and act with purpose',
      'Meet others with sincerity and build lasting goodwill',
      'For major decisions, advance them in the near term',
    ],
    cautions: ['Avoid arrogance and complacency', 'Don’t let pride make you underestimate others'],
    poemTone: 'A sign of “heaven opening and all things renewing.” Your request is greatly favored.',
  },
  上: {
    tone: 'smooth progress with quiet support from benefactors',
    timing: 'within one to two months you should enter a better phase',
    auspicious: ['Move your plan steadily', 'Initiate honest conversations and collaborations', 'Show your talent at the right time'],
    cautions: ['Avoid haste and overreaching', 'Don’t try to do everything at once'],
    poemTone: 'The poem points to continuous blessing and help; good outweighs trouble.',
  },
  中上: {
    tone: 'steady improvement—gradually entering a favorable circle',
    timing: 'needs patience; turning points are likely in autumn and winter',
    auspicious: ['Continue accumulating—then effort ripens', 'Handle the present task well', 'Keep improving and stay consistent'],
    cautions: ['Don’t give up halfway', 'Avoid overreaching beyond your current limits'],
    poemTone: 'The poem suggests measured steps with forward growth.',
  },
  中: {
    tone: 'balanced fortune with a chance hidden inside restraint',
    timing: 'observe for a few days first, then decide the bigger plan',
    auspicious: ['Lay solid foundations—steady progress over shortcuts', `Listen to others' perspectives`, 'Test in small steps instead of gambling big'],
    cautions: ['Avoid impulsive decisions', 'Don’t get drawn into one‑moment disputes'],
    poemTone: 'The poem favors moderation: not an extreme blessing, not an extreme setback—self-control matters most.',
  },
  中下: {
    tone: 'some friction—better to hold back than to push hard',
    timing: 'pause major changes until the situation becomes clearer',
    auspicious: ['Reflect and adjust your strategy', 'Manage money conservatively and live within means', 'Do good to shift the current'],
    cautions: ['Avoid forcing progress', 'Avoid argument and heated exchanges', 'Avoid high-risk investments'],
    poemTone: 'The poem signals a path with waves; soften when needed and move forward by stepping back.',
  },
  下: {
    tone: 'low momentum—better to rest than to move',
    timing: 'focus on recovery and preparation now; the turning point comes later',
    auspicious: ['Bide your time and build strength', 'Before major decisions, consult trustworthy people', 'Cultivate character and wait for the right moment'],
    cautions: ['Avoid major investments or job changes', 'Avoid making enemies', 'Avoid risky journeys'],
    poemTone: 'The poem warns of obstacles ahead; protect yourself first.',
  },
  下下: {
    tone: 'ominous signals—protect the situation and avoid risk',
    timing: 'short-term action is not ideal; first get through the hard phase',
    auspicious: ['Stick to your basics and calm your heart', 'Seek help from someone reliable', 'Start with the smallest workable steps'],
    cautions: ['Avoid putting everything on one throw', 'Avoid direct confrontation with others', 'Don’t ignore body and mind signals'],
    poemTone: 'The poem shows a difficult trial—but even within danger, there can be a turning if you hold steady.',
  },
}

const GENERIC_SNIPPETS = [
  '需要时间和耐心来培养',
  '需要日常保养',
  '需要理性投资',
  '需要稳步',
  '需要小心应对',
  '不可大意',
]

const BOILERPLATE_PREFIX =
  /^(家宅|生意|出行|婚姻|求财|求医|诉讼|失物|寻人|移徙|功名|六甲|六畜|口舌|病情|疾病|交易|行人)[^，,。]*[，,]/

const BOILERPLATE_INLINE =
  /(天时地利|福星高照|大凶大恶|大吉大利)[^，,。]*[，,]?/g

const BOILERPLATE_SUFFIX =
  /[，,]?(不用愁|有前程|到成功|需要时间|需要小心应对难|前路凶险有困难|不可大意|不可蛮横|不可无礼)[。]?$/g

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 去除签文模板中的重复套话 */
export function cleanRepetitiveText(text: string, title?: string): string {
  let result = text.trim()
  if (!result) return result

  if (isEnglishLocale()) {
    if (title) {
      result = result.replace(new RegExp(`^${escapeRegex(title)}[\\s,.-]*`), '')
    }
    result = result.replace(/\s+/g, ' ').trim()
    if (result && !/[.!?]$/.test(result)) result += '.'
    return result
  }

  if (title) {
    result = result.replace(new RegExp(`^${escapeRegex(title)}[，,]`), '')
  }

  result = result
    .replace(BOILERPLATE_PREFIX, '')
    .replace(BOILERPLATE_INLINE, '')
    .replace(/宜敬神拜佛[^，,。]*[，,]?/g, '')
    .replace(/宜向东方或高处寻找[^，,。]*[，,]?/g, '')
    .replace(/宜向北方或水边寻找[^，,。]*[，,]?/g, '')
    .replace(BOILERPLATE_SUFFIX, '')
    .replace(/[，,]{2,}/g, '，')
    .replace(/^[，,]+/, '')
    .replace(/[，,]+$/, '')
    .trim()

  if (result && !/[。！？]$/.test(result)) {
    result += '。'
  }

  return result
}

function isGenericText(text: string): boolean {
  return GENERIC_SNIPPETS.some((snippet) => text.includes(snippet))
}

function getDetailText(stick: DivinationStick, field: DetailField): string | null {
  const raw = stick.detailedInterpretations?.[field]
  if (!raw) return null
  const cleaned = cleanRepetitiveText(raw, stick.title)
  return cleaned.length > 4 ? cleaned : null
}

function buildAspects(stick: DivinationStick, fields: DetailField[]): ReadingAspect[] {
  const seen = new Set<string>()
  const aspects: ReadingAspect[] = []

  for (const field of fields) {
    const text = getDetailText(stick, field)
    if (!text || seen.has(text)) continue
    seen.add(text)
    const label = isEnglishLocale() ? DETAIL_FIELD_LABEL_EN[field] : DETAIL_FIELD_LABELS[field]
    aspects.push({ label, text })
  }

  return aspects
}

function buildCategoryGuidance(stick: DivinationStick, category: string): string {
  if (isEnglishLocale()) {
    const detailFields = CATEGORY_DETAIL_KEYS[category] ?? []
    const detailTexts = detailFields
      .map((field) => getDetailText(stick, field))
      .filter((text): text is string => Boolean(text))

    const metaEn = LEVEL_META_EN[stick.level] ?? LEVEL_META_EN['中']
    const categoryLabel = getCategoryLabelEn(category)
    if (detailTexts.length > 0) {
      return `In terms of ${categoryLabel}, this lot emphasizes ${metaEn.tone}. ${detailTexts.slice(0, 2).join(' ')}`
    }
    return `In terms of ${categoryLabel}, this lot emphasizes ${metaEn.tone}.`
  }

  const direct = stick.categories[category as keyof typeof stick.categories]
  const detailFields = CATEGORY_DETAIL_KEYS[category] ?? []
  const detailTexts = detailFields
    .map((field) => getDetailText(stick, field))
    .filter((text): text is string => Boolean(text))

  if (direct && !isGenericText(direct)) {
    const cleaned = cleanRepetitiveText(direct, stick.title)
    if (detailTexts.length > 0) {
      return `${cleaned} ${detailTexts[0]}`
    }
    return cleaned
  }

  if (detailTexts.length > 0) {
    return detailTexts.slice(0, 2).join(' ')
  }

  if (direct) {
    return cleanRepetitiveText(direct, stick.title)
  }

  const meta = LEVEL_META[stick.level] ?? LEVEL_META['中']
  return `就${getCategoryLabel(category)}而言，此签主${meta.tone}，宜结合自身处境审慎取舍。`
}

/** 历史记录等场景可能缺少 plainPoem，按签号回填完整签文 */
export function resolveCanonicalStick(stick: DivinationStick): DivinationStick {
  const canonical = divinationSticks.find((s) => s.id === stick.id) ?? stick
  if (!isEnglishLocale()) return canonical

  const locale = divinationSticksEn[canonical.id]
  if (!locale) return canonical

  return {
    ...canonical,
    title: locale.titleEn,
    poem: locale.plainPoemEn,
    plainPoem: locale.plainPoemEn,
    interpretation: locale.interpretationEn,
    advice: locale.adviceEn,
    story: locale.storyEn,
    detailedInterpretations: locale.detailsEn ? { ...locale.detailsEn } : canonical.detailedInterpretations,
    ageGenderInterpretations: locale.ageEn ? { ...locale.ageEn } : canonical.ageGenderInterpretations,
  }
}

function buildPoemInsight(stick: DivinationStick): string {
  const resolved = resolveCanonicalStick(stick)
  if (resolved.plainPoem) {
    return resolved.plainPoem
  }
  return resolved.interpretation
}

function buildOverview(stick: DivinationStick, category?: string): string {
  if (isEnglishLocale()) {
    const metaEn = LEVEL_META_EN[stick.level] ?? LEVEL_META_EN['中']
    const levelEn = divinationSticksEn[stick.id]?.levelEn ?? stick.level
    const core = cleanRepetitiveText(stick.interpretation, stick.title)

    const openings = [
      `Stick #${stick.id} “${stick.title}” — ${levelEn}. ${metaEn.tone}.`,
      `Today you drew Stick #${stick.id} “${stick.title}”. This is ${levelEn}, with ${metaEn.tone}.`,
      `“${stick.title}” is Stick #${stick.id}, sitting at ${levelEn}. The tone it sets for your present situation is: ${metaEn.tone}.`,
    ]

    let overview = openings[stick.id % openings.length]
    if (core) overview += core

    if (category) {
      const categoryLead =
        stick.id % 2 === 0
          ? ` Your question focuses on ${getCategoryLabelEn(category)}. Below, the poem’s symbolism will be mapped into this specific context.`
          : ` When it comes to ${getCategoryLabelEn(category)}, don’t look only for good or bad—pay attention to the timing and boundaries the stick reminds you to hold.`
      overview += categoryLead
    } else {
      overview += ` This reading covers career, wealth, emotions, and wellbeing. Use the detailed aspects below to go deeper.`
    }

    return overview
  }

  const meta = LEVEL_META[stick.level] ?? LEVEL_META['中']
  const core = cleanRepetitiveText(stick.interpretation, stick.title)

  const openings = [
    `第${stick.id}签「${stick.title}」，签等为${stick.level}。${meta.tone}。`,
    `今日得第${stick.id}签「${stick.title}」。此签属${stick.level}，${meta.tone}。`,
    `「${stick.title}」是第${stick.id}签，位列${stick.level}。它为当下局面定下的基调是：${meta.tone}。`,
  ]
  let overview = openings[stick.id % openings.length]
  if (core) {
    overview += core
  }

  if (category) {
    const categoryLead = stick.id % 2 === 0
      ? ` 你此刻所问为${getCategoryLabel(category)}，下文会把签诗的象意落到这个具体处境。`
      : ` 就${getCategoryLabel(category)}而言，不必只看吉凶，更要看签中提醒你把握的时机与分寸。`
    overview += categoryLead
  } else {
    overview += ' 签文涵盖事业、财禄、情感、健康诸端，可依下方分项详批参详。'
  }

  return overview
}

function buildAdvice(stick: DivinationStick): string {
  if (isEnglishLocale()) {
    const metaEn = LEVEL_META_EN[stick.level] ?? LEVEL_META_EN['中']
    const cleaned = cleanRepetitiveText(stick.advice, stick.title)
    if (cleaned && cleaned.length > 12) return cleaned
    return `${metaEn.tone}. ${cleaned || 'Let your heart stay steady and upright; follow the season and the moment.'} ${metaEn.timing}`
  }

  const cleaned = cleanRepetitiveText(stick.advice, stick.title)
  const meta = LEVEL_META[stick.level] ?? LEVEL_META['中']

  if (cleaned && cleaned.length > 12 && !isGenericText(cleaned)) {
    return cleaned
  }

  return `此签${meta.tone}。${cleaned || '宜守中正之心，顺时随缘。'} ${meta.timing}`
}

function buildActionSteps(stick: DivinationStick, aspects: ReadingAspect[], category?: string): string[] {
  if (isEnglishLocale()) {
    const metaEn = LEVEL_META_EN[stick.level] ?? LEVEL_META_EN['中']
    const firstAspect = aspects[0]

    const start =
      metaEn.auspicious.length > 0
        ? metaEn.auspicious[stick.id % metaEn.auspicious.length]
        : 'Clarify the most important matter in front of you.'

    const pause =
      metaEn.cautions.length > 0
        ? metaEn.cautions[stick.id % metaEn.cautions.length]
        : 'Avoid major decisions when emotions run strongest.'

    const middle = firstAspect
      ? `Align “${firstAspect.label}”: ${firstAspect.text}`
      : category
        ? `Write one small, testable goal around ${getCategoryLabelEn(category)}.`
        : 'Match the most resonant line from the lot to today’s specific situation.'

    return [`First: ${start}`, `Then: ${middle}`, `Pause/Delay: ${pause}`]
  }

  const meta = LEVEL_META[stick.level] ?? LEVEL_META['中']
  const firstAspect = aspects[0]
  const start = meta.auspicious.length > 0
    ? meta.auspicious[stick.id % meta.auspicious.length]
    : '先理清手上最重要的一件事'
  const pause = meta.cautions.length > 0
    ? meta.cautions[stick.id % meta.cautions.length]
    : '不在情绪最强时做重大决定'
  const middle = firstAspect
    ? `核对「${firstAspect.label}」：${firstAspect.text}`
    : category
      ? `围绕${getCategoryLabel(category)}写下一个可以验证的小目标`
      : '把签文中最有感觉的一句，对照到今天的具体处境'
  return [`先行：${start}`, `再看：${middle}`, `暂缓：${pause}`]
}

/**
 * 将原始签文整理为结构化、可读的完整解签
 */
export function buildStickReading(stick: DivinationStick, category?: string): StickReading {
  const resolved = resolveCanonicalStick(stick)
  const meta = isEnglishLocale()
    ? (LEVEL_META_EN[resolved.level] ?? LEVEL_META_EN['中'])
    : (LEVEL_META[resolved.level] ?? LEVEL_META['中'])
  const detailFields = category
    ? (CATEGORY_DETAIL_KEYS[category] ?? [])
    : (DEFAULT_DETAIL_BY_LEVEL[resolved.level] ?? ['career', 'wealth', 'health', 'home'])
  const aspects = buildAspects(resolved, detailFields)

  return {
    stick: resolved,
    overview: buildOverview(resolved, category),
    poemInsight: buildPoemInsight(resolved),
    categoryGuidance: category ? buildCategoryGuidance(resolved, category) : null,
    categoryLabel: category ? (isEnglishLocale() ? getCategoryLabelEn(category) : getCategoryLabel(category)) : null,
    aspects,
    advice: buildAdvice(resolved),
    actionSteps: buildActionSteps(resolved, aspects, category),
    auspicious: meta.auspicious,
    cautions: meta.cautions,
    timing: meta.timing,
    storyNote: resolved.story ? cleanRepetitiveText(resolved.story, resolved.title) : null,
  }
}

/** 历史回看时按最新引擎逻辑重新解签 */
export function rehydrateStickReading(stick: DivinationStick, category?: string): StickReading {
  return buildStickReading(resolveCanonicalStick(stick), category)
}

/** @deprecated 保留兼容；请优先使用 buildStickReading */
export function optimizeStick(stick: DivinationStick): DivinationStick {
  return buildStickReading(stick).stick
}
