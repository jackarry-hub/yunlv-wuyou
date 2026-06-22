export const userReferencePages = {
  destinations: {
    title: "旅居目的地",
    subtitle: "精选康养地，支持收藏、查看详情和下单咨询",
    hero: "昆明、弥勒、大理、腾冲等康养目的地",
    items: [
      { title: "昆明滇池康养公寓", meta: "滇池湖畔 · 康养公寓 · 适老配套", route: "/pages/user/destination-detail?id=kunmingApartment" },
      { title: "弥勒湖泉康养旅居", meta: "温泉疗养 · 湖景社区 · 交通便利", route: "/pages/user/destination-detail?id=mile" },
      { title: "大理洱海慢居社区", meta: "自然风光 · 文化体验 · 慢生活", route: "/pages/user/destination-detail?id=dali" },
    ],
    actions: [{ text: "查看活动地图", type: "navigate", url: "/pages/user/activity-map" }],
  },
  "destination-detail": {
    title: "目的地详情",
    subtitle: "旅居环境、医疗交通、适老配套和推荐理由",
    hero: "昆明滇池康养公寓",
    items: [
      { title: "适老公寓", meta: "无障碍动线、独立卫浴、管家协助入住" },
      { title: "湖畔生活", meta: "靠近滇池绿道，日常散步和活动方便" },
      { title: "健康支持", meta: "定期健康巡检，慢病管理可对接" },
    ],
    actions: [
      { text: "咨询人工向导", type: "navigate", url: "/pages/user/guide" },
      { text: "提交旅居订单", type: "order", serviceType: "旅居公寓咨询", providerType: "guide" },
    ],
  },
  "activity-calendar": {
    title: "活动日历",
    subtitle: "按日期查看活动，可报名和开启提醒",
    mode: "calendar",
  },
  community: {
    title: "社群交流",
    subtitle: "结识旅居朋友，发布动态和加入话题",
    hero: "昆明旅居社群",
    items: [
      { title: "滇池晨练群", meta: "128 人 · 每日晨练提醒" },
      { title: "书画交流会", meta: "56 人 · 每周三活动" },
      { title: "旅居互助群", meta: "203 人 · 生活互助" },
    ],
    actions: [{ text: "发布动态", type: "record" }, { text: "加入社群", type: "request", serviceType: "社群活动协助" }],
  },
  checkin: {
    title: "旅居打卡",
    subtitle: "记录美好时光，生成旅居足迹",
    hero: "今日推荐：滇池海埂公园",
    items: [
      { title: "湖畔散步", meta: "已打卡 12 次" },
      { title: "晨练太极", meta: "连续 5 天" },
      { title: "旅拍相册", meta: "36 张照片" },
    ],
    actions: [{ text: "立即打卡", type: "record" }, { text: "预约旅拍陪同", type: "order", serviceType: "旅居打卡陪同", providerType: "guide" }],
  },
  food: {
    title: "本地美食",
    subtitle: "适老餐食、特色餐厅和营养推荐",
    hero: "清淡、温热、少油的本地餐食推荐",
    items: [
      { title: "菌菇汤套餐", meta: "营养清淡 · 适合午餐" },
      { title: "过桥米线适老版", meta: "少油少辣 · 可配送" },
      { title: "社区营养餐", meta: "低盐低糖 · 每日可订" },
    ],
    actions: [{ text: "预约餐厅", type: "order", serviceType: "餐厅预订", providerType: "merchant" }, { text: "营养餐配送", type: "order", serviceType: "营养餐配送", providerType: "merchant" }],
  },
  transport: {
    title: "交通出行",
    subtitle: "接送站、包车、日常出行和无障碍出行",
    hero: "从旅居地到医院/景区/车站的安心出行",
    items: [
      { title: "高铁站接送", meta: "提前预约 · 含行李协助" },
      { title: "医院往返", meta: "陪同上下车 · 可等候" },
      { title: "景区包车", meta: "半日/全日可选" },
    ],
    actions: [{ text: "预约接送", type: "order", serviceType: "接送出行", providerType: "guide" }, { text: "打开地图导航", type: "map" }],
  },
  volunteer: {
    title: "志愿服务",
    subtitle: "爱心传递，社区志愿者和人工向导协助",
    hero: "附近可响应志愿服务",
    items: [
      { title: "陪伴探访", meta: "适合独居老人" },
      { title: "活动协助", meta: "报名、签到、引导" },
      { title: "临时帮办", meta: "取件、缴费、咨询" },
    ],
    actions: [{ text: "申请志愿帮助", type: "request", serviceType: "志愿协助" }],
  },
  devices: {
    title: "智能设备",
    subtitle: "手环、机器人、健康数据和设备状态",
    hero: "设备在线状态与今日健康概览",
    api: "health",
    items: [
      { title: "智能手环", meta: "心率、血氧、步数、电量同步" },
      { title: "小云机器人", meta: "语音提醒、家人通话、异常检测" },
      { title: "设备联动", meta: "异常入库并同步后台" },
    ],
    actions: [{ text: "同步设备数据", type: "device" }, { text: "设备管理", type: "navigate", url: "/pages/user/device-management" }],
  },
  robot: {
    title: "小云机器人",
    subtitle: "守护状态、语音交互、家人通话和求助",
    hero: "小云机器人在线",
    items: [
      { title: "语音音量", meta: "70%" },
      { title: "守护功能", meta: "跌倒检测、离家提醒、SOS" },
      { title: "家人通话", meta: "支持语音/视频入口" },
    ],
    actions: [{ text: "发起语音对话", type: "ai" }, { text: "一键求助", type: "sos" }],
  },
  "device-management": {
    title: "设备管理",
    subtitle: "绑定用户设备，查看连接、电量和同步记录",
    items: [
      { title: "智能手环", meta: "在线 · 电量随设备数据变化" },
      { title: "小云机器人", meta: "在线 · 网络正常" },
    ],
    actions: [{ text: "同步全部设备", type: "device" }, { text: "添加设备", type: "record" }],
  },
  "band-settings": {
    title: "手环设置",
    subtitle: "电量、提醒、健康监测和同步设置",
    items: [
      { title: "心率监测", meta: "已开启" },
      { title: "用药提醒", meta: "每日 08:30" },
      { title: "同步频率", meta: "每 30 分钟" },
    ],
    actions: [{ text: "保存设置", type: "record" }],
  },
  "robot-settings": {
    title: "机器人设置",
    subtitle: "语音、网络、守护和家人通话设置",
    items: [
      { title: "语音唤醒", meta: "已开启" },
      { title: "跌倒检测", meta: "已开启" },
      { title: "家人通话", meta: "默认联系儿子" },
    ],
    actions: [{ text: "保存设置", type: "record" }],
  },
  guide: {
    title: "人工向导",
    subtitle: "陪伴就医、导游游览、护工护理和接送出行",
    hero: "平台认证人工向导，支持下单和订单追踪",
    items: [
      { title: "李向导", meta: "4.9 分 · 陪诊/导游 · 今日可接单", route: "/pages/user/guide-detail?id=guide-001" },
      { title: "陪伴就医", meta: "挂号取号、陪同就诊、取药" },
      { title: "导游游览", meta: "路线规划、讲解、拍照陪同" },
    ],
    actions: [{ text: "立即下单", type: "navigate", url: "/pages/user/order-submit?serviceType=陪伴就医&providerType=guide" }],
  },
  "guide-detail": {
    title: "向导详情",
    subtitle: "服务经验、评分、服务范围和用户评价",
    hero: "李向导 · 已认证",
    items: [
      { title: "服务类型", meta: "陪伴就医、导游游览、接送出行" },
      { title: "服务区域", meta: "昆明滇池、翠湖、云南民族村" },
      { title: "用户评价", meta: "耐心细致，路线熟悉" },
    ],
    actions: [{ text: "预约该向导", type: "order", serviceType: "陪伴就医", providerType: "guide" }, { text: "收藏向导", type: "record" }],
  },
  "order-submit": {
    title: "提交订单",
    subtitle: "按需求书字段提交人工向导/商户服务订单",
    mode: "order",
  },
  "order-detail": {
    title: "订单详情",
    subtitle: "服务进度、执行方、时间地点和状态流转",
    mode: "orderDetail",
  },
  review: {
    title: "服务评价",
    subtitle: "确认服务并沉淀评价数据",
    items: [
      { title: "评分", meta: "5 星" },
      { title: "评价内容", meta: "服务准时、沟通清楚、过程安心" },
    ],
    actions: [{ text: "提交评价", type: "confirmOrder" }],
  },
  "service-records": {
    title: "服务记录",
    subtitle: "AI 问答、服务推荐、历史咨询和服务记录",
    api: "aiHistory",
    items: [
      { title: "最近咨询", meta: "旅居服务、天气、活动、健康常识" },
      { title: "服务推荐", meta: "人工向导、商户服务、活动报名" },
    ],
    actions: [{ text: "清空本页记录", type: "record" }, { text: "继续咨询", type: "navigate", url: "/pages/user/assistant" }],
  },
  "activity-signup": {
    title: "活动报名",
    subtitle: "姓名、性别、年龄、人数和电话完整报名",
    mode: "activitySignup",
  },
  "activity-records": {
    title: "活动报名记录",
    subtitle: "查看已报名活动、人数和状态",
    api: "activities",
    items: [
      { title: "晨练太极", meta: "05-20 07:30 · 已报名" },
      { title: "书画交流会", meta: "05-21 14:00 · 已报名" },
    ],
    actions: [{ text: "继续报名", type: "navigate", url: "/pages/user/activity-map" }],
  },
  "sos-records": {
    title: "求助记录",
    subtitle: "SOS、快速求助和后台处理结果",
    items: [
      { title: "一键 SOS", meta: "已通知后台和紧急联系人" },
      { title: "快速求助", meta: "可联系医院、客服或人工向导" },
    ],
    actions: [{ text: "再次求助", type: "sos" }],
  },
  contacts: {
    title: "紧急联系人",
    subtitle: "新增、编辑、拨打电话和默认联系人",
    api: "contacts",
    actions: [{ text: "拨打默认联系人", type: "phone" }, { text: "新增联系人", type: "record" }],
  },
  "health-record": {
    title: "健康档案",
    subtitle: "血型、慢病、过敏史、常用药和健康数据",
    api: "health",
    items: [
      { title: "基础信息", meta: "血型、年龄、常住地" },
      { title: "慢病管理", meta: "血压、血氧、睡眠、步数" },
      { title: "同步手环数据", meta: "按设备最后同步时间展示" },
    ],
    actions: [{ text: "同步健康数据", type: "device" }],
  },
  "health-services": {
    title: "健康服务",
    subtitle: "在线问诊、体检预约、康复建议和附近医院",
    items: [
      { title: "在线问诊", meta: "预约医生咨询" },
      { title: "体检预约", meta: "商户服务承接" },
      { title: "康复建议", meta: "结合健康档案推荐" },
    ],
    actions: [{ text: "预约体检", type: "order", serviceType: "体检预约", providerType: "merchant" }, { text: "查看健康档案", type: "navigate", url: "/pages/user/health-record" }],
  },
  policies: {
    title: "政策指南",
    subtitle: "旅居政策、补贴、申请材料和办理入口",
    items: [
      { title: "旅居补贴", meta: "按城市、年龄和服务类型确认" },
      { title: "医保异地备案", meta: "材料清单和办理流程" },
      { title: "适老服务政策", meta: "社区和平台服务说明" },
    ],
    actions: [{ text: "查看政策详情", type: "navigate", url: "/pages/user/policy-detail" }],
  },
  "policy-detail": {
    title: "政策详情",
    subtitle: "政策内容、申请条件、材料清单和咨询入口",
    items: [
      { title: "申请条件", meta: "年龄、居住地、服务类型和证明材料" },
      { title: "材料清单", meta: "身份证、居住证明、服务订单等" },
    ],
    actions: [{ text: "咨询政策", type: "ai" }, { text: "分享政策", type: "record" }],
  },
  shop: {
    title: "优选商城",
    subtitle: "健康监测、旅居用品、营养食品和智能设备",
    items: [
      { title: "智能血压计", meta: "¥299 · 可配送" },
      { title: "适老旅行箱", meta: "¥399 · 轻量设计" },
      { title: "营养食品包", meta: "¥128 · 低糖低盐" },
    ],
    actions: [{ text: "加入购物车", type: "order", serviceType: "商城代购与配送", providerType: "merchant" }],
  },
  login: {
    title: "登录注册",
    subtitle: "手机号、微信登录和角色身份认证",
    actions: [{ text: "进入正式登录", type: "navigate", url: "/pages/auth/login" }],
  },
  city: {
    title: "选择城市",
    subtitle: "当前支持昆明/弥勒等旅居城市，后续后台配置",
    items: [
      { title: "昆明", meta: "当前城市" },
      { title: "弥勒", meta: "温泉康养" },
      { title: "大理", meta: "慢居体验" },
    ],
    actions: [{ text: "保存城市", type: "record" }],
  },
  personal: {
    title: "个人资料",
    subtitle: "姓名、年龄、手机号、安全码和个人信息",
    api: "profile",
    actions: [{ text: "保存资料", type: "record" }],
  },
  family: {
    title: "家属绑定",
    subtitle: "绑定家属、紧急联系人和授权范围",
    api: "contacts",
    actions: [{ text: "邀请家属", type: "record" }],
  },
  settings: {
    title: "设置",
    subtitle: "通知、隐私、账号安全、语言字体和退出登录",
    items: [
      { title: "通知设置", meta: "订单、活动、设备、系统消息" },
      { title: "隐私设置", meta: "定位、健康、联系人授权" },
      { title: "账号安全", meta: "手机号、安全码、登录设备" },
    ],
    actions: [{ text: "保存设置", type: "record" }],
  },
};

export function getUserReferencePage(pageId) {
  return userReferencePages[pageId] || {
    title: "云旅无忧",
    subtitle: "页面迁移中",
    items: [],
    actions: [],
  };
}

export const userReferencePageIds = Object.keys(userReferencePages);
