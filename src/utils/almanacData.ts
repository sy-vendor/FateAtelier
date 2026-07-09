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

export function formatAlmanacDate(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[date.getDay()]
  return `${year}年${month}月${day}日 · 星期${weekday}`
}

export function getShichenAdvice(jixiong: string): string {
  if (jixiong === '吉') {
    return '此时段气场顺畅，适合推进重要事项、会面洽谈或开启新计划。'
  }
  if (jixiong === '凶') {
    return '此时段宜静不宜动，避免重大决策与远行，以休整、复盘为佳。'
  }
  return '此时段气场平稳，可按日常节奏行事，不必刻意趋避。'
}
