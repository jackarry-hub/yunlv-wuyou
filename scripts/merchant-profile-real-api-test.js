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

async function main() {
  const source = fs.readFileSync(appPath, "utf8");
  [
    '"02"',
    'merchantApiRequest("/api/merchant/profile"',
    'method: "PUT"',
    "data-merchant-profile-field",
    "handleMerchantProfileSave(",
    "merchantProfileEditState",
    "data-merchant-photo-delete",
    "data-no-admin-mirror",
    "handleMerchantPhotoDelete(",
    "/api/merchant/photos/",
  ].forEach((needle) => assert(source.includes(needle), `商户资料页必须接入真实资料接口：${needle}`));

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-merchant-profile-"));
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
    const before = await json(baseUrl, "/api/merchant/profile?merchantId=merchant-001", { token: merchant.token });
    assert.equal(before.sourceEndpoint, "/api/merchant/profile");

    const suffix = Date.now().toString().slice(-5);
    const updated = await json(baseUrl, "/api/merchant/profile", {
      method: "PUT",
      token: merchant.token,
      body: {
        merchantId: "merchant-001",
        name: `云康护理中心${suffix}`,
        type: "康养护理",
        contact: "刘主管",
        phone: "0871-88886666",
        businessHours: "08:30-20:30",
        serviceCity: "云南省 昆明市",
        address: `昆明市盘龙区白塔路 ${suffix} 号`,
        intro: `真实接口保存商户资料 ${suffix}`,
      },
    });
    assert.equal(updated.name, `云康护理中心${suffix}`);
    assert.equal(updated.businessHours, "08:30-20:30");
    assert.equal(updated.intro, `真实接口保存商户资料 ${suffix}`);

    const after = await json(baseUrl, "/api/merchant/profile?merchantId=merchant-001", { token: merchant.token });
    assert.equal(after.name, updated.name);
    assert.equal(after.address, updated.address);
    assert.equal(after.updatedAt, updated.updatedAt);
    assert.ok(Array.isArray(after.storePhotos), "商户资料必须返回门店照片列表");
    assert.ok(after.storePhotos.length >= 3, "商户资料门店照片不能继续只靠前端硬编码");

    const photosBefore = await json(baseUrl, "/api/merchant/photos?merchantId=merchant-001", { token: merchant.token });
    assert.equal(photosBefore.sourceEndpoint, "/api/merchant/photos");
    const targetPhoto = photosBefore.photos.find((photo) => photo.id !== photosBefore.coverPhoto?.id) || photosBefore.photos[0];
    assert.ok(targetPhoto?.id, "必须存在可删除的门店照片");
    const photosAfterDelete = await json(baseUrl, `/api/merchant/photos/${encodeURIComponent(targetPhoto.id)}?merchantId=merchant-001`, {
      method: "DELETE",
      token: merchant.token,
    });
    assert.equal(photosAfterDelete.deletedPhoto.id, targetPhoto.id);
    assert.equal(photosAfterDelete.count, photosBefore.count - 1);
    assert.ok(!photosAfterDelete.photos.some((photo) => photo.id === targetPhoto.id), "删除后的照片列表不能继续包含目标照片");

    const profileAfterDelete = await json(baseUrl, "/api/merchant/profile?merchantId=merchant-001", { token: merchant.token });
    assert.ok(!profileAfterDelete.storePhotos.some((photo) => photo.id === targetPhoto.id), "删除结果必须持久化到商户资料接口");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("merchant profile real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
