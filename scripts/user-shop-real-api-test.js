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

  assert.match(source, /"shop": hydrateShopFromApi/, "优选商城页必须接入真实接口水合");
  assert.match(source, /async function hydrateShopFromApi/, "优选商城页必须保留独立真实接口水合函数");
  assert.match(source, /userApi\(`\/api\/user\/shop\$\{params\.toString\(\)/, "优选商城页必须调用 /api/user/shop 并支持筛选参数");
  assert.match(source, /data-shop-product-id="\$\{attr\(product\.id\)\}"/, "商品卡片必须携带真实商品 ID");
  assert.match(source, /data-add-cart="\$\{attr\(product\.id\)\}"/, "加入购物车必须携带真实商品 ID");
  assert.match(source, /\/api\/user\/shop\/cart/, "购物车必须调用真实购物车接口");
  assert.match(source, /\/api\/user\/shop\/cart\/items\/\$\{encodeURIComponent/, "购物车数量和移除必须调用真实购物车明细接口");
  assert.match(source, /\/api\/user\/shop\/orders/, "商城结算必须调用真实商城订单接口");
  assert.match(source, /\/api\/user\/shop\/family-purchase/, "家属代买必须调用真实代买服务接口");
  assert.match(source, /if \(await handleShopAction\(actionButton, actionName\)\) return;/, "商城动作必须等待真实接口完成");
  assert(shell.includes("user-shop-real-api-20260620"), "用户端 H5 入口必须刷新商城脚本版本，避免旧商城页缓存");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-shop-"));
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

    const page = await json(baseUrl, "/api/user/shop", { token });
    assert.equal(page.sourceEndpoint, "/api/user/shop");
    assert(Array.isArray(page.categories) && page.categories.length >= 6, "商城接口必须返回真实分类");
    assert(Array.isArray(page.products) && page.products.length >= 5, "商城接口必须返回商品列表");
    assert(page.products.every((product) => (
      product.id &&
      product.name &&
      product.category &&
      Number(product.price) > 0 &&
      Number(product.stock) >= 0 &&
      product.addCartEndpoint &&
      product.buyEndpoint
    )), "每个商品必须返回可操作 ID、库存、价格与真实接口");
    assert(page.cart && Array.isArray(page.cart.items), "商城接口必须返回当前购物车");
    assert.equal(page.endpoints.checkout, "/api/user/shop/orders");
    assert.equal(page.endpoints.familyPurchase, "/api/user/shop/family-purchase");

    const devices = await json(baseUrl, `/api/user/shop?category=${encodeURIComponent("智能设备")}`, { token });
    assert.equal(devices.query.category, "智能设备");
    assert(devices.products.length >= 1, "智能设备分类必须返回真实商品");
    assert(devices.products.every((product) => /智能设备|智能|设备|血压|机器人|定位/.test(`${product.category}${product.name}${product.tags.join("")}`)), "分类结果必须由接口结果驱动");

    const sample = page.products[0];
    const cart = await json(baseUrl, "/api/user/shop/cart", {
      method: "POST",
      token,
      body: { productId: sample.id, quantity: 2, source: "shop-test" },
    });
    assert.equal(cart.cart.items[0].productId, sample.id);
    assert.equal(cart.cart.items[0].quantity, 2);
    assert.equal(cart.page.cart.count, 2);

    const updated = await json(baseUrl, `/api/user/shop/cart/items/${encodeURIComponent(cart.cart.items[0].id)}`, {
      method: "POST",
      token,
      body: { quantity: 3, source: "shop-test" },
    });
    assert.equal(updated.cart.items[0].quantity, 3);

    const family = await json(baseUrl, "/api/user/shop/family-purchase", {
      method: "POST",
      token,
      body: { productId: sample.id, quantity: 1, note: "家属代买接口测试", source: "shop-test" },
    });
    assert.equal(family.request.route, "shop");
    assert.equal(family.request.action, "代买服务");
    assert.equal(family.request.payload.productId, sample.id);

    const order = await json(baseUrl, "/api/user/shop/orders", {
      method: "POST",
      token,
      body: { items: updated.cart.items, source: "shop-test" },
    });
    assert.equal(order.order.providerType, "merchant");
    assert.equal(order.order.source, "用户端优选商城");
    assert.equal(order.order.items.length, 1);
    assert.equal(order.order.items[0].productId, sample.id);
    assert.equal(order.page.cart.count, 0, "商城结算成功后接口购物车必须清空");

    const removed = await json(baseUrl, `/api/user/shop/cart/items/${encodeURIComponent(updated.cart.items[0].id)}`, {
      method: "DELETE",
      token,
    });
    assert.equal(removed.cart.count, 0, "删除购物车商品后接口购物车必须为空");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user shop real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
