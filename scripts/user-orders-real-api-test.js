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
    server.listen(0, () => {
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
  assert.match(source, /\/api\/user\/orders/, "订单页应接入用户订单聚合接口");
  assert.match(source, /data-order-search/, "订单搜索应为真实输入框");
  assert.match(source, /data-order-id="\$\{attr\(order\.id\)\}"/, "卡片与操作必须携带真实订单 ID");
  assert.match(source, /\/api\/orders\/\$\{encodeURIComponent\(orderId\)\}\/cancel/, "取消订单必须调用真实接口");
  assert.match(source, /selectedOrderId = localStorage\.getItem\("yunlv-selected-order"\)/, "评价必须关联用户选择的订单");
  assert.match(source, /href="tel:4008880000"/, "订单客服拨号必须使用原生 tel 链接");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-orders-"));
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
    const page = await json(baseUrl, "/api/user/orders", { token: login.token });
    assert.equal(page.sourceEndpoint, "/api/user/orders");
    assert.equal(page.summary.total, page.orders.length);
    assert.equal(page.filters.counts["全部"], page.summary.total);
    assert(page.orders.every((order) => order.id && order.normalizedStatus && order.capabilities));

    const sample = page.orders[0];
    assert(sample, "种子数据应包含用户订单");
    const search = await json(baseUrl, `/api/user/orders?q=${encodeURIComponent(sample.orderNo)}`, { token: login.token });
    assert(search.orders.some((order) => order.id === sample.id));
    const provider = await json(baseUrl, `/api/user/orders?providerType=${encodeURIComponent(sample.providerType)}`, { token: login.token });
    assert(provider.orders.every((order) => order.providerType === sample.providerType));

    const created = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: login.token,
      body: { serviceType: "订单页真实接口测试", providerType: "guide", amount: 1, location: "接口测试地点", note: "临时运行目录，不污染正式数据" },
    });
    const afterCreate = await json(baseUrl, `/api/user/orders?q=${encodeURIComponent(created.orderNo)}`, { token: login.token });
    assert.equal(afterCreate.orders[0].id, created.id);
    assert.equal(afterCreate.orders[0].capabilities.canCancel, true);

    await json(baseUrl, `/api/orders/${created.id}/cancel`, {
      method: "POST",
      token: login.token,
      body: { reason: "订单页接口测试" },
    });
    const cancelled = await json(baseUrl, `/api/user/orders?status=${encodeURIComponent("已取消")}&q=${encodeURIComponent(created.orderNo)}`, { token: login.token });
    assert.equal(cancelled.orders[0].normalizedStatus, "已取消");

    const ticket = await json(baseUrl, "/api/service-requests", {
      method: "POST",
      token: login.token,
      body: { role: "user", route: "orders", action: "订单客服咨询", type: "订单客服", description: `咨询 ${created.orderNo}` },
    });
    assert(ticket.requestNo);
    const tickets = await json(baseUrl, "/api/service-requests?role=user&route=orders", { token: login.token });
    assert(tickets.some((item) => item.id === ticket.id));
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user orders real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
