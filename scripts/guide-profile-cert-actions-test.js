const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(
  path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js"),
  "utf8",
);
const profileStart = source.indexOf("function renderProfile()");
const profileEnd = source.indexOf("function renderSettings()");
assert(profileStart >= 0 && profileEnd > profileStart, "必须能定位向导端个人资料页面渲染函数");
const profileSource = source.slice(profileStart, profileEnd);

assert.match(
  profileSource,
  /data-guide-profile-cert="realname"/,
  "向导端个人资料实名认证必须打开真实认证资料面板，不能落到通用 data-action 提示",
);
assert.match(
  profileSource,
  /data-guide-profile-cert="health"/,
  "向导端个人资料健康证明必须打开真实健康证明面板，不能落到通用 data-action 提示",
);
assert.match(
  profileSource,
  /data-action="查看协议：服务协议"/,
  "向导端个人资料服务协议必须进入真实服务协议详情页",
);
assert.match(source, /服务协议:\s*\{/, "向导端协议详情必须包含服务协议正文");
assert.equal(
  profileSource.includes('data-action="查看${label}"'),
  false,
  "向导端认证资料不能继续使用通用 查看${label} 动作",
);
assert.match(
  source,
  /data-guide-profile-intro-edit/,
  "向导端个人简介必须有专属编辑入口，不能落到通用 data-action 提示",
);
assert.match(
  source,
  /data-guide-profile-intro-field/,
  "向导端个人简介编辑态必须渲染可输入文本框",
);
assert.match(
  source,
  /data-guide-profile-intro-save/,
  "向导端个人简介必须提供真实保存动作",
);
assert.equal(
  profileSource.includes('data-action="编辑个人简介"'),
  false,
  "向导端个人简介不能继续使用通用 编辑个人简介 动作",
);

console.log("guide profile certification actions ok");
