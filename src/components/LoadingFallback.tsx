import { useTx } from '../i18n/useTx'
import './LoadingFallback.css'

function LoadingFallback() {
  const tx = useTx()
  return (
    <div className="route-loading-fallback" role="status" aria-live="polite" aria-label={tx('加载中', 'Loading')}>
      <div className="route-loading-fallback-inner">
        <span className="route-loading-fallback-spinner" aria-hidden="true" />
        <span className="route-loading-fallback-text">{tx('加载中…', 'Loading…')}</span>
      </div>
    </div>
  )
}

export default LoadingFallback
