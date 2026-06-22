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
  if (!response.ok || !payload.success) throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(guideAppPath, "utf8");
  [
    "function hydrateGuideHomeFromApi",
    "guideApiRequest('/api/guide/home?guideId=guide-001')",
    "function applyGuideHomeData",
    "function guideHomeServingOrders",
    "function guideHomeNotice",
    "data-guide-home-refresh",
    "data-guide-scan-open",
  ].forEach((needle) => assert(source.includes(needle), `向导端首页 #14 必须接入真实首页接口与功能：${needle}`));
  assert(!source.includes("const servingOrders = ["), "向导端首页当前服务中不能继续使用前端固定数组");
  assert(!source.includes("李奶奶', service: '就医陪伴'"), "向导端首页不能继续显示固定服务中订单");
  assert(!source.includes("关于优化服务评价规则的通知"), "向导端首页平台公告不能继续使用固定文案");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-home-"));
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
    assert(health.apiGroups.includes("guide-home"), "健康检查必须登记 guide-home 接口组");

    const home = await json(baseUrl, "/api/guide/home?guideId=guide-001", { token: guide.token });
    assert.equal(home.sourceEndpoint, "/api/guide/home");
    assert.equal(home.dashboard.sourceEndpoint, "/api/guide/dashboard");
    assert.equal(home.stats.sourceEndpoint, "/api/guide/stats");
    assert.equal(home.income.sourceEndpoint, "/api/guide/income");
    assert.equal(home.functionOverview.sourceEndpoint, "/api/guide/functions/overview");
    assert.equal(home.guide.id, "guide-001");
    assert.ok(home.guide.onlineStatus, "首页必须返回向导在线状态");
    assert.ok(Number.isFinite(home.stats.orderCount), "首页必须返回统计接单数");
    assert.ok(Array.isArray(home.currentServices), "首页必须返回当前服务列表");
    assert.ok(home.currentServices.some((item) => item.orderId === "order-001" && item.taskStatus === "服务中"), "首页当前服务必须来自任务/订单接口数据");
    assert.ok(Array.isArray(home.recommendedOrders), "首页必须返回推荐订单列表");
    assert.ok(home.recommendedOrders.some((item) => item.orderId === "order-003"), "首页推荐订单必须来自待派单订单");
    assert.ok(home.notice && home.notice.title && home.notice.content, "首页平台公告必须来自消息/任务数据");
    assert.equal(home.actions.refresh.endpoint, "/api/guide/home");
    assert.equal(home.actions.claim.endpoint, "/api/guide/tasks/claim-next");
    assert.equal(home.actions.scan.route, "45");

    const bareHome = await json(baseUrl, "/guide/home?guideId=guide-001", { token: guide.token });
    assert.equal(bareHome.sourceEndpoint, "/api/guide/home");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide home real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
