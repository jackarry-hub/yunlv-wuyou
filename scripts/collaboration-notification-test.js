const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { collaborationForApi, collaborationRules, validateCollaborationRules } = require("../server/lib/collaboration-notifications");

const root = path.resolve(__dirname, "..");

const expectedRules = [
  ["用户下单", "用户端", ["管理后台", "人工向导端或商户端"]],
  ["SOS 求助", "用户端/设备", ["紧急联系人", "管理后台", "人工向导端"]],
  ["设备异常", "智能设备", ["用户端", "家属", "管理后台"]],
  ["人工向导接单", "人工向导端", ["用户端", "管理后台"]],
  ["商户确认预约", "商户端", ["用户端", "管理后台"]],
  ["服务完成", "人工向导/商户端", ["用户端", "管理后台"]],
  ["异常上报", "人工向导/商户端", ["管理后台", "用户端视情况"]],
];

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
  throw new Error(`server did not start\n${output()}`);
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

async function roleMessages(baseUrl, token, role) {
  return json(baseUrl, `/api/messages?role=${role}`, { token });
}

function assertMessage(messages, scenario, matcher) {
  assert(
    messages.some((item) => item.scenario === scenario && (!matcher || matcher.test(`${item.title} ${item.content}`))),
    `expected message for scenario ${scenario}`,
  );
}

async function main() {
  assert.deepEqual(
    collaborationRules.map((item) => [item.scenario, item.triggerSide, item.receiverSides]),
    expectedRules,
    "collaboration rules should follow section 8 table",
  );
  assert.equal(collaborationForApi().scenarioCount, expectedRules.length);
  assert.equal(validateCollaborationRules().valid, true);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-collaboration-"));
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
    const family = await login(baseUrl, "family");

    const collaboration = await json(baseUrl, "/api/admin/system/collaboration", { token: admin.token });
    assert.equal(collaboration.scenarioCount, expectedRules.length);
    assert.equal(collaboration.validation.valid, true);

    const order = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "陪伴就医", providerType: "guide", amount: 120 },
    });
    assertMessage(await roleMessages(baseUrl, admin.token, "admin"), "用户下单", /新订单待派单/);

    const dispatched = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: order.id, assigneeType: "guide", assigneeId: "guide-001" },
    });
    assertMessage(await roleMessages(baseUrl, guide.token, "guide"), "用户下单", /新任务待接单/);

    await json(baseUrl, `/api/tasks/${dispatched.task.id}/accept`, { method: "POST", token: guide.token, body: {} });
    assertMessage(await roleMessages(baseUrl, elder.token, "user"), "人工向导接单", /订单状态更新|已接单/);
    assertMessage(await roleMessages(baseUrl, admin.token, "admin"), "人工向导接单", /向导已接单/);

    await json(baseUrl, `/api/tasks/${dispatched.task.id}/complete`, { method: "POST", token: guide.token, body: { evidence: "collaboration test" } });
    assertMessage(await roleMessages(baseUrl, elder.token, "user"), "服务完成", /待用户确认|等待用户确认|订单状态更新/);
    assertMessage(await roleMessages(baseUrl, admin.token, "admin"), "服务完成", /待用户确认/);

    const sos = await json(baseUrl, "/api/alerts/sos", {
      method: "POST",
      token: elder.token,
      body: { location: "翠湖康养公寓", description: "协同测试 SOS" },
    });
    assert.equal(sos.status, "待处理");
    assertMessage(await roleMessages(baseUrl, admin.token, "admin"), "SOS 求助", /SOS/);
    assertMessage(await roleMessages(baseUrl, family.token, "family"), "SOS 求助", /SOS/);
    assertMessage(await roleMessages(baseUrl, guide.token, "guide"), "SOS 求助", /SOS/);

    const device = await json(baseUrl, "/api/devices/device-001/sync", {
      method: "POST",
      token: elder.token,
      body: { battery: 8, onlineStatus: "异常", location: "翠湖康养公寓" },
    });
    assert(device.lastAlertId);
    assertMessage(await roleMessages(baseUrl, elder.token, "user"), "设备异常", /设备异常|低电量/);
    assertMessage(await roleMessages(baseUrl, family.token, "family"), "设备异常", /设备异常|低电量/);
    assertMessage(await roleMessages(baseUrl, admin.token, "admin"), "设备异常", /设备异常|待处理/);

    const merchantOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "上门护理评估", providerType: "merchant", amount: 260 },
    });
    await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: merchantOrder.id, assigneeType: "merchant", assigneeId: "merchant-001" },
    });
    await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/quote`, {
      method: "POST",
      token: merchant.token,
      body: { amount: 280, plan: "协同测试服务方案" },
    });
    await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/confirm`, { method: "POST", token: merchant.token, body: {} });
    assertMessage(await roleMessages(baseUrl, elder.token, "user"), "商户确认预约", /确认|报价/);
    assertMessage(await roleMessages(baseUrl, admin.token, "admin"), "商户确认预约", /确认|报价/);

    const merchantException = await json(baseUrl, "/api/merchant/exception", {
      method: "POST",
      token: merchant.token,
      body: { orderId: merchantOrder.id, level: "高", description: "协同测试商户异常" },
    });
    assert.equal(merchantException.alert.status, "待处理");
    assertMessage(await roleMessages(baseUrl, admin.token, "admin"), "异常上报", /异常/);
    assertMessage(await roleMessages(baseUrl, elder.token, "user"), "异常上报", /异常/);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.collaborationNotifications.scenarioCount, expectedRules.length);
    assert.equal(reference.collaborationNotifications.architecturePath, "/api/admin/system/collaboration");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("collaboration notification ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
