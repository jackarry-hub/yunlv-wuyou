const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  ROLE_ENDPOINT_DIVISION_VERSION,
  roleEndpointDivisionForApi,
  roleEndpointRows,
  validateRoleEndpointDivision,
} = require("../server/lib/role-endpoint-division");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["用户/老人", "服务需求发起者与健康数据主体", "查看健康、预约服务、参加活动、一键求助、接收反馈", "微信小程序 / iOS App / Android App"],
  ["家属", "远程关怀与紧急联系人", "查看老人状态、接收预警、跟进服务记录、参与决策", "微信小程序 / iOS App / Android App"],
  ["人工向导", "接单执行者（轻服务）", "接收任务、上门陪护、导游游览、陪伴就医、服务反馈", "小程序/App 内人工向导角色端"],
  ["商户", "专业服务提供方（重服务）", "医疗卫生、康养护理、生活服务、殡葬等专业服务承接", "小程序/App 内商户角色端"],
  ["平台运营/管理员", "平台中枢与调度管理者", "监控数据、调度任务、管理人员/商户/服务/异常", "管理后台"],
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

async function call(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json", ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  return { status: response.status, payload };
}

async function json(baseUrl, route, options = {}) {
  const result = await call(baseUrl, route, options);
  if (!result.payload.success) throw new Error(`${route} failed: ${JSON.stringify(result.payload.error)}`);
  return result.payload.data;
}

async function login(baseUrl, role) {
  return json(baseUrl, "/api/auth/login", { method: "POST", body: { role } });
}

async function main() {
  assert.deepEqual(
    roleEndpointRows.map((item) => [item.role, item.essence, item.coreTasks, item.useEnd]),
    expectedRows,
    "第 2 节角色与端口划分应与图示一致",
  );
  assert.equal(validateRoleEndpointDivision().valid, true);
  assert(roleEndpointRows.every((item) => item.endRoutes.length > 0 && item.apiEndpoints.length > 0 && item.dataTables.length > 0));

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = roleEndpointDivisionForApi(seed);
  assert.equal(direct.version, ROLE_ENDPOINT_DIVISION_VERSION);
  assert.equal(direct.roleCount, 5);
  assert.equal(direct.mobileRoleCount, 4);
  assert.equal(direct.dedicatedEndCount, 1);
  assert.equal(direct.acceptance.allFiveRolesMapped, true);
  assert.equal(direct.acceptance.allRolesHaveUseEnd, true);
  assert.equal(direct.acceptance.allRolesHaveApiAndPermissions, true);
  assert.equal(direct.acceptance.adminCanSeeAllRoles, true);
  assert(direct.roles.find((item) => item.role === "平台运营/管理员").apiEndpoints.includes("/tasks/dispatch"));

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-role-endpoints-"));
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
    const admin = await login(baseUrl, "admin");
    const elder = await login(baseUrl, "elder");

    const denied = await call(baseUrl, "/api/roles/endpoint-division", { token: elder.token });
    assert.equal(denied.status, 403);
    assert.equal(denied.payload.success, false);

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("role-endpoints"));

    const overview = await json(baseUrl, "/api/roles/endpoint-division", { token: admin.token });
    assert.equal(overview.version, ROLE_ENDPOINT_DIVISION_VERSION);
    assert.equal(overview.validation.valid, true);
    assert.equal(overview.roleCount, 5);
    assert.equal(overview.roles[0].role, "用户/老人");
    assert.equal(overview.roles[1].role, "家属");
    assert.equal(overview.roles[2].useEnd, "小程序/App 内人工向导角色端");
    assert.equal(overview.roles[3].useEnd, "小程序/App 内商户角色端");
    assert(overview.roles.find((item) => item.role === "商户").permissions.includes("merchant:read"));
    assert.equal(overview.acceptance.executionRolesSeparated, true);

    const bareOverview = await json(baseUrl, "/roles/endpoint-division", { token: admin.token });
    assert.equal(bareOverview.roleCount, 5);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.roleEndpointDivision.architecturePath, "/api/roles/endpoint-division");
    assert.equal(reference.roleEndpointDivision.roleCount, 5);

    const modules = await json(baseUrl, "/api/admin/system/modules", { token: admin.token });
    assert(modules.modules.find((item) => item.module === "用户与权限服务").apiEndpoints.includes("/roles/endpoint-division"));
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("role endpoint division ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
