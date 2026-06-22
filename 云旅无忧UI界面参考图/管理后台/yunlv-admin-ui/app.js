const app = document.getElementById("app");
let toastTimer = null;
const ADMIN_ASSET_VERSION = "20260614-admin-asset-cache1";
const ADMIN_AMAP_KEY = "ed0e2af40e4b73e90525252ff8fd52a8";
const ADMIN_AMAP_SECURITY_JS_CODE = "6a88c94ef10f6366e3cc20f337edd8fb";
const ADMIN_MAP_LOAD_TIMEOUT_MS = 6500;
const ADMIN_PERMISSION_PEOPLE_KEY = "yunlv-admin-permission-people";
const ADMIN_PERMISSION_LOG_KEY = "yunlv-admin-permission-logs";
const ADMIN_PERMISSION_SESSION_KEY = "yunlv-admin-permission-session";
const ADMIN_DEFAULT_ACCOUNT = "admin";
const ADMIN_DEFAULT_PASSWORD = "admin123456";
const adminScreenState = {
  loading: false,
  loaded: false,
  error: "",
  data: null,
  token: "",
  tokenPromise: null,
};
const adminFunctionOverviewState = {
  loading: false,
  loaded: false,
  error: "",
  data: null,
};
const adminDashboardState = {
  loading: false,
  loaded: false,
  error: "",
  data: null,
};
const adminMessageState = {
  loading: false,
  loaded: false,
  error: "",
  messages: [],
  unread: 0,
};
const adminNotificationState = {
  filter: "all",
  keyword: "",
  notice: "",
};
const adminUserState = {
  loading: false,
  loaded: false,
  error: "",
  users: [],
  elderProfiles: [],
  familyContacts: [],
  selectedUserId: "",
};
const adminGuideState = {
  loading: false,
  loaded: false,
  error: "",
  guides: [],
  selectedGuideId: "",
};
const adminAuditState = {
  loading: false,
  loaded: false,
  error: "",
  logs: [],
};
const adminMapState = {
  zoom: 8,
  selectedCity: "",
  selectedPointId: "",
  loading: false,
  sdkReady: false,
  sdkError: "",
  map: null,
  markers: [],
  promise: null,
};
const adminMerchantState = {
  loading: false,
  loaded: false,
  error: "",
  merchants: [],
  services: [],
};
const adminReferenceContentState = {
  policiesLoading: false,
  policiesLoaded: false,
  knowledgeLoading: false,
  knowledgeLoaded: false,
  error: "",
  policies: [],
  knowledge: [],
};
const adminContentCalendarState = {
  year: 2024,
  month: 4,
  day: 19,
};
const adminActivityState = {
  selectedId: "act-taiji",
  rows: [],
};
const adminContentViewState = {
  activeTab: "banner",
};
const adminUiState = {
  sidebarCollapsed: false,
  refreshSeq: 0,
  accountMenuOpen: false,
  deviceBindMode: "create",
};
const adminDeviceDetailState = {
  selectedDeviceId: "",
  activeTab: "operations",
  editor: "",
  rawVisible: false,
  notice: "",
};
const adminOrderListState = {
  statusFilter: "",
};
const adminOrderState = {
  selectedOrderId: "",
};
const adminExceptionState = {
  selectedAlertId: "",
};
const adminDeviceFeatureDefaults = {
  fallDetection: true,
  sosCall: true,
  vitalSigns: true,
  nightQuiet: false,
};
const adminDeviceThresholdDefaults = {
  heartRateHigh: 120,
  heartRateLow: 50,
  spo2Low: 90,
  inactivityMinutes: 60,
};
const adminDevicePushDefaults = {
  notifyFamily: true,
  notifyAdmin: true,
  smsBackup: false,
  quietHours: "22:00-07:00",
};
const adminBannerState = {
  loading: false,
  loaded: false,
  error: "",
  deletedIds: new Set(),
  home: null,
  activityData: null,
  orders: [],
  uiActions: [],
  selectedId: "home-banner",
  draft: null,
  notice: "",
  imageIndex: 0,
};
const adminDispatchState = {
  loading: false,
  loaded: false,
  error: "",
  queue: null,
  auditLogs: [],
  messages: { user: [], guide: [], merchant: [] },
  selectedKey: "",
  statusFilter: "",
  detailTab: "map",
  detailMode: "",
  detailNotice: "",
};
const adminConfigState = {
  loading: false,
  loaded: false,
  error: "",
  data: null,
  notice: "",
  activeSection: "basic",
};
const adminExportState = {
  open: false,
  title: "",
  filename: "",
  csv: "",
  rowCount: 0,
  notice: "",
};
const defaultAdminPermissionPeople = [
  { name: "周敏", account: "admin-zhou", password: "Yunlv@2026", role: "系统管理员", scope: "全平台", status: "启用" },
  { name: "陈琳", account: "ops-chen", password: "Yunlv@2026", role: "运营管理", scope: "昆明市", status: "启用", permissions: ["dashboard", "users", "orders", "tasks", "exceptions", "activities-content", "notifications"] },
  { name: "罗强", account: "audit-luo", password: "Yunlv@2026", role: "审计员", scope: "只读审计", status: "启用", permissions: ["dashboard", "permission", "logs"] },
];
const adminPermissionState = {
  adding: false,
  notice: "",
  activeAccount: loadAdminPermissionSession(),
  people: loadAdminPermissionPeople(defaultAdminPermissionPeople),
  logs: loadAdminPermissionLogs(),
};
const adminMenuPermissionState = {
  activeAccount: "",
  notice: "",
};
const settingsConfigCategories = ["基础参数", "安全策略", "服务配置", "消息通道", "风控策略", "数据权限", "版本记录"];
const settingsCategoryState = {
  activeByPage: {},
  savedAtByPageCategory: {},
  switchesByPageCategory: {},
};
const settingsCategoryDetails = {
  基础参数: {
    count: 32,
    owner: "系统管理员",
    status: "运行中",
    scope: "全平台",
    updated: "今天 10:20",
    description: "控制平台名称、运营城市、默认服务半径和基础审核要求。",
    fields: [["平台名称", "云旅无忧 AI智慧旅居平台"], ["默认城市", "昆明市、弥勒市"], ["服务半径", "15 公里"], ["默认语言", "简体中文"]],
    switches: [["平台门户启用", true], ["多城市运营", true], ["演示数据隔离", false]],
    sliders: [["自动同步频率", "72%"], ["后台缓存时长", "45%"], ["服务半径覆盖", "68%"]],
    checks: [["字段完整性", "通过"], ["城市映射", "已同步"], ["默认参数", "已启用"], ["运行风险", "低"]],
  },
  安全策略: {
    count: 50,
    owner: "安全管理员",
    status: "加固中",
    scope: "账号、登录、敏感操作",
    updated: "今天 09:45",
    description: "管理登录风控、密码策略、二次确认和敏感操作审计规则。",
    fields: [["密码有效期", "90 天"], ["登录失败锁定", "5 次"], ["二次验证场景", "导出、删除、权限变更"], ["会话超时", "30 分钟"]],
    switches: [["强密码校验", true], ["异地登录提醒", true], ["高危操作二次确认", true]],
    sliders: [["登录风险阈值", "82%"], ["验证码触发比例", "64%"], ["会话安全等级", "76%"]],
    checks: [["密码策略", "通过"], ["二次校验", "已开启"], ["风险设备", "持续监控"], ["审计留痕", "完整"]],
  },
  服务配置: {
    count: 68,
    owner: "运营管理员",
    status: "运行中",
    scope: "服务目录、订单、履约",
    updated: "今天 08:55",
    description: "控制服务分类、订单接入、商户履约和评价回访配置。",
    fields: [["默认服务类型", "陪伴就医"], ["预约提前量", "2 小时"], ["超时提醒", "15 分钟"], ["回访触发", "订单完成后 24 小时"]],
    switches: [["服务上架审核", true], ["订单自动派单", true], ["完单自动回访", false]],
    sliders: [["派单自动化", "69%"], ["履约超时阈值", "58%"], ["评价回收优先级", "61%"]],
    checks: [["服务目录", "已同步"], ["订单链路", "正常"], ["商户能力", "已校验"], ["评价规则", "待优化"]],
  },
  消息通道: {
    count: 86,
    owner: "客服主管",
    status: "运行中",
    scope: "站内信、短信、电话、微信",
    updated: "今天 11:05",
    description: "管理用户端、向导端、商户端和后台通知触达优先级。",
    fields: [["默认通道", "站内消息"], ["紧急通知", "电话 + 短信"], ["活动提醒", "站内信 + 微信"], ["失败重试", "3 次"]],
    switches: [["站内消息", true], ["短信补发", true], ["夜间免打扰", true]],
    sliders: [["触达优先级", "86%"], ["失败重试强度", "55%"], ["家属同步比例", "73%"]],
    checks: [["站内消息", "正常"], ["短信签名", "已备案"], ["电话通道", "可用"], ["触达回执", "已开启"]],
  },
  风控策略: {
    count: 104,
    owner: "风控管理员",
    status: "监控中",
    scope: "订单、支付、异常、内容",
    updated: "今天 10:50",
    description: "管理服务风险、支付风险、异常告警和人工复核触发条件。",
    fields: [["高风险订单阈值", "80 分"], ["异常复核时限", "10 分钟"], ["投诉升级", "2 次"], ["支付风控", "实时"]],
    switches: [["自动拦截高风险", true], ["人工复核队列", true], ["内容敏感词扫描", true]],
    sliders: [["风险拦截阈值", "78%"], ["人工复核比例", "42%"], ["误报回退比例", "20%"]],
    checks: [["规则命中", "104 条"], ["人工复核", "已排队"], ["异常闭环", "跟踪中"], ["策略版本", "v2.3"]],
  },
  数据权限: {
    count: 122,
    owner: "权限管理员",
    status: "已启用",
    scope: "角色、菜单、数据范围",
    updated: "今天 09:12",
    description: "控制角色可见菜单、按钮操作权限和不同城市的数据范围。",
    fields: [["默认角色", "运营管理员"], ["数据范围", "按城市隔离"], ["敏感字段", "脱敏展示"], ["导出审批", "必须审批"]],
    switches: [["按角色隔离菜单", true], ["敏感数据脱敏", true], ["导出审批流", true]],
    sliders: [["菜单覆盖率", "92%"], ["字段脱敏比例", "88%"], ["权限审计强度", "79%"]],
    checks: [["菜单权限", "122 项"], ["数据范围", "已绑定"], ["字段脱敏", "已开启"], ["导出控制", "审批中"]],
  },
  版本记录: {
    count: 140,
    owner: "系统管理员",
    status: "可回滚",
    scope: "配置版本、发布记录、回滚点",
    updated: "今天 11:30",
    description: "查看配置发布记录、差异说明和可回滚版本。",
    fields: [["当前版本", "v3.4.2"], ["上一版本", "v3.4.1"], ["发布人", "平台管理员"], ["回滚窗口", "72 小时"]],
    switches: [["保留回滚点", true], ["发布前快照", true], ["灰度发布", false]],
    sliders: [["版本稳定度", "91%"], ["灰度覆盖", "35%"], ["回滚准备度", "84%"]],
    checks: [["版本快照", "完整"], ["发布记录", "140 条"], ["回滚脚本", "可执行"], ["差异审计", "已生成"]],
  },
};

const icons = {
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M5 20c1.5-4 12.5-4 14 0"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="10" r="2.8"/><path d="M3.5 20c1.2-4 9.8-4 11 0M14 18c1.2-2.4 5-2.5 6.5 0"/></svg>`,
  store: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10h16l-1.5-5h-13L4 10Z"/><path d="M6 10v9h12v-9M9 19v-5h6v5"/></svg>`,
  order: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h10l2 3v15H5V6l2-3Z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>`,
  schedule: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M9 14h3l-2 3h4"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>`,
  content: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h14v12H8l-3 3V5Z"/><path d="M8 9h8M8 13h5"/></svg>`,
  device: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 5v2M12 17v2M5 12h2M17 12h2"/></svg>`,
  screen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M8 20h8M12 17v3M8 14l3-3 2 2 3-5"/></svg>`,
  system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.1L14 3h-4l-.5 2.8a7.5 7.5 0 0 0-2 1.1l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.1L10 21h4l.5-2.8a7.5 7.5 0 0 0 2-1.1l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12A9 9 0 0 1 18.5 5.8"/><path d="M18 2v4h-4M6 22v-4h4"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 3.7 2c-.9.6-1.4 1.1-1.4 2.3M12 17h.01"/></svg>`,
  full: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
  import: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12M8 7l4-4 4 4M5 15v4h14v-4"/></svg>`,
  export: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 15V3M8 11l4 4 4-4M5 15v4h14v-4"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m4 16.5-.5 4 4-.5L19 8.5 15.5 5 4 16.5Z"/><path d="m14 6.5 3.5 3.5"/></svg>`,
  save: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h12l2 2v14H5V4Z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m21 3-8 18-3-8-8-3 19-7Z"/><path d="m10 13 11-10"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 18h4"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.5 8.8c0 5.2-8.5 10.2-8.5 10.2S3.5 14 3.5 8.8A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 8.5 1.3Z"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5M4 19h17"/><path d="M8 15v-4M13 15V8M18 15v-7"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 5 6v5c0 4.3 2.6 8 7 10 4.4-2 7-5.7 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
};

const groups = [
  { id: "overview", title: "数据概览", icon: "grid" },
  { id: "user", title: "用户与老人管理", icon: "user" },
  { id: "guide", title: "人工向导管理", icon: "users" },
  { id: "merchant", title: "商户管理", icon: "store" },
  { id: "order", title: "订单管理", icon: "order" },
  { id: "dispatch", title: "任务调度", icon: "schedule" },
  { id: "exception", title: "异常报告", icon: "alert", warn: true },
  { id: "content", title: "咨询与通知", icon: "content" },
  { id: "device", title: "设备管理", icon: "device" },
  { id: "screen", title: "数据大屏", icon: "screen" },
  { id: "system", title: "系统权限", icon: "system" },
];

const pages = [
  { id: "dashboard", no: "01", title: "数据概览", group: "overview", type: "dashboard", subtitle: "平台核心经营、健康与服务风险总览" },
  { id: "users", no: "02", title: "用户与老人管理", group: "user", type: "list", subtitle: "统一管理平台注册用户及老人档案信息", detail: "elder" },
  { id: "guides", no: "03", title: "人工向导管理", group: "guide", type: "list", subtitle: "向导审核、服务能力、排班与收入管理", detail: "guide" },
  { id: "merchants", no: "04", title: "商户管理", group: "merchant", type: "list", subtitle: "入驻审核、资质、服务资源与经营状态" },
  { id: "orders", no: "05", title: "订单管理", group: "order", type: "orders", subtitle: "订单全生命周期与任务调度联动" },
  { id: "tasks", no: "06", title: "任务调度", group: "dispatch", type: "dispatch", subtitle: "智能匹配执行方、实时跟踪服务任务" },
  { id: "exceptions", no: "07", title: "异常报告", group: "exception", type: "list", subtitle: "SOS、健康异常、设备离线与服务反馈处理" },
  { id: "activities-content", no: "08", title: "咨询与通知管理", group: "content", type: "list", subtitle: "首页Banner、政策指南、咨询文章与三端通知统一管理" },
  { id: "devices", no: "09", title: "设备管理", group: "device", type: "list", subtitle: "设备绑定、状态监控、数据同步与异常处理" },
  { id: "operation-screen", no: "10", title: "运营数据大屏", group: "screen", type: "screen", subtitle: "实时洞察运营动态，智能驱动业务增长" },
  { id: "permission", no: "11", title: "系统权限", group: "system", type: "permission", subtitle: "角色、菜单、账号与操作权限统一治理" },
  { id: "login", no: "12", title: "登录页", group: "system", type: "login", subtitle: "运营、调度、异常处理与数据看板统一入口" },
  { id: "user-detail", no: "13", title: "用户详情", group: "user", type: "detail", subtitle: "用户档案、健康、服务、设备和操作日志" },
  { id: "user-create", no: "14", title: "新增用户与老人档案", group: "user", type: "form", subtitle: "录入用户基础资料、健康标签与家属绑定" },
  { id: "family", no: "15", title: "家属绑定管理", group: "user", type: "list", subtitle: "亲属关系、紧急联系人与授权范围管理" },
  { id: "health-records", no: "16", title: "健康档案管理", group: "user", type: "detail", subtitle: "慢病、过敏、用药、体检与健康监测记录" },
  { id: "service-records", no: "17", title: "服务记录与回访", group: "user", type: "detail", subtitle: "服务轨迹、评价、回访与跟进闭环" },
  { id: "guide-review", no: "18", title: "人工向导审核详情", group: "guide", type: "detail", subtitle: "资质、服务能力、审核材料与排班意愿" },
  { id: "guide-create", no: "19", title: "新增人工向导", group: "guide", type: "form", subtitle: "新增向导资料、认证证件和服务能力" },
  { id: "guide-schedule", no: "20", title: "向导排班管理", group: "guide", type: "schedule", subtitle: "服务日历、班次容量和休息状态" },
  { id: "guide-income", no: "21", title: "向导收入与评价明细", group: "guide", type: "detail", subtitle: "收入结算、服务评分、投诉与评价明细" },
  { id: "merchant-review", no: "22", title: "商户入驻审核", group: "merchant", type: "detail", subtitle: "资质审核、经营信息、风控与审批记录" },
  { id: "merchant-services", no: "23", title: "商户服务项目管理", group: "merchant", type: "list", subtitle: "服务上架、价格套餐、区域与预约能力" },
  { id: "service-create", no: "24", title: "新增商户服务", group: "merchant", type: "form", subtitle: "完善服务信息，提交审核后可上架提供服务", preview: true },
  { id: "merchant-orders", no: "25", title: "商户订单预约管理", group: "merchant", type: "orders", subtitle: "商户侧预约、确认、改期与履约进度" },
  { id: "merchant-settlement", no: "26", title: "商户结算管理", group: "merchant", type: "list", subtitle: "账单、佣金、结算周期和支付状态" },
  { id: "service-resources", no: "27", title: "服务资源管理", group: "merchant", type: "list", subtitle: "车辆、场地、护理人员与资源可用性" },
  { id: "service-pricing", no: "28", title: "服务分类与价格配置", group: "merchant", type: "settings", subtitle: "服务目录、价格、套餐和优惠规则配置" },
  { id: "order-detail", no: "29", title: "订单详情", group: "order", type: "detail", subtitle: "订单状态、人员、健康与后台记录" },
  { id: "order-create", no: "30", title: "创建订单", group: "order", type: "form", subtitle: "为老人快速创建服务订单并指定需求" },
  { id: "after-sales", no: "31", title: "订单评价与售后", group: "order", type: "list", subtitle: "评价、退款、投诉和售后处理" },
  { id: "dispatch-rules", no: "32", title: "派单规则设置", group: "dispatch", type: "rules", subtitle: "自动派单、人工优先级、超时规则与模拟测试" },
  { id: "dispatch-detail", no: "33", title: "任务调度详情", group: "dispatch", type: "detail", subtitle: "任务详情、执行方、匹配推荐与调度记录" },
  { id: "device-exception", no: "34", title: "设备异常处理", group: "exception", type: "detail", subtitle: "异常定位、设备状态、工单流转与复核" },
  { id: "complaints", no: "35", title: "投诉工单处理", group: "exception", type: "detail", subtitle: "投诉原因、责任方、处理记录和回访结果" },
  { id: "exception-review", no: "36", title: "异常归档与复盘", group: "exception", type: "settings", subtitle: "归档分类、复盘结论、改进动作与责任追踪" },
  { id: "activity-edit", no: "37", title: "商户活动发布提示", group: "content", type: "form", subtitle: "活动发布、报名与上下架由商户端负责" },
  { id: "activity-signups", no: "38", title: "商户活动报名提示", group: "content", type: "list", subtitle: "活动报名、核销与退款由商户端负责" },
  { id: "banner", no: "39", title: "首页Banner管理", group: "content", type: "form", subtitle: "首页轮播、投放人群、跳转与上下线时间" },
  { id: "policy", no: "40", title: "政策指南管理", group: "content", type: "settings", subtitle: "政策分类、指南条目、引用与城市适配" },
  { id: "article-edit", no: "41", title: "咨询文章编辑", group: "content", type: "form", subtitle: "文章正文、封面、标签、发布渠道与预览" },
  { id: "notice", no: "42", title: "通知公告管理", group: "content", type: "list", subtitle: "系统公告、消息触达、阅读回执和发布记录" },
  { id: "device-bind", no: "43", title: "设备绑定管理", group: "device", type: "form", subtitle: "设备入库、老人绑定、安装位置与校验" },
  { id: "device-detail", no: "44", title: "设备详情与日志", group: "device", type: "detail", subtitle: "设备状态、日志、数据上报与远程命令" },
  { id: "health-monitor", no: "45", title: "健康数据监测", group: "device", type: "screen", subtitle: "生命体征、异常趋势、设备采集和预警" },
  { id: "elder-screen", no: "46", title: "老人监测数据大屏", group: "screen", type: "screen", subtitle: "健康状态、设备在线、异常预警、服务守护" },
  { id: "guide-screen", no: "47", title: "人工向导调度大屏", group: "screen", type: "screen", subtitle: "向导位置、负载、路线和任务调度态势" },
  { id: "accounts", no: "48", title: "账号管理", group: "system", type: "list", subtitle: "后台账号、状态、角色和登录安全" },
  { id: "menus", no: "49", title: "菜单权限配置", group: "system", type: "permission", subtitle: "菜单树、按钮权限与数据权限配置" },
  { id: "logs", no: "50", title: "操作日志审计", group: "system", type: "list", subtitle: "关键操作、IP、对象、结果和审计追踪" },
  { id: "config", no: "51", title: "系统配置", group: "system", type: "settings", subtitle: "基础参数、安全策略、消息通道与业务开关" },
  { id: "notifications", no: "52", title: "消息通知中心", group: "system", type: "list", subtitle: "站内信、短信、App推送与触达结果" },
  { id: "ai-knowledge", no: "53", title: "AI管家知识库管理", group: "system", type: "knowledge", subtitle: "知识库、问答测试、向量同步与发布版本" },
];

const operationalNav = [
  { group: "overview", route: "dashboard", title: "数据概览", icon: "grid", desc: "经营、服务、异常总览" },
  { group: "user", route: "users", title: "老人/用户管理", icon: "user", desc: "档案、健康、家属" },
  { group: "guide", route: "guides", title: "人工向导管理", icon: "users", desc: "审核、接单、收入" },
  { group: "merchant", route: "merchants", title: "商户管理", icon: "store", desc: "入驻、服务、结算" },
  { group: "order", route: "orders", title: "订单管理", icon: "order", desc: "订单、售后、评价" },
  { group: "dispatch", route: "tasks", title: "任务调度", icon: "schedule", desc: "派单、改派、规则" },
  { group: "exception", route: "exceptions", title: "异常/SOS", icon: "alert", desc: "预警、处理、归档", warn: true },
  { group: "content", route: "banner", title: "首页Banner管理", icon: "content", desc: "轮播、跳转、上下线" },
  { group: "device", route: "devices", title: "设备管理", icon: "device", desc: "绑定、在线、日志" },
  { group: "screen", route: "operation-screen", title: "数据大屏", icon: "screen", desc: "运营态势与调度" },
  { group: "system", route: "permission", title: "系统权限", icon: "system", desc: "角色、菜单、日志" },
];

const colors = {
  blue: ["#68a7ff", "#176bff"],
  green: ["#72dc87", "#20be70"],
  orange: ["#ffc14e", "#ff9c13"],
  red: ["#ff817c", "#ff5252"],
  purple: ["#ad77ff", "#764ee7"],
  cyan: ["#56cef0", "#1aa4d8"],
  teal: ["#23d0bd", "#0ba893"],
};

const sample = {
  people: [
    ["U10000125", "李奶奶", "72", "女", "138****5678", "昆明市", "良好", "已绑定(2)", "手环、血压计", "05-19 护理服务", "正常"],
    ["U10000124", "王爷爷", "78", "男", "139****2468", "大理市", "轻度异常", "已绑定(1)", "手环", "05-18 体检服务", "正常"],
    ["U10000123", "张奶奶", "68", "女", "137****1357", "丽江市", "良好", "已绑定(3)", "手环、体脂秤", "05-18 健康咨询", "正常"],
    ["U10000122", "赵爷爷", "81", "男", "136****9876", "玉溪市", "中度异常", "已绑定(2)", "手环、血压计", "05-17 护理服务", "正常"],
    ["U10000121", "刘奶奶", "75", "女", "158****1122", "曲靖市", "高风险", "已绑定(1)", "手环、血压计", "05-16 紧急救助", "冻结"],
    ["U10000120", "陈爷爷", "69", "男", "159****3344", "保山市", "良好", "未绑定", "未绑定", "05-15 健康评估", "正常"],
  ],
  guides: [
    ["李向导", "DG10023", "陪伴就医", "昆明市", "在线", "接单中", "3", "28", "98%", "4.9", "¥5,680", "已认证"],
    ["王奶奶", "DG10015", "生活陪伴", "昆明市", "在线", "空闲中", "1", "22", "97%", "4.8", "¥4,320", "已认证"],
    ["张小明", "DG10031", "导游游览", "大理市", "在线", "接单中", "2", "31", "99%", "5.0", "¥6,720", "已认证"],
    ["刘怡然", "DG10018", "生活陪伴", "丽江市", "在线", "空闲中", "0", "18", "96%", "4.7", "¥2,980", "已认证"],
    ["陈大爷", "DG10006", "陪伴就医", "昆明市", "离线", "休息中", "0", "15", "95%", "4.6", "¥2,450", "已认证"],
    ["赵美丽", "DG10027", "导游游览", "西双版纳", "在线", "接单中", "4", "26", "98%", "4.9", "¥5,190", "已认证"],
  ],
  orders: [
    ["DD20240519001", "王爷爷", "陪伴就医", "05-19 09:30", "昆明市人民医院", "李奶奶", "待派单", "¥120.00", "小程序"],
    ["DD20240519002", "李奶奶", "导游游览", "05-19 10:00", "滇池海埂公园", "—", "待确认", "¥160.00", "APP"],
    ["DD20240519003", "刘爷爷", "生活陪伴", "05-19 14:00", "官渡古镇", "陈丹姨", "服务中", "¥80.00", "小程序"],
    ["DD20240519004", "张奶奶", "护理服务", "05-19 09:00", "五华区家中", "云康护理中心", "服务中", "¥200.00", "APP"],
    ["DD20240519005", "赵爷爷", "接送服务", "05-18 16:00", "长水机场", "云南出行服务", "已完成", "¥150.00", "小程序"],
    ["DD20240519006", "孙奶奶", "本地美食", "05-18 11:30", "翠湖周边", "老昆明味道", "已完成", "¥88.00", "APP"],
    ["DD20240519007", "周爷爷", "活动陪伴", "05-18 09:00", "老年大学活动中心", "社区活动中心", "已取消", "¥0.00", "小程序"],
  ],
  alerts: [
    ["05-19 09:23", "SOS预警", "张爷爷（ID:10234）", "待处理", "—"],
    ["05-19 08:47", "健康异常", "李奶奶（ID:20567）", "处理中", "人工向导-王芳"],
    ["05-19 08:15", "设备离线", "定位手表 #A1B2C3", "待处理", "—"],
    ["05-19 07:56", "行程延误", "陪伴就医订单 #8765", "已处理", "人工向导-李强"],
    ["05-19 07:32", "服务反馈", "赵奶奶（ID:30987）", "处理中", "客服-小陈"],
  ],
  content: [
    ["A20240519001", "健康每一天", "活动", "昆明市", "已发布", "1,286", "05-19 10:28"],
    ["A20240518025", "长者旅居补贴申请", "政策", "昆明市", "待审核", "932", "05-19 09:15"],
    ["A20240517018", "康养旅居路线推荐", "资讯", "全国", "已发布", "812", "05-18 18:30"],
    ["A20240516004", "端午关怀通知", "公告", "全部用户", "已发布", "645", "05-18 16:32"],
    ["A20240515008", "首页适老化专题", "Banner", "APP首页", "待发布", "582", "05-18 15:20"],
  ],
  devices: [
    ["DEV33892", "乐心手环 LX-05 Pro", "李奶奶", "在线", "78%", "昆明市五华区", "05-19 10:31"],
    ["DEV33893", "小云机器人 V3.2", "王爷爷", "在线", "96%", "大理市古城区", "05-19 10:28"],
    ["DEV33894", "智能血压计 BP-610", "赵爷爷", "离线", "--", "玉溪市红塔区", "05-19 09:50"],
    ["DEV33895", "血氧仪 OX-102", "张奶奶", "在线", "65%", "丽江市古城区", "05-19 09:35"],
    ["DEV33896", "定位手表 HR3882", "刘奶奶", "异常", "40%", "曲靖市麒麟区", "05-19 08:52"],
  ],
  system: [
    ["管理员", "admin", "超级管理员", "正常", "2024-05-19 10:30", "10.10.1.23"],
    ["运营主管", "ops_lead", "运营管理", "正常", "2024-05-19 09:15", "10.10.1.45"],
    ["调度员", "dispatch01", "任务调度", "正常", "2024-05-18 18:30", "10.10.1.66"],
    ["客服小陈", "service02", "客服处理", "停用", "2024-05-18 16:32", "10.10.1.78"],
    ["审计员", "audit", "日志审计", "正常", "2024-05-17 09:05", "10.10.1.86"],
  ],
};

function isAdminPageId(id) {
  return pages.some((page) => page.id === id);
}

function normalizeAdminPageId(value) {
  const id = String(value || "").replace(/^#/, "");
  return isAdminPageId(id) ? id : "";
}

function currentPage() {
  const id = normalizeAdminPageId(location.hash) || "dashboard";
  return pages.find((page) => page.id === id) || pages[0];
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function loadAdminPermissionPeople(defaultPeople = []) {
  try {
    const parsed = JSON.parse(localStorage.getItem(ADMIN_PERMISSION_PEOPLE_KEY) || "[]");
    const source = Array.isArray(parsed) && parsed.length ? parsed : defaultPeople;
    return source.map((person) => ({
      ...person,
      status: person.status || "启用",
      password: person.password || "",
    }));
  } catch {
    return defaultPeople;
  }
}

function saveAdminPermissionPeople() {
  try {
    localStorage.setItem(ADMIN_PERMISSION_PEOPLE_KEY, JSON.stringify(adminPermissionState.people));
  } catch {
    // Persistence is a browser enhancement; the in-page state still updates if storage is unavailable.
  }
}

function loadAdminPermissionSession() {
  try {
    return localStorage.getItem(ADMIN_PERMISSION_SESSION_KEY) || ADMIN_DEFAULT_ACCOUNT;
  } catch {
    return ADMIN_DEFAULT_ACCOUNT;
  }
}

function saveAdminPermissionSession(account = ADMIN_DEFAULT_ACCOUNT) {
  adminPermissionState.activeAccount = account || ADMIN_DEFAULT_ACCOUNT;
  try {
    localStorage.setItem(ADMIN_PERMISSION_SESSION_KEY, adminPermissionState.activeAccount);
  } catch {
    // Session persistence is optional; the current page state still changes.
  }
}

function loadAdminPermissionLogs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ADMIN_PERMISSION_LOG_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAdminPermissionLogs() {
  try {
    localStorage.setItem(ADMIN_PERMISSION_LOG_KEY, JSON.stringify(adminPermissionState.logs.slice(0, 80)));
  } catch {
    // Local audit persistence is best-effort.
  }
}

function adminDefaultPerson() {
  return {
    name: "管理员",
    account: ADMIN_DEFAULT_ACCOUNT,
    password: ADMIN_DEFAULT_PASSWORD,
    role: "超级管理员",
    scope: "全平台",
    status: "启用",
    permissions: ["__all__"],
  };
}

function currentAdminPermissionPerson() {
  if (adminPermissionState.activeAccount === ADMIN_DEFAULT_ACCOUNT) return adminDefaultPerson();
  return adminPermissionState.people.find((person) => person.account === adminPermissionState.activeAccount) || adminDefaultPerson();
}

function permissionValueMatches(permission, page) {
  if (!permission || !page) return false;
  const contentLegacyPermissions = ["activities-content", "咨询与通知", "咨询与通知管理", "首页Banner管理"];
  if (page.group === "content" && contentLegacyPermissions.includes(permission)) return true;
  return permission === "__all__"
    || permission === page.id
    || permission === page.title
    || permission === `group:${page.group}`
    || permission === groupById(page.group).title;
}

function hasAdminPagePermission(pageOrRoute, person = currentAdminPermissionPerson()) {
  const page = typeof pageOrRoute === "string" ? pageById(pageOrRoute) : pageOrRoute;
  if (!page || page.type === "login") return true;
  if (!person || person.status !== "启用") return false;
  if (person.account === ADMIN_DEFAULT_ACCOUNT) return true;
  const permissions = Array.isArray(person.permissions) ? person.permissions : [];
  if (!permissions.length) return true;
  return permissions.some((permission) => permissionValueMatches(permission, page));
}

function permissionCount(person = {}) {
  const permissions = Array.isArray(person.permissions) ? person.permissions : [];
  if (!permissions.length || permissions.includes("__all__")) return "全部";
  return `${permissions.length} 项`;
}

function recordAdminOperation(action, target = "", result = "成功", actor = currentAdminPermissionPerson().name) {
  const item = {
    id: `local-${Date.now()}`,
    createdAt: adminNowText(),
    actor: actor || "管理员",
    action,
    target,
    ip: "本机浏览器",
    result,
  };
  adminPermissionState.logs = [item, ...adminPermissionState.logs].slice(0, 80);
  saveAdminPermissionLogs();
  return item;
}

function adminLogTimeValue(value = "") {
  const time = Date.parse(String(value).replace(" ", "T"));
  return Number.isFinite(time) ? time : 0;
}

function operationLogRows(limit = 10) {
  const localRows = (adminPermissionState.logs || []).map((item) => ({
    createdAt: item.createdAt || "",
    actor: item.actor || "",
    action: item.action || "",
    ip: item.ip || "本机浏览器",
    result: item.result || "成功",
  }));
  const remoteRows = (adminAuditState.logs || []).map((item) => ({
    createdAt: item.createdAt || item.time || "",
    actor: item.actor || "",
    action: item.target ? `${item.action || ""}：${item.target}` : item.action || "",
    ip: item.ip || "",
    result: item.result || "",
  }));
  return [...localRows, ...remoteRows]
    .sort((a, b) => adminLogTimeValue(b.createdAt) - adminLogTimeValue(a.createdAt))
    .slice(0, limit)
    .map((item) => [item.createdAt, item.actor, item.action, item.ip, item.result]);
}

function groupById(id) {
  return groups.find((group) => group.id === id) || groups[0];
}

function pageHref(id) {
  return `#${id}`;
}

function adminNowText() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function nextAdminConfigVersion(version) {
  const match = String(version || "v2.3.0").match(/^v(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return "v2.3.1";
  return `v${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
}

function defaultAdminConfigFallback() {
  return {
    version: "v2.3.0",
    savedAt: "2024-05-19 10:28",
    publishedAt: "2024-05-18 18:30:22",
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
      enabled: false,
      provider: "DeepSeek",
      apiBase: "https://api.deepseek.com",
      apiKey: "",
      model: "deepseek-chat",
      timeoutMs: 12000,
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
    ],
    rollbackVersions: [
      { version: "v2.2.1（稳定版）", time: "2024-05-10 14:22", action: "回滚" },
      { version: "v2.2.0（稳定版）", time: "2024-04-28 09:15", action: "回滚" },
      { version: "v2.1.5（稳定版）", time: "2024-04-15 16:40", action: "回滚" },
    ],
    changeLogs: [
      { time: "2024-05-19 10:28", actor: "管理员", module: "订单规则", field: "自动取消时间", before: "20分钟", after: "30分钟", type: "修改" },
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

function adminConfigData() {
  return adminConfigState.data || defaultAdminConfigFallback();
}

function adminConfigBooleanText(value) {
  return value ? "启用" : "关闭";
}

function adminConfigListText(value) {
  return Array.isArray(value) ? value.join(" / ") : String(value || "");
}

function adminConfigNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function adminConfigCsv(value) {
  if (Array.isArray(value)) return value.join("、");
  return String(value || "");
}

function adminConfigSplit(value) {
  return String(value || "")
    .split(/[、,/|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function adminConfigField(label, path, value, type = "text", suffix = "") {
  return `
    <div class="form-row admin-config-field">
      <label>${escapeHtml(label)}</label>
      <div class="admin-config-input-wrap">
        <input class="form-control" data-admin-config-field="${escapeHtml(path)}" type="${type}" value="${escapeHtml(value)}" />
        ${suffix ? `<span>${escapeHtml(suffix)}</span>` : ""}
      </div>
    </div>
  `;
}

function adminConfigCheckbox(label, path, checked) {
  return `
    <div class="form-row admin-config-field">
      <label>${escapeHtml(label)}</label>
      <label class="admin-config-checkbox">
        <input data-admin-config-field="${escapeHtml(path)}" type="checkbox" ${checked ? "checked" : ""} />
        <span>${checked ? "启用" : "关闭"}</span>
      </label>
    </div>
  `;
}

function adminConfigSection(id, title, body) {
  return `
    <section class="panel" data-admin-config-section="${escapeHtml(id)}">
      <div class="panel-head"><h2>${escapeHtml(title)}</h2></div>
      <div class="form-body">${body}</div>
    </section>
  `;
}

function adminConfigUnifiedGroup(id, title, body) {
  return `
    <section class="admin-config-unified-group" data-admin-config-section="${escapeHtml(id)}">
      <h3>${escapeHtml(title)}</h3>
      <div class="form-body">${body}</div>
    </section>
  `;
}

const ADMIN_CONFIG_LOGO_CHOICES = [
  "/user/assets/home-logo-ref.png",
  "/user/assets/assistant-robot.jpg",
  "/admin/assets/admin-login-visual.png",
];

function adminConfigLogoPreview(src) {
  const logo = String(src || "").trim();
  return `
    <span class="admin-config-logo-preview" data-admin-config-logo-preview>
      ${logo ? `<img src="${escapeHtml(adminAsset(logo))}" alt="平台 Logo 预览" />` : `<span class="brand-mark"></span>`}
    </span>
  `;
}

function nextAdminConfigLogoChoice(current) {
  const currentLogo = String(current || "").trim();
  const currentIndex = ADMIN_CONFIG_LOGO_CHOICES.indexOf(currentLogo);
  return ADMIN_CONFIG_LOGO_CHOICES[(currentIndex + 1) % ADMIN_CONFIG_LOGO_CHOICES.length];
}

function updateAdminConfigLogoPreview(value) {
  const preview = app.querySelector("[data-admin-config-logo-preview]");
  if (!preview) return;
  const logo = String(value || "").trim();
  preview.innerHTML = logo
    ? `<img src="${escapeHtml(adminAsset(logo))}" alt="平台 Logo 预览" />`
    : `<span class="brand-mark"></span>`;
}

function collectAdminConfigDraftFromDom() {
  const value = (selector, fallback = "") => app.querySelector(selector)?.value?.trim() || fallback || "";
  const checked = (selector) => app.querySelector(selector)?.checked === true;
  const config = adminConfigData();
  return {
    platform: {
      name: value('[data-admin-config-field="platform.name"]', config.platform?.name),
      shortName: value('[data-admin-config-field="platform.shortName"]', config.platform?.shortName),
      logo: value('[data-admin-config-field="platform.logo"]', config.platform?.logo),
      copyright: value('[data-admin-config-field="platform.copyright"]', config.platform?.copyright),
      appVersion: value('[data-admin-config-field="platform.appVersion"]', config.platform?.appVersion),
    },
    serviceArea: {
      defaultCities: adminConfigSplit(value('[data-admin-config-field="serviceArea.defaultCities"]', adminConfigCsv(config.serviceArea?.defaultCities))),
      rangeTypes: adminConfigSplit(value('[data-admin-config-field="serviceArea.rangeTypes"]', adminConfigCsv(config.serviceArea?.rangeTypes))),
      mapProvider: value('[data-admin-config-field="serviceArea.mapProvider"]', config.serviceArea?.mapProvider),
      mapApiKey: value('[data-admin-config-field="serviceArea.mapApiKey"]', config.serviceArea?.mapApiKey),
      positioningAccuracy: value('[data-admin-config-field="serviceArea.positioningAccuracy"]', config.serviceArea?.positioningAccuracy),
    },
    aiSteward: {
      enabled: checked('[data-admin-config-field="aiSteward.enabled"]'),
      provider: value('[data-admin-config-field="aiSteward.provider"]', config.aiSteward?.provider),
      apiBase: value('[data-admin-config-field="aiSteward.apiBase"]', config.aiSteward?.apiBase),
      apiKey: value('[data-admin-config-field="aiSteward.apiKey"]', config.aiSteward?.apiKey),
      model: value('[data-admin-config-field="aiSteward.model"]', config.aiSteward?.model),
      timeoutMs: adminConfigNumber(value('[data-admin-config-field="aiSteward.timeoutMs"]'), config.aiSteward?.timeoutMs),
      temperature: adminConfigNumber(value('[data-admin-config-field="aiSteward.temperature"]'), config.aiSteward?.temperature),
      maxTokens: adminConfigNumber(value('[data-admin-config-field="aiSteward.maxTokens"]'), config.aiSteward?.maxTokens),
    },
    orderRules: {
      autoCancelMinutes: adminConfigNumber(value('[data-admin-config-field="orderRules.autoCancelMinutes"]'), config.orderRules?.autoCancelMinutes),
      confirmTimeoutMinutes: adminConfigNumber(value('[data-admin-config-field="orderRules.confirmTimeoutMinutes"]'), config.orderRules?.confirmTimeoutMinutes),
      reviewDays: adminConfigNumber(value('[data-admin-config-field="orderRules.reviewDays"]'), config.orderRules?.reviewDays),
      rescheduleHours: adminConfigNumber(value('[data-admin-config-field="orderRules.rescheduleHours"]'), config.orderRules?.rescheduleHours),
      retentionDays: adminConfigNumber(value('[data-admin-config-field="orderRules.retentionDays"]'), config.orderRules?.retentionDays),
    },
    sosRules: {
      chain: value('[data-admin-config-field="sosRules.chain"]', config.sosRules?.chain),
      secondReminderMinutes: adminConfigNumber(value('[data-admin-config-field="sosRules.secondReminderMinutes"]'), config.sosRules?.secondReminderMinutes),
      escalationMinutes: adminConfigNumber(value('[data-admin-config-field="sosRules.escalationMinutes"]'), config.sosRules?.escalationMinutes),
      responseSlaMinutes: adminConfigNumber(value('[data-admin-config-field="sosRules.responseSlaMinutes"]'), config.sosRules?.responseSlaMinutes),
      maxEmergencyContacts: adminConfigNumber(value('[data-admin-config-field="sosRules.maxEmergencyContacts"]'), config.sosRules?.maxEmergencyContacts),
    },
    deviceSimulation: {
      enabled: checked('[data-admin-config-field="deviceSimulation.enabled"]'),
      deviceCount: adminConfigNumber(value('[data-admin-config-field="deviceSimulation.deviceCount"]'), config.deviceSimulation?.deviceCount),
      refreshSeconds: adminConfigNumber(value('[data-admin-config-field="deviceSimulation.refreshSeconds"]'), config.deviceSimulation?.refreshSeconds),
      dataTypes: adminConfigSplit(value('[data-admin-config-field="deviceSimulation.dataTypes"]', adminConfigCsv(config.deviceSimulation?.dataTypes))),
    },
    compliance: {
      privacyVersion: value('[data-admin-config-field="compliance.privacyVersion"]', config.compliance?.privacyVersion),
      medicalDisclaimerVersion: value('[data-admin-config-field="compliance.medicalDisclaimerVersion"]', config.compliance?.medicalDisclaimerVersion),
      userAgreementVersion: value('[data-admin-config-field="compliance.userAgreementVersion"]', config.compliance?.userAgreementVersion),
      forceConsentOnFirstUse: checked('[data-admin-config-field="compliance.forceConsentOnFirstUse"]'),
    },
    businessSwitches: {
      userRegistrationReview: checked('[data-admin-config-field="businessSwitches.userRegistrationReview"]'),
      merchantOnboardingReview: checked('[data-admin-config-field="businessSwitches.merchantOnboardingReview"]'),
      guideCertificationReview: checked('[data-admin-config-field="businessSwitches.guideCertificationReview"]'),
      activitySignupReview: checked('[data-admin-config-field="businessSwitches.activitySignupReview"]'),
      priceDisplayMode: value('[data-admin-config-field="businessSwitches.priceDisplayMode"]', config.businessSwitches?.priceDisplayMode),
      maintenanceMode: checked('[data-admin-config-field="businessSwitches.maintenanceMode"]'),
    },
  };
}

function refreshAdminCurrentPage(source) {
  adminUiState.refreshSeq += 1;
  render();
  const shellEl = app.querySelector(".app-shell");
  const content = app.querySelector(".content");
  const title = app.querySelector(".page-head h1, .breadcrumb strong, .content");
  shellEl?.setAttribute("data-admin-refresh", String(adminUiState.refreshSeq));
  if (content) {
    if (typeof content.scrollTo === "function") content.scrollTo({ top: 0, behavior: "smooth" });
    else content.scrollTop = 0;
  }
  if (title) {
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
  }
  source?.setAttribute?.("data-admin-refreshed-by", String(adminUiState.refreshSeq));
  return true;
}

function toggleAdminSidebar() {
  adminUiState.sidebarCollapsed = !adminUiState.sidebarCollapsed;
  render();
  const shellEl = app.querySelector(".app-shell");
  shellEl?.setAttribute("data-admin-sidebar-state", adminUiState.sidebarCollapsed ? "collapsed" : "expanded");
  const menu = app.querySelector("[data-admin-menu-toggle]");
  menu?.focus?.({ preventScroll: true });
  return true;
}

function brand() {
  return `
    <div class="brand">
      <div class="brand-mark" aria-hidden="true"></div>
      <div class="brand-title">
        <strong>云旅无忧</strong>
        <span>AI智慧旅居平台</span>
      </div>
    </div>
  `;
}

function bindPassiveButtonsToHtml(html) {
  return String(html || "").replace(
    /<button\b(?![^>]*\bdata-(?:route|action|open|step|go|screen|page-action|admin-search-submit|admin-menu-toggle|admin-account-toggle|admin-map-action|admin-map-city|admin-map-point|admin-login-submit|admin-permission-add|admin-permission-save|admin-permission-cancel|admin-permission-toggle|admin-permission-delete|admin-permission-use|admin-permission-choice|user-detail-tab|merchant-review-tab)(?:=|\s|>))(?![^>]*\bdata-add-cart(?:=|\s|>))(?![^>]*\btype=["']submit["'])/gi,
    '<button data-action="查看详情"',
  );
}

function shell(page) {
  if (page.type === "login") {
    return bindPassiveButtonsToHtml(renderLogin());
  }
  return bindPassiveButtonsToHtml(`
    <div class="app-shell ${adminUiState.sidebarCollapsed ? "sidebar-collapsed" : ""}" data-admin-refresh="${adminUiState.refreshSeq}">
      ${renderSidebar(page)}
      <main class="main">
        ${renderTopbar(page)}
        <div class="content">
          ${renderPage(page)}
        </div>
        ${renderPageInventory()}
        ${renderAdminExportDialog()}
      </main>
    </div>
  `);
}

function renderPageInventory() {
  return `
    <div class="sr-only" aria-label="管理后台页面清单">
      ${pages.map((item) => `<span data-admin-page="${item.id}">${item.no}-${item.title}</span>`).join("")}
    </div>
  `;
}

function renderAdminExportDialog() {
  if (!adminExportState.open) return "";
  return `
    <div class="permission-dialog-backdrop" data-admin-export-close></div>
    <section class="permission-dialog admin-export-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-export-dialog-title">
      <div class="panel-head">
        <h2 id="admin-export-dialog-title">${escapeHtml(adminExportState.title || "导出结果")}</h2>
        <button class="btn" type="button" data-admin-export-close>关闭</button>
      </div>
      <div class="admin-export-meta">
        <div><span>文件名</span><strong>${escapeHtml(adminExportState.filename || "未命名.csv")}</strong></div>
        <div><span>记录数</span><strong>${escapeHtml(String(adminExportState.rowCount || 0))} 条</strong></div>
        <div><span>状态</span><strong>${escapeHtml(adminExportState.notice || "已生成可复制的 CSV 内容")}</strong></div>
      </div>
      <div class="form-body">
        <textarea class="textarea admin-export-preview" readonly>${escapeHtml(adminExportState.csv || "")}</textarea>
        <div class="chip-row admin-export-actions">
          <button class="btn primary" type="button" data-admin-export-copy>复制CSV</button>
          <button class="btn" type="button" data-admin-export-close>关闭</button>
        </div>
      </div>
    </section>
  `;
}

function renderSidebar(page) {
  const navItems = operationalNav.filter((item) => hasAdminPagePermission(item.route));
  return `
    <aside class="sidebar">
      ${brand()}
      <nav class="nav">
        <div class="nav-mode-title">运营管理</div>
        ${navItems
          .map((item) => {
            const active = page.group === item.group;
            return `
              <div class="nav-group ${active ? "expanded" : ""}">
                <button class="nav-item ${active ? "active" : ""}" data-route="${item.route}">
                  ${icons[item.icon]}
                  <span class="label">
                    <b>${item.title}</b>
                    <small>${item.desc}</small>
                  </span>
                  ${item.warn ? '<span class="dot" aria-hidden="true"></span>' : ""}
                </button>
              </div>
            `;
          })
          .join("")}
      </nav>
      <button class="collapse" type="button" data-admin-menu-toggle aria-pressed="${adminUiState.sidebarCollapsed ? "true" : "false"}">${chevron("left")} ${adminUiState.sidebarCollapsed ? "展开菜单" : "收起菜单"}</button>
    </aside>
  `;
}

function renderTopbar(page) {
  const group = groupById(page.group);
  const currentPerson = currentAdminPermissionPerson();
  const unread = Number(adminMessageState.unread || 0);
  const badge = unread > 0 ? `<span class="badge-dot">${unread > 99 ? "99+" : unread}</span>` : "";
  const breadcrumbTitle = page.group === "content" && page.id === "banner"
    ? page.title
    : group.title === page.title
      ? page.title
      : `${group.title} / ${page.title}`;
  return `
    <header class="topbar">
      <button class="menu-button ${adminUiState.sidebarCollapsed ? "active" : ""}" type="button" data-admin-menu-toggle aria-label="折叠菜单" aria-pressed="${adminUiState.sidebarCollapsed ? "true" : "false"}">${icons.menu}</button>
      <div class="breadcrumb">
        <span>管理后台</span>
        <span>/</span>
        <strong>${breadcrumbTitle}</strong>
      </div>
      <div class="top-spacer"></div>
      <label class="search">
        <input data-admin-global-search placeholder="搜索用户、订单、设备等..." />
        <button class="search-button" type="button" data-admin-search-submit aria-label="搜索">${icons.search}</button>
      </label>
      <button class="tool-icon" aria-label="消息通知${unread ? `，${unread}条未读` : ""}" data-route="notifications">${icons.bell}${badge}</button>
      <div class="profile-wrap ${adminUiState.accountMenuOpen ? "open" : ""}">
        <button class="profile" type="button" data-admin-account-toggle aria-expanded="${adminUiState.accountMenuOpen ? "true" : "false"}" aria-label="管理员账号菜单">
          <span class="avatar" aria-hidden="true"></span><span>${escapeHtml(currentPerson.name || "管理员")}</span>${chevron("down")}
        </button>
        ${adminUiState.accountMenuOpen ? `
          <div class="account-menu" role="menu">
            <div class="account-menu-head"><strong>${escapeHtml(currentPerson.name || "管理员")}</strong><span>${escapeHtml(currentPerson.role || "后台运营账号")} · ${escapeHtml(permissionCount(currentPerson))}</span></div>
            <button type="button" data-route="notifications" role="menuitem">消息通知${unread ? `（${unread}）` : ""}</button>
            <button type="button" data-route="permission" role="menuitem">账号权限</button>
            <button type="button" data-action="退出登录" role="menuitem" class="danger-link">退出登录</button>
          </div>
        ` : ""}
      </div>
    </header>
  `;
}

function renderPage(page) {
  if (!hasAdminPagePermission(page)) return renderPermissionDenied(page);
  if (page.id === "users") return renderUsersReference(page);
  if (page.id === "guides") return renderGuidesReference(page);
  if (page.id === "merchants") return renderMerchantsReference(page);
  if (page.id === "merchant-services") return renderMerchantServicesReference(page);
  if (page.id === "activities-content") return renderActivitiesContentReference(page);
  if (page.id === "activity-edit" || page.id === "activity-signups") return renderMerchantOwnedActivityNotice(page);
  if (page.id === "banner") return renderBannerManagementReference(page);
  if (page.id === "health-monitor") return renderHealthMonitorReference(page);
  if (page.id === "elder-screen") return renderElderScreenReference(page);
  if (page.id === "device-bind") return renderDeviceBindReference(page);
  if (page.id === "notifications") return renderAdminNotificationsReference(page);
  if (page.id === "menus") return renderMenuPermissionSettings(page);
  switch (page.type) {
    case "dashboard":
      return renderDashboard(page);
    case "screen":
      return renderScreen(page);
    case "orders":
      return renderOrders(page);
    case "dispatch":
      return renderDispatch(page);
    case "detail":
      return renderDetail(page);
    case "form":
      return renderForm(page);
    case "rules":
      return renderRules(page);
    case "settings":
      return renderSettings(page);
    case "permission":
      return renderPermission(page);
    case "knowledge":
      return renderKnowledge(page);
    default:
      return renderList(page);
  }
}

function renderPermissionDenied(page) {
  const person = currentAdminPermissionPerson();
  return `
    ${pageHead(page, "")}
    <section class="panel permission-denied-panel">
      <div class="empty-mini">
        <strong>当前账号无权访问「${escapeHtml(page.title)}」</strong>
        <span>${escapeHtml(person.name || person.account)} 当前授权菜单：${escapeHtml(permissionCount(person))}</span>
        <button class="btn primary" type="button" data-route="permission">返回系统权限</button>
      </div>
    </section>
  `;
}

function adminContentTabs() {
  return [
    { id: "banner", label: "首页Banner", route: "banner", title: "首页Banner维护", description: "统一管理首页轮播、跳转路径、投放排序和上下线时间。" },
    { id: "policy", label: "政策指南", route: "policy", title: "政策指南维护", description: "统一维护政策解读、适用城市、引用依据和更新时间。" },
    { id: "article", label: "咨询文章", route: "article-edit", title: "咨询文章维护", description: "统一编辑咨询文章、封面、标签和发布渠道。" },
    { id: "notice", label: "三端通知", route: "notice", title: "三端通知维护", description: "统一管理用户端、向导端、商户端和后台通知模板与触达记录。" },
  ];
}

function currentAdminContentTab() {
  const tabs = adminContentTabs().map((item) => item.id);
  return tabs.includes(adminContentViewState.activeTab) ? adminContentViewState.activeTab : tabs[0];
}

function contentManagementRoute(page = currentPage(), action = "") {
  const actionText = normalizeActionText(action);
  if (page?.id === "banner") return "banner";
  if (page?.id === "policy") return "policy";
  if (page?.id === "article-edit") return "article-edit";
  if (page?.id === "notice") return "notice";
  if (page?.id === "notifications") return "notifications";
  if (page?.id === "activity-edit" || page?.id === "activity-signups") return "banner";
  if (page?.id === "activities-content") {
    const currentTab = adminContentTabs().find((item) => item.id === currentAdminContentTab());
    if (currentTab) return currentTab.route;
  }
  if (actionMatches(actionText, ["通知", "公告"])) return "notice";
  if (actionMatches(actionText, ["文章", "资讯", "咨询", "指南"])) return actionMatches(actionText, ["指南"]) ? "policy" : "article-edit";
  return "banner";
}

function operationalEditRoute(page) {
  if (page.group === "user") return "user-detail";
  if (page.group === "guide") return "guide-review";
  if (page.group === "merchant") return "merchant-review";
  if (page.group === "order") return "order-detail";
  if (page.group === "dispatch") return "dispatch-detail";
  if (page.group === "exception") return "device-exception";
  if (page.group === "content") return contentManagementRoute(page);
  if (page.group === "device") return "device-detail";
  if (page.group === "system") return "config";
  return "dashboard";
}

function adminAsset(src) {
  if (!src || /^https?:\/\//.test(src) || src.startsWith("data:")) return src;
  const mappings = [
    ["/user/assets/", "/ui-ref/用户端/云旅无忧用户端代码实现/assets/"],
    ["/merchant/assets/", "/ui-ref/商户端/merchant-ui-prototype/assets/"],
    ["/prototype/guide/assets/", "/ui-ref/向导端/向导端代码实现/assets/"],
    ["/prototype/admin/assets/", "/ui-ref/管理后台/yunlv-admin-ui/assets/"],
  ];
  const found = mappings.find(([prefix]) => src.startsWith(prefix));
  const normalized = found ? `${found[1]}${src.slice(found[0].length)}` : src;
  if (!normalized.startsWith("/ui-ref/")) return normalized;
  const separator = normalized.includes("?") ? "&" : "?";
  return `${normalized}${separator}v=${ADMIN_ASSET_VERSION}`;
}

function adminImg(src, alt = "") {
  return `<img src="${adminAsset(src)}" alt="${alt}" loading="lazy" />`;
}

function renderBannerManagementReference(page) {
  const loading = adminBannerState.loading && !adminBannerState.home;
  const home = adminBannerState.home;
  const activityData = adminBannerState.activityData || { activities: [], signups: [] };
  const activities = Array.isArray(activityData.activities) ? activityData.activities : [];
  const signups = Array.isArray(activityData.signups) ? activityData.signups : [];
  const orders = Array.isArray(adminBannerState.orders) ? adminBannerState.orders : [];
  const cityStats = adminDashboardState.data?.map?.cityStats || [];
  const draft = ensureAdminBannerDraft(home, activities);
  const bannerRows = buildAdminBannerRows(home, draft).filter((row) => !adminBannerState.deletedIds.has(row.id));
  const platformTags = adminBannerDisplayPlatforms(draft.platforms).map((item) => tag(item, "blue")).join(" ");
  const previewCards = (home?.activityRecommendation?.items || []).slice(0, 3);
  const latestBannerLog = buildAdminBannerPublishRows(adminAuditState.logs || [], home)[0] || null;
  const publishRows = buildAdminBannerPublishRows(adminAuditState.logs || [], home);
  const linkedTargetLabel = adminBannerTargetLabel(draft, activities);
  const bannerMetrics = buildAdminBannerMetrics(home, draft, cityStats);
  const summaryRows = buildAdminBannerSummaryRows(home, draft, latestBannerLog, linkedTargetLabel);
  const todayRows = buildAdminBannerTodayRows(home, signups, orders, cityStats);
  const trend = buildAdminBannerTrend(signups, orders);
  const regionSegments = buildAdminBannerRegionSegments(cityStats);
  return `
    ${pageHead(page, `${button("重置草稿", "plus")} ${button("保存并发布", "save", "primary")} ${button("导出数据", "export")} ${button("预览首页", "eye")}`)}
    <div class="admin-banner-reference">
      ${loading ? `<section class="panel admin-banner-loading"><div class="panel-head"><h2>正在加载首页 Banner 配置</h2></div><p class="muted">正在同步 /api/admin/content/home、/api/admin/activities、/api/admin/orders 与 /api/admin/ui-actions。</p></section>` : ""}
      ${!loading && adminBannerState.error ? `<section class="panel admin-banner-loading"><div class="panel-head"><h2>Banner 数据加载失败</h2></div><p class="muted">${escapeHtml(adminBannerState.error)}</p></section>` : ""}
      <div class="admin-banner-kpis">
        ${bannerMetrics.map(([icon, title, value, sub, color]) => `<article class="admin-banner-kpi ${color}"><span>${icons[icon] || icons.grid}</span><div><small>${title}</small><strong>${value}</strong><em>${sub}</em></div></article>`).join("")}
      </div>
      <div class="admin-banner-workspace">
        <section class="panel admin-banner-list-panel">
          <div class="panel-head"><h2>Banner列表（共 ${bannerRows.length} 条）</h2></div>
          <table class="admin-banner-table">
            <thead><tr>${["排序", "缩略图", "标题", "跳转类型", "展示端", "位置", "状态", "时间", "操作"].map((item) => `<th>${item}</th>`).join("")}</tr></thead>
            <tbody>
              ${bannerRows.map((row) => `
                <tr class="${row.id === adminBannerState.selectedId ? "active" : ""}">
                  <td><i class="drag-dot">⋮⋮</i>${row.sortNo}</td>
                  <td>${adminImg(row.image, row.title)}</td>
                  <td><strong>${escapeHtml(row.title)}</strong></td>
                  <td>${escapeHtml(row.linkTypeText)}</td>
                  <td>${escapeHtml(row.platformText)}</td>
                  <td>${escapeHtml(row.position)}</td>
                  <td>${tag(row.status, adminBannerTone(row.status))}</td>
                  <td>${escapeHtml(row.updatedAt)}</td>
                  <td><button type="button" data-action="编辑Banner:${row.id}">编辑</button><button type="button" data-action="切换Banner状态:${row.id}">${row.status === "已发布" ? "下线" : "启用"}</button><button type="button" data-action="删除Banner:${row.id}">删除</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="table-footer"><span>共 ${bannerRows.length} 条</span><button type="button">1</button><span>10条/页</span></div>
        </section>
        <section class="panel admin-banner-editor-panel">
          <div class="panel-head"><h2>Banner编辑（ID: ${escapeHtml(adminBannerRecordId(home))}）</h2></div>
          <div class="banner-cover-editor">
            ${adminImg(draft.image, draft.title)}
            <button type="button" data-action="更换Banner图片">更换图片<br><small>点击切换已接入素材<br>${escapeHtml(draft.image.split("/").pop() || "当前图片")}</small></button>
          </div>
          <div class="banner-form-grid">
            <div class="form-row"><label>标题</label><input class="form-control" data-admin-banner-field="title" value="${escapeHtml(draft.title)}" /></div>
            <div class="form-row"><label>副标题</label><input class="form-control" data-admin-banner-field="slogan" value="${escapeHtml(draft.slogan)}" /></div>
            <div class="form-row"><label>按钮文案</label><input class="form-control" data-admin-banner-field="buttonText" value="${escapeHtml(draft.buttonText)}" /></div>
            <div class="form-row"><label>跳转类型</label><div class="chip-row">${ADMIN_BANNER_LINK_TYPES.map(([value, label]) => adminBannerChoiceButton(label, draft.linkType === value, `选择Banner跳转类型:${value}`)).join("")}</div></div>
            <div class="form-row"><label>${draft.linkType === "activity" ? "选择活动" : draft.linkType === "service" ? "服务标识" : draft.linkType === "article" ? "文章标识" : "自定义链接"}</label>${draft.linkType === "activity"
              ? `<select class="form-control" data-admin-banner-field="linkTarget">${activities.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === draft.linkTarget ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}</select>`
              : `<input class="form-control" data-admin-banner-field="linkTarget" value="${escapeHtml(draft.linkTarget)}" />`}</div>
            <div class="form-row two-inputs"><label>展示时间</label><div class="inline-input-group"><input class="form-control" data-admin-banner-field="startAt" value="${escapeHtml(draft.startAt)}" /><input class="form-control" data-admin-banner-field="endAt" value="${escapeHtml(draft.endAt)}" /></div></div>
            <div class="form-row"><label>城市定向（可多选）</label><div class="chip-row">${adminBannerCityPool(home, cityStats).map((city) => adminBannerChoiceButton(city, draft.cityOptions.includes(city), `切换Banner城市:${city}`)).join("")}</div></div>
            <div class="form-row"><label>展示端</label><div class="chip-row">${ADMIN_BANNER_PLATFORMS.map((platform) => adminBannerChoiceButton(platform, draft.platforms.includes(platform), `切换Banner平台:${platform}`)).join("")}</div></div>
            <div class="form-row switch-row"><label>状态</label><button class="toggle ${draft.status === "已发布" ? "on" : ""}" type="button" data-action="切换Banner状态" aria-pressed="${draft.status === "已发布" ? "true" : "false"}"></button><strong>${escapeHtml(draft.status)}</strong></div>
            <div class="form-row range-row"><label>推荐权重</label><input data-admin-banner-field="weight" type="range" min="0" max="100" value="${Number(draft.weight || 0)}" /><b>${Number(draft.weight || 0)} / 100</b></div>
            <div class="form-row banner-editor-actions"><label>操作</label><div class="chip-row">${button("保存并发布", "save", "primary")} ${button("恢复后台配置", "clock")}</div></div>
          </div>
        </section>
        <section class="panel admin-banner-preview-panel">
          <div class="panel-head"><h2>前端效果预览</h2><span class="right">${platformTags}</span></div>
          <div class="mini-phone-banner">
            <div class="mini-phone-status"><b>9:41</b><span>${icons.search}</span></div>
            <div class="mini-location"><strong>${escapeHtml(home?.topArea?.currentCity || draft.cityOptions[0] || "昆明市")}</strong><small>${escapeHtml(draft.slogan || "搜索服务、活动、目的地")}</small></div>
            <div class="mini-banner-card">${adminImg(draft.image, draft.title)}</div>
            <div class="mini-shortcuts">${(home?.quickServices || []).slice(0, 5).map((item, index) => `<span class="c${index}">${escapeHtml(item.title)}</span>`).join("")}</div>
            <div class="mini-activity-line">
              ${previewCards.map((item) => `<article>${adminImg(item.image, item.title)}<b>${escapeHtml(item.title)}</b></article>`).join("")}
            </div>
          </div>
          <div class="banner-metrics">
            ${infoPanel("Banner信息", summaryRows, false)}
            ${infoPanel("联动数据（今日）", todayRows, false)}
          </div>
        </section>
      </div>
      <div class="admin-banner-bottom">
        ${linePanel("内容联动趋势（近7日）", ["活动报名", "服务订单"], trend, ["activities-content", "orders"])}
        ${donutPanel("地域分布", "覆盖城市", valueText(regionSegments.reduce((sum, item) => sum + Number(item.count || 0), 0)), regionSegments)}
        ${miniTable("发布记录", publishRows.length ? publishRows : [["暂无记录", "等待后台发布", "平台管理员"]], ["时间", "操作", "操作人"])}
      </div>
      <div class="admin-banner-footnote">数据来源：/api/admin/content/home、/api/admin/activities、/api/admin/orders、/api/admin/ui-actions。</div>
    </div>
  `;
}

const ADMIN_BANNER_LINK_TYPES = [
  ["activity", "活动"],
  ["service", "服务"],
  ["article", "文章"],
  ["custom-link", "自定义链接"],
];

const ADMIN_BANNER_PLATFORMS = ["小程序", "iOS App", "Android App"];

const ADMIN_BANNER_IMAGE_CHOICES = [
  "/user/assets/home-hero.jpg",
  "/user/assets/health-hero.jpg",
  "/user/assets/activity-taiji.jpg",
  "/user/assets/activity-calligraphy.jpg",
  "/user/assets/destination-hero.jpg",
  "/user/assets/device-hero.jpg",
];

function ensureAdminBannerDraft(home, activities = []) {
  if (!adminBannerState.draft) {
    adminBannerState.draft = defaultAdminBannerDraft(home, activities);
  }
  return adminBannerState.draft;
}

function defaultAdminBannerDraft(home, activities = []) {
  const banner = home?.banner || {};
  const linkedActivity = activities.find((item) => item.id === banner.linkTarget) || activities[0] || null;
  return {
    id: "home-banner",
    image: banner.image || ADMIN_BANNER_IMAGE_CHOICES[0],
    title: banner.title || "旅居生活 从心出发",
    slogan: banner.slogan || "发现美好 · 结识同伴 · 乐享晚年",
    buttonText: banner.buttonText || "立即了解",
    linkType: banner.linkType || "activity",
    linkTarget: banner.linkTarget || linkedActivity?.id || "",
    startAt: banner.startAt || banner.startTime || "2026-06-16 00:00:00",
    endAt: banner.endAt || banner.endTime || "2026-07-16 23:59:59",
    cityOptions: adminBannerCityPool(home, adminDashboardState.data?.map?.cityStats || []).filter((item) => (home?.topArea?.cityOptions || []).includes(item) || (home?.topArea?.cityOptions || []).includes(item.replace(/市$/, ""))),
    platforms: Array.isArray(banner.platforms) && banner.platforms.length ? banner.platforms.slice() : ADMIN_BANNER_PLATFORMS.slice(),
    status: banner.status || "已发布",
    weight: Number(banner.weight || 88),
  };
}

function adminBannerRecordId(home) {
  const latest = buildAdminBannerPublishRows(adminAuditState.logs || [], home)[0];
  return latest ? `HOME-${latest[0].replace(/[^\d]/g, "").slice(0, 12) || "BANNER"}` : "HOME-BANNER";
}

function adminBannerDisplayPlatforms(platforms = []) {
  const rows = Array.isArray(platforms) && platforms.length ? platforms : ADMIN_BANNER_PLATFORMS;
  return rows.filter((item) => ADMIN_BANNER_PLATFORMS.includes(item));
}

function adminBannerLinkTypeLabel(type) {
  return ADMIN_BANNER_LINK_TYPES.find(([value]) => value === type)?.[1] || "自定义链接";
}

function adminBannerTone(statusText = "") {
  if (statusText === "已发布") return "green";
  if (statusText === "待上线") return "orange";
  return "gray";
}

function adminBannerChoiceButton(label, active, action) {
  return `<button class="banner-choice ${active ? "active" : ""}" type="button" data-action="${escapeHtml(action)}" aria-pressed="${active ? "true" : "false"}">${escapeHtml(label)}</button>`;
}

function adminBannerCityPool(home, cityStats = []) {
  const set = new Set();
  (home?.topArea?.cityOptions || []).forEach((item) => {
    const value = String(item || "").trim();
    if (!value) return;
    set.add(value.endsWith("市") ? value : `${value}市`);
  });
  cityStats.forEach((item) => {
    const value = String(item.city || "").trim();
    if (value) set.add(value.endsWith("市") ? value : `${value}市`);
  });
  return [...set].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function buildAdminBannerRows(home, draft) {
  const latest = buildAdminBannerPublishRows(adminAuditState.logs || [], home)[0];
  return [{
    id: "home-banner",
    sortNo: "01",
    image: draft.image,
    title: draft.title,
    linkTypeText: adminBannerLinkTypeLabel(draft.linkType),
    platformText: adminBannerDisplayPlatforms(draft.platforms).join(" / "),
    position: "首页轮播",
    status: draft.status,
    updatedAt: latest?.[0] || "未发布",
  }];
}

function buildAdminBannerMetrics(home, draft, cityStats = []) {
  const published = draft.status === "已发布" ? 1 : 0;
  const queued = draft.status === "待上线" ? 1 : 0;
  const cityCount = adminBannerCityPool(home, cityStats).length;
  return [
    ["screen", "Banner总数", "1", "当前接入首页主 Banner", "blue"],
    ["users", "使用中", valueText(published), `${escapeHtml(draft.status)}配置`, "green"],
    ["store", "待上线", valueText(queued), `${valueText((home?.activityRecommendation?.count) || 0)} 个推荐活动联动`, "orange"],
    ["chart", "覆盖城市", valueText(cityCount), "取自首页城市配置与业务地域", "purple"],
  ];
}

function buildAdminBannerSummaryRows(home, draft, latestBannerLog, linkedTargetLabel) {
  return [
    ["更新人", latestBannerLog?.[2] || "平台管理员"],
    ["更新时间", latestBannerLog?.[0] || "未发布"],
    ["跳转目标", linkedTargetLabel],
    ["当前状态", draft.status],
  ];
}

function buildAdminBannerTodayRows(home, signups = [], orders = [], cityStats = []) {
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const todaySignups = signups.filter((item) => String(item.createdAt || "").startsWith(todayPrefix)).length;
  const todayOrders = orders.filter((item) => String(item.createdAt || item.time || "").startsWith(todayPrefix)).length;
  return [
    ["推荐活动", valueText(home?.activityRecommendation?.count || 0)],
    ["活动报名", valueText(todaySignups)],
    ["服务订单", valueText(todayOrders)],
    ["覆盖地域", valueText(adminBannerCityPool(home, cityStats).length)],
  ];
}

function adminBannerDateKey(value = "") {
  const normalized = String(value || "").replace(" ", "T");
  const parsed = Number.isFinite(Date.parse(normalized)) ? new Date(normalized) : null;
  if (!parsed) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function adminBannerDateLabel(key) {
  const [, month, day] = String(key || "").split("-");
  return month && day ? `${month}-${day}` : key;
}

function buildAdminBannerTrend(signups = [], orders = []) {
  const now = new Date();
  const keys = Array.from({ length: 7 }, (_, index) => {
    const value = new Date(now);
    value.setDate(now.getDate() - (6 - index));
    return adminBannerDateKey(value.toISOString().slice(0, 10));
  });
  const signupCounter = new Map(keys.map((key) => [key, 0]));
  const orderCounter = new Map(keys.map((key) => [key, 0]));
  signups.forEach((item) => {
    const key = adminBannerDateKey(item.createdAt || "");
    if (signupCounter.has(key)) signupCounter.set(key, signupCounter.get(key) + 1);
  });
  orders.forEach((item) => {
    const key = adminBannerDateKey(item.createdAt || item.time || "");
    if (orderCounter.has(key)) orderCounter.set(key, orderCounter.get(key) + 1);
  });
  const signupSeries = keys.map((key) => signupCounter.get(key) || 0);
  const orderSeries = keys.map((key) => orderCounter.get(key) || 0);
  return {
    labels: keys.map(adminBannerDateLabel),
    orders: signupSeries,
    serviceUsers: orderSeries,
    totalOrders: signupSeries.reduce((sum, value) => sum + value, 0),
    totalServiceUsers: orderSeries.reduce((sum, value) => sum + value, 0),
    updatedAt: adminNowText(),
  };
}

function buildAdminBannerRegionSegments(cityStats = []) {
  const colors = ["#176bff", "#20be70", "#ffad24", "#8056e8", "#23c8db"];
  const rows = cityStats
    .map((item, index) => {
      const count = Number(item.activities || 0) + Number(item.orders || 0);
      return {
        name: item.city || `区域${index + 1}`,
        count,
        color: colors[index % colors.length],
        route: "dashboard",
      };
    })
    .filter((item) => item.count > 0);
  const total = rows.reduce((sum, item) => sum + item.count, 0) || 1;
  return rows.length
    ? rows.map((item) => ({
      ...item,
      value: item.count,
      text: `${item.count} 项（${Math.round((item.count / total) * 100)}%）`,
    }))
    : [{ name: "暂无业务地域", count: 1, value: 1, text: "1 项（100%）", color: "#176bff", route: "dashboard" }];
}

function buildAdminBannerPublishRows(logs = [], home) {
  const rows = (logs || [])
    .filter((item) => String(item.action || "").includes("更新首页内容配置"))
    .map((item) => [item.createdAt || item.time || "", item.target ? `${item.action}：${item.target}` : item.action || "更新首页内容配置", item.actor || "平台管理员"]);
  if (rows.length) return rows.slice(0, 10);
  const fallbackTitle = home?.banner?.title || "首页 Banner";
  return [["暂无后台发布记录", `更新首页内容配置：${fallbackTitle}`, "平台管理员"]];
}

function adminBannerTargetLabel(draft, activities = []) {
  if (draft.linkType === "activity") {
    return activities.find((item) => item.id === draft.linkTarget)?.title || "未选择活动";
  }
  if (draft.linkType === "custom-link") return draft.linkTarget || "未填写链接";
  return draft.linkTarget || adminBannerLinkTypeLabel(draft.linkType);
}

function renderHealthMonitorReference(page) {
  const rows = [
    ["李奶奶（72岁）", "乐心手环 LX-05 Pro", "心率（次/分）", "82", "60-100", "正常", "05-19 10:28:15", "详情"],
    ["王爷爷（78岁）", "智能血压计 BP-610", "收缩压（mmHg）", "158", "90-140", "中度异常", "05-19 10:28:10", "详情"],
    ["张奶奶（68岁）", "小云机器人 V3.2", "血氧（%）", "92", "95-100", "轻度异常", "05-19 10:28:05", "详情"],
    ["赵爷爷（81岁）", "定位手环 A28", "步数（步）", "256", "&gt;3000", "偏低", "05-19 10:27:58", "详情"],
    ["刘奶奶（75岁）", "血糖仪 CX-102", "血糖（mmol/L）", "9.7", "3.9-6.1", "异常", "05-19 10:27:49", "详情"],
    ["陈爷爷（69岁）", "乐心手环 LX-05 Pro", "睡眠（小时）", "4.2", "6-9", "偏低", "05-19 10:27:41", "详情"],
  ];
  return `
    <div class="admin-health-monitor-ref">
      <div class="admin-banner-actions health-actions">
        <span></span>
        <button class="btn primary" type="button">${icons.device}<span>同步数据</span></button>
        <button class="btn" type="button">${icons.calendar}<span>配置阈值</span></button>
        <button class="btn" type="button">${icons.export}<span>导出报表</span></button>
      </div>
      <div class="admin-health-kpis">
        ${[
          ["clock", "今日同步记录", "38,420", "较昨日 ↑ 12.6%", "blue"],
          ["alert", "异常指标", "31", "较昨日 ↓ 6.1%", "red"],
          ["users", "高风险老人", "18", "较昨日 ↑ 2", "orange"],
          ["device", "离线设备", "56", "较昨日 ↓ 8", "purple"],
          ["shield", "数据完整率", "96.2%", "较昨日 ↑ 1.8%", "green"],
        ].map(([icon, title, value, sub, color]) => `<article class="admin-banner-kpi ${color}"><span>${icons[icon] || icons.grid}</span><div><small>${title}</small><strong>${value}</strong><em>${sub}</em></div></article>`).join("")}
      </div>
      <section class="panel admin-health-filter">
        <label><span>老人姓名</span><input placeholder="搜索姓名/手机号" /></label>
        <label><span>设备类型</span><select><option>全部</option></select></label>
        <label><span>指标类型</span><select><option>全部</option></select></label>
        <label><span>健康状态</span><select><option>全部</option></select></label>
        <label><span>城市</span><select><option>全部城市</option></select></label>
        <label><span>日期范围</span><input value="2024-05-19  →  2024-05-19" /></label>
        <button class="btn primary" type="button">查询</button>
        <button class="btn" type="button">重置</button>
      </section>
      <section class="panel admin-health-tabs">
        ${["实时监测", "异常指标", "趋势分析", "阈值配置"].map((item, index) => `<button class="${index === 0 ? "active" : ""}" type="button">${item}</button>`).join("")}
      </section>
      <div class="admin-health-main">
        <div class="grid">
          <div class="admin-grid two health-chart-row">
            <section class="panel">
              <div class="panel-head"><h2>健康指标趋势（实时/最近24小时）</h2><span class="right">${tag("24小时", "blue")} ${tag("7天", "gray")} ${tag("30天", "gray")}</span></div>
              <div class="health-multi-chart">
                <div class="health-legend"><span class="red-dot"></span>心率（次/分）<span class="blue-dot"></span>收缩压（mmHg）<span class="orange-dot"></span>舒张压（mmHg）<span class="green-dot"></span>血氧（%）</div>
                ${lineChart()}
              </div>
            </section>
            <section class="panel">
              <div class="panel-head"><h2>健康风险分布（全部老人）</h2></div>
              <div class="health-risk-grid">
                ${donutPanel(" ", "总人数", "7,256", [{ name: "健康", value: 80, text: "5,842（80.5%）", color: "#20be70" }, { name: "轻度异常", value: 12, text: "896（12.3%）", color: "#ffcc4d" }, { name: "中度异常", value: 4, text: "318（4.4%）", color: "#ff9c13" }, { name: "重度异常", value: 3, text: "200（2.8%）", color: "#ff5252" }])}
              </div>
            </section>
          </div>
          <section class="panel health-table-panel">
            <div class="panel-head"><h2>健康数据明细（实时数据）</h2></div>
            <table class="admin-health-table">
              <thead><tr>${["老人", "设备", "指标", "当前值", "参考范围", "风险等级", "采集时间", "操作"].map((item) => `<th>${item}</th>`).join("")}</tr></thead>
              <tbody>
                ${rows.map((row, index) => `<tr><td><span class="photo ${index % 2 ? "male" : "female"} mini"></span>${row[0]}</td>${row.slice(1).map((cell, i) => `<td class="${i === 4 ? cell.includes("正常") ? "ok" : "warn" : ""}">${cell}</td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
            <div class="table-footer"><span>共 3,782 条</span><button type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><span>10条/页</span><span>跳至</span><input value="1" /><span>页</span></div>
          </section>
        </div>
        <aside class="grid admin-health-side">
          <section class="panel threshold-panel">
            <div class="panel-head"><h2>阈值规则设置</h2><span class="right"><button class="link" type="button">编辑规则</button></span></div>
            ${["心率", "血压", "血氧", "睡眠", "体温"].map((item, index) => `<button class="${index === 0 ? "active" : ""}" type="button">${item}</button>`).join("")}
            <div class="threshold-rules">
              ${[
                ["正常范围（次/分）", "60", "100"],
                ["轻度异常", "50 - 59", "101 - 110"],
                ["中度异常", "40 - 49", "111 - 130"],
                ["重度异常", "< 40", "> 130"],
              ].map((row) => `<label><span>${row[0]}</span><input value="${row[1]}" /><input value="${row[2]}" /></label>`).join("")}
            </div>
            <div class="form-row switch-row"><label>启用规则</label><span class="switch on"></span></div>
          </section>
          <section class="panel">
            <div class="panel-head"><h2>AI 异常解释（最近1小时）</h2><span class="right"><button class="link" type="button">查看全部</button></span></div>
            <ul class="health-ai-list">
              <li>检测到 7 名异常聚集，高风险 2 条。</li>
              <li>王爷爷 收缩压 158 mmHg，建议优先联系并复测。</li>
              <li>张奶奶 血氧 92%，可能低氧或佩戴不稳。</li>
              <li>刘奶奶 血糖 9.7 mmol/L，建议跟进饮食和用药。</li>
            </ul>
            <button class="link" type="button">查看详细分析报告 ${chevron("right")}</button>
          </section>
          <section class="panel">
            <div class="panel-head"><h2>推荐跟进措施</h2></div>
            ${miniTable("", [["高风险老人回访", "18人", "去回访"], ["异常健康咨询", "31单", "去分配"], ["设备巡检建议", "12台", "去处理"], ["健康提醒推送", "42条", "去发送"]], ["事项", "数量", "操作"])}
          </section>
        </aside>
      </div>
      <div class="admin-grid five health-bottom-row">
        ${linePanel("数据采集维度", ["设备在线率", "数据完整率"])}
        ${linePanel("异常趋势（近7天）", ["重度异常", "中度异常"])}
        ${donutPanel("数据来源分布", "总记录数", "38,420", [{ name: "乐心手环", value: 42, text: "42.1%", color: "#176bff" }, { name: "小云机器人", value: 28, text: "28.7%", color: "#20be70" }, { name: "血压计", value: 15, text: "15.3%", color: "#ff9c13" }, { name: "定位手表", value: 8, text: "7.6%", color: "#8056e8" }])}
        ${infoPanel("数据同步状态", [["成功", "37,128（96.6%）"], ["失败", "1,022（2.7%）"], ["进行中", "270（0.7%）"], ["上次同步", "05-19 10:28:18"]])}
        ${miniTable("最近告警TOP5", [["王爷爷", "血压持续偏高", "10:28"], ["张奶奶", "血氧偏低", "10:27"], ["刘奶奶", "睡眠不足", "10:26"], ["李奶奶", "心率偏快", "10:24"]], ["老人", "异常", "时间"])}
      </div>
    </div>
  `;
}

function renderElderScreenReference(page) {
  if (adminScreenState.error) return renderAdminScreenError(page);
  if (!adminScreenState.data) return renderAdminScreenLoading(page);
  const screen = screenDataForPage(page);
  if (!screen) return renderAdminScreenOverview(page);
  const cityRows = elderCityRows(screen);
  const mapPoints = elderMapPoints(cityRows, screen.alertFeed || []);
  const healthRows = elderHealthRows(screen.healthRecords || []);
  const alertRows = elderAlertRows(screen.alertFeed || []);
  const serviceRows = elderServiceRows(screen.serviceWorkOrders || []);
  const updatedAt = formatAdminScreenTime(screen.updatedAt || adminScreenState.data?.updatedAt);
  const healthTotal = elderDistributionTotal(screen.healthDistribution || []);
  const deviceTotal = elderDistributionTotal(screen.deviceStatus || []);
  return `
    <div class="admin-elder-screen-ref">
      <div class="elder-screen-title">
        <h1>${escapeHtml(screen.title)}</h1>
        <p>${icons.shield} ${escapeHtml(screen.purpose || "健康状态、设备在线、异常预警、服务守护")}</p>
        <time>${escapeHtml(updatedAt || "后台接口实时数据")}　<span>接口实时数据</span></time>
      </div>
      <div class="elder-screen-kpis">
        ${elderMetricCards(screen.metrics || [], screen)}
      </div>
      <div class="elder-screen-layout">
        <aside class="elder-screen-left">
          ${linePanel("健康风险趋势（近7天）", ["预警记录", "健康记录"], elderRiskTrend(screen), ["exceptions", "health-records"])}
          <section class="panel elder-city-rank">
            <div class="panel-head"><h2>城市分布TOP5（单位：人）</h2></div>
            ${cityRows.map(([city, count, percent]) => `<button type="button" data-route="users"><span>${escapeHtml(city)}</span><b style="--w:${escapeHtml(percent)}"></b><strong>${escapeHtml(count)}</strong><em>${escapeHtml(percent)}</em></button>`).join("")}
          </section>
          ${elderRiskListPanel(screen)}
          <section class="panel elder-service-timeline">
            <div class="panel-head"><h2>今日服务执行时间线</h2></div>
            ${elderServiceTimelineRows(screen.serviceWorkOrders || []).map((item) => `<button type="button" data-route="orders"><span>${escapeHtml(item.name)}</span><b style="--start:${item.start}%;--len:${item.len}%"></b><em>${item.count}单</em></button>`).join("")}
          </section>
        </aside>
        <section class="panel elder-screen-map">
          <div class="panel-head">
            <h2>老人分布与预警地图</h2>
            <span class="right"><button class="link" type="button" data-route="exceptions">预警明细 ${chevron("right")}</button><button class="link" type="button" data-route="orders">服务工单 ${chevron("right")}</button></span>
          </div>
          <div class="elder-map-canvas">
            ${mapPoints.map((point) => `<span class="city" style="left:${point.labelX}%;top:${point.labelY}%">${escapeHtml(point.city)}</span>`).join("")}
            ${mapPoints.map((point) => `<button class="${point.kind}" type="button" data-route="${escapeHtml(point.route)}" aria-label="${escapeHtml(`${point.city}${point.count}项，查看${point.route === "exceptions" ? "预警" : "服务"}数据`)}" style="left:${point.x}%;top:${point.y}%;background:${point.color}">${escapeHtml(point.text)}</button>`).join("")}
            <div class="map-legend">
              ${elderMapLegend(screen).map((item, index) => `<button type="button" data-route="${escapeHtml(item.route)}" class="m${index}">${escapeHtml(item.label)}</button>`).join("")}
            </div>
          </div>
          <div class="elder-map-note">数据更新：${escapeHtml(updatedAt || "接口同步中")}</div>
        </section>
        <aside class="elder-screen-right">
          ${donutPanel("健康状态分布", "健康记录", healthTotal, elderDonutSegments(screen.healthDistribution || [], "health-records"))}
          ${donutPanel("设备在线/离线", "总设备", deviceTotal, elderDonutSegments(screen.deviceStatus || [], "devices"))}
          <section class="panel elder-feed">
            <div class="panel-head"><h2>实时预警feed</h2><button class="link" type="button" data-route="exceptions">查看全部 ${chevron("right")}</button></div>
            ${elderFeedRows(screen.alertFeed || []).map((item) => `<button type="button" data-route="exceptions"><b>${escapeHtml(item.level)}</b><span><strong>${escapeHtml(item.title)}</strong><em>${escapeHtml(item.desc)}</em></span><small>${escapeHtml(item.city)}<br>${escapeHtml(item.time)}</small></button>`).join("")}
          </section>
          <section class="panel elder-ai">
            <div class="panel-head"><h2>风险解释与处置建议</h2><button class="link" type="button" data-route="health-monitor">健康记录 ${chevron("right")}</button></div>
            ${elderRiskSuggestions(screen).map((item) => `<button type="button" data-route="${escapeHtml(item.route)}"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.desc)}</p></button>`).join("")}
          </section>
        </aside>
      </div>
      <div class="elder-screen-bottom">
        ${miniTable("最新健康记录", healthRows, ["老人", "指标", "当前值", "参考范围", "风险", "采集时间"])}
        ${miniTable("服务工单", serviceRows, ["订单编号", "服务类型", "老人", "服务时间", "状态", "执行方", "操作"])}
        ${miniTable("预警处理记录", alertRows, ["时间", "类型", "老人", "优先级", "状态", "处理人", "操作"])}
      </div>
      <div class="admin-banner-footnote">数据说明：本页读取 /api/admin/screens 接口，统计口径基于当前后台老人、健康、设备、异常和订单数据。</div>
    </div>
  `;
}

function elderMetricCards(metrics = [], screen = {}) {
  const palette = ["blue", "green", "teal", "orange", "red", "purple", "blue", "green"];
  return metrics.map((metric, index) => {
    const display = elderMetricDisplay(metric, screen);
    const label = display.label;
    const value = display.value;
    const route = elderMetricRoute(label);
    const icon = elderMetricIcon(label, index);
    return `
      <button class="admin-banner-kpi ${palette[index % palette.length]}" type="button" data-route="${escapeHtml(route)}" aria-label="${escapeHtml(`${label} ${value}`)}">
        <span>${icons[icon] || icons.grid}</span>
        <div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong><em>${escapeHtml(display.trend)}</em></div>
      </button>
    `;
  }).join("");
}

function elderMetricDisplay(metric = {}, screen = {}) {
  const label = String(metric.label || "指标");
  if (label === "健康状态分布") {
    const rows = Array.isArray(screen.healthDistribution) ? screen.healthDistribution : [];
    const total = rows.reduce((sum, item) => sum + Number(item.value || 0), 0);
    const summary = rows
      .slice(0, 3)
      .map((item) => `${String(item.name || "未分类").replace(/\s+/g, "").replace("目标8000步", "目标")}${Number(item.value || 0)}`)
      .join(" · ");
    return {
      label,
      value: `${total || metric.value || 0}项`,
      trend: summary || metric.trend || "健康记录聚合",
    };
  }
  return {
    label,
    value: `${metric.value ?? 0}${metric.unit || ""}`,
    trend: metric.trend || "接口实时数据",
  };
}

function elderMetricIcon(label = "", index = 0) {
  if (/设备/.test(label)) return "device";
  if (/异常|SOS|预警/.test(label)) return "alert";
  if (/服务|工单|订单/.test(label)) return "order";
  if (/满意|健康/.test(label)) return "heart";
  if (/在线/.test(label)) return "users";
  return ["user", "users", "heart", "device", "alert", "order", "chart", "clock"][index % 8];
}

function elderMetricRoute(label = "") {
  if (/设备/.test(label)) return "devices";
  if (/异常|SOS|预警/.test(label)) return "exceptions";
  if (/服务|工单|订单/.test(label)) return "orders";
  if (/满意|评价/.test(label)) return "after-sales";
  if (/健康/.test(label)) return "health-records";
  return "users";
}

function elderDistributionTotal(rows = []) {
  return rows.reduce((sum, item) => sum + Number(item.value || 0), 0).toLocaleString("zh-CN");
}

function elderDonutSegments(rows = [], route = "dashboard") {
  const palette = ["#20be70", "#ffad24", "#176bff", "#8056e8", "#ff5252", "#1aa4d8"];
  return rows.map((item, index) => ({
    name: item.name || "未分类",
    value: Number(item.value || 0),
    text: `${Number(item.value || 0).toLocaleString("zh-CN")}（${item.ratio || "0%"}）`,
    color: palette[index % palette.length],
    route,
  }));
}

function elderCityFromText(text = "") {
  const value = String(text || "");
  const direct = value.match(/(昆明市|曲靖市|玉溪市|保山市|昭通市|丽江市|普洱市|临沧市|楚雄市|红河州|文山州|西双版纳州|大理州|德宏州|怒江州|迪庆州|大理市|弥勒市)/)?.[1];
  if (direct) return direct;
  if (/弥勒|湖泉|红河/.test(value)) return "弥勒市";
  if (/昆明|五华|盘龙|官渡|西山|呈贡|翠湖/.test(value)) return "昆明市";
  if (/大理|下关/.test(value)) return "大理市";
  if (/丽江|古城/.test(value)) return "丽江市";
  return "未定位";
}

function elderCityRows(screen) {
  const rows = Array.isArray(screen.cityDistribution) ? screen.cityDistribution : [];
  if (rows.length) {
    const total = rows.reduce((sum, item) => sum + Number(item.total || 0), 0) || 1;
    return rows
      .filter((item) => Number(item.total || 0) > 0 || Number(item.devices || 0) > 0 || Number(item.elders || 0) > 0)
      .sort((a, b) => Number(b.total || 0) - Number(a.total || 0) || Number(b.alerts || 0) - Number(a.alerts || 0))
      .slice(0, 5)
      .map((item) => {
        const count = Number(item.total || 0);
        return [
          item.city || "未定位",
          count.toLocaleString("zh-CN"),
          `${((count / total) * 100).toFixed(1)}%`,
          count,
          item,
        ];
      });
  }
  const counts = {};
  [...(screen.alertFeed || []), ...(screen.serviceWorkOrders || [])].forEach((item) => {
    const city = elderCityFromText(item.location || item.city || "");
    counts[city] = (counts[city] || 0) + 1;
  });
  if (!Object.keys(counts).length) counts["未定位"] = Number((screen.metrics || []).find((item) => item.label === "老人总数")?.value || 0);
  const fallbackTotal = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0) || 1;
  return Object.entries(counts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 5)
    .map(([city, count]) => [city, Number(count).toLocaleString("zh-CN"), `${((Number(count) / fallbackTotal) * 100).toFixed(1)}%`, Number(count), null]);
}

function elderMapPoints(cityRows = [], alerts = []) {
  const positions = [
    { x: 47, y: 48, labelX: 43, labelY: 38 },
    { x: 23, y: 30, labelX: 18, labelY: 22 },
    { x: 68, y: 39, labelX: 63, labelY: 31 },
    { x: 65, y: 66, labelX: 60, labelY: 58 },
    { x: 35, y: 61, labelX: 30, labelY: 53 },
  ];
  const colors = ["#176bff", "#20be70", "#ffad24", "#8056e8", "#ff5252"];
  return cityRows.map(([city, countText, percent, rawCount, source], index) => {
    const alertCount = Number(source?.alerts || 0);
    const serviceTotal = Number(source?.serviceTotal ?? ((source?.serviceOrders || 0) + (source?.serviceRequests || 0)));
    const hasAlert = alertCount > 0 || alerts.some((item) => elderCityFromText(item.location || "") === city);
    const pos = positions[index] || { x: 50, y: 50, labelX: 44, labelY: 42 };
    const count = Number(rawCount || String(countText).replace(/[^\d.]/g, "")) || 0;
    return {
      city,
      count: countText,
      text: count ? Number(count).toLocaleString("zh-CN") : String(index + 1),
      route: hasAlert ? "exceptions" : "orders",
      kind: hasAlert ? "pin" : "pulse",
      color: hasAlert ? "#ff5252" : colors[index % colors.length],
      alertCount,
      serviceTotal,
      ...pos,
    };
  });
}

function elderMapLegend(screen) {
  const alertCount = elderMetricCount(screen, "异常预警", (screen.alertFeed || []).length);
  const orderCount = elderMetricCount(screen, "服务工单", (screen.serviceWorkOrders || []).length);
  const deviceCount = elderDistributionTotal(screen.deviceStatus || []);
  return [
    { label: `预警 ${alertCount} 条`, route: "exceptions" },
    { label: `服务工单 ${orderCount} 单`, route: "orders" },
    { label: `设备 ${deviceCount} 台`, route: "devices" },
  ];
}

function elderMetricCount(screen = {}, label = "", fallback = 0) {
  const metric = (screen.metrics || []).find((item) => item.label === label);
  const raw = String(metric?.value ?? "");
  const match = raw.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]).toLocaleString("zh-CN") : Number(fallback || 0).toLocaleString("zh-CN");
}

function elderRiskListPanel(screen) {
  const rows = (screen.alertFeed || []).slice(0, 5);
  const data = rows.length ? rows : [{ elderName: "暂无高风险老人", level: "正常", type: "暂无预警", status: "已同步", location: "全平台" }];
  return `
    <section class="panel elder-risk-list">
      <div class="panel-head"><h2>高风险老人（实时）</h2><button class="link" type="button" data-route="exceptions">处理 ${chevron("right")}</button></div>
      ${data.map((item) => `
        <button type="button" data-route="exceptions">
          <b>${escapeHtml(item.level || "预警")}</b>
          <span><strong>${escapeHtml(item.elderName || "未命名老人")}</strong><em>${escapeHtml(item.type || "异常预警")} · ${escapeHtml(item.status || "待处理")}</em></span>
          <small>${escapeHtml(elderCityFromText(item.location || ""))}</small>
        </button>
      `).join("")}
    </section>
  `;
}

function elderFeedRows(alerts = []) {
  const rows = alerts.slice(0, 5).map((item) => ({
    level: item.level || "预警",
    title: item.type || "异常预警",
    desc: `${item.elderName || "未命名老人"} · ${item.status || "待处理"}`,
    city: elderCityFromText(item.location || ""),
    time: formatAdminScreenTime(item.time || "").slice(5, 16) || "刚刚",
  }));
  return rows.length ? rows : [{ level: "正常", title: "暂无未处理预警", desc: "后台暂无预警数据", city: "全平台", time: "实时" }];
}

function elderRiskSuggestions(screen) {
  const alerts = screen.alertFeed || [];
  const healthRecords = screen.healthRecords || [];
  if (alerts.length) {
    return alerts.slice(0, 3).map((item) => ({
      title: `${item.level || "预警"}：${item.type || "异常事件"}`,
      desc: `${item.elderName || "未命名老人"} 当前状态为${item.status || "待处理"}，处理人：${item.handledBy || "待分配"}。`,
      route: "exceptions",
    }));
  }
  if (healthRecords.length) {
    return healthRecords.slice(0, 3).map((item) => ({
      title: `${item.elderName || "老人"}：${item.metricType || "健康记录"}`,
      desc: `当前值 ${item.value || "未采集"}，参考范围 ${item.referenceRange || "未配置"}，风险 ${item.riskLevel || item.status || "正常"}。`,
      route: "health-records",
    }));
  }
  return [{ title: "当前暂无风险建议", desc: "后台暂无预警和健康异常数据。", route: "health-records" }];
}

function elderRiskTrend(screen) {
  const today = new Date(screen.updatedAt || Date.now());
  const labels = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  });
  const orders = labels.map((label) => (screen.alertFeed || []).filter((item) => String(item.time || "").slice(5, 10) === label).length);
  const serviceUsers = labels.map((label) => (screen.healthRecords || []).filter((item) => String(item.time || item.createdAt || "").slice(5, 10) === label).length);
  const alertTotal = (screen.alertFeed || []).length;
  const healthTotal = (screen.healthRecords || []).length;
  if (!orders.some(Boolean) && alertTotal) orders[orders.length - 1] = alertTotal;
  if (!serviceUsers.some(Boolean) && healthTotal) serviceUsers[serviceUsers.length - 1] = healthTotal;
  return {
    labels,
    orders,
    serviceUsers,
    totalOrders: orders.reduce((sum, value) => sum + value, 0),
    totalServiceUsers: serviceUsers.reduce((sum, value) => sum + value, 0),
  };
}

function elderServiceTimelineRows(orders = []) {
  const counts = orders.reduce((acc, item) => {
    const key = item.serviceType || "未分类服务";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  if (!rows.length) return [{ name: "暂无服务工单", count: 0, start: 8, len: 20 }];
  const max = Math.max(...rows.map(([, count]) => Number(count || 0)), 1);
  return rows.map(([name, count], index) => ({
    name,
    count,
    start: Math.min(68, 8 + index * 15),
    len: Math.max(18, Math.round((Number(count || 0) / max) * 46)),
  }));
}

function elderHealthRows(records = []) {
  const rows = records.slice(0, 10).map((item) => [
    escapeHtml(item.elderName || "未命名老人"),
    escapeHtml(item.metricType || "健康指标"),
    escapeHtml(item.value || "未采集"),
    escapeHtml(item.referenceRange || "未配置"),
    escapeHtml(item.riskLevel || item.status || "正常"),
    escapeHtml(formatAdminScreenTime(item.time || item.createdAt || "")),
  ]);
  return rows.length ? rows : [["暂无", "暂无", "暂无", "暂无", "暂无", "暂无"]];
}

function elderServiceRows(orders = []) {
  const rows = orders.slice(0, 10).map((item) => [
    escapeHtml(item.orderNo || item.id || "未编号"),
    escapeHtml(item.serviceType || "未分类"),
    escapeHtml(item.elderName || "未命名老人"),
    escapeHtml(item.time || "未预约"),
    escapeHtml(item.status || "待处理"),
    escapeHtml(item.assigneeName || "待派单"),
    { html: `<button class="link" type="button" data-route="order-detail">查看</button>` },
  ]);
  return rows.length ? rows : [["暂无", "暂无", "暂无", "暂无", "暂无", "暂无", { html: `<button class="link" type="button" data-route="orders">查看订单</button>` }]];
}

function elderAlertRows(alerts = []) {
  const rows = alerts.slice(0, 10).map((item) => [
    escapeHtml(formatAdminScreenTime(item.time || "")),
    escapeHtml(item.type || "异常预警"),
    escapeHtml(item.elderName || "未命名老人"),
    escapeHtml(item.level || "未分级"),
    escapeHtml(item.status || "待处理"),
    escapeHtml(item.handledBy || "待分配"),
    { html: `<button class="link" type="button" data-route="exceptions">处理</button>` },
  ]);
  return rows.length ? rows : [["暂无", "暂无", "暂无", "暂无", "暂无", "暂无", { html: `<button class="link" type="button" data-route="exceptions">查看预警</button>` }]];
}

function renderDeviceBindReference(page) {
  const defaultDeviceBindId = adminUiState.deviceBindMode === "create" ? `SIM-${Date.now()}` : "HWB-R20240519-001";
  const deviceRows = [
    ["HWB-R20240519-001", "智能手环", "乐心手环 LX-05 Pro", "李奶奶（72岁）", "张女士（女儿）", "昆明 五华区", "2024-05-19 09:22", "在线", "编辑 更多"],
    ["ROBOT-20240518-002", "小云机器人", "小云机器人 V3.2", "王爷爷（78岁）", "王建国（儿子）", "大理 下关镇", "2024-05-18 16:10", "在线", "编辑 更多"],
    ["WATCH-20240517-001", "定位手表", "360儿童手表 10X", "刘奶奶（68岁）", "赵帅（女儿）", "丽江 古城区", "2024-05-17 14:25", "在线", "编辑 更多"],
    ["BP-20240517-004", "血压计", "鱼跃血压计 BP-610", "陈爷爷（69岁）", "刘强（儿子）", "昆明 官渡区", "2024-05-17 11:30", "离线", "编辑 更多"],
    ["OX-20240516-006", "血氧仪", "血氧仪 OX-102", "陈爷爷（70岁）", "陈敏（女儿）", "保山 隆阳区", "2024-05-16 09:20", "在线", "编辑 更多"],
  ];
  return `
      <div class="admin-device-bind-ref">
      <div class="admin-banner-actions">
        <span></span>
        <button class="btn primary" type="button" data-action="新增绑定">${icons.plus}<span>新增绑定</span></button>
        <button class="btn" type="button" data-action="批量导入">${icons.import}<span>批量导入</span></button>
        <button class="btn" type="button" data-action="解绑审核">${icons.device}<span>解绑审核</span></button>
        <button class="btn" type="button" data-action="导出">${icons.export}<span>导出</span></button>
      </div>
      <div class="admin-health-kpis">
        ${[
          ["device", "今日新增绑定", "28", "较昨日 ↑ 27.3%", "blue"],
          ["store", "待绑定设备", "64", "较昨日 ↓ 5.9%", "orange"],
          ["alert", "绑定异常", "6", "较昨日 ↑ 2", "red"],
          ["heart", "已解绑", "12", "较昨日 ↑ 3", "purple"],
        ].map(([icon, title, value, sub, color]) => `<article class="admin-banner-kpi ${color}"><span>${icons[icon] || icons.grid}</span><div><small>${title}</small><strong>${value}</strong><em>${sub}</em></div></article>`).join("")}
      </div>
      <section class="panel admin-health-filter device-bind-filter">
        <label><span>设备编号</span><input placeholder="请输入设备编号" /></label>
        <label><span>设备类型</span><select><option>全部</option></select></label>
        <label><span>老人姓名/手机号</span><input placeholder="搜索姓名/手机号" /></label>
        <label><span>绑定状态</span><select><option>全部</option></select></label>
        <label><span>城市</span><select><option>全部城市</option></select></label>
        <label><span>绑定时间</span><input value="开始日期  →  结束日期" /></label>
        <button class="btn primary" type="button" data-action="查询">查询</button>
        <button class="btn" type="button" data-action="重置筛选">重置</button>
      </section>
      <div class="device-bind-main">
        <section class="panel device-bind-table-panel">
          <div class="panel-head"><h2>设备绑定列表（共 1,286 条）</h2></div>
          <table class="admin-health-table">
            <thead><tr>${["设备编号", "设备类型", "设备名称", "绑定老人", "绑定家属", "所在区域", "绑定时间", "在线状态", "操作"].map((item) => `<th>${item}</th>`).join("")}</tr></thead>
            <tbody>${deviceRows.map((row) => `<tr>${row.map((cell, index) => `<td class="${index === 7 ? cell === "在线" ? "ok" : "warn" : ""}">${cell}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
          <div class="table-footer"><span>共 1,286 条</span><button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><span>10条/页</span><span>跳至</span><input value="1" /><span>页</span></div>
        </section>
        <section class="panel device-bind-wizard">
          <div class="panel-head"><h2>设备绑定</h2><span class="right"><button class="link" type="button">绑定帮助</button></span></div>
          <ol>
            <li><b>1</b><strong>扫码或输入设备SN <em>*</em></strong><div><input value="${defaultDeviceBindId}" /><button class="btn primary">${icons.device}扫码</button></div></li>
            <li><b>2</b><strong>设备类型 <em>*</em></strong><div class="device-type-grid">${["智能手环", "小云机器人", "定位手表", "血压计", "血氧仪", "其他"].map((item, index) => `<button class="${index === 0 ? "active" : ""}" type="button">${icons.device}<span>${item}</span></button>`).join("")}</div></li>
            <li><b>3</b><strong>选择老人 <em>*</em></strong><select><option>李奶奶 / 72岁 / 女</option></select><article class="bound-person"><span class="photo female"></span><div><strong>李奶奶</strong><small>72岁 女　U10000125　昆明市 五华区</small></div>${tag("良好", "green")}</article></li>
            <li><b>4</b><strong>绑定家属</strong><select><option>张小明（儿子） 138****5678</option></select></li>
            <li><b>5</b><strong>绑定关系 <em>*</em></strong><select><option>子女</option></select></li>
            <li><b>6</b><strong>备注码</strong><input placeholder="请输入设备安装或备注码（选填）" /></li>
          </ol>
          <label class="device-agree"><input type="checkbox" checked /> 我已阅读并同意《设备服务协议》《隐私政策》</label>
          <div class="device-bind-actions"><button class="btn primary" type="button" data-action="确认绑定">确认绑定</button><button class="btn" type="button" data-action="重置">重置</button></div>
        </section>
        <aside class="device-bind-side">
          <section class="panel device-preview">
            <div class="panel-head"><h2>设备预览</h2></div>
            <div class="device-watch-art"></div>
            <h3>乐心手环 LX-05 Pro</h3>
            <p>设备SN：LS202405190001</p>
            <p>固件版本：v2.3.8</p>
            <p>电量：78%　信号强度：-65 dBm</p>
            <div class="qr-box">二维码</div>
          </section>
          <section class="panel">
            <div class="panel-head"><h2>绑定校验</h2></div>
            <ul class="device-check-list">${["设备SN格式正确", "设备未绑定其他老人", "设备在线可通讯", "固件版本支持", "通信服务有效"].map((item) => `<li>${icons.shield}${item}</li>`).join("")}</ul>
            <button class="link" type="button">校验通过</button>
          </section>
        </aside>
      </div>
      <div class="admin-grid four device-bind-bottom">
        ${timelinePanel("最近绑定记录", true)}
        ${miniTable("批量导入结果（2024-05-19 09:15）", [["总计", "221"], ["成功", "118"], ["失败", "2"], ["跳过", "11"]], ["导入项", "数量"])}
        ${donutPanel("设备在线统计（实时）", "总设备", "1,286", [{ name: "在线", value: 76, text: "982（76.3%）", color: "#20be70" }, { name: "离线", value: 16, text: "256（19.9%）", color: "#ff5252" }, { name: "低电量", value: 8, text: "48（3.8%）", color: "#ff9c13" }])}
        ${miniTable("绑定异常设备", [["HWB-R20240517-006", "智能手环", "通讯失败"], ["ROBOT-20240516-003", "小云机器人", "未激活"], ["BP-20240515-002", "血压计", "数据异常"]], ["设备编号", "类型", "异常"]) }
      </div>
    </div>
  `;
}

function renderActivitiesContentReference(page) {
  const tabs = adminContentTabs();
  const activeTab = tabs.find((item) => item.id === currentAdminContentTab()) || tabs[0];
  return `
    ${pageHead(page, `<button class="btn" type="button" data-route="notifications">${icons.bell}<span>消息通知中心</span></button>`)}
    <div class="admin-content-ref single">
      <section class="panel admin-content-main">
        <div class="admin-content-tabs">
          ${tabs.map((item) => `<button class="${item.id === activeTab.id ? "active" : ""}" type="button" data-admin-content-tab="${item.id}">${item.label}</button>`).join("")}
        </div>
        <div class="admin-content-kpis">
          ${[
            ["首页Banner", "12", "screen", "blue", "当前在首页轮播中维护"],
            ["政策指南", "28", "calendar", "green", "覆盖云南16个地州"],
            ["咨询文章", "64", "edit", "orange", "最新稿件待校对 3 篇"],
            ["三端通知", "18", "bell", "purple", "模板与公告统一维护"],
          ].map(([title, value, icon, color, meta]) => `<article class="admin-content-kpi ${color}"><span>${icons[icon] || icons.grid}</span><div><small>${title}</small><strong>${value}</strong><em>${meta}</em></div></article>`).join("")}
        </div>
        <div class="admin-content-toolbar admin-content-toolbar-lite">
          <div class="admin-content-note">
            商家活动发布、报名与上下架已移至商户端。管理后台只保留首页Banner、政策指南、咨询文章和三端通知的编辑维护。
          </div>
          <button class="primary" type="button" data-route="${activeTab.route}">进入${activeTab.label}</button>
        </div>
        ${renderAdminContentPreview(activeTab)}
      </section>
    </div>
  `;
}

function renderAdminContentPreview(activeTab) {
  const tabId = activeTab?.id || "banner";
  if (tabId === "policy") return renderAdminPolicyPreview();
  if (tabId === "article") return renderAdminArticlePreview();
  if (tabId === "notice") return renderAdminNoticePreview();
  return renderAdminBannerPreview();
}

function renderAdminContentPreviewTable(title, columns, rows, sideTitle, sideItems = [], primaryRoute = "activities-content", primaryLabel = "进入管理") {
  const hasSide = Boolean(sideTitle) || sideItems.length > 0;
  return `
    <div class="admin-content-module-grid${hasSide ? "" : " single"}">
      <section class="panel admin-content-module">
        <div class="panel-head">
          <h2>${title}</h2>
          <button class="btn primary" type="button" data-route="${primaryRoute}">${primaryLabel}</button>
        </div>
        <div class="admin-content-preview-wrap">
          <table class="admin-content-preview-table">
            <thead><tr>${columns.map((item) => `<th>${item}</th>`).join("")}</tr></thead>
            <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </section>
      ${hasSide ? `
        <section class="panel admin-content-module-side">
          <div class="panel-head"><h2>${sideTitle}</h2></div>
          <div class="admin-content-side-list">
            ${sideItems.map((item) => `<p>${item}</p>`).join("")}
          </div>
        </section>
      ` : ""}
    </div>
  `;
}

function renderAdminBannerPreview() {
  const rows = [
    ["首页轮播", "旅居生活 从心出发", "小程序首页", tag("使用中", "green"), `<button class="link" type="button" data-route="banner">编辑</button>`],
    ["首页轮播", "康养旅居 品质生活", "小程序首页", tag("待上线", "orange"), `<button class="link" type="button" data-route="banner">编辑</button>`],
    ["首页轮播", "健康管理 智能守护", "小程序首页", tag("已下架", "gray"), `<button class="link" type="button" data-route="banner">编辑</button>`],
  ];
  return renderAdminContentPreviewTable(
    "首页Banner维护概览",
    ["位置", "标题", "投放端", "状态", "操作"],
    rows,
    "",
    [],
    "banner",
    "进入Banner管理",
  );
}

function renderAdminPolicyPreview() {
  const rows = [
    ["昆明旅居补贴指南", "昆明市", tag("已发布", "green"), "2026-06-16 09:20", `<button class="link" type="button" data-route="policy">编辑</button>`],
    ["云南适老旅居服务规范", "全省通用", tag("已发布", "green"), "2026-06-15 16:10", `<button class="link" type="button" data-route="policy">编辑</button>`],
    ["医保异地结算问答", "大理市", tag("校对中", "orange"), "2026-06-15 11:05", `<button class="link" type="button" data-route="policy">编辑</button>`],
  ];
  return renderAdminContentPreviewTable(
    "政策指南维护概览",
    ["标题", "适用城市", "状态", "更新时间", "操作"],
    rows,
    "指南规则",
    ["支持按城市和专题分类维护。", "后台负责政策解读、引用来源和更新时间。", "发布后同步到用户端政策指南入口。"],
    "policy",
    "进入政策指南",
  );
}

function renderAdminArticlePreview() {
  const rows = [
    ["高原旅居适应指南", "健康科普", tag("已发布", "green"), "2026-06-16 08:30", `<button class="link" type="button" data-route="article-edit">编辑</button>`],
    ["昆明长住交通与医疗地图", "旅居攻略", tag("待校对", "orange"), "2026-06-15 18:20", `<button class="link" type="button" data-route="article-edit">编辑</button>`],
    ["适老出行准备清单", "出行提示", tag("草稿", "gray"), "2026-06-15 14:40", `<button class="link" type="button" data-route="article-edit">编辑</button>`],
  ];
  return renderAdminContentPreviewTable(
    "咨询文章维护概览",
    ["文章标题", "栏目", "状态", "更新时间", "操作"],
    rows,
    "文章规则",
    ["后台统一维护咨询文章封面、正文和标签。", "支持发布到用户端咨询入口和首页推荐位。", "活动稿件不在后台发布，由商户端负责活动内容。"],
    "article-edit",
    "进入咨询文章",
  );
}

function renderAdminNoticePreview() {
  const rows = [
    ["订单变更提醒", "用户端 / 向导端", "站内信 + App推送", tag("启用", "green"), `<button class="link" type="button" data-route="notice">编辑模板</button>`],
    ["商家接单通知", "商户端", "站内信", tag("启用", "green"), `<button class="link" type="button" data-route="notice">编辑模板</button>`],
    ["系统维护公告", "三端 + 后台", "公告栏 + App推送", tag("排期中", "orange"), `<button class="link" type="button" data-route="notifications">查看送达</button>`],
  ];
  return renderAdminContentPreviewTable(
    "三端通知维护概览",
    ["通知主题", "触达端", "通道", "状态", "操作"],
    rows,
    "",
    [],
    "notice",
    "进入三端通知",
  );
}

function renderMerchantOwnedActivityNotice(page) {
  return `
    ${pageHead(page, `<button class="btn" type="button" data-route="banner">返回首页Banner管理</button><button class="btn primary" type="button" data-route="merchant-services">进入商户管理</button>`)}
    <section class="panel permission-denied-panel admin-content-ownership-panel">
      <div class="empty-mini">
        <strong>活动发布、报名和上下架已移至商户端</strong>
        <span>管理后台只保留首页Banner、政策指南、咨询文章和三端通知的维护，不再直接发布活动。</span>
      </div>
    </section>
  `;
}

function renderAdminActivityTableRow(row) {
  return `
    <tr data-admin-activity-row="${row.id}">
      <td>${row.title}</td>
      <td>${row.type}</td>
      <td>${row.city}</td>
      <td>${row.place}</td>
      <td>${row.time}</td>
      <td>${row.signup}</td>
      <td class="state">${row.status}</td>
      <td class="star"><button class="${row.recommended ? "active" : ""}" type="button" data-admin-activity-star="${row.id}" aria-pressed="${row.recommended ? "true" : "false"}" aria-label="${row.title}推荐位">${row.recommended ? "★" : "☆"}</button></td>
      <td class="ops"><button type="button" data-admin-activity-select="${row.id}" data-route="activity-edit">编辑</button></td>
    </tr>
  `;
}

function selectedAdminActivity() {
  return adminActivityState.rows.find((row) => row.id === adminActivityState.selectedId)
    || adminActivityState.rows[0]
    || { id: "act-taiji", title: "晨练太极·健康每一天", type: "康养健身", city: "昆明", place: "翠湖公园", time: "05-20 07:30", signup: "28/50", status: "发布中", recommended: true };
}

function renderAdminActivityCalendar() {
  const state = adminContentCalendarState;
  const firstDate = new Date(state.year, state.month, 1);
  const firstWeekday = firstDate.getDay();
  const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
  const prevDaysInMonth = new Date(state.year, state.month, 0).getDate();
  const eventDays = new Set([7, 10, 14, 19, 21, 23, 25, 28, 30]);
  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    const day = prevDaysInMonth - firstWeekday + i + 1;
    cells.push(`<button class="muted" type="button" data-admin-calendar-date="${state.year}-${state.month}-${day}" data-admin-calendar-muted="prev">${day}</button>`);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const selected = day === state.day ? " selected" : "";
    const hasDot = eventDays.has(day) ? " has-dot" : "";
    cells.push(`<button class="${selected}${hasDot}" type="button" data-admin-calendar-date="${state.year}-${state.month + 1}-${day}" aria-pressed="${selected ? "true" : "false"}">${day}</button>`);
  }
  const nextCells = Math.max(0, 42 - cells.length);
  for (let day = 1; day <= nextCells; day += 1) {
    cells.push(`<button class="muted" type="button" data-admin-calendar-date="${state.year}-${state.month + 2}-${day}" data-admin-calendar-muted="next">${day}</button>`);
  }
  return `
    <div class="panel admin-calendar-box">
      <div class="admin-calendar-head">
        <button type="button" data-admin-calendar-month="prev" aria-label="上个月">${chevron("left")}</button>
        <strong>${state.year}年${state.month + 1}月</strong>
        <button type="button" data-admin-calendar-month="next" aria-label="下个月">${chevron("right")}</button>
      </div>
      <div class="admin-calendar-grid">
        ${["日", "一", "二", "三", "四", "五", "六"].map((day) => `<span class="week">${day}</span>`).join("")}
        ${cells.join("")}
      </div>
    </div>
  `;
}

function pageHead(page, actions = defaultActions(page)) {
  return `
    <div class="page-head">
      <div class="page-title">
        <h1>${page.title}</h1>
        <p>${page.subtitle}</p>
      </div>
      <div class="actions">${actions}</div>
    </div>
  `;
}

function defaultActions(page) {
  if (page.type === "detail") {
    return `${button("编辑信息", "edit")} ${button("冻结账号", "alert", "danger")} ${button("创建服务单", "calendar", "primary")}`;
  }
  if (["users", "guides", "merchants", "exceptions"].includes(page.id)) {
    return `${button("批量导入", "import")} ${button("导出", "export")}`;
  }
  if (page.type === "form") {
    return `${button("预览", "eye")} ${button("保存草稿", "save")} ${button("提交审核", "send", "primary")}`;
  }
  if (page.type === "settings" || page.type === "rules" || page.type === "permission") {
    return `${button("新增规则", "plus", "primary")} ${button("保存并发布", "save", "green")} ${button("模拟测试", "clock")}`;
  }
  return `${button("新增", "plus", "primary")} ${button("批量导入", "import")} ${button("导出", "export")}`;
}

function button(label, icon, variant = "") {
  return `<button class="btn ${variant}" type="button" data-action="${label}">${icons[icon] || ""}<span>${label}</span></button>`;
}

function renderDashboard(page) {
  const stats = adminDashboardState.data?.stats || {};
  const charts = adminDashboardState.data?.charts || {};
  const alertAction = { html: `<button class="link" data-route="exceptions">查看</button>` };
  const orderAction = { html: `<button class="link" data-route="order-detail">查看</button>` };
  const latestAlertRows = alertRows().map((row) => [...row.slice(0, -1), alertAction]);
  const latestOrderRows = orderRows(5).map((row) => [row[0], row[2], row[1], row[5], row[3], row[6], row[7], orderAction]);
  return `
    <div class="grid kpi-grid">${kpis(["用户总数", "老人数", "在线设备", "待处理订单", "SOS预警", "今日服务"])}</div>
    <div class="grid dashboard-grid" style="margin-top:14px">
      ${linePanel("近7日服务趋势", ["服务订单数", "服务人数"], charts.serviceTrend)}
      ${donutPanel("订单类型分布", "总订单数", valueText(charts.orderTypes?.total ?? stats.todayOrders ?? 0), orderTypeSegments())}
      ${donutPanel("健康状态分布", charts.healthStatus?.centerLabel || "健康项", valueText(charts.healthStatus?.total ?? 0), healthSegments())}
      ${rankPanel("后台实时业务地图")}
      ${tablePanel("最近预警与异常", latestAlertRows, ["时间", "类型", "对象", "状态", "处理人", "操作"], "table-panel")}
      ${tablePanel("最近订单", latestOrderRows, ["订单编号", "服务类型", "用户", "执行方", "服务时间", "当前状态", "金额", "操作"], "full")}
    </div>
  `;
}

function renderAdminFunctionOverviewPanel() {
  return "";
}

function valueText(value) {
  if (value === undefined || value === null || value === "") return "0";
  if (typeof value === "number") return value.toLocaleString("zh-CN");
  return String(value);
}

function renderScreen(page) {
  if (adminScreenState.error) return renderAdminScreenError(page);
  if (!adminScreenState.data) return renderAdminScreenLoading(page);
  if (page.id === "operation-screen") return renderAdminScreenOverview(page);
  const screen = screenDataForPage(page);
  if (!screen) return renderAdminScreenOverview(page);
  return screen.id === "guide-dispatch-operations" ? renderGuideDispatchScreen(page, screen) : renderElderCareScreen(page, screen);
}

function renderAdminScreenLoading(page) {
  return `
    <div class="screen-title">
      <div>
        <h1>${page.title}</h1>
        <p class="muted">正在加载运营看板数据</p>
      </div>
    </div>
    <div class="grid kpi-grid">${kpis(["老人总数", "在线人数", "设备在线", "待派单", "异常预警", "满意度"])}</div>
    <section class="panel" style="margin-top:14px;padding:30px;text-align:center;color:var(--muted)">运营看板加载中</section>
  `;
}

function renderAdminScreenError(page) {
  return `
    <div class="screen-title">
      <div>
        <h1>${page.title}</h1>
        <p class="muted">运营看板暂时无法加载</p>
      </div>
    </div>
    <section class="panel" style="margin-top:14px;padding:30px">
      <h2>数据加载失败</h2>
      <p class="muted">请稍后刷新运营看板。</p>
      <button class="btn primary" data-action="刷新大屏数据">${icons.screen}<span>刷新大屏数据</span></button>
    </section>
  `;
}

function renderAdminScreenOverview(page) {
  const screens = adminScreenState.data.screens || [];
  return `
    <div class="screen-title">
      <div>
        <h1>${page.title}</h1>
        <p class="muted">老人安全、设备在线、服务工单与人工向导调度总览</p>
      </div>
    </div>
    <div class="admin-grid two" style="margin-top:14px">
      ${screens.map((screen) => `
        <section class="panel admin-live-screen-card">
          <div class="panel-head">
            <div><h2>${screen.title}</h2><p class="muted small">${screen.purpose}</p></div>
            <span class="right">${tag("运行中", "green")}</span>
          </div>
          <div class="screen-metric-list">
            ${screen.metrics.map((item) => `
              <div class="screen-metric-row"><span>${item.label}</span><strong>${item.value}${item.unit || ""}</strong><em>${item.trend}</em></div>
            `).join("")}
          </div>
          <div class="record-actions" style="padding:0 14px 14px">
            <button class="btn primary" data-route="${screen.id === "elder-care-operations" ? "elder-screen" : "guide-screen"}">${icons.full}<span>进入大屏</span></button>
          </div>
        </section>
      `).join("")}
    </div>
  `;
}

function renderElderCareScreen(page, screen) {
  return `
    <div class="screen-title">
      <div>
        <h1>${screen.title}</h1>
        <p class="muted">${screen.purpose}</p>
      </div>
    </div>
    <div class="grid kpi-grid">${screenMetricCards(screen.metrics)}</div>
    <div class="screen-grid" style="margin-top:14px">
      <div class="grid">
        ${linePanel("健康与服务风险趋势", ["健康记录", "服务工单"])}
        ${liveBarPanel("设备状态", screen.deviceStatus)}
        ${liveFeedPanel("实时预警 feed", screen.alertFeed.map((item) => [`${item.type} · ${item.elderName}`, `${item.level}优先级 · ${item.status}`, item.time]))}
      </div>
      <div class="panel center">
        <div class="panel-head"><h2>老人分布与预警地图</h2><span class="right">${tag("设备/异常联动", "blue")}</span></div>
        <div style="padding:14px">${mapPanel(true)}</div>
      </div>
      <div class="grid">
        ${liveDonutPanel("健康状态分布", "健康记录", screen.healthDistribution)}
        ${liveDonutPanel("设备在线", "设备数", screen.deviceStatus)}
        ${liveFeedPanel("服务工单", screen.serviceWorkOrders.map((item) => [`${item.orderNo} · ${item.serviceType}`, `${item.elderName} · ${item.status}`, item.assigneeName]))}
      </div>
    </div>
    <div class="grid section-grid three" style="margin-top:14px">
      ${tablePanel("最新健康异常与 SOS", screen.alertFeed.map((item) => [item.time, item.type, item.elderName, item.level, item.status, item.handledBy, "处理"]), ["时间", "类型", "老人", "优先级", "状态", "处理人", "操作"])}
      ${tablePanel("服务工单", screen.serviceWorkOrders.map((item) => [item.orderNo, item.elderName, item.serviceType, item.time, item.status, item.assigneeName, "查看"]), ["订单编号", "老人", "服务类型", "服务时间", "状态", "执行方", "操作"])}
      ${infoPanel("重点指标", screen.coreMetrics.map((item) => [item, "正常"]))}
    </div>
  `;
}

function renderGuideDispatchScreen(page, screen) {
  const load = screen.guideLoad || {};
  return `
    <div class="screen-title">
      <div>
        <h1>${screen.title}</h1>
        <p class="muted">${screen.purpose}</p>
      </div>
    </div>
    <div class="grid kpi-grid">${screenMetricCards(screen.metrics, { excludeLabels: ["服务时段"] })}</div>
    <div class="screen-grid" style="margin-top:14px">
      <div class="grid">
        ${linePanel("今日服务量与待派单", ["今日服务量", "待派单"])}
        ${liveBarPanel("向导状态", [
          { name: "在线", value: load.online || 0 },
          { name: "服务中", value: load.busy || 0 },
          { name: "空闲", value: load.idle || 0 },
          { name: "离线", value: load.offline || 0 },
        ])}
        ${liveFeedPanel("异常处理", screen.exceptionHandling.map((item) => [`${item.type} · ${item.level}`, item.status, item.handledBy]))}
      </div>
      <div class="panel center">
        <div class="panel-head"><h2>向导调度态势地图</h2><span class="right">${tag("资源调度", "green")}</span></div>
        <div style="padding:14px">${mapPanel(true)}</div>
      </div>
      <div class="grid">
        ${liveDonutPanel("服务时段", "预约单", screen.serviceTimeBuckets)}
        ${liveFeedPanel("待派单", screen.dispatchQueue.map((item) => [`${item.orderNo} · ${item.serviceType}`, `${item.elderName} · ${item.time}`, item.location]))}
        ${liveFeedPanel("执行中任务", screen.activeTasks.map((item) => [`${item.taskNo} · ${item.serviceType}`, `${item.assigneeName} · ${item.status}`, item.location]))}
      </div>
    </div>
    <div class="grid section-grid three" style="margin-top:14px">
      ${tablePanel("待派单队列", screen.dispatchQueue.map((item) => [item.orderNo, item.elderName, item.serviceType, item.time, item.location, item.status, "派单"]), ["订单编号", "老人", "服务类型", "预约时间", "地址", "状态", "操作"])}
      ${tablePanel("向导排行", screen.ranking.map((item, index) => [index + 1, item.name, item.status, item.area, item.activeTasks, item.monthlyOrders, item.rating, `¥${item.incomeToday}`]), ["排名", "向导", "状态", "服务区域", "进行中", "月单量", "评分", "今日收入"])}
      ${infoPanel("重点指标", screen.coreMetrics.map((item) => [item, "正常"]))}
    </div>
  `;
}

function screenMetricCards(metrics = [], options = {}) {
  const palette = ["blue", "green", "purple", "orange", "red", "teal", "cyan", "blue"];
  const excludeLabels = new Set(options.excludeLabels || []);
  return metrics.filter((metric) => !excludeLabels.has(metric.label)).slice(0, 8).map((metric, index) => {
    const color = colors[palette[index % palette.length]];
    const label = String(metric.label || "指标");
    const value = `${metric.value ?? 0}${metric.unit || ""}`;
    const route = screenMetricRoute(label);
    return `
      <button class="kpi-card" type="button" data-route="${escapeHtml(route)}" aria-label="${escapeHtml(`${label} ${value}`)}">
        <div class="kpi-icon" style="--icon-a:${color[0]};--icon-b:${color[1]}">${metricIcon(index)}</div>
        <div>
          <div class="kpi-title">${escapeHtml(label)}</div>
          <div class="kpi-value">${escapeHtml(value)}</div>
          <div class="kpi-trend">${escapeHtml(metric.trend || "实时数据")}</div>
        </div>
      </button>
    `;
  }).join("");
}

function screenMetricRoute(label = "") {
  if (/向导|在线\/服务中\/空闲|排行/.test(label)) return "guides";
  if (/待派单/.test(label)) return "tasks";
  if (/今日服务|服务量|服务时段|服务工单/.test(label)) return "orders";
  if (/异常|SOS|预警|处理/.test(label)) return "exceptions";
  if (/设备/.test(label)) return "devices";
  if (/健康/.test(label)) return "health-records";
  if (/满意/.test(label)) return "after-sales";
  if (/老人|在线人数/.test(label)) return "users";
  return "dashboard";
}

function liveDonutPanel(title, centerLabel, rows = []) {
  const palette = ["#176bff", "#20be70", "#ffad24", "#8056e8", "#ff5252"];
  const total = rows.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const segments = rows.length ? rows.map((item, index) => ({
    name: item.name,
    value: total ? (Number(item.value || 0) / total) * 100 : 0,
    text: `${item.value || 0}（${item.ratio || "0%"}）`,
    color: palette[index % palette.length],
  })) : [{ name: "暂无数据", value: 100, text: "0", color: "#d9e3f1" }];
  return donutPanel(title, centerLabel, total || 0, segments);
}

function liveBarPanel(title, rows = []) {
  const total = Math.max(...rows.map((item) => Number(item.value || 0)), 1);
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2></div>
      <div class="rank-list">
        ${rows.map((item, index) => `
          <div class="rank-item" style="grid-template-columns:70px minmax(0,1fr)58px">
            <span>${item.name}</span><div class="progress" style="--bar:${["#176bff", "#20be70", "#ffad24", "#8056e8"][index % 4]}"><span style="width:${Math.max(8, (Number(item.value || 0) / total) * 100)}%"></span></div><strong>${item.value || 0}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function liveFeedPanel(title, rows = []) {
  const data = rows.length ? rows.slice(0, 6) : [["暂无数据", "等待业务写入", ""]];
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2></div>
      <div class="feed-list">
        ${data.map((item, index) => `
          <div class="feed-item">
            <span class="feed-icon" style="--feed:${["#176bff", "#20be70", "#ffad24", "#8056e8", "#ff5252"][index % 5]}">${index + 1}</span>
            <div><strong>${item[0]}</strong><p class="muted small">${item[1]}</p></div>
            <span class="muted small">${item[2] || ""}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function screenDataForPage(page) {
  const screens = adminScreenState.data?.screens || [];
  if (page.id === "guide-screen") return screens.find((item) => item.id === "guide-dispatch-operations");
  if (page.id === "elder-screen" || page.id === "health-monitor") return screens.find((item) => item.id === "elder-care-operations");
  return null;
}

function formatAdminScreenTime(value) {
  if (!value) return "";
  return String(value).replace("T", " ").slice(0, 19);
}

function renderList(page) {
  const domain = domainOf(page);
  const titles = metricTitles(domain);
  const kpiClass = titles.length === 3 ? " three-cards" : " five";
  if (page.id === "guides" || page.id === "exceptions" || page.id === "devices") {
    return `
      ${pageHead(page)}
      <div class="grid kpi-grid${kpiClass}">${kpis(titles, titles.length)}</div>
      <div class="panel" style="margin-top:14px">${filters(domain)}</div>
      <div class="grid" style="margin-top:14px">
        ${tablePanel(`${page.title.replace("管理", "列表")}  共 ${domainCount(domain)} 条`, rowsForDomain(domain), headersForDomain(domain))}
      </div>
    `;
  }
  const side = page.detail ? renderSideProfile(page.detail) : renderSideInsights(domain);
  return `
    ${pageHead(page)}
    <div class="grid kpi-grid${kpiClass}">${kpis(titles, titles.length)}</div>
    <div class="panel" style="margin-top:14px">${filters(domain)}</div>
    <div class="content-split ${page.detail ? "wide-side" : ""}" style="margin-top:14px">
      <div class="grid">
        ${tablePanel(`${page.title.replace("管理", "列表")}  共 ${domainCount(domain)} 条`, rowsForDomain(domain), headersForDomain(domain))}
        ${page.detail ? renderDetailStrip(domain) : renderRelatedCards(domain)}
      </div>
      ${side}
    </div>
  `;
}

function renderAdminNotificationsReference(page) {
  const messages = adminMessageState.messages || [];
  const rows = adminNotificationRows(messages);
  const total = messages.length;
  const unread = messages.filter((item) => !item.read).length;
  const read = Math.max(0, total - unread);
  const urgent = messages.filter((item) => ["高", "紧急", "P0", "P1"].includes(String(item.priority || ""))).length;
  const actions = `
    <button class="btn" type="button" data-admin-notification-refresh>${icons.refresh}<span>刷新</span></button>
    <button class="btn primary" type="button" data-admin-notification-read-all ${unread ? "" : "disabled"}>${icons.check}<span>全部已读</span></button>
  `;
  const filterTabs = [
    ["all", `全部 ${total}`],
    ["unread", `未读 ${unread}`],
    ["read", `已读 ${read}`],
    ["urgent", `高优先 ${urgent}`],
  ];
  const statusText = adminMessageState.loading
    ? "正在读取 /api/messages?role=admin"
    : adminMessageState.error
      ? `接口异常：${adminMessageState.error}`
      : `已从 /api/messages?role=admin 读取 ${total} 条管理员消息`;
  return `
    ${pageHead(page, actions)}
    <div class="grid kpi-grid" style="grid-template-columns:repeat(4,minmax(150px,1fr))">
      ${[
        ["消息总数", total, "真实接口返回"],
        ["未读消息", unread, "可执行已读"],
        ["已读消息", read, "服务端持久化"],
        ["高优先级", urgent, "需优先处理"],
      ].map(([title, value, hint], index) => `
        <article class="kpi-card" style="cursor:default">
          <div class="kpi-icon" style="--icon-a:${["#2f7df6", "#ff7b45", "#20be70", "#8b5cf6"][index]};--icon-b:${["#6aa8ff", "#ffb35c", "#64d98b", "#b794ff"][index]}">${metricIcon(index)}</div>
          <div><div class="kpi-title">${title}</div><div class="kpi-value">${value}</div><div class="kpi-trend"><span>${hint}</span></div></div>
        </article>
      `).join("")}
    </div>
    <section class="panel" style="margin-top:14px">
      <div class="panel-head">
        <h2>消息筛选</h2>
        <span class="right">${statusText}</span>
      </div>
      <div class="filters">
        <label class="field">${icons.search}<input data-admin-notification-keyword placeholder="搜索标题、内容、关联编号" value="${escapeHtml(adminNotificationState.keyword)}" /></label>
        <button class="btn primary" type="button" data-admin-notification-search>查询</button>
        <button class="btn" type="button" data-admin-notification-reset>重置</button>
      </div>
      <div class="chip-row" style="padding:0 14px 14px">
        ${filterTabs.map(([key, label]) => `<button class="btn ${adminNotificationState.filter === key ? "primary" : "ghost"}" type="button" data-admin-notification-filter="${key}" aria-pressed="${adminNotificationState.filter === key ? "true" : "false"}">${label}</button>`).join("")}
      </div>
      ${adminNotificationState.notice ? `<p class="muted" style="padding:0 14px 14px">${escapeHtml(adminNotificationState.notice)}</p>` : ""}
    </section>
    <div class="grid" style="margin-top:14px">
      ${tablePanel("消息通知中心", rows, ["消息标题", "接收角色", "消息类型", "触达通道", "优先级", "已读状态", "触达时间", "操作"], "admin-notification-table")}
    </div>
  `;
}

function adminNotificationRows(messages = adminMessageState.messages) {
  const filter = adminNotificationState.filter || "all";
  const keyword = normalizeActionText(adminNotificationState.keyword);
  return messages
    .filter((message) => {
      const priority = String(message.priority || "");
      if (filter === "unread" && message.read) return false;
      if (filter === "read" && !message.read) return false;
      if (filter === "urgent" && !["高", "紧急", "P0", "P1"].includes(priority)) return false;
      if (!keyword) return true;
      const text = normalizeActionText([
        message.id,
        message.title,
        message.content,
        message.scenario,
        message.relatedType,
        message.relatedId,
        ...(Array.isArray(message.channels) ? message.channels : []),
      ].join(" "));
      return text.includes(keyword);
    })
    .map((message) => {
      const id = escapeHtml(message.id || "");
      const title = escapeHtml(message.title || "未命名消息");
      const content = escapeHtml(message.content || "暂无消息内容");
      const related = message.relatedType || message.relatedId
        ? `<br><span class="muted small">关联：${escapeHtml(message.relatedType || "业务")} ${escapeHtml(message.relatedId || "")}</span>`
        : "";
      const channels = Array.isArray(message.channels) && message.channels.length ? message.channels : ["站内消息"];
      const readLabel = message.read ? status("已读", "green") : status("未读", "orange");
      const action = message.read
        ? `<span class="muted">无需操作</span>`
        : `<button class="link" type="button" data-admin-notification-read="${id}">标为已读</button>`;
      return [
        { html: `<strong>${title}</strong><br><span class="muted small">${content}</span>${related}` },
        adminRoleLabel(message.toRole || "admin"),
        adminNotificationType(message),
        { html: channels.map((item, index) => tag(item, ["blue", "green", "purple", "orange"][index % 4])).join(" ") },
        message.priority || "普通",
        { html: readLabel },
        message.createdAt || message.readAt || "未记录",
        { html: action },
      ];
    });
}

function adminNotificationType(message = {}) {
  if (message.scenario) return message.scenario;
  if (message.relatedType === "order") return "订单消息";
  if (message.relatedType === "task") return "任务消息";
  if (message.relatedType === "alert") return "异常/SOS";
  if (message.title?.includes?.("设备")) return "设备提醒";
  return "站内通知";
}

function adminRoleLabel(role = "") {
  return {
    elder: "老人用户",
    family: "家属账号",
    guide: "向导账号",
    merchant: "商户账号",
    admin: "后台账号",
  }[adminText(role)] || adminText(role) || "未记录";
}

function userProfileForApi(user = {}) {
  const profiles = adminUserState.elderProfiles || [];
  return profiles.find((item) => item.userId && item.userId === user.id)
    || profiles.find((item) => adminText(item.name) && adminText(item.name) === adminText(user.nickname))
    || null;
}

function familyContactsForProfile(profile = {}) {
  const contacts = adminUserState.familyContacts || [];
  if (!profile?.id) return [];
  const matched = contacts.filter((item) => item.elderId === profile.id);
  return matched.length ? matched : [];
}

function userRowsForApi(users = adminUserState.users || []) {
  return users.map((user) => {
    const profile = userProfileForApi(user);
    const contacts = familyContactsForProfile(profile);
    const unread = Number(user.unreadMessages || 0);
    const orderCount = Number(user.orderCount || 0);
    return [
      user.nickname || profile?.name || user.phone || "未命名用户",
      user.id || "未记录",
      adminRoleLabel(user.role),
      user.phone || "未记录",
      profile?.city || user.city || "未记录",
      profile?.riskLevel || (user.role === "elder" ? "未记录" : "不适用"),
      orderCount.toLocaleString("zh-CN"),
      unread.toLocaleString("zh-CN"),
      user.status || "正常",
      {
        html: `<button class="link" type="button" data-action="查看用户：${escapeHtml(user.id || "")}">查看资料</button>${contacts.length ? `<span class="muted small">联系人${contacts.length}</span>` : ""}`,
      },
    ];
  });
}

function currentAdminUserDetail() {
  const users = adminUserState.users || [];
  if (!users.length) return null;
  const selectedId = adminText(adminUserState.selectedUserId);
  const selected = users.find((item) => item.id === selectedId);
  return selected || users[0];
}

function renderAdminUserDetailPanel(user = currentAdminUserDetail()) {
  if (!user) return "";
  const profile = userProfileForApi(user);
  const contacts = familyContactsForProfile(profile);
  const defaultContact = contacts.find((item) => item.isDefault) || contacts[0] || {};
  const fields = [
    ["用户姓名", user.nickname || profile?.name || "未记录"],
    ["账号ID", user.id || "未记录"],
    ["角色", adminRoleLabel(user.role)],
    ["手机号", user.phone || "未记录"],
    ["账户状态", user.status || "正常"],
    ["订单数", Number(user.orderCount || 0).toLocaleString("zh-CN")],
    ["未读消息", Number(user.unreadMessages || 0).toLocaleString("zh-CN")],
    ["老人姓名", profile?.name || (user.role === "elder" ? "未记录" : "不适用")],
    ["年龄/性别", profile ? `${profile.age || "未记录"}岁 / ${profile.gender || "未记录"}` : "不适用"],
    ["所在城市", profile?.city || "不适用"],
    ["详细地址", profile?.address || "不适用"],
    ["健康标签", Array.isArray(profile?.healthTags) && profile.healthTags.length ? profile.healthTags.join("、") : "不适用"],
    ["血型", profile?.bloodType || "不适用"],
    ["过敏信息", profile?.allergies || "不适用"],
    ["常用药物", profile?.medicines || "不适用"],
    ["风险等级", profile?.riskLevel || "不适用"],
    ["家属联系人", contacts.length ? `${contacts.length} 人` : "无接口联系人"],
    ["默认联系人", defaultContact.name ? `${defaultContact.name}（${defaultContact.relation || "联系人"}）${defaultContact.phone || ""}` : "无默认联系人"],
  ];
  return `
    <section class="panel" style="margin-top:14px">
      <div class="panel-head">
        <h2>用户资料（接口数据）</h2>
        <span class="right">${tag(user.status || "正常", adminText(user.status).includes("正常") ? "green" : "orange")}</span>
      </div>
      <div class="summary-grid user-detail-grid">
        ${fields.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`).join("")}
      </div>
      <div class="table-wrap user-contact-wrap">
        <table>
          <thead><tr>${["联系人", "关系", "手机号", "默认", "告警通知"].map((item) => `<th>${item}</th>`).join("")}</tr></thead>
          <tbody>
            ${contacts.length
              ? contacts.map((contact) => `<tr><td>${escapeHtml(contact.name || "未记录")}</td><td>${escapeHtml(contact.relation || "未记录")}</td><td>${escapeHtml(contact.phone || "未记录")}</td><td>${contact.isDefault ? "是" : "否"}</td><td>${contact.notifyAlert ? "开启" : "关闭"}</td></tr>`).join("")
              : `<tr data-empty-row="true"><td colspan="5" style="text-align:center;color:#65708a;padding:18px">当前用户没有接口返回的家属联系人</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function refreshAdminUserDetailPanel() {
  const panel = document.querySelector(".user-detail-grid")?.closest(".panel");
  if (!panel) return;
  panel.outerHTML = renderAdminUserDetailPanel(currentAdminUserDetail());
}

function renderUsersReference(page) {
  const users = adminUserState.users || [];
  const elderProfiles = adminUserState.elderProfiles || [];
  const familyContacts = adminUserState.familyContacts || [];
  const normalAccounts = users.filter((item) => adminText(item.status) === "正常").length;
  const unreadTotal = users.reduce((sum, item) => sum + Number(item.unreadMessages || 0), 0);
  const userSideAccounts = users.filter((item) => ["elder", "family"].includes(item.role)).length;
  const cards = [
    ["用户总数", users.length, "blue"],
    ["老人档案", elderProfiles.length, "green"],
    ["家属联系人", familyContacts.length, "blue"],
    ["正常账号", normalAccounts, "green"],
    ["未读消息", unreadTotal, "orange"],
    ["用户端账号", userSideAccounts, "purple"],
  ];
  return `
    ${pageHead(page, `${button("批量导入", "import")} ${button("导出", "export")}`)}
    ${adminUserState.error ? `<section class="panel" style="margin-bottom:14px;padding:14px;color:var(--red)">用户接口加载失败：${escapeHtml(adminUserState.error)}</section>` : ""}
    ${adminUserState.loading && !adminUserState.loaded ? `<section class="panel" style="margin-bottom:14px;padding:14px;color:var(--muted)">用户接口数据同步中...</section>` : ""}
    <div class="grid kpi-grid five">
      ${cards.map(([title, value, tone], index) => {
        const color = colors[tone] || colors.blue;
        return `
          <button class="kpi-card" type="button" data-action="用户筛选:${escapeHtml(title)}" aria-label="${escapeHtml(`${title} ${value}`)}">
            <div class="kpi-icon" style="--icon-a:${color[0]};--icon-b:${color[1]}">${metricIcon(index)}</div>
            <div>
              <div class="kpi-title">${escapeHtml(title)}</div>
              <div class="kpi-value">${Number(value || 0).toLocaleString("zh-CN")}</div>
              <div class="kpi-trend"><span>接口数据</span><span class="kpi-link-text">筛选明细</span></div>
            </div>
          </button>
        `;
      }).join("")}
    </div>
    <div class="panel" style="margin-top:14px">${filters("user")}</div>
    <div class="grid" style="margin-top:14px">
      ${tablePanel(`用户账号列表 共 ${users.length} 条`, userRowsForApi(users), ["用户姓名", "账号ID", "角色", "手机号", "所在城市", "健康风险", "订单数", "未读消息", "账户状态", "操作"], "user-real-table")}
    </div>
    ${renderAdminUserDetailPanel(currentAdminUserDetail())}
  `;
}

function guideServiceTypesText(guide = {}) {
  if (Array.isArray(guide.serviceTypes)) return guide.serviceTypes.filter(Boolean).join("/");
  return guide.serviceTypes || guide.serviceType || "未记录";
}

function guideStatusNeedsAudit(status = "") {
  return adminText(status) !== "已认证";
}

function guideStatsNumber(guide = {}, key, fallbackKey = "") {
  const value = guide.stats?.[key] ?? (fallbackKey ? guide.stats?.[fallbackKey] : undefined) ?? guide[key] ?? guide[fallbackKey];
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function guideRowsForApi(guides = adminGuideState.guides || []) {
  return guides.map((guide) => {
    const todayOrders = guideStatsNumber(guide, "todayOrders");
    const monthOrders = guideStatsNumber(guide, "monthlyOrders", "monthOrders");
    const completedOrders = guideStatsNumber(guide, "completedOrders");
    const incomeToday = Number(guide.incomeToday ?? guide.stats?.todayIncome ?? 0);
    const statusText = guide.status || "未记录";
    const id = guide.id || "";
    const auditActions = guideStatusNeedsAudit(statusText)
      ? `<button class="link" type="button" data-action="通过向导：${escapeHtml(id)}">通过</button><button class="link danger-link" type="button" data-action="驳回向导：${escapeHtml(id)}">驳回</button>`
      : "";
    return [
      guide.realName || guide.name || "未命名向导",
      id || "未记录",
      guideServiceTypesText(guide),
      guide.area || guide.city || "未记录",
      `${guide.onlineStatus || "未记录"} / ${guide.currentStatus || "未记录"}`,
      `今日 ${todayOrders.toLocaleString("zh-CN")} / 本月 ${monthOrders.toLocaleString("zh-CN")} / 完成 ${completedOrders.toLocaleString("zh-CN")}`,
      Number(guide.rating || guide.stats?.rating || 0).toFixed(1),
      `¥${Number.isFinite(incomeToday) ? incomeToday.toLocaleString("zh-CN") : "0"}`,
      statusText,
      {
        html: `<button class="link" type="button" data-action="查看向导：${escapeHtml(id)}">查看资料</button>${auditActions}`,
      },
    ];
  });
}

function currentAdminGuideDetail() {
  const guides = adminGuideState.guides || [];
  if (!guides.length) return null;
  const selectedId = adminText(adminGuideState.selectedGuideId);
  const selected = guides.find((item) => item.id === selectedId);
  return selected || guides[0];
}

function renderAdminGuideDetailPanel(guide = currentAdminGuideDetail()) {
  if (!guide) return "";
  const stats = guide.stats || {};
  const statusTone = guide.status === "已认证" ? "green" : "orange";
  const activeOrders = guideStatsNumber(guide, "activeOrders", "taskCount");
  const reviewCount = guideStatsNumber(guide, "reviewCount");
  const cancelledOrders = guideStatsNumber(guide, "cancelledOrders");
  return `
    <section class="panel" style="margin-top:14px">
      <div class="panel-head">
        <h2>向导资料（接口数据）</h2>
        <span class="right">${tag(guide.status || "未记录", statusTone)}</span>
      </div>
      <div class="summary-grid guide-detail-grid">
        ${[
          ["姓名", guide.realName || guide.name || "未记录"],
          ["向导ID", guide.id || "未记录"],
          ["服务类型", guideServiceTypesText(guide)],
          ["服务区域", guide.area || guide.city || "未记录"],
          ["在线状态", guide.onlineStatus || "未记录"],
          ["接单状态", guide.currentStatus || "未记录"],
          ["今日订单", guideStatsNumber(guide, "todayOrders").toLocaleString("zh-CN")],
          ["本月订单", guideStatsNumber(guide, "monthlyOrders", "monthOrders").toLocaleString("zh-CN")],
          ["完成订单", guideStatsNumber(guide, "completedOrders").toLocaleString("zh-CN")],
          ["进行中", activeOrders.toLocaleString("zh-CN")],
          ["取消订单", cancelledOrders.toLocaleString("zh-CN")],
          ["评价数", reviewCount.toLocaleString("zh-CN")],
          ["今日收入", `¥${Number(guide.incomeToday ?? stats.todayIncome ?? 0).toLocaleString("zh-CN")}`],
          ["待结算", `¥${Number(guide.settlementPending ?? stats.settlementPending ?? 0).toLocaleString("zh-CN")}`],
          ["接口生成时间", stats.generatedAt || guide.updatedAt || guide.auditAt || "未记录"],
        ].map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`).join("")}
      </div>
    </section>
  `;
}

function renderGuidesReference(page) {
  const guides = adminGuideState.guides || [];
  const certified = guides.filter((item) => item.status === "已认证").length;
  const online = guides.filter((item) => item.onlineStatus === "在线").length;
  const receiving = guides.filter((item) => /接单|空闲|服务/.test(item.currentStatus || "") && item.onlineStatus === "在线").length;
  const pending = guides.filter((item) => guideStatusNeedsAudit(item.status)).length;
  const monthlyOrders = guides.reduce((sum, item) => sum + guideStatsNumber(item, "monthlyOrders", "monthOrders"), 0);
  const ratingValues = guides.map((item) => Number(item.rating || item.stats?.rating || 0)).filter((value) => Number.isFinite(value) && value > 0);
  const averageRating = ratingValues.length ? (ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length).toFixed(1) : "0.0";
  const cards = [
    ["向导总数", guides.length, "blue"],
    ["已认证", certified, "green"],
    ["在线向导", online, "blue"],
    ["待审核", pending, "orange"],
    ["平均评分", averageRating, "purple"],
    ["本月订单", monthlyOrders, "green"],
    ["在线接单", receiving, "blue"],
  ];
  return `
    ${pageHead(page, `${button("批量导入", "import")} ${button("导出", "export")}`)}
    ${adminGuideState.error ? `<section class="panel" style="margin-bottom:14px;padding:14px;color:var(--red)">向导接口加载失败：${escapeHtml(adminGuideState.error)}</section>` : ""}
    ${adminGuideState.loading && !adminGuideState.loaded ? `<section class="panel" style="margin-bottom:14px;padding:14px;color:var(--muted)">向导接口数据同步中...</section>` : ""}
    <div class="grid kpi-grid five">
      ${cards.map(([title, value, tone], index) => {
        const color = colors[tone] || colors.blue;
        return `
          <button class="kpi-card" type="button" data-action="向导筛选:${escapeHtml(title)}" aria-label="${escapeHtml(`${title} ${value}`)}">
            <div class="kpi-icon" style="--icon-a:${color[0]};--icon-b:${color[1]}">${metricIcon(index)}</div>
            <div>
              <div class="kpi-title">${escapeHtml(title)}</div>
              <div class="kpi-value">${escapeHtml(String(value))}</div>
              <div class="kpi-trend"><span>接口数据</span><span class="kpi-link-text">筛选明细</span></div>
            </div>
          </button>
        `;
      }).join("")}
    </div>
    <div class="panel" style="margin-top:14px">${filters("guide")}</div>
    <div class="grid" style="margin-top:14px">
      ${tablePanel(`人工向导列表 共 ${guides.length} 条`, guideRowsForApi(guides), ["向导姓名", "工号", "服务类型", "服务区域", "当前状态", "订单统计", "星级评分", "今日收入", "认证状态", "操作"], "guide-real-table")}
    </div>
    ${renderAdminGuideDetailPanel(currentAdminGuideDetail())}
  `;
}

function renderMerchantsReference(page) {
  const merchants = adminMerchantState.merchants || [];
  const rows = merchantRowsForApi(merchants);
  return `
    ${pageHead(page)}
    ${adminMerchantState.error ? `<section class="panel" style="margin-bottom:14px;padding:14px;color:var(--red)">商户接口加载失败：${adminMerchantState.error}</section>` : ""}
    ${adminMerchantState.loading && !adminMerchantState.loaded ? `<section class="panel" style="margin-bottom:14px;padding:14px;color:var(--muted)">商户接口数据同步中...</section>` : ""}
    <div class="grid kpi-grid five">${kpis(metricTitles("merchant"), 5)}</div>
    <div class="panel" style="margin-top:14px">${filters("merchant")}</div>
    <div class="grid" style="margin-top:14px">
      ${tablePanel(`商户列表 共 ${adminMerchantState.loaded ? merchants.length : 0} 条`, rows, headersForDomain("merchant"))}
    </div>
  `;
}

function merchantServiceItemsForApi(services = adminMerchantState.services || []) {
  return services.filter((item) => item.providerType === "merchant" || item.merchantId || String(item.providerId || "").startsWith("merchant"));
}

function adminMerchantCity(merchant = {}) {
  const explicit = adminText(merchant.city || merchant.area || merchant.region);
  if (explicit) return explicit;
  const address = adminText(merchant.address || merchant.location);
  const cityMatch = address.match(/([\u4e00-\u9fa5]{2,12}市)/);
  return cityMatch?.[1] || address || "未记录";
}

function adminMerchantRatingText(merchant = {}) {
  const rating = merchant.rating ?? merchant.score;
  if (rating === undefined || rating === null || rating === "") return "未记录";
  const numeric = Number(rating);
  if (!Number.isFinite(numeric)) return adminText(rating);
  return numeric > 5 ? `${numeric.toFixed(1)}%` : numeric.toFixed(1);
}

function merchantRowsForApi(merchants = []) {
  return merchants.map((merchant) => {
    const orderCount = Number(merchant.orderCount || merchant.monthOrders || 0);
    return [
      merchant.code || merchant.merchantNo || merchant.id || "未记录",
      merchant.name || "未命名商户",
      merchant.type || merchant.category || "未记录",
      adminMerchantCity(merchant),
      merchant.status || "未记录",
      orderCount.toLocaleString("zh-CN"),
      adminMerchantRatingText(merchant),
      {
        html: `
          <button class="link" data-route="merchant-review">查看</button>
          ${merchant.status !== "已通过" ? `<button class="link" data-action="通过商户：${merchant.id}">通过</button><button class="link danger-link" data-action="驳回商户：${merchant.id}">驳回</button>` : `<button class="link" data-route="merchant-services">服务</button>`}
        `,
      },
    ];
  });
}

function merchantServiceStatusTone(statusText = "") {
  if (adminText(statusText).includes("上架")) return "green";
  if (adminText(statusText).includes("审核") || adminText(statusText).includes("待")) return "orange";
  return "gray";
}

function merchantServiceRowsForApi(services = merchantServiceItemsForApi()) {
  return services.map((service) => {
    const price = Number(service.price || service.amount || 0);
    const statusText = service.status || "未记录";
    const nextAction = statusText === "上架" ? "下架" : "上架";
    return [
      service.id || "未记录",
      service.title || service.name || "未命名服务",
      service.category || service.type || "未记录",
      service.providerName || service.merchantName || service.providerId || "未记录",
      price ? `¥${price.toFixed(2)}/${service.unit || "次"}` : "未记录",
      statusText,
      Number(service.orderCount || service.sales || 0).toLocaleString("zh-CN"),
      service.updatedAt || service.createdAt || "未记录",
      {
        html: `<button class="link" data-route="merchants">查看商户</button><button class="link ${nextAction === "下架" ? "danger-link" : ""}" data-action="${nextAction}服务：${escapeHtml(service.id || "")}">${nextAction}</button>`,
      },
    ];
  });
}

function renderMerchantServicesReference(page) {
  const services = merchantServiceItemsForApi();
  const rows = merchantServiceRowsForApi(services);
  const statusCount = (text) => services.filter((item) => adminText(item.status) === text).length;
  const orderCount = services.reduce((sum, item) => sum + Number(item.orderCount || item.sales || 0), 0);
  const cards = [
    ["服务总数", services.length, "blue"],
    ["已上架", statusCount("上架"), "green"],
    ["待审核", statusCount("待审核"), "orange"],
    ["已下架", statusCount("已下架"), "purple"],
    ["关联订单", orderCount, "blue"],
  ];
  return `
    ${pageHead(page, `${button("导出", "export")}`)}
    ${adminMerchantState.error ? `<section class="panel" style="margin-bottom:14px;padding:14px;color:var(--red)">商户服务接口加载失败：${adminMerchantState.error}</section>` : ""}
    ${adminMerchantState.loading && !adminMerchantState.loaded ? `<section class="panel" style="margin-bottom:14px;padding:14px;color:var(--muted)">商户服务接口数据同步中...</section>` : ""}
    <div class="grid kpi-grid five">
      ${cards.map(([title, value, tone], index) => {
        const color = colors[tone] || colors.blue;
        return `
          <button class="kpi-card" type="button" data-action="服务项目筛选:${escapeHtml(title)}" aria-label="${escapeHtml(`${title} ${value}`)}">
            <div class="kpi-icon" style="--icon-a:${color[0]};--icon-b:${color[1]}">${metricIcon(index)}</div>
            <div>
              <div class="kpi-title">${escapeHtml(title)}</div>
              <div class="kpi-value">${Number(value || 0).toLocaleString("zh-CN")}</div>
              <div class="kpi-trend"><span>接口数据</span><span class="kpi-link-text">筛选明细</span></div>
            </div>
          </button>
        `;
      }).join("")}
    </div>
    <div class="panel" style="margin-top:14px">${filters("merchantService")}</div>
    <div class="grid" style="margin-top:14px">
      ${tablePanel(`商户服务项目列表 共 ${services.length} 条`, rows, ["服务ID", "服务名称", "服务分类", "所属商户", "价格", "状态", "关联订单", "更新时间", "操作"])}
    </div>
  `;
}

function renderMerchantAuditReference(merchants = []) {
  const pending = merchants.filter((item) => item.status !== "已通过");
  const rows = pending.slice(0, 6).map((merchant) => [
    merchant.name,
    merchant.type || merchant.category || "机构",
    merchant.contact || merchant.contactName || "联系人",
    merchant.city || merchant.area || "昆明市",
    merchant.license ? "100%" : "80%",
    merchant.riskLevel || "低风险",
    merchant.status || "待审核",
    {
      html: `<button class="link" data-route="merchant-review">审核</button><button class="link" data-action="通过商户：${merchant.id}">通过</button><button class="link danger-link" data-action="驳回商户：${merchant.id}">驳回</button>`,
    },
  ]);
  return `
    <section class="panel merchant-audit-panel">
      <div class="panel-head"><h2>待审核商户</h2><span class="right">${tag(adminMerchantState.loaded ? `${pending.length} 条` : "同步中", pending.length ? "orange" : "green")}</span></div>
      ${rows.length
        ? tablePanel("入驻申请列表", rows, ["商户名称", "类型", "联系人", "城市", "资质完整度", "风险等级", "状态", "操作"], "compact-table")
        : `<div style="padding:16px;color:var(--muted)">暂无待审核商户。</div>`}
    </section>
  `;
}

function merchantRealtimeRows(merchants = [], services = []) {
  const pendingMerchant = merchants.find((item) => item.status !== "已通过");
  const pendingService = services.find((item) => item.status !== "上架");
  return [
    {
      icon: icons.alert,
      color: colors.red,
      title: pendingMerchant ? "商户入驻待审核" : "商户入驻正常",
      desc: pendingMerchant ? `${pendingMerchant.name} · ${pendingMerchant.status}` : "暂无待处理入驻申请",
    },
    {
      icon: icons.content,
      color: colors.orange,
      title: pendingService ? "服务上架待审核" : "服务项目正常",
      desc: pendingService ? `${pendingService.title} · ${pendingService.status}` : "暂无待审核服务",
    },
    {
      icon: icons.store,
      color: colors.green,
      title: "商户端同步",
      desc: `${merchants.length || 0} 个商户、${services.length || 0} 个服务项目读取同一 API`,
    },
    {
      icon: icons.order,
      color: colors.blue,
      title: "订单联动",
      desc: "后台审核和服务上下架会同步用户端/商户端",
    },
  ];
}

function adminOrderTimeValue(value = "") {
  const normalized = String(value || "").trim().replace(/\./g, "-").replace(" ", "T");
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? timestamp : NaN;
}

function adminOrderIsTodayItem(order = {}) {
  const timestamp = adminOrderTimeValue(order.createdAt || order.time || "");
  if (!Number.isFinite(timestamp)) return false;
  const targetDate = new Date(timestamp);
  const today = new Date();
  return targetDate.getFullYear() === today.getFullYear()
    && targetDate.getMonth() === today.getMonth()
    && targetDate.getDate() === today.getDate();
}

function adminOrderIsActiveStatus(status = "") {
  return ["待服务", "服务中", "执行中", "已出发", "已接单", "已派单"].includes(String(status || "").trim());
}

function adminOrderQuickFilterValue(statusText = "") {
  const text = String(statusText || "").trim();
  if (!text || text === "全部") return "";
  if (text === "今日订单") return "__today__";
  if (text === "服务中") return "__active__";
  return text;
}

function adminOrderQuickFilterLabel(filter = adminOrderListState.statusFilter) {
  const text = String(filter || "").trim();
  if (text === "__today__") return "今日订单";
  if (text === "__active__") return "服务中";
  return text;
}

function adminOrderQuickFilterInputValue(filter = adminOrderListState.statusFilter) {
  const normalized = adminOrderQuickFilterValue(filter);
  return ["__today__", "__active__"].includes(normalized) ? "" : adminOrderQuickFilterLabel(normalized);
}

function adminOrderListItemsForFilter(filter = adminOrderListState.statusFilter) {
  const normalized = adminOrderQuickFilterValue(filter);
  const orders = adminOrderCollection();
  if (!normalized) return orders;
  return orders.filter((item) => {
    if (normalized === "__today__") return adminOrderIsTodayItem(item);
    if (normalized === "__active__") return adminOrderIsActiveStatus(item.status);
    return adminText(item.status) === normalized;
  });
}

function adminOrderListRowsForFilter(filter = adminOrderListState.statusFilter) {
  return adminOrderListItemsForFilter(filter).map((item) => [
    item.orderNo || item.id,
    item.elderName || "",
    item.serviceType || "",
    item.time || item.createdAt || "",
    item.location || "",
    item.assigneeName || item.providerName || "",
    item.status || "",
    `¥${Number(item.amount || 0).toFixed(2)}`,
    item.source || "用户端",
    "更多",
  ]);
}

function adminOrderListCount(filter = "") {
  return adminOrderListItemsForFilter(filter).length;
}

function renderOrders(page) {
  const statusFilter = adminOrderListState.statusFilter || "";
  const rows = adminOrderListRowsForFilter(statusFilter);
  const titleSuffix = statusFilter ? `（${adminOrderQuickFilterLabel(statusFilter)}）` : "";
  return `
    ${pageHead(page, "")}
    <div class="grid kpi-grid">${kpis(["今日订单", "待确认", "待派单", "服务中", "已完成", "已取消"])}</div>
    <div class="panel" style="margin-top:14px">${filters("orders", ["", "", "", "", "", adminOrderQuickFilterInputValue(statusFilter)])}</div>
    <div class="grid" style="margin-top:14px">
      ${tablePanel(`订单列表${titleSuffix}`, rows, ["订单编号", "用户", "服务类型", "服务时间", "地点", "执行方", "订单状态", "金额", "来源", "操作"])}
    </div>
  `;
}

function renderDispatch(page) {
  const statusFilter = adminDispatchState.statusFilter || "";
  const rows = dispatchRowsForFilter(statusFilter);
  const titleSuffix = statusFilter ? `（${statusFilter}）` : "";
  return `
    ${pageHead(page, `${button("批量导入", "import")} ${button("导出", "export")}`)}
    <div class="grid kpi-grid five">${kpis(["待派单", "已派单", "执行中", "超时预警", "今日完成"], 5)}</div>
    <div class="panel" style="margin-top:14px">${filters("dispatch", ["", "", "", "", statusFilter, ""])}</div>
    <div class="grid" style="margin-top:14px">
      ${tablePanel(`任务池${titleSuffix}`, rows, ["任务编号", "服务类型", "老人", "预约时间", "地址", "优先级", "状态", "推荐执行方", "操作"])}
      ${scheduleBoard()}
      ${tablePanel("调度记录", dispatchLogRows(), ["时间", "类型", "任务编号", "内容", "操作人"])}
    </div>
  `;
}

function renderDetail(page) {
  const renderers = {
    "user-detail": renderAdminUserDetail,
    "health-records": renderHealthRecordDetail,
    "service-records": renderServiceRecordDetail,
    "guide-review": renderGuideReviewDetail,
    "guide-income": renderGuideIncomeDetail,
    "merchant-review": renderMerchantReviewDetail,
    "order-detail": renderOrderDetailAdmin,
    "dispatch-detail": renderDispatchDetailAdmin,
    "device-exception": renderDeviceExceptionDetail,
    complaints: renderComplaintDetail,
    "device-detail": renderDeviceLogDetail,
  };
  return (renderers[page.id] || renderAdminUserDetail)(page);
}

function routeButton(label, icon, route, variant = "") {
  return `<button class="btn ${variant}" data-route="${route}">${icons[icon] || ""}<span>${label}</span></button>`;
}

function adminStatCards(items) {
  return `<div class="admin-stat-grid">${items.map(([icon, title, value, sub, color = "blue"]) => `
    <div class="admin-stat-card">
      <span class="admin-stat-icon ${color}">${icons[icon] || icons.grid}</span>
      <span><b>${title}</b><strong>${value}</strong><em>${sub}</em></span>
    </div>
  `).join("")}</div>`;
}

function adminTopSummary(items) {
  return `<div class="admin-summary-strip">${items.map(([label, value, mark]) => `
    <div><span>${label}</span><strong>${value}</strong>${mark && String(mark) !== String(value) ? tag(mark, mark.includes("待") || mark.includes("高") ? "orange" : mark.includes("异常") ? "red" : "green") : ""}</div>
  `).join("")}</div>`;
}

function adminStepFlow(steps, active = 0) {
  return `<div class="admin-step-flow">${steps.map((step, index) => `
    <div class="${index < active ? "done" : index === active ? "active" : ""}">
      <b>${index + 1}</b><span>${step[0]}</span><em>${step[1]}</em>
    </div>
  `).join("")}</div>`;
}

function miniTable(title, rows, headers) {
  return tablePanel(title, rows, headers, "compact-table");
}

function renderAdminUserDetail(page) {
  const userDetailTabs = [
    ["用户信息", "user-detail"],
    ["老人档案", "user-detail"],
    ["家属绑定", "family"],
    ["健康档案", "health-records"],
    ["服务记录", "service-records"],
    ["设备绑定", "device-bind"],
    ["异常记录", "exceptions"],
  ];
  const userOrderAction = { html: `<button class="link" data-route="order-detail">查看</button>　<button class="link" data-route="order-detail">编辑</button>` };
  return `
    ${pageHead(page, `
      ${routeButton("返回列表", "arrowLeft", "users")}
      ${routeButton("编辑信息", "edit", "user-create")}
      <button class="btn danger" data-action="冻结用户账号">${icons.alert}<span>冻结账号</span></button>
      ${routeButton("创建服务单", "calendar", "order-create", "primary")}
    `)}
    <section class="panel admin-profile-hero">
      <div class="person-row">
        <span class="photo female large"></span>
        <div>
          <div class="profile-name">李奶奶 ${tag("良好", "green")}</div>
          <div class="profile-meta">72岁　|　女　|　居家护理　　用户ID U10000125　　手机号 138****5678</div>
        </div>
      </div>
      ${adminTopSummary([["所在城市", "昆明市 五华区"], ["注册地址", "穿金路 88 号 2 栋 302"], ["注册时间", "2024-03-15 10:23"], ["最近登录", "2024-05-19 09:28"], ["积分余额", "2,356 分"]])}
    </section>
    <section class="panel admin-tabs">${userDetailTabs.map(([tab, route], i) => `<button class="tab ${i === 1 ? "active" : ""}" data-route="${route}">${tab}</button>`).join("")}</section>
    <div class="admin-grid four">
      ${infoPanel("基本信息", [["性别", "女"], ["年龄", "72 岁"], ["生日", "1952-04-12"], ["民族", "汉族"], ["慢性疾病", "高血压、糖尿病"], ["身体状况", "行动自理"], ["医保类型", "城镇职工医保"]])}
      ${tagPanel("健康标签", ["高血压", "糖尿病", "轻度骨关节炎", "高龄", "规律服药", "独居老人", "低盐饮食", "定期体检"])}
      ${infoPanel("紧急联系人", [["联系人", "张女士（女儿）"], ["手机号", "139****8856"], ["备用电话", "0871****1234"], ["联系地址", "昆明市五华区学府路88号"], ["备注", "夜间联系备用电话"]])}
      ${deviceMiniPanel()}
    </div>
    <div class="admin-grid main-side">
      ${healthTrendPanel()}
      ${timelinePanel("最近服务记录")}
    </div>
    <div class="admin-grid two">
      ${miniTable("关联订单（最近10条）", orderRows(5).map((row) => [row[0], row[2], row[3], row[6], row[7], userOrderAction]), ["订单编号", "服务类型", "服务时间", "状态", "金额", "操作"])}
      ${miniTable("操作日志（最近10条）", systemRows(), ["时间", "操作人", "操作内容", "IP地址", "结果"])}
    </div>
  `;
}

function renderHealthRecordDetail(page) {
  return `
    ${pageHead(page, `${routeButton("返回用户详情", "user", "user-detail")} ${button("新增体检", "plus", "primary")} ${button("导出健康档案", "export")}`)}
    ${adminStatCards([["heart", "健康状态", "良好", "近7日稳定", "green"], ["alert", "慢病风险", "中风险", "高血压重点关注", "orange"], ["clock", "最近体检", "2024-04-20", "距今30天", "blue"], ["device", "采集设备", "4 台", "3台在线", "purple"], ["chart", "数据完整度", "96%", "较上周 +3.2%", "green"]])}
    <div class="admin-grid main-side">
      <section class="panel">
        <div class="panel-head"><h2>24小时健康趋势</h2><span class="right">${selectPill("今日")}</span></div>
        ${healthTrendPanel().replace("<section class=\"panel\">", "<div>").replace("</section>", "</div>")}
      </section>
      ${suggestionPanel()}
    </div>
    <div class="admin-grid three">
      ${tagPanel("慢病与过敏标签", ["高血压", "糖尿病", "青霉素过敏", "低盐饮食", "规律服药", "跌倒风险低"])}
      ${miniTable("用药记录", [["降压药", "每日1次", "07:30", "已提醒"], ["二甲双胍", "每日2次", "餐后", "已提醒"], ["维生素D", "每日1次", "20:00", "待提醒"]], ["药品", "频次", "时间", "状态"])}
      ${miniTable("体检记录", [["2024-04-20", "昆明市人民医院", "血压偏高", "已回访"], ["2024-03-18", "社区卫生中心", "指标稳定", "已归档"], ["2024-02-12", "云康护理中心", "睡眠偏少", "已提醒"]], ["时间", "机构", "结论", "状态"])}
    </div>
  `;
}

function renderServiceRecordDetail(page) {
  return `
    ${pageHead(page, `${routeButton("返回用户详情", "user", "user-detail")} ${button("新增回访", "plus", "primary")} ${button("导出记录", "export")}`)}
    ${adminStatCards([["order", "累计服务", "126 次", "好评率 98%", "blue"], ["users", "执行人员", "18 人", "近30天服务", "green"], ["clock", "平均响应", "12 分钟", "较上周 -2分钟", "orange"], ["heart", "回访完成", "96%", "剩余2条", "purple"], ["alert", "待跟进", "3 条", "均已分配", "red"]])}
    <div class="admin-grid two-one">
      ${miniTable("服务记录列表", orderRows(7), ["订单编号", "用户", "服务类型", "服务时间", "地点", "执行方", "订单状态", "金额", "来源", "操作"])}
      ${timelinePanel("回访与跟进时间线")}
    </div>
    <div class="admin-grid three">
      ${infoPanel("最近服务摘要", [["服务类型", "上门护理"], ["服务人员", "王护工"], ["开始时间", "05-19 10:25"], ["服务时长", "68 分钟"], ["用户评价", "满意"]])}
      ${infoPanel("回访结果", [["回访人", "客服小陈"], ["回访时间", "05-19 15:20"], ["老人反馈", "服务耐心"], ["是否复购", "是"], ["需跟进", "无"]])}
      ${suggestionPanel()}
    </div>
  `;
}

function renderGuideReviewDetail(page) {
  return `
    ${pageHead(page, `${button("通过审核", "shield", "primary")} ${button("驳回", "alert", "danger")} ${button("补充资料", "import", "orange")} ${routeButton("返回列表", "arrowLeft", "guides")}`)}
    <section class="panel admin-profile-hero">
      <div class="person-row"><span class="photo large"></span><div><div class="profile-name">吴晓慧 ${tag("待审核", "orange")}</div><div class="profile-meta">申请ID DGAP20240519001　申请时间 2024-05-19 09:15:33</div></div></div>
      ${adminTopSummary([["申请岗位", "人工向导"], ["推荐人", "云康护理中心 · 李向导"], ["期望服务区域", "昆明市、大理市、丽江市"], ["最近更新时间", "2024-05-19 09:30:21"]])}
    </section>
    ${adminStatCards([["user", "实名认证", "已通过", "人脸识别通过", "blue"], ["shield", "服务类型", "3 项", "陪伴就医/导游游览/生活陪伴", "green"], ["device", "服务区域", "3 地", "昆明/大理/丽江", "blue"], ["import", "资质材料", "5/5", "已上传", "purple"], ["alert", "风控检查", "低风险", "综合 36 分", "red"]])}
    <div class="admin-grid audit-layout">
      ${infoPanel("个人信息", [["性别", "女"], ["年龄", "32岁"], ["联系电话", "138****5678"], ["身份证号", "530102********4521"], ["户籍地址", "云南省 昆明市 五华区"], ["最高学历", "本科"], ["工作经验", "5年（2019.06-至今）"], ["语言能力", "普通话（优秀）/ 英语（良好）"]])}
      <section class="panel">
        <div class="panel-head"><h2>基本资料</h2><span class="right">${tag("资料齐全", "green")}</span></div>
        <div class="admin-doc-grid">
          ${["身份证（正面）", "健康证", "职业资格证"].map((name) => `<div class="admin-doc"><span></span><strong>${name}</strong>${tag("已通过", "green")}</div>`).join("")}
        </div>
        <div class="admin-ocr-grid">
          ${[["姓名一致", "一致"], ["身份证号一致", "一致"], ["照片清晰度", "清晰"], ["证件完整性", "完整"], ["证件有效期", "2026-04-12"], ["活体检测", "通过"]].map(([a, b]) => `<div>${tag("✓", "green")} ${a}<strong>${b}</strong></div>`).join("")}
        </div>
        <div style="padding:0 14px 14px">${mapPanel(false)}</div>
      </section>
      <aside class="grid">
        ${reviewDecisionPanel("审核结论", ["通过审核", "驳回", "需补充资料"])}
        ${suggestionPanel()}
        ${miniTable("历史服务评价（参考）", [["好评率", "98%"], ["服务次数", "126"], ["投诉次数", "0"], ["星级评分", "4.9 / 5.0"]], ["指标", "数值"])}
      </aside>
    </div>
    <div class="admin-grid two">
      ${timelinePanel("审核流转记录", true)}
      ${miniTable("相似向导比对（黑名单 & 重复申请检测）", [["吴晓慧", "138****5677", "85%", "非重复"], ["吴晓慧", "139****5678", "100%", "同一申请"], ["吴小慧", "138****5679", "42%", "非重复"]], ["姓名", "手机号", "相似度", "结果"])}
    </div>
  `;
}

function renderGuideIncomeDetail(page) {
  return `
    ${pageHead(page, `${routeButton("返回向导管理", "users", "guides")} ${button("生成结算单", "save", "primary")} ${button("导出明细", "export")}`)}
    ${adminStatCards([["users", "向导", "李向导", "DG10023", "blue"], ["order", "本月完成", "28 单", "好评率 98%", "green"], ["chart", "本月收入", "¥5,680", "较上月 +12.5%", "orange"], ["heart", "评分", "4.9", "126条评价", "purple"], ["alert", "投诉", "0", "无待处理", "green"]])}
    <div class="admin-grid two-one">
      ${miniTable("收入明细", [["05-19", "陪伴就医", "DD20240519001", "¥160.00", "待结算"], ["05-18", "生活陪伴", "DD20240518018", "¥80.00", "已结算"], ["05-17", "导游游览", "DD20240517042", "¥260.00", "已结算"], ["05-16", "陪诊服务", "DD20240516022", "¥120.00", "已结算"]], ["日期", "服务类型", "订单编号", "收入", "状态"])}
      ${donutPanel("服务类型占比", "总收入", "¥5,680", serviceSegments())}
    </div>
    <div class="admin-grid three">
      ${timelinePanel("评价记录")}
      ${miniTable("投诉与售后", [["无", "近30天暂无投诉", "正常"], ["提醒", "1条迟到提醒已处理", "已关闭"]], ["类型", "内容", "状态"])}
      ${suggestionPanel()}
    </div>
  `;
}

function renderMerchantReviewDetail(page) {
  const reviewTabs = [
    ["机构信息", "agency"],
    ["营业资质", "license"],
    ["服务范围", "scope"],
    ["风控记录", "risk"],
    ["审核日志", "logs"],
  ];
  return `
    ${pageHead(page, `${button("批量审核", "save", "primary")} ${button("导出", "export")} ${button("审核规则", "system")}`)}
    ${adminStatCards([["order", "待审核商户", "78", "较昨日 +12.5%", "blue"], ["content", "资料待补充", "12", "较昨日 -7.7%", "orange"], ["shield", "已通过", "1,256", "较昨日 +9.3%", "green"], ["alert", "风险预警", "18", "较昨日 +20.0%", "red"]])}
    <div class="panel" style="margin-top:14px">${filters("merchant")}</div>
    <div class="admin-grid review-workbench">
      ${miniTable("入驻申请列表（共 78 条）", [["云康护理中心", "机构", "李妈妈", "昆明市", "100%", "低风险", "待审核", "审核"], ["东风康养公寓", "机构", "王雪梅", "昆明市", "80%", "低风险", "待补充", "查看"], ["津港大健康体检", "机构", "张主任", "昆明市", "90%", "中风险", "待审核", "审核"], ["云旅优选商城", "企业", "赵经理", "大理市", "100%", "低风险", "待审核", "审核"], ["暖心之家日照中心", "机构", "刘老师", "昆明市", "70%", "中风险", "待补充", "查看"], ["养心家政服务", "企业", "陈经理", "昆明市", "95%", "低风险", "待审核", "审核"]], ["商户名称", "类型", "联系人", "城市", "资质完整度", "风险等级", "状态", "操作"])}
      <section class="panel merchant-audit-panel">
        <div class="panel-head"><h2>商户审核详情</h2><span class="right">${tag("待审核", "orange")}</span></div>
        <div class="audit-title"><strong>云康护理中心</strong><span>MER20240519001　提交时间：2024-05-19 09:15:33</span></div>
        <div class="tabs" data-merchant-review-tabs>
          ${reviewTabs.map(([label, key], i) => `<button class="tab ${i === 0 ? "active" : ""}" type="button" data-merchant-review-tab="${key}">${label}</button>`).join("")}
        </div>
        <div class="merchant-review-tab-content" data-merchant-review-content>${merchantReviewTabContent("agency")}</div>
      </section>
    </div>
  `;
}

function merchantReviewTabContent(tab) {
  if (tab === "license") {
    return `
      <div class="admin-grid three">
        ${miniTable("营业资质（已上传 5/5）", [["营业执照", "已通过OCR", "有效期至 2033-06-11", "查看"], ["医疗机构执业许可", "已通过OCR", "有效期至 2029-05-18", "查看"], ["卫生许可证", "已通过OCR", "有效期至 2028-09-30", "查看"], ["人力资源服务许可", "已通过OCR", "有效期至 2027-12-31", "查看"], ["法人身份证", "已通过人证核验", "长期有效", "查看"]], ["材料", "识别状态", "有效期", "操作"])}
        ${infoPanel("OCR 校验结果", [["营业执照信息一致性", "通过"], ["统一社会信用代码校验", "通过"], ["法人一致性", "通过"], ["注册地址一致性", "通过"], ["资质经营范围", "覆盖康养护理"]])}
        ${reviewDecisionPanel("资质审核结论", ["资质通过", "要求补充资料", "驳回资质"])}
      </div>
    `;
  }
  if (tab === "scope") {
    return `
      <div class="admin-grid two">
        ${infoPanel("服务范围", [["服务城市", "昆明市"], ["覆盖区域", "五华区、盘龙区、官渡区"], ["上门半径", "12 公里"], ["营业时间", "08:00 - 20:00"], ["可预约时段", "每日 08:30 - 19:30"]])}
        ${mapPanel(false)}
      </div>
      <div class="admin-grid three">
        ${tagPanel("已申请服务分类", ["康养护理", "陪伴就医", "康复理疗", "上门护理", "慢病管理", "营养餐食"])}
        ${miniTable("服务能力配置", [["护士护理", "8 人", "可接单", "需资质"], ["康复理疗", "4 人", "可接单", "需资质"], ["陪伴就医", "12 人", "可接单", "普通"], ["营养餐食", "合作餐厅", "待审核", "食品资质"]], ["服务", "资源", "状态", "要求"])}
        ${infoPanel("平台建议", [["推荐等级", "优先接入"], ["服务缺口", "五华区护理订单较多"], ["价格策略", "建议按套餐配置"], ["审核建议", "服务范围可通过"]])}
      </div>
    `;
  }
  if (tab === "risk") {
    return `
      <div class="admin-grid three">
        ${infoPanel("风控评分", [["综合风险", "低风险 18 分"], ["经营异常", "未发现"], ["司法风险", "未发现"], ["投诉记录", "近 30 天 0 条"], ["黑名单命中", "未命中"]])}
        ${miniTable("风控记录", [["工商状态", "正常", "企业信息一致"], ["地址校验", "通过", "与营业执照一致"], ["联系人校验", "通过", "手机号实名一致"], ["服务资质", "通过", "护理资质齐全"]], ["检查项", "结果", "说明"])}
        ${reviewDecisionPanel("风控处理", ["通过风控", "人工复核", "要求补充说明"])}
      </div>
    `;
  }
  if (tab === "logs") {
    return `
      <div class="admin-grid two">
        ${timelinePanel("审核日志", true)}
        ${miniTable("审批流记录", [["2024-05-19 09:15", "商户提交入驻申请", "系统", "已记录"], ["2024-05-19 09:18", "OCR识别资质材料", "系统", "通过"], ["2024-05-19 09:26", "风控模型评分", "系统", "低风险"], ["2024-05-19 10:12", "运营初审", "王审核", "待终审"]], ["时间", "动作", "操作人", "结果"])}
      </div>
      <div class="admin-grid three">
        ${infoPanel("待办项", [["终审结论", "待处理"], ["补充材料", "无"], ["商户通知", "待发送"], ["服务上架", "审核通过后开启"]])}
        ${reviewDecisionPanel("终审操作", ["通过入驻", "驳回申请", "要求补充资料"])}
        ${suggestionPanel()}
      </div>
    `;
  }
  return `
    <div class="admin-grid two">
      ${infoPanel("基本信息", [["商户名称", "云康护理中心"], ["统一社会信用代码", "91530100MA6PXXXX2L"], ["法定代表人", "张新华"], ["注册资本", "500万元"], ["成立日期", "2023-06-12"], ["联系电话", "0871-****1234"], ["详细地址", "穿金路 88 号 2 栋 302 室"], ["营业状态", "正常"]])}
      ${mapPanel(false)}
    </div>
    <div class="admin-grid three">
      ${infoPanel("联系人信息", [["联系人", "李妈妈"], ["联系电话", "138****5678"], ["职务", "运营负责人"], ["邮箱", "service@yunkang.example"], ["紧急联系电话", "0871-****1234"]])}
      ${infoPanel("经营信息", [["机构类型", "康养护理机构"], ["服务人数", "护理人员 28 人"], ["月均服务", "1,286 单"], ["好评率", "98.6%"], ["结算账户", "已绑定"]])}
      ${reviewDecisionPanel("审核结论", ["通过入驻", "驳回申请", "要求补充资料"])}
    </div>
  `;
}

function renderOrderDetailAdmin(page) {
  if (adminDashboardState.loading && !adminDashboardState.data) {
    return `
      ${pageHead(page, "")}
      <section class="panel pad">
        <div class="panel-title">订单详情加载中</div>
        <p class="muted">正在从后台同步订单、任务、老人档案与健康数据。</p>
      </section>
    `;
  }

  const order = currentAdminOrderDetail();
  if (!order) {
    return `
      ${pageHead(page, "")}
      <section class="panel pad">
        <div class="panel-title">暂无订单数据</div>
        <p class="muted">当前后台接口没有返回可展示的订单记录。</p>
      </section>
    `;
  }

  const account = currentAdminOrderUser(order);
  const task = currentAdminOrderTask(order);
  const profile = currentAdminOrderProfile(order, account);
  const provider = currentAdminOrderProvider(order, task);
  const contacts = currentAdminOrderContacts(profile);
  const devices = currentAdminOrderDevices(order, profile);
  const timelineRows = adminOrderTimelineRows(order);
  const auditRows = adminOrderAuditRows(order, task);
  const healthRows = adminOrderHealthRows(profile);
  const contactRows = adminOrderContactRows(contacts);
  const deviceRows = adminOrderDeviceRows(devices);
  const stepRows = adminOrderStepRows(order);
  const statusRows = adminOrderStatusInfoRows(order, task, provider);
  const financeRows = adminOrderFinanceInfoRows(order, task);
  const profileRows = adminOrderProfileInfoRows(order, account, profile);
  const providerRows = adminOrderProviderInfoRows(provider, task);
  const requirementRows = adminOrderRequirementInfoRows(order);
  const locationRows = adminOrderLocationInfoRows(order, task);
  const syncRows = adminOrderSyncRows(order, task);

  return `
    ${pageHead(page, "")}
    <section class="panel order-summary">
      ${adminTopSummary([
        ["订单号", escapeHtml(order.orderNo || order.id || "未编号")],
        ["服务类型", escapeHtml(order.serviceType || "未记录")],
        ["订单状态", escapeHtml(order.status || "未记录")],
        ["订单金额", escapeHtml(`¥${Number(order.amount || 0).toFixed(2)}`)],
        ["订单来源", escapeHtml(order.source || "未记录")],
      ])}
    </section>
    <section class="panel" style="margin-top:14px">${adminStepFlow(stepRows, Math.max(0, stepRows.length - 1))}</section>
    <div class="admin-grid order-layout">
      <div class="grid">
        <div class="admin-grid two">
          ${infoPanel("服务需求", requirementRows, false)}
          ${infoPanel("时间与地点", locationRows, false)}
        </div>
        <div class="admin-grid two">
          ${infoPanel("用户与老人档案", profileRows, false)}
          ${infoPanel("执行方信息", providerRows, false)}
        </div>
        ${miniTable("健康数据快照", healthRows, ["指标", "数值", "状态", "来源", "时间"])}
        <div class="admin-grid two">
          ${miniTable("家属联系人", contactRows, ["姓名", "关系", "电话", "默认联系人", "告警通知"])}
          ${miniTable("关联设备", deviceRows, ["设备", "设备编号", "状态", "电量", "最后同步"])}
        </div>
        <div class="admin-grid two">
          ${miniTable("状态流转记录", timelineRows, ["时间", "状态", "说明"])}
          ${auditRows.length
            ? miniTable("后台操作记录", auditRows, ["时间", "动作", "内容", "操作人"])
            : `<section class="panel pad"><div class="panel-title">后台操作记录</div><p class="muted">当前接口暂无命中该订单编号或任务编号的后台操作日志。</p></section>`}
        </div>
      </div>
      <aside class="grid">
        ${infoPanel("当前状态", statusRows, false)}
        ${infoPanel("支付与来源", financeRows, false)}
        ${miniTable("订单同步记录", syncRows, ["时间", "类型", "内容", "结果"])}
      </aside>
    </div>
  `;
}

function renderDispatchDetailAdmin(page) {
  const detail = currentAdminDispatchDetail();
  if (adminDispatchState.loading && !detail) {
    return `
      ${pageHead(page, `${button("一键派单", "send", "primary")} ${button("改派", "edit")} ${button("指定执行方", "users")} ${button("通知执行方", "bell")} ${button("取消任务", "alert", "danger")}`)}
      <section class="panel pad"><div class="panel-title">任务调度详情加载中</div><p class="muted">正在同步待派单和执行中任务。</p></section>
    `;
  }
  if (!detail) {
    return `
      ${pageHead(page, `${button("一键派单", "send", "primary")} ${button("改派", "edit")} ${button("指定执行方", "users")} ${button("通知执行方", "bell")} ${button("取消任务", "alert", "danger")}`)}
      <section class="panel pad"><div class="panel-title">暂无调度任务</div><p class="muted">当前没有待派单或执行中的任务，可先在任务调度列表中创建或导入任务。</p></section>
    `;
  }
  const order = detail.order || {};
  const activeTab = adminDispatchState.detailTab || "map";
  const candidateRows = dispatchDetailCandidateRows(detail);
  const timelineRows = dispatchDetailTimelineRows(detail);
  const logRows = dispatchLogRows(detail);
  const notificationRows = dispatchNotificationRows(detail);
  return `
    ${pageHead(page, `${button("一键派单", "send", "primary")} ${button("改派", "edit")} ${button("指定执行方", "users")} ${button("通知执行方", "bell")} ${button("取消任务", "alert", "danger")}`)}
    <section class="panel admin-task-title">
      <h2>任务调度详情</h2>
      ${adminTopSummary([["任务ID", detail.task?.taskNo || "待创建"], ["关联订单", order.orderNo || order.id || "未记录"], ["服务类型", order.serviceType || "未记录"], ["优先级", detail.priority || "中"], ["当前状态", detail.status || "待派单"]])}
    </section>
    ${adminStatCards([["users", "匹配候选", `${candidateRows.filter((row) => row[0] !== "—").length} 人`, "符合条件的执行方", "blue"], ["shield", "推荐得分", candidateRows[0]?.[5] || "—", detail.provider?.assigneeName ? `${detail.provider.assigneeName} 当前最优` : "等待选择执行方", "green"], ["clock", "预计到达", dispatchCandidateEtaLabel(candidateRows[0]?.[3] || ""), "最快预计到达时间", "orange"], ["alert", "当前调度", detail.provider?.assigneeName || "未派单", detail.status === "待派单" ? "请尽快完成派单" : "可继续通知或改派", "red"]])}
    <div class="admin-grid dispatch-layout">
      <div class="grid">
        <section class="panel">
          <div class="tabs">${dispatchDetailTabOptions().map(([id, label]) => `<button class="tab ${activeTab === id ? "active" : ""}" type="button" data-action="切换调度详情标签:${id}" aria-pressed="${activeTab === id ? "true" : "false"}">${label}</button>`).join("")}</div>
          <div style="padding:14px">
            ${activeTab === "map" ? mapPanel(true) : ""}
            ${activeTab === "candidates" ? miniTable("候选执行方（按匹配得分排序）", candidateRows, ["排名", "执行方", "服务类型", "距离", "评分", "匹配得分", "可用状态", "操作"]) : ""}
            ${activeTab === "tracking" ? `
              <section class="panel" style="box-shadow:none;border:1px solid var(--line)">
                ${adminStepFlow(timelineRows.map(([time, statusText]) => [statusText, time]), Math.max(0, Math.min(timelineRows.length - 1, detail.status === "待派单" ? 0 : 1)))}
              </section>
              ${miniTable("调度轨迹", timelineRows, ["时间", "状态", "说明"])}
            ` : ""}
            ${activeTab === "logs" ? `
              ${miniTable("操作日志", logRows, ["时间", "类型", "任务编号", "内容", "操作人"])}
              <div style="height:14px"></div>
              ${miniTable("通知发送状态", notificationRows, ["对象", "方式", "状态", "时间"])}
            ` : ""}
          </div>
        </section>
      </div>
      <aside class="grid">
        ${infoPanel("任务基本信息", [["服务类型", order.serviceType || "未记录"], ["服务时间", order.time || "未记录"], ["服务地址", order.location || "未记录"], ["详细地址", order.detailAddress || order.location || "未记录"], ["特殊需求", order.note || "暂无补充说明"]], false)}
        ${infoPanel("老人健康预警", [["风险等级", order.riskLevel || "中风险"], ["标签", order.healthTags || "高血压 / 糖尿病 / 轻度骨关节炎"], ["注意事项", order.healthNotice || "调整等待时间，协助按时服药与休息"]], false)}
        ${renderDispatchDetailActionPanel(detail)}
        ${renderDispatchDetailSuggestionPanel(detail)}
      </aside>
    </div>
  `;
}

function renderDeviceExceptionDetail(page) {
  if (adminDashboardState.loading && !adminDashboardState.data) {
    return `
      ${pageHead(page, "")}
      <section class="panel pad">
        <div class="panel-title">设备异常数据加载中</div>
        <p class="muted">正在从后台同步设备异常与关联设备信息。</p>
      </section>
    `;
  }

  const alerts = adminDeviceExceptionAlerts();
  if (!alerts.length) {
    return `
      ${pageHead(page, "")}
      ${adminStatCards([["alert", "设备异常总数", "0", "当前接口未返回设备类异常", "green"], ["device", "离线设备", valueText(adminDashboardState.data?.stats?.offlineDevices || 0), "来自 /api/admin/dashboard", "purple"]])}
      <section class="panel pad" style="margin-top:14px">
        <div class="panel-title">暂无设备异常</div>
        <p class="muted">当前后台接口没有返回设备离线、低电量、健康监测异常等记录。</p>
      </section>
    `;
  }

  const currentAlert = currentAdminDeviceExceptionDetail();
  const currentId = currentAlert?.id || "";
  const orderedAlerts = [
    ...alerts.filter((item) => item.id === currentId),
    ...alerts.filter((item) => item.id !== currentId),
  ];
  const device = currentAdminDeviceExceptionDevice(currentAlert);
  const binding = currentAdminDeviceBinding(device);
  const profile = currentAdminDeviceExceptionProfile(currentAlert, device);
  const thresholds = device ? currentAdminDeviceThresholds(device) : adminDeviceThresholdDefaults;
  const pushSettings = device ? currentAdminDevicePushSettings(device) : adminDevicePushDefaults;
  const featureEntries = device ? currentAdminDeviceFeatureEntries(device) : [];
  const healthRows = currentAdminDeviceExceptionHealthRows();
  const auditRows = currentAdminDeviceExceptionLogs(currentAlert, device).slice(0, 8).map((item) => [
    escapeHtml(formatAdminScreenTime(item.createdAt || item.time || "")),
    escapeHtml(item.actor || "平台管理员"),
    escapeHtml(item.target ? `${item.action || ""}：${item.target}` : item.action || "异常处理"),
    escapeHtml(item.result || "已记录"),
  ]);
  const syncRows = device
    ? currentAdminDeviceSyncRecords(device).slice(0, 8).map((item) => [
      escapeHtml(item.time || "未记录"),
      escapeHtml(item.source || "设备同步"),
      escapeHtml(item.result || "已记录"),
      escapeHtml(item.delay || "—"),
    ])
    : [];
  const orderRows = currentAdminDeviceExceptionOrders(currentAlert).map((item) => [
    escapeHtml(item.orderNo || item.id || "未编号"),
    escapeHtml(item.serviceType || "未分类"),
    escapeHtml(item.time || item.createdAt || "未预约"),
    escapeHtml(item.status || "待处理"),
  ]);
  const statusText = String(currentAlert?.status || "待处理");
  const statusTone = statusText.includes("已处理") || statusText.includes("归档")
    ? "green"
    : statusText.includes("处理中")
      ? "blue"
      : "orange";
  const levelText = String(currentAlert?.level || "中");
  const levelTone = levelText.includes("高") ? "red" : levelText.includes("低") ? "blue" : "orange";
  const detailStep = statusText.includes("已处理") || statusText.includes("归档")
    ? 3
    : statusText.includes("处理中")
      ? 2
      : 1;
  const today = new Date();
  const isToday = (value) => {
    const time = adminLogTimeValue(value);
    if (!time) return false;
    const date = new Date(time);
    return date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate();
  };
  const pendingCount = alerts.filter((item) => String(item.status || "").includes("待处理")).length;
  const processingCount = alerts.filter((item) => String(item.status || "").includes("处理中")).length;
  const resolvedCount = alerts.filter((item) => /已处理|归档/.test(String(item.status || ""))).length;
  const todayCount = alerts.filter((item) => isToday(item.createdAt || item.time || "")).length;
  const featureSummary = featureEntries.filter(([, , enabled]) => enabled).map(([, label]) => label).join(" / ") || "未配置";
  const alertListRows = orderedAlerts.map((item) => [
    escapeHtml(item.id || "未编号"),
    escapeHtml(item.type || "设备异常"),
    escapeHtml(item.elderName || "未关联老人"),
    escapeHtml(item.level || "未分级"),
    escapeHtml(formatAdminScreenTime(item.createdAt || item.time || "")),
    escapeHtml(item.location || "未记录位置"),
    escapeHtml(item.status || "待处理"),
    {
      html: `<button class="link" type="button" data-route="device-exception" data-admin-exception-id="${escapeHtml(item.id || "")}">查看详情</button>`,
    },
  ]);
  const currentDeviceName = device?.name || device?.type || "未匹配设备";
  const currentDeviceId = device?.deviceId || device?.id || "未记录";
  return `
    ${pageHead(page, "")}
    ${adminStatCards([
      ["alert", "设备异常总数", valueText(alerts.length), "来自 /api/admin/alerts 的设备类异常", "red"],
      ["clock", "待处理", valueText(pendingCount), pendingCount ? "仍需后台跟进" : "当前无待处理", pendingCount ? "orange" : "green"],
      ["screen", "处理中", valueText(processingCount), processingCount ? "已有处理链路" : "当前无处理中记录", processingCount ? "blue" : "green"],
      ["shield", "已处理", valueText(resolvedCount), resolvedCount ? "已完成归档" : "当前暂无已处理", resolvedCount ? "green" : "blue"],
      ["device", "离线设备", valueText(adminDashboardState.data?.stats?.offlineDevices || 0), `今日新增设备异常 ${valueText(todayCount)} 条`, "purple"],
    ])}
    <section class="panel admin-event-title"><strong>异常详情：${escapeHtml(currentAlert?.id || "未编号")}</strong>${tag(escapeHtml(currentAlert?.type || "设备异常"), "orange")} ${tag(escapeHtml(levelText), levelTone)} ${tag(escapeHtml(statusText), statusTone)}</section>
    <div class="admin-grid exception-layout">
      <div class="grid">
        ${miniTable("设备异常列表", alertListRows, ["事件编号", "异常类型", "关联老人", "级别", "发生时间", "位置", "状态", "查看"])}
        <section class="panel pad">
          <div class="panel-head"><h2>异常概览</h2><span class="right muted">只读展示 / 数据源：/api/admin/alerts</span></div>
          <div class="admin-grid two">
            ${infoPanel("告警信息", [
              ["事件编号", escapeHtml(currentAlert?.id || "未编号")],
              ["异常类型", escapeHtml(currentAlert?.type || "设备异常")],
              ["严重级别", escapeHtml(levelText)],
              ["当前状态", tag(escapeHtml(statusText), statusTone)],
              ["发生时间", escapeHtml(formatAdminScreenTime(currentAlert?.createdAt || currentAlert?.time || ""))],
              ["异常说明", escapeHtml(currentAlert?.description || "接口未返回补充说明")],
            ], false)}
            ${infoPanel("关联设备", [
              ["设备名称", escapeHtml(currentDeviceName)],
              ["设备编号", escapeHtml(currentDeviceId)],
              ["在线状态", tag(escapeHtml(device?.onlineStatus || "未上报"), device?.onlineStatus === "在线" ? "green" : "red")],
              ["设备电量", escapeHtml(device?.battery !== undefined ? `${Number(device.battery)}%` : "未上报")],
              ["设备位置", escapeHtml(device?.location || currentAlert?.location || "未记录位置")],
              ["最后同步", escapeHtml(device ? formatAdminScreenTime(device.lastSyncAt || device.lastSync || device.updatedAt || "") || "未记录" : "未匹配设备")],
            ], false)}
          </div>
          ${adminStepFlow([
            ["告警产生", escapeHtml(formatAdminScreenTime(currentAlert?.createdAt || currentAlert?.time || ""))],
            ["待处理", pendingCount ? `${pendingCount} 条` : "0 条"],
            ["处理中", processingCount ? `${processingCount} 条` : "0 条"],
            ["已处理", resolvedCount ? `${resolvedCount} 条` : "0 条"],
          ], detailStep)}
        </section>
        <div class="admin-grid two">
          ${miniTable("健康数据快照", healthRows.length ? healthRows : [["暂无数据", "—", "接口未返回"]], ["指标", "当前值", "状态"])}
          ${miniTable("关联服务工单", orderRows.length ? orderRows : [["暂无关联工单", "—", "—", "—"]], ["工单编号", "服务类型", "服务时间", "工单状态"])}
        </div>
        <div class="admin-grid two">
          ${miniTable("操作日志", auditRows.length ? auditRows : [[escapeHtml(formatAdminScreenTime(currentAlert?.createdAt || currentAlert?.time || "")), "系统", "当前异常暂无后台处理日志", "待跟进"]], ["时间", "操作人", "动作", "结果"])}
          ${miniTable("同步记录", syncRows.length ? syncRows : [["暂无同步记录", "—", "未匹配到设备同步流水", "—"]], ["时间", "来源", "结果", "延迟"])}
        </div>
      </div>
      <aside class="grid">
        ${infoPanel("老人档案", [
          ["姓名", escapeHtml(profile.name || "未命名老人")],
          ["年龄/性别", escapeHtml([profile.age ? `${profile.age}岁` : "", profile.gender || ""].filter(Boolean).join(" / ") || "未记录")],
          ["所在城市", escapeHtml(profile.city || "未记录")],
          ["异常位置", escapeHtml(profile.address || "未记录")],
          ["健康风险", tag(escapeHtml(profile.riskLevel || "未分级"), levelTone)],
          ["健康标签", escapeHtml(profile.healthTags || "未配置")],
        ], false)}
        ${infoPanel("家属联系人", [
          ["联系人", escapeHtml(binding.contactName || "未绑定联系人")],
          ["关系", escapeHtml(binding.contactRelation || "未记录")],
          ["联系电话", escapeHtml(binding.contactPhone || "未记录")],
          ["联系区域", escapeHtml(binding.region || "未记录")],
          ["备注", escapeHtml(binding.note || "未记录")],
        ], false)}
        ${infoPanel("设备能力与阈值", [
          ["监护能力", escapeHtml(featureSummary)],
          ["心率阈值", escapeHtml(`${Number(thresholds.heartRateLow || 0)} - ${Number(thresholds.heartRateHigh || 0)} 次/分`)],
          ["血氧下限", escapeHtml(`${Number(thresholds.spo2Low || 0)}%`)],
          ["静止提醒", escapeHtml(`${Number(thresholds.inactivityMinutes || 0)} 分钟`)],
          ["通知家属", escapeHtml(pushSettings.notifyFamily ? "已开启" : "已关闭")],
          ["后台同步", escapeHtml(pushSettings.notifyAdmin ? "已开启" : "已关闭")],
          ["免打扰", escapeHtml(pushSettings.quietHours || "未设置")],
        ], false)}
      </aside>
    </div>
  `;
}

function renderComplaintDetail(page) {
  return `
    ${pageHead(page, `${button("新建工单", "plus", "primary")} ${button("分配客服", "users")} ${button("升级处理", "alert", "danger")} ${button("导出", "export")}`)}
    ${adminStatCards([["alert", "待处理投诉", "27", "较昨日 -8.0%", "red"], ["order", "服务质量投诉", "12", "较昨日 +20.0%", "orange"], ["system", "收费相关", "6", "较昨日 +50.0%", "blue"], ["clock", "已超时", "3", "较昨日 +1", "red"], ["shield", "今日关闭", "18", "较昨日 +9.1%", "green"]])}
    <div class="panel" style="margin-top:14px">${filters("complaint")}</div>
    <div class="admin-grid review-workbench">
      ${miniTable("投诉工单列表（共 156 条）", [["CP20240519001", "李奶奶", "DD20240519001", "服务质量", "高", "APP", "05-19 09:35", "待处理", "处理"], ["CP20240519002", "王爷爷", "DD20240518088", "收费相关", "中", "电话", "05-18 16:20", "处理中", "查看"], ["CP20240519003", "张奶奶", "DD20240518076", "服务态度", "中", "APP", "05-18 14:15", "待调查", "处理"], ["CP20240519004", "刘奶奶", "DD20240518065", "服务质量", "高", "小程序", "05-18 11:42", "已超时", "升级"]], ["工单编号", "投诉人", "关联订单", "投诉类型", "优先级", "来源", "提交时间", "状态", "操作"])}
      <section class="panel">
        <div class="panel-head"><h2>工单详情 CP20240519001</h2><span class="right">${tag("待处理", "orange")}</span></div>
        <div class="admin-grid two">
          ${infoPanel("投诉人信息", [["姓名", "李奶奶（72岁）"], ["手机号码", "138****5678"], ["所在地址", "昆明市五华区"], ["投诉渠道", "APP"], ["提交时间", "2024-05-19 09:35"], ["问题阶段", "退款补救服务"]])}
          ${infoPanel("投诉内容", [["投诉类型", "服务质量"], ["优先级", "高"], ["内容", "陪诊迟到40分钟，护士未回电话，要求退款并严肃处理"]])}
        </div>
        <div style="padding:0 14px 14px">${adminStepFlow([["受理", "当前步骤"], ["调查", "待处理"], ["协商", "待处理"], ["赔付/整改", "待处理"], ["回访", "待处理"], ["关闭", "待处理"]], 0)}</div>
        <div class="admin-grid two">
          ${infoPanel("关联订单与服务", [["订单号", "DD20240519001"], ["服务类型", "陪伴就医"], ["服务时间", "05-19 09:30 ~ 11:30"], ["订单金额", "¥120.00"], ["订单状态", "已完成"]])}
          ${timelinePanel("服务流程时间线", true)}
        </div>
        <div class="admin-grid three">
          ${miniTable("证据材料（3）", [["聊天记录", "已上传"], ["医院照片", "已上传"], ["通话录音", "00:45"]], ["材料", "状态"])}
          ${infoPanel("工单 SLA", [["响应时限", "2小时内"], ["剩余时间", "01:27:14"], ["已用时", "32分46秒"]])}
          ${infoPanel("责任执行方（向导）", [["姓名", "李向导"], ["状态", "在线"], ["好评率", "98%"], ["累计接单", "286 单"]])}
        </div>
      </section>
    </div>
    <div class="admin-grid four">
      ${miniTable("操作日志", systemRows(), ["时间", "操作人", "操作类型", "IP地址", "结果"])}
      ${timelinePanel("沟通记录", true)}
      ${miniTable("状态变更记录", [["05-19 09:35", "工单创建", "系统"], ["05-19 09:36", "待分配", "系统"], ["05-19 09:42", "待调查", "张小雨"]], ["时间", "状态", "操作人"])}
      ${miniTable("通知记录", [["APP推送", "李奶奶", "已送达", "09:38"], ["短信", "李奶奶", "已送达", "09:38"], ["APP推送", "李向导", "已送达", "09:43"]], ["通知方式", "接收人", "状态", "时间"])}
    </div>
  `;
}

function rememberAdminDeviceSelection(target, route) {
  if (route !== "device-detail") return;
  const row = target?.closest?.("tr");
  const firstCell = row?.querySelector("td");
  const value = firstCell?.textContent?.replace(/\s+/g, " ").trim();
  if (value) adminDeviceDetailState.selectedDeviceId = value;
}

function rememberAdminDispatchSelection(target, route) {
  if (route !== "dispatch-detail") return;
  const row = target?.closest?.("tr");
  const firstCell = row?.querySelector("td");
  const value = firstCell?.textContent?.replace(/\s+/g, " ").trim();
  if (value) adminDispatchState.selectedKey = value;
}

function rememberAdminExceptionSelection(target, route) {
  if (route !== "device-exception") return;
  const explicit = target?.getAttribute?.("data-admin-exception-id");
  if (explicit) {
    adminExceptionState.selectedAlertId = explicit;
    return;
  }
  const row = target?.closest?.("tr");
  const firstCell = row?.querySelector("td");
  const value = firstCell?.textContent?.replace(/\s+/g, " ").trim();
  if (value) adminExceptionState.selectedAlertId = value;
}

function rememberAdminOrderSelection(target, route) {
  if (route !== "order-detail") return;
  const explicit = target?.getAttribute?.("data-admin-order-id");
  if (explicit) {
    adminOrderState.selectedOrderId = explicit;
    return;
  }
  const row = target?.closest?.("tr");
  const firstCell = row?.querySelector("td");
  const value = firstCell?.textContent?.replace(/\s+/g, " ").trim();
  if (value) adminOrderState.selectedOrderId = value;
}

function adminText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function adminOrderCollection() {
  return adminDashboardState.data?.dataLoop?.services?.orders || [];
}

function adminTaskCollection() {
  return adminDashboardState.data?.dataLoop?.services?.tasks || [];
}

function adminAccountCollection() {
  return adminUserState.users?.length ? adminUserState.users : (adminDashboardState.data?.dataLoop?.users?.accounts || []);
}

function adminGuideCollection() {
  return adminGuideState.guides?.length ? adminGuideState.guides : (adminDashboardState.data?.dataLoop?.guides?.guides || []);
}

function adminMerchantCollection() {
  return adminDashboardState.data?.dataLoop?.merchants?.merchants || [];
}

function currentAdminOrderDetail() {
  const orders = adminOrderCollection();
  if (!orders.length) return null;
  const selectedId = adminText(adminOrderState.selectedOrderId);
  let current = orders.find((item) => [item.id, item.orderNo].includes(selectedId));
  if (!current && selectedId) {
    const selectedTask = adminTaskCollection().find((item) => [item.id, item.taskNo, item.orderId, item.order?.id, item.order?.orderNo].includes(selectedId));
    current = selectedTask?.order || null;
  }
  if (!current && adminDispatchState.selectedKey) {
    const dispatchKey = adminText(adminDispatchState.selectedKey);
    const dispatchTask = adminTaskCollection().find((item) => [item.id, item.taskNo, item.orderId, item.order?.id, item.order?.orderNo].includes(dispatchKey));
    current = dispatchTask?.order || orders.find((item) => [item.id, item.orderNo].includes(dispatchKey)) || null;
  }
  if (!current) current = orders[0];
  if (current?.orderNo || current?.id) adminOrderState.selectedOrderId = current.orderNo || current.id;
  return current;
}

function currentAdminOrderTask(order = currentAdminOrderDetail()) {
  if (!order) return null;
  const selectedId = adminText(adminOrderState.selectedOrderId);
  return adminTaskCollection().find((item) => {
    return item.orderId === order.id
      || item.order?.id === order.id
      || item.order?.orderNo === order.orderNo
      || [item.id, item.taskNo].includes(selectedId);
  }) || null;
}

function currentAdminOrderUser(order = currentAdminOrderDetail()) {
  if (!order) return {};
  const elderName = adminText(order.elderName);
  return adminAccountCollection().find((item) => item.id === order.userId)
    || adminAccountCollection().find((item) => order.phone && item.phone === order.phone)
    || adminAccountCollection().find((item) => elderName && [item.nickname, item.name].map(adminText).includes(elderName))
    || {};
}

function currentAdminOrderProfile(order = currentAdminOrderDetail(), account = currentAdminOrderUser(order)) {
  const profiles = adminDashboardState.data?.dataLoop?.users?.elderProfiles || [];
  if (!profiles.length) return adminDashboardState.data?.dataLoop?.health?.elder || {};
  const names = [order?.elderName, account?.nickname, account?.name].map(adminText).filter(Boolean);
  return profiles.find((item) => item.userId && order?.userId && item.userId === order.userId)
    || profiles.find((item) => names.includes(adminText(item.name)))
    || profiles[0]
    || {};
}

function currentAdminOrderContacts(profile = currentAdminOrderProfile()) {
  const contacts = currentAdminFamilyContacts();
  if (!contacts.length) return [];
  if (!profile?.id) return contacts;
  const matched = contacts.filter((item) => item.elderId === profile.id);
  return matched.length ? matched : contacts;
}

function currentAdminOrderProvider(order = currentAdminOrderDetail(), task = currentAdminOrderTask(order)) {
  const providerType = adminText(task?.assigneeType || order?.providerType);
  const providerId = adminText(task?.assigneeId || order?.providerId);
  const providerName = adminText(task?.assigneeName || order?.assigneeName);
  const accounts = adminAccountCollection();
  if (providerType === "merchant") {
    const merchant = adminMerchantCollection().find((item) => item.id === providerId || adminText(item.name) === providerName) || {};
    const account = accounts.find((item) => item.id === merchant.userId) || accounts.find((item) => adminText(item.nickname) === adminText(merchant.name)) || {};
    return {
      type: "merchant",
      typeLabel: "商户服务",
      displayName: merchant.name || providerName || "待分配商户",
      phone: merchant.phone || account.phone || order?.phone || "",
      status: task?.status || merchant.status || order?.status || "未记录",
      area: merchant.address || "",
      rating: merchant.rating ?? "",
      license: merchant.license || merchant.id || providerId || "未记录",
      dispatchRule: task?.dispatchRule || "接口未返回",
    };
  }
  const guide = adminGuideCollection().find((item) => item.id === providerId || adminText(item.realName || item.name) === providerName) || {};
  const account = accounts.find((item) => item.id === guide.userId) || accounts.find((item) => adminText(item.nickname) === adminText(guide.realName || guide.name)) || {};
  return {
    type: "guide",
    typeLabel: "人工向导",
    displayName: guide.realName || guide.name || providerName || "待分配向导",
    phone: account.phone || order?.phone || "",
    status: task?.status || guide.currentStatus || guide.onlineStatus || order?.status || "未记录",
    area: guide.area || "",
    rating: guide.rating ?? "",
    license: guide.id || providerId || "未记录",
    dispatchRule: task?.dispatchRule || "接口未返回",
  };
}

function currentAdminOrderDevices(order = currentAdminOrderDetail(), profile = currentAdminOrderProfile(order), account = currentAdminOrderUser(order)) {
  const devices = adminDeviceCollection();
  const names = new Set([order?.elderName, profile?.name, account?.nickname, account?.name].map(adminText).filter(Boolean));
  return devices
    .filter((item) => {
      const deviceElder = adminText(item.elderName);
      return (order?.userId && item.userId === order.userId)
        || (deviceElder && names.has(deviceElder));
    })
    .sort((a, b) => adminLogTimeValue(b.updatedAt || b.lastSyncAt || b.lastSync || "") - adminLogTimeValue(a.updatedAt || a.lastSyncAt || a.lastSync || ""));
}

function adminOrderTimeline(order = currentAdminOrderDetail()) {
  const timeline = Array.isArray(order?.timeline) ? order.timeline.slice() : [];
  if (!timeline.length) {
    return [{
      time: order?.createdAt || order?.time || "",
      status: order?.status || "未记录",
      text: "接口未返回订单状态流转明细",
    }];
  }
  return timeline.sort((a, b) => {
    const timeDiff = adminLogTimeValue(a.time || a.createdAt || "") - adminLogTimeValue(b.time || b.createdAt || "");
    if (timeDiff !== 0) return timeDiff;
    return adminOrderTimelineRank(a.status || "") - adminOrderTimelineRank(b.status || "");
  });
}

function adminOrderTimelineRank(status = "") {
  const text = String(status || "").trim();
  if (text.includes("待派单")) return 10;
  if (text.includes("待确认")) return 20;
  if (text.includes("已派单")) return 30;
  if (text.includes("已接单")) return 40;
  if (text.includes("已出发")) return 50;
  if (text.includes("已到达")) return 60;
  if (text.includes("服务中")) return 70;
  if (text.includes("异常")) return 80;
  if (text.includes("待评价")) return 85;
  if (text.includes("已完成")) return 90;
  if (text.includes("已取消")) return 100;
  return 999;
}

function adminOrderTimelineRows(order = currentAdminOrderDetail()) {
  return adminOrderTimeline(order)
    .slice()
    .reverse()
    .map((item) => [
      escapeHtml(formatAdminScreenTime(item.time || item.createdAt || "") || "未记录"),
      item.status || "未记录",
      escapeHtml(item.text || "接口未返回说明"),
    ]);
}

function adminOrderStepRows(order = currentAdminOrderDetail()) {
  return adminOrderTimeline(order).map((item) => [
    escapeHtml(item.status || "状态更新"),
    escapeHtml(formatAdminScreenTime(item.time || item.createdAt || "") || "未记录"),
  ]);
}

function adminOrderAuditRows(order = currentAdminOrderDetail(), task = currentAdminOrderTask(order)) {
  const keys = [order?.orderNo, order?.id, task?.taskNo, task?.id].map(adminText).filter(Boolean);
  return (adminAuditState.logs || [])
    .filter((item) => {
      const text = `${item.action || ""} ${item.target || ""} ${item.result || ""}`;
      return keys.some((key) => text.includes(key));
    })
    .sort((a, b) => adminLogTimeValue(b.createdAt || b.time || "") - adminLogTimeValue(a.createdAt || a.time || ""))
    .slice(0, 10)
    .map((item) => [
      escapeHtml(formatAdminScreenTime(item.createdAt || item.time || "") || "未记录"),
      escapeHtml(item.action || "后台操作"),
      escapeHtml(item.target || item.result || "已记录"),
      escapeHtml(item.actor || "平台管理员"),
    ]);
}

function adminOrderHealthRows(profile = currentAdminOrderProfile()) {
  const records = adminDashboardState.data?.dataLoop?.health?.records || [];
  const elderId = profile?.id;
  const matched = elderId ? records.filter((item) => item.elderId === elderId) : records;
  const rows = (matched.length ? matched : records)
    .slice()
    .sort((a, b) => adminLogTimeValue(b.recordedAt || b.createdAt || "") - adminLogTimeValue(a.recordedAt || a.createdAt || ""))
    .slice(0, 6)
    .map((item) => [
      escapeHtml(item.label || item.metricType || "健康指标"),
      escapeHtml(`${item.value ?? "—"}${item.unit || ""}`),
      item.status || item.referenceRange || "未标记",
      escapeHtml(item.source || "设备回传"),
      escapeHtml(formatAdminScreenTime(item.recordedAt || item.createdAt || "") || "未记录"),
    ]);
  return rows.length ? rows : [["暂无健康数据", "—", "—", "—", "—"]];
}

function adminOrderContactRows(contacts = currentAdminOrderContacts()) {
  const rows = contacts.map((item) => [
    escapeHtml(item.name || "未命名联系人"),
    escapeHtml(item.relation || "未记录"),
    escapeHtml(item.phone || "未记录"),
    escapeHtml(item.isDefault ? "是" : "否"),
    escapeHtml(item.notifyAlert ? "接收" : "不接收"),
  ]);
  return rows.length ? rows : [["暂无家属联系人", "—", "—", "—", "—"]];
}

function adminOrderDeviceRows(devices = currentAdminOrderDevices()) {
  const rows = devices.map((item) => [
    escapeHtml(item.name || item.type || "未命名设备"),
    escapeHtml(item.deviceId || item.id || "未编号"),
    item.onlineStatus || "未记录",
    escapeHtml(item.battery === undefined ? "未记录" : `${item.battery}%`),
    escapeHtml(formatAdminScreenTime(item.lastSyncAt || item.lastSync || item.updatedAt || "") || "未同步"),
  ]);
  return rows.length ? rows : [["暂无关联设备", "—", "未绑定", "—", "—"]];
}

function adminOrderRequirementInfoRows(order = currentAdminOrderDetail()) {
  const fields = order?.orderFields || {};
  const missing = Array.isArray(order?.missingFields) ? order.missingFields.map((item) => item.label || item.key).filter(Boolean).join("、") : "";
  return [
    ["服务类型", escapeHtml(order?.serviceType || "未记录")],
    ["预约时间", escapeHtml(fields.serviceTime || order?.time || "未记录")],
    ["服务地点", escapeHtml(fields.hospital || order?.location || "未记录")],
    ["订单备注", escapeHtml(fields.remark || order?.note || "未填写")],
    ["待补充字段", escapeHtml(missing || "无")],
  ];
}

function adminOrderLocationInfoRows(order = currentAdminOrderDetail(), task = currentAdminOrderTask(order)) {
  const fields = order?.orderFields || {};
  return [
    ["服务地点", escapeHtml(order?.location || fields.hospital || "未记录")],
    ["详细地址", escapeHtml(order?.detailAddress || fields.hospital || order?.location || "接口未返回")],
    ["服务时间", escapeHtml(order?.time || fields.serviceTime || "未记录")],
    ["下单时间", escapeHtml(formatAdminScreenTime(order?.createdAt || "") || "未记录")],
    ["关联任务", escapeHtml(task?.taskNo || "未生成")],
  ];
}

function adminOrderProfileInfoRows(order = currentAdminOrderDetail(), account = currentAdminOrderUser(order), profile = currentAdminOrderProfile(order, account)) {
  const healthTags = Array.isArray(profile?.healthTags) ? profile.healthTags.join(" / ") : "";
  return [
    ["订单称呼", escapeHtml(order?.elderName || profile?.name || account?.nickname || "未记录")],
    ["档案姓名", escapeHtml(profile?.name || order?.elderName || "接口未返回")],
    ["联系电话", escapeHtml(account?.phone || order?.phone || "接口未返回")],
    ["所在城市", escapeHtml(profile?.city || account?.city || "接口未返回")],
    ["居住地址", escapeHtml(profile?.address || "接口未返回")],
    ["健康标签", escapeHtml(healthTags || "接口未返回")],
    ["常用药物", escapeHtml(profile?.medicines || "接口未返回")],
    ["过敏史", escapeHtml(profile?.allergies || "接口未返回")],
  ];
}

function adminOrderProviderInfoRows(provider = currentAdminOrderProvider(), task = currentAdminOrderTask()) {
  return [
    ["执行类型", escapeHtml(provider?.typeLabel || "待分配")],
    ["执行方", escapeHtml(provider?.displayName || "未分配")],
    ["联系电话", escapeHtml(provider?.phone || "接口未返回")],
    ["任务状态", escapeHtml(task?.status || "未生成")],
    ["所在区域", escapeHtml(provider?.area || "接口未返回")],
    ["评分", escapeHtml(provider?.rating ? String(provider.rating) : "接口未返回")],
    ["资源编号", escapeHtml(provider?.license || "接口未返回")],
    ["派单规则", escapeHtml(provider?.dispatchRule || "接口未返回")],
  ];
}

function adminOrderStatusInfoRows(order = currentAdminOrderDetail(), task = currentAdminOrderTask(order), provider = currentAdminOrderProvider(order, task)) {
  const latestTime = adminOrderTimeline(order).slice(-1)[0]?.time || task?.updatedAt || order?.time || order?.createdAt || "";
  const cancelSource = order?.cancelledBy === "guide" ? "向导申请" : order?.cancelledBy === "merchant" ? "商户申请" : order?.cancelledBy === "admin" ? "后台处理" : "未触发";
  return [
    ["订单状态", escapeHtml(order?.status || "未记录")],
    ["任务状态", escapeHtml(task?.status || "未生成")],
    ["执行方", escapeHtml(provider?.displayName || "未分配")],
    ["任务编号", escapeHtml(task?.taskNo || "未生成")],
    ["最近更新时间", escapeHtml(formatAdminScreenTime(latestTime) || "未记录")],
    ["取消来源", escapeHtml(order?.cancelReason ? cancelSource : "未取消")],
    ["取消原因", escapeHtml(order?.cancelReason || "无")],
    ["订单来源", escapeHtml(order?.source || "未记录")],
  ];
}

function adminOrderFinanceInfoRows(order = currentAdminOrderDetail(), task = currentAdminOrderTask(order)) {
  const amount = `¥${Number(order?.amount || 0).toFixed(2)}`;
  return [
    ["订单金额", escapeHtml(amount)],
    ["支付渠道", escapeHtml(order?.paymentMethod || "接口未返回")],
    ["退款状态", escapeHtml(order?.refundStatus || (order?.cancelReason ? "接口未返回" : "无需退款"))],
    ["创建时间", escapeHtml(formatAdminScreenTime(order?.createdAt || "") || "未记录")],
    ["预约时间", escapeHtml(order?.time || "未记录")],
    ["任务创建", escapeHtml(formatAdminScreenTime(task?.createdAt || "") || "未记录")],
  ];
}

function adminOrderSyncRows(order = currentAdminOrderDetail(), task = currentAdminOrderTask(order)) {
  const rows = [
    [
      escapeHtml(formatAdminScreenTime(order?.createdAt || "") || "未记录"),
      "订单创建",
      escapeHtml(order?.orderNo || order?.id || "未编号"),
      escapeHtml(order?.source || "未记录"),
    ],
  ];
  if (task?.taskNo) {
    rows.push([
      escapeHtml(formatAdminScreenTime(task.createdAt || task.updatedAt || "") || "未记录"),
      "任务生成",
      escapeHtml(task.taskNo),
      escapeHtml(task.dispatchRule || task.status || "已同步"),
    ]);
  }
  if (order?.cancelReason) {
    const cancelPoint = adminOrderTimeline(order).slice().reverse().find((item) => String(item.status || "").includes("取消"));
    rows.push([
      escapeHtml(formatAdminScreenTime(cancelPoint?.time || task?.updatedAt || "") || "未记录"),
      "取消回传",
      escapeHtml(order.cancelReason),
      escapeHtml(order.cancelledBy || "接口未返回"),
    ]);
  }
  return rows;
}

function adminDeviceCollection() {
  return adminDashboardState.data?.dataLoop?.health?.devices || [];
}

function currentAdminElderProfile() {
  return adminDashboardState.data?.dataLoop?.users?.elderProfiles?.[0]
    || adminDashboardState.data?.dataLoop?.health?.elder
    || {};
}

function currentAdminFamilyContacts() {
  return adminDashboardState.data?.dataLoop?.users?.familyContacts || [];
}

function currentAdminDeviceDetail() {
  const devices = adminDeviceCollection();
  if (!devices.length) return null;
  const selectedId = adminDeviceDetailState.selectedDeviceId;
  const current = devices.find((item) => [item.id, item.deviceId].includes(selectedId)) || devices[0];
  if (current?.id) adminDeviceDetailState.selectedDeviceId = current.id;
  return current;
}

function currentAdminDeviceBinding(device = currentAdminDeviceDetail()) {
  const elder = currentAdminElderProfile();
  const contacts = currentAdminFamilyContacts();
  const contact = contacts.find((item) => item.id === device?.contactId)
    || contacts.find((item) => item.name === device?.contactName)
    || contacts.find((item) => item.isDefault)
    || contacts[0]
    || {};
  const elderName = device?.elderName || elder.name || "未绑定老人";
  const elderAge = device?.elderAge || elder.age || "";
  return {
    elderName,
    elderAge,
    elderDisplay: elderAge ? `${elderName}（${elderAge}岁）` : elderName,
    contactName: device?.contactName || contact.name || "",
    contactRelation: device?.contactRelation || contact.relation || "",
    contactDisplay: [device?.contactName || contact.name || "", device?.contactRelation || contact.relation || ""].filter(Boolean).join("（").replace(/（([^（]*)$/, "（$1）"),
    contactPhone: device?.contactPhone || contact.phone || "",
    region: device?.region || device?.location || elder.address || "",
    note: device?.note || device?.bindingNote || "当前设备已绑定并处于可同步状态。",
  };
}

function currentAdminDeviceThresholds(device = currentAdminDeviceDetail()) {
  return {
    ...adminDeviceThresholdDefaults,
    ...(device?.alertThresholds || {}),
  };
}

function currentAdminDevicePushSettings(device = currentAdminDeviceDetail()) {
  return {
    ...adminDevicePushDefaults,
    ...(device?.pushSettings || {}),
  };
}

function currentAdminDeviceFeatures(device = currentAdminDeviceDetail()) {
  return {
    ...adminDeviceFeatureDefaults,
    ...(device?.guardianSettings || {}),
  };
}

function currentAdminDeviceFeatureEntries(device = currentAdminDeviceDetail()) {
  const features = currentAdminDeviceFeatures(device);
  return [
    ["fallDetection", "跌倒检测", Boolean(features.fallDetection)],
    ["sosCall", "SOS紧急呼叫", Boolean(features.sosCall)],
    ["vitalSigns", "自动心率监测", Boolean(features.vitalSigns)],
    ["nightQuiet", "夜间勿扰模式", Boolean(features.nightQuiet)],
  ];
}

function adminRelativeTime(value) {
  if (!value) return "未同步";
  const parsed = new Date(String(value).replace(/-/g, "/"));
  if (Number.isNaN(parsed.getTime())) return formatAdminScreenTime(value);
  const diffMinutes = Math.max(0, Math.round((Date.now() - parsed.getTime()) / 60000));
  if (diffMinutes < 1) return "刚刚";
  if (diffMinutes < 60) return `${diffMinutes} 分钟前`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} 小时前`;
  return `${Math.round(diffHours / 24)} 天前`;
}

function currentAdminDeviceAlerts(device = currentAdminDeviceDetail()) {
  const binding = currentAdminDeviceBinding(device);
  const alerts = adminDashboardState.data?.dataLoop?.health?.alerts || [];
  return alerts.filter((item) => {
    const text = `${item.deviceId || ""} ${item.description || ""} ${item.title || ""}`;
    return text.includes(device?.deviceId || "")
      || text.includes(device?.id || "")
      || String(item.elderName || "").includes(binding.elderName || "");
  });
}

function isAdminDeviceExceptionAlert(item = {}) {
  const text = `${item.type || ""} ${item.title || ""} ${item.description || ""} ${item.deviceId || ""}`;
  if (!text.trim()) return false;
  if (/向导|客户身体不适|服务异常|时间变更|临时取消|位置共享|爽约|失联|功能异常/.test(text)) return false;
  return /设备|离线|低电量|摔倒|未动|心率|血压|血氧|体温|睡眠|步数|定位|手环|机器人|血压计|血氧仪|监测/.test(text);
}

function adminDeviceExceptionAlerts() {
  return (adminDashboardState.data?.dataLoop?.health?.alerts || [])
    .filter((item) => isAdminDeviceExceptionAlert(item))
    .slice()
    .sort((a, b) => adminLogTimeValue(b.createdAt || b.time || "") - adminLogTimeValue(a.createdAt || a.time || ""));
}

function currentAdminDeviceExceptionDetail() {
  const alerts = adminDeviceExceptionAlerts();
  if (!alerts.length) return null;
  const selectedId = String(adminExceptionState.selectedAlertId || "").trim();
  const current = alerts.find((item) => [item.id, item.deviceId].includes(selectedId)) || alerts[0];
  if (current?.id) adminExceptionState.selectedAlertId = current.id;
  return current;
}

function currentAdminDeviceExceptionDevice(alert = currentAdminDeviceExceptionDetail()) {
  const devices = adminDeviceCollection();
  if (!devices.length || !alert) return null;
  const text = `${alert.deviceId || ""} ${alert.type || ""} ${alert.description || ""} ${alert.location || ""}`;
  const elderName = String(alert.elderName || "").trim();
  const matches = devices
    .map((device) => {
      let score = 0;
      if (alert.deviceId && [device.id, device.deviceId].includes(alert.deviceId)) score += 200;
      if (elderName && elderName === String(device.elderName || "").trim()) score += 90;
      if (alert.type && /离线/.test(alert.type) && device.onlineStatus === "离线") score += 70;
      if (alert.location && device.location && (alert.location.includes(device.location) || device.location.includes(alert.location))) score += 55;
      if (text && (text.includes(device.deviceId || "") || text.includes(device.id || ""))) score += 45;
      if (text && (text.includes(device.type || "") || text.includes(device.name || ""))) score += 35;
      return { device, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return matches[0]?.device || devices[0] || null;
}

function currentAdminDeviceExceptionProfile(alert = currentAdminDeviceExceptionDetail(), device = currentAdminDeviceExceptionDevice(alert)) {
  const elder = currentAdminElderProfile();
  const binding = currentAdminDeviceBinding(device);
  return {
    name: alert?.elderName || binding.elderName || elder.name || "未命名老人",
    age: device?.elderAge || binding.elderAge || elder.age || "",
    gender: elder.gender || "",
    city: elder.city || "",
    address: alert?.location || binding.region || elder.address || "未记录",
    riskLevel: alert?.level || elder.riskLevel || "未分级",
    healthTags: Array.isArray(elder.healthTags) ? elder.healthTags.join(" / ") : "",
    medicines: elder.medicines || "",
    allergies: elder.allergies || "",
  };
}

function currentAdminDeviceExceptionOrders(alert = currentAdminDeviceExceptionDetail()) {
  if (!alert) return [];
  const orders = adminDashboardState.data?.dataLoop?.services?.orders || [];
  const elderName = String(alert.elderName || "").trim();
  const location = String(alert.location || "").trim();
  return orders
    .filter((item) => {
      if (elderName && String(item.elderName || "").includes(elderName)) return true;
      if (location && String(item.location || "").includes(location)) return true;
      return false;
    })
    .sort((a, b) => adminLogTimeValue(b.time || b.createdAt || "") - adminLogTimeValue(a.time || a.createdAt || ""))
    .slice(0, 5);
}

function currentAdminDeviceExceptionLogs(alert = currentAdminDeviceExceptionDetail(), device = currentAdminDeviceExceptionDevice(alert)) {
  const elderName = String(alert?.elderName || device?.elderName || "").trim();
  return (adminAuditState.logs || [])
    .filter((item) => {
      const target = `${item.target || ""}`;
      const text = `${item.action || ""} ${item.target || ""} ${item.result || ""}`;
      if (alert?.id && target.includes(alert.id)) return true;
      if (device?.deviceId && text.includes(device.deviceId)) return true;
      if (device?.id && text.includes(device.id)) return true;
      if (elderName && text.includes(elderName)) return true;
      return false;
    })
    .sort((a, b) => adminLogTimeValue(b.createdAt || b.time || "") - adminLogTimeValue(a.createdAt || a.time || ""));
}

function currentAdminDeviceExceptionHealthRows() {
  const metricLabels = {
    heart_rate: "心率",
    blood_pressure: "血压",
    blood_oxygen: "血氧",
    sleep: "睡眠",
    steps: "步数",
  };
  return (adminDashboardState.data?.dataLoop?.health?.records || [])
    .slice(0, 5)
    .map((item) => [
      escapeHtml(metricLabels[item.metricType] || item.metricType || "健康指标"),
      escapeHtml(`${item.value ?? "—"}${item.unit || ""}`),
      escapeHtml(item.status || item.referenceRange || "未标记"),
    ]);
}

function currentAdminDeviceAuditLogs(device = currentAdminDeviceDetail()) {
  if (!device) return [];
  const binding = currentAdminDeviceBinding(device);
  return (adminAuditState.logs || [])
    .filter((item) => {
      const text = `${item.action || ""} ${item.target || ""} ${item.result || ""}`;
      return text.includes(device.deviceId || "")
        || text.includes(device.id || "")
        || text.includes(binding.elderName || "");
    })
    .sort((a, b) => adminLogTimeValue(b.createdAt) - adminLogTimeValue(a.createdAt));
}

function currentAdminDeviceSyncRecords(device = currentAdminDeviceDetail()) {
  if (!device) return [];
  const healthCount = adminDashboardState.data?.dataLoop?.health?.records?.length || 0;
  const records = [];
  const lastSyncAt = device.lastSyncAt || device.lastSync || device.updatedAt || "";
  if (lastSyncAt) {
    records.push({
      time: formatAdminScreenTime(lastSyncAt),
      source: "设备主动同步",
      dataType: "健康数据",
      count: healthCount || 1,
      result: device.onlineStatus === "在线" ? "成功" : "待重试",
      delay: adminRelativeTime(lastSyncAt),
      detail: `${device.type || "设备"}最近一次在${device.location || "未记录位置"}完成同步。`,
      api: `/api/devices/${device.deviceId || device.id}/sync`,
    });
  }
  currentAdminDeviceAuditLogs(device).forEach((item) => {
    const action = String(item.action || "");
    const target = String(item.target || "");
    if (!/同步设备|设备操作|前端业务动作/.test(`${action} ${target}`)) return;
    records.push({
      time: formatAdminScreenTime(item.createdAt),
      source: action.includes("同步") ? "后台同步" : "后台设备操作",
      dataType: action.includes("同步") ? "健康数据" : "设备指令",
      count: action.includes("同步") ? (healthCount || 1) : 1,
      result: item.result || "已记录",
      delay: item.result && /成功|正常|已/.test(item.result) ? "实时" : "处理中",
      detail: `${item.actor || "平台管理员"}执行${action}${target ? `：${target}` : ""}`,
      api: action.includes("同步") ? `/api/devices/${device.deviceId || device.id}/sync` : `/api/devices/${device.deviceId || device.id}/action`,
    });
  });
  const seen = new Set();
  return records.filter((item) => {
    const key = `${item.time}|${item.source}|${item.detail}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
}

function renderAdminDeviceStatusPanel(device) {
  const featureEntries = currentAdminDeviceFeatureEntries(device);
  const enabledCount = featureEntries.filter(([, , enabled]) => enabled).length;
  const alerts = currentAdminDeviceAlerts(device);
  const rawPayload = {
    device,
    binding: currentAdminDeviceBinding(device),
    guardianSettings: currentAdminDeviceFeatures(device),
    thresholds: currentAdminDeviceThresholds(device),
    pushSettings: currentAdminDevicePushSettings(device),
  };
  return `
    <section class="panel pad">
      <div class="panel-head"><h2>页内状态区</h2><span class="right muted">${escapeHtml(adminDeviceDetailState.notice || device.deviceStatus || "等待设备操作")}</span></div>
      <div class="detail-list" style="padding-top:6px">
        ${[
          ["当前设备", device.deviceId || device.id || "未命名设备"],
          ["监护功能", `${enabledCount}/${featureEntries.length} 项开启`],
          ["最近动作", device.lastAction || "暂无"],
          ["动作时间", formatAdminScreenTime(device.lastActionAt || device.updatedAt || "") || "未记录"],
          ["异常数量", `${alerts.length} 条`],
        ].map(([label, value]) => `<div class="profile-row"><span>${label}</span><strong>${escapeHtml(String(value || "—"))}</strong></div>`).join("")}
      </div>
      ${adminDeviceDetailState.rawVisible ? `
        <div class="panel-title" style="margin:16px 0 10px">原始数据</div>
        <pre style="margin:0;padding:14px;border-radius:14px;background:#f6f9ff;border:1px solid #d9e5fb;color:#41506e;font-size:12px;line-height:1.7;white-space:pre-wrap;word-break:break-all">${escapeHtml(JSON.stringify(rawPayload, null, 2))}</pre>
      ` : ""}
    </section>
  `;
}

function renderAdminDeviceLogPanel(device) {
  const logs = currentAdminDeviceAuditLogs(device).slice(0, 8);
  const rows = logs.length
    ? logs.map((item) => [formatAdminScreenTime(item.createdAt), item.actor || "平台管理员", item.action || "设备操作", item.result || "成功"])
    : [[formatAdminScreenTime(device.updatedAt || device.lastSyncAt || device.lastSync || ""), "平台管理员", "设备建档", "当前设备暂无更多操作日志"]];
  return miniTable("设备操作日志", rows, ["时间", "操作人", "动作", "结果"]);
}

function renderAdminDeviceInfoPanel(device) {
  if (adminDeviceDetailState.editor !== "device") {
    return infoPanel("设备信息", [["设备编号", device.deviceId || device.id || "—"], ["设备名称", device.name || device.type || "—"], ["设备类型", device.type || "—"], ["设备状态", device.onlineStatus || "—"], ["电量", `${Number(device.battery || 0)}%`], ["网络状态", device.networkStatus || "未上报"], ["设备位置", device.location || "未记录"], ["设备来源", device.source || "平台设备"]], "编辑设备信息");
  }
  return `
    <section class="panel pad" data-admin-device-editor="device">
      <div class="panel-title" style="margin-bottom:14px">设备信息<button class="link" type="button" style="float:right" data-action="取消设备信息编辑">取消</button></div>
      <div class="form-body device-inline-form">
        <div class="form-row"><label>设备名称</label><input class="form-control" data-device-field="name" value="${escapeHtml(device.name || device.type || "")}" /></div>
        <div class="form-row"><label>设备类型</label><input class="form-control" data-device-field="type" value="${escapeHtml(device.type || "")}" /></div>
        <div class="form-row"><label>状态</label><select class="form-control" data-device-field="onlineStatus">${["在线", "离线", "检修中"].map((item) => `<option value="${item}"${item === (device.onlineStatus || "在线") ? " selected" : ""}>${item}</option>`).join("")}</select></div>
        <div class="form-row"><label>电量</label><input class="form-control" data-device-field="battery" type="number" min="0" max="100" value="${escapeHtml(String(Number(device.battery || 0)))}" /></div>
        <div class="form-row"><label>网络状态</label><input class="form-control" data-device-field="networkStatus" value="${escapeHtml(device.networkStatus || "")}" placeholder="如：良好 / 一般" /></div>
        <div class="form-row"><label>设备位置</label><input class="form-control" data-device-field="location" value="${escapeHtml(device.location || "")}" /></div>
        <div class="form-row"><label>设备来源</label><input class="form-control" data-device-field="source" value="${escapeHtml(device.source || "平台设备")}" /></div>
        <div class="chip-row">${button("保存设备信息", "save", "primary")}<button class="btn" type="button" data-action="取消设备信息编辑"><span>取消</span></button></div>
      </div>
    </section>
  `;
}

function renderAdminDeviceBindingPanel(binding) {
  if (adminDeviceDetailState.editor !== "binding") {
    return infoPanel("绑定信息", [["绑定老人", binding.elderDisplay || "—"], ["联系人", binding.contactName || "—"], ["关系", binding.contactRelation || "—"], ["联系电话", binding.contactPhone || "—"], ["所在地区", binding.region || "—"], ["备注", binding.note || "—"]], "编辑绑定信息");
  }
  return `
    <section class="panel pad" data-admin-device-editor="binding">
      <div class="panel-title" style="margin-bottom:14px">绑定信息<button class="link" type="button" style="float:right" data-action="取消绑定信息编辑">取消</button></div>
      <div class="form-body device-inline-form">
        <div class="form-row"><label>绑定老人</label><input class="form-control" data-device-field="elderName" value="${escapeHtml(binding.elderName || "")}" /></div>
        <div class="form-row"><label>紧急联系人</label><input class="form-control" data-device-field="contactName" value="${escapeHtml(binding.contactName || "")}" /></div>
        <div class="form-row"><label>联系人关系</label><input class="form-control" data-device-field="contactRelation" value="${escapeHtml(binding.contactRelation || "")}" /></div>
        <div class="form-row"><label>联系电话</label><input class="form-control" data-device-field="contactPhone" value="${escapeHtml(binding.contactPhone || "")}" /></div>
        <div class="form-row"><label>所在地区</label><input class="form-control" data-device-field="region" value="${escapeHtml(binding.region || "")}" /></div>
        <div class="form-row"><label>备注</label><textarea class="textarea" data-device-field="note">${escapeHtml(binding.note || "")}</textarea></div>
        <div class="chip-row">${button("保存绑定信息", "save", "primary")}<button class="btn" type="button" data-action="取消绑定信息编辑"><span>取消</span></button></div>
      </div>
    </section>
  `;
}

function renderAdminDeviceThresholdPanel(thresholds) {
  if (adminDeviceDetailState.editor !== "threshold") {
    return infoPanel("告警阈值设置", [["心率上限", `${Number(thresholds.heartRateHigh || 0)} 次/分`], ["心率下限", `${Number(thresholds.heartRateLow || 0)} 次/分`], ["血氧下限", `${Number(thresholds.spo2Low || 0)}%`], ["静止未动时长", `${Number(thresholds.inactivityMinutes || 0)} 分钟`]], "编辑告警阈值");
  }
  return `
    <section class="panel pad" data-admin-device-editor="threshold">
      <div class="panel-title" style="margin-bottom:14px">告警阈值设置<button class="link" type="button" style="float:right" data-action="取消告警阈值编辑">取消</button></div>
      <div class="form-body device-inline-form">
        <div class="form-row"><label>心率上限</label><input class="form-control" data-device-field="heartRateHigh" type="number" value="${escapeHtml(String(Number(thresholds.heartRateHigh || 0)))}" /></div>
        <div class="form-row"><label>心率下限</label><input class="form-control" data-device-field="heartRateLow" type="number" value="${escapeHtml(String(Number(thresholds.heartRateLow || 0)))}" /></div>
        <div class="form-row"><label>血氧下限</label><input class="form-control" data-device-field="spo2Low" type="number" value="${escapeHtml(String(Number(thresholds.spo2Low || 0)))}" /></div>
        <div class="form-row"><label>静止未动时长</label><input class="form-control" data-device-field="inactivityMinutes" type="number" value="${escapeHtml(String(Number(thresholds.inactivityMinutes || 0)))}" /></div>
        <div class="chip-row">${button("保存告警阈值", "save", "primary")}<button class="btn" type="button" data-action="取消告警阈值编辑"><span>取消</span></button></div>
      </div>
    </section>
  `;
}

function renderAdminDeviceEditor(device) {
  const binding = currentAdminDeviceBinding(device);
  const pushSettings = currentAdminDevicePushSettings(device);
  if (adminDeviceDetailState.editor === "push") {
    return `
      <section class="panel pad" data-admin-device-editor="push">
        <div class="panel-head"><h2>推送设置</h2><button class="link" type="button" data-action="取消推送设置">取消</button></div>
        <div class="form-body">
          ${[
            ["notifyFamily", "同步家属通知", pushSettings.notifyFamily],
            ["notifyAdmin", "同步后台告警", pushSettings.notifyAdmin],
            ["smsBackup", "短信补发", pushSettings.smsBackup],
          ].map(([field, label, checked]) => `
            <label class="tree-row" style="cursor:pointer">
              <strong>${label}</strong>
              <input type="checkbox" data-device-field="${field}" ${checked ? "checked" : ""} style="width:18px;height:18px;accent-color:#2f6fed" />
            </label>
          `).join("")}
          <div class="form-row"><label>免打扰时段</label><input class="form-control" data-device-field="quietHours" value="${escapeHtml(pushSettings.quietHours || "")}" /></div>
          <div class="chip-row">${button("保存推送设置", "save", "primary")}<button class="btn" type="button" data-action="取消推送设置"><span>取消</span></button></div>
        </div>
      </section>
    `;
  }
  if (adminDeviceDetailState.editor === "unbind") {
    return `
      <section class="panel pad">
        <div class="panel-head"><h2>解绑设备确认</h2><button class="link" type="button" data-action="取消解绑设备">取消</button></div>
        <div class="detail-list" style="padding-top:8px">
          ${[
            ["设备编号", device.deviceId || device.id || ""],
            ["设备名称", device.name || device.type || ""],
            ["绑定老人", binding.elderDisplay || ""],
            ["最近同步", formatAdminScreenTime(device.lastSyncAt || device.lastSync || device.updatedAt || "") || "未记录"],
          ].map(([label, value]) => `<div class="profile-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value || "—"))}</strong></div>`).join("")}
        </div>
        <div class="chip-row" style="margin-top:16px">${button("确认解绑设备", "alert", "danger")}<button class="btn" type="button" data-action="取消解绑设备"><span>取消</span></button></div>
      </section>
    `;
  }
  return renderAdminDeviceLogPanel(device);
}

function renderDeviceLogDetail(page) {
  if (adminDashboardState.loading && !adminDashboardState.data) {
    return `
      ${pageHead(page, `${button("远程检测", "screen", "primary")} ${button("推送设置", "send")} ${button("解绑设备", "alert", "danger")} ${button("查看原始数据", "eye")}`)}
      <section class="panel pad"><div class="panel-title">设备数据加载中</div><p class="muted">正在从后台同步当前设备详情。</p></section>
    `;
  }
  const device = currentAdminDeviceDetail();
  if (!device) {
    return `
      ${pageHead(page, `${button("远程检测", "screen", "primary")} ${button("推送设置", "send")} ${button("解绑设备", "alert", "danger")} ${button("查看原始数据", "eye")}`)}
      <section class="panel pad">
        <div class="panel-title">暂无设备数据</div>
        <p class="muted">请先在设备管理中新增或导入设备，再查看详情。</p>
      </section>
    `;
  }
  const binding = currentAdminDeviceBinding(device);
  const thresholds = currentAdminDeviceThresholds(device);
  const pushSettings = currentAdminDevicePushSettings(device);
  const alerts = currentAdminDeviceAlerts(device);
  const featureEntries = currentAdminDeviceFeatureEntries(device);
  const syncRecords = currentAdminDeviceSyncRecords(device);
  const eventRows = currentAdminDeviceAuditLogs(device).slice(0, 8).map((item) => [
    formatAdminScreenTime(item.createdAt),
    item.action || "设备操作",
    item.result || "已记录",
    /失败|异常/.test(item.result || "") ? "警告" : "信息",
  ]);
  const callbackRows = syncRecords.slice(0, 8).map((item) => [item.time, item.api, item.result, item.delay]);
  const alertRowsForDevice = alerts.slice(0, 8).map((item) => [formatAdminScreenTime(item.createdAt), item.type || "异常提醒", item.location || "—", item.status || "待处理"]);
  return `
    ${pageHead(page, `${button("远程检测", "screen", "primary")} ${button("推送设置", "send")} ${button("解绑设备", "alert", "danger")} ${button("查看原始数据", "eye")}`)}
    <section class="panel admin-task-title">
      <h2>${escapeHtml(device.name || device.type || "设备")} / ${escapeHtml(device.deviceId || device.id || "未命名")} ${tag(device.onlineStatus || "在线", device.onlineStatus === "在线" ? "green" : "red")}</h2>
      <p class="muted">设备类型：${escapeHtml(device.type || "未记录")}　|　绑定老人：${escapeHtml(binding.elderDisplay || "未绑定")}　|　最近同步：${escapeHtml(formatAdminScreenTime(device.lastSyncAt || device.lastSync || device.updatedAt || "") || "未记录")}</p>
    </section>
    ${adminStatCards([
      ["device", "电量", `${Number(device.battery || 0)}%`, device.battery >= 20 ? "设备当前可继续使用" : "建议尽快充电", "blue"],
      ["chart", "网络状态", device.networkStatus || device.onlineStatus || "未上报", device.location || "未记录设备位置", device.onlineStatus === "在线" ? "green" : "orange"],
      ["clock", "最后同步", adminRelativeTime(device.lastSyncAt || device.lastSync || device.updatedAt || ""), formatAdminScreenTime(device.lastSyncAt || device.lastSync || device.updatedAt || ""), "blue"],
      ["import", "推送通道", `${[pushSettings.notifyFamily, pushSettings.notifyAdmin, pushSettings.smsBackup].filter(Boolean).length} 项`, pushSettings.quietHours ? `免打扰：${pushSettings.quietHours}` : "未设置免打扰", "purple"],
      ["shield", "告警状态", alerts.length ? `${alerts.length} 条待跟进` : "正常", alerts.length ? alerts[0].type || "存在待处理提醒" : "当前无待处理异常", alerts.length ? "orange" : "green"],
    ])}
    <div class="admin-grid device-log-layout">
      <aside class="grid">
        ${renderAdminDeviceInfoPanel(device)}
        ${renderAdminDeviceBindingPanel(binding)}
        ${renderAdminDeviceStatusPanel(device)}
        ${miniTable("设备事件日志", eventRows.length ? eventRows : [[formatAdminScreenTime(device.updatedAt || device.lastSyncAt || ""), "设备建档", "当前设备暂无更多事件", "信息"]], ["时间", "事件类型", "事件内容", "级别"])}
      </aside>
      <div class="grid">
        ${healthTrendPanel()
          .replace('<section class="panel">', '<section class="panel device-health-overview">')
          .replace("最近健康数据（今日统计）", "24小时健康数据概览")}
        ${renderAdminDeviceEditor(device)}
      </div>
      <aside class="grid">
        <section class="panel">
          <div class="panel-head"><h2>远程操作面板</h2></div>
          <div class="tabs">
            <button class="tab ${adminDeviceDetailState.activeTab === "operations" ? "active" : ""}" type="button" data-action="切换设备操作" aria-pressed="${adminDeviceDetailState.activeTab === "operations" ? "true" : "false"}">设备操作</button>
            <button class="tab ${adminDeviceDetailState.activeTab === "settings" ? "active" : ""}" type="button" data-action="切换参数设置" aria-pressed="${adminDeviceDetailState.activeTab === "settings" ? "true" : "false"}">参数设置</button>
          </div>
          <div class="form-body">
            ${adminDeviceDetailState.activeTab === "operations" ? `
              ${button("远程检测", "screen", "primary")}
              ${infoPanel("固件信息", [["当前版本", device.firmwareVersion || "未上报"], ["最近动作", device.lastAction || "暂无"], ["动作时间", formatAdminScreenTime(device.lastActionAt || device.updatedAt || "") || "未记录"]], false)}
              ${featureEntries.map(([key, label, enabled]) => `
                <div class="tree-row"><strong>${label}</strong><button class="toggle ${enabled ? "on" : ""}" type="button" data-action="切换监护功能" data-guardian-feature="${key}" aria-pressed="${enabled ? "true" : "false"}"></button></div>
              `).join("")}
            ` : `
              <div class="detail-list" style="padding-top:4px">
                ${[
                  ["同步家属通知", pushSettings.notifyFamily ? "已开启" : "已关闭"],
                  ["同步后台告警", pushSettings.notifyAdmin ? "已开启" : "已关闭"],
                  ["短信补发", pushSettings.smsBackup ? "已开启" : "已关闭"],
                  ["免打扰时段", pushSettings.quietHours || "未设置"],
                ].map(([label, value]) => `<div class="profile-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value || "—"))}</strong></div>`).join("")}
              </div>
            `}
          </div>
        </section>
        ${renderAdminDeviceThresholdPanel(thresholds)}
        ${miniTable("异常历史记录", alertRowsForDevice.length ? alertRowsForDevice : [[formatAdminScreenTime(device.updatedAt || device.lastSyncAt || ""), "暂无设备异常", "—", "已清空"]], ["时间", "异常类型", "位置/持续", "处理状态"])}
      </aside>
    </div>
    <div class="admin-grid">
      ${miniTable("API回调日志", callbackRows.length ? callbackRows : [[formatAdminScreenTime(device.updatedAt || device.lastSyncAt || ""), `/api/devices/${device.deviceId || device.id}/sync`, "暂无回调记录", "—"]], ["时间", "回调接口", "结果", "耗时"])}
    </div>
  `;
}

function reviewDecisionPanel(title, options) {
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2><span class="right"><button class="link">审核规则说明 ${chevron("right")}</button></span></div>
      <div class="form-body">
        <div class="chip-row">${options.map((item, i) => `<label class="radio-card ${i === 0 ? "active" : ""}"><span></span>${item}</label>`).join("")}</div>
        <div class="form-row"><label>原因（选填）</label><input class="form-control" placeholder="请选择原因" /></div>
        <div class="form-row"><label>审核备注</label><textarea class="textarea" placeholder="请填写审核备注，不少于10个字"></textarea></div>
        <div class="chip-row">${options.map((item, i) => button(item, i === 0 ? "shield" : i === 1 ? "alert" : "import", i === 0 ? "primary" : i === 1 ? "danger" : "orange")).join("")}</div>
      </div>
    </section>
  `;
}

function renderForm(page) {
  if (page.id === "activity-edit") return renderActivityEditReference(page);
  if (page.id === "article-edit") return renderArticleEditReference(page);
  const preview = page.preview || page.id.includes("banner") || page.id.includes("article") || page.id.includes("activity");
  const basicRows = formBasicRows(page);
  const tags = formTags(page);
  const content = `
    ${pageHead(page)}
    ${page.id === "guide-create" ? formStepper(["基础信息", "服务能力", "资质上传", "排班设置", "提交审核"], 1) : ""}
    <div class="form-grid">
      <div class="form-sections">
        ${formSection("一、基础信息", basicRows, tags)}
        ${mediaSection(page)}
        ${priceSection(page)}
        ${timeSection(page)}
        ${areaSection()}
        ${notesSection()}
      </div>
      ${preview ? phonePreview(page) : formAssistPanel(page)}
    </div>
  `;
  if (page.id === "activity-edit") return `<div class="admin-activity-edit">${content}</div>`;
  if (page.id === "service-create") return `<div class="admin-service-create-ref">${content}</div>`;
  return content;
}

function renderArticleEditReference(page) {
  const cover = "/user/assets/home-hero.jpg";
  const activity = "/user/assets/activity-taiji.jpg";
  return `
    <div class="admin-article-edit-ref">
      ${pageHead(page, `
        <button class="btn ghost" data-action="预览">${icons.eye}预览</button>
        <button class="btn ghost" data-action="保存草稿">${icons.save}保存草稿</button>
        <button class="btn ghost" data-action="提交审核">${icons.send}提交审核</button>
        <button class="btn primary" data-action="发布">${icons.send}发布</button>
      `)}
      <div class="article-edit-layout">
        <main class="article-edit-main panel">
          <div class="article-edit-fields">
            <label class="article-field wide"><b>文章标题 <em>*</em></b><input value="旅居生活的美好日常分享" /><small>12/100</small></label>
            <label class="article-field"><b>文章分类 <em>*</em></b><input value="旅居生活" /></label>
            <label class="article-field"><b>标签</b><div class="chip-row">${["旅居生活", "长辈生活", "知识攻略", "健康养生"].map((item) => tag(item, "blue")).join("")}<button class="btn ghost" type="button" data-action="添加标签">+ 添加标签</button></div></label>
            <label class="article-field"><b>作者 <em>*</em></b><input value="云旅小编" /></label>
            <label class="article-field"><b>来源</b><input value="云旅无忧官方" /></label>
            <label class="article-field"><b>文章原链接</b><input value="https://www.yunlvwuyou.com/news/20240519" /><small>36/200</small></label>
            <label class="article-field wide"><b>文章摘要 <em>*</em></b><input value="分享长辈在云南昆明的旅居生活点滴，记录美景、美食与健康生活方式。" /><small>44/200</small></label>
          </div>
          <section class="article-cover-row">
            <div>
              <b>封面图片 <em>*</em></b>
              <span>建议尺寸：1200x675px，支持 JPG/PNG，单图不超过 5MB</span>
              <div class="article-cover-upload">${adminImg(cover, "文章封面")}<button type="button" data-action="更换图片">更换图片</button></div>
            </div>
          </section>
          <section class="article-editor">
            <div class="editor-bar"><button>正文</button><button>14px</button><button>B</button><button>I</button><button>U</button><button>列表</button><button>链接</button><button>图片</button><button>撤销</button></div>
            <h2>旅居生活的美好日常分享</h2>
            <p>在云南昆明的这段旅居时光里，每一天都充满了阳光与温暖。清晨，我们在湖边散步，呼吸着清新的空气；午后，和邻里朋友一起品茶聊天，分享生活中的点滴趣事；傍晚，欣赏远处的西山晚霞，心也变得格外宁静。</p>
            <div class="article-inline-image">${adminImg(cover, "旅居湖景")}</div>
            <h3>一、健康生活，规律作息</h3>
            <p>我们坚持每天早起锻炼，参加社区的太极晨练活动，饮食以清淡为主，多吃当地新鲜的蔬菜水果，身体状态越来越好。</p>
            <div class="article-related-card">${adminImg(activity, "活动推荐")}<div><strong>晨练太极·健康每一天</strong><span>05-20 07:30-08:30 · 翠湖公园</span><em>28人已报名</em></div><button type="button" data-action="查看活动详情">查看活动详情</button></div>
            <h3>二、探索美景，感受自然</h3>
            <p>昆明四季如春，阳光和煦而不灼热。每一次散步都让人流连忘返，也让旅居生活有了更多值得记录的瞬间。</p>
            <footer>字数统计：682</footer>
          </section>
        </main>
        <aside class="article-edit-middle">
          <section class="panel article-publish-card">
            <h2>发布设置</h2>
            <p>发布状态 ${["草稿", "待审核", "已发布"].map((item, index) => `<button class="${index === 1 ? "active" : ""}" type="button" data-action="发布状态：${item}">${item}</button>`).join("")}</p>
            <p>发布时间 <button class="active" type="button" data-action="立即发布">立即发布</button><button type="button" data-action="定时发布">定时发布</button><input value="2024-05-21 10:00" /></p>
            <p>可见端 ${["小程序", "iOS App", "Android App"].map((item) => `<label><input type="checkbox" checked />${item}</label>`).join("")}</p>
            <p>推荐位 ${["首页推荐", "资讯频道推荐", "置顶推荐"].map((item, index) => `<label><input type="checkbox" ${index === 0 ? "checked" : ""} />${item}</label>`).join("")}</p>
          </section>
          <section class="panel article-status-card">
            <h2>审核状态 ${tag("待审核", "orange")}</h2>
            <p>审核流程：内容初审 -> 合规审核 -> 终审发布</p>
            <p>当前节点：内容初审</p>
            <p>提交时间：2024-05-19 10:30</p>
          </section>
          <section class="panel article-related-box">
            <h2>关联内容 <button type="button" data-action="关联活动">+ 关联活动</button></h2>
            <p><span>晨练太极·健康每一天</span><button type="button" data-action="移除关联活动">移除</button></p>
            <h2>关联服务</h2>
            <p><span>康养旅居服务套餐</span><button type="button" data-action="移除关联服务">移除</button></p>
          </section>
          <section class="panel article-seo-card">
            <h2>SEO与分享设置</h2>
            <label>SEO标题<input value="旅居生活的美好日常分享｜云旅无忧" /></label>
            <label>SEO关键词<input value="旅居生活，云南旅居，长辈旅居，健康生活" /></label>
            <label>SEO描述<textarea>分享云南昆明旅居生活的点滴，记录美景、美食与健康生活方式。</textarea></label>
            <div class="article-share-thumb">${adminImg(cover, "分享图")}<button type="button" data-action="更换分享图">更换图片</button></div>
          </section>
        </aside>
        <aside class="article-edit-side">
          <section class="panel article-mobile-preview">
            <div class="panel-head"><h2>移动端预览</h2><span>${tag("移动端", "blue")} ${tag("PC端", "green")}</span></div>
            <div class="article-phone">
              <div class="article-phone-status">9:41</div>
              <h3>旅居生活的美好日常分享</h3>
              <p>云旅小编　2024-05-19 10:30　阅读 2,356</p>
              ${adminImg(cover, "移动端封面")}
              <p>在云南昆明的这段旅居时光里，每一天都充满了阳光与温暖。清晨，我们在湖边散步，呼吸着清新的空气。</p>
              <h4>一、健康生活，规律作息</h4>
              <div class="article-phone-card">${adminImg(activity, "推荐活动")}<span>晨练太极·健康每一天<br><em>翠湖公园 · 28人已报名</em></span><button type="button" data-action="查看详情">查看详情</button></div>
            </div>
          </section>
        </aside>
        <section class="panel article-comment-card">
          <h2>评论管理</h2>
          <p>开启评论 <span class="switch on"></span> <label><input type="checkbox" checked /> 需人工审核</label> <button type="button" data-action="查看评论">查看详情</button></p>
        </section>
        ${tablePanel("操作日志", [["2024-05-19 10:30", "管理员", "创建文章（草稿）", "成功"], ["2024-05-19 10:45", "张编辑", "编辑文章内容", "成功"], ["2024-05-19 11:02", "张编辑", "提交审核", "成功"]], ["时间", "操作人", "操作内容", "结果"], "compact-table article-log-card")}
        ${tablePanel("版本历史", [["v1.3（当前）", "2024-05-19 11:02", "张编辑", "提交审核"], ["v1.2", "2024-05-19 10:52", "张编辑", "第三段内容优化"], ["v1.0", "2024-05-19 10:30", "管理员", "创建草稿"]], ["版本", "时间", "操作人", "说明"], "compact-table article-version-card")}
      </div>
    </div>
  `;
}

function renderActivityEditReference(page) {
  const activity = selectedAdminActivity();
  const cover = "/prototype/admin/assets/admin-activity-cover-ref.png";
  const gallery = [
    "/prototype/admin/assets/admin-activity-gallery-1.png",
    "/prototype/admin/assets/admin-activity-gallery-2.png",
    "/prototype/admin/assets/admin-activity-gallery-3.png",
    "/prototype/admin/assets/admin-activity-gallery-4.png",
    "/prototype/admin/assets/admin-activity-gallery-5.png",
    "/prototype/admin/assets/admin-activity-gallery-6.png",
  ];
  return `
    <div class="admin-activity-edit-ref">
      ${pageHead(page, `
        <button class="btn ghost" data-action="预览">${icons.eye}预览</button>
        <button class="btn ghost" data-action="保存草稿">${icons.save}保存草稿</button>
        <button class="btn primary" data-action="发布活动">${icons.send}发布活动</button>
      `)}
      <div class="activity-edit-layout">
        <main class="activity-edit-main">
          <section class="panel edit-card edit-basic">
            <h2><span>1</span> 基础信息</h2>
            <div class="edit-basic-ref-grid">
              <label class="wide"><b>活动名称</b><input value="${activity.title}" /></label>
              <label class="wide"><b>活动分类</b><div class="edit-pill-selector">${["文化体验", "康养健身", "休闲娱乐", "自然观光", "学习讲座"].map((item) => `<button class="${activity.type === item ? "active" : ""}" type="button" data-action="选择活动分类：${item}">${item}</button>`).join("")}</div></label>
              <label><b>活动状态</b><input value="${activity.status}" /></label>
              <label><b>城市</b><input value="${activity.city}市" /></label>
              <label class="wide"><b>活动地点</b><input value="${activity.place}" /></label>
              <label class="wide"><b>详细地址（可选）</b><input value="${activity.place}集合点" /></label>
              <label><b>活动时间</b><input value="${activity.time}" /></label>
              <label><b>报名截止时间</b><input value="2024-05-23　18:00" /></label>
              <label><b>适合年龄</b><input value="50-80岁" /></label>
              <label><b>人数上限</b><div class="edit-number-step"><button type="button" data-action="减少人数">-</button><input value="${activity.signup.split("/")[1] || "30"}" /><button type="button" data-action="增加人数">+</button><span>人</span></div></label>
              <label><b>费用金额</b><input value="￥88.00　元/人" /></label>
              <label><b>费用类型</b><div class="edit-radio-row"><button type="button" data-action="费用免费">免费</button><button class="active" type="button" data-action="费用收费">收费</button></div></label>
            </div>
            <div class="chip-row">${[activity.type, activity.city, activity.status, "适老活动"].map((item, index) => tag(item, index === 1 ? "blue" : "green")).join("")}<button class="edit-add-tag" type="button" data-action="添加标签">+ 添加标签</button></div>
            <div class="edit-intro-block">
              <b>活动介绍</b>
              <div class="editor-bar"><button>B</button><button>I</button><button>U</button><button>列表</button><button>链接</button><button>图片</button></div>
              <textarea>${activity.title}将在${activity.place}开展，当前报名 ${activity.signup}，分类为${activity.type}。后台可在此维护活动介绍、报名规则、推荐位和发布状态。</textarea>
              <em>85/1000</em>
            </div>
          </section>

          <section class="panel edit-card edit-cover">
            <h2><span>2</span> 封面图片</h2>
            <div class="edit-cover-preview">${adminImg(cover, "活动封面")}</div>
            <button class="edit-cover-upload-box" type="button" data-action="上传封面">+<br>上传封面</button>
            <div class="edit-gallery">
              ${gallery.map((image, index) => `<figure>${adminImg(image, `活动图片${index + 1}`)}<button type="button" data-action="管理图片">${index === 0 ? "封面" : "编辑"}</button></figure>`).join("")}
              <button class="edit-gallery-add" type="button" data-action="上传更多">+<br>上传更多</button>
            </div>
          </section>

          <section class="panel edit-card edit-desc">
            <h2><span>3</span> 详情描述</h2>
            <div class="editor-bar"><button>B</button><button>I</button><button>图片</button><button>链接</button><button>列表</button></div>
            <textarea>活动包含热身、基础太极招式练习、放松拉伸与社群交流，现场配备志愿者协助，适合旅居长者晨间锻炼。</textarea>
          </section>

          <section class="panel edit-card edit-map">
            <h2><span>4</span> 服务区域</h2>
            <div class="edit-map-box"><span>${activity.city}市 · ${activity.place}</span><i></i></div>
            <div class="edit-form-grid small">
              <label><b>经度</b><input value="102.706376" /></label>
              <label><b>纬度</b><input value="25.043123" /></label>
            </div>
          </section>

          <section class="panel edit-card edit-rules">
            <h2><span>5</span> 报名规则</h2>
            <div class="edit-rule-grid">
              ${[
                ["免费报名", "开启"],
                ["需要审核", "关闭"],
                ["活动前提醒", "开启"],
                ["报名截止", "活动开始前 24 小时"],
              ].map(([name, state]) => `<label><b>${name}</b><button class="${state === "开启" ? "on" : ""}" type="button" data-action="${name}">${state}</button></label>`).join("")}
            </div>
            <div class="edit-form-grid small">
              <label><b>排序权重</b><input value="80" /></label>
              <label><b>推荐位置</b><input value="首页活动推荐" /></label>
            </div>
          </section>

          <section class="panel edit-card edit-contact">
            <h2><span>6</span> 联系方式</h2>
            <div class="edit-form-grid">
              <label><b>联系人</b><input value="活动运营员" /></label>
              <label><b>联系电话</b><input value="138****5678" /></label>
              <label><b>备用电话</b><input value="0871-****1234" /></label>
              <label><b>核销时间</b><input value="08:30-18:00" /></label>
            </div>
          </section>
        </main>

        <aside class="activity-edit-side">
          <section class="panel edit-phone-card">
            <div class="panel-head"><h2>用户端预览</h2><span class="right">${tag("移动端", "blue")} ${tag("PC端", "green")}</span></div>
            <div class="edit-phone-preview">
              ${adminImg(cover, "晨练太极")}
              <div>
                <h3>${activity.title}</h3>
                <p>${tag(activity.status, "green")} ${tag(activity.type, "blue")} ${tag(activity.city, "orange")}</p>
                <strong>￥88.00</strong><span>${activity.signup.split("/")[1] || "30"}人限额</span>
              </div>
            </div>
          </section>
          <section class="panel edit-check-card">
            <h2>信息完整度检查 <small>10/11</small></h2>
            ${["活动名称", "活动分类", "活动地点", "活动时间", "封面图片", "报名规则", "联系方式", "内容合规"].map((item, index) => `<p><i class="${index === 7 ? "warn" : ""}"></i>${item}<span>${index === 7 ? "待确认" : "已完善"}</span></p>`).join("")}
          </section>
          <section class="panel edit-actions-card">
            <h2>内容发布检查</h2>
            <p>保存草稿后可继续编辑，发布后同步到用户端活动地图与首页推荐。</p>
            <button class="btn primary" type="button" data-action="保存并发布">保存并发布</button>
          </section>
        </aside>
      </div>
    </div>
  `;
}

function formBasicRows(page) {
  if (page.id === "guide-create") {
    return [
      ["姓名", "李向导"],
      ["所属城市", "昆明市"],
      ["服务类别", "医疗卫生 / 康养护理 / 生活服务"],
      ["状态", "草稿"],
      ["联系电话", "138****5678"],
      ["紧急联系人", "李女士 139****2468"],
    ];
  }
  if (page.id === "activity-edit") {
    return [
      ["活动名称", "晨练太极·健康每一天"],
      ["活动城市", "昆明市"],
      ["活动类型", "康养活动 / 社群交流 / 户外运动"],
      ["发布状态", "草稿"],
      ["活动时间", "2024-05-20 07:30"],
      ["报名上限", "50 人"],
    ];
  }
  if (page.id.includes("order")) {
    return [
      ["订单名称", "陪伴就医服务订单"],
      ["所属城市", "昆明市"],
      ["服务类别", "陪伴就医 / 出行协助"],
      ["状态", "待确认"],
    ];
  }
  return [
    ["名称", "居家护理服务"],
    ["所属城市", "昆明市"],
    ["服务类别", "医疗卫生 / 康养护理 / 生活服务"],
    ["状态", "草稿"],
  ];
}

function formTags(page) {
  if (page.id === "guide-create") return ["陪伴就医", "生活陪伴", "旅游讲解", "应急协助"];
  if (page.id === "activity-edit") return ["康养活动", "太极晨练", "免费报名", "适老社交"];
  if (page.id.includes("order")) return ["陪伴就医", "医院接送", "家属通知", "待确认"];
  return ["居家护理", "康复理疗", "术后康复", "慢病管理"];
}

function formStepper(steps, active = 1) {
  return `
    <section class="form-stepper panel">
      ${steps.map((step, index) => `<div class="step ${index + 1 === active ? "active" : index + 1 < active ? "done" : ""}"><b>${index + 1}</b><span>${step}</span></div>`).join("")}
    </section>
  `;
}

function renderRules(page) {
  return `
    ${pageHead(page)}
    <div class="grid kpi-grid five">${kpis(["已启用规则", "自动派单率", "平均响应", "人工干预", "超时预警"], 5)}</div>
    <div class="settings-layout" style="margin-top:14px">
      <div class="panel">
        <div class="panel-head"><h2>规则列表（8条）</h2><span class="right">${button("新增", "plus")}</span></div>
        <div class="rule-list">
          ${["陪伴就医高优先级", "导游游览距离优先", "护工护理资质优先", "紧急诉求响应"].map((name, i) => `
            <div class="rule-item ${i === 0 ? "active" : ""}">
              <strong>${name}</strong>
              <div class="muted small">优先级：${i + 1}　适用服务：${i === 0 ? "陪伴就医" : "全量服务"}</div>
              <div style="display:flex;justify-content:space-between;align-items:center">${tag(i === 3 ? "已停用" : "已启用", i === 3 ? "orange" : "green")}<button class="toggle ${i === 3 ? "" : "on"}"></button></div>
            </div>`).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>规则编辑 - 陪伴就医高优先级</h2><span class="right">${tag("已启用", "green")}</span></div>
        <div class="form-body">
          ${ruleCondition("服务类型", "等于", "陪伴就医")}
          ${ruleCondition("紧急程度", "等于", "高")}
          ${ruleCondition("距离半径", "小于等于", "10 公里")}
          ${ruleCondition("评分阈值", "大于等于", "4.5 分")}
          <h3 class="panel-title">评分权重设置</h3>
          ${sliderRow("距离（越近得分越高）", "40%")}
          ${sliderRow("评分（服务评分）", "30%")}
          ${sliderRow("负载（当前接单量越少越好）", "15%")}
          ${sliderRow("响应速度（平均响应时间）", "10%")}
          ${sliderRow("价格（相对合理价格）", "5%")}
          <h3 class="panel-title">其他配置</h3>
          <div class="chip-row">${tag("自动派单开关", "blue")} <button class="toggle on"></button> ${tag("限制同一用户重复派单", "blue")} <button class="toggle on"></button></div>
        </div>
      </div>
      <div class="grid">
        ${dispatchRecommend("模拟测试")}
        ${routePreview()}
      </div>
    </div>
    <div class="grid section-grid three" style="margin-top:14px">
      ${tablePanel("规则执行日志", dispatchLogRows(), ["时间", "类型", "任务编号", "内容", "操作人"])}
      ${tablePanel("规则冲突检测", [["陪伴就医高优先级", "紧急订单快速响应", "条件均可匹配高优先订单", "调整优先级"], ["护工护理资质优先", "距离优先（通用）", "评分权重配置冲突", "调整权重"]], ["冲突规则A", "冲突规则B", "冲突描述", "建议处理"])}
      ${infoPanel("规则版本信息", [["当前版本", "v2.3.0"], ["发布时间", "2024-05-18 16:30"], ["发布人", "管理员"], ["变更说明", "优化陪伴就医匹配逻辑"]])}
    </div>
  `;
}

function renderSettings(page) {
  if (page.id === "service-pricing") return renderServicePricingSettings(page);
  if (page.id === "exception-review") return renderExceptionReviewSettings(page);
  if (page.id === "policy") return renderPolicySettings(page);
  if (page.id === "config") return renderSystemConfigSettings(page);
  const activeCategory = activeSettingsCategory(page);
  const activeDetail = settingsCategoryDetail(activeCategory);
  return `
    ${pageHead(page)}
    <div class="grid kpi-grid five" data-settings-kpis>${settingsKpis(activeDetail)}</div>
    <div class="settings-layout" style="margin-top:14px" data-settings-page="${page.id}">
      <div class="panel">
        <div class="panel-head"><h2>配置分类</h2></div>
        <div class="permission-tree settings-category-tree">
          ${settingsConfigCategories.map((item, i) => `
            <button class="tree-row ${item === activeCategory ? "active is-active" : ""}" type="button" data-action="选择配置分类：${item}" data-admin-settings-category="${item}" aria-label="配置分类${i + 1}：${item}" aria-pressed="${item === activeCategory ? "true" : "false"}">
              <span class="settings-category-index">${i + 1}</span><span class="settings-category-name">${item}</span>
            </button>
          `).join("")}
        </div>
      </div>
      <div class="panel" data-settings-detail-panel>${settingsCategoryDetailPanel(page, activeCategory)}</div>
      <div class="grid" data-settings-side-panel>${settingsCategorySidePanel(page, activeCategory)}</div>
    </div>
  `;
}

function activeSettingsCategory(page = currentPage()) {
  const category = settingsCategoryState.activeByPage[page?.id] || settingsConfigCategories[0];
  return settingsConfigCategories.includes(category) ? category : settingsConfigCategories[0];
}

function settingsCategoryDetail(category = settingsConfigCategories[0]) {
  return settingsCategoryDetails[category] || settingsCategoryDetails[settingsConfigCategories[0]];
}

function settingsCategoryKey(page, category) {
  return `${page?.id || "settings"}:${category}`;
}

function settingsCategorySavedText(page, category) {
  const savedAt = settingsCategoryState.savedAtByPageCategory[settingsCategoryKey(page, category)];
  return savedAt ? `已保存 ${savedAt}` : "当前修改未保存";
}

function settingsCategorySwitches(page, category) {
  const key = settingsCategoryKey(page, category);
  const current = settingsCategoryState.switchesByPageCategory[key];
  if (current) return current;
  const detail = settingsCategoryDetail(category);
  settingsCategoryState.switchesByPageCategory[key] = detail.switches.map(([label, enabled]) => [label, enabled]);
  return settingsCategoryState.switchesByPageCategory[key];
}

function settingsKpis(detail = settingsCategoryDetail()) {
  const page = currentPage();
  const category = activeSettingsCategory(page);
  const switches = settingsCategorySwitches(page, category);
  const items = [
    ["启用配置", detail.count],
    ["启用开关", switches.filter((item) => item[1]).length],
    ["配置状态", detail.status],
    ["最近更新", detail.updated],
    ["风险等级", detail.checks.some((item) => /待|风险|异常/.test(item[1])) ? "需关注" : "低"],
  ];
  const palette = ["blue", "green", "purple", "orange", "red"];
  return items.map(([title, value], index) => {
    const color = colors[palette[index]];
    return `
      <div class="kpi-card">
        <div class="kpi-icon" style="--icon-a:${color[0]};--icon-b:${color[1]}">${metricIcon(index)}</div>
        <div>
          <div class="kpi-title">${title}</div>
          <div class="kpi-value">${value}</div>
          <div class="kpi-trend">配置分类 <span class="up">已联动</span></div>
        </div>
      </div>
    `;
  }).join("");
}

function settingsCategoryDetailPanel(page, category) {
  const detail = settingsCategoryDetail(category);
  const switches = settingsCategorySwitches(page, category);
  return `
    <div class="panel-head">
      <h2>${page.title}明细</h2>
      <span class="right" data-settings-category-current>${category}</span>
      <button class="btn primary" type="button" data-action="保存配置分类" data-admin-settings-save>${icons.save}<span>保存</span></button>
    </div>
    <div class="form-body admin-settings-detail" data-settings-category-detail="${category}">
      ${formLine("配置名称", `${page.title} · ${category}`)}
      ${formLine("负责角色", detail.owner)}
      ${formLine("适用范围", detail.scope)}
      ${formLine("最近更新", detail.updated)}
      <div class="form-row"><label>规则说明</label><textarea class="textarea">${detail.description}</textarea></div>
      <div class="chip-row">${["启用审核", "操作留痕", "异常预警", "权限隔离", "实时同步"].map((item, i) => tag(item, ["blue", "green", "orange", "purple", "red"][i])).join("")}</div>
      <div class="admin-settings-field-grid">
        ${detail.fields.map(([label, value]) => `<div class="admin-settings-field"><span>${label}</span><strong>${value}</strong></div>`).join("")}
      </div>
      <div class="admin-settings-switch-list">
        ${switches.map(([label, enabled]) => `
          <div class="tree-row admin-settings-switch-row" data-settings-switch-row>
            <strong>${label}</strong>
            <button class="toggle ${enabled ? "on" : ""}" type="button" data-action="切换配置项：${label}" data-admin-settings-switch="${label}" aria-pressed="${enabled ? "true" : "false"}"></button>
            <span class="muted">${enabled ? "已启用" : "已停用"}</span>
          </div>
        `).join("")}
      </div>
      ${detail.sliders.map(([label, value]) => sliderRow(label, value)).join("")}
      <p class="admin-settings-save-state" data-settings-save-state>${settingsCategorySavedText(page, category)}</p>
    </div>
  `;
}

function settingsCategorySidePanel(page, category) {
  const detail = settingsCategoryDetail(category);
  return `
    ${infoPanel(`${category}校验`, detail.checks)}
    ${settingsCategoryFeedPanel(page, category)}
    ${settingsCategorySuggestionPanel(category, detail)}
  `;
}

function settingsCategoryFeedPanel(page, category) {
  const savedAt = settingsCategoryState.savedAtByPageCategory[settingsCategoryKey(page, category)] || "未保存";
  const rows = [
    ["选", `${category}已载入`, `右侧明细正在展示${category}`, "刚刚", "#4d94ff"],
    ["改", "开关状态", "点击开关会实时改变当前配置项状态", "当前", "#20be70"],
    ["存", "保存状态", savedAt === "未保存" ? "当前分类存在未保存修改" : `${category}已保存于 ${savedAt}`, savedAt, "#ffad24"],
  ];
  return `
    <section class="panel">
      <div class="panel-head"><h2>配置变更记录</h2><span class="right"><button class="link" data-action="查看版本">查看更多 ${chevron("right")}</button></span></div>
      <div class="feed-list">
        ${rows.map(([avatar, title, desc, time, color]) => `
          <div class="feed-item"><span class="avatar" style="background:${color}">${avatar}</span><div><strong>${title}</strong><p>${desc}</p></div><time>${time}</time></div>
        `).join("")}
      </div>
    </section>
  `;
}

function settingsCategorySuggestionPanel(category, detail) {
  const concern = detail.checks.find((item) => /待|风险|异常/.test(item[1]));
  const suggestions = concern
    ? [[`${category}存在待关注项`, `${concern[0]} 当前状态为「${concern[1]}」，建议保存前复核。`], ["发布建议", "建议先保存配置，再进入版本记录查看差异。"]]
    : [[`${category}运行稳定`, "当前配置校验通过，可按需保存并发布。"], ["发布建议", "保存后会记录到配置变更记录，便于审计和回滚。"]];
  return `
    <section class="panel">
      <div class="panel-head"><h2>配置建议</h2></div>
      <div class="detail-list">
        ${suggestions.map(([title, desc], index) => `<div class="panel pad" style="box-shadow:none"><strong>${tag(index === 0 && concern ? "关注" : "建议", index === 0 && concern ? "orange" : "green")} ${title}</strong><p class="muted" style="margin:8px 0 0">${desc}</p></div>`).join("")}
      </div>
    </section>
  `;
}

function settingsTabs(items, active = 0) {
  return `<section class="panel settings-tabs">${items.map((item, i) => `<button class="tab ${i === active ? "active" : ""}">${item}</button>`).join("")}</section>`;
}

function renderCategoryTree(title, items, active = 0) {
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2><span class="right">${button("新增分类", "plus")}</span></div>
      <div class="permission-tree category-tree">
        ${items.map((item, i) => `
          <div class="tree-row ${i === active ? "active" : ""} ${item[2] ? "indent" : ""}">
            <span class="check">${item[2] ? "⌙" : "▾"}</span><span>${item[0]}</span><span class="muted small">${item[1]}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderServicePricingSettings(page) {
  return `
    ${pageHead(page, `${button("新增分类", "plus", "primary")} ${button("新增价格模板", "import")} ${button("保存配置", "save")} ${button("发布到前端", "send", "primary")}`)}
    ${settingsTabs(["服务分类", "价格模板", "预约规则", "合规说明"])}
    <div class="admin-grid pricing-layout">
      ${renderCategoryTree("服务分类树", [["全部分类", "12"], ["陪伴就医", "856"], ["挂号陪诊", "256", true], ["检查陪同", "198", true], ["取药送检", "142", true], ["导游游览", "968"], ["护理服务", "1,356"], ["接送出行", "612"], ["生活陪伴", "1,012"], ["医疗卫生", "856"], ["康养护理", "1,256"], ["交通出行", "612"], ["旅拍美食", "485"]], 1)}
      <section class="panel">
        <div class="panel-head"><h2>分类详情</h2><span class="right">${tag("用户端展示", "green")}</span></div>
        <div class="form-body">
          <div class="category-editor-head"><span class="admin-stat-icon blue">${icons.order}</span><div>${formLine("显示名称", "陪伴就医")}${formLine("内部编码", "ACCOMPANY_MED")}</div></div>
          ${formLine("排序权重", "10")}
          <div class="form-row"><label>图标</label><div class="chip-row"><span class="admin-stat-icon blue small">${icons.order}</span><button class="btn">更换图标</button></div></div>
          <div class="tree-row"><strong>用户端显示</strong><button class="toggle on"></button><span class="muted">已启用，在用户端服务分类页面展示</span></div>
          <div class="form-row"><label>必填下单信息</label><div class="chip-row">${["预约老人信息", "服务时间", "服务地址", "就诊医院"].map((item) => tag(item, "blue")).join("")}${tag("特殊需求", "orange")}</div></div>
          <div class="form-row"><label>适用提供方</label><div class="chip-row">${["人工向导", "商户服务"].map((item) => tag(item, "green")).join("")}${tag("自营服务", "blue")}</div></div>
          <div class="form-row"><label>分类描述</label><textarea class="textarea">提供陪同挂号、检查陪同、取药送检、就医咨询等服务，帮助老人便捷就医。</textarea></div>
          <div class="form-row"><label>合规说明</label><textarea class="textarea">服务人员需具备基础医疗常识与良好沟通能力，不提供诊断、医疗建议及处方相关服务。</textarea></div>
        </div>
      </section>
      <div class="grid">
        ${miniTable("价格模板 - 陪伴就医标准模板（v2.3）", [["基础价", "按次", "120.00", "80.00", "200.00", "否", "编辑"], ["小时价", "按小时", "80.00", "50.00", "150.00", "否", "编辑"], ["公里价", "按公里", "3.00", "2.00", "8.00", "否", "编辑"], ["夜间加价", "按次", "30.00", "20.00", "50.00", "是", "编辑"], ["紧急服务费", "按次", "50.00", "30.00", "100.00", "是", "编辑"]], ["价格项", "计价方式", "默认价", "最小值", "最大值", "需审核", "操作"])}
        <section class="panel">
          <div class="panel-head"><h2>默认组合套餐（可选）</h2></div>
          <div class="price-package-grid">
            ${[["标准陪诊套餐", "基础价 + 2小时", "¥280.00", "主推"], ["检查陪同套餐", "基础价 + 3小时", "¥360.00", ""], ["半日陪诊套餐", "基础价 + 4小时", "¥440.00", ""], ["新建套餐", "+", "", ""]].map(([name, desc, price, mark], i) => `<div class="price-package ${i === 0 ? "active" : i === 3 ? "add" : ""}"><strong>${name}</strong><span>${desc}</span><b>${price}</b>${mark ? tag(mark, "green") : ""}</div>`).join("")}
          </div>
        </section>
      </div>
    </div>
    <div class="admin-grid four">
      ${miniTable("下单字段配置", [["预约老人信息", "选择老人", "是", "1", "启用", "编辑"], ["服务时间", "日期时间", "是", "2", "启用", "编辑"], ["服务地址", "地址选择", "是", "3", "启用", "编辑"], ["就诊医院", "医院选择", "是", "4", "启用", "编辑"], ["病情描述", "多行文本", "否", "5", "停用", "启用"]], ["字段名称", "字段类型", "是否必填", "排序", "状态", "操作"])}
      ${phonePreview(page).replace("用户端预览", "用户端展示预览")}
      ${infoPanel("审核与发布", [["当前版本", "v2.3.0"], ["上次发布", "2024-05-15 14:30"], ["发布状态", "已发布"], ["生效范围", "全部城市"]])}
      ${infoPanel("风险与校验结果", [["价格项最小值校验", "通过"], ["价格合理性校验", "通过"], ["合规说明完整性", "通过"], ["必填字段配置", "通过"]])}
    </div>
    <div class="admin-grid two">
      ${miniTable("操作日志（最近10条）", systemRows(), ["时间", "操作人", "操作内容", "IP地址", "结果"])}
      ${infoPanel("关联服务数量统计", [["总服务数", "856"], ["已上架", "742"], ["待审核", "68"], ["已下架", "46"]])}
    </div>
  `;
}

function renderExceptionReviewSettings(page) {
  return `
    ${pageHead(page, `${button("生成复盘报告", "save", "primary")} ${button("导出", "export")} ${button("配置归档", "import")} ${button("配置预规则", "system")}`)}
    ${adminStatCards([["save", "已关闭事件", "326", "较昨日 +18.2%", "blue"], ["clock", "平均处理时长", "12分36秒", "较昨日 -2分11秒", "green"], ["import", "复发事件", "8", "较昨日 +1", "orange"], ["chart", "误报率", "5.2%", "较昨日 -1.1%", "purple"], ["heart", "满意回访", "96%", "较昨日 +2.3%", "green"]])}
    <div class="panel" style="margin-top:14px">${filters("exception")}</div>
    ${settingsTabs(["全部归档（326）", "待复盘（28）", "已复盘（276）", "规则优化（12）"])}
    <div class="admin-grid exception-review-layout">
      <div class="grid">
        <div class="admin-grid two">
          ${linePanel("异常趋势（按类型）", ["设备离线", "摔倒检测"])}
          ${miniTable("已归档事件列表", [["EVT20240519001", "设备离线", "小云机器人V3.2", "高", "05-19 09:23", "05-19 09:35", "12分36秒", "已复盘", "查看"], ["EVT20240518088", "摔倒检测", "李奶奶（72岁）", "高", "05-18 16:28", "05-18 16:41", "13分05秒", "待复盘", "复盘"], ["EVT20240518072", "健康异常", "王爷爷（78岁）", "中", "05-18 14:52", "05-18 15:06", "14分12秒", "已复盘", "查看"]], ["事件编号", "类型", "对象", "级别", "发生时间", "关闭时间", "处理时长", "复盘状态", "操作"])}
        </div>
        <div class="admin-grid two">
          ${mapPanel(false)}
          ${donutPanel("处理时长分布", "总事件数", "326", [{ name: "0-10分钟", value: 42, text: "42.3%（138）", color: "#176bff" }, { name: "10-30分钟", value: 36, text: "36.2%（118）", color: "#20be70" }, { name: "30分钟-2小时", value: 14, text: "14.1%（46）", color: "#8056e8" }, { name: "2小时以上", value: 8, text: "7.4%（24）", color: "#ff5252" }])}
        </div>
      </div>
      <aside class="grid">
        ${infoPanel("事件详情：EVT20240518088", [["事件类型", "摔倒检测"], ["级别", "高"], ["来源设备", "小云机器人 V3.2"], ["发生时间", "2024-05-18 16:28:14"], ["关闭时间", "2024-05-18 16:41:19"], ["处理时长", "13分05秒"]])}
        ${timelinePanel("处理过程摘要", true)}
        ${infoPanel("关联信息", [["关联用户", "李奶奶（72岁）"], ["关联订单", "DD20240518077 陪伴就医服务"], ["关联设备", "小云机器人 V3.2"]])}
        ${infoPanel("改进建议（AI 推荐）", [["建议1", "完善居家安全检查"], ["建议2", "开启30秒自动外呼提醒"], ["建议3", "优先通知紧急联系人"]])}
      </aside>
    </div>
    <div class="admin-grid three">
      ${miniTable("SOP 改进清单（基于本类事件）", [["语音呼叫安全指引", "12", "进行中", "客服部-陈小明", "2024-06-10"], ["摔倒检测算法优化", "8", "已完成", "技术部-李强", "2024-05-15"], ["紧急联系人多通道通知", "7", "进行中", "产品部-王芳", "2024-06-05"]], ["改进项", "关联事件数", "状态", "负责人", "目标完成时间"])}
      ${reviewDecisionPanel("审核记录", ["需优化", "合格", "优秀"])}
      ${miniTable("操作日志（本事件）", systemRows(), ["时间", "操作人", "操作内容", "IP地址", "结果"])}
    </div>
  `;
}

function renderPolicySettings(page) {
  const policyRows = policyRowsForAdmin();
  return `
    <div class="admin-policy-ref">
    <div class="admin-banner-actions">
      <span></span>
      ${button("新增指南", "plus", "primary")}
      ${button("批量发布", "send")}
      ${button("导入文档", "import")}
      ${button("导出", "export")}
    </div>
    ${adminStatCards([["content", "指南总数", "86", "较昨日 +3", "blue"], ["send", "已发布", "72", "较昨日 +2", "green"], ["clock", "待审核", "9", "较昨日 -1", "orange"], ["eye", "今日阅读", "3,260", "较昨日 +12.5%", "purple"], ["heart", "收藏", "428", "较昨日 +8.7%", "blue"]])}
    <div class="panel">${filters("policy")}</div>
    <div class="admin-grid policy-layout">
      <aside class="grid">
        ${renderCategoryTree("分类目录", [["全部分类", "86"], ["旅居政策", "28"], ["国家政策", "8", true], ["云南政策", "12", true], ["昆明政策", "8", true], ["安全指南", "15"], ["医疗医保", "18"], ["交通出行", "9"], ["生活服务", "12"], ["养老服务", "6"], ["文旅融合", "4"]])}
        ${tagPanel("热门标签", ["旅居补贴", "长期居住", "医保报销", "异地就医", "养老服务", "高原健康", "交通优惠", "证件办理"])}
      </aside>
      ${miniTable(`指南列表（共 ${policyRows.length} 条）`, policyRows, ["标题", "分类", "适用城市", "阅读量", "收藏量", "状态", "更新时间", "操作"])}
      <section class="panel policy-editor">
        <div class="panel-head"><h2>昆明旅居政策解读（2024最新版）</h2><span class="right"><button class="link">关闭</button></span></div>
        ${settingsTabs(["基本信息", "内容编辑", "SEO设置", "关联推荐", "数据统计"])}
        <div class="form-body">
          ${formLine("标题", "昆明旅居政策解读（2024最新版）")}
          ${formLine("副标题", "长居旅居昆明必读政策汇总")}
          <div class="form-row"><label>分类</label><div class="chip-row">${tag("旅居政策", "blue")} ${tag("昆明政策", "green")}</div></div>
          <div class="form-row"><label>适用城市</label><div class="chip-row">${tag("昆明市", "blue")} ${tag("云南省", "blue")}</div></div>
          <div class="form-row"><label>内容摘要</label><textarea class="textarea">全面解读昆明市针对旅居老人在医疗、交通、文化等方面的最新政策。</textarea></div>
          <div class="editor-toolbar"><b>B</b><i>I</i><span>U</span><span>≡</span><span>“”</span><span>🔗</span><span>▦</span></div>
          <div class="rich-editor"><strong>一、住房政策</strong><br>符合条件的旅居老人可申请租房补贴，最高 600 元/月。<br><br><strong>二、医疗保障</strong><br>可直接在昆明定点医院就医，医保报销比例与本地一致。</div>
          ${formLine("来源", "昆明市民政局官网")}
          <div class="form-row"><label>发布状态</label><div class="chip-row">${tag("所有用户", "blue")} ${tag("登录用户", "green")} ${tag("指定用户组", "orange")}</div></div>
        </div>
      </section>
    </div>
    <div class="admin-grid four">
      ${timelinePanel("审核与发布记录", true)}
      ${miniTable("版本历史", [["v1.3（当前）", "2024-05-18 10:23", "管理员", "更新部分政策内容"], ["v1.2", "2024-04-12 09:15", "王编辑", "新增医保补贴政策说明"], ["v1.1", "2024-03-20 14:10", "张编辑", "初版发布"]], ["版本号", "更新时间", "更新人", "更新说明"])}
      ${phonePreview(page).replace("用户端预览", "前端预览")}
      ${infoPanel("合规提示", [["已标注政策来源", "昆明市民政局官网"], ["已填写生效时间", "2024-01-01"], ["已填写更新时间", "2024-05-18"], ["内容合规检测", "通过"]])}
    </div>
    </div>
  `;
}

function renderSystemConfigSettings(page) {
  const config = adminConfigData();
  const notice = adminConfigState.error
    ? `<div class="permission-notice error">系统配置读取失败：${escapeHtml(adminConfigState.error)}</div>`
    : adminConfigState.notice
      ? `<div class="permission-notice">${escapeHtml(adminConfigState.notice)}</div>`
      : "";
  const releaseRows = (config.releaseLogs || []).map((item) => [
    item.version,
    item.time,
    item.operator,
    item.environment,
    item.status,
  ]);
  const rollbackRows = (config.rollbackVersions || []).map((item) => [item.version, item.time, item.action]);
  const changeRows = (config.changeLogs || []).map((item) => [
    item.time,
    item.actor,
    item.module,
    item.field,
    item.before,
    item.after,
    item.type,
  ]);
  const validationRows = (config.validation || []).map((item) => [item.item, item.status]);
  return `
    ${pageHead(page, `${button("保存配置", "save", "primary")} ${button("发布配置", "send", "green")} ${button("恢复默认", "clock")} <button class="btn" type="button" data-action="查看版本" data-admin-config-version-link>${icons.eye}<span>查看版本</span></button>`)}
    ${notice}
    ${adminConfigState.loading ? `<section class="panel"><p class="muted">正在读取系统配置...</p></section>` : ""}
    <section class="panel admin-config-unified-panel">
      <div class="panel-head">
        <h2>系统配置项</h2>
        <span class="right muted">基础参数、AI模型、安全策略、业务开关统一编辑</span>
      </div>
      <div class="admin-config-unified-grid">
          ${adminConfigUnifiedGroup("basic", "平台信息", `
            ${adminConfigField("平台名称", "platform.name", config.platform?.name)}
            ${adminConfigField("平台简称", "platform.shortName", config.platform?.shortName)}
            <div class="form-row"><label>平台Logo</label><div class="logo-upload admin-config-logo">${adminConfigLogoPreview(config.platform?.logo)}${adminConfigField("Logo路径", "platform.logo", config.platform?.logo).replace('<div class="form-row admin-config-field">', '<div class="admin-config-logo-field">')}<button class="btn" type="button" data-action="更换平台Logo">更换</button><button class="btn" type="button" data-action="删除平台Logo">删除</button></div></div>
            ${adminConfigField("版权信息", "platform.copyright", config.platform?.copyright)}
            ${adminConfigField("平台版本", "platform.appVersion", config.platform?.appVersion)}
          `)}
          ${adminConfigUnifiedGroup("map", "城市与服务区域", `
            ${adminConfigField("默认城市", "serviceArea.defaultCities", adminConfigCsv(config.serviceArea?.defaultCities))}
            ${adminConfigField("服务区域范围", "serviceArea.rangeTypes", adminConfigCsv(config.serviceArea?.rangeTypes))}
            ${adminConfigField("地图服务商", "serviceArea.mapProvider", config.serviceArea?.mapProvider)}
            ${adminConfigField("地图API Key", "serviceArea.mapApiKey", config.serviceArea?.mapApiKey)}
            ${adminConfigField("定位精度", "serviceArea.positioningAccuracy", config.serviceArea?.positioningAccuracy)}
          `)}
          ${adminConfigUnifiedGroup("ai", "AI智能管家", `
            ${adminConfigCheckbox("启用大模型", "aiSteward.enabled", config.aiSteward?.enabled)}
            ${adminConfigField("模型服务商", "aiSteward.provider", config.aiSteward?.provider)}
            ${adminConfigField("API Base URL", "aiSteward.apiBase", config.aiSteward?.apiBase)}
            ${adminConfigField("大模型API Key", "aiSteward.apiKey", config.aiSteward?.apiKey)}
            ${adminConfigField("模型名称", "aiSteward.model", config.aiSteward?.model)}
            ${adminConfigField("请求超时", "aiSteward.timeoutMs", config.aiSteward?.timeoutMs, "number", "毫秒")}
            ${adminConfigField("温度参数", "aiSteward.temperature", config.aiSteward?.temperature, "number")}
            ${adminConfigField("最大输出", "aiSteward.maxTokens", config.aiSteward?.maxTokens, "number", "tokens")}
          `)}
          ${adminConfigUnifiedGroup("order", "订单规则", `
            ${adminConfigField("自动取消时间", "orderRules.autoCancelMinutes", config.orderRules?.autoCancelMinutes, "number", "分钟")}
            ${adminConfigField("服务确认超时", "orderRules.confirmTimeoutMinutes", config.orderRules?.confirmTimeoutMinutes, "number", "分钟")}
            ${adminConfigField("评价期限", "orderRules.reviewDays", config.orderRules?.reviewDays, "number", "天")}
            ${adminConfigField("改期申请时间", "orderRules.rescheduleHours", config.orderRules?.rescheduleHours, "number", "小时")}
            ${adminConfigField("订单保留天数", "orderRules.retentionDays", config.orderRules?.retentionDays, "number", "天")}
          `)}
          ${adminConfigUnifiedGroup("sos", "SOS规则", `
            ${adminConfigField("通知链路", "sosRules.chain", config.sosRules?.chain)}
            ${adminConfigField("二次提醒间隔", "sosRules.secondReminderMinutes", config.sosRules?.secondReminderMinutes, "number", "分钟")}
            ${adminConfigField("升级时间", "sosRules.escalationMinutes", config.sosRules?.escalationMinutes, "number", "分钟")}
            ${adminConfigField("响应SLA", "sosRules.responseSlaMinutes", config.sosRules?.responseSlaMinutes, "number", "分钟")}
            ${adminConfigField("应急联系人最大数量", "sosRules.maxEmergencyContacts", config.sosRules?.maxEmergencyContacts, "number", "人")}
          `)}
          ${adminConfigUnifiedGroup("device", "设备模拟数据", `
            ${adminConfigCheckbox("模拟数据开关", "deviceSimulation.enabled", config.deviceSimulation?.enabled)}
            ${adminConfigField("模拟设备数量", "deviceSimulation.deviceCount", config.deviceSimulation?.deviceCount, "number", "台")}
            ${adminConfigField("数据刷新间隔", "deviceSimulation.refreshSeconds", config.deviceSimulation?.refreshSeconds, "number", "秒")}
            ${adminConfigField("数据类型", "deviceSimulation.dataTypes", adminConfigCsv(config.deviceSimulation?.dataTypes))}
          `)}
          ${adminConfigUnifiedGroup("security", "隐私与医疗免责声明", `
            ${adminConfigField("隐私政策版本", "compliance.privacyVersion", config.compliance?.privacyVersion)}
            ${adminConfigField("医疗免责声明", "compliance.medicalDisclaimerVersion", config.compliance?.medicalDisclaimerVersion)}
            ${adminConfigField("用户协议版本", "compliance.userAgreementVersion", config.compliance?.userAgreementVersion)}
            ${adminConfigCheckbox("首次使用强制同意", "compliance.forceConsentOnFirstUse", config.compliance?.forceConsentOnFirstUse)}
          `)}
          ${adminConfigUnifiedGroup("business", "其他配置", `
            ${adminConfigCheckbox("新用户注册审核", "businessSwitches.userRegistrationReview", config.businessSwitches?.userRegistrationReview)}
            ${adminConfigCheckbox("商户入驻审核", "businessSwitches.merchantOnboardingReview", config.businessSwitches?.merchantOnboardingReview)}
            ${adminConfigCheckbox("向导资质审核", "businessSwitches.guideCertificationReview", config.businessSwitches?.guideCertificationReview)}
            ${adminConfigCheckbox("活动报名审核", "businessSwitches.activitySignupReview", config.businessSwitches?.activitySignupReview)}
            ${adminConfigField("价格显示模式", "businessSwitches.priceDisplayMode", config.businessSwitches?.priceDisplayMode)}
            ${adminConfigCheckbox("系统维护模式", "businessSwitches.maintenanceMode", config.businessSwitches?.maintenanceMode)}
          `)}
      </div>
    </section>
    <div class="admin-grid two" data-admin-config-version-records>
      ${miniTable("最近发布记录", releaseRows, ["版本", "时间", "发布人", "环境", "状态"])}
      ${miniTable("回滚版本", rollbackRows, ["版本", "时间", "操作"])}
      ${miniTable("配置变更日志（最近10条）", changeRows, ["时间", "变更人", "模块", "变更内容", "变更前", "变更后", "类型"])}
      ${miniTable("配置校验结果", validationRows, ["校验项", "结果"])}
    </div>
  `;
}

function renderPermission(page) {
  return `
    ${pageHead(page, "")}
    <div class="permission-page-layout permission-page-compact">
      <div class="permission-main-stack">
        ${renderPermissionSystemEntrances()}
        ${permissionPeoplePanel()}
        ${tablePanel("操作记录", operationLogRows(12), ["时间", "操作人", "操作内容", "IP地址", "结果"])}
      </div>
    </div>
    ${adminPermissionState.adding ? permissionPersonDialog() : ""}
  `;
}

function renderPermissionSystemEntrances() {
  const systemPages = [
    ["accounts", "账号管理", "后台账号、角色和登录安全", "users"],
    ["menus", "菜单权限配置", "菜单树、按钮权限和数据权限", "shield"],
    ["logs", "操作日志审计", "关键操作、IP、对象和结果", "clock"],
    ["config", "系统配置", "基础参数、安全策略和业务开关", "system"],
    ["notifications", "消息通知中心", "站内信、短信和触达回执", "bell"],
    ["ai-knowledge", "AI管家知识库", "知识库、问答测试和发布版本", "content"],
  ];
  return `
    <section class="panel permission-system-entry-panel">
      <div class="panel-head">
        <h2>系统权限入口</h2>
        <span class="right muted">点击进入对应系统管理页</span>
      </div>
      <div class="permission-system-entry-grid">
        ${systemPages.map(([route, title, desc, icon]) => `
          <button class="permission-system-entry" type="button" data-route="${route}">
            <span>${icons[icon] || icons.system}</span>
            <strong>${escapeHtml(title)}</strong>
            <em>${escapeHtml(desc)}</em>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function adminMenuConfigurablePages() {
  return pages.filter((item) => item.type !== "login");
}

function adminMenuPermissionPeople() {
  return adminPermissionState.people.length ? adminPermissionState.people : loadAdminPermissionPeople(defaultAdminPermissionPeople);
}

function currentAdminMenuPermissionPerson() {
  const people = adminMenuPermissionPeople();
  const preferred = adminMenuPermissionState.activeAccount
    || (adminPermissionState.activeAccount !== ADMIN_DEFAULT_ACCOUNT ? adminPermissionState.activeAccount : "")
    || people[0]?.account
    || ADMIN_DEFAULT_ACCOUNT;
  return people.find((person) => person.account === preferred) || people[0] || adminDefaultPerson();
}

function adminPersonHasAllMenuPermissions(person = {}) {
  const permissions = Array.isArray(person.permissions) ? person.permissions : [];
  return !permissions.length || permissions.includes("__all__");
}

function adminPersonHasMenuPage(person, page) {
  if (adminPersonHasAllMenuPermissions(person)) return true;
  const permissions = Array.isArray(person.permissions) ? person.permissions : [];
  return permissions.some((permission) => permissionValueMatches(permission, page));
}

function adminMenuButtonPermissions(person = {}) {
  if (Array.isArray(person.buttonPermissions) && person.buttonPermissions.length) return person.buttonPermissions;
  if (person.role === "审计员") return ["view", "export"];
  if (person.role === "运营管理") return ["view", "create", "edit", "audit", "export"];
  return ["view", "create", "edit", "delete", "import", "export", "audit", "publish"];
}

function renderMenuPermissionGroup(group, person) {
  const childPages = adminMenuConfigurablePages().filter((item) => item.group === group.id);
  if (!childPages.length) return "";
  const groupChecked = childPages.every((item) => adminPersonHasMenuPage(person, item));
  return `
    <article class="permission-menu-group admin-menu-permission-group">
      <label class="permission-menu-title">
        <input type="checkbox" name="permissions" value="group:${escapeHtml(group.id)}" ${groupChecked ? "checked" : ""} data-admin-menu-permission-group="${escapeHtml(group.id)}" />
        <strong>${escapeHtml(group.title)}</strong>
        <span>${childPages.filter((item) => adminPersonHasMenuPage(person, item)).length}/${childPages.length} 项</span>
      </label>
      <div class="permission-menu-items">
        ${childPages.map((item) => `
          <label>
            <input type="checkbox" name="permissions" value="${escapeHtml(item.id)}" ${adminPersonHasMenuPage(person, item) ? "checked" : ""} data-admin-menu-permission-page="${escapeHtml(group.id)}" />
            <span>${escapeHtml(item.title)}</span>
          </label>
        `).join("")}
      </div>
    </article>
  `;
}

function adminMenuPermissionMetric(title, value, hint, icon = "shield") {
  return `
    <article class="kpi-card" style="cursor:default">
      <div class="kpi-icon">${icons[icon] || icons.shield}</div>
      <div>
        <div class="kpi-title">${escapeHtml(title)}</div>
        <div class="kpi-value">${escapeHtml(value)}</div>
        <div class="kpi-trend"><span>${escapeHtml(hint)}</span></div>
      </div>
    </article>
  `;
}

function renderMenuPermissionSettings(page) {
  const people = adminMenuPermissionPeople();
  const person = currentAdminMenuPermissionPerson();
  const configurablePages = adminMenuConfigurablePages();
  const allowedPages = configurablePages.filter((item) => adminPersonHasMenuPage(person, item));
  const buttonPermissions = adminMenuButtonPermissions(person);
  const buttonOptions = [
    ["view", "查看"],
    ["create", "新增"],
    ["edit", "编辑"],
    ["delete", "删除"],
    ["import", "导入"],
    ["export", "导出"],
    ["audit", "审核"],
    ["publish", "发布"],
  ];
  const scopeOptions = ["昆明市", "弥勒市", "全平台", "只读审计"];
  return `
    ${pageHead(page, `
      <button class="btn primary" type="button" data-admin-menu-permission-action="save">${icons.save}<span>保存菜单权限</span></button>
      <button class="btn" type="button" data-admin-menu-permission-action="select-all">${icons.check}<span>全选</span></button>
      <button class="btn" type="button" data-admin-menu-permission-action="audit-template">只读审计模板</button>
      <button class="btn" type="button" data-admin-menu-permission-action="reset">恢复默认</button>
    `)}
    <div class="admin-grid four">
      ${adminMenuPermissionMetric("菜单总数", configurablePages.length, "覆盖管理后台全部页面", "shield")}
      ${adminMenuPermissionMetric("当前账号", person.name || "管理员", `${person.account || ADMIN_DEFAULT_ACCOUNT} · ${person.role || "系统管理员"}`, "user")}
      ${adminMenuPermissionMetric("已授权菜单", allowedPages.length, `共 ${configurablePages.length} 项`, "grid")}
      ${adminMenuPermissionMetric("按钮权限", buttonPermissions.length, "查看、新增、编辑、导出等", "system")}
    </div>
    ${adminMenuPermissionState.notice ? `<div class="permission-notice">${escapeHtml(adminMenuPermissionState.notice)}</div>` : ""}
    <div class="admin-grid config-layout admin-menu-permission-layout">
      <section class="panel">
        <div class="panel-head">
          <h2>菜单权限矩阵</h2>
          <span class="right muted"><b data-admin-menu-permission-selected-count>${allowedPages.length}</b> / ${configurablePages.length} 项已授权</span>
        </div>
        <form data-admin-menu-permission-form>
          <div class="admin-menu-person-list">
            ${people.map((item) => `
              <button class="btn ${item.account === person.account ? "primary" : "ghost"}" type="button" data-admin-menu-permission-person="${escapeHtml(item.account)}">
                ${escapeHtml(item.name)} · ${escapeHtml(item.role)}
              </button>
            `).join("")}
          </div>
          <div class="permission-menu-grid admin-menu-permission-grid">
            ${groups.map((group) => renderMenuPermissionGroup(group, person)).join("")}
          </div>
          <div class="admin-menu-permission-savebar">
            <span>当前修改会保存到权限人员：${escapeHtml(person.name || "管理员")}</span>
            <button class="btn primary" type="button" data-admin-menu-permission-action="save">保存菜单权限</button>
          </div>
        </form>
      </section>
      <aside class="grid">
        <section class="panel">
          <div class="panel-head"><h2>数据权限</h2></div>
          <div class="admin-menu-permission-options">
            ${scopeOptions.map((scope) => `
              <label>
                <input type="radio" name="menuDataScope" value="${escapeHtml(scope)}" ${scope === person.scope ? "checked" : ""} data-admin-menu-permission-scope />
                <span>${escapeHtml(scope)}</span>
              </label>
            `).join("")}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><h2>按钮权限</h2><span class="right muted"><b data-admin-menu-button-selected-count>${buttonPermissions.length}</b> 项</span></div>
          <div class="admin-menu-permission-options two">
            ${buttonOptions.map(([value, label]) => `
              <label>
                <input type="checkbox" name="buttonPermissions" value="${escapeHtml(value)}" ${buttonPermissions.includes(value) ? "checked" : ""} data-admin-menu-permission-button />
                <span>${escapeHtml(label)}</span>
              </label>
            `).join("")}
          </div>
        </section>
        ${infoPanel("授权预览", [
          ["权限人员", `${person.name || "管理员"} / ${person.role || "系统管理员"}`],
          ["账号", person.account || ADMIN_DEFAULT_ACCOUNT],
          ["数据范围", person.scope || "全平台"],
          ["菜单授权", `${allowedPages.length}/${configurablePages.length}`],
          ["按钮授权", `${buttonPermissions.length}/${buttonOptions.length}`],
        ])}
      </aside>
    </div>
  `;
}

function permissionPeoplePanel() {
  const activeAccount = currentAdminPermissionPerson().account;
  return `
    <section class="panel permission-people-panel">
      <div class="panel-head">
        <h2>权限人员</h2>
        <span class="right"><button class="btn primary" type="button" data-admin-permission-add>${icons.plus}<span>新增权限人员</span></button></span>
      </div>
      <div class="permission-session-strip">
        <strong>当前验证账号：${escapeHtml(currentAdminPermissionPerson().name)}</strong>
        <span>${escapeHtml(currentAdminPermissionPerson().account)} · ${escapeHtml(currentAdminPermissionPerson().role)} · 授权菜单 ${escapeHtml(permissionCount(currentAdminPermissionPerson()))}</span>
      </div>
      ${adminPermissionState.notice ? `<div class="permission-notice">${escapeHtml(adminPermissionState.notice)}</div>` : ""}
      <div class="permission-people-list">
        ${adminPermissionState.people.map((person) => `
          <article class="permission-person-card ${person.account === activeAccount ? "active" : ""}">
            <div>
              <strong>${person.name}</strong>
              <span>${person.account} · 密码已设置</span>
            </div>
            <div><span>权限角色</span><strong>${person.role}</strong></div>
            <div><span>数据范围</span><strong>${person.scope}</strong></div>
            <div><span>授权菜单</span><strong>${permissionCount(person)}</strong></div>
            ${tag(person.status === "停用" ? "停用" : "启用", person.status === "停用" ? "red" : "green")}
            <div class="permission-person-actions">
              ${person.status !== "停用" ? `<button class="btn ghost" type="button" data-admin-permission-use="${escapeHtml(person.account)}">使用验证</button>` : ""}
              <button class="btn ghost" type="button" data-admin-permission-toggle="${escapeHtml(person.account)}">${person.status === "停用" ? "启用" : "停用"}</button>
              <button class="btn danger" type="button" data-admin-permission-delete="${escapeHtml(person.account)}">删除</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderPermissionMenuChoices() {
  return groups.map((group) => {
    const childPages = pages.filter((item) => item.group === group.id && item.type !== "login" && item.title !== group.title);
    return `
      <article class="permission-menu-group">
        <label class="permission-menu-title">
          <input type="checkbox" checked name="permissions" value="group:${escapeHtml(group.id)}" data-admin-permission-group="${escapeHtml(group.id)}" />
          <strong>${group.title}</strong>
          <span>${childPages.length} 项</span>
        </label>
        <div class="permission-menu-items">
          ${childPages.map((item) => `<label><input type="checkbox" checked name="permissions" value="${escapeHtml(item.id)}" data-admin-permission-page="${escapeHtml(group.id)}" /><span>${item.title}</span></label>`).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function permissionChoiceField(name, label, options, value) {
  return `
    <div class="permission-choice-field" data-admin-permission-choice-field="${escapeHtml(name)}">
      <span>${escapeHtml(label)}</span>
      <input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />
      <div class="permission-choice-options">
        ${options.map((option) => `<button class="${option === value ? "active" : ""}" type="button" data-admin-permission-choice="${escapeHtml(name)}" data-choice-value="${escapeHtml(option)}" aria-pressed="${option === value ? "true" : "false"}">${escapeHtml(option)}</button>`).join("")}
      </div>
    </div>
  `;
}

function permissionPersonDialog() {
  return `
    <div class="permission-dialog-backdrop" data-admin-permission-cancel></div>
    <section class="permission-dialog" role="dialog" aria-modal="true" aria-labelledby="permission-dialog-title">
      <div class="panel-head">
        <h2 id="permission-dialog-title">新增权限人员</h2>
        <span class="right"><button class="btn" type="button" data-admin-permission-cancel>取消</button></span>
      </div>
      <form class="permission-person-form" data-admin-permission-form>
        <label><span>姓名</span><input name="name" value="新权限人员" /></label>
        <label><span>账号</span><input name="account" value="new-permission-user" /></label>
        <label><span>登录密码</span><input name="password" type="password" value="Yunlv@2026" autocomplete="new-password" /></label>
        ${permissionChoiceField("role", "权限角色", ["运营管理", "系统管理员", "审计员"], "运营管理")}
        ${permissionChoiceField("scope", "数据范围", ["昆明市", "全平台", "只读审计"], "昆明市")}
        <div class="permission-dialog-menu">
          <h3>授予菜单权限</h3>
          <div class="permission-menu-grid">${renderPermissionMenuChoices()}</div>
        </div>
        <div class="permission-form-actions">
          <button class="btn primary" type="button" data-admin-permission-save>保存人员</button>
          <button class="btn" type="button" data-admin-permission-cancel>取消</button>
        </div>
      </form>
    </section>
  `;
}

function renderKnowledge(page) {
  const rows = knowledgeRows();
  return `
    ${pageHead(page, `${button("新增知识", "plus", "primary")} ${button("批量导入", "import")} ${button("向量化同步", "clock")} ${button("测试问答", "send")} ${button("发布版本", "save", "primary")}`)}
    <div class="grid kpi-grid five">${kpis(["知识条目", "待审核", "命中率（近7天）", "今日问答", "风险拦截"], 5)}</div>
    <div class="panel" style="margin-top:14px">${filters("knowledge")}</div>
    <div class="settings-layout" style="margin-top:14px">
      <div class="panel">
        <div class="panel-head"><h2>知识分类目录</h2><span class="right">${button("新增分类", "plus")}</span></div>
        <div class="permission-tree">
          ${["旅居政策", "活动服务", "健康常识", "交通出行", "平台规则", "医疗边界", "其他"].map((item, i) => `<div class="tree-row ${i > 0 ? "indent" : ""}"><span class="check">✓</span><span>${item}</span><span class="muted small">${512 - i * 46}</span></div>`).join("")}
        </div>
        <div class="panel-head"><h2>标签管理</h2></div>
        <div class="form-body"><div class="chip-row">${["旅居补贴", "长照服务", "健康管理", "交通出行", "紧急救助", "智能设备", "平台规则", "活动报名"].map((t, i) => tag(t, ["blue", "green", "orange", "purple"][i % 4])).join("")}</div></div>
      </div>
      <div class="grid">
        ${tablePanel(`知识列表（共 ${rows.length} 条）`, rows, ["标题", "分类", "适用城市", "来源", "更新人", "状态", "命中次数", "操作"])}
        ${qaPanel()}
      </div>
      <div class="grid">
        ${knowledgeDetail()}
        ${infoPanel("向量化同步任务", [["最近同步", "2024-05-19 09:20:15"], ["已同步条目", "2,486 / 2,486"], ["向量库状态", "正常"], ["索引维度", "1536"]])}
      </div>
    </div>
  `;
}

function renderLogin() {
  const currentPerson = currentAdminPermissionPerson();
  return `
    <div class="login-page">
      <section class="login-visual" aria-label="云旅无忧 AI 智慧旅居平台">
        <span class="sr-only">AI 赋能旅居服务，让长辈旅居更安心。智慧旅居，安心守护，美好生活。</span>
      </section>
      <section class="login-panel-wrap">
        <div class="login-panel">
          <h2>管理后台登录</h2>
          <p class="sub">运营、调度、异常处理与数据看板统一入口</p>
          <div class="login-form">
            <label class="login-field">${icons.user}<input name="adminAccount" value="${escapeHtml(currentPerson.account || ADMIN_DEFAULT_ACCOUNT)}" placeholder="账号 / 手机号" /><span></span></label>
            <label class="login-field">${icons.lock}<input name="adminPassword" type="password" value="${currentPerson.account === ADMIN_DEFAULT_ACCOUNT ? ADMIN_DEFAULT_PASSWORD : ""}" placeholder="密码" /><span>${icons.eye}</span></label>
            <div class="login-row">
              <label class="login-field">${icons.shield}<input placeholder="验证码" /><span></span></label>
              <div class="captcha">7A3K</div>
            </div>
            <label class="login-field">${icons.user}<input value="${escapeHtml(currentPerson.role || "管理员")}" /><span>${chevron("down")}</span></label>
            <div class="remember"><span class="check">✓</span>记住登录状态</div>
            <button class="login-submit" type="button" data-admin-login-submit>登 录</button>
            ${adminPermissionState.notice ? `<div class="permission-notice">${escapeHtml(adminPermissionState.notice)}</div>` : ""}
          </div>
          <div class="login-links"><button data-action="忘记密码">忘记密码</button><button data-action="联系技术支持">联系技术支持</button></div>
        </div>
        <div class="login-security"><span>${icons.shield} HTTPS 加密传输</span><span>${icons.content} 操作日志审计</span><span>${icons.users} 权限分级管控</span></div>
        <div class="login-footer">© 2024 云旅无忧 AI智慧旅居平台</div>
      </section>
    </div>
  `;
}

function kpis(titles, count = titles.length) {
  const stats = adminDashboardState.data?.stats || {};
  const merchantStats = adminMerchantStats();
  const page = currentPage();
  const exceptionRows = rowsForDomain("exception");
  const orderItems = page.group === "order" ? adminOrderCollection() : [];
  const dispatchRows = page.group === "dispatch" ? dispatchRowsForFilter("") : [];
  const valueOf = (...values) => {
    const found = values.find((value) => value !== undefined && value !== null && value !== "");
    return found === undefined ? 0 : found;
  };
  const exceptionStatusCount = (matcher) => exceptionRows.filter((row) => matcher(String(row[3] || ""))).length;
  const exceptionTodayCount = exceptionRows.filter((row) => String(row[0] || "").startsWith("2026-06-16")).length;
  const orderCount = (matcher) => orderItems.filter((item) => matcher(item)).length;
  const dispatchCount = (matcher) => dispatchRows.filter((row) => matcher(row)).length;
  const valuesByTitle = {
    用户总数: valueOf(stats.userCount),
    老人数: valueOf(stats.elderCount),
    老人档案数: valueOf(stats.elderCount),
    已绑定家属: valueOf(stats.familyCount),
    高风险老人: valueOf(stats.highRiskElders),
    今日新增: page.group === "exception" ? exceptionTodayCount : valueOf(stats.todayNewUsers),
    在线设备: valueOf(stats.onlineDevices),
    设备在线: valueOf(stats.onlineDevices),
    设备总数: valueOf(stats.deviceCount),
    离线设备: valueOf(stats.offlineDevices),
    低电量: valueOf(stats.lowBatteryDevices),
    今日上报: valueOf(stats.todayDeviceReports),
    待处理订单: valueOf(stats.pendingOrders),
    SOS预警: valueOf(stats.openAlerts),
    今日服务: valueOf(stats.todayServices, stats.todayOrders),
    老人总数: valueOf(stats.elderCount),
    在线人数: valueOf(stats.onlineUsers, stats.onlineElders),
    待派单: page.group === "dispatch"
      ? dispatchCount((row) => adminDispatchStatusOfRow(row) === "待派单")
      : page.group === "order"
        ? orderCount((item) => adminText(item.status) === "待派单")
        : valueOf(stats.pendingOrders),
    已派单: page.group === "dispatch" ? dispatchCount((row) => {
      const statusText = adminDispatchStatusOfRow(row);
      return statusText && !["待派单", "已完成", "已取消"].includes(statusText);
    }) : valueOf(stats.activeTasks),
    执行中: page.group === "dispatch" ? dispatchCount((row) => ["待服务", "服务中", "执行中", "已出发"].includes(adminDispatchStatusOfRow(row))) : valueOf(stats.activeTasks),
    超时预警: page.group === "dispatch" ? dispatchCount((row) => adminDispatchIsOverdueRow(row)) : valueOf(stats.openAlerts),
    今日完成: page.group === "dispatch" ? dispatchCount((row) => adminDispatchIsTodayCompletedRow(row)) : valueOf(stats.completedOrders),
    异常预警: valueOf(stats.openAlerts),
    满意度: valueOf(stats.satisfaction),
    商户总数: valueOf(merchantStats.total, stats.merchantCount),
    待审核: valueOf(merchantStats.pending),
    服务项目: valueOf(merchantStats.serviceCount, stats.serviceCount),
    本月订单: valueOf(merchantStats.monthOrders, stats.todayOrders),
    结算金额: valueOf(merchantStats.settlement),
    今日订单: page.group === "order" ? adminOrderListCount("__today__") : valueOf(stats.todayOrders),
    待确认: page.group === "order" ? orderCount((item) => adminText(item.status) === "待确认") : valueOf(stats.pendingConfirmOrders),
    服务中: page.group === "order" ? adminOrderListCount("__active__") : valueOf(stats.activeTasks),
    已完成: page.group === "order" ? orderCount((item) => adminText(item.status) === "已完成") : valueOf(stats.completedOrders),
    已取消: page.group === "order" ? orderCount((item) => adminText(item.status) === "已取消") : valueOf(stats.cancelledOrders),
    待处理: page.group === "exception" ? valueOf(stats.openAlerts, exceptionStatusCount((statusText) => statusText.includes("待处理"))) : valueOf(stats.pendingOrders),
    处理中: page.group === "exception" ? exceptionStatusCount((statusText) => statusText.includes("处理中")) : valueOf(stats.activeTasks),
    已归档: page.group === "exception" ? exceptionStatusCount((statusText) => statusText.includes("归档") || statusText.includes("已处理")) : 0,
    超时工单: page.group === "exception" ? exceptionStatusCount((statusText) => statusText.includes("超时")) : 0,
    在线向导: valueOf(stats.onlineGuides),
    在线接单: valueOf(stats.availableGuides),
    平均评分: valueOf(stats.guideRating),
    本月服务时长: valueOf(stats.guideServiceHours),
    内容总数: valueOf(stats.contentCount, stats.activityCount),
    待发布: valueOf(stats.pendingContent),
    已发布: valueOf(stats.publishedContent),
    今日阅读: valueOf(stats.todayReads),
    报名人数: valueOf(stats.signupCount),
  };
  const palette = ["blue", "green", "purple", "orange", "red", "blue", "teal", "cyan"];
  return titles.slice(0, count).map((title, index) => {
    const color = colors[palette[index % palette.length]];
    const value = valuesByTitle[title] ?? 0;
    const route = kpiRouteByTitle(title);
    const action = kpiActionByTitle(title);
    const hint = kpiHintByTitle(title);
    return `
      <button class="kpi-card" type="button" ${action ? `data-action="${escapeHtml(action)}"` : `data-route="${escapeHtml(route)}"`} aria-label="${escapeHtml(`${title} ${value}，${hint}`)}">
        <div class="kpi-icon" style="--icon-a:${color[0]};--icon-b:${color[1]}">${metricIcon(index)}</div>
        <div>
          <div class="kpi-title">${title}</div>
          <div class="kpi-value">${value}</div>
          <div class="kpi-trend"><span>后台数据</span><span class="kpi-link-text">查看明细</span></div>
        </div>
      </button>
    `;
  }).join("");
}

function kpiActionByTitle(title) {
  if (currentPage().id === "orders") {
    return {
      今日订单: "订单列表筛选:今日订单",
      待确认: "订单列表筛选:待确认",
      待派单: "订单列表筛选:待派单",
      服务中: "订单列表筛选:服务中",
      已完成: "订单列表筛选:已完成",
      已取消: "订单列表筛选:已取消",
    }[title] || "";
  }
  const actions = {
    设备总数: "设备列表筛选:全部",
    在线设备: "设备列表筛选:在线",
    离线设备: "设备列表筛选:离线",
    待派单: "任务调度筛选:待派单",
    已派单: "任务调度筛选:已派单",
    执行中: "任务调度筛选:执行中",
    超时预警: "任务调度筛选:超时预警",
    今日完成: "任务调度筛选:今日完成",
  };
  return ["devices", "tasks"].includes(currentPage().id) ? (actions[title] || "") : "";
}

function kpiRouteByTitle(title) {
  const routes = {
    用户总数: "users",
    老人数: "users",
    老人总数: "users",
    老人档案数: "users",
    已绑定家属: "family",
    高风险老人: "health-records",
    今日新增: "users",
    在线人数: "users",
    在线设备: "devices",
    设备在线: "devices",
    设备总数: "devices",
    离线设备: "devices",
    低电量: "device-exception",
    今日上报: "health-monitor",
    待处理订单: "orders",
    今日服务: "orders",
    今日订单: "orders",
    待确认: "orders",
    待派单: "tasks",
    已派单: "tasks",
    执行中: "tasks",
    超时预警: "tasks",
    今日完成: "tasks",
    服务中: "orders",
    已完成: "orders",
    已取消: "orders",
    待处理: currentPage().group === "exception" ? "exceptions" : "orders",
    处理中: currentPage().group === "exception" ? "exceptions" : "dashboard",
    已归档: currentPage().group === "exception" ? "exception-review" : "dashboard",
    超时工单: currentPage().group === "exception" ? "exceptions" : "dashboard",
    SOS预警: "exceptions",
    异常预警: "exceptions",
    满意度: "after-sales",
    商户总数: "merchants",
    待审核: currentPage().group === "guide" ? "guide-review" : "merchant-review",
    服务项目: "merchant-services",
    本月订单: "merchant-orders",
    结算金额: "merchant-settlement",
    在线向导: "guides",
    在线接单: "guides",
    平均评分: "guide-income",
    本月服务时长: "guide-income",
    内容总数: "activities-content",
    待发布: "activities-content",
    已发布: "activities-content",
    今日阅读: "activities-content",
    报名人数: "activity-signups",
  };
  return routes[title] || "dashboard";
}

function kpiHintByTitle(title) {
  const action = kpiActionByTitle(title);
  if (String(action || "").startsWith("订单列表筛选:")) return `筛选${title}订单`;
  if (String(action || "").startsWith("任务调度筛选:")) return `筛选${title}任务`;
  const route = kpiRouteByTitle(title);
  const page = pages.find((item) => item.id === route);
  return page ? `查看${page.title}` : "查看明细";
}

function metricIcon(index) {
  return [icons.users, icons.user, icons.phone, icons.order, icons.alert, icons.heart, icons.chart, icons.clock][index % 8];
}

function adminMerchantStats() {
  const merchants = adminMerchantState.merchants || [];
  const services = merchantServiceItemsForApi(adminMerchantState.services || []);
  if (!adminMerchantState.loaded) return {};
  const pendingStatuses = ["待审核", "待补充", "待复审", "待完善"];
  const orderCount = merchants.reduce((sum, item) => sum + Number(item.orderCount || item.monthOrders || 0), 0);
  const settlement = merchants.reduce((sum, item) => sum + Number(item.settlementPending || item.settlementAmount || item.balance || item.revenue || 0), 0);
  return {
    total: merchants.length,
    pending: merchants.filter((item) => pendingStatuses.includes(item.status)).length,
    serviceCount: services.length || merchants.reduce((sum, item) => sum + Number(item.serviceCount || 0), 0),
    monthOrders: orderCount,
    settlement: settlement ? `¥${settlement.toLocaleString("zh-CN")}` : "¥0",
  };
}

function linePanel(title, legend, trend = null, routes = ["orders", "users"]) {
  const legendItems = [
    { label: legend[0] || "指标一", color: "var(--blue)", route: routes[0] || "orders" },
    { label: legend[1] || "指标二", color: "var(--green)", route: routes[1] || "users" },
  ];
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2></div>
      <div class="chart-box">
        <div class="chart-legend">
          ${legendItems.map((item) => `<button type="button" data-route="${escapeHtml(item.route)}" style="color:${item.color}"><i class="legend-dot"></i>${escapeHtml(item.label)}</button>`).join("")}
        </div>
        ${lineChart(trend, legendItems)}
      </div>
    </section>
  `;
}

function lineChart(trend = null, legendItems = []) {
  const hasTrendData = Array.isArray(trend?.labels) && trend.labels.length && Array.isArray(trend?.orders) && Array.isArray(trend?.serviceUsers);
  const labels = hasTrendData ? trend.labels.slice(0, 7) : ["05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19"];
  const orderValues = hasTrendData ? trend.orders.slice(0, labels.length).map((value) => Number(value || 0)) : [42, 48, 66, 58, 82, 54, 64];
  const userValues = hasTrendData ? trend.serviceUsers.slice(0, labels.length).map((value) => Number(value || 0)) : [28, 32, 46, 41, 54, 36, 48];
  const max = Math.max(1, ...orderValues, ...userValues);
  const xAt = (index) => labels.length <= 1 ? 44 : 44 + index * (372 / (labels.length - 1));
  const yAt = (value) => 134 - (Number(value || 0) / max) * 100;
  const points = (arr) => arr.map((value, i) => `${xAt(i).toFixed(1)},${yAt(value).toFixed(1)}`).join(" ");
  const area = `44,134 ${points(userValues)} ${xAt(userValues.length - 1).toFixed(1)},134`;
  const lastIndex = Math.max(0, labels.length - 1);
  const tooltipX = labels.length > 4 ? 270 : 210;
  const tooltipY = 54;
  return `
    <svg class="line-chart" viewBox="0 0 430 168" preserveAspectRatio="none" role="img" aria-label="近7日服务趋势，订单合计${Number(trend?.totalOrders || 0)}单，服务人数合计${Number(trend?.totalServiceUsers || 0)}人">
      ${[34, 59, 84, 109, 134].map((y) => `<path d="M38 ${y}H416" stroke="#E7EDF6" stroke-width="1"/>`).join("")}
      <path d="M44 134H416" stroke="#DCE5F2"/>
      <polygon points="${area}" fill="rgba(32,190,112,.11)"/>
      <polyline points="${points(userValues)}" fill="none" stroke="#20be70" stroke-width="2.5"/>
      <polyline points="${points(orderValues)}" fill="none" stroke="#176bff" stroke-width="2.5"/>
      ${orderValues.map((value, i) => `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(value).toFixed(1)}" r="4" fill="#176bff" stroke="#fff" stroke-width="2"/>`).join("")}
      ${userValues.map((value, i) => `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(value).toFixed(1)}" r="4" fill="#20be70" stroke="#fff" stroke-width="2"/>`).join("")}
      ${labels.map((label, i) => `<text x="${xAt(i).toFixed(1)}" y="158" text-anchor="middle" fill="#7b879b" font-size="11">${escapeHtml(label)}</text>`).join("")}
      <g transform="translate(${tooltipX},${tooltipY})">
        <rect width="104" height="62" rx="6" fill="#fff" stroke="#DDE7F4"/>
        <text x="12" y="22" fill="#526079" font-size="11">${escapeHtml(labels[lastIndex])}</text>
        <circle cx="14" cy="38" r="3" fill="#176bff"/><text x="25" y="42" fill="#526079" font-size="11">${escapeHtml(legendItems[0]?.label || "订单数")}：${orderValues[lastIndex] || 0}</text>
        <circle cx="14" cy="53" r="3" fill="#20be70"/><text x="25" y="57" fill="#526079" font-size="11">${escapeHtml(legendItems[1]?.label || "服务人数")}：${userValues[lastIndex] || 0}</text>
      </g>
    </svg>
  `;
}

function barPanel(title) {
  const rows = [
    ["昆明市", 92, "2,856", "#176bff"],
    ["大理市", 66, "1,624", "#20be70"],
    ["丽江市", 52, "986", "#4d94ff"],
    ["曲靖市", 38, "742", "#ffad24"],
    ["弥勒市", 30, "514", "#8056e8"],
  ];
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2></div>
      <div class="rank-list">
        ${rows.map(([name, width, value, color], i) => `
          <div class="rank-item" style="grid-template-columns:70px minmax(0,1fr)58px">
            <span>${name}</span><div class="progress" style="--bar:${color}"><span style="width:${width}%"></span></div><strong>${value}</strong>
          </div>`).join("")}
      </div>
    </section>
  `;
}

function donutPanel(title, centerLabel, centerValue, segments) {
  let start = 0;
  const safeSegments = normalizeDonutSegments(segments);
  const parts = safeSegments.map((seg) => {
    const end = start + seg.value;
    const part = `${seg.color} ${start}% ${end}%`;
    start = end;
    return part;
  }).join(", ") || "#dce5f2 0% 100%";
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2></div>
      <div class="donut-wrap">
        <div class="donut" style="--donut:${parts}">
          <div class="donut-center"><div><span class="muted small">${centerLabel}</span><strong>${centerValue}</strong></div></div>
        </div>
        <div class="donut-legend">
          ${safeSegments.map((seg) => `<button class="legend-row" type="button" data-route="${escapeHtml(seg.route || "dashboard")}" aria-label="${escapeHtml(`${seg.name} ${seg.text}`)}"><i style="background:${seg.color}"></i><span>${escapeHtml(seg.name)}</span><strong>${escapeHtml(seg.text)}</strong></button>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function normalizeDonutSegments(segments = []) {
  const rows = Array.isArray(segments) ? segments.filter((seg) => Number(seg.count ?? seg.value ?? 0) > 0 || Number(seg.value || 0) > 0) : [];
  const totalValue = rows.reduce((sum, seg) => sum + Number(seg.value || 0), 0);
  if (!rows.length) return [];
  return rows.map((seg) => ({
    ...seg,
    value: totalValue ? Math.max(1, (Number(seg.value || 0) / totalValue) * 100) : 0,
  }));
}

function orderTypeSegments() {
  const segments = adminDashboardState.data?.charts?.orderTypes?.segments;
  if (Array.isArray(segments) && segments.length) return segments;
  return serviceSegments();
}

function serviceSegments() {
  const stats = adminDashboardState.data?.stats || {};
  const total = Number(stats.todayOrders || stats.serviceCount || 0);
  return [
    { name: "今日订单", value: Number(stats.todayOrders || 0), text: `${Number(stats.todayOrders || 0).toLocaleString("zh-CN")} 单`, color: "#3185ff", route: "orders" },
    { name: "进行中", value: Number(stats.activeTasks || 0), text: `${Number(stats.activeTasks || 0).toLocaleString("zh-CN")} 单`, color: "#20be70", route: "orders" },
    { name: "待处理", value: Number(stats.pendingOrders || 0), text: `${Number(stats.pendingOrders || 0).toLocaleString("zh-CN")} 单`, color: "#ffad24", route: "tasks" },
    { name: "已完成", value: Number(stats.completedOrders || 0), text: `${Number(stats.completedOrders || 0).toLocaleString("zh-CN")} 单`, color: "#8056e8", route: "orders" },
  ];
}

function healthSegments() {
  const segments = adminDashboardState.data?.charts?.healthStatus?.segments;
  if (Array.isArray(segments) && segments.length) return segments;
  const stats = adminDashboardState.data?.stats || {};
  const total = Number(stats.elderCount || 0);
  const alerts = Number(stats.openAlerts || 0);
  const normal = Math.max(0, total - alerts);
  return [
    { name: "正常", value: normal, text: `${normal.toLocaleString("zh-CN")} 人`, color: "#20be70", route: "health-records" },
    { name: "异常/SOS", value: alerts, text: `${alerts.toLocaleString("zh-CN")} 条`, color: "#ff5252", route: "exceptions" },
  ];
}

function deviceSegments() {
  const stats = adminDashboardState.data?.stats || {};
  const total = Number(stats.deviceCount || 0);
  const online = Number(stats.onlineDevices || 0);
  const offline = Number(stats.offlineDevices || 0);
  return [
    { name: "在线", value: total ? Math.round((online / total) * 100) : 0, text: `${online.toLocaleString("zh-CN")} 台`, color: "#20be70" },
    { name: "离线", value: total ? Math.round((offline / total) * 100) : 0, text: `${offline.toLocaleString("zh-CN")} 台`, color: "#ff5252" },
    { name: "低电量", value: 0, text: `${Number(stats.lowBatteryDevices || 0).toLocaleString("zh-CN")} 台`, color: "#ffad24" },
  ];
}

function rankPanel(title) {
  const map = adminDashboardState.data?.map || {};
  const rows = Array.isArray(map.cityStats) && map.cityStats.length
    ? map.cityStats
    : [
      { city: "昆明市", total: 0, alerts: 0, orders: 0, score: 0 },
      { city: "弥勒市", total: 0, alerts: 0, orders: 0, score: 0 },
    ];
  return `
    <section class="panel">
      <div class="panel-head">
        <h2>${title}</h2>
        <span class="right"><button class="link" type="button" data-route="operation-screen">进入大屏 ${chevron("right")}</button></span>
      </div>
      <div class="admin-map-layout">
        <div class="rank-list" style="padding:0">
          ${rows.slice(0, 6).map((item, i) => {
            const active = adminMapState.selectedCity ? item.city === adminMapState.selectedCity : i === 0;
            const color = ["#ff5252", "#ffad24", "#176bff", "#20be70", "#8056e8", "#8d98ae"][i] || "#8d98ae";
            return `
              <button class="rank-item admin-map-city ${active ? "active" : ""}" type="button" data-admin-map-city="${escapeHtml(item.city)}" aria-pressed="${active ? "true" : "false"}">
                <span class="rank-num" style="background:${color}">${i + 1}</span>
                <span>${escapeHtml(item.city)}</span>
                <strong>${Number(item.total || 0).toLocaleString("zh-CN")}点</strong>
              </button>
              <small class="admin-map-city-meta">异常 ${Number(item.alerts || 0).toLocaleString("zh-CN")} · 订单 ${Number(item.orders || 0).toLocaleString("zh-CN")} · 资源 ${Number((item.guides || 0) + (item.merchants || 0) + (item.devices || 0) + (item.activities || 0)).toLocaleString("zh-CN")}</small>
            `;
          }).join("")}
        </div>
        ${mapPanel(false)}
      </div>
    </section>
  `;
}

function adminMapData() {
  return adminDashboardState.data?.map || {
    providerName: "高德地图",
    center: { lng: 102.833, lat: 24.881, x: 47, y: 43, city: "昆明市" },
    summary: { pointCount: 0, cityCount: 0, alertCount: 0, orderCount: 0, resourceCount: 0 },
    cityStats: [],
    points: [],
    updatedAt: "",
  };
}

function adminMapFilteredPoints(map) {
  const points = Array.isArray(map.points) ? map.points : [];
  return adminMapState.selectedCity ? points.filter((point) => point.city === adminMapState.selectedCity) : points;
}

function clampAdminMapPercent(value) {
  return Math.min(92, Math.max(8, Number(value) || 50));
}

function adminMapRenderablePoints(points) {
  const clusters = new Map();
  points.forEach((point) => {
    const key = `${point.city || ""}:${point.type || ""}:${point.route || ""}:${point.tone || ""}`;
    const current = clusters.get(key) || {
      ...point,
      id: `cluster:${key}`,
      sourceIds: [],
      count: 0,
      amount: 0,
      latestTitle: point.title,
    };
    current.count += 1;
    current.amount += Number(point.amount || 0);
    current.sourceIds.push(point.sourceId || point.id);
    if (current.count === 1 || String(point.updatedAt || "") > String(current.updatedAt || "")) {
      current.latestTitle = point.title;
      current.updatedAt = point.updatedAt;
    }
    clusters.set(key, current);
  });
  const cityIndexes = new Map();
  const offsets = [[0, 0], [5, -4], [-5, 4], [5, 5], [-5, -4], [0, 7], [7, 0], [-7, 0]];
  return [...clusters.values()].map((cluster) => {
    const cityIndex = cityIndexes.get(cluster.city) || 0;
    cityIndexes.set(cluster.city, cityIndex + 1);
    const [offsetX, offsetY] = offsets[cityIndex % offsets.length];
    const countText = cluster.count > 1 ? `${cluster.count}项` : cluster.metric;
    return {
      ...cluster,
      title: cluster.count > 1 ? `${cluster.typeName || "业务"} · ${cluster.city} ${cluster.count}项` : cluster.title,
      subtitle: cluster.count > 1 ? `最新：${cluster.latestTitle} · 点击进入${pageById(cluster.route)?.title || "关联页面"}` : cluster.subtitle,
      metric: countText,
      x: clampAdminMapPercent(Number(cluster.x) + offsetX),
      y: clampAdminMapPercent(Number(cluster.y) + offsetY),
    };
  });
}

function adminMapSelectedPoint(points) {
  return points.find((point) => point.id === adminMapState.selectedPointId) || points[0] || null;
}

function adminMapToneColor(tone) {
  return {
    red: "#ff5252",
    orange: "#ffad24",
    green: "#20be70",
    blue: "#176bff",
    purple: "#8056e8",
    cyan: "#1aa4d8",
    gray: "#8d98ae",
  }[tone] || "#176bff";
}

function mapPanel(large = false) {
  const map = adminMapData();
  const rawPoints = adminMapFilteredPoints(map);
  const points = adminMapRenderablePoints(rawPoints);
  const selected = adminMapSelectedPoint(points);
  const center = selected || map.center || {};
  const status = adminMapState.sdkReady
    ? `${map.providerName || "高德地图"}已接入`
    : adminMapState.sdkError
      ? `地图 SDK 暂不可用，保留业务点位联动`
      : "正在接入高德地图";
  return `
    <div class="map-panel admin-live-map" style="min-height:${large ? "520px" : "260px"}" data-admin-map data-admin-map-large="${large ? "true" : "false"}" data-admin-map-center-lng="${Number(center.lng || 102.833)}" data-admin-map-center-lat="${Number(center.lat || 24.881)}">
      <div class="admin-amap-canvas" data-admin-amap-canvas aria-label="高德地图底图"></div>
      <div class="admin-map-fallback" data-admin-map-fallback>
        <span class="map-label" style="left:18%;top:23%">大理市</span>
        <span class="map-label" style="left:46%;top:43%">昆明市</span>
        <span class="map-label" style="left:62%;top:64%">弥勒市</span>
        <span class="map-label" style="left:71%;top:28%">曲靖市</span>
        ${points.map((point, index) => `
          <span class="heat" style="left:${Number(point.x || 50)}%;top:${Number(point.y || 50)}%;--s:${large ? 96 : 56}px;--c:${adminMapToneColor(point.tone)}"></span>
          <button class="map-marker admin-map-marker ${point.id === selected?.id ? "active" : ""}" type="button" data-admin-map-point="${escapeHtml(point.id)}" data-route="${escapeHtml(point.route || "dashboard")}" aria-label="${escapeHtml(point.title)}" style="left:${Number(point.x || 50)}%;top:${Number(point.y || 50)}%;background:${adminMapToneColor(point.tone)}"><span>${escapeHtml(point.metric || String(index + 1))}</span></button>
        `).join("")}
      </div>
      <div class="admin-map-status" data-admin-map-status>
        <strong>${escapeHtml(status)}</strong>
        <span>${escapeHtml(map.bounds?.scope || "订单、异常、向导、商户、设备、活动")} · ${Number(map.summary?.pointCount || 0).toLocaleString("zh-CN")} 个业务点</span>
      </div>
      <div class="admin-map-detail" data-admin-map-detail>
        ${selected ? `
          <small>${escapeHtml(selected.typeName || "业务点")} · ${escapeHtml(selected.city || "")}</small>
          <strong>${escapeHtml(selected.title || "")}</strong>
          <span>${escapeHtml(selected.subtitle || selected.location || "")}</span>
          <button class="link" type="button" data-route="${escapeHtml(selected.route || "dashboard")}">查看关联数据 ${chevron("right")}</button>
        ` : `
          <small>实时地图</small>
          <strong>暂无业务点</strong>
          <span>后台数据同步后会自动显示订单、异常和资源位置。</span>
        `}
      </div>
      <div class="map-zoom">
        <button type="button" data-admin-map-action="zoom-in" aria-label="放大地图">+</button>
        <button type="button" data-admin-map-action="zoom-out" aria-label="缩小地图">−</button>
        <button type="button" data-admin-map-action="locate" aria-label="定位到当前业务点">◎</button>
      </div>
    </div>
  `;
}

function tablePanel(title, rows, headers, extraClass = "") {
  const pageSize = 10;
  const total = rows.length;
  const titleBase = title.replace(/\s*共\s*[\d,，]+\s*条/g, "").trim();
  const normalizedTitle = `${titleBase} 共 ${total} 条`;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const bodyRows = total
    ? rows.map((row, i) => `<tr class="${i === 0 ? "selected" : ""}"${i >= pageSize ? " hidden" : ""}>${row.map((cell, idx) => `<td>${formatCell(cell, idx, headers[idx])}</td>`).join("")}</tr>`).join("")
    : `<tr data-empty-row="true"><td colspan="${headers.length}" style="text-align:center;color:#65708a;padding:28px">暂无匹配记录</td></tr>`;
  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    const activeClass = pageNumber === 1 ? "primary active is-active" : "ghost";
    if (pageNumber === 1) return `<span class="btn ${activeClass}" aria-current="page" data-current-page="${pageNumber}" style="min-width:32px;width:32px;padding:0">${pageNumber}</span>`;
    return `<button class="btn ${activeClass}" type="button" data-page-action="${pageNumber}" style="min-width:32px;width:32px;padding:0">${pageNumber}</button>`;
  }).join("");
  const paginationControls = totalPages > 1
    ? `<button class="btn ghost" type="button" data-page-action="prev" style="min-width:32px;width:32px;padding:0">‹</button>${pageButtons}<button class="btn ghost" type="button" data-page-action="next" style="min-width:32px;width:32px;padding:0">›</button>`
    : pageButtons;
  return `
    <section class="panel ${extraClass}">
      <div class="panel-head"><h2 data-table-title-base="${escapeHtml(titleBase)}">${normalizedTitle}</h2><span class="right"><span class="table-page-size">10条/页</span></span></div>
      <div class="table-wrap">
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <div class="admin-pagination" data-page-size="${pageSize}" style="display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:10px 14px;color:#65708a">
        共 ${total} 条 ${paginationControls}
      </div>
    </section>
  `;
}

function actionButton(label, route, variant = "") {
  return `<button class="link ${variant}" data-route="${route}">${label}</button>`;
}

function actionLinkForPage(page = currentPage(), label = "查看") {
  const action = normalizeActionText(label);
  const domain = domainOf(page);
  if (actionMatches(action, ["删除", "移除"])) return `<button class="link danger-link" data-action="${label}">${label}</button>`;
  if (actionMatches(action, ["启用", "停用", "冻结", "上架", "下架", "发布", "复盘", "处理", "确认", "审核"])) return `<button class="link" data-action="${label}">${label}</button>`;
  if (domain === "user") return actionButton(label, actionMatches(action, ["编辑", "新增"]) ? "user-create" : "user-detail");
  if (domain === "guide") return actionButton(label, actionMatches(action, ["编辑", "新增"]) ? "guide-create" : "guide-review");
  if (domain === "merchant") return actionButton(label, actionMatches(action, ["编辑", "新增", "服务"]) ? "merchant-services" : "merchant-review");
  if (domain === "order") return actionButton(label, actionMatches(action, ["售后", "评价"]) ? "after-sales" : "order-detail");
  if (domain === "dispatch") return actionButton(label, actionMatches(action, ["规则"]) ? "dispatch-rules" : "dispatch-detail");
  if (domain === "exception") return actionButton(label, actionMatches(action, ["归档", "复盘"]) ? "exception-review" : "device-exception");
  if (domain === "content") return actionButton(label, contentManagementRoute(page, action));
  if (domain === "device") return actionButton(label, actionMatches(action, ["绑定", "新增"]) ? "device-bind" : "device-detail");
  if (domain === "system") return actionButton(label, actionMatches(action, ["日志"]) ? "logs" : "config");
  return actionButton(label, operationalEditRoute(page));
}

function operationCellForPage(page = currentPage(), text = "") {
  const raw = String(text || "").trim();
  const domain = domainOf(page);
  const defaultLabels = ["order", "exception", "device"].includes(domain) ? ["查看"] : ["查看", "编辑"];
  const labels = raw && !["查看", "更多"].includes(raw)
    ? raw.split(/\s+|　+/).filter(Boolean)
    : defaultLabels;
  const uniqueLabels = [...new Set(labels.length ? labels : defaultLabels)];
  return uniqueLabels.map((label) => actionLinkForPage(page, label)).join("　");
}

function formatCell(cell, index, header) {
  if (cell && typeof cell === "object" && "html" in cell) return cell.html;
  const text = String(cell);
  if (header === "操作") return operationCellForPage(currentPage(), text);
  if (["状态", "订单状态", "当前状态", "账户状态", "结果"].includes(header)) {
    if (text.includes("待") || text.includes("处理") || text.includes("审核")) return status(text, "orange");
    if (text.includes("取消") || text.includes("冻结") || text.includes("异常") || text.includes("离线") || text.includes("停用")) return status(text, "red");
    if (text.includes("中")) return status(text, "blue");
    return status(text, "green");
  }
  if (["服务类型", "类型", "分类"].includes(header)) return tag(text, ["blue", "green", "purple", "orange"][index % 4]);
  if (text.startsWith("¥")) return `<strong class="hot">${text}</strong>`;
  if (text.includes("****")) return `<span>${text}</span>`;
  return text;
}

function alertRows() {
  return rowsForDomain("exception");
}

function orderRows(limit = 7) {
  return rowsForDomain("order").slice(0, limit);
}

function adminDispatchStatusOfRow(row = []) {
  return String(row[6] || "").trim();
}

function adminDispatchTimeOfRow(row = []) {
  const normalized = String(row[3] || "").trim().replace(/\./g, "-").replace(" ", "T");
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? timestamp : NaN;
}

function adminDispatchIsOverdueRow(row = []) {
  const statusText = adminDispatchStatusOfRow(row);
  if (["待派单", "已完成", "已取消"].includes(statusText)) return false;
  const timestamp = adminDispatchTimeOfRow(row);
  return Number.isFinite(timestamp) && timestamp < Date.now();
}

function adminDispatchIsTodayCompletedRow(row = []) {
  const statusText = adminDispatchStatusOfRow(row);
  if (statusText !== "已完成") return false;
  const timestamp = adminDispatchTimeOfRow(row);
  if (!Number.isFinite(timestamp)) return false;
  const taskDate = new Date(timestamp);
  const nowDate = new Date();
  return taskDate.getFullYear() === nowDate.getFullYear()
    && taskDate.getMonth() === nowDate.getMonth()
    && taskDate.getDate() === nowDate.getDate();
}

function adminDispatchQueuedRows() {
  const queue = adminDispatchState.queue || {};
  const pendingRows = (queue.pendingOrders || []).map((order) => [
    order.orderNo || order.id || "",
    order.serviceType || "",
    order.elderName || "",
    order.time || order.createdAt || "",
    order.location || "",
    order.requirementPriority || "中",
    "待派单",
    order.recommendedProvider?.assigneeName || order.recommendedProvider?.realName || order.recommendedProvider?.name || "",
    "派单",
  ]);
  const activeRows = (queue.activeTasks || []).map((item) => [
    item.taskNo || item.id || "",
    item.order?.serviceType || item.serviceType || "",
    item.order?.elderName || item.elderName || "",
    item.order?.time || item.updatedAt || "",
    item.order?.location || item.location || "",
    item.priority || item.order?.requirementPriority || "中",
    item.status || "",
    item.assigneeName || item.assigneeId || "",
    "查看",
  ]);
  return [...pendingRows, ...activeRows];
}

function dispatchRowsForFilter(filter = adminDispatchState.statusFilter) {
  const normalizedFilter = String(filter || "").trim();
  const rows = adminDispatchQueuedRows();
  if (!normalizedFilter) return rows;
  if (normalizedFilter === "待派单") return rows.filter((row) => adminDispatchStatusOfRow(row) === "待派单");
  if (normalizedFilter === "已派单") {
    return rows.filter((row) => {
      const statusText = adminDispatchStatusOfRow(row);
      return statusText && !["待派单", "已完成", "已取消"].includes(statusText);
    });
  }
  if (normalizedFilter === "执行中") {
    return rows.filter((row) => ["待服务", "服务中", "执行中", "已出发"].includes(adminDispatchStatusOfRow(row)));
  }
  if (normalizedFilter === "超时预警") return rows.filter((row) => adminDispatchIsOverdueRow(row));
  if (normalizedFilter === "今日完成") return rows.filter((row) => adminDispatchIsTodayCompletedRow(row));
  return rows.filter((row) => row.join(" ").includes(normalizedFilter));
}

function applyAdminDispatchStatusQuickFilter(statusText = "") {
  adminDispatchState.statusFilter = statusText === "全部" ? "" : String(statusText || "").trim();
  const visible = dispatchRowsForFilter(adminDispatchState.statusFilter).length;
  render();
  return visible;
}

function taskRows() {
  return dispatchRowsForFilter(adminDispatchState.statusFilter);
}

function currentAdminDispatchDetail() {
  const queue = adminDispatchState.queue || {};
  const selectedKey = String(adminDispatchState.selectedKey || "").trim();
  const activeTask = (queue.activeTasks || []).find((item) => {
    return [item.id, item.taskNo, item.orderId, item.order?.id, item.order?.orderNo].includes(selectedKey);
  }) || (queue.activeTasks || [])[0] || null;
  const pendingOrder = (queue.pendingOrders || []).find((item) => {
    return [item.id, item.orderNo].includes(selectedKey);
  }) || (queue.pendingOrders || [])[0] || null;
  const order = pendingOrder || activeTask?.order || activeTask || null;
  if (!order && !activeTask) return null;
  const provider = activeTask
    ? {
      assigneeType: activeTask.assigneeType || order?.providerType || "guide",
      assigneeId: activeTask.assigneeId || order?.providerId || "",
      assigneeName: activeTask.assigneeName || order?.assigneeName || "",
    }
    : order?.recommendedProvider
      ? {
        assigneeType: order.recommendedProvider.assigneeType || "guide",
        assigneeId: order.recommendedProvider.assigneeId || order.recommendedProvider.id || "",
        assigneeName: order.recommendedProvider.assigneeName || order.recommendedProvider.realName || order.recommendedProvider.name || "",
      }
      : null;
  return {
    order,
    task: activeTask,
    provider,
    status: activeTask?.status || order?.status || "待派单",
    priority: activeTask?.priority || order?.requirementPriority || "中",
    candidates: queue.candidates || { guides: [], merchants: [] },
  };
}

function dispatchDetailTabOptions() {
  return [
    ["map", "地图推荐"],
    ["candidates", "候选列表"],
    ["tracking", "执行跟踪"],
    ["logs", "调度日志"],
  ];
}

function dispatchMessagePools() {
  return adminDispatchState.messages || { user: [], guide: [], merchant: [] };
}

function dispatchRelevantMessageRows(detail, role = "") {
  const pools = dispatchMessagePools();
  const rows = Array.isArray(pools[role]) ? pools[role] : [];
  const ids = new Set([detail?.task?.id, detail?.order?.id].filter(Boolean));
  const orderNo = String(detail?.order?.orderNo || "").trim();
  return rows.filter((item) => {
    if (ids.has(item.relatedId)) return true;
    const title = `${item.title || ""} ${item.content || ""}`;
    return orderNo && title.includes(orderNo);
  });
}

function dispatchNotificationRows(detail) {
  const userMessages = dispatchRelevantMessageRows(detail, "user");
  const providerRole = detail?.provider?.assigneeType === "merchant" ? "merchant" : "guide";
  const providerMessages = dispatchRelevantMessageRows(detail, providerRole);
  const providerLabel = providerRole === "merchant" ? "商户" : "向导";
  const rows = [
    ...providerMessages.map((item) => [
      providerLabel,
      (item.channels || ["站内消息"]).join(" / "),
      item.read ? "已读" : "未读",
      formatAdminScreenTime(item.readAt || item.createdAt || "") || "未记录",
    ]),
    ...userMessages.map((item) => [
      "用户",
      (item.channels || ["站内消息"]).join(" / "),
      item.read ? "已读" : "未读",
      formatAdminScreenTime(item.readAt || item.createdAt || "") || "未记录",
    ]),
  ];
  if (rows.length) return rows;
  return [["暂无通知记录", "—", "未发送", "—"]];
}

function dispatchCandidateEtaLabel(distanceText = "") {
  const text = String(distanceText || "").trim();
  if (!text) return "未记录";
  const parts = text.split(" / ").map((item) => item.trim()).filter(Boolean);
  return parts[1] || parts[0] || "未记录";
}

function dispatchAuditActionSet() {
  return new Set([
    "创建订单",
    "派单",
    "通知执行方",
    "取消订单",
    "向导主动接单",
    "忽略任务",
    "拒绝接单",
    "申请取消订单",
  ]);
}

function dispatchAuditType(label = "") {
  const text = String(label || "").trim();
  if (!text) return "调度更新";
  if (text === "创建订单") return "任务创建";
  if (text === "派单") return "后台派单";
  if (text === "通知执行方") return "通知执行方";
  if (text === "取消订单") return "订单取消";
  if (text.includes("接单")) return "执行方接单";
  if (text.includes("开始服务")) return "开始服务";
  if (text.includes("提交完成")) return "服务完成";
  if (text === "忽略任务") return "忽略任务";
  if (text === "拒绝接单") return "拒绝接单";
  if (text === "申请取消订单") return "申请取消";
  return text;
}

function dispatchAuditTargetId(target = "") {
  const text = String(target || "").trim();
  const match = text.match(/(TASK\d+|DD\d+)/);
  return match?.[1] || text || "—";
}

function dispatchDomainAuditRows(detail = null) {
  const logs = Array.isArray(adminDispatchState.auditLogs) ? adminDispatchState.auditLogs : [];
  const ids = new Set([detail?.task?.taskNo, detail?.order?.orderNo].filter(Boolean));
  const relatedLogs = logs.filter((item) => {
    const action = String(item.action || "").trim();
    const target = String(item.target || "").trim();
    if (!dispatchAuditActionSet().has(action) && !/已接单|已出发|已到达|已开始服务|已完成服务|已提交完成/.test(action)) return false;
    if (!detail) return true;
    return [...ids].some((value) => target.includes(value));
  });
  const timelineRows = detail?.order?.timeline?.map((item) => ({
    createdAt: item.time || "",
    type: String(item.status || "").trim() || "状态流转",
    target: detail?.task?.taskNo || detail?.order?.orderNo || "—",
    content: item.text || "已记录",
    actor: item.text?.includes("后台") ? "平台管理员" : detail?.provider?.assigneeName || "系统",
  })) || [];
  const auditRows = relatedLogs.map((item) => ({
    createdAt: item.createdAt || item.time || "",
    type: dispatchAuditType(item.action || ""),
    target: detail?.task?.taskNo || detail?.order?.orderNo || dispatchAuditTargetId(item.target || ""),
    content: item.target || item.result || item.action || "已记录",
    actor: item.actor || "平台管理员",
  }));
  const deduped = [...timelineRows, ...auditRows]
    .sort((a, b) => adminLogTimeValue(b.createdAt) - adminLogTimeValue(a.createdAt))
    .filter((item, index, list) => {
      const key = `${item.createdAt}|${item.type}|${item.content}|${item.actor}`;
      return list.findIndex((entry) => `${entry.createdAt}|${entry.type}|${entry.content}|${entry.actor}` === key) === index;
    })
    .slice(0, 10);
  if (deduped.length) {
    return deduped.map((item) => [item.createdAt, item.type, item.target, item.content, item.actor]);
  }
  return [["暂无记录", "调度日志", detail?.task?.taskNo || detail?.order?.orderNo || "—", "当前暂无调度操作记录", "系统"]];
}

function dispatchDetailTimelineRows(detail) {
  const timeline = detail?.order?.timeline || [];
  if (timeline.length) {
    return timeline.map((item) => [formatAdminScreenTime(item.time), item.status || "状态更新", item.text || "已记录"]);
  }
  return [["未记录", detail?.status || "待派单", "当前任务暂无更多调度轨迹"]];
}

function dispatchDetailCandidateRows(detail) {
  const candidateSource = detail?.order?.providerType === "merchant" || detail?.order?.serviceType?.includes("护理")
    ? detail?.candidates?.merchants || []
    : detail?.candidates?.guides || [];
  if (!candidateSource.length) {
    return [["—", "暂无可用执行方", "—", "—", "—", "—", "当前无可用候选", "—"]];
  }
  return candidateSource.slice(0, 6).map((candidate, index) => {
    const assigneeType = candidate.realName ? "guide" : "merchant";
    const assigneeName = candidate.realName || candidate.name || candidate.contact || "未命名执行方";
    const serviceTypes = Array.isArray(candidate.serviceTypes) && candidate.serviceTypes.length
      ? candidate.serviceTypes.join(" / ")
      : Array.isArray(candidate.skills) && candidate.skills.length
        ? candidate.skills.join(" / ")
      : candidate.type || candidate.category || "综合服务";
    const distanceText = Number.isFinite(Number(candidate.distanceKm))
      ? `${Number(candidate.distanceKm).toFixed(1)} km / ${Math.max(8, Math.round(Number(candidate.distanceKm) * 4 + 4))}分钟`
      : "同城待命";
    const rating = Number(candidate.rating || candidate.score || 4.6).toFixed(1);
    const matchScore = Math.max(72, Math.round(100 - index * 5 - Number(candidate.distanceKm || 0) * 2));
    const availability = candidate.status === "已认证" || candidate.status === "已通过"
      ? candidate.onlineStatus === "离线"
        ? "离线待通知"
        : candidate.currentStatus || "可接单"
      : candidate.status || "待审核";
    return [
      String(index + 1),
      `${assigneeName} ${candidate.id || ""}`.trim(),
      serviceTypes,
      distanceText,
      rating,
      `${matchScore}%`,
      availability,
      {
        html: `<button class="link" type="button" data-action="选择执行方:${assigneeType}:${candidate.id || ""}">选择</button>`,
      },
    ];
  });
}

function renderDispatchDetailActionPanel(detail) {
  const order = detail?.order || {};
  const provider = detail?.provider || {};
  const mode = adminDispatchState.detailMode || "";
  const modeText = mode === "reassign" ? "改派模式" : mode === "assign" ? "指定执行方模式" : "当前调度状态";
  const providerName = provider.assigneeName || order.assigneeName || "未分配执行方";
  return `
    <section class="panel pad">
      <div class="panel-title" style="margin-bottom:14px">
        ${modeText}
        ${mode ? `<button class="link" type="button" style="float:right" data-action="关闭调度编辑">关闭</button>` : ""}
      </div>
      <div class="detail-list" style="padding:0">
        ${[
          ["当前订单", order.orderNo || order.id || "未命名任务"],
          ["当前状态", detail?.status || "待派单"],
          ["当前执行方", providerName],
          ["调度规则", detail?.task?.dispatchRule || (providerName === "未分配执行方" ? "待指派" : "后台调度")],
        ].map(([label, value]) => `<div class="profile-row"><span>${label}</span><strong>${escapeHtml(String(value || "—"))}</strong></div>`).join("")}
      </div>
      ${mode ? `<p class="muted" style="margin:12px 0 0">请在“候选列表”中点击“选择”完成${mode === "reassign" ? "改派" : "指定执行方"}。</p>` : ""}
      ${adminDispatchState.detailNotice ? `<div class="permission-notice" style="margin-top:12px">${escapeHtml(adminDispatchState.detailNotice)}</div>` : ""}
    </section>
  `;
}

function renderDispatchDetailSuggestionPanel(detail) {
  const providerName = detail?.provider?.assigneeName || detail?.order?.recommendedProvider?.assigneeName || "系统推荐执行方";
  const firstCandidate = dispatchDetailCandidateRows(detail)[0] || [];
  const providerMessages = dispatchRelevantMessageRows(detail, detail?.provider?.assigneeType === "merchant" ? "merchant" : "guide");
  const pendingNoticeText = providerMessages.length
    ? `最近一次通知：${formatAdminScreenTime(providerMessages[0].createdAt || "") || "未记录"}`
    : "当前暂无已发送通知记录";
  const matchReason = firstCandidate[1] && firstCandidate[1] !== "暂无可用执行方"
    ? `${firstCandidate[2] || "综合服务"}，${firstCandidate[3] || "距离待确认"}，评分 ${firstCandidate[4] || "—"}，匹配度 ${firstCandidate[5] || "—"}`
    : "当前候选池暂无可直接匹配的执行方";
  const handlingAdvice = detail?.status === "待派单"
    ? "优先完成派单，避免预约时间前无人接单"
    : detail?.status === "待接单"
      ? "建议先通知执行方确认接单，再决定是否改派"
      : "任务已进入执行阶段，按时间线持续跟踪";
  return `
    <section class="panel pad">
      <div class="panel-title" style="margin-bottom:14px">调度建议</div>
      <div class="detail-list" style="padding:0">
        ${[
          ["推荐执行方", providerName],
          ["匹配原因", matchReason],
          ["通知策略", pendingNoticeText],
          ["处理建议", handlingAdvice],
        ].map(([label, value]) => `<div class="profile-row"><span>${label}</span><strong>${escapeHtml(String(value || "—"))}</strong></div>`).join("")}
      </div>
    </section>
  `;
}

function dispatchLogRows(detail = null) {
  return dispatchDomainAuditRows(detail);
}

function systemRows() {
  const rows = operationLogRows(10);
  if (rows.length) return rows;
  return sample.system.map((row) => [row[4], row[0], `更新${row[2]}配置`, row[5], row[3] === "正常" ? "成功" : "失败"]);
}

function policyRowsForAdmin() {
  const imported = adminReferenceContentState.policies || [];
  if (imported.length) {
    return imported.map((item) => [
      item.title || "未命名指南",
      item.category || "旅居政策",
      item.city || "全国",
      Number(item.views || 0).toLocaleString("zh-CN"),
      Number(item.favorites || 0).toLocaleString("zh-CN"),
      item.status || "待审核",
      item.updatedAt || adminNowText(),
      "编辑",
    ]);
  }
  return [
    ["昆明旅居政策解读（2024最新版）", "旅居政策", "昆明市", "2,356", "256", "已发布", "2024-05-18 10:23", "编辑"],
    ["云南省长期旅居险政策汇总", "旅居政策", "云南省", "1,892", "178", "已发布", "2024-05-17 16:45", "编辑"],
    ["异地就医保备案与报销指南", "医疗医保", "全国", "1,620", "210", "已发布", "2024-05-16 09:30", "编辑"],
    ["旅居老人安全防护手册", "安全指南", "全国", "1,203", "132", "已发布", "2024-05-15 14:22", "编辑"],
    ["昆明公共交通优惠政策大全", "交通出行", "昆明市", "986", "98", "已发布", "2024-05-14 11:05", "编辑"],
  ];
}

function knowledgeRows() {
  const imported = adminReferenceContentState.knowledge || [];
  if (imported.length) {
    return imported.map((item) => [
      item.title || "未命名知识",
      item.category || "其他",
      item.city || "全国",
      item.source || "后台导入",
      item.updater || "平台管理员",
      item.status || "待审核",
      Number(item.hits || 0).toLocaleString("zh-CN"),
      "更多",
    ]);
  }
  return [
    ["昆明旅居补贴申请条件是什么？", "旅居政策-补贴指南", "昆明市", "政府文件", "张小明", "已发布", "1,286", "更多"],
    ["长者旅居陪护服务流程", "活动服务-报名参与", "全国", "平台运营", "李向导", "已发布", "932", "更多"],
    ["高血压饮食注意事项", "健康常识-慢病管理", "全国", "权威机构", "王医生", "已发布", "812", "更多"],
    ["机场接送服务范围说明", "交通出行-接送服务", "昆明/大理", "商户提供", "赵经理", "已发布", "645", "更多"],
    ["平台服务协议解读", "平台规则-服务协议", "全国", "法务审核", "系统", "待审核", "582", "更多"],
  ];
}

function rowsForDomain(domain) {
  const dataLoop = adminDashboardState.data?.dataLoop || {};
  const stats = adminDashboardState.data?.stats || {};
  if (domain === "user") {
    const profile = dataLoop.users?.elderProfiles?.[0];
    const rows = [
      ...(profile ? [[profile.id || "elder", profile.name || "未命名", profile.age || "", profile.gender || "", profile.phone || "", profile.city || "", profile.healthStatus || "未记录", `${dataLoop.users?.familyContacts?.length || 0} 个`, `${dataLoop.health?.devices?.length || 0} 台`, dataLoop.users?.latestOrders?.[0]?.serviceType || "暂无", "正常"]] : []),
      ...(dataLoop.users?.accounts || []).map((item) => [item.id, item.nickname || item.name || item.phone || "未命名", "", "", item.phone || "", item.city || "", item.status || "正常", "", "", "", item.status || "正常"])
    ];
    return rows.map((row) => [...row, "更多"]);
  }
  if (domain === "guide") {
    return (dataLoop.guides?.guides || []).map((item) => [
      item.realName || item.name || "未命名",
      item.id,
      Array.isArray(item.serviceTypes) ? item.serviceTypes.join("/") : item.serviceTypes || "",
      item.area || "",
      item.onlineStatus || item.currentStatus || "",
      item.currentStatus || item.status || "",
      stats.todayOrders || 0,
      stats.completedOrders || 0,
      stats.satisfaction || "0%",
      item.rating || 0,
      `¥${Number(item.incomeToday || 0).toLocaleString("zh-CN")}`,
      item.status || "待审核",
      "查看"
    ]);
  }
  if (domain === "order") {
    return (dataLoop.services?.orders || []).map((item) => [item.orderNo || item.id, item.elderName || "", item.serviceType || "", item.time || item.createdAt || "", item.location || "", item.assigneeName || item.providerName || "", item.status || "", `¥${Number(item.amount || 0).toFixed(2)}`, item.source || "用户端", "更多"]);
  }
  if (domain === "dispatch") {
    return (dataLoop.services?.tasks || []).map((item) => [item.taskNo || item.id, item.order?.serviceType || item.serviceType || "", item.order?.elderName || item.elderName || "", item.order?.time || item.updatedAt || "", item.order?.location || "", item.priority || "中", item.status || "", item.assigneeName || item.assigneeId || "", "派单"]);
  }
  if (domain === "exception") {
    return (dataLoop.health?.alerts || []).map((item) => [item.createdAt || item.time || "", item.type || "", item.elderName || item.title || item.deviceId || "", item.status || "", item.handledBy || item.assigneeName || "", "查看"]);
  }
  if (domain === "content") {
    return (dataLoop.activities?.activities || []).map((item) => [item.id, item.title || "", item.category || "", item.location || item.city || "", item.status || "", item.signupCount || 0, item.updatedAt || item.time || "", "更多"]);
  }
  if (domain === "device") {
    return (dataLoop.health?.devices || []).map((item) => [item.deviceId || item.id, item.name || item.type || "", item.elderName || item.userId || "", item.onlineStatus || "", item.battery !== undefined ? `${item.battery}%` : "", item.location || "", item.lastSyncAt || item.updatedAt || "", "查看"]);
  }
  if (domain === "system") return (dataLoop.auditLogs || []).map((item) => [item.actor || "", item.id || "", item.action || "", item.result || "", item.createdAt || "", item.ip || "", "编辑"]);
  return (dataLoop.merchants?.merchants || []).map((item) => [
    item.id,
    item.name || "",
    item.type || item.serviceType || "",
    item.city || item.address || "",
    item.status || "",
    item.orderCount || 0,
    item.rating || "0%",
    "查看"
  ]);
}

function headersForDomain(domain) {
  if (domain === "user") return ["用户ID", "老人姓名", "年龄", "性别", "联系电话", "所在城市", "健康状态", "家属绑定", "设备绑定", "最近服务", "账户状态", "操作"];
  if (domain === "guide") return ["向导姓名", "工号", "服务类型", "服务区域", "在线状态", "接单状态", "今日订单", "本月完成单", "好评率", "星级评分", "收入", "认证状态", "操作"];
  if (domain === "order") return ["订单编号", "用户", "服务类型", "服务时间", "地点", "执行方", "订单状态", "金额", "来源", "操作"];
  if (domain === "exception") return ["时间", "类型", "对象", "状态", "处理人", "操作"];
  if (domain === "content") return ["编号", "标题", "分类", "适用城市", "状态", "阅读/报名", "更新时间", "操作"];
  if (domain === "device") return ["设备ID", "设备名称", "绑定老人", "状态", "电量", "位置", "最后上报", "操作"];
  if (domain === "system") return ["姓名", "账号", "角色", "账户状态", "最近登录", "IP地址", "操作"];
  return ["商户编号", "商户名称", "服务类型", "城市", "状态", "订单量", "评分", "操作"];
}

function domainOf(page) {
  if (["user"].includes(page.group) || page.title.includes("老人") || page.title.includes("健康") || page.title.includes("家属")) return "user";
  if (page.group === "guide" || page.title.includes("向导")) return "guide";
  if (page.group === "order" || page.title.includes("订单")) return "order";
  if (page.group === "dispatch" || page.title.includes("调度") || page.title.includes("派单")) return "dispatch";
  if (page.group === "exception" || page.title.includes("异常") || page.title.includes("投诉")) return "exception";
  if (page.group === "content" || page.title.includes("活动") || page.title.includes("资讯") || page.title.includes("公告")) return "content";
  if (page.group === "device" || page.title.includes("设备")) return "device";
  if (page.group === "system" || page.title.includes("系统") || page.title.includes("账号") || page.title.includes("日志") || page.title.includes("消息") || page.title.includes("AI")) return "system";
  return "merchant";
}

function metricTitles(domain) {
  const map = {
    user: ["用户总数", "老人档案数", "已绑定家属", "高风险老人", "今日新增"],
    guide: ["在线向导", "在线接单", "待审核", "平均评分", "本月服务时长"],
    merchant: ["商户总数", "待审核", "服务项目", "本月订单", "结算金额"],
    order: ["今日订单", "待确认", "待派单", "服务中", "已完成"],
    dispatch: ["待派单", "已派单", "执行中", "超时预警", "今日完成"],
    exception: ["待处理", "处理中", "已归档", "超时工单", "今日新增"],
    content: ["内容总数", "待发布", "已发布", "今日阅读", "报名人数"],
    device: ["设备总数", "在线设备", "离线设备"],
    system: ["账号数", "角色数", "菜单权限", "今日操作", "风险拦截"],
  };
  return map[domain] || map.merchant;
}

function domainCount(domain) {
  return rowsForDomain(domain).length.toLocaleString("zh-CN");
}

function detailName(domain) {
  return {
    user: "李奶奶",
    guide: "李向导",
    merchant: "云康护理中心",
    order: "DD20240519001",
    dispatch: "任务 DD20240519001",
    exception: "SOS预警工单",
    content: "健康每一天",
    device: "乐心手环 LX-05 Pro",
    system: "管理员",
  }[domain] || "李奶奶";
}

function filters(domain, values = []) {
  const labels = {
    user: ["搜索姓名/手机号/用户ID", "状态", "城市", "年龄段", "健康风险", "注册时间"],
    guide: ["搜索向导姓名/工号/手机号", "服务类型", "城市", "在线状态", "审核状态", "加入时间"],
    orders: ["订单编号", "用户姓名", "服务类型", "城市", "执行方", "订单状态"],
    dispatch: ["任务编号", "城市", "服务类型", "优先级", "执行状态", "时间"],
    knowledge: ["关键词", "知识分类", "适用城市", "状态", "更新时间", "来源"],
    merchantService: ["服务名称/ID", "分类", "所属商户", "状态", "价格", "更新时间"],
  }[domain] || ["关键词", "分类", "城市", "状态", "时间", "来源"];
  return `
    <div class="filters">
      ${labels.map((label, i) => `<label class="field">${i === 0 && domain !== "guide" ? icons.search : ""}<input placeholder="${label}" value="${escapeHtml(values[i] || "")}" /></label>`).join("")}
      <button class="btn primary" data-action="查询">查询</button>
      <button class="btn" data-action="重置筛选">重置</button>
    </div>
  `;
}

function renderSideProfile(kind) {
  const isGuide = kind === "guide";
  return `
    <aside class="panel side-card">
      <div class="panel-head"><h2>${isGuide ? "李向导" : "李奶奶"}</h2><span class="right">${tag(isGuide ? "在线" : "良好", "green")}</span></div>
      <div class="profile-card">
        <div class="person-row"><span class="photo ${isGuide ? "" : "female"}"></span><div><div class="profile-name">${isGuide ? "李向导" : "李奶奶"}</div><div class="muted">${isGuide ? "工号：DG10023" : "女 / 72岁 / 1952-04-12"}</div></div></div>
        <div class="tabs" style="padding:0"><button class="tab active">基本信息</button><button class="tab">服务数据</button><button class="tab">评价记录</button></div>
        <div class="kv-grid">
          ${[
            ["联系电话", "138****5678"],
            ["所在城市", "昆明市 五华区"],
            [isGuide ? "服务类型" : "健康状态", isGuide ? "陪伴就医、生活陪伴" : "良好"],
            [isGuide ? "本月完成" : "最近服务", isGuide ? "28 单" : "05-19 护理服务"],
            ["账户状态", "正常"],
          ].map(([k, v]) => `<div class="kv"><span>${k}</span><strong>${v}</strong></div>`).join("")}
        </div>
        <div class="chip-row">${["编辑信息", isGuide ? "排班管理" : "更多操作", isGuide ? "设为休息" : "创建服务单"].map((t, i) => `<button class="btn ${i === 0 ? "primary" : ""}">${t}</button>`).join("")}</div>
      </div>
      ${isGuide ? calendarMini() : healthMini()}
    </aside>
  `;
}

function renderSideInsights(domain) {
  return `
    <aside class="grid">
      ${feedPanel("实时动态")}
      ${donutPanel("状态分布", "总量", domainCount(domain), domain === "device" ? deviceSegments() : healthSegments())}
      ${suggestionPanel()}
    </aside>
  `;
}

function renderDetailStrip(domain) {
  const tabs = [
    ["老人档案", "profile"],
    ["家属绑定", "family"],
    ["服务记录", "services"],
    ["异常记录", "alerts"],
  ];
  return `
    <section class="panel">
      <div class="tabs" data-user-detail-tabs>
        ${tabs.map(([label, key], index) => `<button class="tab ${index === 0 ? "active" : ""}" type="button" data-user-detail-tab="${key}">${label}</button>`).join("")}
      </div>
      <div class="user-detail-tab-content" data-user-detail-content>${userDetailTabContent("profile")}</div>
    </section>
  `;
}

function userDetailTabContent(tab) {
  if (tab === "family") {
    return `
      <div class="grid section-grid" style="padding:14px">
        ${infoPanel("默认紧急联系人", [["姓名", "张小明"], ["关系", "儿子"], ["电话", "138****1234"], ["授权", "位置、健康、订单"], ["状态", "已绑定"]])}
        ${infoPanel("备用联系人", [["姓名", "李华"], ["关系", "女儿"], ["电话", "137****2468"], ["授权", "消息提醒、服务记录"], ["状态", "已绑定"]])}
        ${miniTable("家属绑定记录", [["张小明", "儿子", "138****1234", "默认联系人", "位置/健康/订单", "编辑"], ["李华", "女儿", "137****2468", "备用联系人", "消息/订单", "编辑"], ["王建国", "老伴", "136****7788", "紧急联系", "电话/SOS", "编辑"]], ["姓名", "关系", "手机号", "角色", "授权范围", "操作"])}
        ${timelinePanel("最近绑定记录", true)}
      </div>
    `;
  }
  if (tab === "services") {
    return `
      <div class="grid section-grid" style="padding:14px">
        ${miniTable("服务记录列表", orderRows(6).map((row) => [row[0], row[2], row[3], row[4], row[6], row[7], "查看"]), ["订单编号", "服务类型", "服务时间", "服务地点", "状态", "金额", "操作"])}
        ${timelinePanel("服务过程时间线", true)}
        ${infoPanel("服务统计", [["本月服务", "8 次"], ["已完成", "6 次"], ["进行中", "1 次"], ["满意度", "98.6%"]])}
        ${infoPanel("最近回访", [["回访时间", "05-20 16:30"], ["回访人", "客服小陈"], ["结果", "老人满意，家属已确认"], ["下次跟进", "06-03"]])}
      </div>
    `;
  }
  if (tab === "alerts") {
    return `
      <div class="grid section-grid" style="padding:14px">
        ${miniTable("异常记录列表", rowsForDomain("exception").slice(0, 5), ["时间", "类型", "对象", "状态", "处理人", "操作"])}
        ${infoPanel("最近异常详情", [["异常类型", "设备离线"], ["发生时间", "05-20 09:18"], ["当前位置", "昆明市五华区学府路88号"], ["处理状态", "处理中"]])}
        ${timelinePanel("异常处理过程", true)}
        ${infoPanel("风险标记", [["健康风险", "低风险"], ["设备状态", "手环在线"], ["SOS记录", "近30天 1 次"], ["家属通知", "已通知默认联系人"]])}
      </div>
    `;
  }
  return `
    <div class="grid section-grid" style="padding:14px">
      ${infoPanel("基本健康信息", [["健康状态", "良好"], ["健康风险", "低风险（绿色）"], ["身高/体重", "158cm / 58kg"], ["常用药物", "降压药（每日1次）"]])}
      ${infoPanel("基础档案", [["姓名", "李秀兰"], ["性别", "女"], ["年龄", "72 岁"], ["居住地址", "昆明市五华区学府路88号"]])}
      ${healthMini(true)}
      ${timelinePanel("最近服务记录", true)}
    </div>
  `;
}

function renderRelatedCards(domain) {
  const names = domain === "merchant" ? ["云康护理中心", "弥勒阳光陪伴", "红河导游服务中心", "乐享旅居生活馆"] : ["李奶奶", "王爷爷", "张奶奶", "赵爷爷"];
  return `
    <section class="panel">
      <div class="panel-head"><h2>相关推荐</h2><span class="right"><button class="link">查看全部 ${chevron("right")}</button></span></div>
      <div class="grid section-grid" style="padding:14px">
        ${names.map((name, i) => `
          <div class="panel pad">
            <div class="person-row"><span class="photo ${i % 2 ? "female" : ""}"></span><div><strong>${name}</strong><div class="muted small">${["陪伴就医", "生活陪伴", "导游游览", "康养护理"][i]}</div></div></div>
            <div style="margin-top:12px">${tag(i === 1 ? "待审核" : "已认证", i === 1 ? "orange" : "green")} <span class="muted small">评分 ${(4.6 + i / 10).toFixed(1)}</span></div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function dispatchRecommend(title = "智能派单推荐") {
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2><span class="right"><button class="link">换一批</button></span></div>
      <div class="form-body">
        <div class="panel pad" style="box-shadow:none">
          <strong>任务：DD20240519001　|　陪伴就医 ${tag("高优先级", "orange")}</strong>
          <div class="muted small" style="margin-top:8px">老人：李奶奶（72岁）　预约：05-19 09:30　距离要求：越近越好</div>
          <div style="margin-top:12px">${mapPanel(false)}</div>
        </div>
        ${["李向导", "张小明", "赵玲玲", "云康护理中心"].map((name, i) => `
          <div class="tree-row">
            <span class="photo ${i === 2 ? "female" : ""}" style="width:34px;height:34px"></span>
            <strong>${name}</strong>
            <span class="muted">评分 ${(4.9 - i * 0.1).toFixed(1)}</span>
            <div class="progress" style="width:78px;--bar:#20be70"><span style="width:${96 - i * 6}%"></span></div>
            <button class="btn" style="min-width:58px">选择</button>
          </div>
        `).join("")}
        <div class="chip-row"><button class="btn primary">一键派单</button><button class="btn">改派</button><button class="btn">通知执行方</button></div>
      </div>
    </section>
  `;
}

function dispatchBoardTimeSlot(value = "") {
  const match = String(value || "").match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  const hour = Number(match[1]);
  if (hour < 12) return 0;
  if (hour < 15) return 1;
  if (hour < 18) return 2;
  return 3;
}

function dispatchBoardRows() {
  const queue = adminDispatchState.queue || {};
  const slots = ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"];
  const rows = [
    { key: "pending", label: "待派单池", tone: "orange", cells: slots.map(() => []) },
    { key: "guide", label: "人工向导", tone: "blue", cells: slots.map(() => []) },
    { key: "merchant", label: "商户服务", tone: "green", cells: slots.map(() => []) },
  ];
  const pushItem = (rowKey, timeText, text, status, tone = "") => {
    const row = rows.find((item) => item.key === rowKey);
    if (!row) return;
    row.cells[dispatchBoardTimeSlot(timeText)].push({
      text,
      status,
      tone: tone || row.tone,
    });
  };
  (queue.pendingOrders || []).forEach((order) => {
    pushItem(
      "pending",
      order.time || order.createdAt || "",
      `${order.serviceType || "待派单"} - ${order.elderName || "未命名老人"}`,
      order.status || "待派单",
      "orange",
    );
  });
  (queue.activeTasks || []).forEach((task) => {
    const rowKey = task.assigneeType === "merchant" ? "merchant" : "guide";
    pushItem(
      rowKey,
      task.order?.time || task.updatedAt || "",
      `${task.order?.serviceType || task.serviceType || "服务任务"} - ${task.order?.elderName || task.elderName || "未命名老人"}`,
      task.status || "执行中",
      rowKey === "merchant" ? "green" : "blue",
    );
  });
  return { slots, rows };
}

function scheduleBoard() {
  const board = dispatchBoardRows();
  return `
    <section class="panel">
      <div class="panel-head"><h2>调度看板</h2></div>
      <div style="padding:14px;overflow:auto">
        <div style="display:grid;grid-template-columns:100px repeat(4,1fr);min-width:720px;border:1px solid var(--line);border-radius:6px;overflow:hidden">
          ${["", ...board.slots].map((label) => `<div style="padding:10px;background:#f7f9fd;border-bottom:1px solid var(--line);font-weight:800">${label}</div>`).join("")}
          ${board.rows.map((row) => `
            <div style="padding:12px;border-top:1px solid var(--line);font-weight:800">${row.label}</div>
            ${row.cells.map((cell) => `
              <div style="padding:8px;border-top:1px solid var(--line);border-left:1px solid var(--line);display:flex;flex-direction:column;gap:8px">
                ${cell.length
                  ? cell.map((item) => `<span class="tag ${item.tone}">${escapeHtml(item.text)}<br><span class="small">${escapeHtml(item.status)}</span></span>`).join("")
                  : `<span class="muted small">当前时段暂无任务</span>`}
              </div>
            `).join("")}
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function formSection(title, rows, tags = ["居家护理", "康复理疗", "术后康复", "慢病管理"]) {
  return `
    <section class="panel form-section">
      <div class="panel-head"><h2>${title}</h2></div>
      <div class="form-body">
        ${rows.map(([label, value]) => formLine(label, value)).join("")}
        <div class="form-row"><label>标签</label><div class="chip-row">${tags.map((t) => tag(t, "blue")).join("")}<button class="btn">添加标签</button></div></div>
      </div>
    </section>
  `;
}

function formLine(label, value) {
  return `<div class="form-row"><label>${label}</label><input class="form-control" value="${value}" /></div>`;
}

function mediaSection(page = {}) {
  const isActivity = page.id === "activity-edit";
  const isGuide = page.id === "guide-create";
  const media = mediaAssetsForPage(page);
  return `
    <section class="panel form-section">
      <div class="panel-head"><h2>二、图片与介绍</h2></div>
      <div class="form-body">
        <div class="upload-grid">
          <div class="image-thumb featured">${adminImg(media[0], isGuide ? "向导头像" : isActivity ? "活动封面" : "服务封面")}</div>
          <div class="upload-box">${isGuide ? "上传头像" : "上传封面"}</div>
          <div class="image-thumb">${adminImg(media[1], "补充图片")}</div>
          <div class="upload-box">上传更多</div>
        </div>
        <div class="form-row"><label>${isGuide ? "个人简介" : isActivity ? "活动简介" : "服务简介"}</label><textarea class="textarea">${isGuide ? "熟悉昆明三甲医院就医流程，擅长陪诊、取号、排队、报告解读与老人情绪安抚。" : isActivity ? "面向旅居老人组织晨练太极活动，结识同伴、舒展筋骨，享受健康清晨。" : "专业护理团队提供居家护理、康复理疗等服务，帮助老人恢复健康、提高生活质量。"}</textarea></div>
        <div class="form-row"><label>详细说明</label><textarea class="textarea">${isGuide ? "可提供陪伴就医、生活陪伴、城市导览与应急协助服务，平台审核通过后上线接单。" : isActivity ? "活动包含热身、基础太极招式练习、放松拉伸与社群交流，现场配备志愿者协助。" : "我们提供24小时居家护理服务，包含基础护理、康复理疗、慢病管理、术后康复、心理关怀等。"}</textarea></div>
      </div>
    </section>
  `;
}

function mediaAssetsForPage(page = {}) {
  if (page.id === "activity-edit") {
    return ["/user/assets/activity-taiji.jpg", "/user/assets/activity-calligraphy.jpg", "/user/assets/activity-music.jpg"];
  }
  if (page.id === "article-edit") {
    return ["/merchant/assets/service-care.png", "/merchant/assets/service-rehab.png", "/merchant/assets/service-doctor.png"];
  }
  if (page.id === "guide-create") {
    return ["/prototype/guide/assets/guide-avatar-li.png", "/prototype/guide/assets/review-photo-hall.jpg", "/prototype/guide/assets/review-photo-medicine.jpg"];
  }
  return ["/merchant/assets/service-care.png", "/merchant/assets/store-room.png", "/merchant/assets/store-front.png"];
}

function priceSection(page = {}) {
  const isActivity = page.id === "activity-edit";
  const isGuide = page.id === "guide-create";
  return `
    <section class="panel form-section">
      <div class="panel-head"><h2>三、${isActivity ? "报名规则" : "价格与套餐"}</h2></div>
      <div class="form-body">
        ${formLine(isActivity ? "报名费用" : "服务价格", isActivity ? "免费" : isGuide ? "80.00 / 小时" : "160.00")}
        ${formLine(isActivity ? "报名人数限制" : "预约人数限制", isActivity ? "50 人" : "1-1 人")}
        ${formLine(isActivity ? "活动时长" : "服务时长", isActivity ? "90 分钟" : "最短 1 小时起订")}
        ${tablePanel(isActivity ? "报名规则（可选）" : "套餐设置（可选）", isActivity ? [["基础名额", "50人", "免费", "需审核"], ["候补名额", "20人", "免费", "自动递补"], ["志愿者名额", "8人", "免费", "后台确认"]] : isGuide ? [["陪伴就医", "半天", "¥160.00", "含报告陪取"], ["生活陪伴", "2小时", "¥80.00", "可续时"], ["城市导览", "4小时", "¥260.00", "含路线规划"]] : [["基础套餐", "2小时", "¥300.00", "—"], ["标准套餐", "4小时", "¥560.00", "9.3折"], ["尊享套餐", "8小时", "¥1,040.00", "9折"]], isActivity ? ["规则", "容量", "费用", "审核"] : ["套餐名称", "时长", "价格（元）", "优惠"])}
      </div>
    </section>
  `;
}

function timeSection(page = {}) {
  const isActivity = page.id === "activity-edit";
  return `
    <section class="panel form-section">
      <div class="panel-head"><h2>四、${isActivity ? "活动时间" : "可预约时间"}</h2></div>
      <div class="form-body">
        <div class="chip-row">${(isActivity ? ["报名中", "活动前24小时截止", "支持候补"] : ["全天可预约", "自定义时间", "支持预约未来30天"]).map((t, i) => tag(t, i === 1 ? "blue" : "green")).join("")}</div>
        ${(isActivity ? ["05-20 周一", "05-22 周三", "05-24 周五", "05-26 周日"] : ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]).map((d) => `<div class="form-row"><label>${d}</label><div class="chip-row">${tag(isActivity ? "07:30" : "08:00", "blue")} ${tag(isActivity ? "报名中" : "14:00", "blue")} ${tag(isActivity ? "翠湖公园" : d === "周六" || d === "周日" ? "休息" : "20:00", isActivity || d === "周六" || d === "周日" ? "orange" : "blue")}</div></div>`).join("")}
      </div>
    </section>
  `;
}

function areaSection() {
  return `
    <section class="panel form-section">
      <div class="panel-head"><h2>五、服务区域</h2></div>
      <div class="form-body">
        ${formLine("服务城市", "昆明市")}
        <div class="form-row"><label>上架区域</label><div class="chip-row">${["五华区", "盘龙区", "官渡区", "西山区"].map((t) => tag(t, "blue")).join("")}</div></div>
        ${formLine("服务半径", "80 公里")}
        ${mapPanel(false)}
      </div>
    </section>
  `;
}

function notesSection() {
  return `
    <section class="panel form-section">
      <div class="panel-head"><h2>六、运营说明</h2></div>
      <div class="form-body">
        <div class="form-row"><label>适用人群</label><div class="chip-row">${["中重老人", "半自理老人", "独居老人"].map((t) => tag(t, "blue")).join("")}</div></div>
        <div class="form-row"><label>服务特色</label><div class="chip-row">${["专业护理团队", "个性化服务", "安全保障", "定期健康评估"].map((t) => tag(t, "blue")).join("")}</div></div>
        <div class="form-row"><label>注意事项</label><textarea class="textarea" placeholder="请输入需要特别说明的注意事项"></textarea></div>
      </div>
    </section>
  `;
}

function phonePreview(page = {}) {
  const isActivity = page.id === "activity-edit";
  const title = isActivity ? "晨练太极·健康每一天" : "居家护理服务";
  const price = isActivity ? "免费" : "¥160";
  const tags = isActivity ? ["康养活动", "太极晨练", "免费报名", "社群交流"] : ["医疗卫生", "居家护理", "术后康复", "慢病管理"];
  const cover = mediaAssetsForPage(page)[0];
  return `
    <aside class="panel phone-preview">
      <div class="panel-head" style="padding:0 0 12px;border-bottom:0"><h2>用户端预览</h2><span class="right">${tag("移动端", "blue")} ${tag("PC端", "green")}</span></div>
      <div class="phone-shell">
        <div class="service-cover">${adminImg(cover, title)}</div>
        <div class="phone-content">
          <div class="profile-name">${title} ${tag(isActivity ? "报名中" : "已认证", "green")}</div>
          <div class="chip-row" style="margin:10px 0">${tags.map((t) => tag(t, "green")).join("")}</div>
          <div><span class="price">${price}</span><span class="muted"> ${isActivity ? "" : "起 / 小时"}</span></div>
          <div class="grid" style="grid-template-columns:repeat(4,1fr);margin-top:16px;text-align:center;color:#65708a">
            ${(isActivity ? ["活动陪伴", "专业带练", "安全保障", "结识同伴"] : ["24小时服务", "专业护理团队", "持证上岗", "售后保障"]).map((text) => `<span>${text}</span>`).join("")}
          </div>
        </div>
      </div>
      <div class="detail-list">
        ${infoPanel(isActivity ? "活动信息" : "服务商家", isActivity ? [["活动地点", "翠湖公园"], ["报名人数", "28/50 人"], ["活动时间", "05-20 07:30"]] : [["云康护理中心", "已认证"], ["服务区域", "昆明市 五华区等8个区域"], ["可预约时间", "08:00 - 20:00"]])}
        ${infoPanel("发布前检查", [["类目合规", "符合要求"], ["资质齐全", "符合要求"], ["风险检测", "无风险"]])}
      </div>
    </aside>
  `;
}

function formAssistPanel(page = {}) {
  const isGuide = page.id === "guide-create";
  return `
    <aside class="grid">
      ${infoPanel("填写进度", [["基础信息", "已完成"], ["图片与介绍", "待完善"], ["价格设置", "已完成"], ["发布检查", "待检查"]])}
      ${isGuide ? guideProfileCard() : suggestionPanel()}
      ${feedPanel("最近草稿")}
    </aside>
  `;
}

function guideProfileCard() {
  return `
    <section class="panel pad guide-profile-card">
      <div class="profile-block">
        <div class="avatar"></div>
        <div>
          <h3>李向导</h3>
          <p class="muted">陪伴就医 / 生活陪伴 / 城市导览</p>
          <div class="chip-row">${["身份证已核验", "健康证有效", "评分4.9"].map((item) => tag(item, "green")).join("")}</div>
        </div>
      </div>
      <div class="detail-list" style="padding:12px 0 0">
        ${[["实名状态", "已认证"], ["服务城市", "昆明市"], ["可接单时段", "08:00-20:00"], ["风险检测", "通过"]].map(([label, value]) => `<div class="profile-row"><span>${label}</span><strong>${value}</strong></div>`).join("")}
      </div>
    </section>
  `;
}

function infoPanel(title, rows, actionName) {
  const showPanelEdit = actionName === false ? false : !["order-detail", "permission", "dispatch-detail"].includes(currentPage().id);
  const explicitAction = typeof actionName === "string" && actionName ? ` data-action="${escapeHtml(actionName)}"` : "";
  return `
    <section class="panel pad">
      <div class="panel-title" style="margin-bottom:14px">${title}${showPanelEdit ? `<button class="link" type="button" style="float:right"${explicitAction}>编辑</button>` : ""}</div>
      <div class="kv-grid">
        ${rows.map(([key, value]) => `<div class="kv"><span>${key}</span><strong>${value}</strong></div>`).join("")}
      </div>
    </section>
  `;
}

function tagPanel(title, tags) {
  const showPanelEdit = currentPage().id !== "order-detail";
  return `
    <section class="panel pad">
      <div class="panel-title" style="margin-bottom:14px">${title}${showPanelEdit ? `<button class="link" style="float:right">编辑</button>` : ""}</div>
      <div class="chip-row">${tags.map((t, i) => tag(t, ["green", "orange", "blue"][i % 3])).join("")}<button class="btn">${icons.plus}添加标签</button></div>
    </section>
  `;
}

function deviceMiniPanel() {
  return `
    <section class="panel pad">
      <div class="panel-title" style="margin-bottom:14px">绑定设备<button class="link" style="float:right">管理设备</button></div>
      <div class="detail-list" style="padding:0">
        ${sample.devices.slice(0, 4).map((d) => `<div class="tree-row"><span class="form-icon">${icons.phone}</span><strong>${d[1]}</strong>${status(d[3], d[3] === "在线" ? "green" : "red")}<span class="muted">电量 ${d[4]}</span></div>`).join("")}
      </div>
      <div style="margin-top:12px"><button class="link">共4台设备，查看全部 ${chevron("right")}</button></div>
    </section>
  `;
}

function healthTrendPanel() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>最近健康数据（今日统计）</h2></div>
      <div class="grid" style="grid-template-columns:repeat(5,1fr);padding:14px">
        ${[
          ["心率", "78 次/分", "正常", "#ff5252"],
          ["血压", "128/78 mmHg", "正常", "#ff8a24"],
          ["血氧", "98%", "正常", "#20be70"],
          ["睡眠", "6.8 小时", "良好", "#8056e8"],
          ["步数", "6,842 步", "良好", "#176bff"],
        ].map(([name, value, state, color]) => `
          <div>
            <div class="muted">${name} <span style="float:right">${tag(state, "green")}</span></div>
            <div class="kpi-value" style="font-size:21px">${value}</div>
            ${sparkline(color)}
          </div>`).join("")}
      </div>
    </section>
  `;
}

function sparkline(color) {
  const bars = Array.from({ length: 18 }, (_, i) => 16 + ((i * 7) % 29));
  return `<svg class="mini-chart" viewBox="0 0 150 70" preserveAspectRatio="none">${bars.map((h, i) => `<rect x="${i * 8 + 2}" y="${62 - h}" width="4" height="${h}" rx="2" fill="${color}" opacity="${0.45 + i / 45}"/>`).join("")}<polyline points="${bars.map((h, i) => `${i * 8 + 4},${62 - h}`).join(" ")}" fill="none" stroke="${color}" stroke-width="2"/></svg>`;
}

function healthMini(plain = false) {
  const body = `
    <div class="kv-grid">
      ${[["心率", "78 次/分"], ["血压", "128/78 mmHg"], ["血氧", "98%"], ["体温", "36.6℃"], ["步数", "5,632 步"]].map(([k, v]) => `<div class="kv"><span>${k}</span><strong>${v}</strong>${tag(k === "步数" ? "良好" : "正常", "green")}</div>`).join("")}
    </div>
  `;
  return plain ? `<section>${body}</section>` : `<div class="form-body">${body}</div>`;
}

function calendarMini() {
  return `
    <div class="form-body">
      <div class="panel-title">本周排班</div>
      <div class="grid" style="grid-template-columns:repeat(7,1fr);gap:8px">
        ${["20 一", "21 二", "22 三", "23 四", "24 五", "25 六", "26 日"].map((d, i) => `<div class="panel pad" style="text-align:center;box-shadow:none">${d}<br>${tag(i === 2 || i === 5 ? "休" : "班", i === 2 || i === 5 ? "orange" : "green")}</div>`).join("")}
      </div>
    </div>
  `;
}

function timelinePanel(title, compact = false) {
  const rows = [
    ["05-19 10:25", "上门护理服务", "已完成"],
    ["05-18 16:30", "健康咨询", "已完成"],
    ["05-17 09:15", "设备巡检", "已完成"],
    ["05-16 15:00", "体检预约陪同", "进行中"],
    ["05-15 11:20", "紧急协助", "已取消"],
  ];
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2><span class="right"><button class="link">查看全部 ${chevron("right")}</button></span></div>
      <div class="timeline">
        ${rows.slice(0, compact ? 4 : 5).map(([time, name, state]) => `<div class="timeline-item"><span class="timeline-time">${time}</span><div class="timeline-content"><strong>${name}</strong>${status(state, state === "已完成" ? "green" : state === "进行中" ? "blue" : "red")}</div></div>`).join("")}
      </div>
    </section>
  `;
}

function paymentPanel() {
  return tablePanel("付款与退款记录", [["05-19 09:30", "微信支付", "¥120.00", "已支付"], ["--", "退款记录", "暂无退款记录", "--"]], ["时间", "类型", "金额", "状态"]);
}

function statusInterventionPanel() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>状态干预</h2></div>
      <div class="form-body">
        ${formLine("当前状态", "服务中")}
        ${formLine("目标状态", "待确认")}
        ${formLine("原因", "用户要求暂停服务")}
        <div class="form-row"><label>备注</label><textarea class="textarea" placeholder="请输入备注信息，不超过200字"></textarea></div>
        <div class="chip-row"><button class="btn">取消</button><button class="btn primary">确定</button></div>
      </div>
    </section>
  `;
}

function suggestionPanel() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>AI 风险解释与建议</h2><span class="right"><button class="link">查看更多 ${chevron("right")}</button></span></div>
      <div class="detail-list">
        ${[
          ["高风险：心率持续偏高", "近1小时心率均值 >120 次/分，建议关注情绪波动、发热或心血管风险。"],
          ["中风险：血压偏高", "最近3次血压测量均高于正常范围，建议提醒按时服药。"],
          ["中风险：长时未动", "已超过2小时未活动，可能存在跌倒或睡眠异常风险。"],
        ].map(([t, d], i) => `<div class="panel pad" style="box-shadow:none"><strong>${tag(i === 0 ? "高" : "中", i === 0 ? "red" : "orange")} ${t}</strong><p class="muted" style="margin:8px 0 0">${d}</p></div>`).join("")}
      </div>
    </section>
  `;
}

function feedPanel(title) {
  const feed = [
    ["SOS", "SOS 紧急求助", "李奶奶：按下SOS按钮", "10:28", "#ff5252"],
    ["心", "心率异常", "刘奶奶：心率128次/分（高）", "10:27", "#ff7b45"],
    ["人", "疑似摔倒", "赵爷爷：检测到摔倒事件", "10:26", "#ffad24"],
    ["未", "长时未动", "陈奶奶：已超过2小时未活动", "10:24", "#20be70"],
    ["离", "设备离线", "手环 HR3882 已离线", "10:23", "#4d94ff"],
  ];
  return `
    <section class="panel">
      <div class="panel-head"><h2>${title}</h2><span class="right"><button class="link">查看更多 ${chevron("right")}</button></span></div>
      <div class="feed-list">
        ${feed.map(([icon, name, desc, time, color]) => `<div class="feed-item"><span class="feed-icon" style="--feed:${color}">${icon}</span><span><strong>${name}</strong><br><span class="muted small">${desc}</span></span><span class="muted small">${time}</span></div>`).join("")}
      </div>
    </section>
  `;
}

function qaPanel() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>AI 问答测试</h2><span class="right">${selectPill("通用模型（推荐）")}</span></div>
      <div class="form-body">
        <div class="panel pad" style="box-shadow:none;background:#f5f8ff;margin-left:80px">昆明旅居补贴申请条件是什么？</div>
        <div class="panel pad" style="box-shadow:none">昆明市旅居补贴主要面向60周岁及以上老年人，需满足居住时长、年龄、未享受同类补贴等条件。</div>
        <div class="field"><input placeholder="请输入问题，按 Enter 发送" /><button class="btn primary">${icons.send}发送</button></div>
      </div>
    </section>
  `;
}

function knowledgeDetail() {
  return `
    <section class="panel">
      <div class="panel-head"><h2>知识详情</h2><span class="right">${tag("已发布", "green")}</span></div>
      <div class="form-body">
        ${formLine("标题", "昆明旅居补贴申请条件是什么？")}
        <div class="form-row"><label>知识分类</label><div class="chip-row">${tag("旅居政策", "blue")} ${tag("昆明市", "green")} ${tag("大理市", "green")}</div></div>
        <div class="form-row"><label>问题变体</label><textarea class="textarea">昆明旅居补贴怎么领？\n昆明长者旅居补贴需要什么条件？</textarea></div>
        <div class="form-row"><label>标准答案</label><textarea class="textarea">昆明市旅居补贴主要面向60周岁及以上老年人，需满足居住、年龄和材料要求。</textarea></div>
        ${formLine("来源引用", "昆明市民政局（2024）15号")}
        ${sliderRow("置信度阈值", "70%")}
      </div>
    </section>
  `;
}

function routePreview() {
  return `<section class="panel"><div class="panel-head"><h2>路线与距离预览</h2></div><div style="padding:14px">${mapPanel(false)}</div></section>`;
}

function selectPill(text) {
  return `<button class="btn ghost" style="height:30px;min-width:auto">${text} ${chevron("down")}</button>`;
}

function ruleCondition(a, b, c) {
  return `<div class="rule-condition"><input class="form-control" value="${a}" /><input class="form-control" value="${b}" /><input class="form-control" value="${c}" /><button class="tool-icon">${icons.alert}</button></div>`;
}

function sliderRow(label, value) {
  return `<div class="slider-row"><span>${label}</span><div class="slider" style="--value:${value}"></div><strong>${value}</strong></div>`;
}

function status(text, color) {
  return `<span class="status ${color}">${text}</span>`;
}

function tag(text, color = "blue") {
  return `<span class="tag ${color}">${text}</span>`;
}

function chevron(direction) {
  const paths = {
    down: "m7 10 5 5 5-5",
    right: "m9 6 6 6-6 6",
    left: "m15 6-6 6 6 6",
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;vertical-align:-2px"><path d="${paths[direction]}"/></svg>`;
}

function bindRoutes() {
  document.querySelectorAll("[data-admin-account-toggle]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      adminUiState.accountMenuOpen = !adminUiState.accountMenuOpen;
      render();
    }, true);
  });
  document.querySelectorAll("[data-admin-menu-toggle]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleAdminSidebar();
    }, true);
  });
  document.querySelectorAll('[data-action^="编辑Banner"], [data-action^="删除Banner"]').forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleAdminBannerAction(el.getAttribute("data-action") || el.textContent.trim(), el, currentPage());
    }, true);
  });
  document.querySelectorAll("[data-page-action]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleAdminPagination(el);
    }, true);
  });
  document.querySelectorAll("[data-user-detail-tab]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      activateUserDetailTab(el);
    }, true);
  });
  document.querySelectorAll("[data-merchant-review-tab]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      activateMerchantReviewTab(el);
    }, true);
  });
  document.querySelectorAll("[data-admin-calendar-month], [data-admin-calendar-date]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleAdminActivityCalendar(el);
    }, true);
  });
  document.querySelectorAll("[data-admin-activity-star]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleAdminActivityStar(el);
    }, true);
  });
  document.querySelectorAll("[data-admin-activity-select]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", () => {
      adminActivityState.selectedId = el.getAttribute("data-admin-activity-select") || adminActivityState.selectedId;
    }, true);
  });
  document.querySelectorAll("[data-admin-notification-filter]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleAdminNotificationAction("筛选", el);
    }, true);
  });
  document.querySelectorAll("[data-admin-notification-search], [data-admin-notification-reset], [data-admin-notification-refresh], [data-admin-notification-read-all], [data-admin-notification-read]").forEach((el) => {
    delete el.dataset.action;
    el.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setButtonBusy(el, true);
      try {
        await handleAdminNotificationAction("通知操作", el);
      } catch (error) {
        adminNotificationState.notice = error.message;
        render();
      } finally {
        setButtonBusy(el, false);
      }
    }, true);
  });
  document.querySelectorAll("[data-route]").forEach((el) => {
    el.addEventListener("click", () => {
      adminUiState.accountMenuOpen = false;
      const route = normalizeAdminPageId(el.getAttribute("data-route"));
      if (!route) {
        showToast("管理后台导航目标无效，已拦截跨端跳转");
        return;
      }
      rememberAdminOrderSelection(el, route);
      rememberAdminDispatchSelection(el, route);
      rememberAdminDeviceSelection(el, route);
      rememberAdminExceptionSelection(el, route);
      if (route === currentPage().id) {
        refreshAdminCurrentPage(el);
        return;
      }
      location.hash = pageHref(route);
    });
  });
  document.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", async () => {
      adminUiState.accountMenuOpen = false;
      const actionName = el.getAttribute("data-action") || el.textContent.trim() || "操作";
      setButtonBusy(el, true);
      if (actionName === "刷新大屏数据") {
        adminScreenState.loaded = false;
        adminScreenState.data = null;
        adminScreenState.error = "";
        render();
        ensureScreenData(currentPage());
        setButtonBusy(el, false);
        return;
      }
      if (actionName === "刷新后台功能总览") {
        adminFunctionOverviewState.loaded = false;
        adminFunctionOverviewState.data = null;
        adminFunctionOverviewState.error = "";
        render();
        ensureAdminFunctionOverview(currentPage());
        setButtonBusy(el, false);
        return;
      }
      try {
        const deviceHandled = await handleAdminDeviceManagementAction(actionName, el, currentPage());
        if (deviceHandled) {
          setButtonBusy(el, false);
          return;
        }
      } catch (error) {
        showToast(error.message);
        setButtonBusy(el, false);
        return;
      }
      if (actionMatches(actionName, ["查询"])) {
        const count = applyAdminTableFilter(el.closest(".filters"));
        showToast(count ? `已筛选出 ${count} 条记录` : "暂无匹配记录");
        setButtonBusy(el, false);
        return;
      }
      if (actionMatches(actionName, ["重置筛选", "重置"])) {
        if (currentPage().group === "order" && adminOrderListState.statusFilter) {
          adminOrderListState.statusFilter = "";
          render();
          showToast("订单状态筛选已重置");
          setButtonBusy(el, false);
          return;
        }
        if (currentPage().group === "dispatch" && adminDispatchState.statusFilter) {
          adminDispatchState.statusFilter = "";
          render();
          showToast("任务状态筛选已重置");
          setButtonBusy(el, false);
          return;
        }
        el.closest(".filters")?.querySelectorAll("input").forEach((input) => {
          input.value = "";
        });
        applyAdminTableFilter(null);
        showToast("筛选条件已重置");
        setButtonBusy(el, false);
        return;
      }
      if (actionMatches(actionName, ["登出", "退出"])) {
        adminScreenState.token = "";
        adminUiState.accountMenuOpen = false;
        recordAdminOperation("退出登录", currentAdminPermissionPerson().account);
        saveAdminPermissionSession(ADMIN_DEFAULT_ACCOUNT);
        location.hash = pageHref("login");
        setButtonBusy(el, false);
        return;
      }
      try {
        const realtimeHandled = await handleAdminRealtimeAction(actionName, el);
        if (realtimeHandled) return;
        const businessHandled = await window.YunlvBusiness?.handleAction?.({
          role: "admin",
          route: currentPage().id,
          actionName,
          button: el,
          showToast,
        });
        if (businessHandled) return;
      } catch (error) {
        showToast(error.message);
        return;
      } finally {
        setButtonBusy(el, false);
      }
      handleAdminFallbackAction(actionName, el, currentPage());
    });
  });
  document.querySelectorAll("[data-admin-global-search]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        clearAdminGlobalSearch();
        showToast("搜索条件已清空");
        return;
      }
      if (event.key !== "Enter") return;
      event.preventDefault();
      runAdminGlobalSearch(input);
    });
    input.addEventListener("input", () => {
      if (input.value.trim()) return;
      window.setTimeout(clearAdminGlobalSearch, 0);
    });
  });
  document.querySelectorAll("[data-admin-search-submit]").forEach((button) => {
    delete button.dataset.action;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const input = button.closest(".search")?.querySelector("[data-admin-global-search]");
      runAdminGlobalSearch(input);
    }, true);
  });
}

function handleAdminActivityCalendar(el) {
  const monthAction = el.getAttribute("data-admin-calendar-month");
  if (monthAction) {
    const offset = monthAction === "prev" ? -1 : 1;
    const date = new Date(adminContentCalendarState.year, adminContentCalendarState.month + offset, 1);
    adminContentCalendarState.year = date.getFullYear();
    adminContentCalendarState.month = date.getMonth();
    adminContentCalendarState.day = Math.min(adminContentCalendarState.day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
    render();
    showToast(`日历定位到${adminContentCalendarState.year}年${adminContentCalendarState.month + 1}月`);
    return;
  }
  const dateText = el.getAttribute("data-admin-calendar-date");
  if (!dateText) return;
  const [year, month, day] = dateText.split("-").map((item) => Number(item));
  const normalized = new Date(year, month - 1, day);
  adminContentCalendarState.year = normalized.getFullYear();
  adminContentCalendarState.month = normalized.getMonth();
  adminContentCalendarState.day = normalized.getDate();
  render();
  showToast(`已选择${adminContentCalendarState.month + 1}月${adminContentCalendarState.day}日活动`);
}

function handleAdminActivityStar(button) {
  const active = button.getAttribute("aria-pressed") !== "true";
  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", active ? "true" : "false");
  button.textContent = active ? "★" : "☆";
  const rowTitle = button.closest("tr")?.querySelector(".admin-activity-title-link")?.textContent.trim() || "活动";
  showToast(`${rowTitle}${active ? "已设为推荐位" : "已取消推荐位"}`);
}

function applyAdminTableFilter(filtersEl, keyword = "") {
  const values = filtersEl
    ? [...filtersEl.querySelectorAll("input")].map((input) => input.value.trim()).filter(Boolean)
    : [String(keyword || "").trim()].filter(Boolean);
  const rows = [...document.querySelectorAll(".table-wrap tbody tr")];
  let visible = 0;
  rows.forEach((row) => {
    if (row.dataset.emptyRow === "true") {
      row.remove();
      return;
    }
    const text = row.textContent.replace(/\s+/g, " ");
    const matched = !values.length || values.every((value) => text.includes(value));
    row.dataset.filterMatched = matched ? "true" : "false";
    row.hidden = !matched;
    if (matched) visible += 1;
  });
  const tableWrap = document.querySelector(".table-wrap");
  const tablePanelNode = tableWrap?.closest(".panel");
  const heading = tablePanelNode?.querySelector("[data-table-title-base]");
  if (heading) heading.textContent = `${heading.dataset.tableTitleBase || "列表"} 共 ${visible} 条`;
  const tbody = tableWrap?.querySelector("tbody");
  if (tbody && rows.length && visible === 0) {
    const cols = tableWrap.querySelectorAll("thead th").length || 1;
    tbody.insertAdjacentHTML("beforeend", `<tr data-empty-row="true"><td colspan="${cols}" style="text-align:center;color:#65708a;padding:28px">暂无匹配记录</td></tr>`);
  }
  return visible;
}

function applyAdminOrderQuickFilter(statusText = "") {
  adminOrderListState.statusFilter = adminOrderQuickFilterValue(statusText);
  render();
  return adminOrderListRowsForFilter(adminOrderListState.statusFilter).length;
}

function applyAdminMerchantServiceQuickFilter(label = "") {
  const filtersEl = document.querySelector(".filters");
  filtersEl?.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  const normalized = adminText(label);
  const statusMap = {
    已上架: "上架",
    待审核: "待审核",
    已下架: "已下架",
  };
  const inputs = filtersEl ? [...filtersEl.querySelectorAll("input")] : [];
  if (statusMap[normalized] && inputs[3]) {
    inputs[3].value = statusMap[normalized];
    return applyAdminTableFilter(filtersEl);
  }
  if (!normalized || normalized === "服务总数") return applyAdminTableFilter(filtersEl);
  const rows = [...document.querySelectorAll(".table-wrap tbody tr")];
  let visible = 0;
  rows.forEach((row) => {
    if (row.dataset.emptyRow === "true") {
      row.remove();
      return;
    }
    const orderText = row.querySelectorAll("td")[6]?.textContent || "0";
    const matched = normalized === "关联订单" ? Number(orderText.replace(/[^\d.-]/g, "") || 0) > 0 : true;
    row.hidden = !matched;
    if (matched) visible += 1;
  });
  const tableWrap = document.querySelector(".table-wrap");
  const heading = tableWrap?.closest(".panel")?.querySelector("[data-table-title-base]");
  if (heading) heading.textContent = `${heading.dataset.tableTitleBase || "列表"} 共 ${visible} 条`;
  const tbody = tableWrap?.querySelector("tbody");
  if (tbody && rows.length && visible === 0) {
    const cols = tableWrap.querySelectorAll("thead th").length || 1;
    tbody.insertAdjacentHTML("beforeend", `<tr data-empty-row="true"><td colspan="${cols}" style="text-align:center;color:#65708a;padding:28px">暂无匹配记录</td></tr>`);
  }
  return visible;
}

function applyAdminUserQuickFilter(label = "") {
  const filtersEl = document.querySelector(".filters");
  const inputs = filtersEl ? [...filtersEl.querySelectorAll("input")] : [];
  inputs.forEach((input) => {
    input.value = "";
  });
  const normalized = adminText(label);
  if (!normalized || normalized === "用户总数") return applyAdminUserTextFilter([]);
  if (normalized === "老人档案" && inputs[1]) {
    inputs[1].value = "老人用户";
    return applyAdminUserTextFilter(["老人用户"]);
  }
  if (normalized === "正常账号" && inputs[1]) {
    inputs[1].value = "正常";
    return applyAdminUserTextFilter(["正常"]);
  }
  if (normalized === "用户端账号") {
    return applyAdminUserRowPredicate((cells) => ["老人用户", "家属账号"].includes(adminText(cells[2]?.textContent)));
  }
  if (normalized === "家属联系人") {
    const firstProfileUserId = adminUserState.elderProfiles?.[0]?.userId;
    if (firstProfileUserId) {
      adminUserState.selectedUserId = firstProfileUserId;
      refreshAdminUserDetailPanel();
    }
    return applyAdminUserRowPredicate((cells) => adminText(cells[9]?.textContent).includes("联系人"));
  }
  if (normalized === "未读消息") {
    return applyAdminUserRowPredicate((cells) => Number(String(cells[7]?.textContent || "").replace(/[^\d.-]/g, "") || 0) > 0);
  }
  return applyAdminUserTextFilter([normalized]);
}

function applyAdminUserTextFilter(values = []) {
  const normalizedValues = values.map(adminText).filter(Boolean);
  return applyAdminUserRowPredicate((cells, row) => {
    const text = row.textContent.replace(/\s+/g, " ");
    return !normalizedValues.length || normalizedValues.every((value) => text.includes(value));
  });
}

function applyAdminUserRowPredicate(predicate) {
  const tableWrap = document.querySelector(".user-real-table .table-wrap");
  const rows = tableWrap ? [...tableWrap.querySelectorAll("tbody tr")] : [];
  let visible = 0;
  rows.forEach((row) => {
    if (row.dataset.emptyRow === "true") {
      row.remove();
      return;
    }
    const cells = row.querySelectorAll("td");
    const matched = Boolean(predicate(cells, row));
    row.hidden = !matched;
    row.dataset.filterMatched = matched ? "true" : "false";
    if (matched) visible += 1;
  });
  const heading = tableWrap?.closest(".panel")?.querySelector("[data-table-title-base]");
  if (heading) heading.textContent = `${heading.dataset.tableTitleBase || "列表"} 共 ${visible} 条`;
  const tbody = tableWrap?.querySelector("tbody");
  if (tbody && rows.length && visible === 0) {
    const cols = tableWrap.querySelectorAll("thead th").length || 1;
    tbody.insertAdjacentHTML("beforeend", `<tr data-empty-row="true"><td colspan="${cols}" style="text-align:center;color:#65708a;padding:28px">暂无匹配记录</td></tr>`);
  }
  return visible;
}

function applyAdminGuideQuickFilter(label = "") {
  const filtersEl = document.querySelector(".filters");
  const inputs = filtersEl ? [...filtersEl.querySelectorAll("input")] : [];
  inputs.forEach((input) => {
    input.value = "";
  });
  const normalized = adminText(label);
  if (!normalized || normalized === "向导总数") return applyAdminTableFilter(filtersEl);
  if (normalized === "已认证" && inputs[4]) {
    inputs[4].value = "已认证";
    return applyAdminTableFilter(filtersEl);
  }
  if (normalized === "在线向导" && inputs[3]) {
    inputs[3].value = "在线";
    return applyAdminTableFilter(filtersEl);
  }
  if (normalized === "在线接单" && inputs[4]) {
    inputs[4].value = "接单";
    return applyAdminTableFilter(filtersEl);
  }
  if (normalized === "待审核" && inputs[4]) {
    inputs[4].value = "待";
    return applyAdminTableFilter(filtersEl);
  }
  if (normalized === "本月订单") {
    const rows = [...document.querySelectorAll(".table-wrap tbody tr")];
    let visible = 0;
    rows.forEach((row) => {
      if (row.dataset.emptyRow === "true") {
        row.remove();
        return;
      }
      const monthText = row.querySelectorAll("td")[5]?.textContent || "0";
      const monthMatch = monthText.match(/本月\s*([\d,，.]+)/);
      const matched = Number((monthMatch?.[1] || "0").replace(/[^\d.-]/g, "") || 0) > 0;
      row.hidden = !matched;
      if (matched) visible += 1;
    });
    const tableWrap = document.querySelector(".table-wrap");
    const heading = tableWrap?.closest(".panel")?.querySelector("[data-table-title-base]");
    if (heading) heading.textContent = `${heading.dataset.tableTitleBase || "列表"} 共 ${visible} 条`;
    const tbody = tableWrap?.querySelector("tbody");
    if (tbody && rows.length && visible === 0) {
      const cols = tableWrap.querySelectorAll("thead th").length || 1;
      tbody.insertAdjacentHTML("beforeend", `<tr data-empty-row="true"><td colspan="${cols}" style="text-align:center;color:#65708a;padding:28px">暂无匹配记录</td></tr>`);
    }
    return visible;
  }
  return applyAdminTableFilter(filtersEl);
}

function applyAdminDeviceStatusQuickFilter(statusText = "") {
  const filtersEl = document.querySelector(".filters");
  const inputs = filtersEl ? [...filtersEl.querySelectorAll("input")] : [];
  const keywordInput = inputs[0];
  const statusInput = inputs[3];
  if (keywordInput) keywordInput.value = "";
  if (statusInput) statusInput.value = statusText === "全部" ? "" : statusText;
  const visible = applyAdminTableFilter(filtersEl);
  const pager = document.querySelector(".admin-pagination, .table-footer");
  if (pager) rebuildAdminPager(pager, 1);
  return visible;
}

function searchableAdminNodes() {
  return [...document.querySelectorAll(".content .panel, .content .metric, .content .service-card, .content .record, .content .admin-live-strip article")]
    .filter((node) => !node.closest(".table-panel, .full") || node.matches(".table-panel, .full"));
}

function clearAdminGlobalSearch() {
  document.querySelectorAll("[data-admin-search-hidden='true']").forEach((node) => {
    node.hidden = false;
    node.removeAttribute("data-admin-search-hidden");
  });
  document.querySelectorAll("[data-admin-search-empty='true']").forEach((node) => node.remove());
  document.body.classList.remove("admin-searching");
}

function runAdminGlobalSearch(input) {
  const keyword = String(input?.value || "").trim();
  clearAdminGlobalSearch();
  if (!keyword) {
    showToast("请输入搜索关键词");
    input?.focus?.();
    return 0;
  }
  const normalized = keyword.toLowerCase();
  let matched = 0;
  const rows = [...document.querySelectorAll(".content .table-wrap tbody tr")].filter((row) => row.dataset.emptyRow !== "true");
  rows.forEach((row) => {
    const hit = row.textContent.replace(/\s+/g, " ").toLowerCase().includes(normalized);
    row.hidden = !hit;
    if (!hit) row.dataset.adminSearchHidden = "true";
    if (hit) matched += 1;
  });
  searchableAdminNodes().forEach((node) => {
    const hasRows = node.querySelector?.(".table-wrap tbody tr");
    if (hasRows) return;
    const hit = node.textContent.replace(/\s+/g, " ").toLowerCase().includes(normalized);
    node.hidden = !hit;
    if (!hit) node.dataset.adminSearchHidden = "true";
    if (hit) matched += 1;
  });
  document.body.classList.add("admin-searching");
  if (!matched) {
    const content = document.querySelector(".content");
    content?.insertAdjacentHTML("afterbegin", `<section class="panel admin-search-empty" data-admin-search-empty="true">未找到与“${escapeHtml(keyword)}”相关的数据，请更换关键词。</section>`);
  }
  showToast(matched ? `搜索完成：${matched} 项匹配` : "暂无匹配数据");
  return matched;
}

function loadAdminAmap() {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (adminMapState.promise) return adminMapState.promise;
  window._AMapSecurityConfig = { securityJsCode: ADMIN_AMAP_SECURITY_JS_CODE };
  adminMapState.loading = true;
  adminMapState.promise = new Promise((resolve, reject) => {
    let settled = false;
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(ADMIN_AMAP_KEY)}&plugin=AMap.Scale`;
    script.async = true;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error("高德地图加载超时"));
    }, ADMIN_MAP_LOAD_TIMEOUT_MS);
    script.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.AMap ? resolve(window.AMap) : reject(new Error("高德地图加载失败"));
    };
    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      reject(new Error("高德地图脚本加载失败"));
    };
    document.head.appendChild(script);
  }).then((AMapRef) => {
    adminMapState.sdkReady = true;
    adminMapState.sdkError = "";
    return AMapRef;
  }).catch((error) => {
    adminMapState.sdkReady = false;
    adminMapState.sdkError = error.message;
    adminMapState.promise = null;
    throw error;
  }).finally(() => {
    adminMapState.loading = false;
  });
  return adminMapState.promise;
}

function setAdminMapStatus(container, title, detail = "") {
  const status = container?.querySelector?.("[data-admin-map-status]");
  if (!status) return;
  status.querySelector("strong").textContent = title;
  status.querySelector("span").textContent = detail;
}

function destroyAdminMapInstance() {
  adminMapState.markers.forEach((marker) => marker?.setMap?.(null));
  adminMapState.markers = [];
  if (adminMapState.map?.destroy) adminMapState.map.destroy();
  adminMapState.map = null;
}

function adminAmapMarkerContent(point) {
  return `
    <div class="admin-amap-marker ${point.id === adminMapState.selectedPointId ? "active" : ""}" style="--marker:${adminMapToneColor(point.tone)}">
      <b>${escapeHtml(point.metric || point.typeName || "点")}</b>
      <span>${escapeHtml(point.typeName || "")}</span>
    </div>
  `;
}

function mountAdminAmap(container, AMapRef, map, points, rawPointCount = points.length) {
  const canvas = container.querySelector("[data-admin-amap-canvas]");
  if (!canvas || !AMapRef?.Map) return;
  destroyAdminMapInstance();
  canvas.innerHTML = "";
  const lng = Number(container.dataset.adminMapCenterLng || map.center?.lng || 102.833);
  const lat = Number(container.dataset.adminMapCenterLat || map.center?.lat || 24.881);
  const amap = new AMapRef.Map(canvas, {
    center: [lng, lat],
    zoom: adminMapState.zoom,
    resizeEnable: true,
    viewMode: "2D",
  });
  if (AMapRef.Scale) amap.addControl(new AMapRef.Scale());
  const markers = points
    .filter((point) => Number.isFinite(Number(point.lng)) && Number.isFinite(Number(point.lat)))
    .map((point) => {
      const marker = new AMapRef.Marker({
        position: [Number(point.lng), Number(point.lat)],
        title: point.title || point.typeName || "业务点位",
        content: adminAmapMarkerContent(point),
        offset: new AMapRef.Pixel(-18, -36),
      });
      marker.on("click", () => {
        adminMapState.selectedPointId = point.id;
        if (point.route && pageById(point.route)) location.hash = pageHref(point.route);
      });
      return marker;
    });
  if (markers.length) amap.add(markers);
  if (markers.length > 1) amap.setFitView(markers, false, [50, 50, 50, 50]);
  adminMapState.map = amap;
  adminMapState.markers = markers;
  container.classList.add("is-amap-ready");
  container.classList.remove("is-map-fallback");
  setAdminMapStatus(
    container,
    `${map.providerName || "高德地图"}已接入`,
    `${map.bounds?.scope || "业务数据"} · ${Number(rawPointCount || points.length).toLocaleString("zh-CN")} 个当前业务点，聚合显示 ${points.length.toLocaleString("zh-CN")} 个标记`,
  );
}

function hydrateAdminMaps(root = document) {
  const containers = [...root.querySelectorAll("[data-admin-map]")];
  if (!containers.length) return;
  const map = adminMapData();
  const rawPoints = adminMapFilteredPoints(map);
  const points = adminMapRenderablePoints(rawPoints);
  containers.forEach((container) => {
    container.classList.toggle("is-map-empty", !points.length);
    setAdminMapStatus(
      container,
      adminMapState.sdkReady ? `${map.providerName || "高德地图"}已接入` : "正在接入高德地图",
      `${map.bounds?.scope || "业务数据"} · ${rawPoints.length.toLocaleString("zh-CN")} 个业务点，聚合显示 ${points.length.toLocaleString("zh-CN")} 个标记`,
    );
  });
  loadAdminAmap()
    .then((AMapRef) => containers.forEach((container) => mountAdminAmap(container, AMapRef, map, points, rawPoints.length)))
    .catch((error) => {
      containers.forEach((container) => {
      container.classList.add("is-map-fallback");
      setAdminMapStatus(container, "地图 SDK 暂不可用，已保留业务点位联动", error.message);
    });
  });
}

function handleAdminMapAction(target) {
  const pointButton = target.closest?.("[data-admin-map-point]");
  if (pointButton) {
    const point = adminMapRenderablePoints(adminMapFilteredPoints(adminMapData())).find((item) => item.id === pointButton.dataset.adminMapPoint);
    adminMapState.selectedPointId = pointButton.dataset.adminMapPoint || "";
    if (point?.route && pageById(point.route)) location.hash = pageHref(point.route);
    else render();
    return true;
  }

  const cityButton = target.closest?.("[data-admin-map-city]");
  if (cityButton) {
    const city = cityButton.dataset.adminMapCity || "";
    adminMapState.selectedCity = adminMapState.selectedCity === city ? "" : city;
    adminMapState.selectedPointId = "";
    render();
    return true;
  }

  const actionButton = target.closest?.("[data-admin-map-action]");
  if (!actionButton) return false;
  const action = actionButton.dataset.adminMapAction;
  const container = actionButton.closest("[data-admin-map]");
  const map = adminMapData();
  const rawPoints = adminMapFilteredPoints(map);
  const points = adminMapRenderablePoints(rawPoints);
  const selected = adminMapSelectedPoint(points);
  if (action === "zoom-in" || action === "zoom-out") {
    adminMapState.zoom = clampAdminZoom(adminMapState.zoom + (action === "zoom-in" ? 1 : -1));
    adminMapState.map?.setZoom?.(adminMapState.zoom);
    setAdminMapStatus(container, `地图缩放 ${adminMapState.zoom} 级`, `${rawPoints.length.toLocaleString("zh-CN")} 个业务点位保持联动`);
    return true;
  }
  if (action === "locate") {
    const center = selected || map.center || { lng: 102.833, lat: 24.881 };
    adminMapState.zoom = Math.max(adminMapState.zoom, 10);
    adminMapState.map?.setZoomAndCenter?.(adminMapState.zoom, [Number(center.lng), Number(center.lat)]);
    setAdminMapStatus(container, `已定位到${selected?.city || map.center?.city || "云南运营中心"}`, selected?.title || map.center?.address || "地图中心已更新");
    return true;
  }
  return false;
}

function clampAdminZoom(value) {
  return Math.min(17, Math.max(5, Number(value) || 8));
}

function render() {
  const page = currentPage();
  app.innerHTML = shell(page);
  bindAdminDelegatedEvents();
  normalizeAdminPaginations(app);
  requestAnimationFrame(() => normalizeAdminPaginations(app));
  hydratePassiveButtons(app);
  bindRoutes();
  document.title = `${page.title} - 云旅无忧管理后台`;
  ensureAdminMessages();
  ensureAdminAuditLogs();
  ensureAdminDashboard(page);
  ensureAdminDispatchData(page);
  ensureAdminBannerData(page);
  ensureAdminConfigData(page);
  ensureScreenData(page);
  ensureAdminFunctionOverview(page);
  ensureAdminUserData(page);
  ensureAdminGuideData(page);
  ensureAdminMerchantData(page);
  ensureAdminReferenceContentData(page);
  requestAnimationFrame(() => hydrateAdminMaps(app));
}

function bindAdminDelegatedEvents() {
  if (app.dataset.delegatedEventsBound === "true") return;
  app.dataset.delegatedEventsBound = "true";
  app.addEventListener("click", (event) => {
    const contentTabButton = event.target.closest?.("[data-admin-content-tab]");
    if (!contentTabButton || !app.contains(contentTabButton)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    adminContentViewState.activeTab = contentTabButton.getAttribute("data-admin-content-tab") || "banner";
    render();
  }, true);
  app.addEventListener("click", (event) => {
    const mapTarget = event.target.closest?.("[data-admin-map-action], [data-admin-map-city], [data-admin-map-point]");
    if (!mapTarget || !app.contains(mapTarget)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    handleAdminMapAction(mapTarget);
  }, true);
  app.addEventListener("click", (event) => {
    const pageButton = event.target.closest?.("[data-page-action]");
    if (!pageButton || !app.contains(pageButton)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    handleAdminPagination(pageButton);
  }, true);
  app.addEventListener("click", (event) => {
    const settingsButton = event.target.closest?.("[data-admin-settings-switch], [data-admin-settings-save]");
    if (!settingsButton || !app.contains(settingsButton)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const actionName = settingsButton.getAttribute("data-action") || settingsButton.textContent.trim() || "配置操作";
    setButtonBusy(settingsButton, true);
    Promise.resolve(handleAdminRealtimeAction(actionName, settingsButton))
      .catch((error) => showToast(error.message))
      .finally(() => setButtonBusy(settingsButton, false));
  }, true);
  app.addEventListener("click", (event) => {
    const versionButton = event.target.closest?.("[data-admin-config-version-link]");
    if (!versionButton || !app.contains(versionButton)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setButtonBusy(versionButton, true);
    const located = scrollAdminConfigVersionRecords();
    showToast(located ? "已定位到配置版本记录" : "暂无配置版本记录");
    setButtonBusy(versionButton, false);
  }, true);
  app.addEventListener("click", (event) => {
    const choiceButton = event.target.closest?.("[data-admin-permission-choice]");
    if (choiceButton && app.contains(choiceButton)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleAdminPermissionChoice(choiceButton);
      return;
    }
    const permissionButton = event.target.closest?.("[data-admin-permission-add], [data-admin-permission-save], [data-admin-permission-cancel], [data-admin-permission-toggle], [data-admin-permission-delete], [data-admin-permission-use]");
    if (!permissionButton || !app.contains(permissionButton)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    handleAdminPermissionAction(permissionButton);
  }, true);
  app.addEventListener("change", (event) => {
    const permissionInput = event.target.closest?.("[data-admin-permission-group], [data-admin-permission-page]");
    if (!permissionInput || !app.contains(permissionInput)) return;
    handleAdminPermissionMenuChange(permissionInput);
  }, true);
  app.addEventListener("click", (event) => {
    const menuPermissionButton = event.target.closest?.("[data-admin-menu-permission-action], [data-admin-menu-permission-person]");
    if (!menuPermissionButton || !app.contains(menuPermissionButton)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    handleAdminMenuPermissionAction(menuPermissionButton);
  }, true);
  app.addEventListener("change", (event) => {
    const menuPermissionInput = event.target.closest?.("[data-admin-menu-permission-group], [data-admin-menu-permission-page], [data-admin-menu-permission-button], [data-admin-menu-permission-scope]");
    if (!menuPermissionInput || !app.contains(menuPermissionInput)) return;
    handleAdminMenuPermissionChange(menuPermissionInput);
  }, true);
  app.addEventListener("click", (event) => {
    const loginButton = event.target.closest?.("[data-admin-login-submit]");
    if (!loginButton || !app.contains(loginButton)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    handleAdminPermissionLogin(loginButton);
  }, true);
  app.addEventListener("click", (event) => {
    const exportButton = event.target.closest?.("[data-admin-export-close], [data-admin-export-copy]");
    if (!exportButton || !app.contains(exportButton)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    handleAdminExportAction(exportButton);
  }, true);
}

function normalizeAdminPaginations(root) {
  root.querySelectorAll(".admin-pagination, .table-footer").forEach((pager) => {
    rebuildAdminPager(pager, 1, root);
  });
}

function rebuildAdminPager(pager, activePage = 1, root = document) {
  const panel = pager.closest(".panel, section, .card") || root;
  const rows = [...panel.querySelectorAll(".table-wrap tbody tr, table tbody tr")].filter((row) => row.dataset.emptyRow !== "true");
  const hasFilterState = rows.some((row) => row.dataset.filterMatched);
  const matchedRows = hasFilterState ? rows.filter((row) => row.dataset.filterMatched !== "false") : rows;
  const titleTotal = Number((panel.querySelector(".panel-head h2")?.textContent.match(/共\s*([\d,，]+)\s*条/) || [])[1]?.replace(/[，,]/g, ""));
  const total = hasFilterState
    ? matchedRows.length
    : (Number.isFinite(titleTotal) && titleTotal >= 0 ? titleTotal : rows.length);
  if (!rows.length && !total) return { rows, pageSize: 10, totalPages: 1, activePage: 1 };
  const pageSize = Number(pager.dataset.pageSize) || Number((pager.textContent.match(/(\d+)\s*条\/页/) || [])[1]) || 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const nextActivePage = Math.min(totalPages, Math.max(1, Number(activePage) || 1));
  pager.dataset.pageSize = String(pageSize);
  rows.forEach((row) => {
    row.hidden = true;
  });
  matchedRows.forEach((row, index) => {
    row.hidden = index < (nextActivePage - 1) * pageSize || index >= nextActivePage * pageSize;
  });
  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    const active = pageNumber === nextActivePage;
    const classes = active ? "btn primary active is-active" : "btn ghost";
    if (active) return `<span class="${classes}" aria-current="page" data-current-page="${pageNumber}" style="min-width:32px;width:32px;padding:0">${pageNumber}</span>`;
    return `<button class="${classes}" type="button" data-page-action="${pageNumber}" style="min-width:32px;width:32px;padding:0">${pageNumber}</button>`;
  }).join("");
  const controls = totalPages > 1
    ? `<button class="btn ghost" type="button" data-page-action="prev" style="min-width:32px;width:32px;padding:0">‹</button>${pageButtons}<button class="btn ghost" type="button" data-page-action="next" style="min-width:32px;width:32px;padding:0">›</button>`
    : pageButtons;
  pager.classList.add("admin-pagination");
  pager.innerHTML = `共 ${total} 条 ${controls}`;
  return { rows, pageSize, totalPages, activePage: nextActivePage };
}

function closeAdminExportDialog() {
  adminExportState.open = false;
  adminExportState.title = "";
  adminExportState.filename = "";
  adminExportState.csv = "";
  adminExportState.rowCount = 0;
  adminExportState.notice = "";
}

function openAdminExportDialog({ title = "导出结果", filename = "", csv = "", rowCount = 0, notice = "" } = {}) {
  adminExportState.open = true;
  adminExportState.title = title;
  adminExportState.filename = filename;
  adminExportState.csv = csv;
  adminExportState.rowCount = rowCount;
  adminExportState.notice = notice;
  render();
}

async function handleAdminExportAction(button) {
  if (button.hasAttribute("data-admin-export-close")) {
    closeAdminExportDialog();
    render();
    return;
  }
  if (button.hasAttribute("data-admin-export-copy")) {
    const text = adminExportState.csv || "";
    if (!text) {
      showToast("当前没有可复制的CSV内容");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("CSV内容已复制");
    } catch {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "readonly");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      helper.style.pointerEvents = "none";
      document.body.appendChild(helper);
      helper.focus();
      helper.select();
      helper.setSelectionRange(0, helper.value.length);
      const copied = typeof document.execCommand === "function" ? document.execCommand("copy") : false;
      helper.remove();
      showToast(copied ? "CSV内容已复制" : "复制失败，请手动选择内容复制");
    }
  }
}

function hydratePassiveButtons(root) {
  if (!root) return;
  root.querySelectorAll("button").forEach((button) => {
    const label = (button.getAttribute("aria-label") || button.textContent || "操作").trim().replace(/\s+/g, " ");
    if (button.closest(".table-footer, .admin-pagination") && /^(‹|›|<|>|\d+)$/.test(label)) {
      button.dataset.pageAction = label === "‹" || label === "<" ? "prev" : label === "›" || label === ">" ? "next" : label;
      delete button.dataset.action;
      button.type = "button";
      return;
    }
    if (button.dataset.route || button.dataset.action || button.dataset.pageAction || button.dataset.adminMapAction || button.dataset.adminMapCity || button.dataset.adminMapPoint || button.dataset.adminLoginSubmit !== undefined || button.dataset.adminPermissionAdd !== undefined || button.dataset.adminPermissionSave !== undefined || button.dataset.adminPermissionCancel !== undefined || button.dataset.adminPermissionToggle !== undefined || button.dataset.adminPermissionDelete !== undefined || button.dataset.adminPermissionUse !== undefined || button.dataset.adminPermissionChoice !== undefined || button.dataset.adminMenuPermissionAction !== undefined || button.dataset.adminMenuPermissionPerson !== undefined || button.dataset.userDetailTab || button.dataset.merchantReviewTab || button.dataset.adminSearchSubmit) return;
    button.dataset.action = label || "操作";
  });
}

function activateUserDetailTab(button) {
  const tab = button.dataset.userDetailTab || "profile";
  const group = button.closest("[data-user-detail-tabs], .tabs");
  group?.querySelectorAll("[data-user-detail-tab]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const panel = group?.parentElement?.querySelector("[data-user-detail-content]");
  if (panel) {
    panel.innerHTML = userDetailTabContent(tab);
    panel.dataset.activeTab = tab;
  }
  showToast(`${button.textContent.trim()}数据已加载`);
}

function activateMerchantReviewTab(button) {
  const tab = button.dataset.merchantReviewTab || "agency";
  const group = button.closest("[data-merchant-review-tabs], .tabs");
  group?.querySelectorAll("[data-merchant-review-tab]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const panel = group?.parentElement?.querySelector("[data-merchant-review-content]");
  if (panel) {
    panel.innerHTML = merchantReviewTabContent(tab);
    panel.dataset.activeTab = tab;
  }
  showToast(`${button.textContent.trim()}数据已加载`);
}

function selectedAdminMenuPersonIndex() {
  const person = currentAdminMenuPermissionPerson();
  return adminPermissionState.people.findIndex((item) => item.account === person.account);
}

function collectAdminMenuPermissionDraft(form) {
  const root = form.closest(".admin-menu-permission-layout") || form;
  const pageInputs = [...form.querySelectorAll("[data-admin-menu-permission-page]")];
  const groupInputs = [...form.querySelectorAll("[data-admin-menu-permission-group]")];
  const checkedPages = pageInputs.filter((input) => input.checked).map((input) => input.value);
  const checkedGroups = groupInputs.filter((input) => input.checked).map((input) => input.value);
  const allPageCount = adminMenuConfigurablePages().length;
  const permissions = checkedPages.length >= allPageCount ? ["__all__"] : [...new Set([...checkedGroups, ...checkedPages])];
  const buttonPermissions = [...root.querySelectorAll("[data-admin-menu-permission-button]:checked")].map((input) => input.value);
  const scope = root.querySelector("[data-admin-menu-permission-scope]:checked")?.value || currentAdminMenuPermissionPerson().scope || "昆明市";
  return { permissions, buttonPermissions, scope, checkedPageCount: checkedPages.length };
}

function updateAdminMenuPermissionPreview(form = document.querySelector("[data-admin-menu-permission-form]")) {
  if (!form) return;
  const root = form.closest(".admin-menu-permission-layout") || form;
  const selectedPages = form.querySelectorAll("[data-admin-menu-permission-page]:checked").length;
  const selectedButtons = root.querySelectorAll("[data-admin-menu-permission-button]:checked").length;
  const selectedCount = root.querySelector("[data-admin-menu-permission-selected-count]");
  const buttonCount = root.querySelector("[data-admin-menu-button-selected-count]");
  if (selectedCount) selectedCount.textContent = String(selectedPages);
  if (buttonCount) buttonCount.textContent = String(selectedButtons);
}

function saveAdminMenuPermissionDraft(form, message = "菜单权限已保存") {
  const personIndex = selectedAdminMenuPersonIndex();
  if (personIndex < 0) {
    adminMenuPermissionState.notice = "请选择需要配置的权限人员";
    render();
    return false;
  }
  const draft = collectAdminMenuPermissionDraft(form);
  const person = adminPermissionState.people[personIndex];
  adminPermissionState.people[personIndex] = {
    ...person,
    permissions: draft.permissions,
    buttonPermissions: draft.buttonPermissions,
    scope: draft.scope,
    updatedAt: adminNowText(),
  };
  saveAdminPermissionPeople();
  adminMenuPermissionState.notice = `${person.name}：${message}，菜单 ${draft.checkedPageCount} 项，按钮 ${draft.buttonPermissions.length} 项`;
  recordAdminOperation("保存菜单权限配置", `${person.name}/${person.account}/菜单${draft.checkedPageCount}/按钮${draft.buttonPermissions.length}`);
  render();
  return true;
}

function handleAdminMenuPermissionAction(button) {
  if (button.dataset.adminMenuPermissionPerson !== undefined) {
    adminMenuPermissionState.activeAccount = button.dataset.adminMenuPermissionPerson;
    const person = currentAdminMenuPermissionPerson();
    adminMenuPermissionState.notice = `正在配置 ${person.name} 的菜单、按钮和数据权限`;
    render();
    return true;
  }
  const action = button.dataset.adminMenuPermissionAction;
  const form = app.querySelector("[data-admin-menu-permission-form]");
  if (!form) return false;
  if (action === "save") {
    return saveAdminMenuPermissionDraft(form);
  }
  if (action === "select-all") {
    const root = form.closest(".admin-menu-permission-layout") || form;
    root.querySelectorAll("[data-admin-menu-permission-group], [data-admin-menu-permission-page], [data-admin-menu-permission-button]").forEach((input) => {
      input.checked = true;
    });
    updateAdminMenuPermissionPreview(form);
    showToast("已全选菜单和按钮权限，请保存后生效");
    return true;
  }
  const personIndex = selectedAdminMenuPersonIndex();
  if (personIndex < 0) return false;
  const person = adminPermissionState.people[personIndex];
  if (action === "audit-template") {
    adminPermissionState.people[personIndex] = {
      ...person,
      role: person.role || "审计员",
      scope: "只读审计",
      permissions: ["dashboard", "permission", "menus", "logs"],
      buttonPermissions: ["view", "export"],
      updatedAt: adminNowText(),
    };
    saveAdminPermissionPeople();
    adminMenuPermissionState.notice = `${person.name} 已应用只读审计模板`;
    recordAdminOperation("应用只读审计模板", `${person.name}/${person.account}`);
    render();
    return true;
  }
  if (action === "reset") {
    const defaults = defaultAdminPermissionPeople.find((item) => item.account === person.account);
    adminPermissionState.people[personIndex] = {
      ...person,
      role: defaults?.role || person.role,
      scope: defaults?.scope || person.scope || "昆明市",
      permissions: defaults?.permissions ? [...defaults.permissions] : [],
      buttonPermissions: defaults?.buttonPermissions ? [...defaults.buttonPermissions] : [],
      updatedAt: adminNowText(),
    };
    saveAdminPermissionPeople();
    adminMenuPermissionState.notice = `${person.name} 的菜单权限已恢复默认`;
    recordAdminOperation("恢复默认菜单权限", `${person.name}/${person.account}`);
    render();
    return true;
  }
  return false;
}

function handleAdminMenuPermissionChange(input) {
  const form = input.closest("[data-admin-menu-permission-form]");
  if (!form) {
    updateAdminMenuPermissionPreview();
    return true;
  }
  if (input.dataset.adminMenuPermissionGroup !== undefined) {
    const groupId = input.dataset.adminMenuPermissionGroup;
    form.querySelectorAll(`[data-admin-menu-permission-page="${CSS.escape(groupId)}"]`).forEach((item) => {
      item.checked = input.checked;
    });
  }
  if (input.dataset.adminMenuPermissionPage !== undefined) {
    const groupId = input.dataset.adminMenuPermissionPage;
    const pagesInGroup = [...form.querySelectorAll(`[data-admin-menu-permission-page="${CSS.escape(groupId)}"]`)];
    const groupInput = form.querySelector(`[data-admin-menu-permission-group="${CSS.escape(groupId)}"]`);
    if (groupInput) groupInput.checked = pagesInGroup.length > 0 && pagesInGroup.every((item) => item.checked);
  }
  updateAdminMenuPermissionPreview(form);
  return true;
}

function handleAdminPermissionAction(button) {
  if (button.dataset.adminPermissionAdd !== undefined) {
    adminPermissionState.adding = true;
    adminPermissionState.notice = "";
    render();
    return true;
  }
  if (button.dataset.adminPermissionCancel !== undefined) {
    adminPermissionState.adding = false;
    adminPermissionState.notice = "";
    render();
    return true;
  }
  if (button.dataset.adminPermissionUse !== undefined) {
    const account = button.dataset.adminPermissionUse;
    const person = adminPermissionState.people.find((item) => item.account === account);
    if (!person || person.status === "停用") {
      adminPermissionState.notice = "该账号不存在或已停用，不能用于权限验证";
      recordAdminOperation("切换权限验证账号", account || "", "失败");
      render();
      return true;
    }
    saveAdminPermissionSession(person.account);
    adminPermissionState.notice = `当前验证账号：${person.name}，菜单权限结果已刷新`;
    recordAdminOperation("切换权限验证账号", `${person.name}/${person.account}`, "成功", person.name);
    render();
    return true;
  }
  if (button.dataset.adminPermissionToggle !== undefined) {
    const account = button.dataset.adminPermissionToggle;
    const person = adminPermissionState.people.find((item) => item.account === account);
    if (!person) return false;
    person.status = person.status === "停用" ? "启用" : "停用";
    person.updatedAt = adminNowText();
    if (person.status === "停用" && adminPermissionState.activeAccount === person.account) saveAdminPermissionSession(ADMIN_DEFAULT_ACCOUNT);
    saveAdminPermissionPeople();
    adminPermissionState.notice = `${person.name} 已${person.status}`;
    recordAdminOperation(`${person.status}权限人员`, `${person.name}/${person.account}`);
    render();
    return true;
  }
  if (button.dataset.adminPermissionDelete !== undefined) {
    const account = button.dataset.adminPermissionDelete;
    const person = adminPermissionState.people.find((item) => item.account === account);
    adminPermissionState.people = adminPermissionState.people.filter((item) => item.account !== account);
    if (adminPermissionState.activeAccount === account) saveAdminPermissionSession(ADMIN_DEFAULT_ACCOUNT);
    saveAdminPermissionPeople();
    adminPermissionState.notice = person ? `${person.name} 已删除` : "权限人员已删除";
    recordAdminOperation("删除权限人员", person ? `${person.name}/${person.account}` : account);
    render();
    return true;
  }
  if (button.dataset.adminPermissionSave !== undefined) {
    const form = button.closest("[data-admin-permission-form]");
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim() || "未命名人员";
    const account = String(data.get("account") || "").trim() || `permission-${Date.now()}`;
    const password = String(data.get("password") || "").trim();
    const role = String(data.get("role") || "运营管理");
    const scope = String(data.get("scope") || "昆明市");
    const permissions = [...new Set(data.getAll("permissions").map((item) => String(item)).filter(Boolean))];
    if (!password) {
      adminPermissionState.notice = "新增权限人员必须设置登录密码";
      render();
      return true;
    }
    const existingIndex = adminPermissionState.people.findIndex((item) => item.account === account);
    const previous = existingIndex >= 0 ? adminPermissionState.people[existingIndex] : null;
    const person = { ...(previous || {}), name, account, password, role, scope, status: "启用", permissions, updatedAt: adminNowText(), createdAt: previous?.createdAt || adminNowText() };
    if (existingIndex >= 0) adminPermissionState.people[existingIndex] = person;
    else adminPermissionState.people = [person, ...adminPermissionState.people];
    saveAdminPermissionPeople();
    adminPermissionState.adding = false;
    adminPermissionState.notice = `${name} 已保存，账号密码和菜单权限已生效`;
    recordAdminOperation(existingIndex >= 0 ? "更新权限人员" : "新增权限人员", `${name}/${account}/授权${permissionCount(person)}`);
    render();
    return true;
  }
  return false;
}

function handleAdminPermissionChoice(button) {
  const name = button.dataset.adminPermissionChoice;
  const value = button.dataset.choiceValue || button.textContent.trim();
  const field = button.closest("[data-admin-permission-choice-field]");
  if (!name || !field) return false;
  const input = field.querySelector(`input[name="${name}"]`);
  if (input) input.value = value;
  field.querySelectorAll("[data-admin-permission-choice]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  return true;
}

function handleAdminPermissionMenuChange(input) {
  const groupId = input.dataset.adminPermissionGroup || input.dataset.adminPermissionPage;
  const form = input.closest("[data-admin-permission-form]");
  if (!groupId || !form) return;
  if (input.dataset.adminPermissionGroup !== undefined) {
    [...form.querySelectorAll("[data-admin-permission-page]")].filter((item) => item.dataset.adminPermissionPage === groupId).forEach((item) => {
      item.checked = input.checked;
    });
    return;
  }
  const pagesInGroup = [...form.querySelectorAll("[data-admin-permission-page]")].filter((item) => item.dataset.adminPermissionPage === groupId);
  const groupInput = [...form.querySelectorAll("[data-admin-permission-group]")].find((item) => item.dataset.adminPermissionGroup === groupId);
  if (groupInput) groupInput.checked = pagesInGroup.length > 0 && pagesInGroup.every((item) => item.checked);
}

function handleAdminPermissionLogin(button) {
  const form = button.closest(".login-form") || document;
  const account = String(form.querySelector('[name="adminAccount"]')?.value || "").trim();
  const password = String(form.querySelector('[name="adminPassword"]')?.value || "").trim();
  const people = [adminDefaultPerson(), ...adminPermissionState.people];
  const person = people.find((item) => item.account === account);
  if (!person || person.password !== password || person.status === "停用") {
    adminPermissionState.notice = "账号、密码或账号状态不正确";
    recordAdminOperation("后台登录", account || "空账号", "失败", account || "未知账号");
    render();
    return true;
  }
  saveAdminPermissionSession(person.account);
  adminPermissionState.notice = "";
  recordAdminOperation("后台登录", `${person.name}/${person.account}`, "成功", person.name);
  const firstAllowed = operationalNav.find((item) => hasAdminPagePermission(item.route, person))?.route || "permission";
  location.hash = pageHref(firstAllowed);
  render();
  return true;
}

function handleAdminPagination(button) {
  const pager = button.closest(".admin-pagination, .table-footer");
  if (!pager) return false;
  const pageButtons = [...pager.querySelectorAll("button[data-page-action]")].filter((item) => /^\d+$/.test(item.dataset.pageAction || item.textContent.trim()));
  const currentMarker = pager.querySelector("[aria-current='page'][data-current-page]");
  const currentPageNumber = Math.max(1, Number(currentMarker?.dataset.currentPage || pageButtons[0]?.dataset.pageAction || pageButtons[0]?.textContent.trim()) || 1);
  const action = button.dataset.pageAction || button.textContent.trim();
  const initialState = rebuildAdminPager(pager, currentPageNumber);
  const nextPage = action === "prev" ? initialState.activePage - 1 : action === "next" ? initialState.activePage + 1 : Number(action) || 1;
  rebuildAdminPager(pager, nextPage);
  return true;
}

function resetAdminRealtimeState() {
  [adminDashboardState, adminScreenState, adminFunctionOverviewState, adminUserState, adminGuideState, adminMerchantState, adminDispatchState].forEach((state) => {
    state.loaded = false;
    state.loading = false;
    state.error = "";
    if ("data" in state) state.data = null;
    if ("users" in state) state.users = [];
    if ("elderProfiles" in state) state.elderProfiles = [];
    if ("familyContacts" in state) state.familyContacts = [];
    if ("guides" in state) state.guides = [];
    if ("merchants" in state) state.merchants = [];
    if ("services" in state) state.services = [];
    if ("queue" in state) state.queue = null;
  });
  adminDispatchState.auditLogs = [];
  adminDispatchState.messages = { user: [], guide: [], merchant: [] };
  adminOrderListState.statusFilter = "";
  adminDispatchState.selectedKey = "";
  adminUserState.selectedUserId = "";
  adminGuideState.selectedGuideId = "";
  adminOrderState.selectedOrderId = "";
  adminExceptionState.selectedAlertId = "";
  adminDispatchState.detailTab = "map";
  adminDispatchState.detailMode = "";
  adminDispatchState.detailNotice = "";
  adminReferenceContentState.policiesLoading = false;
  adminReferenceContentState.policiesLoaded = false;
  adminReferenceContentState.knowledgeLoading = false;
  adminReferenceContentState.knowledgeLoaded = false;
  adminReferenceContentState.error = "";
  adminReferenceContentState.policies = [];
  adminReferenceContentState.knowledge = [];
  resetAdminBannerData();
}

function normalizeActionText(actionName) {
  return String(actionName || "").replace(/\s+/g, "").trim();
}

function actionMatches(actionName, words) {
  const action = normalizeActionText(actionName);
  return words.some((word) => action.includes(word));
}

function currentAdminContext(page = currentPage()) {
  return `${page.id} ${page.group} ${page.title}`;
}

async function fetchFirst(path, pick) {
  const data = await adminApi(path);
  const list = pick ? pick(data) : data;
  return Array.isArray(list) ? list[0] : list;
}

function adminDeviceCsvRows(devices = []) {
  return [
    ["设备ID", "设备名称", "设备类型", "绑定老人", "用户ID", "状态", "电量", "位置", "最后上报"],
    ...devices.map((item) => [
      item.deviceId || item.id || "",
      item.name || "",
      item.type || "",
      item.elderName || "",
      item.userId || "",
      item.onlineStatus || item.status || "",
      item.battery !== undefined && item.battery !== null && item.battery !== "" ? `${item.battery}%` : "",
      item.location || "",
      item.lastSyncAt || item.updatedAt || item.lastSync || "",
    ]),
  ];
}

function buildAdminCsv(rows) {
  return rows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

function parseAdminCsvRows(text = "") {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const source = String(text || "").replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (inQuotes) {
      if (char === "\"") {
        if (source[index + 1] === "\"") {
          cell += "\"";
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }
    if (char === "\"") {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(cell.trim());
      cell = "";
      continue;
    }
    if (char === "\r") continue;
    if (char === "\n") {
      row.push(cell.trim());
      if (row.some((item) => item)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }
  if (cell || row.length) {
    row.push(cell.trim());
    if (row.some((item) => item)) rows.push(row);
  }
  return rows;
}

function normalizeAdminDeviceHeader(value = "") {
  return String(value || "").toLowerCase().replace(/[\s_-]+/g, "");
}

function normalizeAdminDeviceImportRows(rows = []) {
  if (!rows.length) return [];
  const headerAliases = {
    "设备id": "deviceId",
    "设备编号": "deviceId",
    "deviceid": "deviceId",
    "id": "deviceId",
    "设备名称": "name",
    "name": "name",
    "设备类型": "type",
    "type": "type",
    "绑定老人": "elderName",
    "老人姓名": "elderName",
    "eldername": "elderName",
    "userid": "userId",
    "用户id": "userId",
    "状态": "onlineStatus",
    "在线状态": "onlineStatus",
    "onlinestatus": "onlineStatus",
    "电量": "battery",
    "battery": "battery",
    "位置": "location",
    "所在区域": "location",
    "location": "location",
    "最后上报": "lastSyncAt",
    "最后同步": "lastSyncAt",
    "lastsyncat": "lastSyncAt",
  };
  const headerKeys = rows[0].map((item) => headerAliases[normalizeAdminDeviceHeader(item)] || "");
  const hasHeader = headerKeys.some(Boolean);
  const fallbackKeys = ["deviceId", "name", "type", "elderName", "userId", "onlineStatus", "battery", "location", "lastSyncAt"];
  const dataRows = hasHeader ? rows.slice(1) : rows;
  return dataRows
    .map((cells, index) => {
      const lookup = (key) => {
        const position = hasHeader ? headerKeys.findIndex((item) => item === key) : fallbackKeys.indexOf(key);
        return position >= 0 ? String(cells[position] || "").trim() : "";
      };
      const batteryText = lookup("battery").replace(/%/g, "");
      const battery = batteryText ? Number(batteryText) : 100;
      return {
        deviceId: lookup("deviceId"),
        name: lookup("name"),
        type: lookup("type") || lookup("name") || "智能设备",
        elderName: lookup("elderName"),
        userId: lookup("userId") || `device-import-${index + 1}`,
        onlineStatus: lookup("onlineStatus") || "在线",
        battery: Number.isFinite(battery) ? battery : 100,
        location: lookup("location") || "云南省 昆明市",
        lastSyncAt: lookup("lastSyncAt"),
      };
    })
    .filter((item) => item.deviceId);
}

function pickAdminImportFile(accept = ".csv,text/csv") {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.style.position = "fixed";
    input.style.left = "-9999px";
    input.addEventListener("change", () => {
      const file = input.files?.[0] || null;
      input.remove();
      resolve(file);
    }, { once: true });
    input.addEventListener("cancel", () => {
      input.remove();
      resolve(null);
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

function pickAdminCsvFile(accept = ".csv,text/csv") {
  return pickAdminImportFile(accept);
}

function normalizeAdminDispatchHeader(value = "") {
  return String(value || "").toLowerCase().replace(/[\s_-]+/g, "");
}

function normalizeAdminDispatchImportRows(rows = []) {
  if (!rows.length) return [];
  const headerAliases = {
    "任务编号": "taskNo",
    "taskno": "taskNo",
    "订单编号": "orderNo",
    "orderno": "orderNo",
    "服务类型": "serviceType",
    "servicetype": "serviceType",
    "老人": "elderName",
    "老人姓名": "elderName",
    "eldername": "elderName",
    "预约时间": "time",
    "服务时间": "time",
    "time": "time",
    "地址": "location",
    "地点": "location",
    "location": "location",
    "优先级": "priority",
    "priority": "priority",
    "状态": "status",
    "执行状态": "status",
    "status": "status",
    "金额": "amount",
    "amount": "amount",
    "执行方类型": "assigneeType",
    "assigneetype": "assigneeType",
    "执行方id": "assigneeId",
    "assigneeid": "assigneeId",
    "执行方": "assigneeName",
    "assigneename": "assigneeName",
    "备注": "note",
    "note": "note",
  };
  const headerKeys = rows[0].map((item) => headerAliases[normalizeAdminDispatchHeader(item)] || "");
  const hasHeader = headerKeys.some(Boolean);
  const fallbackKeys = ["taskNo", "serviceType", "elderName", "time", "location", "priority", "status", "assigneeName", "amount", "note"];
  const dataRows = hasHeader ? rows.slice(1) : rows;
  return dataRows
    .map((cells) => {
      const lookup = (key) => {
        const position = hasHeader ? headerKeys.findIndex((item) => item === key) : fallbackKeys.indexOf(key);
        return position >= 0 ? String(cells[position] || "").trim() : "";
      };
      const amountText = lookup("amount").replace(/[^\d.]/g, "");
      const amount = amountText ? Number(amountText) : 120;
      return {
        taskNo: lookup("taskNo"),
        orderNo: lookup("orderNo"),
        serviceType: lookup("serviceType") || "陪伴就医",
        elderName: lookup("elderName"),
        time: lookup("time") || now(),
        location: lookup("location") || "云南省 昆明市",
        priority: lookup("priority") || "中",
        status: lookup("status") || "待派单",
        assigneeType: lookup("assigneeType"),
        assigneeId: lookup("assigneeId"),
        assigneeName: lookup("assigneeName"),
        amount: Number.isFinite(amount) ? amount : 120,
        note: lookup("note") || "任务调度批量导入",
      };
    })
    .filter((item) => item.serviceType && item.time);
}

function resolveAdminDispatchAssignee(row = {}, queue = {}) {
  const guideCandidates = (queue.candidates?.guides || []).map((item) => ({
    assigneeType: "guide",
    assigneeId: item.id,
    assigneeName: item.realName || item.name || item.id,
  }));
  const merchantCandidates = (queue.candidates?.merchants || []).map((item) => ({
    assigneeType: "merchant",
    assigneeId: item.id,
    assigneeName: item.name || item.id,
  }));
  const candidates = [...guideCandidates, ...merchantCandidates];
  if (row.assigneeId) {
    const matchedById = candidates.find((item) => item.assigneeId === row.assigneeId);
    if (matchedById) return matchedById;
  }
  if (row.assigneeName) {
    const keyword = String(row.assigneeName).trim();
    const matchedByName = candidates.find((item) => item.assigneeName === keyword || item.assigneeName.includes(keyword));
    if (matchedByName) return matchedByName;
  }
  if (row.assigneeType) {
    const matchedByType = candidates.find((item) => item.assigneeType === row.assigneeType);
    if (matchedByType) return matchedByType;
  }
  return null;
}

function normalizeAdminUserImportRows(rows = []) {
  if (!rows.length) return [];
  const aliases = {
    "用户id": "id",
    "userid": "id",
    "id": "id",
    "手机号": "phone",
    "phone": "phone",
    "昵称": "nickname",
    "姓名": "nickname",
    "nickname": "nickname",
    "状态": "status",
    "status": "status",
    "头像": "avatar",
    "avatar": "avatar",
  };
  const headerKeys = rows[0].map((item) => aliases[normalizeAdminDispatchHeader(item)] || "");
  const hasHeader = headerKeys.some(Boolean);
  const fallbackKeys = ["id", "phone", "nickname", "status", "avatar"];
  const dataRows = hasHeader ? rows.slice(1) : rows;
  return dataRows.map((cells, index) => {
    const lookup = (key) => {
      const position = hasHeader ? headerKeys.findIndex((item) => item === key) : fallbackKeys.indexOf(key);
      return position >= 0 ? String(cells[position] || "").trim() : "";
    };
    return {
      id: lookup("id") || `user-import-${Date.now()}-${index + 1}`,
      phone: lookup("phone"),
      nickname: lookup("nickname") || `导入用户${index + 1}`,
      status: lookup("status") || "正常",
      avatar: lookup("avatar") || "/user/assets/avatar-user.jpg",
      role: "elder",
    };
  }).filter((item) => item.phone || item.nickname);
}

function normalizeAdminGuideImportRows(rows = []) {
  if (!rows.length) return [];
  const aliases = {
    "向导id": "id",
    "工号": "id",
    "id": "id",
    "姓名": "realName",
    "向导姓名": "realName",
    "realname": "realName",
    "服务类型": "serviceTypes",
    "servicetypes": "serviceTypes",
    "服务区域": "area",
    "area": "area",
    "认证状态": "status",
    "状态": "status",
    "status": "status",
    "在线状态": "onlineStatus",
    "onlinestatus": "onlineStatus",
    "接单状态": "currentStatus",
    "currentstatus": "currentStatus",
    "评分": "rating",
    "rating": "rating",
  };
  const headerKeys = rows[0].map((item) => aliases[normalizeAdminDispatchHeader(item)] || "");
  const hasHeader = headerKeys.some(Boolean);
  const fallbackKeys = ["id", "realName", "serviceTypes", "area", "status", "onlineStatus", "currentStatus", "rating"];
  const dataRows = hasHeader ? rows.slice(1) : rows;
  return dataRows.map((cells, index) => {
    const lookup = (key) => {
      const position = hasHeader ? headerKeys.findIndex((item) => item === key) : fallbackKeys.indexOf(key);
      return position >= 0 ? String(cells[position] || "").trim() : "";
    };
    const rawTypes = lookup("serviceTypes");
    return {
      id: lookup("id") || `guide-import-${Date.now()}-${index + 1}`,
      realName: lookup("realName") || `导入向导${index + 1}`,
      serviceTypes: rawTypes ? rawTypes.split(/[、,/]/).map((item) => item.trim()).filter(Boolean) : ["陪伴就医"],
      area: lookup("area") || "昆明市",
      status: lookup("status") || "待审核",
      onlineStatus: lookup("onlineStatus") || "离线",
      currentStatus: lookup("currentStatus") || "休息中",
      rating: Number(lookup("rating") || 4.6),
    };
  }).filter((item) => item.realName);
}

function normalizeAdminMerchantImportRows(rows = []) {
  if (!rows.length) return [];
  const aliases = {
    "商户id": "id",
    "商户编号": "id",
    "id": "id",
    "商户名称": "name",
    "名称": "name",
    "name": "name",
    "服务类型": "type",
    "商户类型": "type",
    "type": "type",
    "联系人": "contact",
    "contact": "contact",
    "电话": "phone",
    "手机号": "phone",
    "phone": "phone",
    "地址": "address",
    "address": "address",
    "资质编号": "license",
    "license": "license",
    "状态": "status",
    "status": "status",
    "评分": "rating",
    "rating": "rating",
  };
  const headerKeys = rows[0].map((item) => aliases[normalizeAdminDispatchHeader(item)] || "");
  const hasHeader = headerKeys.some(Boolean);
  const fallbackKeys = ["id", "name", "type", "contact", "phone", "address", "license", "status", "rating"];
  const dataRows = hasHeader ? rows.slice(1) : rows;
  return dataRows.map((cells, index) => {
    const lookup = (key) => {
      const position = hasHeader ? headerKeys.findIndex((item) => item === key) : fallbackKeys.indexOf(key);
      return position >= 0 ? String(cells[position] || "").trim() : "";
    };
    return {
      id: lookup("id") || `merchant-import-${Date.now()}-${index + 1}`,
      name: lookup("name") || `导入商户${index + 1}`,
      type: lookup("type") || "康养护理",
      contact: lookup("contact") || "平台联系人",
      phone: lookup("phone") || "",
      address: lookup("address") || "云南省 昆明市",
      license: lookup("license") || `YLYY-IMPORT-${Date.now()}-${index + 1}`,
      status: lookup("status") || "待审核",
      rating: Number(lookup("rating") || 4.6),
    };
  }).filter((item) => item.name);
}

function normalizeAdminAlertImportRows(rows = []) {
  if (!rows.length) return [];
  const aliases = {
    "异常id": "id",
    "事件编号": "id",
    "id": "id",
    "老人id": "elderId",
    "elderid": "elderId",
    "老人": "elderName",
    "老人姓名": "elderName",
    "eldername": "elderName",
    "类型": "type",
    "异常类型": "type",
    "type": "type",
    "级别": "level",
    "严重级别": "level",
    "level": "level",
    "位置": "location",
    "location": "location",
    "状态": "status",
    "status": "status",
    "描述": "description",
    "description": "description",
    "时间": "createdAt",
    "发生时间": "createdAt",
    "createdat": "createdAt",
    "处理人": "handledBy",
    "handledby": "handledBy",
  };
  const headerKeys = rows[0].map((item) => aliases[normalizeAdminDispatchHeader(item)] || "");
  const hasHeader = headerKeys.some(Boolean);
  const fallbackKeys = ["id", "elderId", "elderName", "type", "level", "location", "status", "description", "createdAt", "handledBy"];
  const dataRows = hasHeader ? rows.slice(1) : rows;
  return dataRows.map((cells, index) => {
    const lookup = (key) => {
      const position = hasHeader ? headerKeys.findIndex((item) => item === key) : fallbackKeys.indexOf(key);
      return position >= 0 ? String(cells[position] || "").trim() : "";
    };
    return {
      id: lookup("id") || `alert-import-${Date.now()}-${index + 1}`,
      elderId: lookup("elderId") || "elder-001",
      elderName: lookup("elderName") || "未命名老人",
      type: lookup("type") || "设备离线",
      level: lookup("level") || "中",
      location: lookup("location") || "云南省 昆明市",
      status: lookup("status") || "待处理",
      description: lookup("description") || "后台批量导入异常事件",
      createdAt: lookup("createdAt") || adminNowText().slice(0, 16),
      handledBy: lookup("handledBy") || "",
    };
  }).filter((item) => item.type && item.elderName);
}

async function buildAdminPolicyImportPayload(file) {
  const name = String(file?.name || "").trim();
  if (!file) return { items: [] };
  if (/\.csv$/i.test(name)) {
    const rows = parseAdminCsvRows(await file.text());
    const items = rows.length <= 1 ? [] : rows.slice(1).map((cells, index) => ({
      title: String(cells[0] || "").trim() || `${name} 指南 ${index + 1}`,
      category: String(cells[1] || "").trim() || "旅居政策",
      city: String(cells[2] || "").trim() || "全国",
      views: Number(String(cells[3] || "").replace(/[^\d]/g, "") || 0),
      favorites: Number(String(cells[4] || "").replace(/[^\d]/g, "") || 0),
      status: String(cells[5] || "").trim() || "待审核",
      updatedAt: String(cells[6] || "").trim() || adminNowText(),
      source: String(cells[7] || "").trim() || name,
      content: String(cells[8] || "").trim() || "",
    })).filter((item) => item.title);
    return { items };
  }
  const content = await file.text();
  const title = name.replace(/\.[^.]+$/, "") || "导入政策指南";
  return {
    items: [{
      title,
      category: "旅居政策",
      city: "全国",
      views: 0,
      favorites: 0,
      status: "待审核",
      updatedAt: adminNowText(),
      source: name,
      content: content.trim(),
    }],
  };
}

async function buildAdminKnowledgeImportPayload(file) {
  const name = String(file?.name || "").trim();
  if (!file) return { items: [] };
  if (/\.csv$/i.test(name)) {
    const rows = parseAdminCsvRows(await file.text());
    const items = rows.length <= 1 ? [] : rows.slice(1).map((cells, index) => ({
      title: String(cells[0] || "").trim() || `${name} 知识 ${index + 1}`,
      category: String(cells[1] || "").trim() || "其他",
      city: String(cells[2] || "").trim() || "全国",
      source: String(cells[3] || "").trim() || "后台导入",
      updater: String(cells[4] || "").trim() || "平台管理员",
      status: String(cells[5] || "").trim() || "待审核",
      hits: Number(String(cells[6] || "").replace(/[^\d]/g, "") || 0),
      content: String(cells[7] || "").trim() || "",
    })).filter((item) => item.title);
    return { items };
  }
  const content = await file.text();
  const title = name.replace(/\.[^.]+$/, "") || "导入知识";
  return {
    items: [{
      title,
      category: "其他",
      city: "全国",
      source: name,
      updater: "平台管理员",
      status: "待审核",
      hits: 0,
      content: content.trim(),
    }],
  };
}

function adminImportPageConfig(page = currentPage()) {
  const id = page?.id || "";
  const configs = {
    users: {
      accept: ".csv,text/csv",
      endpoint: "/api/admin/users/import",
      buildPayload: async (file) => ({ items: normalizeAdminUserImportRows(parseAdminCsvRows(await file.text())) }),
      successText: (result, file) => `${file.name} 已导入 ${result.createdCount || 0} 个用户`,
    },
    guides: {
      accept: ".csv,text/csv",
      endpoint: "/api/admin/guides/import",
      buildPayload: async (file) => ({ items: normalizeAdminGuideImportRows(parseAdminCsvRows(await file.text())) }),
      successText: (result, file) => `${file.name} 已导入 ${result.createdCount || 0} 个向导`,
    },
    merchants: {
      accept: ".csv,text/csv",
      endpoint: "/api/admin/merchants/import",
      buildPayload: async (file) => ({ items: normalizeAdminMerchantImportRows(parseAdminCsvRows(await file.text())) }),
      successText: (result, file) => `${file.name} 已导入 ${result.createdCount || 0} 个商户`,
    },
    exceptions: {
      accept: ".csv,text/csv",
      endpoint: "/api/admin/alerts/import",
      buildPayload: async (file) => ({ items: normalizeAdminAlertImportRows(parseAdminCsvRows(await file.text())) }),
      successText: (result, file) => `${file.name} 已导入 ${result.createdCount || 0} 条异常事件`,
    },
    policy: {
      accept: ".csv,text/csv,.txt,text/plain,.md,text/markdown",
      endpoint: "/api/admin/policies/import",
      buildPayload: buildAdminPolicyImportPayload,
      successText: (result, file) => `${file.name} 已导入 ${result.createdCount || 0} 条政策指南`,
    },
    knowledge: {
      accept: ".csv,text/csv,.txt,text/plain,.md,text/markdown",
      endpoint: "/api/admin/knowledge/import",
      buildPayload: buildAdminKnowledgeImportPayload,
      successText: (result, file) => `${file.name} 已导入 ${result.createdCount || 0} 条知识`,
    },
  };
  return configs[id] || null;
}

function adminExportFileName(page = currentPage()) {
  const stamp = adminNowText().replace(/[-:\s]/g, "").slice(0, 14);
  return `admin-${page?.id || "export"}-${stamp}.csv`;
}

function adminExportTableTitle(table, index) {
  const panel = table.closest(".panel, .table-panel, section, article");
  const heading = panel?.querySelector(".panel-head h2, h2, h3");
  const title = String(heading?.textContent || "").replace(/\s+/g, " ").trim();
  return title || `${currentPage().title} 表格 ${index + 1}`;
}

function collectAdminTablesForExport() {
  return [...app.querySelectorAll(".content table")]
    .filter((table) => !table.closest(".admin-export-dialog"))
    .map((table, index) => {
      const headers = [...table.querySelectorAll("thead th, tr:first-child th")]
        .map((cell) => cell.textContent.replace(/\s+/g, " ").trim())
        .filter(Boolean);
      const rows = [...table.querySelectorAll("tbody tr")]
        .map((row) => [...row.querySelectorAll("td, th")].map((cell) => cell.textContent.replace(/\s+/g, " ").trim()))
        .filter((row) => row.some((cell) => cell));
      if (!headers.length && !rows.length) return null;
      return {
        title: adminExportTableTitle(table, index),
        headers,
        rows,
      };
    })
    .filter(Boolean);
}

function exportAdminCurrentPageData(page = currentPage(), actionName = "导出") {
  if (page?.id === "tasks") return exportAdminDispatchData();
  if (page?.id === "banner" && actionMatches(actionName, ["导出数据"])) return exportAdminBannerData();
  const tables = collectAdminTablesForExport();
  if (!tables.length) throw new Error("当前页面没有可导出的表格数据");
  const rows = [];
  let rowCount = 0;
  tables.forEach((table, index) => {
    if (index > 0) rows.push([]);
    rows.push([table.title]);
    if (table.headers.length) rows.push(table.headers);
    rows.push(...table.rows);
    rowCount += table.rows.length;
  });
  const filename = adminExportFileName(page);
  const csv = downloadAdminCsv(filename, rows);
  openAdminExportDialog({
    title: `${page.title}导出结果`,
    filename,
    csv,
    rowCount,
    notice: `已从 ${tables.length} 个表格生成 CSV，可直接复制或下载。`,
  });
  recordAdminOperation(`导出${page.title}`, `${filename}/${rowCount}条`);
  return true;
}

async function importAdminCurrentPageData(page = currentPage()) {
  const config = adminImportPageConfig(page);
  if (!config) return false;
  const file = await pickAdminImportFile(config.accept);
  if (!file) return true;
  const payload = await config.buildPayload(file);
  if (!Array.isArray(payload?.items) || !payload.items.length) throw new Error("导入文件中没有可写入的数据");
  await ensureAdminScreenToken();
  const result = await adminApi(config.endpoint, {
    method: "POST",
    body: {
      items: payload.items,
      sourceFile: file.name,
    },
  });
  finishAdminMutation(config.successText(result, file));
  return true;
}

async function handleAdminImportExportAction(actionName, page) {
  const action = normalizeActionText(actionName);
  if (actionMatches(action, ["批量导入", "导入文档", "导入"]) && await importAdminCurrentPageData(page)) return true;
  if (actionMatches(action, ["导出数据", "导出", "导出明细", "导出记录", "导出健康档案"])) {
    exportAdminCurrentPageData(page, actionName);
    return true;
  }
  return false;
}

function focusAdminDeviceBindWizard() {
  window.setTimeout(() => {
    const input = document.querySelector(".device-bind-wizard ol li:first-child input");
    if (input) {
      input.focus();
      if (typeof input.select === "function") input.select();
      input.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, 0);
}

function resetAdminDeviceBindForm(button) {
  const wizard = button?.closest?.(".device-bind-wizard") || document.querySelector(".device-bind-wizard");
  if (!wizard) return false;
  const snInput = wizard.querySelector("ol li:first-child input");
  if (snInput) snInput.value = `SIM-${Date.now()}`;
  const noteInput = wizard.querySelector("ol li:last-child input");
  if (noteInput) noteInput.value = "";
  wizard.querySelectorAll(".device-type-grid button").forEach((item, index) => {
    item.classList.toggle("active", index === 0);
  });
  focusAdminDeviceBindWizard();
  return true;
}

function collectAdminDeviceBindPayload(button) {
  const wizard = button?.closest?.(".device-bind-wizard") || document.querySelector(".device-bind-wizard");
  if (!wizard) {
    return {
      deviceId: `SIM-${Date.now()}`,
      type: "智能设备",
      name: "智能设备",
      elderName: "未命名老人",
      userId: `device-bind-${Date.now()}`,
      battery: 100,
      location: "云南省 昆明市",
    };
  }
  const deviceId = String(wizard.querySelector("ol li:first-child input")?.value || "").trim() || `SIM-${Date.now()}`;
  const activeType = wizard.querySelector(".device-type-grid button.active span")?.textContent?.trim()
    || wizard.querySelector(".device-type-grid button.active")?.textContent?.trim()
    || "智能设备";
  const elderOption = String(wizard.querySelector("ol li:nth-child(3) select")?.value || "").trim();
  const elderName = elderOption.split("/")[0]?.trim() || "未命名老人";
  const locationMeta = wizard.querySelector(".bound-person small")?.textContent || "云南省 昆明市";
  const location = locationMeta.split("　").pop()?.trim() || locationMeta.trim() || "云南省 昆明市";
  return {
    deviceId,
    type: activeType,
    name: activeType,
    elderName,
    userId: `device-bind-${Date.now()}`,
    battery: 100,
    location,
  };
}

async function handleAdminDeviceManagementAction(actionName, button, page) {
  const action = normalizeActionText(actionName);
  const isDevicePage = page?.group === "device" || page?.id === "device-bind" || /设备/.test(`${page?.title || ""}${page?.id || ""}`);
  if (!isDevicePage) return false;

  const quickFilterMatch = action.match(/^设备列表筛选[:：](全部|在线|离线)$/);
  if (quickFilterMatch && page.id === "devices") {
    applyAdminDeviceStatusQuickFilter(quickFilterMatch[1]);
    return true;
  }

  if (actionMatches(action, ["新增"]) && page.group === "device") {
    adminUiState.deviceBindMode = "create";
    if (page.id === "device-bind") {
      resetAdminDeviceBindForm(button);
      return true;
    }
    location.hash = pageHref("device-bind");
    window.setTimeout(() => resetAdminDeviceBindForm(), 0);
    return true;
  }

  if (actionMatches(action, ["新增绑定"]) && page.id === "device-bind") {
    adminUiState.deviceBindMode = "create";
    resetAdminDeviceBindForm(button);
    return true;
  }

  if (actionMatches(action, ["批量导入", "导入"]) && ["devices", "device-bind"].includes(page.id)) {
    const file = await pickAdminCsvFile();
    if (!file) return true;
    const parsedRows = normalizeAdminDeviceImportRows(parseAdminCsvRows(await file.text()));
    if (!parsedRows.length) throw new Error("导入文件中没有可写入的设备记录");
    await ensureAdminScreenToken();
    const existingDevices = await adminApi("/api/devices");
    const existingIds = new Set(existingDevices.map((item) => item.deviceId || item.id).filter(Boolean));
    let successCount = 0;
    for (const row of parsedRows) {
      if (existingIds.has(row.deviceId)) continue;
      await adminApi("/api/devices/bind", { method: "POST", body: row });
      existingIds.add(row.deviceId);
      successCount += 1;
    }
    adminUiState.deviceBindMode = "import";
    finishAdminMutation(`${file.name} 已写入 ${successCount} 条设备记录`);
    return true;
  }

  if (actionMatches(action, ["导出"]) && ["devices", "device-bind"].includes(page.id)) {
    const devices = adminDeviceCollection();
    if (!devices.length) throw new Error("设备数据加载中，请稍后重试");
    const rows = adminDeviceCsvRows(devices);
    const csv = downloadAdminCsv("admin-devices.csv", rows);
    openAdminExportDialog({
      title: "设备清单导出结果",
      filename: "admin-devices.csv",
      csv,
      rowCount: devices.length,
      notice: "已生成 CSV，可直接复制；支持下载的浏览器会同时开始下载。",
    });
    recordAdminOperation("导出设备台账", `共 ${devices.length} 条设备记录`);
    return true;
  }

  if (actionMatches(action, ["确认绑定"]) && page.id === "device-bind") {
    await ensureAdminScreenToken();
    const payload = collectAdminDeviceBindPayload(button);
    const devices = await adminApi("/api/devices");
    if (devices.some((item) => (item.deviceId || item.id) === payload.deviceId)) throw new Error("设备编号已存在，请检查后重试");
    await adminApi("/api/devices/bind", { method: "POST", body: payload });
    adminUiState.deviceBindMode = "create";
    finishAdminMutation(`${payload.deviceId} 已绑定到${payload.elderName}`);
    return true;
  }

  if (actionMatches(action, ["重置"]) && page.id === "device-bind" && button?.closest?.(".device-bind-wizard")) {
    resetAdminDeviceBindForm(button);
    return true;
  }

  return false;
}

function setButtonBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
  button.classList.toggle("is-busy", busy);
}

function finishAdminMutation(message) {
  resetAdminRealtimeState();
  showToast(message);
  render();
}

function readAdminDeviceEditorFields(editor) {
  const root = document.querySelector(`[data-admin-device-editor="${editor}"]`);
  const fields = {};
  root?.querySelectorAll("[data-device-field]").forEach((input) => {
    const key = input.getAttribute("data-device-field");
    if (!key) return;
    fields[key] = input.type === "checkbox" ? input.checked : String(input.value || "").trim();
  });
  return fields;
}

async function refreshAdminDeviceDetailData(notice = "") {
  adminDeviceDetailState.notice = notice;
  resetAdminRealtimeState();
  await ensureAdminDashboard(currentPage());
  await ensureAdminAuditLogs(true);
  render();
}

function openAdminRouteForAction(actionName, page) {
  const action = normalizeActionText(actionName);
  const context = currentAdminContext(page);
  if (actionMatches(action, ["查看订单", "订单详情"])) return "order-detail";
  if (actionMatches(action, ["创建服务单", "创建订单"])) return "order-create";
  if (actionMatches(action, ["查看", "查看详情", "详情", "编辑"])) return operationalEditRoute(page);
  if (actionMatches(action, ["查看评价", "售后"])) return "after-sales";
  if (actionMatches(action, ["新增"]) && ["users", "guides", "merchants", "exceptions"].includes(page?.id)) return "";
  if (actionMatches(action, ["新增"]) && page.group === "user") return "user-create";
  if (actionMatches(action, ["新增"]) && page.group === "guide") return "guide-create";
  if (actionMatches(action, ["新增"]) && page.group === "merchant") return "service-create";
  if (actionMatches(action, ["新增"]) && page.group === "order") return "order-create";
  if (actionMatches(action, ["新增"]) && page.group === "content") return contentManagementRoute(page, action);
  if (actionMatches(action, ["新增"]) && page.group === "device") return "device-bind";
  if (actionMatches(action, ["派单", "分配", "调度"])) return "tasks";
  if (actionMatches(action, ["规则"])) return "dispatch-rules";
  if (actionMatches(action, ["权限", "角色"])) return "permission";
  return "";
}

async function handleAdminAuditAction(actionName, page) {
  const context = currentAdminContext(page);
  const isGuide = context.includes("guide") || context.includes("向导");
  const isMerchant = context.includes("merchant") || context.includes("商户");
  if (!isGuide && !isMerchant) return false;
  if (!actionMatches(actionName, ["通过", "驳回", "拒绝", "补充", "审核", "入驻"])) return false;
  const merchantIdMatch = String(actionName).match(/商户[:：]([^\\s]+)/);
  const guideIdMatch = String(actionName).match(/向导[:：]([^\\s]+)/);

  if (isGuide) {
    const guide = guideIdMatch
      ? (await adminApi("/api/admin/guides")).find((item) => item.id === guideIdMatch[1])
      : await fetchFirst("/api/admin/guides", (items) => items.find((item) => item.status !== "已认证") ? [items.find((item) => item.status !== "已认证")] : items);
    if (!guide) throw new Error("没有可审核的向导数据");
    const status = actionMatches(actionName, ["驳回", "拒绝"]) ? "已驳回" : actionMatches(actionName, ["补充"]) ? "待补充" : "已认证";
    const result = await adminApi(`/api/admin/guides/${guide.id}/audit`, {
      method: "POST",
    body: { status, decision: actionName, note: "管理后台审核操作" },
  });
    finishAdminMutation(`${result.realName || guide.realName}向导审核结果：${result.status}`);
    return true;
  }

  const merchant = merchantIdMatch
    ? (await adminApi("/api/admin/merchants")).find((item) => item.id === merchantIdMatch[1])
    : await fetchFirst("/api/admin/merchants", (items) => items.find((item) => item.status !== "已通过") ? [items.find((item) => item.status !== "已通过")] : items);
  if (!merchant) throw new Error("没有可审核的商户数据");
  const status = actionMatches(actionName, ["驳回", "拒绝"]) ? "已驳回" : actionMatches(actionName, ["补充"]) ? "待补充" : "已通过";
  const result = await adminApi(`/api/admin/merchants/${merchant.id}/audit`, {
    method: "POST",
    body: { status, decision: actionName, note: "管理后台审核操作" },
  });
  finishAdminMutation(`${result.name || merchant.name}商户审核结果：${result.status}`);
  return true;
}

async function handleAdminGuideManagementAction(actionName, page) {
  if (page?.id !== "guides") return false;
  const raw = String(actionName || "");
  const normalized = normalizeActionText(raw);
  const filterMatch = raw.match(/^向导筛选[:：](.+)$/);
  if (filterMatch) {
    applyAdminGuideQuickFilter(filterMatch[1]);
    return true;
  }
  const viewMatch = raw.match(/^查看向导[:：]([^\s]+)$/);
  if (viewMatch) {
    const guide = (adminGuideState.guides || []).find((item) => item.id === viewMatch[1]);
    if (!guide) throw new Error("没有找到对应向导接口数据");
    adminGuideState.selectedGuideId = guide.id;
    render();
    return true;
  }
  const auditMatch = raw.match(/^(通过|驳回)向导[:：]([^\s]+)$/);
  if (!auditMatch) return false;
  const guideId = auditMatch[2];
  const guide = (adminGuideState.guides || []).find((item) => item.id === guideId)
    || (await adminApi("/api/admin/guides")).find((item) => item.id === guideId);
  if (!guide) throw new Error("没有找到对应向导接口数据");
  const status = normalized.includes("驳回") ? "已驳回" : "已认证";
  const result = await adminApi(`/api/admin/guides/${guide.id}/audit`, {
    method: "POST",
    body: { status, decision: raw, note: "管理后台向导列表审核操作" },
  });
  adminGuideState.guides = (adminGuideState.guides || []).map((item) => item.id === result.id ? { ...item, ...result } : item);
  adminGuideState.selectedGuideId = result.id;
  await ensureAdminAuditLogs(true);
  render();
  showToast(`${result.realName || guide.realName || "向导"}审核结果：${result.status}`);
  return true;
}

async function handleAdminUserManagementAction(actionName, page) {
  if (page?.id !== "users") return false;
  const raw = String(actionName || "");
  const filterMatch = raw.match(/^用户筛选[:：](.+)$/);
  if (filterMatch) {
    applyAdminUserQuickFilter(filterMatch[1]);
    return true;
  }
  const viewMatch = raw.match(/^查看用户[:：]([^\s]+)$/);
  if (viewMatch) {
    const user = (adminUserState.users || []).find((item) => item.id === viewMatch[1]);
    if (!user) throw new Error("没有找到对应用户接口数据");
    adminUserState.selectedUserId = user.id;
    render();
    return true;
  }
  return false;
}

async function handleAdminDeviceDetailAction(actionName, button, page) {
  if (page?.id !== "device-detail") return false;
  const action = normalizeActionText(actionName);
  if (action === "切换设备操作") {
    adminDeviceDetailState.activeTab = "operations";
    if (adminDeviceDetailState.editor === "push") adminDeviceDetailState.editor = "";
    render();
    return true;
  }
  if (action === "切换参数设置") {
    adminDeviceDetailState.activeTab = "settings";
    if (!["push", "threshold"].includes(adminDeviceDetailState.editor)) adminDeviceDetailState.editor = "push";
    render();
    return true;
  }
  if (action === "查看原始数据") {
    adminDeviceDetailState.rawVisible = !adminDeviceDetailState.rawVisible;
    render();
    return true;
  }
  if (action === "编辑设备信息") {
    adminDeviceDetailState.editor = "device";
    render();
    return true;
  }
  if (action === "编辑绑定信息") {
    adminDeviceDetailState.editor = "binding";
    render();
    return true;
  }
  if (action === "编辑告警阈值") {
    adminDeviceDetailState.activeTab = "settings";
    adminDeviceDetailState.editor = "threshold";
    render();
    return true;
  }
  if (action === "取消设备信息编辑" || action === "取消绑定信息编辑" || action === "取消告警阈值编辑" || action === "取消推送设置" || action === "取消解绑设备") {
    adminDeviceDetailState.editor = "";
    render();
    return true;
  }

  const device = currentAdminDeviceDetail();
  const deviceId = device?.id || device?.deviceId;
  if (!device || !deviceId) throw new Error("当前设备不存在，无法执行操作");

  if (action === "保存设备信息") {
    const fields = readAdminDeviceEditorFields("device");
    await ensureAdminScreenToken();
    const result = await adminApi(`/api/devices/${deviceId}`, {
      method: "PUT",
      body: {
        name: fields.name || device.name,
        type: fields.type || device.type,
        onlineStatus: fields.onlineStatus || device.onlineStatus,
        battery: Math.max(0, Math.min(100, Number(fields.battery || device.battery || 0))),
        networkStatus: fields.networkStatus || device.networkStatus || "",
        location: fields.location || device.location || "",
        source: fields.source || device.source || "",
      },
    });
    adminDeviceDetailState.editor = "";
    await refreshAdminDeviceDetailData(`${result.deviceId || result.id} 设备信息已更新`);
    return true;
  }
  if (action === "保存绑定信息") {
    const fields = readAdminDeviceEditorFields("binding");
    await ensureAdminScreenToken();
    const result = await adminApi(`/api/devices/${deviceId}`, {
      method: "PUT",
      body: {
        elderName: fields.elderName || "",
        contactName: fields.contactName || "",
        contactRelation: fields.contactRelation || "",
        contactPhone: fields.contactPhone || "",
        region: fields.region || "",
        note: fields.note || "",
      },
    });
    adminDeviceDetailState.editor = "";
    await refreshAdminDeviceDetailData(`${result.deviceId || result.id} 绑定信息已更新`);
    return true;
  }
  if (action === "保存告警阈值") {
    const fields = readAdminDeviceEditorFields("threshold");
    await ensureAdminScreenToken();
    const result = await adminApi(`/api/devices/${deviceId}`, {
      method: "PUT",
      body: {
        alertThresholds: {
          heartRateHigh: Number(fields.heartRateHigh || adminDeviceThresholdDefaults.heartRateHigh),
          heartRateLow: Number(fields.heartRateLow || adminDeviceThresholdDefaults.heartRateLow),
          spo2Low: Number(fields.spo2Low || adminDeviceThresholdDefaults.spo2Low),
          inactivityMinutes: Number(fields.inactivityMinutes || adminDeviceThresholdDefaults.inactivityMinutes),
        },
      },
    });
    adminDeviceDetailState.editor = "";
    await refreshAdminDeviceDetailData(`${result.deviceId || result.id} 告警阈值已更新`);
    return true;
  }
  if (action === "保存推送设置") {
    const fields = readAdminDeviceEditorFields("push");
    await ensureAdminScreenToken();
    const result = await adminApi(`/api/devices/${deviceId}`, {
      method: "PUT",
      body: {
        pushSettings: {
          notifyFamily: Boolean(fields.notifyFamily),
          notifyAdmin: Boolean(fields.notifyAdmin),
          smsBackup: Boolean(fields.smsBackup),
          quietHours: fields.quietHours || "",
        },
      },
    });
    adminDeviceDetailState.editor = "";
    adminDeviceDetailState.activeTab = "settings";
    await refreshAdminDeviceDetailData(`${result.deviceId || result.id} 推送设置已更新`);
    return true;
  }
  if (action === "推送设置") {
    adminDeviceDetailState.activeTab = "settings";
    adminDeviceDetailState.editor = "push";
    render();
    return true;
  }
  if (action === "确认解绑设备") {
    await ensureAdminScreenToken();
    const result = await adminApi(`/api/devices/${deviceId}`, {
      method: "DELETE",
      body: {},
    });
    adminDeviceDetailState.editor = "";
    adminDeviceDetailState.notice = `${result.deviceId || result.id} 已解绑`;
    adminDeviceDetailState.selectedDeviceId = "";
    resetAdminRealtimeState();
    location.hash = pageHref("devices");
    render();
    return true;
  }
  if (action === "解绑设备") {
    adminDeviceDetailState.editor = "unbind";
    render();
    return true;
  }
  if (action === "远程检测") {
    await ensureAdminScreenToken();
    const result = await adminApi(`/api/devices/${deviceId}/action`, {
      method: "POST",
      body: { action: "设备自检", role: "admin" },
    });
    adminDeviceDetailState.activeTab = "operations";
    adminDeviceDetailState.editor = "";
    await refreshAdminDeviceDetailData(result.action?.result || `${device.type || "设备"}检测完成`);
    return true;
  }
  if (action === "切换监护功能") {
    const guardianFeature = button?.dataset?.guardianFeature || "";
    const enabled = button?.getAttribute("aria-pressed") !== "true";
    if (!guardianFeature) return true;
    await ensureAdminScreenToken();
    const result = await adminApi(`/api/devices/${deviceId}/action`, {
      method: "POST",
      body: {
        action: "监护功能配置",
        role: "admin",
        guardianFeature,
        enabled,
      },
    });
    await refreshAdminDeviceDetailData(result.action?.result || `${guardianFeature}${enabled ? "已开启" : "已关闭"}`);
    return true;
  }
  return false;
}

function exportAdminDispatchData() {
  const filter = adminDispatchState.statusFilter || "全部";
  const rows = dispatchRowsForFilter(adminDispatchState.statusFilter);
  if (!rows.length) throw new Error("当前筛选下没有可导出的任务记录");
  const csvRows = [
    ["任务编号", "服务类型", "老人", "预约时间", "地址", "优先级", "状态", "推荐执行方"],
    ...rows.map((row) => row.slice(0, 8)),
  ];
  const csv = downloadAdminCsv("admin-dispatch-tasks.csv", csvRows);
  openAdminExportDialog({
    title: "任务调度导出结果",
    filename: "admin-dispatch-tasks.csv",
    csv,
    rowCount: rows.length,
    notice: `已按${filter}生成任务调度 CSV，可直接复制或下载。`,
  });
  recordAdminOperation("导出任务调度", `${filter}/${rows.length}条`);
  return true;
}

async function importAdminDispatchCsv() {
  const file = await pickAdminCsvFile();
  if (!file) return true;
  const parsedRows = normalizeAdminDispatchImportRows(parseAdminCsvRows(await file.text()));
  if (!parsedRows.length) throw new Error("导入文件中没有可写入的任务记录");
  await ensureAdminScreenToken();
  let createdCount = 0;
  let dispatchedCount = 0;
  for (const row of parsedRows) {
    const providerType = row.assigneeType === "merchant" ? "merchant" : "guide";
    const createdOrder = await adminApi("/api/orders", {
      method: "POST",
      body: {
        elderName: row.elderName,
        serviceType: row.serviceType,
        providerType,
        time: row.time,
        location: row.location,
        amount: row.amount,
        note: row.note,
        source: `任务调度批量导入:${file.name}`,
      },
    });
    createdCount += 1;
    if (row.status === "待派单" && !row.assigneeId && !row.assigneeName) continue;
    const queue = await adminApi("/api/admin/dispatch/pending");
    const order = queue.pendingOrders?.find((item) => item.id === createdOrder.id || item.orderNo === createdOrder.orderNo);
    const provider = resolveAdminDispatchAssignee(row, queue)
      || order?.recommendedProvider
      || queue.candidates?.guides?.[0]
      || queue.candidates?.merchants?.[0];
    if (!order || !provider) continue;
    await adminApi("/api/tasks/dispatch", {
      method: "POST",
      body: {
        orderId: order.id,
        assigneeType: provider.assigneeType || (provider.realName ? "guide" : "merchant"),
        assigneeId: provider.assigneeId || provider.id,
        dispatchRule: `任务调度批量导入:${file.name}`,
      },
    });
    dispatchedCount += 1;
  }
  finishAdminMutation(`${file.name} 已导入 ${createdCount} 条任务，已派单 ${dispatchedCount} 条`);
  return true;
}

async function refreshAdminDispatchRealtime(notice = "") {
  adminDispatchState.detailNotice = notice;
  adminDispatchState.loaded = false;
  adminDispatchState.loading = false;
  adminDispatchState.error = "";
  adminDispatchState.queue = null;
  await ensureAdminDispatchData(currentPage());
  render();
}

async function handleAdminDispatchDetailAction(actionName, page) {
  if (page?.id !== "dispatch-detail") return false;
  const action = normalizeActionText(actionName);
  const detail = currentAdminDispatchDetail();
  if (!detail?.order?.id) return false;
  const orderId = detail.order.id;
  const tabMatch = action.match(/^切换调度详情标签[:：]?(.+)$/);
  if (tabMatch) {
    adminDispatchState.detailTab = String(tabMatch[1] || "map").trim() || "map";
    render();
    return true;
  }
  if (action === "一键派单") {
    const provider = detail.provider || detail.order.recommendedProvider || detail.candidates?.guides?.[0] || detail.candidates?.merchants?.[0];
    if (!provider) throw new Error("当前没有可派发的执行方");
    const result = await adminApi("/api/tasks/dispatch", {
      method: "POST",
      body: {
        orderId,
        assigneeType: provider.assigneeType || (provider.realName ? "guide" : "merchant"),
        assigneeId: provider.assigneeId || provider.id,
        dispatchRule: "管理后台一键派单",
        allowRedispatch: true,
      },
    });
    await refreshAdminDispatchRealtime(`${result.order.orderNo}已派单给${result.task.assigneeName}`);
    return true;
  }
  if (action === "改派") {
    adminDispatchState.detailMode = "reassign";
    adminDispatchState.detailTab = "candidates";
    adminDispatchState.detailNotice = "请在候选列表中重新选择执行方，完成改派。";
    render();
    return true;
  }
  if (action === "指定执行方") {
    adminDispatchState.detailMode = "assign";
    adminDispatchState.detailTab = "candidates";
    adminDispatchState.detailNotice = "请在候选列表中指定执行方。";
    render();
    return true;
  }
  if (action === "关闭调度编辑") {
    adminDispatchState.detailMode = "";
    adminDispatchState.detailNotice = "";
    render();
    return true;
  }
  const selectMatch = action.match(/^选择执行方[:：]?([^:：]+)[:：]?(.+)$/);
  if (selectMatch) {
    const assigneeType = selectMatch[1] || "guide";
    const assigneeId = selectMatch[2] || "";
    const mode = adminDispatchState.detailMode;
    const result = await adminApi("/api/tasks/dispatch", {
      method: "POST",
      body: {
        orderId,
        assigneeType,
        assigneeId,
        dispatchRule: mode === "reassign" ? "管理后台人工改派" : "管理后台指定执行方",
        allowRedispatch: true,
      },
    });
    adminDispatchState.detailMode = "";
    await refreshAdminDispatchRealtime(`${result.order.orderNo}已${mode === "reassign" ? "改派" : "分配"}给${result.task.assigneeName}`);
    return true;
  }
  if (action === "通知执行方") {
    const target = detail.provider || detail.order.recommendedProvider || detail.candidates?.guides?.[0] || detail.candidates?.merchants?.[0];
    if (!target) throw new Error("当前没有可通知的执行方");
    const result = await adminApi("/api/admin/dispatch/notify", {
      method: "POST",
      body: {
        orderId,
        assigneeType: target.assigneeType || (target.realName ? "guide" : "merchant"),
        assigneeId: target.assigneeId || target.id,
      },
    });
    await refreshAdminDispatchRealtime(`已通知${result.assigneeName}处理${result.orderNo}`);
    return true;
  }
  if (action === "取消任务") {
    const result = await adminApi(`/api/orders/${orderId}/cancel`, {
      method: "POST",
      body: {
        reason: "后台调度取消任务",
        actor: "平台管理员",
      },
    });
    await refreshAdminDispatchRealtime(`${result.orderNo || detail.order.orderNo}已取消`);
    return true;
  }
  return false;
}

async function handleAdminDispatchAction(actionName, page) {
  const action = normalizeActionText(actionName);
  const context = currentAdminContext(page);
  if (await handleAdminDispatchDetailAction(actionName, page)) return true;
  const isDispatchPage = page?.group === "dispatch" || context.includes("dispatch") || /调度|派单/.test(page?.title || "");
  const quickFilterMatch = action.match(/^任务调度筛选[:：]?(.+)$/);
  if (isDispatchPage && quickFilterMatch) {
    const visible = applyAdminDispatchStatusQuickFilter(quickFilterMatch[1]);
    showToast(visible ? `任务状态已筛选：${quickFilterMatch[1]}（${visible} 条）` : `任务状态已筛选：${quickFilterMatch[1]}（暂无记录）`);
    return true;
  }
  if (page?.id === "tasks" && actionMatches(action, ["批量导入", "导入"])) {
    await importAdminDispatchCsv();
    return true;
  }
  if (page?.id === "tasks" && actionMatches(action, ["导出"])) {
    exportAdminDispatchData();
    return true;
  }
  if (!isDispatchPage || !actionMatches(action, ["派单", "分配", "指派", "匹配", "调度"])) return false;
  const queue = await adminApi("/api/admin/dispatch/pending");
  const order = queue.pendingOrders?.[0];
  if (!order) {
    showToast("当前没有待派单订单，调度队列已刷新");
    return true;
  }
  const provider = order.recommendedProvider || queue.candidates?.guides?.[0] || queue.candidates?.merchants?.[0];
  const body = {
    orderId: order.id,
    assigneeType: provider.assigneeType || (provider.realName ? "guide" : "merchant"),
    assigneeId: provider.assigneeId || provider.id,
    dispatchRule: "管理后台一键派单",
  };
  const result = await adminApi("/api/tasks/dispatch", { method: "POST", body });
  finishAdminMutation(`${result.order.orderNo}已派单给${result.task.assigneeName}`);
  return true;
}

async function handleAdminOrderAction(actionName, page) {
  const action = normalizeActionText(actionName);
  const context = currentAdminContext(page);
  const isOrderPage = page?.group === "order" || context.includes("order") || /订单/.test(page?.title || "");
  const quickFilterMatch = action.match(/^订单列表筛选[:：]?(.+)$/);
  if (isOrderPage && quickFilterMatch) {
    const label = quickFilterMatch[1];
    const visible = applyAdminOrderQuickFilter(label);
    showToast(visible ? `订单状态已筛选：${label}（${visible} 条）` : `订单状态已筛选：${label}（暂无记录）`);
    return true;
  }
  return false;
}

async function handleAdminAlertAction(actionName, page) {
  const context = currentAdminContext(page);
  const isAlertPage = context.includes("exception") || context.includes("device") || context.includes("异常") || context.includes("SOS");
  if (!isAlertPage && !actionMatches(actionName, ["处理", "关闭", "误报", "复核", "校验"])) return false;
  if (!actionMatches(actionName, ["处理", "关闭", "误报", "复核", "校验", "确认", "联系"])) return false;
  const alert = await fetchFirst("/api/admin/alerts", (items) => items.filter((item) => item.status !== "已处理"));
  if (!alert) {
    showToast("当前没有待处理异常，异常列表已刷新");
    return true;
  }
  const status = actionMatches(actionName, ["处理中", "联系"]) ? "处理中" : "已处理";
  const result = await adminApi(`/api/alerts/${alert.id}/handle`, {
    method: "POST",
    body: { status, result: status === "处理中" ? "后台已联系相关人员，正在跟进。" : "后台已处理并同步用户/家属。" },
  });
  finishAdminMutation(`${result.type || "异常"}处理结果：${result.status}`);
  return true;
}

async function handleAdminServiceRequestAction(actionName) {
  if (!actionMatches(actionName, ["处理请求", "去处理", "客服跟进", "回访", "处理服务"])) return false;
  const request = await fetchFirst("/api/service-requests?status=待处理");
  if (!request) {
    showToast("当前没有待处理服务请求");
    return true;
  }
  const result = await adminApi(`/api/service-requests/${request.id}/handle`, {
    method: "POST",
    body: { status: "已处理", result: "后台已处理并同步用户消息。" },
  });
  finishAdminMutation(`${result.type}请求已处理并同步`);
  return true;
}

async function handleAdminServiceStatusAction(actionName, page) {
  const context = currentAdminContext(page);
  const serviceIdMatch = String(actionName || "").match(/服务[:：]([A-Za-z0-9_-]+)/);
  if (context.includes("merchant-services")) {
    const quickFilterMatch = String(actionName || "").match(/^服务项目筛选[:：]?(.+)$/);
    if (quickFilterMatch) {
      const label = quickFilterMatch[1];
      const visible = applyAdminMerchantServiceQuickFilter(label);
      showToast(visible ? `服务项目已筛选：${label}（${visible} 条）` : `服务项目已筛选：${label}（暂无记录）`);
      return true;
    }
  }
  if (!context.includes("merchant") && !context.includes("服务") && !actionMatches(actionName, ["上架", "下架", "发布到前端"])) return false;
  if (!actionMatches(actionName, ["上架", "下架", "发布到前端", "服务审核"])) return false;
  const service = serviceIdMatch
    ? (await adminApi("/api/admin/services")).find((item) => item.id === serviceIdMatch[1])
    : await fetchFirst("/api/admin/services", (items) => items.find((item) => item.status !== "上架") ? [items.find((item) => item.status !== "上架")] : items);
  if (!service) throw new Error("没有可更新的服务项目");
  const status = actionMatches(actionName, ["下架"]) ? "下架" : "上架";
  const result = await adminApi(`/api/admin/services/${service.id}/status`, {
    method: "POST",
    body: { status, note: "管理后台服务状态操作" },
  });
  finishAdminMutation(`${result.title}已${result.status}，商户端和用户端可同步看到`);
  return true;
}

async function handleAdminUserDetailAction(actionName, page) {
  if (page?.id !== "user-detail") return false;
  if (actionMatches(actionName, ["冻结用户账号", "冻结账号", "启用账号", "恢复账号"])) {
    const profile = await adminApi("/api/user/profile");
    const currentStatus = profile.user?.status || "正常";
    const nextStatus = currentStatus === "冻结" || actionMatches(actionName, ["启用", "恢复"]) ? "正常" : "冻结";
    const result = await adminApi("/api/user/profile", {
      method: "PUT",
      body: { status: nextStatus },
    });
    resetAdminRealtimeState();
    showToast(`${result.nickname || result.name || "用户"}账号已${nextStatus === "冻结" ? "冻结" : "启用"}`);
    render();
    return true;
  }
  return false;
}

async function handleAdminActivityAction(actionName, page) {
  const context = currentAdminContext(page);
  if (!context.includes("content") && !context.includes("活动") && !actionMatches(actionName, ["发布活动", "保存并发布", "下线活动"])) return false;
  if (actionMatches(actionName, ["发布活动", "保存并发布", "发布"])) {
    const data = await adminApi("/api/admin/activities");
    const activity = data.activities?.[0];
    if (activity) {
      const result = await adminApi(`/api/admin/activities/${activity.id}/status`, {
        method: "POST",
        body: { status: "报名中" },
      });
      finishAdminMutation(`${result.title}已发布到用户端活动地图`);
      return true;
    }
    const created = await adminApi("/api/admin/activities", {
      method: "POST",
      body: { title: "云旅自然观光活动", category: "自然观光", status: "报名中" },
    });
    finishAdminMutation(`${created.title}已创建并发布到用户端`);
    return true;
  }
  if (actionMatches(actionName, ["下线", "关闭报名"])) {
    const activity = await fetchFirst("/api/admin/activities", (data) => data.activities || []);
    if (!activity) throw new Error("没有可下线的活动");
    const result = await adminApi(`/api/admin/activities/${activity.id}/status`, {
      method: "POST",
      body: { status: "已下线" },
    });
    finishAdminMutation(`${result.title}已下线`);
    return true;
  }
  return false;
}

async function handleAdminRealtimeAction(actionName, button) {
  const page = currentPage();
  const settingsCategoryHandled = handleAdminSettingsCategoryAction(button, page);
  if (settingsCategoryHandled) return true;
  const bannerHandled = await handleAdminBannerAction(actionName, button, page);
  if (bannerHandled) return true;
  const configHandled = await handleAdminConfigAction(actionName, button, page);
  if (configHandled) return true;
  if (await handleAdminDeviceManagementAction(actionName, button, page)) return true;
  if (await handleAdminDeviceDetailAction(actionName, button, page)) return true;
  if (button?.closest?.(".tabs, .admin-content-tabs, .admin-health-tabs, .settings-tabs")) {
    activateAdminTab(button, actionName);
    return true;
  }
  await ensureAdminScreenToken();
  if (actionMatches(actionName, ["刷新"])) {
    resetAdminRealtimeState();
    render();
    showToast("后台实时数据已重新同步");
    return true;
  }
  if (await handleAdminDeviceExceptionAction(actionName, page)) return true;
  if (await handleAdminServiceStatusAction(actionName, page)) return true;
  if (await handleAdminUserManagementAction(actionName, page)) return true;
  if (await handleAdminGuideManagementAction(actionName, page)) return true;
  if (await handleAdminAuditAction(actionName, page)) return true;
  if (await handleAdminOrderAction(actionName, page)) return true;
  if (await handleAdminDispatchAction(actionName, page)) return true;
  if (await handleAdminAlertAction(actionName, page)) return true;
  if (await handleAdminServiceRequestAction(actionName, page)) return true;
  if (await handleAdminUserDetailAction(actionName, page)) return true;
  if (await handleAdminActivityAction(actionName, page)) return true;
  if (await handleAdminImportExportAction(actionName, page)) return true;

  const route = openAdminRouteForAction(actionName, page);
  if (route && route !== page.id) {
    location.hash = pageHref(route);
    showToast(`${actionName}，进入${pageById(route)?.title || "对应页面"}`);
    return true;
  }
  if (await handleAdminInlineStateAction(actionName, button, page)) return true;
  return false;
}

function readAdminBannerField(name, fallback = "") {
  const input = app.querySelector(`[data-admin-banner-field="${name}"]`);
  if (!input) return fallback;
  if (input.type === "checkbox") return input.checked;
  if (input.type === "range") return Number(input.value || fallback || 0);
  return String(input.value || "").trim() || fallback;
}

function collectAdminBannerDraftFromDom() {
  const current = adminBannerState.draft || defaultAdminBannerDraft(adminBannerState.home, adminBannerState.activityData?.activities || []);
  return {
    ...current,
    title: readAdminBannerField("title", current.title),
    slogan: readAdminBannerField("slogan", current.slogan),
    buttonText: readAdminBannerField("buttonText", current.buttonText),
    linkTarget: readAdminBannerField("linkTarget", current.linkTarget),
    startAt: readAdminBannerField("startAt", current.startAt),
    endAt: readAdminBannerField("endAt", current.endAt),
    weight: Number(readAdminBannerField("weight", current.weight)),
  };
}

function syncAdminBannerDraftFromDom() {
  if (currentPage().id !== "banner") return adminBannerState.draft;
  adminBannerState.draft = collectAdminBannerDraftFromDom();
  return adminBannerState.draft;
}

function resetAdminBannerData() {
  adminBannerState.loaded = false;
  adminBannerState.loading = false;
  adminBannerState.error = "";
  adminBannerState.home = null;
  adminBannerState.activityData = null;
  adminBannerState.orders = [];
  adminBannerState.uiActions = [];
  adminBannerState.draft = null;
  adminBannerState.notice = "";
}

async function ensureAdminBannerData(page) {
  if (!pageNeedsBannerData(page) || adminBannerState.loading || adminBannerState.loaded) return;
  adminBannerState.loading = true;
  adminBannerState.error = "";
  try {
    await ensureAdminScreenToken();
    const [home, activityData, orders, uiActions] = await Promise.all([
      adminApi("/api/admin/content/home"),
      adminApi("/api/admin/activities"),
      adminApi("/api/admin/orders"),
      adminApi("/api/admin/ui-actions"),
    ]);
    adminBannerState.home = home;
    adminBannerState.activityData = activityData;
    adminBannerState.orders = Array.isArray(orders) ? orders : [];
    adminBannerState.uiActions = Array.isArray(uiActions) ? uiActions : [];
    adminBannerState.draft = defaultAdminBannerDraft(home, activityData?.activities || []);
    adminBannerState.loaded = true;
  } catch (error) {
    adminBannerState.error = error.message;
    adminBannerState.loaded = false;
  } finally {
    adminBannerState.loading = false;
  }
  if (pageNeedsBannerData(currentPage())) render();
}

async function persistAdminBannerDraft() {
  const draft = syncAdminBannerDraftFromDom();
  const result = await adminApi("/api/admin/content/home", {
    method: "PUT",
    body: {
      cityOptions: (draft.cityOptions || []).map((item) => String(item || "").replace(/市$/, "")),
      banner: {
        image: draft.image,
        title: draft.title,
        slogan: draft.slogan,
        buttonText: draft.buttonText,
        linkType: draft.linkType,
        linkTarget: draft.linkTarget,
        startAt: draft.startAt,
        endAt: draft.endAt,
        platforms: draft.platforms,
        status: draft.status,
        weight: Number(draft.weight || 0),
      },
    },
  });
  adminBannerState.home = result.home || adminBannerState.home;
  adminBannerState.draft = defaultAdminBannerDraft(adminBannerState.home, adminBannerState.activityData?.activities || []);
  adminBannerState.loaded = true;
  adminBannerState.notice = `${draft.title || "首页 Banner"} 已同步到用户端首页`;
  await ensureAdminAuditLogs(true);
  render();
  showToast(adminBannerState.notice);
  return true;
}

function toggleAdminBannerListValue(list = [], value = "", fallback = []) {
  const values = Array.isArray(list) ? list.slice() : [];
  const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  return next.length ? next : fallback.slice();
}

function exportAdminBannerData() {
  const draft = syncAdminBannerDraftFromDom();
  const publishRows = buildAdminBannerPublishRows(adminAuditState.logs || [], adminBannerState.home);
  const rows = [
    ["字段", "当前值"],
    ["标题", draft.title],
    ["副标题", draft.slogan],
    ["按钮文案", draft.buttonText],
    ["跳转类型", adminBannerLinkTypeLabel(draft.linkType)],
    ["跳转目标", adminBannerTargetLabel(draft, adminBannerState.activityData?.activities || [])],
    ["展示时间", `${draft.startAt} ~ ${draft.endAt}`],
    ["城市定向", (draft.cityOptions || []).join("、")],
    ["展示端", adminBannerDisplayPlatforms(draft.platforms).join(" / ")],
    ["状态", draft.status],
    ["推荐权重", `${draft.weight}/100`],
    [],
    ["发布时间", "操作", "操作人"],
    ...publishRows,
  ];
  openAdminExportDialog({
    title: "首页 Banner 配置导出",
    filename: "admin-home-banner-export.csv",
    csv: buildAdminCsv(rows),
    rowCount: rows.length - 1,
    notice: "当前 Banner 配置和发布记录已生成 CSV 预览",
  });
}

function previewAdminBannerHome() {
  const opened = window.open("/user/#01", "_blank", "noopener");
  if (!opened) location.href = "/user/#01";
}

async function handleAdminBannerAction(actionName, button, page) {
  if (page?.id !== "banner") return false;
  const action = normalizeActionText(actionName);
  const activities = adminBannerState.activityData?.activities || [];

  if (actionMatches(action, ["保存并发布", "保存"])) {
    await persistAdminBannerDraft();
    return true;
  }
  if (actionMatches(action, ["恢复后台配置", "重置草稿"])) {
    adminBannerState.draft = defaultAdminBannerDraft(adminBannerState.home, activities);
    adminBannerState.notice = "已恢复后台已发布配置";
    render();
    return true;
  }
  if (actionMatches(action, ["导出数据"])) {
    exportAdminBannerData();
    return true;
  }
  if (actionMatches(action, ["预览首页"])) {
    previewAdminBannerHome();
    return true;
  }
  if (actionMatches(action, ["更换Banner图片"])) {
    const draft = syncAdminBannerDraftFromDom();
    const currentIndex = Math.max(0, ADMIN_BANNER_IMAGE_CHOICES.indexOf(draft.image));
    draft.image = ADMIN_BANNER_IMAGE_CHOICES[(currentIndex + 1) % ADMIN_BANNER_IMAGE_CHOICES.length];
    adminBannerState.draft = draft;
    render();
    return true;
  }
  if (action === "切换Banner状态") {
    const draft = syncAdminBannerDraftFromDom();
    draft.status = draft.status === "已发布" ? "已下线" : "已发布";
    adminBannerState.draft = draft;
    await persistAdminBannerDraft();
    return true;
  }

  const deleteMatch = action.match(/^删除Banner[:：]?(.+)?$/);
  if (deleteMatch) {
    const id = String(deleteMatch[1] || "").trim() || adminBannerState.selectedId || "home-banner";
    adminBannerState.deletedIds.add(id);
    const row = button?.closest("tr");
    if (row) row.hidden = true;
    if (adminBannerState.selectedId === id) adminBannerState.selectedId = "";
    adminBannerState.notice = `Banner ${id} 已从当前列表移除`;
    render();
    return true;
  }

  const editMatch = action.match(/^编辑Banner[:：]?(.+)?$/);
  if (editMatch) {
    const id = String(editMatch[1] || "").trim() || "home-banner";
    adminBannerState.selectedId = id;
    syncAdminBannerDraftFromDom();
    render();
    requestAnimationFrame(() => app.querySelector('[data-admin-banner-field="title"]')?.focus());
    return true;
  }

  const rowStatusMatch = action.match(/^切换Banner状态[:：]?(.+)?$/);
  if (rowStatusMatch) {
    const id = String(rowStatusMatch[1] || "").trim() || "home-banner";
    adminBannerState.selectedId = id;
    const draft = syncAdminBannerDraftFromDom();
    draft.status = draft.status === "已发布" ? "已下线" : "已发布";
    adminBannerState.draft = draft;
    await persistAdminBannerDraft();
    return true;
  }

  const typeMatch = action.match(/^选择Banner跳转类型[:：]?(.+)?$/);
  if (typeMatch) {
    const draft = syncAdminBannerDraftFromDom();
    draft.linkType = String(typeMatch[1] || "").trim() || "activity";
    if (draft.linkType === "activity") {
      draft.linkTarget = activities.find((item) => item.id === draft.linkTarget)?.id || activities[0]?.id || "";
    }
    if (draft.linkType !== "activity" && !draft.linkTarget) {
      draft.linkTarget = "";
    }
    adminBannerState.draft = draft;
    render();
    return true;
  }

  const cityMatch = action.match(/^切换Banner城市[:：]?(.+)?$/);
  if (cityMatch) {
    const draft = syncAdminBannerDraftFromDom();
    const city = String(cityMatch[1] || "").trim();
    draft.cityOptions = toggleAdminBannerListValue(draft.cityOptions, city, [city]);
    adminBannerState.draft = draft;
    render();
    return true;
  }

  const platformMatch = action.match(/^切换Banner平台[:：]?(.+)?$/);
  if (platformMatch) {
    const draft = syncAdminBannerDraftFromDom();
    const platform = String(platformMatch[1] || "").trim();
    draft.platforms = toggleAdminBannerListValue(draft.platforms, platform, [platform]);
    adminBannerState.draft = draft;
    render();
    return true;
  }

  return false;
}

async function handleAdminDeviceExceptionAction(actionName, page) {
  if (page?.id !== "device-exception") return false;
  return false;
}

function downloadAdminCsv(filename, rows) {
  const csv = buildAdminCsv(rows);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
  return csv;
}

function activateAdminTab(button, actionName) {
  const group = button.closest(".tabs, .admin-content-tabs, .admin-health-tabs, .settings-tabs");
  group?.querySelectorAll("button").forEach((item) => {
    item.classList.remove("active", "is-active");
    item.setAttribute("aria-pressed", "false");
  });
  button.classList.add("active", "is-active");
  button.setAttribute("aria-pressed", "true");
  const panel = group?.nextElementSibling;
  if (panel) panel.dataset.activeTab = normalizeActionText(actionName);
  showToast(`${normalizeActionText(actionName) || "当前"}视图已生效`);
}

function pageById(id) {
  return pages.find((item) => item.id === id);
}

async function handleAdminNotificationAction(actionName, button) {
  if (currentPage().id !== "notifications") return false;
  if (button?.hasAttribute?.("data-admin-notification-filter")) {
    adminNotificationState.filter = button.getAttribute("data-admin-notification-filter") || "all";
    adminNotificationState.notice = `当前视图：${button.textContent.trim()}`;
    render();
    return true;
  }
  if (button?.hasAttribute?.("data-admin-notification-search")) {
    adminNotificationState.keyword = document.querySelector("[data-admin-notification-keyword]")?.value?.trim() || "";
    adminNotificationState.notice = adminNotificationState.keyword ? `已按「${adminNotificationState.keyword}」筛选真实消息` : "已显示全部真实消息";
    render();
    return true;
  }
  if (button?.hasAttribute?.("data-admin-notification-reset")) {
    adminNotificationState.filter = "all";
    adminNotificationState.keyword = "";
    adminNotificationState.notice = "筛选条件已重置";
    render();
    return true;
  }
  if (button?.hasAttribute?.("data-admin-notification-refresh")) {
    adminMessageState.loaded = false;
    adminNotificationState.notice = "正在重新读取 /api/messages?role=admin";
    await ensureAdminMessages(true);
    adminNotificationState.notice = `消息已刷新，当前 ${adminMessageState.messages.length} 条`;
    render();
    return true;
  }
  if (button?.hasAttribute?.("data-admin-notification-read-all")) {
    await ensureAdminScreenToken();
    const result = await adminApi("/api/messages/read-all", {
      method: "POST",
      body: { role: "admin" },
    });
    adminNotificationState.notice = `全部已读已同步：本次更新 ${result.changed || 0} 条，未读 ${result.unread || 0} 条`;
    await ensureAdminMessages(true);
    return true;
  }
  if (button?.hasAttribute?.("data-admin-notification-read")) {
    const id = button.getAttribute("data-admin-notification-read") || "";
    if (!id) throw new Error("缺少消息 ID，无法标记已读");
    await ensureAdminScreenToken();
    const message = await adminApi(`/api/messages/${id}/read`, {
      method: "POST",
      body: { role: "admin" },
    });
    adminNotificationState.notice = `${message.title || id} 已标记为已读`;
    await ensureAdminMessages(true);
    return true;
  }
  return false;
}

async function handleAdminInlineStateAction(actionName, button, page) {
  if (actionMatches(actionName, ["保存草稿", "保存", "提交审核", "提交", "发送"])) {
    const message = actionMatches(actionName, ["草稿"]) ? "草稿已保存" : actionMatches(actionName, ["发送"]) ? "消息已发送并记录触达结果" : "内容已提交审核";
    showToast(message);
    return true;
  }
  if (actionMatches(actionName, ["预览"])) {
    showToast("预览区已刷新");
    return true;
  }
  if (actionMatches(actionName, ["测试", "模拟测试"])) {
    showToast("测试已完成，结果已写入操作日志");
    return true;
  }
  if (actionMatches(actionName, ["同步"])) {
    resetAdminRealtimeState();
    render();
    showToast("数据源重新同步完成");
    return true;
  }
  if (actionMatches(actionName, ["上传", "更换图片", "添加Banner"])) {
    const route = page.group === "content" ? page.id : operationalEditRoute(page);
    if (route && route !== page.id) {
      location.hash = pageHref(route);
    } else {
      render();
    }
    showToast(`${actionName}已定位到当前编辑区`);
    return true;
  }
  if (actionMatches(actionName, ["添加标签", "关联活动", "关联服务", "添加"])) {
    const route = openAdminRouteForAction("新增", page);
    if (route && route !== page.id) {
      location.hash = pageHref(route);
      showToast(`${actionName}，进入${pageById(route)?.title || "新增页面"}`);
    } else {
      showToast(`${actionName}已添加到当前配置`);
    }
    return true;
  }
  if (actionMatches(actionName, ["移除"])) {
    const removable = button?.closest?.("p, figure, article, .tree-row, .insight-item");
    if (removable) removable.remove();
    showToast(`${actionName}已移除`);
    return true;
  }
  if (actionMatches(actionName, ["选择", "开启", "关闭", "定时发布", "立即发布", "费用免费", "费用收费", "发布状态"])) {
    button?.classList?.toggle("active", true);
    button?.classList?.toggle("on", actionMatches(actionName, ["开启", "费用收费"]));
    if (actionMatches(actionName, ["开启"])) button.textContent = "开启";
    if (actionMatches(actionName, ["关闭"])) button.textContent = "关闭";
    showToast(`${actionName}配置项当前生效`);
    return true;
  }
  if (actionMatches(actionName, ["导出", "下载", "导出报表", "导出明细", "导出记录", "导出健康档案"])) {
    showToast(`${actionName}任务已创建，可在操作日志查看进度`);
    setButtonBusy(button, false);
    return true;
  }
  if (actionMatches(actionName, ["刷新位置"])) {
    showToast("服务位置已刷新");
    setButtonBusy(button, false);
    return true;
  }
  return false;
}

function handleAdminFallbackAction(actionName, button, page) {
  const route = openAdminRouteForAction(actionName, page) || operationalEditRoute(page);
  if (route && route !== page.id) {
    location.hash = pageHref(route);
    showToast(`${actionName}，进入${pageById(route)?.title || "对应管理页"}`);
    return true;
  }
  const directMessage = applyAdminLocalAction(actionName, button, page);
  if (directMessage) {
    renderAdminActionResult(button, actionName, directMessage, page);
    return true;
  }
  renderAdminActionResult(button, actionName, adminFallbackMessage(actionName, button, page), page);
  return true;
}

function renderAdminActionResult(button, actionName, message, page) {
  document.querySelectorAll("[data-admin-action-result]").forEach((panel) => panel.remove());
  if (!button) return;
  button.dataset.lastAdminAction = normalizeActionText(actionName) || "";
  button.dataset.lastAdminResult = actionText(message);
  if (page?.id === "device-detail") adminDeviceDetailState.notice = actionText(message);
}

function adminFallbackMessage(actionName, button, page) {
  const action = normalizeActionText(actionName);
  if (actionMatches(action, ["查看", "详情", "更多"])) return "当前记录详情区已定位，请在列表中选择具体记录";
  if (actionMatches(action, ["编辑"])) {
    button?.classList?.toggle("active", true);
    return "当前内容已进入可编辑状态，请修改后保存";
  }
  if (actionMatches(action, ["刷新"])) return "列表数据已刷新";
  if (actionMatches(action, ["导出", "下载"])) return "导出任务已创建，可在操作日志查看进度";
  if (actionMatches(action, ["删除"])) return "删除操作需先选择记录，请在列表勾选后再执行";
  if (actionMatches(action, ["审核"])) return "审核操作需选择待审核记录，请在列表中点击对应记录";
  if (actionMatches(action, ["处理"])) return "处理操作需选择待处理记录，请在列表中点击对应工单";
  return `${page?.title || "当前页面"}操作已记录，可在操作日志查看`;
}

function clearAdminToastOperationPanels() {
  document.querySelectorAll('[data-admin-action-result][data-action="后台操作"]').forEach(panel => panel.remove());
}

async function persistAdminConfigDraft(message = "系统配置已保存") {
  const draft = collectAdminConfigDraftFromDom();
  const result = await adminApi("/api/admin/config", {
    method: "PUT",
    body: draft,
  });
  adminConfigState.data = result.config || result;
  adminConfigState.loaded = true;
  adminConfigState.notice = message;
  await ensureAdminAuditLogs(true);
  render();
  showToast(message);
  return adminConfigState.data;
}

function scrollAdminConfigVersionRecords() {
  const target = document.querySelector("[data-admin-config-version-records]");
  if (!target) return false;
  const stickyOffset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 68;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - stickyOffset - 12;
  window.scrollTo({ top: Math.max(0, Math.round(targetTop)), behavior: "smooth" });
  return true;
}

async function handleAdminConfigAction(actionName, button, page) {
  if (page?.id !== "config") return false;
  const action = normalizeActionText(actionName);
  if (actionMatches(action, ["更换平台Logo", "更换Logo", "上传Logo", "更换"])) {
    const logoInput = app.querySelector('[data-admin-config-field="platform.logo"]');
    const current = logoInput?.value || adminConfigData().platform?.logo || ADMIN_CONFIG_LOGO_CHOICES[0];
    const next = nextAdminConfigLogoChoice(current);
    if (logoInput) logoInput.value = next;
    updateAdminConfigLogoPreview(next);
    await persistAdminConfigDraft("平台 Logo 已更新并保存到系统配置");
    return true;
  }
  if (actionMatches(action, ["删除平台Logo", "删除Logo", "删除"])) {
    const logoInput = app.querySelector('[data-admin-config-field="platform.logo"]');
    if (logoInput) logoInput.value = "";
    updateAdminConfigLogoPreview("");
    await persistAdminConfigDraft("平台 Logo 已删除并保存到系统配置");
    return true;
  }
  if (actionMatches(action, ["保存配置", "保存"])) {
    await persistAdminConfigDraft("系统配置已保存，等待发布");
    return true;
  }
  if (actionMatches(action, ["发布配置", "发布"])) {
    await persistAdminConfigDraft("系统配置已保存，正在发布");
    const result = await adminApi("/api/admin/config/publish", {
      method: "POST",
      body: { note: "管理后台系统配置页发布" },
    });
    adminConfigState.data = result.config || result;
    adminConfigState.loaded = true;
    adminConfigState.notice = "系统配置已发布到运行环境";
    await ensureAdminAuditLogs(true);
    render();
    showToast(adminConfigState.notice);
    return true;
  }
  if (actionMatches(action, ["恢复默认"])) {
    const result = await adminApi("/api/admin/config/reset", {
      method: "POST",
      body: { note: "管理后台系统配置页恢复默认" },
    });
    adminConfigState.data = result.config || result;
    adminConfigState.loaded = true;
    adminConfigState.notice = "系统配置已恢复默认值，等待发布";
    await ensureAdminAuditLogs(true);
    render();
    showToast(adminConfigState.notice);
    return true;
  }
  if (actionMatches(action, ["查看版本"])) {
    showToast(scrollAdminConfigVersionRecords() ? "已定位到配置版本记录" : "暂无配置版本记录");
    return true;
  }
  return false;
}

function handleAdminSettingsCategoryAction(button, page) {
  if (page?.type !== "settings" || page?.id === "config") return false;
  if (button?.dataset?.adminSettingsSave !== undefined) {
    const layout = button.closest("[data-settings-page]");
    const category = layout?.querySelector("[data-settings-category-current]")?.textContent?.trim() || activeSettingsCategory(page);
    const savedAt = `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, "0")}`;
    settingsCategoryState.savedAtByPageCategory[settingsCategoryKey(page, category)] = savedAt;
    updateAdminSettingsPanels(page, layout, category);
    showToast(`${category}配置已保存`);
    return true;
  }
  if (button?.dataset?.adminSettingsSwitch) {
    const layout = button.closest("[data-settings-page]");
    const category = layout?.querySelector("[data-settings-category-current]")?.textContent?.trim() || activeSettingsCategory(page);
    const key = settingsCategoryKey(page, category);
    const switches = settingsCategorySwitches(page, category);
    const current = switches.find((item) => item[0] === button.dataset.adminSettingsSwitch);
    const enabled = button.getAttribute("aria-pressed") !== "true";
    if (current) current[1] = enabled;
    settingsCategoryState.switchesByPageCategory[key] = switches;
    delete settingsCategoryState.savedAtByPageCategory[key];
    button.classList.toggle("on", enabled);
    button.setAttribute("aria-pressed", enabled ? "true" : "false");
    const row = button.closest("[data-settings-switch-row]");
    const muted = row?.querySelector(".muted");
    if (muted) muted.textContent = enabled ? "已启用" : "已停用";
    const saveState = layout?.querySelector("[data-settings-save-state]");
    if (saveState) saveState.textContent = settingsCategorySavedText(page, category);
    const kpisPanel = document.querySelector("[data-settings-kpis]");
    if (kpisPanel) kpisPanel.innerHTML = settingsKpis(settingsCategoryDetail(category));
    showToast(`${button.dataset.adminSettingsSwitch}${enabled ? "已启用" : "已停用"}，请保存配置`);
    return true;
  }
  const category = button?.dataset?.adminSettingsCategory || "";
  if (!category) return false;
  const tree = button.closest(".settings-category-tree");
  tree?.querySelectorAll("[data-admin-settings-category]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  settingsCategoryState.activeByPage[page.id] = category;
  updateAdminSettingsPanels(page, button.closest("[data-settings-page]"), category);
  showToast(`${category}配置面板已加载`);
  return true;
}

function updateAdminSettingsPanels(page, layout, category) {
  if (!layout) return;
  const detailPanel = layout.querySelector("[data-settings-detail-panel]");
  if (detailPanel) detailPanel.innerHTML = settingsCategoryDetailPanel(page, category);
  const sidePanel = layout.querySelector("[data-settings-side-panel]");
  if (sidePanel) sidePanel.innerHTML = settingsCategorySidePanel(page, category);
  const kpisPanel = document.querySelector("[data-settings-kpis]");
  if (kpisPanel) kpisPanel.innerHTML = settingsKpis(settingsCategoryDetail(category));
}

function applyAdminLocalAction(actionName, button, page) {
  const action = normalizeActionText(actionName);
  const pageTitle = page?.title || "当前页面";
  const editorActions = ["正文", "14px", "B", "I", "U", "列表", "链接", "图片", "撤销"];
  if (editorActions.includes(actionName) || editorActions.includes(action)) {
    button?.classList?.toggle("active", !button.classList.contains("active"));
    if (action === "图片") return "图片上传配置已进入，可在当前编辑区插入素材";
    if (action === "链接") return "已进入链接配置状态，请选择或填写跳转目标";
    if (action === "撤销") return "已撤销最近一次编辑操作";
    return `编辑器已应用「${actionName}」格式`;
  }
  if (actionMatches(action, ["查看全部"])) {
    const route = page.group === "exception" ? "exceptions" : page.group === "merchant" ? "merchants" : page.group === "order" ? "orders" : page.group === "content" ? "banner" : "dashboard";
    location.hash = pageHref(route);
    return `已进入${pageById(route)?.title || "对应列表"}查看完整数据`;
  }
  if (actionMatches(action, ["配置阈值"])) {
    location.hash = pageHref("health-monitor");
    return "已进入健康阈值配置页";
  }
  if (actionMatches(action, ["保存排序"])) {
    return "排序已保存，用户端展示顺序将按当前配置生效";
  }
  if (actionMatches(action, ["批量上下架"])) {
    location.hash = pageHref("banner");
    return "已进入首页Banner管理页";
  }
  if (actionMatches(action, ["预览首页"])) {
    window.open("/user/", "_blank");
    return "用户端首页预览已启动";
  }
  if (actionMatches(action, ["登出", "退出"])) {
    adminAuth.token = "";
    recordAdminOperation("退出登录", currentAdminPermissionPerson().account);
    saveAdminPermissionSession(ADMIN_DEFAULT_ACCOUNT);
    location.hash = pageHref("login");
    return "已退出后台登录";
  }
  if (actionMatches(action, ["全屏"])) {
    document.documentElement.requestFullscreen?.();
    return "已请求进入全屏模式";
  }
  if (actionMatches(action, ["帮助"])) {
    showToast("帮助文档：请使用左侧菜单浏览各功能模块，如需技术支持请联系管理员");
    return "已进入帮助与使用说明";
  }
  if (actionMatches(action, ["消息通知", "通知"])) {
    location.hash = pageHref("notifications");
    return "已进入消息通知中心";
  }
  if (actionMatches(action, ["查询"])) {
    return `${pageTitle}已按当前筛选条件重新查询`;
  }
  if (actionMatches(action, ["切换", "排序", "状态", "规则", "配置项"])) {
    button?.classList?.toggle("active", true);
    return `${actionName}配置生效，当前页面数据已刷新`;
  }
  if (page.group === "system" || page.type === "settings" || page.id === "config") {
    if (actionMatches(action, ["保存", "发布"])) return "系统配置已保存并发布到运行配置";
    if (actionMatches(action, ["新增"])) return "已新增系统配置草稿，请在配置表单中完善后保存";
    if (actionMatches(action, ["测试", "模拟"])) return "系统配置测试完成，结果已写入操作日志";
    if (actionMatches(action, ["编辑"])) return "系统配置进入编辑状态，可直接修改参数并保存";
  }
  return "";
}

async function adminApi(path, options = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (adminScreenState.token) headers.Authorization = `Bearer ${adminScreenState.token}`;
  const response = await fetch(path, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const rawText = await response.text();
  if (!rawText.trim()) throw new Error(`接口返回空数据：${path}（HTTP ${response.status}）`);
  let payload;
  try {
    payload = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`接口返回非 JSON 数据：${path}（HTTP ${response.status}）`);
  }
  if (!response.ok || !payload.success) throw new Error(payload.error?.message || `接口调用失败：${path}`);
  return payload.data;
}

async function ensureAdminScreenToken() {
  if (adminScreenState.token) return adminScreenState.token;
  if (!adminScreenState.tokenPromise) {
    adminScreenState.tokenPromise = (async () => {
      const session = await adminApi("/api/auth/login", {
        method: "POST",
        headers: { Authorization: "" },
        body: { role: "admin" },
      });
      adminScreenState.token = session.token;
      return adminScreenState.token;
    })();
  }
  try {
    return await adminScreenState.tokenPromise;
  } finally {
    adminScreenState.tokenPromise = null;
  }
}

function pageNeedsScreenData(page) {
  return page.type === "screen" || page.group === "screen";
}

async function ensureScreenData(page) {
  if (!pageNeedsScreenData(page) || adminScreenState.loading || adminScreenState.loaded) return;
  adminScreenState.loading = true;
  adminScreenState.error = "";
  try {
    await ensureAdminScreenToken();
    adminScreenState.data = await adminApi("/api/admin/screens");
    adminScreenState.loaded = true;
  } catch (error) {
    adminScreenState.error = error.message;
    adminScreenState.loaded = false;
  } finally {
    adminScreenState.loading = false;
  }
  if (pageNeedsScreenData(currentPage())) render();
}

function pageNeedsFunctionOverview(page) {
  return page.id === "dashboard";
}

function pageNeedsBannerData(page) {
  return page?.id === "banner";
}

function pageNeedsConfigData(page) {
  return page?.id === "config";
}

function pageNeedsDispatchData(page) {
  return page?.id === "tasks" || page?.group === "dispatch";
}

function pageNeedsGuideData(page) {
  return page?.id === "guides";
}

function pageNeedsUserData(page) {
  return page?.id === "users";
}

function pageNeedsDashboardData(page) {
  return page.id === "dashboard" || ["user", "guide", "order", "dispatch", "exception", "content", "device"].includes(page.group);
}

function pageNeedsMerchantData(page) {
  return page.id === "merchants" || page.group === "merchant";
}

async function ensureAdminDashboard(page) {
  if (!pageNeedsDashboardData(page) || adminDashboardState.loading || adminDashboardState.loaded) return;
  adminDashboardState.loading = true;
  adminDashboardState.error = "";
  try {
    await ensureAdminScreenToken();
    adminDashboardState.data = await adminApi("/api/admin/dashboard");
    adminDashboardState.loaded = true;
  } catch (error) {
    adminDashboardState.error = error.message;
    adminDashboardState.loaded = false;
  } finally {
    adminDashboardState.loading = false;
  }
  if (pageNeedsDashboardData(currentPage())) render();
}

async function ensureAdminConfigData(page, force = false) {
  if (!pageNeedsConfigData(page)) return;
  if (!force && (adminConfigState.loading || adminConfigState.loaded)) return;
  adminConfigState.loading = true;
  adminConfigState.error = "";
  try {
    await ensureAdminScreenToken();
    const data = await adminApi("/api/admin/config");
    adminConfigState.data = data.config || data;
    adminConfigState.loaded = true;
  } catch (error) {
    adminConfigState.error = error.message;
    adminConfigState.loaded = false;
  } finally {
    adminConfigState.loading = false;
  }
  if (pageNeedsConfigData(currentPage())) render();
}

async function ensureAdminDispatchData(page) {
  if (!pageNeedsDispatchData(page) || adminDispatchState.loading || adminDispatchState.loaded) return;
  adminDispatchState.loading = true;
  adminDispatchState.error = "";
  try {
    await ensureAdminScreenToken();
    const [queue, auditLogs, userMessages, guideMessages, merchantMessages] = await Promise.all([
      adminApi("/api/admin/dispatch/pending"),
      adminApi("/api/admin/audit-logs"),
      adminApi("/api/messages?role=user"),
      adminApi("/api/messages?role=guide"),
      adminApi("/api/messages?role=merchant"),
    ]);
    adminDispatchState.queue = queue;
    adminDispatchState.auditLogs = Array.isArray(auditLogs) ? auditLogs : [];
    adminDispatchState.messages = {
      user: Array.isArray(userMessages) ? userMessages : [],
      guide: Array.isArray(guideMessages) ? guideMessages : [],
      merchant: Array.isArray(merchantMessages) ? merchantMessages : [],
    };
    adminAuditState.logs = adminDispatchState.auditLogs.slice();
    adminDispatchState.loaded = true;
  } catch (error) {
    adminDispatchState.error = error.message;
    adminDispatchState.loaded = false;
  } finally {
    adminDispatchState.loading = false;
  }
  if (pageNeedsDispatchData(currentPage())) render();
}

async function ensureAdminUserData(page) {
  if (!pageNeedsUserData(page) || adminUserState.loading || adminUserState.loaded) return;
  adminUserState.loading = true;
  adminUserState.error = "";
  try {
    await ensureAdminScreenToken();
    const data = await adminApi("/api/admin/users");
    adminUserState.users = Array.isArray(data?.users) ? data.users : [];
    adminUserState.elderProfiles = Array.isArray(data?.elderProfiles) ? data.elderProfiles : [];
    adminUserState.familyContacts = Array.isArray(data?.familyContacts) ? data.familyContacts : [];
    if (!adminUserState.selectedUserId && adminUserState.users[0]?.id) {
      adminUserState.selectedUserId = adminUserState.users[0].id;
    }
    adminUserState.loaded = true;
  } catch (error) {
    adminUserState.error = error.message;
    adminUserState.loaded = false;
  } finally {
    adminUserState.loading = false;
  }
  if (pageNeedsUserData(currentPage())) render();
}

async function ensureAdminGuideData(page) {
  if (!pageNeedsGuideData(page) || adminGuideState.loading || adminGuideState.loaded) return;
  adminGuideState.loading = true;
  adminGuideState.error = "";
  try {
    await ensureAdminScreenToken();
    const guides = await adminApi("/api/admin/guides");
    adminGuideState.guides = Array.isArray(guides) ? guides : [];
    if (!adminGuideState.selectedGuideId && adminGuideState.guides[0]?.id) {
      adminGuideState.selectedGuideId = adminGuideState.guides[0].id;
    }
    adminGuideState.loaded = true;
  } catch (error) {
    adminGuideState.error = error.message;
    adminGuideState.loaded = false;
  } finally {
    adminGuideState.loading = false;
  }
  if (pageNeedsGuideData(currentPage())) render();
}

async function ensureAdminMessages(force = false) {
  if (!force && (adminMessageState.loading || adminMessageState.loaded)) return;
  adminMessageState.loading = true;
  adminMessageState.error = "";
  try {
    await ensureAdminScreenToken();
    const messages = await adminApi("/api/messages?role=admin");
    adminMessageState.messages = Array.isArray(messages) ? messages : [];
    adminMessageState.unread = adminMessageState.messages.filter((item) => !item.read).length;
    adminMessageState.loaded = true;
  } catch (error) {
    adminMessageState.error = error.message;
    adminMessageState.loaded = true;
  } finally {
    adminMessageState.loading = false;
  }
  render();
}

async function ensureAdminAuditLogs(force = false) {
  if (!force && (adminAuditState.loading || adminAuditState.loaded)) return;
  adminAuditState.loading = true;
  adminAuditState.error = "";
  try {
    await ensureAdminScreenToken();
    const logs = await adminApi("/api/admin/audit-logs");
    adminAuditState.logs = Array.isArray(logs) ? logs : [];
    adminAuditState.loaded = true;
  } catch (error) {
    adminAuditState.error = error.message;
    adminAuditState.loaded = true;
  } finally {
    adminAuditState.loading = false;
  }
  if (["system", "device", "exception", "order"].includes(currentPage().group) || ["device-detail", "device-exception", "order-detail"].includes(currentPage().id)) render();
}

async function ensureAdminMerchantData(page) {
  if (!pageNeedsMerchantData(page) || adminMerchantState.loading || adminMerchantState.loaded) return;
  adminMerchantState.loading = true;
  adminMerchantState.error = "";
  try {
    await ensureAdminScreenToken();
    const [merchants, services] = await Promise.all([
      adminApi("/api/admin/merchants"),
      adminApi("/api/admin/services"),
    ]);
    adminMerchantState.merchants = merchants;
    adminMerchantState.services = services;
    adminMerchantState.loaded = true;
  } catch (error) {
    adminMerchantState.error = error.message;
    adminMerchantState.loaded = false;
  } finally {
    adminMerchantState.loading = false;
  }
  if (pageNeedsMerchantData(currentPage())) render();
}

function pageNeedsAdminReferenceContent(page) {
  return page?.id === "policy" || page?.id === "knowledge";
}

async function ensureAdminReferenceContentData(page) {
  if (!pageNeedsAdminReferenceContent(page)) return;
  const isPolicyPage = page.id === "policy";
  if (isPolicyPage && (adminReferenceContentState.policiesLoading || adminReferenceContentState.policiesLoaded)) return;
  if (!isPolicyPage && (adminReferenceContentState.knowledgeLoading || adminReferenceContentState.knowledgeLoaded)) return;
  if (isPolicyPage) adminReferenceContentState.policiesLoading = true;
  else adminReferenceContentState.knowledgeLoading = true;
  adminReferenceContentState.error = "";
  try {
    await ensureAdminScreenToken();
    if (isPolicyPage) {
      const data = await adminApi("/api/admin/policies");
      adminReferenceContentState.policies = Array.isArray(data?.items) ? data.items : [];
      adminReferenceContentState.policiesLoaded = true;
    } else {
      const data = await adminApi("/api/admin/knowledge");
      adminReferenceContentState.knowledge = Array.isArray(data?.items) ? data.items : [];
      adminReferenceContentState.knowledgeLoaded = true;
    }
  } catch (error) {
    adminReferenceContentState.error = error.message;
    if (isPolicyPage) adminReferenceContentState.policiesLoaded = false;
    else adminReferenceContentState.knowledgeLoaded = false;
  } finally {
    if (isPolicyPage) adminReferenceContentState.policiesLoading = false;
    else adminReferenceContentState.knowledgeLoading = false;
  }
  if (pageNeedsAdminReferenceContent(currentPage())) render();
}

async function ensureAdminFunctionOverview(page) {
  if (!pageNeedsFunctionOverview(page) || adminFunctionOverviewState.loading || adminFunctionOverviewState.loaded) return;
  adminFunctionOverviewState.loading = true;
  adminFunctionOverviewState.error = "";
  try {
    await ensureAdminScreenToken();
    adminFunctionOverviewState.data = await adminApi("/api/admin/functions/overview");
    adminFunctionOverviewState.loaded = true;
  } catch (error) {
    adminFunctionOverviewState.error = error.message;
    adminFunctionOverviewState.loaded = false;
  } finally {
    adminFunctionOverviewState.loading = false;
  }
  if (pageNeedsFunctionOverview(currentPage())) render();
}

function showToast(text) {
  clearAdminToastOperationPanels();
  const message = String(text || "").trim();
  if (!message) return;
  window.clearTimeout(toastTimer);
}

function actionText(action) {
  const map = {
    "新增": "进入新增页面",
    "导入": "导入任务已创建",
    "导出": "导出任务已创建",
    "保存": "配置已保存",
    "发送": "消息已发送并记录触达结果",
    "审核通过": "审核通过",
    "驳回": "已驳回",
  };
  const text = String(action || "处理完成");
  return map[text] || text;
}

window.addEventListener("hashchange", render);
render();
