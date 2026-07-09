import {
  MERIT_GAMES,
  MERIT_MESSAGES,
  MERIT_MILESTONES,
  MILESTONE_MESSAGES,
  RELEASE_CREATURES,
  type MeritGameType,
  type ReleaseAnimation,
} from './cyberMeritData'

export function getTotalMerit(counts: Record<MeritGameType, number>): number {
  return MERIT_GAMES.reduce((sum, game) => sum + counts[game.id] * game.meritPerAction, 0)
}

export function getRandomMessage(type: MeritGameType): string {
  const pool = MERIT_MESSAGES[type]
  return pool[Math.floor(Math.random() * pool.length)]
}

export function checkMilestone(type: MeritGameType, count: number): string | null {
  if (!MERIT_MILESTONES.includes(count as (typeof MERIT_MILESTONES)[number])) return null
  return MILESTONE_MESSAGES[type](count)
}

export function computeReleaseAnimation(animalIndex: number): ReleaseAnimation {
  const creature = RELEASE_CREATURES[animalIndex]
  return {
    index: animalIndex,
    motion: creature?.motion ?? 'swim',
  }
}

export function playMeritTone(
  type: MeritGameType,
  audioContext?: AudioContext
): void {
  try {
    const ctx = audioContext ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    if (type === 'woodfish') {
      const baseFreq = 80
      ;[baseFreq, baseFreq * 2, baseFreq * 3].forEach((freq, index) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        oscillator.frequency.value = freq
        oscillator.type = index === 0 ? 'square' : 'sine'
        const volume = index === 0 ? 0.3 : index === 1 ? 0.15 : 0.08
        gainNode.gain.setValueAtTime(volume, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.12)
      })
      return
    }

    const frequencies: Record<MeritGameType, number> = {
      woodfish: 80,
      release: 400,
      incense: 300,
      prayer: 250,
    }
    const durations: Record<MeritGameType, number> = {
      woodfish: 100,
      release: 200,
      incense: 250,
      prayer: 300,
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.value = frequencies[type]
    oscillator.type = 'sine'
    const dur = durations[type] / 1000
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + dur)
  } catch {
    // audio optional
  }
}
