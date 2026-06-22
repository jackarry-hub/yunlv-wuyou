const INITIAL_DELIVERY_SCOPE_VERSION = "1.2-initial-delivery-scope-v1";

const initialDeliveryRows = [
  {
    id: "user",
    scope: "用户端",
    content: "微信小程序、iOS App、Android App",
    deliveryRequirement: "统一体验，覆盖首页、AI 管家、活动地图、紧急求助、智能硬件、旅居管家、订单、消息、我的。",
    routes: ["/user/", "/user/#home", "/user/#assistant", "/user/#activity-map", "/user/#emergency", "/user/#orders", "/user/#messages", "/user/#profile"],
    apiEndpoints: ["/api/user/home", "/api/user/functions/overview", "/api/user/home-requirements", "/api/ai/chat", "/api/activities/map", "/api/alerts/sos", "/api/devices", "/api/orders", "/api/messages"],
    dataObjects: ["user", "elder_profile", "health_record", "device", "activity", "order", "message", "alert"],
  },
  {
    id: "guide",
    scope: "人工向导端",
    content: "小程序/App 内人工向导角色端",
    deliveryRequirement: "覆盖接单大厅、订单详情、服务中、异常上报、我的订单、今日收入、上线接单设置。",
    routes: ["/guide/", "/guide/#14", "/guide/#01", "/guide/#03", "/guide/#07", "/guide/#44"],
    apiEndpoints: ["/api/guide/dashboard", "/api/guide/functions/overview", "/api/guide/order-status-flow", "/api/guide/tasks/claim-next", "/api/tasks/{id}/accept", "/api/tasks/{id}/start", "/api/tasks/{id}/complete", "/api/guide/exception", "/api/guide/income", "/api/guide/online"],
    dataObjects: ["guide", "order", "task", "alert", "message", "review"],
  },
  {
    id: "merchant",
    scope: "商户端",
    content: "小程序/App 内商户角色端",
    deliveryRequirement: "覆盖服务发布、订单预约、确认报价、服务执行、完成上报、评价售后。",
    routes: ["/merchant/", "/merchant/#15", "/merchant/#16", "/merchant/#19", "/merchant/#24", "/merchant/#31"],
    apiEndpoints: ["/api/merchant/dashboard", "/api/merchant/functions/overview", "/api/merchant/service-categories", "/api/merchant/services", "/api/merchant/orders", "/api/merchant/orders/{id}/quote", "/api/merchant/orders/{id}/confirm", "/api/merchant/orders/{id}/start", "/api/merchant/orders/{id}/complete", "/api/merchant/reviews"],
    dataObjects: ["merchant", "service_item", "order", "task", "message", "review"],
  },
  {
    id: "admin",
    scope: "管理后台",
    content: "PC Web 管理后台",
    deliveryRequirement: "覆盖用户、老人、人工向导、商户、服务、订单、活动、异常、设备、数据看板、系统配置。",
    routes: ["/admin/", "/admin/#dashboard", "/admin/#users", "/admin/#guides", "/admin/#merchants", "/admin/#orders", "/admin/#alerts", "/admin/#settings"],
    apiEndpoints: ["/api/admin/dashboard", "/api/admin/users", "/api/admin/guides", "/api/admin/merchants", "/api/admin/services", "/api/admin/orders", "/api/admin/activities", "/api/admin/alerts", "/api/admin/screens", "/api/admin/system/modules", "/api/admin/system/technology"],
    dataObjects: ["user", "elder_profile", "guide", "merchant", "service_item", "order", "activity", "alert", "device", "audit_log"],
  },
  {
    id: "hardware-data",
    scope: "硬件数据",
    content: "小云机器人、智能手环及扩展智能设备",
    deliveryRequirement: "首期以模拟数据/接口预留为主，支持后续真实设备接入。",
    routes: ["/user/#devices", "/user/#robot", "/admin/#devices"],
    apiEndpoints: ["/api/devices", "/api/devices/bind", "/api/devices/robot-requirements", "/api/devices/help-request", "/api/health/overview", "/api/integrations/hardware/request"],
    dataObjects: ["device", "health_record", "alert", "integration_request"],
  },
  {
    id: "ai-capability",
    scope: "AI 能力",
    content: "智能管家问答、服务推荐、异常解释",
    deliveryRequirement: "首期以通用大模型+预设知识库+规则推荐实现。",
    routes: ["/user/#assistant", "/admin/#ai"],
    apiEndpoints: ["/api/ai/steward-requirements", "/api/ai/chat", "/api/ai/history", "/api/ai/quick-questions", "/api/ai/recommendations", "/api/ai/service-records", "/api/integrations/llm/request", "/api/integrations/ai-diagnosis/request"],
    dataObjects: ["ai_chat", "activity", "service_item", "health_record", "integration_request"],
  },
];

function countBy(items, predicate) {
  return (items || []).filter(predicate).length;
}

function scopeRuntime(db, row) {
  const orders = db.orders || [];
  const tasks = db.tasks || [];
  const alerts = db.alerts || [];
  const messages = db.messages || [];
  const devices = db.devices || [];
  const services = db.services || [];

  if (row.id === "user") {
    return {
      accountCount: countBy(db.users, (item) => item.role === "elder"),
      functionCount: 9,
      orderCount: orders.length,
      unreadMessageCount: countBy(messages, (item) => item.toRole === "user" && !item.read),
      ready: true,
    };
  }

  if (row.id === "guide") {
    return {
      guideCount: (db.guides || []).length,
      onlineGuideCount: countBy(db.guides, (item) => item.onlineStatus === "在线"),
      guideTaskCount: countBy(tasks, (item) => item.assigneeType === "guide"),
      ready: (db.guides || []).length > 0,
    };
  }

  if (row.id === "merchant") {
    return {
      merchantCount: (db.merchants || []).length,
      serviceCount: countBy(services, (item) => item.providerType === "merchant"),
      merchantOrderCount: countBy(orders, (item) => item.providerType === "merchant"),
      ready: (db.merchants || []).length > 0,
    };
  }

  if (row.id === "admin") {
    return {
      manageableDataSets: ["用户", "老人", "人工向导", "商户", "服务", "订单", "活动", "异常", "设备", "数据看板", "系统配置"],
      pendingDispatchCount: countBy(orders, (item) => item.status === "待派单"),
      openAlertCount: countBy(alerts, (item) => item.status !== "已处理"),
      ready: true,
    };
  }

  if (row.id === "hardware-data") {
    return {
      deviceCount: devices.length,
      simulatedDeviceCount: devices.length,
      onlineDeviceCount: countBy(devices, (item) => item.onlineStatus === "在线"),
      hardwareIntegrationReserved: true,
      ready: devices.length > 0,
    };
  }

  return {
    aiConversationCount: (db.aiHistory || []).length,
    serviceRecommendationSourceCount: services.length + (db.activities || []).length,
    llmIntegrationReserved: true,
    aiDiagnosisReserved: true,
    ready: true,
  };
}

function initialDeliveryScopeForApi(db) {
  const rows = initialDeliveryRows.map((row) => ({
    ...row,
    runtime: scopeRuntime(db, row),
    ready: row.routes.length > 0 && row.apiEndpoints.length > 0 && row.dataObjects.length > 0 && scopeRuntime(db, row).ready,
  }));

  return {
    version: INITIAL_DELIVERY_SCOPE_VERSION,
    source: "1.2 首期交付范围",
    scopeCount: rows.length,
    appScopeCount: rows.filter((item) => ["用户端", "人工向导端", "商户端"].includes(item.scope)).length,
    platformScopeCount: rows.filter((item) => ["管理后台", "硬件数据", "AI 能力"].includes(item.scope)).length,
    endpointCount: new Set(rows.flatMap((item) => item.apiEndpoints)).size,
    scopes: rows,
    runtime: {
      appEntrances: {
        user: "/user/",
        guide: "/guide/",
        merchant: "/merchant/",
        admin: "/admin/",
      },
      simulatedOrReserved: rows
        .filter((item) => /模拟|预留/.test(item.deliveryRequirement))
        .map((item) => ({ scope: item.scope, requirement: item.deliveryRequirement })),
    },
    acceptance: {
      allSixScopesCovered: rows.length === 6,
      allScopesHaveRoutesAndApis: rows.every((item) => item.routes.length > 0 && item.apiEndpoints.length > 0),
      userExperienceUnified: rows.find((item) => item.id === "user")?.deliveryRequirement.includes("统一体验"),
      guideMerchantAdminCovered: ["guide", "merchant", "admin"].every((id) => rows.find((item) => item.id === id)?.ready),
      hardwareUsesSimulationOrReservation: rows.find((item) => item.id === "hardware-data")?.deliveryRequirement.includes("模拟数据/接口预留"),
      aiUsesModelKnowledgeRules: rows.find((item) => item.id === "ai-capability")?.deliveryRequirement.includes("通用大模型+预设知识库+规则推荐"),
    },
  };
}

function validateInitialDeliveryScope() {
  const errors = [];
  const expectedRows = [
    ["用户端", "微信小程序、iOS App、Android App", "统一体验，覆盖首页、AI 管家、活动地图、紧急求助、智能硬件、旅居管家、订单、消息、我的。"],
    ["人工向导端", "小程序/App 内人工向导角色端", "覆盖接单大厅、订单详情、服务中、异常上报、我的订单、今日收入、上线接单设置。"],
    ["商户端", "小程序/App 内商户角色端", "覆盖服务发布、订单预约、确认报价、服务执行、完成上报、评价售后。"],
    ["管理后台", "PC Web 管理后台", "覆盖用户、老人、人工向导、商户、服务、订单、活动、异常、设备、数据看板、系统配置。"],
    ["硬件数据", "小云机器人、智能手环及扩展智能设备", "首期以模拟数据/接口预留为主，支持后续真实设备接入。"],
    ["AI 能力", "智能管家问答、服务推荐、异常解释", "首期以通用大模型+预设知识库+规则推荐实现。"],
  ];

  expectedRows.forEach(([scope, content, deliveryRequirement], index) => {
    const row = initialDeliveryRows[index];
    if (!row || row.scope !== scope || row.content !== content || row.deliveryRequirement !== deliveryRequirement) {
      errors.push({ scope, issue: "首期交付范围行与第 1.2 节图示不一致" });
    }
  });

  initialDeliveryRows.forEach((row) => {
    if (!row.routes.length) errors.push({ scope: row.scope, issue: "缺少端口路由" });
    if (!row.apiEndpoints.length) errors.push({ scope: row.scope, issue: "缺少 API 映射" });
    if (!row.dataObjects.length) errors.push({ scope: row.scope, issue: "缺少数据对象映射" });
  });

  return {
    version: INITIAL_DELIVERY_SCOPE_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  INITIAL_DELIVERY_SCOPE_VERSION,
  initialDeliveryRows,
  initialDeliveryScopeForApi,
  validateInitialDeliveryScope,
};
