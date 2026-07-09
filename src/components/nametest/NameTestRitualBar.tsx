export function NameTestRitualBar({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = [
    { num: 1, label: '书名' },
    { num: 2, label: '数理' },
    { num: 3, label: '三才' },
    { num: 4, label: '鉴名' },
  ] as const
  return (
    <div className="ritual-steps tools-ritual" aria-label="姓名测试流程">
      {steps.map(({ num, label }) => {
        const done = num < step
        const active = num === step
        return (
          <div key={num} className={['ritual-step', done ? 'ritual-step--done' : '', active ? 'ritual-step--active' : ''].filter(Boolean).join(' ')} aria-current={active ? 'step' : undefined}>
            <span className="ritual-step__num">{done ? '✓' : num}</span>
            <span className="ritual-step__label">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
