const GUIDE_ORDER_STATUS_FLOW_VERSION = "5.1-guide-order-status-flow-v1";

const guideOrderStatusFlow = [
  {
    id: "pending-accept",
    status: "待接单",
    triggers: ["平台派单", "订单进入大厅"],
    operations: ["查看详情", "接单", "拒绝/忽略"],
    route: "/guide/#01",
    stateMapping: { order: ["待派单", "已派单"], task: ["待接单"] },
    apiEndpoints: ["/api/guide/dashboard", "/api/orders/{id}", "/api/guide/tasks/claim-next", "/api/tasks/{id}/accept", "/api/guide/tasks/{id}/decline", "/api/guide/tasks/{id}/ignore"],
  },
  {
    id: "accepted",
    status: "已接单",
    triggers: ["人工向导确认接单"],
    operations: ["联系客户", "查看路线", "申请取消", "开始服务"],
    route: "/guide/#10",
    stateMapping: { order: ["已接单"], task: ["已接单"] },
    apiEndpoints: ["/api/tasks/{id}/accept", "/api/guide/tasks/{id}/cancel", "/api/tasks/{id}/start", "/api/orders/{id}", "/api/messages"],
  },
  {
    id: "in-service",
    status: "服务中",
    triggers: ["点击开始服务", "到达服务地点"],
    operations: ["导航", "电话", "上传过程记录", "异常上报", "完成服务"],
    route: "/guide/#04",
    stateMapping: { order: ["服务中"], task: ["服务中"] },
    apiEndpoints: ["/api/tasks/{id}/start", "/api/tasks/{id}/complete", "/api/guide/exception", "/api/guide/tasks/{id}/cancel", "/api/ui/actions"],
  },
  {
    id: "pending-confirm",
    status: "待确认",
    triggers: ["人工向导提交完成"],
    operations: ["等待用户/后台确认"],
    route: "/guide/#11",
    stateMapping: { order: ["待确认"], task: ["待确认"] },
    apiEndpoints: ["/api/tasks/{id}/complete", "/api/orders/{id}/confirm", "/api/admin/orders"],
  },
  {
    id: "completed",
    status: "已完成",
    triggers: ["用户确认或后台确认"],
    operations: ["查看评价", "进入结算"],
    route: "/guide/#30",
    stateMapping: { order: ["已完成"], task: ["已完成"] },
    apiEndpoints: ["/api/orders/{id}/confirm", "/api/reviews", "/api/guide/income", "/api/admin/data-loop"],
  },
  {
    id: "cancelled",
    status: "已取消",
    triggers: ["用户取消", "向导取消", "后台取消"],
    operations: ["查看取消原因"],
    route: "/guide/#12",
    stateMapping: { order: ["已取消"], task: ["已取消"] },
    apiEndpoints: ["/api/orders/{id}", "/api/orders/{id}/cancel", "/api/guide/tasks/{id}/cancel", "/api/admin/orders"],
  },
];

function countByStatus(items = []) {
  return items.reduce((acc, item) => {
    const status = item.status || "未知";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

function getGuide(db, guideId = "guide-001") {
  return (db.guides || []).find((item) => item.id === guideId) || (db.guides || [])[0] || {};
}

function guideOrderStatusRuntime(db = {}, guideId = "guide-001") {
  const guide = getGuide(db, guideId);
  const tasks = (db.tasks || []).filter((item) => item.assigneeType === "guide" && (!item.assigneeId || item.assigneeId === guide.id));
  const guideOrders = (db.orders || []).filter((item) => item.providerType === "guide" && (!item.providerId || item.providerId === guide.id));
  const hallOrders = (db.orders || []).filter((item) => item.providerType === "guide" && item.status === "待派单");
  const taskCounts = countByStatus(tasks);
  const orderCounts = countByStatus(guideOrders);

  const statusCounts = {
    待接单: hallOrders.length + (taskCounts["待接单"] || 0),
    已接单: taskCounts["已接单"] || orderCounts["已接单"] || 0,
    服务中: taskCounts["服务中"] || orderCounts["服务中"] || 0,
    待确认: taskCounts["待确认"] || orderCounts["待确认"] || 0,
    已完成: taskCounts["已完成"] || orderCounts["已完成"] || 0,
    已取消: taskCounts["已取消"] || orderCounts["已取消"] || 0,
  };

  return {
    guideId: guide.id || guideId,
    guideName: guide.realName || "未建档向导",
    onlineStatus: guide.onlineStatus || "离线",
    statusCounts,
    taskCounts,
    orderCounts,
    availableActions: {
      canAccept: statusCounts["待接单"] > 0,
      canStart: statusCounts["已接单"] > 0,
      canComplete: statusCounts["服务中"] > 0,
      canCancel: statusCounts["已接单"] + statusCounts["服务中"] > 0,
      canViewSettlement: statusCounts["已完成"] > 0,
      canViewCancelReason: statusCounts["已取消"] > 0,
    },
  };
}

function guideOrderStatusFlowForApi(db = {}, guideId = "guide-001") {
  const runtime = guideOrderStatusRuntime(db, guideId);
  return {
    version: GUIDE_ORDER_STATUS_FLOW_VERSION,
    source: "5.1 人工向导端订单状态流",
    guideId: runtime.guideId,
    statusCount: guideOrderStatusFlow.length,
    terminalStatuses: ["已完成", "已取消"],
    runtime,
    flow: guideOrderStatusFlow.map((item) => ({
      ...item,
      triggerText: item.triggers.join("、"),
      operationText: item.operations.join("、"),
      runtimeCount: runtime.statusCounts[item.status] || 0,
    })),
    updatedAt: new Date().toISOString(),
  };
}

function validateGuideOrderStatusFlow() {
  const expected = [
    ["待接单", "平台派单/订单进入大厅", "查看详情、接单、拒绝/忽略"],
    ["已接单", "人工向导确认接单", "联系客户、查看路线、申请取消、开始服务"],
    ["服务中", "点击开始服务/到达服务地点", "导航、电话、上传过程记录、异常上报、完成服务"],
    ["待确认", "人工向导提交完成", "等待用户/后台确认"],
    ["已完成", "用户确认或后台确认", "查看评价、进入结算"],
    ["已取消", "用户取消、向导取消、后台取消", "查看取消原因"],
  ];
  const errors = [];

  expected.forEach(([status, triggerText, operationText]) => {
    const item = guideOrderStatusFlow.find((row) => row.status === status);
    if (!item) {
      errors.push({ status, issue: "缺少状态" });
      return;
    }
    if (item.triggers.join("/") !== triggerText && item.triggers.join("、") !== triggerText) {
      errors.push({ status, issue: "触发动作不一致" });
    }
    if (item.operations.join("、") !== operationText) {
      errors.push({ status, issue: "可执行操作不一致" });
    }
    if (!item.route || !item.apiEndpoints.length) {
      errors.push({ status, issue: "缺少页面入口或接口" });
    }
  });
  if (guideOrderStatusFlow.length !== expected.length) {
    errors.push({ status: "全部", issue: "状态数量不一致" });
  }

  return {
    version: GUIDE_ORDER_STATUS_FLOW_VERSION,
    valid: errors.length === 0,
    statusCount: guideOrderStatusFlow.length,
    errors,
  };
}

module.exports = {
  GUIDE_ORDER_STATUS_FLOW_VERSION,
  guideOrderStatusFlow,
  guideOrderStatusFlowForApi,
  validateGuideOrderStatusFlow,
};
