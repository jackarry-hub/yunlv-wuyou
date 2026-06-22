const assert = require("assert");
const { execFileSync, spawn } = require("child_process");
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
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (_) {
      await delay(120);
    }
  }
  throw new Error(`服务未启动。\n${output()}`);
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
  if (!response.ok || !payload.success) {
    throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  }
  return payload.data;
}

async function text(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route}`);
  assert.equal(response.status, 200, `${route} should return 200`);
  return response.text();
}

async function login(baseUrl, role, phone) {
  return json(baseUrl, "/api/auth/login", { method: "POST", body: { role, phone } });
}

async function assertButtonAndRouteCoverage(baseUrl) {
  const [userHtml, guideHtml, merchantHtml, adminHtml, userApp, guideApp, merchantApp, adminApp] = await Promise.all([
    text(baseUrl, "/user/"),
    text(baseUrl, "/guide/"),
    text(baseUrl, "/merchant/"),
    text(baseUrl, "/admin/"),
    text(baseUrl, "/user/app.js"),
    text(baseUrl, "/guide/app.js"),
    text(baseUrl, "/merchant/app.js"),
    text(baseUrl, "/admin/app.js"),
  ]);

  for (const [route, html] of [["/user/", userHtml], ["/guide/", guideHtml], ["/merchant/", merchantHtml]]) {
    assert(html.includes("/shared/business-bridge.js"), `${route} must load shared API bridge`);
  }
  assert(adminHtml.includes("管理后台"), "admin console should render");

  const forbidden = [
    "状态已更新",
    "操作成功",
    "操作已处理",
    "通知已处理",
    "流程已准备",
    "入口已准备",
    "请在当前页继续操作",
    "操作面板已展开",
    "数据已从后台接口重新同步",
  ];
  for (const [name, source] of [["user", userApp], ["guide", guideApp], ["merchant", merchantApp], ["admin", adminApp]]) {
    for (const phrase of forbidden) {
      assert(!source.includes(phrase), `${name} should not include fake feedback phrase: ${phrase}`);
    }
  }

  const uiAudit = execFileSync(process.execPath, [path.join(root, "scripts/ui-route-audit.js")], {
    cwd: root,
    encoding: "utf8",
  });
  assert(uiAudit.includes("passive=0"), "ui route audit must report passive=0 for endpoints");
  assert(uiAudit.includes("ui route audit ok"), "ui route audit should pass");

  const navigationAudit = execFileSync(process.execPath, [path.join(root, "scripts/navigation-target-integrity-test.js")], {
    cwd: root,
    encoding: "utf8",
  });
  assert(navigationAudit.includes("navigation target integrity ok"), "navigation target audit should pass");
}

async function assertBusinessInteroperability(baseUrl) {
  const admin = await login(baseUrl, "admin");
  await json(baseUrl, "/api/admin/demo/reset", { method: "POST", token: admin.token, body: {} });
  const subjects = await json(baseUrl, "/api/admin/demo/create-subjects", {
    method: "POST",
    token: admin.token,
    body: {
      suffix: "660901",
      elderName: "验收老人李阿姨",
      familyName: "验收家属张女士",
      guideName: "验收向导赵师傅",
      merchantName: "验收康养护理站",
      merchantType: "康养护理",
    },
  });

  const elder = await login(baseUrl, "elder", subjects.user.phone);
  const family = await login(baseUrl, "family", subjects.familyUser.phone);
  const guide = await login(baseUrl, "guide", subjects.guideUser.phone);
  const merchant = await login(baseUrl, "merchant", subjects.merchantUser.phone);

  assert.equal(elder.user.id, subjects.user.id, "created elder should be able to login by phone");
  assert.equal(guide.user.id, subjects.guideUser.id, "created guide should be able to login by phone");
  assert.equal(merchant.user.id, subjects.merchantUser.id, "created merchant should be able to login by phone");

  const guidesBeforeAudit = await json(baseUrl, "/api/admin/guides", { token: admin.token });
  assert(guidesBeforeAudit.some((item) => item.id === subjects.guide.id && item.status === "待审核"), "admin should see created guide pending audit");
  const merchantsBeforeAudit = await json(baseUrl, "/api/admin/merchants", { token: admin.token });
  assert(merchantsBeforeAudit.some((item) => item.id === subjects.merchant.id && item.status === "待审核"), "admin should see created merchant pending audit");

  await json(baseUrl, `/api/admin/guides/${subjects.guide.id}/audit`, {
    method: "POST",
    token: admin.token,
    body: { decision: "通过审核" },
  });
  await json(baseUrl, `/api/admin/merchants/${subjects.merchant.id}/audit`, {
    method: "POST",
    token: admin.token,
    body: { decision: "通过入驻" },
  });
  await json(baseUrl, `/api/admin/services/${subjects.merchantService.id}/status`, {
    method: "POST",
    token: admin.token,
    body: { status: "上架" },
  });

  const uiAction = await json(baseUrl, "/api/ui/actions", {
    method: "POST",
    token: elder.token,
    body: { role: "user", route: "assistant", action: "点赞回答", target: "assistant-feedback", payload: { visualOnly: true } },
  });
  const adminUiActions = await json(baseUrl, "/api/admin/ui-actions", { token: admin.token });
  assert(adminUiActions.some((item) => item.id === uiAction.id), "ordinary UI actions should be queryable in admin");

  const ai = await json(baseUrl, "/api/ai/chat", {
    method: "POST",
    token: elder.token,
    body: { question: "今天帮我推荐活动和人工向导服务" },
  });
  assert(ai.answer && ai.intent, "AI steward should return answer and intent");
  const aiHistory = await json(baseUrl, "/api/ai/history", { token: elder.token });
  assert(aiHistory.some((item) => item.id === ai.id), "AI chat should persist to history");

  const activities = await json(baseUrl, "/api/activities/map", { token: elder.token });
  assert(activities.length > 0, "activity map should return real API points");
  const signup = await json(baseUrl, `/api/activities/${activities[0].id}/join`, {
    method: "POST",
    token: elder.token,
    body: { name: "验收老人李阿姨", gender: "女", age: 70, phone: subjects.user.phone, count: 1 },
  });
  assert.equal(signup.signup.status, "已报名", "activity signup should persist");

  await json(baseUrl, "/api/guide/online", {
    method: "POST",
    token: guide.token,
    body: { guideId: subjects.guide.id, onlineStatus: "在线", currentStatus: "空闲中" },
  });

  const guideOrder = await json(baseUrl, "/api/orders", {
    method: "POST",
    token: elder.token,
    body: {
      userId: subjects.user.id,
      elderName: "验收老人李阿姨",
      serviceType: "陪伴就医",
      providerType: "guide",
      amount: 120,
      time: "2026-06-10 09:30",
      location: "昆明市第一人民医院",
      source: "综合验收用户端下单",
    },
  });
  const pending = await json(baseUrl, "/api/admin/dispatch/pending", { token: admin.token });
  assert(pending.pendingOrders.some((order) => order.id === guideOrder.id), "admin dispatch list should include user guide order");
  const dispatched = await json(baseUrl, "/api/tasks/dispatch", {
    method: "POST",
    token: admin.token,
    body: { orderId: guideOrder.id, assigneeType: "guide", assigneeId: subjects.guide.id },
  });
  const guideDashboard = await json(baseUrl, `/api/guide/dashboard?guideId=${subjects.guide.id}`, { token: guide.token });
  assert(guideDashboard.tasks.some((task) => task.id === dispatched.task.id), "guide task list should include dispatched task");
  await json(baseUrl, `/api/tasks/${dispatched.task.id}/accept`, { method: "POST", token: guide.token, body: {} });
  await json(baseUrl, `/api/tasks/${dispatched.task.id}/start`, { method: "POST", token: guide.token, body: {} });
  const guideAlert = await json(baseUrl, "/api/guide/exception", {
    method: "POST",
    token: guide.token,
    body: { guideId: subjects.guide.id, taskId: dispatched.task.id, type: "服务异常", description: "综合验收向导异常上报" },
  });
  const adminAlerts = await json(baseUrl, "/api/admin/alerts", { token: admin.token });
  assert(adminAlerts.some((alert) => alert.id === guideAlert.alert.id), "admin should see guide exception");
  await json(baseUrl, `/api/alerts/${guideAlert.alert.id}/handle`, {
    method: "POST",
    token: admin.token,
    body: { result: "综合验收后台处理向导异常" },
  });
  await json(baseUrl, `/api/tasks/${dispatched.task.id}/complete`, {
    method: "POST",
    token: guide.token,
    body: { evidence: "full-interoperability-test" },
  });
  const guideOrderAfterComplete = await json(baseUrl, `/api/orders/${guideOrder.id}`, { token: elder.token });
  assert.equal(guideOrderAfterComplete.status, "待确认", "guide completion should move order to user confirmation");
  const guideConfirmed = await json(baseUrl, `/api/orders/${guideOrder.id}/confirm`, {
    method: "POST",
    token: elder.token,
    body: { rating: 5, review: "综合验收：向导服务完成" },
  });
  assert.equal(guideConfirmed.status, "已完成", "user confirmation should complete guide order");
  const guideIncome = await json(baseUrl, `/api/guide/income?guideId=${subjects.guide.id}`, { token: guide.token });
  assert(guideIncome.stats.completedOrders >= 1, "guide income should include completed order");

  const merchantService = await json(baseUrl, "/api/merchant/services", {
    method: "POST",
    token: merchant.token,
    body: {
      providerId: subjects.merchant.id,
      title: "综合验收营养餐配送",
      category: "餐饮与本地美食",
      price: 88,
      description: "综合验收商户发布服务",
    },
  });
  await json(baseUrl, `/api/admin/services/${merchantService.id}/status`, {
    method: "POST",
    token: admin.token,
    body: { status: "上架" },
  });
  const merchantServices = await json(baseUrl, `/api/merchant/services?merchantId=${subjects.merchant.id}`, { token: merchant.token });
  assert(merchantServices.some((item) => item.id === merchantService.id && item.status === "上架"), "merchant service should be published and queryable");

  const merchantOrder = await json(baseUrl, "/api/orders", {
    method: "POST",
    token: elder.token,
    body: {
      userId: subjects.user.id,
      elderName: "验收老人李阿姨",
      serviceType: "上门护理评估",
      providerType: "merchant",
      providerId: subjects.merchant.id,
      amount: 260,
      time: "2026-06-10 15:00",
      location: "昆明市五华区验收服务中心",
      source: "综合验收用户端商户预约",
    },
  });
  await json(baseUrl, "/api/tasks/dispatch", {
    method: "POST",
    token: admin.token,
    body: { orderId: merchantOrder.id, assigneeType: "merchant", assigneeId: subjects.merchant.id },
  });
  const merchantDashboard = await json(baseUrl, `/api/merchant/dashboard?merchantId=${subjects.merchant.id}`, { token: merchant.token });
  assert(merchantDashboard.orders.some((order) => order.id === merchantOrder.id), "merchant dashboard should include user appointment");
  const quoted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/quote`, {
    method: "POST",
    token: merchant.token,
    body: { merchantId: subjects.merchant.id, amount: 280, plan: "综合验收商户报价方案" },
  });
  assert.equal(quoted.status, "已报价", "merchant quote should update order status");
  const userMessagesAfterQuote = await json(baseUrl, "/api/messages?role=user", { token: elder.token });
  assert(userMessagesAfterQuote.some((message) => message.relatedId === merchantOrder.id && message.title.includes("报价")), "merchant quote should notify user");
  await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/confirm`, {
    method: "POST",
    token: merchant.token,
    body: { merchantId: subjects.merchant.id },
  });
  const merchantStarted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/start`, {
    method: "POST",
    token: merchant.token,
    body: { merchantId: subjects.merchant.id },
  });
  assert.equal(merchantStarted.status, "服务中", "merchant start should move order into service");
  const merchantCompleted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/complete`, {
    method: "POST",
    token: merchant.token,
    body: { merchantId: subjects.merchant.id },
  });
  assert.equal(merchantCompleted.status, "待确认", "merchant complete should wait for user confirmation");
  const merchantConfirmed = await json(baseUrl, `/api/orders/${merchantOrder.id}/confirm`, {
    method: "POST",
    token: elder.token,
    body: { rating: 5, review: "综合验收：商户服务完成" },
  });
  assert.equal(merchantConfirmed.status, "已完成", "user confirmation should complete merchant order");
  const merchantReviews = await json(baseUrl, `/api/merchant/reviews?merchantId=${subjects.merchant.id}`, { token: merchant.token });
  assert(merchantReviews.some((review) => review.orderId === merchantOrder.id), "merchant should see completed review");

  const shopOrder = await json(baseUrl, "/api/orders", {
    method: "POST",
    token: elder.token,
    body: {
      userId: subjects.user.id,
      elderName: "验收老人李阿姨",
      serviceType: "优选商城商品结算",
      providerType: "merchant",
      providerId: subjects.merchant.id,
      amount: 288,
      phone: subjects.user.phone,
      location: "昆明市五华区验收服务中心",
      source: "综合验收优选商城",
      note: "智能血压计x1、防滑助行手杖x1",
      items: [
        { name: "智能血压计", price: 199, quantity: 1 },
        { name: "防滑助行手杖", price: 89, quantity: 1 },
      ],
    },
  });
  const merchantOrdersAfterShop = await json(baseUrl, `/api/merchant/orders?merchantId=${subjects.merchant.id}`, { token: merchant.token });
  assert(merchantOrdersAfterShop.some((order) => order.id === shopOrder.id && order.items?.length === 2), "shop checkout should sync to merchant orders with items");

  const sos = await json(baseUrl, "/api/alerts/sos", {
    method: "POST",
    token: elder.token,
    body: { location: "昆明市五华区翠湖公园", description: "综合验收 SOS" },
  });
  const adminSos = await json(baseUrl, "/api/admin/alerts", { token: admin.token });
  assert(adminSos.some((alert) => alert.id === sos.id), "SOS should sync to admin alerts");
  const familyMessages = await json(baseUrl, "/api/messages?role=family", { token: family.token });
  assert(familyMessages.some((message) => message.relatedId === sos.id), "SOS should notify family role");
  const contacts = await json(baseUrl, "/api/family-contacts", { token: elder.token });
  const createdContact = contacts.find((contact) => contact.id === subjects.familyContact.id) || contacts[0];
  const call = await json(baseUrl, `/api/family-contacts/${createdContact.id}/call`, {
    method: "POST",
    token: elder.token,
    body: { route: "emergency" },
  });
  assert.equal(call.dialNumber, createdContact.phone, "emergency contact call should return dialable phone");
  const quickHelp = await json(baseUrl, "/api/alerts/quick-help", {
    method: "POST",
    token: elder.token,
    body: { channelKey: "ambulance", location: "昆明市五华区翠湖公园" },
  });
  assert.equal(quickHelp.dialNumber, "120", "quick help should return emergency phone number");

  const unreadBefore = await json(baseUrl, "/api/messages?role=user", { token: elder.token });
  assert(unreadBefore.some((message) => !message.read), "user should have unread cross-end messages");
  const readAll = await json(baseUrl, "/api/messages/read-all", { method: "POST", token: elder.token, body: { role: "user" } });
  assert.equal(readAll.unread, 0, "read-all should clear unread count");

  const dataLoop = await json(baseUrl, "/api/admin/data-loop", { token: admin.token });
  assert(dataLoop.summary.users >= 5, "admin data loop should expose users");
  assert(dataLoop.summary.orders >= 3, "admin data loop should expose orders");
  assert(dataLoop.summary.reviews >= 2, "admin data loop should expose reviews");
  assert(dataLoop.summary.activitySignups >= 1, "admin data loop should expose activity signups");

  return {
    subjects,
    guideOrder: guideOrder.id,
    merchantOrder: merchantOrder.id,
    shopOrder: shopOrder.id,
    sos: sos.id,
  };
}

async function main() {
  if (process.env.YUNLV_TEST_BASE_URL) {
    const baseUrl = process.env.YUNLV_TEST_BASE_URL.replace(/\/$/, "");
    await waitForServer(baseUrl, () => "");
    await assertButtonAndRouteCoverage(baseUrl);
    const result = await assertBusinessInteroperability(baseUrl);
    console.log(`full interoperability ok: ${baseUrl}`);
    console.log(JSON.stringify({
      createdUser: result.subjects.user.id,
      createdGuide: result.subjects.guide.id,
      createdMerchant: result.subjects.merchant.id,
      guideOrder: result.guideOrder,
      merchantOrder: result.merchantOrder,
      shopOrder: result.shopOrder,
      sos: result.sos,
    }, null, 2));
    return;
  }

  const port = await freePort();
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-full-interoperability-"));
  const env = {
    ...process.env,
    PORT: String(port),
    YUNLV_RUNTIME_DIR: runtimeDir,
    YUNLV_SKIP_DOTENV: "1",
  };
  const logs = [];
  const child = spawn(process.execPath, [path.join(root, "server.js")], { cwd: root, env });
  child.stdout.on("data", (chunk) => logs.push(chunk.toString()));
  child.stderr.on("data", (chunk) => logs.push(chunk.toString()));
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await waitForServer(baseUrl, () => logs.join(""));
    await assertButtonAndRouteCoverage(baseUrl);
    const result = await assertBusinessInteroperability(baseUrl);
    console.log(`full interoperability ok: ${baseUrl}`);
    console.log(JSON.stringify({
      createdUser: result.subjects.user.id,
      createdGuide: result.subjects.guide.id,
      createdMerchant: result.subjects.merchant.id,
      guideOrder: result.guideOrder,
      merchantOrder: result.merchantOrder,
      shopOrder: result.shopOrder,
      sos: result.sos,
    }, null, 2));
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
