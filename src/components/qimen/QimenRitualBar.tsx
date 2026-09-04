import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '择时', en: 'Timing' },
  { num: 2, zh: '定方', en: 'Direction' },
  { num: 3, zh: '排盘', en: 'Chart' },
  { num: 4, zh: '悟机', en: 'Insight' },
] as const

export function QimenRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="奇门流程"
      ariaLabelEn="Qi Men steps"
      className="qimen-ritual"
    />
  )
}
