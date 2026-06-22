const ADMIN_DATA_SCREENS_VERSION = "7.2-admin-data-screens-v1";

const adminDataScreenDefinitions = [
  {
    id: "elder-care-operations",
    route: "/admin/#elder-screen",
    title: "旅居养老作战数据大屏",
    coreMetrics: ["老人总数", "在线人数", "健康状态分布", "设备在线", "异常预警", "SOS", "服务工单", "满意度"],
    purpose: "监控旅居老人整体安全、健康和服务情况。",
  },
  {
    id: "guide-dispatch-operations",
    route: "/admin/#guide-screen",
    title: "人工向导工作调配大屏",
    coreMetrics: ["向导总数", "在线/服务中/空闲", "待派单", "今日服务量", "服务时段", "异常处理", "排行"],
    purpose: "用于实时派单、资源调度和服务质量管理。",
  },
];

function percent(part, total, digits = 1) {
  if (!total) return "0%";
  return `${((Number(part) / Number(total)) * 100).toFixed(digits)}%`;
}

function average(values, fallback = 0, digits = 1) {
  const nums = values.map(Number).filter((value) => Number.isFinite(value));
  if (!nums.length) return Number(fallback).toFixed(digits);
  return (nums.reduce((sum, item) => sum + item, 0) / nums.length).toFixed(digits);
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = typeof key === "function" ? key(item) : item[key];
    const label = value || "未分类";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function statusLabelFromHealth(record) {
  if (/异常|风险|偏高|偏低|不足/.test(record.status || "")) return "异常";
  return record.status || "正常";
}

function buildMetric(label, value, unit = "", trend = "实时数据") {
  return { label, value, unit, trend };
}

function cityFromText(text = "") {
  const value = String(text || "");
  const direct = value.match(/(昆明市|曲靖市|玉溪市|保山市|昭通市|丽江市|普洱市|临沧市|楚雄市|红河州|文山州|西双版纳州|大理州|德宏州|怒江州|迪庆州|大理市|弥勒市)/)?.[1];
  if (direct) return direct;
  if (/弥勒|湖泉|红河/.test(value)) return "弥勒市";
  if (/昆明|五华|盘龙|官渡|西山|呈贡|翠湖/.test(value)) return "昆明市";
  if (/大理|下关/.test(value)) return "大理市";
  if (/丽江|古城/.test(value)) return "丽江市";
  return "";
}

function elderDefaultLocation(db) {
  return db.elderProfile?.address || db.elderProfile?.city || db.meta?.city || "昆明市";
}

function addCityMetric(map, city, key, amount = 1) {
  const name = city || "未定位";
  const row = map.get(name) || {
    city: name,
    alerts: 0,
    serviceOrders: 0,
    serviceRequests: 0,
    devices: 0,
    elders: 0,
    total: 0,
  };
  row[key] += Number(amount || 0);
  row.total = row.alerts + row.serviceOrders + row.serviceRequests;
  map.set(name, row);
}

function buildElderCityDistribution(db, openAlerts, activeOrders, activeRequests) {
  const cityMap = new Map();
  const fallback = elderDefaultLocation(db);
  if (db.elderProfile) addCityMetric(cityMap, cityFromText(fallback) || "未定位", "elders", 1);
  openAlerts.forEach((item) => {
    const city = cityFromText(`${item.location || ""} ${item.description || ""}`) || cityFromText(fallback);
    addCityMetric(cityMap, city, "alerts", 1);
  });
  activeOrders.forEach((item) => {
    const city = cityFromText(`${item.location || ""} ${item.note || ""}`) || cityFromText(fallback);
    addCityMetric(cityMap, city, "serviceOrders", 1);
  });
  activeRequests.forEach((item) => {
    const city = cityFromText(`${item.location || ""} ${item.description || ""} ${item.action || ""} ${item.type || ""}`) || cityFromText(fallback);
    addCityMetric(cityMap, city, "serviceRequests", 1);
  });
  (db.devices || []).forEach((item) => {
    const city = cityFromText(item.location || "") || cityFromText(fallback);
    addCityMetric(cityMap, city, "devices", 1);
  });
  return [...cityMap.values()]
    .map((item) => ({
      ...item,
      serviceTotal: item.serviceOrders + item.serviceRequests,
      total: item.total || item.alerts + item.serviceOrders + item.serviceRequests,
    }))
    .sort((a, b) => b.total - a.total || b.alerts - a.alerts || b.serviceTotal - a.serviceTotal || b.devices - a.devices);
}

function buildElderCareScreen(db) {
  const elders = db.users.filter((item) => item.role === "elder");
  const elderCount = Math.max(elders.length, db.elderProfile ? 1 : 0);
  const onlineDevices = db.devices.filter((item) => item.onlineStatus === "在线");
  const onlinePeople = new Set(onlineDevices.map((item) => item.userId).filter(Boolean)).size || onlineDevices.length;
  const openAlerts = db.alerts.filter((item) => item.status !== "已处理");
  const sosAlerts = openAlerts.filter((item) => /SOS|求助|紧急/.test(`${item.type || ""}${item.description || ""}`));
  const activeOrders = db.orders.filter((item) => !["已完成", "已取消"].includes(item.status));
  const activeRequests = db.serviceRequests.filter((item) => !["已处理", "已关闭", "已取消"].includes(item.status));
  const reviews = db.reviews.map((item) => item.rating);
  const healthStatus = countBy(db.healthRecords, statusLabelFromHealth);
  const deviceStatus = countBy(db.devices, "onlineStatus");
  const alertStatus = countBy(db.alerts, "status");
  const satisfaction = `${average(reviews, 4.8, 1)}/5`;
  const cityDistribution = buildElderCityDistribution(db, openAlerts, activeOrders, activeRequests);

  return {
    ...adminDataScreenDefinitions[0],
    updatedAt: new Date().toISOString(),
    metrics: [
      buildMetric("老人总数", elderCount, "人", "档案实时汇总"),
      buildMetric("在线人数", onlinePeople, "人", `${percent(onlinePeople, elderCount)} 在线`),
      buildMetric("健康状态分布", Object.entries(healthStatus).map(([name, value]) => `${name}${value}`).join(" / ") || "暂无数据", "", "健康记录聚合"),
      buildMetric("设备在线", `${onlineDevices.length}/${db.devices.length}`, "台", `${percent(onlineDevices.length, db.devices.length)} 在线`),
      buildMetric("异常预警", openAlerts.length, "条", `${alertStatus["待处理"] || 0} 条待处理`),
      buildMetric("SOS", sosAlerts.length, "条", sosAlerts.length ? "最高优先级" : "当前无未处理"),
      buildMetric("服务工单", activeOrders.length + activeRequests.length, "单", `${activeOrders.length} 单服务中/待确认`),
      buildMetric("满意度", satisfaction, "", `${db.reviews.length || 0} 条评价沉淀`),
    ],
    healthDistribution: Object.entries(healthStatus).map(([name, value]) => ({
      name,
      value,
      ratio: percent(value, db.healthRecords.length),
    })),
    deviceStatus: Object.entries(deviceStatus).map(([name, value]) => ({
      name,
      value,
      ratio: percent(value, db.devices.length),
    })),
    cityDistribution,
    alertFeed: db.alerts.slice(0, 8).map((item) => ({
      id: item.id,
      time: item.createdAt,
      type: item.type,
      elderName: item.elderName,
      level: item.level,
      status: item.status,
      location: item.location,
      handledBy: item.handledBy || "待分配",
    })),
    serviceWorkOrders: activeOrders.slice(0, 8).map((item) => ({
      id: item.id,
      orderNo: item.orderNo,
      elderName: item.elderName,
      serviceType: item.serviceType,
      status: item.status,
      assigneeName: item.assigneeName || "待派单",
      time: item.time,
      location: item.location,
    })),
    healthRecords: db.healthRecords.slice(0, 8),
  };
}

function serviceTimeBucket(time) {
  const hour = Number(String(time || "").match(/\b(\d{2}):\d{2}/)?.[1]);
  if (!Number.isFinite(hour)) return "未定时";
  if (hour < 12) return "上午";
  if (hour < 18) return "下午";
  return "晚上";
}

function buildGuideDispatchScreen(db) {
  const guideCount = db.guides.length;
  const onlineGuides = db.guides.filter((item) => item.onlineStatus === "在线");
  const busyGuides = db.guides.filter((item) => /服务|接单/.test(item.currentStatus || ""));
  const idleGuides = db.guides.filter((item) => /空闲/.test(item.currentStatus || ""));
  const pendingOrders = db.orders.filter((item) => item.providerType === "guide" && item.status === "待派单");
  const activeGuideTasks = db.tasks.filter((item) => item.assigneeType === "guide" && !["已完成", "已取消"].includes(item.status));
  const today = todayString();
  const todayOrders = db.orders.filter((item) => item.providerType === "guide" && String(item.time || item.createdAt || "").startsWith(today));
  const guideAlerts = db.alerts.filter((item) => item.status !== "已处理");
  const timeBuckets = countBy(db.orders.filter((item) => item.providerType === "guide"), (item) => serviceTimeBucket(item.time));

  const ranking = db.guides
    .map((guide) => ({
      id: guide.id,
      name: guide.realName,
      status: `${guide.onlineStatus}/${guide.currentStatus}`,
      area: guide.area,
      rating: guide.rating,
      monthlyOrders: guide.monthlyOrders,
      incomeToday: guide.incomeToday,
      activeTasks: db.tasks.filter((task) => task.assigneeType === "guide" && task.assigneeId === guide.id && !["已完成", "已取消"].includes(task.status)).length,
      distanceKm: guide.distanceKm,
    }))
    .sort((a, b) => b.rating - a.rating || b.monthlyOrders - a.monthlyOrders);

  return {
    ...adminDataScreenDefinitions[1],
    updatedAt: new Date().toISOString(),
    metrics: [
      buildMetric("向导总数", guideCount, "人", `${onlineGuides.length} 人在线`),
      buildMetric("在线/服务中/空闲", `${onlineGuides.length}/${busyGuides.length}/${idleGuides.length}`, "人", "实时状态"),
      buildMetric("待派单", pendingOrders.length, "单", pendingOrders.length ? "需要调度" : "当前无积压"),
      buildMetric("今日服务量", todayOrders.length || activeGuideTasks.length, "单", `${activeGuideTasks.length} 个任务进行中`),
      buildMetric("服务时段", Object.entries(timeBuckets).map(([name, value]) => `${name}${value}`).join(" / ") || "暂无排班", "", "按预约时间"),
      buildMetric("异常处理", guideAlerts.length, "条", `${guideAlerts.filter((item) => item.status === "处理中").length} 条处理中`),
      buildMetric("排行", ranking[0]?.name || "暂无", "", ranking[0] ? `评分 ${ranking[0].rating}` : "暂无向导"),
    ],
    guideLoad: {
      online: onlineGuides.length,
      busy: busyGuides.length,
      idle: idleGuides.length,
      offline: Math.max(guideCount - onlineGuides.length, 0),
    },
    dispatchQueue: pendingOrders.map((item) => ({
      id: item.id,
      orderNo: item.orderNo,
      elderName: item.elderName,
      serviceType: item.serviceType,
      time: item.time,
      location: item.location,
      status: item.status,
      amount: item.amount,
    })),
    activeTasks: activeGuideTasks.map((task) => {
      const order = db.orders.find((item) => item.id === task.orderId);
      return {
        id: task.id,
        taskNo: task.taskNo,
        status: task.status,
        assigneeName: task.assigneeName,
        serviceType: order?.serviceType || "",
        elderName: order?.elderName || "",
        location: order?.location || "",
        updatedAt: task.updatedAt,
      };
    }),
    serviceTimeBuckets: Object.entries(timeBuckets).map(([name, value]) => ({
      name,
      value,
      ratio: percent(value, db.orders.filter((item) => item.providerType === "guide").length),
    })),
    exceptionHandling: guideAlerts.slice(0, 8).map((item) => ({
      id: item.id,
      time: item.createdAt,
      type: item.type,
      level: item.level,
      status: item.status,
      handledBy: item.handledBy || "待分配",
    })),
    ranking,
  };
}

function adminScreensForApi(db) {
  const screens = [buildElderCareScreen(db), buildGuideDispatchScreen(db)];
  return {
    version: ADMIN_DATA_SCREENS_VERSION,
    source: "7.2 管理端数据大屏",
    screenCount: screens.length,
    screens,
    updatedAt: new Date().toISOString(),
  };
}

function validateAdminDataScreens() {
  const expected = [
    {
      title: "旅居养老作战数据大屏",
      coreMetrics: ["老人总数", "在线人数", "健康状态分布", "设备在线", "异常预警", "SOS", "服务工单", "满意度"],
    },
    {
      title: "人工向导工作调配大屏",
      coreMetrics: ["向导总数", "在线/服务中/空闲", "待派单", "今日服务量", "服务时段", "异常处理", "排行"],
    },
  ];
  const errors = [];
  expected.forEach((item) => {
    const screen = adminDataScreenDefinitions.find((candidate) => candidate.title === item.title);
    if (!screen) {
      errors.push({ screen: item.title, issue: "缺少大屏定义" });
      return;
    }
    item.coreMetrics.forEach((metric) => {
      if (!screen.coreMetrics.includes(metric)) errors.push({ screen: item.title, metric, issue: "缺少核心指标" });
    });
  });
  return {
    version: ADMIN_DATA_SCREENS_VERSION,
    valid: errors.length === 0,
    screenCount: adminDataScreenDefinitions.length,
    errors,
  };
}

module.exports = {
  ADMIN_DATA_SCREENS_VERSION,
  adminDataScreenDefinitions,
  adminScreensForApi,
  validateAdminDataScreens,
};
