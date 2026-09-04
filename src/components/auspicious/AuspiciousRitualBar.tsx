import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '择事', en: 'Event' },
  { num: 2, zh: '定日', en: 'Date' },
  { num: 3, zh: '推时', en: 'Times' },
  { num: 4, zh: '得吉', en: 'Auspicious' },
] as const

export function AuspiciousRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="择日流程"
      ariaLabelEn="Auspicious timing steps"
      className="picker-ritual"
    />
  )
}
