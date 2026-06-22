const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");

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
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

function assertStatsDelta(before, after, expected) {
  assert.equal(after.orderCount, before.orderCount + 1, "接单数必须来自服务端订单/任务聚合");
  assert.equal(after.completedOrders, before.completedOrders + 1, "完成数必须随完成订单聚合增加");
  assert(after.revenue >= before.revenue + expected.amount, "收入必须包含完成订单金额");
  assert(after.todayIncome >= before.todayIncome + expected.amount, "今日收入必须包含今日完成订单金额");
  assert(after.settlementPending >= before.settlementPending + expected.amount, "待结算必须包含完成/待确认订单金额");
}

async function main() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-provider-stats-"));
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
    const guide = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "guide" } });
    const merchant = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "merchant" } });

    const beforeGuide = await json(baseUrl, "/api/guide/stats?guideId=guide-001", { token: guide.token });
    const guideOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "统计聚合向导服务", providerType: "guide", amount: 321 },
    });
    const claimed = await json(baseUrl, "/api/guide/tasks/claim-next", {
      method: "POST",
      token: guide.token,
      body: { guideId: "guide-001", orderId: guideOrder.id },
    });
    await json(baseUrl, `/api/tasks/${claimed.task.id}/start`, { method: "POST", token: guide.token });
    await json(baseUrl, `/api/tasks/${claimed.task.id}/complete`, { method: "POST", token: guide.token, body: { evidence: "provider-stats" } });
    await json(baseUrl, `/api/orders/${guideOrder.id}/confirm`, { method: "POST", token: elder.token, body: { rating: 5 } });
    const afterGuide = await json(baseUrl, "/api/guide/stats?guideId=guide-001", { token: guide.token });
    const guideDashboard = await json(baseUrl, "/api/guide/dashboard?guideId=guide-001", { token: guide.token });
    const guideProviderStats = await json(baseUrl, "/api/provider/stats?role=guide&providerId=guide-001", { token: guide.token });
    assertStatsDelta(beforeGuide.stats, afterGuide.stats, { amount: 321 });
    assert.equal(guideDashboard.stats.todayIncome, afterGuide.stats.todayIncome);
    assert.equal(guideDashboard.stats.completedOrders, afterGuide.stats.completedOrders);
    assert.equal(guideProviderStats.stats.settlementPending, afterGuide.stats.settlementPending);

    const beforeMerchant = await json(baseUrl, "/api/merchant/stats?merchantId=merchant-001", { token: merchant.token });
    await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "普通商户待派单服务", providerType: "merchant", providerId: "merchant-001", amount: 111 },
    });
    const afterPendingMerchant = await json(baseUrl, "/api/merchant/stats?merchantId=merchant-001", { token: merchant.token });
    assert.equal(
      afterPendingMerchant.stats.todayIncome,
      beforeMerchant.stats.todayIncome,
      "普通待派单商户服务订单不能提前计入今日收入",
    );

    await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        serviceType: "优选商城商品结算",
        providerType: "merchant",
        providerId: "merchant-001",
        source: "用户端优选商城",
        amount: 89,
        items: [{ id: "sku-test", name: "测试商品", price: 89, quantity: 1 }],
      },
    });
    const afterCheckoutMerchant = await json(baseUrl, "/api/merchant/stats?merchantId=merchant-001", { token: merchant.token });
    assert(
      afterCheckoutMerchant.stats.todayIncome >= afterPendingMerchant.stats.todayIncome + 89,
      "商户商城结算订单必须计入今日收入",
    );
    assert(
      afterCheckoutMerchant.stats.revenue >= afterPendingMerchant.stats.revenue + 89,
      "商户商城结算订单必须计入商户收入",
    );

    const merchantOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "统计聚合商户服务", providerType: "merchant", providerId: "merchant-001", amount: 654 },
    });
    await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/confirm`, { method: "POST", token: merchant.token });
    await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/start`, { method: "POST", token: merchant.token });
    await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/complete`, { method: "POST", token: merchant.token });
    await json(baseUrl, `/api/orders/${merchantOrder.id}/confirm`, { method: "POST", token: elder.token, body: { rating: 5 } });
    const afterMerchant = await json(baseUrl, "/api/merchant/stats?merchantId=merchant-001", { token: merchant.token });
    const merchantDashboard = await json(baseUrl, "/api/merchant/dashboard?merchantId=merchant-001", { token: merchant.token });
    const merchantProviderStats = await json(baseUrl, "/api/provider/stats?role=merchant&providerId=merchant-001", { token: merchant.token });
    assertStatsDelta(afterCheckoutMerchant.stats, afterMerchant.stats, { amount: 654 });
    assert.equal(merchantDashboard.stats.todayIncome, afterMerchant.stats.todayIncome);
    assert.equal(merchantDashboard.stats.completedOrders, afterMerchant.stats.completedOrders);
    assert.equal(merchantDashboard.stats.settlementPending, afterMerchant.stats.settlementPending);
    assert.equal(merchantProviderStats.stats.orderCount, afterMerchant.stats.orderCount);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("provider stats aggregation ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
