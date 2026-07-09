export const ZIWEI_BRAND = '紫微星垣'
export const ZIWEI_BRAND_EN = 'Purple Star Vault'

export const dizhiIndex: Record<string, number> = {
  子: 0, 丑: 1, 寅: 2, 卯: 3, 辰: 4, 巳: 5,
  午: 6, 未: 7, 申: 8, 酉: 9, 戌: 10, 亥: 11,
}

export const palaceNames = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄',
  '迁移', '奴仆', '官禄', '田宅', '福德', '父母',
]

export const SHICHEN_OPTIONS = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
] as const

export const SHICHEN_NAMES: Record<string, string> = {
  子: '子时(23:00-01:00)',
  丑: '丑时(01:00-03:00)',
  寅: '寅时(03:00-05:00)',
  卯: '卯时(05:00-07:00)',
  辰: '辰时(07:00-09:00)',
  巳: '巳时(09:00-11:00)',
  午: '午时(11:00-13:00)',
  未: '未时(13:00-15:00)',
  申: '申时(15:00-17:00)',
  酉: '酉时(17:00-19:00)',
  戌: '戌时(19:00-21:00)',
  亥: '亥时(21:00-23:00)',
}

export const KEY_PALACE_NAMES = ['命宫', '夫妻', '财帛', '官禄']

export type ZiweiPhase = 'idle' | 'birth' | 'stars' | 'insight'

export const ZIWEI_PHASE_STEP: Record<ZiweiPhase, 1 | 2 | 3 | 4> = {
  idle: 1,
  birth: 2,
  stars: 3,
  insight: 4,
}
