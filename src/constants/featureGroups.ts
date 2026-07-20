import type { AppPage } from '../types/appPage'

export interface FeatureGroup {
  id: string
  label: string
  labelEn: string
  pages: AppPage[]
}

/** 功能分组导航 */
export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'daily',
    label: '每日灵感', labelEn: 'Daily Inspiration',
    pages: ['horoscope', 'almanac', 'luckycolor'],
  },
  {
    id: 'divine',
    label: '占卜问事', labelEn: 'Divination',
    pages: ['tarot', 'divination', 'dream', 'qimen'],
  },
  {
    id: 'fortune',
    label: '命理测算', labelEn: 'Destiny',
    pages: ['bazi', 'ziwei', 'nametest', 'shengxiao'],
  },
  {
    id: 'tools',
    label: '择吉工具', labelEn: 'Practical Tools',
    pages: ['auspicious', 'numberenergy', 'fengshui'],
  },
  {
    id: 'play',
    label: '趣味修行', labelEn: 'Mindful Play',
    pages: ['cybermerit'],
  },
]

/** 移动端底部快捷入口 */
export const DOCK_PAGES: AppPage[] = [
  'tarot',
  'horoscope',
  'divination',
  'almanac',
  'cybermerit',
]
