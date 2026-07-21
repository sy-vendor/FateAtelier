import { useTx } from '../../i18n/useTx'

export function NameTestRitualBar({ step }: { step: 1 | 2 | 3 | 4 }) {
  const tx = useTx()
  const steps = [
    { num: 1, zh: '书名', en: 'Name' },
    { num: 2, zh: '数理', en: 'Grids' },
    { num: 3, zh: '三才', en: 'Elements' },
    { num: 4, zh: '鉴名', en: 'Read' },
  ] as const
  return (
    <div className="ritual-steps tools-ritual" aria-label={tx('姓名测试流程', 'Name analysis steps')}>
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
