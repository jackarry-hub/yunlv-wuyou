const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = [
  "云旅无忧UI界面参考图/用户端/云旅无忧用户端代码实现/app.js",
  "云旅无忧UI界面参考图/向导端/向导端代码实现/app.js",
  "云旅无忧UI界面参考图/商户端/merchant-ui-prototype/app.js",
  "server.js",
  "apps/admin/app.js",
  "apps/shared/business-bridge.js"
];

const bannedPatterns = [
  { name: "generic operation handled", pattern: /操作已处理/g },
  { name: "generic notification handled", pattern: /通知已处理/g },
  { name: "generic status updated", pattern: /状态已更新/g },
  { name: "generic status switched", pattern: /状态已切换/g },
  { name: "generic prepared flow", pattern: /流程已准备/g },
  { name: "generic prepared panel", pattern: /面板已准备/g },
  { name: "generic prepared entry", pattern: /入口已准备/g },
  { name: "generic voice prepared", pattern: /语音输入已准备/g },
  { name: "generic export prepared", pattern: /导出已准备/g },
  { name: "placeholder feedback", pattern: /反馈占位/g },
  { name: "future real api", pattern: /后续真实接口/g },
  { name: "label handled fallback", pattern: /\$\{label\}已处理/g },
  { name: "visible label handled fallback", pattern: /\$\{visibleLabel\}已处理/g }
];

const failures = [];

for (const relative of files) {
  const absolute = path.join(root, relative);
  assert.ok(fs.existsSync(absolute), `${relative} must exist`);
  const content = fs.readFileSync(absolute, "utf8");

  for (const check of bannedPatterns) {
    const matches = [...content.matchAll(check.pattern)];
    for (const match of matches) {
      const line = content.slice(0, match.index).split(/\r?\n/).length;
      failures.push(`${relative}:${line} ${check.name}: ${match[0]}`);
    }
  }
}

const bridge = fs.readFileSync(path.join(root, "apps/shared/business-bridge.js"), "utf8");
const user = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/用户端/云旅无忧用户端代码实现/app.js"), "utf8");
const merchant = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/商户端/merchant-ui-prototype/app.js"), "utf8");
const guide = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/向导端/向导端代码实现/app.js"), "utf8");
const admin = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/管理后台/yunlv-admin-ui/app.js"), "utf8");
const userStyles = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/用户端/云旅无忧用户端代码实现/styles.css"), "utf8");
const guideStyles = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/向导端/向导端代码实现/styles.css"), "utf8");
const merchantStyles = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图/商户端/merchant-ui-prototype/styles.css"), "utf8");

function functionSource(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `必须能定位${label}`);
  return source.slice(start, end);
}

function cssBlock(source, selector, label) {
  const start = source.indexOf(selector);
  assert.ok(start >= 0, `必须能定位${label}`);
  const open = source.indexOf("{", start);
  const close = source.indexOf("}", open);
  assert.ok(open > start && close > open, `必须能读取${label}`);
  return source.slice(start, close + 1);
}

const userShowToastSource = functionSource(user, "function showToast(text)", "function actionText(action)", "用户端 showToast 实现");
const guideShowToastSource = functionSource(guide, "function showToast(text)", "function actionText(action)", "向导端 showToast 实现");
const merchantShowToastSource = functionSource(merchant, "function showToast(text)", "function actionText(action)", "商户端 showToast 实现");
const adminShowToastSource = functionSource(admin, "function showToast(text)", "function actionText(action)", "管理后台 showToast 实现");
const userApplyActionSource = functionSource(user, "function applyActionState(button, actionName)", "function activateChoice(button, label)", "用户端通用点击兜底函数");
const guideApplyActionSource = functionSource(guide, "function applyActionState(button, actionName)", "function activateChoice(button, label)", "向导端通用点击兜底函数");
const merchantApplyActionSource = functionSource(merchant, "function applyActionState(button, actionName)", "function refreshMerchantQuoteTotal()", "商户端通用点击兜底函数");
const userChoiceSource = functionSource(user, "function activateChoice(button, label)", "function toggleSwitch(button, actionName)", "用户端通用选择函数");
const guideChoiceSource = functionSource(guide, "function activateChoice(button, label)", "function toggleSwitch(button, actionName)", "向导端通用选择函数");
const merchantChoiceSource = functionSource(merchant, "function activateChoice(button, label)", "function toggleMerchantOnlineAccepting(button)", "商户端通用选择函数");
const userSwitchSource = functionSource(user, "function toggleSwitch(button, actionName)", "function completedActionText(actionName", "用户端通用开关函数");
const guideSwitchSource = functionSource(guide, "function toggleSwitch(button, actionName)", "function completedActionText(actionName", "向导端通用开关函数");
const merchantSwitchSource = functionSource(merchant, "function toggleSwitch(button, actionName)", "function completedActionText(actionName", "商户端通用开关函数");
const guideSystemNoticeSource = functionSource(guide, "function renderSystemNotice()", "function renderOrderMessages()", "向导端系统通知渲染函数");
const guideExceptionSource = functionSource(guide, "function renderException()", "function renderMessages()", "向导端异常上报渲染函数");
const guideCompleteSource = functionSource(guide, "function renderCompleteReport()", "function renderCompletedDetail()", "向导端服务完成上报渲染函数");
const guideSafetySource = functionSource(guide, "function renderSafety()", "function ensureGuideSafetyPanel(", "向导端安全中心渲染函数");
const guideSafetyExceptionFormSource = functionSource(guide, "function openGuideExceptionForm(", "async function submitGuideSafetyException(", "向导端安全中心异常表单函数");
const guideSafetyExceptionSubmitSource = functionSource(guide, "async function submitGuideSafetyException(", "async function shareGuideSafetyLocation(", "向导端安全中心异常提交函数");
const guideHallSource = functionSource(guide, "function renderHall()", "function getHallOrders()", "向导端接单大厅渲染函数");
const guideCancelSource = functionSource(guide, "function renderCancelRequest()", "function renderCompleteReport()", "向导端取消订单渲染函数");
const guideCancelSubmitSource = functionSource(guide, "async function submitGuideCancelRequest(", "function toggleGuideRouteLayer", "向导端取消订单提交函数");
const guideReviewDetailSource = functionSource(guide, "function renderReviewDetail()", "function renderServiceAreas()", "向导端评价详情渲染函数");
const guideInitSource = functionSource(guide, "function init()", "function isGuideFileUploadAction", "向导端初始化点击处理函数");
const guideInteractiveSource = functionSource(guide, "function hydrateInteractiveControls(root)", "async function handleAction(actionButton)", "向导端交互控件补全函数");
const guideSafetyRulesStart = guideSafetySource.indexOf('<section class="card guide-safe-rules">');
const guideSafetyRecordsStart = guideSafetySource.indexOf('<section class="card guide-safe-records">');
const guideSafetyPrimaryStart = guideSafetySource.indexOf('<button class="guide-safe-primary"', guideSafetyRecordsStart);
assert(guideSafetyRulesStart >= 0 && guideSafetyRecordsStart > guideSafetyRulesStart, "必须能定位向导端安全中心服务规范区域");
assert(guideSafetyPrimaryStart > guideSafetyRecordsStart, "必须能定位向导端安全中心近期安全记录区域");
const guideSafetyRulesSource = guideSafetySource.slice(guideSafetyRulesStart, guideSafetyRecordsStart);
const guideSafetyRecordsSource = guideSafetySource.slice(guideSafetyRecordsStart, guideSafetyPrimaryStart);

for (const [name, styles] of [
  ["用户端", userStyles],
  ["向导端", guideStyles],
  ["商户端", merchantStyles],
]) {
  const actionStatus = cssBlock(styles, ".action-status", `${name} action-status 样式`);
  const doneButton = cssBlock(styles, "button.is-done", `${name} is-done 样式`);
  const doneBadge = cssBlock(styles, "button.is-done[data-state]", `${name} is-done 状态徽标样式`);
  assert.doesNotMatch(
    `${actionStatus}\n${doneButton}\n${doneBadge}`,
    /#16a36a|#edfdf4|#eefbf4|#e8f8ef|rgba\(34,\s*197,\s*94|var\(--green/i,
    `${name} 点击反馈状态不能继续使用绿色成功样式`,
  );
  assert.match(
    doneBadge,
    /\[data-state\]:not\(\[data-state=""]\)/,
    `${name} is-done 状态徽标必须只在有真实 data-state 时显示，不能生成空绿色小字`,
  );
}

assert.doesNotMatch(
  userApplyActionSource,
  /writeActionStatus|renderGenericActionResult/,
  "用户端通用点击兜底不能再写绿色状态或插入通用操作结果卡",
);

assert.doesNotMatch(
  guideApplyActionSource,
  /writeActionStatus|renderGuideActionResult/,
  "向导端通用点击兜底不能再写绿色状态或插入通用操作结果卡",
);

assert.doesNotMatch(
  merchantApplyActionSource,
  /renderMerchantActionResult|button\.dataset\.state\s*=\s*text|const text = completedActionText[\s\S]{0,180}writeActionStatus|const text = genericActionFeedback[\s\S]{0,180}writeActionStatus/,
  "商户端通用点击兜底不能再写绿色状态或插入通用操作结果卡",
);

for (const [name, source] of [
  ["用户端选择", userChoiceSource],
  ["向导端选择", guideChoiceSource],
  ["商户端选择", merchantChoiceSource],
  ["用户端开关", userSwitchSource],
  ["向导端开关", guideSwitchSource],
  ["商户端开关", merchantSwitchSource],
]) {
  assert.doesNotMatch(source, /writeActionStatus/, `${name}只能切换真实选中或开关状态，不能追加绿色文字反馈`);
}

assert.doesNotMatch(
  bridge,
  /document\.addEventListener\("click",\s*\(event\) => \{[\s\S]*event\.target\.closest\("\[data-action\], \[data-add-cart\]"\)[\s\S]*shouldCaptureUserBusinessAction[\s\S]*event\.stopPropagation\(\)[\s\S]*createServiceRequest[\s\S]*\}, true\);/,
  "用户端共享桥接层不能在捕获阶段拦截普通 data-action 点击并统一提交后台请求；必须先让页面自己的语义功能处理",
);

assert.match(
  bridge,
  /function isLocalUiOnlyAction\(button, actionName\)[\s\S]*\^\(选择\|筛选\|搜索\|切换\|显示\|隐藏\|开启\|关闭\)[\s\S]*上传\|添加照片/,
  "共享桥接层必须识别选择、筛选、开关、上传等本地 UI 操作，不能统一记录成已处理/已记录状态",
);

assert.match(
  bridge,
  /if \(isLocalUiOnlyAction\(button, actionName\)\) return false;/,
  "共享桥接层必须在通用后台记录前放行本地 UI 操作",
);

assert.match(
  merchant,
  /function openMerchantFilePicker\([\s\S]*input\.type = "file"[\s\S]*input\.click\(\)/,
  "商户端上传、重传、照片、凭证类点击必须触发真实文件选择器，不能只写状态或 toast",
);

assert.match(
  merchant,
  /async function handleAction\(actionButton\) \{[\s\S]*if \(isMerchantFileUploadAction\(actionButton, actionName\)\) \{[\s\S]*openMerchantFilePicker\(actionButton, actionName\);[\s\S]*return;[\s\S]*\}[\s\S]*window\.YunlvBusiness\?\.handleAction/,
  "商户端上传类动作必须在共享桥接和通用反馈前由真实文件选择器处理",
);

assert.match(
  guide,
  /function openGuideFilePicker\([\s\S]*input\.type = 'file'[\s\S]*input\.click\(\)/,
  "向导端上传头像、证件、凭证、照片类点击必须触发真实文件选择器，不能只写状态或提交后台",
);

assert.match(
  guide,
  /async function handleAction\(actionButton\) \{[\s\S]*if \(isGuideFileUploadAction\(actionButton, actionName\)\) \{[\s\S]*openGuideFilePicker\(actionButton, actionName\);[\s\S]*return;[\s\S]*\}[\s\S]*handleGuideLocalAction/,
  "向导端上传类动作必须在本地动作、共享桥接和通用反馈前由真实文件选择器处理",
);

assert.match(
  guide,
  /if \(nextId === screens\[currentIndex\]\?\.id && refreshGuideCurrentScreen\(openButton, nextId\)\) return;/,
  "向导端底部导航点击当前页面时必须刷新当前页并产生可检测状态，不能无反应",
);

assert.match(
  guide,
  /completeProofPhotos:\s*\[/,
  "向导端服务完成页必须用状态数组渲染完成凭证，删除图片时才能真实移除当前项",
);

assert.match(
  guideCompleteSource,
  /guideState\.completeProofPhotos\.map/,
  "向导端服务完成页完成凭证必须来自 guideState.completeProofPhotos，不能硬编码成不可删除图片",
);

assert.match(
  guideCompleteSource,
  /data-guide-proof-delete="\$\{index\}"/,
  "向导端服务完成页每张完成凭证必须有独立删除按钮",
);

assert.doesNotMatch(
  guideCompleteSource,
  /guide-proof-photo" type="button" data-action="查看[^"]+凭证"/,
  "向导端服务完成页凭证图片本体不能继续作为通用查看按钮，否则点删除图标会落入查看/假反馈",
);

assert.match(
  guide,
  /function deleteGuideCompleteProof\([\s\S]*guideState\.completeProofPhotos = guideState\.completeProofPhotos\.filter[\s\S]*renderScreen\('29', false, \{ replace: true, skipApiHydrate: true, restoreScrollTop: scrollTop \}\)/,
  "向导端服务完成页删除凭证必须真实更新列表并停留当前页",
);

assert.doesNotMatch(
  functionSource(guide, "function deleteGuideCompleteProof(", "async function refreshGuideDashboardData", "向导端完成凭证删除函数"),
  /writeActionStatus|showToast|renderGuideActionResult/,
  "向导端完成凭证删除不能用 toast、绿色状态字或页面操作面板冒充成功",
);

assert.match(
  guideInitSource,
  /const guideCompleteProofDeleteButton = event\.target\.closest\('\[data-guide-proof-delete\]'\);[\s\S]*deleteGuideCompleteProof\(guideCompleteProofDeleteButton\);[\s\S]*const openButton/,
  "向导端完成凭证删除按钮必须在通用 data-action 和跳转处理前被专属逻辑处理",
);

assert.doesNotMatch(
  guideHallSource,
  /已筛出|已按订单|icon\('check'\)\s*\}\s*\$\{summaries|icon\('check'\)\s*\}\s*\$\{notices|class="notice"/,
  "向导端接单大厅附近/最新筛选不能渲染绿色成功 notice 或“已...”点击反馈字",
);

assert.match(
  guideHallSource,
  /class="guide-hall-summary"/,
  "向导端接单大厅筛选说明必须使用中性说明样式，不能复用绿色 notice",
);

assert.match(
  guideCancelSource,
  /data-guide-cancel-reason="\$\{reason\}"/,
  "向导端取消原因必须使用专属 data-guide-cancel-reason，不能走通用取消 data-action",
);

assert.match(
  guideCancelSource,
  /data-guide-cancel-description/,
  "向导端取消说明必须有可编辑输入框并进入提交原因",
);

assert.match(
  guideCancelSource,
  /data-guide-cancel-submit/,
  "向导端提交取消必须使用专属提交按钮",
);

assert.doesNotMatch(
  guideCancelSource,
  /data-action="取消原因：|data-action="申请取消订单"/,
  "向导端取消页不能继续把取消原因或提交交给通用 data-action",
);

assert.match(
  guideCancelSubmitSource,
  /guideApiRequest\(`\/api\/guide\/tasks\/\$\{encodeURIComponent\(task\.id\)\}\/cancel`[\s\S]*setScreen\('12'\)/,
  "向导端提交取消必须调用后台任务取消接口并进入已取消详情",
);

assert.doesNotMatch(
  guideCancelSubmitSource,
  /showToast|renderGuideActionResult|recordAction/,
  "向导端提交取消不能用 toast、页面操作或后台记录假动作冒充成功",
);

assert.match(
  guideInitSource,
  /const guideCancelReasonButton = event\.target\.closest\('\[data-guide-cancel-reason\]'\);[\s\S]*const guideCancelSubmitButton = event\.target\.closest\('\[data-guide-cancel-submit\]'\);[\s\S]*await submitGuideCancelRequest\(guideCancelSubmitButton\);[\s\S]*const guideAcceptButton/,
  "向导端取消原因和提交必须在通用 data-action 之前处理",
);

assert.match(
  guideReviewDetailSource,
  /data-guide-review-reply-input/,
  "向导端评价详情回复输入框必须绑定专属状态，不能只是静态 textarea",
);

assert.match(
  guideReviewDetailSource,
  /data-guide-review-reply-submit/,
  "向导端评价详情提交回复必须使用专属提交按钮，不能落入通用 data-action 假反馈",
);

assert.doesNotMatch(
  guideReviewDetailSource,
  /data-action="提交回复"/,
  "向导端评价详情提交回复不能继续使用 data-action 通用兜底",
);

assert.match(
  guide,
  /function submitGuideReviewReply\([\s\S]*guideState\.reviewReply[\s\S]*saveGuideReviewReply/,
  "向导端评价回复提交必须写入当前页面状态并持久化，不能只显示 toast",
);

assert.match(
  guideInitSource,
  /const guideReviewReplySubmitButton = event\.target\.closest\('\[data-guide-review-reply-submit\]'\);[\s\S]*submitGuideReviewReply\(guideReviewReplySubmitButton\);[\s\S]*const guideAcceptButton/,
  "向导端评价回复提交必须在通用 data-action 前被专属点击处理截获",
);

assert.match(
  guide,
  /function toggleGuideRouteLayer\([\s\S]*guideRouteSatelliteVisible = !guideRouteSatelliteVisible[\s\S]*button\.setAttribute\('aria-pressed'/,
  "向导端路线导航图层按钮必须切换本地图层状态，即使高德地图对象未就绪也不能无反应",
);

assert.doesNotMatch(
  guideSystemNoticeSource,
  /data-guide-notice-filter|guide-notice-tabs|端午假期服务安排通知|服务评价规则优化通知|实名认证资料即将到期|系统维护公告/,
  "向导端系统通知页不能保留静态假通知或假筛选",
);

assert.match(
  guideExceptionSource,
  /data-guide-exception-type/,
  "向导端异常类型必须使用专属多选处理，不能走通用选择反馈",
);

assert.match(
  guideExceptionSource,
  /data-guide-exception-submit/,
  "向导端异常提交必须使用专属提交处理，不能走通用提交反馈",
);

assert.doesNotMatch(
  guideExceptionSource,
  /异常已提交后台处理/,
  "向导端异常提交成功文案必须改为“提交成功”，不能继续显示“异常已提交后台处理”",
);

assert.match(
  guideExceptionSource,
  /data-guide-exception-success-modal/,
  "向导端异常提交成功必须用专属弹窗展示，不能继续只在页面内显示结果字",
);

assert.match(
  guide,
  /function closeGuideExceptionSuccessModal\([\s\S]*guideState\.exceptionSuccessModalOpen = false[\s\S]*renderScreen\('05'/,
  "向导端异常提交成功弹窗必须能关闭并停留当前页面",
);

assert.doesNotMatch(
  guideExceptionSource,
  /data-action="选择异常类型|data-action="提交异常/,
  "向导端异常页不能把异常类型或提交按钮交给通用 data-action 绿色反馈",
);

assert.match(
  guide,
  /const guideExceptionTypeButton = event\.target\.closest\('\[data-guide-exception-type\]'\);[\s\S]*toggleGuideExceptionType\(guideExceptionTypeButton\);[\s\S]*const guideExceptionSubmitButton = event\.target\.closest\('\[data-guide-exception-submit\]'\);[\s\S]*await submitGuideException\(guideExceptionSubmitButton\);[\s\S]*const guideAcceptButton/,
  "向导端异常类型和提交必须在通用 data-action 之前处理",
);

assert.match(
  guide,
  /async function submitGuideException\([\s\S]*guideApiRequest\('\/api\/guide\/exception'/,
  "向导端异常提交必须接入后台异常接口，不能只是状态文字",
);

assert.match(
  guideSafetySource,
  /data-guide-safety-success-modal/,
  "向导端安全中心异常提交成功必须使用专属弹窗展示",
);

assert.match(
  guideSafetySource,
  /<button class="guide-safe-client"[^>]*data-open="13"[^>]*aria-label="查看李奶奶客户档案"/,
  "向导端安全中心李奶奶卡片后面的箭头必须连接到客户档案，不能只是装饰箭头",
);

assert.doesNotMatch(
  guideSafetyRulesSource,
  /data-open=|data-action=|chevronRight/,
  "向导端安全中心服务规范列表不需要逐项点开，不能保留箭头或无效按钮行为",
);

assert.doesNotMatch(
  guideSafetyRecordsSource,
  /data-open=|data-action=|chevronRight/,
  "向导端安全中心近期安全记录不能保留无效箭头或通用 data-action 假反馈",
);

assert.match(
  guideSafetyExceptionFormSource,
  /data-guide-safe-exception-submit/,
  "向导端安全中心提交异常必须使用专属提交按钮，不能落入通用 data-action 假反馈",
);

assert.doesNotMatch(
  guideSafetyExceptionFormSource,
  /data-action="提交安全异常"/,
  "向导端安全中心提交异常不能继续使用 data-action 通用兜底",
);

assert.match(
  guideSafetyExceptionSubmitSource,
  /guideApiRequest\('\/api\/guide\/exception'/,
  "向导端安全中心提交异常必须接入后台异常接口",
);

assert.match(
  guideSafetyExceptionSubmitSource,
  /guideState\.safetyExceptionSuccessModalOpen = true[\s\S]*renderScreen\('35'/,
  "向导端安全中心提交异常成功必须打开提交成功弹窗并停留安全中心",
);

assert.doesNotMatch(
  guideSafetyExceptionSubmitSource,
  /showToast\(|writeActionStatus\(form \|\| button, `异常 [^`]*已提交后台处理/,
  "向导端安全中心提交异常不能用 toast 或状态字冒充提交成功",
);

assert.match(
  guide,
  /function hydratePassiveButtons\(root\)[\s\S]*button\.dataset\.guideExceptionType !== undefined[\s\S]*button\.dataset\.guideExceptionSubmit !== undefined[\s\S]*button\.dataset\.guideSafeExceptionSubmit !== undefined[\s\S]*button\.dataset\.guideSafetySuccessClose !== undefined[\s\S]*button\.dataset\.guideCancelReason !== undefined[\s\S]*button\.dataset\.guideCancelSubmit !== undefined/,
  "向导端异常、安全中心异常和取消专属按钮不能被被动按钮补全逻辑补成通用 data-action",
);

assert.match(
  bridge,
  /function standardizeLiveButtons\(root\)[\s\S]*button\.dataset\.guideExceptionType !== undefined[\s\S]*button\.dataset\.guideExceptionSubmit !== undefined[\s\S]*button\.dataset\.guideSafeExceptionSubmit !== undefined[\s\S]*button\.dataset\.guideSafetySuccessClose !== undefined[\s\S]*button\.dataset\.guideCancelReason !== undefined[\s\S]*button\.dataset\.guideCancelSubmit !== undefined/,
  "共享桥接层不能把向导端异常、安全中心异常或取消专属按钮补成通用 data-action",
);

assert.match(
  guide,
  /function clearGuideExceptionGenericActions\([\s\S]*\[data-guide-exception-type\]\[data-action\], \[data-guide-exception-submit\]\[data-action\], \[data-guide-exception-success-close\]\[data-action\], \[data-guide-safe-exception-submit\]\[data-action\], \[data-guide-safety-success-close\]\[data-action\], \[data-guide-cancel-reason\]\[data-action\], \[data-guide-cancel-submit\]\[data-action\][\s\S]*removeAttribute\('data-action'\)/,
  "向导端异常、安全中心异常和取消专属按钮渲染后必须清理共享补全产生的通用 data-action",
);

assert.doesNotMatch(
  userShowToastSource,
  /renderGenericActionResult[\s\S]*页面操作|页面操作[\s\S]*renderGenericActionResult/,
  "用户端 showToast 不能生成底部“页面操作”面板",
);

assert.doesNotMatch(
  guideShowToastSource,
  /renderGuideActionResult[\s\S]*页面操作|页面操作[\s\S]*renderGuideActionResult/,
  "向导端 showToast 不能生成底部“页面操作”面板",
);

assert.doesNotMatch(
  merchantShowToastSource,
  /renderMerchantActionResult[\s\S]*页面操作|页面操作[\s\S]*renderMerchantActionResult/,
  "商户端 showToast 不能生成底部“页面操作”面板",
);

assert.doesNotMatch(
  adminShowToastSource,
  /renderAdminActionResult[\s\S]*(页面操作|后台操作)|(页面操作|后台操作)[\s\S]*renderAdminActionResult/,
  "管理后台 showToast 不能生成底部“页面操作/后台操作”辅助面板",
);

assert.match(
  admin,
  /function refreshAdminCurrentPage\([\s\S]*adminUiState\.refreshSeq \+= 1[\s\S]*data-admin-refresh/,
  "管理后台点击当前侧边栏页面必须刷新当前页并写入可检测状态，不能只有焦点变化",
);

assert.match(
  admin,
  /function toggleAdminSidebar\([\s\S]*adminUiState\.sidebarCollapsed = !adminUiState\.sidebarCollapsed[\s\S]*data-admin-sidebar-state/,
  "管理后台折叠菜单按钮必须切换真实侧栏状态，不能退化为查看详情 toast",
);

assert.match(
  admin,
  /data-admin-menu-toggle/,
  "管理后台折叠菜单按钮必须绑定 data-admin-menu-toggle",
);

assert.match(
  admin,
  /function handleAdminBannerAction\([\s\S]*adminBannerState\.deletedIds\.add[\s\S]*row\.hidden = true/,
  "管理后台 Banner 删除必须移除或隐藏当前行，不能点击无反应",
);

assert.match(
  admin,
  /async function persistAdminConfigDraft\([\s\S]*collectAdminConfigDraftFromDom\(\)[\s\S]*adminApi\("\/api\/admin\/config"/,
  "管理后台系统配置保存必须采集表单并调用真实配置接口，不能只弹 toast",
);

assert.match(
  admin,
  /async function handleAdminConfigAction\([\s\S]*adminApi\("\/api\/admin\/config\/publish"[\s\S]*adminApi\("\/api\/admin\/config\/reset"/,
  "管理后台系统配置发布和恢复默认必须调用真实配置接口，不能只弹 toast",
);

assert.doesNotMatch(
  admin,
  /adminConfigState\.(savedAt|publishedAt)\s*=/,
  "管理后台系统配置不能只更新前端 savedAt/publishedAt 状态",
);

assert.equal(
  failures.length,
  0,
  `Second-layer interactions cannot use generic fake feedback:\n${failures.join("\n")}`
);

console.log("Second-layer fake feedback audit passed.");
