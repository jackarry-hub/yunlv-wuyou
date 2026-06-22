const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {
      await delay(120);
    }
  }
  throw new Error(`服务未启动。\n${output()}`);
}

async function text(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route}`);
  assert.equal(response.status, 200, `${route} should return 200`);
  return response.text();
}

async function json(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json", ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function login(baseUrl, role) {
  return json(baseUrl, "/api/auth/login", { method: "POST", body: { role } });
}

async function assertH5PagesUseLiveApi(baseUrl) {
  const [userPage, guidePage, merchantPage, adminPage, bridge, merchantApp, userApp, guideApp] = await Promise.all([
    text(baseUrl, "/user/"),
    text(baseUrl, "/guide/"),
    text(baseUrl, "/merchant/"),
    text(baseUrl, "/admin/"),
    text(baseUrl, "/shared/business-bridge.js"),
    text(baseUrl, "/merchant/app.js"),
    text(baseUrl, "/user/app.js"),
    text(baseUrl, "/guide/app.js"),
  ]);

  for (const [route, html] of [
    ["/user/", userPage],
    ["/guide/", guidePage],
    ["/merchant/", merchantPage],
  ]) {
    assert(html.includes("/shared/business-bridge.js"), `${route} must load the shared live API bridge`);
  }
  assert(adminPage.includes("管理后台"), "admin H5 should expose the management console");
  assert(bridge.includes("/api/orders"), "shared bridge must call order API");
  assert(bridge.includes("/api/tasks/dispatch"), "shared bridge must call dispatch API");
  assert(bridge.includes("/api/merchant/orders/"), "shared bridge must call merchant order API");
  assert(bridge.includes("/api/messages/read-all"), "shared bridge must call real message read API");
  assert(bridge.includes('localStorage.getItem("yunlv-show-live-modules") !== "0"'), "shared bridge must show live API modules by default");
  assert(!bridge.includes('localStorage.getItem("yunlv-show-live-modules") === "1"'), "shared bridge must not hide live API modules behind a manual opt-in");
  assert(bridge.includes("mirrorFrontendAction"), "shared bridge must mirror ordinary frontend clicks to admin");
  assert(bridge.includes("/api/ui/actions"), "shared bridge must record frontend actions for admin query");
  assert(merchantApp.includes("syncMerchantOrderAction"), "merchant H5 order buttons must use API sync");
  assert(merchantApp.includes("/api/merchant/orders/"), "merchant H5 order buttons must call merchant API");
  assert(merchantApp.includes("hydrateMerchantApiData"), "merchant H5 business pages must hydrate static sources from API data");
  assert(merchantApp.includes("/api/merchant/dashboard?merchantId=merchant-001"), "merchant H5 workbench must render backend dashboard data");
  assert(merchantApp.includes("/api/merchant/services?merchantId=merchant-001"), "merchant H5 services must render backend services");
  assert(merchantApp.includes("/api/messages?role=merchant"), "merchant H5 messages must render backend merchant messages");
  assert(merchantApp.includes("applyMerchantApiData"), "merchant H5 must replace static service/order sources with backend data");
  assert(merchantApp.includes("normalizeMerchantRouteHash"), "merchant H5 must resolve real merchant page hash routes");
  assert(merchantApp.includes('"/pages/merchant/services": "19"'), "merchant H5 services route must stay in merchant context");
  assert(merchantApp.includes('"/pages/merchant/orders": "20"'), "merchant H5 orders route must stay in merchant context");
  assert(merchantApp.includes('"/pages/merchant/workbench": "24"'), "merchant H5 workbench route must stay in merchant context");
  assert(userApp.includes("data-guide-order-form"), "user H5 guide page must expose an editable guide order form");
  assert(userApp.includes("submitGuideOrderForm"), "user H5 guide form must submit to API instead of static navigation");
  assert(userApp.includes("/api/orders"), "user H5 guide form must create real orders");
  assert(userApp.includes("hydrateUserApiData"), "user H5 pages must hydrate static regions from API data");
  assert(userApp.includes("hydrateOrdersFromApi"), "user H5 order list must render backend orders");
  assert(userApp.includes("/api/messages?role=user"), "user H5 messages must render backend messages");
  assert(userApp.includes("/api/family-contacts"), "user H5 contacts must render backend emergency contacts");
  assert(userApp.includes("/api/user/family"), "user H5 family page must render the backend family aggregate");
  assert(userApp.includes("/api/user/family/permissions"), "user H5 family permission switches must persist to the backend");
  assert(userApp.includes("/api/user/family/invitations"), "user H5 family invitations must be created by the backend");
  assert(userApp.includes("/api/alerts/emergency-requirements"), "user H5 SOS records must render backend alerts");
  assert(userApp.includes("hydrateEmergencyFromApi"), "user H5 emergency page must hydrate contacts, location, health and quick-help channels from API data");
  assert(userApp.includes("emergencyPageState"), "user H5 emergency page must keep the current backend emergency state");
  assert(userApp.includes('href="tel:${attr(dialNumber)}"'), "user H5 emergency contact actions must expose native tel links");
  assert(userApp.includes("/api/alerts/emergency-settings"), "user H5 contact notification rules must persist through the backend API");
  assert(userApp.includes("/api/health/overview"), "user H5 health pages must render backend health overview");
  assert(userApp.includes("/api/health/record"), "user H5 health record must render and edit the persisted health record");
  assert(userApp.includes("/api/health/record/sync"), "user H5 health record sync must call the backend device sync API");
  assert(userApp.includes("/api/user/health-services"), "user H5 health services must render and submit backend health service requests");
  assert(userApp.includes("/api/user/destinations"), "user H5 destinations must render and submit backend destination requests");
  assert(userApp.includes("hydrateDestinationsFromApi"), "user H5 destinations must hydrate from backend destination data");
  assert(userApp.includes("healthRecordState"), "user H5 health record must keep the current backend aggregate state");
  assert(userApp.includes("hydrateServiceRecordsFromApi"), "user H5 service records must render backend service history");
  assert(userApp.includes("/api/user/service-records"), "user H5 service records must call user service record API");
  assert(userApp.includes("hydrateActivityMapFromApi"), "user H5 activity map must render backend activity points");
  assert(userApp.includes("/api/activities/map"), "user H5 activity map must call activity map API");
  assert(userApp.includes("hydrateActivityRecordsFromApi"), "user H5 activity records must render backend activities");
  assert(userApp.includes("guardUserEndpointClick"), "user H5 must block same-origin cross-endpoint navigation inside the user endpoint");
  assert(userApp.includes("userUrlLeavesEndpoint"), "user H5 must classify user/guide/merchant/admin endpoint boundaries");
  assert(userApp.includes("normalizeUserRouteId(window.location.hash)"), "user H5 must normalize numeric, alias and page-path hashes before rendering");
  assert(userApp.includes("用户端导航目标无效"), "user H5 must reject invalid route targets instead of falling through to another endpoint");
  assert(userApp.includes("submitShopCheckout"), "user H5 shop checkout must submit through API");
  assert(userApp.includes("providerType: \"merchant\""), "user H5 shop checkout must create merchant-linked orders");
  assert(userApp.includes("items: shopCartItems"), "user H5 shop checkout must persist selected product details");
  assert(userApp.includes("submitEmergencySos"), "user H5 emergency page must submit SOS through API");
  assert(userApp.includes("/api/alerts/sos"), "user H5 emergency page must create backend alerts");
  assert(userApp.includes("/api/alerts/quick-help"), "user H5 emergency quick help must call backend API");
  assert(userApp.includes("/api/family-contacts/${contactId}/call"), "user H5 emergency contact call must use contact API");
  assert(guideApp.includes("hydrateGuideApiData"), "guide H5 pages must hydrate local task screens from API data");
  assert(guideApp.includes("/api/guide/dashboard?guideId=guide-001"), "guide H5 must render dashboard tasks from guide API");
  assert(guideApp.includes("/api/guide/messages?guideId=guide-001"), "guide H5 messages must render backend guide messages through page aggregate API");
  assert(guideApp.includes("hydrateGuideMessagesCenterFromApi"), "guide H5 messages must hydrate the guide message center aggregate");
  assert(guideApp.includes("messagesLoading"), "guide H5 messages must distinguish loading from empty data");
  assert(guideApp.includes("data-guide-message-list"), "guide H5 messages must render latest backend message rows");
  assert(guideApp.includes("data-guide-message-state=\"empty\""), "guide H5 messages must render a real empty state after successful empty API responses");
  assert(guideApp.includes("GUIDE_ROUTE_LOAD_TIMEOUT_MS"), "guide route navigation must expose a loading timeout");
  assert(guideApp.includes("guideRouteFallbackStatusHtml"), "guide route navigation must show a fallback action when map/location fails");
  assert(guideApp.includes("guideRouteState"), "guide route navigation must distinguish loading, ready, slow, and fallback states");
  assert(guideApp.includes("applyGuideDashboardData"), "guide H5 must replace static order source with backend tasks");
  assert(guideApp.includes("guideHomeRecommendEmptyHtml"), "guide home empty recommendation state must be explicit");
  assert(guideApp.includes("这是正常数据状态"), "guide home empty recommendation state must explain empty backend queue as normal");
  assert(!guideApp.includes("暂无${activeHomeCategory}推荐订单"), "guide home must not render ambiguous all-category empty wording");
  assert(guideApp.includes("guide-price-inline"), "guide H5 hall order prices must stay as one inline visual unit");
}

async function main() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-h5-linkage-"));
  let logs = "";
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), YUNLV_RUNTIME_DIR: runtimeDir },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => {
    logs += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    logs += chunk.toString();
  });

  try {
    await waitForServer(baseUrl, () => logs);
    await assertH5PagesUseLiveApi(baseUrl);

    const elder = await login(baseUrl, "elder");
    const family = await login(baseUrl, "family");
    const guide = await login(baseUrl, "guide");
    const merchant = await login(baseUrl, "merchant");
    const admin = await login(baseUrl, "admin");
    await json(baseUrl, "/api/admin/demo/reset", { method: "POST", token: admin.token, body: {} });

    const guideMessages = await json(baseUrl, "/api/messages?role=guide", { token: guide.token });
    assert(guideMessages.length > 0, "guide messages API should return task-derived messages for the guide message page");
    assert(guideMessages.some((item) => item.toRole === "guide" && item.title && item.content), "guide messages must have renderable title/content");

    const ordinaryUserAction = await json(baseUrl, "/api/ui/actions", {
      method: "POST",
      token: elder.token,
      body: { role: "user", route: "profile", action: "添加紧急联系人", target: "family-contact", payload: { source: "h5-linkage-test" } },
    });
    await json(baseUrl, "/api/ui/actions", {
      method: "POST",
      token: guide.token,
      body: { role: "guide", route: "01", action: "筛选附近订单", target: "order-hall", payload: { source: "h5-linkage-test" } },
    });
    await json(baseUrl, "/api/ui/actions", {
      method: "POST",
      token: merchant.token,
      body: { role: "merchant", route: "19", action: "筛选服务订单", target: "merchant-orders", payload: { source: "h5-linkage-test" } },
    });
    const adminUiActions = await json(baseUrl, "/api/admin/ui-actions", { token: admin.token });
    assert(adminUiActions.some((item) => item.id === ordinaryUserAction.id), "用户端普通功能按钮动作应沉淀到后台前端动作列表");
    assert(adminUiActions.some((item) => item.role === "guide" && item.action === "筛选附近订单"), "向导端普通按钮动作应沉淀到后台前端动作列表");
    assert(adminUiActions.some((item) => item.role === "merchant" && item.action === "筛选服务订单"), "商户端普通按钮动作应沉淀到后台前端动作列表");

    const ai = await json(baseUrl, "/api/ai/chat", {
      method: "POST",
      token: elder.token,
      body: { question: "推荐一个今天附近的活动，再帮我找人工向导服务" },
    });
    assert(ai.answer && ai.intent, "用户端 AI/人工向导入口应写入 AI 对话记录");
    const aiHistory = await json(baseUrl, "/api/ai/history", { token: elder.token });
    assert(aiHistory.some((item) => item.id === ai.id), "AI 历史应能被重新查询");

    const activities = await json(baseUrl, "/api/activities/map", { token: elder.token });
    assert(activities.length > 0, "活动地图应由 API 返回点位");
    const signup = await json(baseUrl, `/api/activities/${activities[0].id}/join`, {
      method: "POST",
      token: elder.token,
      body: { name: "李秀兰", gender: "女", age: 68, phone: "13800005678", count: 1 },
    });
    assert.equal(signup.signup.status, "已报名");

    const guideOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        elderName: "李秀兰",
        serviceType: "陪伴就医",
        providerType: "guide",
        amount: 120,
        time: "2026-06-10 09:30",
        location: "昆明市第一人民医院",
        source: "H5 用户端旅居管家下单",
      },
    });
    const pending = await json(baseUrl, "/api/admin/dispatch/pending", { token: admin.token });
    assert(pending.pendingOrders.some((order) => order.id === guideOrder.id), "后台待派单列表应看到用户端新订单");
    const dispatched = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: guideOrder.id, assigneeType: "guide", assigneeId: "guide-001" },
    });
    let guideDashboard = await json(baseUrl, "/api/guide/dashboard", { token: guide.token });
    assert(guideDashboard.tasks.some((task) => task.id === dispatched.task.id), "向导端任务列表应看到后台派单");
    await json(baseUrl, `/api/tasks/${dispatched.task.id}/accept`, { method: "POST", token: guide.token, body: {} });
    await json(baseUrl, `/api/tasks/${dispatched.task.id}/start`, { method: "POST", token: guide.token, body: {} });
    const guideAlert = await json(baseUrl, "/api/guide/exception", {
      method: "POST",
      token: guide.token,
      body: { taskId: dispatched.task.id, type: "服务异常", description: "H5 多端联动验收异常上报" },
    });
    const adminAlerts = await json(baseUrl, "/api/admin/alerts", { token: admin.token });
    assert(adminAlerts.some((alert) => alert.id === guideAlert.alert.id), "后台应看到向导端异常上报");
    await json(baseUrl, `/api/alerts/${guideAlert.alert.id}/handle`, {
      method: "POST",
      token: admin.token,
      body: { result: "后台已处理 H5 联动异常" },
    });
    await json(baseUrl, `/api/tasks/${dispatched.task.id}/complete`, { method: "POST", token: guide.token, body: { evidence: "h5-linkage" } });
    const userOrderAfterGuide = await json(baseUrl, `/api/orders/${guideOrder.id}`, { token: elder.token });
    assert.equal(userOrderAfterGuide.status, "待确认", "向导完成后用户端订单应进入待确认");
    const guideConfirmed = await json(baseUrl, `/api/orders/${guideOrder.id}/confirm`, {
      method: "POST",
      token: elder.token,
      body: { rating: 5, review: "H5 多端联动验收：向导服务完成。" },
    });
    assert.equal(guideConfirmed.status, "已完成");

    const merchantService = await json(baseUrl, "/api/merchant/services", {
      method: "POST",
      token: merchant.token,
      body: { title: "H5 联动上门护理", category: "康养护理", price: 268, description: "H5 商户端发布服务" },
    });
    await json(baseUrl, `/api/admin/services/${merchantService.id}/status`, {
      method: "POST",
      token: admin.token,
      body: { status: "上架" },
    });
    const merchantOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        elderName: "李秀兰",
        serviceType: "上门护理评估",
        providerType: "merchant",
        amount: 260,
        time: "2026-06-10 15:00",
        location: "翠湖康养公寓",
        source: "H5 用户端商户服务下单",
      },
    });
    const shopOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        elderName: "李秀兰",
        serviceType: "优选商城商品结算",
        providerType: "merchant",
        providerId: "merchant-001",
        amount: 288,
        phone: "13800005678",
        location: "翠湖康养公寓",
        source: "H5 用户端优选商城",
        note: "商城结算：智能血压计x1、防滑助行手杖x1。",
        items: [
          { name: "智能血压计", price: 199, quantity: 1 },
          { name: "防滑助行手杖", price: 89, quantity: 1 },
        ],
      },
    });
    const merchantOrdersAfterShop = await json(baseUrl, "/api/merchant/orders", { token: merchant.token });
    assert(merchantOrdersAfterShop.some((order) => order.id === shopOrder.id && order.items?.length === 2), "商城结算订单应同步到商户端并保留商品明细");
    const adminOrdersAfterShop = await json(baseUrl, "/api/admin/orders", { token: admin.token });
    assert(adminOrdersAfterShop.some((order) => order.id === shopOrder.id && order.source === "H5 用户端优选商城"), "商城结算订单应同步到后台订单列表");
    await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: merchantOrder.id, assigneeType: "merchant", assigneeId: "merchant-001" },
    });
    let merchantDashboard = await json(baseUrl, "/api/merchant/dashboard", { token: merchant.token });
    assert(merchantDashboard.orders.some((order) => order.id === merchantOrder.id), "商户端应看到用户端/后台生成的预约");
    const quoted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/quote`, {
      method: "POST",
      token: merchant.token,
      body: { amount: 280, plan: "H5 商户端报价方案" },
    });
    assert.equal(quoted.status, "已报价");
    const userMessagesAfterQuote = await json(baseUrl, "/api/messages?role=user", { token: elder.token });
    assert(userMessagesAfterQuote.some((message) => message.relatedId === merchantOrder.id && message.title.includes("报价")), "商户报价应同步成用户端消息");
    const adminOrderAfterQuote = await json(baseUrl, `/api/orders/${merchantOrder.id}`, { token: admin.token });
    assert.equal(adminOrderAfterQuote.status, "已报价", "后台订单应同步商户报价状态");
    await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/confirm`, { method: "POST", token: merchant.token, body: {} });
    const merchantStarted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/start`, { method: "POST", token: merchant.token, body: {} });
    assert.equal(merchantStarted.status, "服务中");
    const merchantCompleted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/complete`, { method: "POST", token: merchant.token, body: {} });
    assert.equal(merchantCompleted.status, "待确认");
    const merchantConfirmed = await json(baseUrl, `/api/orders/${merchantOrder.id}/confirm`, {
      method: "POST",
      token: elder.token,
      body: { rating: 5, review: "H5 多端联动验收：商户服务完成。" },
    });
    assert.equal(merchantConfirmed.status, "已完成");
    const merchantReviews = await json(baseUrl, "/api/merchant/reviews", { token: merchant.token });
    assert(merchantReviews.some((review) => review.orderId === merchantOrder.id), "商户端应能看到用户评价");

    const sos = await json(baseUrl, "/api/alerts/sos", {
      method: "POST",
      token: elder.token,
      body: { location: "昆明市五华区翠湖公园", description: "H5 用户端 SOS 验收" },
    });
    const adminSosList = await json(baseUrl, "/api/admin/alerts", { token: admin.token });
    assert(adminSosList.some((alert) => alert.id === sos.id), "用户端 SOS 应同步到后台异常列表");
    const familyAfterSos = await json(baseUrl, "/api/messages?role=family", { token: family.token });
    assert(familyAfterSos.some((message) => message.relatedId === sos.id), "用户端 SOS 应同步通知紧急联系人/家属端");
    const contacts = await json(baseUrl, "/api/family-contacts", { token: elder.token });
    const contactCall = await json(baseUrl, `/api/family-contacts/${contacts[0].id}/call`, {
      method: "POST",
      token: elder.token,
      body: { route: "emergency" },
    });
    assert.equal(contactCall.dialNumber, contacts[0].phone, "紧急联系人拨打应返回真实号码");
    const quickHelp = await json(baseUrl, "/api/alerts/quick-help", {
      method: "POST",
      token: elder.token,
      body: { channelKey: "ambulance", location: "昆明市五华区翠湖公园" },
    });
    assert.equal(quickHelp.dialNumber, "120", "快速求助应返回可拨打号码");
    await json(baseUrl, `/api/alerts/${sos.id}/handle`, { method: "POST", token: admin.token, body: { result: "后台已处理 SOS" } });

    const beforeReadAll = await json(baseUrl, "/api/messages?role=user", { token: elder.token });
    assert(beforeReadAll.some((message) => !message.read), "用户端应存在跨端通知未读消息");
    const readAll = await json(baseUrl, "/api/messages/read-all", { method: "POST", token: elder.token, body: { role: "user" } });
    assert.equal(readAll.unread, 0, "用户端全部已读应真正清零未读");

    const dataLoop = await json(baseUrl, "/api/admin/data-loop", { token: admin.token });
    assert(dataLoop.summary.orders >= 2, "后台数据闭环应沉淀订单数据");
    assert(dataLoop.summary.reviews >= 2, "后台数据闭环应沉淀评价数据");
    assert(dataLoop.summary.activitySignups >= 1, "后台数据闭环应沉淀活动报名数据");
    assert(dataLoop.summary.openAlerts >= 0, "后台数据闭环应可查询异常处理数据");

    console.log(`h5 multi-end linkage ok: ${baseUrl}`);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
