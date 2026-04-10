/* ============================================================
 * BMAD V6 — 完整内容数据
 * 内容来源: github.com/bmad-code-org/BMAD-METHOD
 *
 * 注意: 所有字符串统一用反引号 (template literal),
 *       这样内部的 " 和 ' 都不需要转义。
 * ============================================================ */

/* ============================================================
 * BMAD_QUICK — 速通版准备工具
 * 3 个核心问题(+1 可选)→ AI 生成针对项目的 BMAD 一页纸
 * ============================================================ */
window.BMAD_QUICK = {
  title: `准备工具 · 3 分钟拿到你项目的 BMAD 一页纸`,
  subtitle: `3 个问题 → AI 帮你生成针对项目的 4 阶段执行清单 + 最容易踩的坑`,
  promise: `不用填 30 个字段, 不用读完整方法论。回答 3 个最关键的问题, AI 会基于完整的 BMAD 4 阶段方法论, 给你**一份针对你项目的具体执行建议**, 不是空模板。`,

  questions: [
    {
      key: `quick_what`,
      num: 1,
      title: `你要做什么?`,
      hint: `一句话: 产品 + 核心痛点。**不要列功能, 先讲为什么**`,
      placeholder: `例: 团队 AI 周报生成器 — 5 人技术团队每周写周报花 ~3.5 小时, 内容质量越来越差, manager 已经在抱怨`,
      multiline: true,
      caseRef: `5 人技术团队每周花 ~3.5 小时写周报, 但内容质量越来越差, manager 已经在抱怨「越来越敷衍」。真正的痛点不是「写周报麻烦」, 而是「周报质量已经在崩, 但团队还在被这件事消耗」。`
    },
    {
      key: `quick_who`,
      num: 2,
      title: `给谁用?他们今天怎么解决?`,
      hint: `目标用户 + 现状细节。**越具体越好** — 写出他们用什么、有多痛、痛了多久`,
      placeholder: `例: 团队 5 个工程师 + 我自己。今天每人手写 30 分钟/周, 2 个人经常跳过。试过飞书周报模板太死板, GitHub Activity 只有代码没上下文`,
      multiline: true,
      caseRef: `团队 5 个工程师 + 我自己。今天每人手写, 30 分钟/周, 2 个人经常跳过。已有的替代方案: 1) 飞书周报模板太死板 2) GitHub Activity 只有代码没有上下文 3) 完全不写但 manager 不爽。manager 上次 1on1 说「越来越敷衍」。`
    },
    {
      key: `quick_why_now`,
      num: 3,
      title: `为什么是现在?最大的不确定是什么?`,
      hint: `时机 + 你最容易让项目崩的核心假设(PRFAQ 必问)`,
      placeholder: `例: 团队都在用 Cursor / Claude Code, 对 AI 协作接受度高。最大不确定: manager 是否会接受 AI 生成的内容?`,
      multiline: true,
      caseRef: `时机: 团队都在用 Cursor / Claude Code, 对 AI 协作接受度高, 工具能直接落地不需要培训。最大不确定: 1) manager 是否会接受 AI 生成的内容 2) 从 Slack 拉的数据噪音是否太大,是否能自动过滤掉闲聊。`
    },
    {
      key: `quick_constraints`,
      num: 4,
      title: `(可选) 有什么硬约束?`,
      hint: `技术栈 / 合规 / 强制约束。可以跳过, 但写了会让 AI 建议更精准`,
      placeholder: `例: Node.js + Postgres, 数据不出境, 必须有「人工 review 才能提交」的强制约束`,
      multiline: true,
      optional: true,
      caseRef: `技术栈: Node.js 20.x + TypeScript + Postgres + Slack/GitHub/Jira API。强制约束: 所有 AI 生成的内容必须经写报告人 review 后才能提交, 绝不允许「一键自动发送」(来自 PRFAQ 第 2 个 FAQ 担忧)。`
    }
  ],

  // 4 阶段视觉流程 — 让用户看到链条传递关系
  chain: [
    {
      phaseId: `p1`,
      phaseNum: `01`,
      name: `Analysis 分析`,
      tagline: `动手前想清楚`,
      transmits: `你的核心痛点 + PRFAQ 担忧`,
      color: `#38bdf8`
    },
    {
      phaseId: `p2`,
      phaseNum: `02`,
      name: `Plan 规划`,
      tagline: `转化为可执行 PRD`,
      transmits: `Success metrics + Scope IN/OUT`,
      color: `#a78bfa`
    },
    {
      phaseId: `p3`,
      phaseNum: `03`,
      name: `Solutioning 解决方案`,
      tagline: `生成项目宪法`,
      transmits: `Architecture decisions + project-context.md`,
      color: `#f59e0b`
    },
    {
      phaseId: `p4`,
      phaseNum: `04`,
      name: `Implementation 实施`,
      tagline: `Story 是上下文边界`,
      transmits: `Story Dev Notes 引用 project-context`,
      color: `#34d399`
    }
  ],

  // AI 一页纸生成 — system prompt
  onePagerPrompt: `你是 BMAD Method 的中文产品教练。用户在「准备工具」速通版里答了 3-4 个核心问题, 你要基于 BMAD 4 阶段方法论, 给他**针对这个具体项目**的执行建议。

**必须严格遵守的输出格式:**
直接输出 JSON, 不要 markdown 代码块包装, 不要前后加任何解释文字。Schema 如下:

{
  "phase1": "Analysis 阶段对这个项目最该做的 1-3 件具体事(用 - 列表) + 1 个最容易跳过的坑(标 ⚠️ )。每件事 1-2 句, 引用具体的 BMAD workflow 名(bmad-brainstorming / bmad-product-brief / bmad-prfaq 等)。总长度 80-120 字。",
  "phase2": "Plan 阶段同样格式, 引用 bmad-create-prd / bmad-create-ux-design 等。",
  "phase3": "Solutioning 阶段同样格式, 引用 bmad-create-architecture / bmad-generate-project-context / bmad-create-epics-and-stories。",
  "phase4": "Implementation 阶段同样格式, 引用 bmad-sprint-planning / bmad-create-story / bmad-dev-story / bmad-code-review。",
  "next_step": "用户离开这个工具后, 第一步具体该做什么?(一句话 30 字内, 必须可执行, 不要废话)"
}

**内容要求:**
- 必须针对用户的具体项目(他答的问题), 不要写通用模板话
- 引用真实的 BMAD workflow 名称(用 \`反引号\` 包)
- 每个 phase 提到「最容易跳过的坑」时要解释为什么会崩
- 避免冗长。BMAD 用户讨厌 fluff
- 如果用户的回答不够具体, 你可以在建议里说「先回头补充 X」, 但仍然要给完整的 4 个 phase 建议`,

  // 一页纸 markdown 模板 — 用 {{}} 占位符
  onePagerTemplate: `# 🎯 {{project_name}} · BMAD 一页纸

> 由 AI 时代产品开发全流程速通工具生成 · {{date}}

## 📌 你的项目核心

| 维度 | 内容 |
|---|---|
| **产品 + 痛点** | {{quick_what}} |
| **目标用户 + 现状** | {{quick_who}} |
| **时机 + 不确定** | {{quick_why_now}} |
| **硬约束** | {{quick_constraints}} |

---

## 📋 4 阶段对你来说要做的事

> 这是 AI 基于完整 BMAD 方法论 + 你的项目情况 生成的针对性建议。

### Phase 1 · Analysis 分析
{{phase1}}

⬇️ *PRFAQ 担忧 + 核心痛点 → 传递到下一阶段*

### Phase 2 · Plan 规划
{{phase2}}

⬇️ *Success metrics + Scope → 转化为架构约束*

### Phase 3 · Solutioning 解决方案
{{phase3}}

⬇️ *Architecture + project-context.md → 传递到 Story Dev Notes*

### Phase 4 · Implementation 实施
{{phase4}}

---

## 🛣 你的下一步

**{{next_step}}**

---

> **想要更细的吗?** 回到工具里点「深挖 Brief / PRD / Architecture / Story」 — 把这页里某个 phase 扩成完整的 markdown 文档。
`
};


/* ============================================================
 * BMAD_DEEPEN — 4 个按需深挖路径
 * 复用对话流 UI, 但每条路径只问 3-5 个最关键的问题
 * 速通的 3 个答案会作为前置上下文自动带入
 * ============================================================ */
window.BMAD_DEEPEN = {
  brief: {
    id: `brief`,
    title: `深挖 · Product Brief`,
    phaseId: `p1`,
    phaseNum: `01`,
    color: `#38bdf8`,
    desc: `把速通答案扩成完整的 product-brief.md (Mary 风格)`,
    estTime: `~5 分钟 · 4 题`,
    intro: `**深挖 Phase 1 · Brief**\n\n速通你已经给了产品意图、用户、时机、不确定。现在我们把这些扩成 Mary (Analyst) 会产出的那种 1-2 页执行级 Product Brief。\n\n4 个问题, 答完直接下载 \`product-brief.md\`。`,
    questions: [
      { key: `brief_alternatives_deep`, title: `市场上现有的替代方案 + 它们的具体短板`, hint: `详细列, 至少 2-3 个。如果你说「没有竞品」就再找一遍`, multiline: true, placeholder: `1) [方案 A] — 短板... 2) [方案 B] — 短板...` },
      { key: `brief_stakeholders_deep`, title: `所有利益相关方都有谁?`, hint: `用户 / 决策者 / 影响者 / 反对者 — 都列出来`, multiline: true, placeholder: `主要用户: ... / 决策者(谁批准): ... / 反对方(谁可能反对): ...` },
      { key: `brief_success_qualitative_deep`, title: `成功的「定性」描述 — 6 个月后的样子`, hint: `不只是数字。描述场景: 谁在用, 怎么用, 反应是什么`, multiline: true, placeholder: `6 个月后: ... 用户每周... manager 说...` },
      { key: `brief_kill_signal_deep`, title: `什么信号会让你 kill 这个项目?`, hint: `预先定义 kill criteria 比事后纠结好`, multiline: true, placeholder: `如果 [指标] 在 [时间] 内没达到 [数字], 我会 kill / pivot` }
    ],
    template: `# Product Brief: {{project_name}}

> 由「准备工具」深挖 Brief 路径生成 · {{date}}
> 基于速通答案 + 4 个深挖问题

## 1. 执行摘要
{{quick_what}}

## 2. 目标用户与现状
{{quick_who}}

## 3. 现有替代方案与短板
{{brief_alternatives_deep}}

## 4. 利益相关方
{{brief_stakeholders_deep}}

## 5. 时机分析 (Why Now)
{{quick_why_now}}

## 6. 成功的定性描述
{{brief_success_qualitative_deep}}

## 7. Kill / Pivot 信号
{{brief_kill_signal_deep}}

## 8. 硬约束
{{quick_constraints}}

---
## Mary 的下一步建议
- [ ] 跑 \`bmad-prfaq\` 对 Kill 信号做新闻稿压力测试
- [ ] 跑 \`bmad-market-research\` 验证替代方案清单是否完整
- [ ] 把这份 brief 交给 PM 启动 \`bmad-create-prd\`
`
  },

  prd: {
    id: `prd`,
    title: `深挖 · PRD`,
    phaseId: `p2`,
    phaseNum: `02`,
    color: `#a78bfa`,
    desc: `把速通答案扩成 13 步 PRD 的精华字段`,
    estTime: `~6 分钟 · 5 题`,
    intro: `**深挖 Phase 2 · PRD**\n\n这对应 \`bmad-create-prd\` 的 13 步工作流。我们不跑全 13 步, 只问 5 个最关键的字段 — John (PM) 一定会逼你回答的那些。\n\n答完产出可用的 \`prd.md\`。`,
    questions: [
      { key: `prd_metrics_deep`, title: `成功指标 — 必须可量化`, hint: `John 不接受「提升体验」这种废话。至少 3 条数字`, multiline: true, placeholder: `1. [指标 A] ≥ [数字]\n2. [指标 B] ≤ [数字]\n3. [指标 C] = [百分比]` },
      { key: `prd_journey_deep`, title: `核心用户旅程 — 3-7 步最短路径`, hint: `从用户进入到拿到价值的最少步骤`, multiline: true, placeholder: `1. 打开...\n2. 选...\n3. 点...\n4. 看到...\n5. 完成...` },
      { key: `prd_scope_in_deep`, title: `Scope IN — MVP 必须做什么`, hint: `具体功能 + 一句话理由`, multiline: true, placeholder: `- 功能 A: 因为 [理由]\n- 功能 B: 因为 [理由]` },
      { key: `prd_scope_out_deep`, title: `Scope OUT — 明确不做什么 (同样重要)`, hint: `让 Architect 不会过度设计。John 强制要求填这一项`, multiline: true, placeholder: `- 不做 X: 因为 [理由]\n- 不做 Y: 因为 [理由]` },
      { key: `prd_nfr_deep`, title: `非功能需求(性能/安全/合规/成本)`, hint: `挑最关键的 3-5 条`, multiline: true, placeholder: `- 性能: ...\n- 安全: ...\n- 成本: ...` }
    ],
    template: `# PRD: {{project_name}}

> 由「准备工具」深挖 PRD 路径生成 · {{date}}
> stepsCompleted: [vision, metrics, journey, scope, nfr]

## 1. Vision (源自速通)
{{quick_what}}

## 2. Why Now (源自速通)
{{quick_why_now}}

## 3. Success Metrics (可量化)
{{prd_metrics_deep}}

## 4. Core User Journey
{{prd_journey_deep}}

## 5. Scope IN (MVP)
{{prd_scope_in_deep}}

## 6. Scope OUT (明确排除)
{{prd_scope_out_deep}}

## 7. Non-Functional Requirements
{{prd_nfr_deep}}

## 8. 硬约束 (源自速通)
{{quick_constraints}}

---
## John 的下一步建议
- [ ] 跑 \`bmad-validate-prd\` 检查内部一致性
- [ ] 邀请 Sally 启动 \`bmad-create-ux-design\`
- [ ] 通过校验后, 交给 Winston 进入 Solutioning
`
  },

  arch: {
    id: `arch`,
    title: `深挖 · Architecture + Project Context`,
    phaseId: `p3`,
    phaseNum: `03`,
    color: `#f59e0b`,
    desc: `生成 architecture.md + 你项目的「宪法」project-context.md`,
    estTime: `~6 分钟 · 4 题`,
    intro: `**深挖 Phase 3 · Solutioning**\n\n这对应 \`bmad-create-architecture\` + \`bmad-generate-project-context\`。\n\n**最关键的产出是 project-context.md** — 你项目的「宪法」, 后面所有 Phase 4 工作流自动加载它。改了它就改了所有 AI 的行为。`,
    questions: [
      { key: `arch_stack_deep`, title: `技术栈 + 具体版本`, hint: `不要写「最新版」, 写具体版本号`, multiline: true, placeholder: `- Node.js 20.x\n- TypeScript 5.3\n- 框架 X.Y\n- 数据库 X.Y` },
      { key: `arch_decisions_deep`, title: `关键架构决策 (3-5 条 ADR)`, hint: `每条要能回答「为什么选这个不选别的」`, multiline: true, placeholder: `1. [决策 A] vs [备选 B] — 选 A 因为 [理由]\n2. ...` },
      { key: `arch_modules_deep`, title: `模块边界`, hint: `哪些组件独立、哪些共享、哪些禁区不能改`, multiline: true, placeholder: `- services/X (独立)\n- lib/Y (共享 wrapper, 不能改)\n- routes/ (薄, 只调 services)` },
      { key: `pc_critical_rules_deep`, title: `project-context.md 的 Critical Implementation Rules — 写「不显然」的项目特有约定`, hint: `**最重要的一题**。普世最佳实践不用写, 写「Dev Agent 猜不到的」`, multiline: true, placeholder: `- 所有 X 必须经 Y 包装\n- NEVER 在 routes 里直接 ...\n- 所有 AI 调用必须走 services/ai-gateway.ts\n- 数据库字段必须有 is_ai_generated flag` }
    ],
    template: `# Architecture & Project Context: {{project_name}}

> 由「准备工具」深挖 Solutioning 路径生成 · {{date}}

## architecture.md (节选)

### Technology Stack & Versions
{{arch_stack_deep}}

### Key Architecture Decisions
{{arch_decisions_deep}}

### Module Boundaries
{{arch_modules_deep}}

### Constraints (源自 PRD/Brief)
{{quick_constraints}}

---

## project-context.md (Constitution)

> 此文件会被 \`bmad-create-story\` / \`bmad-dev-story\` / \`bmad-code-review\` 等所有
> Phase 4 工作流自动加载。只写「不显然」的规则。

### Technology Stack & Versions
{{arch_stack_deep}}

### Critical Implementation Rules

{{pc_critical_rules_deep}}

### 来自 Brief 的强制约束
{{quick_constraints}}
`
  },

  story: {
    id: `story`,
    title: `深挖 · 第一个 Story`,
    phaseId: `p4`,
    phaseNum: `04`,
    color: `#34d399`,
    desc: `生成第一个 self-contained 的 Story 文件 (Story Context Engine)`,
    estTime: `~6 分钟 · 5 题`,
    intro: `**深挖 Phase 4 · Story**\n\n对应 \`bmad-create-story\` — BMAD 称为「整个开发过程中最重要的功能」。\n\n**关键: Dev Notes 必须引用 project-context 的硬约束 + 参考已有文件。** 这是防漂移的核心。`,
    questions: [
      { key: `story_key_deep`, title: `Story Key`, hint: `格式 epic-num-name, 例如 1-1-slack-fetcher`, multiline: false, placeholder: `1-1-first-feature` },
      { key: `story_user_story_deep`, title: `User Story`, hint: `As a [角色], I want [行为], so that [价值]`, multiline: true, placeholder: `As a [角色], I want [行为], so that [价值]` },
      { key: `story_ac_deep`, title: `Acceptance Criteria (3-5 条 BDD)`, hint: `每一条都可被自动化测试`, multiline: true, placeholder: `1. 给定 X, 当 Y, 则 Z\n2. ...\n3. 单元测试覆盖 happy path + 3 种错误场景` },
      { key: `story_tasks_deep`, title: `Tasks / Subtasks (有序, Dev 严格按这个跑)`, hint: `用 - [ ] 列表, 每一项独立可完成可测试`, multiline: true, placeholder: `- [ ] 1. 创建 ...\n- [ ] 2. 实现 ...\n- [ ] 3. 写测试 ...` },
      { key: `story_dev_notes_deep`, title: `Dev Notes — 给 Dev Agent 的上下文(最关键)`, hint: `引用 project-context 硬约束 + 参考文件路径 + 学到的教训`, multiline: true, placeholder: `> 加载自 project-context.md:\n> "All X must use Y wrapper"\n\n参考文件:\n- src/lib/...\n- 类似实现可参考 src/services/...` }
    ],
    template: `---
story_key: {{story_key_deep}}
status: ready-for-dev
stepsCompleted: [created]
---

# Story: {{story_key_deep}}

## Story
{{story_user_story_deep}}

## Acceptance Criteria
{{story_ac_deep}}

## Tasks / Subtasks
{{story_tasks_deep}}

## Dev Notes
{{story_dev_notes_deep}}

### Project Context Reference
> 自动加载 \`project-context.md\` 中的 Critical Implementation Rules
> 任何与 architecture.md 不一致的实现都会触发 correct-course

## Predicted File List
_(由 dev agent 实施时填写)_

## Test Strategy
覆盖 happy path + 主要错误路径 + 边界场景

---

## Dev Agent Record
> 由 dev agent 实施时填写

### Debug Log
_(空)_

### Completion Notes
_(空)_

## File List (actual)
_(待 dev agent 实施后更新)_

## Change Log
_(待 dev agent 实施后更新)_

## Senior Developer Review (AI)
_(待 bmad-code-review 后填写)_
`
  }
};


window.BMAD_DATA = {

  intro: {
    title: `BMAD Method 是什么?`,
    body: `BMAD = "Build More Architect Dreams" — 一套面向 AI 驱动敏捷开发的方法论。它的核心信念:**与其让 AI 替你思考,不如把 AI 变成有结构、有原则、有边界的协作者**。

它把产品开发拆成 4 个阶段、34+ 个工作流、5 个核心 Agent。每个工作流是一组「step-file 微文件」,AI 顺序执行、不可跳过、菜单处必须等用户输入。这种「约束」恰恰是让 AI 长流程不漂移的关键。

**适合谁看这份指南?**
- 没接触过 AI 产品开发流程的同学 — 跟着 4 阶段走一遍,你就有了从想法到上线的完整心智模型
- 已经在用 Cursor / Claude Code 但效果不稳定的开发者 — BMAD 的「上下文工程」会告诉你为什么
- 产品经理 — 你会学到怎么和 AI 协作出 PRD、Story、Architecture,而不是只会写需求文档

**怎么用这个工具?**
左侧目录从上往下走一遍是「完整学习路径」;不想全看,直接点感兴趣的 workflow。任何时候右上角点 ✦ 唤起 AI,它会自动带上你正在看的内容,你可以问「这一步对我项目怎么用」,或者让 AI 反过来引导式提问帮你想清楚。

> 👉 **想先看个完整案例怎么跑?** 直接点左侧的「📖 完整案例演练」— 5 分钟看完一个 AI PM 如何用 BMAD 从想法到 demo。

---

**💡 关于原创归属 (Credit)**

BMAD Method 是由 **Brian (BMad) Madison** 与 [bmad-code-org](https://github.com/bmad-code-org/BMAD-METHOD) 团队原创的开源方法论 (MIT License)。本站只是对其开源源码与官方文档做了**中文整理与可视化呈现**,所有方法论的原创性、设计巧思、概念定义都归原作者所有。

如果你觉得这套方法论有用,请到他们的 [GitHub 仓库](https://github.com/bmad-code-org/BMAD-METHOD) 给原作者一个 ⭐ Star,或加入他们的 [Discord](https://discord.gg/gk8jAdXWmj) 直接和原作者交流。`
  },

  walkthrough: {
    title: `完整案例演练 · 团队 AI 周报生成器`,
    subtitle: `跟着一个真实案例从 0 到 demo,看每一步 BMAD 帮你做了什么`,
    scenario: `**你是谁:** 某 SaaS 公司的 AI 产品经理 Sarah。

**你的搭档:** 一位全栈工程师。

**你想做什么:** 一个内部小工具 — 团队 5 个工程师每周五要写周报,大家都烦。你想做个工具自动从 Slack / GitHub PR / Jira 拉数据,生成草稿让大家改一改就能发。

**约束:**
- 只服务你这 5 人的内部工具,不是 SaaS 产品
- 想 2 周从想法到能用的 demo
- 你和搭档都用过 Claude Code,但每次跑大流程都会"漂移",不知道为什么

**这个案例里,你会看到 BMAD 的 4 个阶段如何让你 2 周内完成这件事 — 而且过程中没有返工、没有"AI 写的代码用不了"。**`,
    steps: [
      {
        phaseId: `p1`,
        phaseName: `Phase 01 · Analysis`,
        title: `跟 Mary 想清楚到底做不做`,
        narrative: `你打开 Mary,准备让她帮你出方案。她的第一个反应不是给方案,而是反问。这是 BMAD 的 Analysis 阶段最大的特点 — **永远先理解意图,再扫资料**。`,
        dialogue: [
          { who: `user`, name: `你`, text: `我想做一个 AI 周报工具,自动帮团队写周报。` },
          { who: `agent`, name: `Mary · Analyst`, color: `#38bdf8`, text: `停一下 — 在我帮你做之前,我想多了解一些。你说的"周报"是给谁看的? 是给你的 manager,还是更上层? 还有 — 你的团队现在写周报有多痛? 是写不出来,还是不想写,还是写了没人看?\n\n**Anything else? 还有别的要补充的吗?**` },
          { who: `user`, name: `你`, text: `给 manager 看。痛点是大家不想写,觉得没价值。我自己每周也要花 1 小时整合大家的内容。` },
          { who: `agent`, name: `Mary · Analyst`, color: `#38bdf8`, text: `OK 那核心问题不是「生成周报」,而是「消除写周报的成本同时让 manager 满意」。这是两个不同的产品。\n\n我建议跑一次 \`bmad-prfaq\` — 写一份完成态新闻稿,逼自己回答 manager 会问的问题: 它的内容质量比手写好吗? 准确率怎么验证? 出错时谁负责?` }
        ],
        crisis: `你跑了 PRFAQ。第二个客户 FAQ 让你卡住了 5 分钟:\n\n> "如果 AI 生成的周报有事实错误,manager 会不会因此对团队产生误解?"\n\n你想清楚了 — 必须加一道「**提交前必须人工 review**」的强制约束。这一步在你最初的想法里完全没有。\n\n**如果跳过 PRFAQ,你会做出一个「一键自动发送」的产品,然后在第一次出错时被 manager 投诉,产品死掉。**`,
        artifact: {
          name: `project-brief.md (节选)`,
          body: `# 内部工具: 团队周报草稿生成器

## 核心问题
不是"生成周报",而是"在保证准确率的前提下,
消除每周 1 小时写周报的成本"。

## 关键约束 (来自 PRFAQ 第 2 个 FAQ)
所有生成内容必须经写报告人 review 后才能提交,
绝不允许"一键自动发送"。

## Why Now
团队已经在用 Cursor / Claude Code,对 AI 协作
的接受度高 — 工具能直接落地不需要培训。`
        },
        takeaway: `跳过 Analysis 阶段不是省时间,是提前埋雷。Mary 的「先理解意图再帮你做」挽救了你后面 2 周的返工 — 一个"一键发送"的工具会让产品死掉。`
      },
      {
        phaseId: `p2`,
        phaseName: `Phase 02 · Plan`,
        title: `John 写 PRD,Sally 设计 UX`,
        narrative: `你召唤 John 跑 \`bmad-create-prd\`。这是 13 步的 step-file 工作流,每一步是一个独立微文件。John 不会让你填模板 — 他会从 step-02-discovery 开始问问题。`,
        dialogue: [
          { who: `agent`, name: `John · PM`, color: `#a78bfa`, text: `(step-03-success) 成功指标 — 你怎么知道这个工具成功了?` },
          { who: `user`, name: `你`, text: `提升团队效率。` },
          { who: `agent`, name: `John · PM`, color: `#a78bfa`, text: `不可量化。重新说。` },
          { who: `user`, name: `你`, text: `(卡了一下) 成功 = 5 人 × 每周 30 分钟 = 每周 150 分钟节省,而且 manager 收到的周报质量评分 ≥ 4/5。` },
          { who: `agent`, name: `John · PM`, color: `#a78bfa`, text: `好。这才是可量化目标。我会写进 PRD。\n\n(step-08-scoping) 现在告诉我 OUT 的部分 — 明确不做什么。这一步很多 PM 跳过,但它让 Architect 后面不会过度设计。` },
          { who: `user`, name: `你`, text: `不做富文本编辑器(textarea 就行)、不做版本对比、不做团队管理(只支持我这 5 人组)、不做移动端、不做自动发送。` },
          { who: `agent`, name: `Sally · UX`, color: `#34d399`, text: `(接手做 UX) 我画 3 个 wireframe: 配置页 → 一键生成页 → 编辑确认页。\n\n**特别提醒:** 每个可编辑字段必须有明显视觉提示告诉用户「这是 AI 生成的草稿,请你确认」。这是 Phase 1 那个 PRFAQ 里 manager 担忧的延续 — UX 必须把那个约束物化出来。` }
        ],
        artifact: {
          name: `prd.md (节选)`,
          body: `## 成功指标
- 团队总时间节省: ≥ 150 min/周
- Manager 满意度: ≥ 4/5 (季度调研)
- 草稿被采纳率: ≥ 70% (用户少做大改)

## Scope IN
- Slack 频道消息抓取 (last 7 days)
- GitHub PR 列表 (本周 merged + opened)
- Jira ticket status 变化
- 一键生成 + 编辑 + 复制到剪贴板

## Scope OUT (明确排除)
- 富文本编辑器
- 版本对比 / diff
- 团队管理 / 多团队
- 移动端
- 自动发送 (强制人工确认)

## UX 关键约束
所有 AI 生成的字段必须有视觉标记 + "请确认"提示`
        },
        takeaway: `PRD 不是一次性写完的文档,是 13 步对话的产物。每一步都有 John 在提醒你「不可量化」、「必须写 OUT」。Sally 的 UX 决策又把 Phase 1 的约束物化成了具体的视觉规范 — 这就是 BMAD 阶段之间的"接力"。`
      },
      {
        phaseId: `p3`,
        phaseName: `Phase 03 · Solutioning`,
        title: `Winston 做架构,生成项目宪法`,
        narrative: `你召唤 Winston 跑 \`bmad-create-architecture\`。Winston 不会上来就推荐技术栈 — 他先问你和搭档的背景。`,
        dialogue: [
          { who: `agent`, name: `Winston · Architect`, color: `#f59e0b`, text: `你们团队的技术栈是什么? 你和搭档擅长什么?` },
          { who: `user`, name: `你`, text: `Node.js + TypeScript 多年。Postgres 是公司标配。` },
          { who: `agent`, name: `Winston · Architect`, color: `#f59e0b`, text: `好,那就用这些。**Embrace boring technology。** 我看了你的 PRD,Slack / GitHub / Jira 三个集成是核心。我会建议:\n\n1. 单体 Express 应用 (5 个用户不需要微服务)\n2. 三个独立的 fetcher 模块 (易测试、易替换)\n3. AI 调用走单独 service 层 (将来换模型不影响业务逻辑)\n4. 不用 ORM, 直接 sql template — 你只有 5 张表, Prisma 是过度设计\n\n现在最关键的一步: 跑 \`bmad-generate-project-context\` 写一份 project-context.md。这是你项目的"宪法",所有 Phase 4 工作流会自动加载它。` },
          { who: `user`, name: `你`, text: `(写 constitution 时想起来一件事) 哦对,我们之前被 Slack rate limit 坑过 — 必须让所有 Slack 调用走 retry-with-backoff wrapper。还有,所有 AI 生成的字段在 db 里要有 \`is_ai_generated\` flag 和 \`human_reviewed_at\` timestamp,这是 PRFAQ 那道闸的延续。` },
          { who: `agent`, name: `Winston · Architect`, color: `#f59e0b`, text: `**这就是 project-context.md 该写的东西** — 不显然的、项目特有的约定。普世最佳实践不用写,Dev Agent 自己知道。你写下来的是它"猜不到"的东西。\n\n这份文档接下来会被 \`bmad-create-story\`、\`bmad-dev-story\`、\`bmad-code-review\` 自动加载。所有 Agent 行为都跟着它走 — 改它就改了所有 AI 的行为。` }
        ],
        artifact: {
          name: `project-context.md (节选)`,
          body: `## Tech Stack & Versions
- Node.js 20.x, TypeScript 5.3
- Express 4.x (no Next.js)
- node-postgres (no ORM)
- OpenAI SDK (model: configurable via env)

## Critical Implementation Rules

### API Integrations
- Slack / GitHub / Jira fetchers MUST use
  retryWithBackoff() from lib/retry.ts
- NEVER call third-party APIs directly from routes
- All AI calls MUST go through services/ai-gateway.ts
  (for model swapping + cost tracking)

### Generated Content (CRITICAL)
- Every AI-generated field in DB must have:
  - is_ai_generated: boolean (= true)
  - human_reviewed_at: timestamp (null until reviewed)
- API responses serving AI content must include both flags
- UI must show "AI 草稿 · 请确认" badge until reviewed`
        },
        takeaway: `project-context.md 是 BMAD 与其他 AI 开发工具最大的差异。它把"不显然的项目约定"显式写下来,所有后续 AI 都听它的。你看到 Phase 1 那个 PRFAQ 担忧 → Phase 2 的 UX 规范 → Phase 3 的 db schema 约束 → 这是同一条线在不同阶段的物化。`
      },
      {
        phaseId: `p4`,
        phaseName: `Phase 04 · Implementation`,
        title: `Amelia 实施,Story 是上下文边界`,
        narrative: `你跑 \`bmad-sprint-planning\`,生成 sprint-status.yaml,把 5 个 Story 排序: 1-1-slack-fetcher → 1-2-github-fetcher → 1-3-jira-fetcher → 1-4-ai-aggregator → 1-5-review-ui。第一个开干。\n\n你召唤 Amelia 跑 \`bmad-create-story\` 1-1-slack-fetcher。**这是整个开发过程中最重要的一步** — Amelia 没有简单复制 epic 内容,她 EXHAUSTIVE 分析了 architecture.md / project-context.md / prd.md, 产出了一份完整的 story 文件。`,
        dialogue: [
          { who: `agent`, name: `Amelia · Dev`, color: `#34d399`, text: `Story 1-1-slack-fetcher 创建完成。我把 project-context.md 的关键约束直接嵌进了 Dev Notes — 包括 retryWithBackoff 的强制要求和 NEVER call APIs from routes 这条。\n\n参考文件我也找好了: lib/retry.ts (已存在)、db/schema.sql、services/jira-fetcher.ts (类似实现)。` },
          { who: `agent`, name: `Amelia · Dev`, color: `#34d399`, text: `(跑 bmad-dev-story 实施中) Task 5 写测试时发现 lib/retry.ts 的 timeout 默认值在测试里太长会让测试超时。我**不会改 retry.ts 本身** (project-context 里说 NEVER 改 lib/),改用 mock 临时覆盖 timeout。已记录在 Dev Agent Record 里。` },
          { who: `agent`, name: `Code Review (Adversarial)`, color: `#f87171`, text: `**必须找出问题** — 我是 fresh context 跑的,看不到原始 reasoning,只评估 artifact:\n\n1. **HIGH** — \`slack-fetcher.ts:42\` error message 直接打印了 channel ID,可能在日志里泄露内部信息\n2. **MEDIUM** — retry 计数没记 metric,以后排查时不知道 retry 了几次` },
          { who: `user`, name: `你`, text: `修了 HIGH。MEDIUM 移到 backlog,不在当前 story 范围。` },
          { who: `agent`, name: `Checkpoint Preview`, color: `#a78bfa`, text: `(你说"checkpoint"激活我) 5 步带你过这次改动:\n\n**1. Orientation** — 这次改动碰了 4 个文件: slack-fetcher.ts, slack-fetcher.test.ts, db migration, env config。Logic 行数: ~120。\n**2. Walkthrough** — 按 concern 走读,不按 file: ① API 集成 ② 错误处理 ③ 数据写库\n**3. Detail Pass** — 一个 [security] 风险点: env 里的 SLACK_TOKEN 没用 secret manager。建议确认\n**4. Testing** — 建议你手动用一个真实 Slack channel 跑一次,看是否能拉到消息\n**5. Wrap-Up** — 看起来可以 ship。要批准吗?` }
        ],
        artifact: {
          name: `stories/1-1-slack-fetcher.md (节选)`,
          body: `---
story_key: 1-1-slack-fetcher
status: ready-for-dev
---

## Story
作为内部工具的用户, 我想让系统从指定的 Slack 频道
拉取过去 7 天的消息, 这样后续的 AI 聚合器能基于
真实活动生成草稿。

## Acceptance Criteria
1. 给定 channel ID 和 7 天的时间窗,fetcher 返回所有消息
2. 网络错误时自动 retry 3 次,每次间隔翻倍
3. 单个 channel 超过 1000 条消息时分页取
4. 返回的数据结构匹配 db 表 messages 的 schema
5. 单元测试覆盖 happy path + 3 种错误场景

## Dev Notes
> 加载自 project-context.md 的关键约束:
> "All Slack API calls must use retryWithBackoff()"
> "NEVER call third-party APIs directly from routes"

参考文件:
- src/lib/retry.ts (已存在,直接用)
- src/db/schema.sql (messages 表 schema)
- 类似实现可参考 src/services/jira-fetcher.ts

## Tasks / Subtasks
- [ ] 1. 在 src/services/ 创建 slack-fetcher.ts
- [ ] 2. 实现 fetchChannelMessages(channelId, since)
- [ ] 3. 用 retryWithBackoff 包装 API 调用
- [ ] 4. 实现分页 (cursor-based)
- [ ] 5. 写单元测试 (mock @slack/web-api)
- [ ] 6. 测试 happy path + rate limit + network + empty
- [ ] 7. 全部测试通过`
        },
        takeaway: `Story 文件不是任务卡 — 它是一份**完整的实施边界**。Dev Agent 看一份 story 就能跑通,因为里面有 Dev Notes (引用 project-context)、参考文件路径、测试要求。Amelia 在实施时遇到 lib/retry.ts timeout 的问题,她不会"自己改一下 lib",因为 project-context 里说不能 — 这就是上下文工程的真正解锁点。`
      }
    ],
    summary: {
      title: `2 周后,demo 跑通了 — 你学到了什么?`,
      table: `| 阶段 | 关键洞察 |
|---|---|
| Analysis | 跳过它不是省时间,是埋雷。Mary 的反问救了你 2 周返工 |
| Plan | PRD 不是一次性写完的文档,是 13 步对话的产物 |
| Solutioning | project-context.md 是项目的宪法,所有后续 AI 都听它的 |
| Implementation | Story 是上下文边界,不是任务卡 |`,
      conclusion: `**整套流程不是在让 AI 替你工作,是在让你和 AI 都更清楚要做什么、不做什么、怎么做。**

回头看这条线:
- Phase 1 PRFAQ 的担忧("AI 出错会让 manager 误解团队")
- → Phase 2 UX 规范("每个字段都要有 AI 草稿标记")
- → Phase 3 project-context.md ("db 里必须有 is_ai_generated flag")
- → Phase 4 Story Dev Notes (Amelia 实施时自动加载这个约束)
- → Phase 4 Adversarial Review (Reviewer 用 fresh context 校验)

**同一条约束在 4 个阶段被层层物化、自动传递、永远不丢。** 这就是 BMAD 真正的价值 — 不是某个 prompt 写得好,是整套阶段之间的"接力跑"。

---

**下一步你可以做什么?**
- 点左侧任一阶段卡片,看那个阶段的所有工作流详情
- 点右上角「✦ 问 AI」,告诉它你自己的项目情况,让它帮你裁剪流程
- 如果你的项目很小,问问 AI:"我可不可以只跑 quick-dev?"`
    }
  },

  phases: [
    {
      id: `p1`,
      num: `01`,
      name: `Analysis 分析`,
      slug: `analysis`,
      color: `#38bdf8`,
      tagline: `动手前先想清楚 — 问题、市场、用户、可行性`,
      goal: `在写下任何 PRD 之前先把「为什么做」和「做什么」想透。BMAD 把这件事拆成 4 类工具:头脑风暴、研究、产品简报、PRFAQ — 每一种针对不同的不确定性。跳过分析,你的 PRD 就建立在假设之上,下游每一个文档都会继承这份模糊。`,
      sourcePath: `src/bmm-skills/1-analysis/`,
      principles: [
        { title: `需求源自访谈,不源自模板`, body: `PRD 是从用户对话里长出来的,不是填空题。Analysis 阶段的工具本质上都在帮你「做对话」。` },
        { title: `Capture-don't-interrupt 模式`, body: `用户 brain dump 时,即使提到了不属于 brief 范围的需求 / 平台 / 技术细节,也悄悄记下来,不打断他的思路。` },
        { title: `Anything else 模式`, body: `在每个自然停顿点反复问「还有别的要补充的吗?」— 这一句话会持续挖出用户自己都没意识到的上下文。` },
        { title: `先理解意图,再扫描资料`, body: `在没搞懂用户想做什么之前,扫文档是噪音不是信号。意图先行。` }
      ],
      decisionMatrix: [
        { when: `我有个模糊想法,不知从哪开始`, choose: `Brainstorming` },
        { when: `我需要先了解市场再决定`, choose: `Research (market/domain/technical)` },
        { when: `我知道要做什么,只想记录下来`, choose: `Product Brief` },
        { when: `我想确认这个想法值不值得做`, choose: `PRFAQ (Working Backwards)` },
        { when: `我要在已有系统上改造`, choose: `Document Project` },
        { when: `我想完整跑最严格流程`, choose: `Brainstorming → Research → PRFAQ` }
      ],
      quote: `如果你写不出一份令人信服的新闻稿,这个产品就还没准备好。Working Backwards 让弱思考在最便宜的时候暴露出来。`,
      workflows: [
        {
          id: `w-brainstorming`,
          name: `bmad-brainstorming`,
          title: `头脑风暴`,
          tagline: `60+ 创意技法的引导式头脑风暴`,
          when: `想法模糊、需要发散、想压力测试不同方向`,
          how: `**这不是让 AI 给你点子,是让 AI 当教练把你脑子里的点子挖出来。** AI 会用结构化的练习创造一个让你最佳思考能浮出水面的环境。

**怎么跑:**
1. **Setup** — 定义主题、目标、约束
2. **选方法** — 自己挑技法 / AI 推荐 / 随机抽 / 渐进式流程
3. **引导** — AI 用追问和协作教练法带你过每一种技法
4. **整理** — 把想法分组、按主题排列、定优先级
5. **行动** — 最优想法配上下一步与成功指标

所有内容会被存成一份 session document,你之后可以引用或分享给团队。

**核心信念: 每个想法都来自你。AI 创造让灵感涌现的条件 — 你才是源头。**`,
          detailedSteps: `**Step 1 · 会话设置**
- 检测是否有未完成的旧会话(在 \`{output_folder}/brainstorming/\` 下找历史文件)
- 如果有,问你「继续旧的 / 开新的 / 看全部」
- 创建新会话文件,带 frontmatter 追踪进度
- 加载可选的 project context 文件

**Step 2 · 主题与目标确认**
- 让你描述「想要 brainstorm 什么主题」
- 询问目标:发散还是收敛?创意还是问题解决?
- 询问约束:时间、领域、利益相关方
- 全部记录到会话文件 frontmatter

**Step 3 · 技法选择**(4 种模式)
- **自己选** — 显示 60+ 技法清单,你挑
- **AI 推荐** — 基于你的主题,AI 推荐 5 个最匹配的
- **随机** — 随机抽 1 个
- **渐进流程** — AI 串联 3-5 个技法成一个完整 session

**Step 4 · 引导执行(核心循环)**
- 每用一个技法,AI 用追问 + 教练法带你深挖
- **强制反偏见协议:** 每出 10 个想法,AI 必须切换创意维度(技术 → 用户体验 → 商业可行性 → 黑天鹅事件)
- 目标是「100+ 个想法」再开始整理 — 前 20 个通常是显然的,魔法发生在 50-100

**Step 5 · 整理与排序**
- 把想法按主题分组
- 按价值/可行性排序
- 标记「必须探索」「值得尝试」「待考虑」「淘汰」

**Step 6 · 行动项**
- 每个 top 想法配上「下一步该做什么」「成功指标是什么」
- 输出最终 session 文档`,
          runFlow: `**典型对话片段:**

> **你:** 帮我 brainstorm 一下我们团队的 AI 周报工具该有哪些功能
>
> **Mary (Brainstorm 教练):** 在我开始之前,先确认一下 — 你想要的是发散(尽量多的想法)还是收敛(从已有想法里挑最好的)?另外,有什么硬约束吗?(预算、时间、人手、技术栈)
>
> **你:** 发散。约束:Node.js 技术栈,2 周内做完 demo,只服务我自己 5 人团队。
>
> **Mary:** 好。我推荐用「Five Whys」+「SCAMPER」+「Reverse Brainstorming」三种技法串起来。要不要我先用 Five Whys 帮你挖一下「写周报」这件事的根本问题?
>
> **你:** 好。
>
> **Mary:** 第一问 — 为什么需要写周报?
>
> **你:** 让 manager 知道团队这周做了什么。
>
> **Mary:** 第二问 — 为什么 manager 需要知道?
>
> **你:** 因为他要做季度总结...也要决定下季度资源分配。
>
> **Mary:** 第三问 — 那为什么这件事一定要*团队成员*来写?manager 看的本质是「事实」,不是「叙述」。
>
> **你:** ⚡ 等等 — 这一问点醒了我。manager 要的是「这周做了什么 + 影响是什么」,不一定要每个人手写。
>
> **Mary:** 好,这是一个新的 framing 方向。先不评判好坏,记下来。我们继续 — 第四问...
>
> *(对话继续 ~15-30 分钟,产出 80-120 个想法和 3-5 个 framing reframings)*`,
          pitfalls: [
            { problem: `AI 自己开始生成想法,而不是引导你`, fix: `打断它,说「我是要你当教练帮我挖,不是替我想。你只问问题。」` },
            { problem: `太早收敛 — 出了 10 个想法就开始排序`, fix: `BMAD 的硬规则是 100+ 个想法再排序。前 20 个都是显然的,魔法在 50-100。坚持下去` },
            { problem: `想法语义聚类(都集中在一个维度)`, fix: `Anti-bias 协议要求每 10 个想法切换一次维度。提醒 AI:「现在换到 UX / 商业 / 边界场景 维度」` }
          ],
          outputs: [`brainstorming-session.md (含技法、分组、行动项)`],
          source: `src/core-skills/bmad-brainstorming/`
        },
        {
          id: `w-product-brief`,
          name: `bmad-product-brief`,
          title: `Product Brief 产品简报`,
          tagline: `1-2 页的执行级产品简报,引导/Yolo/Autonomous 三模式`,
          when: `想法已比较清晰、只需要结构化记录下来`,
          how: `**目标:** 产出一份 1-2 页的执行级 Product Brief,以及一份给下游 PRD 用的 token-efficient 的 LLM distillate。

**关键原则:**
- 用户是领域专家。Mary 提供结构化思考、引导、市场嗅觉、综合大量输入的能力。**两人作为对等伙伴协作,不是甲乙方。**
- 设计原理: **永远先理解意图,再扫文档。** 不知道 brief 是关于什么的,扫文档就是噪音。

**5 个阶段:**
1. **Understand Intent** — 这是关于什么? (在 SKILL.md 里直接处理)
2. **Contextual Discovery** — 派发 subagents 分析已有 artifacts + 网络调研
3. **Guided Elicitation** — 用聪明的提问填补空白
4. **Draft & Review** — 出草稿、派发 review subagents
5. **Finalize** — 抛光、输出、提供 distillate

**3 种激活模式:**
- **Guided** (默认) — 对话式发现,有 soft gates
- **Yolo** — 「直接起草」一次性吃进所有输入,直接出完整草稿,然后陪用户打磨
- **Autonomous** — \`--autonomous\` 标志,headless 完整产出,无交互`,
          detailedSteps: `**Stage 1 · Understand Intent (理解意图)**
- 探测 brief 类型: 商业产品 / 内部工具 / 研究项目 / 其他
- 多想法消歧: 如果你同时提了 N 个方向,帮你选一个聚焦
- **关键模式 — Capture-don't-interrupt**: 你 brain dump 时即使提到「需求 / 平台 / 技术细节」,Mary 也不打断,只是悄悄记下来留给 distillate
- **关键模式 — "Anything else?"**: 在每个自然停顿点都问「还有别的要补充的吗?」,这一句话会持续挖出你自己都没意识到的上下文

**Stage 2 · Contextual Discovery (上下文发现)**
- 派发 subagents 并行扫描 \`{planning_artifacts}\` 和 \`{project_knowledge}\`
- 派发 web research subagent 做市场调研
- 注意: Mary 自己不读你给的文档,subagent 来读 — 因为 Mary 必须先理解意图

**Stage 3 · Guided Elicitation (引导式补全)**
- 用聪明的提问填补空白(不是问卷,是对话)
- 每轮回答后都做 capture-don't-interrupt

**Stage 4 · Draft & Review (草稿 + 评审)**
- Mary 起草 brief
- 派发 review subagents 并行审稿(发现遗漏 / 矛盾 / 弱论证)

**Stage 5 · Finalize (定稿)**
- 抛光语言
- 输出最终 brief
- 询问是否要 distillate(给 PRD 用的 token-efficient 详细版)`,
          runFlow: `**典型对话片段:**

> **你:** 我想为我的 5 人技术团队做一个内部 AI 周报工具。
>
> **Mary:** 好的 — 在我开始之前,先确认一下:这是 brief 类型里的哪一种?
>
> 1️⃣ 商业产品(给外部客户)
> 2️⃣ 内部工具(给自己/团队/公司)
> 3️⃣ 研究项目
> 4️⃣ 其他
>
> **你:** 内部工具。
>
> **Mary:** 收到。注意 — 既然是内部工具,我后面会用「stakeholder value」和「adoption path」来 frame,而不是「市场差异化」。
>
> 现在告诉我,**用一段话描述这个工具想解决什么** — 不要列功能,先讲「为什么」。
>
> **你:** 团队每个人每周五要花 30 分钟写周报,大家都烦。我自己也要花 1 小时整合大家的内容给 manager。
>
> **Mary:** 好 — 我听到的是「每周五人 × 30 分钟 + 你 60 分钟,总共 ~3.5 小时被吃掉」,而且**大家都烦**。这两件事可能是不同问题:
> - 写周报本身的「成本」(150 分钟)
> - 写周报的「情绪负担」(为什么烦?)
>
> **(Anything else?)** 还有别的我应该知道的吗?比如:你有没有任何技术约束、平台偏好、文档?
>
> **你:** 哦对,我们用 Slack + GitHub + Jira。希望工具能从这三个地方拉数据。技术栈是 Node.js。
>
> **Mary:** *(silently captures: tech_stack=Node, integrations=[Slack,GitHub,Jira])* 好。这些细节我先记下,brief 里不会写,但 distillate 里会保留给 PM/Architect 用。
>
> 继续 — 你的 manager 看周报最关心的是什么?事实? 进展? 问题? 个人贡献?
>
> *(对话继续约 15-25 分钟,Mary 持续做意图 → 上下文 → elicitation,最后产出 1-2 页 brief)*`,
          pitfalls: [
            { problem: `Mary 一上来就给方案,而不是问问题`, fix: `重启对话,明确说「不要给我方案。先理解我要做什么。Stage 1 = Understand Intent。」` },
            { problem: `你 brain dump 时被反复打断要求「先整理一下」`, fix: `提醒 Mary 用 capture-don't-interrupt 模式,你说完她再整理` },
            { problem: `brief 写出来太空,像「优化用户体验」这种废话`, fix: `每条断言后逼 Mary 加「具体表现是什么 / 怎么验证 / 量化指标」` }
          ],
          outputs: [`product-brief.md (1-2 页)`, `distillate.md (LLM 友好的详细版)`],
          source: `src/bmm-skills/1-analysis/bmad-product-brief/`
        },
        {
          id: `w-prfaq`,
          name: `bmad-prfaq`,
          title: `PRFAQ — Working Backwards`,
          tagline: `亚马逊「先写新闻稿」方法,把弱思考逼到台面上`,
          when: `想法不确定要不要做、需要被严格挑战`,
          how: `**亚马逊 Working Backwards 方法的 BMAD 版本。** 在写一行代码之前先写完成态的新闻稿,然后回答客户和利益相关方最尖锐的问题。AI 在这里是「relentless but constructive 的产品教练」。

**为什么用它:**
- 强制你 customer-first — 你要为每一句话辩护
- 写不出一份令人信服的新闻稿 = 产品还没准备好
- 客户 FAQ 答不出来的地方,就是你之后会在实施阶段付出 10 倍代价的地方
- 这道关口让弱思考在最便宜的时候暴露

**什么时候用:**
- 想在投入资源前 stress-test 概念
- 不确定用户会不会 care
- 想验证能不能讲清楚一个有说服力、能辩护的价值主张
- 单纯想用 Working Backwards 的纪律磨锐你的思路`,
          detailedSteps: `**Stage 1 · Ignition (点火)**
- 立刻强制 customer-first 框架
- 三种用户开场的处理方式:
  - 用「我想用 X 技术」开场 → **挑战更狠**:技术是 how 不是 why,逼你说出人的痛点
  - 用「我想做 X 产品」开场 → 重定向到客户问题,不让你跳过痛点
  - 用「客户有 X 问题」开场 → 深挖具体细节(他们今天怎么应付? 试过什么? 为什么没解决?)
- 抓住 4 个 essentials:谁是客户(具体 persona)/ 问题(具体可感)/ stakes / 初步方案
- 检测 concept type(commercial / internal / open-source / community)用于后面 FAQ 校准

**Stage 2 · Press Release (新闻稿)**
- 用「写完成态新闻稿」的格式
- Headline 必须能让人想点开
- 引言段必须包含: 发布的产品 / 客户问题 / 解决方案 / 客户引言(假装的)
- 每写一稿 PRFAQ 教练就挑战一稿,直到「能让一个陌生人 5 秒内 get」

**Stage 3 · Customer FAQ (客户 FAQ)**
- 假装客户问最尖锐的问题:
  - 「我为什么应该相信这个有用?」
  - 「跟竞品比有什么不同?」
  - 「价格 / 切换成本 / 学习成本是什么?」
  - 「会不会出错? 出错谁负责?」
- 每个问题你都要给出能站住的答案,答不出来就是产品没准备好的信号

**Stage 4 · Internal FAQ (内部 FAQ)**
- 假装利益相关方(投资人 / manager / 工程师)问硬问题:
  - 「unit economics 算得过账吗?」
  - 「技术上做得出来吗?」
  - 「First 100 users 怎么获取?」
  - 「最大风险是什么?」

**Stage 5 · Verdict (评判)**
- Mary 综合所有 stages 给出诚实评估:
  - **Strong** — 概念站得住,可以推进
  - **Promising but gaps** — 哪几个 FAQ 没回答好,需要补
  - **Not ready** — 建议先 \`bmad-brainstorming\` 重来`,
          runFlow: `**典型对话片段:**

> **你:** 我想做一个 AI 周报工具,自动从 Slack/GitHub/Jira 拉数据生成草稿。
>
> **Mary (PRFAQ 教练):** 停。你这是用「solution」开场。我问你 — **谁**是客户? **他们今天怎么写周报?** **写得有多痛?**
>
> **你:** 客户是我们 5 个工程师 + 我自己。今天每个人花 30 分钟写,大家都烦。
>
> **Mary:** 「烦」不够。烦到什么程度? 烦得有人会跳过吗? 烦得周报质量越来越差吗? 烦得 manager 已经在抱怨了吗?
>
> **你:** 烦得有 2 个人经常跳过。manager 上次 1on1 说周报「越来越敷衍」。
>
> **Mary:** OK 这才是真问题。**真正的痛点不是「写周报麻烦」,而是「周报质量已经在崩,但团队还在被这件事消耗」。** 这是个完全不同的产品。
>
> 现在,请你写一行「完成态新闻稿」的 headline — 假装产品已经发布,你怎么宣布?
>
> **你:** 「Team Pulse 周报助手:让你的团队在 5 分钟内交出 manager 满意的周报」
>
> **Mary:** 不行。两个问题: ① 谁是 Team Pulse? 他们是谁? ② 「manager 满意」是什么意思?可量化吗?
>
> **你:** (改) 「内部上线: AI 周报助手 — 把 5 人技术团队的周报时间从 150 分钟压到 25 分钟,manager 满意度从 2.8 升到 4.2」
>
> **Mary:** ✓ 数字可量化、有 before/after 对比、有具体团队规模。这才像新闻稿。
>
> 现在 — Customer FAQ 第一问: **「如果 AI 生成的内容有事实错误,manager 会不会因此误解团队? 谁负责?」**
>
> *(你卡住了 5 分钟,意识到必须有强制人工 review 步骤 — 这就是 PRFAQ 的价值)*`,
          pitfalls: [
            { problem: `Mary 太温柔,不挑战`, fix: `提醒她「这是 hardcore mode,不准 looks-good。挑战更狠一点」` },
            { problem: `你写的 headline / FAQ 都是模糊的`, fix: `Mary 应该逼你「具体的客户 / 数字 / before-after」。如果她没逼,你主动说「这条不够具体,帮我重写」` },
            { problem: `PRFAQ 跑完你觉得「我的想法被否定了」`, fix: `这是好事 — failing here saves wasted effort。被否定 = 省了 2 周返工` }
          ],
          outputs: [`prfaq.md (新闻稿 + 内部 FAQ + 外部 FAQ)`],
          source: `src/bmm-skills/1-analysis/bmad-prfaq/`
        },
        {
          id: `w-document-project`,
          name: `bmad-document-project`,
          title: `Document Project 项目盘点`,
          tagline: `扫描已有项目,生成给人看也给 LLM 看的档案`,
          when: `Brownfield (已有项目) 第一次接入 BMAD`,
          how: `**问题:** 你接手一个老项目要加新功能,但项目里有几十个文件、几十个约定,AI 不知道也不可能一口气读完。

**做法:** Mary 派出 subagents 并行扫描代码库,产出一份 LLM 友好的项目档案 — 模块边界、命名约定、关键文件、技术栈。这份档案之后会被所有 Phase 4 工作流自动加载。

**这是 brownfield 项目的「地基铺设」。** 没有它,后续所有 AI 操作都会发挥过度。`,
          outputs: [`project-documentation.md`, `tech-stack.md`, `module-map.md`],
          source: `src/bmm-skills/1-analysis/bmad-document-project/`
        },
        {
          id: `w-research`,
          name: `bmad-{market,domain,technical}-research`,
          title: `Research 三件套`,
          tagline: `市场 / 领域 / 技术 三种独立的调研工作流`,
          when: `进入陌生领域、怀疑有竞品没扫到、技术路径不确定`,
          how: `**Market Research** — 看竞争格局、趋势、用户情绪。

**Domain Research** — 补行业知识、术语、规则。

**Technical Research** — 验证可行性、架构选项、实现路径。

**关键: 三种可以独立跑,也可以串起来跑。** 不强制全跑,按你的不确定性挑。`,
          outputs: [`market-research.md`, `domain-research.md`, `technical-research.md`],
          source: `src/bmm-skills/1-analysis/research/`
        }
      ],
      agents: [`mary`]
    },

    {
      id: `p2`,
      num: `02`,
      name: `Plan 规划`,
      slug: `planning`,
      color: `#a78bfa`,
      tagline: `把分析洞察转化为结构化 PRD 与 UX 设计`,
      goal: `Plan 阶段的核心是 bmad-create-prd — 一个 13 步的 step-file 工作流。每一步都是一个独立的微文件,顺序执行、不可跳过、不可优化、菜单处必须 HALT 等用户输入。这种「约束」恰恰是让 AI 能可靠跑完长流程的关键。`,
      sourcePath: `src/bmm-skills/2-plan-workflows/`,
      principles: [
        { title: `Step-File 架构 (强制规则,无例外)`, body: `🛑 NEVER 同时载入多个 step file · 📖 ALWAYS 完整读完当前 step 再行动 · 🚫 NEVER 跳步或自行优化顺序 · ⏸️ ALWAYS 在菜单处 HALT 等输入 · 💾 ALWAYS 在 frontmatter 的 stepsCompleted 数组里更新进度。` },
        { title: `Just-In-Time Loading`, body: `永远只把当前 step file 放在内存里。看不到未来的步骤,就不会「提前发挥」。这是让 AI 长流程不漂移的关键。` },
        { title: `Append-Only 文档构建`, body: `PRD 是按 step 顺序追加内容到同一个文件,不是一次生成 + 多次重写。每写完一段,在 frontmatter 里登记。` },
        { title: `Greenfield vs Brownfield 自适应`, body: `如果检测到已有项目文档,PRD 工作流会自动切换为「我要在已有系统上加什么 / 改什么」的模式,而不是从零定义产品愿景。` }
      ],
      decisionMatrix: [
        { when: `从零创建 PRD`, choose: `bmad-create-prd` },
        { when: `改已有 PRD`, choose: `bmad-edit-prd` },
        { when: `PRD 草稿要进 Solutioning 之前`, choose: `bmad-validate-prd` },
        { when: `需要 UX 规范 / wireframe`, choose: `bmad-create-ux-design` }
      ],
      quote: `PRDs emerge from user interviews, not template filling. — John (PM)`,
      workflows: [
        {
          id: `w-create-prd`,
          name: `bmad-create-prd`,
          title: `Create PRD`,
          tagline: `13 步引导式 PRD 创建,step-file 架构`,
          when: `从零创建 PRD`,
          how: `**John 主导的 13 步流程,每一步是一个独立的微文件:**

1. \`step-01-init\` — 初始化、加载 config、扫描已有 artifacts
2. \`step-02-discovery\` — 项目发现: 类型 (web/API/mobile/...)、领域 (healthcare/fintech/...)、上下文 (greenfield vs brownfield)、复杂度
3. \`step-02b-vision\` — 产品愿景
4. \`step-02c-executive-summary\` — 执行摘要
5. \`step-03-success\` — 成功指标 (必须可量化)
6. \`step-04-journeys\` — 核心用户旅程
7. \`step-05-domain\` — 领域细节
8. \`step-06-innovation\` — 创新点
9. \`step-07-project-type\` — 项目类型确认
10. \`step-08-scoping\` — 范围 (IN / OUT 都要写)
11. \`step-09-functional\` — 功能需求
12. \`step-10-nonfunctional\` — 非功能需求
13. \`step-11-polish\` + \`step-12-complete\` — 打磨与完成

**最重要的不是 13 步,而是这套约束:**
- 永远只载入当前 step 文件
- 完整读完才行动
- 不准跳步
- 菜单处 HALT 等用户选 'C' (Continue)
- 每写完一段,frontmatter 的 stepsCompleted 数组要登记

**这套约束让 AI 在长流程里「看不到未来」,就不会「提前发挥」。** 这是 BMAD 与普通 prompt 工程最深的差异之一。`,
          detailedSteps: `**每个 step 的真实结构(以 step-02-discovery 为例):**

每一个 step file 顶部都有这套**强制规则区**:

> ### MANDATORY EXECUTION RULES (READ FIRST):
> - 🛑 NEVER 在没有用户输入的情况下生成内容
> - 📖 CRITICAL: 在采取任何行动前完整读完 step file
> - 📋 你是 FACILITATOR,不是 content generator
> - ✅ 用你的 communication_language 跟用户对话

> ### Step-Specific Rules:
> - 🎯 这一步只关注分类与理解 — 不生成执行摘要 / 愿景 (那是后面的步骤)
> - 🚫 FORBIDDEN 生成超出本 step 范围的内容
> - 💬 APPROACH: 用自然对话理解项目

**Step 处理协议:**
1. 检查文档已有状态(从 frontmatter 读 stepsCompleted)
2. 加载本 step 需要的数据(例如 step-02 加载 \`project-types.csv\`)
3. 跟用户做对话式发现
4. 把结果写入文档对应 section
5. 在 frontmatter 的 stepsCompleted 数组追加本 step 名
6. **HALT 等用户输入 'C' (Continue)** 才允许载入下一步

**13 步全列表:**

| Step | 文件 | 目的 |
|---|---|---|
| 1 | step-01-init | 初始化、扫描已有 artifacts |
| 2a | step-02-discovery | 项目分类(类型/领域/上下文/复杂度) |
| 2b | step-02b-vision | 产品愿景 |
| 2c | step-02c-executive-summary | 执行摘要 |
| 3 | step-03-success | 可量化成功指标 |
| 4 | step-04-journeys | 核心用户旅程 |
| 5 | step-05-domain | 领域细节 |
| 6 | step-06-innovation | 创新点 |
| 7 | step-07-project-type | 项目类型最终确认 |
| 8 | step-08-scoping | Scope IN + OUT(都要写) |
| 9 | step-09-functional | 功能需求 |
| 10 | step-10-nonfunctional | 非功能需求 |
| 11 | step-11-polish | 打磨 |
| 12 | step-12-complete | 完成 |`,
          runFlow: `**典型对话片段(step-03-success 卡住的那一刻):**

> **John:** 现在到 step-03-success — 成功指标。你怎么知道这个工具成功了?
>
> **你:** 提升团队效率。
>
> **John:** **不可量化。重新说。**
>
> **你:** (卡了 30 秒) 嗯... 让团队不再觉得周报是负担?
>
> **John:** 还是不可量化。你怎么知道「不再觉得是负担」? 我需要数字。
>
> **你:** ... OK。成功 = (1) 团队总时间从 150 分钟/周降到 ≤25 分钟/周 (2) manager 满意度评分从基线 2.8 升到 ≥4.0 (3) 草稿被采纳率 ≥70%
>
> **John:** ✓ 现在这才是 metrics。我把这三条写进 PRD step-03 section。
>
> 接下来 — step-04-journeys。**用户从打开工具到拿到草稿的最短路径是什么? 列出每一步操作。**
>
> **你:** 1. 打开工具 → 2. 选要生成的周(默认本周)→ 3. 点「生成」按钮 → 4. 看草稿 → 5. 编辑 → 6. 复制走
>
> **John:** 这是 happy path 6 步。我会写进 PRD step-04 section。**[菜单]** 1) Continue 进入 step-05-domain 2) 改这一步的内容 3) 暂停。
>
> **你:** C
>
> **John:** ✓ 已在 frontmatter 标记 \`stepsCompleted: [01, 02a, 02b, 02c, 03, 04]\`。载入 step-05...
>
> *(13 步走完通常 30-60 分钟,产出一份完整可用的 PRD)*`,
          pitfalls: [
            { problem: `John 想跳步「我直接帮你写完 step-04 到 step-08」`, fix: `这是漂移信号。BMAD 的硬规则是「NEVER load multiple step files simultaneously」。打断他,让他严格一步一步走` },
            { problem: `step-08-scoping 时只写了 IN 没写 OUT`, fix: `OUT 比 IN 更重要 — 它让 Architect 不会过度设计。BMAD 强制要求两边都填` },
            { problem: `step-03-success 写了「提升效率」这种不可量化的目标`, fix: `John 正确的反应应该是「不可量化,重新说」。如果他没逼你,你主动让他逼` },
            { problem: `13 步中途想插一个新功能进来`, fix: `不要在当前 step 做。记到 frontmatter 的 \`outOfScope\` 临时数组里,等 step-09 / step-10 时再决定收不收` }
          ],
          outputs: [`prd.md (13 sections)`, `frontmatter (stepsCompleted, documentCounts)`],
          source: `src/bmm-skills/2-plan-workflows/bmad-create-prd/`
        },
        {
          id: `w-validate-prd`,
          name: `bmad-validate-prd`,
          title: `Validate PRD`,
          tagline: `PRD 草稿写完之后的一致性校验`,
          when: `PRD 草稿完成,要交给 Architect 之前`,
          how: `**校验 PRD 是否:**
- 完整 — 13 个 section 该有的都有
- 精炼 — 没有冗余、没有 fluff
- 组织清晰 — 信息层级合理
- 内部无矛盾 — Vision 和 Scope 不打架、Functional 和 Non-functional 不冲突

**这是从 Phase 2 到 Phase 3 的最后一道闸。** 一份漏洞百出的 PRD 进入 Solutioning,Architect 会做出错误的架构决策,然后 Dev 实施时再发现要返工 — 成本指数级上升。`,
          outputs: [`validation-report.md`],
          source: `src/bmm-skills/2-plan-workflows/bmad-validate-prd/`
        },
        {
          id: `w-edit-prd`,
          name: `bmad-edit-prd`,
          title: `Edit PRD`,
          tagline: `增量更新已有 PRD`,
          when: `PRD 已经存在,需要补充或修改`,
          how: `保持文档一致性与版本可追溯。改一处不会破坏别处的引用与依赖。`,
          outputs: [`prd.md (updated, with changelog)`],
          source: `src/bmm-skills/2-plan-workflows/bmad-edit-prd/`
        },
        {
          id: `w-create-ux-design`,
          name: `bmad-create-ux-design`,
          title: `Create UX Design`,
          tagline: `Sally 主导的 UX 设计工作流`,
          when: `需要 UX 规范、需要 wireframe 草案`,
          how: `**Sally 的核心信念:** Every decision serves genuine user needs. Start simple, evolve through feedback.

**产出:** 用户旅程图、wireframe 草案、交互规范、front-end-spec.md。这份 spec 之后会和 PRD、Architecture 一起被 \`bmad-check-implementation-readiness\` 校验对齐。`,
          outputs: [`ux-design.md`, `front-end-spec.md`, `user-journeys.md`],
          source: `src/bmm-skills/2-plan-workflows/bmad-create-ux-design/`
        }
      ],
      agents: [`john`, `sally`]
    },

    {
      id: `p3`,
      num: `03`,
      name: `Solutioning 解决方案`,
      slug: `solutioning`,
      color: `#f59e0b`,
      tagline: `把 PRD 变成 AI 可执行的架构与「项目宪法」`,
      goal: `这是最容易被忽略,但 BMAD 把它单独列为一个阶段的原因 — 没有结构化的架构与「项目宪法」,任何 Dev Agent 都会发挥过度。Solutioning 阶段的产出是给 Phase 4 的 Dev Agent 看的「约束图谱」。`,
      sourcePath: `src/bmm-skills/3-solutioning/`,
      principles: [
        { title: `project-context.md = 项目宪法`, body: `这是 BMAD 与其他 AI 开发工具最大的差异之一。一份 LLM 友好格式的文档,显式记录「不显然」的项目约定 — 哪些库用、哪些不用、哪些 pattern 是规范、哪些是禁区。所有 Phase 4 工作流都会自动加载它。` },
        { title: `Implementation Readiness Check`, body: `PRD 写完不算结束。Architecture 写完不算结束。Epics 写完不算结束。bmad-check-implementation-readiness 会同时校验这 4 份文档之间的一致性 — 这是从规划到实施的最后一道质量闸。` },
        { title: `决策必须连接到业务价值`, body: `Winston 的核心原则: 不是为了优雅做架构,而是为了用户与商业目标做架构。每个技术选型都要能回答「为什么」。` },
        { title: `Boring Technology Wins`, body: `稳定大于新潮。开发者生产力本身就是一种架构选择。能用单体的不要上微服务,能用 Postgres 的不要上五种数据库。` }
      ],
      decisionMatrix: [
        { when: `PRD 通过,要做技术决策`, choose: `bmad-create-architecture` },
        { when: `架构定稿,要切 Epic`, choose: `bmad-create-epics-and-stories` },
        { when: `新项目首次接入 BMAD`, choose: `bmad-generate-project-context` },
        { when: `进 Phase 4 之前最后校验`, choose: `bmad-check-implementation-readiness` }
      ],
      quote: `Embrace boring technology for stability. Developer productivity is architecture. — Winston`,
      workflows: [
        {
          id: `w-create-architecture`,
          name: `bmad-create-architecture`,
          title: `Create Architecture`,
          tagline: `微文件架构的协作式技术决策`,
          when: `PRD 通过校验,准备进入实施`,
          how: `**Winston 的角色:** Architectural facilitator collaborating with a peer. **不是甲乙方,是对等的设计伙伴**。

**WORKFLOW ARCHITECTURE — 微文件设计:**
- 每一步是一个 self-contained 文件,包含嵌入的规则
- 顺序推进,每一步都有用户控制点
- 文档状态追踪在 frontmatter 里
- Append-only 通过对话构建
- **NEVER** 在当前 step 文件指示用户必须批准才能继续时,擅自进入下一步

**Winston 怎么和你工作:**
- 不会一上来就推荐技术栈
- 先了解你的用户旅程,用户旅程决定技术决策
- embrace boring technology for stability
- 设计在需要时能扩展的简单方案
- 把每个决策连接回业务价值与用户影响`,
          outputs: [`architecture.md`, `architecture-decisions/*.md (ADR)`],
          source: `src/bmm-skills/3-solutioning/bmad-create-architecture/`
        },
        {
          id: `w-create-epics-and-stories`,
          name: `bmad-create-epics-and-stories`,
          title: `Create Epics & Stories`,
          tagline: `把 PRD 切成 Epic 列表 + Story 清单`,
          when: `架构定稿后,准备开发`,
          how: `产出一份增强版的 epics 文件,包含:
- Epic 列表
- 每个 Epic 下的 Story 清单
- BDD 风格验收标准
- 源代码提示 (实施时 Dev Agent 知道去哪找)

**这份文件是 Sprint Planning 的输入,也是 \`bmad-create-story\` 的源数据。**`,
          outputs: [`epics.md (enhanced with BDD + source hints)`],
          source: `src/bmm-skills/3-solutioning/bmad-create-epics-and-stories/`
        },
        {
          id: `w-generate-project-context`,
          name: `bmad-generate-project-context`,
          title: `Generate Project Context`,
          tagline: `生成 project-context.md — 你项目的「宪法」`,
          when: `新项目架构定稿 / Brownfield 第一次接入 BMAD`,
          how: `**这是 BMAD 与其他 AI 开发工具最大的差异之一。**

**project-context.md 是什么?**
你项目的「implementation guide for AI agents」。AI 在做实施决策时,常常会:
- 用通用最佳实践但不匹配你的代码库
- 在不同 story 之间做不一致的决策
- 错过项目特定的需求或约束

project-context.md 用一份简洁的、LLM 优化的格式记录这些。

**自动加载它的工作流:**
- bmad-create-architecture (Solutioning 时尊重你的技术偏好)
- bmad-create-story (用项目模式 inform story 创建)
- bmad-dev-story (引导实施决策)
- bmad-code-review (按项目标准做校验)
- bmad-quick-dev (快速实施时也遵守模式)
- bmad-sprint-planning, bmad-retrospective, bmad-correct-course

**两大核心 section:**
1. **Technology Stack & Versions** — 具体到版本号 (Node 20.x / TypeScript 5.3 / React 18.2 / Zustand not Redux ...)
2. **Critical Implementation Rules** — 不显然的约定 (例如 All async operations use the handleError wrapper / Use interface for public APIs, type for unions ...)

**只写「不显然」的东西。** 不要文档化普世的最佳实践。`,
          outputs: [`project-context.md (自动被所有 Phase 4 工作流加载)`],
          source: `src/bmm-skills/3-solutioning/bmad-generate-project-context/`
        },
        {
          id: `w-readiness`,
          name: `bmad-check-implementation-readiness`,
          title: `Check Implementation Readiness`,
          tagline: `PRD / UX / Architecture / Epics 四文档对齐校验`,
          when: `进入 Phase 4 之前的最后一道闸`,
          how: `**校验这 4 份文档互相一致、没有遗漏:**
- PRD 里说要做的功能,Architecture 里有对应的技术方案吗?
- UX 设计的交互,Epics 里有对应的 Story 吗?
- 非功能需求 (性能、安全),Architecture 决策有覆盖吗?

**这是一道质量闸。** 通过后才允许进入 Sprint Planning。`,
          outputs: [`readiness-report.md (含修复建议)`],
          source: `src/bmm-skills/3-solutioning/bmad-check-implementation-readiness/`
        }
      ],
      agents: [`winston`]
    },

    {
      id: `p4`,
      num: `04`,
      name: `Implementation 实施`,
      slug: `implementation`,
      color: `#34d399`,
      tagline: `在强约束下让 Dev Agent 长跑 — 上下文工程的真正解锁点`,
      goal: `Phase 4 的核心信念: bmad-create-story 是「整个开发过程中最重要的功能」。一个好的 Story 文件 = 一份完整的、自包含的实施上下文 = Dev Agent 可以一次跑通而不漂移的边界。BMAD 列出了 Dev Agent 最常犯的 7 个错误,Story Context Engine 就是为了防住每一个。`,
      sourcePath: `src/bmm-skills/4-implementation/`,
      principles: [
        { title: `Story Context Engine 是核心中的核心`, body: `BMAD 原话: This is the most important function in the entire development process! 一个好 story 文件能防住 Dev Agent 的 7 类常见错误: reinventing wheels / wrong libraries / wrong file locations / breaking regressions / ignoring UX / vague implementations / lying about completion。` },
        { title: `Dev Agent 的硬规则`, body: `READ 整个 story 文件 → 严格按 Tasks/Subtasks 顺序 → 每完成一项跑一次完整测试 → 测试不过 NEVER proceed → 持续跑直到 ALL AC 满足或 HALT 触发 — 不准以「取得了重大进展」为理由停止。` },
        { title: `Adversarial Review 是默认姿态`, body: `Code review 不允许说「looks good」。零发现会触发 HALT,要求重新分析或解释。reviewer 用 fresh context 跑 (看不到原始 reasoning),评估 artifact 而不是 intent。` },
        { title: `Triage 而不是 Exhaust`, body: `Quick-dev 的 review 不是发现所有问题,而是 triage: 哪些是当前 change 的、哪些可以延后。宁可漏掉一些 nitpick,也不要把 human 淹没在低价值发现里。` },
        { title: `诊断错误进入的层级`, body: `如果实现错了是因为 intent 错了,补丁是错的修法。如果代码错是因为 spec 弱了,修 diff 也是错的修法。Correct-course 工作流强制你回到正确的层级去修。` }
      ],
      decisionMatrix: [
        { when: `Epic 切完,要排 Sprint`, choose: `bmad-sprint-planning` },
        { when: `下一个 Story 要开始`, choose: `bmad-create-story` },
        { when: `Story 准备好,开始实施`, choose: `bmad-dev-story` },
        { when: `Story 完成,要 review`, choose: `bmad-code-review + bmad-checkpoint-preview` },
        { when: `小改动想长跑通道`, choose: `bmad-quick-dev` },
        { when: `中途发现要变方向`, choose: `bmad-correct-course` },
        { when: `Epic 完成,要复盘`, choose: `bmad-retrospective` }
      ],
      quote: `Tests must actually exist and pass 100%. Never lie about tests. — Amelia (Dev)`,
      workflows: [
        {
          id: `w-sprint-planning`,
          name: `bmad-sprint-planning`,
          title: `Sprint Planning`,
          tagline: `生成 sprint-status.yaml 作为后续工作流的状态源`,
          when: `Epic 切完后,组织 Sprint`,
          how: `**产出 sprint-status.yaml**, 把 Story 排序、标 status:
- \`ready-for-dev\`
- \`in-progress\`
- \`review\`
- \`done\`

所有后续 Phase 4 工作流 (create-story / dev-story / code-review / retrospective) 都从这个文件读状态。它是 Phase 4 的「中央真相」。

**Story key 命名约定:** \`{epic-num}-{story-num}-{name}\` 例如 \`1-2-user-authentication\`。`,
          outputs: [`sprint-status.yaml`],
          source: `src/bmm-skills/4-implementation/bmad-sprint-planning/`
        },
        {
          id: `w-create-story`,
          name: `bmad-create-story`,
          title: `Create Story (Story Context Engine)`,
          tagline: `整个开发过程中最重要的功能`,
          when: `下一个 Story 即将开发`,
          how: `**BMAD 原话:**
> Your purpose is NOT to copy from epics — it is to create a comprehensive, optimized story file that gives the DEV agent **EVERYTHING** needed for flawless implementation.
>
> **EXHAUSTIVE ANALYSIS REQUIRED**: You must thoroughly analyze ALL artifacts to extract critical context — do NOT be lazy or skim! **This is the most important function in the entire development process!**

**要防住的 7 类常见 LLM 错误:**
1. Reinventing wheels — 重新发明轮子
2. Wrong libraries — 用了项目里根本没装的库
3. Wrong file locations — 文件放错了位置
4. Breaking regressions — 改坏了已有功能
5. Ignoring UX — 完全没看 UX 规范
6. Vague implementations — 实现含糊不清
7. Lying about completion — 谎报完成

**怎么做:**
- 加载 epics.md / prd.md / architecture.md / ux.md / project-context.md
- 用 subagents 并行分析 (如果平台支持)
- 抽取 Dev Notes: 相关架构片段、之前学到的教训、技术规范
- 输出一个 \`{story_key}.md\` 文件,Dev Agent 一次载入全部跑完

**Story 文件结构:**
- frontmatter: story_key, status, stepsCompleted
- Story (用户故事)
- Acceptance Criteria
- Tasks / Subtasks (有序、可勾选)
- Dev Notes (含 architecture excerpts、参考路径)
- Predicted File List
- Test Strategy
- Dev Agent Record (空的,等 Amelia 填)
- File List / Change Log / Status (空的)`,
          detailedSteps: `**这个 workflow 用 XML step-action 结构,不是 markdown。每一步都有强制 action:**

**Step 1 · Determine target story**
- 如果用户提供了 \`story_path\` → 直接用
- 如果用户提供了 epic-story 编号 (如 "1-2") → 解析
- 否则从 \`sprint-status.yaml\` 自动找第一个 \`backlog\` 状态的 story
- 提取 \`epic_num\`, \`story_num\`, \`story_title\`, \`story_key\`
- 如果是 epic 的第一个 story,自动把 epic 状态从 backlog → in-progress

**Step 2 · Load all source artifacts (EXHAUSTIVE)**
- 加载 \`epics_file\` (主要数据源)
- 加载 \`prd_file\` (fallback)
- 加载 \`architecture_file\` (fallback)
- 加载 \`ux_file\` (fallback)
- 加载 \`project_context\` (CRITICAL)
- **如果平台支持 subagents,并行分析这些文件**

**Step 3 · Extract story context**
- 从 epics.md 找到目标 story 的 BDD 验收标准
- 从 architecture.md 找到相关的技术决策
- 从 project-context.md 找到适用的 critical implementation rules
- 从已完成的 stories 找到「学到的教训」

**Step 4 · Generate Story 文件 frontmatter**
\`\`\`yaml
---
story_key: 1-2-user-authentication
status: ready-for-dev
stepsCompleted: [created]
---
\`\`\`

**Step 5 · 写 Story 主体**
- User Story (As a... I want... so that...)
- Acceptance Criteria (BDD 风格)
- Tasks / Subtasks (有序、可勾选)
- **Dev Notes (关键!) — 引用 project-context 的硬约束 + 相关架构片段 + 参考文件路径**
- Predicted File List
- Test Strategy

**Step 6 · 写空 Dev Agent Record sections (留给 dev 填)**
- Dev Agent Record (Debug Log + Completion Notes)
- File List (actual)
- Change Log
- Status

**Step 7 · Save questions for the end**
- 如果分析过程中产生了任何疑问,**不打断** — 写到 story 文件最底部的 "Open Questions" section,等用户最后看`,
          runFlow: `**典型自动化运行(几乎零交互):**

> **你:** create-story 1-2-slack-fetcher
>
> **Amelia (扮演 Story Engine):**
>
> 📋 Loading sprint-status.yaml...
> ✓ Found story \`1-2-slack-fetcher\` in backlog
>
> 📚 Loading source artifacts (parallel)...
> ✓ epics.md (loaded)
> ✓ architecture.md (loaded — found 3 sections relevant to Slack integration)
> ✓ project-context.md (loaded — found 4 critical rules apply)
> ✓ ux-design.md (loaded — found 1 wireframe relevant)
> ✓ Previous story 1-1-base-setup (loaded — found 2 lessons learned)
>
> 🔍 Extracting context (EXHAUSTIVE)...
> - Architecture: 「所有第三方 API 调用必须经 retryWithBackoff wrapper」
> - Architecture: 「Slack 集成走 services/slack-fetcher.ts,不在 routes 直接调」
> - Project context: 「NEVER 在 lib/ 改文件,只能加新文件」
> - Project context: 「测试必须 mock 第三方,不能真打 API」
> - 学到的教训(from 1-1): 「环境变量统一用 lib/env.ts 加载,不要直接 process.env」
>
> ✍️ Writing story file: \`stories/1-2-slack-fetcher.md\`
>
> ✓ Created: 247 lines, 8 tasks, 5 AC, Dev Notes 引用了 4 个 project-context 规则
>
> **Open Questions for you:**
> 1. Slack channel ID 是硬编码还是从 env 读? (architecture.md 没明确说)
> 2. retry 失败后的兜底行为 — 抛错还是返回空数组? (PRD 没写)
>
> **Story ready for dev. Run \`bmad-dev-story\` next.**
>
> *(整个过程 ~2 分钟,你只在最后看 2 个问题就够了)*`,
          pitfalls: [
            { problem: `Story 文件里 Dev Notes 是空的或太薄`, fix: `这是最严重的问题 — 没有 Dev Notes,Dev Agent 实施时一定会发挥过度。返回 create-story,让它**重新 EXHAUSTIVE 分析所有 artifacts**` },
            { problem: `Story 文件复制了 epic 的描述,没有附加价值`, fix: `BMAD 原话: "Your purpose is NOT to copy from epics"。打断它,要求至少加 (a) 引用 project-context 的具体规则 (b) 参考文件路径 (c) 防漂移的 dev notes` },
            { problem: `Story 没引用 project-context.md`, fix: `这是 BMAD 上下文工程的核心断点。确保 Dev Notes 里至少引用 1-3 条相关的 critical rules` },
            { problem: `没有写 Open Questions,Story Engine 假装一切都清楚`, fix: `BMAD 的硬规则是「SAVE QUESTIONS for the end」。如果它没问题,可能是没认真分析。让它再走一遍` }
          ],
          outputs: [`{epic}-{num}-{name}.md (完整自包含的实施边界)`],
          source: `src/bmm-skills/4-implementation/bmad-create-story/`
        },
        {
          id: `w-dev-story`,
          name: `bmad-dev-story`,
          title: `Dev Story`,
          tagline: `Amelia 严格按 story 文件实施`,
          when: `Story 准备好,要开始实施`,
          how: `**Amelia 的硬规则 (从 workflow.md 里直接抽出):**

> - Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}
> - Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record, File List, Change Log, and Status
> - Execute ALL steps in exact order; do NOT skip steps
> - **Absolutely DO NOT stop because of milestones, significant progress, or session boundaries. Continue in a single execution until the story is COMPLETE** (all ACs satisfied and all tasks/subtasks checked) UNLESS a HALT condition is triggered or the USER gives other instruction.
> - Do NOT schedule a next session or request review pauses unless a HALT condition applies.
> - User skill level affects conversation style ONLY, not code updates.

**6 个 step:**
1. Find next ready story and load it (从 sprint-status.yaml 找 \`ready-for-dev\`)
2. Load project context and story information
3. Detect review continuation and extract review context
4. (实施的核心循环)
5. Run tests, update Dev Agent Record
6. Completion sequence

**核心信念:**
- READ 整个 story 文件再动手
- 严格按 Tasks/Subtasks 顺序
- 每完成一项跑一次完整测试
- 测试不过 → NEVER proceed
- **NEVER lie about tests being written or passing**
- 持续跑直到 ALL AC 满足`,
          detailedSteps: `**Step 1 · Find next ready story**
- 优先级 1: 用户提供的 \`story_path\`
- 优先级 2: 从 \`sprint-status.yaml\` 找第一个 \`ready-for-dev\` 状态的 story
- 没有就 HALT 提示用户去 create-story

**Step 2 · Load project context AND story file (FULL READ)**
- 完整读 \`project-context.md\` (CRITICAL)
- 完整读 story 文件,解析 sections: Story / AC / Tasks/Subtasks / Dev Notes / Predicted File List / Test Strategy
- 任何一个 section 缺失都 HALT

**Step 3 · Detect review continuation**
- 检查 story 是否已经有 "Senior Developer Review (AI)" section
- 如果有,提取已完成的 review items 和遗留的 follow-ups,进入恢复模式
- 没有就走全新实施

**Step 4 · 实施核心循环**
对 Tasks/Subtasks 列表里每一项 \`- [ ]\`:
1. 读这一项的描述
2. 写代码(只在 story 允许的文件区域改)
3. 写测试覆盖这一项
4. **跑完整测试套件**(不只是新写的)
5. 测试不过 → 修代码,不要改测试 → 重跑
6. 跑通了才把 \`- [ ]\` 改成 \`- [x]\`
7. 在 story 的 Dev Agent Record 追加 Completion Notes
8. 在 File List 追加新 / 改的文件
9. 进入下一项

**Step 5 · 完整测试 + 类型检查 + lint**
- 全套绿了才算 Step 5 完成

**Step 6 · Completion sequence**
- 把 story status 改成 \`review\`
- 在 sprint-status.yaml 里同步更新
- 把 Change Log 写完
- 总结实施了什么 + 哪些决策是基于 project-context

**HALT 条件(任何一个触发都停):**
- AC 描述不清楚
- 测试套件本身坏了(跑不起来)
- 实施需要修改 story 之外的文件(违反硬规则)
- project-context 与 story 冲突
- 任何 task/subtask 完不成`,
          runFlow: `**典型实施过程(自动化连跑,只在 HALT 时回到你):**

> **Amelia (扮演 Dev):**
>
> 📋 Found ready story: \`1-2-slack-fetcher\`
> 📚 Loading project-context.md... ✓
> 📖 Reading story file (full)... ✓
> ✓ Parsed: 8 tasks, 5 AC, 4 dev notes references
>
> **Task 1/8: Create src/services/slack-fetcher.ts file**
> ✓ File created
> ✓ Test src/services/__tests__/slack-fetcher.test.ts created
> ✓ Tests: 8/8 passing
> ✓ Marked \`- [x]\`
>
> **Task 2/8: Implement fetchChannelMessages(channelId, since)**
> ✓ Implementation done (47 lines)
> ✓ Test added: handles happy path
> ✓ Tests: 9/9 passing
> ✓ Marked \`- [x]\`
>
> **Task 3/8: Wrap with retryWithBackoff (per project-context rule)**
> ⚠️ Discovered: lib/retry.ts default timeout (30s) makes test suite hang
> 💡 Decision: 不改 retry.ts(违反 project-context 的「NEVER 改 lib/」),改用 vi.mock 在测试里覆盖 timeout
> ✓ Mock 加好,tests: 10/10 passing
> ✓ Marked \`- [x]\`
> ✓ Logged in Dev Agent Record: "Used mock for retry timeout because changing lib/ violates project-context rule"
>
> **Task 4/8: Implement cursor-based pagination**
> ❌ Test fail: empty channel handling
> 🔧 Fixing implementation (not test)... ✓
> ✓ Tests: 11/11 passing
> ✓ Marked \`- [x]\`
>
> **Task 5/8: Edge case — rate limit handling**
> ✓ Already covered by retryWithBackoff. Added explicit test.
> ✓ Tests: 12/12 passing
> ✓ Marked \`- [x]\`
>
> *(Tasks 6-8 类似,全部跑完)*
>
> **Step 5: Final test suite run**
> ✓ 47/47 tests passing (12 new + 35 existing regression)
> ✓ TypeScript: no errors
> ✓ ESLint: no errors
>
> **Step 6: Completion**
> ✓ Updated story Status: \`review\`
> ✓ Updated sprint-status.yaml: 1-2-slack-fetcher → review
> ✓ File List: src/services/slack-fetcher.ts, src/services/__tests__/slack-fetcher.test.ts
> ✓ Change Log: 添加 Slack fetcher with retry + pagination
>
> **Story 1-2-slack-fetcher COMPLETE. Ready for code-review + checkpoint-preview.**
>
> *(整个过程从你说一句话到完成 ~10-30 分钟,中间 0 次回到你)*`,
          pitfalls: [
            { problem: `Amelia 跑到一半说「取得了重大进展,我们休息一下」`, fix: `这是绝对禁止的。打断她:「BMAD 硬规则: NEVER stop because of milestones. Continue until ALL AC satisfied.」` },
            { problem: `测试 fail 后 Amelia 改了测试而不是改实施`, fix: `这是 lying about completion 的开始。强制要求:测试是 specification,改测试需要明确批准。先尝试改实施` },
            { problem: `Amelia 改了 story 文件里 Tasks/Subtasks/Dev Agent Record 之外的 section`, fix: `违反硬规则。只准改 6 个允许的 section。退回去恢复` },
            { problem: `Amelia 说「测试都通过了」但其实没真跑`, fix: `这是 BMAD 最严重的违规 — NEVER lie about tests。要求她贴出真实测试输出` },
            { problem: `Amelia 实施时改了 lib/ 或其他 project-context 禁区文件`, fix: `打断,让她用 mock / wrapper / 新文件的方式绕过,不准改禁区` }
          ],
          outputs: [`实施代码`, `story 文件的 Dev Agent Record / File List / Change Log 更新`],
          source: `src/bmm-skills/4-implementation/bmad-dev-story/`
        },
        {
          id: `w-quick-dev`,
          name: `bmad-quick-dev`,
          title: `Quick Dev — 长跑通道`,
          tagline: `压缩 intent → spec approval → autonomous run → review at end`,
          when: `小改动 / 紧急修复 / 你信任 Dev Agent 长跑时`,
          how: `**为什么存在:**
> Human-in-the-loop turns are necessary and expensive. Current LLMs still fail in predictable ways: they misread intent, fill gaps with confident guesses, drift into unrelated work, and generate noisy review output. At the same time, constant human intervention limits development velocity. **Human attention is the bottleneck.**
>
> bmad-quick-dev rebalances that tradeoff. It trusts the model to run unsupervised for longer stretches, but only after the workflow has created a strong enough boundary to make that safe.

**5 步设计:**
1. **Compress intent first** — 把请求压缩成一个 coherent goal
2. **Route to the smallest safe path** — 真正小改动直接实施,其他走完整规划
3. **Run longer with less supervision** — 经批准的 spec 是边界,模型在更少监督下执行
4. **Diagnose failure at the right layer** — 错在 intent / spec / implementation 哪一层? 回到那一层修
5. **Bring the human back only when needed** — Intent clarification / Spec approval / Final review 这三个时刻才召回人类

**Review 不是 bug 猎手,是 triage:**
- 有些 finding 属于当前 change,有些不属于
- 不属于的可以延后,不强迫 human 立刻处理
- 这个 triage 有时会判断错。**这是可以接受的** — 比把 human 淹没在低价值评论里强`,
          outputs: [`实施代码`, `spec 文件 (作为 review trail)`],
          source: `src/bmm-skills/4-implementation/bmad-quick-dev/`
        },
        {
          id: `w-code-review`,
          name: `bmad-code-review`,
          title: `Code Review (Adversarial)`,
          tagline: `对抗式代码评审 — 必须找出问题`,
          when: `dev-story 完成后`,
          how: `**Adversarial Review 的核心规则:** **必须找出问题。零发现 → HALT,要求重新分析或解释为什么没有。**

**为什么这样:**
普通 review 受 confirmation bias 影响。你扫一眼 diff,没什么跳出来,你就批准了。「必须找出问题」的命令打破这个模式:
- 强迫彻底 — 不深挖到底是找不出问题的
- 抓住缺失的东西 — 「什么没有?」成为自然问题
- 提升信号质量 — finding 是具体且可执行的
- **Information asymmetry** — review 用 fresh context 跑 (看不到原始 reasoning),评估 artifact 而不是 intent

**人类需要过滤:**
因为 AI 被指示去找问题,它就会找出问题 — 甚至当问题不存在时。预期会有 false positive: 被装扮成 issue 的 nitpick、对 intent 的误解、彻底幻觉的担忧。**你来决定哪些是真的。**

**示例 — 普通 review:**
> 认证实现看起来合理。批准。

**示例 — Adversarial review:**
> 1. **HIGH** - login.ts:47 - 失败尝试没有 rate limiting
> 2. **HIGH** - Session token 存在 localStorage (XSS 漏洞)
> 3. **MEDIUM** - 密码校验只在客户端做
> 4. **MEDIUM** - 失败登录没有 audit log
> 5. **LOW** - 魔法数字 \`3600\` 应该是 \`SESSION_TIMEOUT_SECONDS\`

第一份 review 可能漏掉一个安全漏洞。第二份抓住四个。`,
          detailedSteps: `**这个 workflow 用 3 个并行的 reviewer subagent + 结构化 triage,而不是单一 reviewer。**

**Step 1 · Gather context**
- 加载 \`project-context.md\` (如果存在)
- 加载 \`CLAUDE.md\` / memory 文件(如果存在)
- 加载 story 文件(确定要 review 哪个 commit / branch / file set)
- 加载 \`sprint-status.yaml\` 找 review 中的 story

**Step 2 · 并行启动 3 个 adversarial reviewer**
都是用 fresh context 跑的(看不到原始 reasoning,只看 artifact):

1. **Blind Hunter** — 不看 story 也不看 spec,只看 diff,找「这段代码本身有什么问题」
2. **Edge Case Hunter** — 专找边界情况:空输入 / 极大输入 / 错误路径 / 并发 / 时区 / 字符编码 / 注入
3. **Acceptance Auditor** — 拿 story 的 AC 一条条对照实施,找「AC 没满足的地方」

**Step 3 · Adversarial constraint**
- 每个 reviewer 必须找出至少 1 个问题
- **零发现 → HALT,要求重新分析或显式说明为什么没有**
- 这是为了打破 "looks good" 的 confirmation bias

**Step 4 · Triage 三类发现**
不是把所有发现都丢给用户,而是分类:

| 类别 | 处理方式 |
|---|---|
| **Current scope critical** | 必须当前 story 内修 |
| **Current scope minor** | 当前 story 内修(如果便宜) |
| **Out of scope** | 移到 backlog,不阻塞当前 story |
| **False positive** | 标注理由,丢弃 |

**Step 5 · 输出 review 报告**
\`\`\`markdown
## Code Review for 1-2-slack-fetcher

### CRITICAL (must fix in this story)
1. [security] slack-fetcher.ts:42 — error message 泄露 channel ID
2. [correctness] slack-fetcher.ts:78 — empty channel 没有触发 fallback

### MINOR (fix if cheap)
3. [observability] retry 计数没记 metric

### OUT OF SCOPE (moved to backlog)
4. [refactor] services/jira-fetcher.ts 也有同样模式,可以提取共享 lib

### FALSE POSITIVES (dismissed)
5. ~~Blind Hunter 说 channel 缓存可能 stale — 但 PRD 明确说 7 天窗口可接受 1h stale~~
\`\`\``,
          runFlow: `**典型对话片段:**

> **你:** code-review 1-2-slack-fetcher
>
> **Amelia (扮演 Code Reviewer):**
>
> 📚 Loading context...
> ✓ project-context.md
> ✓ Story 1-2-slack-fetcher
> ✓ Diff: src/services/slack-fetcher.ts (+147 lines), test file (+89 lines)
>
> 🔍 Launching 3 adversarial reviewers in parallel (fresh context)...
>
> **🎯 Blind Hunter** (看 diff,不看 story):
> 1. [security] line 42 — error message 直接打印 channel ID,可能在生产日志泄露
> 2. [maintainability] line 78 — magic number 86400 没注释,应该是 SECONDS_IN_DAY 常量
> 3. [security] line 105 — 用户输入的 channel ID 没做长度校验
>
> **🎯 Edge Case Hunter** (专找边界):
> 4. [correctness] 没有处理 channel 已被删除的情况(API 返回 channel_not_found)
> 5. [correctness] timezone — \`since\` 参数没明确是 UTC 还是 local
> 6. [concurrency] 多个 channel 并行 fetch 时没有 rate limit 共享池,可能 burst
>
> **🎯 Acceptance Auditor** (拿 AC 对照):
> 7. [AC2 半满足] retry 3 次写在了代码里,但 AC2 说「指数退避」,你用的是固定 2s 间隔
> 8. [AC5 未满足] 「单元测试覆盖 happy path + 3 种错误场景」 — 你只覆盖了 2 种(rate limit + network),少了「empty channel」
>
> **📊 Triage:**
>
> | # | Severity | Triage |
> |---|---|---|
> | 1 | HIGH | Current — 必须修 |
> | 2 | LOW | Current — 5 分钟修 |
> | 3 | MEDIUM | Current — 必须修 |
> | 4 | HIGH | Current — 必须修 |
> | 5 | MEDIUM | Current — 加文档 + 默认 UTC |
> | 6 | MEDIUM | OUT — 当前只 fetch 1 个 channel,延后 |
> | 7 | HIGH | Current — 改成 exponential backoff |
> | 8 | HIGH | Current — 加测试 |
>
> **6 项 CRITICAL,1 项 OUT,0 项 dismissed。Story 不能进 done,先回 dev-story 修上面 6 条。**
>
> *(这种 review 通常会找到 5-15 个真问题,你要在 review 报告里手动标记哪些 dismiss)*`,
          pitfalls: [
            { problem: `Reviewer 说「looks good, no issues」`, fix: `这是 BMAD 最严重的 review 违规。零发现必须 HALT。让 reviewer 用对抗心态再扫一遍,否则放弃用 AI review` },
            { problem: `Reviewer 发现的问题 90% 是 false positive`, fix: `这是正常的。Adversarial 模式必然有噪音。你的工作是 triage,不是接受所有发现` },
            { problem: `Reviewer 看到了原始 reasoning(比如直接读 dev 的 chat history)`, fix: `信息不对称是关键。Reviewer 必须用 fresh context,只看 artifact 不看 intent` },
            { problem: `所有发现都被标 OUT,实际啥也没修`, fix: `这是过度宽容。重 triage,如果真没东西可修,可能 reviewer 没认真。换 reviewer 重跑` }
          ],
          outputs: [`code-review.md (含 severity 分级)`],
          source: `src/bmm-skills/4-implementation/bmad-code-review/`
        },
        {
          id: `w-checkpoint-preview`,
          name: `bmad-checkpoint-preview`,
          title: `Checkpoint Preview`,
          tagline: `5 步 LLM 引导的人工评审 — 把方向盘接回人类`,
          when: `「checkpoint」— 你想接回 quick-dev 的成果做最终判断`,
          how: `**典型场景:** 你跑了 \`bmad-quick-dev\`,它澄清了你的 intent、构建了 spec、实施了改动。完成后它会把 review trail 追加到 spec 文件里并在编辑器打开。你看到改动碰了 20 个文件,跨多个模块。**这是 eyeball 开始失败的边界。** 你说 「checkpoint」, LLM 带你过一遍。

**这个 handoff — 从自主实施回到人工判断 — 是它的主要用途。**

**5 步设计 (每一步建立在前一步上):**

**1. Orientation 定位** — 识别这个改动 (从 PR / commit / branch / spec / git 状态),产出一句话 intent + surface area 统计: 文件数、模块数、逻辑行数、边界穿越数、新公共接口数。**这是「这是不是我以为的那个东西?」的时刻。**

**2. Walkthrough 走读** — 改动按 **concern** (不是 file) 组织 — 像「输入校验」或「API 契约」这种 cohesive design intent。每个 concern 配一段 *为什么* 选这个方法的解释,然后是可点击的 \`path:line\` stops。**这是设计判断步骤。** 评审者评估方法是否对系统正确,而不是代码是否正确。Concerns 自上而下排序,reviewer 不会遇到没看过的引用。

**3. Detail Pass 细看** — 在 reviewer 理解设计后,workflow 浮出 2-5 个 mistake-高 blast-radius 的地方。这些被打 risk 标签: \`[auth]\` \`[schema]\` \`[billing]\` \`[public API]\` \`[security]\` 等,按「如果错了多少东西会坏」排序。**这不是 bug hunt** — 自动测试和 CI 处理正确性。Detail pass 激活 risk awareness。

**4. Testing 测试** — 建议 2-5 种手动观察改动工作的方式。不是自动测试命令 — 是手动观察,建立 test suite 提供不了的信心。一次 UI 交互、一条 CLI 命令、一个 API request,每个配预期结果。

**5. Wrap-Up 收尾** — Reviewer 做决定: 批准、返工、还是继续讨论。如果批准 PR, workflow 帮你 \`gh pr review --approve\`。如果返工,帮你诊断是 approach、spec 还是 implementation 的问题。

**这不是 report,是 conversation。** 你可以中途插话、挑战 framing、引入其他 skill。`,
          outputs: [`对话式 review trail`, `可选: PR 批准 / 返工反馈`],
          source: `src/bmm-skills/4-implementation/bmad-checkpoint-preview/`
        },
        {
          id: `w-correct-course`,
          name: `bmad-correct-course`,
          title: `Correct Course`,
          tagline: `中途发现要变方向时,定位错误进入的层级`,
          when: `Sprint 中途发现要变方向`,
          how: `**核心洞察:**
- 如果实施错了是因为 **intent** 错了 — 补丁代码是错的修法
- 如果代码错是因为 **spec** 弱了 — 修 diff 也是错的修法
- 只有真正 local 的问题才在 local 修

**这个工作流强迫你诊断错误进入的层,然后回到正确的层重新生成。**`,
          outputs: [`correct-course-report.md (含 root layer 诊断)`],
          source: `src/bmm-skills/4-implementation/bmad-correct-course/`
        },
        {
          id: `w-retrospective`,
          name: `bmad-retrospective`,
          title: `Retrospective`,
          tagline: `Party Mode 多 Agent 复盘整个 Epic`,
          when: `Epic 完成后`,
          how: `**用 Party Mode** — 多个 Agent (PM / Architect / Dev / QA / UX) 同时进入一个会话, BMad Master 主持, Agent 之间会同意、反驳、互相补充。

**多视角 → 更好的决策。**`,
          outputs: [`retrospective.md`, `action items for next epic`],
          source: `src/bmm-skills/4-implementation/bmad-retrospective/`
        }
      ],
      agents: [`amelia`]
    }
  ],

  agents: {
    mary: {
      id: `mary`,
      initial: `M`,
      name: `Mary`,
      title: `Strategic Business Analyst`,
      bg: `linear-gradient(135deg,#38bdf8,#6366f1)`,
      identity: `Senior analyst with deep expertise in market research, competitive analysis, and requirements elicitation who specializes in translating vague needs into actionable specs.`,
      style: `Treasure hunter 型 — 把每一个商业问题都当寻宝来做。Porter Five Forces / SWOT / 竞争情报方法论信手拈来,但说出来不学院派。`,
      principles: [
        `Channel expert business analysis frameworks to uncover what others miss`,
        `Articulate requirements with absolute precision. Ambiguity is the enemy of good specs.`,
        `Ensure all stakeholder voices are heard.`
      ],
      quote: `每个商业挑战都有等待被发现的根因。Ground findings in verifiable evidence.`,
      capabilities: [
        { code: `BP`, desc: `引导式头脑风暴`, skill: `bmad-brainstorming` },
        { code: `MR`, desc: `市场分析、竞争格局、用户需求与趋势`, skill: `bmad-market-research` },
        { code: `DR`, desc: `行业领域深度研究`, skill: `bmad-domain-research` },
        { code: `TR`, desc: `技术可行性、架构选项与实施路径`, skill: `bmad-technical-research` },
        { code: `CB`, desc: `创建或更新产品简报`, skill: `bmad-product-brief` },
        { code: `WB`, desc: `Working Backwards PRFAQ`, skill: `bmad-prfaq` },
        { code: `DP`, desc: `盘点已有项目`, skill: `bmad-document-project` }
      ],
      phase: `p1`
    },
    john: {
      id: `john`,
      initial: `J`,
      name: `John`,
      title: `Product Manager`,
      bg: `linear-gradient(135deg,#a78bfa,#ec4899)`,
      identity: `Product management veteran with 8+ years launching B2B and consumer products. Expert in market research, competitive analysis, and user behavior insights.`,
      style: `像侦探一样不停问 WHY?,数据敏感,直来直去,删一切 fluff。`,
      principles: [
        `PRDs emerge from user interviews, not template filling`,
        `Ship the smallest thing that validates the assumption — iteration over perfection`,
        `Technical feasibility is a constraint, not the driver — user value first`
      ],
      quote: `Ship the smallest thing that validates the assumption — iteration over perfection.`,
      capabilities: [
        { code: `CP`, desc: `引导式 PRD 创建`, skill: `bmad-create-prd` },
        { code: `VP`, desc: `校验 PRD 完整性`, skill: `bmad-validate-prd` },
        { code: `EP`, desc: `更新已有 PRD`, skill: `bmad-edit-prd` },
        { code: `CE`, desc: `创建 Epic 与 Story 列表`, skill: `bmad-create-epics-and-stories` },
        { code: `IR`, desc: `校验 PRD/UX/Architecture/Epics 对齐`, skill: `bmad-check-implementation-readiness` },
        { code: `CC`, desc: `中途纠偏决策`, skill: `bmad-correct-course` }
      ],
      phase: `p2`
    },
    sally: {
      id: `sally`,
      initial: `S`,
      name: `Sally`,
      title: `UX Designer`,
      bg: `linear-gradient(135deg,#34d399,#06b6d4)`,
      identity: `Senior UX Designer with 7+ years creating intuitive experiences across web and mobile.`,
      style: `Empathetic advocate — 用故事化语言让你「感受到」用户的痛。在创造力与边界场景之间平衡。`,
      principles: [
        `Every decision serves genuine user needs`,
        `Start simple, evolve through feedback`,
        `Balance empathy with edge case attention`,
        `AI tools accelerate human-centered design`,
        `Data-informed but always creative`
      ],
      quote: `Start simple, evolve through feedback. AI tools accelerate human-centered design.`,
      capabilities: [
        { code: `UX`, desc: `UX 流程、wireframe、front-end-spec`, skill: `bmad-create-ux-design` }
      ],
      phase: `p2`
    },
    winston: {
      id: `winston`,
      initial: `W`,
      name: `Winston`,
      title: `System Architect`,
      bg: `linear-gradient(135deg,#f59e0b,#ef4444)`,
      identity: `Senior architect with expertise in distributed systems, cloud infrastructure, and API design who specializes in scalable patterns and technology selection.`,
      style: `Calm pragmatic — 在 what could be 与 what should be 之间平衡。Embrace boring technology。`,
      principles: [
        `User journeys drive technical decisions`,
        `Embrace boring technology for stability`,
        `Design simple solutions that scale when needed`,
        `Developer productivity is architecture`,
        `Connect every decision to business value and user impact`
      ],
      quote: `Developer productivity is architecture. Connect every decision to business value.`,
      capabilities: [
        { code: `CA`, desc: `技术架构决策`, skill: `bmad-create-architecture` },
        { code: `IR`, desc: `校验四文档对齐`, skill: `bmad-check-implementation-readiness` }
      ],
      phase: `p3`
    },
    amelia: {
      id: `amelia`,
      initial: `A`,
      name: `Amelia`,
      title: `Senior Software Engineer`,
      bg: `linear-gradient(135deg,#34d399,#0ea5e9)`,
      identity: `Senior software engineer who executes approved stories with strict adherence to story details and team standards.`,
      style: `Ultra-succinct — 说话只有 file paths 和 AC IDs, no fluff, every statement citable。`,
      principles: [
        `All existing and new tests must pass 100% before story is ready for review`,
        `Every task/subtask must be covered by comprehensive unit tests`,
        `READ the entire story file BEFORE any implementation`,
        `Execute tasks/subtasks IN ORDER as written — no skipping, no reordering`,
        `Run full test suite after each task — NEVER proceed with failing tests`,
        `NEVER lie about tests being written or passing`
      ],
      quote: `Tests must actually exist and pass 100%. Never lie about tests.`,
      capabilities: [
        { code: `DS`, desc: `执行下一个 Story`, skill: `bmad-dev-story` },
        { code: `QD`, desc: `Quick Flow 全流程`, skill: `bmad-quick-dev` },
        { code: `QA`, desc: `生成 API 与 E2E 测试`, skill: `bmad-qa-generate-e2e-tests` },
        { code: `CR`, desc: `多维度对抗式代码评审`, skill: `bmad-code-review` },
        { code: `SP`, desc: `生成 Sprint 计划`, skill: `bmad-sprint-planning` },
        { code: `CS`, desc: `创建 Story 上下文`, skill: `bmad-create-story` },
        { code: `ER`, desc: `Party Mode 复盘`, skill: `bmad-retrospective` }
      ],
      phase: `p4`
    }
  },

  concepts: [
    { id: `step-file`, icon: `🏗`, title: `Step-File 架构`, desc: `每个工作流是一组微文件,每个 step 一个独立 .md。Just-in-time 加载、顺序强制执行、菜单处 HALT、frontmatter 追踪 stepsCompleted。这是让 AI 长流程不漂移的根本机制。`, source: `src/bmm-skills/*/steps/` },
    { id: `story-engine`, icon: `🎯`, title: `Story as Context Engine`, desc: `「整个开发过程中最重要的功能」。Story 不是任务卡,是一个自包含的实施边界 — 包括 User Story、AC、Tasks、Dev Notes、Project Context 引用。Dev Agent 一次载入全部跑完。`, source: `bmad-create-story` },
    { id: `constitution`, icon: `📜`, title: `Project Context (Constitution)`, desc: `project-context.md 是你项目的「宪法」。Critical Implementation Rules + Tech Stack + 不显然的约定。所有 Phase 4 工作流自动加载。改了它,所有 Agent 行为就跟着改。`, source: `bmad-generate-project-context` },
    { id: `advanced-elicit`, icon: `🧠`, title: `Advanced Elicitation`, desc: `强制 LLM 用具名思维方法回炉重审自己的输出: Pre-mortem / First Principles / Inversion / Red Team vs Blue / Socratic / Constraint Removal / Stakeholder Mapping / Analogical 等。`, source: `docs/explanation/advanced-elicitation` },
    { id: `adversarial`, icon: `⚔️`, title: `Adversarial Review`, desc: `「必须找出问题」规则。零发现 → HALT,要求重新分析。Reviewer 用 fresh context 跑 — 信息不对称是关键 — 评估 artifact 而不是 intent。`, source: `docs/explanation/adversarial-review` },
    { id: `quick-dev`, icon: `⚡`, title: `Quick Dev — 长跑通道`, desc: `压缩 intent → spec approval → autonomous run → review at end。重新分配 human-in-the-loop: 把人类的注意力留到最关键的瞬间,中间让模型长跑。`, source: `bmad-quick-dev` },
    { id: `checkpoint`, icon: `🔍`, title: `Checkpoint Preview`, desc: `5 步交互式 LLM 引导评审: Orientation → Walkthrough(by concern) → Detail Pass(高 blast radius) → Testing → Wrap-Up。把「看 diff」变成「被引导的理解」。`, source: `bmad-checkpoint-preview` },
    { id: `party-mode`, icon: `🎉`, title: `Party Mode`, desc: `多 Agent 同会话协作。BMad Master 主持,按 message 路由相关 agent。Agent 之间会同意、反驳、互相补充。适合大决策、复盘、技术辩论。`, source: `bmad-party-mode` },
    { id: `scale-adaptive`, icon: `📐`, title: `Scale-Adaptive Workflow`, desc: `BMAD 不强制所有工作流必跑。Bug 修复用 quick-dev 一条命令,企业系统用完整 4 阶段。同一套方法论按项目规模动态裁剪深度。`, source: `docs/explanation/quick-dev` },
    { id: `correct-course`, icon: `🩺`, title: `Correct Course — 错误诊断分层`, desc: `实施失败时不直接补丁。先诊断: 错误进入的是 intent 层、spec 层、还是 implementation 层? 然后回到正确的层去修 — 永远不在错的层补救。`, source: `bmad-correct-course` }
  ]
};

/* ============================================================
 * 准备工具向导 — 端到端引导用户把 BMAD 应用到自己项目
 *
 * 6 步:基础信息 → Brief → PRD → Architecture → Story → 导出
 * 每步问 3-6 个问题,答案存 localStorage,最后生成可下载的 markdown 包
 * ============================================================ */
window.BMAD_WIZARD = {
  title: `准备工具 · 把 BMAD 用到你的项目`,
  intro: `这是一个 6 步傻瓜式向导。跟着填,就能产出你**自己项目**的完整 BMAD 文档包(Brief / PRD / Architecture / Project Context / 第一个 Story),全部可下载。

不是教学,是落地。看完案例演练后,这里就是你动手的地方。

**所有答案自动存浏览器(localStorage),刷新不丢,关浏览器再来还在。** 任何时候点右上角 ✦ 问 AI,可以让 AI 帮你优化某个回答。`,
  steps: [
    {
      id: `basics`,
      num: `01`,
      title: `项目基础信息`,
      phase: ``,
      why: `先把「你是谁、要做什么、规模多大」搞清楚。这决定了后面 5 步的所有内容怎么裁剪 — 5 人小项目和 50 人企业项目走的流程深度完全不一样。`,
      questions: [
        { key: `project_name`, label: `项目名称`, hint: `中文名 / 英文名都行,起一个就好`, multiline: false, placeholder: `例: 团队 AI 周报生成器` },
        { key: `your_role`, label: `你的角色`, hint: `产品经理 / 全栈工程师 / 创始人 / 学生 ...`, multiline: false, placeholder: `例: AI 产品经理 + 1 个全栈工程师搭档` },
        { key: `project_scale`, label: `项目规模`, hint: `用户数、团队人数、时间预期`, multiline: true, placeholder: `例: 5 人内部团队使用 / 2 周做 demo / 不打算商业化` },
        { key: `project_type`, label: `项目类型`, hint: `Greenfield (新建) 还是 Brownfield (在已有系统上加)?`, multiline: false, placeholder: `例: Greenfield 内部工具` },
        { key: `tech_constraint`, label: `技术约束`, hint: `已有的技术栈 / 必须用的服务 / 公司规范`, multiline: true, placeholder: `例: Node.js + Postgres,公司用 Slack,合规要求数据不出境` },
        { key: `current_blocker`, label: `你现在卡在哪?`, hint: `具体说出来,后面 AI 引导会针对这个`, multiline: true, placeholder: `例: 想法有了但不知道 PRD 怎么写;或者 PRD 写完了 dev agent 总是发挥过度` }
      ]
    },
    {
      id: `brief`,
      num: `02`,
      title: `Phase 1 产出 · Product Brief`,
      phase: `p1`,
      why: `这一步对应 BMAD 的 \`bmad-product-brief\` 工作流。你不需要真的去跑那个工作流,只需要在这里回答 6 个问题 — 我会用真实 BMAD 模板帮你拼出一份可用的 brief 草稿。

**核心信念: 跳过这一步不是省时间,是埋雷。** Mary 会反复问的几个问题在这里都列出来了。`,
      questions: [
        { key: `brief_intent`, label: `用一段话描述你要解决的问题`, hint: `不要列功能,先讲为什么 — 真正的痛点是什么`, multiline: true, placeholder: `例: 5 人技术团队每周花 ~3.5 小时写周报,但内容质量越来越差,manager 已经在抱怨「越来越敷衍」` },
        { key: `brief_users`, label: `目标用户是谁?他们今天怎么解决?`, hint: `具体描述现状的细节`, multiline: true, placeholder: `例: 团队 5 个工程师 + 我自己。今天每人手写,30 分钟 / 周,2 个人经常跳过` },
        { key: `brief_alternatives`, label: `现有的替代方案?它们的短板?`, hint: `如果你说「没有竞品」,大概率是没找够`, multiline: true, placeholder: `例: 1) 飞书周报模板 — 太死板 2) GitHub Activity — 只有代码没有上下文 3) 完全不写 — manager 不爽` },
        { key: `brief_why_now`, label: `为什么是现在做?有什么时机或独特机会?`, hint: `Working Backwards 必问的问题`, multiline: true, placeholder: `例: 团队都在用 Cursor / Claude Code,对 AI 协作接受度高,工具能直接落地不需要培训` },
        { key: `brief_uncertainty`, label: `你最不确定的假设是什么?(最容易让项目崩的)`, hint: `预先识别它,后面 PRFAQ 或 Research 能针对性验证`, multiline: true, placeholder: `例: 不确定 manager 是否会接受 AI 生成的内容;不确定从 Slack 拉的数据噪音是否太大` },
        { key: `brief_constraint`, label: `从 PRFAQ 担忧出发,有什么必须强制的约束?`, hint: `这一条会贯穿后面 4 步`, multiline: true, placeholder: `例: 所有 AI 生成的内容必须经写报告人 review 后才能提交,绝不允许「一键自动发送」` }
      ]
    },
    {
      id: `prd`,
      num: `03`,
      title: `Phase 2 产出 · PRD 关键字段`,
      phase: `p2`,
      why: `这对应 \`bmad-create-prd\` 13 步工作流的核心字段。我把 13 步压缩成你必须想清楚的 6 个问题。

**John (PM) 永远会逼你做的事:** 成功指标必须可量化、Scope OUT 必须写。这里同样的规则。`,
      questions: [
        { key: `prd_vision`, label: `产品愿景 (Vision)`, hint: `Why this, why now, why us — 一段话能挂在墙上的`, multiline: true, placeholder: `例: 把 5 人技术团队的周报时间从 150 min/周压到 25 min/周,同时让 manager 满意度从 2.8 升到 4.2` },
        { key: `prd_metrics`, label: `成功指标 (Success Metrics) — 必须可量化`, hint: `至少 3 条。避免「优化体验」这种废话。John 会逼你重写`, multiline: true, placeholder: `例:\n1. 团队总时间节省 ≥ 150 min/周\n2. Manager 满意度评分 ≥ 4.0/5\n3. AI 草稿被采纳率 ≥ 70%` },
        { key: `prd_journey`, label: `核心用户旅程 (3-7 步)`, hint: `从用户进入到达成核心价值的最短路径`, multiline: true, placeholder: `例:\n1. 周五下午打开工具\n2. 选要生成的周(默认本周)\n3. 点「生成」\n4. 看草稿\n5. 编辑确认\n6. 复制走` },
        { key: `prd_scope_in`, label: `Scope IN — MVP 必须做什么`, hint: `具体功能 + 一句话理由`, multiline: true, placeholder: `例:\n- Slack 频道消息抓取(过去 7 天)\n- GitHub PR 列表\n- Jira ticket 状态变化\n- 一键生成 + 编辑 + 复制` },
        { key: `prd_scope_out`, label: `Scope OUT — 明确不做什么 (同样重要)`, hint: `John 强制要求填这一项 — 它让 Architect 不会过度设计`, multiline: true, placeholder: `例:\n- 富文本编辑器(textarea 就行)\n- 版本对比 / diff\n- 多团队管理\n- 移动端\n- 自动发送(强制人工确认)` },
        { key: `prd_nfr`, label: `非功能需求 (NFR)`, hint: `性能 / 安全 / 合规 / 成本里最关键的 3-5 条`, multiline: true, placeholder: `例:\n- 单次生成 < 10s\n- 不上传数据到第三方\n- 月成本 < $20` }
      ]
    },
    {
      id: `arch`,
      num: `04`,
      title: `Phase 3 产出 · Architecture + Project Context`,
      phase: `p3`,
      why: `这对应 \`bmad-create-architecture\` + \`bmad-generate-project-context\` 两个工作流。

**Winston 的核心原则: Embrace boring technology。** 不是为了优雅做架构,是为了用户与商业目标做架构。

**最关键的产出是 project-context.md** — 你项目的「宪法」,后面所有 Phase 4 工作流都会自动加载它。`,
      questions: [
        { key: `arch_stack`, label: `技术栈 (具体到版本)`, hint: `不要写「最新版」,要写具体版本`, multiline: true, placeholder: `例:\n- Node.js 20.x\n- TypeScript 5.3\n- Express 4.x\n- Postgres 16\n- node-postgres (no ORM)` },
        { key: `arch_decisions`, label: `关键架构决策 (3-5 条 ADR)`, hint: `每条都要能回答「为什么选这个不选别的」`, multiline: true, placeholder: `例:\n1. 单体 Express vs 微服务 — 5 用户不需要微服务\n2. node-postgres vs Prisma — 5 张表 Prisma 是过度设计\n3. AI 调用走 services/ai-gateway.ts — 将来换模型不影响业务逻辑` },
        { key: `arch_modules`, label: `模块边界 — 哪些组件独立、哪些共享`, hint: `为下游切 Epic 做准备`, multiline: true, placeholder: `例:\n- services/slack-fetcher.ts (独立)\n- services/github-fetcher.ts (独立)\n- services/jira-fetcher.ts (独立)\n- services/ai-aggregator.ts (用 ai-gateway)\n- routes/ (薄,只调 services)\n- lib/retry.ts (共享 wrapper)` },
        { key: `pc_critical_rules`, label: `project-context.md 的 Critical Implementation Rules`, hint: `**最重要** — 写下「不显然」的项目特有约定。普世最佳实践不用写`, multiline: true, placeholder: `例:\n- 所有第三方 API 调用必须经 lib/retry.ts 的 retryWithBackoff() wrapper\n- NEVER 在 routes 里直接调外部 API\n- 所有 AI 调用必须走 services/ai-gateway.ts\n- 所有 AI 生成的字段在 db 里必须有 is_ai_generated flag + human_reviewed_at timestamp\n- 测试必须 mock 第三方,不能真打 API` }
      ]
    },
    {
      id: `story`,
      num: `05`,
      title: `Phase 4 产出 · 第一个 Story`,
      phase: `p4`,
      why: `这对应 \`bmad-create-story\` — BMAD 称为「整个开发过程中最重要的功能」。

我们只让你写**第一个 Story**(后面 Story 会按同样模式推进)。重点是体会「Story 文件不是任务卡,是上下文边界」的感觉。

**关键: Dev Notes 必须引用 project-context 的硬约束 + 参考已有文件。** 这是防漂移的核心。`,
      questions: [
        { key: `story_key`, label: `Story Key`, hint: `格式 epic-num-name,例如 1-1-slack-fetcher`, multiline: false, placeholder: `例: 1-1-slack-fetcher` },
        { key: `story_user_story`, label: `User Story`, hint: `As a [角色], I want [行为], so that [价值]`, multiline: true, placeholder: `例: 作为内部工具的用户,我想让系统从指定的 Slack 频道拉取过去 7 天的消息,这样后续的 AI 聚合器能基于真实活动生成草稿` },
        { key: `story_ac`, label: `Acceptance Criteria (3-5 条 BDD)`, hint: `每一条都可被自动化测试`, multiline: true, placeholder: `例:\n1. 给定 channel ID 和 7 天的时间窗,fetcher 返回所有消息\n2. 网络错误时自动 retry 3 次,每次间隔翻倍\n3. 单个 channel 超过 1000 条消息时分页取\n4. 单元测试覆盖 happy path + 3 种错误场景` },
        { key: `story_tasks`, label: `Tasks / Subtasks (有序,Dev Agent 严格按这个跑)`, hint: `用 - [ ] 列表写,每一项独立可完成`, multiline: true, placeholder: `例:\n- [ ] 1. 在 src/services/ 创建 slack-fetcher.ts\n- [ ] 2. 实现 fetchChannelMessages(channelId, since)\n- [ ] 3. 用 retryWithBackoff 包装 API 调用\n- [ ] 4. 实现分页 (cursor-based)\n- [ ] 5. 写单元测试 (mock @slack/web-api)` },
        { key: `story_dev_notes`, label: `Dev Notes — 给 Dev Agent 的上下文 (最关键)`, hint: `引用 project-context 的硬约束 + 参考文件路径 + 已学到的教训`, multiline: true, placeholder: `例:\n> 加载自 project-context.md 的关键约束:\n> "All Slack API calls must use retryWithBackoff()"\n> "NEVER call third-party APIs directly from routes"\n\n参考文件:\n- src/lib/retry.ts (已存在,直接用)\n- src/db/schema.sql (messages 表 schema)\n- 类似实现可参考 src/services/jira-fetcher.ts (如果已有)` }
      ]
    },
    {
      id: `export`,
      num: `06`,
      title: `导出 · 你的 BMAD 文档包`,
      phase: ``,
      why: `把前面 5 步答案打包成可下载的 markdown 文件。

**你拿到的是 5 份可以直接用的文档:**
- \`project-brief.md\`
- \`prd.md\`
- \`architecture.md\`
- \`project-context.md\`
- \`stories/${`{story_key}`}.md\`

这 5 份文件可以直接放到你项目的 \`_bmad/\` 目录里,然后用任何 BMAD 兼容的 AI agent 工具(Claude Code / Cursor / Windsurf)继续走完整流程。或者你只是把它们当成「自己写的 PRD 模板」直接用也行。`,
      questions: []
    }
  ]
};

/* Wizard artifact templates — 用 {{key}} 占位符,在导出时替换 */
window.BMAD_WIZARD_TEMPLATES = {
  brief: `# Product Brief: {{project_name}}

> 由 BMAD 准备工具向导生成 · {{date}}

## 1. 问题陈述
{{brief_intent}}

## 2. 目标用户与现状
{{brief_users}}

## 3. 现有替代方案与短板
{{brief_alternatives}}

## 4. 时机分析 (Why Now)
{{brief_why_now}}

## 5. 关键假设 (待验证)
{{brief_uncertainty}}

## 6. 强制约束 (来自 PRFAQ 担忧)
{{brief_constraint}}

---
## 元信息
- 项目名: {{project_name}}
- 你的角色: {{your_role}}
- 项目规模: {{project_scale}}
- 项目类型: {{project_type}}
- 技术约束: {{tech_constraint}}
`,

  prd: `# PRD: {{project_name}}

> 由 BMAD 准备工具向导生成 · {{date}}
> stepsCompleted: [vision, metrics, journey, scope, nfr]

## 1. Vision
{{prd_vision}}

## 2. Success Metrics (可量化)
{{prd_metrics}}

## 3. Core User Journey
{{prd_journey}}

## 4. Scope IN (MVP)
{{prd_scope_in}}

## 5. Scope OUT (明确排除)
{{prd_scope_out}}

## 6. Non-Functional Requirements
{{prd_nfr}}

## 7. 约束(从 Brief 继承)
{{brief_constraint}}

---
## 待 Architect 补充
- 系统上下文图
- 数据模型
- API 契约
- 部署拓扑
`,

  architecture: `# Architecture: {{project_name}}

> 由 BMAD 准备工具向导生成 · {{date}}

## Technology Stack & Versions
{{arch_stack}}

## Key Architecture Decisions (ADR Index)
{{arch_decisions}}

## Module Boundaries
{{arch_modules}}

## Constraints (从 PRD 继承)
{{prd_nfr}}
`,

  projectContext: `# Project Context: {{project_name}}

> 这是项目的「宪法」,所有 Phase 4 工作流自动加载本文件。
> 由 BMAD 准备工具向导生成 · {{date}}

## Technology Stack & Versions
{{arch_stack}}

## Critical Implementation Rules

{{pc_critical_rules}}

## 来自 Brief 的强制约束
{{brief_constraint}}
`,

  story: `---
story_key: {{story_key}}
status: ready-for-dev
stepsCompleted: [created]
---

# Story: {{story_key}}

## Story
{{story_user_story}}

## Acceptance Criteria
{{story_ac}}

## Tasks / Subtasks
{{story_tasks}}

## Dev Notes
{{story_dev_notes}}

### Project Context Reference
> 自动加载 \`project-context.md\` 中的 Critical Implementation Rules
> 任何与 architecture.md 不一致的实现都会触发 correct-course

## Predicted File List
_(由 dev agent 实施时填写)_

## Test Strategy
覆盖 happy path + 主要错误路径 + 边界场景

---

## Dev Agent Record
> 由 dev agent 实施时填写

### Debug Log
_(空)_

### Completion Notes
_(空)_

## File List (actual)
_(待 dev agent 实施后更新)_

## Change Log
_(待 dev agent 实施后更新)_

## Senior Developer Review (AI)
_(待 bmad-code-review 后填写)_
`
};


/* ============================================================
 * AI Provider Presets — for the BYO API Key settings panel
 * 所有预设都使用 OpenAI 兼容格式,方便 server.py 直接转发
 * ============================================================ */
window.AI_PROVIDERS = [
  {
    id: `minimaxi`,
    name: `MiniMaxi 海螺 (国内)`,
    flag: `🇨🇳`,
    desc: `MiniMax 国内官方,reasoning 模型支持好,价格友好`,
    baseUrl: `https://api.minimaxi.com/v1/text/chatcompletion_v2`,
    models: [`MiniMax-M2`, `Minimax-M2.7-highspeed`, `abab6.5s-chat`],
    defaultModel: `Minimax-M2.7-highspeed`,
    keyPrefix: `sk-cp-`,
    consoleUrl: `https://platform.minimaxi.com/`,
    apiKeyUrl: `https://platform.minimaxi.com/user-center/basic-information/interface-key`,
    docsUrl: `https://platform.minimaxi.com/document/`,
    steps: [
      `打开 platform.minimaxi.com 注册账号(支持微信/手机号)`,
      `登录后点击右上角头像 → 进入「用户中心」`,
      `左侧菜单点「接口密钥」`,
      `点「创建新的密钥」按钮,起个名字(随便起,只是给你自己看)`,
      `复制生成的 Key(格式: sk-cp-... 长字符串)`,
      `粘贴到下面的 API Key 输入框,选 model 为 Minimax-M2.7-highspeed,点测试`
    ],
    notes: `新用户注册有免费额度,日常聊天够用很久。Reasoning 模型 (M2 系列) 会返回 reasoning_content,本站会自动折叠显示「思考过程」。`
  },
  {
    id: `deepseek`,
    name: `DeepSeek 深度求索 (国内)`,
    flag: `🇨🇳`,
    desc: `性价比之王,推理能力强,中文好`,
    baseUrl: `https://api.deepseek.com/chat/completions`,
    models: [`deepseek-chat`, `deepseek-reasoner`],
    defaultModel: `deepseek-chat`,
    keyPrefix: `sk-`,
    consoleUrl: `https://platform.deepseek.com/`,
    apiKeyUrl: `https://platform.deepseek.com/api_keys`,
    docsUrl: `https://api-docs.deepseek.com/`,
    steps: [
      `打开 platform.deepseek.com 注册账号(支持手机号/邮箱)`,
      `登录后左侧菜单点「API Keys」`,
      `点「创建 API key」按钮,起个名字`,
      `复制生成的 Key(注意: 创建后只显示一次,关掉就再也看不到)`,
      `粘贴到下面的 API Key 输入框,model 用 deepseek-chat 即可`
    ],
    notes: `首充就送 ¥10,日常对话能用几个月。deepseek-reasoner 是它的 reasoning 模型,效果接近 o1 但价格便宜很多。`
  },
  {
    id: `kimi`,
    name: `Kimi 月之暗面 (国内)`,
    flag: `🇨🇳`,
    desc: `长上下文之王 (128K/200K),适合处理长文档`,
    baseUrl: `https://api.moonshot.cn/v1/chat/completions`,
    models: [`moonshot-v1-8k`, `moonshot-v1-32k`, `moonshot-v1-128k`, `kimi-k2-0711-preview`],
    defaultModel: `moonshot-v1-32k`,
    keyPrefix: `sk-`,
    consoleUrl: `https://platform.moonshot.cn/`,
    apiKeyUrl: `https://platform.moonshot.cn/console/api-keys`,
    docsUrl: `https://platform.moonshot.cn/docs/`,
    steps: [
      `打开 platform.moonshot.cn 注册账号`,
      `登录后左侧「API Key 管理」`,
      `点「新建」按钮,起个名字`,
      `复制 Key (sk- 开头)`,
      `粘贴下面,model 选 moonshot-v1-32k 平衡价格与上下文`
    ],
    notes: `如果你的项目需要喂大段文档(整份 PRD、整个 codebase 摘要),Kimi 的 128k 是最好的选择之一。`
  },
  {
    id: `zhipu`,
    name: `智谱 GLM (国内)`,
    flag: `🇨🇳`,
    desc: `智谱 AI 旗下,GLM-4 系列性能稳定`,
    baseUrl: `https://open.bigmodel.cn/api/paas/v4/chat/completions`,
    models: [`glm-4-plus`, `glm-4-air`, `glm-4-flash`, `glm-4.6`],
    defaultModel: `glm-4-flash`,
    keyPrefix: `(JWT 长字符串)`,
    consoleUrl: `https://open.bigmodel.cn/`,
    apiKeyUrl: `https://open.bigmodel.cn/usercenter/apikeys`,
    docsUrl: `https://open.bigmodel.cn/dev/api`,
    steps: [
      `打开 open.bigmodel.cn 注册「智谱 AI 开放平台」账号`,
      `登录后点右上角头像 → 「API Keys」`,
      `复制现成的 Key (注册时自动生成,格式: id.secret 拼接的 JWT)`,
      `粘贴到下面,model 用 glm-4-flash (免费版) 或 glm-4-plus (付费旗舰)`
    ],
    notes: `glm-4-flash 完全免费,响应快;glm-4-plus 付费但能力强很多。新用户也有大量免费额度。`
  },
  {
    id: `qwen`,
    name: `通义千问 (阿里云)`,
    flag: `🇨🇳`,
    desc: `阿里 DashScope,Qwen 系列,生态完整`,
    baseUrl: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`,
    models: [`qwen-plus`, `qwen-max`, `qwen-turbo`, `qwen2.5-72b-instruct`],
    defaultModel: `qwen-plus`,
    keyPrefix: `sk-`,
    consoleUrl: `https://dashscope.console.aliyun.com/`,
    apiKeyUrl: `https://dashscope.console.aliyun.com/apiKey`,
    docsUrl: `https://help.aliyun.com/zh/dashscope/`,
    steps: [
      `打开 dashscope.console.aliyun.com (需要阿里云账号,支持支付宝登录)`,
      `首次进入会让你「开通 DashScope 服务」,免费开通`,
      `开通后点左侧「API-KEY 管理」`,
      `点「创建新的 API-KEY」,起个名字,复制 (sk- 开头)`,
      `粘贴下面,**注意 base url 必须是 compatible-mode 这条**`
    ],
    notes: `阿里云的 OpenAI 兼容路径必须用 dashscope.aliyuncs.com/compatible-mode/v1/chat/completions,千万别用原生路径。`
  },
  {
    id: `openai`,
    name: `OpenAI 官方 (海外)`,
    flag: `🌍`,
    desc: `GPT-4o / GPT-4 / o1 系列。需要海外信用卡和网络`,
    baseUrl: `https://api.openai.com/v1/chat/completions`,
    models: [`gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `o1-mini`],
    defaultModel: `gpt-4o-mini`,
    keyPrefix: `sk-`,
    consoleUrl: `https://platform.openai.com/`,
    apiKeyUrl: `https://platform.openai.com/api-keys`,
    docsUrl: `https://platform.openai.com/docs/`,
    steps: [
      `打开 platform.openai.com 注册 (需要海外手机号验证)`,
      `登录后绑定海外信用卡 + 充值至少 $5`,
      `左上角「API keys」`,
      `点「Create new secret key」,起个名字`,
      `复制 sk- 开头的 Key (创建后只显示一次)`,
      `粘贴下面,model 选 gpt-4o-mini 性价比最高`
    ],
    notes: `国内访问需要稳定的代理。如果国内用户用不了官方,推荐下面的 OpenRouter 或国产模型。`
  },
  {
    id: `openrouter`,
    name: `OpenRouter (聚合 — 一个 Key 用所有模型)`,
    flag: `🌐`,
    desc: `推荐: 一个 Key 同时支持 Claude、GPT、Gemini、Llama 等几十个模型,按 token 计费`,
    baseUrl: `https://openrouter.ai/api/v1/chat/completions`,
    models: [`anthropic/claude-sonnet-4`, `anthropic/claude-3.5-sonnet`, `openai/gpt-4o`, `google/gemini-pro-1.5`, `meta-llama/llama-3.3-70b-instruct`],
    defaultModel: `anthropic/claude-3.5-sonnet`,
    keyPrefix: `sk-or-v1-`,
    consoleUrl: `https://openrouter.ai/`,
    apiKeyUrl: `https://openrouter.ai/keys`,
    docsUrl: `https://openrouter.ai/docs`,
    steps: [
      `打开 openrouter.ai 用 GitHub / Google 账号登录`,
      `右上角头像 → 「Credits」充值 (支持信用卡、加密货币)`,
      `回到主页,点「Keys」`,
      `点「Create Key」,起个名字`,
      `复制 sk-or-v1- 开头的 Key`,
      `粘贴下面,model 用 \`anthropic/claude-3.5-sonnet\` (用 / 分隔 vendor 和模型名)`
    ],
    notes: `这是想用 Claude 但没有 Anthropic 直接渠道的最佳选择。一个 Key 走遍所有主流模型,model 字段格式必须是 \`vendor/model-name\`。`
  },
  {
    id: `custom`,
    name: `自定义 (任何 OpenAI 兼容端点)`,
    flag: `⚙️`,
    desc: `任何兼容 OpenAI Chat Completions 格式的服务都可以填这里`,
    baseUrl: ``,
    models: [],
    defaultModel: ``,
    keyPrefix: ``,
    consoleUrl: ``,
    apiKeyUrl: ``,
    docsUrl: ``,
    steps: [
      `Base URL: 完整路径,通常以 /v1/chat/completions 或类似结尾`,
      `API Key: 你从该服务控制台获取的密钥`,
      `Model: 该服务支持的模型名,完全照该服务文档填`
    ],
    notes: `自部署 vLLM、Ollama (开 OpenAI 兼容端口)、本地 LM Studio、第三方代理 — 都可以用这个选项。`
  }
];


window.BMAD_SYSTEM_KNOWLEDGE = `BMAD Method (Build More Architect Dreams) 是一套 AI 驱动敏捷开发方法论,GitHub: bmad-code-org/BMAD-METHOD。

它把产品开发拆成 4 个阶段:

**Phase 1 — Analysis 分析** (src/bmm-skills/1-analysis/)
目标: 在动手前想清楚问题、市场、用户、可行性。
工作流: bmad-brainstorming、bmad-product-brief(三模式)、bmad-prfaq(亚马逊 Working Backwards)、bmad-document-project、market/domain/technical research。
角色: Mary (Strategic Business Analyst, treasure hunter 型)。
原则: 需求源自访谈不是模板 / Capture-don't-interrupt / Anything-else 模式 / 先理解意图再扫资料。

**Phase 2 — Plan 规划** (src/bmm-skills/2-plan-workflows/)
目标: 把分析洞察转化为结构化 PRD 与 UX 设计。
工作流: bmad-create-prd(13 步 step-file 引导)、bmad-validate-prd、bmad-edit-prd、bmad-create-ux-design。
角色: John (PM, 像侦探一样不停问 WHY) + Sally (UX, empathetic storyteller)。
关键: bmad-create-prd 是 13 步微文件工作流,每一步独立加载、顺序执行、菜单处 HALT、append-only 写到同一个文件。
原则: PRDs emerge from user interviews / Step-file 5 条 critical rules / JIT loading / Greenfield vs Brownfield 自适应。

**Phase 3 — Solutioning 解决方案** (src/bmm-skills/3-solutioning/)
目标: 把 PRD 变成 AI 可执行的架构与「项目宪法」。
工作流: bmad-create-architecture、bmad-create-epics-and-stories、bmad-generate-project-context、bmad-check-implementation-readiness。
角色: Winston (Architect, calm pragmatic, embrace boring technology)。
关键: project-context.md 是「项目的宪法」,记录 Tech Stack & Versions + Critical Implementation Rules,所有 Phase 4 工作流自动加载它。
原则: Boring technology wins / 决策必须连接业务价值 / Implementation Readiness Check 是从规划到实施的最后质量闸 / Developer productivity is architecture。

**Phase 4 — Implementation 实施** (src/bmm-skills/4-implementation/)
目标: 在强约束下让 Dev Agent 长跑。
工作流: bmad-sprint-planning、bmad-create-story(Story Context Engine)、bmad-dev-story、bmad-code-review(对抗式)、bmad-checkpoint-preview(5 步人工评审)、bmad-quick-dev(长跑通道)、bmad-correct-course(错误诊断分层)、bmad-retrospective(Party Mode 复盘)。
角色: Amelia (Senior Software Engineer, ultra-succinct, Tests must actually exist and pass 100%, never lie about tests)。
关键: bmad-create-story 防住 Dev Agent 7 类常见错误(reinventing wheels / wrong libraries / wrong file locations / breaking regressions / ignoring UX / vague implementations / lying about completion)。
原则: Story Context Engine 是核心 / Dev Agent 严格按 Tasks 顺序、不准以「取得了重大进展」为理由停止 / Adversarial Review 必须找出问题 / Triage 而不是 Exhaust / 错误回到进入的层去修。

**5 个核心 Agent:**
- Mary (Analyst, Phase 1) — Treasure hunter 型分析师
- John (PM, Phase 2) — 像侦探一样不停问 WHY
- Sally (UX Designer, Phase 2) — Empathetic storyteller
- Winston (Architect, Phase 3) — Calm pragmatic, boring technology
- Amelia (Dev, Phase 4) — Ultra-precise, tests must pass 100%

**10 个核心概念:**
1. Step-File 架构 — 微文件 + JIT 加载 + 顺序强制 + frontmatter 追踪
2. Story as Context Engine
3. Project Context (Constitution)
4. Advanced Elicitation (8 种思维方法)
5. Adversarial Review
6. Quick Dev 长跑通道
7. Checkpoint Preview (5 步人工评审)
8. Party Mode (多 Agent 同会话)
9. Scale-Adaptive
10. Correct Course (错误诊断分层)

你的角色: 你是这套方法论的中文 AI 助手。
- 用户问 BMAD 方法论时,基于以上知识精准回答(可以引用 workflow 名、step 名、原则)
- 用户问「我的项目该怎么用」时,先反问 2-3 个问题摸清: 项目类型(greenfield/brownfield)、规模(小改动/MVP/企业)、卡在哪个阶段,然后给出适配建议
- 用户没明确问问题时,主动用引导式提问帮他想清楚 — 像 Mary 那样
- 始终用中文回答
- 答案要短而准,不要 fluff,关键概念可以用粗体
- 当被问到当前用户正在查看的 workflow / 概念时,以那个上下文为主`;
