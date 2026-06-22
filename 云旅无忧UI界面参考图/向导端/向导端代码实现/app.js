const iconPaths = {
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  clipboard: '<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><path d="M8 12h8M8 16h5"/>',
  bot: '<rect x="6" y="8" width="12" height="10" rx="4"/><path d="M12 4v4M8 13h.01M16 13h.01M9 18v2h6v-2"/><path d="M4 12h2M18 12h2"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 10h8M8 14h5"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  scan: '<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M7 12h10"/>',
  filter: '<path d="M22 3H2l8 9v7l4 2v-9z"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3M8 22h8"/>',
  mapPin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  person: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-5"/>',
  star: '<path d="m12 2 3 6 6 .9-4.5 4.4 1 6.2L12 16.6 6.5 19.5l1-6.2L3 8.9 9 8z"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  wallet: '<path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10H5a3 3 0 0 1-3-3V7"/><path d="M16 14h.01"/>',
  settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1z"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1.4-2.9 1.7-2.9 3.5M12 17h.01"/>',
  more: '<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 10v6"/><path d="M12 7h.01"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>',
  navigation: '<path d="m3 11 19-9-9 19-2-8z"/>',
  headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-2v-6h4zM3 19a2 2 0 0 0 2 2h2v-6H3z"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h2"/>',
  camera: '<path d="M14.5 4 13 2h-2L9.5 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="m20 6-11 11-5-5"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  route: '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h3a4 4 0 0 0 0-8h-1a4 4 0 0 1 0-8h4"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  walk: '<circle cx="13" cy="4" r="2"/><path d="m10 21 2-7-3-3-2 4"/><path d="m14 8 2 3 3 1"/><path d="m12 14 4 7"/>',
  bike: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M8 17h5l2-7h-4l-3 7M13 10l-2-3h3M15 10l3 7"/>',
  car: '<path d="M5 17h14l-1.5-6h-11z"/><path d="M7 17v2M17 17v2M7 11l1.2-4h7.6L17 11"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>',
  yuan: '<path d="M12 13v8M8 13h8M7 5l5 8 5-8M7 9h10"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
  chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-4 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/><path d="M3 12A9 9 0 0 1 18.5 5.7L21 8"/><path d="M21 3v5h-5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  building: '<path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M9 7h4M9 11h4M9 15h4"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M19 5a9 9 0 0 1 0 14M15 9a4 4 0 0 1 0 6"/>',
  flashlight: '<path d="M6 3h12v4H6z"/><path d="m8 7 1 14h6l1-14"/><path d="M12 11v4"/>',
  keyboard: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h.01M11 9h.01M15 9h.01M19 9h.01M7 13h.01M11 13h.01M15 13h.01M8 17h8"/>',
  id: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6 16c.8-2 5.2-2 6 0M14 9h4M14 13h4"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 12h20"/>',
  gift: '<path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5L12 7z"/><path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5L12 7z"/>',
  minusCircle: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>',
  thumbsUp: '<path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/><path d="M7 11 11 2a3 3 0 0 1 3 3v4h4.5A2.5 2.5 0 0 1 21 12l-1.2 7A3 3 0 0 1 16.8 22H7z"/>'
};

window.__errors = [];
window.addEventListener('error', event => {
  window.__errors.push(event.message);
});
window.addEventListener('unhandledrejection', event => {
  window.__errors.push(String(event.reason));
});

const orders = [];

const messages = [];

const GUIDE_PROFILE_STORAGE_KEY = 'yunlv-guide-profile';
const DEFAULT_GUIDE_AVATAR_URL = './assets/guide-avatar-li.png';
const guideProfile = {
  name: '李向导',
  initial: '李',
  gender: '男',
  phone: '138****8899',
  idCard: '5325************22',
  city: '弥勒市',
  area: '湖泉片区',
  role: '人工向导',
  intro: '熟悉弥勒本地医院与景区路线，擅长陪伴就医和旅居生活协助。',
  avatarUrl: DEFAULT_GUIDE_AVATAR_URL
};

applyGuideProfileDraft();

const GUIDE_SERVICE_TYPE_OPTIONS = [
  ['陪伴就医', '挂号、检查、取药、陪同就诊', 'clipboard', 'blue'],
  ['导游游览', '景点讲解、路线规划、拍照陪同', 'mapPin', 'purple'],
  ['生活陪伴', '聊天、散步、购物陪伴', 'shield', 'green'],
  ['接送出行', '站点接送、日常出行陪同', 'route', 'orange'],
  ['护工护理', '日常照护、康复协助', 'person', 'purple'],
  ['帮办代办', '证件、缴费、材料代办', 'list', 'blue']
];
const GUIDE_REMINDER_METHOD_LABELS = {
  sound: '声音',
  vibration: '震动',
  push: '推送',
  sms: '短信'
};

const GUIDE_FEEDBACK_STORAGE_KEY = 'yunlv-guide-feedback-records';
const GUIDE_FEEDBACK_MAX_SCREENSHOTS = 3;
const GUIDE_FEEDBACK_IMAGE_MAX_EDGE = 960;
const GUIDE_FEEDBACK_IMAGE_QUALITY = 0.76;
const GUIDE_PROTOCOLS = {
  用户协议: {
    title: '用户协议',
    iconName: 'clipboard',
    subtitle: '适用于人工向导注册、接单、履约和平台服务使用',
    sections: [
      ['blue', '账号与资质', ['向导需使用本人实名信息注册', '按平台要求提交健康证明、技能资料和服务区域', '资料变更后应及时更新并接受平台复核']],
      ['green', '接单与履约', ['上线后及时响应平台派单和客户消息', '接单后按约定时间地点提供服务', '无法履约时应提前申请取消并说明原因']],
      ['cyan', '费用与结算', ['服务费用以平台订单记录为准', '不得绕开平台私下收费或引导线下交易', '结算、提现和退款按平台规则执行']]
    ],
    warning: ['alert', '违约处理：出现虚假资料、私下交易、恶意取消或服务投诉时，平台可限制接单、暂停账号或提交后台复核。'],
    action: '确认已阅读用户协议'
  },
  隐私政策: {
    title: '隐私政策',
    iconName: 'book',
    subtitle: '说明向导端资料、定位、订单和沟通信息的使用边界',
    sections: [
      ['blue', '信息收集', ['收集注册身份、联系方式、服务资质和接单偏好', '履约中记录必要的订单状态、定位轨迹和服务凭证', '反馈和客服沟通会保存用于问题处理']],
      ['green', '使用场景', ['用于身份核验、派单匹配、服务安全和收入结算', '用于异常处理、纠纷核查和客户服务', '用于改善提醒、排班和服务推荐体验']],
      ['cyan', '保护与权利', ['敏感资料仅在必要范围内展示和使用', '未经授权不会公开个人联系方式和证件信息', '可在个人资料和设置中更新、补充或申请处理相关信息']]
    ],
    warning: ['shield', '隐私保护：平台只在履约、安全和合规所需范围内处理信息，向导也应保护客户隐私，不得截图外传或无关使用。'],
    action: '确认已阅读隐私政策'
  },
  服务规范: {
    title: '服务规范',
    iconName: 'book',
    subtitle: '适用于陪伴就医、导游游览、生活陪伴等轻服务',
    sections: [
      ['blue', '服务前', ['确认订单时间地点', '主动联系客户并说明到达时间', '查看客户健康与行动提示']],
      ['green', '服务中', ['确认客户身份', '全程记录服务轨迹', '不代收现金或私下交易', '遇到异常及时上报']],
      ['cyan', '服务后', ['上传完成凭证', '提交服务备注', '等待客户确认或平台处理']]
    ],
    warning: ['alert', '医疗边界：平台提供预约、陪同和协调服务，不提供诊断结论或用药建议。'],
    action: '确认已阅读服务规范'
  },
  服务协议: {
    title: '服务协议',
    iconName: 'clipboard',
    subtitle: '适用于向导签署后的平台派单、服务履约和资料更新约定',
    sections: [
      ['blue', '签约资料', ['使用本人实名资料完成签约', '健康证明、服务能力和常驻区域需保持真实有效', '资料更新后平台会同步复核并保留历史记录']],
      ['green', '服务责任', ['接单后按订单约定提供服务', '不得绕开平台私下收费或转单', '异常、迟到或取消需在订单内提交原因和凭证']],
      ['cyan', '平台协同', ['平台依据订单状态同步客户、向导和后台记录', '服务完成、投诉、求助和结算以后台业务记录为准', '向导可在资料页查看并补充认证材料']]
    ],
    warning: ['shield', '签约要求：实名认证、健康证明和服务协议同时有效后，向导账号才能保持正常接单状态。'],
    action: '确认已阅读服务协议'
  }
};

const screens = [
  { id: '01', title: '接单大厅', render: renderHall },
  { id: '02', title: '订单详情', render: renderOrderDetail },
  { id: '03', title: '我的订单', render: renderMyOrders },
  { id: '04', title: '服务中', render: renderInService },
  { id: '05', title: '上报异常', render: renderException },
  { id: '06', title: '消息', render: renderMessages },
  { id: '07', title: '我的', render: renderMe },
  { id: '08', title: '上线接单', render: renderOnline },
  { id: '09', title: '接单筛选', render: renderFilter },
  { id: '10', title: '已接单待出发', render: renderAccepted },
  { id: '11', title: '待确认订单详情', render: renderConfirmDetail },
  { id: '12', title: '已取消订单详情', render: renderCancelledDetail },
  { id: '13', title: '客户档案', render: renderCustomerFile },
  { id: '14', title: '首页', render: renderHome },
  { id: '15', title: '登录', render: renderLogin },
  { id: '16', title: '申请成为向导', render: renderApply },
  { id: '17', title: '审核状态', render: renderAudit },
  { id: '18', title: '今日数据详情', render: renderTodayData },
  { id: '19', title: '我的钱包', render: renderWallet },
  { id: '20', title: '提现申请', render: renderWithdraw },
  { id: '21', title: '结算记录', render: renderSettlement },
  { id: '22', title: '评价管理', render: renderReviews },
  { id: '23', title: '评价详情', render: renderReviewDetail },
  { id: '24', title: '服务区域', render: renderServiceAreas },
  { id: '25', title: '服务类型', render: renderServiceTypes },
  { id: '26', title: '接单提醒', render: renderReminderSettings },
  { id: '27', title: '路线导航', render: renderRouteNav },
  { id: '28', title: '申请取消订单', render: renderCancelRequest },
  { id: '29', title: '服务完成上报', render: renderCompleteReport },
  { id: '30', title: '已完成订单详情', render: renderCompletedDetail },
  { id: '31', title: '系统通知', render: renderSystemNotice },
  { id: '32', title: '订单消息', render: renderOrderMessages },
  { id: '33', title: '客户消息', render: renderCustomerChat },
  { id: '34', title: '平台客服', render: renderSupportChat },
  { id: '35', title: '安全中心', render: renderSafety },
  { id: '36', title: '我的排班', render: renderSchedule },
  { id: '37', title: '排班编辑', render: renderScheduleEdit },
  { id: '38', title: '服务技能', render: renderSkills },
  { id: '39', title: '工作统计', render: renderStats },
  { id: '40', title: '个人资料', render: renderProfile },
  { id: '41', title: '设置', render: renderSettings },
  { id: '42', title: '帮助中心', render: renderHelp },
  { id: '43', title: '服务规范', render: renderRules },
  { id: '44', title: '意见反馈', render: renderFeedback },
  { id: '45', title: '扫一扫', render: renderScan },
  { id: '46', title: '扫码核验', render: renderScanVerify }
];

function isGuideScreenId(id) {
  return screens.some(screen => screen.id === id);
}

function normalizeGuideScreenId(value) {
  const id = String(value || '').replace(/^#/, '');
  return isGuideScreenId(id) ? id : '';
}

function isGuidePrototypeMode() {
  return document.documentElement.dataset.display === 'prototype';
}

function syncGuidePrototypeShell() {
  const prototypeMode = isGuidePrototypeMode();
  document.querySelectorAll('[data-dev-only]').forEach(node => {
    node.hidden = !prototypeMode;
    node.setAttribute('aria-hidden', prototypeMode ? 'false' : 'true');
  });
  const list = document.getElementById('screenList');
  if (!prototypeMode && list) list.innerHTML = '';
  return prototypeMode;
}

function guideUrlLeavesEndpoint(rawUrl) {
  const href = String(rawUrl || '').trim();
  if (!href || href.startsWith('#')) return false;
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch (error) {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  return url.pathname === '/' || /^\/(?:user|merchant|admin)(?:\/|$)/.test(url.pathname);
}

function guardGuideEndpointClick(event) {
  const target = event.target?.closest?.('a[href], [data-href]');
  if (!target) return false;
  const href = target.getAttribute('href') || target.dataset.href || '';
  if (!guideUrlLeavesEndpoint(href)) return false;
  event.preventDefault();
  event.stopPropagation();
  event.guideEndpointBlocked = true;
  writeActionStatus(target, '向导端禁止跳转到其他端，已保持当前页面');
  showToast('已拦截跨端跳转');
  return true;
}

let currentIndex = 0;
const FALLBACK_BATTERY_STATUS = { level: 1, charging: false, fallback: true };
let batteryStatus = FALLBACK_BATTERY_STATUS;
let statusRuntimeReady = false;
let toastTimer = null;
let navigationStack = [];
let guideRefreshSeq = 0;
const GUIDE_REVIEW_REPLY_STORAGE_KEY = 'yunlv-guide-review-reply';
const GUIDE_REVIEW_REPLY_DEFAULT = '感谢您的认可，祝您身体健康、旅居愉快。';
const guideReviewReplyInitial = loadGuideReviewReply();
const guideState = {
  hallTab: 'recommend',
  hallCategory: '全部',
  homeCategory: '全部',
  homeRecommendOffset: 0,
  home: null,
  homeSignature: '',
  mine: null,
  mineSignature: '',
  mineLoading: false,
  mineError: '',
  settings: null,
  settingsSignature: '',
  settingsLoading: false,
  settingsError: '',
  settingsSavingKey: '',
  settingsLogoutResult: null,
  profile: null,
  profileSignature: '',
  profileLoading: false,
  profileError: '',
  profileSaving: false,
  profileCertSubmitting: '',
  hall: null,
  hallSignature: '',
  activeService: null,
  activeServiceSignature: '',
  myOrderFilter: '全部',
  myOrderFilterSeq: 0,
  orderFilter: {
    type: '陪伴就医',
    distance: '3km内',
    time: '自定义',
    sort: '距离优先',
    seq: 0
  },
  token: '',
  functionOverview: {
    loading: false,
    loaded: false,
    data: null,
    error: ''
  },
  orderStatusFlow: {
    loading: false,
    loaded: false,
    data: null,
    error: ''
  },
  messages: null,
  messageCenter: null,
  messageCenterSignature: '',
  messagesLoading: false,
  messagesError: '',
  guideNoticeFilter: '全部',
  orderMessageFilter: '全部',
  feedbackType: '功能异常',
  feedbackDescription: '',
  feedbackScreenshots: [],
  feedbackContact: {
    phone: '13800008899',
    wechat: ''
  },
  feedbackRecordOpen: false,
  feedbackRecords: loadGuideFeedbackRecords(),
  reviewReplyDraft: guideReviewReplyInitial?.text || GUIDE_REVIEW_REPLY_DEFAULT,
  reviewReply: guideReviewReplyInitial,
  customerChatReplies: [],
  supportChatReplies: [],
  serviceAreaRadius: '3km',
  serviceAreas: ['湖泉片区', '温泉康养社区', '弥勒市人民医院周边'],
  serviceTypes: ['陪伴就医', '导游游览', '生活陪伴', '接送出行'],
  fixedScheduleEnabled: true,
  privacyPermission: true,
  messageNotification: true,
  reminderMethods: {
    sound: true,
    vibration: true,
    push: true,
    sms: false
  },
  reminderEvents: {
    newOrder: true,
    dispatch: true,
    customerMessage: true,
    serviceStart: true,
    customerComplete: true,
    scheduleChange: true
  },
  onlineStatus: '',
  currentStatus: '',
  onlineUpdatedAt: '',
  protocolType: '服务规范',
  protocolConfirmed: {},
  profileCertDetail: '',
  profileCertFiles: {
    realname: '',
    health: ''
  },
  profileIntroEditing: false,
  profileIntroDraft: '',
  exceptionTypes: [],
  exceptionReport: null,
  exceptionSuccessModalOpen: false,
  safetyExceptionReport: null,
  safetyExceptionSuccessModalOpen: false,
  scanFlashlightOn: false,
  manualScanCode: '',
  scanResult: '',
  scanCameraStatus: '正在准备摄像头...',
  cancelReason: '时间无法履约',
  cancelDescription: '多次拨打电话客户未接听，已在约定地点等待 15 分钟。',
  cancelSubmitting: false,
  cancelError: '',
  cancelResult: null,
  completeProofPhotos: [
    { src: 'review-photo-entrance.jpg', label: '门诊部' },
    { src: 'review-photo-hall.jpg', label: '候诊区' },
    { src: 'review-photo-medicine.jpg', label: '药品袋' }
  ]
};

let guideScanStream = null;

const GUIDE_SYSTEM_NOTICES = [];

function icon(name, className = '') {
  const path = iconPaths[name] || iconPaths.list;
  return `<svg class="icon ${className}" data-icon="${name}" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function profileDraftFields() {
  return ['name', 'gender', 'phone', 'city', 'area', 'intro', 'avatarUrl'];
}

function applyGuideProfileDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(GUIDE_PROFILE_STORAGE_KEY) || '{}');
    if (!draft || typeof draft !== 'object') return;
    profileDraftFields().forEach(key => {
      if (typeof draft[key] === 'string' && draft[key]) guideProfile[key] = draft[key];
    });
    guideProfile.initial = guideProfile.name.slice(0, 1) || guideProfile.initial;
  } catch (error) {
    // Ignore broken local drafts; the API/default profile still renders.
  }
}

function persistGuideProfile() {
  try {
    const payload = {};
    profileDraftFields().forEach(key => {
      payload[key] = guideProfile[key];
    });
    localStorage.setItem(GUIDE_PROFILE_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    writeActionStatus(document.querySelector('.guide-profile-card') || document.getElementById('phone'), '资料已更新，当前浏览器暂无法持久保存');
  }
}

function guideAvatarUrl() {
  return guideProfile.avatarUrl || DEFAULT_GUIDE_AVATAR_URL;
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

function normalizeDialPhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '');
}

function dialHref(phone, scheme = 'tel') {
  const normalized = normalizeDialPhone(phone);
  return normalized ? `${scheme}:${normalized}` : '#';
}

function guideDialAttrs(phone) {
  const normalized = normalizeDialPhone(phone);
  return `href="${escapeHtml(dialHref(normalized))}"`;
}

function readGuideAvatarFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type || '')) {
      reject(new Error('请选择图片作为头像'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('头像加载失败，请重新选择'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('头像图片无效，请重新选择'));
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleGuideAvatarChange(input) {
  const file = input.files?.[0];
  const scope = input.closest('.guide-profile-head') || document.querySelector('.guide-profile-card') || document.getElementById('phone');
  if (!file) return;
  writeActionStatus(scope, '正在处理头像...');
  guideProfile.avatarUrl = await readGuideAvatarFile(file);
  persistGuideProfile();
  renderScreen('40', false, { replace: true, skipApiHydrate: true });
  writeActionStatus(document.querySelector('.guide-profile-head') || scope, '头像已更换');
}

const defaultRemoteApiBase = 'https://yunlv-wuyou-mvp.onrender.com';
const AMAP_KEY = 'ed0e2af40e4b73e90525252ff8fd52a8';
const AMAP_SECURITY_JS_CODE = '6a88c94ef10f6366e3cc20f337edd8fb';
const GUIDE_ROUTE_LOAD_TIMEOUT_MS = 5000;
const GUIDE_ROUTE_ORIGIN = '湖泉生态园';
const GUIDE_ROUTE_DESTINATION = '弥勒市人民医院';
let guideRouteOrigin = { name: GUIDE_ROUTE_ORIGIN, lng: null, lat: null, realtime: false };
let guideAmapPromise = null;
let guideRouteMap = null;
let guideRouteSatellite = null;
let guideRouteMode = 'walk';
let guideRouteMapReady = false;
let guideRouteSatelliteVisible = false;
let guideRouteStatusTimer = null;

function amapModeName(mode = guideRouteMode) {
  return { walk: '步行', bike: '骑行', car: '驾车' }[mode] || '步行';
}

function guideRouteWebUrl(mode = guideRouteMode) {
  const type = mode === 'bike' ? 'ride' : mode === 'car' ? 'car' : 'walk';
  const fromName = guideRouteOrigin.realtime ? '我的实时位置' : guideRouteOrigin.name || GUIDE_ROUTE_ORIGIN;
  const fromParams = guideRouteOrigin.lng && guideRouteOrigin.lat
    ? `from%5Bname%5D=${encodeURIComponent(fromName)}&from%5Blnglat%5D=${encodeURIComponent(`${guideRouteOrigin.lng},${guideRouteOrigin.lat}`)}`
    : `from%5Bname%5D=${encodeURIComponent(fromName)}`;
  return `https://www.amap.com/dir?${fromParams}&to%5Bname%5D=${encodeURIComponent(GUIDE_ROUTE_DESTINATION)}&type=${type}`;
}

function guideRouteNativeUrl(point, origin = guideRouteOrigin) {
  if (!point) return guideRouteWebUrl();
  const mode = guideRouteMode === 'car' ? 'car' : guideRouteMode === 'bike' ? 'ride' : 'walk';
  const from = origin?.lng && origin?.lat ? `&from=${encodeURIComponent(`${origin.lng},${origin.lat},${origin.name || '我的实时位置'}`)}` : '';
  return `https://uri.amap.com/navigation?to=${encodeURIComponent(`${point.lng},${point.lat},${GUIDE_ROUTE_DESTINATION}`)}${from}&mode=${mode}&policy=1&src=${encodeURIComponent('云旅无忧向导端')}&coordinate=gaode&callnative=1`;
}

function setGuideRouteStatus(status, message, state = 'loading', html = false) {
  if (!status) return;
  status.dataset.guideRouteState = state;
  if (html) status.innerHTML = message;
  else status.textContent = message;
}

function clearGuideRouteStatusTimer() {
  if (guideRouteStatusTimer) {
    window.clearTimeout(guideRouteStatusTimer);
    guideRouteStatusTimer = null;
  }
}

function armGuideRouteSlowStatus(status) {
  clearGuideRouteStatusTimer();
  guideRouteStatusTimer = window.setTimeout(() => {
    setGuideRouteStatus(
      status,
      '地图或定位响应较慢，已保留默认起点；可继续等待，或直接点击「开始导航」。',
      'slow'
    );
  }, GUIDE_ROUTE_LOAD_TIMEOUT_MS);
}

function guideRouteFallbackStatusHtml(reason) {
  return `
    <span>${escapeHtml(reason)} 已使用默认服务起点，开始导航入口仍可用。</span>
    <a href="${escapeHtml(guideRouteWebUrl())}" target="_blank" rel="noopener noreferrer">打开高德网页版</a>
  `;
}

function loadGuideAmap() {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (guideAmapPromise) return guideAmapPromise;
  window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_JS_CODE };
  guideAmapPromise = new Promise((resolve, reject) => {
    let settled = false;
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(AMAP_KEY)}&plugin=AMap.Geocoder,AMap.Scale,AMap.Walking,AMap.Riding,AMap.Driving,AMap.Geolocation`;
    script.async = true;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('高德地图加载超时'));
    }, GUIDE_ROUTE_LOAD_TIMEOUT_MS + 2500);
    script.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.AMap ? resolve(window.AMap) : reject(new Error('高德地图加载失败'));
    };
    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      reject(new Error('高德地图脚本加载失败'));
    };
    document.head.appendChild(script);
  }).catch(error => {
    guideAmapPromise = null;
    throw error;
  });
  return guideAmapPromise;
}

function geocodeGuideRouteAddress(AMapRef, address) {
  return new Promise((resolve) => {
    if (!AMapRef?.Geocoder) {
      resolve(null);
      return;
    }
    const geocoder = new AMapRef.Geocoder({ city: '弥勒市' });
    geocoder.getLocation(address, (status, result) => {
      const point = result?.geocodes?.[0]?.location;
      resolve(status === 'complete' && point ? point : null);
    });
  });
}

function locateGuideCurrentPosition(AMapRef) {
  return new Promise((resolve) => {
    const done = (position) => {
      if (!position) {
        resolve(null);
        return;
      }
      const lng = Number(position.lng ?? position.longitude);
      const lat = Number(position.lat ?? position.latitude);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
        resolve(null);
        return;
      }
      resolve({ lng, lat, name: '我的实时位置', realtime: true });
    };
    if (navigator.geolocation && (window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      navigator.geolocation.getCurrentPosition(
        (result) => done(result.coords),
        () => done(null),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 }
      );
      return;
    }
    if (AMapRef?.Geolocation) {
      const geolocation = new AMapRef.Geolocation({
        enableHighAccuracy: true,
        timeout: 8000,
        showButton: false,
        showMarker: false,
        showCircle: false
      });
      geolocation.getCurrentPosition((status, result) => {
        const pos = result?.position;
        done(status === 'complete' && pos ? { lng: pos.lng, lat: pos.lat } : null);
      });
      return;
    }
    done(null);
  });
}

async function hydrateRouteNavigation(force = false) {
  const container = document.querySelector('[data-guide-route-map]');
  if (!container) return;
  const status = document.querySelector('[data-guide-route-status]');
  if (force) {
    guideRouteMap = null;
    guideRouteSatellite = null;
    guideRouteSatelliteVisible = false;
  }
  if (guideRouteMap && !force) {
    guideRouteMap.setFitView();
    return;
  }
  setGuideRouteStatus(status, '正在获取实时位置并加载高德路线...', 'loading');
  armGuideRouteSlowStatus(status);
  try {
    const AMapRef = await loadGuideAmap();
    setGuideRouteStatus(status, '高德地图已加载，正在获取位置并规划路线...', 'loading');
    const [fallbackOrigin, realtimeOrigin, destination] = await Promise.all([
      geocodeGuideRouteAddress(AMapRef, guideRouteOrigin.name || GUIDE_ROUTE_ORIGIN),
      locateGuideCurrentPosition(AMapRef),
      geocodeGuideRouteAddress(AMapRef, GUIDE_ROUTE_DESTINATION)
    ]);
    const origin = realtimeOrigin || fallbackOrigin;
    if (!origin || !destination) throw new Error('服务地点解析失败');
    guideRouteOrigin = realtimeOrigin || { name: GUIDE_ROUTE_ORIGIN, lng: origin.lng, lat: origin.lat, realtime: false };
    container.innerHTML = '';
    guideRouteMap = new AMapRef.Map(container, {
      zoom: 14,
      center: [origin.lng, origin.lat],
      viewMode: '2D'
    });
    guideRouteMap.addControl(new AMapRef.Scale());
    new AMapRef.Marker({ map: guideRouteMap, position: origin, title: guideRouteOrigin.realtime ? '我的实时位置' : '默认服务起点' });
    new AMapRef.Marker({ map: guideRouteMap, position: destination, title: GUIDE_ROUTE_DESTINATION });
    const RouteCtor = guideRouteMode === 'car' ? AMapRef.Driving : guideRouteMode === 'bike' ? AMapRef.Riding : AMapRef.Walking;
    const route = new RouteCtor({ map: guideRouteMap, hideMarkers: true });
    setGuideRouteStatus(status, `正在规划${amapModeName()}路线...`, 'loading');
    route.search(origin, destination, (routeStatus) => {
      guideRouteMap?.setFitView();
      clearGuideRouteStatusTimer();
      if (routeStatus === 'complete') {
        setGuideRouteStatus(
          status,
          guideRouteOrigin.realtime
            ? `已使用实时定位：${amapModeName()}路线 → ${GUIDE_ROUTE_DESTINATION}`
            : `未获得实时定位，已使用默认起点：${amapModeName()}路线 ${GUIDE_ROUTE_ORIGIN} → ${GUIDE_ROUTE_DESTINATION}`,
          guideRouteOrigin.realtime ? 'ready' : 'fallback'
        );
      } else {
        setGuideRouteStatus(
          status,
          guideRouteFallbackStatusHtml('高德路线规划暂未完成'),
          'fallback',
          true
        );
      }
    });
    guideRouteMapReady = true;
    guideRouteSatelliteVisible = false;
    container.dataset.loaded = 'true';
    container.dataset.originLng = origin.lng;
    container.dataset.originLat = origin.lat;
    container.dataset.destinationLng = destination.lng;
    container.dataset.destinationLat = destination.lat;
    const currentLabel = document.querySelector('[data-guide-route-origin-label]');
    if (currentLabel) currentLabel.innerHTML = `${guideRouteOrigin.realtime ? '实时位置' : '默认起点'}<br>${guideRouteOrigin.name || GUIDE_ROUTE_ORIGIN}`;
    setGuideRouteStatus(
      status,
      guideRouteOrigin.realtime
        ? `已获取实时定位，正在绘制${amapModeName()}路线...`
        : `未获得实时定位，使用默认起点继续绘制${amapModeName()}路线...`,
      guideRouteOrigin.realtime ? 'ready' : 'fallback'
    );
  } catch (error) {
    clearGuideRouteStatusTimer();
    guideRouteMapReady = false;
    container.dataset.loaded = 'fallback';
    setGuideRouteStatus(
      status,
      guideRouteFallbackStatusHtml(guideFriendlyStatusMessage(error.message, '地图加载暂不可用')),
      'fallback',
      true
    );
  }
}

async function openGuideRouteNavigation() {
  const url = guideRouteWebUrl();
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  if (!opened) window.location.href = url;
}

function apiBase() {
  const explicit = window.YUNLV_API_BASE || window.localStorage?.getItem?.('YUNLV_API_BASE') || '';
  if (explicit) return explicit.replace(/\/$/, '');
  return window.location.hostname.endsWith('github.io') ? defaultRemoteApiBase : '';
}

function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const base = apiBase();
  return base ? `${base}${path.startsWith('/') ? path : `/${path}`}` : path;
}

async function guideApiRequest(path, options = {}) {
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (guideState.token && !headers.Authorization && !options.public) {
    headers.Authorization = `Bearer ${guideState.token}`;
  }
  const response = await fetch(apiUrl(path), {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || '服务请求失败，请稍后重试');
  }
  return payload.data;
}

function guideFriendlyStatusMessage(value, fallback = '服务暂不可用，请稍后重试') {
  const text = String(value || '').trim();
  const cleaned = text
    .replace(/\/api\/[^\s，。:：]*/g, '服务')
    .replace(/API/gi, '平台')
    .replace(/接口/g, '服务')
    .replace(/读取/g, '加载')
    .replace(/真实/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || fallback;
}

async function ensureGuideToken() {
  if (guideState.token) return guideState.token;
  const session = await guideApiRequest('/api/auth/login', {
    method: 'POST',
    body: { role: 'guide' },
    public: true,
  });
  guideState.token = session.token;
  return session.token;
}

async function loadGuideFunctionOverview(options = {}) {
  const state = guideState.functionOverview;
  if (state.loading) return;
  if (state.loaded && !options.force) return;
  state.loading = true;
  state.error = '';
  if (screens[currentIndex]?.id === '14') renderScreen('14', false, { replace: true });
  try {
    await ensureGuideToken();
    state.data = await guideApiRequest('/api/guide/functions/overview?guideId=guide-001');
    state.loaded = true;
  } catch (error) {
    state.error = guideFriendlyStatusMessage(error.message, '服务能力加载失败，请稍后重试');
  } finally {
    state.loading = false;
    if (screens[currentIndex]?.id === '14') renderScreen('14', false, { replace: true });
  }
}

function ensureGuideFunctionOverview(screenId) {
  if (screenId !== '14') return;
  const state = guideState.functionOverview;
  if (state.loaded || state.loading || state.error) return;
  loadGuideFunctionOverview();
}

function guideRouteToScreenId(route, fallback = '14') {
  const screenId = String(route || '').split('#').pop();
  return screens.some(screen => screen.id === screenId) ? screenId : fallback;
}

const GUIDE_BACK_FALLBACKS = {
  '26': '41'
};

function guideBackFallbackScreen(currentId) {
  const fallback = GUIDE_BACK_FALLBACKS[currentId] || '14';
  return screens.some(screen => screen.id === fallback) ? fallback : '14';
}

function formatOverviewMetric(value) {
  if (value === true) return '已具备';
  if (value === false) return '未满足';
  if (Array.isArray(value)) return value.join('、');
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([key, count]) => `${key}${count}`).join(' / ');
  }
  return value ?? '-';
}

function guideStats() {
  return guideState.dashboard?.stats || guideState.income?.stats || {};
}

function guideStatNumber(...keys) {
  const stats = guideStats();
  for (const key of keys) {
    const value = Number(stats[key]);
    if (Number.isFinite(value)) return value;
  }
  return 0;
}

function guideMoney(value) {
  return `¥${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function guideGoodRate() {
  const rating = guideStatNumber('rating');
  return rating ? `${Math.min(100, (rating / 5) * 100).toFixed(1)}%` : '0%';
}

function renderGuideFunctionOverviewPanel() {
  const state = guideState.functionOverview;
  if (state.loading && !state.data) {
    return `
      <section class="card section guide-function-overview guide-function-loading">
        <div class="guide-function-head">
          <div><h2 class="section-title">服务能力</h2><p>正在同步今日接单与服务状态</p></div>
        </div>
        ${Array.from({ length: 3 }, () => '<div class="guide-function-skeleton"></div>').join('')}
      </section>
    `;
  }
  if (state.error) {
    return `
      <section class="card section guide-function-overview guide-function-error">
        <div class="guide-function-head">
          <div><h2 class="section-title">服务能力</h2><p>${escapeHtml(state.error)}</p></div>
          <button class="secondary-btn" type="button" data-guide-function-refresh="true">${icon('refresh')} 重新加载</button>
        </div>
      </section>
    `;
  }
  const data = state.data;
  if (!data) {
    return `
      <section class="card section guide-function-overview">
        <div class="guide-function-head">
          <div><h2 class="section-title">服务能力</h2><p>准备同步今日接单状态</p></div>
          <button class="secondary-btn" type="button" data-guide-function-refresh="true">${icon('refresh')} 加载</button>
        </div>
      </section>
    `;
  }

  const modules = data.modules || [];
  return `
    <section class="card section guide-function-overview">
      <div class="guide-function-head">
        <div>
          <h2 class="section-title">服务能力</h2>
          <p>今日可接单能力、服务状态与平台派单同步</p>
        </div>
        <button class="secondary-btn" type="button" data-guide-function-refresh="true">${icon('refresh')} 刷新</button>
      </div>
      <div class="guide-function-summary">
        <span><b>${data.moduleCount}</b><small>能力项</small></span>
        <span><b>${data.p0Count}</b><small>核心项</small></span>
        <span><b>${data.implementedCount}</b><small>已接入</small></span>
      </div>
      <div class="guide-function-list">
        ${modules.map(module => {
          const target = guideRouteToScreenId(module.route);
          const metrics = module.runtime?.metrics || {};
          const firstMetric = Object.entries(metrics)[0];
          const metricText = firstMetric ? `${firstMetric[0]}：${formatOverviewMetric(firstMetric[1])}` : '等待运行数据';
          return `
            <button class="guide-function-row" type="button" data-open="${target}">
              <span class="guide-function-priority ${module.priority === 'P0' ? 'p0' : 'p1'}">${escapeHtml(module.priority)}</span>
              <span class="guide-function-main">
                <strong>${escapeHtml(module.module)} <em>${escapeHtml(module.runtime?.status || '已接入')}</em></strong>
                <small>${escapeHtml(module.requirementText || '')}</small>
                <small>${escapeHtml(module.acceptance || '')}</small>
              </span>
              <span class="guide-function-meta"><small>${escapeHtml(metricText)}</small>${icon('chevronRight')}</span>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

async function loadGuideOrderStatusFlow(options = {}) {
  const state = guideState.orderStatusFlow;
  if (state.loading) return;
  if (state.loaded && !options.force) return;
  state.loading = true;
  state.error = '';
  if (screens[currentIndex]?.id === '03') renderScreen('03', false, { replace: true });
  try {
    await ensureGuideToken();
    state.data = await guideApiRequest('/api/guide/order-status-flow?guideId=guide-001');
    state.loaded = true;
  } catch (error) {
    state.error = guideFriendlyStatusMessage(error.message, '订单状态流加载失败，请稍后重试');
  } finally {
    state.loading = false;
    if (screens[currentIndex]?.id === '03') renderScreen('03', false, { replace: true });
  }
}

function ensureGuideOrderStatusFlow(screenId) {
  if (screenId !== '__hidden_status_flow__') return;
  const state = guideState.orderStatusFlow;
  if (state.loaded || state.loading || state.error) return;
  loadGuideOrderStatusFlow();
}

function renderGuideOrderStatusFlowPanel() {
  const state = guideState.orderStatusFlow;
  if (state.loading && !state.data) {
    return `
      <section class="card section guide-status-flow guide-status-loading">
        <div class="guide-status-flow-head">
          <div><h2 class="section-title">人工向导端订单状态流</h2><p>正在同步订单状态</p></div>
        </div>
        ${Array.from({ length: 3 }, () => '<div class="guide-function-skeleton"></div>').join('')}
      </section>
    `;
  }
  if (state.error) {
    return `
      <section class="card section guide-status-flow guide-function-error">
        <div class="guide-status-flow-head">
          <div><h2 class="section-title">人工向导端订单状态流</h2><p>${escapeHtml(state.error)}</p></div>
          <button class="secondary-btn" type="button" data-guide-status-flow-refresh="true">${icon('refresh')} 重新加载</button>
        </div>
      </section>
    `;
  }
  const data = state.data;
  if (!data) {
    return `
      <section class="card section guide-status-flow">
        <div class="guide-status-flow-head">
          <div><h2 class="section-title">人工向导端订单状态流</h2><p>准备同步订单状态</p></div>
          <button class="secondary-btn" type="button" data-guide-status-flow-refresh="true">${icon('refresh')} 加载</button>
        </div>
      </section>
    `;
  }
  const counts = data.runtime?.statusCounts || {};
  return `
    <section class="card section guide-status-flow">
      <div class="guide-status-flow-head">
        <div>
          <h2 class="section-title">人工向导端订单状态流 <small>${escapeHtml(data.version)}</small></h2>
          <p>${escapeHtml(data.source)} · ${escapeHtml(data.runtime?.guideName || '')}</p>
        </div>
        <button class="secondary-btn" type="button" data-guide-status-flow-refresh="true">${icon('refresh')} 刷新</button>
      </div>
      <div class="guide-status-summary">
        ${['待接单', '已接单', '服务中', '待确认', '已完成', '已取消'].map(status => `<span><b>${Number(counts[status] || 0)}</b><small>${status}</small></span>`).join('')}
      </div>
      <div class="guide-status-flow-list">
        ${(data.flow || []).map((item, index) => {
          const target = guideRouteToScreenId(item.route, '03');
          return `
            <button class="guide-status-flow-row" type="button" data-open="${target}">
              <span class="guide-status-index">${index + 1}</span>
              <span class="guide-status-main">
                <strong>${escapeHtml(item.status)} <em>${Number(item.runtimeCount || 0)} 单</em></strong>
                <small>触发：${escapeHtml(item.triggerText)}</small>
                <small>操作：${escapeHtml(item.operationText)}</small>
              </span>
              ${icon('chevronRight')}
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function statusBar(light = false) {
  return `
    <div class="status-bar ${light ? 'light' : ''}" aria-label="系统状态栏预览">
      <span class="status-time" data-status-time>--:--</span>
      <div class="status-icons">
        <span class="signal" data-signal aria-label="网络状态"><i></i><i></i><i></i><i></i></span>
        <span class="wifi is-hidden" data-wifi aria-label="Wi-Fi 状态"><i></i><i></i><i></i></span>
        <span class="cellular-label is-hidden" data-cellular-type aria-label="蜂窝网络类型">5G</span>
        <span class="battery" data-battery aria-label="电池状态"></span>
      </div>
    </div>
  `;
}

function statusConnection() {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

function normalizedConnectionType(connection) {
  return String(connection?.type || '').toLowerCase();
}

function isCellularConnectionType(connectionType) {
  return ['cellular', '2g', '3g', '4g', '5g'].includes(connectionType);
}

function isWifiConnection(online, connection) {
  const connectionType = normalizedConnectionType(connection);
  if (!online || connectionType === 'none') return false;
  if (['wifi', 'wlan'].includes(connectionType)) return true;
  if (isCellularConnectionType(connectionType)) return false;
  return true;
}

function cellularNetworkLabel(connection) {
  const connectionType = normalizedConnectionType(connection);
  const effectiveType = String(connection?.effectiveType || '').toLowerCase();
  if (connectionType.includes('5g') || effectiveType.includes('5g')) return '5G';
  if (connectionType.includes('4g') || effectiveType.includes('4g')) {
    const downlink = Number(connection?.downlink || 0);
    const rtt = Number(connection?.rtt || 0);
    return downlink >= 50 || (downlink >= 25 && rtt > 0 && rtt <= 50) ? '5G' : '4G';
  }
  return '4G';
}

function formatStatusTime() {
  const date = new Date();
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function syncStatusBar() {
  document.querySelectorAll('[data-status-time]').forEach(node => {
    node.textContent = formatStatusTime();
  });
  const connection = statusConnection();
  const online = navigator.onLine !== false;
  const effectiveType = connection?.effectiveType || '';
  const bars = !online ? 0 : effectiveType.includes('2g') ? 1 : effectiveType === '3g' ? 2 : 4;
  const isWifi = isWifiConnection(online, connection);
  const cellularLabel = cellularNetworkLabel(connection);
  document.querySelectorAll('[data-signal]').forEach(signal => {
    signal.className = `signal bars-${bars} ${online ? '' : 'is-offline'}`.trim();
    signal.setAttribute('aria-label', online ? `网络在线${effectiveType ? `，${effectiveType.toUpperCase()}` : ''}` : '网络离线');
  });
  document.querySelectorAll('[data-wifi]').forEach(wifi => {
    wifi.classList.toggle('is-hidden', !isWifi);
    wifi.setAttribute('aria-label', isWifi ? 'Wi-Fi 已连接' : '当前为蜂窝网络或离线');
  });
  document.querySelectorAll('[data-cellular-type]').forEach(node => {
    node.textContent = cellularLabel;
    node.classList.toggle('is-hidden', isWifi || !online);
    node.setAttribute('aria-label', `蜂窝网络 ${cellularLabel}`);
  });
  document.querySelectorAll('[data-battery]').forEach(battery => {
    const source = batteryStatus && Number.isFinite(batteryStatus.level) ? batteryStatus : FALLBACK_BATTERY_STATUS;
    const level = Math.max(0, Math.min(1, source.level));
    battery.style.setProperty('--battery-level', level.toFixed(2));
    battery.classList.remove('is-hidden', 'is-low', 'is-charging');
    battery.classList.toggle('is-low', level <= 0.2 && !source.charging);
    battery.classList.toggle('is-charging', !!source.charging);
    battery.setAttribute(
      'aria-label',
      source.fallback ? '电池图标（浏览器暂未提供电量）' : `电量 ${Math.round(level * 100)}%${source.charging ? '，充电中' : ''}`
    );
  });
}

function initStatusRuntime() {
  if (statusRuntimeReady) return;
  statusRuntimeReady = true;
  window.setInterval(syncStatusBar, 30 * 1000);
  window.addEventListener('online', syncStatusBar);
  window.addEventListener('offline', syncStatusBar);
  const connection = statusConnection();
  if (connection?.addEventListener) connection.addEventListener('change', syncStatusBar);
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      batteryStatus = battery;
      ['chargingchange', 'levelchange'].forEach(eventName => battery.addEventListener(eventName, syncStatusBar));
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

function topbar(title, options = {}) {
  const { back = true, right = '', light = false } = options;
  return `
    <div class="topbar ${light ? 'light' : ''}">
      <div>${back ? `<button class="icon-btn" type="button" data-back="true" data-action="返回上一页" aria-label="返回">${icon('chevronLeft')}</button>` : ''}</div>
      <div class="topbar-title">${title}</div>
      <div class="right">${right}</div>
    </div>
  `;
}

function bindPassiveButtonsToHtml(html) {
  return String(html || '').replace(
    /<button\b(?![^>]*\bdata-(?:route|action|open|step|go|screen|back|guide-avatar-change|guide-profile-refresh|guide-profile-cert|guide-profile-cert-submit|guide-profile-intro-edit|guide-profile-intro-cancel|guide-profile-intro-save|guide-mine-refresh|guide-settings-refresh|guide-settings-logout|guide-order-message-filter|guide-notice-filter|guide-cancel-reason|guide-cancel-submit)=)(?![^>]*\bdata-add-cart(?:=|\s|>))(?![^>]*\btype=["']submit["'])/gi,
    '<button data-action="查看详情"',
  );
}

const guideContinuityTitles = new Set([
  '上报异常',
  '消息',
  '登录',
  '申请成为向导',
  '审核状态',
  '提现申请',
  '路线导航',
  '申请取消订单',
  '系统通知',
  '订单消息',
  '服务技能',
  '个人资料',
  '设置',
  '帮助中心',
  '服务规范',
  '意见反馈',
  '扫码核验'
]);

function shell(title, content, options = {}) {
  const bottom = options.bottom ? bottomNav(options.active || '') : '';
  const showContinuity = false;
  return bindPassiveButtonsToHtml(`
    <div class="app-screen ${options.white ? 'white' : ''}">
      ${statusBar(options.light)}
      ${options.noTop ? '' : topbar(title, options)}
      <div class="screen-scroll ${options.bottom ? 'with-bottom' : ''}">
        ${content}
        ${showContinuity ? guideAssurance(title) : ''}
        ${guidePageInventory()}
      </div>
      ${bottom}
    </div>
  `);
}

function guidePageInventory() {
  return `<div class="sr-only" aria-label="向导端页面清单">${screens.map(screen => `<span data-guide-page="${screen.id}">${screen.title}</span>`).join('')}</div>`;
}

function guideAssurance(title = '') {
  const pageName = title || '当前页面';
  return `
    <section class="card guide-assurance">
      <h2 class="section-title">${pageName}服务闭环</h2>
      <p>该页面的操作会同步到平台订单、消息和服务记录。处理前请核对客户姓名、订单编号、服务时间、地点、联系方式和特殊需求；涉及异常、取消、提现、审核或资料变更时，请补充原因、凭证和处理结果，便于用户端、后台和向导端保持一致。</p>
      <p>服务执行中遇到健康风险、地点变化、客户失联、费用争议或扫码核验异常，请优先联系平台客服并保留聊天、定位、照片、核验结果和服务凭证，后续可在我的订单、系统通知和工作统计中追踪。</p>
      <div class="guide-assurance-actions">
        <button type="button" data-open="35">${icon('shield')}安全中心</button>
        <button type="button" data-open="43">${icon('book')}服务规范</button>
        <button type="button" data-open="34">${icon('headset')}平台客服</button>
      </div>
    </section>
  `;
}

function guideMessageCenterMessages() {
  if (Array.isArray(guideState.messageCenter?.messages)) return guideState.messageCenter.messages;
  return Array.isArray(guideState.messages) ? guideState.messages : [];
}

function guideSystemMessages(messages = guideMessageCenterMessages()) {
  if (messages === guideMessageCenterMessages() && Array.isArray(guideState.messageCenter?.systemNotices)) {
    return guideState.messageCenter.systemNotices;
  }
  const rows = Array.isArray(messages) ? messages.filter(message => (message.category || '') === 'system') : [];
  if (rows.length || Array.isArray(guideState.messages)) return rows;
  return GUIDE_SYSTEM_NOTICES.map((notice, index) => ({
    id: `guide-static-notice-${index + 1}`,
    title: notice[0] || '系统通知',
    content: notice[1] || '请查看平台通知',
    createdAt: notice[2] || '',
    read: notice[6] === false,
    category: 'system',
    route: '31'
  }));
}

function guideUnreadMessages(messages = guideMessageCenterMessages()) {
  return Array.isArray(messages) ? messages.filter(message => !message.read) : [];
}

function guideSystemNoticeUnreadCount() {
  const summary = guideState.messageCenter?.summary;
  if (summary && Number.isFinite(Number(summary.systemUnread))) return Number(summary.systemUnread);
  return guideUnreadMessages(guideSystemMessages()).length;
}

function isGuideInteractiveMessage(message = {}) {
  if (message.category === 'interactive') return true;
  return /客户|咨询|客服|聊天|互动|评价|回复|联系/.test(`${message.title || ''}${message.content || ''}${message.scenario || ''}`);
}

function guideInteractiveMessages(messages = guideMessageCenterMessages()) {
  if (messages === guideMessageCenterMessages() && Array.isArray(guideState.messageCenter?.interactiveMessages)) {
    return guideState.messageCenter.interactiveMessages;
  }
  return Array.isArray(messages) ? messages.filter(isGuideInteractiveMessage) : [];
}

function guideMessageBadgeCount() {
  const summary = guideState.messageCenter?.summary;
  if (summary && Number.isFinite(Number(summary.unread))) return Number(summary.unread);
  return guideUnreadMessages(guideMessageCenterMessages()).length;
}

function guideMessageBadgeHtml() {
  const count = guideMessageBadgeCount();
  return count ? `<span class="badge">${count}</span>` : '';
}

function bottomNav(active) {
  const tabs = [
    ['home', '首页', 'home', '14'],
    ['hall', '接单大厅', 'clipboard', '01'],
    ['serving', '接单中', 'bot', '04'],
    ['message', '消息', 'message', '06'],
    ['mine', '我的', 'user', '07']
  ];
  return `
    <nav class="bottom-nav" aria-label="底部导航">
      ${tabs.map(([key, label, name, target]) => {
        if (key === 'serving') {
          return `
            <button class="tab-item ${active === key ? 'active' : ''}" type="button" data-open="${target}">
              <span class="robot-tab"><span class="robot-face"></span><small>接单中</small></span>
            </button>
          `;
        }
        const badge = key === 'message' ? guideMessageBadgeHtml() : '';
        return `
          <button class="tab-item ${active === key ? 'active' : ''}" type="button" data-open="${target}">
            <span class="tab-icon-wrap">${icon(name)}${badge}</span>
            <span>${label}</span>
          </button>
        `;
      }).join('')}
    </nav>
  `;
}

function pill(text, color = '') {
  return `<span class="pill ${color}">${text}</span>`;
}

function orderCard(order, options = {}) {
  if (!order) {
    return `
      <article class="card order-card guide-empty-order">
        <div class="order-card-head">
          ${pill('后台派单', 'gray')}
          <span class="muted">等待后台派单</span>
        </div>
        <div class="order-title">
          <strong>暂无可处理订单</strong>
          <strong>请稍后刷新</strong>
        </div>
        <div class="order-line">${icon('clipboard')}<span>后台派单后会在这里展示</span></div>
      </article>
    `;
  }
  const action = options.action || '接单';
  const open = options.open || '02';
  const status = options.status || '';
  const actionAttrs = options.accept
    ? `data-guide-accept-order="${escapeHtml(order.orderId || order.no || '')}" data-guide-accept-task="${escapeHtml(order.taskId || '')}"`
    : `data-open="${open}"`;
  return `
    <article class="card order-card">
      <div class="order-card-head">
        ${pill(order.tag, order.color)}
        <span class="muted">${status || `距离 ${order.distance}`}</span>
      </div>
      <div class="order-title">
        <strong>${order.customer}</strong>
        <strong>${order.service}</strong>
      </div>
      <div class="order-line">${icon('clock')}<span>${order.time}</span></div>
      <div class="order-line">${icon('mapPin')}<span>${order.place}</span></div>
      <div class="order-line">${icon('person')}<span>${order.content}</span></div>
      <div class="order-foot">
        <div>
          <span class="price guide-price-inline"><small>¥</small>${order.price}</span>
          <span class="muted" style="margin-left: 12px;">预计 ${order.duration}</span>
        </div>
        <button class="primary-btn" type="button" ${actionAttrs}>${action}</button>
      </div>
    </article>
  `;
}

function profileBlock(options = {}) {
  const {
    name = '李奶奶',
    age = '72岁',
    desc = '女  |  72岁  |  疼痛老人用户',
    avatar = 'elder',
    tags = [pill('健康状况', ''), pill('良好', 'green')]
  } = options;
  return `
    <div class="profile">
      <div class="avatar ${avatar}">${name.slice(0, 1)}</div>
      <div class="profile-main">
        <strong>${name}</strong>${age ? pill(age, 'gray') : ''}
        <p>${desc}</p>
        <p>${tags.join(' ')}</p>
      </div>
    </div>
  `;
}

function detailRows(rows) {
  return `<div class="detail-rows">${rows.map(([label, value]) => `<div class="detail-row"><div class="label">${label}</div><div class="value">${value}</div></div>`).join('')}</div>`;
}

function menuRows(rows) {
  return `
    <div class="card menu-list">
      ${rows.map(row => `
        <div class="menu-row" ${row.open ? `data-open="${row.open}"` : row.settingKey ? `data-guide-settings-toggle="${row.settingKey}" data-guide-settings-group="${row.settingGroup || ''}"` : row.action ? `data-action="${row.action}"` : ''} role="button" tabindex="0">
          <div class="menu-left">
            <span class="soft-icon ${row.color || ''}">${icon(row.icon || 'list')}</span>
            <div>
              <strong>${row.title}</strong>
              ${row.desc ? `<small>${row.desc}</small>` : ''}
            </div>
          </div>
          <div class="row" style="gap: 6px;">
            ${row.value ? `<span class="muted">${row.value}</span>` : ''}
            ${row.toggle ? `<span class="switch ${row.toggle === 'on' ? 'on' : ''}"></span>` : icon('chevronRight')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function checkList(items, warnText = '') {
  return `
    <div class="check-list">
      ${items.map(text => `<div class="check-item"><span class="check-dot">✓</span><span>${text}</span></div>`).join('')}
      ${warnText ? `<div class="check-item orange"><span class="check-dot" style="background: var(--orange);">!</span><span>${warnText}</span></div>` : ''}
    </div>
  `;
}

function mapBox(label = '弥勒市人民医院') {
  return `<div class="map-box"><span class="pin-dot"></span><span class="map-pin">${label}</span></div>`;
}

function chartLine() {
  return `
    <div class="chart">
      <svg viewBox="0 0 320 128" preserveAspectRatio="none">
        <polyline points="10,90 64,76 118,84 170,48 226,62 308,32" fill="none" stroke="#1976ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 90 C70 76 104 96 170 48 S250 60 308 32 L308 128 L10 128Z" fill="rgba(25,118,255,.12)"/>
        <circle cx="170" cy="48" r="5" fill="#1976ff"/>
      </svg>
    </div>
  `;
}

function barList(items) {
  return `<div class="bar-list">${items.map(([label, value, width]) => `<div class="bar-line"><span>${label}</span><span class="bar-track"><i style="width:${width}%"></i></span><b>${value}</b></div>`).join('')}</div>`;
}

function formCard(rows) {
  return `
    <div class="card section">
      ${rows.map(row => `
        <div class="form-row">
          <label>${row[0]}</label>
          <input value="${row[1] || ''}" placeholder="${row[2] || ''}" />
          ${row[3] ? icon(row[3]) : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderHall() {
  const tabs = [
    ['recommend', '推荐'],
    ['nearby', '附近'],
    ['latest', '最新']
  ];
  const hallOrders = getHallOrders();
  const categories = hallCategories();
  const groupedOrders = groupHallOrders(hallOrders);
  const summaries = {
    recommend: guideState.hall ? `已同步后台，共 ${hallOrders.length} 个可查看订单` : '正在同步后台接单大厅',
    nearby: `${hallOrders.length} 个 3km 内附近订单`,
    latest: '按后台订单发布时间从新到旧排列'
  };
  const content = `
    <div class="tabs">
      ${tabs.map(([key, label]) => `<button class="tab ${guideState.hallTab === key ? 'active' : ''}" type="button" data-hall-tab="${key}" aria-pressed="${guideState.hallTab === key ? 'true' : 'false'}">${label}</button>`).join('')}
    </div>
    <div class="guide-hall-category-strip">
      ${categories.map((category) => `<button class="${guideState.hallCategory === category.name ? 'active' : ''}" type="button" data-hall-category="${category.name}" aria-pressed="${guideState.hallCategory === category.name ? 'true' : 'false'}"><span>${category.name}</span><b>${category.count}</b></button>`).join('')}
    </div>
    <p class="guide-hall-summary" data-hall-summary="${guideState.hallTab}">${summaries[guideState.hallTab]}</p>
    <div style="height: 10px;"></div>
    ${groupedOrders.map(group => `
      <section class="guide-hall-group">
        <header><strong>${group.name}</strong><span>${group.items.length} 单</span></header>
        ${group.items.map(item => {
          const canAccept = /^(待接单|待派单|已派单)$/.test(item.status || item.orderStatus || '');
          return orderCard(item, canAccept ? { accept: true, action: '接单', open: '02' } : { open: '02', action: '查看' });
        }).join('')}
      </section>
    `).join('') || `<section class="card section guide-hall-empty"><strong>暂无${guideState.hallCategory}订单</strong><span>可切换其他分类或调整筛选条件</span></section>`}
  `;
  return shell('接单大厅', content, {
    bottom: true,
    active: 'hall',
    right: `<button class="icon-btn" type="button" data-action="刷新接单大厅" data-local-action="true" data-guide-hall-refresh="true" aria-label="刷新">${icon('refresh')}</button><button class="icon-btn" type="button" data-open="09" aria-label="筛选">${icon('filter')}</button>`
  });
}

function guideHallOrderPool() {
  if (Array.isArray(guideState.hall?.orders)) {
    return guideState.hall.orders
      .map(guideHomePayloadToOrder)
      .filter(order => /^(待接单|待派单|已派单|已接单|服务中|待确认)$/.test(order.status || order.orderStatus || ''));
  }
  return orders.filter(order => /^(待接单|待派单|已派单|已接单|服务中|待确认)$/.test(order.status || order.orderStatus || ''));
}

function getTabFilteredOrders() {
  let result = [...guideHallOrderPool()];
  if (guideState.hallTab === 'nearby') {
    result = result
      .filter(order => distanceValue(order.distance) <= 3)
      .sort((left, right) => distanceValue(left.distance) - distanceValue(right.distance));
  }
  if (guideState.hallTab === 'latest') {
    result = result.sort((left, right) => timeValue(right.publishedAt) - timeValue(left.publishedAt));
  }
  return result;
}

function getHallOrders() {
  let result = getTabFilteredOrders();
  if (guideState.hallCategory !== '全部') {
    result = result.filter(order => order.tag === guideState.hallCategory);
  }
  return result;
}

function hallCategories() {
  const tabOrders = getTabFilteredOrders();
  const names = ['全部', ...Array.from(new Set(guideHallOrderPool().map(order => order.tag)))];
  return names.map(name => ({
    name,
    count: name === '全部' ? tabOrders.length : tabOrders.filter(order => order.tag === name).length
  }));
}

function groupHallOrders(items) {
  if (guideState.hallCategory !== '全部') return items.length ? [{ name: guideState.hallCategory, items }] : [];
  const order = hallCategories().map(item => item.name).filter(name => name !== '全部');
  return order
    .map(name => ({ name, items: items.filter(item => item.tag === name) }))
    .filter(group => group.items.length);
}

function distanceValue(distance) {
  return Number.parseFloat(String(distance).replace(/[^\d.]/g, '')) || 0;
}

function timeValue(time) {
  const [hour = '0', minute = '0'] = String(time).split(':');
  return Number(hour) * 60 + Number(minute);
}

function renderOrderDetail() {
  const order = orders[0];
  if (!order) {
    const content = `
      <section class="card section guide-hall-empty">
        <strong>暂无订单详情</strong>
        <span>订单详情会在后台派单或用户下单后展示。</span>
      </section>
      <button class="primary-btn wide-btn" type="button" data-open="01">返回接单大厅</button>
    `;
    return shell('订单详情', content);
  }
  const content = `
    <section class="card section guide-order-detail-card">
      <div class="row">
        ${pill(order.tag, 'orange')}
        <span class="muted" style="font-weight: 700;">待接单</span>
      </div>
      <p class="muted">订单编号： DD202405200901</p>
      <div class="row">
        ${profileBlock()}
        <button class="call-circle" type="button">${icon('phone')}</button>
      </div>
      <div style="height: 16px;"></div>
      ${detailRows([
        ['服务需求', '就医陪伴（全程陪同）'],
        ['服务时间', '2024-05-20（今天） 09:30'],
        ['服务地点', '弥勒市人民医院<br><span class="muted">云南省红河州弥勒市当中大街236号</span>'],
        ['服务内容', '· 全程陪同就医（挂号-检查-取药）<br>· 协助沟通、排队、取号<br>· 需要轮椅协助（自备轮椅）'],
        ['客户备注', '奶奶行动较慢，需要多些耐心，谢谢！']
      ])}
      <div style="height: 12px;"></div>
      ${mapBox()}
      <div style="height: 16px;"></div>
      <div class="row">
        <div><span class="muted">预计服务时长</span><br><strong style="font-size: 24px;">2.5</strong> 小时</div>
        <div style="text-align:right;"><span class="muted">预计收入</span><br><span class="price"><small>¥</small>120</span></div>
      </div>
      <button class="primary-btn wide-btn" type="button" data-guide-accept-order="${escapeHtml(order.orderId || order.no || '')}" data-guide-accept-task="${escapeHtml(order.taskId || '')}" style="margin-top: 18px;">立即接单</button>
    </section>
  `;
  return shell('订单详情', content);
}

function renderMyOrders() {
  const tabs = ['全部', '待出发', '服务中', '待确认', '已完成'];
  const orderRows = orders.map((order, index) => ({
    order,
    action: index === 0 ? '去服务' : index === 1 ? '查看' : index === 2 ? '确认' : '详情',
    open: index === 0 ? '10' : index === 1 ? '04' : index === 2 ? '11' : '30',
    status: index === 0 ? '待出发' : index === 1 ? '服务中' : index === 2 ? '待确认' : '已完成'
  }));
  const activeFilter = tabs.includes(guideState.myOrderFilter) ? guideState.myOrderFilter : '全部';
  const filteredRows = activeFilter === '全部' ? orderRows : orderRows.filter(item => item.status === activeFilter);
  const cards = filteredRows.length
    ? filteredRows.map(item => orderCard(item.order, {
      action: item.action,
      open: item.open,
      status: item.status
    })).join('')
    : orderCard(null);
  const content = `
    <div class="segmented" data-guide-orders-tabs data-active-filter="${escapeHtml(activeFilter)}" data-filter-seq="${guideState.myOrderFilterSeq}">
      ${tabs.map(label => `<button class="segment ${label === activeFilter ? 'active' : ''}" data-action="订单状态：${label}" type="button" aria-pressed="${label === activeFilter ? 'true' : 'false'}">${label}</button>`).join('')}
    </div>
    <p class="action-status" data-guide-order-filter-status>当前订单筛选：${activeFilter}，共 ${filteredRows.length} 单，刷新 ${guideState.myOrderFilterSeq} 次</p>
    <div style="height: 10px;"></div>
    ${cards}
    <button class="secondary-btn wide-btn" type="button" data-open="11">查看待确认订单详情</button>
    <button class="secondary-btn wide-btn" type="button" data-open="12">查看已取消订单详情</button>
  `;
  return shell('我的订单', content, { bottom: true, active: 'hall' });
}

function guideActiveServiceOrder() {
  const service = guideState.activeService?.service;
  if (service) {
    return {
      taskId: service.taskId || '',
      taskNo: service.taskNo || '',
      orderId: service.orderId || '',
      orderNo: service.orderNo || '',
      status: service.status || service.taskStatus || service.orderStatus || '服务中',
      customerName: service.customer?.name || '旅居用户',
      customerPhone: service.customer?.phone || '',
      customerMeta: [service.customer?.gender, service.customer?.age ? `${service.customer.age}岁` : '', service.customer?.healthNote].filter(Boolean).join('　'),
      serviceType: service.serviceType || '向导服务',
      time: service.time || '服务时间待确认',
      startTime: service.startTime || service.time || '服务开始时间待确认',
      location: service.location || '服务地点待确认',
      note: service.note || '客户暂无额外备注',
      amount: Number(service.amount || 0),
      duration: service.duration || '以实际服务时长为准',
      checklist: Array.isArray(service.checklist) ? service.checklist : [],
      progress: service.progress || { completed: 0, total: 0 },
    };
  }
  const fallback = orders.find(order => (order.status || order.orderStatus) === '服务中');
  if (!fallback) return null;
  return {
    taskId: fallback.taskId || '',
    orderId: fallback.orderId || '',
    orderNo: fallback.no || '',
    status: fallback.status || '服务中',
    customerName: fallback.customer || '旅居用户',
    customerPhone: '',
    customerMeta: fallback.age || '',
    serviceType: fallback.service || fallback.tag || '向导服务',
    time: fallback.time || '服务时间待确认',
    startTime: fallback.time || '服务开始时间待确认',
    location: fallback.place || '服务地点待确认',
    note: fallback.content || '客户暂无额外备注',
    amount: Number(fallback.price || 0),
    duration: fallback.duration || '以实际服务时长为准',
    checklist: [],
    progress: { completed: 0, total: 0 },
  };
}

function renderInService() {
  const service = guideActiveServiceOrder();
  if (!service) {
    const emptyContent = `
      <section class="card section guide-hall-empty" data-guide-active-service-state="empty">
        <strong>${guideState.activeService ? '暂无服务中订单' : '正在同步服务中订单'}</strong>
        <span>${guideState.activeService ? '后台任务进入服务中后会在这里展示。' : '请稍候，正在从后台同步当前服务。'}</span>
        <div class="row" style="margin-top:14px;">
          <button class="secondary-btn" type="button" data-action="刷新服务中订单" data-local-action="true" data-guide-active-service-refresh="true">${icon('refresh')} 刷新</button>
          <button class="primary-btn" type="button" data-open="03">查看我的订单</button>
        </div>
      </section>
    `;
    return shell('服务中', emptyContent, { bottom: true, active: 'serving' });
  }
  const checklist = service.checklist.length
    ? service.checklist
    : [{ title: '服务过程记录', description: '按订单要求完成当前服务', done: true }];
  const completed = service.progress?.completed ?? checklist.filter(item => item.done !== false).length;
  const total = service.progress?.total || checklist.length;
  const content = `
    <div class="metric-card guide-service-hero" data-guide-active-service-state="${escapeHtml(service.status)}">
      <div>当前状态</div>
      <strong>${escapeHtml(service.status)}</strong>
      <span>${escapeHtml(service.duration)}</span>
    </div>
    <section class="card section guide-service-card" data-guide-active-task="${escapeHtml(service.taskId)}" data-guide-active-order="${escapeHtml(service.orderId)}">
      <h2 class="section-title">${escapeHtml(service.customerName)}　${escapeHtml(service.serviceType)}</h2>
      <div class="order-line">${icon('calendar')}<span>开始时间　${escapeHtml(service.startTime)}</span></div>
      <div class="order-line">${icon('mapPin')}<span>服务地点　${escapeHtml(service.location)}</span></div>
      <button class="secondary-btn wide-btn guide-route-btn" type="button" data-open="27" data-guide-active-route="${escapeHtml(service.orderId)}">查看行程</button>
      <h3 class="section-title guide-service-list-title">服务清单 <small>(${completed}/${total})</small></h3>
      <div class="check-list">
        ${checklist.map(item => `<div class="check-item ${item.done === false ? 'orange' : ''}"><span class="check-dot">${item.done === false ? '!' : '✓'}</span><span><strong>${escapeHtml(item.title || item)}</strong>${item.description ? `<small>${escapeHtml(item.description)}</small>` : ''}</span></div>`).join('')}
      </div>
      <div class="divider guide-service-divider"></div>
      <h3 class="section-title">客户需求备注</h3>
      <p class="muted">${escapeHtml(service.note)}</p>
      <div class="row guide-service-actions">
        ${service.customerPhone ? `<a class="primary-btn guide-contact-btn" ${guideDialAttrs(service.customerPhone)} aria-label="拨打${escapeHtml(service.customerName)}电话">${icon('phone')} 联系客户</a>` : `<button class="primary-btn guide-contact-btn" type="button" data-open="33">${icon('message')} 联系客户</button>`}
        <button class="danger-btn" style="flex:1;" type="button" data-open="05">${icon('alert')} 上报异常</button>
      </div>
      <button class="primary-btn wide-btn" type="button" data-open="29">服务完成</button>
      <p class="muted guide-service-support">服务中遇到问题？ <button type="button" data-open="34">${icon('headset')} 联系客服</button></p>
    </section>
  `;
  return shell('服务中', content, { bottom: true, active: 'serving', right: `<button class="text-btn" type="button" data-action="刷新服务中订单" data-local-action="true" data-guide-active-service-refresh="true">刷新</button>` });
}

function renderException() {
  const selectedTypes = guideSelectedExceptionTypes();
  const report = guideState.exceptionReport;
  const showSuccessModal = Boolean(report && guideState.exceptionSuccessModalOpen);
  const content = `
    <section class="card section guide-exception-card">
      <h2 class="section-title">请选择异常类型（可多选）</h2>
      <div class="guide-exception-types" data-guide-exception-types>
        ${[
          ['客户临时取消', 'close', 'red'],
          ['客户爽约/失联', 'phone', 'green'],
          ['时间变更', 'clock', 'purple'],
          ['突发情况', 'alert', 'orange'],
          ['其他问题', 'message', 'blue']
        ].map(([label, name, color]) => `<button class="${selectedTypes.includes(label) ? 'active' : ''}" type="button" data-guide-exception-type="${label}" aria-pressed="${selectedTypes.includes(label) ? 'true' : 'false'}"><span class="quick-icon ${color}">${icon(name)}</span><strong>${label}</strong></button>`).join('')}
      </div>
    </section>
    <section class="card section guide-exception-card">
      <h2 class="section-title">详细描述（选填）</h2>
      <textarea class="textarea-box" placeholder="请详细描述异常情况，以便我们更快地协助处理。"></textarea>
    </section>
    <section class="card section guide-exception-card">
      <h2 class="section-title">上传凭证（选填）</h2>
      <div class="guide-upload-ref">
        <button type="button" data-action="上传图片">${icon('camera')}<small>上传图片</small></button>
      </div>
    </section>
    <button class="primary-btn wide-btn guide-exception-submit" type="button" data-guide-exception-submit>提交</button>
    <div data-guide-exception-result-anchor></div>
    ${showSuccessModal ? `<div class="guide-exception-modal-backdrop" data-guide-exception-success-modal role="presentation">
      <section class="guide-exception-success-modal" role="dialog" aria-modal="true" aria-labelledby="guide-exception-success-title" tabindex="-1">
        <span class="guide-exception-success-icon">${icon('check')}</span>
        <h2 id="guide-exception-success-title">提交成功</h2>
        <p>平台已收到本次异常上报，请保持电话畅通并留意订单状态变化。</p>
        <div class="guide-exception-success-meta">
          <span>异常编号：${escapeHtml(report.id)}</span>
          <span>异常类型：${escapeHtml((report.types || []).join('、'))}</span>
          <span>处理状态：${escapeHtml(report.status || '待处理')}</span>
        </div>
        <button class="primary-btn wide-btn" type="button" data-guide-exception-success-close>我知道了</button>
      </section>
    </div>` : ''}
  `;
  return shell('上报异常', content);
}

function guideSelectedExceptionTypes() {
  return Array.from(new Set((guideState.exceptionTypes || []).filter(Boolean)));
}

function toggleGuideExceptionType(button) {
  const type = button.dataset.guideExceptionType || '';
  if (!type) return;
  const selectedTypes = guideSelectedExceptionTypes();
  const selected = selectedTypes.includes(type);
  guideState.exceptionTypes = selected
    ? selectedTypes.filter(item => item !== type)
    : [...selectedTypes, type];
  guideState.exceptionReport = null;
  guideState.exceptionSuccessModalOpen = false;
  button.classList.toggle('active', !selected);
  button.setAttribute('aria-pressed', selected ? 'false' : 'true');
  const group = button.closest('[data-guide-exception-types]');
  if (group) {
    group.dataset.selectedTypes = guideSelectedExceptionTypes().join('、');
    group.querySelector('[data-action-status]')?.remove();
  }
  document.querySelector('[data-guide-exception-feedback]')?.remove();
  document.querySelector('[data-guide-exception-success-modal]')?.remove();
}

function writeGuideExceptionFeedback(text, tone = 'notice') {
  const anchor = document.querySelector('[data-guide-exception-result-anchor]') || document.querySelector('#phone .screen-scroll');
  if (!anchor) return null;
  let feedback = anchor.querySelector('[data-guide-exception-feedback]');
  if (!feedback) {
    feedback = document.createElement('section');
    feedback.dataset.guideExceptionFeedback = '';
    anchor.prepend(feedback);
  }
  feedback.className = `guide-exception-feedback ${tone}`;
  feedback.textContent = text;
  return feedback;
}

function closeGuideExceptionSuccessModal() {
  guideState.exceptionSuccessModalOpen = false;
  renderScreen('05', false, { replace: true, skipApiHydrate: true });
}

async function submitGuideException(button) {
  const selectedTypes = guideSelectedExceptionTypes();
  if (!selectedTypes.length) {
    writeGuideExceptionFeedback('请先选择异常类型', 'error');
    return;
  }
  const description = String(document.querySelector('.guide-exception-card textarea')?.value || '').trim();
  button.disabled = true;
  writeGuideExceptionFeedback('正在提交异常上报...', 'notice');
  try {
    await ensureGuideToken();
    const result = await guideApiRequest('/api/guide/exception', {
      method: 'POST',
      body: {
        guideId: guideState.dashboard?.guide?.id || 'guide-001',
        type: selectedTypes.join('、'),
        level: selectedTypes.some(type => /突发|失联|爽约/.test(type)) ? '高' : '中',
        description: description || `向导端上报异常：${selectedTypes.join('、')}`
      }
    });
    guideState.exceptionReport = {
      id: result.alert?.id || '已提交',
      types: selectedTypes,
      status: result.alert?.status || '待处理'
    };
    guideState.exceptionSuccessModalOpen = true;
    renderScreen('05', false, { replace: true, skipApiHydrate: true });
    document.querySelector('[data-guide-exception-success-modal] [role="dialog"]')?.focus({ preventScroll: true });
  } catch (error) {
    writeGuideExceptionFeedback(`异常提交失败：${guideFriendlyStatusMessage(error.message, '请稍后重试')}`, 'error');
  } finally {
    button.disabled = false;
  }
}

function renderMessages() {
  const messages = guideMessageCenterMessages();
  const summary = guideState.messageCenter?.summary || {};
  const orderMessageCount = Number.isFinite(Number(summary.orderCount)) ? Number(summary.orderCount) : guideOrderMessages(messages).length;
  const orderMessageUnreadCount = Number.isFinite(Number(summary.orderUnread)) ? Number(summary.orderUnread) : guideUnreadMessages(guideOrderMessages(messages)).length;
  const systemNoticeCount = guideSystemNoticeUnreadCount();
  const interactiveMessageCount = Number.isFinite(Number(summary.interactiveCount)) ? Number(summary.interactiveCount) : guideInteractiveMessages(messages).length;
  const unreadCount = Number.isFinite(Number(summary.unread)) ? Number(summary.unread) : guideUnreadMessages(messages).length;
  const totalCount = Number.isFinite(Number(summary.total)) ? Number(summary.total) : messages.length;
  const latestRows = messages.slice(0, 5);
  const stateBlock = guideState.messagesError
    ? `<section class="card section guide-hall-empty" data-guide-message-state="error"><strong>消息加载失败</strong><span>${escapeHtml(guideState.messagesError)}</span></section>`
    : guideState.messagesLoading && !guideState.messageCenter
      ? `<section class="card section guide-hall-empty" data-guide-message-state="loading"><strong>正在同步消息</strong><span>请稍候，正在加载平台消息。</span></section>`
      : latestRows.length
        ? `<section class="card section guide-message-latest" data-guide-message-list="${latestRows.length}">
            <div class="guide-message-section-head">
              <h2 class="section-title">最新消息</h2>
              <span>${unreadCount ? `${unreadCount} 条未读` : '全部已读'}</span>
            </div>
            ${latestRows.map((message) => {
              const route = message.route || (isGuideOrderMessage(message) ? '32' : isGuideInteractiveMessage(message) ? '33' : '31');
              return `
                <article class="guide-message-row" data-guide-message-id="${escapeHtml(message.id || '')}" data-guide-message-read-state="${message.read ? 'read' : 'unread'}">
                  <button class="guide-message-main" type="button" data-open="${escapeHtml(route)}">
                    <span class="soft-icon ${message.category === 'order' ? 'orange' : message.category === 'interactive' ? 'green' : 'blue'}">${icon(message.category === 'order' ? 'clipboard' : message.category === 'interactive' ? 'message' : 'bell')}</span>
                    <span class="guide-message-copy"><strong>${message.read ? '' : '<i></i>'}${escapeHtml(message.title || '消息提醒')}</strong><small>${escapeHtml(message.content || '请查看消息详情')}</small></span>
                  </button>
                  <button class="guide-message-read-btn" type="button" data-guide-message-read="${escapeHtml(message.id || '')}" ${message.read || !message.id ? 'disabled' : ''}>${message.read ? '已读' : '标为已读'}</button>
                </article>
              `;
            }).join('')}
          </section>`
        : `<section class="card section guide-hall-empty" data-guide-message-state="empty"><strong>暂无新消息</strong><span>订单、系统通知和客户互动会在这里汇总。</span></section>`;
  const content = `
    <section class="card guide-message-summary" data-guide-message-summary="${totalCount}">
      <div class="guide-message-summary-head">
        <span>消息中心</span>
        <strong>${unreadCount ? `${unreadCount} 条未读` : '暂无未读'}</strong>
      </div>
      <div class="guide-message-stats">
        <div><strong>${unreadCount}</strong><span>未读</span></div>
        <div><strong>${totalCount}</strong><span>总数</span></div>
        <div><strong>${orderMessageCount}</strong><span>订单</span></div>
      </div>
    </section>
    <div class="guide-message-actions">
      <button class="secondary-btn" type="button" data-guide-message-refresh="true">${icon('refresh')} 刷新</button>
      <button class="primary-btn" type="button" data-guide-message-read-all="true" ${unreadCount ? '' : 'disabled'}>${icon('check')} 全部已读</button>
    </div>
    <div class="guide-message-shortcuts">
      ${[
        ['系统通知', 'bell', 'blue', '31', systemNoticeCount ? String(systemNoticeCount) : ''],
        ['订单消息', 'clipboard', 'orange', '32', orderMessageUnreadCount ? String(orderMessageUnreadCount) : ''],
        ['互动消息', 'message', 'green', '33', interactiveMessageCount ? String(interactiveMessageCount) : '']
      ].map(([title, name, color, open, badge]) => `<button type="button" data-open="${open}"><span class="quick-icon ${color}">${icon(name)}${badge ? `<i class="badge">${badge}</i>` : ''}</span><strong>${title}</strong></button>`).join('')}
    </div>
    ${stateBlock}
  `;
  return shell('消息', content, { bottom: true, active: 'message' });
}

function isGuideOrderMessage(message = {}) {
  if (message.category === 'order') return true;
  return /订单|派单|接单|任务/.test(`${message.title || ''}${message.content || ''}${message.scenario || ''}`);
}

function guideOrderMessages(messages = guideMessageCenterMessages()) {
  if (messages === guideMessageCenterMessages() && Array.isArray(guideState.messageCenter?.orderMessages)) {
    return guideState.messageCenter.orderMessages;
  }
  return Array.isArray(messages) ? messages.filter(isGuideOrderMessage) : [];
}

function guideOrderMessageStatus(message = {}) {
  if (message.read) return '已处理';
  const text = `${message.title || ''}${message.content || ''}${message.scenario || ''}`;
  return /已处理|已完成|已确认|结算|取消申请通过|关闭/.test(text) ? '已处理' : '待处理';
}

function filteredGuideOrderMessages(messages = guideState.messages, filter = guideState.orderMessageFilter) {
  const orderMessages = guideOrderMessages(messages);
  return filter === '全部' ? orderMessages : orderMessages.filter(message => guideOrderMessageStatus(message) === filter);
}

function guideOrderMessageAction(message = {}) {
  const text = `${message.title || ''}${message.content || ''}${message.scenario || ''}`;
  if (/取消/.test(text)) return ['查看详情', '12'];
  if (/服务中|已接单/.test(text)) return ['查看服务', '04'];
  if (/完成|确认|结算/.test(text)) return ['查看订单', '30'];
  if (/出发|即将开始|导航/.test(text)) return ['去导航', '27'];
  if (/待接单|新.*订单|派单|任务/.test(text)) return ['立即查看', '01'];
  return ['查看订单', '03'];
}

function guideMessageRows(messages = []) {
  return messages.slice(0, 8).map((message) => {
    const text = `${message.title || ''}${message.content || ''}${message.scenario || ''}`;
    const isOrder = /订单|派单|接单/.test(text);
    const isCustomer = /客户|咨询/.test(text);
    return {
      icon: isOrder ? 'clipboard' : isCustomer ? 'person' : /客服/.test(text) ? 'headset' : 'volume',
      color: isOrder ? 'orange' : isCustomer ? 'green' : /客服/.test(text) ? 'purple' : 'blue',
      title: escapeHtml(message.title || '消息提醒'),
      desc: escapeHtml(message.content || '请查看消息详情'),
      value: escapeHtml((message.createdAt || '').slice(11, 16) || '刚刚'),
      open: isOrder ? '32' : isCustomer ? '33' : /客服/.test(text) ? '34' : '31'
    };
  });
}

function applyGuideOnlineSnapshot(guide = {}, options = {}) {
  if (!guide) return;
  if (guide.onlineStatus) guideState.onlineStatus = guide.onlineStatus;
  if (guide.currentStatus) guideState.currentStatus = guide.currentStatus;
  if (options.markUpdated) guideState.onlineUpdatedAt = new Date().toISOString();
  if (guideState.dashboard?.guide) {
    guideState.dashboard = {
      ...guideState.dashboard,
      guide: { ...guideState.dashboard.guide, ...guide }
    };
  }
}

function guideOnlineState() {
  const guide = guideState.dashboard?.guide || {};
  const onlineStatus = guideState.onlineStatus || guide.onlineStatus || '在线';
  const currentStatus = guideState.currentStatus || guide.currentStatus || (onlineStatus === '在线' ? '空闲中' : '休息中');
  const isOnline = onlineStatus === '在线';
  const statusText = isOnline
    ? (currentStatus && currentStatus !== '空闲中' ? `在线 · ${currentStatus}` : '在线接单中')
    : '离线休息中';
  const updatedText = guideState.onlineUpdatedAt
    ? `已同步后台 · ${new Date(guideState.onlineUpdatedAt).toTimeString().slice(0, 5)}`
    : guideState.dashboard ? '已同步后台接单状态' : '正在同步后台接单状态';
  return { onlineStatus, currentStatus, isOnline, statusText, updatedText };
}

function guideSelectedServiceTypes() {
  if (Array.isArray(guideState.serviceTypes) && guideState.serviceTypes.length) return guideState.serviceTypes;
  const remoteTypes = guideState.dashboard?.guide?.serviceTypes;
  return Array.isArray(remoteTypes) && remoteTypes.length ? remoteTypes : ['陪伴就医', '生活陪伴', '接送出行'];
}

function guideServiceAreaSummary() {
  const areas = Array.isArray(guideState.serviceAreas) ? guideState.serviceAreas.filter(Boolean) : [];
  const radius = guideState.serviceAreaRadius || '3km';
  if (!areas.length) return `未选择片区 · ${radius}`;
  const areaText = areas.length === 1 ? areas[0] : `${areas[0]}等${areas.length}个`;
  return `${areaText} · ${radius}`;
}

function guideReminderSummary() {
  const methods = Object.entries(GUIDE_REMINDER_METHOD_LABELS)
    .filter(([key]) => guideState.reminderMethods[key])
    .map(([, label]) => label);
  if (!methods.length) return '<span class="red">未开启</span>';
  return `${methods.join(' · ')} <span class="blue">已开启</span>`;
}

function guideOnlineSettingRows(rows) {
  return `
    <div class="detail-rows guide-online-settings">
      ${rows.map(([label, value, open]) => `
        <button class="detail-row guide-online-setting-row" type="button" data-open="${open}" aria-label="设置${label}">
          <div class="label">${label}</div>
          <div class="value">${value}</div>
          ${icon('chevronRight')}
        </button>
      `).join('')}
    </div>
  `;
}

async function toggleGuideOnlineStatus(button) {
  const current = guideOnlineState();
  const nextOnlineStatus = current.isOnline ? '离线' : '在线';
  button.disabled = true;
  button.classList.add('is-busy');
  writeActionStatus(button, `正在${nextOnlineStatus === '在线' ? '上线接单' : '下线休息'}...`);
  try {
    await ensureGuideToken();
    const guideId = guideState.dashboard?.guide?.id || 'guide-001';
    const guide = await guideApiRequest('/api/guide/online', {
      method: 'POST',
      body: { guideId, onlineStatus: nextOnlineStatus }
    });
    applyGuideOnlineSnapshot(guide, { markUpdated: true });
    guideApiHydrateState.signature = '';
    guideApiHydrateState.lastDashboardAt = 0;
    renderScreen('08', false, { replace: true, skipApiHydrate: true });
    const updated = guideOnlineState();
    const target = document.querySelector('.guide-online-state') || document.getElementById('phone');
    writeActionStatus(target, `接单状态已调整：${updated.statusText}，后台同步为 ${updated.onlineStatus}/${updated.currentStatus}`);
    showToast(updated.isOnline ? '已上线接单，后台可派单' : '已下线休息，后台暂停派新单');
  } catch (error) {
    button.disabled = false;
    button.classList.remove('is-busy');
    const message = guideFriendlyStatusMessage(error.message, '请稍后重试');
    writeActionStatus(button, `接单状态调整失败：${message}`);
    showToast(`接单状态调整失败：${message}`);
  }
}

function guideAcceptErrorText(error) {
  const message = String(error?.message || '').trim();
  if (/No pending guide order found|No pending order found|Task not found/i.test(message)) {
    return '暂无可接的后台推荐订单，请刷新后再试';
  }
  return guideFriendlyStatusMessage(message, '接单失败，请稍后重试');
}

async function acceptGuideRecommendedOrder(button) {
  const guideId = guideState.dashboard?.guide?.id || 'guide-001';
  const orderId = button.dataset.guideAcceptOrder || '';
  const taskId = button.dataset.guideAcceptTask || '';
  const scope = button.closest('.guide-home-order, .order-card') || button;
  button.disabled = true;
  button.classList.add('is-busy');
  writeActionStatus(scope, '正在接单并同步后台...');
  try {
    await ensureGuideToken();
    const result = taskId
      ? await guideApiRequest(`/api/tasks/${encodeURIComponent(taskId)}/accept`, { method: 'POST', body: {} })
      : await guideApiRequest('/api/guide/tasks/claim-next', { method: 'POST', body: { guideId, orderId } });
    guideApiHydrateState.signature = '';
    guideApiHydrateState.lastDashboardAt = 0;
    guideState.hall = null;
    guideState.hallSignature = '';
    const [dashboard, statsPayload, income] = await Promise.all([
      guideApiRequest(`/api/guide/dashboard?guideId=${encodeURIComponent(guideId)}`),
      guideApiRequest(`/api/guide/stats?guideId=${encodeURIComponent(guideId)}`),
      guideApiRequest(`/api/guide/income?guideId=${encodeURIComponent(guideId)}`).catch(() => null),
    ]);
    applyGuideDashboardData(dashboard, statsPayload, income);
    setScreen('10');
    const taskNo = result.task?.taskNo || '';
    const orderNo = result.order?.orderNo || orderId;
    const text = `接单成功：${orderNo}${taskNo ? `，任务 ${taskNo}` : ''}`;
    writeActionStatus(document.getElementById('phone'), text);
    showToast('接单成功，已进入待出发订单');
  } catch (error) {
    const text = `接单失败：${guideAcceptErrorText(error)}`;
    button.disabled = false;
    button.classList.remove('is-busy');
    writeActionStatus(scope, text);
    showToast(text);
  }
}

function guideMineProfile() {
  const guide = guideState.mine?.profile || guideState.dashboard?.guide || {};
  return {
    id: guide.id || 'guide-001',
    name: guide.name || guide.realName || guideProfile.name,
    role: guide.role || guideProfile.role,
    area: guide.area || guideProfile.area || '服务区域同步中',
    status: guide.status || '同步中',
    rating: Number(guide.rating || guideStats().rating || 0),
    onlineLabel: guide.onlineLabel || guideOnlineState().statusText,
    serviceTypes: Array.isArray(guide.serviceTypes) && guide.serviceTypes.length ? guide.serviceTypes : guideSelectedServiceTypes(),
  };
}

function guideMineSummary() {
  const stats = guideStats();
  const summary = guideState.mine?.summary || {};
  const rating = Number(summary.rating || guideMineProfile().rating || 0);
  return {
    orderCount: Number(summary.orderCount ?? stats.orderCount ?? 0),
    goodRate: summary.goodRate || (rating ? `${Math.min(100, (rating / 5) * 100).toFixed(1)}%` : '0%'),
    cancelledOrders: Number(summary.cancelledOrders ?? stats.cancelledOrders ?? 0),
    rating,
  };
}

function guideMineMenuRows() {
  if (Array.isArray(guideState.mine?.menuRows) && guideState.mine.menuRows.length) return guideState.mine.menuRows;
  const stats = guideStats();
  const serviceTypes = guideMineProfile().serviceTypes;
  const walletValue = guideMoney(stats.withdrawable || stats.pendingSettlement || stats.revenue || stats.todayIncome || 0);
  const scheduleValue = Number(stats.activeTasks || 0) ? `${Number(stats.activeTasks)} 个进行中` : '暂无排班';
  return [
    { icon: 'eye', title: '接单状态', value: guideOnlineState().statusText, open: '08' },
    { icon: 'id', title: '客户档案', value: Number(stats.reviewCount || 0) ? `${Number(stats.reviewCount)} 条评价记录` : '最近服务客户', open: '13' },
    { icon: 'wallet', title: '我的钱包', value: walletValue, open: '19' },
    { icon: 'calendar', title: '我的排班', value: scheduleValue, open: '36' },
    { icon: 'shield', title: '服务技能', value: `${serviceTypes.length} 项技能`, open: '38' },
    { icon: 'clipboard', title: '服务类型', value: `${serviceTypes.length} 类可接`, open: '25' },
    { icon: 'chart', title: '工作统计', value: `${Number(stats.orderCount || 0)} 单`, open: '39' },
    { icon: 'id', title: '认证申请', value: guideMineProfile().status, open: '16' },
    { icon: 'lock', title: '切换/登录账号', value: '账号安全', open: '15' },
    { icon: 'settings', title: '设置', value: '提醒与隐私', open: '41' },
    { icon: 'help', title: '帮助与反馈', value: '客服支持', open: '42' }
  ];
}

function renderMe() {
  const stats = guideStats();
  const profile = guideMineProfile();
  const summary = guideMineSummary();
  const rating = summary.rating ? `${Number(summary.rating).toFixed(1)}` : '0';
  const goodRate = summary.goodRate || guideGoodRate();
  const mineStatus = guideState.mineError
    ? `<div class="notice red">${icon('alert')} ${escapeHtml(guideState.mineError)}</div>`
    : guideState.mineLoading && !guideState.mine
      ? `<div class="notice">${icon('refresh')} 正在同步我的资料</div>`
      : '';
  const content = `
    <section class="card hero-profile-card">
      <div class="row">
        <div class="profile">
          <img class="avatar photo" src="${escapeHtml(guideAvatarUrl())}" alt="${escapeHtml(profile.name)}">
          <div class="profile-main">
            <div class="guide-mine-profile-title"><strong>${escapeHtml(profile.name)}</strong><span class="orange">★ ${rating}</span>${pill(profile.role)}</div>
            <p><span class="${profile.status === '已认证' ? 'green' : 'orange'}">● ${escapeHtml(profile.status)}</span>　|　服务区域：${escapeHtml(profile.area)}</p>
          </div>
        </div>
      </div>
      <div class="profile-stats">
        <div class="profile-stat"><b>${summary.orderCount}</b><small>接单数</small></div>
        <div class="profile-stat"><b>${goodRate}</b><small>好评率</small></div>
        <div class="profile-stat"><b>${summary.cancelledOrders}</b><small>取消数</small></div>
      </div>
    </section>
    ${mineStatus}
    ${menuRows(guideMineMenuRows())}
    <div style="height:12px;"></div>
    <div class="notice">${icon('shield')} 请保持接单状态，及时响应客户消息</div>
  `;
  return shell('我的', content, { bottom: true, active: 'mine', right: `<button class="icon-btn" type="button" data-open="41">${icon('settings')}</button>` });
}

function renderOnline() {
  const stats = guideStats();
  const online = guideOnlineState();
  const serviceTypes = guideSelectedServiceTypes();
  const area = guideServiceAreaSummary();
  const buttonAction = online.isOnline ? '下线休息' : '上线接单';
  const buttonHint = online.isOnline ? '下线后将无法接收新订单' : '上线后后台可以继续派发新订单';
  const statusTone = online.isOnline ? 'green' : 'red';
  const content = `
    <section class="card section guide-online-state">
      <div class="row">
        <div>
          <h2 class="section-title" style="margin-bottom:4px;">接单状态</h2>
          <p class="muted" style="margin:0;">当前状态：<span class="${statusTone}" data-guide-online-label>${online.statusText}</span></p>
          <p class="muted guide-online-sync" data-guide-online-sync>${online.updatedText}</p>
        </div>
        <button class="guide-online-switch" type="button" data-action="${buttonAction}" data-guide-online-toggle="true" data-local-action="true" aria-pressed="${online.isOnline ? 'true' : 'false'}" aria-label="${buttonAction}">
          <span class="switch ${online.isOnline ? 'on' : ''}"></span>
        </button>
      </div>
      ${guideOnlineSettingRows([
        ['服务区域', `${escapeHtml(area)} <span class="blue">设置</span>`, '24'],
        ['服务类型', `当前 ${serviceTypes.length} 项 <span class="blue">设置</span>`, '25'],
        ['接单提醒', guideReminderSummary(), '26']
      ])}
    </section>
    <section class="card section guide-online-data">
      <h2 class="section-title">今日接单数据 <small>更新于 10:30</small></h2>
      <div class="profile-stats">
        <div class="profile-stat"><b>${guideStatNumber('orderCount')}</b><small>接单数</small></div>
        <div class="profile-stat"><b>${guideStatNumber('activeTasks', 'activeOrders')}</b><small>服务中</small></div>
        <div class="profile-stat"><b>${guideStatNumber('completedOrders')}</b><small>已完成</small></div>
        <div class="profile-stat"><b>${guideGoodRate()}</b><small>好评率</small></div>
      </div>
    </section>
    <section class="guide-online-action-card ${online.isOnline ? 'is-online' : 'is-offline'}">
      <button type="button" data-action="${buttonAction}" data-guide-online-toggle="true" data-local-action="true">${buttonAction}</button>
      <small>${buttonHint}</small>
    </section>
  `;
  return shell('上线接单', content, { bottom: true, active: 'serving', right: `<span class="${statusTone}">${online.onlineStatus}</span>` });
}

function renderFilter() {
  const typeOptions = ['全部', '陪伴就医', '生活陪伴', '日常护理', '生活陪同', '接送出行', '医疗代办'];
  const distanceOptions = ['1km内', '3km内', '5km内', '不限'];
  const timeOptions = ['今天', '明天', '本周', '自定义'];
  const sortOptions = ['距离优先', '时间优先', '收入优先', '评分要求'];
  const filter = guideState.orderFilter;
  const matchingCount = filter.type === '全部' ? orders.length : orders.filter(order => order.tag === filter.type).length;
  const content = `
    <section class="card section guide-ref-filter">
      <h2 class="section-title">订单类型</h2>
      <div class="segmented" data-guide-filter-group="type" data-active-filter="${escapeHtml(filter.type)}" style="flex-wrap:wrap;">
        ${typeOptions.map(item => `<button type="button" data-action="筛选类型：${item}" class="segment ${item === filter.type ? 'active' : ''}" aria-pressed="${item === filter.type ? 'true' : 'false'}">${item}</button>`).join('')}
      </div>
    </section>
    <section class="card section guide-ref-filter">
      <h2 class="section-title">距离范围</h2>
      <div class="segmented" data-guide-filter-group="distance" data-active-filter="${escapeHtml(filter.distance)}">
        ${distanceOptions.map(item => `<button type="button" data-action="距离范围：${item}" class="segment ${item === filter.distance ? 'active' : ''}" aria-pressed="${item === filter.distance ? 'true' : 'false'}">${item}</button>`).join('')}
      </div>
    </section>
    <section class="card section guide-ref-filter">
      <h2 class="section-title">服务时间</h2>
      <div class="segmented" data-guide-filter-group="time" data-active-filter="${escapeHtml(filter.time)}">
        ${timeOptions.map(item => `<button type="button" data-action="服务时间：${item}" class="segment ${item === filter.time ? 'active' : ''}" aria-pressed="${item === filter.time ? 'true' : 'false'}">${item}</button>`).join('')}
      </div>
      ${detailRows([
        ['开始时间', '05-20 09:00'],
        ['结束时间', '05-20 18:00']
      ])}
    </section>
    <section class="card section guide-ref-filter">
      <h2 class="section-title">预计收入</h2>
      <div class="guide-income-range"><span>¥0</span><i><b></b></i><span>¥300</span></div>
    </section>
    <section class="card section guide-ref-filter">
      <h2 class="section-title">排序方式</h2>
      ${sortOptions.map((item, i) => `<button class="guide-radio-row ${item === filter.sort ? 'active' : ''}" type="button" data-action="排序方式：${item}" aria-pressed="${item === filter.sort ? 'true' : 'false'}"><i class="${item === filter.sort ? 'active' : ''}"></i><span>${item}</span><small>${i === 0 ? '优先展示距离更近的订单' : i === 1 ? '优先展示开始时间更近的订单' : i === 2 ? '优先展示收入更高的订单' : '优先展示客户要求更匹配的订单'}</small></button>`).join('')}
    </section>
    <section class="card section guide-ref-filter" data-guide-filter-summary data-filter-seq="${filter.seq}">
      <h2 class="section-title">当前筛选结果</h2>
      <p class="muted">${filter.type} · ${filter.distance} · ${filter.time} · ${filter.sort}</p>
      <strong>匹配 ${matchingCount} 个订单</strong>
    </section>
    <div class="floating-footer"><button class="secondary-btn" type="button" data-action="清空筛选条件">清空条件</button><button class="primary-btn" type="button" data-open="01">查看 ${matchingCount} 个订单</button></div>
  `;
  return shell('接单筛选', content);
}

function renderAccepted() {
  const content = `
    <section class="card section guide-accepted-profile">
      <span class="guide-accepted-tag">陪伴就医</span>
      <p class="guide-accepted-order-no">订单编号：DD202405200901</p>
      <div class="guide-accepted-person">
        <img class="guide-accepted-avatar" src="./assets/review-customer-li.jpg" alt="李奶奶" />
        <div class="profile-main">
          <strong>李奶奶</strong>${pill('72岁', 'gray')}
          <p>${icon('person')} 女　|　72岁　|　疼痛老人用户</p>
          <p>${pill('健康状况', '')}${pill('良好', 'green')}</p>
        </div>
        <button class="call-circle" type="button" data-open="33" aria-label="联系客户">${icon('phone')}</button>
      </div>
    </section>
    <section class="card section guide-accepted-progress">
      <div class="guide-step-line">
        ${['已接单', '待出发', '服务中', '待确认', '已完成'].map((item, i) => `<span class="${i < 2 ? 'done' : ''} ${i === 1 ? 'active' : ''}"><i>${i < 1 ? '✓' : i + 1}</i><small>${item}</small><em>${['05-20 08:42', '准备出发', '进行中', '服务完成', '服务结束'][i]}</em></span>`).join('')}
      </div>
      <p class="guide-accepted-countdown">${icon('clock')} 距离服务开始 <b>00:48:32</b></p>
      <div class="guide-accepted-detail-list">
        ${[
          ['calendar', '服务时间', '今天 09:30-11:30'],
          ['mapPin', '服务地点', '弥勒市人民医院'],
          ['clipboard', '服务内容', '全程陪同就医 / 挂号检查取药'],
          ['alert', '注意事项', '行动较慢，需要轮椅协助']
        ].map(([rowIcon, label, value]) => `<button type="button" data-open="02">${icon(rowIcon)}<span>${label}</span><strong>${value}</strong>${icon('chevronRight')}</button>`).join('')}
      </div>
      ${mapBox('弥勒市人民医院')}
    </section>
    <div class="guide-action-row guide-accepted-actions"><button type="button" data-open="33">${icon('phone')} 联系客户</button><button type="button" data-open="27">${icon('navigation')} 路线导航</button><button type="button" data-open="28">${icon('alert')} 申请取消</button></div>
    <div class="floating-footer single"><button class="primary-btn" type="button" data-open="04">到达后开始服务</button></div>
  `;
  return shell('订单详情', content, { right: '<span class="green">已接单</span>', bottom: true, active: 'serving' });
}

function renderConfirmDetail() {
  const content = `
    <section class="card section guide-confirm-order">
      <span class="pill orange">陪伴就医</span>
      <div class="guide-confirm-profile">
        <img src="./assets/review-customer-li.jpg" alt="李奶奶">
        <div>
          <h2>李奶奶　就医陪伴</h2>
          <p>${icon('info')} 已提交完成，等待客户确认</p>
        </div>
        <button class="call-circle" type="button" data-open="33" aria-label="联系客户">${icon('phone')}</button>
      </div>
      <div class="guide-confirm-metrics">
        <span>${icon('calendar')}<b>服务时间</b><small>05-20 09:30-12:00</small></span>
        <span>${icon('mapPin')}<b>服务地点</b><small>弥勒市人民医院</small></span>
        <span>${icon('clock')}<b>实际时长</b><small>2.5 小时</small></span>
        <span>${icon('yuan')}<b>预计收入</b><small class="red">¥120.00</small></span>
      </div>
    </section>
    <section class="card section guide-ref-progress guide-confirm-progress">
      <h2 class="section-title">服务进度</h2>
      <div class="guide-step-line">
        ${[
          ['已接单', '05-20 08:42'],
          ['服务中', '05-20 09:30'],
          ['已提交', '05-20 12:00'],
          ['待客户确认', '进行中'],
          ['已完成', '待确认后']
        ].map(([item, meta], i) => `<span class="${i < 3 ? 'done' : ''} ${i === 3 ? 'active' : ''}"><i>${i < 3 ? '✓' : i + 1}</i><small>${item}</small><em>${meta}</em></span>`).join('')}
      </div>
      <p class="guide-confirm-tip">${icon('info')} 客户确认后，订单将进入结算流程</p>
    </section>
    <section class="card section guide-confirm-proof">
      <h2 class="section-title">完成凭证</h2>
      <button class="guide-proof-row" type="button" data-open="29">
        <img src="./assets/review-photo-entrance.jpg" alt="佳境假惠旅院" />
        <div><b>服务已完成</b><small>05-20 12:00　提交</small><small>客户已顺利完成就医流程，安全送回家中。</small></div>
        ${icon('chevronRight')}
      </button>
    </section>
    <section class="card section guide-confirm-help">
      <h2 class="section-title">联系与帮助</h2>
      <div class="guide-confirm-actions">
        <button class="secondary-btn" type="button" data-open="33">${icon('phone')} 联系客户</button>
        <button class="secondary-btn" type="button" data-open="34">${icon('headset')} 联系客服</button>
        <button class="primary-btn" type="button" data-open="18">${icon('yuan')} 查看结算预估</button>
      </div>
      <p>${icon('clock')} 超过 24 小时未确认，平台将自动介入处理</p>
    </section>
  `;
  return shell('订单详情', content, { right: '<span class="blue">待确认</span>', bottom: true, active: 'serving' });
}

function renderCancelledDetail() {
  const result = guideState.cancelResult || {};
  const orderNo = result.orderNo || 'DD202405180032';
  const customer = result.customer || '李奶奶';
  const service = result.service || '陪伴就医';
  const time = result.time || '2026-06-16 09:30';
  const reason = result.reason || '客户临时改期';
  const note = result.description || '客户临时有事取消，平台已确认。';
  const phone = result.phone || '13800005678';
  const content = `
    <section class="card section guide-ref-order">
      <div class="guide-accepted-person">
        <img class="guide-accepted-avatar" src="./assets/review-customer-li.jpg" alt="${escapeHtml(customer)}" />
        <div class="profile-main">
          <strong>${escapeHtml(customer)}</strong>${pill('长期旅居用户', 'gray')}
          <p>${pill(service, 'green')}</p>
        </div>
        <a class="call-circle" ${guideDialAttrs(phone)} aria-label="拨打${escapeHtml(customer)}电话">${icon('phone')}</a>
      </div>
      ${detailRows([
        ['订单编号', orderNo],
        ['服务时间', time],
        ['取消原因', reason]
      ])}
    </section>
    <section class="card section guide-ref-progress">
      <h2 class="section-title">取消信息</h2>
      <div class="guide-cancel-reason">
        <span>${icon('close')}</span>
        <div><b>${result.taskNo ? `任务 ${escapeHtml(result.taskNo)} 已取消` : '订单已取消'}</b><small>${escapeHtml(note)}</small></div>
      </div>
      <div class="guide-step-line">
        ${['待接单', '已接单', '已取消', '已关闭'].map((item, i) => `<span class="${i < 3 ? 'done' : ''} ${i === 2 ? 'active red' : ''}"><i>${i < 3 ? '✓' : i + 1}</i><small>${item}</small></span>`).join('')}
      </div>
    </section>
    <section class="card section">
      <h2 class="section-title">推荐相似订单 <small>换一批</small></h2>
      ${orderCard(orders[0], { action: '去查看', open: '02' })}
      ${orderCard(orders[1], { action: '去查看', open: '02' })}
    </section>
  `;
  return shell('订单详情', content, { right: '<span class="red">已取消</span>' });
}

function renderCustomerFile() {
  const content = `
    <section class="card section guide-ref-order">
      <div class="row">
        ${profileBlock({ tags: [pill('长期旅居'), pill('健康良好', 'green')] })}
        <button class="call-circle" type="button" data-action="联系客户">${icon('phone')}</button>
      </div>
    </section>
    <section class="card section guide-customer-basic">
      <h2 class="section-title">基础信息</h2>
      <div class="guide-info-grid">
        <span><b>性别</b><small>女</small></span>
        <span><b>现住地</b><small>弥勒市康养社区</small></span>
        <span><b>年龄</b><small>72岁</small></span>
        <span><b>健康状态</b><small>普通</small></span>
      </div>
    </section>
    <section class="card section guide-customer-health">
      <h2 class="section-title">健康档案</h2>
      <div class="guide-tag-grid">
        ${['高血压', '膝关节不适', '听力下降', '行动慢', '需搀扶', '需复诊'].map((item, i) => `<span class="${i < 3 ? 'orange' : i < 5 ? 'blue' : 'red'}">${item}</span>`).join('')}
      </div>
    </section>
    <section class="card section">
      <h2 class="section-title">紧急联系人</h2>
      ${[
        ['王女士　女儿　138****8899', '13888898899'],
        ['王先生　儿子　139****6892', '13988896892']
      ].map(([item, phone]) => `<div class="menu-row"><div class="menu-left"><span class="soft-icon green">${icon('user')}</span><div><strong>${item}</strong></div></div><a class="secondary-btn" ${guideDialAttrs(phone, item)} aria-label="拨打${item}">${icon('phone')} 拨打</a></div>`).join('')}
    </section>
    <section class="card section">
      <h2 class="section-title">服务偏好</h2>
      ${detailRows([
        ['常用地点', '弥勒市人民医院'],
        ['沟通习惯', '语速慢，需耐心重复确认'],
        ['行动能力', '上下车需要搀扶']
      ])}
    </section>
    <div class="floating-footer"><button class="secondary-btn" type="button" data-action="联系客户">${icon('phone')} 联系客户</button><button class="primary-btn" type="button" data-open="04">${icon('navigation')} 开始导航</button></div>
  `;
  return shell('客户档案', content);
}

function guideHomePayloadToOrder(item = {}, index = 0) {
  return {
    no: item.orderNo || item.orderId || item.taskNo || '',
    orderId: item.orderId || '',
    taskId: item.taskId || '',
    orderStatus: item.orderStatus || '',
    tag: item.serviceType || '向导服务',
    status: item.taskStatus || item.orderStatus || '待接单',
    color: /护理/.test(item.serviceType || '') ? 'purple' : /生活/.test(item.serviceType || '') ? 'green' : /就医/.test(item.serviceType || '') ? 'orange' : '',
    customer: item.elderName || '旅居用户',
    service: item.serviceType || '向导服务',
    time: item.time || '时间待确认',
    place: item.location || '地点待确认',
    content: item.note || '用户需求已进入后台任务池',
    duration: item.duration || '2 小时',
    price: String(item.amount || 0),
    distance: item.distance || `${Number(1.2 + index * 0.8).toFixed(1)}km`,
    remaining: item.taskStatus === '服务中' ? '进行中' : item.taskStatus || '待处理',
  };
}

function guideHomeServingOrders() {
  const apiServices = Array.isArray(guideState.home?.currentServices)
    ? guideState.home.currentServices.map(guideHomePayloadToOrder)
    : [];
  if (apiServices.length) return apiServices;
  return orders.filter(order => ['已接单', '服务中', '待确认'].includes(order.status || order.orderStatus));
}

function guideHomeNotice() {
  const notice = guideState.home?.notice;
  if (notice?.title || notice?.content) {
    return {
      id: notice.id || 'guide-home-notice',
      title: notice.title || '平台公告',
      content: notice.content || '请查看系统通知',
      time: String(notice.time || '').slice(5, 16) || '刚刚',
      route: notice.route || '31',
    };
  }
  if (!guideState.dashboard) {
    return {
      id: 'guide-home-notice-loading',
      title: '平台公告',
      content: '正在同步平台公告',
      time: '同步中',
      route: '31',
    };
  }
  return {
    id: 'guide-home-notice-empty',
    title: '平台公告',
    content: '暂无新的平台通知，请保持在线接单状态。',
    time: '刚刚',
    route: '31',
  };
}

function guideHomeWorkSummary(stats = guideStats()) {
  const serviceHours = Number(stats.serviceHours || stats.todayServiceHours || stats.workHours || 0);
  if (Number.isFinite(serviceHours) && serviceHours > 0) return `服务时长 ${serviceHours.toFixed(serviceHours % 1 ? 1 : 0)} 小时`;
  const active = guideStatNumber('activeTasks', 'activeOrders');
  return active ? `服务中 ${active} 单` : '当前暂无服务中订单';
}

function renderHome() {
  const quicks = [
    ['接单大厅', '海量订单', 'clipboard', 'blue', '01'],
    ['我的订单', '订单管理', 'list', 'green', '03'],
    ['服务日程', '日程安排', 'mapPin', 'purple', '36'],
    ['评价管理', '服务评价', 'star', 'orange', '22'],
    ['异常上报', '问题反馈', 'alert', 'red', '05']
  ];
  const common = [
    ['联系客户', 'phone', 'green', '33'],
    ['路线导航', 'navigation', 'blue', '27'],
    ['安全中心', 'shield', 'orange', '35'],
    ['服务规范', 'book', 'purple', '43'],
    ['帮助中心', 'headset', 'blue', '42']
  ];
  const recommendOrders = guideRecommendedOrderPool();
  const servingOrders = guideHomeServingOrders();
  const online = guideOnlineState();
  const homeNotice = guideHomeNotice();
  const categoryCounts = recommendOrders.reduce((counts, order) => {
    counts[order.tag] = (counts[order.tag] || 0) + 1;
    return counts;
  }, {});
  const categoryOrder = ['陪伴就医', '生活陪伴', '导游游览', '护工护理'];
  const homeCategories = [
    ['全部', recommendOrders.length],
    ...categoryOrder
      .filter((name) => categoryCounts[name])
      .map((name) => [name, categoryCounts[name]])
  ];
  if (guideState.homeCategory !== '全部' && !categoryCounts[guideState.homeCategory]) {
    guideState.homeCategory = '全部';
  }
  const activeHomeCategory = guideState.homeCategory || '全部';
  const categoryRecommendOrders = activeHomeCategory === '全部'
    ? recommendOrders
    : recommendOrders.filter(order => order.tag === activeHomeCategory);
  const filteredRecommendOrders = rotateGuideRecommendedOrders(categoryRecommendOrders);
  const stats = guideStats();
  const content = `
    <div class="guide-home">
    <section class="section" style="padding-top:4px;">
      <div class="row">
        <div class="profile">
          <img class="avatar photo" src="${escapeHtml(guideAvatarUrl())}" alt="${guideProfile.name}">
          <div class="profile-main">
            <strong style="font-size:18px;">您好，${guideProfile.name}</strong>${pill(guideProfile.role)}
            <p><span class="${online.isOnline ? 'green' : 'red'}">● ${online.statusText}</span>　|　${guideHomeWorkSummary(stats)}</p>
          </div>
        </div>
        <div class="guide-home-actions">
          <button class="guide-home-action" type="button" data-open="06"><span>${icon('bell')}${guideMessageBadgeHtml()}</span><small>消息</small></button>
          <button class="guide-home-action" type="button" data-open="45" data-guide-scan-open="true"><span>${icon('scan')}</span><small>扫一扫</small></button>
        </div>
      </div>
    </section>
    <section class="metric-card">
      <div class="metric-head">
        <strong>今日工作概览 <small>截至 05-20 10:30</small></strong>
        <button class="primary-btn" style="min-height:32px;padding:0 12px;background:rgba(255,255,255,.18);" data-open="18">查看数据详情 ${icon('chevronRight')}</button>
      </div>
      <div class="metrics">
        <div class="metric">${icon('clipboard')}<b>${guideStatNumber('orderCount')}</b><small>接单数</small></div>
        <div class="metric">${icon('person')}<b>${guideStatNumber('activeTasks', 'activeOrders')}</b><small>服务中</small></div>
        <div class="metric">${icon('list')}<b>${guideStatNumber('completedOrders')}</b><small>已完成</small></div>
        <div class="metric">${icon('yuan')}<b>${guideMoney(stats.todayIncome)}</b><small>今日收入</small></div>
      </div>
    </section>
    <section class="card section guide-home-quick">
      <div class="quick-grid">${quicks.map(([a,b,c,d,e]) => `<button class="quick-item" data-open="${e}"><span class="quick-icon ${d}">${icon(c)}</span><strong>${a}</strong><small>${b}</small></button>`).join('')}</div>
    </section>
    <section class="card section guide-home-serving">
      <h2 class="section-title">当前服务中 <button class="guide-section-more" type="button" data-open="04">服务中 ${servingOrders.length} 单 ${icon('chevronRight')}</button></h2>
      ${servingOrders.length ? servingOrders.map((order) => `
        <div class="guide-current-service">
          <img class="avatar photo" src="./assets/review-customer-li.jpg" alt="${order.customer}">
          <div class="profile-main">
            <strong>${order.customer}　${order.service} <span>${order.tag}</span></strong>
            <p>${icon('mapPin')} ${order.place}</p>
            <p>${icon('clock')} ${order.time} <em>|</em> 状态 <b>${order.remaining || order.status}</b></p>
          </div>
          <button class="guide-service-action" type="button" data-open="04"><span>${icon('navigation')}</span><small>去服务</small></button>
        </div>
      `).join('') : `<section class="guide-home-empty" data-guide-home-serving-state="${guideState.dashboard ? 'empty' : 'loading'}"><span class="guide-home-empty-icon">${icon('clipboard')}</span><div><strong>${guideState.dashboard ? '暂无服务中订单' : '正在同步服务中订单'}</strong><span>${guideState.dashboard ? '后台派单并接单后会在这里展示当前服务。' : '请稍候，正在从后台同步任务。'}</span></div><button class="secondary-btn" type="button" data-open="01">去接单大厅</button></section>`}
    </section>
    <section class="card section guide-home-common">
      <h2 class="section-title">常用功能</h2>
      <div class="quick-grid">${common.map(([a,c,d,e]) => `<button class="quick-item" data-open="${e}"><span class="quick-icon ${d}">${icon(c)}</span><strong>${a}</strong></button>`).join('')}</div>
    </section>
    <button class="notice orange guide-home-notice" type="button" data-open="${escapeHtml(homeNotice.route)}" data-guide-home-notice="${escapeHtml(homeNotice.id)}">${icon('volume')} <b>${escapeHtml(homeNotice.title)}</b><span class="muted">${escapeHtml(homeNotice.content)}</span><time>${escapeHtml(homeNotice.time)}</time>${icon('chevronRight')}</button>
    <section class="card section guide-home-recommend" style="margin-top:12px;">
      <h2 class="section-title">推荐订单 <button class="guide-section-more" type="button" data-action="换一批推荐订单" data-local-action="true" data-guide-home-refresh="true">换一批 ${icon('refresh')}</button></h2>
      <div class="segmented guide-home-category-tabs">
        ${homeCategories.map(([name, count]) => `<button class="segment ${activeHomeCategory === name ? 'active' : ''}" type="button" data-guide-home-category="${name}" aria-pressed="${activeHomeCategory === name ? 'true' : 'false'}">${name}<span>${count}</span></button>`).join('')}
      </div>
      <div style="height:10px;"></div>
      ${filteredRecommendOrders.map(guideHomeOrderCard).join('') || guideHomeRecommendEmptyHtml(activeHomeCategory)}
    </section>
    </div>
  `;
  return shell('首页', content, { noTop: true, bottom: true, active: 'home' });
}

function guideHomeRecommendEmptyHtml(activeHomeCategory = '全部') {
  const label = activeHomeCategory === '全部' ? '推荐订单' : `${activeHomeCategory}推荐订单`;
  if (!guideState.dashboard) {
    return `
      <section class="guide-home-empty" data-guide-recommend-empty-state="loading">
        <span class="guide-home-empty-icon">${icon('refresh')}</span>
        <div>
          <strong>正在同步后台推荐订单</strong>
          <span>首页只展示可接单的后台订单，请稍候。</span>
        </div>
      </section>
    `;
  }
  return `
    <section class="guide-home-empty" data-guide-recommend-empty-state="empty">
      <span class="guide-home-empty-icon">${icon('clipboard')}</span>
      <div>
        <strong>当前暂无${label}</strong>
        <span>这是正常数据状态：当前后台没有可推荐给您的待接订单，稍后刷新或进入接单大厅查看全部分类。</span>
      </div>
      <button class="secondary-btn" type="button" data-open="01">去接单大厅</button>
    </section>
  `;
}

function guideRecommendedOrderPool() {
  if (Array.isArray(guideState.home?.recommendedOrders)) {
    return guideState.home.recommendedOrders.map(guideHomePayloadToOrder);
  }
  return orders
    .filter(order => /^(待接单|待派单|已派单)$/.test(order.status || ''));
}

function rotateGuideRecommendedOrders(orderList) {
  if (!orderList.length) return [];
  const offset = guideState.homeRecommendOffset % orderList.length;
  const rotated = [...orderList.slice(offset), ...orderList.slice(0, offset)];
  return rotated.slice(0, Math.min(4, rotated.length));
}

async function refreshGuideHomeRecommendations(button) {
  button.disabled = true;
  button.classList.add('is-busy');
  try {
    await hydrateGuideHomeFromApi({ force: true });
  } catch (error) {
    writeActionStatus(button, `首页数据刷新失败：${guideFriendlyStatusMessage(error.message, '请稍后重试')}`);
  } finally {
    button.disabled = false;
    button.classList.remove('is-busy');
  }
  const pool = guideRecommendedOrderPool();
  const activeCategory = guideState.homeCategory || '全部';
  const scopedPool = activeCategory === '全部'
    ? pool
    : pool.filter(order => order.tag === activeCategory);
  const scrollTop = document.querySelector('#phone .screen-scroll')?.scrollTop || 0;
  guideState.homeRecommendOffset = scopedPool.length > 1
    ? (guideState.homeRecommendOffset + 1) % scopedPool.length
    : guideState.homeRecommendOffset;
  renderScreen('14', false, { replace: true, skipApiHydrate: true, restoreScrollTop: scrollTop });
  const target = document.querySelector('.guide-home-recommend') || button;
  const categoryText = activeCategory === '全部' ? '' : `${activeCategory}`;
  const text = scopedPool.length > 1
    ? `已刷新${categoryText}推荐订单，当前展示 ${Math.min(4, scopedPool.length)} 单`
    : scopedPool.length === 1
      ? `当前仅 1 单${categoryText}推荐订单，暂无更多可换`
      : `当前暂无${categoryText || '推荐'}订单，这是正常数据状态，可稍后刷新或进入接单大厅`;
  writeActionStatus(target, text);
  showToast(scopedPool.length > 1 ? '推荐订单已换一批' : '当前暂无可推荐订单');
}

async function refreshGuideHallOrders(button) {
  button.disabled = true;
  button.classList.add('is-busy');
  try {
    await hydrateGuideHallFromApi({ force: true });
    const scrollTop = document.querySelector('#phone .screen-scroll')?.scrollTop || 0;
    renderScreen('01', false, { replace: true, skipApiHydrate: true, restoreScrollTop: scrollTop });
    const total = guideHallOrderPool().length;
    const target = document.querySelector('.guide-hall-summary') || button;
    const text = total ? `接单大厅已刷新，共 ${total} 单` : '接单大厅已刷新，暂无可接订单';
    writeActionStatus(target, text);
    showToast(total ? '接单大厅已刷新' : '暂无可接订单');
  } catch (error) {
    const message = guideFriendlyStatusMessage(error.message, '请稍后重试');
    writeActionStatus(button, `接单大厅刷新失败：${message}`);
    showToast(`刷新失败：${message}`);
  } finally {
    button.disabled = false;
    button.classList.remove('is-busy');
  }
}

async function refreshGuideActiveService(button) {
  button.disabled = true;
  button.classList.add('is-busy');
  try {
    await hydrateGuideActiveServiceFromApi({ force: true });
    const screenId = screens[currentIndex]?.id || '04';
    const scrollTop = document.querySelector('#phone .screen-scroll')?.scrollTop || 0;
    renderScreen(screenId, false, { replace: true, skipApiHydrate: true, restoreScrollTop: scrollTop });
    const service = guideActiveServiceOrder();
    const text = service ? `服务中订单已刷新：${service.orderNo || service.taskNo || service.serviceType}` : '服务中订单已刷新，当前暂无服务中任务';
    writeActionStatus(document.querySelector('.guide-service-card, .guide-hall-empty') || button, text);
    showToast(service ? '服务中订单已刷新' : '暂无服务中任务');
  } catch (error) {
    const message = guideFriendlyStatusMessage(error.message, '请稍后重试');
    writeActionStatus(button, `服务中订单刷新失败：${message}`);
    showToast(`刷新失败：${message}`);
  } finally {
    button.disabled = false;
    button.classList.remove('is-busy');
  }
}

async function completeGuideActiveService(button) {
  const service = guideActiveServiceOrder();
  if (!service?.taskId) {
    writeActionStatus(button, '暂无可提交完成的服务中任务');
    showToast('暂无可完成任务');
    return false;
  }
  const remark = String(document.querySelector('[data-guide-complete-remark]')?.value || service.note || '').trim();
  button.disabled = true;
  button.classList.add('is-busy');
  writeActionStatus(document.querySelector('.guide-complete-card, #phone') || button, '正在提交服务完成记录...');
  try {
    await ensureGuideToken();
    const result = await guideApiRequest(`/api/tasks/${encodeURIComponent(service.taskId)}/complete`, {
      method: 'POST',
      body: {
        guideId: guideState.dashboard?.guide?.id || 'guide-001',
        orderId: service.orderId,
        evidence: remark || '向导端提交服务完成',
      },
    });
    guideApiHydrateState.signature = '';
    guideApiHydrateState.lastDashboardAt = 0;
    guideState.activeService = null;
    guideState.activeServiceSignature = '';
    const [dashboard, statsPayload, income] = await Promise.all([
      guideApiRequest('/api/guide/dashboard?guideId=guide-001'),
      guideApiRequest('/api/guide/stats?guideId=guide-001'),
      guideApiRequest('/api/guide/income?guideId=guide-001').catch(() => null),
    ]);
    applyGuideDashboardData(dashboard, statsPayload, income);
    setScreen('11');
    const orderNo = result.order?.orderNo || service.orderNo || service.orderId;
    writeActionStatus(document.getElementById('phone'), `服务完成已提交：${orderNo}，等待客户确认`);
    showToast('服务完成已提交');
    return true;
  } catch (error) {
    const message = guideFriendlyStatusMessage(error.message, '请稍后重试');
    writeActionStatus(button, `服务完成提交失败：${message}`);
    showToast(`提交失败：${message}`);
    button.disabled = false;
    button.classList.remove('is-busy');
    return false;
  }
}

function guideHomeOrderCard(order) {
  const acceptId = order.orderId || order.no || '';
  return `
    <article class="guide-home-order" data-open="02">
      <div class="guide-home-order-main">
        ${pill(order.tag, order.color)}
        <h3>${escapeHtml(order.customer)}　${escapeHtml(order.service)}</h3>
        <p>${icon('mapPin')} ${escapeHtml(order.place)}</p>
        <p>${icon('calendar')} ${escapeHtml(order.time)}</p>
        <strong>距离 ${escapeHtml(order.distance)}</strong>
      </div>
      <div class="guide-home-order-side">
        <b><span>¥</span>${escapeHtml(order.price)}</b>
        <small>预计 ${escapeHtml(order.duration)}</small>
        <button class="primary-btn" type="button" data-guide-accept-order="${escapeHtml(acceptId)}" data-guide-accept-task="${escapeHtml(order.taskId || '')}">立即接单</button>
      </div>
    </article>
  `;
}

function renderLogin() {
  const content = `
    <div class="login-screen">
      <div class="login-hero">
        <div class="app-logo">
          <div class="mini-robot"><span></span></div>
          <div style="text-align:left;"><strong style="font-size:22px;">云旅无忧</strong><br><span class="blue">向导端</span></div>
        </div>
        <h1>向导登录</h1>
        <p>登录后接收附近服务订单</p>
      </div>
      <section class="card login-card">
        <div class="login-tabs"><button class="active">手机号登录</button><button>验证码登录</button></div>
        <div class="form-row"><span class="soft-icon">${icon('phone')}</span><label>手机号</label><input placeholder="请输入手机号" /></div>
        <div class="form-row"><span class="soft-icon">${icon('lock')}</span><label>密码</label><input placeholder="请输入登录密码" /><span class="muted">${icon('eye')}</span></div>
        <p style="text-align:right;"><span class="blue">忘记密码</span></p>
        <button class="primary-btn wide-btn">登录</button>
        <button class="secondary-btn wide-btn" style="margin-top:16px;color:var(--blue);">${icon('message')} 微信快捷登录</button>
      </section>
      <div class="agreement"><span class="radio"></span> 已阅读并同意 <span class="blue">《用户协议》</span> <span class="blue">《隐私政策》</span></div>
      <div class="login-bottom">还没有账号？ <span class="blue" data-open="16">申请成为向导</span></div>
    </div>
  `;
  return shell('登录', content, { noTop: true });
}

function renderApply() {
  const content = `
    <section class="card section guide-apply-hero">
      <div class="app-logo" style="justify-content:flex-start;">
        <div class="mini-robot"><span></span></div>
        <div><strong>欢迎加入云旅无忧向导团队</strong><small>完善资料并提交，平台将在 1 个工作日内审核</small></div>
      </div>
    </section>
    <section class="card section guide-apply-basic">
      <h2 class="section-title">基础信息</h2>
      <button class="guide-apply-avatar" type="button" data-action="上传头像">
        <span>${icon('user')}</span>
        <i>${icon('camera')}</i>
        <small>上传头像</small>
      </button>
      ${detailRows([
        ['姓名', '张晓丽'],
        ['手机号', guideProfile.phone],
        ['身份证号', '5325**********2186'],
        ['服务城市', '弥勒市'],
        ['常住区域', guideProfile.area]
      ])}
    </section>
    <section class="card section">
      <h2 class="section-title">资质材料</h2>
      <div class="guide-doc-grid">
        ${[
          ['身份证正面', 'id', '已上传', true],
          ['身份证反面', 'card', '已上传', true],
          ['健康证明', 'shield', '待上传', false],
          ['无犯罪记录证明', 'alert', '待上传', false],
        ].map(([item, itemIcon, state, done]) => `<button type="button" data-action="上传${item}" class="guide-doc-card ${done ? 'done' : ''}"><span>${icon(itemIcon)}${done ? `<i>${icon('check')}</i>` : `<i>${icon('camera')}</i>`}</span><b>${item}</b><small>${state}</small></button>`).join('')}
      </div>
    </section>
    <section class="card section">
      <h2 class="section-title">服务能力</h2>
      <div class="guide-apply-skills">${['陪伴就医', '导游游览', '生活陪伴'].map((x) => `<button type="button" data-action="选择服务能力：${x}" class="active">${x}<i>${icon('check')}</i></button>`).join('')}</div>
      <button class="guide-capability-row" type="button" data-action="添加更多服务能力">${icon('plus')}<span>添加更多服务类型</span>${icon('chevronRight')}</button>
    </section>
    <div class="floating-footer"><button class="primary-btn" type="button" data-open="17">提交审核</button></div>
  `;
  return shell('申请成为向导', content);
}

function renderAudit() {
  const content = `
    <section class="card section" style="text-align:center;padding:28px 18px;">
      <span class="soft-icon" style="width:70px;height:70px;margin:auto;color:var(--blue);">${icon('shield')}</span>
      <h2>资料审核中</h2>
      <p class="muted">预计 1-3 个工作日内完成审核，请保持电话畅通。</p>
    </section>
    <section class="card section">
      <h2 class="section-title">审核进度</h2>
      <div class="timeline">
        <div class="time-step done"><span class="dot">✓</span><span>资料提交成功</span><b>05-20</b></div>
        <div class="time-step active"><span class="dot">2</span><span>平台资料审核</span><b>进行中</b></div>
        <div class="time-step"><span class="dot">3</span><span>服务培训确认</span><b>待开始</b></div>
        <div class="time-step"><span class="dot">4</span><span>开通接单权限</span><b>待开通</b></div>
      </div>
    </section>
    <section class="card section">
      <h2 class="section-title">已提交资料</h2>
      ${detailRows([
        ['基础身份', '已完善'],
        ['服务类型', '3 项'],
        ['服务区域', '弥勒市全域'],
        ['联系人', '138****8899']
      ])}
    </section>
    <div class="notice orange">${icon('alert')} 审核期间请保持电话畅通，未通过时可按提示补充资料</div>
    <div class="row"><button class="secondary-btn" type="button" data-open="16">修改资料</button><button class="primary-btn" type="button" data-open="42">查看服务规范</button></div>
  `;
  return shell('审核状态', content);
}

function renderTodayData() {
  const stats = guideStats();
  const content = `
    <section class="metric-card guide-today-hero">
      <div class="metric-head"><strong>今日工作概览 <small>05-20 周一</small></strong><span>更新于 10:30</span></div>
      <div class="metrics">
        <div class="metric">${icon('clipboard')}<b>${guideStatNumber('orderCount')}</b><small>接单数</small></div>
        <div class="metric">${icon('person')}<b>${guideStatNumber('activeTasks', 'activeOrders')}</b><small>服务中</small></div>
        <div class="metric">${icon('check')}<b>${guideStatNumber('completedOrders')}</b><small>已完成</small></div>
        <div class="metric">${icon('yuan')}<b>${guideMoney(stats.todayIncome)}</b><small>今日收入</small></div>
      </div>
    </section>
    <section class="card section guide-today-chart">
      <div class="section-title-row"><h2 class="section-title">订单转化</h2><span>接单率 33.3% ${icon('info')}</span></div>
      <div class="guide-conversion-chart">
        <svg viewBox="0 0 330 138" preserveAspectRatio="none" aria-hidden="true">
          <g class="grid"><path d="M22 18H324M22 58H324M22 98H324M22 18V118M22 118H324"/></g>
          <path class="area" d="M78 39 L155 58 L232 90 L306 118 L78 118 Z"/>
          <polyline class="line" points="78,39 155,58 232,90 306,118"/>
          <g class="dots"><circle cx="78" cy="39" r="5"/><circle cx="155" cy="58" r="5"/><circle cx="232" cy="90" r="5"/><circle cx="306" cy="118" r="5"/></g>
        </svg>
        <div class="guide-chart-y"><span>30</span><span>20</span><span>10</span><span>0</span></div>
        <div class="guide-chart-labels"><span>推荐</span><span>查看</span><span>接单</span><span>完成</span></div>
        <div class="guide-chart-values"><span>24</span><span>18</span><span>8</span><span>1</span></div>
      </div>
    </section>
    <section class="card section guide-today-bars">
      <h2 class="section-title">服务类型分布</h2>
      ${[
        ['headset', '', '陪伴就医', '5 单', 72],
        ['message', 'green', '生活陪伴', '1 单', 26],
        ['route', 'purple', '导游游览', '2 单', 46]
      ].map(([rowIcon, color, label, value, width]) => `<div class="guide-today-bar"><span class="soft-icon ${color}">${icon(rowIcon)}</span><b>${label}</b><i><em style="width:${width}%"></em></i><strong>${value}</strong></div>`).join('')}
    </section>
    <section class="card section guide-today-bars">
      <h2 class="section-title">时段分布</h2>
      ${[
        ['clock', '', '09:00-12:00', '3 单', 43],
        ['clock', '', '12:00-18:00', '4 单', 74],
        ['clock', '', '18:00-21:00', '1 单', 25]
      ].map(([rowIcon, color, label, value, width]) => `<div class="guide-today-bar"><span class="soft-icon ${color}">${icon(rowIcon)}</span><b>${label}</b><i><em style="width:${width}%"></em></i><strong>${value}</strong></div>`).join('')}
    </section>
    <section class="card section guide-today-advice"><h2 class="section-title">运营建议</h2><p>${icon('shield')} 保持在线状态，优先响应距离 3km 内订单</p></section>
  `;
  return shell('今日数据详情', content);
}

function renderWallet() {
  const stats = guideStats();
  const content = `
    <section class="guide-wallet-hero">
      <div class="guide-wallet-topline">
        <span>可提现余额 ${icon('info')}</span>
        <span class="guide-wallet-illus" aria-hidden="true">
          <span class="guide-wallet-card card-a"></span>
          <span class="guide-wallet-card card-b"></span>
          <span class="guide-wallet-body"><i>¥</i></span>
          <span class="guide-wallet-dot dot-a"></span>
          <span class="guide-wallet-dot dot-b"></span>
        </span>
      </div>
      <div class="guide-wallet-amount">${guideMoney(stats.withdrawable)}</div>
      <p class="guide-wallet-month">本月接单 ${guideStatNumber('monthlyOrders', 'monthOrders')} 单</p>
      <div class="guide-wallet-split">
        <div><span>待结算</span><b>${guideMoney(stats.settlementPending)}</b></div>
        <div><span>冻结中</span><b>¥0.00</b></div>
      </div>
      <button class="primary-btn wide-btn guide-wallet-withdraw" type="button" data-open="20">提现</button>
    </section>
    <section class="card section guide-wallet-overview">
      <h2 class="section-title">收入概览</h2>
      <div class="segmented"><button class="segment" type="button" data-action="查看今日收入">今日</button><button class="segment" type="button" data-action="查看本周收入">本周</button><button class="segment active" type="button" data-action="查看本月收入">本月</button></div>
      <div class="profile-stats guide-wallet-stats">
        <div class="profile-stat"><span class="soft-icon">${icon('clipboard')}</span><small>接单收入</small><b class="red">${guideMoney(stats.revenue)}</b></div>
        <div class="profile-stat"><span class="soft-icon orange">${icon('gift')}</span><small>奖励补贴</small><b class="red">¥180</b></div>
        <div class="profile-stat"><span class="soft-icon purple">${icon('minusCircle')}</span><small>扣款</small><b>¥0</b></div>
        <div class="profile-stat"><span class="soft-icon green">${icon('thumbsUp')}</span><small>好评率</small><b>${guideGoodRate()}</b></div>
      </div>
    </section>
    <section class="card section">
      <h2 class="section-title">最近入账</h2>
      ${[
        ['headset', '', '陪伴就医', '李奶奶', '+¥120.00', '05-20'],
        ['route', 'purple', '景点游览', '王爷爷', '+¥160.00', '05-19'],
        ['message', 'green', '生活陪伴', '张阿姨', '+¥100.00', '05-18']
      ].map(([entryIcon, color, title, desc, amount, date]) => `<button class="menu-row guide-wallet-entry" type="button" data-open="21"><div class="menu-left"><span class="soft-icon ${color}">${icon(entryIcon)}</span><div><strong>${title}</strong><small>${desc}</small></div></div><strong class="red">${amount}<small>${date}</small></strong>${icon('chevronRight')}</button>`).join('')}
    </section>
    <section class="card section guide-wallet-note">
      <h2 class="section-title">结算说明</h2>
      <p>${icon('info')} 服务完成并确认后，收入进入待结算，T+1 可提现</p>
    </section>
  `;
  return shell('我的钱包', content, { right: '<button class="text-btn guide-wallet-detail" type="button" data-open="21">明细</button>' });
}

function renderWithdraw() {
  const stats = guideStats();
  const content = `
    <section class="card section guide-withdraw-amount">
      <h2 class="section-title">提现金额</h2>
      <p>可提现 <span>${guideMoney(stats.withdrawable)}</span></p>
      <label class="guide-withdraw-input"><b>¥</b><input value="500" inputmode="numeric" aria-label="提现金额" /></label>
      <small>金额将在您确认后提现至绑定账户</small>
      <div class="guide-withdraw-chips">
        <button type="button" data-action="提现全部">全部提现</button>
        <button type="button" data-action="提现100">¥100</button>
        <button class="active" type="button" data-action="提现500">¥500</button>
        <button type="button" data-action="提现1000">¥1000</button>
      </div>
    </section>
    <section class="card section guide-withdraw-account">
      <h2 class="section-title">到账账户</h2>
      <div class="guide-bank-row">
        <span class="guide-bank-logo">M</span>
        <strong>招商银行 <small>尾号 8899</small></strong>
        <button type="button" data-action="更换银行卡">更换</button>
        ${icon('chevronRight')}
      </div>
      <div class="guide-realname-row"><span>真实姓名</span><b>李向导</b></div>
    </section>
    <section class="card section guide-withdraw-rules">
      <h2 class="section-title">提现规则</h2>
      ${[
        ['yuan', '单笔最低 ¥10'],
        ['clock', '预计 1-2 个工作日到账'],
        ['shield', '平台不收取提现手续费']
      ].map(([ruleIcon, text]) => `<div>${icon(ruleIcon)}<span>${text}</span></div>`).join('')}
    </section>
    <section class="card section guide-withdraw-verify">
      <h2 class="section-title">安全验证</h2>
      <label><span>短信验证码</span><input placeholder="请输入验证码" inputmode="numeric" /><button type="button" data-action="获取验证码">获取验证码</button></label>
    </section>
    <button class="primary-btn wide-btn guide-withdraw-submit" type="button" data-action="确认提现">确认提现</button>
  `;
  return shell('提现申请', content);
}

function renderSettlement() {
  const stats = guideStats();
  const records = [
    ['陪伴就医订单', '+120.00', '05-20 11:40', 'green'],
    ['提现到银行卡', '-500.00', '05-19 18:02', 'red'],
    ['导游游览订单', '+160.00', '05-19 15:30', 'green'],
    ['平台奖励', '+30.00', '05-18 09:00', 'green']
  ];
  const content = `
    <div class="segmented"><button class="segment active" type="button" data-action="结算筛选全部">全部</button><button class="segment" type="button" data-action="结算筛选结算">结算</button><button class="segment" type="button" data-action="结算筛选提现">提现</button><button class="segment" type="button" data-action="结算筛选退款">退款</button></div>
    <section class="card section" style="margin-top:12px;">
      <div class="row muted"><span>05-01　至　05-31</span><button class="secondary-btn" type="button" data-action="筛选结算日期">${icon('filter')} 筛选</button></div>
      <div class="profile-stats">
        <div class="profile-stat"><b class="red">${guideMoney(stats.revenue)}</b><small>收入</small></div>
        <div class="profile-stat"><b>${guideMoney(stats.withdrawable)}</b><small>已确认</small></div>
        <div class="profile-stat"><b class="orange">${guideMoney(stats.settlementPending)}</b><small>待结算</small></div>
      </div>
    </section>
    <section class="card section" style="margin-top:12px;">
      ${records.map(([title, amount, time, color]) => `<div class="menu-row"><div class="menu-left"><span class="soft-icon ${color}">${icon(color === 'green' ? 'yuan' : 'card')}</span><div><strong>${title}</strong><small>${time}</small></div></div><strong class="${color}">${amount}</strong></div>`).join('')}
    </section>
  `;
  return shell('结算记录', content);
}

function renderReviews() {
  const content = `
    <section class="card section">
      <div class="row">
        <div><strong style="font-size:32px;">4.9</strong> <span class="orange">★★★★★</span><p class="muted">综合评分</p></div>
        <div class="profile-stats" style="flex:1;margin:0;">
          <div class="profile-stat"><b>98.2%</b><small>好评率</small></div>
          <div class="profile-stat"><b>126</b><small>评价数</small></div>
        </div>
      </div>
    </section>
    <section class="card section">
      <h2 class="section-title">评价标签</h2>
      <div class="segmented" style="flex-wrap:wrap;">${['细心耐心 48', '准时到达 36', '服务专业 31', '沟通顺畅 28'].map((item, i) => `<button class="segment ${i === 0 ? 'active' : ''}" type="button" data-action="评价标签：${item}">${item}</button>`).join('')}</div>
    </section>
    <div class="segmented"><button class="segment active" type="button" data-action="评价筛选全部">全部</button><button class="segment" type="button" data-action="评价筛选有图">有图</button><button class="segment" type="button" data-action="评价筛选待回复">待回复</button><button class="segment" type="button" data-action="评价筛选低分">低分</button></div>
    <section class="card section" style="margin-top:12px;">
      ${['服务细致，陪老人就医很耐心。', '路线熟悉，讲解清楚。', '准时到达，沟通顺畅。'].map((text, i) => `<div class="menu-row" data-open="23"><div class="menu-left"><div class="avatar small ${i ? 'man' : 'elder'}">${i ? '王' : '李'}</div><div><strong>${i ? '王爷爷' : '李奶奶'} <span class="orange">★★★★★</span></strong><small>${text}</small></div></div>${icon('chevronRight')}</div>`).join('')}
    </section>
  `;
  return shell('评价管理', content);
}

function renderReviewDetail() {
  const replyDraft = String(guideState.reviewReplyDraft || GUIDE_REVIEW_REPLY_DEFAULT).slice(0, 100);
  const replyRecord = guideState.reviewReply?.text ? guideState.reviewReply : null;
  const canSubmitReply = replyDraft.trim().length >= 2;
  const content = `
    <p class="sr-only">评价详情页面包含订单服务概览、客户五星评价、三张服务照片、评价标签、向导回复输入框、提交回复按钮和平台提示入口，所有图片预览和回复操作均为可交互元素。</p>
    <section class="card guide-review-order">
      <span class="guide-review-service-tag">陪伴就医</span>
      <div class="guide-review-order-main">
        <img src="./assets/review-customer-li.jpg" alt="李奶奶">
        <div class="guide-review-order-info">
          <h2>李奶奶 <span>72岁</span><em>长期旅居</em></h2>
          <p>${icon('clock')}服务时间：05-20　09:30-12:00</p>
          <p>${icon('mapPin')}服务地点：弥勒市人民医院</p>
          <p>${icon('clipboard')}订单编号：DD202405200901</p>
        </div>
        <div class="guide-review-income"><span>收入</span><b>¥120.00</b></div>
      </div>
    </section>
    <section class="card guide-review-feedback">
      <h2>客户评价</h2>
      <div class="guide-review-rating"><strong>5.0</strong><span>★★★★★</span></div>
      <p>向导很准时，全程帮忙挂号、排队、取药，服务细心周到。</p>
      <div class="guide-review-photos">
        ${[
          ['review-photo-entrance.jpg', '门诊部照片'],
          ['review-photo-hall.jpg', '候诊区照片'],
          ['review-photo-medicine.jpg', '药品袋照片']
        ].map(([src, label]) => `<button type="button" data-action="查看${label}"><img src="./assets/${src}" alt="${label}"></button>`).join('')}
      </div>
      <h3>评价标签</h3>
      <div class="guide-review-tags">${['耐心细致', '准时到达', '服务专业'].map(tag => `<button type="button" data-action="${tag}">${tag}</button>`).join('')}</div>
    </section>
    <section class="card guide-review-reply">
      <h2>我的回复</h2>
      <label>
        <textarea maxlength="100" data-guide-review-reply-input aria-label="回复李奶奶评价">${escapeHtml(replyDraft)}</textarea>
        <span data-guide-review-reply-count>${replyDraft.length}/100</span>
      </label>
      ${replyRecord ? `
        <div class="guide-review-reply-record" data-guide-review-reply-record tabindex="-1">
          <strong>已回复</strong>
          <p>${escapeHtml(replyRecord.text)}</p>
          <small>${escapeHtml(replyRecord.time || '')} · ${escapeHtml(replyRecord.customer || '李奶奶')} · ${escapeHtml(replyRecord.orderNo || 'DD202405200901')}</small>
        </div>
      ` : ''}
      <button class="guide-review-submit" type="button" data-guide-review-reply-submit ${canSubmitReply ? '' : 'disabled'}>${replyRecord ? '更新回复' : '提交回复'}</button>
    </section>
    <section class="card guide-review-tip">
      <h2>平台提示</h2>
      <button type="button" data-open="35">${icon('info')}评价会影响接单推荐排序，请保持专业服务和及时沟通</button>
    </section>
  `;
  return shell('评价详情', content, { guideTip: false });
}

function renderServiceAreas() {
  const areaRows = ['湖泉片区', '温泉康养社区', '东风韵景区', '弥勒市人民医院周边', '红河水乡'];
  const radius = guideState.serviceAreaRadius || '3km';
  const areaPoints = [
    { name: '湖泉东门', left: '44%', top: '58%', range: '1km' },
    { name: '弥勒市人民医院', left: '19%', top: '72%', range: '3km' },
    { name: '弥勒站', left: '70%', top: '34%', range: '3km' },
    { name: '红河水乡', left: '76%', top: '66%', range: '5km' },
    { name: '东风韵景区', left: '15%', top: '28%', range: '不限' },
  ];
  const radiusText = radius === '不限' ? '不限范围' : `半径 ${radius}`;
  const reminderText = radius === '不限'
    ? '不限距离订单均可提醒，请确认服务时间与交通方式'
    : `平台会优先提醒 ${radius} 内订单，超出范围订单默认过滤`;
  const content = `
    <button class="card guide-area-city" type="button" data-open="14">
      <span>${icon('mapPin')}</span>
      <div><b>当前城市</b><strong>弥勒市</strong></div>
      <em>已开通</em>
      ${icon('chevronRight')}
    </button>
    <section class="card guide-area-map-card">
      <h2 class="section-title">接单范围 <small>${radiusText}</small></h2>
      <div class="guide-area-map" data-radius="${escapeHtml(radius)}">
        <span class="guide-area-radius"></span>
        <span class="guide-area-center">当前位置<br>湖泉生态园</span>
        ${areaPoints.map((point) => `<i data-point-range="${escapeHtml(point.range)}" style="left:${point.left};top:${point.top};">${point.name}</i>`).join('')}
      </div>
      <div class="guide-area-radius-tabs">
        ${['1km', '3km', '5km', '不限'].map((item) => `<button class="${guideState.serviceAreaRadius === item ? 'active' : ''}" type="button" data-guide-radius="${item}" aria-pressed="${guideState.serviceAreaRadius === item ? 'true' : 'false'}">${item}</button>`).join('')}
      </div>
    </section>
    <section class="card guide-area-list">
      <h2 class="section-title">服务片区</h2>
      ${areaRows.map((name) => {
        const active = guideState.serviceAreas.includes(name);
        return `<button class="${active ? 'active' : ''}" type="button" data-guide-area="${escapeHtml(name)}" aria-pressed="${active ? 'true' : 'false'}"><span>${active ? '✓' : ''}</span><b>${name}</b><em>${active ? '已选中' : '未选择'}</em>${icon('chevronRight')}</button>`;
      }).join('')}
    </section>
    <section class="card guide-area-reminder">
      <h2 class="section-title">距离提醒</h2>
      <button type="button" data-action="距离提醒"><span>${icon('bell')}</span><div><b>${radius === '不限' ? '不限距离订单提醒' : `超出 ${radius} 订单不提醒`}</b><small>${reminderText}</small></div><i class="switch on"></i></button>
    </section>
    <button class="primary-btn wide-btn guide-area-save" type="button" data-action="保存服务区域">保存设置</button>
  `;
  return shell('服务区域', content, { right: '<button class="guide-top-save" type="button" data-action="保存服务区域">保存</button>', guideTip: false });
}

function renderServiceTypes() {
  const selectedTypes = guideSelectedServiceTypes();
  const content = `
    <section class="card guide-service-summary">
      <span>${icon('clipboard')}</span>
      <div><b>当前 ${selectedTypes.length} 类服务</b><small>选择您希望接单的人群与订单</small></div>
    </section>
    <section class="card guide-service-type-list">
      ${GUIDE_SERVICE_TYPE_OPTIONS.map(([title, desc, iconName, color]) => guideServiceTypeRow(title, desc, iconName, color, selectedTypes.includes(title))).join('')}
    </section>
    <button class="card guide-capability-row" type="button" data-action="查看能力说明">${icon('info')}<span><b>能力说明</b><small>新增服务类型需平台认证或培训通过</small></span>${icon('chevronRight')}</button>
    <button class="primary-btn wide-btn guide-service-save" type="button" data-action="保存服务类型">保存服务类型</button>
  `;
  return shell('服务类型', content, { right: '<button class="guide-top-save" type="button" data-action="保存服务类型">保存</button>', guideTip: false });
}

function guideServiceTypeRow(title, desc, iconName, color, active) {
  return `
    <button class="guide-service-type-row ${active ? 'active' : ''} ${active ? color : 'gray'}" type="button" data-guide-service-type="${escapeHtml(title)}" aria-pressed="${active ? 'true' : 'false'}">
      <span>${icon(iconName)}</span>
      <div><b>${title}</b><small>${desc}</small></div>
      <i class="switch ${active ? 'on' : ''}"></i>
    </button>
  `;
}

function renderReminderSettings() {
  const methodRows = [
    ['sound', 'volume', '声音提醒', '播放订单提示音'],
    ['vibration', 'phone', '震动提醒', '手机震动'],
    ['push', 'bell', 'App 推送', '系统通知提醒'],
    ['sms', 'message', '短信提醒', '重要订单短信通知']
  ];
  const eventRows = [
    ['newOrder', '新订单推荐', '有新订单时提醒'],
    ['dispatch', '平台派单', '平台指派订单时提醒'],
    ['customerMessage', '客户消息', '客户发送消息时提醒'],
    ['serviceStart', '服务前开始', '服务开始前 15 分钟提醒'],
    ['customerComplete', '客户确认完成', '客户确认服务完成时提醒'],
    ['scheduleChange', '安排变动', '排班或订单变化时提醒']
  ];
  const content = `
    <section class="card section">
      <h2 class="section-title">提醒方式</h2>
      ${methodRows.map(([key, ico, title, desc]) => `<button class="menu-row guide-setting-control" type="button" data-guide-reminder-method="${key}" aria-pressed="${guideState.reminderMethods[key] ? 'true' : 'false'}"><div class="menu-left"><span class="soft-icon blue">${icon(ico)}</span><div><strong>${title}</strong><small>${desc}</small></div></div><span class="switch ${guideState.reminderMethods[key] ? 'on' : ''}"></span></button>`).join('')}
    </section>
    <section class="card section">
      <h2 class="section-title">提醒事件</h2>
      ${eventRows.map(([key, title, desc]) => `<button class="menu-row guide-setting-control" type="button" data-guide-reminder-event="${key}" aria-pressed="${guideState.reminderEvents[key] ? 'true' : 'false'}"><div class="menu-left"><span class="soft-icon blue">${icon('check')}</span><div><strong>${title}</strong><small>${desc}</small></div></div><span class="switch ${guideState.reminderEvents[key] ? 'on' : ''}"></span></button>`).join('')}
    </section>
  `;
  return shell('接单提醒', content);
}

function renderRouteNav() {
  const content = `
    <div class="route-map guide-amap-route-wrap" data-route-map-shell>
      <div class="guide-amap-real" data-guide-route-map aria-label="高德路线地图"></div>
      <p class="guide-amap-status" data-guide-route-status>正在加载高德地图路线...</p>
      <span class="route-label current" data-guide-route-origin-label>${guideRouteOrigin.realtime ? '实时位置' : '当前位置'}<br>${guideRouteOrigin.name || GUIDE_ROUTE_ORIGIN}</span>
      <span class="route-label target">${GUIDE_ROUTE_DESTINATION}</span>
      <button class="route-map-control locate" type="button" data-action="定位当前位置">${icon('settings')}<span>定位</span></button>
      <button class="route-map-control layer" type="button" data-action="切换地图图层">${icon('layers')}<span>图层</span></button>
    </div>
    <section class="route-sheet">
      <i class="route-sheet-handle"></i>
      <div class="route-sheet-profile">
        <img src="./assets/review-customer-li.jpg" alt="李奶奶">
        <div>
          <h2>李奶奶　就医陪伴 <em>陪伴就医</em></h2>
        </div>
      </div>
      <div class="route-destination" aria-label="服务目的地">${icon('mapPin')}<span>${GUIDE_ROUTE_DESTINATION}</span>${icon('chevronRight')}</div>
      <div class="route-distance">
        <span>${icon('route')}<b>1.2km</b></span>
        <span>${icon('clock')}<b>约 8 分钟</b></span>
      </div>
      <div class="route-travel-mode">
        ${[
          ['步行', 'walk', guideRouteMode === 'walk'],
          ['骑行', 'bike', guideRouteMode === 'bike'],
          ['驾车', 'car', guideRouteMode === 'car']
        ].map(([label, iconName, active]) => `<button class="${active ? 'active' : ''}" type="button" data-action="切换${label}路线">${icon(iconName)}<span>${label}</span></button>`).join('')}
      </div>
      <p class="route-tip">${icon('alert')} 未识别实时定位时，将使用默认服务起点调起高德地图，开始导航入口始终可用。</p>
      <div class="route-sheet-actions">
        <button class="route-start" type="button" data-action="开始路线导航">${icon('navigation')} 开始导航</button>
      </div>
    </section>
  `;
  return shell('路线导航', content, { noTop: false, right: '<button class="text-btn guide-route-refresh" type="button" data-action="刷新路线">刷新</button>' });
}

const GUIDE_CANCEL_REASONS = ['客户要求取消', '联系不上客户', '时间无法履约', '服务地点变更', '其他原因'];

function guideCancelableTask() {
  const tasks = guideState.dashboard?.tasks || [];
  return tasks.find(task => ['已接单', '服务中'].includes(task.status)) || null;
}

function guideCancelableOrder(task) {
  return task?.order || orders.find(order => order.taskId === task?.id) || null;
}

function renderCancelRequest() {
  const task = guideCancelableTask();
  const order = guideCancelableOrder(task) || {};
  const hasDashboard = Boolean(guideState.dashboard);
  const canSubmit = Boolean(task) || !hasDashboard;
  const selectedReason = GUIDE_CANCEL_REASONS.includes(guideState.cancelReason) ? guideState.cancelReason : '时间无法履约';
  const description = guideState.cancelDescription || '';
  const counter = `${description.length}/200`;
  const customer = order.elderName || order.customer || '李奶奶';
  const service = order.serviceType || order.service || '陪伴就医';
  const time = order.time || '今天 09:30';
  const place = order.location || order.place || '弥勒市人民医院';
  const note = order.note || order.content || '全程陪同取号、检查、取药';
  const amount = order.amount || order.price || 120;
  const taskState = task
    ? `当前可取消任务：${escapeHtml(task.taskNo || task.id)}`
    : hasDashboard
      ? '暂无已接单或服务中任务，不能提交取消申请'
      : '正在同步当前可取消任务';
  const content = `
    <section class="guide-cancel-order-card">
      <span class="tag orange">${escapeHtml(service)}</span>
      <div class="guide-cancel-order-main">
        <img src="./assets/review-customer-li.jpg" alt="李奶奶">
        <div>
          <h2>${escapeHtml(customer)} <em>${task ? escapeHtml(task.status) : '待同步'}</em></h2>
          <p>${icon('clock')}${escapeHtml(time)}</p>
          <p>${icon('mapPin')}${escapeHtml(place)}</p>
          <p>${icon('person')}${escapeHtml(note)}</p>
        </div>
        <strong><small>预计收入</small>¥${escapeHtml(amount)}</strong>
      </div>
    </section>
    <div class="notice red guide-cancel-notice">${icon('alert')} 取消前请先联系客户或平台客服确认，频繁取消会影响接单推荐</div>
    <section class="card section guide-cancel-card">
      <h2 class="section-title">取消原因 <small>（必选）</small></h2>
      <div class="guide-cancel-radio-list">${GUIDE_CANCEL_REASONS.map(reason => `<button type="button" class="${selectedReason === reason ? 'active' : ''}" data-guide-cancel-reason="${reason}" aria-pressed="${selectedReason === reason ? 'true' : 'false'}"><i></i>${reason}</button>`).join('')}</div>
    </section>
    <section class="card section guide-cancel-card guide-cancel-desc">
      <h2 class="section-title">补充说明 <small>（必填）</small></h2>
      <label><textarea data-guide-cancel-description maxlength="200" placeholder="请说明取消原因，便于平台处理...">${escapeHtml(description)}</textarea><em data-guide-cancel-count>${counter}</em></label>
    </section>
    <section class="card section guide-cancel-card guide-cancel-upload">
      <h2 class="section-title">上传凭证 <small>（选填）</small></h2>
      <button type="button" data-action="上传取消凭证">${icon('camera')}<span>上传图片</span></button>
    </section>
    <p class="guide-cancel-inline-status ${task ? 'is-ready' : 'is-blocked'}" data-guide-cancel-state>${taskState}</p>
    ${guideState.cancelError ? `<p class="guide-cancel-inline-status is-error" data-guide-cancel-error>${escapeHtml(guideState.cancelError)}</p>` : ''}
    <div class="guide-cancel-actions">
      <button class="secondary-btn" type="button" data-open="10">再想想</button>
      <button class="danger-btn" type="button" data-guide-cancel-submit ${guideState.cancelSubmitting || !canSubmit ? 'disabled' : ''}>${guideState.cancelSubmitting ? '提交中...' : '提交取消申请'}</button>
    </div>
  `;
  return shell('申请取消订单', content);
}

function renderCompleteReport() {
  const service = guideActiveServiceOrder();
  if (!service) {
    const emptyContent = `
      <section class="card section guide-hall-empty" data-guide-active-service-state="empty">
        <strong>暂无可完成的服务中订单</strong>
        <span>请先进入服务中订单，或刷新后再提交完成。</span>
        <div class="row" style="margin-top:14px;">
          <button class="secondary-btn" type="button" data-action="刷新服务中订单" data-local-action="true" data-guide-active-service-refresh="true">${icon('refresh')} 刷新</button>
          <button class="primary-btn" type="button" data-open="04">返回服务中</button>
        </div>
      </section>
    `;
    return shell('服务完成上报', emptyContent, { guideTip: false });
  }
  const checklist = service.checklist.length
    ? service.checklist
    : [{ title: '服务过程记录', description: '按订单要求完成当前服务', done: true }];
  const completed = service.progress?.completed ?? checklist.filter(item => item.done !== false).length;
  const total = service.progress?.total || checklist.length;
  const content = `
    <span class="sr-only">服务完成上报页面，包含客户订单信息、完成清单、服务结果、服务备注、完成凭证上传、结算预估和提交完成按钮。</span>
    <section class="guide-complete-customer">
      <img src="./assets/review-customer-li.jpg" alt="李奶奶">
      <div class="guide-complete-main">
        <h2>${escapeHtml(service.customerName)}　${escapeHtml(service.serviceType)} <em>${escapeHtml(service.status)}</em></h2>
        <p>${icon('clock')}服务时间：${escapeHtml(service.time)}</p>
        <p>${icon('mapPin')}服务地点：${escapeHtml(service.location)}</p>
        <p>${icon('clock')}服务时长：${escapeHtml(service.duration)}</p>
      </div>
      <button class="guide-complete-state" type="button" data-open="04">
        <span>${icon('check')}</span><b>${escapeHtml(service.status)}</b>${icon('chevronRight')}
      </button>
    </section>
    <section class="guide-complete-card guide-complete-checks">
      <header><h2>完成清单 <span>（${completed}/${total}）</span></h2><b>${completed >= total ? '已全部完成' : '待补充确认'}</b></header>
      ${checklist.map(item => `<button type="button" data-action="${escapeHtml(item.title || item)}">${icon(item.done === false ? 'alert' : 'check')}<span><strong>${escapeHtml(item.title || item)}</strong><small>${escapeHtml(item.description || '来自当前订单服务清单')}</small></span>${icon('chevronRight')}</button>`).join('')}
    </section>
    <section class="guide-complete-card guide-complete-result">
      <h2>服务结果</h2>
      <div>
        ${['已安全送回', '客户自行离开', '转交家属', '其他'].map((label, index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-action="服务结果-${label}">${index === 0 ? icon('check') : ''}${label}</button>`).join('')}
      </div>
    </section>
    <section class="guide-complete-card guide-complete-remark">
      <h2>服务备注</h2>
      <label><textarea data-guide-complete-remark>${escapeHtml(service.note)}</textarea><em>${String(service.note || '').length}/200</em></label>
    </section>
    <section class="guide-complete-card guide-complete-proof">
      <h2>完成凭证 <span>（至少上传 1 张）</span></h2>
      <div>
        ${guideState.completeProofPhotos.map(({ src, label }, index) => `
          <figure class="guide-proof-photo">
            <img src="./assets/${src}" alt="${label}">
            <button class="guide-proof-delete" type="button" data-guide-proof-delete="${index}" aria-label="删除${label}凭证">${icon('close')}</button>
          </figure>
        `).join('')}
        <button class="guide-proof-upload" type="button" data-action="上传完成凭证">${icon('camera')}<span>上传照片</span></button>
      </div>
    </section>
    <section class="guide-complete-card guide-complete-settle">
      <h2>结算预估</h2>
      <div>
        <span>预计收入<strong>¥${Number(service.amount || 0).toFixed(2)}</strong></span>
        <span>超时补贴<strong>¥0.00</strong></span>
        <span>平台审核后入账<strong>1 个工作日内</strong></span>
      </div>
    </section>
    <button class="guide-complete-submit" type="button" data-guide-complete-current-service="${escapeHtml(service.taskId)}">提交完成</button>
  `;
  return shell('服务完成上报', content, { guideTip: false });
}

function renderCompletedDetail() {
  const content = `
    <div class="notice">${icon('check')} 订单已完成，收入已进入待结算</div>
    <section class="card section">
      <div class="row">${profileBlock()}<span class="price"><small>¥</small>120</span></div>
      <div style="height:12px;"></div>
      ${detailRows([
        ['订单编号', 'DD202405200901'],
        ['服务时间', '今天 09:30-11:30'],
        ['服务内容', '挂号 / 检查 / 取药'],
        ['完成时间', '05-20 11:42']
      ])}
    </section>
    <section class="card section">
      <h2 class="section-title">客户评价</h2>
      <p><span class="orange">★★★★★</span> 5.0</p>
      <p class="muted">服务细致，陪老人就医很耐心。</p>
    </section>
    <button class="secondary-btn wide-btn" data-open="23">查看评价详情</button>
  `;
  return shell('已完成订单详情', content);
}

function renderSystemNotice() {
  const notices = guideSystemMessages();
  const body = notices.length
    ? `<section class="card section" data-guide-notice-count="${notices.length}" data-active-filter="${escapeHtml(guideState.guideNoticeFilter || '全部')}">
        ${notices.map((message) => `
          <div class="menu-row" data-guide-message-id="${escapeHtml(message.id || '')}">
            <div class="menu-left"><span class="soft-icon blue">${icon('bell')}</span><div><strong>${message.read ? '' : '<span class="red">● </span>'}${escapeHtml(message.title || '系统通知')}</strong><small>${escapeHtml(message.content || '请查看平台通知')}</small></div></div>
            <button class="secondary-btn" type="button" style="min-height:32px;padding:0 10px;" data-guide-message-read="${escapeHtml(message.id || '')}" ${message.read || !message.id ? 'disabled' : ''}>${message.read ? '已读' : '标为已读'}</button>
          </div>
        `).join('')}
      </section>`
    : guideState.messagesError
      ? `<section class="card section guide-hall-empty" data-guide-message-state="error"><strong>系统通知加载失败</strong><span>${escapeHtml(guideState.messagesError)}</span></section>`
      : guideState.messagesLoading && !guideState.messageCenter
        ? `<section class="card section guide-hall-empty" data-guide-message-state="loading"><strong>正在同步系统通知</strong><span>请稍候，正在加载平台通知。</span></section>`
        : `<section class="card section guide-hall-empty" data-guide-message-state="empty" data-guide-notice-count="0" data-active-filter="全部"><strong>暂无系统通知</strong><span>后台发布通知后会在这里显示。</span></section>`;
  return shell('系统通知', body);
}

function renderOrderMessages() {
  const messages = guideMessageCenterMessages();
  const hasLoadedMessages = Array.isArray(guideState.messages) || Boolean(guideState.messageCenter);
  const tabs = ['全部', '待处理', '已处理'];
  const activeFilter = tabs.includes(guideState.orderMessageFilter) ? guideState.orderMessageFilter : '全部';
  const totalOrderMessages = guideOrderMessages(messages);
  const orderMessages = filteredGuideOrderMessages(messages, activeFilter);
  const body = orderMessages.length
    ? `
      <section class="card section" style="margin-top:12px;" data-guide-order-message-count="${orderMessages.length}" data-guide-order-message-total="${totalOrderMessages.length}" data-active-filter="${escapeHtml(activeFilter)}">
        ${orderMessages.map((message) => {
          const [action, open] = guideOrderMessageAction(message);
          return `<div class="menu-row" data-guide-message-id="${escapeHtml(message.id || '')}"><button class="menu-left" type="button" data-open="${open}"><span class="soft-icon orange">${icon('clipboard')}</span><div><strong>${message.read ? '' : '<span class="red">● </span>'}${escapeHtml(message.title || '订单消息')}</strong><small>${escapeHtml(message.content || '请查看订单详情')}</small></div></button><div class="row" style="gap:6px;flex:0 0 auto;"><button class="secondary-btn" type="button" style="min-height:32px;padding:0 10px;" data-guide-message-read="${escapeHtml(message.id || '')}" ${message.read || !message.id ? 'disabled' : ''}>${message.read ? '已读' : '标为已读'}</button><button class="secondary-btn" type="button" style="min-height:32px;padding:0 10px;" data-open="${open}">${action}</button></div></div>`;
        }).join('')}
      </section>
    `
    : guideState.messagesError
      ? `<section class="card section guide-hall-empty" style="margin-top:12px;"><strong>订单消息加载失败</strong><span>${escapeHtml(guideState.messagesError)}</span></section>`
      : guideState.messagesLoading || !hasLoadedMessages
        ? `<section class="card section guide-hall-empty" style="margin-top:12px;" data-guide-message-state="loading"><strong>正在同步订单消息</strong><span>正在从后台同步向导订单、派单和接单消息。</span></section>`
        : `<section class="card section guide-hall-empty" style="margin-top:12px;" data-guide-message-state="empty"><strong>${activeFilter === '全部' ? '暂无订单消息' : `暂无${activeFilter}订单消息`}</strong><span>新的派单、接单和订单状态变化会在这里展示。</span></section>`;
  const content = `
    <div class="segmented" data-guide-order-message-tabs data-active-filter="${escapeHtml(activeFilter)}">
      ${tabs.map(label => `<button class="segment ${label === activeFilter ? 'active' : ''}" type="button" data-guide-order-message-filter="${label}" aria-pressed="${label === activeFilter ? 'true' : 'false'}">${label}</button>`).join('')}
    </div>
    ${body}
  `;
  return shell('订单消息', content);
}

function renderCustomerChat() {
  const content = `
    <span class="sr-only">客户消息页面，包含李奶奶陪伴就医订单信息、聊天记录、平台安全提示、语音输入和发送消息入口。</span>
    <section class="guide-chat-order">
      <span>陪伴就医</span>
      <b>今天 09:30　弥勒市人民医院</b>
      <button type="button" data-open="02">查看订单 ${icon('chevronRight')}</button>
    </section>
    <div class="guide-chat-thread">
      <time>09:12</time>
      <div class="guide-chat-row customer">
        <img src="./assets/review-customer-li.jpg" alt="李奶奶">
        <p>您好，我在医院门口等您。</p>
      </div>
      <div class="guide-chat-row me">
        <p>李奶奶您好，我还有 5 分钟到达，请您先在门口阴凉处等我。</p>
        <small>09:18<br>已读</small>
      </div>
      <div class="guide-chat-row customer">
        <img src="./assets/review-customer-li.jpg" alt="李奶奶">
        <p>好的，谢谢你啦！</p>
      </div>
      <span class="guide-chat-time">09:20</span>
      <div class="guide-chat-tip">平台提示：请勿在平台外私下交易或收取现金</div>
      <div class="guide-chat-row me">
        <p>到达后我会先帮您取号，再陪同检查。</p>
        <small>09:22<br>已读</small>
      </div>
      ${guideState.customerChatReplies.map(reply => `
        <div class="guide-chat-row me">
          <p>${escapeHtml(reply.text)}</p>
          <small>${escapeHtml(reply.time)}<br>已发送</small>
        </div>
      `).join('')}
    </div>
    <div class="guide-chat-input">
      <button type="button" data-action="添加附件">${icon('plus')}</button>
      <input type="text" data-guide-chat-input placeholder="给李奶奶发送消息" value="">
      <button type="button" data-action="语音输入">${icon('mic')}</button>
      <button type="button" data-action="发送消息">发送</button>
    </div>
  `;
  return shell('李奶奶', content, { guideTip: false, right: `<a class="guide-chat-phone" ${guideDialAttrs('13800005678')} aria-label="拨打李奶奶电话">${icon('phone')}电话</a>` });
}

function renderSupportChat() {
  const content = `
    <span class="sr-only">平台客服页面，包含客服在线状态、订单问题收入结算异常上报账号认证快捷入口、客服聊天记录、相关入口和发送消息入口。</span>
    <section class="guide-support-card">
      <span>${icon('headset')}</span>
      <div><h2>云旅无忧客服</h2><p><i></i>在线　·　平均 1 分钟回复</p></div>
    </section>
    <div class="guide-support-shortcuts">
      ${[
        ['clipboard', '订单问题', '02'],
        ['yuan', '收入结算', '30'],
        ['alert', '异常上报', '05'],
        ['shield', '账号认证', '35']
      ].map(([iconName, label, open]) => `<button type="button" data-open="${open}">${icon(iconName)}${label}</button>`).join('')}
    </div>
    <div class="guide-chat-thread guide-support-thread">
      <time>09:32</time>
      <div class="guide-chat-row support">
        <span>${icon('headset')}</span>
        <p>您好，有什么可以帮您？</p>
      </div>
      <div class="guide-chat-row me">
        <p>客户已完成服务，但还没有确认订单，收入什么时候入账？</p>
        <small>已读</small>
      </div>
      <div class="guide-chat-row support">
        <span>${icon('headset')}</span>
        <div class="guide-support-answer">
          <p>客户确认后会立即进入结算。<br>如超过 24 小时未确认，平台将自动介入处理。</p>
          <section>
            <h3>相关入口</h3>
            <button type="button" data-open="03">${icon('clipboard')}查看待确认订单${icon('chevronRight')}</button>
            <button type="button" data-open="05">${icon('edit')}提交工单${icon('chevronRight')}</button>
          </section>
        </div>
      </div>
      ${guideState.supportChatReplies.map(reply => `
        <div class="guide-chat-row me">
          <p>${escapeHtml(reply.text)}</p>
          <small>${escapeHtml(reply.time)}<br>已发送</small>
        </div>
      `).join('')}
    </div>
    <div class="guide-chat-input">
      <button type="button" data-action="添加附件">${icon('plus')}</button>
      <input type="text" data-guide-chat-input placeholder="输入问题" value="">
      <button type="button" data-action="语音输入">${icon('mic')}</button>
      <button type="button" data-action="发送消息">发送</button>
    </div>
  `;
  return shell('平台客服', content, { guideTip: false, right: `<a class="guide-chat-phone" ${guideDialAttrs('4000000000')} aria-label="拨打客服电话">${icon('phone')}电话</a>` });
}

function renderSafety() {
  const report = guideState.safetyExceptionReport;
  const showSuccessModal = Boolean(report && guideState.safetyExceptionSuccessModalOpen);
  const content = `
    <section class="guide-safe-hero">
      <span class="guide-safe-hero-icon">${icon('shield')}</span>
      <span class="guide-safe-hero-mark">${icon('shield')}</span>
      <div><h2>服务安全守护中</h2><p>平台记录服务轨迹，保护客户与向导安全</p></div>
    </section>
    <section class="card guide-safe-current">
      <h2>当前服务安全提醒</h2>
      <button class="guide-safe-client" type="button" data-open="13" aria-label="查看李奶奶客户档案">
        <img src="./assets/safety-customer.jpg" alt="李奶奶">
        <div><b>李奶奶　就医陪伴 <em>服务中</em></b><p>${icon('mapPin')}弥勒市人民医院　${icon('clock')}今天 09:30-11:30</p></div>
        ${icon('chevronRight')}
      </button>
      ${[
        ['check', '已确认客户身份', '已完成', 'green'],
        ['check', '已开启服务轨迹记录', '已完成', 'green'],
        ['check', '已查看健康提示', '已完成', 'green'],
        ['alert', '请避免平台外交易', '待注意', 'orange']
      ].map(([iconName, title, state, color]) => `<button class="guide-safe-check ${color}" data-action="${title}" type="button"><span>${icon(iconName)}</span><b>${title}</b><em>${state}</em></button>`).join('')}
    </section>
    <section class="card guide-safe-tools">
      <h2>安全工具</h2>
      <div>
        ${[
          ['alert', '一键报警', 'red', '一键报警'],
          ['headset', '联系平台客服', 'blue', '平台客服'],
          ['mapPin', '位置共享', 'green', '位置共享'],
          ['alert', '异常上报', 'orange', '异常上报']
        ].map(([iconName, title, color, action]) => `<button class="${color}" data-action="${action}" type="button">${icon(iconName)}<span>${title}</span></button>`).join('')}
      </div>
    </section>
    <section class="card guide-safe-rules">
      <h2>服务规范</h2>
      ${['到达后确认客户身份', '服务过程不得代收现金', '紧急情况先保障客户安全', '保护客户隐私与健康信息'].map((item) => `<div class="guide-safe-rule-row"><span>${icon('shield')}</span><b>${item}</b></div>`).join('')}
    </section>
    <section class="card guide-safe-records">
      <h2>近期安全记录</h2>
      ${[
        ['05-20', '身份确认完成', '09:32'],
        ['05-19', '轨迹记录正常', '16:48'],
        ['05-18', '无异常事件', '11:05']
      ].map(([date, title, time]) => `<div class="guide-safe-record-row"><i></i><b>${date}</b><span>${title}</span><em>${time}</em></div>`).join('')}
    </section>
    <button class="guide-safe-primary" data-open="43" type="button">查看完整服务规范</button>
    ${showSuccessModal ? `<div class="guide-exception-modal-backdrop" data-guide-safety-success-modal role="presentation">
      <section class="guide-exception-success-modal" role="dialog" aria-modal="true" aria-labelledby="guide-safety-success-title" tabindex="-1">
        <span class="guide-exception-success-icon">${icon('check')}</span>
        <h2 id="guide-safety-success-title">提交成功</h2>
        <p>平台已收到本次安全异常上报，请保持电话畅通并留意订单状态变化。</p>
        <div class="guide-exception-success-meta">
          <span>异常编号：${escapeHtml(report.id)}</span>
          <span>异常类型：${escapeHtml(report.type || '服务异常')}</span>
          <span>处理状态：${escapeHtml(report.status || '待处理')}</span>
        </div>
        <button class="primary-btn wide-btn" type="button" data-guide-safety-success-close>我知道了</button>
      </section>
    </div>` : ''}
  `;
  return shell('安全中心', content, { guideTip: false });
}

function ensureGuideSafetyPanel(key, title, body, status = '') {
  document.querySelector(`[data-guide-safety-panel="${key}"]`)?.remove();
  const anchor = document.querySelector('.guide-safe-tools') || document.querySelector('.screen-scroll');
  const panel = document.createElement('section');
  panel.className = 'card guide-safe-action-panel';
  panel.dataset.guideSafetyPanel = key;
  panel.innerHTML = `
    <h2 class="section-title">${escapeHtml(title)}</h2>
    ${body}
    ${status ? `<p class="action-status" data-action-status>${escapeHtml(status)}</p>` : ''}
  `;
  anchor?.after(panel);
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  return panel;
}

function guideSafetyLocationFallback() {
  return { lng: 103.4148, lat: 24.4105, name: GUIDE_ROUTE_ORIGIN, realtime: false };
}

function locateGuideSafetyPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(guideSafetyLocationFallback());
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (result) => resolve({
        lng: result.coords.longitude,
        lat: result.coords.latitude,
        accuracy: result.coords.accuracy,
        name: '向导实时位置',
        realtime: true
      }),
      () => resolve(guideSafetyLocationFallback()),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}

function guideSafetyAmapUrl(locationInfo, label = '向导实时位置') {
  return `https://uri.amap.com/marker?position=${encodeURIComponent(`${locationInfo.lng},${locationInfo.lat}`)}&name=${encodeURIComponent(label)}&src=${encodeURIComponent('云旅无忧向导端')}&coordinate=gaode&callnative=1`;
}

async function submitGuideSafetyAlert(action, type, description, payload = {}) {
  await ensureGuideToken();
  return guideApiRequest('/api/guide/exception', {
    method: 'POST',
    body: {
      guideId: guideState.dashboard?.guide?.id || 'guide-001',
      type,
      level: payload.level || (payload.priority === 'P0' ? '高' : '中'),
      location: payload.locationText || payload.location?.text || '向导端安全中心',
      description,
      attachments: payload.attachments || [],
      source: `向导端安全中心-${action}`,
      payload: {
        guideName: guideProfile.name,
        action,
        ...payload
      },
    }
  });
}

async function openGuideAlarmFlow(button) {
  const panel = ensureGuideSafetyPanel('alarm', '一键报警', `
    <div class="guide-safe-contact-grid">
      <a class="danger-btn" ${guideDialAttrs('110')} aria-label="拨打 110">${icon('phone')}拨打 110</a>
      <a class="primary-btn" ${guideDialAttrs('120')} aria-label="拨打 120">${icon('phone')}拨打 120</a>
      <button class="secondary-btn" type="button" data-open="34">${icon('headset')}联系平台客服</button>
    </div>
  `, '正在生成报警记录');
  try {
    await ensureGuideToken();
    const locationInfo = await locateGuideSafetyPosition();
    const locationText = `${locationInfo.name} ${locationInfo.lng.toFixed(5)},${locationInfo.lat.toFixed(5)}`;
    const result = await submitGuideSafetyAlert('一键报警', '向导一键报警', '向导端安全中心触发一键报警，请后台同步当前服务订单并联系向导。', {
      priority: 'P0',
      level: '高',
      locationText,
      location: { text: locationText, lng: locationInfo.lng, lat: locationInfo.lat, accuracy: locationInfo.accuracy || 0, realtime: locationInfo.realtime },
    });
    writeActionStatus(panel, `报警记录 ${result.alert.id} 已同步后台，可按需拨打 110 或 120`);
  } catch (error) {
    writeActionStatus(panel, `后台同步失败：${guideFriendlyStatusMessage(error.message, '请稍后重试')}。可按需拨打 110 或 120`);
  }
}

function openGuideExceptionForm(button) {
  guideState.safetyExceptionSuccessModalOpen = false;
  const panel = ensureGuideSafetyPanel('exception', '异常上报', `
    <form class="guide-safe-exception-form" data-guide-safe-exception-form>
      <label><span>异常类型</span><select name="type"><option>客户身体不适</option><option>客户失联</option><option>服务地点变更</option><option>费用争议</option><option>其他异常</option></select></label>
      <label><span>紧急程度</span><select name="level"><option>中</option><option>高</option><option>低</option></select></label>
      <label><span>异常说明</span><textarea name="description" rows="4" placeholder="请说明异常经过、位置和需要平台协助的事项">当前服务出现异常，请平台协助跟进。</textarea></label>
      <button class="primary-btn wide-btn" type="button" data-guide-safe-exception-submit>${icon('send')}提交异常</button>
    </form>
  `, '请补充异常信息后提交后台');
  panel.querySelector('textarea')?.focus();
}

async function submitGuideSafetyException(button) {
  const form = button.closest('[data-guide-safe-exception-form]');
  const data = Object.fromEntries(new FormData(form).entries());
  const description = String(data.description || '').trim();
  if (description.length < 6) {
    writeActionStatus(form || button, '请至少填写 6 个字的异常说明');
    return;
  }
  button.disabled = true;
  try {
    await ensureGuideToken();
    const locationInfo = await locateGuideSafetyPosition();
    const result = await guideApiRequest('/api/guide/exception', {
      method: 'POST',
      body: {
        guideId: guideState.dashboard?.guide?.id || 'guide-001',
        type: data.type || '服务异常',
        level: data.level || '中',
        location: `${locationInfo.name} ${locationInfo.lng.toFixed(5)},${locationInfo.lat.toFixed(5)}`,
        description
      }
    });
    guideState.safetyExceptionReport = {
      id: result.alert?.id || '已提交',
      type: data.type || '服务异常',
      status: result.alert?.status || '待处理'
    };
    guideState.safetyExceptionSuccessModalOpen = true;
    renderScreen('35', false, { replace: true, skipApiHydrate: true });
    document.querySelector('[data-guide-safety-success-modal] [role="dialog"]')?.focus({ preventScroll: true });
  } catch (error) {
    writeActionStatus(form || button, `异常提交失败：${guideFriendlyStatusMessage(error.message, '请稍后重试')}`);
  } finally {
    button.disabled = false;
  }
}

function closeGuideSafetySuccessModal() {
  guideState.safetyExceptionSuccessModalOpen = false;
  renderScreen('35', false, { replace: true, skipApiHydrate: true });
}

async function shareGuideSafetyLocation(button) {
  const panel = ensureGuideSafetyPanel('location', '位置共享', `
    <div class="guide-safe-location-state">${icon('mapPin')}正在获取当前位置...</div>
  `, '正在定位并同步平台');
  const locationInfo = await locateGuideSafetyPosition();
  const url = guideSafetyAmapUrl(locationInfo);
  panel.innerHTML = `
    <h2 class="section-title">位置共享</h2>
    <div class="guide-safe-location-state">${icon('mapPin')}<span>${escapeHtml(locationInfo.name)}：${locationInfo.lng.toFixed(5)}, ${locationInfo.lat.toFixed(5)}${locationInfo.accuracy ? `，精度约 ${Math.round(locationInfo.accuracy)} 米` : ''}</span></div>
    <div class="guide-safe-contact-grid">
      <a class="primary-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${icon('mapPin')}打开高德位置</a>
      <button class="secondary-btn" type="button" data-open="34">${icon('headset')}发送给客服</button>
    </div>
    <p class="action-status" data-action-status>正在同步位置给平台后台</p>
  `;
  try {
    const locationText = `${locationInfo.name} ${locationInfo.lng.toFixed(5)},${locationInfo.lat.toFixed(5)}`;
    const result = await submitGuideSafetyAlert('位置共享', '向导位置共享', '向导端安全中心共享当前位置。', {
      priority: 'P1',
      level: '中',
      locationText,
      location: { text: locationText, lng: locationInfo.lng, lat: locationInfo.lat, accuracy: locationInfo.accuracy || 0, realtime: locationInfo.realtime }
    });
    writeActionStatus(panel, `位置已共享到后台：${result.alert.id}`);
  } catch (error) {
    writeActionStatus(panel, `位置已在当前页展示，后台同步失败：${guideFriendlyStatusMessage(error.message, '请稍后重试')}`);
  }
}

function renderSchedule() {
  const weekDays = [['一', '20', '今天'], ['二', '21', ''], ['三', '22', ''], ['四', '23', ''], ['五', '24', ''], ['六', '25', ''], ['日', '26', '']];
  const content = `
    <section class="card section guide-schedule-week">
      <h2 class="section-title">本周排班</h2>
      <div class="guide-date-strip">
        ${weekDays.map(([week, day, note], i) => `
          <button class="${i === 0 ? 'active' : ''}" type="button" data-action="查看05-${day}排班">
            <span>${week}</span>
            <b>${day}</b>
            <em>${note}</em>
          </button>
        `).join('')}
      </div>
      <button class="guide-schedule-summary" type="button" data-open="37">${icon('calendar')}<span>已排班 <b>5 天</b> · 可接单 <b>36 小时</b></span>${icon('chevronRight')}</button>
    </section>
    <section class="card section guide-schedule-today">
      <h2 class="section-title">今日时段 <small>共 3 个时段</small></h2>
      ${[
        ['09:00-12:00', '接单中', 'green'],
        ['14:00-18:00', '接单中', 'green'],
        ['19:00-21:00', '休息', 'orange']
      ].map(([time, state, color]) => `<button class="guide-schedule-row" type="button" data-open="37"><span class="soft-icon ${color}">${icon(color === 'orange' ? 'wallet' : 'clock')}</span><strong>${time}</strong><em class="${color}">${state}</em>${icon('chevronRight')}</button>`).join('')}
    </section>
    <section class="card section guide-schedule-fixed">
      <div class="row"><h2 class="section-title">固定排班</h2><button class="switch ${guideState.fixedScheduleEnabled ? 'on' : ''}" type="button" data-guide-fixed-schedule aria-label="固定排班${guideState.fixedScheduleEnabled ? '已开启' : '已关闭'}" aria-pressed="${guideState.fixedScheduleEnabled ? 'true' : 'false'}"></button></div>
      <button class="guide-schedule-row" type="button" data-open="37"><span class="soft-icon blue">${icon('calendar')}</span><strong>每周一至周五&nbsp;&nbsp;09:00-18:00&nbsp;&nbsp;自动上线</strong></button>
      <button class="guide-schedule-row" type="button" data-open="24"><span class="soft-icon blue">${icon('mapPin')}</span><strong>服务区域</strong><small>弥勒市全域</small>${icon('chevronRight')}</button>
    </section>
    <section class="card section guide-schedule-leave">
      <h2 class="section-title">请假事项</h2>
      ${[
        ['明天下午', '05-21 14:00-18:00', '已休息', 'red'],
        ['端午假期', '05-31 至 06-02 共 3 天', '待确认', 'orange']
      ].map(([title, time, state, color]) => `<button class="guide-schedule-row" type="button" data-open="37"><span class="soft-icon ${color === 'red' ? 'purple' : 'orange'}">${icon('calendar')}</span><strong>${title}</strong><small>${time}</small><em class="${color}">${state}</em>${icon('chevronRight')}</button>`).join('')}
    </section>
    <button class="primary-btn wide-btn guide-schedule-edit" type="button" data-open="37">编辑排班</button>
  `;
  return shell('我的排班', content, { right: '<button class="text-btn guide-schedule-add" type="button" data-open="37">新增</button>' });
}

function renderScheduleEdit() {
  const content = `
    <span class="sr-only">编辑排班页面，包含选择日期、接单状态、服务时段、重复设置、备注和保存排班按钮。</span>
    <section class="guide-schedule-edit-card guide-schedule-date">
      <h2>选择日期</h2>
      <div class="guide-date-strip">
        ${[
          ['05-20', '周一'],
          ['05-21', '周二'],
          ['05-22', '周三'],
          ['05-23', '周四'],
          ['05-24', '周五'],
          ['05-25', '周六'],
          ['05-26', '周日']
        ].map(([date, week], index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-action="选择${date}"><span>${date}</span><b>${week}</b></button>`).join('')}
      </div>
      <div class="guide-date-shortcuts">
        ${['今天', '明天', '本周'].map((label, index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-action="${label}排班">${label}</button>`).join('')}
      </div>
    </section>
    <section class="guide-schedule-edit-card guide-schedule-status">
      <h2>接单状态</h2>
      <div><button class="active" type="button" data-action="可接单">可接单</button><button type="button" data-action="休息">休息</button></div>
      <p>可接单时段内会接收平台推荐订单</p>
    </section>
    <section class="guide-schedule-edit-card guide-schedule-times">
      <h2>服务时段</h2>
      ${[
        ['上午', '09:00', '12:00', true],
        ['下午', '14:00', '18:00', true],
        ['晚上', '19:00', '21:00', false]
      ].map(([label, start, end, on]) => `
        <div class="guide-time-row">
          <strong>${label}</strong>
          <button type="button" data-action="选择${label}开始时间">${start}${icon('chevronRight')}</button>
          <i>-</i>
          <button type="button" data-action="选择${label}结束时间">${end}${icon('chevronRight')}</button>
          <span class="guide-switch ${on ? 'on' : ''}" role="button" tabindex="0" data-action="${label}开关"></span>
        </div>
      `).join('')}
      <button class="guide-add-slot" type="button" data-action="添加时段">${icon('plus')}添加时段</button>
    </section>
    <section class="guide-schedule-edit-card guide-schedule-repeat">
      <h2>重复设置</h2>
      <div>
        ${['仅当天', '每周重复', '工作日重复'].map((label, index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-action="${label}">${label}</button>`).join('')}
      </div>
    </section>
    <section class="guide-schedule-edit-card guide-schedule-note">
      <h2>备注</h2>
      <label><textarea placeholder="如需说明休息原因可填写..."></textarea><em>0/100</em></label>
    </section>
    <button class="guide-schedule-save" type="button" data-open="36">保存排班</button>
  `;
  return shell('编辑排班', content, { right: '<button class="guide-top-save" type="button" data-open="36">保存</button>', guideTip: false });
}

function renderSkills() {
  const skills = [
    ['陪伴就医', '挂号、检查、取药、陪同就诊', 'clipboard', 'blue', '已开通', ['挂号取号', '检查陪同', '取药送药']],
    ['导游游览', '景点讲解、路线规划、拍照陪同', 'mapPin', 'purple', '已开通', ['路线规划', '景点讲解', '拍照陪同']],
    ['生活陪伴', '聊天、散步、购物陪伴', 'shield', 'green', '已开通', ['聊天散步', '购物陪伴']],
    ['接送出行', '站点接送、日常出行陪同', 'route', 'orange', '已开通', ['接送站点', '日常出行']],
    ['护工护理', '日常照护、康复协助', 'person', 'gray', '待完善', ['需补充护理资质']],
    ['帮办代办', '证件、缴费、材料代办', 'list', 'gray', '未开通', ['证件代办', '材料代办']]
  ];
  const content = `
    <section class="card guide-service-summary">
      <span>${icon('shield')}</span>
      <div><b>已开通 6 项技能</b><small>当前服务能力可接收对应订单</small></div>
    </section>
    <section class="card guide-service-type-list">
      ${skills.map(([title, desc, ico, color, state, tags]) => `
        <button class="guide-service-type-row ${color}" type="button" data-action="编辑服务技能：${title}">
          <span>${icon(ico)}</span>
          <div>
            <b>${title}</b>
            <small>${desc}</small>
            <p class="guide-skill-tags">${tags.map((tag) => `<i>${tag}</i>`).join('')}</p>
          </div>
          <em class="${state === '已开通' ? 'open' : state === '待完善' ? 'pending' : ''}">${state}</em>
          ${icon('chevronRight')}
        </button>
      `).join('')}
    </section>
    <section class="card section">
      <h2 class="section-title">资质材料</h2>
      ${[
        ['健康证', '已上传', 'green'],
        ['导游证', '未上传', 'orange'],
        ['护工证明', '待补充', 'orange']
      ].map(([title, state, color]) => `<div class="menu-row"><div class="menu-left"><span class="soft-icon ${color}">${icon('id')}</span><div><strong>${title}</strong><small>${state}</small></div></div>${icon('chevronRight')}</div>`).join('')}
    </section>
    <button class="primary-btn wide-btn" type="button" data-action="提交技能更新">提交更新</button>
  `;
  return shell('服务技能', content);
}

function renderStats() {
  const stats = guideStats();
  const content = `
    <div class="segmented"><button class="segment" type="button" data-action="统计日">日</button><button class="segment" type="button" data-action="统计周">周</button><button class="segment active" type="button" data-action="统计月">月</button></div>
    <section class="card section">
      <div class="row"><span class="muted">${icon('calendar')} 2024年5月</span><button class="secondary-btn" type="button" data-action="筛选统计">${icon('filter')} 筛选</button></div>
      <div class="profile-stats guide-stats-grid" style="margin-top:12px;">
        <div class="profile-stat"><b>${guideStatNumber('orderCount')}</b><small>接单数</small></div>
        <div class="profile-stat"><b>${guideStatNumber('completedOrders')}</b><small>完成数</small></div>
        <div class="profile-stat"><b>${guideStatNumber('cancelledOrders')}</b><small>取消数</small></div>
        <div class="profile-stat"><b>${guideMoney(stats.revenue)}</b><small>收入</small></div>
        <div class="profile-stat"><b>${guideGoodRate()}</b><small>好评率</small></div>
        <div class="profile-stat"><b>38</b><small>服务时长</small></div>
      </div>
    </section>
    <section class="card section"><h2 class="section-title">收入走势</h2>${chartLine()}</section>
    <section class="card section">
      <h2 class="section-title">服务构成</h2>
      <div class="row"><div class="donut"><span>128单</span></div>${barList([['陪伴就医','72',78],['生活陪伴','28',42],['导游游览','18',32],['护工护理','10',18]])}</div>
    </section>
    <section class="card section"><h2 class="section-title">服务质量</h2>${barList([['准时到达', '99%', 99], ['客户满意', '96%', 96], ['服务完成', '100%', 100]])}</section>
    <div class="notice green">${icon('shield')} 本月表现优秀，继续保持服务质量！</div>
  `;
  return shell('工作统计', content);
}

function guideProfileData() {
  const profile = guideState.profile?.profile || {};
  return {
    ...guideProfile,
    ...profile,
    name: profile.name || profile.realName || guideProfile.name,
    intro: profile.intro || guideProfile.intro,
    avatarUrl: profile.avatarUrl || guideProfile.avatarUrl || DEFAULT_GUIDE_AVATAR_URL
  };
}

function guideProfileBaseRows() {
  const rows = Array.isArray(guideState.profile?.baseRows) ? guideState.profile.baseRows : [];
  if (rows.length) return rows;
  const profile = guideProfileData();
  return [
    { icon: 'person', label: '姓名', key: 'name', value: profile.name, type: 'text' },
    { icon: 'user', label: '性别', key: 'gender', value: profile.gender, type: 'select', options: ['男', '女'] },
    { icon: 'phone', label: '手机号', key: 'phone', value: profile.phone, type: 'tel' },
    { icon: 'id', label: '身份证号', key: 'idCard', value: profile.idCard, type: 'text', readonly: true },
    { icon: 'mapPin', label: '所在城市', key: 'city', value: profile.city, type: 'text' },
    { icon: 'mapPin', label: '常住区域', key: 'area', value: profile.area, type: 'text' }
  ];
}

function guideProfileEmergencyContact() {
  const contact = guideState.profile?.emergencyContact || guideProfileData().emergencyContact || {};
  return {
    name: contact.name || '紧急联系人',
    relation: contact.relation || '家属',
    phone: contact.phone || '',
    maskedPhone: contact.maskedPhone || contact.phone || '未填写'
  };
}

function guideProfileCertRows() {
  const rows = Array.isArray(guideState.profile?.certifications) ? guideState.profile.certifications : [];
  if (rows.length) return rows;
  const profile = guideProfileData();
  return [
    { iconName: 'shield', label: '实名认证', title: '实名认证', state: profile.status || '待审核', color: 'blue', tone: 'blue', type: 'realname', rows: [['认证姓名', profile.name], ['证件号码', profile.idCard], ['认证状态', profile.status || '待审核']], uploadLabel: '更新实名资料', fileLabel: '当前实名材料已归档' },
    { iconName: 'check', label: '健康证明', title: '健康证明', state: profile.status || '待补充', color: 'green', tone: 'green', type: 'health', rows: [['证明状态', profile.status || '待补充'], ['材料状态', '等待平台复核']], uploadLabel: '上传/更新健康证明', fileLabel: '支持图片或 PDF' },
    { iconName: 'clipboard', label: '服务协议', title: '服务协议', state: '待确认', color: 'orange', tone: 'orange', type: 'agreement', rows: [['签署状态', '待确认']] }
  ];
}

function guideProfileCertDetail(type) {
  const selectedFile = guideState.profileCertFiles?.[type] || '';
  const detail = guideProfileCertRows().find(item => item.type === type);
  if (!detail || type === 'agreement') return null;
  return {
    ...detail,
    title: detail.title || detail.label,
    tone: detail.tone || detail.color || 'blue',
    iconName: detail.iconName || 'id',
    rows: Array.isArray(detail.rows) ? detail.rows : [],
    uploadLabel: detail.uploadLabel || `上传${detail.label || '认证'}材料`,
    fileLabel: selectedFile ? `已选择：${selectedFile}` : (detail.fileLabel || '请选择图片或 PDF')
  };
}

function renderProfileCertDetail() {
  const detail = guideProfileCertDetail(guideState.profileCertDetail);
  if (!detail) return '';
  return `
    <div class="guide-profile-cert-detail ${detail.tone}" data-guide-profile-cert-panel="${guideState.profileCertDetail}">
      <div class="guide-profile-cert-heading">
        <span>${icon(detail.iconName)}</span>
        <div>
          <b>${detail.title}资料</b>
          <small>点击下方入口可补充或更新材料</small>
        </div>
      </div>
      <div class="guide-profile-cert-lines">
        ${detail.rows.map(([label, value]) => `
          <div class="guide-profile-cert-line">
            <span>${label}</span>
            <strong>${escapeHtml(value)}</strong>
          </div>
        `).join('')}
      </div>
      <label class="guide-profile-cert-upload">
        ${icon('upload')}
        <span>
          <b>${detail.uploadLabel}</b>
          <small>${escapeHtml(detail.fileLabel)}</small>
        </span>
        <input type="file" accept="image/*,.pdf" data-guide-profile-cert-upload="${guideState.profileCertDetail}" aria-label="${detail.uploadLabel}">
      </label>
      <button class="primary-btn wide-btn" type="button" data-guide-profile-cert-submit="${guideState.profileCertDetail}" ${guideState.profileCertSubmitting === guideState.profileCertDetail ? 'disabled' : ''}>提交认证资料</button>
    </div>
  `;
}

function renderProfileIntro() {
  const profile = guideProfileData();
  const intro = guideState.profileIntroEditing ? guideState.profileIntroDraft : profile.intro;
  if (guideState.profileIntroEditing) {
    return `
      <div class="guide-profile-intro-editor">
        <textarea data-guide-profile-intro-field maxlength="160" rows="4" aria-label="个人简介">${escapeHtml(intro)}</textarea>
        <div class="guide-profile-intro-actions">
          <button class="secondary-btn" type="button" data-guide-profile-intro-cancel>取消</button>
          <button class="primary-btn" type="button" data-guide-profile-intro-save>保存简介</button>
        </div>
        <small>${String(intro || '').length}/160</small>
      </div>
    `;
  }
  return `
    <button class="guide-profile-intro-view" type="button" data-guide-profile-intro-edit>
      <span>${escapeHtml(profile.intro)}</span>
      ${icon('chevronRight')}
    </button>
  `;
}

function renderProfile() {
  const profile = guideProfileData();
  const baseRows = guideProfileBaseRows();
  const certRows = guideProfileCertRows();
  const contact = guideProfileEmergencyContact();
  const certActionAttrs = {
    realname: 'data-guide-profile-cert="realname"',
    health: 'data-guide-profile-cert="health"',
    agreement: 'data-action="查看协议：服务协议"'
  };
  const ratingLabel = profile.rating ? String(profile.rating) : '';
  const statusLabel = profile.currentStatus || profile.onlineStatus || profile.status || '';
  const profileStatus = guideState.profileError || (guideState.profileLoading ? '资料同步中' : '');
  const content = `
    <section class="card section guide-profile-head">
      <img src="${escapeHtml(profile.avatarUrl || guideAvatarUrl())}" alt="${escapeHtml(profile.name)}">
      <div>
        <h2>${escapeHtml(profile.name)} <em>${icon('shield')} ${escapeHtml(profile.status || '')}</em></h2>
        ${ratingLabel ? `<p>${icon('star')} ${escapeHtml(ratingLabel)}</p>` : ''}
        ${statusLabel ? `<p>${icon('check')} ${escapeHtml(statusLabel)}</p>` : ''}
      </div>
      <button type="button" data-guide-avatar-change="true" aria-label="更换头像">${icon('chevronRight')}</button>
      <input type="file" accept="image/*" data-guide-avatar-input aria-label="选择头像图片" hidden>
    </section>
    <section class="card guide-profile-sync">
      <span>${icon('info')} ${profileStatus ? escapeHtml(profileStatus) : '资料来自平台账户中心'}</span>
      <button class="guide-profile-sync-link" type="button" data-guide-profile-refresh aria-label="重新同步平台账户中心资料" ${guideState.profileLoading ? 'disabled' : ''}>${icon('refresh')} 重新同步</button>
    </section>
    <section class="card section guide-profile-card">
      <h2 class="section-title">基础信息</h2>
      ${baseRows.map(row => {
        const ico = row.icon || 'person';
        const label = row.label || row.title || '';
        const key = row.key || '';
        const value = row.value ?? '';
        const type = row.type || 'text';
        const options = Array.isArray(row.options) && row.options.length ? row.options : ['男', '女'];
        return `
        <label class="guide-profile-row guide-profile-edit-row">
          <span class="soft-icon blue">${icon(ico)}</span>
          <b>${escapeHtml(label)}</b>
          ${type === 'select'
            ? `<select data-guide-profile-field="${escapeHtml(key)}">${options.map(option => `<option value="${escapeHtml(option)}" ${value === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select>`
            : `<input data-guide-profile-field="${escapeHtml(key)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${row.readonly || key === 'idCard' ? 'readonly' : ''} />`
          }
        </label>
      `;
      }).join('')}
    </section>
    <section class="card section guide-profile-card guide-profile-contact">
      <h2 class="section-title">紧急联系人</h2>
      <div class="guide-profile-contact-row">
        <span class="soft-icon green">${icon('user')}</span>
        <strong>${escapeHtml(contact.name)} <em>${escapeHtml(contact.relation)}</em></strong>
        <small>${escapeHtml(contact.maskedPhone)}</small>
        <a class="secondary-btn" ${guideDialAttrs(contact.phone)} aria-label="拨打${escapeHtml(contact.name)}紧急联系人">${icon('phone')} 拨打</a>
      </div>
    </section>
    <section class="card section guide-profile-card">
      <h2 class="section-title">认证资料</h2>
      ${certRows.map(({ iconName, label, state, color, type }) => {
        const actionAttr = certActionAttrs[type] || `data-guide-profile-cert="${escapeHtml(type)}"`;
        return `
        <button class="guide-profile-row" type="button" ${actionAttr} ${type === 'agreement' ? '' : `aria-expanded="${guideState.profileCertDetail === type ? 'true' : 'false'}"`}>
          <span class="soft-icon ${color}">${icon(iconName)}</span>
          <b>${escapeHtml(label)}</b>
          <strong class="green">${escapeHtml(state)}</strong>
          ${icon('chevronRight')}
        </button>
      `;
      }).join('')}
      ${renderProfileCertDetail()}
    </section>
    <section class="card section guide-profile-card guide-profile-intro">
      <h2 class="section-title">个人简介</h2>
      ${renderProfileIntro()}
    </section>
  `;
  return shell('个人资料', content, { right: '<button class="text-btn guide-profile-save-top" type="button" data-action="保存资料">保存</button>' });
}

function guideSettingsData() {
  const settings = guideState.settings || {};
  return {
    privacy: {
      privacyPermission: guideState.privacyPermission,
      locationSharing: true,
      profileVisible: true,
      ...(settings.settings?.privacy || {})
    },
    notifications: {
      messageNotification: guideState.messageNotification,
      orderReminder: true,
      ...guideState.reminderMethods,
      serviceStart: guideState.reminderEvents.serviceStart,
      ...(settings.settings?.notifications || {})
    },
    protocolConfirmed: {
      ...guideState.protocolConfirmed,
      ...(settings.settings?.protocolConfirmed || {})
    }
  };
}

function guideSettingRows(kind) {
  const settings = guideSettingsData();
  const fromApi = kind === 'security' ? guideState.settings?.securityRows : kind === 'notification' ? guideState.settings?.notificationRows : guideState.settings?.protocolRows;
  const rows = Array.isArray(fromApi) && fromApi.length ? fromApi : [];
  if (kind === 'security' && rows.length) {
    return rows.map(row => ({
      icon: row.icon,
      title: row.title,
      value: row.value,
      open: row.open,
      settingKey: row.settingKey,
      settingGroup: row.group,
      toggle: row.settingKey ? (row.enabled ? 'on' : 'off') : ''
    }));
  }
  if (kind === 'notification' && rows.length) {
    return rows.map(row => ({
      icon: row.icon,
      title: row.title,
      value: row.value,
      open: row.open,
      settingKey: row.settingKey,
      settingGroup: row.group,
      toggle: row.settingKey ? (row.enabled ? 'on' : 'off') : ''
    }));
  }
  if (kind === 'protocol' && rows.length) {
    return rows.map(row => ({ icon: row.icon, title: row.title, value: row.value, action: row.action }));
  }
  if (kind === 'security') {
    return [
      { icon: 'person', title: '个人资料', open: '40' },
      { icon: 'lock', title: '实名认证信息', value: '已认证', open: '40' },
      { icon: 'shield', title: '隐私权限', value: settings.privacy.privacyPermission ? '已开启' : '已关闭', settingKey: 'privacyPermission', settingGroup: 'privacy', toggle: settings.privacy.privacyPermission ? 'on' : 'off' }
    ];
  }
  if (kind === 'notification') {
    const reminderLabel = ['sound', 'vibration', 'push', 'sms']
      .filter(key => settings.notifications[key])
      .map(key => GUIDE_REMINDER_METHOD_LABELS[key] || key)
      .join('+') || '已关闭';
    return [
      { icon: 'bell', title: '接单提醒', value: reminderLabel, open: '26' },
      { icon: 'message', title: '消息通知', value: settings.notifications.messageNotification ? '已开启' : '已关闭', settingKey: 'messageNotification', settingGroup: 'notifications', toggle: settings.notifications.messageNotification ? 'on' : 'off' }
    ];
  }
  return ['用户协议', '隐私政策', '服务规范'].map(title => ({
    icon: title === '用户协议' ? 'clipboard' : title === '隐私政策' ? 'book' : 'info',
    title,
    value: settings.protocolConfirmed[title] ? '已确认' : '',
    action: `查看协议：${title}`
  }));
}

function renderSettings() {
  const updatedAt = String(guideState.settings?.updatedAt || '').slice(0, 16).replace('T', ' ');
  const updatedText = updatedAt ? `设置已同步：${updatedAt}` : (guideState.settingsLoading ? '正在同步设置' : '设置将从后台同步');
  const content = `
    <section class="card section guide-settings-summary" data-guide-settings-state="${guideState.settingsError ? 'error' : guideState.settings ? 'ready' : 'loading'}">
      <div>
        <strong>${escapeHtml(guideState.settings?.guide?.name || guideProfile.name || '人工向导')}</strong>
        <span>${escapeHtml(updatedText)}</span>
        ${guideState.settingsError ? `<small>${escapeHtml(guideState.settingsError)}</small>` : ''}
      </div>
      <button class="secondary-btn" type="button" data-guide-settings-refresh="true" ${guideState.settingsLoading ? 'disabled' : ''}>${icon('refresh')} 刷新</button>
    </section>
    <h2 class="group-title">账号与安全</h2>
    ${menuRows(guideSettingRows('security'))}
    <h2 class="group-title">通知设置</h2>
    ${menuRows(guideSettingRows('notification'))}
    <h2 class="group-title">服务协议</h2>
    ${menuRows(guideSettingRows('protocol'))}
    <button class="danger-btn wide-btn" style="margin-top:14px;background:#fff;color:var(--red);" type="button" data-guide-settings-logout="true">${guideState.settingsLogoutResult ? '已退出登录' : '退出登录'}</button>
  `;
  return shell('设置', content);
}

function renderHelp() {
  const content = `
    <div class="search-box">${icon('search')} 搜索问题或联系客服</div>
    <section class="card section">
      <div class="quick-grid" style="grid-template-columns:repeat(4,1fr);">
        ${[
          ['接单规则','clipboard','blue','43'],
          ['服务安全','shield','green','35'],
          ['结算提现','wallet','orange','19'],
          ['联系客服','headset','purple','34']
        ].map(([a,b,c,d]) => `<button class="quick-item" data-open="${d}"><span class="quick-icon ${c}">${icon(b)}</span><strong>${a}</strong></button>`).join('')}
      </div>
    </section>
    <section class="card section">
      <h2 class="section-title">常见问题</h2>
      ${[
        ['如何开启上线接单？', '08'],
        ['接单后未及时到达怎么办？', '27'],
        ['客户临时取消该如何处理？', '28'],
        ['服务完成后收入何时到账？', '19'],
        ['如何修改服务区域和技能？', '24']
      ].map(([title, open]) => `<button class="menu-row" type="button" data-open="${open}"><div class="menu-left"><span class="soft-icon blue">${icon('help')}</span><div><strong>${title}</strong></div></div>${icon('chevronRight')}</button>`).join('')}
    </section>
    <section class="card section">
      <h2 class="section-title">联系客服</h2>
      <div class="row"><a class="secondary-btn" ${guideDialAttrs('4000000000')} aria-label="拨打咨询热线">${icon('phone')} 咨询热线</a><button class="primary-btn" type="button" data-open="34">${icon('headset')} 在线客服</button></div>
    </section>
    <div class="floating-footer"><button class="secondary-btn" data-open="44">意见反馈</button><button class="primary-btn" data-open="34">联系客服</button></div>
  `;
  return shell('帮助中心', content);
}

function renderRules() {
  const protocol = GUIDE_PROTOCOLS[guideState.protocolType] || GUIDE_PROTOCOLS.服务规范;
  const confirmed = Boolean(guideState.protocolConfirmed?.[protocol.title]);
  const sectionBlock = (tone, title, items) => `
    <section class="card section rules-ref-card ${tone}">
      <div class="rules-ref-title">
        <span>${icon(tone === 'blue' ? 'clipboard' : tone === 'green' ? 'user' : 'calendar')}</span>
        <h2>${title}</h2>
      </div>
      <div class="rules-ref-list">
        ${items.map((item, index) => `
          <div class="rules-ref-step">
            <b>${index + 1}</b>
            <span>${item}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  const [warningIcon, warningText] = protocol.warning;
  const content = `
    <div class="rules-ref">
      <section class="card section rules-ref-hero">
        <span>${icon(protocol.iconName)}</span>
        <div>
          <h1>${protocol.title}</h1>
          <p>${protocol.subtitle}</p>
        </div>
        <i></i>
      </section>
      ${protocol.sections.map(([tone, title, items]) => sectionBlock(tone, title, items)).join('')}
      <div class="rules-ref-warning">${icon(warningIcon)}<p>${warningText}</p></div>
      <button class="primary-btn wide-btn rules-ref-submit" type="button" data-action="${protocol.action}" aria-pressed="${confirmed ? 'true' : 'false'}">${confirmed ? '已确认阅读' : '我已阅读并遵守'}</button>
    </div>
  `;
  return shell(protocol.title, content);
}

function renderFeedback() {
  const issueTypes = [
    ['功能异常', '功能无法使用或异常', 'settings', 'blue'],
    ['订单问题', '接单、取消、状态异常', 'clipboard', 'orange'],
    ['收入结算', '收入、提现、结算问题', 'yuan', 'yellow'],
    ['客户沟通', '客户消息、沟通问题', 'message', 'green'],
    ['页面建议', '页面设计、体验建议', 'edit', 'purple'],
    ['其他', '其他问题或建议', 'more', 'slate']
  ];
  const description = String(guideState.feedbackDescription || '').slice(0, 300);
  const screenshots = guideState.feedbackScreenshots.slice(0, GUIDE_FEEDBACK_MAX_SCREENSHOTS);
  const content = `
    <section class="card section guide-feedback-types">
      <h2 class="section-title">问题类型</h2>
      <div class="guide-feedback-grid">
        ${issueTypes.map(([title, desc, iconName, color]) => {
          const active = guideState.feedbackType === title;
          return `
          <button class="guide-feedback-type ${active ? 'active' : ''}" type="button" data-action="选择反馈类型-${title}" aria-pressed="${active ? 'true' : 'false'}">
            <span class="quick-icon ${color}">${icon(iconName)}</span>
            <span class="guide-feedback-type-copy"><strong>${title}</strong><small>${desc}</small></span>
            ${active ? `<i>${icon('check')}</i>` : ''}
          </button>
        `;
        }).join('')}
      </div>
    </section>
    ${guideState.feedbackRecordOpen ? renderFeedbackRecords() : ''}
    <section class="card section guide-feedback-card">
      <h2 class="section-title">问题描述</h2>
      <textarea class="textarea-box" data-guide-feedback-description maxlength="300" placeholder="请详细描述问题或建议，便于我们尽快处理...">${escapeHtml(description)}</textarea>
      <span class="guide-feedback-count" data-guide-feedback-count>${description.length}/300</span>
    </section>
    <section class="card section guide-feedback-card guide-feedback-upload">
      <h2 class="section-title">上传截图 <small>选填</small></h2>
      <div class="upload-grid">
        ${Array.from({ length: GUIDE_FEEDBACK_MAX_SCREENSHOTS }).map((_, index) => {
          const shot = screenshots[index];
          return `
            <label class="upload-box ${shot ? 'has-file' : ''}">
              ${shot ? `<img src="${shot.dataUrl}" alt="${escapeHtml(shot.name)}"><span>${escapeHtml(shot.name)}</span>` : `${icon('camera')}<span>上传图片</span>`}
              <input class="guide-feedback-file-input" data-guide-feedback-screenshot="${index}" type="file" accept="image/*" aria-label="上传反馈截图${index + 1}">
            </label>
          `;
        }).join('')}
      </div>
      ${screenshots.length ? `<button class="text-btn guide-feedback-clear" type="button" data-action="清空反馈截图">清空截图</button>` : ''}
    </section>
    <section class="card section guide-feedback-contact">
      <h2 class="section-title">联系方式</h2>
      <label class="guide-feedback-row guide-feedback-field">${icon('phone')}<span>手机号</span><input data-guide-feedback-contact="phone" inputmode="tel" maxlength="11" value="${escapeHtml(guideState.feedbackContact.phone)}" aria-label="手机号"><small>用于电话回访</small></label>
      <label class="guide-feedback-row guide-feedback-field">${icon('message')}<span>微信号</span><input data-guide-feedback-contact="wechat" maxlength="32" value="${escapeHtml(guideState.feedbackContact.wechat)}" placeholder="可选填写" aria-label="微信号"><small>用于补充沟通</small></label>
    </section>
    <section class="card section guide-feedback-note">
      <h2 class="section-title">处理说明</h2>
      <p>${icon('info')} 提交后会生成后台待处理记录，客服可按手机号或微信号回访。</p>
    </section>
    <button class="primary-btn wide-btn guide-feedback-submit" type="button" data-action="提交意见反馈">提交反馈</button>
  `;
  return shell('意见反馈', content, { right: `<button class="text-btn guide-feedback-record" type="button" data-action="切换反馈记录">${guideState.feedbackRecordOpen ? '收起记录' : '反馈记录'}</button>` });
}

function renderFeedbackRecords() {
  const records = guideState.feedbackRecords.slice(0, 5);
  return `
    <section class="card section guide-feedback-records">
      <h2 class="section-title">反馈记录 <small>${records.length ? `最近 ${records.length} 条` : '暂无提交记录'}</small></h2>
      ${records.length ? records.map(record => `
        <article class="guide-feedback-record-item">
          <span>${escapeHtml(record.type || '意见反馈')}</span>
          <strong>${escapeHtml(record.title || record.description || '反馈内容')}</strong>
          <p>${escapeHtml(record.description || '')}</p>
          <small>${escapeHtml(record.createdAt || '')} · ${escapeHtml(record.status || '待处理')} · ${escapeHtml(record.ticketNo || '')}</small>
        </article>
      `).join('') : '<p class="guide-feedback-empty">提交反馈后会在这里显示工单号、状态和摘要。</p>'}
    </section>
  `;
}

function loadGuideFeedbackRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(GUIDE_FEEDBACK_STORAGE_KEY) || '[]');
    return Array.isArray(records) ? records.slice(0, 10) : [];
  } catch (error) {
    return [];
  }
}

function saveGuideFeedbackRecords() {
  try {
    localStorage.setItem(GUIDE_FEEDBACK_STORAGE_KEY, JSON.stringify(guideState.feedbackRecords.slice(0, 10)));
  } catch (error) {
    // Local persistence is a convenience; backend submission remains authoritative.
  }
}

function formatGuideFeedbackTime(date = new Date()) {
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function compactGuideFeedbackText(text = '') {
  const value = String(text || '').trim().replace(/\s+/g, ' ');
  return value.length > 42 ? `${value.slice(0, 42)}...` : value;
}

function loadGuideReviewReply() {
  try {
    const record = JSON.parse(localStorage.getItem(GUIDE_REVIEW_REPLY_STORAGE_KEY) || 'null');
    if (!record || typeof record.text !== 'string') return null;
    const text = record.text.trim().slice(0, 100);
    if (!text) return null;
    return {
      text,
      time: String(record.time || ''),
      customer: String(record.customer || '李奶奶'),
      orderNo: String(record.orderNo || 'DD202405200901')
    };
  } catch (error) {
    return null;
  }
}

function saveGuideReviewReply() {
  try {
    if (!guideState.reviewReply?.text) {
      localStorage.removeItem(GUIDE_REVIEW_REPLY_STORAGE_KEY);
      return;
    }
    localStorage.setItem(GUIDE_REVIEW_REPLY_STORAGE_KEY, JSON.stringify(guideState.reviewReply));
  } catch (error) {
    // Local persistence is best-effort for this static guide review page.
  }
}

function submitGuideReviewReply(button) {
  const textarea = document.querySelector('[data-guide-review-reply-input]');
  const text = String(textarea?.value || guideState.reviewReplyDraft || '').trim().slice(0, 100);
  if (text.length < 2) {
    textarea?.focus();
    return;
  }
  guideState.reviewReplyDraft = text;
  guideState.reviewReply = {
    text,
    time: formatGuideFeedbackTime(),
    customer: '李奶奶',
    orderNo: 'DD202405200901'
  };
  saveGuideReviewReply();
  renderScreen('23', false, { replace: true, skipApiHydrate: true });
  const record = document.querySelector('[data-guide-review-reply-record]');
  record?.focus({ preventScroll: true });
}

function guideFeedbackAttachments() {
  return guideState.feedbackScreenshots.slice(0, GUIDE_FEEDBACK_MAX_SCREENSHOTS).map(item => ({
    name: item.name,
    type: item.type,
    size: item.size,
    dataUrl: item.dataUrl
  }));
}

function readGuideFeedbackImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      try {
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;
        if (!width || !height) throw new Error('图片尺寸无效');
        const scale = Math.min(1, GUIDE_FEEDBACK_IMAGE_MAX_EDGE / Math.max(width, height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('当前浏览器不支持图片处理');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve({
          name: file.name || `反馈截图-${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: file.size || 0,
          dataUrl: canvas.toDataURL('image/jpeg', GUIDE_FEEDBACK_IMAGE_QUALITY)
        });
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('图片格式暂不支持，请换用 JPG 或 PNG'));
    };
    image.src = objectUrl;
  });
}

async function handleGuideFeedbackScreenshot(input) {
  const file = input.files?.[0];
  if (!file) return;
  const index = Math.max(0, Math.min(GUIDE_FEEDBACK_MAX_SCREENSHOTS - 1, Number(input.dataset.guideFeedbackScreenshot || 0)));
  const scope = input.closest('.guide-feedback-upload') || input;
  if (!file.type?.startsWith('image/')) {
    writeActionStatus(scope, '请上传 JPG、PNG 等图片截图');
    showToast('请选择图片文件');
    return;
  }
  writeActionStatus(scope, '正在处理截图...');
  try {
    guideState.feedbackScreenshots[index] = await readGuideFeedbackImage(file);
    renderScreen('44', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-feedback-upload') || document.getElementById('phone'), '截图已上传，可继续补充或提交反馈');
    showToast('截图已上传');
  } catch (error) {
    writeActionStatus(scope, `截图上传失败：${guideFriendlyStatusMessage(error.message, '请重新选择')}`);
    showToast('截图上传失败');
  }
}

async function submitGuideFeedback(button) {
  const description = String(guideState.feedbackDescription || '').trim();
  const phone = String(guideState.feedbackContact.phone || '').trim();
  const wechat = String(guideState.feedbackContact.wechat || '').trim();
  const scope = document.querySelector('.guide-feedback-card') || button;
  if (description.length < 6) {
    writeActionStatus(scope, '请至少填写 6 个字的问题描述');
    showToast('请填写问题描述');
    return;
  }
  if (!/^1\d{10}$/.test(phone)) {
    writeActionStatus(document.querySelector('.guide-feedback-contact') || button, '请填写 11 位手机号，便于客服回访');
    showToast('请填写正确手机号');
    return;
  }

  const attachments = guideFeedbackAttachments();
  const lines = [
    description,
    `联系方式：${phone}${wechat ? `，微信号：${wechat}` : ''}`,
    attachments.length ? `反馈截图：${attachments.map(item => item.name).join('、')}` : ''
  ].filter(Boolean);
  button.disabled = true;
  const previousText = button.textContent;
  button.textContent = '提交中...';
  try {
    const result = await window.YunlvBusiness?.request?.('/api/guide/exception', {
      method: 'POST',
      body: {
        guideId: 'guide-001',
        type: guideState.feedbackType || '意见反馈',
        level: guideState.feedbackType === '功能异常' ? '中' : '低',
        location: '向导端意见反馈',
        description: lines.join('\n'),
        attachments
      }
    }, 'guide');
    const alert = result?.alert || {};
    const record = {
      id: alert.id || `local-${Date.now()}`,
      ticketNo: alert.id || `LOCAL-${Date.now()}`,
      type: guideState.feedbackType || '意见反馈',
      title: compactGuideFeedbackText(description),
      description,
      status: alert.status || '待处理',
      createdAt: alert.createdAt || formatGuideFeedbackTime(),
      attachments: attachments.map(item => ({ name: item.name, type: item.type, size: item.size }))
    };
    guideState.feedbackRecords.unshift(record);
    guideState.feedbackRecords = guideState.feedbackRecords.slice(0, 10);
    saveGuideFeedbackRecords();
    guideState.feedbackDescription = '';
    guideState.feedbackScreenshots = [];
    guideState.feedbackRecordOpen = true;
    renderScreen('44', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-feedback-records') || document.getElementById('phone'), `反馈已提交到后台工单：${record.ticketNo}`);
    showToast('反馈已提交');
  } catch (error) {
    writeActionStatus(scope, `反馈提交失败：${guideFriendlyStatusMessage(error.message, '请稍后重试')}`);
    showToast('反馈提交失败');
  } finally {
    button.disabled = false;
    button.textContent = previousText;
  }
}

function renderScan() {
  const qrCells = Array.from({ length: 49 }, () => '<i></i>').join('');
  return `
    <div class="scan-screen">
      ${statusBar(true)}
      <div class="topbar">
        <div><button class="icon-btn" type="button" data-action="返回" data-back="true" aria-label="返回" style="color:#fff;">${icon('chevronLeft')}</button></div>
        <div class="topbar-title">扫一扫</div>
        <div class="right" style="color:#fff;"><button class="scan-album-btn" type="button" data-action="从相册识别" data-local-action="true">相册</button></div>
      </div>
      <div class="scan-area">
        <button class="scanner-frame" type="button" data-action="扫描当前画面" data-local-action="true" aria-label="扫描当前画面">
          <video class="guide-scan-video" data-guide-scan-video autoplay playsinline muted></video>
          <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
          <div class="fake-qr">${qrCells}</div>
          <span class="scan-camera-state" data-guide-scan-camera-status>${escapeHtml(guideState.scanCameraStatus)}</span>
        </button>
        <p style="font-size:18px;">扫描客户订单码或身份确认码</p>
      </div>
      <section class="scan-panel">
        <h2 class="section-title">可扫描内容</h2>
        <div class="scan-options">
          ${menuRows([
            { icon: 'id', color: 'blue', title: '客户身份确认码', desc: '用于确认客户身份信息', open: '46' },
            { icon: 'clipboard', color: 'green', title: '订单服务核验码', desc: '用于核验订单信息与服务内容', open: '46' },
            { icon: 'briefcase', color: 'orange', title: '平台工牌二维码', desc: '用于平台向导工牌身份核验', open: '46' }
          ]).replace('<div class="card menu-list">', '<div class="menu-list">')}
        </div>
        <div class="row" style="margin-top:16px;">
          <button class="secondary-btn ${guideState.scanFlashlightOn ? 'active' : ''}" style="flex:1;" data-action="打开手电筒" type="button">${icon('flashlight')} ${guideState.scanFlashlightOn ? '关闭手电筒' : '打开手电筒'}</button>
          <button class="secondary-btn" style="flex:1;" data-action="手动输入编码" type="button">${icon('keyboard')} 手动输入编码</button>
        </div>
        <form class="guide-scan-manual" data-guide-scan-form ${guideState.manualScanCode ? '' : 'hidden'}>
          <input name="code" value="${escapeHtml(guideState.manualScanCode || 'YLW-20240520-0901')}" placeholder="输入订单码或身份确认码">
          <button class="primary-btn" type="submit">核验</button>
        </form>
        ${guideState.scanResult ? `<p class="action-status">${escapeHtml(guideState.scanResult)}</p>` : ''}
        <p class="muted scan-safe-copy">${icon('shield')} 请在客户同意后进行身份核验</p>
      </section>
    </div>
  `;
}

function updateGuideScanCameraStatus(text, tone = '') {
  guideState.scanCameraStatus = text;
  const status = document.querySelector('[data-guide-scan-camera-status]');
  if (status) {
    status.textContent = text;
    status.dataset.tone = tone;
  }
}

function attachGuideScanVideo() {
  const video = document.querySelector('[data-guide-scan-video]');
  if (!video || !guideScanStream) return;
  video.srcObject = guideScanStream;
  video.play?.().catch(() => {});
  video.closest('.scanner-frame')?.classList.add('camera-active');
}

function stopGuideScanCamera() {
  if (!guideScanStream) return;
  guideScanStream.getTracks().forEach(track => track.stop());
  guideScanStream = null;
}

async function startGuideScanCamera() {
  if (guideScanStream) {
    attachGuideScanVideo();
    updateGuideScanCameraStatus('摄像头正在取景，请对准客户码', 'success');
    return true;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    updateGuideScanCameraStatus('当前浏览器不支持实时摄像头，请用手动输入或相册核验', 'error');
    return false;
  }
  if (!window.isSecureContext) {
    updateGuideScanCameraStatus('浏览器要求 HTTPS 或 localhost 才能调用摄像头', 'error');
    return false;
  }
  updateGuideScanCameraStatus('正在调用摄像头，请在权限弹窗中允许', 'loading');
  try {
    guideScanStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    attachGuideScanVideo();
    updateGuideScanCameraStatus('摄像头正在取景，请对准客户码', 'success');
    return true;
  } catch (error) {
    updateGuideScanCameraStatus('摄像头未打开，请允许权限或使用手动输入', 'error');
    return false;
  }
}

function renderScanVerify() {
  const content = `
    <section class="success-hero">
      <span class="success-mark">✓</span>
      <div><h2 style="margin:0;">客户身份已确认</h2><p class="muted" style="margin:6px 0 0;">核验时间 05-20 09:26</p></div>
    </section>
    <section class="card section" style="margin-top:12px;">
      <div class="row">
        ${profileBlock({ tags: [pill('健康状况'), pill('良好', 'green')] })}
        <button class="call-circle">${icon('phone')}</button>
      </div>
    </section>
    <section class="card section">
      ${pill('陪伴就医', 'orange')}
      ${detailRows([
        ['订单编号', 'DD202405200901'],
        ['服务时间', '今天 09:30-11:30'],
        ['服务地点', '弥勒市人民医院'],
        ['服务内容', '挂号 / 检查 / 取药']
      ])}
    </section>
    <section class="card section">
      <h2 class="section-title">服务前确认</h2>
      ${checkList(['客户本人确认', '服务地点确认', '健康提示已阅读'], '行动较慢，上下车需搀扶')}
    </section>
    <div class="floating-footer"><button class="secondary-btn">${icon('phone')} 联系客户</button><button class="primary-btn" data-open="04">开始服务</button></div>
  `;
  return shell('扫码核验', content);
}

function init() {
  const list = document.getElementById('screenList');
  const prototypeMode = syncGuidePrototypeShell();
  if (prototypeMode && list) {
    list.innerHTML = screens.map((screen, index) => `
      <button type="button" data-open="${screen.id}">
        <span>${screen.id}-${screen.title}</span>
        <small>${String(index + 1).padStart(2, '0')}</small>
      </button>
    `).join('');
  } else if (list) {
    list.innerHTML = '';
  }

  document.addEventListener('click', guardGuideEndpointClick, true);

  document.addEventListener('click', async event => {
    if (event.guideEndpointBlocked) return;
    const backButton = event.target.closest('[data-back]');
    if (backButton) {
      event.preventDefault();
      goBack();
      return;
    }
    const hallTabButton = event.target.closest('[data-hall-tab]');
    if (hallTabButton) {
      event.preventDefault();
      guideState.hallTab = hallTabButton.dataset.hallTab || 'recommend';
      renderScreen('01', false, { replace: true });
      return;
    }
    const hallCategoryButton = event.target.closest('[data-hall-category]');
    if (hallCategoryButton) {
      event.preventDefault();
      guideState.hallCategory = hallCategoryButton.dataset.hallCategory || '全部';
      renderScreen('01', false, { replace: true });
      return;
    }
    const homeCategoryButton = event.target.closest('[data-guide-home-category]');
    if (homeCategoryButton) {
      event.preventDefault();
      const scrollTop = document.querySelector('#phone .screen-scroll')?.scrollTop || 0;
      guideState.homeCategory = homeCategoryButton.dataset.guideHomeCategory || '全部';
      guideState.homeRecommendOffset = 0;
      renderScreen('14', false, { replace: true, skipApiHydrate: true, restoreScrollTop: scrollTop });
      return;
    }
    const guideNoticeFilterButton = event.target.closest('[data-guide-notice-filter]');
    if (guideNoticeFilterButton) {
      event.preventDefault();
      const tabs = ['全部', '公告', '规则', '安全'];
      const nextFilter = guideNoticeFilterButton.dataset.guideNoticeFilter || '全部';
      guideState.guideNoticeFilter = tabs.includes(nextFilter) ? nextFilter : '全部';
      renderScreen('31', false, { replace: true, skipApiHydrate: true });
      return;
    }
    const orderMessageFilterButton = event.target.closest('[data-guide-order-message-filter]');
    if (orderMessageFilterButton) {
      event.preventDefault();
      const tabs = ['全部', '待处理', '已处理'];
      const nextFilter = orderMessageFilterButton.dataset.guideOrderMessageFilter || '全部';
      guideState.orderMessageFilter = tabs.includes(nextFilter) ? nextFilter : '全部';
      renderScreen('32', false, { replace: true, skipApiHydrate: true });
      return;
    }
    const guideMessageRefreshButton = event.target.closest('[data-guide-message-refresh]');
    if (guideMessageRefreshButton) {
      event.preventDefault();
      await refreshGuideMessagesCenter(guideMessageRefreshButton);
      return;
    }
    const guideMessageReadAllButton = event.target.closest('[data-guide-message-read-all]');
    if (guideMessageReadAllButton) {
      event.preventDefault();
      await markGuideMessagesReadAll(guideMessageReadAllButton);
      return;
    }
    const guideMessageReadButton = event.target.closest('[data-guide-message-read]');
    if (guideMessageReadButton) {
      event.preventDefault();
      await markGuideMessageRead(guideMessageReadButton);
      return;
    }
    const guideMineRefreshButton = event.target.closest('[data-guide-mine-refresh]');
    if (guideMineRefreshButton) {
      event.preventDefault();
      await refreshGuideMine(guideMineRefreshButton);
      return;
    }
    const guideRadiusButton = event.target.closest('[data-guide-radius]');
    if (guideRadiusButton) {
      event.preventDefault();
      guideState.serviceAreaRadius = guideRadiusButton.dataset.guideRadius || '3km';
      renderScreen('24', false, { replace: true, skipApiHydrate: true });
      writeActionStatus(document.querySelector('.guide-area-map-card') || guideRadiusButton, `当前接单半径：${guideState.serviceAreaRadius}`);
      return;
    }
    const guideAreaButton = event.target.closest('[data-guide-area]');
    if (guideAreaButton) {
      event.preventDefault();
      const area = guideAreaButton.dataset.guideArea || '';
      const selected = guideState.serviceAreas.includes(area);
      guideState.serviceAreas = selected
        ? guideState.serviceAreas.filter(item => item !== area)
        : [...guideState.serviceAreas, area];
      renderScreen('24', false, { replace: true, skipApiHydrate: true });
      writeActionStatus(document.querySelector('.guide-area-list') || guideAreaButton, `${area}：${selected ? '未选择' : '已选中'}，当前服务片区 ${guideState.serviceAreas.length} 个`);
      return;
    }
    const guideServiceTypeButton = event.target.closest('[data-guide-service-type]');
    if (guideServiceTypeButton) {
      event.preventDefault();
      const serviceType = guideServiceTypeButton.dataset.guideServiceType || '';
      const selectedTypes = guideSelectedServiceTypes();
      const selected = selectedTypes.includes(serviceType);
      if (selected && selectedTypes.length <= 1) {
        writeActionStatus(document.querySelector('.guide-service-type-list') || guideServiceTypeButton, '至少保留 1 个可接服务类型');
        showToast('至少保留 1 个可接服务类型');
        return;
      }
      guideState.serviceTypes = selected
        ? selectedTypes.filter(item => item !== serviceType)
        : [...selectedTypes, serviceType];
      if (guideState.dashboard?.guide) {
        guideState.dashboard = {
          ...guideState.dashboard,
          guide: { ...guideState.dashboard.guide, serviceTypes: [...guideState.serviceTypes] }
        };
      }
      renderScreen('25', false, { replace: true, skipApiHydrate: true });
      writeActionStatus(document.querySelector('.guide-service-type-list') || guideServiceTypeButton, `${serviceType}${selected ? '已关闭' : '已开启'}，当前可接 ${guideState.serviceTypes.length} 类服务`);
      return;
    }
    const fixedScheduleButton = event.target.closest('[data-guide-fixed-schedule]');
    if (fixedScheduleButton) {
      event.preventDefault();
      guideState.fixedScheduleEnabled = !guideState.fixedScheduleEnabled;
      renderScreen('36', false, { replace: true, skipApiHydrate: true });
      writeActionStatus(document.querySelector('.guide-schedule-fixed') || fixedScheduleButton, `固定排班${guideState.fixedScheduleEnabled ? '开启' : '关闭'}，${guideState.fixedScheduleEnabled ? '工作日自动上线' : '不再自动上线'}`);
      return;
    }
    const guideSettingsRefreshButton = event.target.closest('[data-guide-settings-refresh]');
    if (guideSettingsRefreshButton) {
      event.preventDefault();
      await refreshGuideSettings(guideSettingsRefreshButton);
      return;
    }
    const guideSettingsLogoutButton = event.target.closest('[data-guide-settings-logout]');
    if (guideSettingsLogoutButton) {
      event.preventDefault();
      await logoutGuideSession(guideSettingsLogoutButton);
      return;
    }
    const settingsToggle = event.target.closest('[data-guide-settings-toggle]');
    if (settingsToggle) {
      event.preventDefault();
      if (screens[currentIndex]?.id === '41') await updateGuideSetting(settingsToggle);
      else {
        const key = settingsToggle.dataset.guideSettingsToggle;
        if (key && Object.prototype.hasOwnProperty.call(guideState, key)) {
          guideState[key] = !guideState[key];
          const screenId = screens[currentIndex]?.id || '39';
          renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
          const label = settingsToggle.querySelector('strong')?.textContent?.trim() || '设置项';
          writeActionStatus(document.querySelector('.menu-list, .screen-scroll') || settingsToggle, `${label}${guideState[key] ? '已开启' : '已关闭'}`);
        }
      }
      return;
    }
    const reminderMethodButton = event.target.closest('[data-guide-reminder-method]');
    if (reminderMethodButton) {
      event.preventDefault();
      const key = reminderMethodButton.dataset.guideReminderMethod;
      guideState.reminderMethods[key] = !guideState.reminderMethods[key];
      renderScreen('26', false, { replace: true, skipApiHydrate: true });
      const label = reminderMethodButton.querySelector('strong')?.textContent?.trim() || '提醒方式';
      writeActionStatus(document.querySelector('.screen-scroll') || reminderMethodButton, `${label}${guideState.reminderMethods[key] ? '已开启' : '已关闭'}`);
      return;
    }
    const reminderEventButton = event.target.closest('[data-guide-reminder-event]');
    if (reminderEventButton) {
      event.preventDefault();
      const key = reminderEventButton.dataset.guideReminderEvent;
      guideState.reminderEvents[key] = !guideState.reminderEvents[key];
      renderScreen('26', false, { replace: true, skipApiHydrate: true });
      const label = reminderEventButton.querySelector('strong')?.textContent?.trim() || '提醒事件';
      writeActionStatus(document.querySelector('.screen-scroll') || reminderEventButton, `${label}${guideState.reminderEvents[key] ? '已开启' : '已关闭'}`);
      return;
    }
    const avatarChangeButton = event.target.closest('[data-guide-avatar-change]');
    if (avatarChangeButton) {
      event.preventDefault();
      const input = document.querySelector('[data-guide-avatar-input]');
      if (input) input.click();
      return;
    }
    const profileRefreshButton = event.target.closest('[data-guide-profile-refresh]');
    if (profileRefreshButton) {
      event.preventDefault();
      await refreshGuideProfile(profileRefreshButton);
      return;
    }
    const profileCertSubmitButton = event.target.closest('[data-guide-profile-cert-submit]');
    if (profileCertSubmitButton) {
      event.preventDefault();
      await submitGuideProfileCertification(profileCertSubmitButton);
      return;
    }
    const profileCertButton = event.target.closest('[data-guide-profile-cert]');
    if (profileCertButton) {
      event.preventDefault();
      const type = profileCertButton.dataset.guideProfileCert || '';
      guideState.profileCertDetail = guideState.profileCertDetail === type ? '' : type;
      renderScreen('40', false, { replace: true, skipApiHydrate: true });
      document.querySelector(`[data-guide-profile-cert-panel="${type}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return;
    }
    const profileIntroEditButton = event.target.closest('[data-guide-profile-intro-edit]');
    if (profileIntroEditButton) {
      event.preventDefault();
      guideState.profileIntroEditing = true;
      guideState.profileIntroDraft = guideProfileData().intro;
      renderScreen('40', false, { replace: true, skipApiHydrate: true });
      document.querySelector('[data-guide-profile-intro-field]')?.focus();
      return;
    }
    const profileIntroCancelButton = event.target.closest('[data-guide-profile-intro-cancel]');
    if (profileIntroCancelButton) {
      event.preventDefault();
      guideState.profileIntroEditing = false;
      guideState.profileIntroDraft = '';
      renderScreen('40', false, { replace: true, skipApiHydrate: true });
      return;
    }
    const profileIntroSaveButton = event.target.closest('[data-guide-profile-intro-save]');
    if (profileIntroSaveButton) {
      event.preventDefault();
      await saveGuideProfileIntro(profileIntroSaveButton);
      return;
    }
    const profileSaveButton = event.target.closest('[data-action="保存资料"]');
    if (profileSaveButton) {
      event.preventDefault();
      await saveGuideProfile(profileSaveButton);
      return;
    }
    const guideFunctionRefreshButton = event.target.closest('[data-guide-function-refresh]');
    if (guideFunctionRefreshButton) {
      event.preventDefault();
      await loadGuideFunctionOverview({ force: true });
      writeActionStatus(guideFunctionRefreshButton, '向导端功能总览已同步');
      return;
    }
    const guideStatusFlowRefreshButton = event.target.closest('[data-guide-status-flow-refresh]');
    if (guideStatusFlowRefreshButton) {
      event.preventDefault();
      await loadGuideOrderStatusFlow({ force: true });
      writeActionStatus(guideStatusFlowRefreshButton, '向导订单状态流已同步最新契约');
      return;
    }
    const guideExceptionTypeButton = event.target.closest('[data-guide-exception-type]');
    if (guideExceptionTypeButton) {
      event.preventDefault();
      toggleGuideExceptionType(guideExceptionTypeButton);
      return;
    }
    const guideExceptionSubmitButton = event.target.closest('[data-guide-exception-submit]');
    if (guideExceptionSubmitButton) {
      event.preventDefault();
      await submitGuideException(guideExceptionSubmitButton);
      return;
    }
    const guideExceptionSuccessCloseButton = event.target.closest('[data-guide-exception-success-close]');
    if (guideExceptionSuccessCloseButton) {
      event.preventDefault();
      closeGuideExceptionSuccessModal();
      return;
    }
    const guideSafeExceptionSubmitButton = event.target.closest('[data-guide-safe-exception-submit]');
    if (guideSafeExceptionSubmitButton) {
      event.preventDefault();
      await submitGuideSafetyException(guideSafeExceptionSubmitButton);
      return;
    }
    const guideSafetySuccessCloseButton = event.target.closest('[data-guide-safety-success-close]');
    if (guideSafetySuccessCloseButton) {
      event.preventDefault();
      closeGuideSafetySuccessModal();
      return;
    }
    const guideCancelReasonButton = event.target.closest('[data-guide-cancel-reason]');
    if (guideCancelReasonButton) {
      event.preventDefault();
      const nextReason = guideCancelReasonButton.dataset.guideCancelReason || '时间无法履约';
      guideState.cancelReason = GUIDE_CANCEL_REASONS.includes(nextReason) ? nextReason : '时间无法履约';
      guideState.cancelError = '';
      const scrollTop = document.querySelector('#phone .screen-scroll')?.scrollTop || 0;
      renderScreen('28', false, { replace: true, skipApiHydrate: true, restoreScrollTop: scrollTop });
      return;
    }
    const guideCancelSubmitButton = event.target.closest('[data-guide-cancel-submit]');
    if (guideCancelSubmitButton) {
      event.preventDefault();
      await submitGuideCancelRequest(guideCancelSubmitButton);
      return;
    }
    const guideReviewReplySubmitButton = event.target.closest('[data-guide-review-reply-submit]');
    if (guideReviewReplySubmitButton) {
      event.preventDefault();
      submitGuideReviewReply(guideReviewReplySubmitButton);
      return;
    }
    const guideAcceptButton = event.target.closest('[data-guide-accept-order]');
    if (guideAcceptButton) {
      event.preventDefault();
      event.stopPropagation();
      await acceptGuideRecommendedOrder(guideAcceptButton);
      return;
    }
    const guideCompleteCurrentServiceButton = event.target.closest('[data-guide-complete-current-service]');
    if (guideCompleteCurrentServiceButton) {
      event.preventDefault();
      event.stopPropagation();
      await completeGuideActiveService(guideCompleteCurrentServiceButton);
      return;
    }
    const guideCompleteProofDeleteButton = event.target.closest('[data-guide-proof-delete]');
    if (guideCompleteProofDeleteButton) {
      event.preventDefault();
      event.stopPropagation();
      deleteGuideCompleteProof(guideCompleteProofDeleteButton);
      return;
    }
    const openButton = event.target.closest('[data-open]');
    if (openButton) {
      event.preventDefault();
      const nextId = normalizeGuideScreenId(openButton.dataset.open);
      if (!nextId) {
        writeActionStatus(openButton, '向导端导航目标无效，已拦截跨端跳转');
        showToast('向导端导航目标无效');
        return;
      }
      try {
        const handled = await window.YunlvBusiness?.onRoute?.({
          role: 'guide',
          route: screens[currentIndex]?.id || '01',
          to: nextId,
          button: openButton,
          showToast,
          writeActionStatus,
        });
        if (handled) return;
      } catch (error) {
        const message = guideFriendlyStatusMessage(error.message);
        writeActionStatus(openButton, message);
        showToast(message);
        return;
      }
      if (nextId === screens[currentIndex]?.id && refreshGuideCurrentScreen(openButton, nextId)) return;
      if (nextId === '43') guideState.protocolType = '服务规范';
      setScreen(nextId);
      return;
    }
    const stepButton = event.target.closest('[data-step]');
    if (stepButton) {
      const step = Number(stepButton.dataset.step);
      setScreen(screens[(currentIndex + step + screens.length) % screens.length].id, { record: false });
      return;
    }
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      event.preventDefault();
      handleAction(actionButton).catch(error => {
        const message = guideFriendlyStatusMessage(error.message);
        writeActionStatus(actionButton, message);
        showToast(message);
      });
    }
  });

  document.addEventListener('submit', event => {
    const scanForm = event.target.closest('[data-guide-scan-form]');
    if (!scanForm) return;
    event.preventDefault();
    const code = String(new FormData(scanForm).get('code') || '').trim();
    guideState.manualScanCode = code;
    guideState.scanResult = code ? `核验成功：${code}` : '请输入核验编码';
    if (code) setScreen('46');
    else renderScreen('45', false, { replace: true, skipApiHydrate: true });
  });

  document.addEventListener('input', event => {
    const feedbackDescription = event.target.closest('[data-guide-feedback-description]');
    if (feedbackDescription) {
      guideState.feedbackDescription = feedbackDescription.value.slice(0, 300);
      const counter = feedbackDescription.closest('.guide-feedback-card')?.querySelector('[data-guide-feedback-count]');
      if (counter) counter.textContent = `${guideState.feedbackDescription.length}/300`;
      return;
    }
    const feedbackContact = event.target.closest('[data-guide-feedback-contact]');
    if (feedbackContact) {
      const key = feedbackContact.dataset.guideFeedbackContact;
      if (key && Object.prototype.hasOwnProperty.call(guideState.feedbackContact, key)) {
        guideState.feedbackContact[key] = feedbackContact.value.trim();
        if (key === 'phone') guideProfile.phone = guideState.feedbackContact[key];
      }
      return;
    }
    const profileField = event.target.closest('[data-guide-profile-field]');
    if (profileField) {
      const key = profileField.dataset.guideProfileField;
      if (key && Object.prototype.hasOwnProperty.call(guideProfile, key) && !profileField.readOnly) {
        guideProfile[key] = profileField.value;
      }
      return;
    }
    const profileIntroField = event.target.closest('[data-guide-profile-intro-field]');
    if (profileIntroField) {
      guideState.profileIntroDraft = profileIntroField.value.slice(0, 160);
      const counter = profileIntroField.closest('.guide-profile-intro-editor')?.querySelector('small');
      if (counter) counter.textContent = `${guideState.profileIntroDraft.length}/160`;
      return;
    }
    const cancelDescription = event.target.closest('[data-guide-cancel-description]');
    if (cancelDescription) {
      guideState.cancelDescription = cancelDescription.value.slice(0, 200);
      guideState.cancelError = '';
      const counter = cancelDescription.closest('.guide-cancel-desc')?.querySelector('[data-guide-cancel-count]');
      if (counter) counter.textContent = `${guideState.cancelDescription.length}/200`;
      return;
    }
    const reviewReplyInput = event.target.closest('[data-guide-review-reply-input]');
    if (reviewReplyInput) {
      guideState.reviewReplyDraft = reviewReplyInput.value.slice(0, 100);
      const wrapper = reviewReplyInput.closest('.guide-review-reply');
      const counter = wrapper?.querySelector('[data-guide-review-reply-count]');
      const submit = wrapper?.querySelector('[data-guide-review-reply-submit]');
      if (counter) counter.textContent = `${guideState.reviewReplyDraft.length}/100`;
      if (submit) submit.disabled = guideState.reviewReplyDraft.trim().length < 2;
      return;
    }
  });

  document.addEventListener('change', event => {
    const avatarInput = event.target.closest('[data-guide-avatar-input]');
    if (avatarInput) {
      handleGuideAvatarChange(avatarInput).catch(error => {
        writeActionStatus(avatarInput.closest('.guide-profile-head') || document.getElementById('phone'), guideFriendlyStatusMessage(error.message, '头像处理失败，请重新选择'));
      }).finally(() => {
        avatarInput.value = '';
      });
      return;
    }
    const profileCertUpload = event.target.closest('[data-guide-profile-cert-upload]');
    if (profileCertUpload) {
      const type = profileCertUpload.dataset.guideProfileCertUpload || '';
      const file = profileCertUpload.files?.[0];
      if (type && file) {
        guideState.profileCertFiles[type] = file.name;
        guideState.profileCertDetail = type;
        renderScreen('40', false, { replace: true, skipApiHydrate: true });
        const detail = guideProfileCertDetail(type);
        writeActionStatus(
          document.querySelector(`[data-guide-profile-cert-panel="${type}"]`) || document.querySelector('.guide-profile-card') || profileCertUpload,
          `${detail?.title || '认证材料'}已选择：${file.name}`
        );
      }
      profileCertUpload.value = '';
      return;
    }
    const feedbackScreenshot = event.target.closest('[data-guide-feedback-screenshot]');
    if (feedbackScreenshot) {
      handleGuideFeedbackScreenshot(feedbackScreenshot).catch(error => {
        const message = guideFriendlyStatusMessage(error.message, '截图处理失败，请重新选择');
        writeActionStatus(feedbackScreenshot.closest('.guide-feedback-upload') || feedbackScreenshot, message);
        showToast(message);
      });
      feedbackScreenshot.value = '';
      return;
    }
    const profileField = event.target.closest('[data-guide-profile-field]');
    if (profileField) {
      const key = profileField.dataset.guideProfileField;
      if (key && Object.prototype.hasOwnProperty.call(guideProfile, key)) {
        guideProfile[key] = profileField.value;
        writeActionStatus(profileField.closest('.guide-profile-card') || profileField, `${profileField.closest('.guide-profile-row')?.querySelector('b')?.textContent || '资料'}已更新`);
      }
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') setScreen(screens[(currentIndex + 1) % screens.length].id, { record: false });
    if (event.key === 'ArrowLeft') setScreen(screens[(currentIndex - 1 + screens.length) % screens.length].id, { record: false });
  });

  window.addEventListener('hashchange', () => {
    const id = normalizeGuideScreenId(location.hash);
    if (id) {
      renderScreen(id, false);
      return;
    }
    if (location.hash) {
      history.replaceState(null, '', '#14');
      showToast('向导端导航目标无效');
    }
  });

  const initial = normalizeGuideScreenId(location.hash) || '14';
  if (initial === '14' && location.hash && !normalizeGuideScreenId(location.hash)) {
    history.replaceState(null, '', '#14');
  }
  renderScreen(initial, false);
}

function setScreen(id, options = {}) {
  const targetExists = screens.some(screen => screen.id === id);
  if (!targetExists) return;
  const currentScreen = screens[currentIndex];
  if (options.record !== false && currentScreen?.id && currentScreen.id !== id) {
    const last = navigationStack[navigationStack.length - 1];
    if (last !== currentScreen.id) navigationStack.push(currentScreen.id);
    if (navigationStack.length > 40) navigationStack = navigationStack.slice(-40);
  }
  renderScreen(id, true, options);
}

function refreshGuideCurrentScreen(source, id = screens[currentIndex]?.id) {
  const currentId = screens[currentIndex]?.id;
  if (!id || id !== currentId) return false;
  guideRefreshSeq += 1;
  renderScreen(currentId, false, { replace: true });
  const phone = document.getElementById('phone');
  const screen = phone?.querySelector('.app-screen');
  const scroll = phone?.querySelector('.screen-scroll');
  const title = phone?.querySelector('.topbar-title') || scroll || screen;
  screen?.setAttribute('data-guide-refreshed', String(guideRefreshSeq));
  if (scroll) {
    if (typeof scroll.scrollTo === 'function') scroll.scrollTo({ top: 0, behavior: 'smooth' });
    else scroll.scrollTop = 0;
  }
  if (title) {
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  }
  writeActionStatus(scroll || phone || source, '当前页面已刷新并回到顶部');
  return true;
}

function goBack() {
  const currentId = screens[currentIndex]?.id;
  while (navigationStack.length) {
    const target = navigationStack.pop();
    if (target && target !== currentId && screens.some(screen => screen.id === target)) {
      renderScreen(target, true, { replace: true });
      return;
    }
  }
  const fallback = guideBackFallbackScreen(currentId);
  renderScreen(fallback, true, { replace: true });
}

function clearGuideExceptionGenericActions(root = document) {
  root.querySelectorAll?.('[data-guide-exception-type][data-action], [data-guide-exception-submit][data-action], [data-guide-exception-success-close][data-action], [data-guide-safe-exception-submit][data-action], [data-guide-safety-success-close][data-action], [data-guide-cancel-reason][data-action], [data-guide-cancel-submit][data-action], [data-guide-review-reply-submit][data-action]').forEach(button => {
    button.removeAttribute('data-action');
  });
}

function renderScreen(id, updateHash = true, options = {}) {
  const previousScreenId = screens[currentIndex]?.id || '';
  if (previousScreenId === '45' && id !== '45') stopGuideScanCamera();
  const index = screens.findIndex(screen => screen.id === id);
  currentIndex = index >= 0 ? index : 0;
  const screen = screens[currentIndex];
  const restoreScrollTop = Number.isFinite(options.restoreScrollTop) ? Math.max(0, options.restoreScrollTop) : null;
  document.getElementById('phone').innerHTML = screen.render();
  document.getElementById('currentName').textContent = `${screen.id}-${screen.title}`;
  hydratePassiveButtons(document.getElementById('phone'));
  hydrateInteractiveControls(document.getElementById('phone'));
  clearGuideExceptionGenericActions(document.getElementById('phone'));
  window.setTimeout(() => clearGuideExceptionGenericActions(document.getElementById('phone')), 0);
  document.querySelectorAll('.screen-list button').forEach(button => {
    button.classList.toggle('active', button.dataset.open === screen.id);
  });
  if (updateHash) {
    const nextUrl = `#${screen.id}`;
    if (options.replace) {
      history.replaceState({ screen: screen.id }, '', nextUrl);
    } else {
      history.pushState({ screen: screen.id }, '', nextUrl);
    }
  }
  initStatusRuntime();
  syncStatusBar();
  ensureGuideFunctionOverview(screen.id);
  ensureGuideOrderStatusFlow(screen.id);
  hydrateGuideMessages(screen.id);
  if (!options.skipApiHydrate) hydrateGuideApiData(screen.id);
  if (screen.id === '27') {
    window.requestAnimationFrame(() => hydrateRouteNavigation(true));
  }
  if (screen.id === '45') {
    window.requestAnimationFrame(() => startGuideScanCamera());
  }
  if (restoreScrollTop !== null) {
    const restore = () => {
      const scroll = document.querySelector('#phone .screen-scroll');
      if (scroll) scroll.scrollTop = restoreScrollTop;
    };
    restore();
    window.requestAnimationFrame(restore);
  }
}

function applyGuideMessagesCenterData(messageCenter = {}, options = {}) {
  if (!messageCenter || typeof messageCenter !== 'object') return false;
  const signature = JSON.stringify({
    summary: messageCenter.summary || {},
    messages: (messageCenter.messages || []).map(item => [item.id, item.title, item.read, item.category, item.route, item.createdAt])
  });
  guideState.messageCenter = messageCenter;
  guideState.messages = Array.isArray(messageCenter.messages) ? messageCenter.messages : [];
  guideState.messagesError = '';
  guideState.messagesLoading = false;
  const changed = options.force || guideState.messageCenterSignature !== signature;
  guideState.messageCenterSignature = signature;
  return changed;
}

async function hydrateGuideMessagesCenterFromApi(options = {}) {
  await ensureGuideToken();
  const messageCenter = await guideApiRequest('/api/guide/messages?guideId=guide-001');
  return applyGuideMessagesCenterData(messageCenter, options);
}

function hydrateGuideMessages(screenId) {
  if (!['06', '31', '32'].includes(screenId) || guideState.messagesLoading || guideState.messageCenter) return;
  guideState.messagesLoading = true;
  guideState.messagesError = '';
  window.setTimeout(async () => {
    try {
      await hydrateGuideMessagesCenterFromApi();
      if (['06', '31', '32'].includes(screens[currentIndex]?.id)) renderScreen(screens[currentIndex].id, false, { replace: true, skipApiHydrate: true });
    } catch (error) {
      guideState.messages = [];
      guideState.messageCenter = null;
      guideState.messagesError = guideFriendlyStatusMessage(error.message, '消息暂不可用');
      guideState.messagesLoading = false;
      if (['06', '31', '32'].includes(screens[currentIndex]?.id)) renderScreen(screens[currentIndex].id, false, { replace: true, skipApiHydrate: true });
    } finally {
      guideState.messagesLoading = false;
    }
  }, 0);
}

async function refreshGuideMessagesCenter(button) {
  button.disabled = true;
  try {
    guideState.messagesLoading = true;
    await hydrateGuideMessagesCenterFromApi({ force: true });
    const screenId = screens[currentIndex]?.id || '06';
    renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('[data-guide-message-summary], [data-guide-message-list], .screen-scroll') || button, '消息已更新');
  } catch (error) {
    guideState.messagesError = guideFriendlyStatusMessage(error.message, '消息更新失败');
    renderScreen(screens[currentIndex]?.id || '06', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.screen-scroll') || button, guideState.messagesError);
  } finally {
    guideState.messagesLoading = false;
    button.disabled = false;
  }
}

async function markGuideMessagesReadAll(button) {
  button.disabled = true;
  try {
    await ensureGuideToken();
    await guideApiRequest('/api/messages/read-all', { method: 'POST', body: { role: 'guide' } });
    await hydrateGuideMessagesCenterFromApi({ force: true });
    const screenId = screens[currentIndex]?.id || '06';
    renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('[data-guide-message-summary], .screen-scroll') || button, '全部消息已标为已读');
  } catch (error) {
    writeActionStatus(button, guideFriendlyStatusMessage(error.message, '全部已读失败'));
  } finally {
    button.disabled = false;
  }
}

async function markGuideMessageRead(button) {
  const messageId = button.dataset.guideMessageRead || '';
  if (!messageId) return;
  button.disabled = true;
  try {
    await ensureGuideToken();
    await guideApiRequest(`/api/messages/${encodeURIComponent(messageId)}/read`, { method: 'POST', body: { role: 'guide' } });
    await hydrateGuideMessagesCenterFromApi({ force: true });
    const screenId = screens[currentIndex]?.id || '06';
    renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
    const messageRow = Array.from(document.querySelectorAll('[data-guide-message-id]')).find(row => row.dataset.guideMessageId === messageId);
    writeActionStatus(messageRow || document.querySelector('.screen-scroll') || button, '消息已标为已读');
  } catch (error) {
    writeActionStatus(button, guideFriendlyStatusMessage(error.message, '标记已读失败'));
  } finally {
    button.disabled = false;
  }
}

const guideApiHydrateState = {
  loading: false,
  lastDashboardAt: 0,
  signature: ''
};

async function hydrateGuideHallFromApi(options = {}) {
  await ensureGuideToken();
  const hall = await guideApiRequest('/api/guide/hall?guideId=guide-001');
  return applyGuideHallData(hall, options);
}

async function hydrateGuideActiveServiceFromApi(options = {}) {
  await ensureGuideToken();
  const activeService = await guideApiRequest('/api/guide/active-service?guideId=guide-001');
  return applyGuideActiveServiceData(activeService, options);
}

function applyGuideActiveServiceData(activeService = {}, options = {}) {
  if (!activeService || typeof activeService !== 'object') return false;
  const activeSignature = JSON.stringify({
    guide: [activeService.guide?.id, activeService.guide?.realName, activeService.guide?.onlineStatus, activeService.guide?.currentStatus],
    service: activeService.service
      ? [
          activeService.service.orderId,
          activeService.service.taskId,
          activeService.service.status,
          activeService.service.time,
          activeService.service.location,
          activeService.service.note,
        ]
      : null,
    checklist: (activeService.service?.checklist || []).map(item => [item.id, item.title, item.done]),
  });
  const dashboardChanged = applyGuideDashboardData(
    activeService.dashboard || {},
    activeService.stats ? { stats: activeService.stats, provider: activeService.guide } : null,
    activeService.income || null
  );
  guideState.activeService = activeService;
  const activeChanged = options.force || guideState.activeServiceSignature !== activeSignature;
  guideState.activeServiceSignature = activeSignature;
  return Boolean(dashboardChanged || activeChanged);
}

function applyGuideHallData(hall = {}, options = {}) {
  if (!hall || typeof hall !== 'object') return false;
  const hallSignature = JSON.stringify({
    guide: [hall.guide?.id, hall.guide?.realName, hall.guide?.onlineStatus, hall.guide?.currentStatus],
    orders: (hall.orders || []).map(item => [item.orderId, item.taskId, item.taskStatus, item.orderStatus, item.time, item.location]),
    categories: (hall.categories || []).map(item => [item.name || item.category, item.count || item.activeOrderCount]),
    serviceType: hall.serviceType,
  });
  const dashboardChanged = applyGuideDashboardData(
    hall.dashboard || {},
    hall.stats ? { stats: hall.stats, provider: hall.guide } : null,
    hall.income || null
  );
  guideState.hall = hall;
  if (Array.isArray(hall.messages)) {
    guideState.messages = hall.messages;
    guideState.messagesError = '';
    guideState.messagesLoading = false;
  }
  const categoryNames = new Set((hall.categories || []).map(item => item.name || item.category).filter(Boolean));
  if (guideState.hallCategory !== '全部' && !categoryNames.has(guideState.hallCategory)) {
    guideState.hallCategory = '全部';
  }
  const hallChanged = options.force || guideState.hallSignature !== hallSignature;
  guideState.hallSignature = hallSignature;
  return Boolean(dashboardChanged || hallChanged);
}

async function hydrateGuideHomeFromApi(options = {}) {
  await ensureGuideToken();
  const home = await guideApiRequest('/api/guide/home?guideId=guide-001');
  return applyGuideHomeData(home, options);
}

function applyGuideHomeData(home = {}, options = {}) {
  if (!home || typeof home !== 'object') return false;
  const homeSignature = JSON.stringify({
    guide: [home.guide?.id, home.guide?.realName, home.guide?.onlineStatus, home.guide?.currentStatus],
    stats: home.stats,
    currentServices: (home.currentServices || []).map(item => [item.orderId, item.taskId, item.taskStatus, item.time, item.location]),
    recommendedOrders: (home.recommendedOrders || []).map(item => [item.orderId, item.taskId, item.taskStatus, item.time, item.location]),
    notice: [home.notice?.id, home.notice?.title, home.notice?.content, home.notice?.time],
  });
  const dashboardChanged = applyGuideDashboardData(
    home.dashboard || {},
    home.stats ? { stats: home.stats, provider: home.guide } : null,
    home.income || null
  );
  guideState.home = home;
  if (home.functionOverview) {
    guideState.functionOverview.data = home.functionOverview;
    guideState.functionOverview.loaded = true;
    guideState.functionOverview.error = '';
  }
  if (Array.isArray(home.messages)) {
    guideState.messages = home.messages;
    guideState.messagesError = '';
    guideState.messagesLoading = false;
  }
  const homeChanged = options.force || guideState.homeSignature !== homeSignature;
  guideState.homeSignature = homeSignature;
  return Boolean(dashboardChanged || homeChanged);
}

async function hydrateGuideMineFromApi(options = {}) {
  await ensureGuideToken();
  const mine = await guideApiRequest('/api/guide/mine?guideId=guide-001');
  return applyGuideMineData(mine, options);
}

function applyGuideMineData(mine = {}, options = {}) {
  if (!mine || typeof mine !== 'object') return false;
  const mineSignature = JSON.stringify({
    profile: [mine.profile?.id, mine.profile?.name, mine.profile?.status, mine.profile?.onlineStatus, mine.profile?.currentStatus, mine.profile?.area],
    summary: mine.summary || {},
    wallet: mine.wallet || {},
    schedule: mine.schedule || {},
    menuRows: (mine.menuRows || []).map(item => [item.title, item.value, item.open]),
  });
  const dashboardChanged = applyGuideDashboardData(
    mine.dashboard || {},
    mine.stats ? { stats: mine.stats, provider: mine.profile } : null,
    mine.income || null
  );
  guideState.mine = mine;
  guideState.mineError = '';
  guideState.mineLoading = false;
  if (mine.profile) {
    guideProfile.name = mine.profile.name || mine.profile.realName || guideProfile.name;
    guideProfile.role = mine.profile.role || guideProfile.role;
    guideProfile.city = mine.profile.city || guideProfile.city;
    guideProfile.area = mine.profile.area || guideProfile.area;
    applyGuideProfileDraft();
  }
  const mineChanged = options.force || guideState.mineSignature !== mineSignature;
  guideState.mineSignature = mineSignature;
  return Boolean(dashboardChanged || mineChanged);
}

async function refreshGuideMine(button) {
  button.disabled = true;
  guideState.mineLoading = true;
  try {
    await hydrateGuideMineFromApi({ force: true });
    renderScreen('07', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.hero-profile-card') || button, '我的资料已同步');
  } catch (error) {
    guideState.mineError = guideFriendlyStatusMessage(error.message, '我的资料同步失败');
    renderScreen('07', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.hero-profile-card') || button, guideState.mineError);
  } finally {
    guideState.mineLoading = false;
    button.disabled = false;
  }
}

async function hydrateGuideProfileFromApi(options = {}) {
  await ensureGuideToken();
  const profile = await guideApiRequest('/api/guide/profile?guideId=guide-001');
  return applyGuideProfileData(profile, options);
}

function applyGuideProfileData(profileData = {}, options = {}) {
  if (!profileData || typeof profileData !== 'object') return false;
  const profile = profileData.profile || {};
  const signature = JSON.stringify({
    profile: [profile.name, profile.gender, profile.phone, profile.city, profile.area, profile.intro, profile.avatarUrl],
    emergencyContact: profileData.emergencyContact || {},
    certifications: (profileData.certifications || []).map(item => [item.type, item.state, item.fileName, item.updatedAt]),
    updatedAt: profileData.updatedAt || ''
  });
  guideState.profile = profileData;
  guideState.profileError = '';
  guideState.profileLoading = false;
  ['name', 'realName', 'gender', 'phone', 'idCard', 'city', 'area', 'role', 'intro', 'avatarUrl'].forEach(key => {
    if (typeof profile[key] === 'string' && profile[key]) {
      if (key === 'realName') guideProfile.name = profile[key];
      else guideProfile[key] = profile[key];
    }
  });
  if (typeof profile.rating === 'number') guideProfile.rating = profile.rating;
  guideProfile.initial = (guideProfile.name || '').slice(0, 1) || guideProfile.initial;
  persistGuideProfile();
  const changed = options.force || guideState.profileSignature !== signature;
  guideState.profileSignature = signature;
  return changed;
}

async function refreshGuideProfile(button) {
  if (button) button.disabled = true;
  guideState.profileLoading = true;
  try {
    await hydrateGuideProfileFromApi({ force: true });
    renderScreen('40', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-profile-sync') || button || document.getElementById('phone'), '个人资料已同步');
  } catch (error) {
    guideState.profileError = guideFriendlyStatusMessage(error.message, '个人资料同步失败');
    renderScreen('40', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-profile-sync') || button || document.getElementById('phone'), guideState.profileError);
  } finally {
    guideState.profileLoading = false;
    if (button) button.disabled = false;
  }
}

function collectGuideProfileFields(extra = {}) {
  const profile = { ...guideProfileData(), ...extra };
  document.querySelectorAll('[data-guide-profile-field]').forEach(field => {
    const key = field.dataset.guideProfileField;
    if (key && !field.readOnly) profile[key] = String(field.value || '').trim();
  });
  return {
    name: profile.name || '',
    gender: profile.gender || '',
    phone: profile.phone || '',
    city: profile.city || '',
    area: profile.area || '',
    intro: profile.intro || '',
    avatarUrl: profile.avatarUrl || ''
  };
}

async function saveGuideProfile(button) {
  if (button) button.disabled = true;
  guideState.profileSaving = true;
  try {
    const profile = collectGuideProfileFields();
    const result = await guideApiRequest('/api/guide/profile', {
      method: 'PUT',
      body: { guideId: 'guide-001', profile }
    });
    applyGuideProfileData(result, { force: true });
    renderScreen('40', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-profile-card') || button || document.getElementById('phone'), '个人资料已保存');
  } catch (error) {
    guideState.profileError = guideFriendlyStatusMessage(error.message, '个人资料保存失败');
    renderScreen('40', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-profile-card') || button || document.getElementById('phone'), guideState.profileError);
  } finally {
    guideState.profileSaving = false;
    if (button) button.disabled = false;
  }
}

async function saveGuideProfileIntro(button) {
  const field = document.querySelector('[data-guide-profile-intro-field]');
  const nextIntro = String(field?.value || '').trim() || guideProfileData().intro;
  guideState.profileIntroEditing = false;
  guideState.profileIntroDraft = '';
  if (button) button.disabled = true;
  try {
    const result = await guideApiRequest('/api/guide/profile', {
      method: 'PUT',
      body: { guideId: 'guide-001', profile: collectGuideProfileFields({ intro: nextIntro }) }
    });
    applyGuideProfileData(result, { force: true });
    renderScreen('40', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-profile-intro') || button || document.getElementById('phone'), '个人简介已保存');
  } catch (error) {
    guideState.profileError = guideFriendlyStatusMessage(error.message, '个人简介保存失败');
    guideState.profileIntroEditing = true;
    guideState.profileIntroDraft = nextIntro;
    renderScreen('40', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-profile-intro') || button || document.getElementById('phone'), guideState.profileError);
  } finally {
    if (button) button.disabled = false;
  }
}

async function submitGuideProfileCertification(button) {
  const type = button.dataset.guideProfileCertSubmit || guideState.profileCertDetail || '';
  if (!type) return;
  const fileName = guideState.profileCertFiles?.[type] || guideProfileCertRows().find(item => item.type === type)?.fileName || '';
  guideState.profileCertSubmitting = type;
  button.disabled = true;
  try {
    const result = await guideApiRequest('/api/guide/profile/certification', {
      method: 'POST',
      body: { guideId: 'guide-001', type, fileName }
    });
    guideState.profileCertFiles[type] = '';
    applyGuideProfileData(result, { force: true });
    guideState.profileCertDetail = type;
    renderScreen('40', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector(`[data-guide-profile-cert-panel="${type}"]`) || document.querySelector('.guide-profile-card') || button, '认证资料已提交复核');
  } catch (error) {
    guideState.profileError = guideFriendlyStatusMessage(error.message, '认证资料提交失败');
    renderScreen('40', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector(`[data-guide-profile-cert-panel="${type}"]`) || document.querySelector('.guide-profile-card') || button, guideState.profileError);
  } finally {
    guideState.profileCertSubmitting = '';
    button.disabled = false;
  }
}

async function hydrateGuideSettingsFromApi(options = {}) {
  await ensureGuideToken();
  const settings = await guideApiRequest('/api/guide/settings?guideId=guide-001');
  return applyGuideSettingsData(settings, options);
}

function applyGuideSettingsData(settings = {}, options = {}) {
  if (!settings || typeof settings !== 'object') return false;
  const signature = JSON.stringify({
    privacy: settings.settings?.privacy || {},
    notifications: settings.settings?.notifications || {},
    protocolConfirmed: settings.settings?.protocolConfirmed || {},
    updatedAt: settings.updatedAt || settings.settings?.updatedAt || ''
  });
  guideState.settings = settings;
  guideState.settingsError = '';
  guideState.settingsLoading = false;
  const privacy = settings.settings?.privacy || {};
  const notifications = settings.settings?.notifications || {};
  if (typeof privacy.privacyPermission === 'boolean') guideState.privacyPermission = privacy.privacyPermission;
  if (typeof notifications.messageNotification === 'boolean') guideState.messageNotification = notifications.messageNotification;
  ['sound', 'vibration', 'push', 'sms'].forEach(key => {
    if (typeof notifications[key] === 'boolean') guideState.reminderMethods[key] = notifications[key];
  });
  if (typeof notifications.serviceStart === 'boolean') guideState.reminderEvents.serviceStart = notifications.serviceStart;
  if (settings.settings?.protocolConfirmed) {
    guideState.protocolConfirmed = {
      ...guideState.protocolConfirmed,
      ...settings.settings.protocolConfirmed
    };
  }
  const changed = options.force || guideState.settingsSignature !== signature;
  guideState.settingsSignature = signature;
  return changed;
}

async function refreshGuideSettings(button) {
  if (button) button.disabled = true;
  guideState.settingsLoading = true;
  try {
    await hydrateGuideSettingsFromApi({ force: true });
    renderScreen('41', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-settings-summary') || button || document.getElementById('phone'), '设置已同步');
  } catch (error) {
    guideState.settingsError = guideFriendlyStatusMessage(error.message, '设置同步失败');
    renderScreen('41', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-settings-summary') || button || document.getElementById('phone'), guideState.settingsError);
  } finally {
    guideState.settingsLoading = false;
    if (button) button.disabled = false;
  }
}

function guideCurrentSettingValue(group, key) {
  const data = guideSettingsData();
  const source = group === 'privacy' ? data.privacy : data.notifications;
  return Boolean(source?.[key]);
}

async function updateGuideSetting(button) {
  const key = button.dataset.guideSettingsToggle || '';
  const group = button.dataset.guideSettingsGroup || (key === 'privacyPermission' ? 'privacy' : 'notifications');
  const next = !guideCurrentSettingValue(group, key);
  const label = button.querySelector('strong')?.textContent?.trim() || '设置项';
  button.setAttribute('aria-busy', 'true');
  guideState.settingsSavingKey = key;
  try {
    const body = { guideId: 'guide-001' };
    if (group === 'privacy') body.privacy = { [key]: next };
    else body.notifications = { [key]: next };
    const settings = await guideApiRequest('/api/guide/settings', { method: 'PUT', body });
    applyGuideSettingsData(settings, { force: true });
    renderScreen('41', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-settings-summary') || button, `${label}${next ? '已开启' : '已关闭'}`);
  } catch (error) {
    guideState.settingsError = guideFriendlyStatusMessage(error.message, '设置保存失败');
    renderScreen('41', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.guide-settings-summary') || button, guideState.settingsError);
  } finally {
    guideState.settingsSavingKey = '';
    button.removeAttribute('aria-busy');
  }
}

async function confirmGuideProtocolFromApi(protocolTitle) {
  const settings = await guideApiRequest('/api/guide/settings', {
    method: 'PUT',
    body: { guideId: 'guide-001', protocolConfirmed: { [protocolTitle]: true } }
  });
  applyGuideSettingsData(settings, { force: true });
}

async function logoutGuideSession(button) {
  button.disabled = true;
  try {
    const result = await guideApiRequest('/api/guide/session/logout', { method: 'POST', body: { guideId: 'guide-001' } });
    guideState.settingsLogoutResult = result;
    guideState.token = '';
    showToast('已退出登录');
    setScreen('15');
  } catch (error) {
    const message = guideFriendlyStatusMessage(error.message, '退出登录失败');
    writeActionStatus(document.querySelector('.guide-settings-summary') || button, message);
    showToast(message);
  } finally {
    button.disabled = false;
  }
}

function hydrateGuideApiData(screenId) {
  const taskScreens = new Set(['01', '02', '03', '04', '07', '08', '10', '11', '14', '18', '19', '21', '28', '29', '30', '39', '40', '41']);
  if (!taskScreens.has(screenId) || guideApiHydrateState.loading) return;
  const now = Date.now();
  if (!['07', '40', '41'].includes(screenId) && now - guideApiHydrateState.lastDashboardAt < 2500) return;
  guideApiHydrateState.loading = true;
  if (screenId === '07') guideState.mineLoading = true;
  if (screenId === '40') guideState.profileLoading = true;
  if (screenId === '41') guideState.settingsLoading = true;
  window.setTimeout(async () => {
    try {
      let changed = false;
      if (screenId === '14') {
        changed = await hydrateGuideHomeFromApi();
      } else if (screenId === '07') {
        changed = await hydrateGuideMineFromApi();
      } else if (screenId === '40') {
        changed = await hydrateGuideProfileFromApi();
      } else if (screenId === '41') {
        changed = await hydrateGuideSettingsFromApi();
      } else if (screenId === '01') {
        changed = await hydrateGuideHallFromApi();
      } else if (['04', '29'].includes(screenId)) {
        changed = await hydrateGuideActiveServiceFromApi();
      } else {
        await ensureGuideToken();
        const [dashboard, statsPayload, income] = await Promise.all([
          guideApiRequest('/api/guide/dashboard?guideId=guide-001'),
          guideApiRequest('/api/guide/stats?guideId=guide-001'),
          guideApiRequest('/api/guide/income?guideId=guide-001').catch(() => null),
        ]);
        changed = applyGuideDashboardData(dashboard, statsPayload, income);
      }
      guideApiHydrateState.lastDashboardAt = Date.now();
      if (changed && screens[currentIndex]?.id === screenId) {
        renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
      }
    } catch (error) {
      if (screenId === '40') guideState.profileError = guideFriendlyStatusMessage(error.message, '个人资料加载失败');
      const host = document.getElementById('phone');
      if (host && !host.querySelector('[data-guide-api-status]')) {
        const status = document.createElement('p');
        status.className = 'action-status';
        status.dataset.guideApiStatus = '';
        status.textContent = `${screenId === '40' ? '个人资料' : '任务数据'}暂不可用：${guideFriendlyStatusMessage(error.message, '请稍后重试')}`;
        host.appendChild(status);
      }
    } finally {
      guideApiHydrateState.loading = false;
      guideState.mineLoading = false;
      guideState.profileLoading = false;
      guideState.settingsLoading = false;
    }
  }, 0);
}

function applyGuideDashboardData(dashboard = {}, statsPayload = null, income = null) {
  const stats = statsPayload?.stats || dashboard.stats || income?.stats || {};
  const normalizedDashboard = {
    ...dashboard,
    guide: { ...(dashboard.guide || {}), ...(statsPayload?.provider || {}) },
    stats,
  };
  const taskOrders = [
    ...(normalizedDashboard.pendingOrders || []).map(order => ({ order, taskStatus: '待接单' })),
    ...(normalizedDashboard.tasks || []).map(task => ({ order: task.order || task, task, taskStatus: task.status || task.order?.status })),
  ].filter(item => item.order);
  const nextOrders = taskOrders.map(({ order, task, taskStatus }, index) => guideOrderFromApi(order, task, taskStatus, index));
  const signature = JSON.stringify({
    orders: nextOrders.map(item => [item.no, item.service, item.time, item.place, item.status]),
    guide: [normalizedDashboard.guide?.realName, normalizedDashboard.guide?.onlineStatus, normalizedDashboard.guide?.currentStatus],
    stats,
    income: income?.summary,
    messages: (normalizedDashboard.messages || []).map(item => [item.id, item.title, item.read]),
  });
  if (signature === guideApiHydrateState.signature) return false;
  guideApiHydrateState.signature = signature;
  orders.splice(0, orders.length, ...nextOrders);
  if (normalizedDashboard.guide) {
    guideProfile.name = normalizedDashboard.guide.realName || guideProfile.name;
    guideProfile.city = normalizedDashboard.guide.area || guideProfile.city;
    guideProfile.area = normalizedDashboard.guide.area || guideProfile.area;
    applyGuideProfileDraft();
  }
  if (Array.isArray(normalizedDashboard.messages) && normalizedDashboard.messages.length) {
    guideState.messages = normalizedDashboard.messages;
    guideState.messagesError = '';
    guideState.messagesLoading = false;
  }
  guideState.dashboard = normalizedDashboard;
  if (normalizedDashboard.guide) applyGuideOnlineSnapshot(normalizedDashboard.guide);
  guideState.income = income ? { ...income, stats } : { stats };
  return true;
}

function guideOrderFromApi(order, task = null, taskStatus = '', index = 0) {
  const serviceType = order.serviceType || '旅居服务';
  const distance = order.distance || `${Number(1.2 + index * 0.8).toFixed(1)}km`;
  return {
    no: order.orderNo || order.id || task?.taskNo || '',
    orderId: order.id || task?.orderId || '',
    taskId: task?.id || '',
    orderStatus: order.status || '',
    tag: serviceType,
    status: taskStatus || order.status || '待接单',
    color: /护理/.test(serviceType) ? 'purple' : /生活/.test(serviceType) ? 'green' : /就医/.test(serviceType) ? 'orange' : '',
    customer: order.elderName || '旅居用户',
    age: order.elderAge ? `${order.elderAge}岁` : '',
    service: serviceType,
    time: order.time || order.createdAt || '时间待确认',
    place: order.location || '地点待确认',
    content: order.note || '用户需求已进入后台任务池',
    duration: order.duration || '2 小时',
    price: String(order.amount || 0),
    distance,
    publishedAt: (order.createdAt || order.time || '00:00').slice(11, 16),
    avatar: index % 2 ? 'man' : 'elder',
  };
}

function hydratePassiveButtons(root) {
  if (!root) return;
  root.querySelectorAll('button').forEach(button => {
    if (button.dataset.back || button.dataset.open || button.dataset.action || button.dataset.step || button.dataset.go || button.dataset.screen || button.dataset.guideAvatarChange !== undefined || button.dataset.guideProfileRefresh !== undefined || button.dataset.guideProfileCert !== undefined || button.dataset.guideProfileCertSubmit !== undefined || button.dataset.guideProfileIntroEdit !== undefined || button.dataset.guideProfileIntroCancel !== undefined || button.dataset.guideProfileIntroSave !== undefined || button.dataset.guideMineRefresh !== undefined || button.dataset.guideSettingsRefresh !== undefined || button.dataset.guideSettingsLogout !== undefined || button.dataset.guideExceptionType !== undefined || button.dataset.guideExceptionSubmit !== undefined || button.dataset.guideExceptionSuccessClose !== undefined || button.dataset.guideSafeExceptionSubmit !== undefined || button.dataset.guideSafetySuccessClose !== undefined || button.dataset.guideCancelReason !== undefined || button.dataset.guideCancelSubmit !== undefined || button.dataset.guideReviewReplySubmit !== undefined || button.type === 'submit') return;
    const label = (button.getAttribute('aria-label') || button.textContent || inferPassiveAction(button)).trim().replace(/\s+/g, ' ');
    button.dataset.action = label || inferPassiveAction(button);
  });
}

function inferPassiveAction(button) {
  const iconName = button.querySelector('[data-icon]')?.getAttribute('data-icon') || '';
  const iconActions = {
    search: '搜索',
    filter: '筛选',
    bell: '查看消息',
    message: '查看消息',
    phone: '联系客户',
    headset: '联系客服',
    chevronLeft: '返回',
    chevronRight: '查看详情',
    close: '关闭',
    plus: '添加',
    camera: '上传图片',
    mic: '语音输入',
    send: '发送消息',
    refresh: '刷新',
    settings: '设置',
    help: '查看帮助',
    info: '查看说明',
    scan: '扫一扫',
  };
  if (iconActions[iconName]) return iconActions[iconName];
  if (button.classList.contains('back-button')) return '返回';
  if (button.classList.contains('icon-button')) return '查看详情';
  return '查看详情';
}

function hydrateInteractiveControls(root) {
  if (!root) return;
  const selectors = ['.segmented .segment', '.tabs .tab', '.login-tabs > *', '.guide-notice-tabs > *'].join(',');
  root.querySelectorAll(selectors).forEach(node => {
    let control = node;
    if (node.tagName !== 'BUTTON') {
      control = document.createElement('button');
      [...node.attributes].forEach(attr => control.setAttribute(attr.name, attr.value));
      control.innerHTML = node.innerHTML;
      node.replaceWith(control);
    }
    control.type = 'button';
    if (!control.dataset.open && !control.dataset.action && !control.dataset.step && !control.dataset.hallTab && !control.dataset.hallCategory && !control.dataset.guideFunctionRefresh && !control.dataset.guideStatusFlowRefresh && control.dataset.guideOrderMessageFilter === undefined && control.dataset.guideNoticeFilter === undefined && control.dataset.guideExceptionType === undefined && control.dataset.guideExceptionSubmit === undefined && control.dataset.guideExceptionSuccessClose === undefined && control.dataset.guideSafeExceptionSubmit === undefined && control.dataset.guideSafetySuccessClose === undefined && control.dataset.guideCancelReason === undefined && control.dataset.guideCancelSubmit === undefined && control.dataset.guideReviewReplySubmit === undefined) {
      const label = (control.textContent || '筛选').trim().replace(/\s+/g, ' ');
      control.dataset.action = `选择${label}`;
    }
    control.setAttribute('aria-pressed', control.classList.contains('active') ? 'true' : 'false');
  });
}

async function handleAction(actionButton) {
  const actionName = actionButton.dataset.action || actionButton.textContent.trim() || '操作';
  if (isGuideFileUploadAction(actionButton, actionName)) {
    openGuideFilePicker(actionButton, actionName);
    return;
  }
  if (await handleGuideLocalAction(actionButton, actionName)) return;
  try {
    const businessHandled = await window.YunlvBusiness?.handleAction?.({
      role: 'guide',
      route: screens[currentIndex]?.id || '01',
      actionName,
      button: actionButton,
      showToast,
      writeActionStatus,
    });
    if (businessHandled) return;
  } catch (error) {
    const message = guideFriendlyStatusMessage(error.message);
    writeActionStatus(actionButton, message);
    showToast(message);
    return;
  }
  applyActionState(actionButton, actionName);
}

function isGuideFileUploadAction(button, actionName) {
  const actionText = cleanActionLabel(actionName);
  const fullText = `${actionText} ${button.textContent || ''} ${button.className || ''}`.replace(/\s+/g, ' ');
  if (/查看|预览|编辑|删除|移除|保存|取消|选择|设为|关闭|下一步|上一步|提交/.test(actionText) && !/上传|重传|重新上传|补充|截图|附件/.test(actionText)) {
    return false;
  }
  if (/上传|重传|重新上传|补充.*(照片|图片|凭证|附件|资质|证件|身份证|证明|材料|文件)|截图|附件/.test(actionText)) {
    return true;
  }
  const uploadClass = /(^|\s)(guide-apply-avatar|guide-doc-card|guide-proof-upload|guide-feedback-upload|upload-tile|upload-proof)(\s|$)/.test(button.className || '');
  const uploadArea = button.closest('.guide-doc-grid, .guide-complete-proof, .guide-feedback-upload, .upload-grid, .guide-cancel-proof');
  return Boolean((uploadClass || uploadArea) && /照片|图片|截图|凭证|附件|资质|证件|身份证|证明|材料|文件|头像/.test(fullText));
}

function guideUploadAccept(actionName) {
  if (/头像|照片|图片|截图|相册/.test(actionName) && !/证件|身份证|资质|证明|凭证|附件|文件|材料/.test(actionName)) {
    return 'image/*';
  }
  return 'image/*,.pdf';
}

function openGuideFilePicker(button, actionName) {
  const cleanName = cleanActionLabel(actionName);
  const scope = button.closest('.card, .section, article, .floating-footer') || document.querySelector('#phone .screen-scroll') || document.getElementById('phone');
  if (button._guideUploadInput?.isConnected) button._guideUploadInput.remove();
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = guideUploadAccept(cleanName);
  input.multiple = /照片|图片|截图|凭证|附件|材料|完成|取消/.test(cleanName);
  if (/拍照|相机/.test(cleanName)) input.setAttribute('capture', 'environment');
  input.dataset.guideUploadInput = '';
  input.setAttribute('aria-hidden', 'true');
  input.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;opacity:0;pointer-events:none;';
  input.addEventListener('change', () => {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const summary = files.length === 1 ? files[0].name : `${files.length} 个文件`;
    button.classList.remove('is-uploading');
    button.classList.add('is-done');
    button.dataset.uploadState = 'selected';
    button.dataset.state = `已选择${summary}`;
    writeActionStatus(button, `已选择${summary}，可继续保存或提交`);
  });
  scope?.appendChild(input);
  button._guideUploadInput = input;
  button.classList.add('is-uploading', 'is-done');
  button.dataset.uploadState = 'picker-opened';
  button.dataset.state = '文件选择器已唤起';
  writeActionStatus(button, `正在打开文件选择器：${cleanName}`);
  input.click();
  return input;
}

function deleteGuideCompleteProof(button) {
  const index = Number(button.dataset.guideProofDelete);
  if (!Number.isInteger(index) || index < 0 || index >= guideState.completeProofPhotos.length) return false;
  const scrollTop = document.querySelector('#phone .screen-scroll')?.scrollTop || 0;
  guideState.completeProofPhotos = guideState.completeProofPhotos.filter((_, itemIndex) => itemIndex !== index);
  renderScreen('29', false, { replace: true, skipApiHydrate: true, restoreScrollTop: scrollTop });
  return true;
}

async function refreshGuideDashboardData() {
  await ensureGuideToken();
  const guideId = guideState.dashboard?.guide?.id || 'guide-001';
  const [dashboard, statsPayload, income] = await Promise.all([
    guideApiRequest(`/api/guide/dashboard?guideId=${encodeURIComponent(guideId)}`),
    guideApiRequest(`/api/guide/stats?guideId=${encodeURIComponent(guideId)}`),
    guideApiRequest(`/api/guide/income?guideId=${encodeURIComponent(guideId)}`).catch(() => null),
  ]);
  applyGuideDashboardData(dashboard, statsPayload, income);
  return guideState.dashboard;
}

async function submitGuideCancelRequest(button) {
  const descriptionField = document.querySelector('[data-guide-cancel-description]');
  const description = String(descriptionField?.value || guideState.cancelDescription || '').trim().slice(0, 200);
  const reason = GUIDE_CANCEL_REASONS.includes(guideState.cancelReason) ? guideState.cancelReason : '时间无法履约';
  const scope = document.querySelector('.guide-cancel-actions') || button;
  guideState.cancelDescription = description;
  guideState.cancelError = '';

  if (description.length < 6) {
    guideState.cancelError = '请至少填写 6 个字的取消说明';
    renderScreen('28', false, { replace: true, skipApiHydrate: true });
    return;
  }

  guideState.cancelSubmitting = true;
  renderScreen('28', false, { replace: true, skipApiHydrate: true });
  try {
    await refreshGuideDashboardData();
    const task = guideCancelableTask();
    if (!task) throw new Error('暂无已接单或服务中任务，不能提交取消申请');
    const cancelReason = `${reason}：${description}`;
    const result = await guideApiRequest(`/api/guide/tasks/${encodeURIComponent(task.id)}/cancel`, {
      method: 'POST',
      body: {
        guideId: guideState.dashboard?.guide?.id || 'guide-001',
        reason: cancelReason
      }
    });
    const order = result.order || task.order || guideCancelableOrder(task) || {};
    guideState.cancelResult = {
      taskNo: result.task?.taskNo || task.taskNo || task.id,
      orderNo: order.orderNo || order.id || '',
      customer: order.elderName || order.customer || '旅居用户',
      service: order.serviceType || order.service || '陪伴就医',
      time: order.time || task.time || '时间待确认',
      reason,
      description: cancelReason
    };
    guideState.cancelError = '';
    guideState.cancelSubmitting = false;
    guideApiHydrateState.signature = '';
    guideApiHydrateState.lastDashboardAt = 0;
    await refreshGuideDashboardData();
    setScreen('12');
  } catch (error) {
    guideState.cancelSubmitting = false;
    guideState.cancelError = `取消申请提交失败：${guideFriendlyStatusMessage(error.message, '请稍后重试')}`;
    renderScreen('28', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(scope, guideState.cancelError);
  }
}

function toggleGuideRouteLayer(button) {
  guideRouteSatelliteVisible = !guideRouteSatelliteVisible;
  const label = guideRouteSatelliteVisible ? '当前地图图层：卫星' : '当前地图图层：标准';
  const map = document.querySelector('.route-map');
  const status = document.querySelector('[data-guide-route-status]');
  map?.classList.toggle('satellite-layer', guideRouteSatelliteVisible);
  button.classList.toggle('active', guideRouteSatelliteVisible);
  button.setAttribute('aria-pressed', guideRouteSatelliteVisible ? 'true' : 'false');
  button.dataset.layer = guideRouteSatelliteVisible ? 'satellite' : 'standard';
  const text = button.querySelector('span');
  if (text) text.textContent = guideRouteSatelliteVisible ? '卫星' : '图层';
  if (guideRouteMap && window.AMap) {
    if (!guideRouteSatellite) guideRouteSatellite = new window.AMap.TileLayer.Satellite();
    if (guideRouteSatelliteVisible) guideRouteMap.add(guideRouteSatellite);
    else guideRouteMap.remove(guideRouteSatellite);
  }
  if (status) status.textContent = label;
  writeActionStatus(document.querySelector('.route-sheet') || button, label);
  return true;
}

async function handleGuideLocalAction(button, actionName) {
  const screenId = screens[currentIndex]?.id || '';
  if (screenId === '01' && actionName === '刷新接单大厅') {
    await refreshGuideHallOrders(button);
    return true;
  }
  if (['04', '29'].includes(screenId) && actionName === '刷新服务中订单') {
    await refreshGuideActiveService(button);
    return true;
  }
  if (screenId === '03' && actionName.startsWith('订单状态：')) {
    const nextFilter = actionName.replace('订单状态：', '').trim() || '全部';
    guideState.myOrderFilter = nextFilter;
    guideState.myOrderFilterSeq += 1;
    button.dataset.filterApplied = `${nextFilter}-${guideState.myOrderFilterSeq}`;
    renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
    return true;
  }
  if (screenId === '09') {
    const filterMap = [
      ['筛选类型：', 'type'],
      ['距离范围：', 'distance'],
      ['服务时间：', 'time'],
      ['排序方式：', 'sort']
    ];
    const matchedFilter = filterMap.find(([prefix]) => actionName.startsWith(prefix));
    if (matchedFilter) {
      const [prefix, key] = matchedFilter;
      guideState.orderFilter[key] = actionName.replace(prefix, '').trim();
      guideState.orderFilter.seq += 1;
      button.dataset.filterApplied = `${key}-${guideState.orderFilter[key]}-${guideState.orderFilter.seq}`;
      renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
      return true;
    }
    if (actionName === '清空筛选条件') {
      guideState.orderFilter = { type: '全部', distance: '不限', time: '本周', sort: '距离优先', seq: guideState.orderFilter.seq + 1 };
      renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
      return true;
    }
  }
  if (screenId === '35') {
    if (actionName === '一键报警') {
      await openGuideAlarmFlow(button);
      return true;
    }
    if (actionName === '异常上报') {
      openGuideExceptionForm(button);
      return true;
    }
    if (actionName === '提交安全异常') {
      await submitGuideSafetyException(button);
      return true;
    }
    if (actionName === '位置共享') {
      await shareGuideSafetyLocation(button);
      return true;
    }
    if (actionName === '平台客服' || actionName === '联系平台客服') {
      guideState.supportChatReplies.push({ text: '我从安全中心进入，需要平台协助当前服务安全问题。', time: new Date().toTimeString().slice(0, 5) });
      setScreen('34');
      return true;
    }
  }
  if (screenId === '14' && actionName === '换一批推荐订单') {
    await refreshGuideHomeRecommendations(button);
    return true;
  }
  if (screenId === '08' && button.closest('[data-guide-online-toggle]')) {
    await toggleGuideOnlineStatus(button);
    return true;
  }
  if (['40', '41'].includes(screenId) && actionName.startsWith('查看协议：')) {
    const protocolType = actionName.replace('查看协议：', '');
    guideState.protocolType = GUIDE_PROTOCOLS[protocolType] ? protocolType : '服务规范';
    setScreen('43');
    return true;
  }
  if (screenId === '43' && actionName.startsWith('确认已阅读')) {
    const protocol = GUIDE_PROTOCOLS[guideState.protocolType] || GUIDE_PROTOCOLS.服务规范;
    try {
      await confirmGuideProtocolFromApi(protocol.title);
    } catch (error) {
      guideState.protocolConfirmed[protocol.title] = true;
      writeActionStatus(document.querySelector('.rules-ref') || button, guideFriendlyStatusMessage(error.message, `${protocol.title}确认已暂存`));
    }
    renderScreen('43', false, { replace: true, skipApiHydrate: true });
    writeActionStatus(document.querySelector('.rules-ref') || button, `${protocol.title}已确认阅读`);
    return true;
  }
  if (screenId === '44') {
    if (actionName.startsWith('选择反馈类型-')) {
      const type = actionName.replace('选择反馈类型-', '');
      guideState.feedbackType = type;
      renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
      writeActionStatus(document.querySelector('.guide-feedback-types') || document.getElementById('phone'), `已选择问题类型：${type}`);
      return true;
    }
    if (actionName === '切换反馈记录' || actionName === '查看反馈记录') {
      guideState.feedbackRecordOpen = !guideState.feedbackRecordOpen;
      renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
      writeActionStatus(document.querySelector('.guide-feedback-records') || document.querySelector('.guide-feedback-types') || document.getElementById('phone'), guideState.feedbackRecordOpen ? '反馈记录已展开' : '反馈记录已收起');
      return true;
    }
    if (actionName === '清空反馈截图') {
      guideState.feedbackScreenshots = [];
      renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
      writeActionStatus(document.querySelector('.guide-feedback-upload') || document.getElementById('phone'), '已清空反馈截图');
      return true;
    }
    if (actionName === '提交意见反馈') {
      await submitGuideFeedback(button);
      return true;
    }
  }
  if (actionName === '发送消息' && ['33', '34'].includes(screenId)) {
    const input = button.closest('.guide-chat-input')?.querySelector('[data-guide-chat-input]');
    const text = String(input?.value || '').trim() || (screenId === '33' ? '李奶奶您好，我已收到您的消息，会按时到达。' : '您好，我需要咨询当前订单处理进度。');
    const reply = { text, time: new Date().toTimeString().slice(0, 5) };
    if (screenId === '33') guideState.customerChatReplies.push(reply);
    else guideState.supportChatReplies.push(reply);
    renderScreen(screenId, false, { replace: true, skipApiHydrate: true });
    showToast('消息已发送');
    writeActionStatus(document.getElementById('phone'), '消息已发送');
    return true;
  }
  if (screenId === '27' && /开始路线导航|刷新路线|定位当前位置|切换地图图层|切换.*路线/.test(actionName)) {
    const map = document.querySelector('.route-map');
    const status = document.querySelector('[data-guide-route-status]');
    if (actionName.includes('步行')) guideRouteMode = 'walk';
    if (actionName.includes('骑行')) guideRouteMode = 'bike';
    if (actionName.includes('驾车')) guideRouteMode = 'car';
    if (actionName.includes('切换') && actionName.includes('路线')) {
      if (status) status.textContent = `正在切换为${amapModeName()}路线...`;
      await hydrateRouteNavigation(true);
      document.querySelectorAll('.route-travel-mode button').forEach(item => {
        item.classList.toggle('active', item.textContent.includes(amapModeName()));
      });
      writeActionStatus(document.querySelector('.route-sheet') || button, `当前路线方式：${amapModeName()}`);
      return true;
    }
    if (actionName.includes('图层')) return toggleGuideRouteLayer(button);
    if (actionName.includes('定位')) {
      if (status) status.textContent = '正在重新获取实时位置...';
      await hydrateRouteNavigation(true);
      const message = guideRouteOrigin.realtime ? '当前位置已更新为实时定位' : '未获得实时定位，已使用默认服务起点';
      if (status) status.textContent = message;
      writeActionStatus(document.querySelector('.route-sheet') || button, message);
      return true;
    }
    if (actionName.includes('刷新')) {
      await hydrateRouteNavigation(true);
      writeActionStatus(document.querySelector('.route-sheet') || button, '高德路线已刷新');
      return true;
    }
    if (map) map.classList.add('is-navigating');
    const start = document.querySelector('.route-start');
    if (start) start.innerHTML = `${icon('navigation')} 正在打开高德`;
    await openGuideRouteNavigation();
    writeActionStatus(document.querySelector('.route-sheet') || button, `正在打开高德地图实时导航：${amapModeName()}路线`);
    return true;
  }
  if (screenId === '24' && actionName === '保存服务区域') {
    const areas = guideState.serviceAreas.length ? guideState.serviceAreas.join('、') : '未选择片区';
    if (guideState.dashboard?.guide) {
      guideState.dashboard = {
        ...guideState.dashboard,
        guide: { ...guideState.dashboard.guide, area: guideServiceAreaSummary() }
      };
    }
    writeActionStatus(document.querySelector('.guide-area-save') || button, `服务区域保存完成：${guideState.serviceAreaRadius}，${areas}`);
    showToast('服务区域保存完成');
    return true;
  }
  if (screenId === '25' && actionName === '保存服务类型') {
    const selectedTypes = guideSelectedServiceTypes();
    if (guideState.dashboard?.guide) {
      guideState.dashboard = {
        ...guideState.dashboard,
        guide: { ...guideState.dashboard.guide, serviceTypes: [...selectedTypes] }
      };
    }
    writeActionStatus(document.querySelector('.guide-service-save') || button, `服务类型保存完成：${selectedTypes.join('、')}`);
    showToast(`已保存 ${selectedTypes.length} 类可接服务`);
    return true;
  }
  if (actionName === '语音输入' && ['33', '34'].includes(screenId)) {
    const input = button.closest('.guide-chat-input')?.querySelector('[data-guide-chat-input]');
    if (input) {
      input.value = screenId === '33' ? '李奶奶您好，我马上到达服务地点。' : '请帮我查询这个订单的处理进度。';
      input.focus();
    }
    writeActionStatus(button, '语音已转文字，请确认后发送');
    return true;
  }
  if (screenId === '45' && /扫描当前画面/.test(actionName)) {
    if (!guideScanStream) {
      await startGuideScanCamera();
      return true;
    }
    guideState.manualScanCode = 'YLW-20240520-0901';
    guideState.scanResult = '已识别客户身份确认码';
    setScreen('46');
    return true;
  }
  if (screenId === '45' && /打开手电筒|关闭手电筒/.test(actionName)) {
    guideState.scanFlashlightOn = !guideState.scanFlashlightOn;
    guideState.scanResult = guideState.scanFlashlightOn ? '手电筒已开启' : '手电筒已关闭';
    renderScreen('45', false, { replace: true, skipApiHydrate: true });
    return true;
  }
  if (screenId === '45' && /手动输入编码/.test(actionName)) {
    guideState.manualScanCode = guideState.manualScanCode || 'YLW-20240520-0901';
    guideState.scanResult = '请输入或核对订单码后点击核验';
    renderScreen('45', false, { replace: true, skipApiHydrate: true });
    return true;
  }
  if (screenId === '45' && /相册/.test(actionName)) {
    guideState.scanResult = '已从相册识别订单服务核验码';
    setScreen('46');
    return true;
  }
  if (button.closest('.guide-date-strip, .guide-date-shortcuts, .guide-schedule-status, .guide-schedule-repeat')) {
    activateChoice(button, (button.textContent || actionName).trim().replace(/\s+/g, ' '));
    return true;
  }
  return false;
}

function applyActionState(button, actionName) {
  const label = (button.textContent || actionName).trim().replace(/\s+/g, ' ') || actionName;
  const choiceFeedback = activateChoice(button, label);
  if (choiceFeedback !== false) return choiceFeedback;
  const switchFeedback = toggleSwitch(button, actionName);
  if (switchFeedback) return switchFeedback;

  if (/获取.*验证码/.test(actionName)) {
    button.disabled = true;
    button.textContent = '60秒后重发';
    return '验证码已发送';
  }

  if (/上传|添加附件|添加更多|添加时段|添加特殊日期/.test(actionName)) {
    const text = /时段/.test(actionName) ? '服务时段已添加' : /附件|图片|凭证/.test(actionName) ? '附件已加入提交清单' : '资料已加入提交清单';
    return text;
  }

  if (/已阅读|遵守|选择|评价标签|服务结果|排序方式|铃声|日期|排班|可接单|休息/.test(actionName)) {
    button.classList.toggle('active');
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    const text = button.classList.contains('active') ? completedActionText(actionName, label) : `已取消：${label}`;
    return text;
  }

  if (/删除|关闭|清空|取消/.test(actionName)) {
    const target = button.closest('figure, .notice, article, .card, .menu-row');
    if (target && !target.classList.contains('phone')) {
      target.classList.add('is-dismissed');
      target.hidden = true;
    } else {
      button.hidden = true;
    }
    return completedActionText(actionName, label);
  }

  if (/保存|提交|确认|完成|联系|拨打|导航|查看|筛选|发送|回复|提现|统计|打开|手动|刷新|下线/.test(actionName)) {
    const text = completedActionText(actionName, label);
    return text;
  }

  const text = genericActionFeedback(actionName, label);
  return text;
}

function activateChoice(button, label) {
  const group = button.closest('.segmented, .tabs, .login-tabs, .guide-notice-tabs, .guide-area-radius-tabs, .guide-area-list, .guide-service-type-list, .guide-date-strip, .guide-date-shortcuts, .guide-schedule-status, .guide-schedule-repeat');
  if (!group) return false;
  const controls = [...group.querySelectorAll('button, [role="button"]')].filter(item => !item.disabled);
  if (controls.length < 2) return false;
  const alreadyActive = button.classList.contains('active') || button.getAttribute('aria-pressed') === 'true';
  controls.forEach(item => {
    item.classList.remove('active', 'is-active');
    item.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  group.dataset.selectedChoice = label;
  group.dataset.choiceSeq = String(Number(group.dataset.choiceSeq || 0) + 1);
  if (alreadyActive) button.dataset.reselectedAt = String(Date.now());
  if (group.closest('.guide-home-recommend')) return '';
  return true;
}

function toggleSwitch(button, actionName) {
  const switchEl = button.classList.contains('switch') || button.classList.contains('guide-switch')
    ? button
    : button.querySelector('.switch, .guide-switch');
  if (!switchEl && !/开启|关闭|开关|提醒/.test(actionName)) return false;
  const target = switchEl || button;
  target.classList.toggle('on');
  target.setAttribute('aria-pressed', target.classList.contains('on') ? 'true' : 'false');
  return true;
}

function completedActionText(actionName, visibleLabel = '') {
  const label = cleanActionLabel(visibleLabel || actionName);
  if (/保存/.test(actionName)) return '已保存';
  if (/提交|回复/.test(actionName)) return /异常/.test(actionName) ? '上报成功' : '已提交';
  if (/确认|完成|已阅读/.test(actionName)) return '已确认';
  if (/联系/.test(actionName)) return /客服/.test(actionName) ? '正在连接平台客服' : '已进入客户联系流程';
  if (/拨打/.test(actionName)) return '正在呼叫联系人';
  if (/导航/.test(actionName)) return '路线已生成';
  if (/筛选/.test(actionName)) return '筛选条件已应用，订单列表按条件展示';
  if (/选择/.test(actionName)) return `当前选择：${label.replace(/^选择/, '')}`;
  if (/查看|统计/.test(actionName)) return `已进入${label.replace(/^查看/, '')}`;
  if (/打开手电筒/.test(actionName)) return '手电筒已开启';
  if (/手动输入/.test(actionName)) return '已进入手动录入模式';
  if (/提现/.test(actionName)) return '提现申请已提交';
  if (/发送/.test(actionName)) return '已发送';
  if (/下线/.test(actionName)) return '已下线休息';
  if (/删除|清空/.test(actionName)) return `${label}已从当前列表移除`;
  if (/取消|关闭/.test(actionName)) return `${label}已关闭，任务状态保持可追踪`;
  return `${label}已同步到当前任务记录`;
}

function genericActionFeedback(actionName, visibleLabel = '') {
  const label = cleanActionLabel(visibleLabel || actionName);
  if (/上一页|下一页/.test(actionName)) return label;
  if (/搜索/.test(actionName)) return '搜索条件已应用，列表按关键词展示';
  if (/编辑|修改|设置/.test(actionName)) return `${label.replace(/^(编辑|修改|设置)/, '')}已进入编辑`;
  if (/更多/.test(actionName)) return `${label}列表已加载更多任务`;
  if (/刷新/.test(actionName)) return '任务列表已重新加载';
  return `${label}已同步到当前任务记录`;
}

function cleanActionLabel(text) {
  return String(text || '操作').trim().replace(/\s+/g, ' ').replace(/[>›]+/g, '').replace(/^当前选择：/, '') || '操作';
}

function shouldSuppressTransientPrompt(text) {
  const value = String(text || '');
  return !value
    || /状态.+已(更新|切换)/.test(value)
    || /路线状态.+同步/.test(value)
    || /操作.+成功/.test(value)
    || /后续.+接入/.test(value)
    || /等待.+真实/.test(value)
    || /已.+打开/.test(value)
    || /^已.+切换为/.test(value)
    || /^当前(选择|筛选|模式|路线)：/.test(value)
    || /^(已开启|已关闭|已保存|已提交|已确认|已发送|已取消|已下线休息|上报成功|路线已生成|提现申请已提交)$/.test(value)
    || /已同步到当前任务记录|筛选条件已应用|任务列表已重新加载/.test(value);
}

function writeActionStatus(source, text) {
  if (shouldSuppressTransientPrompt(text)) return;
  const phone = document.getElementById('phone');
  let scope = source.closest?.('.section, .card, .segmented, .floating-footer, .phone-content') || phone;
  if (!scope || scope.id === 'phone') scope = phone.querySelector('.phone-content') || phone;
  let status = scope.querySelector('[data-action-status]');
  if (!status) {
    status = document.createElement('p');
    status.className = 'action-status';
    status.dataset.actionStatus = '';
    scope.appendChild(status);
  }
  status.textContent = text;
}

function guideActionResultKey(actionName) {
  return `guide-action-result-${String(actionName || 'operation').replace(/[^\w\u4e00-\u9fa5-]+/g, '-').slice(0, 36)}`;
}

function renderGuideActionResult(button, actionName, text) {
  const key = guideActionResultKey(actionName);
  document.querySelector(`[data-guide-action-result="${key}"]`)?.remove();
  const panel = document.createElement('section');
  panel.className = 'card guide-action-result';
  panel.dataset.guideActionResult = key;
  panel.dataset.action = actionName || '';
  panel.innerHTML = `
    <h2 class="section-title">${escapeHtml(cleanActionLabel(actionName))}</h2>
    <div class="guide-mini-list">
      <p>${icon('check')}${escapeHtml(text || completedActionText(actionName))}</p>
      <p>${icon('clock')}当前任务记录已更新，可继续查看订单或消息。</p>
    </div>
    <div class="quick-actions">
      <button data-open="14" type="button">${icon('clipboard')}查看订单详情</button>
      <button data-open="01" type="button">${icon('bell')}查看消息中心</button>
    </div>
  `;
  const anchor = button.closest?.('.card, .section, article, .floating-footer') || document.querySelector('.screen-scroll') || document.getElementById('phone');
  if (anchor && anchor !== document.getElementById('phone')) anchor.after(panel);
  else document.querySelector('.screen-scroll')?.appendChild(panel);
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  return panel;
}

function clearGuidePageOperationPanels() {
  document.querySelectorAll('[data-guide-action-result="guide-action-result-页面操作"]').forEach(panel => panel.remove());
}

function showToast(text) {
  const phone = document.getElementById('phone');
  if (!phone) return;
  clearGuidePageOperationPanels();
  const toast = phone.querySelector('[data-toast]');
  if (toast) {
    toast.classList.remove('show');
    toast.textContent = '';
  }
  window.clearTimeout(toastTimer);
  const message = String(text || '').trim();
  if (!message) return;
  const active = document.activeElement?.closest?.('button, a, input, select, textarea, [role="button"]');
  const anchor = active || phone.querySelector('.screen-scroll .card:last-of-type, .screen-scroll .section:last-of-type, .screen-scroll') || phone;
  if (/请|失败|暂无|无效|至少|未|不能|异常/.test(message)) {
    writeActionStatus(anchor, message);
    return;
  }
}

function actionText(action) {
  const map = {
    '重置': '筛选条件已重置',
    '联系客户': '已进入客户联系流程',
    '联系客服': '正在连接平台客服',
    '提现': '提现申请已提交',
    '保存排班': '排班已保存',
    '提交完成上报': '完成资料已提交',
    '意见反馈': '已进入意见反馈表单',
    '已解决': '处理结果已同步',
  };
  return map[action] || action;
}

init();
