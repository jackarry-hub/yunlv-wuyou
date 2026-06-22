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
  const personalStart = source.indexOf("function renderPersonal()");
  const personalEnd = source.indexOf("function renderFamily()", personalStart);
  const personalSource = source.slice(personalStart, personalEnd);
  assert.match(personalSource, /userPersonalState/);
  assert.match(personalSource, /\/api\/user\/personal/);
  assert.match(personalSource, /data-personal-authorization/);
  assert.doesNotMatch(personalSource, /personal-safety-qr-ref\.png/, "个人安全码不能继续使用静态示例图片");
  assert.match(source, /await userApi\("\/api\/user\/personal"/);
  assert.match(source, /body: \{ authorizations: \{ \[key\]: nextEnabled \} \}/);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-personal-"));
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
    const before = await json(baseUrl, "/api/user/personal", { token: elder.token });
    assert.equal(before.sourceEndpoint, "/api/user/personal");
    assert.match(before.safetyCode.qrDataUrl, /^data:image\/png;base64,/);
    assert.match(before.safetyCode.scanUrl, new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\/api\/user\/safety-code\/`));
    assert.deepEqual(before.authorizations, { location: true, healthData: true, notifications: true });

    const suffix = Date.now().toString().slice(-5);
    const updated = await json(baseUrl, "/api/user/personal", {
      method: "PUT",
      token: elder.token,
      body: {
        user: {
          nickname: `李秀兰${suffix}`,
          phone: "13800005678",
          currentCity: "大理",
          address: `大理市洱海路 ${suffix} 号`,
        },
        elderProfile: {
          name: `李秀兰${suffix}`,
          gender: "女",
          age: 73,
          healthTags: ["高血压", "膝关节康复"],
          dietPreference: "低糖少盐",
          mobility: "可独立慢行",
        },
      },
    });
    assert.equal(updated.user.currentCity, "大理");
    assert.equal(updated.elderProfile.dietPreference, "低糖少盐");
    assert.equal(updated.elderProfile.mobility, "可独立慢行");

    const toggled = await json(baseUrl, "/api/user/personal", {
      method: "PUT",
      token: elder.token,
      body: { authorizations: { location: false } },
    });
    assert.equal(toggled.authorizations.location, false);
    assert.equal(toggled.authorizations.healthData, true);

    const after = await json(baseUrl, "/api/user/personal", { token: elder.token });
    assert.equal(after.elderProfile.name, `李秀兰${suffix}`);
    assert.equal(after.authorizations.location, false);

    const safetyRoute = new URL(after.safetyCode.scanUrl).pathname;
    const safety = await json(baseUrl, safetyRoute);
    assert.equal(safety.name, `李秀兰${suffix}`);
    assert.equal(safety.address, `大理市洱海路 ${suffix} 号`);
    assert.ok(safety.emergencyContacts.length >= 1);
    assert.equal(safety.emergencyContacts[0].phone.length, 11);
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user personal real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
