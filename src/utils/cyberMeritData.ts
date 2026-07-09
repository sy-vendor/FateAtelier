export const CYBER_MERIT_BRAND = '赛博积德'
export const CYBER_MERIT_BRAND_EN = 'Cyber Merit'

export type MeritGameType = 'woodfish' | 'release' | 'incense' | 'prayer'

export interface MeritGameOption {
  id: MeritGameType
  label: string
  title: string
  description: string
  meritPerAction: number
  hint: string
}

export const MERIT_GAMES: MeritGameOption[] = [
  {
    id: 'woodfish',
    label: '木鱼',
    title: '敲电子木鱼',
    description: '轻触木鱼，一声一功德，可开启自动修行',
    meritPerAction: 1,
    hint: '点击木鱼敲击 · 每次 +1 功德',
  },
  {
    id: 'release',
    label: '放生',
    title: '赛博放生',
    description: '点选生灵放归自然，慈悲积善',
    meritPerAction: 3,
    hint: '点击生灵放生 · 每次 +3 功德',
  },
  {
    id: 'incense',
    label: '上香',
    title: '赛博上香',
    description: '点燃心香，烟气袅袅，虔诚祈福',
    meritPerAction: 2,
    hint: '点击香炉上香 · 每次 +2 功德',
  },
  {
    id: 'prayer',
    label: '祈福',
    title: '赛博祈福',
    description: '双手合十，心诚则灵，福报自来',
    meritPerAction: 5,
    hint: '点击合十祈福 · 每次 +5 功德',
  },
]

export type ReleaseCreatureId = 'carp' | 'koi' | 'turtle' | 'dove' | 'butterfly' | 'gecko'
export type ReleaseMotion = 'swim' | 'fly' | 'crawl'

export interface ReleaseCreature {
  id: ReleaseCreatureId
  name: string
  motion: ReleaseMotion
}

export const RELEASE_CREATURES: ReleaseCreature[] = [
  { id: 'carp', name: '灵鲤', motion: 'swim' },
  { id: 'koi', name: '锦鲤', motion: 'swim' },
  { id: 'turtle', name: '灵龟', motion: 'crawl' },
  { id: 'dove', name: '白鸽', motion: 'fly' },
  { id: 'butterfly', name: '幻蝶', motion: 'fly' },
  { id: 'gecko', name: '灵蜥', motion: 'crawl' },
]

export const MERIT_MILESTONES = [10, 50, 100, 200, 500, 1000, 2000, 5000] as const

export const MERIT_MESSAGES: Record<MeritGameType, string[]> = {
  woodfish: [
    '南无阿弥陀佛', '功德无量', '心诚则灵', '善哉善哉', '功德+1',
    '福报满满', '心静自然凉', '一念清净', '功德圆满', '善念长存',
  ],
  release: [
    '放生功德无量', '慈悲为怀', '功德+3', '善行善报', '生命可贵',
    '慈悲心起', '功德圆满', '善念长存', '福报满满', '功德无量',
  ],
  incense: [
    '香火袅袅', '心诚则灵', '功德+2', '福报满满', '香火不断',
    '虔诚祈福', '功德圆满', '善念长存', '功德无量', '心诚则灵',
  ],
  prayer: [
    '祈福成功', '心诚则灵', '功德+5', '福报满满', '虔诚祈福',
    '功德圆满', '善念长存', '功德无量', '心想事成', '福星高照',
  ],
}

export const MILESTONE_MESSAGES: Record<MeritGameType, (count: number) => string> = {
  woodfish: (c) => `已敲木鱼 ${c} 次，功德无量`,
  release: (c) => `已放生 ${c} 次，慈悲为怀`,
  incense: (c) => `已上香 ${c} 次，香火不断`,
  prayer: (c) => `已祈福 ${c} 次，福报满满`,
}

export type MeritPhase = 'choose' | 'practice' | 'accumulate' | 'milestone'

export const MERIT_PHASE_STEP: Record<MeritPhase, 1 | 2 | 3 | 4> = {
  choose: 1,
  practice: 2,
  accumulate: 3,
  milestone: 4,
}

export type FloatingTextType = 'merit' | 'message' | 'milestone'

export interface FloatingText {
  id: number
  text: string
  x: number
  y: number
  type: FloatingTextType
}

export interface ReleaseAnimation {
  index: number
  motion: ReleaseMotion
}

export const STORAGE_KEYS: Record<MeritGameType, string> = {
  woodfish: 'cyber-woodfish-count',
  release: 'cyber-release-count',
  incense: 'cyber-incense-count',
  prayer: 'cyber-prayer-count',
}
