const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js"), "utf8");
const serverSource = fs.readFileSync(path.join(root, "server.js"), "utf8");

assert(
  appSource.includes('["users", "guides", "merchants", "exceptions"].includes(page.id)'),
  "老人用户管理、人工向导管理、商户管理、异常SOS列表页必须单独配置头部动作",
);
assert(
  appSource.includes('return `${button("批量导入", "import")} ${button("导出", "export")}`;'),
  "指定列表页去掉新增后仍必须保留批量导入和导出",
);
assert(
  appSource.includes("function exportAdminCurrentPageData"),
  "管理后台必须提供通用导出实现，不能继续回退为假提示",
);
assert(
  appSource.includes("function importAdminCurrentPageData"),
  "管理后台必须提供通用导入实现，不能继续回退为假提示",
);
assert(
  appSource.includes("function adminImportPageConfig"),
  "管理后台必须按页面定义真实导入配置",
);
assert(
  !appSource.includes('location.hash = pageHref("logs");\n    showToast(`${actionName}任务已创建，操作日志显示处理进度`)'),
  "导入导出按钮不能再统一回退到操作日志提示",
);
assert(
  serverSource.includes('pathname === "/api/admin/users/import"'),
  "服务端必须支持用户列表批量导入接口",
);
assert(
  serverSource.includes('pathname === "/api/admin/guides/import"'),
  "服务端必须支持向导列表批量导入接口",
);
assert(
  serverSource.includes('pathname === "/api/admin/merchants/import"'),
  "服务端必须支持商户列表批量导入接口",
);
assert(
  serverSource.includes('pathname === "/api/admin/alerts/import"'),
  "服务端必须支持异常/SOS列表批量导入接口",
);
assert(
  serverSource.includes('pathname === "/api/admin/policies"'),
  "服务端必须支持政策指南读取与导入导出接口",
);
assert(
  serverSource.includes('pathname === "/api/admin/knowledge"'),
  "服务端必须支持知识库读取与导入导出接口",
);

console.log("admin import/export regression assertions passed");
