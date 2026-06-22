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

async function expectHttp(baseUrl, route, expectedText) {
  const response = await fetch(`${baseUrl}${route}`);
  assert.equal(response.status, 200, `${route} should return 200`);
  const text = await response.text();
  if (expectedText) assert(text.includes(expectedText), `${route} should contain ${expectedText}`);
}

async function main() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-smoke-"));
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

    await expectHttp(baseUrl, "/", "四端真实业务工作台");
    await expectHttp(baseUrl, "/user/", "云旅无忧用户端");
    await expectHttp(baseUrl, "/guide/", "云旅无忧向导端");
    await expectHttp(baseUrl, "/merchant/", "云旅无忧商户端");
    await expectHttp(baseUrl, "/admin/", "管理后台");
    await expectHttp(baseUrl, "/shared/api.js", "export const api");
    await expectHttp(baseUrl, "/shared/business-bridge.js", "window.YunlvBusiness");

    const health = await json(baseUrl, "/api/health");
    assert.deepEqual(health.endpoints, ["/user/", "/guide/", "/merchant/", "/admin/"]);

    const elderSession = await login(baseUrl, "elder");
    const adminSession = await login(baseUrl, "admin");
    const guideSession = await login(baseUrl, "guide");
    const merchantSession = await login(baseUrl, "merchant");

    const userOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elderSession.token,
      body: {
        serviceType: "陪伴就医",
        providerType: "guide",
        amount: 120,
        time: "2026-06-02 09:30",
        location: "昆明市第一人民医院",
        note: "冒烟测试订单",
      },
    });
    assert.equal(userOrder.status, "待派单");

    const dispatched = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: adminSession.token,
      body: { orderId: userOrder.id, assigneeType: "guide", assigneeId: "guide-001" },
    });
    assert.equal(dispatched.task.status, "待接单");

    await json(baseUrl, `/api/tasks/${dispatched.task.id}/accept`, { method: "POST", token: guideSession.token, body: {} });
    await json(baseUrl, `/api/tasks/${dispatched.task.id}/start`, { method: "POST", token: guideSession.token, body: {} });
    const completed = await json(baseUrl, `/api/tasks/${dispatched.task.id}/complete`, { method: "POST", token: guideSession.token, body: { evidence: "smoke" } });
    assert.equal(completed.order.status, "待确认");

    const confirmed = await json(baseUrl, `/api/orders/${userOrder.id}/confirm`, { method: "POST", token: elderSession.token, body: { rating: 5 } });
    assert.equal(confirmed.status, "已完成");

    const merchantOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elderSession.token,
      body: {
        serviceType: "上门护理评估",
        providerType: "merchant",
        amount: 260,
        time: "2026-06-03 10:00",
        location: "翠湖康养公寓",
      },
    });
    const quoted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/quote`, {
      method: "POST",
      token: merchantSession.token,
      body: { amount: 280, plan: "冒烟测试报价" },
    });
    assert.equal(quoted.status, "已报价");

    const merchantConfirmed = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/confirm`, { method: "POST", token: merchantSession.token, body: {} });
    assert.equal(merchantConfirmed.status, "待服务");

    const prematureComplete = await fetch(`${baseUrl}/api/merchant/orders/${merchantOrder.id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${merchantSession.token}` },
      body: JSON.stringify({}),
    });
    const prematurePayload = await prematureComplete.json();
    assert.equal(prematureComplete.status, 409);
    assert.equal(prematurePayload.error.details, "STATE_TRANSITION_DENIED");

    const merchantStarted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/start`, { method: "POST", token: merchantSession.token, body: {} });
    assert.equal(merchantStarted.status, "服务中");

    const merchantCompleted = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/complete`, { method: "POST", token: merchantSession.token, body: {} });
    assert.equal(merchantCompleted.status, "待确认");

    const alert = await json(baseUrl, "/api/alerts/sos", { method: "POST", token: elderSession.token, body: { location: "翠湖康养公寓" } });
    assert.equal(alert.status, "待处理");

    const ai = await json(baseUrl, "/api/ai/chat", { method: "POST", token: elderSession.token, body: { question: "今天有什么活动？" } });
    assert.equal(ai.intent, "activity_recommendation");

    const readState = await json(baseUrl, "/api/messages/read-all", { method: "POST", token: elderSession.token, body: { role: "user" } });
    assert.equal(typeof readState.unread, "number");

    const signup = await json(baseUrl, "/api/activities/activity-002/join", { method: "POST", token: elderSession.token, body: {} });
    assert.equal(signup.activity.id, "activity-002");

    const uiAction = await json(baseUrl, "/api/ui/actions", {
      method: "POST",
      token: merchantSession.token,
      body: { role: "merchant", route: "exception-report", action: "暂存草稿" },
    });
    assert.equal(uiAction.action, "暂存草稿");

    const guide = await json(baseUrl, "/api/guide/dashboard", { token: guideSession.token });
    assert(guide.tasks.length >= 1, "guide dashboard should include tasks");

    const merchant = await json(baseUrl, "/api/merchant/dashboard", { token: merchantSession.token });
    assert(merchant.orders.length >= 1, "merchant dashboard should include orders");

    const database = await json(baseUrl, "/api/admin/database/status", { token: adminSession.token });
    assert.equal(database.driver, "json-file");

    console.log(`smoke ok: ${baseUrl}`);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
