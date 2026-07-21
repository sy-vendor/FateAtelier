import {
  liuchongMap,
  liuhaiMap,
  liuheMap,
  sanheGroups,
  sanxingGroups,
  shengxiaoToDizhi,
} from './shengxiaoData'
import { isEnglishLocale } from '../i18n/locale'

export interface ShengxiaoPairingResult {
  relationships: string[]
  score: number
  compatibility: string
  analysis: string
}

export function analyzePairing(shengxiao1: string, shengxiao2: string): ShengxiaoPairingResult | null {
  const dizhi1 = shengxiaoToDizhi[shengxiao1]
  const dizhi2 = shengxiaoToDizhi[shengxiao2]

  if (!dizhi1 || !dizhi2) return null

  const relationships: string[] = []
  let score = 50
  let compatibility = '中等'

  if (liuheMap[dizhi1] === dizhi2) {
    relationships.push('六合')
    score += 30
    compatibility = '极佳'
  }

  if (liuchongMap[dizhi1] === dizhi2) {
    relationships.push('六冲')
    score -= 30
    compatibility = '较差'
  }

  if (liuhaiMap[dizhi1] === dizhi2) {
    relationships.push('六害')
    score -= 20
    if (compatibility !== '较差') compatibility = '一般'
  }

  for (const group of sanheGroups) {
    if (group.includes(dizhi1) && group.includes(dizhi2) && dizhi1 !== dizhi2) {
      relationships.push('三合')
      score += 25
      if (compatibility !== '较差') compatibility = '良好'
      break
    }
  }

  for (const group of sanxingGroups) {
    if (group.includes(dizhi1) && group.includes(dizhi2) && dizhi1 !== dizhi2) {
      relationships.push('三刑')
      score -= 15
      if (compatibility === '极佳' || compatibility === '良好') compatibility = '一般'
      else if (compatibility === '中等') compatibility = '较差'
      break
    }
  }

  if (relationships.length === 0) {
    if (shengxiao1 === shengxiao2) {
      relationships.push('相同')
      score += 5
    } else {
      relationships.push('普通')
    }
  }

  score = Math.max(0, Math.min(100, score))

  let analysis = ''
  if (relationships.includes('六合')) {
    analysis = isEnglishLocale()
      ? 'Six Harmonies is the strongest pairing, representing harmony and complementarity. The two signs tend to understand each other well and build an easy rapport.'
      : '六合是最佳的配对关系，代表和谐、互补，双方性格相投，容易产生默契，是传统命理学中最为理想的配对。'
  } else if (relationships.includes('三合')) {
    analysis = isEnglishLocale()
      ? 'Three Harmonies is a favorable pairing. Both sides can support one another, grow together, and build a stable, harmonious relationship.'
      : '三合是良好的配对关系，代表三合局，双方能够互相支持，共同成长，关系稳定和谐。'
  } else if (relationships.includes('六冲')) {
    analysis = isEnglishLocale()
      ? 'Six Clashes represents opposing forces. Differences in temperament can lead to friction, so extra understanding and patience are helpful.'
      : '六冲代表对立冲突，双方性格差异较大，容易产生矛盾和争执，需要更多的理解和包容。'
  } else if (relationships.includes('六害')) {
    analysis = isEnglishLocale()
      ? 'Six Harms suggests obstacles and friction in the relationship. More communication and adjustment can help both sides work through difficulties.'
      : '六害代表相互伤害，双方在相处中可能会遇到一些阻碍和困难，需要更多的沟通和磨合。'
  } else if (relationships.includes('三刑')) {
    analysis = isEnglishLocale()
      ? 'Three Punishments represents mutual constraint. Friction and conflict may arise, calling for more patience and understanding.'
      : '三刑代表相互制约，双方在相处中可能会有一些摩擦和冲突，需要更多的耐心和理解。'
  } else if (relationships.includes('相同')) {
    analysis = isEnglishLocale()
      ? 'With the same zodiac sign, both sides may understand each other easily, though too much similarity can leave less room for complementarity.'
      : '相同生肖的配对，双方性格相似，容易理解彼此，但也可能因为过于相似而缺乏互补性。'
  } else {
    analysis = isEnglishLocale()
      ? 'This is an ordinary pairing without a clear harmony or clash. Its development depends mostly on each person’s character and how they relate to one another.'
      : '普通配对关系，双方没有明显的相合或相冲，关系发展主要取决于个人的性格和相处方式。'
  }

  return { relationships, score, compatibility, analysis }
}
