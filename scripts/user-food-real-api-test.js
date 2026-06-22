const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const indexPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {}
    await delay(120);
  }
  throw new Error(`server did not start\n${output()}`);
}

async function json(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
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
  const shell = fs.readFileSync(indexPath, "utf8");

  assert.match(source, /"food": hydrateFoodFromApi/, "本地美食页必须接入真实接口水合");
  assert.match(source, /async function hydrateFoodFromApi/, "本地美食页必须保留独立真实接口水合函数");
  assert.match(source, /userApi\(`\/api\/user\/food\$\{params\.toString\(\)/, "本地美食页必须调用 /api/user/food 并支持分类筛选参数");
  assert.match(source, /data-food-restaurant-id="\$\{attr\(restaurant\.id\)\}"/, "餐厅卡片必须携带真实餐厅 ID");
  assert.match(source, /\/api\/user\/food\/restaurants\/\$\{encodeURIComponent\(restaurantId\)\}/, "查看餐厅详情必须调用真实详情接口");
  assert.match(source, /\/api\/user\/food\/restaurants\/\$\{encodeURIComponent\(restaurantId\)\}\/menu/, "查看菜单必须调用真实菜单接口");
  assert.match(source, /\/api\/user\/food\/restaurants\/\$\{encodeURIComponent\(restaurantId\)\}\/book/, "预约餐厅必须调用真实预约接口");
  assert.match(source, /\/api\/user\/food\/restaurants\/\$\{encodeURIComponent\(restaurantId\)\}\/order/, "立即订餐必须调用真实下单接口");
  assert.match(source, /\/api\/user\/food\/restaurants\/\$\{encodeURIComponent\(restaurantId\)\}\/route/, "餐厅导航必须调用真实路线接口");
  assert.match(source, /if \(await handleFoodAction\(actionButton, actionName\)\) return;/, "本地美食异步动作必须等待真实接口完成");
  assert(shell.includes("app.js?v=user-transport-real-api-20260620"), "用户端 H5 入口必须刷新脚本版本，避免旧美食页缓存");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-food-"));
  let logs = "";
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), YUNLV_RUNTIME_DIR: runtimeDir },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  child.stderr.on("data", (chunk) => { logs += chunk.toString(); });

  try {
    await waitForServer(baseUrl, () => logs);
    const login = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const token = login.token;

    const page = await json(baseUrl, "/api/user/food", { token });
    assert.equal(page.sourceEndpoint, "/api/user/food");
    assert(page.healthAdvice?.title && page.healthAdvice?.text, "美食接口必须返回基于健康档案的饮食建议");
    assert(Array.isArray(page.categories) && page.categories.length >= 4, "美食接口必须返回分类筛选");
    assert(Array.isArray(page.restaurants) && page.restaurants.length >= 4, "美食接口必须返回餐厅列表");
    assert(page.restaurants.every((restaurant) => (
      restaurant.id &&
      restaurant.name &&
      restaurant.category &&
      restaurant.detailEndpoint &&
      restaurant.menuEndpoint &&
      restaurant.bookEndpoint &&
      restaurant.orderEndpoint &&
      restaurant.routeEndpoint
    )), "每个餐厅必须返回可操作 ID 与真实接口");

    const nutrition = await json(baseUrl, `/api/user/food?category=${encodeURIComponent("营养餐")}`, { token });
    assert.equal(nutrition.query.category, "营养餐");
    assert(nutrition.restaurants.length >= 1, "营养餐分类必须返回真实餐厅");
    assert(nutrition.restaurants.every((restaurant) => /营养|养生|配餐|少油|少盐|健康/.test(`${restaurant.category}${restaurant.name}${restaurant.description}${restaurant.tags.join("")}`)), "分类结果必须由接口结果驱动");

    const sample = page.restaurants[0];
    const detail = await json(baseUrl, `/api/user/food/restaurants/${encodeURIComponent(sample.id)}`, { token });
    assert.equal(detail.restaurant.id, sample.id, "餐厅详情接口必须返回指定餐厅");
    assert(Array.isArray(detail.menu) && detail.menu.length >= 2, "餐厅详情必须返回真实菜单");

    const menu = await json(baseUrl, `/api/user/food/restaurants/${encodeURIComponent(sample.id)}/menu`, { token });
    assert.equal(menu.restaurant.id, sample.id);
    assert(menu.menu.every((item) => item.id && item.name && item.price), "菜单接口必须返回可下单菜品");

    const booked = await json(baseUrl, `/api/user/food/restaurants/${encodeURIComponent(sample.id)}/book`, {
      method: "POST",
      token,
      body: { diners: 2, note: "美食页接口测试", source: "food-test" },
    });
    assert.equal(booked.request.route, "food");
    assert.equal(booked.request.action, "预约餐厅");
    assert.equal(booked.request.payload.restaurantId, sample.id);

    const ordered = await json(baseUrl, `/api/user/food/restaurants/${encodeURIComponent(sample.id)}/order`, {
      method: "POST",
      token,
      body: { menuItemId: menu.menu[0].id, quantity: 2, source: "food-test" },
    });
    assert.equal(ordered.order.restaurantId, sample.id);
    assert.equal(ordered.order.quantity, 2);
    assert.equal(ordered.action.route, "food");

    const routed = await json(baseUrl, `/api/user/food/restaurants/${encodeURIComponent(sample.id)}/route`, {
      method: "POST",
      token,
      body: { source: "food-test" },
    });
    assert.equal(routed.restaurant.id, sample.id);
    assert.match(routed.route.url, /^https:\/\/uri\.amap\.com\//, "餐厅路线必须返回可打开的高德路线链接");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user food real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
