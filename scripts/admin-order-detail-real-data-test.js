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

async function main() {
  const source = fs.readFileSync(adminSourcePath, "utf8");
  const block = extractRenderBlock(source, "renderOrderDetailAdmin", "renderDispatchDetailAdmin");

  [
    "const adminOrderState = {",
    "function rememberAdminOrderSelection(",
    "function adminOrderCollection(",
    "function currentAdminOrderDetail(",
    "function currentAdminOrderTask(",
    "function currentAdminOrderProfile(",
    "function currentAdminOrderProvider(",
    "function adminOrderTimelineRows(",
    "function adminOrderAuditRows(",
    "rememberAdminOrderSelection(el, route);",
    "adminOrderState.selectedOrderId = \"\";",
  ].forEach((needle) => {
    assert(source.includes(needle), `order-detail 页面必须具备真实订单状态/详情选择逻辑：${needle}`);
  });

  [
    "currentAdminOrderDetail()",
    "currentAdminOrderTask(order)",
    "currentAdminOrderProfile(order, account)",
    "currentAdminOrderProvider(order, task)",
    'miniTable("状态流转记录"',
    'miniTable("后台操作记录"',
    'miniTable("健康数据快照"',
  ].forEach((needle) => {
    assert(block.includes(needle), `order-detail 页面必须直接消费后台订单明细数据：${needle}`);
  });

  [
    "DD20240519001",
    "李奶奶（72岁）",
    "李向导",
    "云康护理中心",
    "微信支付",
    "服务路线与位置（实时更新）",
    "人工改派",
    "联系用户",
    "取消订单",
    "paymentPanel()",
    "statusInterventionPanel()",
    'timelinePanel("沟通记录", true)',
  ].forEach((needle) => {
    assert(!block.includes(needle), `order-detail 页面不能保留静态占位或假操作：${needle}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-order-detail-"));
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
    const auditLogs = await json(baseUrl, "/api/admin/audit-logs", { token: admin.token });
    const orders = dashboard.dataLoop?.services?.orders || [];
    const tasks = dashboard.dataLoop?.services?.tasks || [];
    const accounts = dashboard.dataLoop?.users?.accounts || [];
    const profiles = dashboard.dataLoop?.users?.elderProfiles || [];
    const contacts = dashboard.dataLoop?.users?.familyContacts || [];
    const records = dashboard.dataLoop?.health?.records || [];
    const guides = dashboard.dataLoop?.guides?.guides || [];
    const merchants = dashboard.dataLoop?.merchants?.merchants || [];

    assert(orders.length >= 1, "后台接口必须至少返回一条订单记录用于订单详情页展示");
    assert(tasks.some((item) => item.orderId && item.assigneeName), "后台接口必须返回订单关联任务与执行方");
    assert(accounts.some((item) => item.role === "elder" || item.role === "family"), "后台接口必须返回用户/家属账号信息");
    assert(profiles.length >= 1, "后台接口必须返回老人档案信息");
    assert(contacts.length >= 1, "后台接口必须返回家属联系方式");
    assert(records.length >= 1, "后台接口必须返回健康数据快照");
    assert(guides.length + merchants.length >= 1, "后台接口必须返回向导或商户执行方信息");
    assert(Array.isArray(auditLogs), "后台接口必须返回后台操作日志数组");
    assert(orders.some((item) => Array.isArray(item.timeline) && item.timeline.length >= 1), "订单详情页依赖的真实订单必须带状态流转 timeline");
    assert(orders.some((item) => item.orderNo && item.serviceType && item.location && item.status), "订单详情页依赖的真实订单必须具备编号、类型、地点、状态");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin order detail real-data test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
