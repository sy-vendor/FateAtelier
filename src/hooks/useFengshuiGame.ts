import { useMemo, useState } from 'react'
import { FENGSHUI_PHASE_STEP, DIRECTIONS, type FengshuiPhase } from '../utils/fengshuiData'
import {
  getDirectionInterpretation,
  getTodayAuspiciousDirections,
  recommendDirectionForPurpose,
} from '../utils/fengshuiEngine'

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
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null)
  const [selectedPurpose, setSelectedPurpose] = useState('')

  const todayDirections = useMemo(() => getTodayAuspiciousDirections(), [])
  const interpretation = useMemo(
    () => (selectedDirection ? getDirectionInterpretation(selectedDirection) : null),
    [selectedDirection]
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
