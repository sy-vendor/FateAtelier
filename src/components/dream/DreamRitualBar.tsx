import { useTx } from '../../i18n/useTx'

interface DreamRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '入梦', en: 'Dream' },
  { num: 2, zh: '述梦', en: 'Recount' },
  { num: 3, zh: '解梦', en: 'Interpret' },
  { num: 4, zh: '悟意', en: 'Insight' },
] as const

export function DreamRitualBar({ step }: DreamRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps dream-ritual" aria-label={tx('解梦流程', 'Dream interpretation steps')}>
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
