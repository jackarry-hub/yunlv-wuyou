const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  ACTIVITY_MAP_REQUIREMENTS_VERSION,
  activityMapCategories,
  activityMapRequirements,
  activityMapRequirementsForApi,
  validateActivityMapRequirements,
} = require("../server/lib/activity-map-requirements");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["地图展示", "基于弥勒区域展示活动位置点，支持地图缩放、定位、刷新。", "P0"],
  ["活动分类", "全部、文化体验、康养健身、休闲娱乐、自然观光、学习讲座等。", "P0"],
  ["活动卡片", "地图点点击出现活动卡片，展示名称、时间、地点、距离、状态。", "P0"],
  ["附近推荐", "底部横滑展示附近活动推荐。", "P0"],
  ["活动报名", "活动详情页支持报名、取消报名、查看参与人数。", "P1"],
];

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
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  assert.deepEqual(
    activityMapRequirements.map((item) => [item.feature, item.detail, item.priority]),
    expectedRows,
    "4.4 活动地图需求应与图示一致",
  );
  assert.equal(validateActivityMapRequirements().valid, true);
  assert.deepEqual(activityMapCategories, ["全部", "文化体验", "康养健身", "休闲娱乐", "自然观光", "学习讲座"]);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = activityMapRequirementsForApi(seed);
  assert.equal(direct.version, ACTIVITY_MAP_REQUIREMENTS_VERSION);
  assert.equal(direct.requirementCount, 5);
  assert.equal(direct.p0Count, 4);
  assert.equal(direct.p1Count, 1);
  assert.equal(direct.mapDisplay.region, "弥勒区域");
  assert(direct.mapDisplay.supports.includes("缩放"));
  assert(direct.mapDisplay.supports.includes("定位"));
  assert(direct.mapDisplay.supports.includes("刷新"));
  assert(direct.points.length >= 6);
  assert(activityMapCategories.every((category) => direct.categories.some((item) => item.category === category)));
  assert(direct.points.every((item) => item.card.name && item.card.time && item.card.place && item.card.distance && item.card.status));
  assert(direct.nearbyRecommendations.length >= 4);
  const userAppSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/用户端/云旅无忧用户端代码实现/app.js"), "utf8");
  const userStyleSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/用户端/云旅无忧用户端代码实现/styles.css"), "utf8");
  assert(userAppSource.includes("data-signup-gender"), "活动报名表必须包含性别字段");
  assert(userAppSource.includes("data-signup-age"), "活动报名表必须包含年龄字段");
  assert(userAppSource.includes("ref-activity-bottom-action"), "活动报名页底部操作必须与立即报名分组展示");
  assert(userAppSource.includes("function shareActivitySignup"), "活动报名页分享必须有真实处理函数");
  assert(userAppSource.includes("function openActivityConsult"), "活动报名页咨询必须进入真实咨询流程");
  assert(userAppSource.includes("function openActivityNavigation"), "活动报名页导航必须进入活动地图");
  assert(userStyleSource.includes(".ref-activity-secondary-actions"), "活动报名页咨询/分享/日历必须独立成组");
  assert(userAppSource.includes("function handleCalendarAction"), "活动日历必须有专用真实交互处理函数");
  assert(userAppSource.includes("data-calendar-day"), "活动日历日期必须绑定真实日期数据");
  assert(userAppSource.includes("data-calendar-month-delta"), "活动日历上下月必须绑定月份切换数据");
  assert(userAppSource.includes("data-action=\"切换活动提醒\""), "活动提醒必须是可点击状态按钮");
  assert(userStyleSource.includes("white-space: nowrap"), "活动日历去报名按钮必须保持单行");
  assert(userAppSource.includes("AMAP_READY_TIMEOUT_MS"), "活动地图必须设置高德地图加载超时状态");
  assert(userAppSource.includes("function setActivityMapLoadState"), "活动地图必须统一维护 loading/ready/fallback/error 状态");
  assert(userAppSource.includes("activityMapRequirementsState"), "活动地图必须缓存真实需求接口数据驱动分类和推荐");
  assert(userAppSource.includes("normalizeActivityMapEvent"), "活动地图必须把后台活动点规范化后渲染地图和列表");
  assert(userAppSource.includes('data-activity-id="${attr(activity.id)}"'), "活动地图活动卡片必须携带真实活动 ID");
  assert(userAppSource.includes("apiEndpoint: item.apiEndpoint || (id ? `/api/activities/${encodeURIComponent(id)}`"), "活动地图详情接口地址必须优先使用当前活动 ID");
  assert(userAppSource.includes("userJoined: item.userJoined !== undefined ? Boolean(item.userJoined)"), "活动地图报名状态必须以当前接口返回值为准");
  assert(userAppSource.includes("apiEndpoint: item.apiEndpoint || `/api/activities/${encodeURIComponent(id)}`"), "活动详情页接口地址必须优先使用当前活动 ID");
  assert(userAppSource.includes("await filterActivityMap(activityMapFilter.dataset.activityMapFilter)"), "活动地图分类筛选必须等待真实接口刷新");
  assert(userAppSource.includes("userApi(`/api/activities/map${filter === \"全部\""), "活动地图筛选必须调用 /api/activities/map 分类接口");
  assert(userAppSource.includes("data-route=\"activity-signup\" data-activity-id"), "活动地图选中卡片进入详情必须带当前活动 ID");
  assert(userAppSource.includes('map.on?.("complete"'), "活动地图必须等高德 complete 事件后再标记就绪");
  assert(userAppSource.includes('setActivityMapLoadState("fallback"'), "活动地图加载较慢时必须展示降级说明");
  assert(userAppSource.includes('setActivityMapLoadState("error"'), "活动地图加载失败时必须展示失败兜底说明");
  assert(userStyleSource.includes(".screen-activity-map .ref-map-stage.is-ready .ref-map-loading"), "活动地图就绪状态必须有可见样式");
  assert(userStyleSource.includes(".screen-activity-map .ref-map-stage.is-fallback .ref-map-loading"), "活动地图降级状态必须有可见样式");
  assert(userStyleSource.includes(".screen-activity-map .ref-map-stage.is-error .ref-map-loading"), "活动地图失败状态必须有可见样式");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-activity-map-"));
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
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const admin = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "admin" } });

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("activity-map-requirements"));

    const requirements = await json(baseUrl, "/api/activities/map-requirements", { token: elder.token });
    assert.equal(requirements.validation.valid, true);
    assert.equal(requirements.requirementCount, 5);
    assert.equal(requirements.mapDisplay.pointCount >= 6, true);
    assert(requirements.categories.find((item) => item.category === "文化体验").count >= 2);
    assert(requirements.nearbyRecommendations.length >= 4);

    const bareRequirements = await json(baseUrl, "/activities/map-requirements", { token: elder.token });
    assert.equal(bareRequirements.version, ACTIVITY_MAP_REQUIREMENTS_VERSION);

    const culturalPoints = await json(baseUrl, "/api/activities/map?category=文化体验", { token: elder.token });
    assert(culturalPoints.length >= 2);
    assert(culturalPoints.every((item) => item.category === "文化体验"));

    const targetActivity = requirements.points.find((item) => !item.userJoined && item.status === "报名中");
    assert(targetActivity, "应存在一个可用于新增报名验收的未报名活动");
    const targetActivityPath = `/api/activities/${targetActivity.id}`;
    const beforeDetail = await json(baseUrl, targetActivityPath, { token: elder.token });
    assert.equal(beforeDetail.canJoin, true);
    assert.equal(beforeDetail.userJoined, false);
    const beforeJoined = beforeDetail.joined;

    const signup = await json(baseUrl, `${targetActivityPath}/join`, {
      method: "POST",
      token: elder.token,
      body: { name: "李秀兰", gender: "女", age: 72, phone: "13800005678", count: 2, note: "需要适老座位" },
    });
    assert.equal(signup.activity.id, targetActivity.id);
    assert.equal(signup.signup.count, 2);
    assert.equal(signup.signup.gender, "女");
    assert.equal(signup.signup.age, 72);
    assert.equal(signup.activity.joined, beforeJoined + 2);
    assert.equal(signup.activity.userJoined, true);

    const afterDetail = await json(baseUrl, `/activities/${targetActivity.id}`, { token: elder.token });
    assert.equal(afterDetail.userJoined, true);
    assert(afterDetail.participants.some((item) => item.id === signup.signup.id && item.count === 2 && item.gender === "女" && item.age === 72));

    const updatedSignup = await json(baseUrl, `${targetActivityPath}/join`, {
      method: "POST",
      token: elder.token,
      body: { name: "李秀兰", gender: "女", age: 73, phone: "13800005678", count: 3, note: "增加一位家属" },
    });
    assert.equal(updatedSignup.duplicate, true);
    assert.equal(updatedSignup.activity.joined, beforeJoined + 3);
    assert.equal(updatedSignup.signup.gender, "女");
    assert.equal(updatedSignup.signup.age, 73);

    const canceled = await json(baseUrl, `${targetActivityPath}/cancel`, {
      method: "POST",
      token: elder.token,
      body: { signupId: signup.signup.id, reason: "4.4 验收取消报名" },
    });
    assert.equal(canceled.signup.status, "已取消");
    assert.equal(canceled.activity.joined, beforeJoined);
    assert.equal(canceled.activity.userJoined, false);

    const userMessages = await json(baseUrl, "/api/messages?role=user", { token: elder.token });
    assert(userMessages.some((item) => item.title.includes("活动报名成功") && item.relatedId === targetActivity.id));
    assert(userMessages.some((item) => item.title.includes("活动报名已取消") && item.relatedId === targetActivity.id));
    const adminMessages = await json(baseUrl, "/api/messages?role=admin", { token: admin.token });
    assert(adminMessages.some((item) => item.title.includes("新增活动报名") && item.relatedId === targetActivity.id));

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.activityMapRequirements.architecturePath, "/api/activities/map-requirements");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("activity map requirements ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
