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
  const pageBlock = extractBlock(source, "renderGuidesReference", "renderMerchantsReference");
  const actionBlock = extractBlock(source, "handleAdminGuideManagementAction", "handleAdminDeviceDetailAction");

  [
    'if (page.id === "guides") return renderGuidesReference(page);',
    "const adminGuideState = {",
    "function renderGuidesReference(",
    "guideRowsForApi(guides)",
    "adminApi(\"/api/admin/guides\")",
    "data-action=\"向导筛选:",
    "data-action=\"查看向导：${escapeHtml(id)}\"",
    "data-action=\"通过向导：${escapeHtml(id)}\"",
  ].forEach((needle) => {
    assert(source.includes(needle), `人工向导管理页必须接入真实向导接口和操作：${needle}`);
  });

  assert(!pageBlock.includes('rowsForDomain("guide")'), "人工向导管理页不能回退到通用向导静态表格");
  assert(!pageBlock.includes("renderRelatedCards"), "人工向导管理页不能展示通用相关推荐假模块");
  assert(actionBlock.includes("/api/admin/guides/${guide.id}/audit"), "向导审核必须调用当前向导 ID 的后台接口");
  assert(actionBlock.includes("applyAdminGuideQuickFilter("), "向导 KPI 必须执行当前表格筛选");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guides-page-"));
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
    const guides = await json(baseUrl, "/api/admin/guides", { token: admin.token });
    assert(guides.length >= 1, "后台接口必须返回人工向导列表");
    assert(guides.every((guide) => guide.id && guide.realName && guide.status && guide.stats?.source === "server-aggregate"), "向导列表必须包含接口聚合统计");

    const target = guides.find((guide) => guide.status !== "已认证") || guides[0];
    const updated = await json(baseUrl, `/api/admin/guides/${target.id}/audit`, {
      method: "POST",
      token: admin.token,
      body: { status: "已认证", decision: "测试通过向导", note: "人工向导页真实接口测试" },
    });
    assert.equal(updated.id, target.id, "向导审核接口必须返回被操作的向导");
    assert.equal(updated.status, "已认证", "向导审核接口必须真实更新状态");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin guides real-data test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
