interface FengshuiRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: '定用' },
  { num: 2, label: '旋盘' },
  { num: 3, label: '察方' },
  { num: 4, label: '明吉' },
] as const

export function FengshuiRitualBar({ step }: FengshuiRitualBarProps) {
  return (
    <div className="ritual-steps fengshui-ritual" aria-label="风水罗盘流程">
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
