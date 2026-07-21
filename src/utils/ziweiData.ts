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

export const palaceNamesEn = [
  'Life', 'Siblings', 'Marriage', 'Children', 'Wealth', 'Health',
  'Travel', 'Friends', 'Career', 'Property', 'Wellbeing', 'Parents',
]

export const starNamesEn: Record<string, string> = {
  紫微: 'Purple Star', 天机: 'Heavenly Mechanism', 太阳: 'Sun', 武曲: 'Military Arts', 天同: 'Heavenly Companion', 廉贞: 'Integrity',
  天府: 'Heavenly Treasury', 太阴: 'Moon', 贪狼: 'Greedy Wolf', 巨门: 'Great Gate', 天相: 'Heavenly Minister', 天梁: 'Heavenly Beam', 七杀: 'Seven Killings', 破军: 'Army Breaker',
  左辅: 'Left Assistant', 右弼: 'Right Assistant', 文昌: 'Literary Prosperity', 文曲: 'Literary Melody', 天魁: 'Heavenly Leader', 天钺: 'Heavenly Assistant',
  禄存: 'Stored Prosperity', 天马: 'Heavenly Horse', 擎羊: 'Ram Blade', 陀罗: 'Tangle', 火星: 'Fire Star', 铃星: 'Bell Star',
  地空: 'Earth Void', 地劫: 'Earth Robbery', 红鸾: 'Red Phoenix', 天喜: 'Heavenly Joy', 天刑: 'Heavenly Punishment', 天姚: 'Heavenly Charm',
  天德: 'Heavenly Virtue', 月德: 'Moon Virtue', 天德合: 'Heavenly Virtue Union', 月德合: 'Moon Virtue Union', 天医: 'Heavenly Healer',
  解神: 'Relief Spirit', 华盖: 'Canopy', 咸池: 'Peach Blossom Pool', 大耗: 'Great Loss', 小耗: 'Minor Loss', 岁建: 'Year Builder', 岁破: 'Year Breaker',
  龙德: 'Dragon Virtue', 白虎: 'White Tiger', 天狗: 'Heavenly Dog',
}

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

export const SHICHEN_NAMES_EN: Record<string, string> = {
  子: 'Rat hour (23:00–01:00)', 丑: 'Ox hour (01:00–03:00)',
  寅: 'Tiger hour (03:00–05:00)', 卯: 'Rabbit hour (05:00–07:00)',
  辰: 'Dragon hour (07:00–09:00)', 巳: 'Snake hour (09:00–11:00)',
  午: 'Horse hour (11:00–13:00)', 未: 'Goat hour (13:00–15:00)',
  申: 'Monkey hour (15:00–17:00)', 酉: 'Rooster hour (17:00–19:00)',
  戌: 'Dog hour (19:00–21:00)', 亥: 'Pig hour (21:00–23:00)',
}

export const KEY_PALACE_NAMES = ['命宫', '夫妻', '财帛', '官禄']

export type ZiweiPhase = 'idle' | 'birth' | 'stars' | 'insight'

export const ZIWEI_PHASE_STEP: Record<ZiweiPhase, 1 | 2 | 3 | 4> = {
  idle: 1,
  birth: 2,
  stars: 3,
  insight: 4,
}
