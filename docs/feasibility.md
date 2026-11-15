# 个人简历站可行性评估

> 评估对象：`CV_ZhouYueyang_EN.docx`（35 段、无表格）＋ 原 B 站视频（本地文件 `43403250064-1-192.mp4`，4:59.38，音轨 AAC 44.1 kHz 立体声 72 kb/s）。
> 评估日期：2026-11-15　｜　**结论：可行，且已完成可运行原型**（构建通过、双语言、手机号已下线、音乐改为 B 站官方播放器嵌入）。

---

## 0. 结论

**可行，而且是最省心的一类可行。** 静态双语页、GitHub Pages 托管、背景音乐三项需求都不需要服务器、数据库或付费服务，全部可在浏览器端静态完成，年成本 **0 元**。

三个必须提前知道的约束：

| # | 约束 | 影响 | 处理方式 |
|---|---|---|---|
| 1 | 免费 GitHub 账户的 Pages **只能开在公开仓库**（私有仓库需 GitHub Pro） | 简历站 = 公开站点，邮箱等联系方式全网可见、可被爬虫抓取 | 手机号已从数据中移除；邮箱按原样保留（§7） |
| 2 | 浏览器**禁止带声音的媒体自动播放** | "进站就响"做不到 | 音乐改为**点击后**嵌入 B 站官方播放器；播放器自身的播放键由 B 站控制 |
| 3 | 原音轨是 B 站"循环歌单"类二次上传，原曲为《拉夫劳伦进行曲》 | 直接转 MP3 公开托管存在版权风险 | **不再托管任何音频文件**，改为嵌入 B 站官方播放器 + 页面标注原视频链接；风险显著降低，但仍不等于获得音乐授权（§5.4） |

---

## 1. 需求拆解与验收结果

| 需求 | 实现 | 验收 |
|---|---|---|
| 个人简历 | 单页 9 区块：Hero / 01 Profile / 02 Education / 03 Experience / 04 Projects / 05 Honours / 06 Skills / 07 Coursework / 08 Languages / 09 Contact | 与 docx 内容一一对应，未编造；手机号已删除 |
| 中英双语 | `/en/`、`/zh/` 两套静态页，共用布局与组件；中文页主标题为「周悦杨」，英文页主标题为 ZHOU YUEYANG，各自带另一个名字作副标题 | 切换是真实链接；根路径按偏好跳转；`hreflang` / canonical 正确 |
| Astro / Next | Astro 5.18 静态输出 | `astro build` 成功，4 个页面，2–3 秒 |
| GitHub Pages | GitHub Actions 构建 + 官方 Pages action | 工作流已生成；`/` 与 `/cv/` 两种 base 均构建并逐条校验资源路径 |
| 背景音乐 | 点击页头按钮 → 按需挂载 B 站官方播放器（`player.bilibili.com/player.html?bvid=BV1ta4J6TET9`） | iframe 返回 200；关闭 / Esc / 点面板外都会移除 iframe 停止音频；首屏 0 音频请求 |

---

## 2. 技术选型：Astro vs Next.js

| 维度 | Astro 5（选用） | Next.js 静态导出 |
|---|---|---|
| 输出 | 默认纯 HTML，零客户端框架 | 需 `output: 'export'`，仍是 React 运行时 |
| 首屏 JS | 默认 0；本页唯一脚本 **4.6 KB**（gzip ≈ 2 KB） | React 运行时约 90–120 KB 起 |
| 双语路由 | 内置 i18n 支持，`/en/` `/zh/` 目录即可 | 需 `[lang]` 段 + `generateStaticParams`，middleware 在静态导出下不可用 |
| Pages 适配 | 官方部署指南 + `base` 一处配置 | 需 `basePath` + `images.unoptimized` + `trailingSlash`，路径更易错 |
| 适合场景 | 内容型站点（简历、博客、文档） | 需要服务端能力或复杂交互的应用 |

**结论：Astro。** Next.js 不是不行，但为单页简历付了不必要的 JS 体积与配置复杂度。

---

## 3. GitHub Pages 机制与限制

### 3.1 仓库命名决定 URL 和 `base`

| 仓库名 | 类型 | 地址 | 构建时 `base` |
|---|---|---|---|
| `dannyzhou2004.github.io` | 用户站（每账号 1 个） | `https://dannyzhou2004.github.io/` | `/` |
| `cv`（推荐） | 项目站 | `https://dannyzhou2004.github.io/cv/` | `/cv/` |

**这是 GitHub Pages 最高频的翻车点**：项目站若按 `/` 构建，页面能开但 CSS/字体全 404。本项目 `astro.config.mjs` 读取 `BASE_PATH`，CI 按仓库名自动推导（`.github.io` 结尾 → `/`，否则 → `/<repo>/`），两种命名都不用改代码。

### 3.2 平台限制（[GitHub 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)）

- 公开仓库免费；私有仓库的 Pages 需要 GitHub Pro 及以上；
- 站点体积上限 **1 GB**，源仓库建议 ≤ 1 GB；
- 带宽**软限制 100 GB/月**；
- 单次部署超时 **10 分钟**（本项目构建约 2 秒）；
- 软限制 10 次构建/小时——**使用自定义 Actions 工作流时此限制不适用**；
- 纯静态、无服务端逻辑，本项目不需要。

### 3.3 部署链路

```
push → GitHub Actions（npm ci → astro build → upload-pages-artifact）→ deploy-pages → https://<user>.github.io/<repo>/
```

首次只需在仓库 **Settings → Pages → Source** 选 **GitHub Actions**，之后每次 push 自动发布。

---

## 4. 双语实现

| 要点 | 做法 |
|---|---|
| 路由 | `/en/`、`/zh/` 两个静态页，内容来自 `src/data/resume.en.ts` / `resume.zh.ts` |
| 姓名 | 中文页 H1「周悦杨」+ 副标题 ZHOU YUEYANG；英文页 H1 ZHOU YUEYANG + 副标题 周悦杨；JSON-LD 同时输出 `name` / `alternateName` |
| 切换 | 顶部 `EN / 中文` 是 `<a>` 真实链接（禁用 JS 也能切换），并写入 `localStorage['cv-lang']` |
| 根路径 | `/` 智能跳转：有偏好按偏好，否则 `/en/`（英文优先）；`<noscript>` 用 meta refresh 兜底 |
| SEO | 每页 canonical + `hreflang`（en / zh-CN / x-default）+ `og:locale` + Person JSON-LD |
| 字体 | 拉丁字符自托管 woff2（Newsreader / Inter / IBM Plex Mono），`unicode-range` 按需加载；中文**不加载** CJK 网络字体，用系统字体栈 |
| 翻译 | 英文来自 docx 原文；中文人工润色，术语保留英文缩写并给中文，如「四象限变流器（4QS）」「SRtP（安全返港）」 |

---

## 5. 背景音乐（B 站官方播放器嵌入）

### 5.1 方案对比

| 维度 | 本地 MP3（已弃用） | B 站嵌入（现方案） |
|---|---|---|
| 站点体积 | +3.43 MB | **0**（iframe 点击后才请求） |
| 版权形态 | 复制音频并公开分发 | 官方播放器"分享"，音频不出 B 站 |
| 后台播放体验 | 无画面、可淡入、可循环 | 有播放器画面，自动播放可能被拦，需点播放器 |
| 可控性 | 完全可控 | 受 B 站播放器与浏览器策略限制 |
| 视频失效 | 无影响 | 播放器显示错误页，换 BV 即可 |

### 5.2 自动播放

`<audio autoplay>` 与跨域 iframe 的自动播放都受浏览器策略限制：**点击我们自己的按钮只给本页面授予用户手势，不会传递给 B 站 iframe 的文档**。因此：

- 面板里的 iframe 带上 `autoplay=1`，B 站播放器会尝试自动播放；
- 若被浏览器拦截，访客需在播放器里再点一次播放键——面板里已写明提示；
- 这是"用 B 站音源"的固有代价，无法用前端代码绕过。

### 5.3 实现细节

- `bvid` 为空时页头不渲染音乐按钮，不会留下死按钮；
- 首次展开面板才注入 iframe（`preload` 意义上的"按需"），首屏 **0** 第三方请求；
- 关闭面板 / 按 Esc / 点击面板外都会**移除 iframe** —— 跨域无法调用 `pause()`，移除是唯一可靠的停止方式；
- 面板含标题、16:9 播放器、提示文案、"在 B 站打开原视频"链接；
- 移动端面板宽度 `min(20rem, 100vw - 1.5rem)`，不会撑出横向滚动。

### 5.4 版权（需要你确认）

嵌入 B 站官方播放器属于平台允许的分享方式，**比把音轨转成 MP3 放在 GitHub Pages 上规范得多**，但：

- 它**不等于获得音乐授权**——版权仍归权利人，公开站点理论上仍可能被投诉；
- 该视频是"循环歌单"类二次上传，原曲《拉夫劳伦进行曲》的版权归属需自行确认；
- 若站点用于求职/商业展示，最稳妥的是购买授权的 production music，替换为本地 `<audio>`（模板保留扩展空间）。

**当前状态**：已接入 —— 源视频 `BV1ta4J6TET9`（《【拉夫劳伦斯】纯音乐超长版。》，UP @行为准责，300 s，纯音乐无人声）。B 站 API 返回的 `cid=43403250064` 与本地 mp4 文件名完全一致，可确认是同一版；原视频链接同时出现在页头联系 chips 与联系方式区。

---

## 6. 性能预算与实测

| 指标 | 目标 | 实测 |
|---|---|---|
| 首屏 HTML | < 40 KB | `en/index.html` **22.3 KB**、`zh/index.html` 22.0 KB |
| CSS | ≤ 30 KB | 24.2 KB（含字体 `@font-face` 与打印样式） |
| 客户端 JS | < 15 KB | **4.6 KB**（gzip ≈ 2 KB），无框架、无 polyfill |
| 字体 | ≤ 300 KB | 按 `unicode-range` 只下载 latin 子集，约 200 KB；CJK 用系统字体，0 字节 |
| 第三方请求 | 0 | 无 CDN、无分析、无 Google Fonts；B 站 iframe 仅点击后加载 |
| 音频首屏 | 0 | 无本地音频文件；iframe 按需创建 |
| 整站产物 | — | **0.55 MB / 26 文件**（原来含音频时 3.98 MB） |
| 构建 | — | 2–3 秒，4 个页面 |

---

## 7. 隐私

- **手机号已删除**：`person.phones: []`，页头 chips、联系方式区和 JSON-LD 里都不再出现，`tel:` 链接为 0。
- 仍公开：两个邮箱、学校、成绩、实习经历。GitHub Pages 是完全公开的静态站点，会被搜索引擎与爬虫抓取。
- 如果想进一步降噪：网页只留一个邮箱；或把邮箱写成 `name [at] domain`（牺牲便利）。
- 仓库公开时，提交历史里也能看到这些内容。

---

## 8. 风险清单

| 风险 | 概率 | 影响 | 规避 |
|---|---|---|---|
| 项目站 `base` 配错 → 资源 404 | 中 | 页面裸奔 | CI 自动推导 + 构建后脚本逐条校验（`/` 与 `/cv/` 均通过） |
| 免费账户把 Pages 指向私有仓库失败 | 高（若设私有） | 无法发布 | 仓库设为公开，或升级 Pro |
| B 站视频被删/设为私密 | 低 | 播放器报错 | 换 BV 即可，代码不变 |
| 浏览器拦截 iframe 自动播放 | 高 | 需再点一次播放 | 面板内已提示；不接受则改用授权音频 + 原生 `<audio>` |
| 音乐版权投诉 | 中 | 下架 | 换授权音源（§5.4） |
| 邮箱公网暴露 | 必然 | 骚扰 | §7，可自行删除或混淆 |
| 中文字体加载慢 | 若踩坑 | 首屏闪烁 | 不加载 CJK webfont（已做） |

---

## 9. 实测证据（本机）

- **构建**：Astro 5.18.2，`astro build` 成功；4 页（`/`、`/en/`、`/zh/`、`/404.html`），2–3 秒。
- **子路径部署**：`BASE_PATH=/cv/` 构建，19 个本地资源引用全部带 `/cv/` 前缀且文件存在；根路径构建同样通过。
- **姓名/隐私**：en `<h1>` = ZHOU YUEYANG、副标题 周悦杨；zh `<h1>` = 周悦杨、副标题 ZHOU YUEYANG；两页各 1 个 `<h1>`；手机号与 `tel:` 链接均不存在。
- **B 站播放器**（真实视频 `BV1ta4J6TET9`）：
  - 点击音乐按钮 → 面板展开，`aria-expanded=true`，iframe 注入，`player.bilibili.com/player.html?bvid=BV1ta4J6TET9` 返回 **200**；
  - 面板显示真实标题《拉夫劳伦进行曲》纯音乐、UP 署名与"在 B 站打开原视频"链接；
  - 按 Esc → 面板关闭、iframe 被移除；再打开后点击面板外部 → 同样关闭并移除；
  - 390px 与 1440px 下均无横向溢出。
- **打印**：`@media print` 隐藏导航/音乐/按钮，白底黑字；A4 导出 4 页 PDF。
- **禁用 JS**：内容仍完整可见（`opacity:1`），语言切换靠真实链接。
- **可访问性**：唯一 `<h1>`、9 个 `<h2>`、按钮均有可访问名称、skip link、无控制台错误。
- **截图**：`docs/screenshots/`（1440 桌面 + 390 移动端，中英各一）。

> 验证环境说明：本机沙箱默认禁止 Node 通过管道 spawn 子进程，Astro 构建里的 esbuild 会被拦住；构建是在放开该限制后跑的**标准配置**构建（未使用绕过方案）。你自己的电脑上 `npm install && npm run build` 不会有这个问题。

---

## 10. 部署 SOP（确认版权后执行）

```bash
cd cv-site
git init -b main
git add .
git commit -m "feat: bilingual CV site"
gh repo create cv --public --source . --remote origin --push

# 开启 Pages：Settings → Pages → Source 选 "GitHub Actions"
# 或在有仓库 admin 权限时：
gh api -X POST repos/dannyzhou2004/cv/pages -f build_type=workflow
```

等待 Actions 跑完（约 1 分钟），访问 `https://dannyzhou2004.github.io/cv/`。

可选：`Settings → Pages → Custom domain` 绑域名（自动 HTTPS）；绑域名后站点位于根路径，需要把 workflow 里的 `base_path` 固定为 `/`（README 已写）。

---

## 11. 成本与维护

| 项 | 成本 |
|---|---|
| GitHub Pages 托管 | 0 元（公开仓库、软额度内） |
| 构建 | GitHub Actions 免费额度内（公开仓库不计费） |
| 域名（可选） | 约 ¥60–100/年 |
| 更新内容 | 只改 `src/data/resume.en.ts` / `resume.zh.ts`，push 即自动发布 |
| 代码量 | 1 个布局 + 9 个组件 + 4 个页面 + 1 个脚本 + 2 份数据 |

---

## 12. 最终结论与待确认

**技术可行性：通过。** 已完成可运行原型：双语静态构建、姓名双写、手机号下线、B 站播放器接入（真实视频已验证）、Pages Actions 配置、打印样式、无障碍与响应式，均实测通过。

只剩一件需要你确认的事：

**版权**：嵌入 B 站官方播放器属于"分享"，比托管 MP3 规范得多，但仍不等于获得音乐授权；确认可接受，或改用授权音源。

确认后按 §10 三步即可上线。仓库建议公开（免费账户的 Pages 不支持私有仓库），站点地址将是 `https://dannyzhou2004.github.io/<仓库名>/`。

---

### 参考

- [GitHub Pages limits（官方）](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Astro 官方 GitHub Pages 部署指南](https://docs.astro.build/en/guides/deploy/github/)
- [Next.js static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Bilibili 播放器嵌入参数](https://player.bilibili.com/)
