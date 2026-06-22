class StateTransitionError extends Error {
  constructor(entity, action, current, allowed) {
    super(`${entity} 状态不允许执行 ${action}：当前 ${current || "未创建"}，允许 ${allowed.join("、")}`);
    this.status = 409;
    this.code = "STATE_TRANSITION_DENIED";
  }
}

const orderTransitions = {
  dispatch: { from: ["待派单"], to: "已派单" },
  cancel: { from: ["待派单", "已派单", "已报价", "待服务"], to: "已取消" },
  confirm: { from: ["待确认"], to: "已完成" },
  guideAccept: { from: ["已派单"], to: "已接单" },
  guideStart: { from: ["已接单"], to: "服务中" },
  guideComplete: { from: ["服务中"], to: "待确认" },
  guideDecline: { from: ["已派单"], to: "已取消" },
  guideCancel: { from: ["已接单", "服务中"], to: "已取消" },
  merchantQuote: { from: ["待派单", "已派单"], to: "已报价" },
  merchantConfirm: { from: ["待派单", "已派单", "已报价"], to: "待服务" },
  merchantStart: { from: ["待服务"], to: "服务中" },
  merchantReject: { from: ["待派单", "已派单", "已报价", "待服务"], to: "已取消" },
  merchantReschedule: { from: ["待派单", "已派单", "已报价", "待服务"], to: "待服务" },
  merchantComplete: { from: ["服务中"], to: "待确认" },
};

const taskTransitions = {
  dispatch: { from: [null, undefined, ""], to: "待接单" },
  accept: { from: ["待接单"], to: "已接单" },
  start: { from: ["已接单"], to: "服务中" },
  complete: { from: ["服务中"], to: "待确认" },
  decline: { from: ["待接单"], to: "已取消" },
  cancel: { from: ["已接单", "服务中"], to: "已取消" },
  merchantQuote: { from: ["待接单", "已报价"], to: "已报价" },
  merchantConfirm: { from: ["待接单", "已报价"], to: "待服务" },
  merchantStart: { from: ["待服务"], to: "服务中" },
  merchantReject: { from: ["待接单", "已报价", "待服务"], to: "已取消" },
  merchantReschedule: { from: ["待接单", "已报价", "待服务"], to: "待服务" },
  merchantComplete: { from: ["服务中"], to: "待确认" },
  userConfirm: { from: ["待确认"], to: "已完成" },
};

const alertTransitions = {
  handle: { from: ["待处理", "处理中"], to: "已处理" },
  processing: { from: ["待处理"], to: "处理中" },
};

function assertTransition(entity, transitions, current, action) {
  const rule = transitions[action];
  if (!rule) throw new StateTransitionError(entity, action, current, []);
  if (!rule.from.includes(current)) {
    throw new StateTransitionError(entity, action, current, rule.from.map((item) => item || "未创建"));
  }
  return rule.to;
}

function applyTransition(record, entity, transitions, action) {
  const next = assertTransition(entity, transitions, record.status, action);
  record.status = next;
  return next;
}

function ensureOrderTransition(order, action) {
  return applyTransition(order, "订单", orderTransitions, action);
}

function ensureTaskTransition(task, action) {
  return applyTransition(task, "任务", taskTransitions, action);
}

function ensureAlertTransition(alert, action) {
  return applyTransition(alert, "异常", alertTransitions, action);
}

module.exports = {
  StateTransitionError,
  ensureAlertTransition,
  ensureOrderTransition,
  ensureTaskTransition,
  orderTransitions,
  taskTransitions,
};
