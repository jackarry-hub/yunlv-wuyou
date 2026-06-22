const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(...parts) {
  return fs.readFileSync(path.join(root, ...parts), "utf8");
}

function assertIncludes(source, needle, message) {
  assert(source.includes(needle), message);
}

function assertMatches(source, pattern, message) {
  assert(pattern.test(source), message);
}

const apps = [
  {
    name: "用户端",
    dir: ["云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现"],
    devOnlySelectors: [
      /<aside class="screen-rail"[^>]*data-dev-only/,
      /<div class="mobile-switcher"[^>]*data-dev-only/,
    ],
    appHiddenSelectors: [
      /html\[data-display="app"\] \[data-dev-only\]\s*\{[\s\S]*display:\s*none\s*!important;/,
    ],
  },
  {
    name: "向导端",
    dir: ["云旅无忧UI界面参考图", "向导端", "向导端代码实现"],
    devOnlySelectors: [
      /<aside class="screen-nav"[^>]*data-dev-only/,
      /<div class="phone-meta"[^>]*data-dev-only/,
    ],
    appHiddenSelectors: [
      /html\[data-display="app"\] \[data-dev-only\]\s*\{[\s\S]*display:\s*none\s*!important;/,
    ],
  },
  {
    name: "商户端",
    dir: ["云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype"],
    devOnlySelectors: [
      /<aside class="screen-panel"[^>]*data-dev-only/,
      /<div class="stage-toolbar"[^>]*data-dev-only/,
      /<aside class="notes-panel"[^>]*data-dev-only/,
    ],
    appHiddenSelectors: [
      /html\[data-display="app"\] \[data-dev-only\]\s*\{[\s\S]*display:\s*none\s*!important;/,
    ],
  },
];

for (const app of apps) {
  const index = read(...app.dir, "index.html");
  const styles = read(...app.dir, "styles.css");

  assertIncludes(index, "document.documentElement.dataset.display", `${app.name}: must choose app/prototype display mode`);
  assertIncludes(index, 'location.pathname.startsWith("/prototype/") ? "prototype" : "app"', `${app.name}: formal routes must use app display mode`);

  for (const pattern of app.devOnlySelectors) {
    assertMatches(index, pattern, `${app.name}: debug/prototype navigation panels must be marked data-dev-only`);
  }

  for (const pattern of app.appHiddenSelectors) {
    assertMatches(styles, pattern, `${app.name}: app display mode must hide data-dev-only UI`);
  }
}

const adminIndex = read("云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "index.html");
assert(!/screen-rail|screen-nav|screen-panel|notes-panel|mobileSwitcher|screenList|页面导航|界面列表|页面列表|实现说明|参考实现/.test(adminIndex), "管理后台正式入口不能混入原型索引/说明面板");

const userIndex = read("云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html");
const userApp = read("云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const userStyles = read("云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "styles.css");
assertMatches(userIndex, /html\[data-display="app"\] \[data-dev-only\]\s*\{[\s\S]*visibility:\s*hidden\s*!important;[\s\S]*pointer-events:\s*none\s*!important;/, "用户端正式入口必须内联隐藏原型导航，避免 CSS 缓存或加载失败时暴露侧栏");
assertMatches(userIndex, /<aside class="screen-rail"[^>]*data-dev-only[^>]*hidden[^>]*aria-hidden="true"/, "用户端侧栏索引默认必须 hidden");
assertMatches(userIndex, /<div class="mobile-switcher"[^>]*data-dev-only[^>]*hidden[^>]*aria-hidden="true"/, "用户端移动页索引默认必须 hidden");
assertIncludes(userIndex, "styles.css?v=user-mobile-shell-20260620", "用户端样式版本必须刷新，避免旧缓存显示原型导航、地图状态或对齐异常");
assertIncludes(userIndex, "app.js?v=user-route-boundary-20260613", "用户端脚本版本必须刷新，避免旧缓存保留错误导航、跨端会话、地图状态或对齐异常");
assertIncludes(userApp, "function syncPrototypeShell", "用户端运行时必须同步正式/原型壳层状态");
assertMatches(userApp, /if \(!prototypeMode\) \{[\s\S]*screenNav\.innerHTML = "";[\s\S]*mobileSwitcher\.innerHTML = "";[\s\S]*\}/, "用户端正式模式必须清空原型索引内容");
assertIncludes(userApp, "if (!isPrototypeMode() || !screenNav || !mobileSwitcher) return;", "用户端正式模式不能渲染原型页面索引");
assertIncludes(userStyles, "Final user alignment guard", "用户端必须保留标题和按钮对齐兜底");
assertMatches(userStyles, /:where\(\.btn, \.app-action, \.text-btn, \.ref-bottom-action button,[\s\S]*line-height:\s*1\.14\s*!important;/, "用户端按钮文字和图标必须统一基线");
const forbiddenUserApiPromptFragments = [
  '已从 ${apiText(page.sourceEndpoint, "/api/user/health-services")} 读取',
  '已从 ${apiText(page.sourceEndpoint, "/api/user/community")} 加载',
  "数据来自用户中心接口",
  "接口返回 ${Number(shopPageState?.products?.length || 0)}",
  "真实接口",
  "正在读取真实",
  "正在从接口读取",
  "正在从联系人接口读取",
  "正在从健康服务接口读取",
  "从健康档案接口同步真实数据",
  "接口实时统计",
  "数据来自订单接口",
  "服务记录详情已从真实接口读取",
  "已同步到真实接口",
  "已同步真实接口",
  "人数已同步到真实接口",
  "AI接口调用失败",
  "语音问答接口调用失败",
  "已保存到紧急联系人接口",
  "已通过消息接口标记",
  "消息已通过后台接口标记为已读",
  "接口客户端未初始化",
  "请求后台活动地图接口",
  "已从 /api",
  "正在读取",
  "读取失败",
  "正在为您生成真实回答",
  "真实绑定",
  "真实社区动态",
  "提交真实订单",
  "真实评价",
  "真实订单",
  "真实报名",
  "真实社群正在运营",
  "真实打卡记录已同步",
  "正在同步真实志愿服务数据",
  "志愿服务数据读取失败",
];
for (const fragment of forbiddenUserApiPromptFragments) {
  assert(!userApp.includes(fragment), `用户端正式 UI 不能展示接口/真实数据调试提示：${fragment}`);
}

const guideIndex = read("云旅无忧UI界面参考图", "向导端", "向导端代码实现", "index.html");
const guideApp = read("云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js");
const guideStyles = read("云旅无忧UI界面参考图", "向导端", "向导端代码实现", "styles.css");
assertMatches(guideIndex, /html\[data-display="app"\] \[data-dev-only\]\s*\{[\s\S]*visibility:\s*hidden\s*!important;[\s\S]*pointer-events:\s*none\s*!important;/, "向导端正式入口必须内联隐藏原型导航，避免 CSS 缓存或加载失败时暴露侧栏");
assertMatches(guideIndex, /<aside class="screen-nav"[^>]*data-dev-only[^>]*hidden[^>]*aria-hidden="true"/, "向导端侧栏索引默认必须 hidden");
assertMatches(guideIndex, /<div class="phone-meta"[^>]*data-dev-only[^>]*hidden[^>]*aria-hidden="true"/, "向导端页面元信息默认必须 hidden");
assertIncludes(guideIndex, "viewport-fit=cover", "向导端正式入口必须适配真实设备安全区");
assertIncludes(guideIndex, "interactive-widget=resizes-content", "向导端正式入口必须允许移动端键盘调整可视区域");
assertIncludes(guideIndex, "styles.css?v=guide-price-inline-20260613", "向导端样式版本必须刷新，避免旧缓存保留固定手机壳、不明确空状态或价格断行");
assertIncludes(guideIndex, "app.js?v=guide-price-inline-20260613", "向导端脚本版本必须刷新，避免旧缓存保留跨端导航、消息、路线、推荐订单空状态或价格断行异常");
assertIncludes(guideApp, "function syncGuidePrototypeShell", "向导端运行时必须同步正式/原型壳层状态");
assertIncludes(guideApp, "function guardGuideEndpointClick", "向导端运行时必须拦截跨端链接点击");
assertIncludes(guideApp, "function guideUrlLeavesEndpoint", "向导端运行时必须识别离开本端的站内 URL");
assertMatches(guideApp, /if \(!prototypeMode && list\) list\.innerHTML = '';/, "向导端正式模式不能渲染原型索引内容");
assertIncludes(guideApp, "GUIDE_ROUTE_LOAD_TIMEOUT_MS", "向导端路线导航必须有加载超时状态");
assertIncludes(guideApp, "guideRouteFallbackStatusHtml", "向导端路线导航必须提供高德降级入口");
assertIncludes(guideApp, "guideRouteState", "向导端路线导航必须暴露 loading/ready/fallback 状态");
assertIncludes(guideApp, "function guideHomeRecommendEmptyHtml", "向导端首页推荐订单为空时必须使用明确空状态组件");
assertIncludes(guideApp, "这是正常数据状态", "向导端首页推荐订单为空时必须说明属于正常后台队列状态");
assertIncludes(guideApp, "data-guide-recommend-empty-state=\"empty\"", "向导端首页推荐订单空状态必须暴露可验证状态");
assertIncludes(guideApp, "data-open=\"01\">去接单大厅", "向导端首页推荐订单空状态必须提供接单大厅入口");
assert(!guideApp.includes("暂无${activeHomeCategory}推荐订单"), "向导端首页不能再显示容易误判的“暂无全部推荐订单”模板");
assertIncludes(guideStyles, '.guide-amap-status[data-guide-route-state="fallback"]', "向导端路线导航降级状态必须有可见样式");
assertIncludes(guideStyles, ".guide-home-empty-icon", "向导端首页推荐订单空状态必须有独立图标样式");
assertIncludes(guideStyles, "--guide-app-viewport-height", "向导端正式模式必须用视口变量适配真实移动设备高度");
assertIncludes(guideStyles, "@supports (height: 100svh)", "向导端正式模式必须提供稳定视口高度兜底");
assertIncludes(guideStyles, "@supports (height: 100dvh)", "向导端正式模式必须支持动态视口高度");
assertIncludes(guideStyles, "Guide mobile viewport contract", "向导端必须声明正式端移动视口适配契约");
assertMatches(guideStyles, /html\[data-display="app"\] \.phone\s*\{[\s\S]*width:\s*100vw;[\s\S]*height:\s*var\(--guide-app-viewport-height\);[\s\S]*border-radius:\s*0;/, "向导端正式模式不能使用固定 390×844 手机外壳");
assertIncludes(guideStyles, "Guide desktop preview viewport contract", "向导端在桌面/右侧宽视口必须声明手机预览契约");
assertMatches(guideStyles, /@media\s*\(min-width:\s*520px\)\s*\{[\s\S]*html\[data-display="app"\] \.phone\s*\{[\s\S]*width:\s*min\(390px,\s*calc\(100vw - 24px\)\);[\s\S]*border-radius:\s*34px;[\s\S]*box-shadow:/, "向导端桌面宽视口必须以 390px 手机框显示");
assertMatches(guideStyles, /html\[data-display="app"\] \.screen-scroll\s*\{[\s\S]*env\(safe-area-inset-left\)[\s\S]*-webkit-overflow-scrolling:\s*touch;/, "向导端滚动区必须兼容安全区和移动端惯性滚动");
assertMatches(guideStyles, /html\[data-display="app"\] \.bottom-nav\s*\{[\s\S]*env\(safe-area-inset-bottom\)/, "向导端底部导航必须避开真实设备底部安全区");

const guideH5Index = read("apps", "guide", "index.html");
const guideH5App = read("apps", "guide", "app.js");
const sharedBusinessBridge = read("apps", "shared", "business-bridge.js");
assertIncludes(guideH5Index, 'href="/guide/"', "向导端 H5 品牌入口必须保持在本端路径");
assertIncludes(guideH5Index, "app.js?v=guide-nav-boundary-20260612", "向导端 H5 脚本版本必须刷新，避免旧缓存保留跨端导航风险");
assertIncludes(guideH5App, "function guardGuideEndpointClick", "向导端 H5 运行时必须拦截跨端链接点击");
assertIncludes(guideH5App, "function guideUrlLeavesEndpoint", "向导端 H5 运行时必须识别离开本端的站内 URL");
const forbiddenGuideApiPromptFragments = [
  "头像读取失败",
  "正在读取头像",
  "接口调用失败",
  "正在读取状态机契约",
  "准备读取 5.1 状态流",
  "当前列表仅展示后台/API 分配的真实任务",
  "暂无真实订单详情",
  "API 返回",
  "正在读取订单消息",
  "向导端功能总览已同步接口数据",
  "消息接口暂不可用",
  "真实任务接口暂不可用",
  "真实任务",
  "首页只展示可真实接单",
  "提交真实订单",
  "真实订单状态追踪",
  "这里读取 /api/orders",
  "真实订单追踪",
  "真实向导任务列表",
  "统一统计接口",
  "真实今日收入与评价",
  "读取向导任务",
];
for (const fragment of forbiddenGuideApiPromptFragments) {
  assert(!guideApp.includes(fragment), `向导端正式 UI 不能展示接口/读取类调试提示：${fragment}`);
  assert(!guideH5App.includes(fragment), `向导端 H5 UI 不能展示接口/读取类调试提示：${fragment}`);
  assert(!sharedBusinessBridge.includes(fragment), `共享业务桥接层不能向向导端展示接口/读取类调试提示：${fragment}`);
}

const merchantH5Index = read("apps", "merchant", "index.html");
const merchantPrototypeIndex = read("云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "index.html");
const merchantPrototypeApp = read("云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js");
assertIncludes(merchantH5Index, 'href="/merchant/"', "商户端 H5 品牌入口必须保持在本端路径");
assertIncludes(merchantPrototypeIndex, "app.js?v=merchant-mobile-shell-20260620", "商户端正式入口脚本版本必须刷新，避免旧缓存保留页面路径回退问题");
assert(
  merchantPrototypeIndex.indexOf("./app.js?v=merchant-mobile-shell-20260620") < merchantPrototypeIndex.indexOf("https://unpkg.com/lucide"),
  "商户端正式入口不能让外部图标 CDN 阻塞 app.js 渲染"
);
assertIncludes(merchantPrototypeIndex, "window.lucide.createIcons()", "商户端外部图标库异步加载后必须补跑图标渲染");
assertIncludes(merchantPrototypeApp, "normalizeMerchantRouteHash", "商户端正式运行时必须识别真实页面路径 hash");
assertIncludes(merchantPrototypeApp, '"/pages/merchant/services": "19"', "商户端真实服务路径必须留在商户端服务页");
assertIncludes(merchantPrototypeApp, '"/pages/merchant/orders": "20"', "商户端真实订单路径必须留在商户端订单页");
assertIncludes(merchantPrototypeApp, '"/pages/merchant/workbench": "24"', "商户端真实工作台路径必须留在商户端工作台");
const forbiddenMerchantApiPromptFragments = [
  "真实接口",
  "真实接口加载失败",
  "正在读取",
  "读取失败",
  "接口同步失败",
  "接口调用失败",
  "接口客户端",
  "已从 /api",
  "当前筛选条件下接口没有返回订单",
  "订单接口",
  "评价接口",
  "接口时间",
  "接口消息内容",
  "接口消息已同步",
  "消息中心只展示后台/API 返回的真实记录",
  "当前接口没有可改期订单",
  "接口订单时间待同步",
  "接口订单同步中",
  "真实商户接口暂不可用",
  "已保存到真实接口",
  "接口未返回可操作订单",
  "接口订单",
  "来源：${escapeHtml(qualification.sourceEndpoint",
  "消息详情只展示 /api/messages",
  "真实商户入驻接口",
  "真实上传接口",
];
for (const fragment of forbiddenMerchantApiPromptFragments) {
  assert(!merchantPrototypeApp.includes(fragment), `商户端正式 UI 不能展示接口/读取类调试提示：${fragment}`);
}

console.log("production ui cleanliness ok");
