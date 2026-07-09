interface MetricProps {
  value: string | number
  label: string
}

export function Metric({ value, label }: MetricProps) {
  return (
    <div className="metric">
      <div className="metric__value">{value}</div>
      <div className="metric__label">{label}</div>
    </div>
  )
}
