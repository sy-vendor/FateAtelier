import { useState } from 'react'
import './HelpGuide.css'

function HelpGuide() {
  const [showGuide, setShowGuide] = useState(false)

  if (!showGuide) {
    return (
      <button className="help-toggle" onClick={() => setShowGuide(true)}>
        ❓ 使用指南
      </button>
    )
  }

  return (
    <div className="help-guide-overlay" onClick={() => setShowGuide(false)}>
      <div className="help-guide" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>📖 使用指南</h2>
          <button className="close-help" onClick={() => setShowGuide(false)}>✕</button>
        </div>

        <div className="help-content">
          <section className="help-section">
            <h3>🏠 首页入口</h3>
            <p>首页轮播中每个图标对应一个功能（塔罗、取名、星座、黄历、抽签等），点击即可进入；进入后按页面提示操作即可。</p>
          </section>
          <section className="help-section">
            <h3>🎴 单牌占卜</h3>
            <p>点击"抽取一张牌"按钮，随机抽取一张塔罗牌。每张牌都有正位和逆位两种含义，点击卡片可以翻转查看。</p>
          </section>

          <section className="help-section">
            <h3>🔮 三牌占卜</h3>
            <p>点击"三牌占卜"按钮，一次性抽取三张牌，分别代表过去、现在和未来。系统会自动生成综合解读，帮助你理解牌面的整体含义。</p>
          </section>

          <section className="help-section">
            <h3>📚 浏览牌面</h3>
            <p>点击"浏览所有牌面"可以查看所有78张塔罗牌的详细信息，支持搜索和筛选功能。</p>
          </section>

          <section className="help-section">
            <h3>💡 使用技巧</h3>
            <ul>
              <li>在占卜前，可以先静心思考你的问题</li>
              <li>正位和逆位都有其独特含义，不要忽视任何一张牌</li>
              <li>三牌占卜的综合解读可以帮助你更好地理解整体趋势</li>
              <li>占卜结果仅供参考，最终的选择权在你手中</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>📜 占卜历史</h3>
            <p>你的所有占卜记录都会自动保存，方便你回顾和对比不同时期的占卜结果。</p>
          </section>

          <section className="help-section">
            <h3>⚠️ 注意事项</h3>
            <p>塔罗牌占卜仅供娱乐和参考，不应作为重要决策的唯一依据。保持开放的心态，但也要理性思考。</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HelpGuide

