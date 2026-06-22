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
  const block = extractRenderBlock(source, "renderOrders", "renderDispatch");

  [
    "const adminOrderListState = {",
    "function adminOrderListItemsForFilter(",
    "function adminOrderListRowsForFilter(",
    "function applyAdminOrderQuickFilter(",
    "function adminOrderListCount(",
    'action.match(/^订单列表筛选',
    "adminOrderListState.statusFilter = \"\";",
  ].forEach((needle) => {
    assert(source.includes(needle), `orders 页面必须具备真实订单筛选/统计逻辑：${needle}`);
  });

  [
    "adminOrderListRowsForFilter(",
    'filters("orders"',
    'tablePanel(`订单列表${titleSuffix}`',
  ].forEach((needle) => {
    assert(block.includes(needle), `orders 页面必须直接使用后台订单数据渲染：${needle}`);
  });

  [
    'kpis(["今日订单", "待确认", "待派单", "服务中", "已完成", "已取消"])',
  ].forEach((needle) => {
    assert(block.includes(needle), `orders 页面应继续展示订单状态卡片：${needle}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-orders-page-"));
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
    const orders = dashboard.dataLoop?.services?.orders || [];
    const statuses = [...new Set(orders.map((item) => String(item.status || "").trim()).filter(Boolean))];

    assert(orders.length >= 1, "后台接口必须至少返回一条订单记录用于订单管理页");
    assert(orders.every((item) => item.orderNo && item.serviceType && item.status), "订单管理页依赖的真实订单必须具备编号、类型、状态");
    assert(statuses.length >= 2, "订单管理页必须能从接口得到可区分状态的真实订单数据");
    assert(orders.some((item) => ["待服务", "服务中", "已派单", "已接单", "待派单", "待确认"].includes(item.status)), "订单管理页必须能从接口得到进行中或待处理订单");
    assert(orders.every((item) => item.time || item.createdAt), "订单管理页必须能从接口得到时间字段");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin orders real-data test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
