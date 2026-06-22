const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

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
    window,
    location,
    navigator: window.navigator,
    history: { replaceState() {} },
    localStorage: { getItem() { return ""; }, setItem() {}, removeItem() {} },
    document: {
      documentElement: { dataset: { display: "app" } },
      body: makeElement(),
      addEventListener() {},
      removeEventListener() {},
      createElement: makeElement,
      getElementById: (id) => getElement(`#${id}`),
      querySelector: (selector) => getElement(selector),
      querySelectorAll: () => [],
    },
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

function loadModule(config) {
  let source = fs.readFileSync(config.file, "utf8");
  config.strip.forEach((token) => {
    source = stripLast(source, token);
  });
  const sandbox = makeSandbox();
  vm.createContext(sandbox);
  vm.runInContext(`${source}\n${config.exportCode}`, sandbox, { filename: config.file });
  return sandbox.__exports;
}

function extractTargets(html, attrName) {
  const targets = [];
  const pattern = new RegExp(`\\s${attrName}=["']([^"']+)["']`, "gi");
  let match;
  while ((match = pattern.exec(html))) targets.push(match[1]);
  return targets;
}

function extractHashLinks(html) {
  const targets = [];
  const pattern = /\shref=["']#([^"']+)["']/gi;
  let match;
  while ((match = pattern.exec(html))) targets.push(match[1]);
  return targets;
}

function audit(config) {
  const module = loadModule(config);
  const entries = module.entries;
  const ids = new Set(entries.map((entry) => entry.id));
  const issues = [];
  let checked = 0;

  for (const entry of entries) {
    const html = String(module.render(entry) || "");
    const label = `${config.name} ${entry.id}-${entry.title || entry.no || ""}`;
    if (/真实路由索引|完整页面路由索引|隐藏路由索引|merchant-internal-route-index/.test(html)) {
      issues.push(`${label}: 不能输出隐藏/真实路由索引导航`);
    }
    for (const attr of config.routeAttrs) {
      for (const target of extractTargets(html, attr)) {
        checked += 1;
        if (!ids.has(target)) {
          issues.push(`${label}: ${attr}="${target}" 不存在于页面清单`);
        }
      }
    }
    for (const target of extractHashLinks(html)) {
      checked += 1;
      if (!ids.has(target)) {
        issues.push(`${label}: href="#${target}" 不存在于页面清单`);
      }
    }
  }

  return { name: config.name, checked, issues };
}

const apps = [
  {
    name: "用户端",
    file: path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js"),
    strip: ["render();"],
    exportCode: "globalThis.__exports = { entries: screens, render: (entry) => `${appBar(entry)}${entry.render()}${entry.checkout ? checkoutBar() : \"\"}${entry.noTab ? \"\" : bottomTabs(entry.tab, entry)}` };",
    routeAttrs: ["data-route", "data-screen"],
  },
  {
    name: "向导端",
    file: path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js"),
    strip: ["init();"],
    exportCode: "globalThis.__exports = { entries: screens, render: (entry) => entry.render() };",
    routeAttrs: ["data-open", "data-screen"],
  },
  {
    name: "商户端",
    file: path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js"),
    strip: ["renderCurrent();", "renderList();"],
    exportCode: "globalThis.__exports = { entries: screens, render: (entry) => renderScreen(entry) };",
    routeAttrs: ["data-go", "data-screen"],
  },
  {
    name: "管理后台",
    file: path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js"),
    strip: ["render();"],
    exportCode: "globalThis.__exports = { entries: pages, render: (entry) => shell(entry) };",
    routeAttrs: ["data-route", "data-screen"],
  },
];

const results = apps.map(audit);
const issues = results.flatMap((result) => result.issues);
const userShell = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html"), "utf8");
assert.doesNotMatch(userShell, /href=["']\/(?:guide|merchant|admin)\//, "用户端 H5 入口不能提供跨端跳转入口");
assert(!userShell.includes("向导端真实路由索引"), "用户端 H5 入口不能出现向导端真实路由索引文案");
assert(userShell.includes("app.js?v=user-transport-real-api-20260620"), "用户端 H5 入口必须刷新脚本版本，避免旧导航、跨端会话或样式对齐缓存");
const merchantShell = fs.readFileSync(path.join(root, "apps/merchant/index.html"), "utf8");
assert.doesNotMatch(merchantShell, /href=["']\/(?:user|guide|admin)\//, "商户端 H5 头部不能提供跨端跳转入口");
assert.doesNotMatch(merchantShell, /href=["']\/["']/, "商户端 H5 品牌入口不能跳到根路径导致离开本端");
assert(merchantShell.includes('href="/merchant/"'), "商户端 H5 品牌入口必须保持在 /merchant/");
const guideShell = fs.readFileSync(path.join(root, "apps/guide/index.html"), "utf8");
assert.doesNotMatch(guideShell, /href=["']\/(?:user|merchant|admin)\//, "向导端 H5 头部不能提供跨端跳转入口");
assert.doesNotMatch(guideShell, /href=["']\/["']/, "向导端 H5 头部不能跳到根路径导致离开本端");
assert(guideShell.includes('href="/guide/"'), "向导端 H5 品牌入口必须保持在 /guide/");
assert(guideShell.includes("app.js?v=guide-nav-boundary-20260612"), "向导端 H5 壳层必须刷新脚本版本，避免旧缓存保留跨端导航风险");
const guideH5Source = fs.readFileSync(path.join(root, "apps/guide/app.js"), "utf8");
assert(guideH5Source.includes("guardGuideEndpointClick"), "向导端 H5 运行时必须拦截跨端链接点击");
assert(guideH5Source.includes("guideUrlLeavesEndpoint"), "向导端 H5 必须识别离开本端的站内 URL");
const guidePrototypeShell = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "index.html"), "utf8");
assert.doesNotMatch(guidePrototypeShell, /href=["']\/(?:user|merchant|admin)\//, "向导端正式入口不能提供跨端跳转入口");
assert.match(guidePrototypeShell, /html\[data-display="app"\] \[data-dev-only\]\s*\{[\s\S]*visibility:\s*hidden\s*!important;[\s\S]*pointer-events:\s*none\s*!important;/, "向导端正式入口必须内联隐藏调试导航，避免 CSS 缓存或加载失败时暴露索引");
assert.match(guidePrototypeShell, /<aside class="screen-nav"[^>]*data-dev-only[^>]*hidden[^>]*aria-hidden="true"/, "向导端侧栏索引默认必须 hidden");
assert.match(guidePrototypeShell, /<div class="phone-meta"[^>]*data-dev-only[^>]*hidden[^>]*aria-hidden="true"/, "向导端页面元信息默认必须 hidden");
assert(guidePrototypeShell.includes("app.js?v=guide-no-fake-green-feedback-20260616"), "向导端入口必须刷新脚本版本，避免旧缓存保留跨端导航、消息、路线、推荐订单空状态或价格断行异常");
const adminShell = fs.readFileSync(path.join(root, "apps/admin/index.html"), "utf8");
assert.doesNotMatch(adminShell, /href=["']\/(?:user|guide|merchant)\//, "管理后台 H5 头部不能提供跨端跳转入口");
const merchantPrototypeSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js"), "utf8");
const merchantPrototypeShell = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "index.html"), "utf8");
assert(merchantPrototypeShell.includes("app.js?v=merchant-mobile-shell-20260620"), "商户端入口必须刷新脚本版本，避免旧缓存保留页面路径回退问题");
assert(!merchantPrototypeSource.includes("merchantHiddenRouteIndex"), "商户端原型不能保留隐藏路由索引函数");
assert(!merchantPrototypeSource.includes("商户端真实路由索引"), "商户端原型不能保留真实路由索引文案");
assert(!merchantPrototypeSource.includes("隐藏路由索引"), "商户端原型不能出现隐藏路由索引说明");
assert(merchantPrototypeSource.includes("normalizeMerchantScreenId"), "商户端原型必须校验内部页面导航目标");
assert(merchantPrototypeSource.includes("normalizeMerchantRouteHash"), "商户端原型必须识别真实页面路径 hash");
assert(merchantPrototypeSource.includes('"/pages/merchant/services": "19"'), "商户端服务管理真实路径必须映射到本端服务页");
assert(merchantPrototypeSource.includes('"/pages/merchant/orders": "20"'), "商户端订单真实路径必须映射到本端订单页");
assert(merchantPrototypeSource.includes('"/pages/merchant/workbench": "24"'), "商户端工作台真实路径必须映射到本端工作台");
assert(merchantPrototypeSource.includes("商户端导航目标无效"), "商户端原型必须拦截无效导航目标");
const guidePrototypeSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js"), "utf8");
assert(!guidePrototypeSource.includes("guideHiddenRouteIndex"), "向导端原型不能保留隐藏路由索引函数");
assert(!guidePrototypeSource.includes("向导端真实路由索引"), "向导端原型不能保留真实路由索引文案");
assert(guidePrototypeSource.includes("normalizeGuideScreenId"), "向导端原型必须校验内部页面导航目标");
assert(guidePrototypeSource.includes("向导端导航目标无效"), "向导端原型必须拦截无效导航目标");
assert(guidePrototypeSource.includes("guardGuideEndpointClick"), "向导端正式运行时必须拦截跨端链接点击");
assert(guidePrototypeSource.includes("guideUrlLeavesEndpoint"), "向导端必须识别离开本端的站内 URL");
assert.match(guidePrototypeSource, /if \(!prototypeMode && list\) list\.innerHTML = '';/, "向导端正式模式不能渲染原型索引内容");
const adminPrototypeSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js"), "utf8");
assert(!adminPrototypeSource.includes("renderRouteIndex"), "管理后台原型不能保留隐藏路由索引函数");
assert(!adminPrototypeSource.includes("管理后台完整页面路由索引"), "管理后台原型不能保留完整页面路由索引文案");
assert(adminPrototypeSource.includes("normalizeAdminPageId"), "管理后台原型必须校验内部页面导航目标");
assert(adminPrototypeSource.includes("管理后台导航目标无效"), "管理后台原型必须拦截无效导航目标");

for (const result of results) {
  console.log(`${result.name}: checked navigation targets=${result.checked}`);
}

assert.equal(issues.length, 0, `导航目标完整性检查失败:\n${issues.join("\n")}`);
console.log("navigation target integrity ok");
