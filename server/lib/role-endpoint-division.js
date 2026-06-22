const { rolePermissions } = require("./auth");

const ROLE_ENDPOINT_DIVISION_VERSION = "2-role-endpoint-division-v1";

const roleEndpointRows = [
  {
    id: "elder",
    roleKey: "elder",
    role: "用户/老人",
    essence: "服务需求发起者与健康数据主体",
    coreTasks: "查看健康、预约服务、参加活动、一键求助、接收反馈",
    useEnd: "微信小程序 / iOS App / Android App",
    endRoutes: ["/user/", "/user/#home", "/user/#assistant", "/user/#activity-map", "/user/#emergency", "/user/#orders", "/user/#messages"],
    apiEndpoints: ["/user/profile", "/elder/profile", "/health/overview", "/activities", "/activities/map", "/orders", "/alerts/sos", "/messages"],
    dataTables: ["user", "elder_profile", "health_record", "device", "activity", "order", "alert", "message"],
  },
  {
    id: "family",
    roleKey: "family",
    role: "家属",
    essence: "远程关怀与紧急联系人",
    coreTasks: "查看老人状态、接收预警、跟进服务记录、参与决策",
    useEnd: "微信小程序 / iOS App / Android App",
    endRoutes: ["/user/#family", "/user/#profile", "/user/#health", "/user/#orders", "/user/#messages"],
    apiEndpoints: ["/user/profile", "/elder/profile", "/health/overview", "/family-contacts", "/orders", "/alerts", "/messages"],
    dataTables: ["user", "elder_profile", "family_contact", "health_record", "order", "alert", "message"],
  },
  {
    id: "guide",
    roleKey: "guide",
    role: "人工向导",
    essence: "接单执行者（轻服务）",
    coreTasks: "接收任务、上门陪护、导游游览、陪伴就医、服务反馈",
    useEnd: "小程序/App 内人工向导角色端",
    endRoutes: ["/guide/", "/guide/#14", "/guide/#01", "/guide/#03", "/guide/#07", "/guide/#44"],
    apiEndpoints: ["/guide/dashboard", "/guide/functions/overview", "/guide/order-requirements", "/guide/order-status-flow", "/guide/tasks/claim-next", "/tasks/{id}/accept", "/tasks/{id}/start", "/tasks/{id}/complete", "/guide/exception"],
    dataTables: ["user", "guide", "order", "task", "message", "alert", "review"],
  },
  {
    id: "merchant",
    roleKey: "merchant",
    role: "商户",
    essence: "专业服务提供方（重服务）",
    coreTasks: "医疗卫生、康养护理、生活服务、殡葬等专业服务承接",
    useEnd: "小程序/App 内商户角色端",
    endRoutes: ["/merchant/", "/merchant/#15", "/merchant/#16", "/merchant/#19", "/merchant/#24", "/merchant/#31"],
    apiEndpoints: ["/merchant/dashboard", "/merchant/functions/overview", "/merchant/service-categories", "/merchant/services", "/merchant/orders", "/merchant/orders/{id}/quote", "/merchant/orders/{id}/confirm", "/merchant/orders/{id}/start", "/merchant/orders/{id}/complete", "/merchant/reviews"],
    dataTables: ["user", "merchant", "service_item", "order", "task", "message", "review"],
  },
  {
    id: "admin",
    roleKey: "admin",
    role: "平台运营/管理员",
    essence: "平台中枢与调度管理者",
    coreTasks: "监控数据、调度任务、管理人员/商户/服务/异常",
    useEnd: "管理后台",
    endRoutes: ["/admin/", "/admin/#dashboard", "/admin/#orders", "/admin/#dispatch", "/admin/#alerts", "/admin/#users"],
    apiEndpoints: ["/admin/dashboard", "/admin/users", "/admin/guides", "/admin/merchants", "/admin/orders", "/admin/dispatch/pending", "/tasks/dispatch", "/admin/alerts", "/admin/system/modules", "/admin/database/schema"],
    dataTables: ["user", "elder_profile", "family_contact", "guide", "merchant", "service_item", "order", "task", "activity", "device", "health_record", "alert", "audit_log"],
  },
];

function splitTasks(text) {
  return String(text || "")
    .split("、")
    .map((item) => item.trim())
    .filter(Boolean);
}

function countBy(items, predicate) {
  return (items || []).filter(predicate).length;
}

function roleRuntime(db, role) {
  const users = db.users || [];
  const orders = db.orders || [];
  const tasks = db.tasks || [];
  const messages = db.messages || [];
  const alerts = db.alerts || [];
  const devices = db.devices || [];
  const roleUsers = users.filter((item) => item.role === role.roleKey);

  if (role.id === "elder") {
    return {
      accountCount: roleUsers.length,
      elderProfileReady: Boolean(db.elderProfile?.id),
      healthRecordCount: (db.healthRecords || []).length,
      deviceCount: devices.length,
      activeOrderCount: countBy(orders, (item) => !["已完成", "已取消"].includes(item.status)),
      unreadMessageCount: countBy(messages, (item) => item.toRole === "user" && !item.read),
      status: roleUsers.length && db.elderProfile?.id ? "已接入" : "待补齐账号",
    };
  }

  if (role.id === "family") {
    return {
      accountCount: roleUsers.length,
      familyContactCount: (db.familyContacts || []).length,
      openAlertCount: countBy(alerts, (item) => item.status !== "已处理"),
      trackedOrderCount: orders.length,
      unreadMessageCount: countBy(messages, (item) => item.toRole === "family" && !item.read),
      status: roleUsers.length && (db.familyContacts || []).length ? "已接入" : "待补齐家属关系",
    };
  }

  if (role.id === "guide") {
    const guideProfiles = db.guides || [];
    return {
      accountCount: roleUsers.length,
      profileCount: guideProfiles.length,
      onlineCount: countBy(guideProfiles, (item) => item.onlineStatus === "在线"),
      pendingTaskCount: countBy(tasks, (item) => item.assigneeType === "guide" && item.status === "待接单"),
      activeTaskCount: countBy(tasks, (item) => item.assigneeType === "guide" && !["已完成", "已取消"].includes(item.status)),
      status: roleUsers.length && guideProfiles.length ? "已接入" : "待补齐向导资料",
    };
  }

  if (role.id === "merchant") {
    const merchants = db.merchants || [];
    const services = db.services || [];
    return {
      accountCount: roleUsers.length,
      merchantCount: merchants.length,
      approvedMerchantCount: countBy(merchants, (item) => item.status === "已通过"),
      listedServiceCount: countBy(services, (item) => item.providerType === "merchant" && item.status === "上架"),
      activeOrderCount: countBy(orders, (item) => item.providerType === "merchant" && !["已完成", "已取消"].includes(item.status)),
      status: roleUsers.length && merchants.length ? "已接入" : "待补齐商户资料",
    };
  }

  return {
    accountCount: roleUsers.length,
    adminReadableUsers: users.length,
    pendingDispatchCount: countBy(orders, (item) => item.status === "待派单"),
    openAlertCount: countBy(alerts, (item) => item.status !== "已处理"),
    auditLogCount: (db.auditLogs || []).length,
    status: roleUsers.length ? "已接入" : "待补齐管理员账号",
  };
}

function roleEndpointDivisionForApi(db) {
  const roles = roleEndpointRows.map((row) => {
    const permissions = rolePermissions[row.roleKey] || [];
    const runtime = roleRuntime(db, row);
    return {
      ...row,
      coreTaskList: splitTasks(row.coreTasks),
      permissions,
      runtime,
      ready: runtime.status === "已接入" && row.endRoutes.length > 0 && row.apiEndpoints.length > 0 && permissions.length > 0,
    };
  });

  const accountRoleCounts = roles.reduce((result, item) => {
    result[item.roleKey] = item.runtime.accountCount;
    return result;
  }, {});

  return {
    version: ROLE_ENDPOINT_DIVISION_VERSION,
    source: "2. 角色与端口划分",
    roleCount: roles.length,
    mobileRoleCount: roles.filter((item) => item.useEnd.includes("微信小程序") || item.useEnd.includes("小程序/App")).length,
    dedicatedEndCount: roles.filter((item) => !item.useEnd.includes("微信小程序") && !item.useEnd.includes("小程序/App")).length,
    endpointCount: new Set(roles.flatMap((item) => item.apiEndpoints)).size,
    roles,
    runtime: {
      accountRoleCounts,
      appRoutes: {
        user: "/user/",
        guide: "/guide/",
        merchant: "/merchant/",
        admin: "/admin/",
      },
      roleBoundaries: roles.map((item) => ({
        role: item.role,
        essence: item.essence,
        useEnd: item.useEnd,
        permissionCount: item.permissions.length,
        runtimeStatus: item.runtime.status,
      })),
    },
    acceptance: {
      allFiveRolesMapped: roles.length === 5,
      allRolesHaveUseEnd: roles.every((item) => item.useEnd && item.endRoutes.length > 0),
      allRolesHaveApiAndPermissions: roles.every((item) => item.apiEndpoints.length > 0 && item.permissions.length > 0),
      adminCanSeeAllRoles: accountRoleCounts.admin >= 1 && roles.every((item) => item.runtime.accountCount >= 1),
      executionRolesSeparated:
        roles.some((item) => item.id === "guide" && item.useEnd === "小程序/App 内人工向导角色端") &&
        roles.some((item) => item.id === "merchant" && item.useEnd === "小程序/App 内商户角色端"),
    },
  };
}

function validateRoleEndpointDivision() {
  const errors = [];
  const expectedRows = [
    ["用户/老人", "服务需求发起者与健康数据主体", "查看健康、预约服务、参加活动、一键求助、接收反馈", "微信小程序 / iOS App / Android App"],
    ["家属", "远程关怀与紧急联系人", "查看老人状态、接收预警、跟进服务记录、参与决策", "微信小程序 / iOS App / Android App"],
    ["人工向导", "接单执行者（轻服务）", "接收任务、上门陪护、导游游览、陪伴就医、服务反馈", "小程序/App 内人工向导角色端"],
    ["商户", "专业服务提供方（重服务）", "医疗卫生、康养护理、生活服务、殡葬等专业服务承接", "小程序/App 内商户角色端"],
    ["平台运营/管理员", "平台中枢与调度管理者", "监控数据、调度任务、管理人员/商户/服务/异常", "管理后台"],
  ];

  expectedRows.forEach(([role, essence, coreTasks, useEnd], index) => {
    const row = roleEndpointRows[index];
    if (!row || row.role !== role || row.essence !== essence || row.coreTasks !== coreTasks || row.useEnd !== useEnd) {
      errors.push({ role, issue: "角色端口行与第 2 节图示不一致" });
    }
  });

  roleEndpointRows.forEach((item) => {
    if (!item.endRoutes.length) errors.push({ role: item.role, issue: "缺少端口路由映射" });
    if (!item.apiEndpoints.length) errors.push({ role: item.role, issue: "缺少 API 映射" });
    if (!item.dataTables.length) errors.push({ role: item.role, issue: "缺少数据表映射" });
    if (!(rolePermissions[item.roleKey] || []).length) errors.push({ role: item.role, issue: "缺少权限点映射" });
  });

  return {
    version: ROLE_ENDPOINT_DIVISION_VERSION,
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  ROLE_ENDPOINT_DIVISION_VERSION,
  roleEndpointDivisionForApi,
  roleEndpointRows,
  validateRoleEndpointDivision,
};
