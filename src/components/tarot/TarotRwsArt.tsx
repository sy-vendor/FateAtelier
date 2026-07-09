import type { CSSProperties } from 'react'

interface TarotRwsArtProps {
  src: string
  accent: string
  gold?: string
  skyTop?: string
  skyBottom?: string
  bare?: boolean
}

/** 公版 RWS 插画 + 星穹秘典牌框 */
export function TarotRwsArt({ src, accent, gold, skyTop, skyBottom, bare = false }: TarotRwsArtProps) {
  return (
    <div
      className={`tarot-rws-art${bare ? ' tarot-rws-art--bare' : ''}`}
      style={
        {
          '--art-accent': accent,
          '--art-gold': gold ?? accent,
          '--art-sky-top': skyTop ?? '#141018',
          '--art-sky-bottom': skyBottom ?? '#0a0810',
        } as CSSProperties
      }
    >
      <img className="tarot-rws-art__img" src={src} alt="" draggable={false} />
      {!bare && (
        <>
          <div className="tarot-rws-art__vignette" aria-hidden />
          <div className="tarot-rws-art__frame" aria-hidden />
        </>
      )}
    </div>
  )
}
