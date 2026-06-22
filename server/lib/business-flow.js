const BUSINESS_FLOW_VERSION = "3-overall-business-flow-v1";

const businessFlowSteps = [
  {
    step: 1,
    action: "需求发起",
    systemHandling: "用户手动下单、设备异常预警、定期服务需求触发",
    involvedEnds: ["用户端", "设备"],
    apiEndpoints: ["/api/orders", "/api/service-requests", "/api/alerts/sos", "/api/devices/{id}/sync", "/api/devices/help-request"],
    dataObjects: ["order", "service_request", "alert", "device"],
    status: "已实现",
  },
  {
    step: 2,
    action: "智能分析",
    systemHandling: "平台识别需求类型、紧急程度、地理位置、服务偏好",
    involvedEnds: ["平台中枢", "管理后台"],
    apiEndpoints: ["/api/guide/order-requirements", "/api/admin/dispatch/candidates", "/api/admin/dispatch/pending", "/api/admin/dashboard"],
    dataObjects: ["order", "task", "alert", "service_item"],
    status: "已实现",
  },
  {
    step: 3,
    action: "任务分配",
    systemHandling: "轻服务分配人工向导，专业服务分配商户，必要时管理员介入",
    involvedEnds: ["管理端", "人工向导端", "商户端"],
    apiEndpoints: ["/api/tasks/dispatch", "/api/guide/tasks/claim-next", "/api/guide/dashboard", "/api/merchant/dashboard"],
    dataObjects: ["task", "order", "message", "audit_log"],
    status: "已实现",
  },
  {
    step: 4,
    action: "服务执行",
    systemHandling: "向导或商户接单，联系用户，上门/远程/到店完成服务",
    involvedEnds: ["人工向导端", "商户端", "用户端"],
    apiEndpoints: ["/api/tasks/{id}/accept", "/api/tasks/{id}/start", "/api/tasks/{id}/complete", "/api/merchant/orders/{id}/confirm", "/api/merchant/orders/{id}/start", "/api/merchant/orders/{id}/complete"],
    dataObjects: ["task", "order", "message"],
    status: "已实现",
  },
  {
    step: 5,
    action: "反馈上报",
    systemHandling: "上传服务结果、异常记录、图片/文字备注、完成状态",
    involvedEnds: ["人工向导端", "商户端"],
    apiEndpoints: ["/api/tasks/{id}/complete", "/api/guide/exception", "/api/merchant/exception", "/api/merchant/orders/{id}/complete"],
    dataObjects: ["task", "order", "alert", "audit_log"],
    status: "已实现",
  },
  {
    step: 6,
    action: "结果反馈",
    systemHandling: "用户和家属查看服务完成情况并评价",
    involvedEnds: ["用户端", "家属端"],
    apiEndpoints: ["/api/orders", "/api/orders/{id}", "/api/orders/{id}/confirm", "/api/messages", "/api/reviews"],
    dataObjects: ["order", "review", "message"],
    status: "已实现",
  },
  {
    step: 7,
    action: "数据沉淀",
    systemHandling: "沉淀用户数据、健康数据、服务数据、评价数据，优化推荐和调度",
    involvedEnds: ["管理后台", "数据中台"],
    apiEndpoints: ["/api/admin/data-loop", "/api/admin/database/schema", "/api/admin/screens", "/api/admin/reviews", "/api/admin/dispatch/candidates"],
    dataObjects: ["user", "elder_profile", "health_record", "order", "task", "review", "ai_chat"],
    status: "已实现/推荐优化预留",
  },
];

function countBy(items, predicate) {
  return items.filter(predicate).length;
}

function businessFlowRuntime(db) {
  const orders = db.orders || [];
  const tasks = db.tasks || [];
  const alerts = db.alerts || [];
  const messages = db.messages || [];
  const reviews = db.reviews || [];
  const serviceRequests = db.serviceRequests || [];
  const devices = db.devices || [];
  const healthRecords = db.healthRecords || [];
  const aiHistory = db.aiHistory || [];

  return {
    demandInitiation: {
      totalOrders: orders.length,
      serviceRequests: serviceRequests.length,
      openAlerts: countBy(alerts, (item) => item.status !== "已处理"),
      deviceWarnings: countBy(devices, (item) => Number(item.battery || 0) <= 20 || item.onlineStatus !== "在线"),
    },
    intelligentAnalysis: {
      pendingDispatchOrders: countBy(orders, (item) => item.status === "待派单"),
      emergencyAlerts: countBy(alerts, (item) => ["高", "最高"].includes(item.level) && item.status !== "已处理"),
      candidatePools: {
        guide: (db.guides || []).length,
        merchant: (db.merchants || []).length,
      },
    },
    taskAssignment: {
      totalTasks: tasks.length,
      pendingTasks: countBy(tasks, (item) => item.status === "待接单"),
      guideTasks: countBy(tasks, (item) => item.assigneeType === "guide"),
      merchantTasks: countBy(tasks, (item) => item.assigneeType === "merchant"),
    },
    serviceExecution: {
      acceptedTasks: countBy(tasks, (item) => item.status === "已接单"),
      inServiceTasks: countBy(tasks, (item) => item.status === "服务中"),
      completedOrPendingConfirm: countBy(tasks, (item) => ["待确认", "已完成"].includes(item.status)),
    },
    feedbackUpload: {
      exceptionAlerts: countBy(alerts, (item) => /异常|投诉|取消|SOS|设备/.test(`${item.type || ""}${item.description || ""}`)),
      completedTasks: countBy(tasks, (item) => ["待确认", "已完成"].includes(item.status)),
      evidenceRecords: countBy(tasks, (item) => Boolean(item.evidence || item.completedAt)),
    },
    resultFeedback: {
      confirmableOrders: countBy(orders, (item) => item.status === "待确认"),
      completedOrders: countBy(orders, (item) => item.status === "已完成"),
      reviews: reviews.length,
      unreadUserMessages: countBy(messages, (item) => item.toRole === "user" && !item.read),
    },
    dataAccumulation: {
      userProfiles: (db.users || []).length,
      healthRecords: healthRecords.length,
      serviceData: orders.length + tasks.length,
      reviewData: reviews.length,
      aiChatData: aiHistory.length,
    },
  };
}

function businessFlowForApi(db) {
  const runtime = businessFlowRuntime(db);
  return {
    version: BUSINESS_FLOW_VERSION,
    source: "3. 总体业务流程",
    stepCount: businessFlowSteps.length,
    implementedStepCount: businessFlowSteps.filter((item) => item.status.includes("已实现")).length,
    steps: businessFlowSteps.map((item) => ({
      ...item,
      runtime: runtime[{
        1: "demandInitiation",
        2: "intelligentAnalysis",
        3: "taskAssignment",
        4: "serviceExecution",
        5: "feedbackUpload",
        6: "resultFeedback",
        7: "dataAccumulation",
      }[item.step]],
    })),
    runtime,
    acceptance: {
      demandCanEnterSystem: runtime.demandInitiation.totalOrders + runtime.demandInitiation.serviceRequests + runtime.demandInitiation.openAlerts >= 1,
      dispatchCanCreateTasks: runtime.taskAssignment.totalTasks >= 1,
      executionCanReachFeedback: runtime.feedbackUpload.completedTasks >= 1 || runtime.resultFeedback.confirmableOrders >= 1 || runtime.resultFeedback.completedOrders >= 1,
      dataCanBeQueried: runtime.dataAccumulation.serviceData >= 1 && runtime.dataAccumulation.healthRecords >= 1,
    },
  };
}

function validateBusinessFlow() {
  const errors = [];
  const expectedRows = [
    [1, "需求发起", "用户手动下单、设备异常预警、定期服务需求触发", "用户端 / 设备"],
    [2, "智能分析", "平台识别需求类型、紧急程度、地理位置、服务偏好", "平台中枢 / 管理后台"],
    [3, "任务分配", "轻服务分配人工向导，专业服务分配商户，必要时管理员介入", "管理端 / 人工向导端 / 商户端"],
    [4, "服务执行", "向导或商户接单，联系用户，上门/远程/到店完成服务", "人工向导端 / 商户端 / 用户端"],
    [5, "反馈上报", "上传服务结果、异常记录、图片/文字备注、完成状态", "人工向导端 / 商户端"],
    [6, "结果反馈", "用户和家属查看服务完成情况并评价", "用户端 / 家属端"],
    [7, "数据沉淀", "沉淀用户数据、健康数据、服务数据、评价数据，优化推荐和调度", "管理后台 / 数据中台"],
  ];
  expectedRows.forEach(([step, action, systemHandling, involvedEnds], index) => {
    const row = businessFlowSteps[index];
    if (!row || row.step !== step || row.action !== action || row.systemHandling !== systemHandling || row.involvedEnds.join(" / ") !== involvedEnds) {
      errors.push({ step, action, issue: "流程行与第 3 节图示不一致" });
    }
  });
  businessFlowSteps.forEach((item) => {
    if (!item.apiEndpoints.length) errors.push({ step: item.step, issue: "缺少工程接口映射" });
    if (!item.dataObjects.length) errors.push({ step: item.step, issue: "缺少数据对象映射" });
  });
  return {
    version: BUSINESS_FLOW_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  BUSINESS_FLOW_VERSION,
  businessFlowForApi,
  businessFlowSteps,
  validateBusinessFlow,
};
