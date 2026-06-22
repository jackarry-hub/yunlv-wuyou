const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
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
  const shell = fs.readFileSync(indexPath, "utf8");

  assert.match(source, /"transport": hydrateTransportFromApi/, "交通出行页必须接入真实接口水合");
  assert.match(source, /async function hydrateTransportFromApi/, "交通出行页必须保留独立真实接口水合函数");
  assert.match(source, /userApi\(`\/api\/user\/transport\$\{params\.toString\(\)/, "交通出行页必须调用 /api/user/transport 并支持目的地参数");
  assert.match(source, /data-transport-route-id="\$\{attr\(route\.id\)\}"/, "推荐路线必须携带真实路线 ID");
  assert.match(source, /data-transport-service-key="\$\{attr\(service\.key\)\}"/, "快捷服务必须携带真实服务 Key");
  assert.match(source, /\/api\/user\/transport\/route/, "规划路线必须调用真实路线接口");
  assert.match(source, /\/api\/user\/transport\/services\/\$\{encodeURIComponent\(serviceKey\)\}\/request/, "快捷交通服务必须调用真实请求接口");
  assert.match(source, /ensureLivePanel\("transport-service-current"/, "快捷交通服务结果必须复用同一个当前服务面板");
  assert.doesNotMatch(source, /ensureLivePanel\(`transport-service-\$\{serviceKey\}`/, "快捷交通服务不能连续堆叠多个服务结果面板");
  assert.match(source, /\/api\/user\/transport\/nearby/, "查看周边必须读取真实周边交通接口");
  assert.match(source, /\/api\/user\/transport\/records/, "行程记录必须读取真实行程记录接口");
  assert.match(source, /if \(await handleTransportAction\(actionButton, actionName\)\) return;/, "交通出行动作必须等待真实接口完成");
  assert(shell.includes("app.js?v=user-transport-real-api-20260620"), "用户端 H5 入口必须刷新脚本版本，避免旧交通页缓存");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-transport-"));
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

    const page = await json(baseUrl, "/api/user/transport", { token });
    assert.equal(page.sourceEndpoint, "/api/user/transport");
    assert(page.origin?.title && page.origin?.city, "交通接口必须返回真实出发地");
    assert(Array.isArray(page.commonDestinations) && page.commonDestinations.length >= 4, "交通接口必须返回常用目的地");
    assert(Array.isArray(page.quickServices) && page.quickServices.length >= 6, "交通接口必须返回快捷交通服务");
    assert(Array.isArray(page.nearby) && page.nearby.length >= 3, "交通接口必须返回周边交通");
    assert(Array.isArray(page.routes) && page.routes.length >= 3, "交通接口必须返回推荐路线");
    assert(Array.isArray(page.records) && page.records.length >= 3, "交通接口必须返回行程记录");
    assert(page.quickServices.every((service) => service.key && service.action && service.requestEndpoint), "快捷服务必须返回可请求端点");
    assert(page.routes.every((route) => route.id && route.title && route.destination && route.navigationEndpoint), "推荐路线必须返回可导航端点");

    const toRailway = await json(baseUrl, `/api/user/transport?destination=${encodeURIComponent("昆明南站")}`, { token });
    assert.equal(toRailway.query.destination, "昆明南站");
    assert(toRailway.routes.some((route) => `${route.title}${route.destination}`.includes("昆明南站")), "目的地参数必须影响推荐路线");

    const planned = await json(baseUrl, "/api/user/transport/route", {
      method: "POST",
      token,
      body: { origin: page.origin.title, destination: "昆明南站", source: "transport-test" },
    });
    assert.equal(planned.route.destination, "昆明南站");
    assert.match(planned.route.url, /^https:\/\/uri\.amap\.com\//, "规划路线必须返回可打开的高德导航链接");
    assert(!decodeURIComponent(planned.route.url).includes("昆明昆明南站"), "高德导航目的地不能重复拼接城市名称");
    assert.equal(planned.action.route, "transport");

    const service = await json(baseUrl, "/api/user/transport/services/car-book/request", {
      method: "POST",
      token,
      body: { destination: "昆明南站", source: "transport-test" },
    });
    assert.equal(service.request.route, "transport");
    assert.equal(service.request.action, "预约用车");
    assert.equal(service.request.payload.serviceKey, "car-book");
    assert.equal(service.action.route, "transport");

    const nearby = await json(baseUrl, "/api/user/transport/nearby", { token });
    assert(Array.isArray(nearby.nearby) && nearby.nearby.length >= 3, "周边交通接口必须返回站点/服务点");

    const records = await json(baseUrl, "/api/user/transport/records", { token });
    assert(records.records.some((record) => record.id === planned.record.id), "规划路线后行程记录必须包含新记录");
    assert(records.records.some((record) => record.relatedRequestId === service.request.id), "快捷服务请求必须进入行程记录");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user transport real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
