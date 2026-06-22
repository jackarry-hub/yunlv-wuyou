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
    "function hydrateGuideActiveServiceFromApi",
    "guideApiRequest('/api/guide/active-service?guideId=guide-001')",
    "function applyGuideActiveServiceData",
    "function guideActiveServiceOrder",
    "function completeGuideActiveService",
    "data-guide-active-service-refresh",
    "data-guide-complete-current-service",
    "data-guide-active-service-state",
  ].forEach((needle) => assert(source.includes(needle), `向导端服务中 #04 必须接入真实服务中接口与功能：${needle}`));
  const renderStart = source.indexOf("function renderInService()");
  const renderEnd = source.indexOf("function renderException()", renderStart);
  assert(renderStart >= 0 && renderEnd > renderStart, "必须能定位服务中页面渲染函数");
  const renderSource = source.slice(renderStart, renderEnd);
  ["李奶奶", "弥勒市人民医院", "00:15:30", "陪同挂号", "奶奶行动较慢"].forEach((text) => {
    assert(!renderSource.includes(text), `服务中页面不能继续硬编码演示文案：${text}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-active-service-"));
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
    assert(health.apiGroups.includes("guide-active-service"), "健康检查必须登记 guide-active-service 接口组");

    const active = await json(baseUrl, "/api/guide/active-service?guideId=guide-001", { token: guide.token });
    assert.equal(active.sourceEndpoint, "/api/guide/active-service");
    assert.equal(active.dashboard.sourceEndpoint, "/api/guide/dashboard");
    assert.equal(active.actions.refresh.endpoint, "/api/guide/active-service");
    assert.equal(active.actions.route.route, "27");
    assert.equal(active.actions.complete.endpoint, "/api/tasks/{id}/complete");
    assert.equal(active.actions.exception.endpoint, "/api/guide/exception");
    assert.equal(active.task.id, "task-001");
    assert.equal(active.order.id, "order-001");
    assert.equal(active.service.status, "服务中");
    assert.equal(active.service.taskStatus, "服务中");
    assert.equal(active.service.orderStatus, "服务中");
    assert.equal(active.service.customer.name, "李秀兰");
    assert.ok(active.service.customer.phone, "服务中接口必须返回客户联系电话");
    assert.ok(active.service.checklist.length >= 3, "服务中接口必须返回服务清单");
    assert.ok(active.service.note.includes("膝关节复查"), "服务中备注必须来自真实订单 note");
    assert.ok(active.service.amount > 0, "服务中接口必须返回预计收入");

    const bareActive = await json(baseUrl, "/guide/active-service?guideId=guide-001", { token: guide.token });
    assert.equal(bareActive.sourceEndpoint, "/api/guide/active-service");

    const completed = await json(baseUrl, `/api/tasks/${active.task.id}/complete`, {
      method: "POST",
      token: guide.token,
      body: { evidence: "guide active service real api test" },
    });
    assert.equal(completed.task.status, "待确认");
    assert.equal(completed.order.status, "待确认");

    const afterComplete = await json(baseUrl, "/api/guide/active-service?guideId=guide-001", { token: guide.token });
    assert.equal(afterComplete.service, null, "任务完成后服务中接口不应继续返回已完成/待确认任务");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide active service real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
