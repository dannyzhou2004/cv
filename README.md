# Zhou Yueyang · 个人简历网站

> 线上地址：<https://dannyzhou2004.github.io/cv/> ｜ 仓库：<https://github.com/dannyzhou2004/cv>
> 中文页 <https://dannyzhou2004.github.io/cv/zh/> · 英文页 <https://dannyzhou2004.github.io/cv/en/>

中英双语静态简历站。Astro 5 + TypeScript，无 UI 框架、无运行时依赖；构建产物是纯静态 HTML/CSS/JS，可直接托管在 GitHub Pages。

## 技术要点

- `/en/`、`/zh/` 两个静态页面，共用同一套布局与组件；内容全部来自 `src/data/*.ts`。
- 右上角 `EN / 中文` 是真实链接（禁用 JS 也能切换），选择结果记在 `localStorage['cv-lang']`，根路径 `/` 会按上次选择跳转。
- 所有内部链接与静态资源都走 `src/lib/paths.ts` 的 `withBase()`，因此部署到 `/<仓库名>/` 这种子路径也不会 404。
- 客户端 JS 只有一个模块（`src/scripts/main.ts`）：滚动出现动画、导航高亮、移动端菜单、背景音乐（自动播放 + 淡入）、复制邮箱、打印。
- 打印样式（`@media print`）已内置：隐藏导航/音乐/按钮，A4 友好，可直接「打印 / 存为 PDF」。

## 目录结构

```
src/
  data/          # 唯一的内容来源（en / zh 两份结构必须一致）
  layouts/       # BaseLayout.astro（head、header、页脚、脚本）
  components/    # Header / Hero / Profile / Timeline / Projects / Awards / TagGroups / Languages / Contact
  pages/         # index.astro（语言跳转）、en/index.astro、zh/index.astro、404.astro
  styles/        # global.css（设计变量、组件样式、打印样式）
  scripts/       # main.ts（唯一客户端脚本）
  lib/           # paths.ts（BASE_URL 处理）、rich.ts（**加粗** → <strong>）、chrome.ts（无障碍文案）
public/          # favicon.svg、robots.txt、.nojekyll、audio/bgm.mp3
```

## 本地开发

需要 Node.js ≥ 20。

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 输出到 dist/
npm run preview    # 预览构建结果 http://localhost:4321
```

## 修改内容

只改 `src/data/`，不要改组件：

- `src/data/resume.en.ts`、`src/data/resume.zh.ts` —— 英文 / 中文文案，两份字段完全对应。
- `src/data/types.ts` —— 字段定义（改结构时两份数据要一起改）。
- 句子里的 `**文字**` 会渲染为加粗（不需要 Markdown）。
- 区块标题取 `ui.sections.*`，导航取 `ui.nav.*`；`person.nameZh` 是中文名（当前为「周悦杨」），英文页会把它显示在拼音名下方。

## 背景音乐（自动播放 + 由小变大）

音频文件：`public/audio/bgm.mp3`（96 kb/s CBR，3.43 MB，299 s）。

- 进站约 **0.9 s** 后尝试自动播放；音量从 **0** 用 **7 s** 平方曲线缓慢升到 **0.42**——前两秒几乎听不到，不会吓到人。
- 浏览器若拦截"有声自动播放"（Chrome/Safari 对新访客通常如此）：自动改为**静音播放**，页头按钮旁出现「点击开启声音」；访客第一次点击/按键时取消静音，并同样从 0 淡入。
- 页头四分音符按钮：随时暂停/继续；暂停 0.9 s 淡出，继续则重新从 0 淡入。
- 换歌：直接覆盖 `public/audio/bgm.mp3`（文件名不变），不需要改代码。生成参数见 [docs/audio.md](docs/audio.md)。
- 代价：为了"进来就响"，`preload="auto"` 会在首屏下载这 3.4 MB，整站产物 3.98 MB。

> 版权提醒：该音轨来自 B 站二传视频（原曲《拉夫劳伦进行曲》）。在公开站点上托管 MP3 的版权风险高于嵌入官方播放器；若用于正式求职/商业场景，建议换成授权的 production music（同名覆盖即可）。

## 发布到 GitHub Pages

1. 新建仓库并推送代码到 `main` 分支。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
3. Actions 里的 `Deploy to GitHub Pages` 跑完后即为线上地址：

| 仓库命名 | 访问地址 | 自动推导的 `BASE_PATH` |
| --- | --- | --- |
| `cv`、`resume` 等普通名字 | `https://<用户名>.github.io/<仓库名>/` | `/<仓库名>/` |
| `<用户名>.github.io` | `https://<用户名>.github.io/` | `/` |

`BASE_PATH` 由 `.github/workflows/deploy.yml` 根据仓库名自动推导，无需手改。想在本地验证子路径构建，可 `BASE_PATH=/cv/ npm run build`。

## 自定义域名

- **Settings → Pages → Custom domain** 填写域名，并在 DNS 里加 `CNAME` 记录。
- 自定义域名站点位于根路径，需要把 `BASE_PATH` 固定为 `/`（改 workflow 里的 `base_path="/"`），否则资源会带上多余的子路径前缀。
- 建议同时在 `public/` 放一个 `CNAME` 文件（内容为域名），避免每次部署被重置。

## 隐私提醒

这个站点会**公开**在互联网上：邮箱、学校、成绩、实习经历等内容都能被搜索引擎抓取并缓存。手机号已从数据里移除（`person.phones: []`），如需再加回请自行权衡；其他不想公开的信息请在 `src/data/resume.*.ts` 中删掉后再发布。仓库本身公开时，提交历史里也能看到这些内容。
