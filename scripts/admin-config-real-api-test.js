const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adminSourcePath = path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js");
const serverSourcePath = path.join(root, "server.js");

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
  const serverSource = fs.readFileSync(serverSourcePath, "utf8");

  [
    "function renderPermissionSystemEntrances(",
    'data-route="${route}"',
    '["config", "系统配置"',
    "系统配置",
    "ensureAdminConfigData(page)",
    'adminApi("/api/admin/config")',
    'adminApi("/api/admin/config/publish"',
    'adminApi("/api/admin/config/reset"',
    "collectAdminConfigDraftFromDom",
  ].forEach((needle) => {
    assert(source.includes(needle), `系统配置入口和前端真实接口缺少：${needle}`);
  });

  const permissionBlock = extractBlock(source, "renderPermission", "permissionPeoplePanel");
  assert(permissionBlock.includes("renderPermissionSystemEntrances()"), "系统权限页必须直接展示系统配置入口");

  assert(source.includes('if (page.id === "menus") return renderMenuPermissionSettings(page);'), "菜单权限配置路由必须渲染独立页面，不能复用空白权限页");
  [
    "function renderMenuPermissionSettings(",
    "data-admin-menu-permission-action",
    "data-admin-menu-permission-person",
    "data-admin-menu-permission-group",
    "data-admin-menu-permission-page",
    "handleAdminMenuPermissionAction",
    "handleAdminMenuPermissionChange",
    'closest(".admin-menu-permission-layout")',
    "菜单权限矩阵",
    "按钮权限",
    "数据权限",
    "授权预览",
  ].forEach((needle) => {
    assert(source.includes(needle), `菜单权限配置页缺少真实内容或交互：${needle}`);
  });

  const renderBlock = extractBlock(source, "renderSystemConfigSettings", "renderPermissionSystemEntrances");
  [
    "admin-config-unified-panel",
    "admin-config-unified-grid",
    "adminConfigUnifiedGroup(\"basic\", \"平台信息\"",
    "adminConfigUnifiedGroup(\"ai\", \"AI智能管家\"",
    "adminConfigUnifiedGroup(\"security\", \"隐私与医疗免责声明\"",
    "aiSteward.apiBase",
    "aiSteward.apiKey",
    "aiSteward.model",
    "adminConfigLogoPreview(config.platform?.logo)",
    "data-admin-config-version-link",
    "data-admin-config-version-records",
  ].forEach((needle) => {
    assert(renderBlock.includes(needle), `系统配置页必须合并为一个统一配置面板：${needle}`);
  });
  [
    "admin-config-tabs",
    "data-admin-config-jump",
    "adminConfigState.activeSection",
    "renderIconTextButton(id, title,",
  ].forEach((needle) => {
    assert(!renderBlock.includes(needle), `系统配置页不应再展示上方分类入口：${needle}`);
  });
  [
    'infoPanel("当前版本"',
    'infoPanel("发布范围"',
    'infoPanel("变更摘要"',
    'infoPanel("配置发布预览"',
    'infoPanel("环境状态"',
  ].forEach((needle) => {
    assert(!renderBlock.includes(needle), `系统配置页不应再展示模块：${needle}`);
  });

  const configActionBlock = extractBlock(source, "handleAdminConfigAction", "handleAdminSettingsCategoryAction");
  const configScrollBlock = extractBlock(source, "scrollAdminConfigVersionRecords", "handleAdminConfigAction");
  const draftBlock = extractBlock(source, "collectAdminConfigDraftFromDom", "refreshAdminCurrentPage");
  assert(configScrollBlock.includes("[data-admin-config-version-records]"), "查看版本必须定位到配置版本记录区域");
  assert(configScrollBlock.includes("window.scrollTo"), "查看版本必须使用稳定页面滚动定位");
  assert(draftBlock.includes("aiSteward"), "系统配置保存必须采集 AI 智能管家配置");
  assert(configActionBlock.includes("nextAdminConfigLogoChoice"), "Logo 更换必须切换真实素材路径");
  assert(configActionBlock.includes("updateAdminConfigLogoPreview"), "Logo 更换必须同步更新页面预览");
  assert(!configActionBlock.includes('["基础配置", "通知配置", "地图配置", "AI配置", "设备配置", "安全配置"]'), "系统配置页已删除分类入口，动作处理器不能保留分类跳转分支");
  [
    "/api/admin/config/publish",
    "/api/admin/config/reset",
    "persistAdminConfigDraft",
    "adminConfigState.data",
  ].forEach((needle) => {
    assert(configActionBlock.includes(needle), `系统配置按钮必须调用真实配置接口：${needle}`);
  });
  const persistBlock = extractBlock(source, "persistAdminConfigDraft", "handleAdminConfigAction");
  assert(persistBlock.includes("collectAdminConfigDraftFromDom"), "系统配置保存必须采集当前表单");
  assert(persistBlock.includes("/api/admin/config"), "系统配置保存必须调用 /api/admin/config");
  assert(!/adminConfigState\.savedAt\s*=/.test(configActionBlock), "系统配置保存不能只改前端 savedAt 状态");
  assert(!/adminConfigState\.publishedAt\s*=/.test(configActionBlock), "系统配置发布不能只改前端 publishedAt 状态");
  [
    "aiSteward",
    "configuredAiStewardModel",
    "modelConfig.apiBase",
    "modelConfig.apiKey",
    "modelConfig.model",
  ].forEach((needle) => {
    assert(serverSource.includes(needle), `后端必须支持 AI 智能管家模型配置：${needle}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-admin-config-"));
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

    const before = await json(baseUrl, "/api/admin/config", { token: admin.token });
    assert.equal(before.config.platform.name, "云旅无忧 AI智慧旅居平台", "配置接口必须返回平台名称");
    assert.equal(before.config.status, "已发布", "配置接口必须返回发布状态");
    assert.equal(before.config.aiSteward.provider, "DeepSeek", "配置接口必须返回 AI 智能管家模型服务商");
    assert.equal(before.config.aiSteward.model, "deepseek-chat", "配置接口必须返回 AI 智能管家模型名称");

    const saved = await json(baseUrl, "/api/admin/config", {
      method: "PUT",
      token: admin.token,
      body: {
        platform: { name: "云旅无忧真实接口验收平台", shortName: "云旅验收", logo: "/user/assets/assistant-robot.jpg" },
        aiSteward: {
          enabled: true,
          provider: "DeepSeek",
          apiBase: "https://api.deepseek.com",
          apiKey: "sk-admin-config-test",
          model: "deepseek-chat",
          timeoutMs: 15000,
          temperature: 0.5,
          maxTokens: 900,
        },
        orderRules: { autoCancelMinutes: 45 },
      },
    });
    assert.equal(saved.config.platform.name, "云旅无忧真实接口验收平台", "保存接口必须真实更新平台名称");
    assert.equal(saved.config.platform.logo, "/user/assets/assistant-robot.jpg", "保存接口必须真实更新平台 Logo 路径");
    assert.equal(saved.config.aiSteward.enabled, true, "保存接口必须真实更新 AI 大模型启用状态");
    assert.equal(saved.config.aiSteward.apiKey, "sk-admin-config-test", "保存接口必须真实更新 AI 大模型 API Key");
    assert.equal(saved.config.aiSteward.timeoutMs, 15000, "保存接口必须真实更新 AI 大模型请求超时");
    assert.equal(saved.config.orderRules.autoCancelMinutes, 45, "保存接口必须真实更新订单规则");
    assert.equal(saved.config.status, "已保存待发布", "保存后必须进入待发布状态");

    const persisted = await json(baseUrl, "/api/admin/config", { token: admin.token });
    assert.equal(persisted.config.platform.name, "云旅无忧真实接口验收平台", "保存后的配置必须可再次读取");
    assert.equal(persisted.config.aiSteward.model, "deepseek-chat", "保存后的 AI 配置必须可再次读取");

    const published = await json(baseUrl, "/api/admin/config/publish", {
      method: "POST",
      token: admin.token,
      body: { note: "系统配置真实接口测试发布" },
    });
    assert.equal(published.config.status, "已发布", "发布接口必须真实更新发布状态");
    assert.notEqual(published.config.publishedAt, before.config.publishedAt, "发布接口必须更新发布时间");

    const reset = await json(baseUrl, "/api/admin/config/reset", {
      method: "POST",
      token: admin.token,
      body: { note: "恢复默认配置测试" },
    });
    assert.equal(reset.config.platform.name, "云旅无忧 AI智慧旅居平台", "恢复默认接口必须还原默认平台名称");
    assert.equal(reset.config.aiSteward.provider, "DeepSeek", "恢复默认接口必须还原 AI 智能管家配置");
    assert.equal(reset.config.status, "已保存待发布", "恢复默认后必须等待发布");

    const auditLogs = await json(baseUrl, "/api/admin/audit-logs", { token: admin.token });
    assert(auditLogs.some((item) => item.action === "保存系统配置"), "保存系统配置必须写入审计日志");
    assert(auditLogs.some((item) => item.action === "发布系统配置"), "发布系统配置必须写入审计日志");
    assert(auditLogs.some((item) => item.action === "恢复默认系统配置"), "恢复默认系统配置必须写入审计日志");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }
}

main().then(() => {
  console.log("admin config real-api test ok");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
