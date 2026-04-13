import './LoadingFallback.css'

/** 懒加载子页面的占位 UI */
function LoadingFallback() {
  return (
    <div className="route-loading-fallback" role="status" aria-live="polite" aria-label="加载中">
      <div className="route-loading-fallback-inner">
        <span className="route-loading-fallback-spinner" aria-hidden="true" />
        <span className="route-loading-fallback-text">加载中…</span>
      </div>
    </div>
  )
}

export default LoadingFallback
