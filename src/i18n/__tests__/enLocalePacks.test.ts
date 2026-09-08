import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('ensureEnPack', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('loads packs independently', async () => {
    const mod = await import('../enLocalePacks')
    expect(mod.getEnLocalePacks()).toBeNull()

    await mod.ensureEnPack('tarot')
    expect(mod.isEnPackLoaded('tarot')).toBe(true)
    expect(mod.isEnPackLoaded('divination')).toBe(false)
    expect(mod.getEnLocalePacks()?.tarotCardsEn[0]).toBeTruthy()
    expect(Object.keys(mod.getEnLocalePacks()?.divinationSticksEn ?? {})).toHaveLength(0)

    await mod.ensureEnPack('dream')
    expect(mod.isEnPackLoaded('dream')).toBe(true)
    expect(mod.getEnLocalePacks()?.dreamSymbolsEn.length).toBeGreaterThan(0)
  })
})
