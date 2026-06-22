import { api } from "/shared/api.js?v=20260601-auth";
import { $, badge, bindBusy, emptyState, escapeHtml, formatTime, icons, metric, money, notify, statusBar } from "/shared/ui.js?v=20260608-statusbar";

const state = {
  dashboard: null,
  tab: "orders",
};

function renderHero(data) {
  const { merchant } = data;
  return `
    <section class="hero-band">
      <div class="hero-content">
        <p class="eyebrow">${escapeHtml(merchant.type)} · 评分 ${merchant.rating}</p>
        <h1>${escapeHtml(merchant.name)}，服务与订单已同步</h1>
        <p class="hero-copy">${escapeHtml(merchant.address)} · ${escapeHtml(merchant.contact)} ${escapeHtml(merchant.phone)}</p>
        <div class="hero-actions">
          <button class="action-button" type="button" data-tab="services"><i data-lucide="package-plus"></i>新增服务</button>
          <button class="ghost-button" type="button" data-action="refresh"><i data-lucide="refresh-cw"></i>刷新</button>
        </div>
      </div>
      <div class="hero-media">
        <img src="/prototype/merchant/assets/store-front.png" alt="商户门店" />
      </div>
    </section>
  `;
}

function renderMetrics(data) {
  return `
    <section class="metrics-grid">
      ${metric("待结算", money(data.stats.settlementPending), "wallet-cards")}
      ${metric("接单数", data.stats.orderCount, "clipboard-list")}
      ${metric("完成数", data.stats.completedOrders, "circle-check")}
      ${metric("今日收入", money(data.stats.todayIncome), "wallet")}
      ${metric("进行中订单", data.stats.activeOrders, "clipboard-list")}
      ${metric("服务项目", data.stats.serviceCount, "package")}
      ${metric("商户评分", data.stats.rating, "star")}
    </section>
  `;
}

function renderTabs() {
  const tabs = [
    ["orders", "订单", "list-checks"],
    ["services", "服务", "package"],
    ["messages", "消息", "bell"],
  ];
  return `
    <nav class="toolbar" aria-label="商户端栏目">
      ${tabs.map(([key, label, icon]) => `
        <button class="tab-button ${state.tab === key ? "active" : ""}" type="button" data-tab="${key}">
          <i data-lucide="${icon}"></i>${label}
        </button>
      `).join("")}
    </nav>
  `;
}

function renderOrderActions(order) {
  const buttons = [];
  if (["待派单", "已派单"].includes(order.status)) {
    buttons.push(`<button class="ghost-button" type="button" data-order-action="quote" data-id="${order.id}"><i data-lucide="file-pen-line"></i>报价</button>`);
    buttons.push(`<button class="action-button" type="button" data-order-action="confirm" data-id="${order.id}"><i data-lucide="calendar-check"></i>确认预约</button>`);
  }
  if (order.status === "已报价") {
    buttons.push(`<button class="action-button" type="button" data-order-action="confirm" data-id="${order.id}"><i data-lucide="calendar-check"></i>确认预约</button>`);
  }
  if (order.status === "待服务") {
    buttons.push(`<button class="action-button" type="button" data-order-action="start" data-id="${order.id}"><i data-lucide="play-circle"></i>开始服务</button>`);
  }
  if (order.status === "服务中") {
    buttons.push(`<button class="action-button" type="button" data-order-action="complete" data-id="${order.id}"><i data-lucide="upload-cloud"></i>完成上报</button>`);
  }
  return buttons.join("");
}

function renderOrders(data) {
  const orders = data.orders;
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">预约</p>
          <h2>商户订单</h2>
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
            <div class="record-actions">
              ${renderOrderActions(order)}
            </div>
          </article>
        `).join("") : emptyState("暂无商户订单")}
      </div>
    </section>
  `;
}

function renderServices(data) {
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">服务</p>
            <h2>项目管理</h2>
          </div>
        </div>
        <div class="record-list">
          ${data.services.map((service) => `
            <article class="record">
              <div class="record-head">
                <div>
                  <h3>${escapeHtml(service.title)}</h3>
                  <p>${escapeHtml(service.category)} · ${money(service.price)} / ${escapeHtml(service.unit)}</p>
                </div>
                ${badge(service.status)}
              </div>
              <p>${escapeHtml(service.description)}</p>
            </article>
          `).join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">新增</p>
            <h2>提交服务审核</h2>
          </div>
        </div>
        <form class="form-grid" data-form="service">
          <label class="field">
            <span>名称</span>
            <input name="title" value="康复训练陪护" />
          </label>
          <label class="field">
            <span>分类</span>
            <select name="category">
              <option>康养护理</option>
              <option>医疗卫生</option>
              <option>生活照护</option>
            </select>
          </label>
          <label class="field">
            <span>价格</span>
            <input name="price" type="number" min="1" value="299" />
          </label>
          <label class="field">
            <span>单位</span>
            <input name="unit" value="次" />
          </label>
          <label class="field full">
            <span>说明</span>
            <textarea name="description">康复师上门评估并提供训练陪护记录。</textarea>
          </label>
          <button class="action-button" type="submit"><i data-lucide="package-plus"></i>提交</button>
        </form>
      </article>
    </section>
  `;
}

function renderMessages(data) {
  return `
    <section class="content-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">结算</p>
            <h2>账户概览</h2>
          </div>
          ${badge(data.merchant.status)}
        </div>
        <div class="record-list">
          <article class="record">
            <div class="record-head">
              <h3>待结算金额</h3>
              <strong>${money(data.stats.settlementPending)}</strong>
            </div>
            <p>${escapeHtml(data.merchant.license)} · ${escapeHtml(data.merchant.contact)}</p>
          </article>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">消息</p>
            <h2>平台通知</h2>
          </div>
        </div>
        <div class="record-list">
          ${data.messages.length ? data.messages.map((message) => `
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
      </article>
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
    ${state.tab === "orders" ? renderOrders(data) : ""}
    ${state.tab === "services" ? renderServices(data) : ""}
    ${state.tab === "messages" ? renderMessages(data) : ""}
  `;
  icons();
}

async function load() {
  await api.ensureAuth("merchant");
  const [dashboard, statsPayload] = await Promise.all([
    api.merchantDashboard(),
    api.merchantStats(),
  ]);
  state.dashboard = {
    ...dashboard,
    merchant: { ...dashboard.merchant, ...(statsPayload.provider || {}) },
    stats: statsPayload.stats || dashboard.stats,
  };
  render();
}

document.addEventListener("click", async (event) => {
  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    state.tab = tabButton.dataset.tab;
    render();
    return;
  }

  const button = event.target.closest("[data-action], [data-order-action]");
  if (!button) return;
  bindBusy(button, true);
  try {
    if (button.dataset.orderAction === "quote") {
      await api.merchantOrderAction(button.dataset.id, "quote", {
        amount: 280,
        plan: "上门评估 + 康复建议 + 复诊提醒",
      });
      notify("报价已提交", "success");
    }
    if (button.dataset.orderAction === "confirm") {
      await api.merchantOrderAction(button.dataset.id, "confirm", {});
      notify("预约已确认", "success");
    }
    if (button.dataset.orderAction === "start") {
      await api.merchantOrderAction(button.dataset.id, "start", {});
      notify("服务已开始", "success");
    }
    if (button.dataset.orderAction === "complete") {
      await api.merchantOrderAction(button.dataset.id, "complete", {});
      notify("完成记录已提交", "success");
    }
    await load();
  } catch (error) {
    notify(error.message, "error");
  } finally {
    bindBusy(button, false);
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!form.matches("[data-form='service']")) return;
  event.preventDefault();
  const button = $("button[type='submit']", form);
  bindBusy(button, true);
  try {
    const data = new FormData(form);
    await api.createMerchantService({
      title: data.get("title"),
      category: data.get("category"),
      price: Number(data.get("price")),
      unit: data.get("unit"),
      description: data.get("description"),
    });
    notify("服务已提交审核", "success");
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
