const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui", "app.js"), "utf8");

assert(source.includes('function applyAdminDispatchStatusQuickFilter'), "任务调度页必须提供任务状态快捷筛选");
assert(source.includes('function dispatchRowsForFilter'), "任务调度页必须按筛选状态重建任务池");
assert(source.includes('function exportAdminDispatchData'), "任务调度页必须提供真实导出能力");
assert(source.includes('function importAdminDispatchCsv'), "任务调度页必须提供真实导入能力");
assert(source.includes('function currentAdminDispatchDetail'), "任务调度详情页必须从真实调度队列构建详情数据");
assert(source.includes("rememberAdminDispatchSelection"), "任务调度详情页必须记住从任务列表点击进入的当前任务");
assert(source.includes('function handleAdminDispatchDetailAction'), "任务调度详情页顶部动作必须有专用处理器");
assert(source.includes('data-action="切换调度详情标签:'), "任务调度详情页标签切换必须是显式动作");
assert(source.includes('data-action="选择执行方:'), "任务调度详情页候选执行方必须提供真实选择动作");
assert(source.includes('adminApi("/api/admin/audit-logs")'), "任务调度模块必须读取后台审计日志");
assert(source.includes('adminApi("/api/messages?role=user")'), "任务调度模块必须读取用户通知记录");
assert(source.includes('adminApi("/api/messages?role=guide")'), "任务调度模块必须读取向导通知记录");
assert(source.includes('adminApi("/api/messages?role=merchant")'), "任务调度模块必须读取商户通知记录");
assert(source.includes("function dispatchNotificationRows"), "任务调度详情页必须从真实消息记录生成通知状态");
assert(source.includes("function dispatchDomainAuditRows"), "任务调度页必须从真实审计日志生成调度记录");
assert(!source.includes('["05-19 09:23:15", "系统自动匹配", "DD20240519001", "已为任务匹配推荐执行方", "系统"]'), "任务调度记录不能保留硬编码样例数据");
assert(!source.includes('["服务类型", "陪伴就医", "陪伴就医"]'), "任务调度详情页顶部摘要不能重复渲染相同的值和标签");
assert(/renderDispatch\(page\)[\s\S]*pageHead\(page,\s*`\$\{button\("批量导入"/.test(source), "任务调度页头部必须恢复批量导入按钮");
assert(/renderDispatch\(page\)[\s\S]*pageHead\(page,\s*`[\s\S]*\$\{button\("导出"/.test(source), "任务调度页头部必须保留导出按钮");
assert(!/renderDispatch\(page\)[\s\S]*pageHead\(page,\s*`\$\{button\("新增"/.test(source), "任务调度页头部不能继续保留新增按钮");
assert(source.includes('已派单: "任务调度筛选:已派单"'), "任务调度页已派单卡片必须改成状态筛选");
assert(source.includes('执行中: "任务调度筛选:执行中"'), "任务调度页执行中卡片必须改成状态筛选");
assert(source.includes('超时预警: "任务调度筛选:超时预警"'), "任务调度页超时预警卡片必须改成状态筛选");
assert(source.includes('今日完成: "任务调度筛选:今日完成"'), "任务调度页今日完成卡片必须改成状态筛选");

console.log("admin dispatch page assertions passed");
