import { useMemo, useState } from 'react'
import { generateAlmanac } from '../utils/almanacEngine'
import { markDailyJourneyComplete } from '../utils/dailyJourney'

export function useAlmanacGame() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(12, 0, 0, 0)
    return d
  }, [])
  const almanac = useMemo(() => generateAlmanac(today), [today])
  const [engaged, setEngaged] = useState(false)
  const [selectedShichen, setSelectedShichen] = useState<string | null>(null)

  const selectedShichenItem = useMemo(
    () => almanac.shichenJixiong.find((item) => item.shichen === selectedShichen) ?? null,
    [almanac.shichenJixiong, selectedShichen],
  )

  const ritualStep = useMemo((): 1 | 2 | 3 | 4 => {
    if (selectedShichen) return 4
    if (engaged) return 3
    return 1
  }, [selectedShichen, engaged])

  const handleShichenSelect = (shichen: string) => {
    setSelectedShichen(shichen)
    setEngaged(true)
    markDailyJourneyComplete('almanac')
  }

  const markEngaged = (value: boolean) => {
    setEngaged(value)
    if (value) markDailyJourneyComplete('almanac')
  }

  return {
    today,
    almanac,
    engaged,
    setEngaged: markEngaged,
    selectedShichen,
    selectedShichenItem,
    ritualStep,
    handleShichenSelect,
  }
}
