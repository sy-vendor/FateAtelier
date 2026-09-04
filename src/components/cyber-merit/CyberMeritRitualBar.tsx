import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '择法', en: 'Choose' },
  { num: 2, zh: '修行', en: 'Practice' },
  { num: 3, zh: '积功', en: 'Merit' },
  { num: 4, zh: '圆满', en: 'Complete' },
] as const

export function CyberMeritRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="积德流程"
      ariaLabelEn="Merit practice steps"
      className="cm-ritual"
    />
  )
}
