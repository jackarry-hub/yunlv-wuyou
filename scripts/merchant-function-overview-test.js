const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { merchantFunctionModules, merchantFunctionOverviewForApi, validateMerchantFunctionOverview } = require("../server/lib/merchant-function-overview");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["商户入驻", "P0", "后台审核通过后才能上架服务。"],
  ["服务管理", "P0", "用户端可查看已上架服务。"],
  ["订单/预约管理", "P0", "订单可确认、拒绝、改期。"],
  ["报价确认", "P1", "报价可回传用户端确认。"],
  ["服务执行", "P0", "服务完成后状态回传平台。"],
  ["售后与评价", "P1", "商户能查看评价与反馈。"],
  ["数据统计", "P1", "可按时间筛选。"],
  ["结算管理", "P1", "展示结算数据，首期可手动结算。"],
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
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  assert.deepEqual(
    merchantFunctionModules.map((item) => [item.module, item.priority, item.acceptance]),
    expectedRows,
    "商户端功能总览应与图示一致",
  );
  assert.equal(validateMerchantFunctionOverview().valid, true);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = merchantFunctionOverviewForApi(seed);
  assert.equal(direct.version, "merchant-function-overview-v1");
  assert.equal(direct.source, "商户端功能总览");
  assert.equal(direct.moduleCount, 8);
  assert.equal(direct.p0Count, 4);
  assert.equal(direct.p1Count, 4);
  assert.equal(direct.implementedCount, 8);
  assert.equal(direct.modules.some((item) => String(item.runtime.status).includes(["待", "接入"].join(""))), false);
  assert(direct.modules.find((item) => item.module === "订单/预约管理").apiEndpoints.includes("/api/merchant/orders/{id}/reschedule"));
  assert.equal(direct.modules.find((item) => item.module === "商户入驻").runtime.metrics.canPublishService, true);
  assert.equal(direct.modules.find((item) => item.module === "服务管理").runtime.metrics.userVisibleServices >= 1, true);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-merchant-functions-"));
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
    const merchant = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "merchant" } });

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("merchant-functions"));

    const overview = await json(baseUrl, "/api/merchant/functions/overview", { token: merchant.token });
    assert.equal(overview.moduleCount, 8);
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.modules.find((item) => item.module === "数据统计").runtime.metrics.revenue >= 0, true);
    assert.equal(overview.modules.find((item) => item.module === "结算管理").runtime.metrics.manualSettlementAvailable, true);
    assert.equal(overview.related.orders, "/api/merchant/orders");

    const rejectOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "商户拒绝验收服务", providerType: "merchant", amount: 199 },
    });
    const rejected = await json(baseUrl, `/api/merchant/orders/${rejectOrder.id}/reject`, {
      method: "POST",
      token: merchant.token,
      body: { reason: "验收脚本验证商户拒绝" },
    });
    assert.equal(rejected.status, "已取消");
    assert.equal(rejected.rejectReason, "验收脚本验证商户拒绝");

    const rescheduleOrder = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "商户改期验收服务", providerType: "merchant", amount: 299, time: "2026-06-06 09:30" },
    });
    const rescheduled = await json(baseUrl, `/api/merchant/orders/${rescheduleOrder.id}/reschedule`, {
      method: "POST",
      token: merchant.token,
      body: { time: "2026-06-07 10:30", reason: "验收脚本验证商户改期" },
    });
    assert.equal(rescheduled.status, "待服务");
    assert.equal(rescheduled.time, "2026-06-07 10:30");
    assert.equal(rescheduled.reschedule.oldTime, "2026-06-06 09:30");

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.merchantFunctionOverview.architecturePath, "/api/merchant/functions/overview");
    assert.equal(reference.merchantFunctionOverview.moduleCount, 8);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("merchant function overview ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
