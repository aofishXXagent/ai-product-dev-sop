# BMAD Workflow Site · AI 产品开发 SOP 交互指南

基于 [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) 仓库源码与官方文档整理的中文交互式学习工具。
内置 MiniMaxi M2 AI 助手,可结合你的项目情况给出适配建议。

## 启动

```bash
python3 server.py
```

打开 http://localhost:8765 即可。

> Mac / Linux 自带 python3。无需 npm,无需任何第三方依赖。

## 文件结构

```
bmad-workflow-site/
├── server.py    # Python 代理(60 行) — 静态服务 + /api/chat 转发
├── .env         # API Key + Base URL + Model(本地保存,已 gitignore)
├── index.html   # 页面骨架
├── styles.css   # 三栏布局样式
├── app.js       # 交互逻辑 + AI 聊天
├── data.js      # 完整 BMAD 内容数据
└── README.md    # 本文件
```

## 安全提醒

`.env` 里存了你的 API Key,**不要提交到任何公开仓库**(已加入 `.gitignore`)。
若 Key 已意外泄露,请立刻去 MiniMaxi 控制台重置。

## 用法

- **左侧侧边栏:** 4 个阶段 + 所有 workflow 一目了然,点击任一项跳转
- **中间内容区:** 当前 workflow 的完整说明、原则、产出物、决策矩阵
- **右侧 AI 面板:** 随时唤起,自动带上你正在看的 workflow 作为上下文
- **快捷按钮:** 每个内容区都有「问 AI:这一步对我项目怎么用?」一键引导

## 修改

- 想换 AI 模型? 改 `.env` 里的 `MINIMAX_MODEL`
- 想换内容? 编辑 `data.js`
- 想加阶段/角色? 在 `data.js` 里追加,无需改其他文件
