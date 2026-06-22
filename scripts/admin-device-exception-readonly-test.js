const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adminSourcePath = path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js");

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

function extractRenderBlock(source, functionName, nextFunctionName) {
  const start = source.indexOf(`function ${functionName}`);
  const end = source.indexOf(`function ${nextFunctionName}`);
  assert(start >= 0 && end > start, `${functionName} block not found`);
  return source.slice(start, end);
}

function isDeviceExceptionAlert(item = {}) {
  const text = `${item.type || ""} ${item.title || ""} ${item.description || ""} ${item.deviceId || ""}`;
  if (!text.trim()) return false;
  if (/向导|客户身体不适|服务异常|时间变更|临时取消|位置共享|爽约|失联|功能异常/.test(text)) return false;
  return /设备|离线|低电量|摔倒|未动|心率|血压|血氧|体温|睡眠|步数|定位|手环|机器人|血压计|血氧仪|监测/.test(text);
}

async function main() {
  const source = fs.readFileSync(adminSourcePath, "utf8");
  const block = extractRenderBlock(source, "renderDeviceExceptionDetail", "renderComplaintDetail");

  [
    "adminDeviceExceptionAlerts()",
    "currentAdminDeviceExceptionDetail()",
    'data-admin-exception-id=',
    'miniTable("设备异常列表"',
    '只读展示 / 数据源：/api/admin/alerts',
  ].forEach((needle) => {
    assert(block.includes(needle), `device-exception 页面必须接入真实只读逻辑：${needle}`);
  });

  [
    "批量处理",
    "派发检修",
    "联系老人",
    "联系家属",
    "派检修",
    "标记误报",
    "关闭事件",
    'filters("device")',
    "suggestionPanel()",
    "systemRows()",
    'timelinePanel("沟通记录"',
  ].forEach((needle) => {
    assert(!block.includes(needle), `device-exception 页面不能保留编辑/占位能力：${needle}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-device-exception-"));
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
    const dashboard = await json(baseUrl, "/api/admin/dashboard", { token: admin.token });
    const alerts = await json(baseUrl, "/api/admin/alerts", { token: admin.token });
    const deviceAlerts = alerts.filter((item) => isDeviceExceptionAlert(item));

    assert(deviceAlerts.length >= 1, "后台接口必须至少返回一条设备异常记录用于详情页展示");
    assert.equal(
      dashboard.stats.offlineDevices,
      (dashboard.dataLoop.health.devices || []).filter((item) => item.onlineStatus === "离线").length,
      "离线设备统计必须来自真实设备数据",
    );
    assert(deviceAlerts.every((item) => item.id && item.status && item.type), "设备异常详情页依赖的异常记录必须带 id/type/status");
    assert(Array.isArray(dashboard.dataLoop.health.records) && dashboard.dataLoop.health.records.length >= 1, "设备异常详情页必须有真实健康数据快照");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin device exception readonly test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
