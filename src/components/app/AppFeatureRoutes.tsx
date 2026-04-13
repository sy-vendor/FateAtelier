import { lazy, Suspense } from 'react'
import LoadingFallback from '../LoadingFallback'
import type { AppPage } from '../../types/appPage'
import TarotMainView, { type TarotMainViewProps } from './TarotMainView'

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

export interface AppFeatureRoutesProps {
  currentPage: AppPage
  tarotProps: TarotMainViewProps
}

function AppFeatureRoutes({ currentPage, tarotProps }: AppFeatureRoutesProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {currentPage === 'name' ? (
        <NameGenerator />
      ) : currentPage === 'horoscope' ? (
        <Horoscope />
      ) : currentPage === 'almanac' ? (
        <Almanac />
      ) : currentPage === 'cybermerit' ? (
        <CyberMerit />
      ) : currentPage === 'bazi' ? (
        <BaziFortune />
      ) : currentPage === 'divination' ? (
        <DivinationDraw />
      ) : currentPage === 'dream' ? (
        <DreamInterpretation />
      ) : currentPage === 'fengshui' ? (
        <FengshuiCompass />
      ) : currentPage === 'auspicious' ? (
        <AuspiciousDate />
      ) : currentPage === 'numberenergy' ? (
        <NumberEnergy />
      ) : currentPage === 'luckycolor' ? (
        <LuckyColor />
      ) : currentPage === 'qimen' ? (
        <QimenDunjia />
      ) : currentPage === 'nametest' ? (
        <NameTest />
      ) : currentPage === 'ziwei' ? (
        <ZiweiDoushu />
      ) : currentPage === 'shengxiao' ? (
        <ShengxiaoPairing />
      ) : (
        <TarotMainView {...tarotProps} />
      )}
    </Suspense>
  )
}

export default AppFeatureRoutes
