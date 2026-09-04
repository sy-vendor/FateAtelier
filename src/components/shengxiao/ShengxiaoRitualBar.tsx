import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '选肖', en: 'Select' },
  { num: 2, zh: '合参', en: 'Pair' },
  { num: 3, zh: '测缘', en: 'Match' },
  { num: 4, zh: '悟配', en: 'Insight' },
] as const

export function ShengxiaoRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="生肖配对流程"
      ariaLabelEn="Zodiac pairing steps"
      className="tools-ritual"
    />
  )
}
