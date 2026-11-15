# Zhou Yueyang · 个人简历网站

中英双语静态简历站。Astro 5 + TypeScript，无 UI 框架、无运行时依赖；构建产物是纯静态 HTML/CSS/JS，可直接托管在 GitHub Pages。

## 技术要点

- `/en/`、`/zh/` 两个静态页面，共用同一套布局与组件；内容全部来自 `src/data/*.ts`。
- 右上角 `EN / 中文` 是真实链接（禁用 JS 也能切换），选择结果记在 `localStorage['cv-lang']`，根路径 `/` 会按上次选择跳转。
- 所有内部链接与静态资源都走 `src/lib/paths.ts` 的 `withBase()`，因此部署到 `/<仓库名>/` 这种子路径也不会 404。
- 客户端 JS 只有一个模块（`src/scripts/main.ts`）：滚动出现动画、导航高亮、移动端菜单、B 站音乐面板、复制邮箱、打印。
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
public/          # favicon.svg、robots.txt、.nojekyll
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

## 背景音乐（B 站官方播放器）

音乐**不托管在本仓库**，而是点击右上角按钮后，在页面里挂载 B 站官方播放器
（`player.bilibili.com/player.html?bvid=…`）。这样既不复制音频文件，也保留了原视频链接。

1. 在 `src/data/resume.en.ts` 和 `resume.zh.ts` 里填同一个视频：
   ```ts
   music: {
     bvid: 'BV1xxxxxxxxx',                                  // 视频页 URL 里 /video/ 后面那一段
     url: 'https://www.bilibili.com/video/BV1xxxxxxxxx',    // 原视频页
     title: '背景音乐',                                      // 面板标题
     credit: '',                                            // 可选署名
   },
   ```
2. `bvid` 为空时，页头不显示音乐按钮（不会留下坏按钮）。
3. 交互：点击按钮 → 展开面板并**按需**创建 iframe（首屏 0 请求）；关闭、按 Esc、点面板外都会移除 iframe，音频随之停止。
4. 浏览器策略：iframe 属于 B 站自己的文档，自动播放由 B 站播放器决定，可能被浏览器拦住，面板里已提示"若没有声音，点播放器里的播放键"。
5. 视频被 UP 主删除/设为私密时播放器会显示错误页——换成新的 BV 即可，代码不用改。

> 关于版权：嵌入 B 站官方播放器属于平台允许的"分享"方式，比把 MP3 放到 GitHub 上**规范得多**；但它不等于获得了音乐授权，公开站点仍有被权利方投诉的可能。更稳妥的替代方案是自己买授权的 production music，放到 `public/audio/` 并用原生 `<audio>` 播放（需要时再改回即可）。

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
