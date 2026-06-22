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
  assert.match(source, /\/api\/user\/service-records/, "服务记录页应读取用户服务记录聚合接口");
  assert.match(source, /hydrateServiceRecordsFromApi/, "服务记录页应保留独立真实接口水合逻辑");
  assert.match(source, /data-service-record-id="\$\{attr\(record\.id\)\}"/, "服务记录行必须携带真实记录 ID");
  assert.match(source, /\/api\/user\/service-records\/\$\{encodeURIComponent\(recordId\)\}\/detail/, "查看详情必须调用真实详情接口");
  assert.match(source, /\/api\/user\/service-records\/clear/, "清空服务记录必须调用真实清空接口");
  assert.match(source, /\/api\/user\/service-records\/\$\{encodeURIComponent\(recordId\)\}/, "删除单条服务记录必须调用真实删除接口");
  assert.match(source, /data-service-record-search/, "搜索服务记录必须是可输入控件");
  assert.match(source, /params\.set\("q", serviceRecordsSearchQuery\)/, "搜索服务记录必须把关键词传给真实接口");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-service-records-"));
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

    const chat = await json(baseUrl, "/api/ai/chat", {
      method: "POST",
      token,
      body: { question: "帮我推荐一个康养服务", source: "service-records-test" },
    });
    assert((chat.chat || chat).id);

    const request = await json(baseUrl, "/api/service-requests", {
      method: "POST",
      token,
      body: {
        role: "user",
        route: "assistant",
        action: "AI推荐服务入口",
        type: "陪伴就医",
        providerType: "guide",
        description: "服务记录页真实接口测试",
      },
    });
    assert(request.id);

    const page = await json(baseUrl, "/api/user/service-records", { token });
    assert.equal(page.sourceEndpoint, "/api/user/service-records");
    assert(Array.isArray(page.records), "服务记录聚合接口必须返回 records");
    assert(page.records.length >= 2, "服务记录应聚合 AI 对话和服务推荐请求");
    assert(page.records.every((record) => record.id && record.type && record.title && record.detailEndpoint && record.deleteEndpoint));
    assert.equal(page.filters.find((item) => item.key === "全部")?.count, page.records.length);
    assert(page.summary.total >= page.records.length);

    const aiPage = await json(baseUrl, `/api/user/service-records?type=${encodeURIComponent("AI问答")}`, { token });
    assert(aiPage.records.every((record) => record.type === "AI问答"));

    const searchPage = await json(baseUrl, `/api/user/service-records?q=${encodeURIComponent("服务记录页真实接口测试")}`, { token });
    assert.equal(searchPage.query.q, "服务记录页真实接口测试");
    assert(searchPage.records.length >= 1, "服务记录搜索应返回匹配真实记录");
    assert(searchPage.records.every((record) => `${record.title}${record.text}${record.detail}`.includes("服务记录页真实接口测试")), "搜索结果必须按真实记录字段过滤");

    const sample = page.records[0];
    const detail = await json(baseUrl, `/api/user/service-records/${encodeURIComponent(sample.id)}/detail`, {
      method: "POST",
      token,
      body: { source: "service-records-test" },
    });
    assert.equal(detail.record.id, sample.id);
    assert.equal(detail.action.route, "service-records");
    assert.equal(detail.record.read, true);

    await json(baseUrl, `/api/user/service-records/${encodeURIComponent(sample.id)}`, { method: "DELETE", token });
    const afterDelete = await json(baseUrl, "/api/user/service-records", { token });
    assert(!afterDelete.records.some((record) => record.id === sample.id), "删除后聚合接口不应再返回该记录");

    await json(baseUrl, "/api/user/service-records/clear", { method: "POST", token, body: { source: "service-records-test" } });
    const afterClear = await json(baseUrl, "/api/user/service-records", { token });
    assert.equal(afterClear.records.length, 0);
    assert(afterClear.summary.archived >= page.records.length);
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user service records real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
