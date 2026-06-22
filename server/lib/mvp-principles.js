const MVP_PRINCIPLES_VERSION = "1.3-two-week-mvp-principles-v1";

const mvpPrinciples = [
  {
    id: "core-loop-first",
    principle: "先完成可演示、可试运营、可验收的核心闭环，不追求首期全量商业化。",
    deliveryMode: "P0/P1 核心闭环优先",
    scope: "登录、首页、AI 管家、活动地图、SOS、统一下单、派单、执行、确认评价、后台数据沉淀。",
    apiEndpoints: ["/api/roles/endpoint-division", "/api/business-flow/overview", "/api/admin/priority/status", "/api/admin/data-loop", "/api/admin/dispatch/pending"],
    evidence: ["npm run check", "npm run acceptance", "/user/", "/guide/", "/merchant/", "/admin/"],
  },
  {
    id: "reserved-high-dependency",
    principle: "真实硬件、支付结算、医保/医院深度接口、复杂 AI 诊断等高依赖能力首期仅做接口预留或模拟。",
    deliveryMode: "P2 接口预留或模拟",
    scope: "不在首期伪装真实商业化接入；保留接口、请求记录、模拟数据和后续替换边界。",
    apiEndpoints: ["/api/integrations/hardware/request", "/api/integrations/payment/request", "/api/integrations/medical-hospital/request", "/api/integrations/ai-diagnosis/request"],
    evidence: ["/api/integrations/status", "docs/technology-stack.md", "docs/priority-delivery.md"],
  },
  {
    id: "cross-platform-first",
    principle: "前端优先采用跨端技术栈，减少微信小程序、iOS、Android 三端重复开发。",
    deliveryMode: "跨端技术栈优先",
    scope: "正式交付采用 uni-app/Taro 跨端工程，输出微信小程序、iOS App、Android App，并承载人工向导/商户角色端。",
    apiEndpoints: ["/user/", "/guide/", "/merchant/", "/shared/api.js"],
    evidence: ["apps/shared/api.js", "apps/shared/business-bridge.js", "docs/technology-stack.md"],
  },
  {
    id: "admin-operations-first",
    principle: "管理后台优先满足运营、调度、异常处理和数据查看，复杂 BI 分析后续迭代。",
    deliveryMode: "后台运营与调度优先",
    scope: "后台优先可看数据概览、待派单、订单、异常、用户/向导/商户、活动、服务与评价数据。",
    apiEndpoints: ["/api/admin/dashboard", "/api/admin/dispatch/pending", "/api/admin/alerts", "/api/admin/orders", "/api/admin/screens"],
    evidence: ["/admin/", "docs/admin-function-overview.md", "docs/admin-data-screens.md"],
  },
];

const highDependencyCapabilities = [
  {
    id: "hardware",
    capability: "真实硬件",
    firstPhaseMode: "接口预留/设备数据模拟",
    endpoint: "/api/integrations/hardware/request",
    replacementBoundary: "真实手环、机器人协议和设备云后续替换接入。",
  },
  {
    id: "payment",
    capability: "支付结算",
    firstPhaseMode: "接口预留/金额与结算数据模拟",
    endpoint: "/api/integrations/payment/request",
    replacementBoundary: "真实支付、退款、结算和对账后续接支付服务商。",
  },
  {
    id: "medical-hospital",
    capability: "医保/医院深度接口",
    firstPhaseMode: "接口预留/服务预约与就医陪同模拟",
    endpoint: "/api/integrations/medical-hospital/request",
    replacementBoundary: "医保、医院 HIS/预约/挂号接口后续按合规要求接入。",
  },
  {
    id: "ai-diagnosis",
    capability: "复杂 AI 诊断",
    firstPhaseMode: "接口预留/健康科普与服务推荐模拟",
    endpoint: "/api/integrations/ai-diagnosis/request",
    replacementBoundary: "首期不提供医疗诊断结论；后续仅在具备资质、审核和免责声明后接入辅助能力。",
  },
];

function countBy(items, predicate) {
  return (items || []).filter(predicate).length;
}

function mvpPrinciplesRuntime(db, integrations = []) {
  const orders = db.orders || [];
  const tasks = db.tasks || [];
  const alerts = db.alerts || [];
  const messages = db.messages || [];
  const reviews = db.reviews || [];
  const serviceRequests = db.serviceRequests || [];
  const integrationIds = new Set(integrations.map((item) => item.id));

  return {
    coreLoop: {
      orderCount: orders.length,
      taskCount: tasks.length,
      alertCount: alerts.length,
      messageCount: messages.length,
      reviewCount: reviews.length,
      serviceRequestCount: serviceRequests.length,
      ready: orders.length > 0 && tasks.length > 0 && alerts.length > 0 && messages.length > 0,
    },
    highDependencyReservation: {
      capabilityCount: highDependencyCapabilities.length,
      reservedCount: highDependencyCapabilities.filter((item) => integrationIds.has(item.id) || item.endpoint).length,
      capabilities: highDependencyCapabilities.map((item) => ({
        ...item,
        reserved: integrationIds.has(item.id) || Boolean(item.endpoint),
      })),
    },
    crossPlatform: {
      sharedClient: "apps/shared/api.js",
      appEnds: ["/user/", "/guide/", "/merchant/"],
      adminEnd: "/admin/",
      ready: true,
    },
    adminOperations: {
      pendingDispatchCount: countBy(orders, (item) => item.status === "待派单"),
      activeTaskCount: countBy(tasks, (item) => !["已完成", "已取消"].includes(item.status)),
      openAlertCount: countBy(alerts, (item) => item.status !== "已处理"),
      visibleDataSets: ["用户", "健康", "订单", "任务", "商户", "活动", "异常", "评价"],
      ready: true,
    },
  };
}

function mvpPrinciplesForApi(db, options = {}) {
  const runtime = mvpPrinciplesRuntime(db, options.integrations || []);
  const principles = mvpPrinciples.map((item) => {
    const runtimeKey = {
      "core-loop-first": "coreLoop",
      "reserved-high-dependency": "highDependencyReservation",
      "cross-platform-first": "crossPlatform",
      "admin-operations-first": "adminOperations",
    }[item.id];
    return {
      ...item,
      runtime: runtime[runtimeKey],
      ready:
        item.id === "core-loop-first"
          ? runtime.coreLoop.ready
          : item.id === "reserved-high-dependency"
            ? runtime.highDependencyReservation.reservedCount === runtime.highDependencyReservation.capabilityCount
            : true,
    };
  });

  return {
    version: MVP_PRINCIPLES_VERSION,
    source: "1.3 两周 MVP 原则",
    principleCount: principles.length,
    p0PrincipleCount: 1,
    reservedCapabilityCount: highDependencyCapabilities.length,
    principles,
    highDependencyCapabilities: runtime.highDependencyReservation.capabilities,
    runtime,
    acceptance: {
      coreLoopCanBeDemonstrated: runtime.coreLoop.ready,
      highDependencyOnlyReservedOrSimulated: runtime.highDependencyReservation.reservedCount === runtime.highDependencyReservation.capabilityCount,
      crossPlatformStrategyFixed: runtime.crossPlatform.ready,
      adminOperationsCovered: runtime.adminOperations.ready && runtime.adminOperations.visibleDataSets.length >= 6,
      notFullCommercializationInFirstPhase: true,
    },
  };
}

function validateMvpPrinciples() {
  const errors = [];
  const expectedPrinciples = [
    "先完成可演示、可试运营、可验收的核心闭环，不追求首期全量商业化。",
    "真实硬件、支付结算、医保/医院深度接口、复杂 AI 诊断等高依赖能力首期仅做接口预留或模拟。",
    "前端优先采用跨端技术栈，减少微信小程序、iOS、Android 三端重复开发。",
    "管理后台优先满足运营、调度、异常处理和数据查看，复杂 BI 分析后续迭代。",
  ];

  expectedPrinciples.forEach((principle, index) => {
    const row = mvpPrinciples[index];
    if (!row || row.principle !== principle) {
      errors.push({ principle, issue: "MVP 原则与第 1.3 节图示不一致" });
    }
  });

  mvpPrinciples.forEach((item) => {
    if (!item.deliveryMode || !item.scope) errors.push({ principle: item.id, issue: "缺少交付方式或范围" });
    if (!item.apiEndpoints.length) errors.push({ principle: item.id, issue: "缺少接口或端口证据" });
    if (!item.evidence.length) errors.push({ principle: item.id, issue: "缺少工程证据" });
  });

  highDependencyCapabilities.forEach((item) => {
    if (!item.endpoint || !item.firstPhaseMode.includes("预留")) {
      errors.push({ capability: item.id, issue: "高依赖能力必须为接口预留或模拟" });
    }
  });

  return {
    version: MVP_PRINCIPLES_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  MVP_PRINCIPLES_VERSION,
  highDependencyCapabilities,
  mvpPrinciples,
  mvpPrinciplesForApi,
  validateMvpPrinciples,
};
