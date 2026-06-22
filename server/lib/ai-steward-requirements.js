const AI_STEWARD_REQUIREMENTS_VERSION = "4.3-ai-steward-requirements-v1";

const aiStewardRequirements = [
  {
    key: "aiQuestionAnswer",
    feature: "AI 问答",
    detail: "支持用户输入文字问题，围绕天气、旅居地、住宿、活动、交通、政策、健康常识等回答。",
    priority: "P0",
    acceptance: "返回时间不超过 5 秒；回答带友好语气。",
    apiEndpoints: ["/api/ai/chat"],
  },
  {
    key: "voiceInteraction",
    feature: "语音互动",
    detail: "支持按住说话并调用浏览器系统语音识别；未返回真实识别结果时明确提示不可识别。",
    priority: "P1",
    acceptance: "语音识别成功后进入 AI 对话。",
    apiEndpoints: ["/api/ai/voice/transcribe", "/api/ai/chat"],
  },
  {
    key: "quickQuestions",
    feature: "快捷问题",
    detail: "提供常见问题卡片，如推荐旅居地、最近活动、天气、预订公寓等。",
    priority: "P0",
    acceptance: "点击后自动发起问题并返回答案。",
    apiEndpoints: ["/api/ai/quick-questions", "/api/ai/quick-questions/{id}/ask"],
  },
  {
    key: "serviceRecommendation",
    feature: "服务推荐",
    detail: "AI回答中可推荐活动、人工向导、商户服务等。",
    priority: "P1",
    acceptance: "答案中可出现可点击服务入口。",
    apiEndpoints: ["/api/ai/recommendations", "/api/service-requests"],
  },
  {
    key: "serviceRecords",
    feature: "服务记录",
    detail: "保留对话历史和服务咨询记录。",
    priority: "P1",
    acceptance: "用户可查看最近对话。",
    apiEndpoints: ["/api/ai/history", "/api/ai/service-records"],
  },
];

const quickQuestions = [
  {
    id: "destination",
    title: "推荐旅居地",
    question: "帮我推荐适合老年人的旅居地",
    intent: "destination",
    route: "destinations",
  },
  {
    id: "activities",
    title: "最近活动",
    question: "最近有哪些适合参加的活动？",
    intent: "activity_recommendation",
    route: "activity-map",
  },
  {
    id: "weather",
    title: "天气建议",
    question: "今天弥勒天气适合外出活动吗？",
    intent: "weather",
    route: "assistant",
  },
  {
    id: "booking",
    title: "预订公寓",
    question: "如何预订适合老人入住的旅居公寓？",
    intent: "accommodation",
    route: "destinations",
  },
  {
    id: "traffic",
    title: "交通出行",
    question: "从康养社区去医院怎么安排交通更合适？",
    intent: "traffic",
    route: "transport",
  },
  {
    id: "policy",
    title: "政策补贴",
    question: "旅居养老可以咨询哪些政策和补贴？",
    intent: "policy",
    route: "policy",
  },
  {
    id: "health",
    title: "健康常识",
    question: "老人旅居期间血压和睡眠需要注意什么？",
    intent: "health_overview",
    route: "health",
  },
];

function inferIntent(question = "") {
  const text = String(question || "");
  if (/背景|画面|图片|封面/.test(text)) return "scene_weather";
  if (/天气|气温|下雨|外出|穿衣/.test(text)) return "weather";
  if (/旅居地|目的地|去哪|哪里住|推荐住/.test(text)) return "destination";
  if (/住宿|公寓|房间|入住|预订公寓|订公寓/.test(text)) return "accommodation";
  if (/活动|报名|附近|课程/.test(text)) return "activity_recommendation";
  if (/交通|路线|出行|接送|用车|医院怎么/.test(text)) return "traffic";
  if (/政策|补贴|医保|备案/.test(text)) return "policy";
  if (/就医|医院|挂号|陪诊/.test(text)) return "medical_companion";
  if (/设备|手环|机器人|心率|血压|睡眠|健康|服药/.test(text)) return "health_overview";
  if (/SOS|求助|摔倒|紧急/.test(text)) return "sos";
  return "general";
}

function friendlyAnswerForIntent(intent, question, db) {
  const activity = (db.activities || []).find((item) => item.status === "报名中") || (db.activities || [])[0];
  const guide = (db.guides || []).find((item) => item.onlineStatus === "在线") || (db.guides || [])[0];
  const merchantService = (db.services || []).find((item) => item.providerType === "merchant" && item.status === "上架") || (db.services || [])[0];
  const healthOverview = (db.healthRecords || []).map((item) => `${item.label}${item.value}${item.unit}`).join("，");
  const answers = {
    scene_weather: "从当前页面背景看，是湖边山景、光线明亮、云量较少的晴朗旅居氛围，适合安排轻量散步、拍照打卡或室内外结合的活动。实际出行前仍建议以当前位置实时天气为准，并带好水杯、防晒和薄外套。",
    weather: "今天弥勒适合轻量外出，建议优先安排上午或傍晚活动，带好薄外套和水杯。如果有血压波动，户外活动时间控制在 1 小时左右更稳妥。",
    destination: "可以优先看气候、医疗、交通和社区照护四个维度。当前更推荐弥勒湖泉康养片区、昆明滇池康养片区和大理洱海慢居片区，我可以继续按预算和照护需求帮您细筛。",
    accommodation: "预订旅居公寓建议先确认入住时间、同住人数、无障碍需求和护理需求。您可以从旅居目的地进入房源详情，再提交预约，平台会把需求同步给后台继续确认。",
    activity_recommendation: activity ? `附近推荐「${activity.title}」，时间是 ${activity.time}，地点在 ${activity.location}。我也可以继续帮您筛选康养健身、文化体验、自然观光或学习讲座活动。` : "附近暂未开放报名活动，我会继续关注活动地图并为您提醒新活动。",
    traffic: "出行建议优先选择平台接送或人工向导陪同，尤其是去医院、景区或不熟悉路线时。您可以留下起点、终点和时间，系统会生成接送出行服务需求。",
    policy: "旅居养老常见政策包括异地医保备案、适老化改造补贴、长期护理相关咨询和社区服务补贴。不同城市材料不同，我可以按当前城市帮您整理办理入口和材料清单。",
    medical_companion: guide ? `可以安排人工向导「${guide.realName}」协助陪伴就医，包括挂号取号、陪同检查、缴费取药和路线陪同。平台只做服务协调，不替代医生诊断。` : "可以安排陪伴就医服务，包括挂号取号、陪同检查、缴费取药和路线陪同。",
    health_overview: `当前健康数据概览：${healthOverview || "暂无新同步数据"}。旅居期间建议规律测量血压、保证睡眠、按时服药；如出现明显不适，请优先联系医生或使用 SOS。`,
    sos: "紧急情况请优先点击一键 SOS。系统会生成求助记录，并通知紧急联系人和后台调度人员；严重情况请同时拨打 120 或 110。",
    general: "我可以帮您查询天气、旅居地、住宿、活动、交通、政策、健康常识，也可以推荐人工向导和商户服务。您告诉我时间、地点和具体需求，我会帮您整理下一步。",
  };
  const answer = answers[intent] || answers.general;
  return answer.endsWith("。") ? answer : `${answer}。`;
}

function serviceRecommendationsForIntent(intent, db) {
  const recommendations = [];
  const activity = (db.activities || []).find((item) => item.status === "报名中");
  const guide = (db.guides || []).find((item) => item.onlineStatus === "在线") || (db.guides || [])[0];
  const merchantService = (db.services || []).find((item) => item.providerType === "merchant" && item.status === "上架");

  if (["activity_recommendation", "weather", "scene_weather", "destination", "general"].includes(intent) && activity) {
    recommendations.push({
      id: `activity-${activity.id}`,
      type: "activity",
      title: activity.title,
      description: `${activity.time} · ${activity.location}`,
      route: "activity-map",
      apiEndpoint: `/api/activities/${activity.id}`,
    });
  }
  if (["medical_companion", "traffic", "general"].includes(intent) && guide) {
    recommendations.push({
      id: `guide-${guide.id}`,
      type: "guide",
      title: `${guide.realName} · 人工向导`,
      description: `${guide.area || "本地服务"} · 评分 ${guide.rating || "-"}`,
      route: "order-submit",
      apiEndpoint: "/api/orders",
      requestType: intent === "traffic" ? "接送出行" : "陪伴就医",
    });
  }
  if (["health_overview", "accommodation", "general"].includes(intent) && merchantService) {
    recommendations.push({
      id: `service-${merchantService.id}`,
      type: "merchant-service",
      title: merchantService.title,
      description: `${merchantService.category} · ¥${merchantService.price}/${merchantService.unit}`,
      route: "service-records",
      apiEndpoint: "/api/service-requests",
      requestType: merchantService.title,
    });
  }
  if (["policy"].includes(intent)) {
    recommendations.push({
      id: "policy-guide",
      type: "content",
      title: "政策指南",
      description: "查看医保备案、补贴咨询和材料说明",
      route: "policy",
      apiEndpoint: "/api/ui/actions",
    });
  }
  return recommendations.slice(0, 3);
}

function normalizeAiChatPayload(question, db, options = {}) {
  const startedAt = options.startedAt || Date.now();
  const intent = options.intent || inferIntent(question);
  const answer = friendlyAnswerForIntent(intent, question, db);
  const recommendations = serviceRecommendationsForIntent(intent, db);
  const responseTimeMs = Math.max(1, Date.now() - startedAt);
  return {
    intent,
    answer,
    recommendations,
    responseTimeMs,
    friendlyTone: true,
    withinFiveSeconds: responseTimeMs <= 5000,
  };
}

function normalizeVoiceTranscript(body = {}) {
  const transcript = String(body.transcript || body.text || "").trim().replace(/\s+/g, " ");
  if (!transcript) {
    return {
      transcript: "",
      source: body.source || "empty",
      label: "未收到真实语音识别结果",
    };
  }
  return {
    transcript,
    source: body.source || "webSpeech",
    label: "系统语音识别",
  };
}

function aiStewardRequirementsForApi(db) {
  const latestHistory = (db.aiHistory || []).slice(0, 8);
  return {
    version: AI_STEWARD_REQUIREMENTS_VERSION,
    source: "4.3 智能管家需求",
    requirementCount: aiStewardRequirements.length,
    p0Count: aiStewardRequirements.filter((item) => item.priority === "P0").length,
    p1Count: aiStewardRequirements.filter((item) => item.priority === "P1").length,
    requirements: aiStewardRequirements,
    quickQuestions,
    voiceInteraction: {
      mode: "真实系统语音识别，不生成样例内容",
      requires: ["HTTPS 安全来源", "浏览器 SpeechRecognition/webkitSpeechRecognition 支持", "用户允许麦克风权限"],
      apiEndpoint: "/api/ai/voice/transcribe",
    },
    serviceRecommendation: {
      apiEndpoint: "/api/ai/recommendations",
      sample: serviceRecommendationsForIntent("general", db),
    },
    serviceRecords: {
      apiEndpoint: "/api/ai/service-records",
      recentConversations: latestHistory,
      total: (db.aiHistory || []).length,
    },
    runtime: {
      maxResponseMs: 5000,
      friendlyToneRequired: true,
      supportedTopics: ["天气", "旅居地", "住宿", "活动", "交通", "政策", "健康常识"],
    },
  };
}

function validateAiStewardRequirements() {
  const errors = [];
  const expectedRows = [
    ["AI 问答", "支持用户输入文字问题，围绕天气、旅居地、住宿、活动、交通、政策、健康常识等回答。", "P0"],
    ["语音互动", "支持按住说话并调用浏览器系统语音识别；未返回真实识别结果时明确提示不可识别。", "P1"],
    ["快捷问题", "提供常见问题卡片，如推荐旅居地、最近活动、天气、预订公寓等。", "P0"],
    ["服务推荐", "AI回答中可推荐活动、人工向导、商户服务等。", "P1"],
    ["服务记录", "保留对话历史和服务咨询记录。", "P1"],
  ];
  expectedRows.forEach(([feature, detail, priority], index) => {
    const row = aiStewardRequirements[index];
    if (!row || row.feature !== feature || row.detail !== detail || row.priority !== priority) {
      errors.push({ index, feature, issue: "需求行与 4.3 图示不一致" });
    }
  });
  if (!quickQuestions.some((item) => item.title === "推荐旅居地") || !quickQuestions.some((item) => item.title === "预订公寓")) {
    errors.push({ feature: "快捷问题", issue: "快捷问题缺少图示示例" });
  }
  aiStewardRequirements.forEach((item) => {
    if (!item.acceptance || !item.apiEndpoints.length) {
      errors.push({ feature: item.feature, issue: "缺少验收标准或接口" });
    }
  });
  return {
    version: AI_STEWARD_REQUIREMENTS_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  AI_STEWARD_REQUIREMENTS_VERSION,
  aiStewardRequirements,
  quickQuestions,
  aiStewardRequirementsForApi,
  inferIntent,
  normalizeAiChatPayload,
  serviceRecommendationsForIntent,
  normalizeVoiceTranscript,
  validateAiStewardRequirements,
};
