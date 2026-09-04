# 命运工坊 · Fate Atelier

免费、无广告、无需注册的综合占卜与命理 Web 应用：塔罗、抽签、解梦、星座黄历、八字紫微等 **15** 种玩法，支持中英双语与可抓取的静态 SEO 页。

> 仅供娱乐与传统文化体验，不作为医疗、法律、金融或其他重要决策依据。

[在线体验](https://www.fateatelier.cloud/) · [English](https://www.fateatelier.cloud/en) · [部署指南](./DEPLOY.md) · [License](./LICENSE)

## 功能一览

| 分类 | 功能 |
| --- | --- |
| 每日灵感 | 星座运势、今日黄历、每日幸运色 |
| 占卜问事 | 塔罗、抽签求签、梦境解析、奇门遁甲 |
| 命理测算 | 八字、紫微斗数、姓名测试、生肖配对 |
| 择吉工具 | 择日吉时、数字能量、风水罗盘 |
| 趣味修行 | 赛博积德 |

**塔罗**：78 张牌组；每日一牌 / 单牌 / 三牌时空；正逆位与关联解读；牌库、收藏、历史（本地、有上限）、导出与分享。

**抽签**：100 签；分类侧重解签；摇一摇；收藏与历史（存签号，回看时再解析）。

**解梦**：多类梦象 + 情绪微调；组合解读；本地历史（内容与情绪，回看时重解）。

## 产品特点

- **免费无广告**：主要功能可直接使用，无需账号
- **中英双语**：路径 `/` 与 `/en/*`，构建期生成 hreflang 与双语落地页
- **本地轻量数据**：历史、收藏、连续到访等保存在浏览器 `localStorage`（塔罗 / 抽签 / 解梦历史已瘦身并设上限）
- **今日探索与结果续玩**：每日任务与玩法间推荐跳转
- **按路由分包**：英文牌库 / 签文 / 梦象按需加载，避免一次下载全部数据

## SEO

`npm run build` 在 Vite 打包后会跑 `scripts/build-seo-pages.mjs` 与校验：

- 15 个中文 + 15 个英文功能落地页（介绍、玩法、步骤、FAQ、HowTo / FAQ JSON-LD）
- 塔罗牌义、梦象、签文详情的中英双语页
- 汇总进 `dist/sitemap.xml`（含 `xhtml:link` 语言对照）
- 强调免费、无广告、无需注册的差异化文案

入口示例：`/tarot`、`/en/tarot`、`/tarot/card/0`、`/dream/symbol/0`、`/divination/stick/1`

文案维护：`scripts/seo-feature-copy.mjs`。

## 技术栈

- React 18 · TypeScript · Vite 5
- 原生 CSS（Design Tokens）· Vercel Analytics
- 无后端数据库：演算与数据在浏览器内完成
- Web Storage / Web Share / Device Motion（摇签）

玩法结构大致为：**懒加载 MainView → `use*Game` hook → engine/data → 共用 `RitualBar` 等 UI**。

## 快速开始

需要 Node.js 18+、npm 9+。

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc → vite → SEO 生成 → verify
npm run preview
npm run lint
```

### 数据再生成（可选）

优先改 `scripts/*-polish/` 源数据，再生成 `src/data/`：

```bash
npm run build:tarot
npm run build:dream
npm run build:sticks
npm run build:sticks-en
npm run build:tarot-images
```

英文塔罗 / 梦象另有 `scripts/build-tarot-en.mjs`、`scripts/build-dream-en.mjs`（按需直接 `node` 运行）。

## 目录结构

```text
FateAtelier/
├── public/                 # robots、基础 sitemap、图标、PWA
├── scripts/                # 数据生成、SEO 构建与校验
├── src/
│   ├── components/
│   │   ├── app/            # 各玩法主视图与舞台样式
│   │   ├── */              # 玩法专属组件（含 RitualBar 包装）
│   │   └── ui/             # 共用 UI（含 RitualBar）
│   ├── constants/          # 功能注册
│   ├── data/               # 生成后的占卜数据
│   ├── hooks/              # use*Game 状态与交互
│   ├── i18n/               # 语言、路径、英文数据包
│   ├── styles/
│   ├── types/
│   └── utils/              # 引擎、存储、分享、导出
├── index.html
├── vercel.json
└── package.json
```

## 部署

线上以 **Vercel** 为主（`www.fateatelier.cloud`）：

| 项 | 值 |
| --- | --- |
| Build | `npm run build` |
| Output | `dist` |

推送 `main` 即自动部署。更多平台说明见 [DEPLOY.md](./DEPLOY.md)。

上线后可抽查：`/robots.txt`、`/sitemap.xml`、`/tarot`、`/en/tarot`。

## 隐私

- 多数输入仅在当前浏览器处理
- 历史与收藏在本地存储；清除站点数据会一并删除
- 勿将搜索引擎验证码、密钥等凭证提交进仓库

## 贡献

1. Fork 并创建分支  
2. 改代码或对应 polish 源数据  
3. `npm run lint` 与 `npm run build`  
4. 开 PR，说明功能 / 界面 / 文案变化  

## License

见 [LICENSE](./LICENSE)。
