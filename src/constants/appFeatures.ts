import type { AppPage } from '../types/appPage'

export interface AppFeature {
  page: AppPage
  icon: string
  name: string
}

export const APP_FEATURES: AppFeature[] = [
  { page: 'tarot', icon: '🔮', name: '塔罗占卜' },
  { page: 'name', icon: '✨', name: '智能取名' },
  { page: 'horoscope', icon: '♈', name: '星座运势' },
  { page: 'almanac', icon: '📅', name: '今日黄历' },
  { page: 'cybermerit', icon: '🙏', name: '赛博积德' },
  { page: 'bazi', icon: '☯', name: '八字算命' },
  { page: 'divination', icon: '🎋', name: '抽签求签' },
  { page: 'dream', icon: '💭', name: '梦境解析' },
  { page: 'fengshui', icon: '🧭', name: '风水罗盘' },
  { page: 'auspicious', icon: '⏰', name: '择日吉时' },
  { page: 'numberenergy', icon: '🔢', name: '数字能量' },
  { page: 'luckycolor', icon: '🎨', name: '每日幸运色' },
  { page: 'qimen', icon: '⚡', name: '奇门遁甲' },
  { page: 'nametest', icon: '📝', name: '姓名测试' },
  { page: 'ziwei', icon: '⭐', name: '紫微斗数' },
  { page: 'shengxiao', icon: '🐲', name: '生肖配对' },
]
