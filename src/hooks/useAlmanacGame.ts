import { useMemo, useState } from 'react'
import { generateAlmanac } from '../utils/almanacEngine'

export function useAlmanacGame() {
  const today = new Date()
  const almanac = useMemo(() => generateAlmanac(today), [])
  const [engaged, setEngaged] = useState(false)
  const [selectedShichen, setSelectedShichen] = useState<string | null>(null)

  const selectedShichenItem = useMemo(
    () => almanac.shichenJixiong.find((item) => item.shichen === selectedShichen) ?? null,
    [almanac.shichenJixiong, selectedShichen],
  )

  const ritualStep = useMemo((): 1 | 2 | 3 | 4 => {
    if (selectedShichen) return 4
    if (engaged) return 3
    return 2
  }, [selectedShichen, engaged])

  const handleShichenSelect = (shichen: string) => {
    setSelectedShichen(shichen)
    setEngaged(true)
  }

  return {
    today,
    almanac,
    engaged,
    setEngaged,
    selectedShichen,
    selectedShichenItem,
    ritualStep,
    handleShichenSelect,
  }
}
