const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const guideAppPath = path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js");

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
  if (!response.ok || !payload.success) {
    throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  }
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(guideAppPath, "utf8");
  [
    "function hydrateGuideProfileFromApi",
    "guideApiRequest('/api/guide/profile?guideId=guide-001')",
    "function applyGuideProfileData",
    "function saveGuideProfile",
    "function submitGuideProfileCertification",
    "data-guide-profile-refresh",
    "data-guide-profile-cert-submit",
    "/api/guide/profile/certification",
  ].forEach((needle) => assert(source.includes(needle), `向导端个人资料 #40 必须接入真实接口与功能：${needle}`));

  const renderStart = source.indexOf("function renderProfile()");
  const renderEnd = source.indexOf("function guideSettingsData()", renderStart);
  assert(renderStart >= 0 && renderEnd > renderStart, "必须能定位个人资料页面渲染函数");
  const renderSource = source.slice(renderStart, renderEnd);
  ["王女士", "13888898899", "4.9", "服务中"].forEach((text) => {
    assert(!renderSource.includes(text), `个人资料页不能继续在渲染层硬编码演示数据：${text}`);
  });

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-guide-profile-"));
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
    const guide = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "guide" } });
    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("guide-profile"), "健康检查必须登记 guide-profile 接口组");

    const profile = await json(baseUrl, "/api/guide/profile?guideId=guide-001", { token: guide.token });
    assert.equal(profile.sourceEndpoint, "/api/guide/profile");
    assert.equal(profile.guide.id, "guide-001");
    assert.equal(profile.actions.refresh.endpoint, "/api/guide/profile");
    assert.equal(profile.actions.update.endpoint, "/api/guide/profile");
    assert.equal(profile.actions.certification.endpoint, "/api/guide/profile/certification");
    assert.ok(profile.profile.name, "接口必须返回向导姓名");
    assert.ok(profile.profile.phone, "接口必须返回手机号");
    assert.ok(profile.baseRows.some((row) => row.key === "name" && row.value === profile.profile.name), "基础资料行必须由接口字段驱动");
    assert.ok(profile.emergencyContact?.phone, "接口必须返回紧急联系人电话");
    assert.ok(profile.emergencyContact.telHref.startsWith("tel:"), "紧急联系人必须返回原生 tel 链接");
    assert.ok(profile.certifications.some((item) => item.type === "realname"), "必须返回实名认证资料");
    assert.ok(profile.certifications.some((item) => item.type === "health"), "必须返回健康证明资料");
    assert.ok(profile.certifications.some((item) => item.type === "agreement"), "必须返回服务协议资料");

    const bareProfile = await json(baseUrl, "/guide/profile?guideId=guide-001", { token: guide.token });
    assert.equal(bareProfile.sourceEndpoint, "/api/guide/profile");

    const suffix = String(Date.now()).slice(-5);
    const changed = await json(baseUrl, "/api/guide/profile", {
      method: "PUT",
      token: guide.token,
      body: {
        guideId: "guide-001",
        profile: {
          name: `王芳接口${suffix}`,
          gender: "女",
          phone: "13600008888",
          city: "昆明市",
          area: "五华区",
          intro: `真实接口保存简介 ${suffix}`,
        },
      },
    });
    assert.equal(changed.profile.name, `王芳接口${suffix}`);
    assert.equal(changed.profile.intro, `真实接口保存简介 ${suffix}`);
    assert.ok(changed.baseRows.some((row) => row.key === "city" && row.value === "昆明市"));

    const persisted = await json(baseUrl, "/api/guide/profile?guideId=guide-001", { token: guide.token });
    assert.equal(persisted.profile.name, `王芳接口${suffix}`);
    assert.equal(persisted.profile.intro, `真实接口保存简介 ${suffix}`);

    const cert = await json(baseUrl, "/api/guide/profile/certification", {
      method: "POST",
      token: guide.token,
      body: { guideId: "guide-001", type: "health", fileName: `health-${suffix}.pdf` },
    });
    const healthCert = cert.certifications.find((item) => item.type === "health");
    assert.equal(healthCert.fileName, `health-${suffix}.pdf`);
    assert.match(healthCert.state, /已提交|已通过|复核/, "健康证明提交后必须返回真实审核状态");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("guide profile real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
