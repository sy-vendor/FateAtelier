import type { ReactNode } from 'react'

interface PanelProps {
  title?: string
  description?: string
  children: ReactNode
  flush?: boolean
}

export function Panel({ title, description, children, flush }: PanelProps) {
  return (
    <section className={`panel${flush ? ' panel--flush' : ''}`}>
      {(title || description) && (
        <div className="panel__head">
          {title && <h2 className="panel__title">{title}</h2>}
          {description && <p className="panel__desc">{description}</p>}
        </div>
      )}
      <div className="panel__body">{children}</div>
    </section>
  )
}
