import { api } from "/shared/api.js?v=20260601-auth";
import { $, badge, bindBusy, emptyState, escapeHtml, formatTime, icons, metric, money, notify, statusBar } from "/shared/ui.js?v=20260608-statusbar";

const state = {
  dashboard: null,
  tab: "tasks",
};

const AMAP_KEY = "ed0e2af40e4b73e90525252ff8fd52a8";
const DEFAULT_GUIDE_CITY = "昆明市";

function guideUrlLeavesEndpoint(rawUrl) {
  const href = String(rawUrl || "").trim();
  if (!href || href.startsWith("#")) return false;
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch (error) {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  return url.pathname === "/" || /^\/(?:user|merchant|admin)(?:\/|$)/.test(url.pathname);
}

function guardGuideEndpointClick(event) {
  const target = event.target?.closest?.("a[href], [data-href]");
  if (!target) return false;
  const href = target.getAttribute("href") || target.dataset.href || "";
  if (!guideUrlLeavesEndpoint(href)) return false;
  event.preventDefault();
  event.stopPropagation();
  event.guideEndpointBlocked = true;
  notify("已拦截跨端跳转，当前仍在向导端", "error");
  return true;
}

const taskActions = {
  待接单: [{ action: "accept", label: "接单", icon: "check-circle-2" }],
  已接单: [
    { action: "navigation", label: "路线导航", icon: "navigation" },
    { action: "start", label: "开始服务", icon: "play-circle" },
  ],
  服务中: [
    { action: "navigation", label: "路线导航", icon: "navigation" },
    { action: "complete", label: "完成上报", icon: "upload-cloud" },
  ],
};

function guideCity() {
  const area = state.dashboard?.guide?.area || DEFAULT_GUIDE_CITY;
  const match = String(area).match(/[^省市区县]+市/);
  return match?.[0] || DEFAULT_GUIDE_CITY;
}

function taskDestination(task) {
  const order = task?.order || {};
  return order.location || order.address || order.destination || order.serviceAddress || "";
}

function guideStartName() {
  return state.dashboard?.guide?.area || "当前位置";
}

function amapWebDirectionUrl(destination) {
  const city = guideCity();
  const origin = guideStartName();
  return `https://www.amap.com/dir?from%5Bname%5D=${encodeURIComponent(origin)}&to%5Bname%5D=${encodeURIComponent(`${city}${destination}`)}&type=car`;
}

async function geocodeAmapDestination(destination) {
  const city = guideCity();
  const response = await fetch(`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(AMAP_KEY)}&address=${encodeURIComponent(destination)}&city=${encodeURIComponent(city)}`);
  if (!response.ok) throw new Error("高德地理编码失败");
  const data = await response.json();
  const location = data?.geocodes?.[0]?.location;
  if (!location) return null;
  const [lng, lat] = location.split(",");
  if (!lng || !lat) return null;
  return { lng, lat };
}

async function openGuideNavigation(task, button) {
  const destination = taskDestination(task);
  if (!destination) {
    notify("当前订单没有服务地址，无法规划路线", "error");
    return;
  }

  const loadingWindow = window.open("", "_blank", "noopener,noreferrer");
  if (loadingWindow) {
    loadingWindow.document.write(`
      <title>正在打开高德地图</title>
      <body style="font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',Arial,sans-serif;padding:24px;color:#172126;">
        正在打开高德地图路线规划：${escapeHtml(guideStartName())} → ${escapeHtml(destination)}
      </body>
    `);
  }

  const fallbackUrl = amapWebDirectionUrl(destination);
  const point = await geocodeAmapDestination(destination).catch(() => null);
  const finalUrl = point
    ? `https://uri.amap.com/navigation?to=${encodeURIComponent(`${point.lng},${point.lat},${destination}`)}&mode=car&policy=1&src=${encodeURIComponent("云旅无忧向导端")}&coordinate=gaode&callnative=1`
    : fallbackUrl;

  if (loadingWindow) {
    loadingWindow.location.href = finalUrl;
  } else {
    window.location.href = finalUrl;
  }

  const record = button?.closest(".record");
  if (record) {
    const status = record.querySelector("[data-route-status]");
    if (status) status.textContent = `已打开高德路线：${guideStartName()} → ${destination}`;
  }
}

function renderHero(data) {
  const { guide } = data;
  return `
    <section class="hero-band">
      <div class="hero-content">
        <p class="eyebrow">${escapeHtml(guide.area)} · 评分 ${guide.rating}</p>
        <h1>${escapeHtml(guide.realName)}，${escapeHtml(guide.currentStatus)}</h1>
        <p class="hero-copy">${guide.serviceTypes.map(escapeHtml).join(" / ")} · ${escapeHtml(guide.onlineStatus)}</p>
        <div class="hero-actions">
          <button class="action-button" type="button" data-action="toggleOnline">
            <i data-lucide="${guide.onlineStatus === "在线" ? "wifi-off" : "wifi"}"></i>${guide.onlineStatus === "在线" ? "下线" : "上线"}
          </button>
          <button class="ghost-button" type="button" data-action="refresh"><i data-lucide="refresh-cw"></i>刷新任务</button>
        </div>
      </div>
      <div class="hero-media">
        <img src="/ui-ref/向导端/14-首页.png" alt="向导端工作台" />
      </div>
    </section>
  `;
}

function renderMetrics(data) {
  return `
    <section class="metrics-grid">
      ${metric("今日收入", money(data.stats.todayIncome), "wallet")}
      ${metric("接单数", data.stats.orderCount, "calendar-check")}
      ${metric("完成数", data.stats.completedOrders, "circle-check")}
      ${metric("待结算", money(data.stats.settlementPending), "wallet-cards")}
      ${metric("执行中任务", data.stats.activeTasks, "route")}
      ${metric("待派订单", data.stats.pendingOrders, "clipboard-clock")}
    </section>
  `;
}

function renderTabs() {
  const tabs = [
    ["tasks", "任务", "list-checks"],
    ["pending", "待派单", "radar"],
    ["messages", "消息", "bell"],
  ];
  return `
    <nav class="toolbar" aria-label="向导端栏目">
      ${tabs.map(([key, label, icon]) => `
        <button class="tab-button ${state.tab === key ? "active" : ""}" type="button" data-tab="${key}">
          <i data-lucide="${icon}"></i>${label}
        </button>
      `).join("")}
    </nav>
  `;
}

function renderTaskActions(task) {
  const next = taskActions[task.status];
  if (!next) return "";
  return `
    ${next.map(({ action, label, icon }) => `
      <button class="${action === "navigation" ? "ghost-button" : "action-button"}" type="button" data-task-action="${action}" data-id="${task.id}">
        <i data-lucide="${icon}"></i>${label}
      </button>
    `).join("")}
  `;
}

function renderTasks(data) {
  const tasks = data.tasks;
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">履约</p>
            <h2>我的任务</h2>
          </div>
          ${badge(data.guide.onlineStatus)}
        </div>
        <div class="record-list">
          ${tasks.length ? tasks.map((task) => {
            const order = task.order || {};
            return `
              <article class="record">
                <div class="record-head">
                  <div>
                    <h3>${escapeHtml(order.serviceType || "服务任务")} · ${escapeHtml(task.taskNo)}</h3>
                    <p>${escapeHtml(order.elderName || "")} · ${escapeHtml(order.location || "")}</p>
                  </div>
                  ${badge(task.status)}
                </div>
                <p>${escapeHtml(order.time || "")} · ${money(order.amount)} · ${escapeHtml(task.dispatchRule || "")}</p>
                <div class="record-actions">
                  ${renderTaskActions(task)}
                </div>
                ${taskDestination(task) ? `<p class="meta guide-route-status" data-route-status>服务地址：${escapeHtml(taskDestination(task))}</p>` : ""}
              </article>
            `;
          }).join("") : emptyState("暂无分配任务")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">服务能力</p>
            <h2>接单状态</h2>
          </div>
        </div>
        <div class="record-list">
          ${data.guide.serviceTypes.map((type) => `
            <article class="record">
              <div class="record-head">
                <h3>${escapeHtml(type)}</h3>
                ${badge(data.guide.status)}
              </div>
              <p>${escapeHtml(data.guide.area)} · 距离 ${data.guide.distanceKm}km</p>
            </article>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderPending(data) {
  const orders = data.pendingOrders;
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">平台调度</p>
          <h2>待派向导订单</h2>
        </div>
        ${badge(`${orders.length} 单`)}
      </div>
      <div class="record-list">
        ${orders.length ? orders.map((order) => `
          <article class="record">
            <div class="record-head">
              <div>
                <h3>${escapeHtml(order.serviceType)} · ${escapeHtml(order.orderNo)}</h3>
                <p>${escapeHtml(order.elderName)} · ${escapeHtml(order.time)}</p>
              </div>
              ${badge(order.status)}
            </div>
            <p>${escapeHtml(order.location)} · ${money(order.amount)} · ${escapeHtml(order.note || "")}</p>
          </article>
        `).join("") : emptyState("暂无待派订单")}
      </div>
    </section>
  `;
}

function renderMessages(data) {
  const messages = data.messages;
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">消息</p>
          <h2>订单与客户通知</h2>
        </div>
      </div>
      <div class="record-list">
        ${messages.length ? messages.map((message) => `
          <article class="record">
            <div class="record-head">
              <h3>${escapeHtml(message.title)}</h3>
              ${badge(message.read ? "已读" : "未读")}
            </div>
            <p>${escapeHtml(message.content)}</p>
            <span class="meta">${formatTime(message.createdAt)}</span>
          </article>
        `).join("") : emptyState("暂无消息")}
      </div>
    </section>
  `;
}

function render() {
  const data = state.dashboard;
  $("#app").innerHTML = `
    ${statusBar()}
    ${renderHero(data)}
    ${renderMetrics(data)}
    ${renderTabs()}
    ${state.tab === "tasks" ? renderTasks(data) : ""}
    ${state.tab === "pending" ? renderPending(data) : ""}
    ${state.tab === "messages" ? renderMessages(data) : ""}
  `;
  icons();
}

async function load() {
  await api.ensureAuth("guide");
  const [dashboard, statsPayload] = await Promise.all([
    api.guideDashboard(),
    api.guideStats(),
  ]);
  state.dashboard = {
    ...dashboard,
    guide: { ...dashboard.guide, ...(statsPayload.provider || {}) },
    stats: statsPayload.stats || dashboard.stats,
  };
  render();
}

document.addEventListener("click", guardGuideEndpointClick, true);

document.addEventListener("click", async (event) => {
  if (event.guideEndpointBlocked) return;
  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    state.tab = tabButton.dataset.tab;
    render();
    return;
  }

  const button = event.target.closest("[data-action], [data-task-action]");
  if (!button) return;
  bindBusy(button, true);
  try {
    if (button.dataset.action === "toggleOnline") {
      const guide = state.dashboard.guide;
      const updatedGuide = await api.setGuideOnline({
        guideId: guide.id,
        onlineStatus: guide.onlineStatus === "在线" ? "离线" : "在线",
      });
      notify(updatedGuide.onlineStatus === "在线" ? "已上线接单，后台可派单" : "已停止接单，后台不再派新单", "success");
    }
    if (button.dataset.taskAction) {
      if (button.dataset.taskAction === "navigation") {
        const task = state.dashboard.tasks.find((item) => item.id === button.dataset.id);
        await openGuideNavigation(task, button);
        return;
      }
      const result = await api.taskAction(button.dataset.id, button.dataset.taskAction, {
        evidence: "服务记录、定位和完成照片已同步。",
      });
      const taskStatus = result.task?.status || result.status || "";
      const orderStatus = result.order?.status ? `，订单${result.order.status}` : "";
      notify(`任务${taskStatus}${orderStatus}`, "success");
    }
    await load();
  } catch (error) {
    notify(error.message, "error");
  } finally {
    bindBusy(button, false);
  }
});

load().catch((error) => {
  $("#app").innerHTML = emptyState(error.message);
  icons();
});
