import { isEnglishLocale } from '../i18n/locale'

/** Heavenly stems — pinyin without tone marks */
export const TIANGAN_PINYIN: Record<string, string> = {
  甲: 'Jia',
  乙: 'Yi',
  丙: 'Bing',
  丁: 'Ding',
  戊: 'Wu',
  己: 'Ji',
  庚: 'Geng',
  辛: 'Xin',
  壬: 'Ren',
  癸: 'Gui',
}

/** Earthly branches — pinyin without tone marks */
export const DIZHI_PINYIN: Record<string, string> = {
  子: 'Zi',
  丑: 'Chou',
  寅: 'Yin',
  卯: 'Mao',
  辰: 'Chen',
  巳: 'Si',
  午: 'Wu',
  未: 'Wei',
  申: 'Shen',
  酉: 'You',
  戌: 'Xu',
  亥: 'Hai',
}

/** Format a stem-branch pillar for display (e.g. 丙戌 → Bing-Xu in English). */
export function formatGanZhi(ganZhi: string, english = isEnglishLocale()): string {
  if (!ganZhi) return ganZhi
  if (!english) return ganZhi

  const gan = ganZhi[0]
  const zhi = ganZhi[1]
  const ganEn = TIANGAN_PINYIN[gan]
  const zhiEn = DIZHI_PINYIN[zhi]
  if (ganEn && zhiEn) return `${ganEn}-${zhiEn}`
  if (ganEn) return ganEn
  if (zhiEn) return zhiEn
  return ganZhi
}

/** Format gan + zhi separately when already split. */
export function formatGanZhiParts(gan: string, zhi: string, english = isEnglishLocale()): string {
  return formatGanZhi(`${gan}${zhi}`, english)
}
