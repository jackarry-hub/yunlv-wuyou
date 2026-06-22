const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  INITIAL_DELIVERY_SCOPE_VERSION,
  initialDeliveryRows,
  initialDeliveryScopeForApi,
  validateInitialDeliveryScope,
} = require("../server/lib/initial-delivery-scope");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["用户端", "微信小程序、iOS App、Android App", "统一体验，覆盖首页、AI 管家、活动地图、紧急求助、智能硬件、旅居管家、订单、消息、我的。"],
  ["人工向导端", "小程序/App 内人工向导角色端", "覆盖接单大厅、订单详情、服务中、异常上报、我的订单、今日收入、上线接单设置。"],
  ["商户端", "小程序/App 内商户角色端", "覆盖服务发布、订单预约、确认报价、服务执行、完成上报、评价售后。"],
  ["管理后台", "PC Web 管理后台", "覆盖用户、老人、人工向导、商户、服务、订单、活动、异常、设备、数据看板、系统配置。"],
  ["硬件数据", "小云机器人、智能手环及扩展智能设备", "首期以模拟数据/接口预留为主，支持后续真实设备接入。"],
  ["AI 能力", "智能管家问答、服务推荐、异常解释", "首期以通用大模型+预设知识库+规则推荐实现。"],
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

async function json(baseUrl, route, options = {}) {
  const result = await call(baseUrl, route, options);
  if (!result.payload.success) throw new Error(`${route} failed: ${JSON.stringify(result.payload.error)}`);
  return result.payload.data;
}

async function login(baseUrl, role) {
  return json(baseUrl, "/api/auth/login", { method: "POST", body: { role } });
}

async function main() {
  assert.deepEqual(
    initialDeliveryRows.map((item) => [item.scope, item.content, item.deliveryRequirement]),
    expectedRows,
    "第 1.2 节首期交付范围应与图示一致",
  );
  assert.equal(validateInitialDeliveryScope().valid, true);
  assert(initialDeliveryRows.every((item) => item.routes.length > 0 && item.apiEndpoints.length > 0 && item.dataObjects.length > 0));

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = initialDeliveryScopeForApi(seed);
  assert.equal(direct.version, INITIAL_DELIVERY_SCOPE_VERSION);
  assert.equal(direct.source, "1.2 首期交付范围");
  assert.equal(direct.scopeCount, 6);
  assert.equal(direct.appScopeCount, 3);
  assert.equal(direct.platformScopeCount, 3);
  assert.equal(direct.acceptance.allSixScopesCovered, true);
  assert.equal(direct.acceptance.allScopesHaveRoutesAndApis, true);
  assert.equal(direct.acceptance.userExperienceUnified, true);
  assert.equal(direct.acceptance.hardwareUsesSimulationOrReservation, true);
  assert.equal(direct.acceptance.aiUsesModelKnowledgeRules, true);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-initial-scope-"));
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
    const admin = await login(baseUrl, "admin");
    const elder = await login(baseUrl, "elder");

    const denied = await call(baseUrl, "/api/delivery/initial-scope", { token: elder.token });
    assert.equal(denied.status, 403);
    assert.equal(denied.payload.success, false);

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("initial-delivery-scope"));

    const overview = await json(baseUrl, "/api/delivery/initial-scope", { token: admin.token });
    assert.equal(overview.version, INITIAL_DELIVERY_SCOPE_VERSION);
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.scopeCount, 6);
    assert(overview.scopes.find((item) => item.scope === "用户端").deliveryRequirement.includes("统一体验"));
    assert(overview.scopes.find((item) => item.scope === "硬件数据").deliveryRequirement.includes("模拟数据/接口预留"));
    assert(overview.scopes.find((item) => item.scope === "AI 能力").deliveryRequirement.includes("通用大模型+预设知识库+规则推荐"));

    const bareOverview = await json(baseUrl, "/delivery/initial-scope", { token: admin.token });
    assert.equal(bareOverview.scopeCount, 6);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.initialDeliveryScope.architecturePath, "/api/delivery/initial-scope");
    assert.equal(reference.initialDeliveryScope.scopeCount, 6);

    const modules = await json(baseUrl, "/api/admin/system/modules", { token: admin.token });
    assert(modules.modules.find((item) => item.module === "运营后台服务").apiEndpoints.includes("/delivery/initial-scope"));
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("initial delivery scope ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
