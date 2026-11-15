# 个人简历站可行性评估

> 评估对象：`CV_ZhouYueyang_EN.docx`（35 段、无表格）＋ 原视频音轨（本地 `43403250064-1-192.mp4`，4:59.38，AAC 44.1 kHz 立体声 72 kb/s）。
> 评估日期：2026-11-15　｜　**结论：可行，已上线；音乐改为本地 MP3 + 进站自动播放 + 4 秒淡入**。

---

## 0. 结论

**可行，而且是最省心的一类可行。** 静态双语页、GitHub Pages 托管、背景音乐三项需求都不需要服务器、数据库或付费服务，全部可在浏览器端静态完成，年成本 **0 元**。

三个必须提前知道的约束：

| # | 约束 | 影响 | 处理方式 |
|---|---|---|---|
| 1 | 免费 GitHub 账户的 Pages **只能开在公开仓库**（私有仓库需 GitHub Pro） | 简历站 = 公开站点，邮箱等联系方式全网可见、可被爬虫抓取 | 手机号已从数据中移除；邮箱按原样保留（§7） |
| 2 | 浏览器**禁止无交互的有声自动播放** | "进站就响"无法保证 | 分层降级：先尝试有声 → 被拦则静音自动播放 + 「点击开启声音」提示；首次交互后从 0 淡入（§5.2） |
| 3 | 原音轨是 B 站"循环歌单"类二次上传，原曲为《拉夫劳伦进行曲》 | 公开托管 MP3 存在版权风险 | 按你的要求改为本地托管；页面不出现任何 B 站链接；版权风险需自行权衡（§5.4） |

---

## 1. 需求拆解与验收结果

| 需求 | 实现 | 验收 |
|---|---|---|
| 个人简历 | 单页 9 区块：Hero / 01 Profile / 02 Education / 03 Experience / 04 Projects / 05 Honours / 06 Skills / 07 Coursework / 08 Languages / 09 Contact | 与 docx 内容一一对应，未编造；手机号已删除 |
| 中英双语 | `/en/`、`/zh/` 两套静态页，共用布局与组件；中文页主标题为「周悦杨」，英文页主标题为 ZHOU YUEYANG，各自带另一个名字作副标题 | 切换是真实链接；根路径按偏好跳转；`hreflang` / canonical 正确 |
| Astro / Next | Astro 5.18 静态输出 | `astro build` 成功，4 个页面，2–3 秒 |
| GitHub Pages | GitHub Actions 构建 + 官方 Pages action | 工作流已生成；`/` 与 `/cv/` 两种 base 均构建并逐条校验资源路径 |
| 背景音乐 | 本地 `bgm.mp3`（裁掉开头 10 s）+ 进站自动播放（静音降级）+ 4 s 淡入 | 实测有声自动播放被拦时走静音降级，首次交互后从 0 淡入；暂停/恢复正常 |

---

## 2. 技术选型：Astro vs Next.js

| 维度 | Astro 5（选用） | Next.js 静态导出 |
|---|---|---|
| 输出 | 默认纯 HTML，零客户端框架 | 需 `output: 'export'`，仍是 React 运行时 |
| 首屏 JS | 默认 0；本页唯一脚本 **5.1 KB**（gzip ≈ 2 KB） | React 运行时约 90–120 KB 起 |
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

## 5. 背景音乐（本地 MP3 + 进站自动播放 + 淡入）

### 5.1 需求与实现

| 需求 | 实现 |
|---|---|
| 进站默认播放 | 页面加载 0.9 s 后调用 `audio.play()`；`<audio preload="auto" loop>` |
| 由小变大、不吓人 | 音量从 0 用 4 s 平方曲线升到 0.294（前两秒几乎听不到）；音量整体比最初下调 30% |
| 可控制 | 页头四分音符按钮：暂停（0.9 s 淡出）/ 继续（重新从 0 淡入）；结尾 3 s 淡出、循环时重新 4 s 淡入 |
| 不出现 B 站链接/播放器 | 已移除；只有本地音频文件，站点产物 3.88 MB |

### 5.2 浏览器自动播放策略（唯一的硬限制）

浏览器的规则是：**页面在没有用户交互前，不允许"有声"自动播放**。

- Chrome / Safari / Firefox 对新访客都会拦截 `audio.play()`（`NotAllowedError`）；
- 无法绕过，但可以分层降级，保证"尽量早、且永远不突兀"：
  1. 先尝试有声播放 → 成功则 4 s 淡入（回访者、已授予权限的环境常见）；
  2. 被拦截 → 立即改为**静音自动播放**（浏览器允许），音轨已在走；页头显示「点击开启声音」，访客**滚动滚轮 / 手指滑动 / 点击 / 按键**时取消静音，并同样从 0 淡入；
  3. 若连静音播放也被拒绝（少数环境）→ 等第一次**点击或按键**直接播放，仍从 0 淡入（按 HTML 规范滚轮不算用户激活，单靠滚动无法启动声音）。

因此真实体验是：**回访者一进来就听到很轻的淡入；首次访客看到"静音播放 + 一句提示"，随手点一下就淡入**。这是当前 Web 平台能做到的最接近"进来就自动放"的方案。

### 5.3 音频文件

- `public/audio/bgm.mp3`：96 kb/s CBR、44.1 kHz 立体声、289.41 s（开头已裁掉 10 s）、3.31 MiB、-17.5 LUFS / 真峰值 -5.1 dBTP；
- 源为原视频音轨，文件内首 0.25 s 淡入、尾 2.5 s 淡出；播放器另外做 4 s 进站淡入与 3 s 结尾淡出；
- 处理命令见 [docs/audio.md](./audio.md)。

### 5.4 版权（需要你确认）

现在音频文件托管在 GitHub Pages 上（公开分发），**版权风险比嵌入 B 站官方播放器更高**：

- 原曲《拉夫劳伦进行曲》版权归权利人，公开站点理论上可能被投诉/下架；
- 若用于正式求职或商业展示，建议换成授权的 production music——覆盖同名文件即可，代码不用动；
- 或改回"嵌入 B 站官方播放器"（历史实现在 git 记录里可查）。

---

## 6. 性能预算与实测

| 指标 | 目标 | 实测 |
|---|---|---|
| 首屏 HTML | < 40 KB | `en/index.html` **23.3 KB**、`zh/index.html` 23.0 KB |
| CSS | ≤ 30 KB | 23.1 KB（含字体 `@font-face` 与打印样式） |
| 客户端 JS | < 15 KB | **5.1 KB**（gzip ≈ 2 KB），无框架、无 polyfill |
| 字体 | ≤ 300 KB | 按 `unicode-range` 只下载 latin 子集，约 200 KB；CJK 用系统字体，0 字节 |
| 第三方请求 | 0 | 无 CDN、无分析、无 Google Fonts；音频是同源文件 |
| 音频首屏 | 3.31 MB | `preload="auto"`：这是"进站就响"必须付出的代价 |
| 整站产物 | — | **3.88 MB / 27 文件**（其中音频 3.31 MB；做 B 站嵌入方案时是 0.55 MB） |
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
| 浏览器拦截有声自动播放 | 必然（新访客） | 首访静音，需一次点击 | 已实现静音降级 + 「点击开启声音」提示 + 从 0 淡入 |
| 音乐版权投诉 | 中 | 下架 | 换授权音源（§5.4） |
| 邮箱公网暴露 | 必然 | 骚扰 | §7，可自行删除或混淆 |
| 中文字体加载慢 | 若踩坑 | 首屏闪烁 | 不加载 CJK webfont（已做） |

---

## 9. 实测证据（本机 + 线上）

- **自动播放与淡入**（headless Chrome，等同于"浏览器拦截有声自动播放"的最严格环境）：
  - 首屏 0.9 s 后尝试有声播放被拦截 → 页头出现「点击开启声音」提示；
  - 首次交互后开始播放：音量 0.004 → 4 s 后到 0.294（平方曲线，前两秒几乎无声）；
  - 结尾测试：跳到剩余 2 s 时音量开始淡出；播完后自动回到 0 秒、音量从 0 重新 4 s 淡入；
  - 点击按钮暂停：0.9 s 淡出后 `paused=true`；暂停后再滚动滚轮不会把音乐拉起来；再次点击从 0 重新淡入；
  - 页面无任何 B 站链接或播放器（0 个）。
- **线上验收**（`https://dannyzhou2004.github.io/cv/`）：`/cv/`、`/cv/en/`、`/cv/zh/`、`favicon.svg`、`404.html` 全部 **200**；页面资源与字体全部 **200**；`/cv/audio/bgm.mp3` 返回 200（`audio/mpeg`）。
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

## 12. 最终结论

**技术可行性：通过，且已上线。**

- 线上地址：<https://dannyzhou2004.github.io/cv/>（中文 <https://dannyzhou2004.github.io/cv/zh/>，英文 <https://dannyzhou2004.github.io/cv/en/>）
- 仓库：<https://github.com/dannyzhou2004/cv>（公开；Actions 构建 + 官方 Pages 部署）
- 首次部署：Build 与 Deploy 两个 job 均成功，约 1 分钟

后续更新：改 `src/data/*.ts` → `git push` → Actions 自动重新构建发布（约 1 分钟）。

仍需你留意：**版权**。音频已改为本地托管（在公开站点上分发），风险比嵌入官方播放器更高；若站点用于商业或正式求职场景，建议换成授权的 production music——覆盖 `public/audio/bgm.mp3` 同名文件即可，代码不用动。

---

### 参考

- [GitHub Pages limits（官方）](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Astro 官方 GitHub Pages 部署指南](https://docs.astro.build/en/guides/deploy/github/)
- [Next.js static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Bilibili 播放器嵌入参数](https://player.bilibili.com/)
