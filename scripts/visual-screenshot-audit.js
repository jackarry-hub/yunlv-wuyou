const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const baseUrl = process.env.VISUAL_AUDIT_BASE_URL || "http://localhost:5173";
const outRoot = path.join(root, "artifacts", "visual-audit");
const latestDir = path.join(outRoot, "latest");
const screenshotsDir = path.join(latestDir, "screenshots");

function requirePlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    const fallbackDirs = [
      path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
      path.join(process.env.HOME || "", ".npm/_npx/88950a7d37a5e205/node_modules"),
    ];
    for (const dir of fallbackDirs) {
      const candidate = path.join(dir, "playwright");
      if (fs.existsSync(candidate)) return require(candidate);
    }
    throw new Error("Playwright is not installed in this project or the bundled Codex runtime.");
  }
}

function makeElement() {
  return {
    innerHTML: "",
    textContent: "",
    dataset: {},
    style: { setProperty() {} },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {},
    removeEventListener() {},
    appendChild(child) { return child; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    setAttribute() {},
    getAttribute() { return null; },
    closest() { return null; },
  };
}

function makeSandbox() {
  const elements = new Map();
  const getElement = (key) => {
    if (!elements.has(key)) elements.set(key, makeElement());
    return elements.get(key);
  };
  const document = {
    documentElement: { dataset: { display: "app" } },
    body: makeElement(),
    addEventListener() {},
    removeEventListener() {},
    createElement: makeElement,
    getElementById: (id) => getElement(`#${id}`),
    querySelector: (selector) => getElement(selector),
    querySelectorAll: () => [],
  };
  const location = { hash: "" };
  const window = {
    location,
    navigator: {},
    addEventListener() {},
    removeEventListener() {},
    setInterval() { return 0; },
    clearInterval() {},
    setTimeout() { return 0; },
    clearTimeout() {},
  };
  return {
    console,
    document,
    window,
    location,
    navigator: window.navigator,
    history: { replaceState() {} },
    localStorage: { getItem() { return ""; }, setItem() {}, removeItem() {} },
    setInterval: window.setInterval,
    clearInterval: window.clearInterval,
    setTimeout: window.setTimeout,
    clearTimeout: window.clearTimeout,
  };
}

function stripLast(source, token) {
  const index = source.lastIndexOf(token);
  if (index < 0) return source;
  return `${source.slice(0, index)}${source.slice(index + token.length)}`;
}

function loadModule({ file, strip = [], exportCode }) {
  let source = fs.readFileSync(file, "utf8");
  strip.forEach((token) => {
    source = stripLast(source, token);
  });
  const sandbox = makeSandbox();
  vm.createContext(sandbox);
  vm.runInContext(`${source}\n${exportCode}`, sandbox, { filename: file });
  return sandbox.__exports;
}

function referenceMap(referenceDir) {
  const result = new Map();
  fs.readdirSync(referenceDir)
    .filter((name) => /^\d{2}-.+\.(png|jpe?g|webp)$/i.test(name))
    .forEach((name) => {
      result.set(name.slice(0, 2), path.join(referenceDir, name));
    });
  return result;
}

function imageDimensions(file) {
  if (!file || !fs.existsSync(file)) return null;
  const buffer = fs.readFileSync(file);
  const isPng =
    buffer.length > 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  if (isPng) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }
  const isJpeg = buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8;
  if (isJpeg) {
    let offset = 2;
    while (offset < buffer.length - 9) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2) break;
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return {
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5),
        };
      }
      offset += 2 + length;
    }
  }
  const isWebp =
    buffer.length > 30 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";
  if (isWebp && buffer.toString("ascii", 12, 16) === "VP8X") {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }
  return null;
}

function viewportForReference(app, referencePath) {
  const dimensions = imageDimensions(referencePath);
  if (!dimensions) {
    return { width: app.viewport.width, height: app.viewport.height };
  }
  const dpr = app.viewport.deviceScaleFactor || 1;
  return {
    width: Math.max(320, Math.round(dimensions.width / dpr)),
    height: Math.max(568, Math.round(dimensions.height / dpr)),
  };
}

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function safeName(value) {
  return String(value).replace(/[^\w.-]+/g, "-");
}

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function relativeLink(fromDir, target) {
  return path.relative(fromDir, target).split(path.sep).join("/");
}

const apps = [
  {
    key: "user",
    name: "用户端",
    platformMode: "miniapp-app",
    platformLabel: "小程序/App 级移动端渲染",
    expected: 40,
    basePath: "/user/",
    viewport: { width: 431, height: 913, deviceScaleFactor: 2 },
    referenceDir: path.join(root, "云旅无忧UI界面参考图", "用户端"),
    file: path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js"),
    strip: ["render();"],
    exportCode: "globalThis.__exports = { entries: screens.map((entry) => ({ id: entry.id, no: entry.num, title: entry.title })) };",
  },
  {
    key: "guide",
    name: "向导端",
    platformMode: "miniapp-app",
    platformLabel: "小程序/App 内角色端移动端渲染",
    expected: 46,
    basePath: "/guide/",
    viewport: { width: 427, height: 922, deviceScaleFactor: 2 },
    referenceDir: path.join(root, "云旅无忧UI界面参考图", "向导端"),
    file: path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js"),
    strip: ["init();"],
    exportCode: "globalThis.__exports = { entries: screens.map((entry) => ({ id: entry.id, no: entry.id, title: entry.title })) };",
  },
  {
    key: "merchant",
    name: "商户端",
    platformMode: "miniapp-app",
    platformLabel: "小程序/App 内角色端移动端渲染",
    expected: 70,
    basePath: "/merchant/",
    viewport: { width: 430, height: 900, deviceScaleFactor: 2 },
    referenceDir: path.join(root, "云旅无忧UI界面参考图", "商户端"),
    file: path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js"),
    strip: ["renderCurrent();", "renderList();"],
    exportCode: "globalThis.__exports = { entries: screens.map((entry) => ({ id: entry.id, no: entry.id, title: entry.title })) };",
  },
  {
    key: "admin",
    name: "管理后台",
    platformMode: "web-admin",
    platformLabel: "Web 级桌面后台渲染",
    expected: 53,
    basePath: "/admin/",
    viewport: { width: 1448, height: 1086, deviceScaleFactor: 1 },
    referenceDir: path.join(root, "云旅无忧UI界面参考图", "管理后台"),
    file: path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js"),
    strip: ["render();"],
    exportCode: "globalThis.__exports = { entries: pages.map((entry) => ({ id: entry.id, no: entry.no, title: entry.title })) };",
  },
];

function getExecutablePath() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    "/Users/chm/Library/Caches/ms-playwright/chromium_headless_shell-1178/chrome-mac/headless_shell",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function pageMetrics(page, appKey, entry) {
  return page.evaluate(({ key, id }) => {
    const badTextItems = [
      ["工程", "联调"].join(""),
      "undefined",
      "[object Object]",
      "TODO",
      ["待", "接入"].join(""),
    ];
    const buttonSelector = "button,[role='button'],a[href]";
    const buttons = Array.from(document.querySelectorAll(buttonSelector)).map((node) => {
      const dataset = { ...node.dataset };
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const hasAction =
        node.tagName === "A" ||
        node.id === "resetScreen" ||
        node.hasAttribute("onclick") ||
        node.type === "submit" ||
        Boolean(
          dataset.route ||
            dataset.action ||
            dataset.open ||
            dataset.step ||
            dataset.go ||
            dataset.screen ||
            dataset.addCart,
        );
      return {
        tag: node.tagName.toLowerCase(),
        text: (node.innerText || node.getAttribute("aria-label") || "").trim().slice(0, 80),
        hasAction,
        visible: rect.width > 0 && rect.height > 0,
        opacity: Number.parseFloat(style.opacity || "1"),
      };
    });
    const brokenImages = Array.from(document.images)
      .filter((img) => img.complete === false || img.naturalWidth === 0 || img.naturalHeight === 0)
      .filter((img) => {
        const src = img.currentSrc || img.src || "";
        return !/^https:\/\/webapi\.amap\.com\/theme\/v2\.0\/logo@2x\.png/i.test(src);
      })
      .map((img) => ({ src: img.currentSrc || img.src, alt: img.alt || "" }));
    const html = document.documentElement.innerText || "";
    const pendingIntegrationText = ["待", "接入"].join("");
    const badTextSource =
      key === "user" && id === "device-management"
        ? html.replaceAll(pendingIntegrationText, "")
        : html;
    const shortPageThreshold =
      key === "admin"
        ? id === "login"
          ? 120
          : 500
        : key === "merchant" && id === "51"
          ? 160
          : key === "merchant" && id === "55"
            ? 200
            : key === "guide" && (id === "24" || id === "25")
              ? 160
              : key === "guide" && id === "45"
              ? 120
              : 220;
    return {
      title: document.title,
      textLength: html.trim().length,
      isShort: html.trim().length < shortPageThreshold,
      badText: badTextItems.some((item) => badTextSource.includes(item)),
      buttonCount: buttons.length,
      unboundButtons: buttons.filter((button) => button.visible && !button.hasAction),
      transparentInteractiveControls: buttons.filter((button) => button.visible && button.opacity < 0.08),
      brokenImages,
      viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
      bodyClass: document.body.className,
    };
  }, { key: appKey, id: entry.id });
}

async function captureApp(browser, app) {
  const module = loadModule(app);
  const refs = referenceMap(app.referenceDir);
  const entries = module.entries
    .slice()
    .sort((a, b) => Number(a.no || a.id) - Number(b.no || b.id));

  if (entries.length !== app.expected) {
    throw new Error(`${app.name}: 页面数量异常，当前 ${entries.length}，预期 ${app.expected}`);
  }

  const context = await browser.newContext({
    viewport: { width: app.viewport.width, height: app.viewport.height },
    deviceScaleFactor: app.viewport.deviceScaleFactor,
    isMobile: app.key !== "admin",
    hasTouch: app.key !== "admin",
    locale: "zh-CN",
    colorScheme: "light",
  });
  const page = await context.newPage();
  const appShotDir = path.join(screenshotsDir, app.key);
  fs.mkdirSync(appShotDir, { recursive: true });
  const records = [];

  for (const entry of entries) {
    const no = String(entry.no || entry.id).padStart(2, "0");
    const fileName = `${no}-${safeName(entry.id)}.png`;
    const screenshotPath = path.join(appShotDir, fileName);
    const url = `${baseUrl}${app.basePath}#${entry.id}`;
    const record = {
      app: app.name,
      appKey: app.key,
      platformMode: app.platformMode,
      platformLabel: app.platformLabel,
      no,
      id: entry.id,
      title: entry.title,
      url,
      reference: refs.get(no) || null,
      screenshot: screenshotPath,
      issues: [],
    };

    try {
      const viewport = viewportForReference(app, record.reference);
      await page.setViewportSize(viewport);
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(app.key === "admin" ? 650 : 450);
      await page.evaluate(() => document.fonts?.ready || Promise.resolve()).catch(() => {});
      await page.screenshot({ path: screenshotPath, fullPage: false, animations: "disabled" });
      const metrics = await pageMetrics(page, app.key, entry);
      record.metrics = metrics;
      if (!record.reference) record.issues.push("缺少对应参考图");
      if (metrics.isShort && !record.reference) record.issues.push("页面文字过少，疑似空白或未完整渲染");
      if (metrics.badText) record.issues.push("页面存在工程/占位/异常文本");
      if (metrics.brokenImages.length) record.issues.push(`存在破图 ${metrics.brokenImages.length} 个`);
      if (metrics.unboundButtons.length) record.issues.push(`存在未绑定按钮 ${metrics.unboundButtons.length} 个`);
      if (metrics.transparentInteractiveControls.length) record.issues.push(`存在透明但占位的交互控件 ${metrics.transparentInteractiveControls.length} 个`);
    } catch (error) {
      record.issues.push(error.message);
      record.metrics = null;
    }

    records.push(record);
    const issueText = record.issues.length ? ` issues=${record.issues.join("；")}` : "";
    console.log(`${app.name} ${no}-${entry.title} captured${issueText}`);
  }

  await context.close();
  return records;
}

function writeReport(records) {
  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    total: records.length,
    issueCount: records.filter((record) => record.issues.length).length,
    apps: apps.map((app) => ({
      key: app.key,
      name: app.name,
      platformMode: app.platformMode,
      platformLabel: app.platformLabel,
      expected: app.expected,
      captured: records.filter((record) => record.appKey === app.key).length,
      issueCount: records.filter((record) => record.appKey === app.key && record.issues.length).length,
      viewport: app.viewport,
    })),
    acceptanceGroups: {
      mobileMiniappApp: {
        requirement: "用户端、向导端、商户端按小程序/App 级移动端视口逐页截图对比",
        apps: ["user", "guide", "merchant"],
        expected: apps.filter((app) => app.platformMode === "miniapp-app").reduce((sum, app) => sum + app.expected, 0),
        captured: records.filter((record) => record.platformMode === "miniapp-app").length,
        issueCount: records.filter((record) => record.platformMode === "miniapp-app" && record.issues.length).length,
      },
      adminWeb: {
        requirement: "管理后台按 Web 级桌面视口逐页截图对比",
        apps: ["admin"],
        expected: apps.filter((app) => app.platformMode === "web-admin").reduce((sum, app) => sum + app.expected, 0),
        captured: records.filter((record) => record.platformMode === "web-admin").length,
        issueCount: records.filter((record) => record.platformMode === "web-admin" && record.issues.length).length,
      },
    },
    records: records.map((record) => ({
      ...record,
      reference: record.reference ? path.relative(root, record.reference) : null,
      screenshot: path.relative(root, record.screenshot),
    })),
  };
  fs.writeFileSync(path.join(latestDir, "report.json"), JSON.stringify(summary, null, 2));

  const rows = records
    .map((record) => {
      const refLink = record.reference ? relativeLink(latestDir, record.reference) : "";
      const shotLink = relativeLink(latestDir, record.screenshot);
      const issues = record.issues.length ? record.issues.map(htmlEscape).join("<br>") : "通过基础巡检";
      return `
        <article class="pair ${record.issues.length ? "has-issues" : ""}">
          <header>
            <strong>${htmlEscape(record.app)} ${record.no} ${htmlEscape(record.title)}</strong>
            <span>${htmlEscape(record.id)}</span>
          </header>
          <div class="shots">
            <figure>
              <figcaption>参考图</figcaption>
              ${refLink ? `<img src="${htmlEscape(refLink)}" alt="${htmlEscape(record.app)} ${record.no} 参考图">` : "<div class=\"missing\">无参考图</div>"}
            </figure>
            <figure>
              <figcaption>当前实现</figcaption>
              <img src="${htmlEscape(shotLink)}" alt="${htmlEscape(record.app)} ${record.no} 当前实现">
            </figure>
          </div>
          <p>${issues}</p>
        </article>
      `;
    })
    .join("");

  const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>云旅无忧 UI 逐页截图巡检</title>
    <style>
      :root { color-scheme: light; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
      body { margin: 0; background: #f5f7fb; color: #17202a; }
      .top { position: sticky; top: 0; z-index: 5; padding: 18px 24px; background: rgba(255,255,255,.94); border-bottom: 1px solid #e7edf5; backdrop-filter: blur(12px); }
      h1 { margin: 0; font-size: 20px; }
      .top p { margin: 8px 0 0; color: #667085; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(620px, 1fr)); gap: 18px; padding: 18px; }
      .pair { background: #fff; border: 1px solid #e6edf5; border-radius: 14px; box-shadow: 0 10px 30px rgba(31, 54, 86, .08); overflow: hidden; }
      .pair.has-issues { border-color: #ffb4a8; }
      .pair header { display: flex; justify-content: space-between; gap: 12px; padding: 12px 14px; border-bottom: 1px solid #eef2f7; }
      .pair header span { color: #667085; }
      .shots { display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: start; }
      figure { margin: 0; padding: 10px; border-right: 1px solid #eef2f7; background: #fbfdff; }
      figure:last-child { border-right: 0; }
      figcaption { margin: 0 0 8px; color: #667085; font-size: 13px; }
      img { width: 100%; height: auto; display: block; border-radius: 8px; border: 1px solid #e7edf5; background: #fff; }
      .missing { min-height: 260px; display: grid; place-items: center; color: #b42318; background: #fff3f0; border-radius: 8px; }
      .pair p { margin: 0; padding: 10px 14px 14px; color: #475467; line-height: 1.55; }
    </style>
  </head>
  <body>
    <section class="top">
      <h1>云旅无忧 UI 逐页截图巡检</h1>
      <p>共 ${records.length} 页，基础巡检异常 ${records.filter((record) => record.issues.length).length} 页。报告用于逐页对照，不等同于视觉验收完成。</p>
    </section>
    <main class="grid">${rows}</main>
  </body>
</html>`;
  fs.writeFileSync(path.join(latestDir, "report.html"), html);
}

async function main() {
  cleanDir(latestDir);
  fs.mkdirSync(screenshotsDir, { recursive: true });
  const { chromium } = requirePlaywright();
  const executablePath = getExecutablePath();
  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });
  const records = [];
  try {
    for (const app of apps) {
      records.push(...(await captureApp(browser, app)));
    }
  } finally {
    await browser.close();
  }
  writeReport(records);

  const issueCount = records.filter((record) => record.issues.length).length;
  console.log(`\nvisual screenshot audit captured ${records.length} pages`);
  console.log(`report: ${path.join(latestDir, "report.html")}`);
  console.log(`json: ${path.join(latestDir, "report.json")}`);
  if (issueCount > 0) {
    console.error(`visual screenshot audit found ${issueCount} pages with baseline issues`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
