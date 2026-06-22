const SCHEMA_VERSION = "10.1-core-tables-v1";

function column(name, source, type, description, options = {}) {
  return {
    name,
    source,
    type,
    description,
    required: options.required !== false,
  };
}

const coreTableSchemas = [
  {
    table: "user",
    source: "users",
    sourceType: "array",
    description: "用户、家属、管理员等基础账号。",
    fields: [
      column("id", "id", "varchar(64)", "账号 ID"),
      column("phone", "phone", "varchar(32)", "手机号"),
      column("nickname", "nickname", "varchar(80)", "昵称"),
      column("role", "role", "varchar(32)", "角色"),
      column("avatar", "avatar", "text", "头像"),
      column("status", "status", "varchar(32)", "账号状态"),
    ],
  },
  {
    table: "elder_profile",
    source: "elderProfile",
    sourceType: "object",
    description: "老人档案。",
    fields: [
      column("user_id", "userId", "varchar(64)", "关联用户 ID"),
      column("name", "name", "varchar(80)", "老人姓名"),
      column("gender", "gender", "varchar(16)", "性别"),
      column("age", "age", "integer", "年龄"),
      column("health_tags", "healthTags", "json", "健康标签"),
      column("address", "address", "text", "常住地址"),
    ],
  },
  {
    table: "family_contact",
    source: "familyContacts",
    sourceType: "array",
    description: "家属与紧急联系人。",
    fields: [
      column("elder_id", "elderId", "varchar(64)", "老人档案 ID"),
      column("name", "name", "varchar(80)", "联系人姓名"),
      column("relation", "relation", "varchar(32)", "关系"),
      column("phone", "phone", "varchar(32)", "手机号"),
      column("is_default", "isDefault", "boolean", "是否默认联系人"),
    ],
  },
  {
    table: "guide",
    source: "guides",
    sourceType: "array",
    description: "人工向导资料。",
    fields: [
      column("user_id", "userId", "varchar(64)", "关联用户 ID"),
      column("real_name", "realName", "varchar(80)", "真实姓名"),
      column("service_types", "serviceTypes", "json", "服务类型"),
      column("area", "area", "varchar(120)", "服务区域"),
      column("status", "status", "varchar(32)", "认证状态"),
      column("rating", "rating", "decimal(3,2)", "评分"),
    ],
  },
  {
    table: "merchant",
    source: "merchants",
    sourceType: "array",
    description: "商户资料与审核。",
    fields: [
      column("name", "name", "varchar(120)", "商户名称"),
      column("type", "type", "varchar(80)", "商户类型"),
      column("license", "license", "varchar(120)", "资质编号"),
      column("contact", "contact", "varchar(80)", "联系人"),
      column("address", "address", "text", "经营地址"),
      column("status", "status", "varchar(32)", "审核状态"),
    ],
  },
  {
    table: "service_item",
    source: "services",
    sourceType: "array",
    description: "向导/商户服务项目。",
    fields: [
      column("provider_type", "providerType", "varchar(32)", "服务提供方类型"),
      column("provider_id", "providerId", "varchar(64)", "服务提供方 ID"),
      column("title", "title", "varchar(160)", "服务标题"),
      column("category", "category", "varchar(80)", "服务分类"),
      column("price", "price", "decimal(10,2)", "价格"),
      column("status", "status", "varchar(32)", "上架状态"),
    ],
  },
  {
    table: "order",
    source: "orders",
    sourceType: "array",
    description: "统一订单。",
    fields: [
      column("order_no", "orderNo", "varchar(64)", "订单号"),
      column("user_id", "userId", "varchar(64)", "下单用户 ID"),
      column("service_type", "serviceType", "varchar(120)", "服务类型"),
      column("provider_type", "providerType", "varchar(32)", "服务提供方类型"),
      column("status", "status", "varchar(32)", "订单状态"),
      column("amount", "amount", "decimal(10,2)", "订单金额"),
      column("time", "time", "varchar(32)", "预约时间"),
      column("location", "location", "text", "服务地点"),
    ],
  },
  {
    table: "task",
    source: "tasks",
    sourceType: "array",
    description: "派单任务。",
    fields: [
      column("order_id", "orderId", "varchar(64)", "关联订单 ID"),
      column("assignee_type", "assigneeType", "varchar(32)", "执行方类型"),
      column("assignee_id", "assigneeId", "varchar(64)", "执行方 ID"),
      column("status", "status", "varchar(32)", "任务状态"),
      column("dispatch_rule", "dispatchRule", "varchar(160)", "派单规则"),
    ],
  },
  {
    table: "activity",
    source: "activities",
    sourceType: "array",
    description: "活动地图数据。",
    fields: [
      column("title", "title", "varchar(160)", "活动标题"),
      column("category", "category", "varchar(80)", "活动分类"),
      column("time", "time", "varchar(32)", "活动时间"),
      column("location", "location", "text", "活动地点"),
      column("coordinates", "coordinates", "json", "地图坐标"),
      column("quota", "quota", "integer", "名额"),
      column("status", "status", "varchar(32)", "活动状态"),
    ],
  },
  {
    table: "device",
    source: "devices",
    sourceType: "array",
    description: "设备数据。",
    fields: [
      column("device_id", "deviceId", "varchar(80)", "设备编号"),
      column("type", "type", "varchar(80)", "设备类型"),
      column("user_id", "userId", "varchar(64)", "绑定用户 ID"),
      column("battery", "battery", "integer", "电量"),
      column("online_status", "onlineStatus", "varchar(32)", "在线状态"),
    ],
  },
  {
    table: "health_record",
    source: "healthRecords",
    sourceType: "array",
    description: "健康指标。",
    fields: [
      column("elder_id", "elderId", "varchar(64)", "老人档案 ID"),
      column("metric_type", "metricType", "varchar(80)", "指标类型"),
      column("value", "value", "varchar(80)", "指标值"),
      column("unit", "unit", "varchar(32)", "单位"),
      column("source", "source", "varchar(80)", "数据来源"),
      column("recorded_at", "recordedAt", "varchar(32)", "记录时间"),
    ],
  },
  {
    table: "alert",
    source: "alerts",
    sourceType: "array",
    description: "异常/SOS 记录。",
    fields: [
      column("elder_id", "elderId", "varchar(64)", "老人档案 ID"),
      column("type", "type", "varchar(80)", "异常类型"),
      column("level", "level", "varchar(32)", "等级"),
      column("location", "location", "text", "位置"),
      column("status", "status", "varchar(32)", "处理状态"),
      column("handled_by", "handledBy", "varchar(80)", "处理人", { required: false }),
    ],
  },
  {
    table: "ai_chat",
    source: "aiHistory",
    sourceType: "array",
    description: "智能管家对话。",
    fields: [
      column("user_id", "userId", "varchar(64)", "用户 ID"),
      column("question", "question", "text", "问题"),
      column("answer", "answer", "text", "回答"),
      column("intent", "intent", "varchar(80)", "识别意图"),
      column("created_at", "createdAt", "varchar(32)", "创建时间"),
    ],
  },
];

function rowsForTable(db, table) {
  const value = db[table.source];
  if (table.sourceType === "object") return value && typeof value === "object" ? [value] : [];
  return Array.isArray(value) ? value : [];
}

function hasRequiredValue(row, source) {
  return row[source] !== undefined && row[source] !== null;
}

function validateCoreTables(db) {
  const tables = coreTableSchemas.map((table) => {
    const rows = rowsForTable(db, table);
    const missingFields = [];
    rows.forEach((row, rowIndex) => {
      table.fields.forEach((field) => {
        if (field.required && !hasRequiredValue(row, field.source)) {
          missingFields.push({
            rowIndex,
            field: field.name,
            source: field.source,
          });
        }
      });
    });
    return {
      table: table.table,
      source: table.source,
      rowCount: rows.length,
      requiredFieldCount: table.fields.filter((field) => field.required).length,
      missingFields,
      valid: missingFields.length === 0,
    };
  });
  return {
    version: SCHEMA_VERSION,
    tableCount: coreTableSchemas.length,
    valid: tables.every((table) => table.valid),
    tables,
    missingFields: tables.flatMap((table) => table.missingFields.map((item) => ({ table: table.table, ...item }))),
  };
}

function schemaForApi() {
  return coreTableSchemas.map((table) => ({
    table: table.table,
    source: table.source,
    sourceType: table.sourceType,
    description: table.description,
    keyFields: table.fields.map((field) => ({
      name: field.name,
      source: field.source,
      type: field.type,
      required: field.required,
      description: field.description,
    })),
  }));
}

module.exports = {
  SCHEMA_VERSION,
  coreTableSchemas,
  schemaForApi,
  validateCoreTables,
};
