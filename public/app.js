const state = {
  dashboard: null,
  orders: [],
  alerts: [],
  session: null,
};

const $ = (selector) => document.querySelector(selector);
const defaultRemoteApiBase = "https://yunlv-wuyou-mvp.onrender.com";

function apiBase() {
  const explicit = window.YUNLV_API_BASE || window.localStorage?.getItem?.("YUNLV_API_BASE") || "";
  if (explicit) return explicit.replace(/\/$/, "");
  return window.location.hostname.endsWith("github.io") ? defaultRemoteApiBase : "";
}

function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const base = apiBase();
  return base ? `${base}${path.startsWith("/") ? path : `/${path}`}` : path;
}

function iconRefresh() {
  if (window.lucide) window.lucide.createIcons();
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.session?.token) headers.Authorization = `Bearer ${state.session.token}`;
  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });
  const payload = await response.json();
  if (!payload.success) throw new Error(payload.error?.message || "接口调用失败");
  return payload.data;
}

async function loginAdmin() {
  if (state.session?.token) return state.session;
  const response = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "admin" }),
  });
  const payload = await response.json();
  if (!payload.success) throw new Error(payload.error?.message || "登录失败");
  state.session = payload.data;
  return state.session;
}

function money(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN")}`;
}

function statusClass(status) {
  if (["待派单", "已派单", "待确认", "待处理", "处理中"].includes(status)) return "pending";
  if (["服务中", "已接单", "待服务"].includes(status)) return "active";
  if (["已完成", "已处理"].includes(status)) return "done";
  return "alert";
}

function logEvent(text) {
  const list = $("#eventLog");
  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}  ${text}`;
  list.prepend(item);
  while (list.children.length > 8) list.lastElementChild.remove();
}

function renderMetrics() {
  const stats = state.dashboard?.stats || {};
  const metrics = [
    ["老人总数", stats.elderCount || 0],
    ["在线设备", stats.onlineDevices || 0],
    ["待处理订单", stats.pendingOrders || 0],
    ["执行中任务", stats.activeTasks || 0],
    ["异常预警", stats.openAlerts || 0],
    ["今日流水", money(stats.todayRevenue || 0)],
  ];
  $("#metricGrid").innerHTML = metrics
    .map(([label, value]) => `<article class="metric-card"><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderOrders() {
  $("#orderRows").innerHTML = state.orders
    .slice(0, 8)
    .map(
      (order) => `
        <tr>
          <td>${order.orderNo}</td>
          <td>${order.serviceType}</td>
          <td>${order.assigneeName || "待分配"}</td>
          <td><span class="status ${statusClass(order.status)}">${order.status}</span></td>
          <td>${money(order.amount)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderAlerts() {
  $("#alertList").innerHTML = state.alerts
    .slice(0, 6)
    .map(
      (alert) => `
        <article class="alert-item">
          <strong>${alert.type}<span class="status ${statusClass(alert.status)}">${alert.status}</span></strong>
          <p>${alert.elderName} · ${alert.level}优先级 · ${alert.location}</p>
          <p>${alert.description}</p>
        </article>
      `,
    )
    .join("");
}

async function loadAll(silent = false) {
  await loginAdmin();
  const [health, dashboard, orders, alerts] = await Promise.all([
    api("/api/health"),
    api("/api/admin/dashboard"),
    api("/api/orders"),
    api("/api/alerts"),
  ]);
  state.dashboard = dashboard;
  state.orders = orders;
  state.alerts = alerts;
  $("#serviceStatus").textContent = health.status === "ok" ? "运行中" : "异常";
  renderMetrics();
  renderOrders();
  renderAlerts();
  iconRefresh();
  if (!silent) logEvent("数据已刷新");
}

function firstOrder(statuses) {
  return state.orders.find((order) => statuses.includes(order.status));
}

async function runAction(action) {
  if (action === "createOrder") {
    const order = await api("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        serviceType: "陪伴就医",
        providerType: "guide",
        amount: 120,
        time: "2026-06-02 09:30",
        location: "昆明市第一人民医院",
        note: "复查预约，需要协助挂号、缴费和取药。",
      }),
    });
    logEvent(`用户端创建订单 ${order.orderNo}`);
  }

  if (action === "dispatchOrder") {
    const order = firstOrder(["待派单"]);
    if (!order) throw new Error("没有待派单订单");
    const result = await api("/api/tasks/dispatch", {
      method: "POST",
      body: JSON.stringify({ orderId: order.id, assigneeType: order.providerType || "guide" }),
    });
    logEvent(`后台将 ${result.order.orderNo} 派给 ${result.task.assigneeName}`);
  }

  if (action === "acceptTask") {
    const tasks = await api("/api/tasks");
    const task = tasks.find((item) => item.status === "待接单");
    if (!task) throw new Error("没有待接单任务");
    const result = await api(`/api/tasks/${task.id}/accept`, { method: "POST", body: "{}" });
    logEvent(`${result.task.assigneeName} 已接单`);
  }

  if (action === "startTask") {
    const tasks = await api("/api/tasks");
    const task = tasks.find((item) => item.status === "已接单");
    if (!task) throw new Error("没有已接单任务");
    const result = await api(`/api/tasks/${task.id}/start`, { method: "POST", body: "{}" });
    logEvent(`${result.task.assigneeName} 开始服务`);
  }

  if (action === "completeTask") {
    const tasks = await api("/api/tasks");
    const task = tasks.find((item) => item.status === "服务中");
    if (!task) throw new Error("没有服务中任务");
    const result = await api(`/api/tasks/${task.id}/complete`, { method: "POST", body: "{}" });
    logEvent(`${result.task.assigneeName} 提交完成，等待用户确认`);
  }

  if (action === "confirmOrder") {
    const order = firstOrder(["待确认"]);
    if (!order) throw new Error("没有待确认订单");
    const result = await api(`/api/orders/${order.id}/confirm`, {
      method: "POST",
      body: JSON.stringify({ rating: 5, review: "服务及时细致，已确认完成。" }),
    });
    logEvent(`用户确认 ${result.orderNo} 已完成`);
  }

  if (action === "triggerSos") {
    const alert = await api("/api/alerts/sos", {
      method: "POST",
      body: JSON.stringify({
        location: "昆明市五华区翠湖康养公寓",
        description: "用户端一键 SOS 演示触发，后台需要立即处理。",
      }),
    });
    logEvent(`生成高优先级异常 ${alert.id}`);
  }

  await loadAll(true);
}

document.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  actionButton.disabled = true;
  try {
    await runAction(actionButton.dataset.action);
  } catch (error) {
    logEvent(error.message);
  } finally {
    actionButton.disabled = false;
  }
});

$("#refreshData").addEventListener("click", () => loadAll());

$("#aiForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = $("#aiQuestion").value.trim();
  if (!question) return;
  $("#aiAnswer").textContent = "生成中...";
  try {
    const chat = await api("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    $("#aiAnswer").textContent = chat.answer;
    logEvent(`AI 管家回答：${chat.intent}`);
  } catch (error) {
    $("#aiAnswer").textContent = error.message;
  }
});

loadAll(true)
  .then(async () => {
    const history = await api("/api/ai/history");
    $("#aiAnswer").textContent = history[0]?.answer || "请输入问题。";
    logEvent("MVP 工作台已就绪");
    iconRefresh();
  })
  .catch((error) => {
    $("#serviceStatus").textContent = "异常";
    logEvent(error.message);
  });
