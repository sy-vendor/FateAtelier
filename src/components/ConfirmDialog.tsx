import { useEffect } from 'react'
import { useTx } from '../i18n/useTx'
import './ConfirmDialog.css'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = 'info'
}: ConfirmDialogProps) {
  const tx = useTx()
  const resolvedConfirmText = confirmText ?? tx('确认', 'Confirm')
  const resolvedCancelText = cancelText ?? tx('取消', 'Cancel')

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.target === document.body) {
        onConfirm()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleEnter)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleEnter)
      document.body.style.overflow = ''
    }
  }, [isOpen, onConfirm, onCancel])

  if (!isOpen) return null

  return (
    <div 
      className="confirm-dialog-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div 
        className={`confirm-dialog ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-header">
          <h3 id="confirm-dialog-title" className="confirm-dialog-title">
            {type === 'danger' && '⚠️ '}
            {type === 'warning' && '⚠️ '}
            {type === 'info' && 'ℹ️ '}
            {title}
          </h3>
        </div>
        <div className="confirm-dialog-body">
          <p id="confirm-dialog-message" className="confirm-dialog-message">
            {message}
          </p>
        </div>
        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-button confirm-dialog-button-cancel"
            onClick={onCancel}
            aria-label={tx('取消操作', 'Cancel action')}
          >
            {resolvedCancelText}
          </button>
          <button
            className={`confirm-dialog-button confirm-dialog-button-confirm ${type}`}
            onClick={onConfirm}
            autoFocus
            aria-label={tx('确认操作', 'Confirm action')}
          >
            {resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
