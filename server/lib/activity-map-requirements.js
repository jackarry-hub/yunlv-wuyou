const ACTIVITY_MAP_REQUIREMENTS_VERSION = "4.4-activity-map-requirements-v1";

const MILE_CENTER = { lng: 103.4148, lat: 24.4105 };

const activityMapCategories = ["全部", "文化体验", "康养健身", "休闲娱乐", "自然观光", "学习讲座"];

const activityMapRequirements = [
  {
    key: "mapDisplay",
    feature: "地图展示",
    detail: "基于弥勒区域展示活动位置点，支持地图缩放、定位、刷新。",
    priority: "P0",
    acceptance: "可看到多个活动点和当前定位。",
    apiEndpoints: ["/api/activities/map", "/api/activities/map-requirements"],
  },
  {
    key: "activityCategory",
    feature: "活动分类",
    detail: "全部、文化体验、康养健身、休闲娱乐、自然观光、学习讲座等。",
    priority: "P0",
    acceptance: "分类筛选后地图点与列表同步变化。",
    apiEndpoints: ["/api/activities/map", "/api/activities?category={category}"],
  },
  {
    key: "activityCard",
    feature: "活动卡片",
    detail: "地图点点击出现活动卡片，展示名称、时间、地点、距离、状态。",
    priority: "P0",
    acceptance: "活动信息显示正确。",
    apiEndpoints: ["/api/activities/{id}"],
  },
  {
    key: "nearbyRecommendation",
    feature: "附近推荐",
    detail: "底部横滑展示附近活动推荐。",
    priority: "P0",
    acceptance: "活动卡片可进入详情。",
    apiEndpoints: ["/api/activities/map-requirements"],
  },
  {
    key: "activitySignup",
    feature: "活动报名",
    detail: "活动详情页支持报名、取消报名、查看参与人数。",
    priority: "P1",
    acceptance: "报名后生成记录并消息提醒。",
    apiEndpoints: ["/api/activities/{id}/join", "/api/activities/{id}/cancel"],
  },
];

function radians(value) {
  return (Number(value || 0) * Math.PI) / 180;
}

function distanceInKm(from = MILE_CENTER, to = MILE_CENTER) {
  const earthRadius = 6371;
  const dLat = radians(to.lat - from.lat);
  const dLng = radians(to.lng - from.lng);
  const lat1 = radians(from.lat);
  const lat2 = radians(to.lat);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(coordinates) {
  if (!coordinates) return "未知";
  const distance = distanceInKm(MILE_CENTER, coordinates);
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
}

function activeActivitySignups(db, activityId, userId) {
  return (db.activitySignups || []).filter((item) => {
    if (activityId && item.activityId !== activityId) return false;
    if (userId && item.userId !== userId) return false;
    return item.status !== "已取消";
  });
}

function participantCountFor(db, activity) {
  const signupCount = activeActivitySignups(db, activity.id).reduce((sum, item) => sum + Number(item.count || 1), 0);
  return Math.max(Number(activity.joined || 0), signupCount);
}

function normalizeActivityMapPoint(db, activity, options = {}) {
  const userId = options.userId || "user-001";
  const userSignup = activeActivitySignups(db, activity.id, userId)[0] || null;
  const participantCount = participantCountFor(db, activity);
  const availableSlots = Math.max(0, Number(activity.quota || 0) - participantCount);
  return {
    id: activity.id,
    title: activity.title,
    category: activity.category,
    time: activity.time,
    location: activity.location,
    coordinates: activity.coordinates,
    distance: activity.distance || formatDistance(activity.coordinates),
    status: activity.status,
    cover: activity.cover,
    quota: Number(activity.quota || 0),
    joined: participantCount,
    participantCount,
    availableSlots,
    userJoined: Boolean(userSignup),
    signupId: userSignup?.id || "",
    card: {
      name: activity.title,
      time: activity.time,
      place: activity.location,
      distance: activity.distance || formatDistance(activity.coordinates),
      status: activity.status,
    },
  };
}

function activityMapCategoriesForApi(db) {
  const points = db.activities || [];
  return activityMapCategories.map((category) => {
    const count = category === "全部" ? points.length : points.filter((item) => item.category === category).length;
    return { category, count, active: count > 0 || category === "全部" };
  });
}

function activityMapRequirementsForApi(db, options = {}) {
  const userId = options.userId || "user-001";
  const points = (db.activities || []).map((activity) => normalizeActivityMapPoint(db, activity, { userId }));
  const recommended = points
    .filter((item) => item.status === "报名中")
    .sort((a, b) => Number(a.distance.replace(/[^0-9.]/g, "") || 0) - Number(b.distance.replace(/[^0-9.]/g, "") || 0))
    .slice(0, 6);
  const userSignups = activeActivitySignups(db, null, userId).map((signup) => {
    const activity = points.find((item) => item.id === signup.activityId);
    return { ...signup, activity };
  });
  return {
    version: ACTIVITY_MAP_REQUIREMENTS_VERSION,
    source: "4.4 活动地图需求",
    requirementCount: activityMapRequirements.length,
    p0Count: activityMapRequirements.filter((item) => item.priority === "P0").length,
    p1Count: activityMapRequirements.filter((item) => item.priority === "P1").length,
    requirements: activityMapRequirements,
    mapDisplay: {
      region: "弥勒区域",
      center: MILE_CENTER,
      currentLocation: {
        address: "弥勒市湖泉生态园游客中心",
        coordinates: MILE_CENTER,
        accuracy: "约 35m",
      },
      zoom: 13,
      supports: ["缩放", "定位", "刷新"],
      pointCount: points.length,
    },
    categories: activityMapCategoriesForApi(db),
    points,
    nearbyRecommendations: recommended,
    signup: {
      apiEndpoints: ["/api/activities/{id}/join", "/api/activities/{id}/cancel"],
      userSignups,
      supports: ["报名", "取消报名", "查看参与人数", "消息提醒"],
    },
  };
}

function validateActivityMapRequirements() {
  const errors = [];
  const expectedRows = [
    ["地图展示", "基于弥勒区域展示活动位置点，支持地图缩放、定位、刷新。", "P0"],
    ["活动分类", "全部、文化体验、康养健身、休闲娱乐、自然观光、学习讲座等。", "P0"],
    ["活动卡片", "地图点点击出现活动卡片，展示名称、时间、地点、距离、状态。", "P0"],
    ["附近推荐", "底部横滑展示附近活动推荐。", "P0"],
    ["活动报名", "活动详情页支持报名、取消报名、查看参与人数。", "P1"],
  ];

  expectedRows.forEach(([feature, detail, priority], index) => {
    const row = activityMapRequirements[index];
    if (!row || row.feature !== feature || row.detail !== detail || row.priority !== priority) {
      errors.push({ index, feature, issue: "需求行与 4.4 图示不一致" });
    }
  });
  activityMapRequirements.forEach((item) => {
    if (!item.acceptance || !item.apiEndpoints.length) {
      errors.push({ feature: item.feature, issue: "缺少验收标准或接口" });
    }
  });
  if (!activityMapCategories.includes("自然观光") || !activityMapCategories.includes("学习讲座")) {
    errors.push({ feature: "活动分类", issue: "缺少 4.4 要求分类" });
  }

  return {
    version: ACTIVITY_MAP_REQUIREMENTS_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  ACTIVITY_MAP_REQUIREMENTS_VERSION,
  MILE_CENTER,
  activityMapCategories,
  activityMapRequirements,
  activeActivitySignups,
  activityMapCategoriesForApi,
  activityMapRequirementsForApi,
  normalizeActivityMapPoint,
  validateActivityMapRequirements,
};
