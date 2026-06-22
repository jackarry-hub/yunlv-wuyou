const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  SMART_DEVICE_ROBOT_REQUIREMENTS_VERSION,
  smartDeviceRobotRequirements,
  smartDeviceRobotRequirementsForApi,
  validateSmartDeviceRobotRequirements,
} = require("../server/lib/smart-device-robot-requirements");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["今日健康概览", "展示心率、血压、血氧、睡眠、步数等状态条。", "P0"],
  ["设备状态", "智能手环、小云机器人分别显示连接状态、电量、最后同步时间。", "P0"],
  ["设备联动", "展示手环→平台→机器人→家人/紧急联系人的联动关系。", "P1"],
  ["小云机器人子页面", "显示在线状态、电量、网络、语音音量、设备状态。", "P0"],
  ["守护功能", "摔倒检测、异常检测、离家/长时间未动提醒、生命体征检测、用药提醒、SOS 紧急呼叫。", "P0"],
  ["家人通话", "展示家属联系人，支持语音/视频通话入口。", "P1"],
  ["寻求他人帮助", "可联系附近求助、社区工作人员、人工向导，一键求助。", "P1"],
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
    smartDeviceRobotRequirements.map((item) => [item.feature, item.detail, item.priority]),
    expectedRows,
    "4.6 智能设备与小云机器人需求应与图示一致",
  );
  assert.equal(validateSmartDeviceRobotRequirements().valid, true);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = smartDeviceRobotRequirementsForApi(seed);
  assert.equal(direct.version, SMART_DEVICE_ROBOT_REQUIREMENTS_VERSION);
  assert.equal(direct.requirementCount, 7);
  assert.equal(direct.p0Count, 4);
  assert.equal(direct.p1Count, 3);
  assert(direct.healthOverview.metrics.some((item) => item.label === "步数"));
  assert(direct.deviceStatus.devices.some((item) => item.role === "bracelet"));
  assert(direct.deviceStatus.devices.some((item) => item.role === "robot"));
  assert.equal(direct.guardianFeatures.length, 6);
  assert.equal(direct.linkage.steps.length, 4);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-smart-device-"));
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
    const family = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "family" } });

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("device-robot-requirements"));

    const requirements = await json(baseUrl, "/api/devices/robot-requirements", { token: elder.token });
    assert.equal(requirements.validation.valid, true);
    assert.equal(requirements.requirementCount, 7);
    assert(requirements.healthOverview.metrics.some((item) => item.metricType === "steps"));
    assert(requirements.healthOverview.metrics.find((item) => item.metricType === "sleep").tone === "orange");
    assert(requirements.deviceStatus.independentCards);
    assert(requirements.deviceStatus.devices.find((item) => item.role === "bracelet").title === "智能手环");
    assert(requirements.deviceStatus.devices.find((item) => item.role === "robot").title === "小云机器人");
    assert.equal(requirements.robotStatus.visualized, true);
    assert(requirements.guardianFeatures.some((item) => item.name === "SOS 紧急呼叫" && item.apiEndpoint === "/api/alerts/sos"));
    assert(requirements.helpRequest.channels.some((item) => item.target === "人工向导"));

    const bareRequirements = await json(baseUrl, "/devices/robot-requirements", { token: elder.token });
    assert.equal(bareRequirements.requirementCount, 7);

    const guardian = await json(baseUrl, "/api/devices/device-002/action", {
      method: "POST",
      token: elder.token,
      body: { action: "用药提醒", guardianFeature: "medicineReminder", enabled: false },
    });
    assert.equal(guardian.device.guardianSettings.medicineReminder, false);
    assert(/已关闭/.test(guardian.action.result));

    const call = await json(baseUrl, "/api/devices/device-002/action", {
      method: "POST",
      token: elder.token,
      body: { action: "视频通话", callType: "video", contactId: "contact-001" },
    });
    assert.equal(call.device.lastCall.type, "视频通话");
    const familyMessages = await json(baseUrl, "/api/messages?role=family", { token: family.token });
    assert(familyMessages.some((item) => item.scenario === "家人通话"));

    const selfCheck = await json(baseUrl, "/api/devices/device-002/action", {
      method: "POST",
      token: elder.token,
      body: { action: "测试设备" },
    });
    assert.equal(selfCheck.device.deviceStatus, "检测正常");

    const helpRequest = await json(baseUrl, "/api/devices/help-request", {
      method: "POST",
      token: elder.token,
      body: { target: "附近求助", description: "需要附近人员帮忙确认情况" },
    });
    assert.equal(helpRequest.status, "待处理");
    assert.equal(helpRequest.type, "附近求助");

    const serviceRequests = await json(baseUrl, "/api/service-requests?route=robot", { token: elder.token });
    assert(serviceRequests.some((item) => item.id === helpRequest.id));

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.smartDeviceRobotRequirements.architecturePath, "/api/devices/robot-requirements");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("smart device robot requirements ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
