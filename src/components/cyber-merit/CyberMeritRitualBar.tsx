interface CyberMeritRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '择法' },
  { num: 2, label: '修行' },
  { num: 3, label: '积功' },
  { num: 4, label: '圆满' },
] as const

export function CyberMeritRitualBar({ step }: CyberMeritRitualBarProps) {
  return (
    <div className="ritual-steps cm-ritual" aria-label="积德流程">
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
