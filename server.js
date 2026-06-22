const fs = require("fs");
const http = require("http");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");
const QRCode = require("qrcode");
const { adminFunctionOverviewForApi, validateAdminFunctionOverview } = require("./server/lib/admin-function-overview");
const { adminScreensForApi, validateAdminDataScreens } = require("./server/lib/admin-data-screens");
const { getAuth, hasPermission, issueToken } = require("./server/lib/auth");
const {
  aiStewardRequirementsForApi,
  normalizeAiChatPayload,
  normalizeVoiceTranscript,
  quickQuestions,
  serviceRecommendationsForIntent,
  validateAiStewardRequirements,
} = require("./server/lib/ai-steward-requirements");
const {
  activityMapRequirementsForApi,
  normalizeActivityMapPoint,
  validateActivityMapRequirements,
} = require("./server/lib/activity-map-requirements");
const { businessFlowForApi, validateBusinessFlow } = require("./server/lib/business-flow");
const { collaborationForApi, validateCollaborationRules } = require("./server/lib/collaboration-notifications");
const { initialDeliveryScopeForApi, validateInitialDeliveryScope } = require("./server/lib/initial-delivery-scope");
const { mvpDeliveryCompletionForApi } = require("./server/lib/mvp-delivery-completion");
const { mvpPrinciplesForApi, validateMvpPrinciples } = require("./server/lib/mvp-principles");
const { roleEndpointDivisionForApi, validateRoleEndpointDivision } = require("./server/lib/role-endpoint-division");
const { guideFunctionOverviewForApi, validateGuideFunctionOverview } = require("./server/lib/guide-function-overview");
const {
  guideOrderRequirementsForApi,
  matchGuideOrderRequirement,
  normalizeGuideOrderFields,
  orderLocationFromRequirement,
  orderTimeFromRequirement,
  validateGuideOrderRequirements,
} = require("./server/lib/guide-order-requirements");
const { guideOrderStatusFlowForApi, validateGuideOrderStatusFlow } = require("./server/lib/guide-order-status-flow");
const { merchantFunctionOverviewForApi, validateMerchantFunctionOverview } = require("./server/lib/merchant-function-overview");
const { merchantServiceCategoriesForApi, validateMerchantServiceCategories } = require("./server/lib/merchant-service-categories");
const { schemaForApi, validateCoreTables } = require("./server/lib/database-schema");
const { createJsonDatabase } = require("./server/lib/mock-database");
const { createMysqlPoolDatabase } = require("./server/lib/mysql-pool-database");
const {
  contactsForEmergency,
  currentEmergencyLocation,
  emergencyHelpRequirementsForApi,
  healthInfoForEmergency,
  quickHelpChannels,
  validateEmergencyHelpRequirements,
} = require("./server/lib/emergency-help-requirements");
const { smartDeviceRobotRequirementsForApi, validateSmartDeviceRobotRequirements } = require("./server/lib/smart-device-robot-requirements");
const { ensureAlertTransition, ensureOrderTransition, ensureTaskTransition } = require("./server/lib/state-machine");
const { systemModulesForApi, validateSystemModules } = require("./server/lib/system-modules");
const { technologyStackForApi, validateTechnologyStack } = require("./server/lib/technology-stack");
const {
  switchHomeCity,
  updateHomeConfig,
  userHomeRequirementsForApi,
  validateUserHomeRequirements,
} = require("./server/lib/user-home-requirements");
const { userFunctionOverviewForApi, validateUserFunctionOverview } = require("./server/lib/user-function-overview");

function loadLocalEnv() {
  if (process.env.YUNLV_RUNTIME_DIR || process.env.YUNLV_SKIP_DOTENV === "1") return;
  const envFile = path.join(__dirname, ".env");
  if (!fs.existsSync(envFile)) return;
  const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (!key || process.env[key] !== undefined) return;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  });
}

loadLocalEnv();

const PORT = Number(process.env.PORT || 5173);
const ROOT = __dirname;
const RUNTIME_DIR = path.resolve(process.env.YUNLV_RUNTIME_DIR || path.join(ROOT, ".runtime"));
const SEED_DB = path.resolve(process.env.YUNLV_SEED_DB || path.join(ROOT, "data", "mock-db.json"));
const AUTH_SECRET = process.env.YUNLV_AUTH_SECRET || "yunlv-local-demo-secret";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_BASE = (process.env.DEEPSEEK_API_BASE || "https://api.deepseek.com").replace(/\/$/, "");
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";
const database = process.env.DB_CLIENT === "mysql"
  ? createMysqlPoolDatabase({ runtimeDir: RUNTIME_DIR, seedFile: SEED_DB, root: ROOT })
  : createJsonDatabase({ runtimeDir: RUNTIME_DIR, seedFile: SEED_DB });
const DB_FILE = database.dbFile;

const staticMounts = [
  {
    prefix: "/shared/",
    dir: path.join(ROOT, "apps", "shared"),
  },
  {
    prefix: "/user/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现"),
  },
  {
    prefix: "/guide/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图", "向导端", "向导端代码实现"),
  },
  {
    prefix: "/merchant/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype"),
  },
  {
    prefix: "/admin/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui"),
  },
  {
    prefix: "/prototype/user/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现"),
  },
  {
    prefix: "/prototype/guide/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图", "向导端", "向导端代码实现"),
  },
  {
    prefix: "/prototype/merchant/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图", "商户端", "merchant-ui-prototype"),
  },
  {
    prefix: "/prototype/admin/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图", "管理后台", "yunlv-admin-ui"),
  },
  {
    prefix: "/ui-ref/",
    dir: path.join(ROOT, "云旅无忧UI界面参考图"),
  },
  {
    prefix: "/",
    dir: path.join(ROOT, "public"),
  },
];

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

async function ensureDb() {
  await database.ensure();
}

async function readDb() {
  return database.read();
}

async function writeDb(db) {
  await database.write(db);
}

function now() {
  const pad = (value) => String(value).padStart(2, "0");
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function usedIdNumbers(db, prefix) {
  const used = new Set();
  const head = `${prefix}-`;
  Object.values(db || {}).forEach((collection) => {
    if (!Array.isArray(collection)) return;
    collection.forEach((item) => {
      const id = String(item?.id || "");
      if (!id.startsWith(head)) return;
      const number = Number(id.slice(head.length));
      if (Number.isInteger(number) && number > 0) used.add(number);
    });
  });
  return used;
}

function nextId(db, key, prefix) {
  db.counters = db.counters || {};
  const used = usedIdNumbers(db, prefix);
  let value = Number(db.counters[key] || 0);
  used.forEach((number) => {
    if (number > value) value = number;
  });
  do {
    value += 1;
  } while (used.has(value));
  db.counters[key] = value;
  return `${prefix}-${String(value).padStart(4, "0")}`;
}

function nextNo(db, key, prefix) {
  db.counters[key] = (db.counters[key] || 0) + 1;
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${prefix}${day}${String(db.counters[key]).padStart(4, "0")}`;
}

function defaultAdminPolicyDocs() {
  return [
    { id: "policy-001", title: "昆明旅居政策解读（2024最新版）", category: "旅居政策", city: "昆明市", views: 2356, favorites: 256, status: "已发布", updatedAt: "2024-05-18 10:23", source: "昆明市民政局官网", content: "全面解读昆明市针对旅居老人在医疗、交通、文化等方面的最新政策。" },
    { id: "policy-002", title: "云南省长期旅居险政策汇总", category: "旅居政策", city: "云南省", views: 1892, favorites: 178, status: "已发布", updatedAt: "2024-05-17 16:45", source: "云南省政府公开信息", content: "云南省长期旅居保险及补贴相关政策汇总。" },
    { id: "policy-003", title: "异地就医保备案与报销指南", category: "医疗医保", city: "全国", views: 1620, favorites: 210, status: "已发布", updatedAt: "2024-05-16 09:30", source: "国家医保服务平台", content: "异地就医保备案、报销流程与注意事项。" },
    { id: "policy-004", title: "旅居老人安全防护手册", category: "安全指南", city: "全国", views: 1203, favorites: 132, status: "已发布", updatedAt: "2024-05-15 14:22", source: "云旅无忧平台", content: "旅居老人安全防护与紧急处理指南。" },
    { id: "policy-005", title: "昆明公共交通优惠政策大全", category: "交通出行", city: "昆明市", views: 986, favorites: 98, status: "已发布", updatedAt: "2024-05-14 11:05", source: "昆明公交集团", content: "昆明市公共交通适老优惠政策汇总。" },
  ];
}

function defaultAdminKnowledgeItems() {
  return [
    { id: "knowledge-001", title: "昆明旅居补贴申请条件是什么？", category: "旅居政策-补贴指南", city: "昆明市", source: "政府文件", updater: "张小明", status: "已发布", hits: 1286, content: "昆明旅居补贴申请条件、材料和流程说明。" },
    { id: "knowledge-002", title: "长者旅居陪护服务流程", category: "活动服务-报名参与", city: "全国", source: "平台运营", updater: "李向导", status: "已发布", hits: 932, content: "长者旅居陪护服务的下单、执行和回访流程。" },
    { id: "knowledge-003", title: "高血压饮食注意事项", category: "健康常识-慢病管理", city: "全国", source: "权威机构", updater: "王医生", status: "已发布", hits: 812, content: "高血压长者饮食建议与禁忌。" },
    { id: "knowledge-004", title: "机场接送服务范围说明", category: "交通出行-接送服务", city: "昆明/大理", source: "商户提供", updater: "赵经理", status: "已发布", hits: 645, content: "机场接送服务区域、时段和费用说明。" },
    { id: "knowledge-005", title: "平台服务协议解读", category: "平台规则-服务协议", city: "全国", source: "法务审核", updater: "系统", status: "待审核", hits: 582, content: "平台服务协议关键条款解读。" },
  ];
}

function adminPolicyDocs(db) {
  if (!Array.isArray(db.policyDocs) || !db.policyDocs.length) db.policyDocs = defaultAdminPolicyDocs();
  return db.policyDocs;
}

function adminKnowledgeItems(db) {
  if (!Array.isArray(db.knowledgeItems) || !db.knowledgeItems.length) db.knowledgeItems = defaultAdminKnowledgeItems();
  return db.knowledgeItems;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultAdminSystemConfig() {
  return {
    id: "admin-system-config",
    version: "v2.3.0",
    savedAt: "2024-05-19 10:28",
    publishedAt: "2024-05-18 18:30:22",
    updatedAt: "2024-05-19 10:28",
    savedBy: "管理员",
    publishedBy: "管理员",
    status: "已发布",
    platform: {
      name: "云旅无忧 AI智慧旅居平台",
      shortName: "云旅无忧",
      logo: "/user/assets/home-logo-ref.png",
      copyright: "© 2024 云旅无忧 AI智慧旅居平台 版权所有",
      appVersion: "v2.3.0",
    },
    serviceArea: {
      defaultCities: ["弥勒市", "昆明市"],
      rangeTypes: ["行政区域", "自定义范围"],
      mapProvider: "高德地图",
      mapApiKey: "****************abcd",
      positioningAccuracy: "高精度（10米）",
    },
    aiSteward: {
      enabled: Boolean(DEEPSEEK_API_KEY),
      provider: "DeepSeek",
      apiBase: DEEPSEEK_API_BASE,
      apiKey: DEEPSEEK_API_KEY ? "****************" : "",
      model: DEEPSEEK_MODEL,
      timeoutMs: Number(process.env.DEEPSEEK_TIMEOUT_MS || 12000),
      temperature: 0.6,
      maxTokens: 700,
    },
    orderRules: {
      autoCancelMinutes: 30,
      confirmTimeoutMinutes: 60,
      reviewDays: 7,
      rescheduleHours: 24,
      retentionDays: 365,
    },
    sosRules: {
      chain: "设备→平台→家属→人工向导→医院",
      secondReminderMinutes: 3,
      escalationMinutes: 15,
      responseSlaMinutes: 5,
      maxEmergencyContacts: 5,
    },
    deviceSimulation: {
      enabled: true,
      deviceCount: 200,
      refreshSeconds: 30,
      dataTypes: ["心率", "血压", "血氧", "睡眠", "步数"],
    },
    compliance: {
      privacyVersion: "2.1.0",
      medicalDisclaimerVersion: "1.3.0",
      userAgreementVersion: "2.1.0",
      forceConsentOnFirstUse: true,
    },
    businessSwitches: {
      userRegistrationReview: true,
      merchantOnboardingReview: true,
      guideCertificationReview: true,
      activitySignupReview: true,
      priceDisplayMode: "显示实际价格",
      maintenanceMode: false,
    },
    environments: [
      { name: "生产环境", status: "运行中", version: "v2.3.0" },
      { name: "预发布环境", status: "运行中", version: "v2.3.0-rc.2" },
      { name: "测试环境", status: "运行中", version: "v2.3.0-test.1" },
    ],
    releaseLogs: [
      { version: "v2.3.0", time: "2024-05-18 18:30", operator: "管理员", environment: "生产环境", status: "当前" },
      { version: "v2.2.1", time: "2024-05-10 14:22", operator: "张小明", environment: "生产环境", status: "历史" },
      { version: "v2.2.0", time: "2024-04-28 09:15", operator: "李向导", environment: "生产环境", status: "历史" },
    ],
    rollbackVersions: [
      { version: "v2.2.1（稳定版）", time: "2024-05-10 14:22", action: "回滚" },
      { version: "v2.2.0（稳定版）", time: "2024-04-28 09:15", action: "回滚" },
      { version: "v2.1.5（稳定版）", time: "2024-04-15 16:40", action: "回滚" },
    ],
    changeLogs: [
      { time: "2024-05-19 10:28", actor: "管理员", module: "订单规则", field: "自动取消时间", before: "20分钟", after: "30分钟", type: "修改" },
      { time: "2024-05-18 18:30", actor: "管理员", module: "基础配置", field: "平台版本", before: "v2.2.1", after: "v2.3.0", type: "发布" },
      { time: "2024-05-18 18:25", actor: "管理员", module: "SOS规则", field: "响应SLA", before: "3分钟", after: "5分钟", type: "修改" },
    ],
    validation: [
      { item: "订单规则配置校验", status: "通过" },
      { item: "SOS规则配置校验", status: "通过" },
      { item: "地图配置校验", status: "通过" },
      { item: "通知配置校验", status: "通过" },
      { item: "安全配置校验", status: "通过" },
    ],
  };
}

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function deepMergeConfig(base, patch) {
  const next = cloneJson(base || {});
  Object.entries(patch || {}).forEach(([key, value]) => {
    if (value === undefined) return;
    if (isPlainObject(value) && isPlainObject(next[key])) {
      next[key] = deepMergeConfig(next[key], value);
    } else {
      next[key] = cloneJson(value);
    }
  });
  return next;
}

function normalizeAdminSystemConfig(config = {}) {
  const normalized = deepMergeConfig(defaultAdminSystemConfig(), config);
  normalized.releaseLogs = Array.isArray(normalized.releaseLogs) ? normalized.releaseLogs : [];
  normalized.rollbackVersions = Array.isArray(normalized.rollbackVersions) ? normalized.rollbackVersions : [];
  normalized.changeLogs = Array.isArray(normalized.changeLogs) ? normalized.changeLogs : [];
  normalized.validation = Array.isArray(normalized.validation) ? normalized.validation : [];
  normalized.environments = Array.isArray(normalized.environments) ? normalized.environments : [];
  return normalized;
}

function adminSystemConfig(db) {
  db.systemConfig = normalizeAdminSystemConfig(db.systemConfig || {});
  return db.systemConfig;
}

function nextAdminSystemConfigVersion(version = "v2.3.0") {
  const match = String(version).match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return "v2.3.1";
  return `v${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
}

function adminConfigInput(body = {}) {
  return isPlainObject(body.config) ? body.config : body;
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload, null, 2));
}

function ok(res, data, meta = {}) {
  sendJson(res, 200, { success: true, data, meta });
}

function fail(res, status, message, details) {
  sendJson(res, status, { success: false, error: { message, details } });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });
  });
}

function audit(db, actor, action, target, result = "成功") {
  db.auditLogs.unshift({
    id: nextId(db, "audit", "audit"),
    actor,
    action,
    target,
    result,
    createdAt: now(),
    ip: "127.0.0.1",
  });
}

function addMessage(db, toRole, title, content, meta = {}) {
  db.messages.unshift({
    id: nextId(db, "message", "message"),
    toRole,
    title,
    content,
    read: false,
    scenario: meta.scenario || "",
    priority: meta.priority || "普通",
    channels: meta.channels || ["站内消息"],
    relatedType: meta.relatedType || "",
    relatedId: meta.relatedId || "",
    createdAt: now(),
  });
}

function normalizeClientRole(role) {
  const value = String(role || "").toLowerCase();
  if (value === "user") return "elder";
  return value || "elder";
}

function messageRole(role) {
  const value = normalizeClientRole(role);
  if (value === "elder") return "user";
  return value;
}

function authorizedMessageRole(auth, requestedRole) {
  const role = messageRole(auth?.role);
  const requested = requestedRole ? messageRole(requestedRole) : role;
  return requested === role ? role : "";
}

function actionResultText(action = "") {
  const value = String(action || "操作");
  if (/意见反馈|反馈/.test(value)) return "意见反馈已提交到后台工单";
  if (/求助需求|申请帮助/.test(value)) return "求助需求已生成，后台可继续分配服务人员";
  if (/预约|用车|餐厅|体检|护理/.test(value)) return "预约请求已入库，后台与服务方可继续处理";
  if (/联系|拨打|客服/.test(value)) return "联系流程已打开，后台同步生成跟进线索";
  if (/收藏|点赞|有用|关注/.test(value)) return "偏好反馈已保存";
  if (/筛选|搜索|排序/.test(value)) return "筛选条件已应用到当前列表";
  if (/保存|设置|开启|关闭|授权/.test(value)) return "设置已保存";
  if (/工单/.test(value)) return "工单已提交，后台客服可继续处理";
  if (/上传|添加|提交/.test(value)) return "资料已提交到后台";
  if (/查看|详情/.test(value)) return `${value.replace(/^查看/, "")}已展示`;
  return `${value}已记录`;
}

function recordUiAction(db, auth, body = {}) {
  const role = messageRole(body.role || auth?.role);
  const action = String(body.action || "操作");
  const route = body.route || "";
  const target = body.target || "";
  const actor = actorName(auth, "前端用户");
  const latest = db.uiActions[0];
  if (
    latest
    && latest.role === role
    && latest.route === route
    && latest.action === action
    && latest.target === target
    && latest.actor === actor
    && Date.now() - new Date(latest.createdAt).getTime() < 1200
  ) {
    return latest;
  }
  const item = {
    id: nextId(db, "uiAction", "uia"),
    role,
    route,
    action,
    target,
    result: body.result || actionResultText(action),
    payload: body.payload || {},
    actor,
    createdAt: now(),
  };
  db.uiActions.unshift(item);
  audit(db, item.actor, "前端业务动作", `${role}/${item.route}/${action}`, item.result);
  if (/意见反馈|求助需求|预约|异常|投诉/.test(action)) {
    addMessage(db, "admin", "新的前端业务待处理", `${item.actor}在${item.route || "页面"}提交了「${action}」。`);
  }
  return item;
}

function addTimeline(order, status, text) {
  order.timeline = order.timeline || [];
  order.timeline.unshift({ time: now(), status, text });
}

function statusCounts(items, key = "status") {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function deviceExceptionReason(device) {
  const reasons = [];
  if (Number(device.battery || 0) <= 20) reasons.push(`电量${device.battery}%`);
  if (device.onlineStatus && device.onlineStatus !== "在线") reasons.push(device.onlineStatus);
  return reasons.join("、");
}

function recordDeviceException(db, device, auth) {
  const reason = deviceExceptionReason(device);
  if (!reason) return null;
  const existing = db.alerts.find((item) => item.deviceId === device.id && item.status !== "已处理");
  if (existing) {
    existing.level = Number(device.battery || 100) <= 10 || /异常|离线/.test(device.onlineStatus || "") ? "高" : existing.level || "中";
    existing.description = `智能设备${device.deviceId}状态异常：${reason}。`;
    existing.location = device.location || existing.location;
    existing.updatedAt = now();
    return existing;
  }
  const alert = {
    id: nextId(db, "alert", "alert"),
    elderId: db.elderProfile.id,
    elderName: db.elderProfile.name,
    deviceId: device.id,
    type: Number(device.battery || 100) <= 20 ? "设备低电量" : "设备异常",
    level: Number(device.battery || 100) <= 10 || /异常|离线/.test(device.onlineStatus || "") ? "高" : "中",
    location: device.location || db.elderProfile.address,
    status: "待处理",
    description: `智能设备${device.deviceId}状态异常：${reason}。`,
    source: "智能设备",
    createdAt: now(),
    handledBy: "",
  };
  db.alerts.unshift(alert);
  device.lastAlertId = alert.id;
  addMessage(db, "user", "设备异常提醒", `${device.type} ${device.deviceId} 出现${reason}，请及时查看。`, {
    scenario: "设备异常",
    priority: alert.level,
    relatedType: "alert",
    relatedId: alert.id,
  });
  addMessage(db, "family", "设备异常提醒", `${db.elderProfile.name}的${device.type}出现${reason}，平台已生成待处理异常。`, {
    scenario: "设备异常",
    priority: alert.level,
    relatedType: "alert",
    relatedId: alert.id,
  });
  addMessage(db, "admin", "设备异常待处理", `${device.deviceId} 出现${reason}，请跟进设备和老人安全。`, {
    scenario: "设备异常",
    priority: alert.level,
    relatedType: "alert",
    relatedId: alert.id,
  });
  audit(db, actorName(auth, "智能设备"), "设备异常入库", `${device.deviceId}/${reason}`);
  return alert;
}

function createDeviceHelpRequest(db, auth, body = {}) {
  const target = String(body.target || "附近求助").trim();
  const providerType = body.providerType || (/人工向导|向导/.test(target) ? "guide" : "community");
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: auth?.sub || body.userId || "user-001",
    elderName: body.elderName || db.elderProfile.name,
    route: body.route || "robot",
    action: body.action || "智能设备帮助任务",
    type: target || "智能设备求助",
    providerType,
    status: "待处理",
    priority: body.priority || (/SOS|紧急/.test(target) ? "P0" : "P1"),
    description: body.description || `${target}：来自智能设备与小云机器人入口。`,
    payload: {
      source: "4.6 智能设备与小云机器人需求",
      target,
      deviceId: body.deviceId || "",
      ...body.payload,
    },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  addMessage(db, "admin", "智能设备帮助任务", `${requestItem.elderName}提交「${requestItem.type}」，请后台处理或派单。`, {
    scenario: "智能设备帮助",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  addMessage(db, "user", "帮助任务已生成", `您的「${requestItem.type}」已进入后台处理，编号 ${requestItem.requestNo}。`, {
    scenario: "智能设备帮助",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  if (/附近|社区|向导/.test(target)) {
    addMessage(db, providerType === "guide" ? "guide" : "admin", "新的帮助任务", `${requestItem.elderName}需要${target}：${requestItem.description}`, {
      scenario: "智能设备帮助",
      priority: requestItem.priority,
      relatedType: "serviceRequest",
      relatedId: requestItem.id,
    });
  }
  audit(db, actorName(auth, requestItem.elderName), "创建智能设备帮助任务", `${requestItem.requestNo}/${requestItem.type}`);
  return requestItem;
}

function defaultUserPhone(db) {
  return (db.users || []).find((user) => user.role === "elder")?.phone || (db.familyContacts || [])[0]?.phone || "";
}

function emergencyContactSnapshot(db) {
  return contactsForEmergency(db)
    .filter((contact) => contact.notifyAlert)
    .map((contact) => ({
      id: contact.id,
      name: contact.name,
      relation: contact.relation,
      phone: contact.phone,
      callPriority: contact.callPriority,
    }));
}

const emergencyNotificationRuleDefinitions = [
  { key: "sos", title: "SOS 求助", description: "按下 SOS 按键或一键紧急求助时通知" },
  { key: "device", title: "设备异常", description: "手环、机器人等设备异常时通知" },
  { key: "service", title: "服务异常", description: "服务超时、取消等异常情况时通知" },
  { key: "health", title: "健康预警", description: "心率异常、跌倒等健康预警时通知" },
];

function emergencyNotificationSettingsForApi(db) {
  const saved = db.emergencyNotificationSettings || {};
  return {
    apiEndpoint: "/api/alerts/emergency-settings",
    rules: emergencyNotificationRuleDefinitions.map((rule) => ({
      ...rule,
      enabled: saved[rule.key] !== false,
    })),
    updatedAt: saved.updatedAt || "",
  };
}

function contactsPageForApi(db) {
  const contacts = contactsForEmergency(db);
  const notificationSettings = emergencyNotificationSettingsForApi(db);
  return {
    sourceEndpoint: "/api/user/contacts",
    contacts,
    notificationSettings,
    summary: {
      contactCount: contacts.length,
      alertContactCount: contacts.filter((contact) => contact.notifyAlert).length,
      callableContactCount: contacts.filter((contact) => contact.canCall).length,
      defaultContactId: contacts.find((contact) => contact.isDefault)?.id || "",
    },
    endpoints: {
      contacts: "/api/family-contacts",
      notificationSettings: "/api/alerts/emergency-settings",
      call: "/api/family-contacts/{id}/call",
    },
  };
}

function normalizeEmergencyLocation(db, body = {}) {
  return currentEmergencyLocation(db, {
    address: body.address || body.location,
    location: body.location,
    coordinates: body.coordinates,
    accuracy: body.accuracy,
    source: body.locationSource || body.source,
    updatedAt: body.locationUpdatedAt,
  });
}

function sosNotificationText(alert) {
  return `${alert.elderName}在${alert.location}触发 SOS，时间 ${alert.createdAt}，联系电话 ${alert.phone || "未填写"}。`;
}

function createEmergencyQuickHelpRequest(db, auth, body = {}) {
  const channel =
    quickHelpChannels.find((item) => item.key === body.channelKey)
    || quickHelpChannels.find((item) => item.title === body.title || item.target === body.target)
    || quickHelpChannels[0];
  const locationInfo = normalizeEmergencyLocation(db, body);
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: auth?.sub || body.userId || "user-001",
    elderName: body.elderName || db.elderProfile.name,
    route: body.route || "emergency",
    action: body.action || "快速求助",
    type: channel.taskType,
    providerType: channel.providerType,
    status: "待处理",
    priority: channel.priority,
    description: body.description || `${channel.title}：${channel.target}，位置 ${locationInfo.address}。`,
    payload: {
      source: "4.5 紧急求助需求",
      channelKey: channel.key,
      channelTitle: channel.title,
      target: channel.target,
      dialNumber: channel.dialNumber,
      phone: body.phone || defaultUserPhone(db),
      location: locationInfo,
    },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  addMessage(db, "admin", "快速求助任务", `${requestItem.elderName}发起「${channel.title}」，位置 ${locationInfo.address}，请后台跟进。`, {
    scenario: "快速求助",
    priority: channel.priority,
    channels: ["站内消息", "电话接口预留", "短信预留"],
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  addMessage(db, "user", "快速求助已生成", `您的「${channel.title}」已生成求助任务 ${requestItem.requestNo}${channel.dialNumber ? `，可拨打 ${channel.dialNumber}` : ""}。`, {
    scenario: "快速求助",
    priority: channel.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  if (channel.providerType === "guide") {
    addMessage(db, "guide", "紧急人工向导协助", `${requestItem.elderName}需要人工向导协助，位置 ${locationInfo.address}。`, {
      scenario: "快速求助",
      priority: channel.priority,
      relatedType: "serviceRequest",
      relatedId: requestItem.id,
    });
  }
  audit(db, actorName(auth, requestItem.elderName), "创建快速求助任务", `${requestItem.requestNo}/${channel.title}`);
  return {
    ...requestItem,
    channel,
    dialNumber: channel.dialNumber,
    location: locationInfo,
  };
}

const mvpApiContract = [
  { group: "认证", methods: "POST", path: "/auth/login", description: "账号登录并获取 Token" },
  { group: "认证", methods: "POST", path: "/auth/wechat-login", description: "微信登录并获取 Token" },
  { group: "交付范围", methods: "GET", path: "/delivery/initial-scope", description: "首期交付范围" },
  { group: "MVP 原则", methods: "GET", path: "/mvp/principles", description: "两周 MVP 原则与首期边界" },
  { group: "角色端口", methods: "GET", path: "/roles/endpoint-division", description: "角色与端口划分" },
  { group: "业务流程", methods: "GET", path: "/business-flow/overview", description: "总体业务流程与运行数据" },
  { group: "用户", methods: "GET", path: "/user/functions/overview", description: "用户端功能总览与运行数据" },
  { group: "用户", methods: "GET", path: "/user/home-requirements", description: "首页需求与运行数据" },
  { group: "用户", methods: "POST", path: "/user/home-city", description: "首页当前城市手动切换" },
  { group: "用户", methods: "GET/PUT", path: "/user/personal", description: "个人资料、授权与安全码聚合接口" },
  { group: "用户", methods: "GET", path: "/user/guide-page", description: "人工向导预约页聚合数据" },
  { group: "用户", methods: "GET", path: "/user/family", description: "家属关怀页面聚合数据" },
  { group: "用户", methods: "GET", path: "/user/contacts", description: "紧急联系人页面聚合数据" },
  { group: "用户", methods: "GET", path: "/user/device-management", description: "用户设备管理页面聚合数据与操作能力" },
  { group: "用户", methods: "GET", path: "/user/orders", description: "用户订单页面真实搜索、筛选与操作能力" },
  { group: "用户", methods: "GET", path: "/user/activity-records", description: "用户活动报名记录聚合数据与操作能力" },
  { group: "用户", methods: "GET/POST", path: "/user/destinations", description: "用户旅居目的地聚合、详情、收藏与咨询" },
  { group: "用户", methods: "GET/POST/DELETE", path: "/user/service-records", description: "用户服务记录聚合、详情、删除与清空" },
  { group: "用户", methods: "PUT", path: "/user/family/permissions", description: "家属共享权限设置" },
  { group: "用户", methods: "POST", path: "/user/family/invitations", description: "创建家属绑定邀请" },
  { group: "用户", methods: "GET/PUT", path: "/user/profile", description: "用户资料" },
  { group: "用户", methods: "GET/PUT", path: "/elder/profile", description: "老人档案" },
  { group: "活动", methods: "GET", path: "/activities", description: "活动列表" },
  { group: "活动", methods: "GET", path: "/activities/map-requirements", description: "活动地图需求与运行数据" },
  { group: "活动", methods: "GET", path: "/activities/map", description: "地图点位" },
  { group: "活动", methods: "GET", path: "/activities/{id}", description: "活动详情" },
  { group: "活动", methods: "POST", path: "/activities/{id}/join", description: "活动报名" },
  { group: "活动", methods: "POST", path: "/activities/{id}/cancel", description: "取消活动报名" },
  { group: "AI 管家", methods: "GET", path: "/ai/steward-requirements", description: "智能管家需求与运行数据" },
  { group: "AI 管家", methods: "POST", path: "/ai/chat", description: "AI 问答" },
  { group: "AI 管家", methods: "GET", path: "/ai/history", description: "问答历史" },
  { group: "AI 管家", methods: "GET", path: "/ai/quick-questions", description: "快捷问题" },
  { group: "AI 管家", methods: "POST", path: "/ai/quick-questions/{id}/ask", description: "快捷问题自动提问" },
  { group: "AI 管家", methods: "POST", path: "/ai/voice/transcribe", description: "接收浏览器语音识别结果并进入 AI 对话" },
  { group: "AI 管家", methods: "GET", path: "/ai/recommendations", description: "服务推荐入口" },
  { group: "AI 管家", methods: "GET", path: "/ai/service-records", description: "服务咨询记录" },
  { group: "订单", methods: "POST", path: "/orders", description: "创建订单" },
  { group: "订单", methods: "GET", path: "/orders", description: "订单列表" },
  { group: "订单", methods: "GET", path: "/orders/{id}", description: "订单详情" },
  { group: "订单", methods: "POST", path: "/orders/{id}/cancel", description: "取消订单" },
  { group: "派单", methods: "POST", path: "/tasks/dispatch", description: "后台派单" },
  { group: "派单", methods: "POST", path: "/tasks/{id}/accept", description: "执行方接单" },
  { group: "派单", methods: "POST", path: "/tasks/{id}/start", description: "开始服务" },
  { group: "派单", methods: "POST", path: "/tasks/{id}/complete", description: "完成服务" },
  { group: "设备", methods: "GET", path: "/devices", description: "设备列表" },
  { group: "设备", methods: "POST", path: "/devices/bind", description: "绑定设备" },
  { group: "设备", methods: "GET", path: "/health/overview", description: "健康概览" },
  { group: "设备", methods: "GET/PUT", path: "/health/record", description: "用户健康档案聚合与编辑" },
  { group: "设备", methods: "POST", path: "/health/record/sync", description: "同步健康设备档案数据" },
  { group: "设备", methods: "GET/POST", path: "/user/health-services", description: "用户健康服务聚合、快捷动作、预约与咨询" },
  { group: "设备", methods: "GET", path: "/devices/robot-requirements", description: "智能设备与小云机器人需求" },
  { group: "设备", methods: "POST", path: "/devices/help-request", description: "智能设备帮助任务" },
  { group: "SOS", methods: "POST", path: "/alerts/sos", description: "紧急求助" },
  { group: "SOS", methods: "GET", path: "/alerts/emergency-requirements", description: "紧急求助需求与页面运行数据" },
  { group: "SOS", methods: "GET/PUT", path: "/alerts/emergency-settings", description: "紧急通知规则" },
  { group: "SOS", methods: "POST", path: "/alerts/quick-help", description: "快速求助任务" },
  { group: "SOS", methods: "GET", path: "/alerts", description: "异常列表" },
  { group: "SOS", methods: "POST", path: "/alerts/{id}/handle", description: "处理异常" },
  { group: "用户", methods: "GET/POST", path: "/family-contacts", description: "紧急联系人列表与新增" },
  { group: "用户", methods: "PUT/DELETE", path: "/family-contacts/{id}", description: "紧急联系人编辑与删除" },
  { group: "用户", methods: "POST", path: "/family-contacts/{id}/call", description: "拨打紧急联系人" },
  { group: "商户", methods: "GET/POST", path: "/merchant/services", description: "商户服务" },
  { group: "商户", methods: "GET", path: "/merchant/orders", description: "商户订单" },
  { group: "商户", methods: "POST", path: "/merchant/orders/{id}/start", description: "商户开始服务" },
  { group: "商户", methods: "GET", path: "/merchant/stats", description: "商户收入、接单、完成与待结算统一统计" },
  { group: "商户", methods: "GET", path: "/merchant/functions/overview", description: "商户功能总览" },
  { group: "商户", methods: "GET", path: "/merchant/service-categories", description: "商户服务分类建议" },
  { group: "统计", methods: "GET", path: "/provider/stats", description: "执行方统一统计接口" },
  { group: "向导", methods: "GET", path: "/guide/home", description: "向导端首页工作台聚合数据" },
  { group: "向导", methods: "GET", path: "/guide/mine", description: "向导端我的页面聚合数据" },
  { group: "向导", methods: "GET", path: "/guide/hall", description: "向导端接单大厅聚合数据" },
  { group: "向导", methods: "GET", path: "/guide/active-service", description: "向导端服务中页面聚合数据" },
  { group: "向导", methods: "GET", path: "/guide/messages", description: "向导端消息中心聚合数据" },
  { group: "向导", methods: "GET/PUT", path: "/guide/profile", description: "向导端个人资料、紧急联系人与认证材料" },
  { group: "向导", methods: "POST", path: "/guide/profile/certification", description: "向导端认证材料提交与复核状态" },
  { group: "向导", methods: "GET/PUT", path: "/guide/settings", description: "向导端设置、隐私、通知与协议确认" },
  { group: "向导", methods: "POST", path: "/guide/session/logout", description: "向导端退出登录" },
  { group: "向导", methods: "GET", path: "/guide/stats", description: "向导收入、接单、完成与待结算统一统计" },
  { group: "向导", methods: "GET", path: "/guide/functions/overview", description: "向导端功能总览" },
  { group: "向导", methods: "GET", path: "/guide/order-requirements", description: "旅居管家与人工向导下单需求" },
  { group: "向导", methods: "GET", path: "/guide/order-status-flow", description: "人工向导端订单状态流" },
  { group: "向导", methods: "POST", path: "/guide/tasks/{id}/decline|ignore|cancel", description: "向导拒绝、忽略或申请取消任务" },
  { group: "后台", methods: "GET", path: "/admin/dashboard", description: "后台看板" },
  { group: "后台", methods: "GET/PUT", path: "/admin/content/home", description: "首页 Banner 与城市配置" },
  { group: "后台", methods: "GET/PUT/POST", path: "/admin/config", description: "系统配置读取、保存、发布与恢复默认" },
  { group: "后台", methods: "GET", path: "/admin/orders", description: "后台订单" },
  { group: "后台", methods: "GET", path: "/admin/alerts", description: "后台异常" },
  { group: "验收", methods: "GET", path: "/admin/mvp-delivery/completion", description: "MVP 交付级总验收结果" },
];

const mvpBareApiPaths = new Set([
  "/auth/login",
  "/auth/wechat-login",
  "/delivery/initial-scope",
  "/mvp/principles",
  "/roles/endpoint-division",
  "/business-flow/overview",
  "/user/functions/overview",
  "/user/home-requirements",
  "/user/home-city",
  "/user/personal",
  "/user/guide-page",
  "/user/family",
  "/user/contacts",
  "/user/device-management",
  "/user/orders",
  "/user/activity-records",
  "/user/destinations",
  "/user/service-records",
  "/user/service-records/clear",
  "/user/family/permissions",
  "/user/family/invitations",
  "/user/profile",
  "/elder/profile",
  "/activities",
  "/activities/map-requirements",
  "/activities/map",
  "/ai/steward-requirements",
  "/ai/chat",
  "/ai/history",
  "/ai/quick-questions",
  "/ai/voice/transcribe",
  "/ai/recommendations",
  "/ai/service-records",
  "/orders",
  "/tasks/dispatch",
  "/devices",
  "/devices/bind",
  "/devices/robot-requirements",
  "/devices/help-request",
  "/health/overview",
  "/health/record",
  "/health/record/sync",
  "/user/health-services",
  "/user/health-services/quick-action",
  "/alerts/sos",
  "/alerts/emergency-requirements",
  "/alerts/emergency-settings",
  "/alerts/quick-help",
  "/alerts",
  "/family-contacts",
  "/merchant/services",
  "/merchant/orders",
  "/merchant/stats",
  "/merchant/functions/overview",
  "/merchant/service-categories",
  "/merchant/categories",
  "/provider/stats",
  "/guide/home",
  "/guide/mine",
  "/guide/hall",
  "/guide/active-service",
  "/guide/messages",
  "/guide/profile",
  "/guide/profile/certification",
  "/guide/settings",
  "/guide/session/logout",
  "/guide/stats",
  "/guide/functions/overview",
  "/guide/order-requirements",
  "/guide/order-status-flow",
  "/guide/tasks",
  "/guide/categories",
  "/guide/claim-next",
  "/guide/tasks/claim-next",
  "/admin/dashboard",
  "/admin/content/home",
  "/admin/orders",
  "/admin/alerts",
  "/admin/dispatch",
  "/admin/dispatch/pending",
  "/admin/mvp-delivery/completion",
]);

const mvpBareApiPatterns = [
  /^\/activities\/[^/]+$/,
  /^\/activities\/[^/]+\/join$/,
  /^\/activities\/[^/]+\/cancel$/,
  /^\/ai\/quick-questions\/[^/]+\/ask$/,
  /^\/orders\/[^/]+$/,
  /^\/orders\/[^/]+\/cancel$/,
  /^\/tasks\/[^/]+\/(accept|start|complete)$/,
  /^\/merchant\/orders\/[^/]+\/(quote|confirm|start|complete|reject|reschedule)$/,
  /^\/merchant\/orders\/[^/]+$/,
  /^\/guide\/tasks\/[^/]+\/(decline|ignore|cancel)$/,
  /^\/guide\/orders\/[^/]+\/(confirm|accept|start|arrive|complete)$/,
  /^\/alerts\/[^/]+\/handle$/,
  /^\/family-contacts\/[^/]+$/,
  /^\/family-contacts\/[^/]+\/call$/,
  /^\/user\/destinations\/[^/]+$/,
  /^\/user\/destinations\/[^/]+\/(favorite|consult|view)$/,
  /^\/user\/service-records\/[^/]+$/,
  /^\/user\/service-records\/[^/]+\/detail$/,
  /^\/user\/health-services\/[^/]+\/(book|consult)$/,
];

function isMvpBareApiPath(pathname) {
  if (!pathname || pathname.startsWith("/api/")) return false;
  return mvpBareApiPaths.has(pathname) || mvpBareApiPatterns.some((pattern) => pattern.test(pathname));
}

function canonicalApiPath(pathname) {
  if (pathname.startsWith("/api/")) return pathname;
  return isMvpBareApiPath(pathname) ? `/api${pathname}` : pathname;
}

function publicApi(req, pathname) {
  return (
    req.method === "OPTIONS" ||
    pathname === "/api/health" ||
    pathname === "/api/reference" ||
    (req.method === "GET" && /^\/api\/user\/safety-code\/[^/]+$/.test(pathname)) ||
    (req.method === "POST" && ["/api/auth/login", "/api/auth/wechat-login"].includes(pathname))
  );
}

function permissionFor(req, pathname) {
  if (publicApi(req, pathname)) return null;
  if (pathname === "/api/ui/actions") return "ui:action";
  if (pathname === "/api/messages/read-all" || /^\/api\/messages\/[^/]+\/read$/.test(pathname)) return "message:write";
  if (pathname === "/api/messages") return "message:read";
  if (pathname.startsWith("/api/user/")) return req.method === "GET" ? "user:read" : "user:write";
  if (pathname.startsWith("/api/elder/")) return req.method === "GET" ? "user:read" : "user:write";
  if (pathname.startsWith("/api/activities/") && req.method === "POST") return "activity:join";
  if (pathname.startsWith("/api/activities")) return "activity:read";
  if (pathname === "/api/service-requests" && req.method === "POST") return "order:create";
  if (pathname.startsWith("/api/service-requests/") && req.method === "POST") return "admin:write";
  if (pathname.startsWith("/api/service-requests")) return req.method === "GET" ? "order:read" : "admin:write";
  if (pathname === "/api/services") return "service:read";
  if (pathname === "/api/guides") return "guide:read";
  if (pathname === "/api/merchants") return "merchant:read";
  if (pathname === "/api/reviews") return "order:read";
  if (pathname.startsWith("/api/ai/")) return "ai:chat";
  if (pathname === "/api/provider/stats") return "order:read";
  if (pathname === "/api/merchant/profile" && req.method === "PUT") return "merchant:write";
  if (pathname === "/api/merchant/photos" && req.method === "PUT") return "merchant:write";
  if (/^\/api\/merchant\/photos\/[^/]+$/.test(pathname) && req.method === "DELETE") return "merchant:write";
  if (pathname === "/api/merchant/profile/online" && req.method === "POST") return "merchant:write";
  if (pathname === "/api/merchant/security/toggle" && req.method === "POST") return "merchant:write";
  if (pathname === "/api/merchant/security/logout-devices" && req.method === "POST") return "merchant:write";
  if (pathname === "/api/merchant/settings" && req.method === "PUT") return "merchant:write";
  if (pathname === "/api/merchant/settings/export" && req.method === "POST") return "merchant:write";
  if (pathname === "/api/merchant/privacy" && req.method === "PUT") return "merchant:write";
  if (pathname === "/api/merchant/permissions" && req.method === "PUT") return "merchant:write";
  if (pathname === "/api/merchant/session/logout" && req.method === "POST") return "merchant:write";
  if (pathname === "/api/merchant/support/contact" && req.method === "POST") return "merchant:write";
  if (pathname === "/api/merchant/invoices/preferences" && req.method === "PUT") return "merchant:write";
  if (pathname === "/api/merchant/invoices/apply" && req.method === "POST") return "merchant:write";
  if (pathname === "/api/merchant/service-categories/selection" && req.method === "POST") return "merchant:service:write";
  if (pathname === "/api/merchant/services" && req.method === "POST") return "merchant:service:write";
  if (pathname.startsWith("/api/merchant/orders/")) return "merchant:order:write";
  if (pathname === "/api/merchant/exception") return "merchant:order:write";
  if (/^\/api\/merchant\/services\/[^/]+\/status$/.test(pathname)) return "merchant:service:write";
  if (pathname.startsWith("/api/merchant/")) return "merchant:read";
  if (pathname === "/api/guide/tasks/claim-next") return "guide:write";
  if (/^\/api\/guide\/orders\/[^/]+\/(confirm|accept|start|arrive|complete)$/.test(pathname)) return "order:confirm";
  if (pathname === "/api/guide/order-requirements" || pathname === "/api/guide/order-status-flow") return "order:read";
  if (pathname === "/api/orders" && req.method === "POST") return "order:create";
  if (/^\/api\/orders\/[^/]+\/cancel$/.test(pathname)) return "order:cancel";
  if (pathname.includes("/confirm")) return "order:confirm";
  if (pathname.startsWith("/api/orders")) return "order:read";
  if (pathname === "/api/tasks/dispatch") return "task:write";
  if (pathname.startsWith("/api/tasks/") && req.method === "POST") return "task:write";
  if (pathname === "/api/tasks") return "task:read";
  if (pathname.startsWith("/api/guide/")) return req.method === "GET" ? "guide:read" : "guide:write";
  if (pathname === "/api/devices/bind") return "user:write";
  if (pathname === "/api/devices/help-request") return "order:create";
  if (/^\/api\/devices\/[^/]+\/action$/.test(pathname)) return "ui:action";
  if (pathname.startsWith("/api/devices")) return "health:read";
  if (pathname === "/api/health/record") return req.method === "GET" ? "health:read" : "user:write";
  if (pathname === "/api/health/record/sync") return "ui:action";
  if (pathname.startsWith("/api/health/")) return "health:read";
  if (pathname === "/api/family-contacts") return req.method === "GET" ? "user:read" : "user:write";
  if (/^\/api\/family-contacts\/[^/]+\/call$/.test(pathname)) return "ui:action";
  if (/^\/api\/family-contacts\/[^/]+$/.test(pathname)) return req.method === "GET" ? "user:read" : "user:write";
  if (pathname === "/api/alerts/emergency-requirements") return "user:read";
  if (pathname === "/api/alerts/emergency-settings") return req.method === "GET" ? "user:read" : "user:write";
  if (pathname === "/api/alerts/quick-help") return req.method === "GET" ? "alert:read" : "order:create";
  if (pathname === "/api/alerts/sos") return "alert:create";
  if (pathname.startsWith("/api/alerts/") && req.method === "POST") return "alert:write";
  if (pathname.startsWith("/api/alerts")) return "alert:read";
  if (pathname === "/api/delivery/initial-scope") return "system:read";
  if (pathname === "/api/mvp/principles") return "system:read";
  if (pathname === "/api/roles/endpoint-division") return "system:read";
  if (pathname === "/api/admin/demo/reset") return "admin:write";
  if (pathname === "/api/admin/demo/create-subjects") return "admin:write";
  if (pathname === "/api/integrations/status") return "system:read";
  if (pathname.startsWith("/api/integrations/")) return "admin:write";
  if (pathname === "/api/admin/priority/status") return "admin:read";
  if (pathname === "/api/admin/dispatch/pending" || pathname === "/api/admin/dispatch") return "admin:read";
  if (pathname === "/api/guide/claim-next") return "guide:write";
  if (pathname === "/api/merchant/categories") return "merchant:read";
  if (pathname.startsWith("/api/admin/database")) return "system:read";
  if (pathname === "/api/admin/ui-actions") return "admin:read";
  if (pathname.startsWith("/api/admin/")) return req.method === "GET" ? "admin:read" : "admin:write";
  return "admin:read";
}

function requireAuth(req, res, permission) {
  const auth = getAuth(req, AUTH_SECRET);
  if (!auth) {
    fail(res, 401, "未登录或登录已过期");
    return null;
  }
  if (!hasPermission(auth, permission)) {
    fail(res, 403, `权限不足：需要 ${permission}`);
    return null;
  }
  return auth;
}

function actorName(auth, fallback = "系统") {
  return auth?.name || fallback;
}

function userForAuth(db, auth, fallbackRole = "elder") {
  return (
    db.users.find((item) => item.id === auth?.sub) ||
    db.users.find((item) => item.role === (auth?.role || fallbackRole)) ||
    db.users[0]
  );
}

const ADMIN_MAP_CITY_COORDS = {
  昆明市: { city: "昆明市", lng: 102.833, lat: 24.881, x: 47, y: 43 },
  弥勒市: { city: "弥勒市", lng: 103.4148, lat: 24.4105, x: 62, y: 64 },
  大理市: { city: "大理市", lng: 100.2676, lat: 25.6065, x: 18, y: 23 },
  曲靖市: { city: "曲靖市", lng: 103.7962, lat: 25.4900, x: 74, y: 28 },
  丽江市: { city: "丽江市", lng: 100.233, lat: 26.872, x: 18, y: 16 },
  玉溪市: { city: "玉溪市", lng: 102.547, lat: 24.352, x: 48, y: 66 },
  保山市: { city: "保山市", lng: 99.161, lat: 25.112, x: 10, y: 45 },
  红河州: { city: "红河州", lng: 103.375, lat: 23.364, x: 64, y: 75 },
  文山州: { city: "文山州", lng: 104.244, lat: 23.369, x: 82, y: 75 },
  西双版纳州: { city: "西双版纳州", lng: 100.797, lat: 22.001, x: 28, y: 86 },
};

const ADMIN_MAP_CITY_PATTERNS = [
  ["弥勒市", /弥勒|湖泉|东风韵/],
  ["昆明市", /昆明|翠湖|五华|盘龙|官渡|西山|呈贡|滇池|长水|第一人民医院/],
  ["大理市", /大理|洱海|苍山/],
  ["曲靖市", /曲靖|麒麟/],
  ["丽江市", /丽江|古城|玉龙/],
  ["玉溪市", /玉溪|红塔|抚仙湖/],
  ["保山市", /保山|腾冲/],
  ["红河州", /红河|建水|蒙自|元阳/],
  ["文山州", /文山|普者黑/],
  ["西双版纳州", /西双版纳|版纳|景洪/],
];

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function adminMapProject(lng, lat) {
  const x = 8 + ((Number(lng) - 98.8) / (105.4 - 98.8)) * 84;
  const y = 8 + ((27.4 - Number(lat)) / (27.4 - 21.7)) * 84;
  return {
    x: Math.round(clampNumber(x, 8, 92) * 10) / 10,
    y: Math.round(clampNumber(y, 8, 92) * 10) / 10,
  };
}

function adminMapCityFromText(text = "") {
  const value = String(text || "");
  const matched = ADMIN_MAP_CITY_PATTERNS.find(([, pattern]) => pattern.test(value));
  return matched?.[0] || "昆明市";
}

function adminMapResolveLocation(input = "", coordinates = null) {
  const text = String(input || "");
  const embedded = text.match(/([1-9]\d{1,2}(?:\.\d+)?)\s*[,，]\s*([1-9]\d?(?:\.\d+)?)/);
  const lng = Number(coordinates?.lng ?? coordinates?.longitude ?? embedded?.[1]);
  const lat = Number(coordinates?.lat ?? coordinates?.latitude ?? embedded?.[2]);
  const city = adminMapCityFromText(text);
  if (Number.isFinite(lng) && Number.isFinite(lat)) {
    return { city, lng, lat, ...adminMapProject(lng, lat), source: embedded ? "业务位置坐标" : "业务坐标字段" };
  }
  const fallback = ADMIN_MAP_CITY_COORDS[city] || ADMIN_MAP_CITY_COORDS["昆明市"];
  return { ...fallback, source: "业务地址解析" };
}

function buildAdminDashboardMapData(db) {
  const points = [];
  const cityMap = new Map();
  const addCityMetric = (point, key, amount = 0) => {
    const coord = ADMIN_MAP_CITY_COORDS[point.city] || adminMapResolveLocation(point.city);
    const current = cityMap.get(point.city) || {
      city: point.city,
      lng: coord.lng,
      lat: coord.lat,
      x: coord.x,
      y: coord.y,
      total: 0,
      alerts: 0,
      orders: 0,
      guides: 0,
      merchants: 0,
      devices: 0,
      activities: 0,
      revenue: 0,
    };
    current.total += 1;
    current[key] = Number(current[key] || 0) + 1;
    current.revenue += Number(amount || 0);
    cityMap.set(point.city, current);
  };
  const pushPoint = (kind, source, config) => {
    if (!source) return;
    const resolved = adminMapResolveLocation(config.location, config.coordinates);
    const point = {
      id: `${kind}:${source.id || source.orderNo || source.deviceId || points.length + 1}`,
      sourceId: source.id || source.orderNo || source.deviceId || "",
      type: kind,
      typeName: config.typeName,
      title: config.title,
      subtitle: config.subtitle,
      status: config.status || "",
      route: config.route,
      location: config.location || resolved.city,
      city: resolved.city,
      lng: resolved.lng,
      lat: resolved.lat,
      x: resolved.x,
      y: resolved.y,
      tone: config.tone || "blue",
      metric: config.metric || "1",
      amount: Number(config.amount || 0),
      sourceEndpoint: config.sourceEndpoint,
      coordinateSource: resolved.source,
      updatedAt: config.updatedAt || now(),
    };
    points.push(point);
    addCityMetric(point, config.cityMetricKey, point.amount);
  };

  db.alerts
    .filter((item) => item.status !== "已处理")
    .slice(0, 16)
    .forEach((alert) => {
      const high = ["高", "最高"].includes(alert.level) || /SOS|报警|摔倒/.test(`${alert.type || ""}${alert.description || ""}`);
      pushPoint("alert", alert, {
        typeName: "异常/SOS",
        title: `${alert.type || "异常"} · ${alert.elderName || "老人"}`,
        subtitle: `${alert.status || "待处理"} · ${alert.level || "普通"}优先级 · ${alert.source || "前端"}`,
        status: alert.status,
        route: /设备|离线|电量/.test(`${alert.type || ""}${alert.description || ""}`) ? "device-exception" : "exceptions",
        location: alert.location || alert.description || db.elderProfile?.address,
        tone: high ? "red" : "orange",
        metric: high ? "SOS" : "异常",
        cityMetricKey: "alerts",
        sourceEndpoint: "/api/admin/alerts",
        updatedAt: alert.createdAt,
      });
    });

  db.orders
    .filter((item) => !["已完成", "已取消"].includes(item.status))
    .slice(0, 12)
    .forEach((order) => pushPoint("order", order, {
      typeName: "订单",
      title: `${order.serviceType || "服务"} · ${order.orderNo || order.id}`,
      subtitle: `${order.elderName || "用户"} · ${order.status || "待处理"} · ${order.assigneeName || "待分配"}`,
      status: order.status,
      route: "order-detail",
      location: order.location || order.note || db.elderProfile?.address,
      tone: order.status === "待派单" ? "orange" : "blue",
      metric: order.status || "订单",
      amount: order.amount,
      cityMetricKey: "orders",
      sourceEndpoint: "/api/admin/orders",
      updatedAt: latestOrderTime(order),
    }));

  db.guides
    .slice(0, 8)
    .forEach((guide) => pushPoint("guide", guide, {
      typeName: "向导",
      title: `${guide.realName || "向导"} · ${guide.currentStatus || ""}`,
      subtitle: `${guide.onlineStatus || ""} · ${(guide.serviceTypes || []).slice(0, 2).join(" / ")} · ${guide.distanceKm || 0}km`,
      status: guide.currentStatus || guide.onlineStatus,
      route: "guides",
      location: guide.area || "昆明市",
      tone: guide.onlineStatus === "在线" ? "green" : "gray",
      metric: guide.onlineStatus === "在线" ? "在线" : "离线",
      cityMetricKey: "guides",
      sourceEndpoint: "/api/admin/guides",
    }));

  db.merchants
    .slice(0, 8)
    .forEach((merchant) => pushPoint("merchant", merchant, {
      typeName: "商户",
      title: `${merchant.name || "商户"} · ${merchant.type || ""}`,
      subtitle: `${merchant.status || ""} · 服务 ${merchant.serviceCount || 0} 项 · 订单 ${merchant.orderCount || 0}`,
      status: merchant.status,
      route: "merchants",
      location: merchant.address || merchant.city || "昆明市",
      tone: merchant.status === "已通过" ? "green" : "orange",
      metric: `${merchant.orderCount || 0}单`,
      amount: merchant.revenue || merchant.settlementPending,
      cityMetricKey: "merchants",
      sourceEndpoint: "/api/admin/merchants",
    }));

  db.devices
    .slice(0, 8)
    .forEach((device) => pushPoint("device", device, {
      typeName: "设备",
      title: `${device.type || "设备"} · ${device.deviceId || device.id}`,
      subtitle: `${device.onlineStatus || ""} · 电量 ${device.battery ?? "--"}% · ${device.location || ""}`,
      status: device.onlineStatus,
      route: "devices",
      location: device.location || db.elderProfile?.address,
      tone: device.onlineStatus === "在线" ? "cyan" : "red",
      metric: `${device.battery ?? "--"}%`,
      cityMetricKey: "devices",
      sourceEndpoint: "/api/admin/health-records",
      updatedAt: device.lastSync || device.lastSyncAt,
    }));

  db.activities
    .filter((item) => item.status !== "已下线")
    .slice(0, 8)
    .forEach((activity) => pushPoint("activity", activity, {
      typeName: "活动",
      title: `${activity.title || "活动"} · ${activity.category || ""}`,
      subtitle: `${activity.status || ""} · 报名 ${activity.joined || 0}/${activity.quota || 0} · ${activity.time || ""}`,
      status: activity.status,
      route: "activities-content",
      location: activity.location || "弥勒市",
      coordinates: activity.coordinates,
      tone: "purple",
      metric: `${activity.joined || 0}人`,
      cityMetricKey: "activities",
      sourceEndpoint: "/api/admin/activities",
      updatedAt: activity.time,
    }));

  const cityStats = [...cityMap.values()]
    .map((item) => ({
      ...item,
      score: item.alerts * 4 + item.orders * 3 + item.devices * 2 + item.guides + item.merchants + item.activities,
    }))
    .sort((a, b) => b.score - a.score || b.total - a.total)
    .slice(0, 8);

  return {
    provider: "amap",
    providerName: "高德地图",
    sdkUrl: "https://webapi.amap.com/maps?v=2.0",
    center: { ...ADMIN_MAP_CITY_COORDS["昆明市"], address: "云南运营中心" },
    bounds: { province: "云南省", scope: "订单、异常、向导、商户、设备、活动" },
    summary: {
      pointCount: points.length,
      cityCount: cityStats.length,
      alertCount: points.filter((item) => item.type === "alert").length,
      orderCount: points.filter((item) => item.type === "order").length,
      resourceCount: points.filter((item) => ["guide", "merchant", "device", "activity"].includes(item.type)).length,
    },
    layers: ["异常/SOS", "活跃订单", "在线向导", "商户", "设备", "活动"],
    cityStats,
    points,
    updatedAt: now(),
    sourceEndpoints: ["/api/admin/dashboard", "/api/admin/orders", "/api/admin/alerts", "/api/admin/guides", "/api/admin/merchants", "/api/admin/activities"],
  };
}

function adminDateKey(value) {
  const matched = String(value || "").match(/\d{4}-\d{2}-\d{2}/);
  return matched ? matched[0] : "";
}

function adminDateFromKey(key) {
  const [year, month, day] = String(key || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function adminDateKeyFromDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function adminDayLabel(key) {
  return String(key || "").slice(5).replace("-", "-");
}

function latestAdminBusinessDate(db) {
  const keys = [
    ...(db.orders || []).flatMap((item) => [adminDateKey(item.createdAt), adminDateKey(item.time), adminDateKey(latestOrderTime(item))]),
    ...(db.healthRecords || []).map((item) => adminDateKey(item.recordedAt)),
    ...(db.alerts || []).map((item) => adminDateKey(item.createdAt)),
    ...(db.devices || []).flatMap((item) => [adminDateKey(item.lastSync), adminDateKey(item.lastSyncAt)]),
  ].filter(Boolean).sort();
  return keys.at(-1) || todayPrefix();
}

function latestAdminOrderDate(db) {
  const sourceRows = (db.orders || []).filter((item) => !CANCELLED_STATUSES.has(item.status));
  const rows = sourceRows.length ? sourceRows : (db.orders || []);
  const keys = rows
    .flatMap((item) => [adminDateKey(item.time), adminDateKey(item.createdAt)])
    .filter(Boolean)
    .sort();
  return keys.at(-1) || latestAdminBusinessDate(db);
}

function adminRecentDateKeysFromEnd(endKey, days = 7) {
  const end = adminDateFromKey(endKey) || new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (days - 1 - index));
    return adminDateKeyFromDate(date);
  });
}

function adminSegmentText(count, total, unit = "项") {
  const numeric = Number(count || 0);
  const percent = total ? Math.round((numeric / total) * 100) : 0;
  return `${numeric.toLocaleString("zh-CN")} ${unit}（${percent}%）`;
}

function adminSegment(name, count, total, color, route, unit = "项") {
  const numeric = Number(count || 0);
  return {
    name,
    count: numeric,
    value: total ? Math.max(1, Math.round((numeric / total) * 100)) : 0,
    text: adminSegmentText(numeric, total, unit),
    color,
    route,
  };
}

function buildAdminServiceTrend(db) {
  const keys = adminRecentDateKeysFromEnd(latestAdminOrderDate(db), 7);
  const rowsByDay = new Map(keys.map((key) => [key, []]));
  (db.orders || []).forEach((order) => {
    const key = adminDateKey(order.time || order.createdAt);
    if (rowsByDay.has(key)) rowsByDay.get(key).push(order);
  });
  const orders = keys.map((key) => rowsByDay.get(key).filter((order) => !CANCELLED_STATUSES.has(order.status)).length);
  const serviceUsers = keys.map((key) => {
    const users = new Set(rowsByDay.get(key)
      .filter((order) => !CANCELLED_STATUSES.has(order.status))
      .map((order) => order.userId || order.elderId || order.elderName || order.id)
      .filter(Boolean));
    return users.size;
  });
  return {
    labels: keys.map(adminDayLabel),
    dates: keys,
    orders,
    serviceUsers,
    totalOrders: orders.reduce((sum, value) => sum + value, 0),
    totalServiceUsers: serviceUsers.reduce((sum, value) => sum + value, 0),
    sourceEndpoint: "/api/admin/orders",
    updatedAt: now(),
  };
}

function buildAdminOrderTypeDistribution(db) {
  const counter = new Map();
  (db.orders || [])
    .filter((order) => !CANCELLED_STATUSES.has(order.status))
    .forEach((order) => {
      const key = order.serviceType || "其他服务";
      counter.set(key, (counter.get(key) || 0) + 1);
    });
  const colors = ["#3185ff", "#20be70", "#ffad24", "#8056e8", "#23c8db"];
  const total = [...counter.values()].reduce((sum, count) => sum + count, 0);
  const sorted = [...counter.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
  const top = sorted.slice(0, 4);
  const rest = sorted.slice(4).reduce((sum, [, count]) => sum + count, 0);
  if (rest > 0) top.push(["其他服务", rest]);
  return {
    total,
    segments: top.map(([name, count], index) => adminSegment(name, count, total, colors[index % colors.length], "orders", "单")),
    sourceEndpoint: "/api/admin/orders",
    updatedAt: now(),
  };
}

function buildAdminHealthDistribution(db) {
  const records = db.healthRecords || [];
  const normalRecords = records.filter((item) => /正常|目标/.test(String(item.status || ""))).length;
  const attentionRecords = Math.max(0, records.length - normalRecords);
  const openAlerts = (db.alerts || []).filter((item) => item.status !== "已处理").length;
  const offlineDevices = (db.devices || []).filter((item) => item.onlineStatus && item.onlineStatus !== "在线").length;
  const total = normalRecords + attentionRecords + openAlerts + offlineDevices;
  return {
    total,
    centerLabel: "健康项",
    segments: [
      adminSegment("正常健康记录", normalRecords, total, "#20be70", "health-records", "条"),
      adminSegment("健康待关注", attentionRecords, total, "#ffad24", "health-records", "条"),
      adminSegment("未处理异常/SOS", openAlerts, total, "#ff5252", "exceptions", "条"),
      adminSegment("离线设备", offlineDevices, total, "#8056e8", "device-exception", "台"),
    ].filter((segment) => segment.count > 0),
    sourceEndpoint: "/api/admin/health-records",
    relatedEndpoints: ["/api/admin/alerts", "/api/admin/health-records"],
    updatedAt: now(),
  };
}

function buildAdminDashboardCharts(db) {
  return {
    serviceTrend: buildAdminServiceTrend(db),
    orderTypes: buildAdminOrderTypeDistribution(db),
    healthStatus: buildAdminHealthDistribution(db),
  };
}

function computeDashboard(db) {
  const openAlerts = db.alerts.filter((item) => item.status !== "已处理");
  const activeOrders = db.orders.filter((item) => !["已完成", "已取消"].includes(item.status));
  const elders = db.users.filter((item) => item.role === "elder" || item.role === "user");
  const todayPrefix = now().slice(0, 10);
  const todayOrders = db.orders.filter((item) => String(item.createdAt || item.time || "").startsWith(todayPrefix));
  const completedOrders = db.orders.filter((item) => item.status === "已完成");
  const cancelledOrders = db.orders.filter((item) => item.status === "已取消");
  const completedReviews = db.reviews.filter((item) => Number(item.rating || 0) > 0);
  const satisfaction = completedReviews.length
    ? `${((completedReviews.filter((item) => Number(item.rating || 0) >= 4).length / completedReviews.length) * 100).toFixed(1)}%`
    : "0%";
  const dataLoop = computeAdminDataLoop(db);
  return {
    stats: {
      userCount: db.users.length,
      elderCount: elders.length || (db.elderProfile ? 1 : 0),
      familyCount: db.familyContacts.length,
      guideCount: db.guides.length,
      merchantCount: db.merchants.length,
      serviceCount: db.services.length,
      activityCount: db.activities.length,
      deviceCount: db.devices.length,
      onlineDevices: db.devices.filter((item) => item.onlineStatus === "在线").length,
      offlineDevices: db.devices.filter((item) => item.onlineStatus !== "在线").length,
      lowBatteryDevices: db.devices.filter((item) => Number(item.battery || 100) <= 20).length,
      pendingOrders: db.orders.filter((item) => ["待派单", "已派单", "待确认"].includes(item.status)).length,
      pendingConfirmOrders: db.orders.filter((item) => item.status === "待确认").length,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      onlineGuides: db.guides.filter((item) => item.onlineStatus === "在线").length,
      availableGuides: db.guides.filter((item) => item.currentStatus === "可接单" || item.onlineStatus === "在线").length,
      todayOrders: todayOrders.length,
      todayServices: todayOrders.length,
      activeTasks: db.tasks.filter((item) => !["已完成", "已取消"].includes(item.status)).length,
      openAlerts: openAlerts.length,
      satisfaction,
      todayRevenue: db.orders.filter((item) => item.status !== "已取消").reduce((sum, item) => sum + Number(item.amount || 0), 0),
    },
    orderStatus: statusCounts(db.orders),
    alertStatus: statusCounts(db.alerts),
    deviceStatus: statusCounts(db.devices, "onlineStatus"),
    guideStatus: statusCounts(db.guides, "currentStatus"),
    recentOrders: db.orders.slice(0, 6),
    recentAlerts: db.alerts.slice(0, 6),
    activeOrders,
    dataLoop,
    map: buildAdminDashboardMapData(db),
    charts: buildAdminDashboardCharts(db),
  };
}

function providerName(db, type, id) {
  if (type === "merchant") return db.merchants.find((item) => item.id === id)?.name || "商户";
  if (type === "guide") return db.guides.find((item) => item.id === id)?.realName || "人工向导";
  return "";
}

function enrichReview(db, review) {
  const order = db.orders.find((item) => item.id === review.orderId || item.orderNo === review.orderNo);
  return {
    ...review,
    providerName: review.assigneeName || providerName(db, review.providerType, review.providerId),
    orderStatus: order?.status || "",
    amount: order?.amount || 0,
    location: order?.location || "",
  };
}

function enrichService(db, service) {
  const provider = providerName(db, service.providerType, service.providerId);
  const orderCount = db.orders.filter((item) => item.serviceType === service.title || item.providerId === service.providerId).length;
  return { ...service, providerName: provider, orderCount };
}

const CANCELLED_STATUSES = new Set(["已取消"]);
const ACTIVE_STATUSES = new Set(["待派单", "已派单", "待接单", "已接单", "已报价", "待服务", "服务中", "待确认"]);
const PAYABLE_STATUSES = new Set(["待确认", "已完成"]);
const SETTLEMENT_PENDING_STATUSES = new Set(["待确认", "已完成"]);
const COMPLETED_STATUSES = new Set(["已完成"]);

function amountOf(order) {
  return Number(order?.amount || order?.quote?.amount || 0);
}

function latestOrderTime(order) {
  return order?.updatedAt || order?.timeline?.[0]?.time || order?.createdAt || order?.time || "";
}

function rowTime(row) {
  return row?.updatedAt || row?.completedAt || latestOrderTime(row?.order) || row?.createdAt || "";
}

function checkoutIncomeTime(row) {
  return row?.order?.paidAt || row?.order?.createdAt || rowTime(row);
}

function timeStartsWith(value, prefix) {
  return Boolean(value && String(value).startsWith(prefix));
}

function rowStatus(row) {
  return row?.order?.status || row?.status || "";
}

function uniqueOrderRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = row?.order?.id || row?.orderId || row?.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sumOrderAmounts(rows) {
  return rows.reduce((sum, row) => sum + amountOf(row.order), 0);
}

function isMerchantCheckoutIncomeOrder(order) {
  if (!order || order.providerType !== "merchant" || CANCELLED_STATUSES.has(order.status)) return false;
  if (Array.isArray(order.items) && order.items.length > 0) return true;
  const text = [order.source, order.serviceType, order.note].filter(Boolean).join(" ");
  return /商城|商品|购物|结算/.test(text);
}

function monthPrefix() {
  return now().slice(0, 7);
}

function todayPrefix() {
  return now().slice(0, 10);
}

function buildCommonProviderStats(rows, extra = {}, options = {}) {
  const today = todayPrefix();
  const month = monthPrefix();
  const activeRows = rows.filter((row) => ACTIVE_STATUSES.has(rowStatus(row)));
  const completedRows = rows.filter((row) => COMPLETED_STATUSES.has(rowStatus(row)));
  const cancelledRows = rows.filter((row) => CANCELLED_STATUSES.has(rowStatus(row)));
  const acceptedRows = rows.filter((row) => !["待派单", "待接单", "已取消"].includes(rowStatus(row)));
  const payableRows = rows.filter((row) => PAYABLE_STATUSES.has(rowStatus(row)));
  const pendingSettlementRows = rows.filter((row) => SETTLEMENT_PENDING_STATUSES.has(rowStatus(row)));
  const todayRows = rows.filter((row) => timeStartsWith(rowTime(row), today));
  const monthRows = rows.filter((row) => timeStartsWith(rowTime(row), month));
  const checkoutIncomeRows = options.includeMerchantCheckoutIncome
    ? rows.filter((row) => isMerchantCheckoutIncomeOrder(row.order))
    : [];
  const incomeRows = uniqueOrderRows([...payableRows, ...checkoutIncomeRows]);
  const todayIncomeRows = uniqueOrderRows([
    ...todayRows.filter((row) => PAYABLE_STATUSES.has(rowStatus(row))),
    ...checkoutIncomeRows.filter((row) => timeStartsWith(checkoutIncomeTime(row), today)),
  ]);
  const todayRevenueRows = todayRows.filter((row) => !CANCELLED_STATUSES.has(rowStatus(row)));
  return {
    source: "server-aggregate",
    generatedAt: now(),
    orderCount: rows.filter((row) => !CANCELLED_STATUSES.has(rowStatus(row))).length,
    acceptedOrders: acceptedRows.length,
    todayOrders: todayRows.filter((row) => !CANCELLED_STATUSES.has(rowStatus(row))).length,
    monthOrders: monthRows.filter((row) => !CANCELLED_STATUSES.has(rowStatus(row))).length,
    monthlyOrders: monthRows.filter((row) => !CANCELLED_STATUSES.has(rowStatus(row))).length,
    activeOrders: activeRows.length,
    activeTasks: activeRows.length,
    completedOrders: completedRows.length,
    cancelledOrders: cancelledRows.length,
    todayIncome: sumOrderAmounts(todayIncomeRows),
    todayIncomeOrders: todayIncomeRows.length,
    todayRevenue: sumOrderAmounts(todayRevenueRows),
    incomeOrders: incomeRows.length,
    revenue: sumOrderAmounts(incomeRows),
    pendingSettlement: sumOrderAmounts(pendingSettlementRows),
    settlementPending: sumOrderAmounts(pendingSettlementRows),
    settlementRecords: pendingSettlementRows.length,
    withdrawable: sumOrderAmounts(completedRows),
    ...extra,
  };
}

function computeGuideStats(db, guideId = "guide-001") {
  const guide = getGuide(db, guideId);
  const tasks = db.tasks.filter((item) => item.assigneeType === "guide" && item.assigneeId === guide.id);
  const taskRows = ordersForTasks(db, tasks);
  const directRows = db.orders
    .filter((item) => item.providerType === "guide" && item.providerId === guide.id)
    .map((order) => ({ id: `order-${order.id}`, orderId: order.id, status: order.status, updatedAt: latestOrderTime(order), order }));
  const rows = uniqueOrderRows([...taskRows, ...directRows]).filter((row) => row.order);
  const pendingOrders = db.orders.filter((item) => item.providerType === "guide" && item.status === "待派单");
  const reviews = db.reviews.filter((item) => item.providerType === "guide" && item.providerId === guide.id).map((item) => enrichReview(db, item));
  const stats = buildCommonProviderStats(rows, {
    pendingOrders: pendingOrders.length,
    reviewCount: reviews.length,
    rating: guide.rating,
  });
  return {
    role: "guide",
    providerId: guide.id,
    provider: {
      ...guide,
      incomeToday: stats.todayIncome,
      monthlyOrders: stats.monthlyOrders,
    },
    stats,
    rows,
    pendingOrders,
    reviews,
  };
}

function dateFromStatValue(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  const date = new Date(text.replace(/-/g, "/"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function statDateKey(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function statMonthDay(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function merchantServiceCategoryFromText(text = "") {
  if (/医|诊|体检/.test(text)) return "医疗服务";
  if (/护理|康养|康复/.test(text)) return "康养护理";
  if (/餐|食|营养/.test(text)) return "营养餐食";
  if (/维修|保洁|生活/.test(text)) return "生活服务";
  return "专业服务";
}

function merchantStatsAnalytics(orders, services, stats) {
  const nonCancelledOrders = orders.filter((order) => !CANCELLED_STATUSES.has(order.status));
  const datedOrders = nonCancelledOrders
    .map((order) => ({
      order,
      date: dateFromStatValue(order.time || order.createdAt || latestOrderTime(order)),
      amount: Number(order.amount || 0),
    }))
    .filter((item) => item.date);
  const latestDate = datedOrders.length
    ? new Date(Math.max(...datedOrders.map((item) => item.date.getTime())))
    : new Date();
  const trend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(latestDate);
    date.setDate(latestDate.getDate() - (6 - index));
    const key = statDateKey(date);
    const rows = datedOrders.filter((item) => statDateKey(item.date) === key);
    return {
      date: key,
      label: statMonthDay(date),
      orderCount: rows.length,
      orderAmount: rows.reduce((sum, item) => sum + item.amount, 0),
      settledAmount: rows
        .filter((item) => /完成|结算/.test(item.order.status || ""))
        .reduce((sum, item) => sum + item.amount, 0),
    };
  });
  const categoryCounts = new Map();
  const categorySource = nonCancelledOrders.length
    ? nonCancelledOrders.map((order) => order.serviceType || order.requirementCategory || "")
    : services.map((service) => service.category || service.title || "");
  categorySource.forEach((text) => {
    const category = merchantServiceCategoryFromText(text);
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  });
  const totalCategoryCount = Array.from(categoryCounts.values()).reduce((sum, value) => sum + value, 0);
  const colors = ["blue", "green", "orange", "purple", "green"];
  const icons = ["clipboard-check", "user-round-check", "utensils", "heart-handshake", "users"];
  const serviceDistribution = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count], index) => ({
      label,
      count,
      percentage: totalCategoryCount ? Math.round((count / totalCategoryCount) * 100) : 0,
      color: colors[index % colors.length],
      icon: icons[index % icons.length],
    }));
  const settlementRows = nonCancelledOrders
    .slice()
    .sort((a, b) => String(b.time || b.createdAt || "").localeCompare(String(a.time || a.createdAt || "")))
    .slice(0, 8)
    .map((order) => {
      const isSettled = /完成|结算/.test(order.status || "");
      return {
        id: order.id,
        orderNo: order.orderNo,
        title: `${order.serviceType || "商户服务"}（${order.elderName || "旅居用户"}）`,
        period: order.time || order.createdAt || "时间待确认",
        amount: Number(order.amount || 0),
        status: isSettled ? "已结算" : "待结算",
        relatedOrderId: order.id,
      };
    });
  return {
    generatedAt: stats.generatedAt,
    trend,
    serviceDistribution,
    settlementRows,
    settledAmount: Number(stats.revenue || 0),
    pendingSettlement: Number(stats.settlementPending || stats.pendingSettlement || 0),
  };
}

function computeMerchantStats(db, merchantId = "merchant-001") {
  const merchant = merchantProfileForApi(db, merchantId);
  const orders = db.orders.filter((item) => item.providerType === "merchant" && (!item.providerId || item.providerId === merchant.id));
  const rows = orders.map((order) => ({ id: `order-${order.id}`, orderId: order.id, status: order.status, updatedAt: latestOrderTime(order), order }));
  const tasks = db.tasks.filter((item) => item.assigneeType === "merchant" && item.assigneeId === merchant.id);
  const services = db.services.filter((item) => item.providerType === "merchant" && item.providerId === merchant.id);
  const reviews = db.reviews.filter((item) => item.providerType === "merchant" && (!item.providerId || item.providerId === merchant.id)).map((item) => enrichReview(db, item));
  const stats = buildCommonProviderStats(rows, {
    pendingOrders: rows.filter((row) => ACTIVE_STATUSES.has(rowStatus(row))).length,
    serviceCount: services.length,
    taskCount: tasks.length,
    reviewCount: reviews.length,
    rating: merchant.rating,
  }, { includeMerchantCheckoutIncome: true });
  const merchantPendingSettlementRows = rows.filter((row) => {
    const status = rowStatus(row);
    return (
      !CANCELLED_STATUSES.has(status)
      && (SETTLEMENT_PENDING_STATUSES.has(status) || !COMPLETED_STATUSES.has(status))
    );
  });
  const merchantPendingSettlement = sumOrderAmounts(merchantPendingSettlementRows);
  stats.pendingSettlement = merchantPendingSettlement;
  stats.settlementPending = merchantPendingSettlement;
  stats.settlementRecords = merchantPendingSettlementRows.length;
  return {
    role: "merchant",
    providerId: merchant.id,
    provider: {
      ...merchant,
      settlementPending: stats.settlementPending,
      orderCount: stats.orderCount,
    },
    stats,
    rows,
    services,
    tasks,
    reviews,
    analytics: merchantStatsAnalytics(orders, services, stats),
  };
}

function computeProviderStats(db, role, providerId) {
  if (role === "guide") return computeGuideStats(db, providerId || "guide-001");
  if (role === "merchant") return computeMerchantStats(db, providerId || "merchant-001");
  return null;
}

function computeGuideIncome(db, guideId = "guide-001") {
  const aggregate = computeGuideStats(db, guideId);
  return {
    guide: aggregate.provider,
    stats: aggregate.stats,
    items: aggregate.rows.map((item) => ({
      taskId: item.id,
      taskNo: item.taskNo,
      status: item.status,
      updatedAt: item.updatedAt,
      orderNo: item.order?.orderNo || "",
      serviceType: item.order?.serviceType || "",
      amount: item.order?.amount || 0,
      orderStatus: item.order?.status || "",
    })),
    reviews: aggregate.reviews,
  };
}

function computeAdminDataLoop(db) {
  const activeOrders = db.orders.filter((item) => !["已完成", "已取消"].includes(item.status));
  const completedOrders = db.orders.filter((item) => item.status === "已完成");
  const openAlerts = db.alerts.filter((item) => item.status !== "已处理");
  const serviceRevenue = db.orders.filter((item) => item.status !== "已取消").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return {
    summary: {
      users: db.users.length,
      elders: db.users.filter((item) => item.role === "elder").length,
      healthRecords: db.healthRecords.length,
      devices: db.devices.length,
      onlineDevices: db.devices.filter((item) => item.onlineStatus === "在线").length,
      services: db.services.length,
      merchants: db.merchants.length,
      guides: db.guides.length,
      orders: db.orders.length,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      alerts: db.alerts.length,
      openAlerts: openAlerts.length,
      reviews: db.reviews.length,
      activities: db.activities.length,
      activitySignups: db.activitySignups.length,
      serviceRequests: db.serviceRequests.length,
      revenue: serviceRevenue,
    },
    users: {
      accounts: db.users,
      elderProfiles: [db.elderProfile],
      familyContacts: db.familyContacts,
      latestOrders: db.orders.slice(0, 8),
    },
    health: {
      elder: db.elderProfile,
      records: db.healthRecords,
      devices: db.devices,
      alerts: db.alerts,
    },
    services: {
      catalog: db.services.map((item) => enrichService(db, item)),
      orders: db.orders,
      tasks: ordersForTasks(db, db.tasks),
      requests: db.serviceRequests,
    },
    merchants: {
      merchants: db.merchants,
      services: db.services.filter((item) => item.providerType === "merchant").map((item) => enrichService(db, item)),
      orders: db.orders.filter((item) => item.providerType === "merchant"),
    },
    guides: {
      guides: db.guides,
      tasks: ordersForTasks(db, db.tasks.filter((item) => item.assigneeType === "guide")),
    },
    reviews: db.reviews.map((item) => enrichReview(db, item)),
    activities: {
      activities: db.activities,
      signups: db.activitySignups,
    },
    messages: latestMessages(db).slice(0, 30),
    auditLogs: db.auditLogs.slice(0, 30),
    updatedAt: now(),
  };
}

function computeCollaborationRuntime(db) {
  const roles = ["user", "family", "guide", "merchant", "admin"];
  return {
    messageSummary: roles.map((role) => ({
      role,
      total: db.messages.filter((item) => item.toRole === role).length,
      unread: db.messages.filter((item) => item.toRole === role && !item.read).length,
    })),
    pendingOrders: db.orders.filter((item) => item.status === "待派单").length,
    activeTasks: db.tasks.filter((item) => !["已完成", "已取消"].includes(item.status)).length,
    openAlerts: db.alerts.filter((item) => item.status !== "已处理").length,
    highPriorityAlerts: db.alerts.filter((item) => item.status !== "已处理" && ["高", "最高"].includes(item.level)).length,
    latestMessages: db.messages.slice(0, 10),
    latestAlerts: db.alerts.slice(0, 6),
    updatedAt: now(),
  };
}

function integrationStatus() {
  const integrations = [
    { id: "payment", name: "支付/结算/退款", priority: "P2", status: "接口预留", endpoint: "/api/integrations/payment/request", note: "首期演示不走真实资金流，订单金额和结算数据已沉淀。" },
    { id: "sms", name: "短信/电话通知", priority: "P2", status: "接口预留", endpoint: "/api/integrations/sms/request", note: "当前用站内消息模拟，后续替换短信服务商。" },
    { id: "map", name: "腾讯地图/高德地图", priority: "P2", status: "接口预留", endpoint: "/api/integrations/map/request", note: "活动地图点位已由 API 驱动，真实定位、距离计算和路线导航后续接入地图 SDK。" },
    { id: "database-cache", name: "MySQL/PostgreSQL + Redis", priority: "P2", status: "迁移预留", endpoint: "/api/integrations/database-cache/request", note: "当前为 JSON 数据库和 SQL 表契约，生产迁移到关系数据库，Redis 用于缓存、验证码和消息队列。" },
    { id: "hardware", name: "智能设备/手环", priority: "P2", status: "接口预留", endpoint: "/api/integrations/hardware/request", note: "当前支持设备同步 API 和健康数据沉淀，真实硬件协议后续接入。" },
    { id: "medical-hospital", name: "医保/医院深度接口", priority: "P2", status: "接口预留", endpoint: "/api/integrations/medical-hospital/request", note: "当前只做预约、陪诊和就医服务模拟，不直连医保或医院核心系统。" },
    { id: "storage", name: "对象存储/图片上传", priority: "P2", status: "接口预留", endpoint: "/api/integrations/storage/request", note: "当前保留上传动作和证明字段，生产接 OSS/COS/S3。" },
    { id: "llm", name: "真实大模型", priority: "P2", status: "接口预留", endpoint: "/api/integrations/llm/request", note: "AI 管家现为本地意图模拟，接口边界已固定在 /api/ai/chat。" },
    { id: "ai-diagnosis", name: "复杂 AI 诊断", priority: "P2", status: "接口预留", endpoint: "/api/integrations/ai-diagnosis/request", note: "首期不提供医疗诊断结论，只保留健康科普、服务推荐和未来合规辅助接口边界。" },
    { id: "app-build", name: "iOS/Android/小程序打包", priority: "P2", status: "构建产物已生成", endpoint: "/api/integrations/app-build/request", note: "微信小程序产物位于 uniapp/dist/build/mp-weixin，App 构建资源位于 uniapp/dist/build/app；正式上架仍需证书、包名和应用商店配置。" },
    { id: "deployment", name: "云服务器/Docker/Nginx/HTTPS", priority: "P2", status: "配置预留", endpoint: "/api/integrations/deployment/request", note: "已有 Dockerfile、docker-compose 和部署文档，生产需补域名、HTTPS、Nginx 反代和 CI/CD。" },
  ];
  return { integrations, updatedAt: now() };
}

function priorityDeliveryStatus(db) {
  return {
    P0: {
      title: "核心闭环必需功能",
      status: "已完成",
      items: [
        "用户端登录/AI/活动地图/SOS/统一下单/订单消息",
        "后台待派单列表、执行方指派、SOS 处理、订单闭环查询",
        "向导上线接单、查看任务、接单、开始服务、异常上报、完成服务、收入读取",
        "商户发布服务、接收预约、报价/确认、完成服务、评价读取",
        "数据库、鉴权权限、状态机、一键重置演示数据、验收脚本",
      ],
      evidence: ["npm run check", "/api/admin/data-loop", "/api/admin/dispatch/pending", "/api/guide/dashboard", "/api/merchant/dashboard"],
    },
    P1: {
      title: "重要增强功能",
      status: "已完成",
      items: [
        "活动报名姓名/电话/人数表单入库",
        "社群、打卡、美食、交通、商城、志愿等入口统一生成服务请求",
        "后台服务请求处理和数据沉淀",
        "向导/商户审核、商户服务审核、活动上下线管理",
        "用户、健康、服务、商户、评价数据后台统一查询",
      ],
      evidence: ["/api/service-requests", "/api/admin/guides", "/api/admin/merchants", "/api/admin/services", "/api/admin/reviews"],
    },
    P2: {
      title: "后续迭代功能",
      status: "已预留入口/接口",
      items: integrationStatus().integrations,
      evidence: ["/api/integrations/status"],
    },
    metrics: computeAdminDataLoop(db).summary,
    updatedAt: now(),
  };
}

function computeDispatchQueue(db) {
  const pendingOrders = db.orders
    .filter((item) => item.status === "待派单")
    .map((order) => ({
      ...order,
      recommendedProvider: resolveProvider(db, order),
    }));
  return {
    pendingOrders,
    candidates: {
      guides: db.guides.filter((item) => item.status === "已认证").sort((a, b) => a.distanceKm - b.distanceKm),
      merchants: db.merchants.filter((item) => item.status === "已通过"),
    },
    activeTasks: ordersForTasks(db, db.tasks.filter((item) => !["已完成", "已取消"].includes(item.status))),
  };
}

function messageReadReceipts(db) {
  if (!Array.isArray(db.messageReadReceipts)) db.messageReadReceipts = [];
  return db.messageReadReceipts;
}

function generatedMessageReadAt(db, role, messageId) {
  return messageReadReceipts(db).find((item) => item.role === role && item.messageId === messageId)?.readAt || "";
}

function markGeneratedMessageRead(db, role, messageId) {
  const receipts = messageReadReceipts(db);
  const existing = receipts.find((item) => item.role === role && item.messageId === messageId);
  const readAt = now();
  if (existing) {
    existing.readAt = readAt;
  } else {
    receipts.unshift({ role, messageId, readAt });
  }
  return readAt;
}

function latestMessages(db, role) {
  const rows = db.messages.filter((item) => !role || item.toRole === role);
  if (role === "guide") {
    const usedIds = new Set(rows.map((item) => item.id));
    const generated = guideTaskMessages(db).filter((item) => !usedIds.has(item.id));
    return [...rows, ...generated]
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, 20);
  }
  if (role === "merchant") {
    const usedIds = new Set(rows.map((item) => item.id));
    const generated = merchantTaskMessages(db).filter((item) => !usedIds.has(item.id));
    return [...rows, ...generated]
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, 20);
  }
  return rows.slice(0, 20);
}

function guideTaskMessages(db) {
  const guide = getGuide(db);
  const tasks = ordersForTasks(db, db.tasks.filter((item) => {
    return item.assigneeType === "guide"
      && (!item.assigneeId || !guide?.id || item.assigneeId === guide.id)
      && item.status !== "已取消";
  }));
  const pendingOrders = db.orders
    .filter((item) => item.providerType === "guide" && item.status === "待派单")
    .map((order) => ({ id: `pending-${order.id}`, status: "待派单", updatedAt: order.createdAt, order }));

  return [...tasks, ...pendingOrders].slice(0, 8).map((task, index) => {
    const order = task.order || {};
    const serviceType = order.serviceType || "向导服务";
    const status = task.status || order.status || "待处理";
    const urgent = ["待派单", "待接单", "已接单", "服务中"].includes(status);
    const messageId = `guide-message-${task.id || order.id || index}`;
    const readAt = generatedMessageReadAt(db, "guide", messageId);
    return {
      id: messageId,
      toRole: "guide",
      title: status === "待派单" || status === "待接单" ? `新${serviceType}订单待接单` : `${serviceType}订单${status}`,
      content: `${order.elderName || "旅居用户"} · ${order.time || "时间待确认"} · ${order.location || "地点待确认"}${order.note ? `，${order.note}` : ""}`,
      read: readAt ? true : !urgent,
      readAt,
      scenario: "guide-task-message",
      priority: urgent ? "高" : "普通",
      channels: ["站内消息"],
      relatedType: task.id?.startsWith?.("pending-") ? "order" : "task",
      relatedId: task.id || order.id || "",
      createdAt: task.updatedAt || task.createdAt || order.createdAt || order.time || now(),
    };
  });
}

function merchantTaskMessages(db) {
  const merchant = getMerchant(db);
  const merchantId = merchant?.id || "merchant-001";
  const taskByOrderId = new Map(db.tasks
    .filter((task) => task.assigneeType === "merchant" && (!task.assigneeId || task.assigneeId === merchantId))
    .map((task) => [task.orderId, task]));
  return db.orders
    .filter((order) => order.providerType === "merchant" && (!order.providerId || order.providerId === merchantId))
    .slice(0, 12)
    .map((order) => {
      const task = taskByOrderId.get(order.id) || {};
      const status = task.status || order.status || "待处理";
      const urgent = ["待确认", "待派单", "已派单", "待接单", "待服务", "服务中"].includes(status);
      const messageId = `merchant-order-message-${order.id}`;
      const readAt = generatedMessageReadAt(db, "merchant", messageId);
      const actionTarget = /报价/.test(status)
        ? "37"
        : /服务中|待服务/.test(status)
          ? "18"
          : /待确认|待派单|已派单|待接单/.test(status)
            ? "34"
            : "14";
      return {
        id: messageId,
        toRole: "merchant",
        title: `${order.serviceType || "商户服务"}${status}`,
        content: `${order.elderName || "旅居用户"} · ${order.time || "时间待确认"} · ${order.location || "地点待确认"}${order.note ? `，${order.note}` : ""}`,
        read: readAt ? true : !urgent,
        readAt,
        scenario: "merchant-order-message",
        priority: urgent ? "高" : "普通",
        channels: ["站内消息"],
        relatedType: "order",
        relatedId: order.id,
        actionTarget,
        createdAt: task.updatedAt || task.createdAt || order.timeline?.[0]?.time || order.createdAt || order.time || now(),
        details: {
          orderNo: order.orderNo,
          elderName: order.elderName,
          serviceType: order.serviceType,
          status,
          amount: order.amount,
          time: order.time,
          location: order.location,
          note: order.note,
        },
      };
    });
}

function getGuide(db, id = "guide-001") {
  return db.guides.find((item) => item.id === id) || db.guides[0];
}

function getMerchant(db, id = "merchant-001") {
  return db.merchants.find((item) => item.id === id) || db.merchants[0];
}

function defaultMerchantStorePhotos() {
  return [
    { id: "store-photo-front", title: "门店前台", src: "/merchant/assets/store-front.png", isCover: true },
    { id: "store-photo-room", title: "护理室", src: "/merchant/assets/store-room.png", isCover: false },
    { id: "store-photo-wall", title: "营业执照墙", src: "/merchant/assets/store-wall.png", isCover: false },
    { id: "store-photo-team", title: "服务人员合照", src: "/merchant/assets/store-team.png", isCover: false },
    { id: "store-photo-rehab", title: "康复设备", src: "/merchant/assets/store-rehab.png", isCover: false },
  ];
}

function normalizeMerchantStorePhotos(photos) {
  const source = Array.isArray(photos) ? photos : [];
  return source
    .filter((item) => item && (item.src || item.url))
    .slice(0, 9)
    .map((item, index) => ({
      id: String(item.id || `store-photo-${index + 1}`),
      title: String(item.title || item.name || `门店照片${index + 1}`),
      src: String(item.src || item.url),
      isCover: Boolean(item.isCover),
      updatedAt: item.updatedAt || "",
    }));
}

function merchantStorePhotosForApi(merchant) {
  const normalized = normalizeMerchantStorePhotos(merchant?.storePhotos);
  const photos = normalized.length ? normalized : defaultMerchantStorePhotos();
  if (!photos.some((item) => item.isCover) && photos[0]) photos[0].isCover = true;
  return photos;
}

function merchantProfileForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const services = db.services.filter((item) => item.providerType === "merchant" && item.providerId === merchant.id);
  const serviceCategories = Array.from(new Set(services.map((item) => item.category).filter(Boolean)));
  const onlineAccepting = merchant.status === "已通过" && merchant.onlineAccepting !== false;
  const storePhotos = merchantStorePhotosForApi(merchant);
  return {
    ...merchant,
    storePhotos,
    storePhotoCount: storePhotos.length,
    coverPhoto: storePhotos.find((item) => item.isCover) || storePhotos[0] || null,
    onlineAccepting,
    onlineStatus: onlineAccepting ? "在线接单中" : "暂停接单",
    onlineStatusText: onlineAccepting ? "客户可看到并预约商户服务" : "客户暂时不能预约商户服务",
    businessHours: merchant.businessHours || "09:00-21:00",
    serviceCity: merchant.serviceCity || "云南省 昆明市",
    intro: merchant.intro || "专业护理团队，提供居家护理、陪诊服务、康复理疗等服务。",
    serviceCount: services.length,
    serviceCategoryCount: serviceCategories.length,
    serviceCategories,
    serviceSummary: serviceCategories.join(" / ") || merchant.type || "商户服务",
    sourceEndpoint: "/api/merchant/profile",
  };
}

function merchantServiceDraftTitle(category = "商户") {
  const name = String(category || "商户");
  return name.includes("服务") ? name : `${name}服务`;
}

function merchantServiceDraftDescription(category = "商户", description = "") {
  const value = String(description || "").trim();
  if (value && !/已接入真实分类草稿，提交后进入后台审核。$/.test(value)) return value;
  return `${merchantServiceDraftTitle(category)}已接入真实分类草稿，提交后进入后台审核。`;
}

function merchantServiceCategorySelectionForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const categoriesPayload = merchantServiceCategoriesForApi(db);
  const categories = categoriesPayload.categories || [];
  const draft = merchant?.serviceDraft || {};
  const selected = categories.find((item) => item.id === draft.categoryId)
    || categories.find((item) => item.category === draft.category)
    || categories.find((item) => item.id === "care-nursing")
    || categories[0]
    || null;
  return {
    merchantId: merchant?.id || merchantId,
    draft: {
      categoryId: selected?.id || "",
      category: selected?.category || "",
      examples: selected?.examples || [],
      examplesText: selected?.examplesText || "",
      qualification: selected?.qualification || "",
      note: selected?.note || "",
      selectedAt: draft.selectedAt || "",
      serviceTitle: draft.serviceTitle || merchantServiceDraftTitle(selected?.category || "商户"),
      price: Number(draft.price || 199),
      unit: draft.unit || "次",
      description: merchantServiceDraftDescription(selected?.category || "商户", draft.description),
    },
    selectedCategory: selected,
    sourceEndpoint: "/api/merchant/service-categories/selection",
  };
}

function maskMerchantPhone(phone = "") {
  const compact = String(phone || "").replace(/[^\d]/g, "");
  if (compact.length < 7) return compact || "未填写";
  return `${compact.slice(0, 3)} **** ${compact.slice(-4)}`;
}

function merchantQualificationForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const profile = merchantProfileForApi(db, merchant?.id || merchantId);
  const saved = merchant?.qualification || {};
  const files = Array.isArray(saved.files) && saved.files.length
    ? saved.files
    : [
        { id: "business-license", label: "营业执照", src: "/merchant/assets/cert-id.png", status: "已通过" },
        { id: "service-certificate", label: "服务资质证书", src: "/merchant/assets/cert-license.png", status: "已通过" },
        { id: "store-photos", label: "门店 / 机构照片", src: "/merchant/assets/cert-door.png", status: "已通过", route: "56" },
      ];
  const auditRecords = Array.isArray(saved.auditRecords) && saved.auditRecords.length
    ? saved.auditRecords
    : [
        { title: "提交资料", desc: "商户提交认证资料", time: "05-16  10:20", color: "blue" },
        { title: "平台初审", desc: "平台进行资料初步审核", time: "05-17  14:35", color: "blue" },
        { title: "认证通过", desc: "平台审核通过，资质生效", time: "05-18  09:12", color: "green" },
      ];
  const categories = new Set([
    ...((profile.serviceCategories || []).map(String)),
    ...((merchantServiceCategorySelectionForApi(db, profile.id).draft?.category ? [merchantServiceCategorySelectionForApi(db, profile.id).draft.category] : [])),
    profile.type || "",
  ].filter(Boolean));
  const serviceTypeNames = [
    "医疗卫生",
    "康养护理",
    "家政生活",
    "交通出行",
    "文旅体验",
    "餐饮生活",
  ];
  const hasKnownServiceType = serviceTypeNames.some((label) => categories.has(label));
  const serviceTypes = serviceTypeNames.map((label, index) => ({
    label,
    active: saved.serviceTypes?.[label] ?? (categories.has(label) || (!hasKnownServiceType && index < 3)),
  }));
  return {
    merchantId: profile.id,
    status: saved.status || (profile.status === "已通过" ? "已认证" : profile.status || "审核中"),
    headline: saved.headline || "平台审核通过，可正常上架服务",
    subject: saved.subject || profile.name || "商户主体",
    certifiedAt: saved.certifiedAt || "2025-05-18",
    validUntil: saved.validUntil || "2027-05-17",
    files,
    auditRecords,
    serviceTypes,
    related: {
      update: "/api/merchant/qualification/update",
      photos: "/api/merchant/photos",
      support: "/api/merchant/support",
    },
    sourceEndpoint: "/api/merchant/qualification",
  };
}

function defaultMerchantSecurity(merchant) {
  return {
    level: "高",
    score: 92,
    lastLogin: "今天 09:41",
    lastLocation: "昆明",
    phoneMasked: maskMerchantPhone(merchant?.phone),
    loginPassword: "已设置",
    paymentPassword: "未设置",
    wechat: "已绑定",
    faceVerification: "已开启",
    twoFactorEnabled: false,
    devices: [
      { id: "device-current", icon: "smartphone", title: "iPhone 15 Pro", location: "昆明", loginAt: "今日 09:41", status: "当前设备", current: true, color: "blue" },
      { id: "device-chrome", icon: "chrome", title: "Chrome 浏览器", location: "昆明", loginAt: "昨天 20:12", status: "已登录", current: false, color: "green" },
    ],
  };
}

function normalizeMerchantSecurity(merchant) {
  const defaults = defaultMerchantSecurity(merchant);
  const saved = merchant?.security || {};
  const devices = Array.isArray(saved.devices) && saved.devices.length ? saved.devices : defaults.devices;
  return {
    ...defaults,
    ...saved,
    phoneMasked: saved.phoneMasked || defaults.phoneMasked,
    devices,
    sourceEndpoint: "/api/merchant/security",
  };
}

function ensureMerchantSecurity(merchant) {
  merchant.security = normalizeMerchantSecurity(merchant);
  return merchant.security;
}

function merchantSecurityForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const security = normalizeMerchantSecurity(merchant);
  return {
    merchantId: merchant?.id || merchantId,
    ...security,
    activeDeviceCount: security.devices.filter((item) => item.status !== "已退出").length,
  };
}

function defaultMerchantSettings() {
  return {
    notifications: {
      order: true,
      serviceStart: true,
      settlement: true,
      marketing: false,
    },
    privacy: {
      dataExportStatus: "可导出",
      profileVisible: "仅平台审核可见",
      permissionSummary: "相机、相册、通知已授权",
      phoneAuth: "已授权",
      wechatBinding: "已绑定",
      faceVerification: "已开启",
      locationAuth: "使用期间允许",
      orderReminder: true,
      marketingNotice: false,
      onlineStatusVisible: true,
      supportContactAllowed: true,
    },
    common: {
      cacheSizeMb: 128,
      language: "简体中文",
      fontSize: "标准",
      darkMode: "跟随系统",
    },
    permissions: {
      location: "使用期间允许",
      photoCamera: "允许访问部分照片",
      notification: "已开启",
      microphone: "未开启",
    },
    appVersion: "v1.8.2",
  };
}

function normalizeMerchantSettings(merchant) {
  const defaults = defaultMerchantSettings();
  const saved = merchant?.settings || {};
  return {
    notifications: { ...defaults.notifications, ...(saved.notifications || {}) },
    privacy: { ...defaults.privacy, ...(saved.privacy || {}) },
    common: { ...defaults.common, ...(saved.common || {}) },
    permissions: { ...defaults.permissions, ...(saved.permissions || {}) },
    appVersion: saved.appVersion || defaults.appVersion,
    lastExportId: saved.lastExportId || "",
    lastExportAt: saved.lastExportAt || "",
    permissionRecords: Array.isArray(saved.permissionRecords) ? saved.permissionRecords : [],
    sourceEndpoint: "/api/merchant/settings",
  };
}

function ensureMerchantSettings(merchant) {
  merchant.settings = normalizeMerchantSettings(merchant);
  return merchant.settings;
}

function merchantSettingsForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const settings = normalizeMerchantSettings(merchant);
  return {
    merchantId: merchant?.id || merchantId,
    ...settings,
    notificationRows: [
      { key: "order", label: "订单提醒", desc: "新预约、订单状态变更", enabled: settings.notifications.order },
      { key: "serviceStart", label: "服务开始提醒", desc: "服务开始前30分钟提醒", enabled: settings.notifications.serviceStart },
      { key: "settlement", label: "结算到账提醒", desc: "结算完成与提现到账", enabled: settings.notifications.settlement },
      { key: "marketing", label: "营销活动通知", desc: "平台活动、新功能推荐", enabled: settings.notifications.marketing },
    ],
    commonRows: [
      { key: "cacheSizeMb", label: "清理缓存", value: `${settings.common.cacheSizeMb}MB`, action: "clearCache", iconName: "trash-2", color: "orange" },
      { key: "language", label: "语言", value: settings.common.language, route: "65", iconName: "languages", color: "blue" },
      { key: "fontSize", label: "字体大小", value: settings.common.fontSize, route: "65", iconName: "type", color: "purple" },
      { key: "darkMode", label: "深色模式", value: settings.common.darkMode, action: "darkMode", iconName: "moon", color: "green" },
    ],
  };
}

function merchantPrivacyForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const settings = normalizeMerchantSettings(merchant);
  const privacy = settings.privacy;
  return {
    merchantId: merchant?.id || merchantId,
    sourceEndpoint: "/api/merchant/privacy",
    updatedAt: settings.updatedAt || "",
    managementRows: [
      { key: "collection", iconName: "user", title: "个人信息收集清单", desc: "查看平台收集的商户资料、联系人与资质信息", color: "blue", detail: "平台当前保存商户主体信息、联系人、资质文件、服务与订单履约数据，用于资质审核、订单履约、结算和客服处理。" },
      { key: "sharing", iconName: "shield-check", title: "第三方信息共享清单", desc: "查看支付、地图、消息等必要共享场景", color: "green", detail: "仅在结算支付、位置导航、消息通知、监管审计等必要场景共享最小字段，并记录共享目的和时间。" },
      { key: "export", iconName: "download", title: "个人信息导出", desc: settings.lastExportId ? `最近导出 ${settings.lastExportId}` : privacy.dataExportStatus, color: "purple", exportAction: true },
      { key: "cancelAccount", iconName: "user-x", title: "注销账号", desc: "需完成订单、结算与售后处理后申请", color: "red", route: "09", danger: true },
    ],
    authorizationRows: [
      { key: "phoneAuth", iconName: "smartphone", title: "手机号授权", value: privacy.phoneAuth, color: "blue" },
      { key: "wechatBinding", iconName: "message-circle", title: "微信账号绑定", value: privacy.wechatBinding, color: "green" },
      { key: "faceVerification", iconName: "scan-face", title: "人脸验证", value: privacy.faceVerification, color: "purple" },
      { key: "locationAuth", iconName: "map-pin", title: "位置授权", value: privacy.locationAuth, color: "orange" },
    ],
    messageRows: [
      { key: "orderReminder", iconName: "bell", title: "接收订单提醒", desc: "订单状态变更、服务提醒等", enabled: Boolean(privacy.orderReminder), color: "blue" },
      { key: "marketingNotice", iconName: "megaphone", title: "接收营销通知", desc: "优惠活动、新功能等通知", enabled: Boolean(privacy.marketingNotice), color: "green" },
      { key: "onlineStatusVisible", iconName: "eye", title: "展示在线状态", desc: "向客户展示您的在线接单状态", enabled: Boolean(privacy.onlineStatusVisible), color: "purple" },
      { key: "supportContactAllowed", iconName: "headphones", title: "允许客服联系", desc: "客服可通过电话或在线方式联系您", enabled: Boolean(privacy.supportContactAllowed), color: "orange" },
    ],
    safeText: "平台仅在订单处理、资质审核、提现验证等必要场景使用商户信息，并通过加密传输保护数据安全。",
  };
}

function permissionStatusMeta(key, status) {
  if (["已关闭", "未开启"].includes(status)) return { tag: "建议开启", enabled: false, warn: true };
  if (key === "location") return { tag: "推荐", enabled: true, warn: false };
  if (key === "photoCamera" && status !== "允许访问全部照片") return { tag: "建议开启", enabled: true, warn: true };
  return { tag: "正常", enabled: true, warn: false };
}

function merchantPermissionRows(settings) {
  const permissions = settings.permissions || {};
  const rows = [
    { key: "location", iconName: "map-pin", title: "位置权限", desc: "用于计算客户距离、导航到客户地址", actionText: permissions.location === "已关闭" ? "开启" : "关闭", color: "green" },
    { key: "photoCamera", iconName: "image", title: "相册与相机权限", desc: "用于上传服务照片、资质文件与售后凭证", actionText: permissions.photoCamera === "已关闭" ? "开启" : "管理", color: "purple" },
    { key: "notification", iconName: "bell", title: "通知权限", desc: "用于接收新订单、服务开始、结算到账提醒", actionText: permissions.notification === "已关闭" ? "开启" : "关闭", color: "blue" },
    { key: "microphone", iconName: "mic", title: "麦克风权限", desc: "用于在线客服语音沟通", actionText: permissions.microphone === "已开启" ? "关闭" : "开启", color: "orange" },
  ];
  return rows.map((row) => {
    const status = permissions[row.key] || defaultMerchantSettings().permissions[row.key];
    return { ...row, status, ...permissionStatusMeta(row.key, status) };
  });
}

function nextMerchantPermissionStatus(key, current) {
  if (key === "photoCamera") {
    if (current === "已关闭") return "允许访问部分照片";
    if (current === "允许访问部分照片") return "允许访问全部照片";
    return "已关闭";
  }
  if (key === "microphone") return current === "已开启" ? "未开启" : "已开启";
  if (key === "notification") return current === "已关闭" ? "已开启" : "已关闭";
  if (key === "location") return current === "已关闭" ? "使用期间允许" : "已关闭";
  return current || "已开启";
}

function defaultPermissionRecords() {
  return [
    { id: "permission-record-location", iconName: "map-pin", title: "位置", action: "订单导航", time: "今天 09:40", color: "green" },
    { id: "permission-record-camera", iconName: "camera", title: "相机", action: "上传完成凭证", time: "今天 10:55", color: "purple" },
    { id: "permission-record-album", iconName: "image", title: "相册", action: "上传资质文件", time: "05-18", color: "blue" },
  ];
}

function merchantPermissionsForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const settings = normalizeMerchantSettings(merchant);
  const records = Array.isArray(settings.permissionRecords) && settings.permissionRecords.length
    ? settings.permissionRecords
    : defaultPermissionRecords();
  return {
    merchantId: merchant?.id || merchantId,
    sourceEndpoint: "/api/merchant/permissions",
    tip: "关闭部分权限可能影响订单导航、上传凭证和客服沟通",
    permissions: settings.permissions,
    permissionCards: merchantPermissionRows(settings),
    permissionRecords: records,
  };
}

function merchantSupportForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const saved = merchant?.support || {};
  return {
    merchantId: merchant?.id || merchantId,
    quickLinks: saved.quickLinks || [
      { icon: "clipboard-list", label: "订单问题", route: "20", color: "blue" },
      { icon: "wallet", label: "结算提现", route: "44", color: "orange" },
      { icon: "badge-check", label: "资质认证", route: "03", color: "green" },
      { icon: "file-text", label: "发票开具", route: "13", color: "purple" },
    ],
    faqs: saved.faqs || [
      "如何修改服务价格？",
      "客户取消预约后如何处理？",
      "结算周期是多久？",
      "发票开具需要多长时间？",
    ],
    contacts: {
      phone: saved.phone || "400-888-1234",
      email: saved.email || "service@ylny.com",
      serviceTime: saved.serviceTime || "09:00-18:00",
    },
    ticketCount: (db.merchantSupportTickets || []).filter((item) => item.merchantId === (merchant?.id || merchantId)).length,
    sourceEndpoint: "/api/merchant/support",
  };
}

function defaultMerchantInvoice(merchant) {
  const title = merchant?.invoice?.title || merchant?.name || "云旅无忧（昆明）科技有限公司";
  return {
    titleType: "企业",
    title,
    taxNo: "91530100MA6P2X8R4G",
    address: "云南省昆明市盘龙区穿金路88号云旅大厦15楼",
    phone: "0871-88888888",
    bank: "中国建设银行股份有限公司昆明穿金路支行",
    bankAccount: "5300 1688 8888 8888 8888",
    invoiceType: "增值税专用发票",
    delivery: "电子发票（邮箱）",
    email: "invoice@ylny.com",
    records: [
      { id: "invoice-001", icon: "receipt-text", color: "blue", title: "居家护理服务（李奶奶）", orderNo: "SO20250520001", appliedAt: "2025-05-20 10:35", amount: 268, status: "待开票", statusColor: "orange", action: "申请开票" },
      { id: "invoice-002", icon: "receipt-text", color: "green", title: "陪诊预约服务（张叔叔）", orderNo: "SO20250519008", appliedAt: "2025-05-19 14:20", amount: 198, status: "已开票", statusColor: "green", action: "下载发票" },
      { id: "invoice-003", icon: "receipt-text", color: "purple", title: "康复理疗上门服务（王阿姨）", orderNo: "SO20250518015", appliedAt: "2025-05-18 16:10", amount: 298, status: "已作废", statusColor: "gray", action: "" },
    ],
  };
}

function normalizeMerchantInvoice(merchant) {
  const defaults = defaultMerchantInvoice(merchant);
  const saved = merchant?.invoice || {};
  return {
    ...defaults,
    ...saved,
    records: Array.isArray(saved.records) && saved.records.length ? saved.records : defaults.records,
    sourceEndpoint: "/api/merchant/invoices",
  };
}

function ensureMerchantInvoice(merchant) {
  merchant.invoice = normalizeMerchantInvoice(merchant);
  return merchant.invoice;
}

function merchantInvoicesForApi(db, merchantId = "merchant-001", status = "全部") {
  const merchant = getMerchant(db, merchantId);
  const invoice = normalizeMerchantInvoice(merchant);
  const allRecords = invoice.records.map((record) => ({
    icon: "receipt-text",
    color: "blue",
    statusColor: record.status === "已开票" ? "green" : record.status === "已作废" ? "gray" : "orange",
    invoiceType: invoice.invoiceType,
    ...record,
    amountText: `¥ ${Number(record.amount || 0).toFixed(2)}`,
  }));
  const records = status && status !== "全部" ? allRecords.filter((record) => record.status === status) : allRecords;
  return {
    merchantId: merchant?.id || merchantId,
    title: {
      titleType: invoice.titleType,
      title: invoice.title,
      taxNo: invoice.taxNo,
      address: invoice.address,
      phone: invoice.phone,
      bank: invoice.bank,
      bankAccount: invoice.bankAccount,
    },
    preference: {
      invoiceType: invoice.invoiceType,
      delivery: invoice.delivery,
      email: invoice.email,
    },
    filters: ["全部", "待开票", "已开票", "已作废"],
    status: status || "全部",
    records,
    totalRecords: allRecords.length,
    sourceEndpoint: "/api/merchant/invoices",
  };
}

function merchantInvoiceApplyOrders(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const savedOrders = merchant?.invoice?.applyOrders;
  const invoice = normalizeMerchantInvoice(merchant);
  const source = Array.isArray(savedOrders) && savedOrders.length
    ? savedOrders
    : [
        { id: "invoice-order-001", title: "居家护理服务（李奶奶）", orderNo: "DD20260601004", serviceTime: "服务时间：2026-06-03 09:30-11:30", amount: 268, completedAt: "06-03", selected: true, icon: "user", color: "green" },
        { id: "invoice-order-002", title: "康复护理方案（李奶奶）", orderNo: "DD20260601005", serviceTime: "服务时间：2026-06-03 14:00-15:30", amount: 198, completedAt: "06-03", selected: true, icon: "message-circle", color: "purple" },
        { id: "invoice-order-003", title: "上门照护服务（李奶奶）", orderNo: "DD20260601006", serviceTime: "服务时间：2026-06-03 16:00-17:00", amount: 320, completedAt: "06-03", selected: false, icon: "heart-handshake", color: "orange" },
      ];
  const existingOrderNos = new Set(invoice.records.map((record) => record.orderNo).filter(Boolean));
  return source.map((order, index) => ({
    id: String(order.id || `invoice-order-${index + 1}`),
    title: String(order.title || order.serviceType || "商户服务订单"),
    orderNo: String(order.orderNo || order.id || ""),
    serviceTime: String(order.serviceTime || order.time || "服务时间待确认"),
    amount: Number(order.amount || 0),
    amountText: `¥ ${Number(order.amount || 0).toFixed(2)}`,
    completedAt: String(order.completedAt || order.time || "").slice(5, 10) || "已完成",
    selected: Boolean(order.selected),
    icon: order.icon || "receipt-text",
    color: order.color || "blue",
    invoiceable: order.invoiceable !== false && !existingOrderNos.has(order.orderNo),
    status: existingOrderNos.has(order.orderNo) ? "已申请" : "可开票",
  }));
}

function merchantInvoiceApplyForApi(db, merchantId = "merchant-001") {
  const merchant = getMerchant(db, merchantId);
  const invoicePayload = merchantInvoicesForApi(db, merchant?.id || merchantId, "全部");
  const draft = merchant?.invoiceApplyDraft || {};
  const orders = merchantInvoiceApplyOrders(db, merchant?.id || merchantId);
  const defaultSelected = orders.filter((order) => order.selected && order.invoiceable).map((order) => order.id);
  const selectedOrderIds = Array.isArray(draft.selectedOrderIds) && draft.selectedOrderIds.length
    ? draft.selectedOrderIds.filter((id) => orders.some((order) => order.id === id && order.invoiceable))
    : defaultSelected;
  const selectedOrders = orders.filter((order) => selectedOrderIds.includes(order.id));
  return {
    merchantId: merchant?.id || merchantId,
    title: invoicePayload.title,
    preference: {
      ...invoicePayload.preference,
      invoiceType: draft.invoiceType || invoicePayload.preference.invoiceType,
      delivery: draft.delivery || invoicePayload.preference.delivery,
      email: draft.email || invoicePayload.preference.email,
    },
    orders,
    selectedOrderIds,
    summary: {
      selectedCount: selectedOrders.length,
      amount: selectedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0),
      amountText: `¥ ${selectedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0).toFixed(2)}`,
    },
    note: draft.note || "",
    eta: "预计1-3个工作日完成开票",
    sourceEndpoint: "/api/merchant/invoices/apply",
  };
}

function ordersForTasks(db, tasks) {
  const orderById = new Map(db.orders.map((order) => [order.id, order]));
  return tasks.map((task) => ({ ...task, order: orderById.get(task.orderId) || null }));
}

function isInternalAcceptanceRecord(item) {
  const text = [
    item?.title,
    item?.name,
    item?.description,
    item?.source,
    item?.location,
  ]
    .filter(Boolean)
    .join(" ");
  return /最低交付|minimum[-\s]?delivery/i.test(text);
}

function publicUserActivities(db) {
  return (db.activities || []).filter((activity) => !isInternalAcceptanceRecord(activity));
}

function publicUserActivityDb(db) {
  return { ...db, activities: publicUserActivities(db) };
}

function computeUserHome(db) {
  const openAlerts = db.alerts.filter((item) => item.elderId === db.elderProfile.id && item.status !== "已处理");
  const activeOrders = db.orders.filter((item) => !["已完成", "已取消"].includes(item.status));
  const activities = publicUserActivities(db);
  return {
    profile: { user: db.users[0], elder: db.elderProfile, familyContacts: db.familyContacts },
    functionOverview: userFunctionOverviewForApi(db),
    homeRequirements: userHomeRequirementsForApi(db),
    health: {
      metrics: db.healthRecords,
      devices: db.devices,
      openAlerts,
    },
    activities: activities.slice(0, 3),
    orders: db.orders.slice(0, 8),
    activeOrders,
    services: db.services.filter((item) => item.status === "上架").slice(0, 8),
    serviceRequests: db.serviceRequests.slice(0, 8),
    messages: latestMessages(db, "user").slice(0, 5),
  };
}

const USER_COMMUNITY_FILTERS = ["推荐", "同城", "活动群", "兴趣圈", "家属圈"];

function ensureUserCommunity(db) {
  if (!db.community || typeof db.community !== "object") db.community = {};
  const community = db.community;
  if (!Array.isArray(community.groups) || !community.groups.length) {
    community.groups = [
      { id: "community-group-001", title: "湖泉晨练群", image: "community-group-morning-ref.png", memberCount: 128, text: "一起晨练太极，拥抱健康每一天", newMembers: 23, color: "green", tags: ["推荐", "同城", "活动群", "兴趣圈"], joinedBy: ["user-001"] },
      { id: "community-group-002", title: "书画交流圈", image: "community-group-calligraphy-ref.png", memberCount: 86, text: "书法绘画爱好者交流作品与心得", newMembers: 12, color: "blue", tags: ["推荐", "兴趣圈"], joinedBy: [] },
      { id: "community-group-003", title: "健康饮食互助群", image: "community-group-food-ref.png", memberCount: 203, text: "分享健康食谱，交流养生心得", newMembers: 38, color: "orange", tags: ["推荐", "兴趣圈", "家属圈"], joinedBy: [] },
      { id: "community-group-004", title: "弥勒旅居新手问答", image: "community-group-question-ref.png", memberCount: 56, text: "新手提问，热心解答，旅居无忧", newMembers: 8, color: "purple", tags: ["推荐", "同城", "家属圈"], joinedBy: [] },
    ];
  }
  if (!Array.isArray(community.posts) || !community.posts.length) {
    community.posts = [
      {
        id: "community-post-001",
        authorId: "community-user-aunt",
        author: "张阿姨",
        avatar: "ref/community-avatar-aunt.png",
        groupId: "community-group-001",
        groupName: "湖泉晨练群",
        badge: "活跃成员",
        pin: "置顶",
        content: "今天天气真好，分享一条湖边散步路线，风景超美，适合慢走拍照，附上沿途美景～",
        images: ["community-feed-lake-ref.png", "community-feed-path-ref.png", "community-feed-water-ref.png"],
        tags: ["推荐", "同城", "活动群", "兴趣圈"],
        likesCount: 36,
        likedBy: [],
        allowComments: true,
        comments: [
          { id: "community-comment-001", author: "刘阿姨", avatar: "avatar-user.jpg", content: "这条湖边路线我也走过，早上人少更舒服。", createdAt: "2026-06-20 08:20" },
          { id: "community-comment-002", author: "赵叔", avatar: "avatar-user.jpg", content: "照片很漂亮，下次晨练后一起过去看看。", createdAt: "2026-06-20 08:35" },
        ],
        createdAt: "2026-06-20 07:30",
      },
      {
        id: "community-post-002",
        authorId: "community-user-li",
        author: "李叔",
        avatar: "avatar-user.jpg",
        groupId: "community-group-001",
        groupName: "棋牌娱乐圈",
        badge: "",
        pin: "",
        content: "明天下午棋牌活动，欢迎喜欢棋牌的朋友一起切磋！地点：社区活动室二楼",
        images: ["community-feed-mahjong-ref.png"],
        tags: ["推荐", "活动群", "兴趣圈"],
        likesCount: 28,
        likedBy: [],
        allowComments: true,
        comments: [
          { id: "community-comment-003", author: "王叔", avatar: "avatar-user.jpg", content: "我也报名，下午几点集合？", createdAt: "2026-06-19 15:40" },
        ],
        createdAt: "2026-06-19 15:20",
      },
      {
        id: "community-post-003",
        authorId: "community-user-doctor",
        author: "王医生",
        avatar: "ref/community-avatar-doctor.png",
        groupId: "community-group-003",
        groupName: "健康饮食互助群",
        badge: "",
        pin: "",
        content: "控盐饮食小贴士：建议每天食盐不超过 5 克，少吃腌制食品，多用天然香料调味，有助于控制血压哦～",
        images: [],
        tags: ["推荐", "家属圈", "兴趣圈"],
        likesCount: 42,
        likedBy: [],
        allowComments: true,
        comments: [
          { id: "community-comment-004", author: "刘阿姨", avatar: "avatar-user.jpg", content: "谢谢提醒，家里做饭会再少放一点盐。", createdAt: "2026-06-19 10:45" },
          { id: "community-comment-005", author: "李叔", avatar: "avatar-user.jpg", content: "这个建议实用，已经转给家属看了。", createdAt: "2026-06-19 11:08" },
        ],
        createdAt: "2026-06-19 10:30",
      },
    ];
  }
  if (!community.drafts || typeof community.drafts !== "object") community.drafts = {};
  return community;
}

function userCommunityMatchesFilter(item = {}, filter = "推荐") {
  const normalized = USER_COMMUNITY_FILTERS.includes(filter) ? filter : "推荐";
  if (normalized === "推荐") return true;
  return (Array.isArray(item.tags) ? item.tags : []).includes(normalized) || String(item.groupName || item.title || "").includes(normalized);
}

function normalizeCommunityGroupForApi(group = {}, userId = "user-001") {
  const joinedBy = Array.isArray(group.joinedBy) ? group.joinedBy : [];
  const joined = joinedBy.includes(userId);
  return {
    id: group.id,
    title: group.title,
    image: group.image || "community-group-morning-ref.png",
    memberCount: Number(group.memberCount || 0),
    membersText: `${Number(group.memberCount || 0)}人`,
    text: group.text || "",
    newMembers: Number(group.newMembers || 0),
    newMembersText: `+${Number(group.newMembers || 0)}`,
    color: group.color || "green",
    tags: Array.isArray(group.tags) ? group.tags : ["推荐"],
    joined,
    actionText: joined ? "已加入" : "加入群聊",
    joinEndpoint: `/api/user/community/groups/${encodeURIComponent(group.id)}/join`,
  };
}

function normalizeCommunityCommentForApi(comment = {}) {
  return {
    id: comment.id,
    author: comment.author || "旅居伙伴",
    avatar: comment.avatar || "avatar-user.jpg",
    content: comment.content || "",
    createdAt: comment.createdAt || now(),
    time: communityTimeText(comment.createdAt),
  };
}

function communityTimeText(createdAt = "") {
  if (!createdAt) return "刚刚";
  const text = String(createdAt);
  if (text.startsWith("2026-06-20")) return text.slice(11, 16) || "今天";
  if (text.startsWith("2026-06-19")) return `昨天 ${text.slice(11, 16)}`;
  return text.replace(/^2026-/, "").slice(0, 11);
}

function normalizeCommunityPostForApi(post = {}, userId = "user-001") {
  const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const liked = likedBy.includes(userId);
  return {
    id: post.id,
    authorId: post.authorId || "",
    author: post.author || "旅居伙伴",
    avatar: post.avatar || "avatar-user.jpg",
    groupId: post.groupId || "",
    groupName: post.groupName || "社群动态",
    badge: post.badge || "",
    pin: post.pin || "",
    content: post.content || "",
    images: Array.isArray(post.images) ? post.images : [],
    tags: Array.isArray(post.tags) ? post.tags : ["推荐"],
    likesCount: Number(post.likesCount || 0),
    liked,
    commentsCount: comments.length,
    comments: comments.map(normalizeCommunityCommentForApi),
    allowComments: post.allowComments !== false,
    publicVisible: post.publicVisible !== false,
    syncFamily: Boolean(post.syncFamily),
    createdAt: post.createdAt || now(),
    time: communityTimeText(post.createdAt),
    likeEndpoint: `/api/user/community/posts/${encodeURIComponent(post.id)}/like`,
    commentEndpoint: `/api/user/community/posts/${encodeURIComponent(post.id)}/comments`,
    shareEndpoint: "/api/ui/actions",
  };
}

function userCommunityForApi(db, auth, params = {}) {
  const community = ensureUserCommunity(db);
  const user = userForAuth(db, auth);
  const filter = USER_COMMUNITY_FILTERS.includes(params.filter) ? params.filter : "推荐";
  const groups = community.groups.map((group) => normalizeCommunityGroupForApi(group, user.id));
  const posts = community.posts.map((post) => normalizeCommunityPostForApi(post, user.id));
  const filteredGroups = groups.filter((group) => userCommunityMatchesFilter(group, filter));
  const filteredPosts = posts.filter((post) => userCommunityMatchesFilter(post, filter));
  return {
    sourceEndpoint: "/api/user/community",
    query: { filter },
    filters: USER_COMMUNITY_FILTERS.map((key) => ({
      key,
      count: key === "推荐"
        ? groups.length + posts.length
        : groups.filter((group) => userCommunityMatchesFilter(group, key)).length + posts.filter((post) => userCommunityMatchesFilter(post, key)).length,
    })),
    hero: {
      image: "community-hero.jpg",
      points: ["结识同城伙伴", "参与精彩活动", "分享旅居经验"],
    },
    groups: filteredGroups,
    posts: filteredPosts,
    draft: community.drafts[user.id] || null,
    summary: {
      totalGroups: groups.length,
      totalPosts: posts.length,
      filtered: filteredGroups.length + filteredPosts.length,
      joinedGroups: groups.filter((group) => group.joined).length,
      updatedAt: now(),
    },
    endpoints: {
      page: "/api/user/community",
      join: "/api/user/community/groups/{id}/join",
      createPost: "/api/user/community/posts",
      like: "/api/user/community/posts/{id}/like",
      comment: "/api/user/community/posts/{id}/comments",
      draft: "/api/user/community/draft",
    },
  };
}

function findCommunityGroup(db, groupId) {
  const community = ensureUserCommunity(db);
  return community.groups.find((group) => group.id === groupId);
}

function findCommunityPost(db, postId) {
  const community = ensureUserCommunity(db);
  return community.posts.find((post) => post.id === postId);
}

const USER_CHECKIN_FILTERS = ["全部", "景点打卡", "活动打卡", "健康打卡", "美食打卡"];

function ensureUserCheckin(db) {
  if (!db.userCheckin || typeof db.userCheckin !== "object") db.userCheckin = {};
  const checkin = db.userCheckin;
  if (!Array.isArray(checkin.records) || !checkin.records.length) {
    checkin.records = [
      {
        id: "checkin-record-001",
        title: "晨练太极",
        place: "湖泉生态园",
        text: "清晨练太极，舒展身心，迎接美好的一天！",
        image: "ref/checkin-record-taiji.png",
        type: "健康打卡",
        date: "06/20",
        weekday: "今天",
        weather: "晴朗",
        steps: 6850,
        points: 10,
        likesCount: 26,
        likedBy: [],
        commentsCount: 8,
        createdAt: "2026-06-20 07:30",
      },
      {
        id: "checkin-record-002",
        title: "湖边散步",
        place: "湖泉湖畔步道",
        text: "湖风拂面，景色宜人，散步好惬意。",
        image: "ref/checkin-record-lake.png",
        type: "景点打卡",
        date: "06/19",
        weekday: "昨天",
        weather: "多云",
        steps: 7420,
        points: 10,
        likesCount: 18,
        likedBy: [],
        commentsCount: 6,
        createdAt: "2026-06-19 08:20",
      },
      {
        id: "checkin-record-003",
        title: "书画交流会",
        place: "湖泉康养中心书画室",
        text: "与书画爱好者交流创作，收获满满！",
        image: "ref/checkin-record-calligraphy.png",
        type: "活动打卡",
        date: "06/18",
        weekday: "周四",
        weather: "晴朗",
        steps: 5200,
        points: 12,
        likesCount: 32,
        likedBy: [],
        commentsCount: 12,
        createdAt: "2026-06-18 15:10",
      },
      {
        id: "checkin-record-004",
        title: "社区营养餐",
        place: "湖泉康养餐厅",
        text: "今天试了少盐菌汤，味道清淡舒服。",
        image: "food-ref-soup.jpg",
        type: "美食打卡",
        date: "06/17",
        weekday: "周三",
        weather: "晴朗",
        steps: 4380,
        points: 8,
        likesCount: 21,
        likedBy: [],
        commentsCount: 4,
        createdAt: "2026-06-17 12:30",
      },
    ];
  }
  if (!Array.isArray(checkin.achievements) || !checkin.achievements.length) {
    checkin.achievements = [
      { id: "checkin-achievement-001", title: "连续打卡7天", text: "坚持旅居最美风景", image: "ref/checkin-badge-streak.png" },
      { id: "checkin-achievement-002", title: "康养达人", text: "健康生活每一天", image: "ref/checkin-badge-health.png" },
      { id: "checkin-achievement-003", title: "活动明星", text: "积极参与多彩活动", image: "ref/checkin-badge-star.png" },
    ];
  }
  return checkin;
}

function checkinDateParts(createdAt = "") {
  const text = String(createdAt || "");
  if (text.startsWith("2026-06-20")) return { date: "06/20", weekday: "今天" };
  if (text.startsWith("2026-06-19")) return { date: "06/19", weekday: "昨天" };
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return { date: text.slice(5, 10), weekday: text.slice(5, 10) };
  return { date: "今天", weekday: "刚刚" };
}

function normalizeCheckinRecordForApi(record = {}, userId = "user-001") {
  const likedBy = Array.isArray(record.likedBy) ? record.likedBy : [];
  const dateParts = checkinDateParts(record.createdAt);
  return {
    id: record.id,
    title: record.title || "旅居打卡",
    place: record.place || "当前旅居地",
    text: record.text || "",
    image: record.image || "checkin-today-ref.png",
    type: USER_CHECKIN_FILTERS.includes(record.type) ? record.type : "景点打卡",
    tag: USER_CHECKIN_FILTERS.includes(record.type) ? record.type : "景点打卡",
    date: record.date || dateParts.date,
    weekday: record.weekday || dateParts.weekday,
    weather: record.weather || "晴朗",
    steps: Number(record.steps || 0),
    stepsText: `${Number(record.steps || 0)}步`,
    points: Number(record.points || 0),
    likesCount: Number(record.likesCount || 0),
    liked: likedBy.includes(userId),
    commentsCount: Number(record.commentsCount || 0),
    createdAt: record.createdAt || now(),
    detailEndpoint: `/api/user/checkin/records/${encodeURIComponent(record.id)}`,
    likeEndpoint: `/api/user/checkin/records/${encodeURIComponent(record.id)}/like`,
    shareEndpoint: "/api/ui/actions",
  };
}

function userCheckinForApi(db, auth, params = {}) {
  const checkin = ensureUserCheckin(db);
  const user = userForAuth(db, auth);
  const type = USER_CHECKIN_FILTERS.includes(params.type) ? params.type : "全部";
  const records = checkin.records.map((record) => normalizeCheckinRecordForApi(record, user.id));
  const filteredRecords = type === "全部" ? records : records.filter((record) => record.type === type);
  const todayRecord = records[0] || {};
  const totalPoints = records.reduce((sum, record) => sum + Number(record.points || 0), 0);
  return {
    sourceEndpoint: "/api/user/checkin",
    query: { type },
    hero: { image: "checkin-hero.jpg" },
    today: {
      title: "今日打卡",
      place: todayRecord.place || "湖泉生态园",
      image: todayRecord.image || "checkin-today-ref.png",
      weather: todayRecord.weather || "晴朗",
      steps: Number(todayRecord.steps || 6850),
      stepsText: `${Number(todayRecord.steps || 6850)}步`,
      completed: Boolean(checkin.completedToday),
      actionText: checkin.completedToday ? "已完成今日打卡" : "拍照打卡",
    },
    typeFilters: USER_CHECKIN_FILTERS.map((key) => ({
      key,
      count: key === "全部" ? records.length : records.filter((record) => record.type === key).length,
    })),
    records: filteredRecords,
    allRecords: records,
    achievements: checkin.achievements,
    summary: {
      totalRecords: records.length,
      filtered: filteredRecords.length,
      totalPoints,
      streakDays: 7,
      updatedAt: now(),
    },
    endpoints: {
      page: "/api/user/checkin",
      photo: "/api/user/checkin/photo",
      detail: "/api/user/checkin/records/{id}",
      like: "/api/user/checkin/records/{id}/like",
      share: "/api/ui/actions",
    },
  };
}

function findCheckinRecord(db, recordId) {
  const checkin = ensureUserCheckin(db);
  return checkin.records.find((record) => record.id === recordId);
}

const USER_FOOD_CATEGORIES = ["全部", "特色小吃", "营养餐", "团餐预订", "家属代订"];

function ensureUserFood(db) {
  if (!db.userFood || typeof db.userFood !== "object") db.userFood = {};
  const food = db.userFood;
  if (!Array.isArray(food.favoriteIds)) food.favoriteIds = [];
  if (!Array.isArray(food.bookings)) food.bookings = [];
  if (!Array.isArray(food.orders)) food.orders = [];
  if (!Array.isArray(food.routeRequests)) food.routeRequests = [];
  return food;
}

function userFoodCatalog() {
  return [
    {
      id: "food-restaurant-huquan",
      name: "湖泉养生餐厅",
      category: "营养餐",
      type: "养生餐",
      rating: 4.8,
      reviewsCount: 286,
      distance: "1.1km",
      address: "弥勒湖泉生态园康养中心一楼",
      phone: "0873-6228899",
      description: "主打低盐低油养生菜，食材新鲜健康，适合高血压和慢病老人。",
      tags: ["少油少盐", "适老座位", "可送达"],
      image: "food-ref-restaurant.jpg",
      badge: "推荐",
      badgeColor: "green",
      action: "预约",
      actionIcon: "calendar-check",
      actionColor: "green",
      position: [103.4148, 24.4076],
      menu: [
        { id: "menu-huquan-soup", name: "菌汤套餐", price: 68, desc: "野生菌清汤、时蔬、粗粮饭", tags: ["少盐", "清淡"] },
        { id: "menu-huquan-fish", name: "清蒸湖鱼套餐", price: 58, desc: "低油清蒸，搭配当季蔬菜", tags: ["高蛋白", "少油"] },
        { id: "menu-huquan-porridge", name: "营养粥品", price: 28, desc: "南瓜小米粥，软烂易消化", tags: ["易消化", "早餐"] },
      ],
    },
    {
      id: "food-restaurant-chicken",
      name: "弥勒卤鸡老店",
      category: "特色小吃",
      type: "本地特色",
      rating: 4.7,
      reviewsCount: 192,
      distance: "800m",
      address: "弥勒市温泉路老街口",
      phone: "0873-6132288",
      description: "百年卤味传承，皮脆肉嫩，可提供少盐分装。",
      tags: ["少盐卤味", "本地老店", "可预约"],
      image: "food-ref-chicken.jpg",
      badge: "热卖",
      badgeColor: "orange",
      action: "预约",
      actionIcon: "calendar-check",
      actionColor: "orange",
      position: [103.4183, 24.4102],
      menu: [
        { id: "menu-chicken-light", name: "少盐卤鸡饭", price: 39, desc: "少盐卤鸡、米饭、青菜", tags: ["本地特色", "少盐"] },
        { id: "menu-chicken-half", name: "半只卤鸡", price: 88, desc: "家庭分享装，可备注少盐", tags: ["家庭餐", "可打包"] },
      ],
    },
    {
      id: "food-restaurant-soup",
      name: "云南菌汤馆",
      category: "营养餐",
      type: "山珍菌汤",
      rating: 4.9,
      reviewsCount: 324,
      distance: "1.6km",
      address: "弥勒市湖泉西路 18 号",
      phone: "0873-6168899",
      description: "野生菌现煲汤，营养鲜美，清淡不腻，环境安静。",
      tags: ["菌汤养生", "少盐少油", "环境安静"],
      image: "food-ref-soup.jpg",
      badge: "特色",
      badgeColor: "purple",
      action: "预约",
      actionIcon: "calendar-check",
      actionColor: "purple",
      position: [103.4056, 24.4115],
      menu: [
        { id: "menu-soup-mixed", name: "山珍菌汤锅", price: 98, desc: "多菌拼配，可选少盐汤底", tags: ["菌汤", "养生"] },
        { id: "menu-soup-rice", name: "菌汤米线", price: 36, desc: "清汤米线，软硬可备注", tags: ["清淡", "主食"] },
      ],
    },
    {
      id: "food-restaurant-delivery",
      name: "社区营养餐配送",
      category: "家属代订",
      type: "营养配餐",
      rating: 4.8,
      reviewsCount: 156,
      distance: "2.0km",
      address: "弥勒康养社区配餐中心",
      phone: "0873-6188899",
      description: "营养师搭配，少油少盐，送餐上门，支持家属远程代订。",
      tags: ["营养均衡", "少油少盐", "送餐上门"],
      image: "food-ref-delivery.jpg",
      badge: "配送",
      badgeColor: "blue",
      action: "立即订餐",
      actionIcon: "bike",
      actionColor: "blue",
      position: [103.4221, 24.4168],
      menu: [
        { id: "menu-delivery-lunch", name: "适老午餐", price: 32, desc: "一荤两素一汤，少油少盐", tags: ["送餐", "营养餐"] },
        { id: "menu-delivery-week", name: "一周营养餐", price: 198, desc: "7 天套餐，家属可代订", tags: ["家属代订", "套餐"] },
      ],
    },
    {
      id: "food-restaurant-group",
      name: "湖泉康养团餐厅",
      category: "团餐预订",
      type: "团餐预订",
      rating: 4.6,
      reviewsCount: 88,
      distance: "1.4km",
      address: "湖泉康养中心二楼团餐厅",
      phone: "0873-6208899",
      description: "支持活动团队和家属聚餐预订，菜单可按慢病禁忌调整。",
      tags: ["多人订餐", "慢病禁忌", "包间可约"],
      image: "food-ref-restaurant.jpg",
      badge: "团餐",
      badgeColor: "green",
      action: "预约",
      actionIcon: "calendar-check",
      actionColor: "green",
      position: [103.4136, 24.4089],
      menu: [
        { id: "menu-group-table", name: "四人养生团餐", price: 268, desc: "低油热菜、菌汤、粗粮主食", tags: ["团餐", "少油"] },
        { id: "menu-group-family", name: "家属聚餐套餐", price: 388, desc: "适合 6-8 人，可备注禁忌", tags: ["家属", "预约"] },
      ],
    },
  ];
}

function foodSearchText(restaurant = {}) {
  return [
    restaurant.id,
    restaurant.name,
    restaurant.category,
    restaurant.type,
    restaurant.address,
    restaurant.description,
    ...(restaurant.tags || []),
    ...(restaurant.menu || []).flatMap((item) => [item.name, item.desc, ...(item.tags || [])]),
  ].join(" ");
}

function foodMatchesCategory(restaurant, category = "全部") {
  if (!category || category === "全部") return true;
  const displayText = [
    restaurant.name,
    restaurant.category,
    restaurant.type,
    restaurant.description,
    ...(restaurant.tags || []),
  ].join(" ");
  const haystack = foodSearchText(restaurant);
  if (category === "营养餐") return /营养|养生|菌汤|健康|配餐/.test(displayText);
  if (category === "特色小吃") return /特色|卤鸡|老店|本地/.test(displayText);
  if (category === "团餐预订") return /团餐|多人|聚餐|团队/.test(displayText);
  if (category === "家属代订") return /家属代订|代订|配送|送餐/.test(displayText);
  return haystack.includes(category);
}

function foodMapUrl(restaurant, city = "弥勒") {
  const routeCity = /弥勒/.test(`${restaurant.name || ""}${restaurant.address || ""}`) ? "弥勒" : city;
  const keyword = `${routeCity} ${restaurant.name} ${restaurant.address || ""}`.trim();
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}&city=${encodeURIComponent(routeCity)}&src=${encodeURIComponent("云旅无忧")}&callnative=1`;
}

function foodRestaurantForApi(restaurant, food, city = "弥勒") {
  const favorite = food.favoriteIds.includes(restaurant.id);
  const bookings = food.bookings.filter((item) => item.restaurantId === restaurant.id).length;
  const orders = food.orders.filter((item) => item.restaurantId === restaurant.id).length;
  return {
    ...restaurant,
    favorite,
    bookings,
    orders,
    reviews: `${Number(restaurant.reviewsCount || 0)}条评价`,
    distanceText: restaurant.distance || "附近",
    mapUrl: foodMapUrl(restaurant, city),
    detailEndpoint: `/api/user/food/restaurants/${encodeURIComponent(restaurant.id)}`,
    menuEndpoint: `/api/user/food/restaurants/${encodeURIComponent(restaurant.id)}/menu`,
    bookEndpoint: `/api/user/food/restaurants/${encodeURIComponent(restaurant.id)}/book`,
    orderEndpoint: `/api/user/food/restaurants/${encodeURIComponent(restaurant.id)}/order`,
    routeEndpoint: `/api/user/food/restaurants/${encodeURIComponent(restaurant.id)}/route`,
    favoriteEndpoint: `/api/user/food/restaurants/${encodeURIComponent(restaurant.id)}/favorite`,
    consultEndpoint: `/api/user/food/restaurants/${encodeURIComponent(restaurant.id)}/consult`,
  };
}

function userFoodForApi(db, auth, params = {}) {
  const food = ensureUserFood(db);
  const user = userForAuth(db, auth);
  const city = user.currentCity || db.elderProfile?.currentCity || "弥勒";
  const category = USER_FOOD_CATEGORIES.includes(params.category) ? params.category : "全部";
  const q = String(params.q || "").trim();
  const catalog = userFoodCatalog();
  const filtered = catalog.filter((restaurant) => {
    if (!foodMatchesCategory(restaurant, category)) return false;
    if (q && !foodSearchText(restaurant).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  return {
    sourceEndpoint: "/api/user/food",
    query: { category, q },
    user: { id: user.id, nickname: user.nickname, currentCity: city },
    hero: {
      image: "food-ref-hero.jpg",
      title: "适合老人的本地好味道",
      text: "基于健康档案、距离、评价和适老服务推荐。",
    },
    healthAdvice: {
      title: "根据您的健康档案推荐",
      text: "高血压建议少盐饮食，每日盐摄入量建议 < 5g，优先选择清淡温热餐食。",
      actionText: "查看饮食建议",
    },
    categories: USER_FOOD_CATEGORIES.map((key) => ({
      key,
      count: key === "全部" ? catalog.length : catalog.filter((restaurant) => foodMatchesCategory(restaurant, key)).length,
    })),
    restaurants: filtered.map((restaurant) => foodRestaurantForApi(restaurant, food, city)),
    allRestaurants: catalog.map((restaurant) => foodRestaurantForApi(restaurant, food, city)),
    summary: {
      total: catalog.length,
      filtered: filtered.length,
      bookings: food.bookings.length,
      orders: food.orders.length,
      favorites: food.favoriteIds.length,
      updatedAt: now(),
    },
    map: {
      title: "美食地图",
      city,
      keyword: `${city} 适老餐厅 营养餐`,
      url: `https://uri.amap.com/search?keyword=${encodeURIComponent(`${city} 适老餐厅 营养餐`)}&city=${encodeURIComponent(city)}&src=${encodeURIComponent("云旅无忧")}&callnative=1`,
    },
    endpoints: {
      list: "/api/user/food",
      detail: "/api/user/food/restaurants/{id}",
      menu: "/api/user/food/restaurants/{id}/menu",
      book: "/api/user/food/restaurants/{id}/book",
      order: "/api/user/food/restaurants/{id}/order",
      route: "/api/user/food/restaurants/{id}/route",
      favorite: "/api/user/food/restaurants/{id}/favorite",
      consult: "/api/user/food/restaurants/{id}/consult",
    },
  };
}

function findUserFoodRestaurant(db, auth, restaurantId) {
  const food = ensureUserFood(db);
  const user = userForAuth(db, auth);
  const city = user.currentCity || db.elderProfile?.currentCity || "弥勒";
  const raw = userFoodCatalog().find((item) => item.id === restaurantId);
  if (!raw) return null;
  return {
    food,
    user,
    city,
    raw,
    restaurant: foodRestaurantForApi(raw, food, city),
  };
}

function createFoodServiceRequest(db, auth, restaurant, body = {}, actionName = "预约餐厅") {
  const user = userForAuth(db, auth);
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: user.id,
    elderName: body.elderName || db.elderProfile?.name || user.nickname || "",
    route: "food",
    action: actionName,
    type: body.type || restaurant.category || "餐饮服务",
    providerType: "merchant",
    providerId: restaurant.id,
    status: "待处理",
    priority: body.priority || "P2",
    description: body.description || body.note || `${actionName}：${restaurant.name}`,
    payload: {
      ...(body.payload || {}),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      diners: Number(body.diners || 1),
      source: body.source || "food",
    },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  addMessage(db, "admin", "新的餐饮服务请求", `${requestItem.elderName}提交了「${restaurant.name}」${actionName}。`, {
    scenario: "餐饮服务",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  addMessage(db, "user", "餐饮服务请求已提交", `您的「${restaurant.name}」${actionName}已生成请求 ${requestItem.requestNo}。`, {
    scenario: "餐饮服务",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  return requestItem;
}

const USER_TRANSPORT_SERVICES = [
  { key: "station-pickup", iconName: "train-front", action: "接发站", title: "接发站", text: "火车/高铁/机场", color: "green", type: "接送出行", priority: "P1", providerType: "guide" },
  { key: "car-book", iconName: "car", action: "预约用车", title: "预约用车", text: "专车服务", color: "blue", type: "预约用车", priority: "P1", providerType: "merchant" },
  { key: "bus-query", iconName: "bus", action: "公交查询", title: "公交查询", text: "实时公交到站", color: "orange", type: "公交查询", priority: "P2", providerType: "merchant" },
  { key: "accessible-ride", iconName: "accessibility", action: "无障碍出行", title: "无障碍出行", text: "适老无障碍车", color: "purple", type: "无障碍出行", priority: "P1", providerType: "merchant" },
  { key: "guide-charter", iconName: "bus-front", action: "导游包车", title: "导游包车", text: "景区/周边游", color: "blue", type: "导游包车", priority: "P1", providerType: "guide" },
  { key: "family-ride", iconName: "user-round-check", action: "家属代叫车", title: "家属代叫车", text: "帮家人叫车", color: "red", type: "家属代叫车", priority: "P1", providerType: "merchant" },
];

function ensureUserTransport(db) {
  if (!db.userTransport || typeof db.userTransport !== "object") db.userTransport = {};
  const transport = db.userTransport;
  if (!Array.isArray(transport.records) || !transport.records.length) {
    transport.records = [
      {
        id: "transport-record-001",
        title: "湖泉生态园往返",
        destination: "湖泉生态园",
        mode: "步行 + 接驳车",
        status: "已完成",
        time: "12分钟",
        distance: "约 1.2 公里",
        color: "green",
        iconName: "map-pin",
        createdAt: "2026-06-20 08:20",
      },
      {
        id: "transport-record-002",
        title: "弥勒市人民医院",
        destination: "弥勒市人民医院",
        mode: "人工向导接送",
        status: "待出发",
        time: "18分钟",
        distance: "约 3.2 公里",
        color: "blue",
        iconName: "building-2",
        createdAt: "2026-06-20 10:10",
      },
      {
        id: "transport-record-003",
        title: "昆明南站接站",
        destination: "昆明南站",
        mode: "高铁 + 专车",
        status: "已预约",
        time: "1小时20分",
        distance: "约 120 公里",
        color: "orange",
        iconName: "bus",
        createdAt: "2026-06-19 16:30",
      },
    ];
  }
  if (!Array.isArray(transport.routePlans)) transport.routePlans = [];
  if (!Array.isArray(transport.serviceRequests)) transport.serviceRequests = [];
  return transport;
}

function transportCityForUser(db, auth) {
  const user = userForAuth(db, auth);
  return user.currentCity || db.elderProfile?.currentCity || "昆明";
}

function normalizeTransportCityName(city = "昆明") {
  return String(city || "昆明").replace(/市$/, "") || "昆明";
}

function transportCommonDestinationsForApi(city = "昆明") {
  const normalized = normalizeTransportCityName(city);
  if (normalized.includes("湖州")) return ["湖州站", "湖州市中心医院", "南太湖新区", "月亮广场"];
  if (normalized.includes("景洪") || normalized.includes("西双版纳")) return ["景洪客运站", "西双版纳州人民医院", "告庄西双景", "曼听公园"];
  if (normalized.includes("弥勒")) return ["弥勒站", "弥勒市人民医院", "湖泉生态园", "市文化馆"];
  return ["昆明南站", "云南省第一人民医院", "翠湖公园", "市文化馆"];
}

function transportOriginForApi(db, auth) {
  const city = transportCityForUser(db, auth);
  return {
    title: `${normalizeTransportCityName(city)}当前位置`,
    city: normalizeTransportCityName(city),
    synced: true,
    coordinates: Array.isArray(db.elderProfile?.location?.coordinates) ? db.elderProfile.location.coordinates : [102.8329, 24.8801],
  };
}

function transportAmapNavigationUrl(originTitle, destination, city = "昆明") {
  const destinationText = String(destination || "目的地").trim() || "目的地";
  const knownDestinationCity = destinationText.match(/昆明|弥勒|湖州|景洪|西双版纳/)?.[0] || "";
  const routeCity = knownDestinationCity || normalizeTransportCityName(city);
  const target = knownDestinationCity ? destinationText : `${routeCity}${destinationText}`;
  return `https://uri.amap.com/navigation?from=${encodeURIComponent(originTitle)}&to=${encodeURIComponent(target)}&mode=car&policy=1&src=${encodeURIComponent("云旅无忧")}&callnative=1`;
}

function createTransportRoute(raw = {}, originTitle = "当前位置", city = "昆明") {
  const destination = raw.destination || raw.title?.replace(/^去/, "") || "目的地";
  return {
    id: raw.id || `transport-route-${String(destination).replace(/[^\w\u4e00-\u9fa5]+/g, "-").slice(0, 24)}`,
    title: raw.title || `去${destination}`,
    destination,
    text: raw.text || raw.mode || "推荐适老出行路线",
    mode: raw.mode || raw.text || "推荐适老出行路线",
    time: raw.time || "20分钟",
    distance: raw.distance || "约 5 公里",
    color: raw.color || "blue",
    iconName: raw.iconName || "navigation",
    url: raw.url || transportAmapNavigationUrl(originTitle, destination, city),
    navigationEndpoint: "/api/user/transport/route",
  };
}

function transportRouteCatalog(city = "昆明", originTitle = "当前位置") {
  const normalized = normalizeTransportCityName(city);
  const base = normalized.includes("弥勒")
    ? [
      { id: "transport-route-huquan", title: "去湖泉生态园", destination: "湖泉生态园", text: "推荐公交出行 · 途经 2 个站点", time: "12分钟", distance: "约 1.2 公里", color: "green", iconName: "map-pin" },
      { id: "transport-route-culture", title: "去市文化馆", destination: "市文化馆", text: "推荐步行 + 公交 · 途经 3 个站点", time: "18分钟", distance: "约 2.3 公里", color: "purple", iconName: "building-2" },
      { id: "transport-route-railway", title: "去昆明南站", destination: "昆明南站", text: "推荐高铁出行 · 弥勒站乘车", time: "1小时20分", distance: "约 120 公里", color: "orange", iconName: "bus" },
      { id: "transport-route-hospital", title: "去弥勒市人民医院", destination: "弥勒市人民医院", text: "推荐预约用车 · 医院东门下车", time: "18分钟", distance: "约 3.2 公里", color: "blue", iconName: "hospital" },
      { id: "transport-route-market", title: "去佛城商都", destination: "佛城商都", text: "公交 + 步行", time: "26分钟", distance: "约 5.1 公里", color: "green", iconName: "shopping-bag" },
    ]
    : [
      { id: "transport-route-kunming-south", title: "去昆明南站", destination: "昆明南站", text: "推荐地铁 + 无障碍接驳", time: "42分钟", distance: "约 28 公里", color: "orange", iconName: "bus" },
      { id: "transport-route-hospital", title: "去云南省第一人民医院", destination: "云南省第一人民医院", text: "推荐预约用车 · 直达门诊楼", time: "22分钟", distance: "约 8.6 公里", color: "blue", iconName: "building-2" },
      { id: "transport-route-cuihu", title: "去翠湖公园", destination: "翠湖公园", text: "推荐公交出行 · 途经 4 个站点", time: "18分钟", distance: "约 4.2 公里", color: "green", iconName: "map-pin" },
      { id: "transport-route-culture", title: "去市文化馆", destination: "市文化馆", text: "推荐步行 + 公交", time: "25分钟", distance: "约 5.4 公里", color: "purple", iconName: "building-2" },
      { id: "transport-route-airport", title: "去昆明长水机场", destination: "昆明长水机场", text: "推荐机场快线 + 专车", time: "55分钟", distance: "约 31 公里", color: "blue", iconName: "plane" },
    ];
  return base.map((route) => createTransportRoute(route, originTitle, normalized));
}

function transportNearbyForApi(city = "昆明") {
  const normalized = normalizeTransportCityName(city);
  if (normalized.includes("弥勒")) {
    return [
      { id: "nearby-shuttle", title: "社区接驳车站", type: "接驳车", distance: "步行 3 分钟", desc: "湖泉社区南门，07:30-18:30 循环发车", iconName: "bus", color: "green" },
      { id: "nearby-bus", title: "公交湖泉站", type: "公交站", distance: "步行 5 分钟", desc: "可前往弥勒站、市人民医院", iconName: "bus-front", color: "orange" },
      { id: "nearby-accessible", title: "无障碍车辆服务点", type: "适老车辆", distance: "驾车 8 分钟", desc: "支持轮椅上下车和家属代叫车", iconName: "accessibility", color: "purple" },
    ];
  }
  return [
    { id: "nearby-metro", title: "地铁 5 号线站点", type: "地铁", distance: "步行 6 分钟", desc: "可换乘前往昆明南站", iconName: "train-front", color: "green" },
    { id: "nearby-bus", title: "公交滇池路站", type: "公交站", distance: "步行 4 分钟", desc: "多条适老公交线路覆盖", iconName: "bus-front", color: "orange" },
    { id: "nearby-ride", title: "无障碍网约车上车点", type: "适老车辆", distance: "步行 2 分钟", desc: "平台认证司机优先接单", iconName: "accessibility", color: "purple" },
  ];
}

function normalizeTransportRecord(record = {}) {
  return {
    id: record.id,
    title: record.title || record.destination || "出行记录",
    destination: record.destination || record.title || "",
    mode: record.mode || record.text || "适老出行",
    status: record.status || "已记录",
    text: `${record.mode || record.text || "适老出行"} · ${record.status || "已记录"}`,
    time: record.time || "20分钟",
    distance: record.distance || "约 5 公里",
    color: record.color || "blue",
    iconName: record.iconName || "navigation",
    url: record.url || "",
    relatedRequestId: record.relatedRequestId || "",
    createdAt: record.createdAt || now(),
    navigationEndpoint: "/api/user/transport/route",
  };
}

function userTransportForApi(db, auth, params = {}) {
  const transport = ensureUserTransport(db);
  const origin = transportOriginForApi(db, auth);
  const destination = String(params.destination || "").trim();
  const catalog = transportRouteCatalog(origin.city, origin.title);
  const selectedRoute = destination ? createTransportRoute({
    id: `transport-route-query-${String(destination).replace(/[^\w\u4e00-\u9fa5]+/g, "-").slice(0, 20)}`,
    title: `去${destination}`,
    destination,
    text: /医院/.test(destination) ? "推荐预约用车 · 直达门诊楼" : /站|机场/.test(destination) ? "推荐公共交通 + 接驳" : "推荐适老路线",
    time: /昆明南站|机场/.test(destination) ? "42分钟" : "22分钟",
    distance: /昆明南站|机场/.test(destination) ? "约 28 公里" : "约 8 公里",
    color: /医院/.test(destination) ? "blue" : "green",
    iconName: /医院/.test(destination) ? "building-2" : "navigation",
  }, origin.title, origin.city) : null;
  const routes = selectedRoute
    ? [selectedRoute, ...catalog.filter((route) => route.destination !== selectedRoute.destination)].slice(0, 4)
    : catalog.slice(0, 3);
  return {
    sourceEndpoint: "/api/user/transport",
    query: { destination },
    origin,
    commonDestinations: transportCommonDestinationsForApi(origin.city),
    quickServices: USER_TRANSPORT_SERVICES.map((service) => ({
      ...service,
      requestEndpoint: `/api/user/transport/services/${encodeURIComponent(service.key)}/request`,
    })),
    nearby: transportNearbyForApi(origin.city),
    routes,
    moreRoutes: catalog.slice(3),
    records: transport.records.map(normalizeTransportRecord),
    summary: {
      routeCount: catalog.length,
      recordCount: transport.records.length,
      serviceRequestCount: transport.serviceRequests.length,
      updatedAt: now(),
    },
    safetyTip: {
      title: "安全提示",
      text: "夜间出行建议联系人工向导或家属，确保您的安全。",
    },
    endpoints: {
      page: "/api/user/transport",
      route: "/api/user/transport/route",
      nearby: "/api/user/transport/nearby",
      records: "/api/user/transport/records",
      service: "/api/user/transport/services/{key}/request",
    },
  };
}

function findTransportService(serviceKey) {
  return USER_TRANSPORT_SERVICES.find((service) => service.key === serviceKey || service.action === serviceKey || service.title === serviceKey);
}

function createTransportServiceRequest(db, auth, service, body = {}) {
  const user = userForAuth(db, auth);
  const destination = String(body.destination || body.target || "交通出行推荐路线").slice(0, 80);
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: user.id,
    elderName: body.elderName || db.elderProfile?.name || user.nickname || "",
    route: "transport",
    action: service.action,
    type: service.type,
    providerType: service.providerType,
    providerId: "",
    status: "待处理",
    priority: body.priority || service.priority || "P1",
    description: body.description || `${service.action}：${destination}`,
    payload: {
      ...(body.payload || {}),
      serviceKey: service.key,
      destination,
      source: body.source || "transport",
    },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  addMessage(db, "admin", "新的交通出行请求", `${requestItem.elderName}提交了「${service.action}」：${destination}。`, {
    scenario: "交通出行",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  addMessage(db, "user", "交通出行请求已提交", `您的「${service.action}」请求已生成 ${requestItem.requestNo}。`, {
    scenario: "交通出行",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  return requestItem;
}

const USER_SHOP_CATEGORIES = [
  { title: "健康监测", desc: "守护健康", icon: "heart-pulse", color: "green" },
  { title: "日常护理", desc: "舒适护理", icon: "droplet", color: "orange" },
  { title: "旅居用品", desc: "出行无忧", icon: "luggage", color: "blue" },
  { title: "营养食品", desc: "营养健康", icon: "leaf", color: "purple" },
  { title: "智能设备", desc: "智慧生活", icon: "bot", color: "cyan" },
  { title: "活动周边", desc: "精彩旅居", icon: "flag", color: "red" },
];

const USER_SHOP_PRODUCTS = [
  { id: "shop-prod-bp", name: "智能血压计", desc: "语音播报 大屏显示", category: "智能设备", price: 199, stock: 36, image: "product-bp-clean.jpg", tags: ["平台精选", "适老推荐", "健康监测"], rating: "4.8", reviews: "286条评价", merchantId: "merchant-001" },
  { id: "shop-prod-cane", name: "防滑助行手杖", desc: "轻便稳固 可折叠调节", category: "日常护理", price: 89, stock: 52, image: "product-cane-clean.jpg", tags: ["适老推荐", "旅居用品"], rating: "4.9", reviews: "152条评价", merchantId: "merchant-001" },
  { id: "shop-prod-pills", name: "便携药盒提醒器", desc: "定时提醒 药量管理", category: "健康监测", price: 129, stock: 44, image: "product-pills-clean.jpg", tags: ["平台精选", "适老推荐"], rating: "4.7", reviews: "198条评价", merchantId: "merchant-001" },
  { id: "shop-prod-soup", name: "云南养生菌汤包", desc: "精选山珍菌菇 低盐配方", category: "营养食品", price: 69, stock: 80, image: "product-soup-clean.jpg", tags: ["平台精选", "营养健康"], rating: "4.8", reviews: "236条评价", merchantId: "merchant-001" },
  { id: "shop-prod-hat", name: "防晒遮阳帽", desc: "轻薄透气 可折叠便携", category: "旅居用品", price: 59, stock: 63, image: "product-hat-clean.jpg", tags: ["适老推荐", "活动周边"], rating: "4.7", reviews: "156条评价", merchantId: "merchant-001" },
  { id: "shop-prod-robot", name: "智能陪伴机器人", desc: "语音提醒 视频通话", category: "智能设备", price: 699, stock: 12, image: "product-bp-clean.jpg", tags: ["智能设备", "平台精选"], rating: "4.6", reviews: "82条评价", merchantId: "merchant-001" },
  { id: "shop-prod-towel", name: "一次性护理巾", desc: "亲肤透气 旅居便携", category: "日常护理", price: 49, stock: 96, image: "product-pills-clean.jpg", tags: ["日常护理"], rating: "4.7", reviews: "118条评价", merchantId: "merchant-001" },
];

function ensureUserShop(db) {
  if (!db.userShop || typeof db.userShop !== "object") db.userShop = {};
  const shop = db.userShop;
  if (!Array.isArray(shop.products) || !shop.products.length) shop.products = USER_SHOP_PRODUCTS.map((product) => ({ ...product }));
  if (!shop.carts || typeof shop.carts !== "object") shop.carts = {};
  if (!Array.isArray(shop.familyRequests)) shop.familyRequests = [];
  return shop;
}

function normalizeShopProduct(product = {}) {
  return {
    id: product.id,
    name: product.name,
    desc: product.desc || product.description || "",
    category: product.category || "旅居用品",
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    image: product.image || "product-bp-clean.jpg",
    tags: Array.isArray(product.tags) ? product.tags : [],
    tag: Array.isArray(product.tags) && product.tags.includes("适老推荐") ? "适老推荐" : "平台精选",
    rating: product.rating || "4.8",
    reviews: product.reviews || "128条评价",
    merchantId: product.merchantId || "merchant-001",
    addCartEndpoint: "/api/user/shop/cart",
    buyEndpoint: "/api/user/shop/orders",
    familyPurchaseEndpoint: "/api/user/shop/family-purchase",
  };
}

function shopCartKey(auth, db) {
  return userForAuth(db, auth).id || auth?.sub || "user-001";
}

function shopCartRaw(db, auth) {
  const shop = ensureUserShop(db);
  const key = shopCartKey(auth, db);
  if (!Array.isArray(shop.carts[key])) shop.carts[key] = [];
  return shop.carts[key];
}

function findShopProduct(db, productId) {
  const shop = ensureUserShop(db);
  return shop.products.find((product) => product.id === productId || product.name === productId);
}

function normalizeShopCartItem(db, item = {}) {
  const product = findShopProduct(db, item.productId) || {};
  return {
    id: item.id,
    productId: item.productId || product.id || "",
    name: item.name || product.name || "优选商城商品",
    desc: item.desc || product.desc || "",
    category: item.category || product.category || "旅居用品",
    image: item.image || product.image || "product-bp-clean.jpg",
    price: Number(item.price || product.price || 0),
    quantity: Number(item.quantity || 1),
    stock: Number(product.stock || item.stock || 0),
    merchantId: item.merchantId || product.merchantId || "merchant-001",
  };
}

function shopCartForApi(db, auth) {
  const items = shopCartRaw(db, auth).map((item) => normalizeShopCartItem(db, item)).filter((item) => item.quantity > 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, count, total };
}

function userShopForApi(db, auth, params = {}) {
  const shop = ensureUserShop(db);
  const category = String(params.category || "").trim();
  const q = String(params.q || params.keyword || "").trim().toLowerCase();
  let products = shop.products.map(normalizeShopProduct);
  if (category && category !== "全部" && category !== "查看全部商品") {
    products = products.filter((product) => (
      product.category === category ||
      product.tags.includes(category) ||
      `${product.name}${product.desc}${product.category}${product.tags.join("")}`.includes(category)
    ));
  }
  if (q) {
    products = products.filter((product) => `${product.name}${product.desc}${product.category}${product.tags.join("")}`.toLowerCase().includes(q));
  }
  return {
    sourceEndpoint: "/api/user/shop",
    query: { category, q },
    categories: USER_SHOP_CATEGORIES,
    products,
    cart: shopCartForApi(db, auth),
    summary: {
      productCount: shop.products.length,
      filteredCount: products.length,
      updatedAt: now(),
    },
    endpoints: {
      page: "/api/user/shop",
      cart: "/api/user/shop/cart",
      checkout: "/api/user/shop/orders",
      familyPurchase: "/api/user/shop/family-purchase",
    },
  };
}

function addShopCartItemForApi(db, auth, body = {}) {
  const product = findShopProduct(db, body.productId || body.id || body.name);
  if (!product) return { error: "商品不存在" };
  const quantity = Math.max(1, Number(body.quantity || 1));
  const cart = shopCartRaw(db, auth);
  let item = cart.find((entry) => entry.productId === product.id);
  if (item) {
    item.quantity = Math.min(Number(product.stock || 0), Number(item.quantity || 1) + quantity);
    item.updatedAt = now();
  } else {
    item = {
      id: nextId(db, "shopCartItem", "shop-cart-item"),
      productId: product.id,
      name: product.name,
      desc: product.desc,
      category: product.category,
      image: product.image,
      price: Number(product.price || 0),
      quantity: Math.min(Number(product.stock || quantity), quantity),
      merchantId: product.merchantId || "merchant-001",
      createdAt: now(),
      updatedAt: now(),
    };
    cart.unshift(item);
  }
  return { item: normalizeShopCartItem(db, item), cart: shopCartForApi(db, auth) };
}

function updateShopCartItemForApi(db, auth, itemId, body = {}) {
  const cart = shopCartRaw(db, auth);
  const item = cart.find((entry) => entry.id === itemId || entry.productId === itemId);
  if (!item) return { cart: shopCartForApi(db, auth) };
  const product = findShopProduct(db, item.productId) || {};
  const nextQuantity = Math.max(0, Math.min(Number(product.stock || 99), Number(body.quantity ?? item.quantity ?? 1)));
  item.quantity = nextQuantity;
  item.updatedAt = now();
  const filtered = cart.filter((entry) => Number(entry.quantity || 0) > 0);
  const shop = ensureUserShop(db);
  shop.carts[shopCartKey(auth, db)] = filtered;
  return { item: nextQuantity ? normalizeShopCartItem(db, item) : null, cart: shopCartForApi(db, auth) };
}

function removeShopCartItemForApi(db, auth, itemId) {
  const shop = ensureUserShop(db);
  const key = shopCartKey(auth, db);
  shop.carts[key] = shopCartRaw(db, auth).filter((entry) => entry.id !== itemId && entry.productId !== itemId);
  return { cart: shopCartForApi(db, auth) };
}

function createShopFamilyPurchaseRequest(db, auth, body = {}) {
  const user = userForAuth(db, auth);
  const product = findShopProduct(db, body.productId || body.id) || ensureUserShop(db).products[0];
  const quantity = Math.max(1, Number(body.quantity || 1));
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: user.id,
    elderName: body.elderName || db.elderProfile?.name || user.nickname || "",
    route: "shop",
    action: "代买服务",
    type: "家属代买",
    providerType: "merchant",
    providerId: product.merchantId || "merchant-001",
    status: "待处理",
    priority: "P2",
    description: body.note || `代买${product.name} x${quantity}`,
    payload: {
      productId: product.id,
      productName: product.name,
      quantity,
      source: body.source || "shop",
    },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  ensureUserShop(db).familyRequests.unshift({ requestId: requestItem.id, productId: product.id, quantity, createdAt: now() });
  addMessage(db, "admin", "新的商城代买请求", `${requestItem.elderName}提交了「${product.name}」代买服务。`, {
    scenario: "优选商城",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  return requestItem;
}

function createShopOrderForApi(db, auth, body = {}) {
  const rawItems = Array.isArray(body.items) && body.items.length ? body.items : shopCartForApi(db, auth).items;
  const items = rawItems.map((item) => {
    const product = findShopProduct(db, item.productId || item.id || item.name) || {};
    return normalizeShopCartItem(db, {
      ...item,
      id: item.id || nextId(db, "shopOrderItem", "shop-order-item"),
      productId: item.productId || product.id,
      name: item.name || product.name,
      desc: item.desc || product.desc,
      category: item.category || product.category,
      image: item.image || product.image,
      price: Number(item.price || product.price || 0),
      quantity: Math.max(1, Number(item.quantity || 1)),
      merchantId: item.merchantId || product.merchantId || "merchant-001",
    });
  }).filter((item) => item.productId);
  if (!items.length) return { error: "请先选择商品后结算" };
  const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: nextId(db, "order", "order"),
    orderNo: nextNo(db, "order", "DD"),
    userId: auth?.sub || userForAuth(db, auth).id || "user-001",
    elderName: body.elderName || db.elderProfile?.name || userForAuth(db, auth).nickname || "",
    serviceType: "优选商城商品结算",
    providerType: "merchant",
    providerId: items[0]?.merchantId || "merchant-001",
    assigneeName: "",
    status: "待派单",
    amount,
    time: body.time || now(),
    location: body.location || db.elderProfile?.address || "旅居地",
    source: "用户端优选商城",
    note: body.note || `商城结算：${items.map((item) => `${item.name}x${item.quantity}`).join("、")}。配送到旅居地，需商户确认库存和配送时间。`,
    phone: body.phone || db.elderProfile?.phone || "",
    items,
    requirementCategory: "",
    requirementPriority: "P2",
    orderFields: {},
    fieldLabels: [],
    missingFields: [],
    createdAt: now(),
    timeline: [],
  };
  addTimeline(order, "待派单", "用户端优选商城提交商品结算订单");
  db.orders.unshift(order);
  items.forEach((item) => {
    const product = findShopProduct(db, item.productId);
    if (product) product.stock = Math.max(0, Number(product.stock || 0) - Number(item.quantity || 1));
  });
  ensureUserShop(db).carts[shopCartKey(auth, db)] = [];
  addMessage(db, "merchant", "新的商城订单", `${order.elderName}提交了商城订单 ${order.orderNo}。`, {
    scenario: "优选商城",
    priority: "P2",
    relatedType: "order",
    relatedId: order.id,
  });
  addMessage(db, "admin", "商城订单待处理", `${order.elderName}提交了「优选商城商品结算」订单。`, {
    scenario: "优选商城",
    priority: "P2",
    relatedType: "order",
    relatedId: order.id,
  });
  return { order };
}

const USER_VOLUNTEER_ACTIONS = [
  { iconName: "hand-heart", title: "申请帮助", text: "发布需求", color: "red", action: "发布求助需求" },
  { iconName: "user-heart", title: "成为志愿者", text: "奉献爱心", color: "green", action: "成为志愿者" },
  { iconName: "users", title: "附近志愿队", text: "查找组织", color: "blue", action: "查看附近志愿队" },
  { iconName: "file-heart", title: "服务记录", text: "我的足迹", color: "orange", action: "查看服务记录" },
];

const USER_VOLUNTEER_DEMANDS = [
  { id: "vol-demand-walk", image: "volunteer-demand-walk.jpg", title: "陪同散步", text: "希望有人陪同湖边散步", time: "1小时内可服务", place: "湖泉生态", distance: "0.6km", phone: "13800138000", status: "招募中", priority: "P1" },
  { id: "vol-demand-activity", image: "volunteer-demand-activity.jpg", title: "活动协助", text: "协助组织太极活动", time: "2小时内可服务", place: "湖泉广场", distance: "0.8km", phone: "13800138001", status: "招募中", priority: "P1" },
  { id: "vol-demand-phone", image: "volunteer-demand-phone.jpg", title: "手机使用帮助", text: "教我使用微信和支付", time: "1小时内可服务", place: "弥勒市区", distance: "1.2km", phone: "13800138002", status: "招募中", priority: "P1" },
  { id: "vol-demand-way", image: "volunteer-demand-way.jpg", title: "社区问路", text: "想了解周边生活服务", time: "30分钟内可服务", place: "湖泉社区", distance: "0.4km", phone: "13800138003", status: "招募中", priority: "P2" },
];

const USER_VOLUNTEER_TEAMS = [
  { id: "vol-team-huquan", image: "volunteer-team-huquan.jpg", title: "湖泉社区志愿队", text: "专注为旅居长者提供生活陪伴与出行帮助", rating: "4.9", count: "128人", response: "平均响应 15 分钟", tags: ["陪伴服务", "出行协助", "活动组织"], phone: "13800138101" },
  { id: "vol-team-silver", image: "volunteer-team-silver.jpg", title: "银龄互助小组", text: "银龄长者互帮互助，传递温暖与快乐", rating: "4.8", count: "96人", response: "平均响应 20 分钟", tags: ["经验分享", "生活帮助", "心理陪伴"], phone: "13800138102" },
  { id: "vol-team-dianchi", image: "volunteer-team-huquan.jpg", title: "滇池银龄志愿队", text: "服务旅居长者出行与活动陪伴", rating: "4.7", count: "82人", response: "平均响应 18 分钟", tags: ["出行协助", "活动陪伴"], phone: "13800138103" },
];

function ensureUserVolunteer(db) {
  if (!db.userVolunteer || typeof db.userVolunteer !== "object") db.userVolunteer = {};
  const volunteer = db.userVolunteer;
  if (!Array.isArray(volunteer.demands) || !volunteer.demands.length) volunteer.demands = USER_VOLUNTEER_DEMANDS.map((item) => ({ ...item }));
  if (!Array.isArray(volunteer.teams) || !volunteer.teams.length) volunteer.teams = USER_VOLUNTEER_TEAMS.map((item) => ({ ...item }));
  if (!Array.isArray(volunteer.records) || !volunteer.records.length) {
    volunteer.records = [
      { id: "vol-record-001", title: "陪同散步", status: "已完成", time: "2026-06-18 09:20", place: "湖泉生态", text: "湖泉社区志愿队陪同湖边慢走 40 分钟", iconName: "heart", color: "green" },
      { id: "vol-record-002", title: "手机使用帮助", status: "已完成", time: "2026-06-16 15:10", place: "弥勒市区", text: "志愿者协助完成微信支付和生活缴费", iconName: "smartphone", color: "blue" },
    ];
  }
  if (!Array.isArray(volunteer.applications)) volunteer.applications = [];
  return volunteer;
}

function normalizeVolunteerDemand(demand = {}, volunteer = null) {
  const records = volunteer?.records || [];
  const responded = Boolean(demand.responded) || records.some((record) => record.demandId === demand.id && record.type === "respond");
  return {
    id: demand.id,
    image: demand.image || "volunteer-demand-way.jpg",
    title: demand.title || "志愿服务需求",
    text: demand.text || demand.description || "需要志愿者协助完成服务。",
    time: demand.time || "1小时内可服务",
    place: demand.place || "湖泉社区",
    distance: demand.distance || "待匹配",
    phone: demand.phone || "13800138000",
    status: responded ? "已响应" : (demand.status || "招募中"),
    priority: demand.priority || "P1",
    responded,
    respondEndpoint: `/api/user/volunteer/demands/${encodeURIComponent(demand.id)}/respond`,
    contactEndpoint: `tel:${demand.phone || "13800138000"}`,
    routeEndpoint: "/api/user/transport/route",
  };
}

function normalizeVolunteerTeam(team = {}, db = null) {
  const contactRequest = (db?.serviceRequests || []).find((request) => (
    request.route === "volunteer" &&
    request.action === "联系志愿队" &&
    (request.providerId === team.id || request.payload?.teamId === team.id) &&
    !["已取消", "已关闭"].includes(request.status)
  ));
  return {
    id: team.id,
    image: team.image || "volunteer-team-huquan.jpg",
    title: team.title || "志愿团队",
    text: team.text || "为旅居长者提供志愿服务",
    rating: team.rating || "4.8",
    count: team.count || "80人",
    response: team.response || "平均响应 20 分钟",
    tags: Array.isArray(team.tags) ? team.tags : [],
    phone: team.phone || "13800138100",
    contactEndpoint: `/api/user/volunteer/teams/${encodeURIComponent(team.id)}/contact`,
    contacted: Boolean(contactRequest),
    requestId: contactRequest?.id || "",
    requestNo: contactRequest?.requestNo || "",
    requestStatus: contactRequest?.status || "",
  };
}

function normalizeVolunteerRecord(record = {}) {
  return {
    id: record.id,
    demandId: record.demandId || "",
    teamId: record.teamId || "",
    title: record.title || "志愿服务记录",
    status: record.status || "已记录",
    time: record.time || now(),
    place: record.place || "",
    text: record.text || "",
    type: record.type || "record",
    iconName: record.iconName || "heart-handshake",
    color: record.color || "blue",
  };
}

function userVolunteerForApi(db, auth) {
  const volunteer = ensureUserVolunteer(db);
  const demands = volunteer.demands.map((demand) => normalizeVolunteerDemand(demand, volunteer));
  const teams = volunteer.teams.map((team) => normalizeVolunteerTeam(team, db));
  const records = volunteer.records.map(normalizeVolunteerRecord);
  return {
    sourceEndpoint: "/api/user/volunteer",
    actions: USER_VOLUNTEER_ACTIONS,
    demands,
    teams: teams.slice(0, 2),
    moreTeams: teams.slice(2),
    records,
    summary: {
      demandCount: demands.length,
      teamCount: teams.length,
      recordCount: records.length,
      updatedAt: now(),
    },
    safety: {
      title: "安全保障",
      items: [
        { iconName: "shield-user", title: "实名认证", text: "志愿者实名认证，服务有保障" },
        { iconName: "clipboard-check", title: "平台派单", text: "需求审核后派单，匹配更精准" },
        { iconName: "camera", title: "服务留痕", text: "全程记录可追溯，安全放心" },
      ],
    },
    endpoints: {
      page: "/api/user/volunteer",
      helpRequest: "/api/user/volunteer/help-requests",
      application: "/api/user/volunteer/applications",
      records: "/api/user/volunteer/records",
    },
  };
}

function createVolunteerHelpRequest(db, auth, body = {}) {
  const volunteer = ensureUserVolunteer(db);
  const user = userForAuth(db, auth);
  const type = String(body.type || "志愿协助").trim();
  const place = String(body.place || body.location || db.elderProfile?.address || "湖泉社区").trim();
  const time = String(body.time || "1小时内可服务").trim();
  const phone = String(body.phone || db.elderProfile?.phone || "13800005678").trim();
  const description = String(body.description || `需要${type}志愿服务`).trim();
  const demand = {
    id: nextId(db, "volunteerDemand", "vol-demand"),
    image: body.image || "volunteer-demand-way.jpg",
    title: type,
    text: description,
    time,
    place,
    distance: body.distance || "待匹配",
    phone,
    status: "招募中",
    priority: body.priority || "P1",
    createdAt: now(),
  };
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: user.id,
    elderName: body.elderName || db.elderProfile?.name || user.nickname || "",
    route: "volunteer",
    action: "发布志愿求助需求",
    type: `志愿服务-${type}`,
    providerType: "volunteer",
    providerId: "",
    status: "待处理",
    priority: body.priority || "P1",
    description,
    payload: { type, place, time, phone, demandId: demand.id, source: body.source || "volunteer" },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  volunteer.demands.unshift({ ...demand, sourceRequestId: requestItem.id });
  addMessage(db, "admin", "新的志愿求助需求", `${requestItem.elderName}提交了「${type}」：${place}。`, {
    scenario: "志愿服务",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  return { requestItem, demand };
}

function createVolunteerApplication(db, auth, body = {}) {
  const volunteer = ensureUserVolunteer(db);
  const user = userForAuth(db, auth);
  const skills = Array.isArray(body.skills) && body.skills.length ? body.skills : ["陪伴服务", "出行协助"];
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: user.id,
    elderName: body.elderName || db.elderProfile?.name || user.nickname || "",
    route: "volunteer",
    action: "成为志愿者",
    type: "志愿者申请",
    providerType: "volunteer",
    providerId: "",
    status: "待审核",
    priority: "P2",
    description: body.description || `申请成为志愿者，服务方向：${skills.join("、")}`,
    payload: { skills, availableTime: body.availableTime || "周末上午", source: body.source || "volunteer" },
    createdAt: now(),
    handledBy: "",
  };
  const record = {
    id: nextId(db, "volunteerRecord", "vol-record"),
    title: "志愿者申请",
    status: "待审核",
    time: now(),
    place: body.availableTime || "周末上午",
    text: `服务方向：${skills.join("、")}`,
    type: "application",
    iconName: "user-heart",
    color: "green",
    requestId: requestItem.id,
  };
  db.serviceRequests.unshift(requestItem);
  volunteer.applications.unshift({ requestId: requestItem.id, userId: user.id, skills, createdAt: now() });
  volunteer.records.unshift(record);
  addMessage(db, "admin", "志愿者申请待审核", `${requestItem.elderName}提交了志愿者申请。`, {
    scenario: "志愿服务",
    priority: "P2",
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  return { requestItem, record };
}

function respondVolunteerDemand(db, auth, demandId, body = {}) {
  const volunteer = ensureUserVolunteer(db);
  const demand = volunteer.demands.find((item) => item.id === demandId);
  if (!demand) return null;
  demand.responded = true;
  demand.status = "已响应";
  demand.respondedAt = now();
  const record = {
    id: nextId(db, "volunteerRecord", "vol-record"),
    demandId,
    title: demand.title,
    status: "已响应",
    time: now(),
    place: demand.place,
    text: `${demand.title}响应成功，可继续联系发布者或导航到服务地点`,
    type: "respond",
    iconName: "hand-heart",
    color: "green",
  };
  volunteer.records.unshift(record);
  const action = recordUiAction(db, auth, {
    role: "user",
    route: "volunteer",
    action: "响应志愿需求",
    target: demandId,
    result: `${demand.title}已响应`,
    payload: { demandId, source: body.source || "volunteer" },
  });
  return { demand: normalizeVolunteerDemand(demand, volunteer), record: normalizeVolunteerRecord(record), action };
}

function contactVolunteerTeam(db, auth, teamId, body = {}) {
  const volunteer = ensureUserVolunteer(db);
  const team = volunteer.teams.find((item) => item.id === teamId);
  if (!team) return null;
  const user = userForAuth(db, auth);
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: user.id,
    elderName: body.elderName || db.elderProfile?.name || user.nickname || "",
    route: "volunteer",
    action: "联系志愿队",
    type: "志愿团队联系",
    providerType: "volunteer",
    providerId: team.id,
    status: "待处理",
    priority: "P2",
    description: body.description || `联系${team.title}`,
    payload: { teamId: team.id, teamName: team.title, phone: team.phone, source: body.source || "volunteer" },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  addMessage(db, "admin", "志愿团队联系请求", `${requestItem.elderName}希望联系${team.title}。`, {
    scenario: "志愿服务",
    priority: "P2",
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  const action = recordUiAction(db, auth, {
    role: "user",
    route: "volunteer",
    action: "联系志愿队",
    target: team.id,
    result: `${team.title}联系请求已提交`,
    payload: { requestId: requestItem.id, teamId: team.id, source: body.source || "volunteer" },
  });
  return { team: normalizeVolunteerTeam(team, db), requestItem, action };
}

const userOrderStatusFilters = ["全部", "待接单", "服务中", "待确认", "已完成", "已取消"];

function normalizeUserOrderStatus(status = "") {
  const text = String(status || "");
  if (/已取消|取消|已关闭|拒绝/.test(text)) return "已取消";
  if (/已完成|完成/.test(text)) return "已完成";
  if (/待确认|待评价|待用户确认|待验收/.test(text)) return "待确认";
  if (/服务中|已接单|已派单|进行中|已开始|待服务/.test(text)) return "服务中";
  return "待接单";
}

function userOrderCapabilities(order = {}) {
  return {
    canCancel: ["待派单", "已派单", "待接单", "已报价", "待服务"].includes(order.status),
    canConfirm: order.status === "待确认",
    canReview: order.status === "待确认" && !order.rating,
    canViewProgress: true,
  };
}

function userOrdersPageForApi(db, auth, params = {}) {
  const user = userForAuth(db, auth);
  const status = String(params.status || "全部");
  const providerType = String(params.providerType || "");
  const q = String(params.q || "").trim().toLowerCase();
  const ownedOrders = (db.orders || [])
    .filter((order) => !order.userId || order.userId === user.id)
    .map((order) => ({
      ...order,
      normalizedStatus: normalizeUserOrderStatus(order.status),
      capabilities: userOrderCapabilities(order),
    }))
    .sort((a, b) => String(b.createdAt || b.time || "").localeCompare(String(a.createdAt || a.time || "")));
  const counts = Object.fromEntries(userOrderStatusFilters.map((filter) => [
    filter,
    filter === "全部" ? ownedOrders.length : ownedOrders.filter((order) => order.normalizedStatus === filter).length,
  ]));
  const orders = ownedOrders.filter((order) => {
    if (status && status !== "全部" && order.normalizedStatus !== status) return false;
    if (providerType && order.providerType !== providerType) return false;
    if (!q) return true;
    return [order.id, order.orderNo, order.serviceType, order.requirementCategory, order.assigneeName, order.providerName, order.location, order.note]
      .some((value) => String(value || "").toLowerCase().includes(q));
  });
  const providers = [...new Set(ownedOrders.map((order) => order.providerType).filter(Boolean))].map((value) => ({
    value,
    label: value === "merchant" ? "商户服务" : value === "guide" ? "人工向导" : value,
  }));
  return {
    sourceEndpoint: "/api/user/orders",
    query: { status, providerType, q },
    orders,
    filters: { statuses: userOrderStatusFilters, providers, counts },
    summary: {
      total: ownedOrders.length,
      filtered: orders.length,
      active: ownedOrders.filter((order) => !["已完成", "已取消"].includes(order.normalizedStatus)).length,
      totalAmount: ownedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0),
    },
    endpoints: {
      detail: "/api/orders/{id}",
      cancel: "/api/orders/{id}/cancel",
      confirm: "/api/orders/{id}/confirm",
      support: "/api/service-requests",
    },
  };
}

const userActivityRecordFilters = ["全部", "待参加", "已完成", "已取消"];

function normalizeUserActivityRecordStatus(signup = {}, activity = {}) {
  const raw = String(signup.status || activity.userStatus || activity.status || "");
  if (/取消|已关闭|下线/.test(raw)) return "已取消";
  if (/完成|已评价/.test(raw)) return "已完成";
  if (/待参加|已报名|报名中|进行中|即将/.test(raw)) return "待参加";
  return "待参加";
}

function userActivityRecordActions(status = "") {
  if (status === "已取消") return { primary: "重新报名", secondary: "查看详情", canCancel: false, canJoin: true, canReview: false, canCheckin: false };
  if (status === "已完成") return { primary: "去评价", secondary: "查看详情", canCancel: false, canJoin: false, canReview: true, canCheckin: false };
  return { primary: "取消报名", secondary: "查看详情", canCancel: true, canJoin: false, canReview: false, canCheckin: true };
}

function userActivityRecordsPageForApi(db, auth, params = {}) {
  const user = userForAuth(db, auth);
  const status = String(params.status || "全部");
  const activityById = new Map((db.activities || []).map((activity) => [activity.id, activity]));
  const records = (db.activitySignups || [])
    .filter((signup) => !signup.userId || signup.userId === user.id)
    .map((signup) => {
      const activity = activityById.get(signup.activityId) || {};
      const normalizedStatus = normalizeUserActivityRecordStatus(signup, activity);
      const signupParticipantCount = (db.activitySignups || [])
        .filter((item) => item.activityId === signup.activityId && item.status !== "已取消")
        .reduce((sum, item) => sum + Number(item.count || 1), 0);
      const activityJoinedCount = Number(activity.joined);
      const participantCount = Number.isFinite(activityJoinedCount) && activityJoinedCount > 0
        ? activityJoinedCount
        : signupParticipantCount;
      const actions = userActivityRecordActions(normalizedStatus);
      return {
        id: signup.id,
        signupId: signup.id,
        activityId: signup.activityId,
        title: activity.title || signup.activityTitle || "旅居活动",
        category: activity.category || signup.category || "活动",
        time: activity.time || signup.time || signup.createdAt || "",
        location: activity.location || signup.location || "活动地点待确认",
        distance: activity.distance || "",
        image: activity.cover || signup.cover || "",
        participantCount,
        peopleText: `${participantCount}人已报名`,
        status: signup.status || normalizedStatus,
        normalizedStatus,
        displayStatus: signup.status === "已报名" && normalizedStatus === "待参加" ? "已报名" : normalizedStatus,
        count: Number(signup.count || 1),
        elderName: signup.elderName || db.elderProfile?.name || user.nickname || "",
        phone: signup.phone || user.phone || "",
        createdAt: signup.createdAt || "",
        updatedAt: signup.updatedAt || "",
        canceledAt: signup.canceledAt || "",
        cancelReason: signup.cancelReason || "",
        actions,
        endpoints: {
          detail: `/api/activities/${encodeURIComponent(signup.activityId)}`,
          join: `/api/activities/${encodeURIComponent(signup.activityId)}/join`,
          cancel: `/api/activities/${encodeURIComponent(signup.activityId)}/cancel`,
          actionLog: "/api/ui/actions",
        },
      };
    })
    .sort((a, b) => String(b.createdAt || b.time || "").localeCompare(String(a.createdAt || a.time || "")));
  const counts = {
    已报名: records.filter((record) => record.normalizedStatus !== "已取消").length,
    待参加: records.filter((record) => record.normalizedStatus === "待参加").length,
    已完成: records.filter((record) => record.normalizedStatus === "已完成").length,
    已取消: records.filter((record) => record.normalizedStatus === "已取消").length,
  };
  const filteredRecords = status && status !== "全部"
    ? records.filter((record) => record.normalizedStatus === status)
    : records;
  return {
    sourceEndpoint: "/api/user/activity-records",
    query: { status },
    filters: userActivityRecordFilters.map((item) => ({
      key: item,
      count: item === "全部" ? records.length : records.filter((record) => record.normalizedStatus === item).length,
    })),
    summary: {
      total: records.length,
      filtered: filteredRecords.length,
      signed: counts.已报名,
      waiting: counts.待参加,
      completed: counts.已完成,
      cancelled: counts.已取消,
    },
    records: filteredRecords,
    endpoints: {
      detail: "/api/activities/{id}",
      join: "/api/activities/{id}/join",
      cancel: "/api/activities/{id}/cancel",
      actionLog: "/api/ui/actions",
    },
  };
}

const userServiceRecordFilters = ["全部", "AI问答", "服务推荐", "语音交互"];

function userServiceRecordState(db, userId) {
  db.userServiceRecordState = db.userServiceRecordState && typeof db.userServiceRecordState === "object"
    ? db.userServiceRecordState
    : {};
  const key = userId || "user-001";
  const current = db.userServiceRecordState[key] && typeof db.userServiceRecordState[key] === "object"
    ? db.userServiceRecordState[key]
    : {};
  current.hiddenIds = Array.isArray(current.hiddenIds) ? current.hiddenIds : [];
  current.readIds = Array.isArray(current.readIds) ? current.readIds : [];
  current.clearedAt = current.clearedAt || "";
  db.userServiceRecordState[key] = current;
  return current;
}

function normalizeUserServiceRecordType(source = "") {
  if (source === "voice") return "语音交互";
  return "AI问答";
}

function userServiceRecordColor(type = "") {
  if (type === "语音交互") return "orange";
  if (type === "服务推荐") return "green";
  return "blue";
}

function userServiceRecordIcon(type = "") {
  if (type === "语音交互") return "mic";
  if (type === "服务推荐") return "flag";
  return "bot";
}

function normalizeAiServiceRecord(chat = {}, state = {}) {
  const type = normalizeUserServiceRecordType(chat.source);
  const id = `ai-${chat.id}`;
  const recommendations = Array.isArray(chat.recommendations) ? chat.recommendations : [];
  return {
    id,
    sourceId: chat.id,
    sourceType: "aiHistory",
    type,
    title: chat.question || chat.title || (type === "语音交互" ? "语音咨询" : "智能管家咨询"),
    text: chat.answer || chat.content || "已同步智能管家历史记录",
    detail: chat.answer || chat.content || "暂无回答详情",
    time: chat.createdAt || "",
    createdAt: chat.createdAt || "",
    iconName: userServiceRecordIcon(type),
    color: userServiceRecordColor(type),
    read: state.readIds.includes(id),
    detailEndpoint: `/api/user/service-records/${encodeURIComponent(id)}/detail`,
    deleteEndpoint: `/api/user/service-records/${encodeURIComponent(id)}`,
    payload: {
      intent: chat.intent || "",
      source: chat.source || "text",
      provider: chat.provider || "",
      model: chat.model || "",
      recommendationCount: recommendations.length,
      recommendations,
    },
  };
}

function normalizeRequestServiceRecord(requestItem = {}, state = {}) {
  const id = `request-${requestItem.id}`;
  const type = "服务推荐";
  const title = requestItem.action || requestItem.type || "服务推荐";
  const description = requestItem.description || requestItem.result || requestItem.status || "推荐记录已进入后台服务数据";
  return {
    id,
    sourceId: requestItem.id,
    sourceType: "serviceRequest",
    type,
    title,
    text: description,
    detail: `${description}${requestItem.status ? `\n处理状态：${requestItem.status}` : ""}${requestItem.result ? `\n处理结果：${requestItem.result}` : ""}`,
    time: requestItem.createdAt || "",
    createdAt: requestItem.createdAt || "",
    iconName: userServiceRecordIcon(type),
    color: userServiceRecordColor(type),
    read: state.readIds.includes(id),
    detailEndpoint: `/api/user/service-records/${encodeURIComponent(id)}/detail`,
    deleteEndpoint: `/api/user/service-records/${encodeURIComponent(id)}`,
    payload: {
      requestNo: requestItem.requestNo || "",
      route: requestItem.route || "",
      status: requestItem.status || "",
      priority: requestItem.priority || "",
      providerType: requestItem.providerType || "",
    },
  };
}

function rawUserServiceRecords(db, auth) {
  const user = userForAuth(db, auth);
  const state = userServiceRecordState(db, user.id);
  const ownedChats = (db.aiHistory || [])
    .filter((chat) => !chat.userId || chat.userId === user.id || chat.userId === auth?.sub || chat.userId === "user-001")
    .map((chat) => normalizeAiServiceRecord(chat, state));
  const ownedRequests = (db.serviceRequests || [])
    .filter((requestItem) => {
      if (requestItem.userId && requestItem.userId !== user.id && requestItem.userId !== auth?.sub && requestItem.userId !== "user-001") return false;
      const searchable = `${requestItem.route || ""}${requestItem.action || ""}${requestItem.type || ""}${requestItem.description || ""}${requestItem.result || ""}`;
      return /AI|智能管家|咨询|推荐|服务记录|服务/.test(searchable);
    })
    .map((requestItem) => normalizeRequestServiceRecord(requestItem, state));
  return {
    user,
    state,
    rawRecords: [...ownedChats, ...ownedRequests]
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))),
  };
}

function filterUserServiceRecords(records = [], params = {}) {
  const type = String(params.type || "全部");
  const month = String(params.month || "");
  const q = String(params.q || "").trim().toLowerCase();
  const normalizedMonth = month === "current" || month === "本月" ? now().slice(0, 7) : month;
  return records.filter((record) => {
    if (type && type !== "全部" && record.type !== type) return false;
    if (normalizedMonth && !String(record.createdAt || record.time || "").startsWith(normalizedMonth)) return false;
    if (q) {
      const searchable = [
        record.id,
        record.type,
        record.title,
        record.text,
        record.detail,
        record.sourceType,
        record.payload?.route,
        record.payload?.status,
        record.payload?.requestNo,
      ].map((value) => String(value || "").toLowerCase()).join("\n");
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

function userServiceRecordsPageForApi(db, auth, params = {}) {
  const { user, state, rawRecords } = rawUserServiceRecords(db, auth);
  const hiddenIds = new Set(state.hiddenIds);
  const visibleRecords = rawRecords.filter((record) => !hiddenIds.has(record.id));
  const records = filterUserServiceRecords(visibleRecords, params);
  const recommendationRecords = visibleRecords.filter((record) => record.type === "服务推荐").length;
  const adopted = visibleRecords.filter((record) => {
    const status = `${record.payload?.status || ""}${record.detail || ""}${record.text || ""}`;
    return /已处理|已采纳|完成|成功/.test(status);
  }).length;
  return {
    sourceEndpoint: "/api/user/service-records",
    query: {
      type: params.type || "全部",
      month: params.month || "",
      q: params.q || "",
    },
    user: {
      id: user.id,
      name: db.elderProfile?.name || user.nickname || "",
    },
    filters: userServiceRecordFilters.map((key) => ({
      key,
      count: key === "全部" ? visibleRecords.length : visibleRecords.filter((record) => record.type === key).length,
    })),
    summary: {
      total: visibleRecords.length,
      filtered: records.length,
      totalConversations: visibleRecords.filter((record) => record.type === "AI问答" || record.type === "语音交互").length,
      voiceRecords: visibleRecords.filter((record) => record.type === "语音交互").length,
      recommendationRecords,
      adopted,
      archived: state.hiddenIds.length,
    },
    records,
    endpoints: {
      list: "/api/user/service-records",
      detail: "/api/user/service-records/{id}/detail",
      delete: "/api/user/service-records/{id}",
      clear: "/api/user/service-records/clear",
      actionLog: "/api/ui/actions",
    },
  };
}

function findUserServiceRecord(db, auth, recordId, { includeHidden = false } = {}) {
  const { state, rawRecords } = rawUserServiceRecords(db, auth);
  const record = rawRecords.find((item) => item.id === recordId);
  if (!record) return null;
  if (!includeHidden && state.hiddenIds.includes(record.id)) return null;
  return { record, state };
}

function userProfileCenterForApi(db, auth) {
  const user = userForAuth(db, auth);
  let seededCenter = null;
  if (!db.userProfileCenter && fs.existsSync(SEED_DB)) {
    seededCenter = JSON.parse(fs.readFileSync(SEED_DB, "utf8")).userProfileCenter || null;
  }
  const center = db.userProfileCenter || seededCenter || {};
  const travelPlans = Array.isArray(center.travelPlans)
    ? center.travelPlans.filter((item) => !item.userId || item.userId === user.id)
    : [];
  const coupons = Array.isArray(center.coupons) ? center.coupons : [];
  const points = center.points && typeof center.points === "object" ? center.points : { balance: 0, monthlyEarned: 0, ledger: [] };
  const membership = center.membership && typeof center.membership === "object"
    ? center.membership
    : { level: "普通用户", status: "有效", expiresAt: "", benefits: [] };
  const familyContacts = db.familyContacts.filter((item) => !item.elderId || item.elderId === db.elderProfile.id);
  const userOrders = db.orders.filter((item) => !item.userId || item.userId === user.id);
  const joinedActivities = db.activities.filter((item) => item.userJoined || db.activitySignups.some((signup) => signup.activityId === item.id && signup.userId === user.id && signup.status !== "已取消"));
  return {
    user,
    elderProfile: db.elderProfile,
    familyContacts,
    travelPlans,
    benefits: {
      coupons,
      availableCouponCount: coupons.filter((item) => item.status === "可用").length,
      points: {
        balance: Number(points.balance || 0),
        monthlyEarned: Number(points.monthlyEarned || 0),
        ledger: Array.isArray(points.ledger) ? points.ledger : [],
      },
      membership,
    },
    summary: {
      orderCount: userOrders.length,
      activeOrderCount: userOrders.filter((item) => !["已完成", "已取消"].includes(item.status)).length,
      joinedActivityCount: joinedActivities.length,
      deviceCount: db.devices.filter((item) => !item.userId || item.userId === user.id || item.elderName === db.elderProfile.name).length,
      healthRecordCount: db.healthRecords.filter((item) => !item.elderId || item.elderId === db.elderProfile.id).length,
      unreadMessageCount: db.messages.filter((item) => item.toRole === "user" && !item.read).length,
    },
    endpoints: {
      profile: "/api/user/profile",
      orders: "/api/orders",
      activities: "/api/activities",
      devices: "/api/health/overview",
      contacts: "/api/family-contacts",
      messages: "/api/messages?role=user",
    },
  };
}

const USER_PERSONAL_AUTHORIZATION_DEFAULTS = {
  location: true,
  healthData: true,
  abnormalAlerts: true,
  familyVisible: true,
  notifications: true,
};

const USER_DEVICE_MANAGEMENT_ADDABLE_DEVICES = [
  { type: "智能床垫", title: "智能床垫", image: "ref/add-bed.png", text: "睡眠监测 · 健康守护", defaultDeviceId: "BED-MAT-0620" },
  { type: "智能血压计", title: "智能血压计", image: "ref/add-bp.png", text: "血压监测 · 数据同步", defaultDeviceId: "BP-ADD-0620" },
  { type: "智能体温计", title: "智能体温计", image: "ref/add-thermometer.png", text: "体温监测 · 异常提醒", defaultDeviceId: "TEMP-ADD-0620" },
  { type: "智能门磁", title: "智能门磁", image: "ref/add-door.png", text: "门窗安全 · 异常告警", defaultDeviceId: "DOOR-ADD-0620" },
];

const HEALTH_RECORD_METRICS = ["heart_rate", "blood_pressure", "blood_oxygen", "sleep", "steps"];

function latestHealthMetrics(db) {
  const records = (db.healthRecords || [])
    .filter((item) => !item.elderId || item.elderId === db.elderProfile?.id)
    .sort((a, b) => String(b.recordedAt || "").localeCompare(String(a.recordedAt || "")));
  return HEALTH_RECORD_METRICS
    .map((metricType) => records.find((item) => item.metricType === metricType))
    .filter(Boolean);
}

function userDeviceRole(device = {}) {
  const text = `${device.type || ""}${device.name || ""}${device.deviceId || ""}`;
  if (/机器人|ROBOT/i.test(text)) return "robot";
  if (/手环|BAND/i.test(text)) return "bracelet";
  if (/血压|BP/i.test(text)) return "bloodPressure";
  if (/床垫|MAT|BED/i.test(text)) return "mattress";
  if (/体温|TEMP/i.test(text)) return "thermometer";
  if (/门磁|DOOR/i.test(text)) return "doorSensor";
  return "device";
}

function userDeviceSettingsRoute(device = {}) {
  const role = userDeviceRole(device);
  if (role === "bracelet") return "band-settings";
  if (role === "robot") return "robot-settings";
  return "devices";
}

function userDeviceDisplayName(device = {}) {
  if (device.name) return device.name;
  if (userDeviceRole(device) === "bracelet") return "云旅手环 1A2B";
  if (userDeviceRole(device) === "robot") return "小云机器人 3F8C";
  return device.type || "智能设备";
}

function userDeviceStatusLabel(device = {}) {
  const status = device.onlineStatus || device.deviceStatus || "在线";
  if (/离线|异常|故障/.test(status)) return status;
  if (/正常|在线|运行/.test(status)) return "已连接";
  return status;
}

function normalizeUserDeviceForManagement(device = {}, index = 0) {
  const role = userDeviceRole(device);
  const displayName = userDeviceDisplayName(device);
  const battery = Math.max(0, Math.min(100, Number(device.battery ?? 0)));
  const networkStatus = device.networkStatus || (device.onlineStatus === "在线" ? "良好" : "待连接");
  const secondAction = role === "bracelet" ? "解绑智能手环" : role === "robot" ? "测试小云机器人" : "测试设备";
  return {
    id: device.id || device.deviceId || `device-${index + 1}`,
    deviceId: device.deviceId || device.id || "",
    type: device.type || "智能设备",
    role,
    displayName,
    statusLabel: userDeviceStatusLabel(device),
    onlineStatus: device.onlineStatus || "",
    battery,
    batteryText: `电量 ${battery}%`,
    lastSync: device.lastSyncAt || device.lastSync || device.updatedAt || "",
    lastSyncText: device.lastSyncAt || device.lastSync || "待同步",
    location: device.location || "",
    networkStatus,
    image: role === "robot" ? "ref/device-manage-robot.png" : role === "bracelet" ? "ref/device-manage-band.png" : "ref/add-bp.png",
    metrics: [
      { icon: "battery-medium", label: `电量 ${battery}%` },
      { icon: "refresh-cw", label: `最后同步<br>${device.lastSyncAt || device.lastSync || "待同步"}` },
      { icon: role === "robot" ? "wifi" : "signal", label: role === "robot" ? `网络状态<br>${networkStatus}` : device.onlineStatus === "在线" ? "信号良好" : "信号待恢复" },
    ],
    guardianSettings: device.guardianSettings || {},
    actions: {
      settingsRoute: userDeviceSettingsRoute(device),
      primary: role === "bracelet" ? "手环设置" : role === "robot" ? "机器人设置" : "设备设置",
      secondary: secondAction,
      canSync: true,
      canUnbind: role === "bracelet",
      canTest: role !== "bracelet",
    },
    raw: {
      lastAction: device.lastAction || "",
      lastActionAt: device.lastActionAt || "",
      deviceStatus: device.deviceStatus || "",
    },
  };
}

function userDeviceManagementForApi(db, auth) {
  const user = userForAuth(db, auth);
  const elder = db.elderProfile || {};
  const ownedDevices = (db.devices || [])
    .filter((item) => !item.userId || item.userId === user.id || item.elderName === elder.name)
    .map((device, index) => normalizeUserDeviceForManagement(device, index));
  const primaryDevice = ownedDevices.find((item) => item.role === "bracelet") || ownedDevices[0] || null;
  const primaryGuardian = primaryDevice?.guardianSettings || {};
  const authorization = userPersonalAuthorizations(user);
  const authSettings = [
    { key: "healthData", title: "健康数据同步", icon: "heart-pulse", color: "#22c55e", text: "同步设备健康数据，用于健康分析和建议", enabled: primaryGuardian.healthData !== false && authorization.healthData !== false },
    { key: "abnormalAlerts", title: "异常提醒", icon: "bell", color: "#f59e0b", text: "设备异常时，及时通知您和家属", enabled: primaryGuardian.abnormalAlerts !== false && authorization.abnormalAlerts !== false },
    { key: "familyVisible", title: "家属可见", icon: "users", color: "#3b82f6", text: "已绑定家属可查看设备相关数据", enabled: primaryGuardian.familyVisible !== false && authorization.familyVisible !== false },
  ];
  return {
    sourceEndpoint: "/api/user/device-management",
    user: {
      id: user.id,
      name: elder.name || user.nickname || "",
      city: user.currentCity || elder.city || "",
    },
    devices: ownedDevices,
    addableDevices: USER_DEVICE_MANAGEMENT_ADDABLE_DEVICES,
    authSettings,
    summary: {
      total: ownedDevices.length,
      connected: ownedDevices.filter((device) => /在线|已连接|正常/.test(`${device.statusLabel}${device.onlineStatus}`)).length,
      offline: ownedDevices.filter((device) => /离线|异常|故障/.test(`${device.statusLabel}${device.onlineStatus}`)).length,
      lowBattery: ownedDevices.filter((device) => Number(device.battery) <= 20).length,
    },
    endpoints: {
      devices: "/api/devices",
      bind: "/api/devices/bind",
      sync: "/api/devices/{id}/sync",
      action: "/api/devices/{id}/action",
      unbind: "/api/devices/{id}",
      helpRequest: "/api/devices/help-request",
    },
  };
}

function normalizedMedicationReminders(elder = {}) {
  const source = Array.isArray(elder.medicationReminders) ? elder.medicationReminders : [];
  return source.slice(0, 8).map((item, index) => ({
    id: item.id || `medication-${index + 1}`,
    period: String(item.period || (index === 0 ? "早" : "晚")).slice(0, 8),
    time: /^\d{2}:\d{2}$/.test(String(item.time || "")) ? item.time : index === 0 ? "08:00" : "20:00",
    medicines: (Array.isArray(item.medicines) ? item.medicines : String(item.medicines || "").split(/[、,，\n]/))
      .map((medicine) => String(medicine || "").trim().slice(0, 80))
      .filter(Boolean)
      .slice(0, 8),
    status: String(item.status || "待提醒").slice(0, 20),
    enabled: item.enabled !== false,
  }));
}

function healthRecordForApi(db, auth) {
  const user = userForAuth(db, auth);
  const elder = db.elderProfile || {};
  const devices = (db.devices || []).filter((item) => !item.userId || item.userId === user.id || item.elderName === elder.name);
  const band = devices.find((item) => /手环/.test(`${item.type || ""}${item.name || ""}`)) || devices[0] || null;
  const authorization = userPersonalAuthorizations(user);
  return {
    sourceEndpoint: "/api/health/record",
    user: {
      id: user.id,
      name: elder.name || user.nickname || "",
      avatar: user.avatar || "",
      city: elder.city || user.currentCity || "",
    },
    elder: {
      id: elder.id || "",
      name: elder.name || "",
      gender: elder.gender || "",
      age: Number(elder.age || 0),
      bloodType: elder.bloodType || "未填写",
      healthTags: Array.isArray(elder.healthTags) ? elder.healthTags : [],
      allergies: elder.allergies || "未填写",
      medicines: elder.medicines || "未填写",
      riskLevel: elder.riskLevel || "待评估",
      healthStatus: ["低风险", "正常"].includes(elder.riskLevel) ? "适合旅居" : elder.riskLevel || "待评估",
      medicalPreference: elder.medicalPreference || "未填写",
      emergencyHistory: elder.emergencyHistory || "未填写",
      familyNote: elder.familyNote || "未填写",
      updatedAt: elder.updatedAt || "",
    },
    metrics: latestHealthMetrics(db),
    medicationReminders: normalizedMedicationReminders(elder),
    authorization: {
      familyHealthSummary: authorization.healthData !== false,
      sourceEndpoint: "/api/user/personal",
    },
    device: band ? {
      id: band.id,
      deviceId: band.deviceId,
      name: band.name || band.type || "健康设备",
      type: band.type || "健康设备",
      onlineStatus: band.onlineStatus || "未知",
      battery: Number(band.battery || 0),
      lastSync: band.lastSyncAt || band.lastSync || "",
    } : null,
    alertCount: (db.alerts || []).filter((item) => item.elderId === elder.id && item.status !== "已处理").length,
    endpoints: {
      update: "/api/health/record",
      sync: "/api/health/record/sync",
      authorization: "/api/user/personal",
      overview: "/api/health/overview",
    },
  };
}

const USER_HEALTH_SERVICE_QUICK_ACTIONS = [
  { key: "online-consult", title: "在线问诊", text: "专业医生问诊", iconName: "message-square-plus", color: "green", route: "assistant", action: "在线问诊", type: "在线问诊", priority: "P0" },
  { key: "nearby-hospital", title: "附近医院", text: "查找好医院", iconName: "hospital", color: "blue", route: "transport", action: "附近医院查询", type: "就医协助", priority: "P1" },
  { key: "checkup", title: "体检预约", text: "体检套餐预约", iconName: "clipboard-check", color: "orange", route: "order-submit", action: "体检预约", type: "体检服务", priority: "P1" },
  { key: "rehab", title: "康复理疗", text: "康复项目预约", iconName: "person-standing", color: "purple", route: "guide", action: "康复理疗预约", type: "康养护理", priority: "P1" },
  { key: "nursing", title: "护工护理", text: "上门护理服务", iconName: "user-check", color: "cyan", route: "guide", action: "护工护理预约", type: "上门护理", priority: "P1" },
  { key: "medication", title: "用药提醒", text: "准时用药提醒", iconName: "pill", color: "red", route: "health-record", action: "用药提醒设置", type: "用药提醒", priority: "P2" },
];

function healthServiceCatalog(db) {
  const activeServices = (db.services || [])
    .filter((service) => service.status === "上架")
    .filter((service) => /康养|护理|理疗|健康|体检|营养|就医|陪伴/.test(`${service.title || ""}${service.category || ""}${service.description || ""}`));
  const normalized = activeServices.map((service, index) => {
    const enriched = enrichService(db, service);
    const title = service.title || "健康服务";
    const isConsult = /咨询|管理|营养/.test(`${title}${service.category || ""}`);
    const isCheckup = /体检/.test(`${title}${service.category || ""}${service.description || ""}`);
    const image = /体检/.test(title)
      ? "ref/health-service-checkup-ref.png"
      : /咨询|营养/.test(title)
        ? "ref/health-service-consult-ref.png"
        : "ref/health-service-nursing-ref.png";
    return {
      id: service.id,
      title,
      description: service.description || "健康服务已接入平台后台",
      category: service.category || (service.providerType === "merchant" ? "康养护理" : "就医协助"),
      providerType: service.providerType || "",
      providerId: service.providerId || "",
      providerName: enriched.providerName || "",
      price: Number(service.price || 0),
      unit: service.unit || "次",
      status: service.status || "上架",
      rating: Number(service.rating || (index === 0 ? 4.9 : index === 1 ? 4.8 : 4.7)),
      reviews: Number(service.reviewCount || service.orderCount || 0) + 120 + index * 23,
      distance: service.providerType === "merchant" ? `距您 ${(1.2 + index * 0.7).toFixed(1)}km` : "平台协调",
      image,
      action: isConsult ? "立即咨询" : isCheckup ? "预约体检" : "预约服务",
      bookEndpoint: `/api/user/health-services/${encodeURIComponent(service.id)}/book`,
      consultEndpoint: `/api/user/health-services/${encodeURIComponent(service.id)}/consult`,
    };
  });
  if (normalized.length >= 3) return normalized;
  const fallback = [
    { id: "health-checkup-package", title: "昆明春城体检套餐", category: "体检服务", price: 698, unit: "人", description: "三甲医院合作，精准体检，快速出报告。", providerType: "merchant", providerId: "merchant-001" },
    { id: "health-consult-chronic", title: "慢病管理咨询", category: "健康管理", price: 88, unit: "次", description: "三甲医生在线指导，慢病管理方案定制。", providerType: "merchant", providerId: "merchant-001" },
    { id: "health-rehab-home", title: "康复理疗上门服务", category: "康养护理", price: 180, unit: "次", description: "康复师上门指导，适合旅居老人日常康复。", providerType: "merchant", providerId: "merchant-001" },
  ];
  return [...normalized, ...fallback.filter((item) => !normalized.some((service) => service.id === item.id)).map((item, index) => ({
    ...item,
    providerName: providerName(db, item.providerType, item.providerId),
    status: "上架",
    rating: 4.8,
    reviews: 130 + index * 31,
    distance: index === 1 ? "在线服务" : `距您 ${(2.4 + index * 0.5).toFixed(1)}km`,
    image: index === 0 ? "ref/health-service-checkup-ref.png" : index === 1 ? "ref/health-service-consult-ref.png" : "ref/health-service-nursing-ref.png",
    action: index === 1 ? "立即咨询" : index === 0 ? "预约体检" : "预约服务",
    bookEndpoint: `/api/user/health-services/${encodeURIComponent(item.id)}/book`,
    consultEndpoint: `/api/user/health-services/${encodeURIComponent(item.id)}/consult`,
  }))].slice(0, 8);
}

function userHealthServicesForApi(db, auth, params = {}) {
  const user = userForAuth(db, auth);
  const record = healthRecordForApi(db, auth);
  const category = String(params.category || "全部");
  const q = String(params.q || "").trim().toLowerCase();
  const allServices = healthServiceCatalog(db);
  const services = allServices.filter((service) => {
    if (category && category !== "全部" && !`${service.category}${service.title}${service.description}`.includes(category)) return false;
    if (q) {
      const searchable = [service.title, service.description, service.category, service.providerName].map((value) => String(value || "").toLowerCase()).join("\n");
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
  const categories = ["全部", ...new Set(allServices.map((service) => service.category).filter(Boolean))].map((key) => ({
    key,
    count: key === "全部" ? allServices.length : allServices.filter((service) => service.category === key).length,
  }));
  const metrics = (record.metrics || []).slice(0, 3).map((metric) => ({
    ...metric,
    displayValue: `${metric.value}${metric.unit || ""}`,
  }));
  return {
    sourceEndpoint: "/api/user/health-services",
    query: { category, q },
    user: record.user,
    elder: record.elder,
    quickServices: USER_HEALTH_SERVICE_QUICK_ACTIONS.map((item) => ({
      ...item,
      endpoint: "/api/user/health-services/quick-action",
    })),
    metrics,
    services,
    categories,
    summary: {
      totalServices: allServices.length,
      filtered: services.length,
      metricCount: metrics.length,
      deviceOnline: record.device?.onlineStatus || "",
      alertCount: record.alertCount || 0,
    },
    endpoints: {
      list: "/api/user/health-services",
      quickAction: "/api/user/health-services/quick-action",
      book: "/api/user/health-services/{id}/book",
      consult: "/api/user/health-services/{id}/consult",
      healthRecord: "/api/health/record",
      healthOverview: "/api/health/overview",
      serviceRequests: "/api/service-requests",
    },
  };
}

function findHealthServiceForUser(db, serviceId) {
  return healthServiceCatalog(db).find((service) => service.id === serviceId);
}

const USER_DESTINATION_FILTERS = ["全部", "气候宜人", "医疗便利", "湖泉康养", "文化体验"];

function destinationStateForUser(db, auth) {
  const user = userForAuth(db, auth);
  db.userDestinationState = db.userDestinationState || {};
  const state = db.userDestinationState[user.id] || { favoriteIds: [], viewedIds: [], updatedAt: "" };
  state.favoriteIds = Array.isArray(state.favoriteIds) ? state.favoriteIds : [];
  state.viewedIds = Array.isArray(state.viewedIds) ? state.viewedIds : [];
  db.userDestinationState[user.id] = state;
  return { user, state };
}

function userDestinationCatalog() {
  return [
    {
      id: "mile",
      title: "弥勒湖泉康养社区",
      city: "云南 · 弥勒",
      province: "云南",
      image: "destination-lake.jpg",
      price: 3500,
      unit: "月起",
      rating: 4.8,
      reviews: 236,
      followers: 1560,
      distance: "126 公里",
      address: "云南省红河州弥勒市温泉路湖泉生态园",
      position: [103.3982, 24.4078],
      season: "全年皆宜，春秋最佳（3-5月，9-11月）",
      hospital: "弥勒市人民医院（三甲）　距离 3.2km",
      transport: "多条公交直达，弥勒高铁站约 15 分钟车程",
      description: "温泉、湖景和适老生活配套成熟，适合长期康养旅居。",
      tags: ["温泉康养", "湖泉康养", "医疗便利", "气候宜人"],
      keywords: ["湖泉康养", "康养", "温泉", "医疗便利", "气候宜人"],
      reasons: [
        { iconName: "leaf", title: "气候宜人", desc: "四季如春，空气清新，年均气温 18°C", color: "green" },
        { iconName: "users", title: "活动丰富", desc: "晨练、太极、文娱活动，康养生活多姿多彩", color: "blue" },
        { iconName: "shopping-cart", title: "生活便利", desc: "配套齐全，交通便捷，生活无忧", color: "orange" },
      ],
    },
    {
      id: "kunming",
      title: "昆明滇池旅居区",
      city: "云南 · 昆明",
      province: "云南",
      image: "destination-city.jpg",
      price: 3200,
      unit: "月起",
      rating: 4.7,
      reviews: 189,
      followers: 980,
      distance: "138 公里",
      address: "云南省昆明市西山区滇池路海埂片区",
      position: [102.6649, 24.9631],
      season: "全年适合旅居，5-10月湖畔活动更丰富",
      hospital: "云南省第一人民医院　车程约 18 分钟",
      transport: "地铁 5 号线与多条公交覆盖，近海埂公园",
      description: "滇池湖畔生态资源集中，气候稳定，医疗和交通资源完善。",
      tags: ["气候宜人", "生态优美", "交通便利"],
      keywords: ["气候宜人", "滇池", "生态", "医疗便利"],
      reasons: [
        { iconName: "cloud-sun", title: "气候稳定", desc: "四季温和，日照充足，适合长期旅居", color: "green" },
        { iconName: "map-pin", title: "湖畔资源", desc: "滇池、海埂公园近在身边，散步活动方便", color: "blue" },
        { iconName: "bus", title: "出行便利", desc: "地铁公交覆盖，家属探访更轻松", color: "orange" },
      ],
    },
    {
      id: "dali",
      title: "大理洱海慢生活社区",
      city: "云南 · 大理",
      province: "云南",
      image: "destination-dali.jpg",
      price: 3800,
      unit: "月起",
      rating: 4.9,
      reviews: 312,
      followers: 1320,
      distance: "258 公里",
      address: "云南省大理白族自治州大理市洱海生态廊道旁",
      position: [100.2676, 25.6065],
      season: "3-5月舒适，适合慢生活体验",
      hospital: "大理大学第一附属医院　车程约 25 分钟",
      transport: "社区接驳与环洱海公交可用",
      description: "苍山洱海景观开阔，白族文化活动丰富，适合短住体验。",
      tags: ["自然风光", "文化体验", "生活悠闲"],
      keywords: ["文化体验", "洱海", "慢生活"],
      reasons: [
        { iconName: "mountain-snow", title: "风景开阔", desc: "苍山洱海景观，适合放松身心", color: "green" },
        { iconName: "palette", title: "文化体验", desc: "白族文化活动丰富，旅居内容充实", color: "blue" },
        { iconName: "coffee", title: "慢生活", desc: "社区节奏舒缓，适合短住体验", color: "orange" },
      ],
    },
    {
      id: "tengchong",
      title: "腾冲温泉康养基地",
      city: "云南 · 腾冲",
      province: "云南",
      image: "destination-hot-spring.jpg",
      price: 3600,
      unit: "月起",
      rating: 4.8,
      reviews: 165,
      followers: 760,
      distance: "524 公里",
      address: "云南省保山市腾冲市温泉康养片区",
      position: [98.4941, 25.0207],
      season: "11-12月温泉疗养体验较好",
      hospital: "腾冲市人民医院　车程约 20 分钟",
      transport: "机场接驳可预约，基地内有巡回电瓶车",
      description: "温泉疗养资源集中，森林覆盖率高，空气和气候适合短期调养。",
      tags: ["温泉疗养", "气候宜人", "空气优良"],
      keywords: ["气候宜人", "温泉", "康养", "空气"],
      reasons: [
        { iconName: "thermometer-sun", title: "温泉资源", desc: "地热温泉丰富，康养主题明确", color: "green" },
        { iconName: "trees", title: "空气清新", desc: "森林覆盖率高，环境安静舒缓", color: "blue" },
        { iconName: "heart-pulse", title: "疗养配套", desc: "康复理疗项目丰富，适合短期调养", color: "orange" },
      ],
    },
    {
      id: "fuxianhu",
      title: "抚仙湖湖景康养公寓",
      city: "云南 · 玉溪",
      province: "云南",
      image: "destination-detail-hero-live.jpg",
      price: 3400,
      unit: "月起",
      rating: 4.8,
      reviews: 148,
      followers: 690,
      distance: "92 公里",
      address: "云南省玉溪市澄江市抚仙湖畔康养公寓",
      position: [102.9088, 24.6171],
      season: "11-12月晴朗舒适，适合湖畔休养",
      hospital: "澄江市人民医院　车程约 15 分钟",
      transport: "湖畔接驳车与包车服务可预约",
      description: "临湖视野舒展，公寓管家值守，适合安静休养。",
      tags: ["湖景公寓", "医疗便利", "安静休养"],
      keywords: ["湖景", "医疗便利", "休养"],
      reasons: [
        { iconName: "waves", title: "湖景开阔", desc: "临湖视野舒展，休养体验安静", color: "green" },
        { iconName: "shield-check", title: "照护清晰", desc: "公寓管家值守，响应及时", color: "blue" },
        { iconName: "sun", title: "日照充足", desc: "冬季晴天多，适合短期避寒", color: "orange" },
      ],
    },
  ];
}

function destinationSearchText(destination) {
  return [
    destination.id,
    destination.title,
    destination.city,
    destination.province,
    destination.address,
    destination.description,
    destination.season,
    destination.hospital,
    destination.transport,
    ...(destination.tags || []),
    ...(destination.keywords || []),
  ].join(" ");
}

function destinationMatchesTag(destination, tag = "全部") {
  if (!tag || tag === "全部") return true;
  const haystack = destinationSearchText(destination);
  if (tag === "湖泉康养") return /湖泉|康养|温泉/.test(haystack);
  if (tag === "气候宜人") return /气候/.test(haystack) || (destination.tags || []).includes("气候宜人") || (destination.keywords || []).includes("气候宜人");
  if (tag === "医疗便利") return /医院|医疗|三甲/.test(haystack);
  return haystack.includes(tag);
}

function destinationForApi(destination, state) {
  const favorite = state.favoriteIds.includes(destination.id);
  return {
    ...destination,
    favorite,
    views: Number(destination.views || 1200) + Number(destination.reviews || 0) + (state.viewedIds.includes(destination.id) ? 1 : 0),
    detailEndpoint: `/api/user/destinations/${encodeURIComponent(destination.id)}`,
    favoriteEndpoint: `/api/user/destinations/${encodeURIComponent(destination.id)}/favorite`,
    consultEndpoint: `/api/user/destinations/${encodeURIComponent(destination.id)}/consult`,
    viewEndpoint: `/api/user/destinations/${encodeURIComponent(destination.id)}/view`,
    route: "destination-detail",
  };
}

function userDestinationsForApi(db, auth, params = {}) {
  const { user, state } = destinationStateForUser(db, auth);
  const tag = String(params.tag || "全部");
  const q = String(params.q || "").trim();
  const catalog = userDestinationCatalog();
  const filtered = catalog.filter((destination) => {
    if (!destinationMatchesTag(destination, tag)) return false;
    if (q && !destinationSearchText(destination).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const filters = USER_DESTINATION_FILTERS.map((key) => ({
    key,
    count: key === "全部" ? catalog.length : catalog.filter((destination) => destinationMatchesTag(destination, key)).length,
  }));
  return {
    sourceEndpoint: "/api/user/destinations",
    query: { tag, q },
    user: { id: user.id, nickname: user.nickname, currentCity: user.currentCity || "" },
    hero: {
      title: "精选康养旅居地",
      image: "destination-hero.jpg",
      text: "基于气候、医疗、交通、生活成本和适老配套综合推荐。",
    },
    filters,
    destinations: filtered.map((destination) => destinationForApi(destination, state)),
    summary: {
      total: catalog.length,
      filtered: filtered.length,
      favorites: state.favoriteIds.length,
      viewed: state.viewedIds.length,
      updatedAt: now(),
    },
    endpoints: {
      list: "/api/user/destinations",
      detail: "/api/user/destinations/{id}",
      favorite: "/api/user/destinations/{id}/favorite",
      consult: "/api/user/destinations/{id}/consult",
      view: "/api/user/destinations/{id}/view",
    },
  };
}

function findUserDestination(db, auth, destinationId) {
  const stateInfo = destinationStateForUser(db, auth);
  const destination = userDestinationCatalog().find((item) => item.id === destinationId);
  if (!destination) return null;
  return {
    ...stateInfo,
    raw: destination,
    destination: destinationForApi(destination, stateInfo.state),
  };
}

function createDestinationConsultRequest(db, auth, destination, body = {}) {
  const user = userForAuth(db, auth);
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: user.id,
    elderName: body.elderName || db.elderProfile?.name || user.nickname || "",
    route: "destinations",
    action: "目的地咨询",
    type: "旅居目的地咨询",
    providerType: "guide",
    providerId: "",
    status: "待处理",
    priority: body.priority || "P1",
    description: body.question || body.description || `咨询旅居目的地：${destination.title}`,
    payload: {
      ...(body.payload || {}),
      destinationId: destination.id,
      destinationTitle: destination.title,
      city: destination.city,
      source: body.source || "destinations",
    },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  addMessage(db, "admin", "新的目的地咨询", `${requestItem.elderName}咨询「${destination.title}」，请后台跟进。`, {
    scenario: "目的地咨询",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  addMessage(db, "user", "目的地咨询已提交", `您的「${destination.title}」咨询已生成服务请求 ${requestItem.requestNo}。`, {
    scenario: "目的地咨询",
    priority: requestItem.priority,
    relatedType: "serviceRequest",
    relatedId: requestItem.id,
  });
  return requestItem;
}

function createHealthServiceRequest(db, auth, service, body = {}, actionName = "预约健康服务") {
  const user = userForAuth(db, auth);
  const requestItem = {
    id: nextId(db, "serviceRequest", "req"),
    requestNo: nextNo(db, "serviceRequestNo", "REQ"),
    role: "user",
    userId: user.id,
    elderName: body.elderName || db.elderProfile?.name || user.nickname || "",
    route: "health-services",
    action: actionName,
    type: body.type || service.category || service.title || "健康服务",
    providerType: service.providerType || "",
    status: "待处理",
    priority: body.priority || "P1",
    description: body.description || body.question || `${actionName}：${service.title}`,
    payload: {
      ...(body.payload || {}),
      serviceId: service.id,
      serviceTitle: service.title,
      source: body.source || "health-services",
    },
    createdAt: now(),
    handledBy: "",
  };
  db.serviceRequests.unshift(requestItem);
  addMessage(db, "admin", "新的健康服务请求", `${requestItem.elderName}提交了「${requestItem.type}」：${requestItem.action}`);
  addMessage(db, "user", "健康服务请求已提交", `您的「${requestItem.type}」请求已进入后台处理。`);
  return requestItem;
}

function updateHealthRecord(db, auth, body = {}) {
  const elder = db.elderProfile || {};
  const assignString = (key, maxLength = 240) => {
    if (body[key] === undefined) return;
    elder[key] = String(body[key] || "").trim().slice(0, maxLength);
  };
  ["bloodType", "allergies", "medicines", "medicalPreference", "emergencyHistory", "familyNote"]
    .forEach((key) => assignString(key, key === "familyNote" ? 500 : 240));
  if (body.healthTags !== undefined) {
    elder.healthTags = (Array.isArray(body.healthTags) ? body.healthTags : String(body.healthTags || "").split(/[、,，\n]/))
      .map((item) => String(item || "").trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 12);
  }
  if (body.medicationReminders !== undefined) {
    elder.medicationReminders = normalizedMedicationReminders({ medicationReminders: body.medicationReminders });
  }
  elder.updatedAt = now();
  audit(db, actorName(auth, elder.name), "更新健康档案", elder.id || "elder-profile");
  return healthRecordForApi(db, auth);
}

const FAMILY_SHARING_PERMISSION_DEFINITIONS = [
  { key: "healthData", title: "查看健康数据", description: "健康档案、手环数据摘要", scope: "健康摘要" },
  { key: "deviceAlerts", title: "接收设备异常提醒", description: "如跌倒、低电量等", scope: "设备异常" },
  { key: "serviceOrders", title: "查看服务订单", description: "陪伴服务、活动报名等", scope: "服务订单" },
  { key: "emergencyLocation", title: "紧急定位共享", description: "发生紧急情况时共享位置", scope: "紧急定位" },
];

function familySharingPermissions(source = {}) {
  return Object.fromEntries(FAMILY_SHARING_PERMISSION_DEFINITIONS.map((item) => [item.key, source[item.key] !== false]));
}

function familyContactPermissions(contact = {}, sharing = {}) {
  const configured = familySharingPermissions(contact.familyPermissions || {});
  const global = familySharingPermissions(sharing);
  return Object.fromEntries(FAMILY_SHARING_PERMISSION_DEFINITIONS.map((item) => [item.key, configured[item.key] && global[item.key]]));
}

function familyContactForApi(contact = {}, sharing = {}) {
  const permissions = familyContactPermissions(contact, sharing);
  return {
    id: contact.id || "",
    elderId: contact.elderId || "",
    name: contact.name || "",
    relation: contact.relation || "家属",
    phone: contact.phone || "",
    isDefault: Boolean(contact.isDefault),
    notifyAlert: contact.notifyAlert !== false,
    callPriority: Number(contact.callPriority || 0),
    bindingStatus: contact.bindingStatus || "已绑定",
    boundAt: contact.boundAt || contact.createdAt || "",
    updatedAt: contact.updatedAt || "",
    lastInteractionAt: contact.lastInteractionAt || "",
    permissions,
    scopes: FAMILY_SHARING_PERMISSION_DEFINITIONS.filter((item) => permissions[item.key]).map((item) => item.scope),
  };
}

function familyInviteExpiry() {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  return `${expires.getFullYear()}-${pad(expires.getMonth() + 1)}-${pad(expires.getDate())} ${pad(expires.getHours())}:${pad(expires.getMinutes())}`;
}

async function familyInvitationForApi(invitation, requestOrigin) {
  if (!invitation) return null;
  const inviteUrl = `${requestOrigin}/user/?familyInvite=${encodeURIComponent(invitation.inviteCode)}#login`;
  const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 220,
    color: { dark: "#111827", light: "#ffffff" },
  });
  return { ...invitation, inviteUrl, qrDataUrl };
}

async function familyPageForApi(db, auth, requestOrigin) {
  const user = userForAuth(db, auth);
  const elder = db.elderProfile || {};
  const sharing = familySharingPermissions(user.familySharing || {});
  const contacts = (db.familyContacts || [])
    .filter((item) => !item.elderId || item.elderId === elder.id)
    .sort((a, b) => Number(a.callPriority || 999) - Number(b.callPriority || 999))
    .map((item) => familyContactForApi(item, sharing));
  const invitations = (db.familyInvitations || [])
    .filter((item) => !item.elderId || item.elderId === elder.id)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const latestInvitation = await familyInvitationForApi(invitations[0] || null, requestOrigin);
  const bindingRecords = [
    ...contacts.map((contact) => ({
      id: `binding-${contact.id}`,
      type: "binding",
      title: `${contact.relation}${contact.name}${contact.bindingStatus === "已绑定" ? "完成绑定" : contact.bindingStatus}`,
      status: contact.bindingStatus,
      recordedAt: contact.boundAt || "",
      contactId: contact.id,
    })),
    ...invitations.map((invitation) => ({
      id: `invitation-${invitation.id}`,
      type: "invitation",
      title: `${invitation.relation}${invitation.name}的${invitation.channel === "qr" ? "二维码" : "手机号"}邀请${invitation.status}`,
      status: invitation.status,
      recordedAt: invitation.createdAt || "",
      invitationId: invitation.id,
    })),
  ].sort((a, b) => String(b.recordedAt || "").localeCompare(String(a.recordedAt || "")));
  const metrics = latestHealthMetrics(db);
  const userOrders = (db.orders || []).filter((item) => !item.userId || item.userId === user.id);
  return {
    sourceEndpoint: "/api/user/family",
    elder: { id: elder.id || "", name: elder.name || user.nickname || "" },
    contacts,
    permissions: FAMILY_SHARING_PERMISSION_DEFINITIONS.map((definition) => ({
      ...definition,
      enabled: sharing[definition.key],
    })),
    latestInvitation,
    bindingRecords,
    summaries: {
      contactCount: contacts.length,
      pendingInvitationCount: invitations.filter((item) => item.status === "待家属确认").length,
      healthMetricCount: metrics.length,
      orderCount: userOrders.length,
    },
    endpoints: {
      contacts: "/api/family-contacts",
      permissions: "/api/user/family/permissions",
      invitations: "/api/user/family/invitations",
      health: "/api/health/record",
      orders: "/api/orders",
    },
  };
}

function updateFamilySharingPermission(db, auth, body = {}) {
  const user = userForAuth(db, auth);
  const key = String(body.key || "").trim();
  if (!FAMILY_SHARING_PERMISSION_DEFINITIONS.some((item) => item.key === key)) {
    throw new Error("未知的家属共享权限");
  }
  user.familySharing = {
    ...familySharingPermissions(user.familySharing || {}),
    [key]: body.enabled !== false,
  };
  user.familySharingUpdatedAt = now();
  audit(db, actorName(auth, db.elderProfile?.name), "更新家属共享权限", `${key}/${user.familySharing[key] ? "开启" : "关闭"}`);
  return user.familySharing;
}

function userSafetyCodeToken(userId) {
  return crypto.createHmac("sha256", AUTH_SECRET).update(`user-safety-code:${userId}`).digest("hex").slice(0, 40);
}

function userPersonalAuthorizations(user) {
  return {
    ...USER_PERSONAL_AUTHORIZATION_DEFAULTS,
    ...(user?.personalAuthorizations || {}),
  };
}

function userSafetyCodePayload(db, user) {
  const elder = db.elderProfile?.userId === user.id ? db.elderProfile : db.elderProfile || {};
  const contacts = db.familyContacts
    .filter((item) => !item.elderId || item.elderId === elder.id)
    .map((item) => ({
      id: item.id,
      name: item.name,
      relation: item.relation,
      phone: item.phone,
      isDefault: Boolean(item.isDefault),
    }));
  return {
    codeId: `safety-${user.id}`,
    userId: user.id,
    name: elder.name || user.nickname || user.name || "用户",
    gender: elder.gender || "",
    age: Number(elder.age || 0),
    bloodType: elder.bloodType || "未填写",
    allergies: elder.allergies || "未填写",
    medicines: elder.medicines || "未填写",
    healthTags: Array.isArray(elder.healthTags) ? elder.healthTags : [],
    mobility: elder.mobility || "未填写",
    currentCity: user.currentCity || elder.city || "",
    address: user.address || elder.address || "",
    emergencyContacts: contacts,
    updatedAt: user.personalUpdatedAt || elder.updatedAt || "",
    accessNotice: "仅用于紧急救助，请妥善保护扫码结果中的个人信息。",
  };
}

async function userPersonalForApi(db, auth, requestOrigin) {
  const user = userForAuth(db, auth);
  const elder = db.elderProfile?.userId === user.id ? db.elderProfile : db.elderProfile || {};
  const token = userSafetyCodeToken(user.id);
  const scanUrl = `${requestOrigin}/api/user/safety-code/${token}`;
  const qrDataUrl = await QRCode.toDataURL(scanUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 240,
    color: { dark: "#111827", light: "#ffffff" },
  });
  return {
    sourceEndpoint: "/api/user/personal",
    user: {
      id: user.id,
      nickname: user.nickname || user.name || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
      currentCity: user.currentCity || elder.city || "",
      address: user.address || elder.address || "",
      status: user.status || "",
    },
    elderProfile: {
      id: elder.id || "",
      name: elder.name || user.nickname || user.name || "",
      gender: elder.gender || "",
      age: Number(elder.age || 0),
      healthTags: Array.isArray(elder.healthTags) ? elder.healthTags : [],
      dietPreference: elder.dietPreference || elder.diet || "",
      mobility: elder.mobility || "",
      idVerificationStatus: elder.idVerificationStatus || "已认证",
    },
    authorizations: userPersonalAuthorizations(user),
    safetyCode: {
      codeId: `safety-${user.id}`,
      scanUrl,
      qrDataUrl,
      name: elder.name || user.nickname || user.name || "用户",
      summary: "扫码可查看紧急联系人、基础病史、过敏史和当前旅居地址。",
      updatedAt: user.personalUpdatedAt || elder.updatedAt || "",
    },
    updatedAt: user.personalUpdatedAt || elder.updatedAt || "",
  };
}

function updateUserPersonal(db, auth, body = {}) {
  const user = userForAuth(db, auth);
  const elder = db.elderProfile?.userId === user.id ? db.elderProfile : db.elderProfile;
  const userInput = body.user && typeof body.user === "object" ? body.user : body;
  const elderInput = body.elderProfile && typeof body.elderProfile === "object" ? body.elderProfile : body;
  const assignString = (target, key, value, maxLength = 200) => {
    if (value === undefined) return;
    target[key] = String(value || "").trim().slice(0, maxLength);
  };
  assignString(user, "nickname", userInput.nickname ?? userInput.name, 40);
  assignString(user, "phone", userInput.phone, 20);
  assignString(user, "avatar", userInput.avatar, 600000);
  assignString(user, "currentCity", userInput.currentCity ?? userInput.city, 60);
  assignString(user, "address", userInput.address, 240);
  assignString(elder, "name", elderInput.name, 40);
  assignString(elder, "gender", elderInput.gender, 10);
  assignString(elder, "address", elderInput.address, 240);
  assignString(elder, "dietPreference", elderInput.dietPreference ?? elderInput.diet, 120);
  assignString(elder, "mobility", elderInput.mobility, 120);
  if (elderInput.age !== undefined) {
    const age = Number(elderInput.age);
    if (!Number.isInteger(age) || age < 1 || age > 130) throw new Error("年龄必须为 1-130 的整数");
    elder.age = age;
  }
  if (elderInput.healthTags !== undefined || elderInput.preference !== undefined) {
    const source = elderInput.healthTags ?? elderInput.preference;
    elder.healthTags = (Array.isArray(source) ? source : String(source || "").split(/[、,，]/))
      .map((item) => String(item).trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 12);
  }
  if (body.authorizations && typeof body.authorizations === "object") {
    const next = userPersonalAuthorizations(user);
    Object.keys(USER_PERSONAL_AUTHORIZATION_DEFAULTS).forEach((key) => {
      if (typeof body.authorizations[key] === "boolean") next[key] = body.authorizations[key];
    });
    user.personalAuthorizations = next;
  }
  const updatedAt = now();
  user.personalUpdatedAt = updatedAt;
  elder.updatedAt = updatedAt;
  return { user, elder };
}

function userGuidePageForApi(db, auth) {
  const user = userForAuth(db, auth);
  const elder = db.elderProfile?.userId === user.id ? db.elderProfile : db.elderProfile || {};
  const requirements = guideOrderRequirementsForApi(db);
  const guideServices = db.services.filter((item) => item.providerType === "guide" && item.status === "上架");
  const categories = requirements.categories.map((category) => {
    const service = guideServices.find((item) => item.title === category.category);
    return {
      id: category.id,
      title: category.category,
      description: service?.description || category.description,
      fields: category.orderFields,
      fieldText: category.fieldText,
      priority: category.priority,
      amount: Number(service?.price || category.defaultAmount || 0),
      unit: service?.unit || "次",
      serviceId: service?.id || "",
      runtime: category.runtime,
    };
  });
  const recommendedGuides = db.guides
    .filter((guide) => guide.status === "已认证")
    .sort((a, b) => {
      const online = Number(b.onlineStatus === "在线") - Number(a.onlineStatus === "在线");
      if (online) return online;
      return Number(b.rating || 0) - Number(a.rating || 0) || Number(a.distanceKm || 999) - Number(b.distanceKm || 999);
    })
    .map((guide) => {
      const guideUser = db.users.find((item) => item.id === guide.userId);
      const services = guideServices.filter((item) => item.providerId === guide.id);
      const reviews = db.reviews.filter((item) => item.providerType === "guide" && item.providerId === guide.id);
      const completedTaskCount = db.tasks.filter((item) => item.assigneeType === "guide" && item.assigneeId === guide.id && item.status === "已完成").length;
      const fallbackPrices = categories.filter((item) => guide.serviceTypes?.includes(item.title)).map((item) => item.amount).filter(Boolean);
      const prices = services.map((item) => Number(item.price || 0)).filter(Boolean);
      return {
        id: guide.id,
        name: guide.realName,
        avatar: guideUser?.avatar || "",
        serviceTypes: Array.isArray(guide.serviceTypes) ? guide.serviceTypes : [],
        area: guide.area || "",
        status: guide.status,
        onlineStatus: guide.onlineStatus || "离线",
        currentStatus: guide.currentStatus || "",
        rating: Number(guide.rating || 0),
        reviewCount: reviews.length,
        reviews: reviews.slice(0, 6).map((review) => ({
          id: review.id,
          userName: review.userName || review.elderName || "用户",
          rating: Number(review.rating || 0),
          content: review.content || "",
          createdAt: review.createdAt || "",
        })),
        monthlyOrders: Number(guide.monthlyOrders || 0),
        completedTaskCount,
        distanceKm: Number(guide.distanceKm || 0),
        minimumPrice: Math.min(...(prices.length ? prices : fallbackPrices.length ? fallbackPrices : [0])),
        priceUnit: services[0]?.unit || "次",
      };
    });
  const currentCity = userHomeRequirementsForApi(db)?.topArea?.currentCity || user.currentCity || elder.city || "";
  const supportChannel = quickHelpChannels.find((item) => item.key === "customerService") || {};
  return {
    sourceEndpoint: "/api/user/guide-page",
    profile: {
      userId: user.id,
      elderId: elder.id || "",
      elderName: elder.name || user.nickname || "",
      gender: elder.gender || "",
      age: Number(elder.age || 0),
      phone: user.phone || "",
      currentCity,
      location: user.address || elder.address || "",
      healthNote: [
        ...(Array.isArray(elder.healthTags) ? elder.healthTags : []),
        elder.mobility || "",
      ].filter(Boolean).join("，"),
    },
    categories,
    recommendedGuides,
    guarantees: [
      { title: "服务保障", description: "实名认证", icon: "shield-check", color: "green" },
      { title: "价格透明", description: "明码标价", icon: "badge-dollar-sign", color: "blue" },
      { title: "专属客服", description: "快速响应", icon: "headphones", color: "cyan" },
    ],
    support: {
      title: supportChannel.title || "人工客服",
      phone: supportChannel.dialNumber || "",
      serviceTime: "7×24小时",
    },
    related: requirements.related,
    updatedAt: requirements.updatedAt,
  };
}

function serviceTypeMatchesFilter(order, serviceType) {
  const target = String(serviceType || "").trim();
  if (!target || target === "全部") return true;
  const orderServiceType = String(order?.serviceType || "").trim();
  if (orderServiceType === target || order?.requirementCategory === target) return true;
  return matchGuideOrderRequirement(orderServiceType)?.category === target;
}

function computeGuideDashboard(db, guideId = "guide-001", serviceType = "") {
  const aggregate = computeGuideStats(db, guideId);
  const guide = aggregate.provider;
  const tasks = db.tasks.filter((item) => item.assigneeType === "guide" && item.assigneeId === guide.id);
  const taskRows = ordersForTasks(db, tasks);
  const filteredTasks = taskRows.filter((item) => serviceTypeMatchesFilter(item.order, serviceType));
  const filteredPendingOrders = aggregate.pendingOrders.filter((item) => serviceTypeMatchesFilter(item, serviceType));
  return {
    guide,
    stats: aggregate.stats,
    serviceType: serviceType || "全部",
    tasks: filteredTasks,
    pendingOrders: filteredPendingOrders,
    messages: latestMessages(db, "guide").slice(0, 10),
  };
}

function guideHomeOrderCardPayload(row, fallbackStatus = "") {
  const order = row.order || row;
  const task = row.task || row;
  const serviceType = order.serviceType || "向导服务";
  return {
    orderId: order.id || task.orderId || "",
    orderNo: order.orderNo || "",
    taskId: task.id || "",
    taskNo: task.taskNo || "",
    taskStatus: task.status || fallbackStatus || order.status || "",
    orderStatus: order.status || "",
    serviceType,
    elderName: order.elderName || "旅居用户",
    time: order.time || order.createdAt || "时间待确认",
    location: order.location || "地点待确认",
    note: order.note || "",
    amount: Number(order.amount || 0),
    distance: order.distance || "",
    duration: order.duration || "2 小时",
    priority: order.requirementPriority || (/就医|护理/.test(serviceType) ? "P0" : "P1"),
  };
}

function computeGuideHome(db, guideId = "guide-001") {
  const dashboard = computeGuideDashboard(db, guideId);
  const { rows, ...stats } = computeGuideStats(db, guideId);
  const income = computeGuideIncome(db, guideId);
  const functionOverview = guideFunctionOverviewForApi(db, guideId);
  const taskRows = dashboard.tasks || [];
  const currentServices = taskRows
    .filter((row) => ["已接单", "服务中", "待确认"].includes(row.status || row.order?.status))
    .map((row) => guideHomeOrderCardPayload(row));
  const recommendedOrders = [
    ...(dashboard.pendingOrders || []).map((order) => guideHomeOrderCardPayload({ order }, "待接单")),
    ...taskRows
      .filter((row) => ["待接单", "待派单"].includes(row.status || row.order?.status))
      .map((row) => guideHomeOrderCardPayload(row)),
  ];
  const messages = dashboard.messages || latestMessages(db, "guide").slice(0, 10);
  const noticeMessage = messages.find((item) => !/订单|待接单|服务中/.test(`${item.title || ""}${item.scenario || ""}`)) || messages[0];
  return {
    sourceEndpoint: "/api/guide/home",
    guide: dashboard.guide,
    dashboard: { ...dashboard, sourceEndpoint: "/api/guide/dashboard" },
    stats: { ...stats.stats, sourceEndpoint: "/api/guide/stats" },
    income: { ...income, sourceEndpoint: "/api/guide/income" },
    functionOverview: { ...functionOverview, sourceEndpoint: "/api/guide/functions/overview" },
    currentServices,
    recommendedOrders,
    messages,
    notice: noticeMessage
      ? {
          id: noticeMessage.id,
          title: noticeMessage.title || "平台公告",
          content: noticeMessage.content || "请查看系统通知",
          time: noticeMessage.createdAt || now(),
          route: "31",
        }
      : {
          id: "guide-home-empty-notice",
          title: "平台公告",
          content: "暂无新的平台通知，请保持在线接单状态。",
          time: now(),
          route: "31",
        },
    actions: {
      refresh: { method: "GET", endpoint: "/api/guide/home" },
      claim: { method: "POST", endpoint: "/api/guide/tasks/claim-next" },
      online: { method: "POST", endpoint: "/api/guide/online" },
      scan: { route: "45", camera: true },
      messages: { route: "06", endpoint: "/api/messages?role=guide" },
    },
  };
}

function formatMoneyLabel(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function guideOnlineLabel(guide = {}) {
  if (guide.onlineStatus === "在线") {
    return guide.currentStatus && guide.currentStatus !== "空闲中" ? `在线 · ${guide.currentStatus}` : "在线接单中";
  }
  return "离线休息中";
}

function guideScheduledDays(rows = []) {
  const keys = rows
    .map((row) => row.order?.time || row.updatedAt || row.createdAt || "")
    .map((value) => String(value).slice(0, 10))
    .filter(Boolean);
  return Array.from(new Set(keys)).length;
}

function splitGuideArea(area = "") {
  const text = String(area || "").trim();
  const cityMatch = text.match(/^(.+?市)(.*)$/);
  if (cityMatch) {
    return {
      city: cityMatch[1],
      area: cityMatch[2] || cityMatch[1],
    };
  }
  return {
    city: text.includes("昆明") ? "昆明市" : "昆明市",
    area: text || "五华区",
  };
}

function normalizeTelHref(phone = "") {
  const normalized = String(phone || "").replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

function guideEmergencyContact(db, savedContact = {}) {
  const fallback = (db.familyContacts || []).find((item) => item.isDefault) || (db.familyContacts || [])[0] || {};
  const contact = { ...fallback, ...savedContact };
  return {
    id: contact.id || "guide-emergency-contact",
    name: contact.name || "紧急联系人",
    relation: contact.relation || "家属",
    phone: contact.phone || "",
    maskedPhone: maskMerchantPhone(contact.phone || ""),
    telHref: normalizeTelHref(contact.phone || ""),
  };
}

function normalizeGuideProfile(db, guide = {}) {
  const user = (db.users || []).find((item) => item.id === guide.userId) || {};
  const saved = guide.profile || {};
  const areaParts = splitGuideArea(saved.area || guide.area || "");
  const city = saved.city || areaParts.city;
  const area = saved.area || areaParts.area;
  const name = saved.name || guide.realName || user.nickname || "人工向导";
  return {
    id: guide.id || "guide-001",
    userId: guide.userId || user.id || "",
    name,
    realName: name,
    gender: saved.gender || guide.gender || "女",
    phone: saved.phone || guide.phone || user.phone || "",
    idCard: saved.idCard || guide.idCard || "530102********3219",
    city,
    area,
    role: "人工向导",
    intro: saved.intro || guide.intro || "熟悉本地医院、康养社区与景区路线，擅长陪伴就医、生活陪伴和接送出行。",
    avatarUrl: saved.avatarUrl || guide.avatarUrl || user.avatar || "/guide/assets/guide-avatar-li.png",
    status: saved.status || guide.status || "待认证",
    onlineStatus: guide.onlineStatus || "离线",
    currentStatus: guide.currentStatus || guideOnlineLabel(guide),
    rating: Number(guide.rating || saved.rating || 0),
    serviceTypes: Array.isArray(guide.serviceTypes) ? guide.serviceTypes.filter(Boolean) : [],
    emergencyContact: guideEmergencyContact(db, saved.emergencyContact || {}),
    certifications: saved.certifications || {},
    updatedAt: saved.updatedAt || guide.updatedAt || now(),
  };
}

function guideProfileBaseRows(profile) {
  return [
    { icon: "person", label: "姓名", key: "name", value: profile.name, type: "text", readonly: false },
    { icon: "user", label: "性别", key: "gender", value: profile.gender, type: "select", readonly: false, options: ["男", "女"] },
    { icon: "phone", label: "手机号", key: "phone", value: profile.phone, type: "tel", readonly: false },
    { icon: "id", label: "身份证号", key: "idCard", value: profile.idCard, type: "text", readonly: true },
    { icon: "mapPin", label: "所在城市", key: "city", value: profile.city, type: "text", readonly: false },
    { icon: "mapPin", label: "常住区域", key: "area", value: profile.area, type: "text", readonly: false },
  ];
}

function guideProfileCertificationRows(profile) {
  const certs = profile.certifications || {};
  const realname = certs.realname || {};
  const health = certs.health || {};
  const agreement = certs.agreement || {};
  const realnameState = realname.status || (profile.status === "已认证" ? "已通过" : profile.status || "待审核");
  const healthState = health.status || (profile.status === "已认证" ? "已通过" : "待补充");
  const agreementState = agreement.status || "已签署";
  return [
    {
      type: "realname",
      iconName: "shield",
      label: "实名认证",
      title: "实名认证",
      state: realnameState,
      color: "blue",
      tone: "blue",
      uploadLabel: "更新实名资料",
      fileName: realname.fileName || "",
      fileLabel: realname.fileName ? `已提交：${realname.fileName}` : "当前实名材料已归档",
      rows: [
        ["认证状态", realnameState],
        ["真实姓名", profile.name],
        ["证件号码", profile.idCard],
        ["最近复核", realname.updatedAt || profile.updatedAt],
      ],
      action: { method: "POST", endpoint: "/api/guide/profile/certification" },
    },
    {
      type: "health",
      iconName: "check",
      label: "健康证明",
      title: "健康证明",
      state: healthState,
      color: "green",
      tone: "green",
      uploadLabel: "上传/更新健康证明",
      fileName: health.fileName || "",
      fileLabel: health.fileName ? `已提交：${health.fileName}` : "支持图片或 PDF",
      rows: [
        ["证明状态", healthState],
        ["有效期至", health.expiresAt || "2027-05-18"],
        ["签发机构", health.issuer || "平台合作健康服务机构"],
        ["材料状态", health.fileName ? "新材料已进入复核" : "当前证明可用于接单"],
      ],
      action: { method: "POST", endpoint: "/api/guide/profile/certification" },
    },
    {
      type: "agreement",
      iconName: "clipboard",
      label: "服务协议",
      title: "服务协议",
      state: agreementState,
      color: "orange",
      tone: "orange",
      rows: [
        ["签署状态", agreementState],
        ["协议版本", agreement.version || "2026.06"],
        ["最近确认", agreement.updatedAt || profile.updatedAt],
      ],
      action: { route: "43", name: "查看协议：服务协议" },
    },
  ];
}

function guideProfileForApi(db, guideId = "guide-001") {
  const guide = getGuide(db, guideId);
  const profile = normalizeGuideProfile(db, guide);
  return {
    sourceEndpoint: "/api/guide/profile",
    guide: {
      id: guide.id,
      userId: guide.userId || "",
      name: profile.name,
      realName: profile.name,
      status: profile.status,
      onlineStatus: profile.onlineStatus,
      currentStatus: profile.currentStatus,
      rating: profile.rating,
      area: profile.area,
      city: profile.city,
    },
    profile,
    baseRows: guideProfileBaseRows(profile),
    emergencyContact: profile.emergencyContact,
    certifications: guideProfileCertificationRows(profile),
    actions: {
      refresh: { method: "GET", endpoint: "/api/guide/profile" },
      update: { method: "PUT", endpoint: "/api/guide/profile" },
      certification: { method: "POST", endpoint: "/api/guide/profile/certification" },
      agreement: { route: "43", action: "查看协议：服务协议" },
    },
    updatedAt: profile.updatedAt,
  };
}

function ensureGuideProfile(db, guide) {
  const normalized = normalizeGuideProfile(db, guide);
  guide.profile = {
    ...(guide.profile || {}),
    id: normalized.id,
    userId: normalized.userId,
    name: normalized.name,
    realName: normalized.realName,
    gender: normalized.gender,
    phone: normalized.phone,
    idCard: normalized.idCard,
    city: normalized.city,
    area: normalized.area,
    intro: normalized.intro,
    avatarUrl: normalized.avatarUrl,
    emergencyContact: normalized.emergencyContact,
    certifications: normalized.certifications,
    updatedAt: normalized.updatedAt,
  };
  return guide.profile;
}

function defaultGuideSettings() {
  return {
    privacy: {
      privacyPermission: true,
      locationSharing: true,
      profileVisible: true,
    },
    notifications: {
      messageNotification: true,
      orderReminder: true,
      sound: true,
      vibration: true,
      push: true,
      sms: false,
      serviceStart: true,
    },
    protocolConfirmed: {
      服务协议: true,
    },
  };
}

function normalizeGuideSettings(guide = {}) {
  const defaults = defaultGuideSettings();
  const saved = guide.settings || {};
  return {
    privacy: { ...defaults.privacy, ...(saved.privacy || {}) },
    notifications: { ...defaults.notifications, ...(saved.notifications || {}) },
    protocolConfirmed: { ...defaults.protocolConfirmed, ...(saved.protocolConfirmed || {}) },
    updatedAt: saved.updatedAt || guide.updatedAt || now(),
    sourceEndpoint: "/api/guide/settings",
  };
}

function ensureGuideSettings(guide) {
  guide.settings = normalizeGuideSettings(guide);
  return guide.settings;
}

function guideSettingsReminderLabel(notifications = {}) {
  const labels = [
    notifications.sound ? "声音" : "",
    notifications.vibration ? "震动" : "",
    notifications.push ? "推送" : "",
    notifications.sms ? "短信" : "",
  ].filter(Boolean);
  return labels.length ? labels.join("+") : "已关闭";
}

function guideSettingsForApi(db, guideId = "guide-001") {
  const guide = getGuide(db, guideId);
  const settings = normalizeGuideSettings(guide);
  const guideName = guide.realName || "人工向导";
  return {
    sourceEndpoint: "/api/guide/settings",
    guide: {
      id: guide.id,
      name: guideName,
      realName: guideName,
      status: guide.status || "待认证",
      onlineStatus: guide.onlineStatus || "离线",
      area: guide.area || "",
    },
    settings,
    securityRows: [
      { key: "profile", icon: "person", title: "个人资料", value: "已完善", open: "40" },
      { key: "realname", icon: "lock", title: "实名认证信息", value: guide.status || "待认证", open: "40" },
      { key: "privacyPermission", icon: "shield", title: "隐私权限", value: settings.privacy.privacyPermission ? "已开启" : "已关闭", enabled: Boolean(settings.privacy.privacyPermission), settingKey: "privacyPermission", group: "privacy" },
    ],
    notificationRows: [
      { key: "orderReminder", icon: "bell", title: "接单提醒", value: guideSettingsReminderLabel(settings.notifications), open: "26" },
      { key: "messageNotification", icon: "message", title: "消息通知", value: settings.notifications.messageNotification ? "已开启" : "已关闭", enabled: Boolean(settings.notifications.messageNotification), settingKey: "messageNotification", group: "notifications" },
    ],
    protocolRows: ["用户协议", "隐私政策", "服务规范"].map((title) => ({
      key: title,
      icon: title === "用户协议" ? "clipboard" : title === "隐私政策" ? "book" : "info",
      title,
      value: settings.protocolConfirmed[title] ? "已确认" : "待确认",
      action: `查看协议：${title}`,
      confirmed: Boolean(settings.protocolConfirmed[title]),
    })),
    actions: {
      refresh: { method: "GET", endpoint: "/api/guide/settings" },
      update: { method: "PUT", endpoint: "/api/guide/settings" },
      logout: { method: "POST", endpoint: "/api/guide/session/logout", route: "15" },
      profile: { route: "40" },
      reminder: { route: "26" },
    },
    updatedAt: settings.updatedAt,
  };
}

function computeGuideMine(db, guideId = "guide-001") {
  const dashboard = computeGuideDashboard(db, guideId);
  const statsPayload = computeGuideStats(db, guideId);
  const { rows, provider, stats, reviews, pendingOrders } = statsPayload;
  const income = computeGuideIncome(db, guideId);
  const guide = provider || dashboard.guide || getGuide(db, guideId);
  const serviceTypes = Array.isArray(guide.serviceTypes) ? guide.serviceTypes.filter(Boolean) : [];
  const scheduledDays = guideScheduledDays(rows);
  const skillCount = serviceTypes.length;
  const unreadMessages = latestMessages(db, "guide").filter((item) => !item.read).length;
  const wallet = {
    todayIncome: Number(stats.todayIncome || guide.incomeToday || 0),
    withdrawable: Number(stats.withdrawable || 0),
    pendingSettlement: Number(stats.pendingSettlement || 0),
    revenue: Number(stats.revenue || 0),
    label: formatMoneyLabel(stats.withdrawable || stats.pendingSettlement || stats.revenue || stats.todayIncome || guide.incomeToday || 0),
  };
  const schedule = {
    scheduledDays,
    activeTasks: Number(stats.activeTasks || 0),
    pendingOrders: pendingOrders.length,
    label: scheduledDays ? `已排班 ${scheduledDays} 天` : (stats.activeTasks ? `${stats.activeTasks} 个进行中` : "暂无排班"),
  };
  const profile = {
    id: guide.id,
    userId: guide.userId || "",
    name: guide.realName || "人工向导",
    realName: guide.realName || "人工向导",
    role: "人工向导",
    area: guide.area || "",
    city: String(guide.area || "").replace(/[区县].*$/, "") || guide.area || "",
    status: guide.status || "待认证",
    onlineStatus: guide.onlineStatus || "离线",
    currentStatus: guide.currentStatus || "",
    onlineLabel: guideOnlineLabel(guide),
    serviceTypes,
    rating: Number(guide.rating || stats.rating || 0),
    distanceKm: Number(guide.distanceKm || 0),
    certifications: [
      { title: "实名认证", status: guide.status === "已认证" ? "已通过" : guide.status || "待审核" },
      { title: "健康证明", status: guide.status === "已认证" ? "已通过" : "待补充" },
      { title: "服务协议", status: "已签署" },
    ],
  };
  const summary = {
    orderCount: Number(stats.orderCount || 0),
    goodRate: profile.rating ? `${Math.min(100, (profile.rating / 5) * 100).toFixed(1)}%` : "0%",
    cancelledOrders: Number(stats.cancelledOrders || 0),
    rating: profile.rating,
    reviewCount: Number(stats.reviewCount || reviews.length || 0),
    unreadMessages,
  };
  const skills = {
    count: skillCount,
    items: serviceTypes,
    label: `${skillCount} 项技能`,
  };
  const menuItems = {
    online: { icon: "eye", title: "接单状态", value: profile.onlineLabel, open: "08" },
    customers: { icon: "id", title: "客户档案", value: reviews.length ? `${reviews.length} 条评价记录` : "最近服务客户", open: "13" },
    wallet: { icon: "wallet", title: "我的钱包", value: wallet.label, open: "19" },
    schedule: { icon: "calendar", title: "我的排班", value: schedule.label, open: "36" },
    serviceSkills: { icon: "shield", title: "服务技能", value: skills.label, open: "38" },
    serviceTypes: { icon: "clipboard", title: "服务类型", value: `${serviceTypes.length} 类可接`, open: "25" },
    stats: { icon: "chart", title: "工作统计", value: `${summary.orderCount} 单`, open: "39" },
    certification: { icon: "id", title: "认证申请", value: profile.status, open: "16" },
    account: { icon: "lock", title: "切换/登录账号", value: "账号安全", open: "15" },
    settings: { icon: "settings", title: "设置", value: "提醒与隐私", open: "41" },
    help: { icon: "help", title: "帮助与反馈", value: "客服支持", open: "42" },
  };
  return {
    sourceEndpoint: "/api/guide/mine",
    profile,
    summary,
    wallet,
    schedule,
    skills,
    menuItems,
    menuRows: Object.values(menuItems),
    dashboard: { ...dashboard, sourceEndpoint: "/api/guide/dashboard" },
    stats: { ...stats, sourceEndpoint: "/api/guide/stats" },
    income: { ...income, sourceEndpoint: "/api/guide/income" },
    actions: {
      refresh: { method: "GET", endpoint: "/api/guide/mine" },
      online: { method: "POST", endpoint: "/api/guide/online", route: "08" },
      profile: { route: "40" },
      wallet: { route: "19" },
      schedule: { route: "36" },
      serviceTypes: { route: "25" },
      stats: { route: "39" },
      settings: { route: "41" },
    },
    updatedAt: now(),
  };
}

function computeGuideHall(db, guideId = "guide-001", serviceType = "") {
  const dashboard = computeGuideDashboard(db, guideId, serviceType);
  const { rows, ...stats } = computeGuideStats(db, guideId);
  const orders = [
    ...(dashboard.pendingOrders || []).map((order) => guideHomeOrderCardPayload({ order }, "待接单")),
    ...(dashboard.tasks || []).map((row) => guideHomeOrderCardPayload(row, row.status || row.order?.status || "")),
  ].filter((item) => !["已完成", "已取消"].includes(item.taskStatus || item.orderStatus || ""));
  const categoryRequirements = guideOrderRequirementsForApi(db).categories || [];
  const categoryNames = [
    ...categoryRequirements.map((item) => item.category).filter(Boolean),
    ...orders.map((item) => item.serviceType).filter(Boolean),
  ];
  const uniqueCategories = Array.from(new Set(categoryNames));
  const categories = [
    { name: "全部", count: orders.length, activeOrderCount: orders.length },
    ...uniqueCategories.map((name) => {
      const matchedRequirement = categoryRequirements.find((item) => item.category === name) || {};
      const count = orders.filter((item) => item.serviceType === name).length;
      return {
        id: matchedRequirement.id || name,
        name,
        category: name,
        count,
        activeOrderCount: count,
        priority: matchedRequirement.priority || (count ? "P1" : "P2"),
        route: matchedRequirement.route || "01",
      };
    }),
  ].filter((item) => item.name === "全部" || item.count > 0);
  return {
    sourceEndpoint: "/api/guide/hall",
    guide: dashboard.guide,
    dashboard: { ...dashboard, sourceEndpoint: "/api/guide/dashboard" },
    stats: { ...stats.stats, sourceEndpoint: "/api/guide/stats" },
    serviceType: serviceType || "全部",
    orders,
    categories,
    tabs: {
      recommend: { label: "推荐", count: orders.length, rule: "按服务匹配和距离综合排列" },
      nearby: { label: "附近", count: orders.filter((item) => Number.parseFloat(String(item.distance || "0")) <= 3).length, rule: "按距离由近到远排列" },
      latest: { label: "最新", count: orders.length, rule: "按发布时间从新到旧排列" },
    },
    tasksEndpoint: "/api/guide/tasks",
    categoriesEndpoint: "/api/guide/categories",
    actions: {
      refresh: { method: "GET", endpoint: "/api/guide/hall" },
      claim: { method: "POST", endpoint: "/api/guide/tasks/claim-next" },
      acceptTask: { method: "POST", endpoint: "/api/tasks/{id}/accept" },
      detail: { route: "02" },
      filter: { route: "09" },
    },
    updatedAt: now(),
  };
}

function guideActiveServiceChecklist(order = {}) {
  if (Array.isArray(order.items) && order.items.length) {
    return order.items.map((item, index) => ({
      id: item.id || `item-${index + 1}`,
      title: item.title || item.name || String(item),
      description: item.description || item.note || "来自订单服务清单",
      done: item.done !== false,
    }));
  }
  const serviceType = order.serviceType || "向导服务";
  const templates = {
    陪伴就医: [
      ["就诊前确认", "核对医院、科室、预约时间和老人健康注意事项"],
      ["全程陪同", "协助取号、排队、检查、缴费和取药"],
      ["返程交接", "安全送回并同步就诊结果与用药提醒"],
    ],
    导游游览: [
      ["行程确认", "确认游览路线、集合点和老人行动节奏"],
      ["途中陪同", "陪同游览并关注休息、饮水和安全"],
      ["服务交接", "完成返程或转交家属并同步行程记录"],
    ],
    接送出行: [
      ["出发确认", "确认出发地、目的地和接送时间"],
      ["途中陪同", "协助上下车、看护随身物品和安全到达"],
      ["到达交接", "抵达后完成客户交接并同步平台记录"],
    ],
    生活陪伴: [
      ["需求确认", "确认陪伴事项、时间和老人身体状态"],
      ["过程陪伴", "按订单内容完成生活协助和安全看护"],
      ["结果同步", "服务结束后同步记录和异常情况"],
    ],
  };
  const rows = templates[serviceType] || [
    ["需求确认", "核对订单服务内容、时间和地点"],
    ["过程服务", "按订单要求完成当前服务并记录过程"],
    ["完成交接", "服务结束后同步客户和平台记录"],
  ];
  return rows.map(([title, description], index) => ({ id: `check-${index + 1}`, title, description, done: true }));
}

function computeGuideActiveService(db, guideId = "guide-001") {
  const dashboard = computeGuideDashboard(db, guideId);
  const { rows, ...stats } = computeGuideStats(db, guideId);
  const activeRow = (dashboard.tasks || []).find((row) => row.status === "服务中" || row.order?.status === "服务中");
  const task = activeRow || null;
  const order = activeRow?.order || null;
  const user = order ? db.users.find((item) => item.id === order.userId) : null;
  const elder = order && db.elderProfile?.userId === order.userId ? db.elderProfile : db.elderProfile;
  const phone = order?.phone || user?.phone || "";
  const checklist = order ? guideActiveServiceChecklist(order) : [];
  const service = order && task
    ? {
        orderId: order.id,
        orderNo: order.orderNo || "",
        taskId: task.id,
        taskNo: task.taskNo || "",
        status: task.status || order.status || "服务中",
        taskStatus: task.status || "",
        orderStatus: order.status || "",
        serviceType: order.serviceType || "向导服务",
        customer: {
          id: order.userId || user?.id || "",
          name: order.elderName || elder?.name || user?.nickname || "旅居用户",
          phone,
          age: elder?.age || "",
          gender: elder?.gender || "",
          avatar: user?.avatar || "/user/assets/avatar-user.jpg",
          healthNote: [
            ...(Array.isArray(elder?.healthTags) ? elder.healthTags : []),
            elder?.mobility || "",
          ].filter(Boolean).join("，"),
        },
        time: order.time || task.updatedAt || task.createdAt || now(),
        startTime: task.updatedAt || order.time || task.createdAt || now(),
        location: order.location || "服务地点待确认",
        note: order.note || "客户暂无额外备注",
        amount: Number(order.amount || 0),
        duration: order.duration || "以实际服务时长为准",
        checklist,
        progress: {
          completed: checklist.filter((item) => item.done !== false).length,
          total: checklist.length,
        },
        route: {
          origin: dashboard.guide?.area || "当前位置",
          destination: order.location || "",
          route: "27",
        },
      }
    : null;
  return {
    sourceEndpoint: "/api/guide/active-service",
    guide: dashboard.guide,
    dashboard: { ...dashboard, sourceEndpoint: "/api/guide/dashboard" },
    stats: { ...stats.stats, sourceEndpoint: "/api/guide/stats" },
    task: task ? { ...task, order: undefined } : null,
    order,
    service,
    actions: {
      refresh: { method: "GET", endpoint: "/api/guide/active-service" },
      route: { route: "27" },
      call: { scheme: "tel", phone },
      exception: { method: "POST", endpoint: "/api/guide/exception", route: "05" },
      complete: { method: "POST", endpoint: "/api/tasks/{id}/complete" },
      report: { route: "29" },
      support: { route: "34", phone: "4000000000" },
    },
    updatedAt: now(),
  };
}

function guideMessageCategory(message = {}) {
  const text = `${message.title || ""}${message.content || ""}${message.scenario || ""}${message.relatedType || ""}`;
  if (/订单|派单|接单|任务|服务中|待确认|待派单|待接单|行程|导航/.test(text)) return "order";
  if (/客户|咨询|客服|聊天|评价|回复|联系|互动/.test(text)) return "interactive";
  return "system";
}

function guideMessageRoute(category, message = {}) {
  if (message.actionTarget) return String(message.actionTarget);
  if (category === "order") return "32";
  if (category === "interactive") return /客服/.test(`${message.title || ""}${message.content || ""}`) ? "34" : "33";
  return "31";
}

function decorateGuideMessage(message = {}) {
  const category = guideMessageCategory(message);
  return {
    ...message,
    read: Boolean(message.read),
    category,
    route: guideMessageRoute(category, message),
  };
}

function unreadCount(messages = []) {
  return messages.filter((item) => !item.read).length;
}

function computeGuideMessages(db, guideId = "guide-001") {
  const guide = getGuide(db, guideId);
  const messages = latestMessages(db, "guide").map(decorateGuideMessage);
  const systemNotices = messages.filter((item) => item.category === "system");
  const orderMessages = messages.filter((item) => item.category === "order");
  const interactiveMessages = messages.filter((item) => item.category === "interactive");
  return {
    sourceEndpoint: "/api/guide/messages",
    guide,
    messagesEndpoint: "/api/messages?role=guide",
    messages,
    systemNotices,
    orderMessages,
    interactiveMessages,
    summary: {
      total: messages.length,
      unread: unreadCount(messages),
      systemCount: systemNotices.length,
      systemUnread: unreadCount(systemNotices),
      orderCount: orderMessages.length,
      orderUnread: unreadCount(orderMessages),
      interactiveCount: interactiveMessages.length,
      interactiveUnread: unreadCount(interactiveMessages),
    },
    actions: {
      refresh: { method: "GET", endpoint: "/api/guide/messages" },
      readAll: { method: "POST", endpoint: "/api/messages/read-all", body: { role: "guide" } },
      read: { method: "POST", endpoint: "/api/messages/{id}/read", body: { role: "guide" } },
      systemNotices: { route: "31" },
      orderMessages: { route: "32" },
      customerChat: { route: "33" },
      support: { route: "34", phone: "4000000000" },
    },
    updatedAt: now(),
  };
}

function computeMerchantDashboard(db, merchantId = "merchant-001") {
  const aggregate = computeMerchantStats(db, merchantId);
  const merchant = merchantProfileForApi(db, aggregate.provider.id);
  const orders = db.orders.filter((item) => item.providerType === "merchant" && (!item.providerId || item.providerId === merchant.id));
  const services = db.services.filter((item) => item.providerType === "merchant" && item.providerId === merchant.id);
  const tasks = db.tasks.filter((item) => item.assigneeType === "merchant" && item.assigneeId === merchant.id);
  return {
    merchant,
    stats: aggregate.stats,
    services,
    orders,
    tasks: ordersForTasks(db, tasks),
    messages: latestMessages(db, "merchant").slice(0, 10),
  };
}

function answerFor(question, db) {
  const text = String(question || "").trim();
  if (!text) {
    return {
      intent: "empty",
      answer: "您可以告诉我想了解天气、旅居地、住宿、活动、交通、政策或健康常识哪一类问题。",
      recommendations: [],
      responseTimeMs: 1,
      friendlyTone: true,
      withinFiveSeconds: true,
    };
  }
  return normalizeAiChatPayload(text, db);
}

function aiContextForPrompt(db) {
  const city = db.homeConfig?.currentCity || db.elderProfile?.city || "昆明";
  const activities = (db.activities || [])
    .slice(0, 4)
    .map((item) => `${item.title}（${item.category || "活动"}，${item.time || "近期"}，${item.location || city}）`)
    .join("；");
  const services = (db.services || [])
    .filter((item) => item.status === "上架")
    .slice(0, 5)
    .map((item) => `${item.title}（${item.category || item.providerType || "服务"}，¥${item.price || item.amount || 0}）`)
    .join("；");
  const health = (db.healthRecords || [])
    .slice(0, 4)
    .map((item) => `${item.metricType || item.type}:${item.value}${item.unit || ""}`)
    .join("；");
  return [
    `当前城市：${city}`,
    `老人档案：${db.elderProfile?.name || "用户"}，${db.elderProfile?.age || ""}岁，地址：${db.elderProfile?.address || city}`,
    activities ? `近期活动：${activities}` : "",
    services ? `可推荐服务：${services}` : "",
    health ? `健康概览：${health}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function configuredAiStewardModel(db) {
  const config = normalizeAdminSystemConfig(db.systemConfig || {}).aiSteward || {};
  const configuredKey = String(config.apiKey || "").trim();
  const apiKey = configuredKey && !configuredKey.includes("*") ? configuredKey : DEEPSEEK_API_KEY;
  return {
    enabled: config.enabled !== false,
    provider: String(config.provider || "DeepSeek").trim() || "DeepSeek",
    apiBase: String(config.apiBase || DEEPSEEK_API_BASE).trim().replace(/\/$/, ""),
    apiKey,
    model: String(config.model || DEEPSEEK_MODEL).trim() || DEEPSEEK_MODEL,
    timeoutMs: Number(config.timeoutMs || process.env.DEEPSEEK_TIMEOUT_MS || 12000),
    temperature: Number(config.temperature ?? 0.6),
    maxTokens: Number(config.maxTokens || 700),
  };
}

async function answerForWithDeepSeek(question, db) {
  const local = answerFor(question, db);
  const text = String(question || "").trim();
  const modelConfig = configuredAiStewardModel(db);
  if (!modelConfig.enabled || !modelConfig.apiKey || !text) return { ...local, provider: "local-rule" };
  const isSceneQuestion = /背景|画面|图片|封面/.test(text);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), modelConfig.timeoutMs);
  try {
    const response = await fetch(`${modelConfig.apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${modelConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: modelConfig.model,
        messages: [
          {
            role: "system",
            content:
              `你是云旅无忧的AI智能管家，服务旅居老人。回答要温和、简洁、可执行。可以推荐活动、人工向导、商户服务、交通、安全守护和健康常识，但不要给医疗诊断结论；涉及紧急情况时建议触发SOS或联系家属/平台。${isSceneQuestion ? "当用户询问背景、画面、图片或封面是什么天气时，只描述当前页面背景图呈现的天气氛围，不要替换成昆明、弥勒等城市实时天气；可提醒实际出行前查看实时天气。" : ""}`,
          },
          {
            role: "user",
            content: `业务上下文：\n${aiContextForPrompt(db)}\n\n用户问题：${text}`,
          },
        ],
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
      }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error?.message || `DeepSeek API ${response.status}`);
    }
    const answer = payload.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("DeepSeek API 未返回回答内容");
    return {
      ...local,
      answer,
      provider: modelConfig.provider,
      model: payload.model || modelConfig.model,
      usage: payload.usage || null,
    };
  } catch (error) {
    return {
      ...local,
      provider: "local-rule",
      llmError: error.name === "AbortError" ? "DeepSeek API 请求超时，已使用本地兜底回答。" : `DeepSeek API 调用失败，已使用本地兜底回答：${error.message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

function resolveProvider(db, order, body = {}) {
  const providerType = body.assigneeType || order.providerType || (order.serviceType.includes("护理") ? "merchant" : "guide");
  if (providerType === "merchant") {
    const merchant = db.merchants.find((item) => item.id === body.assigneeId) || db.merchants.find((item) => item.status === "已通过") || db.merchants[0];
    return { assigneeType: "merchant", assigneeId: merchant.id, assigneeName: merchant.name };
  }
  const guide = db.guides.find((item) => item.id === body.assigneeId) || db.guides.find((item) => item.onlineStatus === "在线" && item.status === "已认证") || db.guides[0];
  return { assigneeType: "guide", assigneeId: guide.id, assigneeName: guide.realName };
}

async function handleApi(req, res, pathname) {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  const db = await readDb();
  const body = ["POST", "PUT", "PATCH"].includes(req.method) ? await parseBody(req) : {};
  const permission = permissionFor(req, pathname);
  const auth = permission ? requireAuth(req, res, permission) : getAuth(req, AUTH_SECRET);
  if (permission && !auth) return;

  if (req.method === "GET" && pathname === "/api/health") {
    const dbStatus = await database.status();
    return ok(res, {
      status: "ok",
      time: now(),
      auth: "mock-jwt",
      database: dbStatus.driver,
      endpoints: ["/user/", "/guide/", "/merchant/", "/admin/"],
      previewMode: "h5-api-linked",
      mobileBuilds: ["uniapp/dist/build/mp-weixin", "uniapp/dist/build/app"],
      prototypes: ["/prototype/user/", "/prototype/guide/", "/prototype/merchant/", "/prototype/admin/"],
      apiGroups: ["auth", "mvp-delivery-completion", "initial-delivery-scope", "mvp-principles", "role-endpoints", "business-flow", "user", "user-functions", "user-home-requirements", "activities", "activity-map-requirements", "ai", "ai-steward-requirements", "service-requests", "orders", "tasks", "provider-stats", "reviews", "devices", "device-robot-requirements", "emergency-help-requirements", "alerts", "guide", "guide-home", "guide-mine", "guide-hall", "guide-active-service", "guide-messages", "guide-profile", "guide-settings", "guide-functions", "guide-order-requirements", "guide-order-flow", "merchant", "merchant-functions", "merchant-categories", "admin", "admin-functions", "admin-screens", "system-modules", "technology-stack", "collaboration", "priority", "integrations", "data-loop", "demo"],
    });
  }

  if (req.method === "GET" && pathname === "/api/reference") {
    return ok(res, {
      requirement: "云旅无忧—AI智慧旅居平台项目需求说明书.pdf",
      apps: [
        { name: "用户端", path: "/user/", type: "H5 临时验收预览，API 驱动；正式交付保留微信小程序 / iOS App / Android App 工程" },
        { name: "人工向导端", path: "/guide/", type: "H5 临时验收预览，API 驱动；正式交付保留小程序/App 内角色端工程" },
        { name: "商户端", path: "/merchant/", type: "H5 临时验收预览，API 驱动；正式交付保留小程序/App 内角色端工程" },
        { name: "管理后台", path: "/admin/", type: "PC Web 管理后台", pages: 53 },
      ],
      mobileBuilds: [
        { name: "微信小程序", path: "uniapp/dist/build/mp-weixin" },
        { name: "iOS/Android App", path: "uniapp/dist/build/app" },
      ],
      prototypes: [
        { name: "用户端静态原型", path: "/prototype/user/", pages: 40 },
        { name: "人工向导端静态原型", path: "/prototype/guide/", pages: 46 },
        { name: "商户端静态原型", path: "/prototype/merchant/", pages: 70 },
        { name: "管理后台静态原型", path: "/prototype/admin/", pages: 53 },
      ],
      mvpApiContract: {
        canonicalPrefix: "/api",
        barePathAliases: true,
        note: "接口同时支持图示裸路径和现有 /api 前缀路径，例如 /orders 与 /api/orders 等价。",
        endpoints: mvpApiContract,
      },
      initialDeliveryScope: {
        ...initialDeliveryScopeForApi(db),
        scopes: initialDeliveryScopeForApi(db).scopes.map((item) => ({
          id: item.id,
          scope: item.scope,
          content: item.content,
          deliveryRequirement: item.deliveryRequirement,
          ready: item.ready,
        })),
        architecturePath: "/api/delivery/initial-scope",
      },
      mvpPrinciples: {
        ...mvpPrinciplesForApi(db, { integrations: integrationStatus().integrations }),
        principles: mvpPrinciplesForApi(db, { integrations: integrationStatus().integrations }).principles.map((item) => ({
          id: item.id,
          principle: item.principle,
          deliveryMode: item.deliveryMode,
          ready: item.ready,
        })),
        architecturePath: "/api/mvp/principles",
      },
      roleEndpointDivision: {
        ...roleEndpointDivisionForApi(db),
        roles: roleEndpointDivisionForApi(db).roles.map((item) => ({
          id: item.id,
          role: item.role,
          essence: item.essence,
          useEnd: item.useEnd,
          runtimeStatus: item.runtime.status,
          ready: item.ready,
        })),
        architecturePath: "/api/roles/endpoint-division",
      },
      businessFlow: {
        ...businessFlowForApi(db),
        steps: businessFlowForApi(db).steps.map((item) => ({
          step: item.step,
          action: item.action,
          involvedEnds: item.involvedEnds,
          status: item.status,
        })),
        architecturePath: "/api/business-flow/overview",
      },
      userFunctionOverview: {
        ...userFunctionOverviewForApi(db),
        modules: userFunctionOverviewForApi(db).modules.map((item) => ({
          key: item.key,
          module: item.module,
          priority: item.priority,
          route: item.route,
          acceptance: item.acceptance,
          ready: item.ready,
        })),
        architecturePath: "/api/user/functions/overview",
      },
      userHomeRequirements: {
        ...userHomeRequirementsForApi(db),
        requirements: userHomeRequirementsForApi(db).requirements.map((item) => ({
          key: item.key,
          feature: item.feature,
          acceptance: item.acceptance,
        })),
        architecturePath: "/api/user/home-requirements",
      },
      activityMapRequirements: {
        ...activityMapRequirementsForApi(db),
        requirements: activityMapRequirementsForApi(db).requirements.map((item) => ({
          key: item.key,
          feature: item.feature,
          priority: item.priority,
          acceptance: item.acceptance,
        })),
        architecturePath: "/api/activities/map-requirements",
      },
      aiStewardRequirements: {
        ...aiStewardRequirementsForApi(db),
        requirements: aiStewardRequirementsForApi(db).requirements.map((item) => ({
          key: item.key,
          feature: item.feature,
          priority: item.priority,
          acceptance: item.acceptance,
        })),
        architecturePath: "/api/ai/steward-requirements",
      },
      emergencyHelpRequirements: {
        ...emergencyHelpRequirementsForApi(db),
        requirements: emergencyHelpRequirementsForApi(db).requirements.map((item) => ({
          key: item.key,
          feature: item.feature,
          priority: item.priority,
          acceptance: item.acceptance,
        })),
        architecturePath: "/api/alerts/emergency-requirements",
      },
      coreDataTables: {
        version: (await database.status()).schemaVersion,
        schemaPath: "/api/admin/database/schema",
        tables: schemaForApi().map((table) => table.table),
      },
      systemModules: {
        ...systemModulesForApi(),
        modules: systemModulesForApi().modules.map((item) => ({ id: item.id, module: item.module, status: item.status })),
        architecturePath: "/api/admin/system/modules",
      },
      technologyStack: {
        ...technologyStackForApi(),
        layers: technologyStackForApi().layers.map((item) => ({ id: item.id, layer: item.layer, recommendation: item.recommendation, targetStatus: item.targetStatus })),
        architecturePath: "/api/admin/system/technology",
      },
      collaborationNotifications: {
        ...collaborationForApi(),
        rules: collaborationForApi().rules.map((item) => ({ id: item.id, scenario: item.scenario, triggerSide: item.triggerSide, receiverSides: item.receiverSides, status: item.status })),
        architecturePath: "/api/admin/system/collaboration",
      },
      guideFunctionOverview: {
        ...guideFunctionOverviewForApi(db),
        modules: guideFunctionOverviewForApi(db).modules.map((item) => ({
          id: item.id,
          module: item.module,
          priority: item.priority,
          route: item.route,
          acceptance: item.acceptance,
          runtimeStatus: item.runtime.status,
        })),
        architecturePath: "/api/guide/functions/overview",
      },
      guideOrderRequirements: {
        ...guideOrderRequirementsForApi(db),
        categories: guideOrderRequirementsForApi(db).categories.map((item) => ({
          id: item.id,
          category: item.category,
          description: item.description,
          orderFields: item.orderFields,
          priority: item.priority,
          route: item.route,
          runtimeStatus: item.runtime.status,
          activeOrderCount: item.runtime.activeOrderCount,
        })),
        architecturePath: "/api/guide/order-requirements",
      },
      guideOrderStatusFlow: {
        ...guideOrderStatusFlowForApi(db),
        flow: guideOrderStatusFlowForApi(db).flow.map((item) => ({
          id: item.id,
          status: item.status,
          triggerText: item.triggerText,
          operationText: item.operationText,
          route: item.route,
          runtimeCount: item.runtimeCount,
        })),
        architecturePath: "/api/guide/order-status-flow",
      },
      merchantFunctionOverview: {
        ...merchantFunctionOverviewForApi(db),
        modules: merchantFunctionOverviewForApi(db).modules.map((item) => ({
          id: item.id,
          module: item.module,
          priority: item.priority,
          route: item.route,
          acceptance: item.acceptance,
          runtimeStatus: item.runtime.status,
        })),
        architecturePath: "/api/merchant/functions/overview",
      },
      merchantServiceCategories: {
        ...merchantServiceCategoriesForApi(db),
        categories: merchantServiceCategoriesForApi(db).categories.map((item) => ({
          id: item.id,
          category: item.category,
          examples: item.examples,
          note: item.note,
          route: item.route,
          runtimeStatus: item.runtime.status,
          listedServiceCount: item.runtime.listedServiceCount,
        })),
        architecturePath: "/api/merchant/service-categories",
      },
      smartDeviceRobotRequirements: {
        ...smartDeviceRobotRequirementsForApi(db),
        requirements: smartDeviceRobotRequirementsForApi(db).requirements.map((item) => ({
          id: item.id,
          feature: item.feature,
          detail: item.detail,
          priority: item.priority,
          route: item.route,
          runtimeStatus: item.runtime.status,
        })),
        architecturePath: "/api/devices/robot-requirements",
      },
      adminFunctionOverview: {
        ...adminFunctionOverviewForApi(db),
        modules: adminFunctionOverviewForApi(db).modules.map((item) => ({
          id: item.id,
          module: item.module,
          priority: item.priority,
          route: item.route,
          acceptance: item.acceptance,
          runtimeStatus: item.runtime.status,
        })),
        architecturePath: "/api/admin/functions/overview",
      },
      adminDataScreens: {
        ...adminScreensForApi(db),
        screens: adminScreensForApi(db).screens.map((item) => ({
          id: item.id,
          title: item.title,
          coreMetrics: item.coreMetrics,
          purpose: item.purpose,
          route: item.route,
        })),
        architecturePath: "/api/admin/screens",
      },
      mvpDeliveryCompletion: {
        ...mvpDeliveryCompletionForApi(db, { integrations: integrationStatus().integrations }),
        architecturePath: "/api/admin/mvp-delivery/completion",
      },
      mvpFlow: "用户下单 / 设备异常 -> 平台派单 -> 向导或商户执行 -> 用户确认 -> 后台沉淀",
    });
  }

  if (req.method === "GET" && pathname === "/api/messages") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const role = authorizedMessageRole(auth, url.searchParams.get("role"));
    if (!role) return fail(res, 403, "只能查看当前账号所属角色的消息");
    return ok(res, latestMessages(db, role));
  }

  if (req.method === "POST" && pathname === "/api/messages/read-all") {
    const role = authorizedMessageRole(auth, body.role);
    if (!role) return fail(res, 403, "只能操作当前账号所属角色的消息");
    let changed = 0;
    latestMessages(db, role).forEach((message) => {
      if (message.read) return;
      const stored = db.messages.find((item) => item.id === message.id);
      if (stored) {
        message.read = true;
        stored.read = true;
        stored.readAt = now();
      } else {
        markGeneratedMessageRead(db, role, message.id);
      }
      changed += 1;
    });
    audit(db, actorName(auth), "全部消息已读", role, `已读 ${changed} 条`);
    await writeDb(db);
    return ok(res, { role, changed, unread: latestMessages(db, role).filter((item) => !item.read).length });
  }

  const messageRead = pathname.match(/^\/api\/messages\/([^/]+)\/read$/);
  if (req.method === "POST" && messageRead) {
    const role = authorizedMessageRole(auth, body.role);
    if (!role) return fail(res, 403, "只能操作当前账号所属角色的消息");
    let message = db.messages.find((item) => item.id === messageRead[1] && item.toRole === role);
    if (message) {
      message.read = true;
      message.readAt = now();
    } else {
      message = latestMessages(db, role).find((item) => item.id === messageRead[1]);
      if (!message) return fail(res, 404, "Message not found");
      message = { ...message, read: true, readAt: markGeneratedMessageRead(db, role, message.id) };
    }
    audit(db, actorName(auth), "消息已读", message.title);
    await writeDb(db);
    return ok(res, message);
  }

  if (req.method === "POST" && ["/api/auth/login", "/api/auth/wechat-login"].includes(pathname)) {
    const role = body.role || "elder";
    const phone = body.phone || body.mobile;
    const user =
      (phone && db.users.find((item) => item.phone === phone)) ||
      db.users.find((item) => item.role === role) ||
      db.users[0];
    const session = issueToken(user, AUTH_SECRET);
    const loginType = pathname === "/api/auth/wechat-login" ? "wechat" : "password";
    audit(db, user.nickname, loginType === "wechat" ? "微信登录" : "登录", role);
    await writeDb(db);
    return ok(res, {
      token: session.token,
      user,
      role: user.role,
      loginType,
      openId: loginType === "wechat" ? body.openId || body.code || `mock-openid-${user.id}` : undefined,
      expiresIn: 60 * 60 * 8,
      permissions: session.permissions,
    });
  }

  if (req.method === "GET" && pathname === "/api/delivery/initial-scope") {
    return ok(res, {
      ...initialDeliveryScopeForApi(db),
      validation: validateInitialDeliveryScope(),
      related: {
        mvpPrinciples: "/api/mvp/principles",
        roleEndpoints: "/api/roles/endpoint-division",
        userFunctions: "/api/user/functions/overview",
        guideFunctions: "/api/guide/functions/overview",
        merchantFunctions: "/api/merchant/functions/overview",
        adminFunctions: "/api/admin/functions/overview",
        integrations: "/api/integrations/status",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/mvp/principles") {
    return ok(res, {
      ...mvpPrinciplesForApi(db, { integrations: integrationStatus().integrations }),
      validation: validateMvpPrinciples(),
      related: {
        roleEndpoints: "/api/roles/endpoint-division",
        businessFlow: "/api/business-flow/overview",
        priorityStatus: "/api/admin/priority/status",
        integrations: "/api/integrations/status",
        systemModules: "/api/admin/system/modules",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/roles/endpoint-division") {
    return ok(res, {
      ...roleEndpointDivisionForApi(db),
      validation: validateRoleEndpointDivision(),
      related: {
        login: "/api/auth/login",
        userEnd: "/user/",
        guideEnd: "/guide/",
        merchantEnd: "/merchant/",
        adminEnd: "/admin/",
        systemModules: "/api/admin/system/modules",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/business-flow/overview") {
    return ok(res, {
      ...businessFlowForApi(db),
      validation: validateBusinessFlow(),
      related: {
        demand: ["/api/orders", "/api/service-requests", "/api/alerts/sos", "/api/devices/{id}/sync"],
        analysis: ["/api/guide/order-requirements", "/api/admin/dispatch/candidates", "/api/admin/dispatch/pending"],
        assignment: ["/api/tasks/dispatch", "/api/guide/tasks/claim-next", "/api/merchant/dashboard"],
        execution: ["/api/tasks/{id}/accept", "/api/tasks/{id}/start", "/api/tasks/{id}/complete", "/api/merchant/orders/{id}/start", "/api/merchant/orders/{id}/complete"],
        feedback: ["/api/guide/exception", "/api/merchant/exception", "/api/orders/{id}/confirm", "/api/reviews"],
        dataLoop: ["/api/admin/data-loop", "/api/admin/database/schema", "/api/admin/screens"],
      },
    });
  }

  if (req.method === "POST" && pathname === "/api/ui/actions") {
    const action = recordUiAction(db, auth, body);
    await writeDb(db);
    return ok(res, action);
  }

  const safetyCodeMatch = pathname.match(/^\/api\/user\/safety-code\/([^/]+)$/);
  if (req.method === "GET" && safetyCodeMatch) {
    const token = decodeURIComponent(safetyCodeMatch[1]);
    const user = db.users.find((item) => userSafetyCodeToken(item.id) === token);
    if (!user) return fail(res, 404, "安全码无效或已失效");
    return ok(res, userSafetyCodePayload(db, user));
  }

  if (req.method === "GET" && pathname === "/api/user/personal") {
    const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`).split(",")[0].trim();
    return ok(res, await userPersonalForApi(db, auth, `${proto}://${host}`));
  }

  if (req.method === "GET" && pathname === "/api/user/family") {
    const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`).split(",")[0].trim();
    return ok(res, await familyPageForApi(db, auth, `${proto}://${host}`));
  }

  if (req.method === "GET" && pathname === "/api/user/contacts") {
    return ok(res, contactsPageForApi(db));
  }

  if (req.method === "GET" && pathname === "/api/user/checkin") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userCheckinForApi(db, auth, {
      type: url.searchParams.get("type"),
    }));
  }

  if (req.method === "POST" && pathname === "/api/user/checkin/photo") {
    const checkin = ensureUserCheckin(db);
    const user = userForAuth(db, auth);
    const record = {
      id: nextId(db, "checkinRecord", "checkin-record"),
      title: String(body.title || "今日拍照打卡").trim().slice(0, 40),
      place: String(body.place || db.elderProfile?.currentCity || "湖泉生态园").trim().slice(0, 60),
      text: String(body.text || "记录此刻美好旅居生活").trim().slice(0, 160),
      image: body.image || "checkin-today-ref.png",
      type: USER_CHECKIN_FILTERS.includes(body.type) && body.type !== "全部" ? body.type : "景点打卡",
      date: "今天",
      weekday: "今天",
      weather: body.weather || "晴朗",
      steps: Number(body.steps || 6850),
      points: Number(body.points || 10),
      likesCount: 0,
      likedBy: [],
      commentsCount: 0,
      fileName: String(body.fileName || "").slice(0, 120),
      fileSize: Number(body.fileSize || 0),
      createdAt: now(),
    };
    checkin.records.unshift(record);
    checkin.completedToday = true;
    addMessage(db, "user", "旅居打卡已保存", `您的「${record.title}」已写入旅居打卡记录，积分 +${record.points}。`, {
      scenario: "旅居打卡",
      priority: "P2",
      relatedType: "checkinRecord",
      relatedId: record.id,
    });
    addMessage(db, "family", "家属旅居打卡同步", `${user.nickname || db.elderProfile?.name || "老人"}完成了「${record.title}」。`, {
      scenario: "旅居打卡",
      priority: "P2",
      relatedType: "checkinRecord",
      relatedId: record.id,
    });
    audit(db, actorName(auth, user.nickname), "新增旅居打卡", record.id);
    await writeDb(db);
    return ok(res, {
      record: normalizeCheckinRecordForApi(record, user.id),
      page: userCheckinForApi(db, auth, { type: body.type }),
    });
  }

  const userCheckinRecord = pathname.match(/^\/api\/user\/checkin\/records\/([^/]+)$/);
  if (req.method === "GET" && userCheckinRecord) {
    const recordId = decodeURIComponent(userCheckinRecord[1]);
    const record = findCheckinRecord(db, recordId);
    if (!record) return fail(res, 404, "Checkin record not found");
    const user = userForAuth(db, auth);
    return ok(res, {
      record: normalizeCheckinRecordForApi(record, user.id),
      page: userCheckinForApi(db, auth, { type: body.type }),
    });
  }

  const userCheckinLike = pathname.match(/^\/api\/user\/checkin\/records\/([^/]+)\/like$/);
  if (req.method === "POST" && userCheckinLike) {
    const recordId = decodeURIComponent(userCheckinLike[1]);
    const record = findCheckinRecord(db, recordId);
    if (!record) return fail(res, 404, "Checkin record not found");
    const user = userForAuth(db, auth);
    record.likedBy = Array.isArray(record.likedBy) ? record.likedBy : [];
    const alreadyLiked = record.likedBy.includes(user.id);
    const nextLiked = typeof body.liked === "boolean" ? body.liked : !alreadyLiked;
    if (nextLiked && !alreadyLiked) {
      record.likedBy.push(user.id);
      record.likesCount = Number(record.likesCount || 0) + 1;
    }
    if (!nextLiked && alreadyLiked) {
      record.likedBy = record.likedBy.filter((id) => id !== user.id);
      record.likesCount = Math.max(0, Number(record.likesCount || 0) - 1);
    }
    audit(db, actorName(auth, user.nickname), nextLiked ? "点赞旅居打卡" : "取消点赞旅居打卡", record.id);
    await writeDb(db);
    return ok(res, {
      record: normalizeCheckinRecordForApi(record, user.id),
      page: userCheckinForApi(db, auth, { type: body.type }),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/food") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userFoodForApi(db, auth, {
      category: url.searchParams.get("category"),
      q: url.searchParams.get("q"),
    }));
  }

  const userFoodRestaurantDetail = pathname.match(/^\/api\/user\/food\/restaurants\/([^/]+)$/);
  if (req.method === "GET" && userFoodRestaurantDetail) {
    const restaurantId = decodeURIComponent(userFoodRestaurantDetail[1]);
    const found = findUserFoodRestaurant(db, auth, restaurantId);
    if (!found) return fail(res, 404, "Restaurant not found");
    return ok(res, {
      sourceEndpoint: "/api/user/food",
      restaurant: found.restaurant,
      menu: found.raw.menu || [],
      related: userFoodCatalog()
        .filter((item) => item.id !== found.raw.id && (item.category === found.raw.category || foodMatchesCategory(item, found.raw.category)))
        .slice(0, 3)
        .map((item) => foodRestaurantForApi(item, found.food, found.city)),
      endpoints: {
        list: "/api/user/food",
        menu: found.restaurant.menuEndpoint,
        book: found.restaurant.bookEndpoint,
        order: found.restaurant.orderEndpoint,
        route: found.restaurant.routeEndpoint,
      },
    });
  }

  const userFoodRestaurantMenu = pathname.match(/^\/api\/user\/food\/restaurants\/([^/]+)\/menu$/);
  if (req.method === "GET" && userFoodRestaurantMenu) {
    const restaurantId = decodeURIComponent(userFoodRestaurantMenu[1]);
    const found = findUserFoodRestaurant(db, auth, restaurantId);
    if (!found) return fail(res, 404, "Restaurant not found");
    return ok(res, {
      sourceEndpoint: "/api/user/food",
      restaurant: found.restaurant,
      menu: found.raw.menu || [],
    });
  }

  const userFoodRestaurantRoute = pathname.match(/^\/api\/user\/food\/restaurants\/([^/]+)\/route$/);
  if (req.method === "POST" && userFoodRestaurantRoute) {
    const restaurantId = decodeURIComponent(userFoodRestaurantRoute[1]);
    const found = findUserFoodRestaurant(db, auth, restaurantId);
    if (!found) return fail(res, 404, "Restaurant not found");
    const routeItem = {
      id: nextId(db, "foodRoute", "food-route"),
      restaurantId,
      restaurantName: found.raw.name,
      url: found.restaurant.mapUrl,
      source: body.source || "food",
      createdAt: now(),
    };
    found.food.routeRequests.unshift(routeItem);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "food",
      action: "餐厅导航",
      target: restaurantId,
      result: `${found.raw.name}路线已生成`,
      payload: { restaurantId, restaurantName: found.raw.name, routeId: routeItem.id, source: body.source || "food" },
    });
    await writeDb(db);
    return ok(res, {
      restaurant: foodRestaurantForApi(found.raw, found.food, found.city),
      route: {
        id: routeItem.id,
        title: `${found.raw.name}路线`,
        address: found.raw.address,
        distance: found.raw.distance,
        url: found.restaurant.mapUrl,
      },
      action,
      page: userFoodForApi(db, auth, {}),
    });
  }

  const userFoodRestaurantBook = pathname.match(/^\/api\/user\/food\/restaurants\/([^/]+)\/book$/);
  if (req.method === "POST" && userFoodRestaurantBook) {
    const restaurantId = decodeURIComponent(userFoodRestaurantBook[1]);
    const found = findUserFoodRestaurant(db, auth, restaurantId);
    if (!found) return fail(res, 404, "Restaurant not found");
    const booking = {
      id: nextId(db, "foodBooking", "food-booking"),
      restaurantId,
      restaurantName: found.raw.name,
      diners: Number(body.diners || 1),
      note: String(body.note || "").slice(0, 160),
      status: "待确认",
      createdAt: now(),
    };
    found.food.bookings.unshift(booking);
    const requestItem = createFoodServiceRequest(db, auth, found.raw, {
      ...body,
      diners: booking.diners,
      payload: { bookingId: booking.id },
    }, "预约餐厅");
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "food",
      action: "预约餐厅",
      target: restaurantId,
      result: `${found.raw.name}预约已提交`,
      payload: { restaurantId, restaurantName: found.raw.name, bookingId: booking.id, requestId: requestItem.id, source: body.source || "food" },
    });
    await writeDb(db);
    return ok(res, {
      restaurant: foodRestaurantForApi(found.raw, found.food, found.city),
      booking,
      request: requestItem,
      action,
      page: userFoodForApi(db, auth, {}),
    });
  }

  const userFoodRestaurantOrder = pathname.match(/^\/api\/user\/food\/restaurants\/([^/]+)\/order$/);
  if (req.method === "POST" && userFoodRestaurantOrder) {
    const restaurantId = decodeURIComponent(userFoodRestaurantOrder[1]);
    const found = findUserFoodRestaurant(db, auth, restaurantId);
    if (!found) return fail(res, 404, "Restaurant not found");
    const menu = found.raw.menu || [];
    const menuItem = menu.find((item) => item.id === body.menuItemId) || menu[0] || { id: "custom", name: "推荐套餐", price: 0 };
    const quantity = Math.max(1, Number(body.quantity || 1));
    const order = {
      id: nextId(db, "foodOrder", "food-order"),
      orderNo: nextNo(db, "foodOrderNo", "FOOD"),
      restaurantId,
      restaurantName: found.raw.name,
      menuItemId: menuItem.id,
      menuItemName: menuItem.name,
      quantity,
      amount: Number(menuItem.price || 0) * quantity,
      status: "待确认",
      source: body.source || "food",
      createdAt: now(),
    };
    found.food.orders.unshift(order);
    addMessage(db, "user", "餐品已加入待下单清单", `${found.raw.name}「${menuItem.name}」×${quantity} 已保存。`, {
      scenario: "餐饮下单",
      priority: "P2",
      relatedType: "foodOrder",
      relatedId: order.id,
    });
    addMessage(db, "admin", "新的餐饮下单线索", `${actorName(auth, found.user.nickname)}在${found.raw.name}选择了「${menuItem.name}」。`, {
      scenario: "餐饮下单",
      priority: "P2",
      relatedType: "foodOrder",
      relatedId: order.id,
    });
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "food",
      action: "立即订餐",
      target: restaurantId,
      result: `${found.raw.name}${menuItem.name}已加入待下单清单`,
      payload: { restaurantId, restaurantName: found.raw.name, orderId: order.id, menuItemId: menuItem.id, quantity, source: body.source || "food" },
    });
    await writeDb(db);
    return ok(res, {
      restaurant: foodRestaurantForApi(found.raw, found.food, found.city),
      order,
      action,
      page: userFoodForApi(db, auth, {}),
    });
  }

  const userFoodRestaurantFavorite = pathname.match(/^\/api\/user\/food\/restaurants\/([^/]+)\/favorite$/);
  if (req.method === "POST" && userFoodRestaurantFavorite) {
    const restaurantId = decodeURIComponent(userFoodRestaurantFavorite[1]);
    const found = findUserFoodRestaurant(db, auth, restaurantId);
    if (!found) return fail(res, 404, "Restaurant not found");
    const nextFavorite = typeof body.favorite === "boolean" ? body.favorite : !found.food.favoriteIds.includes(restaurantId);
    found.food.favoriteIds = nextFavorite
      ? [...new Set([...found.food.favoriteIds, restaurantId])]
      : found.food.favoriteIds.filter((id) => id !== restaurantId);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "food",
      action: nextFavorite ? "收藏餐厅" : "取消收藏餐厅",
      target: restaurantId,
      result: nextFavorite ? `${found.raw.name}已收藏` : `${found.raw.name}已取消收藏`,
      payload: { restaurantId, restaurantName: found.raw.name, favorite: nextFavorite, source: body.source || "food" },
    });
    await writeDb(db);
    return ok(res, {
      restaurant: foodRestaurantForApi(found.raw, found.food, found.city),
      favorite: nextFavorite,
      action,
      page: userFoodForApi(db, auth, {}),
    });
  }

  const userFoodRestaurantConsult = pathname.match(/^\/api\/user\/food\/restaurants\/([^/]+)\/consult$/);
  if (req.method === "POST" && userFoodRestaurantConsult) {
    const restaurantId = decodeURIComponent(userFoodRestaurantConsult[1]);
    const found = findUserFoodRestaurant(db, auth, restaurantId);
    if (!found) return fail(res, 404, "Restaurant not found");
    const requestItem = createFoodServiceRequest(db, auth, found.raw, {
      ...body,
      description: body.question || body.description || `咨询餐饮服务：${found.raw.name}`,
    }, "餐饮咨询");
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "food",
      action: "餐饮咨询",
      target: restaurantId,
      result: `${found.raw.name}咨询已提交`,
      payload: { restaurantId, restaurantName: found.raw.name, requestId: requestItem.id, source: body.source || "food" },
    });
    await writeDb(db);
    return ok(res, {
      restaurant: foodRestaurantForApi(found.raw, found.food, found.city),
      request: requestItem,
      action,
      page: userFoodForApi(db, auth, {}),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/transport") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userTransportForApi(db, auth, {
      destination: url.searchParams.get("destination"),
    }));
  }

  if (req.method === "GET" && pathname === "/api/user/transport/nearby") {
    const origin = transportOriginForApi(db, auth);
    return ok(res, {
      sourceEndpoint: "/api/user/transport/nearby",
      origin,
      nearby: transportNearbyForApi(origin.city),
      page: userTransportForApi(db, auth, {}),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/transport/records") {
    const transport = ensureUserTransport(db);
    return ok(res, {
      sourceEndpoint: "/api/user/transport/records",
      records: transport.records.map(normalizeTransportRecord),
      summary: {
        total: transport.records.length,
        routePlans: transport.routePlans.length,
        serviceRequests: transport.serviceRequests.length,
      },
      page: userTransportForApi(db, auth, {}),
    });
  }

  if (req.method === "POST" && pathname === "/api/user/transport/route") {
    const transport = ensureUserTransport(db);
    const origin = transportOriginForApi(db, auth);
    const destination = String(body.destination || body.routeTitle || "附近医院").trim().slice(0, 80);
    if (!destination) return fail(res, 400, "Destination is required");
    const route = createTransportRoute({
      id: nextId(db, "transportRoute", "transport-route"),
      title: /^去/.test(destination) ? destination : `去${destination}`,
      destination: destination.replace(/^去/, ""),
      text: /医院/.test(destination) ? "推荐预约用车 · 直达门诊楼" : /站|机场/.test(destination) ? "推荐公共交通 + 接驳" : "推荐适老路线",
      time: /昆明南站|机场/.test(destination) ? "42分钟" : "22分钟",
      distance: /昆明南站|机场/.test(destination) ? "约 28 公里" : "约 8 公里",
      color: /医院/.test(destination) ? "blue" : "green",
      iconName: /医院/.test(destination) ? "building-2" : "navigation",
    }, body.origin || origin.title, origin.city);
    const record = {
      id: nextId(db, "transportRecord", "transport-record"),
      title: route.title,
      destination: route.destination,
      mode: route.mode,
      status: "已规划",
      time: route.time,
      distance: route.distance,
      color: route.color,
      iconName: route.iconName,
      url: route.url,
      createdAt: now(),
    };
    transport.routePlans.unshift(route);
    transport.records.unshift(record);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "transport",
      action: "规划路线",
      target: route.destination,
      result: `${route.title}路线已生成`,
      payload: { destination: route.destination, routeId: route.id, recordId: record.id, source: body.source || "transport" },
    });
    await writeDb(db);
    return ok(res, {
      route,
      record: normalizeTransportRecord(record),
      action,
      page: userTransportForApi(db, auth, { destination: route.destination }),
    });
  }

  const userTransportService = pathname.match(/^\/api\/user\/transport\/services\/([^/]+)\/request$/);
  if (req.method === "POST" && userTransportService) {
    const serviceKey = decodeURIComponent(userTransportService[1]);
    const service = findTransportService(serviceKey);
    if (!service) return fail(res, 404, "Transport service not found");
    const transport = ensureUserTransport(db);
    const requestItem = createTransportServiceRequest(db, auth, service, body);
    const record = {
      id: nextId(db, "transportRecord", "transport-record"),
      title: service.action,
      destination: String(body.destination || "交通出行推荐路线").slice(0, 80),
      mode: service.title,
      status: "待处理",
      time: "15分钟内响应",
      distance: "平台调度",
      color: service.color,
      iconName: service.iconName,
      relatedRequestId: requestItem.id,
      createdAt: now(),
    };
    transport.serviceRequests.unshift({ serviceKey: service.key, requestId: requestItem.id, createdAt: now() });
    transport.records.unshift(record);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "transport",
      action: service.action,
      target: service.key,
      result: `${service.action}请求已提交`,
      payload: { serviceKey: service.key, requestId: requestItem.id, recordId: record.id, source: body.source || "transport" },
    });
    await writeDb(db);
    return ok(res, {
      service,
      request: requestItem,
      record: normalizeTransportRecord(record),
      action,
      page: userTransportForApi(db, auth, {}),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/shop") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userShopForApi(db, auth, {
      category: url.searchParams.get("category"),
      q: url.searchParams.get("q") || url.searchParams.get("keyword"),
    }));
  }

  if (req.method === "GET" && pathname === "/api/user/shop/cart") {
    return ok(res, {
      sourceEndpoint: "/api/user/shop/cart",
      cart: shopCartForApi(db, auth),
      page: userShopForApi(db, auth, {}),
    });
  }

  if (req.method === "POST" && pathname === "/api/user/shop/cart") {
    const result = addShopCartItemForApi(db, auth, body);
    if (result.error) return fail(res, 404, result.error);
    recordUiAction(db, auth, {
      role: "user",
      route: "shop",
      action: "加入购物车",
      target: result.item.productId,
      result: `${result.item.name}已加入购物车`,
      payload: { productId: result.item.productId, quantity: result.item.quantity, source: body.source || "shop" },
    });
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: "/api/user/shop/cart",
      item: result.item,
      cart: result.cart,
      page: userShopForApi(db, auth, {}),
    });
  }

  const userShopCartItem = pathname.match(/^\/api\/user\/shop\/cart\/items\/([^/]+)$/);
  if (userShopCartItem && req.method === "POST") {
    const itemId = decodeURIComponent(userShopCartItem[1]);
    const result = updateShopCartItemForApi(db, auth, itemId, body);
    recordUiAction(db, auth, {
      role: "user",
      route: "shop",
      action: "调整购物车",
      target: itemId,
      result: "购物车数量已更新",
      payload: { itemId, quantity: body.quantity, source: body.source || "shop" },
    });
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: `/api/user/shop/cart/items/${encodeURIComponent(itemId)}`,
      item: result.item,
      cart: result.cart,
      page: userShopForApi(db, auth, {}),
    });
  }

  if (userShopCartItem && req.method === "DELETE") {
    const itemId = decodeURIComponent(userShopCartItem[1]);
    const result = removeShopCartItemForApi(db, auth, itemId);
    recordUiAction(db, auth, {
      role: "user",
      route: "shop",
      action: "移除购物车商品",
      target: itemId,
      result: "购物车商品已移除",
      payload: { itemId, source: body.source || "shop" },
    });
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: `/api/user/shop/cart/items/${encodeURIComponent(itemId)}`,
      cart: result.cart,
      page: userShopForApi(db, auth, {}),
    });
  }

  if (req.method === "POST" && pathname === "/api/user/shop/family-purchase") {
    const requestItem = createShopFamilyPurchaseRequest(db, auth, body);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "shop",
      action: "代买服务",
      target: requestItem.payload.productId,
      result: `${requestItem.payload.productName}代买请求已提交`,
      payload: { requestId: requestItem.id, ...requestItem.payload },
    });
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: "/api/user/shop/family-purchase",
      request: requestItem,
      action,
      page: userShopForApi(db, auth, {}),
    });
  }

  if (req.method === "POST" && pathname === "/api/user/shop/orders") {
    const result = createShopOrderForApi(db, auth, body);
    if (result.error) return fail(res, 400, result.error);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "shop",
      action: "商城结算",
      target: result.order.id,
      result: `${result.order.orderNo}已提交`,
      payload: { orderId: result.order.id, itemCount: result.order.items.length, source: body.source || "shop" },
    });
    audit(db, actorName(auth, result.order.elderName), "创建商城订单", result.order.orderNo);
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: "/api/user/shop/orders",
      order: result.order,
      action,
      page: userShopForApi(db, auth, {}),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/volunteer") {
    return ok(res, userVolunteerForApi(db, auth));
  }

  if (req.method === "GET" && pathname === "/api/user/volunteer/records") {
    const volunteer = ensureUserVolunteer(db);
    return ok(res, {
      sourceEndpoint: "/api/user/volunteer/records",
      records: volunteer.records.map(normalizeVolunteerRecord),
      page: userVolunteerForApi(db, auth),
    });
  }

  if (req.method === "POST" && pathname === "/api/user/volunteer/help-requests") {
    const { requestItem, demand } = createVolunteerHelpRequest(db, auth, body);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "volunteer",
      action: "发布志愿求助需求",
      target: demand.id,
      result: `${demand.title}求助需求已提交`,
      payload: { requestId: requestItem.id, demandId: demand.id, source: body.source || "volunteer" },
    });
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: "/api/user/volunteer/help-requests",
      request: requestItem,
      demand: normalizeVolunteerDemand(demand, ensureUserVolunteer(db)),
      action,
      page: userVolunteerForApi(db, auth),
    });
  }

  if (req.method === "POST" && pathname === "/api/user/volunteer/applications") {
    const { requestItem, record } = createVolunteerApplication(db, auth, body);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "volunteer",
      action: "成为志愿者",
      target: requestItem.id,
      result: `${requestItem.requestNo}已提交审核`,
      payload: { requestId: requestItem.id, source: body.source || "volunteer" },
    });
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: "/api/user/volunteer/applications",
      request: requestItem,
      record: normalizeVolunteerRecord(record),
      action,
      page: userVolunteerForApi(db, auth),
    });
  }

  const volunteerDemandRespond = pathname.match(/^\/api\/user\/volunteer\/demands\/([^/]+)\/respond$/);
  if (req.method === "POST" && volunteerDemandRespond) {
    const demandId = decodeURIComponent(volunteerDemandRespond[1]);
    const result = respondVolunteerDemand(db, auth, demandId, body);
    if (!result) return fail(res, 404, "Volunteer demand not found");
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: `/api/user/volunteer/demands/${encodeURIComponent(demandId)}/respond`,
      ...result,
      page: userVolunteerForApi(db, auth),
    });
  }

  const volunteerTeamContact = pathname.match(/^\/api\/user\/volunteer\/teams\/([^/]+)\/contact$/);
  if (req.method === "POST" && volunteerTeamContact) {
    const teamId = decodeURIComponent(volunteerTeamContact[1]);
    const result = contactVolunteerTeam(db, auth, teamId, body);
    if (!result) return fail(res, 404, "Volunteer team not found");
    await writeDb(db);
    return ok(res, {
      sourceEndpoint: `/api/user/volunteer/teams/${encodeURIComponent(teamId)}/contact`,
      team: result.team,
      request: result.requestItem,
      action: result.action,
      page: userVolunteerForApi(db, auth),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/community") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userCommunityForApi(db, auth, {
      filter: url.searchParams.get("filter"),
    }));
  }

  if (req.method === "POST" && pathname === "/api/user/community/draft") {
    const community = ensureUserCommunity(db);
    const user = userForAuth(db, auth);
    const group = findCommunityGroup(db, body.groupId) || community.groups.find((item) => item.title === body.group) || community.groups[0];
    const draft = {
      groupId: group?.id || "",
      group: group?.title || body.group || "湖泉晨练群",
      content: String(body.content || "").slice(0, 240),
      imageAdded: Boolean(body.imageAdded),
      publicVisible: body.publicVisible !== false,
      syncFamily: Boolean(body.syncFamily),
      allowComments: body.allowComments !== false,
      savedAt: now(),
      source: body.source || "community",
    };
    community.drafts[user.id] = draft;
    audit(db, actorName(auth, user.nickname), "保存社区动态草稿", draft.group);
    await writeDb(db);
    return ok(res, { draft, page: userCommunityForApi(db, auth, { filter: body.filter }) });
  }

  const userCommunityJoin = pathname.match(/^\/api\/user\/community\/groups\/([^/]+)\/join$/);
  if (req.method === "POST" && userCommunityJoin) {
    const groupId = decodeURIComponent(userCommunityJoin[1]);
    const group = findCommunityGroup(db, groupId);
    if (!group) return fail(res, 404, "Community group not found");
    const user = userForAuth(db, auth);
    group.joinedBy = Array.isArray(group.joinedBy) ? group.joinedBy : [];
    if (!group.joinedBy.includes(user.id)) {
      group.joinedBy.push(user.id);
      group.memberCount = Number(group.memberCount || 0) + 1;
      addMessage(db, "user", "已加入社群", `您已加入「${group.title}」，可以查看动态并参与交流。`, {
        scenario: "社群交流",
        priority: "P1",
        relatedType: "communityGroup",
        relatedId: group.id,
      });
      addMessage(db, "admin", "用户加入社群", `${user.nickname || db.elderProfile?.name || "用户"}加入「${group.title}」。`, {
        scenario: "社群交流",
        priority: "P2",
        relatedType: "communityGroup",
        relatedId: group.id,
      });
    }
    audit(db, actorName(auth, user.nickname), "加入社群", group.title);
    await writeDb(db);
    return ok(res, {
      group: normalizeCommunityGroupForApi(group, user.id),
      page: userCommunityForApi(db, auth, { filter: body.filter }),
    });
  }

  if (req.method === "POST" && pathname === "/api/user/community/posts") {
    const community = ensureUserCommunity(db);
    const user = userForAuth(db, auth);
    const content = String(body.content || "").trim().slice(0, 240);
    if (!content) return fail(res, 400, "动态内容不能为空");
    const group = findCommunityGroup(db, body.groupId) || community.groups.find((item) => item.title === body.group) || community.groups[0];
    const post = {
      id: nextId(db, "communityPost", "community-post"),
      authorId: user.id,
      author: user.nickname || db.elderProfile?.name || "我",
      avatar: user.avatar || "/user/assets/avatar-user.jpg",
      groupId: group?.id || "",
      groupName: group?.title || body.group || "旅居社群",
      badge: "刚刚发布",
      pin: "",
      content,
      images: body.imageAdded ? ["community-feed-lake-ref.png"] : [],
      tags: Array.from(new Set(["推荐", ...(Array.isArray(group?.tags) ? group.tags : [])])),
      likesCount: 0,
      likedBy: [],
      allowComments: body.allowComments !== false,
      publicVisible: body.publicVisible !== false,
      syncFamily: Boolean(body.syncFamily),
      comments: [],
      createdAt: now(),
    };
    community.posts.unshift(post);
    community.drafts[user.id] = {
      groupId: group?.id || "",
      group: group?.title || body.group || "旅居社群",
      content: "",
      imageAdded: false,
      publicVisible: true,
      syncFamily: false,
      allowComments: true,
      savedAt: now(),
    };
    addMessage(db, "admin", "用户发布社群动态", `${post.author}在「${post.groupName}」发布了新动态。`, {
      scenario: "社群交流",
      priority: "P2",
      relatedType: "communityPost",
      relatedId: post.id,
    });
    if (post.syncFamily) {
      addMessage(db, "family", "家属同步动态", `${post.author}发布了旅居动态：${post.content}`, {
        scenario: "社群动态",
        priority: "P2",
        relatedType: "communityPost",
        relatedId: post.id,
      });
    }
    audit(db, actorName(auth, post.author), "发布社区动态", post.id);
    await writeDb(db);
    return ok(res, {
      post: normalizeCommunityPostForApi(post, user.id),
      page: userCommunityForApi(db, auth, { filter: body.filter }),
    });
  }

  const userCommunityLike = pathname.match(/^\/api\/user\/community\/posts\/([^/]+)\/like$/);
  if (req.method === "POST" && userCommunityLike) {
    const postId = decodeURIComponent(userCommunityLike[1]);
    const post = findCommunityPost(db, postId);
    if (!post) return fail(res, 404, "Community post not found");
    const user = userForAuth(db, auth);
    post.likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
    const alreadyLiked = post.likedBy.includes(user.id);
    const nextLiked = typeof body.liked === "boolean" ? body.liked : !alreadyLiked;
    if (nextLiked && !alreadyLiked) {
      post.likedBy.push(user.id);
      post.likesCount = Number(post.likesCount || 0) + 1;
    }
    if (!nextLiked && alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== user.id);
      post.likesCount = Math.max(0, Number(post.likesCount || 0) - 1);
    }
    audit(db, actorName(auth, user.nickname), nextLiked ? "点赞社区动态" : "取消点赞社区动态", post.id);
    await writeDb(db);
    return ok(res, {
      post: normalizeCommunityPostForApi(post, user.id),
      page: userCommunityForApi(db, auth, { filter: body.filter }),
    });
  }

  const userCommunityComment = pathname.match(/^\/api\/user\/community\/posts\/([^/]+)\/comments$/);
  if (req.method === "POST" && userCommunityComment) {
    const postId = decodeURIComponent(userCommunityComment[1]);
    const post = findCommunityPost(db, postId);
    if (!post) return fail(res, 404, "Community post not found");
    if (post.allowComments === false) return fail(res, 403, "该动态已关闭评论");
    const user = userForAuth(db, auth);
    const content = String(body.content || "").trim().slice(0, 200);
    if (!content) return fail(res, 400, "评论内容不能为空");
    const comment = {
      id: nextId(db, "communityComment", "community-comment"),
      authorId: user.id,
      author: user.nickname || db.elderProfile?.name || "我",
      avatar: user.avatar || "/user/assets/avatar-user.jpg",
      content,
      createdAt: now(),
    };
    post.comments = Array.isArray(post.comments) ? post.comments : [];
    post.comments.push(comment);
    addMessage(db, "user", "社群动态收到评论", `${comment.author}评论了「${post.groupName}」中的动态。`, {
      scenario: "社群交流",
      priority: "P2",
      relatedType: "communityPost",
      relatedId: post.id,
    });
    audit(db, actorName(auth, comment.author), "评论社区动态", post.id);
    await writeDb(db);
    return ok(res, {
      comment: normalizeCommunityCommentForApi(comment),
      post: normalizeCommunityPostForApi(post, user.id),
      page: userCommunityForApi(db, auth, { filter: body.filter }),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/device-management") {
    return ok(res, userDeviceManagementForApi(db, auth));
  }

  if (req.method === "GET" && pathname === "/api/user/orders") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userOrdersPageForApi(db, auth, {
      status: url.searchParams.get("status"),
      providerType: url.searchParams.get("providerType"),
      q: url.searchParams.get("q"),
    }));
  }

  if (req.method === "GET" && pathname === "/api/user/activity-records") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userActivityRecordsPageForApi(db, auth, {
      status: url.searchParams.get("status"),
    }));
  }

  if (req.method === "GET" && pathname === "/api/user/destinations") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userDestinationsForApi(db, auth, {
      tag: url.searchParams.get("tag"),
      q: url.searchParams.get("q"),
    }));
  }

  const userDestinationDetail = pathname.match(/^\/api\/user\/destinations\/([^/]+)$/);
  if (req.method === "GET" && userDestinationDetail) {
    const destinationId = decodeURIComponent(userDestinationDetail[1]);
    const found = findUserDestination(db, auth, destinationId);
    if (!found) return fail(res, 404, "Destination not found");
    return ok(res, {
      sourceEndpoint: "/api/user/destinations",
      destination: found.destination,
      relatedActivities: (db.activities || []).slice(0, 3).map((activity) => ({
        id: activity.id,
        title: activity.title,
        time: activity.time,
        location: activity.location || activity.place || found.destination.city,
        status: activity.status || "报名中",
        endpoint: `/api/activities/${encodeURIComponent(activity.id)}`,
      })),
      endpoints: {
        list: "/api/user/destinations",
        favorite: found.destination.favoriteEndpoint,
        consult: found.destination.consultEndpoint,
      },
    });
  }

  const userDestinationView = pathname.match(/^\/api\/user\/destinations\/([^/]+)\/view$/);
  if (req.method === "POST" && userDestinationView) {
    const destinationId = decodeURIComponent(userDestinationView[1]);
    const found = findUserDestination(db, auth, destinationId);
    if (!found) return fail(res, 404, "Destination not found");
    if (!found.state.viewedIds.includes(destinationId)) found.state.viewedIds.push(destinationId);
    found.state.updatedAt = now();
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "destinations",
      action: "查看目的地详情",
      target: destinationId,
      result: `${found.raw.title}详情已展示`,
      payload: { destinationId, title: found.raw.title, source: body.source || "destinations" },
    });
    await writeDb(db);
    return ok(res, {
      destination: destinationForApi(found.raw, found.state),
      action,
    });
  }

  const userDestinationFavorite = pathname.match(/^\/api\/user\/destinations\/([^/]+)\/favorite$/);
  if (req.method === "POST" && userDestinationFavorite) {
    const destinationId = decodeURIComponent(userDestinationFavorite[1]);
    const found = findUserDestination(db, auth, destinationId);
    if (!found) return fail(res, 404, "Destination not found");
    const nextFavorite = typeof body.favorite === "boolean" ? body.favorite : !found.state.favoriteIds.includes(destinationId);
    found.state.favoriteIds = nextFavorite
      ? [...new Set([...found.state.favoriteIds, destinationId])]
      : found.state.favoriteIds.filter((id) => id !== destinationId);
    found.state.updatedAt = now();
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "destinations",
      action: nextFavorite ? "收藏目的地" : "取消收藏目的地",
      target: destinationId,
      result: nextFavorite ? `${found.raw.title}已加入收藏` : `${found.raw.title}已取消收藏`,
      payload: { destinationId, title: found.raw.title, favorite: nextFavorite, source: body.source || "destinations" },
    });
    await writeDb(db);
    return ok(res, {
      destination: destinationForApi(found.raw, found.state),
      favorite: nextFavorite,
      action,
      page: userDestinationsForApi(db, auth, {}),
    });
  }

  const userDestinationConsult = pathname.match(/^\/api\/user\/destinations\/([^/]+)\/consult$/);
  if (req.method === "POST" && userDestinationConsult) {
    const destinationId = decodeURIComponent(userDestinationConsult[1]);
    const found = findUserDestination(db, auth, destinationId);
    if (!found) return fail(res, 404, "Destination not found");
    const requestItem = createDestinationConsultRequest(db, auth, found.raw, body);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "destinations",
      action: "目的地咨询",
      target: destinationId,
      result: `${found.raw.title}咨询已提交`,
      payload: { destinationId, requestId: requestItem.id, question: body.question || "", source: body.source || "destinations" },
    });
    audit(db, actorName(auth, requestItem.elderName), "目的地咨询", `${found.raw.id}/${requestItem.requestNo}`);
    await writeDb(db);
    return ok(res, {
      destination: destinationForApi(found.raw, found.state),
      request: requestItem,
      action,
      page: userDestinationsForApi(db, auth, {}),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/service-records") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userServiceRecordsPageForApi(db, auth, {
      type: url.searchParams.get("type"),
      month: url.searchParams.get("month"),
      q: url.searchParams.get("q"),
    }));
  }

  if (req.method === "POST" && pathname === "/api/user/service-records/clear") {
    const { user, state, rawRecords } = rawUserServiceRecords(db, auth);
    const ids = new Set(state.hiddenIds);
    rawRecords.forEach((record) => ids.add(record.id));
    state.hiddenIds = [...ids];
    state.clearedAt = now();
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "service-records",
      action: "清空服务记录",
      target: user.id,
      result: `已清空 ${rawRecords.length} 条服务记录`,
      payload: { count: rawRecords.length, source: body.source || "user-service-records" },
    });
    await writeDb(db);
    return ok(res, {
      ...userServiceRecordsPageForApi(db, auth, {}),
      action,
    });
  }

  const userServiceRecordDetail = pathname.match(/^\/api\/user\/service-records\/([^/]+)\/detail$/);
  if (req.method === "POST" && userServiceRecordDetail) {
    const recordId = decodeURIComponent(userServiceRecordDetail[1]);
    const found = findUserServiceRecord(db, auth, recordId);
    if (!found) return fail(res, 404, "Service record not found");
    if (!found.state.readIds.includes(recordId)) found.state.readIds.push(recordId);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "service-records",
      action: "查看服务记录详情",
      target: recordId,
      result: "服务记录详情已展示",
      payload: { sourceType: found.record.sourceType, sourceId: found.record.sourceId, source: body.source || "user-service-records" },
    });
    await writeDb(db);
    return ok(res, {
      record: { ...found.record, read: true },
      action,
    });
  }

  const userServiceRecordDelete = pathname.match(/^\/api\/user\/service-records\/([^/]+)$/);
  if (req.method === "DELETE" && userServiceRecordDelete) {
    const recordId = decodeURIComponent(userServiceRecordDelete[1]);
    const found = findUserServiceRecord(db, auth, recordId);
    if (!found) return fail(res, 404, "Service record not found");
    if (!found.state.hiddenIds.includes(recordId)) found.state.hiddenIds.push(recordId);
    found.state.updatedAt = now();
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "service-records",
      action: "删除服务记录",
      target: recordId,
      result: "服务记录已删除",
      payload: { sourceType: found.record.sourceType, sourceId: found.record.sourceId },
    });
    await writeDb(db);
    return ok(res, {
      deletedId: recordId,
      action,
      page: userServiceRecordsPageForApi(db, auth, {}),
    });
  }

  if (req.method === "PUT" && pathname === "/api/user/family/permissions") {
    try {
      updateFamilySharingPermission(db, auth, body);
      await writeDb(db);
      const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
      const host = String(req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`).split(",")[0].trim();
      return ok(res, await familyPageForApi(db, auth, `${proto}://${host}`));
    } catch (error) {
      return fail(res, 400, error.message);
    }
  }

  if (req.method === "POST" && pathname === "/api/user/family/invitations") {
    const name = String(body.name || "").trim().slice(0, 40);
    const relation = String(body.relation || "家属").trim().slice(0, 20);
    const phone = String(body.phone || "").trim();
    const channel = body.channel === "qr" ? "qr" : "phone";
    if (!name || !/^1\d{10}$/.test(phone)) return fail(res, 400, "请填写家属姓名和 11 位手机号");
    db.familyInvitations = Array.isArray(db.familyInvitations) ? db.familyInvitations : [];
    let invitation = db.familyInvitations.find((item) => item.phone === phone && item.status === "待家属确认");
    if (invitation) {
      invitation.name = name;
      invitation.relation = relation;
      invitation.channel = channel;
      invitation.createdAt = now();
      invitation.expiresAt = familyInviteExpiry();
    } else {
      invitation = {
        id: nextId(db, "familyInvitation", "family-invite"),
        elderId: db.elderProfile?.id || "",
        inviterUserId: userForAuth(db, auth).id,
        name,
        relation,
        phone,
        channel,
        inviteCode: crypto.randomBytes(6).toString("hex").toUpperCase(),
        status: "待家属确认",
        createdAt: now(),
        expiresAt: familyInviteExpiry(),
      };
      db.familyInvitations.push(invitation);
    }
    audit(db, actorName(auth, db.elderProfile?.name), "创建家属绑定邀请", `${relation}/${name}/${channel}`);
    await writeDb(db);
    const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`).split(",")[0].trim();
    const requestOrigin = `${proto}://${host}`;
    return ok(res, {
      invitation: await familyInvitationForApi(invitation, requestOrigin),
      page: await familyPageForApi(db, auth, requestOrigin),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/guide-page") {
    return ok(res, userGuidePageForApi(db, auth));
  }

  if (req.method === "PUT" && pathname === "/api/user/personal") {
    try {
      const currentPhone = body.user?.phone ?? body.phone;
      if (currentPhone !== undefined && !/^1\d{10}$/.test(String(currentPhone).trim())) return fail(res, 400, "请输入正确的手机号");
      updateUserPersonal(db, auth, body);
    } catch (error) {
      return fail(res, 400, error.message || "个人资料参数无效");
    }
    const targetUser = userForAuth(db, auth);
    audit(db, actorName(auth, targetUser.nickname), body.authorizations ? "更新个人授权" : "更新个人资料", targetUser.id);
    await writeDb(db);
    const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`).split(",")[0].trim();
    return ok(res, await userPersonalForApi(db, auth, `${proto}://${host}`));
  }

  if (req.method === "GET" && pathname === "/api/user/profile") {
    return ok(res, { user: userForAuth(db, auth), elderProfile: db.elderProfile, familyContacts: db.familyContacts });
  }

  if (req.method === "GET" && pathname === "/api/user/profile-center") {
    return ok(res, userProfileCenterForApi(db, auth));
  }

  if (req.method === "GET" && pathname === "/api/user/functions/overview") {
    return ok(res, {
      ...userFunctionOverviewForApi(db),
      validation: validateUserFunctionOverview(),
      related: {
        home: "/api/user/home",
        profileCenter: "/api/user/profile-center",
        homeRequirements: "/api/user/home-requirements",
        aiSteward: "/api/ai/steward-requirements",
        activityMap: "/api/activities/map-requirements",
        emergencyHelp: "/api/alerts/emergency-requirements",
        smartDevice: "/api/devices/robot-requirements",
        guideOrder: "/api/guide/order-requirements",
        orders: "/api/orders",
        messages: "/api/messages?role=user",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/user/home-requirements") {
    return ok(res, {
      ...userHomeRequirementsForApi(db),
      validation: validateUserHomeRequirements(),
      related: {
        home: "/api/user/home",
        messages: "/api/messages?role=user",
        switchCity: "/api/user/home-city",
        adminContent: "/api/admin/content/home",
        adminActivities: "/api/admin/activities",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/user/home") {
    return ok(res, computeUserHome(db));
  }

  if (req.method === "POST" && pathname === "/api/user/home-city") {
    const result = switchHomeCity(db, body.city || body.currentCity || body.name);
    audit(db, actorName(auth, db.users[0].nickname), "切换首页城市", result.currentCity);
    addMessage(db, "user", "当前城市已更新", `首页当前城市已更新为 ${result.currentCity}。`);
    await writeDb(db);
    return ok(res, result);
  }

  if (req.method === "PUT" && pathname === "/api/user/profile") {
    const targetUser = userForAuth(db, auth);
    const updates = { ...(body.user || body) };
    delete updates.id;
    delete updates.role;
    Object.assign(targetUser, updates);
    if (body.elderProfile && typeof body.elderProfile === "object") Object.assign(db.elderProfile, body.elderProfile);
    audit(db, actorName(auth, targetUser.nickname), "更新用户资料", targetUser.id);
    await writeDb(db);
    return ok(res, targetUser);
  }

  if (req.method === "GET" && pathname === "/api/elder/profile") {
    return ok(res, db.elderProfile);
  }

  if (req.method === "PUT" && pathname === "/api/elder/profile") {
    Object.assign(db.elderProfile, body);
    audit(db, "平台管理员", "更新老人档案", db.elderProfile.id);
    await writeDb(db);
    return ok(res, db.elderProfile);
  }

  if (req.method === "GET" && pathname === "/api/activities") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const category = url.searchParams.get("category");
    const userId = auth?.sub || "user-001";
    const activities = publicUserActivities(db);
    const source = category && category !== "全部" ? activities.filter((item) => item.category === category) : activities;
    return ok(res, source.map((activity) => normalizeActivityMapPoint(db, activity, { userId })));
  }

  if (req.method === "GET" && pathname === "/api/activities/map-requirements") {
    const publicDb = publicUserActivityDb(db);
    return ok(res, {
      ...activityMapRequirementsForApi(publicDb, { userId: auth?.sub || "user-001" }),
      validation: validateActivityMapRequirements(),
      related: {
        activities: "/api/activities",
        map: "/api/activities/map",
        detail: "/api/activities/{id}",
        join: "/api/activities/{id}/join",
        cancel: "/api/activities/{id}/cancel",
        messages: "/api/messages",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/activities/map") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const category = url.searchParams.get("category");
    const payload = activityMapRequirementsForApi(publicUserActivityDb(db), { userId: auth?.sub || "user-001" });
    const points = category && category !== "全部"
      ? payload.points.filter((item) => item.category === category)
      : payload.points;
    return ok(res, points);
  }

  const activityDetail = pathname.match(/^\/api\/activities\/([^/]+)$/);
  if (req.method === "GET" && activityDetail) {
    const activity = db.activities.find((item) => item.id === activityDetail[1]);
    if (!activity) return fail(res, 404, "Activity not found");
    const userId = auth?.sub || "user-001";
    const point = normalizeActivityMapPoint(db, activity, { userId });
    const participants = db.activitySignups
      .filter((item) => item.activityId === activity.id && item.status !== "已取消")
      .map((item) => ({
        id: item.id,
        elderName: item.elderName,
        gender: item.gender || "",
        age: item.age || "",
        phone: item.phone,
        count: Number(item.count || 1),
        status: item.status,
        createdAt: item.createdAt,
      }));
    return ok(res, {
      ...point,
      participants,
      participantsPreview: participants.slice(0, 5),
      canJoin: point.status === "报名中" && point.availableSlots > 0,
      canCancel: point.userJoined,
    });
  }

  if (req.method === "GET" && pathname === "/api/service-requests") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const role = url.searchParams.get("role");
    const status = url.searchParams.get("status");
    const route = url.searchParams.get("route");
    let data = db.serviceRequests;
    if (role) data = data.filter((item) => item.role === role || item.role === messageRole(role));
    if (status) data = data.filter((item) => item.status === status);
    if (route) data = data.filter((item) => item.route === route);
    return ok(res, data);
  }

  if (req.method === "POST" && pathname === "/api/service-requests") {
    const role = messageRole(body.role || auth?.role || "user");
    const requestItem = {
      id: nextId(db, "serviceRequest", "req"),
      requestNo: nextNo(db, "serviceRequestNo", "REQ"),
      role,
      userId: auth?.sub || body.userId || "user-001",
      elderName: body.elderName || db.elderProfile.name,
      route: body.route || "",
      action: body.action || "服务请求",
      type: body.type || body.serviceType || "综合服务",
      providerType: body.providerType || "",
      status: "待处理",
      priority: body.priority || "P1",
      description: body.description || "",
      payload: body.payload || {},
      createdAt: now(),
      handledBy: "",
    };
    db.serviceRequests.unshift(requestItem);
    addMessage(db, "admin", "新的服务请求", `${requestItem.elderName}提交了「${requestItem.type}」：${requestItem.action}`);
    addMessage(db, "user", "服务请求已提交", `您的「${requestItem.type}」请求已进入后台处理。`);
    audit(db, actorName(auth, requestItem.elderName), "创建服务请求", `${requestItem.requestNo}/${requestItem.type}`);
    await writeDb(db);
    return ok(res, requestItem);
  }

  const serviceRequestHandle = pathname.match(/^\/api\/service-requests\/([^/]+)\/handle$/);
  if (req.method === "POST" && serviceRequestHandle) {
    const requestItem = db.serviceRequests.find((item) => item.id === serviceRequestHandle[1] || item.requestNo === serviceRequestHandle[1]);
    if (!requestItem) return fail(res, 404, "Service request not found");
    requestItem.status = body.status || "已处理";
    requestItem.result = body.result || "后台已完成处理并同步用户。";
    requestItem.handledBy = body.handledBy || actorName(auth, "平台管理员");
    requestItem.handledAt = now();
    addMessage(db, requestItem.role || "user", "服务请求已处理", `${requestItem.type}：${requestItem.result}`);
    audit(db, requestItem.handledBy, "处理服务请求", requestItem.requestNo);
    await writeDb(db);
    return ok(res, requestItem);
  }

  if (req.method === "GET" && pathname === "/api/services") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const providerType = url.searchParams.get("providerType");
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    let data = db.services;
    if (providerType) data = data.filter((item) => item.providerType === providerType);
    if (status) data = data.filter((item) => item.status === status);
    if (category) data = data.filter((item) => item.category === category);
    return ok(res, data);
  }

  if (req.method === "GET" && pathname === "/api/guides") {
    return ok(res, db.guides);
  }

  if (req.method === "GET" && pathname === "/api/merchants") {
    return ok(res, db.merchants);
  }

  const activityJoin = pathname.match(/^\/api\/activities\/([^/]+)\/join$/);
  if (req.method === "POST" && activityJoin) {
    const activity = db.activities.find((item) => item.id === activityJoin[1]);
    if (!activity) return fail(res, 404, "Activity not found");
    const userId = auth?.sub || "user-001";
    const requestedCount = Math.max(1, Number(body.count || 1));
    const existingSignup = db.activitySignups.find((item) => item.activityId === activity.id && item.userId === userId && item.status !== "已取消");
    const signupGender = String(body.gender || existingSignup?.gender || db.elderProfile.gender || "").trim();
    const rawAge = Number(body.age || existingSignup?.age || db.elderProfile.age || 0);
    const signupAge = Number.isFinite(rawAge) && rawAge > 0 ? Math.round(rawAge) : "";
    const currentJoined = Number(activity.joined || 0);
    if (existingSignup) {
      const previousCount = Number(existingSignup.count || 1);
      const delta = requestedCount - previousCount;
      if (currentJoined + delta > Number(activity.quota || 0)) return fail(res, 409, "活动剩余名额不足");
      existingSignup.elderName = body.name || existingSignup.elderName || db.elderProfile.name;
      existingSignup.gender = signupGender;
      existingSignup.age = signupAge;
      existingSignup.phone = body.phone || existingSignup.phone || db.users[0]?.phone || "";
      existingSignup.count = requestedCount;
      existingSignup.note = body.note || existingSignup.note || "";
      existingSignup.updatedAt = now();
      activity.joined = Math.max(0, currentJoined + delta);
      activity.lastSignupAt = now();
      addMessage(db, "user", "活动报名已更新", `您已更新「${activity.title}」报名信息，当前报名 ${requestedCount} 人。`, {
        scenario: "活动报名",
        relatedType: "activity",
        relatedId: activity.id,
      });
      audit(db, actorName(auth, db.users[0].nickname), "更新活动报名", activity.title);
      await writeDb(db);
      return ok(res, {
        activity: normalizeActivityMapPoint(db, activity, { userId }),
        signup: existingSignup,
        duplicate: true,
      });
    }
    if (currentJoined + requestedCount > Number(activity.quota || 0)) return fail(res, 409, "活动名额已满");
    activity.joined = currentJoined + requestedCount;
    activity.lastSignupAt = now();
    const signup = {
      id: nextId(db, "activitySignup", "signup"),
      activityId: activity.id,
      activityTitle: activity.title,
      userId,
      elderName: body.name || db.elderProfile.name,
      gender: signupGender,
      age: signupAge,
      phone: body.phone || db.users[0]?.phone || "",
      count: requestedCount,
      note: body.note || "",
      status: "已报名",
      createdAt: now(),
    };
    db.activitySignups.unshift(signup);
    addMessage(db, "user", "活动报名成功", `您已报名「${activity.title}」，请按时到达 ${activity.location}。`, {
      scenario: "活动报名",
      relatedType: "activity",
      relatedId: activity.id,
    });
    addMessage(db, "admin", "新增活动报名", `${db.elderProfile.name} 报名了「${activity.title}」。`, {
      scenario: "活动报名",
      relatedType: "activity",
      relatedId: activity.id,
    });
    audit(db, actorName(auth, db.users[0].nickname), "活动报名", activity.title);
    await writeDb(db);
    return ok(res, { activity: normalizeActivityMapPoint(db, activity, { userId }), signup });
  }

  const activityCancel = pathname.match(/^\/api\/activities\/([^/]+)\/cancel$/);
  if (req.method === "POST" && activityCancel) {
    const activity = db.activities.find((item) => item.id === activityCancel[1]);
    if (!activity) return fail(res, 404, "Activity not found");
    const userId = auth?.sub || "user-001";
    const signup = db.activitySignups.find((item) => {
      if (body.signupId && item.id !== body.signupId) return false;
      return item.activityId === activity.id && item.userId === userId && item.status !== "已取消";
    });
    if (!signup) return fail(res, 404, "Activity signup not found");
    signup.status = "已取消";
    signup.cancelReason = body.reason || "用户主动取消报名";
    signup.canceledAt = now();
    activity.joined = Math.max(0, Number(activity.joined || 0) - Number(signup.count || 1));
    activity.lastSignupAt = now();
    addMessage(db, "user", "活动报名已取消", `您已取消「${activity.title}」报名，当前活动人数已同步更新。`, {
      scenario: "活动报名取消",
      relatedType: "activity",
      relatedId: activity.id,
    });
    addMessage(db, "admin", "活动报名取消", `${signup.elderName || db.elderProfile.name} 取消了「${activity.title}」报名。`, {
      scenario: "活动报名取消",
      relatedType: "activity",
      relatedId: activity.id,
    });
    audit(db, actorName(auth, db.users[0].nickname), "取消活动报名", activity.title);
    await writeDb(db);
    return ok(res, { activity: normalizeActivityMapPoint(db, activity, { userId }), signup });
  }

  if (req.method === "GET" && pathname === "/api/ai/steward-requirements") {
    return ok(res, {
      ...aiStewardRequirementsForApi(db),
      validation: validateAiStewardRequirements(),
      related: {
        chat: "/api/ai/chat",
        history: "/api/ai/history",
        quickQuestions: "/api/ai/quick-questions",
        voiceTranscribe: "/api/ai/voice/transcribe",
        recommendations: "/api/ai/recommendations",
        serviceRecords: "/api/ai/service-records",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/ai/quick-questions") {
    return ok(res, quickQuestions);
  }

  if (req.method === "POST" && pathname === "/api/ai/chat") {
    const startedAt = Date.now();
    const result = await answerForWithDeepSeek(body.question, db);
    const chat = {
      id: nextId(db, "chat", "chat"),
      userId: body.userId || "user-001",
      question: body.question || "",
      answer: result.answer,
      intent: result.intent,
      recommendations: result.recommendations || [],
      responseTimeMs: Math.max(result.responseTimeMs || 0, Date.now() - startedAt),
      friendlyTone: result.friendlyTone !== false,
      provider: result.provider,
      model: result.model || "",
      llmError: result.llmError || "",
      source: body.source || "text",
      createdAt: now(),
    };
    db.aiHistory.unshift(chat);
    audit(db, actorName(auth, db.users[0].nickname), "AI问答", result.intent);
    await writeDb(db);
    return ok(res, chat);
  }

  const quickQuestionAsk = pathname.match(/^\/api\/ai\/quick-questions\/([^/]+)\/ask$/);
  if (req.method === "POST" && quickQuestionAsk) {
    const quickQuestion = quickQuestions.find((item) => item.id === quickQuestionAsk[1]);
    if (!quickQuestion) return fail(res, 404, "Quick question not found");
    const startedAt = Date.now();
    const result = await answerForWithDeepSeek(quickQuestion.question, db);
    const chat = {
      id: nextId(db, "chat", "chat"),
      userId: body.userId || auth?.sub || "user-001",
      question: quickQuestion.question,
      answer: result.answer,
      intent: result.intent,
      recommendations: result.recommendations || [],
      responseTimeMs: Math.max(result.responseTimeMs || 0, Date.now() - startedAt),
      friendlyTone: result.friendlyTone !== false,
      provider: result.provider,
      model: result.model || "",
      llmError: result.llmError || "",
      source: "quickQuestion",
      quickQuestionId: quickQuestion.id,
      createdAt: now(),
    };
    db.aiHistory.unshift(chat);
    audit(db, actorName(auth, db.users[0].nickname), "AI快捷问题", quickQuestion.title);
    await writeDb(db);
    return ok(res, { quickQuestion, chat });
  }

  if (req.method === "POST" && pathname === "/api/ai/voice/transcribe") {
    const transcription = normalizeVoiceTranscript(body);
    if (!transcription.transcript) {
      return fail(res, 400, "H5页面当前浏览器无法识别语音，请重新按住说话");
    }
    const startedAt = Date.now();
    const result = await answerForWithDeepSeek(transcription.transcript, db);
    const chat = {
      id: nextId(db, "chat", "chat"),
      userId: body.userId || auth?.sub || "user-001",
      question: transcription.transcript,
      answer: result.answer,
      intent: result.intent,
      recommendations: result.recommendations || [],
      responseTimeMs: Math.max(result.responseTimeMs || 0, Date.now() - startedAt),
      friendlyTone: result.friendlyTone !== false,
      provider: result.provider,
      model: result.model || "",
      llmError: result.llmError || "",
      source: "voice",
      voiceSource: transcription.source,
      createdAt: now(),
    };
    db.aiHistory.unshift(chat);
    audit(db, actorName(auth, db.users[0].nickname), "AI语音识别", transcription.source);
    await writeDb(db);
    return ok(res, {
      transcript: transcription.transcript,
      source: transcription.source,
      label: transcription.label || "语音识别",
      chat,
    });
  }

  if (req.method === "GET" && pathname === "/api/ai/recommendations") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const intent = url.searchParams.get("intent") || "general";
    return ok(res, {
      intent,
      recommendations: serviceRecommendationsForIntent(intent, db),
    });
  }

  if (req.method === "GET" && pathname === "/api/ai/history") {
    return ok(res, db.aiHistory.slice(0, 20));
  }

  if (req.method === "GET" && pathname === "/api/ai/service-records") {
    const history = db.aiHistory.slice(0, 20);
    const consultationRequests = db.serviceRequests
      .filter((item) => /AI|智能管家|咨询|推荐/.test(`${item.action}${item.type}${item.description}`))
      .slice(0, 10);
    return ok(res, {
      conversations: history,
      consultationRequests,
      summary: {
        totalConversations: db.aiHistory.length,
        voiceRecords: db.aiHistory.filter((item) => item.source === "voice").length,
        quickQuestionRecords: db.aiHistory.filter((item) => item.source === "quickQuestion").length,
        recommendationRecords: db.aiHistory.filter((item) => (item.recommendations || []).length).length,
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/reviews") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const orderId = url.searchParams.get("orderId");
    const providerType = url.searchParams.get("providerType");
    let data = db.reviews;
    if (orderId) data = data.filter((item) => item.orderId === orderId || item.orderNo === orderId);
    if (providerType) data = data.filter((item) => item.providerType === providerType);
    return ok(res, data);
  }

  if (req.method === "GET" && pathname === "/api/orders") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const status = url.searchParams.get("status");
    const providerType = url.searchParams.get("providerType");
    let data = db.orders;
    if (status) data = data.filter((item) => item.status === status);
    if (providerType) data = data.filter((item) => item.providerType === providerType);
    return ok(res, data);
  }

  if (req.method === "POST" && pathname === "/api/orders") {
    const serviceType = body.serviceType || "陪伴就医";
    const guideRequirement = matchGuideOrderRequirement(serviceType);
    const providerType = body.providerType || (guideRequirement ? "guide" : serviceType.includes("护理") || serviceType.includes("体检") ? "merchant" : "guide");
    const normalizedGuideOrder =
      providerType === "guide" && guideRequirement
        ? normalizeGuideOrderFields({ ...body, serviceType }, db, guideRequirement, { fillDefaults: true })
        : null;
    if (body.strictRequirements && providerType === "guide" && !guideRequirement) {
      return fail(res, 400, "该人工向导服务未纳入 4.7 下单分类，请选择陪伴就医、导游游览、护工护理、接送出行、帮办代办或生活陪伴。");
    }
    if (body.strictRequirements && normalizedGuideOrder?.missingFields.length) {
      return fail(res, 400, `请补充${normalizedGuideOrder.missingFields.map((item) => item.label).join("、")}`);
    }
    const order = {
      id: nextId(db, "order", "order"),
      orderNo: nextNo(db, "order", "DD"),
      userId: body.userId || auth?.sub || "user-001",
      elderName: body.elderName || db.elderProfile.name,
      serviceType,
      providerType,
      providerId: body.providerId || null,
      assigneeName: "",
      status: "待派单",
      amount: Number(body.amount || normalizedGuideOrder?.requirement?.defaultAmount || 120),
      time: normalizedGuideOrder ? orderTimeFromRequirement(normalizedGuideOrder, body) : body.time || now(),
      location: normalizedGuideOrder ? orderLocationFromRequirement(normalizedGuideOrder, body, db) : body.location || db.elderProfile.address,
      source: body.source || "用户端",
      note: body.note || "演示订单，等待后台派单。",
      phone: body.phone || "",
      items: Array.isArray(body.items) ? body.items : [],
      requirementCategory: normalizedGuideOrder?.requirement?.category || "",
      requirementPriority: normalizedGuideOrder?.requirement?.priority || "",
      orderFields: normalizedGuideOrder?.fields || {},
      fieldLabels: normalizedGuideOrder?.requirement?.orderFields || [],
      missingFields: normalizedGuideOrder?.missingFields || [],
      createdAt: now(),
      timeline: [],
    };
    addTimeline(order, "待派单", `${order.source}提交${serviceType}订单${order.requirementPriority ? `（${order.requirementPriority}）` : ""}`);
    db.orders.unshift(order);
    addMessage(db, "admin", "新订单待派单", `${order.elderName}提交了「${serviceType}」订单。`, {
      scenario: "用户下单",
      priority: order.requirementPriority || "P0",
      relatedType: "order",
      relatedId: order.id,
    });
    audit(db, actorName(auth, order.elderName), "创建订单", order.orderNo);
    await writeDb(db);
    return ok(res, order);
  }

  const orderMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (req.method === "GET" && orderMatch) {
    const order = db.orders.find((item) => item.id === orderMatch[1] || item.orderNo === orderMatch[1]);
    if (!order) return fail(res, 404, "Order not found");
    const review = db.reviews.find((item) => item.orderId === order.id);
    return ok(res, { ...order, reviewDetail: review || null });
  }

  const orderCancel = pathname.match(/^\/api\/orders\/([^/]+)\/cancel$/);
  if (req.method === "POST" && orderCancel) {
    const order = db.orders.find((item) => item.id === orderCancel[1] || item.orderNo === orderCancel[1]);
    if (!order) return fail(res, 404, "Order not found");
    ensureOrderTransition(order, "cancel");
    addTimeline(order, "已取消", body.reason || "用户取消订单");
    const task = db.tasks.find((item) => item.orderId === order.id);
    if (task && task.status !== "已完成" && task.status !== "已取消") {
      task.status = "已取消";
      task.updatedAt = now();
    }
    audit(db, body.actor || actorName(auth, "用户端"), "取消订单", order.orderNo);
    await writeDb(db);
    return ok(res, order);
  }

  const orderConfirm = pathname.match(/^\/api\/orders\/([^/]+)\/confirm$/);
  if (req.method === "POST" && orderConfirm) {
    const order = db.orders.find((item) => item.id === orderConfirm[1] || item.orderNo === orderConfirm[1]);
    if (!order) return fail(res, 404, "Order not found");
    ensureOrderTransition(order, "confirm");
    const rating = Number(body.rating || 5);
    const content = body.review || body.content || "服务及时细致，已确认完成。";
    order.rating = rating;
    order.review = content;
    addTimeline(order, "已完成", "用户确认服务完成并评价");
    const task = db.tasks.find((item) => item.orderId === order.id);
    if (task) {
      ensureTaskTransition(task, "userConfirm");
      task.updatedAt = now();
    }
    const existingReview = db.reviews.find((item) => item.orderId === order.id);
    const review = existingReview || {
      id: nextId(db, "review", "review"),
      orderId: order.id,
      orderNo: order.orderNo,
      userId: order.userId,
      elderName: order.elderName,
      providerType: order.providerType,
      providerId: order.providerId,
      assigneeName: order.assigneeName,
      serviceType: order.serviceType,
      createdAt: now(),
    };
    Object.assign(review, {
      rating,
      content,
      tags: Array.isArray(body.tags) ? body.tags : body.tags ? [String(body.tags)] : [],
      updatedAt: now(),
    });
    if (!existingReview) db.reviews.unshift(review);
    order.reviewId = review.id;
    addMessage(db, "admin", "订单已完成", `${order.orderNo} 已由用户确认完成。`, {
      scenario: "服务完成",
      priority: "P0",
      relatedType: "order",
      relatedId: order.id,
    });
    if (order.providerType) {
      addMessage(db, order.providerType, "用户已确认评价", `${order.elderName}已确认「${order.serviceType}」完成，评分 ${rating} 分。`, {
        scenario: "服务完成",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
    }
    audit(db, order.elderName, "确认完成", order.orderNo);
    await writeDb(db);
    return ok(res, { ...order, reviewDetail: review });
  }

  if (req.method === "GET" && pathname === "/api/tasks") {
    return ok(res, db.tasks);
  }

  if (req.method === "GET" && pathname === "/api/guide/dashboard") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, computeGuideDashboard(db, url.searchParams.get("guideId") || "guide-001", url.searchParams.get("serviceType") || url.searchParams.get("category") || ""));
  }

  if (req.method === "GET" && pathname === "/api/guide/home") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, computeGuideHome(db, url.searchParams.get("guideId") || "guide-001"));
  }

  if (req.method === "GET" && pathname === "/api/guide/mine") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, computeGuideMine(db, url.searchParams.get("guideId") || "guide-001"));
  }

  if (req.method === "GET" && pathname === "/api/guide/hall") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, computeGuideHall(db, url.searchParams.get("guideId") || "guide-001", url.searchParams.get("serviceType") || url.searchParams.get("category") || ""));
  }

  if (req.method === "GET" && pathname === "/api/guide/active-service") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, computeGuideActiveService(db, url.searchParams.get("guideId") || "guide-001"));
  }

  if (req.method === "GET" && pathname === "/api/guide/messages") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, computeGuideMessages(db, url.searchParams.get("guideId") || "guide-001"));
  }

  if (req.method === "GET" && pathname === "/api/guide/profile") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, guideProfileForApi(db, url.searchParams.get("guideId") || "guide-001"));
  }

  if (req.method === "PUT" && pathname === "/api/guide/profile") {
    const guide = getGuide(db, body.guideId || body.profile?.id || "guide-001");
    if (!guide) return fail(res, 404, "Guide not found");
    const current = ensureGuideProfile(db, guide);
    const input = body.profile && typeof body.profile === "object" ? body.profile : body;
    const editableKeys = ["name", "realName", "gender", "phone", "city", "area", "intro", "avatarUrl"];
    editableKeys.forEach((key) => {
      if (input[key] !== undefined) {
        current[key] = String(input[key] || "").trim();
      }
    });
    if (input.emergencyContact && typeof input.emergencyContact === "object") {
      current.emergencyContact = {
        ...(current.emergencyContact || {}),
        ...["name", "relation", "phone"].reduce((result, key) => {
          if (input.emergencyContact[key] !== undefined) result[key] = String(input.emergencyContact[key] || "").trim();
          return result;
        }, {}),
      };
    }
    current.name = current.name || current.realName || guide.realName || "人工向导";
    current.realName = current.name;
    current.updatedAt = now();
    guide.profile = current;
    guide.realName = current.name;
    guide.phone = current.phone;
    guide.area = current.city && current.area && !current.area.startsWith(current.city)
      ? `${current.city}${current.area}`
      : current.area || current.city || guide.area;
    guide.intro = current.intro;
    guide.avatarUrl = current.avatarUrl;
    guide.updatedAt = current.updatedAt;
    const guideUser = (db.users || []).find((item) => item.id === guide.userId);
    if (guideUser) {
      if (current.phone) guideUser.phone = current.phone;
      if (current.avatarUrl) guideUser.avatar = current.avatarUrl;
      if (current.name) guideUser.nickname = current.name;
    }
    audit(db, actorName(auth, current.name), "更新向导个人资料", guide.id);
    await writeDb(db);
    return ok(res, guideProfileForApi(db, guide.id));
  }

  if (req.method === "POST" && pathname === "/api/guide/profile/certification") {
    const guide = getGuide(db, body.guideId || "guide-001");
    if (!guide) return fail(res, 404, "Guide not found");
    const type = String(body.type || "").trim();
    const allowedTypes = new Set(["realname", "health", "agreement"]);
    if (!allowedTypes.has(type)) return fail(res, 400, "认证类型无效");
    const profile = ensureGuideProfile(db, guide);
    const previous = profile.certifications?.[type] || {};
    const submittedAt = now();
    const nextStatus = type === "agreement" ? "已签署" : "已提交复核";
    profile.certifications = {
      ...(profile.certifications || {}),
      [type]: {
        ...previous,
        status: body.status || nextStatus,
        fileName: body.fileName || previous.fileName || "",
        issuer: body.issuer || previous.issuer || (type === "health" ? "平台合作健康服务机构" : previous.issuer || ""),
        expiresAt: body.expiresAt || previous.expiresAt || (type === "health" ? "2027-05-18" : previous.expiresAt || ""),
        updatedAt: submittedAt,
      },
    };
    profile.updatedAt = submittedAt;
    guide.profile = profile;
    guide.updatedAt = submittedAt;
    audit(db, actorName(auth, profile.name), "提交向导认证材料", `${guide.id}:${type}`);
    await writeDb(db);
    return ok(res, guideProfileForApi(db, guide.id));
  }

  if (req.method === "GET" && pathname === "/api/guide/settings") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, guideSettingsForApi(db, url.searchParams.get("guideId") || "guide-001"));
  }

  if (req.method === "PUT" && pathname === "/api/guide/settings") {
    const guide = getGuide(db, body.guideId || "guide-001");
    if (!guide) return fail(res, 404, "Guide not found");
    const settings = ensureGuideSettings(guide);
    const privacyKeys = ["privacyPermission", "locationSharing", "profileVisible"];
    const notificationKeys = ["messageNotification", "orderReminder", "sound", "vibration", "push", "sms", "serviceStart"];
    if (body.privacy && typeof body.privacy === "object") {
      Object.entries(body.privacy).forEach(([key, value]) => {
        if (privacyKeys.includes(key)) settings.privacy[key] = Boolean(value);
      });
    }
    if (body.notifications && typeof body.notifications === "object") {
      Object.entries(body.notifications).forEach(([key, value]) => {
        if (notificationKeys.includes(key)) settings.notifications[key] = Boolean(value);
      });
    }
    if (body.protocolConfirmed && typeof body.protocolConfirmed === "object") {
      ["用户协议", "隐私政策", "服务规范", "服务协议"].forEach((key) => {
        if (body.protocolConfirmed[key] !== undefined) settings.protocolConfirmed[key] = Boolean(body.protocolConfirmed[key]);
      });
    }
    settings.updatedAt = now();
    guide.settings = settings;
    audit(db, actorName(auth, guide.realName), "更新向导设置", guide.id);
    await writeDb(db);
    return ok(res, guideSettingsForApi(db, guide.id));
  }

  if (req.method === "POST" && pathname === "/api/guide/session/logout") {
    const guide = getGuide(db, body.guideId || "guide-001");
    if (!guide) return fail(res, 404, "Guide not found");
    audit(db, actorName(auth, guide.realName), "向导端退出登录", guide.id);
    await writeDb(db);
    return ok(res, { guideId: guide.id, status: "已退出", sourceEndpoint: "/api/guide/session/logout" });
  }

  if (req.method === "GET" && pathname === "/api/guide/tasks") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const guideId = url.searchParams.get("guideId") || "guide-001";
    const serviceType = url.searchParams.get("serviceType") || url.searchParams.get("category") || "";
    const dashboard = computeGuideDashboard(db, guideId, serviceType);
    return ok(res, dashboard.tasks || []);
  }

  if (req.method === "GET" && pathname === "/api/guide/categories") {
    const categories = guideOrderRequirementsForApi(db).categories.map((item) => ({
      id: item.id,
      category: item.category,
      description: item.description,
      priority: item.priority,
      route: item.route,
      activeOrderCount: item.runtime?.activeOrderCount || 0,
    }));
    return ok(res, categories);
  }

  if (req.method === "GET" && pathname === "/api/provider/stats") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const role = url.searchParams.get("role");
    const providerId = url.searchParams.get("providerId") || url.searchParams.get("id");
    const aggregate = computeProviderStats(db, role, providerId);
    if (!aggregate) return fail(res, 400, "统计接口需要 role=guide 或 role=merchant");
    const { rows, ...payload } = aggregate;
    return ok(res, payload);
  }

  if (req.method === "GET" && pathname === "/api/guide/stats") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { rows, ...payload } = computeGuideStats(db, url.searchParams.get("guideId") || "guide-001");
    return ok(res, payload);
  }

  if (req.method === "GET" && pathname === "/api/guide/functions/overview") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, {
      ...guideFunctionOverviewForApi(db, url.searchParams.get("guideId") || "guide-001"),
      validation: validateGuideFunctionOverview(),
      related: {
        dashboard: "/api/guide/dashboard",
        stats: "/api/guide/stats",
        online: "/api/guide/online",
        claimNext: "/api/guide/tasks/claim-next",
        tasks: "/api/tasks",
        income: "/api/guide/income",
        exception: "/api/guide/exception",
        adminGuides: "/api/admin/guides",
        adminAlerts: "/api/admin/alerts",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/guide/order-requirements") {
    return ok(res, {
      ...guideOrderRequirementsForApi(db),
      validation: validateGuideOrderRequirements(),
      related: {
        createOrder: "/api/orders",
        pendingDispatch: "/api/admin/dispatch/pending",
        dispatch: "/api/tasks/dispatch",
        guideDashboard: "/api/guide/dashboard",
        guideFlow: "/api/guide/order-status-flow",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/guide/order-status-flow") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, {
      ...guideOrderStatusFlowForApi(db, url.searchParams.get("guideId") || "guide-001"),
      validation: validateGuideOrderStatusFlow(),
      related: {
        dashboard: "/api/guide/dashboard",
        stats: "/api/guide/stats",
        claimNext: "/api/guide/tasks/claim-next",
        accept: "/api/tasks/{id}/accept",
        start: "/api/tasks/{id}/start",
        complete: "/api/tasks/{id}/complete",
        decline: "/api/guide/tasks/{id}/decline",
        ignore: "/api/guide/tasks/{id}/ignore",
        cancel: "/api/guide/tasks/{id}/cancel",
        exception: "/api/guide/exception",
        confirm: "/api/orders/{id}/confirm",
        income: "/api/guide/income",
      },
    });
  }

  if (req.method === "POST" && pathname === "/api/guide/online") {
    const guide = getGuide(db, body.guideId || "guide-001");
    guide.onlineStatus = body.onlineStatus || (guide.onlineStatus === "在线" ? "离线" : "在线");
    guide.currentStatus = guide.onlineStatus === "在线" ? body.currentStatus || "空闲中" : "休息中";
    audit(db, actorName(auth, guide.realName), "更新接单状态", `${guide.onlineStatus}/${guide.currentStatus}`);
    await writeDb(db);
    return ok(res, guide);
  }

  if (req.method === "GET" && pathname === "/api/guide/income") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, computeGuideIncome(db, url.searchParams.get("guideId") || "guide-001"));
  }

  if (req.method === "POST" && pathname === "/api/guide/exception") {
    const guide = getGuide(db, body.guideId || "guide-001");
    const task = body.taskId
      ? db.tasks.find((item) => item.id === body.taskId || item.taskNo === body.taskId)
      : db.tasks.find((item) => item.assigneeType === "guide" && item.assigneeId === guide.id && !["已完成", "已取消"].includes(item.status));
    const order = task ? db.orders.find((item) => item.id === task.orderId) : null;
    const alert = {
      id: nextId(db, "alert", "alert"),
      elderId: order?.userId || db.elderProfile.id,
      elderName: order?.elderName || db.elderProfile.name,
      type: body.type || "服务异常",
      level: body.level || "中",
      location: body.location || order?.location || db.elderProfile.address,
      status: "待处理",
      description: body.description || `${guide.realName}上报服务异常，请后台调度跟进。`,
      source: "向导端",
      orderId: order?.id || "",
      taskId: task?.id || "",
      attachments: Array.isArray(body.attachments)
        ? body.attachments.slice(0, 3).map((item) => ({
          name: String(item.name || "反馈截图"),
          type: String(item.type || "image/jpeg"),
          size: Number(item.size || 0),
          dataUrl: String(item.dataUrl || ""),
        }))
        : [],
      createdAt: now(),
      handledBy: "",
    };
    db.alerts.unshift(alert);
    if (order) addTimeline(order, "异常上报", `${guide.realName}上报：${alert.description}`);
    addMessage(db, "admin", "向导服务异常待处理", `${guide.realName}上报 ${order?.orderNo || task?.taskNo || "意见反馈"}：${alert.description}`, {
      scenario: "异常上报",
      priority: alert.level,
      relatedType: "alert",
      relatedId: alert.id,
    });
    addMessage(db, "user", "服务异常已上报", `${guide.realName}已上报服务异常，平台正在跟进处理。`, {
      scenario: "异常上报",
      priority: alert.level,
      relatedType: "alert",
      relatedId: alert.id,
    });
    audit(db, actorName(auth, guide.realName), "向导异常上报", alert.id);
    await writeDb(db);
    return ok(res, { alert, task: task || null, order });
  }

  if (req.method === "POST" && pathname === "/api/tasks/dispatch") {
    const order = body.orderId
      ? db.orders.find((item) => item.id === body.orderId || item.orderNo === body.orderId)
      : db.orders.find((item) => item.status === "待派单");
    if (!order) return fail(res, 404, "暂无可派单订单");
    const provider = resolveProvider(db, order, body);
    const allowRedispatch = Boolean(body.allowRedispatch);
    const existingTask = db.tasks.find((item) => item.orderId === order.id);
    order.providerType = provider.assigneeType;
    order.providerId = provider.assigneeId;
    order.assigneeName = provider.assigneeName;
    const manualRedispatch = allowRedispatch && existingTask;
    if (manualRedispatch) {
      order.status = "已派单";
      addTimeline(order, "已派单", `后台改派给${provider.assigneeName}`);
    } else {
      ensureOrderTransition(order, "dispatch");
      addTimeline(order, "已派单", `后台派单给${provider.assigneeName}`);
    }
    const task = existingTask || {
      id: nextId(db, "task", "task"),
      taskNo: nextNo(db, "task", "TASK"),
      orderId: order.id,
      createdAt: now(),
    };
    Object.assign(task, {
      assigneeType: provider.assigneeType,
      assigneeId: provider.assigneeId,
      assigneeName: provider.assigneeName,
      dispatchRule: body.dispatchRule || (provider.assigneeType === "merchant" ? "服务资质优先 + 评分优先" : "距离优先 + 评分优先"),
      updatedAt: now(),
    });
    if (manualRedispatch) {
      task.status = "待接单";
    } else {
      if (!existingTask) task.status = null;
      ensureTaskTransition(task, "dispatch");
    }
    if (!existingTask) db.tasks.unshift(task);
    addMessage(db, provider.assigneeType, "新任务待接单", `${order.elderName}的「${order.serviceType}」已派给您。`, {
      scenario: "用户下单",
      priority: "P0",
      relatedType: "task",
      relatedId: task.id,
    });
    audit(db, actorName(auth, "平台管理员"), "派单", `${order.orderNo} -> ${provider.assigneeName}`);
    await writeDb(db);
    return ok(res, { order, task });
  }

  // 向导端通过订单ID操作状态流转：接受/出发/到达/完成
  const guideOrderAction = pathname.match(/^\/api\/guide\/orders\/([^/]+)\/(confirm|accept|start|arrive|complete)$/);
  if (req.method === "POST" && guideOrderAction) {
    const orderId = guideOrderAction[1];
    const action = guideOrderAction[2];
    const order = db.orders.find((item) => item.id === orderId || item.orderNo === orderId);
    if (!order) return fail(res, 404, "订单不存在");
    const task = db.tasks.find((item) => item.orderId === order.id);
    const guide = db.guides.find((item) => item.id === (order.providerId || "guide-001"));
    const guideName = guide ? guide.realName : "向导";
    const actionMap = { confirm: "guideAccept", accept: "guideAccept", start: "guideStart", arrive: "guideStart", complete: "guideComplete" };
    const textMap = { confirm: `${guideName}已接单`, accept: `${guideName}已接单`, start: `${guideName}已出发`, arrive: `${guideName}已到达`, complete: `${guideName}已完成服务` };
    const taskActionMap = { confirm: "accept", accept: "accept", start: "start", arrive: "start", complete: "complete" };
    // 幂等：若已处于目标状态或之后的状态则直接返回成功
    const laterStates = ["已接单", "服务中", "待确认", "已完成"];
    const currentIdx = laterStates.indexOf(order.status);
    const alreadyAccepted = (action === "confirm" || action === "accept") && currentIdx >= 0;
    const alreadyStarted = (action === "start" || action === "arrive") && currentIdx >= 1;
    const alreadyCompleted = action === "complete" && currentIdx >= 2;
    if (alreadyAccepted || alreadyStarted || alreadyCompleted) {
      return ok(res, { order, task, status: order.status, action, idempotent: true });
    }
    if (task) {
      if (taskActionMap[action] === "complete" && task.status === "已接单") {
        ensureTaskTransition(task, "start");
      }
      ensureTaskTransition(task, taskActionMap[action]);
      task.updatedAt = now();
      if (action === "complete") { task.evidence = body.evidence || "已上传服务完成记录"; task.completedAt = now(); }
    }
    const nextStatus = ensureOrderTransition(order, actionMap[action]);
    addTimeline(order, nextStatus, textMap[action]);
    if (guide) guide.currentStatus = action === "complete" ? "空闲中" : "接单中";
    await writeDb(db);
    return ok(res, { order, task, status: order.status, action });
  }

  if (req.method === "POST" && (pathname === "/api/guide/tasks/claim-next" || pathname === "/api/guide/claim-next")) {
    const guide = getGuide(db, body.guideId || "guide-001");
    const serviceType = body.serviceType || body.category || "";
    const order = body.orderId
      ? db.orders.find((item) => item.id === body.orderId || item.orderNo === body.orderId)
      : db.orders.find((item) => item.providerType === "guide" && item.status === "待派单" && serviceTypeMatchesFilter(item, serviceType));
    if (!order) return fail(res, 404, serviceType ? `暂无可接的${serviceType}向导订单` : "暂无可接的向导订单");
    order.providerType = "guide";
    order.providerId = guide.id;
    order.assigneeName = guide.realName;
    ensureOrderTransition(order, "dispatch");
    addTimeline(order, "已派单", `${guide.realName}在向导端接单大厅接单`);
    const task = {
      id: nextId(db, "task", "task"),
      taskNo: nextNo(db, "task", "TASK"),
      orderId: order.id,
      assigneeType: "guide",
      assigneeId: guide.id,
      assigneeName: guide.realName,
      dispatchRule: "向导端主动接单",
      status: null,
      createdAt: now(),
      updatedAt: now(),
    };
    ensureTaskTransition(task, "dispatch");
    ensureTaskTransition(task, "accept");
    ensureOrderTransition(order, "guideAccept");
    addTimeline(order, "已接单", `${guide.realName}已确认接单`);
    db.tasks.unshift(task);
    guide.currentStatus = "接单中";
    addMessage(db, "user", "订单已接单", `${guide.realName}已接下您的「${order.serviceType}」服务。`, {
      scenario: "人工向导接单",
      priority: "P0",
      relatedType: "order",
      relatedId: order.id,
    });
    addMessage(db, "admin", "向导已主动接单", `${guide.realName}接单 ${order.orderNo}。`, {
      scenario: "人工向导接单",
      priority: "P0",
      relatedType: "order",
      relatedId: order.id,
    });
    audit(db, actorName(auth, guide.realName), "向导主动接单", order.orderNo);
    await writeDb(db);
    return ok(res, { order, task, guide });
  }

  const guideTaskDecision = pathname.match(/^\/api\/guide\/tasks\/([^/]+)\/(decline|ignore|cancel)$/);
  if (req.method === "POST" && guideTaskDecision) {
    const guide = getGuide(db, body.guideId || "guide-001");
    const task = db.tasks.find((item) => item.id === guideTaskDecision[1] || item.taskNo === guideTaskDecision[1]);
    if (!task) return fail(res, 404, "Task not found");
    if (task.assigneeType !== "guide") return fail(res, 403, "Only guide tasks can use guide task decision APIs");
    const order = db.orders.find((item) => item.id === task.orderId);
    const action = guideTaskDecision[2];
    const reason = body.reason || (action === "decline" ? "向导暂不方便接单" : action === "cancel" ? "向导申请取消订单" : "向导暂不处理该任务");

    if (action === "ignore") {
      if (task.status !== "待接单") return fail(res, 409, "只有待接单任务可以忽略", "STATE_TRANSITION_DENIED");
      task.ignoredAt = now();
      task.ignoreReason = reason;
      task.updatedAt = now();
      if (order) addTimeline(order, "待接单", `${guide.realName || task.assigneeName}忽略任务：${reason}`);
      addMessage(db, "admin", "向导已忽略任务", `${guide.realName || task.assigneeName}忽略 ${order?.orderNo || task.taskNo}：${reason}`, {
        scenario: "人工向导接单",
        priority: "P1",
        relatedType: "task",
        relatedId: task.id,
      });
      audit(db, actorName(auth, guide.realName || task.assigneeName), "忽略任务", task.taskNo);
      await writeDb(db);
      return ok(res, { order, task, guide, action: "ignore" });
    }

    if (action === "decline") {
      ensureTaskTransition(task, "decline");
      task.declineReason = reason;
      task.updatedAt = now();
      if (order) {
        ensureOrderTransition(order, "guideDecline");
        order.cancelReason = reason;
        order.cancelledBy = "guide";
        addTimeline(order, "已取消", `${guide.realName || task.assigneeName}拒绝接单：${reason}`);
      }
      addMessage(db, "admin", "向导拒绝接单", `${guide.realName || task.assigneeName}拒绝 ${order?.orderNo || task.taskNo}：${reason}`, {
        scenario: "人工向导接单",
        priority: "P0",
        relatedType: "task",
        relatedId: task.id,
      });
      if (order) {
        addMessage(db, "user", "向导暂无法接单", `${guide.realName || task.assigneeName}暂无法承接「${order.serviceType}」，平台将继续协助处理。`, {
          scenario: "人工向导接单",
          priority: "P0",
          relatedType: "order",
          relatedId: order.id,
        });
      }
      audit(db, actorName(auth, guide.realName || task.assigneeName), "拒绝接单", task.taskNo);
      await writeDb(db);
      return ok(res, { order, task, guide, action: "decline" });
    }

    ensureTaskTransition(task, "cancel");
    task.cancelReason = reason;
    task.updatedAt = now();
    if (order) {
      ensureOrderTransition(order, "guideCancel");
      order.cancelReason = reason;
      order.cancelledBy = "guide";
      addTimeline(order, "已取消", `${guide.realName || task.assigneeName}申请取消：${reason}`);
    }
    if (guide) guide.currentStatus = "空闲中";
    addMessage(db, "admin", "向导申请取消订单", `${guide.realName || task.assigneeName}申请取消 ${order?.orderNo || task.taskNo}：${reason}`, {
      scenario: "异常上报",
      priority: "P0",
      relatedType: "task",
      relatedId: task.id,
    });
    if (order) {
      addMessage(db, "user", "订单已取消", `${guide.realName || task.assigneeName}申请取消「${order.serviceType}」，原因：${reason}`, {
        scenario: "人工向导接单",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
    }
    audit(db, actorName(auth, guide.realName || task.assigneeName), "申请取消订单", task.taskNo);
    await writeDb(db);
    return ok(res, { order, task, guide, action: "cancel" });
  }

  const taskAction = pathname.match(/^\/api\/tasks\/([^/]+)\/(accept|start|complete)$/);
  if (req.method === "POST" && taskAction) {
    const task = db.tasks.find((item) => item.id === taskAction[1] || item.taskNo === taskAction[1]);
    if (!task) return fail(res, 404, "Task not found");
    const order = db.orders.find((item) => item.id === task.orderId);
    const action = taskAction[2];
    const orderActionMap = { accept: "guideAccept", start: "guideStart", complete: "guideComplete" };
    const textMap = {
      accept: `${task.assigneeName}已接单`,
      start: `${task.assigneeName}已开始服务`,
      complete: `${task.assigneeName}已提交完成，等待用户确认`,
    };
    if (action === "complete" && task.status === "已接单") {
      ensureTaskTransition(task, "start");
      if (order && order.status === "已接单") {
        const startedOrderStatus = ensureOrderTransition(order, "guideStart");
        addTimeline(order, startedOrderStatus, textMap.start);
      }
    }
    const nextTaskStatus = ensureTaskTransition(task, action);
    task.updatedAt = now();
    if (action === "complete") {
      task.evidence = body.evidence || "已上传服务完成记录";
      task.completedAt = now();
    }
    if (order) {
      const nextOrderStatus = ensureOrderTransition(order, orderActionMap[action]);
      addTimeline(order, nextOrderStatus, textMap[action]);
    }
    if (task.assigneeType === "guide") {
      const guide = db.guides.find((item) => item.id === task.assigneeId);
      if (guide) guide.currentStatus = action === "complete" ? "空闲中" : "接单中";
    }
    addMessage(db, "user", "订单状态更新", order ? `${order.orderNo}：${textMap[action]}` : textMap[action], {
      scenario: action === "accept" ? "人工向导接单" : action === "complete" ? "服务完成" : "人工向导接单",
      priority: "P0",
      relatedType: "task",
      relatedId: task.id,
    });
    if (action === "accept" || action === "complete") {
      addMessage(db, "admin", action === "accept" ? "向导已接单" : "向导服务待用户确认", order ? `${order.orderNo}：${textMap[action]}` : textMap[action], {
        scenario: action === "accept" ? "人工向导接单" : "服务完成",
        priority: "P0",
        relatedType: "task",
        relatedId: task.id,
      });
    }
    audit(db, actorName(auth, task.assigneeName), textMap[action], task.taskNo);
    await writeDb(db);
    return ok(res, { order, task });
  }

  if (req.method === "GET" && pathname === "/api/devices/robot-requirements") {
    return ok(res, {
      ...smartDeviceRobotRequirementsForApi(db),
      validation: validateSmartDeviceRobotRequirements(),
      related: {
        devices: "/api/devices",
        healthOverview: "/api/health/overview",
        deviceAction: "/api/devices/{id}/action",
        helpRequest: "/api/devices/help-request",
        sos: "/api/alerts/sos",
        serviceRequests: "/api/service-requests",
      },
    });
  }

  if (req.method === "POST" && pathname === "/api/devices/help-request") {
    const requestItem = createDeviceHelpRequest(db, auth, body);
    await writeDb(db);
    return ok(res, requestItem);
  }

  if (req.method === "GET" && pathname === "/api/devices") {
    return ok(res, db.devices);
  }

  if (req.method === "POST" && pathname === "/api/devices/bind") {
    const syncedAt = now();
    const device = {
      id: nextId(db, "device", "device"),
      deviceId: body.deviceId || `SIM-${Date.now()}`,
      name: body.name || body.deviceName || body.type || "智能设备",
      type: body.type || body.deviceType || "智能设备",
      elderName: body.elderName || db.elderProfile.name,
      userId: body.userId || "user-001",
      battery: Number(body.battery || 100),
      onlineStatus: body.onlineStatus || body.status || "在线",
      lastSync: syncedAt,
      lastSyncAt: body.lastSyncAt || syncedAt,
      updatedAt: syncedAt,
      location: body.location || db.elderProfile.address,
    };
    db.devices.unshift(device);
    audit(db, actorName(auth, "平台管理员"), "绑定设备", device.deviceId);
    await writeDb(db);
    return ok(res, device);
  }

  const deviceDetail = pathname.match(/^\/api\/devices\/([^/]+)$/);
  if (req.method === "PUT" && deviceDetail) {
    const device = db.devices.find((item) => item.id === deviceDetail[1] || item.deviceId === deviceDetail[1]);
    if (!device) return fail(res, 404, "Device not found");
    if (body.name !== undefined) device.name = body.name || device.name || device.type || "智能设备";
    if (body.type !== undefined) device.type = body.type || device.type || "智能设备";
    if (body.elderName !== undefined) device.elderName = body.elderName || device.elderName || db.elderProfile.name;
    if (body.contactName !== undefined) device.contactName = body.contactName || "";
    if (body.contactRelation !== undefined) device.contactRelation = body.contactRelation || "";
    if (body.contactPhone !== undefined) device.contactPhone = body.contactPhone || "";
    if (body.region !== undefined) device.region = body.region || "";
    if (body.note !== undefined) device.note = body.note || "";
    if (body.source !== undefined) device.source = body.source || "";
    if (body.location !== undefined) device.location = body.location || device.location || "";
    if (body.onlineStatus !== undefined) device.onlineStatus = body.onlineStatus || device.onlineStatus || "在线";
    if (body.networkStatus !== undefined) device.networkStatus = body.networkStatus || "";
    if (body.battery !== undefined) device.battery = Math.max(0, Math.min(100, Number(body.battery || 0)));
    if (body.alertThresholds && typeof body.alertThresholds === "object") {
      device.alertThresholds = { ...(device.alertThresholds || {}), ...body.alertThresholds };
    }
    if (body.pushSettings && typeof body.pushSettings === "object") {
      device.pushSettings = { ...(device.pushSettings || {}), ...body.pushSettings };
    }
    if (body.guardianSettings && typeof body.guardianSettings === "object") {
      device.guardianSettings = { ...(device.guardianSettings || {}), ...body.guardianSettings };
    }
    device.updatedAt = now();
    audit(db, actorName(auth, "平台管理员"), "更新设备信息", device.deviceId);
    await writeDb(db);
    return ok(res, device);
  }

  if (req.method === "DELETE" && deviceDetail) {
    const index = db.devices.findIndex((item) => item.id === deviceDetail[1] || item.deviceId === deviceDetail[1]);
    if (index < 0) return fail(res, 404, "Device not found");
    const [device] = db.devices.splice(index, 1);
    audit(db, actorName(auth, "平台管理员"), "解绑设备", device.deviceId || device.id);
    await writeDb(db);
    return ok(res, device);
  }

  const deviceSync = pathname.match(/^\/api\/devices\/([^/]+)\/sync$/);
  if (req.method === "POST" && deviceSync) {
    const device = db.devices.find((item) => item.id === deviceSync[1] || item.deviceId === deviceSync[1]);
    if (!device) return fail(res, 404, "Device not found");
    if (body.battery !== undefined) device.battery = Math.max(0, Math.min(100, Number(body.battery)));
    device.onlineStatus = body.onlineStatus || "在线";
    const syncedAt = now();
    device.lastSync = syncedAt;
    device.lastSyncAt = syncedAt;
    device.updatedAt = syncedAt;
    if (body.location) device.location = body.location;
    recordDeviceException(db, device, auth);
    audit(db, actorName(auth, db.users[0].nickname), "同步设备", device.deviceId);
    await writeDb(db);
    return ok(res, device);
  }

  const deviceAction = pathname.match(/^\/api\/devices\/([^/]+)\/action$/);
  if (req.method === "POST" && deviceAction) {
    const device = db.devices.find((item) => item.id === deviceAction[1] || item.deviceId === deviceAction[1]);
    if (!device) return fail(res, 404, "Device not found");
    const actionName = body.action || "设备操作";
    const familyContact = body.contactId
      ? db.familyContacts.find((item) => item.id === body.contactId)
      : db.familyContacts.find((item) => item.isDefault) || db.familyContacts[0];
    let resultText = body.result || actionResultText(actionName);
    if (body.guardianFeature) {
      device.guardianSettings = device.guardianSettings || {};
      const nextEnabled = body.enabled === undefined ? !device.guardianSettings[body.guardianFeature] : Boolean(body.enabled);
      device.guardianSettings[body.guardianFeature] = nextEnabled;
      resultText = `${actionName}${nextEnabled ? "已开启" : "已关闭"}`;
    }
    if (/语音通话|视频通话|通话/.test(actionName) || body.callType) {
      const callText = body.callType === "video" || /视频/.test(actionName) ? "视频通话" : "语音通话";
      device.lastCall = {
        type: callText,
        contactId: familyContact?.id || "",
        contactName: familyContact?.name || "紧急联系人",
        startedAt: now(),
        status: "模拟呼叫中",
      };
      resultText = `已发起${callText}模拟，联系人：${device.lastCall.contactName}`;
      addMessage(db, "family", "家人通话请求", `${db.elderProfile.name}通过${device.type}发起${callText}，请及时接听。`, {
        scenario: "家人通话",
        priority: "P1",
        channels: ["站内消息", "电话接口预留", "视频通话预留"],
        relatedType: "device",
        relatedId: device.id,
      });
      addMessage(db, "user", "通话已发起", `${callText}已呼叫${device.lastCall.contactName}，当前为试运营模拟通话。`, {
        scenario: "家人通话",
        priority: "P1",
        relatedType: "device",
        relatedId: device.id,
      });
    }
    if (/测试设备|测试小云机器人|设备自检|自检|麦克风测试|摄像头测试|扬声器测试|定位测试/.test(actionName)) {
      device.networkStatus = body.networkStatus || "良好";
      device.voiceVolume = Number(body.voiceVolume || device.voiceVolume || 65);
      device.deviceStatus = "检测正常";
      resultText = `${device.type}自检完成：网络良好，设备状态正常`;
    }
    const action = recordUiAction(db, auth, {
      role: body.role || auth?.role,
      route: "device-management",
      action: actionName,
      target: device.deviceId,
      result: resultText,
      payload: {
        deviceId: device.id,
        type: device.type,
        guardianFeature: body.guardianFeature || "",
        enabled: body.enabled,
        callType: body.callType || "",
        contactId: familyContact?.id || "",
      },
    });
    device.lastAction = action.action;
    device.lastActionAt = now();
    device.updatedAt = device.lastActionAt;
    audit(db, actorName(auth, db.users[0].nickname), "设备操作", `${device.deviceId}/${action.action}`);
    await writeDb(db);
    return ok(res, { device, action });
  }

  if (req.method === "GET" && pathname === "/api/health/overview") {
    return ok(res, {
      elder: db.elderProfile,
      metrics: db.healthRecords,
      devices: db.devices,
      alerts: db.alerts.filter((item) => item.elderId === db.elderProfile.id && item.status !== "已处理"),
    });
  }

  if (req.method === "GET" && pathname === "/api/user/health-services") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, userHealthServicesForApi(db, auth, {
      category: url.searchParams.get("category"),
      q: url.searchParams.get("q"),
    }));
  }

  if (req.method === "POST" && pathname === "/api/user/health-services/quick-action") {
    const quick = USER_HEALTH_SERVICE_QUICK_ACTIONS.find((item) => item.key === body.key);
    if (!quick) return fail(res, 404, "Health quick action not found");
    const pseudoService = {
      id: quick.key,
      title: quick.title,
      category: quick.type,
      providerType: "",
      providerId: "",
    };
    const requestItem = createHealthServiceRequest(db, auth, pseudoService, {
      ...body,
      type: quick.type,
      priority: quick.priority,
      description: body.description || `${quick.title}：${quick.text}`,
    }, quick.action);
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "health-services",
      action: quick.action,
      target: quick.key,
      result: `${quick.title}请求已进入后台处理`,
      payload: { key: quick.key, route: quick.route, requestId: requestItem.id, source: body.source || "health-services" },
    });
    audit(db, actorName(auth, requestItem.elderName), "健康服务快捷动作", `${quick.key}/${requestItem.requestNo}`);
    await writeDb(db);
    return ok(res, { quick, request: requestItem, action, page: userHealthServicesForApi(db, auth, {}) });
  }

  const healthServiceBook = pathname.match(/^\/api\/user\/health-services\/([^/]+)\/book$/);
  if (req.method === "POST" && healthServiceBook) {
    const serviceId = decodeURIComponent(healthServiceBook[1]);
    const service = findHealthServiceForUser(db, serviceId);
    if (!service) return fail(res, 404, "Health service not found");
    const requestItem = createHealthServiceRequest(db, auth, service, {
      ...body,
      description: body.description || `预约健康服务：${service.title}`,
    }, "预约健康服务");
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "health-services",
      action: "预约健康服务",
      target: service.id,
      result: `${service.title}预约已提交`,
      payload: { serviceId: service.id, requestId: requestItem.id, source: body.source || "health-services" },
    });
    audit(db, actorName(auth, requestItem.elderName), "预约健康服务", `${service.id}/${requestItem.requestNo}`);
    await writeDb(db);
    return ok(res, { service, request: requestItem, action, page: userHealthServicesForApi(db, auth, {}) });
  }

  const healthServiceConsult = pathname.match(/^\/api\/user\/health-services\/([^/]+)\/consult$/);
  if (req.method === "POST" && healthServiceConsult) {
    const serviceId = decodeURIComponent(healthServiceConsult[1]);
    const service = findHealthServiceForUser(db, serviceId);
    if (!service) return fail(res, 404, "Health service not found");
    const requestItem = createHealthServiceRequest(db, auth, service, {
      ...body,
      description: body.question || body.description || `咨询健康服务：${service.title}`,
    }, "健康服务咨询");
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "health-services",
      action: "健康服务咨询",
      target: service.id,
      result: `${service.title}咨询已提交`,
      payload: { serviceId: service.id, requestId: requestItem.id, question: body.question || "", source: body.source || "health-services" },
    });
    audit(db, actorName(auth, requestItem.elderName), "健康服务咨询", `${service.id}/${requestItem.requestNo}`);
    await writeDb(db);
    return ok(res, { service, request: requestItem, action, page: userHealthServicesForApi(db, auth, {}) });
  }

  if (pathname === "/api/health/record") {
    if (req.method === "GET") return ok(res, healthRecordForApi(db, auth));
    if (req.method === "PUT") {
      const record = updateHealthRecord(db, auth, body);
      await writeDb(db);
      return ok(res, record);
    }
  }

  if (req.method === "POST" && pathname === "/api/health/record/sync") {
    const user = userForAuth(db, auth);
    const device = (db.devices || []).find((item) => /手环/.test(`${item.type || ""}${item.name || ""}`) && (!item.userId || item.userId === user.id))
      || (db.devices || []).find((item) => !item.userId || item.userId === user.id);
    if (!device) return fail(res, 404, "未找到可同步的健康设备");
    const syncedAt = now();
    device.onlineStatus = body.onlineStatus || device.onlineStatus || "在线";
    device.lastSync = syncedAt;
    device.lastSyncAt = syncedAt;
    device.updatedAt = syncedAt;
    const action = recordUiAction(db, auth, {
      role: "user",
      route: "health-record",
      action: "同步健康设备数据",
      target: device.deviceId || device.id,
      result: `已同步${device.name || device.type || "健康设备"}的最近采集数据`,
      payload: { deviceId: device.id, metricCount: latestHealthMetrics(db).length },
    });
    audit(db, actorName(auth, db.elderProfile.name), "同步健康档案", device.deviceId || device.id);
    await writeDb(db);
    return ok(res, {
      ...healthRecordForApi(db, auth),
      sync: { syncedAt, deviceId: device.id, actionId: action.id, metricCount: latestHealthMetrics(db).length },
    });
  }

  if (req.method === "GET" && pathname === "/api/alerts/emergency-requirements") {
    return ok(res, {
      ...emergencyHelpRequirementsForApi(db),
      validation: validateEmergencyHelpRequirements(),
      related: {
        sos: "/api/alerts/sos",
        quickHelp: "/api/alerts/quick-help",
        emergencySettings: "/api/alerts/emergency-settings",
        contacts: "/api/family-contacts",
        healthProfile: "/api/elder/profile",
        messages: "/api/messages",
        adminAlerts: "/api/admin/alerts",
      },
    });
  }

  if (pathname === "/api/alerts/emergency-settings") {
    if (req.method === "GET") return ok(res, emergencyNotificationSettingsForApi(db));
    if (req.method === "PUT") {
      const key = String(body.key || "").trim();
      if (!emergencyNotificationRuleDefinitions.some((rule) => rule.key === key)) {
        return fail(res, 400, "未知的紧急通知规则");
      }
      db.emergencyNotificationSettings = {
        ...(db.emergencyNotificationSettings || {}),
        [key]: body.enabled !== false,
        updatedAt: now(),
      };
      audit(db, actorName(auth, db.elderProfile.name), "更新紧急通知规则", `${key}/${body.enabled !== false ? "开启" : "关闭"}`);
      await writeDb(db);
      return ok(res, emergencyNotificationSettingsForApi(db));
    }
  }

  if (req.method === "GET" && pathname === "/api/family-contacts") {
    return ok(res, contactsForEmergency(db));
  }

  if (req.method === "POST" && pathname === "/api/family-contacts") {
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    if (!name || !/^1\d{10}$/.test(phone)) return fail(res, 400, "请填写联系人姓名和 11 位手机号");
    const contact = {
      id: nextId(db, "familyContact", "contact"),
      elderId: body.elderId || db.elderProfile.id,
      name,
      relation: String(body.relation || "家属").trim(),
      phone,
      isDefault: body.isDefault === true || db.familyContacts.length === 0,
      notifyAlert: body.notifyAlert !== false,
      callPriority: Number(body.callPriority || db.familyContacts.length + 1),
      bindingStatus: "已绑定",
      boundAt: now(),
      createdAt: now(),
      familyPermissions: familySharingPermissions(body.familyPermissions || {}),
    };
    if (contact.isDefault) db.familyContacts.forEach((item) => {
      item.isDefault = false;
    });
    db.familyContacts.push(contact);
    addMessage(db, "user", "紧急联系人已新增", `${contact.relation}${contact.name}已加入紧急通知链路。`, {
      scenario: "紧急联系人",
      priority: "P0",
      relatedType: "familyContact",
      relatedId: contact.id,
    });
    audit(db, actorName(auth, db.elderProfile.name), "新增紧急联系人", `${contact.relation}/${contact.name}`);
    await writeDb(db);
    return ok(res, contact);
  }

  const familyContactCall = pathname.match(/^\/api\/family-contacts\/([^/]+)\/call$/);
  if (req.method === "POST" && familyContactCall) {
    const contact = db.familyContacts.find((item) => item.id === familyContactCall[1]);
    if (!contact) return fail(res, 404, "Emergency contact not found");
    const action = recordUiAction(db, auth, {
      role: "user",
      route: body.route || "emergency",
      action: "拨打紧急联系人",
      target: `${contact.relation}/${contact.name}`,
      result: `已交由系统拨号：${contact.phone}`,
      payload: { contactId: contact.id, phone: contact.phone, scenario: "4.5 紧急求助需求" },
    });
    addMessage(db, "family", "紧急联系人拨打记录", `${db.elderProfile.name}正在拨打${contact.relation}${contact.name}，电话 ${contact.phone}。`, {
      scenario: "紧急联系人",
      priority: "P0",
      channels: ["站内消息", "电话接口预留"],
      relatedType: "familyContact",
      relatedId: contact.id,
    });
    contact.lastInteractionAt = now();
    await writeDb(db);
    return ok(res, { contact, action, dialNumber: contact.phone, telHref: `tel:${contact.phone}`, callStatus: "已交由系统拨号" });
  }

  const familyContactDetail = pathname.match(/^\/api\/family-contacts\/([^/]+)$/);
  if (familyContactDetail) {
    const contact = db.familyContacts.find((item) => item.id === familyContactDetail[1]);
    if (!contact) return fail(res, 404, "Emergency contact not found");
    if (req.method === "GET") return ok(res, contact);
    if (req.method === "PUT") {
      const nextPhone = body.phone === undefined ? contact.phone : String(body.phone || "").trim();
      if (!/^1\d{10}$/.test(nextPhone)) return fail(res, 400, "请填写 11 位手机号");
      contact.name = body.name === undefined ? contact.name : String(body.name || "").trim();
      contact.relation = body.relation === undefined ? contact.relation : String(body.relation || "家属").trim();
      contact.phone = nextPhone;
      contact.notifyAlert = body.notifyAlert === undefined ? contact.notifyAlert !== false : body.notifyAlert !== false;
      contact.callPriority = body.callPriority === undefined ? contact.callPriority : Number(body.callPriority || contact.callPriority || 1);
      if (body.familyPermissions && typeof body.familyPermissions === "object") {
        contact.familyPermissions = familySharingPermissions({
          ...(contact.familyPermissions || {}),
          ...body.familyPermissions,
        });
      }
      if (body.isDefault === true) {
        db.familyContacts.forEach((item) => {
          item.isDefault = item.id === contact.id;
        });
      } else if (body.isDefault === false && contact.isDefault && db.familyContacts.length > 1) {
        contact.isDefault = false;
        const replacement = db.familyContacts.find((item) => item.id !== contact.id);
        if (replacement) replacement.isDefault = true;
      }
      contact.updatedAt = now();
      audit(db, actorName(auth, db.elderProfile.name), "编辑紧急联系人", `${contact.relation}/${contact.name}`);
      await writeDb(db);
      return ok(res, contact);
    }
    if (req.method === "DELETE") {
      if (db.familyContacts.length <= 1) return fail(res, 400, "至少保留一个紧急联系人");
      const index = db.familyContacts.findIndex((item) => item.id === contact.id);
      const [removed] = db.familyContacts.splice(index, 1);
      if (removed.isDefault && db.familyContacts[0]) db.familyContacts[0].isDefault = true;
      audit(db, actorName(auth, db.elderProfile.name), "删除紧急联系人", `${removed.relation}/${removed.name}`);
      await writeDb(db);
      return ok(res, { removed, contacts: contactsForEmergency(db) });
    }
  }

  if (req.method === "GET" && pathname === "/api/alerts/quick-help") {
    return ok(res, quickHelpChannels.map((ch) => ({
      key: ch.key,
      title: ch.title,
      target: ch.target,
      dialNumber: ch.dialNumber,
      priority: ch.priority,
      providerType: ch.providerType,
    })));
  }

  if (req.method === "POST" && pathname === "/api/alerts/quick-help") {
    const requestItem = createEmergencyQuickHelpRequest(db, auth, body);
    await writeDb(db);
    return ok(res, requestItem);
  }

  if (req.method === "POST" && pathname === "/api/alerts/sos") {
    const locationInfo = normalizeEmergencyLocation(db, body);
    const contactSnapshot = emergencyContactSnapshot(db);
    const healthSnapshot = healthInfoForEmergency(db);
    const alert = {
      id: nextId(db, "alert", "alert"),
      elderId: body.elderId || db.elderProfile.id,
      elderName: body.elderName || db.elderProfile.name,
      type: body.type || "SOS求助",
      level: body.level || "高",
      phone: body.phone || defaultUserPhone(db),
      location: locationInfo.address,
      coordinates: locationInfo.coordinates,
      accuracy: locationInfo.accuracy,
      locationSource: locationInfo.source,
      contactSnapshot,
      healthSnapshot,
      status: "待处理",
      description: body.description || "用户触发一键 SOS，请立即联系老人和紧急联系人。",
      source: "4.5 紧急求助需求",
      createdAt: now(),
      handledBy: "",
    };
    db.alerts.unshift(alert);
    addMessage(db, "admin", "高优先级 SOS", sosNotificationText(alert), {
      scenario: "SOS 求助",
      priority: "最高",
      channels: ["站内消息", "短信预留", "电话预留", "App Push 预留"],
      relatedType: "alert",
      relatedId: alert.id,
    });
    addMessage(db, "family", "老人触发 SOS", `${sosNotificationText(alert)}平台正在处理，请保持电话畅通。`, {
      scenario: "SOS 求助",
      priority: "最高",
      channels: ["站内消息", "短信预留", "电话预留"],
      relatedType: "alert",
      relatedId: alert.id,
    });
    addMessage(db, "guide", "附近 SOS 待响应", `${alert.elderName}在${alert.location}触发 SOS，请保持在线等待平台调度。`, {
      scenario: "SOS 求助",
      priority: "最高",
      channels: ["站内消息", "App Push 预留"],
      relatedType: "alert",
      relatedId: alert.id,
    });
    addMessage(db, "user", "SOS 求助记录已生成", `求助记录 ${alert.id} 已生成，后台和紧急联系人已收到通知。`, {
      scenario: "SOS 求助",
      priority: "最高",
      channels: ["站内消息"],
      relatedType: "alert",
      relatedId: alert.id,
    });
    audit(db, actorName(auth, alert.elderName), "触发SOS", alert.id);
    await writeDb(db);
    return ok(res, alert);
  }

  if (req.method === "GET" && pathname === "/api/alerts") {
    return ok(res, db.alerts);
  }

  const alertHandle = pathname.match(/^\/api\/alerts\/([^/]+)\/handle$/);
  if (req.method === "POST" && alertHandle) {
    const alert = db.alerts.find((item) => item.id === alertHandle[1]);
    if (!alert) return fail(res, 404, "Alert not found");
    if ((body.status || "已处理") === "处理中") {
      ensureAlertTransition(alert, "processing");
    } else {
      ensureAlertTransition(alert, "handle");
    }
    alert.handledBy = body.handledBy || actorName(auth, "平台管理员");
    alert.result = body.result || "已电话确认老人安全，并同步家属。";
    alert.handledAt = now();
    audit(db, alert.handledBy, "处理异常", alert.id);
    await writeDb(db);
    return ok(res, alert);
  }

  if (req.method === "GET" && pathname === "/api/merchant/services") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const merchantId = url.searchParams.get("merchantId");
    let data = db.services.filter((item) => item.providerType === "merchant");
    if (merchantId) data = data.filter((item) => item.providerId === merchantId);
    const merchantServiceSeeds = [
      { id: "service-004", providerType: "merchant", providerId: "merchant-001", title: "中医理疗推拿", category: "康养护理", price: 180, unit: "次", status: "上架", description: "专业中医师推拿按摩，舒缓筋骨、调理气血。" },
      { id: "service-005", providerType: "merchant", providerId: "merchant-001", title: "营养膳食定制", category: "生活服务", price: 120, unit: "日", status: "上架", description: "根据健康档案定制每日营养餐食，配送上门。" },
      { id: "service-006", providerType: "merchant", providerId: "merchant-001", title: "居家保洁服务", category: "生活服务", price: 150, unit: "次", status: "待审核", description: "专业保洁人员上门清洁，适老化深度清理。" },
      { id: "service-007", providerType: "merchant", providerId: "merchant-001", title: "康复训练指导", category: "康养护理", price: 200, unit: "次", status: "已下架", description: "康复师一对一指导，肢体功能恢复训练。" },
    ];
    const existingIds = new Set(db.services.map((s) => s.id));
    const missing = merchantServiceSeeds.filter((seed) => !existingIds.has(seed.id));
    if (missing.length) {
      db.services.push(...missing);
      await writeDb(db);
      data = db.services.filter((item) => item.providerType === "merchant");
      if (merchantId) data = data.filter((item) => item.providerId === merchantId);
    }
    return ok(res, data.map((item) => enrichService(db, item)));
  }

  if (req.method === "GET" && pathname === "/api/merchant/profile") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantProfileForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "GET" && pathname === "/api/merchant/photos") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const merchant = getMerchant(db, url.searchParams.get("merchantId") || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const photos = merchantStorePhotosForApi(merchant);
    return ok(res, {
      merchantId: merchant.id,
      photos,
      count: photos.length,
      max: 9,
      coverPhoto: photos.find((item) => item.isCover) || photos[0] || null,
      sourceEndpoint: "/api/merchant/photos",
    });
  }

  if (req.method === "PUT" && pathname === "/api/merchant/profile") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const updates = { ...(body.profile || body) };
    const stringFields = ["name", "type", "contact", "phone", "address", "businessHours", "serviceCity", "intro"];
    stringFields.forEach((field) => {
      if (updates[field] !== undefined) merchant[field] = String(updates[field] || "").trim();
    });
    if (!merchant.name) return fail(res, 400, "请填写机构名称");
    if (!merchant.contact) return fail(res, 400, "请填写联系人");
    if (!merchant.phone || !/^[\d\s()+-]{7,20}$/.test(merchant.phone)) return fail(res, 400, "请填写有效联系电话");
    if (!merchant.address) return fail(res, 400, "请填写门店地址");
    merchant.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "更新商户资料", merchant.id);
    await writeDb(db);
    return ok(res, merchantProfileForApi(db, merchant.id));
  }

  if (req.method === "PUT" && pathname === "/api/merchant/photos") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const currentPhotos = merchantStorePhotosForApi(merchant);
    const incoming = Array.isArray(body.photos) ? body.photos : currentPhotos;
    const photos = normalizeMerchantStorePhotos(incoming);
    if (photos.length > 9) return fail(res, 400, "门店照片最多上传9张");
    if (!photos.some((item) => item.isCover) && photos[0]) photos[0].isCover = true;
    merchant.storePhotos = photos;
    merchant.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "保存商户门店照片", `${merchant.id}/${photos.length}张`);
    await writeDb(db);
    return ok(res, {
      merchantId: merchant.id,
      photos,
      count: photos.length,
      max: 9,
      coverPhoto: photos.find((item) => item.isCover) || photos[0] || null,
      sourceEndpoint: "/api/merchant/photos",
    });
  }

  const merchantPhotoDelete = pathname.match(/^\/api\/merchant\/photos\/([^/]+)$/);
  if (req.method === "DELETE" && merchantPhotoDelete) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const merchant = getMerchant(db, url.searchParams.get("merchantId") || body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const photoId = decodeURIComponent(merchantPhotoDelete[1]);
    const currentPhotos = merchantStorePhotosForApi(merchant);
    const target = currentPhotos.find((item) => item.id === photoId);
    if (!target) return fail(res, 404, "门店照片不存在或已删除");
    const nextPhotos = currentPhotos.filter((item) => item.id !== photoId);
    if (!nextPhotos.some((item) => item.isCover) && nextPhotos[0]) nextPhotos[0].isCover = true;
    merchant.storePhotos = nextPhotos;
    merchant.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "删除商户门店照片", `${merchant.id}/${target.title}`);
    await writeDb(db);
    return ok(res, {
      merchantId: merchant.id,
      deletedPhoto: target,
      photos: nextPhotos,
      count: nextPhotos.length,
      max: 9,
      coverPhoto: nextPhotos.find((item) => item.isCover) || nextPhotos[0] || null,
      sourceEndpoint: "/api/merchant/photos",
    });
  }

  if (req.method === "POST" && pathname === "/api/merchant/profile/online") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const rawNext = body.onlineAccepting;
    const current = merchant.status === "已通过" && merchant.onlineAccepting !== false;
    const nextOnline = typeof rawNext === "boolean"
      ? rawNext
      : rawNext === "true"
        ? true
        : rawNext === "false"
          ? false
          : !current;
    if (nextOnline && merchant.status !== "已通过") {
      return fail(res, 409, "商户未通过审核，不能开启在线接单");
    }
    merchant.onlineAccepting = nextOnline;
    merchant.onlineStatus = nextOnline ? "在线接单中" : "暂停接单";
    merchant.onlineUpdatedAt = now();
    audit(db, actorName(auth, merchant.name), "更新商户在线接单状态", `${merchant.name}/${merchant.onlineStatus}`);
    await writeDb(db);
    return ok(res, merchantProfileForApi(db, merchant.id));
  }

  if (req.method === "GET" && pathname === "/api/merchant/qualification") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantQualificationForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "GET" && pathname === "/api/merchant/security") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantSecurityForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "POST" && pathname === "/api/merchant/security/toggle") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const security = ensureMerchantSecurity(merchant);
    const field = String(body.field || "twoFactorEnabled");
    if (!["twoFactorEnabled"].includes(field)) return fail(res, 400, "不支持的安全开关");
    security[field] = typeof body.enabled === "boolean" ? body.enabled : !security[field];
    security.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "更新商户账户安全", `${field}/${security[field] ? "开启" : "关闭"}`);
    await writeDb(db);
    return ok(res, merchantSecurityForApi(db, merchant.id));
  }

  if (req.method === "POST" && pathname === "/api/merchant/security/logout-devices") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const security = ensureMerchantSecurity(merchant);
    security.devices = security.devices.map((device) => device.current
      ? device
      : { ...device, status: "已退出", logoutAt: now(), color: "gray" });
    security.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "退出商户其他登录设备", merchant.id);
    await writeDb(db);
    return ok(res, merchantSecurityForApi(db, merchant.id));
  }

  if (req.method === "GET" && pathname === "/api/merchant/privacy") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantPrivacyForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "PUT" && pathname === "/api/merchant/privacy") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const settings = ensureMerchantSettings(merchant);
    const allowedKeys = ["orderReminder", "marketingNotice", "onlineStatusVisible", "supportContactAllowed"];
    if (body.privacy && typeof body.privacy === "object") {
      Object.entries(body.privacy).forEach(([key, value]) => {
        if (allowedKeys.includes(key)) settings.privacy[key] = Boolean(value);
      });
    }
    settings.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "更新商户隐私设置", merchant.id);
    await writeDb(db);
    return ok(res, merchantPrivacyForApi(db, merchant.id));
  }

  if (req.method === "GET" && pathname === "/api/merchant/permissions") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantPermissionsForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "PUT" && pathname === "/api/merchant/permissions") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const settings = ensureMerchantSettings(merchant);
    const key = String(body.key || "");
    if (!Object.prototype.hasOwnProperty.call(settings.permissions, key)) return fail(res, 400, "不支持的权限项");
    const nextStatus = body.status ? String(body.status) : nextMerchantPermissionStatus(key, settings.permissions[key]);
    settings.permissions[key] = nextStatus;
    const row = merchantPermissionRows(settings).find((item) => item.key === key);
    const previousPermissionRecords = settings.permissionRecords?.length ? settings.permissionRecords : defaultPermissionRecords();
    settings.permissionRecords = [
      {
        id: nextId(db, "merchantPermissionRecord", "mpr"),
        iconName: row?.iconName || "shield-check",
        title: row?.title?.replace("权限", "") || "权限",
        action: `${nextStatus}`,
        time: now(),
        color: row?.color || "blue",
      },
      ...previousPermissionRecords,
    ].slice(0, 8);
    settings.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "更新商户权限设置", `${key}/${nextStatus}`);
    await writeDb(db);
    return ok(res, merchantPermissionsForApi(db, merchant.id));
  }

  if (req.method === "GET" && pathname === "/api/merchant/settings") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantSettingsForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "PUT" && pathname === "/api/merchant/settings") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const settings = ensureMerchantSettings(merchant);
    if (body.notifications && typeof body.notifications === "object") {
      Object.entries(body.notifications).forEach(([key, value]) => {
        if (Object.prototype.hasOwnProperty.call(settings.notifications, key)) settings.notifications[key] = Boolean(value);
      });
    }
    if (body.common && typeof body.common === "object") {
      if (body.common.cacheSizeMb !== undefined) settings.common.cacheSizeMb = Math.max(0, Number(body.common.cacheSizeMb) || 0);
      ["language", "fontSize", "darkMode"].forEach((key) => {
        if (body.common[key] !== undefined) settings.common[key] = String(body.common[key] || "").trim();
      });
    }
    settings.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "保存商户设置", merchant.id);
    await writeDb(db);
    return ok(res, merchantSettingsForApi(db, merchant.id));
  }

  const merchantExportDownload = pathname.match(/^\/api\/merchant\/settings\/export\/([^/]+)$/);
  if (req.method === "GET" && merchantExportDownload) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const merchantId = url.searchParams.get("merchantId") || "merchant-001";
    const merchant = getMerchant(db, merchantId);
    if (!merchant) return fail(res, 404, "Merchant not found");
    const settings = normalizeMerchantSettings(merchant);
    const exportId = merchantExportDownload[1];
    return ok(res, {
      exportId,
      generatedAt: now(),
      merchant: {
        id: merchant.id,
        name: merchant.name,
        type: merchant.type,
        contact: merchant.contact,
        phone: merchant.phone,
        address: merchant.address,
        serviceCity: merchant.serviceCity,
      },
      settings: {
        notifications: settings.notifications,
        privacy: settings.privacy,
        permissions: settings.permissions,
        common: settings.common,
      },
      files: merchant.qualification?.files || [],
      services: (db.services || []).filter((item) => item.merchantId === merchant.id).map((item) => ({
        id: item.id,
        title: item.title,
        status: item.status,
        price: item.price,
      })),
    });
  }

  if (req.method === "POST" && pathname === "/api/merchant/settings/export") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const settings = ensureMerchantSettings(merchant);
    const exportId = nextId(db, "merchantDataExport", "mexp");
    settings.lastExportId = exportId;
    settings.lastExportAt = now();
    addMessage(db, "merchant", "个人信息导出已生成", `导出任务 ${exportId} 已生成，请在消息中心查看。`, {
      scenario: "商户设置",
      relatedType: "merchantDataExport",
      relatedId: exportId,
    });
    audit(db, actorName(auth, merchant.name), "导出商户个人信息", exportId);
    await writeDb(db);
    return ok(res, {
      exportId,
      status: "已生成",
      downloadUrl: `/api/merchant/settings/export/${exportId}`,
      settings: merchantSettingsForApi(db, merchant.id),
    });
  }

  if (req.method === "POST" && pathname === "/api/merchant/session/logout") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    audit(db, actorName(auth, merchant.name), "商户端退出登录", merchant.id);
    await writeDb(db);
    return ok(res, { merchantId: merchant.id, status: "已退出", sourceEndpoint: "/api/merchant/session/logout" });
  }

  if (req.method === "GET" && pathname === "/api/merchant/support") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantSupportForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "POST" && pathname === "/api/merchant/support/contact") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const support = merchantSupportForApi(db, merchant.id);
    const type = String(body.type || "online");
    const contact = {
      id: nextId(db, "merchantSupportContact", "msup"),
      merchantId: merchant.id,
      type,
      route: body.route || "09",
      phone: support.contacts.phone,
      email: support.contacts.email,
      createdAt: now(),
    };
    db.merchantSupportContacts = Array.isArray(db.merchantSupportContacts) ? db.merchantSupportContacts : [];
    db.merchantSupportContacts.unshift(contact);
    audit(db, actorName(auth, merchant.name), "商户客服触达", `${type}/${merchant.id}`);
    if (type !== "phone") {
      addMessage(db, "admin", "商户客服触达", `${merchant.name} 通过${type === "email" ? "邮箱" : "在线客服"}入口联系平台客服。`, {
        scenario: "商户客服",
        relatedType: "merchantSupportContact",
        relatedId: contact.id,
      });
    }
    await writeDb(db);
    return ok(res, {
      ...contact,
      support,
      telHref: `tel:${support.contacts.phone.replace(/[^\d+]/g, "")}`,
    });
  }

  if (req.method === "GET" && pathname === "/api/merchant/invoices") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantInvoicesForApi(
      db,
      url.searchParams.get("merchantId") || "merchant-001",
      url.searchParams.get("status") || "全部",
    ));
  }

  if (req.method === "GET" && pathname === "/api/merchant/invoices/apply") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantInvoiceApplyForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "POST" && pathname === "/api/merchant/invoices/apply") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const invoice = ensureMerchantInvoice(merchant);
    const orders = merchantInvoiceApplyOrders(db, merchant.id);
    const selectedIds = Array.isArray(body.selectedOrderIds) ? body.selectedOrderIds.map(String) : [];
    const selectedOrders = orders.filter((order) => selectedIds.includes(order.id) && order.invoiceable);
    if (!selectedOrders.length) return fail(res, 400, "请选择至少一笔可开票订单");
    const amount = selectedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
    const record = {
      id: nextId(db, "merchantInvoice", "invoice"),
      icon: "receipt-text",
      color: "blue",
      title: selectedOrders.length === 1 ? selectedOrders[0].title : `合并开票申请（${selectedOrders.length}笔订单）`,
      orderNo: selectedOrders.map((order) => order.orderNo).join(" / "),
      orderIds: selectedOrders.map((order) => order.id),
      appliedAt: now(),
      amount,
      status: "待开票",
      statusColor: "orange",
      action: "查看申请",
      invoiceType: body.invoiceType || invoice.invoiceType,
      delivery: body.delivery || invoice.delivery,
      email: body.email || invoice.email,
      note: String(body.note || "").trim(),
    };
    invoice.records = Array.isArray(invoice.records) ? invoice.records : [];
    invoice.records.unshift(record);
    merchant.invoiceApplyDraft = {
      selectedOrderIds: [],
      delivery: record.delivery,
      invoiceType: record.invoiceType,
      email: record.email,
      note: "",
      submittedAt: record.appliedAt,
      lastRecordId: record.id,
    };
    audit(db, actorName(auth, merchant.name), "提交商户开票申请", `${merchant.id}/${record.id}/${amount.toFixed(2)}`);
    addMessage(db, "admin", "新的商户开票申请", `${merchant.name} 提交 ${selectedOrders.length} 笔订单开票申请，金额 ¥ ${amount.toFixed(2)}。`, {
      scenario: "商户发票",
      relatedType: "merchantInvoice",
      relatedId: record.id,
    });
    addMessage(db, "merchant", "开票申请已提交", `开票申请 ${record.id} 已提交，${record.delivery} 将发送至 ${record.email || "预留接收方式"}。`, {
      scenario: "商户发票",
      relatedType: "merchantInvoice",
      relatedId: record.id,
    });
    await writeDb(db);
    return ok(res, {
      record,
      invoices: merchantInvoicesForApi(db, merchant.id, "全部"),
      apply: merchantInvoiceApplyForApi(db, merchant.id),
      sourceEndpoint: "/api/merchant/invoices/apply",
    });
  }

  if (req.method === "PUT" && pathname === "/api/merchant/invoices/preferences") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const invoice = ensureMerchantInvoice(merchant);
    ["invoiceType", "delivery", "email"].forEach((key) => {
      if (body[key] !== undefined) invoice[key] = String(body[key] || "").trim();
    });
    invoice.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "保存商户发票偏好", merchant.id);
    await writeDb(db);
    return ok(res, merchantInvoicesForApi(db, merchant.id, body.status || "全部"));
  }

  if (req.method === "GET" && pathname === "/api/merchant/dashboard") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, computeMerchantDashboard(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "GET" && pathname === "/api/merchant/stats") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { rows, ...payload } = computeMerchantStats(db, url.searchParams.get("merchantId") || "merchant-001");
    return ok(res, payload);
  }

  if (req.method === "GET" && pathname === "/api/merchant/functions/overview") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, {
      ...merchantFunctionOverviewForApi(db, url.searchParams.get("merchantId") || "merchant-001"),
      validation: validateMerchantFunctionOverview(),
      related: {
        dashboard: "/api/merchant/dashboard",
        stats: "/api/merchant/stats",
        services: "/api/merchant/services",
        orders: "/api/merchant/orders",
        reviews: "/api/merchant/reviews",
        exception: "/api/merchant/exception",
        adminMerchants: "/api/admin/merchants",
        adminServices: "/api/admin/services",
      },
    });
  }

  if (req.method === "GET" && (pathname === "/api/merchant/service-categories" || pathname === "/api/merchant/categories")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const merchantId = url.searchParams.get("merchantId") || "merchant-001";
    return ok(res, {
      ...merchantServiceCategoriesForApi(db),
      selection: merchantServiceCategorySelectionForApi(db, merchantId).draft,
      validation: validateMerchantServiceCategories(),
      related: {
        services: "/api/merchant/services",
        selection: "/api/merchant/service-categories/selection",
        publicServices: "/api/services",
        activitiesMap: "/api/activities/map",
        adminServices: "/api/admin/services",
        adminMerchants: "/api/admin/merchants",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/merchant/service-categories/selection") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return ok(res, merchantServiceCategorySelectionForApi(db, url.searchParams.get("merchantId") || "merchant-001"));
  }

  if (req.method === "POST" && pathname === "/api/merchant/service-categories/selection") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    if (!merchant) return fail(res, 404, "Merchant not found");
    const categories = merchantServiceCategoriesForApi(db).categories || [];
    const selected = categories.find((item) => item.id === body.categoryId || item.category === body.category);
    if (!selected) return fail(res, 400, "请选择有效服务分类");
    merchant.serviceDraft = {
      ...(merchant.serviceDraft || {}),
      categoryId: selected.id,
      category: selected.category,
      examples: selected.examples || [],
      qualification: selected.qualification || "",
      note: selected.note || "",
      serviceTitle: body.serviceTitle || merchant.serviceDraft?.serviceTitle || merchantServiceDraftTitle(selected.category),
      price: Number(body.price || merchant.serviceDraft?.price || 199),
      unit: body.unit || merchant.serviceDraft?.unit || "次",
      description: body.description || merchantServiceDraftDescription(selected.category, merchant.serviceDraft?.description),
      selectedAt: now(),
    };
    merchant.updatedAt = now();
    audit(db, actorName(auth, merchant.name), "选择商户服务分类", `${merchant.id}/${selected.category}`);
    await writeDb(db);
    return ok(res, merchantServiceCategorySelectionForApi(db, merchant.id));
  }

  if (req.method === "POST" && pathname === "/api/merchant/services") {
    const merchant = getMerchant(db, body.providerId || "merchant-001");
    const serviceDraft = merchant?.serviceDraft || {};
    const service = {
      id: nextId(db, "service", "service"),
      providerType: "merchant",
      providerId: body.providerId || "merchant-001",
      title: body.title || serviceDraft.serviceTitle || "新增商户服务",
      category: body.category || serviceDraft.category || "康养护理",
      price: Number(body.price || serviceDraft.price || 199),
      unit: body.unit || serviceDraft.unit || "次",
      status: body.status || "待审核",
      description: body.description || serviceDraft.description || "商户端提交的新服务，等待后台审核。",
    };
    db.services.unshift(service);
    audit(db, actorName(auth, merchant?.name || "云康护理中心"), "新增商户服务", service.title);
    addMessage(db, "admin", "商户新增服务待审核", `${service.title} 已由商户提交，请后台审核后上架。`);
    await writeDb(db);
    return ok(res, service);
  }

  const merchantServiceStatus = pathname.match(/^\/api\/merchant\/services\/([^/]+)\/status$/);
  if (req.method === "POST" && merchantServiceStatus) {
    const service = db.services.find((item) => item.id === merchantServiceStatus[1]);
    if (!service) return fail(res, 404, "Service not found");
    if (service.providerType !== "merchant") return fail(res, 400, "Only merchant services can be changed here");
    service.status = body.status || (service.status === "上架" ? "下架" : "上架");
    service.updatedAt = now();
    audit(db, actorName(auth, "云康护理中心"), "更新商户服务状态", `${service.title}/${service.status}`);
    addMessage(db, "admin", "商户服务状态变更", `${service.title} 已更新为 ${service.status}。`);
    await writeDb(db);
    return ok(res, service);
  }

  if (req.method === "GET" && pathname === "/api/merchant/orders") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const merchantId = url.searchParams.get("merchantId");
    let data = db.orders.filter((item) => item.providerType === "merchant");
    if (merchantId) data = data.filter((item) => !item.providerId || item.providerId === merchantId);
    return ok(res, data);
  }

  if (req.method === "GET" && pathname === "/api/merchant/reviews") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const merchantId = url.searchParams.get("merchantId") || "merchant-001";
    return ok(res, db.reviews.filter((item) => item.providerType === "merchant" && (!item.providerId || item.providerId === merchantId)).map((item) => enrichReview(db, item)));
  }

  if (req.method === "POST" && pathname === "/api/merchant/exception") {
    const merchant = getMerchant(db, body.merchantId || "merchant-001");
    const order = body.orderId
      ? db.orders.find((item) => item.id === body.orderId || item.orderNo === body.orderId)
      : db.orders.find((item) => item.providerType === "merchant" && (!item.providerId || item.providerId === merchant.id) && !["已完成", "已取消"].includes(item.status));
    if (!order) return fail(res, 404, "No active merchant order found");
    order.providerType = "merchant";
    order.providerId = merchant.id;
    order.assigneeName = merchant.name;
    const alert = {
      id: nextId(db, "alert", "alert"),
      elderId: order.userId || db.elderProfile.id,
      elderName: order.elderName || db.elderProfile.name,
      type: body.type || "商户服务异常",
      level: body.level || "中",
      location: body.location || order.location || db.elderProfile.address,
      status: "待处理",
      description: body.description || `${merchant.name}上报服务异常，请后台跟进处理。`,
      source: "商户端",
      orderId: order.id,
      createdAt: now(),
      handledBy: "",
    };
    db.alerts.unshift(alert);
    addTimeline(order, "异常上报", `${merchant.name}上报：${alert.description}`);
    addMessage(db, "admin", "商户服务异常待处理", `${merchant.name}上报 ${order.orderNo}：${alert.description}`, {
      scenario: "异常上报",
      priority: alert.level,
      relatedType: "alert",
      relatedId: alert.id,
    });
    if (body.notifyUser !== false) {
      addMessage(db, "user", "服务异常已上报", `${merchant.name}已上报服务异常，平台正在跟进处理。`, {
        scenario: "异常上报",
        priority: alert.level,
        relatedType: "alert",
        relatedId: alert.id,
      });
    }
    if (["高", "最高"].includes(alert.level)) {
      addMessage(db, "family", "服务异常提醒", `${order.elderName}的「${order.serviceType}」服务出现异常，平台正在处理。`, {
        scenario: "异常上报",
        priority: alert.level,
        relatedType: "alert",
        relatedId: alert.id,
      });
    }
    audit(db, actorName(auth, merchant.name), "商户异常上报", alert.id);
    await writeDb(db);
    return ok(res, { alert, order, merchant });
  }

  const merchantOrderAction = pathname.match(/^\/api\/merchant\/orders\/([^/]+)\/(quote|confirm|start|complete|reject|reschedule)$/);
  const merchantOrderGeneric = pathname.match(/^\/api\/merchant\/orders\/([^/]+)$/);
  if (req.method === "POST" && merchantOrderGeneric && !merchantOrderAction) {
    const actionAlias = body.action || body.status || "confirm";
    const actionMap = { accept: "confirm", 接单: "confirm", 确认: "confirm", 开始: "start", 完成: "complete", 拒绝: "reject", 改期: "reschedule" };
    const mappedAction = actionMap[actionAlias] || actionAlias;
    const validActions = ["quote", "confirm", "start", "complete", "reject", "reschedule"];
    if (!validActions.includes(mappedAction)) {
      return fail(res, 400, `不支持的操作：${actionAlias}，可选：${validActions.join(", ")}`);
    }
    const order = db.orders.find((item) => item.id === merchantOrderGeneric[1] || item.orderNo === merchantOrderGeneric[1]);
    if (!order) return fail(res, 404, "Order not found");
    const merchant = getMerchant(db, body.merchantId || order.providerId || "merchant-001");
    order.providerType = "merchant";
    order.providerId = merchant.id;
    order.assigneeName = merchant.name;
    // 幂等：若订单已在目标状态之后则直接返回成功
    const alreadyConfirmed = mappedAction === "confirm" && ["待服务", "服务中", "待确认", "已完成"].includes(order.status);
    if (alreadyConfirmed) {
      return ok(res, { order, status: order.status, action: mappedAction, idempotent: true });
    }
    if (mappedAction === "confirm") {
      ensureOrderTransition(order, "merchantConfirm");
      addTimeline(order, "待服务", "商户已确认预约");
      addMessage(db, "user", "商户已确认预约", `${merchant.name}已确认「${order.serviceType}」预约，请按约定时间等待服务。`, { scenario: "商户确认预约", priority: "P0", relatedType: "order", relatedId: order.id });
      addMessage(db, "admin", "商户已确认预约", `${merchant.name}已确认 ${order.orderNo}，用户将收到确认结果和服务方案。`, { scenario: "商户确认预约", priority: "P0", relatedType: "order", relatedId: order.id });
    }
    if (mappedAction === "start") {
      ensureOrderTransition(order, "merchantStart");
      order.startedAt = now();
      addTimeline(order, "服务中", "商户已开始服务");
    }
    if (mappedAction === "complete") {
      ensureOrderTransition(order, "merchantComplete");
      order.completedAt = now();
      addTimeline(order, "已完成", "商户已完成服务");
    }
    if (mappedAction === "reject") {
      ensureOrderTransition(order, "merchantReject");
      order.rejectReason = body.reason || "商户档期或服务能力暂不匹配";
      addTimeline(order, "已取消", `商户拒绝预约：${order.rejectReason}`);
    }
    if (mappedAction === "quote") {
      ensureOrderTransition(order, "merchantQuote");
      order.quote = { amount: Number(body.amount || order.amount), plan: body.plan || "基础护理评估方案", createdAt: now() };
      order.amount = order.quote.amount;
      addTimeline(order, "已报价", "商户已提交报价方案");
    }
    if (mappedAction === "reschedule") {
      ensureOrderTransition(order, "merchantReschedule");
      const oldTime = order.time;
      order.time = body.time || body.newTime || order.time;
      order.reschedule = { oldTime, newTime: order.time, reason: body.reason || "商户建议调整服务时间", createdAt: now() };
      addTimeline(order, "待服务", `商户发起改期：${oldTime || "原预约时间"} -> ${order.time}`);
    }
    audit(db, actorName(auth, merchant.name), `商户订单操作：${mappedAction}`, order.id);
    await writeDb(db);
    return ok(res, { action: mappedAction, order, merchant });
  }
  if (req.method === "POST" && merchantOrderAction) {
    const order = db.orders.find((item) => item.id === merchantOrderAction[1] || item.orderNo === merchantOrderAction[1]);
    if (!order) return fail(res, 404, "Order not found");
    const merchant = getMerchant(db, body.merchantId || order.providerId || "merchant-001");
    order.providerType = "merchant";
    order.providerId = merchant.id;
    order.assigneeName = merchant.name;
    const action = merchantOrderAction[2];
    if (action === "quote") {
      ensureOrderTransition(order, "merchantQuote");
      order.quote = { amount: Number(body.amount || order.amount), plan: body.plan || "基础护理评估方案", createdAt: now() };
      order.amount = order.quote.amount;
      addTimeline(order, "已报价", "商户已提交报价方案");
      addMessage(db, "user", "商户已提交报价", `${merchant.name}已为「${order.serviceType}」提交报价 ¥${order.amount}。`, {
        scenario: "商户确认预约",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
      addMessage(db, "admin", "商户已提交方案报价", `${merchant.name}已为 ${order.orderNo} 提交报价 ¥${order.amount}。`, {
        scenario: "商户确认预约",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
    }
    if (action === "confirm") {
      ensureOrderTransition(order, "merchantConfirm");
      addTimeline(order, "待服务", "商户已确认预约");
      addMessage(db, "user", "商户已确认预约", `${merchant.name}已确认「${order.serviceType}」预约，请按约定时间等待服务。`, {
        scenario: "商户确认预约",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
      addMessage(db, "admin", "商户已确认预约", `${merchant.name}已确认 ${order.orderNo}，用户将收到确认结果和服务方案。`, {
        scenario: "商户确认预约",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
    }
    if (action === "start") {
      ensureOrderTransition(order, "merchantStart");
      order.startedAt = now();
      addTimeline(order, "服务中", "商户已开始服务");
      addMessage(db, "user", "商户已开始服务", `${merchant.name}已开始「${order.serviceType}」服务，服务进度将持续同步。`, {
        scenario: "服务执行",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
      addMessage(db, "admin", "商户服务已开始", `${order.orderNo} 已由${merchant.name}开始服务。`, {
        scenario: "服务执行",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
    }
    if (action === "reject") {
      ensureOrderTransition(order, "merchantReject");
      order.rejectReason = body.reason || "商户档期或服务能力暂不匹配";
      addTimeline(order, "已取消", `商户拒绝预约：${order.rejectReason}`);
      addMessage(db, "user", "商户已拒绝预约", `${merchant.name}暂无法承接「${order.serviceType}」，原因：${order.rejectReason}。`, {
        scenario: "商户确认预约",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
      addMessage(db, "admin", "商户拒绝预约", `${merchant.name}已拒绝 ${order.orderNo}，请按需重新派单或联系用户。`, {
        scenario: "商户确认预约",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
    }
    if (action === "reschedule") {
      ensureOrderTransition(order, "merchantReschedule");
      const oldTime = order.time;
      order.time = body.time || body.newTime || order.time;
      order.reschedule = {
        oldTime,
        newTime: order.time,
        reason: body.reason || "商户建议调整服务时间",
        createdAt: now(),
      };
      addTimeline(order, "待服务", `商户发起改期：${oldTime || "原预约时间"} -> ${order.time}`);
      addMessage(db, "user", "商户已发起改期", `${merchant.name}建议将「${order.serviceType}」调整为 ${order.time}，请在订单中查看。`, {
        scenario: "商户确认预约",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
      addMessage(db, "admin", "商户已发起订单改期", `${merchant.name}已对 ${order.orderNo} 发起改期：${order.time}。`, {
        scenario: "商户确认预约",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
    }
    if (action === "complete") {
      ensureOrderTransition(order, "merchantComplete");
      addTimeline(order, "待确认", "商户已上传完成凭证");
      addMessage(db, "user", "服务待确认", `${merchant.name}已完成「${order.serviceType}」，请确认并评价。`, {
        scenario: "服务完成",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
      addMessage(db, "admin", "商户服务待用户确认", `${order.orderNo} 已由${merchant.name}提交完成。`, {
        scenario: "服务完成",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      });
    }
    const task = db.tasks.find((item) => item.orderId === order.id);
    if (task) {
      if (action === "quote") ensureTaskTransition(task, "merchantQuote");
      if (action === "confirm") ensureTaskTransition(task, "merchantConfirm");
      if (action === "start") {
        ensureTaskTransition(task, "merchantStart");
        task.startedAt = now();
      }
      if (action === "reject") ensureTaskTransition(task, "merchantReject");
      if (action === "reschedule") ensureTaskTransition(task, "merchantReschedule");
      if (action === "complete") ensureTaskTransition(task, "merchantComplete");
      task.updatedAt = now();
    }
    audit(db, actorName(auth, merchant.name), `商户订单${action}`, order.orderNo);
    await writeDb(db);
    return ok(res, order);
  }

  if (req.method === "GET" && pathname === "/api/admin/data-loop") {
    return ok(res, computeAdminDataLoop(db));
  }

  if (req.method === "GET" && pathname === "/api/admin/functions/overview") {
    return ok(res, {
      ...adminFunctionOverviewForApi(db),
      validation: validateAdminFunctionOverview(),
      related: {
        dashboard: "/api/admin/dashboard",
        users: "/api/admin/users",
        guides: "/api/admin/guides",
        merchants: "/api/admin/merchants",
        orders: "/api/admin/orders",
        dispatch: "/api/admin/dispatch/pending",
        alerts: "/api/admin/alerts",
        activities: "/api/admin/activities",
        screens: "/api/admin/screens",
        auditLogs: "/api/admin/audit-logs",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/screens") {
    return ok(res, {
      ...adminScreensForApi(db),
      validation: validateAdminDataScreens(),
      related: {
        dashboard: "/api/admin/dashboard",
        dataLoop: "/api/admin/data-loop",
        orders: "/api/admin/orders",
        alerts: "/api/admin/alerts",
        dispatch: "/api/admin/dispatch/pending",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/screens/elder-care") {
    const payload = adminScreensForApi(db);
    return ok(res, {
      ...payload.screens.find((item) => item.id === "elder-care-operations"),
      validation: validateAdminDataScreens(),
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/screens/guide-dispatch") {
    const payload = adminScreensForApi(db);
    return ok(res, {
      ...payload.screens.find((item) => item.id === "guide-dispatch-operations"),
      validation: validateAdminDataScreens(),
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/priority/status") {
    return ok(res, priorityDeliveryStatus(db));
  }

  if (req.method === "GET" && pathname === "/api/admin/mvp-delivery/completion") {
    return ok(res, mvpDeliveryCompletionForApi(db, {
      integrations: integrationStatus().integrations,
      hasResetEndpoint: true,
    }));
  }

  if (req.method === "GET" && pathname === "/api/integrations/status") {
    return ok(res, integrationStatus());
  }

  const integrationRequest = pathname.match(/^\/api\/integrations\/([^/]+)\/request$/);
  if (req.method === "POST" && integrationRequest) {
    const plan = integrationStatus().integrations.find((item) => item.id === integrationRequest[1]);
    if (!plan) return fail(res, 404, "Integration plan not found");
    const requestItem = {
      id: nextId(db, "serviceRequest", "req"),
      requestNo: nextNo(db, "serviceRequestNo", "REQ"),
      role: "admin",
      userId: auth?.sub || "admin-001",
      elderName: actorName(auth, "平台管理员"),
      route: "integration",
      action: "申请外部资源接入",
      type: plan.name,
      providerType: "external",
      status: "待处理",
      priority: "P2",
      description: body.description || plan.note,
      payload: { integrationId: plan.id, endpoint: plan.endpoint, ...body.payload },
      createdAt: now(),
      handledBy: "",
    };
    db.serviceRequests.unshift(requestItem);
    addMessage(db, "admin", "P2 集成接入请求", `${plan.name} 已生成接入请求，等待外部资源确认。`);
    audit(db, actorName(auth, "平台管理员"), "创建 P2 集成请求", `${plan.id}/${requestItem.requestNo}`);
    await writeDb(db);
    return ok(res, requestItem);
  }

  if (req.method === "GET" && pathname === "/api/admin/config") {
    return ok(res, {
      config: adminSystemConfig(db),
      related: {
        auditLogs: "/api/admin/audit-logs",
        systemModules: "/api/admin/system/modules",
        dataSchema: "/api/admin/database/schema",
      },
    });
  }

  if (req.method === "PUT" && pathname === "/api/admin/config") {
    const current = adminSystemConfig(db);
    const input = adminConfigInput(body);
    const updatedAt = now();
    const actor = actorName(auth, "平台管理员");
    const updated = normalizeAdminSystemConfig(deepMergeConfig(current, input));
    updated.status = "已保存待发布";
    updated.savedAt = updatedAt;
    updated.updatedAt = updatedAt;
    updated.savedBy = actor;
    updated.changeLogs = [
      {
        time: updatedAt,
        actor,
        module: body.module || "系统配置",
        field: body.field || "配置保存",
        before: current.version,
        after: updated.version,
        type: "保存",
      },
      ...updated.changeLogs,
    ].slice(0, 30);
    db.systemConfig = updated;
    audit(db, actor, "保存系统配置", updated.platform?.name || updated.version);
    await writeDb(db);
    return ok(res, { config: updated });
  }

  if (req.method === "POST" && pathname === "/api/admin/config/publish") {
    const current = adminSystemConfig(db);
    const publishedAt = now();
    const actor = actorName(auth, "平台管理员");
    current.version = body.version || nextAdminSystemConfigVersion(current.version);
    current.savedAt = publishedAt;
    current.publishedAt = publishedAt;
    current.updatedAt = publishedAt;
    current.savedBy = actor;
    current.publishedBy = actor;
    current.status = "已发布";
    current.environments = (current.environments || []).map((item) => ({
      ...item,
      status: "运行中",
      version: item.name === "生产环境" ? current.version : `${current.version}${item.name === "预发布环境" ? "-rc.1" : "-test.1"}`,
    }));
    current.releaseLogs = [
      { version: current.version, time: publishedAt, operator: actor, environment: body.environment || "生产环境", status: "当前" },
      ...(current.releaseLogs || []).map((item, index) => ({ ...item, status: index === 0 && item.status === "当前" ? "历史" : item.status })),
    ].slice(0, 20);
    current.changeLogs = [
      {
        time: publishedAt,
        actor,
        module: "系统配置",
        field: "发布配置",
        before: body.note || "待发布配置",
        after: current.version,
        type: "发布",
      },
      ...(current.changeLogs || []),
    ].slice(0, 30);
    db.systemConfig = normalizeAdminSystemConfig(current);
    audit(db, actor, "发布系统配置", `${current.version}/${body.environment || "生产环境"}`);
    addMessage(db, "admin", "系统配置已发布", `${actor} 已发布 ${current.version} 到${body.environment || "生产环境"}。`);
    await writeDb(db);
    return ok(res, { config: db.systemConfig });
  }

  if (req.method === "POST" && pathname === "/api/admin/config/reset") {
    const actor = actorName(auth, "平台管理员");
    const current = adminSystemConfig(db);
    const resetAt = now();
    const resetConfig = defaultAdminSystemConfig();
    resetConfig.version = current.version || resetConfig.version;
    resetConfig.publishedAt = current.publishedAt || resetConfig.publishedAt;
    resetConfig.publishedBy = current.publishedBy || resetConfig.publishedBy;
    resetConfig.status = "已保存待发布";
    resetConfig.savedAt = resetAt;
    resetConfig.updatedAt = resetAt;
    resetConfig.savedBy = actor;
    resetConfig.changeLogs = [
      {
        time: resetAt,
        actor,
        module: "系统配置",
        field: "恢复默认",
        before: current.platform?.name || current.version,
        after: resetConfig.platform.name,
        type: "恢复默认",
      },
      ...(current.changeLogs || []),
    ].slice(0, 30);
    db.systemConfig = normalizeAdminSystemConfig(resetConfig);
    audit(db, actor, "恢复默认系统配置", body.note || resetConfig.platform.name);
    await writeDb(db);
    return ok(res, { config: db.systemConfig });
  }

  if (req.method === "GET" && pathname === "/api/admin/users") {
    return ok(res, {
      users: db.users.map((user) => ({
        ...user,
        orderCount: db.orders.filter((order) => order.userId === user.id).length,
        unreadMessages: db.messages.filter((message) => message.toRole === messageRole(user.role) && !message.read).length,
      })),
      elderProfiles: [db.elderProfile],
      familyContacts: db.familyContacts,
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/health-records") {
    return ok(res, {
      elder: db.elderProfile,
      familyContacts: db.familyContacts,
      records: db.healthRecords,
      devices: db.devices,
      alerts: db.alerts.filter((item) => item.elderId === db.elderProfile.id),
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/services") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const status = url.searchParams.get("status");
    const providerType = url.searchParams.get("providerType");
    let data = db.services.map((item) => enrichService(db, item));
    if (status) data = data.filter((item) => item.status === status);
    if (providerType) data = data.filter((item) => item.providerType === providerType);
    return ok(res, data);
  }

  if (req.method === "POST" && pathname === "/api/admin/services") {
    if (!body.title && !body.name) return fail(res, 400, "服务标题/名称不能为空");
    const newService = {
      id: nextId(db, "service", "service"),
      title: body.title || body.name,
      category: body.category || "轻服务",
      price: Number(body.price) || 100,
      unit: body.unit || "次",
      description: body.description || "",
      status: body.status || "上架",
      providerType: body.providerType || "guide",
      providerId: body.providerId || "",
      providerName: body.providerName || "",
      orderCount: 0,
      createdAt: now(),
      updatedAt: now(),
    };
    db.services.unshift(newService);
    audit(db, actorName(auth, "平台管理员"), "新增服务", newService.title);
    addMessage(db, "admin", "新增服务", `平台已创建服务「${newService.title}」，状态：${newService.status}。`);
    await writeDb(db);
    return ok(res, newService);
  }

  const adminServiceStatus = pathname.match(/^\/api\/admin\/services\/([^/]+)\/status$/);
  if (req.method === "POST" && adminServiceStatus) {
    const service = db.services.find((item) => item.id === adminServiceStatus[1]);
    if (!service) return fail(res, 404, "Service not found");
    service.status = body.status || (service.status === "上架" ? "下架" : "上架");
    service.reviewNote = body.note || "";
    service.updatedAt = now();
    audit(db, actorName(auth, "平台管理员"), "审核/更新服务", `${service.title}/${service.status}`);
    addMessage(db, service.providerType === "merchant" ? "merchant" : "guide", "服务上下架结果", `${service.title} 已${service.status}。`);
    await writeDb(db);
    return ok(res, enrichService(db, service));
  }

  if (req.method === "GET" && pathname === "/api/admin/reviews") {
    return ok(res, db.reviews.map((item) => enrichReview(db, item)));
  }

  if (req.method === "GET" && pathname === "/api/admin/guides") {
    return ok(res, db.guides.map((guide) => {
      const aggregate = computeGuideStats(db, guide.id);
      return {
        ...guide,
        incomeToday: aggregate.stats.todayIncome,
        monthlyOrders: aggregate.stats.monthlyOrders,
        orderCount: aggregate.stats.orderCount,
        completedOrders: aggregate.stats.completedOrders,
        settlementPending: aggregate.stats.settlementPending,
        taskCount: aggregate.stats.activeTasks,
        reviewCount: aggregate.stats.reviewCount,
        stats: aggregate.stats,
      };
    }));
  }

  if (req.method === "POST" && pathname === "/api/admin/guides/import") {
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return fail(res, 400, "没有可导入的向导数据");
    const existingIds = new Set(db.guides.map((item) => item.id).filter(Boolean));
    let createdCount = 0;
    let ignoredCount = 0;
    items.forEach((item) => {
      if (item.id && existingIds.has(item.id)) {
        ignoredCount += 1;
        return;
      }
      const guide = {
        id: item.id || nextId(db, "guide", "guide"),
        userId: item.userId || "",
        realName: item.realName || "导入向导",
        serviceTypes: Array.isArray(item.serviceTypes) ? item.serviceTypes : [item.serviceTypes || "陪伴就医"],
        area: item.area || "昆明市",
        status: item.status || "待审核",
        onlineStatus: item.onlineStatus || "离线",
        currentStatus: item.currentStatus || "休息中",
        rating: Number(item.rating || 4.6),
        monthlyOrders: Number(item.monthlyOrders || 0),
        incomeToday: Number(item.incomeToday || 0),
        distanceKm: Number(item.distanceKm || 3),
        createdAt: now(),
      };
      db.guides.unshift(guide);
      existingIds.add(guide.id);
      createdCount += 1;
    });
    audit(db, actorName(auth, "平台管理员"), "导入向导", `${body.sourceFile || "guide-import"}/${createdCount}`);
    await writeDb(db);
    return ok(res, { createdCount, ignoredCount, total: items.length });
  }

  const adminGuideAudit = pathname.match(/^\/api\/admin\/guides\/([^/]+)\/audit$/);
  if (req.method === "POST" && adminGuideAudit) {
    const guide = db.guides.find((item) => item.id === adminGuideAudit[1]);
    if (!guide) return fail(res, 404, "Guide not found");
    const decision = body.decision || body.status || "通过审核";
    guide.status = body.status || (/驳回|拒绝/.test(decision) ? "已驳回" : /补充/.test(decision) ? "待补充" : "已认证");
    guide.auditNote = body.note || decision;
    guide.auditAt = now();
    if (guide.status !== "已认证") {
      guide.onlineStatus = "离线";
      guide.currentStatus = "休息中";
    }
    audit(db, actorName(auth, "平台管理员"), "审核向导", `${guide.realName}/${guide.status}`);
    addMessage(db, "guide", "向导审核结果", `${guide.realName} 审核结果：${guide.status}。`);
    await writeDb(db);
    return ok(res, guide);
  }

  if (req.method === "GET" && pathname === "/api/admin/merchants") {
    return ok(res, db.merchants.map((merchant) => {
      const aggregate = computeMerchantStats(db, merchant.id);
      return {
        ...merchant,
        settlementPending: aggregate.stats.settlementPending,
        serviceCount: aggregate.stats.serviceCount,
        orderCount: aggregate.stats.orderCount,
        completedOrders: aggregate.stats.completedOrders,
        revenue: aggregate.stats.revenue,
        reviewCount: aggregate.stats.reviewCount,
        stats: aggregate.stats,
      };
    }));
  }

  if (req.method === "POST" && pathname === "/api/admin/merchants/import") {
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return fail(res, 400, "没有可导入的商户数据");
    const existingIds = new Set(db.merchants.map((item) => item.id).filter(Boolean));
    let createdCount = 0;
    let ignoredCount = 0;
    items.forEach((item) => {
      if (item.id && existingIds.has(item.id)) {
        ignoredCount += 1;
        return;
      }
      const merchant = {
        id: item.id || nextId(db, "merchant", "merchant"),
        name: item.name || "导入商户",
        type: item.type || "康养护理",
        license: item.license || `YLYY-IMPORT-${createdCount + 1}`,
        contact: item.contact || "平台联系人",
        phone: item.phone || "",
        address: item.address || "云南省 昆明市",
        status: item.status || "待审核",
        rating: Number(item.rating || 4.6),
        settlementPending: Number(item.settlementPending || 0),
        createdAt: now(),
      };
      db.merchants.unshift(merchant);
      existingIds.add(merchant.id);
      createdCount += 1;
    });
    audit(db, actorName(auth, "平台管理员"), "导入商户", `${body.sourceFile || "merchant-import"}/${createdCount}`);
    await writeDb(db);
    return ok(res, { createdCount, ignoredCount, total: items.length });
  }

  const adminMerchantAudit = pathname.match(/^\/api\/admin\/merchants\/([^/]+)\/audit$/);
  if (req.method === "POST" && adminMerchantAudit) {
    const merchant = db.merchants.find((item) => item.id === adminMerchantAudit[1]);
    if (!merchant) return fail(res, 404, "Merchant not found");
    const decision = body.decision || body.status || "通过入驻";
    merchant.status = body.status || (/驳回|拒绝/.test(decision) ? "已驳回" : /补充/.test(decision) ? "待补充" : "已通过");
    merchant.auditNote = body.note || decision;
    merchant.auditAt = now();
    audit(db, actorName(auth, "平台管理员"), "审核商户", `${merchant.name}/${merchant.status}`);
    addMessage(db, "merchant", "商户审核结果", `${merchant.name} 入驻审核结果：${merchant.status}。`);
    await writeDb(db);
    return ok(res, merchant);
  }

  if (req.method === "GET" && pathname === "/api/admin/activities") {
    return ok(res, {
      activities: db.activities,
      signups: db.activitySignups,
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/content/home") {
    return ok(res, {
      ...userHomeRequirementsForApi(db),
      validation: validateUserHomeRequirements(),
      editable: {
        banner: ["image", "title", "slogan", "status"],
        cityOptions: true,
      },
    });
  }

  if (req.method === "PUT" && pathname === "/api/admin/content/home") {
    const config = updateHomeConfig(db, body, actorName(auth, "平台管理员"));
    audit(db, actorName(auth, "平台管理员"), "更新首页内容配置", config.banner.title);
    addMessage(db, "user", "首页内容已更新", `${config.banner.title} 已发布到首页 Banner。`);
    await writeDb(db);
    return ok(res, {
      config,
      home: userHomeRequirementsForApi(db),
      validation: validateUserHomeRequirements(),
    });
  }

  if (req.method === "POST" && pathname === "/api/admin/activities") {
    const activity = {
      id: nextId(db, "activity", "activity"),
      title: body.title || "新建旅居活动",
      category: body.category || "文化体验",
      time: body.time || now(),
      location: body.location || db.elderProfile.address,
      coordinates: body.coordinates || { lng: 102.7076, lat: 25.0464 },
      quota: Number(body.quota || 30),
      joined: 0,
      status: body.status || "报名中",
      cover: body.cover || "/user/assets/activity-calligraphy.jpg",
      createdAt: now(),
    };
    db.activities.unshift(activity);
    audit(db, actorName(auth, "平台管理员"), "创建活动", activity.title);
    addMessage(db, "user", "新活动上线", `${activity.title} 已开放报名。`);
    await writeDb(db);
    return ok(res, activity);
  }

  const adminActivityStatus = pathname.match(/^\/api\/admin\/activities\/([^/]+)\/status$/);
  if (req.method === "POST" && adminActivityStatus) {
    const activity = db.activities.find((item) => item.id === adminActivityStatus[1]);
    if (!activity) return fail(res, 404, "Activity not found");
    activity.status = body.status || (activity.status === "报名中" ? "已下线" : "报名中");
    activity.updatedAt = now();
    audit(db, actorName(auth, "平台管理员"), "更新活动状态", `${activity.title}/${activity.status}`);
    addMessage(db, "user", "活动状态更新", `${activity.title} 当前状态：${activity.status}。`);
    await writeDb(db);
    return ok(res, activity);
  }

  if (req.method === "GET" && pathname === "/api/admin/dashboard") {
    return ok(res, computeDashboard(db));
  }

  if (req.method === "GET" && pathname === "/api/admin/orders") {
    return ok(res, db.orders);
  }

  if (req.method === "GET" && (pathname === "/api/admin/dispatch/pending" || pathname === "/api/admin/dispatch")) {
    return ok(res, computeDispatchQueue(db));
  }

  if (req.method === "GET" && pathname === "/api/admin/alerts") {
    return ok(res, db.alerts);
  }

  if (req.method === "POST" && pathname === "/api/admin/alerts/import") {
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return fail(res, 400, "没有可导入的异常事件数据");
    const existingIds = new Set(db.alerts.map((item) => item.id).filter(Boolean));
    let createdCount = 0;
    let ignoredCount = 0;
    items.forEach((item) => {
      if (item.id && existingIds.has(item.id)) {
        ignoredCount += 1;
        return;
      }
      const alert = {
        id: item.id || nextId(db, "alert", "alert"),
        elderId: item.elderId || db.elderProfile?.id || "elder-001",
        elderName: item.elderName || db.elderProfile?.name || "未命名老人",
        type: item.type || "设备离线",
        level: item.level || "中",
        location: item.location || db.elderProfile?.address || "云南省 昆明市",
        status: item.status || "待处理",
        description: item.description || "后台批量导入异常事件",
        createdAt: item.createdAt || now(),
        handledBy: item.handledBy || "",
      };
      db.alerts.unshift(alert);
      existingIds.add(alert.id);
      createdCount += 1;
    });
    audit(db, actorName(auth, "平台管理员"), "导入异常事件", `${body.sourceFile || "alert-import"}/${createdCount}`);
    await writeDb(db);
    return ok(res, { createdCount, ignoredCount, total: items.length });
  }

  if (req.method === "GET" && pathname === "/api/admin/dispatch/candidates") {
    return ok(res, {
      guides: db.guides.filter((item) => item.status === "已认证").sort((a, b) => a.distanceKm - b.distanceKm),
      merchants: db.merchants.filter((item) => item.status === "已通过"),
    });
  }

  if (req.method === "POST" && pathname === "/api/admin/dispatch/notify") {
    const order = body.orderId
      ? db.orders.find((item) => item.id === body.orderId || item.orderNo === body.orderId)
      : db.orders.find((item) => item.status === "待派单");
    if (!order) return fail(res, 404, "暂无可通知的调度订单");
    const provider = resolveProvider(db, order, body);
    addMessage(
      db,
      provider.assigneeType,
      "调度提醒",
      `${order.orderNo} / ${order.elderName} 的「${order.serviceType}」请及时处理。`,
      {
        scenario: "任务调度提醒",
        priority: "P0",
        relatedType: "order",
        relatedId: order.id,
      },
    );
    audit(db, actorName(auth, "平台管理员"), "通知执行方", `${order.orderNo} -> ${provider.assigneeName}`);
    await writeDb(db);
    return ok(res, {
      orderId: order.id,
      orderNo: order.orderNo,
      assigneeType: provider.assigneeType,
      assigneeId: provider.assigneeId,
      assigneeName: provider.assigneeName,
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/system/modules") {
    const tableNames = schemaForApi().map((table) => table.table);
    return ok(res, {
      source: "9.1 系统模块架构",
      ...systemModulesForApi(),
      validation: validateSystemModules({ tableNames }),
      related: {
        apiContract: "/api/reference",
        dataSchema: "/api/admin/database/schema",
        priorityStatus: "/api/admin/priority/status",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/system/technology") {
    return ok(res, {
      source: "技术选型与部署架构建议",
      ...technologyStackForApi(),
      validation: validateTechnologyStack(),
      related: {
        systemModules: "/api/admin/system/modules",
        apiContract: "/api/reference",
        dataSchema: "/api/admin/database/schema",
        integrations: "/api/integrations/status",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/system/collaboration") {
    return ok(res, {
      source: "8. 跨端协同与通知机制",
      ...collaborationForApi(),
      validation: validateCollaborationRules(),
      runtime: computeCollaborationRuntime(db),
      related: {
        messages: "/api/messages",
        alerts: "/api/alerts",
        orders: "/api/orders",
        modules: "/api/admin/system/modules",
        integrations: "/api/integrations/status",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/database/schema") {
    const dbStatus = await database.status();
    return ok(res, {
      version: dbStatus.schemaVersion,
      source: "10.1 核心数据表建议",
      tables: schemaForApi(),
      validation: validateCoreTables(db),
      ddl: "database/schema.sql",
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/database/status") {
    return ok(res, await database.status());
  }

  if (req.method === "POST" && pathname === "/api/admin/database/snapshot") {
    const file = await database.snapshot(body.label || "admin");
    audit(db, actorName(auth, "平台管理员"), "创建数据库快照", path.basename(file));
    await writeDb(db);
    return ok(res, { file });
  }

  if (req.method === "POST" && pathname === "/api/admin/demo/reset") {
    const snapshotFile = await database.snapshot("before-demo-reset");
    const resetStatus = await database.reset();
    const resetDb = await readDb();
    audit(resetDb, actorName(auth, "平台管理员"), "重置演示数据", path.basename(snapshotFile));
    addMessage(resetDb, "admin", "演示数据已重置", "订单、任务、消息、评价等数据已恢复为种子状态。");
    await writeDb(resetDb);
    return ok(res, {
      status: await database.status(),
      snapshotFile,
      resetAt: now(),
      seedFile: resetStatus.seedFile,
    });
  }

  if (req.method === "POST" && pathname === "/api/admin/demo/create-subjects") {
    const suffix = String(body.suffix || Date.now()).replace(/\D/g, "").slice(-6) || "000001";
    const createdAt = now();
    const elderUser = {
      id: nextId(db, "user", "user"),
      phone: body.elderPhone || `138${suffix.padStart(8, "0").slice(0, 8)}`,
      nickname: body.elderName || "验收老人",
      role: "elder",
      avatar: "/user/assets/avatar-user.jpg",
      status: "正常",
    };
    const familyUser = {
      id: nextId(db, "user", "user"),
      phone: body.familyPhone || `139${suffix.padStart(8, "0").slice(0, 8)}`,
      nickname: body.familyName || "验收家属",
      role: "family",
      avatar: "/user/assets/avatar-daughter.jpg",
      status: "正常",
    };
    const guideUser = {
      id: nextId(db, "user", "user"),
      phone: body.guidePhone || `136${suffix.padStart(8, "0").slice(0, 8)}`,
      nickname: body.guideName || "验收向导",
      role: "guide",
      avatar: "/guide/assets/guide-avatar-li.png",
      status: "正常",
    };
    const merchantUser = {
      id: nextId(db, "user", "user"),
      phone: body.merchantPhone || `137${suffix.padStart(8, "0").slice(0, 8)}`,
      nickname: body.merchantName || "验收商户",
      role: "merchant",
      avatar: "/merchant/assets/brand-logo.png",
      status: "正常",
    };
    db.users.unshift(merchantUser, guideUser, familyUser, elderUser);

    const contact = {
      id: nextId(db, "familyContact", "contact"),
      elderId: body.elderId || db.elderProfile?.id || "elder-001",
      name: familyUser.nickname,
      relation: "女儿",
      phone: familyUser.phone,
      isDefault: false,
      notifyAlert: true,
    };
    db.familyContacts.unshift(contact);

    const guide = {
      id: nextId(db, "guide", "guide"),
      userId: guideUser.id,
      realName: guideUser.nickname,
      serviceTypes: ["陪伴就医", "护工护理", "生活陪伴"],
      area: body.guideArea || "昆明市五华区",
      status: "待审核",
      onlineStatus: "离线",
      currentStatus: "待审核",
      rating: 5,
      monthlyOrders: 0,
      incomeToday: 0,
      distanceKm: 2.1,
      createdAt,
    };
    db.guides.unshift(guide);

    const merchant = {
      id: nextId(db, "merchant", "merchant"),
      name: merchantUser.nickname,
      type: body.merchantType || "康养护理",
      license: `YSS-${suffix}`,
      contact: body.merchantContact || "验收联系人",
      phone: merchantUser.phone,
      address: body.merchantAddress || "昆明市五华区验收服务中心",
      status: "待审核",
      rating: 5,
      settlementPending: 0,
      createdAt,
    };
    db.merchants.unshift(merchant);

    const merchantService = {
      id: nextId(db, "service", "service"),
      providerType: "merchant",
      providerId: merchant.id,
      title: body.serviceTitle || "验收上门护理服务",
      category: body.serviceCategory || "康养护理",
      price: Number(body.servicePrice || 268),
      unit: "次",
      status: "待审核",
      description: "综合验收脚本创建的商户服务，用于验证商户端、用户端和后台互通。",
    };
    db.services.unshift(merchantService);

    audit(db, actorName(auth, "平台管理员"), "创建验收主体", `${elderUser.nickname}/${guide.realName}/${merchant.name}`);
    addMessage(db, "admin", "验收主体已创建", `${elderUser.nickname}、${guide.realName}、${merchant.name} 已写入演示数据库。`);
    await writeDb(db);
    return ok(res, {
      user: elderUser,
      familyUser,
      familyContact: contact,
      guideUser,
      guide,
      merchantUser,
      merchant,
      merchantService,
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/policies") {
    return ok(res, { items: adminPolicyDocs(db) });
  }

  if (req.method === "POST" && pathname === "/api/admin/policies/import") {
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return fail(res, 400, "没有可导入的政策指南数据");
    const policies = adminPolicyDocs(db);
    const existingIds = new Set(policies.map((item) => item.id).filter(Boolean));
    let createdCount = 0;
    let ignoredCount = 0;
    items.forEach((item) => {
      const importedId = item.id || nextId(db, "policy", "policy");
      if (existingIds.has(importedId)) {
        ignoredCount += 1;
        return;
      }
      policies.unshift({
        id: importedId,
        title: item.title || `政策指南${createdCount + 1}`,
        category: item.category || "旅居政策",
        city: item.city || "全国",
        views: Number(item.views || 0),
        favorites: Number(item.favorites || 0),
        status: item.status || "待审核",
        updatedAt: item.updatedAt || now(),
        updatedBy: item.updatedBy || actorName(auth, "平台管理员"),
        source: item.source || body.sourceFile || "后台导入",
        summary: item.summary || "",
        content: item.content || "",
      });
      existingIds.add(importedId);
      createdCount += 1;
    });
    audit(db, actorName(auth, "平台管理员"), "导入政策指南", `${body.sourceFile || "policy-import"}/${createdCount}`);
    await writeDb(db);
    return ok(res, { createdCount, ignoredCount, total: items.length });
  }

  if (req.method === "GET" && pathname === "/api/admin/knowledge") {
    return ok(res, { items: adminKnowledgeItems(db) });
  }

  if (req.method === "POST" && pathname === "/api/admin/knowledge/import") {
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return fail(res, 400, "没有可导入的知识数据");
    const knowledge = adminKnowledgeItems(db);
    const existingIds = new Set(knowledge.map((item) => item.id).filter(Boolean));
    let createdCount = 0;
    let ignoredCount = 0;
    items.forEach((item) => {
      const importedId = item.id || nextId(db, "knowledge", "knowledge");
      if (existingIds.has(importedId)) {
        ignoredCount += 1;
        return;
      }
      knowledge.unshift({
        id: importedId,
        title: item.title || `知识条目${createdCount + 1}`,
        category: item.category || "其他",
        city: item.city || "全国",
        source: item.source || body.sourceFile || "后台导入",
        updater: item.updater || item.updatedBy || actorName(auth, "平台管理员"),
        status: item.status || "待审核",
        hits: Number(item.hits || 0),
        summary: item.summary || "",
        content: item.content || "",
      });
      existingIds.add(importedId);
      createdCount += 1;
    });
    audit(db, actorName(auth, "平台管理员"), "导入知识库", `${body.sourceFile || "knowledge-import"}/${createdCount}`);
    await writeDb(db);
    return ok(res, { createdCount, ignoredCount, total: items.length });
  }

  if (req.method === "POST" && pathname === "/api/admin/users/import") {
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return fail(res, 400, "没有可导入的用户数据");
    const existingIds = new Set(db.users.map((item) => item.id).filter(Boolean));
    const existingPhones = new Set(db.users.map((item) => item.phone).filter(Boolean));
    let createdCount = 0;
    let ignoredCount = 0;
    items.forEach((item) => {
      if ((item.id && existingIds.has(item.id)) || (item.phone && existingPhones.has(item.phone))) {
        ignoredCount += 1;
        return;
      }
      const user = {
        id: item.id || nextId(db, "user", "user"),
        phone: item.phone || "",
        nickname: item.nickname || "导入用户",
        role: "elder",
        avatar: item.avatar || "/user/assets/avatar-user.jpg",
        status: item.status || "正常",
      };
      db.users.unshift(user);
      existingIds.add(user.id);
      if (user.phone) existingPhones.add(user.phone);
      createdCount += 1;
    });
    audit(db, actorName(auth, "平台管理员"), "导入用户", `${body.sourceFile || "user-import"}/${createdCount}`);
    await writeDb(db);
    return ok(res, { createdCount, ignoredCount, total: items.length });
  }

  if (req.method === "GET" && pathname === "/api/admin/audit-logs") {
    return ok(res, db.auditLogs.slice(0, 100));
  }

  if (req.method === "GET" && pathname === "/api/admin/ui-actions") {
    return ok(res, db.uiActions.slice(0, 100));
  }

  return fail(res, 404, `API route not found: ${pathname}`);
}

function serveStatic(req, res, pathname) {
  if (["/user", "/guide", "/merchant", "/admin", "/ui-ref", "/prototype/user", "/prototype/guide", "/prototype/merchant", "/prototype/admin"].includes(pathname)) {
    res.writeHead(302, { Location: `${pathname}/` });
    res.end();
    return true;
  }

  const mount = staticMounts.find((item) => pathname.startsWith(item.prefix));
  if (!mount) return false;

  let relative = pathname.slice(mount.prefix.length);
  if (!relative || relative.endsWith("/")) relative = `${relative}index.html`;

  let decoded;
  try {
    decoded = decodeURIComponent(relative);
  } catch (error) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return true;
  }

  const filePath = path.normalize(path.join(mount.dir, decoded));
  const outside = path.relative(mount.dir, filePath).startsWith("..");
  if (outside) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return true;
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    if (mount.prefix !== "/" && !path.extname(filePath)) {
      const indexPath = path.join(mount.dir, "index.html");
      res.writeHead(200, { "Content-Type": mime[".html"], "Cache-Control": "no-store" });
      fs.createReadStream(indexPath).pipe(res);
      return true;
    }
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  const cacheControl = [".html", ".js", ".css"].includes(ext) ? "no-store" : "public, max-age=3600";
  res.writeHead(200, {
    "Content-Type": mime[ext] || "application/octet-stream",
    "Cache-Control": cacheControl,
  });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const apiPathname = canonicalApiPath(pathname);

    if (apiPathname.startsWith("/api/")) {
      await handleApi(req, res, apiPathname);
      return;
    }

    if (serveStatic(req, res, pathname)) return;

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  } catch (error) {
    fail(res, error.status || 500, error.message, error.code);
  }
});

ensureDb().then(() => {
  server.listen(PORT, () => {
    console.log(`云旅无忧 MVP running at http://localhost:${PORT}`);
    console.log(`用户端 H5: http://localhost:${PORT}/user/`);
    console.log(`向导端 H5: http://localhost:${PORT}/guide/`);
    console.log(`商户端 H5: http://localhost:${PORT}/merchant/`);
    console.log(`管理后台: http://localhost:${PORT}/admin/`);
    console.log(`微信小程序工程: ${path.join(__dirname, "uniapp/dist/build/mp-weixin")}`);
    console.log(`iOS/Android App 构建资源: ${path.join(__dirname, "uniapp/dist/build/app")}`);
  });
}).catch((error) => {
  console.error("云旅无忧 MVP failed to start", error);
  process.exit(1);
});
