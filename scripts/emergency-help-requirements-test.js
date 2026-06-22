const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  EMERGENCY_HELP_REQUIREMENTS_VERSION,
  emergencyHelpRequirements,
  emergencyHelpRequirementsForApi,
  validateEmergencyHelpRequirements,
} = require("../server/lib/emergency-help-requirements");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["一键 SOS", "页面显著展示一键紧急求助按钮，点击后二次确认或长按触发。", "P0"],
  ["通知链路", "向紧急联系人、平台后台发送求助信息，包含姓名、位置、时间、电话。", "P0"],
  ["位置上传", "获取用户当前位置，显示地址与定位精度。", "P0"],
  ["紧急联系人", "可添加儿子、女儿、老伴等紧急联系人，支持拨打电话。", "P0"],
  ["快速求助", "呼叫救护车、报警求助、联系医院、人工客服/人工向导。", "P1"],
  ["健康信息", "展示血型、慢性病、过敏史、常用药物，供急救参考。", "P1"],
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
  if (!result.payload.success) throw new Error(`${route} failed: ${JSON.stringify(result.payload)}`);
  return result.payload.data;
}

async function main() {
  assert.deepEqual(
    emergencyHelpRequirements.map((item) => [item.feature, item.detail, item.priority]),
    expectedRows,
    "4.5 紧急求助需求应与图示一致",
  );
  assert.equal(validateEmergencyHelpRequirements().valid, true);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = emergencyHelpRequirementsForApi(seed);
  assert.equal(direct.version, EMERGENCY_HELP_REQUIREMENTS_VERSION);
  assert.equal(direct.requirementCount, 6);
  assert.equal(direct.p0Count, 4);
  assert.equal(direct.p1Count, 2);
  assert(direct.emergencyContacts.contacts.length >= 2);
  assert(direct.quickHelp.channels.some((item) => item.title === "呼叫救护车" && item.dialNumber === "120"));
  assert(direct.quickHelp.channels.some((item) => item.title === "报警求助" && item.dialNumber === "110"));
  assert(direct.healthInformation.info.bloodType);
  assert(direct.locationUpload.address);
  assert.equal(direct.user.phone, "13800005678");
  assert(direct.records.some((item) => item.recordKind === "alert"));
  assert.equal(direct.recordSummary.total, direct.records.length);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-emergency-help-"));
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
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const family = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "family" } });
    const admin = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "admin" } });

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("emergency-help-requirements"));

    const requirements = await json(baseUrl, "/api/alerts/emergency-requirements", { token: elder.token });
    assert.equal(requirements.validation.valid, true);
    assert.equal(requirements.requirementCount, 6);
    assert.equal(requirements.oneKeySos.triggerMode, "二次确认触发");
    assert(requirements.notificationChain.requiredFields.includes("电话"));
    assert(requirements.locationUpload.accuracy > 0);
    assert(requirements.emergencyContacts.supports.includes("删除"));
    assert(requirements.quickHelp.channels.some((item) => item.key === "guide"));
    assert.equal(requirements.user.phone, "13800005678");
    assert(Array.isArray(requirements.records));
    assert.equal(requirements.recordSummary.total, requirements.records.length);
    assert.equal(requirements.related.emergencySettings, "/api/alerts/emergency-settings");

    const emergencySettings = await json(baseUrl, "/api/alerts/emergency-settings", { token: elder.token });
    assert(emergencySettings.rules.every((rule) => rule.enabled));
    const disabledSosRule = await json(baseUrl, "/api/alerts/emergency-settings", {
      method: "PUT",
      token: elder.token,
      body: { key: "sos", enabled: false },
    });
    assert.equal(disabledSosRule.rules.find((rule) => rule.key === "sos").enabled, false);
    await json(baseUrl, "/api/alerts/emergency-settings", {
      method: "PUT",
      token: elder.token,
      body: { key: "sos", enabled: true },
    });

    const bareRequirements = await json(baseUrl, "/alerts/emergency-requirements", { token: elder.token });
    assert.equal(bareRequirements.requirementCount, 6);

    const createdContact = await json(baseUrl, "/api/family-contacts", {
      method: "POST",
      token: elder.token,
      body: { name: "测试儿子", relation: "儿子", phone: "13912345678", notifyAlert: true },
    });
    assert.equal(createdContact.relation, "儿子");
    const updatedContact = await json(baseUrl, `/api/family-contacts/${createdContact.id}`, {
      method: "PUT",
      token: elder.token,
      body: { name: "测试儿子", relation: "儿子", phone: "13912345679", notifyAlert: true },
    });
    assert.equal(updatedContact.phone, "13912345679");
    const callResult = await json(baseUrl, `/api/family-contacts/${createdContact.id}/call`, {
      method: "POST",
      token: elder.token,
      body: {},
    });
    assert.equal(callResult.dialNumber, "13912345679");
    assert.equal(callResult.telHref, "tel:13912345679");
    assert.equal(callResult.callStatus, "已交由系统拨号");
    const deletedContact = await json(baseUrl, `/api/family-contacts/${createdContact.id}`, {
      method: "DELETE",
      token: elder.token,
      body: {},
    });
    assert.equal(deletedContact.removed.id, createdContact.id);

    const sos = await json(baseUrl, "/api/alerts/sos", {
      method: "POST",
      token: elder.token,
      body: {
        location: "昆明市五华区翠湖康养公寓门口",
        accuracy: 18,
        coordinates: { lng: 102.7069, lat: 25.0456 },
        phone: "13800005678",
        description: "4.5 验收 SOS",
      },
    });
    assert.equal(sos.status, "待处理");
    assert.equal(sos.accuracy, 18);
    assert.equal(sos.phone, "13800005678");
    assert(sos.contactSnapshot.length >= 2);
    assert.equal(sos.healthSnapshot.bloodType, "A 型");

    const familyMessages = await json(baseUrl, "/api/messages?role=family", { token: family.token });
    assert(familyMessages.some((item) => item.relatedId === sos.id && item.content.includes("13800005678")));
    const adminMessages = await json(baseUrl, "/api/messages?role=admin", { token: admin.token });
    assert(adminMessages.some((item) => item.relatedId === sos.id && item.content.includes("昆明市五华区")));
    const alerts = await json(baseUrl, "/api/alerts", { token: admin.token });
    assert(alerts.some((item) => item.id === sos.id));

    const quickHelp = await json(baseUrl, "/api/alerts/quick-help", {
      method: "POST",
      token: elder.token,
      body: { channelKey: "ambulance", location: "翠湖康养公寓", accuracy: 20 },
    });
    assert.equal(quickHelp.status, "待处理");
    assert.equal(quickHelp.dialNumber, "120");
    assert.equal(quickHelp.payload.channelKey, "ambulance");

    const requirementsAfterActions = await json(baseUrl, "/api/alerts/emergency-requirements", { token: elder.token });
    assert(requirementsAfterActions.records.some((item) => item.id === sos.id && item.recordKind === "alert"));
    assert(requirementsAfterActions.records.some((item) => item.id === quickHelp.id && item.recordKind === "quickHelp"));
    assert.equal(requirementsAfterActions.recordSummary.total, requirementsAfterActions.records.length);

    const profile = await json(baseUrl, "/api/elder/profile", {
      method: "PUT",
      token: elder.token,
      body: { bloodType: "B 型", chronicDisease: "高血压、糖尿病", allergies: "头孢过敏", medicines: "降压药" },
    });
    assert.equal(profile.bloodType, "B 型");
    assert.equal(profile.allergies, "头孢过敏");

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.emergencyHelpRequirements.architecturePath, "/api/alerts/emergency-requirements");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("emergency help requirements ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
