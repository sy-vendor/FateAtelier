import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '晨起', en: 'Rise' },
  { num: 2, zh: '察历', en: 'Calendar' },
  { num: 3, zh: '辨宜忌', en: 'Favorable' },
  { num: 4, zh: '择吉时', en: 'Timing' },
] as const

export function AlmanacRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="察历流程"
      ariaLabelEn="Almanac steps"
      className="almanac-ritual"
    />
  )
}
