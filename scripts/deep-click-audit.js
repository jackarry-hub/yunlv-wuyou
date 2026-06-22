const assert = require("assert");
const crypto = require("crypto");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const maxDepth = Number(process.env.DEEP_CLICK_MAX_DEPTH || 8);
const maxStatesPerPage = Number(process.env.DEEP_CLICK_MAX_STATES_PER_PAGE || 120);
const clickConcurrency = Number(process.env.DEEP_CLICK_CONCURRENCY || 3);
const navigationAttempts = Number(process.env.DEEP_CLICK_NAV_ATTEMPTS || 5);
const afterClickDelayMs = Number(process.env.DEEP_CLICK_AFTER_CLICK_MS || 220);
const navigationTimeoutMs = Number(process.env.DEEP_CLICK_NAV_TIMEOUT_MS || 30000);
const progressEvery = Number(process.env.DEEP_CLICK_PROGRESS_EVERY || 5);
const itemAttempts = Number(process.env.DEEP_CLICK_ITEM_ATTEMPTS || 2);
const clickTimeoutMs = Number(process.env.DEEP_CLICK_CLICK_TIMEOUT_MS || 7000);
const outDir = path.join(root, "artifacts", "deep-click", "latest");

function parsePositiveInt(value, label) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  assert(Number.isInteger(number) && number > 0, `${label} must be a positive integer`);
  return number;
}

function parseLevelSelector() {
  const requested = process.env.DEEP_CLICK_LEVEL || process.env.DEEP_CLICK_LEVELS || "";
  const from = parsePositiveInt(process.env.DEEP_CLICK_LEVEL_FROM, "DEEP_CLICK_LEVEL_FROM");
  const to = parsePositiveInt(process.env.DEEP_CLICK_LEVEL_TO, "DEEP_CLICK_LEVEL_TO");
  const maxLevel = maxDepth + 1;
  const levels = new Set();

  if (requested) {
    requested
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        const range = part.match(/^(\d+)-(\d+)$/);
        if (range) {
          const start = Number(range[1]);
          const end = Number(range[2]);
          assert(start <= end, `Invalid DEEP_CLICK_LEVEL range: ${part}`);
          for (let level = start; level <= end; level += 1) levels.add(level);
          return;
        }
        levels.add(Number(part));
      });
  }

  if (from || to) {
    const start = from || 1;
    const end = to || maxLevel;
    assert(start <= end, "DEEP_CLICK_LEVEL_FROM must be <= DEEP_CLICK_LEVEL_TO");
    for (let level = start; level <= end; level += 1) levels.add(level);
  }

  if (!levels.size) {
    for (let level = 1; level <= maxLevel; level += 1) levels.add(level);
  }

  const selected = [...levels].sort((a, b) => a - b);
  selected.forEach((level) => {
    assert(Number.isInteger(level) && level >= 1 && level <= maxLevel, `Invalid deep click level: ${level}; valid range is 1-${maxLevel}`);
  });
  const targetDepths = new Set(selected.map((level) => level - 1));
  return {
    levels: selected,
    targetDepths,
    maxTargetDepth: Math.max(...selected.map((level) => level - 1)),
    label: selected.join(","),
  };
}

const levelSelector = parseLevelSelector();

function requirePlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    const fallback = path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
    if (fs.existsSync(fallback)) return require(fallback);
    throw new Error("Playwright is required for deep click audits.");
  }
}

function browserLaunchOptions() {
  const channel = process.env.DEEP_CLICK_PLAYWRIGHT_CHANNEL || process.env.PLAYWRIGHT_CHANNEL || "";
  return channel ? { headless: true, channel } : { headless: true };
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
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {
      await delay(120);
    }
  }
  throw new Error(`deep click audit server did not start.\n${output()}`);
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
    history: { replaceState() {}, pushState() {} },
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

function safeText(value, length = 90) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, length);
}

const apps = [
  {
    key: "user",
    name: "user",
    basePath: "/user/",
    expected: 40,
    viewport: { width: 431, height: 913, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    file: path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js"),
    strip: ["render();"],
    exportCode: "globalThis.__exports = { entries: screens.map((entry) => ({ id: entry.id, no: entry.num, title: entry.title })) };",
    rootSelector: "#app",
  },
  {
    key: "guide",
    name: "guide",
    basePath: "/guide/",
    expected: 46,
    viewport: { width: 427, height: 922, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    file: path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js"),
    strip: ["init();"],
    exportCode: "globalThis.__exports = { entries: screens.map((entry) => ({ id: entry.id, no: entry.id, title: entry.title })) };",
    rootSelector: "#phone",
  },
  {
    key: "merchant",
    name: "merchant",
    basePath: "/merchant/",
    expected: 70,
    viewport: { width: 430, height: 900, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    file: path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js"),
    strip: ["renderCurrent();", "renderList();"],
    exportCode: "globalThis.__exports = { entries: screens.map((entry) => ({ id: entry.id, no: entry.id, title: entry.title })) };",
    rootSelector: "#phone",
  },
  {
    key: "admin",
    name: "admin",
    basePath: "/admin/",
    expected: 53,
    viewport: { width: 1448, height: 1086, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    file: path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js"),
    strip: ["render();"],
    exportCode: "globalThis.__exports = { entries: pages.map((entry) => ({ id: entry.id, no: entry.no, title: entry.title })) };",
    rootSelector: "#app",
  },
];

function selectedApps() {
  const requested = process.env.DEEP_CLICK_APP || process.env.PUBLIC_AUDIT_APP || "";
  if (!requested) return apps;
  const keys = requested
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
  const filtered = apps.filter((app) => keys.includes(app.key));
  assert(filtered.length > 0, `Unknown deep click app filter: ${requested}`);
  return filtered;
}

function appEntries(app) {
  const module = loadModule(app);
  assert.equal(module.entries.length, app.expected, `${app.name} page count changed`);
  const entries = module.entries.slice().sort((a, b) => Number(a.no || a.id) - Number(b.no || b.id));
  const requestedPage = process.env.DEEP_CLICK_PAGE || "";
  let filtered = entries;
  if (requestedPage) {
    const keys = requestedPage
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean);
    filtered = filtered.filter((entry) => keys.includes(String(entry.id)) || keys.includes(String(entry.no)));
    assert(filtered.length > 0, `Unknown deep click page filter for ${app.name}: ${requestedPage}`);
  }

  const pageFrom = process.env.DEEP_CLICK_PAGE_FROM;
  const pageTo = process.env.DEEP_CLICK_PAGE_TO;
  if (pageFrom || pageTo) {
    const from = pageFrom ? Number(pageFrom) : Number.NEGATIVE_INFINITY;
    const to = pageTo ? Number(pageTo) : Number.POSITIVE_INFINITY;
    assert(from <= to, "DEEP_CLICK_PAGE_FROM must be <= DEEP_CLICK_PAGE_TO");
    filtered = filtered.filter((entry) => {
      const no = Number(entry.no || entry.id);
      return no >= from && no <= to;
    });
    assert(filtered.length > 0, `No pages selected by DEEP_CLICK_PAGE_FROM/TO for ${app.name}`);
  }

  const batchSize = parsePositiveInt(process.env.DEEP_CLICK_PAGE_BATCH_SIZE, "DEEP_CLICK_PAGE_BATCH_SIZE");
  const batchIndex = parsePositiveInt(process.env.DEEP_CLICK_PAGE_BATCH_INDEX, "DEEP_CLICK_PAGE_BATCH_INDEX");
  if (batchSize || batchIndex) {
    assert(batchSize && batchIndex, "DEEP_CLICK_PAGE_BATCH_SIZE and DEEP_CLICK_PAGE_BATCH_INDEX must be set together");
    const start = (batchIndex - 1) * batchSize;
    filtered = filtered.slice(start, start + batchSize);
    assert(filtered.length > 0, `No pages selected by batch ${batchIndex} size ${batchSize} for ${app.name}`);
  }

  return filtered;
}

async function waitForMeaningfulRender(page, app) {
  const minText = app.key === "admin" ? 80 : 45;
  const selector = app.rootSelector || "body";
  const renderTimeout = Number(process.env.DEEP_CLICK_RENDER_TIMEOUT_MS || 12000);
  const deadline = Date.now() + renderTimeout;
  let lastSnapshot = null;
  while (Date.now() < deadline) {
    lastSnapshot = await page
      .evaluate(({ selector: rootSelector }) => {
        const root = document.querySelector(rootSelector) || document.body;
        const text = (root?.innerText || "").replace(/\s+/g, " ").trim();
        const htmlLength = root?.innerHTML?.length || 0;
        return {
          hasRoot: Boolean(root),
          textLength: text.length,
          htmlLength,
          title: document.title,
          hash: location.hash,
        };
      }, { selector })
      .catch((error) => ({ error: error.message.split("\n")[0] }));
    if (lastSnapshot.textLength >= minText && lastSnapshot.htmlLength >= 800) break;
    await page.waitForTimeout(250);
  }
  if (!lastSnapshot || lastSnapshot.textLength < minText || lastSnapshot.htmlLength < 800) {
    throw new Error(`meaningful render timeout: ${JSON.stringify(lastSnapshot)}`);
  }
  await page.waitForTimeout(app.key === "admin" ? 450 : 450);
}

async function waitForEntryRender(page, app, entry) {
  const selector = app.rootSelector || "body";
  const entryId = String(entry.id || "");
  const entryTitle = String(entry.title || "").trim();
  await page.waitForFunction(
    ({ selector: rootSelector, entryId, entryTitle }) => {
      const root = document.querySelector(rootSelector) || document.body;
      const text = (root?.innerText || "").replace(/\s+/g, " ").trim();
      const hash = decodeURIComponent(String(location.hash || "").replace(/^#\/?/, "").split(/[?&]/)[0]);
      const titleMatched = !entryTitle || text.includes(entryTitle) || document.title.includes(entryTitle);
      return hash === entryId && text.length >= 45 && titleMatched;
    },
    { selector, entryId, entryTitle },
    { timeout: 20000 },
  );
  await waitForMeaningfulRender(page, app);
}

function auditScript({ appKey, rootSelector }) {
  return ({ appKey, rootSelector });
}

async function collectClickables(page, app) {
  return page.evaluate(({ appKey, rootSelector }) => {
    const root = document.querySelector(rootSelector) || document.body;
    root.querySelectorAll("[data-deep-click-index]").forEach((node) => {
      delete node.dataset.deepClickIndex;
    });
    const selectors = [
      "button",
      "a[href]",
      "[role='button']",
      "[data-open]",
      "[data-go]",
      "[data-route]",
      "[data-action]",
      "[data-screen]",
      "[data-page-action]",
      "input",
      "select",
      "textarea",
      "label",
    ].join(",");
    const seen = new Set();
    const nodes = Array.from(root.querySelectorAll(selectors))
      .filter((node) => {
        if (seen.has(node)) return false;
        seen.add(node);
        if (node.closest("[data-dev-only]")) return false;
        if (node.disabled || node.getAttribute("aria-disabled") === "true") return false;
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        if (rect.width < 3 || rect.height < 3) return false;
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity || 1) < 0.04) return false;
        const className = String(node.className || "");
        if (/ref-audit-alias-row|ref-audit-inline/.test(className)) return false;
        if (node.closest(".ref-audit-alias-row")) return false;
        if (appKey === "admin" && node.closest(".toast")) return false;
        return true;
      });
    return nodes.map((node, index) => {
      node.dataset.deepClickIndex = String(index);
      const rect = node.getBoundingClientRect();
      const attrs = {};
      ["data-open", "data-go", "data-route", "data-action", "data-screen", "data-page-action", "aria-label", "aria-pressed", "type", "href"].forEach((name) => {
        const value = node.getAttribute(name);
        if (value !== null) attrs[name] = value;
      });
      return {
        index,
        tag: node.tagName.toLowerCase(),
        text: (node.innerText || node.textContent || node.getAttribute("aria-label") || node.getAttribute("placeholder") || "").replace(/\s+/g, " ").trim().slice(0, 120),
        attrs,
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
        inputLike: ["INPUT", "SELECT", "TEXTAREA", "LABEL"].includes(node.tagName),
      };
    });
  }, auditScript({ appKey: app.key, rootSelector: app.rootSelector }));
}

async function pageState(page, app) {
  return page.evaluate(({ rootSelector }) => {
    const root = document.querySelector(rootSelector) || document.body;
    const clone = root.cloneNode(true);
    const normalizedClassName = (node) => String(node.getAttribute?.("class") || node.className || "")
      .split(/\s+/)
      .filter((name) => name && name !== "is-done")
      .join(" ");
    const normalizeFakeFeedbackAttrs = (node) => {
      node.removeAttribute?.("data-deep-click-index");
      node.removeAttribute?.("data-render-click-index");
      node.removeAttribute?.("data-state");
      node.classList?.remove("is-done");
      const cls = normalizedClassName(node);
      if (cls) node.setAttribute?.("class", cls);
      else node.removeAttribute?.("class");
    };
    clone.querySelectorAll([
      ".toast",
      ".action-status",
      ".yunlv-live-inline-status",
      ".yunlv-live-status",
      "[data-user-action-audit]",
      "[data-live-status]",
      "[data-yunlv-inline-status]",
      "[data-toast]",
      "[role='status']",
      "[aria-live]",
    ].join(",")).forEach((node) => node.remove());
    clone.querySelectorAll("[data-deep-click-index],[data-render-click-index],[data-state],.is-done").forEach(normalizeFakeFeedbackAttrs);
    const interactive = Array.from(root.querySelectorAll("button,a,[role='button'],input,select,textarea,[data-open],[data-go],[data-route],[data-action],[data-screen],[data-page-action]"))
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width < 3 || rect.height < 3) return false;
        const style = window.getComputedStyle(node);
        return style.display !== "none" && style.visibility !== "hidden";
      })
      .map((node) => {
        const dataset = { ...node.dataset };
        delete dataset.deepClickIndex;
        delete dataset.renderClickIndex;
        delete dataset.state;
        return {
          tag: node.tagName,
          text: (node.innerText || node.textContent || node.getAttribute("aria-label") || node.getAttribute("placeholder") || "").replace(/\s+/g, " ").trim().slice(0, 80),
          cls: normalizedClassName(node).slice(0, 100),
          hidden: Boolean(node.hidden),
          value: "value" in node ? String(node.value || "").slice(0, 80) : "",
          checked: "checked" in node ? Boolean(node.checked) : undefined,
          ariaPressed: node.getAttribute("aria-pressed") || "",
          ariaExpanded: node.getAttribute("aria-expanded") || "",
          dataset: JSON.stringify(dataset),
        };
      });
    return {
      url: location.href,
      hash: location.hash,
      activeText: (document.activeElement?.innerText || document.activeElement?.getAttribute?.("aria-label") || document.activeElement?.getAttribute?.("placeholder") || "").replace(/\s+/g, " ").trim().slice(0, 80),
      cleanHtml: clone.innerHTML.replace(/\s+/g, " ").slice(0, 160000),
      visibleText: (root.innerText || "").replace(/\s+/g, " ").trim().slice(0, 160000),
      interactiveJson: JSON.stringify(interactive),
      fileInputs: Array.from(document.querySelectorAll('input[type="file"]')).map((node) => ({
        dataset: JSON.stringify(node.dataset || {}),
        accept: node.getAttribute("accept") || "",
        multiple: Boolean(node.multiple),
      })),
      modalCount: document.querySelectorAll("[role='dialog'],dialog,.modal,.drawer,.sheet,.panel,.is-open,[data-live-panel]").length,
      hiddenRows: document.querySelectorAll("tr[hidden],[hidden].is-dismissed,.is-dismissed").length,
    };
  }, auditScript({ appKey: app.key, rootSelector: app.rootSelector }));
}

function changedEnough(before, after, item) {
  if (before.url !== after.url || before.hash !== after.hash) return { ok: true, reason: "route/url changed" };
  if (after.fileInputs.length > before.fileInputs.length) return { ok: true, reason: "file picker input created" };
  if (after.modalCount > before.modalCount) return { ok: true, reason: "panel/dialog opened" };
  if (after.hiddenRows > before.hiddenRows) return { ok: true, reason: "row hidden/removed" };
  if (before.interactiveJson !== after.interactiveJson) return { ok: true, reason: "interactive state changed" };
  if (before.cleanHtml !== after.cleanHtml) return { ok: true, reason: "semantic DOM changed" };
  if (item.inputLike && before.activeText !== after.activeText) return { ok: true, reason: "input focus changed" };
  return { ok: false, reason: "no semantic state change" };
}

function hashState(state) {
  return crypto
    .createHash("sha1")
    .update([state.url, state.hash, state.cleanHtml, state.interactiveJson].join("\n"))
    .digest("hex")
    .slice(0, 18);
}

function normalizedHashId(hash) {
  return decodeURIComponent(String(hash || "").replace(/^#\/?/, "").split(/[?&]/)[0]);
}

function stateDebugLabel(entry, stateNode) {
  return `${entry.no || entry.id}-${entry.title} depth=${stateNode.depth} state=${stateNode.signature}`;
}

function writeJsonReport(name, value) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(value, null, 2));
}

function findClickableByReference(items, reference) {
  if (typeof reference === "number") return items[reference];
  if (!reference || typeof reference !== "object") return null;
  const refAttrs = reference.attrs || {};
  const attrKeys = ["data-action", "data-route", "data-open", "data-go", "data-screen", "data-page-action", "href", "aria-label"];
  for (const key of attrKeys) {
    if (!refAttrs[key]) continue;
    const matched = items.find((item) => item.attrs?.[key] === refAttrs[key] && (!reference.text || item.text === reference.text || item.tag === reference.tag));
    if (matched) return matched;
  }
  if (reference.text) {
    const matched = items.find((item) => item.text === reference.text && (!reference.tag || item.tag === reference.tag));
    if (matched) return matched;
  }
  return Number.isInteger(reference.index) ? items[reference.index] : null;
}

async function clickTaggedItem(page, app, itemRef) {
  const items = await collectClickables(page, app);
  const item = findClickableByReference(items, itemRef);
  if (!item) return { missing: true, reason: "clickable no longer exists at this state" };
  const before = await pageState(page, app);
  const locator = page.locator(`${app.rootSelector} [data-deep-click-index="${item.index}"]`).first();
  let fileChooser = null;
  let clickError = "";
  const chooserPromise = page.waitForEvent("filechooser", { timeout: 700 }).catch(() => null);
  try {
    await locator.scrollIntoViewIfNeeded({ timeout: Math.min(clickTimeoutMs, 4000) }).catch(() => {});
    await locator.click({ timeout: clickTimeoutMs, force: false });
    fileChooser = await chooserPromise;
  } catch (error) {
    clickError = error.message.split("\n")[0];
  }
  await page.waitForTimeout(app.key === "admin" ? Math.max(260, afterClickDelayMs) : afterClickDelayMs);
  const after = await pageState(page, app);
  if (fileChooser) return { item, ok: true, reason: "native file chooser opened", before, after, terminal: true };
  if (clickError) return { item, ok: false, reason: `click failed: ${clickError}`, before, after, terminal: true };
  const result = changedEnough(before, after, item);
  return { item, ...result, before, after };
}

async function resetAppStorage(page) {
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch (error) {}
    try {
      sessionStorage.clear();
    } catch (error) {}
  }).catch(() => {});
}

async function openState(page, app, entry, pathSteps) {
  let lastError = null;
  for (let attempt = 1; attempt <= navigationAttempts; attempt += 1) {
    await page.goto("about:blank", { waitUntil: "domcontentloaded", timeout: Math.min(navigationTimeoutMs, 15000) }).catch(() => null);
    let navigationError = null;
    const response = await page.goto(`${page.__baseUrl}${app.basePath}`, { waitUntil: "domcontentloaded", timeout: navigationTimeoutMs }).catch((error) => {
      navigationError = error;
      return null;
    });
    try {
      if (navigationError) throw navigationError;
      if (response && response.status() >= 400) throw new Error(`HTTP ${response.status()} while opening ${app.basePath}`);
      await waitForMeaningfulRender(page, app);
      await page.evaluate((entryId) => {
        location.hash = String(entryId || "");
      }, entry.id);
      await waitForEntryRender(page, app, entry);
      for (const step of pathSteps) {
        const replay = await clickTaggedItem(page, app, step);
        if (!replay?.ok) {
          const stepAttrs = step.attrs ? Object.entries(step.attrs).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join(" ") : "";
          throw new Error(`cannot replay path step #${step.index} "${safeText(step.text)}" ${stepAttrs}: ${replay?.reason || "unknown replay failure"}`);
        }
        await waitForMeaningfulRender(page, app).catch(() => {});
      }
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < navigationAttempts) {
        const isServerOpenError = /^HTTP 5\d\d\b/.test(error.message || "");
        const retryDelay = isServerOpenError ? Math.min(7000, 1500 + attempt * 1500) : 900;
        await page.waitForTimeout(retryDelay);
      }
    }
  }
  if (lastError) throw lastError;
}

async function createAuditContext(browser, app) {
  const context = await browser.newContext({
    viewport: { width: app.viewport.width, height: app.viewport.height },
    deviceScaleFactor: app.viewport.deviceScaleFactor,
    isMobile: app.viewport.isMobile,
    hasTouch: app.viewport.hasTouch,
    locale: "zh-CN",
    colorScheme: "light",
  });
  await context.addInitScript(() => {
    try {
      window.localStorage?.clear();
    } catch (error) {}
    try {
      window.sessionStorage?.clear();
    } catch (error) {}
  });
  if (process.env.DEEP_CLICK_BLOCK_ASSETS === "1") {
    await context.route("**/*", (route) => {
      const type = route.request().resourceType();
      if (type === "image" || type === "font" || type === "media") {
        route.abort().catch(() => {});
        return;
      }
      route.continue().catch(() => {});
    });
  }
  return context;
}

async function createClickWorker(browser, baseUrl, app, index) {
  const context = await createAuditContext(browser, app);
  const page = await context.newPage();
  page.__baseUrl = baseUrl;
  page.setDefaultTimeout(Math.min(navigationTimeoutMs, 15000));
  page.setDefaultNavigationTimeout(navigationTimeoutMs);
  page.on("dialog", (dialog) => dialog.dismiss().catch(() => {}));
  return { index, context, page };
}

async function closeClickWorker(worker) {
  await worker?.context?.close().catch(() => {});
}

async function clickStateItem(worker, app, entry, statePath, itemRef) {
  let lastResult = null;
  for (let attempt = 1; attempt <= Math.max(1, itemAttempts); attempt += 1) {
    try {
      await openState(worker.page, app, entry, statePath);
      const result = await clickTaggedItem(worker.page, app, itemRef);
      if (result.ok || attempt >= itemAttempts) return result;
      lastResult = result;
    } catch (error) {
      lastResult = {
        item: typeof itemRef === "object" ? itemRef : { index: itemRef, tag: "", text: "", attrs: {} },
        ok: false,
        reason: `worker ${worker.index} attempt ${attempt}/${itemAttempts} failed: ${error.message.split("\n")[0]}`,
        terminal: true,
      };
    }
    await worker.page.waitForTimeout(500).catch(() => {});
  }
  return lastResult || {
    item: typeof itemRef === "object" ? itemRef : { index: itemRef, tag: "", text: "", attrs: {} },
    ok: false,
    reason: `worker ${worker.index} failed before click`,
    terminal: true,
  };
}

async function mapWithWorkerPool(items, workers, worker, onProgress = null) {
  const results = new Array(items.length);
  let cursor = 0;
  let completed = 0;
  const runners = workers.slice(0, Math.max(1, Math.min(workers.length, items.length))).map(async (runner) => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index, runner);
      completed += 1;
      if (onProgress) onProgress(completed, items.length, runner.index);
    }
  });
  await Promise.all(runners);
  return results;
}

async function openStateAndCollectClickables(page, app, entry, statePath) {
  let items = [];
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await openState(page, app, entry, statePath);
      items = await collectClickables(page, app);
      if (items.length > 1) return items;
      lastError = new Error(`only ${items.length} clickable collected after render`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < 3) await page.waitForTimeout(900);
  }
  if (lastError) throw lastError;
  return items;
}

async function auditApp(browser, baseUrl, app) {
  const entries = appEntries(app);
  const allEntries = loadModule(app).entries;
  const knownRouteIds = new Set(allEntries.map((entry) => String(entry.id)));
  const context = await createAuditContext(browser, app);
  const page = await context.newPage();
  page.__baseUrl = baseUrl;
  page.setDefaultTimeout(Math.min(navigationTimeoutMs, 15000));
  page.setDefaultNavigationTimeout(navigationTimeoutMs);
  page.on("dialog", (dialog) => dialog.dismiss().catch(() => {}));
  const workers = [];
  const failures = [];
  const pageResults = [];
  let checked = 0;
  let discoveryClicks = 0;
  let auditedStates = 0;
  try {
    for (let index = 0; index < Math.max(1, clickConcurrency); index += 1) {
      workers.push(await createClickWorker(browser, baseUrl, app, index + 1));
    }
    for (const entry of entries) {
      const pageResult = {
        app: app.name,
        no: String(entry.no || entry.id),
        id: String(entry.id),
        title: entry.title,
        levels: levelSelector.levels,
        states: 0,
        checked: 0,
        discoveryClicks: 0,
        failures: [],
      };
      try {
        await openState(page, app, entry, []);
        const initialState = await pageState(page, app);
        const initialSignature = hashState(initialState);
        const queue = [{ path: [], depth: 0, signature: initialSignature }];
        const seenStates = new Set([initialSignature]);
        while (queue.length) {
          const stateNode = queue.shift();
          const shouldAuditState = levelSelector.targetDepths.has(stateNode.depth);
          const shouldDiscoverNextLevel = stateNode.depth < levelSelector.maxTargetDepth && stateNode.depth < maxDepth;
          pageResult.states += 1;
          auditedStates += 1;
          const items = await openStateAndCollectClickables(page, app, entry, stateNode.path);
          console.log(`${app.name} ${stateDebugLabel(entry, stateNode)} level=${stateNode.depth + 1} mode=${shouldAuditState ? "audit" : "discover"} start clickables=${items.length}`);
          const clickResults = await mapWithWorkerPool(
            items.map((item, index) => ({ item, index })),
            workers,
            ({ item, index }, _workerIndex, worker) => clickStateItem(worker, app, entry, stateNode.path, { index, tag: item.tag, text: item.text, attrs: item.attrs }),
            (completed, total) => {
              if (progressEvery > 0 && (completed === total || completed % progressEvery === 0)) {
                console.log(`${app.name} ${stateDebugLabel(entry, stateNode)} progress=${completed}/${total}`);
              }
            },
          );
          for (let index = 0; index < clickResults.length; index += 1) {
            const result = clickResults[index];
            if (result?.missing) continue;
            if (shouldAuditState) {
              checked += 1;
              pageResult.checked += 1;
            } else {
              discoveryClicks += 1;
              pageResult.discoveryClicks += 1;
            }
            if (!result.ok) {
              if (shouldAuditState) {
                pageResult.failures.push({
                  app: app.name,
                  page: stateDebugLabel(entry, stateNode),
                  item: result.item,
                  reason: result.reason,
                });
              }
              continue;
            }
            if (result.terminal || result.reason === "input focus changed" || result.reason === "file picker input created") {
              continue;
            }
            if (!shouldDiscoverNextLevel) {
              continue;
            }
            const afterHashId = normalizedHashId(result.after.hash);
            const navigatedToKnownEntry = afterHashId && knownRouteIds.has(afterHashId) && afterHashId !== String(entry.id);
            if (navigatedToKnownEntry) {
              continue;
            }
            const nextSignature = hashState(result.after);
            if (seenStates.has(nextSignature)) {
              continue;
            }
            const nextPath = stateNode.path.concat({ index, tag: result.item.tag, text: result.item.text, attrs: result.item.attrs, reason: result.reason });
            if (seenStates.size >= maxStatesPerPage) {
              pageResult.failures.push({
                app: app.name,
                page: stateDebugLabel(entry, stateNode),
                item: result.item,
                reason: `reachable state cap DEEP_CLICK_MAX_STATES_PER_PAGE=${maxStatesPerPage} reached before level ${levelSelector.maxTargetDepth + 1}; audit is incomplete`,
              });
              continue;
            }
            seenStates.add(nextSignature);
            queue.push({ path: nextPath, depth: stateNode.depth + 1, signature: nextSignature });
          }
          console.log(`${app.name} ${stateDebugLabel(entry, stateNode)} level=${stateNode.depth + 1} mode=${shouldAuditState ? "audit" : "discover"} clickables=${items.length}, queued=${queue.length}`);
        }
      } catch (error) {
        pageResult.failures.push({
          app: app.name,
          page: `${entry.no || entry.id}-${entry.title}`,
          item: { index: -1, tag: "page", text: entry.title, attrs: {} },
          reason: error.message.split("\n")[0],
        });
      }
      failures.push(...pageResult.failures);
      pageResults.push(pageResult);
      writeJsonReport(`${app.key}-progress.json`, {
        app: app.name,
        levels: levelSelector.levels,
        pages: pageResults,
        totals: {
          pages: pageResults.length,
          states: pageResults.reduce((sum, item) => sum + item.states, 0),
          checked: pageResults.reduce((sum, item) => sum + item.checked, 0),
          discoveryClicks: pageResults.reduce((sum, item) => sum + item.discoveryClicks, 0),
          failures: pageResults.reduce((sum, item) => sum + item.failures.length, 0),
        },
      });
      console.log(`${app.name} ${entry.no || entry.id}-${entry.title}: states=${pageResult.states}, checked=${pageResult.checked}, discovery=${pageResult.discoveryClicks}, failures=${pageResult.failures.length}`);
    }
  } finally {
    await Promise.all(workers.map(closeClickWorker));
    await context.close();
  }
  return { app: app.name, pages: entries.length, states: auditedStates, checked, discoveryClicks, failures, pageResults };
}

async function withBaseUrl(callback) {
  if (process.env.DEEP_CLICK_BASE_URL) {
    return callback(process.env.DEEP_CLICK_BASE_URL.replace(/\/$/, ""));
  }
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-deep-click-"));
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
    return await callback(baseUrl);
  } finally {
    child.kill();
  }
}

async function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  await withBaseUrl(async (baseUrl) => {
    const targetApps = selectedApps();
    const { chromium } = requirePlaywright();
    const browser = await chromium.launch(browserLaunchOptions());
    const results = [];
    try {
      for (const app of targetApps) {
        results.push(await auditApp(browser, baseUrl, app));
      }
    } finally {
      await browser.close();
    }
    const failures = results.flatMap((result) => result.failures);
    const summary = {
      baseUrl,
      generatedAt: new Date().toISOString(),
      levels: levelSelector.levels,
      maxDepth,
      maxStatesPerPage,
      clickConcurrency,
      navigationAttempts,
      apps: results,
      totals: {
        apps: results.length,
        pages: results.reduce((sum, result) => sum + result.pages, 0),
        states: results.reduce((sum, result) => sum + result.states, 0),
        checked: results.reduce((sum, result) => sum + result.checked, 0),
        discoveryClicks: results.reduce((sum, result) => sum + result.discoveryClicks, 0),
        failures: failures.length,
      },
    };
    writeJsonReport("report.json", summary);
    results.forEach((result) => {
      console.log(`${result.app}: pages=${result.pages}, states=${result.states}, checked=${result.checked}, discovery=${result.discoveryClicks}, failures=${result.failures.length}`);
    });
    console.log(`report: ${path.join(outDir, "report.json")}`);
    if (failures.length) {
      console.error("\ndeep click audit failed:");
      failures.slice(0, 120).forEach((failure) => {
        const attrs = Object.entries(failure.item.attrs).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join(" ");
        console.error(`- ${failure.app} ${failure.page} #${failure.item.index} ${failure.item.tag} "${safeText(failure.item.text)}" ${attrs}: ${failure.reason}`);
      });
      if (failures.length > 120) console.error(`... ${failures.length - 120} more failures`);
      process.exitCode = 1;
      return;
    }
    console.log(`\ndeep click audit ok levels=${levelSelector.label}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
