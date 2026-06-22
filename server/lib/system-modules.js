const MODULE_ARCHITECTURE_VERSION = "9.1-system-modules-v1";

const systemModules = [
  {
    id: "user-permission",
    module: "用户与权限服务",
    capabilities: ["手机号登录", "微信登录", "角色权限", "角色与端口划分", "用户端功能总览", "首页需求", "城市切换", "首页消息入口", "用户资料", "家属绑定", "紧急联系人"],
    apiEndpoints: ["/auth/login", "/auth/wechat-login", "/roles/endpoint-division", "/user/functions/overview", "/user/home-requirements", "/user/home-city", "/user/profile", "/elder/profile", "/family-contacts", "/family-contacts/{id}", "/family-contacts/{id}/call"],
    dataTables: ["user", "elder_profile", "family_contact"],
    status: "已实现",
    note: "当前使用 HMAC JWT 模拟登录鉴权，角色权限表已覆盖用户、家属、向导、商户、管理员；第 2 节角色与端口划分、4.1 用户端功能总览与 4.2 首页城市、消息入口、首页需求已接入真实接口。",
  },
  {
    id: "order-task",
    module: "订单与任务服务",
    capabilities: ["订单创建", "向导下单需求", "任务拆分", "派单", "接单", "向导状态流", "状态流转", "评价"],
    apiEndpoints: ["/orders", "/orders/{id}", "/orders/{id}/cancel", "/orders/{id}/confirm", "/tasks/dispatch", "/tasks/{id}/accept", "/tasks/{id}/start", "/tasks/{id}/complete", "/guide/order-requirements", "/guide/order-status-flow", "/guide/tasks/{id}/decline", "/guide/tasks/{id}/ignore", "/guide/tasks/{id}/cancel", "/merchant/orders/{id}/reject", "/merchant/orders/{id}/reschedule", "/reviews"],
    dataTables: ["order", "task", "review"],
    status: "已实现",
    note: "订单、任务、异常均由服务端状态机约束；4.7 向导下单需求已固化为订单字段契约，评价数据已在用户确认完成后沉淀。",
  },
  {
    id: "service-resource",
    module: "服务资源服务",
    capabilities: ["人工向导", "向导功能", "向导下单分类", "商户", "服务项目", "服务分类", "活动", "活动地图", "活动分类", "活动卡片", "附近推荐", "活动报名取消", "价格", "服务区域"],
    apiEndpoints: ["/guides", "/guide/dashboard", "/guide/functions/overview", "/guide/order-requirements", "/guide/online", "/guide/tasks/claim-next", "/merchants", "/services", "/activities", "/activities/map-requirements", "/activities/map", "/activities/{id}", "/activities/{id}/join", "/activities/{id}/cancel", "/merchant/services", "/merchant/functions/overview", "/merchant/service-categories", "/admin/services", "/admin/activities"],
    dataTables: ["guide", "merchant", "service_item", "activity"],
    status: "已实现",
    note: "服务目录、商户服务发布、后台审核、活动上下线和 4.4 活动地图点位、分类、附近推荐、报名/取消报名已接入模拟数据库。",
  },
  {
    id: "device-health",
    module: "设备与健康数据服务",
    capabilities: ["设备绑定", "健康数据", "异常记录", "设备状态", "设备联动", "小云机器人", "守护功能", "家人通话", "帮助任务", "紧急求助", "通知链路", "位置上传", "快速求助", "急救健康信息"],
    apiEndpoints: ["/devices", "/devices/bind", "/devices/robot-requirements", "/devices/help-request", "/health/overview", "/alerts/emergency-requirements", "/alerts/sos", "/alerts/quick-help", "/alerts", "/alerts/{id}/handle"],
    dataTables: ["device", "health_record", "alert"],
    status: "已实现",
    note: "设备与健康数据为试运营模拟数据；4.5 紧急求助已接入 SOS、通知链路、定位、联系人、快速求助和急救健康信息，4.6 智能设备与小云机器人已接入状态、守护开关、通话模拟和帮助任务，真实硬件协议已在集成接口中预留。",
  },
  {
    id: "ai-steward",
    module: "AI 管家服务",
    capabilities: ["AI问答", "语音互动", "快捷问题", "服务推荐", "服务记录", "问答", "知识库", "推荐", "上下文记录"],
    apiEndpoints: ["/ai/steward-requirements", "/ai/chat", "/ai/history", "/ai/quick-questions", "/ai/quick-questions/{id}/ask", "/ai/voice/transcribe", "/ai/recommendations", "/ai/service-records"],
    dataTables: ["ai_chat", "activity", "service_item", "health_record"],
    status: "已实现/接口预留",
    note: "按 4.3 建立文字问答、快捷问题、语音识别预留、服务推荐和服务记录闭环；真实大模型与知识库接入在 P2 集成中预留。",
  },
  {
    id: "notification",
    module: "通知服务",
    capabilities: ["站内消息", "短信", "电话接口预留", "微信订阅消息", "App Push"],
    apiEndpoints: ["/messages", "/messages/read-all", "/messages/{id}/read", "/admin/system/collaboration", "/integrations/sms/request"],
    dataTables: ["message", "integration_request"],
    status: "站内消息已实现/外部通道预留",
    note: "当前以站内消息驱动三端和后台联动，短信、电话、微信订阅消息、App Push 后续替换为真实服务商。",
  },
  {
    id: "admin-ops",
    module: "运营后台服务",
    capabilities: ["首期交付范围", "两周 MVP 原则", "角色端口", "总体业务流程", "用户", "人员", "商户", "订单", "异常", "首页内容配置", "内容", "数据", "系统配置"],
    apiEndpoints: [
      "/delivery/initial-scope",
      "/mvp/principles",
      "/roles/endpoint-division",
      "/business-flow/overview",
      "/admin/dashboard",
      "/admin/content/home",
      "/admin/users",
      "/admin/guides",
      "/admin/merchants",
      "/admin/orders",
      "/admin/alerts",
      "/admin/activities",
      "/admin/functions/overview",
      "/admin/screens",
      "/admin/data-loop",
      "/admin/database/status",
      "/admin/database/schema",
      "/admin/system/collaboration",
      "/admin/priority/status",
    ],
    dataTables: ["user", "elder_profile", "family_contact", "guide", "merchant", "service_item", "order", "task", "activity", "device", "health_record", "alert", "ai_chat", "audit_log"],
    status: "已实现",
    note: "后台已能查询首期交付范围、两周 MVP 原则、总体业务流程、功能总览、用户、人员、商户、订单、异常、活动、首页 Banner 配置、数据大屏、数据闭环、数据库状态和交付状态。",
  },
];

function moduleSummary() {
  return {
    version: MODULE_ARCHITECTURE_VERSION,
    moduleCount: systemModules.length,
    capabilityCount: systemModules.reduce((sum, item) => sum + item.capabilities.length, 0),
    apiEndpointCount: new Set(systemModules.flatMap((item) => item.apiEndpoints)).size,
    coreDataTableCount: new Set(systemModules.flatMap((item) => item.dataTables.filter((table) => !["review", "message", "integration_request", "audit_log"].includes(table)))).size,
  };
}

function systemModulesForApi() {
  return {
    ...moduleSummary(),
    modules: systemModules,
  };
}

function validateSystemModules({ apiPaths = [], tableNames = [] } = {}) {
  const moduleErrors = [];
  const apiPathSet = new Set(apiPaths);
  const tableNameSet = new Set(tableNames);
  const optionalTables = new Set(["review", "message", "integration_request", "audit_log"]);

  systemModules.forEach((item) => {
    if (!item.module || item.capabilities.length === 0) {
      moduleErrors.push({ module: item.module || item.id, issue: "模块名称或能力为空" });
    }
    item.apiEndpoints.forEach((endpoint) => {
      if (!endpoint.startsWith("/")) {
        moduleErrors.push({ module: item.module, endpoint, issue: "接口路径格式错误" });
      }
      if (apiPaths.length && !apiPathSet.has(endpoint) && !endpoint.startsWith("/messages") && !endpoint.startsWith("/integrations") && endpoint !== "/reviews") {
        moduleErrors.push({ module: item.module, endpoint, issue: "接口未纳入 MVP 清单或工程增强接口" });
      }
    });
    item.dataTables.forEach((table) => {
      if (tableNames.length && !tableNameSet.has(table) && !optionalTables.has(table)) {
        moduleErrors.push({ module: item.module, table, issue: "核心表契约不存在" });
      }
    });
  });

  return {
    ...moduleSummary(),
    valid: moduleErrors.length === 0,
    errors: moduleErrors,
  };
}

module.exports = {
  MODULE_ARCHITECTURE_VERSION,
  systemModules,
  systemModulesForApi,
  validateSystemModules,
};
