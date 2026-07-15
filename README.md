# 命运工坊 Fate Atelier

一个融合塔罗、传统民俗与趣味心理解读的综合互动 Web 应用。项目包含 15 种玩法，支持响应式布局、本地历史记录、每日探索、结果续玩与静态 SEO 内容页。

> 项目内容仅供娱乐和传统文化体验，不应作为医疗、法律、金融或其他重要决策的依据。

[在线体验](https://www.fateatelier.cloud/) · [部署指南](./DEPLOY.md) · [License](./LICENSE)

## 功能概览

| 分类 | 功能 | 主要能力 |
| --- | --- | --- |
| 每日灵感 | 星座运势、今日黄历、每日幸运色 | 每日趋势、农历宜忌、配色灵感 |
| 占卜问事 | 塔罗占卜、抽签求签、梦境解析、奇门遁甲 | 抽牌、百签解读、梦象串联、九宫排盘 |
| 命理测算 | 八字、紫微斗数、姓名测试、生肖配对 | 四柱五行、十二宫、五格数理、合冲关系 |
| 择吉工具 | 择日吉时、数字能量、风水罗盘 | 日期筛选、数字解读、方位参考 |
| 趣味修行 | 赛博积德 | 木鱼、上香、放生与功德记录 |

### 塔罗占卜

- 78 张完整牌组：22 张大阿卡纳与 56 张小阿卡纳
- 单牌、每日一牌和“过去 · 现在 · 未来”三牌阵
- 正位、逆位、分类牌义与三牌关联解读
- 牌库、收藏、历史记录、统计、导出和分享

### 梦境解析

- 支持人物、动物、自然、建筑、物品和动作等梦象
- 根据梦中情绪调整解读倾向
- 组合多个符号，生成主题脉络、符号串联和梦后反思
- 本地保存最近的梦境解析记录

### 抽签求签

- 100 支签文、白话签诗、典故与行事建议
- 按事业、感情、财运、健康和出行侧重解签
- 支持手机摇一摇、收藏、历史、搜索、复制和分享

## 留存与交互设计

- **今日探索**：每天生成三项不同方向的体验任务
- **连续到访**：在本地记录连续使用天数和当日进度
- **结果续玩**：塔罗、梦境和求签结果会提供有语义的下一步推荐
- **轻量数据**：历史、收藏与进度默认保存在浏览器 `localStorage`
- **无账号门槛**：所有主要功能均可直接使用

## SEO 与性能

生产构建会在 Vite 打包完成后运行 `scripts/build-seo-pages.mjs`：

- 为 15 个功能生成可直接抓取的 HTML 入口
- 生成 78 个塔罗牌义页、56 个梦象页和 100 个签文详情页
- 为详情页设置独立 title、description、canonical 和 JSON-LD
- 构建时将长尾页加入 `dist/sitemap.xml`
- 按功能路由分包，避免访问一项工具时下载全部业务数据
- 在移动端和减少动态效果模式下降低持续动画开销

SEO 入口示例：

```text
/tarot
/tarot/card/0
/dream/symbol/0
/divination/stick/1
```

## 技术栈

- React 18
- TypeScript
- Vite 5
- CSS Design Tokens + 原生 CSS
- Vercel Analytics
- Web Storage、Web Share 和 Device Motion API

项目不依赖后端数据库，占卜数据和大部分计算都在浏览器内完成。

## 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装与开发

```bash
npm install
npm run dev
```

开发服务默认运行在 `http://localhost:5173`。

### 生产构建

```bash
npm run build
npm run preview
```

`npm run build` 会依次执行 TypeScript 检查、Vite 打包和 SEO 页生成。产物位于 `dist/`。

### 数据再生成

```bash
npm run build:tarot
npm run build:dream
npm run build:sticks
```

这些命令会根据 `scripts/*-polish/` 中的维护数据重建 `src/data/` 下的生成文件。请优先修改源数据，避免下次生成时丢失改动。

### 代码检查

```bash
npm run lint
```

## 项目结构

```text
FateAtelier/
├── public/                   # robots.txt、基础 sitemap、图标与 PWA 文件
├── scripts/                  # 卡牌、梦象、签文与 SEO 页生成器
├── src/
│   ├── components/
│   │   ├── app/             # 应用外壳与各功能主视图
│   │   ├── tarot/          # 塔罗视觉与牌库组件
│   │   └── ui/             # 通用 UI 原语
│   ├── constants/         # 功能注册与导航分组
│   ├── data/              # 生成后的占卜与命理数据
│   ├── hooks/             # 独立玩法状态与交互逻辑
│   ├── styles/            # Design Tokens 与通用样式
│   ├── types/             # TypeScript 类型
│   └── utils/             # 算法、内容组合、存储、分享与导出
├── index.html
├── vite.config.ts
├── vercel.json
└── package.json
```

## 部署

项目已包含 Vercel 配置：

```text
Build Command: npm run build
Output Directory: dist
```

`vercel.json` 会为功能路由提供 SPA 回退，而构建时生成的静态 HTML、`sitemap.xml`、`robots.txt` 和其他公共资源会直接输出。

部署后建议检查：

```text
https://www.fateatelier.cloud/robots.txt
https://www.fateatelier.cloud/sitemap.xml
https://www.fateatelier.cloud/tarot/card/0
```

更完整的步骤见 [DEPLOY.md](./DEPLOY.md)。

## 数据与隐私

- 大部分个人输入只在当前浏览器中处理
- 历史记录、收藏和连续到访信息保存于本地存储
- 清除浏览器站点数据会同时清除这些记录
- 不要将搜索引擎推送 token、API 密钥或其他凭证提交到仓库

## 贡献

1. Fork 仓库并创建功能分支
2. 修改代码或对应的源数据
3. 运行 `npm run build` 和 `npm run lint`
4. 提交 Pull Request，说明功能、界面或文案变化

## License

详见 [LICENSE](./LICENSE)。
