interface AlmanacRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '晨起' },
  { num: 2, label: '察历' },
  { num: 3, label: '辨宜忌' },
  { num: 4, label: '择吉时' },
] as const

export function AlmanacRitualBar({ step }: AlmanacRitualBarProps) {
  return (
    <div className="ritual-steps almanac-ritual" aria-label="察历流程">
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
