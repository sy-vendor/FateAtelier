import { interpretDream, type DreamSymbol } from '../data/dreamSymbols'

const MOOD_OVERLAYS: Record<string, { prefix: string; adviceSuffix: string }> = {
  calm: {
    prefix: '你梦中的氛围较为安宁，',
    adviceSuffix: '保持这份内心的平静，继续关注潜意识传递的信息。',
  },
  fear: {
    prefix: '梦中弥漫着不安与紧张，',
    adviceSuffix: '恐惧常常是转变的前奏，尝试在安全的环境中面对这些感受。',
  },
  joy: {
    prefix: '梦中洋溢着喜悦与轻盈，',
    adviceSuffix: '将这份积极能量带入日间生活，留意让你快乐的事物。',
  },
  confused: {
    prefix: '梦中感到迷茫与混沌，',
    adviceSuffix: '不必急于理清一切，给潜意识一些时间慢慢沉淀。',
  },
  sad: {
    prefix: '梦中带着忧伤与怅惘，',
    adviceSuffix: '允许自己感受悲伤，这也是自我疗愈的一部分。',
  },
}

export interface DreamInterpretation {
  symbols: DreamSymbol[]
  overall: string
  advice: string
}

export function interpretDreamWithMood(content: string, mood: string): DreamInterpretation {
  const result = interpretDream(content)
  const overlay = MOOD_OVERLAYS[mood]
  if (!overlay) return result

  return {
    ...result,
    overall: overlay.prefix + result.overall,
    advice: `${result.advice} ${overlay.adviceSuffix}`,
  }
}
