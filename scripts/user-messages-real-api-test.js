const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const userAppPath = path.join(
  root,
  "云旅无忧UI界面参考图",
  "用户端",
  "云旅无忧用户端代码实现",
  "app.js",
);

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {}
    await delay(120);
  }
  throw new Error(`server did not start\n${output()}`);
}

async function request(baseUrl, route, options = {}) {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };
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
  if (!response.ok || !payload.success) {
    throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  }
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(userAppPath, "utf8");
  assert.match(source, /userApi\("\/api\/messages\?role=user"\)/, "消息列表必须从真实接口读取");
  assert.match(source, /userApi\("\/api\/messages\/read-all"/, "全部已读必须调用真实接口");
  assert.match(source, /userApi\(`\/api\/messages\/\$\{encodeURIComponent\(messageId\)\}\/read`/, "单条已读必须调用真实接口");
  assert.match(source, /data-message-id="\$\{attr\(message\.id \|\| ""\)\}"/, "消息行必须保留后台消息 ID");
  assert.match(source, /messageRelatedTarget\(message\)/, "消息详情必须按后台关联对象跳转");
  assert.match(source, /async function hydrateOrderDetailFromApi\(\)/, "关联订单详情必须从订单接口加载");
  assert.match(source, /userApi\(`\/api\/orders\/\$\{encodeURIComponent\(selectedOrderId\)\}`\)/, "关联订单详情必须按消息中的订单 ID 查询");
  assert.equal(source.includes("const DEFAULT_USER_MESSAGES"), false, "消息页不能保留静态假消息回退");
  assert.equal(source.includes("当前为试运营模拟通话"), false, "消息页不能保留模拟通话假消息");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-messages-"));
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
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const merchant = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "merchant" } });

    const messages = await json(baseUrl, "/api/messages?role=user", { token: elder.token });
    assert(messages.length > 0, "种子数据必须包含用户消息");
    assert(messages.every((item) => item.toRole === "user"), "用户端只能返回用户消息");

    const crossRoleRead = await request(baseUrl, "/api/messages?role=merchant", { token: elder.token });
    assert.equal(crossRoleRead.response.status, 403, "用户不能读取商户消息");

    const unread = messages.find((item) => !item.read);
    assert(unread, "种子数据必须包含未读消息");
    const readMessage = await json(baseUrl, `/api/messages/${unread.id}/read`, {
      method: "POST",
      token: elder.token,
      body: { role: "user" },
    });
    assert.equal(readMessage.id, unread.id);
    assert.equal(readMessage.read, true);

    const merchantMessages = await json(baseUrl, "/api/messages?role=merchant", { token: merchant.token });
    const merchantMessage = merchantMessages[0];
    if (merchantMessage) {
      const crossRoleWrite = await request(baseUrl, `/api/messages/${merchantMessage.id}/read`, {
        method: "POST",
        token: elder.token,
        body: { role: "user" },
      });
      assert.equal(crossRoleWrite.response.status, 404, "用户不能标记商户消息已读");
    }

    const allRead = await json(baseUrl, "/api/messages/read-all", {
      method: "POST",
      token: elder.token,
      body: { role: "user" },
    });
    assert.equal(allRead.role, "user");
    assert.equal(allRead.unread, 0);
    const after = await json(baseUrl, "/api/messages?role=user", { token: elder.token });
    assert(after.every((item) => item.read), "全部已读必须持久化到数据库");

    const crossRoleAllRead = await request(baseUrl, "/api/messages/read-all", {
      method: "POST",
      token: elder.token,
      body: { role: "merchant" },
    });
    assert.equal(crossRoleAllRead.response.status, 403, "用户不能批量操作商户消息");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user messages real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
