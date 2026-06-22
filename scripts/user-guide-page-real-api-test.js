const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const deadline = Date.now() + 8000;
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
  const renderStart = source.indexOf("function renderGuide()");
  const renderEnd = source.indexOf("function renderGuideDetail()", renderStart);
  const pageSource = source.slice(renderStart, renderEnd);
  assert.match(source, /userApi\("\/api\/user\/guide-page"\)/);
  assert.match(pageSource, /userGuidePageState/);
  assert.match(pageSource, /data-api-endpoint="\/api\/user\/guide-page"/);
  assert.match(pageSource, /data-guide-id/);
  assert.match(pageSource, /data-route="guide-detail"/);
  assert.match(source, /function selectedUserGuide\(\)/);
  assert.match(pageSource, /href="tel:/);
  assert.doesNotMatch(pageSource, /当前城市：弥勒市/);
  assert.doesNotMatch(pageSource, /李晓彤|张志远|王丽娜/);
  assert.match(source, /providerId: localStorage\.getItem\("yunlv-guide-id"\)/);
  assert.match(source, /strictRequirements: true/);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-guide-page-"));
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
    const page = await json(baseUrl, "/api/user/guide-page", { token: elder.token });
    assert.equal(page.sourceEndpoint, "/api/user/guide-page");
    assert.equal(page.profile.elderName, "李秀兰");
    assert.equal(page.profile.age, 72);
    assert.equal(page.profile.currentCity, "昆明");
    assert.equal(page.profile.phone, "13800005678");
    assert.equal(page.categories.length, 6);
    assert.deepEqual(page.categories.map((item) => item.title), ["陪伴就医", "导游游览", "护工护理", "接送出行", "帮办代办", "生活陪伴"]);
    assert.ok(page.categories.every((item) => item.amount > 0 && item.fieldText));
    assert.ok(page.recommendedGuides.length >= 2);
    assert.ok(page.recommendedGuides.every((item) => item.id && item.name && item.status === "已认证"));
    assert.ok(page.support.phone);

    const selectedGuide = page.recommendedGuides[0];
    const selectedCategory = page.categories.find((item) => selectedGuide.serviceTypes.includes(item.title)) || page.categories[0];
    const order = await json(baseUrl, "/api/orders", {
      method: "POST",
      token: elder.token,
      body: {
        elderName: page.profile.elderName,
        gender: page.profile.gender,
        age: page.profile.age,
        phone: page.profile.phone,
        serviceType: selectedCategory.title,
        providerType: "guide",
        providerId: selectedGuide.id,
        amount: selectedCategory.amount,
        time: "2026-12-20 09:30",
        location: page.profile.location,
        note: "用户端人工向导页真实接口测试",
        hospital: page.profile.location,
        destination: page.profile.location,
        peopleCount: 1,
        count: 1,
        startPoint: page.profile.location,
        endPoint: page.profile.location,
        duration: "2小时",
        careDuration: "2小时",
        materials: "身份证复印件",
        agencyItem: "用户端人工向导页真实接口测试",
        careRequirement: "用户端人工向导页真实接口测试",
        requirementNote: "用户端人工向导页真实接口测试",
        transportNeed: "用户端人工向导页真实接口测试",
        strictRequirements: true,
        source: "用户端人工向导表单",
      },
    });
    assert.equal(order.providerId, selectedGuide.id);
    assert.equal(order.serviceType, selectedCategory.title);
    assert.equal(order.status, "待派单");
    assert.equal(order.source, "用户端人工向导表单");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user guide page real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
