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
  const renderStart = source.indexOf("function renderFamily()");
  const renderEnd = source.indexOf("function renderSettings()", renderStart);
  const familySource = source.slice(renderStart, renderEnd);
  assert.match(familySource, /familyPageState/);
  assert.match(familySource, /data-family-source/);
  assert.match(familySource, /latestInvitation/);
  assert.doesNotMatch(familySource, /family-invite-qr\.png|05\/26 09:10|张小红/, "家属页不能继续使用静态二维码或绑定记录");
  assert.match(source, /userApi\("\/api\/user\/family"/);
  assert.match(source, /userApi\("\/api\/user\/family\/permissions"/);
  assert.match(source, /userApi\("\/api\/user\/family\/invitations"/);
  assert.match(familySource, /href="tel:\$\{attr\(dialNumber\)\}"/);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-family-"));
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
    const before = await json(baseUrl, "/api/user/family", { token: login.token });
    assert.equal(before.sourceEndpoint, "/api/user/family");
    assert.equal(before.contacts.length, 2);
    assert.equal(before.contacts[0].name, "李女士");
    assert(before.contacts[0].scopes.includes("健康摘要"));
    assert.equal(before.permissions.length, 4);
    assert(before.bindingRecords.some((item) => item.contactId === "contact-001"));
    assert.equal(before.latestInvitation, null);

    const permissionResult = await json(baseUrl, "/api/user/family/permissions", {
      method: "PUT",
      token: login.token,
      body: { key: "healthData", enabled: false },
    });
    assert.equal(permissionResult.permissions.find((item) => item.key === "healthData").enabled, false);
    assert.equal(permissionResult.contacts[0].permissions.healthData, false);
    assert(!permissionResult.contacts[0].scopes.includes("健康摘要"));

    const suffix = Date.now().toString().slice(-8);
    const invited = await json(baseUrl, "/api/user/family/invitations", {
      method: "POST",
      token: login.token,
      body: { name: `测试家属${suffix}`, relation: "侄女", phone: "13700001234", channel: "qr" },
    });
    assert.equal(invited.invitation.status, "待家属确认");
    assert.match(invited.invitation.qrDataUrl, /^data:image\/png;base64,/);
    assert.match(invited.invitation.inviteUrl, new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\/user\/\\?familyInvite=`));
    assert.equal(invited.page.summaries.pendingInvitationCount, 1);
    assert(invited.page.bindingRecords.some((item) => item.invitationId === invited.invitation.id));

    const updatedContact = await json(baseUrl, "/api/family-contacts/contact-001", {
      method: "PUT",
      token: login.token,
      body: {
        familyPermissions: {
          healthData: true,
          deviceAlerts: true,
          serviceOrders: false,
          emergencyLocation: true,
        },
      },
    });
    assert.equal(updatedContact.familyPermissions.serviceOrders, false);
    await json(baseUrl, "/api/family-contacts/contact-001/call", { method: "POST", token: login.token, body: { route: "family" } });

    const after = await json(baseUrl, "/api/user/family", { token: login.token });
    const contact = after.contacts.find((item) => item.id === "contact-001");
    assert.equal(contact.permissions.serviceOrders, false);
    assert(contact.lastInteractionAt);
    assert.equal(after.latestInvitation.id, invited.invitation.id);
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user family real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
