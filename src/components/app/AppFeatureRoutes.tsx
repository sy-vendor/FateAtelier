import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import LoadingFallback from '../LoadingFallback'
import type { AppPage } from '../../types/appPage'
import type { TarotGameApi } from '../../types/tarotGameApi'

const TarotMainView = lazy(() => import('./TarotMainView'))
const NameGenerator = lazy(() => import('../NameGenerator'))
const HoroscopeMainView = lazy(() => import('./HoroscopeMainView'))
const AlmanacMainView = lazy(() => import('./AlmanacMainView'))
const CyberMeritMainView = lazy(() => import('./CyberMeritMainView'))
const BaziMainView = lazy(() => import('./BaziMainView'))
const DivinationMainView = lazy(() => import('./DivinationMainView'))
const DreamMainView = lazy(() => import('./DreamMainView'))
const FengshuiMainView = lazy(() => import('./FengshuiMainView'))
const AuspiciousMainView = lazy(() => import('./AuspiciousMainView'))
const NumberEnergyMainView = lazy(() => import('./NumberEnergyMainView'))
const LuckyColorMainView = lazy(() => import('./LuckyColorMainView'))
const QimenMainView = lazy(() => import('./QimenMainView'))
const NameTestMainView = lazy(() => import('./NameTestMainView'))
const ZiweiMainView = lazy(() => import('./ZiweiMainView'))
const ShengxiaoMainView = lazy(() => import('./ShengxiaoMainView'))

type NonTarotPage = Exclude<AppPage, 'tarot'>
type LazyFeature = LazyExoticComponent<ComponentType>

const LAZY_BY_PAGE: Record<NonTarotPage, LazyFeature> = {
  name: NameGenerator,
  horoscope: HoroscopeMainView,
  almanac: AlmanacMainView,
  cybermerit: CyberMeritMainView,
  bazi: BaziMainView,
  divination: DivinationMainView,
  dream: DreamMainView,
  fengshui: FengshuiMainView,
  auspicious: AuspiciousMainView,
  numberenergy: NumberEnergyMainView,
  luckycolor: LuckyColorMainView,
  qimen: QimenMainView,
  nametest: NameTestMainView,
  ziwei: ZiweiMainView,
  shengxiao: ShengxiaoMainView,
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
