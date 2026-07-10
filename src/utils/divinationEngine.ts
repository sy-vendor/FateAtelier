import type { DivinationStick } from '../data/divinationSticks'
import { divinationSticks } from '../data/divinationSticks'
import {
  CATEGORY_DETAIL_KEYS,
  DEFAULT_DETAIL_BY_LEVEL,
  DETAIL_FIELD_LABELS,
  LEVEL_META,
  getCategoryLabel,
  type DetailField,
} from './divinationData'

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
  auspicious: string[]
  cautions: string[]
  timing: string
  storyNote: string | null
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
    aspects.push({ label: DETAIL_FIELD_LABELS[field], text })
  }

  return aspects
}

function buildCategoryGuidance(stick: DivinationStick, category: string): string {
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
  return divinationSticks.find((s) => s.id === stick.id) ?? stick
}

function buildPoemInsight(stick: DivinationStick): string {
  const resolved = resolveCanonicalStick(stick)
  if (resolved.plainPoem) {
    return resolved.plainPoem
  }
  return resolved.interpretation
}

function buildOverview(stick: DivinationStick, category?: string): string {
  const meta = LEVEL_META[stick.level] ?? LEVEL_META['中']
  const core = cleanRepetitiveText(stick.interpretation, stick.title)

  let overview = `第${stick.id}签「${stick.title}」为${stick.level}签，${meta.tone}。`
  if (core) {
    overview += core
  }

  if (category) {
    overview += ` 您此刻问的是${getCategoryLabel(category)}，签意将侧重此方向展开。`
  } else {
    overview += ' 签文涵盖事业、财禄、情感、健康诸端，可依下方分项详批参详。'
  }

  return overview
}

function buildAdvice(stick: DivinationStick): string {
  const cleaned = cleanRepetitiveText(stick.advice, stick.title)
  const meta = LEVEL_META[stick.level] ?? LEVEL_META['中']

  if (cleaned && cleaned.length > 12 && !isGenericText(cleaned)) {
    return cleaned
  }

  return `此签${meta.tone}。${cleaned || '宜守中正之心，顺时随缘。'} ${meta.timing}`
}

/**
 * 将原始签文整理为结构化、可读的完整解签
 */
export function buildStickReading(stick: DivinationStick, category?: string): StickReading {
  const resolved = resolveCanonicalStick(stick)
  const meta = LEVEL_META[resolved.level] ?? LEVEL_META['中']
  const detailFields = category
    ? (CATEGORY_DETAIL_KEYS[category] ?? [])
    : (DEFAULT_DETAIL_BY_LEVEL[resolved.level] ?? ['career', 'wealth', 'health', 'home'])

  return {
    stick: resolved,
    overview: buildOverview(resolved, category),
    poemInsight: buildPoemInsight(resolved),
    categoryGuidance: category ? buildCategoryGuidance(resolved, category) : null,
    categoryLabel: category ? getCategoryLabel(category) : null,
    aspects: buildAspects(resolved, detailFields),
    advice: buildAdvice(resolved),
    auspicious: meta.auspicious,
    cautions: meta.cautions,
    timing: meta.timing,
    storyNote: resolved.story ? cleanRepetitiveText(resolved.story, resolved.title) : null,
  }
}

/** @deprecated 保留兼容；请优先使用 buildStickReading */
export function optimizeStick(stick: DivinationStick): DivinationStick {
  return buildStickReading(stick).stick
}
