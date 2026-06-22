const EMERGENCY_HELP_REQUIREMENTS_VERSION = "4.5-emergency-help-requirements-v1";

const emergencyHelpRequirements = [
  {
    key: "oneKeySos",
    feature: "一键 SOS",
    detail: "页面显著展示一键紧急求助按钮，点击后二次确认或长按触发。",
    priority: "P0",
    acceptance: "触发后生成求助记录。",
    apiEndpoints: ["/api/alerts/sos"],
  },
  {
    key: "notificationChain",
    feature: "通知链路",
    detail: "向紧急联系人、平台后台发送求助信息，包含姓名、位置、时间、电话。",
    priority: "P0",
    acceptance: "后台和联系人均可看到求助记录。",
    apiEndpoints: ["/api/alerts/sos", "/api/messages"],
  },
  {
    key: "locationUpload",
    feature: "位置上传",
    detail: "获取用户当前位置，显示地址与定位精度。",
    priority: "P0",
    acceptance: "地图或地址显示正常。",
    apiEndpoints: ["/api/alerts/emergency-requirements", "/api/alerts/sos"],
  },
  {
    key: "emergencyContacts",
    feature: "紧急联系人",
    detail: "可添加儿子、女儿、老伴等紧急联系人，支持拨打电话。",
    priority: "P0",
    acceptance: "联系人可新增、编辑、删除。",
    apiEndpoints: ["/api/family-contacts", "/api/family-contacts/{id}", "/api/family-contacts/{id}/call"],
  },
  {
    key: "quickHelp",
    feature: "快速求助",
    detail: "呼叫救护车、报警求助、联系医院、人工客服/人工向导。",
    priority: "P1",
    acceptance: "按钮可拨号或生成对应求助任务。",
    apiEndpoints: ["/api/alerts/quick-help"],
  },
  {
    key: "healthInformation",
    feature: "健康信息",
    detail: "展示血型、慢性病、过敏史、常用药物，供急救参考。",
    priority: "P1",
    acceptance: "用户可编辑健康信息。",
    apiEndpoints: ["/api/elder/profile"],
  },
];

const quickHelpChannels = [
  {
    key: "ambulance",
    title: "呼叫救护车",
    target: "120 急救中心",
    providerType: "emergency",
    dialNumber: "120",
    priority: "P1",
    taskType: "救护车求助",
  },
  {
    key: "police",
    title: "报警求助",
    target: "110 公安报警",
    providerType: "emergency",
    dialNumber: "110",
    priority: "P1",
    taskType: "报警求助",
  },
  {
    key: "hospital",
    title: "联系医院",
    target: "附近合作医院",
    providerType: "medical",
    dialNumber: "0871-120-0000",
    priority: "P1",
    taskType: "医院协助",
  },
  {
    key: "customerService",
    title: "人工客服",
    target: "平台人工客服",
    providerType: "customer-service",
    dialNumber: "400-888-0000",
    priority: "P1",
    taskType: "人工客服协助",
  },
  {
    key: "guide",
    title: "人工向导",
    target: "附近人工向导",
    providerType: "guide",
    dialNumber: "",
    priority: "P1",
    taskType: "人工向导协助",
  },
];

function currentEmergencyLocation(db, override = {}) {
  const elder = db.elderProfile || {};
  return {
    address: override.address || override.location || elder.address || "昆明市五华区翠湖康养公寓",
    coordinates: override.coordinates || elder.coordinates || { lng: 102.7076, lat: 25.0464 },
    accuracy: Number(override.accuracy || elder.locationAccuracy || 35),
    source: override.source || "设备定位/浏览器定位",
    updatedAt: override.updatedAt || "",
  };
}

function healthInfoForEmergency(db) {
  const elder = db.elderProfile || {};
  const chronicDiseases = elder.chronicDisease || (elder.healthTags || []).join("、") || "未填写";
  return {
    bloodType: elder.bloodType || "未填写",
    chronicDiseases,
    allergies: elder.allergies || "未填写",
    medicines: elder.medicines || "未填写",
    riskLevel: elder.riskLevel || "待评估",
    editableFields: ["bloodType", "chronicDisease", "allergies", "medicines"],
  };
}

function contactsForEmergency(db) {
  return (db.familyContacts || [])
    .filter((contact) => !contact.elderId || contact.elderId === db.elderProfile?.id)
    .map((contact, index) => ({ contact, index }))
    .sort((a, b) => Number(a.contact.callPriority || a.index + 1) - Number(b.contact.callPriority || b.index + 1))
    .map(({ contact, index }) => ({
    id: contact.id,
    elderId: contact.elderId,
    name: contact.name,
    relation: contact.relation,
    phone: contact.phone,
    isDefault: Boolean(contact.isDefault),
    notifyAlert: contact.notifyAlert !== false,
    callPriority: contact.callPriority || index + 1,
    canCall: Boolean(contact.phone),
    bindingStatus: contact.bindingStatus || "已绑定",
    createdAt: contact.createdAt || "",
    updatedAt: contact.updatedAt || "",
    lastInteractionAt: contact.lastInteractionAt || "",
  }));
}

function notificationChainForEmergency(db) {
  const contacts = contactsForEmergency(db).filter((contact) => contact.notifyAlert);
  return {
    requiredFields: ["姓名", "位置", "时间", "电话"],
    channels: ["站内消息", "短信预留", "电话接口预留", "App Push 预留"],
    receivers: [
      ...contacts.map((contact) => ({
        role: "family",
        name: contact.name,
        relation: contact.relation,
        phone: contact.phone,
        channel: "站内消息/短信预留/电话接口预留",
      })),
      {
        role: "admin",
        name: "平台后台",
        relation: "平台值守",
        phone: "400-888-0000",
        channel: "后台告警/站内消息/App Push 预留",
      },
    ],
  };
}

function isUserEmergencyAlert(alert, db) {
  if (alert.elderId && db.elderProfile?.id && alert.elderId !== db.elderProfile.id) return false;
  const text = `${alert.type || ""}${alert.description || ""}${alert.source || ""}`;
  return alert.source === "4.5 紧急求助需求" || /SOS|求助|急救|报警|医院|客服|跌倒|未动|设备离线|健康预警/.test(text);
}

function recentEmergencyAlerts(db) {
  return (db.alerts || [])
    .filter((alert) => isUserEmergencyAlert(alert, db))
    .slice(0, 8);
}

function emergencyRecordsForApi(db) {
  const alertRecords = (db.alerts || [])
    .filter((alert) => isUserEmergencyAlert(alert, db))
    .map((alert) => ({
      ...alert,
      recordKind: "alert",
      title: alert.title || alert.type || "紧急求助",
      category: /SOS|紧急|呼救|报警/.test(`${alert.type || ""}${alert.description || ""}`) ? "SOS" : "设备异常",
    }));
  const quickHelpRecords = (db.serviceRequests || [])
    .filter((item) => item.route === "emergency" || item.payload?.source === "4.5 紧急求助需求")
    .map((item) => ({
      id: item.id,
      requestNo: item.requestNo,
      recordKind: "quickHelp",
      title: item.payload?.channelTitle || item.type || "快速求助",
      type: item.type || "快速求助",
      category: /客服/.test(`${item.type || ""}${item.payload?.channelTitle || ""}`) ? "人工客服" : "快速求助",
      status: item.status || "待处理",
      priority: item.priority || "P1",
      description: item.description || "",
      location: item.payload?.location?.address || item.location || "位置待同步",
      coordinates: item.payload?.location?.coordinates,
      accuracy: item.payload?.location?.accuracy,
      locationSource: item.payload?.location?.source,
      createdAt: item.createdAt,
      handledAt: item.handledAt || item.updatedAt || "",
      handledBy: item.handledBy || "",
      result: item.result || "",
      dialNumber: item.payload?.dialNumber || "",
      channelKey: item.payload?.channelKey || "",
    }));
  return [...alertRecords, ...quickHelpRecords]
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, 20);
}

function emergencyRecordSummary(records) {
  const handledRecords = records.filter((item) => /已处理|已完成|已确认|已取消/.test(item.status || ""));
  const responseTimes = handledRecords
    .map((item) => {
      const startedAt = Date.parse(String(item.createdAt || "").replace(" ", "T"));
      const finishedAt = Date.parse(String(item.handledAt || "").replace(" ", "T"));
      return Number.isFinite(startedAt) && Number.isFinite(finishedAt) && finishedAt >= startedAt
        ? Math.round((finishedAt - startedAt) / 1000)
        : null;
    })
    .filter(Number.isFinite);
  return {
    total: records.length,
    handled: handledRecords.length,
    pending: records.length - handledRecords.length,
    averageResponseSeconds: responseTimes.length
      ? Math.round(responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length)
      : null,
  };
}

function emergencyHelpRequirementsForApi(db) {
  const records = emergencyRecordsForApi(db);
  const elderUser = (db.users || []).find((user) => user.id === db.elderProfile?.userId || user.role === "elder") || {};
  const requirements = emergencyHelpRequirements.map((item) => ({
    ...item,
    implemented: true,
    runtime: {
      p0Required: item.priority === "P0",
      apiCount: item.apiEndpoints.length,
    },
  }));
  return {
    version: EMERGENCY_HELP_REQUIREMENTS_VERSION,
    source: "4.5 紧急求助需求",
    user: {
      id: elderUser.id || "",
      elderId: db.elderProfile?.id || "",
      name: db.elderProfile?.name || elderUser.nickname || "",
      phone: elderUser.phone || "",
      city: db.elderProfile?.city || elderUser.currentCity || "",
    },
    requirementCount: requirements.length,
    p0Count: requirements.filter((item) => item.priority === "P0").length,
    p1Count: requirements.filter((item) => item.priority === "P1").length,
    requirements,
    oneKeySos: {
      triggerMode: "二次确认触发",
      longPressReserved: true,
      apiEndpoint: "/api/alerts/sos",
      generatesRecord: true,
    },
    notificationChain: notificationChainForEmergency(db),
    locationUpload: currentEmergencyLocation(db),
    emergencyContacts: {
      apiEndpoint: "/api/family-contacts",
      contacts: contactsForEmergency(db),
      supports: ["新增", "编辑", "删除", "拨打电话"],
    },
    quickHelp: {
      apiEndpoint: "/api/alerts/quick-help",
      channels: quickHelpChannels,
    },
    healthInformation: {
      apiEndpoint: "/api/elder/profile",
      info: healthInfoForEmergency(db),
    },
    records,
    recordSummary: emergencyRecordSummary(records),
    recentAlerts: recentEmergencyAlerts(db),
  };
}

function validateEmergencyHelpRequirements() {
  const errors = [];
  const expectedRows = [
    ["一键 SOS", "页面显著展示一键紧急求助按钮，点击后二次确认或长按触发。", "P0"],
    ["通知链路", "向紧急联系人、平台后台发送求助信息，包含姓名、位置、时间、电话。", "P0"],
    ["位置上传", "获取用户当前位置，显示地址与定位精度。", "P0"],
    ["紧急联系人", "可添加儿子、女儿、老伴等紧急联系人，支持拨打电话。", "P0"],
    ["快速求助", "呼叫救护车、报警求助、联系医院、人工客服/人工向导。", "P1"],
    ["健康信息", "展示血型、慢性病、过敏史、常用药物，供急救参考。", "P1"],
  ];

  expectedRows.forEach(([feature, detail, priority], index) => {
    const row = emergencyHelpRequirements[index];
    if (!row || row.feature !== feature || row.detail !== detail || row.priority !== priority) {
      errors.push({ index, feature, issue: "需求行与 4.5 图示不一致" });
    }
  });
  if (quickHelpChannels.length < 5) {
    errors.push({ feature: "快速求助", issue: "快速求助渠道不足" });
  }
  emergencyHelpRequirements.forEach((item) => {
    if (!item.acceptance || !item.apiEndpoints.length) {
      errors.push({ feature: item.feature, issue: "缺少验收标准或接口" });
    }
  });

  return {
    version: EMERGENCY_HELP_REQUIREMENTS_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  EMERGENCY_HELP_REQUIREMENTS_VERSION,
  emergencyHelpRequirements,
  quickHelpChannels,
  currentEmergencyLocation,
  healthInfoForEmergency,
  contactsForEmergency,
  notificationChainForEmergency,
  emergencyRecordsForApi,
  emergencyRecordSummary,
  emergencyHelpRequirementsForApi,
  validateEmergencyHelpRequirements,
};
