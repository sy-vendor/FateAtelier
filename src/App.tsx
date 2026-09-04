import { useState, useMemo, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ToastContainer from './components/ToastContainer'
import ConfirmDialogContainer from './components/ConfirmDialogContainer'
import AppNav from './components/app/AppNav'
import AppFeatureRoutes from './components/app/AppFeatureRoutes'
import DailyJourney from './components/app/DailyJourney'
import { FeatureIcon } from './components/app/FeatureIcon'
import { APP_FEATURES } from './constants/appFeatures'
import { isTrustPage, getTrustPageCopy } from './content/trustPages'
import type { AppPage } from './types/appPage'
import { getPageSubtitle } from './utils/appSubtitles'
import { useDailyJourney } from './hooks/useDailyJourney'
import { APP_NAVIGATE_EVENT } from './utils/appNavigation'
import { ANALYTICS_PREF_EVENT, isAnalyticsEnabled, trackPageEnter } from './utils/analytics'
import { buildHreflangAlternates } from './utils/seoMetadata'
import './components/app/app-shell.css'
import { useLocale } from './i18n/LocaleContext'
import { pagePath, parseLocalePath } from './utils/localePath'

function App() {
  const { locale, setLocale, isEnglish } = useLocale()
  const pageFromLocation = (): AppPage => parseLocalePath().page
  const [currentPage, setCurrentPage] = useState<AppPage>(pageFromLocation)
  const [analyticsOn, setAnalyticsOn] = useState(() => isAnalyticsEnabled())
  const dailyJourney = useDailyJourney(currentPage)

  const currentFeature = useMemo(
    () => APP_FEATURES.find((f) => f.page === currentPage),
    [currentPage],
  )

  const topbarTitle = currentPage === 'home'
    ? (isEnglish ? 'Fate Atelier' : '命运工坊')
    : isTrustPage(currentPage)
      ? (isEnglish ? getTrustPageCopy(currentPage).titleEn : getTrustPageCopy(currentPage).titleZh)
      : (isEnglish ? currentFeature?.nameEn : currentFeature?.name) ?? (isEnglish ? 'Fate Atelier' : '命运工坊')

  useEffect(() => {
    const onPopState = () => setCurrentPage(pageFromLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const page = (event as CustomEvent<AppPage>).detail
      if (page !== 'home' && !isTrustPage(page) && !APP_FEATURES.some((feature) => feature.page === page)) return
      window.history.pushState(null, '', pagePath(page, locale))
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener(APP_NAVIGATE_EVENT, onNavigate)
    return () => window.removeEventListener(APP_NAVIGATE_EVENT, onNavigate)
  }, [locale])

  useEffect(() => {
    trackPageEnter(currentPage)
  }, [currentPage])

  useEffect(() => {
    // Detail landing pages keep server-rendered metadata for long-tail SEO.
    if (parseLocalePath().segments.length > 1) return
    const canonicalUrl = `https://www.fateatelier.cloud${pagePath(currentPage, locale)}`
    const brand = isEnglish ? 'Fate Atelier' : '命运工坊'
    const seoTitle = currentPage === 'home'
      ? brand
      : isTrustPage(currentPage)
        ? (isEnglish ? getTrustPageCopy(currentPage).titleEn : getTrustPageCopy(currentPage).titleZh)
        : (isEnglish ? currentFeature?.seoTitleEn : currentFeature?.seoTitle) ?? brand
    const description = currentPage === 'home'
      ? (isEnglish
        ? 'Free, ad-free online divination workshop: tarot, horoscope, Chinese almanac, BaZi, fortune sticks, dream guide, and more—no signup required.'
        : '免费无广告的在线综合占卜工坊：塔罗、星座、黄历、八字紫微、抽签解梦等，无需注册。')
      : isTrustPage(currentPage)
        ? (isEnglish ? getTrustPageCopy(currentPage).descriptionEn : getTrustPageCopy(currentPage).descriptionZh)
        : (isEnglish ? currentFeature?.descriptionEn : currentFeature?.description) ?? ''
    document.title = currentPage === 'home'
      ? (isEnglish ? `${brand} | Free Tarot & Divination Tools` : `${brand} | 免费在线占卜与命理工具`)
      : `${seoTitle} | ${brand}`
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
    document.querySelector<HTMLMetaElement>('meta[property="og:locale"]')?.setAttribute('content', isEnglish ? 'en_US' : 'zh_CN')
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)

    const ensureAlternate = (hreflang: string, href: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`)
      if (!link) {
        link = document.createElement('link')
        link.rel = 'alternate'
        link.hreflang = hreflang
        document.head.appendChild(link)
      }
      link.href = href
    }
    for (const { hreflang, href } of buildHreflangAlternates(currentPage)) {
      ensureAlternate(hreflang, href)
    }
  }, [currentFeature, currentPage, isEnglish, locale])

  useEffect(() => {
    const onPref = (event: Event) => {
      setAnalyticsOn(Boolean((event as CustomEvent<boolean>).detail))
    }
    window.addEventListener(ANALYTICS_PREF_EVENT, onPref)
    return () => window.removeEventListener(ANALYTICS_PREF_EVENT, onPref)
  }, [])

  const navigateTo = (page: AppPage) => {
    if (page === currentPage) return
    window.history.pushState(null, '', pagePath(page, locale))
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="shell">
      <div className="shell__backdrop aurora-orbs" aria-hidden="true">
        <span className="aurora-orb aurora-orb--violet" />
        <span className="aurora-orb aurora-orb--rose" />
        <span className="aurora-orb aurora-orb--cyan" />
      </div>

      <AppNav currentPage={currentPage} onSelect={navigateTo} />

      <div className="shell__main">
        <header className="shell-topbar">
          <div className="shell-topbar__feature">
            <span className="shell-topbar__icon" aria-hidden>
              <FeatureIcon page={currentPage} size="lg" />
            </span>
            <div className="shell-topbar__text">
              <h1 className="shell-topbar__title">{topbarTitle}</h1>
              <p className="shell-topbar__sub">{getPageSubtitle(currentPage, isEnglish)}</p>
            </div>
          </div>

          <div className="shell-topbar__actions" role="group" aria-label={isEnglish ? 'Language' : '语言'}>
            <button className="locale-switch" type="button" onClick={() => setLocale(locale === 'en' ? 'zh-CN' : 'en')}>
              <span aria-hidden>{isEnglish ? '中' : 'EN'}</span>
              <span className="sr-only">{isEnglish ? '切换到中文' : 'Switch to English'}</span>
            </button>
          </div>
        </header>

        {currentPage !== 'home' && !isTrustPage(currentPage) && (
          <DailyJourney {...dailyJourney} onSelect={navigateTo} />
        )}

        <main className="shell-stage">
          <AppFeatureRoutes currentPage={currentPage} onNavigate={navigateTo} />
        </main>

        <footer className="shell-footer">
          <p>
            © {new Date().getFullYear()} {isEnglish ? 'Fate Atelier · For entertainment only' : '命运工坊 · 仅供娱乐参考'} ·{' '}
            <a href={pagePath('methodology', locale)} onClick={(event) => { event.preventDefault(); navigateTo('methodology') }}>
              {isEnglish ? 'Methodology' : '方法'}
            </a>
            {' · '}
            <a href={pagePath('privacy', locale)} onClick={(event) => { event.preventDefault(); navigateTo('privacy') }}>
              {isEnglish ? 'Privacy' : '隐私'}
            </a>
            {' · '}
            <a href={pagePath('disclaimer', locale)} onClick={(event) => { event.preventDefault(); navigateTo('disclaimer') }}>
              {isEnglish ? 'Disclaimer' : '免责'}
            </a>
            {' · '}
            <a href={pagePath('about', locale)} onClick={(event) => { event.preventDefault(); navigateTo('about') }}>
              {isEnglish ? 'About' : '关于'}
            </a>
            {' · '}
            <a href="https://github.com/sy-vendor/FateAtelier" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </footer>
      </div>

      <ToastContainer />
      <ConfirmDialogContainer />
      {analyticsOn ? <Analytics /> : null}
    </div>
  )
}

export default App
