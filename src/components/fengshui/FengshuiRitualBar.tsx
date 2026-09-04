import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '定用', en: 'Purpose' },
  { num: 2, zh: '旋盘', en: 'Compass' },
  { num: 3, zh: '察方', en: 'Direction' },
  { num: 4, zh: '明吉', en: 'Insight' },
] as const

export function FengshuiRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="风水罗盘流程"
      ariaLabelEn="Feng shui compass steps"
      className="picker-ritual"
    />
  )
}
