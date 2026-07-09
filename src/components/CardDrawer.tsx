import { Panel, Button } from './ui'
import { TarotSpreadIcon } from './tarot/TarotLogoMark'

interface CardDrawerProps {
  onDrawCard: () => void
  onDrawThree: () => void
  onReset: () => void
  drawnCount: number
}

function CardDrawer({ onDrawCard, onDrawThree, onReset, drawnCount }: CardDrawerProps) {
  const progress = Math.round((drawnCount / 78) * 100)

  return (
    <Panel title="选择牌阵" description="选定玩法后，进入抽牌仪式">
      <div className="spread-grid">
        <button type="button" className="spread-card spread-card--primary" onClick={onDrawCard}>
          <span className="spread-card__icon-wrap">
            <TarotSpreadIcon variant="single" />
          </span>
          <p className="spread-card__title">单牌洞察</p>
          <p className="spread-card__desc">聚焦一个问题，适合即时决策与每日复盘。</p>
          <span className="spread-card__tag">1 张</span>
        </button>

        <button type="button" className="spread-card" onClick={onDrawThree}>
          <span className="spread-card__icon-wrap">
            <TarotSpreadIcon variant="three" />
          </span>
          <p className="spread-card__title">三牌时空</p>
          <p className="spread-card__desc">过去 · 现在 · 未来，看清趋势与转折。</p>
          <span className="spread-card__tag">3 张</span>
        </button>
      </div>

      <div className="spread-deck-status">
        <div className="spread-deck-status__row">
          <span className="spread-deck-status__label">牌堆余量</span>
          <span className="spread-deck-status__value">
            {78 - drawnCount} / 78
          </span>
        </div>
        <div className="spread-deck-status__bar" aria-hidden>
          <span className="spread-deck-status__fill" style={{ width: `${progress}%` }} />
        </div>
        {drawnCount > 0 && (
          <Button variant="ghost" small onClick={onReset}>
            清空牌阵
          </Button>
        )}
      </div>

      <p className="tarot-tip callout">
        点击牌面可翻转查看正逆位。建议先静心，再开始抽牌。
      </p>
    </Panel>
  )
}

export default CardDrawer
