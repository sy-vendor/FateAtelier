/**
 * localStorage 工具函数
 * 提供统一的错误处理和降级方案
 */

// 延迟导入 logger 以避免循环依赖
let loggerInstance: typeof import('./logger').logger | null = null

// 同步版本的 logger（用于错误处理，如果 logger 未加载则使用 console）
function logError(...args: unknown[]) {
  if (loggerInstance) {
    loggerInstance.error(...args)
  } else if (import.meta.env.DEV) {
    console.error(...args)
  } else {
    // 异步加载 logger（不阻塞）
    import('./logger').then(module => {
      loggerInstance = module.logger
      loggerInstance.error(...args)
    }).catch(() => {
      // 如果加载失败，忽略
    })
  }
}

export interface StorageResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 安全地从 localStorage 获取数据
 */
export function getStorageItem<T>(key: string, defaultValue?: T): StorageResult<T> {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return { success: true, data: defaultValue }
    }
    const parsed = JSON.parse(item) as T
    return { success: true, data: parsed }
  } catch (error) {
    // 数据损坏或解析失败
    logError(`Failed to get storage item "${key}":`, error)
    // 清除损坏的数据
    try {
      localStorage.removeItem(key)
    } catch {
      // 忽略清除失败
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: defaultValue,
    }
  }
}

/**
 * Read a string while remaining compatible with keys that historically stored
 * an unquoted raw value instead of JSON.
 */
export function getStorageString(key: string, defaultValue?: string): StorageResult<string> {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return { success: true, data: defaultValue }
    if (item.startsWith('"')) {
      const parsed = JSON.parse(item)
      return typeof parsed === 'string'
        ? { success: true, data: parsed }
        : { success: false, data: defaultValue, error: 'Stored value is not a string' }
    }
    return { success: true, data: item }
  } catch (error) {
    logError(`Failed to get storage string "${key}":`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: defaultValue,
    }
  }
}

/**
 * 安全地设置 localStorage 数据
 */
export function setStorageItem<T>(key: string, value: T): StorageResult<void> {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return { success: true }
  } catch (error) {
    // 可能是存储空间不足或存储被禁用
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('QuotaExceededError') || errorMessage.includes('quota')) {
      logError(`Storage quota exceeded for key "${key}"`)
      return {
        success: false,
        error: '存储空间不足，请清理一些数据后重试',
      }
    }
    
    logError(`Failed to set storage item "${key}":`, error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * 安全地移除 localStorage 数据
 */
export function removeStorageItem(key: string): StorageResult<void> {
  try {
    localStorage.removeItem(key)
    return { success: true }
  } catch (error) {
    logError(`Failed to remove storage item "${key}":`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 检查 localStorage 是否可用
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * 获取存储使用情况（估算）
 */
export function getStorageUsage(): { used: number; available: number; percentage: number } {
  try {
    let used = 0
    for (const key of Object.keys(localStorage)) {
      used += (localStorage.getItem(key)?.length ?? 0) + key.length
    }
    
    // 大多数浏览器限制为 5-10MB，这里使用 5MB 作为基准
    const quota = 5 * 1024 * 1024 // 5MB
    const available = quota - used
    const percentage = (used / quota) * 100
    
    return {
      used,
      available: Math.max(0, available),
      percentage: Math.min(100, percentage),
    }
  } catch {
    return { used: 0, available: 0, percentage: 0 }
  }
}
