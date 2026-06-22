const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(...parts) {
  return fs.readFileSync(path.join(root, ...parts), "utf8");
}

function includes(source, needle, message) {
  assert(source.includes(needle), message);
}

function matches(source, pattern, message) {
  assert(pattern.test(source), message);
}

function checkUserNavigation() {
  const source = read("云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
  const html = read("云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html");

  includes(html, 'id="screenNav"', "user prototype must expose a left page navigation container");
  includes(html, 'id="mobileSwitcher"', "user prototype must expose a mobile page switcher container");
  includes(source, "function bottomTabs", "user bottom tab renderer is required");
  matches(source, /class="bottom-tabs"[\s\S]*data-route="\$\{route\}"/, "user bottom tabs must render data-route targets");
  includes(source, "function renderNav", "user left navigation renderer is required");
  includes(source, "function syncPrototypeShell", "user app must lock prototype navigation out of formal app mode");
  matches(source, /if \(!prototypeMode\) \{[\s\S]*screenNav\.innerHTML = "";[\s\S]*mobileSwitcher\.innerHTML = "";[\s\S]*\}/, "user formal app mode must clear prototype navigation content");
  includes(source, "if (!isPrototypeMode() || !screenNav || !mobileSwitcher) return;", "user formal app mode must not render prototype navigation");
  includes(source, "function normalizeUserRouteId", "user route normalizer must support direct and query-driven page ids");
  includes(source, "function queryParam", "user app must read query params for compatibility");
  includes(source, 'queryParam("screen") || queryParam("page") || queryParam("route")', "user query router must accept screen/page/route params");
  matches(source, /screens\.find\(\(screen\) => screen\.num === id\)\?\.id/, "user query router must map numeric screen ids inside the user endpoint");
  includes(source, "normalizeInitialQueryRoute();", "user query route normalization must run before initial render");
  includes(source, "function userUrlLeavesEndpoint", "user runtime must classify same-origin cross-endpoint URLs");
  includes(source, "function guardUserEndpointClick", "user runtime must guard against cross-endpoint link clicks");
  matches(source, /document\.addEventListener\("click", guardUserEndpointClick, true\)/, "user cross-endpoint guard must run before normal routing");
  includes(source, "normalizeUserRouteId(window.location.hash)", "user current route must normalize hash, numeric ids, aliases and page paths consistently");
  includes(source, "const normalized = normalizeUserRouteId(id);", "user setRoute must normalize every requested route before touching the hash");
  includes(source, "用户端导航目标无效", "user router must reject invalid or cross-endpoint route targets in place");
  matches(source, /class="screen-link[\s\S]*data-route="\$\{screen\.id\}"/, "user left navigation must render data-route targets");
  matches(source, /class="tab[\s\S]*data-user-tab="\$\{key\}"[\s\S]*data-route="\$\{route\}"/, "user bottom tabs must expose stable tab identity and route targets");
  includes(source, '["home", "home", "首页", "home"]', "user home tab must route to the home screen");
  includes(source, '["discover", "compass", discoverLabel, discoverRoute]', "user discover/steward tab must route through the computed user endpoint route");
  includes(source, '["consult", "headphones", "人工向导", "guide"]', "user guide tab must route to the user-side guide entry");
  includes(source, '["messages", "message-circle", "消息", "messages"]', "user messages tab must route to the user-side message center");
  includes(source, '["profile", "user", "我的", "profile"]', "user profile tab must route to the user-side profile screen");
  matches(source, /document\.addEventListener\("click", async \(event\) => \{[\s\S]*event\.target\.closest\("\[data-route\]"\)[\s\S]*const nextRoute = normalizeUserRouteId\(route\.dataset\.route\)[\s\S]*setRoute\(nextRoute\)/, "user click handler must normalize data-route controls before SPA routing");
  includes(source, 'window.addEventListener("hashchange", render);', "user hash changes must re-render the current route");
}

function checkGuideNavigation() {
  const source = read("云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js");
  const html = read("云旅无忧UI界面参考图", "向导端", "向导端代码实现", "index.html");
  const css = read("云旅无忧UI界面参考图", "向导端", "向导端代码实现", "styles.css");

  includes(html, 'id="screenList"', "guide prototype must expose a left page navigation container");
  includes(source, "function bottomNav", "guide bottom tab renderer is required");
  matches(source, /aria-label="底部导航"[\s\S]*data-open="\$\{target\}"/, "guide bottom tabs must render data-open targets");
  matches(source, /list\.innerHTML = screens\.map[\s\S]*data-open="\$\{screen\.id\}"/, "guide left navigation must render data-open targets");
  matches(source, /document\.addEventListener\('click', async event => \{[\s\S]*event\.target\.closest\('\[data-open\]'\)[\s\S]*setScreen\(nextId\)/, "guide click handler must route data-open controls through setScreen");
  includes(source, "normalizeGuideScreenId", "guide navigation must validate screen targets before switching");
  includes(source, "function syncGuidePrototypeShell", "guide formal app mode must keep prototype navigation out of the app shell");
  includes(source, "function guardGuideEndpointClick", "guide runtime must guard against cross-endpoint link clicks");
  includes(source, "function guideUrlLeavesEndpoint", "guide runtime must classify same-origin cross-endpoint URLs");
  matches(source, /document\.addEventListener\('click', guardGuideEndpointClick, true\)/, "guide cross-endpoint guard must run in capture phase before normal routing");
  matches(source, /window\.addEventListener\('hashchange'[\s\S]*normalizeGuideScreenId\(location\.hash\)/, "guide hash changes must be normalized before rendering");
  includes(source, 'class="price guide-price-inline"', "guide hall order cards must mark price text as a single inline unit");
  includes(css, ".guide-price-inline", "guide CSS must include an inline price guard");
  matches(css, /\.guide-price-inline[\s\S]*display:\s*inline-flex/, "guide price guard must keep currency and number on one inline baseline");
  matches(css, /\.guide-price-inline[\s\S]*white-space:\s*nowrap/, "guide price guard must prevent price text from splitting");
  matches(css, /\.guide-price-inline[\s\S]*word-break:\s*keep-all/, "guide price guard must prevent CJK line breaking inside price text");
}

function checkMerchantNavigation() {
  const source = read("云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js");
  const html = read("云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "index.html");

  includes(html, 'id="screenList"', "merchant prototype must expose a left page navigation container");
  includes(source, "function tabbar", "merchant bottom tab renderer is required");
  matches(source, /aria-label="底部导航"[\s\S]*data-go="\$\{tabTargets\[key\]\}"/, "merchant bottom tabs must render data-go targets");
  matches(source, /screenListEl\.innerHTML = visible[\s\S]*data-screen="\$\{screen\.id\}"/, "merchant left navigation must render data-screen targets");
  matches(source, /screenListEl\.addEventListener\("click"[\s\S]*event\.target\.closest\("\[data-screen\]"\)[\s\S]*setActive\(button\.dataset\.screen\)/, "merchant left navigation click handler must call setActive");
  matches(source, /phoneEl\.addEventListener\("click", async \(event\) => \{[\s\S]*event\.target\.closest\("\[data-go\]"\)[\s\S]*setActive\(nextId\)/, "merchant bottom and page navigation clicks must call setActive");
  includes(source, "normalizeMerchantScreenId", "merchant navigation must validate screen targets before switching");
  includes(source, "normalizeMerchantRouteHash", "merchant navigation must support real merchant page hash routes");
  includes(source, '"/pages/merchant/services": "19"', "merchant services hash route must map to the service screen");
  includes(source, '"/pages/merchant/orders": "20"', "merchant orders hash route must map to the order screen");
  matches(source, /window\.addEventListener\("hashchange"[\s\S]*normalizeMerchantScreenId\(location\.hash\)[\s\S]*setActive\(id, \{ updateHash: true, record: false, replace: true \}\)/, "merchant hash changes must be normalized before rendering");
}

function checkAdminNavigation() {
  const source = read("云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js");

  includes(source, "function renderSidebar", "admin sidebar renderer is required");
  matches(source, /class="nav-item[\s\S]*data-route="\$\{item\.route\}"/, "admin sidebar must render data-route targets");
  matches(source, /document\.querySelectorAll\("\[data-route\]"\)\.forEach[\s\S]*addEventListener\("click"[\s\S]*location\.hash = pageHref\(route\)/, "admin data-route clicks must update the SPA hash route");
  includes(source, "normalizeAdminPageId", "admin navigation must validate page targets before switching");
  includes(source, 'window.addEventListener("hashchange", render);', "admin hash changes must re-render the current route");
}

checkUserNavigation();
checkGuideNavigation();
checkMerchantNavigation();
checkAdminNavigation();

console.log("navigation interaction contract ok");
