const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function writeSeedWithLaggingUiActionCounter(seedFile) {
  const seed = JSON.parse(fs.readFileSync(path.join(root, "data", "mock-db.json"), "utf8"));
  seed.counters = { ...(seed.counters || {}), uiAction: 10899 };
  seed.uiActions = [
    {
      id: "uia-10900",
      role: "user",
      route: "emergency",
      action: "历史拨号记录",
      target: "女儿/张女士",
      result: "历史记录",
      payload: {},
      actor: "李奶奶",
      createdAt: "2026-01-01 00:00",
    },
  ];
  fs.writeFileSync(seedFile, JSON.stringify(seed, null, 2));
}

async function main() {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-ui-action-collision-"));
  const seedFile = path.join(runtimeDir, "seed.json");
  writeSeedWithLaggingUiActionCounter(seedFile);

  let logs = "";
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: {
      ...process.env,
      PORT: String(port),
      DB_CLIENT: "json",
      YUNLV_RUNTIME_DIR: runtimeDir,
      YUNLV_SEED_DB: seedFile,
    },
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
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const admin = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "admin" } });

    const result = await json(baseUrl, "/api/family-contacts/contact-001/call", {
      method: "POST",
      token: elder.token,
      body: { route: "emergency" },
    });

    assert.match(result.action.id, /^uia-\d+$/);
    assert.notEqual(result.action.id, "uia-10900", "新动作 ID 不能复用已存在的 ui_actions 主键");

    const actions = await json(baseUrl, "/api/admin/ui-actions", { token: admin.token });
    const ids = actions.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, "ui_actions 列表中不能出现重复主键");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("ui action id collision ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
