const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { guideFunctionModules, guideFunctionOverviewForApi, validateGuideFunctionOverview } = require("../server/lib/guide-function-overview");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["登录与认证", "P0", "通过审核后才能上线接单。"],
  ["首页工作台", "P0", "显示接单数、服务中、已完成、今日收入。"],
  ["上线接单", "P0", "开关后后台可看到状态。"],
  ["接单大厅", "P0", "可查看待接订单并抢单/接单。"],
  ["订单详情", "P0", "详情清晰，点击可接单。"],
  ["服务中", "P0", "订单状态从已接单→服务中→已完成流转。"],
  ["异常上报", "P0", "上报后后台可看到异常。"],
  ["我的订单", "P0", "订单列表与状态正确。"],
  ["收入与评价", "P1", "收入统计可按日/月查看。"],
  ["帮助中心", "P1", "可查看规范文档。"],
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

async function main() {
  assert.deepEqual(
    guideFunctionModules.map((item) => [item.module, item.priority, item.acceptance]),
    expectedRows,
    "向导端功能总览应与图示一致",
  );
  assert.equal(validateGuideFunctionOverview().valid, true);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = guideFunctionOverviewForApi(seed);
  assert.equal(direct.version, "guide-function-overview-v1");
  assert.equal(direct.source, "向导端功能总览");
  assert.equal(direct.moduleCount, 10);
  assert.equal(direct.p0Count, 8);
  assert.equal(direct.p1Count, 2);
  assert.equal(direct.implementedCount, 10);
  assert.equal(direct.modules.some((item) => String(item.runtime.status).includes(["待", "接入"].join(""))), false);
  assert.equal(direct.modules.find((item) => item.module === "登录与认证").runtime.metrics.canGoOnline, true);
  assert.equal(direct.modules.find((item) => item.module === "服务中").runtime.metrics.statusFlowReady, true);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-functions-"));
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
    assert(health.apiGroups.includes("guide-functions"));

    const overview = await json(baseUrl, "/api/guide/functions/overview", { token: guide.token });
    assert.equal(overview.moduleCount, 10);
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.related.claimNext, "/api/guide/tasks/claim-next");
    assert(overview.modules.find((item) => item.module === "接单大厅").apiEndpoints.includes("/api/guide/tasks/claim-next"));
    assert.equal(overview.modules.find((item) => item.module === "异常上报").runtime.metrics.supportsTextAndImage, true);

    const offlineGuide = await json(baseUrl, "/api/guide/online", {
      method: "POST",
      token: guide.token,
      body: { guideId: "guide-001", onlineStatus: "离线" },
    });
    assert.equal(offlineGuide.onlineStatus, "离线");
    const refreshed = await json(baseUrl, "/guide/functions/overview", { token: guide.token });
    const onlineModule = refreshed.modules.find((item) => item.module === "上线接单");
    assert.equal(onlineModule.runtime.metrics.onlineStatus, "离线");
    assert.equal(onlineModule.runtime.metrics.backendVisible, true);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.guideFunctionOverview.architecturePath, "/api/guide/functions/overview");
    assert.equal(reference.guideFunctionOverview.moduleCount, 10);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide function overview ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
