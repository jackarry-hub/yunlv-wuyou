const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { adminFunctionModules, adminFunctionOverviewForApi, validateAdminFunctionOverview } = require("../server/lib/admin-function-overview");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["首页数据概览", "P0", "进入后台可看到关键指标。"],
  ["老人/用户管理", "P0", "可查询、查看、编辑基础信息。"],
  ["人工向导管理", "P0", "可审核向导并查看状态。"],
  ["商户管理", "P0", "商户审核和服务管理可用。"],
  ["订单管理", "P0", "订单状态清晰，可人工干预。"],
  ["任务调度", "P0", "后台可手动派单和改派。"],
  ["异常报告", "P0", "异常可处理，记录处理结果。"],
  ["活动管理", "P0", "用户端活动地图可同步展示。"],
  ["设备管理", "P1", "可查看设备状态与模拟数据。"],
  ["内容管理", "P1", "前端内容可配置。"],
  ["数据大屏", "P1", "可展示核心统计和地图。"],
  ["系统权限", "P0", "不同角色看到不同菜单。"],
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
    adminFunctionModules.map((item) => [item.module, item.priority, item.acceptance]),
    expectedRows,
    "7.1 管理后台功能总览应与图示一致",
  );
  assert.equal(validateAdminFunctionOverview().valid, true);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = adminFunctionOverviewForApi(seed);
  assert.equal(direct.version, "7.1-admin-function-overview-v1");
  assert.equal(direct.source, "7.1 管理后台功能总览");
  assert.equal(direct.moduleCount, 12);
  assert.equal(direct.p0Count, 9);
  assert.equal(direct.p1Count, 3);
  assert.equal(direct.implementedCount, 12);
  assert.equal(direct.modules.some((item) => String(item.runtime.status).includes(["待", "接入"].join(""))), false);
  assert(direct.modules.find((item) => item.module === "任务调度").apiEndpoints.includes("/api/tasks/dispatch"));

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-admin-functions-"));
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
    const admin = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "admin" } });

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("admin-functions"));

    const overview = await json(baseUrl, "/api/admin/functions/overview", { token: admin.token });
    assert.equal(overview.moduleCount, 12);
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.modules.find((item) => item.module === "首页数据概览").runtime.metrics.onlineDevices >= 0, true);
    assert.equal(overview.modules.find((item) => item.module === "数据大屏").runtime.metrics.screens, 2);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.adminFunctionOverview.architecturePath, "/api/admin/functions/overview");
    assert.equal(reference.adminFunctionOverview.moduleCount, 12);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("admin function overview ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
