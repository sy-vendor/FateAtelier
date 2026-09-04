import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '录辰', en: 'Birth' },
  { num: 2, zh: '排柱', en: 'Pillars' },
  { num: 3, zh: '析行', en: 'Elements' },
  { num: 4, zh: '悟命', en: 'Destiny' },
] as const

export function BaziRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="八字流程"
      ariaLabelEn="Ba Zi steps"
      className="tools-ritual"
    />
  )
}
