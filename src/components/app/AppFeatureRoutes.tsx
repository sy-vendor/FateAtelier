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
  onBackToTarot: () => void
  tarotProps: TarotMainViewProps
}

function AppFeatureRoutes({ currentPage, onBackToTarot, tarotProps }: AppFeatureRoutesProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {currentPage === 'name' ? (
        <NameGenerator onBack={onBackToTarot} />
      ) : currentPage === 'horoscope' ? (
        <Horoscope onBack={onBackToTarot} />
      ) : currentPage === 'almanac' ? (
        <Almanac onBack={onBackToTarot} />
      ) : currentPage === 'cybermerit' ? (
        <CyberMerit onBack={onBackToTarot} />
      ) : currentPage === 'bazi' ? (
        <BaziFortune onBack={onBackToTarot} />
      ) : currentPage === 'divination' ? (
        <DivinationDraw onBack={onBackToTarot} />
      ) : currentPage === 'dream' ? (
        <DreamInterpretation onBack={onBackToTarot} />
      ) : currentPage === 'fengshui' ? (
        <FengshuiCompass onBack={onBackToTarot} />
      ) : currentPage === 'auspicious' ? (
        <AuspiciousDate onBack={onBackToTarot} />
      ) : currentPage === 'numberenergy' ? (
        <NumberEnergy onBack={onBackToTarot} />
      ) : currentPage === 'luckycolor' ? (
        <LuckyColor onBack={onBackToTarot} />
      ) : currentPage === 'qimen' ? (
        <QimenDunjia onBack={onBackToTarot} />
      ) : currentPage === 'nametest' ? (
        <NameTest onBack={onBackToTarot} />
      ) : currentPage === 'ziwei' ? (
        <ZiweiDoushu onBack={onBackToTarot} />
      ) : currentPage === 'shengxiao' ? (
        <ShengxiaoPairing onBack={onBackToTarot} />
      ) : (
        <TarotMainView {...tarotProps} />
      )}
    </Suspense>
  )
}

export default AppFeatureRoutes
