export const QIMEN_BRAND = '奇门玄枢'
export const QIMEN_BRAND_EN = 'Mystic Pivot'

export const DIRECTION_OPTIONS = [
  { value: '东', label: '东' },
  { value: '东南', label: '东南' },
  { value: '南', label: '南' },
  { value: '西南', label: '西南' },
  { value: '西', label: '西' },
  { value: '西北', label: '西北' },
  { value: '北', label: '北' },
  { value: '东北', label: '东北' },
] as const

export const DIRECTION_ANGLES: Record<string, number> = {
  北: 0,
  东北: 45,
  东: 90,
  东南: 135,
  南: 180,
  西南: 225,
  西: 270,
  西北: 315,
}

export const directions = ['东', '东南', '南', '西南', '中', '西', '西北', '北', '东北']

export const palacePositions = [
  { row: 0, col: 0, name: '巽宫', direction: '东南' },
  { row: 0, col: 1, name: '离宫', direction: '南' },
  { row: 0, col: 2, name: '坤宫', direction: '西南' },
  { row: 1, col: 0, name: '震宫', direction: '东' },
  { row: 1, col: 1, name: '中宫', direction: '中' },
  { row: 1, col: 2, name: '兑宫', direction: '西' },
  { row: 2, col: 0, name: '艮宫', direction: '东北' },
  { row: 2, col: 1, name: '坎宫', direction: '北' },
  { row: 2, col: 2, name: '乾宫', direction: '西北' },
] as const

export const bamen = ['休门', '死门', '伤门', '杜门', '', '开门', '惊门', '生门', '景门']
export const bamenNames = ['休', '死', '伤', '杜', '', '开', '惊', '生', '景']

export const bamenMeanings: Record<
  string,
  { meaning: string; auspicious: boolean; description: string }
> = {
  休门: { meaning: '休息、休养', auspicious: true, description: '主休息、休养、安闲，适合静养、调整' },
  生门: { meaning: '生长、生机', auspicious: true, description: '主生长、生机、希望，适合创业、发展' },
  开门: { meaning: '开放、通达', auspicious: true, description: '主开放、通达、顺利，适合开始新事物' },
  景门: { meaning: '光明、美景', auspicious: true, description: '主光明、美景、文化，适合学习、展示' },
  死门: { meaning: '死亡、终结', auspicious: false, description: '主死亡、终结、闭塞，不宜行动' },
  惊门: { meaning: '惊恐、不安', auspicious: false, description: '主惊恐、不安、变动，需谨慎' },
  伤门: { meaning: '伤害、损失', auspicious: false, description: '主伤害、损失、争斗，需避免冲突' },
  杜门: { meaning: '阻塞、封闭', auspicious: false, description: '主阻塞、封闭、隐藏，宜保守' },
}

export const jiuxing = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英']
export const jiuxingNames = ['蓬', '芮', '冲', '辅', '禽', '心', '柱', '任', '英']

export const jiuxingMeanings: Record<
  string,
  { meaning: string; auspicious: boolean; description: string }
> = {
  天蓬: { meaning: '大盗之星', auspicious: false, description: '主盗贼、破败，需防小人' },
  天芮: { meaning: '病符之星', auspicious: false, description: '主疾病、问题，需注意健康' },
  天冲: { meaning: '雷震之星', auspicious: true, description: '主雷震、行动，适合快速行动' },
  天辅: { meaning: '文曲之星', auspicious: true, description: '主文曲、智慧，适合学习、教育' },
  天禽: { meaning: '中正之星', auspicious: true, description: '主中正、稳定，适合决策' },
  天心: { meaning: '天医之星', auspicious: true, description: '主天医、治疗，适合求医、养生' },
  天柱: { meaning: '破军之星', auspicious: false, description: '主破军、破坏，需谨慎' },
  天任: { meaning: '左辅之星', auspicious: true, description: '主左辅、帮助，适合合作' },
  天英: { meaning: '右弼之星', auspicious: true, description: '主右弼、光明，适合展示' },
}

export const bashen = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天']
export const bashenNames = ['符', '蛇', '阴', '合', '虎', '武', '地', '天']

export const bashenMeanings: Record<
  string,
  { meaning: string; auspicious: boolean; description: string }
> = {
  值符: { meaning: '领导、权威', auspicious: true, description: '主领导、权威，代表最高能量' },
  腾蛇: { meaning: '虚诈、变化', auspicious: false, description: '主虚诈、变化，需防欺骗' },
  太阴: { meaning: '阴柔、隐藏', auspicious: true, description: '主阴柔、隐藏，适合暗中行动' },
  六合: { meaning: '和合、合作', auspicious: true, description: '主和合、合作，适合合作、婚姻' },
  白虎: { meaning: '凶险、争斗', auspicious: false, description: '主凶险、争斗，需避免冲突' },
  玄武: { meaning: '盗贼、小人', auspicious: false, description: '主盗贼、小人，需防小人' },
  九地: { meaning: '稳定、保守', auspicious: true, description: '主稳定、保守，适合守成' },
  九天: { meaning: '高远、发展', auspicious: true, description: '主高远、发展，适合开拓' },
}

export function getBamenShortName(name: string): string {
  const idx = bamen.indexOf(name)
  return idx >= 0 ? bamenNames[idx] : name
}

export function getJiuxingShortName(name: string): string {
  const idx = jiuxing.indexOf(name)
  return idx >= 0 ? jiuxingNames[idx] : name
}

export function getBashenShortName(name: string): string {
  const idx = bashen.indexOf(name)
  return idx >= 0 ? bashenNames[idx] : name
}

const palaceNamesEn: Record<string, string> = {
  巽宫: 'Xun Palace', 离宫: 'Li Palace', 坤宫: 'Kun Palace', 震宫: 'Zhen Palace', 中宫: 'Center Palace',
  兑宫: 'Dui Palace', 艮宫: 'Gen Palace', 坎宫: 'Kan Palace', 乾宫: 'Qian Palace',
}
const bamenEn: Record<string, { short: string; full: string; meaning: string; description: string }> = {
  休门: { short: 'Rest', full: 'Rest Gate', meaning: 'Rest and recuperation', description: 'Supports rest, recuperation, and adjustment.' },
  生门: { short: 'Life', full: 'Life Gate', meaning: 'Growth and vitality', description: 'Supports growth, hope, entrepreneurship, and development.' },
  开门: { short: 'Open', full: 'Open Gate', meaning: 'Openness and access', description: 'Supports opening paths and beginning new work.' },
  景门: { short: 'View', full: 'View Gate', meaning: 'Light and beauty', description: 'Supports learning, culture, and presentation.' },
  死门: { short: 'Death', full: 'Death Gate', meaning: 'Endings and closure', description: 'Signals closure and obstruction; avoid action when possible.' },
  惊门: { short: 'Shock', full: 'Shock Gate', meaning: 'Alarm and unrest', description: 'Signals volatility and calls for caution.' },
  伤门: { short: 'Harm', full: 'Harm Gate', meaning: 'Injury and loss', description: 'Signals conflict or loss; avoid confrontation.' },
  杜门: { short: 'Block', full: 'Block Gate', meaning: 'Obstruction and concealment', description: 'Signals obstruction and favors a conservative approach.' },
}
const jiuxingEn: Record<string, { short: string; full: string; meaning: string; description: string }> = {
  天蓬: { short: 'Peng', full: 'Tian Peng Star', meaning: 'Bandit star', description: 'Signals disruption and the need to guard against bad actors.' },
  天芮: { short: 'Rui', full: 'Tian Rui Star', meaning: 'Illness star', description: 'Signals health concerns or obstacles; pay attention to wellbeing.' },
  天冲: { short: 'Chong', full: 'Tian Chong Star', meaning: 'Thunder star', description: 'Supports swift action and momentum.' },
  天辅: { short: 'Fu', full: 'Tian Fu Star', meaning: 'Scholar star', description: 'Supports learning, wisdom, and education.' },
  天禽: { short: 'Qin', full: 'Tian Qin Star', meaning: 'Central balance star', description: 'Supports balanced, stable decisions.' },
  天心: { short: 'Xin', full: 'Tian Xin Star', meaning: 'Healer star', description: 'Supports healing, healthcare, and wellbeing.' },
  天柱: { short: 'Zhu', full: 'Tian Zhu Star', meaning: 'Breaking star', description: 'Signals disruptive forces and calls for caution.' },
  天任: { short: 'Ren', full: 'Tian Ren Star', meaning: 'Support star', description: 'Supports cooperation and reliable assistance.' },
  天英: { short: 'Ying', full: 'Tian Ying Star', meaning: 'Brilliance star', description: 'Supports visibility, display, and achievement.' },
}
const bashenEn: Record<string, { short: string; full: string; meaning: string; description: string }> = {
  值符: { short: 'Chief', full: 'Chief Spirit', meaning: 'Leadership and authority', description: 'Represents leadership, authority, and the highest energy.' },
  腾蛇: { short: 'Serpent', full: 'Soaring Serpent', meaning: 'Deception and change', description: 'Signals shifting appearances; guard against deception.' },
  太阴: { short: 'Moon', full: 'Great Yin', meaning: 'Subtlety and concealment', description: 'Supports discreet, behind-the-scenes action.' },
  六合: { short: 'Harmony', full: 'Six Harmony', meaning: 'Harmony and cooperation', description: 'Supports cooperation, partnership, and marriage.' },
  白虎: { short: 'Tiger', full: 'White Tiger', meaning: 'Risk and conflict', description: 'Signals risk and conflict; avoid confrontation.' },
  玄武: { short: 'Tortoise', full: 'Dark Warrior', meaning: 'Theft and hidden rivals', description: 'Signals hidden rivals; stay alert.' },
  九地: { short: 'Earth', full: 'Nine Earth', meaning: 'Stability and reserve', description: 'Supports holding ground and conservative progress.' },
  九天: { short: 'Heaven', full: 'Nine Heaven', meaning: 'Reach and expansion', description: 'Supports expansion and ambitious development.' },
}

export function getPalaceNameEn(name: string): string { return palaceNamesEn[name] ?? name }
export function getBamenNameEn(name: string, short = false): string { return bamenEn[name] ? (short ? bamenEn[name].short : bamenEn[name].full) : name }
export function getJiuxingNameEn(name: string, short = false): string { return jiuxingEn[name] ? (short ? jiuxingEn[name].short : jiuxingEn[name].full) : name }
export function getBashenNameEn(name: string, short = false): string { return bashenEn[name] ? (short ? bashenEn[name].short : bashenEn[name].full) : name }
export function getBamenMeaningEn(name: string): string { return bamenEn[name]?.meaning ?? name }
export function getJiuxingMeaningEn(name: string): string { return jiuxingEn[name]?.meaning ?? name }
export function getBashenMeaningEn(name: string): string { return bashenEn[name]?.meaning ?? name }
export function getBamenDescriptionEn(name: string): string { return bamenEn[name]?.description ?? name }
export function getJiuxingDescriptionEn(name: string): string { return jiuxingEn[name]?.description ?? name }
export function getBashenDescriptionEn(name: string): string { return bashenEn[name]?.description ?? name }

export type QimenPhase = 'idle' | 'timed' | 'directed' | 'insight'

export const QIMEN_PHASE_STEP: Record<QimenPhase, 1 | 2 | 3 | 4> = {
  idle: 1,
  timed: 2,
  directed: 3,
  insight: 4,
}
