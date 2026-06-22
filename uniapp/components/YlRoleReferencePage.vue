<template>
  <YlPage :title="config.title" :subtitle="config.subtitle">
    <view class="reference-page" :data-screen="config.screenNo" :data-kind="visualKind">
      <view class="hero" :class="`hero--${props.role}`">
        <view>
          <text class="screen-pill">{{ config.screenNo }}</text>
          <text class="hero-title">{{ config.title }}</text>
          <text class="hero-copy">{{ config.subtitle }}</text>
        </view>
        <view class="hero-mark">
          <text>{{ config.title.slice(0, 1) }}</text>
        </view>
      </view>

      <YlCard title="实时数据">
        <view class="metrics">
          <view v-for="item in metrics" :key="item.label" class="metric">
            <text class="metric-value">{{ item.value }}</text>
            <text class="metric-label">{{ item.label }}</text>
          </view>
        </view>
      </YlCard>

      <YlCard v-if="visualKind === 'workbench'" title="快捷入口">
        <YlActionGrid :items="toolItems" @select="openTool" />
      </YlCard>

      <YlCard v-if="visualKind === 'finance'" title="财务概览">
        <view class="money-panel">
          <text class="money-label">{{ props.role === "merchant" ? "待结算金额" : "今日收入" }}</text>
          <text class="money-value">¥{{ financeAmount }}</text>
          <text class="money-copy">结算记录、提现和交易明细已接入后台数据。</text>
        </view>
      </YlCard>

      <YlCard v-if="visualKind === 'form' || visualKind === 'exception' || visualKind === 'complete'" :title="formTitle">
        <view class="form-list">
          <view v-for="field in formFields" :key="field.label" class="form-field">
            <text>{{ field.label }}</text>
            <input :value="field.value" :placeholder="field.placeholder" />
          </view>
        </view>
        <view v-if="visualKind === 'complete'" class="upload-grid">
          <button class="upload-item" @click="recordLocal('服务照片凭证')">
            <text>+</text>
            <text>上传凭证</text>
          </button>
          <button class="upload-item" @click="recordLocal('服务过程记录')">
            <text>✓</text>
            <text>过程记录</text>
          </button>
        </view>
      </YlCard>

      <YlCard v-if="visualKind === 'message'" title="消息分类">
        <view class="chips">
          <button v-for="item in messageFilters" :key="item" class="chip" :class="{ active: selectedFilter === item }" @click="selectedFilter = item">{{ item }}</button>
        </view>
      </YlCard>

      <YlCard v-if="visualKind === 'list' || visualKind === 'order' || visualKind === 'message' || visualKind === 'detail'" :title="listTitle">
        <view class="live">
          <button v-for="item in rows" :key="item.title" class="item" @click="openRow(item)">
            <view>
              <text class="item-title">{{ item.title }}</text>
              <text class="item-meta">{{ item.meta }}</text>
            </view>
            <YlStatusPill v-if="item.status" :text="item.status" :tone="pillTone(item.status)" />
          </button>
        </view>
      </YlCard>

      <YlCard v-if="visualKind === 'setting' || visualKind === 'profile'" :title="visualKind === 'profile' ? '资料与认证' : '设置项'">
        <view class="menu-list">
          <button v-for="item in settingRows" :key="item.title" class="menu-row" @click="recordLocal(item.title)">
            <view class="menu-icon"><text>{{ item.title.slice(0, 1) }}</text></view>
            <view>
              <text class="item-title">{{ item.title }}</text>
              <text class="item-meta">{{ item.meta }}</text>
            </view>
            <text class="arrow">›</text>
          </button>
        </view>
      </YlCard>

      <YlCard v-if="visualKind === 'default'" :title="config.title">
        <view class="live">
          <button v-for="item in rows" :key="item.title" class="item" @click="openRow(item)">
            <view>
              <text class="item-title">{{ item.title }}</text>
              <text class="item-meta">{{ item.meta }}</text>
            </view>
          </button>
        </view>
      </YlCard>

      <YlCard title="快捷处理">
        <view class="actions">
          <YlPrimaryButton
            v-for="action in config.actions"
            :key="action.text"
            :text="action.text"
            :ghost="action.type === 'record'"
            :loading="loading && activeAction === action.text"
            @click="runAction(action)"
          />
        </view>
      </YlCard>
    </view>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import YlActionGrid from "./YlActionGrid.vue";
import YlStatusPill from "./YlStatusPill.vue";
import { api, toastSuccess, toastText } from "../common/api";
import { getRoleReferencePage } from "../common/role-reference-pages";
import { navigate } from "../common/router";
import { callPhone, openMapLocation } from "../common/native";

const props = defineProps({
  role: { type: String, required: true },
  pageId: { type: String, required: true },
});

const config = computed(() => getRoleReferencePage(props.role, props.pageId));
const dashboard = ref(null);
const loading = ref(false);
const activeAction = ref("");
const selectedFilter = ref("全部");
const messageFilters = ["全部", "订单", "审核", "结算", "系统"];
const roleRoutePrefix = computed(() => `/pages/${props.role}/`);
const roleDisplayName = computed(() => props.role === "merchant" ? "商户端" : "向导端");

const visualKind = computed(() => {
  const id = props.pageId;
  const kind = config.value.kind;
  const title = config.value.title;
  if (["income", "finance"].includes(kind) || /钱包|提现|结算|交易|发票/.test(title)) return "finance";
  if (["workbench", "hall"].includes(kind) || /首页|工作台/.test(title)) return "workbench";
  if (["message"].includes(kind) || /消息|客服|工单|通知|反馈/.test(title)) return "message";
  if (["exception"].includes(kind) || /异常|取消|拒绝|驳回|售后/.test(title)) return "exception";
  if (["complete"].includes(kind) || /完成|上报|凭证|安排/.test(title)) return "complete";
  if (["profile"].includes(kind) || /资料|认证|入驻|审核|个人|资质|照片/.test(title)) return "profile";
  if (["setting", "online", "scan"].includes(kind) || /设置|规则|权限|安全|排班|区域|类型|扫一扫|扫码|密码/.test(title)) return "setting";
  if (["order", "task"].includes(kind) || /订单|预约|报价|详情|客户|评价|导航|路线/.test(title)) return "order";
  if (/新增|编辑|申请|选择|绑定|换绑|修改/.test(title) || id.includes("create") || id.includes("edit")) return "form";
  return "default";
});

const metrics = computed(() => {
  const stats = dashboard.value?.stats || {};
  if (props.role === "merchant") {
    return [
      { label: "待结算", value: `¥${stats.settlementPending || 0}` },
      { label: "进行中", value: stats.activeOrders || 0 },
      { label: "服务项目", value: stats.serviceCount || 0 },
    ];
  }
  return [
    { label: "今日收入", value: `¥${stats.todayIncome || 0}` },
    { label: "今日任务", value: stats.todayTasks || stats.activeTasks || 0 },
    { label: "待派订单", value: stats.pendingOrders || 0 },
  ];
});

const financeAmount = computed(() => {
  const stats = dashboard.value?.stats || {};
  return props.role === "merchant" ? stats.settlementPending || 0 : stats.todayIncome || 0;
});

const listTitle = computed(() => {
  if (visualKind.value === "message") return `${selectedFilter.value}消息`;
  if (visualKind.value === "detail") return "详情信息";
  return props.role === "merchant" ? "订单与服务数据" : "任务与订单数据";
});

const formTitle = computed(() => {
  if (visualKind.value === "exception") return "异常信息";
  if (visualKind.value === "complete") return "完成上报";
  return "表单信息";
});

const toolItems = computed(() => {
  const roleTools = props.role === "merchant"
    ? [
      { text: "发布服务", icon: "服", tone: "blue", url: "/pages/merchant/service-create" },
      { text: "预约订单", icon: "订", tone: "green", url: "/pages/merchant/orders" },
      { text: "报价确认", icon: "价", tone: "orange", url: "/pages/merchant/quote" },
      { text: "完成服务", icon: "完", tone: "purple", url: "/pages/merchant/service-complete" },
      { text: "评价售后", icon: "评", tone: "blue", url: "/pages/merchant/reviews" },
      { text: "结算提现", icon: "结", tone: "orange", url: "/pages/merchant/settlements" },
      { text: "消息中心", icon: "消", tone: "green", url: "/pages/merchant/messages" },
      { text: "商户资料", icon: "商", tone: "purple", url: "/pages/merchant/profile" },
    ]
    : [
      { text: "上线接单", icon: "接", tone: "green", url: "/pages/guide/online" },
      { text: "接单大厅", icon: "单", tone: "blue", url: "/pages/guide/hall" },
      { text: "我的订单", icon: "订", tone: "orange", url: "/pages/guide/orders" },
      { text: "服务中", icon: "服", tone: "purple", url: "/pages/guide/service" },
      { text: "异常上报", icon: "异", tone: "orange", url: "/pages/guide/exception" },
      { text: "今日收入", icon: "收", tone: "green", url: "/pages/guide/income" },
      { text: "消息中心", icon: "消", tone: "blue", url: "/pages/guide/messages" },
      { text: "扫一扫", icon: "扫", tone: "purple", url: "/pages/guide/scan" },
    ];
  return roleTools;
});

const formFields = computed(() => {
  if (visualKind.value === "exception") {
    return [
      { label: "异常类型", value: props.role === "merchant" ? "客户不在家" : "客户临时取消", placeholder: "请选择异常类型" },
      { label: "处理方式", value: "申请改约", placeholder: "请输入处理方式" },
      { label: "备注说明", value: "已联系客户并同步后台", placeholder: "请输入备注" },
    ];
  }
  if (visualKind.value === "complete") {
    return [
      { label: "服务人员", value: props.role === "merchant" ? "护理师王芳" : "李向导", placeholder: "请输入服务人员" },
      { label: "完成时间", value: "今日 16:30", placeholder: "请输入完成时间" },
      { label: "服务结果", value: "服务已完成，等待用户确认", placeholder: "请输入服务结果" },
    ];
  }
  return [
    { label: "名称", value: config.value.title, placeholder: "请输入名称" },
    { label: "联系人", value: props.role === "merchant" ? "王经理" : "李向导", placeholder: "请输入联系人" },
    { label: "说明", value: config.value.subtitle, placeholder: "请输入说明" },
  ];
});

const settingRows = computed(() => {
  const rows = [
    { title: config.value.title, meta: config.value.subtitle },
    { title: "后台同步", meta: "保存后同步 API、消息和审计记录" },
    { title: "权限与通知", meta: "按当前角色展示可操作范围" },
  ];
  if (props.role === "merchant") rows.push({ title: "商户审核", meta: "资质、服务和结算状态可查询" });
  if (props.role === "guide") rows.push({ title: "接单设置", meta: "服务区域、类型、提醒和排班" });
  return rows;
});

const rows = computed(() => {
  if (props.role === "merchant") {
    const data = dashboard.value || {};
    const orders = (data.orders || []).slice(0, 4).map((order) => ({
      title: `${order.serviceType || "服务订单"} · ${order.status || "待处理"}`,
      meta: `${order.elderName || "用户"} · ${order.time || "待确认"} · ${order.location || "待确认地点"}`,
      status: order.status,
      route: "/pages/merchant/order-detail",
    }));
    const services = (data.services || []).slice(0, 3).map((service) => ({
      title: `${service.title || "服务项目"} · ¥${service.price || 0}`,
      meta: `${service.category || "服务"} · ${service.status || "待审核"}`,
      status: service.status,
      route: "/pages/merchant/service-preview",
    }));
    return [...orders, ...services, ...(config.value.items || [])].slice(0, 8);
  }

  const data = dashboard.value || {};
  const tasks = (data.tasks || []).slice(0, 4).map((task) => ({
    title: `${task.taskNo || "任务"} · ${task.status || "待接单"}`,
    meta: `${task.order?.serviceType || "服务"} · ${task.order?.elderName || "客户"} · ${task.order?.location || "待确认地点"}`,
    status: task.status,
    route: "/pages/guide/order-detail",
  }));
  const pending = (data.pendingOrders || []).slice(0, 3).map((order) => ({
    title: `${order.serviceType || "待派订单"} · ${order.status || "待派单"}`,
    meta: `${order.elderName || "客户"} · ${order.time || "待确认"} · ${order.location || "待确认地点"}`,
    status: order.status,
    route: "/pages/guide/order-detail",
  }));
  return [...tasks, ...pending, ...(config.value.items || [])].slice(0, 8);
});

async function loadData() {
  try {
    dashboard.value = props.role === "merchant" ? await api.merchantDashboard() : await api.guideDashboard();
  } catch (error) {
    toastText(error.message || "数据加载失败");
  }
}

function firstGuideTask() {
  return (dashboard.value?.tasks || [])[0];
}

function firstMerchantOrder(action = "") {
  const orders = dashboard.value?.orders || [];
  const candidates = {
    quote: ["待派单", "已派单"],
    confirm: ["已报价", "待派单", "已派单"],
    start: ["待服务"],
    complete: ["服务中"],
  }[action] || [];
  if (candidates.length) return orders.find((item) => candidates.includes(item.status));
  return orders[0];
}

function pillTone(status = "") {
  if (/完成|通过|上架|在线|已认证/.test(status)) return "green";
  if (/异常|驳回|取消|下架/.test(status)) return "red";
  if (/待|审核|确认|补充/.test(status)) return "orange";
  return "blue";
}

function isSameRoleRoute(url = "") {
  return String(url).startsWith(roleRoutePrefix.value);
}

function safeNavigate(url = "") {
  if (!isSameRoleRoute(url)) {
    toastText(`跨端页面已拦截，请在当前${roleDisplayName.value}继续操作`);
    return;
  }
  navigate(url);
}

function openTool(item) {
  if (item.url) safeNavigate(item.url);
}

function openRow(item) {
  if (item.route) safeNavigate(item.route);
}

async function recordLocal(actionText) {
  try {
    await api.recordUiAction({ role: props.role, route: props.pageId, action: actionText });
    toastSuccess(`${actionText}已保存`);
  } catch (error) {
    toastText(error.message || `${actionText}保存失败`);
  }
}

async function runAction(action) {
  if (action.type === "navigate") return safeNavigate(action.url);
  if (action.type === "phone") return callPhone("13800000000");
  if (action.type === "map") return openMapLocation({ name: config.value.title, address: "昆明滇池海埂公园" });

  loading.value = true;
  activeAction.value = action.text;
  try {
    if (action.type === "guideOnline") {
      const guide = dashboard.value?.guide || {};
      const next = guide.onlineStatus === "在线" ? "离线" : "在线";
      await api.setGuideOnline({ guideId: guide.id, onlineStatus: next });
      toastSuccess(next === "在线" ? "已上线接单" : "已停止接单");
    } else if (action.type === "guideClaim") {
      await api.claimGuideTask({ source: config.value.id });
      toastSuccess("已抢接任务");
    } else if (action.type === "guideTask") {
      const task = firstGuideTask();
      if (!task) {
        toastText("暂无可执行任务");
      } else {
        const next = task.status === "待接单" ? "accept" : task.status === "已接单" ? "start" : "complete";
        await api.taskAction(task.id, next, { evidence: `${config.value.title}提交服务记录` });
        toastSuccess(next === "accept" ? "已接单" : next === "start" ? "已开始服务" : "服务完成已提交");
      }
    } else if (action.type === "guideException") {
      await api.reportGuideException({ type: "服务异常", reason: config.value.title, description: "向导端提交异常记录" });
      toastSuccess("异常已提交");
    } else if (action.type === "guideIncome") {
      await api.guideIncome();
      toastSuccess("收入明细已同步");
    } else if (action.type === "merchantService") {
      await api.createMerchantService({
        title: "康复训练陪护",
        category: "康养护理",
        price: 299,
        unit: "次",
        description: "商户端提交服务审核",
      });
      toastSuccess("服务已提交审核");
    } else if (action.type === "merchantOrder") {
      const order = firstMerchantOrder(action.action);
      if (!order) {
        toastText("暂无可处理订单");
      } else {
        await api.merchantOrderAction(order.id, action.action, { merchantId: "merchant-001", amount: 280, plan: "服务方案与报价已确认" });
        const successText = { quote: "报价已提交", confirm: "预约已确认", start: "服务已开始", complete: "完成凭证已提交" };
        toastSuccess(successText[action.action] || "订单已更新");
      }
    } else if (action.type === "merchantException") {
      await api.reportMerchantException({ type: "服务异常", reason: config.value.title, description: "商户端提交异常记录" });
      toastSuccess("异常已提交");
    } else if (action.type === "merchantReviews") {
      await api.merchantReviews();
      toastSuccess("评价列表已同步");
    } else if (action.type === "messageRead") {
      await api.markAllMessagesRead(props.role === "merchant" ? "merchant" : "guide");
      toastSuccess("消息已全部已读");
    } else {
      await api.recordUiAction({ role: props.role, route: props.pageId, action: action.text });
      const label = /刷新/.test(action.text) ? "数据已同步" : /保存/.test(action.text) ? "内容已保存" : "事项已提交";
      toastSuccess(`${config.value.title}${label}`);
    }
    await loadData();
  } catch (error) {
    toastText(error.message || "操作失败");
  } finally {
    loading.value = false;
    activeAction.value = "";
  }
}

onShow(loadData);
</script>

<style scoped>
.reference-page {
  display: flex;
  flex-direction: column;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  box-sizing: border-box;
  min-height: 210rpx;
  margin-bottom: 24rpx;
  padding: 34rpx;
  border-radius: 36rpx;
  color: #111827;
  background:
    linear-gradient(135deg, rgba(231, 242, 255, 0.98), rgba(255, 255, 255, 0.9) 58%, rgba(231, 251, 239, 0.98)),
    radial-gradient(circle at 85% 25%, rgba(22, 119, 255, 0.15), transparent 30%);
  box-shadow: 0 18rpx 36rpx rgba(37, 87, 133, 0.08);
}

.hero--merchant {
  background:
    linear-gradient(135deg, rgba(232, 243, 255, 0.98), rgba(255, 255, 255, 0.92) 58%, rgba(255, 241, 222, 0.98)),
    radial-gradient(circle at 85% 25%, rgba(255, 139, 42, 0.15), transparent 30%);
}

.screen-pill {
  display: inline-flex;
  width: max-content;
  margin-bottom: 20rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  color: #1677ff;
  background: #ffffff;
  font-size: 22rpx;
  font-weight: 900;
}

.hero-title {
  display: block;
  color: #111827;
  font-size: 42rpx;
  font-weight: 900;
  line-height: 1.16;
}

.hero-copy {
  display: block;
  margin-top: 14rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.45;
}

.hero-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  flex: 0 0 92rpx;
  border-radius: 30rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #1677ff, #36c878);
  font-size: 36rpx;
  font-weight: 900;
}

.metrics,
.actions,
.service-actions {
  display: grid;
  gap: 16rpx;
}

.metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.actions {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.metric {
  padding: 20rpx 10rpx;
  border-radius: 24rpx;
  background: #f6faff;
  text-align: center;
}

.metric-value {
  display: block;
  color: #111827;
  font-size: 30rpx;
  font-weight: 900;
}

.metric-label {
  display: block;
  margin-top: 6rpx;
  color: #64748b;
  font-size: 22rpx;
}

.money-panel {
  padding: 30rpx;
  border-radius: 30rpx;
  background: linear-gradient(135deg, #f1f7ff, #f7fff9);
}

.money-label,
.money-copy {
  display: block;
  color: #64748b;
  font-size: 24rpx;
}

.money-value {
  display: block;
  margin: 10rpx 0;
  color: #111827;
  font-size: 54rpx;
  font-weight: 900;
}

.form-list,
.live,
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.form-field {
  box-sizing: border-box;
  padding: 20rpx 22rpx;
  border-radius: 24rpx;
  background: #f7fbff;
}

.form-field text {
  display: block;
  color: #64748b;
  font-size: 23rpx;
  font-weight: 700;
}

.form-field input {
  min-height: 54rpx;
  margin-top: 8rpx;
  color: #111827;
  font-size: 28rpx;
  font-weight: 800;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 18rpx;
}

.upload-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150rpx;
  border: 2rpx dashed #c8d8ec;
  border-radius: 26rpx;
  color: #64748b;
  font-size: 25rpx;
  font-weight: 800;
}

.chips {
  display: flex;
  gap: 12rpx;
  overflow-x: auto;
}

.chip {
  flex: 0 0 auto;
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  color: #64748b;
  background: #f3f8ff;
  font-size: 24rpx;
  font-weight: 800;
}

.chip.active {
  color: #ffffff;
  background: #1677ff;
}

.item,
.menu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  min-height: 106rpx;
  padding: 22rpx;
  border-radius: 24rpx;
  background: #f7fbff;
  text-align: left;
}

.item-title {
  display: block;
  color: #111827;
  font-size: 28rpx;
  font-weight: 850;
  line-height: 1.28;
}

.item-meta {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
  line-height: 1.45;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  flex: 0 0 68rpx;
  border-radius: 22rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #60a5fa, #1677ff);
  font-weight: 900;
}

.arrow {
  color: #94a3b8;
  font-size: 42rpx;
  line-height: 1;
}
</style>
