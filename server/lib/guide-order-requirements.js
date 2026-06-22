const GUIDE_ORDER_REQUIREMENTS_VERSION = "4.7-steward-guide-order-requirements-v1";

const guideOrderRequirements = [
  {
    id: "medical-companion",
    category: "陪伴就医",
    description: "挂号取号、陪同就诊、检查缴费、取药等",
    orderFields: ["服务时间", "医院", "老人信息", "备注"],
    priority: "P0",
    aliases: ["陪诊", "就医陪同", "挂号取号", "陪同就诊"],
    fieldSpecs: [
      { key: "serviceTime", label: "服务时间", sources: ["serviceTime", "time"], defaultText: "待与向导确认" },
      { key: "hospital", label: "医院", sources: ["hospital", "location"], defaultText: "待补充医院" },
      { key: "elderInfo", label: "老人信息", sources: ["elderInfo", "elderName"], defaultFrom: "elderName" },
      { key: "remark", label: "备注", sources: ["remark", "note"], defaultText: "挂号取号、陪同检查、取药提醒" },
    ],
    defaultAmount: 120,
    icon: "briefcase-medical",
    route: "/user/#order-submit",
  },
  {
    id: "tour-guide",
    category: "导游游览",
    description: "景点讲解、路线规划、拍照陪同、行程安排",
    orderFields: ["目的地", "时间", "人数", "交通需求"],
    priority: "P0",
    aliases: ["景点讲解", "路线规划", "拍照陪同", "行程安排"],
    fieldSpecs: [
      { key: "destination", label: "目的地", sources: ["destination", "location"], defaultText: "待补充目的地" },
      { key: "appointmentTime", label: "时间", sources: ["appointmentTime", "time"], defaultText: "待与向导确认" },
      { key: "peopleCount", label: "人数", sources: ["peopleCount", "count"], defaultText: "1" },
      { key: "transportNeed", label: "交通需求", sources: ["transportNeed", "trafficNeed", "note"], defaultText: "无特殊交通需求" },
    ],
    defaultAmount: 120,
    icon: "palmtree",
    route: "/user/#order-submit",
  },
  {
    id: "nursing-care",
    category: "护工护理",
    description: "日常照护、康复协助、陪伴护理、生活照料",
    orderFields: ["护理时长", "护理要求", "健康备注"],
    priority: "P0",
    aliases: ["日常照护", "康复协助", "陪伴护理", "生活照料"],
    fieldSpecs: [
      { key: "careDuration", label: "护理时长", sources: ["careDuration", "duration"], defaultText: "2小时" },
      { key: "careRequirement", label: "护理要求", sources: ["careRequirement", "note"], defaultText: "日常照护、康复协助" },
      { key: "healthNote", label: "健康备注", sources: ["healthNote", "healthRemark"], defaultFrom: "healthNote" },
    ],
    defaultAmount: 130,
    icon: "user-round-check",
    route: "/user/#order-submit",
  },
  {
    id: "transport-companion",
    category: "接送出行",
    description: "机场/高铁站接送、日常出行、代驾陪同",
    orderFields: ["起点", "终点", "时间", "人数"],
    priority: "P1",
    aliases: ["交通接送", "接送站", "日常出行", "代驾陪同"],
    fieldSpecs: [
      { key: "startPoint", label: "起点", sources: ["startPoint", "from", "origin"], defaultFrom: "address" },
      { key: "endPoint", label: "终点", sources: ["endPoint", "to", "destination", "location"], defaultText: "待补充终点" },
      { key: "appointmentTime", label: "时间", sources: ["appointmentTime", "time"], defaultText: "待与向导确认" },
      { key: "peopleCount", label: "人数", sources: ["peopleCount", "count"], defaultText: "1" },
    ],
    defaultAmount: 120,
    icon: "car",
    route: "/user/#order-submit",
  },
  {
    id: "agency-service",
    category: "帮办代办",
    description: "证件办理、业务代办、生活缴费、快递代取",
    orderFields: ["代办事项", "材料", "时间"],
    priority: "P1",
    aliases: ["证件办理", "业务代办", "生活缴费", "快递代取"],
    fieldSpecs: [
      { key: "agencyItem", label: "代办事项", sources: ["agencyItem", "matter", "note"], defaultText: "代办事项待确认" },
      { key: "materials", label: "材料", sources: ["materials", "documents"], defaultText: "按实际事项准备" },
      { key: "appointmentTime", label: "时间", sources: ["appointmentTime", "time"], defaultText: "待与向导确认" },
    ],
    defaultAmount: 90,
    icon: "clipboard-list",
    route: "/user/#order-submit",
  },
  {
    id: "life-companion",
    category: "生活陪伴",
    description: "聊天解闷、散步购物、棋牌娱乐、情感陪伴",
    orderFields: ["服务地点", "时长", "需求说明"],
    priority: "P1",
    aliases: ["聊天解闷", "散步购物", "棋牌娱乐", "情感陪伴"],
    fieldSpecs: [
      { key: "serviceLocation", label: "服务地点", sources: ["serviceLocation", "location"], defaultFrom: "address" },
      { key: "duration", label: "时长", sources: ["duration", "careDuration"], defaultText: "2小时" },
      { key: "requirementNote", label: "需求说明", sources: ["requirementNote", "note"], defaultText: "陪伴聊天、散步购物" },
    ],
    defaultAmount: 80,
    icon: "heart-handshake",
    route: "/user/#order-submit",
  },
];

function compact(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function includesAny(text, words = []) {
  return words.some((word) => word && text.includes(word));
}

function matchGuideOrderRequirement(serviceType = "") {
  const text = compact(serviceType);
  if (!text) return null;
  return (
    guideOrderRequirements.find((item) => item.category === text) ||
    guideOrderRequirements.find((item) => includesAny(text, item.aliases) || includesAny(`${item.category} ${item.description}`, [text]))
  );
}

function defaultValueForField(field, body = {}, db = {}) {
  if (field.defaultFrom === "elderName") return compact(body.elderName) || compact(db.elderProfile?.name) || "李秀兰";
  if (field.defaultFrom === "address") return compact(db.elderProfile?.address) || compact(body.location) || "待补充服务地点";
  if (field.defaultFrom === "healthNote") return compact(db.elderProfile?.chronicDisease) || compact(db.elderProfile?.healthNote) || "无特殊健康备注";
  return compact(field.defaultText);
}

function normalizeGuideOrderFields(body = {}, db = {}, requirement = matchGuideOrderRequirement(body.serviceType), options = {}) {
  if (!requirement) return { requirement: null, fields: {}, missingFields: [], fieldText: "" };
  const fillDefaults = options.fillDefaults !== false;
  const fields = {};
  const missingFields = [];

  requirement.fieldSpecs.forEach((field) => {
    const rawValue = field.sources.map((source) => compact(body[source])).find(Boolean);
    if (!rawValue) missingFields.push({ key: field.key, label: field.label });
    fields[field.key] = rawValue || (fillDefaults ? defaultValueForField(field, body, db) : "");
  });

  return {
    requirement,
    fields,
    missingFields,
    fieldText: requirement.orderFields.join("、"),
  };
}

function orderLocationFromRequirement(normalized = {}, body = {}, db = {}) {
  const fields = normalized.fields || {};
  return (
    compact(body.location) ||
    compact(fields.hospital) ||
    compact(fields.destination) ||
    compact(fields.endPoint) ||
    compact(fields.serviceLocation) ||
    compact(fields.startPoint) ||
    compact(db.elderProfile?.address) ||
    "待补充服务地点"
  );
}

function orderTimeFromRequirement(normalized = {}, body = {}) {
  const fields = normalized.fields || {};
  return compact(body.time) || compact(fields.serviceTime) || compact(fields.appointmentTime) || "待与向导确认";
}

function runtimeForRequirement(requirement, db = {}) {
  const orders = (db.orders || []).filter((order) => matchGuideOrderRequirement(order.serviceType)?.id === requirement.id);
  const activeOrders = orders.filter((order) => !["已完成", "已取消"].includes(order.status));
  return {
    status: "已接入订单创建",
    orderCount: orders.length,
    activeOrderCount: activeOrders.length,
    taskCount: (db.tasks || []).filter((task) => orders.some((order) => order.id === task.orderId)).length,
    acceptance: "用户下单后进入后台待派单，指派人工向导后进入向导任务列表。",
  };
}

function guideOrderRequirementsForApi(db = {}) {
  const categories = guideOrderRequirements.map((item) => ({
    id: item.id,
    category: item.category,
    description: item.description,
    orderFields: item.orderFields,
    fieldText: item.orderFields.join("、"),
    priority: item.priority,
    aliases: item.aliases,
    fieldSpecs: item.fieldSpecs.map(({ key, label, sources }) => ({ key, label, sources })),
    defaultAmount: item.defaultAmount,
    icon: item.icon,
    route: item.route,
    apiEndpoints: ["/api/guide/order-requirements", "/api/orders", "/api/admin/dispatch/pending", "/api/tasks/dispatch", "/api/guide/dashboard"],
    runtime: runtimeForRequirement(item, db),
  }));
  return {
    version: GUIDE_ORDER_REQUIREMENTS_VERSION,
    source: "4.7 旅居管家与人工向导下单需求",
    categoryCount: categories.length,
    p0Count: categories.filter((item) => item.priority === "P0").length,
    p1Count: categories.filter((item) => item.priority === "P1").length,
    categories,
    updatedAt: new Date().toISOString(),
  };
}

function validateGuideOrderRequirements() {
  const expectedRows = [
    ["陪伴就医", "挂号取号、陪同就诊、检查缴费、取药等", "服务时间、医院、老人信息、备注", "P0"],
    ["导游游览", "景点讲解、路线规划、拍照陪同、行程安排", "目的地、时间、人数、交通需求", "P0"],
    ["护工护理", "日常照护、康复协助、陪伴护理、生活照料", "护理时长、护理要求、健康备注", "P0"],
    ["接送出行", "机场/高铁站接送、日常出行、代驾陪同", "起点、终点、时间、人数", "P1"],
    ["帮办代办", "证件办理、业务代办、生活缴费、快递代取", "代办事项、材料、时间", "P1"],
    ["生活陪伴", "聊天解闷、散步购物、棋牌娱乐、情感陪伴", "服务地点、时长、需求说明", "P1"],
  ];
  const errors = [];

  expectedRows.forEach(([category, description, fieldText, priority], index) => {
    const item = guideOrderRequirements[index];
    if (!item) {
      errors.push({ category, issue: "缺少服务分类" });
      return;
    }
    if (item.category !== category) errors.push({ category, issue: "服务分类不一致" });
    if (item.description !== description) errors.push({ category, issue: "功能描述不一致" });
    if (item.orderFields.join("、") !== fieldText) errors.push({ category, issue: "订单字段不一致" });
    if (item.priority !== priority) errors.push({ category, issue: "优先级不一致" });
    if (!item.route || !item.fieldSpecs.length) errors.push({ category, issue: "缺少下单入口或字段规格" });
  });
  if (guideOrderRequirements.length !== expectedRows.length) {
    errors.push({ category: "全部", issue: "服务分类数量不一致" });
  }

  return {
    version: GUIDE_ORDER_REQUIREMENTS_VERSION,
    valid: errors.length === 0,
    categoryCount: guideOrderRequirements.length,
    errors,
  };
}

module.exports = {
  GUIDE_ORDER_REQUIREMENTS_VERSION,
  guideOrderRequirements,
  guideOrderRequirementsForApi,
  matchGuideOrderRequirement,
  normalizeGuideOrderFields,
  orderLocationFromRequirement,
  orderTimeFromRequirement,
  validateGuideOrderRequirements,
};
