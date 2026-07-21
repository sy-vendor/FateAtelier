import { Component, ErrorInfo, ReactNode } from 'react'
import { logger } from '../utils/logger'
import { toast } from '../utils/toast'
import { txStatic } from '../i18n/locale'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
    
    // 显示用户友好的错误提示
    toast.error(txStatic('应用出现错误，请刷新页面重试', 'Something went wrong. Please refresh and try again.'))
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    // 刷新页面
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">{txStatic('出错了', 'Something went wrong')}</h1>
            <p className="error-message">
              {txStatic('应用遇到了一个错误，我们正在努力修复。', 'The app hit an unexpected error. We are working on a fix.')}
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>{txStatic('错误详情（仅开发环境）', 'Error details (development only)')}</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="error-actions">
              <button
                className="error-button error-button-primary"
                onClick={this.handleReset}
                aria-label={txStatic('刷新页面', 'Refresh page')}
              >
                🔄 {txStatic('刷新页面', 'Refresh')}
              </button>
              <button
                className="error-button error-button-secondary"
                onClick={() => window.history.back()}
                aria-label={txStatic('返回上一页', 'Go back')}
              >
                ← {txStatic('返回', 'Back')}
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

