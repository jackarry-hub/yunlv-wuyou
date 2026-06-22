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
  const pageBlock = extractBlock(source, "renderUsersReference", "guideServiceTypesText");
  const actionBlock = extractBlock(source, "handleAdminUserManagementAction", "handleAdminDeviceDetailAction");

  [
    'if (page.id === "users") return renderUsersReference(page);',
    "const adminUserState = {",
    "function renderUsersReference(",
    "userRowsForApi(users)",
    "adminApi(\"/api/admin/users\")",
    "data-action=\"用户筛选:",
    "data-action=\"查看用户：${escapeHtml(user.id || \"\")}\"",
    "function renderAdminUserDetailPanel(",
  ].forEach((needle) => {
    assert(source.includes(needle), `用户管理页必须接入真实用户接口和操作：${needle}`);
  });

  assert(!pageBlock.includes('rowsForDomain("user")'), "用户管理页不能回退到通用用户静态表格");
  assert(!pageBlock.includes("renderRelatedCards"), "用户管理页不能展示通用相关推荐假模块");
  assert(actionBlock.includes("applyAdminUserQuickFilter("), "用户 KPI 必须执行当前表格筛选");
  assert(actionBlock.includes("adminUserState.selectedUserId"), "查看用户资料必须更新当前接口详情");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-users-page-"));
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
    const usersPayload = await json(baseUrl, "/api/admin/users", { token: admin.token });
    assert(Array.isArray(usersPayload.users), "用户接口必须返回 users 数组");
    assert(Array.isArray(usersPayload.elderProfiles), "用户接口必须返回 elderProfiles 数组");
    assert(Array.isArray(usersPayload.familyContacts), "用户接口必须返回 familyContacts 数组");
    assert(usersPayload.users.length >= 1, "后台接口必须返回用户账号");
    assert(usersPayload.users.every((user) => user.id && user.role && user.status), "用户账号必须包含 ID、角色和状态");
    assert(usersPayload.users.some((user) => Number.isFinite(Number(user.orderCount))), "用户账号必须包含接口订单数");
    assert(usersPayload.users.some((user) => Number.isFinite(Number(user.unreadMessages))), "用户账号必须包含接口未读消息数");

    const importId = `user-import-test-${Date.now()}`;
    const importResult = await json(baseUrl, "/api/admin/users/import", {
      method: "POST",
      token: admin.token,
      body: {
        sourceFile: "users-real-data-test.csv",
        items: [{
          id: importId,
          phone: "13000009999",
          nickname: "接口导入测试用户",
          status: "正常",
          avatar: "/user/assets/avatar-user.jpg",
        }],
      },
    });
    assert.equal(importResult.createdCount, 1, "用户导入接口必须创建一条用户");
    const afterImport = await json(baseUrl, "/api/admin/users", { token: admin.token });
    assert(afterImport.users.some((user) => user.id === importId), "导入后的用户必须能从 /api/admin/users 读取");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin users real-data test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
