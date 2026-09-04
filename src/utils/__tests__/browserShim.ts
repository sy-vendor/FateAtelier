/** Minimal browser shims for node-environment vitest. */
export function installBrowserShims(pathname = '/') {
  const store = new Map<string, string>()
  const localStorage = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value))
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  }

  const target = new EventTarget()
  const windowShim = Object.assign(target, {
    location: { pathname },
    localStorage,
    dispatchEvent: target.dispatchEvent.bind(target),
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
  })

  Object.defineProperty(globalThis, 'localStorage', { value: localStorage, configurable: true })
  Object.defineProperty(globalThis, 'window', { value: windowShim, configurable: true })
  Object.defineProperty(globalThis, 'navigator', {
    value: { doNotTrack: null },
    configurable: true,
  })

  return { localStorage, window: windowShim }
}
