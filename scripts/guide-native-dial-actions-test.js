const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(
  path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js"),
  "utf8",
);

const helpStart = source.indexOf("function renderHelp()");
const helpEnd = source.indexOf("function renderRules()");
assert(helpStart >= 0 && helpEnd > helpStart, "必须能定位向导端帮助中心页面渲染函数");
const helpSource = source.slice(helpStart, helpEnd);
const cancelledStart = source.indexOf("function renderCancelledDetail()");
const cancelledEnd = source.indexOf("function renderCustomerFile()");
assert(cancelledStart >= 0 && cancelledEnd > cancelledStart, "必须能定位向导端已取消订单详情渲染函数");
const cancelledSource = source.slice(cancelledStart, cancelledEnd);
const customerChatStart = source.indexOf("function renderCustomerChat()");
const customerChatEnd = source.indexOf("function renderSupportChat()", customerChatStart);
assert(customerChatStart >= 0 && customerChatEnd > customerChatStart, "必须能定位向导端客户消息渲染函数");
const customerChatSource = source.slice(customerChatStart, customerChatEnd);
const supportChatStart = source.indexOf("function renderSupportChat()");
const supportChatEnd = source.indexOf("function renderSafety()", supportChatStart);
assert(supportChatStart >= 0 && supportChatEnd > supportChatStart, "必须能定位向导端平台客服渲染函数");
const supportChatSource = source.slice(supportChatStart, supportChatEnd);
const safetyAlarmStart = source.indexOf("async function openGuideAlarmFlow(");
const safetyAlarmEnd = source.indexOf("function openGuideExceptionForm(", safetyAlarmStart);
assert(safetyAlarmStart >= 0 && safetyAlarmEnd > safetyAlarmStart, "必须能定位向导端安全中心一键报警函数");
const safetyAlarmSource = source.slice(safetyAlarmStart, safetyAlarmEnd);

assert.equal(
  source.includes("function safeCallPhone("),
  false,
  "向导端拨号不能保留普通按钮触发的 safeCallPhone 路径，必须使用原生 tel 链接",
);

assert.match(
  helpSource,
  /<a class="secondary-btn"[^>]*guideDialAttrs\('4000000000'\)[\s\S]*咨询热线[\s\S]*<\/a>/,
  "向导端帮助中心咨询热线必须使用原生 tel 链接，不能使用通用按钮或 toast",
);
assert.equal(
  helpSource.includes('data-action="拨打客服热线"'),
  false,
  "向导端帮助中心咨询热线不能继续使用 data-action 拨打客服热线",
);

assert.match(
  cancelledSource,
  /<img class="guide-accepted-avatar" src="\.\/assets\/review-customer-li\.jpg"/,
  "向导端已取消订单详情的李奶奶头像必须和首页/订单页使用同一张 review-customer-li.jpg",
);
assert.match(
  cancelledSource,
  /<a class="call-circle"[^>]*guideDialAttrs\(phone\)[\s\S]*aria-label="拨打/,
  "向导端已取消订单详情拨号必须使用原生 tel 链接，不能使用普通按钮或 toast",
);
assert.equal(
  cancelledSource.includes('data-action="联系客户"'),
  false,
  "向导端已取消订单详情联系客户不能继续使用 data-action 通用反馈",
);

assert.match(
  customerChatSource,
  /<a class="guide-chat-phone"[^>]*guideDialAttrs\('13800005678'\)[\s\S]*aria-label="拨打李奶奶电话"[\s\S]*电话[\s\S]*<\/a>/,
  "向导端客户聊天页电话必须使用原生 tel 链接，不能使用 data-action 按钮",
);
assert.equal(
  customerChatSource.includes('data-action="拨打李奶奶电话"'),
  false,
  "向导端客户聊天页电话不能继续使用 data-action 拨打李奶奶电话",
);
assert.match(
  supportChatSource,
  /<a class="guide-chat-phone"[^>]*guideDialAttrs\('4000000000'\)[\s\S]*aria-label="拨打客服电话"[\s\S]*电话[\s\S]*<\/a>/,
  "向导端平台客服页电话必须使用原生 tel 链接，不能使用 data-action 按钮",
);
assert.equal(
  supportChatSource.includes('data-action="拨打客服电话"'),
  false,
  "向导端平台客服页电话不能继续使用 data-action 拨打客服电话",
);

assert.match(
  safetyAlarmSource,
  /<a class="danger-btn"[^>]*guideDialAttrs\('110'\)[\s\S]*拨打 110[\s\S]*<\/a>/,
  "向导端安全中心拨打 110 必须使用原生 tel 链接，不能自动调起或使用普通按钮",
);
assert.match(
  safetyAlarmSource,
  /<a class="primary-btn"[^>]*guideDialAttrs\('120'\)[\s\S]*拨打 120[\s\S]*<\/a>/,
  "向导端安全中心拨打 120 必须使用原生 tel 链接，不能自动调起或使用普通按钮",
);
assert.doesNotMatch(
  safetyAlarmSource,
  /safeCallPhone\('110'\)|调起拨号|已调起 110 拨号/,
  "向导端安全中心不能在打开一键报警面板时自动拨号或显示假拨号状态",
);

console.log("guide native dial actions ok");
