const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");

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
    __errors: [],
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

function countReferenceImages(dir) {
  return fs.readdirSync(dir).filter((name) => /^\d{2}-.+\.(png|jpe?g|webp)$/i.test(name)).length;
}

function extractAttrs(html, tagName, attrName) {
  const values = [];
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*\\s${attrName}=["']([^"']+)["'][^>]*>`, "gi");
  let match;
  while ((match = tagPattern.exec(html))) values.push(match[1]);
  return values;
}

function extractDataTargets(html, attrs) {
  const values = new Set();
  attrs.forEach((attr) => {
    extractAttrs(html, "\\w+", attr).forEach((value) => values.add(value));
  });
  return values;
}

function resolveAsset(src, appDir) {
  const clean = src.split("?")[0];
  if (!clean || clean.startsWith("data:") || /^https?:\/\//.test(clean)) return null;
  if (clean.startsWith("/ui-ref/")) {
    return path.join(root, "云旅无忧UI界面参考图", clean.slice("/ui-ref/".length));
  }
  if (clean.startsWith("/")) return path.join(root, "public", clean.slice(1));
  return path.resolve(appDir, clean);
}

function reachable(start, graph) {
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    (graph.get(current) || []).forEach((next) => {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    });
  }
  return seen;
}

function auditApp(config) {
  const referenceCount = countReferenceImages(config.referenceDir);
  const module = loadModule(config);
  const entries = module.entries;
  const ids = new Set(entries.map((entry) => entry.id));
  const issues = [];
  const graph = new Map();
  let buttonCount = 0;
  let passiveButtonCount = 0;
  let imageCount = 0;

  if (entries.length !== config.expected || referenceCount !== config.expected) {
    issues.push(`${config.name}: 页面/参考图数量不一致，pages=${entries.length}, refs=${referenceCount}, expected=${config.expected}`);
  }

  entries.forEach((entry) => {
    const html = String(module.render(entry) || "");
    const label = `${config.name} ${entry.id}-${entry.title || entry.no || ""}`;
    if (html.trim().length < 160) issues.push(`${label}: 渲染内容过短，疑似空白页`);
    if (/\b(undefined|null|NaN)\b/.test(html)) issues.push(`${label}: 渲染中出现 undefined/null/NaN`);
    if (/真实路由索引|完整页面路由索引|隐藏路由索引|merchant-internal-route-index/.test(html)) {
      issues.push(`${label}: 不能输出隐藏/真实路由索引导航`);
    }

    const buttons = [...html.matchAll(/<button\b([^>]*)>/gi)].map((match) => match[1]);
    buttonCount += buttons.length;
    buttons.forEach((attrs) => {
      const active = /data-(route|action|open|step|go|screen|back)=/i.test(attrs) || /data-add-cart(?:=|\s|$)/i.test(attrs) || /type=["']submit["']/i.test(attrs);
      if (!active) passiveButtonCount += 1;
      if (!active && !config.passiveButtonsHydrated) {
        issues.push(`${label}: 存在未绑定按钮 <button${attrs}>`);
      }
    });

    const targets = [...extractDataTargets(html, config.routeAttrs)].filter((target) => ids.has(target));
    graph.set(entry.id, targets);

    extractAttrs(html, "img", "src").forEach((src) => {
      imageCount += 1;
      const assetPath = resolveAsset(src, config.appDir);
      if (assetPath && !fs.existsSync(assetPath)) {
        issues.push(`${label}: 图片资源不存在 ${src}`);
      }
    });
  });

  const seen = reachable(config.startId, graph);
  const unreachable = [...ids].filter((id) => !seen.has(id));
  if (unreachable.length && !config.allowInternalUnreachable) {
    issues.push(`${config.name}: 从 ${config.startId} 不可达页面 ${unreachable.join(", ")}`);
  }

  return {
    name: config.name,
    pages: entries.length,
    refs: referenceCount,
    buttons: buttonCount,
    passiveButtons: passiveButtonCount,
    images: imageCount,
    reachable: seen.size,
    issues,
  };
}

const apps = [
  {
    name: "用户端",
    expected: 40,
    startId: "home",
    referenceDir: path.join(root, "云旅无忧UI界面参考图", "用户端"),
    appDir: path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现"),
    file: path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js"),
    strip: ["render();"],
    exportCode: "globalThis.__exports = { entries: screens, render: (entry) => `${appBar(entry)}${entry.render()}${entry.checkout ? checkoutBar() : \"\"}${entry.noTab ? \"\" : bottomTabs(entry.tab, entry)}` };",
    routeAttrs: ["data-route"],
    passiveButtonsHydrated: false,
  },
  {
    name: "向导端",
    expected: 46,
    startId: "14",
    referenceDir: path.join(root, "云旅无忧UI界面参考图", "向导端"),
    appDir: path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现"),
    file: path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js"),
    strip: ["init();"],
    exportCode: "globalThis.__exports = { entries: screens, render: (entry) => entry.render() };",
    routeAttrs: ["data-open"],
    passiveButtonsHydrated: true,
  },
  {
    name: "商户端",
    expected: 70,
    startId: "24",
    referenceDir: path.join(root, "云旅无忧UI界面参考图", "商户端"),
    appDir: path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype"),
    file: path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js"),
    strip: ["renderCurrent();", "renderList();"],
    exportCode: "globalThis.__exports = { entries: screens, render: (entry) => renderScreen(entry) };",
    routeAttrs: ["data-go"],
    passiveButtonsHydrated: true,
  },
  {
    name: "管理后台",
    expected: 53,
    startId: "dashboard",
    referenceDir: path.join(root, "云旅无忧UI界面参考图", "管理后台"),
    appDir: path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui"),
    file: path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js"),
    strip: ["render();"],
    exportCode: "globalThis.__exports = { entries: pages, render: (entry) => shell(entry) };",
    routeAttrs: ["data-route"],
    passiveButtonsHydrated: true,
    allowInternalUnreachable: true,
  },
];

const results = apps.map(auditApp);
const allIssues = results.flatMap((result) => result.issues);

results.forEach((result) => {
  console.log(`${result.name}: pages=${result.pages}, refs=${result.refs}, reachable=${result.reachable}, buttons=${result.buttons}, passive=${result.passiveButtons}, images=${result.images}`);
});

if (allIssues.length) {
  console.error("\nUI route audit failed:");
  allIssues.forEach((issue) => console.error(`- ${issue}`));
  process.exitCode = 1;
} else {
  assert.equal(results.length, 4);
  console.log("\nui route audit ok");
}
