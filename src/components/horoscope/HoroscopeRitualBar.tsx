import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '选座', en: 'Choose' },
  { num: 2, zh: '定频', en: 'Timing' },
  { num: 3, zh: '观星', en: 'Reading' },
  { num: 4, zh: '万象', en: 'Insight' },
] as const

export function HoroscopeRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="观星流程"
      ariaLabelEn="Horoscope steps"
      className="horoscope-ritual"
    />
  )
}
