import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '录辰', en: 'Birth' },
  { num: 2, zh: '安星', en: 'Stars' },
  { num: 3, zh: '布宫', en: 'Palaces' },
  { num: 4, zh: '悟命', en: 'Destiny' },
] as const

export function ZiweiRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="紫微流程"
      ariaLabelEn="Zi Wei steps"
      className="tools-ritual"
    />
  )
}
