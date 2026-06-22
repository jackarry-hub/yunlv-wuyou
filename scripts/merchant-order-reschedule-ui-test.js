const assert = require("assert");
const fs = require("fs");
const path = require("path");

const appPath = path.join(
  __dirname,
  "..",
  "云旅无忧UI界面参考图",
  "商户端",
  "merchant-ui-prototype",
  "app.js",
);
const app = fs.readFileSync(appPath, "utf8");

assert(
  app.includes("function currentMerchantRescheduleOrder("),
  "商户端 #36 应从 /api/merchant/orders 派生当前可改期订单，而不是写死页面数据",
);
assert(
  app.includes("/已报价|待派单|已派单|待服务/"),
  "商户端 #36 只能选择后端允许改期的订单状态",
);
assert(
  app.includes("暂无可改期订单") && app.includes("disabled>提交改期申请"),
  "商户端 #36 没有可改期接口订单时应展示空状态并禁用提交",
);
assert(
  app.includes("data-merchant-reschedule-date"),
  "商户端 #36 新日期应是页面状态控件，提交时可读取真实选择",
);
assert(
  app.includes("data-merchant-reschedule-slot"),
  "商户端 #36 新时段应是页面状态控件，提交时可读取真实选择",
);
assert(
  app.includes("data-merchant-reschedule-note"),
  "商户端 #36 备注应是真实 textarea，提交时可随接口载荷保存",
);
assert(
  app.includes("merchantReschedulePayload("),
  "商户端 #36 提交改期时必须用页面选择生成接口载荷",
);
assert(
  !app.includes('data-merchant-order-action="reschedule" data-order-id="order-li-care"'),
  "商户端 #36 改期提交不能绑定静态 order-li-care",
);
assert(
  !app.includes('newTime: "2026-06-03 10:00"'),
  "商户端改期接口不能提交固定 newTime",
);

console.log("merchant order reschedule ui contract ok");
