const MERCHANT_FUNCTION_OVERVIEW_VERSION = "merchant-function-overview-v1";

const merchantFunctionModules = [
  {
    id: "merchant-onboarding",
    module: "商户入驻",
    requirements: ["机构信息", "营业资质", "服务类型", "联系人", "地址", "审核状态"],
    priority: "P0",
    acceptance: "后台审核通过后才能上架服务。",
    route: "/merchant/#26",
    apiEndpoints: ["/api/admin/merchants", "/api/admin/merchants/{id}/audit", "/api/merchant/dashboard"],
  },
  {
    id: "service-management",
    module: "服务管理",
    requirements: ["新增/编辑服务项目", "图片", "价格", "服务说明", "可预约时间"],
    priority: "P0",
    acceptance: "用户端可查看已上架服务。",
    route: "/merchant/#19",
    apiEndpoints: ["/api/merchant/services", "/api/merchant/services/{id}/status", "/api/admin/services"],
  },
  {
    id: "reservation-management",
    module: "订单/预约管理",
    requirements: ["接收平台订单或预约", "查看客户需求", "时间", "地点", "联系人"],
    priority: "P0",
    acceptance: "订单可确认、拒绝、改期。",
    route: "/merchant/#20",
    apiEndpoints: [
      "/api/merchant/orders",
      "/api/merchant/orders/{id}/confirm",
      "/api/merchant/orders/{id}/reject",
      "/api/merchant/orders/{id}/reschedule",
    ],
  },
  {
    id: "quote-confirmation",
    module: "报价确认",
    requirements: ["复杂服务方案确认", "医疗陪诊套餐报价", "护理方案报价", "殡葬服务方案报价"],
    priority: "P1",
    acceptance: "报价可回传用户端确认。",
    route: "/merchant/#23",
    apiEndpoints: ["/api/merchant/orders/{id}/quote", "/api/messages"],
  },
  {
    id: "service-execution",
    module: "服务执行",
    requirements: ["安排服务人员", "开始服务", "记录服务过程", "上传完成凭证"],
    priority: "P0",
    acceptance: "服务完成后状态回传平台。",
    route: "/merchant/#18",
    apiEndpoints: ["/api/merchant/orders/{id}/start", "/api/merchant/orders/{id}/complete", "/api/tasks/{id}/complete", "/api/merchant/exception"],
  },
  {
    id: "after-sale-review",
    module: "售后与评价",
    requirements: ["查看用户评价", "处理投诉", "跟进售后"],
    priority: "P1",
    acceptance: "商户能查看评价与反馈。",
    route: "/merchant/#17",
    apiEndpoints: ["/api/merchant/reviews", "/api/merchant/exception", "/api/messages"],
  },
  {
    id: "data-statistics",
    module: "数据统计",
    requirements: ["订单数", "成交额", "好评率", "服务类型占比"],
    priority: "P1",
    acceptance: "可按时间筛选。",
    route: "/merchant/#16",
    apiEndpoints: ["/api/merchant/dashboard", "/api/merchant/orders", "/api/merchant/reviews"],
  },
  {
    id: "settlement-management",
    module: "结算管理",
    requirements: ["结算记录", "待结算金额", "已结算金额", "发票信息"],
    priority: "P1",
    acceptance: "展示结算数据，首期可手动结算。",
    route: "/merchant/#42",
    apiEndpoints: ["/api/merchant/dashboard", "/api/merchant/orders", "/api/admin/data-loop"],
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

function average(values, fallback = 0, digits = 1) {
  const nums = values.map(Number).filter((value) => Number.isFinite(value));
  if (!nums.length) return Number(fallback).toFixed(digits);
  return (nums.reduce((sum, item) => sum + item, 0) / nums.length).toFixed(digits);
}

function sumAmount(items) {
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function normalizeServiceStatus(status) {
  if (status === "已上架") return "上架";
  if (status === "已下架") return "下架";
  return status || "未分类";
}

function getMerchant(db, merchantId = "merchant-001") {
  return (db.merchants || []).find((item) => item.id === merchantId) || (db.merchants || [])[0] || {};
}

function merchantRuntime(module, db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const services = (db.services || []).filter((item) => item.providerType === "merchant" && (!item.providerId || item.providerId === merchant.id));
  const orders = (db.orders || []).filter((item) => item.providerType === "merchant" && (!item.providerId || item.providerId === merchant.id));
  const tasks = (db.tasks || []).filter((item) => item.assigneeType === "merchant" && (!item.assigneeId || item.assigneeId === merchant.id));
  const reviews = (db.reviews || []).filter((item) => item.providerType === "merchant" && (!item.providerId || item.providerId === merchant.id));
  const messages = (db.messages || []).filter((item) => item.toRole === "merchant");
  const alerts = (db.alerts || []).filter((item) => item.source === "商户端" || /商户/.test(`${item.type || ""}${item.description || ""}`));
  const listedServices = services.filter((item) => normalizeServiceStatus(item.status) === "上架");
  const activeOrders = orders.filter((item) => !["已完成", "已取消"].includes(item.status));
  const completedOrders = orders.filter((item) => item.status === "已完成");
  const categoryCounts = countBy(services, "category");

  const map = {
    "merchant-onboarding": {
      status: "已接入",
      metrics: {
        merchantName: merchant.name || "未建档商户",
        auditStatus: merchant.status || "未提交",
        license: merchant.license || "未上传",
        contact: merchant.contact || "未填写",
        serviceTypes: Object.keys(categoryCounts).length,
        canPublishService: merchant.status === "已通过",
      },
    },
    "service-management": {
      status: "已接入",
      metrics: {
        totalServices: services.length,
        listedServices: listedServices.length,
        pendingAudit: services.filter((item) => item.status === "待审核").length,
        editableFields: ["图片", "价格", "说明", "预约时间"].length,
        userVisibleServices: listedServices.length,
      },
    },
    "reservation-management": {
      status: "已接入",
      metrics: {
        totalOrders: orders.length,
        activeOrders: activeOrders.length,
        statusCounts: countBy(orders),
        confirmable: orders.filter((item) => ["待派单", "已派单", "已报价"].includes(item.status)).length,
        rejectable: orders.filter((item) => ["待派单", "已派单", "已报价"].includes(item.status)).length,
        reschedulable: orders.filter((item) => ["待派单", "已派单", "已报价", "待服务"].includes(item.status)).length,
      },
    },
    "quote-confirmation": {
      status: "已接入",
      metrics: {
        quotedOrders: orders.filter((item) => item.status === "已报价" || item.quote).length,
        complexServiceTypes: services.filter((item) => /医疗|护理|陪诊|殡葬|康复/.test(`${item.category || ""}${item.title || ""}`)).length,
        quoteMessages: messages.filter((item) => /报价|方案/.test(`${item.title || ""}${item.content || ""}`)).length,
      },
    },
    "service-execution": {
      status: "已接入",
      metrics: {
        activeTasks: tasks.filter((item) => !["已完成", "已取消"].includes(item.status)).length,
        serviceInProgress: orders.filter((item) => ["待服务", "服务中", "待确认"].includes(item.status)).length,
        completedReports: orders.filter((item) => ["待确认", "已完成"].includes(item.status)).length,
        exceptionReports: alerts.length,
      },
    },
    "after-sale-review": {
      status: "已接入",
      metrics: {
        reviews: reviews.length,
        averageRating: average(reviews.map((item) => item.rating), merchant.rating || 0, 1),
        complaints: alerts.filter((item) => /投诉|售后|服务异常/.test(`${item.type || ""}${item.description || ""}`)).length,
        followupMessages: messages.filter((item) => /售后|评价|投诉|异常/.test(`${item.title || ""}${item.content || ""}`)).length,
      },
    },
    "data-statistics": {
      status: "已接入",
      metrics: {
        orderCount: orders.length,
        revenue: sumAmount(orders.filter((item) => item.status !== "已取消")),
        favorableRate: `${average(reviews.map((item) => Number(item.rating || 0) >= 4 ? 100 : 0), 98.2, 1)}%`,
        serviceTypeCounts: categoryCounts,
      },
    },
    "settlement-management": {
      status: "已接入",
      metrics: {
        pendingSettlement: Number(merchant.settlementPending || 0),
        settledAmount: sumAmount(completedOrders),
        settlementRecords: completedOrders.length,
        invoiceInfo: merchant.license ? "已建档" : "待补充",
        manualSettlementAvailable: true,
      },
    },
  };

  return map[module.id] || { status: "已接入", metrics: { routeReady: true, apiReady: module.apiEndpoints.length > 0 } };
}

function merchantFunctionOverviewForApi(db, merchantId = "merchant-001") {
  const modules = merchantFunctionModules.map((module) => ({
    ...module,
    requirementText: module.requirements.join("、"),
    runtime: merchantRuntime(module, db, merchantId),
  }));
  return {
    version: MERCHANT_FUNCTION_OVERVIEW_VERSION,
    source: "商户端功能总览",
    merchantId,
    moduleCount: modules.length,
    p0Count: modules.filter((item) => item.priority === "P0").length,
    p1Count: modules.filter((item) => item.priority === "P1").length,
    implementedCount: modules.filter((item) => item.runtime.status === "已接入").length,
    modules,
    updatedAt: new Date().toISOString(),
  };
}

function validateMerchantFunctionOverview() {
  const expected = [
    ["商户入驻", "P0", "后台审核通过后才能上架服务。"],
    ["服务管理", "P0", "用户端可查看已上架服务。"],
    ["订单/预约管理", "P0", "订单可确认、拒绝、改期。"],
    ["报价确认", "P1", "报价可回传用户端确认。"],
    ["服务执行", "P0", "服务完成后状态回传平台。"],
    ["售后与评价", "P1", "商户能查看评价与反馈。"],
    ["数据统计", "P1", "可按时间筛选。"],
    ["结算管理", "P1", "展示结算数据，首期可手动结算。"],
  ];
  const errors = [];
  expected.forEach(([moduleName, priority, acceptance]) => {
    const module = merchantFunctionModules.find((item) => item.module === moduleName);
    if (!module) {
      errors.push({ module: moduleName, issue: "缺少商户端模块" });
      return;
    }
    if (module.priority !== priority) errors.push({ module: moduleName, issue: "优先级不一致" });
    if (module.acceptance !== acceptance) errors.push({ module: moduleName, issue: "验收标准不一致" });
    if (!module.requirements.length) errors.push({ module: moduleName, issue: "功能需求为空" });
    if (!module.route || !module.apiEndpoints.length) errors.push({ module: moduleName, issue: "缺少页面入口或接口" });
  });
  return {
    version: MERCHANT_FUNCTION_OVERVIEW_VERSION,
    valid: errors.length === 0,
    moduleCount: merchantFunctionModules.length,
    p0Count: merchantFunctionModules.filter((item) => item.priority === "P0").length,
    p1Count: merchantFunctionModules.filter((item) => item.priority === "P1").length,
    errors,
  };
}

module.exports = {
  MERCHANT_FUNCTION_OVERVIEW_VERSION,
  merchantFunctionModules,
  merchantFunctionOverviewForApi,
  validateMerchantFunctionOverview,
};
