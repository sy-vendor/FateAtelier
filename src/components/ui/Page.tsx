import type { ReactNode } from 'react'

interface PageProps {
  title: string
  subtitle?: string
  eyebrow?: string
  children: ReactNode
}

export function Page({ title, subtitle, eyebrow, children }: PageProps) {
  return (
    <div className="page">
      <header className="page__header">
        {eyebrow && <p className="page__eyebrow">{eyebrow}</p>}
        <h1 className="page__title">{title}</h1>
        {subtitle && <p className="page__subtitle">{subtitle}</p>}
      </header>
      <div className="page__body">{children}</div>
    </div>
  )
}
