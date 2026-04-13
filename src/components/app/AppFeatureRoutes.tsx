import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import LoadingFallback from '../LoadingFallback'
import type { AppPage } from '../../types/appPage'
import type { TarotGameApi } from '../../types/tarotGameApi'

const TarotMainView = lazy(() => import('./TarotMainView'))
const NameGenerator = lazy(() => import('../NameGenerator'))
const Horoscope = lazy(() => import('../Horoscope'))
const Almanac = lazy(() => import('../Almanac'))
const CyberMerit = lazy(() => import('../CyberMerit'))
const BaziFortune = lazy(() => import('../BaziFortune'))
const DivinationDraw = lazy(() => import('../DivinationDraw'))
const DreamInterpretation = lazy(() => import('../DreamInterpretation'))
const FengshuiCompass = lazy(() => import('../FengshuiCompass'))
const AuspiciousDate = lazy(() => import('../AuspiciousDate'))
const NumberEnergy = lazy(() => import('../NumberEnergy'))
const LuckyColor = lazy(() => import('../LuckyColor'))
const QimenDunjia = lazy(() => import('../QimenDunjia'))
const NameTest = lazy(() => import('../NameTest'))
const ZiweiDoushu = lazy(() => import('../ZiweiDoushu'))
const ShengxiaoPairing = lazy(() => import('../ShengxiaoPairing'))

type NonTarotPage = Exclude<AppPage, 'tarot'>
type LazyFeature = LazyExoticComponent<ComponentType>

const LAZY_BY_PAGE: Record<NonTarotPage, LazyFeature> = {
  name: NameGenerator,
  horoscope: Horoscope,
  almanac: Almanac,
  cybermerit: CyberMerit,
  bazi: BaziFortune,
  divination: DivinationDraw,
  dream: DreamInterpretation,
  fengshui: FengshuiCompass,
  auspicious: AuspiciousDate,
  numberenergy: NumberEnergy,
  luckycolor: LuckyColor,
  qimen: QimenDunjia,
  nametest: NameTest,
  ziwei: ZiweiDoushu,
  shengxiao: ShengxiaoPairing,
}

export interface AppFeatureRoutesProps {
  currentPage: AppPage
  tarot: TarotGameApi
}

function FeatureSwitch({ currentPage, tarot }: AppFeatureRoutesProps) {
  if (currentPage === 'tarot') {
    return <TarotMainView {...tarot} />
  }
  const Feature = LAZY_BY_PAGE[currentPage]
  return <Feature />
}

function AppFeatureRoutes(props: AppFeatureRoutesProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FeatureSwitch {...props} />
    </Suspense>
  )
}

export default AppFeatureRoutes
