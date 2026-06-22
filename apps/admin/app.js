import { api } from "/shared/api.js?v=20260601-auth";
import { $, badge, bindBusy, emptyState, escapeHtml, formatTime, icons, metric, money, notify, progress } from "/shared/ui.js?v=20260601-auth";

const state = {
  dashboard: null,
  orders: [],
  dispatch: null,
  alerts: [],
  users: null,
  health: null,
  guides: [],
  merchants: [],
  services: [],
  reviews: [],
  activities: null,
  homeContent: null,
  dataLoop: null,
  database: null,
  auditLogs: [],
  uiActions: [],
  functions: null,
  screens: null,
  priority: null,
  integrations: null,
  tab: "overview",
};

const PAGE_BUTTON_RE = /^(‹|›|<|>|\d+)$/;

const tabs = [
  ["overview", "总览", "layout-dashboard"],
  ["users", "用户健康", "users"],
  ["guides", "向导审核", "user-check"],
  ["merchants", "商户审核", "store"],
  ["services", "服务评价", "package-check"],
  ["activities", "活动内容", "calendar-days"],
  ["orders", "订单管理", "clipboard-list"],
  ["dispatch", "订单派单", "route"],
  ["alerts", "异常处理", "siren"],
  ["data", "数据闭环", "database"],
  ["system", "系统验收", "shield-check"],
];

function hashValue() {
  return window.location.hash.replace(/^#/, "");
}

function isReferenceRoute() {
  const value = hashValue();
  return value === "reference" || value.startsWith("reference-") || value.startsWith("prototype-");
}

function tabFromHash() {
  const value = hashValue();
  if (!value || value === "console" || value === "dashboard") return "overview";
  if (tabs.some(([key]) => key === value)) return value;
  return "overview";
}

function currentReferenceRoute() {
  const value = hashValue();
  return value.replace(/^(reference|prototype)-?/, "") || "dashboard";
}

function safeList(value) {
  return Array.isArray(value) ? value : [];
}

function renderReferenceAdmin() {
  const route = encodeURIComponent(currentReferenceRoute());
  document.body.classList.add("admin-reference-mode");
  $("#app").innerHTML = `
    <section class="admin-reference-shell" aria-label="云旅无忧管理后台高保真页面">
      <iframe title="云旅无忧管理后台 ${escapeHtml(currentReferenceRoute())}" src="/prototype/admin/#${route}"></iframe>
    </section>
  `;
}

function renderHero() {
  return `
    <section class="hero-band">
      <div class="hero-content">
        <p class="eyebrow">云旅无忧运营后台</p>
        <h1>真实数据驱动的调度与运营中台</h1>
        <p class="hero-copy">统一查看用户、健康、服务、商户、向导、订单、活动、异常、评价和审计数据；后台操作会写回 API，并同步前台消息与状态。</p>
        <div class="hero-actions">
          <button class="action-button" type="button" data-action="refresh"><i data-lucide="refresh-cw"></i>刷新数据</button>
          <button class="action-button" type="button" data-action="createDemoOrder"><i data-lucide="plus-circle"></i>生成待派单订单</button>
          <button class="ghost-button" type="button" data-action="createDemoSos"><i data-lucide="siren"></i>模拟 SOS</button>
          <button class="ghost-button" type="button" data-action="snapshot"><i data-lucide="database-backup"></i>创建快照</button>
          <button class="danger-button" type="button" data-action="resetDemo"><i data-lucide="rotate-ccw"></i>重置演示数据</button>
        </div>
      </div>
      <div class="hero-media">
        <img src="/ui-ref/管理后台/01-数据概览.png" alt="管理后台数据概览" />
      </div>
    </section>
  `;
}

function renderMetrics() {
  const stats = state.dashboard?.stats || {};
  return `
    <section class="metrics-grid admin-kpi-grid">
      ${metric("老人/用户", stats.elderCount || 0, "users")}
      ${metric("待处理订单", stats.pendingOrders || 0, "clipboard-clock")}
      ${metric("未处理异常", stats.openAlerts || 0, "siren")}
      ${metric("今日流水", money(stats.todayRevenue || 0), "wallet")}
    </section>
  `;
}

function renderTabs() {
  return `
    <nav class="toolbar" aria-label="后台栏目">
      ${tabs.map(([key, label, icon]) => `
        <button class="tab-button ${state.tab === key ? "active" : ""}" type="button" data-tab="${key}" data-action="切换${label}">
          <i data-lucide="${icon}"></i>${label}
        </button>
      `).join("")}
    </nav>
  `;
}

function renderRecord({ title, meta = "", status = "", body = "", actions = "" }) {
  return `
    <article class="record">
      <div class="record-head">
        <div>
          <h3>${escapeHtml(title)}</h3>
          ${meta ? `<p>${escapeHtml(meta)}</p>` : ""}
        </div>
        ${status ? badge(status) : ""}
      </div>
      ${body ? `<p>${escapeHtml(body)}</p>` : ""}
      ${actions ? `<div class="record-actions">${actions}</div>` : ""}
    </article>
  `;
}

function renderOverview() {
  const latestOrders = safeList(state.dashboard?.recentOrders);
  const latestAlerts = safeList(state.dashboard?.recentAlerts);
  const summary = state.dataLoop?.summary || {};
  const auditLogs = safeList(state.auditLogs);
  return `
    <section class="admin-live-strip">
      <article>
        <span>前台下单</span>
        <strong>/api/orders</strong>
        <small>用户端提交后进入后台订单与待派单池</small>
      </article>
      <article>
        <span>后台派单</span>
        <strong>/api/tasks/dispatch</strong>
        <small>生成向导/商户任务，同步执行端与用户消息</small>
      </article>
      <article>
        <span>SOS 处理</span>
        <strong>/api/alerts/*/handle</strong>
        <small>用户求助进入后台，处理后写入审计与通知</small>
      </article>
      <article>
        <span>内容联动</span>
        <strong>/api/admin/content/home</strong>
        <small>后台活动与首页配置同步用户端</small>
      </article>
    </section>
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">实时订单</p>
            <h2>最新服务流转</h2>
          </div>
          ${badge(`${state.orders.length} 单`)}
        </div>
        <div class="record-list">
          ${latestOrders.length ? latestOrders.map((order) => renderRecord({
            title: `${order.serviceType || "服务"} · ${order.orderNo || order.id}`,
            meta: `${order.elderName || "用户"} · ${order.assigneeName || "待分配"}`,
            status: order.status,
            body: `${order.location || ""} · ${money(order.amount)} · ${formatTime(order.createdAt)}`,
          })).join("") : emptyState("暂无订单")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">数据闭环</p>
            <h2>运营沉淀</h2>
          </div>
          ${badge("实时")}
        </div>
        <div class="service-grid">
          ${metric("服务请求", summary.serviceRequests || 0, "hand-heart")}
          ${metric("评价", summary.reviews || 0, "star")}
          ${metric("健康记录", summary.healthRecords || 0, "heart-pulse")}
          ${metric("活动报名", summary.activitySignups || 0, "calendar-check")}
        </div>
        <div class="record-list">
          ${latestAlerts.slice(0, 3).map((alert) => renderRecord({
            title: `${alert.type || "异常"} · ${alert.elderName || ""}`,
            meta: `${alert.level || ""}优先级 · ${alert.location || ""}`,
            status: alert.status,
            body: alert.description,
          })).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">后台审计</p>
            <h2>最近真实写操作</h2>
          </div>
          ${badge(`${auditLogs.length} 条`)}
        </div>
        <div class="record-list">
          ${auditLogs.slice(0, 6).map((item) => renderRecord({
            title: `${item.actor || "系统"} · ${item.action}`,
            meta: `${formatTime(item.createdAt)} · ${item.ip || ""}`,
            status: item.result || "成功",
            body: item.target || "",
          })).join("") || emptyState("暂无审计记录")}
        </div>
      </article>
    </section>
  `;
}

function renderUsers() {
  const users = safeList(state.users?.users);
  const contacts = safeList(state.users?.familyContacts);
  const records = safeList(state.health?.records);
  const devices = safeList(state.health?.devices);
  const requests = safeList(state.dataLoop?.services?.requests);
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">老人/用户管理</p>
            <h2>用户档案与家属绑定</h2>
          </div>
          ${badge(`${users.length} 个账号`)}
        </div>
        <div class="record-list">
          ${users.map((user) => renderRecord({
            title: `${user.nickname || user.name || user.id} · ${user.role}`,
            meta: `${user.phone || ""} · 订单 ${user.orderCount || 0}`,
            status: user.status,
            body: `未读消息 ${user.unreadMessages || 0} 条`,
          })).join("")}
          ${contacts.map((contact) => renderRecord({
            title: `${contact.name} · ${contact.relation}`,
            meta: contact.phone,
            status: contact.isDefault ? "默认联系人" : "已绑定",
            body: "紧急联系人和家属授权已沉淀到后台。",
          })).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">健康与设备</p>
            <h2>健康数据闭环</h2>
          </div>
          ${badge(`${devices.length} 台设备`)}
        </div>
        <div class="record-list">
          ${devices.map((device) => renderRecord({
            title: `${device.type || "设备"} · ${device.deviceId}`,
            meta: `${device.onlineStatus || ""} · 电量 ${device.battery || 0}%`,
            status: device.onlineStatus,
            body: device.lastSyncAt ? `最近同步：${device.lastSyncAt}` : "等待同步",
          })).join("")}
          ${records.slice(0, 5).map((item) => renderRecord({
            title: item.label || item.metricType,
            meta: `${item.value}${item.unit || ""} · ${item.source || "设备"}`,
            status: "正常",
            body: item.recordedAt || "",
          })).join("")}
          ${requests.slice(0, 3).map((item) => renderRecord({
            title: `${item.type} · ${item.requestNo}`,
            meta: `${item.elderName} · ${item.route || "用户端"}`,
            status: item.status,
            body: item.description || item.action,
            actions: item.status !== "已处理" ? `<button class="action-button" type="button" data-action="handleRequest" data-id="${item.id}"><i data-lucide="check-circle-2"></i>处理请求</button>` : "",
          })).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderGuides() {
  const tasks = safeList(state.dataLoop?.guides?.tasks);
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">人工向导管理</p>
            <h2>审核、状态和服务数据</h2>
          </div>
          ${badge(`${state.guides.length} 名向导`)}
        </div>
        <div class="record-list">
          ${state.guides.map((guide) => renderRecord({
            title: `${guide.realName} · ${guide.area}`,
            meta: `${safeList(guide.serviceTypes).join(" / ")} · 评分 ${guide.rating}`,
            status: guide.status,
            body: `${guide.onlineStatus || ""} · ${guide.currentStatus || ""} · 任务 ${guide.taskCount || 0} · 评价 ${guide.reviewCount || 0}`,
            actions: `
              <button class="action-button" type="button" data-action="auditGuide" data-id="${guide.id}" data-status="已认证"><i data-lucide="check"></i>通过</button>
              <button class="ghost-button" type="button" data-action="auditGuide" data-id="${guide.id}" data-status="待补充"><i data-lucide="file-warning"></i>补充材料</button>
              <button class="danger-button" type="button" data-action="auditGuide" data-id="${guide.id}" data-status="已驳回"><i data-lucide="x"></i>驳回</button>
            `,
          })).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">任务执行</p>
            <h2>向导任务状态</h2>
          </div>
          ${badge(`${tasks.length} 条任务`)}
        </div>
        <div class="record-list">
          ${tasks.length ? tasks.slice(0, 8).map((task) => renderRecord({
            title: `${task.taskNo || task.id} · ${task.order?.serviceType || "服务"}`,
            meta: `${task.assigneeName || ""} · ${task.order?.elderName || ""}`,
            status: task.status,
            body: `${task.order?.time || ""} · ${task.order?.location || ""}`,
          })).join("") : emptyState("暂无向导任务")}
        </div>
      </article>
    </section>
  `;
}

function renderMerchants() {
  const merchantOrders = safeList(state.dataLoop?.merchants?.orders);
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">商户管理</p>
            <h2>入驻审核与经营状态</h2>
          </div>
          ${badge(`${state.merchants.length} 家商户`)}
        </div>
        <div class="record-list">
          ${state.merchants.map((merchant) => renderRecord({
            title: `${merchant.name} · ${merchant.type}`,
            meta: `${merchant.contact} ${merchant.phone} · 评分 ${merchant.rating}`,
            status: merchant.status,
            body: `${merchant.address} · 服务 ${merchant.serviceCount || 0} · 订单 ${merchant.orderCount || 0} · 评价 ${merchant.reviewCount || 0}`,
            actions: `
              <button class="action-button" type="button" data-action="auditMerchant" data-id="${merchant.id}" data-status="已通过"><i data-lucide="check"></i>通过</button>
              <button class="ghost-button" type="button" data-action="auditMerchant" data-id="${merchant.id}" data-status="待补充"><i data-lucide="file-warning"></i>补充材料</button>
              <button class="danger-button" type="button" data-action="auditMerchant" data-id="${merchant.id}" data-status="已驳回"><i data-lucide="x"></i>驳回</button>
            `,
          })).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">商户订单</p>
            <h2>预约与报价闭环</h2>
          </div>
          ${badge(`${merchantOrders.length} 单`)}
        </div>
        <div class="record-list">
          ${merchantOrders.slice(0, 8).map((order) => renderRecord({
            title: `${order.serviceType} · ${order.orderNo}`,
            meta: `${order.elderName} · ${order.time}`,
            status: order.status,
            body: `${order.location} · ${money(order.amount)}`,
          })).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderServices() {
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">服务资源</p>
            <h2>服务审核与上下架</h2>
          </div>
          ${badge(`${state.services.length} 项服务`)}
        </div>
        <div class="record-list">
          ${state.services.map((service) => renderRecord({
            title: `${service.title} · ${service.category}`,
            meta: `${service.providerName || service.providerType} · ${money(service.price)} / ${service.unit || "次"}`,
            status: service.status,
            body: `${service.description || ""} · 关联订单 ${service.orderCount || 0}`,
            actions: `
              <button class="action-button" type="button" data-action="serviceStatus" data-id="${service.id}" data-status="上架"><i data-lucide="arrow-up-circle"></i>上架</button>
              <button class="ghost-button" type="button" data-action="serviceStatus" data-id="${service.id}" data-status="下架"><i data-lucide="arrow-down-circle"></i>下架</button>
            `,
          })).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">评价售后</p>
            <h2>评价数据沉淀</h2>
          </div>
          ${badge(`${state.reviews.length} 条评价`)}
        </div>
        <div class="record-list">
          ${state.reviews.slice(0, 8).map((review) => renderRecord({
            title: `${review.providerName || review.providerType} · ${review.rating || 5}分`,
            meta: `${review.orderNo || review.orderId || ""} · ${money(review.amount)}`,
            status: review.orderStatus || "已评价",
            body: review.content || review.comment || "用户已完成评价。",
          })).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderActivities() {
  const activities = safeList(state.activities?.activities);
  const signups = safeList(state.activities?.signups);
  const banner = state.homeContent?.banner || {};
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">活动管理</p>
            <h2>活动地图同步</h2>
          </div>
          ${badge(`${activities.length} 个活动`)}
        </div>
        <form class="form-grid" data-form="activity">
          <label class="field"><span>活动名称</span><input name="title" value="非遗茶会体验" /></label>
          <label class="field"><span>分类</span><input name="category" value="文化体验" /></label>
          <label class="field"><span>时间</span><input name="time" value="2026-06-08 15:00" /></label>
          <label class="field"><span>名额</span><input name="quota" type="number" value="30" /></label>
          <label class="field full"><span>地点</span><input name="location" value="云旅之家活动室" /></label>
          <button class="action-button" type="submit"><i data-lucide="calendar-plus"></i>新增活动</button>
        </form>
        <div class="record-list">
          ${activities.map((activity) => renderRecord({
            title: `${activity.title} · ${activity.category}`,
            meta: `${activity.time} · ${activity.location}`,
            status: activity.status,
            body: `报名 ${activity.joined || 0}/${activity.quota || 0}`,
            actions: `
              <button class="action-button" type="button" data-action="activityStatus" data-id="${activity.id}" data-status="报名中"><i data-lucide="play-circle"></i>上线</button>
              <button class="ghost-button" type="button" data-action="activityStatus" data-id="${activity.id}" data-status="已下线"><i data-lucide="pause-circle"></i>下线</button>
            `,
          })).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">内容配置</p>
            <h2>用户端首页 Banner</h2>
          </div>
          ${badge(banner.status || "可配置")}
        </div>
        <form class="form-grid" data-form="homeContent">
          <label class="field full"><span>标题</span><input name="title" value="${escapeHtml(banner.title || "旅居生活 从心出发")}" /></label>
          <label class="field full"><span>副标语</span><input name="slogan" value="${escapeHtml(banner.slogan || "发现美好 · 结识同伴 · 乐享晚年")}" /></label>
          <label class="field full"><span>图片路径</span><input name="image" value="${escapeHtml(banner.image || "/user/assets/home-hero.jpg")}" /></label>
          <button class="action-button" type="submit"><i data-lucide="save"></i>发布到用户端首页</button>
        </form>
        <div class="record-list">
          ${signups.slice(0, 6).map((signup) => renderRecord({
            title: `${signup.activityTitle || signup.activityId} · ${signup.elderName}`,
            meta: `${signup.phone || ""} · ${signup.count || 1} 人`,
            status: signup.status,
            body: `性别 ${signup.gender || "--"} · 年龄 ${signup.age || "--"}`,
          })).join("")}
        </div>
      </article>
    </section>
  `;
}

function orderPrimaryActions(order) {
  const actions = [];
  if (["待派单", "待分配"].includes(order.status)) {
    actions.push(`<button class="action-button" type="button" data-action="dispatch" data-id="${order.id}" data-provider="${order.recommendedProvider?.assigneeType || order.providerType || "guide"}" data-assignee="${order.recommendedProvider?.assigneeId || ""}"><i data-lucide="route"></i>派单</button>`);
  }
  if (["已派单", "已接单", "服务中", "待服务", "待确认"].includes(order.status)) {
    actions.push(`<button class="ghost-button" type="button" data-action="jumpDispatch" data-tab-jump="dispatch"><i data-lucide="workflow"></i>查看任务</button>`);
  }
  return actions.join("");
}

function renderOrders() {
  const orders = safeList(state.orders);
  const requests = safeList(state.dataLoop?.services?.requests);
  const grouped = ["待派单", "已派单", "已接单", "服务中", "待服务", "待确认", "已完成", "已取消"].map((status) => ({
    status,
    orders: orders.filter((order) => order.status === status),
  })).filter((group) => group.orders.length);
  return `
    <section class="content-grid">
      <article class="panel wide-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">订单闭环</p>
            <h2>全部订单状态追踪</h2>
          </div>
          <div class="panel-actions">
            ${badge(`${orders.length} 单`)}
            <button class="action-button" type="button" data-action="createDemoOrder"><i data-lucide="plus-circle"></i>新增待派单</button>
          </div>
        </div>
        <div class="admin-order-board">
          ${grouped.map((group) => `
            <section class="admin-order-column">
              <header><strong>${escapeHtml(group.status)}</strong><span>${group.orders.length}</span></header>
              ${group.orders.map((order) => renderRecord({
                title: `${order.serviceType || "服务"} · ${order.orderNo || order.id}`,
                meta: `${order.elderName || "用户"} · ${order.time || ""}`,
                status: order.status,
                body: `${order.location || ""} · ${money(order.amount)} · 执行方：${order.assigneeName || "待分配"}`,
                actions: orderPrimaryActions(order),
              })).join("")}
            </section>
          `).join("") || emptyState("暂无订单")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">服务请求池</p>
            <h2>前台功能提交记录</h2>
          </div>
          ${badge(`${requests.length} 条`)}
        </div>
        <div class="record-list">
          ${requests.slice(0, 10).map((item) => renderRecord({
            title: `${item.type} · ${item.requestNo}`,
            meta: `${item.elderName} · ${item.route || "前台"}`,
            status: item.status,
            body: item.description || item.action,
            actions: item.status !== "已处理" ? `<button class="action-button" type="button" data-action="handleRequest" data-id="${item.id}"><i data-lucide="check-circle-2"></i>处理请求</button>` : "",
          })).join("") || emptyState("暂无服务请求")}
        </div>
      </article>
    </section>
  `;
}

function renderDispatch() {
  const pending = safeList(state.dispatch?.pendingOrders);
  const activeTasks = safeList(state.dispatch?.activeTasks);
  const candidates = state.dispatch?.candidates || {};
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">任务调度</p>
            <h2>待派单列表</h2>
          </div>
          ${badge(`${pending.length} 单`)}
        </div>
        <div class="record-list">
          ${pending.length ? pending.map((order) => renderRecord({
            title: `${order.serviceType} · ${order.orderNo}`,
            meta: `${order.elderName} · ${order.time}`,
            status: order.status,
            body: `${order.location} · 推荐：${order.recommendedProvider?.assigneeName || "待匹配"} · ${money(order.amount)}`,
            actions: `<button class="action-button" type="button" data-action="dispatch" data-id="${order.id}" data-provider="${order.recommendedProvider?.assigneeType || order.providerType || "guide"}" data-assignee="${order.recommendedProvider?.assigneeId || ""}"><i data-lucide="route"></i>指派执行方</button>`,
          })).join("") : emptyState("暂无待派单")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">候选资源</p>
            <h2>向导 / 商户</h2>
          </div>
          ${badge(`${safeList(candidates.guides).length + safeList(candidates.merchants).length} 个候选`)}
        </div>
        <div class="record-list">
          ${safeList(candidates.guides).slice(0, 4).map((guide) => renderRecord({
            title: `${guide.realName} · ${guide.area}`,
            meta: `${guide.onlineStatus} · 距离 ${guide.distanceKm}km`,
            status: guide.status,
            body: safeList(guide.serviceTypes).join(" / "),
          })).join("")}
          ${safeList(candidates.merchants).slice(0, 4).map((merchant) => renderRecord({
            title: `${merchant.name} · ${merchant.type}`,
            meta: `${merchant.contact} · ${merchant.phone}`,
            status: merchant.status,
            body: merchant.address,
          })).join("")}
          ${activeTasks.slice(0, 4).map((task) => renderRecord({
            title: `${task.taskNo || task.id} · ${task.order?.serviceType || "任务"}`,
            meta: task.assigneeName || "",
            status: task.status,
            body: task.order?.location || "",
          })).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderAlerts() {
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">异常报告</p>
          <h2>SOS、设备异常、投诉和服务异常</h2>
        </div>
        ${badge(`${state.alerts.filter((item) => item.status !== "已处理").length} 未处理`)}
      </div>
      <div class="record-list">
        ${state.alerts.length ? state.alerts.map((alert) => renderRecord({
          title: `${alert.type} · ${alert.elderName}`,
          meta: `${alert.location || ""} · ${formatTime(alert.createdAt)}`,
          status: alert.status,
          body: `${alert.level || ""}优先级 · ${alert.description || ""}`,
          actions: alert.status !== "已处理" ? `<button class="action-button" type="button" data-action="handleAlert" data-id="${alert.id}"><i data-lucide="check-circle-2"></i>处理完成</button>` : "",
        })).join("") : emptyState("暂无异常")}
      </div>
    </section>
  `;
}

function renderDataLoop() {
  const summary = state.dataLoop?.summary || {};
  const messages = safeList(state.dataLoop?.messages);
  const uiActions = state.uiActions;
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">数据闭环</p>
            <h2>用户、健康、服务、商户、评价沉淀</h2>
          </div>
          ${badge(state.dataLoop?.updatedAt || "实时")}
        </div>
        <div class="service-grid">
          ${metric("用户", summary.users || 0, "users")}
          ${metric("设备在线", `${summary.onlineDevices || 0}/${summary.devices || 0}`, "watch")}
          ${metric("订单", summary.orders || 0, "clipboard-list")}
          ${metric("服务请求", summary.serviceRequests || 0, "hand-heart")}
          ${metric("评价", summary.reviews || 0, "star")}
          ${metric("流水", money(summary.revenue || 0), "wallet")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">消息与前端动作</p>
            <h2>跨端协同记录</h2>
          </div>
          ${badge(`${uiActions.length} 条动作`)}
        </div>
        <div class="record-list">
          ${uiActions.slice(0, 8).map((item) => renderRecord({
            title: `${item.role} · ${item.action}`,
            meta: `${item.route || "页面"} · ${formatTime(item.createdAt)}`,
            status: "已记录",
            body: item.result,
          })).join("")}
          ${messages.slice(0, 4).map((message) => renderRecord({
            title: `${message.toRole} · ${message.title}`,
            meta: formatTime(message.createdAt),
            status: message.read ? "已读" : "未读",
            body: message.content,
          })).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderSystem() {
  const db = state.database || {};
  const modules = safeList(state.functions?.modules);
  const screens = safeList(state.screens?.screens);
  const integrations = safeList(state.integrations?.integrations);
  const collections = db.collections || {};
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">系统验收</p>
            <h2>模块、权限、数据库和部署基线</h2>
          </div>
          ${badge(state.priority?.P0?.status || "可验收")}
        </div>
        <div class="service-grid">
          ${Object.entries(collections).slice(0, 8).map(([name, count]) => `
            <article class="service-card">
              <span class="muted">${escapeHtml(name)}</span>
              <strong>${count}</strong>
            </article>
          `).join("")}
        </div>
        <div class="record-list">
          ${modules.map((item) => renderRecord({
            title: `${item.module} · ${item.priority}`,
            meta: item.route || "",
            status: item.runtime?.status || item.runtimeStatus || "已接入",
            body: item.acceptance || "",
          })).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">数据大屏 / 外部资源</p>
            <h2>验收入口与二期预留</h2>
          </div>
          ${badge(`${screens.length} 个大屏`)}
        </div>
        <div class="record-list">
          ${screens.map((screen) => renderRecord({
            title: screen.title,
            meta: safeList(screen.coreMetrics).join(" / "),
            status: "已接入",
            body: screen.purpose,
          })).join("")}
          ${integrations.slice(0, 5).map((item) => renderRecord({
            title: `${item.name} · ${item.priority}`,
            meta: item.endpoint,
            status: item.status,
            body: item.note,
          })).join("")}
        </div>
      </article>
    </section>
  `;
}

function render() {
  if (isReferenceRoute()) {
    renderReferenceAdmin();
    return;
  }
  state.tab = tabFromHash();
  document.body.classList.remove("admin-reference-mode");
  $("#app").innerHTML = `
    ${renderMetrics()}
    ${renderTabs()}
    ${state.tab === "overview" ? renderOverview() : ""}
    ${state.tab === "users" ? renderUsers() : ""}
    ${state.tab === "guides" ? renderGuides() : ""}
    ${state.tab === "merchants" ? renderMerchants() : ""}
    ${state.tab === "services" ? renderServices() : ""}
    ${state.tab === "activities" ? renderActivities() : ""}
    ${state.tab === "orders" ? renderOrders() : ""}
    ${state.tab === "dispatch" ? renderDispatch() : ""}
    ${state.tab === "alerts" ? renderAlerts() : ""}
    ${state.tab === "data" ? renderDataLoop() : ""}
    ${state.tab === "system" ? renderSystem() : ""}
  `;
  hydrateAdminPaginationControls($("#app"));
  icons();
}

function hydrateAdminPaginationControls(root) {
  if (!root) return;
  root.querySelectorAll(".table-footer button, .admin-pagination button").forEach((button) => {
    const label = (button.getAttribute("aria-label") || button.textContent || "").trim().replace(/\s+/g, " ");
    if (!PAGE_BUTTON_RE.test(label)) return;
    button.dataset.pageAction = label === "‹" || label === "<" ? "prev" : label === "›" || label === ">" ? "next" : label;
    delete button.dataset.action;
    button.type = "button";
  });
}

function handleAdminPagination(button) {
  const pager = button.closest(".admin-pagination, .table-footer");
  if (!pager) return false;
  const pageButtons = [...pager.querySelectorAll("button[data-page-action]")].filter((item) => /^\d+$/.test(item.dataset.pageAction || ""));
  if (!pageButtons.length) return false;
  const currentButton = pageButtons.find((item) => item.classList.contains("active") || item.classList.contains("is-active") || item.getAttribute("aria-current") === "page") || pageButtons[0];
  const maxPage = Math.max(1, ...pageButtons.map((item) => Number(item.dataset.pageAction)).filter(Number.isFinite));
  const currentPageNumber = Math.max(1, Number(currentButton.dataset.pageAction) || 1);
  const action = button.dataset.pageAction || "";
  const nextPage = action === "prev"
    ? Math.max(1, currentPageNumber - 1)
    : action === "next"
      ? Math.min(maxPage, currentPageNumber + 1)
      : Math.min(maxPage, Math.max(1, Number(action) || 1));

  pageButtons.forEach((item) => {
    const active = Number(item.dataset.pageAction) === nextPage;
    item.classList.toggle("active", active);
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-current", active ? "page" : "false");
  });
  pager.querySelectorAll("input").forEach((input) => {
    input.value = String(nextPage);
  });
  notify(`第 ${nextPage} 页数据已显示`, "success");
  return true;
}

async function load() {
  if (isReferenceRoute()) {
    render();
    return;
  }
  state.tab = tabFromHash();
  await api.ensureAuth("admin");
  const entries = [
    ["dashboard", api.adminDashboard()],
    ["orders", api.adminOrders()],
    ["dispatch", api.pendingDispatch()],
    ["alerts", api.adminAlerts()],
    ["users", api.adminUsers()],
    ["health", api.adminHealthRecords()],
    ["guides", api.adminGuides()],
    ["merchants", api.adminMerchants()],
    ["services", api.adminServices()],
    ["reviews", api.adminReviews()],
    ["activities", api.adminActivities()],
    ["homeContent", api.adminHomeContent()],
    ["dataLoop", api.adminDataLoop()],
    ["database", api.databaseStatus()],
    ["auditLogs", api.auditLogs()],
    ["uiActions", api.uiActions()],
    ["functions", api.adminFunctionOverview()],
    ["screens", api.adminScreens()],
    ["priority", api.adminPriorityStatus()],
    ["integrations", api.integrationsStatus()],
  ];
  const settled = await Promise.allSettled(entries.map(([, promise]) => promise));
  const nextState = {};
  const failed = [];
  entries.forEach(([key], index) => {
    const item = settled[index];
    if (item.status === "fulfilled") nextState[key] = item.value;
    else {
      nextState[key] = state[key];
      failed.push(`${key}: ${item.reason?.message || "接口失败"}`);
    }
  });
  Object.assign(state, {
    ...nextState,
  });
  render();
  if (failed.length) notify(`部分后台接口暂不可用：${failed.slice(0, 2).join("；")}`, "warn");
}

window.addEventListener("hashchange", () => {
  load().catch((error) => {
    $("#app").innerHTML = emptyState(error.message);
    icons();
  });
});

document.addEventListener("click", async (event) => {
  const pageButton = event.target.closest("[data-page-action]");
  if (pageButton) {
    event.preventDefault();
    event.stopImmediatePropagation();
    handleAdminPagination(pageButton);
    return;
  }

  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    state.tab = tabButton.dataset.tab;
    window.history.replaceState(null, "", `#${state.tab}`);
    render();
    return;
  }

  const tabJump = event.target.closest("[data-tab-jump]");
  if (tabJump) {
    state.tab = tabJump.dataset.tabJump;
    window.history.replaceState(null, "", `#${state.tab}`);
    render();
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;
  bindBusy(button, true);
  try {
    if (button.dataset.action === "refresh") {
      await load();
      notify("后台数据已刷新", "success");
      return;
    }
    if (button.dataset.action === "createDemoOrder") {
      await api.createOrder({
        elderName: "李秀兰",
        serviceType: "陪伴就医",
        providerType: "guide",
        time: "2026-06-08 15:30",
        location: "昆明市第一人民医院",
        amount: 120,
        note: "后台验收生成：用于测试用户端下单、后台派单、向导接单闭环。",
      });
      state.tab = "orders";
      window.history.replaceState(null, "", "#orders");
      notify("待派单订单已创建，用户端订单和后台派单池已同步", "success");
    }
    if (button.dataset.action === "createDemoSos") {
      await api.triggerSos({
        location: "昆明市五华区翠湖康养公寓",
        accuracy: 30,
        description: "后台验收模拟 SOS：用于测试用户端求助、后台异常处理和消息同步。",
      });
      state.tab = "alerts";
      window.history.replaceState(null, "", "#alerts");
      notify("SOS 已生成，异常处理列表已同步", "success");
    }
    if (button.dataset.action === "dispatch") {
      await api.dispatchTask({
        orderId: button.dataset.id,
        assigneeType: button.dataset.provider,
        assigneeId: button.dataset.assignee || undefined,
      });
      notify("派单成功，执行端和用户端订单进度已同步", "success");
    }
    if (button.dataset.action === "handleAlert") {
      await api.handleAlert(button.dataset.id, { result: "后台已完成核实并同步相关端。" });
      notify("异常已处理", "success");
    }
    if (button.dataset.action === "handleRequest") {
      await api.handleServiceRequest(button.dataset.id, { status: "已处理", result: "后台已处理服务请求并同步用户。" });
      notify("服务请求已处理", "success");
    }
    if (button.dataset.action === "auditGuide") {
      await api.auditGuide(button.dataset.id, { status: button.dataset.status, note: `后台审核：${button.dataset.status}` });
      notify(`向导审核已处理：${button.dataset.status}`, "success");
    }
    if (button.dataset.action === "auditMerchant") {
      await api.auditMerchant(button.dataset.id, { status: button.dataset.status, note: `后台审核：${button.dataset.status}` });
      notify(`商户审核已处理：${button.dataset.status}`, "success");
    }
    if (button.dataset.action === "serviceStatus") {
      await api.setAdminServiceStatus(button.dataset.id, { status: button.dataset.status, note: "后台服务管理更新" });
      notify(`服务已${button.dataset.status}并同步用户端`, "success");
    }
    if (button.dataset.action === "activityStatus") {
      await api.setAdminActivityStatus(button.dataset.id, { status: button.dataset.status });
      notify(`活动已${button.dataset.status}并同步用户端`, "success");
    }
    if (button.dataset.action === "snapshot") {
      await api.createSnapshot({ label: "admin-console" });
      notify("数据库快照已创建", "success");
    }
    if (button.dataset.action === "resetDemo") {
      if (!window.confirm("确认重置演示数据？当前运行数据会先创建快照。")) return;
      await api.resetDemoData();
      notify("演示数据已重置", "success");
    }
    await load();
  } catch (error) {
    notify(error.message, "error");
  } finally {
    bindBusy(button, false);
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();
  const button = form.querySelector("button[type='submit']");
  bindBusy(button, true);
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    if (form.dataset.form === "activity") {
      await api.createAdminActivity({ ...data, quota: Number(data.quota || 30), status: "报名中" });
      notify("活动已创建并同步用户端", "success");
    }
    if (form.dataset.form === "homeContent") {
      await api.updateAdminHomeContent({
        banner: {
          title: data.title,
          slogan: data.slogan,
          image: data.image,
          status: "已发布",
        },
      });
      notify("首页内容已发布", "success");
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
