const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { adminDataScreenDefinitions, adminScreensForApi, validateAdminDataScreens } = require("../server/lib/admin-data-screens");

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
  assert.equal(adminDataScreenDefinitions.length, 2);
  assert.deepEqual(adminDataScreenDefinitions.map((item) => item.title), ["旅居养老作战数据大屏", "人工向导工作调配大屏"]);
  assert.deepEqual(adminDataScreenDefinitions[0].coreMetrics, ["老人总数", "在线人数", "健康状态分布", "设备在线", "异常预警", "SOS", "服务工单", "满意度"]);
  assert.deepEqual(adminDataScreenDefinitions[1].coreMetrics, ["向导总数", "在线/服务中/空闲", "待派单", "今日服务量", "服务时段", "异常处理", "排行"]);
  assert.equal(validateAdminDataScreens().valid, true);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = adminScreensForApi(seed);
  assert.equal(direct.version, "7.2-admin-data-screens-v1");
  assert.equal(direct.screenCount, 2);
  assert(direct.screens[0].metrics.find((item) => item.label === "服务工单"));
  assert(Array.isArray(direct.screens[0].cityDistribution));
  assert(direct.screens[0].cityDistribution.length >= 1);
  const directElderServiceMetric = direct.screens[0].metrics.find((item) => item.label === "服务工单");
  const directElderAlertMetric = direct.screens[0].metrics.find((item) => item.label === "异常预警");
  const directCityAlertTotal = direct.screens[0].cityDistribution.reduce((sum, item) => sum + Number(item.alerts || 0), 0);
  const directCityServiceTotal = direct.screens[0].cityDistribution.reduce((sum, item) => sum + Number(item.serviceTotal || 0), 0);
  assert.equal(directCityAlertTotal, Number(directElderAlertMetric.value));
  assert.equal(directCityServiceTotal, Number(directElderServiceMetric.value));
  assert(direct.screens[1].ranking.length >= 1);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-admin-screens-"));
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
    assert(health.apiGroups.includes("admin-screens"));

    const screens = await json(baseUrl, "/api/admin/screens", { token: admin.token });
    assert.equal(screens.source, "7.2 管理端数据大屏");
    assert.equal(screens.screenCount, 2);
    assert.equal(screens.validation.valid, true);
    assert.equal(screens.screens[0].metrics.length, 8);
    assert.equal(screens.screens[1].metrics.length, 7);

    const elder = await json(baseUrl, "/api/admin/screens/elder-care", { token: admin.token });
    assert.equal(elder.title, "旅居养老作战数据大屏");
    assert(elder.deviceStatus.length >= 1);
    assert(elder.alertFeed.length >= 1);
    assert(elder.cityDistribution.length >= 1);

    const guide = await json(baseUrl, "/api/admin/screens/guide-dispatch", { token: admin.token });
    assert.equal(guide.title, "人工向导工作调配大屏");
    assert(guide.ranking.length >= 1);
    assert(Object.prototype.hasOwnProperty.call(guide.guideLoad, "online"));

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.adminDataScreens.architecturePath, "/api/admin/screens");
    assert.equal(reference.adminDataScreens.screenCount, 2);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("admin data screens ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
