const USER_FUNCTION_OVERVIEW_VERSION = "4.1-user-function-overview-v1";

const userFunctionModules = [
  {
    key: "home",
    module: "首页",
    coreFunctions: ["城市定位", "旅居服务入口", "活动推荐", "功能宫格", "底部导航"],
    priority: "P0",
    acceptance: "用户能快速找到安全守护、健康服务、旅居管家、活动入口。",
    route: "home",
    apiEndpoints: ["/api/user/home", "/api/user/home-requirements", "/api/user/home-city", "/api/activities"],
  },
  {
    key: "aiSteward",
    module: "智能管家",
    coreFunctions: ["AI 聊天", "语音互动", "快捷问题", "旅居咨询", "服务推荐"],
    priority: "P0",
    acceptance: "可输入/语音提问，返回可读答案，可推荐服务。",
    route: "assistant",
    apiEndpoints: ["/api/ai/steward-requirements", "/api/ai/chat", "/api/ai/voice/transcribe", "/api/ai/quick-questions", "/api/ai/recommendations"],
  },
  {
    key: "activityMap",
    module: "活动地图",
    coreFunctions: ["地图活动点", "活动筛选", "附近活动", "活动详情", "报名"],
    priority: "P0",
    acceptance: "地图展示活动位置，用户可查看和报名。",
    route: "activity-map",
    apiEndpoints: ["/api/activities/map-requirements", "/api/activities/map", "/api/activities", "/api/activities/{id}", "/api/activities/{id}/join"],
  },
  {
    key: "emergencyHelp",
    module: "紧急求助",
    coreFunctions: ["SOS", "一键拨打", "位置上传", "紧急联系人", "健康信息"],
    priority: "P0",
    acceptance: "一键求助后生成记录并通知联系人/后台。",
    route: "emergency",
    apiEndpoints: ["/api/alerts/emergency-requirements", "/api/alerts/sos", "/api/alerts/quick-help", "/api/family-contacts", "/api/health/overview"],
  },
  {
    key: "smartDevice",
    module: "智能设备",
    coreFunctions: ["设备状态", "今日健康概览", "手环/机器人联动", "设备设置"],
    priority: "P0",
    acceptance: "展示健康数据、连接状态、设备电量、设备功能。",
    route: "devices",
    apiEndpoints: ["/api/devices", "/api/devices/bind", "/api/health/overview", "/api/devices/robot-requirements", "/api/devices/{id}/action"],
  },
  {
    key: "robot",
    module: "小云机器人",
    coreFunctions: ["语音对话", "活动提醒", "摔倒检测", "异常检测", "家人通话", "寻求帮助"],
    priority: "P0",
    acceptance: "能展示守护状态、功能开关、守护记录。",
    route: "robot",
    apiEndpoints: ["/api/devices/robot-requirements", "/api/devices/help-request", "/api/devices/{id}/action", "/api/alerts", "/api/ai/chat"],
  },
  {
    key: "guideService",
    module: "旅居管家/人工向导",
    coreFunctions: ["服务分类", "向导推荐", "下单", "订单跟踪"],
    priority: "P0",
    acceptance: "用户可选择陪伴就医、导游游览、护工护理等服务并提交订单。",
    route: "guide",
    apiEndpoints: ["/api/guide/order-requirements", "/api/services", "/api/orders", "/api/orders/{id}", "/api/orders/{id}/cancel"],
  },
  {
    key: "ordersMessages",
    module: "订单与消息",
    coreFunctions: ["订单列表", "订单详情", "进度提醒", "系统消息", "评价"],
    priority: "P0",
    acceptance: "用户可查看订单状态并评价。",
    route: "orders",
    apiEndpoints: ["/api/orders", "/api/orders/{id}", "/api/orders/{id}/confirm", "/api/messages", "/api/messages/read-all"],
  },
  {
    key: "profile",
    module: "我的",
    coreFunctions: ["个人资料", "家属绑定", "健康档案", "紧急联系人", "设置"],
    priority: "P1",
    acceptance: "可维护基础档案和联系人。",
    route: "profile",
    apiEndpoints: ["/api/user/profile", "/api/elder/profile", "/api/family-contacts", "/api/health/overview", "/api/ui/actions"],
  },
];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function moduleRuntime(key, db) {
  const messages = db.messages || [];
  const orders = db.orders || [];
  const tasks = db.tasks || [];
  const activities = db.activities || [];
  const devices = db.devices || [];
  const alerts = db.alerts || [];
  const familyContacts = db.familyContacts || [];
  const healthRecords = db.healthRecords || [];
  const aiHistory = db.aiHistory || [];
  const services = db.services || [];
  const guides = db.guides || [];
  const today = todayDate();

  const runtime = {
    home: {
      currentCity: db.elderProfile?.city || db.meta?.city || "昆明",
      activeActivities: activities.filter((item) => item.status !== "已下线").length,
      unreadMessages: messages.filter((item) => item.toRole === "user" && !item.read).length,
      quickEntries: ["安全守护", "健康服务", "旅居管家", "活动入口"],
    },
    aiSteward: {
      recentConversations: aiHistory.length,
      supportsTextChat: true,
      supportsVoiceSample: true,
      recommendableServices: services.filter((item) => item.status === "上架").length + activities.filter((item) => item.status === "报名中").length,
    },
    activityMap: {
      mapPoints: activities.filter((item) => item.coordinates).length,
      categories: unique(activities.map((item) => item.category)),
      joinableActivities: activities.filter((item) => item.status === "报名中").length,
    },
    emergencyHelp: {
      sosRecords: alerts.filter((item) => item.type === "SOS").length,
      pendingAlerts: alerts.filter((item) => item.status !== "已处理").length,
      emergencyContacts: familyContacts.length,
      healthInfoReady: healthRecords.length > 0,
    },
    smartDevice: {
      deviceCount: devices.length,
      onlineDevices: devices.filter((item) => item.onlineStatus === "在线").length,
      lowBatteryDevices: devices.filter((item) => Number(item.battery || 0) <= 20).length,
      todayHealthRecords: healthRecords.filter((item) => String(item.recordedAt || "").startsWith(today)).length || healthRecords.length,
    },
    robot: {
      robotOnline: devices.some((item) => /机器人/.test(item.type || "") && item.onlineStatus === "在线"),
      guardianAlerts: alerts.filter((item) => /摔倒|设备|异常|SOS/.test(`${item.type || ""}${item.description || ""}`)).length,
      helpTasks: (db.serviceRequests || []).filter((item) => /机器人|设备|帮助/.test(`${item.type || ""}${item.action || ""}`)).length,
    },
    guideService: {
      serviceCategories: unique(services.map((item) => item.category)).length,
      availableGuides: guides.filter((item) => item.status === "已认证" || item.status === "通过").length || guides.length,
      guideOrders: orders.filter((item) => item.providerType === "guide").length,
      activeTasks: tasks.filter((item) => item.assigneeType === "guide" && !["已完成", "已取消"].includes(item.status)).length,
    },
    ordersMessages: {
      orderCount: orders.length,
      activeOrders: orders.filter((item) => !["已完成", "已取消"].includes(item.status)).length,
      unreadMessages: messages.filter((item) => item.toRole === "user" && !item.read).length,
      reviewCount: (db.reviews || []).length,
    },
    profile: {
      profileReady: Boolean(db.userProfile && db.elderProfile),
      familyContacts: familyContacts.length,
      healthRecords: healthRecords.length,
      configurableSettings: true,
    },
  };
  return runtime[key] || {};
}

function userFunctionOverviewForApi(db) {
  const modules = userFunctionModules.map((item) => {
    const runtime = moduleRuntime(item.key, db);
    const endpointReady = item.apiEndpoints.length > 0;
    const routeReady = Boolean(item.route);
    return {
      ...item,
      runtime,
      ready: endpointReady && routeReady,
    };
  });
  return {
    version: USER_FUNCTION_OVERVIEW_VERSION,
    source: "4.1 用户端功能总览",
    moduleCount: modules.length,
    p0Count: modules.filter((item) => item.priority === "P0").length,
    p1Count: modules.filter((item) => item.priority === "P1").length,
    modules,
    runtime: {
      allP0Ready: modules.filter((item) => item.priority === "P0").every((item) => item.ready),
      userRoutes: modules.map((item) => ({ module: item.module, route: item.route, priority: item.priority })),
      apiEndpointCount: unique(modules.flatMap((item) => item.apiEndpoints)).length,
    },
  };
}

function validateUserFunctionOverview() {
  const errors = [];
  const expectedRows = [
    ["首页", "城市定位、旅居服务入口、活动推荐、功能宫格、底部导航", "P0"],
    ["智能管家", "AI 聊天、语音互动、快捷问题、旅居咨询、服务推荐", "P0"],
    ["活动地图", "地图活动点、活动筛选、附近活动、活动详情、报名", "P0"],
    ["紧急求助", "SOS、一键拨打、位置上传、紧急联系人、健康信息", "P0"],
    ["智能设备", "设备状态、今日健康概览、手环/机器人联动、设备设置", "P0"],
    ["小云机器人", "语音对话、活动提醒、摔倒检测、异常检测、家人通话、寻求帮助", "P0"],
    ["旅居管家/人工向导", "服务分类、向导推荐、下单、订单跟踪", "P0"],
    ["订单与消息", "订单列表、订单详情、进度提醒、系统消息、评价", "P0"],
    ["我的", "个人资料、家属绑定、健康档案、紧急联系人、设置", "P1"],
  ];
  expectedRows.forEach(([module, coreFunctions, priority], index) => {
    const row = userFunctionModules[index];
    if (!row || row.module !== module || row.coreFunctions.join("、") !== coreFunctions || row.priority !== priority) {
      errors.push({ index, module, issue: "模块行与 4.1 图示不一致" });
    }
  });
  if (userFunctionModules.filter((item) => item.priority === "P0").length !== 8) {
    errors.push({ feature: "优先级", issue: "P0 模块数量应为 8" });
  }
  userFunctionModules.forEach((item) => {
    if (!item.route) errors.push({ module: item.module, issue: "缺少用户端路由" });
    if (!item.apiEndpoints.length) errors.push({ module: item.module, issue: "缺少接口映射" });
  });
  return {
    version: USER_FUNCTION_OVERVIEW_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  USER_FUNCTION_OVERVIEW_VERSION,
  userFunctionModules,
  userFunctionOverviewForApi,
  validateUserFunctionOverview,
};
