interface DivinationRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '默念' },
  { num: 2, label: '摇签' },
  { num: 3, label: '揭签' },
  { num: 4, label: '悟签' },
] as const

export function DivinationRitualBar({ step }: DivinationRitualBarProps) {
  return (
    <div className="ritual-steps divination-ritual" aria-label="求签流程">
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
