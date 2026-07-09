import type { MeritGameType, ReleaseCreatureId } from './cyberMeritData'

import carpArt from '../assets/cyber-merit/carp.svg'
import koiArt from '../assets/cyber-merit/koi.svg'
import turtleArt from '../assets/cyber-merit/turtle.svg'
import doveArt from '../assets/cyber-merit/dove.svg'
import butterflyArt from '../assets/cyber-merit/butterfly.svg'
import geckoArt from '../assets/cyber-merit/gecko.svg'
import incenseArt from '../assets/cyber-merit/incense.svg'
import prayerArt from '../assets/cyber-merit/prayer.svg'

/** Twemoji (CC-BY 4.0) · 本地打包 */
export const RELEASE_CREATURE_ART: Record<ReleaseCreatureId, string> = {
  carp: carpArt,
  koi: koiArt,
  turtle: turtleArt,
  dove: doveArt,
  butterfly: butterflyArt,
  gecko: geckoArt,
}

export const MERIT_GAME_ART: Partial<Record<MeritGameType, string>> = {
  release: carpArt,
  incense: incenseArt,
  prayer: prayerArt,
}
