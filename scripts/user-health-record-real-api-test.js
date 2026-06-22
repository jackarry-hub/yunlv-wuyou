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
  const renderStart = source.indexOf("function renderHealthRecord()");
  const renderEnd = source.indexOf("function renderHealthServices()", renderStart);
  const healthRecordSource = source.slice(renderStart, renderEnd);
  assert.match(healthRecordSource, /healthRecordState/);
  assert.match(healthRecordSource, /data-health-record-source/);
  assert.match(healthRecordSource, /metricByType\.heart_rate/);
  assert.match(healthRecordSource, /medicationReminders/);
  assert.doesNotMatch(healthRecordSource, /张建国|128\/78|今天 08:30/, "健康档案不能继续渲染示例人物或静态采集值");
  assert.match(source, /userApi\("\/api\/health\/record"/);
  assert.match(source, /userApi\("\/api\/health\/record\/sync"/);
  assert.match(source, /body: \{ authorizations: \{ healthData: enabled \} \}/);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-health-record-"));
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
    const before = await json(baseUrl, "/api/health/record", { token: login.token });
    assert.equal(before.sourceEndpoint, "/api/health/record");
    assert.equal(before.elder.id, "elder-001");
    assert.equal(before.elder.name, "李秀兰");
    assert(before.metrics.some((item) => item.metricType === "heart_rate" && item.source === "智能手环"));
    assert(before.metrics.some((item) => item.metricType === "blood_pressure"));
    assert(before.medicationReminders.length >= 2);
    assert.equal(before.authorization.familyHealthSummary, true);
    assert(before.device?.id);

    const suffix = Date.now().toString().slice(-5);
    const updated = await json(baseUrl, "/api/health/record", {
      method: "PUT",
      token: login.token,
      body: {
        bloodType: "AB 型",
        healthTags: ["高血压", `接口验证${suffix}`],
        allergies: "无新增过敏",
        medicines: "测试药物 A",
        medicalPreference: `优先互联网医院 ${suffix}`,
        emergencyHistory: "无新增住院记录",
        familyNote: `真实接口验证 ${suffix}`,
        medicationReminders: [
          { id: "test-morning", period: "早", time: "07:45", medicines: ["测试药物 A"], status: "待提醒", enabled: true },
        ],
      },
    });
    assert.equal(updated.elder.bloodType, "AB 型");
    assert.equal(updated.elder.familyNote, `真实接口验证 ${suffix}`);
    assert.equal(updated.medicationReminders[0].time, "07:45");

    const persisted = await json(baseUrl, "/api/health/record", { token: login.token });
    assert.equal(persisted.elder.medicalPreference, `优先互联网医院 ${suffix}`);
    assert(persisted.elder.healthTags.includes(`接口验证${suffix}`));

    const personal = await json(baseUrl, "/api/user/personal", {
      method: "PUT",
      token: login.token,
      body: { authorizations: { healthData: false } },
    });
    assert.equal(personal.authorizations.healthData, false);
    const unauthorizedSummary = await json(baseUrl, "/api/health/record", { token: login.token });
    assert.equal(unauthorizedSummary.authorization.familyHealthSummary, false);

    const synced = await json(baseUrl, "/api/health/record/sync", {
      method: "POST",
      token: login.token,
      body: {},
    });
    assert(synced.sync.syncedAt);
    assert.equal(synced.sync.metricCount, 5);
    assert.equal(synced.device.lastSync, synced.sync.syncedAt);
    assert(synced.sync.actionId);
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user health record real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
