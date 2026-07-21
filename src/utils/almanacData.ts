import { isEnglishLocale } from '../i18n/locale'

export const ALMANAC_BRAND = '岁时纪历'
export const ALMANAC_BRAND_EN = 'Chronicle of Days'

export const SHICHEN_TIMES: Record<string, string> = {
  子: '23:00–01:00',
  丑: '01:00–03:00',
  寅: '03:00–05:00',
  卯: '05:00–07:00',
  辰: '07:00–09:00',
  巳: '09:00–11:00',
  午: '11:00–13:00',
  未: '13:00–15:00',
  申: '15:00–17:00',
  酉: '17:00–19:00',
  戌: '19:00–21:00',
  亥: '21:00–23:00',
}

export const WUXING_HINT: Record<string, string> = {
  木: '木气当令，宜生发、栽种与规划新事',
  火: '火气旺盛，宜表达、社交与开创行动',
  土: '土气厚重，宜筑基、整理与稳固根基',
  金: '金气肃杀，宜决断、交易与收敛整理',
  水: '水气流动，宜静思、祈福与内省修整',
}

export const WUXING_EN: Record<string, string> = {
  木: 'Wood',
  火: 'Fire',
  土: 'Earth',
  金: 'Metal',
  水: 'Water',
}

export const DIRECTION_EN: Record<string, string> = {
  北: 'North',
  南: 'South',
  东: 'East',
  西: 'West',
  东北: 'Northeast',
  东南: 'Southeast',
  西北: 'Northwest',
  西南: 'Southwest',
}

const ACTIVITY_EN: Record<string, string> = {
  祭祀: 'Worship', 祈福: 'Pray for blessings', 开光: 'Consecrate', 出行: 'Travel',
  解除: 'Lift restrictions', 修造: 'Build', 动土: 'Break ground', 入宅: 'Move in',
  安香: 'Install incense altar', 嫁娶: 'Marry', 纳采: 'Present betrothal gifts',
  订盟: 'Make an alliance', 安床: 'Set the bed', 开市: 'Open for business',
  交易: 'Trade', 会亲友: 'Meet friends and family', 进人口: 'Welcome new household members',
  立券: 'Sign contracts', 纳财: 'Receive wealth', 求嗣: 'Pray for children',
  伐木: 'Cut timber', 拆卸: 'Demolish', 栽种: 'Plant', 纳畜: 'Acquire livestock',
  牧养: 'Raise livestock', 开仓: 'Open storehouse', 出货财: 'Release goods or wealth',
  出火: 'Move the hearth fire', 作灶: 'Build a stove', 安葬: 'Bury',
  行丧: 'Conduct funeral rites', 修坟: 'Repair graves', 起基: 'Lay foundations',
  上梁: 'Raise beams', 安门: 'Install doors', 置产: 'Acquire property',
  破土: 'Break ground for burial', 启攒: 'Reinter remains',
}

const SHICHEN_EN: Record<string, string> = {
  子: 'Zi', 丑: 'Chou', 寅: 'Yin', 卯: 'Mao', 辰: 'Chen', 巳: 'Si',
  午: 'Wu', 未: 'Wei', 申: 'Shen', 酉: 'You', 戌: 'Xu', 亥: 'Hai',
}

export function almanacWuxingLabel(wuxing: string): string {
  return isEnglishLocale() ? WUXING_EN[wuxing] ?? wuxing : wuxing
}

export function almanacDirectionLabel(direction: string): string {
  return isEnglishLocale() ? DIRECTION_EN[direction] ?? direction : direction
}

export function almanacActivityLabel(activity: string): string {
  return isEnglishLocale() ? ACTIVITY_EN[activity] ?? activity : activity
}

export function almanacShichenLabel(shichen: string): string {
  return isEnglishLocale() ? SHICHEN_EN[shichen] ?? shichen : shichen
}

export function almanacJixiongLabel(jixiong: string): string {
  if (!isEnglishLocale()) return jixiong
  return ({ 吉: 'Auspicious', 凶: 'Inauspicious', 平: 'Neutral' }[jixiong] ?? jixiong)
}

export function formatAlmanacDate(date: Date): string {
  if (isEnglishLocale()) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[date.getDay()]
  return `${year}年${month}月${day}日 · 星期${weekday}`
}

export function getShichenAdvice(jixiong: string): string {
  if (isEnglishLocale()) {
    if (jixiong === '吉') {
      return 'The energy flows smoothly. This is a good time to advance important matters, meet, negotiate, or begin a new plan.'
    }
    if (jixiong === '凶') {
      return 'Favor stillness over action. Avoid major decisions and long trips; rest and review instead.'
    }
    return 'The energy is steady. Follow your usual rhythm without needing to seek or avoid anything in particular.'
  }
  if (jixiong === '吉') {
    return '此时段气场顺畅，适合推进重要事项、会面洽谈或开启新计划。'
  }
  if (jixiong === '凶') {
    return '此时段宜静不宜动，避免重大决策与远行，以休整、复盘为佳。'
  }
  return '此时段气场平稳，可按日常节奏行事，不必刻意趋避。'
}
