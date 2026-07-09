import { useCallback, useRef, useState } from 'react'
import { NAME_TEST_PHASE_STEP, type NameTestPhase } from '../utils/nameTestData'
import { computeNameTest, type NameTestResult } from '../utils/nameTestEngine'

export function useNameTestGame() {
  const [surname, setSurname] = useState('')
  const [givenName, setGivenName] = useState('')
  const [phase, setPhase] = useState<NameTestPhase>('idle')
  const [inputError, setInputError] = useState('')
  const [result, setResult] = useState<NameTestResult | null>(null)
  const insightRef = useRef<HTMLDivElement>(null)

  const ritualStep = NAME_TEST_PHASE_STEP[phase]

  const scrollToInsight = useCallback(() => {
    requestAnimationFrame(() => {
      insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const testName = useCallback(() => {
    const s = surname.trim()
    const g = givenName.trim()
    if (!s || !g) {
      setInputError('请输入完整的姓名（姓氏和名字）')
      return
    }

    setInputError('')
    setPhase('scored')
    const r = computeNameTest(s, g)
    setResult(r)
    setPhase('insight')
    window.setTimeout(scrollToInsight, 80)
  }, [surname, givenName, scrollToInsight])

  const onSurnameChange = (v: string) => {
    setSurname(v)
    if (inputError) setInputError('')
    if (v.trim() && givenName.trim()) setPhase('named')
    else if (phase !== 'insight') setPhase(v.trim() ? 'named' : 'idle')
  }

  const onGivenNameChange = (v: string) => {
    setGivenName(v)
    if (inputError) setInputError('')
    if (surname.trim() && v.trim()) setPhase('named')
    else if (phase !== 'insight') setPhase(v.trim() ? 'named' : 'idle')
  }

  return {
    surname,
    givenName,
    onSurnameChange,
    onGivenNameChange,
    phase,
    ritualStep,
    inputError,
    result,
    insightRef,
    testName,
  }
}
