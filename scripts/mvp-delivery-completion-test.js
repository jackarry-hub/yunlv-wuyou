const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  MVP_DELIVERY_COMPLETION_VERSION,
  mvpDeliveryCompletionForApi,
} = require("../server/lib/mvp-delivery-completion");

const root = path.resolve(__dirname, "..");

const integrationFixtures = [
  "payment",
  "sms",
  "map",
  "database-cache",
  "hardware",
  "medical-hospital",
  "storage",
  "llm",
  "ai-diagnosis",
  "app-build",
  "deployment",
].map((id) => ({ id }));

const requiredChecklistIds = [
  "initial-delivery-scope",
  "mvp-principles",
  "role-endpoints",
  "business-flow",
  "user-end",
  "guide-end",
  "merchant-end",
  "admin-end",
  "data-api-permission-state",
  "data-loop",
  "collaboration-notification",
  "technology-deployment",
  "demo-reset-acceptance",
];

function phrase(parts) {
  return parts.join("");
}

const genericStatusPhrases = [
  phrase(["状态", "已更新"]),
  phrase(["操作", "成功"]),
  phrase(["占位", "页"]),
  phrase(["待", "接入"]),
  phrase(["工程", "联调"]),
  phrase(["开发", "联调"]),
];

const mountedGenericStatusPhrases = [
  ...genericStatusPhrases,
  phrase(["已", "打开"]),
  phrase(["已", "切换"]),
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

function assertCompletion(payload) {
  assert.equal(payload.version, MVP_DELIVERY_COMPLETION_VERSION);
  assert.equal(payload.ready, true);
  assert.equal(payload.summary.total, requiredChecklistIds.length);
  assert.equal(payload.summary.failed, 0);
  assert.equal(payload.summary.p0Total, 12);
  assert.equal(payload.summary.p0Passed, 12);
  assert.deepEqual(payload.outstanding, []);
  assert.deepEqual(payload.checklist.map((item) => item.id), requiredChecklistIds);
  assert(payload.checklist.every((item) => item.passed === true));
  assert(payload.runtime.reviews > 0, "默认种子数据必须有评价沉淀");
  assert(payload.runtime.activitySignups > 0, "默认种子数据必须有活动报名沉淀");
  assert(payload.runtime.serviceRequests > 0, "默认种子数据必须有服务请求沉淀");
  assert(payload.endpoints.includes("/api/admin/demo/reset"));
  assert(payload.endpoints.includes("/api/tasks/dispatch"));
  assert(payload.endpoints.includes("/api/merchant/orders/{id}/start"));
  assert(payload.endpoints.includes("/api/merchant/orders/{id}/complete"));
}

function assertNoGenericUserFacingStatus() {
  const files = [
    "apps/guide/app.js",
    "apps/merchant/app.js",
    "apps/admin/app.js",
    "apps/shared/business-bridge.js",
    "server/lib/user-home-requirements.js",
    "server/lib/guide-function-overview.js",
    "server/lib/merchant-function-overview.js",
    "server/lib/admin-function-overview.js",
  ];
  const mountedFiles = [
    "云旅无忧UI界面参考图/用户端/云旅无忧用户端代码实现/app.js",
    "云旅无忧UI界面参考图/向导端/向导端代码实现/app.js",
    "云旅无忧UI界面参考图/商户端/merchant-ui-prototype/app.js",
    "云旅无忧UI界面参考图/管理后台/yunlv-admin-ui/app.js",
  ];
  files.forEach((file) => {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    assert.equal(genericStatusPhrases.some((item) => text.includes(item)), false, `${file} 不应出现泛化状态或占位文案`);
  });
  mountedFiles.forEach((file) => {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    assert.equal(mountedGenericStatusPhrases.some((item) => text.includes(item)), false, `${file} 不应出现泛化弹窗或占位文案`);
  });
}

function assertMobileStatusBatteryFallback() {
  const mobileFiles = [
    "云旅无忧UI界面参考图/用户端/云旅无忧用户端代码实现/app.js",
    "云旅无忧UI界面参考图/向导端/向导端代码实现/app.js",
    "云旅无忧UI界面参考图/商户端/merchant-ui-prototype/app.js",
  ];
  mobileFiles.forEach((file) => {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    assert.equal(/class=["']battery\s+is-hidden/.test(text), false, `${file} 状态栏电池不能初始隐藏`);
    assert(text.includes("FALLBACK_BATTERY_STATUS"), `${file} 必须在浏览器不提供电量 API 时显示兜底电池图标`);
    assert(
      text.includes("浏览器未提供真实电量") || text.includes("浏览器暂未提供电量"),
      `${file} 必须标记电量 API 不可用时的可见兜底状态`,
    );
  });
}

async function main() {
  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = mvpDeliveryCompletionForApi(seed, { integrations: integrationFixtures, hasResetEndpoint: true });
  assertCompletion(direct);
  assertNoGenericUserFacingStatus();
  assertMobileStatusBatteryFallback();

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-mvp-completion-"));
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

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("mvp-delivery-completion"));

    const denied = await call(baseUrl, "/api/admin/mvp-delivery/completion", { token: elder.token });
    assert.equal(denied.status, 403);
    assert.equal(denied.payload.success, false);

    const completion = await json(baseUrl, "/api/admin/mvp-delivery/completion", { token: admin.token });
    assertCompletion(completion);

    const bareCompletion = await json(baseUrl, "/admin/mvp-delivery/completion", { token: admin.token });
    assertCompletion(bareCompletion);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.mvpDeliveryCompletion.architecturePath, "/api/admin/mvp-delivery/completion");
    assert.equal(reference.mvpDeliveryCompletion.ready, true);
    assert.equal(reference.mvpDeliveryCompletion.summary.failed, 0);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("mvp delivery completion ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
