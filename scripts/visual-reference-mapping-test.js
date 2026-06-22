const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const root = path.resolve(__dirname, "..");
const refRoot = path.join(root, "云旅无忧UI界面参考图");
const uniRoot = path.join(root, "uniapp");

const expectedCounts = {
  user: 40,
  guide: 46,
  merchant: 70,
  admin: 53,
};

const refDirs = {
  user: "用户端",
  guide: "向导端",
  merchant: "商户端",
  admin: "管理后台",
};

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function imageFiles(role) {
  const dir = path.join(refRoot, refDirs[role]);
  return fs.readdirSync(dir)
    .filter((file) => /\.(png|jpe?g)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

function assertSequential(role) {
  const files = imageFiles(role);
  const expected = expectedCounts[role];
  assert.strictEqual(files.length, expected, `${refDirs[role]}参考图数量必须为 ${expected}`);
  const numbers = files.map((file) => {
    const match = file.match(/^(\d+)-/);
    assert(match, `${file} 缺少编号前缀`);
    return Number(match[1]);
  });
  for (let index = 1; index <= expected; index += 1) {
    assert(numbers.includes(index), `${refDirs[role]}缺少第 ${String(index).padStart(2, "0")} 张参考图`);
  }
  return files;
}

function assertRoute(ref, pagePaths) {
  assert(pagePaths.includes(ref.route), `pages.json 缺少 ${ref.role} ${ref.screenNo} ${ref.route}`);
  assert(fs.existsSync(path.join(uniRoot, `${ref.route}.vue`)), `缺少页面文件 ${ref.route}.vue`);
}

function assertUniqueReferences(refs, expected, label) {
  assert.strictEqual(refs.length, expected, `${label}映射数量必须为 ${expected}`);
  const screenNos = new Set(refs.map((item) => item.screenNo));
  const routes = new Set(refs.map((item) => item.route));
  assert.strictEqual(screenNos.size, expected, `${label}参考图编号不能重复`);
  assert.strictEqual(routes.size, expected, `${label}正式页面路由不能重复`);
}

function forbiddenPhrase(parts) {
  return parts.join("");
}

const forbiddenGenericFeedback = [
  forbiddenPhrase(["状态", "已更新"]),
  forbiddenPhrase(["操作", "成功"]),
  forbiddenPhrase(["占位", "页"]),
  forbiddenPhrase(["待", "接入"]),
  forbiddenPhrase(["工程", "联调"]),
  forbiddenPhrase(["开发", "联调"]),
  forbiddenPhrase(["操作", "已记录"]),
  forbiddenPhrase(["任务", "已更新"]),
  forbiddenPhrase(["状态", "已流转"]),
  forbiddenPhrase(["已选择", "服务"]),
];

function assertNoGenericFeedback(source, label) {
  forbiddenGenericFeedback.forEach((phrase) => {
    assert(!source.includes(phrase), `${label} 不能包含泛化反馈文案：${phrase}`);
  });
}

function assertCanvasReadbackHint(source, label) {
  assert(!/getContext\(\s*["']2d["']\s*\)/.test(source), `${label} Canvas 2D 上下文必须设置 willReadFrequently，避免频繁读取时触发性能提示`);
}

function pageIdOf(ref) {
  return ref.route.split("/").pop();
}

async function main() {
  const userFiles = assertSequential("user");
  assertSequential("guide");
  assertSequential("merchant");
  assertSequential("admin");

  const visualMap = await import(pathToFileURL(path.join(uniRoot, "common/visual-reference-map.js")).href);
  const { userVisualReferences, guideVisualReferences, merchantVisualReferences } = visualMap;

  assertUniqueReferences(userVisualReferences, expectedCounts.user, "用户端");
  assertUniqueReferences(guideVisualReferences, expectedCounts.guide, "向导端");
  assertUniqueReferences(merchantVisualReferences, expectedCounts.merchant, "商户端");

  userVisualReferences.forEach((ref) => {
    assert(userFiles.includes(ref.file), `用户端 ${ref.screenNo} 映射文件不存在：${ref.file}`);
  });

  const pages = JSON.parse(read("uniapp/pages.json"));
  const pagePaths = pages.pages.map((item) => item.path);
  [...userVisualReferences, ...guideVisualReferences, ...merchantVisualReferences].forEach((ref) => {
    assertRoute(ref, pagePaths);
  });

  const userComponent = read("uniapp/components/YlUserReferencePage.vue");
  const roleComponent = read("uniapp/components/YlRoleReferencePage.vue");
  const activitySignup = read("uniapp/pages/user/activity-signup.vue");
  const activityCalendar = read("uniapp/pages/user/activity-calendar.vue");
  const pageShell = read("uniapp/components/YlPage.vue");
  const card = read("uniapp/components/YlCard.vue");
  const button = read("uniapp/components/YlPrimaryButton.vue");
  const userReferenceApp = read("云旅无忧UI界面参考图/用户端/云旅无忧用户端代码实现/app.js");
  const guideReferenceApp = read("云旅无忧UI界面参考图/向导端/向导端代码实现/app.js");

  assertCanvasReadbackHint(userReferenceApp, "用户端参考图应用");
  assertCanvasReadbackHint(guideReferenceApp, "向导端参考图应用");

  [
    "findVisualReference",
    "reference-page",
    "data-screen",
    "visualKind",
    "YlActionGrid",
    "status-grid",
    "form-list",
    "border-radius: 34rpx",
    "grid-template-columns: repeat(2, minmax(0, 1fr))",
  ].forEach((needle) => {
    assert(userComponent.includes(needle), `用户端参考页模板缺少视觉基线 ${needle}`);
  });

  ["data-screen", "reference-page", "visualKind", "money-panel", "form-list", "messageFilters", "upload-grid", "实时数据", "border-radius: 36rpx"].forEach((needle) => {
    assert(roleComponent.includes(needle), `角色端参考页模板缺少视觉基线 ${needle}`);
  });

  [
    userComponent,
    roleComponent,
    activitySignup,
    activityCalendar,
    read("uniapp/pages/user/assistant.vue"),
    read("uniapp/pages/user/activity-map.vue"),
    read("uniapp/pages/user/messages.vue"),
    read("uniapp/pages/guide/hall.vue"),
    read("uniapp/pages/guide/order-detail.vue"),
    read("uniapp/pages/guide/service.vue"),
    read("uniapp/pages/merchant/orders.vue"),
    read("uniapp/pages/merchant/service-complete.vue"),
  ].forEach((source, index) => {
    assertNoGenericFeedback(source, `移动端核心模板 ${index}`);
  });

  userVisualReferences.forEach((ref) => {
    const source = fs.readFileSync(path.join(uniRoot, `${ref.route}.vue`), "utf8");
    const pageId = pageIdOf(ref);
    const isCustomCore = ["home", "assistant", "activity-map", "emergency", "order-create", "orders", "messages", "profile", "activity-signup", "activity-calendar", "shop"].includes(pageId);
    assert(isCustomCore || source.includes("YlUserReferencePage"), `用户端 ${ref.screenNo} ${pageId} 必须挂载参考页模板或核心闭环页`);
  });

  const shop = read("uniapp/pages/user/shop.vue");
  ["商品浏览", "购物车", "提交结算", "api.shopCheckout", "providerType: \"merchant\"", "items"].forEach((needle) => {
    assert(shop.includes(needle), `用户端 39 shop 核心闭环缺少 ${needle}`);
  });

  guideVisualReferences.forEach((ref) => {
    const source = fs.readFileSync(path.join(uniRoot, `${ref.route}.vue`), "utf8");
    const pageId = pageIdOf(ref);
    const isCustomCore = ["hall", "order-detail", "service", "exception", "income"].includes(pageId);
    assert(isCustomCore || source.includes("YlRoleReferencePage"), `向导端 ${ref.screenNo} ${pageId} 必须挂载参考页模板或核心闭环页`);
  });

  merchantVisualReferences.forEach((ref) => {
    const source = fs.readFileSync(path.join(uniRoot, `${ref.route}.vue`), "utf8");
    const pageId = pageIdOf(ref);
    const isCustomCore = ["workbench", "services", "orders", "quote", "service-complete", "reviews"].includes(pageId);
    assert(isCustomCore || source.includes("YlRoleReferencePage"), `商户端 ${ref.screenNo} ${pageId} 必须挂载参考页模板或核心闭环页`);
  });

  ["性别", "年龄", "onShareAppMessage", "openMapLocation", "api.askAi", "api.joinActivity"].forEach((needle) => {
    assert(activitySignup.includes(needle), `用户端 08 活动报名缺少可用功能 ${needle}`);
  });

  ["changeMonth", "selectDate", "toggleReminder", "goSignup", "api.recordUiAction", "活动提醒"].forEach((needle) => {
    assert(activityCalendar.includes(needle), `用户端 19 活动日历缺少可用功能 ${needle}`);
  });

  ["yl-page__safe", "max-width: 750rpx", "env(safe-area-inset-bottom)"].forEach((needle) => {
    assert(pageShell.includes(needle), `页面壳缺少移动端安全区基线 ${needle}`);
  });

  ["border-radius: 32rpx", "rgba(255, 255, 255, 0.98)"].forEach((needle) => {
    assert(card.includes(needle), `卡片组件缺少参考图风格基线 ${needle}`);
  });

  ["min-height: 78rpx", "border-radius: 22rpx"].forEach((needle) => {
    assert(button.includes(needle), `按钮组件缺少参考图风格基线 ${needle}`);
  });

  const adminApp = read("apps/admin/app.js");
  [
    "用户健康",
    "向导审核",
    "商户审核",
    "服务评价",
    "活动内容",
    "订单派单",
    "异常处理",
    "数据闭环",
    "系统验收",
    "api.adminUsers",
    "api.adminHealthRecords",
    "api.auditGuide",
    "api.auditMerchant",
    "api.createAdminActivity",
    "api.updateAdminHomeContent",
    "api.dispatchTask",
    "api.handleAlert",
    "api.resetDemoData",
  ].forEach((needle) => {
    assert(adminApp.includes(needle), `管理后台真实联动缺少 ${needle}`);
  });

  const ledger = read("docs/visual-restoration-ledger.md");
  [
    "用户端 01-40",
    "向导端 01-46",
    "商户端 01-70",
    "管理后台 01-53",
    "scripts/visual-reference-mapping-test.js",
  ].forEach((needle) => {
    assert(ledger.includes(needle), `逐页视觉还原清单缺少 ${needle}`);
  });

  console.log("visual reference mapping ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
