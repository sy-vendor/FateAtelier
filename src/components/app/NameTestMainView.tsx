import { NAME_TEST_BRAND, NAME_TEST_BRAND_EN } from '../../utils/nameTestData'
import { getGridLevel } from '../../utils/nameTestEngine'
import { useNameTestGame } from '../../hooks/useNameTestGame'
import { NameTestLogoMark } from '../nametest/NameTestLogoMark'
import { NameTestRitualBar } from '../nametest/NameTestRitualBar'
import { Panel, Button, AspectGrid } from '../ui'
import './fortune-tools-stage.css'

function NameTestMainView() {
  const {
    surname,
    givenName,
    onSurnameChange,
    onGivenNameChange,
    ritualStep,
    inputError,
    result,
    insightRef,
    testName,
  } = useNameTestGame()

  return (
    <div className="tools-stage tools-stage--nametest">
      <header className="tools-hero">
        <div className="tools-hero__mark"><NameTestLogoMark size="lg" /></div>
        <div>
          <p className="tools-hero__brand">{NAME_TEST_BRAND}</p>
          <p className="tools-hero__brand-en">{NAME_TEST_BRAND_EN}</p>
          <p className="tools-hero__hint">五格数理合三才，鉴姓名吉凶与气运</p>
        </div>
      </header>

      <NameTestRitualBar step={ritualStep} />

      <section className="tools-form">
        <h2 className="tools-form__title">输入姓名</h2>
        <div className="field">
          <label className="field__label" htmlFor="nametest-surname">姓氏</label>
          <input
            id="nametest-surname"
            type="text"
            className="field__input"
            value={surname}
            onChange={(e) => onSurnameChange(e.target.value)}
            placeholder="请输入姓氏"
            maxLength={4}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="nametest-given">名字</label>
          <input
            id="nametest-given"
            type="text"
            className="field__input"
            value={givenName}
            onChange={(e) => onGivenNameChange(e.target.value)}
            placeholder="请输入名字"
            maxLength={4}
          />
        </div>
        {inputError && <p className="tools-input-error" role="alert">{inputError}</p>}
        <Button variant="primary" block onClick={testName} disabled={!surname.trim() || !givenName.trim()}>
          开始鉴名
        </Button>
      </section>

      {!result && (
        <section className="tools-shrine" aria-hidden>
          <span className="tools-shrine__glyph">名</span>
          <p className="tools-shrine__hint">名载气运，笔画成格，待书而鉴</p>
        </section>
      )}

      {result && (
        <section ref={insightRef} className="tools-insight" aria-label="姓名测评">
          <div className="tools-insight__banner">
            <div className="tools-insight__icon" aria-hidden>鉴</div>
            <div>
              <h2 className="tools-insight__title">{surname}{givenName}</h2>
              <p className="tools-insight__sub">三才 {result.wuxing.tian}{result.wuxing.ren}{result.wuxing.di}</p>
            </div>
            <span className="tools-score-ring">{result.score}</span>
          </div>

          <Panel title="五格数理">
            <AspectGrid
              items={[
                { title: '天格', score: result.grids.tianGe, text: `${result.wuxing.tian} · ${getGridLevel(result.grids.tianGe)}` },
                { title: '人格', score: result.grids.renGe, text: `${result.wuxing.ren} · ${getGridLevel(result.grids.renGe)}` },
                { title: '地格', score: result.grids.diGe, text: `${result.wuxing.di} · ${getGridLevel(result.grids.diGe)}` },
                { title: '外格', score: result.grids.waiGe, text: `${result.wuxing.wai} · ${getGridLevel(result.grids.waiGe)}` },
                { title: '总格', score: result.grids.zongGe, text: `${result.wuxing.zong} · ${getGridLevel(result.grids.zongGe)}` },
              ]}
            />
          </Panel>

          <Panel title="三才配置">
            <p className="callout">{result.sancai}</p>
          </Panel>

          <Panel title="详细分析">
            <pre className="prose" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result.analysis}</pre>
          </Panel>
        </section>
      )}
    </div>
  )
}

export default NameTestMainView
