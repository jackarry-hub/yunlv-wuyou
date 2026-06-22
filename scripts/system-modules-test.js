const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { schemaForApi } = require("../server/lib/database-schema");
const { systemModules, systemModulesForApi, validateSystemModules } = require("../server/lib/system-modules");

const root = path.resolve(__dirname, "..");

const expectedModules = [
  ["用户与权限服务", ["手机号登录", "微信登录", "角色权限", "角色与端口划分", "用户端功能总览", "首页需求", "城市切换", "首页消息入口", "用户资料", "家属绑定", "紧急联系人"]],
  ["订单与任务服务", ["订单创建", "向导下单需求", "任务拆分", "派单", "接单", "向导状态流", "状态流转", "评价"]],
  ["服务资源服务", ["人工向导", "向导功能", "向导下单分类", "商户", "服务项目", "服务分类", "活动", "活动地图", "活动分类", "活动卡片", "附近推荐", "活动报名取消", "价格", "服务区域"]],
  ["设备与健康数据服务", ["设备绑定", "健康数据", "异常记录", "设备状态", "设备联动", "小云机器人", "守护功能", "家人通话", "帮助任务", "紧急求助", "通知链路", "位置上传", "快速求助", "急救健康信息"]],
  ["AI 管家服务", ["AI问答", "语音互动", "快捷问题", "服务推荐", "服务记录", "问答", "知识库", "推荐", "上下文记录"]],
  ["通知服务", ["站内消息", "短信", "电话接口预留", "微信订阅消息", "App Push"]],
  ["运营后台服务", ["首期交付范围", "两周 MVP 原则", "角色端口", "总体业务流程", "用户", "人员", "商户", "订单", "异常", "首页内容配置", "内容", "数据", "系统配置"]],
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
    systemModules.map((item) => [item.module, item.capabilities]),
    expectedModules,
    "system modules should follow 9.1 architecture",
  );

  const summary = systemModulesForApi();
  assert.equal(summary.version, "9.1-system-modules-v1");
  assert.equal(summary.moduleCount, expectedModules.length);
  assert(summary.capabilityCount >= 44);

  const tableNames = schemaForApi().map((table) => table.table);
  const validation = validateSystemModules({ tableNames });
  assert.equal(validation.valid, true, JSON.stringify(validation.errors, null, 2));

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-modules-"));
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
    const modules = await json(baseUrl, "/api/admin/system/modules", { token: admin.token });
    assert.equal(modules.source, "9.1 系统模块架构");
    assert.equal(modules.moduleCount, expectedModules.length);
    assert.equal(modules.validation.valid, true);
    assert(modules.modules.find((item) => item.module === "运营后台服务").capabilities.includes("首期交付范围"));
    assert(modules.modules.find((item) => item.module === "运营后台服务").capabilities.includes("两周 MVP 原则"));
    assert(modules.modules.find((item) => item.module === "用户与权限服务").capabilities.includes("角色与端口划分"));
    assert(modules.modules.find((item) => item.module === "通知服务").capabilities.includes("App Push"));

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.systemModules.moduleCount, expectedModules.length);
    assert.equal(reference.systemModules.architecturePath, "/api/admin/system/modules");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("system modules ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
