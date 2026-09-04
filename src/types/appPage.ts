import type { TrustPage } from '../content/trustPages'

export type FeaturePage =
  | 'tarot'
  | 'horoscope'
  | 'almanac'
  | 'cybermerit'
  | 'bazi'
  | 'divination'
  | 'dream'
  | 'fengshui'
  | 'auspicious'
  | 'numberenergy'
  | 'luckycolor'
  | 'qimen'
  | 'nametest'
  | 'ziwei'
  | 'shengxiao'

/** SPA route page — workshop home, feature tools, or trust/policy pages. */
export type AppPage = FeaturePage | 'home' | TrustPage
