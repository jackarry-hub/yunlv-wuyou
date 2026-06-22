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

async function request(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  return { response, payload };
}

async function json(baseUrl, route, options = {}) {
  const { response, payload } = await request(baseUrl, route, options);
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(appPath, "utf8");
  const shell = fs.readFileSync(indexPath, "utf8");

  assert.match(source, /"checkin": hydrateCheckinFromApi/, "旅居打卡页必须接入真实接口水合");
  assert.match(source, /async function hydrateCheckinFromApi/, "旅居打卡页必须保留独立真实接口水合函数");
  assert.match(source, /userApi\(`\/api\/user\/checkin\$\{params\.toString\(\)/, "旅居打卡页必须调用 /api/user/checkin 并支持分类筛选参数");
  assert.match(source, /data-checkin-record-id="\$\{attr\(record\.id\)\}"/, "打卡记录必须携带真实记录 ID");
  assert.match(source, /\/api\/user\/checkin\/photo/, "拍照打卡必须提交真实接口");
  assert.match(source, /\/api\/user\/checkin\/records\/\$\{encodeURIComponent\(recordId\)\}/, "查看打卡记录必须调用真实详情接口");
  assert.match(source, /\/api\/user\/checkin\/records\/\$\{encodeURIComponent\(recordId\)\}\/like/, "打卡记录点赞必须调用真实接口");
  assert.match(source, /if \(await handleCheckinAction\(actionButton, actionName\)\) return;/, "旅居打卡异步动作必须等待真实接口完成");
  assert(shell.includes("app.js?v=user-transport-real-api-20260620"), "用户端 H5 入口必须刷新脚本版本，避免旧打卡页缓存");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-checkin-"));
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

    const page = await json(baseUrl, "/api/user/checkin", { token });
    assert.equal(page.sourceEndpoint, "/api/user/checkin");
    assert(page.today?.place && page.today?.stepsText, "打卡接口必须返回今日打卡真实摘要");
    assert(Array.isArray(page.typeFilters) && page.typeFilters.length >= 4, "打卡接口必须返回分类筛选");
    assert(Array.isArray(page.records) && page.records.length >= 3, "打卡接口必须返回近期记录");
    assert(page.records.every((record) => record.id && record.type && record.detailEndpoint && record.likeEndpoint), "每条打卡记录必须返回可操作 ID 与接口");

    const health = await json(baseUrl, `/api/user/checkin?type=${encodeURIComponent("健康打卡")}`, { token });
    assert(health.records.length >= 1, "健康打卡筛选必须返回真实记录");
    assert(health.records.every((record) => record.type === "健康打卡"), "打卡分类筛选必须由接口结果驱动");

    const detail = await json(baseUrl, `/api/user/checkin/records/${encodeURIComponent(page.records[0].id)}`, { token });
    assert.equal(detail.record.id, page.records[0].id, "记录详情接口必须返回指定打卡记录");

    const liked = await json(baseUrl, `/api/user/checkin/records/${encodeURIComponent(page.records[0].id)}/like`, {
      method: "POST",
      token,
      body: { liked: true, type: "全部" },
    });
    assert.equal(liked.record.liked, true);
    assert.equal(liked.record.likesCount, page.records[0].likesCount + 1, "打卡点赞必须持久化计数");

    const created = await json(baseUrl, "/api/user/checkin/photo", {
      method: "POST",
      token,
      body: {
        fileName: "checkin-test.jpg",
        fileSize: 2048,
        type: "景点打卡",
        title: "接口拍照打卡",
        place: "湖泉生态园",
        text: "通过真实接口保存拍照打卡",
      },
    });
    assert.equal(created.record.title, "接口拍照打卡");
    assert.equal(created.record.type, "景点打卡");
    assert(created.page.records.some((record) => record.id === created.record.id), "拍照打卡后聚合页必须包含新记录");

    const after = await json(baseUrl, "/api/user/checkin", { token });
    const persisted = after.records.find((record) => record.id === created.record.id);
    assert(persisted, "新打卡记录必须持久化到打卡列表");
    assert.equal(persisted.place, "湖泉生态园");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user checkin real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
