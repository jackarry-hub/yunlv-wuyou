const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const stylePath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "styles.css");
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
  const styles = fs.readFileSync(stylePath, "utf8");
  assert.match(source, /\/api\/user\/health-services/, "健康服务页必须读取用户健康服务聚合接口");
  assert.match(source, /hydrateHealthServicesFromApi/, "健康服务页必须保留独立真实接口水合逻辑");
  assert.match(source, /data-health-service-id="\$\{attr\(service\.id\)\}"/, "健康服务列表行必须携带真实服务 ID");
  assert.match(source, /\/api\/user\/health-services\/\$\{encodeURIComponent\(serviceId\)\}\/book/, "预约服务必须调用真实预约接口");
  assert.match(source, /\/api\/user\/health-services\/\$\{encodeURIComponent\(serviceId\)\}\/consult/, "立即咨询必须调用真实咨询接口");
  assert.match(source, /\/api\/user\/health-services\/quick-action/, "快捷服务必须调用真实快捷动作接口");
  assert.match(styles, /\.screen-health-services \.ref-health-service-cats[\s\S]*?flex-wrap:\s*nowrap[\s\S]*?overflow-x:\s*auto/, "健康服务分类筛选必须使用单行横向滚动，避免移动端多行大按钮堆叠");
  assert.match(styles, /\.screen-health-services \.ref-health-service-row > strong[\s\S]*?grid-column:\s*3[\s\S]*?grid-row:\s*1[\s\S]*?align-self:\s*start/, "健康服务价格必须固定在服务行右上区域");
  assert.match(styles, /\.screen-health-services \.ref-health-service-row > button[\s\S]*?grid-column:\s*3[\s\S]*?grid-row:\s*1[\s\S]*?align-self:\s*end/, "健康服务预约按钮必须固定在服务行右下区域，避免压住价格");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-health-services-"));
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

    const page = await json(baseUrl, "/api/user/health-services", { token });
    assert.equal(page.sourceEndpoint, "/api/user/health-services");
    assert(Array.isArray(page.quickServices) && page.quickServices.length >= 4, "聚合接口必须返回快捷服务");
    assert(Array.isArray(page.metrics) && page.metrics.length >= 3, "聚合接口必须返回真实健康指标");
    assert(Array.isArray(page.services) && page.services.length >= 3, "聚合接口必须返回健康服务列表");
    assert(page.services.every((service) => service.id && service.title && service.category && service.action && service.bookEndpoint && service.consultEndpoint));
    assert(page.summary.totalServices >= page.services.length);

    const nursing = await json(baseUrl, `/api/user/health-services?category=${encodeURIComponent("康养护理")}`, { token });
    assert(nursing.services.length >= 1, "健康服务分类筛选应返回康养护理服务");
    assert(nursing.services.every((service) => /康养护理|护理|康复|理疗/.test(`${service.category}${service.title}${service.description}`)));

    const service = page.services[0];
    const booked = await json(baseUrl, `/api/user/health-services/${encodeURIComponent(service.id)}/book`, {
      method: "POST",
      token,
      body: { source: "health-services-test" },
    });
    assert.equal(booked.request.route, "health-services");
    assert.equal(booked.request.action, "预约健康服务");
    assert.equal(booked.request.payload.serviceId, service.id);
    assert.equal(booked.action.route, "health-services");

    const consulted = await json(baseUrl, `/api/user/health-services/${encodeURIComponent(service.id)}/consult`, {
      method: "POST",
      token,
      body: { question: "想了解这项服务是否适合高血压老人", source: "health-services-test" },
    });
    assert.equal(consulted.request.route, "health-services");
    assert.equal(consulted.request.action, "健康服务咨询");
    assert.equal(consulted.request.payload.serviceId, service.id);

    const quick = await json(baseUrl, "/api/user/health-services/quick-action", {
      method: "POST",
      token,
      body: { key: "online-consult", source: "health-services-test" },
    });
    assert.equal(quick.request.route, "health-services");
    assert.equal(quick.request.action, "在线问诊");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user health services real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
