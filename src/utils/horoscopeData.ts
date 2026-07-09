export const HOROSCOPE_BRAND = '星轨观测站'
export const HOROSCOPE_BRAND_EN = 'Stellar Orbit'

export type ZodiacElement = '火' | '土' | '风' | '水'
export type HoroscopePeriod = 'today' | 'week' | 'month'

export interface ZodiacSign {
  id: string
  name: string
  symbol: string
  element: ZodiacElement
  dates: string
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', name: '白羊座', symbol: '♈', element: '火', dates: '3.21 – 4.19' },
  { id: 'taurus', name: '金牛座', symbol: '♉', element: '土', dates: '4.20 – 5.20' },
  { id: 'gemini', name: '双子座', symbol: '♊', element: '风', dates: '5.21 – 6.21' },
  { id: 'cancer', name: '巨蟹座', symbol: '♋', element: '水', dates: '6.22 – 7.22' },
  { id: 'leo', name: '狮子座', symbol: '♌', element: '火', dates: '7.23 – 8.22' },
  { id: 'virgo', name: '处女座', symbol: '♍', element: '土', dates: '8.23 – 9.22' },
  { id: 'libra', name: '天秤座', symbol: '♎', element: '风', dates: '9.23 – 10.23' },
  { id: 'scorpio', name: '天蝎座', symbol: '♏', element: '水', dates: '10.24 – 11.22' },
  { id: 'sagittarius', name: '射手座', symbol: '♐', element: '火', dates: '11.23 – 12.21' },
  { id: 'capricorn', name: '摩羯座', symbol: '♑', element: '土', dates: '12.22 – 1.19' },
  { id: 'aquarius', name: '水瓶座', symbol: '♒', element: '风', dates: '1.20 – 2.18' },
  { id: 'pisces', name: '双鱼座', symbol: '♓', element: '水', dates: '2.19 – 3.20' },
]

export const ELEMENT_LABEL: Record<ZodiacElement, string> = {
  火: '火象星座',
  土: '土象星座',
  风: '风象星座',
  水: '水象星座',
}

export const ELEMENT_PEERS: Record<ZodiacElement, string> = {
  火: '白羊座 · 狮子座 · 射手座',
  土: '金牛座 · 处女座 · 摩羯座',
  风: '双子座 · 天秤座 · 水瓶座',
  水: '巨蟹座 · 天蝎座 · 双鱼座',
}

export const PERIOD_OPTIONS: { value: HoroscopePeriod; label: string }[] = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
]
