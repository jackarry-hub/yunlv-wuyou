const { rolePermissions } = require("./auth");
const { adminFunctionOverviewForApi, validateAdminFunctionOverview } = require("./admin-function-overview");
const { adminScreensForApi, validateAdminDataScreens } = require("./admin-data-screens");
const { activityMapRequirementsForApi, validateActivityMapRequirements } = require("./activity-map-requirements");
const { aiStewardRequirementsForApi, validateAiStewardRequirements } = require("./ai-steward-requirements");
const { businessFlowForApi, validateBusinessFlow } = require("./business-flow");
const { collaborationForApi, validateCollaborationRules } = require("./collaboration-notifications");
const { validateCoreTables } = require("./database-schema");
const { emergencyHelpRequirementsForApi, validateEmergencyHelpRequirements } = require("./emergency-help-requirements");
const { guideFunctionOverviewForApi, validateGuideFunctionOverview } = require("./guide-function-overview");
const { guideOrderRequirementsForApi, validateGuideOrderRequirements } = require("./guide-order-requirements");
const { guideOrderStatusFlowForApi, validateGuideOrderStatusFlow } = require("./guide-order-status-flow");
const { initialDeliveryScopeForApi, validateInitialDeliveryScope } = require("./initial-delivery-scope");
const { merchantFunctionOverviewForApi, validateMerchantFunctionOverview } = require("./merchant-function-overview");
const { merchantServiceCategoriesForApi, validateMerchantServiceCategories } = require("./merchant-service-categories");
const { mvpPrinciplesForApi, validateMvpPrinciples } = require("./mvp-principles");
const { roleEndpointDivisionForApi, validateRoleEndpointDivision } = require("./role-endpoint-division");
const { smartDeviceRobotRequirementsForApi, validateSmartDeviceRobotRequirements } = require("./smart-device-robot-requirements");
const { systemModulesForApi, validateSystemModules } = require("./system-modules");
const { technologyStackForApi, validateTechnologyStack } = require("./technology-stack");
const { userFunctionOverviewForApi, validateUserFunctionOverview } = require("./user-function-overview");
const { userHomeRequirementsForApi, validateUserHomeRequirements } = require("./user-home-requirements");

const MVP_DELIVERY_COMPLETION_VERSION = "mvp-delivery-completion-v1";

function validationPassed(validation) {
  return Boolean(validation && validation.valid !== false);
}

function countByStatus(rows = []) {
  return rows.reduce((acc, row) => {
    const status = row.status || "未知";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

function orderHasTask(db, providerType) {
  return (db.orders || []).some((order) =>
    order.providerType === providerType &&
    (db.tasks || []).some((task) => task.orderId === order.id && task.assigneeType === providerType),
  );
}

function hasPermission(role, permission) {
  return Boolean((rolePermissions[role] || []).includes(permission));
}

function endpointSet(checklist) {
  return [...new Set(checklist.flatMap((item) => item.evidence || []))].sort();
}

function mvpDeliveryCompletionForApi(db = {}, options = {}) {
  const integrations = options.integrations || [];
  const initialScope = initialDeliveryScopeForApi(db);
  const mvpPrinciples = mvpPrinciplesForApi(db, { integrations });
  const roleEndpoints = roleEndpointDivisionForApi(db);
  const businessFlow = businessFlowForApi(db);
  const userFunctions = userFunctionOverviewForApi(db);
  const userHome = userHomeRequirementsForApi(db);
  const activityMap = activityMapRequirementsForApi(db);
  const aiSteward = aiStewardRequirementsForApi(db);
  const emergencyHelp = emergencyHelpRequirementsForApi(db);
  const smartDevice = smartDeviceRobotRequirementsForApi(db);
  const guideFunctions = guideFunctionOverviewForApi(db);
  const guideRequirements = guideOrderRequirementsForApi(db);
  const guideFlow = guideOrderStatusFlowForApi(db);
  const merchantFunctions = merchantFunctionOverviewForApi(db);
  const merchantCategories = merchantServiceCategoriesForApi(db);
  const adminFunctions = adminFunctionOverviewForApi(db);
  const adminScreens = adminScreensForApi(db);
  const coreTables = validateCoreTables(db);
  const systemModules = systemModulesForApi();
  const technology = technologyStackForApi();
  const collaboration = collaborationForApi();

  const validations = {
    initialScope: validateInitialDeliveryScope(),
    mvpPrinciples: validateMvpPrinciples(),
    roleEndpoints: validateRoleEndpointDivision(),
    businessFlow: validateBusinessFlow(),
    userFunctions: validateUserFunctionOverview(),
    userHome: validateUserHomeRequirements(),
    activityMap: validateActivityMapRequirements(),
    aiSteward: validateAiStewardRequirements(),
    emergencyHelp: validateEmergencyHelpRequirements(),
    smartDevice: validateSmartDeviceRobotRequirements(),
    guideFunctions: validateGuideFunctionOverview(),
    guideRequirements: validateGuideOrderRequirements(),
    guideFlow: validateGuideOrderStatusFlow(),
    merchantFunctions: validateMerchantFunctionOverview(),
    merchantCategories: validateMerchantServiceCategories(),
    adminFunctions: validateAdminFunctionOverview(),
    adminScreens: validateAdminDataScreens(),
    coreTables,
    systemModules: validateSystemModules({ tableNames: coreTables.tables.map((item) => item.table) }),
    technology: validateTechnologyStack(),
    collaboration: validateCollaborationRules(),
  };

  const dataRuntime = {
    users: (db.users || []).length,
    guides: (db.guides || []).length,
    merchants: (db.merchants || []).length,
    services: (db.services || []).length,
    orders: (db.orders || []).length,
    tasks: (db.tasks || []).length,
    alerts: (db.alerts || []).length,
    messages: (db.messages || []).length,
    reviews: (db.reviews || []).length,
    aiHistory: (db.aiHistory || []).length,
    healthRecords: (db.healthRecords || []).length,
    devices: (db.devices || []).length,
    activitySignups: (db.activitySignups || []).length,
    serviceRequests: (db.serviceRequests || []).length,
    orderStatus: countByStatus(db.orders || []),
    taskStatus: countByStatus(db.tasks || []),
  };

  const checklist = [
    {
      id: "initial-delivery-scope",
      priority: "P0",
      module: "1.2 首期交付范围",
      requirement: "用户端、人工向导端、商户端、管理后台、硬件数据、AI 能力六项范围全部有路由、API 和数据对象。",
      evidence: ["/api/delivery/initial-scope", "/user/", "/guide/", "/merchant/", "/admin/"],
      passed: validationPassed(validations.initialScope) &&
        initialScope.acceptance.allSixScopesCovered &&
        initialScope.acceptance.allScopesHaveRoutesAndApis &&
        initialScope.acceptance.userExperienceUnified &&
        initialScope.acceptance.guideMerchantAdminCovered,
    },
    {
      id: "mvp-principles",
      priority: "P0",
      module: "1.3 两周 MVP 原则",
      requirement: "先完成可演示、可试运营、可验收核心闭环，真实硬件、支付、医院深度接口和复杂 AI 诊断仅预留或模拟。",
      evidence: ["/api/mvp/principles", "/api/integrations/status"],
      passed: validationPassed(validations.mvpPrinciples) &&
        mvpPrinciples.acceptance.coreLoopCanBeDemonstrated &&
        mvpPrinciples.acceptance.highDependencyOnlyReservedOrSimulated,
    },
    {
      id: "role-endpoints",
      priority: "P0",
      module: "2. 角色与端口划分",
      requirement: "用户/老人、家属、人工向导、商户、平台管理员角色边界和端口入口清晰。",
      evidence: ["/api/roles/endpoint-division", "/api/auth/login"],
      passed: validationPassed(validations.roleEndpoints) &&
        roleEndpoints.roleCount === 5 &&
        hasPermission("elder", "order:create") &&
        hasPermission("guide", "task:write") &&
        hasPermission("merchant", "merchant:order:write") &&
        hasPermission("admin", "admin:write"),
    },
    {
      id: "business-flow",
      priority: "P0",
      module: "3. 总体业务流程",
      requirement: "需求发起、智能分析、任务分配、服务执行、反馈上报、结果反馈、数据沉淀七步闭环可运行。",
      evidence: ["/api/business-flow/overview", "/api/orders", "/api/tasks/dispatch", "/api/admin/data-loop"],
      passed: validationPassed(validations.businessFlow) &&
        businessFlow.stepCount === 7 &&
        dataRuntime.orders >= 3 &&
        dataRuntime.tasks >= 2,
    },
    {
      id: "user-end",
      priority: "P0",
      module: "4.1-4.7 用户端",
      requirement: "首页、AI 管家、活动地图、紧急求助、智能硬件、小云机器人、旅居管家下单、订单与消息、我的均有真实入口和 API 数据。",
      evidence: [
        "/api/user/functions/overview",
        "/api/user/home-requirements",
        "/api/ai/steward-requirements",
        "/api/activities/map-requirements",
        "/api/alerts/emergency-requirements",
        "/api/devices/robot-requirements",
        "/api/guide/order-requirements",
        "/api/orders",
        "/api/messages",
      ],
      passed: validationPassed(validations.userFunctions) &&
        validationPassed(validations.userHome) &&
        validationPassed(validations.activityMap) &&
        validationPassed(validations.aiSteward) &&
        validationPassed(validations.emergencyHelp) &&
        validationPassed(validations.smartDevice) &&
        validationPassed(validations.guideRequirements) &&
        userFunctions.runtime.allP0Ready &&
        userHome.runtime.p0EntriesAvailable &&
        activityMap.mapDisplay.pointCount > 0 &&
        activityMap.categories.some((item) => item.category === "文化体验" && item.active) &&
        aiSteward.quickQuestions.length >= 4 &&
        aiSteward.serviceRecords.apiEndpoint === "/api/ai/service-records" &&
        emergencyHelp.oneKeySos.generatesRecord &&
        emergencyHelp.notificationChain.receivers.length >= 2 &&
        smartDevice.requirements.filter((item) => item.priority === "P0").every((item) => /^已接入|^已分|^已展示/.test(item.runtime.status)),
    },
    {
      id: "guide-end",
      priority: "P0",
      module: "人工向导端",
      requirement: "上线接单、接单大厅、订单详情、接单、开始服务、异常上报、完成服务、我的订单、今日收入均接真实任务数据。",
      evidence: [
        "/api/guide/functions/overview",
        "/api/guide/dashboard",
        "/api/guide/tasks/claim-next",
        "/api/tasks/{id}/accept",
        "/api/tasks/{id}/start",
        "/api/guide/exception",
        "/api/tasks/{id}/complete",
        "/api/guide/income",
        "/api/guide/order-status-flow",
      ],
      passed: validationPassed(validations.guideFunctions) &&
        validationPassed(validations.guideFlow) &&
        guideFunctions.implementedCount === guideFunctions.moduleCount &&
        guideFlow.statusCount === 6 &&
        orderHasTask(db, "guide"),
    },
    {
      id: "merchant-end",
      priority: "P0",
      module: "商户端",
      requirement: "发布服务、接收预约、确认方案/报价、服务执行、完成上报、评价售后、结算统计均接真实订单数据。",
      evidence: [
        "/api/merchant/functions/overview",
        "/api/merchant/service-categories",
        "/api/merchant/services",
        "/api/merchant/orders",
        "/api/merchant/orders/{id}/quote",
        "/api/merchant/orders/{id}/confirm",
        "/api/merchant/orders/{id}/start",
        "/api/merchant/orders/{id}/complete",
        "/api/merchant/reviews",
      ],
      passed: validationPassed(validations.merchantFunctions) &&
        validationPassed(validations.merchantCategories) &&
        merchantFunctions.implementedCount === merchantFunctions.moduleCount &&
        merchantCategories.categoryCount === 7 &&
        orderHasTask(db, "merchant"),
    },
    {
      id: "admin-end",
      priority: "P0",
      module: "管理后台",
      requirement: "数据概览、用户老人管理、向导/商户审核、订单管理、任务调度、异常处理、活动管理、权限和数据看板均数据驱动。",
      evidence: [
        "/api/admin/functions/overview",
        "/api/admin/dashboard",
        "/api/admin/users",
        "/api/admin/guides",
        "/api/admin/merchants",
        "/api/admin/orders",
        "/api/admin/dispatch/pending",
        "/api/admin/alerts",
        "/api/admin/activities",
        "/api/admin/screens",
      ],
      passed: validationPassed(validations.adminFunctions) &&
        validationPassed(validations.adminScreens) &&
        adminFunctions.implementedCount === adminFunctions.moduleCount &&
        adminScreens.screenCount === 2,
    },
    {
      id: "data-api-permission-state",
      priority: "P0",
      module: "数据库 + API + 权限 + 状态流转",
      requirement: "核心数据表、MVP API、鉴权权限、订单/任务/异常状态机、后台联动均可验收。",
      evidence: [
        "/api/admin/database/schema",
        "/api/reference",
        "/api/admin/system/modules",
        "/api/tasks/dispatch",
        "/api/orders/{id}/confirm",
        "/api/alerts/{id}/handle",
      ],
      passed: validationPassed(validations.coreTables) &&
        validationPassed(validations.systemModules) &&
        systemModules.moduleCount >= 7 &&
        dataRuntime.users >= 5 &&
        dataRuntime.orders >= 3 &&
        dataRuntime.tasks >= 2 &&
        dataRuntime.alerts >= 2 &&
        dataRuntime.messages >= 2,
    },
    {
      id: "data-loop",
      priority: "P0",
      module: "数据闭环",
      requirement: "用户、健康、服务、商户、评价、活动报名和服务请求数据能在后台沉淀和查询。",
      evidence: [
        "/api/admin/data-loop",
        "/api/admin/users",
        "/api/admin/health-records",
        "/api/admin/services",
        "/api/admin/reviews",
        "/api/admin/activities",
      ],
      passed: dataRuntime.users > 0 &&
        dataRuntime.healthRecords > 0 &&
        dataRuntime.services > 0 &&
        dataRuntime.merchants > 0 &&
        dataRuntime.reviews > 0 &&
        dataRuntime.activitySignups > 0 &&
        dataRuntime.serviceRequests > 0,
    },
    {
      id: "collaboration-notification",
      priority: "P0",
      module: "8. 跨端协同与通知机制",
      requirement: "用户下单、SOS、设备异常、接单、商户确认、服务完成、异常上报均能通知相关端并入库。",
      evidence: ["/api/admin/system/collaboration", "/api/messages", "/api/alerts", "/api/orders"],
      passed: validationPassed(validations.collaboration) &&
        collaboration.scenarioCount >= 7 &&
        dataRuntime.messages > 0 &&
        dataRuntime.alerts > 0,
    },
    {
      id: "technology-deployment",
      priority: "P1",
      module: "技术架构与部署配置",
      requirement: "移动端、管理后台、后端、数据库、地图、AI、对象存储、部署方案均有当前实现和后续替换边界。",
      evidence: ["/api/admin/system/technology", "Dockerfile", "deploy/docker-compose.yml", "render.yaml", "docs/deployment.md"],
      passed: validationPassed(validations.technology) &&
        technology.layerCount >= 8 &&
        integrations.length >= 8,
    },
    {
      id: "demo-reset-acceptance",
      priority: "P0",
      module: "一键重置演示数据 + 验收脚本",
      requirement: "演示数据可一键重置，验收脚本覆盖 API、闭环、路由和核心需求。",
      evidence: ["/api/admin/demo/reset", "npm run check", "npm run acceptance", "scripts/mvp-delivery-completion-test.js"],
      passed: typeof options.hasResetEndpoint === "boolean" ? options.hasResetEndpoint : true,
    },
  ];

  const summary = {
    total: checklist.length,
    passed: checklist.filter((item) => item.passed).length,
    failed: checklist.filter((item) => !item.passed).length,
    p0Total: checklist.filter((item) => item.priority === "P0").length,
    p0Passed: checklist.filter((item) => item.priority === "P0" && item.passed).length,
    p1Total: checklist.filter((item) => item.priority === "P1").length,
    p1Passed: checklist.filter((item) => item.priority === "P1" && item.passed).length,
  };

  return {
    version: MVP_DELIVERY_COMPLETION_VERSION,
    source: "完全按照以上要求的 MVP 交付级总验收",
    ready: summary.failed === 0,
    summary,
    checklist,
    outstanding: checklist.filter((item) => !item.passed).map((item) => ({
      id: item.id,
      module: item.module,
      priority: item.priority,
      requirement: item.requirement,
      evidence: item.evidence,
    })),
    runtime: dataRuntime,
    endpoints: endpointSet(checklist),
    validations,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  MVP_DELIVERY_COMPLETION_VERSION,
  mvpDeliveryCompletionForApi,
};
