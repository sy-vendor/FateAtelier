import { useMemo, useState } from 'react'
import { APP_FEATURES } from '../../constants/appFeatures'
import { FEATURE_GROUPS } from '../../constants/featureGroups'
import { INTENT_OPTIONS } from '../../constants/intentOptions'
import type { AppPage, FeaturePage } from '../../types/appPage'
import { useDailyJourney } from '../../hooks/useDailyJourney'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import {
  addReflection,
  listRecentCompletions,
  listWeekEntries,
  type JournalEntry,
} from '../../utils/atelierJournal'
import { trackIntentSelect, trackFeatureSave } from '../../utils/analytics'
import { FeatureIcon } from './FeatureIcon'
import { Button, Panel } from '../ui'
import './home-stage.css'

const MISSION_EN: Partial<Record<FeaturePage, string>> = {
  horoscope: 'See where your energy flows best today',
  almanac: 'Explore favorable activities and hours',
  luckycolor: 'Discover today’s inspiring palette',
  tarot: 'Draw a card for what matters most now',
  divination: 'Ask one clear question and draw a sign',
  dream: 'Follow one symbol to its emotional thread',
  cybermerit: 'Clear your mind with a mindful ritual',
  numberenergy: 'Read a number you have noticed lately',
  shengxiao: 'See how two zodiac signs connect',
  nametest: 'Explore a name through sound and strokes',
}

export interface HomeMainViewProps {
  onNavigate: (page: AppPage) => void
}

function formatStamp(timestamp: number, isEnglish: boolean) {
  return new Date(timestamp).toLocaleString(isEnglish ? 'en-US' : 'zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function featureName(page: FeaturePage, isEnglish: boolean) {
  const feature = APP_FEATURES.find((item) => item.page === page)
  if (!feature) return page
  return isEnglish ? feature.nameEn : feature.name
}

function HomeMainView({ onNavigate }: HomeMainViewProps) {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const daily = useDailyJourney('home')
  const [intentId, setIntentId] = useState<string | null>(null)
  const [reflection, setReflection] = useState('')
  const [reflectPage, setReflectPage] = useState<FeaturePage>('tarot')
  const [journalTick, setJournalTick] = useState(0)

  // journalTick forces a re-read after saves without fake memo deps
  void journalTick
  const recent = listRecentCompletions(6)
  const week = listWeekEntries()
  const intent = INTENT_OPTIONS.find((item) => item.id === intentId) ?? null

  const weekStats = useMemo(() => {
    const byPage = new Map<FeaturePage, number>()
    let reflections = 0
    for (const entry of week) {
      if (entry.kind === 'reflection') reflections += 1
      byPage.set(entry.page, (byPage.get(entry.page) ?? 0) + 1)
    }
    const top = [...byPage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    return { total: week.length, reflections, top }
  }, [week])

  const go = (page: FeaturePage, fromIntent?: string) => {
    if (fromIntent) trackIntentSelect(fromIntent, page)
    onNavigate(page)
  }

  const saveReflection = () => {
    const entry = addReflection(reflectPage, reflection)
    if (!entry) return
    trackFeatureSave(reflectPage)
    setReflection('')
    setJournalTick((n) => n + 1)
  }

  return (
    <div className="home-stage">
      <section className="home-hero">
        <p className="home-hero__eyebrow">{tx('命运工坊 · Fate Atelier', 'Fate Atelier')}</p>
        <h2 className="home-hero__title">
          {tx('免费、无广告的占卜工坊', 'A free, ad-free divination workshop')}
        </h2>
        <p className="home-hero__lead">
          {tx(
            '先想清楚此刻最在意的事，再选一个工具。结果留在本地，无需注册。',
            'Clarify what matters now, then pick a tool. Results stay on your device—no signup.',
          )}
        </p>
        <p className="home-hero__meta">
          {tx(`连续到访 ${daily.streak} 天`, `${daily.streak}-day streak`)}
          {' · '}
          {tx(`今日任务 ${daily.completed}/${daily.missions.length}`, `Today ${daily.completed}/${daily.missions.length}`)}
        </p>
      </section>

      <section className="home-intent" aria-labelledby="home-intent-title">
        <div className="home-section-head">
          <h2 id="home-intent-title">{tx('我现在想…', 'Right now I want to…')}</h2>
          <p>{tx('选一个意图，看看适合的玩法', 'Pick an intent to see matching tools')}</p>
        </div>
        <div className="home-intent__chips">
          {INTENT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`home-intent__chip${intentId === option.id ? ' home-intent__chip--active' : ''}`}
              onClick={() => setIntentId((prev) => (prev === option.id ? null : option.id))}
            >
              <strong>{tx(option.zh, option.en)}</strong>
              <small>{tx(option.hintZh, option.hintEn)}</small>
            </button>
          ))}
        </div>
        {intent && (
          <div className="home-intent__tools">
            {intent.pages.map((page) => (
              <button key={page} type="button" className="home-tool-card" onClick={() => go(page, intent.id)}>
                <span className="home-tool-card__icon" aria-hidden>
                  <FeatureIcon page={page} size="sm" />
                </span>
                <span>
                  <strong>{featureName(page, isEnglish)}</strong>
                  <small>
                    {isEnglish
                      ? APP_FEATURES.find((f) => f.page === page)?.descriptionEn
                      : APP_FEATURES.find((f) => f.page === page)?.description}
                  </small>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="home-missions" aria-labelledby="home-missions-title">
        <div className="home-section-head">
          <h2 id="home-missions-title">{tx('今日三星', 'Today’s three stars')}</h2>
          <p>{tx('完成有效体验后才会点亮，不只是打开页面', 'Lights up after a meaningful result—not just opening a page')}</p>
        </div>
        <div className="home-missions__grid">
          {daily.missions.map((mission) => {
            const done = daily.visited.includes(mission.page)
            const feature = APP_FEATURES.find((item) => item.page === mission.page)!
            return (
              <button
                key={mission.page}
                type="button"
                className={`home-mission${done ? ' home-mission--done' : ''}`}
                onClick={() => go(mission.page)}
              >
                <span aria-hidden>{done ? '✓' : <FeatureIcon page={mission.page} size="sm" />}</span>
                <span>
                  <strong>{isEnglish ? feature.nameEn : feature.name}</strong>
                  <small>
                    {isEnglish ? (MISSION_EN[mission.page] ?? mission.prompt) : mission.prompt}
                  </small>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="home-catalog" aria-labelledby="home-catalog-title">
        <div className="home-section-head">
          <h2 id="home-catalog-title">{tx('全部玩法', 'All tools')}</h2>
          <p>{tx('按主题浏览十五种体验', 'Browse fifteen experiences by theme')}</p>
        </div>
        {FEATURE_GROUPS.map((group) => (
          <div key={group.id} className="home-catalog__group">
            <h3>{isEnglish ? group.labelEn : group.label}</h3>
            <div className="home-catalog__grid">
              {group.pages.map((page) => {
                const feature = APP_FEATURES.find((item) => item.page === page)!
                return (
                  <button key={page} type="button" className="home-tool-card" onClick={() => go(page)}>
                    <span className="home-tool-card__icon" aria-hidden>
                      <FeatureIcon page={page} size="sm" />
                    </span>
                    <span>
                      <strong>{isEnglish ? feature.nameEn : feature.name}</strong>
                      <small>{isEnglish ? feature.descriptionEn : feature.description}</small>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="home-journal" aria-labelledby="home-journal-title">
        <div className="home-section-head">
          <h2 id="home-journal-title">{tx('我的记录', 'My journal')}</h2>
          <p>{tx('本机保存的完成记录与一句感受，可随时回看', 'Completions and short reflections saved on this device')}</p>
        </div>

        <Panel title={tx('本周回顾', 'This week')}>
          <p className="home-journal__stats">
            {tx(
              `近 7 天 ${weekStats.total} 条记录 · ${weekStats.reflections} 条感受`,
              `${weekStats.total} entries · ${weekStats.reflections} reflections in 7 days`,
            )}
          </p>
          {weekStats.top.length > 0 ? (
            <ul className="home-journal__top">
              {weekStats.top.map(([page, count]) => (
                <li key={page}>
                  <button type="button" onClick={() => go(page)}>
                    {featureName(page, isEnglish)} · {count}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="prose">{tx('本周还没有记录。完成一次抽牌、解签或排盘后会出现在这里。', 'No entries yet this week. Complete a reading and it will show up here.')}</p>
          )}
        </Panel>

        <Panel title={tx('最近完成', 'Recent completions')}>
          {recent.length === 0 ? (
            <p className="prose">{tx('尚无完成记录', 'No completions yet')}</p>
          ) : (
            <ul className="home-journal__list">
              {recent.map((entry: JournalEntry) => (
                <li key={entry.id}>
                  <button type="button" onClick={() => go(entry.page)}>
                    <strong>{entry.title}</strong>
                    <small>
                      {formatStamp(entry.timestamp, isEnglish)} · {entry.summary}
                    </small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={tx('留下一句感受', 'Leave a reflection')}>
          <div className="home-reflect">
            <label className="field__label" htmlFor="home-reflect-page">
              {tx('相关玩法', 'Related tool')}
            </label>
            <select
              id="home-reflect-page"
              className="field__input"
              value={reflectPage}
              onChange={(event) => setReflectPage(event.target.value as FeaturePage)}
            >
              {APP_FEATURES.map((feature) => (
                <option key={feature.page} value={feature.page}>
                  {isEnglish ? feature.nameEn : feature.name}
                </option>
              ))}
            </select>
            <label className="field__label" htmlFor="home-reflect-text">
              {tx('此刻最想记住的一句话', 'One line you want to remember')}
            </label>
            <textarea
              id="home-reflect-text"
              className="field__textarea"
              rows={3}
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder={tx('例如：先把今晚的对话说清楚。', 'e.g. Speak clearly in tonight’s conversation.')}
            />
            <Button small onClick={saveReflection} disabled={!reflection.trim()}>
              {tx('保存到本机', 'Save locally')}
            </Button>
          </div>
        </Panel>
      </section>

      <p className="home-disclaimer callout">
        {tx(
          '玩法结果仅供娱乐与自我反思；黄历、八字、奇门等为文化体验版简化演算。数据默认留在浏览器本地。',
          'Readings are for entertainment and reflection. Almanac, Ba Zi, and Qi Men use simplified cultural rules. Data stays in your browser by default.',
        )}{' '}
        <button type="button" className="home-disclaimer__link" onClick={() => onNavigate('methodology')}>
          {tx('方法说明', 'Methodology')}
        </button>
        {' · '}
        <button type="button" className="home-disclaimer__link" onClick={() => onNavigate('privacy')}>
          {tx('隐私', 'Privacy')}
        </button>
        {' · '}
        <button type="button" className="home-disclaimer__link" onClick={() => onNavigate('disclaimer')}>
          {tx('免责声明', 'Disclaimer')}
        </button>
      </p>
    </div>
  )
}

export default HomeMainView
