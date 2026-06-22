const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const merchantCssPath = path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "styles.css");

function requirePlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    const fallback = path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
    if (fs.existsSync(fallback)) return require(fallback);
    throw new Error("Playwright is required for merchant mobile shell contract test.");
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

async function main() {
  const css = fs.readFileSync(merchantCssPath, "utf8");
  const appPhoneBlock = css.match(/html\[data-display="app"\]\s+\.phone\s*\{(?<body>[^}]*)\}/)?.groups?.body || "";
  assert.match(appPhoneBlock, /width:\s*100vw;/, "真实移动端仍应填满移动设备视口");
  assert.match(appPhoneBlock, /max-width:\s*100vw;/, "真实移动端仍应填满移动设备视口");
  assert.match(css, /@media\s*\(min-width:\s*520px\)\s*\{[\s\S]*html\[data-display="app"\]\s+\.phone\s*\{[\s\S]*width:\s*min\(390px,\s*calc\(100vw - 24px\)\)/, "桌面/右侧预览必须收敛为手机宽度");
  assert.doesNotMatch(appPhoneBlock, /max-width:\s*none;/, "商户端 app 模式不能在宽屏继续铺满整行");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-merchant-mobile-shell-"));
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
    const { chromium } = requirePlaywright();
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 980, height: 844 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      locale: "zh-CN",
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/merchant/?reload=mobile-shell-test#24`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForSelector("#phone .phone-screen", { timeout: 8000 });
    await page.waitForSelector("#phone .screen-workbench .workbench-stats .stat strong", { timeout: 8000 });
    const metrics = await page.evaluate(() => {
      const phone = document.querySelector("#phone");
      const stage = document.querySelector(".stage");
      const screenPanel = document.querySelector(".screen-panel");
      const notesPanel = document.querySelector(".notes-panel");
      const phoneRect = phone.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const screenPanelRect = screenPanel.getBoundingClientRect();
      const notesPanelRect = notesPanel.getBoundingClientRect();
      const style = getComputedStyle(phone);
      return {
        displayMode: document.documentElement.dataset.display,
        phoneWidth: Math.round(phoneRect.width),
        phoneLeft: Math.round(phoneRect.left),
        stageCenter: Math.round(stageRect.left + stageRect.width / 2),
        phoneCenter: Math.round(phoneRect.left + phoneRect.width / 2),
        borderRadius: style.borderRadius,
        screenPanelVisible: screenPanelRect.width > 0 && getComputedStyle(screenPanel).display !== "none",
        notesPanelVisible: notesPanelRect.width > 0 && getComputedStyle(notesPanel).display !== "none",
        documentWidth: document.documentElement.scrollWidth,
        innerWidth,
      };
    });
    const workbenchStatMetrics = await page.evaluate(() => {
      const strip = document.querySelector("#phone .screen-workbench .workbench-stats");
      const firstValue = strip.querySelector(".stat strong");
      firstValue.textContent = "¥398.00";
      const stripRect = strip.getBoundingClientRect();
      const stats = Array.from(strip.querySelectorAll(".stat"));
      return stats.map((stat) => {
        const value = stat.querySelector("strong");
        const label = stat.querySelector("span:not(.stat-icon)");
        const statRect = stat.getBoundingClientRect();
        const valueRect = value.getBoundingClientRect();
        return {
          label: label?.textContent?.trim() || "",
          value: value.textContent.trim(),
          stripLeft: Math.round(stripRect.left),
          stripRight: Math.round(stripRect.right),
          statLeft: Math.round(statRect.left),
          statRight: Math.round(statRect.right),
          valueLeft: Math.round(valueRect.left),
          valueRight: Math.round(valueRect.right),
        };
      });
    });
    await page.goto(`${baseUrl}/merchant/?reload=mobile-shell-order-quick-links-test#20`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForSelector("#phone .screen-order-list .merchant-order-quick-links button", { timeout: 8000 });
    const orderQuickLinkMetrics = await page.evaluate(() => (
      Array.from(document.querySelectorAll("#phone .screen-order-list .merchant-order-quick-links button")).map((button) => {
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return {
          text: button.textContent.trim(),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          borderStyle: style.borderStyle,
          borderWidth: style.borderWidth,
          borderRadius: parseFloat(style.borderRadius),
          backgroundColor: style.backgroundColor,
          display: style.display,
        };
      })
    ));
    await browser.close();

    assert.equal(metrics.displayMode, "app", "本地商户端正式入口必须是 app 模式");
    assert.equal(metrics.screenPanelVisible, false, "本地商户端不应显示左侧页面列表");
    assert.equal(metrics.notesPanelVisible, false, "本地商户端不应显示右侧说明栏");
    assert(metrics.phoneWidth <= 430, `宽屏预览中的商户端必须是手机宽度，当前 ${metrics.phoneWidth}px`);
    assert(Math.abs(metrics.phoneCenter - metrics.stageCenter) <= 4, "手机外壳必须在舞台中居中");
    assert.notEqual(metrics.borderRadius, "0px", "宽屏预览应保留手机圆角外壳");
    assert(metrics.documentWidth <= metrics.innerWidth + 2, `页面不能横向溢出：${JSON.stringify(metrics)}`);
    workbenchStatMetrics.forEach((item) => {
      assert(
        item.valueLeft >= item.statLeft && item.valueRight <= item.statRight,
        `工作台统计值必须留在自己的格子内：${JSON.stringify(item)}`,
      );
      assert(
        item.valueLeft >= item.stripLeft && item.valueRight <= item.stripRight,
        `工作台统计值必须留在统计卡片边界内：${JSON.stringify(item)}`,
      );
    });
    orderQuickLinkMetrics.forEach((item) => {
      assert(item.height >= 38, `订单快捷入口必须满足移动端触控高度：${JSON.stringify(item)}`);
      assert(item.borderRadius >= 16, `订单快捷入口不能退回浏览器默认方角按钮：${JSON.stringify(item)}`);
      assert.notEqual(item.borderStyle, "outset", `订单快捷入口不能使用浏览器默认 outset 边框：${JSON.stringify(item)}`);
      assert.notEqual(item.backgroundColor, "rgb(239, 239, 239)", `订单快捷入口不能使用浏览器默认灰底：${JSON.stringify(item)}`);
    });
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("merchant mobile shell contract ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
