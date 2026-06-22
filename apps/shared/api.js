const jsonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

let session = null;
const defaultRemoteApiBase = "https://yunlv-wuyou-mvp.onrender.com";

function apiBase() {
  const explicit = globalThis.YUNLV_API_BASE || globalThis.localStorage?.getItem?.("YUNLV_API_BASE") || "";
  if (explicit) return explicit.replace(/\/$/, "");
  return globalThis.location?.hostname?.endsWith("github.io") ? defaultRemoteApiBase : "";
}

function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const base = apiBase();
  return base ? `${base}${path.startsWith("/") ? path : `/${path}`}` : path;
}

function withQuery(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}

export async function request(path, options = {}) {
  const headers = { ...jsonHeaders, ...(options.headers || {}) };
  if (session?.token && !headers.Authorization) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const init = {
    method: options.method || "GET",
    headers,
    signal: options.signal,
  };

  if (options.body !== undefined) {
    init.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  let response = await fetch(apiUrl(path), init);
  if (response.status === 401 && session?.role && options.auth !== false) {
    const role = session.role;
    session = null;
    await api.login(role);
    init.headers.Authorization = `Bearer ${session.token}`;
    response = await fetch(apiUrl(path), init);
  }
  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`接口返回不是 JSON：${path}`);
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || `接口调用失败：${path}`);
  }

  return payload.data;
}

export const api = {
  health: () => request("/api/health"),
  reference: () => request("/api/reference"),
  initialDeliveryScope: () => request("/api/delivery/initial-scope"),
  mvpPrinciples: () => request("/api/mvp/principles"),
  roleEndpointDivision: () => request("/api/roles/endpoint-division"),
  businessFlow: () => request("/api/business-flow/overview"),
  login: async (role) => {
    session = await request("/api/auth/login", { method: "POST", body: { role }, headers: { Authorization: "" } });
    return session;
  },
  wechatLogin: async (payload = {}) => {
    session = await request("/api/auth/wechat-login", { method: "POST", body: payload, headers: { Authorization: "" } });
    return session;
  },
  ensureAuth: async (role) => {
    if (session?.role === role && session?.token) return session;
    return api.login(role);
  },
  session: () => session,
  messages: (role) => request(withQuery("/api/messages", { role })),
  markAllMessagesRead: (role) => request("/api/messages/read-all", { method: "POST", body: { role } }),
  markMessageRead: (id) => request(`/api/messages/${id}/read`, { method: "POST", body: {} }),
  recordUiAction: (body) => request("/api/ui/actions", { method: "POST", body }),

  userHome: () => request("/api/user/home"),
  userFunctionOverview: () => request("/api/user/functions/overview"),
  userHomeRequirements: () => request("/api/user/home-requirements"),
  switchUserHomeCity: (body) => request("/api/user/home-city", { method: "POST", body }),
  userProfile: () => request("/api/user/profile"),
  userFamily: () => request("/api/user/family"),
  userContacts: () => request("/api/user/contacts"),
  userDeviceManagement: () => request("/api/user/device-management"),
  userOrders: (params) => request(withQuery("/api/user/orders", params)),
  userActivityRecords: (params) => request(withQuery("/api/user/activity-records", params)),
  userServiceRecords: (params) => request(withQuery("/api/user/service-records", params)),
  openServiceRecordDetail: (id, body = {}) => request(`/api/user/service-records/${encodeURIComponent(id)}/detail`, { method: "POST", body }),
  deleteServiceRecord: (id) => request(`/api/user/service-records/${encodeURIComponent(id)}`, { method: "DELETE", body: {} }),
  clearServiceRecords: (body = {}) => request("/api/user/service-records/clear", { method: "POST", body }),
  updateFamilyPermission: (body) => request("/api/user/family/permissions", { method: "PUT", body }),
  createFamilyInvitation: (body) => request("/api/user/family/invitations", { method: "POST", body }),
  activities: (params) => request(withQuery("/api/activities", params)),
  activityMap: (params) => request(withQuery("/api/activities/map", params)),
  activityMapRequirements: () => request("/api/activities/map-requirements"),
  activityDetail: (id) => request(`/api/activities/${id}`),
  joinActivity: (id, body = {}) => request(`/api/activities/${id}/join`, { method: "POST", body }),
  cancelActivitySignup: (id, body = {}) => request(`/api/activities/${id}/cancel`, { method: "POST", body }),
  serviceRequests: (params) => request(withQuery("/api/service-requests", params)),
  createServiceRequest: (body) => request("/api/service-requests", { method: "POST", body }),
  handleServiceRequest: (id, body) => request(`/api/service-requests/${id}/handle`, { method: "POST", body }),
  askAi: (question) => request("/api/ai/chat", { method: "POST", body: { question } }),
  aiStewardRequirements: () => request("/api/ai/steward-requirements"),
  aiQuickQuestions: () => request("/api/ai/quick-questions"),
  askAiQuickQuestion: (id) => request(`/api/ai/quick-questions/${id}/ask`, { method: "POST", body: {} }),
  transcribeAiVoice: (body = {}) => request("/api/ai/voice/transcribe", { method: "POST", body }),
  aiRecommendations: (params) => request(withQuery("/api/ai/recommendations", params)),
  aiHistory: () => request("/api/ai/history"),
  aiServiceRecords: () => request("/api/ai/service-records"),
  healthOverview: () => request("/api/health/overview"),
  healthRecord: () => request("/api/health/record"),
  updateHealthRecord: (body) => request("/api/health/record", { method: "PUT", body }),
  syncHealthRecord: (body = {}) => request("/api/health/record/sync", { method: "POST", body }),
  userHealthServices: (params) => request(withQuery("/api/user/health-services", params)),
  bookHealthService: (id, body = {}) => request(`/api/user/health-services/${encodeURIComponent(id)}/book`, { method: "POST", body }),
  consultHealthService: (id, body = {}) => request(`/api/user/health-services/${encodeURIComponent(id)}/consult`, { method: "POST", body }),
  healthServiceQuickAction: (body = {}) => request("/api/user/health-services/quick-action", { method: "POST", body }),
  userDestinations: (params) => request(withQuery("/api/user/destinations", params)),
  userDestinationDetail: (id) => request(`/api/user/destinations/${encodeURIComponent(id)}`),
  viewDestination: (id, body = {}) => request(`/api/user/destinations/${encodeURIComponent(id)}/view`, { method: "POST", body }),
  favoriteDestination: (id, body = {}) => request(`/api/user/destinations/${encodeURIComponent(id)}/favorite`, { method: "POST", body }),
  consultDestination: (id, body = {}) => request(`/api/user/destinations/${encodeURIComponent(id)}/consult`, { method: "POST", body }),
  smartDeviceRobotRequirements: () => request("/api/devices/robot-requirements"),
  createDeviceHelpRequest: (body) => request("/api/devices/help-request", { method: "POST", body }),
  emergencyHelpRequirements: () => request("/api/alerts/emergency-requirements"),
  quickHelp: (body) => request("/api/alerts/quick-help", { method: "POST", body }),
  familyContacts: () => request("/api/family-contacts"),
  createFamilyContact: (body) => request("/api/family-contacts", { method: "POST", body }),
  updateFamilyContact: (id, body) => request(`/api/family-contacts/${id}`, { method: "PUT", body }),
  deleteFamilyContact: (id) => request(`/api/family-contacts/${id}`, { method: "DELETE", body: {} }),
  callFamilyContact: (id, body = {}) => request(`/api/family-contacts/${id}/call`, { method: "POST", body }),
  triggerSos: (body) => request("/api/alerts/sos", { method: "POST", body }),

  services: (params) => request(withQuery("/api/services", params)),
  orders: (params) => request(withQuery("/api/orders", params)),
  createOrder: (body) => request("/api/orders", { method: "POST", body }),
  cancelOrder: (id, body) => request(`/api/orders/${id}/cancel`, { method: "POST", body }),
  confirmOrder: (id, body) => request(`/api/orders/${id}/confirm`, { method: "POST", body }),
  reviews: (params) => request(withQuery("/api/reviews", params)),

  tasks: () => request("/api/tasks"),
  dispatchTask: (body) => request("/api/tasks/dispatch", { method: "POST", body }),
  claimGuideTask: (body = {}) => request("/api/guide/tasks/claim-next", { method: "POST", body }),
  taskAction: (id, action, body = {}) => request(`/api/tasks/${id}/${action}`, { method: "POST", body }),
  syncDevice: (id, body = {}) => request(`/api/devices/${id}/sync`, { method: "POST", body }),
  deviceAction: (id, body = {}) => request(`/api/devices/${id}/action`, { method: "POST", body }),

  guideDashboard: (guideId = "guide-001") => request(withQuery("/api/guide/dashboard", { guideId })),
  guideStats: (guideId = "guide-001") => request(withQuery("/api/guide/stats", { guideId })),
  guideFunctionOverview: (guideId = "guide-001") => request(withQuery("/api/guide/functions/overview", { guideId })),
  guideOrderRequirements: () => request("/api/guide/order-requirements"),
  guideOrderStatusFlow: (guideId = "guide-001") => request(withQuery("/api/guide/order-status-flow", { guideId })),
  setGuideOnline: (body) => request("/api/guide/online", { method: "POST", body }),
  guideIncome: (guideId = "guide-001") => request(withQuery("/api/guide/income", { guideId })),
  reportGuideException: (body) => request("/api/guide/exception", { method: "POST", body }),
  guideTaskDecision: (id, action, body = {}) => request(`/api/guide/tasks/${id}/${action}`, { method: "POST", body }),

  merchantDashboard: (merchantId = "merchant-001") => request(withQuery("/api/merchant/dashboard", { merchantId })),
  merchantStats: (merchantId = "merchant-001") => request(withQuery("/api/merchant/stats", { merchantId })),
  merchantFunctionOverview: (merchantId = "merchant-001") => request(withQuery("/api/merchant/functions/overview", { merchantId })),
  merchantServiceCategories: () => request("/api/merchant/service-categories"),
  merchantServices: (params) => request(withQuery("/api/merchant/services", params)),
  createMerchantService: (body) => request("/api/merchant/services", { method: "POST", body }),
  setMerchantServiceStatus: (id, body) => request(`/api/merchant/services/${id}/status`, { method: "POST", body }),
  merchantOrders: (params) => request(withQuery("/api/merchant/orders", params)),
  merchantOrderAction: (id, action, body = {}) => request(`/api/merchant/orders/${id}/${action}`, { method: "POST", body }),
  reportMerchantException: (body) => request("/api/merchant/exception", { method: "POST", body }),
  merchantReviews: (params) => request(withQuery("/api/merchant/reviews", params)),

  adminDashboard: () => request("/api/admin/dashboard"),
  adminFunctionOverview: () => request("/api/admin/functions/overview"),
  adminHomeContent: () => request("/api/admin/content/home"),
  updateAdminHomeContent: (body) => request("/api/admin/content/home", { method: "PUT", body }),
  adminScreens: () => request("/api/admin/screens"),
  adminScreen: (id) => request(`/api/admin/screens/${id}`),
  adminPriorityStatus: () => request("/api/admin/priority/status"),
  adminDataLoop: () => request("/api/admin/data-loop"),
  adminUsers: () => request("/api/admin/users"),
  adminHealthRecords: () => request("/api/admin/health-records"),
  adminServices: (params) => request(withQuery("/api/admin/services", params)),
  setAdminServiceStatus: (id, body) => request(`/api/admin/services/${id}/status`, { method: "POST", body }),
  adminReviews: () => request("/api/admin/reviews"),
  adminGuides: () => request("/api/admin/guides"),
  auditGuide: (id, body) => request(`/api/admin/guides/${id}/audit`, { method: "POST", body }),
  adminMerchants: () => request("/api/admin/merchants"),
  auditMerchant: (id, body) => request(`/api/admin/merchants/${id}/audit`, { method: "POST", body }),
  adminActivities: () => request("/api/admin/activities"),
  createAdminActivity: (body) => request("/api/admin/activities", { method: "POST", body }),
  setAdminActivityStatus: (id, body) => request(`/api/admin/activities/${id}/status`, { method: "POST", body }),
  adminOrders: () => request("/api/admin/orders"),
  pendingDispatch: () => request("/api/admin/dispatch/pending"),
  adminAlerts: () => request("/api/admin/alerts"),
  auditLogs: () => request("/api/admin/audit-logs"),
  uiActions: () => request("/api/admin/ui-actions"),
  handleAlert: (id, body = {}) => request(`/api/alerts/${id}/handle`, { method: "POST", body }),
  databaseStatus: () => request("/api/admin/database/status"),
  createSnapshot: (body = {}) => request("/api/admin/database/snapshot", { method: "POST", body }),
  resetDemoData: () => request("/api/admin/demo/reset", { method: "POST", body: {} }),
  dispatchCandidates: () => request("/api/admin/dispatch/candidates"),
  integrationsStatus: () => request("/api/integrations/status"),
  createIntegrationRequest: (id, body = {}) => request(`/api/integrations/${id}/request`, { method: "POST", body }),
};
