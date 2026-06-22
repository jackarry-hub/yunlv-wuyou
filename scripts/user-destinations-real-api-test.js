const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const stylesPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "styles.css");
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
  assert.match(source, /\/api\/user\/destinations/, "目的地页必须读取用户目的地聚合接口");
  assert.match(source, /hydrateDestinationsFromApi/, "目的地页必须保留独立真实接口水合逻辑");
  assert.match(source, /hydrateDestinationDetailFromApi/, "目的地详情必须保留独立真实接口水合逻辑");
  assert.match(source, /data-destination-id="\$\{attr\(destination\.id\)\}"/, "目的地卡片必须携带真实目的地 ID");
  assert.match(source, /\/api\/user\/destinations\/\$\{encodeURIComponent\(destinationId\)\}/, "目的地详情必须调用真实详情接口");
  assert.match(source, /\/api\/user\/destinations\/\$\{encodeURIComponent\(destinationId\)\}\/favorite/, "收藏目的地必须调用真实收藏接口");
  assert.match(source, /\/api\/user\/destinations\/\$\{encodeURIComponent\(destinationId\)\}\/consult/, "咨询目的地必须调用真实咨询接口");
  assert.match(source, /params\.set\("tag", activeDestinationFilter\)/, "目的地筛选必须把标签传给真实接口");
  assert.match(source, /routeBlockedByNestedAction/, "目的地卡片内的收藏和咨询按钮不能被父级详情路由抢先处理");
  assert.match(source, /class="destination-card-actions"/, "目的地卡片按钮必须分组到紧凑操作区，避免在手机端竖向堆叠");
  assert.match(styles, /\.screen-destinations \.ref-destination-grid footer\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s, "目的地卡片 footer 必须保留距离和操作区的稳定布局");
  assert.match(styles, /\.screen-destinations \.ref-destination-grid footer \.destination-card-actions\s*{[^}]*width:\s*100%/s, "目的地卡片操作区必须占满卡片宽度，让三颗按钮横向等宽排列");
  assert.match(styles, /\.screen-destinations \.ref-destination-grid footer \.destination-card-actions\s*{[^}]*display:\s*flex/s, "目的地卡片操作区必须横向排列按钮");
  assert.match(source, /destinationInfoUpdateText/, "目的地页底部更新时间必须使用手机端短文案，避免信息条换行");
  assert.match(styles, /\.screen-destinations \.info-banner\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/s, "目的地页底部信息条必须用左侧可收缩、右侧自适应的网格布局");
  assert.match(styles, /\.screen-destinations \.info-banner \.ref-destination-total-button\s*{[^}]*white-space:\s*nowrap/s, "目的地总览按钮必须禁止换行");
  assert.doesNotMatch(styles, /\.screen-destinations \.info-banner \.ref-destination-total-button\s*{[^}]*height:\s*52px/s, "目的地总览按钮不能写死 52px 高度导致文字垂直断行");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-destinations-"));
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

    const page = await json(baseUrl, "/api/user/destinations", { token });
    assert.equal(page.sourceEndpoint, "/api/user/destinations");
    assert(Array.isArray(page.destinations) && page.destinations.length >= 4, "目的地聚合接口必须返回真实目的地列表");
    assert(Array.isArray(page.filters) && page.filters.length >= 4, "目的地聚合接口必须返回筛选项和数量");
    assert(page.destinations.every((destination) => (
      destination.id &&
      destination.title &&
      destination.city &&
      destination.address &&
      Array.isArray(destination.tags) &&
      destination.detailEndpoint &&
      destination.favoriteEndpoint &&
      destination.consultEndpoint
    )), "每个目的地必须携带详情、收藏、咨询端点");
    assert(page.summary.total >= page.destinations.length, "目的地统计必须来自聚合接口");

    const climate = await json(baseUrl, `/api/user/destinations?tag=${encodeURIComponent("气候宜人")}`, { token });
    assert.equal(climate.query.tag, "气候宜人");
    assert(climate.destinations.length >= 1, "气候宜人筛选应返回匹配目的地");
    assert(climate.destinations.every((destination) => `${destination.title}${destination.city}${destination.description}${destination.tags.join("")}${destination.keywords.join("")}`.includes("气候") || destination.tags.includes("气候宜人")), "筛选结果必须按真实目的地标签过滤");

    const search = await json(baseUrl, `/api/user/destinations?q=${encodeURIComponent("滇池")}`, { token });
    assert.equal(search.query.q, "滇池");
    assert(search.destinations.length >= 1, "目的地搜索应返回匹配真实记录");
    assert(search.destinations.every((destination) => `${destination.title}${destination.city}${destination.address}${destination.description}`.includes("滇池")));

    const sample = page.destinations[0];
    const detail = await json(baseUrl, `/api/user/destinations/${encodeURIComponent(sample.id)}`, { token });
    assert.equal(detail.destination.id, sample.id);
    assert.equal(detail.destination.detailEndpoint, `/api/user/destinations/${encodeURIComponent(sample.id)}`);
    assert(Array.isArray(detail.destination.reasons) && detail.destination.reasons.length >= 3, "目的地详情必须返回推荐理由");

    const favorite = await json(baseUrl, `/api/user/destinations/${encodeURIComponent(sample.id)}/favorite`, {
      method: "POST",
      token,
      body: { favorite: true, source: "destinations-test" },
    });
    assert.equal(favorite.destination.id, sample.id);
    assert.equal(favorite.destination.favorite, true);
    assert.equal(favorite.action.route, "destinations");
    assert.equal(favorite.action.action, "收藏目的地");
    const afterFavorite = await json(baseUrl, "/api/user/destinations", { token });
    assert(afterFavorite.destinations.some((destination) => destination.id === sample.id && destination.favorite === true), "收藏后聚合接口必须返回收藏状态");

    const consult = await json(baseUrl, `/api/user/destinations/${encodeURIComponent(sample.id)}/consult`, {
      method: "POST",
      token,
      body: { question: "想了解旅居方案和周边医疗", source: "destinations-test" },
    });
    assert.equal(consult.request.route, "destinations");
    assert.equal(consult.request.action, "目的地咨询");
    assert.equal(consult.request.payload.destinationId, sample.id);
    assert.equal(consult.action.route, "destinations");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user destinations real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
