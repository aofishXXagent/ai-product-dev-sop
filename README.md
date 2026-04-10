# AI 时代产品开发全流程

> 敏捷团队的产品开发方法论 · 基于 [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) 开源框架

一个可视化交互工具,帮助产品经理、开发者、创业者**用 AI 跑完从想法到上线的全流程**。内置 AI 助手,能结合你的项目给出适配建议。

---

## 这是什么?

**一句话:** 把 AI 时代产品开发的 4 个阶段(分析 → 规划 → 解决方案 → 实施)做成了一个可以点、可以看、可以问、可以直接用的交互网站。

**不是什么:**
- 不是一个需要安装的软件
- 不是一个需要编程才能用的工具
- 不需要你读过 BMAD 方法论的原始英文文档

**适合谁:**
- 🧑‍💼 **产品经理** — 想学会用 AI 协作出 PRD、Story、架构文档
- 👩‍💻 **开发者** — 想知道为什么 AI 写的代码总是"漂移",以及怎么防
- 🚀 **创业者/独立开发** — 想用最小成本跑完从想法到 demo 的全流程
- 📚 **学习者** — 想了解 AI 时代的产品开发到底怎么做

---

## 5 分钟上手指南

### 第 1 步 · 下载项目

点击页面上方绿色的 **Code** 按钮 → **Download ZIP**,解压到任意文件夹。

或者如果你会用命令行:
```bash
git clone https://github.com/aofishXXagent/ai-product-dev-sop.git
cd ai-product-dev-sop
```

### 第 2 步 · 启动

打开终端(Mac 按 `Cmd + 空格` 搜索"终端",Windows 搜索"PowerShell"),输入:

```bash
python3 server.py
```

> **没有 python3?** Mac 和大部分 Linux 自带。Windows 用户去 [python.org](https://www.python.org/downloads/) 下载安装,勾选"Add to PATH"。

看到下面这段就说明启动成功了:
```
  BMAD Workflow Site
  →  http://localhost:8765
  →  model: (你配的模型名)

  Ctrl+C 退出
```

### 第 3 步 · 打开浏览器

浏览器地址栏输入 **http://localhost:8765** 回车。看到网站就成功了。

### 第 4 步 · 配置 AI(可选但推荐)

网站右上角点 **「✦ 问 AI」** → 点顶部的 **⚙ 齿轮图标** → 进入配置面板:

1. **选一个模型厂商**(支持 MiniMaxi / DeepSeek / Kimi / 智谱 / 通义 / OpenAI / OpenRouter 等 7 家)
2. **按提示获取 API Key** — 每个厂商都有分步图文指引,点链接直达创建页面
3. **粘贴 Key → 点"测试连接"→ 保存**

> 没有 API Key 也能用。只是 AI 聊天和"生成一页纸"功能不可用,其余所有内容都能正常浏览。

---

## 网站里有什么?怎么用?

打开网站后,左侧是导航目录,推荐按下面的顺序浏览:

### 📖 起步 · 先看这两页

| 页面 | 干什么 | 花多久 |
|------|--------|--------|
| **BMAD 是什么** | 了解整套方法论的全貌:4 阶段、5 个 AI Agent、10 个核心概念 | 3 分钟 |
| **📖 完整案例演练** | 看一个真实案例(团队 AI 周报生成器)如何从想法到 demo 跑完 4 阶段 | 5-10 分钟 |

### 🛠 准备工具 · 用到你自己的项目

| 页面 | 干什么 | 花多久 |
|------|--------|--------|
| **🛠 3 分钟速通** | 回答 3 个核心问题 → AI 自动生成一份针对你项目的"BMAD 一页纸"(4 阶段执行建议) | 3 分钟 |
| **深挖路径(可选)** | 把一页纸里某个阶段展开成完整文档(Brief / PRD / Architecture / Story),可下载 .md | 每条 5-8 分钟 |

> **不知道问题怎么填?** 每道题旁边都有「💡 看周报案例参考」按钮,点开能看到真实答案,还能一键填入。

### 📋 完整工作流 · 深度学习每一步

左侧 4 个阶段(Analysis / Plan / Solutioning / Implementation)下面列着 18 个具体工作流。每个工作流的详情页包含:

- **怎么跑** — 这个工作流是做什么的、什么时候用
- **详细操作步骤** — 每一步在做什么,来自 BMAD 源码的真实规则
- **完整运行流程** — 一段真实的对话片段,看 AI Agent 和用户怎么来回
- **常见坑** — 4-5 个真实陷阱 + 解法

### 👤 5 位 Agent + 💡 10 个核心概念

了解每个 AI 角色(Mary / John / Sally / Winston / Amelia)的身份、原则、能力清单,以及 BMAD 的 10 个底层机制(Step-File 架构、Story Context Engine、Adversarial Review 等)。

### ✦ AI 助手 · 随时可问

任何页面点右上角 **「✦ 问 AI」** 打开聊天面板。AI 会自动带上你当前看的页面作为上下文。你可以:

- 问方法论:"PRD 这一步该怎么写?"
- 问适配:"我的项目只有 2 个人,需要跑完整 4 阶段吗?"
- 让它引导你:"帮我想一下我项目的成功指标应该怎么定"

---

## 推荐使用路径

```
第一次来?
  │
  ├─→ 「BMAD 是什么」(3 分钟了解全貌)
  │
  ├─→ 「📖 完整案例演练」(5 分钟看真实案例)
  │
  ├─→ 「🛠 3 分钟速通」(答 3 题,拿到你项目的一页纸)
  │
  ├─→ (可选) 深挖 Brief / PRD / Architecture / Story
  │
  └─→ 按需翻看具体的工作流详情 / Agent 图鉴 / 核心概念
```

---

## 常见问题

**Q: 我不是程序员,能用吗?**
A: 能。网站本身就是给非程序员看的。唯一需要命令行的是启动那一步(`python3 server.py`),之后全程在浏览器操作。

**Q: 必须有 API Key 才能用吗?**
A: 不必须。没有 Key 也能浏览所有内容、看案例、学工作流。只有"AI 聊天"和"速通生成一页纸"需要 Key。

**Q: 支持哪些 AI 模型?**
A: 任何 OpenAI 兼容格式的模型都行。内置预设了 7 家:MiniMaxi、DeepSeek、Kimi (月之暗面)、智谱 GLM、通义千问、OpenAI、OpenRouter。也可以填自定义端点。

**Q: 我的 API Key 安全吗?**
A: Key 只存在你自己的浏览器 localStorage 里,不会上传到任何服务器。`server.py` 只是本地转发,不会记录你的 Key。

**Q: 可以部署到线上给团队用吗?**
A: 可以,但需要处理 API Key 的分发问题(不能把 Key 明文放线上)。建议用 Vercel / Cloudflare Pages 部署静态部分,后端用 Serverless Function 包一层鉴权。

**Q: 内容是原创的吗?**
A: 方法论由 **Brian (BMad) Madison** 与 [bmad-code-org](https://github.com/bmad-code-org/BMAD-METHOD) 团队原创(MIT License)。本站是对其开源源码与官方文档的**中文整理与可视化呈现**,所有方法论原创性归原作者所有。

---

## 文件结构

```
ai-product-dev-sop/
├── server.py    # 本地服务器 (Python stdlib, 零依赖)
│                  职责: 静态文件服务 + /api/chat 转发到 AI 模型
├── .env         # API Key 配置 (本地保存, 已 gitignore, 不会提交)
├── .gitignore
├── index.html   # 页面骨架
├── styles.css   # 三栏布局样式系统
├── app.js       # 交互逻辑 + AI 聊天 + 速通向导 + 路由
├── data.js      # 完整 BMAD 内容数据 (4 阶段 × 18 工作流 × 5 Agent × 10 概念)
└── README.md    # 本文件
```

## 自定义

- **换 AI 模型:** 在网站右上角 ⚙ 配置面板里直接改,或者编辑 `.env` 文件
- **改内容:** 编辑 `data.js`,所有文本内容集中在这一个文件
- **加工作流 / 角色 / 概念:** 在 `data.js` 的对应数组里追加,无需改其他文件

---

## 致谢

- 方法论原创:**Brian (BMad) Madison** 与 [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) · MIT License
- 如果你觉得这套方法论有用,请去原仓库给一个 ⭐ Star

## License

MIT
