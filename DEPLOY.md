# 部署指南

本项目可以通过多种免费平台进行部署，让其他人访问你的塔罗牌占卜应用。

## 🚀 方案一：Vercel（推荐，最简单）

Vercel 是最适合 React/Vite 项目的部署平台，完全免费且操作简单。

### 步骤：

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录（推荐）或注册新账号

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库 `sy-vendor/FateAtelier`
   - Vercel 会自动检测到这是一个 Vite 项目

3. **配置项目**
   - Framework Preset: 选择 "Vite"
   - Build Command: `npm run build`（自动填充）
   - Output Directory: `dist`（自动填充）
   - Install Command: `npm install`（自动填充）
   - 其他保持默认即可

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待 1-2 分钟，部署完成后会获得一个免费域名
   - 例如：`fate-atelier.vercel.app`

5. **自动更新**
   - 以后每次推送到 GitHub 的 main 分支，Vercel 会自动重新部署
   - 完全自动化，无需手动操作

### 优点：
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署（Git 推送即部署）
- ✅ 支持自定义域名（可选）

---

## 🌐 方案二：Netlify

Netlify 也是很好的选择，功能类似 Vercel。

### 步骤：

1. **访问 Netlify**
   - 打开 https://www.netlify.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add new site" → "Import an existing project"
   - 选择你的 GitHub 仓库

3. **配置构建**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - 点击 "Deploy site"

4. **获得域名**
   - 部署完成后会获得类似 `fate-atelier.netlify.app` 的域名

---

## 📦 方案三：GitHub Pages

GitHub Pages 是 GitHub 提供的免费静态网站托管服务。

### 步骤：

1. **安装 gh-pages 包**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **修改 package.json**
   在 `scripts` 中添加：
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **修改 vite.config.ts**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/FateAtelier/'  // 替换为你的仓库名
   })
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **启用 GitHub Pages**
   - 在 GitHub 仓库设置中
   - 找到 "Pages" 选项
   - Source 选择 "gh-pages" 分支
   - 访问地址：`https://sy-vendor.github.io/FateAtelier/`

---

## ☁️ 方案四：Cloudflare Pages

Cloudflare Pages 提供快速且免费的静态网站托管。

### 步骤：

1. **访问 Cloudflare Pages**
   - 打开 https://pages.cloudflare.com
   - 使用账号登录（可免费注册）

2. **连接 GitHub**
   - 点击 "Create a project"
   - 选择你的仓库

3. **配置构建**
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`

4. **部署**
   - 点击 "Save and Deploy"
   - 获得类似 `fate-atelier.pages.dev` 的域名

---

## 🎯 推荐方案对比

| 平台 | 难度 | 速度 | 自动部署 | 自定义域名 | 推荐度 |
|------|------|------|----------|------------|--------|
| Vercel | ⭐ 最简单 | ⚡ 很快 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| Netlify | ⭐⭐ 简单 | ⚡ 快 | ✅ | ✅ | ⭐⭐⭐⭐ |
| GitHub Pages | ⭐⭐⭐ 中等 | 🐢 较慢 | ❌ | ✅ | ⭐⭐⭐ |
| Cloudflare Pages | ⭐⭐ 简单 | ⚡ 很快 | ✅ | ✅ | ⭐⭐⭐⭐ |

## 💡 推荐使用 Vercel

**为什么推荐 Vercel：**
1. 对 Vite/React 项目支持最好
2. 部署速度最快
3. 操作最简单（3步完成）
4. 自动 HTTPS 和 CDN
5. 完全免费且无限制

**快速开始：**
1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 导入 `FateAtelier` 仓库
4. 点击 Deploy
5. 完成！获得免费域名

---

## 📝 注意事项

1. **环境变量**：如果项目需要环境变量，在部署平台设置中添加
2. **自定义域名**：所有平台都支持绑定自己的域名（需要购买）
3. **自动部署**：Vercel 和 Netlify 支持 Git 推送自动部署
4. **构建优化**：确保 `npm run build` 能正常执行

---

## 🎉 部署完成后

部署成功后，你会获得一个类似这样的链接：
- Vercel: `https://fate-atelier.vercel.app`
- Netlify: `https://fate-atelier.netlify.app`
- GitHub Pages: `https://sy-vendor.github.io/FateAtelier/`

把这个链接分享给朋友，他们就可以访问你的塔罗牌占卜应用了！

