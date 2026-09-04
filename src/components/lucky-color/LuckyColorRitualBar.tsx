import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '定日', en: 'Date' },
  { num: 2, zh: '赋色', en: 'Color' },
  { num: 3, zh: '感能', en: 'Energy' },
  { num: 4, zh: '习用', en: 'Apply' },
] as const

export function LuckyColorRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="幸运色流程"
      ariaLabelEn="Lucky color steps"
      className="lucky-color-ritual"
    />
  )
}
