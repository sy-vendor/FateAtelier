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
import { useLocale } from '../../i18n/LocaleContext'
import { useTx } from '../../i18n/useTx'
import './fortune-tools-stage.css'

function ShengxiaoMainView() {
  const tx = useTx()
  const { isEnglish } = useLocale()
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
          <p className="tools-hero__brand">{tx(SHENGXIAO_BRAND, SHENGXIAO_BRAND_EN)}</p>
          <p className="tools-hero__brand-en">{isEnglish ? SHENGXIAO_BRAND_EN.toUpperCase() : SHENGXIAO_BRAND_EN}</p>
          <p className="tools-hero__hint">{tx('十二属相合参，察六合冲害以论缘分', 'Compare the twelve zodiac signs to read harmony and conflict')}</p>
        </div>
      </header>

      <ShengxiaoRitualBar step={ritualStep} />

      <section className="tools-form">
        <h2 className="tools-form__title">{tx('选择生肖', 'Choose zodiac signs')}</h2>
        <div className="field">
          <span className="field__label">{tx('甲方生肖', 'First sign')}</span>
          <ChipGrid zodiac items={shengxiaoChips} value={shengxiao1} onChange={selectFirst} />
        </div>
        <div className="field">
          <span className="field__label">{tx('乙方生肖', 'Second sign')}</span>
          <ChipGrid zodiac items={shengxiaoChips} value={shengxiao2} onChange={selectSecond} />
        </div>
        {inputError && <p className="tools-input-error" role="alert">{inputError}</p>}
        <Button variant="primary" block onClick={handlePairing} disabled={!shengxiao1 || !shengxiao2}>
          {tx('开始合参', 'Start pairing')}
        </Button>
      </section>

      <section className="tools-shrine" aria-label={tx('生肖合参', 'Zodiac pairing')}>
        <div className="tools-zodiac-pair">
          <span>{shengxiao1 || '？'}</span>
          <span className="tools-zodiac-pair__link">{tx('缘', 'Bond')}</span>
          <span>{shengxiao2 || '？'}</span>
        </div>
        <p className="tools-shrine__hint">{tx('子丑六合、子午相冲，合参可知缘分深浅', 'Harmony and clash patterns reveal the depth of your bond')}</p>
      </section>

      {result && (
        <section ref={insightRef} className="tools-insight" aria-label={tx('配对结果', 'Pairing result')}>
          <div className="tools-insight__banner">
            <div className="tools-insight__icon" aria-hidden>配</div>
            <div>
              <h2 className="tools-insight__title">{shengxiao1} × {shengxiao2}</h2>
              <p className="tools-insight__sub">
                {tx('契合度', 'Compatibility')}{' '}
                <span className={compatTagClass(result.compatibility)}>{result.compatibility}</span>
              </p>
            </div>
            <span className="tools-score-ring">{result.score}</span>
          </div>

          <Panel title={tx('配对关系', 'Pairing dynamics')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {result.relationships.map((rel) => (
                <span key={rel} className={relTagClass(rel)}>{rel}</span>
              ))}
            </div>
            <p className="prose">{result.analysis}</p>
          </Panel>

          <Panel title={tx('关系说明', 'Relationship guide')}>
            <ul className="tools-tips">
              <li>{tx('六合：最佳配对，和谐互补', 'Six Harmonies: best match, harmonious and complementary')}</li>
              <li>{tx('三合：良好配对，互相支持', 'Three Harmonies: good match, mutually supportive')}</li>
              <li>{tx('六冲：对立冲突，需要包容', 'Six Clashes: opposing forces, patience required')}</li>
              <li>{tx('六害：相互伤害，需要磨合', 'Six Harms: friction, needs adjustment')}</li>
              <li>{tx('三刑：相互制约，需要理解', 'Three Punishments: mutual restraint, understanding needed')}</li>
            </ul>
          </Panel>
        </section>
      )}
    </div>
  )
}

export default ShengxiaoMainView
