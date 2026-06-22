const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "artifacts", "render-quality", "latest");

function requirePlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    const fallback = path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
    if (fs.existsSync(fallback)) return require(fallback);
    throw new Error("Playwright is required for render quality tests.");
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
  throw new Error(`render quality server did not start.\n${output()}`);
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
    .forEach((name) => result.set(name.slice(0, 2), path.join(referenceDir, name)));
  return result;
}

function pngDimensions(file) {
  if (!file || !fs.existsSync(file)) return null;
  const buffer = fs.readFileSync(file);
  if (buffer.length < 24 || buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4e || buffer[3] !== 0x47) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function viewportForReference(app, referencePath) {
  const dimensions = pngDimensions(referencePath);
  if (!dimensions) return { width: app.viewport.width, height: app.viewport.height };
  const dpr = app.viewport.deviceScaleFactor || 1;
  return {
    width: Math.max(app.key === "admin" ? 1024 : 320, Math.round(dimensions.width / dpr)),
    height: Math.max(app.key === "admin" ? 720 : 568, Math.round(dimensions.height / dpr)),
  };
}

function safeName(value) {
  return String(value).replace(/[^\w.-]+/g, "-");
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

async function inspectPage(page, app, entry) {
  return page.evaluate(async ({ appKey, entryId }) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const text = (document.documentElement.innerText || "").trim();
    const badText = [
      "工程联调",
      "状态" + "已更新",
      "已" + "切换",
      "操作" + "成功",
      "undefined",
      "null",
      "NaN",
    ].filter((item) => text.includes(item));
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0);
    const brokenImages = Array.from(document.images)
      .filter((img) => img.complete === false || img.naturalWidth === 0 || img.naturalHeight === 0)
      .filter((img) => {
        const src = img.currentSrc || img.src || "";
        return !/^https:\/\/webapi\.amap\.com\/theme\/v2\.0\/logo@2x\.png/i.test(src);
      })
      .map((img) => ({ src: img.currentSrc || img.src, alt: img.alt || "" }));
    const tinyButtons = Array.from(document.querySelectorAll("button,a,[role='button']"))
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          text: (node.innerText || node.getAttribute("aria-label") || node.title || "").trim().slice(0, 80),
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0,
        };
      })
      .filter((item) => item.visible && item.text && (item.width < 12 || item.height < 12));
    const transparentInteractiveControls = Array.from(document.querySelectorAll("button,a,[role='button']"))
      .map((node) => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        const opacity = Number.parseFloat(style.opacity || "1");
        return {
          text: (node.innerText || node.getAttribute("aria-label") || node.title || "").trim().slice(0, 80),
          width: rect.width,
          height: rect.height,
          opacity,
          visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none",
        };
      })
      .filter((item) => item.visible && item.opacity < 0.08);
    const rectInfo = (node) => {
      const rect = node.getBoundingClientRect();
      return {
        tag: node.tagName.toLowerCase(),
        className: String(node.className || "").slice(0, 80),
        text: (node.innerText || node.textContent || "").trim().slice(0, 80),
        rect: {
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      };
    };
    const intersects = (a, b, tolerance = 0) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return ar.left < br.right - tolerance
        && ar.right > br.left + tolerance
        && ar.top < br.bottom - tolerance
        && ar.bottom > br.top + tolerance;
    };
    const bottomOverlays = Array.from(document.querySelectorAll("body *"))
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width <= 0 || rect.height < 36) return false;
        const style = window.getComputedStyle(node);
        const className = String(node.className || "");
        const looksBottomNav = /bottom-tabs|tabbar|bottom-nav|sticky-action|ref-bottom-action|footer-action/.test(className);
        const isFixedLike = style.position === "fixed" || style.position === "sticky" || looksBottomNav;
        return isFixedLike && rect.top < viewportHeight && rect.bottom > viewportHeight - 96;
      });
    const bottomCoveredBanners = Array.from(document.querySelectorAll(".quote-banner, .home-quote-banner"))
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        return bottomOverlays.some((overlay) => intersects(node, overlay, 2));
      })
      .map(rectInfo);
    const cardLikeTargets = Array.from(document.querySelectorAll([
      ".activity-card",
      ".home-event-card",
      ".message-card",
      ".order-card",
      ".profile-card",
      ".metric-card",
      ".tool-card",
      ".service-card",
      ".ref-calendar-event",
    ].join(","))).filter((target) => {
      const rect = target.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && !target.closest(".quote-banner, .home-quote-banner");
    });
    const contentCoveredBanners = Array.from(document.querySelectorAll(".quote-banner, .home-quote-banner"))
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        return cardLikeTargets.some((target) => !node.contains(target) && !target.contains(node) && intersects(node, target, 2));
      })
      .map(rectInfo);
    const decorativeQuoteIssues = Array.from(document.querySelectorAll(".quote-mark"))
      .map((node) => {
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const quoteContainer = node.closest(".quote-banner, .home-quote-banner") || node.parentElement;
        const readableTargets = quoteContainer
          ? Array.from(quoteContainer.querySelectorAll("strong, p, button, a"))
              .filter((target) => target !== node && target.getBoundingClientRect().width > 0 && target.getBoundingClientRect().height > 0)
          : [];
        const overlapsReadable = readableTargets.some((target) => intersects(node, target, 4));
        const pointerBlocks = style.pointerEvents !== "none";
        const tooStrong = Number.parseFloat(style.opacity || "1") > 0.72;
        const tooLarge = rect.width > viewportWidth * 0.22 || rect.height > viewportHeight * 0.08;
        if (!overlapsReadable && !pointerBlocks && !tooStrong && !tooLarge) return null;
        return {
          ...rectInfo(node),
          opacity: style.opacity,
          pointerEvents: style.pointerEvents,
          overlapsReadable,
          tooStrong,
          tooLarge,
        };
      })
      .filter(Boolean);
    const homeQuoteStructuralIssues = appKey === "user" && entryId === "home"
      ? Array.from(document.querySelectorAll(".home-quote-banner .quote-mark"))
          .map(rectInfo)
      : [];
    const guideImageFitIssues = appKey === "user" && entryId === "guide"
      ? Array.from(document.querySelectorAll(".screen-guide .ref-guide-card img"))
          .slice(0, 8)
          .map((img) => {
            const rect = img.getBoundingClientRect();
            const style = window.getComputedStyle(img);
            const objectPosition = style.objectPosition.replace(/\s+/g, " ").trim();
            const topAligned = objectPosition === "50% 0%" || objectPosition.includes("top");
            const fitOk = style.objectFit === "contain";
            const heightOk = rect.height >= 64;
            if (fitOk && topAligned && heightOk) return null;
            return {
              ...rectInfo(img),
              objectFit: style.objectFit,
              objectPosition,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
            };
          })
          .filter(Boolean)
      : [];
    const guideOrderFormLayoutIssues = [];
    if (appKey === "user" && (entryId === "guide" || entryId === "order-submit")) {
      const form = document.querySelector(".ref-guide-order-form");
      const timeLabel = Array.from(document.querySelectorAll(".ref-guide-order-form label"))
        .find((label) => label.querySelector("span")?.textContent?.trim() === "预约时间");
      const timeInput = timeLabel?.querySelector('input[type="datetime-local"]');
      if (!form || !timeLabel || !timeInput) {
        guideOrderFormLayoutIssues.push({ type: "missing-appointment-time-field" });
      } else {
        const formRect = form.getBoundingClientRect();
        const labelRect = timeLabel.getBoundingClientRect();
        const inputRect = timeInput.getBoundingClientRect();
        if (labelRect.width < formRect.width * 0.9) {
          guideOrderFormLayoutIssues.push({
            type: "appointment-time-not-wide",
            formWidth: Math.round(formRect.width),
            labelWidth: Math.round(labelRect.width),
          });
        }
        if (inputRect.right > formRect.right + 1 || inputRect.left < formRect.left - 1) {
          guideOrderFormLayoutIssues.push({
            type: "appointment-time-overflows-form",
            formLeft: Math.round(formRect.left),
            formRight: Math.round(formRect.right),
            inputLeft: Math.round(inputRect.left),
            inputRight: Math.round(inputRect.right),
          });
        }
      }
    }
    const assistantInputLayoutIssues = [];
    if (appKey === "user" && entryId === "assistant") {
      const voiceBar = document.querySelector(".screen-assistant .ref-voice-bar");
      const voiceHold = document.querySelector(".screen-assistant .ref-voice-hold");
      const aliasRow = document.querySelector(".screen-assistant .ref-voice-bar > .ref-audit-alias-row");
      const describe = (node) => {
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return {
          className: String(node.className || "").slice(0, 80),
          text: (node.innerText || node.textContent || "").trim().slice(0, 80),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          display: style.display,
          position: style.position,
          pointerEvents: style.pointerEvents,
          opacity: style.opacity,
        };
      };
      if (!voiceBar || !voiceHold) {
        assistantInputLayoutIssues.push({ type: "missing-voice-input", voiceBar: describe(voiceBar), voiceHold: describe(voiceHold) });
      } else {
        const barRect = voiceBar.getBoundingClientRect();
        const holdRect = voiceHold.getBoundingClientRect();
        const aliasStyle = aliasRow ? window.getComputedStyle(aliasRow) : null;
        const aliasRect = aliasRow ? aliasRow.getBoundingClientRect() : null;
        if (aliasRow && (aliasRect.width > 2 || aliasRect.height > 2 || aliasStyle.pointerEvents !== "none")) {
          assistantInputLayoutIssues.push({ type: "audit-alias-occupies-input-bar", aliasRow: describe(aliasRow) });
        }
        if (holdRect.width < barRect.width * 0.58) {
          assistantInputLayoutIssues.push({
            type: "voice-button-not-full-width",
            barWidth: Math.round(barRect.width),
            holdWidth: Math.round(holdRect.width),
          });
        }
      }

      document.querySelector(".screen-assistant .ref-keyboard-toggle")?.click();
      await new Promise((resolve) => setTimeout(resolve, 30));
      const keyboardBar = document.querySelector(".screen-assistant .ref-voice-bar.is-keyboard");
      const keyboardInput = document.querySelector(".screen-assistant .ref-keyboard-input");
      if (!keyboardBar || !keyboardInput) {
        assistantInputLayoutIssues.push({ type: "missing-keyboard-input", keyboardBar: describe(keyboardBar), keyboardInput: describe(keyboardInput) });
      } else {
        const barRect = keyboardBar.getBoundingClientRect();
        const inputRect = keyboardInput.getBoundingClientRect();
        if (inputRect.width < barRect.width * 0.5) {
          assistantInputLayoutIssues.push({
            type: "text-input-not-full-width",
            barWidth: Math.round(barRect.width),
            inputWidth: Math.round(inputRect.width),
          });
        }
      }
    }
    const checkinFilterIssues = [];
    if (appKey === "user" && entryId === "checkin") {
      const filters = ["景点打卡", "活动打卡", "健康打卡", "美食打卡"];
      for (const filter of filters) {
        const button = Array.from(document.querySelectorAll(".ref-checkin-types button"))
          .find((node) => node.textContent.includes(filter));
        if (!button) {
          checkinFilterIssues.push({ type: "missing-checkin-filter", filter });
          continue;
        }
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 30));
        const records = Array.from(document.querySelectorAll(".ref-checkin-record"))
          .filter((node) => !node.hidden && node.getBoundingClientRect().height > 0);
        const status = document.querySelector(".ref-checkin-filter-status");
        const emptyState = document.querySelector(".ref-checkin-empty-state");
        const statusText = (status?.textContent || "").replace(/\s+/g, " ").trim();
        const emptyText = (emptyState?.textContent || "").replace(/\s+/g, " ").trim();
        if (!statusText.includes(filter)) {
          checkinFilterIssues.push({ type: "missing-checkin-filter-status", filter, statusText });
        }
        if (!records.length && !emptyText.includes(`当前暂无${filter}记录`)) {
          checkinFilterIssues.push({ type: "missing-checkin-empty-state", filter, emptyText });
        }
      }
    }
    const profileBenefitLayoutIssues = [];
    if (appKey === "user" && entryId === "profile") {
      const benefits = document.querySelector(".screen-profile .ref-account-section .ref-benefits");
      const benefitItems = Array.from(document.querySelectorAll(".screen-profile .ref-account-section .ref-benefit"));
      const benefitsRect = benefits?.getBoundingClientRect();
      if (!benefits || benefitItems.length !== 3) {
        profileBenefitLayoutIssues.push({ type: "missing-profile-benefits", count: benefitItems.length });
      } else {
        const tallItems = benefitItems
          .map((node) => {
            const rect = node.getBoundingClientRect();
            return { text: (node.innerText || "").replace(/\s+/g, " ").trim().slice(0, 80), height: Math.round(rect.height) };
          })
          .filter((item) => item.height > 72);
        if (benefitsRect.height > 82) {
          profileBenefitLayoutIssues.push({ type: "profile-benefits-too-tall", height: Math.round(benefitsRect.height) });
        }
        if (tallItems.length) profileBenefitLayoutIssues.push({ type: "profile-benefit-item-too-tall", items: tallItems });
      }
    }
    const serviceRecordLayoutIssues = [];
    if (appKey === "user" && entryId === "service-records") {
      const timeline = document.querySelector(".ref-service-timeline");
      const rows = Array.from(document.querySelectorAll(".ref-service-timeline .timeline-item"))
        .filter((node) => !node.hidden && node.getBoundingClientRect().height > 0);
      const tallRows = rows
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return { text: (node.innerText || "").replace(/\s+/g, " ").trim().slice(0, 120), height: Math.round(rect.height) };
        })
        .filter((item) => item.height > 136);
      if (tallRows.length) serviceRecordLayoutIssues.push({ type: "service-record-row-too-tall", rows: tallRows });
      const firstDetail = rows[0]?.querySelector('[data-action="查看详情"]');
      firstDetail?.click();
      await new Promise((resolve) => setTimeout(resolve, 40));
      const detailPanel = document.querySelector("[data-service-record-detail-panel], [data-live-panel^='service-record']");
      if (!detailPanel) {
        serviceRecordLayoutIssues.push({ type: "missing-service-record-detail-panel" });
      } else {
        const timelineRect = timeline?.getBoundingClientRect();
        const panelRect = detailPanel.getBoundingClientRect();
        if (timelineRect && panelRect.width < timelineRect.width * 0.86) {
          serviceRecordLayoutIssues.push({
            type: "service-record-detail-too-narrow",
            timelineWidth: Math.round(timelineRect.width),
            panelWidth: Math.round(panelRect.width),
            panelLeft: Math.round(panelRect.left),
          });
        }
      }
    }
    const messageSpacingIssues = [];
    if (appKey === "user" && entryId === "messages") {
      const tabs = document.querySelector(".ref-message-tabs");
      const firstDate = Array.from(document.querySelectorAll("[data-message-date]"))
        .find((node) => !node.hidden && node.getBoundingClientRect().height > 0);
      const firstRow = document.querySelector(".ref-message-list .message-row:not([hidden])");
      if (!tabs || !firstDate || !firstRow) {
        messageSpacingIssues.push({ type: "missing-message-list-structure" });
      } else {
        const tabsRect = tabs.getBoundingClientRect();
        const dateRect = firstDate.getBoundingClientRect();
        const rowRect = firstRow.getBoundingClientRect();
        const tabToDateGap = Math.round(dateRect.top - tabsRect.bottom);
        const dateToRowGap = Math.round(rowRect.top - dateRect.bottom);
        if (tabToDateGap > 40) messageSpacingIssues.push({ type: "message-filter-to-date-gap-too-large", gap: tabToDateGap });
        if (dateToRowGap > 24) messageSpacingIssues.push({ type: "message-date-to-row-gap-too-large", gap: dateToRowGap });
      }
    }
    const activityMapSpacingIssues = [];
    if (appKey === "user" && entryId === "activity-map") {
      const cats = document.querySelector(".ref-map-cats");
      const status = document.querySelector("[data-activity-map-status]");
      const stage = document.querySelector(".ref-map-stage");
      if (!cats || !status || !stage) {
        activityMapSpacingIssues.push({ type: "missing-activity-map-structure" });
      } else {
        const catsRect = cats.getBoundingClientRect();
        const statusRect = status.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        if (statusRect.height < 12) activityMapSpacingIssues.push({ type: "activity-map-status-hidden", height: Math.round(statusRect.height) });
        const gap = Math.round(stageRect.top - Math.max(catsRect.bottom, statusRect.bottom));
        if (gap > 28) activityMapSpacingIssues.push({ type: "activity-map-filter-to-stage-gap-too-large", gap });
      }
    }
    const visibleOverflow = Array.from(document.querySelectorAll("body *"))
      .map((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return null;
        const style = window.getComputedStyle(node);
        if (style.visibility === "hidden" || style.display === "none") return null;
        if (node.tagName === "SCRIPT" || node.tagName === "STYLE") return null;
        const className = String(node.className || "");
        if (/amap|map-tile|lucide|statusbar/.test(className)) return null;
        if (rect.width > viewportWidth * 1.35) return null;
        const overX = rect.left < -6 || rect.right > viewportWidth + 6;
        const overY = rect.top < -160 || rect.bottom > scrollHeight + 8;
        if (!overX && !overY) return null;
        return {
          tag: node.tagName.toLowerCase(),
          className: className.slice(0, 80),
          text: (node.innerText || "").trim().slice(0, 80),
          rect: {
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
          },
        };
      })
      .filter(Boolean)
      .slice(0, 8);
    const appMinText = appKey === "admin" ? 80 : 45;
    return {
      title: document.title,
      viewportWidth,
      viewportHeight,
      scrollWidth,
      scrollHeight,
      textLength: text.length,
      isBlank: text.length < appMinText,
      badText,
      brokenImages,
      tinyButtons: tinyButtons.slice(0, 8),
      transparentInteractiveControls: transparentInteractiveControls.slice(0, 8),
      bottomCoveredBanners,
      contentCoveredBanners,
      decorativeQuoteIssues,
      homeQuoteStructuralIssues,
      guideImageFitIssues,
      guideOrderFormLayoutIssues,
      assistantInputLayoutIssues,
      checkinFilterIssues,
      profileBenefitLayoutIssues,
      serviceRecordLayoutIssues,
      messageSpacingIssues,
      activityMapSpacingIssues,
      visibleOverflow,
      horizontalOverflow: scrollWidth > viewportWidth + 2,
    };
  }, { appKey: app.key, entryId: entry.id });
}

async function captureApp(browser, baseUrl, app) {
  const module = loadModule(app);
  const refs = referenceMap(app.referenceDir);
  const entries = module.entries.slice().sort((a, b) => Number(a.no || a.id) - Number(b.no || b.id));
  assert.equal(entries.length, app.expected, `${app.name} page count should match reference count`);

  const context = await browser.newContext({
    viewport: { width: app.viewport.width, height: app.viewport.height },
    deviceScaleFactor: app.viewport.deviceScaleFactor,
    isMobile: app.key !== "admin",
    hasTouch: app.key !== "admin",
    locale: "zh-CN",
    colorScheme: "light",
  });
  const page = await context.newPage();
  const records = [];
  const jsErrors = [];
  page.on("pageerror", (error) => {
    jsErrors.push(error.message);
  });

  for (const entry of entries) {
    jsErrors.length = 0;
    const no = String(entry.no || entry.id).padStart(2, "0");
    const reference = refs.get(no);
    const viewport = viewportForReference(app, reference);
    await page.setViewportSize(viewport);
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
      issues: [],
    };
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(app.key === "admin" ? 550 : 350);
      await page.evaluate(() => document.fonts?.ready || Promise.resolve()).catch(() => {});
      if (response && response.status() >= 400) record.issues.push(`HTTP ${response.status()}`);
      const metrics = await inspectPage(page, app, entry);
      if (app.key === "admin" && metrics.isBlank) {
        const adminFrame = page.frames().find((frame) => frame.url().includes("/prototype/admin/"));
        if (adminFrame) {
          const frameTextLength = await adminFrame
            .evaluate(() => (document.documentElement.innerText || "").trim().length)
            .catch(() => 0);
          metrics.frameTextLength = frameTextLength;
          metrics.isBlank = frameTextLength < 80;
        }
      }
      record.metrics = metrics;
      if (jsErrors.length) record.issues.push(`JS error: ${jsErrors.slice(0, 2).join(" | ")}`);
      if (metrics.isBlank) record.issues.push("页面疑似空白");
      if (metrics.badText.length) record.issues.push(`存在禁用提示文案: ${metrics.badText.join(", ")}`);
      if (metrics.brokenImages.length) record.issues.push(`存在破图 ${metrics.brokenImages.length} 个`);
      if (metrics.horizontalOverflow) record.issues.push(`横向溢出: scrollWidth=${metrics.scrollWidth}, viewport=${metrics.viewportWidth}`);
      if (metrics.tinyButtons.length) record.issues.push(`不可点击文本按钮 ${metrics.tinyButtons.length} 个`);
      if (metrics.transparentInteractiveControls?.length) record.issues.push(`存在透明但占位的交互控件 ${metrics.transparentInteractiveControls.length} 个`);
      if (metrics.bottomCoveredBanners?.length) record.issues.push(`底部导航遮挡内容区 ${metrics.bottomCoveredBanners.length} 个`);
      if (metrics.contentCoveredBanners?.length) record.issues.push(`故事横幅遮挡卡片内容 ${metrics.contentCoveredBanners.length} 个`);
      if (metrics.decorativeQuoteIssues?.length) record.issues.push(`装饰引号压住或干扰内容 ${metrics.decorativeQuoteIssues.length} 个`);
      if (metrics.homeQuoteStructuralIssues?.length) record.issues.push(`首页故事横幅仍存在真实引号节点 ${metrics.homeQuoteStructuralIssues.length} 个`);
      if (metrics.guideImageFitIssues?.length) record.issues.push(`人工向导服务图仍裁切人物 ${metrics.guideImageFitIssues.length} 个`);
      if (metrics.guideOrderFormLayoutIssues?.length) record.issues.push(`人工向导预约时间字段布局异常 ${metrics.guideOrderFormLayoutIssues.length} 个`);
      if (metrics.assistantInputLayoutIssues?.length) record.issues.push(`AI智能管家输入区未占满或被隐藏控件挤压 ${metrics.assistantInputLayoutIssues.length} 个`);
      if (metrics.checkinFilterIssues?.length) record.issues.push(`旅居打卡分类筛选缺少列表状态或空状态 ${metrics.checkinFilterIssues.length} 个`);
      if (metrics.profileBenefitLayoutIssues?.length) record.issues.push(`我的页账户与权益模块视觉拉长 ${metrics.profileBenefitLayoutIssues.length} 个`);
      if (metrics.serviceRecordLayoutIssues?.length) record.issues.push(`服务记录列表或详情布局异常 ${metrics.serviceRecordLayoutIssues.length} 个`);
      if (metrics.messageSpacingIssues?.length) record.issues.push(`消息中心筛选栏下方空白异常 ${metrics.messageSpacingIssues.length} 个`);
      if (metrics.activityMapSpacingIssues?.length) record.issues.push(`活动地图顶部状态或间距异常 ${metrics.activityMapSpacingIssues.length} 个`);
    } catch (error) {
      record.issues.push(error.message);
      record.metrics = null;
    }
    records.push(record);
    const mark = record.issues.length ? ` issues=${record.issues.join("；")}` : "";
    console.log(`${app.name} ${no}-${entry.title} render ok${mark}`);
  }

  await context.close();
  return records;
}

async function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-render-"));
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
    const records = [];
    try {
      for (const app of apps) {
        records.push(...(await captureApp(browser, baseUrl, app)));
      }
    } finally {
      await browser.close();
    }

    const summary = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      total: records.length,
      issueCount: records.filter((record) => record.issues.length).length,
      acceptanceGroups: {
        mobileMiniappApp: {
          requirement: "用户端、向导端、商户端按小程序/App 级移动端视口检查空白、破图、溢出、遮挡和异常文案",
          expected: apps.filter((app) => app.platformMode === "miniapp-app").reduce((sum, app) => sum + app.expected, 0),
          checked: records.filter((record) => record.platformMode === "miniapp-app").length,
          issueCount: records.filter((record) => record.platformMode === "miniapp-app" && record.issues.length).length,
        },
        adminWeb: {
          requirement: "管理后台按 Web 级桌面视口检查空白、破图、溢出、遮挡和异常文案",
          expected: apps.filter((app) => app.platformMode === "web-admin").reduce((sum, app) => sum + app.expected, 0),
          checked: records.filter((record) => record.platformMode === "web-admin").length,
          issueCount: records.filter((record) => record.platformMode === "web-admin" && record.issues.length).length,
        },
      },
      records,
    };
    fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(summary, null, 2));
    const issues = records.filter((record) => record.issues.length);
    if (issues.length) {
      console.error(`\nrender quality failed: ${issues.length} pages`);
      issues.slice(0, 40).forEach((record) => {
        console.error(`- ${record.app} ${record.no} ${record.title}: ${record.issues.join("；")}`);
      });
      console.error(`report: ${path.join(outDir, "report.json")}`);
      process.exitCode = 1;
      return;
    }
    console.log(`\nrender quality ok: ${records.length} pages`);
    console.log(`report: ${path.join(outDir, "report.json")}`);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
