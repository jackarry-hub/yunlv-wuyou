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
  assert.match(source, /\/api\/user\/activity-records/, "活动记录页应接入用户活动报名记录聚合接口");
  assert.match(source, /data-activity-record-filter/, "活动记录筛选应绑定真实筛选控件");
  assert.match(source, /data-action="查看活动详情"/, "活动记录卡片应使用真实详情动作，而不是无状态占位");
  assert.match(source, /data-activity-id="\$\{attr\(activityId\)\}"/, "活动记录卡片与操作必须携带真实活动 ID");
  assert.match(source, /\/api\/activities\/\$\{encodeURIComponent\(activityId\)\}\/cancel/, "取消报名必须调用真实取消接口");
  assert.match(source, /\/api\/activities\/\$\{encodeURIComponent\(activityId\)\}\/join/, "重新报名必须调用真实报名接口");
  assert.match(source, /\/api\/ui\/actions/, "签到和评价必须写入真实操作流水接口");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-activity-records-"));
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
    const page = await json(baseUrl, "/api/user/activity-records", { token: login.token });
    assert.equal(page.sourceEndpoint, "/api/user/activity-records");
    assert(Array.isArray(page.records), "活动记录聚合接口必须返回 records");
    assert(page.records.length > 0, "种子数据应包含用户活动报名记录");
    assert.equal(page.summary.total, page.records.length);
    assert.equal(page.filters.find((item) => item.key === "全部")?.count, page.summary.total);
    assert(page.records.every((record) => record.signupId && record.activityId && record.actions && record.endpoints));
    const taijiRecord = page.records.find((record) => record.activityId === "activity-001");
    assert.equal(taijiRecord?.participantCount, 28, "活动记录报名人数应优先使用活动后台 joined 人数");
    assert.equal(taijiRecord?.peopleText, "28人已报名");

    const waiting = await json(baseUrl, `/api/user/activity-records?status=${encodeURIComponent("待参加")}`, { token: login.token });
    assert(waiting.records.every((record) => record.normalizedStatus === "待参加"));

    const activeRecord = page.records.find((record) => record.actions?.canCancel) || page.records[0];
    assert(activeRecord.activityId, "活动记录必须可追溯到活动 ID");
    await json(baseUrl, `/api/activities/${encodeURIComponent(activeRecord.activityId)}/cancel`, {
      method: "POST",
      token: login.token,
      body: { signupId: activeRecord.signupId, reason: "活动记录页真实接口测试" },
    });
    const cancelled = await json(baseUrl, `/api/user/activity-records?status=${encodeURIComponent("已取消")}`, { token: login.token });
    const cancelledRecord = cancelled.records.find((record) => record.signupId === activeRecord.signupId);
    assert(cancelledRecord, "取消后应能在已取消筛选中查到原报名记录");
    assert.equal(cancelledRecord.normalizedStatus, "已取消");
    assert.equal(cancelledRecord.cancelReason, "活动记录页真实接口测试");
    assert(cancelledRecord.canceledAt, "取消记录必须返回取消时间");
    assert(cancelled.summary.cancelled >= 1);

    await json(baseUrl, `/api/activities/${encodeURIComponent(activeRecord.activityId)}/join`, {
      method: "POST",
      token: login.token,
      body: { source: "activity-records-test" },
    });
    const afterJoin = await json(baseUrl, "/api/user/activity-records", { token: login.token });
    assert(afterJoin.records.some((record) => record.activityId === activeRecord.activityId && record.normalizedStatus === "待参加"));
    assert(afterJoin.summary.signed >= 1);

    const action = await json(baseUrl, "/api/ui/actions", {
      method: "POST",
      token: login.token,
      body: {
        role: "user",
        route: "activity-records",
        action: "活动扫码签到",
        payload: { activityId: activeRecord.activityId, signupId: activeRecord.signupId, title: activeRecord.title },
      },
    });
    assert.equal(action.action, "活动扫码签到");
    assert(action.id);
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user activity records real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
