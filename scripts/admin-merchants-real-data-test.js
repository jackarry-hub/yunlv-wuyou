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
    } catch {
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
  const block = extractRenderBlock(source, "renderMerchantsReference", "merchantServiceItemsForApi");

  [
    "function merchantServiceItemsForApi(",
    "function adminMerchantCity(",
    "function adminMerchantRatingText(",
    "merchantRowsForApi(merchants)",
    "tablePanel(`商户列表 共 ${adminMerchantState.loaded ? merchants.length : 0} 条`, rows, headersForDomain(\"merchant\"))",
  ].forEach((needle) => {
    assert(source.includes(needle), `商户页必须直接使用后台商户接口数据：${needle}`);
  });

  assert(!block.includes('rowsForDomain("merchant")'), "商户列表不能回退到静态商户行");
  assert(source.includes('const services = merchantServiceItemsForApi(adminMerchantState.services || []);'), "商户 KPI 服务项目必须只统计商户服务");
  assert(!source.includes('`${(98.6 - index * 1.8).toFixed(1)}%`'), "商户评分不能使用前端假评分公式");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-merchants-page-"));
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
    const [merchants, services] = await Promise.all([
      json(baseUrl, "/api/admin/merchants", { token: admin.token }),
      json(baseUrl, "/api/admin/services", { token: admin.token }),
    ]);
    const merchantServices = services.filter((item) => item.providerType === "merchant" || item.merchantId || String(item.providerId || "").startsWith("merchant"));

    assert(merchants.length >= 1, "后台接口必须至少返回一条商户记录用于商户管理页");
    assert(merchants.every((item) => item.id && item.name && item.status), "商户管理页依赖的真实商户必须具备 ID、名称、状态");
    assert(merchants.every((item) => item.orderCount !== undefined && item.serviceCount !== undefined), "商户管理页必须读取接口聚合的订单数和服务数");
    assert(merchantServices.length >= 1, "后台服务接口必须返回商户服务项目");
    assert(merchantServices.length < services.length, "商户服务统计必须区别于全部服务统计");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin merchants real-data test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
