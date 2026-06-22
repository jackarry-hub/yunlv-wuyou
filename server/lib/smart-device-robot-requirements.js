const SMART_DEVICE_ROBOT_REQUIREMENTS_VERSION = "4.6-smart-device-robot-requirements-v1";

const smartDeviceRobotRequirements = [
  {
    id: "today-health-overview",
    feature: "今日健康概览",
    detail: "展示心率、血压、血氧、睡眠、步数等状态条。",
    priority: "P0",
    acceptance: "可展示模拟/真实数据，异常状态颜色区分。",
    route: "/user/#devices",
    apiEndpoints: ["/api/devices/robot-requirements", "/api/health/overview"],
  },
  {
    id: "device-status",
    feature: "设备状态",
    detail: "智能手环、小云机器人分别显示连接状态、电量、最后同步时间。",
    priority: "P0",
    acceptance: "设备卡片独立展示，不混淆硬件。",
    route: "/user/#devices",
    apiEndpoints: ["/api/devices", "/api/devices/{id}/sync"],
  },
  {
    id: "device-linkage",
    feature: "设备联动",
    detail: "展示手环→平台→机器人→家人/紧急联系人的联动关系。",
    priority: "P1",
    acceptance: "联动图或数据说明可见。",
    route: "/user/#devices",
    apiEndpoints: ["/api/devices/robot-requirements", "/api/messages"],
  },
  {
    id: "xiaoyun-robot-page",
    feature: "小云机器人子页面",
    detail: "显示在线状态、电量、网络、语音音量、设备状态。",
    priority: "P0",
    acceptance: "设备状态可视化展示。",
    route: "/user/#robot",
    apiEndpoints: ["/api/devices/robot-requirements", "/api/devices/{id}/action"],
  },
  {
    id: "guardian-functions",
    feature: "守护功能",
    detail: "摔倒检测、异常检测、离家/长时间未动提醒、生命体征检测、用药提醒、SOS 紧急呼叫。",
    priority: "P0",
    acceptance: "各功能有开关或状态展示。",
    route: "/user/#robot",
    apiEndpoints: ["/api/devices/{id}/action", "/api/alerts/sos"],
  },
  {
    id: "family-call",
    feature: "家人通话",
    detail: "展示家属联系人，支持语音/视频通话入口。",
    priority: "P1",
    acceptance: "点击可调起通话或占位模拟。",
    route: "/user/#robot",
    apiEndpoints: ["/api/devices/{id}/action", "/api/messages"],
  },
  {
    id: "help-request",
    feature: "寻求他人帮助",
    detail: "可联系附近求助、社区工作人员、人工向导，一键求助。",
    priority: "P1",
    acceptance: "可生成帮助任务。",
    route: "/user/#robot",
    apiEndpoints: ["/api/devices/help-request", "/api/service-requests", "/api/alerts/sos"],
  },
];

const healthMetricDefinitions = [
  { metricType: "heart_rate", label: "心率", fallbackValue: 76, unit: "次/分", normalText: "正常", source: "智能手环", order: 1 },
  { metricType: "blood_pressure", label: "血压", fallbackValue: "128/82", unit: "mmHg", normalText: "正常", source: "智能血压计", order: 2 },
  { metricType: "blood_oxygen", label: "血氧", fallbackValue: 97, unit: "%", normalText: "正常", source: "智能手环", order: 3 },
  { metricType: "sleep", label: "睡眠", fallbackValue: 6.8, unit: "小时", normalText: "轻度不足", source: "小云机器人", order: 4 },
  { metricType: "steps", label: "步数", fallbackValue: 6850, unit: "步", normalText: "目标 8000 步", source: "智能手环模拟", order: 5 },
];

const guardianFeatureDefinitions = [
  { key: "fallDetection", name: "摔倒检测", priority: "P0", deviceRole: "robot", defaultEnabled: true, statusText: "重点守护", description: "识别摔倒行为，立即告警并通知紧急联系人。" },
  { key: "abnormalDetection", name: "异常检测", priority: "P0", deviceRole: "robot", defaultEnabled: true, statusText: "重点守护", description: "检测长时间静止、异常活动等情况。" },
  { key: "awayReminder", name: "离家/长时间未动提醒", priority: "P0", deviceRole: "robot", defaultEnabled: true, statusText: "功能已开启", description: "长时间未检测到活动，及时提醒家人。" },
  { key: "vitalSigns", name: "生命体征检测", priority: "P0", deviceRole: "bracelet", defaultEnabled: true, statusText: "已联动手环", description: "结合智能手环数据，监测心率、血氧等。" },
  { key: "medicineReminder", name: "用药提醒", priority: "P0", deviceRole: "robot", defaultEnabled: true, statusText: "按时提醒", description: "定时提醒服药，记录服药情况。" },
  { key: "sosCall", name: "SOS 紧急呼叫", priority: "P0", deviceRole: "robot", defaultEnabled: true, statusText: "一键可用", description: "遇到紧急情况，一键呼叫家人/求助。" },
];

const helpChannels = [
  { key: "nearby", title: "附近求助", target: "附近求助", description: "联系附近求助人员或邻里互助成员。", priority: "P1", providerType: "community" },
  { key: "community", title: "社区工作人员", target: "社区工作人员", description: "联系社区工作人员进行上门或电话协助。", priority: "P1", providerType: "community" },
  { key: "guide", title: "人工向导", target: "人工向导", description: "生成向导协助任务，由后台或向导端承接。", priority: "P1", providerType: "guide" },
  { key: "sos", title: "SOS 一键求助", target: "SOS 一键求助", description: "生成最高优先级 SOS 告警并同步家属、后台、向导。", priority: "P0", providerType: "emergency" },
];

function compact(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function latestRecord(records = [], metricType) {
  return records
    .filter((item) => item.metricType === metricType)
    .sort((a, b) => compact(b.recordedAt).localeCompare(compact(a.recordedAt)))[0];
}

function toneForStatus(status = "", value = "") {
  const text = `${status} ${value}`;
  if (/异常|离线|过低|过高|危险|告警/.test(text)) return "red";
  if (/不足|偏高|偏低|低电量|待处理|提醒/.test(text)) return "orange";
  if (/在线|正常|良好|已连接|已开启|目标/.test(text)) return "green";
  return "blue";
}

function batteryTone(battery) {
  const value = Number(battery || 0);
  if (value <= 20) return "red";
  if (value <= 50) return "orange";
  return "green";
}

function deviceRole(device = {}) {
  const type = compact(device.type);
  if (/手环|腕带/.test(type)) return "bracelet";
  if (/小云|机器人/.test(type)) return "robot";
  if (/血压/.test(type)) return "bloodPressure";
  return "other";
}

function findDevice(db = {}, role) {
  return (db.devices || []).find((device) => deviceRole(device) === role);
}

function healthOverviewForApi(db = {}) {
  return {
    elder: db.elderProfile || {},
    metrics: healthMetricDefinitions.map((definition) => {
      const record = latestRecord(db.healthRecords || [], definition.metricType);
      const value = record?.value ?? definition.fallbackValue;
      const status = record?.status || definition.normalText;
      return {
        metricType: definition.metricType,
        label: definition.label,
        value,
        unit: record?.unit || definition.unit,
        status,
        source: record?.source || definition.source,
        recordedAt: record?.recordedAt || "模拟实时数据",
        order: definition.order,
        isSimulated: !record,
        tone: toneForStatus(status, value),
      };
    }),
  };
}

function normalizeDeviceCard(device = {}) {
  const role = deviceRole(device);
  const battery = Number(device.battery || 0);
  return {
    id: device.id || "",
    deviceId: device.deviceId || "",
    type: device.type || "智能设备",
    role,
    title: role === "bracelet" ? "智能手环" : role === "robot" ? "小云机器人" : device.type || "智能设备",
    onlineStatus: device.onlineStatus || "未知",
    battery,
    batteryTone: batteryTone(battery),
    lastSync: device.lastSync || "",
    location: device.location || "",
    statusTone: toneForStatus(device.onlineStatus, battery),
    isOnline: device.onlineStatus === "在线",
  };
}

function deviceStatusForApi(db = {}) {
  const bracelet = findDevice(db, "bracelet");
  const robot = findDevice(db, "robot");
  return {
    devices: [bracelet, robot].filter(Boolean).map(normalizeDeviceCard),
    independentCards: true,
    hardwareRoles: ["智能手环", "小云机器人"],
  };
}

function robotStatusForApi(db = {}) {
  const robot = findDevice(db, "robot") || {};
  const card = normalizeDeviceCard(robot);
  const online = card.onlineStatus === "在线";
  return {
    ...card,
    networkStatus: robot.networkStatus || (online ? "良好" : "离线"),
    voiceVolume: Number(robot.voiceVolume || 65),
    deviceStatus: robot.deviceStatus || (online ? "正常运行" : "待检查"),
    room: robot.location || "客厅",
    visualized: true,
  };
}

function guardianFeaturesForApi(db = {}) {
  const robot = findDevice(db, "robot") || {};
  const bracelet = findDevice(db, "bracelet") || {};
  const robotSettings = robot.guardianSettings || {};
  const braceletSettings = bracelet.guardianSettings || {};
  return guardianFeatureDefinitions.map((item) => {
    const device = item.deviceRole === "bracelet" ? bracelet : robot;
    const settings = item.deviceRole === "bracelet" ? braceletSettings : robotSettings;
    const enabled = settings[item.key] === undefined ? item.defaultEnabled : Boolean(settings[item.key]);
    return {
      ...item,
      enabled,
      status: item.key === "sosCall" ? "可立即触发" : enabled ? item.statusText : "已关闭",
      deviceId: device.id || robot.id || bracelet.id || "",
      apiEndpoint: item.key === "sosCall" ? "/api/alerts/sos" : `/api/devices/${device.id || robot.id || bracelet.id || "{id}"}/action`,
      tone: enabled ? "green" : "gray",
    };
  });
}

function familyCallForApi(db = {}) {
  const robot = findDevice(db, "robot") || {};
  return {
    deviceId: robot.id || "",
    contacts: (db.familyContacts || []).map((contact) => ({
      id: contact.id,
      name: contact.name,
      relation: contact.relation,
      phone: contact.phone,
      isDefault: Boolean(contact.isDefault),
      onlineStatus: "可呼叫",
      callModes: ["voice", "video"],
      apiEndpoint: `/api/devices/${robot.id || "{id}"}/action`,
    })),
  };
}

function helpRequestForApi() {
  return {
    channels: helpChannels.map((item) => ({
      ...item,
      apiEndpoint: item.key === "sos" ? "/api/alerts/sos" : "/api/devices/help-request",
    })),
  };
}

function linkageForApi(db = {}) {
  const defaultContact = (db.familyContacts || []).find((item) => item.isDefault) || (db.familyContacts || [])[0] || {};
  return {
    steps: [
      { key: "bracelet", title: "智能手环", description: "采集心率、血氧、步数、位置和 SOS 触发。", status: findDevice(db, "bracelet")?.onlineStatus || "未知" },
      { key: "platform", title: "云旅平台", description: "沉淀健康、设备、异常和服务请求数据。", status: "运行中" },
      { key: "robot", title: "小云机器人", description: "播报提醒、陪伴互动、发起通话或求助。", status: findDevice(db, "robot")?.onlineStatus || "未知" },
      { key: "family", title: "家人/紧急联系人", description: defaultContact.name ? `${defaultContact.relation}${defaultContact.name}接收通知和通话。` : "紧急联系人接收通知和通话。", status: "可通知" },
    ],
    visible: true,
  };
}

function runtimeForRequirement(requirement, db = {}) {
  if (requirement.id === "today-health-overview") {
    return { status: "已接入健康数据", metricCount: healthOverviewForApi(db).metrics.length, acceptance: requirement.acceptance };
  }
  if (requirement.id === "device-status") {
    return { status: "已分设备卡片展示", deviceCount: deviceStatusForApi(db).devices.length, acceptance: requirement.acceptance };
  }
  if (requirement.id === "device-linkage") {
    return { status: "已展示联动链路", stepCount: linkageForApi(db).steps.length, acceptance: requirement.acceptance };
  }
  if (requirement.id === "xiaoyun-robot-page") {
    return { status: "已接入机器人状态", onlineStatus: robotStatusForApi(db).onlineStatus, acceptance: requirement.acceptance };
  }
  if (requirement.id === "guardian-functions") {
    return { status: "已接入守护开关", enabledCount: guardianFeaturesForApi(db).filter((item) => item.enabled).length, acceptance: requirement.acceptance };
  }
  if (requirement.id === "family-call") {
    return { status: "已接入通话动作模拟", contactCount: familyCallForApi(db).contacts.length, acceptance: requirement.acceptance };
  }
  if (requirement.id === "help-request") {
    return { status: "已接入帮助任务生成", channelCount: helpRequestForApi().channels.length, acceptance: requirement.acceptance };
  }
  return { status: "已接入", acceptance: requirement.acceptance };
}

function smartDeviceRobotRequirementsForApi(db = {}) {
  const requirements = smartDeviceRobotRequirements.map((item) => ({
    ...item,
    runtime: runtimeForRequirement(item, db),
  }));
  return {
    version: SMART_DEVICE_ROBOT_REQUIREMENTS_VERSION,
    source: "4.6 智能设备与小云机器人需求",
    requirementCount: requirements.length,
    p0Count: requirements.filter((item) => item.priority === "P0").length,
    p1Count: requirements.filter((item) => item.priority === "P1").length,
    requirements,
    healthOverview: healthOverviewForApi(db),
    deviceStatus: deviceStatusForApi(db),
    linkage: linkageForApi(db),
    robotStatus: robotStatusForApi(db),
    guardianFeatures: guardianFeaturesForApi(db),
    familyCall: familyCallForApi(db),
    helpRequest: helpRequestForApi(db),
    updatedAt: new Date().toISOString(),
  };
}

function validateSmartDeviceRobotRequirements() {
  const expectedRows = [
    ["今日健康概览", "展示心率、血压、血氧、睡眠、步数等状态条。", "P0", "可展示模拟/真实数据，异常状态颜色区分。"],
    ["设备状态", "智能手环、小云机器人分别显示连接状态、电量、最后同步时间。", "P0", "设备卡片独立展示，不混淆硬件。"],
    ["设备联动", "展示手环→平台→机器人→家人/紧急联系人的联动关系。", "P1", "联动图或数据说明可见。"],
    ["小云机器人子页面", "显示在线状态、电量、网络、语音音量、设备状态。", "P0", "设备状态可视化展示。"],
    ["守护功能", "摔倒检测、异常检测、离家/长时间未动提醒、生命体征检测、用药提醒、SOS 紧急呼叫。", "P0", "各功能有开关或状态展示。"],
    ["家人通话", "展示家属联系人，支持语音/视频通话入口。", "P1", "点击可调起通话或占位模拟。"],
    ["寻求他人帮助", "可联系附近求助、社区工作人员、人工向导，一键求助。", "P1", "可生成帮助任务。"],
  ];
  const errors = [];
  expectedRows.forEach(([feature, detail, priority, acceptance], index) => {
    const item = smartDeviceRobotRequirements[index];
    if (!item) {
      errors.push({ feature, issue: "缺少功能点" });
      return;
    }
    if (item.feature !== feature) errors.push({ feature, issue: "功能点不一致" });
    if (item.detail !== detail) errors.push({ feature, issue: "详细需求不一致" });
    if (item.priority !== priority) errors.push({ feature, issue: "优先级不一致" });
    if (item.acceptance !== acceptance) errors.push({ feature, issue: "验收标准不一致" });
    if (!item.route || !item.apiEndpoints.length) errors.push({ feature, issue: "缺少页面入口或接口" });
  });
  if (smartDeviceRobotRequirements.length !== expectedRows.length) {
    errors.push({ feature: "全部", issue: "功能点数量不一致" });
  }
  return {
    version: SMART_DEVICE_ROBOT_REQUIREMENTS_VERSION,
    valid: errors.length === 0,
    requirementCount: smartDeviceRobotRequirements.length,
    errors,
  };
}

module.exports = {
  SMART_DEVICE_ROBOT_REQUIREMENTS_VERSION,
  smartDeviceRobotRequirements,
  smartDeviceRobotRequirementsForApi,
  validateSmartDeviceRobotRequirements,
};
