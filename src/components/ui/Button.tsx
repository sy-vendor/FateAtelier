import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  block?: boolean
  small?: boolean
  children: ReactNode
}

export function Button({
  variant = 'ghost',
  block,
  small,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    variant === 'primary' ? 'btn--primary' : 'btn--ghost',
    block ? 'btn--block' : '',
    small ? 'btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
