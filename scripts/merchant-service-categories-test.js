const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  merchantServiceCategories,
  merchantServiceCategoriesForApi,
  validateMerchantServiceCategories,
} = require("../server/lib/merchant-service-categories");

const root = path.resolve(__dirname, "..");
const merchantAppPath = path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "app.js");

const expectedRows = [
  ["医疗卫生", "体检、问诊预约、陪诊协作、康复建议、附近医院服务", "仅做预约与服务协调，不提供医疗诊断结论。"],
  ["康养护理", "护工护理、康复理疗、上门护理、慢病管理服务", "需商户资质审核。"],
  ["生活服务", "家政、洗衣、保洁、维修、代购代办", "可标准化套餐。"],
  ["交通出行", "接送站、包车、代驾、无障碍出行", "需司机/车辆资质。"],
  ["文旅体验", "景区门票、讲解、活动课程、旅拍、非遗体验", "与活动地图联动。"],
  ["餐饮与本地美食", "餐厅预订、营养餐、特色美食推荐", "可结合老人饮食偏好。"],
  ["殡葬服务", "咨询、预约、方案服务、后续关怀", "需谨慎合规，避免强推，页面表达要克制。"],
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
    merchantServiceCategories.map((item) => [item.category, item.examples.join("、"), item.note]),
    expectedRows,
    "商户服务分类应与 6.1 图示一致",
  );
  assert.equal(validateMerchantServiceCategories().valid, true);

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = merchantServiceCategoriesForApi(seed);
  assert.equal(direct.version, "6.1-merchant-service-categories-v1");
  assert.equal(direct.source, "6.1 商户服务分类建议");
  assert.equal(direct.categoryCount, 7);
  assert.equal(direct.categories.find((item) => item.category === "康养护理").runtime.serviceCount >= 1, true);
  assert.equal(direct.categories.find((item) => item.category === "文旅体验").runtime.activityMapLinked >= 1, true);

  const merchantAppSource = fs.readFileSync(merchantAppPath, "utf8");
  assert(merchantAppSource.includes("/api/merchant/service-categories/selection"), "商户端分类确认应调用真实选择接口");
  assert(merchantAppSource.includes("handleMerchantServiceCategoryConfirm"), "商户端分类确认应有真实保存处理函数");
  assert(merchantAppSource.includes("data-service-category-confirm"), "商户端分类确认按钮应绑定真实保存入口");
  assert(!merchantAppSource.includes("服务分类当前为："), "商户端分类确认不应停留在状态提示");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-merchant-categories-"));
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

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("merchant-categories"));

    const categories = await json(baseUrl, "/api/merchant/service-categories", { token: merchant.token });
    assert.equal(categories.categoryCount, 7);
    assert.equal(categories.validation.valid, true);
    assert.equal(categories.selection.categoryId, "care-nursing");
    assert.equal(categories.selection.category, "康养护理");
    assert.equal(categories.selection.serviceTitle, "康养护理服务");
    assert.equal(categories.related.selection, "/api/merchant/service-categories/selection");
    assert.equal(categories.related.activitiesMap, "/api/activities/map");
    assert.equal(categories.categories.find((item) => item.category === "医疗卫生").note, "仅做预约与服务协调，不提供医疗诊断结论。");
    assert(categories.categories.find((item) => item.category === "殡葬服务").note.includes("避免强推"));

    const initialSelection = await json(baseUrl, "/api/merchant/service-categories/selection?merchantId=merchant-001", { token: merchant.token });
    assert.equal(initialSelection.draft.categoryId, "care-nursing");

    const savedSelection = await json(baseUrl, "/api/merchant/service-categories/selection", {
      method: "POST",
      token: merchant.token,
      body: { merchantId: "merchant-001", categoryId: "life-service" },
    });
    assert.equal(savedSelection.draft.categoryId, "life-service");
    assert.equal(savedSelection.draft.category, "生活服务");
    assert.equal(savedSelection.draft.serviceTitle, "生活服务");
    assert.equal(savedSelection.draft.description, "生活服务已接入真实分类草稿，提交后进入后台审核。");

    const persistedSelection = await json(baseUrl, "/api/merchant/service-categories/selection?merchantId=merchant-001", { token: merchant.token });
    assert.equal(persistedSelection.draft.categoryId, "life-service");
    assert.equal(persistedSelection.selectedCategory.category, "生活服务");

    const createdService = await json(baseUrl, "/api/merchant/services", {
      method: "POST",
      token: merchant.token,
      body: { providerId: "merchant-001", status: "待审核" },
    });
    assert.equal(createdService.category, "生活服务");
    assert.equal(createdService.title, "生活服务");
    assert.equal(createdService.status, "待审核");

    const bare = await json(baseUrl, "/merchant/service-categories", { token: merchant.token });
    assert.equal(bare.categoryCount, 7);

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.merchantServiceCategories.architecturePath, "/api/merchant/service-categories");
    assert.equal(reference.merchantServiceCategories.categoryCount, 7);
    assert.equal(reference.merchantServiceCategories.categories.find((item) => item.category === "文旅体验").note, "与活动地图联动。");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("merchant service categories ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
