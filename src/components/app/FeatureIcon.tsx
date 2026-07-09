import { APP_FEATURES } from '../../constants/appFeatures'
import type { AppPage } from '../../types/appPage'
import { TarotLogoMark } from '../tarot/TarotLogoMark'
import { HoroscopeLogoMark } from '../horoscope/HoroscopeLogoMark'
import { AlmanacLogoMark } from '../almanac/AlmanacLogoMark'
import { LuckyColorLogoMark } from '../lucky-color/LuckyColorLogoMark'
import { DivinationLogoMark } from '../divination/DivinationLogoMark'
import { DreamLogoMark } from '../dream/DreamLogoMark'
import { QimenLogoMark } from '../qimen/QimenLogoMark'
import { BaziLogoMark } from '../bazi/BaziLogoMark'
import { ZiweiLogoMark } from '../ziwei/ZiweiLogoMark'
import { NameTestLogoMark } from '../nametest/NameTestLogoMark'
import { ShengxiaoLogoMark } from '../shengxiao/ShengxiaoLogoMark'
import { AuspiciousLogoMark } from '../auspicious/AuspiciousLogoMark'
import { NumberEnergyLogoMark } from '../number-energy/NumberEnergyLogoMark'
import { FengshuiLogoMark } from '../fengshui/FengshuiLogoMark'
import { CyberMeritLogoMark } from '../cyber-merit/CyberMeritLogoMark'

interface FeatureIconProps {
  page: AppPage
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FeatureIcon({ page, size = 'md', className = '' }: FeatureIconProps) {
  if (page === 'tarot') {
    return <TarotLogoMark size={size} className={className} />
  }

  if (page === 'horoscope') {
    return <HoroscopeLogoMark size={size} className={className} />
  }

  if (page === 'almanac') {
    return <AlmanacLogoMark size={size} className={className} />
  }

  if (page === 'luckycolor') {
    return <LuckyColorLogoMark size={size} className={className} />
  }

  if (page === 'divination') {
    return <DivinationLogoMark size={size} className={className} />
  }

  if (page === 'dream') {
    return <DreamLogoMark size={size} className={className} />
  }

  if (page === 'qimen') {
    return <QimenLogoMark size={size} className={className} />
  }

  if (page === 'bazi') {
    return <BaziLogoMark size={size} className={className} />
  }

  if (page === 'ziwei') {
    return <ZiweiLogoMark size={size} className={className} />
  }

  if (page === 'nametest') {
    return <NameTestLogoMark size={size} className={className} />
  }

  if (page === 'shengxiao') {
    return <ShengxiaoLogoMark size={size} className={className} />
  }

  if (page === 'auspicious') {
    return <AuspiciousLogoMark size={size} className={className} />
  }

  if (page === 'numberenergy') {
    return <NumberEnergyLogoMark size={size} className={className} />
  }

  if (page === 'fengshui') {
    return <FengshuiLogoMark size={size} className={className} />
  }

  if (page === 'cybermerit') {
    return <CyberMeritLogoMark size={size} className={className} />
  }

  const feature = APP_FEATURES.find((f) => f.page === page)
  return (
    <span className={className} aria-hidden>
      {feature?.icon}
    </span>
  )
}
