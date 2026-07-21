import { BAGUA, FENGSHUI_BRAND, FENGSHUI_BRAND_EN, FENGSHUI_PURPOSES } from '../../utils/fengshuiData'
import { DIRECTION_GRID, useFengshuiGame } from '../../hooks/useFengshuiGame'
import { FengshuiLogoMark } from '../fengshui/FengshuiLogoMark'
import { FengshuiRitualBar } from '../fengshui/FengshuiRitualBar'
import { Panel, Button, ChipGrid, MetaList } from '../ui'
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './picker-tools-stage.css'

function statusLabel(
  status: 'auspicious' | 'inauspicious' | 'neutral',
  tx: (zh: string, en: string) => string,
): string {
  if (status === 'auspicious') return tx('吉', 'Good')
  if (status === 'inauspicious') return tx('凶', 'Bad')
  return tx('平', 'Neutral')
}

const PURPOSE_EN: Record<string, string> = {
  事业: 'Career',
  财运: 'Wealth',
  学业: 'Study',
  健康: 'Health',
  感情: 'Love',
  搬家: 'Moving',
  开业: 'Business',
  出行: 'Travel',
}

function FengshuiMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
  const {
    selectedDirection,
    selectedPurpose,
    todayDirections,
    interpretation,
    ritualStep,
    selectDirection,
    resetCompass,
    selectPurpose,
    getDirectionStatus,
    directions,
  } = useFengshuiGame()

  return (
    <div className="picker-stage picker-stage--fengshui">
      <header className="picker-hero">
        <div className="picker-hero__mark">
          <FengshuiLogoMark size="lg" />
        </div>
        <div>
          <p className="picker-hero__brand">{tx(FENGSHUI_BRAND, FENGSHUI_BRAND_EN)}</p>
          <p className="picker-hero__brand-en">{isEnglish ? FENGSHUI_BRAND_EN.toUpperCase() : FENGSHUI_BRAND_EN}</p>
          <p className="picker-hero__hint">{tx('八方定局，一指点向，察今日五行生克吉凶', 'Eight directions set the frame; one tap reveals today\'s elemental balance')}</p>
        </div>
      </header>

      <FengshuiRitualBar step={ritualStep} />

      <section className="picker-section">
        <h2 className="picker-section__title">{tx('用途推荐', 'Purpose')}</h2>
        <p className="picker-section__sub">{tx('选择行事目的，自动高亮适宜方位', 'Choose your goal to highlight suitable directions')}</p>
        <ChipGrid
          wide
          items={FENGSHUI_PURPOSES.map((p) => ({
            id: p,
            label: tx(p, PURPOSE_EN[p] ?? p),
          }))}
          value={selectedPurpose}
          onChange={selectPurpose}
        />
      </section>

      <section className="picker-section fengshui-compass-section">
        <div className="fengshui-compass-head">
          <h2 className="picker-section__title">{tx('八方罗盘', 'Eight-direction compass')}</h2>
          <p className="picker-section__sub">{tx('点击方位查看八卦与今日吉凶', 'Tap a direction to view trigrams and today\'s fortune')}</p>
        </div>

        <div className="fengshui-octagon" role="group" aria-label={tx('八方方位选择', 'Direction selection')}>
          {directions.map((dir) => {
            const status = getDirectionStatus(dir.name)
            const isSelected = selectedDirection === dir.name
            const gua = BAGUA[dir.symbol as keyof typeof BAGUA]
            const gridArea = DIRECTION_GRID[dir.name]

            return (
              <button
                key={dir.name}
                type="button"
                className={[
                  'fengshui-dir',
                  `fengshui-dir--${status}`,
                  isSelected ? 'fengshui-dir--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ gridArea }}
                onClick={() => selectDirection(dir.name)}
                aria-pressed={isSelected}
              >
                <span className={`fengshui-dir__badge fengshui-dir__badge--${status}`}>
                  {statusLabel(status, tx)}
                </span>
                <span className="fengshui-dir__name">{dir.name}</span>
                <span className="fengshui-dir__gua">{gua?.name ?? dir.symbol}</span>
                <span className="fengshui-dir__wuxing">{dir.wuxing}</span>
              </button>
            )
          })}

          <div className="fengshui-octagon__hub" style={{ gridArea: 'hub' }} aria-hidden>
            <FengshuiLogoMark size="lg" />
            <span className="fengshui-octagon__hub-label">{tx('罗盘', 'Compass')}</span>
          </div>
        </div>

        <div className="fengshui-legend">
          <span className="fengshui-legend__item">
            <span className="fengshui-legend__dot fengshui-legend__dot--good" />
            {tx('吉方', 'Auspicious')}
          </span>
          <span className="fengshui-legend__item">
            <span className="fengshui-legend__dot fengshui-legend__dot--bad" />
            {tx('凶方', 'Inauspicious')}
          </span>
          <span className="fengshui-legend__item">
            <span className="fengshui-legend__dot fengshui-legend__dot--flat" />
            {tx('平方', 'Neutral')}
          </span>
        </div>

        <Button variant="ghost" block onClick={resetCompass}>
          {tx('重置选择', 'Reset selection')}
        </Button>
      </section>

      <Panel title={tx('今日方位总览', 'Today\'s directions')}>
        <MetaList
          rows={[
            { key: tx('吉方', 'Auspicious'), value: todayDirections.auspicious.join('、') || tx('无', 'None') },
            { key: tx('凶方', 'Inauspicious'), value: todayDirections.inauspicious.join('、') || tx('无', 'None') },
            { key: tx('平方', 'Neutral'), value: todayDirections.neutral.join('、') || tx('无', 'None') },
          ]}
        />
      </Panel>

      {interpretation && (
        <Panel title={`${interpretation.direction} · ${tx('方位详解', 'Direction details')}`}>
          <div className="fengshui-insight-banner">
            <div className="fengshui-insight-banner__gua">{interpretation.symbol}</div>
            <div>
              <p className="fengshui-insight-banner__title">
                {interpretation.guaInfo?.nature} · {interpretation.wuxing}
              </p>
              <p className="fengshui-insight-banner__sub">{interpretation.guaInfo?.meaning}</p>
            </div>
            <span
              className={[
                'tag',
                interpretation.auspicious
                  ? 'tag--good'
                  : interpretation.inauspicious
                    ? 'tag--bad'
                    : 'tag--muted',
              ].join(' ')}
            >
              {interpretation.auspicious ? tx('吉', 'Good') : interpretation.inauspicious ? tx('凶', 'Bad') : tx('平', 'Neutral')}
            </span>
          </div>
          <MetaList
            rows={[
              { key: tx('适合', 'Suitable for'), value: interpretation.suitableFor.join('、') },
            ]}
          />
          <p className="callout">{interpretation.advice}</p>
        </Panel>
      )}

      {!interpretation && (
        <section className="picker-shrine" aria-hidden>
          <span className="picker-shrine__glyph">方</span>
          <p className="picker-shrine__hint">{tx('点选八方之一，八卦释义与吉凶自现', 'Select a direction to reveal trigram meaning and fortune')}</p>
        </section>
      )}
    </div>
  )
}

export default FengshuiMainView
