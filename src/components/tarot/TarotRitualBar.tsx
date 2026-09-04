import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '静心', en: 'Center' },
  { num: 2, zh: '选阵', en: 'Choose' },
  { num: 3, zh: '抽牌', en: 'Draw' },
  { num: 4, zh: '解读', en: 'Read' },
] as const

export function TarotRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="占卜流程"
      ariaLabelEn="Reading flow"
      className="tarot-ritual"
    />
  )
}
