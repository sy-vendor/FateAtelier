import {
  COMBINATION_MEANINGS,
  NUMBER_MEANINGS,
  type CombinationInfo,
  type EnergyLevel,
  type NumberMeaning,
  type NumberType,
} from './numberEnergyData'

export interface NumberEnergyAnalysis {
  numbers: string
  digitCount: Record<string, number>
  sum: number
  finalDigit: number
  finalDigitInfo: NumberMeaning | undefined
  combinations: Array<{ combo: string; info: CombinationInfo }>
  score: number
  level: EnergyLevel
  levelText: string
  levelColor: string
  suggestions: string[]
}

function calculateSum(numbers: string): number {
  return numbers.split('').reduce((sum, char) => {
    const num = parseInt(char, 10)
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
}

function reduceToSingleDigit(num: number): number {
  let n = num
  while (n >= 10) {
    n = n
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0)
  }
  return n
}

export function analyzeNumberEnergy(input: string, type: NumberType): NumberEnergyAnalysis | null {
  const numbers = input.replace(/\D/g, '')
  if (numbers.length === 0) return null

  const digitCount: Record<string, number> = {}
  numbers.split('').forEach((digit) => {
    digitCount[digit] = (digitCount[digit] || 0) + 1
  })

  const sum = calculateSum(numbers)
  const finalDigit = reduceToSingleDigit(sum)

  const combinations: Array<{ combo: string; info: CombinationInfo }> = []
  for (let i = 0; i < numbers.length - 1; i++) {
    const twoDigit = numbers.substring(i, i + 2)
    if (COMBINATION_MEANINGS[twoDigit]) {
      combinations.push({ combo: twoDigit, info: COMBINATION_MEANINGS[twoDigit] })
    }
    if (i < numbers.length - 2) {
      const threeDigit = numbers.substring(i, i + 3)
      if (COMBINATION_MEANINGS[threeDigit]) {
        combinations.push({ combo: threeDigit, info: COMBINATION_MEANINGS[threeDigit] })
      }
    }
  }
  const uniqueCombinations = Array.from(
    new Map(combinations.map((item) => [item.combo, item])).values()
  )

  let score = 50

  if (finalDigit === 1 || finalDigit === 6 || finalDigit === 8) score += 15
  else if (finalDigit === 2 || finalDigit === 3 || finalDigit === 7 || finalDigit === 9) score += 10
  else if (finalDigit === 4) score -= 5
  else if (finalDigit === 5) score += 5

  score += uniqueCombinations.length * 5
  uniqueCombinations.forEach(({ info }) => {
    if (info.energy === 'positive') score += 3
    else if (info.energy === 'negative') score -= 2
  })

  const positiveCount = Object.keys(digitCount).filter(
    (d) => NUMBER_MEANINGS[d]?.energy === 'positive'
  ).length
  const negativeCount = Object.keys(digitCount).filter(
    (d) => NUMBER_MEANINGS[d]?.energy === 'negative'
  ).length
  score += positiveCount * 3
  score -= negativeCount * 2

  if (type === 'phone' && numbers.length === 11) score += 5
  else if (type === 'id' && numbers.length === 18) score += 5
  else if (type === 'plate' && numbers.length >= 5) score += 5

  score = Math.max(0, Math.min(100, score))

  let level: EnergyLevel
  let levelText: string
  let levelColor: string

  if (score >= 80) {
    level = 'excellent'
    levelText = '极佳'
    levelColor = '#4ade80'
  } else if (score >= 60) {
    level = 'good'
    levelText = '良好'
    levelColor = '#60a5fa'
  } else if (score >= 40) {
    level = 'average'
    levelText = '一般'
    levelColor = '#fbbf24'
  } else {
    level = 'poor'
    levelText = '较差'
    levelColor = '#f87171'
  }

  const suggestions: string[] = []

  if (score < 60) {
    suggestions.push('建议选择包含更多吉利数字（1、6、8、9）的组合')
    suggestions.push('避免过多使用数字4，可考虑用其他数字替代')
  }

  if (uniqueCombinations.length === 0) {
    suggestions.push('可以尝试选择包含特殊数字组合的号码')
  } else {
    uniqueCombinations.forEach(({ info }) => {
      if (info.suggestion) suggestions.push(info.suggestion)
    })
  }

  if (finalDigit === 4) {
    suggestions.push('最终数字为4，建议调整以改善整体能量')
  }

  if (positiveCount < 3) {
    suggestions.push('增加吉利数字的使用频率，提升整体能量')
  }

  if (suggestions.length === 0) {
    suggestions.push('当前数字能量良好，继续保持')
  }

  return {
    numbers,
    digitCount,
    sum,
    finalDigit,
    finalDigitInfo: NUMBER_MEANINGS[finalDigit.toString()],
    combinations: uniqueCombinations,
    score,
    level,
    levelText,
    levelColor,
    suggestions,
  }
}

export function validateNumberInput(input: string, type: NumberType): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  const numbers = trimmed.replace(/\D/g, '')
  if (numbers.length === 0) return '请输入有效的数字进行分析'
  if (type === 'phone' && numbers.length !== 11) return '请输入11位手机号'
  if (type === 'id' && numbers.length !== 18) return '请输入18位身份证号'
  return ''
}
