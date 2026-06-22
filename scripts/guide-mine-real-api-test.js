const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const guideAppPath = path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js");
const guideStylesPath = path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "styles.css");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assertCssRuleIncludes(styles, selector, declarations, message) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = styles.match(new RegExp(`${escapedSelector}\\s*{([\\s\\S]*?)}`));
  assert(match, `${message}：缺少 ${selector} 样式`);
  declarations.forEach((declaration) => {
    assert(
      match[1].includes(declaration),
      `${message}：${selector} 必须包含 ${declaration}`,
    );
  });
}

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

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
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
  if (!response.ok || !payload.success) {
    throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  }
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(guideAppPath, "utf8");
  const styles = fs.readFileSync(guideStylesPath, "utf8");
  [
    "function hydrateGuideMineFromApi",
    "guideApiRequest('/api/guide/mine?guideId=guide-001')",
    "function applyGuideMineData",
    "function refreshGuideMine",
  ].forEach((needle) => assert(source.includes(needle), `向导端我的 #07 必须接入真实我的接口与功能：${needle}`));
  assert(source.includes('class="guide-mine-profile-title"'), "我的页面顶部姓名、评分和身份标签必须有专属行容器，避免挤压刷新按钮");
  assert(!styles.includes(".guide-mine-refresh"), "我的页面不应继续保留顶部大号刷新按钮样式");
  assertCssRuleIncludes(
    styles,
    ".hero-profile-card > .row",
    ["flex-wrap: wrap;", "align-items: flex-start;"],
    "我的页面顶部资料行必须允许操作按钮在窄屏换行而不是溢出",
  );
  assertCssRuleIncludes(
    styles,
    ".hero-profile-card .profile",
    ["flex: 1 1 220px;", "min-width: 0;", "max-width: 100%;"],
    "我的页面顶部资料区域必须可收缩",
  );
  assertCssRuleIncludes(
    styles,
    ".hero-profile-card .profile-main",
    ["min-width: 0;", "max-width: 100%;", "overflow: hidden;"],
    "我的页面顶部文字区域必须限制在卡片内",
  );
  assertCssRuleIncludes(
    styles,
    ".guide-mine-profile-title",
    ["display: flex;", "min-width: 0;", "max-width: 100%;"],
    "我的页面顶部姓名评分标签行必须在资料区内收缩",
  );
  assertCssRuleIncludes(
    styles,
    ".guide-mine-profile-title strong",
    ["overflow: hidden;", "text-overflow: ellipsis;", "white-space: nowrap;"],
    "我的页面顶部姓名必须省略而不是撑开布局",
  );
  assertCssRuleIncludes(
    styles,
    ".hero-profile-card .profile-main p",
    ["overflow: hidden;", "text-overflow: ellipsis;", "white-space: nowrap;"],
    "我的页面顶部服务区域文案必须省略而不是撑开布局",
  );

  const renderStart = source.indexOf("function renderMe()");
  const renderEnd = source.indexOf("function renderOnline()", renderStart);
  assert(renderStart >= 0 && renderEnd > renderStart, "必须能定位我的页面渲染函数");
  const renderSource = source.slice(renderStart, renderEnd);
  assert(!renderSource.includes("guide-mine-refresh"), "我的页面顶部资料卡不应继续渲染大号刷新按钮");
  assert(!renderSource.includes("data-guide-mine-refresh"), "我的页面顶部资料卡不应继续暴露刷新按钮入口");
  ["¥2568.00", "已排班 5 天", "6 项技能", "4 类可接", "弥勒市全域"].forEach((text) => {
    assert(!renderSource.includes(text), `我的页面不能继续硬编码演示文案：${text}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-mine-"));
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
    const guide = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "guide" } });
    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("guide-mine"), "健康检查必须登记 guide-mine 接口组");

    const mine = await json(baseUrl, "/api/guide/mine?guideId=guide-001", { token: guide.token });
    assert.equal(mine.sourceEndpoint, "/api/guide/mine");
    assert.equal(mine.dashboard.sourceEndpoint, "/api/guide/dashboard");
    assert.equal(mine.stats.sourceEndpoint, "/api/guide/stats");
    assert.equal(mine.income.sourceEndpoint, "/api/guide/income");
    assert.equal(mine.actions.refresh.endpoint, "/api/guide/mine");
    assert.equal(mine.actions.online.endpoint, "/api/guide/online");
    assert.equal(mine.profile.id, "guide-001");
    assert.equal(mine.profile.name, "王芳");
    assert.equal(mine.profile.status, "已认证");
    assert.ok(mine.profile.area, "我的接口必须返回服务区域");
    assert.ok(Array.isArray(mine.profile.serviceTypes) && mine.profile.serviceTypes.length >= 1, "我的接口必须返回真实服务类型");
    assert.equal(mine.summary.orderCount, mine.stats.orderCount);
    assert.equal(mine.summary.cancelledOrders, mine.stats.cancelledOrders);
    assert.equal(mine.summary.rating, mine.profile.rating);
    assert.equal(mine.menuItems.wallet.value, mine.wallet.label);
    assert.equal(mine.menuItems.schedule.value, mine.schedule.label);
    assert.equal(mine.menuItems.serviceSkills.value, `${mine.skills.count} 项技能`);
    assert.equal(mine.menuItems.serviceTypes.value, `${mine.profile.serviceTypes.length} 类可接`);
    assert.ok(mine.menuRows.some((row) => row.title === "我的钱包" && row.open === "19"), "我的页面菜单必须保留真实可跳转钱包入口");
    assert.ok(mine.menuRows.every((row) => row.open), "我的页面菜单每一项都必须有真实路由");

    const bareMine = await json(baseUrl, "/guide/mine?guideId=guide-001", { token: guide.token });
    assert.equal(bareMine.sourceEndpoint, "/api/guide/mine");

    const updatedOnline = await json(baseUrl, "/api/guide/online", {
      method: "POST",
      token: guide.token,
      body: { guideId: "guide-001", onlineStatus: "离线" },
    });
    assert.equal(updatedOnline.onlineStatus, "离线");
    const afterOnline = await json(baseUrl, "/api/guide/mine?guideId=guide-001", { token: guide.token });
    assert.equal(afterOnline.profile.onlineStatus, "离线", "我的接口必须同步真实接单状态");
    assert.equal(afterOnline.menuItems.online.value, "离线休息中");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide mine real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
