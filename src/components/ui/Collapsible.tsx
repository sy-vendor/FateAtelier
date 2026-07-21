import type { ReactNode } from 'react'
import { Button } from './Button'
import { useTx } from '../../i18n/useTx'

interface CollapsibleProps {
  open: boolean
  onToggle: () => void
  label: string
  labelOpen?: string
  children: ReactNode
}

export function Collapsible({ open, onToggle, label, labelOpen, children }: CollapsibleProps) {
  const tx = useTx()
  return (
    <div className="collapsible">
      <Button block className="collapsible__trigger" onClick={onToggle}>
        {open ? (labelOpen ?? tx('收起', 'Collapse')) : label}
      </Button>
      {open && <div className="collapsible__content">{children}</div>}
    </div>
  )
}
