export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function money(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN")}`;
}

export function statusTone(status = "") {
  if (["待派单", "已派单", "待接单", "待服务", "待确认", "待处理", "处理中", "已报价"].includes(status)) return "tone-warn";
  if (["服务中", "已接单", "在线", "上架", "报名中"].includes(status)) return "tone-active";
  if (["已完成", "已处理", "已通过", "已认证", "正常"].includes(status)) return "tone-done";
  if (["已取消", "离线", "驳回", "异常"].includes(status)) return "tone-alert";
  return "tone-muted";
}

export function badge(status) {
  return `<span class="badge ${statusTone(status)}">${escapeHtml(status || "未知")}</span>`;
}

export function metric(label, value, icon = "activity") {
  return `
    <article class="metric">
      <i data-lucide="${icon}"></i>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

export function emptyState(text) {
  return `<div class="empty"><i data-lucide="inbox"></i><span>${escapeHtml(text)}</span></div>`;
}

export function statusBar() {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return `
    <div class="statusbar role-statusbar" aria-label="系统状态栏预览">
      <span class="status-time">${time}</span>
      <span class="status-icons">
        <span class="signal bars-4 is-hidden" aria-label="网络在线"><i></i><i></i><i></i><i></i></span>
        <span class="wifi" aria-label="Wi-Fi 已连接"><i></i><i></i><i></i></span>
        <span class="battery" aria-label="电池状态" style="--battery-level: 1"></span>
      </span>
    </div>
  `;
}

export function icons() {
  if (window.lucide) window.lucide.createIcons();
}

export function notify(message, tone = "info") {
  let node = $("[data-toast]");
  if (!node) {
    node = document.createElement("div");
    node.dataset.toast = "";
    node.className = "toast";
    document.body.appendChild(node);
  }
  node.className = `toast show ${tone}`;
  node.textContent = message;
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => node.classList.remove("show"), 2600);
}

export function bindBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
  button.classList.toggle("is-busy", busy);
}

export function formatTime(value) {
  if (!value) return "";
  return String(value).replace("2026-", "").replace(/\s/, " ");
}

export function progress(done, total) {
  const percent = total > 0 ? Math.min(100, Math.round((Number(done || 0) / Number(total)) * 100)) : 0;
  return `
    <div class="progress" aria-label="${percent}%">
      <span style="width:${percent}%"></span>
    </div>
  `;
}
