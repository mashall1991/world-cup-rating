# Vue 3 重构说明

原 `index.html + app.js + styles.css`(原生 JS)已重构为 **Vite + Vue 3** 工程,并做了视觉与移动端适配大改。

## 结构

- `src/lib/engine.js` — 原 app.js 全部评分模型/实时数据/预测逻辑,逐行移植为 ES module(零改动算法),状态用 Vue `reactive`
- `src/lib/ui.js` — 弹窗/底部浮层共享 UI 状态
- `src/App.vue` — 页面骨架与导航
- `src/components/` — TeamList / TeamDetail / PlayerTable / LiveBanner / ScheduleView / LineupDialog / CompareDialog
- `src/styles.css` — 全新设计系统(深海军蓝主题、tabular-nums 数字、移动端底部浮层)
- `data/public/*.js` — 数据文件保持原样,仍由 `<script>` 全局注入,不打进 bundle
- `server.js` — 静态服务优先 `dist/`,找不到回退仓库根目录(data 等);API 代理不变
- `render.yaml` — buildCommand 改为 `npm install && npm run build`

## 命令

```bash
npm install
npm run dev      # 开发(/api 代理到 localhost:3000,需另开 node server.js 才有实时数据)
npm run build    # 构建到 dist/
npm start        # 生产:node server.js(自动服务 dist + 数据 + API 代理)
```

## 旧文件

`app.js`、`styles.css`、根目录旧 `index.html` 已被 `src/` 取代,确认无误后可删除。
