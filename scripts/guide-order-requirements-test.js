const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  guideOrderRequirements,
  guideOrderRequirementsForApi,
  matchGuideOrderRequirement,
  validateGuideOrderRequirements,
} = require("../server/lib/guide-order-requirements");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["陪伴就医", "挂号取号、陪同就诊、检查缴费、取药等", "服务时间、医院、老人信息、备注", "P0"],
  ["导游游览", "景点讲解、路线规划、拍照陪同、行程安排", "目的地、时间、人数、交通需求", "P0"],
  ["护工护理", "日常照护、康复协助、陪伴护理、生活照料", "护理时长、护理要求、健康备注", "P0"],
  ["接送出行", "机场/高铁站接送、日常出行、代驾陪同", "起点、终点、时间、人数", "P1"],
  ["帮办代办", "证件办理、业务代办、生活缴费、快递代取", "代办事项、材料、时间", "P1"],
  ["生活陪伴", "聊天解闷、散步购物、棋牌娱乐、情感陪伴", "服务地点、时长、需求说明", "P1"],
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
  if (!result.payload.success) throw new Error(`${route} failed: ${JSON.stringify(result.payload)}`);
  return result.payload.data;
}

async function main() {
  assert.deepEqual(
    guideOrderRequirements.map((item) => [item.category, item.description, item.orderFields.join("、"), item.priority]),
    expectedRows,
    "4.7 旅居管家与人工向导下单需求应与图示一致",
  );
  assert.equal(validateGuideOrderRequirements().valid, true);
  assert.equal(matchGuideOrderRequirement("交通接送").category, "接送出行");
  assert.equal(matchGuideOrderRequirement("护工护理").priority, "P0");

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = guideOrderRequirementsForApi(seed);
  assert.equal(direct.version, "4.7-steward-guide-order-requirements-v1");
  assert.equal(direct.categoryCount, 6);
  assert.equal(direct.p0Count, 3);
  assert.equal(direct.p1Count, 3);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-order-requirements-"));
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
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const admin = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "admin" } });
    const guide = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "guide" } });

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("guide-order-requirements"));

    const requirements = await json(baseUrl, "/api/guide/order-requirements", { token: guide.token });
    assert.equal(requirements.validation.valid, true);
    assert.equal(requirements.categories.find((item) => item.category === "生活陪伴").fieldText, "服务地点、时长、需求说明");

    const bareRequirements = await json(baseUrl, "/guide/order-requirements", { token: guide.token });
    assert.equal(bareRequirements.categoryCount, 6);

    const missing = await call(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "导游游览", providerType: "guide", strictRequirements: true },
    });
    assert.equal(missing.status, 400);
    assert(/目的地/.test(missing.payload.error.message));

    const order = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        serviceType: "护工护理",
        elderName: "李秀兰",
        careDuration: "3小时",
        careRequirement: "康复协助、陪伴护理",
        healthNote: "高血压，行动稍慢",
        location: "翠湖康养公寓",
        time: "2026-06-06 09:30",
        strictRequirements: true,
      },
    });
    assert.equal(order.providerType, "guide");
    assert.equal(order.requirementCategory, "护工护理");
    assert.equal(order.requirementPriority, "P0");
    assert.equal(order.orderFields.careDuration, "3小时");

    const dispatched = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: order.id, assigneeType: "guide", assigneeId: "guide-001" },
    });
    assert.equal(dispatched.task.status, "待接单");

    const tourOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        serviceType: "导游游览",
        providerType: "guide",
        destination: "滇池海埂公园",
        visitDate: "2026-06-07",
        peopleCount: 2,
        trafficNeed: "步行慢行",
        amount: 160,
      },
    });
    const tourDispatched = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: tourOrder.id, assigneeType: "guide", assigneeId: "guide-001" },
    });
    const dashboard = await json(baseUrl, "/api/guide/dashboard", { token: guide.token });
    assert(dashboard.tasks.some((task) => task.id === dispatched.task.id));
    assert(dashboard.tasks.some((task) => task.id === tourDispatched.task.id));
    const careDashboard = await json(baseUrl, "/api/guide/dashboard?serviceType=%E6%8A%A4%E5%B7%A5%E6%8A%A4%E7%90%86", { token: guide.token });
    assert(careDashboard.tasks.some((task) => task.id === dispatched.task.id));
    assert(!careDashboard.tasks.some((task) => task.id === tourDispatched.task.id));

    const errandOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "帮办代办", providerType: "guide", amount: 90, note: "代取快递并办理资料复印" },
    });
    await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "生活陪伴", providerType: "guide", amount: 80, note: "散步陪伴" },
    });
    const claimedByType = await json(baseUrl, "/api/guide/tasks/claim-next", {
      method: "POST",
      token: guide.token,
      body: { serviceType: "帮办代办" },
    });
    assert.equal(claimedByType.order.id, errandOrder.id);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.guideOrderRequirements.architecturePath, "/api/guide/order-requirements");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide order requirements ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
