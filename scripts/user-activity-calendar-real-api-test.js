const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const stylesPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "styles.css");
const indexPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {}
    await delay(120);
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
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(appPath, "utf8");
  const styles = fs.readFileSync(stylesPath, "utf8");
  const shell = fs.readFileSync(indexPath, "utf8");

  assert.match(source, /let activityCalendarPageState/, "活动日历页必须缓存真实活动接口数据");
  assert.match(source, /"activity-calendar": hydrateActivityCalendarFromApi/, "活动日历路由必须触发真实接口水合");
  assert.match(source, /async function hydrateActivityCalendarFromApi/, "活动日历必须保留独立真实接口水合函数");
  assert.match(source, /activityCalendarPageState\?\.query\?\.category === activityCalendarActiveFilter/, "活动日历已加载同一筛选时必须停止重复水合，避免渲染循环");
  assert.match(source, /userApi\(`\/api\/activities\$\{params\.toString\(\)/, "活动日历必须调用 /api/activities 并支持分类参数");
  assert.match(source, /function activityCalendarEventsForDate/, "活动日历日期事件必须由真实接口活动映射");
  assert.match(source, /function activityCalendarNearestEventDateKey/, "活动日历默认日期必须落到接口中最近有活动的日期");
  assert.match(source, /data-activity-id="\$\{attr\(event\.id\)\}"/, "活动日历活动卡片必须携带真实活动 ID");
  assert.match(source, /data-action="\$\{event\.userJoined \? "查看报名" : "报名日历活动"\}"/, "活动日历报名按钮必须按接口报名状态切换真实动作");
  assert.match(source, /await handleCalendarAction\(actionButton, actionName\)/, "活动日历动作分发必须等待异步接口完成");
  assert.match(source, /\/api\/activities\/\$\{encodeURIComponent\(activityId\)\}\/join/, "活动日历报名必须调用真实报名接口");
  assert.match(source, /localStorage\.setItem\(ACTIVITY_CALENDAR_REMINDER_STORAGE_KEY/, "活动提醒开关必须持久化真实状态");
  assert.match(source, /ref-calendar-reminder-title/, "活动提醒卡必须拆分标题，避免手机端标题断行");
  assert.match(source, /ref-calendar-reminder-subtitle/, "活动提醒卡必须拆分副标题，避免和开关挤在同一行");
  assert.match(source, /ref-calendar-reminder-switch-label">提醒/, "活动提醒开关右侧只保留短标签，避免长文案挤压开关");
  assert.doesNotMatch(source, /真实接口 \/api\/activities · \$\{attr\(activityCalendarActiveFilter\)\} · 共 \$\{totalEvents\} 个活动/, "活动日历不应在正式界面展示接口调试状态文案");
  assert.match(styles, /\.screen-activity-calendar \.ref-calendar-event button\s*{[^}]*white-space:\s*nowrap/s, "活动日历去报名按钮必须保持单行");
  assert.match(styles, /\.screen-activity-calendar \.ref-calendar-reminder\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/s, "活动提醒卡必须左侧可收缩、右侧开关自适应");
  assert.match(styles, /\.screen-activity-calendar \.ref-calendar-reminder-title\s*{[^}]*white-space:\s*nowrap/s, "活动提醒卡标题必须保持一行显示");
  assert.match(styles, /\.screen-activity-calendar \.ref-calendar-legend button\s*{[^}]*min-height:\s*28px/s, "活动日历筛选按钮必须有稳定手机触控高度");
  assert.match(styles, /\.screen-activity-calendar \.ref-calendar-filter-panel button\s*{[^}]*min-height:\s*30px/s, "活动日历筛选项必须有稳定手机触控高度");
  assert(shell.includes("app.js?v=user-transport-real-api-20260620"), "用户端 H5 入口必须刷新脚本版本，避免旧活动日历缓存");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-activity-calendar-"));
  let logs = "";
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), YUNLV_RUNTIME_DIR: runtimeDir },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  child.stderr.on("data", (chunk) => { logs += chunk.toString(); });

  try {
    await waitForServer(baseUrl, () => logs);
    const login = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const token = login.token;

    const activities = await json(baseUrl, "/api/activities", { token });
    assert(Array.isArray(activities) && activities.length >= 6, "活动日历必须能从真实活动列表接口读取活动");
    assert(activities.every((activity) => activity.id && activity.title && activity.time && activity.location && activity.category), "活动列表接口必须返回日历可渲染字段");
    const dateKeys = new Set(activities.map((activity) => String(activity.time).slice(0, 10)));
    assert(dateKeys.size >= 3, "活动日历需要按真实日期分组，而不是固定前端模板");

    const cultural = await json(baseUrl, `/api/activities?category=${encodeURIComponent("文化体验")}`, { token });
    assert(cultural.length >= 1, "活动日历文化体验筛选应返回真实活动");
    assert(cultural.every((activity) => activity.category === "文化体验"), "活动日历筛选必须由接口分类结果驱动");

    const target = activities.find((activity) => !activity.userJoined) || activities[0];
    const joined = await json(baseUrl, `/api/activities/${encodeURIComponent(target.id)}/join`, {
      method: "POST",
      token,
      body: { source: "activity-calendar-test" },
    });
    assert.equal(joined.activity.id, target.id);
    assert.equal(joined.activity.userJoined, true, "报名后活动详情应返回当前用户已报名");
    assert(joined.signup.id, "报名接口必须返回 signup ID");

    const detailAfterJoin = await json(baseUrl, `/api/activities/${encodeURIComponent(target.id)}`, { token });
    assert.equal(detailAfterJoin.userJoined, true);
    assert.equal(detailAfterJoin.canCancel, true);

    await json(baseUrl, `/api/activities/${encodeURIComponent(target.id)}/cancel`, {
      method: "POST",
      token,
      body: { signupId: joined.signup.id, reason: "活动日历真实接口测试取消" },
    });
    const detailAfterCancel = await json(baseUrl, `/api/activities/${encodeURIComponent(target.id)}`, { token });
    assert.equal(detailAfterCancel.userJoined, false, "取消后活动详情应返回当前用户未报名");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user activity calendar real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
