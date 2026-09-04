import { RitualBar, type RitualStepIndex } from '../ui'

const STEPS = [
  { num: 1, zh: '书名', en: 'Name' },
  { num: 2, zh: '数理', en: 'Grids' },
  { num: 3, zh: '三才', en: 'Elements' },
  { num: 4, zh: '鉴名', en: 'Read' },
] as const

export function NameTestRitualBar({ step }: { step: RitualStepIndex }) {
  return (
    <RitualBar
      step={step}
      steps={STEPS}
      ariaLabelZh="姓名测试流程"
      ariaLabelEn="Name analysis steps"
      className="tools-ritual"
    />
  )
}
