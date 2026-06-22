const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js");

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

async function main() {
  const source = fs.readFileSync(appPath, "utf8");
  [
    "/api/merchant/qualification",
    "/api/merchant/security/toggle",
    "/api/merchant/settings/export",
    "/api/merchant/privacy",
    "/api/merchant/permissions",
    "/api/merchant/support/contact",
    "/api/merchant/invoices/preferences",
    "/api/merchant/invoices/apply",
    "data-merchant-security-toggle",
    "data-merchant-settings-notification",
    "data-merchant-settings-font-size-choice",
    "data-merchant-privacy-toggle",
    "data-merchant-permission-toggle",
    "data-merchant-support-contact",
    "data-merchant-invoice-filter",
    "data-merchant-invoice-apply-order",
    "data-merchant-invoice-apply-submit",
    "data-merchant-cert-preview",
    "data-merchant-cert-preview-close",
    "row.title || row.label",
    "commonRowIcons",
    "merchantTelHref(phone)",
  ].forEach((needle) => assert(source.includes(needle), `商户 03/07/08/09/13 页面必须接入真实接口：${needle}`));
  assert.ok(!source.includes('<a class="cert-file-card"'), "资质文件不能直接跳转到图片资源页，必须使用应用内预览");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-merchant-account-pages-"));
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
    const merchant = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "merchant" } });
    const token = merchant.token;

    const qualification = await json(baseUrl, "/api/merchant/qualification?merchantId=merchant-001", { token });
    assert.equal(qualification.sourceEndpoint, "/api/merchant/qualification");
    assert.equal(qualification.status, "已认证");
    assert.ok(qualification.files.some((item) => item.src.includes("/merchant/assets/")), "资质文件必须返回真实可打开资源");
    assert.ok(qualification.serviceTypes.length >= 6, "资质页面必须返回服务类型");

    const security = await json(baseUrl, "/api/merchant/security?merchantId=merchant-001", { token });
    assert.equal(security.sourceEndpoint, "/api/merchant/security");
    const toggledSecurity = await json(baseUrl, "/api/merchant/security/toggle", {
      method: "POST",
      token,
      body: { merchantId: "merchant-001", field: "twoFactorEnabled", enabled: !security.twoFactorEnabled },
    });
    assert.equal(toggledSecurity.twoFactorEnabled, !security.twoFactorEnabled);
    const loggedOutSecurity = await json(baseUrl, "/api/merchant/security/logout-devices", {
      method: "POST",
      token,
      body: { merchantId: "merchant-001" },
    });
    assert.ok(loggedOutSecurity.devices.some((item) => !item.current && item.status === "已退出"), "退出其他设备必须写入设备状态");

    const settings = await json(baseUrl, "/api/merchant/settings?merchantId=merchant-001", { token });
    assert.equal(settings.sourceEndpoint, "/api/merchant/settings");
    assert.deepEqual(settings.commonRows.map((row) => row.label), ["清理缓存", "语言", "字体大小", "深色模式"]);
    assert.deepEqual(settings.commonRows.map((row) => row.iconName), ["trash-2", "languages", "type", "moon"]);
    assert.ok(settings.commonRows.every((row) => row.iconName !== "settings"), "通用设置不能全部回退成齿轮图标");
    const updatedSettings = await json(baseUrl, "/api/merchant/settings", {
      method: "PUT",
      token,
      body: { merchantId: "merchant-001", notifications: { marketing: true }, common: { cacheSizeMb: 0, fontSize: "大" } },
    });
    assert.equal(updatedSettings.notifications.marketing, true);
    assert.equal(updatedSettings.common.cacheSizeMb, 0);
    assert.equal(updatedSettings.common.fontSize, "大");
    const exported = await json(baseUrl, "/api/merchant/settings/export", {
      method: "POST",
      token,
      body: { merchantId: "merchant-001" },
    });
    assert.match(exported.exportId, /^mexp-/);
    assert.equal(exported.settings.lastExportId, exported.exportId);
    const exportFile = await json(baseUrl, `${exported.downloadUrl}?merchantId=merchant-001`, { token });
    assert.equal(exportFile.exportId, exported.exportId);
    assert.equal(exportFile.merchant.id, "merchant-001");
    assert.equal(exportFile.settings.common.fontSize, "大");

    const privacy = await json(baseUrl, "/api/merchant/privacy?merchantId=merchant-001", { token });
    assert.equal(privacy.sourceEndpoint, "/api/merchant/privacy");
    assert.ok(privacy.managementRows.some((row) => row.exportAction), "隐私设置必须提供真实个人信息导出入口");
    const marketingRow = privacy.messageRows.find((row) => row.key === "marketingNotice");
    const changedPrivacy = await json(baseUrl, "/api/merchant/privacy", {
      method: "PUT",
      token,
      body: { merchantId: "merchant-001", privacy: { marketingNotice: !marketingRow.enabled } },
    });
    assert.equal(changedPrivacy.messageRows.find((row) => row.key === "marketingNotice").enabled, !marketingRow.enabled);

    const permissions = await json(baseUrl, "/api/merchant/permissions?merchantId=merchant-001", { token });
    assert.equal(permissions.sourceEndpoint, "/api/merchant/permissions");
    assert.ok(permissions.permissionCards.length >= 4, "权限设置必须返回权限卡片");
    const microphone = permissions.permissionCards.find((row) => row.key === "microphone");
    const changedPermissions = await json(baseUrl, "/api/merchant/permissions", {
      method: "PUT",
      token,
      body: { merchantId: "merchant-001", key: "microphone" },
    });
    assert.notEqual(changedPermissions.permissionCards.find((row) => row.key === "microphone").status, microphone.status);
    assert.ok(changedPermissions.permissionRecords[0].id.startsWith("mpr-"), "权限更新必须写入权限记录");

    const support = await json(baseUrl, "/api/merchant/support?merchantId=merchant-001", { token });
    assert.equal(support.sourceEndpoint, "/api/merchant/support");
    assert.ok(support.contacts.phone, "客服接口必须返回客服电话");
    const contacted = await json(baseUrl, "/api/merchant/support/contact", {
      method: "POST",
      token,
      body: { merchantId: "merchant-001", type: "phone", route: "09" },
    });
    assert.equal(contacted.type, "phone");
    assert.match(contacted.telHref, /^tel:/);

    const invoices = await json(baseUrl, "/api/merchant/invoices?merchantId=merchant-001&status=全部", { token });
    assert.equal(invoices.sourceEndpoint, "/api/merchant/invoices");
    assert.ok(invoices.records.length >= 3, "发票管理必须返回开票记录");
    const apply = await json(baseUrl, "/api/merchant/invoices/apply?merchantId=merchant-001", { token });
    assert.equal(apply.sourceEndpoint, "/api/merchant/invoices/apply");
    assert.ok(apply.orders.length >= 2, "申请开票页面必须返回可开票订单");
    assert.ok(apply.selectedOrderIds.length >= 1, "申请开票页面必须返回默认可提交订单");
    const submitted = await json(baseUrl, "/api/merchant/invoices/apply", {
      method: "POST",
      token,
      body: {
        merchantId: "merchant-001",
        selectedOrderIds: apply.selectedOrderIds.slice(0, 1),
        invoiceType: apply.preference.invoiceType,
        delivery: apply.preference.delivery,
        email: apply.preference.email,
        note: "接口回归测试提交开票申请",
      },
    });
    assert.equal(submitted.sourceEndpoint, "/api/merchant/invoices/apply");
    assert.equal(submitted.record.status, "待开票");
    assert.ok(submitted.invoices.records.some((item) => item.id === submitted.record.id), "提交开票申请后必须写入发票记录");
    const pendingInvoices = await json(baseUrl, "/api/merchant/invoices?merchantId=merchant-001&status=待开票", { token });
    assert.ok(pendingInvoices.records.every((item) => item.status === "待开票"), "发票筛选必须由接口返回过滤结果");
    const changedInvoice = await json(baseUrl, "/api/merchant/invoices/preferences", {
      method: "PUT",
      token,
      body: { merchantId: "merchant-001", invoiceType: "增值税普通发票", status: "全部" },
    });
    assert.equal(changedInvoice.preference.invoiceType, "增值税普通发票");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("merchant account pages real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
