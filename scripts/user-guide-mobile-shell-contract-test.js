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
    throw new Error("Playwright is required for user/guide mobile shell contract test.");
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

async function inspectShell(page, config, baseUrl) {
  await page.goto(`${baseUrl}${config.path}?reload=user-guide-mobile-shell-test${config.hash}`, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await page.waitForSelector(config.phoneSelector, { timeout: 8000 });
  return page.evaluate((config) => {
    const phone = document.querySelector(config.phoneSelector);
    const stage = document.querySelector(config.stageSelector);
    const phoneRect = phone.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const style = getComputedStyle(phone);
    return {
      displayMode: document.documentElement.dataset.display,
      phoneWidth: Math.round(phoneRect.width),
      phoneHeight: Math.round(phoneRect.height),
      phoneLeft: Math.round(phoneRect.left),
      phoneCenter: Math.round(phoneRect.left + phoneRect.width / 2),
      stageCenter: Math.round(stageRect.left + stageRect.width / 2),
      borderRadius: style.borderRadius,
      documentWidth: document.documentElement.scrollWidth,
      innerWidth,
      hiddenStates: config.hiddenSelectors.map((selector) => {
        const element = document.querySelector(selector);
        if (!element) return { selector, exists: false, visible: false };
        const rect = element.getBoundingClientRect();
        const styles = getComputedStyle(element);
        return {
          selector,
          exists: true,
          visible: rect.width > 0 && rect.height > 0 && styles.display !== "none" && styles.visibility !== "hidden",
        };
      }),
    };
  }, config);
}

async function inspectGuideProfileEditRows(page, baseUrl) {
  await page.goto(`${baseUrl}/guide/?reload=guide-profile-edit-row-style-test#40`, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await page.waitForSelector("#phone .guide-profile-edit-row [data-guide-profile-field]", { timeout: 8000 });
  return page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("#phone .guide-profile-edit-row"));
    const firstRow = rows[0];
    const firstControl = firstRow?.querySelector("[data-guide-profile-field]");
    const syncButton = document.querySelector("#phone [data-guide-profile-refresh]");
    const saveButtons = Array.from(document.querySelectorAll('#phone [data-action="保存资料"]'));
    const visibleSaveButtons = saveButtons.filter((button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    });
    const rowRect = firstRow?.getBoundingClientRect();
    const rowStyle = firstRow ? getComputedStyle(firstRow) : null;
    const controlRect = firstControl?.getBoundingClientRect();
    const controlStyle = firstControl ? getComputedStyle(firstControl) : null;
    const syncButtonRect = syncButton?.getBoundingClientRect();
    const syncButtonStyle = syncButton ? getComputedStyle(syncButton) : null;
    const topSaveButton = visibleSaveButtons.find((button) => button.classList.contains("guide-profile-save-top"));
    const topSaveButtonStyle = topSaveButton ? getComputedStyle(topSaveButton) : null;
    return {
      rowCount: rows.length,
      rowHeight: Math.round(rowRect?.height || 0),
      rowBackgroundColor: rowStyle?.backgroundColor || "",
      rowGridTemplateColumns: rowStyle?.gridTemplateColumns || "",
      controlHeight: Math.round(controlRect?.height || 0),
      controlBackgroundColor: controlStyle?.backgroundColor || "",
      controlBorderWidth: controlStyle?.borderWidth || "",
      controlBorderStyle: controlStyle?.borderStyle || "",
      controlTextAlign: controlStyle?.textAlign || "",
      syncButtonText: syncButton?.textContent?.trim() || "",
      syncButtonClassName: syncButton?.className || "",
      syncButtonHeight: Math.round(syncButtonRect?.height || 0),
      syncButtonBackgroundColor: syncButtonStyle?.backgroundColor || "",
      syncButtonBorderWidth: syncButtonStyle?.borderWidth || "",
      saveButtonCount: visibleSaveButtons.length,
      saveButtonTexts: visibleSaveButtons.map((button) => button.textContent.trim()),
      saveButtonClassNames: visibleSaveButtons.map((button) => button.className || ""),
      saveButtonBackgroundColor: topSaveButtonStyle?.backgroundColor || "",
      saveButtonBorderWidth: topSaveButtonStyle?.borderWidth || "",
      saveButtonBoxShadow: topSaveButtonStyle?.boxShadow || "",
      documentWidth: document.documentElement.scrollWidth,
      innerWidth,
    };
  });
}

async function main() {
  const targets = [
    {
      name: "用户端",
      path: "/user/",
      hash: "#home",
      phoneSelector: "#app.phone",
      stageSelector: ".workspace",
      hiddenSelectors: [".screen-rail", ".mobile-switcher"],
    },
    {
      name: "向导端",
      path: "/guide/",
      hash: "#01",
      phoneSelector: "#phone.phone",
      stageSelector: ".phone-stage",
      hiddenSelectors: [".screen-nav", ".phone-meta"],
    },
  ];

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-guide-mobile-shell-"));
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
    try {
      const page = await context.newPage();
      for (const target of targets) {
        const metrics = await inspectShell(page, target, baseUrl);
        assert.equal(metrics.displayMode, "app", `${target.name}正式入口必须是 app 模式`);
        for (const hiddenState of metrics.hiddenStates) {
          assert.equal(hiddenState.visible, false, `${target.name}正式入口不应显示原型辅助元素 ${hiddenState.selector}`);
        }
        assert(metrics.phoneWidth <= 430, `${target.name}宽屏预览必须是手机宽度，当前 ${metrics.phoneWidth}px`);
        assert(Math.abs(metrics.phoneCenter - metrics.stageCenter) <= 4, `${target.name}手机外壳必须在舞台中居中`);
        assert.notEqual(metrics.borderRadius, "0px", `${target.name}宽屏预览应保留手机圆角外壳`);
        assert(metrics.documentWidth <= metrics.innerWidth + 2, `${target.name}页面不能横向溢出：${JSON.stringify(metrics)}`);
      }
      const guideProfileRows = await inspectGuideProfileEditRows(page, baseUrl);
      assert(guideProfileRows.rowCount >= 4, `向导端 #40 基础资料必须渲染多项资料行：${JSON.stringify(guideProfileRows)}`);
      assert(guideProfileRows.rowHeight <= 42, `向导端 #40 资料行应采用商户端 #02 的紧凑行高：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.rowBackgroundColor, "rgba(0, 0, 0, 0)", `向导端 #40 资料行不能使用块状底色：${JSON.stringify(guideProfileRows)}`);
      assert(guideProfileRows.controlHeight < 30, `向导端 #40 输入/选择控件应为行内透明控件，不应是蓝底输入块：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.controlBackgroundColor, "rgba(0, 0, 0, 0)", `向导端 #40 输入/选择控件背景应对齐商户端 #02：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.controlBorderWidth, "0px", `向导端 #40 输入/选择控件不应保留输入框边线：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.controlTextAlign, "right", `向导端 #40 资料值应与商户端 #02 一样右对齐：${JSON.stringify(guideProfileRows)}`);
      assert.match(guideProfileRows.syncButtonText, /同步/, `向导端 #40 重新拉取资料入口必须明确写成同步，不应与保存混淆：${JSON.stringify(guideProfileRows)}`);
      assert(!guideProfileRows.syncButtonClassName.includes("secondary-btn"), `向导端 #40 同步入口不能继续使用醒目的次按钮样式：${JSON.stringify(guideProfileRows)}`);
      assert(guideProfileRows.syncButtonHeight <= 32, `向导端 #40 同步入口应降级为小链接，不应抢占保存按钮层级：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.syncButtonBackgroundColor, "rgba(0, 0, 0, 0)", `向导端 #40 同步入口背景应透明：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.syncButtonBorderWidth, "0px", `向导端 #40 同步入口不应有胶囊按钮边框：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.saveButtonCount, 1, `向导端 #40 保存资料入口不能重复渲染顶部和底部两个按钮：${JSON.stringify(guideProfileRows)}`);
      assert.deepEqual(guideProfileRows.saveButtonTexts, ["保存"], `向导端 #40 应保留右上角保存入口：${JSON.stringify(guideProfileRows)}`);
      assert(guideProfileRows.saveButtonClassNames.every((className) => className.includes("guide-profile-save-top")), `向导端 #40 保留的保存入口必须是顶部保存：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.saveButtonBackgroundColor, "rgba(0, 0, 0, 0)", `向导端 #40 右上角保存必须是纯文字按钮，不能有背景色：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.saveButtonBorderWidth, "0px", `向导端 #40 右上角保存不能有按钮边框：${JSON.stringify(guideProfileRows)}`);
      assert.equal(guideProfileRows.saveButtonBoxShadow, "none", `向导端 #40 右上角保存不能有阴影：${JSON.stringify(guideProfileRows)}`);
    } finally {
      await browser.close();
    }
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user guide mobile shell contract ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
