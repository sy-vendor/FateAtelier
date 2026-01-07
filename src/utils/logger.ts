/**
 * 日志工具函数
 * 在生产环境中自动禁用 console 输出
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  error: (...args: unknown[]) => {
    // 错误日志在生产环境也保留，但可以添加错误上报
    if (isDevelopment) {
      console.error(...args)
    } else {
      // 生产环境可以在这里添加错误上报逻辑
      // 例如：上报到错误监控服务
    }
  },
}

