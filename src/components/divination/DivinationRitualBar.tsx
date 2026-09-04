import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '默念', en: 'Focus' },
  { num: 2, zh: '摇签', en: 'Shake' },
  { num: 3, zh: '揭签', en: 'Reveal' },
  { num: 4, zh: '悟签', en: 'Reflect' },
] as const

export function DivinationRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="求签流程"
      ariaLabelEn="Oracle draw steps"
      className="divination-ritual"
    />
  )
}
