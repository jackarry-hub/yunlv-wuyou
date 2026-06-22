const assert = require("assert");
const { spawn, spawnSync } = require("child_process");
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
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {
      await delay(120);
    }
  }
  throw new Error(`server did not start\n${output()}`);
}

async function json(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json", ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  const appSource = fs.readFileSync(path.join(root, "apps/admin/app.js"), "utf8");
  const referenceAdminSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js"), "utf8");
  const referenceAdminHtml = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "index.html"), "utf8");
  const syntax = spawnSync(process.execPath, ["--input-type=module", "--check"], {
    input: appSource,
    encoding: "utf8",
  });
  assert.equal(syntax.status, 0, syntax.stderr || syntax.stdout);
  assert(!appSource.includes("tab: tabFromHash()"), "后台 state 初始化不能调用依赖 tabs 的函数，否则浏览器会因初始化顺序空白");

  [
    "api.adminUsers",
    "api.adminHealthRecords",
    "api.adminGuides",
    "api.auditGuide",
    "api.adminMerchants",
    "api.auditMerchant",
    "api.adminServices",
    "api.setAdminServiceStatus",
    "api.adminActivities",
    "api.createAdminActivity",
    "api.setAdminActivityStatus",
    "api.adminHomeContent",
    "api.updateAdminHomeContent",
    "api.pendingDispatch",
    "api.dispatchTask",
    "api.handleAlert",
    "api.adminDataLoop",
    "api.uiActions",
    "api.resetDemoData",
  ].forEach((needle) => {
    assert(appSource.includes(needle), `管理后台前端缺少真实联动：${needle}`);
  });

  [
    "data-admin-map",
    "loadAdminAmap",
    "handleAdminMapAction",
    "data-admin-map-point",
    "data-admin-map-city",
    "data-admin-map-action",
    "admin-config-ai-logo-20260622",
    "charts.serviceTrend",
    "orderTypeSegments",
    "data-route=\"${escapeHtml(route)}\"",
    "adminMessageState",
    "/api/messages?role=admin",
    "data-admin-account-toggle",
  ].forEach((needle) => {
    const source = needle === "admin-config-ai-logo-20260622" ? referenceAdminHtml : referenceAdminSource;
    assert(source.includes(needle), `管理后台高保真页面缺少真实地图接入：${needle}`);
  });
  assert(/actionMatches\(action,\s*\["新增"\]\)\s*&&\s*page\.group === "device"/.test(referenceAdminSource), "设备管理页“新增”必须进入设备绑定管理");
  assert(referenceAdminSource.includes("handleAdminDeviceManagementAction"), "设备管理页必须有设备专用动作处理器");
  assert(referenceAdminSource.includes("handleAdminDeviceDetailAction"), "设备详情页必须有设备专用动作处理器");
  assert(referenceAdminSource.includes("ensureAdminBannerData(page)"), "Banner 管理页必须先加载真实后台数据");
  assert(referenceAdminSource.includes('adminApi("/api/admin/content/home")'), "Banner 管理页必须读取首页 Banner 后台配置");
  assert(referenceAdminSource.includes('adminApi("/api/admin/orders")'), "Banner 管理页必须联动真实订单数据");
  assert(referenceAdminSource.includes('adminApi("/api/admin/activities")'), "Banner 管理页必须联动真实活动数据");
  assert(referenceAdminSource.includes('adminApi("/api/admin/ui-actions")'), "Banner 管理页必须联动真实点击/动作数据");
  assert(referenceAdminSource.includes("function persistAdminBannerDraft"), "Banner 管理页必须有真实保存逻辑");
  assert(referenceAdminSource.includes("function buildAdminBannerTrend"), "Banner 管理页必须生成真实趋势数据");
  assert(referenceAdminSource.includes("function buildAdminBannerRegionSegments"), "Banner 管理页必须生成真实地域分布数据");
  assert(!referenceAdminSource.includes('["eye", "转化率"'), "Banner 管理页不能保留转化率伪指标");
  assert(!referenceAdminSource.includes('miniTable("版本对比"'), "Banner 管理页不能保留版本对比占位表");
  assert(!referenceAdminSource.includes("已进入编辑状态"), "Banner 编辑不能继续用 toast 充当真实编辑");
  assert(!referenceAdminSource.includes("素材配置页"), "Banner 图片编辑不能继续跳到占位素材页");
  assert(referenceAdminSource.includes('infoPanel("设备信息"') && referenceAdminSource.includes('"编辑设备信息"'), "设备详情页设备信息编辑必须接入真实动作");
  assert(referenceAdminSource.includes('infoPanel("绑定信息"') && referenceAdminSource.includes('"编辑绑定信息"'), "设备详情页绑定信息编辑必须接入真实动作");
  assert(referenceAdminSource.includes('infoPanel("告警阈值设置"') && referenceAdminSource.includes('"编辑告警阈值"'), "设备详情页告警阈值编辑必须接入真实动作");
  assert(referenceAdminSource.includes('miniTable("设备操作日志"'), "设备详情页必须提供页面内真实设备操作日志");
  assert(referenceAdminSource.includes('miniTable("API回调日志"'), "设备详情页必须提供页面内真实 API 回调日志");
  assert(!referenceAdminSource.includes("<div class=\"map-zoom\"><button>+</button><button>−</button><button>◎</button></div>"), "后台地图不能保留无行为静态缩放按钮");
  assert(!referenceAdminSource.includes("订单数：1,286"), "后台服务趋势不能保留静态订单数");
  assert(!referenceAdminSource.includes("服务人数：932"), "后台服务趋势不能保留静态服务人数");
  assert(!referenceAdminSource.includes('data-route="login"><span class="avatar"'), "管理员头像点击不能直接跳登录页");
  assert(!referenceAdminSource.includes('<span class="badge-dot">8</span>'), "后台消息角标不能硬编码为 8");

  ["用户健康", "向导审核", "商户审核", "服务评价", "活动内容", "订单派单", "异常处理", "数据闭环", "系统验收"].forEach((label) => {
    assert(appSource.includes(label), `管理后台缺少栏目：${label}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-admin-console-"));
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
    const adminHtml = await fetch(`${baseUrl}/admin/`).then((response) => response.text());
    assert(adminHtml.includes("./app.js") || adminHtml.includes("/admin/app.js"), "/admin/ 必须挂载管理后台应用入口");
    assert(adminHtml.includes('id="app"'), "/admin/ 必须渲染管理后台应用容器");
    assert(adminHtml.includes("管理后台"), "/admin/ 必须使用云旅无忧管理后台 UI");

    const admin = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "admin" } });
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });

    const [
      dashboard,
      users,
      health,
      guides,
      merchants,
      services,
      reviews,
      activities,
      homeContent,
      dataLoop,
      dispatch,
      alerts,
      uiActions,
      functions,
      screens,
      priority,
      integrations,
    ] = await Promise.all([
      json(baseUrl, "/api/admin/dashboard", { token: admin.token }),
      json(baseUrl, "/api/admin/users", { token: admin.token }),
      json(baseUrl, "/api/admin/health-records", { token: admin.token }),
      json(baseUrl, "/api/admin/guides", { token: admin.token }),
      json(baseUrl, "/api/admin/merchants", { token: admin.token }),
      json(baseUrl, "/api/admin/services", { token: admin.token }),
      json(baseUrl, "/api/admin/reviews", { token: admin.token }),
      json(baseUrl, "/api/admin/activities", { token: admin.token }),
      json(baseUrl, "/api/admin/content/home", { token: admin.token }),
      json(baseUrl, "/api/admin/data-loop", { token: admin.token }),
      json(baseUrl, "/api/admin/dispatch/pending", { token: admin.token }),
      json(baseUrl, "/api/admin/alerts", { token: admin.token }),
      json(baseUrl, "/api/admin/ui-actions", { token: admin.token }),
      json(baseUrl, "/api/admin/functions/overview", { token: admin.token }),
      json(baseUrl, "/api/admin/screens", { token: admin.token }),
      json(baseUrl, "/api/admin/priority/status", { token: admin.token }),
      json(baseUrl, "/api/integrations/status", { token: admin.token }),
    ]);

    assert(dashboard.stats.elderCount > 0);
    assert.equal(dashboard.map.provider, "amap");
    assert(dashboard.map.points.length >= 6, "后台地图必须聚合订单、异常、资源等业务点位");
    assert(dashboard.map.cityStats.length >= 1, "后台地图必须返回城市聚合");
    assert(dashboard.map.points.every((point) => Number.isFinite(point.lng) && Number.isFinite(point.lat)), "后台地图点位必须包含真实经纬度");
    assert(dashboard.map.points.every((point) => point.route && point.sourceEndpoint), "后台地图点位必须能跳转到对应业务页并标注来源接口");
    assert(dashboard.map.points.some((point) => point.type === "alert"), "后台地图必须联动异常/SOS数据");
    assert(dashboard.map.points.some((point) => point.type === "order"), "后台地图必须联动订单数据");
    assert(dashboard.map.points.some((point) => ["guide", "merchant"].includes(point.type)), "后台地图必须联动向导或商户资源");
    assert.equal(dashboard.charts.serviceTrend.labels.length, 7, "后台服务趋势必须返回近7日标签");
    assert.equal(dashboard.charts.serviceTrend.orders.length, 7, "后台服务趋势必须返回近7日订单数");
    assert.equal(dashboard.charts.serviceTrend.serviceUsers.length, 7, "后台服务趋势必须返回近7日服务人数");
    assert(dashboard.charts.serviceTrend.orders.some((value) => value > 0), "后台服务趋势必须来自订单真实数据");
    const nonCancelledOrderTotal = Object.entries(dashboard.orderStatus).reduce((sum, [status, count]) => status === "已取消" ? sum : sum + count, 0);
    assert.equal(dashboard.charts.orderTypes.total, nonCancelledOrderTotal, "订单类型分布总数必须与订单状态统计一致");
    assert(dashboard.charts.orderTypes.segments.every((segment) => segment.count >= 0 && segment.route), "订单类型分布必须带真实计数和跳转路由");
    assert(dashboard.charts.healthStatus.total >= dashboard.stats.openAlerts, "健康状态分布必须覆盖未处理异常");
    assert(dashboard.charts.healthStatus.segments.every((segment) => segment.count >= 0 && segment.route), "健康状态分布必须带真实计数和跳转路由");
    const adminMessages = await json(baseUrl, "/api/messages?role=admin", { token: admin.token });
    assert.equal(adminMessages.filter((message) => !message.read).length, adminMessages.filter((message) => message.toRole === "admin" && !message.read).length, "后台消息角标必须以 admin 未读消息为准");
    assert(users.users.length >= 1);
    assert(health.records.length >= 1);
    assert(guides.length >= 1);
    assert(merchants.length >= 1);
    assert(services.length >= 1);
    assert(Array.isArray(reviews));
    assert(activities.activities.length >= 1);
    assert(homeContent.banner.configurable);
    assert(dataLoop.summary.orders >= 1);
    assert(Array.isArray(dispatch.pendingOrders));
    assert(Array.isArray(alerts));
    assert(Array.isArray(uiActions));
    assert(functions.moduleCount >= 12);
    assert(screens.screenCount >= 2);
    assert.equal(priority.P0.status, "已完成");
    assert(integrations.integrations.length >= 1);

    const guide = guides[0];
    const auditedGuide = await json(baseUrl, `/api/admin/guides/${guide.id}/audit`, {
      method: "POST",
      token: admin.token,
      body: { status: "已认证", note: "后台控制台测试通过" },
    });
    assert.equal(auditedGuide.status, "已认证");

    const merchant = merchants[0];
    const auditedMerchant = await json(baseUrl, `/api/admin/merchants/${merchant.id}/audit`, {
      method: "POST",
      token: admin.token,
      body: { status: "已通过", note: "后台控制台测试通过" },
    });
    assert.equal(auditedMerchant.status, "已通过");

    const service = services[0];
    const serviceStatus = await json(baseUrl, `/api/admin/services/${service.id}/status`, {
      method: "POST",
      token: admin.token,
      body: { status: "上架", note: "后台控制台测试上架" },
    });
    assert.equal(serviceStatus.status, "上架");

    const createdActivity = await json(baseUrl, "/api/admin/activities", {
      method: "POST",
      token: admin.token,
      body: { title: "后台控制台测试活动", category: "文化体验", quota: 20 },
    });
    assert.equal(createdActivity.status, "报名中");

    const offlineActivity = await json(baseUrl, `/api/admin/activities/${createdActivity.id}/status`, {
      method: "POST",
      token: admin.token,
      body: { status: "已下线" },
    });
    assert.equal(offlineActivity.status, "已下线");

    const content = await json(baseUrl, "/api/admin/content/home", {
      method: "PUT",
      token: admin.token,
      body: { banner: { title: "后台联动测试 Banner", slogan: "内容已同步用户端", status: "已发布" } },
    });
    assert.equal(content.config.banner.title, "后台联动测试 Banner");

    const importSuffix = Date.now();
    const importedUsers = await json(baseUrl, "/api/admin/users/import", {
      method: "POST",
      token: admin.token,
      body: {
        sourceFile: `users-${importSuffix}.csv`,
        items: [{
          id: `user-import-${importSuffix}`,
          name: "后台导入用户",
          phone: `139${String(importSuffix).slice(-8)}`,
          city: "昆明市",
          age: 69,
          familyContact: "张家属",
          status: "正常",
        }],
      },
    });
    assert.equal(importedUsers.createdCount, 1);
    const usersAfterImport = await json(baseUrl, "/api/admin/users", { token: admin.token });
    assert(usersAfterImport.users.some((item) => item.id === `user-import-${importSuffix}`), "老人用户管理批量导入后必须写入后台用户列表");

    const importedGuides = await json(baseUrl, "/api/admin/guides/import", {
      method: "POST",
      token: admin.token,
      body: {
        sourceFile: `guides-${importSuffix}.csv`,
        items: [{
          id: `guide-import-${importSuffix}`,
          realName: "后台导入向导",
          phone: `137${String(importSuffix).slice(-8)}`,
          city: "大理市",
          skills: ["陪诊", "旅居管家"],
          status: "待审核",
        }],
      },
    });
    assert.equal(importedGuides.createdCount, 1);
    const guidesAfterImport = await json(baseUrl, "/api/admin/guides", { token: admin.token });
    assert(guidesAfterImport.some((item) => item.id === `guide-import-${importSuffix}`), "人工向导管理批量导入后必须写入后台向导列表");

    const importedMerchants = await json(baseUrl, "/api/admin/merchants/import", {
      method: "POST",
      token: admin.token,
      body: {
        sourceFile: `merchants-${importSuffix}.csv`,
        items: [{
          id: `merchant-import-${importSuffix}`,
          name: "后台导入商户",
          type: "康复理疗",
          contact: "李店长",
          phone: `136${String(importSuffix).slice(-8)}`,
          address: "云南省 丽江市 古城区",
          status: "待审核",
        }],
      },
    });
    assert.equal(importedMerchants.createdCount, 1);
    const merchantsAfterImport = await json(baseUrl, "/api/admin/merchants", { token: admin.token });
    assert(merchantsAfterImport.some((item) => item.id === `merchant-import-${importSuffix}`), "商户管理批量导入后必须写入后台商户列表");

    const importedAlerts = await json(baseUrl, "/api/admin/alerts/import", {
      method: "POST",
      token: admin.token,
      body: {
        sourceFile: `alerts-${importSuffix}.csv`,
        items: [{
          id: `alert-import-${importSuffix}`,
          elderName: "后台导入老人",
          type: "SOS求助",
          level: "高",
          status: "待处理",
          location: "云南省 昆明市 五华区",
          description: "后台批量导入异常测试",
        }],
      },
    });
    assert.equal(importedAlerts.createdCount, 1);
    const alertsAfterImport = await json(baseUrl, "/api/admin/alerts", { token: admin.token });
    assert(alertsAfterImport.some((item) => item.id === `alert-import-${importSuffix}`), "异常/SOS管理批量导入后必须写入后台异常列表");

    const importedPolicies = await json(baseUrl, "/api/admin/policies/import", {
      method: "POST",
      token: admin.token,
      body: {
        sourceFile: `policies-${importSuffix}.md`,
        items: [{
          id: `policy-import-${importSuffix}`,
          title: "后台导入政策指南",
          category: "入住政策",
          city: "昆明市",
          status: "已发布",
          views: 12,
          favorites: 3,
          updatedAt: "2026-06-17 10:00",
          updatedBy: "平台管理员",
          summary: "后台导入政策内容测试",
        }],
      },
    });
    assert.equal(importedPolicies.createdCount, 1);
    const policiesAfterImport = await json(baseUrl, "/api/admin/policies", { token: admin.token });
    assert(policiesAfterImport.items.some((item) => item.id === `policy-import-${importSuffix}`), "政策指南导入后必须可从后台内容接口读取");

    const importedKnowledge = await json(baseUrl, "/api/admin/knowledge/import", {
      method: "POST",
      token: admin.token,
      body: {
        sourceFile: `knowledge-${importSuffix}.md`,
        items: [{
          id: `knowledge-import-${importSuffix}`,
          title: "后台导入知识",
          category: "健康问答",
          city: "全云南",
          source: "后台导入",
          updatedBy: "平台管理员",
          status: "已发布",
          hits: 8,
          summary: "后台导入知识内容测试",
        }],
      },
    });
    assert.equal(importedKnowledge.createdCount, 1);
    const knowledgeAfterImport = await json(baseUrl, "/api/admin/knowledge", { token: admin.token });
    assert(knowledgeAfterImport.items.some((item) => item.id === `knowledge-import-${importSuffix}`), "知识库导入后必须可从后台内容接口读取");

    const importedDeviceId = `AUTO-DEVICE-${Date.now()}`;
    const boundDevice = await json(baseUrl, "/api/devices/bind", {
      method: "POST",
      token: admin.token,
      body: {
        deviceId: importedDeviceId,
        type: "定位手表",
        name: "批量导入测试设备",
        elderName: "批量导入测试老人",
        userId: "user-import-test",
        battery: 66,
        location: "云南省 昆明市 五华区",
      },
    });
    assert.equal(boundDevice.deviceId, importedDeviceId);
    assert.equal(boundDevice.name, "批量导入测试设备");
    assert.equal(boundDevice.elderName, "批量导入测试老人");
    assert.equal(boundDevice.battery, 66);
    const devices = await json(baseUrl, "/api/devices", { token: admin.token });
    const persistedDevice = devices.find((item) => item.deviceId === importedDeviceId);
    assert(persistedDevice, "设备绑定后必须能在设备列表中查到");
    assert.equal(persistedDevice.name, "批量导入测试设备");
    assert.equal(persistedDevice.elderName, "批量导入测试老人");
    assert.equal(persistedDevice.battery, 66);
    const updatedDevice = await json(baseUrl, `/api/devices/${persistedDevice.id}`, {
      method: "PUT",
      token: admin.token,
      body: {
        name: "设备详情页更新测试",
        contactName: "张女士",
        contactRelation: "女儿",
        contactPhone: "13900001234",
        region: "云南省 昆明市 五华区",
        note: "设备详情页保存回写",
        alertThresholds: { heartRateHigh: 128, heartRateLow: 52, spo2Low: 91, inactivityMinutes: 55 },
        pushSettings: { notifyFamily: true, notifyAdmin: true, smsBackup: true, quietHours: "23:00-07:00" },
      },
    });
    assert.equal(updatedDevice.name, "设备详情页更新测试");
    assert.equal(updatedDevice.contactName, "张女士");
    assert.equal(updatedDevice.note, "设备详情页保存回写");
    assert.equal(updatedDevice.alertThresholds.heartRateHigh, 128);
    assert.equal(updatedDevice.pushSettings.smsBackup, true);
    const testedDevice = await json(baseUrl, `/api/devices/${persistedDevice.id}/action`, {
      method: "POST",
      token: admin.token,
      body: { action: "设备自检", role: "admin" },
    });
    assert.equal(testedDevice.device.deviceStatus, "检测正常");
    assert(testedDevice.action.result.includes("自检完成"));
    const removableDevice = await json(baseUrl, "/api/devices/bind", {
      method: "POST",
      token: admin.token,
      body: {
        deviceId: `REMOVE-DEVICE-${Date.now()}`,
        type: "定位手表",
        name: "解绑测试设备",
        elderName: "解绑测试老人",
        userId: "device-delete-test",
        battery: 80,
        location: "云南省 昆明市 五华区",
      },
    });
    const deletedDevice = await json(baseUrl, `/api/devices/${removableDevice.id}`, {
      method: "DELETE",
      token: admin.token,
      body: {},
    });
    assert.equal(deletedDevice.deviceId, removableDevice.deviceId);
    const afterDeleteDevices = await json(baseUrl, "/api/devices", { token: admin.token });
    assert(!afterDeleteDevices.some((item) => item.id === removableDevice.id), "设备解绑后不能继续保留在设备列表");

    const order = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: { serviceType: "陪伴就医", providerType: "guide", amount: 120, location: "昆明市第一人民医院" },
    });
    const dispatched = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: { orderId: order.id, assigneeType: "guide", assigneeId: auditedGuide.id },
    });
    assert.equal(dispatched.order.status, "已派单");
    const dispatchNotice = await json(baseUrl, "/api/admin/dispatch/notify", {
      method: "POST",
      token: admin.token,
      body: { orderId: order.id, assigneeType: "guide", assigneeId: auditedGuide.id },
    });
    assert.equal(dispatchNotice.assigneeId, auditedGuide.id);
    assert.equal(dispatchNotice.orderId, order.id);
    const fallbackGuide = guides.find((item) => item.id !== auditedGuide.id) || auditedGuide;
    const redispatched = await json(baseUrl, "/api/tasks/dispatch", {
      method: "POST",
      token: admin.token,
      body: {
        orderId: order.id,
        assigneeType: "guide",
        assigneeId: fallbackGuide.id,
        dispatchRule: "管理后台人工改派",
        allowRedispatch: true,
      },
    });
    assert.equal(redispatched.task.assigneeId, fallbackGuide.id, "后台人工改派后任务执行方必须更新");
    assert.equal(redispatched.order.providerId, fallbackGuide.id, "后台人工改派后订单执行方必须同步更新");
    assert(redispatched.task.status, "后台人工改派后任务状态必须保留");
    const cancelledOrder = await json(baseUrl, `/api/orders/${order.id}/cancel`, {
      method: "POST",
      token: admin.token,
      body: { reason: "后台调度取消任务", actor: "平台管理员" },
    });
    assert.equal(cancelledOrder.status, "已取消");
    const dispatchQueueAfterCancel = await json(baseUrl, "/api/admin/dispatch/pending", { token: admin.token });
    assert(!dispatchQueueAfterCancel.pendingOrders.some((item) => item.id === order.id), "取消后的订单不能继续留在待派单池");
    assert(!dispatchQueueAfterCancel.activeTasks.some((item) => item.orderId === order.id), "取消后的任务不能继续留在活跃调度池");

    const sos = await json(baseUrl, "/api/alerts/sos", {
      method: "POST",
      token: elder.token,
      body: { location: "昆明滇池康养公寓", description: "后台控制台测试 SOS" },
    });
    const handled = await json(baseUrl, `/api/alerts/${sos.id}/handle`, {
      method: "POST",
      token: admin.token,
      body: { result: "后台控制台测试处理完成" },
    });
    assert.equal(handled.status, "已处理");

    const reset = await json(baseUrl, "/api/admin/demo/reset", { method: "POST", token: admin.token, body: {} });
    assert.equal(reset.status.driver, "json-file");

    console.log("admin console integration ok");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
