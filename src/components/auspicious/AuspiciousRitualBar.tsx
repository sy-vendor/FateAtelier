interface AuspiciousRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '择事' },
  { num: 2, label: '定日' },
  { num: 3, label: '推时' },
  { num: 4, label: '得吉' },
] as const

export function AuspiciousRitualBar({ step }: AuspiciousRitualBarProps) {
  return (
    <div className="ritual-steps auspicious-ritual" aria-label="择日流程">
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
