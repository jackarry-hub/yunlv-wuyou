const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(...parts) {
  return fs.readFileSync(path.join(root, ...parts), "utf8");
}

const script = read("apps", "shared", "robustness-state.js");

[
  "URLSearchParams",
  "state",
  "empty",
  "error",
  "data-robustness-preview",
  "data-robustness-retry",
  "data-robustness-close",
  "window.location.reload()",
  "MutationObserver",
].forEach((needle) => {
  assert(script.includes(needle), `robustness preview script must include ${needle}`);
});

assert(/const state = \["empty", "error"\]\.includes\(mode\) \? mode : ""/.test(script), "robustness preview must only allow empty/error states");
assert(/if \(!state\) return;/.test(script), "robustness preview must be inactive without explicit URL state");
assert(/role:\s*"status"/.test(script), "empty state preview must use status semantics");
assert(/role:\s*"alert"/.test(script), "error state preview must use alert semantics");

const pages = [
  ["用户端", "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html"],
  ["向导端", "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "index.html"],
  ["商户端", "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype", "index.html"],
  ["管理后台", "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "index.html"],
];

for (const [name, ...file] of pages) {
  const html = read(...file);
  assert(html.includes("/shared/robustness-state.js?v=20260612-empty-error"), `${name} must load robustness state preview script`);
}

console.log("robustness state preview ok");
