# 部署指南

Fate Atelier 是纯静态前端（Vite 构建 + SEO HTML）。推荐用 **Vercel**；也可部署到 Netlify、Cloudflare Pages 等。

正式站点：[www.fateatelier.cloud](https://www.fateatelier.cloud/)

## Vercel（推荐）

仓库已含 `vercel.json`（`buildCommand: npm run build`，`outputDirectory: dist`）。

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录  
2. Import 仓库 `sy-vendor/FateAtelier`  
3. Framework 选 Vite；Build / Output 一般会自动填好  
4. Deploy；之后推送 `main` 会自动更新  

自定义域名在 Vercel 项目 Domains 中绑定即可。

### 部署后检查

```text
https://www.fateatelier.cloud/robots.txt
https://www.fateatelier.cloud/sitemap.xml
https://www.fateatelier.cloud/tarot
https://www.fateatelier.cloud/en/tarot
https://www.fateatelier.cloud/tarot/card/0
```

## 其他平台

统一要求：

| 项 | 值 |
| --- | --- |
| Install | `npm install` |
| Build | `npm run build` |
| Publish | `dist` |

- **Netlify**：Import 仓库 → 按上表配置 → Deploy  
- **Cloudflare Pages**：Create project → 连接仓库 → 同上  
- **GitHub Pages**：需自行配置 `base`（见 Vite `base`）与 `gh-pages` 等发布流程，路径与 SEO 绝对地址要额外处理，不如 Vercel 省心  

## 注意

- 构建必须跑完整 `npm run build`（含 SEO 生成与校验），不要只跑 `vite build`  
- 勿把密钥、搜索引擎验证 token 写进仓库；需要时用平台环境变量  
- 应用无强制后端；若以后加 API，再在对应平台配置函数与环境变量  

更多产品说明见 [README.md](./README.md)。
