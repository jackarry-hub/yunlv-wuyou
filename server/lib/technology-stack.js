const TECHNOLOGY_STACK_VERSION = "technology-stack-v1";

const technologyLayers = [
  {
    id: "mobile",
    layer: "用户端与角色端跨端移动应用",
    recommendation: "uni-app（优先）/ Taro（备选）",
    description: "用户端正式交付微信小程序、iOS App、Android App；人工向导端和商户端作为小程序/App 内角色端承载。",
    currentImplementation: "uni-app 正式工程骨架 + shared API client",
    targetStatus: "输出微信小程序、iOS App、Android App，人工向导/商户作为小程序/App 内角色端",
    evidence: ["uniapp/pages.json", "uniapp/manifest.json", "uniapp/common/api.js", "apps/shared/api.js"],
  },
  {
    id: "admin",
    layer: "管理后台",
    recommendation: "Vue3 + Element Plus / React + Ant Design",
    description: "快速搭建后台表格、表单、权限和数据看板。",
    currentImplementation: "API 驱动 PC Web 后台",
    targetStatus: "试运营可验收，生产建议 Vue3 + Element Plus",
    evidence: ["/admin/", "/api/admin/dashboard", "/api/admin/system/modules"],
  },
  {
    id: "backend",
    layer: "后端服务",
    recommendation: "Node.js NestJS / Java Spring Boot / Python FastAPI",
    description: "统一 REST API，支持订单、用户、服务、设备、通知、AI 等模块。",
    currentImplementation: "Node.js http server + 模块化 lib",
    targetStatus: "核心 REST API 已实现，生产建议升级 NestJS 或 Spring Boot",
    evidence: ["server.js", "server/lib/auth.js", "server/lib/state-machine.js", "/api/reference"],
  },
  {
    id: "database",
    layer: "数据库",
    recommendation: "MySQL/PostgreSQL + Redis",
    description: "关系数据存储，Redis 用于缓存、验证码、消息队列等。",
    currentImplementation: "JSON mock database + 核心表契约 + SQL 建表脚本",
    targetStatus: "试运营数据闭环可验收，生产需迁移 PostgreSQL/MySQL + Redis",
    evidence: ["data/mock-db.json", "database/schema.sql", "/api/admin/database/schema"],
  },
  {
    id: "map",
    layer: "地图服务",
    recommendation: "腾讯地图 / 高德地图",
    description: "用于定位、地图点、距离计算、路线导航。",
    currentImplementation: "活动地图 API + 高德地图接入预留",
    targetStatus: "地图点位已驱动，真实定位/路线能力按 P2 接入",
    evidence: ["/api/activities/map", "/api/integrations/map/request"],
  },
  {
    id: "ai",
    layer: "AI 能力",
    recommendation: "大模型 API + 知识库 + 规则引擎",
    description: "支持智能管家问答、服务推荐、异常解释。",
    currentImplementation: "本地意图模拟 + AI 历史记录 + LLM 接口预留",
    targetStatus: "试运营可演示，生产需接入真实大模型和知识库",
    evidence: ["/api/ai/chat", "/api/ai/history", "/api/integrations/llm/request"],
  },
  {
    id: "object-storage",
    layer: "对象存储",
    recommendation: "阿里云 OSS / 腾讯云 COS",
    description: "存储活动图、服务凭证、用户头像、商户资质等。",
    currentImplementation: "本地静态资源 + 上传动作/凭证字段预留",
    targetStatus: "本地演示可用，生产需接 OSS/COS",
    evidence: ["/ui-ref/", "/api/integrations/storage/request"],
  },
  {
    id: "deployment",
    layer: "部署",
    recommendation: "云服务器 + Docker + Nginx + HTTPS",
    description: "部署后端、管理后台、静态资源和接口服务。",
    currentImplementation: "Dockerfile + docker-compose + 部署文档",
    targetStatus: "内网/本地演示配置已具备，生产需补域名、HTTPS 和 CI/CD",
    evidence: ["Dockerfile", "deploy/docker-compose.yml", "docs/deployment.md"],
  },
];

function technologyStackSummary() {
  return {
    version: TECHNOLOGY_STACK_VERSION,
    layerCount: technologyLayers.length,
    productionRequiredCount: technologyLayers.filter((item) => /生产需|生产建议/.test(item.targetStatus)).length,
    readyForTrialCount: technologyLayers.filter((item) => /试运营|演示|已具备/.test(item.targetStatus)).length,
  };
}

function technologyStackForApi() {
  return {
    ...technologyStackSummary(),
    layers: technologyLayers,
  };
}

function validateTechnologyStack() {
  const requiredLayers = ["用户端与角色端跨端移动应用", "管理后台", "后端服务", "数据库", "地图服务", "AI 能力", "对象存储", "部署"];
  const errors = [];
  const layerNames = new Set(technologyLayers.map((item) => item.layer));

  requiredLayers.forEach((layer) => {
    if (!layerNames.has(layer)) errors.push({ layer, issue: "缺少技术层级" });
  });

  technologyLayers.forEach((item) => {
    if (!item.recommendation || !item.description) errors.push({ layer: item.layer, issue: "建议方案或说明为空" });
    if (!item.currentImplementation || !item.targetStatus) errors.push({ layer: item.layer, issue: "当前实现或目标状态为空" });
    if (!Array.isArray(item.evidence) || item.evidence.length === 0) errors.push({ layer: item.layer, issue: "缺少工程证据" });
  });

  return {
    ...technologyStackSummary(),
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  TECHNOLOGY_STACK_VERSION,
  technologyLayers,
  technologyStackForApi,
  validateTechnologyStack,
};
