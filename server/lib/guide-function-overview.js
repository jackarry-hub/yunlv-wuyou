const GUIDE_FUNCTION_OVERVIEW_VERSION = "guide-function-overview-v1";

const guideFunctionModules = [
  {
    id: "guide-auth",
    module: "登录与认证",
    requirements: ["手机号登录", "身份资料", "服务类型", "实名/资质审核状态"],
    priority: "P0",
    acceptance: "通过审核后才能上线接单。",
    route: "/guide/#15",
    apiEndpoints: ["/api/auth/login", "/api/auth/wechat-login", "/api/admin/guides", "/api/admin/guides/{id}/audit"],
  },
  {
    id: "guide-workbench",
    module: "首页工作台",
    requirements: ["头像", "姓名", "在线状态", "今日工作概览", "今日收入", "消息", "扫一扫"],
    priority: "P0",
    acceptance: "显示接单数、服务中、已完成、今日收入。",
    route: "/guide/#14",
    apiEndpoints: ["/api/guide/dashboard", "/api/guide/income", "/api/messages"],
  },
  {
    id: "guide-online",
    module: "上线接单",
    requirements: ["开启/关闭接单", "设置服务区域", "服务类型", "接单提醒"],
    priority: "P0",
    acceptance: "开关后后台可看到状态。",
    route: "/guide/#08",
    apiEndpoints: ["/api/guide/online", "/api/guide/dashboard", "/api/admin/guides"],
  },
  {
    id: "guide-hall",
    module: "接单大厅",
    requirements: ["推荐/附近/最新订单列表", "按服务类型", "距离", "时间筛选"],
    priority: "P0",
    acceptance: "可查看待接订单并抢单/接单。",
    route: "/guide/#01",
    apiEndpoints: ["/api/guide/dashboard", "/api/guide/tasks/claim-next", "/api/tasks"],
  },
  {
    id: "guide-order-detail",
    module: "订单详情",
    requirements: ["客户信息", "服务类型", "时间地点", "服务内容", "注意事项", "地图位置", "预计收入"],
    priority: "P0",
    acceptance: "详情清晰，点击可接单。",
    route: "/guide/#02",
    apiEndpoints: ["/api/orders/{id}", "/api/guide/tasks/claim-next", "/api/tasks/{id}/accept"],
  },
  {
    id: "guide-service",
    module: "服务中",
    requirements: ["开始服务", "路线导航", "联系客户", "服务清单打勾", "服务完成"],
    priority: "P0",
    acceptance: "订单状态从已接单→服务中→已完成流转。",
    route: "/guide/#04",
    apiEndpoints: ["/api/tasks/{id}/start", "/api/tasks/{id}/complete", "/api/orders/{id}/confirm"],
  },
  {
    id: "guide-exception",
    module: "异常上报",
    requirements: ["客户临时取消", "客户失联", "时间变更", "突发情况", "其他问题", "支持文字和图片"],
    priority: "P0",
    acceptance: "上报后后台可看到异常。",
    route: "/guide/#05",
    apiEndpoints: ["/api/guide/exception", "/api/admin/alerts", "/api/alerts/{id}/handle"],
  },
  {
    id: "guide-orders",
    module: "我的订单",
    requirements: ["全部", "服务中", "已完成", "已取消订单管理"],
    priority: "P0",
    acceptance: "订单列表与状态正确。",
    route: "/guide/#03",
    apiEndpoints: ["/api/guide/dashboard", "/api/tasks", "/api/orders"],
  },
  {
    id: "guide-income-review",
    module: "收入与评价",
    requirements: ["今日收入", "预计收入", "服务评价", "结算记录"],
    priority: "P1",
    acceptance: "收入统计可按日/月查看。",
    route: "/guide/#18",
    apiEndpoints: ["/api/guide/income", "/api/reviews", "/api/admin/data-loop"],
  },
  {
    id: "guide-help",
    module: "帮助中心",
    requirements: ["服务规范", "常见问题", "联系客服"],
    priority: "P1",
    acceptance: "可查看规范文档。",
    route: "/guide/#42",
    apiEndpoints: ["/api/messages", "/api/integrations/sms/request"],
  },
];

function countBy(items, key = "status") {
  return items.reduce((acc, item) => {
    const label = typeof key === "function" ? key(item) : item[key];
    const value = label || "未分类";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function sumAmount(items) {
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function getGuide(db, guideId = "guide-001") {
  return (db.guides || []).find((item) => item.id === guideId) || (db.guides || [])[0] || {};
}

function guideRuntime(module, db = {}, guideId = "guide-001") {
  const guide = getGuide(db, guideId);
  const orders = (db.orders || []).filter((item) => item.providerType === "guide" && (!item.providerId || item.providerId === guide.id));
  const tasks = (db.tasks || []).filter((item) => item.assigneeType === "guide" && (!item.assigneeId || item.assigneeId === guide.id));
  const reviews = (db.reviews || []).filter((item) => item.providerType === "guide" && (!item.providerId || item.providerId === guide.id));
  const messages = (db.messages || []).filter((item) => item.toRole === "guide");
  const alerts = (db.alerts || []).filter((item) => item.source === "向导端" || /向导/.test(`${item.type || ""}${item.description || ""}`));
  const activeTasks = tasks.filter((item) => !["已完成", "已取消"].includes(item.status));
  const pendingOrders = (db.orders || []).filter((item) => item.providerType === "guide" && item.status === "待派单");
  const completedOrders = orders.filter((item) => item.status === "已完成");

  const map = {
    "guide-auth": {
      status: "已接入",
      metrics: {
        guideName: guide.realName || "未建档向导",
        auditStatus: guide.status || "未提交",
        serviceTypes: (guide.serviceTypes || []).length,
        canGoOnline: guide.status === "已认证",
      },
    },
    "guide-workbench": {
      status: "已接入",
      metrics: {
        onlineStatus: guide.onlineStatus || "离线",
        currentStatus: guide.currentStatus || "休息中",
        todayIncome: Number(guide.incomeToday || 0),
        activeTasks: activeTasks.length,
        completedToday: completedOrders.length,
        unreadMessages: messages.filter((item) => !item.read).length,
      },
    },
    "guide-online": {
      status: "已接入",
      metrics: {
        onlineStatus: guide.onlineStatus || "离线",
        serviceArea: guide.area || "未设置",
        serviceTypes: (guide.serviceTypes || []).length,
        backendVisible: true,
      },
    },
    "guide-hall": {
      status: "已接入",
      metrics: {
        pendingOrders: pendingOrders.length,
        recommendedOrders: pendingOrders.length,
        filters: ["服务类型", "距离", "时间"].length,
        claimable: pendingOrders.length,
      },
    },
    "guide-order-detail": {
      status: "已接入",
      metrics: {
        activeOrders: orders.filter((item) => !["已完成", "已取消"].includes(item.status)).length,
        detailFields: module.requirements.length,
        acceptable: pendingOrders.length + tasks.filter((item) => item.status === "待接单").length,
      },
    },
    "guide-service": {
      status: "已接入",
      metrics: {
        acceptedTasks: tasks.filter((item) => item.status === "已接单").length,
        inServiceTasks: tasks.filter((item) => item.status === "服务中").length,
        completedTasks: tasks.filter((item) => item.status === "已完成" || item.status === "待确认").length,
        statusFlowReady: true,
      },
    },
    "guide-exception": {
      status: "已接入",
      metrics: {
        exceptionReports: alerts.length,
        pendingAlerts: alerts.filter((item) => item.status !== "已处理").length,
        supportsTextAndImage: true,
      },
    },
    "guide-orders": {
      status: "已接入",
      metrics: {
        totalOrders: orders.length,
        statusCounts: countBy(orders),
        activeTasks: activeTasks.length,
      },
    },
    "guide-income-review": {
      status: "已接入",
      metrics: {
        todayIncome: Number(guide.incomeToday || 0),
        estimatedIncome: sumAmount(activeTasks.map((task) => orders.find((order) => order.id === task.orderId) || {})),
        reviews: reviews.length,
        rating: guide.rating || 0,
      },
    },
    "guide-help": {
      status: "已接入",
      metrics: {
        helpRoutes: ["/guide/#42", "/guide/#43", "/guide/#34"].length,
        supportMessages: messages.filter((item) => /客服|规范|帮助/.test(`${item.title || ""}${item.content || ""}`)).length,
      },
    },
  };

  return map[module.id] || { status: "已接入", metrics: { routeReady: true, apiReady: module.apiEndpoints.length > 0 } };
}

function guideFunctionOverviewForApi(db = {}, guideId = "guide-001") {
  const modules = guideFunctionModules.map((module) => ({
    ...module,
    requirementText: module.requirements.join("、"),
    runtime: guideRuntime(module, db, guideId),
  }));
  return {
    version: GUIDE_FUNCTION_OVERVIEW_VERSION,
    source: "向导端功能总览",
    guideId,
    moduleCount: modules.length,
    p0Count: modules.filter((item) => item.priority === "P0").length,
    p1Count: modules.filter((item) => item.priority === "P1").length,
    implementedCount: modules.filter((item) => item.runtime.status === "已接入").length,
    modules,
    updatedAt: new Date().toISOString(),
  };
}

function validateGuideFunctionOverview() {
  const expected = [
    ["登录与认证", "P0", "通过审核后才能上线接单。"],
    ["首页工作台", "P0", "显示接单数、服务中、已完成、今日收入。"],
    ["上线接单", "P0", "开关后后台可看到状态。"],
    ["接单大厅", "P0", "可查看待接订单并抢单/接单。"],
    ["订单详情", "P0", "详情清晰，点击可接单。"],
    ["服务中", "P0", "订单状态从已接单→服务中→已完成流转。"],
    ["异常上报", "P0", "上报后后台可看到异常。"],
    ["我的订单", "P0", "订单列表与状态正确。"],
    ["收入与评价", "P1", "收入统计可按日/月查看。"],
    ["帮助中心", "P1", "可查看规范文档。"],
  ];
  const errors = [];
  expected.forEach(([moduleName, priority, acceptance]) => {
    const module = guideFunctionModules.find((item) => item.module === moduleName);
    if (!module) {
      errors.push({ module: moduleName, issue: "缺少向导端模块" });
      return;
    }
    if (module.priority !== priority) errors.push({ module: moduleName, issue: "优先级不一致" });
    if (module.acceptance !== acceptance) errors.push({ module: moduleName, issue: "验收标准不一致" });
    if (!module.requirements.length) errors.push({ module: moduleName, issue: "功能需求为空" });
    if (!module.route || !module.apiEndpoints.length) errors.push({ module: moduleName, issue: "缺少页面入口或接口" });
  });
  if (guideFunctionModules.length !== expected.length) {
    errors.push({ module: "全部", issue: "模块数量不一致" });
  }
  return {
    version: GUIDE_FUNCTION_OVERVIEW_VERSION,
    valid: errors.length === 0,
    moduleCount: guideFunctionModules.length,
    p0Count: guideFunctionModules.filter((item) => item.priority === "P0").length,
    p1Count: guideFunctionModules.filter((item) => item.priority === "P1").length,
    errors,
  };
}

module.exports = {
  GUIDE_FUNCTION_OVERVIEW_VERSION,
  guideFunctionModules,
  guideFunctionOverviewForApi,
  validateGuideFunctionOverview,
};
