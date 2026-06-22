const assert = require("assert");
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist-preview");
const uniappDir = path.join(root, "uniapp");

const endpointRequirements = [
  {
    slug: "user",
    title: "云旅无忧用户端",
    requiredFiles: ["index.html", "app.js", "styles.css"],
    minAssets: 80,
  },
  {
    slug: "guide",
    title: "云旅无忧向导端",
    requiredFiles: ["index.html", "app.js", "styles.css"],
    minAssets: 6,
  },
  {
    slug: "merchant",
    title: "云旅无忧商户端",
    requiredFiles: ["index.html", "app.js", "styles.css"],
    minAssets: 20,
  },
  {
    slug: "admin",
    title: "管理后台",
    requiredFiles: ["index.html", "app.js"],
    minAssets: 0,
  },
];

const uniappRequiredFiles = [
  "package.json",
  "manifest.json",
  "pages.json",
  "App.vue",
  "main.js",
  "common/api.js",
  "common/router.js",
  "common/roles.js",
  "common/native.js",
  "components/YlPage.vue",
  "pages/user/home.vue",
  "pages/user/guide.vue",
  "pages/user/activity-map.vue",
  "pages/user/emergency.vue",
  "pages/user/order-submit.vue",
  "pages/user/orders.vue",
  "pages/user/messages.vue",
  "pages/user/profile.vue",
  "pages/guide/hall.vue",
  "pages/guide/order-detail.vue",
  "pages/guide/service.vue",
  "pages/guide/exception.vue",
  "pages/guide/income.vue",
  "pages/merchant/display.vue",
  "pages/merchant/service-create.vue",
  "pages/merchant/orders.vue",
  "pages/merchant/quote.vue",
  "pages/merchant/reviews.vue",
];

function runBuild() {
  const result = spawnSync(process.execPath, ["scripts/build-static-preview.js"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(`build-static-preview failed\n${result.stdout}\n${result.stderr}`);
  }
  process.stdout.write(result.stdout);
}

function read(file) {
  assert(fs.existsSync(file), `missing build artifact: ${file}`);
  return fs.readFileSync(file, "utf8");
}

function assertNoBrokenLocalRefs(file) {
  const html = read(file);
  const refs = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);
  refs.forEach((ref) => {
    if (!ref || ref.startsWith("http") || ref.startsWith("data:") || ref.startsWith("#")) return;
    const clean = ref.split("?")[0].split("#")[0];
    if (!clean || clean.endsWith("/")) return;
    const target = clean.startsWith("/")
      ? path.join(outDir, clean.replace(/^\/+/, ""))
      : path.resolve(path.dirname(file), clean);
    assert(fs.existsSync(target), `${file} references missing asset ${ref}`);
  });
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return [full];
  });
}

function assertEndpointArtifact(item) {
  const dir = path.join(outDir, item.slug);
  assert(fs.existsSync(dir) && fs.statSync(dir).isDirectory(), `missing endpoint dir ${item.slug}`);
  item.requiredFiles.forEach((name) => {
    assert(fs.existsSync(path.join(dir, name)), `${item.slug} missing required artifact ${name}`);
  });
  const html = read(path.join(dir, "index.html"));
  assert(html.includes(item.title) || html.includes("云旅无忧"), `${item.slug}/index.html should contain title`);
  assertNoBrokenLocalRefs(path.join(dir, "index.html"));
  const assetDir = path.join(dir, "assets");
  const assets = listFiles(assetDir).filter((file) => !file.endsWith(".DS_Store"));
  assert(assets.length >= item.minAssets, `${item.slug} should include at least ${item.minAssets} assets, got ${assets.length}`);
}

function assertSharedArtifact() {
  const sharedDir = path.join(outDir, "shared");
  assert(fs.existsSync(sharedDir), "missing shared artifact directory");
  ["business-bridge.js", "styles.css"].forEach((name) => {
    assert(fs.existsSync(path.join(sharedDir, name)), `shared missing ${name}`);
  });
}

function assertUniappSkeleton() {
  uniappRequiredFiles.forEach((name) => {
    assert(fs.existsSync(path.join(uniappDir, name)), `uniapp missing required file ${name}`);
  });
  const pagesJson = JSON.parse(read(path.join(uniappDir, "pages.json")));
  const pagePaths = (pagesJson.pages || []).map((page) => page.path);
  [
    "pages/user/home",
    "pages/user/guide",
    "pages/user/activity-map",
    "pages/user/emergency",
    "pages/guide/hall",
    "pages/guide/service",
    "pages/merchant/display",
    "pages/merchant/service-create",
  ].forEach((page) => {
    assert(pagePaths.includes(page), `uniapp pages.json missing ${page}`);
  });
  assert(pagePaths.length >= 40, `uniapp pages.json should expose substantial migrated pages, got ${pagePaths.length}`);
}

function main() {
  runBuild();

  const indexHtml = read(path.join(outDir, "index.html"));
  assert(indexHtml.includes("云旅无忧四端预览"), "unified preview title should exist");
  ["/user/", "/guide/", "/merchant/", "/admin/"].forEach((endpoint) => {
    assert(indexHtml.includes(`.${endpoint}`) || indexHtml.includes(endpoint), `unified preview should link ${endpoint}`);
  });

  assertSharedArtifact();
  endpointRequirements.forEach(assertEndpointArtifact);
  assertUniappSkeleton();

  assert(fs.existsSync(path.join(outDir, ".nojekyll")), "GitHub Pages .nojekyll marker should exist");
  console.log("build artifact test ok: four endpoints, shared assets, and uni-app skeleton verified");
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
