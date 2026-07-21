export const LUCKY_COLOR_BRAND = '霓彩灵枢'
export const LUCKY_COLOR_BRAND_EN = 'Chromatic Nexus'

export const SHENGXIAO_LIST = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] as const

export const ZODIAC_NAMES = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'] as const

export function formatLuckyColorDate(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${year}年${month}月${day}日 · 星期${weekdays[date.getDay()]}`
}

export function getTimeSlotLabel(hour: number): string {
  if (hour >= 6 && hour < 9) return '早晨 (6-9点)'
  if (hour >= 9 && hour < 12) return '上午 (9-12点)'
  if (hour >= 12 && hour < 18) return '下午 (12-18点)'
  return '晚上 (18-24点)'
}

export function getTimeSlotLabelEn(time: string): string {
  const labels: Record<string, string> = {
    '早晨 (6-9点)': 'Morning (6–9 AM)',
    '上午 (9-12点)': 'Late morning (9 AM–12 PM)',
    '下午 (12-18点)': 'Afternoon (12–6 PM)',
    '晚上 (18-24点)': 'Evening (6 PM–12 AM)',
  }
  return labels[time] ?? time
}

export function getTimeSlotColorEn(color: string): string {
  const names: Record<string, string> = {
    深红: 'Deep red', 正红: 'True red', 亮红: 'Bright red', 暗红: 'Dark red',
    深橙: 'Deep orange', 正橙: 'True orange', 亮橙: 'Bright orange', 暗橙: 'Dark orange',
    金黄: 'Golden yellow', 正黄: 'True yellow', 亮黄: 'Bright yellow', 暗黄: 'Dark yellow',
    深绿: 'Deep green', 正绿: 'True green', 亮绿: 'Bright green', 暗绿: 'Dark green',
    深蓝: 'Deep blue', 正蓝: 'True blue', 亮蓝: 'Bright blue', 暗蓝: 'Dark blue',
    深紫: 'Deep purple', 正紫: 'True purple', 亮紫: 'Bright purple', 暗紫: 'Dark purple',
    深粉: 'Deep pink', 正粉: 'True pink', 亮粉: 'Bright pink', 暗粉: 'Dark pink',
    深金: 'Deep gold', 正金: 'True gold', 亮金: 'Bright gold', 暗金: 'Dark gold',
    深银: 'Deep silver', 正银: 'True silver', 亮银: 'Bright silver', 暗银: 'Dark silver',
    纯白: 'Pure white', 亮白: 'Bright white', 暖白: 'Warm white', 柔白: 'Soft white',
    深黑: 'Deep black', 正黑: 'True black', 灰黑: 'Charcoal black', 纯黑: 'Pure black',
    深棕: 'Deep brown', 正棕: 'True brown', 亮棕: 'Bright brown', 暗棕: 'Dark brown',
    深青: 'Deep teal', 正青: 'True teal', 亮青: 'Bright teal', 暗青: 'Dark teal',
  }
  return names[color] ?? color
}

export interface ColorInfo {
  name: string
  nameEn?: string
  hex: string
  rgb: string
  meaning: string
  meaningEn?: string
  suggestions: string[]
  suggestionsEn?: string[]
  compatibleColors: string[]
  element: string
  elementEn?: string
  energy: string
  energyEn?: string
  psychology?: string
  psychologyEn?: string
  culture?: string
  cultureEn?: string
  energyLevel?: number
  timeSlots?: { time: string; color: string; hex: string }[]
}

// 幸运色数据库
export const COLOR_DATABASE: Record<string, ColorInfo> = {
  red: {
    name: '红色',
    hex: '#FF4444',
    rgb: '255, 68, 68',
    meaning: '热情、活力、勇气',
    suggestions: ['适合重要会议和决策', '增强自信和行动力', '提升人际关系', '激发创造力'],
    compatibleColors: ['金色', '白色', '黑色'],
    element: '火',
    energy: '积极向上',
    psychology: '红色能刺激肾上腺素分泌，提高心率和血压，增强自信和勇气。在心理学中，红色代表力量、激情和决心。',
    culture: '在中国文化中，红色象征吉祥、喜庆和好运。在西方，红色代表爱情和激情。',
    energyLevel: 95,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深红', hex: '#CC0000' },
      { time: '上午 (9-12点)', color: '正红', hex: '#FF4444' },
      { time: '下午 (12-18点)', color: '亮红', hex: '#FF6666' },
      { time: '晚上 (18-24点)', color: '暗红', hex: '#AA0000' }
    ]
  },
  orange: {
    name: '橙色',
    hex: '#FF8844',
    rgb: '255, 136, 68',
    meaning: '创造力、乐观、社交',
    suggestions: ['适合创意工作', '促进团队合作', '带来好心情', '增强沟通能力'],
    compatibleColors: ['黄色', '红色', '棕色'],
    element: '火',
    energy: '温暖活跃',
    psychology: '橙色结合了红色的活力和黄色的快乐，能激发创造力和社交欲望，促进乐观情绪。',
    culture: '橙色在印度教中代表神圣和纯净，在西方文化中象征秋天和收获。',
    energyLevel: 85,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深橙', hex: '#CC6600' },
      { time: '上午 (9-12点)', color: '正橙', hex: '#FF8844' },
      { time: '下午 (12-18点)', color: '亮橙', hex: '#FFAA66' },
      { time: '晚上 (18-24点)', color: '暗橙', hex: '#AA5500' }
    ]
  },
  yellow: {
    name: '黄色',
    hex: '#FFD700',
    rgb: '255, 215, 0',
    meaning: '智慧、财富、快乐',
    suggestions: ['适合学习和思考', '吸引财运', '提升专注力', '增强记忆力'],
    compatibleColors: ['金色', '橙色', '绿色'],
    element: '土',
    energy: '明亮开朗',
    psychology: '黄色能刺激大脑的创造性思维，提高注意力和记忆力，带来快乐和乐观的情绪。',
    culture: '在中国，黄色是帝王的颜色，象征权力和尊贵。在佛教中，黄色代表智慧和觉悟。',
    energyLevel: 90,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '金黄', hex: '#FFCC00' },
      { time: '上午 (9-12点)', color: '正黄', hex: '#FFD700' },
      { time: '下午 (12-18点)', color: '亮黄', hex: '#FFEE00' },
      { time: '晚上 (18-24点)', color: '暗黄', hex: '#CCAA00' }
    ]
  },
  green: {
    name: '绿色',
    hex: '#44CC88',
    rgb: '68, 204, 136',
    meaning: '成长、平衡、健康',
    suggestions: ['适合新开始', '促进身心健康', '带来平静', '缓解压力'],
    compatibleColors: ['蓝色', '黄色', '白色'],
    element: '木',
    energy: '生机勃勃',
    psychology: '绿色能降低眼压，缓解视觉疲劳，带来平静和放松的感觉，有助于恢复精力。',
    culture: '绿色在伊斯兰教中代表天堂，在西方文化中象征自然和环保，在中国代表生命和希望。',
    energyLevel: 75,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深绿', hex: '#00AA55' },
      { time: '上午 (9-12点)', color: '正绿', hex: '#44CC88' },
      { time: '下午 (12-18点)', color: '亮绿', hex: '#66EEAA' },
      { time: '晚上 (18-24点)', color: '暗绿', hex: '#008844' }
    ]
  },
  blue: {
    name: '蓝色',
    hex: '#4488FF',
    rgb: '68, 136, 255',
    meaning: '冷静、信任、智慧',
    suggestions: ['适合重要沟通', '提升专注力', '带来安全感', '促进深度思考'],
    compatibleColors: ['白色', '银色', '绿色'],
    element: '水',
    energy: '宁静深远',
    psychology: '蓝色能降低心率和血压，带来平静和安全感，有助于提高专注力和逻辑思维。',
    culture: '蓝色在基督教中代表天堂和神圣，在商业中象征信任和稳定，在中国文化中代表智慧和冷静。',
    energyLevel: 70,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深蓝', hex: '#0066CC' },
      { time: '上午 (9-12点)', color: '正蓝', hex: '#4488FF' },
      { time: '下午 (12-18点)', color: '亮蓝', hex: '#66AAFF' },
      { time: '晚上 (18-24点)', color: '暗蓝', hex: '#0044AA' }
    ]
  },
  purple: {
    name: '紫色',
    hex: '#8844CC',
    rgb: '136, 68, 204',
    meaning: '神秘、灵感、直觉',
    suggestions: ['适合艺术创作', '增强直觉力', '提升灵性', '激发想象力'],
    compatibleColors: ['粉色', '银色', '白色'],
    element: '火',
    energy: '神秘优雅',
    psychology: '紫色能激发右脑的创造力和直觉，促进灵性和冥想，有助于艺术创作和深度思考。',
    culture: '紫色在历史上是贵族的颜色，象征权力和神秘。在西方，紫色代表灵性和智慧。',
    energyLevel: 80,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深紫', hex: '#6600AA' },
      { time: '上午 (9-12点)', color: '正紫', hex: '#8844CC' },
      { time: '下午 (12-18点)', color: '亮紫', hex: '#AA66EE' },
      { time: '晚上 (18-24点)', color: '暗紫', hex: '#550088' }
    ]
  },
  pink: {
    name: '粉色',
    hex: '#FF88CC',
    rgb: '255, 136, 204',
    meaning: '温柔、爱情、浪漫',
    suggestions: ['适合约会和社交', '增进感情', '带来好心情', '缓解紧张情绪'],
    compatibleColors: ['白色', '紫色', '红色'],
    element: '火',
    energy: '温柔浪漫',
    psychology: '粉色能降低攻击性，带来温柔和关爱的感觉，有助于缓解压力和焦虑，促进情感交流。',
    culture: '粉色在西方文化中代表女性、爱情和浪漫，在日本文化中象征樱花和春天。',
    energyLevel: 65,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深粉', hex: '#CC66AA' },
      { time: '上午 (9-12点)', color: '正粉', hex: '#FF88CC' },
      { time: '下午 (12-18点)', color: '亮粉', hex: '#FFAAEE' },
      { time: '晚上 (18-24点)', color: '暗粉', hex: '#AA4488' }
    ]
  },
  gold: {
    name: '金色',
    hex: '#FFD700',
    rgb: '255, 215, 0',
    meaning: '财富、成功、尊贵',
    suggestions: ['适合重要场合', '吸引财运', '提升地位', '增强自信'],
    compatibleColors: ['红色', '黑色', '白色'],
    element: '金',
    energy: '尊贵华丽',
    psychology: '金色能激发对成功和财富的渴望，增强自信和自尊，带来积极向上的能量。',
    culture: '金色在几乎所有文化中都代表财富、权力和神圣，是帝王和贵族的象征。',
    energyLevel: 95,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深金', hex: '#CCAA00' },
      { time: '上午 (9-12点)', color: '正金', hex: '#FFD700' },
      { time: '下午 (12-18点)', color: '亮金', hex: '#FFEE44' },
      { time: '晚上 (18-24点)', color: '暗金', hex: '#AA8800' }
    ]
  },
  silver: {
    name: '银色',
    hex: '#C0C0C0',
    rgb: '192, 192, 192',
    meaning: '现代、科技、未来',
    suggestions: ['适合创新项目', '提升科技感', '带来新思维', '增强逻辑分析'],
    compatibleColors: ['蓝色', '白色', '黑色'],
    element: '金',
    energy: '现代前卫',
    psychology: '银色能带来冷静和理性的思考，促进创新和科技感，有助于逻辑分析和决策。',
    culture: '银色在现代文化中代表科技、未来和现代感，在传统中象征月亮和神秘。',
    energyLevel: 75,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深银', hex: '#999999' },
      { time: '上午 (9-12点)', color: '正银', hex: '#C0C0C0' },
      { time: '下午 (12-18点)', color: '亮银', hex: '#E0E0E0' },
      { time: '晚上 (18-24点)', color: '暗银', hex: '#808080' }
    ]
  },
  white: {
    name: '白色',
    hex: '#FFFFFF',
    rgb: '255, 255, 255',
    meaning: '纯净、简洁、新开始',
    suggestions: ['适合新计划', '带来清晰思路', '净化能量', '提升专注力'],
    compatibleColors: ['所有颜色'],
    element: '金',
    energy: '纯净简洁',
    psychology: '白色能带来平静和清晰，有助于整理思绪，促进新的开始和净化能量。',
    culture: '白色在西方文化中代表纯洁和婚礼，在东方文化中象征哀悼和尊重，在医疗中代表清洁。',
    energyLevel: 60,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '纯白', hex: '#FFFFFF' },
      { time: '上午 (9-12点)', color: '亮白', hex: '#FFFFFF' },
      { time: '下午 (12-18点)', color: '暖白', hex: '#FFFEF5' },
      { time: '晚上 (18-24点)', color: '柔白', hex: '#F5F5F5' }
    ]
  },
  black: {
    name: '黑色',
    hex: '#222222',
    rgb: '34, 34, 34',
    meaning: '力量、神秘、保护',
    suggestions: ['适合重要决策', '增强意志力', '提供保护', '提升专注力'],
    compatibleColors: ['金色', '红色', '白色'],
    element: '水',
    energy: '深沉有力',
    psychology: '黑色能带来安全感和保护感，增强意志力和决心，有助于深度思考和决策。',
    culture: '黑色在西方文化中代表优雅和正式，在东方文化中象征智慧和深度，在时尚中代表经典。',
    energyLevel: 90,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深黑', hex: '#000000' },
      { time: '上午 (9-12点)', color: '正黑', hex: '#222222' },
      { time: '下午 (12-18点)', color: '灰黑', hex: '#333333' },
      { time: '晚上 (18-24点)', color: '纯黑', hex: '#111111' }
    ]
  },
  brown: {
    name: '棕色',
    hex: '#8B4513',
    rgb: '139, 69, 19',
    meaning: '稳定、可靠、踏实',
    suggestions: ['适合长期规划', '带来安全感', '增强稳定性', '促进耐心'],
    compatibleColors: ['橙色', '黄色', '绿色'],
    element: '土',
    energy: '稳重踏实',
    psychology: '棕色能带来稳定和安全感，促进耐心和持久力，有助于长期规划和执行。',
    culture: '棕色在自然中代表大地和树木，在文化中象征稳定、可靠和传统。',
    energyLevel: 70,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深棕', hex: '#5C2E0A' },
      { time: '上午 (9-12点)', color: '正棕', hex: '#8B4513' },
      { time: '下午 (12-18点)', color: '亮棕', hex: '#A0522D' },
      { time: '晚上 (18-24点)', color: '暗棕', hex: '#654321' }
    ]
  },
  teal: {
    name: '青色',
    hex: '#20B2AA',
    rgb: '32, 178, 170',
    meaning: '清新、平衡、沟通',
    suggestions: ['适合沟通交流', '带来平衡感', '提升表达能力', '促进和谐'],
    compatibleColors: ['白色', '蓝色', '绿色'],
    element: '水',
    energy: '清新平衡',
    psychology: '青色结合了蓝色的冷静和绿色的生机，能带来平衡和和谐，促进沟通和理解。',
    culture: '青色在东方文化中代表青春和活力，在西方文化中象征清新和现代感。',
    energyLevel: 75,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深青', hex: '#008B8B' },
      { time: '上午 (9-12点)', color: '正青', hex: '#20B2AA' },
      { time: '下午 (12-18点)', color: '亮青', hex: '#40D4CC' },
      { time: '晚上 (18-24点)', color: '暗青', hex: '#006B6B' }
    ]
  }
}

const colorTranslations: Record<string, Omit<Pick<ColorInfo, 'nameEn' | 'meaningEn' | 'suggestionsEn' | 'elementEn' | 'energyEn' | 'psychologyEn' | 'cultureEn'>, never>> = {
  red: { nameEn: 'Red', meaningEn: 'Passion, vitality, courage', suggestionsEn: ['For important meetings and decisions', 'Build confidence and initiative', 'Strengthen relationships', 'Spark creativity'], elementEn: 'Fire', energyEn: 'Positive and uplifting', psychologyEn: 'Red can stimulate adrenaline, confidence, and courage. In psychology it represents power, passion, and determination.', cultureEn: 'In Chinese culture, red symbolizes good fortune and celebration; in the West, it represents love and passion.' },
  orange: { nameEn: 'Orange', meaningEn: 'Creativity, optimism, sociability', suggestionsEn: ['For creative work', 'Encourage teamwork', 'Lift your mood', 'Strengthen communication'], elementEn: 'Fire', energyEn: 'Warm and active', psychologyEn: 'Orange combines red’s vitality with yellow’s joy, supporting creativity, sociability, and optimism.', cultureEn: 'Orange represents sanctity and purity in Hinduism, and autumn and harvest in Western culture.' },
  yellow: { nameEn: 'Yellow', meaningEn: 'Wisdom, wealth, joy', suggestionsEn: ['For study and reflection', 'Invite prosperity', 'Improve focus', 'Strengthen memory'], elementEn: 'Earth', energyEn: 'Bright and cheerful', psychologyEn: 'Yellow can stimulate creative thought, attention, memory, and optimistic feelings.', cultureEn: 'In China, yellow symbolizes imperial authority; in Buddhism, it represents wisdom and awakening.' },
  green: { nameEn: 'Green', meaningEn: 'Growth, balance, health', suggestionsEn: ['For new beginnings', 'Support mind-body health', 'Create calm', 'Ease stress'], elementEn: 'Wood', energyEn: 'Vibrant and growing', psychologyEn: 'Green can ease visual fatigue and foster calm, rest, and renewed energy.', cultureEn: 'Green represents paradise in Islam, and nature and environmentalism in Western culture.' },
  blue: { nameEn: 'Blue', meaningEn: 'Calm, trust, wisdom', suggestionsEn: ['For important communication', 'Improve focus', 'Create security', 'Support deep thought'], elementEn: 'Water', energyEn: 'Calm and profound', psychologyEn: 'Blue can promote calm, security, focus, and logical thinking.', cultureEn: 'Blue represents heaven in Christianity and trust and stability in business culture.' },
  purple: { nameEn: 'Purple', meaningEn: 'Mystery, inspiration, intuition', suggestionsEn: ['For artistic creation', 'Strengthen intuition', 'Support spirituality', 'Spark imagination'], elementEn: 'Fire', energyEn: 'Mysterious and elegant', psychologyEn: 'Purple can support creativity, intuition, meditation, and artistic reflection.', cultureEn: 'Historically a royal color, purple symbolizes power, mystery, spirituality, and wisdom.' },
  pink: { nameEn: 'Pink', meaningEn: 'Gentleness, love, romance', suggestionsEn: ['For dates and socializing', 'Nurture affection', 'Lift your mood', 'Ease tension'], elementEn: 'Fire', energyEn: 'Gentle and romantic', psychologyEn: 'Pink can soften aggression, relieve stress and anxiety, and support emotional connection.', cultureEn: 'Pink represents femininity, love, and romance in the West, and cherry blossoms and spring in Japan.' },
  gold: { nameEn: 'Gold', meaningEn: 'Wealth, success, prestige', suggestionsEn: ['For important occasions', 'Invite prosperity', 'Elevate presence', 'Build confidence'], elementEn: 'Metal', energyEn: 'Prestigious and radiant', psychologyEn: 'Gold can inspire aspiration, confidence, self-esteem, and positive energy.', cultureEn: 'Across cultures, gold symbolizes wealth, power, sacredness, and nobility.' },
  silver: { nameEn: 'Silver', meaningEn: 'Modernity, technology, future', suggestionsEn: ['For innovative projects', 'Add a technological feel', 'Encourage fresh thinking', 'Strengthen logical analysis'], elementEn: 'Metal', energyEn: 'Modern and forward-looking', psychologyEn: 'Silver can support calm, rational thought, innovation, and logical decision-making.', cultureEn: 'Silver symbolizes technology and the future today, and the moon and mystery in tradition.' },
  white: { nameEn: 'White', meaningEn: 'Purity, simplicity, new beginnings', suggestionsEn: ['For new plans', 'Create clarity', 'Cleanse energy', 'Improve focus'], elementEn: 'Metal', energyEn: 'Pure and simple', psychologyEn: 'White can create calm and clarity, helping organize thoughts and welcome new beginnings.', cultureEn: 'White represents purity and weddings in the West, and mourning and respect in East Asia.' },
  black: { nameEn: 'Black', meaningEn: 'Strength, mystery, protection', suggestionsEn: ['For important decisions', 'Strengthen resolve', 'Create protection', 'Improve focus'], elementEn: 'Water', energyEn: 'Deep and powerful', psychologyEn: 'Black can evoke safety, protection, resolve, and deep thought.', cultureEn: 'Black represents elegance and formality in the West, and wisdom and depth in Eastern culture.' },
  brown: { nameEn: 'Brown', meaningEn: 'Stability, reliability, groundedness', suggestionsEn: ['For long-term planning', 'Create security', 'Strengthen stability', 'Encourage patience'], elementEn: 'Earth', energyEn: 'Steady and grounded', psychologyEn: 'Brown can create stability and security while supporting patience and sustained effort.', cultureEn: 'Brown evokes earth and trees, and symbolizes stability, reliability, and tradition.' },
  teal: { nameEn: 'Teal', meaningEn: 'Freshness, balance, communication', suggestionsEn: ['For conversation and exchange', 'Create balance', 'Improve expression', 'Support harmony'], elementEn: 'Water', energyEn: 'Fresh and balanced', psychologyEn: 'Teal combines blue’s calm with green’s vitality, supporting balance, communication, and understanding.', cultureEn: 'Teal represents youth and vitality in East Asia, and freshness and modernity in Western culture.' },
}

Object.entries(colorTranslations).forEach(([key, translation]) => {
  Object.assign(COLOR_DATABASE[key], translation)
})
