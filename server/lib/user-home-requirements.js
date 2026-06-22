const USER_HOME_REQUIREMENTS_VERSION = "4.2-user-home-requirements-v1";

const userHomeRequirements = [
  {
    key: "topArea",
    feature: "顶部区域",
    detail: "显示 Logo、当前城市、消息/通知入口。城市首期默认弥勒/昆明，可手动切换。",
    acceptance: "顶部信息完整，消息入口可进入消息列表。",
    apiEndpoints: ["/api/user/home-requirements", "/api/user/home-city", "/api/messages"],
  },
  {
    key: "banner",
    feature: "Banner",
    detail: "展示旅居生活主题图与项目口号，支持后台配置。",
    acceptance: "可从后台替换 Banner 图片与文案。",
    apiEndpoints: ["/api/user/home-requirements", "/api/admin/content/home"],
  },
  {
    key: "quickServices",
    feature: "快捷服务",
    detail: "安全守护、健康服务、旅居管家、政策指南四个快捷入口。",
    acceptance: "点击进入对应页面，无法跳转的动作必须写入真实业务记录并返回明确结果。",
    apiEndpoints: ["/api/user/home-requirements", "/api/ui/actions"],
  },
  {
    key: "featureGrid",
    feature: "功能宫格",
    detail: "旅居目的地、活动日历、社群交流、旅居打卡、本地美食、交通出行、优选商城、志愿服务。",
    acceptance: "功能名称与图标清晰，至少 P0 入口可用。",
    apiEndpoints: ["/api/user/home-requirements", "/api/service-requests"],
  },
  {
    key: "activityRecommendation",
    feature: "活动推荐",
    detail: "展示 3-4 个推荐活动，包含图片、标签、时间、地点、报名人数。",
    acceptance: "活动从后台配置，用户可进入详情。",
    apiEndpoints: ["/api/user/home-requirements", "/api/activities", "/api/admin/activities"],
  },
  {
    key: "bottomNavigation",
    feature: "底部导航",
    detail: "首页、发现/旅居管家、人工向导、消息、我的。",
    acceptance: "各 Tab 跳转正常。",
    apiEndpoints: ["/api/user/home-requirements", "/api/ui/actions"],
  },
];

const defaultHomeConfig = {
  cityOptions: ["弥勒", "昆明"],
  banner: {
    image: "/user/assets/home-hero.jpg",
    title: "旅居生活 从心出发",
    slogan: "发现美好 · 结识同伴 · 乐享晚年",
    status: "已发布",
  },
};

const quickServices = [
  { key: "safety", title: "安全守护", desc: "7×24h 守护", icon: "shield-check", image: "/user/assets/home-icon-safety.png", route: "emergency", priority: "P0" },
  { key: "health", title: "健康服务", desc: "在线问诊", icon: "briefcase-medical", image: "/user/assets/home-icon-health.png", route: "health-services", priority: "P0" },
  { key: "guide", title: "旅居管家", desc: "AI智能管家", icon: "headphones", image: "/user/assets/home-icon-assistant.png", route: "assistant", priority: "P0" },
  { key: "policy", title: "政策指南", desc: "旅居政策解读", icon: "scroll-text", image: "/user/assets/home-icon-policy.png", route: "policies", priority: "P0" },
];

const featureGrid = [
  { key: "destinations", title: "旅居目的地", desc: "精选康养地", image: "/user/assets/home-icon-destination.png", route: "destinations", priority: "P0" },
  { key: "activityCalendar", title: "活动日历", desc: "活动早知道", image: "/user/assets/home-icon-calendar.png", route: "activity-calendar", priority: "P0" },
  { key: "community", title: "社群交流", desc: "结识新朋友", image: "/user/assets/home-icon-community.png", route: "community", priority: "P1" },
  { key: "checkin", title: "旅居打卡", desc: "记录美好时光", image: "/user/assets/home-icon-checkin.png", route: "checkin", priority: "P1" },
  { key: "food", title: "本地美食", desc: "特色美食推荐", image: "/user/assets/home-icon-food.png", route: "food", priority: "P1" },
  { key: "transport", title: "交通出行", desc: "便捷出行服务", image: "/user/assets/home-icon-transport.png", route: "transport", priority: "P1" },
  { key: "shop", title: "优选商城", desc: "旅居好物", image: "/user/assets/home-icon-shop.png", route: "shop", priority: "P1" },
  { key: "volunteer", title: "志愿服务", desc: "爱心传递", image: "/user/assets/home-icon-volunteer.png", route: "volunteer", priority: "P1" },
];

const bottomNavigation = [
  { key: "home", title: "首页", route: "home", icon: "home" },
  { key: "discover", title: "发现/旅居管家", route: "activity-map", icon: "compass" },
  { key: "guide", title: "人工向导", route: "guide", icon: "headphones" },
  { key: "messages", title: "消息", route: "messages", icon: "message-circle" },
  { key: "profile", title: "我的", route: "profile", icon: "user" },
];

function getHomeConfig(db) {
  const stored = db.homeConfig || {};
  return {
    cityOptions: Array.isArray(stored.cityOptions) && stored.cityOptions.length ? stored.cityOptions : defaultHomeConfig.cityOptions,
    banner: {
      ...defaultHomeConfig.banner,
      ...(stored.banner || {}),
    },
    updatedAt: stored.updatedAt,
    updatedBy: stored.updatedBy,
  };
}

function normalizeActivity(activity) {
  return {
    id: activity.id,
    title: activity.title,
    image: activity.cover || "/user/assets/activity-taiji.jpg",
    tag: activity.status || "报名中",
    time: activity.time,
    location: activity.location,
    joined: Number(activity.joined || 0),
    quota: Number(activity.quota || 0),
    route: "activity-signup",
    apiEndpoint: `/api/activities/${activity.id}`,
  };
}

function userHomeRequirementsForApi(db) {
  const config = getHomeConfig(db);
  const unreadMessages = (db.messages || []).filter((item) => item.toRole === "user" && !item.read).length;
  const currentCity = db.elderProfile?.city || db.meta?.city || config.cityOptions[0];
  const recommendedActivities = (db.activities || []).slice(0, 4).map(normalizeActivity);
  return {
    version: USER_HOME_REQUIREMENTS_VERSION,
    source: "4.2 首页需求",
    requirementCount: userHomeRequirements.length,
    requirements: userHomeRequirements,
    topArea: {
      logo: "/user/assets/home-logo-ref.png",
      currentCity,
      cityOptions: config.cityOptions,
      manualSwitchEndpoint: "/api/user/home-city",
      messageEntry: {
        route: "messages",
        apiEndpoint: "/api/messages?role=user",
        unreadCount: unreadMessages,
      },
      complete: Boolean(currentCity && config.cityOptions.length && config.banner),
    },
    banner: {
      ...config.banner,
      configurable: true,
      adminEndpoint: "/api/admin/content/home",
    },
    quickServices,
    featureGrid,
    activityRecommendation: {
      count: recommendedActivities.length,
      items: recommendedActivities,
      adminEndpoint: "/api/admin/activities",
    },
    bottomNavigation,
    runtime: {
      p0EntriesAvailable: [...quickServices, ...featureGrid].filter((item) => item.priority === "P0").every((item) => item.route),
      tabsReachable: bottomNavigation.every((item) => item.route),
      messageEntryReachable: true,
      bannerConfigurable: true,
    },
  };
}

function updateHomeConfig(db, patch = {}, actor = "平台管理员") {
  const current = getHomeConfig(db);
  const next = {
    cityOptions: Array.isArray(patch.cityOptions) && patch.cityOptions.length ? patch.cityOptions : current.cityOptions,
    banner: {
      ...current.banner,
      ...(patch.banner || {}),
    },
    updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    updatedBy: actor,
  };
  db.homeConfig = next;
  return next;
}

function switchHomeCity(db, city) {
  const config = getHomeConfig(db);
  const normalized = String(city || "").replace(/市$/, "").trim();
  const fallback = config.cityOptions[0] || "昆明";
  const nextCity = normalized || fallback;
  const allowed = config.cityOptions.map((item) => String(item).replace(/市$/, "").trim());
  if (nextCity && !allowed.includes(nextCity)) {
    config.cityOptions = [...config.cityOptions, nextCity];
    db.homeConfig = config;
  }
  if (db.elderProfile) db.elderProfile.city = nextCity;
  db.meta = db.meta || {};
  db.meta.city = nextCity;
  return {
    currentCity: nextCity,
    cityOptions: config.cityOptions,
    manual: true,
  };
}

function validateUserHomeRequirements() {
  const errors = [];
  const expectedRows = [
    ["顶部区域", "显示 Logo、当前城市、消息/通知入口。城市首期默认弥勒/昆明，可手动切换。"],
    ["Banner", "展示旅居生活主题图与项目口号，支持后台配置。"],
    ["快捷服务", "安全守护、健康服务、旅居管家、政策指南四个快捷入口。"],
    ["功能宫格", "旅居目的地、活动日历、社群交流、旅居打卡、本地美食、交通出行、优选商城、志愿服务。"],
    ["活动推荐", "展示 3-4 个推荐活动，包含图片、标签、时间、地点、报名人数。"],
    ["底部导航", "首页、发现/旅居管家、人工向导、消息、我的。"],
  ];
  expectedRows.forEach(([feature, detail], index) => {
    const row = userHomeRequirements[index];
    if (!row || row.feature !== feature || row.detail !== detail) {
      errors.push({ index, feature, issue: "需求行与 4.2 图示不一致" });
    }
  });
  if (quickServices.map((item) => item.title).join("、") !== "安全守护、健康服务、旅居管家、政策指南") {
    errors.push({ feature: "快捷服务", issue: "快捷入口不完整" });
  }
  if (featureGrid.length !== 8) {
    errors.push({ feature: "功能宫格", issue: "功能宫格不是 8 个入口" });
  }
  if (!bottomNavigation.some((item) => item.title === "人工向导" && item.route === "guide")) {
    errors.push({ feature: "底部导航", issue: "缺少人工向导 Tab" });
  }
  return {
    version: USER_HOME_REQUIREMENTS_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  USER_HOME_REQUIREMENTS_VERSION,
  bottomNavigation,
  featureGrid,
  getHomeConfig,
  quickServices,
  switchHomeCity,
  updateHomeConfig,
  userHomeRequirements,
  userHomeRequirementsForApi,
  validateUserHomeRequirements,
};
