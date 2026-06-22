const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const guideAppPath = path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  [
    "function hydrateGuideMessagesCenterFromApi",
    "guideApiRequest('/api/guide/messages?guideId=guide-001')",
    "function applyGuideMessagesCenterData",
    "function refreshGuideMessagesCenter",
    "function markGuideMessagesReadAll",
    "function markGuideMessageRead",
    "data-guide-message-refresh",
    "data-guide-message-read-all",
    "data-guide-message-read",
  ].forEach((needle) => assert(source.includes(needle), `向导端消息 #06 必须接入真实消息接口与功能：${needle}`));

  const renderStart = source.indexOf("function renderMessages()");
  const renderEnd = source.indexOf("function isGuideOrderMessage", renderStart);
  assert(renderStart >= 0 && renderEnd > renderStart, "必须能定位消息中心页面渲染函数");
  const renderSource = source.slice(renderStart, renderEnd);
  ["已从 /api", "真实接口", "接口 ·"].forEach((text) => {
    assert(!renderSource.includes(text), `消息中心不能展示验收调试文案：${text}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-messages-"));
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
    assert(health.apiGroups.includes("guide-messages"), "健康检查必须登记 guide-messages 接口组");

    const center = await json(baseUrl, "/api/guide/messages?guideId=guide-001", { token: guide.token });
    assert.equal(center.sourceEndpoint, "/api/guide/messages");
    assert.equal(center.messagesEndpoint, "/api/messages?role=guide");
    assert.equal(center.actions.refresh.endpoint, "/api/guide/messages");
    assert.equal(center.actions.readAll.endpoint, "/api/messages/read-all");
    assert.equal(center.actions.read.endpoint, "/api/messages/{id}/read");
    assert.equal(center.actions.orderMessages.route, "32");
    assert.equal(center.actions.customerChat.route, "33");
    assert.equal(center.actions.support.route, "34");
    assert.equal(center.guide.id, "guide-001");
    assert.ok(Array.isArray(center.messages), "消息中心必须返回消息数组");
    assert.ok(center.messages.length >= 1, "消息中心必须返回真实向导消息");
    assert.equal(center.summary.total, center.messages.length);
    assert.equal(center.summary.systemCount, center.systemNotices.length);
    assert.equal(center.summary.orderCount, center.orderMessages.length);
    assert.equal(center.summary.interactiveCount, center.interactiveMessages.length);
    assert.ok(center.summary.orderCount >= 1, "消息中心必须能识别真实订单/任务消息");
    assert.ok(center.messages.every((item) => item.category && item.route), "每条消息必须返回分类和可跳转路由");

    const bareCenter = await json(baseUrl, "/guide/messages?guideId=guide-001", { token: guide.token });
    assert.equal(bareCenter.sourceEndpoint, "/api/guide/messages");

    const unread = center.messages.find((item) => !item.read);
    if (unread) {
      const marked = await json(baseUrl, `/api/messages/${encodeURIComponent(unread.id)}/read`, {
        method: "POST",
        token: guide.token,
        body: { role: "guide" },
      });
      assert.equal(marked.read, true);
      const afterSingleRead = await json(baseUrl, "/api/guide/messages?guideId=guide-001", { token: guide.token });
      const markedAgain = afterSingleRead.messages.find((item) => item.id === unread.id);
      assert.equal(markedAgain.read, true, "单条已读必须反映到消息中心聚合接口");
    }

    const readAll = await json(baseUrl, "/api/messages/read-all", {
      method: "POST",
      token: guide.token,
      body: { role: "guide" },
    });
    assert.equal(readAll.unread, 0);
    const afterReadAll = await json(baseUrl, "/api/guide/messages?guideId=guide-001", { token: guide.token });
    assert.equal(afterReadAll.summary.unread, 0, "全部已读后消息中心未读数必须归零");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide messages real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
