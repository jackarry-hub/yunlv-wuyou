const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");

function requirePlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    const fallback = path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
    if (fs.existsSync(fallback)) return require(fallback);
    throw new Error("Playwright is required for admin dispatch detail interaction tests.");
  }
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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {
      await delay(120);
    }
  }
  throw new Error(`admin dispatch detail test server did not start.\n${output()}`);
}

async function waitForNotice(page, pattern, label) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    const noticeText = await page.locator(".permission-notice").textContent().catch(() => "");
    const normalized = String(noticeText || "").replace(/\s+/g, " ").trim();
    if (pattern.test(normalized)) return normalized;
    await delay(120);
  }
  throw new Error(`${label} did not appear`);
}

async function main() {
  const { chromium } = requirePlaywright();
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-admin-dispatch-detail-"));
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

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await waitForServer(baseUrl, () => logs);
    await page.goto(`${baseUrl}/admin/?r=admin-dispatch-detail-interaction-20260617#dispatch-detail`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1");
    assert.equal((await page.locator("h1").textContent()).replace(/\s+/g, " ").trim(), "任务调度详情");

    const firstStatIcon = page.locator(".admin-task-title + .admin-stat-grid .admin-stat-card .admin-stat-icon").first();
    const iconLayout = await firstStatIcon.evaluate((node) => {
      const iconRect = node.getBoundingClientRect();
      const svg = node.querySelector("svg");
      const svgRect = svg ? svg.getBoundingClientRect() : null;
      const style = window.getComputedStyle(node);
      return {
        display: style.display,
        alignItems: style.alignItems,
        justifyItems: style.justifyItems,
        deltaX: svgRect ? Math.abs((svgRect.left + svgRect.width / 2) - (iconRect.left + iconRect.width / 2)) : null,
        deltaY: svgRect ? Math.abs((svgRect.top + svgRect.height / 2) - (iconRect.top + iconRect.height / 2)) : null,
      };
    });
    assert.equal(iconLayout.display, "grid", "调度详情 KPI 图标容器必须保持 grid 居中布局");
    assert.equal(iconLayout.alignItems, "center", "调度详情 KPI 图标容器必须垂直居中");
    assert.equal(iconLayout.justifyItems, "center", "调度详情 KPI 图标容器必须水平居中");
    assert(iconLayout.deltaX !== null && iconLayout.deltaX <= 1, `调度详情 KPI 图标必须水平居中，当前偏移 ${iconLayout.deltaX}`);
    assert(iconLayout.deltaY !== null && iconLayout.deltaY <= 1, `调度详情 KPI 图标必须垂直居中，当前偏移 ${iconLayout.deltaY}`);

    const editButtons = page.locator("button", { hasText: "编辑" });
    assert.equal(await editButtons.count(), 0, "任务调度详情页不应保留无效编辑按钮");

    const summaryText = (await page.locator(".admin-summary-strip").textContent()).replace(/\s+/g, " ").trim();
    assert(!/服务类型.*(陪伴就医).*陪伴就医/.test(summaryText), "顶部摘要不能重复渲染相同内容");

    await page.locator('[data-action="改派"]').click();
    const reassignNotice = await waitForNotice(page, /重新选择执行方.*改派/, "改派提示");
    assert(reassignNotice.includes("改派"));

    const selectButton = page.locator('[data-action^="选择执行方:"]').first();
    await selectButton.click();
    const selectNotice = await waitForNotice(page, /已改派给|已分配给/, "选择执行方结果");
    assert(/已改派给|已分配给/.test(selectNotice), "选择执行方后必须写回真实结果");

    const closeButtons = page.locator('[data-action="关闭调度编辑"]');
    assert.equal(await closeButtons.count(), 0, "选择执行方后应退出改派模式");

    await page.locator('[data-action="通知执行方"]').click();
    const notifyNotice = await waitForNotice(page, /已通知/, "通知执行方结果");
    assert(notifyNotice.includes("已通知"), "通知执行方后必须显示真实通知结果");

    await page.locator('[data-action="取消任务"]').click();
    const cancelNotice = await waitForNotice(page, /已取消/, "取消任务结果");
    assert(cancelNotice.includes("已取消"), "取消任务后必须显示真实取消结果");

    console.log("admin dispatch detail interactions ok");
  } finally {
    await browser.close();
    child.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
