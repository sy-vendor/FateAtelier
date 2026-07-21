import { useTx } from '../../i18n/useTx'

interface AlmanacRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '晨起', en: 'Rise' },
  { num: 2, zh: '察历', en: 'Calendar' },
  { num: 3, zh: '辨宜忌', en: 'Favorable' },
  { num: 4, zh: '择吉时', en: 'Timing' },
] as const

export function AlmanacRitualBar({ step }: AlmanacRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps almanac-ritual" aria-label={tx('察历流程', 'Almanac steps')}>
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
