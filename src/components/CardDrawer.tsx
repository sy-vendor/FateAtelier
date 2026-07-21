import { useTx } from '../i18n/useTx'
import { Panel, Button } from './ui'
import { TarotSpreadIcon } from './tarot/TarotLogoMark'

interface CardDrawerProps {
  onDrawCard: () => void
  onDrawThree: () => void
  onReset: () => void
  drawnCount: number
}

function CardDrawer({ onDrawCard, onDrawThree, onReset, drawnCount }: CardDrawerProps) {
  const tx = useTx()
  const progress = Math.round((drawnCount / 78) * 100)

  return (
    <Panel title={tx('选择牌阵', 'Choose a Spread')} description={tx('选定玩法后，进入抽牌仪式', 'Pick a spread, then begin the draw')}>
      <div className="spread-grid">
        <button type="button" className="spread-card spread-card--primary" onClick={onDrawCard}>
          <span className="spread-card__icon-wrap">
            <TarotSpreadIcon variant="single" />
          </span>
          <p className="spread-card__title">{tx('单牌洞察', 'Single Card')}</p>
          <p className="spread-card__desc">{tx('聚焦一个问题，适合即时决策与每日复盘。', 'Focus on one question — ideal for quick decisions and daily reflection.')}</p>
          <span className="spread-card__tag">{tx('1 张', '1 card')}</span>
        </button>

        <button type="button" className="spread-card" onClick={onDrawThree}>
          <span className="spread-card__icon-wrap">
            <TarotSpreadIcon variant="three" />
          </span>
          <p className="spread-card__title">{tx('三牌时空', 'Three-Card Spread')}</p>
          <p className="spread-card__desc">{tx('过去 · 现在 · 未来，看清趋势与转折。', 'Past · Present · Future — see the trend and turning points.')}</p>
          <span className="spread-card__tag">{tx('3 张', '3 cards')}</span>
        </button>
      </div>

      <div className="spread-deck-status">
        <div className="spread-deck-status__row">
          <span className="spread-deck-status__label">{tx('牌堆余量', 'Cards remaining')}</span>
          <span className="spread-deck-status__value">
            {78 - drawnCount} / 78
          </span>
        </div>
        <div className="spread-deck-status__bar" aria-hidden>
          <span className="spread-deck-status__fill" style={{ width: `${progress}%` }} />
        </div>
        {drawnCount > 0 && (
          <Button variant="ghost" small onClick={onReset}>
            {tx('清空牌阵', 'Clear spread')}
          </Button>
        )}
      </div>

      <p className="tarot-tip callout">
        {tx('点击牌面可翻转查看正逆位。建议先静心，再开始抽牌。', 'Tap a card to flip between upright and reversed. Center yourself before drawing.')}
      </p>
    </Panel>
  )
}

export default CardDrawer
