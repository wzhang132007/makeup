# 🚀 部署指南 - 获取在线演示链接

## 方法 1: Vercel (推荐 ⭐ 最快最简单)

### 步骤：
1. 访问 [https://vercel.com/](https://vercel.com/)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择仓库：`wzhang132007/makeup`
5. 选择分支：`claude/setup-github-connection-01Wv72ocNxebYzhc3Bamq3BK`
6. 点击 "Deploy"

### 结果：
✅ 自动构建和部署
✅ 获得链接格式：`https://makeup-xxx.vercel.app`
✅ 每次 push 自动重新部署

---

## 方法 2: Netlify

### 步骤：
1. 访问 [https://www.netlify.com/](https://www.netlify.com/)
2. 使用 GitHub 账号登录
3. 点击 "Add new site" → "Import an existing project"
4. 选择 GitHub 仓库：`wzhang132007/makeup`
5. 选择分支：`claude/setup-github-connection-01Wv72ocNxebYzhc3Bamq3BK`
6. 构建设置会自动检测（已配置 netlify.toml）
7. 点击 "Deploy site"

### 结果：
✅ 获得链接格式：`https://makeup-xxx.netlify.app`
✅ 可自定义域名

---

## 方法 3: GitHub Pages

### 步骤：
1. 在仓库设置中启用 GitHub Pages
2. 选择分支和 `/docs` 文件夹（需要修改构建输出）
3. 或使用 GitHub Actions 自动部署

---

## 方法 4: Firebase Hosting (Google)

### 步骤：
```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录
firebase login

# 初始化项目
firebase init hosting

# 选择设置
# - Public directory: dist
# - Single-page app: Yes
# - Set up automatic builds: No

# 构建项目
npm run build

# 部署
firebase deploy
```

### 结果：
✅ 获得链接格式：`https://your-project.web.app`
✅ Google 基础设施托管

---

## 🎯 推荐方案

**最快方式：Vercel**
- ⚡ 30秒内完成部署
- 🔄 自动 CI/CD
- 🌐 全球 CDN
- 💯 完全免费

**操作步骤：**
1. 打开 https://vercel.com/new
2. 连接 GitHub
3. 导入 `wzhang132007/makeup`
4. 一键部署
5. 获得链接！

---

## 📱 预期结果

部署完成后，您将获得一个类似这样的链接：

```
https://grand-luxury-christmas-tree.vercel.app
```

或

```
https://makeup.netlify.app
```

任何人都可以通过这个链接访问您的 3D 圣诞树应用！🎄✨
