export type MotionPermissionState = 'unknown' | 'granted' | 'denied' | 'unsupported'

interface DeviceMotionEventWithPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

export function isShakeSupported(): boolean {
  return typeof window !== 'undefined' && 'DeviceMotionEvent' in window
}

export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/** iOS 13+ 需在用户手势中请求运动传感器权限 */
export async function requestMotionPermission(): Promise<MotionPermissionState> {
  if (!isShakeSupported()) return 'unsupported'

  const ctor = DeviceMotionEvent as unknown as DeviceMotionEventWithPermission
  if (typeof ctor.requestPermission === 'function') {
    try {
      const result = await ctor.requestPermission()
      return result === 'granted' ? 'granted' : 'denied'
    } catch {
      return 'denied'
    }
  }

  return 'granted'
}

export interface ShakeListenerOptions {
  /** 三轴加速度变化量之和阈值，默认 15 */
  threshold?: number
  /** 两次摇签最小间隔（毫秒），默认 1200 */
  cooldown?: number
}

/**
 * 监听手机摇一摇。使用加速度差值检测，避免重力分量导致误判。
 * 返回取消监听的清理函数。
 */
export function createShakeListener(
  onShake: () => void,
  options?: ShakeListenerOptions,
): () => void {
  const threshold = options?.threshold ?? 15
  const cooldown = options?.cooldown ?? 1200

  let lastShake = 0
  let prevX = 0
  let prevY = 0
  let prevZ = 0
  let hasPrev = false

  const onMotion = (e: DeviceMotionEvent) => {
    const acc = e.acceleration ?? e.accelerationIncludingGravity
    if (!acc || acc.x == null || acc.y == null || acc.z == null) return

    const x = acc.x
    const y = acc.y
    const z = acc.z

    if (!hasPrev) {
      prevX = x
      prevY = y
      prevZ = z
      hasPrev = true
      return
    }

    const delta = Math.abs(x - prevX) + Math.abs(y - prevY) + Math.abs(z - prevZ)
    prevX = x
    prevY = y
    prevZ = z

    const now = Date.now()
    if (delta > threshold && now - lastShake > cooldown) {
      lastShake = now
      onShake()
    }
  }

  window.addEventListener('devicemotion', onMotion)
  return () => window.removeEventListener('devicemotion', onMotion)
}
