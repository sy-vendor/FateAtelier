import type { FeaturePage } from '../types/appPage'

export interface IntentOption {
  id: string
  zh: string
  en: string
  hintZh: string
  hintEn: string
  pages: FeaturePage[]
}

/** Intent → complementary tools (home recommendation chips). */
export const INTENT_OPTIONS: IntentOption[] = [
  {
    id: 'today',
    zh: '看看今天',
    en: 'What about today?',
    hintZh: '运势、黄历与幸运色',
    hintEn: 'Horoscope, almanac, lucky color',
    pages: ['horoscope', 'almanac', 'luckycolor'],
  },
  {
    id: 'ask',
    zh: '我有一个问题',
    en: 'I have a question',
    hintZh: '塔罗、抽签或解梦',
    hintEn: 'Tarot, fortune sticks, or dreams',
    pages: ['tarot', 'divination', 'dream'],
  },
  {
    id: 'chart',
    zh: '想排个命盘',
    en: 'I want a chart',
    hintZh: '八字、紫微或奇门',
    hintEn: 'Ba Zi, Zi Wei, or Qi Men',
    pages: ['bazi', 'ziwei', 'qimen'],
  },
  {
    id: 'people',
    zh: '关于关系',
    en: 'About a relationship',
    hintZh: '生肖配对与姓名趣味',
    hintEn: 'Zodiac pairing and name reading',
    pages: ['shengxiao', 'nametest', 'tarot'],
  },
  {
    id: 'calm',
    zh: '想放松一下',
    en: 'I need a pause',
    hintZh: '赛博积德与轻量仪式',
    hintEn: 'Cyber merit and light rituals',
    pages: ['cybermerit', 'luckycolor', 'dream'],
  },
  {
    id: 'timing',
    zh: '选日子 / 方位',
    en: 'Dates & directions',
    hintZh: '择日、风水与数字能量',
    hintEn: 'Auspicious dates, feng shui, numbers',
    pages: ['auspicious', 'fengshui', 'numberenergy'],
  },
]
