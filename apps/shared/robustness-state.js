(function () {
  const params = new URLSearchParams(window.location.search || "");
  const mode = params.get("state") || params.get("ui-state") || params.get("scenario") || "";
  const state = ["empty", "error"].includes(mode) ? mode : "";
  if (!state) return;
  let dismissed = false;

  const roleMap = [
    ["/user/", "用户端"],
    ["/guide/", "向导端"],
    ["/merchant/", "商户端"],
    ["/admin/", "管理后台"],
  ];
  const roleName = roleMap.find(([prefix]) => window.location.pathname.startsWith(prefix))?.[1] || "当前应用";

  const copy = {
    empty: {
      title: "空状态预览",
      heading: "暂无可展示数据",
      body: `${roleName}当前列表为空，页面应保留结构、解释原因，并提供刷新或返回主流程入口。`,
      detail: "适用于订单为空、消息为空、筛选无结果、暂无待处理业务等情况。",
      action: "重新加载",
      tone: "empty",
      role: "status",
    },
    error: {
      title: "错误状态预览",
      heading: "数据加载失败",
      body: `${roleName}接口暂不可用或网络异常时，页面应明确提示失败原因，并提供重试入口。`,
      detail: "适用于接口超时、权限失效、服务端错误、网络中断等情况。",
      action: "重试",
      tone: "error",
      role: "alert",
    },
  }[state];

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function ensureStyles() {
    if (document.querySelector("[data-robustness-state-style]")) return;
    const style = document.createElement("style");
    style.dataset.robustnessStateStyle = "true";
    style.textContent = `
      .robustness-state-card{position:relative;z-index:30;margin:12px;border:1px solid #d7e3f5;border-radius:8px;background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.08);padding:14px;color:#172033;font-family:inherit}
      .robustness-state-card[data-state="error"]{border-color:#ffd0d0;background:#fffafa}
      .robustness-state-card header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
      .robustness-state-card header span{font-size:12px;font-weight:800;color:#2f6feb;background:#eef5ff;border-radius:999px;padding:4px 9px}
      .robustness-state-card[data-state="error"] header span{color:#c2410c;background:#fff1e8}
      .robustness-state-card h2{margin:0 0 6px;font-size:18px;line-height:1.25;color:#111827}
      .robustness-state-card p{margin:0 0 8px;font-size:13px;line-height:1.55;color:#5f6b7a}
      .robustness-state-card .robustness-state-detail{display:block;margin:8px 0 12px;padding:9px 10px;border-radius:8px;background:#f6f9fd;color:#667085;font-size:12px;line-height:1.45}
      .robustness-state-card .robustness-state-actions{display:flex;gap:8px;flex-wrap:wrap}
      .robustness-state-card button{border:0;border-radius:8px;min-height:34px;padding:0 12px;font-size:13px;font-weight:800;cursor:pointer}
      .robustness-state-card [data-robustness-retry]{background:#176bff;color:#fff}
      .robustness-state-card [data-robustness-close]{background:#eef2f7;color:#475467}
      .robustness-state-card[data-state="error"] [data-robustness-retry]{background:#e23b2f;color:#fff}
    `;
    document.head.appendChild(style);
  }

  function mountTarget() {
    return document.querySelector("#app .content")
      || document.querySelector("#phone .screen-scroll")
      || document.querySelector("#phone .phone-content")
      || document.querySelector("#phone .phone-content.with-tabbar")
      || document.querySelector("#phone")
      || document.querySelector("#app")
      || document.body;
  }

  function applyPreview() {
    if (dismissed) return;
    ensureStyles();
    document.documentElement.dataset.robustnessState = state;
    if (document.querySelector("[data-robustness-preview]")) return;
    const node = document.createElement("section");
    node.className = `robustness-state-card robustness-state-${copy.tone}`;
    node.dataset.robustnessPreview = state;
    node.dataset.state = state;
    node.setAttribute("role", copy.role);
    node.innerHTML = `
      <header>
        <span>${escapeHtml(copy.title)}</span>
        <button type="button" data-robustness-close>关闭预览</button>
      </header>
      <h2>${escapeHtml(copy.heading)}</h2>
      <p>${escapeHtml(copy.body)}</p>
      <small class="robustness-state-detail">${escapeHtml(copy.detail)}</small>
      <div class="robustness-state-actions">
        <button type="button" data-robustness-retry>${escapeHtml(copy.action)}</button>
      </div>
    `;
    const target = mountTarget();
    target.insertAdjacentElement(target === document.body ? "afterbegin" : "afterbegin", node);
  }

  document.addEventListener("click", (event) => {
    const close = event.target.closest("[data-robustness-close]");
    if (close) {
      event.preventDefault();
      dismissed = true;
      close.closest("[data-robustness-preview]")?.remove();
      return;
    }
    const retry = event.target.closest("[data-robustness-retry]");
    if (retry) {
      event.preventDefault();
      window.location.reload();
    }
  });

  const schedule = () => window.setTimeout(applyPreview, 0);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener("hashchange", schedule);
  new MutationObserver(() => {
    if (!document.querySelector("[data-robustness-preview]")) schedule();
  }).observe(document.documentElement, { childList: true, subtree: true });
}());
