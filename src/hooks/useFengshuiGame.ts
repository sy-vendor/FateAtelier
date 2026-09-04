import { useMemo, useState } from 'react'
import { FENGSHUI_PHASE_STEP, DIRECTIONS, type FengshuiPhase } from '../utils/fengshuiData'
import {
  getDirectionInterpretation,
  getTodayAuspiciousDirections,
  recommendDirectionForPurpose,
} from '../utils/fengshuiEngine'
import { useLocale } from '../i18n/LocaleContext'
import { localeMemoKey, withLocaleKey } from '../i18n/localeMemo'
import { trackFeatureStart } from '../utils/analytics'
import { markDailyJourneyComplete } from '../utils/dailyJourney'

export const DIRECTION_GRID: Record<string, string> = {
  西北: 'nw',
  正北: 'n',
  东北: 'ne',
  正西: 'w',
  正东: 'e',
  西南: 'sw',
  正南: 's',
  东南: 'se',
}

export function useFengshuiGame() {
  const { isEnglish } = useLocale()
  const localeKey = localeMemoKey(isEnglish)
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null)
  const [selectedPurpose, setSelectedPurpose] = useState('')

  const todayDirections = useMemo(() => getTodayAuspiciousDirections(), [])
  const interpretation = useMemo(
    () => withLocaleKey(localeKey, selectedDirection ? getDirectionInterpretation(selectedDirection) : null),
    [selectedDirection, localeKey],
  )

  const phase: FengshuiPhase = useMemo(() => {
    if (!selectedPurpose && !selectedDirection) return 'purpose'
    if (selectedDirection && interpretation) return 'insight'
    if (selectedDirection) return 'select'
    return 'rotate'
  }, [selectedPurpose, selectedDirection, interpretation])

  const ritualStep = FENGSHUI_PHASE_STEP[phase]

  const selectDirection = (directionName: string) => {
    setSelectedDirection(directionName)
    trackFeatureStart('fengshui', directionName)
    markDailyJourneyComplete('fengshui')
  }

  const resetCompass = () => {
    setSelectedDirection(null)
    setSelectedPurpose('')
  }

  const selectPurpose = (purpose: string) => {
    setSelectedPurpose(purpose)
    const recommended = recommendDirectionForPurpose(purpose)
    if (recommended.length > 0) {
      setSelectedDirection(recommended[0])
      trackFeatureStart('fengshui', purpose)
      markDailyJourneyComplete('fengshui')
    }
  }

  const getDirectionStatus = (name: string): 'auspicious' | 'inauspicious' | 'neutral' => {
    if (todayDirections.auspicious.includes(name)) return 'auspicious'
    if (todayDirections.inauspicious.includes(name)) return 'inauspicious'
    return 'neutral'
  }

  return {
    selectedDirection,
    selectedPurpose,
    todayDirections,
    interpretation,
    ritualStep,
    selectDirection,
    resetCompass,
    selectPurpose,
    getDirectionStatus,
    directions: DIRECTIONS,
  }
}
