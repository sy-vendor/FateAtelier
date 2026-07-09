import { useState, useEffect, useMemo, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { TarotCard } from '../../data/tarotCards'
import { tarotCards } from '../../data/tarotCards'
import { getFavoriteCards, toggleFavorite, isFavorite } from '../../utils/favorites'
import { TarotCardVisual } from './TarotCardVisual'
import { Segmented } from '../ui'
import './tarot-library.css'

type LibraryTab = 'deck' | 'favorites' | 'guide'
type SuitFilter = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'

const FILTER_OPTIONS: { value: SuitFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'major', label: '大阿卡纳' },
  { value: 'wands', label: '权杖' },
  { value: 'cups', label: '圣杯' },
  { value: 'swords', label: '宝剑' },
  { value: 'pentacles', label: '星币' },
]

const GUIDE_SECTIONS = [
  {
    title: '每日一牌',
    body: '每天可揭示一次当日牌面。点击牌背翻开，可切换正逆位查看不同解读。',
  },
  {
    title: '单牌洞察',
    body: '默念问题后抽取一张牌，获得对当下处境的直接指引。点击牌面可切换正逆位。',
  },
  {
    title: '三牌占卜',
    body: '一次抽取三张牌，分别对应过去、现在与未来，并附带综合解读。',
  },
  {
    title: '星穹秘典图鉴',
    body: '浏览全部 78 张牌面，支持按花色筛选与名称搜索。点击任意牌可查看完整牌义。',
  },
  {
    title: '收藏',
    body: '在图鉴中为常用牌面添加收藏，方便日后快速查阅。',
  },
  {
    title: '占卜记录',
    body: '每次占卜结果会自动保存，可在页面下方回顾历史记录。',
  },
  {
    title: '正位与逆位',
    body: '同一张牌在正位与逆位下含义不同。抽牌后点击「转为逆位」或直接点击牌面切换。',
  },
  {
    title: '说明',
    body: '塔罗占卜仅供娱乐与自我反思，不应作为重大决策的唯一依据。',
  },
]

interface TarotLibraryProps {
  onSelectCard: (card: TarotCard) => void
}

function IconDeck() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3" y="5" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7" y="3" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5 L12 7.5 L17.5 8 L13.5 11.5 L14.5 17 L10 14.5 L5.5 17 L6.5 11.5 L2.5 8 L8 7.5 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconHelp() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 13.5 V13 C10 11.5 12 11 12 9.5 C12 8.1 11 7 10 7 C9 7 8.2 7.5 7.8 8.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="15.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function TarotLibrary({ onSelectCard }: TarotLibraryProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<LibraryTab>('deck')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<SuitFilter>('all')
  const [favoriteCards, setFavoriteCards] = useState<TarotCard[]>([])

  const refreshFavorites = () => {
    setFavoriteCards(getFavoriteCards(tarotCards))
  }

  useEffect(() => {
    refreshFavorites()
    window.addEventListener('favorites-changed', refreshFavorites)
    window.addEventListener('storage', refreshFavorites)
    return () => {
      window.removeEventListener('favorites-changed', refreshFavorites)
      window.removeEventListener('storage', refreshFavorites)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const filteredDeck = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tarotCards.filter((card) => {
      const matchesSearch =
        !q ||
        card.name.toLowerCase().includes(q) ||
        card.nameEn.toLowerCase().includes(q)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'major' && card.type === 'major') ||
        card.suit === filter
      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  const displayCards = tab === 'favorites' ? favoriteCards : filteredDeck

  const openPanel = (nextTab: LibraryTab) => {
    setTab(nextTab)
    setOpen(true)
  }

  const handleSelect = (card: TarotCard) => {
    onSelectCard(card)
    setOpen(false)
  }

  const handleFavoriteToggle = (cardId: number, e: MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(cardId)
  }

  return (
    <>
      <div className="tarot-toolbar" role="toolbar" aria-label="塔罗工具">
        <button
          type="button"
          className="tarot-toolbar__btn"
          onClick={() => openPanel('deck')}
          aria-label="打开牌面图鉴"
        >
          <IconDeck />
          <span>图鉴</span>
        </button>
        <button
          type="button"
          className="tarot-toolbar__btn"
          onClick={() => openPanel('favorites')}
          aria-label={`我的收藏，${favoriteCards.length} 张`}
        >
          <IconStar />
          <span>收藏</span>
          {favoriteCards.length > 0 && (
            <span className="tarot-toolbar__badge">{favoriteCards.length}</span>
          )}
        </button>
        <button
          type="button"
          className="tarot-toolbar__btn"
          onClick={() => openPanel('guide')}
          aria-label="打开占卜指南"
        >
          <IconHelp />
          <span>指南</span>
        </button>
      </div>

      {open &&
        createPortal(
          <div className="tarot-library" role="dialog" aria-modal="true" aria-label="塔罗牌库">
            <button
              type="button"
              className="tarot-library__backdrop"
              onClick={() => setOpen(false)}
              aria-label="关闭"
            />
            <div className="tarot-library__panel">
              <header className="tarot-library__head">
                <div className="tarot-library__head-text">
                  <h2 className="tarot-library__title">星穹秘典</h2>
                  <p className="tarot-library__sub">Celestial Codex · 78 张塔罗牌</p>
                </div>
                <button
                  type="button"
                  className="tarot-library__close"
                  onClick={() => setOpen(false)}
                  aria-label="关闭"
                >
                  <IconClose />
                </button>
              </header>

              <Segmented
                block
                value={tab}
                options={[
                  { value: 'deck' as LibraryTab, label: '图鉴' },
                  {
                    value: 'favorites' as LibraryTab,
                    label: `收藏${favoriteCards.length ? ` (${favoriteCards.length})` : ''}`,
                  },
                  { value: 'guide' as LibraryTab, label: '指南' },
                ]}
                onChange={setTab}
              />

              {tab === 'guide' ? (
                <div className="tarot-library__guide">
                  {GUIDE_SECTIONS.map((section) => (
                    <article key={section.title} className="tarot-library__guide-item">
                      <h3>{section.title}</h3>
                      <p>{section.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <>
                  {tab === 'deck' && (
                    <div className="tarot-library__filters">
                      <input
                        type="search"
                        className="tarot-library__search"
                        placeholder="搜索牌名…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <div className="tarot-library__filter-scroll">
                        <Segmented value={filter} options={FILTER_OPTIONS} onChange={setFilter} />
                      </div>
                    </div>
                  )}

                  {displayCards.length === 0 ? (
                    <div className="tarot-library__empty">
                      <p>{tab === 'favorites' ? '还没有收藏任何牌面' : '没有匹配的牌面'}</p>
                      {tab === 'favorites' && (
                        <button
                          type="button"
                          className="tarot-library__empty-btn"
                          onClick={() => setTab('deck')}
                        >
                          去图鉴浏览
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="tarot-library__body">
                      <p className="tarot-library__count">
                        {tab === 'favorites'
                          ? `已收藏 ${displayCards.length} 张`
                          : `共 ${displayCards.length} 张`}
                      </p>

                      <div className="tarot-library__grid">
                        {displayCards.map((card) => (
                          <div key={card.id} className="tarot-library__cell">
                            <button
                              type="button"
                              className="tarot-library__card-btn"
                              onClick={() => handleSelect(card)}
                            >
                              <div className="tarot-library__card-visual">
                                <TarotCardVisual card={card} faceUp variant="library" />
                              </div>
                              <span className="tarot-library__card-name">{card.name}</span>
                            </button>
                            <button
                              type="button"
                              className={`tarot-library__fav${isFavorite(card.id) ? ' tarot-library__fav--on' : ''}`}
                              onClick={(e) => handleFavoriteToggle(card.id, e)}
                              aria-label={isFavorite(card.id) ? '取消收藏' : '收藏'}
                            >
                              <IconStar />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
