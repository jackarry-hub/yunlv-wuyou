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

async function waitForServer(baseUrl) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {
      await delay(100);
    }
  }
  throw new Error("server did not start");
}

async function call(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json", ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  return { status: response.status, payload };
}

async function ok(baseUrl, route, options = {}) {
  const result = await call(baseUrl, route, options);
  assert.equal(result.payload.success, true, `${options.method || "GET"} ${route} should succeed: ${JSON.stringify(result.payload.error || {})}`);
  return result.payload.data;
}

async function login(baseUrl, role) {
  const session = await ok(baseUrl, "/auth/login", { method: "POST", body: { role } });
  assert(session.token, `${role} login should return token`);
  return session;
}

async function main() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-mvp-api-"));
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), YUNLV_RUNTIME_DIR: runtimeDir },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForServer(baseUrl);

    const elder = await login(baseUrl, "elder");
    const guide = await login(baseUrl, "guide");
    const merchant = await login(baseUrl, "merchant");
    const admin = await login(baseUrl, "admin");
    const wechat = await ok(baseUrl, "/auth/wechat-login", {
      method: "POST",
      body: { role: "elder", openId: "test-openid-001" },
    });
    assert.equal(wechat.loginType, "wechat");
    assert(wechat.token);

    const initialScope = await ok(baseUrl, "/delivery/initial-scope", { token: admin.token });
    assert.equal(initialScope.scopeCount, 6);
    assert.equal(initialScope.validation.valid, true);
    assert(initialScope.scopes.some((item) => item.scope === "用户端" && item.deliveryRequirement.includes("AI 管家")));
    assert(
      initialScope.scopes.some(
        (item) => item.scope === "AI 能力" && item.deliveryRequirement.includes("通用大模型+预设知识库+规则推荐"),
      ),
    );

    const mvpPrinciples = await ok(baseUrl, "/mvp/principles", { token: admin.token });
    assert.equal(mvpPrinciples.principleCount, 4);
    assert.equal(mvpPrinciples.validation.valid, true);
    assert.equal(mvpPrinciples.acceptance.coreLoopCanBeDemonstrated, true);
    assert(mvpPrinciples.highDependencyCapabilities.some((item) => item.id === "medical-hospital" && item.reserved));
    assert(mvpPrinciples.highDependencyCapabilities.some((item) => item.id === "ai-diagnosis" && item.reserved));

    const roleEndpoints = await ok(baseUrl, "/roles/endpoint-division", { token: admin.token });
    assert.equal(roleEndpoints.roleCount, 5);
    assert.equal(roleEndpoints.validation.valid, true);
    assert(roleEndpoints.roles.some((item) => item.role === "家属" && item.useEnd === "微信小程序 / iOS App / Android App"));
    assert(roleEndpoints.roles.some((item) => item.role === "平台运营/管理员" && item.apiEndpoints.includes("/tasks/dispatch")));

    const businessFlow = await ok(baseUrl, "/business-flow/overview", { token: admin.token });
    assert.equal(businessFlow.stepCount, 7);
    assert.equal(businessFlow.validation.valid, true);
    assert(businessFlow.steps.some((item) => item.action === "数据沉淀"));

    const userFunctions = await ok(baseUrl, "/user/functions/overview", { token: elder.token });
    assert.equal(userFunctions.moduleCount, 9);
    assert.equal(userFunctions.p0Count, 8);
    assert.equal(userFunctions.runtime.allP0Ready, true);
    assert(userFunctions.modules.some((item) => item.module === "小云机器人" && item.priority === "P0"));

    const homeRequirements = await ok(baseUrl, "/user/home-requirements", { token: elder.token });
    assert.equal(homeRequirements.requirementCount, 6);
    assert(homeRequirements.bottomNavigation.some((item) => item.title === "人工向导" && item.route === "guide"));
    const switchedCity = await ok(baseUrl, "/user/home-city", {
      method: "POST",
      token: elder.token,
      body: { city: "弥勒" },
    });
    assert.equal(switchedCity.currentCity, "弥勒");
    const adminHome = await ok(baseUrl, "/admin/content/home", { token: admin.token });
    assert(adminHome.banner.configurable);

    const userProfile = await ok(baseUrl, "/user/profile", { token: elder.token });
    assert(userProfile.user);
    const updatedUser = await ok(baseUrl, "/user/profile", {
      method: "PUT",
      token: elder.token,
      body: { nickname: "李奶奶" },
    });
    assert.equal(updatedUser.nickname, "李奶奶");

    const elderProfile = await ok(baseUrl, "/elder/profile", { token: elder.token });
    assert(elderProfile.name);
    const updatedElder = await ok(baseUrl, "/elder/profile", {
      method: "PUT",
      token: elder.token,
      body: { chronicDisease: "高血压，规律服药" },
    });
    assert.equal(updatedElder.chronicDisease, "高血压，规律服药");

    const activities = await ok(baseUrl, "/activities", { token: elder.token });
    assert(Array.isArray(activities));
    const activityRequirements = await ok(baseUrl, "/activities/map-requirements", { token: elder.token });
    assert.equal(activityRequirements.requirementCount, 5);
    const mapPoints = await ok(baseUrl, "/activities/map", { token: elder.token });
    assert(mapPoints.every((item) => item.coordinates));
    const activityDetail = await ok(baseUrl, "/activities/activity-001", { token: elder.token });
    assert.equal(activityDetail.id, "activity-001");
    const signup = await ok(baseUrl, "/activities/activity-001/join", {
      method: "POST",
      token: elder.token,
      body: { count: 1 },
    });
    assert.equal(signup.activity.id, "activity-001");
    const canceledSignup = await ok(baseUrl, "/activities/activity-001/cancel", {
      method: "POST",
      token: elder.token,
      body: { signupId: signup.signup.id },
    });
    assert.equal(canceledSignup.signup.status, "已取消");

    const aiChat = await ok(baseUrl, "/ai/chat", {
      method: "POST",
      token: elder.token,
      body: { question: "今天有什么活动推荐" },
    });
    assert(aiChat.answer);
    assert(aiChat.responseTimeMs <= 5000);
    assert.equal(aiChat.friendlyTone, true);
    const aiHistory = await ok(baseUrl, "/ai/history", { token: elder.token });
    assert(aiHistory.length >= 1);
    const aiRequirements = await ok(baseUrl, "/ai/steward-requirements", { token: elder.token });
    assert.equal(aiRequirements.requirementCount, 5);
    const quickQuestions = await ok(baseUrl, "/ai/quick-questions", { token: elder.token });
    assert(quickQuestions.some((item) => item.id === "weather"));
    const quickChat = await ok(baseUrl, "/ai/quick-questions/weather/ask", {
      method: "POST",
      token: elder.token,
      body: {},
    });
    assert.equal(quickChat.chat.source, "quickQuestion");
    const voiceChat = await ok(baseUrl, "/ai/voice/transcribe", {
      method: "POST",
      token: elder.token,
      body: { transcript: "明天上午能安排陪伴就医服务吗？", source: "webSpeech" },
    });
    assert.equal(voiceChat.chat.source, "voice");
    const emptyVoice = await call(baseUrl, "/ai/voice/transcribe", {
      method: "POST",
      token: elder.token,
      body: {},
    });
    assert.equal(emptyVoice.status, 400);
    assert.equal(emptyVoice.payload.success, false);
    const aiRecommendations = await ok(baseUrl, "/ai/recommendations?intent=medical_companion", { token: elder.token });
    assert(aiRecommendations.recommendations.length >= 1);
    const aiRecords = await ok(baseUrl, "/ai/service-records", { token: elder.token });
    assert(aiRecords.summary.totalConversations >= 3);

    const cancelOrder = await ok(baseUrl, "/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "陪伴就医", providerType: "guide", amount: 120 },
    });
    const orderList = await ok(baseUrl, "/orders", { token: elder.token });
    assert(orderList.some((item) => item.id === cancelOrder.id));
    const orderDetail = await ok(baseUrl, `/orders/${cancelOrder.id}`, { token: elder.token });
    assert.equal(orderDetail.id, cancelOrder.id);
    const canceled = await ok(baseUrl, `/orders/${cancelOrder.id}/cancel`, {
      method: "POST",
      token: elder.token,
      body: { reason: "MVP 接口清单验收取消" },
    });
    assert.equal(canceled.status, "已取消");

    const serviceOrder = await ok(baseUrl, "/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "旅居管家服务", providerType: "guide", amount: 180 },
    });
    const dispatched = await ok(baseUrl, "/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: serviceOrder.id, assigneeType: "guide", assigneeId: "guide-001" },
    });
    assert.equal(dispatched.task.status, "待接单");
    const accepted = await ok(baseUrl, `/tasks/${dispatched.task.id}/accept`, {
      method: "POST",
      token: guide.token,
      body: {},
    });
    assert.equal(accepted.task.status, "已接单");
    const completed = await ok(baseUrl, `/tasks/${dispatched.task.id}/complete`, {
      method: "POST",
      token: guide.token,
      body: { evidence: "MVP 接口清单验收完成凭证" },
    });
    assert.equal(completed.task.status, "待确认");
    assert.equal(completed.order.status, "待确认");

    const devices = await ok(baseUrl, "/devices", { token: elder.token });
    assert(Array.isArray(devices));
    const boundDevice = await ok(baseUrl, "/devices/bind", {
      method: "POST",
      token: admin.token,
      body: { deviceId: "MVP-TEST-001", type: "智能手环", battery: 88 },
    });
    assert.equal(boundDevice.deviceId, "MVP-TEST-001");
    const health = await ok(baseUrl, "/health/overview", { token: elder.token });
    assert(health.elder);
    const smartDevice = await ok(baseUrl, "/devices/robot-requirements", { token: elder.token });
    assert.equal(smartDevice.requirementCount, 7);
    assert(smartDevice.deviceStatus.devices.some((item) => item.role === "robot"));
    const helpRequest = await ok(baseUrl, "/devices/help-request", {
      method: "POST",
      token: elder.token,
      body: { target: "附近求助", description: "MVP 接口清单验收设备帮助任务" },
    });
    assert.equal(helpRequest.status, "待处理");

    const emergencyRequirements = await ok(baseUrl, "/alerts/emergency-requirements", { token: elder.token });
    assert.equal(emergencyRequirements.requirementCount, 6);
    const contact = await ok(baseUrl, "/family-contacts", {
      method: "POST",
      token: elder.token,
      body: { name: "MVP儿子", relation: "儿子", phone: "13912345678" },
    });
    assert.equal(contact.relation, "儿子");
    const contactCall = await ok(baseUrl, `/family-contacts/${contact.id}/call`, {
      method: "POST",
      token: elder.token,
      body: {},
    });
    assert.equal(contactCall.dialNumber, "13912345678");
    const updatedContact = await ok(baseUrl, `/family-contacts/${contact.id}`, {
      method: "PUT",
      token: elder.token,
      body: { phone: "13912345679", relation: "儿子" },
    });
    assert.equal(updatedContact.phone, "13912345679");
    const removedContact = await ok(baseUrl, `/family-contacts/${contact.id}`, {
      method: "DELETE",
      token: elder.token,
      body: {},
    });
    assert.equal(removedContact.removed.id, contact.id);
    const quickHelp = await ok(baseUrl, "/alerts/quick-help", {
      method: "POST",
      token: elder.token,
      body: { channelKey: "ambulance", location: "MVP 验收定位" },
    });
    assert.equal(quickHelp.dialNumber, "120");

    const sos = await ok(baseUrl, "/alerts/sos", {
      method: "POST",
      token: elder.token,
      body: { description: "MVP 接口清单验收 SOS" },
    });
    assert.equal(sos.status, "待处理");
    const alerts = await ok(baseUrl, "/alerts", { token: admin.token });
    assert(alerts.some((item) => item.id === sos.id));
    const handledAlert = await ok(baseUrl, `/alerts/${sos.id}/handle`, {
      method: "POST",
      token: admin.token,
      body: { result: "MVP 接口清单验收处理完成" },
    });
    assert.equal(handledAlert.status, "已处理");

    const merchantServices = await ok(baseUrl, "/merchant/services", { token: merchant.token });
    assert(Array.isArray(merchantServices));
    const newMerchantService = await ok(baseUrl, "/merchant/services", {
      method: "POST",
      token: merchant.token,
      body: { title: "MVP 验收护理服务", category: "康养护理", price: 199 },
    });
    assert.equal(newMerchantService.status, "待审核");
    const merchantOrders = await ok(baseUrl, "/merchant/orders", { token: merchant.token });
    assert(Array.isArray(merchantOrders));
    const merchantOverview = await ok(baseUrl, "/merchant/functions/overview", { token: merchant.token });
    assert.equal(merchantOverview.moduleCount, 8);
    const merchantCategories = await ok(baseUrl, "/merchant/service-categories", { token: merchant.token });
    assert.equal(merchantCategories.categoryCount, 7);
    assert(merchantCategories.categories.some((item) => item.category === "殡葬服务"));
    const guideOverview = await ok(baseUrl, "/guide/functions/overview", { token: guide.token });
    assert.equal(guideOverview.moduleCount, 10);
    assert.equal(guideOverview.validation.valid, true);
    const guideRequirements = await ok(baseUrl, "/guide/order-requirements", { token: guide.token });
    assert.equal(guideRequirements.categoryCount, 6);
    assert.equal(guideRequirements.validation.valid, true);
    assert(guideRequirements.categories.some((item) => item.category === "护工护理" && item.priority === "P0"));
    const guideFlow = await ok(baseUrl, "/guide/order-status-flow", { token: guide.token });
    assert.equal(guideFlow.statusCount, 6);
    assert.equal(guideFlow.validation.valid, true);

    const dashboard = await ok(baseUrl, "/admin/dashboard", { token: admin.token });
    assert(dashboard.stats);
    const adminOrders = await ok(baseUrl, "/admin/orders", { token: admin.token });
    assert(Array.isArray(adminOrders));
    const adminAlerts = await ok(baseUrl, "/admin/alerts", { token: admin.token });
    assert(Array.isArray(adminAlerts));

    console.log(`mvp api list ok: ${baseUrl}`);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
