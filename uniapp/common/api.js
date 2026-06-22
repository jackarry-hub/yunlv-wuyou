import { appState, currentMessageRole, setSession } from "../store/app-store";
import { messageRoleOf, normalizeRole } from "./roles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function resolveUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL}${path}`;
}

function request(path, options = {}) {
  const token = options.token || appState.session?.token;
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.header || {}),
  };
  if (options.auth !== false && token) header.Authorization = `Bearer ${token}`;

  return new Promise((resolve, reject) => {
    uni.request({
      url: resolveUrl(path),
      method: options.method || "GET",
      data: options.data,
      header,
      timeout: options.timeout || 15000,
      success(response) {
        const payload = response.data || {};
        if (response.statusCode >= 200 && response.statusCode < 300 && payload.success) {
          resolve(payload.data);
          return;
        }
        reject(new Error(payload.error?.message || `接口调用失败：${path}`));
      },
      fail(error) {
        reject(new Error(error.errMsg || `网络请求失败：${path}`));
      },
    });
  });
}

function withQuery(path, params = {}) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) return path;
  const query = entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
  return `${path}?${query}`;
}

async function login(role = "elder") {
  const normalized = normalizeRole(role);
  const session = await request("/api/auth/login", {
    method: "POST",
    data: { role: normalized },
    auth: false,
  });
  setSession(session);
  return session;
}

async function ensureAuth(role = appState.role) {
  const normalized = normalizeRole(role);
  if (appState.session?.token && appState.session?.role === normalized) return appState.session;
  return login(normalized);
}

function roleAware(path, options = {}, role = appState.role) {
  return ensureAuth(role).then(() => request(path, options));
}

export const api = {
  request,
  login,
  ensureAuth,
  session: () => appState.session,
  messageRole: () => currentMessageRole(),

  health: () => request("/api/health", { auth: false }),
  userHome: () => roleAware("/api/user/home", {}, "elder"),
  userProfile: () => roleAware("/api/user/profile", {}, "elder"),
  updateUserProfile: (body) => roleAware("/api/user/profile", { method: "PUT", data: body }, "elder"),
  updateElderProfile: (body) => roleAware("/api/elder/profile", { method: "PUT", data: body }, "elder"),
  activities: (params = {}) => roleAware(withQuery("/api/activities", params), {}, "elder"),
  activityMap: (params = {}) => roleAware(withQuery("/api/activities/map", params), {}, "elder"),
  activityDetail: (id) => roleAware(`/api/activities/${id}`, {}, "elder"),
  joinActivity: (id, body = {}) => roleAware(`/api/activities/${id}/join`, { method: "POST", data: body }, "elder"),
  aiQuickQuestions: () => roleAware("/api/ai/quick-questions", {}, "elder"),
  aiHistory: () => roleAware("/api/ai/history", {}, "elder"),
  askAi: (question) => roleAware("/api/ai/chat", { method: "POST", data: { question } }, "elder"),
  transcribeVoice: (body = {}) => roleAware("/api/ai/voice/transcribe", { method: "POST", data: body }, "elder"),
  aiRecommendations: (params = {}) => roleAware(withQuery("/api/ai/recommendations", params), {}, "elder"),
  triggerSos: (body) => roleAware("/api/alerts/sos", { method: "POST", data: body }, "elder"),
  quickHelp: (body) => roleAware("/api/alerts/quick-help", { method: "POST", data: body }, "elder"),
  familyContacts: () => roleAware("/api/family-contacts", {}, "elder"),
  healthOverview: () => roleAware("/api/health/overview", {}, "elder"),
  services: (params = {}) => roleAware(withQuery("/api/services", params), {}, "elder"),
  createOrder: (body) => roleAware("/api/orders", { method: "POST", data: body }, "elder"),
  shopCheckout: (body = {}) =>
    roleAware(
      "/api/orders",
      {
        method: "POST",
        data: {
          ...body,
          serviceType: body.serviceType || "优选商城商品结算",
          providerType: "merchant",
          source: body.source || "用户端优选商城",
          items: Array.isArray(body.items) ? body.items : [],
        },
      },
      "elder",
    ),
  orders: (params = {}) => roleAware(withQuery("/api/orders", params), {}, "elder"),
  confirmOrder: (id, body = {}) => roleAware(`/api/orders/${id}/confirm`, { method: "POST", data: body }, "elder"),
  cancelOrder: (id, body = {}) => roleAware(`/api/orders/${id}/cancel`, { method: "POST", data: body }, "elder"),
  messages: (role) => roleAware(withQuery("/api/messages", { role: role || messageRoleOf(appState.role) }), {}, appState.role),
  markAllMessagesRead: (role) => roleAware("/api/messages/read-all", { method: "POST", data: { role: role || currentMessageRole() } }, appState.role),
  recordUiAction: (body) => roleAware("/api/ui/actions", { method: "POST", data: body }, appState.role),

  guideDashboard: (params = {}) => roleAware(withQuery("/api/guide/dashboard", params), {}, "guide"),
  guideIncome: () => roleAware("/api/guide/income", {}, "guide"),
  guideOrderStatusFlow: () => roleAware("/api/guide/order-status-flow", {}, "guide"),
  claimGuideTask: (body = {}) => roleAware("/api/guide/tasks/claim-next", { method: "POST", data: body }, "guide"),
  guideTaskDecision: (id, action, body = {}) => roleAware(`/api/guide/tasks/${id}/${action}`, { method: "POST", data: body }, "guide"),
  taskAction: (id, action, body = {}) => roleAware(`/api/tasks/${id}/${action}`, { method: "POST", data: body }, "guide"),
  reportGuideException: (body) => roleAware("/api/guide/exception", { method: "POST", data: body }, "guide"),
  setGuideOnline: (body) => roleAware("/api/guide/online", { method: "POST", data: body }, "guide"),

  merchantDashboard: () => roleAware("/api/merchant/dashboard", {}, "merchant"),
  merchantServices: (params = {}) => roleAware(withQuery("/api/merchant/services", params), {}, "merchant"),
  createMerchantService: (body) => roleAware("/api/merchant/services", { method: "POST", data: body }, "merchant"),
  setMerchantServiceStatus: (id, body) => roleAware(`/api/merchant/services/${id}/status`, { method: "POST", data: body }, "merchant"),
  merchantOrders: (params = {}) => roleAware(withQuery("/api/merchant/orders", params), {}, "merchant"),
  merchantOrderAction: (id, action, body = {}) => roleAware(`/api/merchant/orders/${id}/${action}`, { method: "POST", data: body }, "merchant"),
  merchantReviews: (params = {}) => roleAware(withQuery("/api/merchant/reviews", params), {}, "merchant"),
  reportMerchantException: (body) => roleAware("/api/merchant/exception", { method: "POST", data: body }, "merchant"),
};

export function toastSuccess(title) {
  uni.showToast({ title, icon: "success" });
}

export function toastText(title) {
  uni.showToast({ title, icon: "none" });
}
