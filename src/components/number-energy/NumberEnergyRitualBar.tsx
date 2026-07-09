interface NumberEnergyRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '选型' },
  { num: 2, label: '录入' },
  { num: 3, label: '析数' },
  { num: 4, label: '悟能' },
] as const

export function NumberEnergyRitualBar({ step }: NumberEnergyRitualBarProps) {
  return (
    <div className="ritual-steps number-energy-ritual" aria-label="数字能量流程">
      {STEPS.map(({ num, label }) => {
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
            <span className="ritual-step__label">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
