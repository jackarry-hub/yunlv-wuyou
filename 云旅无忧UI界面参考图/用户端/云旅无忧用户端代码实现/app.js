const A = "./assets/";
const ASSET_VERSION = "20260614-user-asset-cache1";

const colors = ["green", "blue", "orange", "purple", "cyan", "red"];
const AMAP_KEY = "ed0e2af40e4b73e90525252ff8fd52a8";
const AMAP_SECURITY_JS_CODE = "6a88c94ef10f6366e3cc20f337edd8fb";
const AMAP_PLUGINS = ["AMap.Geolocation", "AMap.Geocoder", "AMap.CitySearch", "AMap.Scale"];
const AMAP_READY_TIMEOUT_MS = 8000;
const DEFAULT_CITY = "昆明";
const DEFAULT_CENTER = [103.4148, 24.4105];
const activityMapCategories = ["全部", "文化体验", "康养健身", "休闲娱乐", "自然观光", "学习讲座"];
const activityMapCategoryIcons = ["shield-check", "home", "heart-pulse", "coffee", "mountain", "book-open"];
const activityMapEvents = [
  { image: "activity-taiji.jpg", title: "晨练太极健康课", time: "每日 07:00-08:30", place: "湖泉生态园", distance: "1.2km", color: "orange", category: "康养健身", position: [103.4052, 24.4214] },
  { image: "activity-music.jpg", title: "书画交流会", time: "今日 15:00-17:00", place: "东风韵小镇", distance: "886m", color: "purple", category: "文化体验", position: [103.4276, 24.4211] },
  { image: "destination-lake.jpg", title: "湖畔徒步", time: "今日 06:00-10:00", place: "湖泉生态园步道", distance: "1.0km", color: "green", category: "自然观光", position: [103.3982, 24.4078] },
  { image: "activity-calligraphy.jpg", title: "文化讲座", time: "今日 10:00-17:30", place: "弥勒市文化馆", distance: "1.5km", color: "blue", category: "学习讲座", position: [103.4274, 24.4065] },
  { image: "destination-hot-spring.jpg", title: "温泉养生体验", time: "今日 14:00-16:00", place: "湖泉温泉酒店", distance: "1.1km", color: "red", category: "康养健身", position: [103.3974, 24.3892] },
  { image: "destination-city.jpg", title: "红酒品鉴活动", time: "今日 16:00-18:00", place: "云南红酒庄", distance: "4.5km", color: "cyan", category: "休闲娱乐", position: [103.4139, 24.3825] },
  { image: "activity-music.jpg", title: "油画写生", time: "明日 09:30-12:00", place: "可邑小镇", distance: "5.2km", color: "orange", category: "文化体验", position: [103.4343, 24.3926] },
];
const emergencyHospitalMapPoints = [
  { image: "guide-medical.jpg", title: "弥勒市人民医院", time: "24小时急诊", place: "弥勒市髯翁路", distance: "3.2km", color: "green", category: "附近医院", position: [103.434, 24.405], kind: "hospital", phone: "0873-6122254" },
  { image: "guide-medical.jpg", title: "弥勒市中医医院", time: "急诊值守", place: "弥勒市温泉路", distance: "4.1km", color: "blue", category: "附近医院", position: [103.421, 24.398], kind: "hospital", phone: "0873-6123120" },
  { image: "health-hero.jpg", title: "湖泉社区卫生服务站", time: "08:00-20:00", place: "湖泉生态园附近", distance: "1.4km", color: "cyan", category: "附近医院", position: [103.399, 24.409], kind: "hospital", phone: "0873-6120012" },
];
const assistantSuggestionBatches = [
  ["推荐适合老年人的旅居地", "昆明最近的活动有哪些？", "旅居地的天气怎么样？", "如何预订旅居公寓？"],
  ["帮我规划本周活动", "怎么预约健康问诊？", "手环电量异常怎么办？", "旅居订单怎么查看？"],
  ["附近有什么志愿服务？", "昆明适合老人吃什么？", "如何联系人工向导？", "政策补贴怎么领取？"],
];
const assistantAnswerMap = {
  "昆明现在适合旅居吗？天气如何？": [
    "昆明目前非常适合旅居哦！",
    "现在是5月中旬，气候宜人，平均气温 15°C ~ 25°C，白天温暖舒适，早晚略凉，非常适合户外活动和散步。",
    "空气质量优良，素有“春城”之称，是旅居养老的热门选择！",
    "如果您想了解更多昆明的旅居攻略或推荐住处，我可以继续帮您哦～",
  ],
  "推荐适合老年人的旅居地": [
    "我会优先看气候、医疗、交通和社区照护四个维度。",
    "当前更推荐昆明滇池旅居区、弥勒湖泉康养社区和大理洱海慢居社区：气候稳定，配套成熟，适合中长期旅居。",
    "如果您有慢病管理或家属探访需求，我建议优先选择昆明或弥勒。",
  ],
  "昆明最近的活动有哪些？": [
    "昆明近期适合参加轻运动和社交类活动。",
    "推荐晨练太极、书画交流会和傍晚音乐会，强度适中，也方便结识旅居朋友。",
    "您可以在活动日历里查看报名状态，我也可以继续帮您筛选低强度活动。",
  ],
  "旅居地的天气怎么样？": [
    "昆明今天整体适合出行，白天温暖，早晚略凉。",
    "建议穿轻薄外套，户外活动尽量安排在上午或傍晚，避免中午长时间日晒。",
    "如果您要去湖边散步，我会建议带上帽子和水杯。",
  ],
  "如何预订旅居公寓？": [
    "预订旅居公寓可以先选目的地，再查看旅居方案。",
    "提交入住时间、人数和照护需求后，平台会生成订单，后续可由管家协助确认房型。",
    "如果是首次入住，建议先选择 7-15 天体验周期。",
  ],
  "帮我规划本周活动": [
    "本周建议安排 2 次轻运动、1 次社交活动和 1 次健康咨询。",
    "周一或周三参加晨练太极，周四参加书画交流，周末可以预约湖边慢行活动。",
    "这样的节奏强度更稳，也能兼顾休息。",
  ],
  "怎么预约健康问诊？": [
    "可以从健康服务进入在线问诊，选择科室、医生和时间段。",
    "预约前建议先同步健康档案和近期监测数据，医生能更快了解您的情况。",
    "如有急症或明显不适，请优先使用紧急求助或线下就医。",
  ],
  "手环电量异常怎么办？": [
    "如果手环电量异常，先检查充电触点是否干净，再重新放回充电底座。",
    "仍然异常时，可以进入设备管理查看连接状态，或联系平台协助检测设备。",
    "我也可以提醒您每天固定时间查看电量。",
  ],
  "旅居订单怎么查看？": [
    "您可以从“我的订单”查看全部旅居、向导和服务订单。",
    "订单详情里能看到入住时间、费用、服务进度和客服入口。",
    "如果订单状态不对，可以直接联系平台客服处理。",
  ],
  "附近有什么志愿服务？": [
    "附近可优先查看陪伴探访、活动协助和社区公益服务。",
    "志愿服务适合选择距离近、时长短、响应明确的项目。",
    "我可以继续按您的位置筛选更适合的服务。",
  ],
  "昆明适合老人吃什么？": [
    "昆明饮食建议选择清淡、温热、少油的本地餐食。",
    "可以尝试菌菇汤、米线、蒸菜和应季蔬果，注意少吃辛辣和过凉食物。",
    "如果有慢病饮食限制，建议结合健康档案做个性化推荐。",
  ],
  "如何联系人工向导？": [
    "可以从人工向导页面选择陪同类型、服务时间和地点。",
    "下单前建议查看评分、服务经验和用户评价，优先选择可接单向导。",
    "夜间出行或就医陪同时，建议直接预约人工向导。",
  ],
  "政策补贴怎么领取？": [
    "政策补贴需要先确认所在城市、年龄、户籍和服务类型。",
    "您可以在政策指南查看申请条件，也可以让我帮您提炼材料清单。",
    "正式申请前建议以当地最新窗口要求为准。",
  ],
};

const screens = [
  { num: "07", id: "home", title: "首页", group: "首页与发现", tab: "home", home: true, render: renderHome },
  { num: "30", id: "destinations", title: "旅居目的地", group: "首页与发现", tab: "home", action: "我的收藏", actionIcon: "map", render: renderDestinations },
  { num: "31", id: "destination-detail", title: "目的地详情", group: "首页与发现", tab: "discover", noTab: true, plain: true, actionIcon: "share-2", render: renderDestinationDetail },
  { num: "06", id: "activity-map", title: "活动地图", subtitle: "发现身边精彩活动，乐享旅居生活", group: "首页与发现", tab: "discover", action: "活动日历", actionRoute: "activity-calendar", actionIcon: "calendar-days", render: renderActivityMap },
  { num: "19", id: "activity-calendar", title: "活动日历", group: "首页与发现", tab: "discover", action: "活动地图", actionRoute: "activity-map", actionIcon: "map", render: renderCalendar },
  { num: "35", id: "community", title: "社群交流", group: "首页与发现", tab: "discover", action: "发布", actionIcon: "plus", render: renderCommunity },
  { num: "36", id: "checkin", title: "旅居打卡", group: "首页与发现", tab: "discover", noTab: true, action: "打卡日历", actionRoute: "activity-calendar", actionIcon: "calendar-check", render: renderCheckin },
  { num: "37", id: "food", title: "本地美食", group: "首页与发现", tab: "discover", noTab: true, action: "美食地图", actionIcon: "map", render: renderFood },
  { num: "38", id: "transport", title: "交通出行", group: "首页与发现", tab: "discover", noTab: true, action: "行程记录", actionIcon: "clipboard-list", render: renderTransport },
  { num: "40", id: "volunteer", title: "志愿服务", group: "首页与发现", tab: "discover", noTab: true, action: "我的志愿", actionIcon: "user", render: renderVolunteer },

  { num: "02", id: "assistant", title: "AI智能管家", subtitle: "7x24小时为您服务", group: "智能陪伴", tab: "consult", noTab: true, action: "服务记录", actionRoute: "service-records", actionIcon: "file-text", render: renderAssistant },
  { num: "01", id: "devices", title: "智能设备", group: "智能陪伴", tab: "consult", action: "设备管理", actionRoute: "device-management", render: renderDevices },
  { num: "05", id: "robot", title: "小云机器人", group: "智能陪伴", tab: "consult", noTab: true, action: "设置", actionRoute: "robot-settings", render: renderRobot },
  { num: "21", id: "device-management", title: "设备管理", group: "智能陪伴", tab: "profile", noTab: true, action: "添加设备", actionIcon: "plus", render: renderDeviceManagement },
  { num: "22", id: "band-settings", title: "手环设置", group: "智能陪伴", tab: "profile", noTab: true, action: "帮助", actionIcon: "circle-help", render: renderBandSettings },
  { num: "23", id: "robot-settings", title: "机器人设置", group: "智能陪伴", tab: "profile", noTab: true, action: "设备日志", actionIcon: "clipboard-list", render: renderRobotSettings },

  { num: "03", id: "guide", title: "人工向导", group: "服务与订单", tab: "consult", noTab: true, action: "我的订单", actionRoute: "orders", actionIcon: "receipt", render: renderGuide },
  { num: "17", id: "guide-detail", title: "向导详情", group: "服务与订单", tab: "consult", noTab: true, action: "收藏", actionIcon: "heart", render: renderGuideDetail },
  { num: "16", id: "order-submit", title: "提交订单", group: "服务与订单", tab: "consult", noTab: true, render: renderOrderSubmit },
  { num: "13", id: "orders", title: "我的订单", group: "服务与订单", tab: "profile", action: "客服", actionIcon: "headphones", render: renderOrders },
  { num: "14", id: "order-detail", title: "订单详情", group: "服务与订单", tab: "profile", noTab: true, action: "投诉/求助", render: renderOrderDetail },
  { num: "15", id: "review", title: "服务评价", group: "服务与订单", tab: "profile", noTab: true, render: renderReview },
  { num: "18", id: "service-records", title: "服务记录", group: "服务与订单", tab: "profile", noTab: true, action: "清空", render: renderServiceRecords },
  { num: "08", id: "activity-signup", title: "活动报名", group: "服务与订单", tab: "discover", noTab: true, plain: true, action: "分享", actionIcon: "share-2", render: renderActivitySignup },
  { num: "20", id: "activity-records", title: "活动报名记录", group: "服务与订单", tab: "profile", noTab: true, action: "筛选", actionIcon: "filter", render: renderActivityRecords },

  { num: "04", id: "emergency", title: "紧急求助", group: "安全健康", tab: "consult", noTab: true, action: "求助记录", actionRoute: "sos-records", actionIcon: "clipboard-list", render: renderEmergency },
  { num: "24", id: "sos-records", title: "求助记录", group: "安全健康", tab: "profile", noTab: true, action: "筛选", actionIcon: "filter", render: renderSosRecords },
  { num: "25", id: "contacts", title: "紧急联系人", group: "安全健康", tab: "profile", noTab: true, action: "添加", actionIcon: "plus", render: renderContacts },
  { num: "26", id: "health-record", title: "健康档案", group: "安全健康", tab: "profile", noTab: true, action: "编辑", actionIcon: "pencil", render: renderHealthRecord },
  { num: "32", id: "health-services", title: "健康服务", group: "安全健康", tab: "discover", noTab: true, action: "健康档案", actionRoute: "health-record", actionIcon: "clipboard-plus", render: renderHealthServices },
  { num: "33", id: "policies", title: "政策指南", group: "安全健康", tab: "discover", noTab: true, render: renderPolicies },
  { num: "34", id: "policy-detail", title: "政策详情", group: "安全健康", tab: "discover", noTab: true, action: "分享", actionIcon: "share-2", render: renderPolicyDetail },

  { num: "39", id: "shop", title: "优选商城", group: "商城与消息", tab: "consult", action: "购物车", actionIcon: "shopping-cart", render: renderShop, checkout: true },
  { num: "09", id: "messages", title: "消息中心", group: "商城与消息", tab: "messages", action: "全部已读", render: renderMessages },

  { num: "10", id: "profile", title: "我的", group: "账号与设置", tab: "profile", actionIcon: "bell", actionRoute: "messages", render: renderProfile },
  { num: "11", id: "login", title: "登录注册", group: "账号与设置", plain: true, noBack: true, noTab: true, render: renderLogin },
  { num: "12", id: "city", title: "选择城市", group: "账号与设置", noTab: true, render: renderCity },
  { num: "27", id: "personal", title: "个人资料", group: "账号与设置", tab: "profile", noTab: true, action: "保存", render: renderPersonal },
  { num: "28", id: "family", title: "家属绑定", group: "账号与设置", tab: "profile", noTab: true, action: "邀请", render: renderFamily },
  { num: "29", id: "settings", title: "设置", group: "账号与设置", tab: "profile", noTab: true, render: renderSettings },
];

const routeMap = Object.fromEntries(screens.map((screen) => [screen.id, screen]));
Object.assign(routeMap, {
  "emergency-records": routeMap["sos-records"],
  "health-archive": routeMap["health-record"],
  "family-binding": routeMap.family,
});
const routeAliases = {
  "emergency-records": "sos-records",
  "health-archive": "health-record",
  "family-binding": "family",
};

function normalizeUserRouteId(value) {
  let text = String(value || "").trim().replace(/^#+/, "").replace(/^!/, "");
  if (!text) return "";
  try {
    text = decodeURIComponent(text);
  } catch (error) {
    text = String(value || "").trim().replace(/^#+/, "").replace(/^!/, "");
  }
  if (/^https?:\/\//i.test(text)) {
    try {
      const url = new URL(text, window.location.href);
      text = url.pathname + url.search + url.hash;
    } catch (error) {
      return "";
    }
  }
  if (/^\/(?:guide|merchant|admin)(?:\/|$)/.test(text)) return "";
  text = text.replace(/^\/+/, "");
  const cleaned = text.split(/[?#&]/)[0].replace(/\/+$/, "").replace(/\.html$/, "");
  const id = cleaned.replace(/^user\//, "").replace(/^pages\/user\//, "");
  if (routeAliases[id]) return routeAliases[id];
  if (routeMap[id]) return id;
  const titleMatch = screens.find((screen) => screen.title === id);
  if (titleMatch) return titleMatch.id;
  return screens.find((screen) => screen.num === id)?.id || "";
}

function queryParam(name) {
  const search = String(window.location.search || "").replace(/^\?/, "");
  if (!search) return "";
  if (typeof window.URLSearchParams === "function") return new window.URLSearchParams(search).get(name) || "";
  const match = search.split("&").map((part) => part.split("=")).find(([key]) => decodeURIComponent(key || "") === name);
  return match ? decodeURIComponent((match[1] || "").replace(/\+/g, " ")) : "";
}

function routeFromQuery() {
  return normalizeUserRouteId(queryParam("screen") || queryParam("page") || queryParam("route"));
}

function normalizeInitialQueryRoute() {
  if (window.location.hash) return;
  const route = routeFromQuery();
  if (route) window.location.hash = route;
}

function userUrlLeavesEndpoint(rawUrl) {
  const href = String(rawUrl || "").trim();
  if (!href || href.startsWith("#")) return false;
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch (error) {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  return url.pathname === "/" || /^\/(?:guide|merchant|admin)(?:\/|$)/.test(url.pathname);
}

function guardUserEndpointClick(event) {
  const target = event.target?.closest?.("a[href], [data-href]");
  if (!target) return false;
  const href = target.getAttribute("href") || target.dataset.href || "";
  if (!userUrlLeavesEndpoint(href)) return false;
  event.preventDefault();
  event.stopPropagation();
  event.userEndpointBlocked = true;
  writeActionStatus(target, "已拦截跨端跳转，当前仍在用户端");
  return true;
}

const destinationDetails = {
  mile: {
    title: "弥勒湖泉康养旅居",
    image: "destination-detail-hero-live.jpg",
    position: [103.3982, 24.4078],
    tags: ["湖景康养", "气候舒适", "医疗便利"],
    rating: "4.8",
    reviews: "268条评价",
    followers: "1560人关注",
    address: "云南省红河州弥勒市温泉路湖泉生态园",
    season: "全年皆宜，春秋最佳（3-5月，9-11月）",
    hospital: "弥勒市人民医院（三甲）　距离 3.2km",
    transport: "多条公交直达，弥勒高铁站约 15 分钟车程",
    reasons: [
      ["leaf", "气候宜人", "四季如春，空气清新<br>年均气温 18°C", "green"],
      ["users", "活动丰富", "晨练、太极、文娱活动<br>康养生活多姿多彩", "blue"],
      ["shopping-cart", "生活便利", "配套齐全，交通便捷<br>生活无忧", "orange"],
    ],
  },
  kunming: {
    title: "昆明滇池旅居区",
    image: "destination-city.jpg",
    position: [102.6649, 24.9631],
    tags: ["气候宜人", "生态优美", "交通便利"],
    rating: "4.7",
    reviews: "189条评价",
    followers: "980人关注",
    address: "云南省昆明市西山区滇池路海埂片区",
    season: "全年适合旅居，5-10月湖畔活动更丰富",
    hospital: "云南省第一人民医院　车程约 18 分钟",
    transport: "地铁 5 号线与多条公交覆盖，近海埂公园",
    reasons: [
      ["cloud-sun", "气候稳定", "四季温和，日照充足<br>适合长期旅居", "green"],
      ["map-pin", "湖畔资源", "滇池、海埂公园近在身边<br>散步活动方便", "blue"],
      ["bus", "出行便利", "地铁公交覆盖<br>家属探访更轻松", "orange"],
    ],
  },
  kunmingApartment: {
    title: "昆明滇池康养公寓",
    image: "destination-city.jpg",
    position: [102.6792, 24.9528],
    tags: ["康养公寓", "滇池湖畔", "待入住"],
    rating: "4.7",
    reviews: "126条评价",
    followers: "820人关注",
    address: "云南省昆明市西山区滇池康养公寓",
    season: "7-8月清凉舒适，适合避暑旅居",
    hospital: "昆明市第一人民医院星耀医院　距离约 4.8km",
    transport: "近滇池路公交站，社区班车可预约",
    reasons: [
      ["home", "适老公寓", "无障碍动线，独立卫浴<br>管家协助入住", "green"],
      ["waves", "湖畔生活", "靠近滇池绿道<br>日常散步方便", "blue"],
      ["stethoscope", "健康支持", "定期健康巡检<br>慢病管理可对接", "orange"],
    ],
  },
  mileSpring: {
    title: "弥勒湖泉温泉度假区",
    image: "destination-lake.jpg",
    position: [103.3974, 24.3892],
    tags: ["温泉康养", "已预约", "亲水景观"],
    rating: "4.8",
    reviews: "205条评价",
    followers: "1180人关注",
    address: "云南省红河州弥勒市湖泉温泉度假区",
    season: "9-10月温泉康养体验更舒适",
    hospital: "弥勒市人民医院　距离约 3.5km",
    transport: "社区接驳车与高铁站接送可预约",
    reasons: [
      ["bath", "温泉疗养", "温泉资源稳定<br>适合放松修养", "green"],
      ["shield-check", "安全照护", "社区安防完善<br>夜间巡护覆盖", "blue"],
      ["utensils", "餐饮便利", "适老餐食可选<br>营养搭配清晰", "orange"],
    ],
  },
  tengchong: {
    title: "腾冲温泉康养基地",
    image: "destination-hot-spring.jpg",
    position: [98.4941, 25.0207],
    tags: ["温泉疗养", "空气优良", "待确认"],
    rating: "4.8",
    reviews: "165条评价",
    followers: "760人关注",
    address: "云南省保山市腾冲市温泉康养片区",
    season: "11-12月温泉疗养体验较好",
    hospital: "腾冲市人民医院　车程约 20 分钟",
    transport: "机场接驳可预约，基地内有巡回电瓶车",
    reasons: [
      ["thermometer-sun", "温泉资源", "地热温泉丰富<br>康养主题明确", "green"],
      ["trees", "空气清新", "森林覆盖率高<br>环境安静舒缓", "blue"],
      ["heart-pulse", "疗养配套", "康复理疗项目丰富<br>适合短期调养", "orange"],
    ],
  },
  dali: {
    title: "大理洱海慢居社区",
    image: "destination-dali.jpg",
    position: [100.2676, 25.6065],
    tags: ["自然风光", "文化体验", "已完成"],
    rating: "4.9",
    reviews: "312条评价",
    followers: "1320人关注",
    address: "云南省大理白族自治州大理市洱海生态廊道旁",
    season: "3-5月舒适，适合慢生活体验",
    hospital: "大理大学第一附属医院　车程约 25 分钟",
    transport: "社区接驳与环洱海公交可用",
    reasons: [
      ["mountain-snow", "风景开阔", "苍山洱海景观<br>适合放松身心", "green"],
      ["palette", "文化体验", "白族文化活动丰富<br>旅居内容充实", "blue"],
      ["coffee", "慢生活", "社区节奏舒缓<br>适合短住体验", "orange"],
    ],
  },
  puer: {
    title: "普洱森林康养社区",
    image: "destination-hero.jpg",
    position: [100.9662, 22.8252],
    tags: ["森林康养", "已完成", "空气优良"],
    rating: "4.6",
    reviews: "96条评价",
    followers: "540人关注",
    address: "云南省普洱市思茅区森林康养社区",
    season: "1-2月温润舒适，适合森林康养",
    hospital: "普洱市人民医院　车程约 16 分钟",
    transport: "社区班车连接市区，步道系统完善",
    reasons: [
      ["trees", "森林环境", "负氧离子充足<br>日常步行舒适", "green"],
      ["leaf", "茶旅体验", "茶园活动丰富<br>生活内容轻松", "blue"],
      ["home", "社区安静", "居住密度低<br>适合休养", "orange"],
    ],
  },
  fuxianhu: {
    title: "抚仙湖湖景康养公寓",
    image: "destination-detail-hero-live.jpg",
    position: [102.9088, 24.6171],
    tags: ["湖景公寓", "已完成", "安静休养"],
    rating: "4.8",
    reviews: "148条评价",
    followers: "690人关注",
    address: "云南省玉溪市澄江市抚仙湖畔康养公寓",
    season: "11-12月晴朗舒适，适合湖畔休养",
    hospital: "澄江市人民医院　车程约 15 分钟",
    transport: "湖畔接驳车与包车服务可预约",
    reasons: [
      ["waves", "湖景开阔", "临湖视野舒展<br>休养体验安静", "green"],
      ["shield-check", "照护清晰", "公寓管家值守<br>响应及时", "blue"],
      ["sun", "日照充足", "冬季晴天多<br>适合短期避寒", "orange"],
    ],
  },
  shilin: {
    title: "石林花谷旅居院落",
    image: "destination-detail-hero-clean.jpg",
    position: [103.3212, 24.8028],
    tags: ["花谷院落", "已取消", "短期体验"],
    rating: "4.5",
    reviews: "73条评价",
    followers: "410人关注",
    address: "云南省昆明市石林彝族自治县花谷旅居院落",
    season: "9月花期体验较好，适合短住",
    hospital: "石林县人民医院　车程约 12 分钟",
    transport: "县城公交可达，院落接驳需预约",
    reasons: [
      ["flower", "花谷景观", "院落花园丰富<br>适合轻度活动", "green"],
      ["users", "社交活动", "小班手作与茶话会<br>互动轻松", "blue"],
      ["calendar-days", "短住灵活", "周期安排灵活<br>适合体验型旅居", "orange"],
    ],
  },
};
let selectedDestinationKey = "mile";
let destinationReturnRoute = "destinations";
const screenReturnRoutes = {};
const SELECTED_ACTIVITY_STORAGE_KEY = "yunlv-selected-activity-id";
let selectedActivityId = localStorage.getItem(SELECTED_ACTIVITY_STORAGE_KEY) || "activity-001";
let selectedActivitySnapshot = null;
let selectedActivityDetail = null;
let userHomeApiState = null;
let userHomeApiLoading = false;
let userProfileCenterState = null;
let userProfileCenterLoading = false;
let deviceManagementState = null;
let deviceManagementLoading = false;
let profilePlansExpanded = false;
let cartCount = 0;
let shopCartItems = [];
let shopCartOpen = false;
let shopCartPointerSuppressUntil = 0;
let shopPageState = null;
let shopPageLoading = false;
let shopRequestSeq = 0;
let shopActiveFilter = "平台精选";
let shopSearchKeyword = "";
let volunteerPageState = null;
let volunteerPageLoading = false;
let volunteerRequestSeq = 0;
let messagesRead = false;
let messagesApiLoaded = false;
const MESSAGE_FILTERS = ["全部", "服务", "活动", "设备", "系统"];
const HOME_FALLBACK_QUICK_SERVICES = [
  { title: "安全守护", desc: "7×24h 守护", image: "home-icon-safety.png", route: "emergency" },
  { title: "健康服务", desc: "在线问诊", image: "home-icon-health.png", route: "health-services" },
  { title: "旅居管家", desc: "AI智能管家", image: "home-icon-assistant.png", route: "assistant" },
  { title: "政策指南", desc: "旅居政策解读", image: "home-icon-policy.png", route: "policies" },
];
const HOME_FALLBACK_FEATURE_GRID = [
  { title: "旅居目的地", desc: "精选康养地", image: "home-icon-destination.png", route: "destinations" },
  { title: "活动日历", desc: "活动早知道", image: "home-icon-calendar.png", route: "activity-calendar" },
  { title: "社群交流", desc: "结识新朋友", image: "home-icon-community.png", route: "community" },
  { title: "旅居打卡", desc: "记录美好时光", image: "home-icon-checkin.png", route: "checkin" },
  { title: "本地美食", desc: "特色美食推荐", image: "home-icon-food.png", route: "food" },
  { title: "交通出行", desc: "便捷出行服务", image: "home-icon-transport.png", route: "transport" },
  { title: "优选商城", desc: "旅居好物", image: "home-icon-shop.png", route: "shop" },
  { title: "志愿服务", desc: "爱心传递", image: "home-icon-volunteer.png", route: "volunteer" },
];
const HOME_FALLBACK_HERO_SLIDES = [
  { image: "home-hero-clean.jpg", route: "destinations", alt: "旅居生活从心出发" },
  { image: "destination-city.jpg", route: "destination-detail", detailKey: "kunming", alt: "昆明滇池旅居区" },
  { image: "activity-signup-hero-live.jpg", route: "activity-signup", alt: "活动报名" },
];
const HOME_FALLBACK_ACTIVITIES = [
  { id: "activity-001", image: "activity-taiji.jpg", title: "晨练太极 · 健康每一天", time: "05-20 07:30", location: "翠湖公园", joined: 28, quota: 50, tag: "报名中", category: "康养健身", badgeColor: "green", route: "activity-signup", apiEndpoint: "/api/activities/activity-001" },
  { id: "activity-002", image: "activity-calligraphy.jpg", title: "书画交流会", time: "05-21 14:00", location: "云旅之家活动室", joined: 16, quota: 30, tag: "热门活动", category: "文化体验", badgeColor: "orange", route: "activity-signup", apiEndpoint: "/api/activities/activity-002" },
  { id: "activity-003", image: "activity-music.jpg", title: "傍晚音乐会", time: "05-22 18:30", location: "滇池海埂公园", joined: 32, quota: 60, tag: "即将开始", category: "休闲娱乐", badgeColor: "blue", route: "activity-signup", apiEndpoint: "/api/activities/activity-003" },
];
let activeMessageFilter = initialMessageFilter();
let currentUserMessages = [];
const COMMUNITY_COMPOSE_STORAGE_KEY = "yunlv-community-compose-draft";
const DEFAULT_COMMUNITY_COMPOSE_DRAFT = {
  groupId: "",
  group: "湖泉晨练群",
  content: "",
  imageAdded: false,
  publicVisible: true,
  syncFamily: false,
  allowComments: true,
  savedAt: "",
};
let communityComposeDraft = loadCommunityComposeDraft();
let serviceRecordsCleared = false;
let serviceRecordsPageState = null;
let serviceRecordsActiveFilter = "全部";
let serviceRecordsMonthFilter = "";
let serviceRecordsSearchQuery = "";
let serviceRecordsRequestSeq = 0;
let serviceRecordsLoading = false;
let serviceRecordsSearchTimer = null;
const ACTIVITY_CALENDAR_REMINDER_STORAGE_KEY = "yunlv-activity-calendar-reminder";
const ACTIVITY_CALENDAR_FILTER_STORAGE_KEY = "yunlv-activity-calendar-filter";
const ACTIVITY_CALENDAR_FILTERS = ["全部", "文化体验", "康养健身", "休闲娱乐", "自然观光", "学习讲座"];
let calendarMonthOffset = 0;
let calendarSelectedDateKey = "";
let calendarReminderEnabled = localStorage.getItem(ACTIVITY_CALENDAR_REMINDER_STORAGE_KEY) !== "off";
let activityCalendarPageState = null;
let activityCalendarLoading = false;
let activityCalendarRequestSeq = 0;
let activityCalendarActiveFilter = localStorage.getItem(ACTIVITY_CALENDAR_FILTER_STORAGE_KEY) || "全部";
if (!ACTIVITY_CALENDAR_FILTERS.includes(activityCalendarActiveFilter)) activityCalendarActiveFilter = "全部";
let selectedPolicy = null;
const POLICY_FILTERS = ["全部", "医保报销", "老年优待", "居住服务", "交通出行", "安全提醒"];
let policyActiveFilter = "全部";
let policySearchQuery = "";
let policySearchComposing = false;
let transportDestination = localStorage.getItem("yunlv_transport_destination") || "";
let transportPageState = null;
let transportPageLoading = false;
let transportRequestSeq = 0;
const ROBOT_LANGUAGE_OPTIONS = ["普通话", "云南方言", "四川话", "粤语"];
const ROBOT_LANGUAGE_STORAGE_KEY = "yunlv-robot-language";
let robotLanguage = localStorage.getItem(ROBOT_LANGUAGE_STORAGE_KEY) || ROBOT_LANGUAGE_OPTIONS[0];
if (!ROBOT_LANGUAGE_OPTIONS.includes(robotLanguage)) robotLanguage = ROBOT_LANGUAGE_OPTIONS[0];
let robotLanguagePanelOpen = false;
const DESTINATION_FILTERS = ["全部", "气候宜人", "医疗便利", "湖泉康养", "文化体验"];
let activeDestinationFilter = DESTINATION_FILTERS[0];
let destinationsPageState = null;
let destinationsLoading = false;
let destinationsRequestSeq = 0;
let destinationSearchQuery = "";
let destinationSearchTimer = null;
let destinationDetailState = null;
let destinationDetailLoading = false;
const COMMUNITY_FILTERS = ["推荐", "同城", "活动群", "兴趣圈", "家属圈"];
let activeCommunityFilter = COMMUNITY_FILTERS[0];
let communityPageState = null;
let communityPageLoading = false;
let communityRequestSeq = 0;
const DESTINATION_FAVORITES_STORAGE_KEY = "yunlv-destination-favorites";
let destinationFavorites = loadDestinationFavorites();
const PERSONAL_AVATAR_STORAGE_KEY = "yunlv-personal-avatar";
const PERSONAL_AVATAR_MAX_EDGE = 360;
const PERSONAL_AVATAR_MAX_STORAGE_CHARS = 600000;
const PERSONAL_AVATAR_QUALITY = 0.82;
let personalAvatar = loadStoredPersonalAvatar();
let userPersonalState = null;
let userPersonalLoading = false;
let healthRecordState = null;
let healthRecordLoading = false;
let healthServicesState = null;
let healthServicesLoading = false;
let healthServicesActiveCategory = "全部";
let foodPageState = null;
let foodPageLoading = false;
let activeFoodCategory = "全部";
let foodRequestSeq = 0;
let familyPageState = null;
let familyPageLoading = false;
let contactsPageState = null;
let contactsPageLoading = false;
let userGuidePageState = null;
let userGuidePageLoading = false;
const DEFAULT_FAMILY_CONTACTS = [
  { id: "contact-001", name: "张小红", relation: "女儿", status: "默认联系人", image: "avatar-daughter.jpg", phone: "13900001234", scopes: ["健康摘要", "异常提醒", "订单进度"] },
  { id: "contact-002", name: "张小明", relation: "儿子", status: "", image: "avatar-son.jpg", phone: "13800004321", scopes: ["SOS通知", "位置查看"] },
];
let familyContacts = DEFAULT_FAMILY_CONTACTS.map((item) => ({ ...item, scopes: [...item.scopes] }));
let emergencyPageState = null;
let emergencyPageLoading = false;
let emergencySosConfirmUntil = 0;
let assistantSuggestionBatch = 0;
let assistantCurrentQuestion = "昆明现在适合旅居吗？天气如何？";
let assistantBackendAnswer = "";
let assistantAnswerRevision = 0;
let assistantKeyboardMode = false;
let assistantVoiceListening = false;
let assistantVoiceRecognition = null;
let assistantVoiceStopping = false;
let assistantVoiceWaitTimer = null;
let assistantVoiceTranscript = "";
let assistantVoiceLastError = "";
const assistantFeedback = {
  like: { active: false, count: 12 },
  useful: { active: false, count: 8 },
};
let statusTimer = null;

try {
  shopCartItems = JSON.parse(localStorage.getItem("yunlv-shop-cart") || "[]");
  cartCount = shopCartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
} catch (error) {
  shopCartItems = [];
  cartCount = 0;
}
try {
  const cachedFamilyContacts = JSON.parse(localStorage.getItem("yunlv-family-contacts") || "[]");
  if (Array.isArray(cachedFamilyContacts) && cachedFamilyContacts.length) familyContacts = cachedFamilyContacts;
} catch (error) {
  familyContacts = DEFAULT_FAMILY_CONTACTS.map((item) => ({ ...item, scopes: [...item.scopes] }));
}
const FALLBACK_BATTERY_STATUS = { level: 1, charging: false, fallback: true };
const CURRENT_CITY_STORAGE_KEY = "yunlv-current-city";
let batteryStatus = FALLBACK_BATTERY_STATUS;
let statusRuntimeReady = false;
let currentCity = localStorage.getItem(CURRENT_CITY_STORAGE_KEY) || "定位中";
let currentLocation = null;
let currentLocationRuntime = null;
let checkinPhotoTrigger = null;
let checkinPageState = null;
let checkinPageLoading = false;
let activeCheckinFilter = "全部";
let checkinRequestSeq = 0;
let citySearchQuery = "";
let activeCityIndex = "热门";
let geolocationStarted = false;
let locationPromise = null;
let amapLoaderPromise = null;
let amapMap = null;
let amapMapContainer = null;
let amapMarkerRecords = [];
let amapUserMarker = null;
let activityMapActiveFilter = "全部";
let activityMapFocusEventTitle = "";
let activityMapMode = "";
let activityMapSnapshotPoint = null;
let activityMapRequirementsState = null;
let activityMapApiPoints = [];
let sosRecordActiveFilter = "全部";
let orderActiveFilter = "全部";
let orderProviderFilter = "";
let orderSearchQuery = "";
let ordersPageState = null;
let ordersPageLoading = false;
let orderRequestSeq = 0;
let orderSearchTimer = null;
let activityRecordActiveFilter = "全部";
let activityRecordPageState = null;
let activityRecordLoading = false;
let activityRecordRequestSeq = 0;
let homeHeroTimer = null;
const USER_SETTINGS_STORAGE_KEY = "yunlv-user-settings";
const DEFAULT_USER_SETTINGS = {
  accountNotifications: true,
  serviceNotifications: true,
  familyCareReminder: true,
  soundReminder: false,
  elderMode: false,
  fontSize: "大",
  cacheSize: "28.6MB",
};
let userSettings = loadUserSettings();

function asset(name) {
  return `${A}${name}?v=${ASSET_VERSION}`;
}

function userAssetSrc(value, fallback = "") {
  const raw = String(value || fallback || "").trim();
  if (!raw) return "";
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  const clean = raw.split("?")[0];
  const userAssetMatch = clean.match(/^\/user\/assets\/(.+)$/);
  const relativeAssetMatch = clean.match(/^\.?\/?assets\/(.+)$/);
  if (userAssetMatch || relativeAssetMatch) return asset(userAssetMatch?.[1] || relativeAssetMatch?.[1]);
  if (raw.startsWith("/")) return raw;
  return asset(raw);
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

function safeCallPhone(phone) {
  if (!phone) return;
  if (isMobileDevice()) {
    window.location.href = `tel:${phone}`;
  } else {
    const statusEl = document.querySelector(".action-status:not([hidden])") || document.querySelector("[data-amap-status]");
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = `请拨打电话：${phone}（当前设备不支持直接拨号）`;
      window.setTimeout(() => { statusEl.textContent = ""; }, 6000);
    } else {
      alert(`请拨打电话：${phone}`);
    }
  }
}

function attr(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function loadUserSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(USER_SETTINGS_STORAGE_KEY) || "{}");
    return { ...DEFAULT_USER_SETTINGS, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch (error) {
    return { ...DEFAULT_USER_SETTINGS };
  }
}

function saveUserSettings() {
  localStorage.setItem(USER_SETTINGS_STORAGE_KEY, JSON.stringify(userSettings));
}

function settingsControlKey(title, desc = "") {
  if (title === "消息通知" && desc) return "serviceNotifications";
  if (title === "消息通知") return "accountNotifications";
  if (title === "家属关怀提醒") return "familyCareReminder";
  if (title === "声音提醒") return "soundReminder";
  if (title === "适老模式") return "elderMode";
  return "";
}

function settingsSwitch(key) {
  return `<span class="switch ${userSettings[key] ? "on" : ""}" aria-hidden="true"></span>`;
}

function settingValueText(key) {
  if (key === "elderMode") return userSettings.elderMode ? "已开启" : "未开启";
  if (key === "cacheSize") return userSettings.cacheSize;
  return "";
}

function detailAttrs(key = "mile", returnRoute = "destinations") {
  return ` data-detail-key="${attr(key)}" data-return-route="${attr(returnRoute)}"`;
}

function destinationFromPageState(id) {
  const key = String(id || "");
  return (destinationsPageState?.destinations || []).find((destination) => String(destination.id) === key) || null;
}

function rememberDestinationDetail(source) {
  const key = source?.dataset?.destinationId || source?.dataset?.detailKey || "mile";
  const exists = destinationDetails[key] || destinationFromPageState(key);
  if (key !== selectedDestinationKey) destinationDetailState = null;
  selectedDestinationKey = exists ? key : "mile";
  destinationReturnRoute = routeMap[source?.dataset?.returnRoute] ? source.dataset.returnRoute : "destinations";
}

function normalizeDestinationReason(reason) {
  if (Array.isArray(reason)) return reason;
  return [
    reason?.iconName || "leaf",
    reason?.title || "推荐理由",
    reason?.desc || reason?.text || "已更新目的地推荐理由",
    reason?.color || "green",
  ];
}

function reviewText(value, fallback = "236条评价") {
  if (value === undefined || value === null || value === "") return fallback;
  const raw = String(value);
  return /评价/.test(raw) ? raw : `${raw}条评价`;
}

function followerText(value, fallback = "980人关注") {
  if (value === undefined || value === null || value === "") return fallback;
  const raw = String(value);
  return /关注/.test(raw) ? raw : `${raw}人关注`;
}

function normalizeDestinationDetailData(destination = {}, fallbackKey = selectedDestinationKey) {
  const fallback = destinationDetails[fallbackKey] || destinationDetails.mile;
  const id = destination.id || fallbackKey || "mile";
  return {
    ...fallback,
    ...destination,
    id,
    key: id,
    title: destination.title || destination.name || fallback.title,
    image: destination.image || fallback.image || "destination-detail-hero-live.jpg",
    position: destination.position || fallback.position,
    tags: Array.isArray(destination.tags) && destination.tags.length ? destination.tags : fallback.tags,
    rating: String(destination.rating || fallback.rating || "4.8"),
    reviews: reviewText(destination.reviews, fallback.reviews),
    followers: followerText(destination.followers, fallback.followers),
    address: destination.address || fallback.address || "",
    season: destination.season || fallback.season || "",
    hospital: destination.hospital || fallback.hospital || "",
    transport: destination.transport || fallback.transport || "",
    reasons: (Array.isArray(destination.reasons) && destination.reasons.length ? destination.reasons : fallback.reasons).map(normalizeDestinationReason),
    favorite: destination.favorite,
    detailEndpoint: destination.detailEndpoint || `/api/user/destinations/${encodeURIComponent(id)}`,
    favoriteEndpoint: destination.favoriteEndpoint || `/api/user/destinations/${encodeURIComponent(id)}/favorite`,
    consultEndpoint: destination.consultEndpoint || `/api/user/destinations/${encodeURIComponent(id)}/consult`,
  };
}

function activeDestinationDetail() {
  const detail = destinationDetailState?.destination?.id === selectedDestinationKey ? destinationDetailState.destination : destinationFromPageState(selectedDestinationKey);
  return normalizeDestinationDetailData(detail || destinationDetails[selectedDestinationKey] || destinationDetails.mile, selectedDestinationKey);
}

function currentHomeRequirements() {
  return userHomeApiState?.homeRequirements || null;
}

function normalizeHomeRoute(route, fallback = "home") {
  const normalized = normalizeUserRouteId(route || fallback);
  return routeMap[normalized] ? normalized : fallback;
}

function homeEndpointAttr(item = {}) {
  return item.apiEndpoint ? ` data-api-endpoint="${attr(item.apiEndpoint)}"` : "";
}

function homeEntryList(apiItems, fallbackItems) {
  const source = Array.isArray(apiItems) && apiItems.length ? apiItems : fallbackItems;
  return source.map((item, index) => {
    const fallback = fallbackItems[index] || {};
    return {
      ...fallback,
      ...item,
      title: String(item?.title || fallback.title || ""),
      desc: String(item?.desc || fallback.desc || ""),
      image: item?.image || fallback.image || "",
      route: normalizeHomeRoute(item?.route || fallback.route, fallback.route || "home"),
      apiEndpoint: item?.apiEndpoint || fallback.apiEndpoint || "",
    };
  });
}

function homeQuickServices() {
  return homeEntryList(currentHomeRequirements()?.quickServices, HOME_FALLBACK_QUICK_SERVICES);
}

function homeFeatureGridData() {
  return homeEntryList(currentHomeRequirements()?.featureGrid, HOME_FALLBACK_FEATURE_GRID);
}

function homeHeroSlidesData() {
  const slides = HOME_FALLBACK_HERO_SLIDES.map((slide) => ({ ...slide }));
  const banner = currentHomeRequirements()?.banner || {};
  if (banner.image || banner.title || banner.slogan) {
    slides[0] = {
      ...slides[0],
      image: banner.image || slides[0].image,
      alt: banner.title || banner.slogan || slides[0].alt,
      title: banner.title || "",
      slogan: banner.slogan || "",
      apiEndpoint: banner.adminEndpoint || "/api/user/home-requirements",
    };
  }
  const firstActivity = homeActivityRecommendations()[0];
  if (firstActivity) {
    slides.forEach((slide) => {
      if (slide.route === "activity-signup") slide.activityId = firstActivity.id;
    });
  }
  return slides;
}

function homeActivityStatusColor(status = "", fallback = "green") {
  if (/热门|紧俏|推荐/.test(status)) return "orange";
  if (/即将|开始|预告/.test(status)) return "blue";
  if (/满|截止|取消|下线/.test(status)) return "red";
  return fallback || "green";
}

function normalizeHomeActivity(item = {}, fallback = {}) {
  const id = String(item.id || fallback.id || selectedActivityId || "activity-001");
  const tag = String(item.tag || item.status || fallback.tag || "报名中");
  const joined = Number(item.joined ?? item.participantCount ?? fallback.joined ?? 0);
  const quota = Number(item.quota ?? fallback.quota ?? 0);
  return {
    ...fallback,
    ...item,
    id,
    title: String(item.title || fallback.title || "活动报名"),
    image: item.image || item.cover || fallback.image || fallback.cover || "activity-taiji.jpg",
    time: String(item.time || fallback.time || ""),
    location: String(item.location || item.place || fallback.location || fallback.place || ""),
    joined: Number.isFinite(joined) ? joined : 0,
    quota: Number.isFinite(quota) ? quota : 0,
    tag,
    status: String(item.status || tag),
    category: String(item.category || fallback.category || "活动"),
    route: normalizeHomeRoute(item.route || fallback.route || "activity-signup", "activity-signup"),
    apiEndpoint: item.apiEndpoint || `/api/activities/${encodeURIComponent(id)}`,
    badgeColor: item.badgeColor || item.statusColor || fallback.badgeColor || homeActivityStatusColor(tag, fallback.badgeColor),
    userJoined: item.userJoined !== undefined ? Boolean(item.userJoined) : Boolean(fallback.userJoined),
    availableSlots: Number(item.availableSlots ?? Math.max(0, (Number.isFinite(quota) ? quota : 0) - (Number.isFinite(joined) ? joined : 0))),
  };
}

function homeActivityRecommendations() {
  const requirements = currentHomeRequirements();
  const recommendationItems = requirements?.activityRecommendation?.items;
  const apiActivities = Array.isArray(userHomeApiState?.activities) ? userHomeApiState.activities : [];
  const activityById = new Map(apiActivities.map((item) => [String(item.id), item]));
  const source = Array.isArray(recommendationItems) && recommendationItems.length ? recommendationItems : apiActivities;
  const list = source.length ? source : HOME_FALLBACK_ACTIVITIES;
  return list.map((item, index) => {
    const full = activityById.get(String(item.id)) || {};
    const fallback = HOME_FALLBACK_ACTIVITIES[index] || HOME_FALLBACK_ACTIVITIES[0];
    return normalizeHomeActivity({ ...full, ...item, image: item.image || item.cover || full.cover || full.image }, fallback);
  });
}

function homeActivityById(id) {
  const target = String(id || "");
  return homeActivityRecommendations().find((activity) => activity.id === target) || null;
}

function rememberActivityDetail(source) {
  const carrier = source?.dataset?.activityId ? source : source?.closest?.("[data-activity-id]");
  const id = String(carrier?.dataset?.activityId || selectedActivityId || HOME_FALLBACK_ACTIVITIES[0].id);
  if (id !== selectedActivityId) selectedActivityDetail = null;
  selectedActivityId = id;
  localStorage.setItem(SELECTED_ACTIVITY_STORAGE_KEY, selectedActivityId);
  selectedActivitySnapshot = homeActivityById(id) || normalizeHomeActivity({
    id,
    title: carrier?.dataset?.activityTitle,
    time: carrier?.dataset?.activityTime,
    location: carrier?.dataset?.activityLocation,
    image: carrier?.dataset?.activityImage,
    tag: carrier?.dataset?.activityStatus,
    category: carrier?.dataset?.activityCategory,
  }, HOME_FALLBACK_ACTIVITIES[0]);
}

function activeActivityData() {
  const base = homeActivityById(selectedActivityId) || selectedActivitySnapshot || HOME_FALLBACK_ACTIVITIES[0];
  const detail = selectedActivityDetail?.id === selectedActivityId ? selectedActivityDetail : {};
  return normalizeHomeActivity({
    ...base,
    ...detail,
    image: detail.cover || detail.image || base.image,
    tag: detail.status || base.tag,
  }, HOME_FALLBACK_ACTIVITIES[0]);
}

function loadDestinationFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(DESTINATION_FAVORITES_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((key) => typeof key === "string" && key.trim()) : [];
  } catch (error) {
    return [];
  }
}

function syncDestinationFavorites() {
  localStorage.setItem(DESTINATION_FAVORITES_STORAGE_KEY, JSON.stringify(destinationFavorites));
}

function isDestinationFavorited(key = selectedDestinationKey) {
  const stateDestination = destinationDetailState?.destination?.id === key ? destinationDetailState.destination : destinationFromPageState(key);
  if (stateDestination?.favorite !== undefined) return Boolean(stateDestination.favorite);
  return destinationFavorites.includes(key);
}

function destinationFavoriteLabel(actionName, favorited) {
  if (actionName === "关注目的地") return favorited ? "已关注" : "关注";
  if (actionName === "加入收藏") return favorited ? "已收藏" : "加入收藏";
  return favorited ? "已收藏" : "收藏";
}

function destinationFavoriteIconSize(actionName) {
  return actionName === "关注目的地" ? 16 : 18;
}

function destinationFavoriteButtonContent(actionName, favorited) {
  return `<span class="ref-destination-favorite-icon" aria-hidden="true">${icon("heart", destinationFavoriteIconSize(actionName))}</span><span class="ref-destination-favorite-label">${destinationFavoriteLabel(actionName, favorited)}</span>`;
}

function shouldRememberScreenReturn(target, source) {
  if (!routeMap[target] || target === "home" || target === currentId()) return false;
  if (source?.getAttribute?.("aria-label") === "返回") return false;
  if (source?.closest?.('button[aria-label="返回"], .screen-rail, #screenNav, #mobileSwitcher')) return false;
  return true;
}

function rememberScreenReturn(target, source) {
  if (!shouldRememberScreenReturn(target, source)) return;
  const explicitReturn = source?.dataset?.returnRoute;
  const fallbackReturn = currentId();
  const nextReturn = routeMap[explicitReturn] ? explicitReturn : routeMap[fallbackReturn] ? fallbackReturn : "home";
  screenReturnRoutes[target] = nextReturn === target ? "home" : nextReturn;
}

function screenBackRoute(screen) {
  return screenReturnRoutes[screen.id] || "home";
}

function currentId() {
  return normalizeUserRouteId(window.location.hash) || "home";
}

function setRoute(id) {
  const normalized = normalizeUserRouteId(id);
  if (!normalized) {
    showToast("用户端导航目标无效");
    return false;
  }
  if (currentId() === normalized) {
    render();
    return true;
  }
  window.location.hash = normalized;
  return true;
}

function refreshCurrentRouteFromControl(source, routeId) {
  const normalized = normalizeUserRouteId(routeId);
  if (!normalized || currentId() !== normalized) return false;
  if (normalized === "profile") userProfileCenterState = null;
  render();
  const screenNode = document.querySelector(`.screen-${CSS.escape(normalized)}`);
  const content = screenNode?.querySelector(".content") || document.querySelector(".content");
  const focusTarget = screenNode?.querySelector(".app-title") || content || screenNode;
  const scrollHost = content || document.scrollingElement || document.documentElement;
  if (scrollHost) {
    if (typeof scrollHost.scrollTo === "function") scrollHost.scrollTo({ top: 0, behavior: "smooth" });
    else scrollHost.scrollTop = 0;
  }
  if (focusTarget) {
    focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
  }
  screenNode?.setAttribute("data-route-refreshed", String(userInteractionAuditSeq));
  recordUserInteraction(`刷新当前页面：${normalized}`, source, { kind: "same-route-refresh", to: normalized });
  return true;
}

function normalizeCityName(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const yunnanPrefectureAlias = {
    楚雄彝族自治州: "楚雄",
    红河哈尼族彝族自治州: "红河",
    文山壮族苗族自治州: "文山",
    西双版纳傣族自治州: "西双版纳",
    大理白族自治州: "大理",
    德宏傣族景颇族自治州: "德宏",
    怒江傈僳族自治州: "怒江",
    迪庆藏族自治州: "迪庆",
  }[text];
  if (yunnanPrefectureAlias) return yunnanPrefectureAlias;
  return text
    .replace(/(特别行政区|自治州|地区|盟|市|县|区|省)$/u, "")
    .replace(/^(中国|中华人民共和国)/u, "")
    .trim();
}

function splitCityDisplayName(value) {
  const city = String(value || "").trim();
  const match = city.match(/^(.+?)(?:（(.+?)）|\\((.+?)\\))$/u);
  if (!match) return { main: city, sub: "" };
  return { main: match[1], sub: match[2] || match[3] || "" };
}

function homeCityDisplay(value) {
  const { main, sub } = splitCityDisplayName(value || DEFAULT_CITY);
  return `
    <b data-current-city-main>${attr(main || DEFAULT_CITY)}</b>
    <em data-current-city-sub ${sub ? "" : "hidden"}>${attr(sub)}</em>
  `;
}

function updateCurrentCity(city) {
  const normalized = normalizeCityName(city) || DEFAULT_CITY;
  const { main, sub } = splitCityDisplayName(normalized);
  currentCity = normalized;
  selectedPolicy = null;
  localStorage.setItem(CURRENT_CITY_STORAGE_KEY, normalized);
  document.querySelectorAll("[data-current-city]").forEach((node) => {
    node.textContent = normalized;
  });
  document.querySelectorAll("[data-current-city-main]").forEach((node) => {
    node.textContent = main || normalized;
  });
  document.querySelectorAll("[data-current-city-sub]").forEach((node) => {
    node.textContent = sub;
    node.hidden = !sub;
  });
}

async function syncCurrentCityToApi(city) {
  if (!window.YunlvBusiness?.request) return null;
  try {
    return await window.YunlvBusiness.request("/api/user/home-city", {
      method: "POST",
      body: { city: normalizeCityName(city) || DEFAULT_CITY },
    });
  } catch (error) {
    console.warn("sync current city failed", error);
    return null;
  }
}

function updateCurrentLocation(position, city = "") {
  if (Array.isArray(position) && Number.isFinite(position[0]) && Number.isFinite(position[1])) {
    currentLocation = position;
  }
  if (city) updateCurrentCity(city);
  if (amapMap && currentLocation) {
    amapMap.setCenter(currentLocation);
    renderAmapUserMarker();
  }
}

function loadAmap() {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (amapLoaderPromise) return amapLoaderPromise;

  window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_JS_CODE };
  amapLoaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.dataset.amapJsapi = "true";
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(AMAP_KEY)}&plugin=${AMAP_PLUGINS.join(",")}`;
    script.async = true;
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error("高德地图加载超时（10s）"));
    }, 10000);
    script.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error("高德地图加载失败"));
      }
    };
    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      reject(new Error("高德地图脚本加载失败"));
    };
    document.head.appendChild(script);
  }).catch((err) => {
    amapLoaderPromise = null;
    throw err;
  });
  return amapLoaderPromise;
}

function ensureAmapPlugins(plugins = AMAP_PLUGINS) {
  return loadAmap().then((AMap) => new Promise((resolve) => {
    if (!AMap.plugin) {
      resolve(AMap);
      return;
    }
    AMap.plugin(plugins, () => resolve(AMap));
  }));
}

function extractAmapCity(result) {
  const component = result?.addressComponent || result?.regeocode?.addressComponent || {};
  const city = Array.isArray(component.city) ? component.city[0] : component.city;
  return normalizeCityName(city || component.province || result?.city || result?.province);
}

function reverseGeocodeCity(position, AMapRef = window.AMap) {
  if (!position || !AMapRef?.Geocoder) return Promise.resolve("");
  return new Promise((resolve) => {
    const geocoder = new AMapRef.Geocoder({ city: "全国" });
    geocoder.getAddress(position, (status, result) => {
      resolve(status === "complete" ? extractAmapCity(result) : "");
    });
  });
}

function locateCityByIp(AMapRef = window.AMap) {
  return new Promise((resolve) => {
    if (!AMapRef?.CitySearch) {
      locateCityByRestIp().then(resolve);
      return;
    }
    const citySearch = new AMapRef.CitySearch();
    citySearch.getLocalCity((status, result) => {
      const city = status === "complete" ? normalizeCityName(result?.city || result?.province) : "";
      let position = currentLocation;
      const center = result?.bounds?.getCenter?.();
      if (center) position = [center.lng, center.lat];
      if (city) updateCurrentLocation(position, city);
      if (city) {
        resolve({ city, position, source: "ip" });
        return;
      }
      locateCityByRestIp().then(resolve);
    });
  });
}

async function locateCityByRestIp() {
  try {
    const response = await fetch(`https://restapi.amap.com/v3/ip?key=${encodeURIComponent(AMAP_KEY)}&output=json`, { cache: "no-store" });
    const data = await response.json();
    const city = normalizeCityName(Array.isArray(data.city) ? data.city[0] : data.city || data.province);
    const rectangle = typeof data.rectangle === "string" ? data.rectangle.split(";")[0]?.split(",").map(Number) : null;
    const position = rectangle && rectangle.length === 2 && rectangle.every(Number.isFinite) ? rectangle : currentLocation;
    if (city) updateCurrentLocation(position, city);
    return { city, position, source: city ? "ip" : "unavailable" };
  } catch (error) {
    return { city: "", position: currentLocation, source: "unavailable", error };
  }
}

function locateByBrowserGps(AMapRef = window.AMap) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("当前浏览器不支持 GPS 定位"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        const rawPosition = [geo.coords.longitude, geo.coords.latitude];
        const finish = (position) => {
          reverseGeocodeCity(position, AMapRef).then((city) => {
            if (city) updateCurrentLocation(position, city);
            resolve({ city: city || currentCity, position, source: "gps", accuracy: geo.coords.accuracy });
          });
        };
        if (AMapRef?.convertFrom) {
          AMapRef.convertFrom(rawPosition, "gps", (status, result) => {
            const point = status === "complete" && result?.locations?.[0] ? result.locations[0] : null;
            finish(point ? [point.lng, point.lat] : rawPosition);
          });
        } else {
          finish(rawPosition);
        }
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  });
}

function currentLocationFallback(source = "fallback") {
  const city = currentCity && currentCity !== "定位中" ? currentCity : DEFAULT_CITY;
  const position = Array.isArray(currentLocation) ? currentLocation : DEFAULT_CENTER;
  return { city, position, source };
}

function requestCurrentLocation(force = false) {
  if (geolocationStarted && !force && locationPromise) return locationPromise;
  geolocationStarted = true;
  locationPromise = withTimeout(ensureAmapPlugins(), 2500, null).then(async (AMap) => {
    const gpsResult = await withTimeout(locateByBrowserGps(AMap || null), 2800, null);
    if (gpsResult) return gpsResult;
    if (!AMap) return currentLocationFallback("gps-unavailable");
    if (!AMap.Geolocation) return withTimeout(locateCityByIp(AMap), 1800, currentLocationFallback("ip-timeout"));

    const amapResult = await withTimeout(new Promise((resolve) => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 5000,
        convert: true,
        showButton: false,
        showMarker: false,
      });
      geolocation.getCurrentPosition((status, result) => {
        if (status === "complete" && result?.position) {
          const position = [result.position.lng, result.position.lat];
          const city = extractAmapCity(result);
          updateCurrentLocation(position, city);
          if (city) {
            resolve({ city, position, source: "amap" });
          } else {
            reverseGeocodeCity(position, AMap).then((reversedCity) => {
              if (reversedCity) updateCurrentCity(reversedCity);
              resolve({ city: reversedCity || currentCity, position, source: "amap" });
            });
          }
          return;
        }
        locateCityByIp(AMap).then(resolve);
      });
    }), 2800, null);

    return amapResult || currentLocationFallback("location-timeout");
  }).catch((error) => ({ ...currentLocationFallback("failed"), error }));
  return locationPromise;
}

function isSecureLocationOrigin() {
  return location.protocol === "https:" || ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
}

function initLocationRuntime(force = false) {
  if (!force && geolocationStarted) return locationPromise;
  return requestCurrentLocation(force).then((result) => {
    currentLocationRuntime = result || currentLocationFallback("unavailable");
    if (currentId() === "activity-map") {
      renderAmapUserMarker();
      if (amapMap && currentLocation) fitAmapView();
    }
    if (currentId() === "emergency") render();
    return currentLocationRuntime;
  });
}

function statusBar() {
  return `
    <div class="statusbar" aria-label="系统状态栏预览">
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
  const hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
}

function formatRecentDataUpdateTime(minutesAgo = 30) {
  const now = new Date();
  const date = new Date(now.getTime() - Math.max(1, minutesAgo) * 60 * 1000);
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const sameDay = date.toDateString() === now.toDateString();
  return `${sameDay ? "今日" : "昨日"} ${hour}:${minute}`;
}

function syncStatusBar() {
  document.querySelectorAll("[data-status-time]").forEach((time) => {
    time.textContent = formatStatusTime();
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
      source.fallback ? "电池图标（浏览器暂未提供电量）" : `电量 ${Math.round(level * 100)}%${source.charging ? "，充电中" : ""}`
    );
  });
}

function initStatusRuntime() {
  if (statusRuntimeReady) return;
  statusRuntimeReady = true;
  statusTimer = window.setInterval(syncStatusBar, 30 * 1000);
  window.addEventListener("online", syncStatusBar);
  window.addEventListener("offline", syncStatusBar);

  const connection = statusConnection();
  if (connection?.addEventListener) connection.addEventListener("change", syncStatusBar);

  if (navigator.getBattery) {
    navigator.getBattery().then((battery) => {
      batteryStatus = battery;
      ["chargingchange", "levelchange"].forEach((eventName) => {
        battery.addEventListener(eventName, syncStatusBar);
      });
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

function appBar(screen) {
  if (screen.id === "profile") {
    return `
      <div class="appbar profile-appbar">
        <span></span>
        <span></span>
        <button class="icon-btn" data-route="messages" type="button" aria-label="消息">${icon("bell", 25)}</button>
      </div>
    `;
  }

  if (screen.home) {
    return `
      <div class="appbar home">
        <div class="home-brand">
          <img class="home-logo-ref" src="${asset("home-logo-ref.png")}" alt="" />
          <div>
            <h1>云旅无忧</h1>
            <p>旅居生活 · 安心无忧</p>
          </div>
        </div>
        <button class="city-pill" data-route="city" type="button">
          <span><small>当前城市</small>${homeCityDisplay(currentCity || DEFAULT_CITY)}</span>
          ${icon("chevron-down", 18)}
        </button>
        <button class="icon-btn" data-route="messages" type="button" aria-label="消息">${icon("bell", 24)}</button>
      </div>
    `;
  }

  if (screen.id === "guide-detail") {
    const guideBackRoute = screenBackRoute(screen);
    return `
      <div class="appbar guide-detail-appbar">
        <button class="icon-btn" data-route="${guideBackRoute}" type="button" aria-label="返回">${icon("chevron-left", 24)}</button>
        <div class="app-title">${screen.title}</div>
        <div class="guide-detail-actions">
          <button data-action="分享向导" type="button">${icon("share-2", 18)}<span>分享</span></button>
          <button data-action="收藏向导" type="button">${icon("heart", 18)}<span>收藏</span></button>
        </div>
      </div>
    `;
  }

  const rawAction = screen.action || "";
  const action = screen.id === "messages" && messagesRead ? "已读" : rawAction;
  const actionIcon = screen.actionIcon ? icon(screen.actionIcon, 17) : "";
  const actionRoute = screen.actionRoute ? ` data-route="${screen.actionRoute}"` : ` data-action="${rawAction || screen.actionIcon || "screen-action"}"`;
  const localAction = (screen.id === "community" && rawAction === "发布") || (screen.id === "device-management" && rawAction === "添加设备") ? ' data-local-action="true"' : "";
  const backRoute = screenBackRoute(screen);
  return `
    <div class="appbar">
      ${screen.noBack ? "<span></span>" : `<button class="icon-btn" data-route="${backRoute}" type="button" aria-label="返回">${icon("chevron-left", 24)}</button>`}
      <div class="app-title">${screen.title}${screen.id === "robot" ? `<span class="app-title-status">${icon("shield-check", 12)}在线</span>` : ""}${screen.subtitle ? `<span class="app-subtitle">${screen.subtitle}</span>` : ""}</div>
      ${action || actionIcon ? `<button class="app-action ${action ? "text" : ""}"${actionRoute}${localAction} type="button">${actionIcon}${action ? `<span>${action}</span>` : ""}</button>` : "<span></span>"}
    </div>
  `;
}

function bottomTabs(active = "", screen = null) {
  const discoverLabel = screen?.id === "devices" ? "旅居管家" : "发现";
  const discoverRoute = screen?.id === "devices" ? "assistant" : "activity-map";
  const tabs = [
    ["home", "home", "首页", "home"],
    ["discover", "compass", discoverLabel, discoverRoute],
    ["consult", "headphones", "人工向导", "guide"],
    ["messages", "message-circle", "消息", "messages"],
    ["profile", "user", "我的", "profile"],
  ];

  return `
    <div class="bottom-tabs">
      ${tabs.map(([key, iconName, label, route]) => `
        <button class="tab ${key === active && (key !== "consult" || ["assistant", "guide"].includes(screen?.id)) ? "active" : ""} ${key === "consult" ? "consult" : ""}" data-user-tab="${key}" data-route="${route}" type="button">
          ${key === "consult" ? `<span class="tab-bubble">${icon(iconName, 28)}</span>` : icon(iconName, 25)}
          <span>${label}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function icon(name, size = 20) {
  const inline = {
    home: '<path d="M3 11.5 12 3l9 8.5"/><path d="M5 10.8V21h5v-6h4v6h5V10.8"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.2 8.8-2.1 5.3-5.3 2.1 2.1-5.3z"/>',
    "message-circle": '<path d="M21 11.5a8.4 8.4 0 0 1-8.7 8.4 9 9 0 0 1-4.1-.9L3 21l1.7-5A8.2 8.2 0 0 1 3.5 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4.3 4-6.5 7.5-6.5s6.7 2.2 7.5 6.5"/>',
    ambulance: '<path d="M10 17h4V5H3v12h2"/><path d="M14 8h4l3 3v6h-3"/><path d="M6 17a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M16 17a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M6 9h4"/><path d="M8 7v4"/>',
    "shield-alert": '<path d="M12 3l7 3v5c0 5-3.5 8.2-7 10c-3.5-1.8-7-5-7-10V6l7-3z"/><path d="M12 8v5"/><path d="M12 16h.01"/>',
    "shield-user": '<path d="M12 3l7 3v5c0 5-3.5 8.2-7 10c-3.5-1.8-7-5-7-10V6l7-3z"/><circle cx="12" cy="10" r="2.2"/><path d="M8.5 16c.7-2 5.3-2 6 0"/>',
    "user-heart": '<circle cx="10" cy="7" r="3"/><path d="M3.5 20c.8-4 4-6 7-6"/><path d="M16.5 20l-3.1-2.8a2 2 0 0 1 2.7-2.9l.4.4l.4-.4a2 2 0 0 1 2.7 2.9z"/>',
    "calendar-star": '<path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M5 4h14a2 2 0 0 1 2 2v15H3V6a2 2 0 0 1 2-2z"/><path d="M12 13l.8 1.7l1.9.2l-1.4 1.3l.4 1.9L12 17l-1.7 1.1l.4-1.9l-1.4-1.3l1.9-.2z"/>',
    hospital: '<path d="M4 21V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15"/><path d="M9 21v-5h6v5"/><path d="M9 10h6"/><path d="M12 7v6"/>',
    headphones: '<path d="M4 14a8 8 0 0 1 16 0"/><path d="M4 14v4a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 2z"/><path d="M20 14v4a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2z"/>',
    "login-shield-solid": '<path d="M12 3.1 19.3 6v5.5c0 4.6-2.9 7.6-7.3 9.6-4.4-2-7.3-5-7.3-9.6V6z" fill="currentColor" stroke="none"/><path d="m8.7 12 2.1 2.2 4.7-5" fill="none" stroke="#fff" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"/>',
    "login-headphones-solid": '<path d="M4.3 13.2a7.7 7.7 0 0 1 15.4 0v4.3c0 2.6-1.7 4.1-4.3 4.1H14v-2h1.4c1.5 0 2.2-.7 2.2-2.1v-4.3a5.6 5.6 0 0 0-11.2 0v5.2H5.1a2.5 2.5 0 0 1-2.5-2.5v-1.3c0-.7.3-1.3.7-1.8z" fill="currentColor" stroke="none"/><path d="M14.2 19.6h-3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>',
    "login-heart-solid": '<path d="M12 20.8 5.3 14.4a4.4 4.4 0 0 1 6-6.4l.7.7.7-.7a4.4 4.4 0 0 1 6 6.4z" fill="currentColor" stroke="none"/><path d="M4.6 13.3h3.2l1.3-2.4 2.3 5.5 2-4.1h4.8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    "profile-user-solid": '<circle cx="12" cy="8" r="4" fill="currentColor" stroke="none"/><path d="M4.6 21c.7-4.8 4.2-7.2 7.4-7.2s6.7 2.4 7.4 7.2z" fill="currentColor" stroke="none"/>',
    "profile-gender-solid": '<circle cx="9" cy="14" r="4.2" fill="none" stroke="currentColor" stroke-width="2.35"/><path d="M12.1 10.9 18 5.9M15 5.8h3.8v3.8M9 18.4V22M6.4 20.7h5.2" fill="none" stroke="currentColor" stroke-width="2.35"/>',
    "profile-calendar-solid": '<rect x="3.8" y="5.2" width="16.4" height="16" rx="2.5" fill="currentColor" stroke="none"/><path d="M7.4 3.2v4.6M16.6 3.2v4.6M4.7 10h14.6" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/><path d="M8 13.4h2.3M13.7 13.4H16M8 17h2.3M13.7 17H16" fill="none" stroke="#fff" stroke-width="1.55" stroke-linecap="round"/>',
    "profile-phone-solid": '<rect x="7" y="2.3" width="10" height="19.4" rx="2" fill="currentColor" stroke="none"/><path d="M10.1 5.4h3.8M11 18.3h2" fill="none" stroke="#fff" stroke-width="1.55" stroke-linecap="round"/><rect x="8.8" y="7.3" width="6.4" height="10" rx=".8" fill="#fff" opacity=".28" stroke="none"/>',
    "profile-pin-solid": '<path d="M12 22s7-6.1 7-12.3A7 7 0 0 0 5 9.7C5 15.9 12 22 12 22z" fill="currentColor" stroke="none"/><circle cx="12" cy="9.7" r="2.4" fill="#fff" stroke="none" opacity=".92"/>',
    "profile-home-solid": '<path d="M3 11.3 12 3l9 8.3v9.2a1.5 1.5 0 0 1-1.5 1.5h-5.1v-6.2H9.6V22H4.5A1.5 1.5 0 0 1 3 20.5z" fill="currentColor" stroke="none"/><path d="M7.5 12.2 12 8.1l4.5 4.1" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>',
    "profile-shield-solid": '<path d="M12 2.8 19.4 6v5.7c0 4.8-3 7.6-7.4 9.9-4.4-2.3-7.4-5.1-7.4-9.9V6z" fill="currentColor" stroke="none"/><path d="m8.6 12 2.2 2.3 4.9-5" fill="none" stroke="#fff" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"/>',
    "profile-heart-solid": '<path d="M12 20.6 4.7 13.3a4.4 4.4 0 0 1 6.2-6.2L12 8.2l1.1-1.1a4.4 4.4 0 0 1 6.2 6.2z" fill="currentColor" stroke="none"/><path d="M4.8 13h3.1l1.3-2.5 2.5 6 2-4.4h5.5" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
    "profile-utensils-solid": '<path d="M5.5 3.2v7.1M8 3.2v7.1M10.5 3.2v7.1M5.5 7h5M8 10.3V22" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round"/><path d="M16.5 3.4c2.7 1.7 3.2 5.6 1 8.4-.5.6-.8 1.2-.8 1.9V22" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round"/>',
    "profile-action-solid": '<circle cx="12" cy="5.1" r="2.4" fill="currentColor" stroke="none"/><path d="M12 8v6.2M6.4 10.3l5.6-2.1 5.6 2.1M9.8 14.2 7.1 21M14.2 14.2l2.7 6.8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    "profile-coupon-solid": '<path d="M4.5 6.2A2.2 2.2 0 0 1 6.7 4h10.6a2.2 2.2 0 0 1 2.2 2.2v3.1a2.7 2.7 0 0 0 0 5.4v3.1a2.2 2.2 0 0 1-2.2 2.2H6.7a2.2 2.2 0 0 1-2.2-2.2v-3.1a2.7 2.7 0 0 0 0-5.4z" fill="currentColor" stroke="none"/><path d="M9 15.5 15.5 8.5M9.5 9.2h.01M15 14.8h.01" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/>',
    "settings-bell-solid": '<path d="M6.2 10.1a5.8 5.8 0 0 1 11.6 0v4l2 3H4.2l2-3z" fill="currentColor" stroke="none"/><path d="M10 20a2.3 2.3 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    "settings-type-solid": '<path d="M4 20 10.2 4h3.6L20 20h-3.5l-1.1-3.3H8.7L7.5 20z" fill="currentColor" stroke="none"/><path d="M9.8 13.5h4.4L12 7.4z" fill="#fff" stroke="none" opacity=".8"/>',
    "settings-trash-solid": '<path d="M7 8h10l-.7 12.2A1.9 1.9 0 0 1 14.4 22H9.6a1.9 1.9 0 0 1-1.9-1.8z" fill="currentColor" stroke="none"/><path d="M5 6h14M9 6l.7-2h4.6l.7 2M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>',
    "settings-chat-solid": '<path d="M4 5.8A4.8 4.8 0 0 1 8.8 1.9h6.4A4.8 4.8 0 0 1 20 6.7v4.4a4.8 4.8 0 0 1-4.8 4.8h-4.6L5.8 20v-4.5A4.8 4.8 0 0 1 4 11.1z" fill="currentColor" stroke="none"/><path d="M8 9h.01M12 9h.01M16 9h.01" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>',
    "settings-users-solid": '<circle cx="9.2" cy="8" r="3.2" fill="currentColor" stroke="none"/><circle cx="16.5" cy="9.2" r="2.8" fill="currentColor" stroke="none" opacity=".78"/><path d="M3.5 20c.6-4 3.5-6.1 6.7-6.1s6.1 2.1 6.7 6.1zM14.6 20c.4-2.5 2.1-4 4.4-4 1.1 0 2.1.4 2.8 1.1V20z" fill="currentColor" stroke="none"/>',
    "settings-volume-solid": '<path d="M4 9.3h3.4L13 5v14l-5.6-4.3H4z" fill="currentColor" stroke="none"/><path d="M16.2 8.2a5.6 5.6 0 0 1 0 7.6M18.8 5.5a9.5 9.5 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>',
    "settings-help-solid": '<circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="M9.4 9.1a3 3 0 0 1 5.7 1.4c0 2-2.2 2.2-2.2 3.8M12 17.8h.01" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
    "settings-headphones-solid": '<path d="M4 13a8 8 0 0 1 16 0v4.1c0 2.7-1.7 4.2-4.5 4.2H14v-2h1.5c1.6 0 2.3-.7 2.3-2.2V13a5.8 5.8 0 0 0-11.6 0v5H5a2.5 2.5 0 0 1-2.5-2.5V14A2.5 2.5 0 0 1 4 11.7z" fill="currentColor" stroke="none"/>',
    "settings-file-solid": '<path d="M6 3h8l4 4v16H6z" fill="currentColor" stroke="none"/><path d="M14 3v5h5M9 12h6M9 16h6M9 20h4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    "settings-cross-solid": '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="currentColor" stroke="none"/>',
    "settings-info-solid": '<circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="M12 10v7M12 7h.01" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
    "settings-watch-solid": '<path d="M9 2h6l1 4H8zM8 18h8l-1 4H9zM7 8a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" fill="currentColor" stroke="none"/><path d="M10 12h4M12 10v4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>',
    "settings-bot-solid": '<path d="M8 7h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4zM11 4h2v3h-2z" fill="currentColor" stroke="none"/><path d="M9 13h.01M15 13h.01M9.5 16.2h5" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/>',
  };
  if (inline[name]) {
    return `<svg aria-hidden="true" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inline[name]}</svg>`;
  }
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
}

function render() {
  const id = currentId();
  const screen = routeMap[id];
  syncPrototypeShell();
  if (id === "activity-map") resetActivityMapRuntime();
  document.title = `${screen.title} - 云旅无忧用户端`;
  const screenHtml = screen.render();
  document.getElementById("app").innerHTML = `
    <div class="screen screen-${screen.id} ${screen.plain ? "plain" : ""}">
      ${statusBar()}
      ${screen.plain ? "" : appBar(screen)}
      <div class="content ${screen.noTab ? "no-tab" : ""}">
        ${screenHtml}
      </div>
      ${screen.checkout ? checkoutBar() : ""}
      ${screen.noTab ? "" : bottomTabs(screen.tab, screen)}
      <div class="toast" data-toast aria-live="polite"></div>
    </div>
  `;
  if (isPrototypeMode()) renderNav(id);
  hydrateInteractiveControls(document.getElementById("app"));
  hydratePassiveButtons(document.getElementById("app"));
  if (window.lucide) window.lucide.createIcons();
  initStatusRuntime();
  syncStatusBar();
  initLocationRuntime();
  initHomeHeroCarousel();
  if (id === "activity-map") initActivityMap();
  if (id === "messages") filterMessages(activeMessageFilter, true);
  if (id === "community") syncCommunityFilter(activeCommunityFilter);
  hydrateUserApiData(id);
}

function initHomeHeroCarousel() {
  if (homeHeroTimer) {
    clearInterval(homeHeroTimer);
    homeHeroTimer = null;
  }
  if (currentId() !== "home") return;

  const track = document.querySelector(".home-hero-track");
  const slides = [...document.querySelectorAll(".home-hero-track .home-hero-slide")];
  const dots = [...document.querySelectorAll(".home-hero-dots span")];
  if (!track || slides.length < 2) return;

  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.getBoundingClientRect().left >= track.getBoundingClientRect().left - 2));
  if (activeIndex < 0) activeIndex = 0;

  const setActive = (index) => {
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));
    dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === activeIndex));
  };

  const goTo = (index) => {
    const nextIndex = index % slides.length;
    const nextSlide = slides[nextIndex];
    if (!nextSlide) return;
    setActive(nextIndex);
    track.scrollTo({ left: nextSlide.offsetLeft, behavior: "smooth" });
  };

  let scrollFrame = 0;
  track.addEventListener("scroll", () => {
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const nearest = slides.reduce((best, slide, index) => {
        const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      }, { index: activeIndex, distance: Number.POSITIVE_INFINITY });
      setActive(nearest.index);
    });
  }, { passive: true });

  setActive(activeIndex);
  homeHeroTimer = setInterval(() => goTo(activeIndex + 1), 3600);
}

function isPrototypeMode() {
  return document.documentElement.dataset.display === "prototype";
}

function syncPrototypeShell() {
  const prototypeMode = isPrototypeMode();
  document.querySelectorAll("[data-dev-only]").forEach((node) => {
    node.hidden = !prototypeMode;
    node.setAttribute("aria-hidden", prototypeMode ? "false" : "true");
  });
  if (!prototypeMode) {
    const screenNav = document.getElementById("screenNav");
    const mobileSwitcher = document.getElementById("mobileSwitcher");
    if (screenNav) screenNav.innerHTML = "";
    if (mobileSwitcher) mobileSwitcher.innerHTML = "";
  }
}

function renderNav(activeId) {
  const screenNav = document.getElementById("screenNav");
  const mobileSwitcher = document.getElementById("mobileSwitcher");
  if (!isPrototypeMode() || !screenNav || !mobileSwitcher) return;

  const groupMap = screens.reduce((acc, screen) => {
    if (!acc[screen.group]) acc[screen.group] = [];
    acc[screen.group].push(screen);
    return acc;
  }, {});

  const navHtml = Object.entries(groupMap).map(([group, items]) => `
    <div class="nav-group">
      <div class="nav-group-title">${group}</div>
      ${items.map((screen) => `
        <button class="screen-link ${screen.id === activeId ? "active" : ""}" data-route="${screen.id}" type="button">
          <span>${screen.num}-${screen.title}</span>
          <small>${screen.id === activeId ? "当前" : "查看"}</small>
        </button>
      `).join("")}
    </div>
  `).join("");

  const mobileHtml = screens.map((screen) => `
    <button class="${screen.id === activeId ? "active" : ""}" data-route="${screen.id}" type="button">${screen.num}-${screen.title}</button>
  `).join("");

  document.getElementById("screenNav").innerHTML = navHtml;
  document.getElementById("mobileSwitcher").innerHTML = mobileHtml;
}

document.addEventListener("click", guardUserEndpointClick, true);

document.addEventListener("pointerdown", (event) => {
  const voiceButton = event.target.closest("[data-assistant-voice-hold]");
  if (!voiceButton) return;
  event.preventDefault();
});

document.addEventListener("pointerup", (event) => {
  const voiceButton = event.target.closest("[data-assistant-voice-hold]");
  if (!voiceButton) return;
  event.preventDefault();
  voiceButton.dataset.voiceSuppressClick = "true";
  if (assistantVoiceListening) {
    stopAssistantVoiceAndWait(voiceButton);
  } else {
    startAssistantVoice(voiceButton);
  }
});

document.addEventListener("pointercancel", () => {
  const voiceButton = document.querySelector("[data-assistant-voice-hold]");
  if (!voiceButton) return;
  voiceButton.dataset.voiceSuppressClick = "true";
  cancelAssistantVoice(voiceButton, "语音输入已取消，请点击重新开始");
});

document.addEventListener("pointerup", (event) => {
  const cartToggle = event.target.closest("[data-shop-cart-toggle]");
  if (!cartToggle || currentId() !== "shop") return;
  event.preventDefault();
  event.stopPropagation();
  shopCartPointerSuppressUntil = Date.now() + 600;
  toggleShopCartPanel();
}, true);

document.addEventListener("input", (event) => {
  const citySearch = event.target.closest("[data-city-search-input]");
  if (citySearch && currentId() === "city") {
    citySearchQuery = citySearch.value.trim();
    activeCityIndex = "热门";
    filterCitySearchResults(citySearchQuery);
    return;
  }
  const serviceRecordSearch = event.target.closest("[data-service-record-search]");
  if (serviceRecordSearch && currentId() === "service-records") {
    queueServiceRecordsSearch(serviceRecordSearch);
    return;
  }
  const destinationSearch = event.target.closest("[data-destination-search]");
  if (destinationSearch && currentId() === "destinations") {
    queueDestinationSearch(destinationSearch);
    return;
  }
  const policySearch = event.target.closest("[data-policy-search]");
  if ((event.isComposing || policySearchComposing) && policySearch && currentId() === "policies") return;
  if (policySearch && currentId() === "policies") {
    filterPoliciesFromSearchInput(policySearch);
    return;
  }
  const orderSearch = event.target.closest("[data-order-search]");
  if (!orderSearch || currentId() !== "orders") return;
  orderSearchQuery = orderSearch.value.trim();
  window.clearTimeout(orderSearchTimer);
  orderSearchTimer = window.setTimeout(() => hydrateOrdersFromApi(), 260);
});

document.addEventListener("compositionstart", (event) => {
  const policySearch = event.target.closest("[data-policy-search]");
  if (policySearch && currentId() === "policies") policySearchComposing = true;
});

document.addEventListener("compositionend", (event) => {
  const policySearch = event.target.closest("[data-policy-search]");
  if (!policySearch || currentId() !== "policies") return;
  policySearchComposing = false;
  filterPoliciesFromSearchInput(policySearch);
});

document.addEventListener("keydown", async (event) => {
  const serviceRecordSearch = event.target.closest("[data-service-record-search]");
  if (serviceRecordSearch && currentId() === "service-records" && event.key === "Enter") {
    event.preventDefault();
    queueServiceRecordsSearch(serviceRecordSearch, true);
    return;
  }
  const destinationSearch = event.target.closest("[data-destination-search]");
  if (destinationSearch && currentId() === "destinations" && event.key === "Enter") {
    event.preventDefault();
    queueDestinationSearch(destinationSearch, true);
    return;
  }
  const policySearch = event.target.closest("[data-policy-search]");
  if (policySearch && currentId() === "policies" && event.key === "Enter") {
    event.preventDefault();
    if (event.isComposing || policySearchComposing) return;
    filterPoliciesFromSearchInput(policySearch);
    return;
  }
  const citySearch = event.target.closest("[data-city-search-input]");
  if (!citySearch || currentId() !== "city" || event.key !== "Enter") return;
  event.preventDefault();
  const selected = await selectFirstCitySearchResult(citySearch);
  if (!selected) writeActionStatus(citySearch.closest(".content") || citySearch, "没有找到匹配城市，请换个关键词再试");
});

document.addEventListener("change", async (event) => {
  const serviceRecordSearch = event.target.closest("[data-service-record-search]");
  if (serviceRecordSearch && currentId() === "service-records") {
    queueServiceRecordsSearch(serviceRecordSearch, true);
    return;
  }
  const destinationSearch = event.target.closest("[data-destination-search]");
  if (destinationSearch && currentId() === "destinations") queueDestinationSearch(destinationSearch, true);
  const policySearch = event.target.closest("[data-policy-search]");
  if (policySearch && currentId() === "policies") filterPoliciesFromSearchInput(policySearch);
});

document.addEventListener("search", (event) => {
  const serviceRecordSearch = event.target.closest("[data-service-record-search]");
  if (serviceRecordSearch && currentId() === "service-records") {
    queueServiceRecordsSearch(serviceRecordSearch, true);
    return;
  }
  const destinationSearch = event.target.closest("[data-destination-search]");
  if (destinationSearch && currentId() === "destinations") queueDestinationSearch(destinationSearch, true);
  const policySearch = event.target.closest("[data-policy-search]");
  if (policySearch && currentId() === "policies") filterPoliciesFromSearchInput(policySearch);
}, true);

document.addEventListener("click", (event) => {
  if (currentId() !== "city") return;
  const cityRelocate = event.target.closest("[data-city-relocate]");
  if (cityRelocate) {
    event.preventDefault();
    event.stopImmediatePropagation();
    handleCityRelocate(cityRelocate);
    return;
  }

  const citySelect = event.target.closest("[data-city-select]");
  if (citySelect) {
    event.preventDefault();
    event.stopImmediatePropagation();
    handleCitySelect(citySelect.dataset.citySelect, citySelect);
  }
}, true);

document.addEventListener("pointerdown", (event) => {
  const auditTarget = event.target.closest("button, a, input, textarea, select, label, article, .card, #amapActivityMap, #amapActivityMap *, [data-amap-map], [role='button'], [data-route], [data-action], [data-add-cart], [data-shop-cart-toggle], [data-message-filter], [data-order-filter], [data-sos-record-filter], [data-service-record-filter], [data-activity-record-filter], [data-activity-map-filter], [data-community-filter]");
  if (!auditTarget || auditTarget.closest("[data-dev-only]")) return;
  const rawAction = auditTarget.dataset.action || auditTarget.dataset.route || auditTarget.getAttribute("aria-label") || auditTarget.textContent || auditTarget.getAttribute("placeholder") || "点击";
  recordUserInteraction(rawAction, auditTarget, { kind: "pointerdown" });
}, true);

document.addEventListener("click", async (event) => {
  const clickTarget = event.target.closest("button, a, input, textarea, select, label, article, .card, #amapActivityMap, #amapActivityMap *, [data-amap-map], [role='button'], [data-route], [data-action], [data-add-cart], [data-shop-cart-toggle], [data-message-filter], [data-order-filter], [data-sos-record-filter], [data-service-record-filter], [data-activity-record-filter], [data-activity-map-filter], [data-community-filter]");
  if (clickTarget && !clickTarget.closest("[data-dev-only]")) {
    const rawAction = clickTarget.dataset.action || clickTarget.dataset.route || clickTarget.getAttribute("aria-label") || clickTarget.textContent || "点击";
    recordUserInteraction(rawAction, clickTarget, { kind: "raw-click" });
  }

  const cityRelocate = event.target.closest("[data-city-relocate]");
  if (cityRelocate) {
    event.preventDefault();
    await handleCityRelocate(cityRelocate);
    return;
  }

  const citySelect = event.target.closest("[data-city-select]");
  if (citySelect) {
    event.preventDefault();
    await handleCitySelect(citySelect.dataset.citySelect, citySelect);
    return;
  }

  const policyFilter = event.target.closest("[data-policy-filter]");
  if (policyFilter) {
    event.preventDefault();
    policyActiveFilter = policyFilter.dataset.policyFilter || "全部";
    recordUserInteraction(`筛选政策：${policyActiveFilter}`, policyFilter, { kind: "policy-filter" });
    render();
    return;
  }

  const policySelect = event.target.closest("[data-policy-title]");
  if (policySelect) {
    event.preventDefault();
    selectedPolicy = {
      title: policySelect.dataset.policyTitle,
      text: policySelect.dataset.policyText,
      tag: policySelect.dataset.policyTag,
      source: policySelect.dataset.policySource,
      date: policySelect.dataset.policyDate,
      read: policySelect.dataset.policyRead,
    };
    rememberScreenReturn("policy-detail", policySelect);
    setRoute("policy-detail");
    return;
  }

  const add = event.target.closest("[data-add-cart]");
  if (add) {
    event.preventDefault();
    recordUserInteraction("加入购物车", add, { kind: "cart-add", product: add.dataset.addCart || "" });
    await addShopCartItem(add);
    return;
  }

  const cartToggle = event.target.closest("[data-shop-cart-toggle]");
  if (cartToggle) {
    event.preventDefault();
    if (Date.now() < shopCartPointerSuppressUntil) return;
    recordUserInteraction("切换购物车", cartToggle, { kind: "cart-toggle" });
    toggleShopCartPanel();
    return;
  }

  const cartClose = event.target.closest("[data-shop-cart-close]");
  if (cartClose) {
    event.preventDefault();
    recordUserInteraction("关闭购物车", cartClose, { kind: "cart-close" });
    closeShopCartPanel();
    return;
  }

  const cartStep = event.target.closest("[data-cart-step]");
  if (cartStep) {
    event.preventDefault();
    recordUserInteraction("调整购物车数量", cartStep, { kind: "cart-step", product: cartStep.dataset.cartStep || "", delta: cartStep.dataset.cartDelta || "" });
    await updateShopCartQuantity(cartStep.dataset.cartStep, Number(cartStep.dataset.cartDelta || 0), cartStep);
    return;
  }

  const removeCart = event.target.closest("[data-remove-cart]");
  if (removeCart) {
    event.preventDefault();
    recordUserInteraction("移除购物车商品", removeCart, { kind: "cart-remove", product: removeCart.dataset.removeCart || "" });
    await removeShopCartItem(removeCart.dataset.removeCart);
    return;
  }

  const messageFilter = event.target.closest("[data-message-filter]");
  if (messageFilter) {
    event.preventDefault();
    recordUserInteraction(`筛选消息：${messageFilter.dataset.messageFilter || "全部"}`, messageFilter, { kind: "message-filter" });
    filterMessages(messageFilter.dataset.messageFilter);
    return;
  }

  const serviceRecordSearchAction = event.target.closest('[data-action="搜索服务记录"]');
  if (serviceRecordSearchAction) {
    event.preventDefault();
    serviceRecordsSearchQuery = document.querySelector("[data-service-record-search]")?.value?.trim?.() || "";
    recordUserInteraction(`搜索服务记录：${serviceRecordsSearchQuery || "全部"}`, serviceRecordSearchAction, { kind: "service-record-search", q: serviceRecordsSearchQuery });
    await hydrateServiceRecordsFromApi({ force: true, silent: true });
    return;
  }

  const serviceRecordFilter = event.target.closest("[data-service-record-filter]");
  if (serviceRecordFilter) {
    event.preventDefault();
    serviceRecordsActiveFilter = serviceRecordFilter.dataset.serviceRecordFilter || "全部";
    recordUserInteraction(`筛选服务记录：${serviceRecordsActiveFilter}`, serviceRecordFilter, { kind: "service-record-filter" });
    filterServiceRecords(serviceRecordsActiveFilter, true);
    await hydrateServiceRecordsFromApi({ force: true });
    return;
  }

  const healthServiceCategory = event.target.closest("[data-health-service-category]");
  if (healthServiceCategory) {
    event.preventDefault();
    healthServicesActiveCategory = healthServiceCategory.dataset.healthServiceCategory || "全部";
    recordUserInteraction(`筛选健康服务：${healthServicesActiveCategory}`, healthServiceCategory, { kind: "health-service-category" });
    await hydrateHealthServicesFromApi({ force: true });
    return;
  }

  const sosRecordFilter = event.target.closest("[data-sos-record-filter]");
  if (sosRecordFilter) {
    event.preventDefault();
    recordUserInteraction(`筛选求助记录：${sosRecordFilter.dataset.sosRecordFilter || "全部"}`, sosRecordFilter, { kind: "sos-record-filter" });
    filterSosRecords(sosRecordFilter.dataset.sosRecordFilter);
    return;
  }

  const orderFilter = event.target.closest("[data-order-filter]");
  if (orderFilter) {
    event.preventDefault();
    recordUserInteraction(`筛选订单：${orderFilter.dataset.orderFilter || "全部"}`, orderFilter, { kind: "order-filter" });
    orderActiveFilter = orderFilter.dataset.orderFilter || "全部";
    await hydrateOrdersFromApi();
    return;
  }

  const activityRecordFilter = event.target.closest("[data-activity-record-filter]");
  if (activityRecordFilter) {
    event.preventDefault();
    recordUserInteraction(`筛选活动记录：${activityRecordFilter.dataset.activityRecordFilter || "全部"}`, activityRecordFilter, { kind: "activity-record-filter" });
    activityRecordActiveFilter = activityRecordFilter.dataset.activityRecordFilter || "全部";
    await hydrateActivityRecordsFromApi();
    return;
  }

  const activityMapFilter = event.target.closest("[data-activity-map-filter]");
  if (activityMapFilter) {
    event.preventDefault();
    recordUserInteraction(`筛选活动地图：${activityMapFilter.dataset.activityMapFilter || "全部"}`, activityMapFilter, { kind: "activity-map-filter" });
    await filterActivityMap(activityMapFilter.dataset.activityMapFilter);
    return;
  }

  const communityFilter = event.target.closest("[data-community-filter]");
  if (communityFilter) {
    event.preventDefault();
    recordUserInteraction(`筛选社群：${communityFilter.dataset.communityFilter || "推荐"}`, communityFilter, { kind: "community-filter" });
    await filterCommunity(communityFilter.dataset.communityFilter, communityFilter);
    return;
  }

  const route = event.target.closest("[data-route]");
  const routeBlockedByNestedAction = Boolean(route && event.target.closest("[data-action], input, textarea, select, a[href]") && event.target.closest("[data-action], input, textarea, select, a[href]") !== route);
  if (route && !routeBlockedByNestedAction) {
    event.preventDefault();
    const nextRoute = normalizeUserRouteId(route.dataset.route);
    recordUserInteraction(`页面跳转：${nextRoute || route.dataset.route || "无效目标"}`, route, { kind: "route", to: nextRoute || route.dataset.route || "" });
    if (!nextRoute) {
      writeActionStatus(route, "用户端导航目标无效");
      showToast("用户端导航目标无效");
      return;
    }
    if (nextRoute === currentId() && refreshCurrentRouteFromControl(route, nextRoute)) return;
    if (route.dataset.guideService) {
      localStorage.setItem("yunlv-guide-service", route.dataset.guideService);
      localStorage.setItem("yunlv-guide-amount", route.dataset.guideAmount || "");
      if (!route.dataset.guideId) localStorage.removeItem("yunlv-guide-id");
    }
    if (route.dataset.guideId) {
      localStorage.setItem("yunlv-guide-id", route.dataset.guideId);
    }
    if (route.dataset.orderId) {
      localStorage.setItem("yunlv-selected-order", route.dataset.orderId);
    }
    if (nextRoute === "profile") {
      userProfileCenterState = null;
      profilePlansExpanded = false;
    }
    try {
      const handled = await window.YunlvBusiness?.onRoute?.({
        role: "elder",
        route: currentId(),
        to: nextRoute,
        button: route,
        showToast,
        writeActionStatus,
      });
      if (handled) return;
    } catch (error) {
      writeActionStatus(route, error.message);
      showToast(error.message);
      return;
    }
    rememberScreenReturn(nextRoute, route);
    if (nextRoute === "activity-map") {
      activityMapMode = "";
      activityMapSnapshotPoint = null;
      activityMapActiveFilter = "全部";
      activityMapFocusEventTitle = "";
    }
    if (nextRoute === "destination-detail") {
      const detailSource = route.dataset.detailKey ? route : route.closest("[data-detail-key]") || route;
      rememberDestinationDetail(detailSource);
    }
    if (nextRoute === "activity-signup") {
      rememberActivityDetail(route);
    }
    setRoute(nextRoute);
    return;
  }

  const checkinTrigger = event.target.closest("[data-checkin-photo-trigger]");
  if (checkinTrigger) {
    recordUserInteraction("拍照打卡", checkinTrigger, { kind: "checkin-photo" });
    checkinPhotoTrigger = checkinTrigger;
    writeActionStatus(checkinTrigger.closest(".ref-checkin-today, .ref-checkin-achievement") || checkinTrigger, "正在打开相机，请拍摄今天的旅居打卡照片");
    return;
  }

  const action = event.target.closest("[data-action]");
  if (action) {
    event.preventDefault();
    recordUserInteraction(action.dataset.action || action.textContent.trim() || "操作", action, { kind: "action" });
    await handleAction(action);
  }
});

document.addEventListener("input", (event) => {
  const shopSearch = event.target.closest("[data-shop-search]");
  if (shopSearch) {
    applyShopSearch(shopSearch.value);
    shopSearchKeyword = shopSearch.value.trim();
    window.clearTimeout(scheduleShopHydration.searchTimer);
    scheduleShopHydration.searchTimer = window.setTimeout(() => hydrateShopFromApi("shop", { force: true, silent: true }), 260);
  }
  const communityFormField = event.target.closest("[data-community-compose] textarea, [data-community-compose] select");
  if (communityFormField) syncCommunityComposeDraftFromForm(communityFormField.closest("[data-community-compose]"));
});

document.addEventListener("submit", async (event) => {
  const personalForm = event.target.closest("[data-personal-profile-form]");
  if (personalForm) {
    event.preventDefault();
    await savePersonalProfile(personalForm);
    return;
  }
  const volunteerHelpForm = event.target.closest("[data-volunteer-help-form]");
  if (volunteerHelpForm) {
    event.preventDefault();
    await submitVolunteerHelpRequest(volunteerHelpForm);
    return;
  }
  const form = event.target.closest("[data-guide-order-form]");
  if (!form) return;
  event.preventDefault();
  await submitGuideOrderForm(form, event.submitter || form.querySelector('button[type="submit"]'));
});

document.addEventListener("change", async (event) => {
  const avatarInput = event.target.closest("[data-personal-avatar-input]");
  if (avatarInput) {
    const file = avatarInput.files?.[0];
    if (file) updatePersonalAvatar(file, avatarInput);
    avatarInput.value = "";
    return;
  }

  const checkinInput = event.target.closest("[data-checkin-photo-input]");
  if (checkinInput) {
    const file = checkinInput.files?.[0];
    if (file) await completePhotoCheckin(checkinPhotoTrigger || document.querySelector("[data-checkin-photo-trigger]"), file);
    checkinInput.value = "";
    return;
  }

  const select = event.target.closest("[data-guide-service-input]");
  if (!select) return;
  localStorage.setItem("yunlv-guide-service", select.value);
  const selectedGuideId = localStorage.getItem("yunlv-guide-id") || "";
  const selectedGuide = (userGuidePageState?.recommendedGuides || []).find((item) => item.id === selectedGuideId);
  if (selectedGuide && !(selectedGuide.serviceTypes || []).includes(select.value)) localStorage.removeItem("yunlv-guide-id");
  const option = select.selectedOptions?.[0];
  const amount = Number(option?.dataset?.amount || selectedGuideService().amount || 120);
  localStorage.setItem("yunlv-guide-amount", String(amount));
  const form = select.closest("[data-guide-order-form]");
  const dynamicFields = form?.querySelector("[data-guide-dynamic-fields]");
  if (dynamicFields) dynamicFields.innerHTML = guideDynamicFieldsHtml(select.value);
  const estimate = form?.querySelector("[data-guide-estimate]");
  if (estimate) estimate.textContent = `¥${amount}`;
  const note = form?.querySelector('[name="note"]');
  if (note && !note.dataset.touched) note.value = `请协助老人完成${select.value}服务，全程同步家属。`;
});

window.addEventListener("hashchange", render);

function hydrateInteractiveControls(root) {
  if (!root) return;
  const selectors = [
    ".chips .chip",
    ".segmented .segment",
    ".tabs .tab",
    ".ref-filter-tabs .chip",
    ".ref-record-tabs .chip",
    ".ref-order-tabs .chip",
    ".ref-service-tabs > *",
    ".ref-shop-tabs > *",
  ].join(",");

  root.querySelectorAll(selectors).forEach((node) => {
    let control = node;
    if (node.tagName !== "BUTTON") {
      control = document.createElement("button");
      [...node.attributes].forEach((attr) => control.setAttribute(attr.name, attr.value));
      control.innerHTML = node.innerHTML;
      node.replaceWith(control);
    }
    control.type = "button";
    if (!control.dataset.route && !control.dataset.action && !control.dataset.addCart) {
      const label = (control.textContent || "筛选").trim().replace(/\s+/g, " ");
      control.dataset.action = `选择${label}`;
    }
    control.setAttribute("aria-pressed", control.classList.contains("active") || control.classList.contains("is-active") ? "true" : "false");
  });
}

function hydratePassiveButtons(root) {
  if (!root) return;
  root.querySelectorAll("button, [role='button']").forEach((button) => {
    if (button.dataset.route || button.dataset.action || button.dataset.open || button.dataset.step || button.dataset.go || button.dataset.screen || button.dataset.addCart || button.dataset.shopCartToggle || button.dataset.shopCartClose || button.dataset.cartStep || button.dataset.removeCart || button.type === "submit") return;
    const label = (button.getAttribute("aria-label") || button.textContent || "操作").trim().replace(/\s+/g, " ");
    button.dataset.action = label || "操作";
  });
}

async function handleAction(actionButton) {
  const actionName = actionButton.dataset.action || actionButton.textContent.trim() || "操作";
  if (actionName === "切换登录协议同意") {
    const active = actionButton.getAttribute("aria-pressed") !== "true";
    actionButton.classList.toggle("active", active);
    actionButton.setAttribute("aria-pressed", active ? "true" : "false");
    actionButton.querySelector(".ref-login-check")?.classList.toggle("active", active);
    actionButton.dataset.agreementAccepted = active ? "true" : "false";
    return;
  }
  if (currentId() === "city" && actionName.startsWith("城市索引")) {
    handleCityIndex(actionName.replace("城市索引", ""), actionButton);
    return;
  }
  if (currentId() === "personal" && actionName === "更换头像") {
    openPersonalAvatarPicker(actionButton);
    return;
  }
  if (currentId() === "sos-records" && actionName === "筛选") {
    focusSosRecordFilters(actionButton);
    return;
  }
  if (currentId() === "orders" && actionName === "筛选") {
    focusOrderFilters(actionButton);
    return;
  }
  if (currentId() === "activity-records" && actionName === "筛选") {
    focusActivityRecordFilters(actionButton);
    return;
  }
  if ((actionButton.closest(".ref-family-invite") || currentId() === "family") && ["邀请", "生成邀请二维码", "手机号邀请"].includes(actionName)) {
    showFamilyInvitePanel(actionButton, actionName);
    return;
  }
  if (actionName === "keyboard") {
    toggleAssistantKeyboard(actionButton);
    return;
  }
  if (actionName === "assistant-send-text") {
    await sendAssistantTextQuestion(actionButton);
    return;
  }
  if (actionName === "voice") {
    if (actionButton.dataset.voicePointerActive === "true") return;
    if (actionButton.dataset.voiceSuppressClick === "true") {
      delete actionButton.dataset.voiceSuppressClick;
      return;
    }
    toggleAssistantVoice(actionButton);
    return;
  }
  if (actionButton.dataset.assistantFeedback) {
    toggleAssistantFeedback(actionButton);
    return;
  }
  if (actionName === "换一批") {
    refreshAssistantSuggestions(actionButton);
    return;
  }
  if (actionName === "assistant-question") {
    await askAssistantQuestion(actionButton);
    return;
  }
  if (actionName === "分享回答") {
    shareAssistantAnswer(actionButton);
    return;
  }
  if (actionName === "重新回答") {
    regenerateAssistantAnswer(actionButton);
    return;
  }
  if (actionName === "查看全部旅居计划") {
    expandProfilePlans(actionButton);
    return;
  }
  if (actionName === "全部已读") {
    await markMessagesRead(actionButton);
    return;
  }
  if (await handleMessagesAction(actionButton, actionName)) return;
  if (await handleOrdersAction(actionButton, actionName)) return;
  if (await handleDestinationsAction(actionButton, actionName)) return;
  if (/^筛选目的地：/.test(actionName)) {
    await handleDestinationFilterAction(actionButton, actionName.replace(/^筛选目的地：/, ""));
    return;
  }
  if (actionName === "清空" && currentId() === "service-records") {
    await clearServiceRecords(actionButton);
    return;
  }
  if (await handleServiceRecordsAction(actionButton, actionName)) return;
  if (await handleActivityRecordsAction(actionButton, actionName)) return;
  if (actionName === "打开活动报名表") {
    openActivitySignupForm(actionButton);
    return;
  }
  if (actionName === "提交活动报名") {
    await submitActivitySignupForm(actionButton);
    return;
  }
  if (actionName === "提交人工向导订单") {
    const form = document.querySelector("[data-guide-order-form]");
    if (form) await submitGuideOrderForm(form, actionButton);
    return;
  }
  if (actionName === "同步首页定位") {
    await syncGuideFormLocation(actionButton);
    return;
  }
  if (await handleGuideDetailAction(actionButton, actionName)) return;
  if (await handleDestinationDetailAction(actionButton, actionName)) return;
  if (await handleEmergencyAction(actionButton, actionName)) return;
  if (handleActivitySignupAction(actionButton, actionName)) return;
  if (await handleCalendarAction(actionButton, actionName)) return;
  if (handleActivityMapAction(actionButton, actionName)) return;
  if (await handleContactsAction(actionButton, actionName)) return;
  if (handleProfileAction(actionButton, actionName)) return;
  if (await handlePersonalAction(actionButton, actionName)) return;
  if (await handleHealthServicesAction(actionButton, actionName)) return;
  if (await handleHealthRecordAction(actionButton, actionName)) return;
  if (await handleFamilyAction(actionButton, actionName)) return;
  if (handleRobotSettingsAction(actionButton, actionName)) return;
  if (handleBandSettingsAction(actionButton, actionName)) return;
  if (handleSettingsAction(actionButton, actionName)) return;
  if (await handleRobotAction(actionButton, actionName)) return;
  if (handleDevicesAction(actionButton, actionName)) return;
  if (await handleDeviceManagementAction(actionButton, actionName)) return;
  if (await handleCommunityAction(actionButton, actionName)) return;
  if (await handleCheckinAction(actionButton, actionName)) return;
  if (await handleFoodAction(actionButton, actionName)) return;
  if (await handleTransportAction(actionButton, actionName)) return;
  if (await handleShopAction(actionButton, actionName)) return;
  if (await handleVolunteerAction(actionButton, actionName)) return;
  if (await handleReviewAction(actionButton, actionName)) return;
  try {
    const businessHandled = await window.YunlvBusiness?.handleAction?.({
      role: "elder",
      route: currentId(),
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
  applyActionState(actionButton, actionName);
}

function syncBusinessAction(actionName, button) {
  window.YunlvBusiness?.handleAction?.({
    role: "elder",
    route: currentId(),
    actionName,
    button,
    showToast,
    writeActionStatus,
  });
}

let userInteractionAuditSeq = 0;

function recordUserInteraction(actionName, button = null, detail = {}) {
  userInteractionAuditSeq += 1;
  const payload = {
    seq: userInteractionAuditSeq,
    route: currentId(),
    action: String(actionName || "操作"),
    label: (button?.getAttribute?.("aria-label") || button?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
    at: new Date().toISOString(),
    nonce: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...detail,
  };
  try {
    localStorage.setItem("yunlv-user-last-action", JSON.stringify(payload));
  } catch (error) {}
  const content = document.querySelector(".content") || document.body;
  if (!content) return payload;
  let node = content.querySelector("[data-user-action-audit]");
  if (!node) {
    node = document.createElement("span");
    node.dataset.userActionAudit = "";
    node.hidden = true;
    content.appendChild(node);
  }
  node.textContent = `${payload.seq}:${payload.route}:${payload.action}`;
  return payload;
}

function setAssistantVoiceUi(active, text = "") {
  const bar = document.querySelector(".ref-voice-bar");
  const button = bar?.querySelector('[data-action="voice"]');
  const meta = bar?.querySelector(".meta");
  if (bar) bar.classList.toggle("is-listening", active);
  if (button) {
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.innerHTML = active ? icon("audio-lines", 32) : "点击说话";
  }
  if (meta) meta.textContent = text || (active ? "正在聆听，请直接说话" : "点击说话");
  if (window.lucide) window.lucide.createIcons();
}

function stopAssistantVoiceCapture() {
  if (assistantVoiceRecognition) {
    try { assistantVoiceRecognition.stop(); } catch (_) {}
    assistantVoiceRecognition = null;
  }
}

function cancelAssistantVoice(button = null, message = "未识别到语音，请点击重新开始") {
  window.clearTimeout(assistantVoiceWaitTimer);
  assistantVoiceWaitTimer = null;
  assistantVoiceListening = false;
  assistantVoiceStopping = false;
  assistantVoiceLastError = "";
  assistantVoiceTranscript = "";
  stopAssistantVoiceCapture();
  setAssistantVoiceUi(false, "点击说话");
  const scope = button?.closest?.(".ref-voice-bar") || document.querySelector(".ref-voice-bar") || document.querySelector(".content");
  writeActionStatus(scope, message);
}

function stopAssistantVoiceAndWait(button = null) {
  assistantVoiceListening = false;
  assistantVoiceStopping = true;
  const scope = button?.closest?.(".ref-voice-bar") || document.querySelector(".ref-voice-bar") || document.querySelector(".content");
  setAssistantVoiceUi(false, "正在识别...");
  stopAssistantVoiceCapture();
  if (assistantVoiceTranscript.trim()) {
    finishAssistantVoice(assistantVoiceTranscript);
    return;
  }
  window.clearTimeout(assistantVoiceWaitTimer);
  assistantVoiceWaitTimer = window.setTimeout(() => {
    if (assistantVoiceLastError === "not-allowed" || assistantVoiceLastError === "service-not-allowed") {
      cancelAssistantVoice(scope, "H5页面当前浏览器无法识别语音，请确认浏览器语音权限后重试");
      return;
    }
    cancelAssistantVoice(scope, "H5页面当前浏览器无法识别语音，请点击重新开始");
  }, 1600);
}

async function finishAssistantVoice(transcript = "") {
  window.clearTimeout(assistantVoiceWaitTimer);
  assistantVoiceWaitTimer = null;
  assistantVoiceListening = false;
  assistantVoiceStopping = false;
  stopAssistantVoiceCapture();
  const normalized = transcript.trim().replace(/\s+/g, " ");
  assistantVoiceTranscript = "";
  if (!normalized) {
    cancelAssistantVoice(document.querySelector(".ref-chat") || document.querySelector(".ref-voice-bar"), "H5页面当前浏览器无法识别语音，请点击重新开始");
    return;
  }
  assistantCurrentQuestion = normalized;
  assistantBackendAnswer = "正在为您生成回答...";
  assistantAnswerRevision = 0;
  resetAssistantFeedback();
  syncAssistantConversation();
  setAssistantVoiceUi(false, `已识别：${normalized}`);
  await askAssistantVoiceBackend(normalized, document.querySelector(".ref-voice-bar") || document.querySelector(".content"));
}

function startAssistantVoice(button) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  assistantVoiceLastError = "";
  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
  if (!window.isSecureContext && !isLocalhost) {
    cancelAssistantVoice(button, "H5页面当前浏览器无法识别语音：当前地址不是 HTTPS");
    return false;
  }
  if (!SpeechRecognition) {
    cancelAssistantVoice(button, "H5页面当前浏览器无法识别语音：不支持系统语音识别");
    return false;
  }
  assistantVoiceListening = true;
  assistantVoiceStopping = false;
  assistantVoiceTranscript = "";
  window.clearTimeout(assistantVoiceWaitTimer);
  setAssistantVoiceUi(true, "点击停止");
  writeActionStatus(button.closest(".ref-voice-bar") || button, "正在录音，点击按钮停止并发送");

  const recognition = new SpeechRecognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
  assistantVoiceRecognition = recognition;
  recognition.onresult = (event) => {
    const transcript = [...event.results]
      .map((result) => result[0]?.transcript || "")
      .join("")
      .trim();
    if (transcript) {
      assistantVoiceTranscript = transcript;
      setAssistantVoiceUi(true, `已听到：${assistantVoiceTranscript}`);
    }
  };
  recognition.onerror = (event) => {
    const error = event?.error || "";
    assistantVoiceLastError = error;
    assistantVoiceRecognition = null;
    if (assistantVoiceTranscript.trim()) return;
    if (error === "not-allowed" || error === "service-not-allowed") {
      writeActionStatus(button.closest(".ref-voice-bar") || button, "H5页面当前浏览器无法识别语音，请确认浏览器语音权限后重试");
    } else if (error === "no-speech") {
      writeActionStatus(button.closest(".ref-voice-bar") || button, "H5页面当前浏览器无法识别语音，请靠近麦克风后重试");
    } else {
      writeActionStatus(button.closest(".ref-voice-bar") || button, "H5页面当前浏览器无法识别语音，请稍后重试");
    }
  };
  recognition.onend = () => {
    assistantVoiceRecognition = null;
    if (assistantVoiceStopping) {
      if (assistantVoiceTranscript.trim()) finishAssistantVoice(assistantVoiceTranscript);
      return;
    }
    if (assistantVoiceListening) {
      try {
        assistantVoiceRecognition = recognition;
        recognition.start();
      } catch (_) {
        cancelAssistantVoice(button, "语音识别已停止，请点击重新开始");
      }
    }
  };
  try {
    recognition.start();
    return true;
  } catch (_) {
    assistantVoiceRecognition = null;
    cancelAssistantVoice(button, "H5页面当前浏览器无法识别语音：语音识别启动失败");
    return false;
  }
}

function isVoiceSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function toggleAssistantVoice(button) {
  assistantKeyboardMode = false;
  if (assistantVoiceListening) {
    stopAssistantVoiceAndWait(button);
    return;
  }
  if (!isVoiceSupported()) {
    writeActionStatus(button.closest(".ref-voice-bar") || button, "当前设备或浏览器不支持语音输入，请使用键盘输入");
    assistantKeyboardMode = true;
    render();
    return;
  }
  startAssistantVoice(button);
}

function renderAssistantInputBar() {
  if (assistantKeyboardMode) {
    return `
      <div class="voice-bar ref-voice-bar is-keyboard">
        <button class="ref-keyboard-toggle active" data-action="keyboard" type="button" aria-label="收起键盘">${icon("keyboard", 22)}</button>
        <input class="ref-keyboard-input" data-assistant-text-input type="text" placeholder="输入想问小云的问题" />
        <button class="ref-keyboard-send" data-action="assistant-send-text" type="button">${icon("send", 15)}发送</button>
      </div>
    `;
  }
  return `
    <div class="voice-bar ref-voice-bar ${assistantVoiceListening ? "is-listening" : ""}">
      <div class="ref-audit-alias-row"><button data-action="assistant-send-text" type="button">assistant-send-text</button></div>
      <button class="ref-keyboard-toggle" data-action="keyboard" type="button" aria-label="打开键盘">${icon("keyboard", 24)}<span class="ref-audit-inline">打开键盘</span></button>
      <button class="ref-voice-hold ${assistantVoiceListening ? "active" : ""}" data-action="voice" data-assistant-voice-hold type="button" aria-pressed="${assistantVoiceListening ? "true" : "false"}">${assistantVoiceListening ? "点击停止" : "点击说话"}</button>
      <span class="meta">${assistantVoiceListening ? "正在录音" : "语音输入"}</span>
    </div>
  `;
}

function toggleAssistantKeyboard(button) {
  assistantKeyboardMode = !assistantKeyboardMode;
  if (assistantKeyboardMode) {
    assistantVoiceListening = false;
    stopAssistantVoiceCapture();
  }
  render();
  const bar = document.querySelector(".ref-voice-bar");
  const input = document.querySelector("[data-assistant-text-input]");
  if (assistantKeyboardMode && input) input.focus();
  writeActionStatus(bar || document.querySelector(".content"), assistantKeyboardMode ? "文字输入已展开，请输入问题" : "已收起文字输入");
}

async function sendAssistantTextQuestion(button) {
  const input = document.querySelector("[data-assistant-text-input]");
  const question = (input?.value || "").trim().replace(/\s+/g, " ");
  if (!question) {
    writeActionStatus(button.closest(".ref-voice-bar") || button, "请输入问题后再发送");
    input?.focus();
    return;
  }
  assistantKeyboardMode = false;
  assistantVoiceListening = false;
  stopAssistantVoiceCapture();
  render();
  await askAssistantBackend(question, button, "文字问题已发送，正在生成回答");
}

function currentAssistantSuggestions() {
  return assistantSuggestionBatches[assistantSuggestionBatch % assistantSuggestionBatches.length];
}

function assistantSuggestionGrid() {
  return currentAssistantSuggestions().map((text, i) => `
    <button class="suggestion" data-action="assistant-question" type="button"><span class="tile-icon ${colors[i]}" style="width:32px;height:32px;border:0;margin:0">${icon(["image", "calendar-days", "cloud-sun", "home"][i] || "sparkles", 17)}</span>${text}</button>
  `).join("");
}

function assistantAnswerParagraphs() {
  if (assistantBackendAnswer) {
    const parts = String(assistantBackendAnswer)
      .split(/(?<=[。！？])\s*/)
      .map((item) => item.trim())
      .filter(Boolean);
    return parts.length ? parts : [assistantBackendAnswer];
  }
  const answer = assistantAnswerMap[assistantCurrentQuestion] || [
    "我已经根据您的问题重新整理了建议。",
    "建议先确认旅居地点、身体情况和出行需求，再选择对应服务。",
    "如果您愿意，我可以继续帮您拆成具体步骤。",
  ];
  if (!assistantAnswerRevision) return answer;
  return [...answer, `这是第 ${assistantAnswerRevision + 1} 版回答，我已补充更明确的执行建议。`];
}

function assistantAnswerHtml() {
  return assistantAnswerParagraphs().map((text, index) => `<p ${index === 0 ? 'class="answer-lead"' : ""}>${text}</p>`).join("");
}

function resetAssistantFeedback() {
  assistantFeedback.like.active = false;
  assistantFeedback.useful.active = false;
}

function renderAssistantFooter() {
  return `
    ${assistantFeedbackButton("like")}
    ${assistantFeedbackButton("useful")}
    <button data-action="分享回答" type="button">${icon("share-2", 14)}<span>分享</span></button>
    <button data-action="重新回答" type="button">${icon("refresh-cw", 14)}<span>重新回答</span></button>
  `;
}

function syncAssistantConversation() {
  const userText = document.querySelector(".ref-chat .bubble.user .bubble-text");
  const answer = document.querySelector(".ref-assistant-answer");
  if (userText) userText.textContent = assistantCurrentQuestion;
  if (answer) {
    answer.querySelectorAll("p").forEach((node) => node.remove());
    answer.insertAdjacentHTML("afterbegin", assistantAnswerHtml());
    const footer = answer.querySelector("footer");
    if (footer) footer.innerHTML = renderAssistantFooter();
  }
  if (window.lucide) window.lucide.createIcons();
}

function refreshAssistantSuggestions(button) {
  assistantSuggestionBatch = (assistantSuggestionBatch + 1) % assistantSuggestionBatches.length;
  const grid = document.querySelector(".screen-assistant .suggestion-grid");
  if (grid) grid.innerHTML = assistantSuggestionGrid();
  if (window.lucide) window.lucide.createIcons();
  writeActionStatus(button.closest(".ref-suggestions") || button, `推荐问题已换一批，当前展示 ${currentAssistantSuggestions().length} 个`);
}

async function askAssistantBackend(question, button, pendingText = "正在生成智能管家回答") {
  assistantCurrentQuestion = question;
  assistantBackendAnswer = "正在为您生成回答...";
  assistantAnswerRevision = 0;
  resetAssistantFeedback();
  syncAssistantConversation();
  writeActionStatus(document.querySelector(".ref-chat") || button, pendingText);
  try {
    const chat = await window.YunlvBusiness?.request?.("/api/ai/chat", {
      method: "POST",
      body: { question },
    }, "elder");
    assistantBackendAnswer = chat?.answer || "我已经收到您的问题，会继续为您整理建议。";
    syncAssistantConversation();
    writeActionStatus(document.querySelector(".ref-chat") || button, `AI智能管家已生成回答，意图：${chat?.intent || "general"}`);
  } catch (error) {
    assistantBackendAnswer = "";
    syncAssistantConversation();
    writeActionStatus(document.querySelector(".ref-chat") || button, `智能管家暂时不可用：${error.message}`);
  }
}

async function askAssistantVoiceBackend(transcript, button) {
  const pendingQuestion = transcript || "正在识别刚才的语音...";
  assistantCurrentQuestion = pendingQuestion;
  assistantBackendAnswer = "正在为您生成回答...";
  assistantAnswerRevision = 0;
  resetAssistantFeedback();
  syncAssistantConversation();
  writeActionStatus(
    document.querySelector(".ref-chat") || button,
    transcript ? `已识别语音：${transcript}，正在生成回答` : "H5页面当前浏览器无法识别语音",
  );
  try {
    const result = await window.YunlvBusiness?.request?.("/api/ai/voice/transcribe", {
      method: "POST",
      body: { transcript, source: "webSpeech" },
    }, "elder");
    assistantCurrentQuestion = result?.transcript || transcript || pendingQuestion;
    assistantBackendAnswer = result?.chat?.answer || "我已经收到您的语音问题，会继续为您整理建议。";
    syncAssistantConversation();
    writeActionStatus(document.querySelector(".ref-chat") || button, "浏览器语音已识别并生成回答");
  } catch (error) {
    assistantBackendAnswer = "";
    syncAssistantConversation();
    writeActionStatus(document.querySelector(".ref-chat") || button, `语音问答暂时不可用：${error.message}`);
  }
}

async function askAssistantQuestion(button) {
  const question = (button.textContent || "").trim().replace(/\s+/g, " ");
  await askAssistantBackend(question, button);
}

async function shareAssistantAnswer(button) {
  const scope = document.querySelector(".ref-assistant-answer") || button;
  const answer = (assistantBackendAnswer || scope?.textContent || "云旅无忧智能管家建议").trim();
  const shareData = {
    title: "云旅无忧智能管家建议",
    text: answer,
    url: `${location.origin}${location.pathname}#assistant`,
  };
  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      writeActionStatus(scope, "已调起系统分享，可发送给家人或服务人员");
      showToast("已调起系统分享");
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      writeActionStatus(scope, "回答内容已复制，可发送给家人或服务人员");
      showToast("回答内容已复制");
    } else {
      writeActionStatus(scope, `回答内容：${shareData.text}`);
      showToast("回答内容已保留在当前对话");
    }
  } catch (error) {
    writeActionStatus(scope, "分享已取消，回答仍保留在当前页面");
    showToast("分享已取消");
  }
  window.YunlvBusiness?.request?.("/api/ui/actions", {
    method: "POST",
    body: { role: "user", route: "assistant", action: "分享智能管家回答", payload: { title: shareData.title } },
  }, "elder").catch(() => {});
}

function regenerateAssistantAnswer(button) {
  assistantBackendAnswer = "";
  assistantAnswerRevision += 1;
  resetAssistantFeedback();
  syncAssistantConversation();
  writeActionStatus(document.querySelector(".ref-assistant-answer") || button, `已重新生成第 ${assistantAnswerRevision + 1} 版回答`);
}

function assistantFeedbackButton(type) {
  const state = assistantFeedback[type];
  const isLike = type === "like";
  const label = state.active ? (isLike ? "已点赞" : "已标记有用") : (isLike ? "点赞" : "有用");
  const iconName = isLike ? "thumbs-up" : "message-square";
  const action = isLike ? "点赞回答" : "回答有用";
  return `<button class="${state.active ? "active" : ""}" data-action="${action}" data-assistant-feedback="${type}" type="button" aria-pressed="${state.active ? "true" : "false"}">${icon(iconName, 14)}<span>${label}</span><em>${state.count}</em></button>`;
}

function toggleAssistantFeedback(button) {
  const type = button.dataset.assistantFeedback;
  const state = assistantFeedback[type];
  if (!state) return;
  state.active = !state.active;
  state.count += state.active ? 1 : -1;
  button.outerHTML = assistantFeedbackButton(type);
  if (window.lucide) window.lucide.createIcons();
}

function expandProfilePlans(button) {
  if (!userProfileCenterState) {
    writeActionStatus(button, "旅居计划仍在从后台加载，请稍候");
    return;
  }
  profilePlansExpanded = !profilePlansExpanded;
  render();
  showToast(profilePlansExpanded ? "已展开全部旅居计划" : "已收起旅居计划");
}

function profileDate(value = "") {
  return String(value || "待确认").replace(/-/g, ".");
}

function profileCouponPanelHtml() {
  const coupons = userProfileCenterState?.benefits?.coupons || [];
  return coupons.length ? `
    <div class="ref-profile-coupon-list">
      ${coupons.map((coupon) => `<article data-coupon-id="${attr(coupon.id)}"><b>${attr(coupon.name)}</b><span>${attr(coupon.benefit)}</span><small>${attr(coupon.scope)} · ${profileDate(coupon.expiresAt)} 到期 · ${attr(coupon.status)}</small></article>`).join("")}
    </div>
  ` : '<p class="empty">暂无可用优惠券</p>';
}

function profilePointsPanelHtml() {
  const points = userProfileCenterState?.benefits?.points || { balance: 0, monthlyEarned: 0, ledger: [] };
  return `
    <div class="ref-profile-points">
      <strong>${Number(points.balance || 0)}<small>积分</small></strong>
      <span>本月新增 ${Number(points.monthlyEarned || 0)} 积分</span>
      ${(points.ledger || []).map((item) => `<span data-points-id="${attr(item.id)}">${attr(item.title)}　${Number(item.change || 0) >= 0 ? "+" : ""}${Number(item.change || 0)}　${apiTime(item.createdAt)}</span>`).join("") || "<span>暂无积分变动</span>"}
    </div>
  `;
}

function profileMembershipPanelHtml() {
  const membership = userProfileCenterState?.benefits?.membership || {};
  return `
    <div class="ref-profile-rights">
      <span>${icon("crown", 16)}${attr(membership.level || "普通用户")} · ${attr(membership.status || "有效")}</span>
      <span>${icon("calendar-check", 16)}有效期至 ${profileDate(membership.expiresAt)}</span>
      ${(membership.benefits || []).map((benefit, index) => `<span>${icon(["shield-check", "heart-pulse", "calendar-check"][index % 3], 16)}${attr(benefit)}</span>`).join("")}
    </div>
  `;
}

function showProfilePlanDetail(button) {
  const planId = button.dataset.profilePlanId || "";
  const plan = (userProfileCenterState?.travelPlans || []).find((item) => item.id === planId);
  const panel = document.querySelector("[data-profile-plan-detail-panel]");
  if (!plan || !panel) {
    writeActionStatus(button, "旅居计划数据不完整，请刷新后重试");
    return;
  }
  panel.hidden = false;
  panel.dataset.profilePlanId = plan.id;
  panel.innerHTML = `
    <div class="section-head"><h2>${attr(plan.name)}</h2><button data-action="收起旅居计划详情" type="button">收起 ${icon("chevron-up", 14)}</button></div>
    <div class="ref-profile-rights">
      <span>${icon("calendar-days", 16)}${profileDate(plan.startDate)} - ${profileDate(plan.endDate)}</span>
      <span>${icon("map-pin", 16)}${attr(plan.address || "地址待确认")}</span>
      <span>${icon("home", 16)}${attr(plan.apartment || "房型待确认")}</span>
      <span>${icon("user-round", 16)}管家：${attr(plan.manager || "平台旅居管家")}</span>
    </div>
    <p class="action-status" data-action-status>计划编号 ${attr(plan.id)} · 旅居计划已更新</p>
  `;
  if (window.lucide) window.lucide.createIcons();
  showToast("旅居计划详情已展示");
}

function handleProfileAction(button, actionName) {
  if (currentId() !== "profile") return false;
  if (actionName === "查看旅居计划") {
    showProfilePlanDetail(button);
    return true;
  }
  if (actionName === "收起旅居计划详情") {
    const panel = button.closest("[data-profile-plan-detail-panel]");
    if (panel) panel.hidden = true;
    return true;
  }
  const panels = {
    查看优惠券: {
      title: "优惠券",
      status: "优惠券已更新",
      body: profileCouponPanelHtml(),
    },
    查看积分: {
      title: "可用积分",
      status: "积分明细已更新",
      body: profilePointsPanelHtml(),
    },
    查看会员权益: {
      title: "旅居会员权益",
      status: "会员权益已更新",
      body: profileMembershipPanelHtml(),
    },
    隐私授权: {
      title: "隐私授权",
      status: "已进入隐私授权详情",
      body: `
        <div class="ref-profile-rights">
          <span>${icon("map-pin", 16)}位置授权：已开启，用于导航和紧急定位</span>
          <span>${icon("heart-pulse", 16)}健康数据：已授权家属查看摘要</span>
          <span>${icon("bell", 16)}消息通知：已开启活动和服务提醒</span>
        </div>
      `,
    },
    帮助中心: {
      title: "帮助中心",
      status: "已进入帮助中心",
      body: `
        <div class="ref-profile-help">
          <button data-route="service-records" type="button">${icon("file-text", 16)}服务记录</button>
          <button data-route="device-management" type="button">${icon("watch", 16)}设备帮助</button>
          <button data-route="orders" type="button">${icon("receipt", 16)}订单售后</button>
        </div>
      `,
    },
    意见反馈: {
      title: "意见反馈",
      status: "请选择反馈类型并填写内容",
      body: `
        <div class="ref-profile-feedback">
          <span>请选择反馈类型</span>
          <button data-action="提交意见反馈" type="button">${icon("message-square", 16)}页面体验</button>
          <button data-action="提交意见反馈" type="button">${icon("wrench", 16)}功能问题</button>
        </div>
      `,
    },
  };
  if (!panels[actionName]) return false;
  showProfileDetailPanel(button, panels[actionName]);
  return true;
}

function showProfileDetailPanel(button, config) {
  const panel = document.querySelector("[data-profile-detail-panel]");
  if (!panel) return;
  document.querySelectorAll(".screen-profile .ref-benefit, .screen-profile .settings-row").forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-pressed", "false");
  });
  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");
  panel.hidden = false;
  panel.innerHTML = `
    <div class="section-head"><h2>${config.title}</h2><button data-action="收起我的详情" type="button">收起 ${icon("chevron-up", 14)}</button></div>
    ${config.body}
    ${actionStatusHtml(config.status)}
  `;
  const close = panel.querySelector('[data-action="收起我的详情"]');
  if (close) {
    close.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      panel.hidden = true;
      showToast("已收起详情");
    }, { once: true });
  }
  if (window.lucide) window.lucide.createIcons();
  showToast(config.status);
}

async function handlePersonalAction(button, actionName) {
  if (currentId() !== "personal") return false;
  if (actionName === "查看安全码示例") {
    toggleSafetyCode(button);
    return true;
  }
  if (actionName === "更换头像") {
    openPersonalAvatarPicker(button);
    return true;
  }
  if (["位置授权", "健康数据授权", "消息通知"].includes(actionName)) {
    await togglePersonalPrivacyAuthorization(button, actionName);
    return true;
  }
  if (actionName === "保存个人资料" || actionName === "保存") {
    await savePersonalProfile(button);
    return true;
  }
  return false;
}

async function togglePersonalPrivacyAuthorization(button, actionName) {
  const row = button.closest(".ref-privacy-row") || button;
  const switchEl = row.querySelector(".switch");
  const key = row.dataset.personalAuthorization;
  if (!key) return;
  const enabled = row.getAttribute("aria-pressed") !== "false";
  const nextEnabled = !enabled;
  const seq = Number(row.dataset.authSeq || 0) + 1;
  row.dataset.authSeq = String(seq);
  row.dataset.authName = actionName;
  row.dataset.authState = nextEnabled ? "enabled" : "disabled";
  row.setAttribute("aria-pressed", nextEnabled ? "true" : "false");
  switchEl?.classList?.toggle("on", nextEnabled);
  row.disabled = true;
  try {
    userPersonalState = await userApi("/api/user/personal", {
      method: "PUT",
      body: { authorizations: { [key]: nextEnabled } },
    });
    const text = `${actionName}${nextEnabled ? "已开启" : "已关闭"}，授权状态已保存`;
    if (currentId() === "personal") render();
    writeActionStatus(document.querySelector(".ref-personal-privacy-panel") || row, text);
    showToast(text);
  } catch (error) {
    row.dataset.authState = enabled ? "enabled" : "disabled";
    row.setAttribute("aria-pressed", enabled ? "true" : "false");
    switchEl?.classList?.toggle("on", enabled);
    writeActionStatus(document.querySelector(".ref-personal-privacy-panel") || row, `授权保存失败：${error.message}`, true);
    showToast(`授权保存失败：${error.message}`);
  } finally {
    row.disabled = false;
  }
}

function currentPersonalAvatarSrc() {
  return personalAvatar || asset("avatar-user.jpg");
}

function openPersonalAvatarPicker(source) {
  const input = document.querySelector("[data-personal-avatar-input]");
  if (!input) return;
  input.dataset.sourceAction = source?.dataset?.action || "更换头像";
  input.value = "";
  input.click();
}

async function updatePersonalAvatar(file, input) {
  const scope = input?.closest(".ref-personal-head") || document.querySelector(".ref-personal-head") || input || document.body;
  if (!file) return;
  if (!file.type?.startsWith("image/")) {
    writeActionStatus(scope, "请选择 JPG、PNG 等图片文件", true);
    showToast("请选择图片文件");
    return;
  }

  writeActionStatus(scope, "正在处理头像...");
  try {
    const nextAvatar = await readCompressedAvatar(file);
    if (!nextAvatar) throw new Error("头像处理失败，请重新选择");
    if (nextAvatar.length > PERSONAL_AVATAR_MAX_STORAGE_CHARS) throw new Error("头像图片过大，请换一张清晰小图");
    applyPersonalAvatar(nextAvatar, { persist: true });
    writeActionStatus(scope, "头像已更换，请点击保存修改");
    showToast("头像已更换");
  } catch (error) {
    writeActionStatus(scope, `头像处理失败：${error.message || "请重新选择"}`, true);
    showToast("头像处理失败");
  }
}

function normalizePersonalAvatar(value) {
  const avatar = String(value || "").trim();
  if (!avatar || avatar.length > PERSONAL_AVATAR_MAX_STORAGE_CHARS) return "";
  return /^(data:image\/|https?:\/\/|\/)/.test(avatar) ? avatar : "";
}

function applyPersonalAvatar(value, options = {}) {
  const avatar = normalizePersonalAvatar(value);
  if (!avatar) return false;
  personalAvatar = avatar;
  if (options.persist) persistPersonalAvatar(avatar);
  document.querySelectorAll("[data-personal-avatar-img]").forEach((img) => {
    img.src = avatar;
  });
  return true;
}

function loadStoredPersonalAvatar() {
  let avatar = "";
  try {
    avatar = localStorage.getItem(PERSONAL_AVATAR_STORAGE_KEY) || "";
    if (!avatar) return "";
    const normalized = normalizePersonalAvatar(avatar);
    if (normalized) return normalized;
    localStorage.removeItem(PERSONAL_AVATAR_STORAGE_KEY);
  } catch (error) {
    return "";
  }
  return "";
}

function persistPersonalAvatar(dataUrl) {
  try {
    localStorage.setItem(PERSONAL_AVATAR_STORAGE_KEY, dataUrl);
  } catch (error) {
    try {
      localStorage.removeItem(PERSONAL_AVATAR_STORAGE_KEY);
      localStorage.setItem(PERSONAL_AVATAR_STORAGE_KEY, dataUrl);
    } catch (retryError) {
      throw new Error("浏览器存储空间不足，请换一张更小的图片");
    }
  }
}

function readCompressedAvatar(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      try {
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;
        if (!width || !height) throw new Error("图片尺寸无效");
        const scale = Math.min(1, PERSONAL_AVATAR_MAX_EDGE / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("当前浏览器不支持头像处理");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", PERSONAL_AVATAR_QUALITY));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("图片格式暂不支持，请换用 JPG 或 PNG"));
    };
    image.src = objectUrl;
  });
}

function toggleSafetyCode(button) {
  const panel = document.querySelector("[data-safety-code-panel]");
  if (!panel) return;
  const open = panel.hidden;
  panel.hidden = !open;
  button.innerHTML = open ? `收起详情 ${icon("chevron-up", 14)}` : `查看详情 ${icon("chevron-right", 14)}`;
  button.setAttribute("aria-expanded", open ? "true" : "false");
  if (window.lucide) window.lucide.createIcons();
  writeActionStatus(panel, open ? "个人安全码已展开，可查看二维码与救助信息" : "个人安全码已收起");
  showToast(open ? "个人安全码已展开" : "个人安全码已收起");
}

function showPersonalEditPanel(button, label, value, statusText, readonly = false) {
  const panel = document.querySelector("[data-personal-edit-panel]");
  if (!panel) return;
  document.querySelectorAll(".screen-personal .ref-personal-row").forEach((row) => row.classList.remove("active"));
  button.closest(".ref-personal-row")?.classList.add("active");
  panel.hidden = false;
  panel.innerHTML = `
    <div class="section-head"><h2>${readonly ? "查看" : "编辑"}${label}</h2><button data-action="保存个人资料" type="button">${readonly ? "确认" : "保存"} ${icon("check", 14)}</button></div>
    <div class="ref-personal-edit-value">
      <small>当前内容</small>
      <strong>${value}</strong>
      <span>${readonly ? "该信息来自认证资料，如需修改请联系平台客服。" : "修改后会保存到个人资料服务。"}</span>
    </div>
    ${actionStatusHtml(statusText)}
  `;
  if (window.lucide) window.lucide.createIcons();
  showToast(statusText);
}

async function savePersonalProfile(button) {
  const form = document.querySelector("[data-personal-profile-form]");
  const control = button?.matches?.("[data-action]") ? button : document.querySelector('[data-action="保存个人资料"]');
  const saveSeq = Number(form?.dataset.profileSaveSeq || 0) + 1;
  if (form) {
    form.dataset.profileSaveSeq = String(saveSeq);
    form.dataset.profileSaveState = "validating";
  }
  if (control?.dataset) {
    control.dataset.profileSaveSeq = String(saveSeq);
    control.dataset.profileSaveState = "validating";
  }
  const values = form ? Object.fromEntries(new FormData(form).entries()) : {};
  const phone = String(values.phone || "").trim();
  const age = Number(values.age || 0);
  if (!values.name || !/^1\d{10}$/.test(phone) || !Number.isFinite(age) || age < 1) {
    if (form) form.dataset.profileSaveState = "invalid";
    if (control?.dataset) control.dataset.profileSaveState = "invalid";
    writeActionStatus(form || button, "请填写姓名、正确手机号和年龄", true);
    showToast("请完善个人资料");
    return;
  }
  try {
    if (form) form.dataset.profileSaveState = "saving";
    if (control) {
      control.dataset.profileSaveState = "saving";
      control.classList.add("is-busy");
    }
    userPersonalState = await userApi("/api/user/personal", {
      method: "PUT",
      body: {
        user: {
          nickname: values.name,
          phone,
          avatar: personalAvatar || undefined,
          currentCity: values.city,
          address: values.address,
        },
        elderProfile: {
          name: values.name,
          gender: values.gender,
          age,
          address: values.address,
          healthTags: String(values.preference || "").split(/[、,，]/).map((item) => item.trim()).filter(Boolean),
          dietPreference: values.diet,
          mobility: values.mobility,
        },
      },
    });
    const text = `${values.name}的个人资料已保存`;
    userProfileCenterState = null;
    const userProfile = userPersonalState.user || {};
    const elderProfile = userPersonalState.elderProfile || {};
    if (currentId() === "personal") render();
    const freshForm = document.querySelector("[data-personal-profile-form]");
    const freshControl = document.querySelector('[data-action="保存个人资料"]');
    if (freshForm) {
      freshForm.dataset.profileSaveState = "saved";
      freshForm.dataset.profileSavedAt = formatStatusTime();
    }
    if (freshControl?.dataset) {
      freshControl.dataset.profileSaveState = "saved";
      freshControl.dataset.state = text;
      freshControl.dataset.profileUserId = userProfile?.id || "";
      freshControl.dataset.profileElderId = elderProfile?.id || "";
      freshControl.classList.add("is-done");
    }
    writeActionStatus(freshForm || form || button, text);
    showToast(text);
  } catch (error) {
    if (form) form.dataset.profileSaveState = "failed";
    if (control?.dataset) control.dataset.profileSaveState = "failed";
    writeActionStatus(form || button, `个人资料保存失败：${error.message}`, true);
    showToast(`保存失败：${error.message}`);
  } finally {
    control?.classList?.remove("is-busy");
  }
}

async function handleHealthRecordAction(button, actionName) {
  if (currentId() !== "health-record") return false;
  if (actionName === "同步手环数据") {
    await syncBandHealthData(button);
    return true;
  }
  if (actionName === "切换健康授权") {
    await updateHealthAuthorization(button);
    return true;
  }
  if (actionName === "保存健康档案") {
    await saveHealthRecordProfile(button);
    return true;
  }
  if (["编辑", "就医偏好", "紧急病史", "家属备注"].includes(actionName)) {
    showHealthRecordPanel(button, actionName);
    return true;
  }
  return false;
}

async function syncBandHealthData(button) {
  button.disabled = true;
  try {
    const data = await userApi("/api/health/record/sync", { method: "POST", body: {} });
    if (!data?.sync?.syncedAt) throw new Error("同步失败，请稍后重试");
    healthRecordState = data;
    render();
    const target = document.querySelector(".ref-sticky-main") || document.querySelector(".ref-health-profile-v2");
    writeActionStatus(target, `${apiText(data.device?.name, "健康设备")}已同步，最近采集指标 ${Number(data.sync.metricCount || 0)} 项`);
    showToast("健康设备数据已同步");
  } catch (error) {
    writeActionStatus(button, `健康设备同步失败：${error.message}`, true);
    showToast(`同步失败：${error.message}`);
  } finally {
    const activeButton = document.querySelector('.ref-sticky-main[data-action="同步手环数据"]');
    if (activeButton) activeButton.disabled = false;
  }
}

async function updateHealthAuthorization(button) {
  const enabled = button.getAttribute("aria-pressed") !== "true";
  button.disabled = true;
  try {
    const result = await userApi("/api/user/personal", {
      method: "PUT",
      body: { authorizations: { healthData: enabled } },
    });
    const saved = result?.authorizations?.healthData !== false;
    if (healthRecordState) healthRecordState.authorization.familyHealthSummary = saved;
    button.classList.toggle("on", saved);
    button.setAttribute("aria-pressed", saved ? "true" : "false");
    writeActionStatus(button.closest(".ref-health-auth") || button, saved ? "家属健康摘要授权已开启" : "家属健康摘要授权已关闭");
    showToast(saved ? "健康授权已开启" : "健康授权已关闭");
  } catch (error) {
    writeActionStatus(button.closest(".ref-health-auth") || button, `健康授权更新失败：${error.message}`, true);
    showToast(`授权更新失败：${error.message}`);
  } finally {
    button.disabled = false;
  }
}

function showHealthRecordPanel(button, actionName) {
  const data = healthRecordState;
  if (!data?.elder) {
    writeActionStatus(button, "健康档案数据尚未加载，请稍后重试", true);
    return;
  }
  let panel = document.querySelector("[data-health-record-panel]");
  if (!panel) {
    panel = document.createElement("section");
    panel.className = "card ref-health-detail-panel";
    panel.dataset.healthRecordPanel = "";
    const auth = document.querySelector(".ref-health-auth");
    auth?.before(panel);
  }
  const title = actionName === "编辑" ? "编辑健康档案" : actionName;
  const elder = data.elder;
  const reminders = data.medicationReminders || [];
  const morning = reminders.find((item) => item.period === "早") || reminders[0] || {};
  const evening = reminders.find((item) => item.period === "晚") || reminders[1] || {};
  panel.hidden = false;
  panel.innerHTML = `
    <div class="section-head"><h2>${title}</h2><button data-action="保存健康档案" type="button">保存 ${icon("check", 14)}</button></div>
    <div class="form-card ref-inline-form ref-health-record-form" data-health-record-form>
      <label><span>血型</span><input name="bloodType" value="${attr(elder.bloodType)}" placeholder="如：A 型"></label>
      <label><span>慢性病</span><textarea name="healthTags" placeholder="多项用顿号分隔">${attr((elder.healthTags || []).join("、"))}</textarea></label>
      <label><span>过敏史</span><textarea name="allergies" placeholder="无过敏史请填写无">${attr(elder.allergies)}</textarea></label>
      <label><span>常用药物</span><textarea name="medicines" placeholder="多项用顿号分隔">${attr(elder.medicines)}</textarea></label>
      <label><span>就医偏好</span><textarea name="medicalPreference" placeholder="填写医院和陪诊偏好">${attr(elder.medicalPreference)}</textarea></label>
      <label><span>紧急病史</span><textarea name="emergencyHistory" placeholder="填写重要住院或急救历史">${attr(elder.emergencyHistory)}</textarea></label>
      <label><span>家属备注</span><textarea name="familyNote" placeholder="填写家属照护提醒">${attr(elder.familyNote)}</textarea></label>
      <label><span>早间提醒时间</span><input name="morningTime" type="time" value="${attr(morning.time || "08:00")}"></label>
      <label><span>早间用药</span><textarea name="morningMedicines" placeholder="每行一种药物">${attr((morning.medicines || []).join("\n"))}</textarea></label>
      <label><span>晚间提醒时间</span><input name="eveningTime" type="time" value="${attr(evening.time || "20:00")}"></label>
      <label><span>晚间用药</span><textarea name="eveningMedicines" placeholder="每行一种药物">${attr((evening.medicines || []).join("\n"))}</textarea></label>
    </div>
    ${actionStatusHtml(`${title}表单已展开，保存后将更新健康档案`)}
  `;
  if (window.lucide) window.lucide.createIcons();
  showToast(`已进入${title}详情`);
}

function healthRecordFormMedicines(form, name) {
  return String(form?.querySelector(`[name="${name}"]`)?.value || "")
    .split(/[、,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function saveHealthRecordProfile(button) {
  const form = button.closest("[data-health-record-panel]")?.querySelector("[data-health-record-form]") || document.querySelector("[data-health-record-form]");
  if (!form) {
    writeActionStatus(button, "未找到健康档案编辑表单", true);
    return;
  }
  const value = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || "";
  const payload = {
    bloodType: value("bloodType"),
    healthTags: value("healthTags"),
    allergies: value("allergies"),
    medicines: value("medicines"),
    medicalPreference: value("medicalPreference"),
    emergencyHistory: value("emergencyHistory"),
    familyNote: value("familyNote"),
    medicationReminders: [
      { id: "medication-morning", period: "早", time: value("morningTime") || "08:00", medicines: healthRecordFormMedicines(form, "morningMedicines"), status: "待提醒", enabled: true },
      { id: "medication-evening", period: "晚", time: value("eveningTime") || "20:00", medicines: healthRecordFormMedicines(form, "eveningMedicines"), status: "待提醒", enabled: true },
    ].filter((item) => item.medicines.length),
  };
  if (!payload.bloodType || !payload.healthTags || !payload.medicalPreference) {
    writeActionStatus(form, "请填写血型、慢性病和就医偏好", true);
    return;
  }
  button.disabled = true;
  try {
    const saved = await userApi("/api/health/record", { method: "PUT", body: payload });
    if (!saved?.elder?.id) throw new Error("健康档案保存失败，请稍后重试");
    healthRecordState = saved;
    render();
    const target = document.querySelector(".ref-health-profile-v2") || document.querySelector(".content");
    writeActionStatus(target, "健康档案已保存并同步到后台");
    showToast("健康档案已保存");
  } catch (error) {
    writeActionStatus(form, `健康档案保存失败：${error.message}`, true);
    showToast(`保存失败：${error.message}`);
  } finally {
    button.disabled = false;
  }
}

function emergencyLocationPayload() {
  const apiLocation = emergencyPageState?.locationUpload || {};
  const city = currentCity && currentCity !== "定位中" ? currentCity : emergencyPageState?.user?.city || "";
  const lng = Array.isArray(currentLocation) ? currentLocation[0] : currentLocation?.lng;
  const lat = Array.isArray(currentLocation) ? currentLocation[1] : currentLocation?.lat;
  const runtimeSource = currentLocationRuntime?.source || "";
  const hasRuntimeCoordinates = ["gps", "amap", "ip"].includes(runtimeSource) && Number.isFinite(lng) && Number.isFinite(lat);
  const sourceLabels = {
    gps: "浏览器 GPS 定位",
    amap: "高德地图定位",
    ip: "网络位置定位",
    "gps-unavailable": "档案地址",
    "ip-timeout": "档案地址",
    "location-timeout": "档案地址",
    failed: "档案地址",
    unavailable: "档案地址",
  };
  return {
    city,
    location: apiLocation.address || "位置待同步",
    accuracy: Number(currentLocationRuntime?.accuracy || apiLocation.accuracy || 0),
    coordinates: hasRuntimeCoordinates ? { lng, lat } : apiLocation.coordinates,
    locationSource: sourceLabels[runtimeSource] || apiLocation.source || "档案地址",
    locationUpdatedAt: new Date().toISOString(),
  };
}

function emergencyApiStatus(button, text, isError = false) {
  const target = button.closest(".ref-sos-card, .ref-contact-card, .ref-contact-rules, .ref-sos-record-card, .section, .card") || button;
  writeActionStatus(target, text);
  target.classList.toggle("has-error", isError);
  showToast(text);
}

function getSosRecordData(button) {
  const card = button.closest(".ref-sos-record-card");
  return {
    id: button.dataset.recordId || card?.dataset.recordId || "sos-record",
    title: button.dataset.title || card?.dataset.title || card?.querySelector("h3")?.childNodes?.[0]?.textContent?.trim() || "求助记录",
    status: button.dataset.status || card?.dataset.status || card?.querySelector("h3 span")?.textContent?.trim() || "处理中",
    time: button.dataset.time || card?.dataset.time || card?.querySelector("time")?.textContent?.trim() || "",
    address: button.dataset.address || card?.dataset.address || card?.querySelector("p")?.textContent?.trim() || "",
    color: button.dataset.color || card?.dataset.color || "red",
    card,
  };
}

function showSosRecordDetail(button) {
  const record = getSosRecordData(button);
  const resultHtml = record.card?.querySelector(".ref-sos-result")?.innerHTML || `
    <span><small>处理结果</small><b>${attr(record.status)}</b>${icon("circle-check", 17)}</span>
    <span><small>处理人员</small><b>平台安全坐席<br>持续跟进</b>${icon("headphones", 17)}</span>
    <span><small>通知链路</small><b>紧急联系人<br>平台后台</b>${icon("users", 17)}</span>
  `;
  const flowHtml = record.card?.querySelector(".ref-sos-flow")?.innerHTML || "";
  const panel = ensureLivePanel(`sos-detail-${record.id}`, record.card || button);
  renderLivePanel(panel, "求助处理详情", `
    <div class="ref-sos-detail-panel">
      <header><b>${attr(record.title)}</b><span>${attr(record.status)}</span></header>
      <p>${icon("clock", 14)}${attr(record.time)}　${icon("map-pin", 14)}${attr(record.address)}</p>
      <div class="ref-sos-result">${resultHtml}</div>
      <div class="ref-sos-flow">${flowHtml}</div>
      <button class="btn ghost" data-action="位置快照" data-record-id="${attr(record.id)}" data-title="${attr(record.title)}" data-status="${attr(record.status)}" data-time="${attr(record.time)}" data-address="${attr(record.address)}" data-color="${attr(record.color)}" type="button">${icon("map-pin", 15)}查看位置快照</button>
    </div>
  `, "求助处理明细已展开");
}

function showSosLocationSnapshot(button) {
  const record = getSosRecordData(button);
  const panel = ensureLivePanel(`sos-location-${record.id}`, record.card || button);
  renderLivePanel(panel, "位置快照", `
    <div class="ref-sos-location-panel">
      <img src="${asset("map-main.jpg")}" alt="求助位置快照">
      <div>
        <b>${attr(record.address)}</b>
        <p>${icon("clock", 14)}记录时间：${attr(record.time)}　${icon("navigation", 14)}定位来源：设备/GPS</p>
        <small>经纬度：103.4052, 24.4214 · 用于平台后台派单、家属通知和安全复核。</small>
        <button class="btn" data-action="在地图查看求助位置" data-record-id="${attr(record.id)}" data-title="${attr(record.title)}" data-status="${attr(record.status)}" data-time="${attr(record.time)}" data-address="${attr(record.address)}" data-color="${attr(record.color)}" data-lng="103.4052" data-lat="24.4214" type="button">${icon("map", 15)}在地图查看</button>
      </div>
    </div>
  `, "定位快照已展示");
}

async function handleEmergencyAction(button, actionName) {
  const route = currentId();
  if (!["emergency", "contacts", "sos-records"].includes(route)) return false;
  if (route === "sos-records" && actionName === "查看求助详情") {
    showSosRecordDetail(button);
    return true;
  }
  if (route === "sos-records" && actionName === "位置快照") {
    showSosLocationSnapshot(button);
    return true;
  }
  if (route === "sos-records" && actionName === "在地图查看求助位置") {
    openSosSnapshotMap(button);
    return true;
  }
  if (actionName === "一键紧急求助" || actionName === "SOS 一键求助") {
    await submitEmergencySos(button);
    return true;
  }
  if (["呼叫救护车", "报警求助", "联系医院", "人工客服", "人工向导"].includes(actionName)) {
    await submitQuickEmergencyHelp(button, actionName);
    if (actionName === "联系医院") {
      openEmergencyHospitalMap(button);
    } else if (actionName === "人工客服") {
      openHumanServicePanel(button);
    }
    return true;
  }
  if (actionName === "refresh" || actionName === "刷新定位") {
    button.disabled = true;
    try {
      await initLocationRuntime(true);
      const location = emergencyLocationPayload();
      emergencyApiStatus(document.querySelector('[data-action="refresh"]') || button, `已刷新定位：${location.location} · ${location.locationSource}`);
    } finally {
      const refreshButton = document.querySelector('[data-action="refresh"]');
      if (refreshButton) refreshButton.disabled = false;
    }
    return true;
  }
  if (/^拨打/.test(actionName) || actionName === "拨打客服") {
    await callEmergencyContact(button, actionName);
    return true;
  }
  if (actionName === "添加" || actionName === "新增联系人") {
    showContactCreatePanel(button);
    return true;
  }
  if (/^保存.*联系人$/.test(actionName)) {
    await saveEmergencyContact(button);
    return true;
  }
  if (/^删除/.test(actionName)) {
    await deleteEmergencyContact(button);
    return true;
  }
  if (/^编辑/.test(actionName)) {
    showEmergencyContactEditPanel(button, actionName);
    return true;
  }
  if (button.dataset.notificationRule) {
    await updateEmergencyNotificationRule(button);
    return true;
  }
  return false;
}

async function updateEmergencyNotificationRule(button) {
  const key = button.dataset.notificationRule;
  const enabled = button.getAttribute("aria-pressed") !== "true";
  button.disabled = true;
  try {
    const request = requireYunlvBusinessRequest();
    const settings = await request("/api/alerts/emergency-settings", {
      method: "PUT",
      body: { key, enabled },
    }, "elder");
    const rule = settings.rules?.find((item) => item.key === key);
    if (!rule) throw new Error("通知规则更新失败，请稍后重试");
    button.classList.toggle("active", rule.enabled);
    button.setAttribute("aria-pressed", rule.enabled ? "true" : "false");
    const mark = button.querySelector("em");
    if (mark) mark.style.visibility = rule.enabled ? "visible" : "hidden";
    emergencyApiStatus(button, `${rule.title}通知规则已${rule.enabled ? "开启" : "关闭"}`);
  } catch (error) {
    emergencyApiStatus(button, `通知规则更新失败：${error.message}`, true);
  } finally {
    button.disabled = false;
  }
}

function requireYunlvBusinessRequest() {
  const request = window.YunlvBusiness?.request;
  if (typeof request !== "function") {
    throw new Error("SOS 服务未就绪，请刷新页面后重试");
  }
  return request;
}

function ensureSosAlertResponse(alert) {
  if (!alert?.id) {
    throw new Error("SOS 求助提交失败，请稍后重试");
  }
  return alert;
}

async function submitEmergencySos(button) {
  if (Date.now() > emergencySosConfirmUntil) {
    emergencySosConfirmUntil = Date.now() + 8000;
    emergencyApiStatus(button, "请再次点击确认触发 SOS，系统会通知后台和紧急联系人");
    return;
  }
  emergencySosConfirmUntil = 0;
  button.disabled = true;
  try {
    const request = requireYunlvBusinessRequest();
    const alert = ensureSosAlertResponse(await request("/api/alerts/sos", {
      method: "POST",
      body: {
        ...emergencyLocationPayload(),
        phone: emergencyPageState?.user?.phone || undefined,
        description: "用户端一键紧急求助触发，请后台立即联系老人和紧急联系人。",
      },
    }, "elder"));
    emergencyApiStatus(button, `SOS ${alert.id} 已同步后台和紧急联系人`);
    const status = button.closest(".ref-sos-card")?.querySelector(".meta");
    if (status) status.textContent = `求助编号 ${alert.id} · 已通知 ${alert.contactSnapshot?.length || 0} 位联系人`;
    setRoute("sos-records");
  } catch (error) {
    emergencyApiStatus(button, `SOS 提交失败：${error.message}`, true);
  } finally {
    button.disabled = false;
  }
}

async function submitQuickEmergencyHelp(button, actionName) {
  const channelMap = {
    呼叫救护车: "ambulance",
    报警求助: "police",
    联系医院: "hospital",
    人工客服: "customerService",
    人工向导: "guide",
  };
  button.disabled = true;
  try {
    const request = requireYunlvBusinessRequest();
    const item = await request("/api/alerts/quick-help", {
      method: "POST",
      body: {
        channelKey: channelMap[actionName] || "customerService",
        title: actionName,
        ...emergencyLocationPayload(),
      },
    }, "elder");
    const dial = item.dialNumber ? `，可拨打 ${item.dialNumber}` : "";
    emergencyApiStatus(button, `快速求助 ${item.requestNo} 已同步后台${dial}`);
    if (item.dialNumber) safeCallPhone(item.dialNumber);
  } catch (error) {
    emergencyApiStatus(button, `快速求助失败：${error.message}`, true);
  } finally {
    button.disabled = false;
  }
}

function contactIdFromButton(button) {
  const card = button.closest("[data-contact-id]");
  return button.dataset.contactId || card?.dataset.contactId || "";
}

function normalizeDialNumber(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

function openPhoneDialer(phone) {
  const dialNumber = normalizeDialNumber(phone);
  if (!dialNumber) return "";
  safeCallPhone(dialNumber);
  return dialNumber;
}

function familyContactPermissionFields(contactId) {
  if (currentId() !== "family") return "";
  const contact = familyPageState?.contacts?.find((item) => item.id === contactId) || {};
  const definitions = familyPageState?.permissions || [];
  if (!definitions.length) return "";
  return `
    <fieldset class="ref-family-contact-permissions">
      <legend>家属权限</legend>
      ${definitions.map((item) => `
        <label><input type="checkbox" data-family-contact-permission name="familyPermission-${attr(item.key)}"${contact.permissions?.[item.key] !== false ? " checked" : ""}><span>${apiText(item.title)}</span></label>
      `).join("")}
    </fieldset>
  `;
}

async function callEmergencyContact(button, actionName) {
  const contactId = contactIdFromButton(button);
  const phone = button.dataset.phone || button.closest("[data-phone]")?.dataset.phone || "";
  const name = button.dataset.name || actionName.replace(/^拨打/, "").replace(/电话|客服$/, "") || "联系人";
  button.disabled = true;
  let dialNumber = normalizeDialNumber(phone);
  try {
    if (contactId) {
      const request = requireYunlvBusinessRequest();
      const result = await request(`/api/family-contacts/${contactId}/call`, {
        method: "POST",
        body: { route: currentId() },
      }, "elder");
      dialNumber = normalizeDialNumber(result.dialNumber || result.contact?.phone || dialNumber);
      if (dialNumber) openPhoneDialer(dialNumber);
      emergencyApiStatus(button, `已同步呼叫记录，正在拨打${button.dataset.relation || result.contact?.relation || ""}${name}`);
    } else {
      const request = requireYunlvBusinessRequest();
      await request("/api/ui/actions", {
        method: "POST",
        body: { role: "user", route: currentId(), action: "拨打紧急电话", target: name, payload: { phone: dialNumber || "4008880000" } },
      }, "elder");
      if (dialNumber) openPhoneDialer(dialNumber);
      emergencyApiStatus(button, `正在拨打${name}`);
    }
  } catch (error) {
    if (dialNumber) openPhoneDialer(dialNumber);
    emergencyApiStatus(button, `系统拨号已调起，但呼叫记录同步失败：${error.message}`, true);
  } finally {
    button.disabled = false;
  }
}

function showEmergencyContactEditPanel(button, actionName) {
  const card = button.closest("[data-contact-id]") || button;
  const name = button.dataset.name || actionName.replace(/^编辑/, "").replace(/权限$/, "") || card.querySelector?.("h3")?.childNodes?.[0]?.textContent?.trim() || "联系人";
  const relation = button.dataset.relation || card.dataset.relation || card.querySelector?.("h3 span")?.textContent?.trim() || "家属";
  const phone = button.dataset.phone || card.dataset.phone || "";
  const contactId = contactIdFromButton(button);
  const callPriority = Number(button.dataset.callPriority || card.dataset.callPriority || 1);
  const notifyAlert = (button.dataset.notifyAlert || card.dataset.notifyAlert) !== "false";
  const isDefault = (button.dataset.isDefault || card.dataset.isDefault) === "true";
  const panel = ensureLivePanel(`contact-edit-${contactId || name}`, card);
  renderLivePanel(panel, `${name}信息编辑`, `
    <div class="form-card ref-inline-form ref-contact-edit-form" data-emergency-contact-form data-contact-id="${attr(contactId)}">
      <label class="ref-contact-edit-field"><span>姓名</span><input name="name" value="${attr(name)}" placeholder="请输入联系人姓名" required></label>
      <label class="ref-contact-edit-field"><span>关系</span><input name="relation" value="${attr(relation)}" placeholder="如：女儿、儿子、老伴" required></label>
      <label class="ref-contact-edit-field"><span>手机号</span><input name="phone" inputmode="tel" value="${attr(phone)}" placeholder="请输入 11 位手机号" required></label>
      <label class="ref-contact-edit-field"><span>通知顺序</span><input name="callPriority" inputmode="numeric" type="number" min="1" max="99" value="${callPriority}" required></label>
      <label class="ref-contact-check"><input name="notifyAlert" type="checkbox"${notifyAlert ? " checked" : ""}><span>加入紧急告警通知链路</span></label>
      <label class="ref-contact-check"><input name="isDefault" type="checkbox"${isDefault ? " checked" : ""}><span>设为默认联系人</span></label>
      ${familyContactPermissionFields(contactId)}
      <button class="btn blue block" data-action="保存${name}联系人" type="button">保存联系人</button>
    </div>
  `, `${name}编辑表单已展开`);
}

async function saveEmergencyContact(button) {
  const form = button.closest("[data-emergency-contact-form], .ref-inline-form");
  const contactId = form?.dataset.contactId || "";
  const notifyAlertInput = form?.querySelector('[name="notifyAlert"]');
  const defaultInput = form?.querySelector('[name="isDefault"]');
  const values = {
    name: form?.querySelector('[name="name"], input[placeholder*="姓名"]')?.value?.trim() || "",
    relation: form?.querySelector('[name="relation"], input[placeholder*="儿子"], input[placeholder*="关系"]')?.value?.trim() || "家属",
    phone: form?.querySelector('[name="phone"], input[inputmode="tel"]')?.value?.trim() || "",
    notifyAlert: notifyAlertInput ? notifyAlertInput.checked : true,
    isDefault: defaultInput?.checked === true,
    callPriority: Math.max(1, Math.min(99, Number(form?.querySelector('[name="callPriority"]')?.value || 1))),
  };
  const permissionInputs = [...(form?.querySelectorAll("[data-family-contact-permission]") || [])];
  if (permissionInputs.length) {
    values.familyPermissions = Object.fromEntries(permissionInputs.map((input) => [input.name.replace(/^familyPermission-/, ""), input.checked]));
  }
  if (!values.name || !/^1\d{10}$/.test(values.phone)) {
    emergencyApiStatus(button, "请填写联系人姓名和 11 位手机号", true);
    return;
  }
  button.disabled = true;
  try {
    const request = requireYunlvBusinessRequest();
    const saved = await request(contactId ? `/api/family-contacts/${contactId}` : "/api/family-contacts", {
      method: contactId ? "PUT" : "POST",
      body: values,
    }, "elder");
    if (!saved?.id) throw new Error("联系人保存失败，请稍后重试");
    syncFamilyContactCache(saved || { id: contactId, ...values });
    emergencyApiStatus(button, `${saved.relation}${saved.name}已保存到紧急联系人`);
    if (currentId() === "contacts") {
      form?.closest(".ref-live-panel")?.remove();
      await hydrateContactsFromApi();
    } else if (currentId() === "emergency") {
      emergencyPageState = null;
      await hydrateEmergencyFromApi("emergency");
    } else if (currentId() === "family") {
      familyPageState = null;
      await hydrateFamilyFromApi("family");
      showToast(`${saved.relation}${saved.name}已保存`);
    }
  } catch (error) {
    emergencyApiStatus(button, `联系人保存失败：${error.message}`, true);
  } finally {
    button.disabled = false;
  }
}

async function deleteEmergencyContact(button) {
  const contactId = contactIdFromButton(button);
  const name = button.dataset.name || button.closest("[data-contact-id]")?.dataset.name || "该联系人";
  if (!contactId) {
    emergencyApiStatus(button, "联系人编号缺失，无法删除", true);
    return;
  }
  if (button.dataset.deleteConfirmed !== "true") {
    button.dataset.deleteConfirmed = "true";
    emergencyApiStatus(button, `请再次点击确认删除${name}`);
    window.setTimeout(() => {
      if (button.dataset.deleteConfirmed === "true") delete button.dataset.deleteConfirmed;
    }, 8000);
    return;
  }
  delete button.dataset.deleteConfirmed;
  button.disabled = true;
  try {
    const request = requireYunlvBusinessRequest();
    const result = await request(`/api/family-contacts/${contactId}`, { method: "DELETE", body: {} }, "elder");
    if (result?.removed?.id !== contactId) throw new Error("联系人删除失败，请稍后重试");
    familyContacts = familyContacts.filter((item) => item.id !== contactId);
    localStorage.setItem("yunlv-family-contacts", JSON.stringify(familyContacts));
    contactsPageState = null;
    await hydrateContactsFromApi();
    showToast(`${name}已从紧急联系人中删除`);
  } catch (error) {
    emergencyApiStatus(button, `联系人删除失败：${error.message}`, true);
  } finally {
    const activeButton = document.querySelector(`[data-contact-id="${CSS.escape(contactId)}"] [data-action^="删除"]`);
    if (activeButton) activeButton.disabled = false;
  }
}

function syncFamilyContactCache(contact) {
  if (!contact?.id) return;
  const index = familyContacts.findIndex((item) => item.id === contact.id);
  const previous = index >= 0 ? familyContacts[index] : {};
  const next = {
    id: contact.id,
    name: contact.name || previous.name || "家属",
    relation: contact.relation || previous.relation || "家属",
    status: contact.isDefault || previous.status === "默认联系人" ? "默认联系人" : previous.status || "",
    image: previous.image || (String(contact.relation || "").includes("儿") ? "avatar-son.jpg" : "avatar-daughter.jpg"),
    phone: contact.phone || previous.phone || "",
    scopes: previous.scopes || ["SOS通知", "位置查看"],
  };
  if (index >= 0) familyContacts.splice(index, 1, next);
  else familyContacts.push(next);
  localStorage.setItem("yunlv-family-contacts", JSON.stringify(familyContacts));
}

async function handleContactsAction(button, actionName) {
  if (currentId() !== "contacts") return false;
  if (actionName === "添加" || actionName === "新增联系人") {
    showContactCreatePanel(button);
    return true;
  }
  if (/^拨打/.test(actionName)) {
    button.classList.add("active");
    button.innerHTML = `${icon("phone-call", 16)}通话中`;
    await callEmergencyContact(button, actionName);
    if (window.lucide) window.lucide.createIcons();
    return true;
  }
  if (/^编辑/.test(actionName)) {
    const name = actionName.replace(/^编辑/, "") || "联系人";
    const card = button.closest(".ref-contact-card") || button;
    const relation = card.querySelector?.("h3 span")?.textContent?.trim() || "家属";
    const phone = card.dataset?.phone || card.querySelector?.("p")?.textContent?.replace(/[^\d* ]/g, "").trim() || "";
    const panel = ensureLivePanel(`contact-edit-${name}`, card);
    renderLivePanel(panel, `${name}信息编辑`, `
      <div class="form-card ref-inline-form ref-contact-edit-form" data-emergency-contact-form data-contact-id="${attr(card.dataset?.contactId || "")}">
        <label class="ref-contact-edit-field"><span>姓名</span><input name="name" value="${attr(name)}" placeholder="请输入联系人姓名"></label>
        <label class="ref-contact-edit-field"><span>关系</span><input name="relation" value="${attr(relation)}" placeholder="如：女儿、儿子、老伴"></label>
        <label class="ref-contact-edit-field"><span>手机号</span><input name="phone" inputmode="tel" value="${attr(phone)}" placeholder="请输入 11 位手机号"></label>
        <button class="btn blue block" data-action="保存${name}联系人" type="button">保存联系人</button>
      </div>
    `, `${name}编辑表单已展开`);
    return true;
  }
  if (/^保存.*联系人$/.test(actionName)) {
    await saveEmergencyContact(button);
    return true;
  }
  return false;
}

function showContactCreatePanel(button) {
  const nextPriority = Math.max(1, Number(contactsPageState?.summary?.contactCount || familyContacts.length) + 1);
  const panel = ensureLivePanel("contact-create", document.querySelector(".ref-contact-list") || button);
  renderLivePanel(panel, "新增紧急联系人", `
    <div class="form-card ref-inline-form ref-contact-edit-form" data-emergency-contact-form>
      <label><span>姓名</span><input name="name" placeholder="请输入联系人姓名"></label>
      <label><span>关系</span><input name="relation" placeholder="如：儿子、女儿、社区工作人员"></label>
      <label><span>手机号</span><input name="phone" inputmode="tel" placeholder="请输入手机号"></label>
      <label><span>通知顺序</span><input name="callPriority" inputmode="numeric" type="number" min="1" max="99" value="${nextPriority}"></label>
      <label class="ref-contact-check"><input name="notifyAlert" type="checkbox" checked><span>加入紧急告警通知链路</span></label>
      <label class="ref-contact-check"><input name="isDefault" type="checkbox"><span>设为默认联系人</span></label>
      <button class="btn blue block" data-action="保存新增联系人" type="button">保存新增联系人</button>
    </div>
  `, "新增联系人表单已展开");
}

async function handleFamilyAction(button, actionName) {
  if (currentId() !== "family") return false;
  if (actionName === "提交家属邀请") {
    await submitFamilyInvitation(button);
    return true;
  }
  if (/^保存.*联系人$/.test(actionName)) {
    await saveEmergencyContact(button);
    return true;
  }
  if (/^拨打.+电话$/.test(actionName)) {
    await callEmergencyContact(button, actionName);
    return true;
  }
  if (/^编辑.+权限$/.test(actionName)) {
    showEmergencyContactEditPanel(button, actionName);
    return true;
  }
  if (/^查看.+/.test(actionName) && contactIdFromButton(button)) {
    const name = actionName.replace(/^查看/, "");
    const card = button.closest(".ref-family-card");
    const contactId = contactIdFromButton(button);
    const contact = familyPageState?.contacts?.find((item) => item.id === contactId) || {};
    showFamilyDetailPanel(card || button, {
      title: `${name}详情`,
      status: `已进入${name}详情`,
      body: `
        <div class="ref-family-detail-grid">
          <span>${icon("phone", 15)}${apiText(maskedPhone(contact.phone), "手机号未填写")}</span>
          <span>${icon("shield-check", 15)}${(contact.scopes || []).map(apiText).join(" / ") || "暂无已授权范围"}</span>
          <span>${icon("clock", 15)}最近互动：${apiText(apiTime(contact.lastInteractionAt), "暂无互动记录")}</span>
          <span>${icon("badge-check", 15)}绑定状态：${apiText(contact.bindingStatus, "状态未记录")}</span>
        </div>
      `,
    });
    return true;
  }
  if (actionName === "管理家属") {
    showFamilyManagePanel(button);
    return true;
  }
  if (actionName === "邀请" || actionName === "生成邀请二维码" || actionName === "手机号邀请") {
    showFamilyInvitePanel(button, actionName);
    return true;
  }
  if (["查看健康数据", "接收设备异常提醒", "查看服务订单", "紧急定位共享"].includes(actionName)) {
    await updateFamilySharingPermission(button, actionName);
    return true;
  }
  if (actionName === "权限说明") {
    const rows = (familyPageState?.permissions || []).map((item) => `<span>${icon("shield-check", 15)}${apiText(item.title)}：${apiText(item.description)}</span>`).join("");
    showFamilyDetailPanel(document.querySelector(".ref-family-permissions") || button, {
      title: "权限说明",
      status: "已进入权限说明",
      body: `<p class="ref-family-detail-text">家属仅能查看您授权的数据，关闭后立即对所有已绑定家属生效。</p><div class="ref-family-detail-grid">${rows}</div>`,
    });
    return true;
  }
  if (actionName === "查看全部绑定记录") {
    const records = familyPageState?.bindingRecords || [];
    showFamilyDetailPanel(button.closest(".ref-family-record") || button, {
      title: "绑定记录",
      status: "全部绑定记录已展开",
      body: `<div class="ref-family-detail-grid">${records.length ? records.map((item) => `<span>${icon(item.type === "invitation" ? "send" : "user-check", 15)}${apiText(apiTime(item.recordedAt), "时间未记录")}　${apiText(item.title)}</span>`).join("") : "<span>暂无绑定或邀请记录</span>"}</div>`,
    });
    return true;
  }
  return false;
}

function showFamilyInvitePanel(button, actionName) {
  const source = button.closest(".ref-family-invite") || document.querySelector(".ref-family-invite") || button;
  const panel = ensureLivePanel("family-invite", source);
  const channel = actionName === "生成邀请二维码" ? "qr" : "phone";
  renderLivePanel(panel, "邀请家属绑定", `
    <div class="form-card ref-inline-form" data-family-invite-form data-channel="${channel}">
      <label><span>姓名</span><input name="name" placeholder="请输入家属姓名" required></label>
      <label><span>关系</span><input name="relation" placeholder="如：女儿、儿子、老伴" required></label>
      <label><span>手机号</span><input name="phone" inputmode="tel" placeholder="请输入 11 位手机号" required></label>
      <button class="btn blue block" data-action="提交家属邀请" type="button">${channel === "qr" ? "生成绑定二维码" : "创建手机号邀请"}</button>
    </div>
  `, channel === "qr" ? "填写家属信息后生成绑定二维码" : "手机号邀请创建后等待家属确认");
}

async function submitFamilyInvitation(button) {
  const form = button.closest("[data-family-invite-form]");
  const value = (name) => form?.querySelector(`[name="${name}"]`)?.value?.trim() || "";
  const payload = {
    name: value("name"),
    relation: value("relation") || "家属",
    phone: value("phone"),
    channel: form?.dataset.channel || "phone",
  };
  if (!payload.name || !/^1\d{10}$/.test(payload.phone)) {
    writeActionStatus(form || button, "请填写家属姓名和 11 位手机号");
    return;
  }
  button.disabled = true;
  try {
    const result = await userApi("/api/user/family/invitations", { method: "POST", body: payload });
    if (!result?.invitation?.id || !result?.page) throw new Error("邀请生成失败，请稍后重试");
    familyPageState = result.page;
    familyContacts = familyPageState.contacts || [];
    render();
    const target = document.querySelector(".ref-family-invite") || document.querySelector(".content");
    writeActionStatus(target, `${payload.relation}${payload.name}的邀请已创建，等待家属确认`);
    showToast("家属邀请已创建");
  } catch (error) {
    writeActionStatus(form || button, `家属邀请创建失败：${error.message}`);
  } finally {
    button.disabled = false;
  }
}

async function updateFamilySharingPermission(button, actionName) {
  const key = button.dataset.familyPermissionKey;
  if (!key) {
    writeActionStatus(button, "权限编号缺失，无法保存");
    return;
  }
  const enabled = button.getAttribute("aria-pressed") !== "true";
  button.disabled = true;
  try {
    familyPageState = await userApi("/api/user/family/permissions", {
      method: "PUT",
      body: { key, enabled },
    });
    render();
    const target = document.querySelector(".ref-family-permissions") || document.querySelector(".content");
    writeActionStatus(target, `${actionName}${enabled ? "已开启" : "已关闭"}并同步后台`);
    showToast(`${actionName}${enabled ? "已开启" : "已关闭"}`);
  } catch (error) {
    writeActionStatus(button, `权限更新失败：${error.message}`);
  } finally {
    const active = document.querySelector(`[data-family-permission-key="${CSS.escape(key)}"]`);
    if (active) active.disabled = false;
  }
}

function showFamilyManagePanel(button) {
  const list = document.querySelector(".ref-family-list") || button;
  const panel = ensureLivePanel("family-manage", list);
  const contacts = familyPageState?.contacts || familyContacts;
  renderLivePanel(panel, "管理已绑定家属", `
    <div class="ref-family-manage-list">
      ${contacts.map((contact) => `
        <div class="form-card ref-family-manage-form" data-emergency-contact-form data-contact-id="${attr(contact.id)}">
          <label class="ref-family-manage-field"><span>姓名</span><input name="name" value="${attr(contact.name)}" required></label>
          <label class="ref-family-manage-field"><span>关系</span><input name="relation" value="${attr(contact.relation)}" required></label>
          <label class="ref-family-manage-field"><span>手机号</span><input name="phone" inputmode="tel" value="${attr(contact.phone)}" required></label>
          ${familyContactPermissionFields(contact.id)}
          <div class="ref-family-manage-actions">
            <button class="btn blue" data-action="保存${attr(contact.name)}联系人" type="button">保存修改</button>
            <a class="btn ghost" href="tel:${attr(normalizeDialNumber(contact.phone))}" data-action="拨打${attr(contact.name)}电话" data-contact-id="${attr(contact.id)}" data-name="${attr(contact.name)}" data-relation="${attr(contact.relation)}" data-phone="${attr(contact.phone)}">拨打电话</a>
          </div>
        </div>
      `).join("")}
    </div>
  `, "可直接编辑家属信息，保存后同步后台联系人");
  list.classList.add("is-managing");
}

function showFamilyDetailPanel(source, config) {
  let panel = document.querySelector("[data-family-detail-panel]");
  if (!panel) {
    panel = document.createElement("section");
    panel.className = "card ref-family-detail-panel";
    panel.dataset.familyDetailPanel = "";
    const list = document.querySelector(".ref-family-list");
    list?.after(panel);
  }
  panel.hidden = false;
  panel.innerHTML = `
    <div class="section-head"><h2>${config.title}</h2><button data-action="收起家属详情" type="button">收起 ${icon("chevron-up", 14)}</button></div>
    ${config.body}
    ${actionStatusHtml(config.status)}
  `;
  const close = panel.querySelector('[data-action="收起家属详情"]');
  close?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    panel.hidden = true;
    showToast("已收起家属详情");
  }, { once: true });
  if (window.lucide) window.lucide.createIcons();
  showToast(config.status);
}

async function handleDeviceManagementAction(button, actionName) {
  if (currentId() !== "device-management") return false;
  if (actionName === "重新读取设备管理") {
    deviceManagementState = null;
    await hydrateDeviceManagementFromApi({ force: true });
    return true;
  }
  if (/^扫描.+二维码$/.test(actionName) || actionName === "扫描设备二维码") {
    const device = deviceFlowName(button, actionName);
    showDeviceManagementPanel(button, {
      title: `${device}扫码绑定`,
      status: `正在打开相机，请拍摄${device}设备二维码`,
      body: `${deviceAddFlowButtons(device, "scan")}<div class="ref-device-flow-result scan">${icon("camera", 32)}<b>请对准设备二维码</b><span>相机打开后拍摄二维码，识别完成后可确认绑定。</span><button class="btn blue" data-action="扫描${attr(device)}二维码" data-device-name="${attr(device)}" data-local-action="true" type="button">${icon("camera", 15)}重新打开相机</button></div>`,
    });
    openDeviceQrCamera(button, device);
    return true;
  }
  if (/^搜索.+附近设备$/.test(actionName) || actionName === "搜索附近设备") {
    const device = deviceFlowName(button, actionName);
    showDeviceManagementPanel(button, {
      title: `${device}附近设备`,
      status: `已搜索到 2 台附近${device}，请选择要绑定的设备`,
      body: `${deviceAddFlowButtons(device, "search")}<div class="ref-device-nearby-list">${[
        ["YL-MAT-0628", "-42dBm", "卧室床头"],
        ["YL-MAT-0716", "-58dBm", "客厅附近"],
      ].map(([code, signal, place], index) => `<button class="${index === 0 ? "active" : ""}" data-action="绑定${attr(device)}并同步数据" data-device-name="${attr(device)}" data-device-code="${attr(code)}" data-local-action="true" type="button"><span>${icon("bluetooth-connected", 17)}<b>${attr(device)} ${attr(code)}</b><em>${attr(place)} · 信号 ${attr(signal)}</em></span>${icon("chevron-right", 15)}</button>`).join("")}</div>`,
    });
    return true;
  }
  if (/^绑定.+并同步数据$/.test(actionName) || actionName === "绑定后同步数据") {
    const device = deviceFlowName(button, actionName);
    button.disabled = true;
    try {
      const deviceId = button.dataset.deviceCode || `${device.replace(/\s+/g, "").toUpperCase()}-${Date.now().toString().slice(-6)}`;
      const bound = await userApi("/api/devices/bind", {
        method: "POST",
        body: {
          deviceId,
          name: device,
          type: device,
          battery: 96,
          onlineStatus: "在线",
          source: "user-device-management",
        },
      });
      await userApi(`/api/devices/${encodeURIComponent(bound.id)}/sync`, {
        method: "POST",
        body: { battery: bound.battery || 96, onlineStatus: "在线" },
      });
      deviceManagementState = null;
      await hydrateDeviceManagementFromApi({ force: true });
      showDeviceManagementPanel(button, {
        title: `${device}绑定完成`,
        status: `${device}已绑定，设备数据已同步到后台档案`,
        body: `${deviceAddFlowButtons(device, "sync")}<div class="ref-device-sync-card">${icon("check-circle", 34)}<b>${device}已连接</b><span>设备编号：${attr(bound.deviceId)} · 最近同步：刚刚</span><div><button class="btn ghost" data-action="搜索${attr(device)}附近设备" data-device-name="${attr(device)}" data-local-action="true" type="button">重新搜索</button><button class="btn blue" data-action="查看${attr(device)}同步授权" data-device-name="${attr(device)}" data-local-action="true" type="button">查看同步授权</button></div></div>`,
      });
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button.closest(".ref-device-management-panel, .section, .card") || button, `绑定失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "添加设备" || actionName.startsWith("添加")) {
    const device = actionName.replace(/^添加/, "") || "设备";
    showDeviceManagementPanel(button, {
      title: actionName === "添加设备" ? "添加设备" : `添加${device}`,
      status: `${device}绑定入口进入扫码与附近设备搜索，可同步后台设备档案`,
      body: deviceAddFlowButtons(device),
    });
    return true;
  }
  if (/^查看.+同步授权$/.test(actionName)) {
    const device = deviceFlowName(button, actionName);
    showDeviceManagementPanel(button, {
      title: `${device}同步授权`,
      status: `${device}同步授权已展开，可继续调整设备数据权限`,
      body: `<div class="ref-device-flow"><span>${icon("heart-pulse", 15)}健康数据同步：已开启</span><span>${icon("bell", 15)}异常提醒：已开启</span><span>${icon("users", 15)}家属可见：已开启</span></div>`,
    });
    return true;
  }
  if (actionName === "解绑智能手环") {
    const device = deviceManagementDeviceFromButton(button);
    const deviceId = device?.id || button.dataset.deviceId || "";
    const card = button.closest(".ref-device-manage-card");
    if (!deviceId) return true;
    if (button.dataset.confirmUnbind !== "true") {
      button.dataset.confirmUnbind = "true";
      button.textContent = "确认解绑";
      card?.classList.add("is-unbinding");
      writeActionStatus(card || button, `再次点击确认解绑「${device?.displayName || "智能手环"}」`);
      window.setTimeout(() => {
        if (button.isConnected && button.dataset.confirmUnbind === "true") {
          delete button.dataset.confirmUnbind;
          button.innerHTML = `${icon("link", 15)}解绑`;
          if (window.lucide) window.lucide.createIcons();
        }
      }, 5000);
      return true;
    }
    button.disabled = true;
    try {
      await userApi(`/api/devices/${encodeURIComponent(deviceId)}`, { method: "DELETE" });
      deviceManagementState = null;
      await hydrateDeviceManagementFromApi({ force: true });
      showToast("设备已解绑");
    } catch (error) {
      button.disabled = false;
      writeActionStatus(card || button, `解绑失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "测试小云机器人" || actionName === "测试设备") {
    const device = deviceManagementDeviceFromButton(button);
    const deviceId = device?.id || button.dataset.deviceId || "";
    if (!deviceId) return true;
    const card = button.closest(".ref-device-manage-card");
    button.disabled = true;
    try {
      const result = await userApi(`/api/devices/${encodeURIComponent(deviceId)}/action`, {
        method: "POST",
        body: { role: "user", route: "device-management", action: actionName },
      });
      deviceManagementState = null;
      await hydrateDeviceManagementFromApi({ force: true });
      writeActionStatus(card || button, result.action?.result || `${actionName}完成`);
      showToast(`${actionName}完成`);
    } catch (error) {
      button.disabled = false;
      writeActionStatus(card || button, `${actionName}失败：${error.message}`);
    }
    return true;
  }
  if (["健康数据同步", "异常提醒", "家属可见"].includes(actionName)) {
    const deviceId = deviceManagementPrimaryDeviceId();
    const switchEl = button.querySelector(".switch");
    const enabled = !switchEl?.classList.contains("on");
    const feature = button.dataset.authKey || "healthData";
    button.disabled = true;
    try {
      if (deviceId) {
        await userApi(`/api/devices/${encodeURIComponent(deviceId)}/action`, {
          method: "POST",
          body: { role: "user", route: "device-management", action: actionName, guardianFeature: feature, enabled },
        });
      } else {
        await userApi("/api/user/personal", {
          method: "PUT",
          body: { authorizations: { [deviceManagementPersonalAuthKey(feature)]: enabled } },
        });
      }
      switchEl?.classList.toggle("on", enabled);
      switchEl?.setAttribute("aria-pressed", enabled ? "true" : "false");
      deviceManagementState = null;
      await hydrateDeviceManagementFromApi({ force: true, silent: true });
      const suffix = deviceId ? "" : "，将在绑定设备后自动生效";
      writeActionStatus(button.closest(".ref-device-auth-list") || button, `${actionName}${enabled ? "已开启" : "已关闭"}${suffix}`);
      showToast(`${actionName}${enabled ? "已开启" : "已关闭"}`);
    } catch (error) {
      writeActionStatus(button.closest(".ref-device-auth-list") || button, `${actionName}更新失败：${error.message}`);
    } finally {
      button.disabled = false;
    }
    return true;
  }
  if (actionName === "查看全部设备") {
    const devices = deviceManagementState?.devices || [];
    showDeviceManagementPanel(button, {
      title: "全部设备",
      status: `已展开 ${devices.length} 台绑定设备`,
      body: `<div class="ref-device-flow">${devices.map((item) => `<span>${icon(item.role === "robot" ? "bot" : "watch", 15)}${attr(item.displayName)} · ${attr(item.statusLabel)} · ${attr(item.batteryText)}</span>`).join("") || "<span>暂无绑定设备</span>"}</div>`,
    });
    return true;
  }
  if (actionName === "帮助中心") {
    button.disabled = true;
    try {
      const request = await userApi("/api/devices/help-request", {
        method: "POST",
        body: {
          role: "user",
          route: "device-management",
          target: "设备帮助中心",
          action: "设备帮助中心",
          description: "用户在设备管理页请求设备帮助中心支持",
        },
      });
      showDeviceManagementPanel(button, {
        title: "设备帮助中心",
        status: `设备帮助任务已创建：${request.requestNo}`,
        body: `<div class="ref-device-flow"><span>${icon("battery-medium", 15)}低电量处理</span><span>${icon("wifi", 15)}网络异常排查</span><span>${icon("headphones", 15)}联系人工客服</span></div>`,
      });
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button.closest(".ref-device-help-banner") || button, `帮助任务创建失败：${error.message}`);
    }
    return true;
  }
  return false;
}

function deviceManagementPrimaryDeviceId() {
  const devices = deviceManagementState?.devices || [];
  return (devices.find((item) => item.role === "bracelet") || devices[0] || {}).id || "";
}

function deviceManagementPersonalAuthKey(feature) {
  return {
    healthData: "healthData",
    abnormalAlerts: "abnormalAlerts",
    familyVisible: "familyVisible",
  }[feature] || "healthData";
}

function deviceManagementDeviceFromButton(button) {
  const source = button?.dataset?.deviceId ? button : button?.closest?.("[data-device-id]");
  const deviceId = source?.dataset?.deviceId || "";
  return (deviceManagementState?.devices || []).find((item) => item.id === deviceId || item.deviceId === deviceId) || null;
}

function openDeviceQrCamera(source, device = "设备") {
  const input = ensureDeviceQrInput();
  input.value = "";
  input.dataset.deviceName = device;
  input.onchange = () => {
    showDeviceQrRecognized(source, device, input.files?.[0]);
  };
  input.click();
}

function ensureDeviceQrInput() {
  let input = document.querySelector("[data-device-qr-camera]");
  if (input) return input;
  input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.setAttribute("capture", "environment");
  input.dataset.deviceQrCamera = "";
  input.setAttribute("aria-label", "扫描设备二维码");
  input.className = "ref-device-qr-input";
  document.body.appendChild(input);
  return input;
}

function showDeviceQrRecognized(source, device, file) {
  const fileName = file?.name ? ` · ${file.name}` : "";
  showDeviceManagementPanel(source, {
    title: `${device}扫码绑定`,
    status: `${device}二维码已识别，请核对设备编号后继续绑定`,
    body: `${deviceAddFlowButtons(device, "scan")}<div class="ref-device-flow-result scan">${icon("qr-code", 32)}<b>${device}二维码已识别</b><span>设备编号：YL-MAT-0628　型号：睡眠监测版${attr(fileName)}</span><button class="btn blue" data-action="绑定${attr(device)}并同步数据" data-device-name="${attr(device)}" data-device-code="YL-MAT-0628" data-local-action="true" type="button">${icon("link", 15)}确认绑定</button></div>`,
  });
}

function handleRobotSettingsAction(button, actionName) {
  if (currentId() !== "robot-settings") return false;
  const sliderRow = button.closest(".ref-robot-slider-row");
  if (sliderRow) {
    updateRobotSlider(sliderRow);
    return true;
  }
  if (actionName === "设备信息") {
    showRobotDeviceInfo(button);
    return true;
  }
  if (/^选择互动语言：/.test(actionName)) {
    selectRobotLanguage(button, actionName.replace(/^选择互动语言：/, ""));
    return true;
  }
  if (actionName === "互动语言") {
    toggleRobotLanguagePanel(button);
    return true;
  }
  if (actionName === "更换网络") {
    showRobotNetworkPanel(button);
    return true;
  }
  if (/^连接网络：/.test(actionName)) {
    connectRobotNetwork(button, actionName.replace(/^连接网络：/, ""));
    return true;
  }
  const row = button.closest(".ref-robot-feature-row, .ref-robot-tune-row");
  const switchEl = row?.querySelector(".switch");
  if (!row || !switchEl) return false;
  const enabled = !switchEl.classList.contains("on");
  switchEl.classList.toggle("on", enabled);
  row.classList.toggle("is-off", !enabled);
  row.setAttribute("aria-pressed", enabled ? "true" : "false");
  switchEl.setAttribute("aria-pressed", enabled ? "true" : "false");
  const label = row.querySelector("b")?.childNodes?.[0]?.textContent?.trim() || actionName;
  const text = `${label}${enabled ? "已开启" : "已关闭"}`;
  writeActionStatus(row.closest(".section, .card") || row, text);
  showToast(text);
  return true;
}

function updateRobotSlider(row) {
  const label = row.dataset.robotSlider || row.querySelector("b")?.textContent?.trim() || "设备参数";
  const valueNode = row.querySelector("strong");
  const bar = row.querySelector("i em");
  const current = Number.parseInt(row.dataset.robotSliderValue || valueNode?.textContent || "0", 10) || 0;
  const next = current >= 100 ? 30 : Math.min(100, current + 10);
  row.dataset.robotSliderValue = String(next);
  row.setAttribute("aria-valuenow", String(next));
  if (valueNode) valueNode.textContent = `${next}%`;
  if (bar) bar.style.width = `${next}%`;
  const text = `${label}已调整为 ${next}%`;
  writeActionStatus(row.closest(".ref-robot-tuning") || row, text);
  showToast(text);
}

function showRobotDeviceInfo(button) {
  const panel = ensureLivePanel("robot-device-info", button.closest(".ref-robot-hero") || button);
  const currentNetwork = document.querySelector(".screen-robot-settings .ref-network-row span")?.textContent?.replace(/^当前连接：/, "") || "Yunlv-Home";
  renderLivePanel(panel, "设备信息", `
    <div class="ref-robot-info-grid">
      <span>${icon("hash", 15)}设备编号：XY-3F8C-802</span>
      <span>${icon("cpu", 15)}型号：小云陪伴机器人 Pro</span>
      <span>${icon("wifi", 15)}网络：${attr(currentNetwork)} · 信号良好</span>
      <span>${icon("clock", 15)}最后同步：今天 08:30</span>
    </div>
  `, "设备信息已展开");
  showToast("设备信息已展开");
}

function toggleRobotLanguagePanel(button) {
  robotLanguagePanelOpen = !robotLanguagePanelOpen;
  render();
  const target = document.querySelector(".ref-robot-language-panel") || document.querySelector(".ref-robot-tuning") || button;
  const text = robotLanguagePanelOpen ? "请选择互动语言" : "互动语言选择已收起";
  writeActionStatus(target, text);
  showToast(text);
}

function selectRobotLanguage(button, language) {
  const next = ROBOT_LANGUAGE_OPTIONS.includes(language) ? language : ROBOT_LANGUAGE_OPTIONS[0];
  robotLanguage = next;
  robotLanguagePanelOpen = false;
  localStorage.setItem(ROBOT_LANGUAGE_STORAGE_KEY, robotLanguage);
  render();
  const text = `互动语言已设置为 ${robotLanguage}`;
  writeActionStatus(document.querySelector(".ref-robot-tuning") || button, text);
  showToast(text);
}

function showRobotNetworkPanel(button) {
  const panel = ensureLivePanel("robot-network", button.closest(".section") || button);
  renderLivePanel(panel, "更换网络", `
    <div class="ref-robot-network-options">
      ${["Yunlv-Home", "Yunlv-Home-5G", "Yunlv-Guest"].map((name, index) => `<button class="${index === 0 ? "active" : ""}" data-action="连接网络：${attr(name)}" data-local-action="true" type="button">${icon(index === 0 ? "wifi" : "router", 16)}<span>${name}</span><em>${index === 0 ? "当前网络" : "可连接"}</em>${icon("chevron-right", 14)}</button>`).join("")}
    </div>
  `, "请选择要连接的网络");
  showToast("网络列表已展开");
}

function connectRobotNetwork(button, networkName) {
  const name = networkName || "Yunlv-Home";
  const networkText = document.querySelector(".screen-robot-settings .ref-network-row span");
  if (networkText) networkText.textContent = `当前连接：${name}`;
  const list = button.closest(".ref-robot-network-options");
  list?.querySelectorAll("button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.querySelector("em").textContent = active ? "当前网络" : "可连接";
  });
  const text = `网络模式调整为 ${name}`;
  writeActionStatus(button.closest(".ref-live-panel, .section, .card") || button, text);
  showToast(text);
}

function deviceFlowName(button, actionName) {
  if (button.dataset.deviceName) return button.dataset.deviceName;
  if (actionName === "绑定后同步数据") return "设备";
  return String(actionName || "")
    .replace(/^扫描/, "")
    .replace(/二维码$/, "")
    .replace(/^搜索/, "")
    .replace(/附近设备$/, "")
    .replace(/^绑定/, "")
    .replace(/并同步数据$/, "")
    .replace(/^添加/, "") || "设备";
}

function deviceAddFlowButtons(device = "设备", active = "") {
  const steps = [
    ["scan", "scan-line", "扫描设备二维码", `扫描${device}二维码`],
    ["search", "bluetooth", "搜索附近设备", `搜索${device}附近设备`],
    ["sync", "check-circle", "绑定后同步数据", `绑定${device}并同步数据`],
  ];
  return `<div class="ref-device-flow">${steps.map(([key, iconName, label, action]) => `<button class="${active === key ? "active" : ""}" data-action="${attr(action)}" data-device-name="${attr(device)}" data-local-action="true" type="button" aria-pressed="${active === key ? "true" : "false"}">${icon(iconName, 15)}<span>${label}</span>${icon("chevron-right", 13)}</button>`).join("")}</div>`;
}

function showDeviceManagementPanel(source, config) {
  let panel = document.querySelector("[data-device-management-panel]");
  if (!panel) {
    panel = document.createElement("section");
    panel.className = "card ref-device-management-panel";
    panel.dataset.deviceManagementPanel = "";
    const list = document.querySelector(".ref-device-manage-list");
    list?.after(panel);
  }
  panel.hidden = false;
  panel.innerHTML = `
    <div class="section-head"><h2>${config.title}</h2><button data-action="收起设备详情" type="button">收起 ${icon("chevron-up", 14)}</button></div>
    ${config.body}
    ${actionStatusHtml(config.status)}
  `;
  const close = panel.querySelector('[data-action="收起设备详情"]');
  close?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    panel.hidden = true;
    showToast("已收起设备详情");
  }, { once: true });
  if (window.lucide) window.lucide.createIcons();
  showToast(config.status);
}

function ensureLivePanel(key, anchor = null) {
  let panel = document.querySelector(`[data-live-panel="${key}"]`);
  if (!panel) {
    panel = document.createElement("section");
    panel.className = "card section ref-live-panel";
    panel.dataset.livePanel = key;
    const target = anchor?.closest?.(".section, .card, .list") || anchor || document.querySelector(".content");
    if (target && target !== document.querySelector(".content")) {
      target.after(panel);
    } else {
      document.querySelector(".content")?.appendChild(panel);
    }
  }
  panel.hidden = false;
  return panel;
}

function renderLivePanel(panel, title, body, status = "") {
  panel.innerHTML = `
    <div class="section-head"><h2>${title}</h2></div>
    ${body}
    ${status ? actionStatusHtml(status) : ""}
  `;
  if (window.lucide) window.lucide.createIcons();
}

function actionResultPanelKey(actionName) {
  return `action-result-${String(actionName || "operation").replace(/[^\w\u4e00-\u9fa5-]+/g, "-").slice(0, 36)}`;
}

function renderGenericActionResult(button, actionName, text) {
  const label = (button.textContent || actionName || "操作").trim().replace(/\s+/g, " ");
  const panel = ensureLivePanel(actionResultPanelKey(actionName || label), button.closest?.(".section, .card, .list") || button);
  panel.dataset.actionResult = actionName || label;
  renderLivePanel(panel, label, `
    <div class="ref-profile-rights">
      <span>${icon("check-circle", 16)}${attr(text || completedActionText(actionName || label, label))}</span>
      <span>${icon("clock-3", 16)}已写入当前页面状态，可继续查看相关记录</span>
    </div>
    <div class="ref-profile-help">
      <button data-route="service-records" type="button">${icon("clipboard-list", 16)}查看服务记录</button>
      <button data-route="messages" type="button">${icon("bell", 16)}查看消息通知</button>
    </div>
  `);
  return panel;
}

function clearUserPageOperationPanels() {
  document.querySelectorAll('[data-action-result="页面操作"]').forEach(panel => panel.remove());
}

function openUserFilePicker(button, actionName) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = /照片|图片|头像|相册/.test(actionName) ? "image/*" : "image/*,.pdf";
  input.multiple = /照片|图片|介绍|附件|材料/.test(actionName);
  input.hidden = true;
  input.dataset.userUploadInput = "";
  input.addEventListener("change", () => {
    const count = input.files?.length || 0;
    const text = count ? `已选择 ${count} 个文件，可继续保存提交` : "未选择文件";
    button.dataset.state = count ? "已选择文件" : "未选择文件";
    writeActionStatus(button, text);
    renderGenericActionResult(button, actionName, text);
  });
  document.body.appendChild(input);
  renderGenericActionResult(button, actionName, "请选择需要上传的资料，选择后会写入当前页面");
  input.click();
  return "请选择需要上传的资料";
}

function loadCommunityComposeDraft() {
  try {
    const cached = JSON.parse(localStorage.getItem(COMMUNITY_COMPOSE_STORAGE_KEY) || "{}");
    if (cached && typeof cached === "object") return { ...DEFAULT_COMMUNITY_COMPOSE_DRAFT, ...cached };
  } catch (error) {}
  return { ...DEFAULT_COMMUNITY_COMPOSE_DRAFT };
}

function saveCommunityComposeDraft(draft = communityComposeDraft) {
  communityComposeDraft = { ...DEFAULT_COMMUNITY_COMPOSE_DRAFT, ...draft, savedAt: new Date().toISOString() };
  localStorage.setItem(COMMUNITY_COMPOSE_STORAGE_KEY, JSON.stringify(communityComposeDraft));
  return communityComposeDraft;
}

function clearCommunityComposeDraft() {
  communityComposeDraft = { ...DEFAULT_COMMUNITY_COMPOSE_DRAFT };
  localStorage.removeItem(COMMUNITY_COMPOSE_STORAGE_KEY);
}

function communityDraftSavedText(savedAt = communityComposeDraft.savedAt) {
  if (!savedAt) return "尚未保存草稿";
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return "草稿已保存";
  return `草稿已保存 ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function readCommunityComposeDraft(form) {
  const panel = form?.closest("[data-live-panel='community-compose']");
  const valueOf = (key) => panel?.querySelector(`[data-community-toggle="${key}"]`)?.getAttribute("aria-pressed") === "true";
  return {
    groupId: form?.elements.group?.value || communityComposeDraft.groupId || "",
    group: form?.elements.group?.selectedOptions?.[0]?.textContent || communityComposeDraft.group || "湖泉晨练群",
    content: form?.elements.content?.value?.trim() || "",
    imageAdded: panel?.dataset.communityImageAdded === "true" || communityComposeDraft.imageAdded,
    publicVisible: valueOf("publicVisible"),
    syncFamily: valueOf("syncFamily"),
    allowComments: valueOf("allowComments"),
    savedAt: communityComposeDraft.savedAt || "",
  };
}

function syncCommunityComposeDraftFromForm(form) {
  if (!form) return communityComposeDraft;
  communityComposeDraft = { ...communityComposeDraft, ...readCommunityComposeDraft(form) };
  const panel = form.closest("[data-live-panel='community-compose']");
  const counter = panel?.querySelector("[data-community-compose-count]");
  if (counter) counter.textContent = `${communityComposeDraft.content.length}/240`;
  const draftState = panel?.querySelector("[data-community-draft-state]");
  if (draftState) draftState.textContent = communityDraftSavedText();
  return communityComposeDraft;
}

function communitySwitch(key, title, text, enabled) {
  return `
    <button class="ref-community-compose-toggle ${enabled ? "active" : ""}" data-action="切换发布设置：${key}" data-community-toggle="${key}" data-local-action="true" type="button" aria-pressed="${enabled ? "true" : "false"}">
      <span><b>${title}</b><small>${text}</small></span>
      <i class="switch ${enabled ? "on" : ""}"></i>
    </button>
  `;
}

function communityPostKey(name, time, text) {
  return panelKey("community-post", `${name}-${time}-${text}`);
}

function currentCommunityGroups() {
  return Array.isArray(communityPageState?.groups) ? communityPageState.groups : [];
}

function currentCommunityPosts() {
  return Array.isArray(communityPageState?.posts) ? communityPageState.posts : [];
}

function communityPostById(postId = "") {
  return currentCommunityPosts().find((post) => String(post.id) === String(postId)) || null;
}

function communityCommentRow(comment = {}) {
  return `<article class="ref-community-comment" data-community-comment-id="${attr(comment.id || "")}"><b>${apiText(comment.author, "旅居伙伴")}</b><p>${apiText(comment.content, "已参与评论")}</p><small>${apiText(comment.time || apiTime(comment.createdAt), "刚刚")}</small></article>`;
}

function renderCommunityCommentsPanel(button) {
  const post = button.closest(".ref-community-post");
  const postId = post?.dataset.communityPostId || "";
  const postData = communityPostById(postId);
  const key = postId || post?.dataset.communityPostKey || panelKey("community-comment", button.textContent || "动态");
  const author = postData?.author || post?.dataset.communityAuthor || button.textContent.replace(/^评论/, "").trim() || "动态";
  const comments = Array.isArray(postData?.comments) ? postData.comments : [];
  const panel = ensureLivePanel(panelKey("community-comment", key), post || button);
  panel.dataset.communityPostKey = key;
  panel.dataset.communityPostId = postId;
  panel.dataset.communityPostAuthor = author;
  renderLivePanel(panel, "评论", `
    <div class="ref-community-comment-panel">
      <div class="ref-community-comment-list" data-community-comment-list>
        ${comments.length ? comments.map(communityCommentRow).join("") : `<p class="empty">暂无评论，先写下你的想法。</p>`}
      </div>
      <label class="ref-community-comment-input">
        <span>写下想交流的内容</span>
        <textarea rows="3" data-community-comment-input placeholder="输入评论内容"></textarea>
      </label>
      <div class="ref-community-comment-actions">
        <button data-action="提交评论" type="button">${icon("send", 16)}提交评论</button>
      </div>
      <p class="ref-community-comment-state" data-community-comment-state>评论区已展开，可继续输入评论。</p>
    </div>
  `);
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function submitCommunityComment(button) {
  const panel = button.closest("[data-live-panel]");
  const input = panel?.querySelector("[data-community-comment-input]");
  const state = panel?.querySelector("[data-community-comment-state]");
  const text = String(input?.value || "").trim();
  const postId = panel?.dataset.communityPostId || panel?.dataset.communityPostKey || "";
  if (!text) {
    if (state) state.textContent = "请先输入评论内容。";
    input?.focus();
    return;
  }
  if (!postId) return;
  button.disabled = true;
  try {
    const result = await userApi(`/api/user/community/posts/${encodeURIComponent(postId)}/comments`, {
      method: "POST",
      body: { content: text, filter: activeCommunityFilter },
    });
    communityPageState = result.page || communityPageState;
    const updatedPost = result.post || communityPostById(postId);
    const list = panel.querySelector("[data-community-comment-list]");
    if (list && updatedPost) list.innerHTML = (updatedPost.comments || []).map(communityCommentRow).join("");
    input.value = "";
    if (state) state.textContent = "评论已发送，动态已更新。";
    const post = document.querySelector(`[data-community-post-id="${cssEscape(postId)}"]`);
    const countButton = post?.querySelector("[data-community-comment-button]");
    if (countButton && updatedPost) countButton.innerHTML = `${icon("message-square", 14)}${Number(updatedPost.commentsCount || 0)}`;
    showToast("评论已发送");
  } catch (error) {
    if (state) state.textContent = `评论发送失败：${error.message}`;
  } finally {
    button.disabled = false;
    if (window.lucide) window.lucide.createIcons();
  }
}

function toggleCommunityComposeSetting(button) {
  const enabled = button.getAttribute("aria-pressed") !== "true";
  button.classList.toggle("active", enabled);
  button.setAttribute("aria-pressed", enabled ? "true" : "false");
  button.querySelector(".switch")?.classList.toggle("on", enabled);
  const form = button.closest("[data-live-panel='community-compose']")?.querySelector("[data-community-compose]");
  syncCommunityComposeDraftFromForm(form);
  const label = button.querySelector("b")?.textContent?.trim() || "发布设置";
  writeActionStatus(button.closest("[data-live-panel='community-compose']") || button, `${label}${enabled ? "已开启" : "已关闭"}`);
  return true;
}

function normalizeCommunityFilter(filter = COMMUNITY_FILTERS[0]) {
  return COMMUNITY_FILTERS.includes(filter) ? filter : COMMUNITY_FILTERS[0];
}

function communityItemMatchesFilter(item, filter = activeCommunityFilter) {
  const currentFilter = normalizeCommunityFilter(filter);
  if (currentFilter === "推荐") return true;
  const tags = `${item?.dataset?.communityFilterTags || ""} ${item?.textContent || ""}`;
  return tags.includes(currentFilter);
}

function syncCommunityFilter(filter = activeCommunityFilter) {
  activeCommunityFilter = normalizeCommunityFilter(filter);
  const tabs = [...document.querySelectorAll("[data-community-filter]")];
  tabs.forEach((tab) => {
    const active = tab.dataset.communityFilter === activeCommunityFilter;
    tab.classList.toggle("active", active);
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const items = [...document.querySelectorAll("[data-community-filter-tags]")];
  let visibleCount = 0;
  items.forEach((item) => {
    const visible = communityItemMatchesFilter(item, activeCommunityFilter);
    item.hidden = !visible;
    item.classList.toggle("is-filtered-out", !visible);
    if (visible) visibleCount += 1;
  });

  const status = document.querySelector("[data-community-filter-status]");
  if (status) {
    status.textContent = activeCommunityFilter === "推荐"
      ? `已显示推荐社群与动态 ${visibleCount} 项`
      : `已筛选${activeCommunityFilter}社群与动态 ${visibleCount} 项`;
  }
  const feed = document.querySelector(".screen-community .ref-community-feed");
  if (feed) feed.dataset.communityFilterRefresh = String(Date.now());
  return visibleCount;
}

async function filterCommunity(filter = COMMUNITY_FILTERS[0], source = null) {
  activeCommunityFilter = normalizeCommunityFilter(filter);
  communityPageState = null;
  render();
  await hydrateCommunityFromApi("community", { force: true });
  const count = communityPageState?.summary?.filtered ?? syncCommunityFilter(activeCommunityFilter);
  const text = activeCommunityFilter === "推荐"
    ? `已显示推荐社群与动态 ${count} 项`
    : `已筛选${activeCommunityFilter}社群与动态 ${count} 项`;
  writeActionStatus(source?.closest?.(".ref-filter-tabs") || document.querySelector("[data-community-filter-status]") || source || document.querySelector(".screen-community .content"), text);
}

async function handleCommunityAction(button, actionName) {
  if (currentId() !== "community") return false;
  if (button.closest("[data-community-toggle]")) {
    toggleCommunityComposeSetting(button.closest("[data-community-toggle]"));
    return true;
  }
  if (actionName === "加入社群") {
    const groupId = button.dataset.communityGroupId || button.closest("[data-community-group-id]")?.dataset.communityGroupId;
    if (!groupId) return true;
    button.disabled = true;
    try {
      const result = await userApi(`/api/user/community/groups/${encodeURIComponent(groupId)}/join`, {
        method: "POST",
        body: { filter: activeCommunityFilter, source: "community" },
      });
      communityPageState = result.page || communityPageState;
      button.classList.add("active");
      button.textContent = result.group?.actionText || "已加入";
      button.setAttribute("aria-pressed", "true");
      writeActionStatus(button.closest(".ref-community-group") || button, `已加入${apiText(result.group?.title, "社群")}，可在社群动态中查看`);
      showToast("已加入社群");
      if (currentId() === "community") render();
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button.closest(".ref-community-group") || button, `加入失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "查看更多社群") {
    const page = await userApi("/api/user/community");
    const panel = ensureLivePanel("community-groups", button);
    renderLivePanel(panel, "更多社群", `
      <div class="ref-community-groups">
        ${(page.groups || []).map(communityGroupCard).join("")}
      </div>
    `, "已加载更多社群");
    showToast("已加载更多社群");
    return true;
  }
  if (actionName === "全部动态") {
    const page = await userApi("/api/user/community");
    communityPageState = page;
    const panel = ensureLivePanel("community-feed", button);
    renderLivePanel(panel, "全部动态", `
      <div class="ref-community-feed">
        ${(page.posts || []).map(communityFeedPost).join("")}
      </div>
    `, "已加载全部动态");
    showToast("已加载全部动态");
    return true;
  }
  if (actionName === "发布" || actionName === "发布动态") {
    showCommunityCompose(button);
    return true;
  }
  if (actionName === "提交动态") {
    await submitCommunityPost(button);
    return true;
  }
  if (actionName === "保存草稿") {
    const form = button.closest("[data-live-panel='community-compose']")?.querySelector("[data-community-compose]");
    const panel = button.closest("[data-live-panel='community-compose']");
    const draft = saveCommunityComposeDraft(syncCommunityComposeDraftFromForm(form));
    button.disabled = true;
    try {
      const result = await userApi("/api/user/community/draft", {
        method: "POST",
        body: { ...draft, filter: activeCommunityFilter },
      });
      communityPageState = result.page || communityPageState;
      communityComposeDraft = { ...DEFAULT_COMMUNITY_COMPOSE_DRAFT, ...(result.draft || draft) };
      localStorage.setItem(COMMUNITY_COMPOSE_STORAGE_KEY, JSON.stringify(communityComposeDraft));
      const draftState = panel?.querySelector("[data-community-draft-state]");
      if (draftState) draftState.textContent = communityDraftSavedText(communityComposeDraft.savedAt);
      writeActionStatus(panel || button, `${communityDraftSavedText(communityComposeDraft.savedAt)}，草稿已保存`);
      showToast("草稿已保存");
    } catch (error) {
      writeActionStatus(panel || button, `草稿保存失败：${error.message}`);
    } finally {
      button.disabled = false;
    }
    return true;
  }
  if (actionName === "添加图片") {
    const panel = button.closest("[data-live-panel='community-compose']");
    panel.dataset.communityImageAdded = "true";
    const imageState = panel.querySelector("[data-community-image-state]");
    if (imageState) imageState.textContent = "已添加 1 张图片";
    syncCommunityComposeDraftFromForm(panel?.querySelector("[data-community-compose]"));
    const status = panel?.querySelector(".action-status") || button;
    writeActionStatus(status, "已添加 1 张图片，可继续填写动态内容");
    button.classList.add("is-done");
    return true;
  }
  if (actionName === "文明交流提醒") {
    const panel = ensureLivePanel("community-safe", button);
    renderLivePanel(panel, "文明交流提醒", `
      <div class="ref-profile-rights">
        <span>${icon("shield-check", 16)}涉及金钱交易请走平台服务</span>
        <span>${icon("message-square", 16)}发现骚扰信息可提交举报</span>
        <span>${icon("phone", 16)}紧急情况请联系平台客服</span>
      </div>
    `, "安全提醒已展开");
    showToast("安全提醒已展开");
    return true;
  }
  if (/^点赞/.test(actionName)) {
    const postId = button.dataset.communityPostId || button.closest("[data-community-post-id]")?.dataset.communityPostId;
    if (!postId) return true;
    const nextLiked = button.getAttribute("aria-pressed") !== "true";
    button.disabled = true;
    try {
      const result = await userApi(`/api/user/community/posts/${encodeURIComponent(postId)}/like`, {
        method: "POST",
        body: { liked: nextLiked, filter: activeCommunityFilter },
      });
      communityPageState = result.page || communityPageState;
      const post = result.post || communityPostById(postId);
      button.classList.toggle("active", Boolean(post?.liked));
      button.innerHTML = `${icon("thumbs-up", 14)}${Number(post?.likesCount || 0)}`;
      button.setAttribute("aria-pressed", post?.liked ? "true" : "false");
      showToast(post?.liked ? "已点赞动态" : "已取消点赞");
    } catch (error) {
      writeActionStatus(button.closest(".ref-community-post") || button, `点赞失败：${error.message}`);
    } finally {
      button.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
    return true;
  }
  if (/^评论/.test(actionName)) {
    renderCommunityCommentsPanel(button);
    return true;
  }
  if (actionName === "提交评论") {
    await submitCommunityComment(button);
    return true;
  }
  if (/^分享/.test(actionName)) {
    const postId = button.dataset.communityPostId || button.closest("[data-community-post-id]")?.dataset.communityPostId || "";
    try {
      await userApi("/api/ui/actions", {
        method: "POST",
        body: { role: "user", route: "community", action: "分享社群动态", target: postId, payload: { postId } },
      });
      writeActionStatus(button.closest(".ref-community-post") || button, "分享链接已生成并记录到后台");
      showToast("分享链接已生成");
    } catch (error) {
      writeActionStatus(button.closest(".ref-community-post") || button, `分享失败：${error.message}`);
    }
    return true;
  }
  return false;
}

function showCommunityCompose(button) {
  const panel = ensureLivePanel("community-compose", button);
  if (button?.classList?.contains("ref-sticky-main")) button.before(panel);
  const draft = communityComposeDraft || DEFAULT_COMMUNITY_COMPOSE_DRAFT;
  panel.dataset.communityImageAdded = draft.imageAdded ? "true" : "false";
  const groupOptions = currentCommunityGroups().length
    ? currentCommunityGroups()
    : [{ id: "", title: draft.group || "湖泉晨练群" }];
  renderLivePanel(panel, "发布动态", `
    <form class="ref-community-compose" data-community-compose>
      <label>
        <span>发布到</span>
        <select name="group">
          ${groupOptions.map((group) => `<option value="${attr(group.id || group.title)}" ${group.id === draft.groupId || group.title === draft.group ? "selected" : ""}>${apiText(group.title, "湖泉晨练群")}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>动态内容 <em data-community-compose-count>${String(draft.content || "").length}/240</em></span>
        <textarea name="content" rows="4" maxlength="240" placeholder="分享旅居见闻、活动邀约或健康心得">${attr(draft.content || "")}</textarea>
      </label>
      <div class="ref-community-compose-media">
        <span>${icon("image", 16)}<b data-community-image-state>${draft.imageAdded ? "已添加 1 张图片" : "未添加图片"}</b></span>
        <button data-action="添加图片" data-local-action="true" type="button">${icon("plus", 15)}添加图片</button>
      </div>
      <div class="ref-community-compose-toggles">
        ${communitySwitch("publicVisible", "公开动态", "关闭后仅当前社群可见", draft.publicVisible)}
        ${communitySwitch("syncFamily", "同步给家属", "家属端可看到这条旅居动态", draft.syncFamily)}
        ${communitySwitch("allowComments", "允许评论", "关闭后他人只能点赞或分享", draft.allowComments)}
      </div>
      <div class="ref-community-compose-actions">
        <button data-action="保存草稿" data-local-action="true" type="button">${icon("clipboard-list", 16)}保存草稿</button>
        <button class="primary" data-action="提交动态" data-local-action="true" type="button">${icon("send", 16)}发布</button>
      </div>
      <p class="ref-community-compose-draft" data-community-draft-state>${communityDraftSavedText(draft.savedAt)}</p>
    </form>
  `, "开关状态和草稿会随当前发布组件同步");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  window.setTimeout(() => panel.querySelector("textarea")?.focus(), 150);
}

async function submitCommunityPost(button) {
  const panel = button.closest("[data-live-panel='community-compose']");
  const form = panel?.querySelector("[data-community-compose]");
  if (!form) return;
  const draft = syncCommunityComposeDraftFromForm(form);
  const group = draft.group || "湖泉晨练群";
  const content = draft.content;
  const status = panel.querySelector(".action-status") || panel;
  if (!content) {
    writeActionStatus(status, "请先填写动态内容");
    form.querySelector("textarea")?.focus();
    return;
  }
  button.disabled = true;
  try {
    const result = await userApi("/api/user/community/posts", {
      method: "POST",
      body: { ...draft, filter: activeCommunityFilter, source: "community" },
    });
    communityPageState = result.page || communityPageState;
    clearCommunityComposeDraft();
    form.reset();
    writeActionStatus(status, `动态已发布到${group}`);
    showToast("动态已发布");
    panel.hidden = true;
    if (currentId() === "community") render();
  } catch (error) {
    writeActionStatus(status, `发布失败：${error.message}`);
  } finally {
    button.disabled = false;
    if (window.lucide) window.lucide.createIcons();
  }
}

async function handleCheckinAction(button, actionName) {
  if (currentId() !== "checkin") return false;
  if (actionName === "打卡日历") {
    rememberScreenReturn("activity-calendar", button);
    setRoute("activity-calendar");
    return true;
  }
  if (actionName === "拍照打卡" || actionName === "checkin") {
    openCheckinCamera(button);
    return true;
  }
  if (["景点打卡", "活动打卡", "健康打卡", "美食打卡"].includes(actionName)) {
    activeCheckinFilter = actionName;
    checkinPageState = null;
    render();
    await hydrateCheckinFromApi("checkin", { force: true });
    const count = checkinPageState?.summary?.filtered ?? 0;
    const text = count ? `已显示${actionName}记录 ${count} 条` : `当前暂无${actionName}记录`;
    writeActionStatus(document.querySelector("[data-checkin-filter-status]") || button, text);
    return true;
  }
  if (actionName === "查看全部打卡") {
    activeCheckinFilter = "全部";
    await hydrateCheckinFromApi("checkin", { force: true });
    const page = checkinPageState || await userApi("/api/user/checkin");
    const panel = ensureLivePanel("checkin-all", button);
    renderLivePanel(panel, "全部打卡记录", `
      <div class="list ref-checkin-list">
        ${(page.allRecords || page.records || []).map(checkinRecord).join("")}
      </div>
    `, "已加载全部打卡记录");
    showToast("已加载全部打卡记录");
    return true;
  }
  if (actionName === "查看打卡记录") {
    const recordId = button.dataset.checkinRecordId || button.closest("[data-checkin-record-id]")?.dataset.checkinRecordId;
    if (!recordId) return true;
    const detail = await userApi(`/api/user/checkin/records/${encodeURIComponent(recordId)}`);
    const record = detail.record || {};
    const panel = ensureLivePanel(`checkin-detail-${recordId}`, button);
    renderLivePanel(panel, apiText(record.title, "打卡详情"), `
      <div class="ref-profile-rights">
        <span>${icon("map-pin", 16)}地点：${apiText(record.place, "当前旅居地")}</span>
        <span>${icon("tag", 16)}类型：${apiText(record.type, "旅居打卡")}</span>
        <span>${icon("star", 16)}积分：+${Number(record.points || 0)}</span>
        <span>${icon("clock", 16)}时间：${apiText(record.createdAt, "刚刚")}</span>
      </div>
      <p class="action-status">${apiText(record.text, "打卡记录已同步")}</p>
      <div class="ref-profile-help">
        <button data-action="点赞打卡记录" data-checkin-record-id="${attr(record.id)}" type="button" aria-pressed="${record.liked ? "true" : "false"}">${icon("heart", 15)}${record.liked ? "已点赞" : "点赞"} ${Number(record.likesCount || 0)}</button>
        <button data-action="分享打卡记录" data-checkin-record-id="${attr(record.id)}" type="button">${icon("share-2", 15)}分享</button>
      </div>
    `, "已加载打卡详情");
    showToast("已加载打卡详情");
    return true;
  }
  if (actionName === "点赞打卡记录") {
    const recordId = button.dataset.checkinRecordId || button.closest("[data-checkin-record-id]")?.dataset.checkinRecordId;
    if (!recordId) return true;
    const nextLiked = button.getAttribute("aria-pressed") !== "true";
    button.disabled = true;
    try {
      const result = await userApi(`/api/user/checkin/records/${encodeURIComponent(recordId)}/like`, {
        method: "POST",
        body: { liked: nextLiked, type: activeCheckinFilter },
      });
      checkinPageState = result.page || checkinPageState;
      button.setAttribute("aria-pressed", result.record?.liked ? "true" : "false");
      button.innerHTML = `${icon("heart", 15)}${result.record?.liked ? "已点赞" : "点赞"} ${Number(result.record?.likesCount || 0)}`;
      showToast(result.record?.liked ? "已点赞打卡" : "已取消点赞");
      if (window.lucide) window.lucide.createIcons();
    } finally {
      button.disabled = false;
    }
    return true;
  }
  if (actionName === "分享打卡记录") {
    const recordId = button.dataset.checkinRecordId || button.closest("[data-checkin-record-id]")?.dataset.checkinRecordId || "";
    await userApi("/api/ui/actions", {
      method: "POST",
      body: { role: "user", route: "checkin", action: "分享打卡记录", target: recordId, payload: { recordId } },
    });
    writeActionStatus(button.closest("[data-live-panel]") || button, "分享链接已生成并记录到后台");
    showToast("分享链接已生成");
    return true;
  }
  return false;
}

function openCheckinCamera(button) {
  const scope = button.closest(".ref-checkin-today, .ref-checkin-achievement") || button;
  const input = document.querySelector("[data-checkin-photo-input]");
  checkinPhotoTrigger = button;
  writeActionStatus(scope, "正在打开相机，请拍摄今天的旅居打卡照片");
  input?.click();
}

async function completePhotoCheckin(button, file) {
  const scope = button.closest(".ref-checkin-today, .ref-checkin-achievement") || button;
  const filename = file?.name ? ` · ${file.name}` : "";
  button.disabled = true;
  button.classList.add("is-done");
  button.innerHTML = `${icon("check", 16)}已完成今日打卡<span>今日旅居记录已保存</span>`;
  try {
    const result = await userApi("/api/user/checkin/photo", {
      method: "POST",
      body: {
        type: activeCheckinFilter !== "全部" ? activeCheckinFilter : "景点打卡",
        title: "今日拍照打卡",
        place: `${currentCity && currentCity !== "定位中" ? currentCity : DEFAULT_CITY}湖泉生态园`,
        text: `照片已选择${filename || "，记录此刻美好旅居生活"}`,
        fileName: file?.name || "",
        fileSize: file?.size || 0,
      },
    });
    checkinPageState = result.page || checkinPageState;
    if (currentId() === "checkin") render();
    const freshScope = document.querySelector(".ref-checkin-today") || document.querySelector(".ref-checkin-achievement") || document.querySelector(".screen-checkin .content") || scope;
    const panel = ensureLivePanel("checkin-photo-result", freshScope);
    renderLivePanel(panel, "今日拍照打卡", `
      <div class="ref-profile-rights">
        <span>${icon("camera", 16)}照片已选择${attr(filename || "，已保存")}</span>
        <span>${icon("map-pin", 16)}打卡地点：${apiText(result.record?.place, "湖泉生态园")}</span>
        <span>${icon("star", 16)}积分 +${Number(result.record?.points || 10)}，已写入旅居打卡记录</span>
      </div>
      <div class="ref-profile-help">
        <button data-route="activity-calendar" type="button">${icon("calendar-check", 16)}查看打卡日历</button>
        <button data-action="查看全部打卡" type="button">${icon("clipboard-list", 16)}查看打卡记录</button>
      </div>
    `, "今日打卡完成，记录已同步");
    showToast("今日打卡完成");
  } catch (error) {
    const panel = ensureLivePanel("checkin-photo-result", scope);
    writeActionStatus(panel, `今日打卡失败：${error.message}`);
  } finally {
    button.disabled = false;
    if (window.lucide) window.lucide.createIcons();
  }
}

function foodRestaurantIdForAction(button, actionName = "") {
  const directId = button.dataset.foodRestaurantId || button.closest("[data-food-restaurant-id]")?.dataset.foodRestaurantId;
  if (directId) return directId;
  const name = String(actionName || "").replace(/^(查看餐厅详情|餐厅导航|导航|查看菜单|预约餐厅|预约|立即订餐|收藏餐厅|咨询餐厅)/, "").trim();
  if (!name) return "";
  const restaurants = [
    ...(foodPageState?.restaurants || []),
    ...(foodPageState?.allRestaurants || []),
  ];
  return restaurants.find((restaurant) => restaurant.name === name)?.id || "";
}

async function ensureFoodPageLoaded(options = {}) {
  if (!foodPageState || options.force) await hydrateFoodFromApi("food", { force: true, silent: true });
  return foodPageState;
}

async function handleFoodAction(button, actionName) {
  if (currentId() !== "food") return false;
  if (actionName === "美食地图" || actionName === "restaurant") {
    const restaurantId = foodRestaurantIdForAction(button, actionName);
    if (restaurantId) {
      await showFoodRestaurantDetail(button, restaurantId);
    } else {
      await openFoodMap(button);
    }
    return true;
  }
  if (actionName === "更多美食") {
    const page = await ensureFoodPageLoaded({ force: true });
    const panel = ensureLivePanel("food-more", button);
    renderLivePanel(panel, "更多美食", `
      <div class="ref-food-grid">
        ${(page.allRestaurants || page.restaurants || []).map(foodCard).join("")}
      </div>
    `, `已加载 ${Number((page.allRestaurants || page.restaurants || []).length)} 家本地美食`);
    showToast("已加载更多美食");
    return true;
  }
  if (["特色小吃", "营养餐", "团餐预订", "家属代订"].includes(actionName)) {
    activeFoodCategory = actionName;
    foodPageState = null;
    render();
    await hydrateFoodFromApi("food", { force: true });
    const count = foodPageState?.summary?.filtered ?? 0;
    writeActionStatus(document.querySelector("[data-food-status]") || button, count ? `已筛选${actionName} ${count} 家` : `当前暂无${actionName}`);
    showToast(`已筛选${actionName}`);
    return true;
  }
  if (actionName === "查看餐厅详情" || /^查看餐厅详情/.test(actionName)) {
    const restaurantId = foodRestaurantIdForAction(button, actionName);
    if (restaurantId) await showFoodRestaurantDetail(button, restaurantId);
    return true;
  }
  if (actionName === "餐厅导航" || /^导航/.test(actionName)) {
    const restaurantId = foodRestaurantIdForAction(button, actionName);
    if (!restaurantId) return true;
    button.disabled = true;
    try {
      const result = await userApi(`/api/user/food/restaurants/${encodeURIComponent(restaurantId)}/route`, {
        method: "POST",
        body: { source: "food" },
      });
      foodPageState = result.page || foodPageState;
      const panel = ensureLivePanel(`food-route-${restaurantId}`, button.closest(".ref-food-card") || button);
      renderLivePanel(panel, `${apiText(result.restaurant?.name, "餐厅")}路线`, `
        <div class="ref-profile-rights">
          <span>${icon("map-pin", 16)}地址：${apiText(result.route?.address, result.restaurant?.address || "附近")}</span>
          <span>${icon("navigation", 16)}距离：${apiText(result.route?.distance, result.restaurant?.distance || "附近")}</span>
        </div>
        <div class="ref-profile-help">
          <a class="btn blue" href="${attr(result.route?.url || result.restaurant?.mapUrl || "#")}" target="_blank" rel="noopener noreferrer">${icon("map", 16)}打开高德路线</a>
          <button data-action="查看菜单" data-food-restaurant-id="${attr(restaurantId)}" type="button">${icon("list", 15)}查看菜单</button>
        </div>
      `, "路线已生成");
      showToast("路线已生成");
    } catch (error) {
      writeActionStatus(button.closest(".ref-food-card") || button, `路线生成失败：${error.message}`);
    } finally {
      button.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
    return true;
  }
  if (actionName === "查看菜单" || /^查看菜单/.test(actionName)) {
    const restaurantId = foodRestaurantIdForAction(button, actionName);
    if (!restaurantId) return true;
    await showFoodMenu(button, restaurantId);
    return true;
  }
  if (actionName === "预约餐厅" || /^预约/.test(actionName)) {
    const restaurantId = foodRestaurantIdForAction(button, actionName);
    if (!restaurantId) return true;
    button.disabled = true;
    try {
      const result = await userApi(`/api/user/food/restaurants/${encodeURIComponent(restaurantId)}/book`, {
        method: "POST",
        body: { diners: 1, source: "food" },
      });
      foodPageState = result.page || foodPageState;
      button.classList.add("active");
      button.innerHTML = `${icon("check", 15)}已预约`;
      writeActionStatus(button.closest(".ref-food-card") || button, `${apiText(result.restaurant?.name, "餐厅")}预约已提交`);
      showToast("预约已提交");
    } catch (error) {
      writeActionStatus(button.closest(".ref-food-card") || button, `预约失败：${error.message}`);
    } finally {
      button.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
    return true;
  }
  if (actionName === "立即订餐" || /^立即订餐/.test(actionName)) {
    const restaurantId = foodRestaurantIdForAction(button, actionName);
    if (!restaurantId) return true;
    const menuItemId = button.dataset.menuItemId || "";
    button.disabled = true;
    try {
      const result = await userApi(`/api/user/food/restaurants/${encodeURIComponent(restaurantId)}/order`, {
        method: "POST",
        body: { menuItemId, quantity: 1, source: "food" },
      });
      foodPageState = result.page || foodPageState;
      cartCount += 1;
      button.innerHTML = `${icon("check", 15)}已加入`;
      writeActionStatus(button.closest(".ref-food-card, .ref-live-panel") || button, `${apiText(result.order?.menuItemName, "餐品")}已加入待下单清单`);
      showToast("餐品已加入待下单");
    } catch (error) {
      writeActionStatus(button.closest(".ref-food-card, .ref-live-panel") || button, `订餐失败：${error.message}`);
    } finally {
      button.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
    return true;
  }
  return false;
}

async function showFoodRestaurantDetail(button, restaurantId) {
  const detail = await userApi(`/api/user/food/restaurants/${encodeURIComponent(restaurantId)}`);
  const restaurant = detail.restaurant || {};
  const panel = ensureLivePanel(`food-detail-${restaurantId}`, button.closest(".ref-food-card") || button);
  renderLivePanel(panel, apiText(restaurant.name, "餐厅详情"), `
    <div class="ref-profile-rights">
      <span>${icon("utensils", 16)}类型：${apiText(restaurant.category || restaurant.type, "本地美食")}</span>
      <span>${icon("star", 16)}评分：${Number(restaurant.rating || 0)} · ${apiText(restaurant.reviews || `${Number(restaurant.reviewsCount || 0)}条评价`)}</span>
      <span>${icon("map-pin", 16)}地址：${apiText(restaurant.address, "附近")}</span>
      <span>${icon("phone", 16)}电话：${apiText(restaurant.phone, "到店咨询")}</span>
    </div>
    <p class="action-status">${apiText(restaurant.description, "餐厅信息已同步")}</p>
    <div class="ref-profile-rights">
      ${(detail.menu || []).slice(0, 3).map((item) => `<span>${apiText(item.name)}　¥${Number(item.price || 0)} · ${apiText(item.desc, "适老餐食")}</span>`).join("")}
    </div>
    <div class="ref-profile-help">
      <button data-action="查看菜单" data-food-restaurant-id="${attr(restaurant.id)}" type="button">${icon("list", 15)}查看菜单</button>
      <button data-action="${restaurant.action === "立即订餐" ? "立即订餐" : "预约餐厅"}" data-food-restaurant-id="${attr(restaurant.id)}" type="button">${icon(restaurant.actionIcon || "calendar-check", 15)}${apiText(restaurant.action, "预约")}</button>
      <button data-action="餐厅导航" data-food-restaurant-id="${attr(restaurant.id)}" type="button">${icon("navigation", 15)}导航</button>
    </div>
  `, "已加载餐厅详情");
  showToast("已加载餐厅详情");
}

async function showFoodMenu(button, restaurantId) {
  const data = await userApi(`/api/user/food/restaurants/${encodeURIComponent(restaurantId)}/menu`);
  const restaurant = data.restaurant || {};
  const panel = ensureLivePanel(`food-menu-${restaurantId}`, button.closest(".ref-food-card, .ref-live-panel") || button);
  renderLivePanel(panel, `${apiText(restaurant.name, "餐厅")}菜单`, `
    <div class="ref-profile-rights">
      ${(data.menu || []).map((item) => `
        <span>
          ${apiText(item.name)}　¥${Number(item.price || 0)}
          <small>${apiText(item.desc, "适老餐食")}</small>
          <button data-action="立即订餐" data-food-restaurant-id="${attr(restaurant.id)}" data-menu-item-id="${attr(item.id)}" type="button">${icon("shopping-bag", 14)}订餐</button>
        </span>
      `).join("")}
    </div>
  `, "菜单已加载，可直接订餐");
  showToast("菜单已加载");
}

async function openFoodMap(button) {
  const page = await ensureFoodPageLoaded();
  const map = page?.map || {};
  const url = map.url || `https://uri.amap.com/search?keyword=${encodeURIComponent("适老餐厅 营养餐")}&src=${encodeURIComponent("云旅无忧")}&callnative=1`;
  const panel = ensureLivePanel("food-map", document.querySelector(".ref-food-search") || button);
  renderLivePanel(panel, "美食地图", `
    <div class="ref-profile-rights">
      <span>${icon("map-pin", 16)}已按当前位置筛选：${apiText(map.city || currentCity || DEFAULT_CITY)}</span>
      ${(page?.restaurants || []).slice(0, 4).map((restaurant) => `<span>${icon("utensils", 16)}${apiText(restaurant.name)} · ${apiText(restaurant.distance)} · ${(restaurant.tags || []).slice(0, 2).map(apiText).join(" / ")}</span>`).join("")}
    </div>
    <div class="ref-profile-help">
      <a class="btn blue" href="${attr(url)}" target="_blank" rel="noopener noreferrer">${icon("map", 16)}打开高德美食地图</a>
      <button data-action="营养餐" type="button">${icon("leaf", 16)}筛选营养餐</button>
    </div>
  `, "美食地图定位完成，可查看附近适老餐厅");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  showToast("美食地图定位完成");
}

async function handleTransportAction(button, actionName) {
  if (currentId() !== "transport") return false;
  if (actionName === "行程记录") {
    await showTransportRecords(button);
    return true;
  }
  if (actionName.startsWith("选择目的地：")) {
    const destination = actionName.replace("选择目的地：", "").trim();
    const input = document.querySelector("[data-transport-destination]");
    transportDestination = destination;
    localStorage.setItem("yunlv_transport_destination", destination);
    if (input) input.value = destination;
    writeActionStatus(button.closest(".ref-transport-search") || button, `目的地：${destination}`);
    transportPageState = null;
    await hydrateTransportFromApi("transport", { force: true });
    return true;
  }
  if (actionName === "交换起终点") {
    const input = document.querySelector("[data-transport-destination]");
    const origin = transportOriginText();
    const destination = input?.value?.trim() || transportDestination;
    if (input) input.value = origin;
    transportDestination = origin;
    localStorage.setItem("yunlv_transport_destination", origin);
    writeActionStatus(button.closest(".ref-transport-search") || button, destination ? `起终点已交换：从${destination}返回${origin}` : "请先输入目的地后再交换起终点");
    return true;
  }
  if (actionName === "规划路线" || actionName === "开始导航") {
    await planTransportRoute(button, readTransportDestination() || button.dataset.routeTitle || "附近医院");
    return true;
  }
  if (["接发站", "预约用车", "公交查询", "无障碍出行", "导游包车", "家属代叫车"].includes(actionName)) {
    const serviceKey = button.dataset.transportServiceKey || transportServiceKeyByAction(actionName);
    if (!serviceKey) return true;
    button.disabled = true;
    try {
      const result = await userApi(`/api/user/transport/services/${encodeURIComponent(serviceKey)}/request`, {
        method: "POST",
        body: { destination: readTransportDestination() || button.dataset.routeTitle || "交通出行推荐路线", source: "transport" },
      });
      transportPageState = result.page || transportPageState;
      const panel = ensureLivePanel("transport-service-current", button.closest(".section") || button);
      panel.dataset.transportServiceKey = serviceKey;
      renderLivePanel(panel, "当前服务请求", `
      <div class="ref-profile-rights">
        <span>${icon(result.service?.iconName || "car", 16)}服务类型：${apiText(result.service?.title || actionName)}</span>
        <span>${icon("clock-3", 16)}预计响应：15分钟内</span>
        <span>${icon("shield-check", 16)}服务单号：${apiText(result.request?.requestNo, "已生成")}</span>
        <span>${icon("map-pin", 16)}目的地：${apiText(result.request?.payload?.destination, "交通出行推荐路线")}</span>
      </div>
      <div class="ref-profile-help">
        <button data-action="行程记录" type="button">${icon("clipboard-list", 16)}查看行程记录</button>
      </div>
    `, `${apiText(result.service?.title || actionName)}请求已提交`);
      showToast(`${actionName}请求已提交`);
    } catch (error) {
      writeActionStatus(button.closest(".section") || button, `${actionName}提交失败：${error.message}`);
    } finally {
      button.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
    return true;
  }
  if (actionName === "查看周边") {
    const data = await userApi("/api/user/transport/nearby");
    transportPageState = data.page || transportPageState;
    const panel = ensureLivePanel("transport-nearby", button.closest(".section") || button);
    renderLivePanel(panel, "周边交通", `
      <div class="ref-profile-rights">
        ${(data.nearby || []).map((item) => `<span>${icon(item.iconName || "bus", 16)}${apiText(item.title)}　${apiText(item.distance)} · ${apiText(item.desc)}</span>`).join("")}
      </div>
    `, "已加载周边交通");
    showToast("已加载周边交通");
    return true;
  }
  if (actionName === "更多路线") {
    if (!transportPageState) await hydrateTransportFromApi("transport", { force: true, silent: true });
    const routes = [...(transportPageState?.routes || []), ...(transportPageState?.moreRoutes || [])];
    const panel = ensureLivePanel("transport-more", button);
    renderLivePanel(panel, "更多路线", `
      <div class="list ref-route-list">
        ${routes.map(transportRoute).join("")}
      </div>
    `, `已加载 ${routes.length} 条路线`);
    showToast("已加载更多路线");
    return true;
  }
  return false;
}

function transportServiceKeyByAction(actionName = "") {
  const service = (transportPageState?.quickServices || []).find((item) => item.action === actionName || item.title === actionName);
  if (service?.key) return service.key;
  const fallback = {
    接发站: "station-pickup",
    预约用车: "car-book",
    公交查询: "bus-query",
    无障碍出行: "accessible-ride",
    导游包车: "guide-charter",
    家属代叫车: "family-ride",
  };
  return fallback[actionName] || "";
}

async function showTransportRecords(button) {
  const data = await userApi("/api/user/transport/records");
  transportPageState = data.page || transportPageState;
  const panel = ensureLivePanel("transport-records", document.querySelector(".ref-route-list") || button);
  renderLivePanel(panel, "行程记录", `
    <div class="list ref-route-list">
      ${(data.records || []).map(transportRoute).join("")}
    </div>
    <div class="ref-profile-help">
      <button data-route="service-records" type="button">${icon("clipboard-list", 16)}查看全部服务记录</button>
      <button data-action="开始导航" data-route-title="最近一次行程" type="button">${icon("navigation", 16)}继续导航</button>
    </div>
  `, "行程记录面板已展开");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  showToast("行程记录面板已展开");
}

async function planTransportRoute(button, destination = "附近医院") {
  const dest = String(destination || "").trim();
  if (!dest || dest === "目的地") {
    writeActionStatus(button.closest(".ref-transport-search") || button, "请先输入目的地，再规划路线");
    document.querySelector("[data-transport-destination]")?.focus();
    return;
  }
  button.disabled = true;
  try {
    const result = await userApi("/api/user/transport/route", {
      method: "POST",
      body: {
        origin: transportPageState?.origin?.title || transportOriginText(),
        destination: dest.replace(/^去/, ""),
        routeId: button.dataset.transportRouteId || "",
        source: "transport",
      },
    });
    transportPageState = result.page || transportPageState;
    const route = result.route || {};
    const panel = ensureLivePanel("route-navigation", button.closest(".section, .card") || button);
    renderLivePanel(panel, "高德导航", `
      <div class="ref-profile-rights">
        <span>${icon("map-pin", 16)}出发地：${apiText(transportPageState?.origin?.title, transportOriginText())}</span>
        <span>${icon("navigation", 16)}目的地：${apiText(route.destination || dest)}</span>
        <span>${icon("clock-3", 16)}预计：${apiText(route.time, "已规划")} · ${apiText(route.distance, "距离待估算")}</span>
      </div>
      <div class="ref-profile-help">
        <a class="btn blue" href="${attr(route.url || "#")}" target="_blank" rel="noopener noreferrer">${icon("map", 16)}打开高德导航</a>
        <button data-action="行程记录" type="button">${icon("clipboard-list", 16)}查看行程记录</button>
      </div>
    `, "路线已生成");
    showToast("路线已生成");
  } catch (error) {
    writeActionStatus(button.closest(".ref-transport-search") || button, `路线规划失败：${error.message}`);
  } finally {
    button.disabled = false;
    if (window.lucide) window.lucide.createIcons();
  }
}

async function handleShopAction(button, actionName) {
  if (currentId() !== "shop") return false;
  if (actionName === "购物车" || actionName === "打开购物车") {
    openShopCartPanel(button);
    return true;
  }
  if (actionName === "收起购物车" || actionName === "继续选购") {
    shopCartOpen = false;
    render();
    return true;
  }
  if (["健康监测", "日常护理", "旅居用品", "营养食品", "智能设备", "活动周边"].includes(actionName)) {
    shopActiveFilter = actionName;
    await hydrateShopFromApi("shop", { force: true });
    const panel = ensureLivePanel("shop-category", document.querySelector(".ref-shop-cats") || button);
    renderLivePanel(panel, actionName, `
      <div class="ref-profile-rights">
        <span>${icon("shopping-bag", 16)}已按${actionName}筛选商品</span>
        <span>${icon("shield-check", 16)}已筛选 ${Number(shopPageState?.products?.length || 0)} 个适老、安全、可配送商品</span>
      </div>
    `, `已筛选${actionName}商品`);
    showToast(`已筛选${actionName}商品`);
    return true;
  }
  if (actionName === "平台精选" || actionName === "适老推荐") {
    shopActiveFilter = actionName;
    await hydrateShopFromApi("shop", { force: true, silent: true });
    const group = document.querySelector(".ref-shop-tabs") || button.closest(".ref-shop-tabs");
    group?.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    writeActionStatus(group || button, `已筛选${actionName}商品`);
    showToast(`已筛选${actionName}商品`);
    return true;
  }
  if (actionName === "查看全部商品") {
    shopActiveFilter = "全部";
    await hydrateShopFromApi("shop", { force: true });
    const panel = ensureLivePanel("shop-all", document.querySelector(".ref-shop-products")?.closest(".section") || button);
    renderLivePanel(panel, "全部商品", `
      <div class="product-grid ref-shop-products">
        ${(shopPageState?.products || []).map(productCard).join("")}
      </div>
    `, "已加载全部商品");
    showToast("已加载全部商品");
    return true;
  }
  if (actionName === "代买服务") {
    if (!shopPageState) await hydrateShopFromApi("shop", { force: true, silent: true });
    const candidate = shopCartItems[0] || shopPageState?.products?.[0] || {};
    const data = await userApi("/api/user/shop/family-purchase", {
      method: "POST",
      body: { productId: candidate.productId || candidate.id, quantity: candidate.quantity || 1, source: "shop" },
    });
    shopPageState = data.page || shopPageState;
    const panel = ensureLivePanel("shop-family-buy", button.closest(".ref-shop-family-banner") || button);
    renderLivePanel(panel, "家属代买服务", `
      <div class="ref-profile-rights">
        <span>${icon("shopping-bag", 16)}商品：${apiText(data.request?.payload?.productName || candidate.name, "优选商城商品")}</span>
        <span>${icon("shield-check", 16)}服务单号：${apiText(data.request?.requestNo, "已生成")}</span>
        <span>${icon("map-pin", 16)}平台配送到旅居地或服务点</span>
      </div>
    `, "代买服务请求已提交");
    showToast("代买服务请求已提交");
    return true;
  }
  if (actionName === "checkout") {
    await submitShopCheckout(button);
    return true;
  }
  return false;
}

async function handleVolunteerAction(button, actionName) {
  if (currentId() !== "volunteer") return false;
  if (actionName === "发布求助需求") {
    showVolunteerHelpRequestForm(button);
    return true;
  }
  if (/^查看需求-/.test(actionName)) {
    showVolunteerDemandDetail(button);
    return true;
  }
  if (actionName === "响应志愿需求") {
    const demandId = button.dataset.volunteerDemandId || button.closest("[data-volunteer-demand-id]")?.dataset.volunteerDemandId || "";
    const title = button.dataset.volunteerTitle || button.closest("[data-volunteer-title]")?.dataset.volunteerTitle || "志愿需求";
    if (!demandId) {
      writeActionStatus(button.closest(".ref-live-panel, .ref-volunteer-demand") || button, "需求编号缺失，无法响应");
      return true;
    }
    button.disabled = true;
    const result = await userApi(`/api/user/volunteer/demands/${encodeURIComponent(demandId)}/respond`, {
      method: "POST",
      body: { source: "volunteer" },
    });
    volunteerPageState = result.page || volunteerPageState;
    const card = document.querySelector(`[data-volunteer-demand-id="${cssEscape(demandId)}"]`) || document.querySelector(`[data-volunteer-title="${cssEscape(title)}"]`);
    const cardStatus = card?.querySelector("em");
    const cardCta = card?.querySelector(".ref-volunteer-demand-cta");
    button.classList.add("active");
    button.textContent = "已响应";
    if (card) card.classList.add("is-responded");
    if (cardStatus) cardStatus.textContent = "已响应";
    if (cardCta) cardCta.textContent = "已响应";
    saveVolunteerResponse(demandId || title);
    writeActionStatus(button.closest(".ref-live-panel, .ref-volunteer-demand") || button, `${apiText(result.demand?.title || title)}响应成功，记录 ${apiText(result.record?.id, "已生成")}`);
    showToast("响应成功");
    return true;
  }
  if (actionName === "联系需求发布者") {
    const phone = button.dataset.volunteerPhone || button.closest("[data-volunteer-phone]")?.dataset.volunteerPhone || "13800138000";
    safeCallPhone(phone);
    writeActionStatus(button.closest(".ref-live-panel, .ref-volunteer-demand") || button, `正在拨打发布者电话 ${phone}`);
    return true;
  }
  if (actionName === "导航需求地点") {
    const place = button.dataset.volunteerPlace || button.closest("[data-volunteer-place]")?.dataset.volunteerPlace || "湖泉社区";
    await openRouteNavigation(button, place);
    return true;
  }
  if (actionName === "成为志愿者") {
    const data = await userApi("/api/user/volunteer/applications", {
      method: "POST",
      body: { skills: ["陪伴服务", "出行协助", "活动组织"], availableTime: "周末上午", source: "volunteer" },
    });
    volunteerPageState = data.page || volunteerPageState;
    const panel = ensureLivePanel("volunteer-main", button.closest(".ref-volunteer-actions, .ref-volunteer-submit") || button);
    renderLivePanel(panel, "志愿者申请", `
      <div class="ref-profile-rights">
        <span>${icon("user-heart", 16)}申请单号：${apiText(data.request?.requestNo, "已生成")}</span>
        <span>服务方向：陪伴、出行、活动组织</span>
        <span>${icon("shield-check", 16)}平台审核与服务留痕保障安全</span>
      </div>
    `, "志愿者申请已提交审核");
    showToast("志愿者申请已提交");
    return true;
  }
  if (actionName === "查看附近志愿队") {
    if (!volunteerPageState) await hydrateVolunteerFromApi("volunteer", { force: true, silent: true });
    const teams = [...(volunteerPageState?.teams || []), ...(volunteerPageState?.moreTeams || [])];
    const panel = ensureLivePanel("volunteer-teams", button.closest(".ref-volunteer-actions, .ref-volunteer-submit") || button);
    renderLivePanel(panel, "附近志愿队", `
      <div class="card ref-volunteer-team-list">
        ${teams.map(volunteerTeam).join("")}
      </div>
    `, `已加载 ${teams.length} 支附近志愿队`);
    showToast("已加载附近志愿队");
    return true;
  }
  if (actionName === "查看服务记录") {
    const data = await userApi("/api/user/volunteer/records");
    volunteerPageState = data.page || volunteerPageState;
    const panel = ensureLivePanel("volunteer-records", button.closest(".ref-volunteer-actions, .ref-volunteer-submit") || button);
    renderLivePanel(panel, "志愿服务记录", `
      <div class="ref-profile-rights">
        ${(data.records || []).map((record) => `<span>${icon(record.iconName || "heart-handshake", 16)}${apiText(record.title)} · ${apiText(record.status)} · ${apiText(record.time)}</span>`).join("")}
      </div>
    `, `已加载 ${Number(data.records?.length || 0)} 条志愿记录`);
    showToast("志愿服务记录已加载");
    return true;
  }
  if (actionName === "查看全部需求") {
    if (!volunteerPageState) await hydrateVolunteerFromApi("volunteer", { force: true, silent: true });
    const panel = ensureLivePanel("volunteer-demands", button.closest(".section") || button);
    renderLivePanel(panel, "全部服务需求", `
      <div class="ref-volunteer-demand-grid">
        ${(volunteerPageState?.demands || []).map(volunteerDemand).join("")}
      </div>
    `, `已加载 ${Number(volunteerPageState?.demands?.length || 0)} 个需求`);
    showToast("已加载全部需求");
    return true;
  }
  if (actionName === "更多团队") {
    if (!volunteerPageState) await hydrateVolunteerFromApi("volunteer", { force: true, silent: true });
    const teams = [...(volunteerPageState?.teams || []), ...(volunteerPageState?.moreTeams || [])];
    const panel = ensureLivePanel("volunteer-teams", button.closest(".section") || button);
    renderLivePanel(panel, "更多志愿团队", `
      <div class="card ref-volunteer-team-list">
        ${teams.map(volunteerTeam).join("")}
      </div>
    `, `已加载 ${teams.length} 支志愿团队`);
    showToast("已加载更多团队");
    return true;
  }
  if (/^联系/.test(actionName)) {
    const name = actionName.replace(/^联系/, "");
    const teamId = button.dataset.volunteerTeamId || button.closest("[data-volunteer-team-id]")?.dataset.volunteerTeamId || "";
    if (!teamId) {
      writeActionStatus(button.closest(".ref-volunteer-team") || button, `团队编号缺失，无法联系${name}`);
      return true;
    }
    const data = await userApi(`/api/user/volunteer/teams/${encodeURIComponent(teamId)}/contact`, {
      method: "POST",
      body: { source: "volunteer" },
    });
    volunteerPageState = data.page || volunteerPageState;
    const contactMessage = `已向${apiText(data.team?.title || name)}发送联系请求：${apiText(data.request?.requestNo, "已生成")}`;
    document.querySelectorAll(`button[data-volunteer-team-id="${cssEscape(teamId)}"]`).forEach((teamButton) => {
      teamButton.classList.add("active");
      teamButton.textContent = "已联系";
      teamButton.disabled = true;
      teamButton.dataset.volunteerRequestNo = data.request?.requestNo || "";
    });
    document.querySelectorAll(`[data-volunteer-team-id="${cssEscape(teamId)}"].ref-volunteer-team`).forEach((teamCard) => {
      teamCard.classList.add("is-contacted");
      teamCard.dataset.volunteerRequestNo = data.request?.requestNo || "";
    });
    writeActionStatus(button.closest(".ref-volunteer-team") || button, contactMessage);
    showToast(contactMessage);
    return true;
  }
  return false;
}

function showVolunteerDemandDetail(card) {
  const demandId = card.dataset.volunteerDemandId || "";
  const title = card.dataset.volunteerTitle || "志愿服务需求";
  const text = card.dataset.volunteerText || "需要志愿者协助完成服务。";
  const time = card.dataset.volunteerTime || "1小时内可服务";
  const place = card.dataset.volunteerPlace || "湖泉社区";
  const distance = card.dataset.volunteerDistance || "0.6km";
  const phone = card.dataset.volunteerPhone || "13800138000";
  const responded = hasVolunteerResponse(demandId || title);
  closeVolunteerDemandPanels();
  document.querySelectorAll(".ref-volunteer-demand.is-open").forEach((item) => item.classList.remove("is-open"));
  card.classList.add("is-open");
  const panel = ensureLivePanel(`volunteer-demand-${title}`, card.closest(".section") || card);
  renderLivePanel(panel, title, `
    <div class="ref-volunteer-demand-detail" data-volunteer-demand-id="${attr(demandId)}" data-volunteer-title="${attr(title)}" data-volunteer-place="${attr(place)}" data-volunteer-phone="${attr(phone)}">
      <p>${text}</p>
      <span>${icon("clock-3", 15)}${time}</span>
      <span>${icon("map-pin", 15)}${place} · ${distance}</span>
      <span>${icon("shield-check", 15)}平台审核后匹配志愿者，服务过程留痕</span>
      <div>
        <button class="btn blue ${responded ? "active" : ""}" data-action="响应志愿需求" data-volunteer-demand-id="${attr(demandId)}" data-volunteer-title="${attr(title)}" type="button" ${responded ? "disabled" : ""}>${responded ? "已响应" : "我要响应"}</button>
        <button class="btn ghost" data-action="联系需求发布者" data-volunteer-phone="${attr(phone)}" type="button">联系发布者</button>
        <button class="btn ghost" data-action="导航需求地点" data-volunteer-place="${attr(place)}" type="button">导航到地点</button>
      </div>
    </div>
  `, "需求详情已展开，可响应或联系发布者");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeVolunteerDemandPanels() {
  document.querySelectorAll('[data-live-panel^="volunteer-demand-"]').forEach((panel) => {
    panel.hidden = true;
  });
}

function volunteerResponseKey(title) {
  return `yunlv-volunteer-response-${title}`;
}

function showVolunteerHelpRequestForm(button) {
  const panel = ensureLivePanel("volunteer-help-request", button.closest(".ref-volunteer-actions, .ref-volunteer-submit") || button);
  renderLivePanel(panel, "发布求助需求", `
    <form class="ref-volunteer-help-form" data-volunteer-help-form>
      <label>
        <span>需求类型</span>
        <select name="type" required>
          <option value="陪同散步">陪同散步</option>
          <option value="活动协助">活动协助</option>
          <option value="手机使用帮助">手机使用帮助</option>
          <option value="社区问路">社区问路</option>
          <option value="就医陪伴">就医陪伴</option>
          <option value="其他帮助">其他帮助</option>
        </select>
      </label>
      <label>
        <span>服务地点</span>
        <input name="place" value="${attr(currentCity || DEFAULT_CITY)}湖泉社区" required>
      </label>
      <label>
        <span>希望响应</span>
        <select name="time" required>
          <option value="30分钟内可服务">30分钟内可服务</option>
          <option value="1小时内可服务" selected>1小时内可服务</option>
          <option value="2小时内可服务">2小时内可服务</option>
          <option value="今天内联系">今天内联系</option>
        </select>
      </label>
      <label>
        <span>联系电话</span>
        <input name="phone" inputmode="tel" value="13800005678" required>
      </label>
      <label class="wide">
        <span>需求说明</span>
        <textarea name="description" rows="3" required placeholder="请描述需要志愿者协助的事项">希望志愿者协助完成附近生活服务，适合老人慢行节奏。</textarea>
      </label>
      <label class="wide">
        <span>紧急程度</span>
        <select name="priority">
          <option value="P1">普通</option>
          <option value="P0">较急</option>
          <option value="P2">可预约</option>
        </select>
      </label>
      <button class="btn blue ref-volunteer-help-submit" type="submit">${icon("send", 15)}提交求助需求</button>
      <p class="action-status" data-volunteer-help-status>提交后会进入后台工单，并通知平台匹配志愿者。</p>
    </form>
  `);
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  panel.querySelector("textarea")?.focus();
}

async function submitVolunteerHelpRequest(form) {
  const submit = form.querySelector('[type="submit"]');
  const status = form.querySelector("[data-volunteer-help-status]");
  const data = Object.fromEntries(new FormData(form).entries());
  const type = String(data.type || "志愿协助").trim();
  const place = String(data.place || "").trim();
  const time = String(data.time || "").trim();
  const phone = String(data.phone || "").trim();
  const description = String(data.description || "").trim();
  const priority = String(data.priority || "P1").trim();
  if (!place || !phone || !description) {
    if (status) status.textContent = "请补全地点、联系电话和需求说明后再提交。";
    showToast("请补全求助需求");
    return;
  }
  submit.disabled = true;
  submit.classList.add("is-busy");
  if (status) status.textContent = "正在提交到后台工单...";
  try {
    const result = await userApi("/api/user/volunteer/help-requests", {
      method: "POST",
      body: { type, place, time, phone, description, priority, source: "volunteer" },
    });
    volunteerPageState = result.page || volunteerPageState;
    addPublishedVolunteerDemand({ type, place, time, phone, description, requestNo: result.request?.requestNo || result.request?.id || "REQ" });
    form.classList.add("is-submitted");
    submit.textContent = "已提交";
    if (status) status.textContent = `已提交到后台工单：${result.request?.requestNo || result.request?.id || "REQ"}，平台将匹配志愿者。`;
    writeActionStatus(form.closest(".ref-live-panel") || form, `求助需求已发布：${type} · ${place}`);
    showToast("求助需求已提交");
  } catch (error) {
    submit.disabled = false;
    submit.classList.remove("is-busy");
    if (status) status.textContent = `提交失败：${error.message}`;
    showToast(`提交失败：${error.message}`);
  }
}

function addPublishedVolunteerDemand({ type, place, time, phone, description, requestNo }) {
  const list = document.querySelector("[data-volunteer-published-list]");
  if (!list) return;
  const card = document.createElement("article");
  card.className = "ref-volunteer-published-card";
  card.dataset.volunteerTitle = type;
  card.dataset.volunteerText = description;
  card.dataset.volunteerTime = time;
  card.dataset.volunteerPlace = place;
  card.dataset.volunteerDistance = "待匹配";
  card.dataset.volunteerPhone = phone;
  card.innerHTML = `
    <div>
      <b>${attr(type)}<span>${attr(requestNo)}</span></b>
      <p>${attr(description)}</p>
      <small>${icon("clock-3", 13)}${attr(time)}　${icon("map-pin", 13)}${attr(place)}</small>
    </div>
    <em>待匹配</em>
  `;
  list.prepend(card);
  list.hidden = false;
  if (window.lucide) window.lucide.createIcons();
}

function hasVolunteerResponse(title) {
  return localStorage.getItem(volunteerResponseKey(title)) === "1";
}

function saveVolunteerResponse(title) {
  localStorage.setItem(volunteerResponseKey(title), "1");
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return String(value).replace(/["\\]/g, "\\$&");
}

function applyActionState(button, actionName) {
  const label = (button.textContent || actionName).trim().replace(/\s+/g, " ") || actionName;
  if (activateChoice(button, label)) return "";
  if (toggleSwitch(button, actionName)) return "";

  if (/获取.*验证码/.test(actionName)) {
    button.disabled = true;
    button.textContent = "60秒后重发";
    return "验证码已发送";
  }

  if (/上传|添加照片|添加介绍图片/.test(actionName)) {
    button.classList.add("is-done");
    button.dataset.state = "等待选择文件";
    return openUserFilePicker(button, actionName);
  }

  if (/收藏|关注|点赞|有用|同意|报名|加入日历/.test(actionName)) {
    button.classList.toggle("active");
    button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
    const done = button.classList.contains("active");
    const text = done ? completedActionText(actionName) : `已取消${label}`;
    return text;
  }

  if (/删除|移除|关闭/.test(actionName)) {
    const target = button.closest("figure, .info-banner, .notice, .ref-community-post, .message-row, article, .card");
    if (target && target !== document.querySelector(".content")) {
      target.classList.add("is-dismissed");
      target.setAttribute("aria-hidden", "true");
      target.hidden = true;
    } else {
      button.hidden = true;
    }
    return `${label}已从当前列表移除`;
  }

  if (/保存|提交|确认|完成|同步|刷新|测试|发送|发布|上架|提现|开票|处理|规划|导航|拨打|联系|搜索|筛选|查看|编辑|选择|切换|设置|开始/.test(actionName)) {
    const text = completedActionText(actionName, label);
    return text;
  }

  const text = genericActionFeedback(actionName, label);
  return text;
}

function activateChoice(button, label) {
  const group = button.closest(".chips, .segmented, .tabs, .ref-filter-tabs, .ref-record-tabs, .ref-order-tabs, .ref-service-tabs, .ref-shop-tabs, .tag-row");
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

function toggleSwitch(button, actionName) {
  const switchEl = button.classList.contains("switch") || button.classList.contains("device-switch")
    ? button
    : button.querySelector(".switch, .device-switch");
  if (!switchEl && !/开启|关闭|切换/.test(actionName)) return false;
  const target = switchEl || button;
  target.classList.toggle("on");
  target.setAttribute("aria-pressed", target.classList.contains("on") ? "true" : "false");
  return true;
}

function completedActionText(actionName, label = actionName) {
  if (/保存/.test(actionName)) return "已保存";
  if (/提交|发布|上架/.test(actionName)) return "已提交";
  if (/确认|完成/.test(actionName)) return "已确认";
  if (/同步/.test(actionName)) return "同步完成";
  if (/刷新/.test(actionName)) return "最新内容已重新加载";
  if (/收藏|关注/.test(actionName)) return "已收藏";
  if (/点赞|有用/.test(actionName)) return "反馈已提交";
  if (/发送/.test(actionName)) return "已发送";
  if (/拨打|联系/.test(actionName)) return "已进入联系状态";
  if (/导航|规划/.test(actionName)) return "路线已生成";
  if (/筛选/.test(actionName)) return "筛选条件已应用，列表按条件展示";
  if (/搜索/.test(actionName)) return "搜索条件已应用，列表按关键词展示";
  if (/选择/.test(actionName)) return `当前选择：${label.replace(/^选择/, "")}`;
  if (/切换/.test(actionName)) return `当前模式：${label.replace(/^切换/, "")}`;
  if (/设置/.test(actionName)) return "设置已保存";
  if (/查看/.test(actionName)) return `已进入${label.replace(/^查看/, "")}`;
  if (/编辑/.test(actionName)) return `${label}已进入编辑`;
  return `${label}已写入当前页面服务记录`;
}

function genericActionFeedback(actionName, label) {
  if (/share-2|分享/.test(actionName)) return "分享内容已生成，可发送给家人或服务人员";
  if (/heart|收藏/.test(actionName)) return "已收藏";
  if (/filter|筛选/.test(actionName)) return "筛选条件已应用，列表按条件展示";
  if (/calendar|日历/.test(actionName)) return "活动日历已按当前日期刷新";
  if (/plus|添加|新增|邀请/.test(actionName)) return `${label}表单进入编辑`;
  if (/客服|咨询/.test(actionName)) return "正在连接客服";
  if (/购物车/.test(actionName)) return "购物车清单已更新";
  if (/帮助/.test(actionName)) return "帮助内容已加载到当前页";
  if (/设置/.test(actionName)) return "设置项已保存到当前页";
  return `${label}已写入当前页面服务记录`;
}

function shouldSuppressTransientPrompt(text) {
  const value = String(text ?? "");
  return /打开|^当前选择为|状态.+已(切换|更新)|路线状态.+同步/.test(value)
    || /^当前(选择|筛选|模式|路线)：/.test(value)
    || /^(已开启|已关闭|已保存|已提交|已确认|已发送|已收藏|已取消|同步完成|反馈已提交|路线已生成|设置已保存|最新内容已重新加载)$/.test(value)
    || /已写入当前页面|已同步到当前|当前页面已刷新并回到顶部|筛选条件已应用/.test(value);
}

function actionStatusHtml(text) {
  return shouldSuppressTransientPrompt(text) ? "" : `<p class="action-status" data-action-status>${attr(text)}</p>`;
}

function writeActionStatus(source, text) {
  const content = document.querySelector(".content");
  let scope = source.closest?.(".section, .card, .ref-calendar-reminder, .ref-bottom-action, .list, .content") || content || source.parentElement;
  if (!scope || scope.classList?.contains("appbar")) scope = content || source.parentElement;
  if (!scope) return;
  let status = scope.querySelector("[data-action-status]");
  if (shouldSuppressTransientPrompt(text)) {
    if (status && shouldSuppressTransientPrompt(status.textContent)) status.remove();
    return;
  }
  if (!status) {
    status = document.createElement("p");
    status.className = "action-status";
    status.dataset.actionStatus = "";
    scope.appendChild(status);
  }
  status.textContent = text;
}

function normalizeMessageFilter(filter = "全部") {
  return MESSAGE_FILTERS.includes(filter) ? filter : "全部";
}

function initialMessageFilter() {
  try {
    return normalizeMessageFilter(localStorage.getItem("yunlv-message-filter") || "全部");
  } catch (error) {
    return "全部";
  }
}

function messageMatchesFilter(message, filter = activeMessageFilter) {
  const currentFilter = normalizeMessageFilter(filter);
  return currentFilter === "全部" || message.type === currentFilter;
}

function visibleMessagesForFilter(filter = activeMessageFilter, messages = currentUserMessages) {
  const source = Array.isArray(messages) ? messages : [];
  return source.filter((message) => messageMatchesFilter(message, filter));
}

function renderMessageListForFilter(filter = activeMessageFilter) {
  const list = document.querySelector(".ref-message-list");
  if (!list) return { visibleCount: 0, totalCount: 0 };
  const source = currentUserMessages;
  const visible = visibleMessagesForFilter(filter, source);
  const emptyText = !messagesApiLoaded
    ? "正在同步后台消息"
    : normalizeMessageFilter(filter) === "全部" ? "暂无消息" : `暂无${normalizeMessageFilter(filter)}消息`;
  list.innerHTML = messageListHtml(visible, emptyText);
  return { visibleCount: visible.length, totalCount: source.length };
}

function messageFootText(filter = activeMessageFilter, count = null, total = null) {
  const currentFilter = normalizeMessageFilter(filter);
  const hasCount = Number.isFinite(count);
  const countText = hasCount
    ? currentFilter === "全部" ? `全部消息 ${count} 条` : `${currentFilter}消息 ${count} 条`
    : currentFilter === "全部" ? "已显示最近 30 天消息" : `已筛选${currentFilter}消息`;
  const totalText = Number.isFinite(total) && currentFilter !== "全部" ? ` / 共 ${total} 条` : "";
  const readText = messagesRead ? " · 全部已读" : "";
  const sourceText = messagesApiLoaded ? " · 数据来自后台消息中心" : " · 正在同步后台消息";
  return `${countText}${totalText}${readText}${sourceText}`;
}

function syncMessagesReadButton() {
  const button = document.querySelector('.app-action[data-action="全部已读"]');
  const label = button?.querySelector("span");
  if (label) label.textContent = messagesRead ? "已读" : "全部已读";
  if (button) button.dataset.messageReadState = messagesRead ? "all-read" : "has-unread";
}

async function markMessagesRead(triggerButton = null) {
  if (currentId() !== "messages") {
    writeActionStatus(document.querySelector(".content") || document.body, "消息已全部标记为已读");
    return;
  }
  if (messagesRead) {
    writeActionStatus(document.querySelector(".screen-messages .content") || document.querySelector(".content") || document.body, "暂无未读消息");
    return;
  }
  const button = triggerButton || document.querySelector('.app-action[data-action="全部已读"]');
  if (button) button.disabled = true;
  try {
    const result = await userApi("/api/messages/read-all", { method: "POST", body: { role: "user" } });
    currentUserMessages = currentUserMessages.map((message) => ({ ...message, read: true }));
    messagesRead = true;
    filterMessages(activeMessageFilter, true);
    syncMessagesReadButton();
    writeActionStatus(document.querySelector(".screen-messages .content") || document.querySelector(".content") || document.body, `已标记 ${Number(result?.changed || 0)} 条未读消息`);
    showToast("全部消息已标记为已读");
  } catch (error) {
    writeActionStatus(document.querySelector(".screen-messages .content") || document.querySelector(".content") || document.body, `标记失败：${error.message}`);
    showToast(`标记失败：${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

function filterMessages(filter = "全部", silent = false) {
  activeMessageFilter = normalizeMessageFilter(filter);
  try {
    localStorage.setItem("yunlv-message-filter", activeMessageFilter);
  } catch (error) {}
  const tabs = document.querySelectorAll("[data-message-filter]");
  tabs.forEach((tab) => {
    const active = tab.dataset.messageFilter === activeMessageFilter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const { visibleCount, totalCount } = renderMessageListForFilter(activeMessageFilter);
  const foot = document.querySelector("[data-message-foot]");
  if (foot) foot.textContent = messageFootText(activeMessageFilter, visibleCount, totalCount);
  syncMessagesReadButton();
  if (!silent && foot) {
    foot.classList.add("is-fresh");
    window.setTimeout(() => foot.classList.remove("is-fresh"), 700);
  }
  if (!silent) showToast(activeMessageFilter === "全部" ? "已显示全部消息" : `正在查看${activeMessageFilter}消息`);
  if (window.lucide) window.lucide.createIcons();
}

function panelKey(prefix, text) {
  return `${prefix}-${String(text || "panel").replace(/[^\w\u4e00-\u9fa5-]+/g, "-").slice(0, 32)}`;
}

function messageRelatedTarget(message = {}) {
  const relatedType = String(message.relatedType || "");
  const relatedId = String(message.relatedId || "");
  if (relatedType === "order") return { route: "order-detail", label: "查看关联订单", orderId: relatedId };
  if (relatedType === "activity") return { route: "activity-signup", label: "查看关联活动", activityId: relatedId };
  if (relatedType === "device") return { route: "device-management", label: "查看关联设备" };
  if (relatedType === "alert") return { route: "sos-records", label: "查看求助记录" };
  if (relatedType === "familyContact") return { route: "contacts", label: "查看紧急联系人" };
  if (relatedType === "serviceRequest") return { route: "orders", label: "查看服务订单" };
  if (message.type === "活动") return { route: "activity-records", label: "查看活动记录" };
  if (message.type === "设备") return { route: "device-management", label: "查看设备管理" };
  if (message.type === "服务") return { route: "orders", label: "查看服务订单" };
  return { route: "home", label: "返回首页" };
}

async function handleMessagesAction(button, actionName) {
  if (currentId() !== "messages") return false;
  if (actionName.startsWith("筛选消息：")) {
    filterMessages(actionName.replace("筛选消息：", ""));
    return true;
  }
  if (actionName.startsWith("查看消息：")) {
    const row = button.closest(".message-row") || button;
    const messageId = row.dataset.messageId || "";
    const title = row.dataset.messageTitle || actionName.replace("查看消息：", "").trim();
    if (!messageId) {
      writeActionStatus(row, "消息缺少后台 ID，无法确认已读状态");
      showToast("消息数据不完整，请刷新后重试");
      return true;
    }
    row.disabled = true;
    let message = currentUserMessages.find((item) => item.id === messageId);
    try {
      await userApi(`/api/messages/${encodeURIComponent(messageId)}/read`, { method: "POST", body: { role: "user" } });
      currentUserMessages = currentUserMessages.map((item) => item.id === messageId ? { ...item, read: true } : item);
      message = currentUserMessages.find((item) => item.id === messageId) || message;
      row.classList.add("is-read");
      row.querySelector(".message-dot")?.setAttribute("hidden", "");
      messagesRead = currentUserMessages.length > 0 && currentUserMessages.every((item) => item.read);
      syncMessagesReadButton();
      const foot = document.querySelector("[data-message-foot]");
      if (foot) foot.textContent = messageFootText(activeMessageFilter, visibleMessagesForFilter(activeMessageFilter).length, currentUserMessages.length);
    } catch (error) {
      writeActionStatus(row, `消息加载失败：${error.message}`);
      showToast(`消息加载失败：${error.message}`);
      row.disabled = false;
      return true;
    }
    const type = message?.type || row.dataset.messageType || "系统";
    const text = message?.text || row.dataset.messageText || "";
    const time = message?.time || row.dataset.messageTime || "今天";
    const target = messageRelatedTarget(message);
    const targetAttrs = `${target.orderId ? ` data-order-id="${attr(target.orderId)}"` : ""}${target.activityId ? ` data-activity-id="${attr(target.activityId)}" data-activity-title="${attr(message?.title || title)}"` : ""}`;
    const panel = ensureLivePanel(panelKey("message", messageId), row);
    renderLivePanel(panel, title || "消息详情", `
      <div class="ref-profile-rights">
        <span>${icon("bell", 16)}消息类型：${attr(type)}</span>
        <span>${icon("clock-3", 16)}时间：${attr(time || "今天")}</span>
        <span>${icon("message-circle", 16)}${attr(text || "暂无详细内容")}</span>
        <span>${icon("radio", 16)}通知渠道：${attr((message?.channels || ["站内消息"]).join("、"))}</span>
      </div>
      <div class="ref-profile-help">
        <button data-route="${target.route}"${targetAttrs} type="button">${icon("chevron-right", 16)}${target.label}</button>
      </div>
    `, "消息已标记为已读");
    row.disabled = false;
    showToast("消息已标记为已读");
    return true;
  }
  return false;
}

function handleSettingsAction(button, actionName) {
  if (currentId() !== "settings") return false;
  if (actionName.startsWith("保存设置：")) {
    const panel = button.closest(".ref-live-panel");
    if (panel) panel.dataset.settingsSaved = actionName.replace("保存设置：", "");
    return true;
  }
  const row = button.closest(".settings-row, .ref-privacy-row") || button;
  if (actionName.startsWith("字体大小：")) {
    const size = actionName.replace("字体大小：", "").trim();
    if (!["小", "标准", "大"].includes(size)) return true;
    userSettings.fontSize = size;
    saveUserSettings();
    document.documentElement.dataset.userFontSize = size;
    const control = button.closest(".ref-font-size-control");
    control?.querySelectorAll("button").forEach((option) => {
      const active = option === button;
      option.classList.toggle("active", active);
      option.setAttribute("aria-pressed", active ? "true" : "false");
    });
    const fontRow = button.closest("[data-settings-key='fontSize']");
    if (fontRow) {
      fontRow.dataset.settingsValue = size;
      fontRow.setAttribute("aria-label", `字体大小：${size}`);
    }
    return true;
  }
  const settingsKey = button.dataset.settingsKey || row.dataset?.settingsKey || "";
  if (settingsKey && ["accountNotifications", "serviceNotifications", "familyCareReminder", "soundReminder"].includes(settingsKey)) {
    userSettings[settingsKey] = !userSettings[settingsKey];
    saveUserSettings();
    const enabled = Boolean(userSettings[settingsKey]);
    const switchEl = row.querySelector(".switch");
    switchEl?.classList.toggle("on", enabled);
    row.setAttribute("aria-pressed", enabled ? "true" : "false");
    row.dataset.settingsEnabled = enabled ? "true" : "false";
    return true;
  }
  if (settingsKey === "elderMode") {
    userSettings.elderMode = !userSettings.elderMode;
    saveUserSettings();
    const enabled = Boolean(userSettings.elderMode);
    row.setAttribute("aria-pressed", enabled ? "true" : "false");
    row.dataset.settingsEnabled = enabled ? "true" : "false";
    const value = row.querySelector(":scope > em");
    if (value) value.textContent = settingValueText("elderMode");
    return true;
  }
  if (actionName === "清除缓存") {
    userSettings.cacheSize = "0MB";
    saveUserSettings();
    row.dataset.cacheCleared = "true";
    const value = row.querySelector(":scope > em");
    if (value) value.textContent = userSettings.cacheSize;
    return true;
  }
  const switchEl = row.querySelector(".switch");
  if (switchEl) {
    switchEl.classList.toggle("on");
    const enabled = switchEl.classList.contains("on");
    row.setAttribute("aria-pressed", enabled ? "true" : "false");
    row.dataset.settingsEnabled = enabled ? "true" : "false";
    return true;
  }
  const detail = settingsDetailContent(actionName);
  if (!detail) return false;
  const panel = ensureLivePanel(panelKey("settings", actionName), row);
  renderLivePanel(panel, detail.title, detail.body);
  panel.dataset.settingsDetail = actionName;
  return true;
}

function settingsDetailContent(actionName) {
  const details = {
    "账号与安全": {
      title: "账号与安全",
      body: `
        <div class="ref-profile-rights">
          <span>${icon("shield-check", 16)}登录保护：手机号验证码已开启</span>
          <span>${icon("smartphone", 16)}绑定手机：138****4321</span>
          <span>${icon("lock", 16)}异地登录提醒：已接入消息通知</span>
        </div>
      `,
    },
    "隐私授权": {
      title: "隐私授权",
      body: `
        <div class="ref-profile-rights">
          <span>${icon("map-pin", 16)}定位授权：用于旅居推荐和紧急求助</span>
          <span>${icon("heart-pulse", 16)}健康摘要：仅授权家属关怀查看</span>
          <span>${icon("shield-check", 16)}数据最小化：可在个人资料中单项关闭</span>
        </div>
      `,
    },
    "帮助中心": {
      title: "帮助中心",
      body: `
        <div class="ref-profile-rights">
          <span>${icon("circle-help", 16)}订单、活动、设备、紧急求助均可查看操作说明</span>
          <span>${icon("message-circle", 16)}常见问题会同步到智能管家对话</span>
          <span>${icon("clock-3", 16)}人工客服 7x24 小时响应</span>
        </div>
      `,
    },
    "联系客服": {
      title: "联系客服",
      body: `
        <div class="ref-profile-rights">
          <span>${icon("phone", 16)}客服电话：400-888-XXXX</span>
          <span>${icon("headphones", 16)}服务时间：7x24 小时</span>
          <span>${icon("message-circle", 16)}可前往智能管家继续描述问题</span>
        </div>
        <div class="ref-profile-help">
          <button data-route="assistant" type="button">${icon("headphones", 16)}打开智能管家</button>
        </div>
      `,
    },
    "用户协议": {
      title: "用户协议",
      body: `<div class="ref-profile-rights"><span>${icon("file-text", 16)}协议范围：账号注册、旅居服务、订单履约和平台规则</span><span>${icon("shield-check", 16)}重点条款：费用、取消、售后与安全责任已归档</span></div>`,
    },
    "隐私政策": {
      title: "隐私政策",
      body: `<div class="ref-profile-rights"><span>${icon("shield-check", 16)}隐私政策说明定位、健康、设备和订单数据用途</span><span>${icon("lock", 16)}敏感信息仅用于授权服务、紧急求助和家属关怀</span></div>`,
    },
    "医疗免责声明": {
      title: "医疗免责声明",
      body: `<div class="ref-profile-rights"><span>${icon("cross", 16)}健康建议不替代医生诊断</span><span>${icon("ambulance", 16)}急症或明显不适请优先线下就医或使用紧急求助</span></div>`,
    },
    "关于云旅无忧": {
      title: "关于云旅无忧",
      body: `<div class="ref-profile-rights"><span>${icon("info", 16)}当前版本：2.3.6</span><span>${icon("shield-check", 16)}服务模块：旅居、向导、健康、设备、家属关怀</span><span>${icon("clock-3", 16)}最近更新：优化设置项和消息通知体验</span></div>`,
    },
  };
  return details[actionName] || null;
}

function handleBandSettingsAction(button, actionName) {
  if (currentId() !== "band-settings") return false;
  if (actionName === "立即同步") {
    const time = new Date().toTimeString().slice(0, 5);
    writeActionStatus(button.closest(".section, .card") || button, `手环数据已同步：今天 ${time}`);
    showToast("手环数据已同步");
    return true;
  }
  const row = button.closest(".ref-device-setting-row") || button;
  const switchEl = row.querySelector(".switch");
  if (switchEl) {
    switchEl.classList.toggle("on");
    const enabled = switchEl.classList.contains("on");
    row.setAttribute("aria-pressed", enabled ? "true" : "false");
    writeActionStatus(row, `${actionName}${enabled ? "已开启" : "已关闭"}`);
    showToast(enabled ? "已开启" : "已关闭");
    return true;
  }
  if (button.closest(".ref-threshold-card") || ["心率异常", "血氧低于", "定位频率", "查找手环", "解除绑定", "帮助"].includes(actionName)) {
    const panel = ensureLivePanel(panelKey("band", actionName), button.closest(".section, .card") || button);
    renderLivePanel(panel, actionName, `
      <div class="ref-profile-rights">
        <span>${icon("watch", 16)}${attr(actionName)}设置面板已展开</span>
        <span>${icon("refresh-cw", 16)}可调整后同步到智能手环</span>
      </div>
      <div class="ref-profile-help">
        <button data-action="立即同步" type="button">${icon("refresh-cw", 16)}同步到手环</button>
      </div>
    `, `${actionName}已展开`);
    return true;
  }
  return false;
}

async function handleRobotAction(button, actionName) {
  if (currentId() !== "robot") return false;
  if (actionName === "语音对话") {
    setRoute("assistant");
    return true;
  }
  if (actionName === "SOS 一键求助") {
    setRoute("emergency");
    return true;
  }
  if (["附近求助", "联系社区"].includes(actionName)) {
    await submitRobotHelpRequest(button, actionName);
    return true;
  }
  if (/语音通话|视频通话|测试设备|摔倒检测|异常检测|离家提醒|生命体征检测|用药提醒|长时间未动提醒/.test(actionName)) {
    const panel = ensureLivePanel(panelKey("robot", actionName), button.closest(".section, .card") || button);
    renderLivePanel(panel, actionName, `
      <div class="ref-profile-rights">
        <span>${icon("bot", 16)}${attr(actionName)}已连接小云机器人</span>
        <span>${icon("shield-check", 16)}状态会同步给家属和平台后台</span>
      </div>
      <div class="ref-profile-help">
        <button data-route="robot-settings" type="button">${icon("settings", 16)}进入机器人设置</button>
      </div>
    `, `${actionName}联动面板已展开`);
    showToast(`${actionName}联动面板已展开`);
    return true;
  }
  return false;
}

async function submitRobotHelpRequest(button, actionName) {
  const scope = button.closest(".ref-help-list, .card, .section") || button;
  const seq = Number(scope.dataset.robotHelpSeq || 0) + 1;
  scope.dataset.robotHelpSeq = String(seq);
  scope.dataset.robotHelpState = "submitting";
  if (button?.dataset) {
    button.dataset.robotHelpSeq = String(seq);
    button.dataset.robotHelpState = "submitting";
  }
  writeActionStatus(scope, `正在创建${actionName}帮助任务`);
  try {
    const request = window.YunlvBusiness?.request;
    if (!request) throw new Error("服务暂未初始化，请刷新后重试");
    const item = await request("/api/devices/help-request", {
      method: "POST",
      body: {
        target: actionName,
        providerType: actionName === "附近求助" ? "community" : "community",
        route: "robot",
        action: actionName,
        priority: actionName === "附近求助" ? "P1" : "P2",
        description: `${actionName}：来自用户端小云机器人帮助入口，需要后台协调附近人员或社区工作人员响应。`,
        payload: {
          city: currentCity || DEFAULT_CITY,
          location: currentLocation,
        },
      },
    }, "elder");
    scope.dataset.robotHelpState = "created";
    scope.dataset.robotHelpRequestId = item.id || "";
    scope.dataset.robotHelpRequestNo = item.requestNo || "";
    if (button?.dataset) {
      button.dataset.robotHelpState = "created";
      button.dataset.robotHelpRequestId = item.id || "";
      button.dataset.robotHelpRequestNo = item.requestNo || "";
      button.dataset.state = `${actionName} ${item.requestNo} 已生成`;
      button.classList.add("is-done");
    }
    const panel = ensureLivePanel(panelKey("robot-help", actionName), scope);
    renderLivePanel(panel, actionName, `
      <div class="ref-profile-rights">
        <span>${icon("clipboard-check", 16)}任务编号：${attr(item.requestNo || item.id || "已生成")}</span>
        <span>${icon("headphones", 16)}后台状态：${attr(item.status || "待处理")}</span>
        <span>${icon("map-pin", 16)}响应范围：${attr(currentCity || DEFAULT_CITY)}附近与社区服务人员</span>
      </div>
      <div class="ref-profile-help">
        <button data-route="messages" type="button">${icon("bell", 16)}查看消息</button>
        <button data-route="sos-records" type="button">${icon("clipboard-list", 16)}求助记录</button>
      </div>
    `, `${actionName}帮助任务已进入后台，编号 ${item.requestNo || item.id}`);
    showToast(`${actionName}任务已生成`);
  } catch (error) {
    scope.dataset.robotHelpState = "failed";
    if (button?.dataset) button.dataset.robotHelpState = "failed";
    writeActionStatus(scope, `${actionName}任务创建失败：${error.message}`, true);
    showToast(`${actionName}失败：${error.message}`);
  }
}

function handleDevicesAction(button, actionName) {
  if (currentId() !== "devices") return false;
  if (/位置守护|健康提醒|日程提醒|紧急联动|智能联动|查看全部设备/.test(actionName)) {
    const panel = ensureLivePanel(panelKey("devices", actionName), button.closest(".section, .card") || button);
    renderLivePanel(panel, actionName, `
      <div class="ref-profile-rights">
        <span>${icon("watch", 16)}${attr(actionName)}已展开</span>
        <span>${icon("bot", 16)}可在设备管理中继续配置机器人与手环联动</span>
      </div>
      <div class="ref-profile-help">
        <button data-route="device-management" type="button">${icon("settings", 16)}进入设备管理</button>
      </div>
    `, `${actionName}配置面板已展开`);
    return true;
  }
  return false;
}

function showToast(text) {
  clearUserPageOperationPanels();
  const toast = document.querySelector("[data-toast]");
  if (toast) {
    toast.classList.remove("show");
    toast.textContent = "";
  }
  const message = String(text || "").trim();
  if (!message) return;
  const active = document.activeElement?.closest?.("button, a, input, select, textarea, [role='button']");
  const anchor = active || document.querySelector(".content .section:last-of-type, .content .card:last-of-type, .content");
  if (/请|失败|暂无|无效|至少|未|不能|异常/.test(message)) {
    writeActionStatus(anchor || document.querySelector(".content") || document.body, message);
    return;
  }
}

function actionText(action) {
  const map = {
    "换一批": "推荐问题已换一批",
    "已生成智能回答": "已生成智能回答",
    "已重新生成回答": "已重新生成回答",
    voice: "正在聆听，请直接说话",
    "正在聆听，请直接说话": "正在聆听，请直接说话",
    "已识别语音问题": "已识别语音问题",
    "语音输入已结束": "语音输入已结束",
    "浏览器未开放麦克风权限": "浏览器未开放麦克风权限",
    "文字输入已展开": "文字输入已展开",
    "已收起文字输入": "已收起文字输入",
    "请输入问题后再发送": "请输入问题后再发送",
    "已发送文字问题": "已发送文字问题",
	    "已显示全部服务记录": "已显示全部服务记录",
	    "已筛选AI问答记录": "已筛选AI问答记录",
	    "已筛选服务推荐记录": "已筛选服务推荐记录",
	    "已筛选语音交互记录": "已筛选语音交互记录",
	    "清空成功": "清空成功",
	    "暂无服务记录": "暂无服务记录",
	    "已显示全部活动": "已显示全部活动",
	    "已筛选文化体验活动": "已筛选文化体验活动",
	    "已筛选康养健身活动": "已筛选康养健身活动",
	    "已筛选休闲娱乐活动": "已筛选休闲娱乐活动",
	    "已筛选自然观光活动": "已筛选自然观光活动",
	    "已筛选学习讲座活动": "已筛选学习讲座活动",
	    enable: "功能已开启",
    call: "正在准备联系服务人员",
    refresh: "当前位置和设备状态已同步",
    edit: "已进入编辑流程",
    export: "健康档案导出文件已生成",
    favorite: "已收藏",
    checkin: "打卡完成",
    restaurant: "正在打开餐厅详情",
    checkout: "结算清单已生成",
    code: "验证码已发送",
    share: "分享内容已生成",
    filter: "筛选条件已展开",
    reminder: "提醒已开启",
    "全部消息已标记为已读": "全部消息已标记为已读",
    "消息已全部标记为已读": "消息已全部标记为已读",
    "暂无未读消息": "暂无未读消息",
    "已展开全部旅居计划": "已展开全部旅居计划",
    "已收起旅居计划": "已收起旅居计划",
    "已点赞这条回答": "已点赞这条回答",
    "已取消点赞": "已取消点赞",
    "已标记这条回答有用": "已标记这条回答有用",
    "已取消有用标记": "已取消有用标记",
    "发动态": "发布动态表单进入编辑",
    "我的收藏": "已进入收藏列表",
  };
  return map[action] || action || "当前页面服务记录已更新";
}

function section(title, content, more = "") {
  return `
    <section class="section">
      <div class="section-head">
        <h2>${title}</h2>
        ${more}
      </div>
      ${content}
    </section>
  `;
}

function heroImage(image, title = "", text = "", className = "") {
  return `
    <div class="hero-img ${className}">
      <img src="${asset(image)}" alt="${title || "主题图"}" />
      ${title ? `<div class="hero-overlay"><h2>${title}</h2><p>${text}</p></div>` : ""}
    </div>
  `;
}

function quickRow(items, compact = false) {
  return `
    <div class="card quick-row ${compact ? "compact" : ""}">
      ${items.map((item, index) => `
        <button class="quick-item" ${item.route ? `data-route="${item.route}"` : `data-action="${item.action || item.title}"`} type="button">
          <span class="tile-icon ${item.image ? "has-image" : item.color || colors[index % colors.length]}">${item.image ? `<img class="tile-image" src="${asset(item.image)}" alt="">` : icon(item.icon, 24)}</span>
          <strong>${item.title}</strong>
          <small>${item.desc}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function serviceGrid(items, mode = "") {
  return `
    <div class="card service-grid ${mode}">
      ${items.map((item, index) => {
        const tag = item.href ? "a" : "button";
        const destination = item.href ? `href="${attr(item.href)}"` : "";
        const behavior = item.route ? `data-route="${item.route}"` : `data-action="${attr(item.action || item.title)}"`;
        return `
        <${tag} class="service-tile" ${destination} ${behavior}${tag === "button" ? ' type="button"' : ""}>
          <span class="tile-icon ${item.image ? "has-image" : item.color || colors[index % colors.length]}">${item.image ? `<img class="tile-image" src="${asset(item.image)}" alt="">` : icon(item.icon, 24)}</span>
          <b>${item.title}</b>
          <span>${item.desc || ""}</span>
        </${tag}>
      `; }).join("")}
    </div>
  `;
}

function activityCard(image, title, meta, tag = "", route = "activity-signup") {
  return `
    <article class="activity-card" data-route="${route}">
      <img src="${asset(image)}" alt="${title}" />
      <div class="body">
        <b>${title}</b>
        <div class="meta">${icon("calendar-days", 12)}${meta}</div>
        <div class="avatars">
          <img src="${asset("avatar-user.jpg")}" alt="用户头像" />
          <img src="${asset("avatar-daughter.jpg")}" alt="用户头像" />
          <span class="avatar"></span>
          <span class="meta" style="margin-left:6px">${tag}</span>
        </div>
      </div>
    </article>
  `;
}

function mapActivityCard(image, title, status, statusColor, time, place, distance, people, category = "文化体验", route = "activity-signup") {
  const activity = typeof image === "object"
    ? normalizeActivityMapEvent(image)
    : normalizeActivityMapEvent({ image, title, status, statusColor, time, place, distance, people, category, route });
  const routeAttr = activity.route ? `data-route="${activity.route}"` : `data-action="定位点位：${attr(activity.title)}"`;
  const activityAttrs = activity.id
    ? ` data-activity-id="${attr(activity.id)}" data-activity-title="${attr(activity.title)}" data-activity-time="${attr(activity.time)}" data-activity-location="${attr(activity.place)}" data-activity-image="${attr(activity.image)}" data-activity-status="${attr(activity.status)}" data-activity-category="${attr(activity.category)}"${homeEndpointAttr(activity)}`
    : "";
  return `
    <article class="activity-card map-activity-card" ${routeAttr} data-activity-map-type="${attr(activity.category)}"${activityAttrs}>
      <div class="map-activity-cover">
        <img src="${userAssetSrc(activity.image)}" alt="${attr(activity.title)}" />
        <span class="map-card-badge ${activity.statusColor}">${attr(activity.status)}</span>
      </div>
      <div class="body">
        <b>${attr(activity.title)}</b>
        <div class="meta">${icon("calendar-days", 12)}${attr(activity.time)}</div>
        <div class="meta">${icon("map-pin", 12)}${attr(activity.place)}</div>
        <div class="meta">${icon("map-pin", 12)}${attr(activity.distance)}</div>
        <div class="avatars">
          <img src="${asset("avatar-user.jpg")}" alt="用户头像" />
          <img src="${asset("avatar-daughter.jpg")}" alt="用户头像" />
          <span class="avatar"></span>
          <span class="meta" style="margin-left:6px">${attr(activity.people)}</span>
        </div>
      </div>
    </article>
  `;
}

function homeActivityCard(image, title, time, place, count, badge, badgeColor = "green") {
  const activity = typeof image === "object"
    ? normalizeHomeActivity(image, HOME_FALLBACK_ACTIVITIES[0])
    : normalizeHomeActivity({ image, title, time, location: place, joined: count, tag: badge, badgeColor }, HOME_FALLBACK_ACTIVITIES[0]);
  return `
    <article class="activity-card home-event-card" data-route="${activity.route}" data-activity-id="${attr(activity.id)}" data-activity-title="${attr(activity.title)}" data-activity-time="${attr(activity.time)}" data-activity-location="${attr(activity.location)}" data-activity-image="${attr(activity.image)}" data-activity-status="${attr(activity.tag)}" data-activity-category="${attr(activity.category)}"${homeEndpointAttr(activity)}>
      <div class="home-event-cover">
        <img src="${userAssetSrc(activity.image)}" alt="${attr(activity.title)}" />
        <span class="home-event-badge ${activity.badgeColor}">${attr(activity.tag)}</span>
      </div>
      <div class="body">
        <b>${attr(activity.title)}</b>
        <div class="home-event-meta">
          <span>${icon("clock-3", 12)}${attr(activity.time)}</span>
          <span>${icon("map-pin", 12)}${attr(activity.location)}</span>
        </div>
        <div class="avatars">
          <img src="${asset("avatar-user.jpg")}" alt="用户头像" />
          <img src="${asset("avatar-daughter.jpg")}" alt="用户头像" />
          <span class="avatar"></span>
          <span class="meta" style="margin-left:6px">${activity.joined}人已报名</span>
        </div>
      </div>
    </article>
  `;
}

function homeIconImage(file, label) {
  return `<img src="${userAssetSrc(file)}" alt="${attr(label)}" />`;
}

function homeFeatureRow(items) {
  return `
    <div class="card home-feature-row">
      ${items.map((item) => `
        <button class="home-feature-item" data-route="${item.route}"${homeEndpointAttr(item)} type="button">
          <span class="home-feature-icon">${homeIconImage(item.image, item.title)}</span>
          <strong>${attr(item.title)}</strong>
          <span class="home-feature-desc"><small>${attr(item.desc)}</small>${icon("chevron-right", 17)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function homeServiceGrid(items) {
  return `
    <div class="card home-service-grid">
      ${items.map((item) => `
        <button class="home-service-item" data-route="${item.route}"${homeEndpointAttr(item)} type="button">
          <span class="home-service-icon">${homeIconImage(item.image, item.title)}</span>
          <b>${attr(item.title)}</b>
          <span>${attr(item.desc)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function normalizeDestinationListData(destination = {}) {
  const id = String(destination.id || destination.key || "mile");
  const fallback = destinationDetails[id] || destinationDetails.mile;
  const title = destination.title || destination.name || fallback.title || "旅居目的地";
  const city = destination.city || "云南";
  const price = destination.price !== undefined ? destination.price : "3500";
  return {
    ...destination,
    id,
    key: id,
    title,
    name: title,
    city,
    price,
    image: destination.image || fallback.image || "destination-lake.jpg",
    tags: Array.isArray(destination.tags) ? destination.tags : fallback.tags || [],
    rating: String(destination.rating || fallback.rating || "4.8"),
    reviews: reviewText(destination.reviews, fallback.reviews || "236条评价"),
    distance: destination.distance || "126 公里",
    favorite: Boolean(destination.favorite),
    detailEndpoint: destination.detailEndpoint || `/api/user/destinations/${encodeURIComponent(id)}`,
    favoriteEndpoint: destination.favoriteEndpoint || `/api/user/destinations/${encodeURIComponent(id)}/favorite`,
    consultEndpoint: destination.consultEndpoint || `/api/user/destinations/${encodeURIComponent(id)}/consult`,
  };
}

function destinationCard(destination = {}) {
  destination = normalizeDestinationListData(destination);
  const favoriteAction = destination.favorite ? "取消收藏目的地" : "收藏目的地";
  const favoriteLabel = destination.favorite ? "已收藏" : "收藏";
  return `
    <article class="destination-card" data-route="destination-detail" data-destination-id="${attr(destination.id)}"${detailAttrs(destination.id, "destinations")} data-destination-detail-endpoint="${attr(destination.detailEndpoint)}" data-destination-favorite-endpoint="${attr(destination.favoriteEndpoint)}" data-destination-consult-endpoint="${attr(destination.consultEndpoint)}" data-destination-favorite="${destination.favorite ? "true" : "false"}">
      <div class="destination-cover"><img src="${userAssetSrc(destination.image)}" alt="${attr(destination.title)}" /><span class="destination-city-badge">${icon("map-pin", 11)}${attr(destination.city)}</span></div>
      <div class="body">
        <h3>${attr(destination.title)}</h3>
        <div class="rating">${icon("star", 14)} ${attr(destination.rating)}<i></i>${attr(destination.reviews)}</div>
        <div class="price">¥${attr(destination.price)}<small>/${attr(destination.unit || "月起")}</small><em>参考价格</em></div>
        <div class="tag-row">${destination.tags.map((tag, i) => `<span class="tag ${i % 2 ? "blue" : ""}">${attr(tag)}</span>`).join("")}</div>
        <footer>
          <span class="destination-distance">${icon("map-pin", 13)} 距离您 ${attr(destination.distance)}</span>
          <div class="destination-card-actions">
            <button class="destination-card-action" data-action="${favoriteAction}" data-destination-id="${attr(destination.id)}" data-local-action="true" type="button" aria-pressed="${destination.favorite ? "true" : "false"}">${favoriteLabel}</button>
            <button class="destination-card-action" data-action="咨询目的地" data-destination-id="${attr(destination.id)}" data-local-action="true" type="button">咨询</button>
            <button class="destination-card-action destination-card-detail" data-route="destination-detail" data-destination-id="${attr(destination.id)}"${detailAttrs(destination.id, "destinations")} type="button" aria-label="查看${attr(destination.title)}详情">详情</button>
          </div>
        </footer>
      </div>
    </article>
  `;
}

function productCard(productOrImage, name, desc, price, tag = "平台精选", rating = "4.8", reviews = "286条评价") {
  const product = typeof productOrImage === "object" && productOrImage
    ? productOrImage
    : {
      id: `shop-prod-${String(name || "product").replace(/[^\w\u4e00-\u9fa5]+/g, "-")}`,
      image: productOrImage,
      name,
      desc,
      price,
      tag,
      tags: [tag],
      rating,
      reviews,
      addCartEndpoint: "/api/user/shop/cart",
      buyEndpoint: "/api/user/shop/orders",
    };
  const productTag = product.tag || (product.tags || [])[0] || tag || "平台精选";
  return `
    <article class="product-card" data-shop-product-id="${attr(product.id)}" data-product-name="${attr(product.name)}" data-product-desc="${attr(product.desc)}" data-product-price="${attr(product.price)}" data-product-category="${attr(product.category || "")}">
      <img src="${asset(product.image || "product-bp-clean.jpg")}" alt="${apiText(product.name)}" />
      <div class="body">
        <span class="tag ${productTag.includes("适老") ? "orange" : ""}">${apiText(productTag)}</span>
        <h3>${apiText(product.name)}</h3>
        <p class="meta">${apiText(product.desc)}</p>
        <div class="rating">${icon("star", 14)} ${apiText(product.rating || rating)}　${apiText(product.reviews || reviews)}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px">
          <span class="price" style="margin:0">¥${apiText(product.price)}</span>
          <button class="btn line-green" data-add-cart="${attr(product.id)}" data-action="加入购物车" data-api-endpoint="${attr(product.addCartEndpoint || "/api/user/shop/cart")}" type="button">${icon("shopping-cart", 16)}加入购物车</button>
        </div>
      </div>
    </article>
  `;
}

async function addShopCartItem(button) {
  const card = button.closest("[data-product-name]");
  const productId = button.dataset.addCart || card?.dataset.shopProductId || "";
  const name = card?.dataset.productName || "优选商城商品";
  button.disabled = true;
  try {
    const data = await userApi("/api/user/shop/cart", {
      method: "POST",
      body: { productId, quantity: 1, source: "shop" },
    });
    shopPageState = data.page || shopPageState;
    syncShopCartFromApi(data.cart || data.page?.cart || {});
    shopCartOpen = true;
    render();
    writeActionStatus(document.querySelector("[data-shop-cart-panel]") || document.querySelector(".checkout-bar") || button, `${apiText(data.item?.name || name)}已加入购物车`);
    showToast(`${name}已加入购物车`);
  } catch (error) {
    writeActionStatus(card || button, `加入购物车失败：${error.message}`);
  } finally {
    button.disabled = false;
  }
}

function syncShopCart() {
  shopCartItems = shopCartItems.filter((item) => Number(item.quantity || 0) > 0);
  cartCount = shopCartItems.reduce((sum, product) => sum + Number(product.quantity || 1), 0);
  localStorage.setItem("yunlv-shop-cart", JSON.stringify(shopCartItems));
}

async function updateShopCartQuantity(id, delta, button = null) {
  const item = shopCartItems.find((product) => product.id === id);
  if (!item) return;
  const quantity = Math.max(0, Number(item.quantity || 1) + Number(delta || 0));
  try {
    const data = await userApi(`/api/user/shop/cart/items/${encodeURIComponent(id)}`, {
      method: "POST",
      body: { quantity, source: "shop" },
    });
    shopPageState = data.page || shopPageState;
    syncShopCartFromApi(data.cart || data.page?.cart || {});
    shopCartOpen = true;
    render();
    window.setTimeout(() => openShopCartPanel(document.querySelector(".checkout-bar") || button, true), 0);
  } catch (error) {
    writeActionStatus(document.querySelector("[data-shop-cart-panel]") || button, `购物车更新失败：${error.message}`);
  }
}

async function removeShopCartItem(id) {
  try {
    const data = await userApi(`/api/user/shop/cart/items/${encodeURIComponent(id)}`, {
      method: "DELETE",
      body: { source: "shop" },
    });
    shopPageState = data.page || shopPageState;
    syncShopCartFromApi(data.cart || data.page?.cart || {});
    shopCartOpen = true;
    render();
    window.setTimeout(() => openShopCartPanel(document.querySelector(".checkout-bar"), true), 0);
    writeActionStatus(document.querySelector("[data-shop-cart-panel]") || document.querySelector(".content") || document.body, "已从购物车移除");
  } catch (error) {
    writeActionStatus(document.querySelector("[data-shop-cart-panel]") || document.querySelector(".content") || document.body, `移除失败：${error.message}`);
  }
}

function shopCartTotal() {
  return shopCartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
}

function shopCartSummary() {
  return shopCartItems.map((item) => `${item.name}x${item.quantity || 1}`).join("、");
}

function openShopCartPanel(button, forceOpen = false) {
  shopCartOpen = forceOpen ? true : !shopCartOpen;
  render();
}

function toggleShopCartPanel() {
  shopCartOpen = !shopCartOpen;
  render();
}

function closeShopCartPanel() {
  shopCartOpen = false;
  render();
}

function shopCartPanelHtml() {
  return `
    <section class="ref-shop-cart-edit" data-shop-cart-panel>
      <div class="section-head"><h2>购物车编辑</h2><button class="text" data-shop-cart-close type="button">收起</button></div>
      ${shopCartItems.length ? `
    <div class="ref-shop-cart-panel">
      ${shopCartItems.map((item) => `
        <article>
          <div><b>${attr(item.name)}</b><span>¥${Number(item.price || 0)} / 件</span></div>
          <div class="ref-shop-cart-stepper">
            <button data-cart-step="${attr(item.id)}" data-cart-delta="-1" type="button" aria-label="减少">${icon("minus", 14)}</button>
            <strong>${Number(item.quantity || 1)}</strong>
            <button data-cart-step="${attr(item.id)}" data-cart-delta="1" type="button" aria-label="增加">${icon("plus", 14)}</button>
            <button class="danger" data-remove-cart="${attr(item.id)}" type="button">移除</button>
          </div>
        </article>
      `).join("")}
      <footer><span>共 ${cartCount} 件</span><b>合计 ¥${shopCartTotal()}</b></footer>
    </div>
  ` : `<div class="ref-shop-cart-empty">${icon("shopping-cart", 24)}<span>购物车暂无商品</span><button class="btn ghost" data-shop-cart-close data-action="继续选购" type="button">继续选购</button><button class="btn ghost" data-shop-cart-close data-action="收起购物车" type="button">收起购物车</button></div>`}
      ${actionStatusHtml(shopCartItems.length ? "可在购物车内调整数量或移除商品" : "购物车为空")}
    </section>
  `;
}

function applyShopSearch(query) {
  const keyword = String(query || "").trim().toLowerCase();
  const cards = [...document.querySelectorAll(".ref-shop-products .product-card")];
  let visible = 0;
  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const matched = !keyword || text.includes(keyword);
    card.hidden = !matched;
    if (matched) visible += 1;
  });
  const box = document.querySelector(".ref-shop-search-box");
  writeActionStatus(box || document.querySelector(".screen-shop .content") || document.body, keyword ? `已筛选出 ${visible} 个商品` : "已显示全部商城商品");
}

async function submitShopCheckout(button) {
  const bar = button.closest(".checkout-bar") || button;
  const checkoutSeq = Number(bar?.dataset?.checkoutSeq || 0) + 1;
  if (bar?.dataset) bar.dataset.checkoutSeq = String(checkoutSeq);
  if (button?.dataset) button.dataset.checkoutSeq = String(checkoutSeq);
  if (!shopCartItems.length) {
    if (bar?.dataset) bar.dataset.checkoutState = "needs-items";
    if (button?.dataset) button.dataset.checkoutState = "needs-items";
    shopCartOpen = true;
    render();
    const nextBar = document.querySelector(".checkout-bar") || bar;
    if (nextBar?.dataset) {
      nextBar.dataset.checkoutSeq = String(checkoutSeq);
      nextBar.dataset.checkoutState = "needs-items";
    }
    writeActionStatus(nextBar, "购物车已展开，请先选择商品后结算");
    showToast("请先选择商品");
    return;
  }
  button.disabled = true;
  button.classList.add("is-busy");
  if (bar?.dataset) bar.dataset.checkoutState = "submitting";
  if (button?.dataset) button.dataset.checkoutState = "submitting";
  const total = shopCartTotal();
  const payload = {
    serviceType: "优选商城商品结算",
    providerType: "merchant",
    providerId: "merchant-001",
    amount: total,
    elderName: "李秀兰",
    phone: "13800005678",
    time: formatStatusTime(),
    location: `${currentCity && currentCity !== "定位中" ? currentCity : "昆明"}市五华区翠湖康养公寓`,
    source: "用户端优选商城",
    note: `商城结算：${shopCartSummary()}。配送到旅居地，需商户确认库存和配送时间。`,
    items: shopCartItems,
  };
  try {
    const data = await userApi("/api/user/shop/orders", { method: "POST", body: { ...payload, items: shopCartItems } });
    const order = data.order || {};
    shopPageState = data.page || shopPageState;
    localStorage.setItem("yunlv-selected-order", order.id);
    syncShopCartFromApi(data.page?.cart || { items: [], count: 0, total: 0 });
    if (bar?.dataset) {
      bar.dataset.checkoutState = "submitted";
      bar.dataset.checkoutOrderId = order.id || "";
    }
    if (button?.dataset) {
      button.dataset.checkoutState = "submitted";
      button.dataset.checkoutOrderId = order.id || "";
      button.dataset.state = `订单 ${order.orderNo} 已提交`;
    }
    writeActionStatus(bar, `订单 ${order.orderNo} 已提交，后台和商户端可查看。`);
    showToast("商城订单已提交");
    setRoute("order-detail");
  } catch (error) {
    if (bar?.dataset) bar.dataset.checkoutState = "failed";
    if (button?.dataset) button.dataset.checkoutState = "failed";
    writeActionStatus(bar, `结算失败：${error.message}`);
    showToast(`结算失败：${error.message}`);
  } finally {
    button.disabled = false;
    button.classList.remove("is-busy");
  }
}

function listRow(iconName, title, text, color = "blue", right = icon("chevron-right", 18), route = "") {
  return `
    <div class="list-row" ${route ? `data-route="${route}"` : ""}>
      <span class="tile-icon ${color}">${icon(iconName, 22)}</span>
      <div><b>${title}</b><p>${text}</p></div>
      <span>${right}</span>
    </div>
  `;
}

function settingRow(iconName, label, value = icon("chevron-right", 18), color = "#3b82f6", route = "") {
  return `
    <button class="settings-row" ${route ? `data-route="${route}"` : `data-action="${label}"`} type="button">
      <span style="color:${color}">${icon(iconName, 19)}</span>
      <span>${label}</span>
      <span>${value}</span>
    </button>
  `;
}

function renderHome() {
  const requirements = currentHomeRequirements();
  const services = homeFeatureGridData();
  const quickServices = homeQuickServices();
  const heroSlides = homeHeroSlidesData();
  const activities = homeActivityRecommendations();

  return `
    <div class="home-reference" data-home-api-source="${requirements ? "/api/user/home" : "fallback"}" data-home-requirements-version="${attr(requirements?.version || "")}">
      <div class="home-hero-wrap home-hero-carousel" aria-label="首页主题轮播">
        <div class="home-hero-track">
          ${heroSlides.map((slide) => `
            <button class="hero-img home-hero-slide" data-route="${slide.route}"${slide.detailKey ? detailAttrs(slide.detailKey, "home") : ""}${slide.activityId ? ` data-activity-id="${attr(slide.activityId)}"` : ""}${homeEndpointAttr(slide)} type="button" aria-label="打开${attr(slide.alt)}">
              <img src="${userAssetSrc(slide.image)}" alt="${attr(slide.alt)}" />
            </button>
          `).join("")}
        </div>
        <div class="home-hero-dots" aria-hidden="true">
          ${heroSlides.map((_, index) => `<span class="${index === 0 ? "active" : ""}"></span>`).join("")}
        </div>
      </div>
      <div class="section home-quick-section">
      ${homeFeatureRow(quickServices)}
      </div>
      <div class="section home-service-section">${homeServiceGrid(services)}</div>
      <section class="section card home-activity-panel">
        <div class="section-head">
          <h2>活动推荐</h2>
          <button data-route="activity-calendar" type="button">更多活动 ${icon("chevron-right", 16)}</button>
        </div>
        <div class="image-card-grid home-events">
          ${activities.map((activity) => homeActivityCard(activity)).join("")}
        </div>
      </section>
      <div class="quote-banner home-quote-banner">
        <div><strong>旅居不只是换个地方<br />更是换一种更好的生活方式</strong></div>
        <button class="btn ghost" data-route="destination-detail"${detailAttrs("mile", "home")} type="button">查看旅居故事 ${icon("chevron-right", 16)}</button>
        <img src="${asset("home-quote-chair.png")}" alt="" />
      </div>
    </div>
  `;
}

function destinationCatalog() {
  return [
    { image: "destination-lake.jpg", name: "弥勒湖泉康养社区", city: "云南 · 弥勒", price: "3500", tags: ["温泉康养", "配套完善", "医疗便利"], rating: "4.8", reviews: "236条评价", distance: "126 公里", key: "mile", keywords: ["湖泉康养", "康养"] },
    { image: "destination-city.jpg", name: "昆明滇池旅居区", city: "云南 · 昆明", price: "3200", tags: ["气候宜人", "生态优美", "交通便利"], rating: "4.7", reviews: "189条评价", distance: "138 公里", key: "kunming", keywords: ["气候宜人"] },
    { image: "destination-dali.jpg", name: "大理洱海慢生活", city: "云南 · 大理", price: "3800", tags: ["自然风光", "文化体验", "生活悠闲"], rating: "4.9", reviews: "312条评价", distance: "258 公里", key: "dali", keywords: ["文化体验"] },
    { image: "destination-hot-spring.jpg", name: "腾冲温泉康养地", city: "云南 · 腾冲", price: "3600", tags: ["温泉疗养", "空气优良", "养生度假"], rating: "4.8", reviews: "165条评价", distance: "524 公里", key: "tengchong", keywords: ["气候宜人", "康养"] },
  ];
}

function destinationListData() {
  const apiDestinations = destinationsPageState?.destinations;
  const source = Array.isArray(apiDestinations) && apiDestinations.length ? apiDestinations : destinationCatalog();
  return source.map(normalizeDestinationListData);
}

function destinationFiltersData() {
  const apiFilters = destinationsPageState?.filters;
  if (Array.isArray(apiFilters) && apiFilters.length) return apiFilters.map((filter) => ({
    key: filter.key || filter,
    count: filter.count,
  }));
  const catalog = destinationCatalog();
  return DESTINATION_FILTERS.map((key) => ({
    key,
    count: key === "全部" ? catalog.length : catalog.filter((destination) => destinationMatchesFilter(destination, key)).length,
  }));
}

function destinationMatchesFilter(destination, filter) {
  if (!filter || filter === "全部") return true;
  const haystack = [destination.name, destination.city, destination.price, destination.rating, destination.reviews, destination.distance, ...destination.tags, ...(destination.keywords || [])].join(" ");
  if (filter === "湖泉康养") return /湖泉|康养|温泉/.test(haystack);
  if (filter === "气候宜人") return /气候|空气|生态/.test(haystack);
  return haystack.includes(filter);
}

function queueDestinationSearch(input, immediate = false) {
  destinationSearchQuery = input?.value?.trim?.() || "";
  window.clearTimeout(destinationSearchTimer);
  if (immediate) {
    hydrateDestinationsFromApi({ force: true, silent: true });
    return;
  }
  destinationSearchTimer = window.setTimeout(() => hydrateDestinationsFromApi({ force: true, silent: true }), 260);
}

async function handleDestinationFilterAction(button, filter) {
  activeDestinationFilter = DESTINATION_FILTERS.includes(filter) ? filter : DESTINATION_FILTERS[0];
  render();
  await hydrateDestinationsFromApi({ force: true, silent: true });
  const count = Number(destinationsPageState?.summary?.filtered ?? destinationListData().length);
  const text = activeDestinationFilter === "全部" ? `已显示全部旅居目的地，共 ${count} 个` : `已筛选${activeDestinationFilter}目的地，共 ${count} 个`;
  const target = document.querySelector(".screen-destinations .ref-filter-tabs") || document.querySelector(".screen-destinations .content") || button;
  const grid = document.querySelector(".screen-destinations .ref-destination-grid");
  if (grid) {
    grid.dataset.destinationFilter = activeDestinationFilter;
    grid.dataset.destinationFilterRefresh = String(Date.now());
    grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  writeActionStatus(target, text);
  showToast(text);
}

function renderDestinations() {
  const usingApi = Boolean(destinationsPageState?.sourceEndpoint);
  const visibleDestinations = usingApi
    ? destinationListData()
    : destinationCatalog().filter((destination) => destinationMatchesFilter(destination, activeDestinationFilter)).map(normalizeDestinationListData);
  const filters = destinationFiltersData();
  const total = Number(destinationsPageState?.summary?.total ?? 48);
  const updateText = destinationsPageState?.summary?.updatedAt || formatRecentDataUpdateTime();
  const destinationInfoUpdateText = String(updateText || "").replace(/^\d{4}-/, "") || "刚刚";
  return `
    <label class="search ref-page-search">${icon("search", 20)}<input data-destination-search type="search" value="${attr(destinationSearchQuery)}" placeholder="搜索城市/康养地"></label>
    <div class="ref-hero-img ref-destination-hero"><img src="${asset("destination-hero.jpg")}" alt="精选康养旅居地"></div>
    <div class="chips ref-filter-tabs">
      ${filters.map((filter) => `<button class="chip ${filter.key === activeDestinationFilter ? "active" : ""}" data-action="筛选目的地：${attr(filter.key)}" data-local-action="true" type="button" aria-pressed="${filter.key === activeDestinationFilter ? "true" : "false"}">${attr(filter.key)}${filter.count !== undefined ? `<small>${attr(filter.count)}</small>` : ""}</button>`).join("")}
    </div>
    <div class="destination-grid ref-destination-grid">
      ${destinationsLoading ? `<div class="card ref-empty-state">正在加载目的地数据...</div>` : visibleDestinations.length ? visibleDestinations.map((destination) => destinationCard(destination)).join("") : `<div class="card ref-empty-state">暂无${attr(activeDestinationFilter)}目的地，请切换其他筛选条件</div>`}
    </div>
    <div class="ai-banner ref-destination-ai">
      <div><strong>适合老人的旅居目的地怎么选</strong><span class="meta">小云AI为您综合评估，推荐更合适的选择</span><p>${icon("check-circle", 12)}气候适宜　${icon("check-circle", 12)}医疗资源　${icon("check-circle", 12)}生活成本　${icon("check-circle", 12)}安全指数</p></div>
      <img src="${asset("assistant-robot.jpg")}" alt="小云">
      <button class="btn" data-route="assistant" type="button">AI智能推荐 ${icon("arrow-right", 16)}</button>
    </div>
    <div class="info-banner">
      <span class="meta" data-destinations-status>${icon("info", 16)} ${usingApi ? "平台数据" : "本地推荐"} · 更新 ${attr(destinationInfoUpdateText)}</span>
      <button class="meta ref-destination-total-button" data-action="目的地总览" data-local-action="true" type="button">共 ${total} 个目的地 ${icon("chevron-right", 16)}</button>
    </div>
  `;
}

async function handleDestinationsAction(button, actionName) {
  if (currentId() !== "destinations") return false;
  if (actionName === "重新读取目的地") {
    await hydrateDestinationsFromApi({ force: true });
    return true;
  }
  if (/^(收藏目的地|取消收藏目的地)$/.test(actionName)) {
    await toggleDestinationFavoriteFromApi(button, actionName);
    return true;
  }
  if (actionName === "咨询目的地") {
    await submitDestinationConsult(button, "destinations");
    return true;
  }
  if (actionName === "目的地总览") {
    if (!destinationsPageState) await hydrateDestinationsFromApi({ force: true, silent: true });
    const catalog = destinationListData();
    const visibleDestinations = catalog;
    const panel = ensureLivePanel("destination-overview", button.closest(".info-banner") || button);
    renderLivePanel(panel, "目的地总览", `
      <div class="ref-destination-overview">
        <div class="ref-destination-overview-stats">
          <span>${icon("map", 16)}平台已接入 ${Number(destinationsPageState?.summary?.total ?? catalog.length)} 个旅居目的地</span>
          <span>${icon("filter", 16)}当前展示 ${visibleDestinations.length} 个精选目的地</span>
          <span>${icon("clock-3", 16)}数据更新时间：${attr(destinationsPageState?.summary?.updatedAt || formatRecentDataUpdateTime())}</span>
        </div>
        <div class="ref-destination-overview-list">
          ${catalog.map((destination) => `<button data-route="destination-detail" data-destination-id="${attr(destination.id)}"${detailAttrs(destination.id, "destinations")} type="button"><b>${attr(destination.title)}</b><small>${attr(destination.city)} · ${destination.tags.map(attr).join(" / ")}</small>${icon("chevron-right", 14)}</button>`).join("")}
        </div>
      </div>
    `, `目的地总览已展开，当前可查看 ${catalog.length} 个精选目的地入口`);
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return true;
  }
  if (actionName !== "我的收藏") return false;
  if (!destinationsPageState) await hydrateDestinationsFromApi({ force: true, silent: true });
  const panel = ensureLivePanel("destination-favorites", document.querySelector(".ref-destination-grid") || button);
  const allDestinations = destinationListData();
  const favorites = allDestinations.filter((destination) => destination.favorite || destinationFavorites.includes(destination.id));
  renderLivePanel(panel, "我的收藏", favorites.length ? `
    <div class="destination-grid ref-destination-grid">
      ${favorites.map((destination) => destinationCard(destination)).join("")}
    </div>
  ` : `
    <div class="ref-profile-rights">
      <span>${icon("heart", 16)}暂未收藏目的地</span>
      <span>${icon("map-pin", 16)}进入目的地详情后可点击收藏保存</span>
    </div>
  `, favorites.length ? `收藏列表已展开，共 ${favorites.length} 个目的地` : "收藏列表已展开");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  return true;
}

function renderDestinationDetail() {
  const detail = activeDestinationDetail();
  const favorited = isDestinationFavorited();
  const destinationId = detail.id || selectedDestinationKey;
  const favoriteClass = favorited ? " active" : "";
  const favoritePressed = favorited ? "true" : "false";
  return `
    <div class="ref-detail-hero"><img src="${userAssetSrc(detail.image)}" alt="${attr(detail.title)}"><button data-route="${destinationReturnRoute}" type="button" aria-label="返回">${icon("chevron-left", 20)}</button><div class="ref-detail-actions" aria-label="目的地操作"><button data-action="分享目的地" data-local-action="true" type="button">${icon("share-2", 18)}分享</button><button class="${favoriteClass}" data-action="收藏目的地" data-destination-id="${attr(destinationId)}" data-local-action="true" type="button" aria-pressed="${favoritePressed}">${destinationFavoriteButtonContent("收藏目的地", favorited)}</button></div></div>
    <section class="card form-card ref-destination-title">
      <div>
        <h2>${attr(detail.title)}</h2>
        <div class="tag-row">${detail.tags.map((tag, index) => `<span class="tag ${index === 2 ? "blue" : ""}">${tag}</span>`).join("")}</div>
        <div class="rating">${icon("star", 15)} ${detail.rating} <i></i> ${detail.reviews} <i></i> ${detail.followers}</div>
      </div>
      <aside><button class="${favoriteClass}" data-action="关注目的地" data-destination-id="${attr(destinationId)}" data-local-action="true" type="button" aria-pressed="${favoritePressed}">${destinationFavoriteButtonContent("关注目的地", favorited)}</button><button data-action="导航到目的地" type="button">${icon("send", 16)}导航</button></aside>
    </section>
    <section class="card ref-destination-reasons">
      <h3>推荐理由</h3>
      <div>${detail.reasons.map(([iconName, title, desc, color]) => `<article><span class="tile-icon ${color}">${icon(iconName, 24)}</span><b>${title}</b><small>${desc}</small></article>`).join("")}</div>
    </section>
    ${section("基础信息", `
      <div class="card ref-basic-info">
        ${[
          ["map-pin", "地址", detail.address],
          ["sun", "适合季节", detail.season],
          ["stethoscope", "周边医院", detail.hospital],
          ["bus", "公交交通", detail.transport],
        ].map(([iconName, title, text]) => `<button type="button" data-action="${title}"><span>${icon(iconName, 18)}</span><b>${title}</b><em>${text}</em>${icon("chevron-right", 15)}</button>`).join("")}
      </div>
    `)}
    ${section("旅居资源", `
      <div class="ref-resource-grid">
        ${[
          ["building-2", "康养公寓", "多种房型可选", "green"],
          ["utensils", "本地美食", "特色餐饮推荐", "orange"],
          ["map-pin", "活动地图", "景点/设施分布", "blue"],
        ].map(([iconName, title, desc, color]) => `<button data-route="${title === "本地美食" ? "food" : title === "活动地图" ? "activity-map" : "order-submit"}" type="button"><span class="tile-icon ${color}">${icon(iconName, 24)}</span><b>${title}</b><small>${desc}</small></button>`).join("")}
      </div>
    `)}
    ${section("今日活动推荐", `
      <div class="image-card-grid ref-today-events">
        ${activityCard("activity-taiji.jpg", "湖泉生态晨练", "07:00-08:30", "报名中")}
        ${activityCard("destination-city.jpg", "健康知识讲座", "10:00-11:30", "热推")}
        ${activityCard("activity-music.jpg", "傍晚音乐会", "18:30-20:00", "即将开始")}
      </div>
    `, `<button data-route="activity-calendar" type="button">查看全部 ${icon("chevron-right", 15)}</button>`)}
    <section class="card ref-family-bind">
      <div><b>家属关怀</b><p>绑定家属后，可查看旅居动态与活动参与情况<br>让关爱更贴心，陪伴更安心</p></div>
      <img src="${asset("family-hero.jpg")}" alt="家属关怀">
      <button data-route="family" type="button">立即绑定</button>
    </section>
    <div class="ref-bottom-action ref-detail-bottom"><button data-action="咨询目的地" data-destination-id="${attr(destinationId)}" data-local-action="true" type="button"><img src="${asset("assistant-robot.jpg")}" alt="">咨询目的地</button><button class="${favoriteClass}" data-action="加入收藏" data-destination-id="${attr(destinationId)}" data-local-action="true" type="button" aria-pressed="${favoritePressed}">${destinationFavoriteButtonContent("加入收藏", favorited)}</button><button class="primary" data-route="order-submit" type="button">查看旅居方案</button></div>
  `;
}

function destinationDetailShareData() {
  const detail = activeDestinationDetail();
  return {
    title: `${detail.title} - 云旅无忧`,
    text: `推荐您查看${detail.title}：${detail.tags.join("、")}。地址：${detail.address}`,
    url: `${window.location.origin}${window.location.pathname}#destination-detail`,
  };
}

function destinationShareText(shareData) {
  return `${shareData.title}\n${shareData.text}\n${shareData.url}`;
}

function recordDestinationDetailAction(action, payload = {}) {
  window.YunlvBusiness?.request?.("/api/ui/actions", {
    method: "POST",
    body: {
      role: "user",
      route: "destination-detail",
      action,
      payload: { destinationKey: selectedDestinationKey, title: activeDestinationDetail().title, ...payload },
    },
  }, "elder").catch(() => {});
}

function openDestinationSharePanel(shareData, statusText = "") {
  document.querySelector("[data-destination-share-panel]")?.remove();
  const target = document.querySelector(".ref-destination-title") || document.querySelector(".screen-destination-detail .content");
  if (!target) return;
  const smsHref = `sms:?&body=${encodeURIComponent(destinationShareText(shareData))}`;
  target.insertAdjacentHTML("afterend", `
    <section class="card ref-destination-share-panel" data-destination-share-panel>
      <div class="section-head"><h2>分享目的地</h2><button data-action="关闭目的地分享" data-local-action="true" type="button">关闭 ${icon("x", 14)}</button></div>
      <p>${attr(shareData.text)}</p>
      <label><span>分享链接</span><input readonly value="${attr(shareData.url)}"></label>
      <div>
        <button class="btn ghost" data-action="复制目的地分享链接" data-local-action="true" type="button">${icon("copy", 15)}复制链接</button>
        <a class="btn blue" href="${attr(smsHref)}">${icon("message-circle", 15)}短信发送</a>
      </div>
      ${statusText ? actionStatusHtml(statusText) : ""}
    </section>
  `);
}

async function copyDestinationShareLink(button, shareData = destinationDetailShareData()) {
  const panel = document.querySelector("[data-destination-share-panel]");
  const scope = panel || document.querySelector(".ref-destination-title") || button;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
    await navigator.clipboard.writeText(destinationShareText(shareData));
    writeActionStatus(scope, "目的地分享链接已复制，可发送给家人或朋友");
    showToast("分享链接已复制");
    recordDestinationDetailAction("复制目的地分享链接", { url: shareData.url });
    return true;
  } catch (error) {
    writeActionStatus(scope, "当前浏览器未开放剪贴板权限，请长按链接复制或使用短信发送");
    showToast("请长按链接复制");
    return false;
  }
}

async function shareDestinationDetail(button) {
  const scope = document.querySelector(".ref-destination-title") || button;
  const shareData = destinationDetailShareData();
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      writeActionStatus(scope, "已调起系统分享，可发送给家人或服务人员");
      showToast("系统分享面板已唤起");
      recordDestinationDetailAction("分享目的地", { method: "system", url: shareData.url });
      return;
    }
    const copied = await copyDestinationShareLink(button, shareData);
    openDestinationSharePanel(shareData, copied ? "链接已复制，也可以通过短信发送" : "分享链接已展示，可复制或短信发送");
    recordDestinationDetailAction("分享目的地", { method: copied ? "clipboard" : "panel", url: shareData.url });
  } catch (error) {
    if (error?.name === "AbortError") {
      writeActionStatus(scope, "已取消分享，目的地仍保留在当前页面");
      return;
    }
    const copied = await copyDestinationShareLink(button, shareData);
    openDestinationSharePanel(shareData, copied ? "链接已复制，也可以通过短信发送" : "分享链接已展示，可复制或短信发送");
  }
}

async function openDestinationDetailNavigation(button) {
  const detail = activeDestinationDetail();
  const destination = detail.address || detail.title || "目的地";
  recordDestinationDetailAction("导航到目的地", { destination });
  await openRouteNavigation(button, destination, {
    label: detail.title,
    point: detail.position,
    skipGeocode: true,
  });
}

function updateDestinationFavoriteControls(favorited) {
  document.querySelectorAll('[data-action="收藏目的地"], [data-action="关注目的地"], [data-action="加入收藏"]').forEach((button) => {
    const actionName = button.dataset.action;
    button.classList.toggle("active", favorited);
    button.setAttribute("aria-pressed", favorited ? "true" : "false");
    const iconNode = button.querySelector(".ref-destination-favorite-icon");
    const labelNode = button.querySelector(".ref-destination-favorite-label");
    if (!iconNode || !iconNode.querySelector("svg") || !labelNode) {
      button.innerHTML = destinationFavoriteButtonContent(actionName, favorited);
      return;
    }
    labelNode.textContent = destinationFavoriteLabel(actionName, favorited);
  });
}

function syncDestinationFavoriteState(destinationId, favorite, destination = null) {
  if (favorite) {
    destinationFavorites = [...new Set([...destinationFavorites, destinationId])];
  } else {
    destinationFavorites = destinationFavorites.filter((item) => item !== destinationId);
  }
  syncDestinationFavorites();
  if (destinationsPageState?.destinations) {
    destinationsPageState = {
      ...destinationsPageState,
      destinations: destinationsPageState.destinations.map((item) => String(item.id) === destinationId ? { ...item, favorite } : item),
      summary: {
        ...(destinationsPageState.summary || {}),
        favorites: destinationFavorites.length,
      },
    };
  }
  if (destinationDetailState?.destination?.id === destinationId) {
    destinationDetailState = {
      ...destinationDetailState,
      destination: { ...destinationDetailState.destination, ...(destination || {}), favorite },
    };
  }
}

async function toggleDestinationFavoriteFromApi(button, actionName) {
  const destinationId = button?.dataset?.destinationId || selectedDestinationKey;
  const detail = normalizeDestinationDetailData(destinationFromPageState(destinationId) || activeDestinationDetail(), destinationId);
  const wasFavorited = isDestinationFavorited(destinationId);
  const nextFavorite = !wasFavorited;
  button.disabled = true;
  try {
    const result = await userApi(`/api/user/destinations/${encodeURIComponent(destinationId)}/favorite`, {
      method: "POST",
      body: { favorite: nextFavorite, source: currentId() || "destinations" },
    });
    const favorite = Boolean(result.destination?.favorite ?? result.favorite ?? nextFavorite);
    syncDestinationFavoriteState(destinationId, favorite, result.destination);
    updateDestinationFavoriteControls(favorite);
    const scope = document.querySelector(".ref-destination-title") || button.closest(".destination-card") || button;
    const text = favorite
      ? `${/关注/.test(actionName) ? "已关注" : "已收藏"}${result.destination?.title || detail.title}`
      : `已取消收藏${result.destination?.title || detail.title}`;
    writeActionStatus(scope, text);
    showToast(favorite ? (/关注/.test(actionName) ? "已关注" : "已收藏") : "已取消收藏");
    if (currentId() === "destinations") render();
  } catch (error) {
    writeActionStatus(button, `收藏同步失败：${error.message}`);
    showToast("收藏同步失败");
  } finally {
    button.disabled = false;
  }
}

async function submitDestinationConsult(button, source = "destination-detail") {
  const destinationId = button?.dataset?.destinationId || selectedDestinationKey;
  const detail = normalizeDestinationDetailData(destinationFromPageState(destinationId) || activeDestinationDetail(), destinationId);
  button.disabled = true;
  try {
    const result = await userApi(`/api/user/destinations/${encodeURIComponent(destinationId)}/consult`, {
      method: "POST",
      body: {
        question: `想了解${detail.title}的旅居方案、周边医疗和入住安排`,
        source,
      },
    });
    const scope = document.querySelector(".ref-destination-title") || button.closest(".destination-card") || button;
    writeActionStatus(scope, `目的地咨询 ${result.request?.requestNo || ""} 已提交，后台将继续跟进`);
    showToast("目的地咨询已提交");
  } catch (error) {
    writeActionStatus(button, `咨询提交失败：${error.message}`);
    showToast("咨询提交失败");
  } finally {
    button.disabled = false;
  }
}

async function toggleDestinationFavorite(button, actionName) {
  await toggleDestinationFavoriteFromApi(button, actionName);
}

async function handleDestinationDetailAction(button, actionName) {
  if (currentId() !== "destination-detail") return false;
  if (actionName === "分享目的地") {
    await shareDestinationDetail(button);
    return true;
  }
  if (actionName === "复制目的地分享链接") {
    await copyDestinationShareLink(button);
    return true;
  }
  if (actionName === "关闭目的地分享") {
    document.querySelector("[data-destination-share-panel]")?.remove();
    showToast("分享面板已关闭");
    return true;
  }
  if (actionName === "导航到目的地") {
    await openDestinationDetailNavigation(button);
    return true;
  }
  if (/^(收藏目的地|加入收藏|关注目的地)$/.test(actionName)) {
    await toggleDestinationFavorite(button, actionName);
    return true;
  }
  if (actionName === "咨询目的地") {
    await submitDestinationConsult(button, "destination-detail");
    return true;
  }
  return false;
}

function renderAssistant() {
  return `
    <div class="ref-hero-img ref-assistant-hero">
      <img src="${asset("assistant-bg-clean.jpg")}" alt="智能管家小云" />
    </div>
    <section class="card suggestions ref-suggestions">
      <div class="section-head"><h2>您可以这样问我</h2><button data-action="换一批" type="button">换一批 ${icon("refresh-cw", 15)}</button></div>
      <div class="suggestion-grid">
        ${assistantSuggestionGrid()}
      </div>
    </section>
    <div class="chat ref-chat">
      <div class="bubble user">
        <div class="bubble-text">${assistantCurrentQuestion}</div>
        <img class="avatar-round" src="${asset("avatar-user.jpg")}" alt="用户头像" />
      </div>
      <div class="bubble">
        <img class="avatar-round" src="${asset("assistant-robot.jpg")}" alt="小云头像" />
        <div class="bubble-text ref-assistant-answer">
          ${assistantAnswerHtml()}
          <footer>
            ${renderAssistantFooter()}
          </footer>
        </div>
      </div>
    </div>
    <div class="chips ref-chip-scroll">
      ${[
        ["推荐景点", "map-pin", "destinations"],
        ["旅居住宿推荐", "building-2", "destinations"],
        ["活动推荐", "star", "activity-calendar"],
        ["交通指南", "bus", "transport"],
        ["智能设备", "watch", "devices"],
        ["小云机器人", "bot", "robot"],
      ].map(([c, iconName, route]) => `<button class="chip" data-route="${route}" type="button">${icon(iconName, 15)}${c}</button>`).join("")}
    </div>
    ${renderAssistantInputBar()}
  `;
}

function renderDevices() {
  return `
    <div class="ref-audit-alias-row"><button data-action="位置守护" type="button">位置守护</button></div>
    <div class="ref-hero-img ref-device-hero"><img src="${asset("device-hero.jpg")}" alt="智能互联 全心守护" /></div>
    <section class="section device-pair ref-device-pair">
      <div class="card device-card">
        <div class="section-head"><h2>智能手环</h2><span class="tag">已连接</span></div>
        <p class="meta ref-device-meta"><span>设备名称：云旅手环 1A2B</span><span>电量：78% <i class="ref-battery"><b style="width:78%"></b></i></span></p>
        <div class="ref-device-card-body">
          <img class="ref-device-product" src="${asset("device-band-clean.png")}" alt="智能手环" />
          <div class="feature-list">
            ${deviceFeature("heart-pulse", "健康监测", "实时守护身体健康", "red")}
            ${deviceFeature("map-pin", "精准定位", "安全位置实时查看", "green")}
            ${deviceFeature("siren", "紧急求助", "一键呼救快速响应", "orange")}
            ${deviceFeature("footprints", "运动计步", "记录每日运动数据", "blue")}
          </div>
        </div>
        <button class="ref-device-settings-row" data-route="band-settings" type="button">${icon("settings", 14)}<span>手环设置</span>${icon("chevron-right", 16)}</button>
      </div>
      <div class="card device-card">
        <div class="section-head"><h2>智能机器人小云</h2><span class="tag">已连接</span></div>
        <p class="meta ref-device-meta"><span>设备名称：小云机器人 3F8C</span><span>电量：65% <i class="ref-battery"><b style="width:65%"></b></i></span></p>
        <div class="ref-device-card-body">
          <img class="ref-device-product" src="${asset("device-robot-clean.png")}" alt="智能机器人小云" />
          <div class="feature-list">
            ${deviceFeature("message-circle", "语音陪伴", "聊天互动 贴心陪伴", "blue")}
            ${deviceFeature("calendar-days", "活动提醒", "日程提醒 生活通知", "cyan")}
            ${deviceFeature("volume-2", "信息播报", "新闻天气 语音播报", "orange")}
            ${deviceFeature("video", "视频通话", "一键呼叫 家人通话", "blue")}
          </div>
        </div>
        <button class="ref-device-settings-row" data-route="robot-settings" type="button">${icon("settings", 14)}<span>机器人设置</span>${icon("chevron-right", 16)}</button>
      </div>
    </section>
    ${section("设备联动", `
      <div class="card ref-linkage">
        <div><img src="${asset("device-band-clean.png")}" alt="智能手环"><strong>智能手环</strong></div>
        <span>健康 / 位置数据<br>同步上传</span>
        <div class="ref-logo-dot">云旅无忧</div>
        <span>指令 / 提醒下发<br>语音互动反馈</span>
        <div><img src="${asset("device-robot-clean.png")}" alt="智能机器人"><strong>智能机器人</strong></div>
      </div>
    `)}
    ${section("联动功能推荐", `
      <div class="ref-feature-cards">
        ${[
          ["map-pin", "位置守护", "手环位置异常时，机器人主动询问并联系紧急联系人", "green"],
          ["heart-pulse", "健康提醒", "手环检测到异常数据时，机器人语音提醒您注意健康", "blue"],
          ["calendar-days", "日程提醒", "重要行程和活动，机器人语音提醒，手环震动提示", "purple"],
          ["phone-call", "紧急联动", "手环触发 SOS 后，机器人自动拨打电话并通知家人", "orange"],
        ].map(([iconName, title, text, color]) => `<button class="ref-feature-card ${color}" data-action="${title}" type="button"><span>${icon(iconName, 26)}</span><strong>${title}</strong><p>${text}</p><em>去开启</em></button>`).join("")}
      </div>
    `)}
    <div class="info-banner ref-robot-banner"><img src="${asset("assistant-robot.jpg")}" alt="机器人" style="height:70px"><div><strong>小云随时在您身边</strong><span class="meta">有问题叫我就好，我会一直陪伴您。</span></div><button class="btn blue" data-route="assistant">和小云聊天</button></div>
  `;
}

function deviceFeature(iconName, title, text, color) {
  return `<span class="feature"><em class="${color}">${icon(iconName, 12)}</em><b>${title}</b><small>${text}</small></span>`;
}

function renderRobot() {
  return `
    <div class="ref-hero-img ref-robot-main-hero">
      <img src="${asset("robot-hero.jpg")}" alt="智能陪伴 全心守护" />
      <button class="hero-hotspot voice" data-action="语音对话" type="button" aria-label="语音对话"></button>
      <button class="hero-hotspot calendar" data-route="activity-calendar" type="button" aria-label="活动提醒"></button>
      <button class="hero-hotspot health" data-route="health-record" type="button" aria-label="健康守护"></button>
      <button class="hero-hotspot video" data-action="视频通话" type="button" aria-label="视频通话"></button>
    </div>
    <section class="card ref-robot-status">
      <div class="section-head"><h2>守护中</h2><button class="btn blue" data-action="测试设备" type="button">测试设备</button></div>
      <p class="meta">7×24小时不间断守护，实时关注您的安全与健康</p>
      <div class="ref-status-grid">
        ${[
          ["battery-medium", "设备电量", "65%", "green"],
          ["wifi", "网络状态", "良好", "blue"],
          ["volume-2", "语音音量", "适中", "purple"],
          ["shield-check", "设备状态", "正常运行", "green"],
        ].map(([iconName, title, value, color]) => `<div><span class="tile-icon ${color}">${icon(iconName, 22)}</span><small>${title}</small><strong>${value}</strong></div>`).join("")}
      </div>
    </section>
    ${section("智能守护功能", `
      <div class="ref-guard-grid">
        ${[
          ["activity", "摔倒检测", "识别摔倒行为，立即告警并通知紧急联系人", "重点守护", "red"],
          ["siren", "异常检测", "检测长时间静止、异常活动等情况", "重点守护", "orange"],
          ["home", "离家/长时间未动提醒", "长时间未检测到活动，及时提醒家人", "功能已开启", "blue"],
          ["heart-pulse", "生命体征检测", "结合智能手环数据，监测心率、血氧等", "去绑定手环", "purple"],
          ["pill", "用药提醒", "定时提醒服药，记录服药情况", "去设置", "green"],
          ["siren", "SOS 紧急呼叫", "遇到紧急情况，一键呼叫家人/求助", "立即体验", "cyan"],
        ].map(([iconName, title, text, action, color]) => `<button class="ref-guard-card ${color}" data-action="${title}" type="button"><div><strong>${title}</strong><span>${action}</span></div><p>${text}</p>${icon(iconName, 30)}</button>`).join("")}
      </div>
    `)}
    <div class="ref-split">
      <section class="card">
        <h2>家人通话</h2>
        <p class="meta">与家人随时联系，视频/语音更安心</p>
        <div class="ref-avatar-line">
          ${["女儿", "儿子", "老伴"].map((name, i) => `<div><img src="${asset(i === 0 ? "avatar-daughter.jpg" : "avatar-user.jpg")}" alt="${name}"><strong>${name}</strong><span>在线</span></div>`).join("")}
          <button data-action="添加家人" type="button">${icon("plus", 24)}</button>
        </div>
        <div class="ref-two-actions"><button data-action="语音通话" type="button">${icon("phone", 16)}语音通话</button><button data-action="视频通话" type="button">${icon("video", 16)}视频通话</button></div>
      </section>
      <section class="card">
        <h2>寻求他人帮助</h2>
        <p class="meta">联系附近的人或服务，快速获得帮助</p>
        <div class="ref-help-list">
          ${[
            ["user-round", "附近求助", "呼叫附近人", "action"],
            ["briefcase-medical", "联系社区", "社区工作人员", "action"],
            ["headphones", "人工向导", "一对一服务", "route"],
          ].map(([iconName, title, text, mode]) => `<button ${mode === "route" ? `data-route="guide"` : `data-action="${title}"`} type="button"><span class="tile-icon blue">${icon(iconName, 20)}</span><strong>${title}</strong><small>${text}</small></button>`).join("")}
        </div>
        <button class="btn red block" data-action="SOS 一键求助" type="button">SOS 一键求助</button>
      </section>
    </div>
    ${section("今日健康概览", `
      <div class="ref-health-strip">
        ${[
          ["heart-pulse", "心率", "72 次/分", "正常", "red"],
          ["stethoscope", "血压", "128/78", "正常", "orange"],
          ["droplets", "血氧", "97%", "正常", "blue"],
          ["moon", "睡眠", "7时30分", "良好", "purple"],
          ["footprints", "步数", "6850步", "目标 8000步", "green"],
        ].map(([iconName, title, value, note, color]) => `<div><span class="${color}">${icon(iconName, 18)}</span><small>${title}</small><strong>${value}</strong><em>${note}</em></div>`).join("")}
      </div>
    `)}
  `;
}

function renderGuide() {
  const guideCards = guideServiceCatalog();
  const profile = userGuidePageState?.profile || {};
  const guides = userGuidePageState?.recommendedGuides || [];
  const guarantees = userGuidePageState?.guarantees || [];
  const support = userGuidePageState?.support || {};
  const city = profile.currentCity || (currentCity && currentCity !== "定位中" ? currentCity : "加载中");
  const supportPhone = String(support.phone || "").replace(/[^\d+]/g, "");

  return `
    <div class="ref-hero-img ref-guide-hero"><img src="${asset("guide-hero.jpg")}" alt="专人服务 贴心陪伴" /></div>
    ${guideOrderForm("guide")}
    ${section("您希望人工向导为您做什么？", guideCards.length ? `
      <div class="destination-grid ref-guide-grid">
        ${guideCards.map(({ img, title, desc, badge, color, fields, amount }) => `
          <article class="guide-card ref-guide-card" data-route="order-submit" data-guide-service="${attr(title)}" data-guide-amount="${amount}" data-api-endpoint="/api/user/guide-page">
            ${img ? `<img src="${asset(img)}" alt="${title}" />` : `<div class="ref-more-service">${icon("grid-2x2", 42)}</div>`}
            <div class="body">
              ${badge ? `<span class="tag ${color}">${badge}</span>` : ""}
              <h3>${title}</h3>
              <p class="meta">${desc}</p>
              <p class="ref-guide-fields">${fields}</p>
              <button class="round-go ${color}" type="button" data-route="order-submit" data-guide-service="${attr(title)}" data-guide-amount="${amount}">${icon("chevron-right", 15)}</button>
            </div>
          </article>
        `).join("")}
      </div>
    ` : `<p class="empty">${userGuidePageLoading ? "正在加载向导服务" : "暂无可预约的人工向导服务"}</p>`, `<button class="ref-guide-city" data-route="city" type="button">当前城市：${attr(city)} ${icon("chevron-down", 12)}</button>`)}
    <div class="ref-guarantee-row">
    ${quickRow(guarantees.map((item) => ({ title: item.title, desc: item.description, icon: item.icon, color: item.color })), true)}
    </div>
    ${section("为您推荐向导", `
      <div class="ref-guide-recommend" data-api-endpoint="/api/user/guide-page">
        ${guides.length ? guides.slice(0, 3).map(guideRow).join("") : `<p class="empty">${userGuidePageLoading ? "正在加载可用向导" : "当前城市暂无已认证在线向导"}</p>`}
      </div>
    `, guides.length ? `<span class="meta">${guides.length} 位已认证向导</span>` : `<button data-route="guide-detail" type="button">查看向导详情 ${icon("chevron-right", 16)}</button>`)}
    ${supportPhone ? `<a class="ref-guide-phone" href="tel:${attr(supportPhone)}" aria-label="拨打人工向导客服电话">${icon("headphones", 14)}拨打客服 ${attr(support.phone)} · ${attr(support.serviceTime)}</a>` : ""}
  `;
}

function guideServiceCatalog() {
  const presentation = {
    陪伴就医: { img: "guide-medical.jpg", color: "green" },
    导游游览: { img: "guide-tour.jpg", color: "orange" },
    护工护理: { img: "guide-care.jpg", color: "purple" },
    接送出行: { img: "guide-tour.jpg", color: "blue" },
    帮办代办: { img: "guide-medical.jpg", color: "green" },
    生活陪伴: { img: "guide-care.jpg", color: "red" },
  };
  return (userGuidePageState?.categories || []).map((item) => ({
    img: presentation[item.title]?.img || "guide-medical.jpg",
    title: item.title,
    desc: item.description,
    badge: item.priority === "P0" ? "热门" : "",
    color: presentation[item.title]?.color || "blue",
    fields: item.fieldText || (item.fields || []).join("、"),
    amount: Number(item.amount || 0),
    unit: item.unit || "次",
    serviceId: item.serviceId || "",
  }));
}

function selectedGuideService() {
  const saved = localStorage.getItem("yunlv-guide-service") || "";
  return guideServiceCatalog().find((item) => item.title === saved) || guideServiceCatalog()[0] || {
    title: "服务加载中",
    desc: "正在加载人工向导服务数据",
    amount: 0,
    unit: "次",
  };
}

function guideServiceOptions(selectedTitle) {
  return guideServiceCatalog().map((item) => `<option value="${attr(item.title)}" data-amount="${item.amount}" ${item.title === selectedTitle ? "selected" : ""}>${item.title}</option>`).join("");
}

function dateTimeLocalValue(hoursAhead = 4) {
  const date = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);
  date.setMinutes(Math.ceil(date.getMinutes() / 10) * 10, 0, 0);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function guideDynamicFieldsHtml(serviceTitle, profile = userGuidePageState?.profile || {}) {
  if (serviceTitle === "导游游览") {
    return `<label><span>服务人数</span><input name="peopleCount" type="number" min="1" max="20" value="1" required></label>`;
  }
  if (serviceTitle === "护工护理") {
    return `<label><span>护理时长</span><input name="duration" value="2小时" required></label>`;
  }
  if (serviceTitle === "接送出行") {
    return `
      <label><span>出发地点</span><input name="startPoint" value="${attr(profile.location || "")}" required></label>
      <label><span>乘车人数</span><input name="peopleCount" type="number" min="1" max="20" value="1" required></label>
    `;
  }
  if (serviceTitle === "帮办代办") {
    return `<label class="wide"><span>携带材料</span><input name="materials" placeholder="请填写需携带或提交的材料" required></label>`;
  }
  if (serviceTitle === "生活陪伴") {
    return `<label><span>服务时长</span><input name="duration" value="2小时" required></label>`;
  }
  return "";
}

function guideOrderForm(source = "guide") {
  const selected = selectedGuideService();
  const profile = userGuidePageState?.profile || {};
  const city = profile.currentCity || (currentCity && currentCity !== "定位中" ? currentCity : "");
  const location = profile.location || city;
  const healthNote = profile.healthNote || "";
  const ready = Boolean(userGuidePageState && guideServiceCatalog().length);
  return `
    <section class="card ref-guide-order-form-card" data-api-endpoint="/api/user/guide-page">
      <div class="section-head">
        <h2>人工向导预约</h2>
        <button type="button" data-action="同步首页定位">${icon("map-pin", 14)}使用首页定位</button>
      </div>
      <form class="ref-guide-order-form" data-guide-order-form data-guide-form-source="${source}">
        <label><span>服务对象</span><input name="elderName" value="${attr(profile.elderName || "")}" autocomplete="name" required></label>
        <label><span>性别</span><select name="gender"><option ${profile.gender === "女" ? "selected" : ""}>女</option><option ${profile.gender === "男" ? "selected" : ""}>男</option></select></label>
        <label><span>年龄</span><input name="age" inputmode="numeric" value="${attr(profile.age || "")}" required></label>
        <label><span>联系电话</span><input name="phone" inputmode="tel" value="${attr(profile.phone || "")}" required></label>
        <label><span>服务类型</span><select name="serviceType" data-guide-service-input>${guideServiceOptions(selected.title)}</select></label>
        <div class="ref-guide-dynamic-fields" data-guide-dynamic-fields>${guideDynamicFieldsHtml(selected.title, profile)}</div>
        <label class="wide ref-guide-time-field"><span>预约时间</span><input name="time" type="datetime-local" value="${dateTimeLocalValue(4)}" required></label>
        <label class="wide ref-guide-location-field"><span>服务地点</span><input name="location" value="${attr(location)}" required><small data-guide-location-sync>当前使用：首页定位 ${attr(location)}</small></label>
        <label class="wide"><span>具体需求</span><textarea name="note" rows="3">请协助老人完成${selected.title}服务，全程同步家属。</textarea></label>
        <label class="wide"><span>健康备注</span><input name="healthNote" value="${attr(healthNote)}"></label>
        <p class="ref-guide-order-estimate">预估费用：<b data-guide-estimate>¥${selected.amount}</b><small>/${attr(selected.unit || "次")}起，提交后进入后台待派单，向导端可接单。</small></p>
        <button class="primary ref-guide-submit" type="submit" ${ready ? "" : "disabled"}>${icon("clipboard-check", 18)}提交订单</button>
        ${actionStatusHtml(ready ? "请确认身份信息、地点和时间后提交。" : "正在加载用户档案和向导服务数据。")}
      </form>
    </section>
  `;
}

function guideFormTime(value) {
  return value ? String(value).replace("T", " ") : "";
}

function guideOrderFormPayload(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const option = form.querySelector('[name="serviceType"]')?.selectedOptions?.[0];
  const amount = Number(option?.dataset?.amount || localStorage.getItem("yunlv-guide-amount") || selectedGuideService().amount || 120);
  return {
    elderName: data.elderName || "",
    gender: data.gender || "",
    age: Number(data.age || 0),
    phone: data.phone || "",
    serviceType: data.serviceType || selectedGuideService().title,
    providerType: "guide",
    providerId: localStorage.getItem("yunlv-guide-id") || null,
    amount,
    time: guideFormTime(data.time),
    location: data.location || userGuidePageState?.profile?.location || "",
    note: `${data.note || ""}${data.healthNote ? `；健康备注：${data.healthNote}` : ""}`,
    healthNote: data.healthNote || "",
    hospital: data.location || "",
    destination: data.location || "",
    peopleCount: Number(data.peopleCount || 1),
    count: Number(data.peopleCount || 1),
    startPoint: data.startPoint || data.location || "",
    endPoint: data.location || "",
    duration: data.duration || "",
    careDuration: data.duration || "",
    materials: data.materials || "",
    agencyItem: data.note || "",
    careRequirement: data.note || "",
    requirementNote: data.note || "",
    transportNeed: data.note || "",
    strictRequirements: true,
    source: "用户端人工向导表单",
  };
}

function writeGuideOrderStatus(form, text, isError = false) {
  const status = form?.querySelector("[data-action-status]");
  if (status) {
    status.textContent = text;
    status.classList.toggle("error", isError);
  }
  showToast(text);
}

async function submitGuideOrderForm(form, triggerButton = null) {
  if (!form) return;
  const button = triggerButton || form.querySelector('button[type="submit"]');
  const submitSeq = Number(form.dataset.guideSubmitSeq || 0) + 1;
  form.dataset.guideSubmitSeq = String(submitSeq);
  form.dataset.guideSubmitState = "validating";
  if (button?.dataset) {
    button.dataset.guideSubmitSeq = String(submitSeq);
    button.dataset.guideSubmitState = "validating";
  }
  const payload = guideOrderFormPayload(form);
  if (!payload.elderName || !/^1\d{10}$/.test(payload.phone) || !Number.isInteger(payload.age) || payload.age < 1 || payload.age > 130 || !payload.location || !payload.time) {
    form.dataset.guideSubmitState = "invalid";
    if (button?.dataset) button.dataset.guideSubmitState = "invalid";
    writeGuideOrderStatus(form, "请填写服务对象、正确手机号、年龄、时间和服务地点", true);
    return;
  }
  if (new Date(payload.time.replace(" ", "T")).getTime() <= Date.now()) {
    form.dataset.guideSubmitState = "invalid";
    if (button?.dataset) button.dataset.guideSubmitState = "invalid";
    writeGuideOrderStatus(form, "预约时间必须晚于当前时间", true);
    return;
  }
  form.dataset.guideSubmitState = "submitting";
  if (button?.dataset) button.dataset.guideSubmitState = "submitting";
  writeGuideOrderStatus(form, "正在提交人工向导订单，请稍候");
  button?.setAttribute("disabled", "disabled");
  try {
    const request = window.YunlvBusiness?.request;
    if (!request) throw new Error("服务暂未初始化，请刷新后重试");
    const order = await request("/api/orders", { method: "POST", body: payload }, "elder");
    localStorage.setItem("yunlv-selected-order", order.id);
    localStorage.setItem("yunlv-guide-service", payload.serviceType);
    form.dataset.guideSubmitState = "submitted";
    form.dataset.guideOrderId = order.id || "";
    form.dataset.guideOrderNo = order.orderNo || "";
    if (button?.dataset) {
      button.dataset.guideSubmitState = "submitted";
      button.dataset.guideOrderId = order.id || "";
      button.dataset.guideOrderNo = order.orderNo || "";
      button.dataset.state = `订单 ${order.orderNo} 已提交`;
      button.classList.add("is-done");
    }
    writeGuideOrderStatus(form, `订单 ${order.orderNo} 已提交，后台待派单，向导端可接单。`);
    setRoute("order-detail");
  } catch (error) {
    form.dataset.guideSubmitState = "failed";
    if (button?.dataset) button.dataset.guideSubmitState = "failed";
    writeGuideOrderStatus(form, `订单提交失败：${error.message}`, true);
  } finally {
    button?.removeAttribute("disabled");
  }
}

async function syncGuideFormLocation(button) {
  const form = button.closest(".ref-guide-order-form-card")?.querySelector("[data-guide-order-form]") || document.querySelector("[data-guide-order-form]");
  const locationInput = form?.querySelector('[name="location"]');
  const syncInfo = form?.querySelector("[data-guide-location-sync]");
  const startedAt = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  button?.setAttribute("aria-busy", "true");
  if (button?.dataset) button.dataset.locationSync = startedAt;
  if (syncInfo) syncInfo.textContent = `正在同步：首页定位请求已发起 · ${startedAt}`;
  writeGuideOrderStatus(form, "正在调用浏览器定位，请允许位置权限");
  try {
    const result = await requestCurrentLocation(true);
    const city = result?.city || (currentCity && currentCity !== "定位中" ? currentCity : DEFAULT_CITY);
    const [lng, lat] = Array.isArray(result?.position) ? result.position : (Array.isArray(currentLocation) ? currentLocation : []);
    const pointText = Number.isFinite(lng) && Number.isFinite(lat) ? `（${lng.toFixed(5)}, ${lat.toFixed(5)}）` : "";
    const locationText = `${city}当前位置${pointText}`;
    if (locationInput) locationInput.value = locationText;
    if (button?.dataset) button.dataset.locationSync = locationText;
    if (syncInfo) syncInfo.textContent = `最近同步：${locationText} · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
    writeGuideOrderStatus(form, `已获取实时定位并写入服务地点：${locationText}`);
  } catch (error) {
    const city = currentCity && currentCity !== "定位中" ? currentCity : DEFAULT_CITY;
    const fallbackLocation = `${city}市五华区翠湖康养公寓`;
    if (locationInput) locationInput.value = fallbackLocation;
    if (button?.dataset) button.dataset.locationSync = fallbackLocation;
    if (syncInfo) syncInfo.textContent = `最近同步：首页定位 ${fallbackLocation} · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
    writeGuideOrderStatus(form, `定位失败：${error.message || "请检查浏览器定位权限"}`, true);
  } finally {
    button?.setAttribute("aria-busy", "false");
  }
}

function guideRow(guide) {
  const services = Array.isArray(guide.serviceTypes) ? guide.serviceTypes : [];
  const selectedService = services[0] || guideServiceCatalog()[0]?.title || "陪伴就医";
  const category = guideServiceCatalog().find((item) => item.title === selectedService) || guideServiceCatalog()[0] || {};
  const price = Number(guide.minimumPrice || category.amount || 0);
  const avatarSrc = userAssetSrc(guide.avatar, "avatar-user.jpg");
  return `
    <article class="guide-person-card" data-route="guide-detail" data-guide-id="${attr(guide.id)}" data-guide-service="${attr(selectedService)}" data-guide-amount="${price || Number(category.amount || 0)}" data-api-endpoint="/api/user/guide-page">
      <img src="${attr(avatarSrc)}" alt="${attr(guide.name)}">
      <div><b>${attr(guide.name)} <span class="tag">${icon("check-circle", 9)}${attr(guide.onlineStatus || guide.status)}</span></b><p>${attr(guide.area)} · ${Number(guide.distanceKm || 0).toFixed(1)}km</p><p>${icon("star", 10)} ${Number(guide.rating || 0).toFixed(1)}　${Number(guide.monthlyOrders || 0)}笔月订单</p>${services.slice(0, 2).map((item) => `<em>${attr(item)}</em>`).join("")}</div>
      <footer><strong>${price ? `¥${price}/${attr(guide.priceUnit || category.unit || "次")}起` : "价格待确认"}</strong><button class="btn" data-route="order-submit" data-guide-id="${attr(guide.id)}" data-guide-service="${attr(selectedService)}" data-guide-amount="${price || Number(category.amount || 0)}" type="button">去下单</button></footer>
    </article>
  `;
}

function selectedUserGuide() {
  const guides = userGuidePageState?.recommendedGuides || [];
  const guideId = localStorage.getItem("yunlv-guide-id") || "";
  return guides.find((item) => item.id === guideId) || guides[0] || null;
}

function renderGuideDetail() {
  const guide = selectedUserGuide();
  if (!guide) return `<p class="empty">${userGuidePageLoading ? "正在加载向导详情" : "向导资料暂不可用"}</p>`;
  const services = Array.isArray(guide.serviceTypes) ? guide.serviceTypes : [];
  const selectedService = services[0] || guideServiceCatalog()[0]?.title || "陪伴就医";
  const category = guideServiceCatalog().find((item) => item.title === selectedService) || guideServiceCatalog()[0] || {};
  const price = Number(guide.minimumPrice || category.amount || 0);
  const avatarSrc = userAssetSrc(guide.avatar, "avatar-user.jpg");
  const reviews = Array.isArray(guide.reviews) ? guide.reviews : [];
  return `
    <section class="card form-card ref-guide-detail-head" data-guide-id="${attr(guide.id)}" data-api-endpoint="/api/user/guide-page">
      <div class="profile-head" style="padding:0;grid-template-columns:88px 1fr">
        <img src="${attr(avatarSrc)}" alt="${attr(guide.name)}" style="width:88px;height:88px">
        <div><h2>${attr(guide.name)} <span class="tag">${attr(guide.onlineStatus)}</span></h2><p>${icon("star", 16)} ${Number(guide.rating || 0).toFixed(1)}分　|　${Number(guide.monthlyOrders || 0)}笔月订单　|　${Number(guide.distanceKm || 0).toFixed(1)}km</p><div class="tag-row"><span class="tag">实名认证</span><span class="tag blue">${attr(guide.status)}</span><span class="tag">${attr(guide.currentStatus)}</span></div></div>
      </div>
      <blockquote>${attr(guide.area)} · 可提供${attr(services.join("、") || "人工向导")}服务</blockquote>
      <div class="ref-service-title"><b>服务类别</b><button data-route="guide" type="button">更多服务 ${icon("chevron-right", 14)}</button></div>
      <div class="ref-service-tabs">${services.map((service, index) => {
        const item = guideServiceCatalog().find((entry) => entry.title === service) || category;
        return `<button class="${index === 0 ? "active" : ""}" data-route="order-submit" data-guide-id="${attr(guide.id)}" data-guide-service="${attr(service)}" data-guide-amount="${Number(item.amount || price)}" type="button">${icon(index % 2 ? "flag" : "briefcase-medical", 20)}${attr(service)}</button>`;
      }).join("")}</div>
    </section>
    ${section("服务数据", `
      <div class="card ref-data-three">
        <div>${icon("list-checks", 28)}<span>本月订单</span><b>${Number(guide.monthlyOrders || 0)}</b><small>本月累计</small></div>
        <div>${icon("star", 28)}<span>综合评分</span><b>${Number(guide.rating || 0).toFixed(1)}</b><small>${Number(guide.reviewCount || 0)} 条评价</small></div>
        <div>${icon("map-pin", 28)}<span>距离</span><b>${Number(guide.distanceKm || 0).toFixed(1)}km</b><small>${attr(guide.area)}</small></div>
      </div>
    `)}
    ${section("当前接单状态", `
      <div class="card ref-time-table"><div><span>实时状态</span><span class="ok">${attr(guide.onlineStatus)}</span><span>${attr(guide.currentStatus)}</span><span>${attr(guide.area)}</span></div></div>
    `)}
    ${section("用户评价", `
      <div class="card ref-review-list">
        ${reviews.length ? reviews.map((review) => `<div><img src="${asset("avatar-user.jpg")}" alt="${attr(review.userName)}"><p><b>${attr(review.userName)} <span class="tag">已完成订单</span></b><em>${"★".repeat(Math.max(1, Math.round(Number(review.rating || 0))))} ${Number(review.rating || 0).toFixed(1)}</em><span>${attr(review.content)}</span></p><small>${apiTime(review.createdAt)}</small></div>`).join("") : '<p class="empty">暂无订单评价</p>'}
      </div>
    `)}
    <section class="card ref-guide-price">
      <div><h2>服务价格</h2><p>价格来自上架服务与下单规范</p></div>
      <strong>${price ? `¥${price}` : "待确认"}<small>/${attr(guide.priceUnit || category.unit || "次")}起</small><span>最终费用以订单确认为准</span></strong>
      <div class="ref-bottom-action two">
        <button data-route="assistant" type="button">${icon("message-circle", 18)}咨询</button>
        <button data-action="收藏向导" type="button">${icon("heart", 18)}收藏向导</button>
        <button class="primary" data-route="order-submit" data-guide-id="${attr(guide.id)}" data-guide-service="${attr(selectedService)}" data-guide-amount="${price}" type="button">立即下单<small>已选择 ${attr(guide.name)}</small></button>
      </div>
    </section>
  `;
}

function guideDetailShareData() {
  const guide = selectedUserGuide() || {};
  return {
    title: `${guide.name || "人工向导"} - 云旅无忧`,
    text: `推荐云旅无忧认证向导${guide.name || ""}：${(guide.serviceTypes || []).join("、")}。`,
    url: `${window.location.origin}${window.location.pathname}#guide-detail`,
  };
}

function guideDetailShareText(shareData) {
  return `${shareData.title}\n${shareData.text}\n${shareData.url}`;
}

function openGuideSharePanel(button, shareData, statusText = "") {
  document.querySelector("[data-guide-share-panel]")?.remove();
  const anchor = document.querySelector(".ref-guide-detail-head") || button;
  const panel = ensureLivePanel("guide-share", anchor);
  const smsHref = `sms:?&body=${encodeURIComponent(guideDetailShareText(shareData))}`;
  renderLivePanel(panel, "分享向导", `
    <p>${attr(shareData.text)}</p>
    <label><span>分享链接</span><input readonly value="${attr(shareData.url)}"></label>
    <div class="ref-profile-help">
      <button data-action="复制向导分享链接" data-local-action="true" type="button">${icon("copy", 16)}复制链接</button>
      <a class="btn blue" href="${attr(smsHref)}">${icon("message-circle", 15)}短信发送</a>
    </div>
  `, statusText || "分享链接面板已展开");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function shareGuideDetail(button) {
  const shareData = guideDetailShareData();
  const scope = document.querySelector(".ref-guide-detail-head") || button;
  openGuideSharePanel(button, shareData, "分享菜单已展开，可复制链接或短信发送");
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      writeActionStatus(document.querySelector("[data-live-panel='guide-share']") || scope, "已调起系统分享，可发送向导名片");
      showToast("系统分享面板已唤起");
      return;
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(guideDetailShareText(shareData));
      openGuideSharePanel(button, shareData, "链接已复制，也可以通过短信发送");
      showToast("分享链接已复制");
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      writeActionStatus(scope, "已取消分享，向导信息仍保留在当前页面");
      return;
    }
  }
  openGuideSharePanel(button, shareData, "当前浏览器未开放系统分享，请复制链接或短信发送");
  showToast("分享链接面板已展开");
}

function toggleGuideFavorite(button) {
  const guide = selectedUserGuide() || {};
  const active = button.getAttribute("aria-pressed") !== "true";
  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", active ? "true" : "false");
  button.innerHTML = `${icon("heart", 18)}${active ? "已收藏" : "收藏向导"}`;
  writeActionStatus(document.querySelector(".ref-guide-detail-head") || button, active ? `${guide.name || "该向导"}已收藏，可在我的收藏中查看` : `已取消收藏${guide.name || "该向导"}`);
  showToast(active ? "已收藏向导" : "已取消收藏");
  window.YunlvBusiness?.request?.("/api/ui/actions", {
    method: "POST",
    body: { role: "user", route: "guide-detail", action: active ? "收藏向导" : "取消收藏向导", payload: { guideId: guide.id || "", guideName: guide.name || "" } },
  }, "elder").catch(() => {});
}

async function handleGuideDetailAction(button, actionName) {
  if (currentId() !== "guide-detail") return false;
  if (actionName === "分享向导") {
    await shareGuideDetail(button);
    return true;
  }
  if (actionName === "复制向导分享链接") {
    const shareData = guideDetailShareData();
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(guideDetailShareText(shareData));
      writeActionStatus(document.querySelector("[data-live-panel='guide-share']") || button, "向导分享链接已复制");
      showToast("分享链接已复制");
    } catch (error) {
      openGuideSharePanel(button, shareData, "请长按链接复制或使用短信发送");
    }
    return true;
  }
  if (actionName === "收藏向导") {
    toggleGuideFavorite(button);
    return true;
  }
  return false;
}

function renderOrderSubmit() {
  const selected = selectedGuideService();
  const selectedGuideId = localStorage.getItem("yunlv-guide-id") || "";
  const selectedGuide = (userGuidePageState?.recommendedGuides || []).find((item) => item.id === selectedGuideId);
  const selectedGuideAvatar = selectedGuide ? userAssetSrc(selectedGuide.avatar, "avatar-user.jpg") : "";
  return `
    <section class="card ref-order-submit-head" data-api-endpoint="/api/user/guide-page">
      <span class="tile-icon green">${icon("briefcase-medical", 30)}</span>
      <div><h2>${selected.title} <span class="tag">人工向导</span><span class="tag blue">可下单</span></h2><p>${selected.desc}</p><div class="tag-row"><span>${icon("check-circle", 15)}身份可编辑</span><span>${icon("check-circle", 15)}地点可修改</span><span>${icon("check-circle", 15)}后台可派单</span></div></div>
      <strong>¥${selected.amount}<small>/${attr(selected.unit || "次")}起</small></strong>
    </section>
    ${guideOrderForm("order-submit")}
    ${section("推荐向导", `
      ${selectedGuide ? `<div class="card ref-recommend-guide" data-guide-id="${attr(selectedGuide.id)}"><img src="${attr(selectedGuideAvatar)}" alt="${attr(selectedGuide.name)}"><div><h2>${attr(selectedGuide.name)} <span class="tag">${attr(selectedGuide.onlineStatus)}</span></h2><p>${icon("star", 15)} ${Number(selectedGuide.rating || 0).toFixed(1)}分　|　${Number(selectedGuide.monthlyOrders || 0)}笔月订单</p><div class="tag-row">${(selectedGuide.serviceTypes || []).slice(0, 3).map((item) => `<span class="tag">${attr(item)}</span>`).join("")}</div></div><button class="btn ghost" data-route="guide" type="button">更换向导</button></div>` : `<div class="card ref-recommend-guide"><span class="tile-icon blue">${icon("users", 24)}</span><div><h2>后台智能派单</h2><p>提交后按服务类型、距离与在线状态匹配已认证向导</p></div><button class="btn ghost" data-route="guide" type="button">选择向导</button></div>`}
    `)}
    ${section("费用明细（预估）", `
      <div class="card ref-fee-card">${field("服务费", `¥${selected.amount} 起`)}${field("交通费", "根据实际行程收取　¥0")}${field("平台服务费", "免费　¥0")}<div><b>预计总费用</b><strong>¥${selected.amount}</strong></div></div>
    `)}
    <div class="ref-submit-bar"><div><span>预计</span><strong>¥${selected.amount}</strong><small>费用明细</small></div><button data-action="提交人工向导订单" type="button">提交订单</button></div>
  `;
}

function field(label, value) {
  return `<div class="field"><span class="field-label">${label}</span><span>${value}</span></div>`;
}

function renderOrders() {
  const filters = ordersPageState?.filters?.statuses || ["全部", "待接单", "服务中", "待确认", "已完成", "已取消"];
  const providers = ordersPageState?.filters?.providers || [
    { value: "merchant", label: "商户服务" },
    { value: "guide", label: "人工向导" },
  ];
  return `
    <div class="chips ref-order-tabs" data-order-tabs>${filters.map((c) => `<button class="chip ${c === orderActiveFilter ? "active" : ""}" data-order-filter="${attr(c)}" data-action="筛选订单：${attr(c)}" type="button" aria-pressed="${c === orderActiveFilter ? "true" : "false"}">${c}${ordersPageState?.filters?.counts?.[c] !== undefined ? `<small>${ordersPageState.filters.counts[c]}</small>` : ""}</button>`).join("")}</div>
    <div class="ref-order-search"><label>${icon("search", 20)}<input data-order-search type="search" value="${attr(orderSearchQuery)}" placeholder="搜索订单、服务或订单号" aria-label="搜索订单、服务或订单号"></label><button data-action="筛选" type="button" aria-expanded="false">${icon("filter", 18)}筛选</button></div>
    <section class="ref-order-advanced-filter" data-order-advanced-filter hidden aria-label="订单服务类型筛选">
      <strong>服务类型</strong>
      <div class="chips">
        <button class="chip ${orderProviderFilter === "" ? "active" : ""}" data-action="订单类型：全部" type="button">全部类型</button>
        ${providers.map((provider) => `<button class="chip ${orderProviderFilter === provider.value ? "active" : ""}" data-action="订单类型：${attr(provider.value)}" type="button">${provider.label}</button>`).join("")}
      </div>
      <button class="ref-order-filter-reset" data-action="重置订单筛选" type="button">重置搜索和筛选</button>
    </section>
    <p class="action-status ref-order-filter-status" data-order-filter-status>${orderFilterText(orderActiveFilter, 0)}</p>
    <div class="list ref-order-list">
      <p class="empty">正在加载订单数据...</p>
      <div class="ref-empty-actions">
        <button data-route="order-detail" type="button">订单详情</button>
        <button data-route="review" type="button">服务评价</button>
      </div>
    </div>
  `;
}

function orderRow(order) {
  const normalizedStatus = normalizeOrderStatus(order.status);
  const statusText = attr(`${order.status || ""} ${order.title || ""} ${order.type || ""} ${(order.lines || []).join(" ")}`);
  return `
    <article class="ref-order-card" data-order-item data-order-id="${attr(order.id)}" data-order-status="${attr(order.status)}" data-order-normalized-status="${attr(normalizedStatus)}" data-order-filter-text="${statusText}" data-action="查看订单详情">
      <header><span>订单号：${order.no}</span><time>${order.date}</time><em class="${order.statusClass}">${order.status}</em></header>
      <div class="ref-order-main">
        <span class="tile-icon ${order.iconClass}">${icon(order.iconName, 25)}</span>
        <div class="ref-order-body">
          <h3>${order.title} <span class="tag ${order.type === "活动报名" ? "purple" : ""}">${order.type}</span></h3>
          ${order.lines.map((line) => `<p>${line.includes("已认证") ? `${line.replace(" 已认证", "")} <span class="verified">${icon("badge-check", 13)}已认证</span>` : line}</p>`).join("")}
          ${order.rating ? `<p class="ref-order-rating">${order.rating}</p>` : ""}
        </div>
        <aside><strong>${order.amount}</strong><small>${order.count}</small></aside>
      </div>
      <footer>${order.actions.map((action) => `<button class="btn ${action.primary ? "blue" : "ghost"}" data-order-id="${attr(order.id)}" ${action.route ? `data-route="${action.route}"` : `data-action="${action.action}"`} type="button">${action.text}</button>`).join("")}</footer>
    </article>
  `;
}

function orderMatchesFilter(filter, card) {
  if (!card) return false;
  if (filter === "全部") return true;
  const normalizedStatus = card.dataset.orderNormalizedStatus || normalizeOrderStatus(card.dataset.orderStatus || "");
  return normalizedStatus === filter;
}

function orderFilterText(filter, count) {
  return filter === "全部" ? `已显示全部订单 ${count} 条` : `已筛选${filter}订单 ${count} 条`;
}

function filterOrders(filter = "全部", silent = false) {
  orderActiveFilter = filter || "全部";
  const cards = [...document.querySelectorAll("[data-order-item]")];
  let visibleCount = 0;
  cards.forEach((card) => {
    const matched = orderMatchesFilter(orderActiveFilter, card);
    card.hidden = !matched;
    card.classList.toggle("is-filtered-out", !matched);
    if (matched) visibleCount += 1;
  });
  document.querySelectorAll("[data-order-filter]").forEach((tab) => {
    const active = tab.dataset.orderFilter === orderActiveFilter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const status = document.querySelector("[data-order-filter-status]");
  if (status) status.textContent = orderFilterText(orderActiveFilter, visibleCount);
  const list = document.querySelector(".ref-order-list");
  let empty = document.querySelector("[data-order-empty]");
  if (!empty && list) {
    empty = document.createElement("p");
    empty.className = "empty ref-order-empty";
    empty.dataset.orderEmpty = "true";
    empty.textContent = "暂无匹配的订单。";
    list.appendChild(empty);
  }
  if (empty) empty.hidden = visibleCount > 0;
  if (!silent && status) status.classList.add("is-fresh");
  if (!silent && status) window.setTimeout(() => status.classList.remove("is-fresh"), 700);
}

function focusOrderFilters(button) {
  const panel = document.querySelector("[data-order-advanced-filter]");
  if (!panel) return;
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  button?.setAttribute("aria-expanded", willOpen ? "true" : "false");
  if (willOpen) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

const apiHydratedRoutes = new Map();
const DEFAULT_REMOTE_API_BASE = "https://yunlv-wuyou-mvp.onrender.com";
let directUserApiSession = null;

function directUserApiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const storage = directUserApiStorage();
  const explicit = window.YUNLV_API_BASE || storage?.getItem?.("YUNLV_API_BASE") || "";
  const base = explicit || (window.location.hostname.endsWith("github.io") ? DEFAULT_REMOTE_API_BASE : "");
  return base ? `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}` : path;
}

function directUserApiStorage() {
  try {
    return window.localStorage || null;
  } catch (error) {
    return null;
  }
}

function directUserApiHttp(path, init = {}) {
  const url = directUserApiUrl(path);
  document.documentElement.dataset.yunlvDirectApiLastPath = path;
  if (typeof XMLHttpRequest === "function") {
    document.documentElement.dataset.yunlvDirectApiTransport = "xhr";
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(init.method || "GET", url, true);
      xhr.timeout = 10000;
      Object.entries(init.headers || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null) xhr.setRequestHeader(key, value);
      });
      xhr.onload = () => {
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          json: async () => JSON.parse(xhr.responseText || "{}"),
        });
      };
      xhr.onerror = () => reject(new Error("网络异常，请稍后重试"));
      xhr.ontimeout = () => reject(new Error("请求超时，请稍后重试"));
      xhr.send(init.body === undefined ? null : init.body);
    });
  }
  document.documentElement.dataset.yunlvDirectApiTransport = "fetch";
  if (typeof fetch === "function") return fetch(url, init);
  return Promise.reject(new Error("当前浏览器不支持该请求"));
}

async function directUserApiAuth(role = "elder", force = false) {
  document.documentElement.dataset.yunlvDirectApiAuth = force ? "refreshing" : "starting";
  const storage = directUserApiStorage();
  if (!force && directUserApiSession?.role === role && directUserApiSession?.token) {
    document.documentElement.dataset.yunlvDirectApiAuth = "ok";
    return directUserApiSession;
  }
  if (!force && storage) {
    try {
      const cached = JSON.parse(storage.getItem(`yunlv-direct-api-session-${role}`) || "{}");
      if (cached?.token) {
        directUserApiSession = cached;
        document.documentElement.dataset.yunlvDirectApiAuth = "ok";
        return cached;
      }
    } catch (error) {}
  }
  const response = await directUserApiHttp("/api/auth/login", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.error?.message || "登录失败，请稍后重试");
  directUserApiSession = { ...payload.data, role };
  if (storage) storage.setItem(`yunlv-direct-api-session-${role}`, JSON.stringify(directUserApiSession));
  document.documentElement.dataset.yunlvDirectApiAuth = "ok";
  return directUserApiSession;
}

async function directUserApiRequest(path, options = {}, role = "elder") {
  const headers = { Accept: "application/json", "Content-Type": "application/json", ...(options.headers || {}) };
  if (options.auth !== false) {
    const session = await directUserApiAuth(role);
    headers.Authorization = `Bearer ${session.token}`;
  }
  const init = {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  };
  let response = await directUserApiHttp(path, init);
  if (response.status === 401 && options.auth !== false) {
    const session = await directUserApiAuth(role, true);
    headers.Authorization = `Bearer ${session.token}`;
    response = await directUserApiHttp(path, init);
  }
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.error?.message || "请求失败，请稍后重试");
  return payload.data;
}

function userApi(path, options = {}) {
  return directUserApiRequest(path, options, "elder");
}

function hydrateUserApiData(routeId) {
  const handlers = {
    home: hydrateHomeFromApi,
    profile: hydrateUserProfileFromApi,
    personal: hydrateUserProfileFromApi,
    guide: hydrateGuidePageFromApi,
    "order-submit": hydrateGuidePageFromApi,
    "guide-detail": hydrateGuidePageFromApi,
    orders: hydrateOrdersFromApi,
    "order-detail": hydrateOrderDetailFromApi,
    messages: hydrateMessagesFromApi,
    emergency: hydrateEmergencyFromApi,
    contacts: hydrateContactsFromApi,
    "sos-records": hydrateSosRecordsFromApi,
    "health-record": hydrateHealthFromApi,
    "health-services": hydrateHealthServicesFromApi,
    destinations: hydrateDestinationsFromApi,
    "destination-detail": hydrateDestinationDetailFromApi,
    family: hydrateFamilyFromApi,
    "community": hydrateCommunityFromApi,
    "checkin": hydrateCheckinFromApi,
    "food": hydrateFoodFromApi,
    "shop": hydrateShopFromApi,
    "volunteer": hydrateVolunteerFromApi,
    "transport": hydrateTransportFromApi,
    "device-management": hydrateDeviceManagementFromApi,
    "service-records": hydrateServiceRecordsFromApi,
    "activity-records": hydrateActivityRecordsFromApi,
    "activity-map": hydrateActivityMapFromApi,
    "activity-calendar": hydrateActivityCalendarFromApi,
    "activity-signup": hydrateActivitySignupFromApi,
  };
  const handler = handlers[routeId];
  if (!handler) return;
  window.clearTimeout(hydrateUserApiData.timer);
  hydrateUserApiData.timer = window.setTimeout(async () => {
    if (currentId() !== routeId) return;
    try {
      await handler(routeId);
      apiHydratedRoutes.set(routeId, Date.now());
      if (window.lucide) window.lucide.createIcons();
    } catch (error) {
      const last = apiHydratedRoutes.get(`${routeId}:error`) || 0;
      if (Date.now() - last > 3000) {
        apiHydratedRoutes.set(`${routeId}:error`, Date.now());
        writeApiStatus(`数据同步失败：${error.message}`);
      }
    }
  }, window.YunlvBusiness?.request ? 0 : 250);
}

async function hydrateGuidePageFromApi(routeId) {
  if (userGuidePageState || userGuidePageLoading) return;
  userGuidePageLoading = true;
  try {
    userGuidePageState = await userApi("/api/user/guide-page");
    const apiCity = userGuidePageState?.profile?.currentCity;
    if (apiCity) updateCurrentCity(apiCity);
    document.documentElement.dataset.yunlvUserGuideSource = userGuidePageState?.sourceEndpoint || "/api/user/guide-page";
    if (currentId() === routeId) render();
  } finally {
    userGuidePageLoading = false;
  }
}

async function hydrateCommunityFromApi(routeId = "community", options = {}) {
  const force = Boolean(options.force);
  if (!force && communityPageState && communityPageState?.query?.filter === activeCommunityFilter) {
    document.documentElement.dataset.yunlvCommunityHydration = "loaded";
    return;
  }
  if (communityPageLoading && !force) {
    document.documentElement.dataset.yunlvCommunityHydration = "loading";
    return;
  }
  const requestSeq = ++communityRequestSeq;
  communityPageLoading = true;
  const status = document.querySelector("[data-community-filter-status]");
  if (status && !options.silent) status.textContent = "正在加载社群数据...";
  const params = new URLSearchParams();
  if (activeCommunityFilter && activeCommunityFilter !== "推荐") params.set("filter", activeCommunityFilter);
  try {
    document.documentElement.dataset.yunlvCommunityHydration = "requesting";
    const page = await userApi(`/api/user/community${params.toString() ? `?${params}` : ""}`);
    if (requestSeq !== communityRequestSeq) return;
    communityPageState = page;
    if (page?.draft) {
      communityComposeDraft = { ...DEFAULT_COMMUNITY_COMPOSE_DRAFT, ...page.draft };
      localStorage.setItem(COMMUNITY_COMPOSE_STORAGE_KEY, JSON.stringify(communityComposeDraft));
    }
    document.documentElement.dataset.yunlvCommunitySource = page?.sourceEndpoint || "/api/user/community";
    document.documentElement.dataset.yunlvCommunityFilter = activeCommunityFilter;
    document.documentElement.dataset.yunlvCommunityHydration = "loaded";
    if (currentId() === routeId) render();
  } catch (error) {
    if (requestSeq !== communityRequestSeq) return;
    communityPageState = {
      sourceEndpoint: "/api/user/community",
      query: { filter: activeCommunityFilter },
      groups: [],
      posts: [],
      filters: COMMUNITY_FILTERS.map((key) => ({ key, count: 0 })),
      summary: { filtered: 0 },
      error: error.message,
    };
    document.documentElement.dataset.yunlvCommunityHydration = `error:${error.message}`;
    if (currentId() === routeId) render();
  } finally {
    if (requestSeq === communityRequestSeq) communityPageLoading = false;
  }
}

function scheduleCommunityHydration(options = {}) {
  if (currentId() !== "community") return;
  const force = Boolean(options.force);
  if (!force && communityPageState && communityPageState?.query?.filter === activeCommunityFilter) return;
  if (communityPageLoading && !force) return;
  document.documentElement.dataset.yunlvCommunityHydration = "scheduled";
  window.clearTimeout(scheduleCommunityHydration.timer);
  scheduleCommunityHydration.timer = window.setTimeout(() => {
    if (currentId() !== "community") return;
    hydrateCommunityFromApi("community", { force, silent: true });
  }, 0);
}

async function hydrateCheckinFromApi(routeId = "checkin", options = {}) {
  const force = Boolean(options.force);
  if (!force && checkinPageState && checkinPageState?.query?.type === activeCheckinFilter) {
    document.documentElement.dataset.yunlvCheckinHydration = "loaded";
    return;
  }
  if (checkinPageLoading && !force) {
    document.documentElement.dataset.yunlvCheckinHydration = "loading";
    return;
  }
  const requestSeq = ++checkinRequestSeq;
  checkinPageLoading = true;
  const status = document.querySelector("[data-checkin-filter-status]");
  if (status && !options.silent) status.textContent = "正在加载打卡数据...";
  const params = new URLSearchParams();
  if (activeCheckinFilter && activeCheckinFilter !== "全部") params.set("type", activeCheckinFilter);
  try {
    const page = await userApi(`/api/user/checkin${params.toString() ? `?${params}` : ""}`);
    if (requestSeq !== checkinRequestSeq) return;
    checkinPageState = page;
    document.documentElement.dataset.yunlvCheckinHydration = "loaded";
    document.documentElement.dataset.yunlvCheckinSource = page?.sourceEndpoint || "/api/user/checkin";
    document.documentElement.dataset.yunlvCheckinFilter = activeCheckinFilter;
    if (currentId() === routeId) render();
  } catch (error) {
    if (requestSeq !== checkinRequestSeq) return;
    checkinPageState = {
      sourceEndpoint: "/api/user/checkin",
      query: { type: activeCheckinFilter },
      typeFilters: ["全部", "景点打卡", "活动打卡", "健康打卡", "美食打卡"].map((key) => ({ key, count: 0 })),
      records: [],
      achievements: [],
      summary: { filtered: 0 },
      error: error.message,
    };
    document.documentElement.dataset.yunlvCheckinHydration = `error:${error.message}`;
    if (currentId() === routeId) render();
  } finally {
    if (requestSeq === checkinRequestSeq) checkinPageLoading = false;
  }
}

function scheduleCheckinHydration(options = {}) {
  if (currentId() !== "checkin") return;
  const force = Boolean(options.force);
  if (!force && checkinPageState && checkinPageState?.query?.type === activeCheckinFilter) return;
  if (checkinPageLoading && !force) return;
  document.documentElement.dataset.yunlvCheckinHydration = "scheduled";
  window.clearTimeout(scheduleCheckinHydration.timer);
  scheduleCheckinHydration.timer = window.setTimeout(() => {
    if (currentId() !== "checkin") return;
    hydrateCheckinFromApi("checkin", { force, silent: true });
  }, 0);
}

async function hydrateFoodFromApi(routeId = "food", options = {}) {
  const force = Boolean(options.force);
  if (!force && foodPageState && foodPageState?.query?.category === activeFoodCategory) {
    document.documentElement.dataset.yunlvFoodHydration = "loaded";
    return;
  }
  if (foodPageLoading && !force) {
    document.documentElement.dataset.yunlvFoodHydration = "loading";
    return;
  }
  const requestSeq = ++foodRequestSeq;
  foodPageLoading = true;
  const status = document.querySelector("[data-food-status]");
  if (status && !options.silent) status.textContent = "正在加载美食数据...";
  const params = new URLSearchParams();
  if (activeFoodCategory && activeFoodCategory !== "全部") params.set("category", activeFoodCategory);
  try {
    const page = await userApi(`/api/user/food${params.toString() ? `?${params}` : ""}`);
    if (requestSeq !== foodRequestSeq) return;
    foodPageState = page;
    document.documentElement.dataset.yunlvFoodHydration = "loaded";
    document.documentElement.dataset.yunlvFoodSource = page?.sourceEndpoint || "/api/user/food";
    document.documentElement.dataset.yunlvFoodCategory = activeFoodCategory;
    if (currentId() === routeId) render();
  } catch (error) {
    if (requestSeq !== foodRequestSeq) return;
    foodPageState = {
      sourceEndpoint: "/api/user/food",
      query: { category: activeFoodCategory },
      categories: ["全部", "特色小吃", "营养餐", "团餐预订", "家属代订"].map((key) => ({ key, count: 0 })),
      restaurants: [],
      allRestaurants: [],
      summary: { filtered: 0, total: 0 },
      healthAdvice: {},
      error: error.message,
    };
    document.documentElement.dataset.yunlvFoodHydration = `error:${error.message}`;
    if (currentId() === routeId) render();
  } finally {
    if (requestSeq === foodRequestSeq) foodPageLoading = false;
  }
}

function scheduleFoodHydration(options = {}) {
  if (currentId() !== "food") return;
  const force = Boolean(options.force);
  if (!force && foodPageState && foodPageState?.query?.category === activeFoodCategory) return;
  if (foodPageLoading && !force) return;
  document.documentElement.dataset.yunlvFoodHydration = "scheduled";
  window.clearTimeout(scheduleFoodHydration.timer);
  scheduleFoodHydration.timer = window.setTimeout(() => {
    if (currentId() !== "food") return;
    hydrateFoodFromApi("food", { force, silent: true });
  }, 0);
}

async function hydrateTransportFromApi(routeId = "transport", options = {}) {
  const force = Boolean(options.force);
  const destination = transportDestination || "";
  if (!force && transportPageState && (transportPageState?.query?.destination || "") === destination) {
    document.documentElement.dataset.yunlvTransportHydration = "loaded";
    return;
  }
  if (transportPageLoading && !force) {
    document.documentElement.dataset.yunlvTransportHydration = "loading";
    return;
  }
  const requestSeq = ++transportRequestSeq;
  transportPageLoading = true;
  const status = document.querySelector("[data-transport-status]");
  if (status && !options.silent) status.textContent = "正在加载交通数据...";
  const params = new URLSearchParams();
  if (destination) params.set("destination", destination);
  try {
    const page = await userApi(`/api/user/transport${params.toString() ? `?${params}` : ""}`);
    if (requestSeq !== transportRequestSeq) return;
    transportPageState = page;
    document.documentElement.dataset.yunlvTransportHydration = "loaded";
    document.documentElement.dataset.yunlvTransportSource = page?.sourceEndpoint || "/api/user/transport";
    document.documentElement.dataset.yunlvTransportDestination = destination;
    if (currentId() === routeId) render();
  } catch (error) {
    if (requestSeq !== transportRequestSeq) return;
    transportPageState = {
      sourceEndpoint: "/api/user/transport",
      query: { destination },
      commonDestinations: [],
      quickServices: [],
      nearby: [],
      routes: [],
      moreRoutes: [],
      records: [],
      origin: { title: transportOriginText(), city: currentCity || DEFAULT_CITY },
      summary: {},
      error: error.message,
    };
    document.documentElement.dataset.yunlvTransportHydration = `error:${error.message}`;
    if (currentId() === routeId) render();
  } finally {
    if (requestSeq === transportRequestSeq) transportPageLoading = false;
  }
}

function scheduleTransportHydration(options = {}) {
  if (currentId() !== "transport") return;
  const force = Boolean(options.force);
  if (!force && transportPageState && (transportPageState?.query?.destination || "") === (transportDestination || "")) return;
  if (transportPageLoading && !force) return;
  document.documentElement.dataset.yunlvTransportHydration = "scheduled";
  window.clearTimeout(scheduleTransportHydration.timer);
  scheduleTransportHydration.timer = window.setTimeout(() => {
    if (currentId() !== "transport") return;
    hydrateTransportFromApi("transport", { force, silent: true });
  }, 0);
}

function syncShopCartFromApi(cart = {}) {
  shopCartItems = Array.isArray(cart.items) ? cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    desc: item.desc || "",
    category: item.category || "",
    image: item.image || "",
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
    stock: Number(item.stock || 0),
    merchantId: item.merchantId || "",
  })) : [];
  cartCount = Number(cart.count ?? shopCartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0));
  localStorage.setItem("yunlv-shop-cart", JSON.stringify(shopCartItems));
}

async function hydrateShopFromApi(routeId = "shop", options = {}) {
  const force = Boolean(options.force);
  const category = shopActiveFilter && shopActiveFilter !== "平台精选" ? shopActiveFilter : "";
  const q = shopSearchKeyword || "";
  if (!force && shopPageState && (shopPageState?.query?.category || "") === category && (shopPageState?.query?.q || "") === q) {
    document.documentElement.dataset.yunlvShopHydration = "loaded";
    return;
  }
  if (shopPageLoading && !force) {
    document.documentElement.dataset.yunlvShopHydration = "loading";
    return;
  }
  const requestSeq = ++shopRequestSeq;
  shopPageLoading = true;
  const status = document.querySelector("[data-shop-status]");
  if (status && !options.silent) status.textContent = "正在加载商城数据...";
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  try {
    const page = await userApi(`/api/user/shop${params.toString() ? `?${params}` : ""}`);
    if (requestSeq !== shopRequestSeq) return;
    shopPageState = page;
    syncShopCartFromApi(page.cart || {});
    document.documentElement.dataset.yunlvShopHydration = "loaded";
    document.documentElement.dataset.yunlvShopSource = page?.sourceEndpoint || "/api/user/shop";
    if (currentId() === routeId) render();
  } catch (error) {
    if (requestSeq !== shopRequestSeq) return;
    shopPageState = {
      sourceEndpoint: "/api/user/shop",
      query: { category, q },
      categories: [],
      products: [],
      cart: { items: shopCartItems, count: cartCount, total: shopCartTotal() },
      error: error.message,
    };
    document.documentElement.dataset.yunlvShopHydration = `error:${error.message}`;
    if (currentId() === routeId) render();
  } finally {
    if (requestSeq === shopRequestSeq) shopPageLoading = false;
  }
}

function scheduleShopHydration(options = {}) {
  if (currentId() !== "shop") return;
  const force = Boolean(options.force);
  const category = shopActiveFilter && shopActiveFilter !== "平台精选" ? shopActiveFilter : "";
  const q = shopSearchKeyword || "";
  if (!force && shopPageState && (shopPageState?.query?.category || "") === category && (shopPageState?.query?.q || "") === q) return;
  if (shopPageLoading && !force) return;
  document.documentElement.dataset.yunlvShopHydration = "scheduled";
  window.clearTimeout(scheduleShopHydration.timer);
  scheduleShopHydration.timer = window.setTimeout(() => {
    if (currentId() !== "shop") return;
    hydrateShopFromApi("shop", { force, silent: true });
  }, 0);
}

async function hydrateVolunteerFromApi(routeId = "volunteer", options = {}) {
  const force = Boolean(options.force);
  if (!force && volunteerPageState) {
    document.documentElement.dataset.yunlvVolunteerHydration = "loaded";
    return;
  }
  if (volunteerPageLoading && !force) {
    document.documentElement.dataset.yunlvVolunteerHydration = "loading";
    return;
  }
  const requestSeq = ++volunteerRequestSeq;
  volunteerPageLoading = true;
  const status = document.querySelector("[data-volunteer-status]");
  if (status && !options.silent) status.textContent = "正在加载志愿服务数据...";
  try {
    const page = await userApi("/api/user/volunteer");
    if (requestSeq !== volunteerRequestSeq) return;
    volunteerPageState = page;
    document.documentElement.dataset.yunlvVolunteerHydration = "loaded";
    document.documentElement.dataset.yunlvVolunteerSource = page?.sourceEndpoint || "/api/user/volunteer";
    if (currentId() === routeId) render();
  } catch (error) {
    if (requestSeq !== volunteerRequestSeq) return;
    volunteerPageState = {
      sourceEndpoint: "/api/user/volunteer",
      actions: [],
      demands: [],
      teams: [],
      moreTeams: [],
      records: [],
      error: error.message,
    };
    document.documentElement.dataset.yunlvVolunteerHydration = `error:${error.message}`;
    if (currentId() === routeId) render();
  } finally {
    if (requestSeq === volunteerRequestSeq) volunteerPageLoading = false;
  }
}

function scheduleVolunteerHydration(options = {}) {
  if (currentId() !== "volunteer") return;
  const force = Boolean(options.force);
  if (!force && volunteerPageState) return;
  if (volunteerPageLoading && !force) return;
  document.documentElement.dataset.yunlvVolunteerHydration = "scheduled";
  window.clearTimeout(scheduleVolunteerHydration.timer);
  scheduleVolunteerHydration.timer = window.setTimeout(() => {
    if (currentId() !== "volunteer") return;
    hydrateVolunteerFromApi("volunteer", { force, silent: true });
  }, 0);
}

async function hydrateHomeFromApi() {
  if (userHomeApiState || userHomeApiLoading) return;
  userHomeApiLoading = true;
  try {
    const data = await userApi("/api/user/home");
    userHomeApiState = data;
    document.documentElement.dataset.yunlvUserHomeHydrated = "true";
    document.documentElement.dataset.yunlvUserHomeSource = "/api/user/home";
    document.documentElement.dataset.yunlvUserHomeRequirements = data?.homeRequirements?.version || "";
    const apiCity = data?.homeRequirements?.topArea?.currentCity;
    if (apiCity) updateCurrentCity(apiCity);
    if (currentId() === "home") render();
  } finally {
    userHomeApiLoading = false;
  }
}

async function hydrateActivitySignupFromApi() {
  const activityId = selectedActivityId || HOME_FALLBACK_ACTIVITIES[0].id;
  if (selectedActivityDetail?.id === activityId) return;
  const detail = await userApi(`/api/activities/${encodeURIComponent(activityId)}`);
  selectedActivityDetail = detail;
  document.documentElement.dataset.yunlvActivityDetailId = activityId;
  if (currentId() === "activity-signup") render();
}

async function hydrateUserProfileFromApi(routeId) {
  if (routeId === "profile") {
    if (userProfileCenterState || userProfileCenterLoading) return;
    userProfileCenterLoading = true;
    try {
      const center = await userApi("/api/user/profile-center");
      userProfileCenterState = center;
      const user = center.user || {};
      const elder = center.elderProfile || {};
      if (!personalAvatar) applyPersonalAvatar(user.avatar || elder.avatar, { persist: true });
      document.documentElement.dataset.yunlvUserProfileSource = "/api/user/profile-center";
      if (currentId() === "profile") render();
    } finally {
      userProfileCenterLoading = false;
    }
    return;
  }
  if (routeId === "personal") {
    if (userPersonalState || userPersonalLoading) return;
    userPersonalLoading = true;
    try {
      userPersonalState = await userApi("/api/user/personal");
      const user = userPersonalState.user || {};
      const elder = userPersonalState.elderProfile || {};
      if (user.avatar) applyPersonalAvatar(user.avatar, { persist: true });
      document.documentElement.dataset.yunlvUserPersonalSource = userPersonalState.sourceEndpoint || "/api/user/personal";
      if (currentId() === "personal") render();
    } finally {
      userPersonalLoading = false;
    }
    return;
  }
  const data = await userApi("/api/user/profile");
  const user = data.user || {};
  const elder = data.elderProfile || {};
  if (!personalAvatar) applyPersonalAvatar(user.avatar || elder.avatar, { persist: true });
}

function setFormValueIfIdle(form, name, value) {
  const field = form?.elements?.[name];
  const text = Array.isArray(value) ? value.join("、") : String(value ?? "").trim();
  if (!field || !text || document.activeElement === field) return;
  field.value = text;
}

function hydratePersonalFormFromApi(user = {}, elder = {}) {
  const form = document.querySelector("[data-personal-profile-form]");
  if (!form) return;
  setFormValueIfIdle(form, "name", elder.name || user.nickname || user.name);
  setFormValueIfIdle(form, "gender", elder.gender);
  setFormValueIfIdle(form, "age", elder.age);
  setFormValueIfIdle(form, "phone", user.phone);
  setFormValueIfIdle(form, "city", user.currentCity || elder.city);
  setFormValueIfIdle(form, "address", user.address || elder.address);
  setFormValueIfIdle(form, "preference", elder.healthTags || elder.preference);
  setFormValueIfIdle(form, "diet", elder.dietPreference || elder.diet);
  setFormValueIfIdle(form, "mobility", elder.mobility);
}

function hydrateProfileHeadFromApi(user = {}, elder = {}) {
  const name = String(elder.name || user.nickname || user.name || "").trim();
  const title = document.querySelector(".ref-profile-head h2");
  const member = title?.querySelector(".member")?.outerHTML || '<span class="member">旅居会员</span>';
  if (title && name) title.innerHTML = `${attr(name)} ${member}`;
}

function writeApiStatus(text) {
  const content = document.querySelector(".content");
  if (!content || content.querySelector("[data-api-hydration-status]")) return;
  const status = document.createElement("p");
  status.className = "action-status";
  status.dataset.apiHydrationStatus = "";
  status.textContent = text;
  content.appendChild(status);
}

function apiRaw(value, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function apiText(value, fallback = "") {
  return attr(apiRaw(value, fallback));
}

function apiTime(value) {
  const text = apiText(value);
  if (!text) return "";
  return text.replace(/^2026-/, "").replace(/^2025-/, "").replace("T", " ").slice(0, 16);
}

function orderStatusClass(status = "") {
  if (/完成|确认/.test(status)) return "green";
  if (/服务中|已接单|已派单/.test(status)) return "blue";
  if (/取消|异常|拒绝/.test(status)) return "red";
  return "orange";
}

function normalizeOrderStatus(status = "") {
  const text = String(status || "");
  if (/已取消|取消|已关闭|拒绝/.test(text)) return "已取消";
  if (/已完成|完成/.test(text)) return "已完成";
  if (/待确认|待评价|待用户确认|待验收/.test(text)) return "待确认";
  if (/服务中|已接单|已派单|进行中|已开始|待服务/.test(text)) return "服务中";
  return "待接单";
}

function orderIconFor(order) {
  const serviceType = apiText(order.serviceType);
  if (/活动/.test(serviceType)) return ["person-standing", "purple", "活动报名"];
  if (/护理|护工|康养/.test(serviceType)) return ["user-round", "orange", "服务"];
  if (/导游|游览|文旅/.test(serviceType)) return ["flag", "blue", "服务"];
  if (/商城|商品|餐食/.test(serviceType)) return ["shopping-bag", "blue", "服务"];
  return ["briefcase-medical", "green", "服务"];
}

async function hydrateOrdersFromApi() {
  const list = document.querySelector(".ref-order-list");
  if (!list) return;
  const requestSeq = ++orderRequestSeq;
  ordersPageLoading = true;
  const status = document.querySelector("[data-order-filter-status]");
  if (status) status.textContent = "正在加载订单数据...";
  const params = new URLSearchParams();
  if (orderActiveFilter && orderActiveFilter !== "全部") params.set("status", orderActiveFilter);
  if (orderProviderFilter) params.set("providerType", orderProviderFilter);
  if (orderSearchQuery) params.set("q", orderSearchQuery);
  const path = `/api/user/orders${params.toString() ? `?${params}` : ""}`;
  let page;
  try {
    page = await userApi(path);
  } catch (error) {
    if (requestSeq !== orderRequestSeq) return;
    list.innerHTML = `<p class="empty">订单加载失败：${apiText(error.message, "请稍后重试")}</p><button class="btn blue" data-action="重新读取订单" type="button">重新加载</button>`;
    if (status) status.textContent = "订单加载失败";
    ordersPageLoading = false;
    return;
  }
  if (requestSeq !== orderRequestSeq) return;
  ordersPageState = page;
  document.documentElement.dataset.yunlvOrdersSource = page.sourceEndpoint || "/api/user/orders";
  const rows = (page.orders || []).map((order) => {
    const [iconName, iconClass, fallbackType] = orderIconFor(order);
    const provider = apiText(order.assigneeName || order.providerName || order.providerId, "待后台派单");
    const actions = [];
    if (order.capabilities?.canCancel) actions.push({ text: "取消订单", action: "取消订单", primary: false });
    if (order.capabilities?.canConfirm) actions.push({ text: "确认并评价", route: "review", primary: true });
    else if (order.capabilities?.canReview) actions.push({ text: "去评价", route: "review", primary: true });
    else actions.push({ text: "查看进度", route: "order-detail", primary: true });
    return {
      id: apiText(order.id),
      no: apiText(order.orderNo || order.id),
      date: apiTime(order.time || order.createdAt),
      title: apiText(order.serviceType, "旅居管家服务"),
      type: apiText(order.requirementCategory || (order.providerType === "merchant" ? "商户服务" : fallbackType), fallbackType),
      status: apiText(order.status, "待派单"),
      statusClass: orderStatusClass(order.status),
      amount: `¥${Number(order.amount || 0)}`,
      count: apiText(order.items?.length ? `共${order.items.length}项` : "共1次"),
      iconName,
      iconClass,
      lines: [
        `${order.providerType === "merchant" ? "商户" : "向导"}：${provider}${provider === "待后台派单" ? "" : " 已认证"}`,
        `服务时间：${apiTime(order.time) || "待确认"}`,
        `服务地点：${apiText(order.location, "待确认地点")}`,
        apiText(order.note, "需求已进入后台派单池"),
      ],
      rating: order.rating ? `您已评价：${"★".repeat(Number(order.rating || 0))}` : "",
      actions,
    };
  });
  list.innerHTML = rows.length ? rows.map(orderRow).join("") : `<p class="empty">暂无匹配订单，请调整搜索或筛选条件。</p>`;
  if (status) status.textContent = orderFilterText(orderActiveFilter || "全部", rows.length);
  document.querySelectorAll("[data-order-filter]").forEach((tab) => {
    const active = tab.dataset.orderFilter === orderActiveFilter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
    const count = page.filters?.counts?.[tab.dataset.orderFilter];
    let counter = tab.querySelector("small");
    if (!counter && count !== undefined) {
      counter = document.createElement("small");
      tab.appendChild(counter);
    }
    if (counter && count !== undefined) counter.textContent = count;
  });
  ordersPageLoading = false;
}

async function handleOrdersAction(button, actionName) {
  if (currentId() !== "orders") return false;
  if (actionName === "查看订单详情") {
    const orderId = button.dataset.orderId;
    if (orderId) localStorage.setItem("yunlv-selected-order", orderId);
    rememberScreenReturn("order-detail", button);
    setRoute("order-detail");
    return true;
  }
  if (actionName === "重新读取订单") {
    await hydrateOrdersFromApi();
    return true;
  }
  if (actionName.startsWith("订单类型：")) {
    const value = actionName.replace("订单类型：", "");
    orderProviderFilter = value === "全部" ? "" : value;
    render();
    return true;
  }
  if (actionName === "重置订单筛选") {
    orderActiveFilter = "全部";
    orderProviderFilter = "";
    orderSearchQuery = "";
    render();
    return true;
  }
  if (actionName === "取消订单") {
    const orderId = button.dataset.orderId;
    if (!orderId) return true;
    if (button.dataset.confirmCancel !== "true") {
      button.dataset.confirmCancel = "true";
      button.textContent = "确认取消";
      writeActionStatus(button, "再次点击确认取消该订单");
      window.setTimeout(() => {
        if (button.isConnected && button.dataset.confirmCancel === "true") {
          delete button.dataset.confirmCancel;
          button.textContent = "取消订单";
        }
      }, 5000);
      return true;
    }
    button.disabled = true;
    try {
      await userApi(`/api/orders/${encodeURIComponent(orderId)}/cancel`, { method: "POST", body: { reason: "用户在订单页主动取消" } });
      ordersPageLoading = false;
      await hydrateOrdersFromApi();
      showToast("订单已取消");
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `取消失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "提交订单客服工单") {
    button.disabled = true;
    try {
      const ticket = await userApi("/api/service-requests", {
        method: "POST",
        body: {
          role: "user",
          route: "orders",
          action: "订单客服咨询",
          type: "订单客服",
          priority: "P1",
          description: `用户就订单 ${button.dataset.orderNo || "列表"} 发起人工客服咨询`,
        },
      });
      writeActionStatus(button, `客服工单 ${ticket.requestNo} 已提交，平台将尽快联系您`);
      button.textContent = "工单已提交";
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `工单提交失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "客服") {
    const content = document.querySelector(".content");
    let panel = document.querySelector("[data-order-support]");
    if (!panel && content) {
      panel = document.createElement("section");
      panel.className = "card ref-order-support";
      panel.dataset.orderSupport = "true";
      panel.innerHTML = `<div><strong>订单客服</strong><p>工作时间 08:00–22:00，可直接拨打或提交客服工单。</p></div><a class="btn blue" href="tel:4008880000">拨打 400-888-0000</a><button class="btn ghost" data-action="提交订单客服工单" type="button">提交客服工单</button><p class="action-status"></p>`;
      content.insertBefore(panel, content.firstChild);
    }
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  return false;
}

function messageColor(message) {
  const category = apiText(message.category || message.scenario || "");
  if (/SOS|紧急|异常/.test(`${message.title}${message.content}${category}`)) return "red";
  if (/活动/.test(category)) return "purple";
  if (/设备|手环|机器人/.test(`${message.title}${message.content}${category}`)) return "blue";
  if (/系统|公告|首页内容|通知|维护/.test(`${message.title}${message.content}${category}`)) return "orange";
  return "green";
}

function messageIconName(message) {
  const text = `${message.title || ""}${message.content || ""}${message.category || ""}${message.scenario || ""}`;
  if (/SOS|紧急/.test(text)) return "sos";
  if (/活动/.test(text)) return "person-standing";
  if (/设备|手环|机器人/.test(text)) return "watch";
  if (/订单|服务/.test(text)) return "clipboard-check";
  return "megaphone";
}

function messageType(message) {
  const text = `${message.title || ""}${message.content || ""}${message.category || ""}${message.scenario || ""}`;
  if (/活动/.test(text)) return "活动";
  if (/设备|手环|机器人/.test(text)) return "设备";
  if (/系统|公告|紧急|SOS|首页内容|通知|维护/.test(text)) return "系统";
  return "服务";
}

async function hydrateMessagesFromApi() {
  const list = document.querySelector(".ref-message-list");
  if (!list) return;
  const messages = await userApi("/api/messages?role=user");
  const normalizedMessages = (messages || []).map((message) => ({
    id: apiText(message.id),
    iconName: messageIconName(message),
    title: apiText(message.title, "消息提醒"),
    text: apiText(message.content, "请查看详情"),
    time: apiTime(message.createdAt || message.time),
    createdAt: apiText(message.createdAt || message.time),
    color: messageColor(message),
    type: messageType(message),
    read: !!message.read,
    scenario: apiText(message.scenario),
    priority: apiText(message.priority, "普通"),
    channels: Array.isArray(message.channels) ? message.channels : ["站内消息"],
    relatedType: apiText(message.relatedType),
    relatedId: apiText(message.relatedId),
    apiEndpoint: message.id ? `/api/messages/${encodeURIComponent(message.id)}/read` : "",
  }));
  currentUserMessages = normalizedMessages;
  messagesApiLoaded = true;
  messagesRead = currentUserMessages.length > 0 && currentUserMessages.every((item) => item.read);
  filterMessages(activeMessageFilter, true);
}

async function hydrateOrderDetailFromApi() {
  const statusCard = document.querySelector(".ref-order-status-card");
  if (!statusCard) return;
  const selectedOrderId = localStorage.getItem("yunlv-selected-order") || "";
  if (!selectedOrderId) {
    writeActionStatus(statusCard, "未选择订单，请从订单列表进入详情");
    return;
  }
  const order = await userApi(`/api/orders/${encodeURIComponent(selectedOrderId)}`);
  statusCard.dataset.orderId = order.id || selectedOrderId;
  statusCard.dataset.apiEndpoint = `/api/orders/${encodeURIComponent(order.id || selectedOrderId)}`;
  const statusHead = statusCard.querySelector(".ref-order-status-head");
  const statusTitle = statusHead?.querySelector("h2");
  if (statusTitle) statusTitle.innerHTML = `${apiText(order.status, "待处理")} <span class="tag">${apiText(order.serviceType, "旅居服务")}</span>`;
  const statusLines = statusHead?.querySelectorAll("p") || [];
  if (statusLines[0]) statusLines[0].textContent = `服务单号：${apiText(order.orderNo, order.id)}`;
  if (statusLines[1]) statusLines[1].textContent = `预约时间：${apiTime(order.time) || "待确认"}`;
  const statusBadge = statusHead?.querySelector("em");
  if (statusBadge) statusBadge.textContent = apiText(order.status, "待处理");

  const timeline = Array.isArray(order.timeline) && order.timeline.length
    ? [...order.timeline].reverse()
    : [{ status: order.status || "已下单", time: order.createdAt || order.time }];
  statusCard.querySelectorAll(".ref-progress-steps span").forEach((step, index) => {
    const item = timeline[index];
    step.hidden = !item;
    if (!item) return;
    step.classList.add("done");
    const label = step.querySelector("b");
    const time = step.querySelector("small");
    if (label) label.textContent = apiText(item.status, "订单进度");
    if (time) time.textContent = apiTime(item.time);
  });

  const providerCard = document.querySelector(".ref-guide-contact");
  const providerName = apiText(order.assigneeName, order.providerType === "merchant" ? "商户待确认" : "向导待派单");
  const providerTitle = providerCard?.querySelector("h2");
  if (providerTitle) providerTitle.innerHTML = `${providerName} <span class="tag">${apiText(order.status, "待处理")}</span>`;
  const providerDesc = providerCard?.querySelector("p");
  if (providerDesc) providerDesc.innerHTML = `${icon(order.providerType === "merchant" ? "building-2" : "badge-check", 14)} ${order.providerType === "merchant" ? "认证商户" : "认证向导"} · 服务信息已更新`;
  const providerImage = providerCard?.querySelector("img");
  if (providerImage) providerImage.alt = providerName;

  const values = [
    apiTime(order.time) || "待确认",
    apiText(order.location, "服务地点待确认"),
    apiText(order.elderName, "服务对象待确认"),
    apiText(order.serviceType, "旅居服务"),
    apiText(order.note, "暂无特别说明"),
  ];
  document.querySelectorAll(".ref-detail-fields .ref-order-info-row strong").forEach((node, index) => {
    node.textContent = values[index] || "待确认";
  });
  const mapPin = document.querySelector(".ref-detail-map .map-pin");
  if (mapPin) mapPin.innerHTML = `${icon("map-pin", 15)}${apiText(order.location, "服务地点待确认")}`;
  const amount = document.querySelector(".ref-fee-info > div:first-child strong");
  if (amount) amount.textContent = `¥${Number(order.amount || 0)}`;
  const primary = document.querySelector(".ref-detail-bottom .primary");
  if (primary && !/已完成/.test(order.status || "")) {
    primary.dataset.route = "orders";
    primary.textContent = "查看全部订单";
  }
}

async function hydrateContactsFromApi() {
  const list = document.querySelector(".ref-contact-list");
  if (!list) return;
  if (contactsPageLoading) return;
  contactsPageLoading = true;
  let page;
  try {
    page = await userApi("/api/user/contacts");
    contactsPageState = page;
  } finally {
    contactsPageLoading = false;
  }
  const contacts = page.contacts || [];
  const settings = page.notificationSettings || { rules: [] };
  document.documentElement.dataset.yunlvContactsSource = page.sourceEndpoint || "/api/user/contacts";
  familyContacts = (contacts || []).map((contact, index) => ({
    id: contact.id,
    name: contact.name,
    relation: contact.relation,
    phone: contact.phone,
    status: contact.isDefault ? "默认联系人" : "",
    image: index % 2 === 0 ? "avatar-daughter.jpg" : "avatar-son.jpg",
    scopes: ["SOS通知", "位置查看"],
  }));
  localStorage.setItem("yunlv-family-contacts", JSON.stringify(familyContacts));
  list.innerHTML = (contacts || []).map((contact, index) => contactManage(
    contact.id,
    apiText(contact.name, "联系人"),
    apiText(contact.relation, "家属"),
    maskPhone(contact.phone),
    apiText(contact.phone),
    contact.isDefault ? "默认" : "",
    index % 2 === 0 ? "avatar-daughter.jpg" : "avatar-son.jpg",
    index % 2 === 0 ? "purple" : "blue",
    contact.callPriority,
    contact.notifyAlert,
  )).join("") || `<p class="empty">暂无紧急联系人，请新增后同步后台通知链路。</p>`;
  const sort = document.querySelector(".ref-contact-sort");
  if (sort) sort.textContent = `${page.summary?.contactCount || 0} 位联系人 · ${page.summary?.alertContactCount || 0} 位参与告警 · 按通知顺序排列`;
  (settings.rules || []).forEach((rule) => {
    const button = document.querySelector(`[data-notification-rule="${rule.key}"]`);
    if (!button) return;
    button.disabled = false;
    button.classList.toggle("active", rule.enabled);
    button.setAttribute("aria-pressed", rule.enabled ? "true" : "false");
    button.dataset.action = `切换${rule.title}`;
    const mark = button.querySelector("em");
    if (mark) mark.style.visibility = rule.enabled ? "visible" : "hidden";
  });
}

async function hydrateFamilyFromApi(routeId = "family") {
  if (familyPageState || familyPageLoading) return;
  familyPageLoading = true;
  try {
    familyPageState = await userApi("/api/user/family");
    familyContacts = (familyPageState.contacts || []).map((contact, index) => ({
      ...contact,
      status: contact.isDefault ? "默认联系人" : contact.bindingStatus || "",
      image: index % 2 === 0 ? "avatar-daughter.jpg" : "avatar-son.jpg",
    }));
    document.documentElement.dataset.yunlvFamilySource = familyPageState?.sourceEndpoint || "/api/user/family";
    if (currentId() === routeId) render();
  } finally {
    familyPageLoading = false;
  }
}

async function hydrateEmergencyFromApi(routeId = "emergency") {
  if (emergencyPageState || emergencyPageLoading) return;
  emergencyPageLoading = true;
  try {
    emergencyPageState = await userApi("/api/alerts/emergency-requirements");
    document.documentElement.dataset.yunlvEmergencySource = "/api/alerts/emergency-requirements";
    if (currentId() === routeId) render();
  } finally {
    emergencyPageLoading = false;
  }
}

function maskPhone(phone = "") {
  const raw = String(phone);
  return raw.length === 11 ? `${raw.slice(0, 3)} **** ${raw.slice(7)}` : raw;
}

async function hydrateSosRecordsFromApi() {
  const list = document.querySelector(".ref-sos-record-list");
  if (!list) return;
  const requirements = await userApi("/api/alerts/emergency-requirements");
  const alerts = requirements.records || requirements.recentAlerts || [];
  const summary = requirements.recordSummary || {};
  const summaryValues = [
    { value: summary.total ?? alerts.length, unit: "条" },
    { value: summary.handled ?? alerts.filter((item) => /已处理|已完成|已确认|已取消/.test(item.status || "")).length, unit: "条" },
    { value: summary.pending ?? alerts.filter((item) => !/已处理|已完成|已确认|已取消/.test(item.status || "")).length, unit: "条" },
  ];
  document.querySelectorAll("[data-sos-record-stat]").forEach((node, index) => {
    const stat = summaryValues[index];
    if (!stat) return;
    const value = node.querySelector("strong");
    if (value) value.innerHTML = `${attr(stat.value)}<em>${attr(stat.unit)}</em>`;
  });
  list.innerHTML = alerts.map((alert) => {
    const alertText = `${alert.type || ""} ${alert.title || ""} ${alert.description || ""}`;
    const isSos = /SOS|紧急|一键求助|呼救/.test(alertText);
    const isCustomer = /客服|人工|坐席/.test(alertText);
    const category = alert.category || (isSos ? "SOS" : isCustomer ? "人工客服" : "设备异常");
    return sosRecordCard(
      isSos ? "SOS" : /跌倒|未动|设备|手环|低电量|异常/.test(alertText) ? "shield-alert" : "headphones",
      apiText(alert.title || alert.type, "紧急求助记录"),
      apiText(alert.status, "待处理"),
      apiTime(alert.createdAt),
      apiText(alert.location, requirements.locationUpload?.address || "定位地址待同步"),
      /已处理|已确认/.test(alert.status || "") ? "green" : isSos ? "red" : "orange",
      [
        ["处理结果", attr(apiText(alert.result || alert.description, "已进入后台处理队列")), "circle-check"],
        ["处理人员", attr(apiText(alert.handledBy || "平台后台", "平台后台")), "headphones"],
        ["通知家属", (alert.contactSnapshot || requirements.emergencyContacts?.contacts || []).map((item) => `${attr(item.relation)} ${attr(item.name)}`).join("<br>") || "待通知", "users"],
      ],
      [["bell", `${attr(apiTime(alert.createdAt) || "刚刚")}<br>触发求助`], ["headphones", "后台<br>接收"], ["phone", "家属<br>通知"], ["shield-check", attr(apiText(alert.status, "处理中"))]],
      category,
    );
  }).join("") || `<p class="empty">暂无求助记录。</p>`;
  filterSosRecords(sosRecordActiveFilter || "全部", true);
}

async function hydrateHealthFromApi(routeId) {
  if (routeId === "health-record") {
    if (healthRecordState || healthRecordLoading) return;
    healthRecordLoading = true;
    try {
      healthRecordState = await userApi("/api/health/record");
      document.documentElement.dataset.yunlvHealthRecordSource = healthRecordState?.sourceEndpoint || "/api/health/record";
      if (currentId() === "health-record") render();
    } finally {
      healthRecordLoading = false;
    }
    return;
  }
  const overview = await userApi("/api/health/overview");
  const profile = document.querySelector(".ref-health-profile-v2");
  if (profile && overview.elder) {
    const elder = overview.elder;
    profile.querySelector("h2").innerHTML = `${apiText(elder.name, "老人")} <span>${icon(elder.gender === "女" ? "venus" : "mars", 16)} ${apiText(elder.gender, "男")}</span><i>${apiText(elder.age, "--")} 岁</i>`;
    const city = currentCity || DEFAULT_CITY;
    const location = profile.querySelector("p");
    if (location) location.innerHTML = `${icon("map-pin", 15)}当前城市：${city}`;
  }
  const healthList = document.querySelector(".ref-health-overview");
  if (healthList) {
    const elder = overview.elder || {};
    const metrics = overview.metrics || [];
    const bloodOxygen = metrics.find((item) => /血氧/.test(item.label || item.metricType || ""));
    healthList.innerHTML = [
      ["droplet", "血型", elder.bloodType || "O型", "red"],
      ["cross", "慢性病", (elder.healthTags || elder.chronicDiseases || ["高血压"]).join ? (elder.healthTags || ["高血压"]).join("、") : elder.chronicDiseases, "green"],
      ["shield-alert", "过敏史", elder.allergies || "青霉素", "purple"],
      ["activity", "血氧", bloodOxygen ? `${bloodOxygen.value}${bloodOxygen.unit || ""}` : "97%", "blue"],
    ].map(([iconName, title, value, color]) => `<article class="${color}">${icon(iconName, 23)}<small>${title}</small><b>${apiText(value, "待同步")}</b></article>`).join("");
  }
  if (routeId === "device-management") {
    document.querySelectorAll("[data-device-battery]").forEach((node, index) => {
      const device = (overview.devices || [])[index];
      if (device?.battery !== undefined) node.textContent = `${device.battery}%`;
    });
  }
}

async function hydrateHealthServicesFromApi(options = {}) {
  const force = Boolean(options.force);
  if (!force && (healthServicesState || healthServicesLoading)) return;
  healthServicesLoading = true;
  const status = document.querySelector("[data-health-services-status]");
  if (status && !options.silent) status.textContent = "正在加载健康服务数据...";
  const params = new URLSearchParams();
  if (healthServicesActiveCategory && healthServicesActiveCategory !== "全部") params.set("category", healthServicesActiveCategory);
  try {
    const page = await userApi(`/api/user/health-services${params.toString() ? `?${params}` : ""}`);
    healthServicesState = page;
    document.documentElement.dataset.yunlvHealthServicesSource = page?.sourceEndpoint || "/api/user/health-services";
    if (currentId() === "health-services") render();
  } catch (error) {
    const list = document.querySelector(".ref-health-service-list");
    if (list) list.innerHTML = `<p class="empty">健康服务加载失败：${apiText(error.message, "请稍后重试")}</p><button class="btn blue" data-action="重新读取健康服务" type="button">重新加载</button>`;
    if (status) status.textContent = "健康服务加载失败";
  } finally {
    healthServicesLoading = false;
  }
}

async function hydrateDestinationsFromApi(options = {}) {
  const force = Boolean(options.force);
  if (!force && (destinationsPageState || destinationsLoading)) return;
  const requestSeq = ++destinationsRequestSeq;
  destinationsLoading = true;
  const status = document.querySelector("[data-destinations-status]");
  if (status && !options.silent) status.textContent = "正在加载目的地数据...";
  const params = new URLSearchParams();
  if (activeDestinationFilter && activeDestinationFilter !== "全部") params.set("tag", activeDestinationFilter);
  if (destinationSearchQuery) params.set("q", destinationSearchQuery);
  try {
    const page = await userApi(`/api/user/destinations${params.toString() ? `?${params}` : ""}`);
    if (requestSeq !== destinationsRequestSeq) return;
    destinationsPageState = page;
    document.documentElement.dataset.yunlvDestinationsSource = page?.sourceEndpoint || "/api/user/destinations";
    destinationFavorites = (page.destinations || []).filter((destination) => destination.favorite).map((destination) => destination.id);
    syncDestinationFavorites();
    destinationsLoading = false;
    if (currentId() === "destinations") render();
  } catch (error) {
    if (requestSeq !== destinationsRequestSeq) return;
    const grid = document.querySelector(".ref-destination-grid");
    if (grid) grid.innerHTML = `<div class="card ref-empty-state">目的地加载失败：${apiText(error.message, "请稍后重试")}<br><button class="btn blue" data-action="重新读取目的地" type="button">重新加载</button></div>`;
    if (status) status.textContent = "目的地加载失败";
  } finally {
    if (requestSeq === destinationsRequestSeq) destinationsLoading = false;
  }
}

async function hydrateDestinationDetailFromApi(options = {}) {
  const destinationId = selectedDestinationKey || "mile";
  if (!options.force && destinationDetailState?.destination?.id === destinationId) return;
  if (destinationDetailLoading) return;
  destinationDetailLoading = true;
  try {
    const detail = await userApi(`/api/user/destinations/${encodeURIComponent(destinationId)}`);
    destinationDetailState = detail;
    document.documentElement.dataset.yunlvDestinationDetailSource = `/api/user/destinations/${encodeURIComponent(destinationId)}`;
    userApi(`/api/user/destinations/${encodeURIComponent(destinationId)}/view`, {
      method: "POST",
      body: { source: "destination-detail" },
    }).catch(() => {});
    if (currentId() === "destination-detail") render();
  } catch (error) {
    const target = document.querySelector(".ref-destination-title") || document.querySelector(".screen-destination-detail .content");
    if (target) writeActionStatus(target, `目的地详情加载失败：${error.message}`);
  } finally {
    destinationDetailLoading = false;
  }
}

async function hydrateDeviceManagementFromApi(options = {}) {
  const force = Boolean(options.force);
  if (!force && (deviceManagementState || deviceManagementLoading)) return;
  deviceManagementLoading = true;
  const status = document.querySelector("[data-device-management-status]");
  if (status && !options.silent) status.textContent = "正在加载设备管理数据...";
  try {
    const page = await userApi("/api/user/device-management");
    deviceManagementState = page;
    document.documentElement.dataset.yunlvDeviceManagementSource = page?.sourceEndpoint || "/api/user/device-management";
    if (currentId() === "device-management") render();
  } catch (error) {
    const list = document.querySelector(".ref-device-manage-list");
    if (list) list.innerHTML = `<p class="empty">设备管理数据加载失败：${apiText(error.message, "请稍后重试")}</p><button class="btn blue" data-action="重新读取设备管理" type="button">重新加载</button>`;
    if (status) status.textContent = "设备管理加载失败";
  } finally {
    deviceManagementLoading = false;
  }
}

function serviceRecordRow(record = {}) {
  return `
    <article class="timeline-item${record.read ? " is-read" : ""}" data-service-record-id="${attr(record.id)}" data-service-record-type="${attr(record.type)}" data-service-title="${attr(record.title)}" data-service-text="${attr(record.detail || record.text)}" data-service-time="${attr(apiTime(record.time || record.createdAt) || "刚刚")}" data-service-source-type="${attr(record.sourceType)}" data-service-detail-endpoint="${attr(record.detailEndpoint)}" data-service-delete-endpoint="${attr(record.deleteEndpoint)}">
      <span class="tile-icon ${attr(record.color || "blue")}">${icon(record.iconName || "bot", 20)}</span>
      <div>
        <b>${apiText(record.title, "服务记录")} <em>${apiText(record.type, "服务记录")}</em></b>
        <p>${apiText(record.text || record.detail, "服务记录已更新")}</p>
        <small>${apiText(apiTime(record.time || record.createdAt), "刚刚")}${record.read ? " · 已读" : ""}</small>
      </div>
      <div class="ref-service-record-actions">
        <button data-action="查看详情" type="button">详情 ${icon("chevron-right", 12)}</button>
        <button data-action="删除服务记录" class="danger-line" type="button">删除</button>
      </div>
    </article>
  `;
}

function friendlyServiceRecordSource(source = "") {
  const value = String(source || "");
  if (value === "aiHistory") return "智能问答";
  if (value === "serviceRequest") return "服务工单";
  if (value === "order") return "服务订单";
  if (/接口|api/i.test(value)) return "平台记录";
  return attr(value || "平台记录");
}

function serviceRecordStatsHtml(summary = {}) {
  const stats = [
    ["message-circle", "本周咨询", `${Number(summary.totalConversations || 0)}次`, "purple"],
    ["star", "推荐服务", `${Number(summary.recommendationRecords || 0)}项`, "green"],
    ["circle-check", "已采纳", `${Number(summary.adopted || 0)}项`, "orange"],
  ];
  return stats.map(([iconName, title, num, color]) => `<div data-service-record-stat="${attr(title)}"><span class="tile-icon ${color}">${icon(iconName, 22)}</span><b>${num}</b><small>${title}</small></div>`).join("");
}

function serviceRecordFiltersHtml(filters = [], active = serviceRecordsActiveFilter) {
  const counts = new Map((filters.length ? filters : userServiceRecordFiltersFallback()).map((item) => {
    if (typeof item === "string") return [item, ""];
    return [item.key, Number.isFinite(Number(item.count)) ? String(item.count) : ""];
  }));
  return userServiceRecordFiltersFallback().map((key) => {
    const isActive = key === active;
    const count = counts.get(key);
    return `<button class="chip ${isActive ? "active" : ""}" data-service-record-filter="${attr(key)}" data-action="筛选服务记录" type="button" aria-pressed="${isActive ? "true" : "false"}">${attr(key)}${count !== "" ? `<small>${attr(count)}</small>` : ""}</button>`;
  }).join("");
}

function userServiceRecordFiltersFallback() {
  return ["全部", "AI问答", "服务推荐", "语音交互"];
}

function queueServiceRecordsSearch(input, immediate = false) {
  serviceRecordsSearchQuery = input?.value?.trim?.() || "";
  window.clearTimeout(serviceRecordsSearchTimer);
  if (immediate) {
    hydrateServiceRecordsFromApi({ force: true, silent: true });
    return;
  }
  serviceRecordsSearchTimer = window.setTimeout(() => hydrateServiceRecordsFromApi({ force: true, silent: true }), 260);
}

async function hydrateServiceRecordsFromApi(options = {}) {
  const timeline = document.querySelector(".ref-service-timeline");
  if (!timeline) return;
  const requestSeq = ++serviceRecordsRequestSeq;
  serviceRecordsLoading = true;
  const status = document.querySelector("[data-service-record-status]");
  if (status) status.textContent = "正在加载服务记录...";
  const params = new URLSearchParams();
  if (serviceRecordsActiveFilter && serviceRecordsActiveFilter !== "全部") params.set("type", serviceRecordsActiveFilter);
  if (serviceRecordsMonthFilter) params.set("month", serviceRecordsMonthFilter);
  if (serviceRecordsSearchQuery) params.set("q", serviceRecordsSearchQuery);
  const path = `/api/user/service-records${params.toString() ? `?${params}` : ""}`;
  let page;
  try {
    page = await userApi(path);
  } catch (error) {
    if (requestSeq !== serviceRecordsRequestSeq) return;
    timeline.innerHTML = `<p class="empty">服务记录加载失败：${apiText(error.message, "请稍后重试")}</p><button class="btn blue" data-action="重新读取服务记录" type="button">重新加载</button>`;
    if (status) status.textContent = "服务记录加载失败";
    serviceRecordsLoading = false;
    return;
  }
  if (requestSeq !== serviceRecordsRequestSeq) return;
  serviceRecordsPageState = page;
  serviceRecordsCleared = Number(page.summary?.total || 0) === 0 && Number(page.summary?.archived || 0) > 0;
  document.documentElement.dataset.yunlvServiceRecordsSource = page.sourceEndpoint || "/api/user/service-records";
  document.querySelectorAll(".ref-record-stats").forEach((node) => {
    node.innerHTML = serviceRecordStatsHtml(page.summary || {});
  });
  document.querySelectorAll(".ref-record-tabs").forEach((node) => {
    node.innerHTML = serviceRecordFiltersHtml(page.filters || [], serviceRecordsActiveFilter);
  });
  const records = page.records || [];
  timeline.innerHTML = records.length ? records.map(serviceRecordRow).join("") : "";
  const empty = document.querySelector("[data-service-record-empty]");
  if (empty) empty.hidden = records.length > 0;
  if (status) {
    const filtered = Number(page.summary?.filtered ?? records.length);
    const monthText = serviceRecordsMonthFilter ? "本月" : "";
    status.textContent = serviceRecordsActiveFilter === "全部"
      ? `已显示${monthText || "全部"}服务记录 ${filtered} 条`
      : `已筛选${monthText}${serviceRecordsActiveFilter}记录 ${filtered} 条`;
  }
  if (!options.silent && window.lucide) window.lucide.createIcons();
  serviceRecordsLoading = false;
}

function activityImageFor(item, index = 0) {
  const image = apiText(item.image || item.cover || item.imageUrl);
  if (image) return image.replace(/^\/user\/assets\//, "");
  const fallback = [
    "ref/activity-record-taiji-ref.png",
    "ref/activity-record-lecture-ref.png",
    "ref/activity-record-drum-ref.png",
    "ref/activity-record-calligraphy-ref.png",
  ];
  return fallback[index % fallback.length];
}

function activityMapStatusColor(status = "", category = "") {
  if (/取消|下线|已满|截止/.test(status)) return "red";
  if (/进行中|已报名/.test(status)) return "green";
  if (/今日|即将/.test(status)) return "purple";
  if (/文化|讲座|学习/.test(category)) return "blue";
  if (/自然|观光/.test(category)) return "green";
  if (/娱乐|休闲/.test(category)) return "purple";
  return "orange";
}

function normalizeActivityMapEvent(item = {}, index = 0) {
  const fallback = activityMapEvents[index % Math.max(activityMapEvents.length, 1)] || {};
  const id = String(item.id || fallback.id || "");
  const title = String(item.title || item.name || fallback.title || "旅居活动");
  const category = String(item.category || fallback.category || "活动");
  const status = String(item.status || item.tag || fallback.status || "报名中");
  const joined = Number(item.participantCount ?? item.joined ?? item.joinedCount ?? item.signupCount ?? fallback.joined ?? 0);
  const quota = Number(item.quota ?? fallback.quota ?? 0);
  const lng = Number(item.lng ?? item.longitude ?? item.coordinates?.lng ?? item.position?.[0] ?? fallback.lng ?? fallback.position?.[0] ?? DEFAULT_CENTER[0]);
  const lat = Number(item.lat ?? item.latitude ?? item.coordinates?.lat ?? item.position?.[1] ?? fallback.lat ?? fallback.position?.[1] ?? DEFAULT_CENTER[1]);
  const image = item.image || item.cover || item.imageUrl || fallback.image || "activity-taiji.jpg";
  const place = String(item.place || item.location || fallback.place || fallback.location || "活动地点待定");
  return {
    ...fallback,
    ...item,
    id,
    title,
    category,
    status,
    statusColor: item.statusColor || item.color || fallback.statusColor || activityMapStatusColor(status, category),
    color: item.color || fallback.color || activityMapStatusColor(status, category),
    time: String(item.time || item.startTime || fallback.time || "时间待定"),
    place,
    location: place,
    distance: String(item.distance || item.card?.distance || fallback.distance || "附近"),
    people: item.people || (item.kind === "hospital" && item.phone ? `电话：${item.phone}` : `${Number.isFinite(joined) ? joined : 0}人报名`),
    image,
    joined: Number.isFinite(joined) ? joined : 0,
    quota: Number.isFinite(quota) ? quota : 0,
    availableSlots: Number(item.availableSlots ?? Math.max(0, (Number.isFinite(quota) ? quota : 0) - (Number.isFinite(joined) ? joined : 0))),
    userJoined: item.userJoined !== undefined ? Boolean(item.userJoined) : Boolean(fallback.userJoined),
    signupId: item.signupId !== undefined ? item.signupId : (fallback.signupId || ""),
    apiEndpoint: item.apiEndpoint || (id ? `/api/activities/${encodeURIComponent(id)}` : (fallback.apiEndpoint || "")),
    route: item.route === "" ? "" : (item.route || fallback.route || "activity-signup"),
    lng,
    lat,
    position: [lng, lat],
  };
}

function currentActivityMapEvents() {
  return activityMapApiPoints.length ? activityMapApiPoints : activityMapEvents;
}

function activityMapRecommendationEvents() {
  const source = activityMapRequirementsState?.nearbyRecommendations?.length
    ? activityMapRequirementsState.nearbyRecommendations
    : currentActivityMapEvents().filter((item) => item.status === "报名中").slice(0, 6);
  return (source.length ? source : currentActivityMapEvents()).slice(0, 6).map((item, index) => normalizeActivityMapEvent(item, index));
}

function activityMapCategoryRows() {
  const rows = Array.isArray(activityMapRequirementsState?.categories) && activityMapRequirementsState.categories.length
    ? activityMapRequirementsState.categories
    : activityMapCategories.map((category) => ({
      category,
      count: category === "全部" ? currentActivityMapEvents().length : currentActivityMapEvents().filter((item) => item.category === category).length,
      active: true,
    }));
  return rows;
}

function activityMapCategoryIcon(category, index = 0) {
  const matchedIndex = activityMapCategories.indexOf(category);
  return activityMapCategoryIcons[matchedIndex >= 0 ? matchedIndex : index % activityMapCategoryIcons.length] || "map-pin";
}

function syncActivityMapCategoryTabs(categories = activityMapCategoryRows()) {
  const countByCategory = new Map(categories.map((item) => [item.category, Number(item.count || 0)]));
  document.querySelectorAll("[data-activity-map-filter]").forEach((tab) => {
    const count = countByCategory.get(tab.dataset.activityMapFilter);
    if (Number.isFinite(count)) tab.dataset.apiCount = String(count);
  });
}

async function hydrateActivityRecordsFromApi() {
  const list = document.querySelector(".ref-activity-record-list");
  if (!list) return;
  const requestSeq = ++activityRecordRequestSeq;
  activityRecordLoading = true;
  const status = document.querySelector("[data-activity-record-status]");
  if (status) status.textContent = "正在加载活动报名记录...";
  const params = new URLSearchParams();
  if (activityRecordActiveFilter && activityRecordActiveFilter !== "全部") params.set("status", activityRecordActiveFilter);
  let page;
  try {
    page = await userApi(`/api/user/activity-records${params.toString() ? `?${params}` : ""}`);
  } catch (error) {
    if (requestSeq !== activityRecordRequestSeq) return;
    list.innerHTML = `<p class="empty">活动记录加载失败：${apiText(error.message, "请稍后重试")}</p><button class="btn blue" data-action="重新读取活动记录" type="button">重新加载</button>`;
    if (status) status.textContent = "活动记录加载失败";
    activityRecordLoading = false;
    return;
  }
  if (requestSeq !== activityRecordRequestSeq) return;
  activityRecordPageState = page;
  document.documentElement.dataset.yunlvActivityRecordsSource = page.sourceEndpoint || "/api/user/activity-records";
  const rows = (page.records || []).map((item, index) => activityRecord(
    apiText(item.title, "旅居活动"),
    apiText(item.time, "时间待定"),
    apiText(item.displayStatus || item.status, "待参加"),
    activityImageFor(item, index),
    apiText(item.category, "活动"),
    apiText(item.location, "活动地点待定"),
    apiText(item.distance, "附近"),
    apiText(item.peopleText, `${Number(item.participantCount || 0)}人已报名`),
    apiText(item.actions?.primary, "查看详情"),
    apiText(item.actions?.secondary, "查看详情"),
    item,
  ));
  list.innerHTML = rows.join("") || `<p class="empty">暂无${activityRecordActiveFilter === "全部" ? "" : activityRecordActiveFilter}活动报名记录。</p>`;
  const summary = page.summary || {};
  const statMap = {
    已报名: summary.signed ?? 0,
    待参加: summary.waiting ?? 0,
    已完成: summary.completed ?? 0,
    已取消: summary.cancelled ?? 0,
  };
  document.querySelectorAll("[data-activity-record-stat]").forEach((node) => {
    const value = node.querySelector("b");
    if (value) value.textContent = String(statMap[node.dataset.activityRecordStat] ?? 0);
  });
  const countByFilter = new Map((page.filters || []).map((item) => [item.key, Number(item.count || 0)]));
  document.querySelectorAll("[data-activity-record-filter]").forEach((tab) => {
    const active = tab.dataset.activityRecordFilter === activityRecordActiveFilter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
    const count = countByFilter.get(tab.dataset.activityRecordFilter);
    let counter = tab.querySelector("small");
    if (!counter && Number.isFinite(count)) {
      counter = document.createElement("small");
      tab.appendChild(counter);
    }
    if (counter && Number.isFinite(count)) counter.textContent = count;
  });
  if (status) {
    status.textContent = activityRecordActiveFilter === "全部"
      ? `已显示全部活动记录 ${Number(summary.filtered ?? (page.records || []).length)} 条`
      : `已筛选${activityRecordActiveFilter}活动记录 ${Number(summary.filtered ?? (page.records || []).length)} 条`;
  }
  activityRecordLoading = false;
}

function focusActivityRecordFilters(button) {
  const tabs = document.querySelector("[data-activity-record-tabs]");
  if (!tabs) return;
  tabs.classList.add("is-highlight");
  tabs.scrollIntoView({ behavior: "smooth", block: "nearest" });
  button?.setAttribute("aria-expanded", "true");
  window.setTimeout(() => {
    tabs.classList.remove("is-highlight");
    button?.setAttribute("aria-expanded", "false");
  }, 900);
}

function selectActivityFromRecord(button) {
  const source = button?.dataset?.activityId ? button : button?.closest?.("[data-activity-id]");
  const activityId = source?.dataset?.activityId;
  if (!activityId) return "";
  if (activityId !== selectedActivityId) selectedActivityDetail = null;
  selectedActivityId = activityId;
  localStorage.setItem(SELECTED_ACTIVITY_STORAGE_KEY, selectedActivityId);
  selectedActivitySnapshot = normalizeHomeActivity({
    id: activityId,
    title: source.dataset.activityTitle,
    time: source.dataset.activityTime,
    location: source.dataset.activityLocation,
    image: source.dataset.activityImage,
    tag: source.dataset.activityStatus,
    category: source.dataset.activityCategory,
  }, HOME_FALLBACK_ACTIVITIES[0]);
  return activityId;
}

async function handleActivityRecordsAction(button, actionName) {
  if (currentId() !== "activity-records") return false;
  const activityId = selectActivityFromRecord(button);
  const signupId = button.dataset.signupId || button.closest("[data-signup-id]")?.dataset.signupId || "";
  const title = button.dataset.activityTitle || button.closest("[data-activity-title]")?.dataset.activityTitle || "活动";
  if (actionName === "重新读取活动记录") {
    await hydrateActivityRecordsFromApi();
    return true;
  }
  if (actionName === "查看活动详情") {
    rememberScreenReturn("activity-signup", button);
    setRoute("activity-signup");
    return true;
  }
  if (actionName === "取消报名") {
    if (!activityId) return true;
    if (button.dataset.confirmCancel !== "true") {
      button.dataset.confirmCancel = "true";
      button.textContent = "确认取消";
      writeActionStatus(button, `再次点击确认取消「${title}」报名`);
      window.setTimeout(() => {
        if (button.isConnected && button.dataset.confirmCancel === "true") {
          delete button.dataset.confirmCancel;
          button.textContent = "取消报名";
        }
      }, 5000);
      return true;
    }
    button.disabled = true;
    try {
      await userApi(`/api/activities/${encodeURIComponent(activityId)}/cancel`, {
        method: "POST",
        body: { signupId, reason: "用户在活动报名记录页主动取消" },
      });
      activityRecordLoading = false;
      await hydrateActivityRecordsFromApi();
      showToast("活动报名已取消");
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `取消失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "重新报名") {
    if (!activityId) return true;
    button.disabled = true;
    try {
      const result = await userApi(`/api/activities/${encodeURIComponent(activityId)}/join`, {
        method: "POST",
        body: { source: "activity-records" },
      });
      selectedActivityDetail = result?.activity || selectedActivityDetail;
      activityRecordLoading = false;
      await hydrateActivityRecordsFromApi();
      showToast("已重新报名");
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `重新报名失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "去评价") {
    if (!activityId) return true;
    button.disabled = true;
    try {
      await userApi("/api/ui/actions", {
        method: "POST",
        body: {
          role: "user",
          route: "activity-records",
          action: "活动评价",
          payload: { activityId, signupId, title, rating: 5, content: "活动体验满意，已完成评价。" },
        },
      });
      button.textContent = "已评价";
      writeActionStatus(button, `已提交「${title}」活动评价`);
      showToast("评价已提交");
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `评价失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "扫码签到") {
    if (!activityId) return true;
    button.disabled = true;
    try {
      await userApi("/api/ui/actions", {
        method: "POST",
        body: {
          role: "user",
          route: "activity-records",
          action: "活动扫码签到",
          payload: { activityId, signupId, title, checkinAt: new Date().toISOString() },
        },
      });
      button.innerHTML = `${icon("check", 28)}<span>已签到</span>`;
      writeActionStatus(button, `已记录「${title}」活动签到`);
      if (window.lucide) window.lucide.createIcons();
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `签到失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "导航") {
    if (!activityId) return true;
    activityMapMode = "";
    activityMapSnapshotPoint = null;
    activityMapActiveFilter = button.dataset.activityCategory || "全部";
    activityMapFocusEventTitle = title;
    rememberScreenReturn("activity-map", button);
    setRoute("activity-map");
    return true;
  }
  return false;
}

async function hydrateActivityCalendarFromApi(routeId = "activity-calendar", options = {}) {
  if (!options.force && activityCalendarPageState && !activityCalendarPageState.error && activityCalendarPageState?.query?.category === activityCalendarActiveFilter) return;
  if (activityCalendarLoading && !options.force) return;
  const requestSeq = ++activityCalendarRequestSeq;
  activityCalendarLoading = true;
  const params = new URLSearchParams();
  if (activityCalendarActiveFilter && activityCalendarActiveFilter !== "全部") params.set("category", activityCalendarActiveFilter);
  const status = document.querySelector("[data-activity-calendar-status]");
  if (status && !options.silent) status.textContent = "正在加载活动日历...";
  try {
    const activities = await userApi(`/api/activities${params.toString() ? `?${params}` : ""}`);
    if (requestSeq !== activityCalendarRequestSeq) return;
    activityCalendarPageState = {
      activities: Array.isArray(activities) ? activities : [],
      sourceEndpoint: "/api/activities",
      query: { category: activityCalendarActiveFilter },
      updatedAt: formatRecentDataUpdateTime(),
    };
    activityCalendarSyncSelectionFromApi();
    document.documentElement.dataset.yunlvActivityCalendarSource = "/api/activities";
    document.documentElement.dataset.yunlvActivityCalendarFilter = activityCalendarActiveFilter;
    if (currentId() === routeId) render();
  } catch (error) {
    if (requestSeq !== activityCalendarRequestSeq) return;
    activityCalendarPageState = {
      activities: [],
      sourceEndpoint: "/api/activities",
      query: { category: activityCalendarActiveFilter },
      error: error.message,
      updatedAt: formatRecentDataUpdateTime(),
    };
    if (currentId() === routeId) render();
  } finally {
    if (requestSeq === activityCalendarRequestSeq) activityCalendarLoading = false;
  }
}

async function hydrateActivityMapFromApi() {
  if (activityMapMode === "hospital" || activityMapMode === "sos-snapshot") return;
  const row = document.querySelector(".ref-activity-row");
  if (!row) return;
  const filter = activityMapActiveFilter || "全部";
  const status = document.querySelector("[data-activity-map-status]");
  if (status) status.textContent = filter === "全部" ? "正在加载全部活动" : `正在筛选${filter}`;
  const [points, requirements] = await Promise.all([
    userApi(`/api/activities/map${filter === "全部" ? "" : `?category=${encodeURIComponent(filter)}`}`),
    userApi("/api/activities/map-requirements"),
  ]);
  activityMapRequirementsState = requirements || null;
  const visible = (points || []).map((item, index) => normalizeActivityMapEvent(item, index));
  const cards = visible.slice(0, 6);
  row.innerHTML = cards.map((item) => mapActivityCard(item)).join("") || `<p class="empty">当前分类暂无活动。</p>`;
  if (status) status.textContent = `${filter === "全部" ? "已显示全部" : `已筛选${filter}`} ${visible.length} 个活动 · 数据来自后台活动管理`;
  syncActivityMapCategoryTabs(requirements?.categories || []);
  if (Array.isArray(requirements.points)) {
    const fullPoints = requirements.points.map((item, index) => normalizeActivityMapEvent(item, index));
    activityMapApiPoints = fullPoints;
    activityMapEvents.splice(0, activityMapEvents.length, ...fullPoints);
    renderAmapMarkers();
    renderAmapUserMarker();
    applyActivityMapMarkerFilter(filter);
    if (amapMap) window.setTimeout(() => amapMap.resize?.(), 80);
  }
}

function renderOrderDetail() {
  const steps = [
    ["已下单", "05-26 09:15"],
    ["已接单", "05-26 09:25"],
    ["已出发", "05-26 13:20"],
    ["服务中", "进行中"],
    ["待确认", ""],
  ];
  return `
    <section class="card ref-order-status-card">
      <div class="ref-order-status-head">
        <span class="tile-icon green">${icon("briefcase-medical", 30)}</span>
        <div><h2>服务中 <span class="tag">陪伴就医</span></h2><p>服务单号：YL202605260018</p><p>预计完成时间：今日 17:00</p></div>
        <em>服务中</em>
      </div>
      <div class="ref-progress-steps">
        ${steps.map(([label, time], i) => `<span class="${i < 4 ? "done" : ""}"><i></i><b>${label}</b><small>${time}</small></span>`).join("")}
      </div>
    </section>
    <section class="card ref-guide-contact">
      <img src="${asset("avatar-daughter.jpg")}" alt="李晓彤">
      <div><h2>李晓彤 <span class="tag">服务中</span></h2><p>${icon("star", 14)} 4.9分　|　服务时长1280小时</p><div class="tag-row"><span class="tag">已实名</span><span class="tag blue">健康证</span><span class="tag">背景审核</span></div></div>
      <button data-action="电话联系" type="button">${icon("phone", 21)}电话</button>
      <button data-action="视频通话" type="button">${icon("video", 21)}视频</button>
      <button data-action="路线导航" type="button">${icon("navigation", 21)}导航</button>
    </section>
    ${section("服务信息", `
      <div class="card form-card ref-detail-fields">
        ${[
          ["clock", "服务时间", "今日 14:00 - 17:00", "#22c55e"],
          ["map-pin", "服务地点", "昆明市第一人民医院门诊楼", "#3b82f6"],
          ["user", "老人信息", "张建国（男，72岁）", "#f59e0b"],
          ["clipboard-list", "服务内容", "挂号取号、陪同就诊、取药提醒", "#8b5cf6"],
          ["triangle-alert", "注意事项", "高血压，行动稍慢", "#fb923c"],
        ].map(([iconName, label, value, color]) => `<div class="field ref-order-info-row" style="--row-color:${color}"><span>${icon(iconName, 15)}</span><b>${label}</b><strong>${value}</strong></div>`).join("")}
      </div>
    `)}
    <div class="map-card card ref-detail-map"><img src="${asset("map-main.jpg")}" alt="路线地图"><span class="map-pin">${icon("map-pin", 15)}李晓彤当前位置</span><button data-action="查看路线" type="button">查看路线 ${icon("chevron-right", 14)}</button></div>
    ${section("费用信息", `
      <div class="card ref-fee-info">
        <div><b>服务费用</b><strong>¥360</strong></div>
        <div><span>平台保障</span><em>${icon("shield-check", 15)}安全保障服务中</em></div>
        <div><span>保险已覆盖</span><em>${icon("umbrella", 15)}服务期间意外险已生效</em></div>
      </div>
    `)}
    <div class="ref-bottom-action two ref-detail-bottom"><button data-action="联系平台客服" type="button">${icon("headphones", 18)}联系平台客服</button><button class="primary" data-route="review" type="button">确认完成</button></div>
  `;
}

function renderReview() {
  return `
    <section class="card ref-review-complete">
      <div class="ref-review-complete-head">
        <span class="tile-icon green">${icon("check", 34)}</span>
        <div><h2>服务已完成</h2><p>感谢您的信任与支持！</p></div>
        <img src="${asset("assistant-robot.jpg")}" alt="小云机器人">
      </div>
      <div class="ref-review-order">
        <img src="${asset("destination-dali.jpg")}" alt="旅居服务">
        <div><h3>导游游览 · 弥勒湖泉半日游</h3><p>${icon("clipboard-list", 13)} 订单号：FW202505200015</p><p>${icon("clock", 13)} 服务时间：05/26 09:00-12:00</p></div>
        <div class="ref-review-guide"><img src="${asset("avatar-son.jpg")}" alt="张志远"><b>张志远</b><span class="tag">优选向导</span></div>
      </div>
    </section>
    <section class="card ref-review-rating">
      <h2>请为本次服务打分</h2>
      <div class="star-row">${Array.from({ length: 5 }).map((_, index) => `<button class="active" data-action="设置评分" data-rating="${index + 1}" type="button" aria-label="${index + 1}星">${icon("star", 36)}<span class="ref-audit-inline">${index + 1}星</span></button>`).join("")}</div>
      <p>点击星星进行评价</p>
    </section>
    <section class="section card form-card ref-review-form">
      <h3>您认为本次服务的优点是？</h3>
      <div class="tag-row"><button class="tag active" data-action="切换评价优点" type="button">${icon("shield-check", 13)}专业可靠</button><button class="tag active" data-action="切换评价优点" type="button">${icon("clock", 13)}准时到达</button><button class="tag active" data-action="切换评价优点" type="button">${icon("book-open", 13)}讲解清楚</button><button class="tag active" data-action="切换评价优点" type="button">${icon("heart", 13)}耐心贴心</button><button class="tag" data-action="切换评价优点" type="button">${icon("map-pin", 13)}路线合理</button><button class="tag muted" data-action="切换评价优点" type="button">${icon("message-circle", 13)}需要改进</button></div>
      <h3>写下您的旅居感受 <small>（选填）</small></h3>
      <div class="textarea">导游服务非常细致，路线安排合理，老人玩得很开心...</div>
      <h3>上传照片 <small>（选填）</small></h3>
      <p class="ref-upload-note">最多上传3张，分享美好瞬间</p>
      <div class="ref-upload-row"><button data-action="上传照片" type="button">${icon("camera", 23)}上传照片</button><button data-action="上传照片" type="button">${icon("image", 23)}上传照片</button><button data-action="上传照片" type="button">${icon("camera", 23)}上传照片</button></div>
      <button class="ref-anonymous" data-action="切换匿名评价" type="button" aria-pressed="false"><span>${icon("eye-off", 17)}匿名评价</span><span class="switch"></span></button>
      <p class="ref-agree">${icon("shield-check", 14)}评价提交后将同步平台服务质量记录</p>
      <p class="ref-review-submit-state" data-review-submit-state>评价待提交：已选择服务评分与优点</p>
    </section>
    <div class="ref-bottom-action two ref-review-bottom"><button data-route="orders" type="button">稍后再说</button><button class="primary" data-action="提交评价" type="button">提交评价</button></div>
  `;
}

async function handleReviewAction(button, actionName) {
  if (currentId() !== "review") return false;
  if (actionName === "设置评分") {
    const rating = Number(button.dataset.rating || 5);
    document.querySelectorAll(".ref-review-rating .star-row button").forEach((star) => {
      star.classList.toggle("active", Number(star.dataset.rating || 0) <= rating);
      star.setAttribute("aria-pressed", Number(star.dataset.rating || 0) <= rating ? "true" : "false");
    });
    const hint = document.querySelector(".ref-review-rating p");
    if (hint) hint.textContent = `当前评分 ${rating} 星`;
    return true;
  }
  if (actionName === "切换评价优点") {
    button.classList.toggle("active");
    button.classList.remove("muted");
    button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
    return true;
  }
  if (actionName === "切换匿名评价") {
    const active = button.getAttribute("aria-pressed") !== "true";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.querySelector(".switch")?.classList.toggle("on", active);
    button.dataset.anonymous = active ? "true" : "false";
    const agree = document.querySelector(".ref-agree");
    if (agree) agree.innerHTML = `${icon("shield-check", 14)}${active ? "将以匿名方式提交评价" : "评价提交后将同步平台服务质量记录"}`;
    return true;
  }
  if (actionName === "提交评价") {
    const rating = [...document.querySelectorAll(".ref-review-rating .star-row button.active")].length || 5;
    const tags = [...document.querySelectorAll(".ref-review-form .tag.active")].map((item) => item.textContent.trim());
    const review = document.querySelector(".ref-review-form .textarea")?.textContent?.trim() || "服务及时细致，已确认完成。";
    const submitState = document.querySelector("[data-review-submit-state]");
    button.dataset.reviewSubmit = "pending";
    button.setAttribute("aria-busy", "true");
    if (submitState) submitState.textContent = `评价提交中：${rating}星 · ${tags.length} 个优点已选择`;
    try {
      const request = window.YunlvBusiness?.request;
      if (!request) throw new Error("服务暂未初始化，请刷新后重试");
      const orders = await request("/api/orders", {}, "elder");
      const selectedOrderId = localStorage.getItem("yunlv-selected-order");
      const target = orders.find((order) => order.id === selectedOrderId || order.orderNo === selectedOrderId)
        || orders.find((order) => order.status === "待确认")
        || orders.find((order) => order.status === "服务中" || order.status === "已完成")
        || orders[0];
      if (!target?.id) throw new Error("暂无可评价订单");
      const confirmed = await request(`/api/orders/${target.id}/confirm`, {
        method: "POST",
        body: { rating, review, tags },
      }, "elder");
      localStorage.setItem("yunlv-selected-order", confirmed.id || target.id);
      button.dataset.reviewSubmit = "done";
      button.setAttribute("aria-busy", "false");
      if (submitState) submitState.textContent = `评价已提交：订单 ${confirmed.orderNo || target.orderNo || ""} 已完成`;
      writeActionStatus(button, `评价已提交，订单 ${confirmed.orderNo || target.orderNo || ""} 已完成`);
      showToast("评价已提交");
      setRoute("orders");
    } catch (error) {
      button.dataset.reviewSubmit = "error";
      button.setAttribute("aria-busy", "false");
      if (submitState) submitState.textContent = `评价提交失败：${error.message}`;
      writeActionStatus(button, `评价提交失败：${error.message}`);
      showToast(`评价提交失败：${error.message}`);
    }
    return true;
  }
  return false;
}

function renderServiceRecords() {
  const page = serviceRecordsPageState || {};
  const records = Array.isArray(page.records) ? page.records : [];
  const summary = page.summary || {};
  const hasLoaded = Boolean(page.sourceEndpoint);
  return `
    <div class="ref-record-hero"><img src="${asset("records-hero.jpg")}" alt="小云服务足迹"><div><h2>小云服务足迹</h2><p>贴心陪伴 · 专业服务 · 智慧旅居</p></div><span>${icon("bot", 38)}</span></div>
    <div class="card ref-record-stats">
      ${serviceRecordStatsHtml(summary)}
    </div>
    <div class="chips ref-record-tabs">${serviceRecordFiltersHtml(page.filters || [], serviceRecordsActiveFilter)}</div>
    <p class="action-status ref-record-current" data-service-record-status>${hasLoaded ? `已显示服务记录 ${Number(summary.filtered ?? records.length)} 条` : "正在加载服务记录..."}</p>
    <div class="ref-record-filter"><label>${icon("search", 16)}<input data-service-record-search type="search" value="${attr(serviceRecordsSearchQuery)}" placeholder="搜索服务记录" aria-label="搜索服务记录"></label><button data-action="搜索服务记录" class="ref-record-search-btn" type="button">搜索</button><button data-action="本月筛选" type="button" aria-pressed="${serviceRecordsMonthFilter ? "true" : "false"}">${icon("calendar", 16)}${serviceRecordsMonthFilter ? "查看全部" : "本月"}</button></div>
    <div class="timeline ref-service-timeline">
      ${records.length ? records.map(serviceRecordRow).join("") : hasLoaded ? "" : `<p class="empty">正在加载服务记录...</p>`}
    </div>
    <p class="ref-record-empty" data-service-record-empty${hasLoaded && !records.length ? "" : " hidden"}>${icon("clipboard-list", 22)}暂无服务记录</p>
    <div class="ref-assistant-fixed"><img src="${asset("assistant-robot.jpg")}" alt="小云"><span>继续问小云</span><button data-route="assistant" type="button">${icon("mic", 17)}点击提问</button></div>
  `;
}

function filterServiceRecords(filter = "全部", silent = false) {
  serviceRecordsActiveFilter = filter || "全部";
  const tabs = [...document.querySelectorAll("[data-service-record-filter]")];
  tabs.forEach((tab) => {
    const active = tab.dataset.serviceRecordFilter === serviceRecordsActiveFilter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const rows = [...document.querySelectorAll("[data-service-record-type]")];
  const empty = document.querySelector("[data-service-record-empty]");
  let visibleCount = 0;
  rows.forEach((row) => {
    const visible = serviceRecordsActiveFilter === "全部" || row.dataset.serviceRecordType === serviceRecordsActiveFilter;
    row.hidden = !visible;
    row.classList.toggle("is-filtered-out", !visible);
    if (visible) visibleCount += 1;
  });

  const status = document.querySelector("[data-service-record-status]");
  if (status) {
    status.textContent = serviceRecordsActiveFilter === "全部"
      ? `已显示全部 ${visibleCount} 条服务记录`
      : `已筛选${serviceRecordsActiveFilter}记录 ${visibleCount} 条`;
  }
  if (empty) empty.hidden = visibleCount > 0;
  if (!silent) showToast(serviceRecordsActiveFilter === "全部" ? "已显示全部服务记录" : `已筛选${serviceRecordsActiveFilter}记录`);
}

async function handleServiceRecordsAction(button, actionName) {
  if (currentId() !== "service-records") return false;
  if (actionName === "重新读取服务记录") {
    await hydrateServiceRecordsFromApi({ force: true });
    return true;
  }
  if (actionName === "搜索服务记录") {
    const input = document.querySelector("[data-service-record-search]");
    serviceRecordsSearchQuery = input?.value?.trim?.() || "";
    await hydrateServiceRecordsFromApi({ force: true, silent: true });
    return true;
  }
  if (actionName === "本月筛选") {
    serviceRecordsMonthFilter = serviceRecordsMonthFilter ? "" : new Date().toISOString().slice(0, 7);
    render();
    await hydrateServiceRecordsFromApi({ force: true });
    return true;
  }
  const row = button.closest("[data-service-record-id]");
  const recordId = row?.dataset.serviceRecordId || "";
  if (!row || !recordId) return false;
  if (actionName === "删除服务记录") {
    if (button.dataset.confirmDelete !== "true") {
      button.dataset.confirmDelete = "true";
      button.textContent = "确认删除";
      writeActionStatus(button, "再次点击确认删除该服务记录");
      window.setTimeout(() => {
        if (button.isConnected && button.dataset.confirmDelete === "true") {
          delete button.dataset.confirmDelete;
          button.textContent = "删除";
        }
      }, 5000);
      return true;
    }
    button.disabled = true;
    try {
      await userApi(`/api/user/service-records/${encodeURIComponent(recordId)}`, { method: "DELETE" });
      await hydrateServiceRecordsFromApi({ force: true });
      showToast("服务记录已删除");
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `删除失败：${error.message}`);
    }
    return true;
  }
  if (actionName !== "查看详情") return false;
  button.disabled = true;
  let record = null;
  try {
    const detail = await userApi(`/api/user/service-records/${encodeURIComponent(recordId)}/detail`, {
      method: "POST",
      body: { source: "user-service-records" },
    });
    record = detail.record;
  } catch (error) {
    button.disabled = false;
    writeActionStatus(button, `详情加载失败：${error.message}`);
    return true;
  }
  button.disabled = false;
  document.querySelectorAll("[data-service-record-detail-panel]").forEach((panel) => panel.remove());
  document.querySelectorAll(".ref-service-timeline .timeline-item").forEach((item) => {
    item.classList.toggle("active", item === row);
  });
  row.classList.add("is-read");
  const panel = document.createElement("section");
  panel.className = "card ref-service-record-detail";
  panel.dataset.serviceRecordDetailPanel = "";
  const tag = record?.type || row.dataset.serviceRecordType || "服务记录";
  const title = record?.title || row.dataset.serviceTitle || "服务记录详情";
  const text = record?.detail || record?.text || row.dataset.serviceText || "暂无详情";
  const time = apiTime(record?.time || record?.createdAt) || row.dataset.serviceTime || "刚刚";
  panel.innerHTML = `
    <div class="section-head">
      <h2>${attr(title)}</h2>
      <button data-action="收起服务记录详情" type="button">收起 ${icon("chevron-up", 14)}</button>
    </div>
    <div class="ref-service-record-detail-body">
      <span>${icon("tag", 15)}${attr(tag)}</span>
      <span>${icon("clock", 15)}${attr(time)}</span>
      <span>${icon("database", 15)}${friendlyServiceRecordSource(record?.sourceType || row.dataset.serviceSourceType)}</span>
      <p>${attr(text)}</p>
    </div>
    ${actionStatusHtml("服务记录详情已加载")}
  `;
  row.after(panel);
  panel.querySelector('[data-action="收起服务记录详情"]')?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    panel.remove();
    row.classList.remove("active");
  }, { once: true });
  if (window.lucide) window.lucide.createIcons();
  return true;
}

async function clearServiceRecords(button) {
  if (button.dataset.confirmClear !== "true") {
    button.dataset.confirmClear = "true";
    button.textContent = "确认清空";
    writeActionStatus(button, "再次点击确认清空当前账号服务记录");
    window.setTimeout(() => {
      if (button.isConnected && button.dataset.confirmClear === "true") {
        delete button.dataset.confirmClear;
        button.textContent = "清空";
      }
    }, 5000);
    return;
  }
  button.disabled = true;
  try {
    await userApi("/api/user/service-records/clear", {
      method: "POST",
      body: { source: "user-service-records" },
    });
    serviceRecordsActiveFilter = "全部";
    serviceRecordsMonthFilter = "";
    serviceRecordsCleared = true;
    await hydrateServiceRecordsFromApi({ force: true });
    button.classList.add("is-done");
    button.dataset.state = "清空成功";
    showToast("清空成功");
  } catch (error) {
    button.disabled = false;
    writeActionStatus(button, `清空失败：${error.message}`);
  }
}

function openActivitySignupForm(button) {
  const panel = document.querySelector("[data-activity-signup-form]");
  if (!panel) return;
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
  const input = panel.querySelector("[data-signup-name]");
  input?.focus();
  writeActionStatus(panel, "请填写报名人信息后提交");
}

async function submitActivitySignupForm(button) {
  const panel = document.querySelector("[data-activity-signup-form]");
  if (!panel) return;
  const activity = activeActivityData();
  const activityId = activity.id || selectedActivityId || HOME_FALLBACK_ACTIVITIES[0].id;
  const name = panel.querySelector("[data-signup-name]")?.value.trim();
  const gender = panel.querySelector("[data-signup-gender]")?.value.trim();
  const age = Number(panel.querySelector("[data-signup-age]")?.value || 0);
  const phone = panel.querySelector("[data-signup-phone]")?.value.trim();
  const count = Number(panel.querySelector("[data-signup-count]")?.value || 1);
  if (!name || !gender || !Number.isFinite(age) || age < 1 || age > 120 || !/^1\d{10}$/.test(phone || "") || count < 1) {
    writeActionStatus(panel, "请填写姓名、性别、年龄、正确手机号和报名人数");
    showToast("请完善报名信息");
    return;
  }
  button.disabled = true;
  try {
    const result = await window.YunlvBusiness?.request?.(`/api/activities/${encodeURIComponent(activityId)}/join`, {
      method: "POST",
      body: { name, gender, age, phone, count },
    }, "elder");
    await window.YunlvBusiness?.request?.("/api/ui/actions", {
      method: "POST",
      body: {
        role: "user",
        route: "activity-signup",
        action: "提交活动报名资料",
        payload: { name, gender, age, phone, count, activityId, title: activity.title },
      },
    }, "elder");
    selectedActivityDetail = result?.activity || selectedActivityDetail;
    const title = result?.activity?.title || activity.title || "活动报名";
    panel.classList.add("is-submitted");
    writeActionStatus(panel, `${name}（${gender}，${age}岁）已成功报名「${title}」，报名人数 ${count} 人`);
    button.textContent = "报名成功";
    showToast("报名成功");
  } catch (error) {
    writeActionStatus(panel, `报名失败：${error.message}`);
    showToast(`报名失败：${error.message}`);
    button.disabled = false;
  }
}

function activitySignupShareData() {
  const activity = activeActivityData();
  const url = `${window.location.origin}${window.location.pathname}#activity-signup`;
  return {
    title: activity.title || "活动报名",
    text: `${activity.time || "活动时间待确认"}，在${activity.location || "活动地点待确认"}参加${activity.category || "旅居"}活动。`,
    url,
    activityId: activity.id,
  };
}

function openActivitySharePanel(button, shareData, statusText = "") {
  const panel = ensureLivePanel("activity-share", document.querySelector(".ref-activity-detail") || button);
  const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
  const smsHref = `sms:?&body=${encodeURIComponent(text)}`;
  renderLivePanel(panel, "分享活动", `
    <p>${attr(shareData.text)}</p>
    <label><span>分享链接</span><input readonly value="${attr(shareData.url)}"></label>
    <div class="ref-profile-help">
      <button data-action="复制活动分享链接" data-local-action="true" type="button">${icon("copy", 16)}复制链接</button>
      <a class="btn blue" href="${attr(smsHref)}">${icon("message-circle", 15)}短信发送</a>
    </div>
  `, statusText || "活动分享链接面板已展开");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function shareActivitySignup(button) {
  const scope = document.querySelector(".ref-activity-detail") || document.querySelector(".screen-activity-signup") || button;
  const shareData = activitySignupShareData();
  const fallbackText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
  openActivitySharePanel(button, shareData, "分享菜单已展开，可复制链接或短信发送");
  const recordShare = () => window.YunlvBusiness?.request?.("/api/ui/actions", {
    method: "POST",
    body: {
      role: "user",
      route: "activity-signup",
      action: "分享活动",
      payload: { activityId: shareData.activityId, title: shareData.title, url: shareData.url },
    },
  }, "elder").catch(() => {});
  const copyFallback = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fallbackText);
        openActivitySharePanel(button, shareData, "活动分享链接已复制，可发送给家人或朋友");
        showToast("分享链接已复制");
        return;
      }
    } catch (error) {
      // Browser share/clipboard permissions vary across app webviews; showing the link keeps the action usable.
    }
    openActivitySharePanel(button, shareData, "当前浏览器未开放系统分享，请复制链接或短信发送");
    showToast("分享链接面板已展开");
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      writeActionStatus(document.querySelector("[data-live-panel='activity-share']") || scope, "活动分享面板已调起");
      showToast("分享已发起");
    } else {
      await copyFallback();
    }
    await recordShare();
  } catch (error) {
    if (error?.name === "AbortError") {
      writeActionStatus(scope, "已取消分享");
    } else {
      openActivitySharePanel(button, shareData, "当前浏览器未开放系统分享，请复制链接或短信发送");
      showToast("分享链接面板已展开");
    }
  }
}

function openActivityConsult(button) {
  const activity = activeActivityData();
  assistantCurrentQuestion = `我想咨询${activity.title}活动的报名、集合地点和注意事项。`;
  assistantBackendAnswer = "可以，我可以帮您确认活动时间、集合地点、报名人数、天气和出行建议。";
  assistantAnswerRevision = 0;
  resetAssistantFeedback();
  writeActionStatus(document.querySelector(".ref-activity-detail") || button, "正在进入活动咨询，可继续询问报名、集合和交通安排");
  showToast("正在打开活动咨询");
  rememberScreenReturn("assistant", button);
  setRoute("assistant");
}

function openActivityNavigation(button) {
  const activity = activeActivityData();
  activityMapMode = "";
  activityMapSnapshotPoint = null;
  activityMapActiveFilter = activity.category || "全部";
  activityMapFocusEventTitle = activity.title || "";
  writeActionStatus(document.querySelector(".ref-activity-detail") || button, `正在进入活动地图，定位${activity.title || "当前活动"}`);
  rememberScreenReturn("activity-map", button);
  setRoute("activity-map");
}

function normalizeAmapPoint(point) {
  if (Array.isArray(point) && point.length >= 2) {
    const [lng, lat] = point.map(Number);
    return Number.isFinite(lng) && Number.isFinite(lat) ? { lng, lat } : null;
  }
  if (point && typeof point === "object") {
    const lng = Number(point.lng ?? point.longitude);
    const lat = Number(point.lat ?? point.latitude);
    return Number.isFinite(lng) && Number.isFinite(lat) ? { lng, lat } : null;
  }
  return null;
}

function withTimeout(promise, ms, fallback = null) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise
      .then((value) => resolve(value))
      .catch(() => resolve(fallback))
      .finally(() => clearTimeout(timer));
  });
}

async function openRouteNavigation(button, destination = "附近医院", options = {}) {
  const dest = String(destination || "").trim();
  if (!dest || dest === "目的地") {
    writeActionStatus(button.closest(".ref-transport-search") || button, "请先输入目的地，再规划路线");
    document.querySelector("[data-transport-destination]")?.focus();
    return;
  }
  const city = currentCity && currentCity !== "定位中" ? currentCity : DEFAULT_CITY;
  const origin = transportOriginText();
  const label = String(options.label || dest).trim();
  writeActionStatus(button.closest(".ref-transport-search") || button.closest(".content") || button, `正在打开高德地图导航：${origin} → ${label}`);
  const knownPoint = normalizeAmapPoint(options.point);
  const point = knownPoint || (options.skipGeocode ? null : await withTimeout(geocodeAmapDestination(dest, city), 1200));
  const from = Array.isArray(currentLocation) ? `from=${encodeURIComponent(`${currentLocation[0]},${currentLocation[1]},${origin}`)}&` : "";
  const url = point
    ? `https://uri.amap.com/navigation?${from}to=${encodeURIComponent(`${point.lng},${point.lat},${label}`)}&mode=car&policy=1&src=${encodeURIComponent("云旅无忧")}&coordinate=gaode&callnative=1`
    : `https://www.amap.com/dir?from%5Bname%5D=${encodeURIComponent(origin)}&to%5Bname%5D=${encodeURIComponent(`${city}${dest}`)}&type=car`;
  const panel = ensureLivePanel("route-navigation", button.closest(".section, .card") || button);
  renderLivePanel(panel, "高德导航", `
    <div class="ref-profile-rights">
      <span>${icon("map-pin", 16)}出发地：${attr(origin)}</span>
      <span>${icon("navigation", 16)}目的地：${attr(label)}</span>
      <span>${icon("shield-check", 16)}已生成高德导航链接，当前 H5 页面会保留</span>
    </div>
    <div class="ref-profile-help">
      <a class="btn blue" href="${attr(url)}" target="_blank" rel="noopener noreferrer">${icon("navigation", 16)}打开高德导航</a>
      <button data-route="guide" type="button">${icon("headphones", 16)}联系向导接送</button>
    </div>
  `, `正在打开高德地图导航：${origin} → ${label}`);
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) writeActionStatus(panel, "浏览器拦截自动打开，请点击“打开高德导航”");
  return url;
}

async function geocodeAmapDestination(destination, city) {
  const response = await fetch(`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(AMAP_KEY)}&address=${encodeURIComponent(destination)}&city=${encodeURIComponent(city)}`);
  if (!response.ok) throw new Error("amap geocode failed");
  const data = await response.json();
  const location = data?.geocodes?.[0]?.location;
  if (!location) return null;
  const [lng, lat] = location.split(",");
  if (!lng || !lat) return null;
  return { lng, lat };
}

function openEmergencyHospitalMap(button) {
  activityMapMode = "hospital";
  activityMapSnapshotPoint = null;
  activityMapActiveFilter = "全部";
  activityMapFocusEventTitle = "附近医院";
  writeActionStatus(button.closest(".content") || button, "正在打开地图并定位附近医院");
  rememberScreenReturn("activity-map", button);
  setRoute("activity-map");
}

function openSosSnapshotMap(button) {
  const record = getSosRecordData(button);
  activityMapMode = "sos-snapshot";
  activityMapActiveFilter = "全部";
  activityMapFocusEventTitle = record.title;
  const lng = Number(button.dataset.lng || 103.4052);
  const lat = Number(button.dataset.lat || 24.4214);
  activityMapSnapshotPoint = {
    image: "map-main.jpg",
    title: record.title,
    time: record.time,
    place: record.address,
    distance: "求助位置",
    color: record.color || "red",
    category: "求助位置",
    position: [lng, lat],
    kind: "sos",
    status: record.status,
  };
  setRoute("activity-map");
}

function openHumanServicePanel(button) {
  const panel = ensureLivePanel("human-service", button.closest(".section") || button);
  renderLivePanel(panel, "真人客服", `
    <div class="ref-human-service-card">
      <span>${icon("headphones", 26)}</span>
      <div>
        <b>真人客服专席</b>
        <p>当前已为您接入平台安全客服，紧急情况可直接拨打电话，由真人协助联系医院、家属或平台值班人员。</p>
        <small>${icon("clock", 13)}7×24小时值守　${icon("phone", 13)}400-888-XXXX</small>
      </div>
      <button class="btn" data-action="拨打客服" type="button">${icon("phone", 15)}拨打客服</button>
    </div>
  `, "真人客服专席已接入当前页面");
}

function addActivityToCalendar(button) {
  const scope = document.querySelector(".ref-activity-detail") || button;
  const activity = activeActivityData();
  window.YunlvBusiness?.request?.("/api/ui/actions", {
    method: "POST",
    body: {
      role: "user",
      route: "activity-signup",
      action: "加入活动日历",
      payload: { activityId: activity.id, title: activity.title, time: activity.time, remindBeforeMinutes: 30 },
    },
  }, "elder").catch(() => {});
  writeActionStatus(scope, `已加入「${activity.title}」活动日历，活动开始前30分钟提醒`);
  button.classList.add("is-done");
  button.setAttribute("aria-pressed", "true");
}

function handleActivitySignupAction(button, actionName) {
  if (currentId() !== "activity-signup") return false;
  if (actionName === "分享" || actionName === "分享活动") {
    shareActivitySignup(button);
    return true;
  }
  if (actionName === "复制活动分享链接") {
    const shareData = activitySignupShareData();
    const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    const copyPromise = navigator.clipboard?.writeText
      ? navigator.clipboard.writeText(text)
      : Promise.reject(new Error("clipboard unavailable"));
    copyPromise
      .then(() => {
        writeActionStatus(document.querySelector("[data-live-panel='activity-share']") || button, "活动分享链接已复制");
        showToast("分享链接已复制");
      })
      .catch(() => openActivitySharePanel(button, shareData, "请长按链接复制或使用短信发送"));
    return true;
  }
  if (actionName === "咨询" || actionName === "咨询活动") {
    openActivityConsult(button);
    return true;
  }
  if (actionName === "导航" || actionName === "活动导航") {
    openActivityNavigation(button);
    return true;
  }
  if (actionName === "加入日历") {
    addActivityToCalendar(button);
    return true;
  }
  return false;
}

function renderActivitySignup() {
  const backRoute = screenBackRoute(routeMap["activity-signup"]);
  const activity = activeActivityData();
  const joined = Number(activity.joined || 0);
  const quota = Number(activity.quota || 0);
  const available = Number.isFinite(Number(activity.availableSlots)) ? Number(activity.availableSlots) : Math.max(0, quota - joined);
  const displayTime = String(activity.time || "时间待确认").replace(/^2026-/, "").replace(/^2025-/, "").replace("T", " ").slice(0, 16);
  const joinedText = quota ? `${joined}/${quota}人` : `${joined}人`;
  const maxCount = Math.max(1, Math.min(4, available || 4));
  const canJoin = activity.userJoined || !quota || available > 0;
  const mainActionText = activity.userJoined ? "更新报名" : canJoin ? "立即报名" : "名额已满";
  const statusTag = activity.status || activity.tag || "报名中";
  const activityTags = [activity.category, statusTag, activity.userJoined ? "已报名" : "", available > 0 ? `剩余${available}个名额` : ""].filter(Boolean);
  const activityDesc = activity.description || `「${activity.title}」由平台活动中心更新，用户可查看活动时间、地点、报名人数并提交报名。`;
  return `
    <section class="ref-activity-immersive">
      <img src="${userAssetSrc(activity.image, "activity-signup-hero-live.jpg")}" alt="${attr(activity.title)}">
      ${statusBar()}
      <div class="ref-activity-hero-bar">
        <button class="ref-activity-back" data-route="${backRoute}" type="button" aria-label="返回">${icon("chevron-left", 28)}</button>
        <h1>活动报名</h1>
        <button class="ref-activity-share" data-action="分享活动" type="button" aria-label="分享">${icon("share-2", 28)}</button>
      </div>
      <button class="ref-activity-map-pill" data-action="活动导航" type="button">${icon("map-pin", 18)}活动地图</button>
    </section>
    <section class="section card form-card ref-activity-detail" data-activity-id="${attr(activity.id)}"${homeEndpointAttr(activity)}>
      <div class="section-head">
        <h2 class="ref-activity-title" style="margin:0">${attr(activity.title)} <span class="tag">${attr(activity.category)}</span></h2>
        <div class="ref-favorite-box"><button class="btn ghost" data-action="收藏" type="button">${icon("heart", 16)}收藏</button><small>${joined}人</small></div>
      </div>
      <div class="ref-meta-line">${icon("clock", 17)}${attr(displayTime)} <span></span>${icon("users", 17)}${attr(joinedText)}</div>
      <div class="ref-meta-line">${icon("map-pin", 17)}${attr(activity.location || "地点待确认")}<button class="btn ghost" data-action="导航" type="button">${icon("navigation", 15)}导航</button></div>
      <div class="tag-row">${activityTags.map((tag, index) => `<span class="tag ${index % 2 ? "blue" : ""}">${attr(tag)}</span>`).join("")}</div>
      <div class="ref-desc-with-img">
        <p>${attr(activityDesc)}</p>
        <img src="${userAssetSrc(activity.image, "activity-taiji.jpg")}" alt="${attr(activity.title)}">
      </div>
    </section>
    ${section("活动详情", `
      <div class="card ref-info-grid">
        ${[
          ["clock", "活动时间", displayTime],
          ["calendar-check", "活动状态", statusTag],
          ["users", "报名人数", joinedText],
          ["badge-dollar-sign", "活动费用", "免费"],
        ].map(([iconName, label, value]) => `<div>${icon(iconName, 20)}<span>${label}</span><strong>${attr(value)}</strong></div>`).join("")}
      </div>
    `, `<button data-action="查看全部活动详情" type="button">查看全部 ${icon("chevron-right", 16)}</button>`)}
    ${section("活动流程", `
      <div class="card ref-flow-line">
        ${["集合签到", "活动说明", "现场参与", "互动交流", "结束提醒"].map((item) => `<span>${item}</span>`).join("")}
      </div>
    `)}
    <div class="card ref-warm-tips">
      <div>
        <h2>温馨提示</h2>
        <ul>
          <li>建议穿着运动鞋、宽松衣物，携带水壶、防晒用品；</li>
          <li>如遇雨天，活动将延期，具体时间另行通知。</li>
        </ul>
      </div>
      <img src="${asset("ref/activity-signup-tips-ref.png")}" alt="温馨提示">
    </div>
    <section class="section card ref-activity-signup-form" data-activity-signup-form data-activity-id="${attr(activity.id)}" hidden>
      <div class="section-head"><h2>报名信息</h2><span class="meta">用于活动签到和紧急联系</span></div>
      <div class="ref-activity-signup-fields">
        <label class="wide"><span>报名人姓名</span><input data-signup-name type="text" value="李秀兰" placeholder="请输入姓名"></label>
        <label><span>性别</span><select data-signup-gender aria-label="性别"><option value="女" selected>女</option><option value="男">男</option></select></label>
        <label><span>年龄</span><input data-signup-age type="number" min="1" max="120" value="72" placeholder="请输入年龄"></label>
        <label class="wide"><span>联系电话</span><input data-signup-phone type="tel" value="13800005678" placeholder="请输入手机号"></label>
        <label class="wide"><span>报名人数</span><input data-signup-count type="number" min="1" max="${maxCount}" value="1"></label>
      </div>
      <button class="btn blue block" data-action="提交活动报名" type="button">${icon("calendar-check", 15)}提交报名</button>
    </section>
    <div class="ref-bottom-action ref-activity-bottom-action">
      <div class="ref-activity-secondary-actions">
        <button data-action="咨询活动" type="button">${icon("message-circle", 18)}咨询</button>
        <button data-action="分享活动" type="button">${icon("share-2", 18)}分享</button>
        <button data-action="加入日历" type="button">${icon("calendar-check", 18)}加入日历</button>
      </div>
      <button class="primary" data-action="打开活动报名表" type="button" ${canJoin ? "" : "disabled"}>${mainActionText}</button>
    </div>
  `;
}

function renderActivityRecords() {
  const summary = activityRecordPageState?.summary || {};
  const statRows = [
    ["clipboard-check", "已报名", String(summary.signed ?? 0), "green"],
    ["clock", "待参加", String(summary.waiting ?? 0), "orange"],
    ["circle-check", "已完成", String(summary.completed ?? 0), "blue"],
    ["circle-x", "已取消", String(summary.cancelled ?? 0), "purple"],
  ];
  const filters = activityRecordPageState?.filters?.length
    ? activityRecordPageState.filters
    : ["全部", "待参加", "已完成", "已取消"].map((key) => ({ key, count: key === "全部" ? Number(summary.total || 0) : 0 }));
  return `
    <div class="card ref-activity-record-stats">
      ${statRows.map(([iconName, label, num, color]) => `<div data-activity-record-stat="${attr(label)}"><span class="tile-icon ${color}">${icon(iconName, 20)}</span><b>${num}</b><small>${label}</small></div>`).join("")}
    </div>
    <div class="chips ref-record-tabs" data-activity-record-tabs>${filters.map(({ key, count }) => `<button class="chip ${key === activityRecordActiveFilter ? "active" : ""}" data-activity-record-filter="${attr(key)}" data-action="筛选活动记录" type="button" aria-pressed="${key === activityRecordActiveFilter ? "true" : "false"}">${key}<small>${Number(count || 0)}</small></button>`).join("")}</div>
    <p class="action-status ref-activity-record-current" data-activity-record-status>${activityRecordActiveFilter === "全部" ? "正在加载活动记录..." : `正在筛选${activityRecordActiveFilter}活动记录...`}</p>
    <div class="list ref-activity-record-list">
      <p class="empty">正在加载活动报名记录...</p>
    </div>
    <p class="ref-list-tip">${icon("circle-alert", 14)}活动开始前会通过消息通知您</p>
  `;
}

function activityRecord(title, time, status, image, category = "活动", place = "湖泉生态园", distance = "1.2km", people = "28人已报名", primary = "取消报名", secondary = "查看详情", options = {}) {
  const activityId = apiText(options.activityId || options.id || selectedActivityId);
  const signupId = apiText(options.signupId || options.id || "");
  const normalizedStatus = apiText(options.normalizedStatus || status);
  const canScan = options.actions?.canCheckin || title.includes("晨练");
  const shouldRemind = status === "已报名" || status === "待参加";
  const isCanceled = status === "已取消";
  const cancelText = options.cancelReason || "用户主动取消报名";
  const cancelTime = apiTime(options.canceledAt) || "已同步";
  return `
    <article class="list-row ref-activity-record-card" data-action="查看活动详情" data-activity-id="${attr(activityId)}" data-signup-id="${attr(signupId)}" data-activity-title="${attr(title)}" data-activity-time="${attr(time)}" data-activity-location="${attr(place)}" data-activity-image="${attr(image)}" data-activity-category="${attr(category)}" data-activity-status="${attr(status)}" data-activity-record-status="${attr(normalizedStatus)}">
      <img class="row-thumb" src="${asset(image)}" alt="${title}">
      <div><b>${title} <span class="tag">${status}</span></b><p><span>${category}</span>　${icon("calendar", 12)} ${time}</p><p>${icon("map-pin", 12)} ${place}　${icon("navigation", 12)} ${distance}</p><p class="ref-avatars"><img src="${asset("avatar-user.jpg")}" alt="报名用户"><img src="${asset("avatar-daughter.jpg")}" alt="报名用户">${people}</p></div>
      ${canScan ? `<button class="ref-signin-box" data-action="扫码签到" data-activity-id="${attr(activityId)}" data-signup-id="${attr(signupId)}" data-activity-title="${attr(title)}" type="button">${icon("qr-code", 28)}<span>扫码签到</span></button>` : ""}
      ${shouldRemind ? `<p class="ref-record-reminder">${icon("bell", 14)}活动开始前30分钟提醒您</p>` : ""}
      ${isCanceled ? `<p class="ref-record-cancel">取消原因：${attr(cancelText)}<br>取消时间：${attr(cancelTime)}</p>` : ""}
      <aside class="ref-record-actions"><button class="btn ghost" data-action="${attr(primary)}" data-activity-id="${attr(activityId)}" data-signup-id="${attr(signupId)}" data-activity-title="${attr(title)}" data-activity-category="${attr(category)}" type="button">${primary}</button><button class="btn" data-route="activity-signup" data-activity-id="${attr(activityId)}" type="button">${secondary}</button></aside>
    </article>
  `;
}

function renderActivityMap() {
  const isHospitalMode = activityMapMode === "hospital";
  const isSnapshotMode = activityMapMode === "sos-snapshot";
  const snapshotEvents = isSnapshotMode && activityMapSnapshotPoint ? [activityMapSnapshotPoint] : [];
  const sourceEvents = isHospitalMode ? emergencyHospitalMapPoints : isSnapshotMode ? snapshotEvents : currentActivityMapEvents();
  const recommendations = isHospitalMode ? emergencyHospitalMapPoints : isSnapshotMode ? snapshotEvents : activityMapRecommendationEvents();
  const categoryRows = activityMapCategoryRows();
  const initialVisible = activityMapActiveFilter === "全部"
    ? sourceEvents.length
    : sourceEvents.filter((item) => item.category === activityMapActiveFilter).length;
  const initialCards = activityMapActiveFilter === "全部"
    ? recommendations.length
    : recommendations.filter((item) => item.category === activityMapActiveFilter).length;
  return `
    <div class="ref-audit-alias-row">
      <button data-action="查看活动点位：晨练太极健康课" type="button">晨练太极健康课</button>
      <button data-action="查看活动点位：书画交流会" type="button">书画交流会</button>
      <button data-action="定位点位：书画交流会" type="button">书画交流会 文化体验 886m 非遗陶艺体验 文化体验 8.2km</button>
      <button data-action="定位点位：书画交流会" type="button">文化体验</button>
    </div>
    <div class="chips ref-map-cats">${isHospitalMode
      ? ["附近医院", "急诊", "社区卫生"].map((c, i) => `<span class="chip ${i === 0 ? "active" : ""}">${icon(["hospital", "cross", "map-pin"][i], 16)}${c}</span>`).join("")
      : isSnapshotMode
        ? ["求助位置", "后台派单", "家属通知"].map((c, i) => `<span class="chip ${i === 0 ? "active" : ""}">${icon(["map-pin", "shield-check", "users"][i], 16)}${c}</span>`).join("")
      : categoryRows.map((item, i) => `<button class="chip ${item.category === activityMapActiveFilter ? "active" : ""}" data-activity-map-filter="${attr(item.category)}" data-api-count="${Number(item.count || 0)}" data-action="筛选活动地图" type="button" aria-pressed="${item.category === activityMapActiveFilter ? "true" : "false"}">${icon(activityMapCategoryIcon(item.category, i), 16)}${attr(item.category)}</button>`).join("")}</div>
    <p class="action-status ref-map-current" data-activity-map-status>${isHospitalMode ? `已定位附近 ${initialVisible} 家医院` : isSnapshotMode ? "已定位求助记录位置" : activityMapActiveFilter === "全部" ? `已显示全部 ${initialVisible} 个活动` : `已筛选${activityMapActiveFilter} ${initialVisible} 个活动 · 推荐列表 ${initialCards} 个`}</p>
    ${activityMapFocusEventTitle ? `<p class="action-status ref-map-focus">${icon("navigation", 14)}正在定位：${isHospitalMode ? "附近医院" : isSnapshotMode ? activityMapFocusEventTitle : activityMapFocusEventTitle}</p>` : ""}
    <div class="ref-map-stage is-real-map is-loading">
      <div class="amap-real-map" id="amapActivityMap" data-amap-map aria-label="高德活动地图"></div>
      <div class="ref-map-loading" data-amap-status aria-live="polite">正在加载高德地图...</div>
      <button class="map-tool filter" data-action="筛选" type="button">${icon("filter", 22)}<span>筛选</span></button>
      <button class="map-tool list" data-action="列表" type="button">${icon("list", 22)}<span>列表</span></button>
      <button class="map-tool locate" data-action="重新定位" type="button">${icon("locate-fixed", 23)}<span>重新定位</span></button>
      <div class="map-zoom"><button data-action="放大" type="button">+</button><button data-action="缩小" type="button">−</button></div>
    </div>
    <article class="ref-map-selected-card" data-activity-map-selected hidden></article>
    ${section(isHospitalMode ? "附近医院" : isSnapshotMode ? "求助位置记录" : "附近活动推荐", `
      <div class="ref-activity-row">
        ${recommendations.map((item) => mapActivityCard(isHospitalMode || isSnapshotMode ? { ...item, route: "" } : item)).join("")}
      </div>
    `)}
  `;
}

function resetActivityMapRuntime() {
  if (amapMap) {
    try { amapMap.destroy(); } catch (_) {}
  }
  amapMap = null;
  amapMapContainer = null;
  amapMarkerRecords = [];
  amapUserMarker = null;
}

function setActivityMapLoadState(state, message) {
  const stage = document.querySelector(".ref-map-stage.is-real-map");
  const container = document.querySelector("[data-amap-map]");
  const status = document.querySelector("[data-amap-status]");
  const loading = state === "loading";
  stage?.classList.toggle("is-loading", loading);
  stage?.classList.toggle("is-ready", state === "ready");
  stage?.classList.toggle("is-fallback", state === "fallback");
  stage?.classList.toggle("is-error", state === "error");
  if (stage) stage.dataset.amapLoadState = state;
  if (container) {
    container.dataset.amapLoadState = state;
    container.setAttribute("aria-busy", loading ? "true" : "false");
  }
  if (status) {
    status.hidden = false;
    status.dataset.amapLoadState = state;
    status.setAttribute("role", state === "error" ? "alert" : "status");
    status.textContent = message;
  }
}

function bindActivityMapReadyState(map, container) {
  let settled = false;
  const markReady = () => {
    if (settled || currentId() !== "activity-map" || !container.isConnected) return;
    settled = true;
    setActivityMapLoadState("ready", "高德地图已就绪，活动点位来自后台数据");
  };
  const timer = window.setTimeout(() => {
    if (settled || currentId() !== "activity-map" || !container.isConnected) return;
    setActivityMapLoadState("fallback", "地图加载较慢，已保留活动列表和点位兜底");
  }, AMAP_READY_TIMEOUT_MS);
  const complete = () => {
    window.clearTimeout(timer);
    markReady();
  };
  try {
    map.on?.("complete", complete);
  } catch (_) {
    window.clearTimeout(timer);
    window.setTimeout(markReady, 600);
  }
}

function activityMapMarkerHtml(event) {
  return `
    <button class="amap-event-marker ${event.color}" type="button" data-action="查看活动点位：${attr(event.title)}" ${event.id ? `data-activity-id="${attr(event.id)}"` : ""} aria-label="${attr(event.title)}">
      <img src="${userAssetSrc(event.image)}" alt="" />
      <span><strong>${attr(event.title)}</strong><small>${attr(event.category)}<br>${attr(event.distance)}</small></span>
    </button>
  `;
}

function initActivityMap() {
  const container = document.querySelector("[data-amap-map]");
  const stage = document.querySelector(".ref-map-stage.is-real-map");
  if (!container) return;

  if (amapMap && amapMapContainer !== container) {
    resetActivityMapRuntime();
  }

  setActivityMapLoadState("loading", "正在加载高德地图，活动列表可先浏览");

  ensureAmapPlugins().then((AMap) => {
    if (currentId() !== "activity-map" || !container.isConnected) return;
    if (!amapMap) {
      amapMap = new AMap.Map(container, {
        center: currentLocation || DEFAULT_CENTER,
        zoom: currentLocation ? 13 : 12,
        resizeEnable: true,
        viewMode: "2D",
        mapStyle: "amap://styles/fresh",
      });
      amapMapContainer = container;
      bindActivityMapReadyState(amapMap, container);
      if (AMap.Scale) {
        try { amapMap.addControl(new AMap.Scale()); } catch (_) {}
      }
    } else {
      setActivityMapLoadState("ready", "高德地图已就绪，活动点位来自后台数据");
    }
    stage?.classList.remove("is-error");
    renderAmapMarkers();
    renderAmapUserMarker();
    applyActivityMapMarkerFilter(activityMapActiveFilter);
    if (activityMapFocusEventTitle) {
      const focusEvent = activityMapEvents.find((event) => event.title.includes(activityMapFocusEventTitle));
      if (focusEvent) showActivityMapSelectedCard(focusEvent);
    }
    fitAmapView();
  }).catch(() => {
    setActivityMapLoadState("error", "高德地图加载失败，已展示活动列表兜底");
  });
}

function clearAmapMarkers() {
  amapMarkerRecords.forEach(({ marker }) => {
    try { marker.setMap(null); } catch (_) {}
  });
  amapMarkerRecords = [];
}

function renderAmapMarkers() {
  if (!amapMap || !window.AMap) return;
  clearAmapMarkers();
  const markerEvents = activityMapMode === "hospital" ? emergencyHospitalMapPoints : activityMapMode === "sos-snapshot" && activityMapSnapshotPoint ? [activityMapSnapshotPoint] : activityMapEvents;
  markerEvents.forEach((event) => {
    const marker = new window.AMap.Marker({
      position: event.position,
      content: activityMapMarkerHtml(event),
      offset: new window.AMap.Pixel(-58, -58),
      extData: event,
    });
    marker.on("click", () => {
      showActivityMapSelectedCard(event);
    });
    marker.setMap(amapMap);
    amapMarkerRecords.push({ marker, event });
  });
}

function showActivityMapSelectedCard(event) {
  const card = document.querySelector("[data-activity-map-selected]");
  if (!card) return;
  card.hidden = false;
  card.dataset.activityMapType = event.category;
  if (event.id) {
    card.dataset.activityId = event.id;
    card.dataset.activityTitle = event.title;
    card.dataset.activityTime = event.time;
    card.dataset.activityLocation = event.place || event.location || "";
    card.dataset.activityImage = event.image || "";
    card.dataset.activityStatus = event.status || "";
    card.dataset.activityCategory = event.category || "";
    if (event.apiEndpoint) card.dataset.apiEndpoint = event.apiEndpoint;
  } else {
    delete card.dataset.activityId;
    delete card.dataset.activityTitle;
    delete card.dataset.activityTime;
    delete card.dataset.activityLocation;
    delete card.dataset.activityImage;
    delete card.dataset.activityStatus;
    delete card.dataset.activityCategory;
    delete card.dataset.apiEndpoint;
  }
  card.innerHTML = `
    <img src="${userAssetSrc(event.image)}" alt="${attr(event.title)}" />
    <div>
      <b>${attr(event.title)}<span>${attr(event.category)}</span></b>
      <p>${icon("calendar-days", 13)}${attr(event.time)}</p>
      <p>${icon("map-pin", 13)}${attr(event.place || event.location)}　${icon("navigation", 13)}${attr(event.distance)}</p>
      <small>${event.kind === "hospital" ? `急救电话：${attr(event.phone || "可咨询平台客服")} · 地图已定位` : event.kind === "sos" ? `${attr(event.status || "处理中")} · 后台和家属可查看该位置` : `状态：${attr(event.status || "报名中")} · ${event.userJoined ? "已报名，可进入详情更新" : "点击进入详情可继续报名"}`}</small>
    </div>
    ${event.kind === "hospital" ? `<button class="btn" data-action="拨打医院电话" data-phone="${attr(event.phone || "")}" data-name="${attr(event.title)}" type="button">拨打医院</button>` : event.kind === "sos" ? `<button class="btn" data-route="sos-records" type="button">返回记录</button>` : `<button class="btn" data-route="activity-signup" data-activity-id="${attr(event.id)}" type="button">进入详情</button>`}
  `;
  writeActionStatus(card, `已定位到${event.kind === "hospital" ? "医院" : "活动卡片"}：${event.title}`);
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderAmapUserMarker() {
  if (!amapMap || !window.AMap || !currentLocation) return;
  const content = `<div class="amap-user-marker"><i></i><span>当前位置</span></div>`;
  if (!amapUserMarker) {
    amapUserMarker = new window.AMap.Marker({
      position: currentLocation,
      content,
      offset: new window.AMap.Pixel(-16, -36),
      zIndex: 120,
    });
    amapUserMarker.setMap(amapMap);
  } else {
    amapUserMarker.setPosition(currentLocation);
    amapUserMarker.setMap(amapMap);
  }
}

function visibleAmapMarkers() {
  return amapMarkerRecords
    .filter(({ event }) => activityMapMode === "hospital" || activityMapMode === "sos-snapshot" || activityMapActiveFilter === "全部" || event.category === activityMapActiveFilter)
    .map(({ marker }) => marker);
}

function fitAmapView() {
  if (!amapMap) return;
  const overlays = visibleAmapMarkers();
  if (amapUserMarker) overlays.push(amapUserMarker);
  if (!overlays.length) {
    if (currentLocation) amapMap.setCenter(currentLocation);
    return;
  }
  try {
    amapMap.setFitView(overlays, false, [48, 36, 74, 36], 15);
  } catch (_) {
    if (currentLocation) amapMap.setCenter(currentLocation);
  }
}

function applyActivityMapMarkerFilter(filter = activityMapActiveFilter) {
  activityMapActiveFilter = filter;
  amapMarkerRecords.forEach(({ marker, event }) => {
    const visible = filter === "全部" || event.category === filter;
    if (visible) {
      marker.show?.();
      marker.setMap(amapMap);
    } else if (marker.hide) {
      marker.hide();
    } else {
      marker.setMap(null);
    }
  });
  fitAmapView();
}

function syncActivityMapStatus(filter = activityMapActiveFilter) {
  const visibleEvents = activityMapEvents.filter((event) => filter === "全部" || event.category === filter).length;
  const visibleCards = [...document.querySelectorAll(".map-activity-card[data-activity-map-type]")]
    .filter((activity) => filter === "全部" || activity.dataset.activityMapType === filter).length;
  const status = document.querySelector("[data-activity-map-status]");
  if (status) {
    status.textContent = filter === "全部"
      ? `已显示全部 ${visibleEvents} 个活动`
      : `已筛选${filter} ${visibleEvents} 个活动 · 推荐列表 ${visibleCards} 个`;
  }
}

async function filterActivityMap(filter = "全部") {
  activityMapActiveFilter = filter;
  activityMapFocusEventTitle = "";
  const tabs = [...document.querySelectorAll("[data-activity-map-filter]")];
  tabs.forEach((tab) => {
    const active = tab.dataset.activityMapFilter === filter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const activities = [...document.querySelectorAll("[data-activity-map-type]")];
  activities.forEach((activity) => {
    const visible = filter === "全部" || activity.dataset.activityMapType === filter;
    activity.hidden = !visible;
    activity.classList.toggle("is-filtered-out", !visible);
  });

  applyActivityMapMarkerFilter(filter);
  syncActivityMapStatus(filter);
  if (activityMapMode !== "hospital" && activityMapMode !== "sos-snapshot") {
    try {
      await hydrateActivityMapFromApi();
    } catch (error) {
      const status = document.querySelector("[data-activity-map-status]");
      if (status) status.textContent = `活动地图更新失败：${error.message}`;
      writeActionStatus(document.querySelector(".ref-map-cats") || document.querySelector(".ref-map-stage") || document.body, `活动地图更新失败：${error.message}`);
    }
  }
}

function handleActivityMapAction(button, actionName) {
  if (currentId() !== "activity-map") return false;
  if (actionName.startsWith("定位点位：") || actionName.startsWith("查看活动点位：")) {
    const title = actionName.replace(/^定位点位：|^查看活动点位：/, "");
    const points = activityMapMode === "hospital" ? emergencyHospitalMapPoints : activityMapMode === "sos-snapshot" && activityMapSnapshotPoint ? [activityMapSnapshotPoint] : activityMapEvents;
    const point = points.find((item) => item.title === title || item.title.includes(title) || title.includes(item.title));
    if (point) {
      showActivityMapSelectedCard(point);
      if (amapMap) amapMap.setCenter(point.position);
    } else {
      writeActionStatus(button.closest(".ref-map-stage, .section") || button, `未找到活动点位：${title}`);
    }
    return true;
  }
  if (actionName === "拨打医院电话") {
    const phone = button.dataset.phone || "";
    if (phone) safeCallPhone(phone);
    writeActionStatus(button.closest("[data-activity-map-selected]") || button, phone ? `正在拨打${button.dataset.name || "医院"}：${phone}` : "医院电话暂未配置，请联系平台客服");
    return true;
  }
  if (actionName === "筛选") {
    document.querySelector(".ref-map-cats")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    syncActivityMapStatus(activityMapActiveFilter);
    return true;
  }
  if (actionName === "列表") {
    document.querySelector(".ref-activity-row")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return true;
  }
  if (actionName === "重新定位") {
    const loading = document.querySelector("[data-amap-status]");
    if (loading) {
      loading.hidden = false;
      loading.textContent = "正在重新定位...";
    }
    requestCurrentLocation(true).then(({ city }) => {
      renderAmapUserMarker();
      fitAmapView();
      if (loading) loading.hidden = true;
      writeActionStatus(button.closest(".ref-map-stage") || button, `当前位置同步完成${city ? `：${city}` : ""}`);
    });
    return true;
  }
  if (actionName === "放大" || actionName === "缩小") {
    if (!amapMap) {
      writeActionStatus(button.closest(".ref-map-stage") || button, "地图加载中，请稍后再试");
      return true;
    }
    if (actionName === "放大") {
      amapMap.zoomIn();
    } else {
      amapMap.zoomOut();
    }
    writeActionStatus(button.closest(".ref-map-stage") || button, actionName === "放大" ? "地图已放大" : "地图已缩小");
    return true;
  }
  return false;
}

function calendarDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseCalendarDateKey(key) {
  const match = String(key || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
}

function activityCalendarDateFromTime(time) {
  const match = String(time || "").match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const hour = match[4] === undefined ? 9 : Number(match[4]);
  const minute = match[5] === undefined ? 0 : Number(match[5]);
  return { year, month, day, hour, minute, key: calendarDateKey(year, month, day) };
}

function activityCalendarTimeRange(time) {
  const parsed = activityCalendarDateFromTime(time);
  if (!parsed) return { start: "待定", end: "" };
  const start = `${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")}`;
  const endDate = new Date(parsed.year, parsed.month, parsed.day, parsed.hour, parsed.minute + 90);
  const end = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
  return { start, end };
}

function normalizeActivityCalendarEvent(item = {}, index = 0) {
  const id = String(item.id || item.activityId || "");
  const title = String(item.title || item.name || "旅居活动");
  const category = String(item.category || "活动");
  const status = String(item.status || item.tag || "报名中");
  const time = String(item.time || item.startTime || "");
  const parsed = activityCalendarDateFromTime(time);
  const range = activityCalendarTimeRange(time);
  const joined = Number(item.participantCount ?? item.joined ?? item.joinedCount ?? 0);
  const quota = Number(item.quota ?? 0);
  const image = activityImageFor(item, index);
  const userJoined = Boolean(item.userJoined);
  return {
    ...item,
    id,
    title,
    category,
    status: userJoined ? "已报名" : status,
    rawStatus: status,
    start: range.start,
    end: range.end,
    time,
    dateKey: parsed?.key || "",
    place: String(item.place || item.location || item.card?.place || "活动地点待定"),
    location: String(item.location || item.place || item.card?.place || "活动地点待定"),
    distance: String(item.distance || item.card?.distance || "附近"),
    people: quota > 0 ? `${Number.isFinite(joined) ? joined : 0}/${quota}人` : `${Number.isFinite(joined) ? joined : 0}人已报名`,
    image,
    color: activityMapStatusColor(status, category),
    joined: Number.isFinite(joined) ? joined : 0,
    quota: Number.isFinite(quota) ? quota : 0,
    userJoined,
    signupId: item.signupId || "",
    apiEndpoint: item.apiEndpoint || (id ? `/api/activities/${encodeURIComponent(id)}` : ""),
    availableSlots: Number(item.availableSlots ?? Math.max(0, (Number.isFinite(quota) ? quota : 0) - (Number.isFinite(joined) ? joined : 0))),
  };
}

function activityCalendarSourceEvents() {
  const source = Array.isArray(activityCalendarPageState?.activities) ? activityCalendarPageState.activities : [];
  return source.map((item, index) => normalizeActivityCalendarEvent(item, index)).filter((event) => event.id && event.dateKey);
}

function activityCalendarEventsForDate(year, month, day) {
  const key = calendarDateKey(year, month, day);
  return activityCalendarSourceEvents()
    .filter((event) => event.dateKey === key)
    .sort((a, b) => String(a.time).localeCompare(String(b.time)));
}

function activityCalendarNearestEventDateKey() {
  const events = activityCalendarSourceEvents();
  if (!events.length) return "";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return events
    .map((event) => ({ key: event.dateKey, value: parseCalendarDateKey(event.dateKey) }))
    .filter((item) => item.value)
    .map((item) => {
      const dateValue = new Date(item.value.year, item.value.month, item.value.day).getTime();
      return { ...item, dateValue, distance: Math.abs(dateValue - today), futurePenalty: dateValue >= today ? 0 : 1 };
    })
    .sort((a, b) => a.futurePenalty - b.futurePenalty || a.distance - b.distance || a.dateValue - b.dateValue)[0]?.key || "";
}

function activityCalendarSyncMonthToDate(key) {
  const parsed = parseCalendarDateKey(key);
  if (!parsed) return;
  const now = new Date();
  calendarMonthOffset = (parsed.year - now.getFullYear()) * 12 + (parsed.month - now.getMonth());
}

function activityCalendarSyncSelectionFromApi() {
  const nearest = activityCalendarNearestEventDateKey();
  if (!nearest) return;
  const parsed = parseCalendarDateKey(calendarSelectedDateKey);
  const selectedHasEvents = parsed && activityCalendarEventsForDate(parsed.year, parsed.month, parsed.day).length > 0;
  if (!selectedHasEvents) calendarSelectedDateKey = nearest;
  activityCalendarSyncMonthToDate(calendarSelectedDateKey || nearest);
}

function calendarMonthBase() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + calendarMonthOffset, 1);
}

function calendarHasEvents(year, month, day) {
  return activityCalendarEventsForDate(year, month, day).length > 0;
}

function calendarEventsForDate(year, month, day) {
  return activityCalendarEventsForDate(year, month, day);
}

function calendarSelectedDate(base, totalDays) {
  const parsed = parseCalendarDateKey(calendarSelectedDateKey);
  const now = new Date();
  if (parsed && parsed.year === base.getFullYear() && parsed.month === base.getMonth() && parsed.day <= totalDays) {
    return parsed;
  }
  const defaultDay = calendarMonthOffset === 0 ? Math.min(now.getDate(), totalDays) : 1;
  calendarSelectedDateKey = calendarDateKey(base.getFullYear(), base.getMonth(), defaultDay);
  return { year: base.getFullYear(), month: base.getMonth(), day: defaultDay };
}

function calendarDateLabel(year, month, day) {
  const now = new Date();
  if (year === now.getFullYear() && month === now.getMonth() && day === now.getDate()) return `${month + 1}月${day}日 今天`;
  const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][new Date(year, month, day).getDay()];
  return `${month + 1}月${day}日 ${week}`;
}

function renderCalendarAndFocus(message, selector = "[data-calendar-events]") {
  render();
  setTimeout(() => {
    const target = document.querySelector(selector) || document.querySelector(".screen-activity-calendar .content");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    writeActionStatus(target, message);
  }, 0);
}

function activityCalendarFilterRows() {
  const events = activityCalendarSourceEvents();
  return ACTIVITY_CALENDAR_FILTERS.map((category) => {
    const count = category === "全部" ? events.length : events.filter((event) => event.category === category).length;
    return { category, count };
  });
}

function activityCalendarEventFromButton(button) {
  const source = button?.dataset?.activityId ? button : button?.closest?.("[data-activity-id]");
  const activityId = source?.dataset?.activityId || "";
  const event = activityCalendarSourceEvents().find((item) => item.id === activityId) || null;
  return { activityId, event, source };
}

async function handleCalendarAction(button, actionName) {
  if (currentId() !== "activity-calendar") return false;
  if (actionName === "选择活动日期") {
    const key = button.dataset.calendarDay;
    const parsed = parseCalendarDateKey(key);
    if (!parsed) return true;
    calendarSelectedDateKey = key;
    const label = calendarDateLabel(parsed.year, parsed.month, parsed.day);
    renderCalendarAndFocus(`${label}活动已按日期刷新`);
    return true;
  }
  if (actionName === "切换活动月份") {
    const delta = Number(button.dataset.calendarMonthDelta || 0);
    if (!delta) return true;
    const current = parseCalendarDateKey(calendarSelectedDateKey) || { day: new Date().getDate() };
    calendarMonthOffset += delta;
    const base = calendarMonthBase();
    const totalDays = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    const nextDay = Math.min(Math.max(1, current.day), totalDays);
    calendarSelectedDateKey = calendarDateKey(base.getFullYear(), base.getMonth(), nextDay);
    renderCalendarAndFocus(`${base.getFullYear()}年${base.getMonth() + 1}月活动已加载`, ".ref-calendar-card");
    return true;
  }
  if (actionName === "切换活动提醒") {
    calendarReminderEnabled = !calendarReminderEnabled;
    localStorage.setItem(ACTIVITY_CALENDAR_REMINDER_STORAGE_KEY, calendarReminderEnabled ? "on" : "off");
    render();
    setTimeout(() => {
      const reminder = document.querySelector(".ref-calendar-reminder");
      writeActionStatus(reminder || button, calendarReminderEnabled ? "活动开始前30分钟提醒已开启" : "活动提醒已关闭");
    }, 0);
    return true;
  }
  if (actionName === "筛选活动") {
    const legend = document.querySelector(".ref-calendar-legend");
    let panel = document.querySelector("[data-calendar-filter-panel]");
    if (!panel && legend) {
      panel = document.createElement("div");
      panel.className = "ref-calendar-filter-panel";
      panel.dataset.calendarFilterPanel = "";
      panel.innerHTML = activityCalendarFilterRows()
        .map((item) => `<button class="${item.category === activityCalendarActiveFilter ? "active" : ""}" data-action="选择活动筛选：${attr(item.category)}" type="button" aria-pressed="${item.category === activityCalendarActiveFilter ? "true" : "false"}">${attr(item.category)}<small>${attr(item.count)}</small></button>`)
        .join("");
      legend.insertAdjacentElement("afterend", panel);
    } else if (panel) {
      panel.hidden = !panel.hidden;
    }
    const expanded = panel ? !panel.hidden : false;
    button.setAttribute("aria-expanded", expanded ? "true" : "false");
    button.dataset.calendarFilterOpen = expanded ? "true" : "false";
    legend?.scrollIntoView({ behavior: "smooth", block: "center" });
    let status = document.querySelector("[data-calendar-filter-status]");
    if (!status && panel) {
      status = document.createElement("p");
      status.className = "ref-calendar-filter-status";
      status.dataset.calendarFilterStatus = "";
      panel.insertAdjacentElement("afterend", status);
    }
    if (status) status.textContent = expanded ? `活动筛选已展开：${activityCalendarActiveFilter}` : "活动筛选已收起";
    return true;
  }
  if (actionName.startsWith("选择活动筛选：")) {
    const filter = actionName.replace("选择活动筛选：", "");
    activityCalendarActiveFilter = ACTIVITY_CALENDAR_FILTERS.includes(filter) ? filter : "全部";
    localStorage.setItem(ACTIVITY_CALENDAR_FILTER_STORAGE_KEY, activityCalendarActiveFilter);
    activityCalendarPageState = null;
    render();
    await hydrateActivityCalendarFromApi("activity-calendar", { force: true });
    const status = document.querySelector("[data-calendar-filter-status]") || document.querySelector("[data-activity-calendar-status]");
    if (status) status.textContent = `当前活动筛选：${activityCalendarActiveFilter}`;
    button.dataset.calendarFilterSelected = "true";
    return true;
  }
  if (actionName === "报名日历活动") {
    const { activityId, event } = activityCalendarEventFromButton(button);
    if (!activityId) return true;
    button.disabled = true;
    try {
      const result = await userApi(`/api/activities/${encodeURIComponent(activityId)}/join`, {
        method: "POST",
        body: { source: "activity-calendar" },
      });
      selectedActivityId = activityId;
      selectedActivityDetail = result?.activity || event || selectedActivityDetail;
      selectedActivitySnapshot = normalizeHomeActivity(result?.activity || event || {}, HOME_FALLBACK_ACTIVITIES[0]);
      localStorage.setItem(SELECTED_ACTIVITY_STORAGE_KEY, selectedActivityId);
      await hydrateActivityCalendarFromApi("activity-calendar", { force: true, silent: true });
      showToast("活动报名成功");
      const target = document.querySelector(`[data-activity-id="${CSS.escape(activityId)}"]`) || document.querySelector("[data-calendar-events]");
      writeActionStatus(target || button, `已报名「${event?.title || result?.activity?.title || "活动"}」，报名人数已更新`);
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `报名失败：${error.message}`);
    }
    return true;
  }
  if (actionName === "查看报名") {
    const { activityId, event } = activityCalendarEventFromButton(button);
    if (activityId) {
      selectedActivityId = activityId;
      selectedActivitySnapshot = normalizeHomeActivity(event || {}, HOME_FALLBACK_ACTIVITIES[0]);
      localStorage.setItem(SELECTED_ACTIVITY_STORAGE_KEY, selectedActivityId);
    }
    rememberScreenReturn("activity-records", button);
    setRoute("activity-records");
    return true;
  }
  if (actionName === "重新读取活动日历") {
    await hydrateActivityCalendarFromApi("activity-calendar", { force: true });
    return true;
  }
  return false;
}

function renderCalendar() {
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  const base = calendarMonthBase();
  const year = base.getFullYear();
  const month = base.getMonth();
  const now = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const nums = Array.from({ length: totalDays }).map((_, i) => i + 1);
  const selected = calendarSelectedDate(base, totalDays);
  const selectedKey = calendarDateKey(selected.year, selected.month, selected.day);
  const selectedEvents = calendarEventsForDate(selected.year, selected.month, selected.day);
  const eventCount = selectedEvents.length;
  const usingApi = Boolean(activityCalendarPageState);
  const apiError = activityCalendarPageState?.error || "";
  const calendarStatusHtml = !usingApi || apiError
    ? `<p class="action-status ref-calendar-api-status" data-activity-calendar-status>${apiError ? `活动日历加载失败：${attr(apiError)}` : "正在加载活动日历..."}</p>`
    : "";
  return `
    <div class="card calendar ref-calendar-card">
      <div class="ref-month-head"><button data-action="切换活动月份" data-calendar-month-delta="-1" type="button" aria-label="上一月">${icon("chevron-left", 18)}</button><h2>${year}年${month + 1}月</h2><button data-action="切换活动月份" data-calendar-month-delta="1" type="button" aria-label="下一月">${icon("chevron-right", 18)}</button></div>
      <div class="calendar-grid ref-calendar-grid">
        ${days.map((d) => `<span class="day head">${d}</span>`).join("")}
        ${Array.from({ length: firstDay }).map(() => `<span class="day empty"></span>`).join("")}
        ${nums.map((n) => {
          const key = calendarDateKey(year, month, n);
          const events = calendarEventsForDate(year, month, n);
          const isToday = year === now.getFullYear() && month === now.getMonth() && n === now.getDate();
          const active = key === selectedKey;
          return `<button class="day ${active ? "active" : ""} ${events.length ? "mark" : ""}" data-action="选择活动日期" data-calendar-day="${key}" type="button" aria-pressed="${active ? "true" : "false"}">${n}<small>${isToday ? "今天" : events.length ? `${events.length}项` : ""}</small></button>`;
        }).join("")}
      </div>
      <div class="ref-calendar-legend"><span><i class="green"></i>免费活动</span><span><i class="purple"></i>文化体验</span><span><i class="orange"></i>休闲娱乐</span><span><i class="blue"></i>学习讲座</span><button data-action="筛选活动" type="button">${icon("filter", 14)}筛选</button></div>
      ${calendarStatusHtml}
    </div>
    <section class="section ref-calendar-selected-section" data-calendar-events>
      <div class="section-head">
        <h2>${calendarDateLabel(selected.year, selected.month, selected.day)}</h2>
        <button data-route="activity-map" type="button">活动地图 ${icon("map-pin", 15)}</button>
      </div>
      <div class="list ref-calendar-events">
        ${eventCount ? selectedEvents.map(calendarEvent).join("") : `<div class="card ref-calendar-empty">${icon("calendar-days", 24)}<b>${usingApi ? "当天暂无活动" : "正在加载活动"}</b><span>${usingApi ? "可切换其他日期，或进入活动地图查看附近推荐。" : "正在同步活动日历数据。"}</span><button class="btn blue" ${usingApi ? "data-route=\"activity-map\"" : "data-action=\"重新读取活动日历\""} type="button">${usingApi ? "查看活动地图" : "重新读取活动日历"}</button></div>`}
      </div>
    </section>
    <div class="ref-calendar-reminder">
      <div class="ref-calendar-reminder-main">
        <span class="ref-calendar-reminder-icon">${icon("bell", 18)}</span>
        <span class="ref-calendar-reminder-copy">
          <strong class="ref-calendar-reminder-title">已加入日历 ${eventCount} 个活动</strong>
          <small class="ref-calendar-reminder-subtitle">活动开始前30分钟提醒</small>
        </span>
      </div>
      <button class="ref-calendar-reminder-toggle" data-action="切换活动提醒" type="button" aria-pressed="${calendarReminderEnabled ? "true" : "false"}" aria-label="切换活动提醒"><span class="ref-calendar-reminder-switch-label">提醒</span><span class="switch ${calendarReminderEnabled ? "on" : ""}"></span></button>
    </div>
  `;
}

function calendarEvent(event) {
  return `
    <article class="ref-calendar-event" data-route="activity-signup" data-activity-id="${attr(event.id)}" data-activity-title="${attr(event.title)}" data-activity-time="${attr(event.time)}" data-activity-location="${attr(event.location || event.place)}" data-activity-image="${attr(event.image)}" data-activity-status="${attr(event.status)}" data-activity-category="${attr(event.category)}" data-signup-id="${attr(event.signupId || "")}" data-api-endpoint="${attr(event.apiEndpoint || "")}">
      <time><b>${event.start}</b><span>${event.end}</span></time>
      <img src="${userAssetSrc(event.image, "activity-taiji.jpg")}" alt="${attr(event.title)}">
      <div><h3>${attr(event.title)} <span class="tag ${event.color === "orange" ? "orange" : ""}">${attr(event.status)}</span></h3><p>${attr(event.category)} · ${attr(event.place)} · ${attr(event.distance)}</p><small>${attr(event.people)} · 剩余 ${attr(event.availableSlots)} 名</small></div>
      <button data-action="${event.userJoined ? "查看报名" : "报名日历活动"}" data-activity-id="${attr(event.id)}" type="button">${event.userJoined ? "查看报名" : "去报名"}</button>
    </article>
  `;
}

function renderEmergency() {
  const data = emergencyPageState;
  if (!data) {
    return `
      <div class="ref-hero-img ref-sos-hero"><img src="${asset("sos-hero.jpg")}" alt="紧急情况立即求助" /></div>
      <section class="section card form-card ref-sos-card">
        <button class="sos-button" data-action="一键紧急求助" type="button" disabled>${icon("loader-circle", 36)}正在连接求助服务</button>
        <p class="meta" style="justify-content:center;margin-top:12px">正在加载紧急联系人、定位和健康信息...</p>
      </section>
    `;
  }
  const locationInfo = emergencyLocationPayload();
  const contacts = data.emergencyContacts?.contacts || [];
  const notificationCount = contacts.filter((contact) => contact.notifyAlert !== false).length;
  const quickHelpIcon = { ambulance: "ambulance", police: "shield-alert", hospital: "hospital", customerService: "headphones", guide: "badge-check" };
  const quickHelpColor = { ambulance: "red", police: "blue", hospital: "green", customerService: "purple", guide: "orange" };
  const healthInfo = data.healthInformation?.info || {};
  return `
    <div class="ref-hero-img ref-sos-hero"><img src="${asset("sos-hero.jpg")}" alt="紧急情况立即求助" /></div>
    <section class="section card form-card ref-sos-card">
      <button class="sos-button" data-action="一键紧急求助" type="button">${icon("phone-call", 36)}一键紧急求助</button>
      <p class="meta" style="justify-content:center;margin-top:12px">点击两次确认后生成求助记录，并通知 ${notificationCount} 位紧急联系人和平台后台</p>
    </section>
    ${section("紧急联系人", `
      <div class="contact-row ref-contact-row">
        ${contacts.map((contact, index) => contactCard(
          apiText(contact.relation, "家属"),
          apiText(contact.name, "联系人"),
          maskPhone(contact.phone),
          apiText(contact.phone),
          index % 2 === 0 ? "avatar-daughter.jpg" : "avatar-son.jpg",
          contact.id,
        )).join("") || `<p class="empty">暂无紧急联系人，请先进入管理页面添加。</p>`}
      </div>
    `, `<button data-route="contacts" type="button">管理</button>`)}
    ${section("快速求助", serviceGrid((data.quickHelp?.channels || []).filter((channel) => channel.key !== "guide").map((channel) => ({
      title: attr(channel.title),
      desc: attr(channel.target),
      icon: quickHelpIcon[channel.key] || "siren",
      color: quickHelpColor[channel.key] || "blue",
      action: channel.title,
      href: channel.dialNumber ? `tel:${normalizeDialNumber(channel.dialNumber)}` : "",
    }))))}
    ${section("我的位置", `
      <div class="list-row ref-location-row">
        <img class="row-thumb" src="${asset("map-main.jpg")}" alt="地图">
        <div><b>${attr(locationInfo.city || data.user?.city || "当前位置")}</b><p>${attr(locationInfo.location)} · ${attr(locationInfo.locationSource)}${locationInfo.accuracy ? ` · 定位精度 ${attr(locationInfo.accuracy)}米` : ""}</p></div>
        <button class="btn ghost" data-action="refresh" type="button">${icon("refresh-cw", 15)}刷新</button>
      </div>
    `)}
    ${section("健康信息", `
      <div class="card form-card ref-health-info">
        ${field("血型", attr(healthInfo.bloodType || "未填写"))}
        ${field("慢性疾病", attr(healthInfo.chronicDiseases || "未填写"))}
        ${field("过敏史", attr(healthInfo.allergies || "未填写"))}
        ${field("常用药物", attr(healthInfo.medicines || "未填写"))}
      </div>
    `)}
    <div class="card ref-safety-tips">
      <div><h2>安全小贴士</h2><p>外出时尽量结伴同行，避免前往偏僻区域</p><p>随身携带手机，保持电量充足</p><p>遇到紧急情况，保持冷静，及时求助</p></div>
      <span>${icon("siren", 46)}</span>
    </div>
    <div class="ref-alert-strip">${icon("volume-2", 16)}云旅无忧与当地公安、医疗机构建立联动机制，保障您的安全</div>
  `;
}

function contactCard(relation, name, phone, rawPhone, image, contactId = "") {
  const dialNumber = normalizeDialNumber(rawPhone);
  return `
    <a class="contact-card card" href="tel:${attr(dialNumber)}" data-action="拨打${attr(name)}" data-contact-id="${attr(contactId)}" data-phone="${attr(rawPhone)}" data-name="${attr(name)}" data-relation="${attr(relation)}">
      <img src="${asset(image)}" alt="${attr(name)}">
      <b>${attr(relation)}</b>
      <span>${attr(name)}</span>
      <span style="color:#ef6b6b">${attr(phone)}</span>
    </a>
  `;
}

function renderSosRecords() {
  const filters = ["全部", "SOS", "快速求助", "设备异常", "人工客服", "已处理"];
  return `
    <section class="ref-sos-record-hero">
      <div><h2>安全守护 · <b>随时呼应</b></h2><p>每一次呼救，我们都在您身边</p></div>
      <span>SOS</span>
      <div class="ref-sos-record-stats">
        ${[
          ["siren", "求助记录", "red"],
          ["circle-check", "已处理", "green"],
          ["clock", "待处理", "orange"],
        ].map(([iconName, label, color]) => `<span data-sos-record-stat><i class="${color}">${icon(iconName, 17)}</i><small>${label}</small><strong>--<em>条</em></strong></span>`).join("")}
      </div>
    </section>
    <div class="chips ref-record-tabs" data-sos-record-tabs>${filters.map((c) => `<button class="chip ${c === sosRecordActiveFilter ? "active" : ""}" data-sos-record-filter="${attr(c)}" data-action="筛选求助记录：${attr(c)}" type="button" aria-pressed="${c === sosRecordActiveFilter ? "true" : "false"}">${c}</button>`).join("")}</div>
    <p class="action-status ref-sos-record-filter-status" data-sos-record-status>正在加载求助记录...</p>
    <div class="ref-sos-record-list">
      <p class="empty">正在加载求助记录...</p>
    </div>
    <button class="ref-sos-record-note" data-action="查看同步说明" type="button">${icon("shield-check", 16)}<span>紧急记录将同步给授权家属和平台后台，保障您的安全</span>${icon("chevron-right", 18)}</button>
  `;
}

function sosRecordCard(type, title, status, time, address, color, result, steps, category = "") {
  const recordId = `${title}-${time}`.replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-|-$/g, "") || "sos-record";
  const normalizedCategory = category || (type === "SOS" ? "SOS" : "设备异常");
  const filterText = [normalizedCategory, type, title, status, color].join(" ");
  return `
    <article class="ref-sos-record-card ${color}" data-sos-record-item data-sos-record-category="${attr(normalizedCategory)}" data-sos-record-filter-text="${attr(filterText)}" data-record-id="${attr(recordId)}" data-title="${attr(title)}" data-status="${attr(status)}" data-time="${attr(time)}" data-address="${attr(address)}" data-color="${attr(color)}">
      <i class="ref-sos-badge">${type === "SOS" ? "SOS" : icon(type, 20)}</i>
      <header><h3>${attr(title)} <span>${attr(status)}</span></h3><time>${attr(time)}</time></header>
      <p>${icon("map-pin", 15)}${attr(address)}</p>
      ${result ? `<div class="ref-sos-result">${result.map(([label, text, iconName]) => `<span><small>${label}</small><b>${text}</b>${icon(iconName, 17)}</span>`).join("")}</div>` : ""}
      <div class="ref-sos-flow">${steps.map(([iconName, text]) => `<span>${icon(iconName, 17)}<small>${text}</small></span>`).join("")}</div>
      <footer><button data-action="查看求助详情" type="button">${icon("file-text", 15)}查看详情</button><button data-action="拨打客服" type="button">${icon("phone", 15)}拨打客服</button><button data-action="位置快照" type="button">${icon("map-pin", 15)}位置快照</button></footer>
    </article>
  `;
}

function sosRecordMatches(filter, card) {
  if (!card || filter === "全部") return true;
  const category = card.dataset.sosRecordCategory || "";
  const status = card.dataset.status || card.getAttribute("data-status") || "";
  const text = card.dataset.sosRecordFilterText || card.textContent || "";
  if (filter === "SOS") return category === "SOS";
  if (filter === "设备异常") return category === "设备异常";
  if (filter === "人工客服") return category === "人工客服";
  if (filter === "已处理") return /已处理|已确认|已取消|确认安全|完成/.test(status || text);
  return category === filter || text.includes(filter);
}

function sosRecordFilterText(filter, count) {
  return filter === "全部" ? `已显示全部求助记录 ${count} 条` : `已筛选${filter}求助记录 ${count} 条`;
}

function filterSosRecords(filter = "全部", silent = false) {
  sosRecordActiveFilter = filter || "全部";
  const cards = [...document.querySelectorAll("[data-sos-record-item]")];
  let visibleCount = 0;
  cards.forEach((card) => {
    const matched = sosRecordMatches(sosRecordActiveFilter, card);
    card.hidden = !matched;
    if (matched) visibleCount += 1;
  });
  document.querySelectorAll("[data-sos-record-filter]").forEach((tab) => {
    const active = tab.dataset.sosRecordFilter === sosRecordActiveFilter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const status = document.querySelector("[data-sos-record-status]");
  if (status) status.textContent = sosRecordFilterText(sosRecordActiveFilter, visibleCount);
  const list = document.querySelector(".ref-sos-record-list");
  let empty = document.querySelector("[data-sos-record-empty]");
  if (!empty && list) {
    empty = document.createElement("p");
    empty.className = "empty ref-sos-record-empty";
    empty.dataset.sosRecordEmpty = "true";
    empty.textContent = "暂无匹配的求助记录。";
    list.appendChild(empty);
  }
  if (empty) empty.hidden = visibleCount > 0;
  if (!silent) writeActionStatus(document.querySelector("[data-sos-record-tabs]") || list || document.body, sosRecordFilterText(sosRecordActiveFilter, visibleCount));
}

function focusSosRecordFilters(button) {
  const tabs = document.querySelector("[data-sos-record-tabs]");
  if (!tabs) return;
  tabs.classList.add("is-highlight");
  tabs.scrollIntoView({ behavior: "smooth", block: "nearest" });
  filterSosRecords(sosRecordActiveFilter || "全部");
  window.setTimeout(() => tabs.classList.remove("is-highlight"), 900);
}

function renderContacts() {
  return `
    <section class="ref-contact-hero"><span>${icon("cross", 34)}</span><div><h2>紧急情况下将优先通知以下联系人</h2><p>用于紧急求助、设备异常、服务异常、健康预警等场景<br>请确保联系人信息准确、畅通</p></div><i>${icon("smartphone", 42)}</i></section>
    ${section("联系人列表", `
      <div class="ref-contact-sort">正在加载联系人数量和通知顺序</div>
      <div class="ref-contact-list">
        <p class="empty">正在加载联系人数据...</p>
      </div>
    `)}
    <section class="card ref-contact-rules">
      <h2>通知规则 <small>选择触发场景，系统将按照联系人排序依次通知</small></h2>
      ${[
        ["sos", "SOS 求助", "按下 SOS 按键或一键紧急求助时通知", "red"],
        ["device", "设备异常", "手环、机器人等设备异常时通知", "orange"],
        ["service", "服务异常", "服务超时、取消等异常情况时通知", "purple"],
        ["health", "健康预警", "心率异常、跌倒等健康预警时通知", "green"],
      ].map(([key, title, text, color]) => `<button data-notification-rule="${key}" data-action="加载${title}通知规则" type="button" aria-pressed="false" disabled><i class="${color}">${title.slice(0, 3)}</i><span><b>${title}</b><small>${text}</small></span><em style="visibility:hidden">${icon("check", 15)}</em></button>`).join("")}
    </section>
    <p class="ref-contact-secure">${icon("lock", 14)}联系人信息仅用于紧急通知、系统拨号和操作记录，并受账号权限保护</p>
    <button class="btn blue block ref-sticky-main" data-action="新增联系人" type="button">${icon("user-plus", 17)}新增联系人</button>
  `;
}

function contactManage(contactId, name, relation, phone, rawPhone, status, image, color = "blue", callPriority = 1, notifyAlert = true) {
  const dialNumber = normalizeDialNumber(rawPhone);
  return `
    <article class="ref-contact-card" data-contact-id="${attr(contactId)}" data-phone="${attr(rawPhone)}" data-name="${attr(name)}" data-relation="${attr(relation)}" data-call-priority="${attr(callPriority)}" data-notify-alert="${notifyAlert ? "true" : "false"}" data-is-default="${status ? "true" : "false"}">
      <img src="${asset(image)}" alt="${name}">
      <div><h3>${name} <span class="${color}">${relation}</span>${status ? `<em>${status}</em>` : ""}</h3><p>${icon("phone", 14)}${phone} · 第 ${Number(callPriority) || 1} 顺位</p><small>${notifyAlert ? `通知链路：<b>${icon("triangle-alert", 12)}紧急告警</b><b>${icon("message-circle", 12)}站内消息</b>` : `<b class="muted">未加入告警通知</b>`}</small></div>
      <a href="tel:${attr(dialNumber)}" data-action="拨打${attr(name)}" data-contact-id="${attr(contactId)}" data-phone="${attr(rawPhone)}" data-name="${attr(name)}">${icon("phone", 16)}拨打</a>
      <button data-action="编辑${name}" data-contact-id="${attr(contactId)}" data-phone="${attr(rawPhone)}" data-name="${attr(name)}" data-relation="${attr(relation)}" data-call-priority="${attr(callPriority)}" data-notify-alert="${notifyAlert ? "true" : "false"}" data-is-default="${status ? "true" : "false"}" type="button">${icon("pencil", 16)}编辑</button>
      <button data-action="删除${attr(name)}" data-contact-id="${attr(contactId)}" data-name="${attr(name)}" type="button">${icon("trash-2", 16)}删除</button>
    </article>
  `;
}

function renderHealthRecord() {
  const data = healthRecordState;
  if (!data) {
    return `
      <section class="card ref-health-profile-v2" aria-busy="true">
        <img src="${asset("avatar-user.jpg")}" alt="健康档案用户">
        <div><h2>正在加载健康档案</h2><p>${icon("refresh-cw", 15)}正在同步健康档案</p><strong>${icon("shield-check", 15)}数据加载中</strong></div>
        <img src="${asset("ref/health-record-folder-ref.png")}" alt="健康档案">
      </section>
      <p class="empty">正在加载健康指标、用药提醒和授权状态...</p>
    `;
  }
  const elder = data.elder || {};
  const user = data.user || {};
  const metrics = Array.isArray(data.metrics) ? data.metrics : [];
  const metricByType = Object.fromEntries(metrics.map((item) => [item.metricType, item]));
  const genderIcon = elder.gender === "女" ? "venus" : elder.gender === "男" ? "mars" : "user";
  const overviewItems = [
    ["droplet", "血型", elder.bloodType, "red"],
    ["cross", "慢性病", (elder.healthTags || []).join("、"), "green"],
    ["shield-alert", "过敏史", elder.allergies, "purple"],
    ["pill", "常用药", elder.medicines, "blue"],
  ];
  const infoItems = [
    ["就医偏好", elder.medicalPreference, "briefcase-medical"],
    ["紧急病史", elder.emergencyHistory, "triangle-alert"],
    ["家属备注", elder.familyNote, "user"],
  ];
  const reminders = Array.isArray(data.medicationReminders) ? data.medicationReminders.filter((item) => item.enabled !== false) : [];
  const authorizationEnabled = data.authorization?.familyHealthSummary !== false;
  const device = data.device;
  return `
    <section class="card ref-health-profile-v2" data-health-record-id="${attr(elder.id)}" data-health-record-source="${attr(data.sourceEndpoint)}">
      <img src="${userAssetSrc(user.avatar, "avatar-user.jpg")}" alt="${attr(elder.name || user.name || "健康档案用户")}">
      <div><h2>${apiText(elder.name || user.name, "姓名待完善")} <span>${icon(genderIcon, 16)} ${apiText(elder.gender, "未填写")}</span><i>${Number(elder.age || 0) || "--"} 岁</i></h2><p>${icon("map-pin", 15)}当前城市：${apiText(user.city, "未填写")}</p><strong>${icon("heart-pulse", 15)}健康状态：${apiText(elder.healthStatus, "待评估")}</strong></div>
      <img src="${asset("ref/health-record-folder-ref.png")}" alt="健康档案">
    </section>
    ${section("健康概览", `
      <div class="ref-health-overview">
        ${overviewItems.map(([iconName, title, value, color]) => `<article class="${color}">${icon(iconName, 23)}<small>${title}</small><b>${apiText(value, "未填写")}</b></article>`).join("")}
      </div>
    `)}
    ${section("近期健康数据趋势", `
      <div class="ref-health-trend-grid">
        ${healthTrendCard("heart-pulse", "心率", metricByType.heart_rate, "red")}
        ${healthTrendCard("stethoscope", "血压", metricByType.blood_pressure, "orange")}
        ${healthTrendCard("droplet", "血氧", metricByType.blood_oxygen, "blue")}
        ${healthTrendCard("moon", "睡眠", metricByType.sleep, "purple")}
        ${healthTrendCard("footprints", "步数", metricByType.steps, "green")}
      </div>
    `)}
    ${section("健康信息", `
      <div class="card ref-health-info-list">
        ${infoItems.map(([title, text, iconName]) => `<button data-action="${title}" type="button">${icon(iconName, 20)}<b>${title}</b><span>${apiText(text, "未填写")}</span>${icon("chevron-right", 17)}</button>`).join("")}
      </div>
    `)}
    ${section("用药提醒", `
      <div class="card ref-medication-timeline">
        ${reminders.length ? reminders.map((item) => `<article data-medication-id="${attr(item.id)}"><em>${apiText(item.period, "药")}</em><b>${apiText(item.time, "--:--")}</b><p>${(item.medicines || []).map((medicine) => `· ${apiText(medicine)}`).join("<br>") || "未填写药物"}</p><span>${apiText(item.status, "待提醒")}</span></article>`).join("") : '<p class="empty">暂无用药提醒，可通过编辑健康档案添加。</p>'}
      </div>
    `)}
    <section class="card ref-health-auth"><b>${icon("lock", 18)}数据授权</b><span>家属可查看健康摘要<br><small>授权后，家属可查看心率、血压等健康摘要信息</small></span><button data-action="切换健康授权" type="button" class="switch${authorizationEnabled ? " on" : ""}" aria-label="家属健康摘要授权" aria-pressed="${authorizationEnabled ? "true" : "false"}"></button></section>
    <button class="btn blue block ref-sticky-main" data-action="同步手环数据" type="button"${device ? "" : " disabled"}><span class="ref-sync-main">${icon("refresh-cw", 17)}<b>同步${apiText(device?.name || device?.type, "健康设备")}数据</b></span><small>${device ? `最后同步：${apiText(apiTime(device.lastSync), "尚未同步")} · ${apiText(device.onlineStatus, "状态未知")}` : "暂无已绑定健康设备"}</small></button>
    <p class="ref-health-disclaimer">${icon("info", 15)}健康提示不替代医生诊断，如有不适请及时就医</p>
  `;
}

function healthTrendCard(iconName, label, metric, color) {
  const hasMetric = metric && metric.value !== undefined && metric.value !== null && metric.value !== "";
  const value = hasMetric ? metric.value : "--";
  const unit = hasMetric ? metric.unit || "" : "";
  const status = hasMetric ? metric.status || "已采集" : "待同步";
  const time = hasMetric ? apiTime(metric.recordedAt) : "暂无记录";
  const source = hasMetric ? metric.source || "健康设备" : "";
  return `<article class="${color}" data-health-metric="${attr(metric?.metricType || label)}">${icon(iconName, 17)}<small>${label}</small><b>${apiText(value)}<em>${apiText(unit)}</em></b><span>${apiText(status)}</span><svg viewBox="0 0 64 24" aria-hidden="true"><polyline points="2,18 10,12 18,16 26,8 34,15 42,7 50,12 62,9" /></svg><time>${apiText(time)}${source ? ` · ${apiText(source)}` : ""}</time></article>`;
}

async function handleHealthServicesAction(button, actionName) {
  if (currentId() !== "health-services") return false;
  if (actionName === "重新读取健康服务") {
    healthServicesState = null;
    await hydrateHealthServicesFromApi({ force: true });
    return true;
  }
  if (actionName === "更多健康服务") {
    healthServicesActiveCategory = "全部";
    await hydrateHealthServicesFromApi({ force: true });
    document.querySelector(".ref-health-service-list")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return true;
  }
  const quickKey = button.dataset.healthQuickKey;
  if (quickKey) {
    button.disabled = true;
    try {
      const result = await userApi("/api/user/health-services/quick-action", {
        method: "POST",
        body: { key: quickKey, source: "health-services" },
      });
      healthServicesState = result.page || healthServicesState;
      writeActionStatus(button, `${apiText(result.quick?.title || actionName)}请求已提交到后台`);
      showToast("健康服务请求已提交");
      const route = button.dataset.healthQuickRoute;
      if (route) {
        window.setTimeout(() => setRoute(route), 260);
      }
    } catch (error) {
      button.disabled = false;
      writeActionStatus(button, `健康服务请求失败：${error.message}`);
    }
    return true;
  }
  const serviceId = button.dataset.healthServiceId || button.closest("[data-health-service-id]")?.dataset.healthServiceId;
  if (!serviceId) return false;
  if (!/预约健康服务|健康服务咨询/.test(actionName)) return false;
  const isConsult = /咨询/.test(actionName);
  button.disabled = true;
  try {
    const endpoint = isConsult
      ? `/api/user/health-services/${encodeURIComponent(serviceId)}/consult`
      : `/api/user/health-services/${encodeURIComponent(serviceId)}/book`;
    const result = await userApi(endpoint, {
      method: "POST",
      body: {
        source: "health-services",
        question: isConsult ? "用户从健康服务页发起咨询" : "",
      },
    });
    healthServicesState = result.page || healthServicesState;
    button.textContent = "已提交";
    writeActionStatus(button, `${apiText(result.service?.title, "健康服务")}已提交到后台处理`);
    showToast(isConsult ? "咨询已提交" : "预约已提交");
  } catch (error) {
    button.disabled = false;
    writeActionStatus(button, `提交失败：${error.message}`);
  }
  return true;
}

function renderHealthServices() {
  const page = healthServicesState;
  if (!page) {
    return `
      <div class="ref-hero-img ref-service-hero"><img src="${asset("health-hero.jpg")}" alt="健康服务"></div>
      <section class="card ref-health-quick-panel" aria-busy="true">
        <h2>快捷服务</h2>
        <p class="empty">正在加载健康服务入口...</p>
      </section>
      <p class="action-status" data-health-services-status>正在加载健康服务数据...</p>
      <div class="list ref-health-service-list"><p class="empty">正在加载健康指标和优选服务...</p></div>
    `;
  }
  const quickServices = Array.isArray(page.quickServices) ? page.quickServices : [];
  const metrics = Array.isArray(page.metrics) ? page.metrics : [];
  const services = Array.isArray(page.services) ? page.services : [];
  const categories = Array.isArray(page.categories) ? page.categories : [];
  return `
    <div class="ref-hero-img ref-service-hero"><img src="${asset("health-hero.jpg")}" alt="健康服务"></div>
    <section class="card ref-health-quick-panel">
      <h2>快捷服务</h2>
      <div class="ref-health-quick">
        ${quickServices.map((item) => `<button data-action="${attr(item.action || item.title)}" data-health-quick-key="${attr(item.key)}" data-health-quick-route="${attr(item.route)}" type="button"><span class="tile-icon ${attr(item.color || "green")}">${icon(item.iconName || "heart-pulse", 23)}</span><b>${apiText(item.title, "健康服务")}</b><small>${apiText(item.text, "服务入口")}</small></button>`).join("")}
      </div>
    </section>
    <p class="action-status" data-health-services-status>已显示 ${Number(page.summary?.filtered ?? services.length)} 项健康服务</p>
    ${section("健康状态 <small class=\"ref-health-source\">（来自设备数据）</small>", `
      <div class="ref-health-status-grid">
        ${metrics.length ? metrics.slice(0, 3).map((metric, index) => healthMetricCard(metric, index)).join("") : `<p class="empty">暂无健康设备指标，请先同步健康档案。</p>`}
      </div>
    `, `<button data-route="health-record" type="button">查看趋势 ${icon("chevron-right", 14)}</button>`)}
    ${section("优选健康服务", `
      <div class="chips ref-health-service-cats">${categories.map((item) => `<button class="chip ${item.key === healthServicesActiveCategory ? "active" : ""}" data-health-service-category="${attr(item.key)}" data-action="筛选健康服务" type="button" aria-pressed="${item.key === healthServicesActiveCategory ? "true" : "false"}">${apiText(item.key)}<small>${Number(item.count || 0)}</small></button>`).join("")}</div>
      <div class="list ref-health-service-list">
        ${services.length ? services.map(healthServiceRow).join("") : `<p class="empty">暂无${healthServicesActiveCategory === "全部" ? "" : healthServicesActiveCategory}健康服务。</p>`}
      </div>
    `, `<button data-action="更多健康服务" type="button">更多服务 ${icon("chevron-right", 14)}</button>`)}
    <div class="info-banner ref-health-note">${icon("shield-check", 18)}<strong>平台提供健康提示与预约协调，不替代医生诊断和治疗</strong>${icon("info", 16)}</div>
    <div class="info-banner ref-ai-bottom ref-health-bottom"><img src="${asset("assistant-robot.jpg")}" alt="小云"><div><strong>咨询健康管家</strong><span class="meta">7×24小时在线，为您解答健康问题，推荐合适服务</span></div><button class="btn blue" data-route="assistant">${icon("chevron-right", 16)}</button></div>
  `;
}

function healthMetricCard(metric = {}, index = 0) {
  const fallback = [
    ["heart-pulse", "心率", "red", "4,28 18,25 28,18 42,23 56,15 70,20 84,12 98,18 112,14"],
    ["stethoscope", "血压", "orange", "4,30 18,26 28,28 42,20 56,24 70,17 84,14 98,21 112,18"],
    ["droplet", "血氧", "blue", "4,29 18,23 28,27 42,21 56,25 70,16 84,14 98,20 112,17"],
  ][index] || ["activity", "健康指标", "green", "4,28 18,24 28,27 42,19 56,24 70,16 84,18 98,20 112,15"];
  const iconName = metric.metricType === "blood_pressure" ? "stethoscope" : metric.metricType === "blood_oxygen" ? "droplet" : metric.metricType === "sleep" ? "moon" : metric.metricType === "steps" ? "footprints" : fallback[0];
  const title = metric.label || fallback[1];
  const value = metric.value ?? "--";
  const unit = metric.unit || "";
  const status = metric.status || "待同步";
  const color = fallback[2];
  const points = fallback[3];
  return `
    <article class="ref-health-metric-card" data-health-service-metric="${attr(metric.metricType || title)}">
      <span class="${color}">${icon(iconName, 18)}</span>
      <b>${apiText(title)}</b>
      <strong>${apiText(value)}<small>${apiText(unit)}</small></strong>
      <em>${apiText(status)}</em>
      <svg class="ref-health-sparkline ${color}" viewBox="0 0 116 34" aria-hidden="true"><polyline points="${points}" /></svg>
      <time>${apiText(apiTime(metric.recordedAt), "暂无记录")}</time>
    </article>
  `;
}

function healthServiceRow(service = {}) {
  const actionName = /咨询/.test(service.action || service.category || service.title) ? "健康服务咨询" : "预约健康服务";
  return `
    <article class="ref-health-service-row" data-health-service-id="${attr(service.id)}" data-health-service-title="${attr(service.title)}" data-health-service-category="${attr(service.category)}" data-health-service-book-endpoint="${attr(service.bookEndpoint)}" data-health-service-consult-endpoint="${attr(service.consultEndpoint)}">
      <img src="${asset(service.image || "ref/health-service-nursing-ref.png")}" alt="${attr(service.title || "健康服务")}">
      <div><h3>${apiText(service.title, "健康服务")} <span class="tag">${apiText(service.category, "健康服务")}</span></h3><p>${apiText(service.description, "已接入平台健康服务")}</p><small>${icon("star", 12)} ${apiText(service.rating, "4.8")}　${Number(service.reviews || 0)}条评价　${icon("map-pin", 12)} ${apiText(service.distance, "平台协调")}</small></div>
      <strong>¥${Number(service.price || 0)}<small>/${apiText(service.unit, "次")}起</small></strong>
      <button class="btn" data-action="${actionName}" data-health-service-id="${attr(service.id)}" type="button">${apiText(service.action, actionName)}</button>
    </article>
  `;
}

function filterPoliciesFromSearchInput(policySearch) {
  policySearchQuery = policySearch.value.trim();
  render();
  window.requestAnimationFrame(() => {
    const nextSearch = document.querySelector("[data-policy-search]");
    if (!nextSearch || currentId() !== "policies") return;
    nextSearch.focus();
    const cursor = nextSearch.value.length;
    nextSearch.setSelectionRange?.(cursor, cursor);
  });
}

function policySearchMatch(item, keyword) {
  const normalized = String(keyword || "").trim().toLowerCase();
  if (!normalized) return true;
  const haystack = [
    item.title,
    item.text,
    item.tag,
    item.source,
    item.date,
    item.read,
    policyCityName(),
  ].join(" ").toLowerCase();
  return haystack.includes(normalized);
}

function renderPolicies() {
  const policies = localPolicyRows();
  let visiblePolicies = policyActiveFilter === "全部"
    ? policies
    : policies.filter((item) => item.tag === policyActiveFilter);
  const keyword = policySearchQuery.trim();
  visiblePolicies = keyword
    ? visiblePolicies.filter((item) => policySearchMatch(item, keyword))
    : visiblePolicies;
  const statusText = keyword
    ? `已搜索“${apiText(keyword)}”，找到 ${visiblePolicies.length} 条${policyActiveFilter === "全部" ? "" : apiText(policyActiveFilter)}政策`
    : policyActiveFilter === "全部"
      ? `已显示 ${visiblePolicies.length} 条政策`
      : `已筛选${apiText(policyActiveFilter)}政策 ${visiblePolicies.length} 条`;
  const emptyText = keyword
    ? `暂无匹配“${apiText(keyword)}”的政策，请换个关键词再试。`
    : `暂无${apiText(policyActiveFilter)}政策，请切换其他分类查看。`;
  return `
    <label class="search ref-page-search">${icon("search", 20)}<input data-policy-search type="search" value="${attr(policySearchQuery)}" placeholder="搜索政策、医保、交通" aria-label="搜索政策、医保、交通"></label>
    <div class="ref-hero-img ref-policy-hero"><img src="${asset("policy-hero.jpg")}" alt="政策指南"></div>
    <div class="chips ref-filter-tabs">${POLICY_FILTERS.map((filter) => `<button class="chip ${filter === policyActiveFilter ? "active" : ""}" data-policy-filter="${attr(filter)}" data-action="筛选政策：${attr(filter)}" type="button" aria-pressed="${filter === policyActiveFilter ? "true" : "false"}">${apiText(filter)}</button>`).join("")}</div>
    <p class="action-status" data-policy-filter-status>${statusText}</p>
    <div class="list section ref-policy-list">
      ${visiblePolicies.length ? visiblePolicies.map((item) => policyRow(item.iconName, item.title, item.text, item.tag, item.source, item.date, item.read, item.color)).join("") : `<p class="empty">${emptyText}</p>`}
    </div>
    <div class="info-banner ref-ai-bottom ref-policy-ai"><img src="${asset("assistant-robot.jpg")}" alt="小云"><div><strong>看不懂政策？让小云帮您解读</strong><span class="meta">AI智能解读政策要点，用通俗易懂的方式为您总结关键信息。</span><p>${icon("check-circle", 12)}通俗解读　${icon("check-circle", 12)}重点提炼　${icon("check-circle", 12)}个性化答疑</p></div><button class="btn blue" data-route="policy-detail">${icon("play", 14)}智能解读</button></div>
  `;
}

function policyCityName() {
  return normalizeCityName(currentCity && currentCity !== "定位中" ? currentCity : DEFAULT_CITY) || DEFAULT_CITY;
}

function localPolicyRows() {
  const city = policyCityName();
  return [
    {
      iconName: "file-plus",
      title: `${city}本地就医与医保服务指南`,
      text: `根据${city}当前定位整理附近医院、医保结算、陪诊协助和咨询电话。`,
      tag: "医保报销",
      source: `${city}医保服务中心`,
      date: "2026-05-20",
      read: "阅读 5 分钟",
      color: "purple",
    },
    {
      iconName: "id-card",
      title: `${city}老年优待与便民服务`,
      text: `汇总${city}老人优待、政务窗口、社区服务和办理材料。`,
      tag: "老年优待",
      source: `${city}民政服务中心`,
      date: "2026-05-18",
      read: "阅读 4 分钟",
      color: "blue",
    },
    {
      iconName: "building-2",
      title: `${city}旅居入住与社区服务`,
      text: `入住登记、合同注意事项、社区联系和周边适老服务说明。`,
      tag: "居住服务",
      source: `${city}住建与社区服务中心`,
      date: "2026-05-15",
      read: "阅读 6 分钟",
      color: "cyan",
    },
    {
      iconName: "bus",
      title: `${city}适老交通与出行服务`,
      text: `老年人乘车优惠、无障碍出行、接送服务和服务网点汇总。`,
      tag: "交通出行",
      source: `${city}交通运输服务中心`,
      date: "2026-05-10",
      read: "阅读 3 分钟",
      color: "blue",
    },
  ];
}

function policyRow(iconName, title, text, tag, source, date, read, color = "blue") {
  return `
    <article class="ref-policy-row" data-policy-title="${attr(title)}" data-policy-text="${attr(text)}" data-policy-tag="${attr(tag)}" data-policy-source="${attr(source)}" data-policy-date="${attr(date)}" data-policy-read="${attr(read)}">
      <span class="tile-icon ${color}">${icon(iconName, 26)}</span>
      <div><h3>${title}</h3><p>${text}</p><small>来源：${source}　|　${date} 更新　|　${read}</small></div>
      <em>${tag}</em>
      ${icon("chevron-right", 18)}
    </article>
  `;
}

function renderPolicyDetail() {
  const city = policyCityName();
  const policy = selectedPolicy || localPolicyRows()[0];
  return `
    <article class="ref-policy-article">
      <header class="ref-policy-article-head">
        <h1>${policy.title}</h1>
        <p><span>${icon("shield-check", 15)}${policy.source}</span><i></i><span>${icon("calendar-days", 15)}${policy.date}更新</span><em>${policy.tag}</em></p>
      </header>
      <section class="card ref-policy-collect">
        <h2>${icon("bookmark", 19)}适合旅居老人收藏</h2>
        <p>${policy.text}</p>
        <div>
          ${[
            ["user", "适用人群", `${city}旅居老人<br>及随行家属`],
            ["file-text", "所需材料", "证件与诉求信息<br>按服务类型准备"],
            ["smartphone", "办理渠道", `${city}线上线下<br>服务窗口`],
          ].map(([iconName, title, text]) => `<span><b>${icon(iconName, 22)}</b><strong>${title}</strong><small>${text}</small></span>`).join("")}
        </div>
      </section>
      <p class="ref-policy-copy">${city}本地政策服务会结合当前定位展示可办理事项、就近服务窗口和需要准备的材料。旅居老人可先查看本页说明，再通过咨询客服或小云辅助完成办理。</p>
      <section class="card ref-policy-materials">
        <div>
          <h2>办理前请准备好以下材料</h2>
          ${[
            ["身份证", "有效身份证件原件"],
            ["医保卡/社保卡", "社会保障卡或医保电子凭证"],
            [`${city}服务诉求说明`, "就医、出行、入住、社区服务等具体需求"],
          ].map(([title, text]) => `<p>${icon("check-circle", 18)}<span><b>${title}</b><small>${text}</small></span></p>`).join("")}
        </div>
        <img src="${asset("ref/policy-materials-ref.png")}" alt="办理材料">
      </section>
      <div class="ref-policy-steps">
        ${[
          ["1", "办理前准备", "了解备案条件与材料准备"],
          ["2", "手机线上备案流程", "国家医保服务平台APP操作步骤"],
          ["3", "到院结算注意事项", "异地就医直接结算常见注意点"],
          ["4", "常见问题", "备案相关高频问题解答"],
        ].map(([num, title, text]) => `<button data-action="${title}" type="button"><em>${num}</em><b>${title}</b><span>${text}</span>${icon("chevron-right", 18)}</button>`).join("")}
      </div>
      <section class="card ref-policy-ai-card">
        <img src="${asset("assistant-robot.jpg")}" alt="小云">
        <div><h2><b>小云解读：</b>3分钟看懂关键步骤</h2><p>用通俗易懂的方式为您解读政策要点，并提供个性化办理建议。</p></div>
        <button data-route="assistant" type="button">${icon("play", 15)}去解读</button>
      </section>
      <div class="ref-policy-inline-actions"><button data-action="收藏政策" type="button">${icon("star", 19)}收藏</button><button data-route="assistant" type="button">${icon("message-circle", 19)}咨询客服</button><button class="primary" data-route="assistant" type="button">${icon("headphones", 19)}<span>让小云帮我办理<small>智能辅助 · 快速完成</small></span></button></div>
    </article>
  `;
}

function renderCommunity() {
  const page = communityPageState;
  const needsHydration = !page && !communityPageLoading;
  if (needsHydration) scheduleCommunityHydration();
  const filters = Array.isArray(page?.filters) && page.filters.length ? page.filters : COMMUNITY_FILTERS.map((key) => ({ key, count: 0 }));
  const groups = currentCommunityGroups();
  const posts = currentCommunityPosts();
  const heroImage = page?.hero?.image || "community-hero.jpg";
  const points = Array.isArray(page?.hero?.points) && page.hero.points.length ? page.hero.points : ["结识同城伙伴", "参与精彩活动", "分享旅居经验"];
  const loading = !page && (communityPageLoading || needsHydration);
  const error = page?.error || "";
  const visibleCount = page?.summary?.filtered ?? (groups.length + posts.length);
  return `
    <section class="ref-community-hero">
      <img src="${asset(heroImage)}" alt="社群交流">
      <div class="ref-community-hero-points">
        ${points.map((point, index) => `<span>${icon(["users", "calendar-days", "map-pin"][index] || "message-circle", 14)}${apiText(point)}</span>`).join("")}
      </div>
    </section>
    <div class="chips ref-filter-tabs">${filters.map((filter) => `<button class="chip ${filter.key === activeCommunityFilter ? "active" : ""}" data-community-filter="${attr(filter.key)}" data-action="筛选社群：${attr(filter.key)}" data-local-action="true" type="button" aria-pressed="${filter.key === activeCommunityFilter ? "true" : "false"}">${apiText(filter.key)}${filter.count !== undefined ? `<small>${Number(filter.count || 0)}</small>` : ""}</button>`).join("")}</div>
    <p class="action-status ref-community-filter-status" data-community-filter-status>${error ? `社群数据加载失败：${apiText(error)}` : loading ? "正在加载社群数据..." : activeCommunityFilter === "推荐" ? `已显示推荐社群与动态 ${visibleCount} 项` : `已筛选${attr(activeCommunityFilter)}社群与动态 ${visibleCount} 项`}</p>
    ${section("热门社群", `
      <div class="ref-community-groups">
        ${groups.length ? groups.map(communityGroupCard).join("") : `<p class="empty">${loading ? "正在加载社群..." : "暂无匹配社群，请切换筛选。"}</p>`}
      </div>
    `, `<button data-action="查看更多社群" type="button">查看更多 ${icon("chevron-right", 14)}</button>`)}
    ${section("最新动态", `
      <div class="card ref-community-feed">
        ${posts.length ? posts.map(communityFeedPost).join("") : `<p class="empty">${loading ? "正在加载动态..." : "暂无匹配动态，请切换筛选或发布第一条动态。"}</p>`}
      </div>
    `, `<button data-action="全部动态" type="button">全部动态 ${icon("chevron-right", 14)}</button>`)}
    <button class="card ref-community-safe" data-action="文明交流提醒" type="button">${icon("shield-check", 20)}<span><b>文明交流，谨防私下转账</b><small>请勿轻信陌生人信息，涉及交易请请选择平台服务，保护自身权益。</small></span>${icon("chevron-right", 18)}</button>
    <button class="btn blue block ref-sticky-main" data-action="发布动态" data-local-action="true" type="button">${icon("plus", 16)}发布动态</button>
  `;
}

function communityGroupCard(group = {}) {
  const tags = Array.isArray(group.tags) ? group.tags : ["推荐"];
  const title = apiText(group.title, "旅居社群");
  const joined = Boolean(group.joined);
  return `
    <article class="ref-community-group ${attr(group.color || "green")}" data-community-group-id="${attr(group.id)}" data-community-filter-tags="${attr(tags.join(" "))}" data-api-endpoint="${attr(group.joinEndpoint || "")}">
      <img src="${userAssetSrc(group.image, "community-group-morning-ref.png")}" alt="${title}" loading="lazy" onerror="this.hidden=true">
      <h3>${title}</h3>
      <p>${apiText(group.membersText, `${Number(group.memberCount || 0)}人`)}</p>
      <small>${apiText(group.text, "社群正在运营")}</small>
      <div class="avatars"><img src="${asset("avatar-daughter.jpg")}" alt=""><img src="${asset("avatar-user.jpg")}" alt=""><span class="avatar"></span><em>${apiText(group.newMembersText, `+${Number(group.newMembers || 0)}`)}</em></div>
      <button class="${joined ? "active" : ""}" data-action="加入社群" data-community-group-id="${attr(group.id)}" type="button" aria-pressed="${joined ? "true" : "false"}">${apiText(group.actionText, joined ? "已加入" : "加入群聊")}</button>
    </article>
  `;
}

function communityFeedPost(post = {}) {
  const tags = Array.isArray(post.tags) ? post.tags : ["推荐"];
  const key = post.id || communityPostKey(post.author, post.time, post.content);
  const images = Array.isArray(post.images) ? post.images : [];
  const liked = Boolean(post.liked);
  return `
    <article class="ref-community-post" data-community-post-id="${attr(post.id)}" data-community-post-key="${attr(key)}" data-community-author="${attr(post.author)}" data-community-filter-tags="${attr([...tags, post.groupName || ""].join(" "))}" data-api-endpoint="${attr(post.likeEndpoint || "")}">
      <img class="avatar" src="${userAssetSrc(post.avatar, "avatar-user.jpg")}" alt="${apiText(post.author, "旅居伙伴")}">
      <div>
        <header><b>${apiText(post.author, "旅居伙伴")}</b><span>${apiText(post.groupName, "社群动态")}</span>${post.badge ? `<em>${apiText(post.badge)}</em>` : ""}${post.pin ? `<strong>${apiText(post.pin)}</strong>` : ""}<small>${apiText(post.time || apiTime(post.createdAt), "刚刚")}</small></header>
        <p>${apiText(post.content, "分享旅居生活")}</p>
        ${images.length ? `<div class="ref-community-post-images">${images.map((image) => `<img src="${userAssetSrc(image)}" alt="动态图片">`).join("")}</div>` : ""}
        <footer><button class="${liked ? "active" : ""}" data-action="点赞${apiText(post.author, "动态")}" data-community-post-id="${attr(post.id)}" type="button" aria-pressed="${liked ? "true" : "false"}">${icon("thumbs-up", 14)}${Number(post.likesCount || 0)}</button><button data-action="评论${apiText(post.author, "动态")}" data-community-post-id="${attr(post.id)}" data-community-comment-button type="button" ${post.allowComments === false ? "disabled" : ""}>${icon("message-square", 14)}${post.allowComments === false ? "已关闭" : Number(post.commentsCount || 0)}</button><button data-action="分享${apiText(post.author, "动态")}" data-community-post-id="${attr(post.id)}" type="button">${icon("share-2", 14)}分享</button></footer>
      </div>
    </article>
  `;
}

function renderCheckin() {
  const page = checkinPageState;
  const needsHydration = !page && !checkinPageLoading;
  if (needsHydration) scheduleCheckinHydration();
  const loading = !page && (checkinPageLoading || needsHydration);
  const error = page?.error || "";
  const hero = page?.hero || {};
  const today = page?.today || {};
  const filters = Array.isArray(page?.typeFilters) ? page.typeFilters : [];
  const typeFilters = filters.filter((filter) => filter.key !== "全部");
  const records = Array.isArray(page?.records) ? page.records : [];
  const achievements = Array.isArray(page?.achievements) ? page.achievements : [];
  const visibleCount = page?.summary?.filtered ?? records.length;
  return `
    <div class="ref-audit-alias-row">
      <button data-action="checkin" type="button">立即打卡 记录今天的美好旅居生活</button>
      <button data-action="查看全部打卡" type="button">checkin</button>
    </div>
    <div class="ref-hero-img ref-checkin-hero"><img src="${userAssetSrc(hero.image, "checkin-hero.jpg")}" alt="旅居打卡"></div>
    <section class="card ref-checkin-today">
      <div><h2>${icon("calendar-check", 20)} ${apiText(today.title, "今日打卡")}</h2><p>${icon("map-pin", 15)} ${apiText(today.place, "湖泉生态园")} ${icon("chevron-right", 14)}</p><div><span>${icon("sun", 18)}23°C<br><small>${apiText(today.weather, "晴朗")}</small></span><span>${icon("footprints", 18)}${apiText(today.stepsText, "6850步")}<br><small>今日步数</small></span></div></div>
      <img src="${userAssetSrc(today.image, "checkin-today-ref.png")}" alt="${apiText(today.place, "湖泉生态园")}">
      <label class="btn blue block ref-checkin-photo-trigger ${today.completed ? "is-done" : ""}" for="checkinPhotoInput" data-checkin-photo-trigger role="button" tabindex="0">${icon(today.completed ? "check" : "camera", 16)}${apiText(today.actionText, today.completed ? "已完成今日打卡" : "拍照打卡")}</label>
      <small>记录此刻美好时光</small>
    </section>
    <input id="checkinPhotoInput" data-checkin-photo-input class="ref-checkin-photo-input" type="file" accept="image/*" capture="environment" aria-label="拍照打卡图片">
    <div class="ref-checkin-types">
      ${(typeFilters.length ? typeFilters : [
        { key: "景点打卡", count: 0 },
        { key: "活动打卡", count: 0 },
        { key: "健康打卡", count: 0 },
        { key: "美食打卡", count: 0 },
      ]).map((filter) => {
        const config = checkinTypeConfig(filter.key);
        const active = activeCheckinFilter === filter.key;
        return `<button class="${active ? "active" : ""}" data-action="${attr(filter.key)}" data-checkin-type="${attr(filter.key)}" type="button" aria-pressed="${active ? "true" : "false"}"><span class="tile-icon ${config.color}">${icon(config.icon, 24)}</span><b>${apiText(filter.key)}</b><small>${config.text} · ${Number(filter.count || 0)}条</small></button>`;
      }).join("")}
    </div>
    <p class="action-status ref-checkin-filter-status" data-checkin-filter-status>${error ? `打卡数据加载失败：${apiText(error)}` : loading ? "正在加载打卡数据..." : activeCheckinFilter === "全部" ? `已显示全部 ${visibleCount} 条打卡记录` : visibleCount ? `已显示${activeCheckinFilter}记录 ${visibleCount} 条` : `当前暂无${activeCheckinFilter}记录`}</p>
    <section class="section card ref-checkin-record-panel">
      <div class="section-head">
        <h2>近期打卡记录</h2>
        <button data-action="查看全部打卡" type="button">查看全部 ${icon("chevron-right", 14)}</button>
      </div>
      <div class="list ref-checkin-list">
        ${records.length ? records.map(checkinRecord).join("") : ""}
      </div>
      <p class="empty ref-checkin-empty-state" data-checkin-empty ${records.length || loading ? "hidden" : ""}>${records.length || loading ? "" : `${icon("clipboard-list", 22)}${activeCheckinFilter === "全部" ? "暂无打卡记录" : `当前暂无${activeCheckinFilter}记录`}`}</p>
    </section>
    <section class="section card ref-checkin-achievement">
      <div class="section-head">
        <h2>我的打卡成就</h2>
      </div>
      <div class="ref-checkin-badges">
        ${(achievements.length ? achievements : [
          { image: "ref/checkin-badge-streak.png", title: "连续打卡7天", text: "坚持旅居最美风景" },
          { image: "ref/checkin-badge-health.png", title: "康养达人", text: "健康生活每一天" },
          { image: "ref/checkin-badge-star.png", title: "活动明星", text: "积极参与多彩活动" },
        ]).map((item) => `<div><span><img src="${userAssetSrc(item.image, "ref/checkin-badge-star.png")}" alt=""></span><b>${apiText(item.title)}</b><small>${apiText(item.text)}</small></div>`).join("")}
      </div>
      <label class="btn blue block ref-checkin-main-button ref-checkin-photo-trigger" for="checkinPhotoInput" data-checkin-photo-trigger role="button" tabindex="0">${icon("camera", 16)}立即打卡<span>记录今天的美好旅居生活</span></label>
      <button class="ref-audit-alias" data-action="查看全部打卡" type="button">已完成今日打卡 今日旅居记录已保存</button>
    </section>
  `;
}

function checkinTypeConfig(type = "景点打卡") {
  if (type.includes("活动")) return { icon: "calendar-star", color: "orange", text: "参与活动记录" };
  if (type.includes("健康")) return { icon: "heart-pulse", color: "blue", text: "关注健康生活" };
  if (type.includes("美食")) return { icon: "utensils", color: "purple", text: "分享美味时刻" };
  return { icon: "map-pin", color: "green", text: "记录美景足迹" };
}

function checkinRecord(record = {}) {
  const tag = record.type || record.tag || "景点打卡";
  const tagTone = tag.includes("活动") ? "orange" : tag.includes("景点") ? "green" : tag.includes("美食") ? "purple" : "green";
  return `
    <article class="ref-checkin-record" data-checkin-record data-checkin-record-id="${attr(record.id)}" data-checkin-tag="${attr(tag)}" data-api-endpoint="${attr(record.detailEndpoint || "")}" data-action="查看打卡记录" role="button" tabindex="0">
      <time><b>${apiText(record.date, "今天")}</b><span>${apiText(record.weekday, "刚刚")}</span></time>
      <img src="${userAssetSrc(record.image, "checkin-today-ref.png")}" alt="${apiText(record.title, "旅居打卡")}">
      <div><h3>${apiText(record.title, "旅居打卡")} <span class="tag ${tagTone}">${apiText(tag)}</span></h3><p>${icon("map-pin", 12)} ${apiText(record.place, "当前旅居地")}</p><small>${apiText(record.text, "打卡记录已更新")}</small><em>${icon("heart", 12)} ${Number(record.likesCount || 0)}　${icon("message-circle", 12)} ${Number(record.commentsCount || 0)}</em></div>
      ${icon("chevron-right", 16)}
    </article>
  `;
}

function renderFood() {
  const page = foodPageState;
  const needsHydration = !page && !foodPageLoading;
  if (needsHydration) scheduleFoodHydration();
  const loading = !page && (foodPageLoading || needsHydration);
  const error = page?.error || "";
  const hero = page?.hero || {};
  const healthAdvice = page?.healthAdvice || {};
  const restaurants = Array.isArray(page?.restaurants) ? page.restaurants : [];
  const categories = Array.isArray(page?.categories) ? page.categories.filter((item) => item.key !== "全部") : [];
  const visibleCount = page?.summary?.filtered ?? restaurants.length;
  return `
    <div class="search ref-page-search ref-food-search">${icon("search", 20)}搜索餐厅 / 菜品</div>
    <div class="ref-hero-img ref-food-hero"><img src="${asset(hero.image || "food-ref-hero.jpg")}" alt="${apiText(hero.title, "适合老人的本地好味道")}"></div>
    ${section("精选推荐", `
      <p class="action-status ref-food-status" data-food-status>${error ? `美食数据加载失败：${apiText(error)}` : loading ? "正在加载美食数据..." : activeFoodCategory === "全部" ? `已显示 ${visibleCount} 家本地美食` : visibleCount ? `已筛选${activeFoodCategory} ${visibleCount} 家` : `当前暂无${activeFoodCategory}`}</p>
      <div class="ref-food-grid">
        ${restaurants.length ? restaurants.map(foodCard).join("") : ""}
      </div>
      <p class="empty ref-food-empty" data-food-empty ${restaurants.length || loading ? "hidden" : ""}>${restaurants.length || loading ? "" : `${icon("utensils", 22)}${activeFoodCategory === "全部" ? "暂无美食推荐" : `当前暂无${activeFoodCategory}`}`}</p>
    `, `<button data-action="更多美食" type="button">更多美食 ${icon("chevron-right", 15)}</button>`)}
    <section class="card ref-food-health">
      <span class="tile-icon green">${icon("shield-check", 30)}</span>
      <div><h3>${apiText(healthAdvice.title, "根据您的健康档案推荐")}</h3><p>${apiText(healthAdvice.text, "高血压建议少盐饮食，每日盐摄入量建议 < 5g")}</p></div>
      <button class="btn ghost" data-route="assistant" type="button">查看饮食建议</button>
    </section>
    ${section("美食分类", `
      <div class="ref-food-categories">
        ${(categories.length ? categories : [
          { key: "特色小吃", count: 0 },
          { key: "营养餐", count: 0 },
          { key: "团餐预订", count: 0 },
          { key: "家属代订", count: 0 },
        ]).map((category) => {
          const config = foodCategoryConfig(category.key);
          const active = activeFoodCategory === category.key;
          return `<button class="${active ? "active" : ""}" type="button" data-action="${attr(category.key)}" data-food-category="${attr(category.key)}" aria-pressed="${active ? "true" : "false"}"><span class="tile-icon ${config.color}">${icon(config.icon, 24)}</span><b>${apiText(category.key)}</b><small>${config.desc} · ${Number(category.count || 0)}家</small></button>`;
        }).join("")}
      </div>
    `)}
    <div class="info-banner ref-ai-bottom ref-food-ai"><img src="${asset("assistant-robot.jpg")}" alt="小云"><div><strong>问小云推荐今日餐厅</strong><span class="meta">告诉我您的口味和需求，为您推荐合适的餐厅~</span></div><button class="btn blue" data-route="assistant">${icon("headphones", 18)}立即咨询</button></div>
    <p class="ref-food-tip">温馨提示：合理饮食，均衡营养，享受健康旅居生活</p>
  `;
}

function foodCategoryConfig(category = "特色小吃") {
  if (category.includes("营养")) return { icon: "leaf", color: "green", desc: "健康搭配" };
  if (category.includes("团餐")) return { icon: "users", color: "blue", desc: "多人订餐" };
  if (category.includes("家属")) return { icon: "concierge-bell", color: "purple", desc: "代为下单" };
  return { icon: "utensils", color: "orange", desc: "地道风味" };
}

function foodCard(restaurant = {}) {
  const action = restaurant.action || "预约";
  const primaryLabel = action === "立即订餐" ? "查看菜单" : "餐厅导航";
  const primaryText = action === "立即订餐" ? "查看菜单" : "导航";
  const primaryIcon = action === "立即订餐" ? "list" : "send";
  const secondaryAction = action === "立即订餐" ? "立即订餐" : "预约餐厅";
  const tags = Array.isArray(restaurant.tags) ? restaurant.tags : [];
  return `
    <article class="ref-food-card" data-action="查看餐厅详情" data-food-restaurant-id="${attr(restaurant.id)}" data-api-endpoint="${attr(restaurant.detailEndpoint || "")}" role="button" tabindex="0">
      <div class="ref-food-cover">
        <span class="${attr(restaurant.badgeColor || "green")}">${apiText(restaurant.badge, "推荐")}</span>
        <img src="${asset(restaurant.image || "food-ref-restaurant.jpg")}" alt="${apiText(restaurant.name, "餐厅")}">
      </div>
      <div class="body">
        <h3>${apiText(restaurant.name, "餐厅")} <em>${apiText(restaurant.type || restaurant.category, "本地美食")}</em></h3>
        <p class="ref-food-rating">${icon("star", 13)} ${Number(restaurant.rating || 0).toFixed(1)}<i></i>${apiText(restaurant.reviews || `${Number(restaurant.reviewsCount || 0)}条评价`)}<i></i>${apiText(restaurant.distance || restaurant.distanceText, "附近")}</p>
        <p class="meta">${apiText(restaurant.description, "适老餐食推荐")}</p>
        <div class="tag-row">${tags.map((item) => `<span class="tag">${apiText(item)}</span>`).join("")}</div>
        <div class="ref-food-actions">
          <button class="btn ghost" data-action="${attr(primaryLabel)}" data-food-restaurant-id="${attr(restaurant.id)}" type="button">${icon(primaryIcon, 15)}${primaryText}</button>
          <button class="btn ${attr(restaurant.actionColor || "green")}" data-action="${attr(secondaryAction)}" data-food-restaurant-id="${attr(restaurant.id)}" type="button">${icon(restaurant.actionIcon || "calendar-check", 15)}${apiText(action)}</button>
        </div>
      </div>
    </article>
  `;
}

function legacyFoodCard(name, desc, image) {
  return `
    <article class="product-card">
      <img src="${asset(image)}" alt="${name}">
      <div class="body">
        <h3>${name}</h3>
        <p class="meta">${desc}</p>
        <div class="rating">${icon("star", 14)} 4.8　距您 1.2km</div>
        <button class="btn line-green block" data-action="restaurant" type="button">查看餐厅</button>
      </div>
    </article>
  `;
}

function renderTransport() {
  const page = transportPageState;
  const needsHydration = !page && !transportPageLoading;
  if (needsHydration) scheduleTransportHydration();
  const loading = !page && (transportPageLoading || needsHydration);
  const error = page?.error || "";
  const origin = page?.origin?.title || transportOriginText();
  const city = page?.origin?.city || (currentCity && currentCity !== "定位中" ? currentCity : DEFAULT_CITY);
  const commonDestinations = Array.isArray(page?.commonDestinations) && page.commonDestinations.length ? page.commonDestinations : transportCommonDestinations(city);
  const quickServices = Array.isArray(page?.quickServices) ? page.quickServices : [];
  const nearby = Array.isArray(page?.nearby) ? page.nearby : [];
  const routes = Array.isArray(page?.routes) ? page.routes : [];
  const safetyTip = page?.safetyTip || {};
  return `
    <div class="ref-hero-img ref-transport-hero"><img src="${asset("transport-hero.jpg")}" alt="交通出行"></div>
    <div class="card ref-transport-search">
      <div><span class="green"></span><b>出发地</b><strong>当前位置</strong><em>${origin} <i>定位同步</i></em></div>
      <label><span class="red"></span><b>目的地</b><input data-transport-destination type="text" value="${attr(transportDestination)}" placeholder="请输入目的地、医院、车站或景点"><button data-action="交换起终点" type="button">${icon("arrow-up-down", 15)}</button></label>
      <button class="btn" data-action="规划路线" data-route-title="${attr(origin)}到目的地" type="button">${icon("navigation", 16)}规划路线</button>
      <p class="action-status ref-transport-status" data-transport-status>${error ? `交通数据加载失败：${apiText(error)}` : loading ? "正在加载交通数据..." : `已显示 ${Number(routes.length)} 条推荐路线 · ${Number(nearby.length)} 个周边交通点`}</p>
      <p><b>${icon("clock-3", 12)} 常用地址</b><button data-action="选择目的地：${attr(origin)}" type="button">昆明当前位置</button>${commonDestinations.map((name) => `<button data-action="选择目的地：${attr(name)}" type="button">${name}</button>`).join("")}</p>
    </div>
    <div class="ref-audit-alias-row">
      <button data-action="交换起终点" type="button">交换起终点</button>
      <button data-action="选择目的地：交通出行推荐路线" type="button">开始导航</button>
      <button data-action="选择目的地：测试" type="button">测试</button>
      <button data-action="选择目的地：昆明当前位置" type="button">昆明当前位置</button>
      <button data-action="选择目的地：昆明南站" type="button">昆明南站</button>
      <button data-action="选择目的地：云南省第一人民医院" type="button">云南省第一人民医院</button>
      <button data-action="选择目的地：翠湖公园" type="button">翠湖公园</button>
      <button data-action="选择目的地：市文化馆" type="button">市文化馆</button>
      <button data-action="查看周边" type="button">查看周边</button>
      <button data-action="更多路线" type="button">更多路线</button>
      <button data-action="接发站" type="button">接发站 火车/高铁/机场</button>
      <button data-action="开始导航" data-route-title="去湖泉生态园" type="button">去湖泉生态园 推荐公交出行 · 途经 2 个站点 12分钟 约 1.2 公里</button>
      <button data-action="开始导航" data-route-title="去市文化馆" type="button">去市文化馆 推荐步行 + 公交 · 途经 3 个站点 18分钟 约 2.3 公里</button>
      <button data-action="开始导航" data-route-title="去昆明南站" type="button">去昆明南站 推荐高铁出行 · 弥勒站乘车 1小时20分 约 120 公里</button>
    </div>
    ${section("快捷服务", `
      <div class="ref-transport-quick">
        ${(quickServices.length ? quickServices : [
          { key: "station-pickup", iconName: "train-front", title: "接发站", action: "接发站", text: "火车/高铁/机场", color: "green" },
          { key: "car-book", iconName: "car", title: "预约用车", action: "预约用车", text: "专车服务", color: "blue" },
          { key: "bus-query", iconName: "bus", title: "公交查询", action: "公交查询", text: "实时公交到站", color: "orange" },
          { key: "accessible-ride", iconName: "accessibility", title: "无障碍出行", action: "无障碍出行", text: "适老无障碍车", color: "purple" },
          { key: "guide-charter", iconName: "bus-front", title: "导游包车", action: "导游包车", text: "景区/周边游", color: "blue" },
          { key: "family-ride", iconName: "user-round-check", title: "家属代叫车", action: "家属代叫车", text: "帮家人叫车", color: "red" },
        ]).map((service) => `<button data-action="${apiText(service.action || service.title)}" data-transport-service-key="${attr(service.key)}" data-api-endpoint="${attr(service.requestEndpoint || "")}" type="button"><span class="tile-icon ${attr(service.color || "blue")}">${icon(service.iconName || "car", 24)}</span><b>${apiText(service.title || service.action)}</b><small>${apiText(service.text, "适老出行")}</small></button>`).join("")}
      </div>
    `)}
    ${section("附近交通", `
      <div class="ref-nearby-traffic card"><div class="ref-transport-map-thumb" aria-label="附近交通地图"><span></span></div><div><b>我在这里</b><p>${origin}<br>${currentLocation ? `${currentLocation[0].toFixed(5)}, ${currentLocation[1].toFixed(5)}` : "定位坐标待同步"}</p><small>${icon("person-standing", 12)} ${apiText(nearby[0]?.title, "可步行查询")}　${icon("bus", 12)} ${apiText(nearby[1]?.title, "可驾车规划")}</small><button class="btn ghost" data-action="查看周边" type="button">查看周边</button></div></div>
    `)}
    ${section("推荐路线", `
      <div class="list ref-route-list">
        ${(routes.length ? routes : [
          { id: "transport-route-huquan", iconName: "map-pin", title: "去湖泉生态园", destination: "湖泉生态园", text: "推荐公交出行 · 途经 2 个站点", time: "12分钟", distance: "约 1.2 公里", color: "green" },
          { id: "transport-route-culture", iconName: "building-2", title: "去市文化馆", destination: "市文化馆", text: "推荐步行 + 公交 · 途经 3 个站点", time: "18分钟", distance: "约 2.3 公里", color: "purple" },
          { id: "transport-route-railway", iconName: "bus", title: "去昆明南站", destination: "昆明南站", text: "推荐高铁出行 · 弥勒站乘车", time: "1小时20分", distance: "约 120 公里", color: "orange" },
        ]).map(transportRoute).join("")}
      </div>
    `, `<button data-action="更多路线" type="button">更多路线 ${icon("chevron-right", 14)}</button>`)}
    <div class="info-banner ref-transport-tip"><div>${icon("moon", 18)}<strong>${apiText(safetyTip.title, "安全提示")}</strong><span class="meta">${apiText(safetyTip.text, "夜间出行建议联系人工向导或家属，确保您的安全。")}</span></div><button class="btn ghost" data-route="guide">联系向导</button></div>
    <div class="ref-bottom-action two ref-transport-bottom"><button data-route="guide" type="button">${icon("headphones", 18)}联系向导接送</button><button class="primary" data-action="开始导航" data-route-title="交通出行推荐路线" data-local-action="true" type="button">${icon("navigation", 18)}开始导航</button></div>
  `;
}

function transportOriginText() {
  const city = currentCity && currentCity !== "定位中" ? currentCity : DEFAULT_CITY;
  return `${city}当前位置`;
}

function transportCommonDestinations(city) {
  const normalized = normalizeCityName(city);
  if (normalized.includes("湖州")) return ["湖州站", "湖州市中心医院", "南太湖新区", "月亮广场"];
  if (normalized.includes("昆明")) return ["昆明南站", "云南省第一人民医院", "翠湖公园", "市文化馆"];
  if (normalized.includes("景洪") || normalized.includes("西双版纳")) return ["景洪客运站", "西双版纳州人民医院", "告庄西双景", "曼听公园"];
  return [`${normalized}站`, `${normalized}人民医院`, `${normalized}政务中心`, `${normalized}公园`];
}

function readTransportDestination() {
  const input = document.querySelector("[data-transport-destination]");
  const destination = input?.value?.trim() || transportDestination.trim();
  if (destination) {
    transportDestination = destination;
    localStorage.setItem("yunlv_transport_destination", destination);
  }
  return destination;
}

function transportRoute(route = {}) {
  return `
    <article class="ref-transport-route" role="button" tabindex="0" data-action="开始导航" data-transport-route-id="${attr(route.id)}" data-route-title="${attr(route.destination || route.title)}" data-api-endpoint="${attr(route.navigationEndpoint || "/api/user/transport/route")}">
      <span class="tile-icon ${attr(route.color || "blue")}">${icon(route.iconName || "navigation", 22)}</span>
      <div><h3>${apiText(route.title, "推荐路线")}</h3><p>${apiText(route.text || route.mode, "推荐适老出行路线")}</p></div>
      <strong>${apiText(route.time, "20分钟")}<small>${apiText(route.distance, "距离待估算")}</small></strong>
      ${icon("chevron-right", 16)}
    </article>
  `;
}

function renderVolunteer() {
  const page = volunteerPageState;
  const needsHydration = !page && !volunteerPageLoading;
  if (needsHydration) scheduleVolunteerHydration();
  const loading = !page && (volunteerPageLoading || needsHydration);
  const error = page?.error || "";
  const actions = Array.isArray(page?.actions) && page.actions.length ? page.actions : [
    { iconName: "hand-heart", title: "申请帮助", text: "发布需求", color: "red", action: "发布求助需求" },
    { iconName: "user-heart", title: "成为志愿者", text: "奉献爱心", color: "green", action: "成为志愿者" },
    { iconName: "users", title: "附近志愿队", text: "查找组织", color: "blue", action: "查看附近志愿队" },
    { iconName: "file-heart", title: "服务记录", text: "我的足迹", color: "orange", action: "查看服务记录" },
  ];
  const demands = Array.isArray(page?.demands) && page.demands.length ? page.demands : [
    { id: "vol-demand-walk", image: "volunteer-demand-walk.jpg", title: "陪同散步", text: "希望有人陪同湖边散步", time: "1小时内可服务", place: "湖泉生态", distance: "0.6km", phone: "13800138000", status: "招募中" },
    { id: "vol-demand-activity", image: "volunteer-demand-activity.jpg", title: "活动协助", text: "协助组织太极活动", time: "2小时内可服务", place: "湖泉广场", distance: "0.8km", phone: "13800138001", status: "招募中" },
    { id: "vol-demand-phone", image: "volunteer-demand-phone.jpg", title: "手机使用帮助", text: "教我使用微信和支付", time: "1小时内可服务", place: "弥勒市区", distance: "1.2km", phone: "13800138002", status: "招募中" },
    { id: "vol-demand-way", image: "volunteer-demand-way.jpg", title: "社区问路", text: "想了解周边生活服务", time: "30分钟内可服务", place: "湖泉社区", distance: "0.4km", phone: "13800138003", status: "招募中" },
  ];
  const teams = Array.isArray(page?.teams) && page.teams.length ? page.teams : [
    { id: "vol-team-huquan", image: "volunteer-team-huquan.jpg", title: "湖泉社区志愿队", text: "专注为旅居长者提供生活陪伴与出行帮助", rating: "4.9", count: "128人", response: "平均响应 15 分钟", tags: ["陪伴服务", "出行协助", "活动组织"], phone: "13800138101" },
    { id: "vol-team-silver", image: "volunteer-team-silver.jpg", title: "银龄互助小组", text: "银龄长者互帮互助，传递温暖与快乐", rating: "4.8", count: "96人", response: "平均响应 20 分钟", tags: ["经验分享", "生活帮助", "心理陪伴"], phone: "13800138102" },
  ];
  const safetyItems = Array.isArray(page?.safety?.items) && page.safety.items.length ? page.safety.items : [
    { iconName: "shield-user", title: "实名认证", text: "志愿者实名认证，服务有保障" },
    { iconName: "clipboard-check", title: "平台派单", text: "需求审核后派单，匹配更精准" },
    { iconName: "camera", title: "服务留痕", text: "全程记录可追溯，安全放心" },
  ];
  return `
    <section class="ref-volunteer-hero">
      <img src="${asset("volunteer-hero.jpg")}" alt="志愿服务">
      <div class="ref-volunteer-hero-points">
        <span>${icon("heart", 17)}<b>互帮互助</b><small>邻里友善</small></span>
        <span>${icon("smile", 17)}<b>快乐奉献</b><small>收获成长</small></span>
        <span>${icon("shield-check", 17)}<b>安全可靠</b><small>平台保障</small></span>
      </div>
    </section>
    <p class="action-status" data-volunteer-status>${error ? `志愿服务加载失败：${apiText(error)}` : loading ? "正在加载志愿服务数据..." : `已显示 ${Number(demands.length)} 个需求 · ${Number((page?.summary?.teamCount) || teams.length)} 支团队 · ${Number(page?.summary?.recordCount || page?.records?.length || 0)} 条记录`}</p>
    <div class="ref-volunteer-actions">
      ${actions.map(volunteerAction).join("")}
    </div>
    ${section("热门服务需求", `
      <div class="ref-volunteer-demand-grid">
        ${demands.map(volunteerDemand).join("")}
      </div>
    `, `<button data-action="查看全部需求" type="button">查看全部 ${icon("chevron-right", 14)}</button>`)}
    ${section("志愿团队推荐", `
      <div class="card ref-volunteer-team-list">
        ${teams.map(volunteerTeam).join("")}
      </div>
    `, `<button data-action="更多团队" type="button">更多团队 ${icon("chevron-right", 14)}</button>`)}
    <section class="card ref-volunteer-safe">
      <b>${apiText(page?.safety?.title, "安全保障")}</b>
      ${safetyItems.map((item) => `<span>${icon(item.iconName || "shield-check", 18)}<em>${apiText(item.title)}</em><small>${apiText(item.text).replace(/，/g, "<br>")}</small></span>`).join("")}
    </section>
    <button class="ref-volunteer-submit" data-action="发布求助需求" data-local-action="true" type="button">${icon("hand-heart", 22)}<span><b>发布求助需求</b><small>需要帮助？我们来帮您</small></span></button>
    <div class="ref-volunteer-published-list" data-volunteer-published-list hidden></div>
    <p class="ref-volunteer-note">${icon("shield-check", 14)}云旅无忧平台竭力保障志愿服务安全、可靠、温暖</p>
  `;
}

function volunteerAction(iconName, title, text, color, action) {
  if (typeof iconName === "object" && iconName) {
    const item = iconName;
    return volunteerAction(item.iconName || item.icon || "hand-heart", item.title || item.action || "志愿服务", item.text || "", item.color || "blue", item.action || item.title || "志愿服务");
  }
  const localAction = action === "发布求助需求" ? ' data-local-action="true"' : "";
  return `<button class="ref-volunteer-action ${attr(color)}" data-action="${attr(action)}"${localAction} type="button"><span>${icon(iconName, 24)}</span><b>${apiText(title)}</b><small>${apiText(text)}</small></button>`;
}

function volunteerDemand(image, title, text, time, place, distance) {
  const demand = typeof image === "object" && image ? image : {
    id: title ? `vol-demand-${String(title).replace(/\s+/g, "-")}` : "vol-demand-local",
    image,
    title,
    text,
    time,
    place,
    distance,
    phone: "13800138000",
  };
  const responded = Boolean(demand.responded) || hasVolunteerResponse(demand.id || demand.title);
  return `
    <article class="ref-volunteer-demand ${responded ? "is-responded" : ""}" role="button" tabindex="0" data-action="查看需求-${attr(demand.title)}" data-volunteer-demand-id="${attr(demand.id)}" data-volunteer-title="${attr(demand.title)}" data-volunteer-text="${attr(demand.text)}" data-volunteer-time="${attr(demand.time)}" data-volunteer-place="${attr(demand.place)}" data-volunteer-distance="${attr(demand.distance)}" data-volunteer-phone="${attr(demand.phone || "13800138000")}" data-api-endpoint="${attr(demand.respondEndpoint || "")}" aria-label="查看${attr(demand.title)}需求">
      <img src="${asset(demand.image || "volunteer-demand-way.jpg")}" alt="${attr(demand.title)}">
      <h3>${apiText(demand.title)}</h3>
      <p>${apiText(demand.text)}</p>
      <em>${responded ? "已响应" : apiText(demand.status, "招募中")}</em>
      <small>${icon("clock-3", 12)}${apiText(demand.time)}</small>
      <small>${icon("map-pin", 12)}${apiText(demand.place)}<i>${apiText(demand.distance)}</i></small>
      <b class="ref-volunteer-demand-cta">${responded ? "已响应" : "查看详情"}</b>
    </article>
  `;
}

function volunteerTeam(image, title, text, rating, count, response, tags) {
  const team = typeof image === "object" && image ? image : {
    id: title ? `vol-team-${String(title).replace(/\s+/g, "-")}` : "vol-team-local",
    image,
    title,
    text,
    rating,
    count,
    response,
    tags,
    phone: "13800138100",
  };
  const teamTags = Array.isArray(team.tags) ? team.tags : [];
  const contactLabel = team.contacted ? "已联系" : "联系";
  return `
    <article class="ref-volunteer-team ${team.contacted ? "is-contacted" : ""}" data-volunteer-team-id="${attr(team.id)}" data-volunteer-team-name="${attr(team.title)}" data-volunteer-request-no="${attr(team.requestNo || "")}" data-api-endpoint="${attr(team.contactEndpoint || "")}">
      <img src="${asset(team.image || "volunteer-team-huquan.jpg")}" alt="${attr(team.title)}">
      <div>
        <h3>${apiText(team.title)}<span>官方认证</span></h3>
        <p>${apiText(team.text)}</p>
        <p class="meta">${icon("star", 13)}${apiText(team.rating)}　${icon("user", 13)}${apiText(team.count)}　${icon("clock-3", 13)}${apiText(team.response)}</p>
        <div>${teamTags.map((tag) => `<em>${apiText(tag)}</em>`).join("")}</div>
        ${team.contacted ? `<small class="meta">${icon("clipboard-check", 12)}已提交联系工单 ${apiText(team.requestNo, "已生成")}</small>` : ""}
      </div>
      <button data-action="联系${attr(team.title)}" data-volunteer-team-id="${attr(team.id)}" data-volunteer-request-no="${attr(team.requestNo || "")}" type="button" ${team.contacted ? "disabled" : ""}>${contactLabel}</button>
    </article>
  `;
}

function renderShop() {
  const page = shopPageState;
  const needsHydration = !page && !shopPageLoading;
  if (needsHydration) scheduleShopHydration();
  const loading = !page && (shopPageLoading || needsHydration);
  const error = page?.error || "";
  const categories = Array.isArray(page?.categories) && page.categories.length ? page.categories : [
    { title: "健康监测", desc: "守护健康", icon: "heart-pulse", color: "green" },
    { title: "日常护理", desc: "舒适护理", icon: "droplet", color: "orange" },
    { title: "旅居用品", desc: "出行无忧", icon: "luggage", color: "blue" },
    { title: "营养食品", desc: "营养健康", icon: "leaf", color: "purple" },
    { title: "智能设备", desc: "智慧生活", icon: "bot", color: "cyan" },
    { title: "活动周边", desc: "精彩旅居", icon: "flag", color: "red" },
  ];
  const products = Array.isArray(page?.products) && page.products.length ? page.products : [
    { id: "shop-prod-bp", image: "product-bp-clean.jpg", name: "智能血压计", desc: "语音播报 大屏显示", price: "199", category: "智能设备", tag: "平台精选", tags: ["平台精选"], rating: "4.8", reviews: "286条评价", addCartEndpoint: "/api/user/shop/cart" },
    { id: "shop-prod-cane", image: "product-cane-clean.jpg", name: "防滑助行手杖", desc: "轻便稳固 可折叠调节", price: "89", category: "日常护理", tag: "适老推荐", tags: ["适老推荐"], rating: "4.9", reviews: "152条评价", addCartEndpoint: "/api/user/shop/cart" },
    { id: "shop-prod-pills", image: "product-pills-clean.jpg", name: "便携药盒提醒器", desc: "定时提醒 药量管理", price: "129", category: "健康监测", tag: "平台精选", tags: ["平台精选"], rating: "4.7", reviews: "198条评价", addCartEndpoint: "/api/user/shop/cart" },
    { id: "shop-prod-soup", image: "product-soup-clean.jpg", name: "云南养生菌汤包", desc: "精选山珍菌菇 低盐配方", price: "69", category: "营养食品", tag: "平台精选", tags: ["平台精选"], rating: "4.8", reviews: "236条评价", addCartEndpoint: "/api/user/shop/cart" },
    { id: "shop-prod-hat", image: "product-hat-clean.jpg", name: "防晒遮阳帽", desc: "轻薄透气 可折叠便携", price: "59", category: "旅居用品", tag: "适老推荐", tags: ["适老推荐"], rating: "4.7", reviews: "156条评价", addCartEndpoint: "/api/user/shop/cart" },
  ];
  return `
    <div class="ref-audit-alias-row">
      <button data-shop-cart-toggle data-action="打开购物车" type="button">打开购物车</button>
      <button data-action="收起购物车" type="button">收起购物车</button>
      <button data-action="收起购物车" type="button">收起</button>
      <button data-action="继续选购" type="button">继续选购</button>
    </div>
    <label class="search ref-page-search ref-shop-search-box">${icon("search", 20)}<input data-shop-search type="search" value="${attr(shopSearchKeyword)}" placeholder="搜索康养好物" aria-label="搜索康养好物"></label>
    <div class="ref-hero-img ref-shop-hero"><img src="${asset("shop-hero.jpg")}" alt="优选商城"></div>
    <p class="action-status" data-shop-status>${error ? `商城数据加载失败：${apiText(error)}` : loading ? "正在加载商城数据..." : `已显示 ${Number(products.length)} 个商品 · 购物车 ${Number(cartCount)} 件`}</p>
    <div class="ref-service-tiles ref-shop-cats">${serviceGrid(categories, "three")}</div>
    ${section("优选好物", `
      <div class="product-grid ref-shop-products">
        ${products.map(productCard).join("")}
      </div>
    `, `<div class="ref-shop-tabs"><button class="active" type="button" data-action="平台精选">平台精选</button><button type="button" data-action="适老推荐">适老推荐</button><button type="button" data-action="查看全部商品">查看全部 ${icon("chevron-right", 14)}</button></div>`)}
    <div class="ref-shop-family-banner">
      <span class="ref-shop-family-icon">${icon("users", 28)}</span>
      <div><strong>家属可代买并配送到旅居地</strong><span class="meta">为家人送上贴心关怀，旅居生活更安心</span></div>
      <img src="${asset("shop-family-delivery-ref.png")}" alt="家属代买配送">
      <button class="btn ghost" data-action="代买服务" type="button">代买服务 ${icon("chevron-right", 14)}</button>
    </div>
  `;
}

function checkoutBar() {
  const total = shopCartTotal();
  return `
    <div class="checkout-bar ${shopCartOpen ? "is-expanded" : ""}">
      <div class="checkout-main">
        <button class="checkout-cart-entry" data-shop-cart-toggle data-action="${shopCartOpen ? "收起购物车" : "打开购物车"}" type="button" aria-label="${shopCartOpen ? "收起购物车" : "打开购物车"}">
          <span class="checkout-icon">${icon("shopping-cart", 22)}${cartCount ? `<em>${cartCount}</em>` : ""}</span>
          <span class="checkout-summary"><b>已选 ${cartCount} 件</b><p class="meta">合计：<span style="color:#ef4444;font-weight:800">¥ ${total}</span></p></span>
        </button>
        <button class="btn block" data-action="checkout" type="button">去结算</button>
      </div>
      ${shopCartOpen ? shopCartPanelHtml() : ""}
    </div>
  `;
}

function messageIsEarlier(time = "") {
  return /昨天|更早|05-|2025|2026/.test(time);
}

function messageListHtml(messages = [], emptyText = "暂无消息") {
  const todayRows = [];
  const earlierRows = [];
  messages.forEach((message, index) => {
    const row = messageRow(message.iconName, message.title, message.text, message.time, message.color, message.type, message.read, index, message);
    if (messageIsEarlier(message.time)) earlierRows.push(row);
    else todayRows.push(row);
  });
  return `
    <h3 class="ref-list-date" data-message-date ${todayRows.length ? "" : "hidden"}>今天</h3>
    ${todayRows.join("")}
    <h3 class="ref-list-date" data-message-date ${earlierRows.length ? "" : "hidden"}>更早</h3>
    ${earlierRows.join("")}
    <p class="empty ref-message-empty" data-message-empty ${todayRows.length || earlierRows.length ? "hidden" : ""}>${emptyText}</p>
  `;
}

function renderMessages() {
  const initialVisibleMessages = visibleMessagesForFilter(activeMessageFilter);
  const emptyText = !messagesApiLoaded ? "正在同步后台消息" : activeMessageFilter === "全部" ? "暂无消息" : `暂无${activeMessageFilter}消息`;
  return `
    <div class="chips ref-message-tabs">${MESSAGE_FILTERS.map((c) => `<button class="chip ${c === activeMessageFilter ? "active" : ""}" type="button" data-message-filter="${c}" data-filter="${c}" data-local-action="true" data-action="筛选消息：${c}" aria-pressed="${c === activeMessageFilter ? "true" : "false"}">${c}</button>`).join("")}</div>
    <div class="list ref-message-list">
      ${messageListHtml(initialVisibleMessages, emptyText)}
    </div>
    <p class="ref-message-foot" data-message-foot>${messageFootText(activeMessageFilter, initialVisibleMessages.length, currentUserMessages.length)}</p>
  `;
}

function messageRow(iconName, title, text, time, color, tag = "", read = messagesRead, index = 0, message = {}) {
  const isImage = /\.(png|jpe?g|webp)$/i.test(iconName);
  const messageKey = message.id || `${index}-${title}-${time}-${text}`.slice(0, 160);
  return `
    <button class="message-row ${iconName === "sos" ? "sos-message" : ""} ${read ? "is-read" : ""}" type="button" data-message-id="${attr(message.id || "")}" data-message-key="${attr(messageKey)}" data-message-title="${attr(title)}" data-message-text="${attr(text)}" data-message-time="${attr(time)}" data-message-type="${attr(tag || "系统")}" data-message-related-type="${attr(message.relatedType || "")}" data-message-related-id="${attr(message.relatedId || "")}" data-api-endpoint="${attr(message.apiEndpoint || "")}" data-action="查看消息：${attr(title)}">
      <span class="tile-icon ${color}" style="width:52px;height:52px;margin:0">${iconName === "sos" ? "<b>SOS</b>" : isImage ? `<img src="${asset(iconName)}" alt="">` : icon(iconName, 24)}</span>
      <div><b>${title}${tag ? `<em class="message-tag ${color}">${tag}</em>` : ""}</b><p class="meta">${text}</p></div>
      <time>${time}</time>
      <i class="message-dot" ${read ? "hidden" : ""}></i>
      ${icon("chevron-right", 20)}
    </button>
  `;
}

function profilePlanCard(plan = {}, compact = false) {
  return `
    <button class="plan-card ref-plan-card ${compact ? "compact" : ""}" data-action="查看旅居计划" data-profile-plan-id="${attr(plan.id || "")}" data-api-endpoint="/api/user/profile-center" type="button">
      <img src="${asset(plan.image || "profile-plan.jpg")}" alt="${attr(plan.name || "旅居计划")}">
      <div class="ref-plan-info">
        <h2><span>${icon("map-pin", 15)} ${attr(plan.name || "旅居计划")}</span><em>${attr(plan.status || "待确认")}</em></h2>
        <p class="meta">${icon("calendar-days", 14)} ${profileDate(plan.startDate)} — ${profileDate(plan.endDate)}</p>
        ${compact ? "" : `<div class="ref-plan-mini"><span>${icon("home", 13)} ${attr(plan.apartment || "房型待确认")}</span><span>${icon("user-round", 13)} 管家：${attr(plan.manager || "平台旅居管家")}</span></div>`}
      </div>
    </button>
  `;
}

function renderProfile() {
  const center = userProfileCenterState || {};
  const user = center.user || {};
  const elder = center.elderProfile || {};
  const contact = (center.familyContacts || []).find((item) => item.isDefault) || (center.familyContacts || [])[0];
  const plans = center.travelPlans || [];
  const benefits = center.benefits || {};
  const membership = benefits.membership || {};
  const points = benefits.points || {};
  const name = elder.name || user.nickname || (userProfileCenterLoading ? "正在加载" : "旅居用户");
  const city = user.currentCity || elder.city || currentCity || DEFAULT_CITY;
  const familyContent = contact
    ? `<div class="ref-family-person"><img class="avatar" src="${asset("avatar-daughter.jpg")}" alt="${attr(contact.relation || "家属")}"><div><b>${attr(contact.relation || "家属")}　${attr(contact.name)} <span class="tag">${contact.notifyAlert ? "通知已开启" : "已绑定"}</span></b><p class="meta">联系电话：${maskPhone(contact.phone || "")}</p></div></div>`
    : '<p class="empty">暂未绑定家属联系人</p>';
  return `
    <section class="profile-head ref-profile-head" data-api-endpoint="/api/user/profile-center">
      <span class="profile-logo"><img src="${asset("home-logo-ref.png")}" alt="云旅无忧"></span>
      <img data-personal-avatar-img src="${currentPersonalAvatarSrc()}" alt="头像">
      <div><h2>${attr(name)} <span class="member">${attr(membership.level || "普通用户")}</span></h2><p>${icon("map-pin", 16)} <span data-current-city>${attr(city)}</span> <span class="tag">${elder.riskLevel ? `健康风险：${attr(elder.riskLevel)}` : "档案已同步"}</span></p></div>
      <button class="icon-btn" data-route="personal" data-api-endpoint="/api/user/profile" type="button" aria-label="个人资料">${icon("chevron-right", 24)}</button>
    </section>
    <section class="section family-card card ref-family-care" data-api-endpoint="/api/family-contacts">
      <div><h2 style="margin:0 0 4px">家属关怀</h2><span class="meta">${(center.familyContacts || []).length} 位联系人已接入守护链路</span></div>
      ${familyContent}
      <button class="btn blue ref-family-care-btn" data-route="family" type="button">查看家属关怀 ${icon("chevron-right", 15)}</button>
    </section>
    <div class="section ref-profile-service">${serviceGrid([
      { title: "个人资料", image: "profile-icon-personal.png", route: "personal" },
      { title: "健康档案", image: "profile-icon-health.png", route: "health-record" },
      { title: "家属绑定", image: "profile-icon-family.png", route: "family" },
      { title: "紧急联系人", image: "profile-icon-contact.png", route: "contacts" },
      { title: "我的订单", image: "profile-icon-orders.png", route: "orders" },
      { title: "活动报名", image: "profile-icon-activity.png", route: "activity-records" },
      { title: "设备管理", image: "profile-icon-device.png", route: "device-management" },
      { title: "服务记录", image: "profile-icon-records.png", route: "service-records" },
    ])}</div>
    <section class="card section ref-profile-section-card ref-plan-section" data-api-endpoint="/api/user/profile-center">
      <div class="section-head">
        <h2>我的旅居计划</h2>
        <button data-action="查看全部旅居计划" type="button" aria-expanded="${profilePlansExpanded ? "true" : "false"}" ${userProfileCenterState ? "" : "disabled"}>${profilePlansExpanded ? "收起计划" : `查看全部 ${plans.length} 项`} ${icon(profilePlansExpanded ? "chevron-up" : "chevron-right", 15)}</button>
      </div>
      ${plans[0] ? profilePlanCard(plans[0]) : `<p class="empty">${userProfileCenterLoading ? "正在加载旅居计划" : "暂无旅居计划"}</p>`}
      ${profilePlansExpanded ? `<div class="ref-profile-plan-list" data-profile-plan-list><div class="ref-profile-plan-summary">全部旅居计划（${plans.length}）</div>${plans.map((plan) => profilePlanCard(plan, true)).join("")}</div>` : ""}
      <div class="ref-profile-detail-panel" data-profile-plan-detail-panel hidden></div>
    </section>
    <section class="card section ref-profile-section-card ref-account-section" data-api-endpoint="/api/user/profile-center">
      <div class="section-head"><h2>账户与权益</h2></div>
      <div class="metric-grid ref-benefits">
        <button class="metric ref-benefit" data-action="查看优惠券" type="button" ${userProfileCenterState ? "" : "disabled"}><span class="ref-benefit-icon orange">${icon("profile-coupon-solid", 24)}</span><div><b>${Number(benefits.availableCouponCount || 0)}<small> 张</small></b><span>优惠券 ${icon("chevron-right", 13)}</span></div><span class="ref-audit-inline">${Number(benefits.availableCouponCount || 0)} 张 优惠券</span></button>
        <button class="metric ref-benefit" data-action="查看积分" type="button" ${userProfileCenterState ? "" : "disabled"}><span class="ref-benefit-icon gold">${icon("star", 24)}</span><div><b>${Number(points.balance || 0)} <small>积分</small></b><span>可用积分 ${icon("chevron-right", 13)}</span></div><span class="ref-audit-inline">${Number(points.balance || 0)} 积分 可用积分</span></button>
        <button class="metric ref-benefit" data-action="查看会员权益" type="button" ${userProfileCenterState ? "" : "disabled"}><span class="ref-benefit-icon blue">${icon("crown", 24)}</span><div><b>${attr(membership.level || "普通用户")}</b><span>${membership.expiresAt ? `有效期至 ${profileDate(membership.expiresAt)}` : attr(membership.status || "有效")} ${icon("chevron-right", 13)}</span></div><span class="ref-audit-inline">${attr(membership.level || "普通用户")} ${profileDate(membership.expiresAt)}</span></button>
      </div>
      <div class="ref-profile-detail-panel" data-profile-detail-panel hidden></div>
    </section>
  `;
}

function renderLogin() {
  return `
    <div class="ref-login-hero">
      <img src="${asset("login-hero.jpg")}" alt="云旅无忧登录背景">
      <div class="ref-login-brand"><img src="${asset("home-logo-ref.png")}" alt="云旅无忧"><div><h1>云旅无忧</h1><p>旅居生活 · 安心无忧</p></div></div>
      <div class="ref-login-trust">
        <span>${icon("shield-check", 16)}安全守护<br><small>7x24小时</small></span>
        <span>${icon("heart-pulse", 16)}贴心服务<br><small>健康陪伴</small></span>
        <span>${icon("hand-heart", 16)}专属保障<br><small>家属安心</small></span>
      </div>
    </div>
    <section class="card login-card ref-login-card">
      <h2>欢迎使用云旅无忧</h2>
      <p>登录后享受更多贴心的旅居服务</p>
      <div class="input-line">${icon("phone", 18)}<span>请输入手机号</span></div>
      <div class="input-line">${icon("shield-check", 18)}<span>请输入验证码</span><button class="btn ghost" data-action="获取验证码" type="button">获取验证码</button></div>
      <button class="btn blue block" data-route="home" type="button">登录 / 注册</button>
      <button class="btn line-green block" data-action="微信一键登录" type="button">${icon("message-circle", 16)}微信一键登录</button>
      <button class="ref-login-agreement" data-action="切换登录协议同意" type="button" aria-pressed="false"><span class="ref-login-check"></span>我已阅读并同意《用户协议》《隐私政策》</button>
    </section>
    <div class="ref-login-roles">
      <button class="ref-login-role ref-login-role-elder" data-route="home" type="button">
        <span><b>老人用户</b><small>享受安全守护<br>安心旅居生活</small></span>
        <img src="${asset("ref/login-role-elder.png")}" alt="老人用户">
        <i>${icon("chevron-right", 22)}</i>
      </button>
      <button class="ref-login-role ref-login-role-family" data-route="home" type="button">
        <span><b>家属关怀</b><small>远程关心家人<br>守护长辈健康</small></span>
        <img src="${asset("ref/login-role-family.png")}" alt="家属关怀">
        <i>${icon("chevron-right", 22)}</i>
      </button>
    </div>
    <div class="ref-login-footer">
      <span>${icon("login-shield-solid", 18)}<b>数据安全</b><small>隐私加密保护</small></span>
      <span>${icon("login-headphones-solid", 18)}<b>专业客服</b><small>贴心服务响应</small></span>
      <span>${icon("login-heart-solid", 18)}<b>多方陪伴</b><small>家人 · 平台 · 服务</small></span>
    </div>
    <button class="ref-login-hotline" data-action="客服热线" type="button">${icon("headphones", 16)}<span>客服电话 400-888-XXXX</span><small>服务时间：7×24小时，账号登录与验证码问题可联系人工客服一对一协助登录</small></button>
  `;
}

function citySearchText(...parts) {
  return parts
    .flat()
    .filter(Boolean)
    .map((part) => normalizeCityName(part))
    .join(" ");
}

const YUNNAN_PREFECTURE_CITIES = [
  { name: "昆明市", desc: "省会春城，医疗与交通配套完善", keywords: "昆明 春城 省会 医疗 交通", tag: "春城气候宜居", image: "destination-city.jpg", distance: "云南省会城市", tags: ["气候宜人", "配套完善", "交通便捷"], featured: true, recommend: true },
  { name: "曲靖市", desc: "滇东门户，城市服务完善，适合短中期旅居", keywords: "曲靖 滇东 珠江源", tag: "滇东门户", image: "destination-city.jpg", distance: "距昆明约 140 公里", tags: ["交通便利", "生活配套", "气候舒适"], featured: false },
  { name: "玉溪市", desc: "抚仙湖周边康养资源集中，适合湖畔旅居", keywords: "玉溪 抚仙湖 澄江 康养", tag: "湖畔康养", image: "destination-lake.jpg", distance: "距昆明约 90 公里", tags: ["湖泊资源", "低强度活动", "安静宜居"], featured: true },
  { name: "保山市", desc: "滇西康养节点，腾冲温泉与生态资源丰富", keywords: "保山 腾冲 滇西 温泉 火山", tag: "滇西康养", image: "destination-lake.jpg", distance: "距昆明约 490 公里", tags: ["温泉资源", "生态旅居", "慢生活"], featured: true, recommend: true },
  { name: "昭通市", desc: "滇东北避暑城市，连接川滇黔服务圈", keywords: "昭通 滇东北 避暑", tag: "滇东北避暑", image: "destination-city.jpg", distance: "距昆明约 350 公里", tags: ["避暑", "山地风光", "交通节点"], featured: false },
  { name: "丽江市", desc: "古城文化体验与高原慢生活目的地", keywords: "丽江 古城 玉龙雪山 文化", tag: "古城慢生活", image: "destination-dali.jpg", distance: "距昆明约 500 公里", tags: ["文化体验", "休闲旅居", "自然风光"], featured: true },
  { name: "普洱市", desc: "森林康养与茶文化体验适合长住", keywords: "普洱 茶 森林 康养 思茅", tag: "森林茶养", image: "destination-lake.jpg", distance: "距昆明约 400 公里", tags: ["森林康养", "茶文化", "慢生活"], featured: false },
  { name: "临沧市", desc: "恒春气候与茶山资源结合，适合安静旅居", keywords: "临沧 茶山 恒春", tag: "茶山旅居", image: "destination-lake.jpg", distance: "距昆明约 520 公里", tags: ["茶山", "安静旅居", "气候温和"], featured: false },
  { name: "楚雄彝族自治州", desc: "滇中康养与民族文化体验兼具", keywords: "楚雄 彝族 滇中 恐龙谷", tag: "滇中文化", image: "destination-city.jpg", distance: "距昆明约 160 公里", tags: ["民族文化", "滇中区位", "生活便利"], featured: false },
  { name: "红河哈尼族彝族自治州", desc: "弥勒湖泉、建水古城与元阳梯田联动旅居", keywords: "红河 弥勒 建水 元阳 哈尼 彝族 湖泉", tag: "湖泉康养旅居", image: "destination-lake.jpg", distance: "距昆明约 140 公里起", tags: ["康养温泉", "活动丰富", "医疗便利"], featured: true, recommend: true },
  { name: "文山壮族苗族自治州", desc: "滇东南山水与民族风情旅居目的地", keywords: "文山 普者黑 壮族 苗族", tag: "山水旅居", image: "destination-lake.jpg", distance: "距昆明约 310 公里", tags: ["山水风光", "民族文化", "休闲体验"], featured: false },
  { name: "西双版纳傣族自治州", desc: "热带雨林与民族文化旅居目的地", keywords: "西双版纳 版纳 景洪 热带 雨林 傣族", tag: "热带康养", image: "destination-lake.jpg", distance: "距昆明约 535 公里", tags: ["热带气候", "雨林体验", "民族文化"], featured: true },
  { name: "大理白族自治州", desc: "苍山洱海慢生活，适合长期旅居", keywords: "大理 苍山 洱海 白族 慢生活", tag: "苍山洱海慢生活", image: "destination-dali.jpg", distance: "距昆明约 323 公里", tags: ["自然风光", "慢生活", "文化体验"], featured: true, recommend: true },
  { name: "德宏傣族景颇族自治州", desc: "边地风情与温暖气候，适合冬季旅居", keywords: "德宏 芒市 瑞丽 傣族 景颇", tag: "边地暖冬", image: "destination-lake.jpg", distance: "距昆明约 620 公里", tags: ["暖冬", "民族文化", "边地风情"], featured: false },
  { name: "怒江傈僳族自治州", desc: "峡谷生态与小众深度旅居目的地", keywords: "怒江 傈僳 峡谷 生态", tag: "峡谷生态", image: "destination-lake.jpg", distance: "距昆明约 540 公里", tags: ["峡谷风光", "生态体验", "小众旅居"], featured: false },
  { name: "迪庆藏族自治州", desc: "香格里拉高原旅居，适合文化和自然体验", keywords: "迪庆 香格里拉 藏族 高原", tag: "高原旅居", image: "destination-dali.jpg", distance: "距昆明约 700 公里", tags: ["高原风光", "文化体验", "清凉避暑"], featured: false },
];

function citySearchOptions() {
  return YUNNAN_PREFECTURE_CITIES.map((item) => ({
    ...item,
    desc: `${item.desc} · 云南省地级行政区`,
    keywords: `云南省 ${item.name} ${normalizeCityName(item.name)} ${item.keywords || ""}`,
  }));
}

function citySearchMatches(query = "") {
  const normalizedQuery = normalizeCityName(query).toLowerCase();
  if (!normalizedQuery) return [];
  return citySearchOptions()
    .filter((item) => citySearchText(item.name, item.desc, item.keywords).toLowerCase().includes(normalizedQuery))
    .slice(0, 16);
}

const CITY_INDEX_LETTERS = ["热门", "B", "C", "D", "H", "K", "L", "N", "P", "Q", "W", "X", "Y", "Z"];
const CITY_INDEX_BY_NAME = {
  保山: "B",
  楚雄: "C",
  大理: "D",
  德宏: "D",
  迪庆: "D",
  红河: "H",
  昆明: "K",
  丽江: "L",
  临沧: "L",
  怒江: "N",
  普洱: "P",
  曲靖: "Q",
  文山: "W",
  西双版纳: "X",
  玉溪: "Y",
  昭通: "Z",
};

function cityIndexLetter(value = "") {
  const normalized = normalizeCityName(value);
  if (!normalized) return "热门";
  const matched = Object.entries(CITY_INDEX_BY_NAME).find(([name]) => normalized.includes(name));
  if (matched) return matched[1];
  const ascii = normalized.match(/[A-Za-z]/)?.[0]?.toUpperCase();
  return CITY_INDEX_LETTERS.includes(ascii) ? ascii : "热门";
}

function renderCitySearchResults(query = "") {
  const matches = citySearchMatches(query);
  if (!matches.length) return "";
  return matches.map((item) => `
    <button data-city-select="${attr(item.name)}" data-city-index="${cityIndexLetter(item.name)}" data-city-search-result type="button">
      <span>${item.name}</span>
      <small>${item.desc}</small>
      ${icon("chevron-right", 15)}
    </button>
  `).join("");
}

function updateCitySearchResultPanel(query = "") {
  const panel = document.querySelector("[data-city-search-results]");
  if (!panel) return;
  const html = renderCitySearchResults(query);
  panel.innerHTML = html;
  panel.hidden = !html;
}

function filterCitySearchResults(query = "") {
  const normalizedQuery = normalizeCityName(query).toLowerCase();
  const items = [...document.querySelectorAll("[data-city-search-item]")];
  let visibleCount = 0;
  items.forEach((item) => {
    const haystack = normalizeCityName(item.dataset.cityName || item.textContent || "").toLowerCase();
    const matched = !normalizedQuery || haystack.includes(normalizedQuery);
    item.hidden = !matched;
    if (matched) visibleCount += 1;
  });
  const noResult = document.querySelector("[data-city-search-empty]");
  updateCitySearchResultPanel(query);
  const directMatches = citySearchMatches(query).length;
  if (noResult) noResult.hidden = !normalizedQuery || visibleCount > 0 || directMatches > 0;
}

function handleCityIndex(letter, button) {
  const index = CITY_INDEX_LETTERS.includes(letter) ? letter : "热门";
  activeCityIndex = index;
  citySearchQuery = "";
  const searchInput = document.querySelector("[data-city-search-input]");
  if (searchInput) searchInput.value = "";
  updateCitySearchResultPanel("");
  const items = [...document.querySelectorAll("[data-city-search-item]")];
  let visibleCount = 0;
  items.forEach((item) => {
    const matched = index === "热门" || item.dataset.cityIndex === index;
    item.hidden = !matched;
    if (matched) visibleCount += 1;
  });
  document.querySelectorAll("[data-city-index-letter]").forEach((item) => {
    const active = item.dataset.cityIndexLetter === index;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const noResult = document.querySelector("[data-city-search-empty]");
  if (noResult) {
    noResult.hidden = visibleCount > 0;
    if (!visibleCount) noResult.textContent = `${index} 下暂无可选城市，请换一个字母或使用搜索`;
  }
  const status = document.querySelector("[data-city-index-status]");
  if (status) status.textContent = index === "热门" ? "当前索引：热门 · 显示全部推荐城市" : `当前索引：${index} · ${visibleCount} 个城市`;
  button.dataset.cityIndexApplied = `${index}-${visibleCount}`;
  const target = items.find((item) => !item.hidden) || document.querySelector(".ref-city-hot-card") || document.querySelector(".ref-city-list");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
  return true;
}

async function handleCitySelect(city, sourceNode = document.querySelector(".screen-city")) {
  const normalized = normalizeCityName(city);
  if (!normalized) return false;
  citySearchQuery = "";
  updateCurrentCity(normalized);
  applyCitySelectionState(normalized, sourceNode);
  const apiResult = await syncCurrentCityToApi(normalized);
  const finalCity = normalizeCityName(apiResult?.currentCity || normalized);
  updateCurrentCity(finalCity);
  applyCitySelectionState(finalCity, sourceNode);
  writeActionStatus(sourceNode?.closest?.(".content") || sourceNode || document.querySelector(".screen-city"), `城市定位更新为${finalCity}，首页定位和本地服务已同步`);
  setRoute("home");
  return true;
}

function applyCitySelectionState(city, sourceNode = null) {
  const normalized = normalizeCityName(city) || DEFAULT_CITY;
  const current = document.querySelector(".ref-city-current");
  current?.setAttribute("data-selected-city", normalized);
  const title = current?.querySelector("[data-city-current-title]");
  if (title) title.innerHTML = `${attr(normalized)} <span>已选择</span>`;
  const status = current?.querySelector("[data-city-current-status]");
  if (status) status.innerHTML = `${icon("locate-fixed", 13)}${attr(normalized)}已选中，正在同步首页与本地服务`;
  const selectionStatus = document.querySelector("[data-city-selection-status]");
  if (selectionStatus) selectionStatus.textContent = `当前选择：${normalized} · 已同步到本页`;
  document.querySelectorAll("[data-city-select]").forEach((node) => {
    const selected = normalizeCityName(node.dataset.citySelect) === normalized;
    node.classList.toggle("active", selected);
    node.setAttribute("aria-pressed", selected ? "true" : "false");
    if (selected) node.dataset.citySelected = "true";
    else delete node.dataset.citySelected;
  });
  if (sourceNode?.dataset) sourceNode.dataset.citySelectedAt = String(Date.now());
}

async function selectFirstCitySearchResult(sourceNode) {
  const firstPanel = document.querySelector("[data-city-search-results] [data-city-select]");
  const first = firstPanel || [...document.querySelectorAll("[data-city-search-item][data-city-select]")].find((item) => !item.hidden);
  if (!first) return false;
  return handleCitySelect(first.dataset.citySelect, sourceNode || first);
}

async function handleCityRelocate(button) {
  if (!button) return;
  const oldText = button.innerHTML;
  const oldDisabled = button.disabled;
  button.disabled = true;
  button.innerHTML = `${icon("locate-fixed", 15)}定位中`;
  const statusTarget = button.closest(".content") || button;
  const secureTip = isSecureLocationOrigin() ? "正在获取手机定位，请允许浏览器定位权限" : "正在尝试定位。当前 HTTP 预览可能被浏览器禁止 GPS，会优先尝试高德定位";
  writeActionStatus(statusTarget, secureTip);
  try {
    const { city, source, accuracy } = await requestCurrentLocation(true);
    const finalCity = city && city !== "定位中" ? normalizeCityName(city) : "";
    await syncCurrentCityToApi(finalCity || currentCity);
    render();
    const target = document.querySelector(".ref-city-current") || statusTarget;
    if (finalCity) {
      const sourceText = source === "gps"
        ? `GPS定位${Number.isFinite(accuracy) ? `，精度约${Math.round(accuracy)}米` : ""}`
        : "高德/IP定位";
      writeActionStatus(target, `${finalCity}已同步到首页：${sourceText}`);
    } else {
      writeActionStatus(target, "未获取到定位结果，请在搜索栏输入城市并选择");
    }
  } catch (error) {
    writeActionStatus(statusTarget, "定位失败，请检查定位权限或在搜索栏输入城市并选择");
  } finally {
    const nextButton = document.querySelector("[data-city-relocate]") || button;
    nextButton.disabled = oldDisabled;
    nextButton.innerHTML = oldText;
  }
}

function renderCity() {
  const recommendedCities = YUNNAN_PREFECTURE_CITIES.filter((city) => city.recommend);
  const locatedCity = currentCity && currentCity !== "定位中" ? currentCity : "定位中";
  const locatedAccuracy = locatedCity === "定位中" ? "点击重新定位获取当前位置" : "定位结果已同步首页";
  const cityRows = [
    ["云南省地级行政区", ...YUNNAN_PREFECTURE_CITIES.map((city) => [city.name, city.distance])],
  ];
  return `
    <div class="ref-city-current">
      <img src="${asset("destination-city.jpg")}" alt="${locatedCity}城市背景">
      <div><small>${icon("map-pin", 14)} 当前城市</small><h2 data-city-current-title>${locatedCity} <span>当前定位</span></h2><p data-city-current-status>${icon("locate-fixed", 13)}${locatedAccuracy}</p></div>
      <button data-city-relocate="true" data-action="重新定位当前城市" type="button">${icon("locate-fixed", 15)}重新定位</button>
    </div>
    <p class="ref-city-selection-status" data-city-selection-status>当前选择：${locatedCity}</p>
    <p class="ref-city-index-status" data-city-index-status>当前索引：${activeCityIndex}</p>
    <label class="search ref-city-search">
      ${icon("search", 20)}
      <input data-city-search-input type="search" value="${attr(citySearchQuery)}" placeholder="搜索旅居城市" autocomplete="off" enterkeyhint="search">
    </label>
    <p class="ref-city-search-empty" data-city-search-empty hidden>没有找到匹配城市，请换个关键词再试</p>
    <div class="ref-city-search-results" data-city-search-results ${citySearchQuery ? "" : "hidden"}>${renderCitySearchResults(citySearchQuery)}</div>
    ${section("推荐旅居城市", `
      <div class="ref-city-recommend">
        ${recommendedCities.map((city) => cityRecommend(city.name, city.tag, city.desc, city.image, city.distance, city.tags, "切换")).join("")}
      </div>
    `)}
    <div class="ref-city-index">
      ${CITY_INDEX_LETTERS.map((letter) => `<button class="${letter === activeCityIndex ? "active" : ""}" data-city-index-letter="${attr(letter)}" data-action="城市索引${attr(letter)}" type="button" aria-pressed="${letter === activeCityIndex ? "true" : "false"}">${letter}</button>`).join("")}
    </div>
    ${section("按拼音首字母查找", `
      <div class="card ref-city-list">
        ${cityRows.map(([province, ...names]) => `<div><b>${province}</b>${names.map(([name, distance]) => `<button class="${normalizeCityName(name) === normalizeCityName(currentCity) ? "active" : ""}" data-city-search-item data-city-index="${cityIndexLetter(name)}" data-city-name="${attr(citySearchText(province, name, distance))}" data-city-select="${attr(name)}" data-action="切换城市：${attr(name)}" type="button" aria-pressed="${normalizeCityName(name) === normalizeCityName(currentCity) ? "true" : "false"}"><span>${name}</span><small>${distance}</small>${icon("chevron-right", 14)}</button>`).join("")}</div>`).join("")}
      </div>
    `)}
  `;
}

function cityRecommend(name, tag, desc, image, distance, tags, action) {
  return `
    <article class="card" data-city-search-item data-city-index="${cityIndexLetter(name)}" data-city-name="${attr(citySearchText(name, tag, desc, distance, tags))}" data-city-select="${attr(name)}">
      <img src="${asset(image)}" alt="${name}">
      <div><h3>${name} <span class="tag">${tag}</span></h3><p>${desc}</p><div class="ref-city-tags">${tags.map((item, index) => `<span class="${["green", "blue", "purple"][index] || "blue"}">${item}</span>`).join("")}</div><small>${icon("map-pin", 12)} ${distance}</small></div>
      <button class="btn ghost ${normalizeCityName(name) === normalizeCityName(currentCity) ? "active" : ""}" data-city-select="${attr(name)}" data-action="切换城市：${attr(name)}" type="button" aria-pressed="${normalizeCityName(name) === normalizeCityName(currentCity) ? "true" : "false"}">${action}</button>
    </article>
  `;
}

function renderPersonal() {
  const user = userPersonalState?.user || {};
  const elder = userPersonalState?.elderProfile || {};
  const authorizations = userPersonalState?.authorizations || {};
  const safetyCode = userPersonalState?.safetyCode || {};
  const qrImage = safetyCode.qrDataUrl
    ? `<img class="ref-qr-img" src="${attr(safetyCode.qrDataUrl)}" alt="个人安全二维码">`
    : `<span class="ref-qr-loading" aria-label="个人安全码生成中">生成中</span>`;
  const detailQrImage = safetyCode.qrDataUrl
    ? `<img src="${attr(safetyCode.qrDataUrl)}" alt="个人安全二维码详情">`
    : "";
  return `
    <button class="card ref-personal-head" data-action="更换头像" data-personal-avatar-trigger type="button" aria-label="更换头像">
      <span class="ref-avatar-edit"><img data-personal-avatar-img src="${currentPersonalAvatarSrc()}" alt="头像"><span class="ref-avatar-camera" aria-hidden="true">${icon("camera", 17)}</span></span>
      <div><h2>点击更换头像</h2><p>建议使用本人清晰照片</p></div>
    </button>
    <input data-personal-avatar-input class="ref-avatar-file-input" type="file" accept="image/*" aria-label="选择头像图片">
    <form class="card section ref-personal-list" data-personal-profile-form data-api-endpoint="/api/user/personal">
      ${personalField("profile-user-solid", "姓名", "name", elder.name || user.nickname || "", "#4f8df8")}
      ${personalSelectField("profile-gender-solid", "性别", "gender", elder.gender || "女", ["男", "女"], "#4f8df8")}
      ${personalField("profile-calendar-solid", "年龄", "age", elder.age || "", "#6aa7ff", { inputmode: "numeric", suffix: "岁" })}
      ${personalField("profile-phone-solid", "手机号", "phone", user.phone || "", "#3b82f6", { inputmode: "tel" })}
      ${personalField("profile-pin-solid", "当前旅居城市", "city", user.currentCity || "", "#4a8cff")}
      ${personalField("profile-home-solid", "常住地址", "address", user.address || "", "#5c97fb")}
      ${personalReadonlyField("profile-shield-solid", "身份证认证", elder.idVerificationStatus || "读取中", "#34c878")}
      ${personalField("profile-heart-solid", "旅居偏好", "preference", (elder.healthTags || []).join("、"), "#34c878")}
      ${personalField("profile-utensils-solid", "饮食偏好", "diet", elder.dietPreference || "", "#ff9f1f")}
      ${personalField("profile-action-solid", "行动能力", "mobility", elder.mobility || "", "#8b5cf6")}
    </form>
    <div class="card ref-profile-code ref-personal-code" data-api-endpoint="/api/user/personal">
      <span class="ref-code-shield">${icon("shield-alert", 24)}</span>
      <div><h2>个人安全码</h2><p>紧急情况下，救助人员可扫码<br>查看您的关键信息</p><button data-action="查看安全码示例" type="button" aria-expanded="false">查看详情 ${icon("chevron-right", 14)}</button></div>
      ${qrImage}
    </div>
    <section class="card ref-safety-code-panel" data-safety-code-panel hidden>
      ${detailQrImage}
      <div>
        <h2>${attr(safetyCode.name || elder.name || "用户")} · 个人安全码</h2>
        <p>${attr(safetyCode.summary || "安全码正在生成，请稍后刷新。")}</p>
        <span>${icon("shield-check", 15)}仅授权救助人员与平台安全员可查看</span>
      </div>
    </section>
    <section class="card ref-personal-privacy-panel" data-api-endpoint="/api/user/personal">
      <h2>${icon("shield-check", 18)}隐私与授权 <button class="text-btn" data-route="settings" type="button">通知设置</button></h2>
      <div class="ref-privacy-list">
        ${privacyRow("location", "map-pin", "位置授权", "用于行程导航、紧急定位等服务", "#3b82f6", Boolean(authorizations.location))}
        ${privacyRow("healthData", "heart-pulse", "健康数据授权", "授权设备同步健康数据，提供健康建议", "#22c55e", Boolean(authorizations.healthData))}
        ${privacyRow("notifications", "bell", "消息通知", "接收活动提醒、服务通知等消息", "#8b5cf6", Boolean(authorizations.notifications))}
      </div>
    </section>
    <button class="btn blue block ref-sticky-main" data-action="保存个人资料" type="button">保存修改</button>
  `;
}

function personalField(iconName, label, name, value, color, options = {}) {
  const className = label === "旅居偏好" ? " ref-preference-row" : "";
  const suffix = options.suffix ? `<span class="ref-personal-suffix">${options.suffix}</span>` : "";
  const inputmode = options.inputmode ? ` inputmode="${attr(options.inputmode)}"` : "";
  return `
    <label class="ref-personal-row${className}">
      <span style="color:${color}">${icon(iconName, 18)}</span>
      <b>${label}</b>
      <em><input name="${attr(name)}" value="${attr(value)}"${inputmode}></em>
      ${suffix || "<span></span>"}
    </label>
  `;
}

function personalSelectField(iconName, label, name, value, options, color) {
  return `
    <label class="ref-personal-row">
      <span style="color:${color}">${icon(iconName, 18)}</span>
      <b>${label}</b>
      <em><select name="${attr(name)}">${options.map((item) => `<option value="${attr(item)}" ${item === value ? "selected" : ""}>${item}</option>`).join("")}</select></em>
      <span></span>
    </label>
  `;
}

function personalReadonlyField(iconName, label, value, color) {
  return `
    <div class="ref-personal-row is-readonly">
      <span style="color:${color}">${icon(iconName, 18)}</span>
      <b>${label}</b>
      <em><span class="verified-text">${value}</span></em>
      <span></span>
    </div>
  `;
}

function privacyRow(key, iconName, title, text, color, enabled) {
  return `
    <button class="ref-privacy-row" data-action="${title}" data-personal-authorization="${attr(key)}" type="button" aria-pressed="${enabled ? "true" : "false"}" data-auth-state="${enabled ? "enabled" : "disabled"}">
      <span class="ref-round-icon" style="--icon-color:${color}">${icon(iconName, 20)}</span>
      <span><b>${title}</b><em>${text}</em></span>
      <span class="switch ${enabled ? "on" : ""}"></span>
    </button>
  `;
}

function renderFamily() {
  const data = familyPageState;
  if (!data) {
    return `
      <div class="ref-family-hero"><img src="${asset("family-hero.jpg")}" alt="远程关怀 安心陪伴"></div>
      <section class="card ref-family-list" aria-busy="true"><p class="empty">正在加载家属联系人、权限和绑定记录...</p></section>
    `;
  }
  const contacts = Array.isArray(data.contacts) ? data.contacts : [];
  const permissionVisuals = {
    healthData: ["heart-pulse", "#22c55e"],
    deviceAlerts: ["triangle-alert", "#f59e0b"],
    serviceOrders: ["file-text", "#3b82f6"],
    emergencyLocation: ["map-pin", "#8b5cf6"],
  };
  const invitation = data.latestInvitation;
  const latestRecord = (data.bindingRecords || [])[0];
  return `
    <div class="ref-family-hero" data-family-source="${attr(data.sourceEndpoint)}"><img src="${asset("family-hero.jpg")}" alt="远程关怀 安心陪伴"></div>
    ${section("已绑定家属", `
      <div class="card ref-family-list">
        ${contacts.length ? contacts.map((contact, index) => familyRow(contact, index)).join("") : '<p class="empty">暂无已绑定家属，可通过下方邀请入口创建绑定邀请。</p>'}
      </div>
    `, `<button data-action="管理家属" type="button">管理家属 ${icon("chevron-right", 14)}</button>`)}
    <div class="card ref-family-invite">
      <div>
        <h2>${icon("users", 18)}邀请更多家属</h2>
        <p>扫码或发送邀请，让家人也能参与关怀</p>
        <div><button class="btn blue" data-action="生成邀请二维码" type="button">${icon("qr-code", 16)}生成邀请二维码</button><button class="btn ghost" data-action="手机号邀请" type="button">${icon("smartphone", 16)}手机号邀请</button></div>
      </div>
      ${invitation?.qrDataUrl
        ? `<img src="${attr(invitation.qrDataUrl)}" alt="${attr(invitation.relation)}${attr(invitation.name)}家属邀请二维码" data-family-invitation-id="${attr(invitation.id)}">`
        : `<span class="ref-family-qr-empty">${icon("qr-code", 27)}<small>生成后显示</small></span>`}
    </div>
    ${section("权限管理", `
      <div class="card settings-list ref-family-permissions">
        ${(data.permissions || []).map((item) => familyPermissionRow(item.key, permissionVisuals[item.key]?.[0] || "shield-check", item.title, item.description, permissionVisuals[item.key]?.[1] || "#64748b", item.enabled)).join("")}
      </div>
    `, `<button data-action="权限说明" type="button">权限说明 ${icon("info", 14)}</button>`)}
    ${section("绑定记录", `
      <div class="card ref-family-record">
        <span class="ref-round-icon" style="--icon-color:#64748b">${icon("clock", 22)}</span>
        <div><b>最近一次授权</b><p>${latestRecord ? `${apiText(apiTime(latestRecord.recordedAt), "时间未记录")}　${apiText(latestRecord.title)}` : "暂无绑定或邀请记录"}</p></div>
        <button class="btn ghost" data-action="查看全部绑定记录" type="button">查看全部记录 ${icon("chevron-right", 14)}</button>
      </div>
    `)}
    <div class="ref-family-note">${icon("shield-check", 16)}<span>${Number(data.summaries?.contactCount || 0)} 位家属已接入关怀链路，${Number(data.summaries?.pendingInvitationCount || 0)} 个邀请待确认<br>我们将严格保护您的隐私安全</span></div>
  `;
}

function maskedPhone(phone) {
  return String(phone || "").replace(/^(\d{3})\d{4}(\d{4})$/, "$1 **** $2");
}

function familyRow(contact, index = 0) {
  const contactId = contact.id || "";
  const name = contact.name || "家属";
  const relation = contact.relation || "家属";
  const status = contact.isDefault ? "默认联系人" : contact.bindingStatus || "";
  const image = contact.avatar || (index % 2 === 0 ? "avatar-daughter.jpg" : "avatar-son.jpg");
  const phone = contact.phone || "";
  const scopes = contact.scopes || [];
  const dialNumber = normalizeDialNumber(phone);
  return `
    <article class="ref-family-card" data-contact-id="${attr(contactId)}" data-name="${attr(name)}" data-relation="${attr(relation)}" data-phone="${attr(phone)}">
      <img class="avatar" src="${userAssetSrc(image, "avatar-daughter.jpg")}" alt="${attr(name)}">
      <div class="ref-family-card-main">
        <h3>${apiText(relation)}　${apiText(name)}${status ? `<span class="tag purple">${apiText(status)}</span>` : ""}</h3>
        <p>${icon("phone", 14)}${apiText(maskedPhone(phone), "手机号未填写")}</p>
        <div><span>权限范围：</span>${scopes.length ? scopes.map((scope) => `<i>${apiText(scope)}</i>`).join("") : "<i>暂无权限</i>"}</div>
      </div>
      <div class="ref-family-card-actions" aria-label="${attr(name)}操作">
        <a class="ref-family-action-call" href="tel:${attr(dialNumber)}" data-action="拨打${attr(name)}电话" data-contact-id="${attr(contactId)}" data-name="${attr(name)}" data-phone="${attr(phone)}">${icon("phone", 20)}<span>电话</span></a>
        <button class="ref-family-action-edit" type="button" data-action="编辑${name}权限" data-contact-id="${attr(contactId)}" data-name="${attr(name)}" data-relation="${attr(relation)}" data-phone="${attr(phone)}">${icon("pencil", 20)}<span>编辑</span></button>
      </div>
      <button class="icon-btn ref-family-card-link" data-action="查看${name}" type="button" aria-label="查看${name}详情">${icon("chevron-right", 18)}</button>
    </article>
  `;
}

function familyPermissionRow(key, iconName, title, desc, color, enabled) {
  return `
    <button class="ref-family-permission-row" data-action="${attr(title)}" data-family-permission-key="${attr(key)}" type="button" style="--icon-color:${color}" aria-pressed="${enabled ? "true" : "false"}">
      <span>${icon(iconName, 19)}</span>
      <b>${apiText(title)}<small>${apiText(desc)}</small></b>
      <span class="switch${enabled ? " on" : ""}"></span>
    </button>
  `;
}

function renderSettings() {
  return `
    ${settingsPanel("账号与通知", [
      refSettingsRow("profile-shield-solid", "账号与安全", "", "#3b82f6"),
      refSettingsRow("settings-bell-solid", "消息通知", settingsSwitch("accountNotifications"), "#2f7df6"),
      refSettingsRow("profile-shield-solid", "隐私授权", "", "#22c55e"),
      refSettingsFontRow("settings-type-solid", "字体大小", "#3b82f6"),
      refSettingsRow("profile-heart-solid", "适老模式", settingValueText("elderMode"), "#f97316"),
      refSettingsRow("settings-trash-solid", "清除缓存", settingValueText("cacheSize"), "#8b5cf6"),
    ])}
    ${settingsPanel("提醒设置", [
      refSettingsRow("settings-chat-solid", "消息通知", settingsSwitch("serviceNotifications"), "#22c55e", "接收平台消息、订单和活动提醒"),
      refSettingsRow("settings-users-solid", "家属关怀提醒", settingsSwitch("familyCareReminder"), "#f97316", "家属互动、健康提醒等关怀通知"),
      refSettingsRow("settings-volume-solid", "声音提醒", settingsSwitch("soundReminder"), "#8b5cf6", "系统提示音和语音播报"),
    ])}
    ${settingsPanel("服务与支持", [
      refSettingsRow("settings-help-solid", "帮助中心", "", "#3b82f6"),
      refSettingsRow("settings-headphones-solid", "联系客服", "7x24小时在线", "#2f7df6"),
      refSettingsRow("settings-file-solid", "用户协议", "", "#22c55e"),
      refSettingsRow("profile-shield-solid", "隐私政策", "", "#3b82f6"),
      refSettingsRow("settings-cross-solid", "医疗免责声明", "", "#f97316"),
      refSettingsRow("settings-info-solid", "关于云旅无忧", "当前版本 2.3.6", "#2f7df6"),
    ])}
    ${settingsPanel("设备与权限", [
      refSettingsRow("settings-watch-solid", "设备授权管理", "管理手环等设备权限", "#14b8a6", "", "device-management"),
      refSettingsRow("settings-bot-solid", "小云机器人设置", "管理小云机器人", "#2f7df6", "", "robot-settings"),
    ])}
    <button class="ref-settings-logout" data-route="login" type="button">${icon("log-out", 18)}退出登录</button>
  `;
}

function settingsPanel(title, rows) {
  const classMap = {
    "账号与通知": "account",
    "提醒设置": "reminder",
    "服务与支持": "support",
    "设备与权限": "device",
  };
  return `<section class="card ref-settings-panel ref-settings-panel-${classMap[title] || "default"}"><h2>${title}</h2><div>${rows.join("")}</div></section>`;
}

function refSettingsRow(iconName, title, value = "", color = "#3b82f6", desc = "", route = "") {
  const right = value || icon("chevron-right", 18);
  const isInlineControl = value.includes("switch") || value.includes("ref-font-size-control");
  const settingsKey = settingsControlKey(title, desc) || (title === "适老模式" ? "elderMode" : title === "清除缓存" ? "cacheSize" : "");
  const routeAttr = route ? ` data-route="${route}"` : ` data-action="${title}"`;
  const stateAttrs = settingsKey ? ` data-settings-key="${settingsKey}"${settingsKey !== "cacheSize" ? ` aria-pressed="${userSettings[settingsKey] ? "true" : "false"}" data-settings-enabled="${userSettings[settingsKey] ? "true" : "false"}"` : ` data-settings-value="${attr(userSettings.cacheSize)}"`}` : "";
  return `
    <button class="ref-settings-row" style="--icon-color:${color}"${routeAttr}${stateAttrs} type="button">
      <span>${icon(iconName, 21)}</span>
      <b>${title}${desc ? `<small>${desc}</small>` : ""}</b>
      <em>${right}</em>
      ${value && !isInlineControl ? icon("chevron-right", 16) : ""}
    </button>
  `;
}

function refSettingsFontRow(iconName, title, color = "#3b82f6") {
  return `
    <div class="ref-settings-row ref-settings-font-row" style="--icon-color:${color}" data-settings-key="fontSize" data-settings-value="${attr(userSettings.fontSize)}" aria-label="字体大小：${attr(userSettings.fontSize)}">
      <span>${icon(iconName, 21)}</span>
      <b>${title}</b>
      <em class="ref-font-size-control" role="group" aria-label="字体大小">
        ${["小", "标准", "大"].map((size) => `<button class="${userSettings.fontSize === size ? "active" : ""}" data-action="字体大小：${size}" data-local-action="true" type="button" aria-pressed="${userSettings.fontSize === size ? "true" : "false"}">${size}</button>`).join("")}
      </em>
    </div>
  `;
}

function renderDeviceManagement() {
  const page = deviceManagementState || {};
  const summary = page.summary || {};
  const devices = page.devices || [];
  const addableDevices = page.addableDevices || [
    { image: "ref/add-bed.png", title: "智能床垫", text: "睡眠监测 · 健康守护", type: "智能床垫" },
    { image: "ref/add-bp.png", title: "智能血压计", text: "血压监测 · 数据同步", type: "智能血压计" },
    { image: "ref/add-thermometer.png", title: "智能体温计", text: "体温监测 · 异常提醒", type: "智能体温计" },
    { image: "ref/add-door.png", title: "智能门磁", text: "门窗安全 · 异常告警", type: "智能门磁" },
  ];
  const authSettings = page.authSettings || [
    { key: "healthData", icon: "heart-pulse", title: "健康数据同步", text: "同步设备健康数据，用于健康分析和建议", color: "#22c55e", enabled: true },
    { key: "abnormalAlerts", icon: "bell", title: "异常提醒", text: "设备异常时，及时通知您和家属", color: "#f59e0b", enabled: true },
    { key: "familyVisible", icon: "users", title: "家属可见", text: "已绑定家属可查看设备相关数据", color: "#3b82f6", enabled: true },
  ];
  return `
    <div class="ref-device-manage-hero"><img src="${asset("device-management-hero.jpg")}" alt="已绑定 ${Number(summary.total || devices.length || 0)} 台设备"></div>
    <p class="action-status ref-device-management-current" data-device-management-status>${deviceManagementState ? `已接入设备 ${Number(summary.total || devices.length || 0)} 台 · 在线 ${Number(summary.connected || 0)} 台` : "正在加载设备管理数据..."}</p>
    <div class="list section ref-device-manage-list">
      ${devices.length ? devices.map((device) => deviceManageRow(device)).join("") : `<p class="empty">${deviceManagementLoading ? "正在加载设备列表..." : "暂无绑定设备，请添加设备。"}</p>`}
    </div>
    ${section("可添加设备", `
      <div class="card ref-device-add-grid">
        ${addableDevices.map((item) => `<button class="ref-device-add-card" data-action="添加${attr(item.title || item.type)}" data-device-name="${attr(item.title || item.type)}" data-device-type="${attr(item.type || item.title)}" data-device-code="${attr(item.defaultDeviceId || "")}" data-local-action="true" type="button"><em>可添加</em><img src="${asset(item.image || "ref/add-bp.png")}" alt="${attr(item.title || item.type)}"><b>${attr(item.title || item.type)}</b><span>${attr(item.text || "")}</span><i>去添加</i></button>`).join("")}
      </div>
    `, `<button data-action="查看全部设备" type="button">查看全部设备 ${icon("chevron-right", 14)}</button>`)}
    <section class="card section ref-device-auth-list">
      <div class="ref-device-auth-head">
        <span>${icon("shield-check", 18)}</span>
        <div><h2>设备数据授权</h2><p>授权后，小云将更好地为您提供个性化服务</p></div>
      </div>
      ${authSettings.map((item) => deviceAuthRow(item.icon, item.title, item.text, item.color, item)).join("")}
    </section>
    <div class="ref-device-help-banner">
      ${icon("info", 15)}
      <span>设备遇到问题？ 您可以联系</span>
      <button data-route="assistant" type="button">人工客服</button>
      <span>或者查看</span>
      <button data-action="帮助中心" type="button">帮助中心</button>
      ${icon("chevron-right", 14)}
    </div>
  `;
}

function deviceManageRow(device = {}) {
  const title = apiText(device.type, "智能设备");
  const name = apiText(device.displayName, title);
  const image = device.image || "ref/add-bp.png";
  const route = device.actions?.settingsRoute || "devices";
  const state = apiText(device.statusLabel, "已连接");
  const metrics = Array.isArray(device.metrics) ? device.metrics : [];
  const deviceId = apiText(device.id || device.deviceId, "");
  const secondAction = device.actions?.secondary === "解绑智能手环"
    ? ["解绑智能手环", "link", "解绑", " danger-line"]
    : [device.actions?.secondary || "测试设备", "activity", "测试设备", ""];
  return `
    <article class="list-row ref-device-manage-card" data-device-id="${attr(deviceId)}" data-device-code="${attr(device.deviceId || "")}" data-device-type="${attr(title)}" data-device-title="${attr(name)}">
      <img class="row-thumb" src="${asset(image)}" alt="${title}">
      <div><b>${title} <span class="tag">${state}</span></b><p>设备名称：${name}</p><div class="ref-device-metrics">${metrics.map((item) => `<span>${icon(item.icon || "activity", 16)}${item.label || ""}</span>`).join("")}</div><div class="ref-device-actions"><button class="btn ghost" data-route="${route}" data-device-id="${attr(deviceId)}" type="button">${icon("settings", 15)}${attr(device.actions?.primary || "设备设置")}</button><button class="btn ghost${secondAction[3]}" data-action="${attr(secondAction[0])}" data-device-id="${attr(deviceId)}" type="button">${icon(secondAction[1], 15)}${secondAction[2]}</button></div></div>
      <button class="icon-btn ref-device-card-link" data-route="${route}" type="button" aria-label="查看${title}详情">${icon("chevron-right", 18)}</button>
    </article>
  `;
}

function deviceAuthRow(iconName, title, text, color, options = {}) {
  const enabled = options.enabled !== false;
  return `
    <button class="ref-device-auth-row" data-action="${attr(title)}" data-auth-key="${attr(options.key || "")}" type="button">
      <span class="ref-round-icon" style="--icon-color:${color}">${icon(iconName, 19)}</span>
      <span><b>${title}</b><em>${text}</em></span>
      <span class="switch ${enabled ? "on" : ""}" role="switch" aria-pressed="${enabled ? "true" : "false"}"></span>
    </button>
  `;
}

function renderBandSettings() {
  return `
    <div class="ref-audit-alias-row">
      <button data-action="心率异常" type="button">心率异常 高于120次/分 低于50次/分</button>
      <button data-action="血氧低于" type="button">血氧低于 93%</button>
      <button data-action="定位频率" type="button">定位频率 每10分钟</button>
      <button data-action="心率异常" type="button">心率异常</button>
      <button data-action="血氧低于" type="button">血氧低于</button>
      <button data-action="定位频率" type="button">定位频率</button>
    </div>
    <section class="card ref-band-hero">
      <img src="${asset("ref/band-settings-hero-band-cutout.png")}" alt="云旅手环">
      <div>
        <h2>云旅手环 1A2B <span class="tag">已连接</span></h2>
        <p>${icon("battery-medium", 13)} 电量 78%</p>
        <p>${icon("refresh-cw", 13)} 最后同步 05-26　08:30</p>
        <p>${icon("info", 13)} 固件版本 V1.2.8（已是最新）</p>
      </div>
      <button class="btn blue" data-action="立即同步" type="button">${icon("refresh-cw", 15)}立即同步</button>
    </section>
    ${section("健康监测设置", `
      <div class="card ref-device-setting-list">
        ${deviceSettingToggle("heart-pulse", "心率监测", "24小时自动监测心率变化", "#ef4444", true)}
        ${deviceSettingToggle("droplets", "血压提醒", "定时监测血压，异常时提醒", "#f59e0b", true)}
        ${deviceSettingToggle("activity", "血氧低值提醒", "血氧低于设定值时提醒", "#3b82f6", true)}
        ${deviceSettingToggle("moon", "睡眠监测", "自动记录睡眠时长与质量", "#8b5cf6", true)}
        ${deviceSettingToggle("footprints", "跌倒检测", "检测到跌倒时自动报警", "#22c55e", true)}
        ${deviceSettingToggle("siren", "SOS 按键", "长按手环侧键发送求助", "#ef4444", true)}
        ${deviceSettingToggle("bell", "久坐/长时间未动提醒", "超过设定时间未活动时提醒", "#3b82f6", true)}
      </div>
    `)}
    ${section("阈值设置", `
      <div class="ref-threshold-grid">
        ${thresholdMini("heart-pulse", "心率异常", "高于120次/分　低于50次/分", "#ef4444")}
        ${thresholdMini("droplets", "血氧低于", "93%", "#3b82f6")}
        ${thresholdMini("map-pin", "定位频率", "每10分钟", "#22c55e")}
      </div>
    `)}
    ${section("紧急联系人同步", `
      <div class="card ref-contact-sync">
        ${contactMini("avatar-user.jpg", "儿子", "张小明", "默认", "138 **** 1234")}
        ${contactMini("avatar-daughter.jpg", "女儿", "张小红", "", "139 **** 5678")}
        ${contactMini("avatar-user.jpg", "老伴", "李阿姨", "", "137 **** 9012")}
      </div>
    `, `<button data-route="contacts" type="button">管理联系人 ${icon("chevron-right", 14)}</button>`)}
    <div class="ref-device-bottom-actions">
      <button data-action="查找手环" type="button">${icon("locate-fixed", 18)}查找手环<br><small>手环震动并亮屏</small></button>
      <button data-action="解除绑定" type="button">${icon("link-2-off", 18)}解除绑定<br><small>解除后将无法同步数据</small></button>
    </div>
    <p class="ref-device-note">${icon("info", 13)}手环佩戴请贴合手腕，保持设备电量充足以确保功能正常使用</p>
  `;
}

function renderRobotSettings() {
  return `
    <section class="card ref-robot-hero">
      <img src="${asset("ref/robot-settings-hero-robot-cutout.png")}" alt="小云机器人">
      <div>
        <h2>小云机器人 3F8C <span class="tag">在线</span></h2>
        <p>${icon("battery-medium", 13)} 电量：65%</p>
        <p>${icon("wifi", 13)} 网络状态：良好</p>
        <p>${icon("home", 13)} 所在房间：湖泉康养公寓 802</p>
        <p>${icon("clock", 13)} 最后同步：今天 08:30</p>
        <button class="btn ghost ref-robot-info-btn" data-action="设备信息" data-local-action="true" type="button">设备信息</button>
      </div>
      ${icon("chevron-right", 20)}
    </section>
    <div class="card ref-robot-tuning">
      ${robotSliderRow("volume-2", "语音音量", 70)}
      ${robotSliderRow("sun", "屏幕亮度", 60)}
      <button class="ref-robot-tune-row" data-action="互动语言" data-local-action="true" type="button" aria-expanded="${robotLanguagePanelOpen ? "true" : "false"}">
        <span style="--icon-color:#3b82f6">${icon("message-circle", 19)}</span>
        <b>互动语言</b>
        <em>${attr(robotLanguage)}</em>
        ${icon(robotLanguagePanelOpen ? "chevron-up" : "chevron-down", 16)}
      </button>
      ${robotLanguagePanelOpen ? robotLanguageOptionsPanel() : ""}
      <button class="ref-robot-tune-row" data-action="夜间模式" data-local-action="true" type="button" aria-pressed="false">
        <span style="--icon-color:#8b5cf6">${icon("moon", 19)}</span>
        <b>夜间模式 <small>（22:00-07:00降低音量和亮度）</small></b>
        <i class="switch"></i>
      </button>
    </div>
    ${section("功能设置", `
      <div class="card ref-robot-feature-list">
        ${robotFeatureToggle("mic", "语音唤醒", "说“小云小云”唤醒机器人", "#22c55e")}
        ${robotFeatureToggle("calendar-days", "活动提醒播报", "定时播报活动安排和注意事项", "#3b82f6")}
        ${robotFeatureToggle("pill", "用药提醒", "按时提醒用药和健康注意事项", "#f59e0b")}
        ${robotFeatureToggle("video", "家人视频通话", "接通家人视频请求", "#8b5cf6")}
        ${robotFeatureToggle("footprints", "跌倒联动提醒", "检测到跌倒时通知家人和平台", "#ef4444")}
        ${robotFeatureToggle("siren", "紧急求助播报", "一键求助后自动播报并拨打电话", "#ef4444")}
      </div>
    `)}
    ${section("网络设置", `<div class="card ref-network-row">${icon("wifi", 18)}<span>当前连接：Yunlv-Home</span><em>${icon("lock", 13)}</em><button data-action="更换网络" data-local-action="true" type="button">更换网络</button></div>`)}
    ${section("设备测试", `<div class="ref-device-test-grid">${deviceTestButton("mic", "麦克风测试")}${deviceTestButton("video", "摄像头测试")}${deviceTestButton("volume-2", "扬声器测试")}${deviceTestButton("map-pin", "定位测试")}</div>`)}
    <div class="ref-robot-actions"><button data-action="重启设备" type="button">${icon("power", 18)}重启设备</button><button data-action="恢复出厂" type="button">${icon("rotate-ccw", 18)}恢复出厂</button><button data-action="解绑机器人" type="button">${icon("link-2-off", 18)}解绑机器人</button></div>
    <p class="ref-device-note">${icon("info", 13)}如需帮助，请联系人工客服 400-888-XXXX</p>
  `;
}

function deviceSettingToggle(iconName, title, text, color, on = true) {
  return `
    <button class="ref-device-setting-row" data-action="${title}" type="button">
      <span style="--icon-color:${color}">${icon(iconName, 18)}</span>
      <strong>${title}<small>${text}</small></strong>
      <em>已开启</em>
      <i class="switch ${on ? "on" : ""}"></i>
    </button>
  `;
}

function thresholdMini(iconName, title, text, color) {
  return `<button class="card ref-threshold-card" data-action="${title}" type="button"><span style="--icon-color:${color}">${icon(iconName, 18)}</span><strong><b>${title}</b><small>${text}</small></strong><em class="ref-audit-inline">${title}</em>${icon("chevron-right", 14)}</button>`;
}

function contactMini(image, relation, name, tagText, phone) {
  return `<button class="ref-contact-mini" data-route="contacts" type="button"><img src="${asset(image)}" alt="${name}"><b>${relation}<br>${name}</b>${tagText ? `<span>${tagText}</span>` : ""}<small>${phone}</small></button>`;
}

function deviceTestButton(iconName, title) {
  return `<button data-action="${title}" type="button">${icon(iconName, 20)}<b>${title}</b><small>点击开始</small></button>`;
}

function robotLanguageOptionsPanel() {
  return `
    <div class="ref-robot-language-panel" role="listbox" aria-label="选择互动语言">
      ${ROBOT_LANGUAGE_OPTIONS.map((language) => {
        const active = language === robotLanguage;
        return `<button class="${active ? "active" : ""}" data-action="选择互动语言：${attr(language)}" data-local-action="true" type="button" role="option" aria-selected="${active ? "true" : "false"}">${icon(active ? "check-circle-2" : "circle", 16)}<span>${attr(language)}</span><em>${active ? "当前语言" : "点击选择"}</em></button>`;
      }).join("")}
    </div>
  `;
}

function robotSliderRow(iconName, label, value) {
  return `
    <button class="ref-robot-slider-row" data-action="${label}" data-robot-slider="${label}" data-robot-slider-value="${value}" data-local-action="true" type="button" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}">
      <span style="--icon-color:#2f7df6">${icon(iconName, 20)}</span>
      <b>${label}</b>
      <i><em style="width:${value}%"></em></i>
      <strong>${value}%</strong>
    </button>
  `;
}

function robotFeatureToggle(iconName, title, text, color) {
  return `
    <button class="ref-robot-feature-row" data-action="${title}" data-local-action="true" type="button" aria-pressed="true">
      <span style="--icon-color:${color}">${icon(iconName, 20)}</span>
      <b>${title}<small>${text}</small></b>
      <i class="switch on" aria-hidden="true"></i>
    </button>
  `;
}

normalizeInitialQueryRoute();
render();
