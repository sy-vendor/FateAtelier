import { useTx } from '../../i18n/useTx'

export function BaziRitualBar({ step }: { step: 1 | 2 | 3 | 4 }) {
  const tx = useTx()
  const steps = [
    { num: 1, zh: '录辰', en: 'Birth' },
    { num: 2, zh: '排柱', en: 'Pillars' },
    { num: 3, zh: '析行', en: 'Elements' },
    { num: 4, zh: '悟命', en: 'Destiny' },
  ] as const
  return (
    <div className="ritual-steps tools-ritual" aria-label={tx('八字流程', 'Ba Zi steps')}>
      {steps.map(({ num, zh, en }) => {
        const done = num < step
        const active = num === step
        return (
          <div key={num} className={['ritual-step', done ? 'ritual-step--done' : '', active ? 'ritual-step--active' : ''].filter(Boolean).join(' ')} aria-current={active ? 'step' : undefined}>
            <span className="ritual-step__num">{done ? '✓' : num}</span>
            <span className="ritual-step__label">{tx(zh, en)}</span>
          </div>
        )
      })}
    </div>
  )
}
