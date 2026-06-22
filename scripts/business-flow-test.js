const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  BUSINESS_FLOW_VERSION,
  businessFlowForApi,
  businessFlowSteps,
  validateBusinessFlow,
} = require("../server/lib/business-flow");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  [1, "需求发起", "用户手动下单、设备异常预警、定期服务需求触发", "用户端 / 设备"],
  [2, "智能分析", "平台识别需求类型、紧急程度、地理位置、服务偏好", "平台中枢 / 管理后台"],
  [3, "任务分配", "轻服务分配人工向导，专业服务分配商户，必要时管理员介入", "管理端 / 人工向导端 / 商户端"],
  [4, "服务执行", "向导或商户接单，联系用户，上门/远程/到店完成服务", "人工向导端 / 商户端 / 用户端"],
  [5, "反馈上报", "上传服务结果、异常记录、图片/文字备注、完成状态", "人工向导端 / 商户端"],
  [6, "结果反馈", "用户和家属查看服务完成情况并评价", "用户端 / 家属端"],
  [7, "数据沉淀", "沉淀用户数据、健康数据、服务数据、评价数据，优化推荐和调度", "管理后台 / 数据中台"],
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
  if (!response.ok || !payload.success) throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function login(baseUrl, role) {
  return json(baseUrl, "/api/auth/login", { method: "POST", body: { role } });
}

async function main() {
  assert.deepEqual(
    businessFlowSteps.map((item) => [item.step, item.action, item.systemHandling, item.involvedEnds.join(" / ")]),
    expectedRows,
    "第 3 节总体业务流程应与图示一致",
  );
  assert.equal(validateBusinessFlow().valid, true);
  assert.equal(businessFlowSteps.length, 7);
  assert(businessFlowSteps.every((item) => item.apiEndpoints.length > 0 && item.dataObjects.length > 0));

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = businessFlowForApi(seed);
  assert.equal(direct.version, BUSINESS_FLOW_VERSION);
  assert.equal(direct.stepCount, 7);
  assert.equal(direct.implementedStepCount, 7);
  assert.equal(direct.steps[0].action, "需求发起");
  assert.equal(direct.steps[6].action, "数据沉淀");
  assert(direct.acceptance.demandCanEnterSystem);
  assert(direct.acceptance.dataCanBeQueried);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-business-flow-"));
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
    const elder = await login(baseUrl, "elder");
    const admin = await login(baseUrl, "admin");
    const guide = await login(baseUrl, "guide");

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("business-flow"));

    const overview = await json(baseUrl, "/api/business-flow/overview", { token: admin.token });
    assert.equal(overview.version, BUSINESS_FLOW_VERSION);
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.stepCount, 7);
    assert.equal(overview.steps.find((item) => item.step === 3).action, "任务分配");
    assert(overview.related.demand.includes("/api/orders"));

    const bareOverview = await json(baseUrl, "/business-flow/overview", { token: admin.token });
    assert.equal(bareOverview.version, BUSINESS_FLOW_VERSION);

    const order = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        elderName: "李秀兰",
        serviceType: "陪伴就医",
        providerType: "guide",
        amount: 120,
        time: "2026-06-05 10:00",
        location: "昆明市第一人民医院",
        note: "第 3 节总体业务流程验收订单",
      },
    });
    assert.equal(order.status, "待派单");

    const pending = await json(baseUrl, "/api/admin/dispatch/pending", { token: admin.token });
    assert(pending.pendingOrders.some((item) => item.id === order.id));

    const dispatched = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: order.id, assigneeType: "guide", assigneeId: "guide-001" },
    });
    assert.equal(dispatched.task.status, "待接单");

    await json(baseUrl, `/api/tasks/${dispatched.task.id}/accept`, { method: "POST", token: guide.token, body: {} });
    await json(baseUrl, `/api/tasks/${dispatched.task.id}/start`, { method: "POST", token: guide.token, body: {} });
    const completed = await json(baseUrl, `/api/tasks/${dispatched.task.id}/complete`, {
      method: "POST",
      token: guide.token,
      body: { evidence: "第 3 节总体业务流程验收完成凭证" },
    });
    assert.equal(completed.order.status, "待确认");

    const confirmed = await json(baseUrl, `/api/orders/${order.id}/confirm`, {
      method: "POST",
      token: elder.token,
      body: { rating: 5, review: "第 3 节总体业务流程验收通过。", tags: ["流程闭环"] },
    });
    assert.equal(confirmed.status, "已完成");
    assert(confirmed.reviewDetail?.id);

    const afterFlow = await json(baseUrl, "/api/business-flow/overview", { token: admin.token });
    assert(afterFlow.runtime.demandInitiation.totalOrders >= overview.runtime.demandInitiation.totalOrders + 1);
    assert(afterFlow.runtime.taskAssignment.totalTasks >= overview.runtime.taskAssignment.totalTasks + 1);
    assert(afterFlow.runtime.resultFeedback.completedOrders >= 1);
    assert(afterFlow.runtime.dataAccumulation.reviewData >= 1);
    assert.equal(afterFlow.acceptance.demandCanEnterSystem, true);
    assert.equal(afterFlow.acceptance.dispatchCanCreateTasks, true);
    assert.equal(afterFlow.acceptance.executionCanReachFeedback, true);
    assert.equal(afterFlow.acceptance.dataCanBeQueried, true);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.businessFlow.architecturePath, "/api/business-flow/overview");
    assert.equal(reference.businessFlow.stepCount, 7);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("business flow ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
