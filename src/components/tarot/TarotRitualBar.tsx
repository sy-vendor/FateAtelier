interface TarotRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '静心' },
  { num: 2, label: '选阵' },
  { num: 3, label: '抽牌' },
  { num: 4, label: '解读' },
] as const

export function TarotRitualBar({ step }: TarotRitualBarProps) {
  return (
    <div className="ritual-steps tarot-ritual" aria-label="占卜流程">
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
