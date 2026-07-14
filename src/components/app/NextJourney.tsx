import type { AppPage } from '../../types/appPage'
import { APP_FEATURES } from '../../constants/appFeatures'
import { navigateToFeature } from '../../utils/appNavigation'
import { FeatureIcon } from './FeatureIcon'

const OPTIONS: Record<'tarot' | 'dream' | 'divination', Array<{ page: AppPage; title: string; text: string }>> = {
  tarot: [
    { page: 'divination', title: '再求一签', text: '把牌面的启发，收束成一个具体行动' },
    { page: 'luckycolor', title: '带走一色', text: '用今日幸运色为这次解读留下锚点' },
  ],
  dream: [
    { page: 'tarot', title: '为梦抽牌', text: '把梦中最强烈的感受，变成一个清晰提问' },
    { page: 'luckycolor', title: '选一种醒来的颜色', text: '用色彩记住梦留下的情绪线索' },
  ],
  divination: [
    { page: 'almanac', title: '落到今日节律', text: '结合今日宜忌，为签文建议找一个时机' },
    { page: 'tarot', title: '换一个视角', text: '以同一个问题抽一张牌，对照两种启发' },
  ],
}

export default function NextJourney({ from }: { from: keyof typeof OPTIONS }) {
  return (
    <aside className="next-journey" aria-labelledby={`next-journey-${from}`}>
      <div className="next-journey__head">
        <p className="next-journey__eyebrow">结果不是终点</p>
        <h2 id={`next-journey-${from}`}>接下来，你想把这份启发带去哪里？</h2>
      </div>
      <div className="next-journey__grid">
        {OPTIONS[from].map((option) => {
          const feature = APP_FEATURES.find((item) => item.page === option.page)!
          return (
            <button key={option.page} type="button" onClick={() => navigateToFeature(option.page)}>
              <span className="next-journey__icon" aria-hidden><FeatureIcon page={option.page} size="sm" /></span>
              <span><strong>{option.title}</strong><small>{option.text}</small></span>
              <span aria-hidden>→</span>
              <span className="sr-only">前往{feature.name}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
