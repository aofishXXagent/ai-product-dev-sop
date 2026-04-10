/* ============================================================
 * BMAD Workflow Site — App
 * 三栏 SPA · 路由基于 hash · AI chat 接 /api/chat
 * ============================================================ */

const DATA = window.BMAD_DATA;
const SYSTEM_PROMPT = window.BMAD_SYSTEM_KNOWLEDGE;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ----- minimal markdown -> html (粗糙够用版) ----- */
function md(src) {
  if (!src) return "";
  let s = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // code blocks
  s = s.replace(/```([\s\S]*?)```/g, (_, code) =>
    `<pre><code>${code.trim()}</code></pre>`
  );
  // inline code
  s = s.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  // GFM tables — must come BEFORE paragraph splitting
  // Match: header row | separator row | body rows...
  s = s.replace(
    /(^\|.+\|[ \t]*\n\|[ \t\-:|]+\|[ \t]*\n(?:\|.*\|[ \t]*(?:\n|$))+)/gm,
    (block) => {
      const lines = block.trim().split(/\n/);
      const splitRow = (line) =>
        line.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      const head = splitRow(lines[0]);
      const aligns = splitRow(lines[1]).map(spec => {
        const left = spec.startsWith(":");
        const right = spec.endsWith(":");
        if (left && right) return "center";
        if (right) return "right";
        if (left) return "left";
        return "";
      });
      const body = lines.slice(2).map(splitRow);
      const th = head.map((c, i) => {
        const a = aligns[i];
        return `<th${a ? ` style="text-align:${a}"` : ""}>${c}</th>`;
      }).join("");
      const tr = body.map(row => {
        const tds = row.map((c, i) => {
          const a = aligns[i];
          return `<td${a ? ` style="text-align:${a}"` : ""}>${c}</td>`;
        }).join("");
        return `<tr>${tds}</tr>`;
      }).join("");
      return `<table class="md-table"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
    }
  );
  // bold
  s = s.replace(/\*\*([^\*\n]+)\*\*/g, "<strong>$1</strong>");
  // italic (avoid clashes with bold)
  s = s.replace(/(^|[^\*])\*([^\*\n]+)\*/g, "$1<em>$2</em>");
  // headings
  s = s.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  s = s.replace(/^###\s+(.+)$/gm, "<h4>$1</h4>");
  // blockquote
  s = s.replace(/^>\s?(.*)$/gm, "<blockquote><p>$1</p></blockquote>");
  s = s.replace(/<\/blockquote>\s*<blockquote>/g, "");
  // ordered list
  s = s.replace(/(?:^\d+\.\s.+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split(/\n/).map(l =>
      `<li>${l.replace(/^\d+\.\s+/, "")}</li>`
    ).join("");
    return `<ol>${items}</ol>`;
  });
  // bullet list
  s = s.replace(/(?:^[-*]\s.+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split(/\n/).map(l =>
      `<li>${l.replace(/^[-*]\s+/, "")}</li>`
    ).join("");
    return `<ul>${items}</ul>`;
  });
  // paragraphs (split on blank line)
  s = s
    .split(/\n{2,}/)
    .map(block => {
      if (/^\s*<(h\d|ul|ol|pre|blockquote|table)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  return s;
}

/* ============================================================
 * SIDEBAR
 * ============================================================ */
function renderSidebar() {
  const sidebar = $("#sidebar");
  const items = [];

  items.push(`
    <div class="sidebar-section">
      <div class="sidebar-section-title">起步</div>
      <div class="sidebar-item" data-route="intro">
        <span class="dot" style="background:#6ee7ff"></span>BMAD 是什么
      </div>
      <div class="sidebar-item" data-route="walkthrough">
        <span class="dot" style="background:#a78bfa"></span>📖 完整案例演练
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-title">准备工具</div>
      <div class="sidebar-item" data-route="wizard">
        <span class="dot" style="background:#34d399"></span>🛠 3 分钟速通
      </div>
    </div>
  `);

  items.push(`<div class="sidebar-section"><div class="sidebar-section-title">完整工作流</div>`);
  for (const phase of DATA.phases) {
    items.push(`
      <div class="sidebar-phase" data-phase="${phase.id}" data-route="phase:${phase.id}">
        <span class="ph-num">${phase.num}</span>
        <span>${phase.name}</span>
      </div>
      <div class="sidebar-workflow-list">
        ${phase.workflows.map(w => `
          <div class="sidebar-workflow" data-route="workflow:${phase.id}:${w.id}">
            <span>${w.title}</span>
          </div>
        `).join("")}
      </div>
    `);
  }
  items.push(`</div>`);

  items.push(`
    <div class="sidebar-section">
      <div class="sidebar-section-title">5 位 Agent</div>
      ${Object.values(DATA.agents).map(a => `
        <div class="sidebar-item" data-route="agent:${a.id}">
          <span class="dot" style="background:${a.bg.match(/#\w+/)[0]}"></span>${a.name} · ${a.title}
        </div>
      `).join("")}
    </div>
  `);

  items.push(`
    <div class="sidebar-section">
      <div class="sidebar-section-title">10 个核心概念</div>
      ${DATA.concepts.map(c => `
        <div class="sidebar-item" data-route="concept:${c.id}">
          <span class="dot" style="background:#a78bfa"></span>${c.title}
        </div>
      `).join("")}
    </div>

    <div class="sidebar-credit">
      <div class="credit-label">原创方法论</div>
      <div class="credit-body">
        BMAD Method · 由 <strong>Brian (BMad) Madison</strong> 与 <a href="https://github.com/bmad-code-org/BMAD-METHOD" target="_blank">bmad-code-org</a> 团队创作。
      </div>
      <div class="credit-body" style="margin-top:6px;color:var(--text-mute);font-size:10.5px;">
        本站为非官方中文学习辅助 · 内容根据其开源仓库源码与官方文档整理 · 所有方法论原创性归原作者所有 · MIT License
      </div>
    </div>
  `);

  sidebar.innerHTML = items.join("");

  sidebar.addEventListener("click", (e) => {
    const item = e.target.closest("[data-route]");
    if (!item) return;
    const route = item.dataset.route;
    location.hash = "#/" + route;
  });
}

function highlightSidebar(route) {
  $$(".sidebar [data-route]").forEach(el => {
    const r = el.dataset.route;
    // All wizard sub-routes share one sidebar item
    if (r === "wizard" && (route === "wizard" || route.startsWith("wizard/") || route.startsWith("wizard:"))) {
      el.classList.add("active");
    } else {
      el.classList.toggle("active", r === route);
    }
  });
}

/* ============================================================
 * ROUTER
 * ============================================================ */
function parseRoute() {
  const hash = location.hash.replace(/^#\//, "");
  if (!hash) return { type: "intro" };
  const parts = hash.split(":");
  if (parts[0] === "intro") return { type: "intro" };
  if (parts[0] === "walkthrough") return { type: "walkthrough" };
  if (parts[0] === "wizard") {
    // New: wizard (home), wizard/brief, wizard/prd, wizard/arch, wizard/story, wizard/onepager
    // Backward-compat: wizard:0..5 (legacy 6-step) — redirect to home
    const sub = parts[1];
    if (!sub) return { type: "wizard-home" };
    if (/^\d+$/.test(sub)) return { type: "wizard-home" };  // legacy redirect
    if (sub === "onepager") return { type: "wizard-onepager" };
    if (window.BMAD_DEEPEN && window.BMAD_DEEPEN[sub]) return { type: "wizard-deepen", deepenId: sub };
    return { type: "wizard-home" };
  }
  if (parts[0] === "phase") return { type: "phase", phaseId: parts[1] };
  if (parts[0] === "workflow") return { type: "workflow", phaseId: parts[1], workflowId: parts[2] };
  if (parts[0] === "agent") return { type: "agent", agentId: parts[1] };
  if (parts[0] === "concept") return { type: "concept", conceptId: parts[1] };
  return { type: "intro" };
}

function renderRoute() {
  const route = parseRoute();
  highlightSidebar(location.hash.replace(/^#\//, ""));

  let html = "";
  let context = { type: "intro" };

  switch (route.type) {
    case "intro":
      html = renderIntro();
      context = { title: "BMAD 总览", body: DATA.intro.body };
      break;
    case "walkthrough":
      html = renderWalkthrough();
      context = {
        title: "完整案例演练 · 团队 AI 周报生成器",
        body: `一个 AI PM 用 BMAD 4 阶段从想法到 demo 的完整案例。${DATA.walkthrough.scenario}`
      };
      break;
    case "wizard-home":
      html = renderWizardHome();
      context = {
        title: `准备工具 · 速通主页`,
        body: `用户在用 3 问速通版工具。${window.BMAD_QUICK.promise}`
      };
      break;
    case "wizard-onepager":
      html = renderWizardOnePager();
      context = {
        title: `准备工具 · 你的 BMAD 一页纸`,
        body: `用户已生成或正在生成针对项目的 BMAD 一页纸。`
      };
      break;
    case "wizard-deepen":
      html = renderWizardDeepen(route.deepenId);
      const dp = window.BMAD_DEEPEN[route.deepenId];
      context = {
        title: `深挖 · ${dp ? dp.title : ''}`,
        body: dp ? dp.intro : ''
      };
      break;
    case "phase":
      const phase = DATA.phases.find(p => p.id === route.phaseId);
      if (phase) {
        html = renderPhase(phase);
        context = { title: `${phase.name} (${phase.num})`, body: phase.goal };
      }
      break;
    case "workflow":
      const ph = DATA.phases.find(p => p.id === route.phaseId);
      const wf = ph?.workflows.find(w => w.id === route.workflowId);
      if (wf) {
        html = renderWorkflow(ph, wf);
        context = { title: `${wf.name} (${ph.name})`, body: `${wf.tagline}\n\n${wf.how}` };
      }
      break;
    case "agent":
      const agent = DATA.agents[route.agentId];
      if (agent) {
        html = renderAgent(agent);
        context = { title: `Agent: ${agent.name} - ${agent.title}`, body: `${agent.identity}\n\nStyle: ${agent.style}\n\n原则: ${agent.principles.join(" / ")}` };
      }
      break;
    case "concept":
      const concept = DATA.concepts.find(c => c.id === route.conceptId);
      if (concept) {
        html = renderConcept(concept);
        context = { title: `核心概念: ${concept.title}`, body: concept.desc };
      }
      break;
  }

  $("#main").innerHTML = `<div class="main-inner">${html}</div>`;
  $("#main").scrollTop = 0;
  CURRENT_CONTEXT = context;
  updateChatContextBar();
  // Auto-focus input for deepen paths only
  if (route.type === "wizard-deepen") {
    focusWizardInput();
  }
}

/* ============================================================
 * RENDERERS
 * ============================================================ */
function renderIntro() {
  return `
    <div class="intro-hero">
      <div class="page-eyebrow">BMAD METHOD V6 · 中文交互指南</div>
      <h1 class="page-title">${DATA.intro.title}</h1>
    </div>
    <div class="intro-body">${md(DATA.intro.body)}</div>

    <div class="intro-stats">
      <div class="stat-card"><span class="num">4</span><span class="lab">阶段</span></div>
      <div class="stat-card"><span class="num">${DATA.phases.reduce((s, p) => s + p.workflows.length, 0)}</span><span class="lab">工作流</span></div>
      <div class="stat-card"><span class="num">${Object.keys(DATA.agents).length}</span><span class="lab">核心 Agent</span></div>
      <div class="stat-card"><span class="num">${DATA.concepts.length}</span><span class="lab">底层概念</span></div>
    </div>

    ${askAiCta("BMAD 看起来很多东西,我从哪开始?", [
      "我没接触过 AI 产品开发,从哪开始最容易入门?",
      "我的项目规模很小,需要跑完整 4 阶段吗?",
      "BMAD 跟 Cursor / Claude Code 有什么区别?"
    ])}

    <div class="page-section">
      <h3>4 个阶段速览</h3>
      <div class="cards-grid">
        ${DATA.phases.map(p => `
          <div class="workflow-card" data-route="phase:${p.id}">
            <div class="wf-name">${p.num} · ${p.workflows.length} 个工作流</div>
            <div class="wf-title">${p.name}</div>
            <div class="wf-tag">${p.tagline}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderPhase(phase) {
  const agentList = phase.agents.map(aid => DATA.agents[aid]).filter(Boolean);

  return `
    <div class="page-eyebrow">PHASE ${phase.num}</div>
    <div class="phase-banner" data-phase="${phase.id}">
      <div class="phase-num">PHASE ${phase.num} · <code>${phase.sourcePath}</code></div>
      <h1>${phase.name}</h1>
      <div class="phase-tagline">${phase.tagline}</div>
      <div class="phase-goal">${phase.goal}</div>
    </div>

    ${askAiCta(`这个阶段对我项目怎么用?`, [
      `${phase.name}阶段的核心目标是什么?`,
      `我的项目如果想跳过${phase.name},会有什么风险?`,
      `${phase.name}阶段哪个工作流最关键?`
    ])}

    <div class="page-section">
      <h3>包含的工作流</h3>
      <div class="cards-grid">
        ${phase.workflows.map(w => `
          <div class="workflow-card" data-route="workflow:${phase.id}:${w.id}">
            <div class="wf-name">${w.name}</div>
            <div class="wf-title">${w.title}</div>
            <div class="wf-tag">${w.tagline}</div>
            <div class="wf-when">${w.when}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="page-section">
      <h3>参与角色</h3>
      <div class="cards-grid">
        ${agentList.map(a => `
          <div class="workflow-card" data-route="agent:${a.id}">
            <div class="wf-name">${a.title}</div>
            <div class="wf-title">${a.name}</div>
            <div class="wf-tag">${a.style}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="page-section">
      <h3>核心原则</h3>
      <div class="principles-list">
        ${phase.principles.map(p => `
          <div class="principle">
            <div class="principle-head">${p.title}</div>
            <div class="principle-body">${md(p.body)}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="page-section">
      <h3>决策矩阵 — 什么时候用什么</h3>
      <table class="decision-table">
        ${phase.decisionMatrix.map(d => `
          <tr><td>${d.when}</td><td>${d.choose}</td></tr>
        `).join("")}
      </table>
    </div>

    <div class="quote-block">${phase.quote}</div>
  `;
}

function renderWorkflow(phase, wf) {
  return `
    <div class="page-eyebrow">${phase.name} · WORKFLOW</div>
    <h1 class="page-title">${wf.title}</h1>
    <div class="page-tagline">${wf.tagline}</div>

    <div class="wf-detail-meta">
      <div class="wf-meta-pill">代码: <code>${wf.name}</code></div>
      <div class="wf-meta-pill">适用: ${wf.when}</div>
      <div class="wf-meta-pill">来源: <code>${wf.source}</code></div>
    </div>

    ${askAiCta(`这个工作流我怎么用到自己的项目?`, [
      `${wf.title}的核心步骤是什么?`,
      `我的项目情况是 [描述项目],跑${wf.title}应该注意什么?`,
      `${wf.title}和它前后的工作流是什么关系?`
    ])}

    <div class="page-section">
      <h3>怎么跑</h3>
      <div class="wf-how">${md(wf.how)}</div>
    </div>

    ${wf.detailedSteps ? `
      <div class="page-section">
        <h3>详细操作步骤 · 每一步在做什么</h3>
        <div class="wf-how">${md(wf.detailedSteps)}</div>
      </div>
    ` : ""}

    ${wf.runFlow ? `
      <div class="page-section">
        <h3>完整运行流程 · 真实对话片段</h3>
        <div class="wf-runflow">${md(wf.runFlow)}</div>
      </div>
    ` : ""}

    ${wf.pitfalls && wf.pitfalls.length ? `
      <div class="page-section">
        <h3>常见坑 · 出问题怎么救</h3>
        <div class="wf-pitfalls">
          ${wf.pitfalls.map((p, i) => `
            <div class="pitfall-item">
              <div class="pitfall-num">${i + 1}</div>
              <div class="pitfall-content">
                <div class="pitfall-problem"><strong>问题:</strong> ${md(p.problem)}</div>
                <div class="pitfall-fix"><strong>解法:</strong> ${md(p.fix)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <div class="page-section">
      <h3>产出物</h3>
      <div class="wf-outputs">
        ${wf.outputs.map(o => `<div class="wf-output-chip">${o}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderAgent(agent) {
  return `
    <div class="page-eyebrow">AGENT</div>
    <div class="agent-hero">
      <div class="agent-avatar-xl" style="background:${agent.bg}">${agent.initial}</div>
      <div class="agent-meta">
        <h1>${agent.name}</h1>
        <div class="role-title">${agent.title}</div>
        <div class="style">${agent.style}</div>
      </div>
    </div>

    <div class="agent-quote-big">"${agent.quote}"</div>

    ${askAiCta(`想知道 ${agent.name} 怎么和我协作?`, [
      `${agent.name} 在 BMAD 里负责什么?`,
      `什么时候应该召唤 ${agent.name}?`,
      `${agent.name} 跟其他 Agent 怎么交接产出物?`
    ])}

    <div class="page-section">
      <h3>身份</h3>
      <div class="wf-how">${md(agent.identity)}</div>
    </div>

    <div class="page-section">
      <h3>原则</h3>
      <div class="principles-list">
        ${agent.principles.map(p => `<div class="principle"><div class="principle-body">${md(p)}</div></div>`).join("")}
      </div>
    </div>

    <div class="page-section">
      <h3>能力清单</h3>
      <table class="capabilities-table">
        <tr><th>代码</th><th>描述</th><th>对应 Skill</th></tr>
        ${agent.capabilities.map(c => `
          <tr>
            <td><span class="cap-code">${c.code}</span></td>
            <td>${c.desc}</td>
            <td><span class="cap-skill">${c.skill}</span></td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;
}

function renderConcept(concept) {
  return `
    <div class="page-eyebrow">CORE CONCEPT</div>
    <div class="concept-hero">
      <div class="concept-icon-big">${concept.icon}</div>
      <h1 class="page-title" style="margin-bottom:14px">${concept.title}</h1>
      <div class="wf-how" style="background:transparent;border:none;padding:0">${md(concept.desc)}</div>
      <div class="concept-source-tag">📁 源文件: ${concept.source}</div>
    </div>

    ${askAiCta(`想深入理解 ${concept.title}?`, [
      `${concept.title} 解决了什么问题?`,
      `${concept.title} 在我的项目里怎么落地?`,
      `${concept.title} 和其他 BMAD 概念是什么关系?`
    ])}
  `;
}

function renderWalkthrough() {
  const wt = DATA.walkthrough;
  return `
    <div class="page-eyebrow">📖 GUIDED WALKTHROUGH</div>
    <h1 class="page-title">${wt.title}</h1>
    <div class="page-tagline">${wt.subtitle}</div>

    <div class="credit-banner">
      ✦ 本案例所演示的 BMAD 方法论由 <strong>Brian (BMad) Madison</strong> 与 <a href="https://github.com/bmad-code-org/BMAD-METHOD" target="_blank">bmad-code-org</a> 团队原创 · 本案例叙事为本站基于其开源框架制作的中文教学示例 · 致敬原作者
    </div>

    <div class="wt-scenario">
      <div class="wt-scenario-label">🎬 案例背景</div>
      <div class="wt-scenario-body">${md(wt.scenario)}</div>
    </div>

    ${askAiCta(`想问案例里的某一步细节?`, [
      `Mary 在 Phase 1 的反问对我项目也适用吗?`,
      `如果我的项目比这个案例更小,4 阶段能压缩到几步?`,
      `project-context.md 我可以怎么写?给我一个模板`
    ])}

    ${wt.steps.map((step, idx) => `
      <div class="wt-step" data-phase="${step.phaseId}">
        <div class="wt-step-header">
          <div class="wt-step-num" data-phase="${step.phaseId}">${idx + 1}</div>
          <div class="wt-step-meta">
            <div class="wt-step-phase">${step.phaseName}</div>
            <h2>${step.title}</h2>
          </div>
        </div>

        <div class="wt-narrative">${md(step.narrative)}</div>

        <div class="wt-dialogue">
          ${step.dialogue.map(d => `
            <div class="wt-bubble ${d.who}" ${d.color ? `style="--bubble-c:${d.color}"` : ''}>
              <div class="wt-bubble-who">${d.name}</div>
              <div class="wt-bubble-text">${md(d.text)}</div>
            </div>
          `).join("")}
        </div>

        ${step.crisis ? `
          <div class="wt-crisis">
            <div class="wt-crisis-label">⚠️ 关键转折点</div>
            <div class="wt-crisis-body">${md(step.crisis)}</div>
          </div>
        ` : ""}

        ${step.artifact ? `
          <div class="wt-artifact">
            <div class="wt-artifact-head">📄 ${step.artifact.name}</div>
            <pre>${escapeAttr(step.artifact.body)}</pre>
          </div>
        ` : ""}

        <div class="wt-takeaway">
          <div class="wt-takeaway-label">✨ 这一步学到的</div>
          <div class="wt-takeaway-body">${md(step.takeaway)}</div>
        </div>
      </div>
    `).join("")}

    <div class="wt-summary">
      <div class="page-eyebrow">SUMMARY</div>
      <h2>${wt.summary.title}</h2>
      <div class="wt-summary-body">${md(wt.summary.table)}</div>
      <div class="wt-summary-conclusion">${md(wt.summary.conclusion)}</div>
    </div>

    ${askAiCta(`案例看完了 — 我自己的项目怎么开始?`, [
      `我描述一下我的项目情况,你帮我看应该跑哪些工作流`,
      `帮我写一份我的项目的 project-context.md 草稿`,
      `我没有团队,只有一个人 + Claude Code,这套流程对我太重了吗?`
    ])}
  `;
}

/* ============================================================
 * WIZARD — 准备工具向导
 * ============================================================ */
const WIZARD_KEY = "bmad-wizard-answers-v1";
function loadWizardAnswers() {
  try { return JSON.parse(localStorage.getItem(WIZARD_KEY) || "{}"); }
  catch { return {}; }
}
function saveWizardAnswer(key, value) {
  const all = loadWizardAnswers();
  all[key] = value;
  localStorage.setItem(WIZARD_KEY, JSON.stringify(all));
}
function clearWizardAnswers() {
  localStorage.removeItem(WIZARD_KEY);
}

/* ----- Wizard 对话式状态 (用于深挖路径) ----- */
const WIZARD_EDIT_KEY = "bmad-wizard-edit-mode-v1";
function isEditMode(stepIdx) {
  try {
    const m = JSON.parse(localStorage.getItem(WIZARD_EDIT_KEY) || "{}");
    return !!m[stepIdx];
  } catch { return false; }
}
function setEditMode(stepIdx, on) {
  try {
    const m = JSON.parse(localStorage.getItem(WIZARD_EDIT_KEY) || "{}");
    if (on) m[stepIdx] = true; else delete m[stepIdx];
    localStorage.setItem(WIZARD_EDIT_KEY, JSON.stringify(m));
  } catch {}
}

// Friendly system phrases (rotation for variety)
const ACK_PHRASES = [`✓ 记下了`, `👍 收到`, `好的,继续`, `✓ 写进文档了`, `👌 很好`, `✓ 已保存`];

/* ============================================================
 * SPEEDRUN HOME — 3 问速通主页
 * ============================================================ */
function renderWizardHome() {
  const Q = window.BMAD_QUICK;
  const answers = loadWizardAnswers();
  const required = Q.questions.filter(q => !q.optional);
  const requiredCount = required.length;
  const answeredRequired = required.filter(q => answers[q.key] && answers[q.key].trim()).length;
  const allDone = answeredRequired >= requiredCount;

  // Check if onepager already generated
  const onePagerData = loadOnePager();
  const hasOnePager = !!(onePagerData && onePagerData.phase1);

  const progressPct = (answeredRequired / requiredCount) * 100;

  return `
    <div class="page-eyebrow">🛠 准备工具 · 速通版</div>
    <h1 class="page-title">${Q.title}</h1>
    <div class="page-tagline">${Q.subtitle}</div>

    <div class="quick-promise">
      ${md(Q.promise)}
    </div>

    <div class="quick-progress-bar">
      <div class="qpb-label">
        <span>进度</span>
        <strong>${answeredRequired} / ${requiredCount}</strong>
        <span>${allDone ? '· ✅ 可以生成一页纸了' : '· 答完 3 题就能生成'}</span>
      </div>
      <div class="qpb-track">
        <div class="qpb-fill" style="width:${progressPct}%"></div>
      </div>
    </div>

    <div class="quick-grid">
      <!-- LEFT: questions stack -->
      <div class="quick-questions">
        ${Q.questions.map((q, i) => renderQuickQuestion(q, i, answers)).join("")}

        ${allDone ? `
          <div class="quick-generate">
            <button class="quick-gen-btn" data-action="generate-onepager">
              ✦ ${hasOnePager ? '重新生成' : '生成'} 我项目的 BMAD 一页纸
            </button>
            ${hasOnePager ? `
              <button class="quick-view-btn" data-action="view-onepager">
                📋 查看已生成的一页纸
              </button>
            ` : ''}
            <div class="quick-gen-hint">
              点击会调 AI(MiniMaxi M2.7), 大约 10-30 秒后生成针对你项目的 4 阶段建议
            </div>
          </div>
        ` : `
          <div class="quick-generate disabled">
            <button class="quick-gen-btn" disabled>
              ✦ 答完 ${requiredCount} 题后解锁「生成一页纸」
            </button>
          </div>
        `}
      </div>

      <!-- RIGHT: live preview -->
      <div class="quick-preview-col">
        <div class="quick-preview-sticky">
          <div class="qpv-label">📋 答完你会得到这个</div>
          <div class="qpv-card">
            <div class="qpv-title">🎯 你项目的 BMAD 一页纸</div>
            <div class="qpv-section ${answers.quick_what ? 'filled' : ''}">
              <div class="qpv-section-label">📌 核心</div>
              <div class="qpv-section-text">${answers.quick_what ? truncate(answers.quick_what, 60) : '等你回答第 1 题...'}</div>
            </div>
            <div class="qpv-section ${answers.quick_who ? 'filled' : ''}">
              <div class="qpv-section-label">👥 用户与现状</div>
              <div class="qpv-section-text">${answers.quick_who ? truncate(answers.quick_who, 60) : '等你回答第 2 题...'}</div>
            </div>
            <div class="qpv-section ${answers.quick_why_now ? 'filled' : ''}">
              <div class="qpv-section-label">⏰ 时机 + 不确定</div>
              <div class="qpv-section-text">${answers.quick_why_now ? truncate(answers.quick_why_now, 60) : '等你回答第 3 题...'}</div>
            </div>
            <hr class="qpv-divider">
            <div class="qpv-chain">
              <div class="qpv-chain-label">✦ AI 会针对你项目生成 4 阶段建议</div>
              ${Q.chain.map(c => `
                <div class="qpv-chain-item" data-phase="${c.phaseId}">
                  <span class="qpv-chain-num">${c.phaseNum}</span>
                  <span class="qpv-chain-name">${c.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    ${hasOnePager ? `
      <div class="quick-deepen-section">
        <div class="quick-deepen-title">想要更细的产出吗?(可选)</div>
        <div class="quick-deepen-sub">速通的答案会自动带入。每条路径独立, 按需选 1-4 条。</div>
        <div class="deepen-cards">
          ${Object.values(window.BMAD_DEEPEN).map(d => `
            <div class="deepen-card" data-action="open-deepen" data-deepen-id="${d.id}">
              <div class="deepen-card-num" data-phase="${d.phaseId}">${d.phaseNum}</div>
              <div class="deepen-card-meta">
                <div class="deepen-card-title">${d.title} →</div>
                <div class="deepen-card-desc">${d.desc}</div>
                <div class="deepen-card-time">${d.estTime}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div class="wizard-footer">
      <button class="wizard-nav-clear" data-wizard-clear>🗑 清空所有答案重新开始</button>
    </div>
  `;
}

function renderQuickQuestion(q, idx, answers) {
  const v = answers[q.key] || "";
  const filled = !!(v && v.trim());
  return `
    <div class="quick-q ${filled ? 'filled' : ''}" data-q-key="${q.key}">
      <div class="quick-q-header">
        <span class="quick-q-num ${filled ? 'done' : ''}">${filled ? '✓' : q.num}</span>
        <span class="quick-q-title">${q.title}${q.optional ? ' <em class="quick-q-optional">(可选)</em>' : ''}</span>
      </div>
      <div class="quick-q-hint">${md(q.hint)}</div>
      ${q.multiline
        ? `<textarea data-quick-q="${q.key}" rows="3" placeholder="${escapeAttr(q.placeholder)}">${escapeAttr(v)}</textarea>`
        : `<input type="text" data-quick-q="${q.key}" value="${escapeAttr(v)}" placeholder="${escapeAttr(q.placeholder)}" />`
      }
      <div class="quick-q-footer">
        <button class="quick-case-toggle" data-case-toggle="${q.key}">💡 不知道怎么写? 看周报案例参考</button>
        <button class="quick-ai-help" data-quick-ai="${q.key}">✦ 让 AI 反问引导我</button>
      </div>
      <div class="quick-case-ref" id="case-${q.key}">
        <div class="quick-case-ref-label">📖 周报工具案例的真实答案</div>
        <div class="quick-case-ref-body">${escapeAttr(q.caseRef)}</div>
        <button class="quick-case-fill" data-case-fill="${q.key}">↓ 一键填入这个答案</button>
      </div>
    </div>
  `;
}

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n) + "…" : s;
}

/* ============================================================
 * ONE-PAGER GENERATION + DISPLAY
 * ============================================================ */
const ONEPAGER_KEY = "bmad-onepager-v1";
function loadOnePager() {
  try { return JSON.parse(localStorage.getItem(ONEPAGER_KEY) || "null"); }
  catch { return null; }
}
function saveOnePager(data) {
  if (data) localStorage.setItem(ONEPAGER_KEY, JSON.stringify(data));
  else localStorage.removeItem(ONEPAGER_KEY);
}

let ONEPAGER_GENERATING = false;

async function generateOnePager() {
  if (ONEPAGER_GENERATING) return;
  const Q = window.BMAD_QUICK;
  const answers = loadWizardAnswers();
  const required = Q.questions.filter(q => !q.optional);
  const missing = required.filter(q => !answers[q.key] || !answers[q.key].trim());
  if (missing.length > 0) {
    alert(`还有 ${missing.length} 题没答, 先答完再生成`);
    return;
  }

  ONEPAGER_GENERATING = true;
  // Navigate to onepager view (will show loading state)
  saveOnePager({ generating: true, generated_at: new Date().toISOString() });
  location.hash = "#/wizard/onepager";

  // Build user message
  const userContent = `请基于 BMAD 4 阶段方法论, 为下面这个项目生成一份针对性的执行建议。

**用户的项目情况:**

**1. 要做什么(产品 + 痛点):**
${answers.quick_what}

**2. 给谁用 + 现状:**
${answers.quick_who}

**3. 为什么是现在 + 最大不确定:**
${answers.quick_why_now}

**4. 硬约束:**
${answers.quick_constraints || '(用户没填)'}

请按之前 system prompt 里要求的 JSON schema 输出, 直接出 JSON, 不要 markdown 包装。`;

  try {
    const eff = effectiveConfig();
    const headers = { "Content-Type": "application/json" };
    if (eff && eff.source === "user") {
      headers["X-API-Key"] = eff.apiKey;
      headers["X-Base-URL"] = eff.baseUrl;
      headers["X-Model"] = eff.model;
    }

    const r = await fetch("/api/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: [
          { role: "system", content: Q.onePagerPrompt },
          { role: "user", content: userContent }
        ],
        max_tokens: 3000,
        temperature: 0.6
      })
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      saveOnePager({
        error: true,
        message: err.message || err.error || `HTTP ${r.status}`,
        generated_at: new Date().toISOString()
      });
    } else {
      const j = await r.json();
      const content = (j.content || "").trim();
      // Try to parse JSON (strip code fences if present)
      let parsed = null;
      try {
        const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        parsed = JSON.parse(cleaned);
      } catch (e) {
        // Maybe AI returned with markdown — try to find JSON object
        const m = content.match(/\{[\s\S]*\}/);
        if (m) {
          try { parsed = JSON.parse(m[0]); } catch {}
        }
      }
      if (parsed && parsed.phase1) {
        saveOnePager({
          ...parsed,
          generated_at: new Date().toISOString(),
          raw: content
        });
      } else {
        // Fallback: store raw content as phase1, treat others as same content
        saveOnePager({
          error: true,
          message: "AI 没有返回标准 JSON 格式, 这是原始内容(你可以手动整理)",
          raw: content,
          generated_at: new Date().toISOString()
        });
      }
    }
  } catch (e) {
    saveOnePager({
      error: true,
      message: e.message,
      generated_at: new Date().toISOString()
    });
  }

  ONEPAGER_GENERATING = false;
  renderRoute();  // re-render onepager view
}

function renderWizardOnePager() {
  const op = loadOnePager();
  const answers = loadWizardAnswers();
  const Q = window.BMAD_QUICK;

  if (!op) {
    return `
      <div class="page-eyebrow">📋 一页纸</div>
      <h1 class="page-title">还没生成</h1>
      <div class="page-tagline">先回到速通主页答完 3 题, 再生成一页纸。</div>
      <div class="wizard-nav">
        <button class="wizard-nav-btn primary" data-action="back-to-quick">← 回到速通主页</button>
      </div>
    `;
  }

  if (op.generating) {
    return `
      <div class="page-eyebrow">📋 一页纸</div>
      <h1 class="page-title">AI 正在为你的项目生成 BMAD 建议...</h1>
      <div class="page-tagline">大约 10-30 秒, 别关页面</div>
      <div class="onepager-loading">
        <div class="shimmer-card">
          <div class="shimmer-line w80"></div>
          <div class="shimmer-line w60"></div>
          <div class="shimmer-line w90"></div>
        </div>
        <div class="shimmer-card">
          <div class="shimmer-line w70"></div>
          <div class="shimmer-line w85"></div>
          <div class="shimmer-line w50"></div>
        </div>
        <div class="shimmer-card">
          <div class="shimmer-line w90"></div>
          <div class="shimmer-line w65"></div>
          <div class="shimmer-line w75"></div>
        </div>
        <div class="shimmer-card">
          <div class="shimmer-line w55"></div>
          <div class="shimmer-line w80"></div>
          <div class="shimmer-line w70"></div>
        </div>
      </div>
    `;
  }

  if (op.error) {
    return `
      <div class="page-eyebrow">📋 一页纸 · 出错了</div>
      <h1 class="page-title">AI 生成失败</h1>
      <div class="page-tagline">${escapeAttr(op.message || '未知错误')}</div>
      ${op.raw ? `
        <div class="onepager-raw">
          <div class="onepager-raw-label">AI 返回的原始内容(可能没按 JSON 格式):</div>
          <pre>${escapeAttr(op.raw)}</pre>
        </div>
      ` : ''}
      <div class="wizard-nav">
        <button class="wizard-nav-btn primary" data-action="generate-onepager">↻ 重试生成</button>
        <button class="wizard-nav-btn" data-action="back-to-quick">← 回到速通主页</button>
      </div>
    `;
  }

  // Successfully generated
  const projectName = (answers.quick_what || "").split(/[—\-:。\.]/)[0].trim().slice(0, 40) || "我的项目";
  const fullMd = fillOnePagerTemplate(op, answers, projectName);

  return `
    <div class="page-eyebrow">📋 BMAD 一页纸</div>
    <h1 class="page-title">🎯 ${projectName}</h1>
    <div class="page-tagline">AI 基于你 3-4 个回答 + BMAD 完整方法论, 生成的针对性 4 阶段执行建议</div>

    <div class="onepager-actions">
      <button class="op-action-btn" data-action="copy-onepager" data-md="${escapeAttr(fullMd)}">📋 复制全文</button>
      <button class="op-action-btn primary" data-action="download-onepager" data-name="${escapeAttr(projectName)}">⬇ 下载 .md</button>
      <button class="op-action-btn" data-action="generate-onepager">↻ 重新生成</button>
      <button class="op-action-btn" data-action="back-to-quick">← 改答案</button>
    </div>

    <div class="onepager">
      <div class="op-section op-core">
        <div class="op-section-title">📌 你的项目核心</div>
        <table class="op-core-table">
          <tr><td>产品 + 痛点</td><td>${escapeAttr(answers.quick_what || '')}</td></tr>
          <tr><td>用户 + 现状</td><td>${escapeAttr(answers.quick_who || '')}</td></tr>
          <tr><td>时机 + 不确定</td><td>${escapeAttr(answers.quick_why_now || '')}</td></tr>
          <tr><td>硬约束</td><td>${escapeAttr(answers.quick_constraints || '(未填)')}</td></tr>
        </table>
      </div>

      <div class="op-chain">
        <div class="op-section-title">📋 4 阶段对你来说要做的事</div>
        <div class="op-chain-sub">由 AI 基于完整 BMAD 方法论 + 你的项目情况 生成</div>

        ${Q.chain.map((c, i) => {
          const phaseKey = `phase${i + 1}`;
          const advice = op[phaseKey] || "_(没有内容)_";
          return `
            <div class="op-phase" data-phase="${c.phaseId}">
              <div class="op-phase-header">
                <span class="op-phase-num">${c.phaseNum}</span>
                <div>
                  <div class="op-phase-name">${c.name}</div>
                  <div class="op-phase-tagline">${c.tagline}</div>
                </div>
              </div>
              <div class="op-phase-advice">${md(advice)}</div>
              ${i < Q.chain.length - 1 ? `
                <div class="op-arrow">
                  <span class="op-arrow-line">⬇</span>
                  <span class="op-arrow-text">${c.transmits} → 传递到下一阶段</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      ${op.next_step ? `
        <div class="op-section op-next">
          <div class="op-section-title">🛣 你的下一步</div>
          <div class="op-next-text">${md(op.next_step)}</div>
        </div>
      ` : ''}
    </div>

    <div class="quick-deepen-section">
      <div class="quick-deepen-title">想要更细的产出吗?</div>
      <div class="quick-deepen-sub">这一页是总览。挑一个或多个 phase 深挖, 会产出对应的完整 markdown 文档。</div>
      <div class="deepen-cards">
        ${Object.values(window.BMAD_DEEPEN).map(d => `
          <div class="deepen-card" data-action="open-deepen" data-deepen-id="${d.id}">
            <div class="deepen-card-num" data-phase="${d.phaseId}">${d.phaseNum}</div>
            <div class="deepen-card-meta">
              <div class="deepen-card-title">${d.title} →</div>
              <div class="deepen-card-desc">${d.desc}</div>
              <div class="deepen-card-time">${d.estTime}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function fillOnePagerTemplate(op, answers, projectName) {
  const tpl = window.BMAD_QUICK.onePagerTemplate;
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (k === "project_name") return projectName;
    if (k === "date") return new Date().toLocaleString("zh-CN");
    if (op[k]) return op[k];
    if (answers[k]) return answers[k];
    return `_(未填)_`;
  });
}

/* ============================================================
 * DEEPEN PATHS — 复用对话流 UI
 * ============================================================ */
function renderWizardDeepen(deepenId) {
  const dp = window.BMAD_DEEPEN[deepenId];
  if (!dp) return `<h1>找不到深挖路径: ${deepenId}</h1>`;

  const answers = loadWizardAnswers();
  const totalQs = dp.questions.length;
  let cursor = dp.questions.findIndex(q => !answers[q.key] || !answers[q.key].trim());
  if (cursor === -1) cursor = totalQs;

  const stepDone = (cursor >= totalQs);
  const answeredCount = dp.questions.filter(q => answers[q.key] && answers[q.key].trim()).length;

  // Header
  const pageHeader = `
    <div class="page-eyebrow">🛠 准备工具 · 深挖路径</div>
    <h1 class="page-title">${dp.title}</h1>
    <div class="page-tagline">${dp.desc} · ${dp.estTime}</div>

    <div class="deepen-context-banner">
      <div class="dcb-label">📎 速通答案已自动作为前置上下文</div>
      <div class="dcb-body">
        <div><strong>产品:</strong> ${truncate(answers.quick_what || '(未填)', 80)}</div>
        <div><strong>用户:</strong> ${truncate(answers.quick_who || '(未填)', 80)}</div>
      </div>
    </div>
  `;

  // Step banner
  const stepBanner = `
    <div class="wizard-step-banner">
      <div class="wsb-num" data-phase="${dp.phaseId}">${dp.phaseNum}</div>
      <div class="wsb-meta">
        <h2>${dp.title}</h2>
        <div class="wsb-progress">
          <div class="wsb-progress-text">问题进度: ${answeredCount} / ${totalQs}</div>
          <div class="wsb-progress-bar">
            <div class="wsb-progress-fill" style="width: ${(answeredCount / totalQs) * 100}%"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Conversation
  const messages = [];
  messages.push({
    type: "system",
    kind: "intro",
    text: dp.intro
  });

  for (let i = 0; i < cursor; i++) {
    const q = dp.questions[i];
    messages.push({
      type: "system",
      kind: "question",
      qIdx: i,
      text: q.title,
      hint: q.hint
    });
    messages.push({
      type: "user",
      kind: "answer",
      qIdx: i,
      qKey: q.key,
      text: answers[q.key] || "(已跳过)",
      skipped: !answers[q.key]
    });
    if (i < cursor - 1 || stepDone) {
      messages.push({
        type: "system",
        kind: "ack",
        text: ACK_PHRASES[i % ACK_PHRASES.length]
      });
    }
  }

  let currentQ = null;
  if (!stepDone && cursor < totalQs) {
    currentQ = dp.questions[cursor];
    if (cursor > 0 && messages[messages.length - 1]?.kind !== "ack") {
      messages.push({
        type: "system",
        kind: "ack",
        text: ACK_PHRASES[(cursor - 1) % ACK_PHRASES.length]
      });
    }
    messages.push({
      type: "system",
      kind: "current",
      qIdx: cursor,
      text: `**第 ${cursor + 1} 题 / 共 ${totalQs} 题**\n\n${currentQ.title}`,
      hint: currentQ.hint
    });
  }

  if (stepDone) {
    messages.push({
      type: "system",
      kind: "complete",
      text: `🎉 这条深挖路径全部完成! 下方可下载产出文件。`
    });
  }

  const conversationHtml = messages.map((m, i) => {
    const isLatest = (i === messages.length - 1);
    return renderWizardMessage(m, isLatest, i);
  }).join("");

  let inputArea = "";
  if (currentQ) {
    const inputEl = currentQ.multiline
      ? `<textarea id="wizard-input" rows="3" placeholder="${escapeAttr(currentQ.placeholder || '输入你的答案 · Enter 发送 · Shift+Enter 换行')}"></textarea>`
      : `<input type="text" id="wizard-input" placeholder="${escapeAttr(currentQ.placeholder || '输入你的答案,回车发送')}" />`;
    inputArea = `
      <div class="wizard-input-bar">
        <div class="wizard-input-wrap">
          ${inputEl}
          <button class="wizard-submit-btn" data-deepen-submit="${deepenId}" title="提交并下一题">↑</button>
        </div>
        <div class="wizard-input-tools">
          <button class="wizard-tool-btn" data-deepen-skip="${deepenId}">跳过这题</button>
          <button class="wizard-tool-btn ai" data-deepen-ai="${deepenId}">✦ 让 AI 帮我想这题</button>
          <span class="wizard-input-hint">Enter 发送 · Shift+Enter 换行</span>
        </div>
      </div>
    `;
  } else {
    // Done — show download button
    const projectName = (answers.quick_what || "").split(/[—\-:。\.]/)[0].trim().slice(0, 40) || "my-project";
    const fullMd = fillDeepenTemplate(dp, answers, projectName);
    inputArea = `
      <div class="wizard-step-done-actions">
        <button class="wizard-nav-btn primary big" data-action="download-deepen" data-deepen-id="${deepenId}">
          ⬇ 下载 ${dp.id === 'arch' ? 'architecture.md + project-context.md' : dp.id + '.md'}
        </button>
        <button class="wizard-nav-btn" data-action="copy-deepen" data-deepen-id="${deepenId}">📋 复制全文</button>
        <button class="wizard-nav-btn ghost" data-action="back-to-quick">← 回到速通主页</button>
      </div>
      <div class="deepen-preview">
        <div class="deepen-preview-label">📄 产出预览</div>
        <pre id="deepen-preview-md">${escapeAttr(fullMd)}</pre>
      </div>
    `;
  }

  return `
    ${pageHeader}
    ${stepBanner}
    <div class="wizard-chat" id="wizard-chat">
      ${conversationHtml}
    </div>
    ${inputArea}
    <div class="wizard-footer">
      <button class="wizard-nav-clear" data-wizard-clear>🗑 清空所有答案重新开始</button>
    </div>
  `;
}

function fillDeepenTemplate(dp, answers, projectName) {
  return dp.template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (k === "project_name") return projectName;
    if (k === "date") return new Date().toLocaleString("zh-CN");
    return answers[k] || `_(未填)_`;
  });
}

function deepenSubmit(deepenId) {
  const input = $("#wizard-input");
  if (!input) return;
  const value = input.value.trim();
  if (!value) { input.focus(); return; }
  const dp = window.BMAD_DEEPEN[deepenId];
  if (!dp) return;
  const answers = loadWizardAnswers();
  let cursor = dp.questions.findIndex(q => !answers[q.key] || !answers[q.key].trim());
  if (cursor === -1) return;
  saveWizardAnswer(dp.questions[cursor].key, value);
  renderRoute();
}

function deepenSkip(deepenId) {
  const dp = window.BMAD_DEEPEN[deepenId];
  if (!dp) return;
  const answers = loadWizardAnswers();
  let cursor = dp.questions.findIndex(q => !answers[q.key] || !answers[q.key].trim());
  if (cursor === -1) return;
  saveWizardAnswer(dp.questions[cursor].key, "_(已跳过)_");
  renderRoute();
}

/* Legacy function — kept for old code paths but no longer called via routes */
function renderWizard_legacy(stepIdx) {
  const wz = window.BMAD_WIZARD;
  const totalSteps = wz.steps.length;
  const idx = Math.max(0, Math.min(stepIdx || 0, totalSteps - 1));
  const step = wz.steps[idx];
  const answers = loadWizardAnswers();
  const isExportStep = step.id === `export`;

  // Global progress bar (6 steps)
  const globalProgress = `
    <div class="wizard-progress">
      <div class="wizard-progress-track">
        <div class="wizard-progress-fill" style="width: ${((idx + 1) / totalSteps) * 100}%"></div>
      </div>
      <div class="wizard-progress-steps">
        ${wz.steps.map((s, i) => `
          <button class="wizard-progress-dot ${i === idx ? 'active' : ''} ${i < idx ? 'done' : ''}" data-wizard-step="${i}" title="${s.title}">
            <span class="dot-num">${s.num}</span>
            <span class="dot-label">${s.title}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  // Page header
  const pageHeader = `
    <div class="page-eyebrow">🛠 准备工具 · 第 ${idx + 1} / ${totalSteps} 步</div>
    <h1 class="page-title">${wz.title}</h1>
    ${globalProgress}
  `;

  if (isExportStep) {
    return pageHeader + `
      <div class="wizard-step-banner">
        <div class="wsb-num" ${step.phase ? `data-phase="${step.phase}"` : ''}>${step.num}</div>
        <div class="wsb-meta">
          <h2>${step.title}</h2>
          <div class="wsb-tag">最后一步 · 把你的答案打包成文档</div>
        </div>
      </div>
      <div class="wizard-why">
        <div class="wizard-why-label">💡 为什么这一步</div>
        <div class="wizard-why-body">${md(step.why)}</div>
      </div>
      ${renderWizardExport(answers)}
      <div class="wizard-nav">
        <button class="wizard-nav-btn" data-wizard-go="${idx - 1}">← 上一步</button>
        <button class="wizard-nav-clear" data-wizard-clear>🗑 清空所有答案</button>
        <span></span>
      </div>
    `;
  }

  // Determine cursor: first unanswered question (or last if all answered)
  const totalQs = step.questions.length;
  let cursor = step.questions.findIndex(q => !answers[q.key]);
  if (cursor === -1) cursor = totalQs;  // all answered

  // If user is "editing" this step, they've reset cursor to 0 to redo
  const editing = isEditMode(idx);
  if (editing) cursor = 0;

  const stepDone = (cursor >= totalQs && !editing);

  // In-step progress
  const answeredCount = step.questions.filter(q => answers[q.key]).length;
  const inStepProgress = `
    <div class="wsb-progress">
      <div class="wsb-progress-text">问题进度: ${editing ? 0 : answeredCount} / ${totalQs}</div>
      <div class="wsb-progress-bar">
        <div class="wsb-progress-fill" style="width: ${editing ? 0 : (answeredCount / totalQs) * 100}%"></div>
      </div>
    </div>
  `;

  const stepBanner = `
    <div class="wizard-step-banner">
      <div class="wsb-num" ${step.phase ? `data-phase="${step.phase}"` : ''}>${step.num}</div>
      <div class="wsb-meta">
        <h2>${step.title}</h2>
        ${inStepProgress}
      </div>
    </div>
  `;

  // Build conversation messages
  const messages = [];

  // Step intro (always first, from "why")
  messages.push({
    type: "system",
    kind: "intro",
    text: `**Step ${idx + 1}/${totalSteps} · ${step.title}**\n\n${step.why}`
  });

  // Past Q&A — show all questions before cursor as paired bubbles
  const upTo = stepDone ? totalQs : cursor;
  for (let i = 0; i < upTo; i++) {
    const q = step.questions[i];
    const ans = answers[q.key];
    messages.push({
      type: "system",
      kind: "question",
      qIdx: i,
      text: q.label,
      hint: q.hint
    });
    messages.push({
      type: "user",
      kind: "answer",
      qIdx: i,
      qKey: q.key,
      text: ans || "(已跳过)",
      skipped: !ans
    });
    // Ack after answer (skip ack on last past pair to avoid clutter; show on intermediate)
    if (i < upTo - 1 || stepDone) {
      messages.push({
        type: "system",
        kind: "ack",
        text: ACK_PHRASES[i % ACK_PHRASES.length]
      });
    }
  }

  // Current question (the one waiting for input)
  let currentQ = null;
  if (!stepDone && cursor < totalQs) {
    currentQ = step.questions[cursor];
    // small lead-in if it's not the very first question
    if (cursor > 0 && messages[messages.length - 1]?.kind !== "ack") {
      messages.push({
        type: "system",
        kind: "ack",
        text: ACK_PHRASES[(cursor - 1) % ACK_PHRASES.length]
      });
    }
    messages.push({
      type: "system",
      kind: "current",
      qIdx: cursor,
      text: `**第 ${cursor + 1} 题 / 共 ${totalQs} 题**\n\n${currentQ.label}`,
      hint: currentQ.hint
    });
  }

  // Step complete message (when all answered and not in edit mode)
  if (stepDone) {
    messages.push({
      type: "system",
      kind: "complete",
      text: idx < totalSteps - 1
        ? `🎉 这一步全部完成! 你想:`
        : `🎉 全部 6 步完成! 去看导出页面拿你的文档包。`
    });
  }

  // Render conversation messages
  const conversationHtml = messages.map((m, i) => {
    const isLatest = (i === messages.length - 1);
    return renderWizardMessage(m, isLatest, i);
  }).join("");

  // Input bar OR step-done buttons
  let inputArea = "";
  if (currentQ) {
    const inputEl = currentQ.multiline
      ? `<textarea id="wizard-input" rows="3" placeholder="${escapeAttr(currentQ.placeholder || '输入你的答案 · Enter 发送 · Shift+Enter 换行')}"></textarea>`
      : `<input type="text" id="wizard-input" placeholder="${escapeAttr(currentQ.placeholder || '输入你的答案,回车发送')}" />`;
    inputArea = `
      <div class="wizard-input-bar">
        <div class="wizard-input-wrap">
          ${inputEl}
          <button class="wizard-submit-btn" data-wizard-submit title="提交并下一题">↑</button>
        </div>
        <div class="wizard-input-tools">
          <button class="wizard-tool-btn" data-wizard-skip>跳过这题</button>
          <button class="wizard-tool-btn ai" data-wizard-ai-current>✦ 让 AI 帮我想这题</button>
          <span class="wizard-input-hint">Enter 发送 · Shift+Enter 换行</span>
        </div>
      </div>
    `;
  } else {
    // Step done — action buttons
    inputArea = `
      <div class="wizard-step-done-actions">
        ${idx < totalSteps - 1 ? `
          <button class="wizard-nav-btn primary big" data-wizard-go="${idx + 1}">
            → 进入第 ${idx + 2} 步: ${wz.steps[idx + 1].title}
          </button>
        ` : ''}
        <button class="wizard-nav-btn" data-wizard-edit="${idx}">📝 重新填这一步</button>
        ${idx > 0 ? `<button class="wizard-nav-btn ghost" data-wizard-go="${idx - 1}">← 返回上一步</button>` : ''}
      </div>
    `;
  }

  return `
    ${pageHeader}
    ${stepBanner}
    <div class="wizard-chat" id="wizard-chat">
      ${conversationHtml}
    </div>
    ${inputArea}
    <div class="wizard-footer">
      <button class="wizard-nav-clear" data-wizard-clear>🗑 清空所有向导答案重新开始</button>
    </div>
  `;
}

function renderWizardMessage(m, isLatest, idx) {
  const animClass = isLatest ? "latest" : "";
  if (m.type === "system") {
    if (m.kind === "intro") {
      return `<div class="wmsg system intro ${animClass}">
        <div class="wmsg-avatar">🤖</div>
        <div class="wmsg-bubble"><div class="wmsg-text">${md(m.text)}</div></div>
      </div>`;
    }
    if (m.kind === "question" || m.kind === "current") {
      return `<div class="wmsg system question ${m.kind === 'current' ? 'is-current' : ''} ${animClass}">
        <div class="wmsg-avatar">🤖</div>
        <div class="wmsg-bubble">
          <div class="wmsg-text">${md(m.text)}</div>
          ${m.hint ? `<div class="wmsg-hint">💭 ${m.hint}</div>` : ""}
        </div>
      </div>`;
    }
    if (m.kind === "ack") {
      return `<div class="wmsg system ack ${animClass}">
        <div class="wmsg-ack-text">${m.text}</div>
      </div>`;
    }
    if (m.kind === "complete") {
      return `<div class="wmsg system complete ${animClass}">
        <div class="wmsg-avatar">🎉</div>
        <div class="wmsg-bubble"><div class="wmsg-text">${md(m.text)}</div></div>
      </div>`;
    }
  }
  if (m.type === "user") {
    return `<div class="wmsg user ${m.skipped ? 'skipped' : ''} ${animClass}">
      <div class="wmsg-bubble">
        <div class="wmsg-text">${escapeAttr(m.text)}</div>
        <button class="wmsg-edit-btn" data-wizard-edit-q="${m.qIdx}" title="改这个答案">✎</button>
      </div>
    </div>`;
  }
  return "";
}

// Submit current question's answer
function wizardSubmit() {
  const input = $("#wizard-input");
  if (!input) return;
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }
  // Find current question from current route
  const r = parseRoute();
  if (r.type !== "wizard") return;
  const step = window.BMAD_WIZARD.steps[r.stepIdx];
  if (!step) return;

  // In edit mode, find first un-edited question — but simpler: in non-edit, find first unanswered
  const answers = loadWizardAnswers();
  let cursor = step.questions.findIndex(q => !answers[q.key]);
  if (cursor === -1) {
    // All answered. If in edit mode, find first one (cursor = 0). Otherwise just leave.
    if (isEditMode(r.stepIdx)) cursor = 0;
    else return;
  }
  const q = step.questions[cursor];
  saveWizardAnswer(q.key, value);

  // If we're in edit mode, advance to next unanswered (sequential overwrite)
  if (isEditMode(r.stepIdx)) {
    // After saving, check if there are more questions to edit
    const nextCursor = cursor + 1;
    if (nextCursor >= step.questions.length) {
      setEditMode(r.stepIdx, false);
    }
  }

  // Re-render
  renderRoute();
}

function wizardSkip() {
  const r = parseRoute();
  if (r.type !== "wizard") return;
  const step = window.BMAD_WIZARD.steps[r.stepIdx];
  if (!step) return;
  const answers = loadWizardAnswers();
  let cursor = step.questions.findIndex(q => !answers[q.key]);
  if (cursor === -1) return;
  const q = step.questions[cursor];
  // Use a non-empty marker so findIndex treats it as answered
  saveWizardAnswer(q.key, "_(已跳过)_");
  renderRoute();
}

function renderWizardExport(answers) {
  // Inject date
  const fullAnswers = { ...answers, date: new Date().toLocaleString("zh-CN") };
  const T = window.BMAD_WIZARD_TEMPLATES;

  const fillTemplate = (tpl) => tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return fullAnswers[key] || `_(待填写: ${key})_`;
  });

  const docs = [
    { name: "project-brief.md", content: fillTemplate(T.brief) },
    { name: "prd.md", content: fillTemplate(T.prd) },
    { name: "architecture.md", content: fillTemplate(T.architecture) },
    { name: "project-context.md", content: fillTemplate(T.projectContext) },
    { name: `stories/${(answers.story_key || "1-1-first-story")}.md`, content: fillTemplate(T.story) }
  ];

  const filledCount = Object.keys(answers).filter(k => answers[k]).length;
  const completionMsg = filledCount < 10
    ? `<div class="wizard-warn">⚠️ 你只填了 ${filledCount} 个字段。建议先回前面 5 步把答案填完整,导出的文档质量会高很多。</div>`
    : `<div class="wizard-good">✅ 已填 ${filledCount} 个字段。下面是你的完整 BMAD 文档包。</div>`;

  return `
    ${completionMsg}

    <div class="wizard-export-list">
      ${docs.map((d, i) => `
        <div class="wizard-doc">
          <div class="wizard-doc-head">
            <div class="wizard-doc-name">📄 ${d.name}</div>
            <div class="wizard-doc-actions">
              <button class="wizard-doc-btn" data-wizard-copy="${i}">复制</button>
              <button class="wizard-doc-btn primary" data-wizard-download="${i}" data-wizard-name="${escapeAttr(d.name)}">下载 .md</button>
            </div>
          </div>
          <pre class="wizard-doc-body" id="wz-doc-${i}">${escapeAttr(d.content)}</pre>
        </div>
      `).join("")}
    </div>

    <div class="wizard-bundle">
      <button class="wizard-bundle-btn" data-wizard-download-all>📦 一键下载全部 5 份文档(zip 风格的合并文件)</button>
    </div>
  `;
}

// Wizard interactions — autosave on input for both legacy and quick speedrun fields
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.wq) {
    saveWizardAnswer(t.dataset.wq, t.value);
  }
  if (t.dataset && t.dataset.quickQ) {
    saveWizardAnswer(t.dataset.quickQ, t.value);
    // Live update preview without full re-render — debounced
    schedulePreviewUpdate();
  }
});

let _previewUpdateTimer = null;
function schedulePreviewUpdate() {
  if (_previewUpdateTimer) clearTimeout(_previewUpdateTimer);
  _previewUpdateTimer = setTimeout(() => {
    // Update preview text + progress bar without re-rendering full page (smoother)
    const r = parseRoute();
    if (r.type !== "wizard-home") return;
    const answers = loadWizardAnswers();
    const Q = window.BMAD_QUICK;
    // Update preview sections
    const previewSections = document.querySelectorAll(".qpv-section");
    const keys = ["quick_what", "quick_who", "quick_why_now"];
    previewSections.forEach((sec, i) => {
      if (i >= keys.length) return;
      const k = keys[i];
      const v = answers[k];
      const txt = sec.querySelector(".qpv-section-text");
      if (txt) {
        txt.textContent = v ? truncate(v, 60) : `等你回答第 ${i + 1} 题...`;
      }
      sec.classList.toggle("filled", !!v);
    });
    // Update mark on each quick-q card
    Q.questions.forEach(q => {
      const card = document.querySelector(`.quick-q[data-q-key="${q.key}"]`);
      if (card) {
        const filled = !!(answers[q.key] && answers[q.key].trim());
        card.classList.toggle("filled", filled);
        const numEl = card.querySelector(".quick-q-num");
        if (numEl) {
          numEl.textContent = filled ? "✓" : q.num;
          numEl.classList.toggle("done", filled);
        }
      }
    });
    // Update progress bar
    const required = Q.questions.filter(q => !q.optional);
    const answered = required.filter(q => answers[q.key] && answers[q.key].trim()).length;
    const pct = (answered / required.length) * 100;
    const fill = document.querySelector(".qpb-fill");
    if (fill) fill.style.width = pct + "%";
    const label = document.querySelector(".qpb-label strong");
    if (label) label.textContent = `${answered} / ${required.length}`;
    // Toggle generate button — re-render only if state changed
    const allDone = answered >= required.length;
    const genBtn = document.querySelector(".quick-generate");
    if (genBtn) {
      const wasDone = !genBtn.classList.contains("disabled");
      if (wasDone !== allDone) {
        renderRoute();  // need re-render to flip button state
      }
    }
  }, 250);
}

// Wizard: Enter to submit (Shift+Enter for newline in textarea)
document.addEventListener("keydown", (e) => {
  if (e.target.id === "wizard-input") {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Detect deepen vs legacy by route
      const r = parseRoute();
      if (r.type === "wizard-deepen") {
        deepenSubmit(r.deepenId);
      } else {
        wizardSubmit();  // legacy
      }
    }
  }
});

// Auto-scroll to bottom + auto-focus input after wizard renders (deepen paths)
function focusWizardInput() {
  const input = $("#wizard-input");
  if (input) {
    setTimeout(() => {
      input.focus();
      const latest = $(".wmsg.latest");
      if (latest) latest.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  } else {
    setTimeout(() => {
      const actions = $(".wizard-step-done-actions");
      if (actions) actions.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }
}

document.addEventListener("click", (e) => {
  // ===== NEW SPEEDRUN HOME ACTIONS =====
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action === "generate-onepager") {
    generateOnePager();
    return;
  }
  if (action === "view-onepager") {
    location.hash = "#/wizard/onepager";
    return;
  }
  if (action === "back-to-quick") {
    location.hash = "#/wizard";
    return;
  }
  if (action === "open-deepen") {
    const id = e.target.closest("[data-deepen-id]")?.dataset.deepenId;
    if (id) location.hash = `#/wizard/${id}`;
    return;
  }
  if (action === "copy-onepager") {
    const md = e.target.closest("[data-md]")?.dataset.md || "";
    navigator.clipboard.writeText(md).then(() => {
      const btn = e.target.closest("[data-action]");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = "✓ 已复制";
        setTimeout(() => btn.textContent = orig, 1500);
      }
    });
    return;
  }
  if (action === "download-onepager") {
    const op = loadOnePager();
    const answers = loadWizardAnswers();
    if (!op || op.error || op.generating) {
      alert("一页纸还没生成或有错");
      return;
    }
    const projectName = e.target.closest("[data-name]")?.dataset.name || "my-project";
    const md = fillOnePagerTemplate(op, answers, projectName);
    const safeName = projectName.replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, "_");
    downloadText(`bmad-onepager-${safeName}.md`, md);
    return;
  }
  if (action === "download-deepen") {
    const id = e.target.closest("[data-deepen-id]")?.dataset.deepenId;
    if (!id) return;
    const dp = window.BMAD_DEEPEN[id];
    const answers = loadWizardAnswers();
    const projectName = (answers.quick_what || "").split(/[—\-:。\.]/)[0].trim().slice(0, 40) || "my-project";
    const md = fillDeepenTemplate(dp, answers, projectName);
    const safeName = projectName.replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, "_");
    const filename = id === "arch" ? `architecture-and-context-${safeName}.md` : `${id}-${safeName}.md`;
    downloadText(filename, md);
    return;
  }
  if (action === "copy-deepen") {
    const id = e.target.closest("[data-deepen-id]")?.dataset.deepenId;
    if (!id) return;
    const md = $("#deepen-preview-md")?.textContent || "";
    navigator.clipboard.writeText(md).then(() => {
      const btn = e.target.closest("[data-action]");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = "✓ 已复制";
        setTimeout(() => btn.textContent = orig, 1500);
      }
    });
    return;
  }

  // Case reference toggle
  const caseToggle = e.target.closest("[data-case-toggle]");
  if (caseToggle) {
    const k = caseToggle.dataset.caseToggle;
    const ref = $(`#case-${k}`);
    if (ref) {
      ref.classList.toggle("open");
      caseToggle.textContent = ref.classList.contains("open")
        ? "💡 收起案例参考"
        : "💡 不知道怎么写? 看周报案例参考";
    }
    return;
  }

  // Case fill — auto-fill the input with case answer
  const caseFill = e.target.closest("[data-case-fill]");
  if (caseFill) {
    const k = caseFill.dataset.caseFill;
    const Q = window.BMAD_QUICK.questions.find(q => q.key === k);
    if (!Q) return;
    saveWizardAnswer(k, Q.caseRef);
    renderRoute();
    return;
  }

  // Quick AI help — open chat with current question
  const quickAi = e.target.closest("[data-quick-ai]");
  if (quickAi) {
    const k = quickAi.dataset.quickAi;
    const q = window.BMAD_QUICK.questions.find(qq => qq.key === k);
    if (!q) return;
    const draft = $(`textarea[data-quick-q="${k}"], input[data-quick-q="${k}"]`)?.value.trim() || "";
    openChat();
    sendChatMessage(`我在「准备工具」速通版回答这一题, 请帮我:\n\n**问题:** ${q.title}\n**提示:** ${q.hint}\n\n${draft ? `我目前的草稿:\n"""\n${draft}\n"""\n\n请评估我的回答, 如果不够具体反问我 2-3 个问题帮我想清楚, 然后给一个更符合 BMAD 风格的范例答案。` : '我还不知道怎么答, 请像 Mary (Analyst) 那样反问我 2-3 个引导式问题, 然后给一个范例答案。'}`);
    return;
  }

  // Deepen path interactions
  const deepenSubmitBtn = e.target.closest("[data-deepen-submit]");
  if (deepenSubmitBtn) {
    deepenSubmit(deepenSubmitBtn.dataset.deepenSubmit);
    return;
  }
  const deepenSkipBtn = e.target.closest("[data-deepen-skip]");
  if (deepenSkipBtn) {
    deepenSkip(deepenSkipBtn.dataset.deepenSkip);
    return;
  }
  const deepenAiBtn = e.target.closest("[data-deepen-ai]");
  if (deepenAiBtn) {
    const id = deepenAiBtn.dataset.deepenAi;
    const dp = window.BMAD_DEEPEN[id];
    if (!dp) return;
    const answers = loadWizardAnswers();
    let cursor = dp.questions.findIndex(q => !answers[q.key] || !answers[q.key].trim());
    if (cursor === -1) cursor = 0;
    const q = dp.questions[cursor];
    const draft = $("#wizard-input")?.value.trim() || "";
    openChat();
    sendChatMessage(`我在「准备工具」深挖 ${dp.title} 路径,卡在这一题:\n\n**问题:** ${q.title}\n**提示:** ${q.hint}\n\n${draft ? `当前草稿:\n"""\n${draft}\n"""\n\n请评估并给一个符合 BMAD 风格的范例。` : '请反问我引导式问题然后给范例。'}`);
    return;
  }

  // ===== LEGACY 6-step wizard handlers (kept for backward compat, no longer routed but no harm) =====
  const goBtn = e.target.closest("[data-wizard-go]");
  if (goBtn) {
    setEditMode(parseInt(goBtn.dataset.wizardGo, 10), false);
    location.hash = `#/wizard:${goBtn.dataset.wizardGo}`;
    return;
  }
  const stepBtn = e.target.closest("[data-wizard-step]");
  if (stepBtn) {
    setEditMode(parseInt(stepBtn.dataset.wizardStep, 10), false);
    location.hash = `#/wizard:${stepBtn.dataset.wizardStep}`;
    return;
  }
  if (e.target.closest("[data-wizard-clear]")) {
    if (confirm("清空所有向导答案? 这个操作不可撤销。")) {
      clearWizardAnswers();
      localStorage.removeItem(WIZARD_EDIT_KEY);
      renderRoute();
    }
    return;
  }
  const editStepBtn = e.target.closest("[data-wizard-edit]");
  if (editStepBtn) {
    const sIdx = parseInt(editStepBtn.dataset.wizardEdit, 10);
    if (confirm("重新填写这一步? 之前的答案会被新答案覆盖。")) {
      // Clear all answers in this step
      const step = window.BMAD_WIZARD.steps[sIdx];
      const answers = loadWizardAnswers();
      step.questions.forEach(q => { delete answers[q.key]; });
      localStorage.setItem(WIZARD_KEY, JSON.stringify(answers));
      setEditMode(sIdx, false);  // not strictly needed since cursor will be 0
      renderRoute();
    }
    return;
  }
  const editQBtn = e.target.closest("[data-wizard-edit-q]");
  if (editQBtn) {
    // Allow user to edit a single past answer
    const qIdx = parseInt(editQBtn.dataset.wizardEditQ, 10);
    const r = parseRoute();
    if (r.type !== "wizard") return;
    const step = window.BMAD_WIZARD.steps[r.stepIdx];
    if (!step || !step.questions[qIdx]) return;
    const q = step.questions[qIdx];
    const answers = loadWizardAnswers();
    const newVal = prompt(`改这道题的回答:\n\n${q.label}\n\n${q.hint || ''}`, answers[q.key] || "");
    if (newVal !== null) {
      saveWizardAnswer(q.key, newVal);
      renderRoute();
    }
    return;
  }
  if (e.target.closest("[data-wizard-submit]")) {
    wizardSubmit();
    return;
  }
  if (e.target.closest("[data-wizard-skip]")) {
    wizardSkip();
    return;
  }
  if (e.target.closest("[data-wizard-ai-current]")) {
    // Send current question to AI chat panel
    const r = parseRoute();
    if (r.type !== "wizard") return;
    const step = window.BMAD_WIZARD.steps[r.stepIdx];
    const answers = loadWizardAnswers();
    let cursor = step.questions.findIndex(q => !answers[q.key]);
    if (cursor === -1) cursor = 0;
    const q = step.questions[cursor];
    if (!q) return;
    const draft = $("#wizard-input")?.value.trim() || "";
    openChat();
    sendChatMessage(`我在用「准备工具」向导,卡在这一题想不清楚:\n\n**问题:** ${q.label}\n\n**提示:** ${q.hint || '无'}\n\n${draft ? `我目前的草稿:\n"""\n${draft}\n"""\n\n请帮我:\n1. 评估这个回答\n2. 如果不够具体,反问我 2-3 个问题帮我想清楚\n3. 给一个更符合 BMAD 风格的范例` : `我还没想好怎么答。请反问我 2-3 个引导式问题帮我想清楚,然后给一个范例。`}`);
    return;
  }
  const aiBtn = e.target.closest("[data-wizard-ai]");
  if (aiBtn) {
    const key = aiBtn.dataset.wizardAi;
    const answers = loadWizardAnswers();
    const cur = answers[key] || "";
    openChat();
    sendChatMessage(`帮我优化「准备工具」向导里这一题的回答。\n\n问题字段: ${key}\n我的当前答案:\n"""\n${cur || '(还没填)'}\n"""\n\n请基于 BMAD 方法论给我一个更具体、更可执行、更符合 BMAD 风格的版本。如果我的回答太抽象,请反问我 2-3 个问题帮我想清楚。`);
    return;
  }
  const copyBtn = e.target.closest("[data-wizard-copy]");
  if (copyBtn) {
    const idx = copyBtn.dataset.wizardCopy;
    const text = $(`#wz-doc-${idx}`)?.textContent || "";
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "已复制 ✓";
      setTimeout(() => copyBtn.textContent = "复制", 1500);
    });
    return;
  }
  const dlBtn = e.target.closest("[data-wizard-download]");
  if (dlBtn) {
    const idx = dlBtn.dataset.wizardDownload;
    const text = $(`#wz-doc-${idx}`)?.textContent || "";
    const filename = dlBtn.dataset.wizardName.replace(/\//g, "-");
    downloadText(filename, text);
    return;
  }
  if (e.target.closest("[data-wizard-download-all]")) {
    downloadAllWizardDocs();
    return;
  }
});

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

function downloadAllWizardDocs() {
  const answers = loadWizardAnswers();
  const fullAnswers = { ...answers, date: new Date().toLocaleString("zh-CN") };
  const T = window.BMAD_WIZARD_TEMPLATES;
  const fill = (tpl) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => fullAnswers[k] || `_(待填写: ${k})_`);

  const projectName = (answers.project_name || "my-project").replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, "_");
  const bundle = `# BMAD Bundle for ${projectName}

> 生成时间: ${fullAnswers.date}
> 由 BMAD 准备工具向导导出

本文件包含 5 份独立文档,你可以按 \`# === FILE: xxx ===\` 分隔符拆开,
或者直接把这份 bundle 喂给任何 AI Agent,让它帮你创建对应的文件结构。

---

# === FILE: project-brief.md ===

${fill(T.brief)}

---

# === FILE: prd.md ===

${fill(T.prd)}

---

# === FILE: architecture.md ===

${fill(T.architecture)}

---

# === FILE: project-context.md ===

${fill(T.projectContext)}

---

# === FILE: stories/${answers.story_key || "1-1-first-story"}.md ===

${fill(T.story)}

---

**End of bundle.** 把这份文件放到你项目的 \`_bmad/\` 目录,或者用 BMAD V6 的官方工具导入。
`;
  downloadText(`bmad-bundle-${projectName}.md`, bundle);
}

function askAiCta(headline, prompts) {
  return `
    <div class="ask-ai-cta">
      <div class="ask-ai-cta-text">
        <strong>✦ ${headline}</strong>
        <span>点击下面任一问题,AI 会带着当前页面的上下文回答你</span>
      </div>
      <div class="ask-ai-btns">
        ${prompts.map(p => `<button class="ask-ai-quick" data-prompt="${escapeAttr(p)}">${p}</button>`).join("")}
      </div>
    </div>
  `;
}
function escapeAttr(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* Click-handlers on rendered content (cards / inline buttons) */
document.addEventListener("click", (e) => {
  const card = e.target.closest("#main [data-route]");
  if (card) {
    location.hash = "#/" + card.dataset.route;
    return;
  }
  const ask = e.target.closest("[data-prompt]");
  if (ask) {
    openChat();
    sendChatMessage(ask.dataset.prompt);
  }
});

/* ============================================================
 * AI CHAT + BYO API CONFIG
 * ============================================================ */
let CURRENT_CONTEXT = { type: "intro" };
let CHAT_HISTORY = [];  // {role, content, reasoning?}
let CHAT_SENDING = false;

// Server-side state (read once at startup)
let SERVER_CONFIG = { server_has_key: false, server_model: "", server_base_url: "" };

// User-side BYO config (localStorage)
const USER_CFG_KEY = "bmad-ai-config-v1";
function loadUserConfig() {
  try {
    return JSON.parse(localStorage.getItem(USER_CFG_KEY) || "null");
  } catch { return null; }
}
function saveUserConfig(cfg) {
  if (cfg) localStorage.setItem(USER_CFG_KEY, JSON.stringify(cfg));
  else localStorage.removeItem(USER_CFG_KEY);
}
// Effective config: user overrides server. If neither, AI is unavailable.
function effectiveConfig() {
  const u = loadUserConfig();
  if (u && u.apiKey) return { source: "user", ...u };
  if (SERVER_CONFIG.server_has_key) {
    return {
      source: "server",
      providerId: "server",
      providerName: "Server (.env)",
      baseUrl: SERVER_CONFIG.server_base_url,
      apiKey: "(server-side)",
      model: SERVER_CONFIG.server_model
    };
  }
  return null;
}

async function checkConfig() {
  try {
    const r = await fetch("/api/config");
    if (!r.ok) throw new Error();
    SERVER_CONFIG = await r.json();
  } catch {
    SERVER_CONFIG = { server_has_key: false, server_model: "", server_base_url: "" };
  }
  updateChatStatus();
}

function updateChatStatus() {
  const eff = effectiveConfig();
  const dot = $("#chat-status-dot");
  const txt = $("#chat-status-text");
  if (eff) {
    dot.classList.remove("offline");
    if (eff.source === "user") {
      txt.textContent = `已连接 · ${eff.providerName} · ${eff.model}`;
    } else {
      txt.textContent = `已连接 · server · ${eff.model}`;
    }
  } else {
    dot.classList.add("offline");
    txt.textContent = "未配置 API · 点齿轮配置";
  }
}

function openChat() {
  $(".app").classList.add("chat-open");
  // First-time experience: if no API config at all, auto-open settings
  if (!effectiveConfig()) {
    openSettings();
  } else {
    closeSettings();
    setTimeout(() => $("#chat-input")?.focus(), 50);
  }
}
function closeChat() {
  $(".app").classList.remove("chat-open");
}

/* ----- SETTINGS VIEW (BYO config wizard) ----- */
let SETTINGS_OPEN = false;
let SETTINGS_SELECTED_PROVIDER = null;
let SETTINGS_TEST_STATE = "";  // "" | "testing" | "ok" | "fail:msg"

function openSettings() {
  SETTINGS_OPEN = true;
  // Pre-select existing provider if any
  const u = loadUserConfig();
  if (u && u.providerId) SETTINGS_SELECTED_PROVIDER = u.providerId;
  if (!SETTINGS_SELECTED_PROVIDER) SETTINGS_SELECTED_PROVIDER = window.AI_PROVIDERS[0].id;
  $(".app").classList.add("chat-open");
  renderSettings();
}
function closeSettings() {
  SETTINGS_OPEN = false;
  SETTINGS_TEST_STATE = "";
  $("#settings-view")?.classList.remove("open");
}

function renderSettings() {
  const view = $("#settings-view");
  if (!view) return;
  view.classList.add("open");

  const u = loadUserConfig() || {};
  const providers = window.AI_PROVIDERS;
  const selected = providers.find(p => p.id === SETTINGS_SELECTED_PROVIDER) || providers[0];

  view.innerHTML = `
    <div class="settings-header">
      <div class="settings-title-wrap">
        <h3>⚙️ 配置 AI 模型</h3>
        <div class="settings-sub">本站支持任何 OpenAI 兼容的 API。配置一次,Key 只存在你的浏览器里(localStorage),不会上传任何地方。</div>
      </div>
      <button class="chat-icon-btn" data-action="settings-close" title="关闭">✕</button>
    </div>

    ${SERVER_CONFIG.server_has_key ? `
      <div class="settings-server-banner">
        ✓ Server 已配置 .env (model: <code>${SERVER_CONFIG.server_model}</code>) · 你可以直接用,也可以下面填自己的覆盖
      </div>
    ` : `
      <div class="settings-no-server-banner">
        ⚠️ Server 没配置 .env Key · 必须在下面填一个才能用 AI
      </div>
    `}

    <div class="settings-section">
      <div class="settings-section-label">第一步 · 选择你的模型厂商</div>
      <div class="provider-grid">
        ${providers.map(p => `
          <button class="provider-card ${p.id === SETTINGS_SELECTED_PROVIDER ? 'active' : ''}" data-provider="${p.id}">
            <div class="provider-flag">${p.flag}</div>
            <div class="provider-name">${p.name}</div>
            <div class="provider-desc">${p.desc}</div>
          </button>
        `).join("")}
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-label">第二步 · 怎么获取 ${selected.name} 的 API Key?</div>
      <div class="key-guide">
        ${selected.steps.map((s, i) => `<div class="key-step"><span class="key-step-num">${i + 1}</span><span class="key-step-text">${s}</span></div>`).join("")}
        ${selected.apiKeyUrl ? `<a class="key-direct-link" href="${selected.apiKeyUrl}" target="_blank">🔗 直接打开 API Key 创建页面</a>` : ""}
        ${selected.notes ? `<div class="key-notes">💡 ${selected.notes}</div>` : ""}
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-label">第三步 · 把信息粘贴到这里</div>
      <div class="settings-form">
        <div class="settings-field">
          <label>API Base URL</label>
          <input type="text" id="cfg-baseurl" value="${escapeAttr(u.providerId === selected.id && u.baseUrl || selected.baseUrl)}" placeholder="${selected.baseUrl || 'https://...'}" />
          <div class="settings-hint">已自动填入 ${selected.name} 的官方 URL,通常不用改</div>
        </div>
        <div class="settings-field">
          <label>API Key</label>
          <input type="password" id="cfg-apikey" value="${escapeAttr(u.providerId === selected.id ? (u.apiKey || '') : '')}" placeholder="${selected.keyPrefix || 'sk-...'} 开头的字符串" autocomplete="off" />
          <div class="settings-hint">⚠️ 仅存在你的浏览器 localStorage,关闭浏览器也不会丢,但不会上传到任何服务器</div>
        </div>
        <div class="settings-field">
          <label>Model 模型名</label>
          <input type="text" id="cfg-model" value="${escapeAttr(u.providerId === selected.id && u.model || selected.defaultModel)}" placeholder="${selected.defaultModel}" list="model-list" />
          <datalist id="model-list">
            ${selected.models.map(m => `<option value="${m}">`).join("")}
          </datalist>
          <div class="settings-hint">${selected.models.length > 0 ? `推荐: ${selected.models.join(' / ')}` : '填该服务支持的任意模型名'}</div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-actions">
        <button class="btn-test" data-action="settings-test">🔌 测试连接</button>
        <button class="btn-save" data-action="settings-save">💾 保存并开始聊天</button>
        ${u.apiKey ? `<button class="btn-clear" data-action="settings-clear">🗑 清除我的配置</button>` : ""}
      </div>
      ${SETTINGS_TEST_STATE ? `
        <div class="settings-test-result ${SETTINGS_TEST_STATE.startsWith('fail') ? 'fail' : SETTINGS_TEST_STATE === 'ok' ? 'ok' : 'pending'}">
          ${SETTINGS_TEST_STATE === 'testing' ? '⏳ 正在测试,稍等…' : ''}
          ${SETTINGS_TEST_STATE === 'ok' ? '✅ 连接成功!模型可用,你可以保存了。' : ''}
          ${SETTINGS_TEST_STATE.startsWith('fail') ? '❌ 测试失败: ' + SETTINGS_TEST_STATE.slice(5) : ''}
        </div>
      ` : ""}
    </div>
  `;
}

async function settingsTest() {
  const baseUrl = $("#cfg-baseurl").value.trim();
  const apiKey = $("#cfg-apikey").value.trim();
  const model = $("#cfg-model").value.trim();
  if (!baseUrl || !apiKey || !model) {
    SETTINGS_TEST_STATE = "fail:请把 Base URL、API Key、Model 都填上";
    renderSettings();
    return;
  }
  SETTINGS_TEST_STATE = "testing";
  renderSettings();

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        "X-Base-URL": baseUrl,
        "X-Model": model
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "ping — 用一个字回我" }
        ],
        max_tokens: 64
      })
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      SETTINGS_TEST_STATE = `fail:${j.message || j.error || r.statusText} ${j.detail ? '· ' + j.detail.slice(0, 200) : ''}`;
    } else {
      const j = await r.json();
      if (j.content || j.reasoning) {
        SETTINGS_TEST_STATE = "ok";
      } else {
        SETTINGS_TEST_STATE = "fail:连通了但模型没返回内容,可能 model 名写错了";
      }
    }
  } catch (e) {
    SETTINGS_TEST_STATE = "fail:" + e.message;
  }
  renderSettings();
}

function settingsSave() {
  const baseUrl = $("#cfg-baseurl").value.trim();
  const apiKey = $("#cfg-apikey").value.trim();
  const model = $("#cfg-model").value.trim();
  const provider = window.AI_PROVIDERS.find(p => p.id === SETTINGS_SELECTED_PROVIDER);
  if (!baseUrl || !apiKey || !model) {
    alert("Base URL / API Key / Model 都不能为空");
    return;
  }
  saveUserConfig({
    providerId: provider.id,
    providerName: provider.name,
    baseUrl, apiKey, model
  });
  closeSettings();
  updateChatStatus();
  renderChatMessages();
  setTimeout(() => $("#chat-input")?.focus(), 80);
}

function settingsClear() {
  if (!confirm("清除你保存的 API 配置? 之后需要重新填。")) return;
  saveUserConfig(null);
  SETTINGS_TEST_STATE = "";
  renderSettings();
  updateChatStatus();
}

function updateChatContextBar() {
  const bar = $("#chat-context-bar");
  if (!bar) return;
  if (CURRENT_CONTEXT && CURRENT_CONTEXT.title) {
    bar.innerHTML = `📍 当前上下文 · <strong>${CURRENT_CONTEXT.title}</strong>`;
  } else {
    bar.textContent = "📍 没有锚定的上下文";
  }
}

function renderChatMessages() {
  const wrap = $("#chat-messages");
  if (CHAT_HISTORY.length === 0) {
    wrap.innerHTML = `
      <div class="chat-empty">
        <div class="icon">✦</div>
        <h4>BMAD AI 助手</h4>
        <p>我熟读了 BMAD 全流程。你可以问方法论问题,或者描述你的项目情况让我给适配建议。我也会主动反问帮你想清楚。</p>
        <div class="chat-suggestions">
          <button class="chat-suggestion" data-quick="我是一个 AI 产品经理,刚接触 BMAD,该从哪一步开始上手?">我刚接触 BMAD,从哪开始?</button>
          <button class="chat-suggestion" data-quick="我的项目是一个小型 SaaS 工具,只有 2 人团队,完整跑 4 阶段会不会太重?">2 人小团队跑完整 4 阶段会太重吗?</button>
          <button class="chat-suggestion" data-quick="我已经有 PRD 了,现在卡在不知道怎么把它变成可执行的 Story,BMAD 能怎么帮我?">已有 PRD,怎么变成可执行 Story?</button>
        </div>
      </div>
    `;
    return;
  }
  wrap.innerHTML = CHAT_HISTORY.map((m, i) => {
    if (m.role === "user") {
      return `<div class="chat-msg user">${md(m.content)}</div>`;
    }
    if (m.error) {
      return `<div class="chat-msg assistant error">${md(m.content)}</div>`;
    }
    if (m.thinking) {
      return `<div class="chat-msg assistant thinking">${m.content}</div>`;
    }
    let html = `<div class="chat-msg assistant">${md(m.content)}`;
    if (m.reasoning) {
      html += `<div class="reasoning-toggle" data-toggle-reasoning="${i}">▸ 思考过程</div>`;
      html += `<div class="reasoning-content" data-reasoning="${i}">${escapeAttr(m.reasoning)}</div>`;
    }
    html += `</div>`;
    return html;
  }).join("");
  wrap.scrollTop = wrap.scrollHeight;
}

async function sendChatMessage(text) {
  text = (text || "").trim();
  if (!text || CHAT_SENDING) return;

  CHAT_HISTORY.push({ role: "user", content: text });
  CHAT_HISTORY.push({ role: "assistant", content: "正在思考…", thinking: true });
  renderChatMessages();
  CHAT_SENDING = true;
  $("#chat-send").disabled = true;
  $("#chat-input").value = "";
  $("#chat-input").style.height = "auto";

  // Build context-aware system prompt
  const contextLine = CURRENT_CONTEXT?.title
    ? `\n\n用户当前正在查看页面: 「${CURRENT_CONTEXT.title}」\n该页面内容摘要:\n${(CURRENT_CONTEXT.body || "").slice(0, 1500)}`
    : "";

  const messages = [
    { role: "system", content: SYSTEM_PROMPT + contextLine },
    ...CHAT_HISTORY
      .filter(m => !m.thinking && !m.error)
      .map(m => ({ role: m.role, content: m.content }))
  ];

  // BYO config: send overrides via headers if user has them configured
  const eff = effectiveConfig();
  const headers = { "Content-Type": "application/json" };
  if (eff && eff.source === "user") {
    headers["X-API-Key"] = eff.apiKey;
    headers["X-Base-URL"] = eff.baseUrl;
    headers["X-Model"] = eff.model;
  }

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({ messages, max_tokens: 4096 })
    });

    // remove the "thinking" placeholder
    CHAT_HISTORY = CHAT_HISTORY.filter(m => !m.thinking);

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      CHAT_HISTORY.push({
        role: "assistant",
        error: true,
        content: `**❌ 出错了:** ${err.error || r.statusText}\n\n${err.detail ? "```\n" + err.detail.slice(0, 500) + "\n```" : ""}`
      });
    } else {
      const j = await r.json();
      CHAT_HISTORY.push({
        role: "assistant",
        content: j.content || "(模型未返回内容)",
        reasoning: j.reasoning || ""
      });
    }
  } catch (e) {
    CHAT_HISTORY = CHAT_HISTORY.filter(m => !m.thinking);
    CHAT_HISTORY.push({
      role: "assistant",
      error: true,
      content: `**❌ 网络错误:** ${e.message}\n\n请确认 \`python3 server.py\` 已经运行。`
    });
  }

  CHAT_SENDING = false;
  $("#chat-send").disabled = false;
  renderChatMessages();
}

function bindChat() {
  $("#chat-toggle").addEventListener("click", openChat);
  $("#chat-close").addEventListener("click", closeChat);
  $("#chat-settings").addEventListener("click", openSettings);
  $("#chat-clear").addEventListener("click", () => {
    if (CHAT_HISTORY.length && !confirm("清空当前对话?")) return;
    CHAT_HISTORY = [];
    renderChatMessages();
  });

  // Settings view event delegation
  $("#settings-view").addEventListener("click", (e) => {
    const card = e.target.closest("[data-provider]");
    if (card) {
      SETTINGS_SELECTED_PROVIDER = card.dataset.provider;
      SETTINGS_TEST_STATE = "";
      renderSettings();
      return;
    }
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "settings-close") closeSettings();
    if (action === "settings-test") settingsTest();
    if (action === "settings-save") settingsSave();
    if (action === "settings-clear") settingsClear();
  });

  const input = $("#chat-input");
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(input.value);
    }
  });
  $("#chat-send").addEventListener("click", () => sendChatMessage(input.value));

  $("#chat-messages").addEventListener("click", (e) => {
    const t = e.target.closest("[data-toggle-reasoning]");
    if (t) {
      const i = t.dataset.toggleReasoning;
      $(`[data-reasoning="${i}"]`)?.classList.toggle("open");
      return;
    }
    const q = e.target.closest("[data-quick]");
    if (q) sendChatMessage(q.dataset.quick);
  });
}

/* ============================================================
 * INIT
 * ============================================================ */
function init() {
  renderSidebar();
  bindChat();
  renderChatMessages();
  checkConfig();

  window.addEventListener("hashchange", renderRoute);
  if (!location.hash) location.hash = "#/intro";
  else renderRoute();
}

document.addEventListener("DOMContentLoaded", init);
