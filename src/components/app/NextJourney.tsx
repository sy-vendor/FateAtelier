import type { AppPage } from '../../types/appPage'
import { APP_FEATURES } from '../../constants/appFeatures'
import { useTx } from '../../i18n/useTx'
import { navigateToFeature } from '../../utils/appNavigation'
import { FeatureIcon } from './FeatureIcon'

const OPTIONS: Record<'tarot' | 'dream' | 'divination', Array<{ page: AppPage; title: string; titleEn: string; text: string; textEn: string }>> = {
  tarot: [
    { page: 'divination', title: '再求一签', titleEn: 'Draw a Fortune Stick', text: '把牌面的启发，收束成一个具体行动', textEn: 'Turn the cards’ insight into one concrete next step' },
    { page: 'luckycolor', title: '带走一色', titleEn: 'Take a Color', text: '用今日幸运色为这次解读留下锚点', textEn: 'Anchor this reading with today’s lucky color' },
  ],
  dream: [
    { page: 'tarot', title: '为梦抽牌', titleEn: 'Draw for the Dream', text: '把梦中最强烈的感受，变成一个清晰提问', textEn: 'Turn the strongest feeling in your dream into a clear question' },
    { page: 'luckycolor', title: '选一种醒来的颜色', titleEn: 'Choose a Waking Color', text: '用色彩记住梦留下的情绪线索', textEn: 'Use color to remember the emotional thread your dream left behind' },
  ],
  divination: [
    { page: 'almanac', title: '落到今日节律', titleEn: 'Ground in Today’s Rhythm', text: '结合今日宜忌，为签文建议找一个时机', textEn: 'Pair the oracle’s advice with today’s favorable timing' },
    { page: 'tarot', title: '换一个视角', titleEn: 'Shift Perspective', text: '以同一个问题抽一张牌，对照两种启发', textEn: 'Draw one card on the same question and compare both insights' },
  ],
}

export default function NextJourney({ from }: { from: keyof typeof OPTIONS }) {
  const tx = useTx()

  return (
    <aside className="next-journey" aria-labelledby={`next-journey-${from}`}>
      <div className="next-journey__head">
        <p className="next-journey__eyebrow">{tx('结果不是终点', 'The reading is not the end')}</p>
        <h2 id={`next-journey-${from}`}>{tx('接下来，你想把这份启发带去哪里？', 'Where would you like to take this insight next?')}</h2>
      </div>
      <div className="next-journey__grid">
        {OPTIONS[from].map((option) => {
          const feature = APP_FEATURES.find((item) => item.page === option.page)!
          return (
            <button key={option.page} type="button" onClick={() => navigateToFeature(option.page)}>
              <span className="next-journey__icon" aria-hidden><FeatureIcon page={option.page} size="sm" /></span>
              <span><strong>{tx(option.title, option.titleEn)}</strong><small>{tx(option.text, option.textEn)}</small></span>
              <span aria-hidden>→</span>
              <span className="sr-only">{tx(`前往${feature.name}`, `Go to ${feature.nameEn}`)}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
