# LiFTeR 项目展示网页

独立的静态网页，无需安装依赖或构建，可直接打开 `index.html`。页面采用相对路径，也可将 `website/` 发布到任意静态站点或 GitHub Pages。

## 本地预览

直接双击 `index.html`，或在仓库根目录执行：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000/website/>。网页的所有必要资源均在 `website/` 内，可以单独发布；页面不会依赖仓库外的技术文档。

## 替换图片和视频

1. 将素材放进 `assets/media/`，或使用可公开访问的 HTTPS 素材地址。
2. 编辑 `media.js` 中对应的配置项。例如：

```js
window.LIDARGEN_MEDIA = {
  'hero': { type: 'video', src: './assets/media/hero.mp4', poster: './assets/media/hero.jpg' },
  // null 或缺省会保留首屏视频占位。
};
```

支持 `video` / `image` 两种类型；视频带控制栏，默认不自动播放。路径相对于 `index.html`。素材加载失败时，页面会回退到原占位内容。建议视频为 MP4（H.264），图片为 JPG、PNG 或 WebP；需要音轨时请使用浏览器播放控件。

| 配置项 | 对应位置 | 建议比例 |
|---|---|---|
| `hero` | 首屏项目视频 | 约 2.27:1，可使用 16:9 |

结果与失败案例已改为根据论文排列的静态图片，直接在 `index.html` 中引用 `assets/figures/`；`media.js` 中旧结果占位的配置项暂不对应页面位置。方法概览中的流程示意图为 `assets/figures/20261106-210438.png`，需要时可替换该图片。

需要修改文案、作者信息或增加论文/代码链接，可编辑 `index.html`；配色和布局在 `styles.css`。网页中的实验数字来自项目材料，均标明“未独立复现、实验口径待补充”。

## 发布到 GitHub Pages

发布仓库：`https://github.com/carizon-gaia/lifter`。启用 GitHub Pages 后的网址为 `https://carizon-gaia.github.io/lifter/`。将网页文件放在该仓库的 `main` 分支根目录，然后在仓库 Settings → Pages 选择 **Deploy from a branch**、分支 `main` 和 `/(root)`。首次部署需要等待 GitHub Pages 构建完成。

页面包含论文图表和实车素材；维护或更新时须确认新增内容已获准公开。Pages 和 GitHub 公共仓库均可被公网访问，已发布内容可能被保存或转载。逐项检查 `index.html`、`media.js`、Logo、网页根目录图片、`assets/figures/` 和 `assets/media/`；不要上传论文 PDF、工程源代码、`.DS_Store`、数据、模型权重或凭据。更换素材后需更新 GitHub 仓库并等待 Pages 重新部署。

## 方法展示边界

页面参考了 LiFTeR 项目目标、背景与两阶段方法，以及当前仓库的实现。研究中更广的输入模态、新位姿仿真与现有代码的实际支持范围不能直接等同，页面已作区分。定量结果按项目材料展示，并标注未独立复现；数据与公开发布口径需要确认。

网页包括研究动机、两阶段方法、nuScenes 张量形状、EDM 扩散、逐射线 2DGS 和评估口径。尺寸及算法细节主要以当前 nuScenes 单帧配置为例，不能直接套用实车数据；网页展示论文原图、项目材料中的图片和根据当前代码整理的示意图。`assets/figures/` 是论文素材的本地副本，按论文图 1–13 组织，覆盖生成、同帧重建、新视角、轨迹外推、消融、实车、检测和失败案例；点击图片可查看原图。`4.png`、`5.png` 展示两种推理方案，`6.jpg.png`～`8.jpg.png` 为生成误差及新视角重建的耗时、质量对比。实验结果未独立复现。单帧扩散和可选 Gaussian 是独立路径；多帧分支不作为默认可用功能展示。进一步的实现边界与代码依据见仓库根目录的 `LIDARGEN_TECHNICAL_ARCHITECTURE.md`。
