const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  USER_FUNCTION_OVERVIEW_VERSION,
  userFunctionModules,
  userFunctionOverviewForApi,
  validateUserFunctionOverview,
} = require("../server/lib/user-function-overview");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["首页", "城市定位、旅居服务入口、活动推荐、功能宫格、底部导航", "P0"],
  ["智能管家", "AI 聊天、语音互动、快捷问题、旅居咨询、服务推荐", "P0"],
  ["活动地图", "地图活动点、活动筛选、附近活动、活动详情、报名", "P0"],
  ["紧急求助", "SOS、一键拨打、位置上传、紧急联系人、健康信息", "P0"],
  ["智能设备", "设备状态、今日健康概览、手环/机器人联动、设备设置", "P0"],
  ["小云机器人", "语音对话、活动提醒、摔倒检测、异常检测、家人通话、寻求帮助", "P0"],
  ["旅居管家/人工向导", "服务分类、向导推荐、下单、订单跟踪", "P0"],
  ["订单与消息", "订单列表、订单详情、进度提醒、系统消息、评价", "P0"],
  ["我的", "个人资料、家属绑定、健康档案、紧急联系人、设置", "P1"],
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
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
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

async function text(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) throw new Error(`GET ${route} failed: ${response.status}`);
  return response.text();
}

async function main() {
  assert.deepEqual(
    userFunctionModules.map((item) => [item.module, item.coreFunctions.join("、"), item.priority]),
    expectedRows,
    "4.1 用户端功能总览应与图示一致",
  );
  assert.equal(validateUserFunctionOverview().valid, true);
  assert.equal(userFunctionModules.length, 9);
  assert.equal(userFunctionModules.filter((item) => item.priority === "P0").length, 8);
  assert.equal(userFunctionModules.filter((item) => item.priority === "P1").length, 1);
  assert(userFunctionModules.every((item) => item.route && item.apiEndpoints.length > 0));

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = userFunctionOverviewForApi(seed);
  assert.equal(direct.version, USER_FUNCTION_OVERVIEW_VERSION);
  assert.equal(direct.moduleCount, 9);
  assert.equal(direct.p0Count, 8);
  assert.equal(direct.p1Count, 1);
  assert.equal(direct.runtime.allP0Ready, true);
  assert(direct.modules.find((item) => item.module === "首页").runtime.quickEntries.includes("安全守护"));
  assert(direct.modules.find((item) => item.module === "智能管家").apiEndpoints.includes("/api/ai/chat"));
  assert(direct.modules.find((item) => item.module === "活动地图").runtime.mapPoints >= 1);
  assert(direct.modules.find((item) => item.module === "紧急求助").runtime.emergencyContacts >= 1);
  assert(direct.modules.find((item) => item.module === "订单与消息").runtime.orderCount >= 1);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-functions-"));
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

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("user-functions"));

    const overview = await json(baseUrl, "/api/user/functions/overview", { token: elder.token });
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.version, USER_FUNCTION_OVERVIEW_VERSION);
    assert.equal(overview.moduleCount, 9);
    assert.equal(overview.p0Count, 8);
    assert.equal(overview.runtime.allP0Ready, true);
    assert(overview.modules.find((item) => item.module === "小云机器人").coreFunctions.includes("家人通话"));
    assert(overview.modules.find((item) => item.module === "旅居管家/人工向导").apiEndpoints.includes("/api/orders"));
    assert.equal(overview.related.home, "/api/user/home");

    const bareOverview = await json(baseUrl, "/user/functions/overview", { token: elder.token });
    assert.equal(bareOverview.version, USER_FUNCTION_OVERVIEW_VERSION);
    assert.equal(bareOverview.modules.find((item) => item.module === "我的").priority, "P1");

    const home = await json(baseUrl, "/api/user/home", { token: elder.token });
    assert.equal(home.functionOverview.version, USER_FUNCTION_OVERVIEW_VERSION);
    assert.equal(home.functionOverview.runtime.allP0Ready, true);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.userFunctionOverview.architecturePath, "/api/user/functions/overview");
    assert.equal(reference.userFunctionOverview.moduleCount, 9);

    const html = await text(baseUrl, "/user/");
    assert(html.includes("/shared/business-bridge.js"));
    const bridge = await text(baseUrl, "/shared/business-bridge.js");
    assert(bridge.includes("/api/user/functions/overview"));
    assert(bridge.includes("yunlvUserFunctions"));
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user function overview ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
