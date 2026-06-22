const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const guideAppPath = path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
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
  if (!response.ok || !payload.success) {
    throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  }
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(guideAppPath, "utf8");
  [
    "function hydrateGuideHallFromApi",
    "guideApiRequest('/api/guide/hall?guideId=guide-001')",
    "function applyGuideHallData",
    "function guideHallOrderPool",
    "function refreshGuideHallOrders",
    "data-guide-hall-refresh",
    "data-guide-accept-order",
    "data-guide-accept-task",
  ].forEach((needle) => assert(source.includes(needle), `向导端接单大厅 #01 必须接入真实大厅接口与功能：${needle}`));
  assert(!source.includes("item.customer === '李奶奶' ? '02' : '10'"), "接单大厅不能继续按客户姓名写死详情页跳转");
  assert(!source.includes("let result = [...orders];\n  if (guideState.hallTab"), "接单大厅筛选不能继续直接依赖前端固定订单池");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-hall-"));
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
    const guide = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "guide" } });
    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("guide-hall"), "健康检查必须登记 guide-hall 接口组");

    const hall = await json(baseUrl, "/api/guide/hall?guideId=guide-001", { token: guide.token });
    assert.equal(hall.sourceEndpoint, "/api/guide/hall");
    assert.equal(hall.dashboard.sourceEndpoint, "/api/guide/dashboard");
    assert.equal(hall.tasksEndpoint, "/api/guide/tasks");
    assert.equal(hall.categoriesEndpoint, "/api/guide/categories");
    assert.equal(hall.guide.id, "guide-001");
    assert.ok(Array.isArray(hall.orders), "接单大厅必须返回订单数组");
    assert.ok(hall.orders.some((item) => item.orderId === "order-003" && item.taskStatus === "待接单"), "接单大厅必须包含真实待派单向导订单");
    assert.ok(hall.orders.some((item) => item.orderId === "order-001" && item.taskStatus === "服务中"), "接单大厅必须包含真实任务订单状态");
    assert.ok(hall.categories.some((item) => item.name === "全部" && item.count === hall.orders.length), "分类数量必须来自接口聚合");
    assert.equal(hall.actions.refresh.endpoint, "/api/guide/hall");
    assert.equal(hall.actions.claim.endpoint, "/api/guide/tasks/claim-next");
    assert.equal(hall.actions.acceptTask.endpoint, "/api/tasks/{id}/accept");
    assert.equal(hall.actions.filter.route, "09");

    const bareHall = await json(baseUrl, "/guide/hall?guideId=guide-001", { token: guide.token });
    assert.equal(bareHall.sourceEndpoint, "/api/guide/hall");

    const accepted = await json(baseUrl, "/api/guide/tasks/claim-next", {
      method: "POST",
      token: guide.token,
      body: { guideId: "guide-001", orderId: "order-003" },
    });
    assert.equal(accepted.order.id, "order-003");
    assert.equal(accepted.order.status, "已接单");
    assert.equal(accepted.task.status, "已接单");

    const refreshedHall = await json(baseUrl, "/api/guide/hall?guideId=guide-001", { token: guide.token });
    const refreshedOrder = refreshedHall.orders.find((item) => item.orderId === "order-003");
    assert(refreshedOrder, "接单后大厅必须继续能从真实任务数据看到该订单");
    assert.equal(refreshedOrder.taskStatus, "已接单");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide hall real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
