const screens = [
  ["01", "消息中心", "purple"],
  ["02", "商户资料", "green"],
  ["03", "认证资质详情", "green"],
  ["04", "我的钱包提现", "orange"],
  ["05", "结算详情", "orange"],
  ["06", "申请开票", "orange"],
  ["07", "账户安全", "purple"],
  ["08", "设置", "purple"],
  ["09", "客服中心", "purple"],
  ["10", "异常上报", "orange"],
  ["11", "服务详情预览", "green"],
  ["12", "售后处理详情", "orange"],
  ["13", "发票信息: 发票管理", "orange"],
  ["14", "订单详情", "orange"],
  ["15", "首页我的", "blue"],
  ["16", "首页数据", "blue"],
  ["17", "售后与评价", "orange"],
  ["18", "服务执行:完成上报", "orange"],
  ["19", "首页服务", "blue"],
  ["20", "首页订单", "blue"],
  ["21", "商户入驻:资质认证", "green"],
  ["22", "新增服务", "green"],
  ["23", "预约详情丿报价确认", "orange"],
  ["24", "首页工作台", "blue"],
  ["25", "消息详情", "purple"],
  ["26", "商户入驻:基础信息", "green"],
  ["27", "商户入驻:资质上传", "green"],
  ["28", "商户入驻:服务类型", "green"],
  ["29", "商户入驻:提交审核", "green"],
  ["30", "编辑服务", "green"],
  ["31", "服务分类选择", "green"],
  ["32", "预约时间设置", "green"],
  ["33", "服务范围选择", "green"],
  ["34", "预约确认", "orange"],
  ["35", "预约拒绝", "orange"],
  ["36", "订单改期", "orange"],
  ["37", "报价方案编辑", "orange"],
  ["38", "服务人员安排", "orange"],
  ["39", "完成上报成功", "orange"],
  ["40", "售后处理记录", "orange"],
  ["41", "评价回复", "orange"],
  ["42", "结算记录", "orange"],
  ["43", "交易明细", "orange"],
  ["44", "提现申请", "orange"],
  ["45", "绑定银行卡", "orange"],
  ["46", "发票抬头编辑", "orange"],
  ["47", "选择开票订单", "orange"],
  ["48", "发票详情", "orange"],
  ["49", "提交问题工单", "purple"],
  ["50", "工单记录", "purple"],
  ["51", "在线客服", "purple"],
  ["52", "常见问题详情", "purple"],
  ["53", "商户资料编辑", "green"],
  ["54", "营业时间设置", "green"],
  ["55", "服务城市选择", "green"],
  ["56", "门店照片管理", "green"],
  ["57", "认证资质更新", "green"],
  ["58", "资质更新记录", "green"],
  ["59", "换绑手机号", "purple"],
  ["60", "修改登录密码", "purple"],
  ["61", "设置支付密码", "purple"],
  ["62", "设备管理", "purple"],
  ["63", "隐私设置", "purple"],
  ["64", "权限设置", "purple"],
  ["65", "语言与字体", "purple"],
  ["66", "平台规则", "purple"],
  ["67", "商户登录", "blue"],
  ["68", "忘记密码", "purple"],
  ["69", "商户入驻:审核中", "green"],
  ["70", "商户入驻:审核驳回", "green"],
].map(([id, title, group]) => ({ id, title, group }));

const tabTargets = {
  home: "24",
  service: "19",
  order: "20",
  data: "16",
  mine: "15",
};

const merchantRouteAliases = new Map(Object.entries({
  "/pages/merchant/messages": "01",
  "/pages/merchant/profile": "02",
  "/pages/merchant/qualification": "03",
  "/pages/merchant/wallet-withdraw": "04",
  "/pages/merchant/settlement-detail": "05",
  "/pages/merchant/invoice-apply": "06",
  "/pages/merchant/security": "07",
  "/pages/merchant/settings": "08",
  "/pages/merchant/support": "09",
  "/pages/merchant/exception": "10",
  "/pages/merchant/service-preview": "11",
  "/pages/merchant/aftersales-detail": "12",
  "/pages/merchant/invoice": "13",
  "/pages/merchant/order-detail": "14",
  "/pages/merchant/profile-home": "15",
  "/pages/merchant/data-home": "16",
  "/pages/merchant/reviews": "17",
  "/pages/merchant/service-complete": "18",
  "/pages/merchant/services": "19",
  "/pages/merchant/orders": "20",
  "/pages/merchant/onboarding-qualification": "21",
  "/pages/merchant/service-create": "22",
  "/pages/merchant/quote": "23",
  "/pages/merchant/workbench": "24",
  "/pages/merchant/message-detail": "25",
  "/pages/merchant/onboarding-basic": "26",
  "/pages/merchant/onboarding-license": "27",
  "/pages/merchant/onboarding-service-types": "28",
  "/pages/merchant/onboarding-submit": "29",
  "/pages/merchant/service-edit": "30",
  "/pages/merchant/service-category": "31",
  "/pages/merchant/booking-time": "32",
  "/pages/merchant/service-area": "33",
  "/pages/merchant/booking-confirm": "34",
  "/pages/merchant/booking-reject": "35",
  "/pages/merchant/order-reschedule": "36",
  "/pages/merchant/quote-edit": "37",
  "/pages/merchant/staff-assign": "38",
  "/pages/merchant/complete-success": "39",
  "/pages/merchant/aftersales-records": "40",
  "/pages/merchant/review-reply": "41",
  "/pages/merchant/settlements": "42",
  "/pages/merchant/transactions": "43",
  "/pages/merchant/withdraw": "44",
  "/pages/merchant/bank-card": "45",
  "/pages/merchant/invoice-title": "46",
  "/pages/merchant/invoice-orders": "47",
  "/pages/merchant/invoice-detail": "48",
  "/pages/merchant/ticket-create": "49",
  "/pages/merchant/tickets": "50",
  "/pages/merchant/online-support": "51",
  "/pages/merchant/faq-detail": "52",
  "/pages/merchant/merchant-edit": "53",
  "/pages/merchant/business-hours": "54",
  "/pages/merchant/service-city": "55",
  "/pages/merchant/store-photos": "56",
  "/pages/merchant/qualification-update": "57",
  "/pages/merchant/qualification-history": "58",
  "/pages/merchant/phone-change": "59",
  "/pages/merchant/password-change": "60",
  "/pages/merchant/payment-password": "61",
  "/pages/merchant/devices": "62",
  "/pages/merchant/privacy": "63",
  "/pages/merchant/permissions": "64",
  "/pages/merchant/display": "65",
  "/pages/merchant/rules": "66",
  "/pages/merchant/login": "67",
  "/pages/merchant/forgot-password": "68",
  "/pages/merchant/onboarding-review": "69",
  "/pages/merchant/onboarding-rejected": "70",
}));

const assets = {
  logo: "./assets/brand-logo.png",
  serviceCare: "./assets/service-care.png",
  serviceDoctor: "./assets/service-doctor.png",
  serviceRehab: "./assets/service-rehab.png",
  serviceTravel: "./assets/service-travel.png",
  serviceBeforeProof: "./assets/service-before-proof.png",
  serviceDuringProof: "./assets/service-during-proof.png",
  avatarLi: "./assets/avatar-li.png",
  customerLiRef: "./assets/customer-li-ref.png",
  avatarZhang: "./assets/avatar-zhang.png",
  avatarWang: "./assets/avatar-wang.png",
  avatarLiu: "./assets/avatar-liu.png",
  supportAgent: "./assets/support-agent.png",
  nurseWang: "./assets/nurse-wang.png",
  nurseZhang: "./assets/nurse-zhang.png",
  certId: "./assets/cert-id.png",
  certLicense: "./assets/cert-license.png",
  certDoor: "./assets/cert-door.png",
  storeRoom: "./assets/store-room.png",
  storeFront: "./assets/store-front.png",
  storeWall: "./assets/store-wall.png",
  storeTeam: "./assets/store-team.png",
  storeRehab: "./assets/store-rehab.png",
  exceptionDoor: "./assets/ref/exception-door-photo.png",
  exceptionEntry: "./assets/ref/exception-entry-photo.png",
  reviewPending: "./assets/ref/review-pending-illustration.png",
  reviewRejected: "./assets/ref/review-rejected-illustration.png",
  quoteCustomerLi: "./assets/ref/quote-customer-li.png",
  quoteMap: "./assets/ref/quote-map.png",
  registerLicense: "./assets/ref/register-license.png",
  registerReady: "./assets/ref/register-ready-illustration.png",
  servicePreviewMain: "./assets/ref/service-preview-main-ref.png",
  servicePreviewLife: "./assets/ref/service-preview-life-ref.png",
  servicePreviewVitals: "./assets/ref/service-preview-vitals-ref.png",
  servicePreviewMeds: "./assets/ref/service-preview-meds-ref.png",
};

const defaultMerchantStorePhotos = [
  { id: "store-photo-front", title: "门店前台", src: assets.storeFront, isCover: true },
  { id: "store-photo-room", title: "护理室", src: assets.storeRoom, isCover: false },
  { id: "store-photo-wall", title: "营业执照墙", src: assets.storeWall, isCover: false },
  { id: "store-photo-team", title: "服务人员合照", src: assets.storeTeam, isCover: false },
  { id: "store-photo-rehab", title: "康复设备", src: assets.storeRehab, isCover: false },
];

const serviceItems = [];

const orderItems = [];

const colorsByGroup = {
  blue: "blue",
  green: "green",
  orange: "orange",
  purple: "purple",
};

const merchantReceptionServices = [];

let activeId = normalizeInitialMerchantScreenId();
const FALLBACK_BATTERY_STATUS = { level: 1, charging: false, fallback: true };
let batteryStatus = FALLBACK_BATTERY_STATUS;
let statusRuntimeReady = false;
let merchantOnlineAccepting = true;
let toastTimer = null;
let navigationStack = [];
let merchantRefreshSeq = 0;
const merchantMessageState = {
  unread: 0,
  selectedId: "",
};
const MERCHANT_ORDER_STATE_KEY = "yunlv-merchant-order-state";
const merchantServiceFilters = ["全部", "已上架", "待审核", "已下架"];
const merchantServiceState = {
  status: "全部",
  query: "",
  filterOpen: false,
  selectedId: "",
};
const merchantOrderFilters = ["全部", "待确认", "服务中", "已完成"];
const merchantOrderListState = {
  status: "全部",
  filterOpen: false,
};
const merchantRescheduleState = {
  orderId: "",
  date: "",
  slot: "",
  reason: "服务人员排班冲突",
  note: "",
};
const merchantWorkbenchState = {
  category: "全部",
  selectedOrderId: "",
  profile: null,
  stats: null,
  statsPayload: null,
  rawOrders: [],
  rawServices: [],
  rawReviews: [],
};
const merchantProfileEditState = {
  sourceKey: "",
  dirty: false,
  saving: false,
  fields: {},
};
const merchantDataDashboardState = {
  range: "month",
};
const merchantFunctionOverviewState = {
  token: "",
  loading: false,
  loaded: false,
  data: null,
  error: "",
};
const merchantServiceCategoryState = {
  loading: false,
  loaded: false,
  data: null,
  error: "",
  query: "",
  selectedId: "care-nursing",
  selection: null,
  saving: false,
};
const merchantRealPageState = {
  qualification: { loading: false, loaded: false, data: null, error: "", previewFileId: "" },
  security: { loading: false, loaded: false, data: null, error: "" },
  settings: { loading: false, loaded: false, data: null, error: "" },
  privacy: { loading: false, loaded: false, data: null, error: "", detailKey: "" },
  permissions: { loading: false, loaded: false, data: null, error: "", tipVisible: true },
  support: { loading: false, loaded: false, data: null, error: "" },
  invoices: { loading: false, loaded: false, data: null, error: "", filter: "全部" },
  invoiceApply: { loading: false, loaded: false, data: null, error: "", selectedOrderIds: [], delivery: "", invoiceType: "", note: "", submitting: false },
};
const merchantSupportChatState = {
  messages: [
    { role: "agent", text: "您好，云旅无忧商户客服为您服务，请问需要咨询什么问题？" },
    { role: "merchant", text: "我想咨询提现到账时间。" },
    { role: "agent", text: "提现申请提交后通常1-3个工作日到账，您可以在交易明细中查看处理进度。" },
  ],
};
const merchantTicketState = {
  type: "订单问题",
  urgency: "普通",
  replyChannels: ["站内消息", "短信"],
};

function loadMerchantOrderState() {
  try {
    const stored = JSON.parse(localStorage.getItem(MERCHANT_ORDER_STATE_KEY) || "{}");
    orderItems.forEach((item) => {
      const next = stored[item.id];
      if (!next) return;
      Object.assign(item, {
        status: next.status || item.status,
        state: next.state || item.state,
        action: next.action || item.action,
        actionTarget: next.actionTarget || item.actionTarget,
        detailTarget: next.detailTarget || item.detailTarget,
        amount: next.amount || item.amount,
      });
    });
  } catch (_) {
    localStorage.removeItem(MERCHANT_ORDER_STATE_KEY);
  }
}

function saveMerchantOrderState() {
  const snapshot = Object.fromEntries(orderItems.map((item) => [
    item.id,
    {
      status: item.status,
      state: item.state,
      action: item.action,
      actionTarget: item.actionTarget,
      detailTarget: item.detailTarget,
      amount: item.amount,
    },
  ]));
  localStorage.setItem(MERCHANT_ORDER_STATE_KEY, JSON.stringify(snapshot));
}

function updateMerchantOrder(id, patch) {
  const order = orderItems.find((item) => item.id === id);
  if (!order) return null;
  Object.assign(order, patch);
  saveMerchantOrderState();
  return order;
}

async function markMerchantMessagesRead(actionButton, actionName) {
  await ensureMerchantToken();
  if (/标记已读/.test(actionName)) {
    const message = currentMerchantMessage();
    if (!message) return;
    await merchantApiRequest(`/api/messages/${encodeURIComponent(message.id)}/read`, { method: "POST", body: { role: "merchant" } });
  } else {
    await merchantApiRequest("/api/messages/read-all", { method: "POST", body: { role: "merchant" } });
  }
  const messages = await merchantApiRequest("/api/messages?role=merchant");
  applyMerchantMessages(messages);
  merchantApiHydrateState.signature = "";
  merchantApiHydrateState.lastAt = 0;
  renderCurrent();
}

loadMerchantOrderState();

const $ = (selector) => document.querySelector(selector);
const screenListEl = $("#screenList");
const phoneEl = $("#phone");
const searchEl = $("#screenSearch");

function icon(name, size = 18) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

const MERCHANT_ACTIVE_SERVICE_CONTACT = {
  name: "李奶奶",
  phone: "13888888888",
  address: "昆明市盘龙区穿金路88号",
  lng: "102.742",
  lat: "25.056",
};

function merchantTelHref(phone) {
  return `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;
}

function merchantNavigationHref(contact = MERCHANT_ACTIVE_SERVICE_CONTACT) {
  const address = encodeURIComponent(contact.address || "客户地址");
  const to = contact.lng && contact.lat ? `${contact.lng},${contact.lat},${address}` : address;
  return `https://uri.amap.com/navigation?to=${to}&mode=car&policy=1&src=yunlv-wuyou-merchant`;
}

function merchantServiceNoteValue() {
  return localStorage.getItem("yunlv-merchant-service-note") || "";
}

const defaultRemoteApiBase = "https://yunlv-wuyou-mvp.onrender.com";

function apiBase() {
  const explicit = window.YUNLV_API_BASE || window.localStorage?.getItem?.("YUNLV_API_BASE") || "";
  if (explicit) return explicit.replace(/\/$/, "");
  return window.location.hostname.endsWith("github.io") ? defaultRemoteApiBase : "";
}

function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const base = apiBase();
  return base ? `${base}${path.startsWith("/") ? path : `/${path}`}` : path;
}

async function merchantApiRequest(path, options = {}) {
  const headers = { Accept: "application/json", "Content-Type": "application/json", ...(options.headers || {}) };
  if (merchantFunctionOverviewState.token && !headers.Authorization && !options.public) {
    headers.Authorization = `Bearer ${merchantFunctionOverviewState.token}`;
  }
  const response = await fetch(apiUrl(path), {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || "服务请求失败，请稍后重试");
  }
  return payload.data;
}

async function ensureMerchantToken() {
  if (merchantFunctionOverviewState.token) return merchantFunctionOverviewState.token;
  const session = await merchantApiRequest("/api/auth/login", {
    method: "POST",
    body: { role: "merchant" },
    public: true,
  });
  merchantFunctionOverviewState.token = session.token;
  return session.token;
}

async function loadMerchantFunctionOverview(options = {}) {
  if (merchantFunctionOverviewState.loading) return;
  if (merchantFunctionOverviewState.loaded && !options.force) return;
  merchantFunctionOverviewState.loading = true;
  merchantFunctionOverviewState.error = "";
  if (activeId === "24") renderCurrent();
  try {
    await ensureMerchantToken();
    merchantFunctionOverviewState.data = await merchantApiRequest("/api/merchant/functions/overview?merchantId=merchant-001");
    merchantFunctionOverviewState.loaded = true;
  } catch (error) {
    merchantFunctionOverviewState.error = error.message || "商户功能总览加载失败";
  } finally {
    merchantFunctionOverviewState.loading = false;
    if (activeId === "24") renderCurrent();
  }
}

function ensureMerchantFunctionOverview(screenId) {
  if (screenId !== "24") return;
  if (merchantFunctionOverviewState.loaded || merchantFunctionOverviewState.loading || merchantFunctionOverviewState.error) return;
  loadMerchantFunctionOverview();
}

async function loadMerchantServiceCategories(options = {}) {
  if (merchantServiceCategoryState.loading) return;
  if (merchantServiceCategoryState.loaded && !options.force) return;
  merchantServiceCategoryState.loading = true;
  merchantServiceCategoryState.error = "";
  if (["22", "30", "31"].includes(activeId)) renderCurrent();
  try {
    await ensureMerchantToken();
    merchantServiceCategoryState.data = await merchantApiRequest("/api/merchant/service-categories?merchantId=merchant-001");
    merchantServiceCategoryState.selection = merchantServiceCategoryState.data?.selection || null;
    merchantServiceCategoryState.loaded = true;
    const categories = merchantServiceCategoryState.data?.categories || [];
    const preferredId = merchantServiceCategoryState.selection?.categoryId || merchantServiceCategoryState.selectedId;
    if (categories.some((item) => item.id === preferredId)) {
      merchantServiceCategoryState.selectedId = preferredId;
    } else {
      merchantServiceCategoryState.selectedId = categories[0]?.id || "";
    }
  } catch (error) {
    merchantServiceCategoryState.error = error.message || "商户服务分类加载失败";
  } finally {
    merchantServiceCategoryState.loading = false;
    if (["22", "30", "31"].includes(activeId)) renderCurrent();
  }
}

function ensureMerchantServiceCategories(screenId) {
  if (!["22", "30", "31"].includes(screenId)) return;
  if (merchantServiceCategoryState.loaded || merchantServiceCategoryState.loading || merchantServiceCategoryState.error) return;
  loadMerchantServiceCategories();
}

const merchantRealPageConfigs = {
  "03": { key: "qualification", path: () => "/api/merchant/qualification?merchantId=merchant-001" },
  "07": { key: "security", path: () => "/api/merchant/security?merchantId=merchant-001" },
  "08": { key: "settings", path: () => "/api/merchant/settings?merchantId=merchant-001" },
  "63": { key: "privacy", path: () => "/api/merchant/privacy?merchantId=merchant-001" },
  "64": { key: "permissions", path: () => "/api/merchant/permissions?merchantId=merchant-001" },
  "09": { key: "support", path: () => "/api/merchant/support?merchantId=merchant-001" },
  "06": { key: "invoiceApply", path: () => "/api/merchant/invoices/apply?merchantId=merchant-001" },
  "13": { key: "invoices", path: (state) => `/api/merchant/invoices?merchantId=merchant-001&status=${encodeURIComponent(state.filter || "全部")}` },
};

async function loadMerchantRealPage(screenId, options = {}) {
  const config = merchantRealPageConfigs[screenId];
  if (!config) return;
  const state = merchantRealPageState[config.key];
  if (!state || state.loading) return;
  if (state.loaded && !options.force) return;
  state.loading = true;
  state.error = "";
  if (activeId === screenId) renderCurrent();
  try {
    await ensureMerchantToken();
    state.data = await merchantApiRequest(config.path(state));
    if (config.key === "invoiceApply") {
      const selected = state.data?.selectedOrderIds || [];
      if (!state.selectedOrderIds.length) state.selectedOrderIds = selected;
      state.delivery = state.delivery || state.data?.preference?.delivery || "电子发票（邮箱）";
      state.invoiceType = state.invoiceType || state.data?.preference?.invoiceType || "增值税专用发票";
      state.note = state.note || state.data?.note || "";
    }
    state.loaded = true;
  } catch (error) {
    state.error = error.message || "数据加载失败，请稍后重试";
  } finally {
    state.loading = false;
    if (activeId === screenId) renderCurrent();
  }
}

function ensureMerchantRealPageData(screenId) {
  const config = merchantRealPageConfigs[screenId];
  if (!config) return;
  const state = merchantRealPageState[config.key];
  if (!state || state.loaded || state.loading || state.error) return;
  loadMerchantRealPage(screenId);
}

function merchantFriendlyText(value = "") {
  return String(value || "")
    .replace(/\/api\/[^\s，。:：]*/g, "服务数据")
    .replace(/API/gi, "平台")
    .replace(/接口/g, "服务")
    .replace(/真实/g, "")
    .replace(/读取/g, "加载")
    .trim();
}

function merchantApiPanelLabel(label = "平台数据") {
  const text = merchantFriendlyText(label).replace(/服务$/g, "").trim();
  return text || "平台数据";
}

function merchantApiPanel(state, label = "平台数据") {
  const friendlyLabel = merchantApiPanelLabel(label);
  if (state?.error) return `<p class="action-status">${escapeHtml(friendlyLabel)}加载失败：${escapeHtml(merchantFriendlyText(state.error) || "请稍后重试")}</p>`;
  if (state?.loading && !state?.data) return `<p class="action-status">正在加载${escapeHtml(friendlyLabel)}...</p>`;
  return "";
}

function currentMerchantServiceCategoryDraft() {
  return merchantServiceCategoryState.selection || merchantServiceCategoryState.data?.selection || null;
}

function selectedMerchantServiceCategory() {
  const categories = merchantServiceCategoryState.data?.categories || [];
  const draft = currentMerchantServiceCategoryDraft();
  const selectedId = merchantServiceCategoryState.selectedId || draft?.categoryId || "";
  return categories.find((item) => item.id === selectedId)
    || categories.find((item) => item.category === draft?.category)
    || categories[0]
    || null;
}

function isMerchantScreenId(id) {
  return screens.some((screen) => screen.id === id);
}

function normalizeMerchantRouteHash(value) {
  let route = String(value || "").trim();
  if (!route) return "";
  route = route.replace(/^#/, "");
  route = route.replace(/^!/, "");
  if (!route) return "";
  route = route.split("?")[0].split("#")[0].replace(/\/+$/, "");
  if (!route) return "";
  if (!route.startsWith("/")) route = `/${route}`;
  return route;
}

function normalizeMerchantScreenId(value) {
  const route = normalizeMerchantRouteHash(value);
  const alias = merchantRouteAliases.get(route);
  if (alias && isMerchantScreenId(alias)) return alias;
  const raw = String(value || "").trim();
  const match = raw.match(/(?:^|#)(\d{2})$/) || route.match(/^\/(\d{2})$/);
  return match && isMerchantScreenId(match[1]) ? match[1] : "";
}

function normalizeInitialMerchantScreenId() {
  const id = normalizeMerchantScreenId(location.hash) || "24";
  if (location.hash && location.hash !== `#${id}`) {
    history.replaceState(null, "", `#${id}`);
  }
  return id;
}

function routeScreenId(route, fallback = "24") {
  return normalizeMerchantScreenId(route) || fallback;
}

function metricValueText(value) {
  if (Array.isArray(value)) return `${value.length} 项`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (!entries.length) return "0";
    return entries.slice(0, 2).map(([name, count]) => `${name}${count}`).join(" / ");
  }
  if (typeof value === "boolean") return value ? "是" : "否";
  return String(value ?? "");
}

function compactMetricText(metrics = {}) {
  const preferred = [
    "auditStatus",
    "userVisibleServices",
    "activeOrders",
    "quotedOrders",
    "activeTasks",
    "reviews",
    "revenue",
    "pendingSettlement",
  ];
  const labels = {
    auditStatus: "审核",
    userVisibleServices: "已上架",
    activeOrders: "待处理",
    quotedOrders: "已报价",
    activeTasks: "执行中",
    reviews: "评价",
    revenue: "成交额",
    pendingSettlement: "待结算",
  };
  return preferred
    .filter((key) => Object.prototype.hasOwnProperty.call(metrics, key))
    .slice(0, 2)
    .map((key) => `${labels[key]} ${metricValueText(metrics[key])}`)
    .join(" · ");
}

function statusBar() {
  return `
    <div class="status-bar" aria-label="系统状态栏预览">
      <span class="status-time" data-status-time>--:--</span>
      <span class="status-icons">
        <span class="signal" data-signal aria-label="网络状态"><i></i><i></i><i></i><i></i></span>
        <span class="wifi is-hidden" data-wifi aria-label="Wi-Fi 状态"><i></i><i></i><i></i></span>
        <span class="cellular-label is-hidden" data-cellular-type aria-label="蜂窝网络类型">5G</span>
        <span class="battery" data-battery aria-label="电池状态"></span>
      </span>
    </div>
  `;
}

function statusConnection() {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

function normalizedConnectionType(connection) {
  return String(connection?.type || "").toLowerCase();
}

function isCellularConnectionType(connectionType) {
  return ["cellular", "2g", "3g", "4g", "5g"].includes(connectionType);
}

function isWifiConnection(online, connection) {
  const connectionType = normalizedConnectionType(connection);
  if (!online || connectionType === "none") return false;
  if (["wifi", "wlan"].includes(connectionType)) return true;
  if (isCellularConnectionType(connectionType)) return false;
  return true;
}

function cellularNetworkLabel(connection) {
  const connectionType = normalizedConnectionType(connection);
  const effectiveType = String(connection?.effectiveType || "").toLowerCase();
  if (connectionType.includes("5g") || effectiveType.includes("5g")) return "5G";
  if (connectionType.includes("4g") || effectiveType.includes("4g")) {
    const downlink = Number(connection?.downlink || 0);
    const rtt = Number(connection?.rtt || 0);
    return downlink >= 50 || (downlink >= 25 && rtt > 0 && rtt <= 50) ? "5G" : "4G";
  }
  return "4G";
}

function formatStatusTime() {
  const date = new Date();
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function syncStatusBar() {
  document.querySelectorAll("[data-status-time]").forEach((node) => {
    node.textContent = formatStatusTime();
  });
  const connection = statusConnection();
  const online = navigator.onLine !== false;
  const effectiveType = connection?.effectiveType || "";
  const bars = !online ? 0 : effectiveType.includes("2g") ? 1 : effectiveType === "3g" ? 2 : 4;
  const isWifi = isWifiConnection(online, connection);
  const cellularLabel = cellularNetworkLabel(connection);
  document.querySelectorAll("[data-signal]").forEach((signal) => {
    signal.className = `signal bars-${bars} ${online ? "" : "is-offline"}`.trim();
    signal.setAttribute("aria-label", online ? `网络在线${effectiveType ? `，${effectiveType.toUpperCase()}` : ""}` : "网络离线");
  });
  document.querySelectorAll("[data-wifi]").forEach((wifi) => {
    wifi.classList.toggle("is-hidden", !isWifi);
    wifi.setAttribute("aria-label", isWifi ? "Wi-Fi 已连接" : "当前为蜂窝网络或离线");
  });
  document.querySelectorAll("[data-cellular-type]").forEach((node) => {
    node.textContent = cellularLabel;
    node.classList.toggle("is-hidden", isWifi || !online);
    node.setAttribute("aria-label", `蜂窝网络 ${cellularLabel}`);
  });
  document.querySelectorAll("[data-battery]").forEach((battery) => {
    const source = batteryStatus && Number.isFinite(batteryStatus.level) ? batteryStatus : FALLBACK_BATTERY_STATUS;
    const level = Math.max(0, Math.min(1, source.level));
    battery.style.setProperty("--battery-level", level.toFixed(2));
    battery.classList.remove("is-hidden", "is-low", "is-charging");
    battery.classList.toggle("is-low", level <= 0.2 && !source.charging);
    battery.classList.toggle("is-charging", !!source.charging);
    battery.setAttribute(
      "aria-label",
      source.fallback ? "电池图标（浏览器未提供真实电量）" : `电量 ${Math.round(level * 100)}%${source.charging ? "，充电中" : ""}`
    );
  });
}

function initStatusRuntime() {
  if (statusRuntimeReady) return;
  statusRuntimeReady = true;
  window.setInterval(syncStatusBar, 30 * 1000);
  window.addEventListener("online", syncStatusBar);
  window.addEventListener("offline", syncStatusBar);
  const connection = statusConnection();
  if (connection?.addEventListener) connection.addEventListener("change", syncStatusBar);
  if (navigator.getBattery) {
    navigator.getBattery().then((battery) => {
      batteryStatus = battery;
      ["chargingchange", "levelchange"].forEach((eventName) => battery.addEventListener(eventName, syncStatusBar));
      syncStatusBar();
    }).catch(() => {
      batteryStatus = FALLBACK_BATTERY_STATUS;
      syncStatusBar();
    });
  } else {
    batteryStatus = FALLBACK_BATTERY_STATUS;
    syncStatusBar();
  }
}

function appHeader({ title, right = "", rightGo = "", rightAction = "", rightNoMirror = false, rightStatic = false, back = true, large = false, compact = false, message = false }) {
  const unreadCount = Math.max(0, merchantMessageState.unread || 0);
  const badgeText = unreadCount > 99 ? "99+" : unreadCount;
  const finalRight = message && !right
    ? `<span class="merchant-message-icon">${icon("bell", 22)}${unreadCount > 0 ? `<span class="badge-dot">${badgeText}</span>` : ""}</span><span class="merchant-message-label">消息</span>`
    : right;
  const finalRightGo = rightGo || (message && !right ? "01" : "");
  const finalRightText = String(finalRight || "").replace(/<[^>]*>/g, "").trim();
  const finalRightAction = rightAction || (!finalRightGo && /全部已读|标记已读/.test(finalRightText) ? finalRightText : "");
  const rightClass = message && !right ? "header-action merchant-message-button" : "header-action";
  const rightNode = (() => {
    if (!finalRightText && !finalRightGo) {
      return `<span class="${rightClass} header-placeholder" aria-hidden="true"></span>`;
    }
    if (rightStatic) {
      return `<span class="${rightClass} header-static" aria-label="${escapeHtml(finalRightText)}">${finalRight}</span>`;
    }
    const actionAttr = !finalRightGo && finalRightText ? `data-action="${escapeHtml(finalRightAction || finalRightText)}"` : "";
    return `<button class="${rightClass}" type="button" ${finalRightGo ? `data-go="${finalRightGo}"` : ""} ${actionAttr} ${rightNoMirror ? `data-no-admin-mirror="true"` : ""} ${message && !right ? `aria-label="消息中心，${unreadCount}条未读"` : ""}>${finalRight}</button>`;
  })();
  if (large) {
    return `
      <header class="app-header ${compact ? "compact" : ""}">
        <div class="large-title">${title}</div>
        <button class="icon-button" type="button">${icon("search", 22)}</button>
        <button class="header-action" type="button">${right || `${icon("sliders-horizontal", 20)}筛选`}</button>
      </header>
    `;
  }

  return `
    <header class="app-header ${compact ? "compact" : ""}">
      ${back ? `<button class="back-button" type="button" data-back="true" data-action="返回" aria-label="返回">${icon("chevron-left", 26)}</button>` : '<span class="back-button back-placeholder" aria-hidden="true"></span>'}
      <div class="title">${title}</div>
      ${rightNode}
    </header>
  `;
}

function tabbar(active = "home") {
  const tabs = [
    ["home", "首页", "home"],
    ["service", "服务", "briefcase-business"],
    ["order", "订单", "clipboard-list"],
    ["data", "数据", "chart-pie"],
    ["mine", "我的", "user-round"],
  ];
  return `
    <nav class="tabbar" aria-label="底部导航">
      ${tabs
        .map(
          ([key, label, iconName]) => `
          <button type="button" class="${active === key ? "is-active" : ""}" data-go="${tabTargets[key]}">
            ${icon(iconName, 24)}
            <span>${label}</span>
          </button>
        `,
        )
        .join("")}
    </nav>
  `;
}

function frame({ title, content, tab = "", right = "", rightGo = "", rightAction = "", rightNoMirror = false, rightStatic = false, back = true, large = false, compact = false, message = false, screenClass = "", assurance = false }) {
  const showContinuity = false;
  return `
    <div class="phone-screen ${screenClass}">
      ${statusBar()}
      ${appHeader({ title, right, rightGo, rightAction, rightNoMirror, rightStatic, back, large, compact, message })}
      <main class="phone-content ${tab ? "with-tabbar" : ""}">${content}${showContinuity ? merchantAssurance(title) : ""}${merchantPageInventory()}</main>
      ${tab ? tabbar(tab) : ""}
    </div>
  `;
}

function merchantPageInventory() {
  return `<div class="sr-only" aria-label="商户端页面清单">${screens.map(screen => `<span data-merchant-page="${screen.id}">${screen.title}</span>`).join("")}</div>`;
}

const merchantContinuityTitles = new Set([
  "消息中心",
  "设置",
  "客服中心",
  "服务范围选择",
  "评价回复",
  "换绑手机号",
  "修改登录密码",
  "设置支付密码",
  "语言与字体",
  "商户登录",
  "忘记密码",
]);

function merchantAssurance(title = "") {
  const pageName = title || "当前页面";
  return `
    <section class="card merchant-assurance">
      <h2>${pageName}服务提醒</h2>
      <p>该页面会影响商户资料、服务配置、预约订单、报价确认、服务执行、售后评价、账号安全或结算记录。操作前请核对门店信息、服务范围、客户需求、联系人、预约时间、费用明细和处理状态，确保用户端、商户端与后台展示一致。</p>
      <p>涉及登录、换绑、密码、客服、评价回复、服务范围或消息处理时，请保留操作记录和沟通结果。客户改期、异常上报、退款售后、发票或提现问题可通过平台客服与工单继续处理，后续会同步到订单、消息和经营数据。</p>
      <div class="merchant-assurance-actions">
        <button type="button" data-go="09">${icon("headphones", 14)}客服中心</button>
        <button type="button" data-go="66">${icon("book-open", 14)}平台规则</button>
        <button type="button" data-go="20">${icon("clipboard-list", 14)}订单处理</button>
      </div>
    </section>
  `;
}

function chip(text, color = "") {
  return `<span class="chip ${color}">${text}</span>`;
}

function miniIcon(name, color = "blue") {
  return `<span class="mini-icon ${color}">${icon(name, 18)}</span>`;
}

function statIcon(name, color = "blue") {
  return `<span class="stat-icon ${color}">${icon(name, 18)}</span>`;
}

function tabs(labels, active = 0) {
  return `
    <div class="tabs" style="--cols:${labels.length}">
      ${labels.map((label, index) => `<button class="${index === active ? "is-active" : ""}" type="button">${label}</button>`).join("")}
    </div>
  `;
}

function getMerchantServiceCount(status) {
  if (status === "全部") return serviceItems.length;
  return serviceItems.filter((item) => item.status === status).length;
}

function getFilteredMerchantServices() {
  const query = merchantServiceState.query.trim().toLowerCase();
  return serviceItems.filter((item) => {
    const matchesStatus = merchantServiceState.status === "全部" || item.status === merchantServiceState.status;
    const searchable = `${item.title} ${item.tag} ${item.status} ${item.description || ""}`.toLowerCase();
    return matchesStatus && (!query || searchable.includes(query));
  });
}

function selectMerchantService(id) {
  const service = serviceItems.find((item) => item.id === id);
  if (service) merchantServiceState.selectedId = service.id;
  return service || null;
}

function currentMerchantService() {
  return serviceItems.find((item) => item.id === merchantServiceState.selectedId) || serviceItems[0] || null;
}

function merchantServiceNextStatus(service) {
  return service?.status === "已上架" ? "已下架" : "上架";
}

function merchantServiceStatusActionText(service) {
  return service?.status === "已上架" ? "下架" : "上架";
}

function renderMerchantServiceStatusTabs() {
  return `
    <div class="tabs service-status-tabs" style="--cols:${merchantServiceFilters.length}">
      ${merchantServiceFilters
        .map(
          (label) => `
            <button class="${merchantServiceState.status === label ? "is-active" : ""}" type="button" data-service-status="${label}" aria-pressed="${merchantServiceState.status === label ? "true" : "false"}">
              ${label}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderMerchantServiceFilterPanel() {
  if (!merchantServiceState.filterOpen) return "";
  return `
    <section class="card service-filter-panel">
      <h3>按状态筛选</h3>
      <div class="service-filter-options">
        ${merchantServiceFilters
          .map(
            (label) => `
              <button class="${merchantServiceState.status === label ? "is-active" : ""}" type="button" data-service-status="${label}">
                <span>${label}</span><b>${getMerchantServiceCount(label)}</b>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function field(label, value, options = {}) {
  const required = options.required ? "required" : "";
  const muted = options.muted ? "muted" : "";
  const suffix = Object.prototype.hasOwnProperty.call(options, "suffix") ? options.suffix : icon("chevron-right", 18);
  return `
    <div class="field-row">
      <label class="${required}">${label}</label>
      <div class="value ${muted}">${value}</div>
      <span class="muted">${suffix}</span>
    </div>
  `;
}

function settingRow(iconName, title, sub = "", color = "blue", right = icon("chevron-right", 18)) {
  return `
    <div class="setting-row">
      ${miniIcon(iconName, color)}
      <div>
        <strong>${title}</strong>
        ${sub ? `<span>${sub}</span>` : ""}
      </div>
      <span class="muted">${right}</span>
    </div>
  `;
}

function stepper(activeStep = 1) {
  const steps = ["基础信息", "资质上传", "服务类型", "提交审核"];
  return `
    <div class="stepper">
      ${steps
        .map((label, index) => {
          const step = index + 1;
          const cls = step < activeStep ? "done" : step === activeStep ? "active" : "";
          return `<div class="step ${cls}"><b>${step < activeStep ? "✓" : step}</b><span>${label}</span></div>`;
        })
        .join("")}
    </div>
  `;
}

function merchantSummary({ compact = false, showOnline = true } = {}) {
  const profile = currentMerchantProfile();
  const onlineAccepting = profile.onlineAccepting ?? merchantOnlineAccepting;
  const onlineTitle = profile.onlineStatus || (onlineAccepting ? "在线接单中" : "暂停接单");
  const onlineDesc = profile.onlineStatusText || (onlineAccepting ? "客户可看到并预约商户服务" : "客户暂时不能预约商户服务");
  const status = profile.status || "待同步";
  const statusTone = status === "已通过" ? "green" : /驳回|拒绝/.test(status) ? "red" : "orange";
  const serviceSummary = merchantServiceSummary(profile);
  return `
    <section class="card merchant-card">
      <div class="merchant-head">
        <span class="logo-mark"><img src="${assets.logo}" alt="云旅无忧商户端 logo" /></span>
        <div>
          <h2>${escapeHtml(profile.name || "商户资料同步中")} ${chip(escapeHtml(status), statusTone)}</h2>
          <p>${escapeHtml(serviceSummary)}</p>
        </div>
        ${compact ? "" : ""}
      </div>
      ${showOnline ? `<button class="online-row" type="button" data-action="在线接单" aria-pressed="${onlineAccepting ? "true" : "false"}">
        <div>
          <strong>${icon(onlineAccepting ? "circle-check" : "circle-pause", 17)}<span data-merchant-online-title>${escapeHtml(onlineTitle)}</span></strong>
          <span class="muted" data-merchant-online-desc>${escapeHtml(onlineDesc)}</span>
        </div>
        <span class="switch workbench-online-switch ${onlineAccepting ? "on" : ""} ${compact ? "blue" : ""}" aria-hidden="true"></span>
      </button>` : ""}
    </section>
  `;
}

function renderMerchantFunctionOverviewPanel() {
  const state = merchantFunctionOverviewState;
  if (state.loading && !state.data) {
    return `
      <section class="card section-card merchant-function-overview is-loading">
        <div class="merchant-function-head">
          <div>
            <h3 class="section-title">经营能力</h3>
            <p>正在同步服务、订单、结算状态</p>
          </div>
          <span class="status-chip blue">加载中</span>
        </div>
        <div class="merchant-function-skeleton"><span></span><span></span><span></span></div>
      </section>
    `;
  }
  if (state.error && !state.data) {
    return `
      <section class="card section-card merchant-function-overview error">
        <div class="merchant-function-head">
          <div>
            <h3 class="section-title">经营能力</h3>
            <p>${escapeHtml(state.error)}</p>
          </div>
          <button type="button" data-merchant-function-refresh="true">${icon("rotate-ccw", 15)}重试</button>
        </div>
      </section>
    `;
  }
  const data = state.data;
  if (!data) {
    return `
      <section class="card section-card merchant-function-overview is-loading">
        <div class="merchant-function-head">
          <div>
            <h3 class="section-title">经营能力</h3>
            <p>准备同步经营状态</p>
          </div>
          <span class="status-chip blue">待加载</span>
        </div>
      </section>
    `;
  }
  const rows = data.modules || [];
  return `
    <section class="card section-card merchant-function-overview">
      <div class="merchant-function-head">
        <div>
          <h3 class="section-title">经营能力</h3>
          <p>后台审核、订单预约、服务执行与结算状态同步</p>
        </div>
        <button type="button" data-merchant-function-refresh="true">${icon("rotate-ccw", 15)}刷新</button>
      </div>
      <div class="merchant-function-summary" style="--cols:3">
        <span><b>${data.p0Count}</b>核心项</span>
        <span><b>${data.p1Count}</b>增强项</span>
        <span><b>${data.implementedCount}</b>已接入</span>
      </div>
      <div class="merchant-function-list">
        ${rows
          .map((item) => {
            const targetId = routeScreenId(item.route);
            return `
              <button class="merchant-function-row" type="button" data-go="${targetId}">
                <span class="priority ${item.priority.toLowerCase()}">${item.priority}</span>
                <div>
                  <strong>${escapeHtml(item.module)}</strong>
                  <em>${escapeHtml(item.requirementText)}</em>
                  <small>${escapeHtml(item.acceptance)}</small>
                  <small class="runtime">${escapeHtml(compactMetricText(item.runtime?.metrics) || item.runtime?.status || "已接入")}</small>
                </div>
                ${icon("chevron-right", 17)}
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderLogin() {
  return `
    <div class="login-screen">
      ${statusBar()}
      <section class="login-brand">
        <img src="${assets.logo}" alt="云旅无忧商户端 logo" />
        <div>
          <h1>云旅无忧商户端</h1>
          <p>专业服务商户工作台</p>
        </div>
      </section>
      <section class="card login-card">
        <div class="login-tabs"><button class="active" type="button" data-action="验证码登录">验证码登录</button><button type="button" data-action="密码登录">密码登录</button></div>
        <div class="login-input">${icon("smartphone", 24)}<input placeholder="请输入手机号" aria-label="手机号" /></div>
        <div class="login-input">${icon("shield-check", 24)}<input placeholder="请输入验证码" aria-label="验证码" /><button class="link" type="button" data-action="获取验证码">获取验证码</button></div>
        <div class="agree-row"><button class="check" type="button" data-action="同意协议">${icon("check", 14)}</button><span>我已阅读并同意</span><button type="button" data-action="查看用户协议">《用户协议》</button><button type="button" data-action="查看隐私政策">《隐私政策》</button></div>
        <button class="primary-button" style="width:100%;font-size:20px" type="button" data-go="24">登录</button>
        <div class="login-divider"><span>其他操作</span></div>
      <div class="login-extra">
        <button class="header-action" type="button" data-go="26">${icon("store", 22)}商户入驻</button>
        <button class="header-action" type="button" data-go="68">${icon("lock-keyhole", 22)}忘记密码</button>
      </div>
    </section>
      <div class="login-footer">${icon("headphones", 18)} 平台客服 400-888-1234（09:00-18:00）</div>
    </div>
  `;
}

function renderWorkbench() {
  const dashboardStats = merchantWorkbenchState.stats || merchantWorkbenchState.dashboard?.stats || {};
  const stats = [
    ["calendar-check", "今日收入", merchantMoney(dashboardStats.todayIncome), "blue", "16"],
    ["clipboard-list", "接单数", String(dashboardStats.orderCount || 0), "orange", "20"],
    ["user-check", "完成数", String(dashboardStats.completedOrders || 0), "green", "20"],
    ["building-2", "服务分类", String(merchantServiceCategoryCount()), "purple", "11"],
  ];
  const categories = merchantReceptionCategories();
  const receptionItems = getMerchantReceptionItems();
  return frame({
    title: "工作台",
    tab: "home",
    back: false,
    compact: true,
    message: true,
    screenClass: "screen-workbench",
    content: `
      <div class="merchant-workbench">
        ${merchantSummary()}
        <section class="card section-card stats-strip workbench-stats" style="--cols:4">
          ${stats
            .map(
              ([iconName, label, value, color, target]) => `
                <button class="stat" type="button" data-go="${target}">${statIcon(iconName, color)}<span>${label}</span><strong>${value}</strong></button>
              `,
            )
            .join("")}
        </section>
        <section class="card section-card merchant-reception-panel">
          <div class="merchant-reception-head">
            <div>
              <h3 class="section-title">今日待接待服务</h3>
              <p>后台配置服务内容，商户端只处理已分配的专业服务需求</p>
            </div>
            <button type="button" data-go="20">全部订单</button>
          </div>
          <div class="merchant-reception-cats">
            ${categories.map((category) => `<button class="${merchantWorkbenchState.category === category.name ? "active" : ""}" type="button" data-workbench-category="${category.name}" aria-pressed="${merchantWorkbenchState.category === category.name ? "true" : "false"}"><span>${category.name}</span><b>${category.count}</b></button>`).join("")}
          </div>
          <div class="merchant-reception-list">
            ${receptionItems.map(renderMerchantReceptionCard).join("") || `<article class="merchant-reception-empty"><strong>暂无${merchantWorkbenchState.category}服务</strong><span>后台分配后会自动出现在这里</span></article>`}
          </div>
        </section>
      </div>
    `,
  });
}

function merchantReceptionCategories() {
  const names = ["全部", ...Array.from(new Set(merchantReceptionServices.map((item) => item.category)))];
  return names.map((name) => ({
    name,
    count: name === "全部" ? merchantReceptionServices.length : merchantReceptionServices.filter((item) => item.category === name).length,
  }));
}

function getMerchantReceptionItems() {
  if (merchantWorkbenchState.category === "全部") return merchantReceptionServices;
  return merchantReceptionServices.filter((item) => item.category === merchantWorkbenchState.category);
}

function renderMerchantReceptionCard(item) {
  const iconName = item.category === "医疗服务" ? "stethoscope"
    : item.category === "上门护理" ? "heart-pulse"
      : item.category === "营养餐食" ? "utensils"
        : item.category === "康复理疗" ? "activity"
          : "hand-heart";
  const orderId = escapeHtml(item.id || item.orderNo || "");
  const target = escapeHtml(item.target || "34");
  return `
    <article class="merchant-reception-card" data-go="${target}" data-order-id="${orderId}">
      <div class="merchant-reception-icon ${item.color}">${icon(iconName, 22)}</div>
      <div class="merchant-reception-main">
        <header><strong>${escapeHtml(item.title)}</strong>${chip(escapeHtml(item.status), item.color)}</header>
        <p>${escapeHtml(item.customer)} · ${escapeHtml(item.age)} · ${escapeHtml(item.time)}</p>
        <p>${icon("map-pin", 13)} ${escapeHtml(item.address)}</p>
        <small>${escapeHtml(item.need)}</small>
      </div>
      <button type="button" data-go="${target}" data-order-id="${orderId}">${escapeHtml(item.action)}</button>
    </article>
  `;
}

function renderServiceList() {
  const filteredServices = getFilteredMerchantServices();
  const filterLabel = merchantServiceState.status === "全部" ? "筛选" : merchantServiceState.status;
  return frame({
    title: "服务管理",
    tab: "service",
    back: false,
    compact: true,
    screenClass: "screen-service-list",
    content: `
      <div class="merchant-service-search-row">
        <label class="search-box"><i data-lucide="search"></i><input placeholder="搜索服务名称" data-service-search value="${escapeHtml(merchantServiceState.query)}" /></label>
        <button type="button" data-service-filter-toggle="true" aria-expanded="${merchantServiceState.filterOpen ? "true" : "false"}">${icon("sliders-horizontal", 18)}${filterLabel}</button>
      </div>
      ${renderMerchantServiceStatusTabs()}
      ${renderMerchantServiceFilterPanel()}
      <section class="card section-card stats-strip" style="--cols:4">
        ${[
          ["package", "全部服务", getMerchantServiceCount("全部"), "blue"],
          ["circle-check", "已上架", getMerchantServiceCount("已上架"), "green"],
          ["clock", "待审核", getMerchantServiceCount("待审核"), "orange"],
          ["archive", "已下架", getMerchantServiceCount("已下架"), "purple"],
        ]
          .map(([iconName, label, value, color]) => `<div class="stat">${statIcon(iconName, color)}<strong>${value}</strong><span>${label}</span></div>`)
          .join("")}
      </section>
      <section style="margin-top:12px">
        ${
          filteredServices.length
            ? filteredServices
                .map(
                  (item) => `
                    <article class="card service-card" data-service-id="${escapeHtml(item.id)}">
                      <span class="photo"><img src="${item.image}" alt="${item.title}" /></span>
                      <div class="service-card-body">
                        <button class="service-card-main" type="button" data-merchant-service-open="${escapeHtml(item.id)}">
                          <h3>${escapeHtml(item.title)}${chip(escapeHtml(item.tag))}</h3>
                        </button>
                        <span class="status-chip ${item.state}" style="float:right">${item.status}</span>
                        <div class="price">${item.price} <span class="muted" style="font-size:13px">/ 次</span></div>
                        <div class="info-line">${icon("clock", 15)}服务时长 ${item.duration}</div>
                        ${item.description ? `<p class="service-desc">${escapeHtml(item.description)}</p>` : ""}
                        <div class="service-actions">
                          <button type="button" data-go="30" data-merchant-service-edit="${escapeHtml(item.id)}">${icon("pencil", 15)}编辑</button>
                          <button type="button" data-merchant-service-status="${escapeHtml(item.id)}">${icon("power", 15)}${merchantServiceStatusActionText(item)}</button>
                          <button type="button" data-merchant-service-copy="${escapeHtml(item.id)}">${icon("copy", 15)}复制</button>
                        </div>
                      </div>
                    </article>
                  `,
                )
                .join("")
            : `<article class="card section-card empty-state service-list-empty">${icon("search", 40)}<strong>暂无符合条件的服务</strong><span>请调整服务状态或关键词后再试</span></article>`
        }
      </section>
      <div class="service-list-floating-actions">
        <button class="secondary-button" type="button" data-go="30">${icon("pencil", 18)}编辑服务</button>
        <button class="primary-button floating-add" type="button" data-go="22">${icon("plus-circle", 20)}新增服务</button>
      </div>
    `,
  });
}

function merchantOrderStatusText(order) {
  return order?.apiStatus || order?.status || "";
}

function merchantOrderMatchesFilter(order, filter = merchantOrderListState.status) {
  if (!filter || filter === "全部") return true;
  const status = merchantOrderStatusText(order);
  if (filter === "待确认") return /待确认|待派单|已派单|待接单/.test(status);
  if (filter === "待报价") return /待报价|报价中/.test(status) || /报价/.test(order?.action || "");
  if (filter === "服务中") return /待服务|服务中|已接单/.test(status);
  if (filter === "已完成") return /已完成/.test(status);
  return true;
}

function merchantOrderFilterCount(filter) {
  return orderItems.filter((item) => merchantOrderMatchesFilter(item, filter)).length;
}

function visibleMerchantOrderFilters() {
  return merchantOrderFilters.filter((filter) => filter === "全部" || merchantOrderFilterCount(filter) > 0);
}

function renderMerchantOrderTabs() {
  const filters = visibleMerchantOrderFilters();
  return `
    <div class="merchant-order-filter-dropdown" data-order-filter-open="${merchantOrderListState.filterOpen ? "true" : "false"}">
      <button class="merchant-order-filter-toggle" type="button" data-merchant-order-filter-toggle aria-expanded="${merchantOrderListState.filterOpen ? "true" : "false"}">
        <span>订单状态</span>
        <strong>${merchantOrderListState.status}（${merchantOrderFilterCount(merchantOrderListState.status)}）</strong>
        ${icon(merchantOrderListState.filterOpen ? "chevron-up" : "chevron-down", 16)}
      </button>
      ${merchantOrderListState.filterOpen ? `
        <div class="merchant-order-filter-menu">
          ${filters.map((filter) => `
            <button class="${merchantOrderListState.status === filter ? "is-active" : ""}" type="button" data-merchant-order-filter="${filter}">
              <span>${filter}</span>
              <b>${merchantOrderFilterCount(filter)}</b>
            </button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function merchantOrderListActionButton(item) {
  const orderId = escapeHtml(item.id || item.orderNo || "");
  const label = item.action || "查看详情";
  const detailTarget = item.detailTarget || item.actionTarget || "14";
  if (/确认预约|接待确认/.test(label)) {
    return `<button class="primary-button" type="button" data-merchant-order-action="confirm" data-order-id="${orderId}">确认预约</button>`;
  }
  if (/开始服务/.test(label)) {
    return `<button class="primary-button" type="button" data-merchant-order-action="start" data-order-id="${orderId}">开始服务</button>`;
  }
  if (/提交完成|完成服务/.test(label)) {
    return `<button class="primary-button" type="button" data-merchant-order-action="complete" data-order-id="${orderId}">提交完成</button>`;
  }
  if (/去报价|提交报价/.test(label)) {
    return `<button class="primary-button" type="button" data-go="37" data-order-id="${orderId}">去报价</button>`;
  }
  if (/去服务/.test(label)) {
    return `<button class="primary-button" type="button" data-go="18" data-order-id="${orderId}">去服务</button>`;
  }
  return `<button class="primary-button" type="button" data-go="${escapeHtml(detailTarget)}" data-order-id="${orderId}">查看详情</button>`;
}

function renderOrderList() {
  const visibleOrders = orderItems.filter((item) => merchantOrderMatchesFilter(item));
  return frame({
    title: "预约订单",
    tab: "order",
    back: false,
    compact: true,
    screenClass: "screen-order-list",
    content: `
      ${renderMerchantOrderTabs()}
      <section class="card section-card merchant-order-quick-links">
        <button type="button" data-go="23">报价确认</button>
        <button type="button" data-go="34">预约确认</button>
        <button type="button" data-go="35">预约拒绝</button>
        <button type="button" data-go="18">服务完成上报</button>
      </section>
      ${visibleOrders.length
        ? visibleOrders
        .map(
          (item) => `
          <article class="card order-card" data-go="${escapeHtml(item.detailTarget || "14")}" data-order-id="${escapeHtml(item.id || "")}">
            <div class="order-top">
              <span class="avatar"><img src="${escapeHtml(item.avatar)}" alt="${escapeHtml(item.name)}" /></span>
              <div>
                <div class="order-name">${escapeHtml(item.name)}<span class="muted" style="font-size:13px">${escapeHtml(item.age)}</span>${chip(escapeHtml(item.service))}</div>
                <div class="info-line">${icon("hash", 15)}<span>${escapeHtml(item.orderNo || item.id || "订单确认中")}</span></div>
                <div class="info-line">${icon("clock", 15)}<span>预约时间　${escapeHtml(item.time)}</span></div>
                <div class="info-line">${icon("map-pin", 15)}<span>服务地址　${escapeHtml(item.address)}</span></div>
              </div>
              <span class="status-chip ${escapeHtml(item.state)}">${escapeHtml(item.status)}</span>
            </div>
            <div class="order-foot">
              <span>来源：${escapeHtml(item.source)}</span>
              <span>预计金额 <b class="amount">${escapeHtml(item.amount)}</b></span>
              ${merchantOrderListActionButton(item)}
            </div>
          </article>
        `,
        )
        .join("")
        : `<article class="card section-card empty-state merchant-order-empty">${icon("clipboard-list", 40)}<strong>暂无${escapeHtml(merchantOrderListState.status)}订单</strong><span>当前筛选条件下暂无订单</span></article>`}
    `,
  });
}

function merchantNumberFrom(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const number = Number(String(value).replace(/[^\d.-]/g, ""));
    if (Number.isFinite(number)) return number;
  }
  return 0;
}

function merchantMoney(amount) {
  return `¥${merchantNumberFrom(amount).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function currentMerchantProfile() {
  return merchantWorkbenchState.profile || merchantWorkbenchState.dashboard?.merchant || {};
}

function currentMerchantServices() {
  return Array.isArray(merchantWorkbenchState.dashboard?.services) && merchantWorkbenchState.dashboard.services.length
    ? merchantWorkbenchState.dashboard.services
    : serviceItems;
}

function merchantServiceCategoryCount() {
  const profile = currentMerchantProfile();
  if (Number.isFinite(Number(profile.serviceCategoryCount))) return Number(profile.serviceCategoryCount);
  const categories = new Set(currentMerchantServices().map((item) => item.category || item.tag).filter(Boolean));
  return categories.size;
}

function merchantServiceSummary(profile = currentMerchantProfile()) {
  if (profile.serviceSummary) return profile.serviceSummary;
  if (Array.isArray(profile.serviceCategories) && profile.serviceCategories.length) return profile.serviceCategories.join(" / ");
  const categories = Array.from(new Set(currentMerchantServices().map((item) => item.category || item.tag).filter(Boolean)));
  return categories.join(" / ") || profile.type || "商户服务";
}

function merchantStorePhotoList(profile = currentMerchantProfile()) {
  const rawPhotos = Array.isArray(profile.storePhotos) ? profile.storePhotos : defaultMerchantStorePhotos;
  const photos = rawPhotos
    .filter((item) => item && item.src)
    .slice(0, 9)
    .map((item, index) => ({
      id: String(item.id || `store-photo-${index + 1}`),
      title: String(item.title || `门店照片${index + 1}`),
      src: String(item.src),
      isCover: Boolean(item.isCover),
    }));
  if (!photos.some((item) => item.isCover) && photos[0]) photos[0].isCover = true;
  return photos;
}

function merchantCoverPhoto(profile = currentMerchantProfile()) {
  const photos = merchantStorePhotoList(profile);
  return photos.find((item) => item.isCover) || photos[0] || null;
}

function renderMerchantPhotoRemoveButton(photo, className = "merchant-photo-remove") {
  return `
    <button
      class="${className}"
      type="button"
      data-merchant-photo-delete="${escapeHtml(photo.id)}"
      data-action="删除${escapeHtml(photo.title)}"
      data-no-admin-mirror="true"
      aria-label="删除${escapeHtml(photo.title)}"
    >${icon("x", 16)}</button>
  `;
}

function merchantProfileDefaults(profile = currentMerchantProfile()) {
  return {
    name: profile.name || "",
    type: profile.type || merchantServiceSummary(profile) || "商户服务",
    contact: profile.contact || "",
    phone: profile.phone || "",
    businessHours: profile.businessHours || "09:00-21:00",
    serviceCity: profile.serviceCity || "云南省 昆明市",
    address: profile.address || "",
    intro: profile.intro || "专业护理团队，提供居家护理、陪诊服务、康复理疗等服务。",
  };
}

function merchantProfileSourceKey(profile = currentMerchantProfile()) {
  const fields = merchantProfileDefaults(profile);
  return JSON.stringify([
    profile.id || "merchant-001",
    fields.name,
    fields.type,
    fields.contact,
    fields.phone,
    fields.businessHours,
    fields.serviceCity,
    fields.address,
    fields.intro,
    profile.updatedAt || "",
  ]);
}

function ensureMerchantProfileEditState(profile = currentMerchantProfile()) {
  const sourceKey = merchantProfileSourceKey(profile);
  if (!merchantProfileEditState.sourceKey || (merchantProfileEditState.sourceKey !== sourceKey && !merchantProfileEditState.dirty)) {
    merchantProfileEditState.sourceKey = sourceKey;
    merchantProfileEditState.fields = merchantProfileDefaults(profile);
  }
  return merchantProfileEditState.fields;
}

function merchantProfileFieldValue(field, profile = currentMerchantProfile()) {
  const fields = ensureMerchantProfileEditState(profile);
  return fields[field] ?? merchantProfileDefaults(profile)[field] ?? "";
}

function merchantProfileCompletionPercent() {
  const fields = ensureMerchantProfileEditState();
  const required = ["name", "type", "contact", "phone", "businessHours", "serviceCity", "address", "intro"];
  const completed = required.filter((field) => String(fields[field] || "").trim()).length;
  return Math.round((completed / required.length) * 100);
}

function renderMerchantProfileField({ iconName, label, field, color = "blue", multiline = false, type = "text", maxLength = 80 }) {
  const value = merchantProfileFieldValue(field);
  const counter = multiline ? `<em>${String(value || "").length}/${maxLength}</em>` : "";
  const control = multiline
    ? `<textarea data-merchant-profile-field="${field}" maxlength="${maxLength}" rows="3">${escapeHtml(value)}</textarea>`
    : `<input data-merchant-profile-field="${field}" type="${type}" maxlength="${maxLength}" value="${escapeHtml(value)}" />`;
  return `
    <label class="profile-edit-row profile-field-row ${multiline ? "profile-intro-row" : ""}">
      ${miniIcon(iconName, color)}
      <span>${label}</span>
      <strong>${control}</strong>
      ${counter}
    </label>
  `;
}

function renderMerchantProfileLinkRow([iconName, label, value, color, target]) {
  return `
    <button class="profile-edit-row" type="button" data-go="${target}">
      ${miniIcon(iconName, color)}
      <span>${label}</span>
      <strong>${escapeHtml(value)}</strong>
      ${icon("chevron-right", 18)}
    </button>
  `;
}

function merchantDateFrom(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  const date = new Date(text.replace(/-/g, "/"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function merchantDateKey(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function merchantMonthDay(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function merchantWeekday(date) {
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
}

function merchantAddDays(date, days) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

function merchantRescheduleCandidates() {
  const rawOrders = merchantWorkbenchState.rawOrders || [];
  const allowed = (order) => /已报价|待派单|已派单|待服务/.test(order.status || order.apiStatus || "");
  if (rawOrders.length) return rawOrders.filter(allowed);
  return orderItems.filter(allowed);
}

function currentMerchantRescheduleOrder() {
  const candidates = merchantRescheduleCandidates();
  const selected = candidates.find((order) => order.id === merchantRescheduleState.orderId || order.orderNo === merchantRescheduleState.orderId)
    || candidates.find((order) => /已派单|待服务|待派单|已报价/.test(order.status || order.apiStatus || ""))
    || candidates[0]
    || null;
  if (selected && merchantRescheduleState.orderId !== selected.id) {
    merchantRescheduleState.orderId = selected.id || selected.orderNo || "";
  }
  return selected;
}

function merchantRescheduleDateOptions(order = currentMerchantRescheduleOrder()) {
  const oldDate = merchantDateFrom(order?.time) || new Date();
  return Array.from({ length: 5 }, (_, index) => {
    const date = merchantAddDays(oldDate, index + 1);
    return {
      label: index === 0 ? "明天" : merchantWeekday(date),
      value: merchantDateKey(date),
      day: merchantMonthDay(date),
      week: merchantWeekday(date),
    };
  });
}

function merchantRescheduleSlotOptions() {
  return [
    { time: "09:00-11:00", sub: "不可用", disabled: true },
    { time: "10:00-12:00" },
    { time: "14:00-16:00" },
    { time: "16:00-18:00" },
    { time: "19:00-21:00" },
  ];
}

function ensureMerchantRescheduleDefaults(order = currentMerchantRescheduleOrder()) {
  const dateOptions = merchantRescheduleDateOptions(order);
  const slotOptions = merchantRescheduleSlotOptions().filter((item) => !item.disabled);
  if (!dateOptions.some((item) => item.value === merchantRescheduleState.date)) {
    merchantRescheduleState.date = dateOptions[0]?.value || "";
  }
  if (!slotOptions.some((item) => item.time === merchantRescheduleState.slot)) {
    merchantRescheduleState.slot = slotOptions[0]?.time || "";
  }
  if (!merchantRescheduleState.reason) merchantRescheduleState.reason = "服务人员排班冲突";
  return { dateOptions, slotOptions };
}

function merchantReschedulePayload(button) {
  const order = currentMerchantRescheduleOrder();
  ensureMerchantRescheduleDefaults(order);
  const slotStart = (merchantRescheduleState.slot || "").split("-")[0] || "10:00";
  const time = `${merchantRescheduleState.date} ${slotStart}`;
  return {
    orderId: button?.dataset.orderId || order?.id || order?.orderNo || "",
    time,
    reason: merchantRescheduleState.note
      ? `${merchantRescheduleState.reason}：${merchantRescheduleState.note}`
      : merchantRescheduleState.reason,
    note: merchantRescheduleState.note,
  };
}

function merchantOrderDate(order) {
  return merchantDateFrom(order?.time || order?.createdAt || order?.updatedAt);
}

function merchantOrderInRange(order, range = merchantDataDashboardState.range) {
  const date = merchantOrderDate(order);
  if (!date) return false;
  const today = new Date();
  if (range === "today") return merchantDateKey(date) === merchantDateKey(today);
  if (range === "week") {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return date >= start && date <= end;
  }
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
}

function merchantRangeOrders(range = merchantDataDashboardState.range) {
  const orders = merchantWorkbenchState.rawOrders || [];
  return orders.filter((order) => merchantOrderInRange(order, range));
}

function merchantCompletedOrder(order) {
  return /完成|结算/.test(order?.status || "");
}

function merchantCancelledOrder(order) {
  return /取消|拒绝/.test(order?.status || "");
}

function merchantPendingSettlementOrder(order) {
  return !merchantCancelledOrder(order) && !merchantCompletedOrder(order);
}

function merchantOrderAmount(order) {
  return merchantNumberFrom(order?.amount);
}

function merchantCategoryFromText(text = "") {
  if (/医|诊|体检/.test(text)) return "医疗服务";
  if (/护理|康养|康复/.test(text)) return "康养护理";
  if (/餐|食|营养/.test(text)) return "营养餐食";
  if (/维修|保洁|生活/.test(text)) return "生活服务";
  return "专业服务";
}

function getMerchantUnifiedStats(range = merchantDataDashboardState.range) {
  const dashboardStats = merchantWorkbenchState.stats || merchantWorkbenchState.dashboard?.stats || {};
  const reviews = merchantWorkbenchState.reviews || [];
  const rawOrders = merchantWorkbenchState.rawOrders || [];
  const rangeOrders = rawOrders.length ? merchantRangeOrders(range) : [];
  const activeRangeOrders = rangeOrders.filter((order) => !merchantCancelledOrder(order));
  const completedRangeOrders = activeRangeOrders.filter(merchantCompletedOrder);
  const orderCount = rawOrders.length
    ? activeRangeOrders.length
    : range === "today"
      ? merchantNumberFrom(dashboardStats.todayOrders, dashboardStats.orderCount)
      : range === "month"
        ? merchantNumberFrom(dashboardStats.monthOrders, dashboardStats.monthlyOrders, dashboardStats.orderCount)
        : merchantNumberFrom(dashboardStats.orderCount);
  const completedOrders = rawOrders.length ? completedRangeOrders.length : merchantNumberFrom(dashboardStats.completedOrders);
  const todayIncome = merchantNumberFrom(dashboardStats.todayIncome);
  const revenue = rawOrders.length
    ? completedRangeOrders.reduce((sum, order) => sum + merchantOrderAmount(order), 0)
    : merchantNumberFrom(dashboardStats.revenue);
  const orderAmount = rawOrders.length
    ? activeRangeOrders.reduce((sum, order) => sum + merchantOrderAmount(order), 0)
    : merchantNumberFrom(dashboardStats.todayRevenue, dashboardStats.revenue);
  const pendingSettlement = rawOrders.length
    ? activeRangeOrders.filter(merchantPendingSettlementOrder).reduce((sum, order) => sum + merchantOrderAmount(order), 0)
    : merchantNumberFrom(dashboardStats.settlementPending, dashboardStats.pendingSettlement);
  const favorableRate = reviews.length
    ? `${((reviews.filter((item) => Number(item.rating || 0) >= 4).length / reviews.length) * 100).toFixed(1)}%`
    : dashboardStats.rating
      ? `${Math.min(100, (Number(dashboardStats.rating) / 5) * 100).toFixed(1)}%`
      : "0%";
  return {
    orderCount,
    completedOrders,
    todayIncome,
    revenue,
    orderAmount,
    pendingSettlement,
    favorableRate,
    settlementRecords: rawOrders.length ? activeRangeOrders.filter(merchantPendingSettlementOrder).length : merchantNumberFrom(dashboardStats.settlementRecords),
  };
}

function merchantDataRangeLabel() {
  return ({ today: "今日", week: "本周", month: "本月" })[merchantDataDashboardState.range] || "本月";
}

function merchantRevenueTrendRows(range = merchantDataDashboardState.range) {
  const apiTrend = merchantWorkbenchState.statsPayload?.analytics?.trend;
  const sourceOrders = merchantRangeOrders(range);
  if ((merchantWorkbenchState.rawOrders || []).length && !sourceOrders.length) return [];
  if (sourceOrders.length) {
    const dated = sourceOrders
      .map((order) => ({ order, date: merchantOrderDate(order), amount: merchantOrderAmount(order) }))
      .filter((item) => item.date && !merchantCancelledOrder(item.order));
    const latestDate = dated.length ? new Date(Math.max(...dated.map((item) => item.date.getTime()))) : new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(latestDate);
      date.setDate(latestDate.getDate() - (6 - index));
      const key = merchantDateKey(date);
      const rows = dated.filter((item) => merchantDateKey(item.date) === key);
      return {
        label: merchantMonthDay(date),
        value: rows.reduce((sum, item) => sum + item.amount, 0),
      };
    });
  }
  if (Array.isArray(apiTrend) && apiTrend.length) {
    return apiTrend.map((item) => ({ label: item.label || item.date || "", value: merchantNumberFrom(item.orderAmount, item.settledAmount) }));
  }
  return [];
}

function merchantServiceDistributionRows(range = merchantDataDashboardState.range) {
  const orders = merchantRangeOrders(range).filter((order) => !merchantCancelledOrder(order));
  const counts = new Map();
  orders.forEach((order) => {
    const label = merchantCategoryFromText(order.serviceType || order.requirementCategory || "");
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  if (!counts.size && range === "month") {
    (merchantWorkbenchState.rawServices || []).forEach((service) => {
      const label = service.category || merchantCategoryFromText(service.title || "");
      counts.set(label, (counts.get(label) || 0) + 1);
    });
  }
  const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);
  const colors = ["blue", "green", "orange", "purple", "green"];
  const icons = ["clipboard-check", "user-round-check", "utensils", "heart-handshake", "users"];
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count], index) => ({
      label,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
      color: colors[index % colors.length],
      icon: icons[index % icons.length],
    }));
}

function merchantSettlementRows(range = merchantDataDashboardState.range) {
  return merchantRangeOrders(range)
    .filter((order) => !merchantCancelledOrder(order))
    .sort((a, b) => String(b.time || b.createdAt || "").localeCompare(String(a.time || a.createdAt || "")))
    .slice(0, 6)
    .map((order) => ({
      id: order.id,
      title: `${order.serviceType || "商户服务"}（${order.elderName || "旅居用户"}）`,
      period: order.time || order.createdAt || "时间待确认",
      amount: merchantOrderAmount(order),
      status: merchantCompletedOrder(order) ? "已结算" : "待结算",
    }));
}

function merchantTrendChartSvg(rows) {
  const points = rows.length ? rows : Array.from({ length: 7 }, (_, index) => ({ label: String(index + 1), value: 0 }));
  const max = Math.max(...points.map((item) => item.value), 1);
  const coords = points.map((item, index) => {
    const x = 20 + (272 / Math.max(points.length - 1, 1)) * index;
    const y = 116 - (item.value / max) * 96;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  });
  const line = coords.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");
  const area = `${line} L${coords[coords.length - 1].x} 120 L20 120Z`;
  return `
    <svg class="chart-svg" viewBox="0 0 300 146" role="img" aria-label="订单金额趋势折线图">
      <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#247eff" stop-opacity=".24"/><stop offset="1" stop-color="#247eff" stop-opacity="0"/></linearGradient></defs>
      <g stroke="#e4ebf5" stroke-width="1"><path d="M20 22H292"/><path d="M20 55H292"/><path d="M20 88H292"/><path d="M20 120H292"/></g>
      <path d="${area}" fill="url(#chartFill)"/>
      <path d="${line}" fill="none" stroke="#247eff" stroke-width="3"/>
      <g fill="#fff" stroke="#247eff" stroke-width="2">${coords.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4"/>`).join("")}</g>
      <g fill="#667085" font-size="10" text-anchor="middle">${coords.map((point, index) => `<text x="${point.x}" y="142">${escapeHtml(points[index].label)}</text>`).join("")}</g>
    </svg>
  `;
}

function renderDataDashboard() {
  const unifiedStats = getMerchantUnifiedStats();
  const trendRows = merchantRevenueTrendRows();
  const distributionRows = merchantServiceDistributionRows();
  const settlementRows = merchantSettlementRows();
  const rangeOptions = [
    ["today", "今日"],
    ["week", "本周"],
    ["month", "本月"],
  ];
  return frame({
    title: "数据统计 / 结算管理",
    tab: "data",
    back: false,
    compact: true,
    screenClass: "screen-data-dashboard",
    content: `
      <div class="tabs card" style="--cols:3;margin-top:0;padding:2px">${rangeOptions.map(([key, label]) => `<button class="${merchantDataDashboardState.range === key ? "is-active" : ""}" type="button" data-merchant-data-range="${key}" aria-pressed="${merchantDataDashboardState.range === key ? "true" : "false"}">${label}</button>`).join("")}</div>
      <section class="dashboard-grid">
        ${[
          ["file-text", "订单数", String(unifiedStats.orderCount), `${merchantDataRangeLabel()}订单`, "blue", "20", "查看订单统计"],
          ["circle-dollar-sign", "成交额", merchantMoney(unifiedStats.revenue), "已完成/结算订单", "purple", "43", "查看交易明细"],
          ["thumbs-up", "好评率", unifiedStats.favorableRate, "来自客户评价", "green", "17", "查看评价统计"],
          ["chart-pie", "服务类型占比", distributionRows.length ? `${distributionRows.length}类` : "0类", `${merchantDataRangeLabel()}订单`, "orange", "19", "查看服务类型占比"],
        ]
          .map(
            ([iconName, label, value, sub, color, target, ariaLabel]) => `
              <button class="card metric-card" type="button" data-go="${target}" aria-label="${ariaLabel}">${miniIcon(iconName, color)}<span>${label}</span><strong>${value}</strong><small>${sub}</small></button>
            `,
          )
          .join("")}
      </section>
      <section class="chart-layout" style="margin-top:10px">
        <div class="card section-card chart-card">
          <h3 class="section-title">订单金额趋势</h3>
          <div style="display:flex;justify-content:space-between;color:#475467"><span>${icon("minus", 18)}${merchantDataRangeLabel()}订单金额</span><strong>${merchantMoney(unifiedStats.orderAmount)}</strong></div>
          ${trendRows.some((item) => item.value > 0)
            ? merchantTrendChartSvg(trendRows)
            : `<div class="merchant-category-loading">${merchantDataRangeLabel()}暂无订单金额数据</div>`}
        </div>
        <div class="card section-card">
          <h3 class="section-title">服务类型占比</h3>
          <div class="progress-list">
            ${distributionRows.length
              ? distributionRows
                .map(
                  ({ label, percentage, color, icon }) => `
                <div class="progress-row">${miniIcon(icon, color)}<span>${escapeHtml(label)}<div class="bar"><b style="width:${percentage}%"></b></div></span><b>${percentage}%</b></div>
              `,
                )
                .join("")
              : `<div class="merchant-category-loading">${merchantDataRangeLabel()}暂无服务类型数据</div>`}
          </div>
        </div>
      </section>
      <section class="card section-card stats-strip" style="--cols:2">
        <div class="stat">${statIcon("wallet", "orange")}<span>待结算金额</span><strong>${merchantMoney(unifiedStats.pendingSettlement)}</strong></div>
        <div class="stat">${statIcon("receipt-text", "green")}<span>已结算金额</span><strong>${merchantMoney(unifiedStats.revenue)}</strong></div>
      </section>
      <section class="card section-card">
        <h3 class="section-title">最近结算记录</h3>
        ${settlementRows.length
          ? settlementRows
            .map((row) => `
              <button class="settlement-dashboard-row" type="button" data-go="05">
                <span class="settlement-dashboard-main">
                  <strong>${escapeHtml(row.title)}</strong>
                  <small>记录时间：${escapeHtml(row.period)}</small>
                </span>
                <b>${merchantMoney(row.amount)}</b>
                ${chip(row.status, row.status === "已结算" ? "green" : "orange")}
              </button>
            `)
            .join("")
          : `<div class="merchant-category-loading">${merchantDataRangeLabel()}暂无结算相关订单</div>`}
      </section>
    `,
  });
}

function renderProfileHome() {
  const unifiedStats = getMerchantUnifiedStats();
  return frame({
    title: "我的",
    tab: "mine",
    back: false,
    compact: true,
    message: true,
    screenClass: "screen-profile-home",
    content: `
      ${merchantSummary({ compact: true, showOnline: false })}
      <section class="card section-card stats-strip" style="--cols:3">
        <button class="stat" type="button" data-go="20" aria-label="查看本月订单">${statIcon("file-text", "blue")}<span>本月订单</span><strong>${unifiedStats.orderCount} 单</strong><span>本月经营数据</span></button>
        <button class="stat" type="button" data-go="17" aria-label="查看好评率和评价">${statIcon("thumbs-up", "green")}<span>好评率</span><strong>${unifiedStats.favorableRate}</strong><span>来自客户评价</span></button>
        <button class="stat" type="button" data-go="42" aria-label="查看待结算金额">${statIcon("wallet", "orange")}<span>待结算金额</span><strong>${merchantMoney(unifiedStats.pendingSettlement)}</strong><span>共 ${unifiedStats.settlementRecords} 笔</span></button>
      </section>
      <section class="card settings-group">
        ${[
          ["store", "商户资料", "查看或编辑门店信息", "blue", "02"],
          ["shield-check", "认证资质", "查看认证状态与资质信息", "green", "03"],
          ["receipt-text", "发票信息", "管理发票抬头与开票记录", "orange", "13"],
          ["lock-keyhole", "账户安全", "修改密码、绑定手机等", "blue", "07"],
          ["headphones", "客服中心", "常见问题、联系客服", "purple", "09"],
          ["settings", "设置", "通知设置、隐私设置等", "gray", "08"],
        ]
          .map(([iconName, title, sub, color, target]) => `<div data-go="${target}">${settingRow(iconName, title, sub, color)}</div>`)
          .join("")}
      </section>
      <section class="card section-card bank-row" data-go="04">
        ${miniIcon("wallet", "blue")}
        <div><strong>我的钱包</strong><div class="muted">查看余额、提现与交易明细</div></div>
        <b style="font-size:18px">${merchantMoney(unifiedStats.pendingSettlement)} ${icon("chevron-right", 18)}</b>
      </section>
      <button class="danger-button" type="button" data-go="67" style="width:100%;margin-top:12px">${icon("log-out", 18)}退出登录</button>
    `,
  });
}

function renderWalletLike(screen) {
  const unifiedStats = getMerchantUnifiedStats();
  const isWithdraw = screen.id === "44";
  const isBank = screen.id === "45";
  const isSettle = ["05", "42"].includes(screen.id);
  const isDetail = screen.id === "43";

  if (isBank) {
    return frame({
      title: "绑定银行卡",
      right: "绑卡说明",
      screenClass: "bank-bind-screen",
      assurance: false,
      content: `
        <span class="sr-only">绑定银行卡页面，包含绑卡说明、持卡人信息、银行卡信息、验证信息、上传凭证和确认绑定操作。</span>
        <div class="bank-bind-tip">${icon("info", 18)}<span>银行卡仅用于商户提现结算，请绑定对公或法人实名账户</span></div>
        <section class="card bank-bind-card">
          <h3 class="bank-bind-title">持卡人信息</h3>
          <div class="bank-bind-row account-type">
            <span>账户类型</span>
            <div><button class="active" type="button" data-action="选择对公账户">对公账户</button><button type="button" data-action="选择法人账户">法人账户</button></div>
          </div>
          <div class="bank-bind-row"><span>开户名称</span><strong>云旅无忧（昆明）科技有限公司</strong></div>
          <div class="bank-bind-row"><span>联系人</span><strong>李奶奶</strong></div>
          <div class="bank-bind-row"><span>手机号</span><strong>138 **** 8888</strong></div>
        </section>
        <section class="card bank-bind-card">
          <h3 class="bank-bind-title">银行卡信息</h3>
          <button class="bank-bind-row" type="button" data-action="选择银行名称"><span>银行名称</span><strong>${icon("badge-check", 22)}中国建设银行</strong>${icon("chevron-right", 18)}</button>
          <button class="bank-bind-row" type="button" data-action="选择开户支行"><span>开户支行</span><strong>昆明穿金路支行</strong>${icon("chevron-right", 18)}</button>
          <div class="bank-bind-row"><span>银行账号</span><strong>5300 1688 8888 8888 8888</strong></div>
          <div class="bank-bind-row muted"><span>确认账号</span><strong>请输入银行账号</strong></div>
        </section>
        <section class="card bank-bind-card bank-verify-card">
          <h3 class="bank-bind-title">验证信息</h3>
          <div class="bank-bind-row verify"><span>手机验证码</span><strong>请输入验证码</strong><button type="button" data-action="获取验证码">获取验证码</button></div>
          <button class="bank-confirm-row" type="button" data-action="确认账户信息真实有效"><i>${icon("check", 16)}</i><span>我已确认账户信息真实有效</span></button>
        </section>
        <section class="card bank-bind-card bank-upload-card">
          <h3 class="bank-bind-title">上传凭证 <em>（选填）</em></h3>
          <button class="bank-upload-box" type="button" data-action="上传开户许可证或银行卡照片">
            ${icon("camera", 30)}
            <span>开户许可证/银行卡照片</span>
            <small>支持 JPG/PNG，大小不超过10MB</small>
          </button>
        </section>
        <div class="sticky-action bank-bind-actions two-actions">
          <button class="secondary-button" type="button" data-go="44">取消</button>
          <button class="primary-button" type="button" data-go="44">确认绑定</button>
        </div>
      `,
    });
  }

  if (isWithdraw) {
    return frame({
      title: "提现申请",
      right: "提现规则",
      screenClass: "withdraw-screen",
      assurance: false,
      content: `
        <section class="wallet-card merchant-withdraw-hero">
          <span>可提现余额 ${icon("eye", 17)}</span>
          <div class="balance">${merchantMoney(unifiedStats.pendingSettlement)}</div>
          <div class="wallet-sub"><div>待结算 ${icon("circle-help", 15)}<strong>${merchantMoney(unifiedStats.pendingSettlement)}</strong></div><div>今日收入 ${icon("circle-help", 15)}<strong>${merchantMoney(unifiedStats.todayIncome)}</strong></div></div>
        </section>
        <section class="card form-section merchant-withdraw-account">
          <h3 class="section-title">提现账户</h3>
          <div class="bank-row">${miniIcon("badge-check", "blue")}<div><strong>中国建设银行 <em>昆明穿金路支行</em></strong><span><b>储蓄卡</b>　尾号 8888</span></div><button class="header-action" type="button" data-go="45">更换 ${icon("chevron-right", 18)}</button></div>
        </section>
        <section class="card form-section merchant-withdraw-amount">
          <h3 class="section-title">提现金额</h3>
          <div class="withdraw-amount-input">¥ 3,000.00<i></i></div>
          <div class="withdraw-presets"><button type="button" data-action="全部提现">全部</button><button type="button" data-action="提现1000">1000</button><button class="active" type="button" data-action="提现3000">3000</button><button type="button" data-action="提现5000">5000</button></div>
          <p>单笔最低100元，预计1-3个工作日到账</p>
        </section>
        <section class="card form-section merchant-withdraw-fee">
          <h3 class="section-title">费用说明</h3>
          <div><span>提现金额</span><strong>¥ 3,000.00</strong></div>
          <div><span>手续费 ${icon("circle-help", 14)}</span><strong>¥ 0.00</strong></div>
          <div class="total"><span>实际到账</span><strong>¥ 3,000.00</strong></div>
        </section>
        <section class="card form-section merchant-withdraw-safe">
          <h3 class="section-title">安全验证</h3>
          <div class="withdraw-password"><span>支付密码</span><input type="password" value="000000" aria-label="支付密码" /><button type="button" data-action="显示或隐藏支付密码">${icon("eye-off", 18)}</button></div>
        </section>
        <div class="sticky-action merchant-withdraw-submit"><button class="primary-button" type="button" data-action="确认提现">确认提现</button></div>
        <p class="merchant-withdraw-note">提现申请提交后可在交易明细中查看进度</p>
      `,
    });
  }

  if (screen.id === "05") {
    const orderRows = [
      ["user", "居家护理服务（李奶奶）", "SO20250520001", "¥ 268.00", "05-20", "green"],
      ["message-circle", "陪诊预约服务（张叔叔）", "SO20250519008", "¥ 198.00", "05-19", "blue"],
      ["heart-handshake", "康复理疗上门服务（王阿姨）", "SO20250518015", "¥ 298.00", "05-18", "orange"],
      ["car", "接送站服务（刘先生）", "SO20250518021", "¥ 158.00", "05-18", "purple"],
    ];
    return frame({
      title: "结算详情",
      right: "下载",
      screenClass: "settlement-detail-screen",
      content: `
        <section class="card settlement-hero-card">
          <span class="settlement-hero-icon">${icon("receipt-text", 34)}<i>${icon("check", 15)}</i></span>
          <div class="settlement-hero-main">
            <h2>2025-05-12 至 05-18 结算单</h2>
            <p>结算周期：2025-05-12 至 05-18</p>
            <strong>¥ 18,560.00</strong>
            <em>共 23 笔订单</em>
          </div>
          ${chip("已结算", "green")}
          <div class="settlement-time">
            ${icon("calendar-days", 19)}
            <span>结算时间</span>
            <b>2025-05-19 10:00</b>
          </div>
        </section>
        <section class="card settlement-section settlement-summary-card">
          <h3 class="settlement-section-title">结算明细</h3>
          ${[
            ["briefcase-business", "订单收入", "¥ 19,280.00", "blue"],
            ["percent", "平台服务费", "- ¥ 520.00", "orange"],
            ["badge-yen", "售后退款", "- ¥ 200.00", "purple"],
          ].map(([iconName, label, value, color]) => `
            <div class="settlement-money-row">
              ${miniIcon(iconName, color)}
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `).join("")}
          <div class="settlement-total-row"><span>实际结算</span><strong>¥ 18,560.00</strong></div>
        </section>
        <section class="card settlement-section settlement-bank-card">
          <h3 class="settlement-section-title">收款账户</h3>
          <button type="button" data-go="45" class="settlement-bank-row">
            <span class="bank-logo">${icon("landmark", 28)}</span>
            <span><strong>中国建设银行</strong><em>尾号 8888</em></span>
            <b>昆明穿金路支行</b>
            ${chip("已到账", "green")}
            ${icon("chevron-right", 18)}
          </button>
        </section>
        <section class="card settlement-section settlement-order-card">
          <h3 class="settlement-section-title">订单明细</h3>
          <div class="settlement-filter-row">
            <button type="button" data-action="搜索订单">${icon("search", 18)}搜索订单号 / 客户名称</button>
            <button type="button" data-action="选择全部服务">全部服务 ${icon("chevron-down", 15)}</button>
            <button type="button" data-action="选择全部状态">全部状态 ${icon("chevron-down", 15)}</button>
            <button type="button" data-action="筛选订单">${icon("list-filter", 18)}筛选</button>
          </div>
          <div class="settlement-order-list">
            ${orderRows.map(([iconName, title, no, amount, date, color]) => `
              <button type="button" data-go="14" class="settlement-order-row">
                ${miniIcon(iconName, color)}
                <span><strong>${title}</strong><em>订单号：${no}</em></span>
                <b>${amount}<small>已完成</small></b>
                <time>${date}</time>
                ${icon("chevron-right", 16)}
              </button>
            `).join("")}
          </div>
        </section>
        <div class="sticky-action settlement-actions two-actions">
          <button class="secondary-button" type="button" data-go="09">${icon("headphones", 22)}联系客服</button>
          <button class="primary-button" type="button" data-action="下载结算单">${icon("download", 22)}下载结算单</button>
        </div>
      `,
    });
	  }

  if (screen.id === "42") {
    const settlements = [
      ["2025-05-12 至 05-18 结算单", "结算时间：2025-05-19 10:00", "共 23 笔订单", "¥18,560.00"],
      ["2025-05-05 至 05-11 结算单", "结算时间：2025-05-12 10:00", "共 21 笔订单", "¥16,230.00"],
      ["2025-04-28 至 05-04 结算单", "结算时间：2025-05-05 10:00", "共 19 笔订单", "¥14,890.00"],
      ["2025-04-21 至 04-27 结算单", "结算时间：2025-04-28 10:00", "共 18 笔订单", "¥13,960.00"],
    ];
    return frame({
      title: "结算记录",
      right: `${icon("file-output", 22)} 导出`,
      tab: "data",
      screenClass: "settlement-list-screen",
      assurance: false,
      content: `
        <span class="sr-only">结算记录页面，包含状态标签、结算统计、筛选条件、结算单列表和查看详情操作。</span>
        ${tabs(["全部", "待结算", "已结算", "异常"], 0)}
        <section class="card settlement-list-stats">
          ${[
            ["wallet", "待结算金额", merchantMoney(unifiedStats.pendingSettlement), `共 ${unifiedStats.settlementRecords} 笔`, "orange"],
            ["calendar-check", "完成数", `${unifiedStats.completedOrders} 单`, "", "green"],
            ["database", "平台服务费", "¥3,260.00", "", "blue"],
          ].map(([iconName, label, value, sub, color]) => `<div>${statIcon(iconName, color)}<span>${label}</span><strong>${value}</strong><em>${sub}</em></div>`).join("")}
        </section>
        <section class="card settlement-list-filter">
          <button type="button" data-action="选择月份">${icon("calendar-days", 22)}本月${icon("chevron-down", 18)}</button>
          <button type="button" data-action="选择服务">${icon("layout-grid", 22)}全部服务${icon("chevron-down", 18)}</button>
          <button type="button" data-action="选择状态">${icon("list-filter", 22)}全部状态${icon("chevron-down", 18)}</button>
        </section>
        <section class="settlement-list-cards">
          ${settlements.map(([title, time, count, amount]) => `
            <article class="card settlement-list-card">
              <span>${icon("calendar-check", 32)}<i>${icon("check", 14)}</i></span>
              <div><h3>${title}</h3><p>${time}</p><p>${count}</p></div>
              <strong>${amount}</strong>
              ${chip("已结算", "green")}
              <button type="button" data-go="05">查看详情 ${icon("chevron-right", 18)}</button>
            </article>
          `).join("")}
        </section>
      `,
    });
  }

  if (screen.id === "43") {
    const transactions = [
      ["clipboard-check", "居家护理服务（李奶奶）", "今天　10:35", "订单号　SO202505200001", "+ ¥ 268.00", "已入账", "green", "05"],
      ["users", "陪诊预约服务（张叔叔）", "昨天　14:20", "订单号　SO202505190008", "+ ¥ 198.00", "已入账", "green", "14"],
      ["wallet", "提现到银行卡", "05-19　09:00", "提现单号　TX202505190001", "- ¥ 3,000.00", "处理中", "orange", "44"],
      ["banknote", "平台服务费", "05-18　18:20", "费用单号　FW202505180032", "- ¥ 26.80", "已扣除", "gray", "05"],
      ["undo-2", "售后退款", "05-18　11:30", "退款单号　TK202505180015", "- ¥ 80.00", "已退款", "purple", "48"],
    ];
    return frame({
      title: "交易明细",
      right: `${icon("list-filter", 22)} 筛选`,
      screenClass: "transaction-detail-screen",
      assurance: false,
      content: `
        <span class="sr-only">交易明细页面，包含搜索交易记录、月份和类型筛选、交易统计、分类标签、交易列表和导出明细操作。</span>
        <section class="transaction-filter-row">
          <button class="transaction-search" type="button" data-action="搜索交易记录">${icon("search", 24)}<span>搜索交易记录</span></button>
          <button type="button" data-action="选择本月">本月 ${icon("chevron-down", 18)}</button>
          <button type="button" data-action="选择全部类型">全部类型 ${icon("chevron-down", 18)}</button>
        </section>
        <section class="card transaction-stats-card">
          ${[
            ["arrow-down-circle", "今日收入", merchantMoney(unifiedStats.todayIncome), `完成 ${unifiedStats.completedOrders} 单`, "green"],
            ["arrow-up-circle", "本月提现", "¥ 8,000.00", "共 12 笔", "orange"],
            ["layers", "服务费", "¥ 520.00", "共 18 笔", "blue"],
          ].map(([iconName, label, value, sub, color]) => `
            <div class="${color}">
              <span>${icon(iconName, 23)}</span>
              <em>${label}</em>
              <strong>${value}</strong>
              <small>${sub}</small>
            </div>
          `).join("")}
        </section>
        <section class="card transaction-list-card">
          ${tabs(["全部", "收入", "提现", "退款", "扣费"], 0)}
          <div class="transaction-list">
            ${transactions.map(([iconName, title, time, no, amount, status, color, target]) => `
              <button class="transaction-row ${color}" type="button" data-go="${target}">
                <span class="transaction-row-icon">${icon(iconName, 24)}</span>
                <span class="transaction-row-main">
                  <strong>${title}</strong>
                  <em>${time}</em>
                  <small>${no}</small>
                </span>
                <b>${amount}</b>
                ${chip(status, color)}
                ${icon("chevron-right", 22)}
              </button>
            `).join("")}
          </div>
        </section>
        <div class="sticky-action transaction-export-action">
          <button class="primary-button" type="button" data-action="导出交易明细">${icon("file-output", 24)}导出明细</button>
        </div>
      `,
    });
  }

  if (isSettle || isDetail) {
    return frame({
      title: screen.title,
      right: isDetail ? "筛选" : "导出",
      content: `
        ${tabs(isSettle ? ["全部", "待结算", "已结算", "异常"] : ["全部", "收入", "提现", "退款", "扣费"], 0)}
        <section class="card section-card stats-strip" style="--cols:3">
          <div class="stat">${statIcon("wallet", "orange")}<span>待结算</span><strong>${merchantMoney(unifiedStats.pendingSettlement)}</strong></div>
          <div class="stat">${statIcon("receipt-text", "green")}<span>今日收入</span><strong>${merchantMoney(unifiedStats.todayIncome)}</strong></div>
          <div class="stat">${statIcon("banknote", "blue")}<span>手续费</span><strong>¥3,260.00</strong></div>
        </section>
        <section class="card section-card">
          ${[
            ["2025-05-12 至 05-18 结算单", "+¥18,560.00", "已结算", "green"],
            ["居家护理服务（李奶奶）", "+¥268.00", "已入账", "green"],
            ["提现到建设银行卡", "-¥3,000.00", "处理中", "orange"],
            ["平台服务费", "-¥26.80", "已扣除", "gray"],
          ]
            .map(([title, amount, status, color], index) => `<div class="list-row"><div>${miniIcon(index === 2 ? "arrow-up-right" : "arrow-down", color)}</div><div><div class="title">${title}</div><div class="sub">05-${19 - index} 10:${35 - index * 5}</div></div><b class="${amount.startsWith("+") ? "chip green" : ""}" style="background:transparent">${amount}</b>${chip(status, color)}</div>`)
            .join("")}
        </section>
      `,
    });
  }

  return frame({
    title: "我的钱包",
    right: "交易明细",
    screenClass: "merchant-wallet-screen",
    content: `
      <section class="wallet-card">
        <span>可提现余额 ${icon("eye", 17)}</span>
        <div class="balance">${merchantMoney(unifiedStats.pendingSettlement)}</div>
        <div class="wallet-sub"><div>待结算<strong>${merchantMoney(unifiedStats.pendingSettlement)}</strong></div><div>今日收入<strong>${merchantMoney(unifiedStats.todayIncome)}</strong></div><button class="secondary-button" type="button" data-go="44" style="border:0;min-height:40px;padding:0 18px">提现 ${icon("chevron-right", 16)}</button></div>
      </section>
      <section class="card section-card bank-row">
        ${miniIcon("landmark", "blue")}
        <div><strong>中国建设银行 ${chip("储蓄卡")}</strong><div class="muted">昆明穿金路支行　尾号 8888</div></div>
        <button class="header-action" type="button" data-go="45">更换 ${icon("chevron-right", 16)}</button>
      </section>
      <section class="card section-card stats-strip" style="--cols:3">
        <div class="stat">${statIcon("arrow-down-to-line", "green")}<span>今日入账</span><strong>${merchantMoney(unifiedStats.todayIncome)}</strong></div>
        <div class="stat">${statIcon("calendar-days", "blue")}<span>接单数</span><strong>${unifiedStats.orderCount} 单</strong></div>
        <div class="stat">${statIcon("clock", "orange")}<span>提现中</span><strong>¥3,000.00</strong></div>
      </section>
      <section class="card section-card">
        <h3 class="section-title">收支明细</h3>
        ${tabs(["全部", "收入", "提现", "退款"], 0)}
        ${[
          ["居家护理服务（李奶奶）", "今天 10:35", "+¥268.00", "已入账", "green"],
          ["陪诊预约服务（张叔叔）", "昨天 14:20", "+¥198.00", "已入账", "green"],
          ["提现到银行卡", "05-19 09:00", "-¥3,000.00", "处理中", "orange"],
          ["平台服务费", "05-18 18:20", "-¥26.80", "已扣除", "gray"],
        ]
          .map(([title, time, amount, status, color]) => `<div class="list-row merchant-wallet-row"><div>${miniIcon(amount.startsWith("+") ? "arrow-down" : "arrow-up-right", color)}</div><div><div class="title">${title}</div><div class="sub">${icon("clock", 13)} ${time}</div></div><span class="merchant-wallet-amount"><b style="color:${amount.startsWith("+") ? "var(--green)" : "var(--text)"}">${amount}</b>${chip(status, color)}</span></div>`)
          .join("")}
      </section>
      <div class="sticky-action"><button class="primary-button" type="button" data-go="44">立即提现</button></div>
    `,
  });
}

function renderMerchantProfile(screen) {
  const isReferenceProfile = screen.id === "02";
  const isEdit = screen.id === "53" || isReferenceProfile;
  const isHours = screen.id === "54";
  const isCity = screen.id === "55";
  const isPhotos = screen.id === "56";
  const isCertUpdate = ["57", "58", "03"].includes(screen.id);

  if (isCertUpdate) {
    return renderCert(screen);
  }

  if (isHours) {
    return frame({
      title: "营业时间设置",
      right: "保存",
      screenClass: "business-hours-screen",
      assurance: false,
      content: `
        <div class="business-hours-tip">${icon("info", 18)}营业时间会展示给客户，并影响可预约时段</div>
        <section class="card business-hours-card business-status-card">
          <h3><span></span>营业状态</h3>
          <div>
            ${miniIcon("store", "green")}
            <strong>在线营业中<small>关闭后客户将无法预约您的服务</small></strong>
            <em class="switch on"></em>
          </div>
        </section>
        <section class="card business-hours-card business-week-card">
          <h3><span></span>每周营业日</h3>
          <div>${["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((d, i) => `<button class="${i < 6 ? "active" : ""}" type="button" data-action="${d}营业">${d}${i < 6 ? icon("check-circle", 14) : ""}</button>`).join("")}</div>
        </section>
        <section class="card business-hours-card business-slot-card">
          <h3><span></span>营业时段</h3>
          ${[
            ["sun", "上午", "09:00 - 12:00", "orange"],
            ["sun", "下午", "14:00 - 18:00", "blue"],
            ["moon-star", "晚间", "19:00 - 21:00", "purple"],
          ].map(([iconName, label, time, color]) => `<div class="business-time-row">${miniIcon(iconName, color)}<strong>${label}</strong><span>${time}</span><em class="switch blue on"></em><button type="button" data-action="编辑${label}">${icon("pencil", 18)}</button><button type="button" data-action="删除${label}">${icon("trash-2", 18)}</button></div>`).join("")}
          <button class="business-dashed" type="button" data-action="添加时段">${icon("plus", 18)}添加时段</button>
        </section>
        <section class="card business-hours-card business-holiday-card">
          <h3><span></span>节假日设置</h3>
          ${[
            ["leaf", "端午节", "2025-06-10", "休息", "green", "red"],
            ["cookie", "中秋节", "2025-09-17", "正常营业", "orange", "green"],
          ].map(([iconName, title, date, status, iconColor, statusColor]) => `<div class="business-holiday-row">${miniIcon(iconName, iconColor)}<strong>${title}</strong><span>${date}</span>${chip(status, statusColor)}${icon("chevron-right", 18)}</div>`).join("")}
          <button class="business-dashed" type="button" data-action="添加节假日规则">${icon("plus", 18)}添加节假日规则</button>
        </section>
        <section class="card business-hours-card business-copy-card">
          <h3><span></span>客户展示文案</h3>
          <label><textarea>09:00-21:00 在线接单，节假日请提前预约。</textarea><em>24/100</em></label>
        </section>
        <div class="business-save"><button class="primary-button" type="button" data-action="保存营业时间">保存营业时间</button></div>
      `,
    });
  }

  if (isCity) {
    return frame({
      title: "服务城市选择",
      right: "保存",
      screenClass: "city-select-screen",
      assurance: false,
      content: `
        <label class="city-search">${icon("search", 22)}<input placeholder="搜索城市或区县" /></label>
        <section class="card city-card current-city-card">
          <h3><span></span>当前城市</h3>
          <div>${miniIcon("map-pin", "blue")}<strong>云南省　昆明市</strong><em>当前城市 ${icon("chevron-right", 18)}</em></div>
        </section>
        <section class="card city-card hot-city-card">
          <h3><span></span>热门城市</h3>
          <div>${["昆明市", "弥勒市", "大理市", "丽江市", "西双版纳", "玉溪市"].map((v, i) => `<button class="${i === 0 ? "active" : ""}" type="button" data-action="选择${v}">${v}${i === 0 ? icon("check-circle", 14) : ""}</button>`).join("")}</div>
        </section>
        <section class="card city-card district-card">
          <h3><span></span>选择区县 <small>（可多选）</small></h3>
          ${[
            ["盘龙区", true],
            ["五华区", true],
            ["官渡区", true],
            ["西山区", true],
            ["呈贡区", false],
            ["安宁市", false],
            ["晋宁区", false],
          ].map(([name, checked]) => `<button class="district-row" type="button" data-action="${checked ? "取消" : "选择"}${name}"><span class="${checked ? "checked" : ""}">${checked ? icon("check", 14) : ""}</span><strong>${name}</strong><em>${checked ? "服务中" : "未选择"}</em></button>`).join("")}
        </section>
        <section class="card city-card selected-city-card">
          <h3><span></span>已选服务范围</h3>
          <div class="selected-city-tags">${["昆明市盘龙区", "昆明市五华区", "昆明市官渡区", "昆明市西山区"].map((v) => `<button type="button" data-action="移除${v}">${v} <span>×</span></button>`).join("")}</div>
          <p>${icon("info", 17)}服务城市变更后，新订单匹配将按最新范围生效</p>
        </section>
        <div class="city-select-actions"><button class="secondary-button" type="button" data-action="重置服务城市">重置</button><button class="primary-button" type="button" data-action="确认保存服务城市">${icon("check-circle", 18)}确认保存</button></div>
      `,
    });
  }

  if (isPhotos) {
    const profile = currentMerchantProfile();
    const photos = merchantStorePhotoList(profile);
    const coverPhoto = merchantCoverPhoto(profile);
    return frame({
      title: "门店照片管理",
      right: `<span data-action="保存照片">保存</span>`,
      screenClass: "merchant-photos-screen",
      assurance: false,
      content: `
        <p class="sr-only">门店照片管理页面包含真实门店照片、护理室、营业执照墙、服务人员合照、康复设备、上传照片入口、封面设置、照片要求、取消和保存照片操作，所有照片编辑和上传按钮均可交互。</p>
        <div class="merchant-photo-tip">
          ${icon("info", 18)}
          <span>清晰真实的门店照片可提升客户信任度，最多上传9张</span>
          <button type="button" data-action="关闭照片提示">${icon("x", 18)}</button>
        </div>
        <section class="card merchant-photo-card">
          <div class="merchant-photo-title"><h3>门店照片 / 环境</h3><span>${photos.length}/9</span></div>
          <div class="merchant-photo-grid">
            ${photos.length ? photos.map((photo) => `
              <article class="merchant-photo-item">
                ${renderMerchantPhotoRemoveButton(photo)}
                <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.title)}">
                <footer><span>${escapeHtml(photo.title)}${photo.isCover ? " · 封面" : ""}</span><button type="button" data-action="编辑${escapeHtml(photo.title)}">${icon("pencil", 18)}</button></footer>
              </article>
            `).join("") : `<article class="merchant-photo-empty">${icon("image-off", 28)}<strong>暂无门店照片</strong><span>可通过上传照片补充门店环境</span></article>`}
            <button class="merchant-photo-upload" type="button" data-action="上传照片">
              <span>${icon("camera", 34)}</span>
              <b>上传照片</b>
              <small>最多上传9张</small>
            </button>
          </div>
        </section>
        <section class="card merchant-cover-card">
          <h3>封面设置</h3>
          <div class="merchant-cover-row">
            <div><small>当前封面</small><strong>${coverPhoto ? escapeHtml(coverPhoto.title) : "暂无封面"}</strong></div>
            ${coverPhoto ? `<img src="${escapeHtml(coverPhoto.src)}" alt="${escapeHtml(coverPhoto.title)}">` : `<span class="merchant-cover-empty">${icon("image-off", 22)}</span>`}
            <button type="button" data-action="保存照片">保存照片</button>
          </div>
        </section>
        <section class="card merchant-photo-rules">
          <h3>照片要求</h3>
          ${["照片清晰真实", "不包含客户隐私", "展示门店/设备/资质环境", "支持 JPG/PNG 格式"].map((v) => `<div>${icon("circle-check", 16)}<span>${v}</span></div>`).join("")}
        </section>
        <div class="sticky-action two-actions merchant-photo-actions"><button class="secondary-button" type="button" data-action="取消">取消</button><button class="primary-button" type="button" data-action="保存照片">保存照片</button></div>
      `,
    });
  }

  if (isEdit) {
    const profile = currentMerchantProfile();
    ensureMerchantProfileEditState(profile);
    const onlineAccepting = profile.onlineAccepting ?? merchantOnlineAccepting;
    const onlineTitle = profile.onlineStatus || (onlineAccepting ? "在线接单中" : "暂停接单");
    const onlineDesc = profile.onlineStatusText || (onlineAccepting ? "客户可看到并预约商户服务" : "客户暂时不能预约商户服务");
    const profileStatus = profile.status || "待同步";
    const storePhotos = merchantStorePhotoList(profile);
    const baseFields = [
      { iconName: "building-2", label: "机构名称", field: "name", color: "blue", maxLength: 40 },
      { iconName: "briefcase-business", label: "机构类型", field: "type", color: "green", maxLength: 30 },
      { iconName: "user", label: "联系人", field: "contact", color: "purple", maxLength: 20 },
      { iconName: "phone", label: "联系电话", field: "phone", color: "blue", type: "tel", maxLength: 20 },
      { iconName: "clock", label: "营业时间", field: "businessHours", color: "orange", maxLength: 30 },
      { iconName: "map-pin", label: "服务城市", field: "serviceCity", color: "blue", maxLength: 40 },
      { iconName: "map", label: "门店地址", field: "address", color: "green", maxLength: 80 },
    ];
    const linkRows = [
      ["pencil", "资料编辑", "维护机构基础资料", "blue", "53"],
      ["clock", "营业时间", profile.businessHours || "设置营业时段", "orange", "54"],
      ["map-pin", "服务城市", profile.serviceCity || "设置服务范围", "purple", "55"],
      ["layout-grid", "服务分类", merchantServiceSummary(profile), "green", "31"],
      ["camera", "门店照片", "查看和上传门店环境", "blue", "56"],
      ["shield-check", "认证资质", profileStatus, profileStatus === "已通过" ? "green" : "orange", "03"],
    ];
    return frame({
      title: isReferenceProfile ? "商户资料" : "商户资料编辑",
      right: "保存",
      rightAction: "保存商户资料修改",
      screenClass: `merchant-profile-edit-screen ${isReferenceProfile ? "profile-reference-screen" : ""}`,
      assurance: false,
      content: `
        <span class="sr-only">商户资料编辑页面，包含商户Logo、基础资料、门店简介、资料完整度和保存修改操作。</span>
        <section class="card profile-edit-hero">
          <div class="profile-reference-head">
            <span class="profile-logo"><img src="${assets.logo}" alt="云旅无忧商户端 logo" /></span>
            <div>
              <h2>${escapeHtml(profile.name || "商户资料同步中")} ${chip(`${icon("shield-check", 14)} ${escapeHtml(profileStatus)}`, profileStatus === "已通过" ? "blue" : "orange")}</h2>
              <p>${escapeHtml(merchantServiceSummary(profile))}</p>
            </div>
          </div>
          ${isReferenceProfile ? `
            <button class="profile-online-row" type="button" data-action="在线接单" aria-pressed="${onlineAccepting ? "true" : "false"}">
              <span>${icon(onlineAccepting ? "circle-check" : "circle-pause", 17)}<b data-merchant-online-title>${escapeHtml(onlineTitle)}</b><small data-merchant-online-desc>${escapeHtml(onlineDesc)}</small></span>
              <em class="switch ${onlineAccepting ? "on" : ""}"></em>
            </button>
          ` : `<button type="button" data-action="更换商户Logo">更换LOGO</button>`}
        </section>
        <section class="card profile-edit-card">
          <h3 class="profile-edit-title">基础资料</h3>
          ${baseFields.map(renderMerchantProfileField).join("")}
        </section>
        <section class="card profile-edit-card">
          <h3 class="profile-edit-title">关联功能</h3>
          ${linkRows.map(renderMerchantProfileLinkRow).join("")}
        </section>
        <section class="card profile-edit-card">
          <h3 class="profile-edit-title">门店简介</h3>
          ${renderMerchantProfileField({ iconName: "text", label: "简介", field: "intro", color: "purple", multiline: true, maxLength: 200 })}
        </section>
        ${isReferenceProfile ? `
        <section class="card profile-edit-card profile-photo-card">
          <h3 class="profile-edit-title">门店照片 / 环境</h3>
          <div class="profile-photo-strip">
            ${storePhotos.slice(0, 3).map((photo) => `
              <figure>
                ${renderMerchantPhotoRemoveButton(photo, "profile-photo-remove")}
                <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.title)}">
                <figcaption>${escapeHtml(photo.title)}</figcaption>
              </figure>
            `).join("")}
            ${storePhotos.length ? "" : `<span class="profile-photo-empty">${icon("image-off", 22)}暂无照片</span>`}
            <button type="button" data-action="上传门店照片">${icon("camera", 28)}<span>上传照片</span></button>
          </div>
        </section>
        ` : ""}
        <section class="card profile-edit-card profile-progress-card">
          <h3 class="profile-edit-title">资料完整度</h3>
          <div><span><i></i></span><strong>${merchantProfileCompletionPercent()}%</strong></div>
          <p>完善资料可提升客户信任度</p>
        </section>
        <div class="profile-edit-save"><button class="primary-button" type="button" data-action="保存商户资料修改">保存修改</button></div>
      `,
    });
  }

  return frame({
    title: isEdit ? "商户资料编辑" : "商户资料",
    right: isEdit ? "保存" : "编辑",
    content: `
      <section class="card merchant-card">
        <div class="merchant-head">
          <span class="logo-mark"><img src="${assets.logo}" alt="云旅无忧商户端 logo" /></span>
          <div><h2>云康护理中心</h2><p>居家护理 / 陪诊服务 / 康复理疗</p></div>
          ${chip("已认证", "green")}
        </div>
      </section>
      <section class="card form-section">
        <h3 class="section-title">基础信息</h3>
        ${field("机构名称", "云康护理中心", { required: isEdit, suffix: isEdit ? "" : icon("chevron-right", 18) })}
        ${field("机构类型", "康养护理机构", { required: isEdit })}
        ${field("联系人", "李奶奶", { required: isEdit, suffix: "" })}
        ${field("联系电话", "138 8888 8888", { required: isEdit, suffix: "" })}
        ${field("所在城市", "云南省　昆明市", { required: isEdit })}
        ${field("详细地址", "昆明市盘龙区穿金路88号云旅大厦15楼", { required: isEdit, suffix: "" })}
      </section>
      <section class="card form-section">
        <h3 class="section-title">经营信息</h3>
        ${field("营业时间", "09:00-21:00", { required: isEdit })}
        ${field("服务范围", "盘龙区、五华区、官渡区、西山区", { required: isEdit })}
        ${field("门店简介", "专业护理团队，提供居家护理、陪诊与康复理疗服务。", { required: isEdit, suffix: "28/200" })}
      </section>
      <section class="card form-section">
        <h3 class="section-title">门店照片</h3>
        <div class="photo-grid">${[assets.storeRoom, assets.storeFront, assets.storeWall].map((src) => `<span class="photo-tile"><img src="${src}" alt="门店照片" /></span>`).join("")}</div>
      </section>
      ${isEdit ? `<div class="sticky-action"><button class="primary-button">保存修改</button></div>` : ""}
    `,
  });
}

function renderCert(screen) {
  const update = screen.id === "57";
  const record = screen.id === "58";
  if (screen.id === "03") {
    const state = merchantRealPageState.qualification;
    const qualification = state.data || {
      status: "已认证",
      headline: "平台审核通过，可正常上架服务",
      subject: currentMerchantProfile().name || "云康护理中心",
      certifiedAt: "2025-05-18",
      validUntil: "2027-05-17",
      files: [
        { id: "business-license", label: "营业执照", src: assets.certId, status: "已通过" },
        { id: "service-certificate", label: "服务资质证书", src: assets.certLicense, status: "已通过" },
        { id: "store-photos", label: "门店 / 机构照片", src: assets.certDoor, status: "已通过", route: "56" },
      ],
      auditRecords: [
        { title: "提交资料", desc: "商户提交认证资料", time: "05-16  10:20", color: "blue" },
        { title: "平台初审", desc: "平台进行资料初步审核", time: "05-17  14:35", color: "blue" },
        { title: "认证通过", desc: "平台审核通过，资质生效", time: "05-18  09:12", color: "green" },
      ],
      serviceTypes: [
        { label: "医疗卫生", active: true },
        { label: "康养护理", active: true },
        { label: "家政生活", active: true },
        { label: "交通出行", active: false },
        { label: "文旅体验", active: false },
        { label: "餐饮生活", active: false },
      ],
    };
    const certFiles = qualification.files || [];
    const auditItems = qualification.auditRecords || [];
    const serviceTypes = qualification.serviceTypes || [];
    const selectedCertFile = certFiles.find((file) => String(file.id || file.label || "") === state.previewFileId) || null;
    const renderCertFile = (file) => {
      const fileId = String(file.id || file.label || "");
      const image = `
        <span class="cert-file-image"><img src="${escapeHtml(file.src || assets.certId)}" alt="${escapeHtml(file.label || "资质文件")}" />${chip(file.status || "已通过", "green")}</span>
        <strong>${escapeHtml(file.label || "资质文件")}</strong>
        <em>查看 ${icon("chevron-right", 18)}</em>
      `;
      if (file.route) {
        return `<button class="cert-file-card" type="button" data-go="${escapeHtml(file.route)}" data-merchant-cert-file="${escapeHtml(fileId)}">${image}</button>`;
      }
      return `<button class="cert-file-card ${selectedCertFile?.id === file.id ? "active" : ""}" type="button" data-merchant-cert-preview="${escapeHtml(fileId)}">${image}</button>`;
    };
    return frame({
      title: "认证资质",
      right: "更新记录",
      rightGo: "58",
      screenClass: "merchant-cert-screen",
      content: `
        ${merchantApiPanel(state, "认证资质")}
        <section class="card cert-hero-card">
          <span class="cert-main-icon">${icon("check", 56)}</span>
          <div class="cert-hero-copy">
            <h2>${escapeHtml(qualification.status || "已认证")}</h2>
            <p>${escapeHtml(qualification.headline || "平台审核通过，可正常上架服务")}</p>
            <div class="cert-info-box">
              <p>${icon("building-2", 18)}<span>认证主体：</span><strong>${escapeHtml(qualification.subject || "商户主体")}</strong></p>
              <p>${icon("clock", 18)}<span>认证时间：</span><strong>${escapeHtml(qualification.certifiedAt || "-")}</strong></p>
              <p>${icon("calendar-days", 18)}<span>有效期至：</span><strong>${escapeHtml(qualification.validUntil || "-")}</strong></p>
            </div>
          </div>
          <span class="cert-watermark" aria-hidden="true">${icon("shield-check", 140)}</span>
        </section>
        <section class="card cert-section cert-files-card">
          <h3 class="cert-section-title">资质文件</h3>
          <div class="cert-file-grid">
            ${certFiles.map(renderCertFile).join("")}
          </div>
        </section>
        ${selectedCertFile ? `
          <section class="card cert-section cert-preview-card" data-merchant-cert-preview-panel>
            <header>
              <h3 class="cert-section-title">${escapeHtml(selectedCertFile.label || "资质文件")}预览</h3>
              <button type="button" data-merchant-cert-preview-close aria-label="关闭资质预览">${icon("x", 18)}</button>
            </header>
            <figure>
              <img src="${escapeHtml(selectedCertFile.src || assets.certId)}" alt="${escapeHtml(selectedCertFile.label || "资质文件")}预览" />
              <figcaption>${chip(selectedCertFile.status || "已通过", "green")}<span>资质资料已更新</span></figcaption>
            </figure>
          </section>
        ` : ""}
        <section class="card cert-section cert-audit-card">
          <h3 class="cert-section-title">审核记录</h3>
          <div class="cert-audit-list">
            ${auditItems.map((item) => `
              <div class="cert-audit-row ${escapeHtml(item.color || "blue")}">
                <span>${icon("check", 18)}</span>
                <strong>${escapeHtml(item.title || "审核记录")}</strong>
                <em>${escapeHtml(item.desc || "")}</em>
                <time>${escapeHtml(item.time || "")}</time>
              </div>
            `).join("")}
          </div>
        </section>
        <section class="card cert-section cert-service-card">
          <h3 class="cert-section-title">可服务类型</h3>
          <div class="cert-type-grid">
            ${serviceTypes.map((item) => `
              <button type="button" class="${item.active ? "active" : ""}" data-go="${item.active ? "31" : "57"}">
                <span>${escapeHtml(item.label || "服务类型")}</span>${item.active ? icon("check", 17) : ""}
              </button>
            `).join("")}
          </div>
          <div class="cert-flow-links">
            <button type="button" data-go="21">查看入驻认证流程</button>
            <button type="button" data-go="70">查看驳回资料处理</button>
          </div>
        </section>
        <div class="sticky-action cert-actions two-actions">
          <button class="secondary-button" type="button" data-go="09">${icon("headphones", 22)}联系客服</button>
          <button class="primary-button" type="button" data-go="57">更新资质资料</button>
        </div>
      `,
    });
  }

  if (record) {
    const records = [
      {
        icon: "clipboard-list",
        tone: "green",
        title: "证件到期续期",
        tag: "更新",
        status: "已通过",
        statusTone: "green",
        action: "查看详情",
        lines: [
          ["check", "提交时间", "2025-05-16  10:20", "green"],
          ["check", "审核通过", "2025-05-18  09:12", "green"],
          ["check", "更新内容", "营业执照、服务资质证书", "green"],
        ],
      },
      {
        icon: "store",
        tone: "blue",
        title: "门店照片更新",
        tag: "更新",
        status: "已通过",
        statusTone: "green",
        action: "查看详情",
        lines: [
          ["check", "提交时间", "2025-04-12  14:30", "green"],
          ["check", "审核通过", "2025-04-13  11:05", "green"],
          ["check", "更新内容", "门店照片、环境照片", "green"],
        ],
      },
      {
        icon: "map-pin",
        tone: "orange",
        title: "服务范围变更",
        tag: "更新",
        status: "未通过",
        statusTone: "red",
        action: "重新提交",
        lines: [
          ["check", "提交时间", "2025-03-28  09:45", "green"],
          ["x", "审核驳回", "2025-03-29  16:20", "red"],
          ["", "驳回原因", "资料与营业执照经营范围不一致", "red-text"],
        ],
      },
    ];
    const processSteps = [
      ["file-up", "1", "提交资料", "商户提交更新资料"],
      ["search", "2", "平台初审", "平台进行资料初审"],
      ["shield-check", "3", "资质复核", "人工复核资质文件"],
      ["bell", "4", "结果通知", "审核结果消息通知"],
    ];
    return frame({
      title: "资质更新记录",
      right: "筛选",
      rightGo: "58",
      screenClass: "cert-record-screen",
      content: `
        ${tabs(["全部", "审核中", "已通过", "未通过"], 0)}
        <section class="card cert-record-summary">
          <div class="cert-record-summary-main">
            <span class="cert-record-shield">${icon("check", 42)}</span>
            <div>
              <small>当前认证</small>
              <strong>已认证</strong>
              <p>认证主体<br />云康护理中心</p>
            </div>
          </div>
          <div class="cert-record-summary-col">
            <small>有效期至</small>
            <strong>2027-05-17</strong>
            <p>剩余 <em>732</em> 天</p>
          </div>
          <div class="cert-record-summary-col">
            <small>最近更新</small>
            <strong>2025-05-18</strong>
            <p>证件到期续期</p>
          </div>
        </section>
        <section class="cert-record-list">
          ${records.map((record) => `
            <article class="card cert-record-item">
              <span class="cert-record-icon ${record.tone}">${icon(record.icon, 30)}</span>
              <div class="cert-record-card-body">
                <header>
                  <div>
                    <strong>${record.title}</strong>
                    <em>${record.tag}</em>
                  </div>
                  <span class="cert-record-status ${record.statusTone}">${record.status}</span>
                  ${icon("chevron-right", 22)}
                </header>
                <div class="cert-record-line-list">
                  ${record.lines.map(([iconName, label, value, tone]) => `
                    <p class="${tone}">
                      <span>${iconName ? icon(iconName, 14) : ""}</span>
                      <b>${label}</b>
                      <em>${value}</em>
                    </p>
                  `).join("")}
                </div>
                <button type="button" data-action="${record.action}：${record.title}">${record.action}</button>
              </div>
            </article>
          `).join("")}
        </section>
        <section class="card cert-record-guide">
          <h3>审核说明</h3>
          <div class="cert-record-process">
            ${processSteps.map(([iconName, number, title, desc]) => `
              <div>
                <span>${icon(iconName, 26)}<b>${number}</b></span>
                <strong>${title}</strong>
                <p>${desc}</p>
              </div>
            `).join("")}
          </div>
          <p class="cert-record-info">${icon("info", 18)}审核时间一般为 1-3 个工作日，请耐心等待结果通知</p>
        </section>
      `,
    });
  }

  if (update) {
    const uploadRows = [
      ["clipboard-list", "营业执照", "当前状态：", "已上传", "重新上传", "blue"],
      ["award", "服务资质证书", "当前状态：", "已上传", "重新上传", "blue"],
      ["store", "门店 / 机构照片", "当前状态：", "已上传", "重新上传", "blue"],
      ["folder", "其他补充证明（选填）", "支持 JPG/PNG 格式，单张不超过 10MB", "", "上传文件", "gray"],
    ];
    const reasons = ["证件到期续期", "经营范围变更", "门店地址变更", "资质补充", "其他原因"];
    return frame({
      title: "认证资质更新",
      right: "更新记录",
      rightGo: "58",
      screenClass: "cert-update-screen",
      content: `
        <section class="cert-update-alert">
          ${icon("info", 22)}
          <span>资质更新需平台重新审核，审核期间当前资质仍有效</span>
          <button type="button" data-action="关闭资质更新提示">${icon("x", 22)}</button>
        </section>
        <section class="card cert-update-status">
          <h3 class="cert-update-title">当前认证状态</h3>
          <div class="cert-update-status-body">
            <span class="cert-update-shield">${icon("check", 54)}</span>
            <div class="cert-update-status-copy">
              <strong>已认证</strong>
              <p>${icon("clock", 20)}<span>有效期至&nbsp;&nbsp;2027-05-17</span></p>
              <p>${icon("building-2", 20)}<span>认证主体&nbsp;&nbsp;云康护理中心</span></p>
            </div>
            <span class="cert-update-watermark" aria-hidden="true">${icon("shield-check", 150)}</span>
          </div>
        </section>
        <section class="card cert-update-card cert-update-files">
          <h3 class="cert-update-title">更新资料</h3>
          <div class="cert-update-file-list">
            ${uploadRows.map(([iconName, title, prefix, state, action, tone]) => `
              <div class="cert-update-file-row">
                <span class="cert-update-file-icon ${tone}">${icon(iconName, 30)}</span>
                <div>
                  <strong>${title}</strong>
                  <p>${prefix}${state ? `<em>${state}</em>` : ""}</p>
                </div>
                <button class="${tone === "gray" ? "cert-update-dashed" : ""}" type="button" data-action="${action}${title}">${tone === "gray" ? icon("plus", 24) : ""}${action}</button>
              </div>
            `).join("")}
          </div>
        </section>
        <section class="card cert-update-card cert-update-reason">
          <h3 class="cert-update-title">更新原因</h3>
          <div class="cert-update-reason-grid">
            ${reasons.map((reason, index) => `
              <button class="${index === 0 ? "active" : ""}" type="button" data-action="选择更新原因：${reason}">
                <span>${reason}</span>${index === 0 ? icon("check", 18) : ""}
              </button>
            `).join("")}
          </div>
        </section>
        <section class="card cert-update-card cert-update-note">
          <h3 class="cert-update-title">备注说明 <small>（选填）</small></h3>
          <label>
            <textarea aria-label="备注说明" placeholder="请说明本次更新内容..." maxlength="200"></textarea>
            <span>0/200</span>
          </label>
        </section>
        <div class="sticky-action cert-update-actions two-actions">
          <button class="secondary-button" type="button" data-go="03">取消</button>
          <button class="primary-button" type="button" data-action="提交更新审核">提交更新审核</button>
        </div>
      `,
    });
  }

  return frame({
    title: update ? "认证资质更新" : "认证资质",
    right: update ? "更新记录" : "更新资质",
    content: `
      <section class="card section-card">
        <div class="detail-hero">
          <span class="state-icon green">${icon("shield-check", 40)}</span>
          <div><h2>已认证</h2><p>平台已完成主体资质审核，认证有效期至 2027-06-17。</p></div>
        </div>
      </section>
      <section class="card form-section">
        <h3 class="section-title">${update ? "更新资料" : "认证资料"}</h3>
        <div class="upload-grid">
          ${[
            [assets.certId, "营业执照"],
            [assets.certLicense, "服务资质证书"],
            [assets.certDoor, "门店 / 机构照片"],
          ]
            .map(([src, label]) => `<span class="photo-tile"><img src="${src}" alt="${label}" /></span>`)
            .join("")}
          ${update ? `<button class="upload-tile">${icon("plus", 22)}上传新资质</button><button class="upload-tile">${icon("camera", 22)}补充照片</button>` : ""}
        </div>
      </section>
      <section class="card form-section">
        <h3 class="section-title">审核记录</h3>
        <div class="timeline">
          <div class="timeline-item"><strong>认证通过</strong><br />2026-05-18 10:32　平台审核完成</div>
          <div class="timeline-item"><strong>资料提交</strong><br />2026-05-17 16:20　商户提交资质</div>
          <div class="timeline-item"><strong>基础信息完成</strong><br />2026-05-17 15:42</div>
        </div>
      </section>
      ${update ? `<div class="sticky-action two-actions"><button class="secondary-button">取消</button><button class="primary-button">提交更新审核</button></div>` : ""}
    `,
  });
}

function renderRegister(screen) {
  const id = screen.id;
  if (id === "69" || id === "70") {
    const rejected = id === "70";
    const reasons = [
      "营业执照照片不清晰",
      "服务资质证书有效期信息缺失",
      "门店照片未展示机构名称",
    ];
    const infoRows = rejected
      ? [
          ["building-2", "机构名称", "云康护理中心"],
          ["clock", "提交时间", "2025-05-20 10:20"],
          ["calendar-days", "审核时间", "2025-05-21 15:35"],
        ]
      : [
          ["building-2", "机构名称", "云康护理中心"],
          ["clock", "提交时间", "2025-05-20 10:20"],
          ["layout-grid", "服务类型", "医疗卫生、康养护理、家政生活"],
          ["user", "联系人", "李奶奶　138 8888 8888"],
        ];
    return frame({
      title: rejected ? "审核未通过" : "入驻审核中",
      right: `${icon("headphones", 18)} 联系客服`,
      rightGo: "09",
      screenClass: `register-screen ${rejected ? "register-rejected" : "register-reviewing"}`,
      assurance: false,
      content: `
        ${rejected ? `<span class="sr-only">商户入驻审核驳回页面，包含驳回原因、提交信息、整改建议、联系客服和重新提交资料操作。</span>` : `<span class="sr-only">商户入驻审核中页面，包含提交信息、审核进度、可操作事项和返回登录操作。</span>`}
        <section class="card success-state merchant-review-hero">
          <img class="review-illustration" src="${rejected ? assets.reviewRejected : assets.reviewPending}" alt="" />
          <h2>${rejected ? "入驻审核未通过" : "资料已提交，等待平台审核"}</h2>
          <p class="muted">${rejected ? "请根据驳回原因修改资料后重新提交" : "预计 1-3 个工作日内完成审核，请保持联系电话畅通"}</p>
          ${chip(`${icon(rejected ? "circle-alert" : "clock", 15)}${rejected ? "未通过" : "审核中"}`, rejected ? "orange" : "blue")}
        </section>
        ${rejected ? `
          <section class="card form-section merchant-reason-card">
            <h3 class="section-title">驳回原因</h3>
            ${reasons.map((v, index) => `<button class="list-row merchant-reason-row" type="button" data-action="查看驳回原因：${v}"><span class="reason-num">${index + 1}</span><div><div class="title">${v}</div></div>${icon("chevron-right", 18)}</button>`).join("")}
          </section>
        ` : ""}
        <section class="card form-section">
          <h3 class="section-title">提交信息</h3>
          ${infoRows.map(([iconName, label, value]) => `<div class="list-row merchant-info-row">${miniIcon(iconName, "blue")}<span>${label}</span><strong>${value}</strong></div>`).join("")}
        </section>
        ${rejected ? `
          <section class="card form-section merchant-fix-card">
            <h3 class="section-title">整改建议</h3>
            ${["重新上传清晰营业执照", "补充有效资质证书", "上传门店正面照片或前台照片"].map((v) => `<div class="list-row">${miniIcon("circle-check", "orange")}<div><div class="title">${v}</div></div></div>`).join("")}
          </section>
        ` : `
          <section class="card form-section merchant-progress-card">
            <h3 class="section-title">审核进度</h3>
            ${[
              ["提交资料", "已完成", "2025-05-20 10:20", "done"],
              ["平台初审", "进行中", "审核中", "active"],
              ["资质复核", "待开始", "预计1-2个工作日", "pending"],
              ["审核结果", "待通知", "预计1-3个工作日", "pending"],
            ].map(([title, status, time, state], index) => `<div class="progress-step ${state}"><b>${state === "done" ? icon("check", 14) : ""}</b><div><strong>${title}</strong><span>${status}</span></div><em>${time}</em></div>`).join("")}
          </section>
          <section class="card form-section merchant-action-card">
            <h3 class="section-title">可操作事项</h3>
            <div class="register-mini-actions"><button class="secondary-button" type="button" data-go="27">${icon("folder-open", 18)}<span>查看提交资料</span>${icon("chevron-right", 14)}</button><button class="secondary-button" type="button" data-action="修改联系电话">${icon("phone", 18)}<span>修改联系电话</span>${icon("chevron-right", 14)}</button><button class="secondary-button" type="button" data-action="联系客服">${icon("headphones", 18)}<span>联系客服</span>${icon("chevron-right", 14)}</button></div>
          </section>
        `}
        <div class="sticky-action ${rejected ? "two-actions" : "register-single-action"}">
          ${rejected ? `<button class="secondary-button" type="button" data-action="联系客服">${icon("headphones", 18)}联系客服</button>` : ""}
          <button class="primary-button" type="button" data-go="${rejected ? "27" : "67"}">${rejected ? "重新提交资料" : "返回登录"}</button>
        </div>
      `,
    });
  }

  if (id === "21") {
    const registerSteps = [
      ["1", "基础信息", "填写基本信息", "active"],
      ["2", "资质上传", "上传相关资质", ""],
      ["3", "服务类型", "选择服务类型", ""],
      ["4", "提交审核", "等待平台审核", ""],
    ];
    const basicRows = [
      ["机构名称", "云康护理中心", ""],
      ["服务类别", "医疗卫生、康养护理、家政生活", "28"],
      ["联系人", "李奶奶", ""],
      ["联系电话", "138 8888 8888", ""],
      ["所在城市", "云南省　昆明市", "55"],
      ["详细地址", "昆明市盘龙区学府路 88 号 客户家中", ""],
    ];
    const uploadItems = [
      ["file-badge", "营业执照", "上传营业执照"],
      ["award", "服务资质证书", "上传服务资质证书"],
      ["store", "门店/机构照片", "上传门店或机构照片"],
    ];
    const serviceTypes = ["医疗卫生", "康养护理", "家政生活", "交通出行", "文旅体验", "餐饮生活"];

    return frame({
      title: "商户入驻 / 资质认证",
      right: "入驻指南",
      rightGo: "66",
      screenClass: "merchant-register-cert-screen",
      assurance: false,
      content: `
        <span class="sr-only">商户入驻资质认证页面，包含基础信息、资质上传、服务类型多选、提交审核和联系客服入口。所有资料行、上传卡片、服务类型和提交审核按钮均可点击。</span>
        <section class="merchant-cert-stepper" aria-label="商户入驻步骤">
          ${registerSteps.map(([num, label, desc, state], index) => `
            <button class="merchant-cert-step ${state}" type="button" data-go="${String(26 + index).padStart(2, "0")}">
              <b>${num}</b>
              <strong>${label}</strong>
              <span>${desc}</span>
            </button>
          `).join("")}
        </section>

        <section class="card merchant-cert-card merchant-basic-card">
          <h3 class="merchant-cert-title">基础信息</h3>
          <div class="merchant-basic-list">
            ${basicRows.map(([label, value, go]) => go
              ? `<button class="merchant-basic-row" type="button" data-go="${go}"><span>${label}</span><strong>${value}</strong>${icon("chevron-right", 18)}</button>`
              : `<div class="merchant-basic-row"><span>${label}</span><strong>${value}</strong></div>`
            ).join("")}
          </div>
        </section>

        <section class="card merchant-cert-card merchant-upload-card">
          <h3 class="merchant-cert-title">资质上传</h3>
          <p>请上传清晰、有效的证件照片，支持 JPG/PNG 格式，大小不超过 10MB</p>
          <div class="merchant-cert-upload-grid">
            ${uploadItems.map(([iconName, title, desc]) => `
              <button class="merchant-cert-upload" type="button" data-action="${desc}">
                <span>${icon(iconName, 50)}</span>
                <i>${icon("plus", 20)}</i>
                <strong>${title}</strong>
                <em>${desc}</em>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="card merchant-cert-card merchant-service-type-card">
          <h3 class="merchant-cert-title">选择服务类型 <small>（可多选）</small></h3>
          <div class="merchant-service-type-grid">
            ${serviceTypes.map((label, index) => `
              <button class="${index < 3 ? "active" : ""}" type="button" data-action="${index < 3 ? "取消选择" : "选择"}${label}">
                ${index < 3 ? icon("circle-check", 17) : ""}<span>${label}</span>
              </button>
            `).join("")}
          </div>
          <div class="merchant-cert-tip">${icon("info", 17)}<span>审核通过后才能上架服务，服务类型将用于展示与匹配客户需求</span></div>
        </section>

        <button class="primary-button merchant-cert-submit" type="button" data-go="29">提交审核</button>
        <section class="merchant-cert-note">
          <button type="button" data-action="查看审核时间说明">${icon("clock", 18)}<span>审核时间：平台将在 1-3 个工作日内完成审核，请耐心等待</span></button>
          <button type="button" data-go="09">${icon("headphones", 18)}<span>有问题？联系客服 400-888-1234（9:00-18:00）</span></button>
        </section>
      `,
    });
  }

  if (id === "27") {
    const requiredUploads = [
      ["营业执照", "上传营业执照", true],
      ["服务资质证书", "上传服务资质证书", false],
      ["门店/机构照片", "上传门店或机构照片", false],
    ];
    const extraUploads = [
      ["医护人员执业证明", "上传医护人员执业证明"],
      ["场地安全证明", "上传场地安全证明"],
      ["其他证明", "上传其他证明材料"],
    ];

    return frame({
      title: "商户入驻 / 资质上传",
      right: "入驻指南",
      rightGo: "66",
      screenClass: "register-upload-screen",
      assurance: false,
      content: `
        <span class="sr-only">商户入驻资质上传页面，包含必传资质、补充材料、审核说明、上一步和下一步操作。上传卡片和查看营业执照均可点击。</span>
        ${stepper(2)}
        <div class="register-upload-tip">${icon("info", 17)}<span>请上传清晰、有效的资质文件，支持 JPG/PNG，单张不超过10MB</span></div>
        <section class="card register-upload-card">
          <h3 class="register-section-title">必传资质</h3>
          <div class="register-upload-columns">
            ${requiredUploads.map(([title, desc, done]) => `
              <article class="register-upload-box ${done ? "uploaded" : ""}">
                <h4>${title} <em>*</em></h4>
                ${done ? `
                  <button class="register-license-preview" type="button" data-action="查看营业执照">
                    <img src="${assets.registerLicense}" alt="营业执照" />
                    <span>${icon("circle-check", 14)}已上传</span>
                    <strong>查看</strong>
                  </button>
                ` : `
                  <button class="register-empty-upload" type="button" data-action="${desc}">
                    <i>${icon("plus", 28)}</i>
                    <strong>${desc}</strong>
                    <span>支持 JPG/PNG</span>
                  </button>
                `}
              </article>
            `).join("")}
          </div>
        </section>
        <section class="card register-upload-card">
          <h3 class="register-section-title">补充材料 <small>（选填）</small></h3>
          <div class="register-upload-columns">
            ${extraUploads.map(([title, desc]) => `
              <article class="register-upload-box optional">
                <h4>${title}</h4>
                <button class="register-empty-upload" type="button" data-action="${desc}">
                  <i>${icon("plus", 28)}</i>
                  <strong>${desc}</strong>
                  <span>支持 JPG/PNG</span>
                </button>
              </article>
            `).join("")}
          </div>
        </section>
        <section class="card register-review-rules">
          <h3 class="register-section-title">审核说明</h3>
          ${["信息真实有效，提交虚假资料将无法通过审核", "证件需在有效期内，过期证件请及时更新", "照片内容清晰完整，确保证件信息可识别、无遮挡"].map((text) => `<div>${icon("circle-check", 20)}<span>${text}</span></div>`).join("")}
        </section>
        <div class="sticky-action register-flow-actions two-actions">
          <button class="secondary-button" type="button" data-go="26">上一步</button>
          <button class="primary-button" type="button" data-go="28">下一步：选择服务类型</button>
        </div>
      `,
    });
  }

  if (id === "28") {
    const categories = ["医疗卫生", "康养护理", "家政生活", "交通出行", "文旅体验", "餐饮生活", "殡葬服务"];
    const tags = ["居家护理", "陪诊预约", "康复理疗", "慢病管理", "上门护理", "营养指导"];
    const areas = ["昆明市盘龙区", "五华区", "官渡区", "西山区"];

    return frame({
      title: "商户入驻 / 服务类型",
      right: "入驻指南",
      rightGo: "66",
      screenClass: "register-service-type-screen",
      assurance: false,
      content: `
        <span class="sr-only">商户入驻服务类型页面，包含服务大类、服务能力标签、服务区域、提示信息、上一步和提交审核入口。服务类型、标签和区域均可点击并记录到审核资料。</span>
        ${stepper(3)}
        <section class="card register-service-card">
          <h3 class="register-section-title">选择服务大类 <small>（可多选）</small></h3>
          <div class="register-choice-grid">
            ${categories.map((label, index) => `<button class="${index < 3 ? "active" : ""}" type="button" data-action="${index < 3 ? "取消选择" : "选择"}${label}"><span>${label}</span>${index < 3 ? icon("circle-check", 18) : ""}</button>`).join("")}
          </div>
        </section>
        <section class="card register-service-card">
          <h3 class="register-section-title">服务能力标签 <small>（可多选）</small></h3>
          <div class="register-choice-grid">
            ${tags.map((label) => `<button class="active" type="button" data-action="取消选择${label}"><span>${label}</span>${icon("circle-check", 18)}</button>`).join("")}
            <button class="add" type="button" data-action="添加服务能力标签">${icon("plus", 18)}<span>添加标签</span></button>
          </div>
        </section>
        <section class="card register-service-card register-area-card">
          <h3 class="register-section-title">服务区域</h3>
          ${areas.map((area) => `<button type="button" data-go="33"><span>${area}</span><strong>已选中</strong>${icon("chevron-right", 18)}</button>`).join("")}
        </section>
        <div class="register-service-tip">${icon("info", 17)}<span>审核通过后，服务类型将用于用户端展示与订单匹配</span></div>
        <div class="sticky-action register-flow-actions two-actions">
          <button class="secondary-button" type="button" data-go="27">上一步</button>
          <button class="primary-button" type="button" data-go="29">下一步：提交审核</button>
        </div>
      `,
    });
  }

  if (id === "29") {
    const confirmRows = [
      ["building-2", "机构名称", "云康护理中心", "blue"],
      ["user", "联系人", "李奶奶　138 8888 8888", "purple"],
      ["layout-grid", "服务类型", "医疗卫生、康养护理、家政生活", "green"],
      ["file-text", "资质文件", "营业执照、服务资质证书、门店照片", "orange"],
    ];
    const flow = [
      ["send", "1. 提交资料", "当前步骤", "active"],
      ["clipboard-search", "2. 平台初审", "1个工作日内", ""],
      ["shield-check", "3. 资质复核", "1-2个工作日内", ""],
      ["circle-check", "4. 审核通过", "短信通知结果", "done"],
    ];

    return frame({
      title: "商户入驻 / 提交审核",
      right: "入驻指南",
      rightGo: "66",
      screenClass: "register-submit-screen",
      assurance: false,
      content: `
        <span class="sr-only">商户入驻提交审核页面，包含资料校验通过提示、审核资料确认、审核流程、返回修改、确认提交审核和联系客服入口。</span>
        ${stepper(4)}
        <section class="card register-submit-hero">
          <img src="${assets.registerReady}" alt="" />
          <div>
            <h2>资料校验通过</h2>
            <p>提交后平台将在1-3个工作日内完成审核</p>
            <div>${["信息完整", "资质齐全", "符合规范"].map((text) => `<span>${icon("circle-check", 17)}${text}</span>`).join("")}</div>
          </div>
        </section>
        <section class="card register-submit-card">
          <h3 class="register-section-title">审核资料确认</h3>
          ${confirmRows.map(([iconName, label, value, color]) => `<div class="register-submit-row">${miniIcon(iconName, color)}<span>${label}</span><strong>${value}</strong></div>`).join("")}
        </section>
        <section class="card register-submit-card register-audit-flow">
          <h3 class="register-section-title">审核流程</h3>
          <div>
            ${flow.map(([iconName, title, sub, state]) => `<button class="${state}" type="button" data-action="查看审核节点：${title}"><i>${icon(iconName, 26)}</i><strong>${title}</strong><span>${sub}</span></button>`).join("")}
          </div>
        </section>
        <div class="sticky-action register-flow-actions two-actions">
          <button class="secondary-button" type="button" data-go="28">返回修改</button>
          <button class="primary-button" type="button" data-go="69">确认提交审核</button>
        </div>
        <button class="register-submit-support" type="button" data-go="09">${icon("headphones", 24)}有问题？ 联系客服 <strong>400-888-1234</strong></button>
      `,
    });
  }

  const step = id === "26" ? 1 : id === "27" ? 2 : id === "28" ? 3 : 4;
  const title = id === "21" ? "商户入驻 / 资质认证" : screen.title.replace(":", " / ");
  let body = "";

  if (step === 1) {
    body = `
      <section class="card form-section">
        <h3 class="section-title">机构信息</h3>
        ${field("机构名称", "云康护理中心", { required: true, suffix: "" })}
        ${field("机构类型", "康养护理机构", { required: true })}
        ${field("联系人", "李奶奶", { required: true, suffix: "" })}
        ${field("联系电话", "138 8888 8888", { required: true, suffix: "" })}
        ${field("所在城市", "云南省　昆明市", { required: true })}
        ${field("详细地址", "昆明市盘龙区穿金路88号云旅大厦15楼", { required: true, suffix: "" })}
      </section>
      <section class="card form-section">
        <h3 class="section-title">经营信息</h3>
        ${field("营业时间", "09:00-21:00", { required: true })}
        ${field("服务范围", "昆明市盘龙区、五华区、官渡区、西山区", { required: true })}
        ${field("门店简介", "专业护理团队，提供居家护理、陪诊与康复理疗服务。", { required: true, suffix: "28/200" })}
      </section>
    `;
  } else if (step === 2) {
    body = `
      <section class="card form-section">
        <h3 class="section-title">上传资质</h3>
        <div class="upload-grid">
          <span class="photo-tile"><img src="${assets.certId}" alt="营业执照" /></span>
          <button class="upload-tile">${icon("plus", 22)}服务资质证书</button>
          <button class="upload-tile">${icon("plus", 22)}门店/机构照片</button>
        </div>
      </section>
      <section class="card form-section">
        <h3 class="section-title">补充材料</h3>
        <div class="upload-grid">
          <button class="upload-tile">${icon("plus", 22)}法人身份证</button>
          <button class="upload-tile">${icon("plus", 22)}护理员证书</button>
          <button class="upload-tile">${icon("plus", 22)}授权合同</button>
        </div>
      </section>
    `;
  } else if (step === 3) {
    body = `
      <section class="card form-section">
        <h3 class="section-title">选择服务大类（可多选）</h3>
        <div class="selector-grid">
          ${[
            ["居家护理", "heart-pulse"],
            ["陪诊服务", "stethoscope"],
            ["康复理疗", "activity"],
            ["母婴护理", "baby"],
            ["接送站", "car-front"],
            ["其他服务", "plus"],
          ]
            .map(([label, iconName], index) => `<button class="choice ${index < 3 ? "active" : ""}">${icon(iconName, 22)}${label}</button>`)
            .join("")}
        </div>
      </section>
      <section class="card form-section">
        <h3 class="section-title">服务能力信息</h3>
        ${field("服务城市", "昆明市", { required: true })}
        ${field("服务半径", "20km", { required: true })}
        ${field("接单模式", "自动接单 + 人工确认", { required: true })}
      </section>
    `;
  } else {
    body = `
      <section class="card success-state">
        <span class="state-icon blue">${icon("briefcase-business", 42)}</span>
        <h2>资料校验通过</h2>
        <p class="muted">提交后平台将在 1-2 个工作日内完成资质审核。</p>
      </section>
      <section class="card form-section">
        <h3 class="section-title">资料确认</h3>
        ${field("机构名称", "云康护理中心", { suffix: chip("已填写", "green") })}
        ${field("资质资料", "营业执照、服务资质、门店照片", { suffix: chip("已上传", "green") })}
        ${field("服务类型", "居家护理、陪诊、康复理疗", { suffix: chip("已选中", "green") })}
      </section>
    `;
  }

  const prevTarget = step === 1 ? "67" : String(24 + step).padStart(2, "0");

  return frame({
    title,
    right: "入驻指南",
    screenClass: `register-screen register-step-${step}`,
    assurance: false,
    content: `
      <span class="sr-only">商户入驻资料填写页面，第 ${step} 步，包含基础信息、资质上传、服务类型选择或提交审核确认。页面中的上传卡片、服务选项、上一步、下一步和提交审核按钮均可点击，并会记录资料校验状态、上传进度和审核节点。</span>
      ${stepper(step)}
      ${body}
      <div class="sticky-action ${step === 1 ? "register-single-action" : "two-actions"}">
        ${step === 1 ? "" : `<button class="secondary-button" type="button" data-go="${prevTarget}">上一步</button>`}
        <button class="primary-button" type="button" data-go="${step === 4 ? "69" : String(26 + step).padStart(2, "0")}">${step === 4 ? "确认提交审核" : step === 1 ? "下一步：上传资质" : step === 2 ? "下一步：选择服务类型" : "下一步：提交审核"}</button>
      </div>
      <p class="register-audit-note">资料仅用于平台资质审核</p>
    `,
  });
}

function renderMerchantServiceCategorySelection(title) {
  const state = merchantServiceCategoryState;
  const categories = state.data?.categories || [];
  const query = state.query.trim();
  const selected = selectedMerchantServiceCategory();
  const savedSelection = currentMerchantServiceCategoryDraft();
  const visibleCategories = query
    ? categories.filter((item) => `${item.category}${item.examplesText}${item.note}`.includes(query))
    : categories;
  const commonCategories = [
    ["care-nursing", "居家护理"],
    ["medical-health", "陪诊预约"],
    ["care-nursing", "康复理疗"],
  ].map(([id, label]) => ({ id, label })).filter((item) => categories.some((category) => category.id === item.id));
  const selectedExamples = selected?.examples || [];
  const renderRow = (item) => {
    const active = selected?.id === item.id;
    const runtime = item.runtime || {};
    const row = `
      <button class="merchant-category-row ${active ? "active" : ""}" type="button" data-service-category-select="${escapeHtml(item.id)}" aria-pressed="${active ? "true" : "false"}">
        <span class="cat-icon ${escapeHtml(item.color)}">${icon(item.icon, 22)}</span>
        <span class="merchant-category-copy">
          <strong>${escapeHtml(item.category)}</strong>
          <small>${escapeHtml(item.examplesText)}</small>
          <em>${escapeHtml(item.note)}</em>
        </span>
        ${active ? `<span class="merchant-category-check">${icon("check", 14)}</span>` : icon("chevron-right", 18)}
      </button>
    `;
    if (!active) return row;
    return `
      <div class="merchant-category-expanded">
        ${row}
        <div class="merchant-sub-category">
          <h4>${escapeHtml(item.category)}</h4>
          <p>${escapeHtml(item.qualification)}</p>
          <div>
            ${item.examples.map((label, index) => `<button class="${index < 3 ? "active" : ""}" type="button" data-service-category-select="${escapeHtml(item.id)}">${escapeHtml(label)}${index < 3 ? `<span>${icon("check", 12)}</span>` : ""}</button>`).join("")}
          </div>
          <footer class="merchant-category-runtime">
            <span>${escapeHtml(runtime.statusText || "分类已建档")}</span>
            <b>${Number(runtime.listedServiceCount || 0)} 项已上架</b>
          </footer>
        </div>
      </div>
    `;
  };

  return frame({
    title,
    right: "完成",
    rightAction: "确认服务分类",
    rightNoMirror: true,
    screenClass: "service-category-screen",
    assurance: false,
    content: `
      <span class="sr-only">服务分类选择页面包含商户服务分类建议七个大类、示例服务、合规备注、运行状态和选择状态。</span>
      <label class="merchant-category-search">${icon("search", 22)}<input placeholder="搜索服务分类" data-service-category-search value="${escapeHtml(state.query)}" /></label>
      <section class="card merchant-category-common">
        <div class="merchant-category-head">
          <h3 class="section-title">常用分类</h3>
        </div>
        ${state.loading ? `<div class="merchant-category-loading">正在加载商户服务分类</div>` : ""}
        ${state.error ? `<div class="merchant-category-loading error">${escapeHtml(state.error)}<button type="button" data-service-category-refresh>重新加载</button></div>` : ""}
        ${!state.loading && !state.error ? `<div>${commonCategories.map((item) => `<button class="${selected?.id === item.id ? "active" : ""}" type="button" data-service-category-select="${escapeHtml(item.id)}">${escapeHtml(item.label)}${selected?.id === item.id ? `<span>${icon("check", 14)}</span>` : ""}</button>`).join("")}</div>` : ""}
      </section>
      <section class="card merchant-category-list">
        <div class="merchant-category-head">
          <h3 class="section-title">服务大类</h3>
          <small>${state.data?.source ? escapeHtml(merchantFriendlyText(state.data.source)) : "加载后展示"}</small>
        </div>
        ${!state.loading && !state.error && visibleCategories.length ? visibleCategories.map(renderRow).join("") : ""}
        ${!state.loading && !state.error && !visibleCategories.length ? `<div class="merchant-category-empty">未找到匹配分类</div>` : ""}
      </section>
      <div class="merchant-category-sticky">
        <div>
          <strong>当前 <b>${selected ? 1 : 0}</b> 类</strong>
          <small>${savedSelection?.category ? `已保存：${escapeHtml(savedSelection.category)}` : "保存后同步到服务草稿"}</small>
          ${selectedExamples.slice(0, 4).map((label) => `<button type="button" data-service-category-select="${escapeHtml(selected.id)}">${escapeHtml(label)}<span>${icon("check", 12)}</span></button>`).join("")}
        </div>
        <button class="primary-button" type="button" data-service-category-confirm="${escapeHtml(selected?.id || "")}" ${selected && !state.saving ? "" : "disabled aria-disabled=\"true\""}>${state.saving ? "保存中..." : `确认选择${selected ? `：${escapeHtml(selected.category)}` : ""}`}</button>
      </div>
    `,
  });
}

function renderServiceForm(screen) {
  const title = screen.title;
  const isCategory = screen.id === "31";
  const isTime = screen.id === "32";
  const isArea = screen.id === "33";

  if (isCategory) return renderMerchantServiceCategorySelection(title);

  if (isTime) {
    return frame({
      title,
      right: "保存",
      screenClass: "schedule-time-screen",
      assurance: false,
      content: `
        <div class="merchant-schedule-tip">${icon("info", 18)}客户只能预约已开放的服务时段</div>
        <section class="card form-section merchant-schedule-card">
          <h3 class="section-title">每周开放日期</h3>
          <div class="merchant-week-days">${["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day, index) => `<button class="${index < 5 ? "active" : ""}" type="button" data-action="${day}开放">${icon(index < 5 ? "check-square" : "square", 16)}${day}</button>`).join("")}</div>
        </section>
        <section class="card form-section merchant-schedule-card">
          <h3 class="section-title">可预约时段</h3>
          <div class="merchant-time-slots">
            ${[
              ["sun", "上午", "09:00-12:00", "orange"],
              ["sun", "下午", "14:00-18:00", "green"],
              ["moon", "晚间", "19:00-21:00", "purple"],
            ].map(([iconName, label, time, color]) => `<div class="merchant-time-slot">${miniIcon(iconName, color)}<strong>${label}</strong><span>${time}</span><em class="switch on"></em><button type="button" data-action="编辑${label}">${icon("pencil", 17)}编辑</button><button class="danger" type="button" data-action="删除${label}">${icon("trash-2", 17)}删除</button></div>`).join("")}
            <button class="merchant-dashed-add" type="button" data-action="添加时段">${icon("plus", 18)}添加时段</button>
          </div>
        </section>
        <section class="card form-section merchant-schedule-card merchant-schedule-rules">
          <h3 class="section-title">预约规则</h3>
          ${[
            ["最早可预约", "7天内"],
            ["最晚预约时间", "服务前2小时"],
            ["单日接单上限", "12单"],
            ["同时段接单数", "3单"],
          ].map(([label, value]) => `<button type="button" data-action="设置${label}"><span>${label}</span><strong>${value}</strong>${icon("chevron-right", 18)}</button>`).join("")}
        </section>
        <section class="card form-section merchant-schedule-card">
          <h3 class="section-title">特殊日期</h3>
          <div class="merchant-special-days">
            ${[
              ["2025-06-10", "端午节休息"],
              ["2025-06-18", "员工培训仅上午开放"],
            ].map(([date, text]) => `<div>${miniIcon("calendar-days", "blue")}<span>${date}</span><em>${text}</em><button type="button" data-action="编辑特殊日期">${icon("pencil", 17)}编辑</button><button class="danger" type="button" data-action="删除特殊日期">${icon("trash-2", 17)}删除</button></div>`).join("")}
            <button class="merchant-dashed-add" type="button" data-action="添加特殊日期">${icon("plus", 18)}添加特殊日期</button>
          </div>
        </section>
        <div class="sticky-action merchant-schedule-submit"><button class="primary-button" type="button" data-action="保存预约时间设置">保存设置</button></div>
      `,
    });
  }

  if (isArea) {
    return frame({
      title,
      right: "保存",
      screenClass: "merchant-area-screen",
      content: `
        <label class="merchant-area-search">${icon("search", 20)}<input value="" placeholder="搜索城市、区县或街道" /></label>
        <button class="card merchant-area-city" type="button" data-action="切换服务城市">
          ${miniIcon("map-pin", "blue")}<strong>当前服务城市</strong><span>云南省　昆明市</span>${icon("chevron-right", 18)}
        </button>
        <section class="card form-section merchant-area-select">
          <h3 class="section-title">选择服务区域 <small>（可多选）</small></h3>
          <div class="merchant-area-grid">
            ${["盘龙区", "五华区", "官渡区", "西山区", "呈贡区", "安宁市", "晋宁区", "东川区"].map((area, index) => `<button class="${index < 4 ? "active" : ""}" type="button" data-action="${index < 4 ? "取消" : "选择"}${area}">${area}${index < 4 ? icon("check", 15) : ""}</button>`).join("")}
          </div>
          <div class="merchant-area-map">
            <span class="covered">已覆盖 4 个区域</span>
            ${["西山区", "盘龙区", "五华区", "官渡区"].map((label, index) => `<i class="area-circle c${index}"><b>${icon("map-pin", 22)}</b><em>${label}</em></i>`).join("")}
            <strong>滇池</strong><small>昆明长水<br>国际机场</small>
          </div>
        </section>
        <section class="card form-section merchant-area-radius">
          <h3 class="section-title">上门距离设置</h3>
          <div class="merchant-radius-row"><span>上门服务半径</span><strong>8km</strong></div>
          <div class="merchant-range"><small>1km</small><i><b></b></i><small>20km</small></div>
          <button class="merchant-area-fee" type="button" data-action="设置超范围订单">超出范围订单 <strong>需商户确认</strong>${icon("chevron-right", 18)}</button>
        </section>
        <section class="card form-section merchant-area-address">
          <h3 class="section-title">服务地址</h3>
          <button type="button" data-action="编辑门店地址">${miniIcon("map-pin", "blue")}<span>门店地址</span><strong>昆明市盘龙区穿金路88号云旅大厦15楼</strong>${icon("chevron-right", 18)}</button>
          <button type="button" data-action="编辑可上门服务">${miniIcon("home", "green")}<span>可上门服务</span><strong>客户家中 / 养老社区 / 康复中心</strong>${icon("chevron-right", 18)}</button>
        </section>
        <div class="sticky-action two-actions merchant-area-actions"><button class="secondary-button" type="button" data-action="重置服务范围">${icon("refresh-cw", 19)}重置</button><button class="primary-button" type="button" data-action="保存服务范围">${icon("circle-check", 19)}确认保存</button></div>
      `,
    });
  }

  const isEditService = title.includes("编辑");
  const selectedService = isEditService ? currentMerchantService() : null;
  const serviceDraft = currentMerchantServiceCategoryDraft();
  const draftCategory = serviceDraft?.category || "康养护理";
  const draftTitle = serviceDraft?.serviceTitle || `${draftCategory}服务`;
  const draftExamples = Array.isArray(serviceDraft?.examples) && serviceDraft.examples.length ? serviceDraft.examples : ["日常护理", "伤口护理", "康复指导"];
  const selectedTitle = selectedService?.title || draftTitle;
  const selectedCategory = selectedService?.tag || draftCategory;
  const selectedDescription = selectedService?.description || serviceDraft?.description || "专业护理人员上门提供基础护理服务，包含生命体征监测、用药指导、生活照护等，让您在家安心康养。";
  const selectedPrice = selectedService ? selectedService.price : merchantMoney(serviceDraft?.price || 199);
  const selectedUnit = selectedService?.unit || "次";
  const selectedImage = selectedService?.image || assets.servicePreviewMain;
  const serviceTypeLabels = Array.from(new Set([selectedCategory, "居家护理", "康复理疗", "母婴护理", "中医理疗", "陪诊陪护"].filter(Boolean))).slice(0, 6);
  const typePills = `
    <div class="merchant-type-pills">
      ${serviceTypeLabels.map((label) => `<button class="${selectedCategory.includes(label) ? "active" : ""}" type="button" data-go="31">${escapeHtml(label)}</button>`).join("")}
    </div>
  `;
  const subCategoryBlock = `
    <div class="merchant-service-block merchant-subcategory-block">
      <div class="merchant-block-title"><span class="merchant-service-label">子分类 <small>（可多选）</small></span></div>
      <div class="merchant-sub-tags">
        ${draftExamples.slice(0, 4).map((label) => `<button type="button" data-go="31">${escapeHtml(label)}${icon("chevron-right", 12)}</button>`).join("")}
        <button class="muted-add" type="button" data-go="31">${icon("plus", 12)}添加分类</button>
      </div>
    </div>
  `;
  const coverBlock = `
    <div class="merchant-service-block merchant-cover-block">
      <div class="merchant-block-title"><span class="merchant-service-label required">服务封面上传</span></div>
      <div class="merchant-cover-uploader">
        <img src="${selectedImage}" alt="服务封面" />
        <div>
          ${isEditService ? "" : `<p>建议尺寸 1:1，JPG/PNG 格式，大小不超过 5MB</p>`}
          <button type="button" data-action="更换服务封面">${icon("upload", 13)}更换图片</button>
        </div>
      </div>
    </div>
  `;
  const introBlock = `
    <div class="merchant-service-block merchant-intro-block">
      <div class="merchant-block-title"><span class="merchant-service-label required">图文介绍</span></div>
      <div class="merchant-intro-box">
        <p>${escapeHtml(selectedDescription)}</p>
        <em>56/500</em>
      </div>
      <div class="merchant-intro-photos">
        ${[assets.servicePreviewVitals, assets.serviceDoctor, assets.servicePreviewLife].map((src, index) => `<span><img src="${src}" alt="图文介绍${index + 1}" /><button type="button" data-action="删除介绍图片">${icon("x", 11)}</button></span>`).join("")}
        <button type="button" data-action="添加介绍图片">${icon("plus", 20)}</button>
      </div>
    </div>
  `;
  const editFormSections = `
    <section class="card merchant-service-card">
      <button class="merchant-service-row" type="button" data-action="编辑服务名称">
        <span class="merchant-service-label required">服务名称</span>
        <strong>${escapeHtml(selectedTitle)}</strong>
        <em>${selectedTitle.length}/30</em>
      </button>
      <button class="merchant-service-row" type="button" data-go="31">
        <span class="merchant-service-label required">服务分类</span>
        <strong>${escapeHtml(selectedCategory)}</strong>
        ${icon("chevron-right", 17)}
      </button>
      ${subCategoryBlock}
      ${coverBlock}
      ${introBlock}
    </section>
  `;
  const addFormSections = `
    <section class="card merchant-service-card merchant-service-name-card">
      <button class="merchant-service-row merchant-service-input-row" type="button" data-action="编辑服务名称">
        <span class="merchant-service-label required">服务名称</span>
        <strong>${escapeHtml(selectedTitle)}</strong>
        <em>${selectedTitle.length}/30</em>
      </button>
    </section>
    <section class="card merchant-service-card merchant-service-category-card">
      <div class="merchant-service-block merchant-service-type">
        <div class="merchant-block-title"><span class="merchant-service-label required">服务分类</span></div>
        ${typePills}
      </div>
      ${subCategoryBlock}
    </section>
    <section class="card merchant-service-card merchant-service-upload-card">${coverBlock}</section>
    <section class="card merchant-service-card merchant-service-intro-card">${introBlock}</section>
  `;

  return frame({
    title,
    right: "保存草稿",
    screenClass: `merchant-service-form-screen ${isEditService ? "merchant-service-edit-screen" : "merchant-service-add-screen"}`,
    assurance: false,
    content: `
      <div class="merchant-service-tip">
        <span>${icon("info", 13)}</span>
        <p>${isEditService ? "修改服务信息后需重新提交审核，审核通过后展示给客户" : "请完善服务信息，提交审核后将展示给客户"}</p>
        ${isEditService ? "" : `<button type="button" data-action="关闭提示" aria-label="关闭提示">${icon("x", 14)}</button>`}
      </div>
      ${isEditService ? editFormSections : addFormSections}
      <section class="card merchant-service-card merchant-price-card">
        <button class="merchant-service-row" type="button" data-action="编辑基础价格">
          <span class="merchant-service-label required">基础价格</span>
          <strong class="merchant-price-value">${escapeHtml(selectedPrice)}</strong>
          ${isEditService ? "" : `<em>价格说明</em>`}
        </button>
        <div class="merchant-service-row merchant-duration-row">
          <span class="merchant-service-label required">服务时长</span>
          <div class="merchant-duration-stepper">
            <button type="button" data-action="减少服务时长">${icon("minus", 12)}</button>
            <strong>60</strong>
            <button type="button" data-action="增加服务时长">${icon("plus", 12)}</button>
            <span>${escapeHtml(selectedUnit === "次" ? "分钟" : selectedUnit)}</span>
          </div>
        </div>
        <div class="merchant-service-block merchant-booking-block">
          <div class="merchant-block-title"><span class="merchant-service-label required">可预约时间</span></div>
          <div class="merchant-week-checks">
            ${["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day, index) => `<button class="${index < 5 ? "active" : ""}" type="button" data-action="${day}可预约">${icon(index < 5 ? "check-square" : "circle", 12)}${day}</button>`).join("")}
          </div>
          <div class="merchant-time-tags">
            ${["09:00-12:00", "14:00-18:00", "19:00-21:00"].map((time) => `<button type="button" data-go="32">${icon("check-circle", 11)}${time}</button>`).join("")}
            <button class="muted-add" type="button" data-go="32">${icon("plus", 11)}添加时段</button>
          </div>
        </div>
        <button class="merchant-service-row" type="button" data-go="33">
          <span class="merchant-service-label required">服务范围</span>
          <strong>昆明市盘龙区、五华区、官渡区、西山区</strong>
          ${icon("chevron-right", 17)}
        </button>
        <button class="merchant-service-row" type="button" data-action="编辑注意事项">
          <span class="merchant-service-label required">注意事项</span>
          <strong>服务前请提前预约；如需取消，请至少提前2小时通知。</strong>
          ${isEditService ? icon("chevron-right", 17) : `<em>22/200</em>`}
        </button>
      </section>
      <div class="sticky-action two-actions merchant-service-actions">
        <button class="secondary-button" type="button" data-go="11">${icon("eye", 15)}预览</button>
        <button class="primary-button" type="button" data-merchant-service-submit="${escapeHtml(selectedService?.id || "")}">${icon("send", 15)}${isEditService ? "提交审核" : "提交上架"}</button>
      </div>
    `,
  });
}

function invoiceEditRow(iconName, label, value, arrow = false) {
  return `
    <button class="merchant-invoice-row" type="button" data-action="编辑${label}">
      ${miniIcon(iconName, "blue")}
      <span>${label}</span>
      <strong>${value}</strong>
      ${arrow ? icon("chevron-right", 18) : "<i></i>"}
    </button>
  `;
}

function renderInvoice(screen) {
  const isEdit = screen.id === "46";
  const isSelect = screen.id === "47";
  const isDetail = screen.id === "48";
  const isApply = screen.id === "06";

  if (isEdit) {
    return frame({
      title: "发票抬头编辑",
      right: "保存",
      screenClass: "invoice-edit-screen",
      assurance: false,
      content: `
        <div class="merchant-invoice-tip">${icon("info", 18)}请确保发票信息与营业执照信息一致</div>
        <section class="card merchant-invoice-card">
          <h3 class="section-title">企业信息</h3>
          ${invoiceEditRow("building-2", "抬头类型", "企业", true)}
          ${invoiceEditRow("users", "企业抬头", "云旅无忧（昆明）科技有限公司")}
          ${invoiceEditRow("badge-check", "税号", "91530100MA6P2X8R4G")}
          ${invoiceEditRow("map-pin", "注册地址", "云南省昆明市盘龙区穿金路88号云旅大厦15楼")}
          ${invoiceEditRow("phone", "注册电话", "0871-88888888")}
        </section>
        <section class="card merchant-invoice-card">
          <h3 class="section-title">银行信息</h3>
          ${invoiceEditRow("landmark", "开户行", "中国建设银行股份有限公司昆明穿金路支行", true)}
          ${invoiceEditRow("credit-card", "银行账号", "5300 1688 8888 8888 8888")}
        </section>
        <section class="card merchant-invoice-card merchant-invoice-receive">
          <h3 class="section-title">接收方式</h3>
          <div class="merchant-invoice-type">
            <button class="is-active" type="button" data-action="选择电子发票">${icon("mail", 20)}电子发票（邮箱）${icon("check-circle", 18)}</button>
            <button type="button" data-action="选择纸质发票">${icon("truck", 20)}纸质发票</button>
          </div>
          ${invoiceEditRow("mail", "接收邮箱", "invoice@ylny.com")}
          <div class="merchant-invoice-note-row">
            ${miniIcon("file-text", "blue")}
            <span>备注信息</span>
            <label><textarea placeholder="请输入开票备注（选填）"></textarea><em>0/200</em></label>
          </div>
        </section>
        <div class="sticky-action merchant-invoice-save"><button class="primary-button" type="button" data-action="保存发票信息">保存发票信息</button></div>
      `,
    });
  }

  if (isSelect) {
    const invoiceOrders = [
      ["home", "居家护理服务（李奶奶）", "SO202505200001", "服务时间：2025-05-20 09:30-11:30", "¥ 268.00", "05-20", true, "blue"],
      ["message-circle", "陪诊预约服务（张叔叔）", "SO20250519008", "服务时间：2025-05-19 14:00-15:30", "¥ 198.00", "05-19", true, "purple"],
      ["heart-handshake", "康复理疗上门服务（王阿姨）", "SO20250518015", "服务时间：2025-05-18 16:00-17:00", "¥ 298.00", "05-18", false, "orange"],
      ["car-front", "接送站服务（刘先生）", "SO20250518021", "服务时间：2025-05-18 10:00-11:00", "¥ 158.00", "05-18", false, "blue"],
    ];
    return frame({
      title: "选择开票订单",
      right: "确定",
      screenClass: "invoice-select-screen",
      assurance: false,
      content: `
        <div class="invoice-select-tip">${icon("info", 18)}请选择已完成且未开票的订单</div>
        <section class="card invoice-select-summary">
          <span class="state-icon blue">${icon("receipt-text", 35)}</span>
          <div>
            <p>已选金额</p>
            <strong>¥ 466.00</strong>
            <small>已选 <b>2</b> 笔订单</small>
          </div>
          <button type="button" data-action="清空已选订单">清空</button>
        </section>
        <section class="card invoice-select-filter">
          <label>${icon("search", 18)}<input placeholder="搜索订单号/客户名称" aria-label="搜索订单号或客户名称" /></label>
          <button type="button" data-action="筛选全部服务">全部服务 ${icon("chevron-down", 16)}</button>
          <button type="button" data-action="筛选全部时间">全部时间 ${icon("chevron-down", 16)}</button>
        </section>
        <section class="card invoice-select-list">
          ${invoiceOrders
            .map(
              ([iconName, title, no, serviceTime, amount, date, checked, color]) => `
                <button class="invoice-select-order ${checked ? "checked" : ""}" type="button" data-action="${checked ? "取消选择" : "选择"}${title}">
                  <span class="select-dot">${checked ? icon("check", 16) : ""}</span>
                  ${miniIcon(iconName, color)}
                  <div>
                    <strong>${title}</strong>
                    <em>订单号：${no}</em>
                    <small>${icon("clock", 14)}${serviceTime}</small>
                  </div>
                  <b>${amount}<i>已完成</i><small>${date}</small></b>
                  ${icon("chevron-right", 18)}
                </button>
              `,
            )
            .join("")}
        </section>
        <div class="invoice-select-submit">
          <span>已选 <b>2</b> 笔</span>
          <button class="primary-button" type="button" data-action="确认选择开票订单">确认选择</button>
        </div>
      `,
    });
  }

  if (isDetail) {
    return frame({
      title: "发票详情",
      right: "开票帮助",
      screenClass: "invoice-detail-screen",
      assurance: false,
      content: `
        <span class="sr-only">发票详情页面，包含已开票状态、发票信息、订单明细、接收信息、联系客服和下载发票操作。</span>
        <section class="card invoice-detail-hero">
          <span>${icon("receipt-text", 40)}<i>${icon("check", 16)}</i></span>
          <div>
            <h2>发票已开具</h2>
            <p>电子发票已发送至 invoice@ylny.com</p>
            <time>${icon("clock", 18)}开票时间：2025-05-21 10:20</time>
          </div>
          ${chip("已开票", "green")}
        </section>
        <section class="card invoice-detail-card">
          <h3 class="invoice-detail-title">发票信息</h3>
          ${[
            ["发票类型", "增值税专用发票", ""],
            ["抬头类型", "企业", ""],
            ["企业抬头", "云旅无忧（昆明）科技有限公司", ""],
            ["税号", "91530100MA6P2X8R4G", ""],
            ["开票金额", "¥ 466.00", "red"],
            ["开票时间", "2025-05-21 10:20", ""],
          ].map(([label, value, cls]) => `<div class="invoice-detail-row"><span>${label}</span><strong class="${cls}">${value}</strong></div>`).join("")}
        </section>
        <section class="card invoice-detail-card invoice-detail-orders">
          <h3 class="invoice-detail-title">订单明细</h3>
          ${[
            ["user", "居家护理服务（李奶奶）", "订单号：SO202505200001", "¥ 268.00", "green"],
            ["message-circle", "陪诊预约服务（张叔叔）", "订单号：SO202505190008", "¥ 198.00", "purple"],
          ].map(([iconName, title, no, amount, color]) => `
            <div class="invoice-detail-order">
              ${miniIcon(iconName, color)}
              <span><strong>${title}</strong><small>${no}</small></span>
              <b>${amount}</b>
            </div>
          `).join("")}
        </section>
        <section class="card invoice-detail-card invoice-detail-receive">
          <h3 class="invoice-detail-title">接收信息</h3>
          <div class="invoice-detail-row"><span>接收方式</span><strong>电子发票（邮箱）</strong></div>
          <div class="invoice-detail-row"><span>接收邮箱</span><strong>invoice@ylny.com</strong></div>
        </section>
        <div class="sticky-action invoice-detail-actions two-actions">
          <button class="secondary-button" type="button" data-go="09">${icon("headphones", 22)}联系客服</button>
          <button class="primary-button" type="button" data-action="下载发票">${icon("download", 22)}下载发票</button>
        </div>
      `,
    });
  }

  if (isApply) {
    const state = merchantRealPageState.invoiceApply;
    const apply = state.data || {
      title: {
        titleType: "企业",
        title: "云旅无忧（昆明）科技有限公司",
        taxNo: "91530100MA6P2X8R4G",
      },
      preference: {
        invoiceType: "增值税专用发票",
        delivery: "电子发票（邮箱）",
        email: "invoice@ylny.com",
      },
      orders: [
        { id: "invoice-order-001", title: "居家护理服务（李奶奶）", orderNo: "DD20260601004", serviceTime: "服务时间：2026-06-03 09:30-11:30", amount: 268, amountText: "¥ 268.00", completedAt: "06-03", selected: true, icon: "user", color: "green", invoiceable: true },
        { id: "invoice-order-002", title: "康复护理方案（李奶奶）", orderNo: "DD20260601005", serviceTime: "服务时间：2026-06-03 14:00-15:30", amount: 198, amountText: "¥ 198.00", completedAt: "06-03", selected: true, icon: "message-circle", color: "purple", invoiceable: true },
      ],
      selectedOrderIds: ["invoice-order-001", "invoice-order-002"],
      eta: "预计1-3个工作日完成开票",
    };
    const orders = apply.orders || [];
    const selectedOrderIds = state.selectedOrderIds.length ? state.selectedOrderIds : (apply.selectedOrderIds || []);
    const selectedOrders = orders.filter((order) => selectedOrderIds.includes(order.id));
    const selectedAmount = selectedOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
    const preference = apply.preference || {};
    const invoiceType = state.invoiceType || preference.invoiceType || "增值税专用发票";
    const delivery = state.delivery || preference.delivery || "电子发票（邮箱）";
    const email = preference.email || "invoice@ylny.com";
    const title = apply.title || {};
    const nextInvoiceType = invoiceType === "增值税专用发票" ? "增值税普通发票" : "增值税专用发票";
    return frame({
      title: "申请开票",
      right: "开票帮助",
      rightGo: "09",
      screenClass: "invoice-apply-screen",
      assurance: false,
      content: `
        ${merchantApiPanel(state, "开票申请")}
        <div class="merchant-invoice-tip">${icon("info", 18)}请选择已完成且可开票的订单</div>
        <section class="card merchant-invoice-amount">
          <div><h3>开票金额</h3><strong>¥ ${selectedAmount.toFixed(2)}</strong><span>已选 ${selectedOrders.length} 笔订单</span></div>
          <button type="button" data-go="47">选择订单 ${icon("chevron-right", 18)}</button>
        </section>
        <section class="card merchant-invoice-orders" data-merchant-invoice-apply-orders>
          ${orders.map((order) => {
            const checked = selectedOrderIds.includes(order.id);
            return `
            <button class="merchant-invoice-order ${checked ? "checked" : ""} ${order.invoiceable ? "" : "disabled"}" type="button" data-merchant-invoice-apply-order="${escapeHtml(order.id)}" aria-pressed="${checked ? "true" : "false"}" ${order.invoiceable ? "" : "disabled"}>
              <span class="order-check">${checked ? icon("check", 14) : ""}</span>
              <span class="order-type">${icon(order.icon || "receipt-text", 20)}</span>
              <span><strong>${escapeHtml(order.title || "商户订单")}</strong><em>${escapeHtml(order.orderNo || "")}</em><small>${escapeHtml(order.serviceTime || "")}</small></span>
              <b>${escapeHtml(order.amountText || `¥ ${Number(order.amount || 0).toFixed(2)}`)}<small>${escapeHtml(order.status || "已完成")}</small></b>
            </button>
          `;
          }).join("") || `<p class="action-status">暂无可开票订单</p>`}
        </section>
        <section class="card merchant-invoice-apply-info">
          <h3 class="section-title">发票信息</h3>
          <button class="merchant-invoice-row merchant-invoice-apply-row" type="button" data-merchant-invoice-apply-type="${escapeHtml(nextInvoiceType)}"><span class="invoice-apply-label">发票类型</span><strong class="invoice-apply-value">${escapeHtml(invoiceType)}</strong>${icon("chevron-right", 18)}</button>
          <div class="merchant-invoice-row merchant-invoice-apply-row"><span class="invoice-apply-label">抬头类型</span><strong class="invoice-apply-value">${escapeHtml(title.titleType || "企业")}</strong></div>
          <div class="merchant-invoice-row merchant-invoice-apply-row"><span class="invoice-apply-label">企业抬头</span><strong class="invoice-apply-value">${escapeHtml(title.title || "")}</strong></div>
          <div class="merchant-invoice-row merchant-invoice-apply-row"><span class="invoice-apply-label">税号</span><strong class="invoice-apply-value">${escapeHtml(title.taxNo || "")}</strong></div>
          <div class="merchant-invoice-row merchant-invoice-apply-row"><span class="invoice-apply-label">接收邮箱</span><strong class="invoice-apply-value">${escapeHtml(email)}</strong></div>
        </section>
        <section class="card merchant-invoice-apply-delivery">
          <h3 class="section-title">寄送方式</h3>
          <div class="merchant-invoice-type">
            ${["电子发票（邮箱）", "纸质发票"].map((label) => `
              <button class="${delivery === label ? "is-active" : ""}" type="button" data-merchant-invoice-apply-delivery="${label}" aria-pressed="${delivery === label ? "true" : "false"}">${icon(label.includes("电子") ? "mail" : "truck", 20)}${label}${delivery === label ? icon("check-circle", 18) : ""}</button>
            `).join("")}
          </div>
        </section>
        <section class="card merchant-invoice-apply-note">
          <h3 class="section-title">备注信息 <span>（选填）</span></h3>
          <label><textarea data-merchant-invoice-apply-note maxlength="200" placeholder="请输入开票备注（选填）">${escapeHtml(state.note || apply.note || "")}</textarea><em>${String(state.note || apply.note || "").length}/200</em></label>
        </section>
        <div class="merchant-invoice-apply-submit"><button class="primary-button" type="button" data-merchant-invoice-apply-submit ${state.submitting ? "disabled" : ""}>${state.submitting ? "提交中..." : "提交申请"}</button><p>${escapeHtml(apply.eta || "预计1-3个工作日完成开票")}</p></div>
      `,
    });
  }

  const state = merchantRealPageState.invoices;
  const invoice = state.data || {
    title: {
      titleType: "企业",
      title: "云旅无忧（昆明）科技有限公司",
      taxNo: "91530100MA6P2X8R4G",
      address: "云南省昆明市盘龙区穿金路88号云旅大厦15楼",
      bank: "中国建设银行股份有限公司昆明穿金路支行",
      bankAccount: "5300 1688 8888 8888 8888",
    },
    preference: {
      invoiceType: "增值税专用发票",
      delivery: "电子发票（邮箱）",
      email: "invoice@ylny.com",
    },
    filters: ["全部", "待开票", "已开票", "已作废"],
    records: [
      { icon: "receipt-text", color: "blue", title: "居家护理服务（李奶奶）", orderNo: "SO20250520001", appliedAt: "2025-05-20 10:35", amountText: "¥ 268.00", status: "待开票", statusColor: "orange", action: "申请开票" },
      { icon: "receipt-text", color: "green", title: "陪诊预约服务（张叔叔）", orderNo: "SO20250519008", appliedAt: "2025-05-19 14:20", amountText: "¥ 198.00", status: "已开票", statusColor: "green", action: "下载发票" },
      { icon: "receipt-text", color: "purple", title: "康复理疗上门服务（王阿姨）", orderNo: "SO20250518015", appliedAt: "2025-05-18 16:10", amountText: "¥ 298.00", status: "已作废", statusColor: "gray", action: "" },
    ],
  };
  const invoiceTitle = invoice.title || {};
  const preference = invoice.preference || {};
  const filters = invoice.filters || ["全部", "待开票", "已开票", "已作废"];
  const selectedFilter = state.filter || invoice.status || "全部";
  const records = invoice.records || [];
  const nextInvoiceType = preference.invoiceType === "增值税专用发票" ? "增值税普通发票" : "增值税专用发票";
  const nextDelivery = preference.delivery === "电子发票（邮箱）" ? "纸质发票" : "电子发票（邮箱）";
  return frame({
    title: "发票信息 / 发票管理",
    right: `开票帮助 ${icon("circle-help", 16)}`,
    tab: "mine",
    screenClass: "invoice-manage-screen",
    assurance: false,
    content: `
      ${merchantApiPanel(state, "发票")}
      <section class="card invoice-manage-title-card">
        <header>
          ${miniIcon("building-2", "green")}
          <strong>${escapeHtml(invoiceTitle.title || "企业抬头")}</strong>
          <button type="button" data-go="46">${icon("pencil", 17)}编辑</button>
        </header>
        <dl>
          <dt>企业抬头</dt><dd>${escapeHtml(invoiceTitle.title || "")}</dd>
          <dt>税号</dt><dd>${escapeHtml(invoiceTitle.taxNo || "")}</dd>
          <dt>注册地址</dt><dd>${escapeHtml(invoiceTitle.address || "")}</dd>
          <dt>开户行</dt><dd>${escapeHtml(invoiceTitle.bank || "")}</dd>
          <dt>银行账号</dt><dd>${escapeHtml(invoiceTitle.bankAccount || "")}</dd>
        </dl>
      </section>
      <section class="card invoice-preference-card">
        <header><h3>发票偏好设置</h3><button type="button" data-go="46">可随时修改 ${icon("chevron-right", 15)}</button></header>
        <div>
          <button type="button" data-merchant-invoice-preference-key="invoiceType" data-merchant-invoice-preference-value="${escapeHtml(nextInvoiceType)}">${miniIcon("file-text", "green")}<span>发票类型</span><strong>${escapeHtml(preference.invoiceType || "增值税专用发票")} ${icon("chevron-down", 14)}</strong></button>
          <button type="button" data-merchant-invoice-preference-key="delivery" data-merchant-invoice-preference-value="${escapeHtml(nextDelivery)}">${miniIcon("mail", "blue")}<span>接收方式</span><strong>${escapeHtml(preference.delivery || "电子发票（邮箱）")}${icon("chevron-down", 14)}</strong></button>
          <button type="button" data-go="46">${miniIcon("mail", "purple")}<span>接收邮箱</span><strong>${escapeHtml(preference.email || "invoice@ylny.com")} ${icon("chevron-right", 14)}</strong></button>
        </div>
      </section>
      <section class="card invoice-record-card">
        <header><h3>开票记录</h3><button type="button" data-merchant-invoice-filter="全部">查看全部 ${icon("chevron-right", 15)}</button></header>
        <nav>
          ${filters.map((label) => `<button class="${label === selectedFilter ? "active" : ""}" type="button" data-merchant-invoice-filter="${escapeHtml(label)}">${escapeHtml(label)}</button>`).join("")}
        </nav>
        ${records.map((record) => `
          <article class="invoice-record-row" data-go="${record.action ? "48" : "13"}">
            ${miniIcon(record.icon || "receipt-text", record.color || "blue")}
            <div class="main"><strong>${escapeHtml(record.title || "开票记录")}</strong><span>订单号：${escapeHtml(record.orderNo || "")}</span><span>${icon("clock", 13)} 申请时间：${escapeHtml(record.appliedAt || "")}</span></div>
            <div class="amount"><span>金额</span><b>${escapeHtml(record.amountText || `¥ ${Number(record.amount || 0).toFixed(2)}`)}</b><em>发票类型<br>${escapeHtml(record.invoiceType || preference.invoiceType || "增值税专用发票")}</em></div>
            <div class="ops"><i class="${escapeHtml(record.statusColor || "orange")}">${escapeHtml(record.status || "待开票")}</i><button type="button" data-go="48">查看详情</button>${record.action ? `<button type="button" data-go="${record.action === "申请开票" ? "06" : "48"}">${escapeHtml(record.action)}</button>` : ""}</div>
          </article>
        `).join("") || `<p class="action-status">当前筛选暂无开票记录</p>`}
      </section>
      <div class="sticky-action invoice-manage-apply"><button class="primary-button" type="button" data-go="06">${icon("plus-circle", 20)}申请开票</button></div>
    `,
  });
}

function renderSupport(screen) {
  if (screen.id === "09") {
    const state = merchantRealPageState.support;
    const support = state.data || {
      quickLinks: [
        { icon: "clipboard-list", label: "订单问题", route: "20", color: "blue" },
        { icon: "wallet", label: "结算提现", route: "44", color: "orange" },
        { icon: "badge-check", label: "资质认证", route: "03", color: "green" },
        { icon: "file-text", label: "发票开具", route: "13", color: "purple" },
      ],
      faqs: ["如何修改服务价格？", "客户取消预约后如何处理？", "结算周期是多久？", "发票开具需要多长时间？"],
      contacts: { phone: "400-888-1234", email: "service@ylny.com", serviceTime: "09:00-18:00" },
    };
    const quickLinks = support.quickLinks || [];
    const faqs = support.faqs || [];
    const contacts = support.contacts || {};
    const phone = contacts.phone || "400-888-1234";
    const email = contacts.email || "service@ylny.com";
    return frame({
      title: "客服中心",
      right: "工单记录",
      rightGo: "50",
      screenClass: "support-center-screen",
      assurance: false,
      content: `
        ${merchantApiPanel(state, "客服")}
        <button class="merchant-support-search" type="button" data-action="搜索常见问题">${icon("search", 24)}<span>搜索常见问题</span></button>
        <section class="merchant-support-hero">
          <div class="support-hero-art" aria-hidden="true">
            <span class="headset-band"></span>
            <span class="headset-ear left"></span>
            <span class="headset-ear right"></span>
            <span class="headset-mic"></span>
          </div>
          <div class="support-hero-copy">
            <h2>需要帮助吗？</h2>
            <p><span>商户专属客服</span><strong>${escapeHtml(contacts.serviceTime || "09:00-18:00")} 在线</strong></p>
            <div class="support-hero-actions">
              <button class="primary-button" type="button" data-go="51">${icon("message-circle", 24)}在线客服</button>
              <a class="secondary-button green" href="${merchantTelHref(phone)}" data-merchant-support-contact="phone">${icon("phone", 23)}拨打电话</a>
            </div>
          </div>
          <span class="support-hero-bubble" aria-hidden="true"><i></i><i></i><i></i></span>
        </section>
        <section class="card merchant-support-section">
          <h3 class="support-section-title">快捷入口</h3>
          <div class="support-quick-grid">
            ${quickLinks.map((item) => `
              <button class="support-quick-card ${escapeHtml(item.color || "blue")}" type="button" data-go="${escapeHtml(item.route || "09")}">
                ${icon(item.icon || "headphones", 36)}
                <span>${escapeHtml(item.label || "客服入口")}</span>
              </button>
            `).join("")}
          </div>
        </section>
        <section class="card merchant-support-section support-faq-card">
          <h3 class="support-section-title">常见问题</h3>
          ${faqs.map((item) => `
            <button class="support-faq-row" type="button" data-go="52">
              <span>${escapeHtml(typeof item === "string" ? item : item.title || "常见问题")}</span>${icon("chevron-right", 22)}
            </button>
          `).join("")}
        </section>
        <section class="card merchant-support-section support-contact-card">
          <h3 class="support-section-title">联系信息</h3>
          <a class="support-contact-row" href="${merchantTelHref(phone)}" data-merchant-support-contact="phone">
            <span class="contact-icon green">${icon("phone", 22)}</span>
            <span>客服电话</span>
            <strong>${escapeHtml(phone)}</strong>
            ${icon("chevron-right", 20)}
          </a>
          <button class="support-contact-row" type="button" data-go="09">
            <span class="contact-icon blue">${icon("clock", 22)}</span>
            <span>服务时间</span>
            <strong>${escapeHtml(contacts.serviceTime || "09:00-18:00")}</strong>
          </button>
          <button class="support-contact-row" type="button" data-merchant-support-contact="email" data-merchant-support-email="${escapeHtml(email)}">
            <span class="contact-icon purple">${icon("mail", 22)}</span>
            <span>客服邮箱</span>
            <strong>${escapeHtml(email)}</strong>
            ${icon("chevron-right", 20)}
          </button>
        </section>
        <div class="support-center-actions">
          <button class="primary-button" type="button" data-go="49">${icon("edit-3", 24)}提交问题工单</button>
          <button class="secondary-button" type="button" data-go="66">${icon("shield-check", 24)}查看平台规则</button>
        </div>
      `,
    });
  }

  if (screen.id === "49") {
    const issueTypes = [
      ["clipboard-list", "订单问题", "blue"],
      ["wallet", "结算提现", "orange"],
      ["shield-check", "资质认证", "green"],
      ["receipt-text", "发票开具", "purple"],
      ["triangle-alert", "系统故障", "red"],
      ["ellipsis", "其他问题", "gray"],
    ];
    return frame({
      title: "提交问题工单",
      right: "工单记录",
      rightGo: "50",
      screenClass: "ticket-submit-screen",
      assurance: false,
      content: `
        <span class="sr-only">提交问题工单页面，包含问题类型、关联信息、问题描述、上传凭证、联系方式、保存草稿和提交工单操作。</span>
        <div class="ticket-tip">${icon("info", 18)}<span>提交后客服将在工作时间内尽快处理</span></div>
        <section class="card ticket-card">
          <h3 class="ticket-title">问题类型</h3>
          <div class="ticket-type-grid">
            ${issueTypes.map(([iconName, label, color]) => {
              const active = merchantTicketState.type === label;
              return `
              <button class="${active ? "active" : ""} ${color}" type="button" data-ticket-type="${label}" aria-pressed="${active ? "true" : "false"}">
                ${icon(iconName, 28)}
                <span>${label}</span>
                ${active ? icon("circle-check", 19) : ""}
              </button>
            `;
            }).join("")}
          </div>
        </section>
        <section class="card ticket-card ticket-related-card">
          <h3 class="ticket-title">关联信息</h3>
          <button class="ticket-row" type="button" data-go="20">${miniIcon("clipboard-list", "blue")}<span>关联订单</span><strong>请选择订单</strong>${icon("chevron-right", 18)}</button>
          <button class="ticket-row" type="button" data-action="拨打联系电话">${miniIcon("phone", "blue")}<span>联系电话</span><strong>138 8888 8888</strong></button>
          <button class="ticket-row" type="button" data-action="选择紧急程度" data-ticket-urgency-toggle aria-expanded="false">${miniIcon("flag", "orange")}<span>紧急程度</span><strong data-ticket-urgency-value>${merchantTicketState.urgency}</strong>${icon("chevron-right", 18)}</button>
          <div class="selector-grid ticket-urgency-options" data-ticket-urgency-options hidden>
            ${["普通", "加急", "紧急"].map((level) => `<button class="choice ${merchantTicketState.urgency === level ? "active" : ""}" type="button" data-ticket-urgency="${level}" aria-pressed="${merchantTicketState.urgency === level ? "true" : "false"}">${level}</button>`).join("")}
          </div>
        </section>
        <section class="card ticket-card ticket-desc-card">
          <h3 class="ticket-title">问题描述</h3>
          <label class="ticket-textarea">
            <textarea data-ticket-description maxlength="300" placeholder="请详细描述遇到的问题，包含订单号、操作步骤或截图信息..."></textarea>
            <em data-ticket-description-count>0/300</em>
          </label>
        </section>
        <section class="card ticket-card ticket-upload-card">
          <h3 class="ticket-title">上传凭证 <span>（选填）</span></h3>
          <div class="ticket-upload-grid">
            <button type="button" data-action="上传工单图片">${icon("plus", 30)}<span>上传图片</span></button>
            <figure><button type="button" data-action="删除凭证1">${icon("x", 14)}</button><i></i><figcaption>凭证截图</figcaption></figure>
            <figure><button type="button" data-action="删除凭证2">${icon("x", 14)}</button><i></i><figcaption>处理页面</figcaption></figure>
          </div>
          <p>最多上传 6 张，支持 JPG/PNG</p>
        </section>
        <section class="card ticket-card ticket-contact-card">
          <h3 class="ticket-title">联系方式</h3>
          <div class="ticket-row">${miniIcon("user", "purple")}<span>联系人</span><strong>李奶奶</strong></div>
          <div class="ticket-row reply">${miniIcon("message-square", "blue")}<span>接收回复</span><button class="active" type="button" data-action="站内消息回复">${icon("check-square", 18)}站内消息</button><button class="active" type="button" data-action="短信回复">${icon("check-square", 18)}短信</button></div>
        </section>
        <div class="sticky-action ticket-submit-actions two-actions">
          <button class="secondary-button" type="button" data-action="保存工单草稿">${icon("file-text", 20)}保存草稿</button>
          <button class="primary-button" type="button" data-action="提交工单">${icon("send", 20)}提交工单</button>
        </div>
      `,
    });
  }

  if (screen.id === "50") {
    const tickets = [
      ["TK20250520001", "订单状态未同步", "订单问题", "处理中", "提交时间　今天 10:20", "最新回复　客服已转交技术人员核查", "orange", "49"],
      ["TK20250519003", "提现到账时间咨询", "结算提现", "已完成", "提交时间　昨天 16:30", "最新回复　提现预计1-3个工作日到账", "green", "44"],
      ["TK20250518008", "发票邮箱修改", "发票开具", "待处理", "提交时间　05-18 14:10", "最新回复　客服将在1个工作日内回复您", "orange", "48"],
    ];
    return frame({
      title: "工单记录",
      right: "提交工单",
      rightGo: "49",
      screenClass: "ticket-record-screen",
      assurance: false,
      content: `
        <span class="sr-only">工单记录页面，包含状态标签、搜索工单、工单列表、查看详情和客服帮助。</span>
        ${tabs(["全部", "待处理", "处理中", "已完成"], 0)}
        <button class="ticket-search" type="button" data-action="搜索工单">${icon("search", 24)}<span>搜索工单号 / 问题关键词</span></button>
        <section class="ticket-record-list">
          ${tickets.map(([no, title, tag, status, time, reply, color, target]) => `
            <article class="card ticket-record-card ${color}">
              <p>工单号　${no}</p>
              <h3>${title} ${chip(tag, color === "green" ? "green" : color)}</h3>
              ${chip(status, color)}
              <div>${icon("clock", 18)}<span>${time}</span></div>
              <div>${icon("message-circle", 18)}<span>${reply}</span></div>
              <button class="ticket-record-open" type="button" data-go="${target}" aria-label="查看工单详情">${icon("chevron-right", 24)}</button>
              <button class="ticket-record-action" type="button" data-go="${target}">查看详情</button>
            </article>
          `).join("")}
        </section>
        <section class="card ticket-help-card">
          <span>${icon("headphones", 34)}</span>
          <div><strong>需要帮助？</strong><small>专业客服为您提供支持</small></div>
          <div class="ticket-help-meta">
            <p>${icon("phone", 18)}<span>客服电话</span><b>400-888-1234</b></p>
            <p>${icon("clock", 18)}<span>服务时间</span><b>09:00-18:00</b></p>
          </div>
        </section>
      `,
    });
  }

  if (screen.id === "51") {
    const shortcuts = [
      ["file-text", "订单问题", "20"],
      ["wallet", "结算提现", "44"],
      ["shield-check", "资质认证", "03"],
      ["receipt-text", "发票开具", "13"],
    ];
    return `
      <div class="phone-screen support-chat-screen">
        ${statusBar()}
        ${appHeader({ title: "在线客服", right: "工单记录", rightGo: "50" })}
        <main class="phone-content no-pad support-chat-content">
          <section class="support-agent-card">
            <span class="support-agent-avatar"><img src="${assets.supportAgent}" alt="商户专属客服" /></span>
            <div class="support-agent-info">
              <h2>商户专属客服</h2>
              <span class="online-pill"><i></i>09:00-18:00 在线</span>
              <p>专业解答商户问题，助力您的业务发展</p>
            </div>
            <button class="support-phone" type="button" data-action="拨打客服电话">${icon("phone", 22)}400-888-1234</button>
          </section>
          <div class="chat-list support-chat-list">
            <div class="chat-time">今天　10:32</div>
            ${renderMerchantSupportMessages()}
          </div>
        </main>
        <div class="chat-shortcuts">
          ${shortcuts.map(([iconName, label, target]) => `<button type="button" data-go="${target}">${icon(iconName, 20)}${label}</button>`).join("")}
        </div>
        <div class="chat-input support-chat-input">
          <button class="icon-button" type="button" data-action="添加附件">${icon("plus", 30)}</button>
          <div class="support-input-wrap"><input placeholder="请输入问题..." /><button type="button" data-action="语音输入">${icon("mic", 26)}</button></div>
          <button class="primary-button" type="button" data-action="发送消息">发送</button>
        </div>
      </div>
    `;
  }

  if (screen.id === "52") {
    return frame({
      title: "常见问题详情",
      right: "联系客服",
      rightGo: "51",
      screenClass: "faq-detail-screen",
      assurance: false,
      content: `
        <span class="sr-only">常见问题详情页面，包含服务价格修改步骤、审核提示、是否解决反馈和相关问题入口。</span>
        <section class="card faq-article-card">
          <span class="faq-tag">服务管理</span>
          <h2>如何修改服务价格？</h2>
          <time>${icon("clock", 18)}更新于　2025-05-18</time>
          ${[
            ["1", "进入服务管理", "在底部导航点击服务，选择需要修改的服务项目，进入服务详情。"],
            ["2", "编辑价格信息", "点击编辑服务，在基础价格中调整金额，确认服务时长与价格说明。"],
            ["3", "提交审核", "价格修改后需重新提交平台审核，审核通过后将展示给客户。"],
          ].map(([num, title, desc]) => `
            <div class="faq-step">
              <i>${num}</i>
              <strong>${title}</strong>
              <p>${desc}</p>
            </div>
          `).join("")}
          <div class="faq-info-tip">${icon("info", 18)}<span>审核期间原服务价格仍可正常展示，审核通过后自动更新。</span></div>
        </section>
        <section class="card faq-solve-card">
          <h3>这个回答是否解决了您的问题？</h3>
          <div>
            <button type="button" data-action="常见问题已解决">${icon("thumbs-up", 22)}已解决</button>
            <button type="button" data-go="51">${icon("thumbs-down", 22)}仍需帮助</button>
          </div>
        </section>
        <section class="card faq-related-card">
          <h3 class="ticket-title">相关问题</h3>
          ${["客户取消预约后如何处理？", "结算周期是多久？", "发票开具需要多长时间？"].map((v) => `
            <button type="button" data-go="52">
              ${miniIcon("circle-help", "blue")}
              <span>${v}</span>
              ${icon("chevron-right", 18)}
            </button>
          `).join("")}
        </section>
      `,
    });
  }

  const isTicket = ["49", "50"].includes(screen.id);
  return frame({
    title: screen.title,
    right: isTicket ? "提交记录" : "工单记录",
    content: `
      ${isTicket ? `<section class="card form-section">
        <h3 class="section-title">${screen.id === "49" ? "问题类型" : "工单筛选"}</h3>
        <div class="selector-grid">${["订单问题", "结算提现", "资质认证", "发票开具", "系统故障", "其他问题"].map((v, i) => `<button class="choice ${i === 0 ? "active" : ""}">${icon(["clipboard-list", "wallet", "shield-check", "receipt-text", "bug", "circle-help"][i], 22)}${v}</button>`).join("")}</div>
      </section>` : ""}
      ${screen.id === "49" ? `<section class="card form-section"><h3 class="section-title">问题描述</h3><div class="textarea-like">请详细描述您遇到的问题，平台客服会尽快处理。</div><div class="upload-grid" style="margin-top:10px"><button class="upload-tile">${icon("plus", 22)}上传凭证</button><button class="upload-tile">${icon("image", 22)}截图</button></div></section>` : ""}
      <section class="card form-section">
        <h3 class="section-title">${isTicket ? "工单记录" : "快捷入口"}</h3>
        ${[
          ["在线客服", "实时咨询商户问题", "message-circle", "51"],
          ["提交问题工单", "复杂问题由专员跟进", "file-plus-2", "49"],
          ["工单记录", "查看历史处理进度", "folder-clock", "50"],
          ["常见问题", "入驻、订单、结算说明", "circle-help", "52"],
        ]
          .map(([title, sub, iconName, target]) => `<div class="list-row" data-go="${target}">${miniIcon(iconName, "blue")}<div><div class="title">${title}</div><div class="sub">${sub}</div></div>${icon("chevron-right", 18)}</div>`)
          .join("")}
      </section>
      ${screen.id === "49" ? `<div class="sticky-action two-actions"><button class="secondary-button">保存草稿</button><button class="primary-button">提交工单</button></div>` : ""}
    `,
  });
}

function merchantSupportReply(text) {
  const normalized = String(text || "").trim();
  if (/提现|结算|到账|余额/.test(normalized)) return "已收到您的结算提现问题。请在「结算提现」查看处理进度；如超过3个工作日未到账，我会为您生成工单并转交财务核查。";
  if (/订单|预约|客户|服务/.test(normalized)) return "已收到您的订单问题。您可以提供订单号，我会帮您核对预约状态、客户信息和服务流转记录。";
  if (/资质|认证|审核/.test(normalized)) return "资质认证问题已记录。请确认营业执照、服务资质和联系人信息完整，平台审核进度可在认证资质页查看。";
  if (/发票|开票/.test(normalized)) return "发票问题已收到。请在发票信息中确认发票抬头、税号和开票订单，我可以继续协助核对。";
  return "已收到，我会按商户客服流程继续跟进。您也可以补充订单号、服务名称或截图信息，便于更快处理。";
}

function renderMerchantSupportMessages() {
  return merchantSupportChatState.messages.map((message) => {
    if (message.role === "merchant") {
      return `
        <div class="chat-message me">
          <div class="chat-bubble">${escapeHtml(message.text)}</div>
          <span class="merchant-user-avatar">${icon("user", 24)}</span>
        </div>
      `;
    }
    return `
      <div class="chat-message">
        <span class="avatar support-mini-avatar"><img src="${assets.supportAgent}" alt="客服" /></span>
        <div class="chat-bubble">${escapeHtml(message.text)}</div>
      </div>
    `;
  }).join("");
}

function appendMerchantSupportMessage(text) {
  const cleanText = String(text || "").trim();
  if (!cleanText) return "";
  const reply = merchantSupportReply(cleanText);
  merchantSupportChatState.messages.push({ role: "merchant", text: cleanText }, { role: "agent", text: reply });
  const thread = phoneEl.querySelector(".support-chat-list");
  if (thread) {
    thread.insertAdjacentHTML("beforeend", `
      <div class="chat-message me">
        <div class="chat-bubble">${escapeHtml(cleanText)}</div>
        <span class="merchant-user-avatar">${icon("user", 24)}</span>
      </div>
      <div class="chat-message">
        <span class="avatar support-mini-avatar"><img src="${assets.supportAgent}" alt="客服" /></span>
        <div class="chat-bubble">${escapeHtml(reply)}</div>
      </div>
    `);
    scrollMerchantSupportToLatest();
    if (window.lucide) lucide.createIcons();
  }
  return "";
}

function scrollMerchantSupportToLatest() {
  window.requestAnimationFrame(() => {
    const content = phoneEl.querySelector(".support-chat-content");
    const list = phoneEl.querySelector(".support-chat-list");
    if (content) content.scrollTop = content.scrollHeight;
    if (list) list.scrollTop = list.scrollHeight;
    list?.lastElementChild?.scrollIntoView?.({ block: "end", behavior: "smooth" });
  });
}

function renderSettings(screen) {
  const id = screen.id;
  if (id === "61") {
    const passBoxes = () => `<div class="merchant-pay-passboxes">${Array.from({ length: 6 }, () => `<span><i></i></span>`).join("")}</div>`;
    return frame({
      title: "设置支付密码",
      right: "安全帮助",
      rightGo: "09",
      screenClass: "payment-password-screen",
      assurance: false,
      content: `
        <div class="payment-password-tip">${icon("info", 18)}<span>支付密码用于提现、修改结算账户等敏感操作</span><button type="button" data-action="关闭安全提示">${icon("x", 18)}</button></div>
        <section class="card payment-password-hero">
          <span class="state-icon orange">${icon("lock-keyhole", 48)}</span>
          <div>
            <h2>未设置支付密码</h2>
            <p>设置后提现与账户变更需二次确认</p>
          </div>
        </section>
        <section class="card payment-password-card payment-verify-card">
          <h3><span></span>身份验证</h3>
          <div class="payment-form-row">
            ${miniIcon("smartphone", "blue")}
            <strong>绑定手机号</strong>
            <em>138 **** 8888</em>
          </div>
          <div class="payment-form-row payment-code-row">
            ${miniIcon("shield-check", "blue")}
            <strong>短信验证码</strong>
            <label><input placeholder="请输入验证码" aria-label="短信验证码" /></label>
            <button type="button" data-action="获取验证码">获取验证码</button>
          </div>
          <div class="payment-form-row payment-password-input">
            ${miniIcon("lock-keyhole", "blue")}
            <strong>登录密码</strong>
            <label><input type="password" placeholder="请输入登录密码" aria-label="登录密码" /></label>
            <button type="button" data-action="显示或隐藏登录密码">${icon("eye-off", 18)}</button>
          </div>
        </section>
        <section class="card payment-password-card payment-pass-card">
          <h3><span></span>设置6位支付密码</h3>
          ${passBoxes()}
          <b>确认支付密码</b>
          ${passBoxes()}
        </section>
        <section class="card payment-password-card payment-safe-card">
          <h3><span></span>安全建议</h3>
          ${["不要使用连续数字", "不要与登录密码相同", "请勿告知他人"].map((text) => `<p>${icon("circle-check", 16)}<span>${text}</span></p>`).join("")}
        </section>
        <div class="sticky-action payment-password-submit"><button class="primary-button" type="button" data-action="确认设置支付密码">确认设置</button></div>
      `,
    });
  }

  if (id === "59") {
    return frame({
      title: "换绑手机号",
      right: "安全帮助",
      rightGo: "09",
      screenClass: "phone-rebind-screen",
      assurance: false,
      content: `
        <div class="account-tip">${icon("info", 18)}<span>更换手机号后，将用于登录、提现验证和重要通知</span></div>
        <div class="rebind-stepper">
          ${[
            ["1", "验证当前手机号", true],
            ["2", "绑定新手机号", false],
            ["3", "完成", false],
          ]
            .map(([num, label, active]) => `<div class="${active ? "active" : ""}"><b>${num}</b><span>${label}</span></div>`)
            .join("")}
        </div>
        <section class="card rebind-card current-phone-card">
          <h3><span></span>当前手机号</h3>
          <div class="current-phone-number">${miniIcon("smartphone", "blue")}<strong>138 **** 8888</strong></div>
          <div class="rebind-code-row">
            <strong>短信验证码</strong>
            <label><input placeholder="请输入验证码" aria-label="当前手机号验证码" /></label>
            <button type="button" data-action="获取当前手机号验证码">获取验证码</button>
          </div>
          <p>验证码将发送至 138 **** 8888</p>
        </section>
        <section class="card rebind-card">
          <h3><span></span>身份验证</h3>
          <div class="rebind-verify-row password">
            ${miniIcon("lock-keyhole", "blue")}
            <strong>登录密码</strong>
            <label><input type="password" placeholder="请输入登录密码" aria-label="登录密码" /></label>
            <button type="button" data-action="显示或隐藏登录密码">${icon("eye-off", 18)}</button>
          </div>
          <button class="rebind-verify-row" type="button" data-action="人脸验证">
            ${miniIcon("scan-face", "blue")}
            <strong>人脸验证</strong>
            <em>已开启</em>
            ${icon("chevron-right", 18)}
          </button>
        </section>
        <section class="card rebind-card rebind-safe-card">
          <h3><span></span>安全提示</h3>
          <div>${miniIcon("shield-check", "blue")}<ul><li>验证通过后可绑定新手机号</li><li>若当前手机号无法接收验证码，请联系客服人工处理</li></ul></div>
        </section>
        <div class="sticky-action account-submit"><button class="primary-button" type="button" data-action="下一步绑定新手机号">下一步</button></div>
      `,
    });
  }

  if (id === "60") {
    return frame({
      title: "修改登录密码",
      right: "安全帮助",
      rightGo: "09",
      screenClass: "login-password-screen",
      assurance: false,
      content: `
        <section class="card login-password-hero">
          <span class="state-icon blue">${icon("lock-keyhole", 48)}</span>
          <div>
            <h2>定期修改密码，提升账户安全</h2>
            <p>${icon("clock", 17)}上次修改：2025-04-18</p>
          </div>
        </section>
        <section class="card password-card">
          <h3><span></span>密码信息</h3>
          ${[
            ["当前密码", "请输入当前登录密码"],
            ["新密码", "请输入8-20位新密码"],
            ["确认新密码", "请再次输入新密码"],
          ]
            .map(
              ([label, placeholder]) => `
                <div class="password-input-row">
                  <strong>${label}</strong>
                  <input type="password" placeholder="${placeholder}" aria-label="${label}" />
                  <button type="button" data-action="显示或隐藏${label}">${icon("eye-off", 18)}</button>
                </div>
              `,
            )
            .join("")}
          <div class="password-strength"><span>强度：<b>中</b></span><i class="blue"></i><i class="blue"></i><i class="orange"></i><i></i><i></i></div>
        </section>
        <section class="card password-card password-rules-card">
          <h3><span></span>密码规则</h3>
          ${["8-20位字符", "包含数字和字母", "不可与手机号相同", "不可使用连续数字"].map((text) => `<p>${icon("circle-check", 16)}<span>${text}</span></p>`).join("")}
        </section>
        <section class="card password-card password-verify-card">
          <h3><span></span>验证方式</h3>
          <div class="rebind-code-row">
            <strong>手机验证码</strong>
            <label><input placeholder="请输入验证码" aria-label="手机验证码" /></label>
            <button type="button" data-action="获取登录密码验证码">获取验证码</button>
          </div>
          <p>验证码将发送至 138 **** 8888</p>
        </section>
        <div class="sticky-action account-submit"><button class="primary-button" type="button" data-action="确认修改登录密码">确认修改</button></div>
      `,
    });
  }

  if (id === "68") {
    return frame({
      title: "忘记密码",
      right: "安全帮助",
      rightGo: "09",
      screenClass: "forgot-password-screen",
      assurance: false,
      content: `
        <div class="forgot-stepper">
          ${[
            ["1", "验证身份", true],
            ["2", "设置新密码", false],
            ["3", "完成", false],
          ].map(([num, label, active]) => `<div class="${active ? "active" : ""}"><b>${num}</b><span>${label}</span></div>`).join("")}
        </div>
        <section class="card forgot-card">
          <h3><span></span>身份验证</h3>
          <div class="forgot-row">
            <strong>手机号</strong>
            <em>138&nbsp;&nbsp;****&nbsp;&nbsp;8888</em>
          </div>
          <div class="forgot-row forgot-code-row">
            <strong>短信验证码</strong>
            <label><input placeholder="请输入验证码" aria-label="短信验证码" /></label>
            <button type="button" data-action="获取忘记密码验证码">获取验证码</button>
          </div>
          <div class="forgot-row">
            <strong>机构名称</strong>
            <label><input placeholder="请输入商户机构名称" aria-label="机构名称" /></label>
          </div>
        </section>
        <section class="card forgot-card forgot-new-card">
          <h3><span></span>设置新密码</h3>
          <div class="forgot-row">
            <strong>新密码</strong>
            <label><input type="password" placeholder="请输入8-20位新密码" aria-label="新密码" /></label>
            <button type="button" data-action="显示或隐藏新密码">${icon("eye", 22)}</button>
          </div>
          <div class="forgot-row">
            <strong>确认新密码</strong>
            <label><input type="password" placeholder="请再次输入新密码" aria-label="确认新密码" /></label>
            <button type="button" data-action="显示或隐藏确认新密码">${icon("eye", 22)}</button>
          </div>
        </section>
        <section class="card forgot-card forgot-safe-card">
          <h3><span></span>安全提示</h3>
          <div>
            <span class="forgot-shield">${icon("check", 42)}</span>
            <p>若手机号已不可用，请联系平台客服进行人工身份核验。<br /><button type="button" data-action="拨打平台客服电话">${icon("phone", 22)}400-888-1234</button></p>
          </div>
        </section>
        <div class="sticky-action forgot-submit"><button class="primary-button" type="button" data-action="确认重置密码">确认重置密码</button></div>
      `,
    });
  }

  if (id === "68" || ["59", "60", "61"].includes(id)) {
    const title = id === "68" ? "忘记密码" : screen.title;
    const fields =
      id === "59"
        ? [
            ["当前手机号", "138 **** 8888"],
            ["短信验证码", "请输入验证码"],
            ["新手机号", "请输入新手机号"],
          ]
        : id === "61"
          ? [
              ["验证身份", "绑定手机 138 **** 8888"],
              ["设置支付密码", "请输入 6 位数字"],
              ["确认支付密码", "请再次输入"],
            ]
          : [
              ["手机号", "138 **** 8888"],
              ["验证码", "请输入验证码"],
              ["新密码", "请输入新密码"],
              ["确认密码", "请再次输入"],
            ];
    return frame({
      title,
      right: id === "68" ? "安全帮助" : "安全帮助",
      content: `
        <section class="card success-state">
          <span class="state-icon blue">${icon("lock-keyhole", 42)}</span>
          <h2>${title}</h2>
          <p class="muted">定期修改密码，提升账户安全。</p>
        </section>
        <section class="card form-section">
          <h3 class="section-title">身份验证</h3>
          ${fields.map(([label, value], index) => field(label, value, { muted: index > 0, suffix: label.includes("验证码") ? `<button class="secondary-button" style="min-height:30px;padding:0 8px">获取验证码</button>` : "" })).join("")}
        </section>
        <section class="card form-section">
          <h3 class="section-title">安全提示</h3>
          ${["请勿向任何人透露验证码", "密码建议包含数字和字母", "如非本人操作请联系客服"].map((v) => `<div class="info-line">${icon("circle-check", 14)}<span>${v}</span></div>`).join("")}
        </section>
        <div class="sticky-action"><button class="primary-button">确认修改</button></div>
      `,
    });
  }

  if (id === "62") {
    const devices = [
      ["smartphone", "iPhone 15 Pro", "当前设备", "blue", "昆明", "今天 09:41", "本机", "soft"],
      ["chrome", "Chrome 浏览器", "已登录", "green", "昆明", "昨天 20:12", "退出", "outline"],
      ["tablet", "iPad Pro", "已离线", "gray", "昆明", "05-18  11:30", "移除", "outline"],
    ];
    const safetyRows = [
      ["bell", "新设备登录提醒", "开启后，新设备登录时将收到提醒", true],
      ["shield-check", "异常登录保护", "开启后，异常登录将进行身份验证", true],
      ["lock-keyhole", "30天免验证", "信任设备30天内登录无需验证", false],
    ];
    return frame({
      title: "设备管理",
      right: "安全帮助",
      rightGo: "09",
      screenClass: "device-manage-screen",
      assurance: false,
      content: `
        <section class="card device-hero-card">
          <span class="device-hero-icon">${icon("lock-keyhole", 58)}</span>
          <div class="device-hero-info">
            <p>${icon("smartphone", 21)}<span>当前设备</span><strong>iPhone 15 Pro</strong>${chip("当前设备", "blue")}</p>
            <p>${icon("map-pin", 21)}<span>登录地点</span><strong>昆明</strong></p>
            <p>${icon("clock", 21)}<span>登录时间</span><strong>今天&nbsp;&nbsp;09:41</strong></p>
          </div>
        </section>
        <section class="card device-card">
          <h3 class="device-section-title">已登录设备</h3>
          <div class="device-list">
            ${devices.map(([iconName, title, state, tone, city, time, action, actionTone]) => `
              <div class="device-row">
                <span class="device-icon ${tone}">${icon(iconName, 32)}</span>
                <div class="device-row-main">
                  <strong>${title}</strong>${chip(state, tone)}
                  <p>${icon("map-pin", 17)}<span>${city}</span>${icon("clock", 17)}<span>${time}</span></p>
                </div>
                <button class="${actionTone}" type="button" data-action="${action}${title}">${action}</button>
              </div>
            `).join("")}
          </div>
        </section>
        <section class="card device-card">
          <h3 class="device-section-title">设备安全</h3>
          <div class="device-safe-list">
            ${safetyRows.map(([iconName, title, desc, active]) => `
              <div class="device-safe-row">
                <span class="device-icon ${active ? "blue" : "gray"}">${icon(iconName, 30)}</span>
                <div><strong>${title}</strong><p>${desc}</p></div>
                <button class="device-switch ${active ? "on" : ""}" type="button" data-action="${active ? "关闭" : "开启"}${title}" aria-label="${title}"></button>
              </div>
            `).join("")}
          </div>
        </section>
        <p class="device-warning">${icon("circle-alert", 20)}<span>退出陌生设备后，该设备需重新登录并验证身份</span></p>
        <button class="device-danger-button" type="button" data-action="退出其他设备">${icon("log-out", 24)}<span>退出其他设备</span></button>
      `,
    });
  }

  if (id === "63") {
    const state = merchantRealPageState.privacy;
    const privacy = state.data || {
      managementRows: [
        { key: "collection", iconName: "user", title: "个人信息收集清单", desc: "查看平台收集的商户资料", color: "blue", detail: "正在加载个人信息收集清单。" },
        { key: "sharing", iconName: "shield-check", title: "第三方信息共享清单", desc: "查看支付、地图、消息共享场景", color: "green", detail: "正在加载第三方信息共享清单。" },
        { key: "export", iconName: "download", title: "个人信息导出", desc: "可导出", color: "purple", exportAction: true },
        { key: "cancelAccount", iconName: "user-x", title: "注销账号", desc: "需联系客服处理", color: "red", route: "09", danger: true },
      ],
      authorizationRows: [
        { key: "phoneAuth", iconName: "smartphone", title: "手机号授权", value: "已授权", color: "blue" },
        { key: "wechatBinding", iconName: "message-circle", title: "微信账号绑定", value: "已绑定", color: "green" },
        { key: "faceVerification", iconName: "scan-face", title: "人脸验证", value: "已开启", color: "purple" },
        { key: "locationAuth", iconName: "map-pin", title: "位置授权", value: "使用期间允许", color: "orange" },
      ],
      messageRows: [
        { key: "orderReminder", iconName: "bell", title: "接收订单提醒", desc: "订单状态变更、服务提醒等", enabled: true, color: "blue" },
        { key: "marketingNotice", iconName: "megaphone", title: "接收营销通知", desc: "优惠活动、新功能等通知", enabled: false, color: "green" },
        { key: "onlineStatusVisible", iconName: "eye", title: "展示在线状态", desc: "向客户展示您的在线接单状态", enabled: true, color: "purple" },
        { key: "supportContactAllowed", iconName: "headphones", title: "允许客服联系", desc: "客服可通过电话或在线方式联系您", enabled: true, color: "orange" },
      ],
      safeText: "正在加载数据安全说明。",
    };
    const privacySwitch = (on) => `<span class="merchant-privacy-switch ${on ? "on" : ""}"><i></i></span>`;
    const detailRow = (privacy.managementRows || []).find((row) => row.key === state.detailKey);
    const renderManagementRow = (row) => {
      const attrs = row.exportAction
        ? "data-merchant-privacy-export"
        : row.route
          ? `data-go="${row.route}"`
          : `data-merchant-privacy-detail="${escapeHtml(row.key)}"`;
      return `
        <button class="merchant-privacy-row ${row.danger ? "danger" : ""}" type="button" ${attrs}>
          ${miniIcon(row.iconName || "shield", row.color || "blue")}
          <div>
            <strong>${escapeHtml(row.title)}</strong>
            ${row.desc ? `<span>${escapeHtml(row.desc)}</span>` : ""}
          </div>
          <em>${icon("chevron-right", 18)}</em>
        </button>
      `;
    };
    return frame({
      title: "隐私设置",
      right: "隐私政策",
      rightGo: "66",
      screenClass: "privacy-settings-screen",
      assurance: false,
      content: `
        ${merchantApiPanel(state, "隐私设置")}
        <section class="card merchant-privacy-card">
          <h3><span></span>个人信息管理</h3>
          ${(privacy.managementRows || []).map(renderManagementRow).join("")}
        </section>
        ${detailRow ? `
          <section class="card merchant-privacy-safe">
            <h3><span></span>${escapeHtml(detailRow.title)}</h3>
            <div>
              <span class="state-icon ${escapeHtml(detailRow.color || "blue")}">${icon(detailRow.iconName || "info", 28)}</span>
              <p>${escapeHtml(detailRow.detail || detailRow.desc || "")}</p>
            </div>
          </section>
        ` : ""}
        <section class="card merchant-privacy-card">
          <h3><span></span>权限与授权</h3>
          ${(privacy.authorizationRows || []).map((row) => `
            <div class="merchant-privacy-row">
              ${miniIcon(row.iconName || "shield-check", row.color || "blue")}
              <div><strong>${escapeHtml(row.title)}</strong></div>
              <em>${escapeHtml(row.value || "")}</em>
            </div>
          `).join("")}
        </section>
        <section class="card merchant-privacy-card merchant-privacy-message">
          <h3><span></span>消息与展示</h3>
          ${(privacy.messageRows || []).map((row) => `
            <button class="merchant-privacy-row" type="button" data-merchant-privacy-toggle="${escapeHtml(row.key)}" aria-pressed="${row.enabled ? "true" : "false"}">
              ${miniIcon(row.iconName || "bell", row.color || "blue")}
              <div>
                <strong>${escapeHtml(row.title)}</strong>
                ${row.desc ? `<span>${escapeHtml(row.desc)}</span>` : ""}
              </div>
              <em>${privacySwitch(row.enabled)}</em>
            </button>
          `).join("")}
        </section>
        <section class="card merchant-privacy-safe">
          <h3><span></span>数据安全说明</h3>
          <div>
            <span class="state-icon blue">${icon("shield-plus", 28)}</span>
            <p>${escapeHtml(privacy.safeText || "平台仅在必要场景使用商户信息，并通过加密传输保护数据安全。")}</p>
          </div>
        </section>
        <div class="sticky-action merchant-privacy-save"><button class="primary-button" type="button" data-merchant-privacy-save>保存隐私设置</button></div>
      `,
    });
  }

  if (id === "64") {
    const state = merchantRealPageState.permissions;
    const payload = state.data || {
      tip: "关闭部分权限可能影响订单导航、上传凭证和客服沟通",
      permissionCards: [
        { key: "location", iconName: "map-pin", title: "位置权限", status: "使用期间允许", tag: "推荐", desc: "用于计算客户距离、导航到客户地址", actionText: "关闭", color: "green" },
        { key: "photoCamera", iconName: "image", title: "相册与相机权限", status: "允许访问部分照片", tag: "建议开启", desc: "用于上传服务照片、资质文件与售后凭证", actionText: "管理", color: "purple", warn: true },
        { key: "notification", iconName: "bell", title: "通知权限", status: "已开启", tag: "正常", desc: "用于接收新订单、服务开始、结算到账提醒", actionText: "关闭", color: "blue" },
        { key: "microphone", iconName: "mic", title: "麦克风权限", status: "未开启", tag: "建议开启", desc: "用于在线客服语音沟通", actionText: "开启", color: "orange", warn: true },
      ],
      permissionRecords: [
        { id: "permission-record-location", iconName: "map-pin", title: "位置", action: "订单导航", time: "今天 09:40", color: "green" },
        { id: "permission-record-camera", iconName: "camera", title: "相机", action: "上传完成凭证", time: "今天 10:55", color: "purple" },
        { id: "permission-record-album", iconName: "image", title: "相册", action: "上传资质文件", time: "05-18", color: "blue" },
      ],
    };
    return frame({
      title: "权限设置",
      right: "权限说明",
      rightGo: "66",
      screenClass: "permission-settings-screen",
      assurance: false,
      content: `
        ${merchantApiPanel(state, "权限设置")}
        ${state.tipVisible ? `<div class="permission-tip">${icon("info", 18)}<span>${escapeHtml(payload.tip || "")}</span><button type="button" data-merchant-permission-tip-close aria-label="关闭权限提示">${icon("x", 18)}</button></div>` : ""}
        <div class="permission-card-list">
          ${(payload.permissionCards || [])
            .map(
              (row) => `
                <section class="card permission-card ${escapeHtml(row.color || "blue")}">
                  ${miniIcon(row.iconName || "shield-check", row.color || "blue")}
                  <div>
                    <h3>${escapeHtml(row.title)}</h3>
                    <p><span>${escapeHtml(row.status)}</span><em class="${row.warn ? "warn" : ""}">${escapeHtml(row.tag || "")}</em></p>
                    <small>${escapeHtml(row.desc || "")}</small>
                  </div>
                  <button type="button" data-merchant-permission-toggle="${escapeHtml(row.key)}">${escapeHtml(row.actionText || "管理")}</button>
                  ${icon("chevron-right", 18)}
                </section>
              `,
            )
            .join("")}
        </div>
        <section class="card permission-record-card">
          <h3><span></span>权限记录</h3>
          ${(payload.permissionRecords || [])
            .map(
              (row) => `
                <div class="permission-record-row">
                  ${miniIcon(row.iconName || "shield-check", row.color || "blue")}
                  <strong>${escapeHtml(row.title)}</strong>
                  <span>${escapeHtml(row.action)}</span>
                  <em>${escapeHtml(row.time)}</em>
                  ${icon("chevron-right", 18)}
                </div>
              `,
            )
            .join("")}
        </section>
        <div class="sticky-action permission-submit"><button class="primary-button" type="button" data-merchant-permissions-done>完成</button></div>
      `,
    });
  }

  if (id === "65") {
    const languageOptions = [
      ["简体中文", "当前使用", true],
      ["繁體中文", "", false],
      ["English", "", false],
    ];
    const assistRows = [
      ["bold", "加粗文字", "开启后将加粗关键文字内容", false],
      ["contrast", "高对比度", "开启后增强文字与背景对比度", false],
      ["smartphone", "跟随系统", "字体大小跟随系统显示设置", true],
    ];
    return frame({
      title: "语言与字体",
      right: "恢复默认",
      rightGo: "65",
      screenClass: "language-font-screen",
      assurance: false,
      content: `
        <section class="card merchant-language-card">
          <h3><span></span>语言</h3>
          <div class="merchant-language-options">
            ${languageOptions
              .map(
                ([label, right, active]) => `
                  <button class="merchant-language-option ${active ? "active" : ""}" type="button" data-action="切换语言：${label}">
                    <i></i>
                    <strong>${label}</strong>
                    ${right ? `<em>${right}</em>` : ""}
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>
        <section class="card merchant-font-card">
          <h3><span></span>字体大小</h3>
          <p>订单信息与服务提醒将按此字号显示</p>
          <div class="merchant-font-segments">
            ${["小", "标准", "大", "超大"].map((label) => `<button class="${label === "标准" ? "active" : ""}" type="button" data-action="选择字号：${label}">${label}</button>`).join("")}
          </div>
          <div class="merchant-font-slider">
            <b>A</b>
            <button type="button" data-action="减小字号">${icon("minus", 18)}</button>
            <div><span></span><i></i></div>
            <button type="button" data-action="增大字号">${icon("plus", 18)}</button>
            <strong>A+</strong>
          </div>
        </section>
        <section class="card merchant-font-preview">
          <h3><span></span>显示效果预览</h3>
          <div class="merchant-preview-row">
            <span>${icon("calendar-check", 28)}</span>
            <div>
              <strong>新预约待确认</strong>
              <p>李奶奶预约了居家护理服务，请在30分钟内确认。</p>
            </div>
            <button type="button" data-go="23">去确认</button>
          </div>
        </section>
        <section class="card merchant-assist-card">
          <h3><span></span>辅助显示</h3>
          ${assistRows
            .map(
              ([iconName, title, sub, on]) => `
                <button class="merchant-assist-row" type="button" data-action="${title}">
                  ${miniIcon(iconName, "blue")}
                  <div><strong>${title}</strong><small>${sub}</small></div>
                  <em class="merchant-privacy-switch ${on ? "on" : ""}"><i></i></em>
                </button>
              `,
            )
            .join("")}
        </section>
        <div class="sticky-action merchant-language-save"><button class="primary-button" type="button" data-action="保存设置">保存设置</button></div>
      `,
    });
  }

  if (id === "66") {
    const importantRules = [
      ["user-check", "商户服务规范", "服务标准、人员要求与服务流程规范", "blue"],
      ["clipboard-list", "订单履约规则", "接单确认、服务执行与服务完成要求", "green"],
      ["badge-percent", "报价与价格规则", "报价要求、价格公示与价格调整规定", "orange"],
      ["headphones", "售后处理规则", "投诉处理、退款退单与争议解决流程", "purple"],
      ["wallet", "结算与提现规则", "结算周期、费用说明与提现操作规范", "blue"],
      ["receipt-text", "发票开具规则", "发票类型、开票要求与发票管理说明", "orange"],
    ];
    const recentRules = [
      ["2025-05-18", "服务履约超时处理说明"],
      ["2025-05-16", "结算周期与费用说明"],
      ["2025-05-12", "商户资质审核材料要求"],
    ];
    return frame({
      title: "平台规则",
      right: "搜索",
      rightGo: "66",
      screenClass: "platform-rules-screen",
      assurance: false,
      content: `
        <label class="platform-rule-search">
          ${icon("search", 24)}
          <input placeholder="搜索规则关键词" aria-label="搜索规则关键词" />
        </label>
        <section class="card platform-rule-card">
          <h3 class="platform-rule-title">重要规则</h3>
          <div class="platform-rule-list">
            ${importantRules.map(([iconName, title, sub, color]) => `
              <button type="button" data-action="查看${title}">
                ${miniIcon(iconName, color)}
                <span><strong>${title}</strong><small>${sub}</small></span>
                ${icon("chevron-right", 22)}
              </button>
            `).join("")}
          </div>
        </section>
        <section class="card platform-rule-card platform-update-card">
          <h3 class="platform-rule-title">近期更新</h3>
          ${recentRules.map(([date, title]) => `
            <button type="button" data-action="查看${title}">
              <i></i>
              <time>${date}</time>
              <strong>${title}</strong>
              <em>查看详情</em>
              ${icon("chevron-right", 18)}
            </button>
          `).join("")}
        </section>
        <section class="card platform-rule-card platform-summary-card">
          <h3 class="platform-rule-title">服务规范摘要</h3>
          <ol>
            <li>商户应在规定时间内确认预约；</li>
            <li>服务人员上门需完成身份核验；</li>
            <li>服务完成需上传真实凭证；</li>
            <li>不得夸大服务效果或诱导客户线下交易。</li>
          </ol>
        </section>
        <div class="sticky-action platform-rule-actions two-actions">
          <button class="secondary-button" type="button" data-go="09">${icon("headphones", 24)}联系客服</button>
          <button class="primary-button" type="button" data-action="确认已了解平台规则">${icon("shield-check", 24)}我已了解</button>
        </div>
      `,
    });
  }

  if (id === "63" || id === "64" || id === "66") {
    const maps = {
      "63": [
        ["user-round", "个人信息管理", "个人头像、联系方式、实名认证", "blue"],
        ["bell", "消息通知", "预约、订单、系统通知", "orange"],
        ["shield", "隐私保护", "展示范围、搜索可见性", "green"],
      ],
      "64": [
        ["map-pin", "位置权限", "使用期间允许", "green"],
        ["image", "相册与相机权限", "上传服务图片和资质材料", "purple"],
        ["bell", "通知权限", "订单和审核消息提醒", "blue"],
        ["mic", "麦克风权限", "在线客服语音", "orange"],
      ],
      "66": [
        ["book-open", "商户服务规范", "接单、履约、售后规则", "blue"],
        ["receipt-text", "订单结算规则", "结算周期与手续费说明", "orange"],
        ["shield-check", "资质审核规则", "资质更新与有效期", "green"],
      ],
    };
    return frame({
      title: screen.title,
      right: id === "66" ? "搜索" : "保存",
      content: `
        <section class="card settings-group">
          ${maps[id].map(([iconName, title, sub, color]) => settingRow(iconName, title, sub, color, id === "64" ? `<button class="secondary-button" style="min-height:28px;padding:0 8px">管理</button>` : icon("chevron-right", 18))).join("")}
        </section>
        ${id === "66" ? `<section class="card form-section"><h3 class="section-title">近期更新</h3>${["2026-05-18 服务履约规范更新", "2026-05-12 结算规则说明调整", "2026-04-30 隐私政策更新"].map((v) => `<div class="list-row">${miniIcon("file-text", "blue")}<div><div class="title">${v}</div><div class="sub">点击查看详情</div></div>${icon("chevron-right", 18)}</div>`).join("")}</section>` : `<div class="sticky-action"><button class="primary-button">保存设置</button></div>`}
      `,
    });
  }

  if (id === "07") {
    const state = merchantRealPageState.security;
    const security = state.data || {
      level: "高",
      score: 92,
      lastLogin: "今天 09:41",
      lastLocation: "昆明",
      phoneMasked: "138 **** 8888",
      loginPassword: "已设置",
      paymentPassword: "未设置",
      wechat: "已绑定",
      faceVerification: "已开启",
      twoFactorEnabled: false,
      devices: [
        { icon: "smartphone", title: "iPhone 15 Pro", location: "昆明", loginAt: "今日 09:41", status: "当前设备", color: "blue" },
        { icon: "chrome", title: "Chrome 浏览器", location: "昆明", loginAt: "昨天 20:12", status: "已登录", color: "green" },
      ],
    };
    const verifyRows = [
      { iconName: "smartphone", title: "绑定手机号", value: security.phoneMasked, suffix: chip("已绑定", "green"), target: "59", color: "blue" },
      { iconName: "lock-keyhole", title: "登录密码", value: security.loginPassword, suffix: `<b>修改</b>`, target: "60", color: "green" },
      { iconName: "lock", title: "支付密码", value: security.paymentPassword, suffix: `<b>去设置</b>`, target: "61", color: "orange" },
      { iconName: "message-circle", title: "微信账号", value: security.wechat, suffix: "", target: "63", color: "green" },
      { iconName: "scan-face", title: "人脸验证", value: security.faceVerification, suffix: "", target: "63", color: "purple" },
    ];
    const devices = Array.isArray(security.devices) ? security.devices : [];
    return frame({
      title: "账户安全",
      right: "安全帮助",
      rightGo: "09",
      screenClass: "account-security-screen",
      content: `
        ${merchantApiPanel(state, "账户安全")}
        <section class="card account-security-hero">
          <span class="account-shield">${icon("check", 54)}</span>
          <div class="account-security-copy">
            <h2>账户安全等级 <b>${escapeHtml(security.level || "高")}</b></h2>
            <div class="account-security-progress"><i style="width:${Math.max(0, Math.min(100, Number(security.score || 0)))}%"></i><strong>${Number(security.score || 0)}%</strong></div>
            <p>上次登录：${escapeHtml(security.lastLogin || "-")}　${escapeHtml(security.lastLocation || "-")}</p>
          </div>
          <div class="account-security-tip">${miniIcon("shield-check", "blue")}<span>安全等级越高，账户越安全，请继续保持良好安全习惯</span></div>
        </section>
        <section class="card account-security-card">
          <h3 class="account-section-title">登录与验证</h3>
          ${verifyRows.map((row) => `
            <button class="account-security-row" type="button" data-go="${row.target}">
              ${miniIcon(row.iconName, row.color)}
              <strong>${escapeHtml(row.title)}</strong>
              <span>${escapeHtml(row.value || "")}</span>
              <em>${row.suffix}</em>
              ${icon("chevron-right", 18)}
            </button>
          `).join("")}
        </section>
        <section class="card account-security-card account-devices-card">
          <h3 class="account-section-title">设备管理</h3>
          ${devices.map((device) => `
            <button class="account-device-row" type="button" data-go="62">
              ${miniIcon(device.icon || "smartphone", device.color || "blue")}
              <span><strong>${escapeHtml(device.title || "登录设备")}</strong><small>${escapeHtml(`${device.location || ""}　${device.loginAt || ""}`)}</small></span>
              <em>${chip(device.status || "已登录", device.color || "blue")}</em>
              ${icon("chevron-right", 18)}
            </button>
          `).join("")}
          <button class="account-manage-device" type="button" data-go="62">管理设备 ${icon("chevron-right", 18)}</button>
        </section>
        <section class="card account-security-card account-reminder-card">
          <h3 class="account-section-title">安全提醒</h3>
          <button type="button" data-merchant-security-toggle="twoFactorEnabled" aria-pressed="${security.twoFactorEnabled ? "true" : "false"}">
            ${miniIcon("info", "orange")}
            <span>${security.twoFactorEnabled ? "双重验证已开启，提现与修改资料会二次确认" : "开启双重验证后，提现与修改资料需二次确认"}</span>
            <strong>${security.twoFactorEnabled ? "已开启" : "立即开启"}</strong>
            ${icon("chevron-right", 18)}
          </button>
        </section>
        <div class="account-danger-actions">
          <button class="secondary-button" type="button" data-merchant-security-logout-devices>${icon("log-out", 22)}退出其他设备</button>
          <button class="danger-button" type="button" data-go="63">注销账号</button>
        </div>
      `,
    });
  }

  if (id === "08") {
    const state = merchantRealPageState.settings;
    const settings = state.data || {
      notificationRows: [
        { key: "order", label: "订单提醒", desc: "新订单、订单状态变更等提醒", enabled: true },
        { key: "serviceStart", label: "服务开始提醒", desc: "服务即将开始、开始服务等提醒", enabled: true },
        { key: "settlement", label: "结算到账提醒", desc: "结算完成、收入到账等提醒", enabled: true },
        { key: "marketing", label: "营销活动通知", desc: "平台优惠、活动推送等通知", enabled: false },
      ],
      commonRows: [
        { key: "cacheSizeMb", label: "清理缓存", value: "128MB", action: "clearCache" },
        { key: "language", label: "语言", value: "简体中文", route: "65" },
        { key: "fontSize", label: "字体大小", value: "标准", route: "65" },
        { key: "darkMode", label: "深色模式", value: "跟随系统", action: "darkMode" },
      ],
      appVersion: "v1.8.2",
    };
    const notifyRows = settings.notificationRows || [];
    const linkRows = [
      { iconName: "shield-check", title: "隐私设置", value: settings.privacy?.profileVisible || "", target: "63", color: "blue" },
      { iconName: "map-pin", title: "定位权限", value: "", target: "64", color: "green" },
      { iconName: "image", title: "相册与相机权限", value: "", target: "64", color: "purple" },
      { iconName: "file-down", title: "个人信息导出", value: settings.lastExportId ? `最近导出 ${settings.lastExportId}` : settings.privacy?.dataExportStatus || "", exportAction: true, color: "orange" },
    ];
    const commonRows = settings.commonRows || [];
    const aboutRows = [
      { iconName: "languages", title: "语言与字体", value: settings.common?.fontSize || "标准", target: "65", color: "blue" },
      { iconName: "info", title: "当前版本", value: settings.appVersion || "v1.8.2", target: "", color: "blue" },
      { iconName: "file-text", title: "用户协议", value: "", target: "66", color: "green" },
      { iconName: "shield", title: "隐私政策", value: "", target: "63", color: "purple" },
      { iconName: "book-open", title: "平台规则", value: "", target: "66", color: "orange" },
    ];
    const commonRowIcons = {
      cacheSizeMb: ["trash-2", "orange"],
      language: ["languages", "blue"],
      fontSize: ["type", "purple"],
      darkMode: ["moon", "green"],
    };
    const settingLinkRow = (row) => {
      const title = row.title || row.label || "";
      const [fallbackIcon, fallbackColor] = commonRowIcons[row.key] || ["settings", "blue"];
      if (row.key === "fontSize") {
        const current = row.value || settings.common?.fontSize || "标准";
        return `
          <div class="settings-font-size-picker">
            <div class="settings-page-row settings-page-row-static">
              ${miniIcon(row.iconName || fallbackIcon, row.color || fallbackColor)}
              <strong>${escapeHtml(title)}</strong>
              <span>${escapeHtml(current)}</span>
              ${icon("type", 18)}
            </div>
            <div class="settings-font-size-options" role="group" aria-label="字体大小">
              ${["小", "标准", "大", "超大"].map((label) => `
                <button class="${label === current ? "active" : ""}" type="button" data-merchant-settings-font-size-choice="${label}" aria-pressed="${label === current ? "true" : "false"}">${label}</button>
              `).join("")}
            </div>
          </div>
        `;
      }
      const attrs = row.target
        ? `data-go="${row.target}"`
        : row.exportAction
          ? "data-merchant-settings-export"
          : row.action === "clearCache"
            ? "data-merchant-settings-clear-cache"
            : row.action === "darkMode"
              ? `data-merchant-settings-common-key="darkMode" data-merchant-settings-common-value="${row.value === "关闭" ? "跟随系统" : "关闭"}"`
              : `data-action="${escapeHtml(title)}"`;
      return `
      <button class="settings-page-row" type="button" ${attrs}>
        ${miniIcon(row.iconName || fallbackIcon, row.color || fallbackColor)}
        <strong>${escapeHtml(title)}</strong>
        ${row.value ? `<span>${escapeHtml(row.value)}</span>` : "<span></span>"}
        ${icon("chevron-right", 18)}
      </button>
    `;
    };
    return frame({
      title: "设置",
      screenClass: "merchant-settings-screen",
      content: `
        ${merchantApiPanel(state, "设置")}
        <section class="card settings-page-card">
          <h3 class="settings-page-title">通知设置</h3>
          ${notifyRows.map((row, index) => {
            const colors = ["blue", "green", "orange", "purple"];
            const icons = { order: "bell", serviceStart: "clock", settlement: "wallet", marketing: "megaphone" };
            return `
            <button class="settings-notify-row" type="button" data-merchant-settings-notification="${escapeHtml(row.key)}" aria-pressed="${row.enabled ? "true" : "false"}">
              ${miniIcon(icons[row.key] || "bell", colors[index] || "blue")}
              <span><strong>${escapeHtml(row.label)}</strong><small>${escapeHtml(row.desc || "")}</small></span>
              <em class="settings-switch ${row.enabled ? "on" : ""}"><i></i></em>
            </button>
          `;
          }).join("")}
        </section>
        <section class="card settings-page-card">
          <h3 class="settings-page-title">隐私与权限</h3>
          ${linkRows.map(settingLinkRow).join("")}
        </section>
        <section class="card settings-page-card">
          <h3 class="settings-page-title">通用设置</h3>
          ${commonRows.map(settingLinkRow).join("")}
        </section>
        <section class="card settings-page-card">
          <h3 class="settings-page-title">关于云旅无忧</h3>
          ${aboutRows.map(settingLinkRow).join("")}
        </section>
        <button class="settings-logout-button" type="button" data-merchant-session-logout>${icon("log-out", 20)}退出登录</button>
      `,
    });
  }

  return frame({
    title: screen.title,
    right: id === "07" ? "安全帮助" : "",
    content: `
      ${id === "07" ? `<section class="card form-section"><h3 class="section-title">账户安全等级</h3><div style="height:8px;border-radius:99px;background:#e7eef8;overflow:hidden"><b style="display:block;width:82%;height:100%;background:var(--blue)"></b></div><p class="muted">已完成手机号、登录密码、支付密码保护。</p></section>` : ""}
      <section class="card settings-group">
        ${[
          ["message-square", "消息通知", "预约、订单、售后消息提醒", "blue", "63"],
          ["lock-keyhole", "账户安全", "登录密码、支付密码与手机绑定", "green", "07"],
          ["smartphone", "设备管理", "管理登录设备", "orange", "62"],
          ["shield", "隐私设置", "个人资料展示与授权", "purple", "63"],
          ["key-round", "权限设置", "位置、相册、通知权限", "green", "64"],
          ["languages", "语言与字体", "语言、字号和阅读辅助", "blue", "65"],
          ["book-open", "平台规则", "商户协议与服务规则", "orange", "66"],
        ]
          .map(([iconName, title, sub, color, target]) => `<div data-go="${target}">${settingRow(iconName, title, sub, color)}</div>`)
          .join("")}
      </section>
      ${id === "07" ? `<section class="card settings-group">${[
        ["phone", "换绑手机号", "138 **** 8888", "59"],
        ["lock", "修改登录密码", "建议 90 天修改一次", "60"],
        ["shield-check", "设置支付密码", "提现与结算验证", "61"],
      ].map(([iconName, title, sub, target]) => `<div data-go="${target}">${settingRow(iconName, title, sub, "blue")}</div>`).join("")}</section>` : ""}
      ${id === "08" ? `<button class="danger-button" style="width:100%;margin-top:12px">${icon("log-out", 18)}退出登录</button>` : ""}
    `,
  });
}

function renderMessages(screen) {
  if (screen.id === "25") {
    const message = currentMerchantMessage();
    if (!message) {
      return frame({
        title: "消息详情",
        screenClass: "merchant-message-detail-screen",
        content: `
          <section class="card merchant-reception-empty">
            <strong>暂无消息详情</strong>
            <span>消息详情只展示当前商户消息。</span>
          </section>
          <div class="sticky-action merchant-message-actions">
            <button class="primary-button" type="button" data-go="01">返回消息中心</button>
          </div>
        `,
      });
    }
    const target = merchantMessageTarget(message);
    return frame({
      title: "消息详情",
      right: message.read ? "已读" : "标记已读",
      rightStatic: !!message.read,
      screenClass: "merchant-message-detail-screen",
      assurance: false,
      content: `
        <section class="card merchant-message-hero">
          <span>${icon(merchantMessageIcon(message), 34)}</span>
          <div>
            <h2>${escapeHtml(message.title || "商户消息")} ${chip(message.read ? "已读" : "未读", message.read ? "gray" : "orange")}</h2>
            <p>${escapeHtml(message.content || "请查看消息内容。")}</p>
            <time>${icon("clock", 20)}${escapeHtml(formatMerchantMessageTime(message.createdAt))}</time>
          </div>
        </section>
        <section class="card merchant-message-info">
          <h3 class="merchant-message-title">消息内容</h3>
          ${merchantMessageDetailRows(message).map(([iconName, label, value, color]) => `
            <div class="merchant-message-row">
              ${miniIcon(iconName, color)}
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
            </div>
          `).join("")}
        </section>
        <section class="card merchant-message-progress">
          <h3 class="merchant-message-title">处理进度</h3>
          <div class="merchant-message-step active">
            <i>${icon("mail", 28)}</i>
            <strong>消息已同步</strong>
            <span>${escapeHtml(formatMerchantMessageTime(message.createdAt))}</span>
          </div>
          <div class="merchant-message-step ${message.read ? "active" : ""}">
            <i>${icon("clock", 28)}</i>
            <strong>${message.read ? "商户已读" : "商户待处理"}</strong>
            <span>${message.readAt ? escapeHtml(formatMerchantMessageTime(message.readAt)) : "等待处理"}</span>
          </div>
        </section>
        <div class="sticky-action merchant-message-actions two-actions">
          <button class="secondary-button" type="button" data-go="01">返回消息</button>
          <button class="primary-button" type="button" data-go="${target}">${merchantMessagePrimaryActionText(message)}</button>
        </div>
      `,
    });
  }

  const messageRows = merchantWorkbenchState.messages?.length
    ? merchantWorkbenchState.messages.slice(0, 10).map(merchantMessageRowFromApi)
    : [];
  return frame({
    title: "消息中心",
    right: "全部已读",
    content: `
      ${tabs(["全部", "待处理", "系统通知", "订单提醒"], 0)}
      ${messageRows.length ? messageRows
        .map(([id, iconName, title, sub, time, color, read]) => `<article class="card message-item ${read ? "is-read" : "unread"}" data-go="25" data-message-id="${escapeHtml(id)}"><h3><span>${miniIcon(iconName, color)} ${escapeHtml(title)}</span><span class="muted">${escapeHtml(time)}</span></h3><p>${escapeHtml(sub)}</p></article>`)
        .join("") : `<section class="card section-card merchant-reception-empty"><strong>正在加载消息数据</strong><span>消息中心只展示后台同步的业务记录。</span><button type="button" data-go="25">查看消息详情</button></section>`}
    `,
  });
}

function merchantMessageRowFromApi(message) {
  const text = `${message.title || ""}${message.content || ""}${message.scenario || ""}`;
  return [
    message.id || "",
    merchantMessageIcon(message),
    message.title || "商户消息",
    message.content || "请查看消息详情",
    formatMerchantMessageTime(message.createdAt),
    merchantMessageColor(message),
    !!message.read,
  ];
}

function currentMerchantMessage() {
  const messages = merchantWorkbenchState.messages || [];
  return messages.find((item) => item.id === merchantMessageState.selectedId)
    || messages.find((item) => !item.read)
    || messages[0]
    || null;
}

function merchantMessageDetailRows(message) {
  const details = message?.details || {};
  const hasOrderData = message?.relatedType === "order" || details.orderNo || details.elderName || details.serviceType;
  if (hasOrderData) {
    return [
      ["clipboard-list", "订单号", details.orderNo || message.relatedId || "未提供", "blue"],
      ["user", "客户", details.elderName || "旅居用户", "purple"],
      ["user-round-check", "服务", details.serviceType || "商户服务", "green"],
      ["activity", "状态", details.status || message.priority || "普通", "orange"],
      ["clock", "服务时间", details.time || message.createdAt || "时间待确认", "orange"],
      ["map-pin", "服务地址", details.location || "服务地址待确认", "blue"],
    ];
  }
  return [
    ["message-square", "消息类型", message?.scenario || "站内消息", "blue"],
    ["link", "关联对象", message?.relatedId || "无关联对象", "purple"],
    ["activity", "优先级", message?.priority || "普通", "orange"],
    ["radio", "通知渠道", Array.isArray(message?.channels) && message.channels.length ? message.channels.join(" / ") : "站内消息", "green"],
    ["clock", "生成时间", message?.createdAt || "时间待确认", "orange"],
    ["check-circle", "处理状态", message?.read ? "已读" : "未读", message?.read ? "gray" : "orange"],
  ];
}

function merchantMessageTarget(message) {
  const explicitTarget = normalizeMerchantScreenId(message?.actionTarget);
  if (explicitTarget) return explicitTarget;
  if (message?.relatedType === "order") return "20";
  const text = `${message?.title || ""}${message?.content || ""}${message?.scenario || ""}`;
  if (/服务|上下架|报价/.test(text)) return "19";
  if (/审核|入驻|资质/.test(text)) return "15";
  if (/提现|结算|钱包|发票/.test(text)) return "04";
  return "24";
}

function merchantMessagePrimaryActionText(message) {
  if (message?.actionTarget || message?.relatedType === "order") return "处理消息";
  const text = `${message?.title || ""}${message?.content || ""}${message?.scenario || ""}`;
  if (/服务|上下架|报价/.test(text)) return "查看服务";
  if (/审核|入驻|资质/.test(text)) return "查看资料";
  if (/提现|结算|钱包|发票/.test(text)) return "查看财务";
  return "返回工作台";
}

function merchantMessageIcon(message) {
  const text = `${message?.title || ""}${message?.content || ""}${message?.scenario || ""}`;
  if (/预约|订单|报价|服务/.test(text)) return "calendar-check";
  if (/客户|咨询|回复/.test(text)) return "message-circle";
  if (/系统|公告|审核|规则/.test(text)) return "megaphone";
  return "clock";
}

function merchantMessageColor(message) {
  const text = `${message?.title || ""}${message?.content || ""}${message?.scenario || ""}`;
  if (/预约|订单|报价|服务/.test(text)) return "orange";
  if (/客户|咨询|回复/.test(text)) return "purple";
  if (/系统|公告|审核|规则/.test(text)) return "blue";
  return "green";
}

function formatMerchantMessageTime(value) {
  const text = String(value || "").trim();
  if (!text) return "刚刚";
  return text.length > 10 ? text.slice(5, 16).replace(" ", " ") : text;
}

function renderOrderDetail(screen) {
  if (screen.id === "39") {
    return frame({
      title: "完成上报成功",
      right: "",
      screenClass: "complete-report-success-screen",
      assurance: false,
      content: `
        <section class="card complete-success-hero">
          <span class="state-icon green">${icon("shield-check", 54)}</span>
          <div>
            <h2>服务完成已提交</h2>
            <p>平台已同步客户与家属，等待客户确认评价</p>
          </div>
        </section>
        <section class="card complete-info-card">
          ${[
            ["clipboard-list", "订单号", "SO202505200001", "blue", ""],
            ["user", "客户", "李奶奶", "purple", `<button type="button" data-action="联系客户">${icon("phone", 18)}</button>`],
            ["briefcase-medical", "服务", "居家护理服务（基础护理）", "green", ""],
            ["user", "服务人员", "王护工", "purple", ""],
            ["clock", "实际服务", "09:30-10:55", "orange", ""],
            ["clock", "实成时间", "今天 10:58", "blue", ""],
          ]
            .map(([iconName, label, value, color, right]) => `<div>${miniIcon(iconName, color)}<span>${label}</span><strong>${value}</strong>${right}</div>`)
            .join("")}
        </section>
        <section class="card complete-material-card">
          <h3 class="section-title">完成材料 <small>已上传 <b>2</b> 张照片</small></h3>
          <div>
            <figure><img src="${assets.serviceCare}" alt="服务前照片"><figcaption>服务前</figcaption></figure>
            <figure><img src="${assets.serviceDuringProof}" alt="服务中照片"><figcaption>服务中</figcaption></figure>
          </div>
        </section>
        <section class="card complete-flow-card">
          <h3 class="section-title">后续流程</h3>
          ${[
            ["商户提交完成", "已完成", "done", "check"],
            ["客户确认", "待确认", "active", "clock"],
            ["评价反馈", "待评价", "", "message-circle"],
            ["进入结算", "待结算", "", "circle-yen"],
          ]
            .map(([label, state, cls, iconName]) => `<div class="${cls}"><i>${icon(iconName, 16)}</i><span>${label}</span><em>${state}</em></div>`)
            .join("")}
        </section>
        <div class="complete-success-tip">${icon("info", 18)}<span>客户确认后订单金额将进入待结算金额，可在结算管理中查看。</span></div>
        <div class="sticky-action two-actions complete-success-actions">
          <button class="secondary-button" type="button" data-go="20">${icon("file-text", 18)}返回订单</button>
          <button class="primary-button" type="button" data-go="18">${icon("circle-arrow-right", 18)}继续处理下一单</button>
        </div>
      `,
    });
  }

  if (screen.id === "41") {
    return frame({
      title: "评价回复",
      right: "回复规则",
      content: `
        <section class="card detail-hero">
          <span class="avatar"><img src="${assets.avatarLi}" alt="客户头像" /></span>
          <div><h2>李女士 ${chip("好评")}</h2><div class="rating">★★★★★</div><p>护理人员很专业，服务态度很好，后续还会预约。</p></div>
        </section>
        <section class="card form-section">
          <h3 class="section-title">商户回复</h3>
          <div class="textarea-like">感谢您的认可，我们会继续提升服务质量，祝您生活愉快。</div>
        </section>
        <div class="sticky-action two-actions"><button class="secondary-button">暂不回复</button><button class="primary-button">提交回复</button></div>
      `,
    });
  }

  if (screen.id === "12") {
    const infoRows = [
      ["clipboard-list", "订单号", "OH202505200001"],
      ["user", "客户", `刘先生 <button type="button" data-action="拨打客户电话">${icon("phone", 15)}</button>`],
      ["briefcase-business", "服务项目", "居家护理服务"],
      ["clock", "提交时间", "2025-05-20 10:15"],
    ];
    const demands = ["服务说明", "部分退款", "重新服务", "平台介入"];
    const plans = ["向客户致歉并补偿优惠券", "申请部分退款", "安排二次上门", "转平台仲裁"];
    return frame({
      title: "售后处理",
      right: "处理记录",
      rightGo: "40",
      screenClass: "after-sale-process-screen",
      content: `
        <section class="card aftersale-hero-card">
          <span class="aftersale-alert">${icon("exclamation", 42)}</span>
          <div class="aftersale-hero-main">
            <h2>服务时间不准时 ${chip("服务投诉", "orange")}</h2>
            ${infoRows.map(([iconName, label, value]) => `<p>${icon(iconName, 18)}<span>${label}</span><strong>${value}</strong></p>`).join("")}
          </div>
          ${chip("待处理", "orange")}
        </section>
        <section class="card aftersale-card">
          <h3 class="aftersale-title">问题描述</h3>
          <p class="aftersale-desc">护士上门比预约时间晚了40分钟，希望加强时间管理。</p>
          <div class="aftersale-time-grid">
            <div><span>预约时间</span><strong>${icon("clock", 18)}09:30-11:30</strong></div>
            <div><span>实际上门</span><strong>${icon("clock", 18)}10:10</strong></div>
          </div>
        </section>
        <section class="card aftersale-card">
          <h3 class="aftersale-title">客户诉求</h3>
          <div class="aftersale-demand-grid">
            ${demands.map((label, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-action="选择客户诉求：${label}">${label}${index === 0 ? icon("check", 16) : ""}</button>`).join("")}
          </div>
        </section>
        <section class="card aftersale-card">
          <h3 class="aftersale-title">处理方案</h3>
          <div class="aftersale-plan-list">
            ${plans.map((label, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-action="选择处理方案：${label}"><i></i><span>${label}</span></button>`).join("")}
          </div>
        </section>
        <section class="card aftersale-card aftersale-reply-card">
          <h3 class="aftersale-title">回复客户</h3>
          <div class="aftersale-textarea">非常抱歉给您带来不便，我们已核实原因并加强人员排班提醒，本次为您补偿20元服务券。<em>48/300</em></div>
          <h3 class="aftersale-title optional">凭证附件 <small>（选填）</small></h3>
          <div class="aftersale-attachment-grid">
            <button class="aftersale-upload" type="button" data-action="上传售后附件">${icon("camera", 26)}<span>上传附件<br />（最多 6 张）</span></button>
            <figure>
              <button type="button" data-action="删除沟通截图">${icon("x", 14)}</button>
              <div class="chat-proof"><p></p><b></b><p></p></div>
              <figcaption>沟通截图</figcaption>
            </figure>
          </div>
        </section>
        <div class="sticky-action aftersale-actions two-actions">
          <button class="secondary-button" type="button" data-action="暂存售后处理">${icon("save", 22)}暂存</button>
          <button class="primary-button" type="button" data-action="提交处理结果">提交处理结果</button>
        </div>
      `,
    });
  }

  if (screen.id === "17") {
    const reviews = [
      [assets.avatarLi, "李女士", "★★★★★", "5.0", "护理人员非常专业，服务态度很好，操作细致，下次还会选择你们。", "05-20"],
      [assets.avatarZhang, "张先生", "★★★★☆", "4.0", "整体服务不错，护士很耐心，建议优化预约时间的提醒功能。", "05-19"],
      [assets.avatarWang, "王阿姨", "★★★★★", "5.0", "非常满意，护士专业又贴心，家人都很放心，强烈推荐！", "05-18"],
    ];
    const tickets = [
      ["package-open", "服务时间不准时", "服务投诉", "待处理", "用户：刘先生　｜　服务：居家护理服务", "护士上门比预约时间晚了40分钟，希望加强时间管理。", "05-20 10:15", "OH202505200001", "orange", "12"],
      ["headphones", "护理操作疑问", "咨询建议", "处理中", "用户：陈女士　｜　服务：居家护理服务", "对本次护理操作有些疑问，想了解更多护理建议。", "05-19 16:40", "OH202505190045", "blue", "40"],
    ];
    return frame({
      title: "售后与评价",
      tab: "mine",
      screenClass: "review-after-sale-screen",
      content: `
        <div class="review-tabs">
          <button class="active" type="button" data-action="查看用户评价">用户评价</button>
          <button type="button" data-action="查看售后处理">售后处理</button>
        </div>
        <section class="card review-stats-card">
          ${[
            ["thumbs-up", "好评率", "98.2%", "较上月 ↑ 2.1%", "green"],
            ["circle-alert", "待处理投诉", "4", "较上月 ↓ 1", "orange"],
            ["message-square", "本月评价数", "128", "较上月 ↑ 18.6%", "blue"],
          ].map(([iconName, label, value, sub, color]) => `
            <div>
              ${miniIcon(iconName, color)}
              <span>${label}</span>
              <strong>${value}</strong>
              <small>${sub}</small>
            </div>
          `).join("")}
        </section>
        ${reviews.map(([avatar, name, rating, score, text, date]) => `
          <section class="card review-comment-card">
            <img src="${avatar}" alt="${name}" />
            <div>
              <h3>${name} ${chip("居家护理服务", "blue")}</h3>
              <p class="review-stars"><span>${rating}</span><b>${score}</b></p>
              <p>${text}</p>
              <time>${date}</time>
            </div>
            <button type="button" data-go="41">回复</button>
          </section>
        `).join("")}
        <div class="review-ticket-list">
          ${tickets.map(([iconName, title, tag, status, meta, desc, time, orderNo, color, target]) => `
            <section class="card review-ticket-card ${color}">
              ${miniIcon(iconName, color)}
              <div>
                <h3>${title} ${chip(tag, color)}</h3>
                <p>${meta}</p>
                <p>问题描述：${desc}</p>
                <time>${time}　｜　订单号：${orderNo}</time>
              </div>
              <strong>${status}</strong>
              <button type="button" data-go="${target}">${target === "12" ? "立即处理" : "查看进度"}</button>
            </section>
          `).join("")}
        </div>
      `,
    });
	  }

  if (screen.id === "23") {
    return frame({
      title: "预约详情 / 报价确认",
      right: `${icon("headphones", 24)}<span>联系客服</span>`,
      rightGo: "09",
      screenClass: "quote-confirm-screen",
      assurance: false,
      content: `
        <span class="sr-only">预约详情和报价确认页面，包含客户信息、服务类型、预约时间、服务地址、客户需求、导航入口、报价方案、改期沟通和确认方案并报价操作，所有按钮均绑定真实路由或业务反馈。</span>
        <section class="card quote-customer-card">
          <img src="${assets.quoteCustomerLi}" alt="李奶奶头像" />
          <div>
            <h2>李奶奶 ${chip("居家护理服务", "blue")}</h2>
            <p><span>72岁</span><span>女士</span><span>${icon("phone", 18)}138 8888 8888</span></p>
          </div>
          <button type="button" data-action="拨打客户电话" aria-label="拨打客户电话">${icon("phone", 30)}</button>
        </section>

        <section class="card quote-info-card">
          <button class="quote-info-row" type="button" data-go="31">
            ${miniIcon("clipboard-list", "blue")}<strong>服务类型</strong><span>居家护理服务（综合照护套餐）</span>
          </button>
          <button class="quote-info-row" type="button" data-go="32">
            ${miniIcon("calendar-days", "blue")}<strong>预约时间</strong><span>2025-05-20（今天）　09:30-11:30</span>
          </button>
          <button class="quote-info-row has-arrow" type="button" data-go="33">
            ${miniIcon("map-pin", "blue")}<strong>服务地址</strong><span>昆明市盘龙区穿金路 88 号 · 客户家中</span>${icon("chevron-right", 18)}
          </button>
          <div class="quote-demand">
            ${miniIcon("message-circle", "blue")}
            <strong>客户需求描述</strong>
            <p>奶奶近期行动不便，需要日常起居照护、协助洗澡、服药提醒、健康监测（血压/血糖），希望服务人员有耐心、细心。</p>
          </div>
          <div class="quote-map-card">
            <img src="${assets.quoteMap}" alt="客户地址地图" />
            <div>
              <strong>距离客户 2.3km</strong>
              <span>预计上门 12分钟</span>
              <button type="button" data-action="查看导航">查看导航 ${icon("chevron-right", 18)}</button>
            </div>
          </div>
        </section>

        <section class="card quote-plan-card">
          <h3>您的服务方案与报价 ${chip("待用户确认", "orange")}</h3>
          <div class="quote-plan-box">
            <div class="quote-plan-row">${miniIcon("clipboard-list", "blue")}<strong>方案名称</strong><span>综合照护基础方案</span></div>
            <div class="quote-plan-row">${miniIcon("briefcase-business", "blue")}<strong>服务清单</strong><span>生活协助、身体清洁、生命体征监测、用药提醒、康复陪伴、营养指导</span></div>
            <div class="quote-plan-stats">
              <div class="green">${icon("user", 26)}<span>上门次数</span><strong>5<em>次</em></strong></div>
              <div class="orange">${icon("clock", 26)}<span>预计时长</span><strong>每次 2.5<em>小时</em></strong></div>
              <div class="purple">${icon("circle-yen", 26)}<span>报价金额</span><strong>¥ 680.00</strong></div>
            </div>
          </div>
          <p>报价有效期至 2025-05-22 18:00</p>
        </section>

        <div class="sticky-action quote-confirm-actions two-actions">
          <button class="secondary-button" type="button" data-go="36">${icon("messages-square", 22)}改期 / 沟通</button>
          <button class="primary-button" type="button" data-go="37">确认方案并报价</button>
        </div>
      `,
    });
  }

  if (screen.id === "34") {
    const order = merchantSelectedRuntimeOrder(["已报价", "待派单", "已派单"]);
    const orderId = escapeHtml(order?.id || order?.orderNo || "");
    const customerName = escapeHtml(order?.name || "旅居用户");
    const customerAge = escapeHtml(order?.age || "");
    const customerGender = escapeHtml(order?.gender || "长者");
    const serviceName = escapeHtml(order?.service || "商户服务");
    const orderNo = escapeHtml(order?.orderNo || order?.id || "订单同步中");
    const appointmentTime = escapeHtml(order?.time || "时间待确认");
    const serviceAddress = escapeHtml(order?.address || "服务地址待确认");
    const customerNeed = escapeHtml(order?.note || "后台已分配服务需求，请商户按订单要求确认安排。");
    const amountText = escapeHtml(order?.amount || "¥0.00");
    const customerPhone = order?.phone || MERCHANT_ACTIVE_SERVICE_CONTACT.phone;
    const customerTelHref = merchantTelHref(customerPhone);
    const customerPhoneText = escapeHtml(customerPhone || "电话待同步");
    const appointmentRows = [
      ["clipboard-list", "订单号", orderNo, "blue"],
      ["user-round-check", "服务项目", serviceName, "green"],
      ["clock", "预约时间", appointmentTime, "orange"],
      ["map-pin", "服务地址", serviceAddress, "blue"],
      ["message-circle", "客户需求", customerNeed, "purple"],
    ];
    const arrangeRows = [
      ["user", "服务人员", `<span class="red">未安排</span><button type="button" data-go="38">选择人员</button>`, "purple"],
      ["clock", "预计上门时间", appointmentTime, "orange"],
      ["hourglass", "预计服务时长", "90分钟", "green"],
      ["file-pen-line", "备注", "可提前10分钟到达", "blue"],
    ];

    return frame({
      title: "预约确认",
      right: `${icon("headphones", 22)} 联系客服`,
      rightGo: "09",
      screenClass: "appointment-confirm-screen",
      assurance: false,
      content: `
        <span class="sr-only">预约确认页面，包含客户信息、预约信息、确认安排、费用信息、改期沟通和确认预约操作。选择人员、改期沟通和确认预约均可点击。</span>
        <section class="card appointment-customer-card">
          <img src="${assets.quoteCustomerLi}" alt="${customerName}头像" />
          <div>
            <h2>${customerName} <span>${customerAge}</span> <span>${customerGender}</span></h2>
            ${chip(serviceName, "blue")}
            <p>${icon("phone", 18)}<a class="inline-call-link" href="${customerTelHref}" aria-label="拨打客户电话">${customerPhoneText}</a></p>
          </div>
          <button type="button" data-action="查看客户详情" aria-label="查看客户详情">${icon("chevron-right", 22)}</button>
        </section>
        <section class="card appointment-card">
          <h3 class="appointment-title">预约信息</h3>
          ${appointmentRows.map(([iconName, label, value, color]) => `<div class="appointment-row">${miniIcon(iconName, color)}<span>${label}</span><strong>${value}</strong></div>`).join("")}
        </section>
        <section class="card appointment-card">
          <h3 class="appointment-title">确认安排</h3>
          ${arrangeRows.map(([iconName, label, value, color]) => `<div class="appointment-row">${miniIcon(iconName, color)}<span>${label}</span><strong>${value}</strong>${label === "服务人员" ? icon("chevron-right", 18) : ""}</div>`).join("")}
        </section>
        <section class="card appointment-card appointment-fee-card">
          <h3 class="appointment-title">费用信息</h3>
          <div class="appointment-row">${miniIcon("circle-yen", "orange")}<span>报价金额</span><strong class="price">${amountText}</strong></div>
          <div class="appointment-row">${miniIcon("wallet", "green")}<span>支付状态</span><strong class="paid">已支付</strong></div>
        </section>
        <div class="sticky-action appointment-actions two-actions">
          <button class="secondary-button" type="button" data-go="36" data-order-id="${orderId}">${icon("calendar-days", 20)}改期 / 沟通</button>
          <button class="primary-button" type="button" data-merchant-order-action="confirm" data-order-id="${orderId}">${icon("circle-check", 20)}确认预约</button>
        </div>
      `,
    });
  }

  if (screen.id === "35") {
    const rows = [
      ["clipboard-list", "订单号", "SO202505200001", "blue"],
      ["user", "客户", `李奶奶 <button type="button" data-action="拨打客户电话">${icon("phone", 18)}</button>`, "purple"],
      ["briefcase-medical", "服务", "居家护理服务（基础护理）", "green"],
      ["clock", "预约时间", "2025-05-20　09:30-11:30", "orange"],
      ["banknote", "预计金额", "¥268.00", "orange"],
    ];
    const reasons = ["服务人员已满", "超出服务范围", "时间无法安排", "资质不匹配", "客户信息不完整", "其他原因"];
    const suggestions = ["建议改期", "建议平台改派", "建议客户重新下单"];

    return frame({
      title: "预约拒绝",
      right: `${icon("headphones", 22)} 联系客服`,
      rightGo: "09",
      screenClass: "appointment-refuse-screen",
      assurance: false,
      content: `
        <span class="sr-only">预约拒绝页面，包含拒绝风险提示、订单信息、拒绝原因、补充说明、推荐处理、返回和确认拒绝预约操作。</span>
        <div class="appointment-warn-tip">${icon("circle-alert", 22)}<span>拒绝预约会同步通知客户与平台，请填写真实原因</span></div>
        <section class="card refuse-order-card">
          ${rows.map(([iconName, label, value, color], index) => `<div class="refuse-row">${miniIcon(iconName, color)}<span>${label}</span><strong>${value}</strong>${index === 0 ? chip("待确认", "orange") : ""}</div>`).join("")}
        </section>
        <section class="card refuse-card">
          <h3 class="appointment-title">拒绝原因</h3>
          <div class="refuse-reason-grid">
            ${reasons.map((reason, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-action="选择拒绝原因：${reason}">${reason}${index === 0 ? icon("circle-check", 18) : ""}</button>`).join("")}
          </div>
        </section>
        <section class="card refuse-card">
          <h3 class="appointment-title">补充说明</h3>
          <div class="refuse-textarea">请说明无法接单的原因，便于平台改派或协助客户重新预约...<em>0/200</em></div>
        </section>
        <section class="card refuse-card">
          <h3 class="appointment-title">推荐处理</h3>
          <div class="refuse-radio-list">
            ${suggestions.map((label, index) => `<button class="${index === 1 ? "active" : ""}" type="button" data-action="选择推荐处理：${label}"><i></i><span>${label}</span></button>`).join("")}
          </div>
        </section>
        <div class="sticky-action refuse-actions two-actions">
          <button class="secondary-button" type="button" data-go="20">返回</button>
          <button class="danger-button" type="button" data-merchant-order-action="reject" data-order-id="order-li-care">确认拒绝预约</button>
        </div>
      `,
    });
  }

  if (screen.id === "36") {
    const order = currentMerchantRescheduleOrder();
    if (!order) {
      return frame({
        title: "订单改期",
        right: `${icon("headphones", 22)} 联系客服`,
        rightGo: "09",
        screenClass: "order-reschedule-screen",
        assurance: false,
        content: `
          <span class="sr-only">订单改期页面仅展示后端允许改期的商户订单。</span>
          <div class="reschedule-tip">${icon("info", 18)}<span>当前没有可改期订单，请回到订单列表查看最新状态</span></div>
          <section class="card reschedule-card merchant-reschedule-empty">
            ${icon("calendar-clock", 42)}
            <strong>暂无可改期订单</strong>
            <span>仅待派单、已派单、已报价、待服务订单可发起改期。</span>
          </section>
          <div class="sticky-action reschedule-actions two-actions">
            <button class="secondary-button" type="button" data-go="20">返回订单</button>
            <button class="primary-button" type="button" disabled>提交改期申请</button>
          </div>
        `,
      });
    }
    const { dateOptions } = ensureMerchantRescheduleDefaults(order);
    const slots = merchantRescheduleSlotOptions();
    const reasons = ["服务人员排班冲突", "客户沟通改期", "天气/交通原因", "其他原因"];
    const orderId = escapeHtml(order?.id || order?.orderNo || "");
    const customerName = escapeHtml(order?.elderName || order?.name || "旅居用户");
    const serviceName = escapeHtml(order?.serviceType || order?.service || "商户服务");
    const oldTime = escapeHtml(order?.time || "订单时间待确认");
    const address = escapeHtml(order?.location || order?.address || "服务地址待同步");
    const customerPhone = merchantTelHref(order?.phone || order?.elderPhone || MERCHANT_ACTIVE_SERVICE_CONTACT.phone);

    return frame({
      title: "订单改期",
      right: `${icon("headphones", 22)} 联系客服`,
      rightGo: "09",
      screenClass: "order-reschedule-screen",
      assurance: false,
      content: `
        <span class="sr-only">订单改期页面，包含改期提示、原订单信息、新日期、新时段、改期原因、客户备注、取消和提交改期申请操作。</span>
        <div class="reschedule-tip">${icon("info", 18)}<span>改期申请需客户确认，确认后订单时间将同步更新</span></div>
        <section class="card reschedule-info-card">
          ${[
            ["hash", "订单号", escapeHtml(order?.orderNo || order?.id || "订单确认中"), "blue"],
            ["user", "客户", `${customerName} <a class="reschedule-call-link" href="${customerPhone}" aria-label="拨打客户电话">${icon("phone", 18)}</a>`, "purple"],
            ["briefcase", "服务", serviceName, "green"],
            ["clock", "原预约时间", oldTime, "orange"],
            ["map-pin", "服务地址", address, "blue"],
          ].map(([iconName, label, value, color]) => `<div class="reschedule-row">${miniIcon(iconName, color)}<span>${label}</span><strong>${value}</strong></div>`).join("")}
        </section>
        <section class="card reschedule-card">
          <h3 class="appointment-title">选择新日期</h3>
          <div class="reschedule-date-grid">
            ${dateOptions.map(({ label, day, week, value }) => {
              const active = merchantRescheduleState.date === value;
              return `<button class="${active ? "active" : ""}" type="button" data-merchant-reschedule-date="${escapeHtml(value)}"><span>${label}</span><strong>${day}</strong><em>${week}</em>${active ? icon("circle-check", 18) : ""}</button>`;
            }).join("")}
          </div>
        </section>
        <section class="card reschedule-card">
          <h3 class="appointment-title">选择新时段</h3>
          <div class="reschedule-slot-grid">
            ${slots.map(({ time, sub = "", disabled = false }) => {
              const active = merchantRescheduleState.slot === time;
              return `<button class="${disabled ? "disabled" : active ? "active" : ""}" type="button" ${disabled ? "disabled" : `data-merchant-reschedule-slot="${escapeHtml(time)}"`}><strong>${time}</strong>${sub ? `<span>${sub}</span>` : ""}${active ? icon("circle-check", 18) : ""}</button>`;
            }).join("")}
          </div>
        </section>
        <section class="card reschedule-card">
          <h3 class="appointment-title">改期原因</h3>
          <div class="reschedule-reason-grid">
            ${reasons.map((reason) => {
              const active = merchantRescheduleState.reason === reason;
              return `<button class="${active ? "active" : ""}" type="button" data-merchant-reschedule-reason="${escapeHtml(reason)}">${reason}${active ? icon("circle-check", 18) : ""}</button>`;
            }).join("")}
          </div>
        </section>
        <section class="card reschedule-card">
          <h3 class="appointment-title">备注给客户</h3>
          <label class="refuse-textarea reschedule-note-box"><textarea data-merchant-reschedule-note maxlength="200" placeholder="请输入改期说明，客户确认前可继续沟通...">${escapeHtml(merchantRescheduleState.note)}</textarea><em>${merchantRescheduleState.note.length}/200</em></label>
        </section>
        <div class="sticky-action reschedule-actions two-actions">
          <button class="secondary-button" type="button" data-go="34">取消</button>
          <button class="primary-button" type="button" data-merchant-order-action="reschedule" data-order-id="${orderId}">提交改期申请</button>
        </div>
      `,
    });
  }

  if (screen.id === "37") {
    return frame({
      title: "报价方案编辑",
      right: "保存草稿",
      rightGo: "20",
      screenClass: "quote-edit-screen",
      assurance: false,
      content: `
        <span class="sr-only">报价方案编辑页面，包含客户信息、客户需求、服务方案、报价明细、预览方案和提交报价操作。</span>
        <section class="card quote-edit-customer">
          <img src="${assets.avatarZhang}" alt="张叔叔头像" />
          <div>
            <h2>张叔叔 <span>72岁</span><span>男士</span></h2>
            ${chip("康复护理服务", "blue")}
            <p>${icon("phone", 18)}138 8888 8888</p>
          </div>
          ${chip("待报价", "orange")}
          <button type="button" data-action="查看客户详情" aria-label="查看客户详情">${icon("chevron-right", 20)}</button>
        </section>
        <section class="card quote-edit-card">
          <h3 class="quote-edit-title">客户需求</h3>
          <div class="quote-edit-text">术后康复，需要连续5次上门理疗与康复训练，希望安排有经验的护理师。</div>
        </section>
        <section class="card quote-edit-card">
          <h3 class="quote-edit-title">服务方案</h3>
          ${[
            ["方案名称", "综合康复护理方案", "8/30"],
            ["服务清单", "康复评估、关节活动训练、肌力训练、用药提醒、康复陪伴", "23/200"],
          ].map(([label, value, count]) => `<div class="quote-edit-field"><span>${label}<em>*</em></span><strong>${value}</strong><small>${count}</small></div>`).join("")}
          ${[
            ["上门次数", "5", "次"],
            ["单次时长", "2.5", "小时"],
          ].map(([label, value, unit]) => `<div class="quote-edit-stepper"><span>${label}<em>*</em></span><button type="button" data-action="减少${label}">${icon("minus", 16)}</button><strong>${value}</strong><button type="button" data-action="增加${label}">${icon("plus", 16)}</button><b>${unit}</b></div>`).join("")}
          <button class="quote-edit-period" type="button" data-action="选择服务周期"><span>服务周期<em>*</em></span>${icon("calendar-days", 20)}<strong>2025-05-21　至　2025-05-25</strong>${icon("chevron-right", 18)}</button>
        </section>
        <section class="card quote-edit-card quote-price-card">
          <h3 class="quote-edit-title">报价明细</h3>
          ${[
            ["circle-yen", "基础服务费", "¥580.00", "blue"],
            ["circle-yen", "耗材费", "¥60.00", "green"],
            ["tag", "平台优惠", "-¥40.00", "orange"],
          ].map(([iconName, label, amount, color]) => `<div>${miniIcon(iconName, color)}<span>${label}</span><strong>${amount}</strong></div>`).join("")}
          <div class="quote-total"><span>报价合计</span><strong>¥600.00</strong></div>
          <button class="quote-valid" type="button" data-action="设置报价有效期"><span>报价有效期<em>*</em></span>${icon("calendar-days", 20)}<strong>2025-05-22　18:00</strong>${icon("chevron-right", 18)}</button>
        </section>
        <div class="sticky-action quote-edit-actions two-actions">
          <button class="secondary-button" type="button" data-go="23">${icon("eye", 20)}预览方案</button>
          <button class="primary-button" type="button" data-merchant-order-action="quote" data-order-id="order-zhang-rehab">${icon("send", 20)}提交报价</button>
        </div>
      `,
    });
  }

  if (screen.id === "38") {
    const staff = [
      [assets.nurseWang, "王护工", "护理师", "距离 2.1km", "4.9 评分　｜　服务 128 单", true],
      [assets.nurseZhang, "张晓梅", "护理员", "距离 3.4km", "4.8 评分　｜　服务 96 单", false],
      [assets.avatarLi, "李敏", "康复师", "距离 5.0km", "4.7 评分　｜　服务 86 单", false],
    ];
    return frame({
      title: "服务人员安排",
      right: "排班规则",
      rightGo: "66",
      screenClass: "staff-arrange-screen",
      assurance: false,
      content: `
        <span class="sr-only">服务人员安排页面，包含订单信息、推荐人员、排班信息、提醒方式、暂不安排和确认派工操作。</span>
        <section class="card staff-order-card">
          ${[
            ["calendar-days", "订单号", "SO202505200001", "待安排", "blue"],
            ["user", "客户", `李奶奶 <button type="button" data-action="拨打客户电话">${icon("phone", 18)}</button>`, "", "purple"],
            ["briefcase-medical", "服务", "居家护理服务（基础护理）", "", "green"],
            ["clock", "预约时间", "今天　09:30-11:30", "", "orange"],
            ["map-pin", "地址", "穿金路88号 · 客户家中", "", "blue"],
          ].map(([iconName, label, value, tag, color]) => `<div>${miniIcon(iconName, color)}<span>${label}</span><strong>${value}</strong>${tag ? chip(tag, "orange") : ""}</div>`).join("")}
        </section>
        <section class="card staff-card-list">
          <h3 class="quote-edit-title">推荐人员</h3>
          ${staff.map(([avatar, name, role, distance, rating, active]) => `
            <button class="${active ? "active" : ""}" type="button" data-action="选择服务人员：${name}">
              <img src="${avatar}" alt="${name}" />
              <div><h4>${name} ${chip(role, "blue")}</h4><p>${distance}</p><small>${icon("star", 15)} ${rating}</small></div>
              <i></i>
            </button>
          `).join("")}
        </section>
        <section class="card staff-arrange-card">
          <h3 class="quote-edit-title">排班信息</h3>
          ${[
            ["clock", "上门时间", "09:30"],
            ["clock", "预计结束", "11:00"],
            ["hourglass", "服务时长", "90分钟"],
            ["car-front", "交通方式", "自行前往"],
          ].map(([iconName, label, value]) => `<button type="button" data-action="编辑${label}">${miniIcon(iconName, "blue")}<span>${label}</span><strong>${value}</strong>${icon("chevron-right", 18)}</button>`).join("")}
        </section>
        <section class="card staff-remind-card">
          <h3 class="quote-edit-title">提醒方式</h3>
          ${["App通知", "短信提醒", "电话确认"].map((label, index) => `<button class="${index < 2 ? "active" : ""}" type="button" data-action="${index < 2 ? "取消" : "选择"}${label}"><i>${index < 2 ? icon("check", 16) : ""}</i>${label}</button>`).join("")}
        </section>
        <div class="sticky-action staff-actions two-actions">
          <button class="secondary-button" type="button" data-go="34">暂不安排</button>
          <button class="primary-button" type="button" data-go="20">确认派工</button>
        </div>
      `,
    });
  }

  if (screen.id === "40") {
    const tickets = [
      ["circle-alert", "服务时间不准时", "服务投诉", "待处理", "用户：刘先生", "服务：居家护理服务", "提交时间：05-20 10:15", "护士上门比预约时间晚了40分钟，希望加强时间管理。", "orange", "12", "立即处理"],
      ["headphones", "护理操作疑问", "咨询建议", "处理中", "用户：陈女士", "服务：居家护理服务", "提交时间：05-19 16:40", "对本次护理操作有些疑问，想了解更多护理建议。", "blue", "40", "查看进度"],
      ["banknote", "申请部分退款", "退款申请", "已完成", "用户：王阿姨", "服务：康复理疗上门服务", "提交时间：05-18 09:20", "希望退还未使用的1次服务费用。", "green", "48", "查看详情"],
    ];
    return frame({
      title: "售后处理记录",
      right: `${icon("list-filter", 22)} 筛选`,
      tab: "mine",
      screenClass: "after-sale-record-screen",
      assurance: false,
      content: `
        <span class="sr-only">售后处理记录页面，包含售后状态标签、处理统计、工单列表和处理入口。</span>
        ${tabs(["全部", "待处理", "处理中", "已完成"], 0)}
        <section class="card aftersale-record-stats">
          ${[
            ["flame", "待处理", "4", "orange"],
            ["clock", "处理中", "2", "blue"],
            ["check", "已完成", "18", "green"],
          ].map(([iconName, label, value, color]) => `
            <div class="${color}">
              <span>${icon(iconName, 18)}</span>
              <em>${label}</em>
              <strong>${value}</strong>
            </div>
          `).join("")}
        </section>
        <section class="aftersale-record-list">
          ${tickets.map(([iconName, title, tag, status, user, service, time, desc, color, target, action]) => `
            <article class="card aftersale-record-card ${color}">
              <span class="record-icon">${icon(iconName, 34)}</span>
              <div class="record-main">
                <h3>${title} ${chip(tag, color)}</h3>
                <p>${icon("user", 18)}<span>${user}</span><button type="button" data-action="拨打${user.replace("用户：", "")}电话">${icon("phone", 18)}</button></p>
                <p>${icon("briefcase-business", 18)}<span>${service}</span></p>
                <p>${icon("clock", 18)}<span>${time}</span></p>
                <p>${icon("message-circle", 18)}<span>问题描述：${desc}</span></p>
              </div>
              <strong class="record-status">${status}</strong>
              <button class="record-open" type="button" data-go="${target}" aria-label="查看售后详情">${icon("chevron-right", 24)}</button>
              <button class="record-action" type="button" data-go="${target}">${action}</button>
            </article>
          `).join("")}
        </section>
      `,
    });
  }

  const variant = {
    "10": ["异常上报", "订单服务中出现异常，请选择原因并上传凭证。", "circle-alert", "red"],
    "12": ["售后处理详情", "客户反馈服务时间不准时，请在 24 小时内处理。", "message-circle-warning", "orange"],
    "17": ["售后与评价", "处理售后投诉与客户评价回复。", "star", "purple"],
    "18": ["服务执行 / 完成上报", "记录服务人员、上门照片和完成说明。", "clipboard-check", "blue"],
    "23": ["预约详情 / 报价确认", "客户已提交预约信息，请确认报价方案。", "file-check", "orange"],
    "34": ["预约确认", "请确认服务时间与服务人员安排。", "calendar-check", "blue"],
    "35": ["预约拒绝", "请选择拒绝原因，并向客户说明。", "calendar-x", "red"],
    "36": ["订单改期", "请选择新的服务日期与时间段。", "calendar-clock", "orange"],
    "37": ["报价方案编辑", "根据客户需求调整服务项目与报价。", "file-pen-line", "orange"],
    "38": ["服务人员安排", "为订单分配可服务人员。", "users", "blue"],
    "40": ["售后处理记录", "查看售后工单处理进度。", "history", "purple"],
  }[screen.id] || ["订单详情", "查看预约订单信息、客户需求与履约进度。", "clipboard-list", "blue"];

  const [title, intro, iconName, color] = variant;
  const order = orderItems[screen.id === "23" || screen.id === "37" ? 1 : 0];
  if (!order) {
    return frame({
      title: screen.title.includes("丿") ? "预约详情 / 报价确认" : screen.title,
      right: screen.id === "14" ? "联系客服" : "联系客户",
      rightGo: screen.id === "14" ? "09" : "",
      content: `
        <section class="card detail-hero">
          ${miniIcon(iconName, color)}
          <div><h2>${title}</h2><p>${intro}</p></div>
        </section>
        <section class="card section-card merchant-reception-empty">
          <strong>暂无订单数据</strong>
          <span>订单详情只展示分配给当前商户的预约。</span>
        </section>
        <div class="sticky-action two-actions">
          <button class="secondary-button" type="button" data-go="24">返回工作台</button>
          <button class="primary-button" type="button" data-go="20">查看订单列表</button>
        </div>
      `,
    });
  }

  return frame({
    title: screen.title.includes("丿") ? "预约详情 / 报价确认" : screen.title,
    right: screen.id === "14" ? "联系客服" : "联系客户",
    rightGo: screen.id === "14" ? "09" : "",
    content: `
      <section class="card detail-hero">
        ${miniIcon(iconName, color)}
        <div><h2>${title}</h2><p>${intro}</p></div>
      </section>
      <section class="card order-card">
        <div class="order-top">
          <span class="avatar"><img src="${order.avatar}" alt="${order.name}" /></span>
          <div>
            <div class="order-name">${order.name}<span class="muted">${order.age}</span>${chip(order.service)}</div>
            <div class="info-line">${icon("phone", 15)}<span>138 **** 8888</span></div>
            <div class="info-line">${icon("map-pin", 15)}<span>${order.address}</span></div>
          </div>
          ${chip(order.status, order.state)}
        </div>
      </section>
      <section class="card form-section">
        <h3 class="section-title">订单信息</h3>
        ${field("订单号", "202505200001", { suffix: "" })}
        ${field("服务项目", order.service, { suffix: "" })}
        ${field("预约时间", order.time, { suffix: "" })}
        ${field("预计金额", order.amount, { suffix: "" })}
      </section>
      ${["35", "36", "37", "38", "18", "10", "12", "17"].includes(screen.id) ? renderActionSection(screen.id) : ""}
      <section class="card form-section">
        <h3 class="section-title">处理进度</h3>
        <div class="timeline">
          <div class="timeline-item"><strong>预约已提交</strong><br />今天 08:21　客户通过微信小程序提交预约</div>
          <div class="timeline-item"><strong>等待商户处理</strong><br />请尽快确认服务安排</div>
        </div>
      </section>
      <div class="sticky-action two-actions">
        <button class="secondary-button" type="button" data-go="20">${["35", "12"].includes(screen.id) ? "暂不处理" : "联系客户"}</button>
        <button class="primary-button" type="button" data-go="${screen.id === "18" ? "39" : "20"}">${primaryActionText(screen.id)}</button>
      </div>
    `,
  });
}

function renderCompleteReport() {
  const order = merchantSelectedRuntimeOrder(["待服务", "服务中"]);
  const contact = {
    ...MERCHANT_ACTIVE_SERVICE_CONTACT,
    name: order?.name || MERCHANT_ACTIVE_SERVICE_CONTACT.name,
    phone: order?.phone || MERCHANT_ACTIVE_SERVICE_CONTACT.phone,
    address: order?.address || MERCHANT_ACTIVE_SERVICE_CONTACT.address,
  };
  const orderId = escapeHtml(order?.id || order?.orderNo || "");
  const customerName = escapeHtml(contact.name);
  const customerAge = escapeHtml(order?.age || "");
  const serviceName = escapeHtml(order?.service || "商户服务");
  const serviceAddress = escapeHtml(contact.address);
  const serviceStatus = order?.apiStatus || order?.status || "服务中";
  const serviceAction = serviceStatus === "待服务" ? "start" : "complete";
  const serviceActionLabel = serviceAction === "start" ? "开始服务" : "提交完成";
  const contactTelHref = merchantTelHref(contact.phone);
  const navigationHref = merchantNavigationHref(contact);
  const serviceNote = merchantServiceNoteValue();
  const steps = [
    ["1. 到达客户地址", "09:30", "已完成", "done"],
    ["2. 服务前沟通与评估", "09:32", "已完成", "done"],
    ["3. 执行服务内容", "", "进行中", "active"],
    ["4. 服务后整理与交接", "", "待完成", ""],
  ];
  return frame({
    title: "服务执行 / 完成上报",
    right: serviceStatus === "待服务" ? "待开始" : "服务中",
    rightStatic: true,
    assurance: false,
    screenClass: "service-complete-screen",
    content: `
      <section class="merchant-service-hero">
        <div class="merchant-service-timer"><span>${icon("clock", 18)}服务进行中　00:38:24</span><em>预计结束 10:45</em></div>
        <div class="merchant-service-user">
          <span class="avatar"><img src="${assets.customerLiRef}" alt="${customerName}" /></span>
          <div><h2>${customerName} ${customerAge ? `<span>${customerAge}</span>` : ""}<a class="inline-call-link" href="${contactTelHref}" aria-label="拨打客户电话">${icon("phone", 16)}</a></h2><p>${serviceName}</p></div>
        </div>
        <div class="merchant-service-lines">
          <span>${icon("clipboard-list", 16)}服务项目</span><b>${serviceName}</b>
          <span>${icon("map-pin", 16)}服务地址</span><b>${serviceAddress}</b>
          <span>${icon("user", 16)}服务人员</span><b><img src="${assets.nurseWang}" alt="">王护理员 <em>护理师</em></b>
        </div>
        <a class="hero-call" href="${contactTelHref}" aria-label="拨打客户电话">${icon("phone", 18)}</a>
      </section>
      <section class="card service-step-card">
        <h3 class="section-title">服务步骤清单</h3>
        <div class="service-step-list">
          ${steps.map(([title, time, state, cls], index) => `<div class="${cls}"><i>${cls === "done" ? icon("check", 14) : index + 1}</i><span>${title}</span><em>${time}</em><b>${state}</b></div>`).join("")}
        </div>
      </section>
      <div class="merchant-service-grid">
        <section class="card service-staff-card">
          <h3 class="section-title">服务人员信息</h3>
          <div><span class="avatar"><img src="${assets.nurseWang}" alt="王护理员"></span><p><b>王护理员 <em>护理师</em></b><small>工号：NURSE-10086</small></p></div>
        </section>
        <section class="card service-contact-card">
          <a href="${contactTelHref}">${icon("phone", 30)}<span>联系客户</span></a>
          <a href="${navigationHref}" target="_blank" rel="noopener" data-merchant-map-link>${icon("navigation", 30)}<span>导航到客户</span></a>
        </section>
      </div>
      <section class="card service-proof-card">
        <h3 class="section-title">服务照片 / 完成证明 <small>（至少上传 2 张）</small></h3>
        <div class="service-proof-grid">
          <figure><img src="${assets.serviceBeforeProof}" alt="服务前"><button type="button" data-action="删除照片">×</button><figcaption>服务前</figcaption></figure>
          <figure><img src="${assets.serviceDuringProof}" alt="服务中"><button type="button" data-action="删除照片">×</button><figcaption>服务中</figcaption></figure>
          <button class="upload-proof" type="button" data-action="上传照片">${icon("camera", 28)}上传照片</button>
          <aside><b>拍摄要求</b><p>照片清晰真实<br>包含服务过程<br>保护客户隐私</p></aside>
        </div>
        <h3 class="section-title note-title">服务记录 / 备注 <small>选填</small></h3>
        <textarea class="textarea-like service-note" rows="4" data-merchant-service-note placeholder="请输入服务过程记录、客户反馈或其他备注信息...">${escapeHtml(serviceNote)}</textarea>
      </section>
      <div class="sticky-action two-actions service-complete-actions">
        <button class="secondary-button" type="button" data-go="10">${icon("circle-alert", 18)}异常上报</button>
        <button class="primary-button" type="button" data-go="39" data-merchant-order-action="${serviceAction}" data-order-id="${orderId}">${icon("circle-check", 18)}${serviceActionLabel}</button>
      </div>
    `,
  });
}

function renderActionSection(id) {
  if (id === "38") {
    return `<section class="card form-section"><h3 class="section-title">服务人员</h3>${[
      [assets.nurseWang, "王护工", "09:30 可服务"],
      [assets.nurseZhang, "张晓梅", "14:00 可服务"],
      [assets.avatarWang, "李华", "全天可服务"],
    ]
      .map(([avatar, name, sub], i) => `<div class="list-row"><span class="avatar" style="width:42px;height:42px"><img src="${avatar}" alt="${name}" /></span><div><div class="title">${name}${i === 0 ? chip("推荐") : ""}</div><div class="sub">${sub}</div></div><input type="radio" ${i === 0 ? "checked" : ""}/></div>`)
      .join("")}</section>`;
  }
  if (id === "37") {
    return `<section class="card form-section"><h3 class="section-title">报价方案</h3>${field("上门服务费", "¥180.00", { suffix: "" })}${field("护理耗材", "¥80.00", { suffix: "" })}${field("交通补贴", "¥8.00", { suffix: "" })}${field("合计", "¥268.00", { suffix: "" })}</section>`;
  }
  if (id === "36") {
    return `<section class="card form-section"><h3 class="section-title">选择新时间</h3><div class="selector-grid">${["05-21", "05-22", "05-23"].map((d, i) => `<button class="choice ${i === 0 ? "active" : ""}">${d}<small>${["周二", "周三", "周四"][i]}</small></button>`).join("")}</div><div class="selector-grid" style="margin-top:8px">${["09:00-11:00", "14:00-16:00", "16:00-18:00"].map((t, i) => `<button class="choice ${i === 0 ? "active" : ""}">${t}</button>`).join("")}</div></section>`;
  }
  if (id === "18" || id === "10") {
    return `<section class="card form-section"><h3 class="section-title">${id === "10" ? "异常说明" : "完成上报"}</h3><textarea class="textarea-like" rows="4" placeholder="${id === "10" ? "请描述异常情况，如客户临时取消、地址异常或服务无法完成。" : "请输入服务过程记录、客户反馈或其他备注信息。"}"></textarea><div class="upload-grid" style="margin-top:10px"><button class="upload-tile">${icon("camera", 22)}上传照片</button><button class="upload-tile">${icon("file-plus-2", 22)}上传凭证</button></div></section>`;
  }
  return `<section class="card form-section"><h3 class="section-title">处理说明</h3><textarea class="textarea-like" rows="4" placeholder="请输入处理备注，便于平台与客户了解处理进度。"></textarea></section>`;
}

function primaryActionText(id) {
  return (
    {
      "10": "提交异常",
      "12": "提交处理",
      "18": "提交完成上报",
      "23": "确认报价",
      "34": "确认预约",
      "35": "确认拒绝预约",
      "36": "提交改期申请",
      "37": "提交报价",
      "38": "确认派工",
      "40": "查看详情",
    }[id] || "确认处理"
  );
}

function renderExceptionReport() {
  const contactTelHref = merchantTelHref(MERCHANT_ACTIVE_SERVICE_CONTACT.phone);
  const exceptionTypes = [
    ["circle-alert", "客户不在家"],
    ["clock", "服务需延期"],
    ["users", "客户临时取消"],
    ["map-pin", "地址无法到达"],
    ["wrench", "物品/设备异常"],
    ["message-circle-more", "其他原因"],
  ];
  return frame({
    title: "异常上报",
    right: "联系客服",
    rightGo: "09",
    screenClass: "merchant-exception-screen",
    assurance: false,
    content: `
      <div class="merchant-exception-tip">${icon("circle-alert", 18)}请如实填写异常原因，平台将在24小时内处理</div>
      <section class="card merchant-exception-order">
        <div class="order-icon">${miniIcon("clipboard-list", "blue")}</div>
        <div class="order-main">
          <h2>订单号 <span>20250520000123</span>${chip("服务中", "blue")}</h2>
          <p>${icon("clipboard-list", 15)}<span>客户</span><b>李奶奶</b><a class="merchant-exception-call" href="${contactTelHref}" aria-label="拨打客户电话">${icon("phone", 15)}</a></p>
          <p>${icon("clipboard-check", 15)}<span>服务</span><b>居家护理服务（基础护理）</b></p>
          <p>${icon("clock", 15)}<span>预约时间</span><b>2025-05-20　09:30-11:30</b></p>
        </div>
      </section>
      <section class="card merchant-exception-card">
        <h3 class="section-title">异常类型</h3>
        <div class="merchant-exception-type-grid">
          ${exceptionTypes.map(([iconName, label], index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-action="选择异常类型：${label}"><span class="merchant-exception-type-icon">${icon(iconName, 18)}</span>${label}</button>`).join("")}
        </div>
      </section>
      <section class="card merchant-exception-card">
        <h3 class="section-title">现场照片 / 证明</h3>
        <div class="merchant-exception-photos">
          <figure><img src="${assets.exceptionDoor}" alt="客户不在家现场照片"><button type="button" data-action="删除现场照片">${icon("x", 14)}</button></figure>
          <figure><img src="${assets.exceptionEntry}" alt="楼道现场照片"><button type="button" data-action="删除现场照片">${icon("x", 14)}</button></figure>
          <button class="merchant-exception-upload" type="button" data-action="上传照片">${icon("camera", 30)}<span>上传照片</span></button>
        </div>
        <p class="merchant-exception-note">最多上传6张，需保护客户隐私</p>
      </section>
      <section class="card merchant-exception-card merchant-exception-method">
        <h3 class="section-title">处理方式</h3>
        ${["申请改约", "申请取消订单", "继续服务并备注"].map((label, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-action="处理方式：${label}"><i></i>${label}</button>`).join("")}
      </section>
      <section class="card merchant-exception-card merchant-exception-desc">
        <h3 class="section-title">异常说明</h3>
        <label><textarea placeholder="请描述现场情况、沟通结果或需要平台协助的问题..."></textarea><em>0/300</em></label>
      </section>
      <div class="sticky-action two-actions merchant-exception-actions">
        <button class="secondary-button" type="button" data-action="暂存草稿">${icon("save", 18)}暂存草稿</button>
        <button class="primary-button" type="button" data-action="提交异常">提交异常</button>
      </div>
    `,
  });
}

function renderGenericDetail(screen) {
  if (screen.id === "10") {
    return renderExceptionReport();
  }

  if (screen.id === "11") {
    const unifiedStats = getMerchantUnifiedStats();
    const service = currentMerchantService();
    if (!service) {
      return frame({
        title: "服务详情",
        right: "服务列表",
        rightGo: "19",
        screenClass: "service-preview-screen",
        assurance: false,
        content: `
          <section class="card section-card empty-state">
            ${icon("package-search", 40)}
            <strong>暂无服务数据</strong>
            <span>服务详情只展示当前商户的服务。</span>
            <button class="primary-button" type="button" data-go="19">返回服务列表</button>
          </section>
        `,
      });
    }
    const statusTone = service.state === "green" ? "green" : service.state === "orange" ? "orange" : "gray";
    const serviceParts = String(service.description || "")
      .split(/[，,、。；;\\n]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 6);
    return frame({
      title: "服务详情",
      right: "编辑",
      rightGo: "30",
      screenClass: "service-preview-screen",
      assurance: false,
      content: `
        <section class="card service-preview-hero">
          <img src="${service.image}" alt="${escapeHtml(service.title)}">
          <div>
            <h2>${escapeHtml(service.title)}</h2>
            <p class="service-preview-tags">${chip(escapeHtml(service.tag), "blue")}${chip(escapeHtml(service.status), statusTone)}</p>
            <p class="service-preview-price"><b>${escapeHtml(service.price)}</b><span>/ ${escapeHtml(service.unit || "次")}</span></p>
            <p class="service-preview-meta"><span>${icon("clock", 15)}服务单位 ${escapeHtml(service.duration)}</span><span>${icon("clipboard-list", 15)}订单 ${service.orderCount} 单</span></p>
          </div>
        </section>
        <section class="card service-preview-section">
          <h3><span></span>图文介绍</h3>
          <p>${escapeHtml(service.description || "该服务暂无补充说明，后台服务档案已更新。")}</p>
          <div class="service-preview-photos"><img src="${assets.servicePreviewLife}" alt="生活照护"><img src="${assets.servicePreviewVitals}" alt="生命体征监测"><img src="${assets.servicePreviewMeds}" alt="用药照护"></div>
        </section>
        <section class="card service-preview-section service-preview-content">
          <h3><span></span>服务内容</h3>
          <div>${(serviceParts.length ? serviceParts : [service.tag, "服务档案", "商户服务内容"]).map((v) => `<span>${icon("circle-check", 13)}${escapeHtml(v)}</span>`).join("")}</div>
        </section>
        <section class="card service-preview-section service-preview-booking">
          <h3><span></span>预约设置</h3>
          ${[
            ["clock", "可预约时间", "周一至周五　09:00–12:00 / 14:00–18:00 / 19:00–21:00", "32"],
            ["map-pin", "服务范围", "昆明市盘龙区、五华区、官渡区、西山区", "33"],
            ["file-text", "取消规则", "服务前2小时可取消", "66"],
          ].map(([iconName, label, value, route]) => `<button type="button" data-go="${route}"><span>${miniIcon(iconName, "blue")}${label}</span><em>${value}</em>${icon("chevron-right", 15)}</button>`).join("")}
        </section>
        <section class="card service-preview-section service-preview-data">
          <h3><span></span>数据表现</h3>
          <div>
            ${[
              ["calendar-check", "接单数", String(service.orderCount || 0), "服务统计", "green"],
              ["circle-dollar-sign", "成交额", merchantMoney(unifiedStats.revenue), "经营统计", "orange"],
              ["thumbs-up", "好评率", unifiedStats.favorableRate, "客户评价", "blue"],
            ].map(([iconName, label, value, trend, color]) => `<article>${miniIcon(iconName, color)}<span>${label}</span><b>${value}</b><small>${trend}</small></article>`).join("")}
          </div>
        </section>
        <div class="sticky-action three-actions service-preview-actions">
          <button class="secondary-button" data-merchant-service-status="${escapeHtml(service.id)}" type="button">${icon("download", 15)}${merchantServiceStatusActionText(service)}服务</button>
          <button class="secondary-button" data-merchant-service-copy="${escapeHtml(service.id)}" type="button">${icon("copy", 15)}复制服务</button>
          <button class="primary-button" data-merchant-service-edit="${escapeHtml(service.id)}" type="button">${icon("pencil", 15)}编辑服务</button>
        </div>
      `,
    });
  }

  return renderOrderDetail(screen);
}

function bindPassiveButtonsToHtml(html) {
  return String(html || "").replace(
    /<button\b(?![^>]*\bdata-[a-z0-9_-]+(?:=|\s|>))(?![^>]*\btype=["']submit["'])/gi,
    '<button data-action="查看详情"',
  );
}

function renderScreen(screen) {
  return bindPassiveButtonsToHtml(renderScreenRaw(screen));
}

function renderScreenRaw(screen) {
  if (screen.id === "67") return renderLogin();
  if (screen.id === "24") return renderWorkbench();
  if (screen.id === "18") return renderCompleteReport();
  if (screen.id === "19") return renderServiceList();
  if (screen.id === "20") return renderOrderList();
  if (screen.id === "16") return renderDataDashboard();
  if (screen.id === "15") return renderProfileHome();
  if (["21", "26", "27", "28", "29", "69", "70"].includes(screen.id)) return renderRegister(screen);
  if (["04", "05", "42", "43", "44", "45"].includes(screen.id)) return renderWalletLike(screen);
  if (["06", "13", "46", "47", "48"].includes(screen.id)) return renderInvoice(screen);
  if (["09", "49", "50", "51", "52"].includes(screen.id)) return renderSupport(screen);
  if (["07", "08", "59", "60", "61", "62", "63", "64", "65", "66", "68"].includes(screen.id)) return renderSettings(screen);
  if (["02", "03", "53", "54", "55", "56", "57", "58"].includes(screen.id)) return renderMerchantProfile(screen);
  if (["22", "30", "31", "32", "33"].includes(screen.id)) return renderServiceForm(screen);
  if (["01", "25"].includes(screen.id)) return renderMessages(screen);
  if (["10", "11", "12", "14", "17", "18", "23", "34", "35", "36", "37", "38", "39", "40", "41"].includes(screen.id)) {
    return renderGenericDetail(screen);
  }
  return renderMessages(screen);
}

function renderList() {
  const query = searchEl.value.trim().toLowerCase();
  const visible = screens.filter((screen) => `${screen.id}-${screen.title}`.toLowerCase().includes(query));
  screenListEl.innerHTML = visible
    .map(
      (screen) => `
        <button class="screen-button ${screen.id === activeId ? "is-active" : ""}" type="button" data-screen="${screen.id}">
          <span class="num">${screen.id}</span>
          <span>${screen.title}</span>
        </button>
      `,
    )
    .join("");
}

function renderCurrent() {
  const screen = screens.find((item) => item.id === activeId) || screens[0];
  localStorage.setItem("merchant-ui-active", screen.id);
  phoneEl.innerHTML = renderScreen(screen);
  hydratePassiveButtons(phoneEl);
  hydrateInteractiveControls(phoneEl);
  $("#screenCounter").textContent = `${screen.id}/70`;
  $("#currentScreenName").textContent = screen.title;
  renderList();
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initStatusRuntime();
  syncStatusBar();
  ensureMerchantFunctionOverview(screen.id);
  ensureMerchantServiceCategories(screen.id);
  ensureMerchantRealPageData(screen.id);
  hydrateMerchantApiData(screen.id);
  if (screen.id === "51") scrollMerchantSupportToLatest();
}

const merchantApiHydrateState = {
  loading: false,
  lastAt: 0,
  signature: "",
};

function hydrateMerchantApiData(screenId) {
  const businessScreens = new Set(["01", "02", "15", "16", "17", "18", "19", "20", "22", "23", "24", "25", "30", "34", "36", "37", "39", "40", "41", "42", "53", "56"]);
  if (!businessScreens.has(screenId) || merchantApiHydrateState.loading) return;
  const now = Date.now();
  if (now - merchantApiHydrateState.lastAt < 2500) return;
  merchantApiHydrateState.loading = true;
  window.setTimeout(async () => {
    try {
      await ensureMerchantToken();
      const [profile, dashboard, statsPayload, services, orders, reviews, messages] = await Promise.all([
        merchantApiRequest("/api/merchant/profile?merchantId=merchant-001"),
        merchantApiRequest("/api/merchant/dashboard?merchantId=merchant-001"),
        merchantApiRequest("/api/merchant/stats?merchantId=merchant-001"),
        merchantApiRequest("/api/merchant/services?merchantId=merchant-001"),
        merchantApiRequest("/api/merchant/orders?merchantId=merchant-001"),
        merchantApiRequest("/api/merchant/reviews?merchantId=merchant-001").catch(() => []),
        merchantApiRequest("/api/messages?role=merchant").catch(() => []),
      ]);
      const changed = applyMerchantApiData({ profile, dashboard, statsPayload, services, orders, reviews, messages });
      merchantApiHydrateState.lastAt = Date.now();
      if (changed && businessScreens.has(activeId)) renderCurrent();
    } catch (error) {
      if (!phoneEl.querySelector("[data-merchant-api-status]")) {
        const status = document.createElement("p");
        status.className = "action-status";
        status.dataset.merchantApiStatus = "";
        status.textContent = `商户数据暂不可用：${merchantFriendlyText(error.message) || "请稍后重试"}`;
        phoneEl.appendChild(status);
      }
    } finally {
      merchantApiHydrateState.loading = false;
    }
  }, 0);
}

function applyMerchantApiData({ profile = null, dashboard = {}, statsPayload = null, services = [], orders = [], reviews = [], messages = [] }) {
  const stats = statsPayload?.stats || dashboard.stats || {};
  const normalizedDashboard = {
    ...dashboard,
    merchant: { ...(dashboard.merchant || {}), ...(statsPayload?.provider || {}), ...(profile || {}) },
    stats,
  };
  const signature = JSON.stringify({
    merchant: [
      normalizedDashboard.merchant?.name,
      normalizedDashboard.merchant?.status,
      normalizedDashboard.merchant?.onlineAccepting,
      normalizedDashboard.merchant?.serviceCategoryCount,
      ...(Array.isArray(normalizedDashboard.merchant?.storePhotos) ? normalizedDashboard.merchant.storePhotos.map((item) => `${item.id}:${item.title}:${item.isCover ? "1" : "0"}`) : []),
    ],
    stats,
    services: services.map((item) => [item.id, item.title, item.status, item.price]),
    orders: orders.map((item) => [item.id, item.orderNo, item.status, item.amount, item.time]),
    reviews: reviews.map((item) => [item.id, item.rating]),
    analytics: [
      statsPayload?.analytics?.trend?.length || 0,
      statsPayload?.analytics?.serviceDistribution?.length || 0,
      statsPayload?.analytics?.settlementRows?.length || 0,
    ],
    messages: messages.map((item) => [item.id, item.title, item.read]),
  });
  if (signature === merchantApiHydrateState.signature) return false;
  merchantApiHydrateState.signature = signature;
  serviceItems.splice(0, serviceItems.length, ...services.map(merchantServiceFromApi));
  orderItems.splice(0, orderItems.length, ...orders.map(merchantOrderFromApi));
  merchantReceptionServices.splice(0, merchantReceptionServices.length, ...orders
    .filter((order) => !["已完成", "已取消"].includes(order.status))
    .map(merchantReceptionFromApi));
  merchantWorkbenchState.dashboard = normalizedDashboard;
  merchantWorkbenchState.profile = normalizedDashboard.merchant;
  merchantWorkbenchState.stats = stats;
  merchantWorkbenchState.statsPayload = statsPayload;
  merchantWorkbenchState.reviews = reviews;
  merchantWorkbenchState.rawOrders = orders;
  merchantWorkbenchState.rawServices = services;
  merchantWorkbenchState.rawReviews = reviews;
  applyMerchantMessages(messages);
  if (typeof normalizedDashboard.merchant?.onlineAccepting === "boolean") {
    merchantOnlineAccepting = normalizedDashboard.merchant.onlineAccepting;
  }
  return true;
}

function applyMerchantMessages(messages = []) {
  merchantWorkbenchState.messages = Array.isArray(messages) ? messages : [];
  merchantMessageState.unread = merchantWorkbenchState.messages.filter((item) => !item.read).length;
  if (
    merchantMessageState.selectedId
    && !merchantWorkbenchState.messages.some((item) => item.id === merchantMessageState.selectedId)
  ) {
    merchantMessageState.selectedId = "";
  }
}

function merchantServiceFromApi(service, index = 0) {
  const imagePool = [assets.serviceCare, assets.serviceDoctor, assets.serviceRehab, assets.serviceTravel];
  return {
    id: service.id,
    raw: service,
    title: service.title || "商户服务",
    tag: service.category || "专业服务",
    price: `¥ ${Number(service.price || 0).toFixed(2)}`,
    priceValue: Number(service.price || 0),
    unit: service.unit || "次",
    duration: service.unit ? `1 ${service.unit}` : "1 次",
    status: service.status === "上架" ? "已上架" : service.status || "待审核",
    apiStatus: service.status || "待审核",
    image: service.image || imagePool[index % imagePool.length],
    state: /上架|通过/.test(service.status || "") ? "green" : /审核|待/.test(service.status || "") ? "orange" : "gray",
    description: service.description || "",
    orderCount: Number(service.orderCount || 0),
  };
}

function merchantOrderFromApi(order, index = 0) {
  const status = order.status || "待确认";
  const state = /完成/.test(status) ? "green" : /服务中|待服务|已报价/.test(status) ? "blue" : /取消|拒绝/.test(status) ? "red" : "orange";
  const action = /待派单|已派单|待接单|已报价/.test(status) ? "确认预约" : /待报价|报价中/.test(status) ? "去报价" : status === "待服务" ? "开始服务" : /服务中/.test(status) ? "去服务" : "查看详情";
  const target = action === "去报价" ? "37" : /开始服务|去服务/.test(action) ? "18" : action === "确认预约" ? "34" : "14";
  const avatars = [assets.avatarLi, assets.avatarZhang, assets.avatarWang, assets.avatarLiu];
  return {
    id: order.id,
    orderNo: order.orderNo,
    name: order.elderName || "旅居用户",
    age: order.elderAge ? `${order.elderAge}岁` : "",
    gender: order.elderGender || order.gender || "",
    phone: order.phone || order.elderPhone || "",
    service: order.serviceType || "商户服务",
    time: order.time || order.createdAt || "时间待确认",
    address: order.location || "服务地址待确认",
    source: order.source || "用户端",
    amount: `¥${Number(order.amount || 0).toFixed(2)}`,
    status,
    apiStatus: status,
    state,
    action,
    actionTarget: target,
    detailTarget: target,
    avatar: avatars[index % avatars.length],
    note: order.note || "",
  };
}

function merchantOrderStatusMatches(order, statuses = []) {
  if (!statuses.length) return true;
  return statuses.includes(order?.apiStatus || order?.status || "");
}

function merchantRuntimeOrders() {
  const rawOrders = merchantWorkbenchState.rawOrders || [];
  return rawOrders.length ? rawOrders.map(merchantOrderFromApi) : orderItems;
}

function merchantFindRuntimeOrder(orderId = "") {
  const id = String(orderId || "").trim();
  if (!id) return null;
  return merchantRuntimeOrders().find((order) => order.id === id || order.orderNo === id) || null;
}

function merchantSelectedRuntimeOrder(statuses = []) {
  const selected = merchantFindRuntimeOrder(merchantWorkbenchState.selectedOrderId || merchantRescheduleState.orderId);
  if (selected && merchantOrderStatusMatches(selected, statuses)) return selected;
  return merchantRuntimeOrders().find((order) => merchantOrderStatusMatches(order, statuses))
    || selected
    || merchantRuntimeOrders()[0]
    || null;
}

function merchantReceptionFromApi(order, index = 0) {
  const status = order.status || "待接待";
  const isQuoting = /待报价|报价中/.test(status);
  const isConfirmable = /待派单|已派单|待接单|已报价/.test(status);
  const isService = /服务中|待服务/.test(status);
  const category = merchantCategoryFromService(order.serviceType || order.requirementCategory || "");
  const colors = ["blue", "green", "orange", "purple"];
  return {
    id: order.id,
    orderNo: order.orderNo,
    category,
    title: order.serviceType || "商户服务",
    customer: order.elderName || "旅居用户",
    age: order.elderAge ? `${order.elderAge}岁` : "",
    time: order.time || "时间待确认",
    address: order.location || "服务地址待确认",
    need: order.note || "后台已分配服务需求，请商户处理",
    amount: Number(order.amount || 0),
    source: order.source || "用户端",
    status,
    color: colors[index % colors.length],
    target: isQuoting ? "37" : isService ? "18" : isConfirmable ? "34" : "14",
    action: isQuoting ? "提交报价" : status === "待服务" ? "开始服务" : /服务中/.test(status) ? "去服务" : isConfirmable ? "接待确认" : "查看详情",
  };
}

function merchantCategoryFromService(service = "") {
  if (/医|诊|体检/.test(service)) return "医疗服务";
  if (/护理|康养|康复/.test(service)) return "上门护理";
  if (/餐|食|营养/.test(service)) return "营养餐食";
  if (/维修|保洁|生活/.test(service)) return "生活服务";
  return "专业服务";
}

function setActive(id, options = {}) {
  const { updateHash = true, record = true, replace = false } = options;
  if (!screens.some((screen) => screen.id === id)) return;
  if (record && activeId && activeId !== id) {
    const last = navigationStack[navigationStack.length - 1];
    if (last !== activeId) navigationStack.push(activeId);
    if (navigationStack.length > 50) navigationStack = navigationStack.slice(-50);
  }
  activeId = id;
  renderCurrent();
  if (updateHash) {
    const nextUrl = `#${id}`;
    if (replace) {
      history.replaceState({ screen: id }, "", nextUrl);
    } else {
      history.pushState({ screen: id }, "", nextUrl);
    }
  }
}

function refreshMerchantCurrentScreen(source, id = activeId) {
  const nextId = normalizeMerchantScreenId(id);
  if (!nextId || nextId !== activeId) return false;
  merchantRefreshSeq += 1;
  renderCurrent();
  const screen = phoneEl.querySelector(".phone-screen");
  const content = phoneEl.querySelector(".phone-content");
  const title = phoneEl.querySelector(".app-header .title") || content || screen;
  screen?.setAttribute("data-merchant-refreshed", String(merchantRefreshSeq));
  if (content) {
    if (typeof content.scrollTo === "function") content.scrollTo({ top: 0, behavior: "smooth" });
    else content.scrollTop = 0;
  }
  if (title) {
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
  }
  writeActionStatus(source || content || phoneEl, "当前页面已刷新并回到顶部");
  return true;
}

function goBack() {
  while (navigationStack.length) {
    const target = navigationStack.pop();
    if (target && target !== activeId && screens.some((screen) => screen.id === target)) {
      setActive(target, { updateHash: true, record: false, replace: true });
      return;
    }
  }
  setActive(defaultBackTarget(activeId), { updateHash: true, record: false, replace: true });
}

function defaultBackTarget(id) {
  if (["02", "03", "53", "54", "55", "56", "57", "58", "07", "08", "59", "60", "61", "62", "63", "64", "65", "66", "68"].includes(id)) return "15";
  if (["11", "22", "30", "31", "32", "33"].includes(id)) return "19";
  if (["14", "23", "34", "35", "36", "37", "38", "39", "10", "12", "18", "40", "41"].includes(id)) return "20";
  if (["04", "05", "42", "43", "44", "45", "06", "13", "46", "47", "48"].includes(id)) return "16";
  if (["09", "49", "50", "51", "52", "25", "01"].includes(id)) return "24";
  return "24";
}

screenListEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-screen]");
  if (button) setActive(button.dataset.screen);
});

phoneEl.addEventListener("click", async (event) => {
  const back = event.target.closest("[data-back]");
  if (back) {
    event.preventDefault();
    goBack();
    return;
  }
  const serviceOpen = event.target.closest("[data-merchant-service-open]");
  if (serviceOpen) {
    event.preventDefault();
    selectMerchantService(serviceOpen.dataset.merchantServiceOpen);
    setActive("11");
    return;
  }
  const serviceEdit = event.target.closest("[data-merchant-service-edit]");
  if (serviceEdit) {
    event.preventDefault();
    selectMerchantService(serviceEdit.dataset.merchantServiceEdit);
    setActive("30");
    return;
  }
  const serviceStatusAction = event.target.closest("[data-merchant-service-status]");
  if (serviceStatusAction) {
    event.preventDefault();
    await handleMerchantServiceStatus(serviceStatusAction);
    return;
  }
  const serviceCopy = event.target.closest("[data-merchant-service-copy]");
  if (serviceCopy) {
    event.preventDefault();
    await handleMerchantServiceCopy(serviceCopy);
    return;
  }
  const serviceSubmit = event.target.closest("[data-merchant-service-submit]");
  if (serviceSubmit) {
    event.preventDefault();
    await handleMerchantServiceSubmit(serviceSubmit);
    return;
  }
  const serviceStatus = event.target.closest("[data-service-status]");
  if (serviceStatus) {
    event.preventDefault();
    merchantServiceState.status = merchantServiceFilters.includes(serviceStatus.dataset.serviceStatus) ? serviceStatus.dataset.serviceStatus : "全部";
    merchantServiceState.filterOpen = false;
    renderCurrent();
    return;
  }
  const serviceFilterToggle = event.target.closest("[data-service-filter-toggle]");
  if (serviceFilterToggle) {
    event.preventDefault();
    merchantServiceState.filterOpen = !merchantServiceState.filterOpen;
    renderCurrent();
    return;
  }
  const merchantFunctionRefresh = event.target.closest("[data-merchant-function-refresh]");
  if (merchantFunctionRefresh) {
    event.preventDefault();
    merchantFunctionOverviewState.loaded = false;
    loadMerchantFunctionOverview({ force: true });
    return;
  }
  const serviceCategoryRefresh = event.target.closest("[data-service-category-refresh]");
  if (serviceCategoryRefresh) {
    event.preventDefault();
    merchantServiceCategoryState.loaded = false;
    loadMerchantServiceCategories({ force: true });
    return;
  }
  const serviceCategorySelect = event.target.closest("[data-service-category-select]");
  if (serviceCategorySelect) {
    event.preventDefault();
    const id = serviceCategorySelect.dataset.serviceCategorySelect;
    if (id) {
      merchantServiceCategoryState.selectedId = id;
      renderCurrent();
    }
    return;
  }
  const serviceCategoryConfirm = event.target.closest("[data-service-category-confirm]");
  if (serviceCategoryConfirm) {
    event.preventDefault();
    await handleMerchantServiceCategoryConfirm(serviceCategoryConfirm);
    return;
  }
  const merchantCertPreview = event.target.closest("[data-merchant-cert-preview]");
  if (merchantCertPreview) {
    event.preventDefault();
    merchantRealPageState.qualification.previewFileId = merchantCertPreview.dataset.merchantCertPreview || "";
    renderCurrent();
    return;
  }
  const merchantCertPreviewClose = event.target.closest("[data-merchant-cert-preview-close]");
  if (merchantCertPreviewClose) {
    event.preventDefault();
    merchantRealPageState.qualification.previewFileId = "";
    renderCurrent();
    return;
  }
  const merchantSecurityToggle = event.target.closest("[data-merchant-security-toggle]");
  if (merchantSecurityToggle) {
    event.preventDefault();
    await handleMerchantSecurityToggle(merchantSecurityToggle);
    return;
  }
  const merchantSecurityLogoutDevices = event.target.closest("[data-merchant-security-logout-devices]");
  if (merchantSecurityLogoutDevices) {
    event.preventDefault();
    await handleMerchantSecurityLogoutDevices(merchantSecurityLogoutDevices);
    return;
  }
  const merchantSettingsNotification = event.target.closest("[data-merchant-settings-notification]");
  if (merchantSettingsNotification) {
    event.preventDefault();
    await handleMerchantSettingsNotification(merchantSettingsNotification);
    return;
  }
  const merchantSettingsExport = event.target.closest("[data-merchant-settings-export]");
  if (merchantSettingsExport) {
    event.preventDefault();
    await handleMerchantSettingsExport(merchantSettingsExport);
    return;
  }
  const merchantSettingsClearCache = event.target.closest("[data-merchant-settings-clear-cache]");
  if (merchantSettingsClearCache) {
    event.preventDefault();
    await handleMerchantSettingsClearCache(merchantSettingsClearCache);
    return;
  }
  const merchantSettingsFontSize = event.target.closest("[data-merchant-settings-font-size-choice]");
  if (merchantSettingsFontSize) {
    event.preventDefault();
    await handleMerchantSettingsFontSize(merchantSettingsFontSize);
    return;
  }
  const merchantSettingsCommon = event.target.closest("[data-merchant-settings-common-key]");
  if (merchantSettingsCommon) {
    event.preventDefault();
    await handleMerchantSettingsCommon(merchantSettingsCommon);
    return;
  }
  const merchantPrivacyDetail = event.target.closest("[data-merchant-privacy-detail]");
  if (merchantPrivacyDetail) {
    event.preventDefault();
    merchantRealPageState.privacy.detailKey = merchantPrivacyDetail.dataset.merchantPrivacyDetail || "";
    renderCurrent();
    return;
  }
  const merchantPrivacyToggle = event.target.closest("[data-merchant-privacy-toggle]");
  if (merchantPrivacyToggle) {
    event.preventDefault();
    await handleMerchantPrivacyToggle(merchantPrivacyToggle);
    return;
  }
  const merchantPrivacyExport = event.target.closest("[data-merchant-privacy-export]");
  if (merchantPrivacyExport) {
    event.preventDefault();
    await handleMerchantSettingsExport(merchantPrivacyExport);
    return;
  }
  const merchantPrivacySave = event.target.closest("[data-merchant-privacy-save]");
  if (merchantPrivacySave) {
    event.preventDefault();
    await handleMerchantPrivacySave(merchantPrivacySave);
    return;
  }
  const merchantPermissionTipClose = event.target.closest("[data-merchant-permission-tip-close]");
  if (merchantPermissionTipClose) {
    event.preventDefault();
    merchantRealPageState.permissions.tipVisible = false;
    renderCurrent();
    return;
  }
  const merchantPermissionToggle = event.target.closest("[data-merchant-permission-toggle]");
  if (merchantPermissionToggle) {
    event.preventDefault();
    await handleMerchantPermissionToggle(merchantPermissionToggle);
    return;
  }
  const merchantPermissionsDone = event.target.closest("[data-merchant-permissions-done]");
  if (merchantPermissionsDone) {
    event.preventDefault();
    merchantRealPageState.settings.loaded = false;
    setActive("08");
    return;
  }
  const merchantSessionLogout = event.target.closest("[data-merchant-session-logout]");
  if (merchantSessionLogout) {
    event.preventDefault();
    await handleMerchantSessionLogout(merchantSessionLogout);
    return;
  }
  const merchantSupportContact = event.target.closest("[data-merchant-support-contact]");
  if (merchantSupportContact) {
    event.preventDefault();
    await handleMerchantSupportContact(merchantSupportContact);
    return;
  }
  const merchantInvoiceFilter = event.target.closest("[data-merchant-invoice-filter]");
  if (merchantInvoiceFilter) {
    event.preventDefault();
    handleMerchantInvoiceFilter(merchantInvoiceFilter);
    return;
  }
  const merchantInvoicePreference = event.target.closest("[data-merchant-invoice-preference-key]");
  if (merchantInvoicePreference) {
    event.preventDefault();
    await handleMerchantInvoicePreference(merchantInvoicePreference);
    return;
  }
  const merchantInvoiceApplyFocusOrders = event.target.closest("[data-merchant-invoice-apply-focus-orders]");
  if (merchantInvoiceApplyFocusOrders) {
    event.preventDefault();
    handleMerchantInvoiceApplyFocusOrders(merchantInvoiceApplyFocusOrders);
    return;
  }
  const merchantInvoiceApplyOrder = event.target.closest("[data-merchant-invoice-apply-order]");
  if (merchantInvoiceApplyOrder) {
    event.preventDefault();
    handleMerchantInvoiceApplyOrder(merchantInvoiceApplyOrder);
    return;
  }
  const merchantInvoiceApplyDelivery = event.target.closest("[data-merchant-invoice-apply-delivery]");
  if (merchantInvoiceApplyDelivery) {
    event.preventDefault();
    handleMerchantInvoiceApplyDelivery(merchantInvoiceApplyDelivery);
    return;
  }
  const merchantInvoiceApplyType = event.target.closest("[data-merchant-invoice-apply-type]");
  if (merchantInvoiceApplyType) {
    event.preventDefault();
    handleMerchantInvoiceApplyType(merchantInvoiceApplyType);
    return;
  }
  const merchantInvoiceApplySubmit = event.target.closest("[data-merchant-invoice-apply-submit]");
  if (merchantInvoiceApplySubmit) {
    event.preventDefault();
    await handleMerchantInvoiceApplySubmit(merchantInvoiceApplySubmit);
    return;
  }
  const workbenchCategory = event.target.closest("[data-workbench-category]");
  if (workbenchCategory) {
    event.preventDefault();
    merchantWorkbenchState.category = workbenchCategory.dataset.workbenchCategory || "全部";
    renderCurrent();
    return;
  }
  const dataRange = event.target.closest("[data-merchant-data-range]");
  if (dataRange) {
    event.preventDefault();
    merchantDataDashboardState.range = dataRange.dataset.merchantDataRange || "month";
    renderCurrent();
    return;
  }
  const rescheduleDate = event.target.closest("[data-merchant-reschedule-date]");
  if (rescheduleDate) {
    event.preventDefault();
    merchantRescheduleState.date = rescheduleDate.dataset.merchantRescheduleDate || merchantRescheduleState.date;
    renderCurrent();
    return;
  }
  const rescheduleSlot = event.target.closest("[data-merchant-reschedule-slot]");
  if (rescheduleSlot) {
    event.preventDefault();
    merchantRescheduleState.slot = rescheduleSlot.dataset.merchantRescheduleSlot || merchantRescheduleState.slot;
    renderCurrent();
    return;
  }
  const rescheduleReason = event.target.closest("[data-merchant-reschedule-reason]");
  if (rescheduleReason) {
    event.preventDefault();
    merchantRescheduleState.reason = rescheduleReason.dataset.merchantRescheduleReason || merchantRescheduleState.reason;
    renderCurrent();
    return;
  }
  const workbenchToolsToggle = event.target.closest("[data-workbench-tools-toggle]");
  if (workbenchToolsToggle) {
    event.preventDefault();
    merchantWorkbenchState.toolsExpanded = !merchantWorkbenchState.toolsExpanded;
    renderCurrent();
    return;
  }
  const merchantOrderFilterToggle = event.target.closest("[data-merchant-order-filter-toggle]");
  if (merchantOrderFilterToggle) {
    event.preventDefault();
    merchantOrderListState.filterOpen = !merchantOrderListState.filterOpen;
    renderCurrent();
    return;
  }
  const merchantOrderFilter = event.target.closest("[data-merchant-order-filter]");
  if (merchantOrderFilter) {
    event.preventDefault();
    merchantOrderListState.status = merchantOrderFilters.includes(merchantOrderFilter.dataset.merchantOrderFilter)
      ? merchantOrderFilter.dataset.merchantOrderFilter
      : "全部";
    merchantOrderListState.filterOpen = false;
    renderCurrent();
    return;
  }
  const merchantOrderAction = event.target.closest("[data-merchant-order-action]");
  if (merchantOrderAction) {
    event.preventDefault();
    await handleMerchantOrderAction(merchantOrderAction);
    return;
  }
  const ticketType = event.target.closest("[data-ticket-type]");
  if (ticketType) {
    event.preventDefault();
    merchantTicketState.type = ticketType.dataset.ticketType || "订单问题";
    renderCurrent();
    return;
  }
  const ticketUrgencyToggle = event.target.closest("[data-ticket-urgency-toggle]");
  if (ticketUrgencyToggle) {
    event.preventDefault();
    toggleMerchantTicketUrgencyPanel(ticketUrgencyToggle);
    return;
  }
  const ticketUrgency = event.target.closest("[data-ticket-urgency]");
  if (ticketUrgency) {
    event.preventDefault();
    selectMerchantTicketUrgency(ticketUrgency);
    return;
  }
  const ticketDescriptionTarget = event.target.closest("[data-ticket-description], .ticket-textarea");
  if (ticketDescriptionTarget) {
    markMerchantTicketDescriptionEditing(ticketDescriptionTarget);
    return;
  }
  const merchantPhotoDelete = event.target.closest("[data-merchant-photo-delete]");
  if (merchantPhotoDelete) {
    event.preventDefault();
    await handleMerchantPhotoDelete(merchantPhotoDelete);
    return;
  }
  const target = event.target.closest("[data-go]");
  if (target) {
    event.preventDefault();
    const routeOrderId = target.dataset.orderId || "";
    if (routeOrderId) {
      merchantWorkbenchState.selectedOrderId = routeOrderId;
      merchantRescheduleState.orderId = routeOrderId;
    }
    if (target.dataset.messageId) {
      merchantMessageState.selectedId = target.dataset.messageId;
    }
    try {
      const handled = await window.YunlvBusiness?.onRoute?.({
        role: "merchant",
        route: activeId,
        to: target.dataset.go,
        button: target,
        showToast,
        writeActionStatus,
      });
      if (handled) return;
    } catch (error) {
      writeActionStatus(target, error.message);
      showToast(error.message);
      return;
    }
    const nextId = normalizeMerchantScreenId(target.dataset.go);
    if (!nextId) {
      writeActionStatus(target, "商户端导航目标无效，已拦截跨端跳转");
      showToast("商户端导航目标无效");
      return;
    }
    if (nextId === activeId && refreshMerchantCurrentScreen(target, nextId)) return;
    setActive(nextId);
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    event.preventDefault();
    await handleAction(action);
  }
});

phoneEl.addEventListener("input", (event) => {
  const rescheduleNote = event.target.closest("[data-merchant-reschedule-note]");
  if (rescheduleNote) {
    merchantRescheduleState.note = rescheduleNote.value.slice(0, 200);
    const counter = rescheduleNote.closest(".reschedule-note-box")?.querySelector("em");
    if (counter) counter.textContent = `${merchantRescheduleState.note.length}/200`;
    return;
  }
  const serviceNote = event.target.closest("[data-merchant-service-note]");
  if (serviceNote) {
    localStorage.setItem("yunlv-merchant-service-note", serviceNote.value);
    return;
  }
  const ticketDescription = event.target.closest("[data-ticket-description]");
  if (ticketDescription) {
    const counter = phoneEl.querySelector("[data-ticket-description-count]");
    if (counter) counter.textContent = `${ticketDescription.value.length}/300`;
    return;
  }
  const merchantProfileField = event.target.closest("[data-merchant-profile-field]");
  if (merchantProfileField) {
    const field = merchantProfileField.dataset.merchantProfileField;
    merchantProfileEditState.fields[field] = merchantProfileField.value;
    merchantProfileEditState.dirty = true;
    const introCounter = merchantProfileField.closest(".profile-intro-row")?.querySelector("em");
    if (introCounter) {
      const max = Number(merchantProfileField.getAttribute("maxlength") || 200);
      introCounter.textContent = `${merchantProfileField.value.length}/${max}`;
    }
    return;
  }
  const invoiceApplyNote = event.target.closest("[data-merchant-invoice-apply-note]");
  if (invoiceApplyNote) {
    merchantRealPageState.invoiceApply.note = invoiceApplyNote.value.slice(0, 200);
    const counter = invoiceApplyNote.closest(".merchant-invoice-apply-note")?.querySelector("em");
    if (counter) counter.textContent = `${merchantRealPageState.invoiceApply.note.length}/200`;
    return;
  }
  const categoryInput = event.target.closest("[data-service-category-search]");
  if (categoryInput) {
    merchantServiceCategoryState.query = categoryInput.value;
    renderCurrent();
    const nextInput = phoneEl.querySelector("[data-service-category-search]");
    if (nextInput) {
      nextInput.focus();
      nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
    }
    return;
  }
  const input = event.target.closest("[data-service-search]");
  if (!input) return;
  merchantServiceState.query = input.value;
  renderCurrent();
  const nextInput = phoneEl.querySelector("[data-service-search]");
  if (nextInput) {
    nextInput.focus();
    nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
  }
});

searchEl.addEventListener("input", renderList);

$("#resetScreen").addEventListener("click", () => setActive("24", { record: false }));
window.addEventListener("hashchange", () => {
  const id = normalizeMerchantScreenId(location.hash);
  if (id) {
    setActive(id, { updateHash: true, record: false, replace: true });
    return;
  }
  if (location.hash) setActive("24", { updateHash: true, record: false, replace: true });
});

function hydratePassiveButtons(root) {
  if (!root) return;
  root.querySelectorAll("button").forEach((button) => {
    const handledDatasetKeys = Object.keys(button.dataset || {}).filter((key) => !["deepClickIndex", "renderClickIndex"].includes(key));
    if (handledDatasetKeys.length || button.type === "submit") return;
    const label = (button.getAttribute("aria-label") || button.textContent || inferPassiveAction(button)).trim().replace(/\s+/g, " ");
    button.dataset.action = label || inferPassiveAction(button);
  });
}

function inferPassiveAction(button) {
  const iconName = button.querySelector("[data-lucide]")?.getAttribute("data-lucide") || "";
  const iconActions = {
    search: "搜索",
    "sliders-horizontal": "筛选",
    bell: "查看消息",
    "message-square": "查看消息",
    phone: "联系客户",
    headphones: "联系客服",
    "chevron-left": "返回",
    "chevron-right": "查看详情",
    x: "关闭",
    plus: "添加",
    upload: "上传资料",
    camera: "上传照片",
    mic: "语音输入",
    send: "发送消息",
    "rotate-ccw": "刷新",
    "more-horizontal": "更多",
    "more-vertical": "更多",
    "list-filter": "筛选",
    settings: "设置",
    info: "查看说明",
  };
  if (iconActions[iconName]) return iconActions[iconName];
  if (button.classList.contains("back-button")) return "返回";
  if (button.classList.contains("icon-button")) return "查看详情";
  return "查看详情";
}

function hydrateInteractiveControls(root) {
  if (!root) return;
  const selectors = [".tabs button", ".login-tabs > *", ".withdraw-presets > *", ".merchant-week-days > *", ".merchant-type-pills > *"].join(",");
  root.querySelectorAll(selectors).forEach((control) => {
    if (control.tagName !== "BUTTON") return;
    control.type = "button";
    if (!control.dataset.go && !control.dataset.screen && !control.dataset.action && !control.dataset.serviceStatus && !control.dataset.serviceFilterToggle && !control.dataset.workbenchToolsToggle && !control.dataset.workbenchCategory && !control.dataset.merchantDataRange && !control.dataset.merchantFunctionRefresh && !control.dataset.serviceCategorySelect && !control.dataset.serviceCategoryRefresh && !control.dataset.serviceCategoryConfirm && !control.dataset.merchantOrderFilter) {
      const label = (control.textContent || "筛选").trim().replace(/\s+/g, " ");
      control.dataset.action = `选择${label}`;
    }
    control.setAttribute("aria-pressed", control.classList.contains("active") || control.classList.contains("is-active") ? "true" : "false");
  });
}

async function handleMerchantSecurityToggle(button) {
  const field = button.dataset.merchantSecurityToggle || "twoFactorEnabled";
  const current = Boolean(merchantRealPageState.security.data?.[field]);
  button.disabled = true;
  try {
    await ensureMerchantToken();
    merchantRealPageState.security.data = await merchantApiRequest("/api/merchant/security/toggle", {
      method: "POST",
      body: { merchantId: "merchant-001", field, enabled: !current },
    });
    merchantRealPageState.security.loaded = true;
    writeActionStatus(button, !current ? "双重验证已开启" : "双重验证已关闭");
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, merchantFriendlyText(error.message) || "账户安全更新失败");
    showToast(merchantFriendlyText(error.message) || "账户安全更新失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantSecurityLogoutDevices(button) {
  button.disabled = true;
  try {
    await ensureMerchantToken();
    merchantRealPageState.security.data = await merchantApiRequest("/api/merchant/security/logout-devices", {
      method: "POST",
      body: { merchantId: "merchant-001" },
    });
    merchantRealPageState.security.loaded = true;
    writeActionStatus(button, "其他登录设备已退出，设备列表已刷新");
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, error.message || "退出其他设备失败");
    showToast(error.message || "退出其他设备失败");
  } finally {
    button.disabled = false;
  }
}

async function updateMerchantSettings(button, patch, successText) {
  button.disabled = true;
  try {
    await ensureMerchantToken();
    merchantRealPageState.settings.data = await merchantApiRequest("/api/merchant/settings", {
      method: "PUT",
      body: { merchantId: "merchant-001", ...patch },
    });
    merchantRealPageState.settings.loaded = true;
    writeActionStatus(button, successText);
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, merchantFriendlyText(error.message) || "设置更新失败");
    showToast(merchantFriendlyText(error.message) || "设置更新失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantSettingsNotification(button) {
  const key = button.dataset.merchantSettingsNotification;
  const rows = merchantRealPageState.settings.data?.notificationRows || [];
  const row = rows.find((item) => item.key === key);
  const current = Boolean(row?.enabled ?? merchantRealPageState.settings.data?.notifications?.[key]);
  await updateMerchantSettings(button, { notifications: { [key]: !current } }, `${row?.label || "通知设置"}已${!current ? "开启" : "关闭"}并保存`);
}

async function handleMerchantSettingsExport(button) {
  button.disabled = true;
  try {
    await ensureMerchantToken();
    const payload = await merchantApiRequest("/api/merchant/settings/export", {
      method: "POST",
      body: { merchantId: "merchant-001" },
    });
    await downloadMerchantSettingsExport(payload.downloadUrl, payload.exportId);
    merchantRealPageState.settings.data = payload.settings;
    merchantRealPageState.settings.loaded = true;
    if (activeId === "63") {
      merchantRealPageState.privacy.data = await merchantApiRequest("/api/merchant/privacy?merchantId=merchant-001");
      merchantRealPageState.privacy.loaded = true;
    }
    writeActionStatus(button, `个人信息导出已生成并下载：${payload.exportId}`);
    showToast("个人信息导出已下载");
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, error.message || "个人信息导出失败");
    showToast(error.message || "个人信息导出失败");
  } finally {
    button.disabled = false;
  }
}

async function downloadMerchantSettingsExport(downloadUrl, exportId) {
  if (!downloadUrl) return null;
  const payload = await merchantApiRequest(`${downloadUrl}?merchantId=merchant-001`);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `yunlv-merchant-export-${exportId || payload.exportId || "data"}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return payload;
}

async function handleMerchantSettingsClearCache(button) {
  await updateMerchantSettings(button, { common: { cacheSizeMb: 0 } }, "本地缓存统计已清零");
}

async function handleMerchantSettingsFontSize(button) {
  const value = button.dataset.merchantSettingsFontSizeChoice || "标准";
  await updateMerchantSettings(button, { common: { fontSize: value } }, `字体大小已保存为：${value}`);
}

async function handleMerchantSettingsCommon(button) {
  const key = button.dataset.merchantSettingsCommonKey;
  const value = button.dataset.merchantSettingsCommonValue || "";
  if (!key) return;
  await updateMerchantSettings(button, { common: { [key]: value } }, `${button.textContent.trim().replace(/\s+/g, " ")}已保存`);
}

async function handleMerchantPrivacyToggle(button) {
  const key = button.dataset.merchantPrivacyToggle;
  const row = merchantRealPageState.privacy.data?.messageRows?.find((item) => item.key === key);
  const next = !Boolean(row?.enabled);
  button.disabled = true;
  try {
    await ensureMerchantToken();
    merchantRealPageState.privacy.data = await merchantApiRequest("/api/merchant/privacy", {
      method: "PUT",
      body: { merchantId: "merchant-001", privacy: { [key]: next } },
    });
    merchantRealPageState.privacy.loaded = true;
    merchantRealPageState.settings.loaded = false;
    writeActionStatus(button, `${row?.title || "隐私开关"}已${next ? "开启" : "关闭"}并保存`);
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, error.message || "隐私设置保存失败");
    showToast(error.message || "隐私设置保存失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantPrivacySave(button) {
  const messageRows = merchantRealPageState.privacy.data?.messageRows || [];
  const privacy = {};
  messageRows.forEach((row) => {
    privacy[row.key] = Boolean(row.enabled);
  });
  button.disabled = true;
  try {
    await ensureMerchantToken();
    merchantRealPageState.privacy.data = await merchantApiRequest("/api/merchant/privacy", {
      method: "PUT",
      body: { merchantId: "merchant-001", privacy },
    });
    merchantRealPageState.privacy.loaded = true;
    merchantRealPageState.settings.loaded = false;
    writeActionStatus(button, "隐私设置已保存");
    showToast("隐私设置已保存");
  } catch (error) {
    writeActionStatus(button, error.message || "隐私设置保存失败");
    showToast(error.message || "隐私设置保存失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantPermissionToggle(button) {
  const key = button.dataset.merchantPermissionToggle;
  button.disabled = true;
  try {
    await ensureMerchantToken();
    merchantRealPageState.permissions.data = await merchantApiRequest("/api/merchant/permissions", {
      method: "PUT",
      body: { merchantId: "merchant-001", key },
    });
    merchantRealPageState.permissions.loaded = true;
    merchantRealPageState.settings.loaded = false;
    const row = merchantRealPageState.permissions.data.permissionCards?.find((item) => item.key === key);
    writeActionStatus(button, `${row?.title || "权限"}已更新为：${row?.status || "已更新"}`);
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, error.message || "权限设置失败");
    showToast(error.message || "权限设置失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantSessionLogout(button) {
  button.disabled = true;
  try {
    await ensureMerchantToken();
    await merchantApiRequest("/api/merchant/session/logout", {
      method: "POST",
      body: { merchantId: "merchant-001" },
    });
    merchantFunctionOverviewState.token = "";
    writeActionStatus(button, "已退出当前商户会话");
    setActive("67");
  } catch (error) {
    writeActionStatus(button, error.message || "退出登录失败");
    showToast(error.message || "退出登录失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantSupportContact(button) {
  const type = button.dataset.merchantSupportContact || "online";
  const support = merchantRealPageState.support.data;
  const phone = support?.contacts?.phone || "400-888-1234";
  const email = button.dataset.merchantSupportEmail || support?.contacts?.email || "service@ylny.com";
  button.disabled = true;
  try {
    await ensureMerchantToken();
    await merchantApiRequest("/api/merchant/support/contact", {
      method: "POST",
      body: { merchantId: "merchant-001", type, route: activeId },
    });
    if (type === "email") {
      await navigator.clipboard?.writeText?.(email);
      writeActionStatus(button, `客服邮箱已复制：${email}`);
      showToast("客服邮箱已复制");
      return;
    }
    writeActionStatus(button, `正在打开系统拨号：${phone}`);
  } catch (error) {
    writeActionStatus(button, merchantFriendlyText(error.message) || "客服请求提交失败");
    if (type !== "phone") showToast(merchantFriendlyText(error.message) || "客服请求提交失败");
  } finally {
    button.disabled = false;
    if (type === "phone") window.location.href = merchantTelHref(phone);
  }
}

function handleMerchantInvoiceFilter(button) {
  const filter = button.dataset.merchantInvoiceFilter || "全部";
  merchantRealPageState.invoices.filter = filter;
  merchantRealPageState.invoices.loaded = false;
  loadMerchantRealPage("13", { force: true });
}

async function handleMerchantInvoicePreference(button) {
  const key = button.dataset.merchantInvoicePreferenceKey;
  const value = button.dataset.merchantInvoicePreferenceValue || "";
  if (!key) return;
  button.disabled = true;
  try {
    await ensureMerchantToken();
    merchantRealPageState.invoices.data = await merchantApiRequest("/api/merchant/invoices/preferences", {
      method: "PUT",
      body: { merchantId: "merchant-001", [key]: value, status: merchantRealPageState.invoices.filter || "全部" },
    });
    merchantRealPageState.invoices.loaded = true;
    writeActionStatus(button, `发票偏好已保存：${value}`);
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, error.message || "发票偏好保存失败");
    showToast(error.message || "发票偏好保存失败");
  } finally {
    button.disabled = false;
  }
}

function handleMerchantInvoiceApplyFocusOrders(button) {
  const list = phoneEl.querySelector("[data-merchant-invoice-apply-orders]");
  list?.scrollIntoView?.({ block: "start", behavior: "smooth" });
  writeActionStatus(button, "请选择需要开票的订单");
}

function handleMerchantInvoiceApplyOrder(button) {
  const orderId = button.dataset.merchantInvoiceApplyOrder;
  if (!orderId || button.disabled) return;
  const state = merchantRealPageState.invoiceApply;
  const selected = new Set(state.selectedOrderIds.length ? state.selectedOrderIds : (state.data?.selectedOrderIds || []));
  if (selected.has(orderId)) selected.delete(orderId);
  else selected.add(orderId);
  state.selectedOrderIds = [...selected];
  renderCurrent();
}

function handleMerchantInvoiceApplyDelivery(button) {
  merchantRealPageState.invoiceApply.delivery = button.dataset.merchantInvoiceApplyDelivery || "电子发票（邮箱）";
  renderCurrent();
}

function handleMerchantInvoiceApplyType(button) {
  merchantRealPageState.invoiceApply.invoiceType = button.dataset.merchantInvoiceApplyType || "增值税专用发票";
  renderCurrent();
}

async function handleMerchantInvoiceApplySubmit(button) {
  const state = merchantRealPageState.invoiceApply;
  const selectedOrderIds = state.selectedOrderIds.length ? state.selectedOrderIds : (state.data?.selectedOrderIds || []);
  if (!selectedOrderIds.length) {
    writeActionStatus(button, "请选择至少一笔可开票订单");
    showToast("请选择开票订单");
    return;
  }
  state.submitting = true;
  button.disabled = true;
  renderCurrent();
  try {
    await ensureMerchantToken();
    const payload = await merchantApiRequest("/api/merchant/invoices/apply", {
      method: "POST",
      body: {
        merchantId: "merchant-001",
        selectedOrderIds,
        invoiceType: state.invoiceType || state.data?.preference?.invoiceType || "增值税专用发票",
        delivery: state.delivery || state.data?.preference?.delivery || "电子发票（邮箱）",
        email: state.data?.preference?.email || "invoice@ylny.com",
        note: state.note,
      },
    });
    state.data = payload.apply;
    state.loaded = true;
    state.selectedOrderIds = [];
    state.note = "";
    state.submitting = false;
    merchantRealPageState.invoices.data = payload.invoices;
    merchantRealPageState.invoices.loaded = true;
    merchantRealPageState.invoices.filter = "全部";
    showToast(`开票申请已提交：${payload.record.id}`);
    setActive("13");
  } catch (error) {
    state.submitting = false;
    writeActionStatus(button, error.message || "开票申请提交失败");
    showToast(error.message || "开票申请提交失败");
    renderCurrent();
  } finally {
    button.disabled = false;
  }
}

async function handleAction(actionButton) {
  const actionName = actionButton.dataset.action || actionButton.textContent.trim() || "操作";
  if (actionName === "确认服务分类" && activeId === "31") {
    await handleMerchantServiceCategoryConfirm(actionButton);
    return;
  }
  if (isMerchantFileUploadAction(actionButton, actionName)) {
    openMerchantFilePicker(actionButton, actionName);
    return;
  }
  if (/全部已读|标记已读/.test(actionName)) {
    try {
      await markMerchantMessagesRead(actionButton, actionName);
    } catch (error) {
      writeActionStatus(actionButton, merchantFriendlyText(error.message) || "消息更新失败");
    }
    return;
  }
  if (/保存工单草稿|提交工单/.test(actionName) && phoneEl.querySelector("[data-ticket-description]")) {
    handleMerchantTicketSubmit(actionButton, actionName);
    return;
  }
  if (actionName === "拨打联系电话" && actionButton.closest(".ticket-related-card")) {
    startMerchantTicketPhoneCall(actionButton);
    return;
  }
  if (/^(站内消息|短信)回复$/.test(actionName)) {
    toggleMerchantTicketReplyChannel(actionButton, actionName.replace(/回复$/, ""));
    return;
  }
  if (/查看门店机构照片|门店机构照片|门店照片|机构照片/.test(actionName)) {
    setActive("56");
    showToast("已进入门店照片管理");
    return;
  }
  if (/^(保存|保存商户资料修改)$/.test(actionName) && phoneEl.querySelector("[data-merchant-profile-field]")) {
    await handleMerchantProfileSave(actionButton);
    return;
  }
  if (/^保存照片$/.test(actionName) && activeId === "56") {
    await handleMerchantPhotosSave(actionButton);
    return;
  }
  try {
    const businessHandled = await window.YunlvBusiness?.handleAction?.({
      role: "merchant",
      route: activeId,
      actionName,
      button: actionButton,
      showToast,
      writeActionStatus,
    });
    if (businessHandled) return;
  } catch (error) {
    writeActionStatus(actionButton, error.message);
    showToast(error.message);
    return;
  }
  await applyActionState(actionButton, actionName);
}

function isMerchantFileUploadAction(button, actionName) {
  const actionText = cleanActionLabel(actionName);
  const fullText = `${actionText} ${button.textContent || ""} ${button.className || ""}`.replace(/\s+/g, " ");
  if (/查看|预览|编辑|删除|移除|保存|取消|选择|设为|关闭|下一步|上一步|提交审核/.test(actionText) && !/上传|重传|重新上传|补充|截图|附件/.test(actionText)) {
    return false;
  }
  if (/上传|重传|重新上传|补充.*(照片|图片|凭证|附件|资质|证书|执照|证明|材料|文件)|截图|附件/.test(actionText)) {
    return true;
  }
  const uploadClass = /(^|\s)(upload|upload-tile|upload-proof|bank-upload-box|merchant-photo-upload|merchant-exception-upload|aftersale-upload|register-empty-upload|cert-update-dashed)(\s|$)/.test(button.className || "");
  const uploadArea = button.closest(".upload-grid, .ticket-upload-grid, .register-upload-columns, .cert-update-file-list, .merchant-photo-grid, .profile-photo-strip, .ticket-upload-card, .bank-upload-card");
  return Boolean((uploadClass || uploadArea) && /照片|图片|截图|凭证|附件|资质|证书|执照|证明|材料|文件|银行卡|许可证/.test(fullText));
}

function merchantUploadAccept(actionName) {
  if (/照片|图片|截图|相册|门店/.test(actionName) && !/资质|证书|执照|许可证|凭证|附件|文件|材料|银行卡/.test(actionName)) {
    return "image/*";
  }
  return "image/*,.pdf";
}

function openMerchantFilePicker(button, actionName) {
  const cleanName = cleanActionLabel(actionName);
  const scope = button.closest(".card, section, article, .sticky-action") || phoneEl.querySelector(".phone-content") || phoneEl;
  if (button._merchantUploadInput?.isConnected) button._merchantUploadInput.remove();
  const input = document.createElement("input");
  input.type = "file";
  input.accept = merchantUploadAccept(cleanName);
  input.multiple = /照片|图片|截图|凭证|附件|材料|门店|机构/.test(cleanName);
  if (/拍照|相机/.test(cleanName)) input.setAttribute("capture", "environment");
  input.dataset.merchantUploadInput = "";
  input.setAttribute("aria-hidden", "true");
  input.style.cssText = "position:absolute;left:-9999px;top:auto;width:1px;height:1px;opacity:0;pointer-events:none;";
  input.addEventListener("change", () => {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const summary = files.length === 1 ? files[0].name : `${files.length} 个文件`;
    button.classList.remove("is-uploading");
    button.classList.add("is-done");
    button.dataset.uploadState = "selected";
    button.dataset.state = `已选择${summary}`;
    writeActionStatus(button, `已选择${summary}，可继续保存或提交`);
  });
  scope.appendChild(input);
  button._merchantUploadInput = input;
  button.classList.add("is-uploading", "is-done");
  button.dataset.uploadState = "picker-opened";
  button.dataset.state = "文件选择器已唤起";
  writeActionStatus(button, `正在打开文件选择器：${cleanName}`);
  input.click();
  return input;
}

function toggleMerchantTicketReplyChannel(button, channel) {
  const group = button.closest(".ticket-row.reply") || button.parentElement;
  const nextActive = !button.classList.contains("active");
  button.classList.toggle("active", nextActive);
  button.classList.toggle("is-active", nextActive);
  button.setAttribute("aria-pressed", nextActive ? "true" : "false");

  const selected = [...(group?.querySelectorAll("button") || [])]
    .filter((item) => item.classList.contains("active") || item.classList.contains("is-active"))
    .map((item) => item.textContent.trim())
    .filter(Boolean);
  if (!selected.length) {
    button.classList.add("active", "is-active");
    button.setAttribute("aria-pressed", "true");
    selected.push(button.textContent.trim() || channel);
  }
  if (group) group.dataset.replyChannels = selected.join(",");
  writeActionStatus(group || button, `接收回复方式：${selected.join("、")}`);
}

function toggleMerchantTicketUrgencyPanel(button) {
  const panel = phoneEl.querySelector("[data-ticket-urgency-options]");
  if (!panel) return;
  const open = panel.hidden;
  panel.hidden = !open;
  button.setAttribute("aria-expanded", open ? "true" : "false");
  panel.dataset.open = open ? "true" : "false";
  writeActionStatus(button.closest(".ticket-related-card") || button, open ? "请选择工单紧急程度" : `紧急程度保持：${merchantTicketState.urgency}`);
}

function selectMerchantTicketUrgency(button) {
  const level = button.dataset.ticketUrgency || "普通";
  merchantTicketState.urgency = level;
  const panel = button.closest("[data-ticket-urgency-options]");
  panel?.querySelectorAll("[data-ticket-urgency]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const row = phoneEl.querySelector("[data-ticket-urgency-toggle]");
  const value = row?.querySelector("[data-ticket-urgency-value]");
  if (value) value.textContent = level;
  if (row) row.setAttribute("aria-expanded", "true");
  if (panel) panel.dataset.selectedUrgency = level;
  writeActionStatus(panel || button, `紧急程度已选择：${level}`);
}

function startMerchantTicketPhoneCall(button) {
  const phone = button.querySelector("strong")?.textContent?.trim() || "138 8888 8888";
  const callCount = Number(button.dataset.callCount || 0) + 1;
  button.classList.add("is-active");
  button.dataset.callState = "calling";
  button.dataset.callCount = String(callCount);
  button.setAttribute("aria-pressed", "true");
  const text = `正在第 ${callCount} 次呼叫联系人 ${phone}，通话记录将同步到当前工单`;
  writeActionStatus(button.closest(".ticket-related-card") || button, text);
  renderMerchantActionResult(button, "联系电话", text);
}

function markMerchantTicketDescriptionEditing(source) {
  const label = source.closest?.(".ticket-textarea") || phoneEl.querySelector(".ticket-textarea");
  const textarea = label?.querySelector("[data-ticket-description]");
  if (!label || !textarea) return;
  const editCount = Number(label.dataset.editCount || 0) + 1;
  label.dataset.editCount = String(editCount);
  label.classList.add("is-editing");
  textarea.dataset.editing = String(editCount);
  textarea.focus();
  const counter = label.querySelector("[data-ticket-description-count]");
  if (counter) counter.textContent = `${textarea.value.length}/300 · 编辑中`;
  writeActionStatus(label.closest(".ticket-desc-card") || label, "问题描述正在编辑，可补充订单号、操作步骤或截图说明");
}

function merchantLocalStateForBackendStatus(status) {
  if (status === "已报价") return { status: "已报价", state: "blue", action: "确认预约", actionTarget: "23", detailTarget: "23" };
  if (status === "待服务") return { status: "待服务", state: "blue", action: "开始服务", actionTarget: "18", detailTarget: "18" };
  if (status === "服务中") return { status: "服务中", state: "blue", action: "去服务", actionTarget: "18", detailTarget: "18" };
  if (status === "待确认") return { status: "待确认", state: "orange", action: "查看确认", actionTarget: "14", detailTarget: "14" };
  if (status === "已完成") return { status: "已完成", state: "green", action: "查看详情", actionTarget: "14", detailTarget: "14" };
  if (status === "已取消") return { status: "已取消", state: "red", action: "查看原因", actionTarget: "35", detailTarget: "35" };
  return { status: status || "待处理", state: "orange", action: "查看详情", actionTarget: "14", detailTarget: "14" };
}

async function findMerchantBackendOrder(action, preferredOrderId = "") {
  await ensureMerchantToken();
  const dashboard = await merchantApiRequest("/api/merchant/dashboard");
  const orders = dashboard.orders || [];
  if (preferredOrderId) {
    const matched = orders.find((order) => order.id === preferredOrderId || order.orderNo === preferredOrderId);
    return matched || { id: preferredOrderId, amount: merchantNumberFrom(orderItems.find((item) => item.id === preferredOrderId)?.amount) };
  }
  const candidates = {
    quote: ["待派单", "已派单"],
    confirm: ["已报价", "待派单", "已派单"],
    reject: ["已报价", "待派单", "已派单", "待服务"],
    reschedule: ["已报价", "待派单", "已派单", "待服务"],
    start: ["待服务"],
    complete: ["服务中"],
  }[action] || [];
  return orders.find((order) => candidates.includes(order.status)) || null;
}

async function syncMerchantOrderAction(action, button) {
  const reschedulePayload = action === "reschedule" ? merchantReschedulePayload(button) : null;
  const orderId = reschedulePayload?.orderId || button?.dataset.orderId || "";
  const backendOrder = await findMerchantBackendOrder(action, orderId);
  if (!backendOrder) {
    return null;
  }
  return merchantApiRequest(`/api/merchant/orders/${encodeURIComponent(backendOrder.id)}/${action}`, {
    method: "POST",
    body: {
      amount: action === "quote" ? 600 : backendOrder.amount,
      plan: "H5 试运营报价方案",
      reason: reschedulePayload?.reason || "商户端 H5 操作",
      time: reschedulePayload?.time,
      note: reschedulePayload?.note,
    },
  });
}

async function handleMerchantOrderAction(button) {
  const action = button.dataset.merchantOrderAction;
  const orderId = button.dataset.orderId;
  button.disabled = true;
  try {
    const backendOrder = await syncMerchantOrderAction(action, button);
    if (!backendOrder) {
      throw new Error("暂无可操作订单，请刷新订单列表后重试");
    }
    const sourceOrder = backendOrder.order || backendOrder;
    const localPatch = merchantLocalStateForBackendStatus(sourceOrder.status);
    if (Number.isFinite(Number(sourceOrder.amount))) localPatch.amount = `¥${Number(sourceOrder.amount).toFixed(2)}`;
    updateMerchantOrder(orderId || sourceOrder.id, localPatch);
    await refreshMerchantApiSnapshot();
    setActive(action === "start" ? "18" : action === "complete" ? "39" : "20");
  } catch (error) {
    writeActionStatus(button, merchantFriendlyText(error.message) || "订单操作失败");
    showToast(merchantFriendlyText(error.message) || "订单操作失败");
  } finally {
    button.disabled = false;
  }
}

async function refreshMerchantApiSnapshot() {
  await ensureMerchantToken();
  const [profile, dashboard, statsPayload, services, orders, reviews, messages] = await Promise.all([
    merchantApiRequest("/api/merchant/profile?merchantId=merchant-001"),
    merchantApiRequest("/api/merchant/dashboard?merchantId=merchant-001"),
    merchantApiRequest("/api/merchant/stats?merchantId=merchant-001"),
    merchantApiRequest("/api/merchant/services?merchantId=merchant-001"),
    merchantApiRequest("/api/merchant/orders?merchantId=merchant-001"),
    merchantApiRequest("/api/merchant/reviews?merchantId=merchant-001").catch(() => []),
    merchantApiRequest("/api/messages?role=merchant").catch(() => []),
  ]);
  applyMerchantApiData({ profile, dashboard, statsPayload, services, orders, reviews, messages });
  merchantApiHydrateState.lastAt = Date.now();
}

function merchantProfileSavePayload() {
  const fields = ensureMerchantProfileEditState();
  return {
    merchantId: currentMerchantProfile().id || "merchant-001",
    name: String(fields.name || "").trim(),
    type: String(fields.type || "").trim(),
    contact: String(fields.contact || "").trim(),
    phone: String(fields.phone || "").trim(),
    businessHours: String(fields.businessHours || "").trim(),
    serviceCity: String(fields.serviceCity || "").trim(),
    address: String(fields.address || "").trim(),
    intro: String(fields.intro || "").trim(),
  };
}

async function handleMerchantProfileSave(button) {
  const payload = merchantProfileSavePayload();
  if (!payload.name || !payload.contact || !payload.phone || !payload.address) {
    const message = "请补全机构名称、联系人、联系电话和门店地址";
    writeActionStatus(button, message);
    showToast(message);
    return;
  }
  button.disabled = true;
  merchantProfileEditState.saving = true;
  try {
    await ensureMerchantToken();
    const nextProfile = await merchantApiRequest("/api/merchant/profile", {
      method: "PUT",
      body: payload,
    });
    merchantWorkbenchState.profile = nextProfile;
    merchantWorkbenchState.dashboard = {
      ...(merchantWorkbenchState.dashboard || {}),
      merchant: { ...(merchantWorkbenchState.dashboard?.merchant || {}), ...nextProfile },
    };
    merchantProfileEditState.dirty = false;
    merchantProfileEditState.sourceKey = merchantProfileSourceKey(nextProfile);
    merchantProfileEditState.fields = merchantProfileDefaults(nextProfile);
    merchantApiHydrateState.signature = "";
    await refreshMerchantApiSnapshot();
    renderCurrent();
    showToast("商户资料已保存");
  } catch (error) {
    writeActionStatus(button, error.message || "商户资料保存失败");
    showToast(error.message || "商户资料保存失败");
  } finally {
    merchantProfileEditState.saving = false;
    button.disabled = false;
  }
}

function applyMerchantPhotoPayload(payload = {}) {
  const photos = Array.isArray(payload.photos) ? payload.photos : merchantStorePhotoList();
  const profile = { ...currentMerchantProfile(), storePhotos: photos, storePhotoCount: photos.length, coverPhoto: payload.coverPhoto || photos.find((item) => item.isCover) || photos[0] || null };
  merchantWorkbenchState.profile = profile;
  merchantWorkbenchState.dashboard = {
    ...(merchantWorkbenchState.dashboard || {}),
    merchant: { ...(merchantWorkbenchState.dashboard?.merchant || {}), ...profile },
  };
  merchantApiHydrateState.signature = "";
}

async function handleMerchantPhotoDelete(button) {
  const photoId = button.dataset.merchantPhotoDelete;
  if (!photoId) return;
  const label = cleanActionLabel(button.getAttribute("aria-label") || button.dataset.action || "删除门店照片").replace(/^删除/, "");
  button.disabled = true;
  try {
    await ensureMerchantToken();
    const payload = await merchantApiRequest(`/api/merchant/photos/${encodeURIComponent(photoId)}?merchantId=${encodeURIComponent(currentMerchantProfile().id || "merchant-001")}`, {
      method: "DELETE",
    });
    applyMerchantPhotoPayload(payload);
    renderCurrent();
    showToast(`${label}已删除`);
  } catch (error) {
    writeActionStatus(button, error.message || "门店照片删除失败");
    showToast(error.message || "门店照片删除失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantPhotosSave(button) {
  button.disabled = true;
  try {
    await ensureMerchantToken();
    const payload = await merchantApiRequest("/api/merchant/photos", {
      method: "PUT",
      body: {
        merchantId: currentMerchantProfile().id || "merchant-001",
        photos: merchantStorePhotoList(),
      },
    });
    applyMerchantPhotoPayload(payload);
    renderCurrent();
    showToast(`门店照片已保存，共 ${payload.count} 张`);
  } catch (error) {
    writeActionStatus(button, error.message || "门店照片保存失败");
    showToast(error.message || "门店照片保存失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantServiceStatus(button) {
  const service = selectMerchantService(button.dataset.merchantServiceStatus);
  if (!service) return;
  button.disabled = true;
  try {
    await ensureMerchantToken();
    await merchantApiRequest(`/api/merchant/services/${encodeURIComponent(service.id)}/status`, {
      method: "POST",
      body: { status: merchantServiceNextStatus(service) },
    });
    await refreshMerchantApiSnapshot();
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, error.message || "服务状态同步失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantServiceCopy(button) {
  const service = selectMerchantService(button.dataset.merchantServiceCopy);
  if (!service) return;
  button.disabled = true;
  try {
    await ensureMerchantToken();
    const created = await merchantApiRequest("/api/merchant/services", {
      method: "POST",
      body: {
        providerId: "merchant-001",
        title: `${service.title} 副本`,
        category: service.tag,
        price: service.priceValue,
        unit: service.unit,
        status: "待审核",
        description: service.description,
      },
    });
    merchantServiceState.selectedId = created.id;
    merchantServiceState.status = "全部";
    await refreshMerchantApiSnapshot();
    renderCurrent();
  } catch (error) {
    writeActionStatus(button, error.message || "服务复制失败");
  } finally {
    button.disabled = false;
  }
}

async function handleMerchantServiceCategoryConfirm(button) {
  const targetId = button?.dataset?.serviceCategoryConfirm || merchantServiceCategoryState.selectedId;
  const selected = merchantServiceCategoryState.data?.categories?.find((item) => item.id === targetId) || selectedMerchantServiceCategory();
  if (!selected) {
    writeActionStatus(button, "请选择服务分类");
    showToast("请选择服务分类");
    return;
  }
  merchantServiceCategoryState.saving = true;
  if (button) button.disabled = true;
  if (activeId === "31") renderCurrent();
  try {
    await ensureMerchantToken();
    const payload = await merchantApiRequest("/api/merchant/service-categories/selection", {
      method: "POST",
      body: {
        merchantId: "merchant-001",
        categoryId: selected.id,
      },
    });
    merchantServiceCategoryState.selection = payload.draft;
    merchantServiceCategoryState.selectedId = payload.draft?.categoryId || selected.id;
    merchantServiceCategoryState.loaded = false;
    merchantServiceCategoryState.data = merchantServiceCategoryState.data
      ? { ...merchantServiceCategoryState.data, selection: payload.draft }
      : merchantServiceCategoryState.data;
    writeActionStatus(button, `已保存服务分类：${payload.draft?.category || selected.category}`);
    showToast(`已保存服务分类：${payload.draft?.category || selected.category}`);
    setActive("22");
  } catch (error) {
    writeActionStatus(button, error.message || "服务分类保存失败");
    showToast(error.message || "服务分类保存失败");
  } finally {
    merchantServiceCategoryState.saving = false;
    if (button) button.disabled = false;
    if (activeId === "31") renderCurrent();
  }
}

async function handleMerchantServiceSubmit(button) {
  const service = selectMerchantService(button.dataset.merchantServiceSubmit);
  button.disabled = true;
  try {
    await ensureMerchantToken();
    if (service) {
      await merchantApiRequest(`/api/merchant/services/${encodeURIComponent(service.id)}/status`, {
        method: "POST",
        body: { status: "待审核" },
      });
      merchantServiceState.status = "全部";
      await refreshMerchantApiSnapshot();
      setActive("19");
      return;
    }
    const serviceDraft = currentMerchantServiceCategoryDraft();
    const created = await merchantApiRequest("/api/merchant/services", {
      method: "POST",
      body: {
        providerId: "merchant-001",
        title: serviceDraft?.serviceTitle || "新增商户服务",
        category: serviceDraft?.category || "康养护理",
        price: Number(serviceDraft?.price || 199),
        unit: serviceDraft?.unit || "次",
        status: "待审核",
        description: serviceDraft?.description || "商户端提交的新服务，等待后台审核。",
      },
    });
    merchantServiceState.selectedId = created.id;
    merchantServiceState.status = "全部";
    await refreshMerchantApiSnapshot();
    setActive("19");
  } catch (error) {
    writeActionStatus(button, error.message || "服务提交失败");
  } finally {
    button.disabled = false;
  }
}

async function applyActionState(button, actionName) {
  const label = (button.textContent || actionName).trim().replace(/\s+/g, " ") || actionName;
  if (/提现\d+|全部提现/.test(actionName)) {
    return updateMerchantWithdrawAmount(button, actionName);
  }
  if (/在线接单/.test(actionName)) {
    return await toggleMerchantOnlineAccepting(button);
  }
  const choiceFeedback = activateChoice(button, label);
  if (choiceFeedback) return choiceFeedback;
  const switchFeedback = toggleSwitch(button, actionName);
  if (switchFeedback) return switchFeedback;

  if (/发送消息|发送内容|回复/.test(actionName)) {
    const input = button.closest(".chat-input, .merchant-chat-input, .customer-service-input, .field")?.querySelector("input, textarea");
    const text = String(input?.value || "").trim() || "您好，您的服务需求我已收到，会尽快处理。";
    const supportResult = phoneEl.querySelector(".support-chat-list") ? appendMerchantSupportMessage(text) : "";
    const thread = supportResult ? null : phoneEl.querySelector(".chat-thread, .message-detail-thread, .merchant-message-thread, .guide-chat-thread");
    if (thread) {
      thread.insertAdjacentHTML("beforeend", `<div class="merchant-chat-row me"><p>${escapeHtml(text)}</p><small>${new Date().toTimeString().slice(0, 5)} 已发送</small></div>`);
    }
    if (input) input.value = "";
    const result = supportResult || (phoneEl.querySelector(".support-chat-list") ? "" : "消息已发送");
    if (result) writeActionStatus(button, result);
    return result;
  }

  if (/^(增加|减少)(上门次数|单次时长|基础服务费|耗材费|交通补贴|报价金额)/.test(actionName)) {
    const stepper = button.closest(".quote-edit-stepper, .appointment-fee-row, .form-row");
    const valueNode = stepper?.querySelector("strong, input");
    const raw = valueNode?.tagName === "INPUT" ? valueNode.value : valueNode?.textContent;
    const current = Number(String(raw || "0").replace(/[^\d.]/g, "")) || 0;
    const delta = actionName.startsWith("增加") ? 1 : -1;
    const next = Math.max(0, current + delta);
    if (valueNode) {
      if (valueNode.tagName === "INPUT") valueNode.value = String(next);
      else valueNode.textContent = String(next);
    }
    refreshMerchantQuoteTotal();
    return "报价金额已重新计算";
  }

  if (/获取.*验证码/.test(actionName)) {
    button.disabled = true;
    button.textContent = "60秒后重发";
    return "验证码已发送";
  }

  if (/上传|添加照片|添加介绍图片|添加标签|添加时段|添加特殊日期|添加节假日/.test(actionName)) {
    const text = /时段|特殊日期|节假日/.test(actionName) ? "时间规则已添加" : /标签/.test(actionName) ? "服务标签已添加" : "资料已加入提交清单";
    return text;
  }

  if (/保存工单草稿|提交工单/.test(actionName) && phoneEl.querySelector("[data-ticket-description]")) {
    return handleMerchantTicketSubmit(button, actionName);
  }

  if (/选择|切换|同意|确认账户|站内消息回复|短信回复|已解决|平台精选|适老推荐/.test(actionName)) {
    button.classList.toggle("active");
    button.classList.toggle("is-active", button.classList.contains("active"));
    button.setAttribute("aria-pressed", button.classList.contains("active") || button.classList.contains("is-active") ? "true" : "false");
    const text = button.classList.contains("active") || button.classList.contains("is-active") ? completedActionText(actionName, label) : `已取消：${label}`;
    return text;
  }

  if (/删除|移除|关闭/.test(actionName)) {
    const target = button.closest("figure, .merchant-photo-tip, .payment-password-tip, .permission-tip, article, .card");
    if (target && target !== phoneEl) {
      target.classList.add("is-dismissed");
      target.hidden = true;
    } else {
      button.hidden = true;
    }
    return completedActionText(actionName, label);
  }

  if (/保存|提交|确认|完成|下载|导出|搜索|筛选|查看|编辑|设置|修改|拨打|联系|提现|开票|处理|暂存|下架|复制|发送|重置|退出|注销|开启|显示|隐藏|减少|增加/.test(actionName)) {
    const text = completedActionText(actionName, label);
    return text;
  }

  const text = genericActionFeedback(actionName, label);
  return text;
}

function refreshMerchantQuoteTotal() {
  const screen = phoneEl.querySelector(".quote-edit-screen");
  if (!screen) return;
  const count = Number(screen.querySelector(".quote-edit-stepper:nth-of-type(1) strong")?.textContent || 5) || 5;
  const hours = Number(screen.querySelector(".quote-edit-stepper:nth-of-type(2) strong")?.textContent || 2.5) || 2.5;
  const total = Math.max(0, Math.round(count * hours * 48));
  const totalNode = screen.querySelector(".quote-total strong");
  if (totalNode) totalNode.textContent = `¥${total.toFixed(2)}`;
}

function formatMerchantCurrency(amount) {
  return `¥ ${Number(String(amount).replace(/,/g, "") || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function updateMerchantWithdrawAmount(button, actionName) {
  const amount = actionName.includes("全部") ? "18,560.00" : (actionName.match(/\d+/)?.[0] || "3000");
  const amountText = formatMerchantCurrency(amount);
  phoneEl.querySelectorAll(".withdraw-presets button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const input = phoneEl.querySelector(".withdraw-amount-input");
  if (input) input.childNodes[0].textContent = amountText;
  const feeRows = [...phoneEl.querySelectorAll(".merchant-withdraw-fee > div")];
  feeRows.forEach((row) => {
    const label = row.querySelector("span")?.textContent || "";
    const value = row.querySelector("strong");
    if (value && (/提现金额/.test(label) || row.classList.contains("total"))) value.textContent = amountText;
  });
  return `提现金额已选择：${amountText}`;
}

function handleMerchantTicketSubmit(button, actionName) {
  const textarea = phoneEl.querySelector("[data-ticket-description]");
  const description = String(textarea?.value || "").trim();
  const actionCount = Number(button.dataset.ticketActionCount || 0) + 1;
  button.dataset.ticketActionCount = String(actionCount);
  const type = phoneEl.querySelector(".ticket-type-grid button.active span")?.textContent?.trim() || merchantTicketState.type || "订单问题";
  if (!description && /提交/.test(actionName)) {
    const text = "请先填写问题描述";
    button.classList.add("has-error");
    button.dataset.ticketValidation = `missing-description-${actionCount}`;
    textarea?.focus();
    writeActionStatus(button.closest(".ticket-submit-actions") || button, text);
    return text;
  }
  const prefix = /草稿/.test(actionName) ? "工单草稿已保存" : "工单已提交";
  const text = description
    ? `${prefix}：${type}，描述 ${description.length}/300 字`
    : `${prefix}：${type}，可稍后补充问题描述`;
  button.classList.add("is-done");
  button.classList.remove("has-error");
  button.dataset.ticketSubmitState = `${/草稿/.test(actionName) ? "draft" : "submitted"}-${actionCount}`;
  writeActionStatus(button.closest(".ticket-submit-actions") || button, text);
  renderMerchantActionResult(button, actionName, text);
  return text;
}

function activateChoice(button, label) {
  const group = button.closest(".tabs, .login-tabs, .withdraw-presets, .merchant-week-days, .merchant-type-pills, .cert-type-grid, .cert-update-reason-grid, .register-choice-grid, .merchant-service-type-grid, .refuse-reason-grid, .reschedule-reason-grid, .reschedule-date-grid, .reschedule-slot-grid, .staff-card-list, .merchant-font-segments, .merchant-invoice-type, .ticket-type-grid, .aftersale-demand-grid, .aftersale-plan-list, .review-tabs, .merchant-exception-type-grid, .merchant-exception-method, .selector-grid");
  if (!group) return false;
  const controls = [...group.querySelectorAll("button, [role='button']")].filter((item) => !item.disabled);
  if (controls.length < 2) return false;
  controls.forEach((item) => {
    item.classList.remove("active", "is-active");
    item.setAttribute("aria-pressed", "false");
  });
  button.classList.add("active", "is-active");
  button.setAttribute("aria-pressed", "true");
  return true;
}

async function toggleMerchantOnlineAccepting(button) {
  const profile = currentMerchantProfile();
  const nextOnline = !(profile.onlineAccepting ?? merchantOnlineAccepting);
  button.disabled = true;
  try {
    await ensureMerchantToken();
    const nextProfile = await merchantApiRequest("/api/merchant/profile/online", {
      method: "POST",
      body: { merchantId: profile.id || "merchant-001", onlineAccepting: nextOnline },
    });
    merchantWorkbenchState.profile = nextProfile;
    merchantWorkbenchState.dashboard = {
      ...(merchantWorkbenchState.dashboard || {}),
      merchant: { ...(merchantWorkbenchState.dashboard?.merchant || {}), ...nextProfile },
    };
    merchantOnlineAccepting = Boolean(nextProfile.onlineAccepting);
    merchantApiHydrateState.signature = "";
    merchantApiHydrateState.lastAt = 0;
    renderCurrent();
    return merchantOnlineAccepting ? "在线接单已开启" : "在线接单已关闭";
  } catch (error) {
    writeActionStatus(button, error.message || "在线接单状态同步失败");
    return error.message || "在线接单状态同步失败";
  } finally {
    button.disabled = false;
  }
}

function toggleSwitch(button, actionName) {
  const passwordInput = button.closest(".withdraw-password, .payment-password-row, .password-row, .login-input, .account-form-row")?.querySelector("input[type='password'], input[type='text']");
  if (/显示|隐藏/.test(actionName) && passwordInput) {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    return true;
  }
  const switchEl = button.classList.contains("switch") || button.classList.contains("device-switch")
    ? button
    : button.querySelector(".switch, .device-switch");
  if (!switchEl && !/开启|关闭|显示|隐藏|开关/.test(actionName)) return false;
  const target = switchEl || button;
  target.classList.toggle("on");
  target.setAttribute("aria-pressed", target.classList.contains("on") ? "true" : "false");
  return true;
}

function completedActionText(actionName, visibleLabel = "") {
  const label = cleanActionLabel(visibleLabel || actionName);
  if (/保存|暂存/.test(actionName)) return "已保存";
  if (/提交|上架|申请/.test(actionName)) return /开票/.test(actionName) ? "开票申请已提交" : "已提交";
  if (/确认|完成|已解决/.test(actionName)) return "已确认";
  if (/下载|导出/.test(actionName)) return "文件已生成，可在下载记录中查看";
  if (/搜索/.test(actionName)) return "搜索条件已应用，列表按关键词展示";
  if (/筛选/.test(actionName)) return "筛选条件已应用，当前列表按条件展示";
  if (/选择|切换/.test(actionName)) return `当前选择：${label.replace(/^(选择|切换)/, "")}`;
  if (/查看/.test(actionName)) return `已进入${label.replace(/^查看/, "")}`;
  if (/编辑|设置|修改/.test(actionName)) return `${label.replace(/^(编辑|设置|修改)/, "")}已进入编辑`;
  if (/拨打/.test(actionName)) return "正在呼叫联系人";
  if (/联系/.test(actionName)) return /客服/.test(actionName) ? "正在连接平台客服" : "已进入客户联系流程";
  if (/提现/.test(actionName)) return "提现申请已提交";
  if (/开票/.test(actionName)) return "开票资料已保存到当前表单";
  if (/发送/.test(actionName)) return "已发送";
  if (/减少|增加/.test(actionName)) return `${label}已调整`;
  if (/重置/.test(actionName)) return "已重置";
  if (/下架/.test(actionName)) return "服务已下架";
  if (/复制/.test(actionName)) return "服务副本已生成";
  if (/退出|注销/.test(actionName)) return "账号安全操作已确认";
  if (/删除|移除|清空/.test(actionName)) return `${label}已从当前列表移除`;
  if (/关闭|取消/.test(actionName)) return `${label}已关闭，订单状态保持可追踪`;
  return `${label}已同步到当前经营记录`;
}

function genericActionFeedback(actionName, visibleLabel = "") {
  const label = cleanActionLabel(visibleLabel || actionName);
  if (/导航/.test(actionName)) return "路线已生成";
  if (/开放|营业|可预约/.test(actionName)) return `${label}已生效`;
  if (/更多/.test(actionName)) return `${label}经营列表已加载`;
  if (/刷新/.test(actionName)) return "经营数据已重新加载";
  return `${label}已同步到当前经营记录`;
}

function cleanActionLabel(text) {
  return String(text || "操作").trim().replace(/\s+/g, " ").replace(/[>›]+/g, "").replace(/^当前选择：/, "") || "操作";
}

function shouldSuppressTransientPrompt(text) {
  const value = String(text || "");
  return !value
    || /状态.+已(更新|切换)/.test(value)
    || /开票状态.+同步/.test(value)
    || /账号状态.+同步/.test(value)
    || /操作.+成功/.test(value)
    || /后续.+接入/.test(value)
    || /等待.+真实/.test(value)
    || /已.+打开/.test(value)
    || /^已.+切换为/.test(value)
    || /^当前(选择|筛选|模式|路线)：/.test(value)
    || /^(已开启|已关闭|已保存|已提交|已确认|已发送|已取消|已重置|服务已下架|服务副本已生成|文件已生成，可在下载记录中查看)$/.test(value)
    || /已同步到当前经营记录|筛选条件已应用|经营数据已重新加载/.test(value);
}

function writeActionStatus(source, text) {
  if (shouldSuppressTransientPrompt(text)) return;
  let scope = source.closest?.(".card, .phone-content, .sticky-action, .tabs, section, article") || phoneEl;
  if (!scope || scope === phoneEl) scope = phoneEl.querySelector(".phone-content") || phoneEl;
  let status = scope.querySelector("[data-action-status]");
  if (!status) {
    status = document.createElement("p");
    status.className = "action-status";
    status.dataset.actionStatus = "";
    scope.appendChild(status);
  }
  status.textContent = text;
}

function merchantActionResultKey(actionName) {
  return `merchant-action-result-${String(actionName || "operation").replace(/[^\w\u4e00-\u9fa5-]+/g, "-").slice(0, 36)}`;
}

function renderMerchantActionResult(button, actionName, text) {
  const key = merchantActionResultKey(actionName);
  phoneEl.querySelector(`[data-merchant-action-result="${key}"]`)?.remove();
  const panel = document.createElement("section");
  panel.className = "card merchant-action-result";
  panel.dataset.merchantActionResult = key;
  panel.dataset.action = actionName || "";
  panel.innerHTML = `
    <h2>${escapeHtml(cleanActionLabel(actionName))}</h2>
    <div class="merchant-mini-list">
      <p>${icon("check-circle", 16)}${escapeHtml(text || completedActionText(actionName))}</p>
      <p>${icon("clock-3", 16)}当前商户页面记录已写入，可继续查看订单或工单。</p>
    </div>
    <div class="quick-actions">
      <button data-open="20" type="button">${icon("clipboard-list", 16)}查看订单</button>
      <button data-open="50" type="button">${icon("message-square", 16)}查看工单记录</button>
    </div>
  `;
  const anchor = button.closest?.(".card, section, article, .sticky-action") || phoneEl.querySelector(".phone-content") || phoneEl;
  if (anchor && anchor !== phoneEl) anchor.after(panel);
  else phoneEl.querySelector(".phone-content")?.appendChild(panel);
  if (window.lucide) window.lucide.createIcons();
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  return panel;
}

function showToast(text) {
  const toast = phoneEl.querySelector("[data-toast]");
  if (toast) {
    toast.classList.remove("show");
    toast.textContent = "";
  }
  window.clearTimeout(toastTimer);
  const message = String(text || "").trim();
  if (!message) return;
  const active = document.activeElement?.closest?.("button, a, input, select, textarea, [role='button']");
  const anchor = active || phoneEl.querySelector(".phone-content .card:last-of-type, .phone-content section:last-of-type, .phone-content") || phoneEl;
  writeActionStatus(anchor, message);
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }
}

function actionText(action) {
  const map = {
    "提交审核": "资料已提交",
    "保存并上架": "服务已保存并上架",
    "已解决": "处理结果已同步",
    "联系客户": "已进入客户联系流程",
    "暂不处理": "已保留当前订单状态",
  };
  return map[action] || action;
}

renderList();
renderCurrent();
