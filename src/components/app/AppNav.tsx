import { useState } from 'react'
import { APP_FEATURES } from '../../constants/appFeatures'
import { DOCK_PAGES, FEATURE_GROUPS } from '../../constants/featureGroups'
import type { AppPage } from '../../types/appPage'
import { FeatureIcon } from './FeatureIcon'

export interface AppNavProps {
  currentPage: AppPage
  onSelect: (page: AppPage) => void
}

function featureMeta(page: AppPage) {
  return APP_FEATURES.find((f) => f.page === page)!
}

export default function AppNav({ currentPage, onSelect }: AppNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <>
      {FEATURE_GROUPS.map((group) => (
        <div key={group.id} className="shell-nav__group">
          <p className="shell-nav__group-label">{group.label}</p>
          <ul className="shell-nav__list">
            {group.pages.map((page) => {
              const f = featureMeta(page)
              const active = page === currentPage
              return (
                <li key={page}>
                  <button
                    type="button"
                    className={`shell-nav__item${active ? ' shell-nav__item--active' : ''}`}
                    onClick={() => {
                      onSelect(page)
                      setMobileOpen(false)
                    }}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="shell-nav__icon" aria-hidden>
                      <FeatureIcon page={page} size="sm" />
                    </span>
                    <span className="shell-nav__name">{f.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </>
  )

  return (
    <>
      <aside className="shell-nav shell-nav--desktop" aria-label="功能导航">
        <div className="shell-nav__brand">
          <span className="shell-nav__logo" aria-hidden>
            ✦
          </span>
          <div>
            <p className="shell-nav__brand-title">命运工坊</p>
            <p className="shell-nav__brand-sub">Fate Atelier</p>
          </div>
        </div>
        <nav className="shell-nav__scroll">{navContent}</nav>
      </aside>

      <nav className="shell-dock" aria-label="快捷导航">
        {DOCK_PAGES.map((page) => {
          const f = featureMeta(page)
          const active = page === currentPage
          return (
            <button
              key={page}
              type="button"
              className={`shell-dock__item${active ? ' shell-dock__item--active' : ''}`}
              onClick={() => onSelect(page)}
              aria-label={f.name}
              aria-current={active ? 'page' : undefined}
            >
              <span className="shell-dock__icon" aria-hidden>
                <FeatureIcon page={page} size="sm" />
              </span>
              <span className="shell-dock__label">{f.name.replace(/占卜|运势|求签/g, '')}</span>
            </button>
          )
        })}
        <button
          type="button"
          className={`shell-dock__item shell-dock__item--more${mobileOpen ? ' shell-dock__item--active' : ''}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="全部功能"
        >
          <span className="shell-dock__icon" aria-hidden>
            ☰
          </span>
          <span className="shell-dock__label">更多</span>
        </button>
      </nav>

      {mobileOpen && (
        <div
          className="shell-sheet-backdrop"
          role="presentation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`shell-sheet${mobileOpen ? ' shell-sheet--open' : ''}`}
        aria-label="全部功能"
        aria-hidden={!mobileOpen}
      >
        <div className="shell-sheet__head">
          <p className="shell-sheet__title">全部功能</p>
          <button
            type="button"
            className="shell-sheet__close"
            onClick={() => setMobileOpen(false)}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
        <nav className="shell-nav__scroll shell-sheet__body">{navContent}</nav>
      </aside>
    </>
  )
}
