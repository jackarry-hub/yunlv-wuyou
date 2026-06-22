const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function requirePlaywright() {
  try {
    return require("playwright");
  } catch {
    const fallback = path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
    if (fs.existsSync(fallback)) return require(fallback);
    throw new Error("Playwright is required for merchant workbench real function test.");
  }
}

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
  const deadline = Date.now() + 8000;
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

async function merchantToken(baseUrl) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ role: "merchant" }),
  });
  const json = await response.json();
  return json.data?.token || json.token;
}

async function merchantOrders(baseUrl, token) {
  const response = await fetch(`${baseUrl}/api/merchant/orders?merchantId=merchant-001`, {
    headers: { authorization: `Bearer ${token}` },
  });
  const json = await response.json();
  return json.data || json;
}

async function main() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-merchant-workbench-real-function-"));
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
    const token = await merchantToken(baseUrl);
    const beforeOrders = await merchantOrders(baseUrl, token);
    const candidate = beforeOrders.find((order) => ["已报价", "待派单", "已派单"].includes(order.status));
    assert(candidate, "测试数据必须包含可确认的真实商户订单");

    const { chromium } = requirePlaywright();
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      locale: "zh-CN",
    });
    const page = await context.newPage();
    const apiRequests = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/")) {
        apiRequests.push({ method: request.method(), url: request.url(), postData: request.postData() });
      }
    });

    try {
      await page.goto(`${baseUrl}/merchant/?test=workbench-real-function#24`, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForSelector("#phone .screen-workbench", { timeout: 12000 });
      await page.waitForFunction(() => document.body.innerText.includes("工作台") && document.body.innerText.includes("接待确认"), { timeout: 15000 });

      const entryButton = page.locator("#phone .screen-workbench .merchant-reception-card button", { hasText: /接待确认|确认预约/ }).first();
      await entryButton.click({ timeout: 8000 });
      await page.waitForURL(/#34$/, { timeout: 8000 });
      await page.waitForSelector("#phone .appointment-confirm-screen", { timeout: 8000 });
      const appointmentText = await page.locator("#phone").innerText();
      assert(
        appointmentText.includes(candidate.orderNo) || appointmentText.includes(candidate.serviceType),
        "工作台进入的预约确认页必须展示所选真实订单信息",
      );

      const beforeActionCount = apiRequests.length;
      await page.locator('[data-merchant-order-action="confirm"]').last().click({ timeout: 8000 });
      await page.waitForTimeout(1600);
      const confirmCalls = apiRequests.slice(beforeActionCount).filter((request) => /\/api\/merchant\/orders\/.+\/confirm$/.test(request.url));
      assert.equal(confirmCalls.length, 1, "确认预约必须调用 /api/merchant/orders/{id}/confirm");
      assert(
        confirmCalls[0].url.endsWith(`/api/merchant/orders/${encodeURIComponent(candidate.id)}/confirm`),
        `确认预约必须提交当前真实订单 ${candidate.id}，实际 ${confirmCalls[0].url}`,
      );

      const afterOrders = await merchantOrders(baseUrl, token);
      const changed = afterOrders.find((order) => order.id === candidate.id);
      assert(changed, "确认后必须仍能从真实订单接口读取该订单");
      assert.notEqual(changed.status, candidate.status, "确认预约后真实订单状态必须变化");
    } finally {
      await browser.close();
    }
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("merchant workbench real function ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
