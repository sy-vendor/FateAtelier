import { BAGUA, FENGSHUI_BRAND, FENGSHUI_BRAND_EN, FENGSHUI_PURPOSES } from '../../utils/fengshuiData'
import { DIRECTION_GRID, useFengshuiGame } from '../../hooks/useFengshuiGame'
import { FengshuiLogoMark } from '../fengshui/FengshuiLogoMark'
import { FengshuiRitualBar } from '../fengshui/FengshuiRitualBar'
import { Panel, Button, ChipGrid, MetaList } from '../ui'
import './picker-tools-stage.css'

function statusLabel(status: 'auspicious' | 'inauspicious' | 'neutral'): string {
  if (status === 'auspicious') return '吉'
  if (status === 'inauspicious') return '凶'
  return '平'
}

function FengshuiMainView() {
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
          <p className="picker-hero__brand">{FENGSHUI_BRAND}</p>
          <p className="picker-hero__brand-en">{FENGSHUI_BRAND_EN}</p>
          <p className="picker-hero__hint">八方定局，一指点向，察今日五行生克吉凶</p>
        </div>
      </header>

      <FengshuiRitualBar step={ritualStep} />

      <section className="picker-section">
        <h2 className="picker-section__title">用途推荐</h2>
        <p className="picker-section__sub">选择行事目的，自动高亮适宜方位</p>
        <ChipGrid
          wide
          items={FENGSHUI_PURPOSES.map((p) => ({ id: p, label: p }))}
          value={selectedPurpose}
          onChange={selectPurpose}
        />
      </section>

      <section className="picker-section fengshui-compass-section">
        <div className="fengshui-compass-head">
          <h2 className="picker-section__title">八方罗盘</h2>
          <p className="picker-section__sub">点击方位查看八卦与今日吉凶</p>
        </div>

        <div className="fengshui-octagon" role="group" aria-label="八方方位选择">
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
                  {statusLabel(status)}
                </span>
                <span className="fengshui-dir__name">{dir.name}</span>
                <span className="fengshui-dir__gua">{gua?.name ?? dir.symbol}</span>
                <span className="fengshui-dir__wuxing">{dir.wuxing}</span>
              </button>
            )
          })}

          <div className="fengshui-octagon__hub" style={{ gridArea: 'hub' }} aria-hidden>
            <FengshuiLogoMark size="lg" />
            <span className="fengshui-octagon__hub-label">罗盘</span>
          </div>
        </div>

        <div className="fengshui-legend">
          <span className="fengshui-legend__item">
            <span className="fengshui-legend__dot fengshui-legend__dot--good" />吉方
          </span>
          <span className="fengshui-legend__item">
            <span className="fengshui-legend__dot fengshui-legend__dot--bad" />凶方
          </span>
          <span className="fengshui-legend__item">
            <span className="fengshui-legend__dot fengshui-legend__dot--flat" />平方
          </span>
        </div>

        <Button variant="ghost" block onClick={resetCompass}>
          重置选择
        </Button>
      </section>

      <Panel title="今日方位总览">
        <MetaList
          rows={[
            { key: '吉方', value: todayDirections.auspicious.join('、') || '无' },
            { key: '凶方', value: todayDirections.inauspicious.join('、') || '无' },
            { key: '平方', value: todayDirections.neutral.join('、') || '无' },
          ]}
        />
      </Panel>

      {interpretation && (
        <Panel title={`${interpretation.direction} · 方位详解`}>
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
              {interpretation.auspicious ? '吉' : interpretation.inauspicious ? '凶' : '平'}
            </span>
          </div>
          <MetaList
            rows={[
              { key: '适合', value: interpretation.suitableFor.join('、') },
            ]}
          />
          <p className="callout">{interpretation.advice}</p>
        </Panel>
      )}

      {!interpretation && (
        <section className="picker-shrine" aria-hidden>
          <span className="picker-shrine__glyph">方</span>
          <p className="picker-shrine__hint">点选八方之一，八卦释义与吉凶自现</p>
        </section>
      )}
    </div>
  )
}

export default FengshuiMainView
