import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import LoadingFallback from '../LoadingFallback'
import type { AppPage, FeaturePage } from '../../types/appPage'
import HomeMainView from './HomeMainView'
import TrustMainView from './TrustMainView'
import { isTrustPage } from '../../content/trustPages'

const TarotFeatureRoute = lazy(() => import('./TarotFeatureRoute'))
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

type LazyFeature = LazyExoticComponent<ComponentType>

const LAZY_BY_PAGE: Record<FeaturePage, LazyFeature> = {
  tarot: TarotFeatureRoute,
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
  onNavigate: (page: AppPage) => void
}

function FeatureSwitch({ currentPage, onNavigate }: AppFeatureRoutesProps) {
  if (currentPage === 'home') {
    return <HomeMainView onNavigate={onNavigate} />
  }
  if (isTrustPage(currentPage)) {
    return <TrustMainView page={currentPage} onNavigate={onNavigate} />
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
