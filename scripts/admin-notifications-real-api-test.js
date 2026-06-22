const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adminSourcePath = path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js");

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
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

function extractBlock(source, functionName, nextFunctionName) {
  const start = source.indexOf(`function ${functionName}`);
  const end = source.indexOf(`function ${nextFunctionName}`);
  assert(start >= 0 && end > start, `${functionName} block not found`);
  return source.slice(start, end);
}

async function main() {
  const source = fs.readFileSync(adminSourcePath, "utf8");

  [
    'if (page.id === "notifications") return renderAdminNotificationsReference(page);',
    "function renderAdminNotificationsReference(",
    "function adminNotificationRows(",
    "function handleAdminNotificationAction(",
    "adminMessageState.messages",
    'adminApi("/api/messages?role=admin")',
    'adminApi("/api/messages/read-all"',
    "data-admin-notification-read",
    "data-admin-notification-filter",
    "data-admin-notification-refresh",
  ].forEach((needle) => {
    assert(source.includes(needle), `消息通知中心必须接入真实消息接口和专用操作：${needle}`);
  });

  const renderBlock = extractBlock(source, "renderAdminNotificationsReference", "adminNotificationRows");
  [
    "systemRows(",
    "rowsForDomain(",
    "renderSideInsights(",
    "kpis(",
    "账号数",
    "audit-",
  ].forEach((needle) => {
    assert(!renderBlock.includes(needle), `消息通知中心不能继续复用系统日志/账号通用模板：${needle}`);
  });
  ["消息标题", "接收角色", "消息类型", "已读状态", "触达时间", "操作"].forEach((needle) => {
    assert(renderBlock.includes(needle), `消息通知中心列表必须展示通知字段：${needle}`);
  });

  const actionBlock = extractBlock(source, "handleAdminNotificationAction", "handleAdminInlineStateAction");
  [
    "/api/messages/read-all",
    "/api/messages/${id}/read",
    "ensureAdminMessages(true)",
    "adminNotificationState.filter",
  ].forEach((needle) => {
    assert(actionBlock.includes(needle), `消息通知中心按钮必须调用真实已读/刷新功能：${needle}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-admin-notifications-"));
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
    const admin = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "admin" } });
    const before = await json(baseUrl, "/api/messages?role=admin", { token: admin.token });
    assert(before.length >= 1, "后台通知中心接口必须返回管理员消息");
    assert(before.every((item) => item.id && item.title && item.toRole === "admin" && typeof item.read === "boolean"), "管理员消息必须包含 id、title、toRole、read");

    const unread = before.find((item) => !item.read);
    if (unread) {
      const updated = await json(baseUrl, `/api/messages/${unread.id}/read`, {
        method: "POST",
        token: admin.token,
        body: { role: "admin" },
      });
      assert.equal(updated.id, unread.id, "单条已读接口必须返回被操作消息");
      assert.equal(updated.read, true, "单条已读接口必须真实更新已读状态");
    }

    const readAll = await json(baseUrl, "/api/messages/read-all", {
      method: "POST",
      token: admin.token,
      body: { role: "admin" },
    });
    assert.equal(readAll.role, "admin", "全部已读接口必须作用于管理员角色");
    assert.equal(readAll.unread, 0, "全部已读接口必须清空管理员未读数");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin notifications real-api test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
