const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  USER_HOME_REQUIREMENTS_VERSION,
  bottomNavigation,
  featureGrid,
  quickServices,
  userHomeRequirements,
  userHomeRequirementsForApi,
  validateUserHomeRequirements,
} = require("../server/lib/user-home-requirements");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["顶部区域", "显示 Logo、当前城市、消息/通知入口。城市首期默认弥勒/昆明，可手动切换。"],
  ["Banner", "展示旅居生活主题图与项目口号，支持后台配置。"],
  ["快捷服务", "安全守护、健康服务、旅居管家、政策指南四个快捷入口。"],
  ["功能宫格", "旅居目的地、活动日历、社群交流、旅居打卡、本地美食、交通出行、优选商城、志愿服务。"],
  ["活动推荐", "展示 3-4 个推荐活动，包含图片、标签、时间、地点、报名人数。"],
  ["底部导航", "首页、发现/旅居管家、人工向导、消息、我的。"],
];

function phrase(parts) {
  return parts.join("");
}

const forbiddenHomeTexts = [
  phrase(["占位", "页"]),
  phrase(["待", "接入"]),
  phrase(["状态", "已更新"]),
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
    userHomeRequirements.map((item) => [item.feature, item.detail]),
    expectedRows,
    "4.2 首页需求应与图示一致",
  );
  assert.equal(validateUserHomeRequirements().valid, true);
  assert.equal(userHomeRequirements.some((item) => forbiddenHomeTexts.some((text) => `${item.acceptance}${item.detail}`.includes(text))), false);
  assert.deepEqual(quickServices.map((item) => item.title), ["安全守护", "健康服务", "旅居管家", "政策指南"]);
  assert.deepEqual(featureGrid.map((item) => item.title), ["旅居目的地", "活动日历", "社群交流", "旅居打卡", "本地美食", "交通出行", "优选商城", "志愿服务"]);
  assert.deepEqual(bottomNavigation.map((item) => item.title), ["首页", "发现/旅居管家", "人工向导", "消息", "我的"]);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = userHomeRequirementsForApi(seed);
  assert.equal(direct.version, USER_HOME_REQUIREMENTS_VERSION);
  assert.equal(direct.requirementCount, 6);
  assert(direct.topArea.logo.includes("home-logo-ref"));
  assert(direct.topArea.cityOptions.includes("弥勒"));
  assert(direct.topArea.cityOptions.includes("昆明"));
  assert.equal(direct.topArea.messageEntry.route, "messages");
  assert.equal(direct.banner.configurable, true);
  assert.equal(direct.quickServices.length, 4);
  assert.equal(direct.featureGrid.length, 8);
  assert(direct.activityRecommendation.count >= 3 && direct.activityRecommendation.count <= 4);
  assert(direct.activityRecommendation.items.every((item) => item.image && item.tag && item.time && item.location && Number.isFinite(item.joined)));
  assert.equal(direct.runtime.p0EntriesAvailable, true);
  assert.equal(direct.runtime.tabsReachable, true);

  const userAppSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js"), "utf8");
  const userIndex = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html"), "utf8");
  [
    ["安全守护", "emergency"],
    ["健康服务", "health-services"],
    ["旅居管家", "assistant"],
    ["政策指南", "policies"],
  ].forEach(([title, route]) => {
    assert(
      userAppSource.includes(`{ title: "${title}"`) && userAppSource.includes(`route: "${route}"`),
      `首页快捷入口 ${title} 必须绑定真实用户端路由 ${route}`,
    );
  });
  assert(userAppSource.includes('button class="home-feature-item" data-route="${item.route}"'), "首页快捷入口必须渲染为 data-route 按钮");
  assert(userAppSource.includes('home: hydrateHomeFromApi'), "用户端首页必须通过统一 hydrate 流程调用真实首页接口");
  assert(userAppSource.includes('userApi("/api/user/home")'), "用户端首页必须读取 /api/user/home 聚合数据");
  assert(userAppSource.includes("homeActivityRecommendations"), "首页活动推荐必须从接口活动推荐数据渲染");
  assert(userAppSource.includes('data-activity-id="${attr(activity.id)}"'), "首页活动卡片必须携带真实活动 ID");
  assert(userAppSource.includes("`/api/activities/${encodeURIComponent(activityId)}/join`"), "活动报名必须按当前活动 ID 调用真实报名接口");
  assert(
    /document\.addEventListener\("click", async \(event\) => \{[\s\S]*event\.target\.closest\("\[data-route\]"\)[\s\S]*const nextRoute = normalizeUserRouteId\(route\.dataset\.route\)[\s\S]*setRoute\(nextRoute\)/.test(userAppSource),
    "首页快捷入口必须通过统一 data-route 点击委托规范化后切换用户端页面",
  );
  assert(userIndex.includes("app.js?v=user-route-boundary-20260613"), "用户端入口必须升级 app.js 版本，避免旧缓存导致快捷入口、导航壳层、跨端会话或样式对齐异常");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-home-"));
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
    assert(health.apiGroups.includes("user-home-requirements"));

    const requirements = await json(baseUrl, "/api/user/home-requirements", { token: elder.token });
    assert.equal(requirements.validation.valid, true);
    assert.equal(requirements.requirementCount, 6);
    assert.equal(JSON.stringify(requirements).includes(forbiddenHomeTexts[0]), false);
    assert.equal(requirements.quickServices.find((item) => item.title === "旅居管家").route, "assistant");
    assert(requirements.bottomNavigation.some((item) => item.title === "人工向导" && item.route === "guide"));

    const bareRequirements = await json(baseUrl, "/user/home-requirements", { token: elder.token });
    assert.equal(bareRequirements.version, USER_HOME_REQUIREMENTS_VERSION);

    const city = await json(baseUrl, "/api/user/home-city", {
      method: "POST",
      token: elder.token,
      body: { city: "弥勒" },
    });
    assert.equal(city.currentCity, "弥勒");
    const afterCity = await json(baseUrl, "/api/user/home-requirements", { token: elder.token });
    assert.equal(afterCity.topArea.currentCity, "弥勒");
    const messages = await json(baseUrl, "/api/messages?role=user", { token: elder.token });
    assert(messages.some((item) => item.title.includes("当前城市已更新")));

    const adminContent = await json(baseUrl, "/api/admin/content/home", { token: admin.token });
    assert.equal(adminContent.editable.cityOptions, true);
    assert.equal(adminContent.banner.adminEndpoint, "/api/admin/content/home");

    const updated = await json(baseUrl, "/api/admin/content/home", {
      method: "PUT",
      token: admin.token,
      body: {
        cityOptions: ["弥勒", "昆明", "大理"],
        banner: {
          image: "/user/assets/home-hero.jpg",
          title: "验收 Banner 标题",
          slogan: "后台可替换 Banner 图片与文案",
        },
      },
    });
    assert.equal(updated.validation.valid, true);
    assert.equal(updated.config.banner.title, "验收 Banner 标题");
    assert.equal(updated.home.banner.slogan, "后台可替换 Banner 图片与文案");

    const bareAdmin = await json(baseUrl, "/admin/content/home", { token: admin.token });
    assert.equal(bareAdmin.banner.title, "验收 Banner 标题");

    const testActivity = await json(baseUrl, "/api/admin/activities", {
      method: "POST",
      token: admin.token,
      body: { title: "最低交付活动回归测试", category: "文化体验", location: "昆明市五华区", quota: 20 },
    });
    assert.equal(testActivity.title, "最低交付活动回归测试");

    const home = await json(baseUrl, "/api/user/home", { token: elder.token });
    assert.equal(home.homeRequirements.version, USER_HOME_REQUIREMENTS_VERSION);
    assert.equal(home.homeRequirements.banner.title, "验收 Banner 标题");
    assert.equal(
      home.activities.some((activity) => String(activity.title || "").includes("最低交付")),
      false,
      "用户端首页活动推荐不能展示最低交付验收测试数据",
    );
    const publicActivities = await json(baseUrl, "/api/activities", { token: elder.token });
    assert.equal(
      publicActivities.some((activity) => String(activity.title || "").includes("最低交付")),
      false,
      "用户端活动列表不能展示最低交付验收测试数据",
    );

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.userHomeRequirements.architecturePath, "/api/user/home-requirements");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user home requirements ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
