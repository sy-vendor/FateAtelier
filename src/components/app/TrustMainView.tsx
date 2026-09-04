import { useEffect, useState } from 'react'
import { TRUST_PAGES, getTrustPageCopy, type TrustPage } from '../../content/trustPages'
import type { AppPage } from '../../types/appPage'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import { isAnalyticsEnabled, setAnalyticsEnabled } from '../../utils/analytics'
import { pagePath } from '../../utils/localePath'
import './trust-stage.css'

export interface TrustMainViewProps {
  page: TrustPage
  onNavigate: (page: AppPage) => void
}

export default function TrustMainView({ page, onNavigate }: TrustMainViewProps) {
  const { isEnglish, locale } = useLocale()
  const tx = useTx()
  const copy = getTrustPageCopy(page)
  const sections = isEnglish ? copy.sectionsEn : copy.sectionsZh
  const title = isEnglish ? copy.titleEn : copy.titleZh
  const [analyticsOn, setAnalyticsOn] = useState(() => isAnalyticsEnabled())

  useEffect(() => {
    if (page !== 'privacy') return
    setAnalyticsOn(isAnalyticsEnabled())
  }, [page])

  return (
    <article className="trust-stage">
      <header className="trust-stage__head">
        <p className="trust-stage__eyebrow">{tx('信任与说明', 'Trust & policies')}</p>
        <h2 className="trust-stage__title">{title}</h2>
        <p className="trust-stage__lead">
          {isEnglish ? copy.descriptionEn : copy.descriptionZh}
        </p>
      </header>

      <nav className="trust-stage__toc" aria-label={tx('信任页面', 'Trust pages')}>
        {TRUST_PAGES.map((slug) => {
          const item = getTrustPageCopy(slug)
          const active = slug === page
          return (
            <a
              key={slug}
              href={pagePath(slug, locale)}
              className={`trust-stage__toc-link${active ? ' trust-stage__toc-link--active' : ''}`}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(slug)
              }}
              aria-current={active ? 'page' : undefined}
            >
              {isEnglish ? item.titleEn : item.titleZh}
            </a>
          )
        })}
      </nav>

      {sections.map((section) => (
        <section key={section.heading} className="trust-stage__section">
          <h3>{section.heading}</h3>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {page === 'privacy' && (
        <section className="trust-stage__section trust-stage__control">
          <h3>{tx('匿名使用统计', 'Anonymous analytics')}</h3>
          <label className="trust-stage__toggle">
            <input
              type="checkbox"
              checked={analyticsOn}
              onChange={(event) => {
                const next = event.target.checked
                setAnalyticsEnabled(next)
                setAnalyticsOn(next)
              }}
            />
            <span>
              {analyticsOn
                ? tx('已开启：页面进入与完成等产品事件会匿名上报', 'On: page enter and complete events are sent anonymously')
                : tx('已关闭：不加载 Analytics，也不发送产品事件', 'Off: Analytics is not loaded and product events are not sent')}
            </span>
          </label>
        </section>
      )}

      <p className="trust-stage__back">
        <a
          href={pagePath('home', locale)}
          onClick={(event) => {
            event.preventDefault()
            onNavigate('home')
          }}
        >
          {tx('返回工坊首页', 'Back to workshop home')}
        </a>
      </p>
    </article>
  )
}
