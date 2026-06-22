const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const userAppPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const userStylesPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "styles.css");

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
    } catch (error) {}
    await delay(120);
  }
  throw new Error(`server did not start\n${output()}`);
}

async function json(baseUrl, route, options = {}) {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };
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
  const source = fs.readFileSync(userAppPath, "utf8");
  const styles = fs.readFileSync(userStylesPath, "utf8");
  const renderStart = source.indexOf("function renderProfile()");
  const renderEnd = source.indexOf("function renderLogin()", renderStart);
  const expandStart = source.indexOf("function expandProfilePlans(");
  const expandEnd = source.indexOf("function profileDate(", expandStart);
  assert(renderStart >= 0 && renderEnd > renderStart, "必须能定位用户中心渲染函数");
  assert(expandStart >= 0 && expandEnd > expandStart, "必须能定位旅居计划展开函数");
  const renderSource = source.slice(renderStart, renderEnd);
  const expandSource = source.slice(expandStart, expandEnd);

  assert.match(source, /userApi\("\/api\/user\/profile-center"\)/, "用户中心必须调用聚合接口");
  assert.match(renderSource, /userProfileCenterState/, "用户中心必须由接口状态渲染");
  assert.match(source, /data-profile-plan-id/, "旅居计划必须保留后台计划 ID");
  assert.match(source, /data-api-endpoint="\/api\/user\/profile-center"/, "用户中心卡片必须声明真实接口来源");
  assert.equal(renderSource.includes("张建国"), false, "用户中心不能继续写死姓名");
  assert.equal(renderSource.includes("2025.05.20"), false, "用户中心不能继续写死旧旅居计划日期");
  assert.equal(expandSource.includes("const plans = ["), false, "查看全部计划不能继续构造静态数组");
  assert.match(source, /function profileCouponPanelHtml\(/, "优惠券详情必须由接口数据渲染");
  assert.match(source, /function profilePointsPanelHtml\(/, "积分详情必须由接口数据渲染");
  assert.match(source, /function profileMembershipPanelHtml\(/, "会员权益必须由接口数据渲染");
  assert.match(styles, /\.screen-profile \.ref-plan-card img\s*\{[^}]*object-position:\s*left center;/s, "旅居计划图片必须左对齐裁切，避免云南城市标签被截断");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-profile-center-"));
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
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const center = await json(baseUrl, "/api/user/profile-center", { token: elder.token });
    assert.equal(center.user.id, "user-001");
    assert.equal(center.elderProfile.id, "elder-001");
    assert(center.familyContacts.length >= 2);
    assert(center.travelPlans.length >= 3);
    assert(center.travelPlans.every((item) => item.id && item.name && item.startDate && item.endDate));
    assert.equal(center.benefits.availableCouponCount, 3);
    assert.equal(center.benefits.points.balance, 860);
    assert(center.benefits.points.ledger.length >= 3);
    assert.equal(center.benefits.membership.status, "有效");
    assert(center.summary.orderCount >= 1);
    assert.equal(center.endpoints.orders, "/api/orders");
    assert.equal(center.endpoints.contacts, "/api/family-contacts");

    await json(baseUrl, "/api/user/profile", {
      method: "PUT",
      token: elder.token,
      body: { nickname: "接口验收用户", currentCity: "弥勒" },
    });
    await json(baseUrl, "/api/elder/profile", {
      method: "PUT",
      token: elder.token,
      body: { name: "接口验收老人", city: "弥勒", riskLevel: "低风险" },
    });
    const updated = await json(baseUrl, "/api/user/profile-center", { token: elder.token });
    assert.equal(updated.user.nickname, "接口验收用户");
    assert.equal(updated.elderProfile.name, "接口验收老人");
    assert.equal(updated.elderProfile.city, "弥勒");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user profile center real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
