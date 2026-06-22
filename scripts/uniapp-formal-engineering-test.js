const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const uniRoot = path.join(root, "uniapp");

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(uniRoot, file), "utf8"));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

const pkg = readJson("package.json");
const manifest = readJson("manifest.json");
const pages = readJson("pages.json");
const pagePaths = pages.pages.map((item) => item.path);

assert(pkg.scripts["dev:mp-weixin"], "uni-app 工程必须提供微信小程序开发脚本");
assert(pkg.scripts["build:mp-weixin"], "uni-app 工程必须提供微信小程序构建脚本");
assert(pkg.scripts["build:app"], "uni-app 工程必须提供 iOS/Android App 构建脚本");
assert(!pkg.scripts["dev:h5"] && !pkg.scripts["build:h5"], "正式移动工程不能保留 H5 构建脚本");
assert(!pkg.dependencies["@dcloudio/uni-h5"], "正式移动工程不能依赖 uni-h5");

assert(manifest["mp-weixin"], "manifest 必须配置微信小程序");
assert(manifest["app-plus"], "manifest 必须配置 App 端");
assert(!manifest.h5, "manifest 不能保留 H5 端配置");
assert(manifest["mp-weixin"].permission?.["scope.userLocation"], "微信小程序必须声明定位权限");
assert(manifest["app-plus"].modules?.Geolocation, "App 端必须启用定位模块");

const requiredPages = [
  "pages/auth/login",
  "pages/role/select",
  "pages/user/home",
  "pages/user/assistant",
  "pages/user/activity-map",
  "pages/user/emergency",
  "pages/user/order-create",
  "pages/user/orders",
  "pages/user/messages",
  "pages/user/profile",
  "pages/guide/hall",
  "pages/guide/order-detail",
  "pages/guide/service",
  "pages/guide/exception",
  "pages/guide/income",
  "pages/merchant/workbench",
  "pages/merchant/services",
  "pages/merchant/orders",
  "pages/merchant/quote",
  "pages/merchant/service-complete",
  "pages/merchant/reviews",
];

const requiredUserReferencePages = [
  "pages/user/devices",
  "pages/user/assistant",
  "pages/user/guide",
  "pages/user/emergency",
  "pages/user/robot",
  "pages/user/activity-map",
  "pages/user/home",
  "pages/user/activity-signup",
  "pages/user/messages",
  "pages/user/profile",
  "pages/user/login",
  "pages/user/city",
  "pages/user/orders",
  "pages/user/order-detail",
  "pages/user/review",
  "pages/user/order-submit",
  "pages/user/guide-detail",
  "pages/user/service-records",
  "pages/user/activity-calendar",
  "pages/user/activity-records",
  "pages/user/device-management",
  "pages/user/band-settings",
  "pages/user/robot-settings",
  "pages/user/sos-records",
  "pages/user/contacts",
  "pages/user/health-record",
  "pages/user/personal",
  "pages/user/family",
  "pages/user/settings",
  "pages/user/destinations",
  "pages/user/destination-detail",
  "pages/user/health-services",
  "pages/user/policies",
  "pages/user/policy-detail",
  "pages/user/community",
  "pages/user/checkin",
  "pages/user/food",
  "pages/user/transport",
  "pages/user/shop",
  "pages/user/volunteer",
];

const requiredGuideReferencePages = [
  "pages/guide/hall",
  "pages/guide/order-detail",
  "pages/guide/orders",
  "pages/guide/service",
  "pages/guide/exception",
  "pages/guide/messages",
  "pages/guide/profile",
  "pages/guide/online",
  "pages/guide/filters",
  "pages/guide/accepted-pending-departure",
  "pages/guide/pending-confirm-detail",
  "pages/guide/canceled-order-detail",
  "pages/guide/customer-profile",
  "pages/guide/home",
  "pages/guide/login",
  "pages/guide/apply",
  "pages/guide/audit-status",
  "pages/guide/income",
  "pages/guide/wallet",
  "pages/guide/withdraw",
  "pages/guide/settlements",
  "pages/guide/reviews",
  "pages/guide/review-detail",
  "pages/guide/service-area",
  "pages/guide/service-types",
  "pages/guide/reminder-settings",
  "pages/guide/navigation",
  "pages/guide/cancel-order",
  "pages/guide/complete-report",
  "pages/guide/completed-order-detail",
  "pages/guide/system-notices",
  "pages/guide/order-messages",
  "pages/guide/customer-messages",
  "pages/guide/support",
  "pages/guide/security",
  "pages/guide/schedule",
  "pages/guide/schedule-edit",
  "pages/guide/skills",
  "pages/guide/statistics",
  "pages/guide/personal",
  "pages/guide/settings",
  "pages/guide/help",
  "pages/guide/service-rules",
  "pages/guide/feedback",
  "pages/guide/scan",
  "pages/guide/verify",
];

const requiredMerchantReferencePages = [
  "pages/merchant/messages",
  "pages/merchant/profile",
  "pages/merchant/qualification",
  "pages/merchant/wallet-withdraw",
  "pages/merchant/settlement-detail",
  "pages/merchant/invoice-apply",
  "pages/merchant/security",
  "pages/merchant/settings",
  "pages/merchant/support",
  "pages/merchant/exception",
  "pages/merchant/service-preview",
  "pages/merchant/aftersales-detail",
  "pages/merchant/invoice",
  "pages/merchant/order-detail",
  "pages/merchant/profile-home",
  "pages/merchant/data-home",
  "pages/merchant/reviews",
  "pages/merchant/service-complete",
  "pages/merchant/services",
  "pages/merchant/orders",
  "pages/merchant/onboarding-qualification",
  "pages/merchant/service-create",
  "pages/merchant/quote",
  "pages/merchant/workbench",
  "pages/merchant/message-detail",
  "pages/merchant/onboarding-basic",
  "pages/merchant/onboarding-license",
  "pages/merchant/onboarding-service-types",
  "pages/merchant/onboarding-submit",
  "pages/merchant/service-edit",
  "pages/merchant/service-category",
  "pages/merchant/booking-time",
  "pages/merchant/service-area",
  "pages/merchant/booking-confirm",
  "pages/merchant/booking-reject",
  "pages/merchant/order-reschedule",
  "pages/merchant/quote-edit",
  "pages/merchant/staff-assign",
  "pages/merchant/complete-success",
  "pages/merchant/aftersales-records",
  "pages/merchant/review-reply",
  "pages/merchant/settlements",
  "pages/merchant/transactions",
  "pages/merchant/withdraw",
  "pages/merchant/bank-card",
  "pages/merchant/invoice-title",
  "pages/merchant/invoice-orders",
  "pages/merchant/invoice-detail",
  "pages/merchant/ticket-create",
  "pages/merchant/tickets",
  "pages/merchant/online-support",
  "pages/merchant/faq-detail",
  "pages/merchant/merchant-edit",
  "pages/merchant/business-hours",
  "pages/merchant/service-city",
  "pages/merchant/store-photos",
  "pages/merchant/qualification-update",
  "pages/merchant/qualification-history",
  "pages/merchant/phone-change",
  "pages/merchant/password-change",
  "pages/merchant/payment-password",
  "pages/merchant/devices",
  "pages/merchant/privacy",
  "pages/merchant/permissions",
  "pages/merchant/display",
  "pages/merchant/rules",
  "pages/merchant/login",
  "pages/merchant/forgot-password",
  "pages/merchant/onboarding-review",
  "pages/merchant/onboarding-rejected",
];

const allRequiredPages = Array.from(new Set([
  ...requiredPages,
  ...requiredUserReferencePages,
  ...requiredGuideReferencePages,
  ...requiredMerchantReferencePages,
]));

allRequiredPages.forEach((page) => {
  assert(pagePaths.includes(page), `pages.json 缺少 ${page}`);
  assert(exists(`uniapp/${page}.vue`), `缺少页面文件 uniapp/${page}.vue`);
});

assert.strictEqual(requiredUserReferencePages.length, 40, "用户端参考页清单必须覆盖 01-40");
assert.strictEqual(requiredGuideReferencePages.length, 46, "向导端参考页清单必须覆盖 01-46");
assert.strictEqual(requiredMerchantReferencePages.length, 70, "商户端参考页清单必须覆盖 01-70");

const userReferenceSource = read("uniapp/common/user-pages.js");
[
  "destinations",
  "destination-detail",
  "activity-calendar",
  "community",
  "checkin",
  "food",
  "transport",
  "volunteer",
  "devices",
  "robot",
  "device-management",
  "band-settings",
  "robot-settings",
  "guide",
  "guide-detail",
  "order-submit",
  "order-detail",
  "review",
  "service-records",
  "activity-signup",
  "activity-records",
  "sos-records",
  "contacts",
  "health-record",
  "health-services",
  "policies",
  "policy-detail",
  "shop",
  "login",
  "city",
  "personal",
  "family",
  "settings",
].forEach((pageId) => {
  assert(
    userReferenceSource.includes(`${pageId}:`) || userReferenceSource.includes(`"${pageId}":`),
    `用户端参考页配置缺少 ${pageId}`,
  );
});

const roleReferenceSource = read("uniapp/common/role-reference-pages.js");
[
  ...requiredGuideReferencePages.map((item) => item.replace("pages/guide/", "")),
  ...requiredMerchantReferencePages.map((item) => item.replace("pages/merchant/", "")),
].forEach((pageId) => {
  assert(roleReferenceSource.includes(`"${pageId}"`), `角色端参考页配置缺少 ${pageId}`);
});

[
  "guideDashboard",
  "guideIncome",
  "claimGuideTask",
  "taskAction",
  "reportGuideException",
  "setGuideOnline",
  "merchantDashboard",
  "createMerchantService",
  "merchantOrderAction",
  "merchantReviews",
  "reportMerchantException",
].forEach((needle) => {
  assert(read("uniapp/components/YlRoleReferencePage.vue").includes(needle), `角色参考页动作缺少 ${needle}`);
});

const roleReferenceComponentSource = read("uniapp/components/YlRoleReferencePage.vue");
[
  "roleRoutePrefix",
  "roleDisplayName",
  "isSameRoleRoute",
  "safeNavigate",
  "跨端页面已拦截",
  "openTool(item)",
  "openRow(item)",
  "action.type === \"navigate\"",
].forEach((needle) => {
  assert(roleReferenceComponentSource.includes(needle), `角色参考页缺少同端路由保护 ${needle}`);
});

const apiSource = read("uniapp/common/api.js");
[
  "uni.request",
  "/api/auth/login",
  "/api/user/home",
  "/api/user/profile",
  "/api/elder/profile",
  "updateUserProfile",
  "updateElderProfile",
  "/api/ai/chat",
  "/api/activities/map",
  "/api/alerts/sos",
  "/api/orders",
  "shopCheckout",
  "providerType: \"merchant\"",
  "/api/messages",
  "/api/guide/dashboard",
  "guideDashboard: (params = {})",
  "withQuery(\"/api/guide/dashboard\", params)",
  "/api/guide/tasks/claim-next",
  "/api/tasks/${id}/${action}",
  "/api/guide/exception",
  "/api/guide/income",
  "/api/merchant/dashboard",
  "/api/merchant/services",
  "/api/merchant/orders",
  "/api/merchant/orders/${id}/${action}",
  "/api/merchant/reviews",
].forEach((needle) => {
  assert(apiSource.includes(needle), `API client 缺少 ${needle}`);
});

const guideHallSource = read("uniapp/pages/guide/hall.vue");
[
  "服务类型筛选",
  "serviceTypes",
  "activeServiceType",
  "selectServiceType",
  "serviceTypeCount",
  "matchesServiceType",
  "taskCards",
  "api.claimGuideTask(payload)",
  "serviceType: activeServiceType.value",
  "陪伴就医",
  "导游游览",
  "护工护理",
  "接送出行",
  "帮办代办",
  "生活陪伴",
].forEach((needle) => {
  assert(guideHallSource.includes(needle), `向导端接单大厅缺少服务类型筛选能力 ${needle}`);
});

const profileSource = read("uniapp/pages/user/profile.vue");
[
  "保存资料",
  "恢复服务端资料",
  "v-model=\"form.nickname\"",
  "v-model=\"form.phone\"",
  "v-model=\"form.name\"",
  "v-model=\"form.age\"",
  "v-model=\"form.city\"",
  "v-model=\"form.address\"",
  "api.updateUserProfile",
  "api.updateElderProfile",
  "toastSuccess(\"资料已保存\")",
].forEach((needle) => {
  assert(profileSource.includes(needle), `用户端个人资料缺少 ${needle}`);
});

const shopSource = read("uniapp/pages/user/shop.vue");
assert(!shopSource.includes("<YlUserReferencePage page-id=\"shop\" />"), "用户端优选商城不能只是参考页空壳");
[
  "商品浏览",
  "购物车",
  "提交结算",
  "products",
  "filteredProducts",
  "cartItems",
  "addToCart",
  "increaseQuantity",
  "decreaseQuantity",
  "removeFromCart",
  "api.shopCheckout",
  "serviceType: \"优选商城商品结算\"",
  "providerType: \"merchant\"",
  "source: \"用户端优选商城\"",
  "items",
  "amount: cartTotal.value",
].forEach((needle) => {
  assert(shopSource.includes(needle), `用户端优选商城缺少 ${needle}`);
});

const rolesSource = read("uniapp/common/roles.js");
["elder", "guide", "merchant", "小程序/App 内"].forEach((needle) => {
  assert(rolesSource.includes(needle), `角色配置缺少 ${needle}`);
});

const nativeSource = read("uniapp/common/native.js");
["uni.getLocation", "uni.openLocation", "uni.makePhoneCall"].forEach((needle) => {
  assert(nativeSource.includes(needle), `原生能力封装缺少 ${needle}`);
});
["startSpeechRecognition", "checkSpeechRecognitionSupport", "SpeechRecognition", "uni.getRecorderManager"].forEach((needle) => {
  assert(nativeSource.includes(needle), `语音识别封装缺少 ${needle}`);
});
assert(nativeSource.indexOf("let settled = false;") < nativeSource.indexOf("// #ifdef H5"), "语音识别 settled 状态必须定义在条件编译外，避免小程序/App 运行时报未定义");

const scannedFiles = [];
function collect(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".npm-cache", "unpackage", "dist"].includes(entry.name)) return;
      return collect(absolute);
    }
    if (entry.name === "package-lock.json") return;
    scannedFiles.push(absolute);
  });
}
collect(uniRoot);
scannedFiles.forEach((absolute) => {
  const relative = path.relative(root, absolute);
  const source = fs.readFileSync(absolute, "utf8");
  assert(!/dev:h5|build:h5|uni-h5|"h5"\s*:/.test(source), `${relative} 不能包含 H5 构建目标`);
  assert(!/降级反馈|验收预览/.test(source), `${relative} 不能包含非需求书交付口径`);
});

console.log("uni-app formal engineering ok");
