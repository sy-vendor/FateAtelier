interface DreamRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '入梦' },
  { num: 2, label: '述梦' },
  { num: 3, label: '解梦' },
  { num: 4, label: '悟意' },
] as const

export function DreamRitualBar({ step }: DreamRitualBarProps) {
  return (
    <div className="ritual-steps dream-ritual" aria-label="解梦流程">
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
