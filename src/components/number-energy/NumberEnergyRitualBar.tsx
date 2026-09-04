import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '选型', en: 'Type' },
  { num: 2, zh: '录入', en: 'Input' },
  { num: 3, zh: '析数', en: 'Analyze' },
  { num: 4, zh: '悟能', en: 'Insight' },
] as const

export function NumberEnergyRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="数字能量流程"
      ariaLabelEn="Number energy steps"
      className="picker-ritual"
    />
  )
}
