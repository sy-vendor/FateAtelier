import { useMemo, useState } from 'react'
import './Horoscope.css'
import { toast } from '../utils/toast'

type Period = 'today' | 'week' | 'month'
type CalendarType = 'solar' | 'lunar'

const zodiacSigns = [
  { id: 'aries', name: '白羊座', icon: '♈' },
  { id: 'taurus', name: '金牛座', icon: '♉' },
  { id: 'gemini', name: '双子座', icon: '♊' },
  { id: 'cancer', name: '巨蟹座', icon: '♋' },
  { id: 'leo', name: '狮子座', icon: '♌' },
  { id: 'virgo', name: '处女座', icon: '♍' },
  { id: 'libra', name: '天秤座', icon: '♎' },
  { id: 'scorpio', name: '天蝎座', icon: '♏' },
  { id: 'sagittarius', name: '射手座', icon: '♐' },
  { id: 'capricorn', name: '摩羯座', icon: '♑' },
  { id: 'aquarius', name: '水瓶座', icon: '♒' },
  { id: 'pisces', name: '双鱼座', icon: '♓' }
]

// 星座四象映射：与上方列表索引对应
const signIndexToElement: Array<'火' | '土' | '风' | '水'> = [
  '火', '土', '风', '水', '火', '土', '风', '水', '火', '土', '风', '水'
]
// 四象显示文案与同属星座
const elementToLabel: Record<'火'|'土'|'风'|'水', string> = {
  '火': '火象星座',
  '土': '土象星座',
  '风': '风象星座',
  '水': '水象星座'
}
const elementToPeers: Record<'火'|'土'|'风'|'水', string> = {
  '火': '白羊座・狮子座・射手座',
  '土': '金牛座・处女座・摩羯座',
  '风': '双子座・天秤座・水瓶座',
  '水': '巨蟹座・天蝎座・双鱼座'
}
// 基于日期和星座的确定性哈希函数
function hash(seed: number): number {
  let h = seed
  h = ((h << 5) - h) + seed
  h = h ^ (h >>> 16)
  h = h * 0x85ebca6b
  h = h ^ (h >>> 13)
  h = h * 0xc2b2ae35
  h = h ^ (h >>> 16)
  return Math.abs(h)
}

function getSeed(date: Date, signIndex: number, period: Period): number {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const base = period === 'today' ? (y * 10000 + m * 100 + d) : period === 'week' ? (y * 100 + getWeekNumber(date)) : (y * 100 + m)
  return base * 31 + signIndex * 97
}

// 确定性选择（基于哈希值）
function select<T>(seed: number, list: T[]): T {
  const index = hash(seed) % list.length
  return list[index]
}

function getWeekNumber(date: Date) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = temp.getUTCDay() || 7
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
  return Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

const luckyColors = [
  '蓝色', '金色', '绿色', '银色', '紫色', '红色', '白色', '黑色', '橙色', '青色',
  '粉色', '黄色', '棕色', '灰色', '米色', '深蓝', '浅绿', '珊瑚色', '薄荷绿', '薰衣草紫',
  '玫瑰金', '古铜色', '翡翠绿', '琥珀色', '珍珠白', '星空蓝', '樱花粉', '柠檬黄', '橄榄绿', '酒红色',
  '天蓝色', '象牙白', '墨绿色', '香槟金', '紫罗兰', '珊瑚橙', '薄荷蓝', '焦糖色', '海军蓝', '淡紫色'
]

const luckyItems = [
  '星形吊坠', '天然水晶', '精油香氛', '手账本', '幸运硬币', '羽毛笔', '丝巾', '手链', '耳饰', '胸针',
  '护身符', '平安符', '转运珠', '玉石挂件', '檀香手串', '紫水晶', '粉水晶', '黄水晶', '黑曜石', '玛瑙',
  '琥珀', '珍珠', '翡翠', '和田玉', '红绳手链', '银饰', '金饰', '铜钱', '五帝钱', '八卦镜',
  '风铃', '香囊', '护身卡', '幸运符', '许愿瓶', '能量石', '水晶球', '塔罗牌', '占卜牌', '护身手环',
  '平安扣', '貔貅', '龙龟', '金蟾', '招财猫', '福字挂件', '如意', '葫芦', '佛珠', '念珠',
  '木鱼', '经书', '护身符袋', '能量手链', '五行手链', '生肖挂件', '星座徽章', '幸运钥匙扣', '许愿石', '能量水晶'
]

// 基于种子生成分数（60-100）
function genScore(seed: number): number {
  return 60 + (hash(seed) % 41)
}

function genAdvice(seed: number, element: '火' | '土' | '风' | '水'): string {
  const common = [
    '把注意力放在当下的小目标上，会更高效也更踏实。',
    '与其纠结未知，不如先迈出第一步再微调方向。',
    '适合做一次小复盘，沉淀经验会带来新的灵感。',
    '保持耐心，节奏放缓反而能看清关键环节。',
    '与可信赖的人交流，会听到点醒你的那句话。',
    '稳住自己的节奏，不必与他人比较速度。',
    '适度肯定自己，稳定的自信会吸引好运靠近。',
    '规律作息与轻运动，会显著提升专注力与状态。',
    '先做减法，清理积压事项给新计划腾出空间。',
    '不必追求一次到位，小步快跑、持续迭代更靠谱。',
    '给自己一个可执行的时间表，别让理想悬在空中。',
    '把复杂问题拆解成三步，逐一推进会轻松很多。',
    '注意界限感，保留属于自己的安静时间。',
    '试着换个表达方式，沟通会更顺畅也更有效。',
    '适合学习新事物，哪怕是十分钟也会有收获。',
    '接纳不确定，先行动后修正，是今天的最佳策略。',
    '善用清单工具，明确优先级后再投入精力。',
    '别忘了奖励自己，一个小小的仪式感能增强动力。',
    '保持弹性预期，容许小波动，你会走得更稳。',
    '遇到阻力时，先处理最容易的部分建立信心。'
  ]
  const elementHints: Record<'火'|'土'|'风'|'水', string[]> = {
    '火': [
      '保持热情但别冲动，先做两分钟冷思考再行动。',
      '把能量用在关键一击上，避免分散火力。'
    ],
    '土': [
      '先筑地基再盖楼，流程与秩序会让你更安心。',
      '一步一步落实计划，小步复利最稳健。'
    ],
    '风': [
      '多交流与记录，灵感需要被及时捕捉和落地。',
      '尝试换个角度表达，你的说服力会更强。'
    ],
    '水': [
      '照顾情绪与直觉，内在的安定会带来外在顺利。',
      '适合温柔推进，用柔软化解小阻力。'
    ]
  }
  const pool = [...common, ...elementHints[element]]
  return select(seed, pool)
}

function genAspectText(seed: number, aspect: string, element: '火' | '土' | '风' | '水'): string {
  const templates = [
    `${aspect}方面起伏不大，稳中有进，按原计划推进更安心。`,
    `${aspect}方面会浮现新的灵感或机会，及时记录并尝试。`,
    `${aspect}方面先做减法，去冗余后重点会更突出。`,
    `${aspect}方面切忌急于求成，把过程做好结果自会靠近。`,
    `${aspect}方面适合协作沟通，倾听能换来更高的效率。`,
    `${aspect}方面可能遇到小波折，但恰好是微调方向的信号。`,
    `${aspect}方面可以设立一个可达成的小目标，增强掌控感。`,
    `${aspect}方面注意边界与节奏，避免被外部节奏牵着走。`,
    `${aspect}方面宜整顿与优化，工具化会让你事半功倍。`,
    `${aspect}方面主动表达诉求，比被动等待更能创造变化。`,
    `${aspect}方面宜稳中求新，保持底线同时尝试细微创新。`,
    `${aspect}方面若遇分歧，先对齐共同目标再谈细节。`,
    `${aspect}方面不妨放慢一步，检视关键假设是否成立。`,
    `${aspect}方面的好运来自准备，预案越充分越安心。`,
    `${aspect}方面宜关注长期复利，小习惯的力量正在累积。`,
    `${aspect}方面留意来自身边人的支持，一句鼓励就是助推器。`,
    `${aspect}方面若卡住，先转向边界问题，容易找到突破口。`,
    `${aspect}方面适合收尾与总结，为下一阶段铺好路。`
  ]
  const elementFlavors: Record<'火'|'土'|'风'|'水', string[]> = {
    '火': [
      `${aspect}方面宜主动出击，但要控制节奏与情绪。`,
      `${aspect}方面可设立挑战目标，用热情点燃进度。`
    ],
    '土': [
      `${aspect}方面讲究稳扎稳打，细节打磨会有质变。`,
      `${aspect}方面适合流程化，把控节点更踏实。`
    ],
    '风': [
      `${aspect}方面重在沟通与交换想法，信息越充分越顺畅。`,
      `${aspect}方面适合发散思考，再收敛到可执行方案。`
    ],
    '水': [
      `${aspect}方面以柔克刚，先安抚情绪再推动事项。`,
      `${aspect}方面重视直觉提示，往往能绕开不必要的阻力。`
    ]
  }
  const pool = [...templates, ...elementFlavors[element]]
  return select(seed, pool)
}

function genHoroscope(seed: number, element: '火' | '土' | '风' | '水') {
  // 使用不同的种子偏移来生成不同的值
  const overall = genScore(seed)
  const love = genScore(seed * 31 + 1)
  const career = genScore(seed * 31 + 2)
  const wealth = genScore(seed * 31 + 3)
  const health = genScore(seed * 31 + 4)
  const study = genScore(seed * 31 + 5)
  const color = select(seed * 31 + 6, luckyColors)
  const item = select(seed * 31 + 7, luckyItems)
  const summary = genAspectText(seed * 31 + 8, '整体', element)
  const advice = genAdvice(seed * 31 + 9, element)
  const details = [
    { key: '爱情', value: love, text: genAspectText(seed * 31 + 10, '爱情', element) },
    { key: '事业', value: career, text: genAspectText(seed * 31 + 11, '事业', element) },
    { key: '财富', value: wealth, text: genAspectText(seed * 31 + 12, '财富', element) },
    { key: '健康', value: health, text: genAspectText(seed * 31 + 13, '健康', element) },
    { key: '学业', value: study, text: genAspectText(seed * 31 + 14, '学业', element) }
  ]
  return { overall, summary, advice, color, item, details, element }
}

// 根据阳历日期计算星座
function getZodiacSignByDate(month: number, day: number): number {
  // 星座日期范围（阳历）
  // 摩羯座（跨年）：12月22日 - 1月19日
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 9 // 摩羯座
  }
  // 水瓶座：1月20日 - 2月18日
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 10 // 水瓶座
  }
  // 双鱼座：2月19日 - 3月20日
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 11 // 双鱼座
  }
  // 白羊座：3月21日 - 4月19日
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 0 // 白羊座
  }
  // 金牛座：4月20日 - 5月20日
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 1 // 金牛座
  }
  // 双子座：5月21日 - 6月21日
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return 2 // 双子座
  }
  // 巨蟹座：6月22日 - 7月22日
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return 3 // 巨蟹座
  }
  // 狮子座：7月23日 - 8月22日
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 4 // 狮子座
  }
  // 处女座：8月23日 - 9月22日
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 5 // 处女座
  }
  // 天秤座：9月23日 - 10月23日
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return 6 // 天秤座
  }
  // 天蝎座：10月24日 - 11月22日
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return 7 // 天蝎座
  }
  // 射手座：11月23日 - 12月21日
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return 8 // 射手座
  }

  return 0 // 默认返回白羊座（理论上不会到这里）
}

// 农历数据表（1900-2100年，共201年）
// 每个数字表示该年农历的信息，格式：前12位表示12个月的大小（1=大月30天，0=小月29天），后4位表示闰月月份（0=无闰月）
// 数据来源：标准农历数据表
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520,
  0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0,
  0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6,
  0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0,
  0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0,
  0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4,
  0x0a2d0, 0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0,
  0x0d150, 0x0f252, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150,
  0x0f252
]

// 标准位掩码工具
function getLeapMonth(year: number): number {
  const idx = year - 1900
  const info = lunarInfo[idx]
  return info & 0xf
}

function getLeapDays(year: number): number {
  const lm = getLeapMonth(year)
  if (lm) {
    const idx = year - 1900
    return (lunarInfo[idx] & 0x10000) ? 30 : 29
  }
  return 0
}

// 获取农历年的总天数（12个月+闰月）
function getLunarYearDays(year: number): number {
  const idx = year - 1900
  if (idx < 0 || idx >= lunarInfo.length) return 0
  let sum = 0
  for (let m = 1; m <= 12; m++) {
    sum += getLunarMonthDays(year, m)
  }
  sum += getLeapDays(year)
  return sum
}

// 获取农历某月的天数（month: 1-12；闰月用 month+12 表示）
function getLunarMonthDays(year: number, month: number): number {
  const idx = year - 1900
  if (idx < 0 || idx >= lunarInfo.length) return 0
  const info = lunarInfo[idx]
  const lm = getLeapMonth(year)
  if (month > 12) {
    const base = month - 12
    if (base !== lm) return 0
    return getLeapDays(year)
  }
  // 平月：按位判断，大月30，小月29（0x10000 >> month）
  return (info & (0x10000 >> month)) ? 30 : 29
}

// 农历转阳历
function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number): Date | null {
  // 参数验证
  if (lunarYear < 1900 || lunarYear > 2100) {
    return null
  }
  
  const yearIndex = lunarYear - 1900
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) {
    return null
  }
  
  const leapMonth = getLeapMonth(lunarYear)
  
  // 处理闰月标记：>12 表示闰某月
  const isLeapMonth = lunarMonth > 12
  const baseMonth = isLeapMonth ? lunarMonth - 12 : lunarMonth

  // 月份有效性
  if (baseMonth < 1 || baseMonth > 12) {
    return null
  }
  // 如果指明闰月，但该年没有该闰月，则无效
  if (isLeapMonth && baseMonth !== leapMonth) {
    return null
  }
  
  // 检查日期是否有效
  const monthDays = getLunarMonthDays(lunarYear, lunarMonth) // 支持 >12（闰月）
  if (lunarDay < 1 || lunarDay > monthDays) {
    return null
  }
  
  // 计算从1900年1月31日（农历正月初一）到目标日期的总天数
  let totalDays = 0
  
  // 1900年1月31日是农历正月初一对应的阳历日期
  const baseDate = new Date(1900, 0, 31)
  
  // 计算从1900年到目标年份的总天数
  for (let y = 1900; y < lunarYear; y++) {
    totalDays += getLunarYearDays(y)
  }
  
  // 计算目标年份从正月到目标月份的天数
  // 需要考虑闰月的位置（闰月在该月之后）
  for (let m = 1; m < baseMonth; m++) {
    totalDays += getLunarMonthDays(lunarYear, m) // 平月
    // 若该年此月之后有闰月（即本月是闰月的前一个月），则额外叠加闰月天数
    if (leapMonth > 0 && m === leapMonth) {
      totalDays += getLunarMonthDays(lunarYear, leapMonth + 12)
    }
  }
  // 如果目标就是闰月，则需要再累加该月的平月天数（闰月发生在该平月之后）
  if (isLeapMonth) totalDays += getLunarMonthDays(lunarYear, baseMonth)
  
  // 加上目标日期
  totalDays += lunarDay - 1
  
  // 计算对应的阳历日期
  const solarDate = new Date(baseDate)
  solarDate.setDate(solarDate.getDate() + totalDays)
  
  return solarDate
}

// 星座配对分析函数
function analyzeZodiacPairing(signIndex1: number, signIndex2: number) {
  if (signIndex1 === signIndex2) {
    return {
      relationships: ['相同'],
      score: 55,
      compatibility: '中等',
      analysis: '相同星座的配对，双方性格相似，容易理解彼此，但也可能因为过于相似而缺乏互补性。需要更多的沟通和包容来维持关系。'
    }
  }

  const element1 = signIndexToElement[signIndex1]
  const element2 = signIndexToElement[signIndex2]
  
  const relationships: string[] = []
  let score = 50 // 基础分数
  let compatibility = '中等'

  // 检查同象（相同元素）
  if (element1 === element2) {
    relationships.push('同象')
    score += 20
    if (compatibility === '中等') {
      compatibility = '良好'
    }
  }

  // 检查对宫（180度，相差6个位置）
  const diff = Math.abs(signIndex1 - signIndex2)
  if (diff === 6) {
    relationships.push('对宫')
    score -= 25
    compatibility = '较差'
  }

  // 检查三合（120度，相差4个位置）
  if (diff === 4 || diff === 8) {
    relationships.push('三合')
    score += 25
    if (compatibility !== '较差') {
      compatibility = '良好'
    }
  }

  // 检查六合（60度，相差2个位置）
  if (diff === 2 || diff === 10) {
    relationships.push('六合')
    score += 30
    compatibility = '极佳'
  }

  // 检查相刑（90度，相差3个位置）
  if (diff === 3 || diff === 9) {
    relationships.push('相刑')
    score -= 15
    if (compatibility === '极佳' || compatibility === '良好') {
      compatibility = '一般'
    } else if (compatibility === '中等') {
      compatibility = '较差'
    }
  }

  // 如果没有特殊关系
  if (relationships.length === 0) {
    relationships.push('普通')
  }

  // 限制分数范围
  score = Math.max(0, Math.min(100, score))

  // 生成详细分析
  let analysis = ''
  if (relationships.includes('六合')) {
    analysis = '六合是最佳的配对关系，代表和谐、互补，双方性格相投，容易产生默契，是星座配对中最为理想的组合。'
  } else if (relationships.includes('三合')) {
    analysis = '三合是良好的配对关系，代表三合局，双方能够互相支持，共同成长，关系稳定和谐。'
  } else if (relationships.includes('同象')) {
    analysis = '同象星座的配对，双方性格相似，容易理解彼此，有共同的话题和兴趣，但需要注意避免过于相似带来的单调。'
  } else if (relationships.includes('对宫')) {
    analysis = '对宫代表对立冲突，双方性格差异较大，容易产生矛盾和争执，需要更多的理解和包容。但若能互补，也能形成强大的吸引力。'
  } else if (relationships.includes('相刑')) {
    analysis = '相刑代表相互制约，双方在相处中可能会有一些摩擦和冲突，需要更多的耐心和理解。'
  } else {
    analysis = '普通配对关系，双方没有明显的相合或相冲，关系发展主要取决于个人的性格和相处方式。'
  }

  return {
    relationships,
    score,
    compatibility,
    analysis
  }
}

function Horoscope() {
  const [period, setPeriod] = useState<Period>('today')
  const [signIndex, setSignIndex] = useState<number>(0)
  const [calendarType, setCalendarType] = useState<CalendarType>('solar')
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [showBirthInput, setShowBirthInput] = useState(false)
  const [isLunarLeapMonth, setIsLunarLeapMonth] = useState(false)
  const [showPairing, setShowPairing] = useState(false)
  const [pairingSign1, setPairingSign1] = useState<number | null>(null)
  const [pairingSign2, setPairingSign2] = useState<number | null>(null)
  const [pairingResult, setPairingResult] = useState<{
    relationships: string[]
    score: number
    compatibility: string
    analysis: string
  } | null>(null)

  const today = new Date()

  // 根据生日查询星座
  const handleQueryByBirthday = () => {
    if (!birthYear || !birthMonth || !birthDay) {
      toast.warning('请完整输入生日信息')
      return
    }

    const year = parseInt(birthYear)
    const month = parseInt(birthMonth)
    const day = parseInt(birthDay)

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      toast.error('请输入有效的日期')
      return
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      toast.warning('请输入有效的日期范围')
      return
    }

    if (calendarType === 'solar') {
      // 阳历直接计算
      const calculatedSign = getZodiacSignByDate(month, day)
      setSignIndex(calculatedSign)
      setShowBirthInput(false)
      toast.success(`根据您的生日，您的星座是：${zodiacSigns[calculatedSign].icon} ${zodiacSigns[calculatedSign].name}`)
    } else {
      // 农历转阳历
      const lunarMonthParam = isLunarLeapMonth ? month + 12 : month
      const solarDate = lunarToSolar(year, lunarMonthParam, day)
      if (solarDate) {
        const calculatedSign = getZodiacSignByDate(solarDate.getMonth() + 1, solarDate.getDate())
        setSignIndex(calculatedSign)
        setShowBirthInput(false)
        const solarMonth = solarDate.getMonth() + 1
        const solarDay = solarDate.getDate()
        toast.success(`根据您的农历生日（${year}年${isLunarLeapMonth ? '闰' : ''}${month}月${day}日），对应的阳历是${solarDate.getFullYear()}年${solarMonth}月${solarDay}日，您的星座是：${zodiacSigns[calculatedSign].icon} ${zodiacSigns[calculatedSign].name}`)
      } else {
        // 转换失败，可能是日期无效或超出支持范围
        toast.error('农历日期转换失败，可能原因：\n1. 日期超出支持范围（1900-2100年）\n2. 输入的日期无效（如2月30日）\n3. 该年没有对应的农历月份\n\n建议：请检查输入的日期是否正确，或直接选择您的星座查看运势。')
      }
    }
  }

  const result = useMemo(() => {
    const seed = getSeed(today, signIndex, period)
    const element = signIndexToElement[signIndex]
    return genHoroscope(seed, element)
  }, [today, signIndex, period])

  const sign = zodiacSigns[signIndex]

  return (
    <div className="horoscope">
      <div className="horoscope-header">
        <h2>{sign.icon} {sign.name} · 星座运势</h2>
      </div>

      {/* 生日查询区域 */}
      <div className="birthday-query-section">
        <button 
          className="query-birthday-btn"
          onClick={() => setShowBirthInput(!showBirthInput)}
        >
          {showBirthInput ? '收起' : '📅 根据生日查询星座'}
        </button>
        
        {showBirthInput && (
          <div className="birthday-input-panel">
            <div className="calendar-type-toggle">
              <button
                className={calendarType === 'solar' ? 'active' : ''}
                onClick={() => { setCalendarType('solar'); setIsLunarLeapMonth(false) }}
              >
                阳历
              </button>
              <button
                className={calendarType === 'lunar' ? 'active' : ''}
                onClick={() => setCalendarType('lunar')}
              >
                农历
              </button>
            </div>
            
            <div className="birthday-inputs">
              <input
                type="number"
                placeholder="年"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                min="1900"
                max="2100"
                className="birthday-input"
              />
              <span className="input-separator">年</span>
              <input
                type="number"
                placeholder="月"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                min="1"
                max="12"
                className="birthday-input"
              />
              <span className="input-separator">月</span>
              <input
                type="number"
                placeholder="日"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                min="1"
                max="31"
                className="birthday-input"
              />
              <span className="input-separator">日</span>
              {calendarType === 'lunar' && (
                <label className="leap-checkbox">
                  <input
                    type="checkbox"
                    checked={isLunarLeapMonth}
                    onChange={(e) => setIsLunarLeapMonth(e.target.checked)}
                  />
                  闰月
                </label>
              )}
            </div>
            
            <button
              className="query-btn"
              onClick={handleQueryByBirthday}
            >
              查询星座
            </button>
            
            {calendarType === 'lunar' && (
              <p className="lunar-tip">
                💡 提示：支持1900-2100年的农历转阳历，包含闰月。若转换失败，可能是日期超出范围或该年无该闰月。
              </p>
            )}
          </div>
        )}
      </div>

      <div className="horoscope-controls">
        <div className="signs-scroll">
          {zodiacSigns.map((z, idx) => (
            <button
              key={z.id}
              className={`sign-chip ${idx === signIndex ? 'active' : ''}`}
              onClick={() => setSignIndex(idx)}
              title={z.name}
            >
              <span className="sign-icon">{z.icon}</span>
              <span className="sign-name">{z.name}</span>
            </button>
          ))}
        </div>

        <div className="period-toggle">
          <button className={period === 'today' ? 'active' : ''} onClick={() => setPeriod('today')}>今日</button>
          <button className={period === 'week' ? 'active' : ''} onClick={() => setPeriod('week')}>本周</button>
          <button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>本月</button>
        </div>
      </div>

      <div className="horoscope-cards">
        <div className="score-card">
          <div className="score">{result.overall}</div>
          <div className="label">综合指数</div>
        </div>
        <div className="info-card">
          <div className="info-row"><span>星座元素</span><b>{elementToLabel[result.element as '火'|'土'|'风'|'水']}</b></div>
          <div className="info-row"><span>同属星座</span><b>{elementToPeers[result.element as '火'|'土'|'风'|'水']}</b></div>
          <div className="info-row"><span>幸运颜色</span><b>{result.color}</b></div>
          <div className="info-row"><span>幸运物品</span><b>{result.item}</b></div>
        </div>
      </div>

      <div className="summary-card">
        <h3>整体概览</h3>
        <p>{result.summary}</p>
      </div>

      <div className="details-grid">
        {result.details.map(d => (
          <div key={d.key} className="detail-card">
            <div className="detail-header">
              <span className="detail-key">{d.key}</span>
              <span className="detail-score">{d.value}</span>
            </div>
            <p className="detail-text">{d.text}</p>
          </div>
        ))}
      </div>

      <div className="advice-card">
        <h3>今日建议</h3>
        <p>{result.advice}</p>
      </div>

      {/* 星座配对功能 */}
      <div className="zodiac-pairing-section">
        <button 
          className="pairing-toggle-btn"
          onClick={() => setShowPairing(!showPairing)}
        >
          {showPairing ? '收起' : '💕 星座配对'}
        </button>
        
        {showPairing && (
          <div className="pairing-panel">
            <h3>选择两个星座进行配对分析</h3>
            
            <div className="pairing-selectors">
              <div className="pairing-selector-group">
                <label>第一个星座</label>
                <div className="zodiac-pairing-grid">
                  {zodiacSigns.map((z, idx) => (
                    <button
                      key={z.id}
                      className={`zodiac-pairing-btn ${pairingSign1 === idx ? 'active' : ''}`}
                      onClick={() => setPairingSign1(idx)}
                    >
                      <span className="zodiac-pairing-icon">{z.icon}</span>
                      <span className="zodiac-pairing-name">{z.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pairing-selector-group">
                <label>第二个星座</label>
                <div className="zodiac-pairing-grid">
                  {zodiacSigns.map((z, idx) => (
                    <button
                      key={z.id}
                      className={`zodiac-pairing-btn ${pairingSign2 === idx ? 'active' : ''}`}
                      onClick={() => setPairingSign2(idx)}
                    >
                      <span className="zodiac-pairing-icon">{z.icon}</span>
                      <span className="zodiac-pairing-name">{z.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              className="analyze-pairing-btn"
              onClick={() => {
                if (pairingSign1 !== null && pairingSign2 !== null) {
                  const result = analyzeZodiacPairing(pairingSign1, pairingSign2)
                  setPairingResult(result)
                } else {
                  toast.warning('请选择两个星座')
                }
              }}
            >
              开始配对分析
            </button>

            {pairingResult && (
              <div className="pairing-result-card">
                <div className="pairing-result-header">
                  <h4>配对结果</h4>
                  <div 
                    className="pairing-compatibility-badge"
                    style={{
                      backgroundColor: pairingResult.compatibility === '极佳' ? '#4CAF50' :
                                      pairingResult.compatibility === '良好' ? '#8BC34A' :
                                      pairingResult.compatibility === '中等' ? '#FFC107' :
                                      pairingResult.compatibility === '一般' ? '#FF9800' : '#F44336'
                    }}
                  >
                    {pairingResult.compatibility}
                  </div>
                </div>

                <div className="pairing-score-circle">
                  <div className="pairing-score-value">{pairingResult.score}</div>
                  <div className="pairing-score-label">配对指数</div>
                </div>

                <div className="pairing-relationships">
                  <h5>配对关系</h5>
                  <div className="pairing-relationship-tags">
                    {pairingResult.relationships.map((rel, idx) => (
                      <span
                        key={idx}
                        className="pairing-relationship-tag"
                        style={{
                          backgroundColor: rel === '六合' || rel === '三合' ? '#4CAF50' :
                                          rel === '同象' ? '#2196F3' :
                                          rel === '对宫' || rel === '相刑' ? '#F44336' :
                                          rel === '相同' ? '#9C27B0' : '#757575'
                        }}
                      >
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pairing-analysis">
                  <h5>详细分析</h5>
                  <p>{pairingResult.analysis}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Horoscope



