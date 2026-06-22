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
  assert.equal(result.payload.success, true, `${route} should succeed`);
  return result.payload.data;
}

async function login(baseUrl, role) {
  return ok(baseUrl, "/api/auth/login", { method: "POST", body: { role } });
}

async function main() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-contract-"));
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), YUNLV_RUNTIME_DIR: runtimeDir },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForServer(baseUrl);
    const elder = await login(baseUrl, "elder");
    const admin = await login(baseUrl, "admin");
    const guide = await login(baseUrl, "guide");

    const unauthorized = await call(baseUrl, "/api/orders");
    assert.equal(unauthorized.status, 401);

    const forbidden = await call(baseUrl, "/api/admin/dashboard", { token: elder.token });
    assert.equal(forbidden.status, 403);

    const order = await ok(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        serviceType: "陪伴就医",
        providerType: "guide",
        amount: 120,
        location: "昆明市第一人民医院",
      },
    });
    const invalidConfirm = await call(baseUrl, `/api/orders/${order.id}/confirm`, {
      method: "POST",
      token: elder.token,
      body: { rating: 5 },
    });
    assert.equal(invalidConfirm.status, 409);

    const dispatched = await ok(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: order.id, assigneeType: "guide" },
    });
    const pendingDispatch = await ok(baseUrl, "/api/admin/dispatch/pending", { token: admin.token });
    assert(Array.isArray(pendingDispatch.pendingOrders));
    const invalidComplete = await call(baseUrl, `/api/tasks/${dispatched.task.id}/complete`, {
      method: "POST",
      token: guide.token,
      body: {},
    });
    assert.equal(invalidComplete.status, 409);

    const messageRead = await ok(baseUrl, "/api/messages/read-all", {
      method: "POST",
      token: elder.token,
      body: { role: "user" },
    });
    assert.equal(typeof messageRead.changed, "number");

    const signup = await ok(baseUrl, "/api/activities/activity-001/join", {
      method: "POST",
      token: elder.token,
      body: {},
    });
    assert.equal(signup.activity.id, "activity-001");

    const serviceRequest = await ok(baseUrl, "/api/service-requests", {
      method: "POST",
      token: elder.token,
      body: { role: "user", route: "community", action: "发布社群动态", type: "社群活动协助", priority: "P1" },
    });
    assert.equal(serviceRequest.status, "待处理");
    const handledRequest = await ok(baseUrl, `/api/service-requests/${serviceRequest.id}/handle`, {
      method: "POST",
      token: admin.token,
      body: { result: "合约测试处理服务请求" },
    });
    assert.equal(handledRequest.status, "已处理");

    const uiAction = await ok(baseUrl, "/api/ui/actions", {
      method: "POST",
      token: elder.token,
      body: { role: "user", route: "profile", action: "提交意见反馈" },
    });
    assert.equal(uiAction.route, "profile");

    const claimOrder = await ok(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "导游游览", providerType: "guide", amount: 160 },
    });
    const claimed = await ok(baseUrl, "/api/guide/tasks/claim-next", {
      method: "POST",
      token: guide.token,
      body: { orderId: claimOrder.id, guideId: "guide-001" },
    });
    assert.equal(claimed.task.status, "已接单");
    assert.equal(claimed.order.status, "已接单");

    const merchant = await login(baseUrl, "merchant");
    const service = await ok(baseUrl, "/api/merchant/services/service-003/status", {
      method: "POST",
      token: merchant.token,
      body: { status: "下架" },
    });
    assert.equal(service.status, "下架");

    const ai = await ok(baseUrl, "/api/ai/chat", {
      method: "POST",
      token: elder.token,
      body: { question: "SOS 怎么处理" },
    });
    assert(ai.intent);

    const income = await ok(baseUrl, "/api/guide/income", { token: guide.token });
    assert.equal(income.guide.id, "guide-001");

    const newMerchantService = await ok(baseUrl, "/api/merchant/services", {
      method: "POST",
      token: merchant.token,
      body: { title: "合约测试服务", category: "康养护理", price: 199 },
    });
    assert.equal(newMerchantService.status, "待审核");
    const approvedService = await ok(baseUrl, `/api/admin/services/${newMerchantService.id}/status`, {
      method: "POST",
      token: admin.token,
      body: { status: "上架" },
    });
    assert.equal(approvedService.status, "上架");

    const guideAudit = await ok(baseUrl, "/api/admin/guides/guide-003/audit", {
      method: "POST",
      token: admin.token,
      body: { status: "已认证" },
    });
    assert.equal(guideAudit.status, "已认证");

    const merchantAudit = await ok(baseUrl, "/api/admin/merchants/merchant-002/audit", {
      method: "POST",
      token: admin.token,
      body: { status: "已通过" },
    });
    assert.equal(merchantAudit.status, "已通过");

    const adminActivity = await ok(baseUrl, "/api/admin/activities", {
      method: "POST",
      token: admin.token,
      body: { title: "合约测试活动", category: "文化体验" },
    });
    assert.equal(adminActivity.status, "报名中");
    const adminDataLoop = await ok(baseUrl, "/api/admin/data-loop", { token: admin.token });
    assert(adminDataLoop.summary.users >= 1);

    const priority = await ok(baseUrl, "/api/admin/priority/status", { token: admin.token });
    assert.equal(priority.P0.status, "已完成");
    assert.equal(priority.P1.status, "已完成");
    assert.equal(priority.P2.status, "已预留入口/接口");
    const integrations = await ok(baseUrl, "/api/integrations/status", { token: admin.token });
    assert(integrations.integrations.some((item) => item.id === "payment"));
    const integrationRequest = await ok(baseUrl, "/api/integrations/payment/request", {
      method: "POST",
      token: admin.token,
      body: { description: "合约测试生成支付接入预留请求" },
    });
    assert.equal(integrationRequest.priority, "P2");

    const database = await ok(baseUrl, "/api/admin/database/status", { token: admin.token });
    assert.equal(database.mode, "mock-production");

    const reset = await ok(baseUrl, "/api/admin/demo/reset", { method: "POST", token: admin.token, body: {} });
    assert.equal(reset.status.driver, "json-file");

    console.log(`api contract ok: ${baseUrl}`);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
