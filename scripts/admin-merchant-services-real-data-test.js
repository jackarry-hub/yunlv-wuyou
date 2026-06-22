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

function extractBlock(source, functionName, nextFunctionName) {
  const start = source.indexOf(`function ${functionName}`);
  const end = source.indexOf(`function ${nextFunctionName}`);
  assert(start >= 0 && end > start, `${functionName} block not found`);
  return source.slice(start, end);
}

async function main() {
  const source = fs.readFileSync(adminSourcePath, "utf8");
  const pageBlock = extractBlock(source, "renderMerchantServicesReference", "renderMerchantAuditReference");
  const actionBlock = extractBlock(source, "handleAdminServiceStatusAction", "handleAdminUserDetailAction");

  [
    'if (page.id === "merchant-services") return renderMerchantServicesReference(page);',
    "function renderMerchantServicesReference(",
    "merchantServiceRowsForApi(services)",
    "服务项目筛选:",
    "applyAdminMerchantServiceQuickFilter(",
    "data-action=\"${nextAction}服务：${escapeHtml(service.id || \"\")}\"",
  ].forEach((needle) => {
    assert(source.includes(needle), `商户服务页必须具备真实服务项目渲染和操作：${needle}`);
  });

  assert(!pageBlock.includes('rowsForDomain("merchant")'), "商户服务项目页不能回退到商户列表");
  assert(!pageBlock.includes("renderRelatedCards"), "商户服务项目页不能展示通用相关推荐假模块");
  assert(actionBlock.includes("/api/admin/services/${service.id}/status"), "商户服务上下架必须调用当前服务的后台接口");
  assert(actionBlock.includes("serviceIdMatch"), "商户服务上下架必须按服务 ID 定位记录");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-merchant-services-page-"));
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
    const services = await json(baseUrl, "/api/admin/services", { token: admin.token });
    const merchantServices = services.filter((item) => item.providerType === "merchant" || item.merchantId || String(item.providerId || "").startsWith("merchant"));
    const statuses = new Set(merchantServices.map((item) => item.status));

    assert(merchantServices.length >= 1, "后台接口必须返回商户服务项目");
    assert(merchantServices.every((item) => item.id && item.title && item.providerName && item.status), "商户服务项目必须具备 ID、名称、商户、状态");
    assert(statuses.has("上架"), "商户服务页必须能显示已上架服务");
    assert(statuses.has("待审核") || statuses.has("已下架"), "商户服务页必须能显示待审核或已下架服务状态");

    const target = merchantServices.find((item) => item.status !== "上架") || merchantServices[0];
    const updated = await json(baseUrl, `/api/admin/services/${target.id}/status`, {
      method: "POST",
      token: admin.token,
      body: { status: "上架", note: "商户服务页真实接口测试" },
    });
    assert.equal(updated.id, target.id, "服务状态接口必须返回被操作的服务");
    assert.equal(updated.status, "上架", "服务状态接口必须真实更新状态");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin merchant services real-data test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
