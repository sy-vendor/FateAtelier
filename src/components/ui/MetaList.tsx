interface MetaRow {
  key: string
  value: string
}

interface MetaListProps {
  rows: MetaRow[]
}

export function MetaList({ rows }: MetaListProps) {
  return (
    <dl className="meta-list">
      {rows.map((row) => (
        <div key={row.key} className="meta-list__row">
          <dt className="meta-list__key">{row.key}</dt>
          <dd className="meta-list__val">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
