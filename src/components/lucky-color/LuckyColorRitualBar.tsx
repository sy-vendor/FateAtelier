interface LuckyColorRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '定日' },
  { num: 2, label: '赋色' },
  { num: 3, label: '感能' },
  { num: 4, label: '习用' },
] as const

export function LuckyColorRitualBar({ step }: LuckyColorRitualBarProps) {
  return (
    <div className="ritual-steps lucky-color-ritual" aria-label="幸运色流程">
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
