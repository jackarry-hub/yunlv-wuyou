const { adminScreensForApi } = require("./admin-data-screens");

const ADMIN_FUNCTION_OVERVIEW_VERSION = "7.1-admin-function-overview-v1";

const adminFunctionModules = [
  {
    id: "dashboard",
    module: "首页数据概览",
    requirements: ["用户数", "老人数量", "在线设备", "待处理订单", "异常预警", "今日服务"],
    priority: "P0",
    acceptance: "进入后台可看到关键指标。",
    route: "/admin/#dashboard",
    apiEndpoints: ["/api/admin/dashboard"],
  },
  {
    id: "user-management",
    module: "老人/用户管理",
    requirements: ["用户档案", "家属绑定", "健康档案", "紧急联系人", "服务记录"],
    priority: "P0",
    acceptance: "可查询、查看、编辑基础信息。",
    route: "/admin/#users",
    apiEndpoints: ["/api/admin/users", "/api/admin/health-records"],
  },
  {
    id: "guide-management",
    module: "人工向导管理",
    requirements: ["向导资料", "审核", "服务类型", "在线状态", "订单记录", "评价", "收入"],
    priority: "P0",
    acceptance: "可审核向导并查看状态。",
    route: "/admin/#guides",
    apiEndpoints: ["/api/admin/guides", "/api/guide/dashboard", "/api/guide/income"],
  },
  {
    id: "merchant-management",
    module: "商户管理",
    requirements: ["商户入驻", "资质审核", "服务上架", "订单", "评价", "结算"],
    priority: "P0",
    acceptance: "商户审核和服务管理可用。",
    route: "/admin/#merchants",
    apiEndpoints: ["/api/admin/merchants", "/api/admin/services", "/api/merchant/orders", "/api/merchant/reviews"],
  },
  {
    id: "order-management",
    module: "订单管理",
    requirements: ["全部订单", "待派单", "已派单", "服务中", "待确认", "已完成", "已取消"],
    priority: "P0",
    acceptance: "订单状态清晰，可人工干预。",
    route: "/admin/#orders",
    apiEndpoints: ["/api/admin/orders", "/api/orders/{id}/confirm", "/api/orders/{id}/cancel"],
  },
  {
    id: "dispatch",
    module: "任务调度",
    requirements: ["派单给人工向导或商户", "支持按位置、服务类型、评分、空闲状态匹配"],
    priority: "P0",
    acceptance: "后台可手动派单和改派。",
    route: "/admin/#tasks",
    apiEndpoints: ["/api/admin/dispatch/pending", "/api/admin/dispatch/candidates", "/api/tasks/dispatch"],
  },
  {
    id: "exceptions",
    module: "异常报告",
    requirements: ["SOS", "设备异常", "摔倒检测", "长时间未动", "客户投诉", "服务异常"],
    priority: "P0",
    acceptance: "异常可处理，记录处理结果。",
    route: "/admin/#exceptions",
    apiEndpoints: ["/api/admin/alerts", "/api/alerts/{id}/handle", "/api/guide/exception", "/api/merchant/exception"],
  },
  {
    id: "activities",
    module: "活动管理",
    requirements: ["活动新增", "编辑", "上下架", "报名管理", "地图位置", "分类"],
    priority: "P0",
    acceptance: "用户端活动地图可同步展示。",
    route: "/admin/#activities-content",
    apiEndpoints: ["/api/admin/activities", "/api/activities", "/api/activities/map", "/api/activities/{id}/join"],
  },
  {
    id: "devices",
    module: "设备管理",
    requirements: ["设备列表", "绑定用户", "连接状态", "电量", "数据同步记录"],
    priority: "P1",
    acceptance: "可查看设备状态与模拟数据。",
    route: "/admin/#devices",
    apiEndpoints: ["/api/devices", "/api/devices/bind", "/api/health/overview"],
  },
  {
    id: "content",
    module: "内容管理",
    requirements: ["Banner", "政策指南", "旅居故事", "通知公告"],
    priority: "P1",
    acceptance: "前端内容可配置。",
    route: "/admin/#banner",
    apiEndpoints: ["/api/admin/activities", "/api/messages"],
  },
  {
    id: "data-screens",
    module: "数据大屏",
    requirements: ["老人监测大屏", "人工向导调度大屏", "服务数据统计"],
    priority: "P1",
    acceptance: "可展示核心统计和地图。",
    route: "/admin/#operation-screen",
    apiEndpoints: ["/api/admin/screens"],
  },
  {
    id: "system-permission",
    module: "系统权限",
    requirements: ["角色", "权限", "菜单", "操作日志"],
    priority: "P0",
    acceptance: "不同角色看到不同菜单。",
    route: "/admin/#permission",
    apiEndpoints: ["/api/auth/login", "/api/admin/audit-logs", "/api/admin/system/modules"],
  },
];

function statusCounts(items, field = "status") {
  return items.reduce((acc, item) => {
    const value = item[field] || "未分类";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function todayPrefix() {
  return new Date().toISOString().slice(0, 10);
}

function moduleRuntime(module, db) {
  const openAlerts = db.alerts.filter((item) => item.status !== "已处理");
  const pendingOrders = db.orders.filter((item) => item.status === "待派单");
  const today = todayPrefix();

  const map = {
    dashboard: {
      status: "已接入",
      metrics: {
        users: db.users.length,
        elders: db.users.filter((item) => item.role === "elder").length,
        onlineDevices: db.devices.filter((item) => item.onlineStatus === "在线").length,
        pendingOrders: pendingOrders.length,
        openAlerts: openAlerts.length,
        todayServices: db.orders.filter((item) => String(item.time || item.createdAt || "").startsWith(today)).length,
      },
    },
    "user-management": {
      status: "已接入",
      metrics: {
        users: db.users.length,
        familyContacts: db.familyContacts.length,
        healthRecords: db.healthRecords.length,
        serviceRecords: db.orders.length,
      },
    },
    "guide-management": {
      status: "已接入",
      metrics: {
        guides: db.guides.length,
        certified: db.guides.filter((item) => item.status === "已认证").length,
        online: db.guides.filter((item) => item.onlineStatus === "在线").length,
        guideTasks: db.tasks.filter((item) => item.assigneeType === "guide").length,
        reviews: db.reviews.filter((item) => item.providerType === "guide").length,
      },
    },
    "merchant-management": {
      status: "已接入",
      metrics: {
        merchants: db.merchants.length,
        approved: db.merchants.filter((item) => item.status === "已通过").length,
        services: db.services.filter((item) => item.providerType === "merchant").length,
        merchantOrders: db.orders.filter((item) => item.providerType === "merchant").length,
        settlementPending: db.merchants.reduce((sum, item) => sum + Number(item.settlementPending || 0), 0),
      },
    },
    "order-management": {
      status: "已接入",
      metrics: {
        total: db.orders.length,
        ...statusCounts(db.orders),
      },
    },
    dispatch: {
      status: "已接入",
      metrics: {
        pendingOrders: pendingOrders.length,
        candidateGuides: db.guides.filter((item) => item.status === "已认证").length,
        candidateMerchants: db.merchants.filter((item) => item.status === "已通过").length,
        activeTasks: db.tasks.filter((item) => !["已完成", "已取消"].includes(item.status)).length,
      },
    },
    exceptions: {
      status: "已接入",
      metrics: {
        alerts: db.alerts.length,
        openAlerts: openAlerts.length,
        handled: db.alerts.filter((item) => item.status === "已处理").length,
        types: Object.keys(statusCounts(db.alerts, "type")).length,
      },
    },
    activities: {
      status: "已接入",
      metrics: {
        activities: db.activities.length,
        signups: db.activitySignups.length,
        categories: Object.keys(statusCounts(db.activities, "category")).length,
        mapPoints: db.activities.filter((item) => item.coordinates).length,
      },
    },
    devices: {
      status: "已接入",
      metrics: {
        devices: db.devices.length,
        online: db.devices.filter((item) => item.onlineStatus === "在线").length,
        lowBattery: db.devices.filter((item) => Number(item.battery || 0) < 30).length,
        syncRecords: db.healthRecords.length,
      },
    },
    content: {
      status: "已接入",
      metrics: {
        banners: 1,
        policies: 1,
        stories: 1,
        notices: db.messages.length,
      },
    },
    "data-screens": {
      status: "已接入",
      metrics: {
        screens: adminScreensForApi(db).screenCount,
        elderScreenMetrics: adminScreensForApi(db).screens[0].metrics.length,
        guideScreenMetrics: adminScreensForApi(db).screens[1].metrics.length,
      },
    },
    "system-permission": {
      status: "已接入",
      metrics: {
        roles: new Set(db.users.map((item) => item.role)).size,
        menus: 53,
        auditLogs: db.auditLogs.length,
        adminUsers: db.users.filter((item) => item.role === "admin").length,
      },
    },
  };
  return map[module.id] || { status: "已接入", metrics: { routeReady: true, apiReady: module.apiEndpoints.length > 0 } };
}

function adminFunctionOverviewForApi(db) {
  const modules = adminFunctionModules.map((module) => ({
    ...module,
    requirementText: module.requirements.join("、"),
    runtime: moduleRuntime(module, db),
  }));
  return {
    version: ADMIN_FUNCTION_OVERVIEW_VERSION,
    source: "7.1 管理后台功能总览",
    moduleCount: modules.length,
    p0Count: modules.filter((item) => item.priority === "P0").length,
    p1Count: modules.filter((item) => item.priority === "P1").length,
    implementedCount: modules.filter((item) => item.runtime.status === "已接入").length,
    modules,
    updatedAt: new Date().toISOString(),
  };
}

function validateAdminFunctionOverview() {
  const expected = [
    ["首页数据概览", "P0", "进入后台可看到关键指标。"],
    ["老人/用户管理", "P0", "可查询、查看、编辑基础信息。"],
    ["人工向导管理", "P0", "可审核向导并查看状态。"],
    ["商户管理", "P0", "商户审核和服务管理可用。"],
    ["订单管理", "P0", "订单状态清晰，可人工干预。"],
    ["任务调度", "P0", "后台可手动派单和改派。"],
    ["异常报告", "P0", "异常可处理，记录处理结果。"],
    ["活动管理", "P0", "用户端活动地图可同步展示。"],
    ["设备管理", "P1", "可查看设备状态与模拟数据。"],
    ["内容管理", "P1", "前端内容可配置。"],
    ["数据大屏", "P1", "可展示核心统计和地图。"],
    ["系统权限", "P0", "不同角色看到不同菜单。"],
  ];
  const errors = [];
  expected.forEach(([moduleName, priority, acceptance]) => {
    const module = adminFunctionModules.find((item) => item.module === moduleName);
    if (!module) {
      errors.push({ module: moduleName, issue: "缺少后台模块" });
      return;
    }
    if (module.priority !== priority) errors.push({ module: moduleName, issue: "优先级不一致" });
    if (module.acceptance !== acceptance) errors.push({ module: moduleName, issue: "验收标准不一致" });
    if (!module.requirements.length) errors.push({ module: moduleName, issue: "功能需求为空" });
    if (!module.route || !module.apiEndpoints.length) errors.push({ module: moduleName, issue: "缺少页面入口或接口" });
  });
  return {
    version: ADMIN_FUNCTION_OVERVIEW_VERSION,
    valid: errors.length === 0,
    moduleCount: adminFunctionModules.length,
    p0Count: adminFunctionModules.filter((item) => item.priority === "P0").length,
    p1Count: adminFunctionModules.filter((item) => item.priority === "P1").length,
    errors,
  };
}

module.exports = {
  ADMIN_FUNCTION_OVERVIEW_VERSION,
  adminFunctionModules,
  adminFunctionOverviewForApi,
  validateAdminFunctionOverview,
};
