const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  MVP_PRINCIPLES_VERSION,
  highDependencyCapabilities,
  mvpPrinciples,
  mvpPrinciplesForApi,
  validateMvpPrinciples,
} = require("../server/lib/mvp-principles");

const root = path.resolve(__dirname, "..");

const expectedPrinciples = [
  "先完成可演示、可试运营、可验收的核心闭环，不追求首期全量商业化。",
  "真实硬件、支付结算、医保/医院深度接口、复杂 AI 诊断等高依赖能力首期仅做接口预留或模拟。",
  "前端优先采用跨端技术栈，减少微信小程序、iOS、Android 三端重复开发。",
  "管理后台优先满足运营、调度、异常处理和数据查看，复杂 BI 分析后续迭代。",
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
    mvpPrinciples.map((item) => item.principle),
    expectedPrinciples,
    "第 1.3 节两周 MVP 原则应与图示一致",
  );
  assert.equal(validateMvpPrinciples().valid, true);
  assert.deepEqual(
    highDependencyCapabilities.map((item) => item.id),
    ["hardware", "payment", "medical-hospital", "ai-diagnosis"],
    "高依赖能力必须覆盖硬件、支付结算、医保/医院深度接口、复杂 AI 诊断",
  );

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = mvpPrinciplesForApi(seed, {
    integrations: highDependencyCapabilities.map((item) => ({ id: item.id, endpoint: item.endpoint })),
  });
  assert.equal(direct.version, MVP_PRINCIPLES_VERSION);
  assert.equal(direct.source, "1.3 两周 MVP 原则");
  assert.equal(direct.principleCount, 4);
  assert.equal(direct.reservedCapabilityCount, 4);
  assert.equal(direct.acceptance.coreLoopCanBeDemonstrated, true);
  assert.equal(direct.acceptance.highDependencyOnlyReservedOrSimulated, true);
  assert.equal(direct.acceptance.crossPlatformStrategyFixed, true);
  assert.equal(direct.acceptance.adminOperationsCovered, true);
  assert.equal(direct.acceptance.notFullCommercializationInFirstPhase, true);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-mvp-principles-"));
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

    const denied = await call(baseUrl, "/api/mvp/principles", { token: elder.token });
    assert.equal(denied.status, 403);
    assert.equal(denied.payload.success, false);

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("mvp-principles"));

    const overview = await json(baseUrl, "/api/mvp/principles", { token: admin.token });
    assert.equal(overview.version, MVP_PRINCIPLES_VERSION);
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.principleCount, 4);
    assert.equal(overview.acceptance.highDependencyOnlyReservedOrSimulated, true);
    assert(overview.highDependencyCapabilities.find((item) => item.id === "medical-hospital").reserved);
    assert(overview.highDependencyCapabilities.find((item) => item.id === "ai-diagnosis").reserved);

    const bareOverview = await json(baseUrl, "/mvp/principles", { token: admin.token });
    assert.equal(bareOverview.principleCount, 4);

    const integrations = await json(baseUrl, "/api/integrations/status", { token: admin.token });
    ["hardware", "payment", "medical-hospital", "ai-diagnosis"].forEach((id) => {
      assert(integrations.integrations.some((item) => item.id === id), `integration ${id} should be reserved`);
    });

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.mvpPrinciples.architecturePath, "/api/mvp/principles");
    assert.equal(reference.mvpPrinciples.principleCount, 4);

    const modules = await json(baseUrl, "/api/admin/system/modules", { token: admin.token });
    assert(modules.modules.find((item) => item.module === "运营后台服务").apiEndpoints.includes("/mvp/principles"));
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("mvp principles ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
