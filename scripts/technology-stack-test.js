const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { technologyLayers, technologyStackForApi, validateTechnologyStack } = require("../server/lib/technology-stack");

const root = path.resolve(__dirname, "..");

const expectedLayers = [
  ["用户端与角色端跨端移动应用", "uni-app（优先）/ Taro（备选）"],
  ["管理后台", "Vue3 + Element Plus / React + Ant Design"],
  ["后端服务", "Node.js NestJS / Java Spring Boot / Python FastAPI"],
  ["数据库", "MySQL/PostgreSQL + Redis"],
  ["地图服务", "腾讯地图 / 高德地图"],
  ["AI 能力", "大模型 API + 知识库 + 规则引擎"],
  ["对象存储", "阿里云 OSS / 腾讯云 COS"],
  ["部署", "云服务器 + Docker + Nginx + HTTPS"],
];

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
    } catch (error) {
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

async function main() {
  assert.deepEqual(
    technologyLayers.map((item) => [item.layer, item.recommendation]),
    expectedLayers,
    "technology layers should follow the provided recommendation table",
  );

  const summary = technologyStackForApi();
  assert.equal(summary.version, "technology-stack-v1");
  assert.equal(summary.layerCount, expectedLayers.length);
  assert(summary.productionRequiredCount >= 6);
  assert.equal(validateTechnologyStack().valid, true);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-tech-"));
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
    const technology = await json(baseUrl, "/api/admin/system/technology", { token: admin.token });
    assert.equal(technology.layerCount, expectedLayers.length);
    assert.equal(technology.validation.valid, true);
    assert(technology.layers.find((item) => item.layer === "部署").recommendation.includes("Docker"));

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.technologyStack.layerCount, expectedLayers.length);
    assert.equal(reference.technologyStack.architecturePath, "/api/admin/system/technology");

    const integrations = await json(baseUrl, "/api/integrations/status", { token: admin.token });
    ["map", "database-cache", "storage", "llm", "deployment", "app-build"].forEach((id) => {
      assert(integrations.integrations.some((item) => item.id === id), `integration ${id} should be reserved`);
    });
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("technology stack ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
