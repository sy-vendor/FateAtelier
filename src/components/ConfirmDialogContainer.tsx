import { useState, useEffect } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { subscribeConfirmDialog, ConfirmOptions, ConfirmCallback } from '../utils/confirm'
import { txStatic } from '../i18n/locale'

interface ConfirmState extends ConfirmOptions {
  callback: ConfirmCallback
}

function ConfirmDialogContainer() {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeConfirmDialog((options) => {
      setConfirmState(options)
    })
    return unsubscribe
  }, [])

  const handleConfirm = () => {
    if (confirmState) {
      confirmState.callback(true)
      setConfirmState(null)
    }
  }

  const handleCancel = () => {
    if (confirmState) {
      confirmState.callback(false)
      setConfirmState(null)
    }
  }

  if (!confirmState) return null

  return (
    <ConfirmDialog
      isOpen={true}
      title={confirmState.title || txStatic('确认操作', 'Confirm action')}
      message={confirmState.message}
      confirmText={confirmState.confirmText}
      cancelText={confirmState.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      type={confirmState.type}
    />
  )
}

export default ConfirmDialogContainer
