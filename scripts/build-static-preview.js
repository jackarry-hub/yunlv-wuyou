const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist-preview");

const targets = [
  {
    name: "用户端",
    slug: "user",
    source: path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现"),
    description: "首页、人工向导、活动地图、SOS、订单、消息、我的",
  },
  {
    name: "向导端",
    slug: "guide",
    source: path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现"),
    description: "上线接单、订单详情、服务中、异常上报、收入",
  },
  {
    name: "商户端",
    slug: "merchant",
    source: path.join(root, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype"),
    description: "工作台、服务发布、预约订单、报价确认、评价",
  },
  {
    name: "管理后台",
    slug: "admin",
    source: path.join(root, "apps", "admin"),
    description: "数据概览、审核、活动、SOS、派单、订单闭环",
  },
];

const sharedSource = path.join(root, "apps", "shared");
const publicSource = path.join(root, "public");
const uiRefSource = path.join(root, "云旅无忧UI界面参考图");

function copyDir(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing preview source: ${source}`);
  }
  fs.cpSync(source, target, {
    recursive: true,
    force: true,
    filter: (src) => !src.endsWith(".DS_Store"),
  });
}

function patchTextFile(file, replacements) {
  if (!fs.existsSync(file)) return;
  const ext = path.extname(file).toLowerCase();
  if (![".html", ".js", ".css"].includes(ext)) return;
  let text = fs.readFileSync(file, "utf8");
  replacements.forEach(([pattern, value]) => {
    text = text.replace(pattern, value);
  });
  fs.writeFileSync(file, text, "utf8");
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(full);
    return [full];
  });
}

function patchEndpoint(slug) {
  const dir = path.join(outDir, slug);
  const replacements = [
    [/(['"])\/shared\//g, "$1../shared/"],
    [/(['"])\/user\//g, "$1../user/"],
    [/(['"])\/guide\//g, "$1../guide/"],
    [/(['"])\/merchant\//g, "$1../merchant/"],
    [/(['"])\/admin\//g, "$1../admin/"],
    [/(['"])\/prototype\//g, "$1../prototype/"],
    [/(['"])\/ui-ref\//g, "$1../ui-ref/"],
    [/(['"])\/styles\.css/g, "$1./styles.css"],
    [/(['"])\/app\.js/g, "$1./app.js"],
    [/href="\//g, 'href="../'],
  ];
  walkFiles(dir).forEach((file) => patchTextFile(file, replacements));
}

function writeIndex() {
  const cards = targets.map((item) => `
    <a class="card" href="./${item.slug}/">
      <strong>${item.name}</strong>
      <span>${item.description}</span>
      <em>打开 ${item.slug}/</em>
    </a>
  `).join("");

  fs.writeFileSync(path.join(outDir, "index.html"), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>云旅无忧预览入口</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #102033;
        background: #eef5fb;
      }
      main {
        width: min(960px, calc(100% - 40px));
        margin: 0 auto;
        padding: 56px 0;
      }
      h1 { margin: 0 0 10px; font-size: 34px; }
      p { margin: 0 0 28px; color: #5d7085; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        gap: 16px;
      }
      .card {
        min-height: 150px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 22px;
        border-radius: 14px;
        color: inherit;
        text-decoration: none;
        background: #fff;
        box-shadow: 0 10px 30px rgba(35, 76, 120, .12);
      }
      .card strong { font-size: 22px; }
      .card span { flex: 1; color: #607285; line-height: 1.5; }
      .card em { color: #1f8f5f; font-style: normal; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <h1>云旅无忧四端预览</h1>
      <p>选择入口进入用户端、向导端、商户端或管理后台。H5 用于临时验收预览，真实业务请求会连接后端 API。</p>
      <section class="grid">${cards}</section>
    </main>
  </body>
</html>
`, "utf8");
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "", "utf8");
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
copyDir(sharedSource, path.join(outDir, "shared"));
copyDir(publicSource, path.join(outDir, "public"));
copyDir(uiRefSource, path.join(outDir, "ui-ref"));
copyDir(path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui"), path.join(outDir, "prototype", "admin"));
targets.forEach((item) => copyDir(item.source, path.join(outDir, item.slug)));
targets.forEach((item) => patchEndpoint(item.slug));
writeIndex();

console.log(`static preview built: ${outDir}`);
