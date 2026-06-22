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
    "function hydrateGuideSettingsFromApi",
    "guideApiRequest('/api/guide/settings?guideId=guide-001')",
    "function applyGuideSettingsData",
    "function updateGuideSetting",
    "function logoutGuideSession",
    "data-guide-settings-toggle",
    "data-guide-settings-refresh",
    "data-guide-settings-logout",
    "/api/guide/session/logout",
  ].forEach((needle) => assert(source.includes(needle), `向导端设置 #41 必须接入真实设置接口与功能：${needle}`));

  const renderStart = source.indexOf("function renderSettings()");
  const renderEnd = source.indexOf("function renderHelp()", renderStart);
  assert(renderStart >= 0 && renderEnd > renderStart, "必须能定位设置页面渲染函数");
  const renderSource = source.slice(renderStart, renderEnd);
  ["声音+震动"].forEach((text) => {
    assert(!renderSource.includes(text), `设置页面不能继续硬编码演示文案：${text}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-settings-"));
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
    assert(health.apiGroups.includes("guide-settings"), "健康检查必须登记 guide-settings 接口组");

    const settings = await json(baseUrl, "/api/guide/settings?guideId=guide-001", { token: guide.token });
    assert.equal(settings.sourceEndpoint, "/api/guide/settings");
    assert.equal(settings.guide.id, "guide-001");
    assert.equal(settings.actions.refresh.endpoint, "/api/guide/settings");
    assert.equal(settings.actions.update.endpoint, "/api/guide/settings");
    assert.equal(settings.actions.logout.endpoint, "/api/guide/session/logout");
    assert.ok(settings.securityRows.some((row) => row.key === "privacyPermission"), "设置接口必须返回隐私权限行");
    assert.ok(settings.notificationRows.some((row) => row.key === "messageNotification"), "设置接口必须返回消息通知行");
    assert.ok(settings.protocolRows.some((row) => row.title === "服务规范"), "设置接口必须返回协议入口");
    assert.equal(typeof settings.settings.privacy.privacyPermission, "boolean");
    assert.equal(typeof settings.settings.notifications.messageNotification, "boolean");

    const bareSettings = await json(baseUrl, "/guide/settings?guideId=guide-001", { token: guide.token });
    assert.equal(bareSettings.sourceEndpoint, "/api/guide/settings");

    const changed = await json(baseUrl, "/api/guide/settings", {
      method: "PUT",
      token: guide.token,
      body: {
        guideId: "guide-001",
        privacy: { privacyPermission: !settings.settings.privacy.privacyPermission },
        notifications: { messageNotification: !settings.settings.notifications.messageNotification },
        protocolConfirmed: { 服务规范: true },
      },
    });
    assert.equal(changed.settings.privacy.privacyPermission, !settings.settings.privacy.privacyPermission);
    assert.equal(changed.settings.notifications.messageNotification, !settings.settings.notifications.messageNotification);
    assert.equal(changed.settings.protocolConfirmed["服务规范"], true);

    const persisted = await json(baseUrl, "/api/guide/settings?guideId=guide-001", { token: guide.token });
    assert.equal(persisted.settings.privacy.privacyPermission, changed.settings.privacy.privacyPermission);
    assert.equal(persisted.settings.notifications.messageNotification, changed.settings.notifications.messageNotification);
    assert.equal(persisted.settings.protocolConfirmed["服务规范"], true);

    const loggedOut = await json(baseUrl, "/api/guide/session/logout", {
      method: "POST",
      token: guide.token,
      body: { guideId: "guide-001" },
    });
    assert.equal(loggedOut.sourceEndpoint, "/api/guide/session/logout");
    assert.equal(loggedOut.status, "已退出");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide settings real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
