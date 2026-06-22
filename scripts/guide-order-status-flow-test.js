const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { guideOrderStatusFlow, guideOrderStatusFlowForApi, validateGuideOrderStatusFlow } = require("../server/lib/guide-order-status-flow");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["待接单", "平台派单/订单进入大厅", "查看详情、接单、拒绝/忽略"],
  ["已接单", "人工向导确认接单", "联系客户、查看路线、申请取消、开始服务"],
  ["服务中", "点击开始服务/到达服务地点", "导航、电话、上传过程记录、异常上报、完成服务"],
  ["待确认", "人工向导提交完成", "等待用户/后台确认"],
  ["已完成", "用户确认或后台确认", "查看评价、进入结算"],
  ["已取消", "用户取消、向导取消、后台取消", "查看取消原因"],
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

async function createGuideOrder(baseUrl, elderToken, serviceType) {
  return json(baseUrl, "/api/orders", {
    method: "POST",
    token: elderToken,
    body: { serviceType, providerType: "guide", amount: 120, source: "5.1 状态流验收" },
  });
}

async function dispatchToGuide(baseUrl, adminToken, orderId) {
  return json(baseUrl, "/api/tasks/dispatch", {
    method: "POST",
    token: adminToken,
    body: { orderId, assigneeType: "guide", assigneeId: "guide-001" },
  });
}

async function main() {
  assert.deepEqual(
    guideOrderStatusFlow.map((item) => [item.status, item.triggers.join(item.status === "已取消" ? "、" : "/"), item.operations.join("、")]),
    expectedRows,
    "人工向导端订单状态流应与图示一致",
  );
  assert.equal(validateGuideOrderStatusFlow().valid, true);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = guideOrderStatusFlowForApi(seed);
  assert.equal(direct.version, "5.1-guide-order-status-flow-v1");
  assert.equal(direct.source, "5.1 人工向导端订单状态流");
  assert.equal(direct.statusCount, 6);
  assert.deepEqual(direct.terminalStatuses, ["已完成", "已取消"]);
  assert.equal(direct.flow.find((item) => item.status === "服务中").operationText, "导航、电话、上传过程记录、异常上报、完成服务");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-flow-"));
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
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const admin = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "admin" } });
    const guide = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "guide" } });

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("guide-order-flow"));

    const overview = await json(baseUrl, "/api/guide/order-status-flow", { token: guide.token });
    assert.equal(overview.statusCount, 6);
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.related.decline, "/api/guide/tasks/{id}/decline");

    const bareOverview = await json(baseUrl, "/guide/order-status-flow", { token: guide.token });
    assert.equal(bareOverview.flow.find((item) => item.status === "待接单").operationText, "查看详情、接单、拒绝/忽略");

    const ignoreOrder = await createGuideOrder(baseUrl, elder.token, "状态流忽略验收");
    const ignoreDispatched = await dispatchToGuide(baseUrl, admin.token, ignoreOrder.id);
    const ignored = await json(baseUrl, `/guide/tasks/${ignoreDispatched.task.id}/ignore`, {
      method: "POST",
      token: guide.token,
      body: { reason: "验收脚本忽略待接单任务" },
    });
    assert.equal(ignored.task.status, "待接单");
    assert.equal(ignored.task.ignoreReason, "验收脚本忽略待接单任务");

    const declineOrder = await createGuideOrder(baseUrl, elder.token, "状态流拒绝验收");
    const declineDispatched = await dispatchToGuide(baseUrl, admin.token, declineOrder.id);
    const declined = await json(baseUrl, `/api/guide/tasks/${declineDispatched.task.id}/decline`, {
      method: "POST",
      token: guide.token,
      body: { reason: "验收脚本拒绝接单" },
    });
    assert.equal(declined.task.status, "已取消");
    assert.equal(declined.order.status, "已取消");
    assert.equal(declined.order.cancelReason, "验收脚本拒绝接单");

    const cancelOrder = await createGuideOrder(baseUrl, elder.token, "状态流取消验收");
    const cancelDispatched = await dispatchToGuide(baseUrl, admin.token, cancelOrder.id);
    await json(baseUrl, `/api/tasks/${cancelDispatched.task.id}/accept`, { method: "POST", token: guide.token, body: {} });
    const cancelled = await json(baseUrl, `/api/guide/tasks/${cancelDispatched.task.id}/cancel`, {
      method: "POST",
      token: guide.token,
      body: { reason: "验收脚本申请取消" },
    });
    assert.equal(cancelled.task.status, "已取消");
    assert.equal(cancelled.order.status, "已取消");
    assert.equal(cancelled.task.cancelReason, "验收脚本申请取消");

    const completeOrder = await createGuideOrder(baseUrl, elder.token, "状态流完成验收");
    const completeDispatched = await dispatchToGuide(baseUrl, admin.token, completeOrder.id);
    await json(baseUrl, `/api/tasks/${completeDispatched.task.id}/accept`, { method: "POST", token: guide.token, body: {} });
    await json(baseUrl, `/api/tasks/${completeDispatched.task.id}/start`, { method: "POST", token: guide.token, body: {} });
    const completedTask = await json(baseUrl, `/api/tasks/${completeDispatched.task.id}/complete`, {
      method: "POST",
      token: guide.token,
      body: { evidence: "5.1 状态流验收完成凭证" },
    });
    assert.equal(completedTask.order.status, "待确认");
    const confirmed = await json(baseUrl, `/api/orders/${completeOrder.id}/confirm`, {
      method: "POST",
      token: admin.token,
      body: { rating: 5, review: "后台确认 5.1 状态流完成" },
    });
    assert.equal(confirmed.status, "已完成");

    const refreshed = await json(baseUrl, "/api/guide/order-status-flow", { token: guide.token });
    assert(refreshed.runtime.statusCounts["已取消"] >= 2);
    assert(refreshed.runtime.statusCounts["已完成"] >= 1);
    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.guideOrderStatusFlow.architecturePath, "/api/guide/order-status-flow");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide order status flow ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
