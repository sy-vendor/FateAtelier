import {
  SHENGXIAO_BRAND,
  SHENGXIAO_BRAND_EN,
  compatTagClass,
  relTagClass,
} from '../../utils/shengxiaoData'
import { useShengxiaoGame } from '../../hooks/useShengxiaoGame'
import { ShengxiaoLogoMark } from '../shengxiao/ShengxiaoLogoMark'
import { ShengxiaoRitualBar } from '../shengxiao/ShengxiaoRitualBar'
import { Panel, Button, ChipGrid } from '../ui'
import './fortune-tools-stage.css'

function ShengxiaoMainView() {
  const {
    shengxiao1,
    shengxiao2,
    selectFirst,
    selectSecond,
    ritualStep,
    inputError,
    result,
    insightRef,
    handlePairing,
    shengxiaoChips,
  } = useShengxiaoGame()

  return (
    <div className="tools-stage tools-stage--shengxiao">
      <header className="tools-hero">
        <div className="tools-hero__mark"><ShengxiaoLogoMark size="lg" /></div>
        <div>
          <p className="tools-hero__brand">{SHENGXIAO_BRAND}</p>
          <p className="tools-hero__brand-en">{SHENGXIAO_BRAND_EN}</p>
          <p className="tools-hero__hint">十二属相合参，察六合冲害以论缘分</p>
        </div>
      </header>

      <ShengxiaoRitualBar step={ritualStep} />

      <section className="tools-form">
        <h2 className="tools-form__title">选择生肖</h2>
        <div className="field">
          <span className="field__label">甲方生肖</span>
          <ChipGrid zodiac items={shengxiaoChips} value={shengxiao1} onChange={selectFirst} />
        </div>
        <div className="field">
          <span className="field__label">乙方生肖</span>
          <ChipGrid zodiac items={shengxiaoChips} value={shengxiao2} onChange={selectSecond} />
        </div>
        {inputError && <p className="tools-input-error" role="alert">{inputError}</p>}
        <Button variant="primary" block onClick={handlePairing} disabled={!shengxiao1 || !shengxiao2}>
          开始合参
        </Button>
      </section>

      <section className="tools-shrine" aria-label="生肖合参">
        <div className="tools-zodiac-pair">
          <span>{shengxiao1 || '？'}</span>
          <span className="tools-zodiac-pair__link">缘</span>
          <span>{shengxiao2 || '？'}</span>
        </div>
        <p className="tools-shrine__hint">子丑六合、子午相冲，合参可知缘分深浅</p>
      </section>

      {result && (
        <section ref={insightRef} className="tools-insight" aria-label="配对结果">
          <div className="tools-insight__banner">
            <div className="tools-insight__icon" aria-hidden>配</div>
            <div>
              <h2 className="tools-insight__title">{shengxiao1} × {shengxiao2}</h2>
              <p className="tools-insight__sub">
                契合度 <span className={compatTagClass(result.compatibility)}>{result.compatibility}</span>
              </p>
            </div>
            <span className="tools-score-ring">{result.score}</span>
          </div>

          <Panel title="配对关系">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {result.relationships.map((rel) => (
                <span key={rel} className={relTagClass(rel)}>{rel}</span>
              ))}
            </div>
            <p className="prose">{result.analysis}</p>
          </Panel>

          <Panel title="关系说明">
            <ul className="tools-tips">
              <li>六合：最佳配对，和谐互补</li>
              <li>三合：良好配对，互相支持</li>
              <li>六冲：对立冲突，需要包容</li>
              <li>六害：相互伤害，需要磨合</li>
              <li>三刑：相互制约，需要理解</li>
            </ul>
          </Panel>
        </section>
      )}
    </div>
  )
}

export default ShengxiaoMainView
