import { useTx } from '../../i18n/useTx'

interface CyberMeritRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '择法', en: 'Choose' },
  { num: 2, zh: '修行', en: 'Practice' },
  { num: 3, zh: '积功', en: 'Merit' },
  { num: 4, zh: '圆满', en: 'Complete' },
] as const

export function CyberMeritRitualBar({ step }: CyberMeritRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps cm-ritual" aria-label={tx('积德流程', 'Merit practice steps')}>
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
