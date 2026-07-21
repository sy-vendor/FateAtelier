import { useCallback, useEffect, useRef, useState } from 'react'
import { SHENGXIAO_LIST, SHENGXIAO_PHASE_STEP, shengxiaoLabel, type ShengxiaoPhase } from '../utils/shengxiaoData'
import { analyzePairing, type ShengxiaoPairingResult } from '../utils/shengxiaoEngine'
import { isEnglishLocale, txStatic } from '../i18n/locale'
import { useLocale } from '../i18n/LocaleContext'

export function useShengxiaoGame() {
  const { isEnglish } = useLocale()
  const [shengxiao1, setShengxiao1] = useState('')
  const [shengxiao2, setShengxiao2] = useState('')
  const [phase, setPhase] = useState<ShengxiaoPhase>('idle')
  const [inputError, setInputError] = useState('')
  const [result, setResult] = useState<ShengxiaoPairingResult | null>(null)
  const insightRef = useRef<HTMLDivElement>(null)

  const ritualStep = SHENGXIAO_PHASE_STEP[phase]

  const scrollToInsight = useCallback(() => {
    requestAnimationFrame(() => {
      insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const selectFirst = useCallback((sx: string) => {
    setShengxiao1(sx)
    setInputError('')
    setPhase(sx ? 'pick' : 'idle')
  }, [])

  const selectSecond = useCallback((sx: string) => {
    setShengxiao2(sx)
    setInputError('')
    if (sx) setPhase('bond')
  }, [])

  const handlePairing = useCallback(() => {
    if (!shengxiao1 || !shengxiao2) {
      setInputError(txStatic('请选择两个生肖', 'Please select two zodiac signs'))
      return
    }

    setInputError('')
    const pairingResult = analyzePairing(shengxiao1, shengxiao2)
    if (!pairingResult) {
      setInputError(txStatic('生肖选择无效', 'The zodiac selection is invalid'))
      return
    }

    setResult(pairingResult)
    setPhase('insight')
    window.setTimeout(scrollToInsight, 80)
  }, [shengxiao1, shengxiao2, scrollToInsight])

  useEffect(() => {
    if (shengxiao1 && shengxiao2) {
      setResult((previous) => previous ? analyzePairing(shengxiao1, shengxiao2) : previous)
    }
  }, [isEnglish, shengxiao1, shengxiao2]) // The engine formats analysis according to the active locale.

  const shengxiaoChips = SHENGXIAO_LIST.map((sx) => ({
    id: sx,
    label: shengxiaoLabel(sx, isEnglishLocale()),
  }))

  return {
    shengxiao1,
    shengxiao2,
    selectFirst,
    selectSecond,
    phase,
    ritualStep,
    inputError,
    result,
    insightRef,
    handlePairing,
    shengxiaoChips,
  }
}
