import { useTx } from '../../i18n/useTx'

interface AuspiciousRitualBarProps {
  step: 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, zh: '择事', en: 'Event' },
  { num: 2, zh: '定日', en: 'Date' },
  { num: 3, zh: '推时', en: 'Times' },
  { num: 4, zh: '得吉', en: 'Auspicious' },
] as const

export function AuspiciousRitualBar({ step }: AuspiciousRitualBarProps) {
  const tx = useTx()
  return (
    <div className="ritual-steps auspicious-ritual" aria-label={tx('择日流程', 'Auspicious timing steps')}>
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
