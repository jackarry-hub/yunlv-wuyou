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
    throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  }
  return payload.data;
}

async function login(baseUrl, role) {
  return json(baseUrl, "/api/auth/login", { method: "POST", body: { role } });
}

async function main() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-acceptance-"));
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

    const elder = await login(baseUrl, "elder");
    const admin = await login(baseUrl, "admin");
    const guide = await login(baseUrl, "guide");
    const merchant = await login(baseUrl, "merchant");

    const aiChat = await json(baseUrl, "/api/ai/chat", {
      method: "POST",
      token: elder.token,
      body: { question: "帮我推荐附近活动和旅居管家服务" },
    });
    assert(aiChat.answer.includes("活动") || aiChat.answer.includes("服务"), "AI 管家应返回可演示回答");
    const aiHistory = await json(baseUrl, "/api/ai/history", { token: elder.token });
    assert(aiHistory.some((item) => item.id === aiChat.id), "AI 历史应沉淀新问答");

    const mapActivities = await json(baseUrl, "/api/activities/map", { token: elder.token });
    assert(mapActivities.length >= 1, "活动地图应返回真实活动数据");
    const activitySignup = await json(baseUrl, `/api/activities/${mapActivities[0].id}/join`, {
      method: "POST",
      token: elder.token,
      body: { name: "李秀兰", phone: "13800005678", count: 1 },
    });
    assert.equal(activitySignup.signup.status, "已报名");

    const serviceRequest = await json(baseUrl, "/api/service-requests", {
      method: "POST",
      token: elder.token,
      body: {
        role: "user",
        route: "volunteer",
        action: "申请志愿服务",
        type: "志愿协助",
        providerType: "guide",
        priority: "P1",
        description: "验收脚本：用户端志愿服务入口提交请求",
      },
    });
    assert.equal(serviceRequest.status, "待处理");
    const serviceRequestHandled = await json(baseUrl, `/api/service-requests/${serviceRequest.id}/handle`, {
      method: "POST",
      token: admin.token,
      body: { result: "验收脚本后台处理服务请求" },
    });
    assert.equal(serviceRequestHandled.status, "已处理");

    const sos = await json(baseUrl, "/api/alerts/sos", {
      method: "POST",
      token: elder.token,
      body: { location: "昆明市五华区翠湖康养公寓", description: "验收脚本触发 SOS" },
    });
    assert.equal(sos.status, "待处理");
    const sosHandled = await json(baseUrl, `/api/alerts/${sos.id}/handle`, {
      method: "POST",
      token: admin.token,
      body: { result: "验收脚本后台处理 SOS" },
    });
    assert.equal(sosHandled.status, "已处理");

    const userOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        elderName: "李秀兰",
        serviceType: "陪伴就医",
        providerType: "guide",
        amount: 120,
        time: "2026-06-04 10:00",
        location: "昆明市第一人民医院",
        source: "验收脚本：用户端统一下单表单",
        note: "验收脚本创建向导订单",
      },
    });
    assert.equal(userOrder.status, "待派单");

    const queue = await json(baseUrl, "/api/admin/dispatch/pending", { token: admin.token });
    assert(queue.pendingOrders.some((order) => order.id === userOrder.id), "后台待派单列表应包含用户新订单");

    const dispatchedGuide = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: userOrder.id, assigneeType: "guide", assigneeId: "guide-001" },
    });
    assert.equal(dispatchedGuide.task.status, "待接单");

    let guideDashboard = await json(baseUrl, "/api/guide/dashboard", { token: guide.token });
    assert(guideDashboard.tasks.some((task) => task.id === dispatchedGuide.task.id), "向导真实任务列表应包含后台派单任务");

    await json(baseUrl, `/api/tasks/${dispatchedGuide.task.id}/accept`, { method: "POST", token: guide.token, body: {} });
    await json(baseUrl, `/api/tasks/${dispatchedGuide.task.id}/start`, { method: "POST", token: guide.token, body: {} });
    const guideException = await json(baseUrl, "/api/guide/exception", {
      method: "POST",
      token: guide.token,
      body: { taskId: dispatchedGuide.task.id, type: "服务异常", description: "验收脚本：客户临时需要后台协助" },
    });
    assert.equal(guideException.alert.status, "待处理");
    const guideExceptionHandled = await json(baseUrl, `/api/alerts/${guideException.alert.id}/handle`, {
      method: "POST",
      token: admin.token,
      body: { result: "验收脚本后台处理向导异常" },
    });
    assert.equal(guideExceptionHandled.status, "已处理");
    const guideCompleted = await json(baseUrl, `/api/tasks/${dispatchedGuide.task.id}/complete`, { method: "POST", token: guide.token, body: { evidence: "acceptance" } });
    assert.equal(guideCompleted.order.status, "待确认");

    const guideConfirmed = await json(baseUrl, `/api/orders/${userOrder.id}/confirm`, {
      method: "POST",
      token: elder.token,
      body: { rating: 5, review: "验收通过：向导服务闭环正常。", tags: ["准时到达", "服务细致"] },
    });
    assert.equal(guideConfirmed.status, "已完成");
    assert(guideConfirmed.reviewDetail?.id, "用户确认后应写入评价记录");
    const guideIncome = await json(baseUrl, "/api/guide/income", { token: guide.token });
    assert(guideIncome.stats.completedOrders >= 1, "向导收入应能读取已完成任务");

    const merchantService = await json(baseUrl, "/api/merchant/services", {
      method: "POST",
      token: merchant.token,
      body: {
        title: "验收脚本上门护理服务",
        category: "康养护理",
        price: 268,
        unit: "次",
        description: "验收脚本创建服务，等待后台审核。",
      },
    });
    assert.equal(merchantService.status, "待审核");
    const serviceApproved = await json(baseUrl, `/api/admin/services/${merchantService.id}/status`, {
      method: "POST",
      token: admin.token,
      body: { status: "上架" },
    });
    assert.equal(serviceApproved.status, "上架");

    const merchantOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        elderName: "李秀兰",
        serviceType: "上门护理评估",
        providerType: "merchant",
        amount: 260,
        time: "2026-06-04 15:00",
        location: "翠湖康养公寓",
        source: "验收脚本：用户端统一下单表单",
        note: "验收脚本创建商户订单",
      },
    });
    const dispatchedMerchant = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: merchantOrder.id, assigneeType: "merchant", assigneeId: "merchant-001" },
    });
    assert.equal(dispatchedMerchant.task.assigneeType, "merchant");

    const merchantDashboard = await json(baseUrl, "/api/merchant/dashboard", { token: merchant.token });
    assert(merchantDashboard.orders.some((order) => order.id === merchantOrder.id), "商户真实任务列表应包含后台指派订单");

    const quoted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/quote`, {
      method: "POST",
      token: merchant.token,
      body: { amount: 280, plan: "验收脚本报价方案" },
    });
    assert.equal(quoted.status, "已报价");
    const merchantConfirmed = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/confirm`, { method: "POST", token: merchant.token, body: {} });
    assert.equal(merchantConfirmed.status, "待服务");
    const merchantStarted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/start`, { method: "POST", token: merchant.token, body: {} });
    assert.equal(merchantStarted.status, "服务中");
    const merchantCompleted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/complete`, { method: "POST", token: merchant.token, body: {} });
    assert.equal(merchantCompleted.status, "待确认");

    const finalConfirm = await json(baseUrl, `/api/orders/${merchantOrder.id}/confirm`, {
      method: "POST",
      token: elder.token,
      body: { rating: 5, review: "验收通过：商户服务闭环正常。", tags: ["响应及时"] },
    });
    assert.equal(finalConfirm.status, "已完成");

    const reviews = await json(baseUrl, "/api/reviews", { token: admin.token });
    assert(reviews.length >= 2, "向导和商户闭环均应生成评价记录");
    const merchantReviews = await json(baseUrl, "/api/merchant/reviews", { token: merchant.token });
    assert(merchantReviews.some((review) => review.orderId === merchantOrder.id), "商户端应能查询用户评价");

    const guideAudit = await json(baseUrl, "/api/admin/guides/guide-003/audit", {
      method: "POST",
      token: admin.token,
      body: { decision: "通过审核", status: "已认证" },
    });
    assert.equal(guideAudit.status, "已认证");
    const merchantAudit = await json(baseUrl, "/api/admin/merchants/merchant-002/audit", {
      method: "POST",
      token: admin.token,
      body: { decision: "通过入驻", status: "已通过" },
    });
    assert.equal(merchantAudit.status, "已通过");

    const adminActivity = await json(baseUrl, "/api/admin/activities", {
      method: "POST",
      token: admin.token,
      body: { title: "验收脚本活动", category: "文化体验", quota: 20, location: "翠湖公园" },
    });
    assert.equal(adminActivity.status, "报名中");
    const activityOffline = await json(baseUrl, `/api/admin/activities/${adminActivity.id}/status`, {
      method: "POST",
      token: admin.token,
      body: { status: "已下线" },
    });
    assert.equal(activityOffline.status, "已下线");

    const adminUsers = await json(baseUrl, "/api/admin/users", { token: admin.token });
    assert(adminUsers.users.length >= 1, "后台应可查询用户数据");
    const adminHealth = await json(baseUrl, "/api/admin/health-records", { token: admin.token });
    assert(adminHealth.records.length >= 1 && adminHealth.devices.length >= 1, "后台应可查询健康和设备数据");
    const adminServices = await json(baseUrl, "/api/admin/services", { token: admin.token });
    assert(adminServices.some((service) => service.id === merchantService.id), "后台应可查询商户发布服务");
    const adminDataLoop = await json(baseUrl, "/api/admin/data-loop", { token: admin.token });
    assert(adminDataLoop.summary.reviews >= 2, "后台数据闭环应沉淀评价数据");
    assert(adminDataLoop.summary.serviceRequests >= 1, "后台数据闭环应沉淀服务请求数据");

    const priority = await json(baseUrl, "/api/admin/priority/status", { token: admin.token });
    assert.equal(priority.P0.status, "已完成");
    assert.equal(priority.P1.status, "已完成");
    assert.equal(priority.P2.status, "已预留入口/接口");
    const integrations = await json(baseUrl, "/api/integrations/status", { token: admin.token });
    assert(integrations.integrations.length >= 5, "P2 应保留外部资源接入清单");
    const paymentReserve = await json(baseUrl, "/api/integrations/payment/request", {
      method: "POST",
      token: admin.token,
      body: { description: "验收脚本：支付接入二期预留" },
    });
    assert.equal(paymentReserve.priority, "P2");

    const reset = await json(baseUrl, "/api/admin/demo/reset", { method: "POST", token: admin.token, body: {} });
    assert(reset.status.collections.orders >= 3, "重置后应恢复种子订单");
    const afterResetOrders = await json(baseUrl, "/api/orders", { token: elder.token });
    assert(!afterResetOrders.some((order) => order.id === userOrder.id || order.id === merchantOrder.id), "重置后验收脚本新增订单不应保留");

    console.log(`acceptance flow ok: ${baseUrl}`);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
