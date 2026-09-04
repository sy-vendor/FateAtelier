import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '入梦', en: 'Dream' },
  { num: 2, zh: '述梦', en: 'Recount' },
  { num: 3, zh: '解梦', en: 'Interpret' },
  { num: 4, zh: '悟意', en: 'Insight' },
] as const

export function DreamRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="解梦流程"
      ariaLabelEn="Dream interpretation steps"
      className="dream-ritual"
    />
  )
}
