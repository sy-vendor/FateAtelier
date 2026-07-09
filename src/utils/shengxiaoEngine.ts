import {
  liuchongMap,
  liuhaiMap,
  liuheMap,
  sanheGroups,
  sanxingGroups,
  shengxiaoToDizhi,
} from './shengxiaoData'

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
    analysis = '六合是最佳的配对关系，代表和谐、互补，双方性格相投，容易产生默契，是传统命理学中最为理想的配对。'
  } else if (relationships.includes('三合')) {
    analysis = '三合是良好的配对关系，代表三合局，双方能够互相支持，共同成长，关系稳定和谐。'
  } else if (relationships.includes('六冲')) {
    analysis = '六冲代表对立冲突，双方性格差异较大，容易产生矛盾和争执，需要更多的理解和包容。'
  } else if (relationships.includes('六害')) {
    analysis = '六害代表相互伤害，双方在相处中可能会遇到一些阻碍和困难，需要更多的沟通和磨合。'
  } else if (relationships.includes('三刑')) {
    analysis = '三刑代表相互制约，双方在相处中可能会有一些摩擦和冲突，需要更多的耐心和理解。'
  } else if (relationships.includes('相同')) {
    analysis = '相同生肖的配对，双方性格相似，容易理解彼此，但也可能因为过于相似而缺乏互补性。'
  } else {
    analysis = '普通配对关系，双方没有明显的相合或相冲，关系发展主要取决于个人的性格和相处方式。'
  }

  return { relationships, score, compatibility, analysis }
}
