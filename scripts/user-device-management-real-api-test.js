const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {}
    await delay(120);
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
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(appPath, "utf8");
  assert.match(source, /\/api\/user\/device-management/, "设备管理页应读取用户设备管理聚合接口");
  assert.match(source, /hydrateDeviceManagementFromApi/, "设备管理页应有独立真实接口水合逻辑");
  assert.match(source, /data-device-id="\$\{attr\(deviceId\)\}"/, "设备卡片与操作必须携带真实设备 ID");
  assert.match(source, /\/api\/devices\/\$\{encodeURIComponent\(deviceId\)\}\/action/, "设备测试和授权必须写入真实设备 action 接口");
  assert.match(source, /\/api\/user\/personal/, "无绑定设备时设备授权必须降级保存到用户个人授权接口");
  assert.match(source, /deviceManagementPersonalAuthKey/, "设备授权必须映射到用户级授权键，避免无设备时点击无反馈");
  assert.match(source, /\/api\/devices\/\$\{encodeURIComponent\(deviceId\)\}/, "解绑设备必须调用真实设备删除接口");
  assert.match(source, /\/api\/devices\/bind/, "添加设备必须调用真实绑定接口");
  assert.match(source, /\/api\/devices\/help-request/, "帮助中心必须创建真实设备帮助任务");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-device-management-"));
  let logs = "";
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), YUNLV_RUNTIME_DIR: runtimeDir },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  child.stderr.on("data", (chunk) => { logs += chunk.toString(); });

  try {
    await waitForServer(baseUrl, () => logs);
    const login = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const page = await json(baseUrl, "/api/user/device-management", { token: login.token });
    assert.equal(page.sourceEndpoint, "/api/user/device-management");
    assert(Array.isArray(page.devices), "设备管理聚合接口必须返回 devices");
    assert(page.devices.length >= 2, "种子数据应包含已绑定设备");
    assert(page.devices.every((device) => device.id && device.deviceId && device.displayName && device.actions && device.metrics));
    assert(page.summary.total >= page.devices.length);
    assert(page.summary.connected >= 1);
    assert(page.authSettings.some((item) => item.key === "healthData"));
    assert(page.addableDevices.some((item) => item.type === "智能血压计"));

    const robot = page.devices.find((device) => /机器人/.test(`${device.type}${device.displayName}`)) || page.devices[1];
    const tested = await json(baseUrl, `/api/devices/${encodeURIComponent(robot.id)}/action`, {
      method: "POST",
      token: login.token,
      body: { role: "user", action: "测试小云机器人", route: "device-management" },
    });
    assert.equal(tested.action.route, "device-management");
    assert.equal(tested.device.deviceStatus, "检测正常");

    const band = page.devices.find((device) => /手环/.test(`${device.type}${device.displayName}`)) || page.devices[0];
    const toggled = await json(baseUrl, `/api/devices/${encodeURIComponent(band.id)}/action`, {
      method: "POST",
      token: login.token,
      body: { role: "user", action: "健康数据同步", guardianFeature: "healthData", enabled: false },
    });
    assert.equal(toggled.device.guardianSettings.healthData, false);

    for (const device of page.devices) {
      await json(baseUrl, `/api/devices/${encodeURIComponent(device.id)}`, { method: "DELETE", token: login.token });
    }
    const emptyPage = await json(baseUrl, "/api/user/device-management", { token: login.token });
    assert.equal(emptyPage.devices.length, 0, "回归场景必须覆盖公网无绑定设备用户");
    const noDeviceAuth = await json(baseUrl, "/api/user/personal", {
      method: "PUT",
      token: login.token,
      body: { authorizations: { healthData: false, abnormalAlerts: false, familyVisible: false } },
    });
    assert.equal(noDeviceAuth.authorizations.healthData, false);
    assert.equal(noDeviceAuth.authorizations.abnormalAlerts, false);
    assert.equal(noDeviceAuth.authorizations.familyVisible, false);
    const emptyAfterAuth = await json(baseUrl, "/api/user/device-management", { token: login.token });
    assert.equal(emptyAfterAuth.authSettings.find((item) => item.key === "healthData").enabled, false);
    assert.equal(emptyAfterAuth.authSettings.find((item) => item.key === "abnormalAlerts").enabled, false);
    assert.equal(emptyAfterAuth.authSettings.find((item) => item.key === "familyVisible").enabled, false);

    const bound = await json(baseUrl, "/api/devices/bind", {
      method: "POST",
      token: login.token,
      body: { deviceId: "TEST-BP-0620", name: "接口测试血压计", type: "智能血压计", battery: 88, source: "device-management-test" },
    });
    assert.equal(bound.deviceId, "TEST-BP-0620");
    const synced = await json(baseUrl, `/api/devices/${encodeURIComponent(bound.id)}/sync`, {
      method: "POST",
      token: login.token,
      body: { battery: 87, onlineStatus: "在线" },
    });
    assert.equal(synced.battery, 87);
    const afterBind = await json(baseUrl, "/api/user/device-management", { token: login.token });
    assert(afterBind.devices.some((device) => device.id === bound.id && device.battery === 87));

    const help = await json(baseUrl, "/api/devices/help-request", {
      method: "POST",
      token: login.token,
      body: { role: "user", route: "device-management", target: "设备帮助中心", action: "设备帮助中心", description: "设备管理页真实帮助任务测试" },
    });
    assert(help.requestNo);

    await json(baseUrl, `/api/devices/${encodeURIComponent(bound.id)}`, { method: "DELETE", token: login.token });
    const afterDelete = await json(baseUrl, "/api/user/device-management", { token: login.token });
    assert(!afterDelete.devices.some((device) => device.id === bound.id), "解绑后聚合接口不应再返回该设备");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user device management real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
