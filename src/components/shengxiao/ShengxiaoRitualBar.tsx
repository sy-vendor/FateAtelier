import { useTx } from '../../i18n/useTx'

export function ShengxiaoRitualBar({ step }: { step: 1 | 2 | 3 | 4 }) {
  const tx = useTx()
  const steps = [
    { num: 1, zh: '选肖', en: 'Select' },
    { num: 2, zh: '合参', en: 'Pair' },
    { num: 3, zh: '测缘', en: 'Match' },
    { num: 4, zh: '悟配', en: 'Insight' },
  ] as const
  return (
    <div className="ritual-steps tools-ritual" aria-label={tx('生肖配对流程', 'Zodiac pairing steps')}>
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
