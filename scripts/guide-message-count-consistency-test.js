const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(
  path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "app.js"),
  "utf8",
);
const styles = fs.readFileSync(
  path.join(root, "云旅无忧UI界面参考图", "向导端", "向导端代码实现", "styles.css"),
  "utf8",
);

const renderMessagesStart = source.indexOf("function renderMessages()");
const renderMessagesEnd = source.indexOf("function guideMessageRows(");
const renderSystemNoticeStart = source.indexOf("function renderSystemNotice()");
const renderSystemNoticeEnd = source.indexOf("function renderOrderMessages()");
const renderOrderMessagesStart = source.indexOf("function renderOrderMessages()");
const renderOrderMessagesEnd = source.indexOf("function renderCustomerChat()");
const hydrateStart = source.indexOf("function hydrateGuideMessages(screenId)");
const hydrateEnd = source.indexOf("const guideApiHydrateState");
const initStart = source.indexOf("function init()");
const hydrateInteractiveStart = source.indexOf("function hydrateInteractiveControls(root)");
const hydrateInteractiveEnd = source.indexOf("async function handleAction(actionButton)");

assert(renderMessagesStart >= 0 && renderMessagesEnd > renderMessagesStart, "必须能定位向导端消息中心渲染函数");
assert(renderSystemNoticeStart >= 0 && renderSystemNoticeEnd > renderSystemNoticeStart, "必须能定位向导端系统通知渲染函数");
assert(renderOrderMessagesStart >= 0 && renderOrderMessagesEnd > renderOrderMessagesStart, "必须能定位向导端订单消息渲染函数");
assert(hydrateStart >= 0 && hydrateEnd > hydrateStart, "必须能定位向导端消息加载函数");
assert(initStart >= 0, "必须能定位向导端初始化点击处理函数");
assert(hydrateInteractiveStart >= 0 && hydrateInteractiveEnd > hydrateInteractiveStart, "必须能定位向导端交互控件补全函数");

const renderMessagesSource = source.slice(renderMessagesStart, renderMessagesEnd);
const renderSystemNoticeSource = source.slice(renderSystemNoticeStart, renderSystemNoticeEnd);
const renderOrderMessagesSource = source.slice(renderOrderMessagesStart, renderOrderMessagesEnd);
const hydrateSource = source.slice(hydrateStart, hydrateEnd);
const initSource = source.slice(initStart, hydrateInteractiveStart);
const hydrateInteractiveSource = source.slice(hydrateInteractiveStart, hydrateInteractiveEnd);
const guideOrderMessageStatusStart = source.indexOf("function guideOrderMessageStatus(");
const guideOrderMessageStatusEnd = source.indexOf("function filteredGuideOrderMessages(", guideOrderMessageStatusStart);
assert(guideOrderMessageStatusStart >= 0 && guideOrderMessageStatusEnd > guideOrderMessageStatusStart, "必须能定位订单消息状态函数");
const guideOrderMessageStatusSource = source.slice(guideOrderMessageStatusStart, guideOrderMessageStatusEnd);

assert.match(source, /function guideOrderMessages\(/, "订单消息数量和列表必须由 guideOrderMessages 统一筛选");
assert.match(source, /const GUIDE_SYSTEM_NOTICES = \[\];/, "系统通知不能继续使用静态假数据");
assert.equal(source.includes("端午假期服务安排通知"), false, "系统通知不能保留静态假通知");
assert.equal(source.includes("服务评价规则优化通知"), false, "系统通知不能保留静态假通知");
assert.equal(source.includes("实名认证资料即将到期"), false, "系统通知不能保留静态假通知");
assert.equal(source.includes("系统维护公告"), false, "系统通知不能保留静态假通知");
assert.match(source, /function guideMessageCenterMessages\(/, "消息中心必须统一读取聚合消息数据");
assert.match(source, /function applyGuideMessagesCenterData\(/, "消息中心必须有聚合接口数据落库函数");
assert.match(source, /guideApiRequest\('\/api\/guide\/messages\?guideId=guide-001'\)/, "消息中心必须加载向导端页面级聚合接口");
assert.match(source, /function guideSystemNoticeUnreadCount\(/, "系统通知未读数必须有统一计数函数");
assert.match(source, /function guideInteractiveMessages\(/, "互动消息数量必须有统一计数函数");
assert.match(source, /summary && Number\.isFinite\(Number\(summary\.unread\)\)/, "底部消息角标必须优先使用聚合接口未读数");
assert.match(source, /return guideUnreadMessages\(guideMessageCenterMessages\(\)\)\.length;/, "底部消息角标必须回退到同一份消息中心数据");
assert.match(source, /function filteredGuideOrderMessages\(/, "订单消息页筛选必须复用订单消息列表数据");
assert.match(guideOrderMessageStatusSource, /message\.read[\s\S]+['"]已处理['"]/, "订单消息全部已读后，已读订单消息必须归入已处理，避免待处理列表残留");
assert.match(renderMessagesSource, /summary\.orderCount/, "消息中心订单消息角标必须使用聚合接口订单消息总数");
assert.match(renderMessagesSource, /summary\.orderUnread/, "消息中心订单消息快捷入口角标必须使用聚合接口未读订单消息数");
assert.match(renderMessagesSource, /orderMessageUnreadCount \? String\(orderMessageUnreadCount\)/, "全部已读后订单消息入口不能继续显示订单总数角标");
assert.match(renderMessagesSource, /guideSystemNoticeUnreadCount\(\)/, "消息中心系统通知入口必须显示系统通知未读数");
assert.match(renderMessagesSource, /系统通知[\s\S]*systemNoticeCount \? String\(systemNoticeCount\)/, "消息中心系统通知入口角标必须使用系统通知未读数");
assert.match(renderMessagesSource, /summary\.interactiveCount/, "消息中心互动消息入口必须使用聚合接口互动消息总数");
assert.match(renderMessagesSource, /data-guide-message-list/, "#06 消息总入口必须展示真实最新消息列表");
assert.match(renderMessagesSource, /data-guide-message-read="/, "#06 最新消息必须支持单条已读");
assert.match(renderMessagesSource, /data-guide-message-read-all/, "#06 消息总入口必须支持全部已读");
assert.match(renderSystemNoticeSource, /guideSystemMessages\(\)/, "#31 系统通知必须使用同一份聚合消息数据");
assert.match(renderSystemNoticeSource, /data-guide-message-state="empty"/, "#31 系统通知无真实数据时必须显示空状态");
assert.equal(renderSystemNoticeSource.includes("guide-notice-tabs"), false, "#31 系统通知没有真实数据时不能显示静态分类筛选");
assert.match(renderOrderMessagesSource, /guideMessageCenterMessages\(\)/, "订单消息页必须使用同一份消息中心聚合数据");
assert.match(renderOrderMessagesSource, /data-guide-order-message-filter/, "订单消息页筛选按钮必须有专属点击标记");
assert.match(renderOrderMessagesSource, /data-guide-message-read="/, "订单消息页必须支持单条消息已读");
assert.match(initSource, /orderMessageFilterButton[\s\S]+renderScreen\('32', false, \{ replace: true, skipApiHydrate: true \}\)/, "订单消息筛选必须专属处理并重渲染当前页");
assert.match(initSource, /guideMessageRefreshButton[\s\S]+refreshGuideMessagesCenter/, "消息中心刷新按钮必须专属调用真实接口");
assert.match(initSource, /guideMessageReadAllButton[\s\S]+markGuideMessagesReadAll/, "消息中心全部已读按钮必须专属调用真实接口");
assert.match(initSource, /guideMessageReadButton[\s\S]+markGuideMessageRead/, "消息中心单条已读按钮必须专属调用真实接口");
assert.match(hydrateInteractiveSource, /guideOrderMessageFilter === undefined/, "订单消息筛选按钮不能被补成通用选择按钮");
assert.match(hydrateSource, /\['06', '31', '32'\]\.includes\(screenId\)/, "#31/#32 消息子页必须触发后台消息加载");
assert.match(hydrateSource, /hydrateGuideMessagesCenterFromApi\(\)/, "消息加载必须调用页面级聚合接口");
assert.equal(renderOrderMessagesSource.includes("新订单推荐"), false, "订单消息页不能继续写死 4 条静态订单消息");
assert.equal(renderOrderMessagesSource.includes("取消申请通过"), false, "订单消息页不能继续写死 4 条静态订单消息");
assert.match(styles, /\.menu-left\s*\{[\s\S]*background:\s*transparent;/, "订单消息左侧按钮必须重置背景，不能出现按钮默认阴影/灰底");
assert.match(styles, /\.menu-left\s*\{[\s\S]*box-shadow:\s*none;/, "订单消息左侧按钮必须无阴影");

console.log("guide message count consistency ok");
