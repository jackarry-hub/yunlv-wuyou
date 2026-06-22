(function () {
  const sessions = new Map();
  const authRequests = new Map();
  const roleByPath = {
    "/user/": "elder",
    "/guide/": "guide",
    "/merchant/": "merchant",
    "/admin/": "admin",
  };
  const guideRequirementFallback = [
    { category: "陪伴就医", description: "挂号取号、陪同就诊、检查缴费、取药等", orderFields: ["服务时间", "医院", "老人信息", "备注"], priority: "P0", defaultAmount: 120, fieldSpecs: [{ key: "serviceTime", label: "服务时间" }, { key: "hospital", label: "医院" }, { key: "elderInfo", label: "老人信息" }, { key: "remark", label: "备注" }] },
    { category: "导游游览", description: "景点讲解、路线规划、拍照陪同、行程安排", orderFields: ["目的地", "时间", "人数", "交通需求"], priority: "P0", defaultAmount: 120, fieldSpecs: [{ key: "destination", label: "目的地" }, { key: "appointmentTime", label: "时间" }, { key: "peopleCount", label: "人数" }, { key: "transportNeed", label: "交通需求" }] },
    { category: "护工护理", description: "日常照护、康复协助、陪伴护理、生活照料", orderFields: ["护理时长", "护理要求", "健康备注"], priority: "P0", defaultAmount: 130, fieldSpecs: [{ key: "careDuration", label: "护理时长" }, { key: "careRequirement", label: "护理要求" }, { key: "healthNote", label: "健康备注" }] },
    { category: "接送出行", description: "机场/高铁站接送、日常出行、代驾陪同", orderFields: ["起点", "终点", "时间", "人数"], priority: "P1", defaultAmount: 120, fieldSpecs: [{ key: "startPoint", label: "起点" }, { key: "endPoint", label: "终点" }, { key: "appointmentTime", label: "时间" }, { key: "peopleCount", label: "人数" }] },
    { category: "帮办代办", description: "证件办理、业务代办、生活缴费、快递代取", orderFields: ["代办事项", "材料", "时间"], priority: "P1", defaultAmount: 90, fieldSpecs: [{ key: "agencyItem", label: "代办事项" }, { key: "materials", label: "材料" }, { key: "appointmentTime", label: "时间" }] },
    { category: "生活陪伴", description: "聊天解闷、散步购物、棋牌娱乐、情感陪伴", orderFields: ["服务地点", "时长", "需求说明"], priority: "P1", defaultAmount: 80, fieldSpecs: [{ key: "serviceLocation", label: "服务地点" }, { key: "duration", label: "时长" }, { key: "requirementNote", label: "需求说明" }] },
  ];
  let guideRequirementCache = guideRequirementFallback;

  const defaultRemoteApiBase = "https://yunlv-wuyou-mvp.onrender.com";

  function apiBase() {
    const explicit = window.YUNLV_API_BASE || window.localStorage?.getItem?.("YUNLV_API_BASE") || "";
    if (explicit) return explicit.replace(/\/$/, "");
    return location.hostname.endsWith("github.io") ? defaultRemoteApiBase : "";
  }

  function apiUrl(path) {
    if (/^https?:\/\//.test(path)) return path;
    const base = apiBase();
    return base ? `${base}${path.startsWith("/") ? path : `/${path}`}` : path;
  }

  function detectRole() {
    const path = location.pathname;
    const match = Object.entries(roleByPath).find(([prefix]) => path.startsWith(prefix));
    return match ? match[1] : "elder";
  }

  function normalizeRole(role) {
    if (role === "user") return "elder";
    return role || detectRole();
  }

  function messageRole(role) {
    return normalizeRole(role) === "elder" ? "user" : normalizeRole(role);
  }

  async function request(path, options = {}, role = detectRole()) {
    const normalizedRole = normalizeRole(role);
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    let activeToken = "";
    if (options.auth !== false) {
      const session = await ensureAuth(normalizedRole);
      activeToken = session.token;
      headers.Authorization = `Bearer ${activeToken}`;
    }
    const init = {
      method: options.method || "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    };
    let response = await fetch(apiUrl(path), init);
    if (response.status === 401 && options.auth !== false) {
      if (sessions.get(normalizedRole)?.token === activeToken) sessions.delete(normalizedRole);
      const refreshedSession = await ensureAuth(normalizedRole);
      headers.Authorization = `Bearer ${refreshedSession.token}`;
      response = await fetch(apiUrl(path), init);
    }
    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.error?.message || "服务请求失败，请稍后重试");
    }
    return payload.data;
  }

  async function ensureAuth(role = detectRole()) {
    const normalizedRole = normalizeRole(role);
    const cached = sessions.get(normalizedRole);
    if (cached?.token) return cached;
    const inflight = authRequests.get(normalizedRole);
    if (inflight) return inflight;
    const loginRequest = (async () => {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ role: normalizedRole }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error?.message || "登录失败");
      sessions.set(normalizedRole, payload.data);
      return payload.data;
    })();
    authRequests.set(normalizedRole, loginRequest);
    try {
      return await loginRequest;
    } finally {
      if (authRequests.get(normalizedRole) === loginRequest) authRequests.delete(normalizedRole);
    }
  }

  function textOf(node) {
    return (node?.getAttribute?.("aria-label") || node?.textContent || "").trim().replace(/\s+/g, " ");
  }

  function routeOf(ctx) {
    if (ctx?.route) return ctx.route;
    return location.hash.replace(/^#/, "") || "home";
  }

  function setBusy(button, busy) {
    if (!button) return;
    button.disabled = busy;
    button.classList.toggle("is-busy", busy);
  }

  function writeStatus(ctx, text) {
    if (!text) return;
    if (typeof ctx?.writeActionStatus === "function") {
      ctx.writeActionStatus(ctx.button || document.body, text);
      return;
    }
    const root = ctx?.button?.closest?.(".card, .section, article, .content, .phone-content, #app, #phone") || document.body;
    let node = root.querySelector?.("[data-action-status]");
    if (!node) {
      node = document.createElement("p");
      node.className = "action-status";
      node.dataset.actionStatus = "";
      root.appendChild(node);
    }
    node.textContent = text;
  }

  function notify(ctx, text, tone = "success") {
    if (!text) return;
    if (typeof ctx?.writeActionStatus === "function" || ctx?.button) {
      writeStatus(ctx, text);
      return;
    }
    const root = document.querySelector("#phone, #app, body") || document.body;
    let node = root.querySelector?.("[data-action-status]");
    if (!node) {
      node = document.createElement("p");
      node.className = "action-status";
      node.dataset.actionStatus = "";
      root.appendChild(node);
    }
    node.textContent = text;
  }

  function serviceTypeForAction(action) {
    if (/陪伴就医|陪诊|就医|挂号|医院|取药/.test(action)) return { serviceType: "陪伴就医", providerType: "guide", amount: 120 };
    if (/导游|游览|景点|讲解|路线|行程/.test(action)) return { serviceType: "导游游览", providerType: "guide", amount: 120 };
    if (/护工护理|日常照护|陪伴护理|生活照料/.test(action)) return { serviceType: "护工护理", providerType: "guide", amount: 130 };
    if (/接送出行|接送|交通|用车|代驾/.test(action)) return { serviceType: "接送出行", providerType: "guide", amount: 120 };
    if (/帮办|代办|缴费|快递代取|证件办理/.test(action)) return { serviceType: "帮办代办", providerType: "guide", amount: 90 };
    if (/生活陪伴|聊天|散步|棋牌|情感陪伴/.test(action)) return { serviceType: "生活陪伴", providerType: "guide", amount: 80 };
    if (/社群|交流|动态|发布/.test(action)) return { serviceType: "社群活动协助", providerType: "guide", amount: 0 };
    if (/打卡|旅拍|拍照/.test(action)) return { serviceType: "旅居打卡陪同", providerType: "guide", amount: 80 };
    if (/商城|购物|商品|加入购物车|结算/.test(action)) return { serviceType: "商城代购与配送", providerType: "merchant", amount: 99 };
    if (/体检/.test(action)) return { serviceType: "体检预约", providerType: "merchant", amount: 698 };
    if (/护理|康复|健康|餐厅|美食/.test(action)) return { serviceType: action.replace(/^预约/, "") || "康养服务", providerType: "merchant", amount: 260 };
    if (/用车|接送|交通|导航/.test(action)) return { serviceType: "交通接送", providerType: "guide", amount: 120 };
    if (/求助|志愿/.test(action)) return { serviceType: "志愿协助", providerType: "guide", amount: 0 };
    return { serviceType: action.replace(/^预约/, "") || "陪伴服务", providerType: "guide", amount: 120 };
  }

  async function recordAction(ctx, extra = {}) {
    const role = normalizeRole(ctx.role);
    return request("/api/ui/actions", {
      method: "POST",
      body: {
        role: messageRole(role),
        route: routeOf(ctx),
        action: ctx.actionName || textOf(ctx.button) || "操作",
        target: extra.target || "",
        payload: extra.payload || {},
      },
    }, role);
  }

  async function createServiceOrder(ctx, actionName) {
    const role = normalizeRole(ctx.role);
    const service = serviceTypeForAction(actionName);
    const order = await request("/api/orders", {
      method: "POST",
      body: {
        ...service,
        source: role === "merchant" ? "商户端" : "用户端",
        note: `${routeOf(ctx)} 页面触发：${actionName}`,
      },
    }, "elder");
    writeStatus(ctx, `订单 ${order.orderNo} 已创建，状态：${order.status}`);
    return order;
  }

  async function createServiceRequest(ctx, actionName) {
    const role = normalizeRole(ctx.role);
    const service = serviceTypeForAction(actionName);
    const requestItem = await request("/api/service-requests", {
      method: "POST",
      body: {
        role: messageRole(role),
        route: routeOf(ctx),
        action: actionName,
        type: service.serviceType,
        providerType: service.providerType,
        priority: "P1",
        description: `${routeOf(ctx)} 页面触发：${actionName}`,
        payload: { amount: service.amount, source: "用户端高频入口" },
      },
    }, role);
    writeStatus(ctx, `请求 ${requestItem.requestNo} 已提交后台，状态：${requestItem.status}`);
    return requestItem;
  }

  function shouldCaptureUserBusinessAction(button, route, actionName) {
    if (detectRole() !== "elder") return false;
    if (button.closest("[data-back]")) return false;
    if (button.closest("[data-yunlv-live]")) return false;
    if (button.closest("[data-local-action='true']")) return false;
    if (route === "transport" && /^(交换起终点|规划路线|开始导航|查看周边|更多路线)$/.test(actionName)) return false;
    if (route === "shop" && /^(加入购物车|checkout|去结算|结算)$/.test(actionName)) return false;
    const routeNeedsRequest = ["community", "checkin", "food", "transport", "shop", "volunteer", "service-records", "health-services", "policies", "policy-detail"].includes(route);
    if (!routeNeedsRequest) return false;
    return /发动态|发布|加入|报名|打卡|预约|餐厅|点餐|配送|导航|规划|联系|接送|用车|购物|加入购物车|结算|志愿|申请|求助|服务|咨询/.test(actionName);
  }

  function actionNameFromButton(button) {
    return button?.dataset?.action
      || button?.dataset?.yunlvAction
      || button?.dataset?.addCart
      || textOf(button)
      || "业务操作";
  }

  function shouldMirrorFrontendAction(button, actionName) {
    if (!button || button.dataset.adminMirror === "off") return false;
    if (button.closest("[data-back], [data-no-admin-mirror]")) return false;
    if (button.closest('button[aria-label="返回"], .screen-rail, #screenNav, #mobileSwitcher')) return false;
    if (/^(返回|收起|展开|关闭|取消弹窗|refresh-live)$/.test(actionName)) return false;
    if (!actionName || actionName.length > 80) return false;
    return Boolean(button.matches("[data-action], [data-yunlv-action], [data-add-cart]"));
  }

  function isLocalUiOnlyAction(button, actionName) {
    const text = String(actionName || textOf(button) || "").trim();
    if (!button || button.dataset?.yunlvAction) return false;
    if (button.dataset?.localAction === "true") return true;
    if (/^(选择|筛选|搜索|切换|显示|隐藏|开启|关闭)/.test(text)) return true;
    if (/^(上传|添加照片|添加介绍图片|添加附件|添加凭证|添加时段|添加特殊日期|添加节假日)$/.test(text)) return true;
    const localGroup = button.closest?.([
      ".chips",
      ".segmented",
      ".tabs",
      ".selector-grid",
      ".ref-filter-tabs",
      ".ref-record-tabs",
      ".ref-order-tabs",
      ".merchant-exception-type-grid",
      ".merchant-exception-method",
      ".merchant-type-pills",
      ".withdraw-presets",
      ".ticket-type-grid",
      ".guide-exception-types",
      ".guide-area-radius-tabs",
      ".guide-area-list",
      ".guide-service-type-list",
      ".guide-date-strip"
    ].join(", "));
    return Boolean(localGroup && /选择|筛选|搜索|切换|状态|类型|日期|时段|全部/.test(text));
  }

  function mirrorFrontendAction(button) {
    const actionName = actionNameFromButton(button);
    if (!shouldMirrorFrontendAction(button, actionName)) return;
    const route = currentRoute();
    const role = detectRole();
    const target = button.dataset.route || button.dataset.open || button.dataset.screen || button.dataset.href || "";
    recordAction({
      role,
      route,
      actionName,
      button,
    }, {
      target,
      payload: {
        source: "frontend-global-click",
        control: button.tagName?.toLowerCase?.() || "button",
      },
    }).catch(() => {});
  }

  async function joinDefaultActivity(ctx) {
    const result = await request("/api/activities/activity-001/join", { method: "POST", body: {} }, "elder");
    const title = result.activity?.title || "活动";
    writeStatus(ctx, result.duplicate ? `您已报名「${title}」` : `已报名「${title}」`);
    return result;
  }

  async function triggerSos(ctx, extraBody = {}) {
    const alert = await request("/api/alerts/sos", {
      method: "POST",
      body: {
        location: "当前定位位置",
        accuracy: 35,
        description: "用户端一键紧急求助触发。",
        ...extraBody,
      },
    }, "elder");
    writeStatus(ctx, `SOS 已生成，后台告警编号：${alert.id}`);
    return alert;
  }

  function liveEmergencyLocationFromButton(button) {
    let coordinates = undefined;
    if (button?.dataset?.lng && button?.dataset?.lat) {
      coordinates = { lng: Number(button.dataset.lng), lat: Number(button.dataset.lat) };
    }
    return {
      location: button?.dataset?.location || "当前定位位置",
      accuracy: Number(button?.dataset?.accuracy || 35),
      coordinates,
      locationSource: button?.dataset?.locationSource || "页面定位",
    };
  }

  function quickHelpChannelFromAction(actionName = "") {
    if (/救护|120/.test(actionName)) return "ambulance";
    if (/报警|公安|110/.test(actionName)) return "police";
    if (/医院|就医/.test(actionName)) return "hospital";
    if (/向导/.test(actionName)) return "guide";
    return "customerService";
  }

  async function createQuickEmergencyHelp(ctx, actionName, extraBody = {}) {
    const requestItem = await request("/api/alerts/quick-help", {
      method: "POST",
      body: {
        channelKey: quickHelpChannelFromAction(actionName),
        title: actionName,
        description: `${routeOf(ctx)} 页面触发：${actionName}`,
        ...extraBody,
      },
    }, "elder");
    const dialText = requestItem.dialNumber ? `，可拨打 ${requestItem.dialNumber}` : "";
    writeStatus(ctx, `快速求助 ${requestItem.requestNo} 已生成${dialText}`);
    return requestItem;
  }

  async function confirmAndTriggerSos(ctx, extraBody = {}) {
    const button = ctx.button;
    if (button && button.dataset.sosConfirmed !== "true") {
      button.dataset.sosConfirmed = "true";
      writeStatus(ctx, "请再次点击确认触发 SOS，系统会通知后台和紧急联系人");
      window.setTimeout(() => {
        if (button.dataset.sosConfirmed === "true") delete button.dataset.sosConfirmed;
      }, 8000);
      return null;
    }
    if (button) delete button.dataset.sosConfirmed;
    return triggerSos(ctx, {
      description: "用户端二次确认后触发一键 SOS，请后台立即处理。",
      doubleConfirmed: true,
      ...extraBody,
    });
  }

  async function claimGuideTask(ctx) {
    const result = await request("/api/guide/tasks/claim-next", { method: "POST", body: { guideId: "guide-001" } }, "guide");
    writeStatus(ctx, `已接单 ${result.order.orderNo}，当前状态：${result.task.status}`);
    return result;
  }

  async function advanceGuideTask(ctx, actionName) {
    const dashboard = await request("/api/guide/dashboard", {}, "guide");
    const active = dashboard.tasks.find((item) => item.status === "服务中")
      || dashboard.tasks.find((item) => item.status === "已接单")
      || dashboard.tasks.find((item) => item.status === "待接单");
    if (!active) {
      await recordAction(ctx);
      writeStatus(ctx, "暂无可流转任务，操作已记录到后台");
      return null;
    }
    let result = null;
    if (/接单/.test(actionName) && active.status === "待接单") {
      result = await request(`/api/tasks/${active.id}/accept`, { method: "POST", body: {} }, "guide");
    } else if (/开始|导航|到达/.test(actionName)) {
      if (active.status === "待接单") await request(`/api/tasks/${active.id}/accept`, { method: "POST", body: {} }, "guide");
      result = await request(`/api/tasks/${active.id}/start`, { method: "POST", body: {} }, "guide");
    } else if (/完成|提交完成|上报/.test(actionName)) {
      if (active.status === "待接单") await request(`/api/tasks/${active.id}/accept`, { method: "POST", body: {} }, "guide");
      if (active.status !== "服务中") await request(`/api/tasks/${active.id}/start`, { method: "POST", body: {} }, "guide");
      result = await request(`/api/tasks/${active.id}/complete`, { method: "POST", body: { evidence: actionName } }, "guide");
    }
    if (result) writeStatus(ctx, `任务 ${result.task.taskNo} 已流转为：${result.task.status}`);
    return result;
  }

  async function guideTaskDecision(ctx, actionName) {
    const dashboard = await request("/api/guide/dashboard", {}, "guide");
    const tasks = dashboard.tasks || [];
    let task = null;
    let action = "cancel";
    if (/拒绝/.test(actionName)) {
      action = "decline";
      task = tasks.find((item) => item.status === "待接单");
    } else if (/忽略/.test(actionName)) {
      action = "ignore";
      task = tasks.find((item) => item.status === "待接单");
    } else {
      task = tasks.find((item) => item.status === "已接单") || tasks.find((item) => item.status === "服务中");
    }
    if (!task) {
      await recordAction(ctx);
      writeStatus(ctx, "暂无可处理任务，操作已记录到后台");
      return null;
    }
    const result = await request(`/api/guide/tasks/${task.id}/${action}`, {
      method: "POST",
      body: { reason: actionName || "向导端操作" },
    }, "guide");
    const statusText = action === "ignore" ? "已忽略" : result.task.status;
    writeStatus(ctx, `任务 ${result.task.taskNo} ${statusText}，订单状态：${result.order?.status || "-"}`);
    return result;
  }

  async function reportGuideException(ctx, actionName) {
    const dashboard = await request("/api/guide/dashboard", {}, "guide");
    const task = (dashboard.tasks || []).find((item) => !["已完成", "已取消"].includes(item.status));
    if (!task) {
      await recordAction(ctx);
      writeStatus(ctx, "上报成功");
      return null;
    }
    const result = await request("/api/guide/exception", {
      method: "POST",
      body: { taskId: task.id, type: "服务异常", description: `向导端上报：${actionName || "服务异常"}` },
    }, "guide");
    writeStatus(ctx, "上报成功");
    return result;
  }

  async function advanceMerchantOrder(ctx, actionName) {
    const dashboard = await request("/api/merchant/dashboard", {}, "merchant");
    const orders = dashboard.orders || [];
    let action = "confirm";
    let order = null;
    if (/报价/.test(actionName)) {
      action = "quote";
      order = orders.find((item) => ["待派单", "已派单"].includes(item.status));
    } else if (/开始/.test(actionName)) {
      action = "start";
      order = orders.find((item) => item.status === "待服务");
    } else if (/完成|提交完成/.test(actionName)) {
      action = "complete";
      order = orders.find((item) => item.status === "服务中");
    } else {
      order = orders.find((item) => ["待派单", "已派单", "已报价"].includes(item.status));
    }
    if (!order) {
      await recordAction(ctx);
      writeStatus(ctx, "暂无可处理订单，操作已记录到后台");
      return null;
    }
    const result = await request(`/api/merchant/orders/${order.id}/${action}`, {
      method: "POST",
      body: { amount: order.amount || 260, plan: "商户端确认方案" },
    }, "merchant");
    writeStatus(ctx, `订单 ${result.orderNo} 已更新为：${result.status}`);
    return result;
  }

  async function adminDispatch(ctx) {
    const result = await request("/api/tasks/dispatch", { method: "POST", body: { assigneeType: "guide", assigneeId: "guide-001" } }, "admin");
    writeStatus(ctx, `已派单 ${result.order.orderNo} -> ${result.task.assigneeName}`);
    return result;
  }

  async function adminHandleAlert(ctx, actionName) {
    const alerts = await request("/api/admin/alerts", {}, "admin");
    const alert = alerts.find((item) => item.status !== "已处理");
    if (!alert) {
      await recordAction(ctx);
      writeStatus(ctx, "暂无待处理异常，操作已记录");
      return null;
    }
    const result = await request(`/api/alerts/${alert.id}/handle`, {
      method: "POST",
      body: { result: `${actionName}：后台已处理并同步相关人员。` },
    }, "admin");
    writeStatus(ctx, `异常 ${result.id} 已处理`);
    return result;
  }

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatAmount(value) {
    return `¥${Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  function messageCategory(message) {
    const text = `${message.title || ""} ${message.content || ""}`;
    if (/订单|服务|接单|评价|报价|预约/.test(text)) return "服务";
    if (/活动|报名|日历/.test(text)) return "活动";
    if (/设备|手环|血压|同步|离线/.test(text)) return "设备";
    return "系统";
  }

  function compactText(value, fallback = "") {
    return escapeHtml(value === undefined || value === null || value === "" ? fallback : value);
  }

  function currentRoute() {
    const route = location.hash.replace(/^#/, "");
    if (route) return route;
    const role = detectRole();
    if (role === "guide") return "14";
    if (role === "merchant") return "24";
    if (role === "admin") return "dashboard";
    return "home";
  }

  function liveRoot(role) {
    if (role === "admin") return document.querySelector(".main .content");
    if (role === "guide") return document.querySelector("#phone .screen-scroll");
    if (role === "merchant") return document.querySelector("#phone .phone-content");
    return document.querySelector("#app .content");
  }

  function liveStatus(status = "") {
    const tone = /待|报价|派单/.test(status) ? "orange" : /服务中|已派单|已接单|待服务/.test(status) ? "blue" : /完成|已确认/.test(status) ? "green" : /取消|异常|驳回/.test(status) ? "red" : "gray";
    return `<span class="yunlv-live-status ${tone}">${escapeHtml(status || "未知")}</span>`;
  }

  function standardizeLiveButtons(root) {
    if (!root?.querySelectorAll) return;
    root.querySelectorAll("button").forEach((button) => {
      if (
        button.dataset.action ||
        button.dataset.route ||
        button.dataset.open ||
        button.dataset.step ||
        button.dataset.go ||
        button.dataset.screen ||
        button.dataset.back ||
        button.dataset.addCart ||
        button.dataset.guideExceptionType !== undefined ||
        button.dataset.guideExceptionSubmit !== undefined ||
        button.dataset.guideExceptionSuccessClose !== undefined ||
        button.dataset.guideSafeExceptionSubmit !== undefined ||
        button.dataset.guideSafetySuccessClose !== undefined ||
        button.dataset.guideCancelReason !== undefined ||
        button.dataset.guideCancelSubmit !== undefined ||
        button.dataset.guideReviewReplySubmit !== undefined ||
        button.type === "submit"
      ) {
        return;
      }
      button.dataset.action = textOf(button) || button.dataset.yunlvAction || "业务操作";
    });
  }

  function shouldShowLiveModules() {
    try {
      return localStorage.getItem("yunlv-show-live-modules") !== "0";
    } catch (_) {
      return true;
    }
  }

  function mountLive(root, key, html, prepend = false) {
    if (!root) return null;
    let node = root.querySelector(`[data-yunlv-live="${key}"]`);
    if (!node) {
      node = document.createElement("section");
      node.className = "yunlv-live-card";
      node.dataset.yunlvLive = key;
      if (prepend && root.firstElementChild) root.insertBefore(node, root.firstElementChild);
      else root.appendChild(node);
    }
    node.innerHTML = html;
    node.hidden = !shouldShowLiveModules();
    node.setAttribute("aria-hidden", node.hidden ? "true" : "false");
    standardizeLiveButtons(node);
    return node;
  }

  function orderMini(order) {
    const timeline = Array.isArray(order.timeline) ? order.timeline.slice(0, 3) : [];
    return `
      <article class="yunlv-live-row">
        <div class="yunlv-live-row-main">
          <header><strong>${escapeHtml(order.serviceType)}</strong>${liveStatus(order.status)}</header>
          <p>${escapeHtml(order.orderNo)} · ${escapeHtml(order.elderName)} · ${escapeHtml(order.time || "")}</p>
          <p>${escapeHtml(order.location || "")}</p>
          ${timeline.length ? `<ol>${timeline.map((item) => `<li><b>${escapeHtml(item.status)}</b><span>${escapeHtml(item.time)} ${escapeHtml(item.text)}</span></li>`).join("")}</ol>` : ""}
        </div>
        <aside><b>${formatAmount(order.amount)}</b><small>${escapeHtml(order.assigneeName || "待分配")}</small></aside>
      </article>
    `;
  }

  function providerOptions(queue, preferredType = "guide") {
    const guides = queue?.candidates?.guides || [];
    const merchants = queue?.candidates?.merchants || [];
    let selected = false;
    const selectAttr = (type) => {
      if (!selected && type === preferredType) {
        selected = true;
        return " selected";
      }
      return "";
    };
    return [
      ...guides.map((item) => `<option value="guide:${escapeHtml(item.id)}"${selectAttr("guide")}>向导 · ${escapeHtml(item.realName)} · ${escapeHtml(item.area || "")}</option>`),
      ...merchants.map((item) => `<option value="merchant:${escapeHtml(item.id)}"${selectAttr("merchant")}>商户 · ${escapeHtml(item.name)} · ${escapeHtml(item.type || "")}</option>`),
    ].join("");
  }

  function dateTimeLocalValue(hoursAhead = 4) {
    const date = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  async function loadGuideRequirements() {
    try {
      const data = await request("/api/guide/order-requirements", {}, "elder");
      guideRequirementCache = Array.isArray(data.categories) && data.categories.length ? data.categories : guideRequirementFallback;
    } catch (error) {
      guideRequirementCache = guideRequirementFallback;
    }
    return guideRequirementCache;
  }

  function guideRequirementFor(category) {
    return guideRequirementCache.find((item) => item.category === category) || guideRequirementCache[0] || guideRequirementFallback[0];
  }

  function guideRequirementOptions(requirements) {
    return requirements.map((item) => `<option value="${escapeHtml(item.category)}" data-amount="${escapeHtml(item.defaultAmount || 120)}">${escapeHtml(item.category)} · ${escapeHtml(item.priority)} · ${escapeHtml((item.orderFields || []).join("、"))}</option>`).join("");
  }

  function guideFieldDefault(field, requirement) {
    if (/时间/.test(field.label)) return dateTimeLocalValue(4);
    if (/医院/.test(field.label)) return "昆明市第一人民医院";
    if (/老人信息/.test(field.label)) return "李秀兰，68岁，高血压，行动稍慢";
    if (/目的地/.test(field.label)) return "翠湖公园";
    if (/人数/.test(field.label)) return "1";
    if (/交通需求/.test(field.label)) return "需要步行少、可临时打车";
    if (/护理时长|时长/.test(field.label)) return "2小时";
    if (/护理要求/.test(field.label)) return "日常照护、康复协助";
    if (/健康备注/.test(field.label)) return "高血压，避免长时间站立";
    if (/起点/.test(field.label)) return "昆明市五华区翠湖康养公寓";
    if (/终点/.test(field.label)) return "昆明站";
    if (/代办事项/.test(field.label)) return "生活缴费与快递代取";
    if (/材料/.test(field.label)) return "身份证复印件、缴费单";
    if (/服务地点/.test(field.label)) return "翠湖康养公寓活动室";
    if (/需求说明|备注/.test(field.label)) return requirement.description;
    return "";
  }

  function guideFieldInputs(category) {
    const requirement = guideRequirementFor(category);
    const fields = requirement.fieldSpecs || [];
    return `
      <div class="yunlv-live-requirement-note">
        <strong>${escapeHtml(requirement.category)} · ${escapeHtml(requirement.priority)}</strong>
        <span>${escapeHtml(requirement.description)}</span>
        <em>订单字段：${escapeHtml((requirement.orderFields || []).join("、"))}</em>
      </div>
      ${fields.map((field) => {
        const type = /时间/.test(field.label) ? "datetime-local" : "text";
        return `<label>${escapeHtml(field.label)}<input name="${escapeHtml(field.key)}" type="${type}" value="${escapeHtml(guideFieldDefault(field, requirement))}" required /></label>`;
      }).join("")}
    `;
  }

  function updateGuideOrderFieldInputs(form) {
    const select = form?.querySelector?.('[name="serviceType"]');
    const target = form?.querySelector?.("[data-guide-order-fields]");
    if (!select || !target) return;
    target.innerHTML = guideFieldInputs(select.value);
  }

  async function renderUserOrderForm(root, force = false) {
    const key = "user-order-form";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const requirements = await loadGuideRequirements();
    const defaultRequirement = requirements[0] || guideRequirementFallback[0];
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>真实统一下单表单</h2><p>提交后写入订单库，后台待派单、向导/商户任务列表会同步出现。</p></div>
        <span>API</span>
      </header>
      <form class="yunlv-live-form" data-yunlv-form="order">
        <label>服务对象<input name="elderName" value="李秀兰" /></label>
        <label>服务类型<select name="serviceType" data-guide-service-select>${guideRequirementOptions(requirements)}</select></label>
        <label>执行类型<select name="providerType">
          <option value="guide">人工向导</option>
        </select></label>
        <label>预约时间<input name="time" type="datetime-local" value="${dateTimeLocalValue(4)}" required /></label>
        <label class="wide">服务地点<input name="location" value="昆明市五华区翠湖康养公寓" /></label>
        <label class="wide">需求备注<textarea name="note">请协助老人完成服务，全程同步家属。</textarea></label>
        <div class="wide yunlv-live-field-grid" data-guide-order-fields>${guideFieldInputs(defaultRequirement.category)}</div>
        <button class="yunlv-live-primary wide" type="submit">提交订单</button>
        <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
      </form>
    `, true);
  }

  async function renderUserOrders(root, force = false) {
    const key = "user-orders";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const orders = await request("/api/orders", {}, "elder");
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>订单状态追踪</h2><p>这里展示平台订单状态。</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <div class="yunlv-live-list">
        ${orders.map((order) => `
          <div class="yunlv-live-order">
            ${orderMini(order)}
            <div class="yunlv-live-actions">
              <button type="button" data-yunlv-action="select-user-order" data-order-id="${escapeHtml(order.id)}">查看追踪</button>
              ${order.status === "待确认" ? `<button class="yunlv-live-primary" type="button" data-yunlv-action="quick-confirm-order" data-order-id="${escapeHtml(order.id)}">确认并评价</button>` : ""}
              ${["待派单", "已派单", "已报价", "待服务"].includes(order.status) ? `<button type="button" data-yunlv-action="cancel-order" data-order-id="${escapeHtml(order.id)}">取消订单</button>` : ""}
            </div>
          </div>
        `).join("") || `<p class="yunlv-live-empty">暂无订单，请先提交统一下单表单。</p>`}
      </div>
    `);
  }

  async function renderUserTracking(root, force = false) {
    const key = "user-order-tracking";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const orders = await request("/api/orders", {}, "elder");
    const selected = localStorage.getItem("yunlv-selected-order");
    const order = orders.find((item) => item.id === selected || item.orderNo === selected)
      || orders.find((item) => item.status !== "已完成" && item.status !== "已取消")
      || orders[0];
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>订单追踪</h2><p>${order ? `${escapeHtml(order.orderNo)} · ${escapeHtml(order.serviceType)}` : "暂无可追踪订单"}</p></div>
        ${order ? liveStatus(order.status) : ""}
      </header>
      ${order ? `
        ${orderMini(order)}
        <div class="yunlv-live-timeline">
          ${(order.timeline || []).map((item) => `<div><i></i><b>${escapeHtml(item.status)}</b><span>${escapeHtml(item.time)} · ${escapeHtml(item.text)}</span></div>`).join("")}
        </div>
        <div class="yunlv-live-actions">
          ${order.status === "待确认" ? `<button class="yunlv-live-primary" type="button" data-yunlv-action="quick-confirm-order" data-order-id="${escapeHtml(order.id)}">确认完成并评价</button>` : ""}
          ${["待派单", "已派单", "已报价", "待服务"].includes(order.status) ? `<button type="button" data-yunlv-action="cancel-order" data-order-id="${escapeHtml(order.id)}">取消订单</button>` : ""}
        </div>
      ` : `<p class="yunlv-live-empty">暂无订单。</p>`}
    `, true);
  }

  async function renderUserReview(root, force = false) {
    const key = "user-review";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const orders = await request("/api/orders", {}, "elder");
    const confirmable = orders.filter((item) => item.status === "待确认");
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>真实确认评价</h2><p>确认后订单变为已完成，并写入评价库。</p></div>
      </header>
      <form class="yunlv-live-form" data-yunlv-form="review">
        <label class="wide">待确认订单<select name="orderId">
          ${confirmable.map((order) => `<option value="${escapeHtml(order.id)}">${escapeHtml(order.orderNo)} · ${escapeHtml(order.serviceType)} · ${escapeHtml(order.assigneeName || "执行方")}</option>`).join("")}
        </select></label>
        <label>评分<select name="rating"><option value="5">5 分</option><option value="4">4 分</option><option value="3">3 分</option></select></label>
        <label class="wide">评价内容<textarea name="review">服务及时细致，已确认完成。</textarea></label>
        <button class="yunlv-live-primary wide" type="submit" ${confirmable.length ? "" : "disabled"}>提交确认评价</button>
        <p class="yunlv-live-inline-status" data-yunlv-inline-status>${confirmable.length ? "" : "暂无待确认订单，可先让向导/商户完成服务。"}</p>
      </form>
    `, true);
  }

  async function renderUserLoginLive(root, force = false) {
    const key = "user-login";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const session = await ensureAuth("elder");
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>真实登录会话</h2><p>${compactText(session.user?.nickname)} · ${compactText(session.user?.phone)} · 权限 ${session.permissions?.length || 0} 项</p></div>
        <button class="yunlv-live-primary" type="button" data-yunlv-action="user-login-demo">刷新登录</button>
      </header>
      <p class="yunlv-live-inline-status">当前用户已通过本地鉴权进入真实业务 API，订单、消息、健康、活动数据会按用户身份写入。</p>
    `, true);
  }

  async function hydrateUserHomeRequirements(force = false) {
    if (!force && document.documentElement.dataset.yunlvHomeHydrated === "true") return;
    const data = await request("/api/user/home-requirements", {}, "elder");
    document.documentElement.dataset.yunlvHomeHydrated = "true";
    document.documentElement.dataset.yunlvHomeRequirements = data.version || "";
    document.querySelectorAll("[data-current-city]").forEach((node) => {
      node.textContent = data.topArea?.currentCity || node.textContent || "昆明";
    });
    const hero = document.querySelector(".home-hero-wrap img");
    if (hero && data.banner?.image) {
      hero.src = data.banner.image;
      hero.alt = data.banner.title || "旅居生活主题图";
      hero.dataset.bannerTitle = data.banner.title || "";
      hero.dataset.bannerSlogan = data.banner.slogan || "";
    }
    const messageButton = document.querySelector(".appbar.home [data-route='messages']");
    if (messageButton) {
      messageButton.dataset.homeMessageEntry = "true";
      const unread = Number(data.topArea?.messageEntry?.unreadCount || 0);
      let badge = messageButton.querySelector(".yunlv-home-message-badge");
      if (unread > 0) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "yunlv-home-message-badge";
          messageButton.appendChild(badge);
        }
        badge.textContent = unread > 99 ? "99+" : String(unread);
      } else if (badge) {
        badge.remove();
      }
    }
    return data;
  }

  async function hydrateUserFunctionOverview(force = false) {
    if (!force && document.documentElement.dataset.yunlvUserFunctionsHydrated === "true") return;
    const data = await request("/api/user/functions/overview", {}, "elder");
    document.documentElement.dataset.yunlvUserFunctionsHydrated = "true";
    document.documentElement.dataset.yunlvUserFunctions = data.version || "";
    document.documentElement.dataset.yunlvUserFunctionsP0Ready = String(Boolean(data.runtime?.allP0Ready));
    document.documentElement.dataset.yunlvUserFunctionsCount = String(data.moduleCount || 0);
    return data;
  }

  async function renderUserAiLive(root, force = false) {
    const key = "user-ai";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const requirements = await request("/api/ai/steward-requirements", {}, "elder");
    const records = await request("/api/ai/service-records", {}, "elder");
    const history = records.conversations || [];
    const quickItems = requirements.quickQuestions || [];
    const recommendationItems = requirements.serviceRecommendation?.sample || [];
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>AI 智能管家</h2><p>可以咨询旅居地、活动、出行、健康提醒和服务预约，小云会结合当前数据给出建议。</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <p class="yunlv-live-inline-status" data-yunlv-inline-status>响应要求：${requirements.runtime?.maxResponseMs || 5000}ms 内 · 友好语气 · 最近对话 ${records.summary?.totalConversations || 0} 条</p>
      <div class="yunlv-live-chip-row">
        ${(requirements.requirements || []).map((item) => `<span class="yunlv-live-requirement-chip">${compactText(item.feature)} · ${compactText(item.priority)}</span>`).join("")}
      </div>
      <div class="yunlv-live-summary-grid">
        <article><span>支持主题</span><strong>${(requirements.runtime?.supportedTopics || []).slice(0, 4).join(" / ")}</strong><small>${(requirements.runtime?.supportedTopics || []).slice(4).join(" / ")}</small></article>
        <article><span>语音互动</span><strong>${compactText(requirements.voiceInteraction?.mode || "模拟语音识别")}</strong><small>识别后自动进入 AI 对话</small></article>
        <article><span>服务记录</span><strong>${records.summary?.totalConversations || 0} 条</strong><small>语音 ${records.summary?.voiceRecords || 0} · 快捷 ${records.summary?.quickQuestionRecords || 0}</small></article>
      </div>
      <form class="yunlv-live-form" data-yunlv-form="ai">
        <label class="wide">向 AI 管家提问<textarea name="question">今天弥勒天气适合参加户外活动吗？</textarea></label>
        <button class="yunlv-live-primary wide" type="submit">发送给 AI 管家</button>
        <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
      </form>
      <h3 class="yunlv-live-section-title">快捷问题</h3>
      <div class="yunlv-live-chip-row">
        ${quickItems.map((item) => `<button type="button" data-yunlv-action="ai-quick-question" data-question-id="${compactText(item.id)}">${compactText(item.title)}</button>`).join("")}
      </div>
      <h3 class="yunlv-live-section-title">语音互动</h3>
      <div class="yunlv-live-actions">
        ${(requirements.voiceInteraction?.samples || []).map((item) => `<button type="button" data-yunlv-action="ai-voice-transcribe" data-sample-key="${compactText(item.key)}">${compactText(item.label)}</button>`).join("")}
      </div>
      <h3 class="yunlv-live-section-title">推荐服务入口</h3>
      <div class="yunlv-live-list">
        ${recommendationItems.map((item) => `
          <article class="yunlv-live-mini-row">
            <span>${compactText(item.title)} · ${compactText(item.description)}</span>
            <button type="button" data-yunlv-action="ai-service-entry" data-title="${compactText(item.title)}" data-type="${compactText(item.type)}" data-route="${compactText(item.route)}" data-request-type="${compactText(item.requestType || item.title)}">进入服务</button>
          </article>
        `).join("") || `<p class="yunlv-live-empty">暂无推荐服务。</p>`}
      </div>
      <h3 class="yunlv-live-section-title">最近对话</h3>
      <div class="yunlv-live-list" style="margin-top:10px">
        ${history.slice(0, 5).map((item) => `
          <article class="yunlv-live-order">
            <p><b>问：</b>${compactText(item.question)}</p>
            <p><b>答：</b>${compactText(item.answer)}</p>
            ${(item.recommendations || []).length ? `<div class="yunlv-live-actions">${item.recommendations.map((recommendation) => `<button type="button" data-yunlv-action="ai-service-entry" data-title="${compactText(recommendation.title)}" data-type="${compactText(recommendation.type)}" data-route="${compactText(recommendation.route)}" data-request-type="${compactText(recommendation.requestType || recommendation.title)}">${compactText(recommendation.title)}</button>`).join("")}</div>` : ""}
            <p class="yunlv-live-meta">${compactText(item.intent)} · ${item.responseTimeMs || 0}ms · ${compactText(item.source || "text")} · ${compactText(item.createdAt)}</p>
          </article>
        `).join("") || `<p class="yunlv-live-empty">暂无问答记录。</p>`}
      </div>
    `, true);
  }

  async function renderUserActivityLive(root, force = false) {
    const key = "user-activity-map";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const requirements = await request("/api/activities/map-requirements", {}, "elder");
    const activeFilter = localStorage.getItem("yunlv-activity-filter") || "全部";
    const categories = requirements.categories || [];
    const points = requirements.points || [];
    const visible = activeFilter === "全部" ? points : points.filter((item) => item.category === activeFilter);
    const selectedActivity = visible[0] || points[0] || {};
    const selectedSignup = requirements.signup?.userSignups?.find((item) => item.activityId === selectedActivity.id);
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>活动地图</h2><p>查看附近活动位置、分类筛选、活动详情和报名状态，选择适合的活动后可直接报名。</p></div>
        <button type="button" data-yunlv-action="activity-map-refresh">刷新地图</button>
      </header>
      <p class="yunlv-live-inline-status" data-yunlv-inline-status>当前位置：${compactText(requirements.mapDisplay?.currentLocation?.address)} · 活动点 ${requirements.mapDisplay?.pointCount || points.length} 个 · 当前筛选 ${compactText(activeFilter)}</p>
      <div class="yunlv-live-summary-grid">
        <article><span>地图区域</span><strong>${compactText(requirements.mapDisplay?.region || "弥勒区域")}</strong><small>中心 ${requirements.mapDisplay?.center?.lng || ""}, ${requirements.mapDisplay?.center?.lat || ""}</small></article>
        <article><span>地图操作</span><strong>${(requirements.mapDisplay?.supports || ["缩放", "定位", "刷新"]).join(" / ")}</strong><small>可重新定位并切换活动分类</small></article>
        <article><span>报名状态</span><strong>${requirements.signup?.userSignups?.length || 0} 条</strong><small>报名、取消会写入消息</small></article>
      </div>
      <div class="yunlv-live-actions">
        <button type="button" data-yunlv-action="activity-map-locate">重新定位</button>
        <button type="button" data-yunlv-action="activity-map-zoom" data-direction="in">放大</button>
        <button type="button" data-yunlv-action="activity-map-zoom" data-direction="out">缩小</button>
      </div>
      <div class="yunlv-live-chip-row">
        ${categories.map((item) => `<button class="${item.category === activeFilter ? "is-active" : ""}" type="button" data-yunlv-action="activity-filter" data-filter="${compactText(item.category)}">${compactText(item.category)} ${item.count}</button>`).join("")}
      </div>
      <form class="yunlv-live-form" data-yunlv-form="activity-signup">
        <label class="wide">报名活动<select name="activityId">
          ${visible.map((activity) => `<option value="${compactText(activity.id)}" ${activity.id === selectedActivity.id ? "selected" : ""}>${compactText(activity.title)} · ${compactText(activity.location)} · ${compactText(activity.distance)}</option>`).join("")}
        </select></label>
        <label>报名人<input name="name" value="李秀兰" required /></label>
        <label>联系电话<input name="phone" value="13800005678" inputmode="tel" required /></label>
        <label>报名人数<input name="count" type="number" min="1" max="6" value="1" /></label>
        <label>备注<input name="note" value="行动节奏稍慢，请安排适老座位" /></label>
        <button class="yunlv-live-primary wide" type="submit">提交活动报名</button>
        <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
      </form>
      ${selectedSignup ? `<div class="yunlv-live-actions"><button type="button" data-yunlv-action="cancel-activity-signup" data-activity-id="${compactText(selectedSignup.activityId)}" data-signup-id="${compactText(selectedSignup.id)}">取消当前报名：${compactText(selectedSignup.activity?.title || selectedSignup.activityTitle)}</button></div>` : ""}
      <div class="yunlv-live-list">
        ${visible.map((activity) => `
          <article class="yunlv-live-order">
            <div class="yunlv-live-row">
              <div>
                <header><strong>${compactText(activity.title)}</strong>${liveStatus(activity.category)}</header>
                <p>${compactText(activity.time)} · ${compactText(activity.location)} · 距离 ${compactText(activity.distance)}</p>
                <p>报名 ${activity.joined}/${activity.quota} · 剩余 ${activity.availableSlots} · 坐标 ${activity.coordinates?.lng || ""}, ${activity.coordinates?.lat || ""}</p>
              </div>
              <aside><small>${compactText(activity.status)}</small>${activity.userJoined ? liveStatus("已报名") : ""}</aside>
            </div>
            <div class="yunlv-live-actions">
              <button type="button" data-yunlv-action="activity-card-detail" data-activity-id="${compactText(activity.id)}">查看详情</button>
              <button class="yunlv-live-primary" type="button" data-yunlv-action="select-activity-signup" data-activity-id="${compactText(activity.id)}">选择并报名</button>
              ${activity.userJoined ? `<button type="button" data-yunlv-action="cancel-activity-signup" data-activity-id="${compactText(activity.id)}" data-signup-id="${compactText(activity.signupId)}">取消报名</button>` : ""}
            </div>
          </article>
        `).join("") || `<p class="yunlv-live-empty">当前筛选暂无活动。</p>`}
      </div>
      <h3 class="yunlv-live-section-title">附近活动推荐</h3>
      <div class="yunlv-live-list">
        ${(requirements.nearbyRecommendations || []).map((activity) => `
          <article class="yunlv-live-mini-row">
            <span>${compactText(activity.title)} · ${compactText(activity.distance)} · ${compactText(activity.time)}</span>
            <button type="button" data-yunlv-action="activity-card-detail" data-activity-id="${compactText(activity.id)}">进入详情</button>
          </article>
        `).join("") || `<p class="yunlv-live-empty">暂无附近推荐。</p>`}
      </div>
    `, true);
  }

  async function renderUserSosLive(root, force = false) {
    const key = "user-sos";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const requirements = await request("/api/alerts/emergency-requirements", {}, "elder");
    const locationInfo = requirements.locationUpload || {};
    const contacts = requirements.emergencyContacts?.contacts || [];
    const healthInfo = requirements.healthInformation?.info || {};
    const chain = requirements.notificationChain || {};
    const alerts = requirements.recentAlerts || [];
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>紧急求助</h2><p>遇到突发情况时可发起 SOS，系统会记录当前位置并通知紧急联系人和平台后台。</p></div>
        <button class="yunlv-emergency-sos-button" type="button" data-yunlv-action="prepare-sos" data-location="${compactText(locationInfo.address)}" data-accuracy="${Number(locationInfo.accuracy || 0)}" data-lng="${Number(locationInfo.coordinates?.lng || 0)}" data-lat="${Number(locationInfo.coordinates?.lat || 0)}">${compactText(requirements.oneKeySos?.triggerMode || "二次确认触发")}</button>
      </header>
      <div class="yunlv-live-chip-row">
        ${requirements.requirements.map((item) => `<span class="yunlv-live-requirement-chip">${compactText(item.feature)} · ${compactText(item.priority)}</span>`).join("")}
      </div>
      <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
      <section class="yunlv-emergency-location">
        <div><strong>当前位置</strong><span>${compactText(locationInfo.address)}</span><small>定位精度 ${Number(locationInfo.accuracy || 0)} 米 · ${compactText(locationInfo.source)}</small></div>
        <button type="button" data-yunlv-action="refresh-emergency-location" data-location="${compactText(locationInfo.address)}">刷新定位</button>
      </section>
      <h3 class="yunlv-live-section-title">紧急联系人</h3>
      <div class="yunlv-emergency-contact-grid">
        ${contacts.map((contact) => `
          <article>
            <header><strong>${compactText(contact.relation)} · ${compactText(contact.name)}</strong>${contact.isDefault ? liveStatus("默认") : ""}</header>
            <span>${compactText(contact.phone)} · 通知优先级 ${Number(contact.callPriority || 1)}</span>
            <div>
              <button class="yunlv-live-primary" type="button" data-yunlv-action="call-emergency-contact" data-contact-id="${compactText(contact.id)}">拨打</button>
              <button type="button" data-yunlv-action="edit-emergency-contact" data-contact-id="${compactText(contact.id)}" data-name="${compactText(contact.name)}" data-relation="${compactText(contact.relation)}" data-phone="${compactText(contact.phone)}" data-notify="${contact.notifyAlert ? "true" : "false"}">编辑</button>
              <button type="button" data-yunlv-action="delete-emergency-contact" data-contact-id="${compactText(contact.id)}">删除</button>
            </div>
          </article>
        `).join("") || `<p class="yunlv-live-empty">暂无紧急联系人，请先新增。</p>`}
      </div>
      <form class="yunlv-live-form yunlv-emergency-contact-form" data-yunlv-form="emergency-contact">
        <input name="contactId" type="hidden" value="" />
        <label>姓名<input name="name" placeholder="如：张小明" required /></label>
        <label>关系<select name="relation"><option>儿子</option><option>女儿</option><option>老伴</option><option>家属</option><option>社区工作人员</option></select></label>
        <label>手机号<input name="phone" inputmode="tel" placeholder="11 位手机号" required /></label>
        <label class="yunlv-live-check"><input name="notifyAlert" type="checkbox" checked /> SOS 通知链路</label>
        <button class="yunlv-live-primary wide" type="submit">保存紧急联系人</button>
        <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
      </form>
      <h3 class="yunlv-live-section-title">通知链路</h3>
      <div class="yunlv-emergency-chain">
        <div><strong>必带字段</strong><span>${(chain.requiredFields || []).map((item) => compactText(item)).join("、")}</span></div>
        <div><strong>通知通道</strong><span>${(chain.channels || []).map((item) => compactText(item)).join("、")}</span></div>
        ${(chain.receivers || []).map((receiver) => `<div><strong>${compactText(receiver.relation)} · ${compactText(receiver.name)}</strong><span>${compactText(receiver.channel)} · ${compactText(receiver.phone)}</span></div>`).join("")}
      </div>
      <h3 class="yunlv-live-section-title">快速求助</h3>
      <div class="yunlv-live-actions">
        ${(requirements.quickHelp?.channels || []).map((channel) => `<button type="button" class="${channel.key === "ambulance" || channel.key === "police" ? "yunlv-live-danger" : ""}" data-yunlv-action="emergency-quick-help" data-channel-key="${compactText(channel.key)}" data-title="${compactText(channel.title)}" data-target="${compactText(channel.target)}" data-dial-number="${compactText(channel.dialNumber)}">${compactText(channel.title)}</button>`).join("")}
      </div>
      <h3 class="yunlv-live-section-title">急救健康信息</h3>
      <form class="yunlv-live-form yunlv-emergency-health-form" data-yunlv-form="emergency-health">
        <label>血型<input name="bloodType" value="${compactText(healthInfo.bloodType)}" /></label>
        <label>慢性病<input name="chronicDisease" value="${compactText(healthInfo.chronicDiseases)}" /></label>
        <label>过敏史<input name="allergies" value="${compactText(healthInfo.allergies)}" /></label>
        <label>常用药物<input name="medicines" value="${compactText(healthInfo.medicines)}" /></label>
        <button class="yunlv-live-primary wide" type="submit">保存急救健康信息</button>
        <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
      </form>
      <h3 class="yunlv-live-section-title">求助记录</h3>
      <div class="yunlv-live-list">
        ${alerts.slice(0, 5).map((alert) => `
          <article class="yunlv-live-order">
            <div class="yunlv-live-row">
              <div><header><strong>${compactText(alert.type)}</strong>${liveStatus(alert.status)}</header><p>${compactText(alert.description)}</p><p>${compactText(alert.location)} · ${compactText(alert.createdAt)} · 精度 ${Number(alert.accuracy || locationInfo.accuracy || 0)} 米</p></div>
              <aside><small>${compactText(alert.level)}</small></aside>
            </div>
          </article>
        `).join("") || `<p class="yunlv-live-empty">暂无求助记录。</p>`}
      </div>
    `, true);
  }

  async function renderUserMessagesLive(root, force = false) {
    const key = "user-messages";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const messages = await request("/api/messages?role=user", {}, "elder");
    const activeFilter = localStorage.getItem("yunlv-message-filter") || "全部";
    const categories = ["全部", "服务", "活动", "设备", "系统"];
    const visible = activeFilter === "全部" ? messages : messages.filter((item) => messageCategory(item) === activeFilter);
    const unread = messages.filter((item) => !item.read).length;
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>真实消息中心</h2><p>未读 ${unread} 条，全部已读会直接更新消息库。</p></div>
        <button class="yunlv-live-primary" type="button" data-yunlv-action="mark-all-messages">全部已读</button>
      </header>
      <div class="yunlv-live-chip-row">
        ${categories.map((category) => `<button class="${category === activeFilter ? "is-active" : ""}" type="button" data-yunlv-action="message-filter" data-filter="${compactText(category)}">${compactText(category)}</button>`).join("")}
      </div>
      <div class="yunlv-live-list">
        ${visible.map((message) => `
          <article class="yunlv-live-order ${message.read ? "is-read" : ""}">
            <div class="yunlv-live-row">
              <div><header><strong>${compactText(message.title)}</strong>${liveStatus(message.read ? "已读" : "未读")}</header><p>${compactText(message.content)}</p><p>${messageCategory(message)} · ${compactText(message.createdAt)}</p></div>
              <aside>${message.read ? "" : `<button type="button" data-yunlv-action="mark-message-read" data-message-id="${compactText(message.id)}">标为已读</button>`}</aside>
            </div>
          </article>
        `).join("") || `<p class="yunlv-live-empty">当前分类暂无消息。</p>`}
      </div>
    `, true);
  }

  async function renderUserHealthLive(root, force = false) {
    const key = "user-health";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const [overview, requirements] = await Promise.all([
      request("/api/health/overview", {}, "elder"),
      request("/api/devices/robot-requirements", {}, "elder"),
    ]);
    const metrics = requirements.healthOverview?.metrics || overview.metrics || [];
    const devices = requirements.deviceStatus?.devices || overview.devices || [];
    const robot = requirements.robotStatus || {};
    const guardianFeatures = requirements.guardianFeatures || [];
    const familyContacts = requirements.familyCall?.contacts || [];
    const helpChannels = requirements.helpRequest?.channels || [];
    const onlineDevices = devices.filter((device) => /在线|已连接/.test(String(device.onlineStatus || ""))).length;
    const activeGuardianFeatures = guardianFeatures.filter((feature) => feature.enabled).length;
    const healthTags = [
      `健康指标 ${metrics.length} 项`,
      `在线设备 ${onlineDevices}/${devices.length || 0}`,
      `守护功能 ${activeGuardianFeatures} 项已开启`,
    ];
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>健康档案与设备数据</h2><p>查看健康概览、设备状态、机器人守护记录，并可发起通话或求助。</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <div class="yunlv-live-chip-row">
        ${healthTags.map((item) => `<span class="yunlv-live-requirement-chip">${compactText(item)}</span>`).join("")}
      </div>
      <h3 class="yunlv-live-section-title">今日健康概览</h3>
      <div class="yunlv-live-metric-grid">
        ${metrics.map((item) => `<div class="yunlv-live-metric ${compactText(item.tone, "blue")}"><span>${compactText(item.label)}</span><b>${compactText(item.value)}${compactText(item.unit)}</b><small>${compactText(item.status)} · ${compactText(item.recordedAt)}</small></div>`).join("")}
      </div>
      <h3 class="yunlv-live-section-title">设备状态</h3>
      <div class="yunlv-device-card-grid">
        ${devices.map((device) => `
          <article class="yunlv-device-card ${compactText(device.role)}">
            <div class="yunlv-live-row">
              <div><header><strong>${compactText(device.title || device.type)}</strong>${liveStatus(device.onlineStatus)}</header><p>${compactText(device.deviceId)} · ${compactText(device.location)}</p><p>最后同步：${compactText(device.lastSync)}</p></div>
              <aside><b>${Number(device.battery || 0)}%</b><small>当前电量</small><button type="button" data-yunlv-action="sync-user-device" data-device-id="${compactText(device.id)}" data-battery="${Number(device.battery || 0)}">同步</button></aside>
            </div>
            <div class="yunlv-battery-bar"><i class="${compactText(device.batteryTone, "green")}" style="width:${Math.max(0, Math.min(100, Number(device.battery || 0)))}%"></i></div>
          </article>
        `).join("")}
      </div>
      <h3 class="yunlv-live-section-title">设备联动</h3>
      <div class="yunlv-linkage-flow">
        ${requirements.linkage?.steps?.map((step, index) => `<div><strong>${compactText(step.title)}</strong><span>${compactText(step.description)}</span>${liveStatus(step.status)}${index < requirements.linkage.steps.length - 1 ? "<em>→</em>" : ""}</div>`).join("") || ""}
      </div>
      <h3 class="yunlv-live-section-title">小云机器人状态</h3>
      <div class="yunlv-live-metric-grid compact">
        <div><span>在线状态</span><b>${compactText(robot.onlineStatus)}</b><small>${compactText(robot.room || robot.location)}</small></div>
        <div><span>设备电量</span><b>${Number(robot.battery || 0)}%</b><small>${compactText(robot.batteryTone)}</small></div>
        <div><span>网络状态</span><b>${compactText(robot.networkStatus)}</b><small>最后同步 ${compactText(robot.lastSync)}</small></div>
        <div><span>语音音量</span><b>${Number(robot.voiceVolume || 0)}%</b><small>可通过机器人动作调整</small></div>
        <div><span>设备状态</span><b>${compactText(robot.deviceStatus)}</b><small>可视化状态已接入</small></div>
      </div>
      <div class="yunlv-live-actions"><button class="yunlv-live-primary" type="button" data-yunlv-action="device-action" data-device-id="${compactText(robot.id)}" data-device-action="测试设备">测试设备</button></div>
      <h3 class="yunlv-live-section-title">守护功能</h3>
      <div class="yunlv-guardian-grid">
        ${guardianFeatures.map((feature) => `
          <button type="button" class="${feature.enabled ? "is-on" : ""}" data-yunlv-action="${feature.key === "sosCall" ? "trigger-sos" : "device-guardian-toggle"}" data-device-id="${compactText(feature.deviceId)}" data-feature-key="${compactText(feature.key)}" data-feature-name="${compactText(feature.name)}" data-enabled="${feature.enabled ? "true" : "false"}">
            <strong>${compactText(feature.name)}</strong>
            <span>${compactText(feature.description)}</span>
            <em>${compactText(feature.status)}</em>
          </button>
        `).join("")}
      </div>
      <h3 class="yunlv-live-section-title">家人通话</h3>
      <div class="yunlv-call-grid">
        ${familyContacts.map((contact) => `
          <article>
            <strong>${compactText(contact.relation)} · ${compactText(contact.name)}</strong>
            <span>${compactText(contact.phone)} · ${compactText(contact.onlineStatus)}</span>
            <div><button type="button" data-yunlv-action="device-family-call" data-device-id="${compactText(requirements.familyCall?.deviceId)}" data-contact-id="${compactText(contact.id)}" data-call-type="voice">语音通话</button><button type="button" data-yunlv-action="device-family-call" data-device-id="${compactText(requirements.familyCall?.deviceId)}" data-contact-id="${compactText(contact.id)}" data-call-type="video">视频通话</button></div>
          </article>
        `).join("")}
      </div>
      <h3 class="yunlv-live-section-title">寻求他人帮助</h3>
      <div class="yunlv-live-actions">
        ${helpChannels.map((channel) => `<button type="button" class="${channel.key === "sos" ? "yunlv-live-danger" : ""}" data-yunlv-action="${channel.key === "sos" ? "trigger-sos" : "device-help-request"}" data-help-target="${compactText(channel.target)}" data-provider-type="${compactText(channel.providerType)}">${compactText(channel.title)}</button>`).join("")}
      </div>
      <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
    `, true);
  }

  async function renderAdminLive(root, force = false) {
    if (!force && root.querySelector('[data-yunlv-live="admin-dispatch"]')) return;
    const queue = await request("/api/admin/dispatch/pending", {}, "admin");
    mountLive(root, "admin-demo-tools", `
      <header class="yunlv-live-head">
        <div><h2>演示数据工具</h2><p>一键恢复种子数据，便于反复验收同一套流程。</p></div>
        <button class="yunlv-live-danger" type="button" data-yunlv-action="admin-reset-demo">重置演示数据</button>
      </header>
      <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
    `, true);
    mountLive(root, "admin-dispatch", `
      <header class="yunlv-live-head">
        <div><h2>后台待派单列表 + 指派执行方</h2><p>读取 /api/admin/dispatch/pending，派单后生成任务并同步执行端。</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <div class="yunlv-live-table">
        ${queue.pendingOrders.map((order) => `
          <div class="yunlv-live-dispatch-row">
            <div>${orderMini(order)}</div>
            <label>执行方
              <select data-provider-select="${escapeHtml(order.id)}">${providerOptions(queue, order.providerType)}</select>
            </label>
            <button class="yunlv-live-primary" type="button" data-yunlv-action="admin-dispatch-order" data-order-id="${escapeHtml(order.id)}">指派执行方</button>
          </div>
        `).join("") || `<p class="yunlv-live-empty">暂无待派单订单。用户端提交订单后会出现在这里。</p>`}
      </div>
    `);
  }

  async function renderGuideLive(root, force = false) {
    const key = "guide-tasks";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const [dashboard, statsPayload, income] = await Promise.all([
      request("/api/guide/dashboard", {}, "guide"),
      request("/api/guide/stats", {}, "guide"),
      request("/api/guide/income", {}, "guide"),
    ]);
    const stats = statsPayload.stats || dashboard.stats || income.stats || {};
    const tasks = dashboard.tasks || [];
    const pendingOrders = dashboard.pendingOrders || [];
    const taskActions = (task) => {
      if (task.status === "待接单") return `<button class="yunlv-live-primary" type="button" data-yunlv-action="guide-task-action" data-task-id="${escapeHtml(task.id)}" data-task-action="accept">接单</button><button type="button" data-yunlv-action="guide-task-decision" data-task-id="${escapeHtml(task.id)}" data-task-decision="decline">拒绝</button><button type="button" data-yunlv-action="guide-task-decision" data-task-id="${escapeHtml(task.id)}" data-task-decision="ignore">忽略</button>`;
      if (task.status === "已接单") return `<button class="yunlv-live-primary" type="button" data-yunlv-action="guide-task-action" data-task-id="${escapeHtml(task.id)}" data-task-action="start">开始服务</button><button type="button" data-yunlv-action="guide-task-decision" data-task-id="${escapeHtml(task.id)}" data-task-decision="cancel">申请取消</button><button type="button" data-yunlv-action="guide-exception" data-task-id="${escapeHtml(task.id)}">异常上报</button>`;
      if (task.status === "服务中") return `<button class="yunlv-live-primary" type="button" data-yunlv-action="guide-task-action" data-task-id="${escapeHtml(task.id)}" data-task-action="complete">完成服务</button><button type="button" data-yunlv-action="guide-task-decision" data-task-id="${escapeHtml(task.id)}" data-task-decision="cancel">申请取消</button><button type="button" data-yunlv-action="guide-exception" data-task-id="${escapeHtml(task.id)}">异常上报</button>`;
      return `<button type="button" disabled>${escapeHtml(task.status)}</button>`;
    };
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>向导任务列表</h2><p>${escapeHtml(dashboard.guide?.realName || "向导")} · ${escapeHtml(dashboard.guide?.onlineStatus || "")} · 今日收入 ${formatAmount(stats.todayIncome)}</p></div>
        <div class="yunlv-live-actions" style="margin-top:0"><button type="button" data-yunlv-action="guide-online-toggle">${dashboard.guide?.onlineStatus === "在线" ? "下线休息" : "上线接单"}</button><button type="button" data-yunlv-action="refresh-live">刷新</button></div>
      </header>
      <div class="yunlv-live-metric-grid compact">
        <div><span>接单数</span><b>${stats.orderCount || 0}</b><small>平台统计</small></div>
        <div><span>待结算</span><b>${formatAmount(stats.settlementPending)}</b><small>完成/待确认订单金额</small></div>
        <div><span>完成订单</span><b>${stats.completedOrders || 0}</b><small>评价 ${income.reviews?.length || 0} 条</small></div>
      </div>
      <div class="yunlv-live-list">
        ${pendingOrders.map((order) => `
          <div class="yunlv-live-order">
            ${orderMini(order)}
            <div class="yunlv-live-actions"><button class="yunlv-live-primary" type="button" data-yunlv-action="guide-claim-order" data-order-id="${escapeHtml(order.id)}">接单</button></div>
          </div>
        `).join("")}
        ${tasks.map((task) => `
          <div class="yunlv-live-order">
            ${orderMini(task.order || { serviceType: task.taskNo, status: task.status, assigneeName: task.assigneeName, amount: 0 })}
            <p class="yunlv-live-meta">任务号：${escapeHtml(task.taskNo)} · ${escapeHtml(task.dispatchRule || "")}</p>
            <div class="yunlv-live-actions">${taskActions(task)}</div>
          </div>
        `).join("") || (pendingOrders.length ? "" : `<p class="yunlv-live-empty">暂无向导任务。后台派单或用户提交向导服务后会出现。</p>`)}
      </div>
    `);
  }

  async function renderGuideIncomeLive(root, force = false) {
    const key = "guide-income";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const [statsPayload, income] = await Promise.all([
      request("/api/guide/stats", {}, "guide"),
      request("/api/guide/income", {}, "guide"),
    ]);
    const stats = statsPayload.stats || income.stats || {};
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>今日收入与评价</h2><p>同步向导任务、订单金额和用户评价。</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <div class="yunlv-live-metric-grid">
        <div><span>今日收入</span><b>${formatAmount(stats.todayIncome)}</b><small>${escapeHtml(income.guide?.realName || "")}</small></div>
        <div><span>待结算</span><b>${formatAmount(stats.settlementPending)}</b><small>平台统计</small></div>
        <div><span>完成订单</span><b>${stats.completedOrders || 0}</b><small>评价 ${income.reviews?.length || 0} 条</small></div>
      </div>
      <div class="yunlv-live-list" style="margin-top:10px">
        ${income.items.slice(0, 8).map((item) => `
          <article class="yunlv-live-order">
            <div class="yunlv-live-row">
              <div><header><strong>${compactText(item.serviceType, item.taskNo)}</strong>${liveStatus(item.orderStatus || item.status)}</header><p>${compactText(item.orderNo)} · ${compactText(item.updatedAt)}</p></div>
              <aside><b>${formatAmount(item.amount)}</b><small>${compactText(item.status)}</small></aside>
            </div>
          </article>
        `).join("") || `<p class="yunlv-live-empty">暂无收入明细。</p>`}
      </div>
    `, true);
  }

  async function renderMerchantLive(root, force = false) {
    const key = "merchant-tasks";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const [dashboard, statsPayload] = await Promise.all([
      request("/api/merchant/dashboard", {}, "merchant"),
      request("/api/merchant/stats", {}, "merchant"),
    ]);
    const stats = statsPayload.stats || dashboard.stats || {};
    const orders = dashboard.orders || [];
    const actionFor = (order) => {
      if (["待派单", "已派单"].includes(order.status)) return `<button class="yunlv-live-primary" type="button" data-yunlv-action="merchant-order-action" data-order-id="${escapeHtml(order.id)}" data-order-action="quote">提交报价</button>`;
      if (order.status === "已报价") return `<button class="yunlv-live-primary" type="button" data-yunlv-action="merchant-order-action" data-order-id="${escapeHtml(order.id)}" data-order-action="confirm">确认预约</button>`;
      if (order.status === "待服务") return `<button class="yunlv-live-primary" type="button" data-yunlv-action="merchant-order-action" data-order-id="${escapeHtml(order.id)}" data-order-action="start">开始服务</button>`;
      if (order.status === "服务中") return `<button class="yunlv-live-primary" type="button" data-yunlv-action="merchant-order-action" data-order-id="${escapeHtml(order.id)}" data-order-action="complete">完成服务</button>`;
      return `<button type="button" disabled>${escapeHtml(order.status)}</button>`;
    };
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>真实商户任务列表</h2><p>${escapeHtml(dashboard.merchant?.name || "商户")} · 接单 ${stats.orderCount || 0} 笔 · 待结算 ${formatAmount(stats.settlementPending)}</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <div class="yunlv-live-list">
        ${orders.map((order) => `
          <div class="yunlv-live-order">
            ${orderMini(order)}
            <div class="yunlv-live-actions">${actionFor(order)}</div>
          </div>
        `).join("") || `<p class="yunlv-live-empty">暂无商户预约。后台指派商户订单后会出现。</p>`}
      </div>
    `);
  }

  async function renderMerchantServiceLive(root, force = false) {
    const key = "merchant-services";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const services = await request("/api/merchant/services?merchantId=merchant-001", {}, "merchant");
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>真实服务发布与上架</h2><p>新增服务写入服务库，后台审核后可上架给用户预约。</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <form class="yunlv-live-form" data-yunlv-form="merchant-service">
        <label>服务名称<input name="title" value="居家护理服务（基础套餐）" /></label>
        <label>服务分类<select name="category"><option value="康养护理">康养护理</option><option value="医疗卫生">医疗卫生</option><option value="交通出行">交通出行</option></select></label>
        <label>价格<input name="price" type="number" value="268" /></label>
        <label>单位<input name="unit" value="次" /></label>
        <label class="wide">服务说明<textarea name="description">生命体征监测、用药提醒、基础护理和服务记录同步。</textarea></label>
        <button class="yunlv-live-primary wide" type="submit">提交服务审核</button>
        <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
      </form>
      <div class="yunlv-live-list" style="margin-top:10px">
        ${services.map((service) => `
          <article class="yunlv-live-order">
            <div class="yunlv-live-row">
              <div><header><strong>${compactText(service.title)}</strong>${liveStatus(service.status)}</header><p>${compactText(service.category)} · ${formatAmount(service.price)}/${compactText(service.unit)}</p><p>${compactText(service.description)}</p></div>
              <aside><button type="button" data-yunlv-action="merchant-service-status" data-service-id="${compactText(service.id)}" data-next-status="${service.status === "上架" ? "下架" : "上架"}">${service.status === "上架" ? "下架" : "上架"}</button></aside>
            </div>
          </article>
        `).join("") || `<p class="yunlv-live-empty">暂无服务项目。</p>`}
      </div>
    `, true);
  }

  async function renderMerchantReviewsLive(root, force = false) {
    const key = "merchant-reviews";
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const reviews = await request("/api/merchant/reviews?merchantId=merchant-001", {}, "merchant");
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>真实评价数据</h2><p>用户确认完成后写入评价库，商户端和后台同步查询。</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <div class="yunlv-live-list">
        ${reviews.map((review) => `
          <article class="yunlv-live-order">
            <div class="yunlv-live-row">
              <div><header><strong>${compactText(review.serviceType)}</strong>${liveStatus(`${review.rating || 0}分`)}</header><p>${compactText(review.content)}</p><p>${compactText(review.elderName)} · ${compactText(review.orderNo)} · ${compactText(review.updatedAt || review.createdAt)}</p></div>
              <aside><b>${formatAmount(review.amount)}</b><small>${compactText(review.orderStatus)}</small></aside>
            </div>
          </article>
        `).join("") || `<p class="yunlv-live-empty">暂无评价。完成商户服务并由用户确认后会出现在这里。</p>`}
      </div>
    `, true);
  }

  async function renderAdminDataLive(root, force = false) {
    const route = currentRoute();
    const key = `admin-data-${route}`;
    if (!force && root.querySelector(`[data-yunlv-live="${key}"]`)) return;
    const loop = await request("/api/admin/data-loop", {}, "admin");
    const [guides, merchants, services, activities, alerts, reviews, priority] = await Promise.all([
      request("/api/admin/guides", {}, "admin"),
      request("/api/admin/merchants", {}, "admin"),
      request("/api/admin/services", {}, "admin"),
      request("/api/admin/activities", {}, "admin"),
      request("/api/admin/alerts", {}, "admin"),
      request("/api/admin/reviews", {}, "admin"),
      request("/api/admin/priority/status", {}, "admin"),
    ]);
    const summary = loop.summary || {};
    const serviceRequests = loop.services?.requests || [];
    const guideAuditRows = guides.filter((item) => item.status !== "已认证").slice(0, 4);
    const merchantAuditRows = merchants.filter((item) => item.status !== "已通过").slice(0, 4);
    const serviceAuditRows = services.filter((item) => item.status !== "上架").slice(0, 5);
    mountLive(root, key, `
      <header class="yunlv-live-head">
        <div><h2>后台真实数据闭环</h2><p>用户、健康、服务、商户、评价、活动、SOS、订单都从同一份数据库读取。</p></div>
        <button type="button" data-yunlv-action="refresh-live">刷新</button>
      </header>
      <div class="yunlv-live-metric-grid admin">
        <div><span>用户</span><b>${summary.users || 0}</b><small>老人 ${summary.elders || 0} · 家属 ${loop.users?.familyContacts?.length || 0}</small></div>
        <div><span>健康/设备</span><b>${summary.healthRecords || 0}/${summary.devices || 0}</b><small>在线设备 ${summary.onlineDevices || 0}</small></div>
        <div><span>订单闭环</span><b>${summary.orders || 0}</b><small>进行中 ${summary.activeOrders || 0} · 完成 ${summary.completedOrders || 0}</small></div>
        <div><span>SOS/异常</span><b>${summary.openAlerts || 0}</b><small>总异常 ${summary.alerts || 0}</small></div>
        <div><span>服务/商户</span><b>${summary.services || 0}/${summary.merchants || 0}</b><small>向导 ${summary.guides || 0}</small></div>
        <div><span>评价/请求</span><b>${summary.reviews || 0}/${summary.serviceRequests || 0}</b><small>营收 ${formatAmount(summary.revenue)}</small></div>
      </div>
      <div class="yunlv-live-admin-grid">
        <section>
          <h3>P0/P1/P2 交付状态</h3>
          ${["P0", "P1", "P2"].map((level) => `<div class="yunlv-live-mini-row"><span>${level} · ${compactText(priority[level]?.title)}</span>${liveStatus(priority[level]?.status)}<small>${priority[level]?.items?.length || 0} 项</small></div>`).join("")}
        </section>
        <section>
          <h3>待审核向导</h3>
          ${guideAuditRows.map((guide) => `<div class="yunlv-live-mini-row"><span>${compactText(guide.realName)} · ${compactText(guide.area)}</span>${liveStatus(guide.status)}<button type="button" data-yunlv-action="admin-audit-guide" data-guide-id="${compactText(guide.id)}">通过</button></div>`).join("") || `<p class="yunlv-live-empty">暂无待审核向导。</p>`}
        </section>
        <section>
          <h3>待审核商户</h3>
          ${merchantAuditRows.map((merchant) => `<div class="yunlv-live-mini-row"><span>${compactText(merchant.name)} · ${compactText(merchant.type)}</span>${liveStatus(merchant.status)}<button type="button" data-yunlv-action="admin-audit-merchant" data-merchant-id="${compactText(merchant.id)}">通过</button></div>`).join("") || `<p class="yunlv-live-empty">暂无待审核商户。</p>`}
        </section>
        <section>
          <h3>服务上架审核</h3>
          ${serviceAuditRows.map((service) => `<div class="yunlv-live-mini-row"><span>${compactText(service.title)} · ${compactText(service.providerName)}</span>${liveStatus(service.status)}<button type="button" data-yunlv-action="admin-service-status" data-service-id="${compactText(service.id)}" data-next-status="上架">上架</button></div>`).join("") || `<p class="yunlv-live-empty">暂无待审核服务。</p>`}
        </section>
        <section>
          <h3>SOS / 异常处理</h3>
          ${alerts.filter((item) => item.status !== "已处理").slice(0, 5).map((alert) => `<div class="yunlv-live-mini-row"><span>${compactText(alert.type)} · ${compactText(alert.elderName)}</span>${liveStatus(alert.status)}<button type="button" data-yunlv-action="admin-handle-alert" data-alert-id="${compactText(alert.id)}">处理</button></div>`).join("") || `<p class="yunlv-live-empty">暂无待处理异常。</p>`}
        </section>
        <section>
          <h3>服务请求处理</h3>
          ${serviceRequests.filter((item) => item.status !== "已处理").slice(0, 5).map((item) => `<div class="yunlv-live-mini-row"><span>${compactText(item.type)} · ${compactText(item.elderName)}</span>${liveStatus(item.status)}<button type="button" data-yunlv-action="admin-handle-service-request" data-request-id="${compactText(item.id)}">处理</button></div>`).join("") || `<p class="yunlv-live-empty">暂无待处理服务请求。</p>`}
        </section>
        <section>
          <h3>活动管理</h3>
          ${activities.activities.slice(0, 5).map((activity) => `<div class="yunlv-live-mini-row"><span>${compactText(activity.title)} · ${activity.joined}/${activity.quota}</span>${liveStatus(activity.status)}<button type="button" data-yunlv-action="admin-activity-status" data-activity-id="${compactText(activity.id)}" data-next-status="${activity.status === "报名中" ? "已下线" : "报名中"}">${activity.status === "报名中" ? "下线" : "上线"}</button></div>`).join("")}
          <form class="yunlv-live-form compact-form" data-yunlv-form="admin-activity">
            <label>活动名称<input name="title" value="社区慢行摄影活动" /></label>
            <label>分类<input name="category" value="文化体验" /></label>
            <label>名额<input name="quota" type="number" value="25" /></label>
            <label>地点<input name="location" value="翠湖公园" /></label>
            <button class="yunlv-live-primary wide" type="submit">新建活动</button>
            <p class="yunlv-live-inline-status" data-yunlv-inline-status></p>
          </form>
        </section>
        <section>
          <h3>最新评价</h3>
          ${reviews.slice(0, 5).map((review) => `<div class="yunlv-live-mini-row"><span>${compactText(review.serviceType)} · ${compactText(review.providerName)}</span>${liveStatus(`${review.rating || 0}分`)}<small>${compactText(review.elderName)}</small></div>`).join("") || `<p class="yunlv-live-empty">暂无评价。</p>`}
        </section>
      </div>
    `, true);
  }

  async function renderLiveModules(force = false) {
    return;
  }

  let liveHydrating = false;
  let liveTimer = null;
  function scheduleLiveModules(force = false) {
    return;
  }

  function inlineStatus(source, text) {
    const formNode = source?.closest?.("[data-yunlv-form]")?.querySelector?.("[data-yunlv-inline-status]");
    const node = formNode || source?.closest?.("[data-yunlv-live]")?.querySelector?.("[data-yunlv-inline-status]");
    if (node) node.textContent = text;
    else writeStatus({ button: source }, text);
  }

  function formTime(value) {
    return value ? String(value).replace("T", " ") : "";
  }

  async function handleLiveSubmit(event) {
    const form = event.target.closest("[data-yunlv-form]");
    if (!form) return;
    event.preventDefault();
    if (form.dataset.yunlvForm === "order") {
      const data = Object.fromEntries(new FormData(form).entries());
      const selectedService = form.querySelector('[name="serviceType"]')?.selectedOptions?.[0];
      const order = await request("/api/orders", {
        method: "POST",
        body: {
          ...data,
          elderName: data.elderName,
          serviceType: data.serviceType,
          providerType: "guide",
          time: formTime(data.time),
          serviceTime: formTime(data.serviceTime),
          appointmentTime: formTime(data.appointmentTime),
          location: data.location,
          note: data.note,
          amount: Number(selectedService?.dataset?.amount || 120),
          strictRequirements: true,
          source: "用户端统一下单表单",
        },
      }, "elder");
      localStorage.setItem("yunlv-selected-order", order.id);
      inlineStatus(form, `订单 ${order.orderNo} 已创建，状态：${order.status}`);
      scheduleLiveModules(true);
    }
    if (form.dataset.yunlvForm === "review") {
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.orderId) return inlineStatus(form, "暂无可确认订单");
      const order = await request(`/api/orders/${data.orderId}/confirm`, {
        method: "POST",
        body: { rating: Number(data.rating || 5), review: data.review, tags: ["准时到达", "服务细致"] },
      }, "elder");
      localStorage.setItem("yunlv-selected-order", order.id);
      inlineStatus(form, `订单 ${order.orderNo} 已确认完成，评分 ${order.rating} 分`);
      scheduleLiveModules(true);
    }
    if (form.dataset.yunlvForm === "ai") {
      const data = Object.fromEntries(new FormData(form).entries());
      const chat = await request("/api/ai/chat", { method: "POST", body: { question: data.question } }, "elder");
      const message = `AI 已回复：${chat.intent} · ${chat.responseTimeMs || 0}ms · ${chat.answer}`;
      await renderLiveModules(true);
      const live = liveRoot("elder")?.querySelector('[data-yunlv-live="user-ai"]');
      const statusNode = live?.querySelector("[data-yunlv-inline-status]");
      if (statusNode) statusNode.textContent = message;
    }
    if (form.dataset.yunlvForm === "activity-signup") {
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.activityId) return inlineStatus(form, "请选择活动");
      if (!data.name || !/^1\d{10}$/.test(String(data.phone || ""))) return inlineStatus(form, "请填写报名人和正确手机号");
      const result = await request(`/api/activities/${data.activityId}/join`, {
        method: "POST",
        body: {
          name: data.name,
          phone: data.phone,
          count: Number(data.count || 1),
          note: data.note,
        },
      }, "elder");
      await request("/api/ui/actions", {
        method: "POST",
        body: {
          role: "user",
          route: currentRoute(),
          action: "提交活动报名资料",
          target: result.activity?.title || data.activityId,
          payload: { activityId: data.activityId, name: data.name, phone: data.phone, count: Number(data.count || 1) },
        },
      }, "elder");
      const message = result.duplicate ? `已更新「${result.activity.title}」报名资料` : `报名成功：${result.activity.title}`;
      await renderLiveModules(true);
      const live = liveRoot("elder")?.querySelector('[data-yunlv-live="user-activity-map"]');
      const statusNode = live?.querySelector("[data-yunlv-inline-status]");
      if (statusNode) statusNode.textContent = message;
    }
    if (form.dataset.yunlvForm === "emergency-contact") {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      if (!data.name || !/^1\d{10}$/.test(String(data.phone || ""))) return inlineStatus(form, "请填写联系人姓名和正确手机号");
      const body = {
        name: data.name,
        relation: data.relation,
        phone: data.phone,
        notifyAlert: formData.has("notifyAlert"),
      };
      const contact = data.contactId
        ? await request(`/api/family-contacts/${data.contactId}`, { method: "PUT", body }, "elder")
        : await request("/api/family-contacts", { method: "POST", body }, "elder");
      inlineStatus(form, `${contact.relation}${contact.name}已保存到紧急联系人`);
      form.reset();
      form.querySelector('[name="contactId"]').value = "";
      scheduleLiveModules(true);
    }
    if (form.dataset.yunlvForm === "emergency-health") {
      const data = Object.fromEntries(new FormData(form).entries());
      const chronicDisease = String(data.chronicDisease || "").trim();
      const profile = await request("/api/elder/profile", {
        method: "PUT",
        body: {
          bloodType: data.bloodType,
          chronicDisease,
          healthTags: chronicDisease.split(/[、,，]/).map((item) => item.trim()).filter(Boolean),
          allergies: data.allergies,
          medicines: data.medicines,
        },
      }, "elder");
      inlineStatus(form, `急救健康信息已保存：${profile.name}`);
      scheduleLiveModules(true);
    }
    if (form.dataset.yunlvForm === "merchant-service") {
      const data = Object.fromEntries(new FormData(form).entries());
      const service = await request("/api/merchant/services", {
        method: "POST",
        body: {
          title: data.title,
          category: data.category,
          price: Number(data.price || 0),
          unit: data.unit,
          description: data.description,
          status: "待审核",
        },
      }, "merchant");
      inlineStatus(form, `服务「${service.title}」已提交后台审核`);
      scheduleLiveModules(true);
    }
    if (form.dataset.yunlvForm === "admin-activity") {
      const data = Object.fromEntries(new FormData(form).entries());
      const activity = await request("/api/admin/activities", {
        method: "POST",
        body: {
          title: data.title,
          category: data.category,
          quota: Number(data.quota || 30),
          location: data.location,
        },
      }, "admin");
      inlineStatus(form, `活动「${activity.title}」已创建并开放报名`);
      scheduleLiveModules(true);
    }
  }

  async function handleLiveAction(button) {
    const action = button.dataset.yunlvAction;
    setBusy(button, true);
    try {
      if (action === "refresh-live") {
        await renderLiveModules(true);
        inlineStatus(button, "真实数据已刷新");
      }
      if (action === "activity-map-refresh") {
        await request("/api/activities/map-requirements", {}, "elder");
        inlineStatus(button, "活动地图数据已刷新，地图点、分类和推荐列表已同步");
        await renderLiveModules(true);
      }
      if (action === "activity-map-locate") {
        const requirements = await request("/api/activities/map-requirements", {}, "elder");
        inlineStatus(button, `当前位置：${requirements.mapDisplay?.currentLocation?.address || "弥勒市湖泉生态园游客中心"}`);
      }
      if (action === "activity-map-zoom") {
        inlineStatus(button, button.dataset.direction === "in" ? "地图缩放级别已放大" : "地图缩放级别已缩小");
      }
      if (action === "user-login-demo") {
        sessions.delete("elder");
        const session = await ensureAuth("elder");
        inlineStatus(button, `已登录 ${session.user?.nickname || "用户"}`);
        await renderLiveModules(true);
      }
      if (action === "ai-quick-question") {
        const result = await request(`/api/ai/quick-questions/${button.dataset.questionId}/ask`, {
          method: "POST",
          body: {},
        }, "elder");
        await renderLiveModules(true);
        const live = liveRoot("elder")?.querySelector('[data-yunlv-live="user-ai"]');
        const statusNode = live?.querySelector("[data-yunlv-inline-status]");
        if (statusNode) statusNode.textContent = `快捷问题「${result.quickQuestion.title}」已回答：${result.chat.intent} · ${result.chat.responseTimeMs || 0}ms`;
      }
      if (action === "ai-voice-transcribe") {
        const result = await request("/api/ai/voice/transcribe", {
          method: "POST",
          body: { sampleKey: button.dataset.sampleKey },
        }, "elder");
        await renderLiveModules(true);
        const live = liveRoot("elder")?.querySelector('[data-yunlv-live="user-ai"]');
        const statusNode = live?.querySelector("[data-yunlv-inline-status]");
        if (statusNode) statusNode.textContent = `语音识别成功：「${result.transcript}」，已进入 AI 对话`;
      }
      if (action === "ai-service-entry") {
        const route = button.dataset.route || "service-records";
        if (["order-submit", "service-records"].includes(route)) {
          const requestItem = await request("/api/service-requests", {
            method: "POST",
            body: {
              role: "user",
              route: "assistant",
              action: "AI推荐服务入口",
              type: button.dataset.requestType || button.dataset.title || "智能管家推荐服务",
              providerType: button.dataset.type === "merchant-service" ? "merchant" : "guide",
              priority: "P1",
              description: `用户从智能管家推荐入口点击：${button.dataset.title || "服务"}`,
              payload: { source: "4.3 智能管家需求", route },
            },
          }, "elder");
          inlineStatus(button, `已生成服务咨询记录 ${requestItem.requestNo}，后台可继续处理`);
        } else {
          await request("/api/ui/actions", {
            method: "POST",
            body: { role: "user", route: "assistant", action: "AI推荐服务入口", target: button.dataset.title || route, result: `已进入${route}` },
          }, "elder");
          window.location.hash = route;
        }
      }
      if (action === "activity-filter") {
        localStorage.setItem("yunlv-activity-filter", button.dataset.filter || "全部");
        inlineStatus(button, `已筛选${button.dataset.filter || "全部"}活动`);
        await renderLiveModules(true);
      }
      if (action === "join-activity") {
        const result = await request(`/api/activities/${button.dataset.activityId}/join`, {
          method: "POST",
          body: { name: "李秀兰", phone: "13800005678", count: 1 },
        }, "elder");
        await renderLiveModules(true);
        const live = liveRoot("elder")?.querySelector('[data-yunlv-live="user-activity-map"]');
        const statusNode = live?.querySelector("[data-yunlv-inline-status]");
        if (statusNode) statusNode.textContent = result.duplicate ? `已更新「${result.activity.title}」报名信息` : `已报名「${result.activity.title}」`;
      }
      if (action === "cancel-activity-signup") {
        const result = await request(`/api/activities/${button.dataset.activityId}/cancel`, {
          method: "POST",
          body: { signupId: button.dataset.signupId, reason: "用户端主动取消报名" },
        }, "elder");
        await renderLiveModules(true);
        const live = liveRoot("elder")?.querySelector('[data-yunlv-live="user-activity-map"]');
        const statusNode = live?.querySelector("[data-yunlv-inline-status]");
        if (statusNode) statusNode.textContent = `已取消「${result.activity.title}」报名，当前报名 ${result.activity.joined}/${result.activity.quota}`;
      }
      if (action === "activity-card-detail") {
        const detail = await request(`/api/activities/${button.dataset.activityId}`, {}, "elder");
        const form = button.closest("[data-yunlv-live]")?.querySelector('[data-yunlv-form="activity-signup"]');
        const select = form?.querySelector('[name="activityId"]');
        if (select) select.value = detail.id;
        inlineStatus(button, `${detail.title} · ${detail.time} · ${detail.location} · 距离 ${detail.distance} · ${detail.status} · 已报名 ${detail.participantCount}/${detail.quota}`);
      }
      if (action === "select-activity-signup") {
        const form = button.closest("[data-yunlv-live]")?.querySelector('[data-yunlv-form="activity-signup"]');
        const select = form?.querySelector('[name="activityId"]');
        if (select) {
          select.value = button.dataset.activityId || select.value;
          select.focus();
        }
        inlineStatus(button, "请确认报名人、联系电话和人数后提交");
      }
      if (action === "prepare-sos") {
        const alert = await confirmAndTriggerSos({ role: "elder", route: currentRoute(), button }, liveEmergencyLocationFromButton(button));
        if (alert) {
          inlineStatus(button, `SOS ${alert.id} 已生成，后台和紧急联系人已收到通知`);
          await renderLiveModules(true);
        }
      }
      if (action === "emergency-quick-help") {
        const locationPayload = liveEmergencyLocationFromButton(button.closest("[data-yunlv-live]")?.querySelector('[data-yunlv-action="prepare-sos"]') || button);
        const requestItem = await request("/api/alerts/quick-help", {
          method: "POST",
          body: {
            channelKey: button.dataset.channelKey,
            title: button.dataset.title || button.textContent?.trim(),
            target: button.dataset.target,
            ...locationPayload,
          },
        }, "elder");
        inlineStatus(button, `快速求助 ${requestItem.requestNo} 已生成${requestItem.dialNumber ? `，可拨打 ${requestItem.dialNumber}` : ""}`);
      }
      if (action === "call-emergency-contact") {
        const card = button.closest("article");
        const fallbackPhone = card?.querySelector("span")?.textContent?.match(/1\d{10}/)?.[0] || "";
        let openedDial = "";
        if (fallbackPhone) {
          openedDial = fallbackPhone;
          window.location.href = `tel:${fallbackPhone}`;
          inlineStatus(button, `正在拨打紧急联系人：${fallbackPhone}`);
        }
        try {
          const result = await request(`/api/family-contacts/${button.dataset.contactId}/call`, {
            method: "POST",
            body: { route: currentRoute() },
          }, "elder");
          const dialNumber = String(result.dialNumber || fallbackPhone || "").replace(/[^\d+]/g, "");
          if (!openedDial && dialNumber) window.location.href = `tel:${dialNumber}`;
          inlineStatus(button, `正在拨打${result.contact.relation}${result.contact.name}：${dialNumber || result.dialNumber}`);
        } catch (error) {
          if (openedDial) inlineStatus(button, `已打开拨号，后台记录暂未同步：${error.message}`);
          else throw error;
        }
      }
      if (action === "edit-emergency-contact") {
        const form = button.closest("[data-yunlv-live]")?.querySelector('[data-yunlv-form="emergency-contact"]');
        if (form) {
          form.querySelector('[name="contactId"]').value = button.dataset.contactId || "";
          form.querySelector('[name="name"]').value = button.dataset.name || "";
          form.querySelector('[name="relation"]').value = button.dataset.relation || "家属";
          form.querySelector('[name="phone"]').value = button.dataset.phone || "";
          form.querySelector('[name="notifyAlert"]').checked = button.dataset.notify !== "false";
        }
        inlineStatus(button, "已带入联系人信息，请修改后保存");
      }
      if (action === "delete-emergency-contact") {
        const result = await request(`/api/family-contacts/${button.dataset.contactId}`, { method: "DELETE", body: {} }, "elder");
        inlineStatus(button, `已删除${result.removed.relation}${result.removed.name}`);
        await renderLiveModules(true);
      }
      if (action === "refresh-emergency-location") {
        if (!navigator.geolocation) {
          inlineStatus(button, `当前位置：${button.dataset.location || "定位地址"}，浏览器未开放定位能力`);
        } else {
          const position = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), { enableHighAccuracy: true, timeout: 3000, maximumAge: 60000 });
          });
          if (position) {
            inlineStatus(button, `定位已刷新：${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}，精度 ${Math.round(position.coords.accuracy)} 米`);
          } else {
            inlineStatus(button, "浏览器定位未授权，继续使用设备定位地址");
          }
        }
      }
      if (action === "trigger-sos") {
        const alert = await request("/api/alerts/sos", {
          method: "POST",
          body: { location: "设备定位位置", accuracy: 35, description: "用户端一键 SOS 触发，请后台立即处理。" },
        }, "elder");
        inlineStatus(button, "SOS已提交成功");
        await renderLiveModules(true);
      }
      if (action === "message-filter") {
        localStorage.setItem("yunlv-message-filter", button.dataset.filter || "全部");
        inlineStatus(button, `已筛选${button.dataset.filter || "全部"}消息`);
        await renderLiveModules(true);
      }
      if (action === "mark-all-messages") {
        const result = await request("/api/messages/read-all", { method: "POST", body: { role: "user" } }, "elder");
        inlineStatus(button, `已读 ${result.changed} 条消息，剩余未读 ${result.unread}`);
        await renderLiveModules(true);
      }
      if (action === "mark-message-read") {
        const message = await request(`/api/messages/${button.dataset.messageId}/read`, { method: "POST", body: {} }, "elder");
        inlineStatus(button, `消息「${message.title}」已读`);
        await renderLiveModules(true);
      }
      if (action === "sync-user-device") {
        const battery = Math.max(1, Math.min(100, Number(button.dataset.battery || 80) - 1));
        const result = await request(`/api/devices/${button.dataset.deviceId}/sync`, {
          method: "POST",
          body: { battery, onlineStatus: "在线" },
        }, "elder");
        inlineStatus(button, `${result.type} 已同步，电量 ${result.battery}%`);
        await renderLiveModules(true);
      }
      if (action === "device-action") {
        const result = await request(`/api/devices/${button.dataset.deviceId}/action`, {
          method: "POST",
          body: { action: button.dataset.deviceAction || button.textContent?.trim() || "设备操作" },
        }, "elder");
        inlineStatus(button, result.action?.result || "设备操作已完成");
        await renderLiveModules(true);
      }
      if (action === "device-guardian-toggle") {
        const nextEnabled = button.dataset.enabled !== "true";
        const result = await request(`/api/devices/${button.dataset.deviceId}/action`, {
          method: "POST",
          body: {
            action: button.dataset.featureName || "守护功能",
            guardianFeature: button.dataset.featureKey,
            enabled: nextEnabled,
          },
        }, "elder");
        inlineStatus(button, result.action?.result || `${button.dataset.featureName || "守护功能"}已${nextEnabled ? "开启" : "关闭"}`);
        await renderLiveModules(true);
      }
      if (action === "device-family-call") {
        const callText = button.dataset.callType === "video" ? "视频通话" : "语音通话";
        const result = await request(`/api/devices/${button.dataset.deviceId}/action`, {
          method: "POST",
          body: { action: callText, callType: button.dataset.callType, contactId: button.dataset.contactId },
        }, "elder");
        inlineStatus(button, result.action?.result || `${callText}已发起`);
        await renderLiveModules(true);
      }
      if (action === "device-help-request") {
        const requestItem = await request("/api/devices/help-request", {
          method: "POST",
          body: {
            target: button.dataset.helpTarget || button.textContent?.trim() || "附近求助",
            providerType: button.dataset.providerType || "",
            description: `用户通过小云机器人发起${button.dataset.helpTarget || "帮助任务"}`,
          },
        }, "elder");
        inlineStatus(button, `帮助任务 ${requestItem.requestNo} 已生成，状态：${requestItem.status}`);
        await renderLiveModules(true);
      }
      if (action === "select-user-order") {
        localStorage.setItem("yunlv-selected-order", button.dataset.orderId || "");
        inlineStatus(button, "订单追踪已更新");
        await renderLiveModules(true);
      }
      if (action === "quick-confirm-order") {
        const order = await request(`/api/orders/${button.dataset.orderId}/confirm`, {
          method: "POST",
          body: { rating: 5, review: "服务已完成，确认评价。" },
        }, "elder");
        localStorage.setItem("yunlv-selected-order", order.id);
        inlineStatus(button, `订单 ${order.orderNo} 已完成`);
        await renderLiveModules(true);
      }
      if (action === "cancel-order") {
        const order = await request(`/api/orders/${button.dataset.orderId}/cancel`, {
          method: "POST",
          body: { reason: "用户端取消" },
        }, "elder");
        inlineStatus(button, `订单 ${order.orderNo} 已取消`);
        await renderLiveModules(true);
      }
      if (action === "admin-dispatch-order") {
        const safeOrderId = String(button.dataset.orderId || "").replace(/["\\]/g, "\\$&");
        const select = document.querySelector(`[data-provider-select="${safeOrderId}"]`);
        const [assigneeType, assigneeId] = String(select?.value || "guide:guide-001").split(":");
        const result = await request("/api/tasks/dispatch", {
          method: "POST",
          body: { orderId: button.dataset.orderId, assigneeType, assigneeId },
        }, "admin");
        inlineStatus(button, `已指派 ${result.order.orderNo} -> ${result.task.assigneeName}`);
        await renderLiveModules(true);
      }
      if (action === "admin-reset-demo") {
        const result = await request("/api/admin/demo/reset", { method: "POST", body: {} }, "admin");
        localStorage.removeItem("yunlv-selected-order");
        inlineStatus(button, `演示数据已重置：${result.resetAt}`);
        await renderLiveModules(true);
      }
      if (action === "guide-claim-order") {
        const result = await request("/api/guide/tasks/claim-next", {
          method: "POST",
          body: { guideId: "guide-001", orderId: button.dataset.orderId },
        }, "guide");
        inlineStatus(button, `已接单 ${result.order.orderNo}`);
        await renderLiveModules(true);
      }
      if (action === "guide-online-toggle") {
        const dashboard = await request("/api/guide/dashboard", {}, "guide");
        const next = dashboard.guide?.onlineStatus === "在线" ? "离线" : "在线";
        const guide = await request("/api/guide/online", { method: "POST", body: { guideId: "guide-001", onlineStatus: next } }, "guide");
        inlineStatus(button, `接单状态：${guide.onlineStatus} / ${guide.currentStatus}`);
        await renderLiveModules(true);
      }
      if (action === "guide-task-action") {
        const result = await request(`/api/tasks/${button.dataset.taskId}/${button.dataset.taskAction}`, { method: "POST", body: {} }, "guide");
        inlineStatus(button, `任务 ${result.task.taskNo} 已更新为 ${result.task.status}`);
        await renderLiveModules(true);
      }
      if (action === "guide-task-decision") {
        const result = await request(`/api/guide/tasks/${button.dataset.taskId}/${button.dataset.taskDecision}`, {
          method: "POST",
          body: { reason: button.textContent?.trim() || "向导端任务操作" },
        }, "guide");
        inlineStatus(button, `任务 ${result.task.taskNo} 已${button.dataset.taskDecision === "ignore" ? "忽略" : `更新为 ${result.task.status}`}`);
        await renderLiveModules(true);
      }
      if (action === "guide-exception") {
        const result = await request("/api/guide/exception", {
          method: "POST",
          body: { taskId: button.dataset.taskId, type: "服务异常", description: "向导端上报：客户需求或现场情况需要后台介入。" },
        }, "guide");
        inlineStatus(button, "上报成功");
        await renderLiveModules(true);
      }
      if (action === "merchant-order-action") {
        const result = await request(`/api/merchant/orders/${button.dataset.orderId}/${button.dataset.orderAction}`, {
          method: "POST",
          body: { amount: 280, plan: "商户端真实报价与服务方案" },
        }, "merchant");
        inlineStatus(button, `订单 ${result.orderNo} 已更新为 ${result.status}`);
        await renderLiveModules(true);
      }
      if (action === "merchant-service-status") {
        const service = await request(`/api/merchant/services/${button.dataset.serviceId}/status`, {
          method: "POST",
          body: { status: button.dataset.nextStatus },
        }, "merchant");
        inlineStatus(button, `服务「${service.title}」已更新为 ${service.status}`);
        await renderLiveModules(true);
      }
      if (action === "admin-audit-guide") {
        const guide = await request(`/api/admin/guides/${button.dataset.guideId}/audit`, {
          method: "POST",
          body: { decision: "通过审核", status: "已认证" },
        }, "admin");
        inlineStatus(button, `向导 ${guide.realName} 已认证`);
        await renderLiveModules(true);
      }
      if (action === "admin-audit-merchant") {
        const merchant = await request(`/api/admin/merchants/${button.dataset.merchantId}/audit`, {
          method: "POST",
          body: { decision: "通过入驻", status: "已通过" },
        }, "admin");
        inlineStatus(button, `商户 ${merchant.name} 已通过`);
        await renderLiveModules(true);
      }
      if (action === "admin-service-status") {
        const service = await request(`/api/admin/services/${button.dataset.serviceId}/status`, {
          method: "POST",
          body: { status: button.dataset.nextStatus || "上架" },
        }, "admin");
        inlineStatus(button, `服务「${service.title}」已更新为 ${service.status}`);
        await renderLiveModules(true);
      }
      if (action === "admin-activity-status") {
        const activity = await request(`/api/admin/activities/${button.dataset.activityId}/status`, {
          method: "POST",
          body: { status: button.dataset.nextStatus },
        }, "admin");
        inlineStatus(button, `活动「${activity.title}」已更新为 ${activity.status}`);
        await renderLiveModules(true);
      }
      if (action === "admin-handle-alert") {
        const alert = await request(`/api/alerts/${button.dataset.alertId}/handle`, {
          method: "POST",
          body: { result: "后台已联系老人/家属并完成处置。" },
        }, "admin");
        inlineStatus(button, `异常 ${alert.id} 已处理`);
        await renderLiveModules(true);
      }
      if (action === "admin-handle-service-request") {
        const requestItem = await request(`/api/service-requests/${button.dataset.requestId}/handle`, {
          method: "POST",
          body: { result: "后台已承接该服务请求，并同步用户。" },
        }, "admin");
        inlineStatus(button, `服务请求 ${requestItem.requestNo} 已处理`);
        await renderLiveModules(true);
      }
    } catch (error) {
      inlineStatus(button, error.message);
      notify({ button }, error.message, "error");
    } finally {
      setBusy(button, false);
    }
  }

  function injectLiveStyles() {
    if (document.getElementById("yunlv-live-style")) return;
    const style = document.createElement("style");
    style.id = "yunlv-live-style";
    style.textContent = `
      .yunlv-live-card{border:1px solid rgba(31,111,235,.16);background:#fff;border-radius:18px;box-shadow:0 10px 28px rgba(31,111,235,.08);padding:16px;margin:14px 0;color:#111827}
      .main .yunlv-live-card{border-radius:12px;margin:0 0 14px;padding:18px}
      .yunlv-live-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
      .yunlv-live-head h2{font-size:18px;line-height:1.2;margin:0 0 4px;font-weight:900;color:#101828}
      .main .yunlv-live-head h2{font-size:20px}
      .yunlv-live-head p{margin:0;color:#667085;font-size:13px;line-height:1.45}
      .yunlv-live-head>span{font-size:12px;font-weight:800;color:#176bff;background:#eef5ff;border-radius:999px;padding:5px 9px}
      .yunlv-live-card button,.yunlv-live-card select,.yunlv-live-card input,.yunlv-live-card textarea{font:inherit}
      .yunlv-live-card button{border:1px solid #d8e3f4;background:#fff;color:#176bff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}
      .yunlv-live-card button:disabled{opacity:.55;cursor:not-allowed}
      .appbar.home .icon-btn{position:relative}
      .yunlv-home-message-badge{position:absolute;right:4px;top:2px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:#ff4d4f;color:#fff;font-size:10px;font-weight:900;line-height:16px;text-align:center;box-shadow:0 0 0 2px #fff}
      .yunlv-live-primary{background:#176bff!important;border-color:#176bff!important;color:#fff!important}
      .yunlv-live-danger{background:#fff4f2!important;border-color:#ffccc5!important;color:#e23b2f!important}
      .yunlv-live-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .yunlv-live-form label{display:grid;gap:6px;color:#667085;font-size:12px;font-weight:800}
      .yunlv-live-form label.wide,.yunlv-live-form .wide{grid-column:1/-1}
      .yunlv-live-form input,.yunlv-live-form select,.yunlv-live-form textarea{width:100%;box-sizing:border-box;border:1px solid #d7e1ef;border-radius:10px;background:#f8fbff;color:#111827;padding:10px 11px;outline:none}
      .yunlv-live-form textarea{min-height:72px;resize:vertical}
      .yunlv-live-field-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;border:1px solid #e5eef9;border-radius:14px;background:#fbfdff;padding:12px}
      .yunlv-live-requirement-note{grid-column:1/-1;display:grid;gap:3px;border:0!important;background:transparent!important;padding:0 0 4px!important}
      .yunlv-live-requirement-note strong{font-size:14px;color:#101828}
      .yunlv-live-requirement-note span,.yunlv-live-requirement-note em{font-style:normal;font-size:12px;line-height:1.45;color:#667085}
      .yunlv-live-list{display:grid;gap:10px}
      .yunlv-live-order{border:1px solid #edf2f7;border-radius:14px;background:#fbfdff;padding:10px}
      .yunlv-live-order.is-read{opacity:.72}
      .yunlv-live-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start}
      .yunlv-live-row header{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}
      .yunlv-live-row strong{font-size:15px;color:#101828}
      .yunlv-live-row p{margin:3px 0;color:#667085;font-size:12px;line-height:1.45}
      .yunlv-live-row aside{text-align:right;display:grid;gap:3px}
      .yunlv-live-row aside b{font-size:16px;color:#101828}
      .yunlv-live-row aside small{font-size:12px;color:#667085;max-width:104px}
      .yunlv-live-row ol{margin:8px 0 0;padding-left:16px;color:#667085;font-size:12px}
      .yunlv-live-row li{margin:3px 0}
      .yunlv-live-status{display:inline-flex;align-items:center;border-radius:999px;padding:4px 8px;font-size:12px;font-weight:900}
      .yunlv-live-status.orange{color:#f97316;background:#fff4e6}
      .yunlv-live-status.blue{color:#176bff;background:#edf5ff}
      .yunlv-live-status.green{color:#16a34a;background:#ecfdf3}
      .yunlv-live-status.red{color:#e23b2f;background:#fff1f0}
      .yunlv-live-status.gray{color:#667085;background:#f2f4f7}
      .yunlv-live-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
      .yunlv-live-actions button{flex:0 0 auto}
      .yunlv-live-inline-status,.yunlv-live-meta,.yunlv-live-empty,.yunlv-live-error{grid-column:1/-1;margin:6px 0 0;color:#667085;font-size:13px;line-height:1.45}
      .yunlv-live-error{color:#e23b2f}
      .yunlv-live-timeline{display:grid;gap:8px;margin-top:12px;border-left:2px solid #e7effa;padding-left:12px}
      .yunlv-live-timeline div{position:relative;display:grid;gap:2px}
      .yunlv-live-timeline i{position:absolute;left:-18px;top:4px;width:9px;height:9px;border-radius:50%;background:#176bff;box-shadow:0 0 0 4px #e9f2ff}
      .yunlv-live-timeline b{font-size:13px}
      .yunlv-live-timeline span{font-size:12px;color:#667085}
      .yunlv-live-dispatch-row{display:grid;grid-template-columns:1fr minmax(180px,240px) auto;gap:12px;align-items:center;border:1px solid #edf2f7;border-radius:12px;padding:12px;margin-top:10px}
      .yunlv-live-dispatch-row label{display:grid;gap:6px;font-size:12px;font-weight:800;color:#667085}
      .yunlv-live-dispatch-row select{border:1px solid #d7e1ef;border-radius:10px;padding:9px;background:#fff}
      .yunlv-live-chip-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:8px}
      .yunlv-live-chip-row button{white-space:nowrap;border-radius:999px;padding:7px 11px;color:#667085}
      .yunlv-live-chip-row button.is-active{background:#176bff;color:#fff;border-color:#176bff}
      .yunlv-live-metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .yunlv-live-metric-grid.admin{grid-template-columns:repeat(6,minmax(0,1fr))}
      .yunlv-live-metric-grid div{border:1px solid #edf2f7;border-radius:12px;background:#fbfdff;padding:10px;display:grid;gap:3px}
      .yunlv-live-metric-grid .yunlv-live-metric.green{border-color:#c7f2d7;background:#f0fdf5}.yunlv-live-metric-grid .yunlv-live-metric.orange{border-color:#fed7aa;background:#fff7ed}.yunlv-live-metric-grid .yunlv-live-metric.red{border-color:#fecaca;background:#fff5f5}.yunlv-live-metric-grid .yunlv-live-metric.blue{border-color:#bfdbfe;background:#eff6ff}
      .yunlv-live-metric-grid span{font-size:12px;color:#667085;font-weight:800}
      .yunlv-live-metric-grid b{font-size:20px;color:#101828;line-height:1.2}
      .yunlv-live-metric-grid small{font-size:12px;color:#667085}
      .yunlv-live-section-title{font-size:15px;margin:14px 0 8px;color:#101828;font-weight:900}
      .yunlv-live-requirement-chip{display:inline-flex;align-items:center;white-space:nowrap;border:1px solid #d8e3f4;border-radius:999px;background:#f8fbff;color:#475467;font-size:12px;font-weight:800;padding:6px 10px}
      .yunlv-device-card-grid,.yunlv-call-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .yunlv-device-card,.yunlv-call-grid article{border:1px solid #edf2f7;border-radius:14px;background:#fbfdff;padding:12px;display:grid;gap:10px}
      .yunlv-device-card.robot{background:#f7fbff}.yunlv-device-card.bracelet{background:#f4fff8}
      .yunlv-battery-bar{height:8px;border-radius:999px;background:#edf2f7;overflow:hidden}.yunlv-battery-bar i{display:block;height:100%;border-radius:999px}.yunlv-battery-bar i.green{background:#22c55e}.yunlv-battery-bar i.orange{background:#f59e0b}.yunlv-battery-bar i.red{background:#ef4444}
      .yunlv-linkage-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.yunlv-linkage-flow div{position:relative;border:1px solid #edf2f7;border-radius:12px;background:#fbfdff;padding:10px;display:grid;gap:6px}.yunlv-linkage-flow strong{font-size:13px}.yunlv-linkage-flow span{font-size:12px;color:#667085;line-height:1.4}.yunlv-linkage-flow em{position:absolute;right:-11px;top:50%;transform:translateY(-50%);font-style:normal;color:#98a2b3;font-weight:900}
      .yunlv-guardian-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.yunlv-guardian-grid button{text-align:left;color:#475467!important;border-color:#e5eef9!important;background:#fff!important;display:grid;gap:5px}.yunlv-guardian-grid button.is-on{border-color:#b7eccb!important;background:#f0fdf5!important;color:#15803d!important}.yunlv-guardian-grid strong{font-size:14px;color:#101828}.yunlv-guardian-grid span{font-size:12px;line-height:1.45}.yunlv-guardian-grid em{font-style:normal;font-size:12px;font-weight:900}
      .yunlv-call-grid article strong{font-size:14px;color:#101828}.yunlv-call-grid article span{font-size:12px;color:#667085}.yunlv-call-grid article div{display:flex;gap:8px;flex-wrap:wrap}
      .yunlv-emergency-sos-button{min-width:118px;background:#e23b2f!important;border-color:#e23b2f!important;color:#fff!important;box-shadow:0 12px 24px rgba(226,59,47,.22);border-radius:999px!important}
      .yunlv-emergency-location{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid #ffe0dc;border-radius:14px;background:#fff8f6;padding:12px;margin-bottom:10px}
      .yunlv-emergency-location div{display:grid;gap:4px}.yunlv-emergency-location strong{font-size:14px;color:#101828}.yunlv-emergency-location span{font-size:13px;color:#475467;line-height:1.45}.yunlv-emergency-location small{font-size:12px;color:#e23b2f}
      .yunlv-emergency-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .yunlv-emergency-contact-grid article{border:1px solid #edf2f7;border-radius:14px;background:#fbfdff;padding:12px;display:grid;gap:8px}
      .yunlv-emergency-contact-grid header{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.yunlv-emergency-contact-grid strong{font-size:14px;color:#101828}.yunlv-emergency-contact-grid span{font-size:12px;color:#667085}.yunlv-emergency-contact-grid article div{display:flex;gap:8px;flex-wrap:wrap}
      .yunlv-emergency-contact-form,.yunlv-emergency-health-form{margin-top:10px}
      .yunlv-live-check{align-content:end}.yunlv-live-check input{width:auto!important;margin-right:6px}
      .yunlv-emergency-chain{display:grid;gap:8px;border:1px solid #edf2f7;border-radius:14px;background:#fbfdff;padding:12px}
      .yunlv-emergency-chain div{display:grid;gap:3px;border-bottom:1px solid #edf2f7;padding-bottom:8px}.yunlv-emergency-chain div:last-child{border-bottom:0;padding-bottom:0}.yunlv-emergency-chain strong{font-size:13px;color:#101828}.yunlv-emergency-chain span{font-size:12px;color:#667085;line-height:1.45}
      .yunlv-live-admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
      .yunlv-live-admin-grid section{border:1px solid #edf2f7;border-radius:12px;background:#fbfdff;padding:12px}
      .yunlv-live-admin-grid h3{margin:0 0 10px;font-size:15px;color:#101828}
      .yunlv-live-mini-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;border-top:1px solid #edf2f7;padding:9px 0;font-size:13px}
      .yunlv-live-mini-row:first-of-type{border-top:0}
      .yunlv-live-mini-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .yunlv-live-mini-row small{color:#667085}
      .yunlv-live-form.compact-form{grid-template-columns:1fr 1fr;margin-top:10px}
      @media (max-width:720px){.yunlv-live-form,.yunlv-live-field-grid,.yunlv-live-dispatch-row,.yunlv-device-card-grid,.yunlv-call-grid,.yunlv-guardian-grid,.yunlv-emergency-location,.yunlv-emergency-contact-grid{grid-template-columns:1fr}.yunlv-live-row{grid-template-columns:1fr}.yunlv-live-row aside{text-align:left}.yunlv-live-actions button{flex:1 1 auto}.yunlv-linkage-flow{grid-template-columns:1fr}.yunlv-linkage-flow em{display:none}}
      @media (max-width:900px){.yunlv-live-metric-grid,.yunlv-live-metric-grid.admin,.yunlv-live-admin-grid{grid-template-columns:1fr 1fr}}
      @media (max-width:520px){.yunlv-live-metric-grid,.yunlv-live-metric-grid.admin,.yunlv-live-admin-grid{grid-template-columns:1fr}.yunlv-live-form.compact-form{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function startLiveRuntime() {
    injectLiveStyles();
    scheduleLiveModules(true);
    window.addEventListener("hashchange", () => scheduleLiveModules(true));
    document.addEventListener("change", (event) => {
      const select = event.target.closest?.("[data-guide-service-select]");
      if (!select) return;
      updateGuideOrderFieldInputs(select.closest('[data-yunlv-form="order"]'));
    });
    document.addEventListener("submit", (event) => {
      if (!event.target.closest("[data-yunlv-form]")) return;
      handleLiveSubmit(event).catch((error) => notify({ button: event.target }, error.message, "error"));
    });
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action], [data-yunlv-action], [data-add-cart]");
      if (!button) return;
      mirrorFrontendAction(button);
    }, true);
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-yunlv-action]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      handleLiveAction(button);
    }, true);
    const observer = new MutationObserver(() => scheduleLiveModules(false));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLiveRuntime, { once: true });
  } else {
    startLiveRuntime();
  }

  async function handleAction(ctx = {}) {
    const actionName = ctx.actionName || textOf(ctx.button) || "操作";
    const role = normalizeRole(ctx.role);
    const button = ctx.button;
    setBusy(button, true);
    try {
      if (isLocalUiOnlyAction(button, actionName)) return false;
      if (/全部已读|标记已读/.test(actionName)) {
        const result = await request("/api/messages/read-all", { method: "POST", body: { role: messageRole(role) } }, role);
        writeStatus(ctx, `已读 ${result.changed} 条消息，未读 ${result.unread} 条`);
        return false;
      }
      if (role === "elder" && /同步手环数据|立即同步/.test(actionName)) {
        const device = await request("/api/devices/device-001/sync", { method: "POST", body: {} }, role);
        writeStatus(ctx, `设备 ${device.deviceId} 已同步，电量 ${device.battery}%`);
        return false;
      }
      if (role === "elder" && /语音通话|视频通话/.test(actionName)) {
        const callType = /视频/.test(actionName) ? "video" : "voice";
        const result = await request("/api/devices/device-002/action", {
          method: "POST",
          body: { action: actionName, callType, contactId: "contact-001" },
        }, role);
        writeStatus(ctx, result.action?.result || `${actionName}已发起`);
        return true;
      }
      if (role === "elder" && /测试设备|麦克风测试|摄像头测试|扬声器测试|定位测试/.test(actionName)) {
        const result = await request("/api/devices/device-002/action", {
          method: "POST",
          body: { action: actionName },
        }, role);
        writeStatus(ctx, result.action?.result || "设备自检完成");
        return true;
      }
      if (role === "elder" && /摔倒检测|异常检测|离家|长时间未动|生命体征检测|用药提醒/.test(actionName)) {
        const featureMap = [
          [/摔倒检测/, "fallDetection"],
          [/异常检测/, "abnormalDetection"],
          [/离家|长时间未动/, "awayReminder"],
          [/生命体征/, "vitalSigns"],
          [/用药提醒/, "medicineReminder"],
        ];
        const match = featureMap.find(([pattern]) => pattern.test(actionName));
        const deviceId = match?.[1] === "vitalSigns" ? "device-001" : "device-002";
        const result = await request(`/api/devices/${deviceId}/action`, {
          method: "POST",
          body: { action: actionName, guardianFeature: match?.[1] || "guardian", enabled: true },
        }, role);
        writeStatus(ctx, result.action?.result || `${actionName}已开启`);
        return true;
      }
      if (role === "elder" && /一键紧急求助|SOS 紧急呼叫|SOS 一键求助/.test(actionName)) {
        await confirmAndTriggerSos(ctx, { location: "当前定位位置", accuracy: 35 });
        return true;
      }
      if (role === "elder" && /呼叫救护车|报警求助|联系医院|人工客服/.test(actionName)) {
        await createQuickEmergencyHelp(ctx, actionName, { location: "当前定位位置", accuracy: 35 });
        return true;
      }
      if (role === "elder" && /附近求助|联系社区|社区工作人员|呼叫附近人/.test(actionName)) {
        const requestItem = await request("/api/devices/help-request", {
          method: "POST",
          body: {
            target: /社区/.test(actionName) ? "社区工作人员" : "附近求助",
            providerType: "community",
            description: `${routeOf(ctx)} 页面触发：${actionName}`,
          },
        }, role);
        writeStatus(ctx, `帮助任务 ${requestItem.requestNo} 已生成，状态：${requestItem.status}`);
        return true;
      }
      if (role === "elder" && /保存个人资料/.test(actionName)) {
        await request("/api/user/profile", { method: "PUT", body: { updatedAt: new Date().toISOString() } }, role);
        writeStatus(ctx, "个人资料已保存到用户档案");
        return false;
      }
      if (role === "elder" && /立即报名|重新报名/.test(actionName)) {
        await joinDefaultActivity(ctx);
        return true;
      }
      if (role === "elder" && /预约服务|预约体检|预约用车|联系向导接送|发布求助需求/.test(actionName)) {
        await createServiceOrder(ctx, actionName);
        return true;
      }
      if (role === "guide" && /^(立即)?接单$/.test(actionName)) {
        await claimGuideTask(ctx);
        return true;
      }
      if (role === "guide" && /拒绝|忽略|申请取消|取消订单/.test(actionName)) {
        await guideTaskDecision(ctx, actionName);
        return true;
      }
      if (role === "guide" && /异常上报|上报异常|提交异常/.test(actionName)) {
        await reportGuideException(ctx, actionName);
        return true;
      }
      if (role === "guide" && /接单|开始服务|去服务|完成服务|提交完成/.test(actionName)) {
        await advanceGuideTask(ctx, actionName);
        return true;
      }
      if (role === "guide" && /上线|下线|接单状态|保存排班/.test(actionName)) {
        const guide = await request("/api/guide/online", { method: "POST", body: { guideId: "guide-001" } }, role);
        writeStatus(ctx, `向导状态：${guide.onlineStatus} / ${guide.currentStatus}`);
        return true;
      }
      if (role === "merchant" && /确认预约|提交报价|报价确认|完成服务|提交完成/.test(actionName)) {
        await advanceMerchantOrder(ctx, actionName);
        return true;
      }
      if (role === "merchant" && /下架服务/.test(actionName)) {
        const service = await request("/api/merchant/services/service-003/status", { method: "POST", body: { status: "下架" } }, role);
        writeStatus(ctx, `${service.title} 已${service.status}`);
        return true;
      }
      if (role === "merchant" && /保存并上架/.test(actionName)) {
        const service = await request("/api/merchant/services", { method: "POST", body: { title: "商户端新增服务", status: "上架" } }, role);
        writeStatus(ctx, `${service.title} 已上架并进入后台服务库`);
        return true;
      }
      if (role === "admin" && /一键派单|改派|指定执行方/.test(actionName)) {
        await adminDispatch(ctx);
        return true;
      }
      if (role === "admin" && /处理|关闭事件|派检修|标记误报|批量处理/.test(actionName)) {
        await adminHandleAlert(ctx, actionName);
        return true;
      }
      if (/提交异常|暂存草稿|确认提现|提交意见反馈|联系客服|联系客户|拨打|上传|添加|新增|保存|提交|发布|导入|导出|审核|驳回|收藏|点赞|有用|搜索|筛选|选择|解绑|解除|测试|授权|提醒|可见/.test(actionName)) {
        const action = await recordAction(ctx);
        writeStatus(ctx, action.result);
        return true;
      }
      return false;
    } catch (error) {
      writeStatus(ctx, error.message);
      notify(ctx, error.message, "error");
      return true;
    } finally {
      setBusy(button, false);
    }
  }

  async function onRoute(ctx = {}) {
    const role = normalizeRole(ctx.role);
    const target = ctx.to || ctx.target || "";
    const label = textOf(ctx.button);
    setBusy(ctx.button, true);
    try {
      if (role === "elder" && target === "order-detail" && /提交订单/.test(label)) {
        await createServiceOrder({ ...ctx, role, actionName: "提交订单" }, "陪伴就医");
        return false;
      }
      if (role === "elder" && routeOf(ctx) === "city" && target === "home") {
        const cityMatch = String(label || "").match(/(弥勒|昆明|大理|丽江|西双版纳|腾冲)/);
        if (cityMatch) {
          const result = await request("/api/user/home-city", { method: "POST", body: { city: cityMatch[1] } }, role);
          document.querySelectorAll("[data-current-city]").forEach((node) => {
            node.textContent = result.currentCity;
          });
          writeStatus(ctx, `当前城市已更新为 ${result.currentCity}`);
        }
        return false;
      }
      if (role === "elder" && target === "activity-records" && /报名/.test(label)) {
        await joinDefaultActivity({ ...ctx, role, actionName: label });
        return false;
      }
      if (role === "elder" && target === "sos-records" && /SOS|紧急求助|一键/.test(label)) {
        const alert = await confirmAndTriggerSos({ ...ctx, role, actionName: label }, { location: "当前定位位置", accuracy: 35 });
        return !alert;
      }
      if (role === "guide" && /^(立即)?接单$/.test(label)) {
        await claimGuideTask({ ...ctx, role, actionName: label });
        return false;
      }
      return false;
    } catch (error) {
      writeStatus(ctx, error.message);
      notify(ctx, error.message, "error");
      return true;
    } finally {
      setBusy(ctx.button, false);
    }
  }

  window.YunlvBusiness = {
    request,
    ensureAuth,
    handleAction,
    onRoute,
    recordAction,
    refreshLiveModules: () => Promise.resolve(),
  };
})();
