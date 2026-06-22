const COLLABORATION_NOTIFICATION_VERSION = "8-cross-end-collaboration-v1";

const collaborationRules = [
  {
    id: "user-order",
    scenario: "用户下单",
    triggerSide: "用户端",
    receiverSides: ["管理后台", "人工向导端或商户端"],
    rule: "生成订单；根据服务类型自动或人工派单。",
    priority: "P0",
    channels: ["站内消息"],
    implementedBy: ["/orders", "/tasks/dispatch", "/messages"],
    status: "已实现",
  },
  {
    id: "sos",
    scenario: "SOS 求助",
    triggerSide: "用户端/设备",
    receiverSides: ["紧急联系人", "管理后台", "人工向导端"],
    rule: "最高优先级；弹窗/短信/电话/站内消息多渠道通知。",
    priority: "最高",
    channels: ["站内消息", "短信预留", "电话预留", "App Push 预留"],
    implementedBy: ["/alerts/sos", "/alerts/{id}/handle", "/messages", "/integrations/sms/request"],
    status: "站内消息已实现/外部通道预留",
  },
  {
    id: "device-exception",
    scenario: "设备异常",
    triggerSide: "智能设备",
    receiverSides: ["用户端", "家属", "管理后台"],
    rule: "异常入库，触发提醒，严重异常进入待处理列表。",
    priority: "高",
    channels: ["站内消息", "短信预留", "设备通道预留"],
    implementedBy: ["/devices/{id}/sync", "/alerts", "/messages"],
    status: "已实现",
  },
  {
    id: "guide-accept",
    scenario: "人工向导接单",
    triggerSide: "人工向导端",
    receiverSides: ["用户端", "管理后台"],
    rule: "用户看到订单状态变更和向导信息。",
    priority: "P0",
    channels: ["站内消息"],
    implementedBy: ["/tasks/{id}/accept", "/orders/{id}", "/messages"],
    status: "已实现",
  },
  {
    id: "merchant-confirm",
    scenario: "商户确认预约",
    triggerSide: "商户端",
    receiverSides: ["用户端", "管理后台"],
    rule: "用户收到确认结果和服务方案。",
    priority: "P0",
    channels: ["站内消息"],
    implementedBy: ["/merchant/orders/{id}/quote", "/merchant/orders/{id}/confirm", "/messages"],
    status: "已实现",
  },
  {
    id: "service-complete",
    scenario: "服务完成",
    triggerSide: "人工向导/商户端",
    receiverSides: ["用户端", "管理后台"],
    rule: "用户确认/评价，后台沉淀服务数据。",
    priority: "P0",
    channels: ["站内消息"],
    implementedBy: ["/tasks/{id}/complete", "/merchant/orders/{id}/complete", "/orders/{id}/confirm", "/reviews"],
    status: "已实现",
  },
  {
    id: "exception-report",
    scenario: "异常上报",
    triggerSide: "人工向导/商户端",
    receiverSides: ["管理后台", "用户端视情况"],
    rule: "后台处理后决定是否通知用户或家属。",
    priority: "高",
    channels: ["站内消息", "短信预留", "电话预留"],
    implementedBy: ["/guide/exception", "/merchant/exception", "/alerts/{id}/handle", "/messages"],
    status: "已实现",
  },
];

function collaborationSummary() {
  return {
    version: COLLABORATION_NOTIFICATION_VERSION,
    scenarioCount: collaborationRules.length,
    p0ScenarioCount: collaborationRules.filter((item) => item.priority === "P0").length,
    highPriorityCount: collaborationRules.filter((item) => ["最高", "高"].includes(item.priority)).length,
    reservedChannelCount: new Set(collaborationRules.flatMap((item) => item.channels.filter((channel) => /预留/.test(channel)))).size,
  };
}

function collaborationForApi() {
  return {
    ...collaborationSummary(),
    rules: collaborationRules,
  };
}

function validateCollaborationRules() {
  const expected = [
    "用户下单",
    "SOS 求助",
    "设备异常",
    "人工向导接单",
    "商户确认预约",
    "服务完成",
    "异常上报",
  ];
  const errors = [];
  const scenarioSet = new Set(collaborationRules.map((item) => item.scenario));
  expected.forEach((scenario) => {
    if (!scenarioSet.has(scenario)) errors.push({ scenario, issue: "缺少协同场景" });
  });
  collaborationRules.forEach((item) => {
    if (!item.triggerSide || !item.receiverSides.length || !item.rule) errors.push({ scenario: item.scenario, issue: "触发端、接收端或规则为空" });
    if (!item.implementedBy.length) errors.push({ scenario: item.scenario, issue: "缺少实现接口" });
    if (!item.channels.includes("站内消息")) errors.push({ scenario: item.scenario, issue: "MVP 必须至少支持站内消息" });
  });
  return {
    ...collaborationSummary(),
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  COLLABORATION_NOTIFICATION_VERSION,
  collaborationForApi,
  collaborationRules,
  validateCollaborationRules,
};
