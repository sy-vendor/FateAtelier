import { useTx } from '../../i18n/useTx'

interface NumberEnergyRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '选型', en: 'Type' },
  { num: 2, zh: '录入', en: 'Input' },
  { num: 3, zh: '析数', en: 'Analyze' },
  { num: 4, zh: '悟能', en: 'Insight' },
] as const

export function NumberEnergyRitualBar({ step }: NumberEnergyRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps number-energy-ritual" aria-label={tx('数字能量流程', 'Number energy steps')}>
      {STEPS.map(({ num, zh, en }) => {
        const done = num < step
        const active = num === step
        const cls = [
          'ritual-step',
          done ? 'ritual-step--done' : '',
          active ? 'ritual-step--active' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div key={num} className={cls} aria-current={active ? 'step' : undefined}>
            <span className="ritual-step__num">{done ? '✓' : num}</span>
            <span className="ritual-step__label">{tx(zh, en)}</span>
          </div>
        )
      })}
    </div>
  )
}
