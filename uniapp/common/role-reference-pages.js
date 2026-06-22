const guideActions = {
  hall: [
    { text: "刷新接单大厅", type: "record" },
    { text: "抢接下一单", type: "guideClaim" },
  ],
  task: [
    { text: "查看任务数据", type: "record" },
    { text: "执行下一步", type: "guideTask" },
  ],
  exception: [
    { text: "提交异常", type: "guideException" },
    { text: "联系客服", type: "phone" },
  ],
  income: [
    { text: "刷新收入", type: "guideIncome" },
    { text: "查看结算记录", type: "navigate", url: "/pages/guide/settlements" },
  ],
  online: [
    { text: "切换上线接单", type: "guideOnline" },
    { text: "保存接单设置", type: "record" },
  ],
  message: [
    { text: "全部已读", type: "messageRead" },
    { text: "联系客户", type: "phone" },
  ],
  profile: [
    { text: "保存资料", type: "record" },
    { text: "查看审核状态", type: "navigate", url: "/pages/guide/audit-status" },
  ],
  setting: [
    { text: "保存设置", type: "record" },
    { text: "同步后台", type: "record" },
  ],
  scan: [
    { text: "扫码核验", type: "record" },
    { text: "打开任务详情", type: "navigate", url: "/pages/guide/order-detail" },
  ],
};

const merchantActions = {
  workbench: [
    { text: "刷新工作台", type: "record" },
    { text: "新增服务", type: "navigate", url: "/pages/merchant/service-create" },
  ],
  service: [
    { text: "提交服务", type: "merchantService" },
    { text: "服务上架", type: "record" },
  ],
  order: [
    { text: "确认预约", type: "merchantOrder", action: "confirm" },
    { text: "提交报价", type: "merchantOrder", action: "quote" },
  ],
  complete: [
    { text: "开始服务", type: "merchantOrder", action: "start" },
    { text: "完成上报", type: "merchantOrder", action: "complete" },
    { text: "提交凭证", type: "record" },
  ],
  exception: [
    { text: "提交异常", type: "merchantException" },
    { text: "联系客服", type: "phone" },
  ],
  review: [
    { text: "刷新评价", type: "merchantReviews" },
    { text: "回复评价", type: "record" },
  ],
  finance: [
    { text: "刷新结算", type: "record" },
    { text: "申请提现", type: "navigate", url: "/pages/merchant/withdraw" },
  ],
  message: [
    { text: "全部已读", type: "messageRead" },
    { text: "查看详情", type: "navigate", url: "/pages/merchant/message-detail" },
  ],
  profile: [
    { text: "保存资料", type: "record" },
    { text: "提交审核", type: "record" },
  ],
  setting: [
    { text: "保存设置", type: "record" },
    { text: "同步后台", type: "record" },
  ],
};

const guidePageList = [
  ["hall", "01", "接单大厅", "推荐、附近、最新订单列表，支持按服务类型、距离和时间筛选。", "hall"],
  ["order-detail", "02", "订单详情", "客户信息、服务类型、时间地点、服务内容、地图位置和预计收入。", "task"],
  ["orders", "03", "我的订单", "全部、服务中、已完成、已取消订单管理。", "task"],
  ["service", "04", "服务中", "开始服务、路线导航、联系客户、服务清单打勾和完成服务。", "task"],
  ["exception", "05", "上报异常", "客户取消、失联、时间变更、突发情况等异常上报。", "exception"],
  ["messages", "06", "消息", "订单、客户、系统通知和平台客服入口。", "message"],
  ["profile", "07", "我的", "头像、姓名、在线状态、工作概览、收入、消息、扫一扫。", "profile"],
  ["online", "08", "上线接单", "开启或关闭接单，设置服务区域、服务类型和提醒。", "online"],
  ["filters", "09", "接单筛选", "附近、最新、服务类型、距离和时间筛选。", "hall"],
  ["accepted-pending-departure", "10", "已接单待出发", "已接单后联系客户、查看路线、申请取消和开始服务。", "task"],
  ["pending-confirm-detail", "11", "待确认订单详情", "等待用户或后台确认的订单详情。", "task"],
  ["canceled-order-detail", "12", "已取消订单详情", "取消原因、责任方和历史记录。", "task"],
  ["customer-profile", "13", "客户档案", "老人基础信息、健康备注、紧急联系人和服务记录。", "task"],
  ["home", "14", "首页", "您好，李向导，展示今日工作概览、待办和快捷入口。", "hall"],
  ["login", "15", "登录", "手机号登录、身份资料和实名资质状态。", "profile"],
  ["apply", "16", "申请成为向导", "提交身份资料、服务类型、区域和资质。", "profile"],
  ["audit-status", "17", "审核状态", "查看实名/资质审核进度和驳回原因。", "profile"],
  ["income", "18", "今日数据详情", "今日收入、接单数、服务中、已完成和预计收入。", "income"],
  ["wallet", "19", "我的钱包", "余额、提现、交易明细和结算记录。", "income"],
  ["withdraw", "20", "提现申请", "提现金额、到账账户和申请记录。", "income"],
  ["settlements", "21", "结算记录", "日/月结算数据、订单明细和状态。", "income"],
  ["reviews", "22", "评价管理", "服务评价、评分统计和客户反馈。", "task"],
  ["review-detail", "23", "评价详情", "评价内容、订单信息和回复记录。", "task"],
  ["service-area", "24", "服务区域设置", "服务城市、区域半径和可接单位置。", "online"],
  ["service-types", "25", "服务类型设置", "陪诊、导游、护理、接送等服务类型。", "online"],
  ["reminder-settings", "26", "接单提醒设置", "消息、声音、震动和免打扰规则。", "setting"],
  ["navigation", "27", "路线导航", "服务地址导航、路线和距离信息。", "task"],
  ["cancel-order", "28", "申请取消订单", "填写取消原因并同步后台。", "exception"],
  ["complete-report", "29", "服务完成上报", "上传服务过程、照片和完成备注。", "task"],
  ["completed-order-detail", "30", "已完成订单详情", "完成结果、评价、结算和服务记录。", "task"],
  ["system-notices", "31", "系统通知", "平台公告、审核、结算和系统提醒。", "message"],
  ["order-messages", "32", "订单消息", "订单状态变化、派单和改派通知。", "message"],
  ["customer-messages", "33", "客户消息", "客户咨询、电话和服务沟通记录。", "message"],
  ["support", "34", "平台客服", "联系客服、常见问题和工单记录。", "message"],
  ["security", "35", "安全中心", "账号安全、手机号、密码和登录设备。", "setting"],
  ["schedule", "36", "我的排班", "可服务日期、时间段和休息安排。", "online"],
  ["schedule-edit", "37", "排班编辑", "编辑可接单时段并同步后台。", "online"],
  ["skills", "38", "服务技能", "服务证书、技能标签和熟练度。", "profile"],
  ["statistics", "39", "工作统计", "服务量、收入、评分和时间分布。", "income"],
  ["personal", "40", "个人资料", "姓名、头像、联系方式、资质信息。", "profile"],
  ["settings", "41", "设置", "通知、隐私、账号和系统设置。", "setting"],
  ["help", "42", "帮助中心", "服务规范、常见问题和平台规则。", "setting"],
  ["service-rules", "43", "服务规范", "接单、服务、上报和评价规范。", "setting"],
  ["feedback", "44", "意见反馈", "提交问题、建议和处理记录。", "message"],
  ["scan", "45", "扫一扫", "扫码进入订单、客户或核验页面。", "scan"],
  ["verify", "46", "扫码核验", "核验客户预约、服务码和订单状态。", "scan"],
];

const merchantPageList = [
  ["messages", "01", "消息中心", "订单、售后、结算、审核和系统消息。", "message"],
  ["profile", "02", "商户资料", "查看或编辑门店信息、联系人、地址和状态。", "profile"],
  ["qualification", "03", "认证资质详情", "营业资质、服务资质、审核状态和更新记录。", "profile"],
  ["wallet-withdraw", "04", "我的钱包提现", "余额、提现、到账账户和申请记录。", "finance"],
  ["settlement-detail", "05", "结算详情", "结算周期、订单明细和到账状态。", "finance"],
  ["invoice-apply", "06", "申请开票", "选择订单、发票抬头和开票信息。", "finance"],
  ["security", "07", "账户安全", "修改密码、换绑手机和支付密码。", "setting"],
  ["settings", "08", "设置", "通知、隐私、权限、语言字体和平台规则。", "setting"],
  ["support", "09", "客服中心", "常见问题、在线客服和工单记录。", "message"],
  ["exception", "10", "异常上报", "客户不在家、服务延期、地址无法到达等异常。", "exception"],
  ["service-preview", "11", "服务详情预览", "用户端可见的服务图文和预约规则。", "service"],
  ["aftersales-detail", "12", "售后处理详情", "投诉、售后记录和处理结果。", "review"],
  ["invoice", "13", "发票信息", "发票抬头、开票记录和税务信息。", "finance"],
  ["order-detail", "14", "订单详情", "客户需求、预约时间、地点、联系人和状态。", "order"],
  ["profile-home", "15", "首页我的", "商户资料、认证资质、钱包、安全和设置入口。", "profile"],
  ["data-home", "16", "首页数据", "订单数、成交额、好评率和服务类型占比。", "workbench"],
  ["reviews", "17", "售后与评价", "查看用户评价、处理投诉和跟进售后。", "review"],
  ["service-complete", "18", "服务执行完成上报", "安排人员、记录过程、上传完成凭证。", "complete"],
  ["services", "19", "首页服务", "服务项目列表、筛选、上下架和编辑。", "service"],
  ["orders", "20", "首页订单", "预约订单、待确认、服务中和已完成。", "order"],
  ["onboarding-qualification", "21", "商户入驻资质认证", "机构资质、服务类型和审核材料。", "profile"],
  ["service-create", "22", "新增服务", "新增服务项目、图片、价格、说明和可预约时间。", "service"],
  ["quote", "23", "预约详情报价确认", "确认方案、报价并回传用户端。", "order"],
  ["workbench", "24", "首页工作台", "今日预约、待确认、服务中、待结算和经营工具。", "workbench"],
  ["message-detail", "25", "消息详情", "查看单条消息、来源和处理入口。", "message"],
  ["onboarding-basic", "26", "商户入驻基础信息", "机构名称、联系人、地址和经营类型。", "profile"],
  ["onboarding-license", "27", "商户入驻资质上传", "营业执照、许可证和资质图片。", "profile"],
  ["onboarding-service-types", "28", "商户入驻服务类型", "选择服务分类、能力和区域。", "profile"],
  ["onboarding-submit", "29", "商户入驻提交审核", "提交材料并查看审核进度。", "profile"],
  ["service-edit", "30", "编辑服务", "编辑服务标题、价格、图文和状态。", "service"],
  ["service-category", "31", "服务分类选择", "医疗卫生、康养护理、生活服务等分类。", "service"],
  ["booking-time", "32", "预约时间设置", "服务可预约日期、时间段和容量。", "service"],
  ["service-area", "33", "服务范围选择", "服务城市、门店半径和配送范围。", "service"],
  ["booking-confirm", "34", "预约确认", "确认预约时间、方案和服务人员。", "order"],
  ["booking-reject", "35", "预约拒绝", "填写拒绝原因并同步用户和后台。", "order"],
  ["order-reschedule", "36", "订单改期", "提出改期时间并等待用户确认。", "order"],
  ["quote-edit", "37", "报价方案编辑", "编辑服务方案、明细和报价金额。", "order"],
  ["staff-assign", "38", "服务人员安排", "安排服务人员并记录执行信息。", "complete"],
  ["complete-success", "39", "完成上报成功", "完成后回传状态、凭证和评价入口。", "complete"],
  ["aftersales-records", "40", "售后处理记录", "售后工单、处理进度和结果。", "review"],
  ["review-reply", "41", "评价回复", "回复用户评价并同步售后记录。", "review"],
  ["settlements", "42", "结算记录", "待结算、已结算和订单结算明细。", "finance"],
  ["transactions", "43", "交易明细", "订单收款、退款、提现和结算流水。", "finance"],
  ["withdraw", "44", "提现申请", "提现金额、账户和审核状态。", "finance"],
  ["bank-card", "45", "绑定银行卡", "新增或更换提现银行卡。", "finance"],
  ["invoice-title", "46", "发票抬头编辑", "编辑单位抬头、税号和地址电话。", "finance"],
  ["invoice-orders", "47", "选择开票订单", "选择可开票订单和金额。", "finance"],
  ["invoice-detail", "48", "发票详情", "发票状态、抬头、订单和下载入口。", "finance"],
  ["ticket-create", "49", "提交问题工单", "填写问题类型、说明和图片。", "message"],
  ["tickets", "50", "工单记录", "查看客服工单和处理进度。", "message"],
  ["online-support", "51", "在线客服", "联系平台客服和查看会话记录。", "message"],
  ["faq-detail", "52", "常见问题详情", "查看平台规则、服务规范和帮助说明。", "setting"],
  ["merchant-edit", "53", "商户资料编辑", "编辑门店资料、联系人和地址。", "profile"],
  ["business-hours", "54", "营业时间设置", "设置营业日、时间段和节假日。", "service"],
  ["service-city", "55", "服务城市选择", "选择服务城市和区域。", "service"],
  ["store-photos", "56", "门店照片管理", "上传、删除和排序门店照片。", "profile"],
  ["qualification-update", "57", "认证资质更新", "更新营业资质、许可证和证明材料。", "profile"],
  ["qualification-history", "58", "资质更新记录", "查看资质更新和审核历史。", "profile"],
  ["phone-change", "59", "换绑手机号", "验证旧手机并绑定新手机号。", "setting"],
  ["password-change", "60", "修改登录密码", "修改账号登录密码。", "setting"],
  ["payment-password", "61", "设置支付密码", "设置或修改提现支付密码。", "setting"],
  ["devices", "62", "设备管理", "门店设备、打印设备和通知设备状态。", "setting"],
  ["privacy", "63", "隐私设置", "客户资料、健康信息和定位权限配置。", "setting"],
  ["permissions", "64", "权限设置", "员工角色、页面权限和操作权限。", "setting"],
  ["display", "65", "语言与字体", "字号、语言和显示偏好。", "setting"],
  ["rules", "66", "平台规则", "查看商户服务规范和平台协议。", "setting"],
  ["login", "67", "商户登录", "手机号登录和商户身份认证。", "profile"],
  ["forgot-password", "68", "忘记密码", "找回账号密码。", "setting"],
  ["onboarding-review", "69", "商户入驻审核中", "查看入驻审核进度。", "profile"],
  ["onboarding-rejected", "70", "商户入驻审核驳回", "查看驳回原因并重新提交。", "profile"],
];

function buildPages(list, actionsMap) {
  return Object.fromEntries(list.map(([id, screenNo, title, subtitle, kind]) => [
    id,
    {
      id,
      screenNo,
      title,
      subtitle,
      kind,
      hero: `${screenNo} · ${title}`,
      items: [
        { title: "页面目标", meta: subtitle },
        { title: "数据联动", meta: "读取对应角色 API 数据，操作结果写回后台接口。" },
        { title: "验收动作", meta: "按钮可点击、可跳转、可提交或记录，不保留空按钮。" },
      ],
      actions: actionsMap[kind] || actionsMap.setting,
    },
  ]));
}

export const guideReferencePages = buildPages(guidePageList, guideActions);
export const merchantReferencePages = buildPages(merchantPageList, merchantActions);
export const guideReferencePageIds = guidePageList.map(([id]) => id);
export const merchantReferencePageIds = merchantPageList.map(([id]) => id);

export function getRoleReferencePage(role, pageId) {
  const source = role === "merchant" ? merchantReferencePages : guideReferencePages;
  return source[pageId] || {
    id: pageId,
    title: role === "merchant" ? "商户端页面" : "向导端页面",
    subtitle: "页面迁移中",
    items: [],
    actions: [],
  };
}
