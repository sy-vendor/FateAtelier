import type { ReactNode } from 'react'
import { Button } from './Button'

interface CollapsibleProps {
  open: boolean
  onToggle: () => void
  label: string
  labelOpen?: string
  children: ReactNode
}

export function Collapsible({ open, onToggle, label, labelOpen, children }: CollapsibleProps) {
  return (
    <div className="collapsible">
      <Button block className="collapsible__trigger" onClick={onToggle}>
        {open ? (labelOpen ?? '收起') : label}
      </Button>
      {open && <div className="collapsible__content">{children}</div>}
    </div>
  )
}
