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
  const renderStart = source.indexOf("function renderContacts()");
  const renderEnd = source.indexOf("function renderHealthRecord()", renderStart);
  const contactsSource = source.slice(renderStart, renderEnd);
  assert.match(source, /userApi\("\/api\/user\/contacts"/);
  assert.match(contactsSource, /href="tel:\$\{attr\(dialNumber\)\}"/);
  assert.match(contactsSource, /callPriority/);
  assert.match(contactsSource, /notifyAlert/);
  assert.doesNotMatch(contactsSource, /短信<\/b>/, "联系人页不能把未接通的短信预留能力展示为真实通知渠道");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-contacts-"));
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
    const before = await json(baseUrl, "/api/user/contacts", { token: login.token });
    assert.equal(before.sourceEndpoint, "/api/user/contacts");
    assert.equal(before.contacts.length, 2);
    assert.equal(before.summary.contactCount, 2);
    assert.equal(before.notificationSettings.rules.length, 4);
    assert.deepEqual(before.contacts.map((item) => item.callPriority), [...before.contacts.map((item) => item.callPriority)].sort((a, b) => a - b));

    const created = await json(baseUrl, "/api/family-contacts", {
      method: "POST",
      token: login.token,
      body: { name: "接口联系人", relation: "邻居", phone: "13700001234", callPriority: 3, notifyAlert: true },
    });
    assert(created.id);

    const updated = await json(baseUrl, `/api/family-contacts/${created.id}`, {
      method: "PUT",
      token: login.token,
      body: { name: "接口联系人已更新", relation: "社区联系人", phone: "13700001234", callPriority: 1, notifyAlert: false, isDefault: true },
    });
    assert.equal(updated.notifyAlert, false);
    assert.equal(updated.isDefault, true);

    const changedRule = await json(baseUrl, "/api/alerts/emergency-settings", {
      method: "PUT",
      token: login.token,
      body: { key: "device", enabled: false },
    });
    assert.equal(changedRule.rules.find((item) => item.key === "device").enabled, false);

    const call = await json(baseUrl, `/api/family-contacts/${created.id}/call`, {
      method: "POST",
      token: login.token,
      body: { route: "contacts" },
    });
    assert.equal(call.telHref, "tel:13700001234");
    assert(call.action.id);

    const persisted = await json(baseUrl, "/api/user/contacts", { token: login.token });
    const contact = persisted.contacts.find((item) => item.id === created.id);
    assert.equal(contact.name, "接口联系人已更新");
    assert.equal(contact.callPriority, 1);
    assert.equal(contact.notifyAlert, false);
    assert.equal(persisted.summary.defaultContactId, created.id);
    assert(contact.lastInteractionAt);
    assert.equal(persisted.notificationSettings.rules.find((item) => item.key === "device").enabled, false);

    await json(baseUrl, "/api/alerts/emergency-settings", {
      method: "PUT",
      token: login.token,
      body: { key: "device", enabled: true },
    });
    const removed = await json(baseUrl, `/api/family-contacts/${created.id}`, { method: "DELETE", token: login.token, body: {} });
    assert.equal(removed.removed.id, created.id);
    const after = await json(baseUrl, "/api/user/contacts", { token: login.token });
    assert.equal(after.contacts.some((item) => item.id === created.id), false);
    assert.equal(after.summary.contactCount, 2);
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user contacts real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
