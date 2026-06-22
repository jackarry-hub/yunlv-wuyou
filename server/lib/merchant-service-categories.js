const MERCHANT_SERVICE_CATEGORIES_VERSION = "6.1-merchant-service-categories-v1";

const merchantServiceCategories = [
  {
    id: "medical-health",
    category: "医疗卫生",
    examples: ["体检", "问诊预约", "陪诊协作", "康复建议", "附近医院服务"],
    note: "仅做预约与服务协调，不提供医疗诊断结论。",
    qualification: "医疗服务协作资质或合作机构备案",
    icon: "briefcase-medical",
    color: "blue",
    route: "/merchant/#31",
    apiEndpoints: ["/api/merchant/service-categories", "/api/merchant/services", "/api/admin/services"],
    keywords: ["医疗", "医院", "陪诊", "问诊", "体检", "康复"],
  },
  {
    id: "care-nursing",
    category: "康养护理",
    examples: ["护工护理", "康复理疗", "上门护理", "慢病管理服务"],
    note: "需商户资质审核。",
    qualification: "护理服务资质、人员健康证或相关备案",
    icon: "user-round-check",
    color: "green",
    route: "/merchant/#31",
    apiEndpoints: ["/api/merchant/service-categories", "/api/merchant/services", "/api/admin/merchants"],
    keywords: ["康养", "护理", "康复", "慢病", "照护"],
  },
  {
    id: "life-service",
    category: "生活服务",
    examples: ["家政", "洗衣", "保洁", "维修", "代购代办"],
    note: "可标准化套餐。",
    qualification: "基础商户认证",
    icon: "house",
    color: "orange",
    route: "/merchant/#31",
    apiEndpoints: ["/api/merchant/service-categories", "/api/merchant/services", "/api/services"],
    keywords: ["家政", "洗衣", "保洁", "维修", "代购", "代办", "生活"],
  },
  {
    id: "transport",
    category: "交通出行",
    examples: ["接送站", "包车", "代驾", "无障碍出行"],
    note: "需司机/车辆资质。",
    qualification: "司机、车辆、保险等出行服务资质",
    icon: "car",
    color: "blue",
    route: "/merchant/#31",
    apiEndpoints: ["/api/merchant/service-categories", "/api/merchant/services", "/api/admin/merchants"],
    keywords: ["交通", "出行", "接送", "包车", "代驾", "车辆", "司机"],
  },
  {
    id: "culture-tourism",
    category: "文旅体验",
    examples: ["景区门票", "讲解", "活动课程", "旅拍", "非遗体验"],
    note: "与活动地图联动。",
    qualification: "活动或文旅服务备案",
    icon: "palmtree",
    color: "purple",
    route: "/merchant/#31",
    apiEndpoints: ["/api/merchant/service-categories", "/api/activities/map", "/api/admin/activities"],
    keywords: ["文旅", "景区", "讲解", "活动", "课程", "旅拍", "非遗", "文化", "旅游"],
  },
  {
    id: "food-local",
    category: "餐饮与本地美食",
    examples: ["餐厅预订", "营养餐", "特色美食推荐"],
    note: "可结合老人饮食偏好。",
    qualification: "餐饮经营或合作商户资质",
    icon: "utensils",
    color: "orange",
    route: "/merchant/#31",
    apiEndpoints: ["/api/merchant/service-categories", "/api/merchant/services", "/api/elder/profile"],
    keywords: ["餐饮", "美食", "餐厅", "营养", "饮食"],
  },
  {
    id: "funeral-care",
    category: "殡葬服务",
    examples: ["咨询", "预约", "方案服务", "后续关怀"],
    note: "需谨慎合规，避免强推，页面表达要克制。",
    qualification: "殡葬服务经营许可或合规合作机构",
    icon: "flower-2",
    color: "gray",
    route: "/merchant/#31",
    apiEndpoints: ["/api/merchant/service-categories", "/api/merchant/services", "/api/admin/services"],
    keywords: ["殡葬", "关怀", "咨询", "方案"],
  },
];

const expectedRows = [
  ["医疗卫生", "体检、问诊预约、陪诊协作、康复建议、附近医院服务", "仅做预约与服务协调，不提供医疗诊断结论。"],
  ["康养护理", "护工护理、康复理疗、上门护理、慢病管理服务", "需商户资质审核。"],
  ["生活服务", "家政、洗衣、保洁、维修、代购代办", "可标准化套餐。"],
  ["交通出行", "接送站、包车、代驾、无障碍出行", "需司机/车辆资质。"],
  ["文旅体验", "景区门票、讲解、活动课程、旅拍、非遗体验", "与活动地图联动。"],
  ["餐饮与本地美食", "餐厅预订、营养餐、特色美食推荐", "可结合老人饮食偏好。"],
  ["殡葬服务", "咨询、预约、方案服务、后续关怀", "需谨慎合规，避免强推，页面表达要克制。"],
];

function includesAny(text, words) {
  return words.some((word) => word && text.includes(word));
}

function normalizeStatus(status) {
  if (status === "已上架") return "上架";
  return status || "未分类";
}

function serviceMatchesCategory(service, category) {
  const text = `${service.category || ""} ${service.title || ""} ${service.description || ""}`;
  return service.category === category.category || includesAny(text, [...category.examples, ...category.keywords]);
}

function activityMatchesCategory(activity, category) {
  if (category.id !== "culture-tourism") return false;
  const text = `${activity.category || ""} ${activity.title || ""} ${activity.location || ""}`;
  return includesAny(text, category.keywords);
}

function categoryRuntime(category, db = {}) {
  const services = (db.services || []).filter((service) => service.providerType === "merchant" && serviceMatchesCategory(service, category));
  const listedServices = services.filter((service) => normalizeStatus(service.status) === "上架");
  const pendingAudit = services.filter((service) => service.status === "待审核");
  const merchants = (db.merchants || []).filter((merchant) => merchant.status === "已通过");
  const linkedActivities = (db.activities || []).filter((activity) => activityMatchesCategory(activity, category));
  const examplesCovered = category.examples.filter((example) => {
    const exampleText = example.replace(/服务$/, "");
    return services.some((service) => includesAny(`${service.title || ""} ${service.description || ""}`, [example, exampleText]));
  });
  return {
    status: "已接入",
    serviceCount: services.length,
    listedServiceCount: listedServices.length,
    pendingAuditCount: pendingAudit.length,
    qualifiedMerchantCount: merchants.length,
    activityMapLinked: category.id === "culture-tourism" ? linkedActivities.length : 0,
    examplesCovered,
    examplesUncovered: category.examples.filter((example) => !examplesCovered.includes(example)),
    userVisible: listedServices.length > 0 || category.id === "culture-tourism",
    statusText: services.length ? `已接入 ${services.length} 项商户服务` : "分类已建档，等待商户发布服务",
  };
}

function merchantServiceCategoriesForApi(db = {}) {
  const categories = merchantServiceCategories.map((category) => ({
    ...category,
    examplesText: category.examples.join("、"),
    requirementText: `${category.category}：${category.examples.join("、")}`,
    runtime: categoryRuntime(category, db),
  }));
  return {
    version: MERCHANT_SERVICE_CATEGORIES_VERSION,
    source: "6.1 商户服务分类建议",
    categoryCount: categories.length,
    categories,
    updatedAt: new Date().toISOString(),
  };
}

function validateMerchantServiceCategories() {
  const errors = [];
  expectedRows.forEach(([categoryName, examplesText, note], index) => {
    const category = merchantServiceCategories[index];
    if (!category) {
      errors.push({ category: categoryName, issue: "缺少分类" });
      return;
    }
    if (category.category !== categoryName) errors.push({ category: categoryName, issue: "大类名称不一致" });
    if (category.examples.join("、") !== examplesText) errors.push({ category: categoryName, issue: "示例服务不一致" });
    if (category.note !== note) errors.push({ category: categoryName, issue: "备注不一致" });
    if (!category.route || !category.apiEndpoints.includes("/api/merchant/service-categories")) {
      errors.push({ category: categoryName, issue: "缺少页面入口或分类接口" });
    }
  });
  if (merchantServiceCategories.length !== expectedRows.length) {
    errors.push({ category: "全部", issue: "分类数量不一致" });
  }
  return {
    version: MERCHANT_SERVICE_CATEGORIES_VERSION,
    valid: errors.length === 0,
    categoryCount: merchantServiceCategories.length,
    errors,
  };
}

module.exports = {
  MERCHANT_SERVICE_CATEGORIES_VERSION,
  merchantServiceCategories,
  merchantServiceCategoriesForApi,
  validateMerchantServiceCategories,
};
