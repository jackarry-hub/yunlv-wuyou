const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");

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
    } catch (_) {
      await delay(150);
    }
  }
  throw new Error(`server did not start.\n${output()}`);
}

async function json(baseUrl, route, options = {}) {
  const headers = { Accept: "application/json", "Content-Type": "application/json", ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  }
  return payload.data;
}

async function text(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route}`);
  assert.equal(response.status, 200, `${route} should return 200`);
  return response.text();
}

async function login(baseUrl, role, phone) {
  return json(baseUrl, "/api/auth/login", { method: "POST", body: { role, phone } });
}

function uniqueSuffix() {
  return String(Date.now()).slice(-6);
}

async function assertSharedEntrypoints(baseUrl) {
  const [userHtml, guideHtml, merchantHtml, adminHtml, adminApp] = await Promise.all([
    text(baseUrl, "/user/"),
    text(baseUrl, "/guide/"),
    text(baseUrl, "/merchant/"),
    text(baseUrl, "/admin/"),
    text(baseUrl, "/admin/app.js"),
  ]);
  for (const [route, html] of [["/user/", userHtml], ["/guide/", guideHtml], ["/merchant/", merchantHtml]]) {
    assert(html.includes("/shared/business-bridge.js"), `${route} must load the shared business bridge`);
  }
  assert(adminHtml.includes("管理后台"), "admin endpoint should render");
  assert(adminApp.includes("/api/admin/"), "admin endpoint must use backend admin APIs");
}

async function createSubjects(baseUrl, adminToken, suffix) {
  return json(baseUrl, "/api/admin/demo/create-subjects", {
    method: "POST",
    token: adminToken,
    body: {
      suffix,
      elderName: `最低交付老人${suffix}`,
      familyName: `最低交付家属${suffix}`,
      guideName: `最低交付向导${suffix}`,
      merchantName: `最低交付商户${suffix}`,
      merchantType: "康养护理",
      serviceTitle: `最低交付护理服务${suffix}`,
      serviceCategory: "康养护理",
    },
  });
}

async function approveSubjects(baseUrl, adminToken, subjects) {
  const guide = await json(baseUrl, `/api/admin/guides/${subjects.guide.id}/audit`, {
    method: "POST",
    token: adminToken,
    body: { decision: "通过审核" },
  });
  const merchant = await json(baseUrl, `/api/admin/merchants/${subjects.merchant.id}/audit`, {
    method: "POST",
    token: adminToken,
    body: { decision: "通过入驻" },
  });
  const service = await json(baseUrl, `/api/admin/services/${subjects.merchantService.id}/status`, {
    method: "POST",
    token: adminToken,
    body: { status: "上架" },
  });
  assert.equal(guide.status, "已认证", "admin should approve guide");
  assert.equal(merchant.status, "已通过", "admin should approve merchant");
  assert.equal(service.status, "上架", "admin should publish merchant seed service");
}

async function assertUserMinimum(baseUrl, tokens, subjects, suffix) {
  const nickname = `最低交付资料${suffix}`;
  const profile = await json(baseUrl, "/api/user/profile", {
    method: "PUT",
    token: tokens.elder,
    body: { user: { nickname, status: "正常" } },
  });
  assert.equal(profile.id, subjects.user.id, "profile update should target logged-in elder");
  assert.equal(profile.nickname, nickname, "profile nickname should persist");
  const profileAfter = await json(baseUrl, "/api/user/profile", { token: tokens.elder });
  assert.equal(profileAfter.user.id, subjects.user.id, "profile read should return logged-in elder");
  assert.equal(profileAfter.user.nickname, nickname, "profile read should include updated nickname");
  const adminUsers = await json(baseUrl, "/api/admin/users", { token: tokens.admin });
  assert(adminUsers.users.some((user) => user.id === subjects.user.id && user.nickname === nickname), "admin should see updated elder profile");

  const ai = await json(baseUrl, "/api/ai/chat", {
    method: "POST",
    token: tokens.elder,
    body: { question: `最低交付 AI 管家 ${suffix}：推荐旅居管家和人工向导服务` },
  });
  assert(ai.answer && ai.intent, "AI steward should answer");
  const aiHistory = await json(baseUrl, "/api/ai/history", { token: tokens.elder });
  assert(aiHistory.some((item) => item.id === ai.id), "AI steward history should persist");

  const shopOrder = await json(baseUrl, "/api/orders", {
    method: "POST",
    token: tokens.elder,
    body: {
      userId: subjects.user.id,
      elderName: nickname,
      serviceType: "优选商城商品结算",
      providerType: "merchant",
      providerId: subjects.merchant.id,
      amount: 318,
      phone: subjects.user.phone,
      location: "昆明市五华区最低交付验收点",
      source: "最低交付优选商城",
      note: "最低交付商城结算：智能血压计x1、防滑手杖x1",
      items: [
        { name: "智能血压计", price: 199, quantity: 1 },
        { name: "防滑手杖", price: 119, quantity: 1 },
      ],
    },
  });
  const merchantOrders = await json(baseUrl, `/api/merchant/orders?merchantId=${subjects.merchant.id}`, { token: tokens.merchant });
  assert(merchantOrders.some((order) => order.id === shopOrder.id && order.items?.length === 2), "shop checkout should be visible to merchant");

  const sos = await json(baseUrl, "/api/alerts/sos", {
    method: "POST",
    token: tokens.elder,
    body: { location: "昆明市五华区最低交付验收点", description: `最低交付 SOS ${suffix}` },
  });
  const adminAlerts = await json(baseUrl, "/api/admin/alerts", { token: tokens.admin });
  assert(adminAlerts.some((alert) => alert.id === sos.id), "SOS should be visible in admin alerts");

  return { nickname, shopOrder, sos };
}

async function assertGuideMinimum(baseUrl, tokens, subjects, elderName) {
  const requirements = await json(baseUrl, "/api/guide/order-requirements", { token: tokens.elder });
  assert(requirements.categories?.some((item) => item.category === "陪伴就医"), "guide requirements should expose categories");
  await json(baseUrl, "/api/guide/online", {
    method: "POST",
    token: tokens.guide,
    body: { guideId: subjects.guide.id, onlineStatus: "在线", currentStatus: "空闲中" },
  });
  const guideOrder = await json(baseUrl, "/api/orders", {
    method: "POST",
    token: tokens.elder,
    body: {
      userId: subjects.user.id,
      elderName,
      serviceType: "陪伴就医",
      providerType: "guide",
      amount: 120,
      time: "2026-06-15 09:30",
      location: "昆明市第一人民医院",
      serviceTime: "2026-06-15 09:30",
      hospital: "昆明市第一人民医院",
      elderInfo: `${elderName}，行动稍慢，需要陪同挂号取药`,
      remark: "最低交付人工向导入口表单字段完整提交",
      source: "最低交付人工向导入口",
      strictRequirements: true,
    },
  });
  const claimed = await json(baseUrl, "/api/guide/tasks/claim-next", {
    method: "POST",
    token: tokens.guide,
    body: { guideId: subjects.guide.id, orderId: guideOrder.id, serviceType: "陪伴就医" },
  });
  assert.equal(claimed.order.id, guideOrder.id, "guide hall should claim the user guide order");
  assert.equal(claimed.task.status, "已接单", "guide claim should move task to accepted");
  const dashboard = await json(baseUrl, `/api/guide/dashboard?guideId=${subjects.guide.id}`, { token: tokens.guide });
  assert(dashboard.tasks.some((task) => task.id === claimed.task.id), "guide dashboard should include claimed task");
  const detail = await json(baseUrl, `/api/orders/${guideOrder.id}`, { token: tokens.guide });
  assert.equal(detail.id, guideOrder.id, "guide should be able to view order detail");
  await json(baseUrl, `/api/tasks/${claimed.task.id}/start`, { method: "POST", token: tokens.guide, body: {} });
  const completed = await json(baseUrl, `/api/tasks/${claimed.task.id}/complete`, {
    method: "POST",
    token: tokens.guide,
    body: { evidence: "minimum-delivery-flow-test" },
  });
  assert.equal(completed.order.status, "待确认", "guide completion should await user confirmation");
  return { guideOrder, guideTask: claimed.task };
}

async function assertMerchantMinimum(baseUrl, tokens, subjects, elderName, suffix) {
  const categories = await json(baseUrl, "/api/merchant/service-categories", { token: tokens.merchant });
  assert(Array.isArray(categories.categories) && categories.categories.length > 0, "merchant should receive service categories");
  const service = await json(baseUrl, "/api/merchant/services", {
    method: "POST",
    token: tokens.merchant,
    body: {
      providerId: subjects.merchant.id,
      title: `最低交付营养餐配送${suffix}`,
      category: "餐饮与本地美食",
      price: 88,
      description: "最低交付商户服务内容验收",
    },
  });
  const published = await json(baseUrl, `/api/admin/services/${service.id}/status`, {
    method: "POST",
    token: tokens.admin,
    body: { status: "上架" },
  });
  assert.equal(published.status, "上架", "admin should publish merchant-created service");
  const merchantServices = await json(baseUrl, `/api/merchant/services?merchantId=${subjects.merchant.id}`, { token: tokens.merchant });
  assert(merchantServices.some((item) => item.id === service.id && item.category === "餐饮与本地美食"), "merchant should view service content by type");

  const merchantOrder = await json(baseUrl, "/api/orders", {
    method: "POST",
    token: tokens.elder,
    body: {
      userId: subjects.user.id,
      elderName,
      serviceType: service.title,
      providerType: "merchant",
      providerId: subjects.merchant.id,
      amount: 88,
      time: "2026-06-15 12:00",
      location: "昆明市五华区最低交付验收点",
      source: "最低交付商户服务预约",
    },
  });
  await json(baseUrl, "/api/tasks/dispatch", {
    method: "POST",
    token: tokens.admin,
    body: { orderId: merchantOrder.id, assigneeType: "merchant", assigneeId: subjects.merchant.id },
  });
  await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/quote`, {
    method: "POST",
    token: tokens.merchant,
    body: { merchantId: subjects.merchant.id, amount: 98, plan: "最低交付报价方案" },
  });
  await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/confirm`, {
    method: "POST",
    token: tokens.merchant,
    body: { merchantId: subjects.merchant.id },
  });
  const started = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/start`, {
    method: "POST",
    token: tokens.merchant,
    body: { merchantId: subjects.merchant.id },
  });
  assert.equal(started.status, "服务中", "merchant should start service");
  const completed = await json(baseUrl, `/api/merchant/orders/${merchantOrder.id}/complete`, {
    method: "POST",
    token: tokens.merchant,
    body: { merchantId: subjects.merchant.id },
  });
  assert.equal(completed.status, "待确认", "merchant should complete and await user confirmation");
  return { service, merchantOrder };
}

async function assertAdminMinimum(baseUrl, tokens, subjects, ids, suffix) {
  const content = await json(baseUrl, "/api/admin/content/home", { token: tokens.admin });
  assert(content.banner?.title, "admin should read home content");
  const nextTitle = `最低交付内容${suffix}`;
  const updatedContent = await json(baseUrl, "/api/admin/content/home", {
    method: "PUT",
    token: tokens.admin,
    body: { banner: { title: nextTitle, slogan: "最低交付后台内容上传验收", status: "已发布" } },
  });
  assert.equal(updatedContent.config.banner.title, nextTitle, "admin should upload/update business content");
  const activity = await json(baseUrl, "/api/admin/activities", {
    method: "POST",
    token: tokens.admin,
    body: { title: `最低交付活动${suffix}`, category: "文化体验", location: "昆明市五华区", quota: 20 },
  });
  assert(activity.id, "admin should create activity content");

  const [orders, alerts, guides, merchants, services, dataLoop] = await Promise.all([
    json(baseUrl, "/api/admin/orders", { token: tokens.admin }),
    json(baseUrl, "/api/admin/alerts", { token: tokens.admin }),
    json(baseUrl, "/api/admin/guides", { token: tokens.admin }),
    json(baseUrl, "/api/admin/merchants", { token: tokens.admin }),
    json(baseUrl, "/api/admin/services", { token: tokens.admin }),
    json(baseUrl, "/api/admin/data-loop", { token: tokens.admin }),
  ]);
  assert(orders.some((order) => [ids.guideOrder.id, ids.merchantOrder.id, ids.shopOrder.id].includes(order.id)), "admin should view created orders");
  assert(alerts.some((alert) => alert.id === ids.sos.id), "admin should view SOS");
  assert(guides.some((guide) => guide.id === subjects.guide.id), "admin should view guide");
  assert(merchants.some((merchant) => merchant.id === subjects.merchant.id), "admin should view merchant");
  assert(services.some((service) => service.id === ids.service.id), "admin should view uploaded merchant service");
  assert(dataLoop.summary.orders >= 3 && dataLoop.summary.guides >= 1 && dataLoop.summary.merchants >= 1, "admin data loop should include shared business data");
  const handledSos = await json(baseUrl, `/api/alerts/${ids.sos.id}/handle`, {
    method: "POST",
    token: tokens.admin,
    body: { result: "最低交付后台已处理 SOS" },
  });
  assert.equal(handledSos.status, "已处理", "admin should manage SOS status");
}

async function assertMinimumDelivery(baseUrl) {
  await assertSharedEntrypoints(baseUrl);
  const suffix = uniqueSuffix();
  const admin = await login(baseUrl, "admin");
  const subjects = await createSubjects(baseUrl, admin.token, suffix);
  const sessions = {
    admin,
    elder: await login(baseUrl, "elder", subjects.user.phone),
    family: await login(baseUrl, "family", subjects.familyUser.phone),
    guide: await login(baseUrl, "guide", subjects.guideUser.phone),
    merchant: await login(baseUrl, "merchant", subjects.merchantUser.phone),
  };
  const tokens = Object.fromEntries(Object.entries(sessions).map(([key, value]) => [key, value.token]));
  assert.equal(sessions.elder.user.id, subjects.user.id, "created elder should login by phone");
  assert.equal(sessions.guide.user.id, subjects.guideUser.id, "created guide should login by phone");
  assert.equal(sessions.merchant.user.id, subjects.merchantUser.id, "created merchant should login by phone");

  await approveSubjects(baseUrl, tokens.admin, subjects);
  const userResult = await assertUserMinimum(baseUrl, tokens, subjects, suffix);
  const guideResult = await assertGuideMinimum(baseUrl, tokens, subjects, userResult.nickname);
  const merchantResult = await assertMerchantMinimum(baseUrl, tokens, subjects, userResult.nickname, suffix);
  await assertAdminMinimum(baseUrl, tokens, subjects, {
    guideOrder: guideResult.guideOrder,
    merchantOrder: merchantResult.merchantOrder,
    shopOrder: userResult.shopOrder,
    sos: userResult.sos,
    service: merchantResult.service,
  }, suffix);

  return {
    suffix,
    subjects,
    guideOrder: guideResult.guideOrder.id,
    merchantOrder: merchantResult.merchantOrder.id,
    shopOrder: userResult.shopOrder.id,
    sos: userResult.sos.id,
    service: merchantResult.service.id,
  };
}

async function runAgainst(baseUrl) {
  await waitForServer(baseUrl, () => "");
  const result = await assertMinimumDelivery(baseUrl);
  console.log(`minimum delivery flow ok: ${baseUrl}`);
  console.log(JSON.stringify({
    suffix: result.suffix,
    user: result.subjects.user.id,
    guide: result.subjects.guide.id,
    merchant: result.subjects.merchant.id,
    guideOrder: result.guideOrder,
    merchantOrder: result.merchantOrder,
    shopOrder: result.shopOrder,
    sos: result.sos,
    service: result.service,
  }, null, 2));
}

async function main() {
  if (process.env.YUNLV_TEST_BASE_URL) {
    await runAgainst(process.env.YUNLV_TEST_BASE_URL.replace(/\/$/, ""));
    return;
  }

  const port = await freePort();
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-minimum-delivery-"));
  const env = {
    ...process.env,
    PORT: String(port),
    YUNLV_RUNTIME_DIR: runtimeDir,
    YUNLV_SKIP_DOTENV: "1",
  };
  const logs = [];
  const child = spawn(process.execPath, [path.join(root, "server.js")], { cwd: root, env });
  child.stdout.on("data", (chunk) => logs.push(chunk.toString()));
  child.stderr.on("data", (chunk) => logs.push(chunk.toString()));
  try {
    await runAgainst(`http://127.0.0.1:${port}`);
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
