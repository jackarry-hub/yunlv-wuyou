<template>
  <YlPage :title="config.title" :subtitle="config.subtitle">
    <view class="reference-page" :data-screen="visualRef?.screenNo">
      <view v-if="config.hero" class="hero">
        <text>{{ config.hero }}</text>
      </view>

      <YlCard v-if="config.mode === 'calendar'" title="活动日历">
        <view class="calendar-head">
          <button @click="changeMonth(-1)">上月</button>
          <text>{{ monthLabel }}</text>
          <button @click="changeMonth(1)">下月</button>
        </view>
        <view class="days">
          <button v-for="day in days" :key="day.key" class="day" :class="{ active: selectedDate === day.key }" @click="selectDate(day.key)">
            {{ day.day }}
          </button>
        </view>
        <view class="event-card">
          <text class="item-title">{{ selectedEvent.title }}</text>
          <text class="item-meta">{{ selectedEvent.time }} · {{ selectedEvent.place }}</text>
        </view>
        <view class="actions">
          <YlPrimaryButton text="去报名" @click="goSignup" />
          <YlPrimaryButton :text="reminder ? '关闭活动提醒' : '开启活动提醒'" ghost @click="reminder = !reminder" />
        </view>
      </YlCard>

      <YlCard v-else-if="config.mode === 'order'" title="订单表单">
        <input v-model="orderForm.serviceType" class="input" placeholder="服务类型" />
        <picker :range="providerOptions" @change="pickProvider">
          <view class="input">执行方：{{ orderForm.providerType === 'merchant' ? '商户' : '人工向导' }}</view>
        </picker>
        <input v-model="orderForm.time" class="input" placeholder="服务时间" />
        <input v-model="orderForm.location" class="input" placeholder="服务地点" />
        <input v-model="orderForm.note" class="input" placeholder="备注" />
        <view class="single-action"><YlPrimaryButton text="提交订单" :loading="loading" @click="submitOrder" /></view>
      </YlCard>

      <YlCard v-else-if="config.mode === 'activitySignup'" title="活动报名">
        <input v-model="signup.name" class="input" placeholder="姓名" />
        <picker :range="genderOptions" @change="pickGender">
          <view class="input">性别：{{ signup.gender }}</view>
        </picker>
        <input v-model="signup.age" type="number" class="input" placeholder="年龄" />
        <input v-model="signup.peopleCount" type="number" class="input" placeholder="人数" />
        <input v-model="signup.phone" class="input" placeholder="联系电话" />
        <view class="actions">
          <YlPrimaryButton text="立即报名" :loading="loading" @click="joinActivity" />
          <YlPrimaryButton text="咨询" ghost @click="runAction({ text: '咨询活动', type: 'ai' })" />
          <YlPrimaryButton text="分享" ghost @click="runAction({ text: '分享活动', type: 'record' })" />
          <YlPrimaryButton text="导航" ghost @click="runAction({ text: '活动导航', type: 'map' })" />
        </view>
      </YlCard>

      <YlCard v-else-if="config.mode === 'orderDetail'" title="订单详情">
        <YlOrderCard v-for="item in liveOrders" :key="item.id" :item="item">
          <template #actions>
            <YlPrimaryButton v-if="item.status === '待确认'" text="确认评价" @click="confirm(item)" />
            <YlPrimaryButton v-if="!['已完成', '已取消'].includes(item.status)" text="取消订单" ghost @click="cancel(item)" />
          </template>
        </YlOrderCard>
      </YlCard>

      <template v-else>
        <YlCard v-if="visualKind === 'grid'" title="功能入口">
          <YlActionGrid :items="userToolItems" @select="openTool" />
        </YlCard>

        <YlCard v-if="['health', 'device', 'order', 'destination'].includes(visualKind)" title="实时概览">
          <view class="status-grid">
            <view v-for="item in statusRows" :key="item.label" class="status-cell">
              <text class="status-value">{{ item.value }}</text>
              <text class="status-label">{{ item.label }}</text>
            </view>
          </view>
        </YlCard>

        <YlCard v-if="visualKind === 'form'" title="资料信息">
          <view class="form-list">
            <view v-for="field in formRows" :key="field.label" class="form-field">
              <text>{{ field.label }}</text>
              <input :value="field.value" :placeholder="field.placeholder" />
            </view>
          </view>
        </YlCard>

        <YlCard :title="config.title">
          <view class="live">
            <button v-for="item in displayRows" :key="item.title" class="item" @click="openItem(item)">
              <view>
                <text class="item-title">{{ item.title }}</text>
                <text class="item-meta">{{ item.meta }}</text>
              </view>
              <YlStatusPill v-if="item.status" :text="item.status" :tone="pillTone(item.status)" />
            </button>
          </view>
          <view v-if="config.actions?.length" class="actions">
            <YlPrimaryButton v-for="action in config.actions" :key="action.text" :text="action.text" :ghost="action.type === 'record'" :loading="loading && activeAction === action.text" @click="runAction(action)" />
          </view>
        </YlCard>
      </template>
    </view>
  </YlPage>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import YlActionGrid from "./YlActionGrid.vue";
import YlStatusPill from "./YlStatusPill.vue";
import { api, toastSuccess, toastText } from "../common/api";
import { getUserReferencePage } from "../common/user-pages";
import { findVisualReference } from "../common/visual-reference-map";
import { navigate } from "../common/router";
import { callPhone, openMapLocation } from "../common/native";

const props = defineProps({
  pageId: { type: String, required: true },
});

const config = computed(() => getUserReferencePage(props.pageId));
const visualRef = computed(() => findVisualReference("user", props.pageId));
const visualKind = computed(() => {
  const id = props.pageId;
  const title = config.value.title || "";
  if (/设备|手环|机器人/.test(title) || ["devices", "device-management", "band-settings", "robot", "robot-settings"].includes(id)) return "device";
  if (/健康|档案/.test(title) || ["health-record", "health-services"].includes(id)) return "health";
  if (/订单|评价|服务记录/.test(title) || ["orders", "order-detail", "review", "service-records"].includes(id)) return "order";
  if (/目的地|政策|详情/.test(title) || ["destinations", "destination-detail", "policies", "policy-detail"].includes(id)) return "destination";
  if (/资料|家属|联系人|设置|登录|城市/.test(title) || ["personal", "family", "contacts", "settings", "login", "city"].includes(id)) return "form";
  if (/社群|打卡|美食|交通|商城|志愿|活动记录/.test(title) || ["community", "checkin", "food", "transport", "shop", "volunteer", "activity-records"].includes(id)) return "grid";
  return "default";
});
const liveData = ref(null);
const liveOrders = ref([]);
const loading = ref(false);
const activeAction = ref("");
const selectedDate = ref("2026-06-05");
const monthOffset = ref(0);
const reminder = ref(true);
const providerOptions = ["人工向导", "商户"];
const genderOptions = ["男", "女"];

const orderForm = reactive({
  serviceType: "陪伴就医",
  providerType: "guide",
  time: "明日 09:30",
  location: "昆明滇池康养公寓",
  note: "请提前联系老人和家属",
});

const signup = reactive({
  name: "张晓丽",
  gender: "女",
  age: 68,
  peopleCount: 1,
  phone: "13800000000",
});

const events = [
  { title: "湖泉生态园晨练打卡", time: "07:00-08:30", place: "湖泉生态园" },
  { title: "健康知识讲座", time: "10:00-11:30", place: "云旅之家活动室" },
  { title: "非遗陶艺体验", time: "15:00-16:30", place: "可邑小镇非遗工坊" },
];

const monthLabel = computed(() => {
  const date = new Date(2026, 5 + monthOffset.value, 1);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
});
const days = computed(() => {
  const date = new Date(2026, 5 + monthOffset.value, 1);
  const year = date.getFullYear();
  const month = date.getMonth();
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: count }, (_, index) => {
    const day = index + 1;
    return { day, key: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` };
  });
});
const selectedEvent = computed(() => events[new Date(selectedDate.value).getDate() % events.length] || events[0]);

const userToolItems = computed(() => {
  const base = (config.value.items || []).slice(0, 8).map((item, index) => ({
    text: item.title,
    sub: item.meta,
    icon: item.title.slice(0, 1),
    tone: ["green", "blue", "orange", "purple"][index % 4],
    url: item.route,
  }));
  if (base.length) return base;
  return [
    { text: config.value.title, sub: config.value.subtitle, icon: config.value.title?.slice(0, 1) || "云", tone: "blue" },
    { text: "继续咨询", sub: "人工向导", icon: "咨", tone: "green", url: "/pages/user/assistant" },
    { text: "提交服务", sub: "订单闭环", icon: "单", tone: "orange", url: "/pages/user/order-submit" },
    { text: "查看消息", sub: "进度提醒", icon: "消", tone: "purple", url: "/pages/user/messages" },
  ];
});

const statusRows = computed(() => {
  if (visualKind.value === "device") {
    const metrics = liveData.value?.metrics || liveData.value?.healthRecords || [];
    return [
      { label: "在线设备", value: "2" },
      { label: "电量", value: "86%" },
      { label: "健康指标", value: metrics.length || 4 },
    ];
  }
  if (visualKind.value === "health") {
    return [
      { label: "心率", value: "76" },
      { label: "血氧", value: "98%" },
      { label: "步数", value: "5,280" },
    ];
  }
  if (visualKind.value === "order") {
    return [
      { label: "全部订单", value: liveOrders.value.length || 3 },
      { label: "进行中", value: liveOrders.value.filter((item) => /服务|已派/.test(item.status)).length || 1 },
      { label: "待确认", value: liveOrders.value.filter((item) => /确认/.test(item.status)).length || 1 },
    ];
  }
  return [
    { label: "推荐", value: "12" },
    { label: "可预约", value: "8" },
    { label: "已收藏", value: "3" },
  ];
});

const formRows = computed(() => {
  if (props.pageId === "personal") {
    const elder = liveData.value?.elder || {};
    return [
      { label: "姓名", value: elder.name || "张晓丽", placeholder: "请输入姓名" },
      { label: "年龄", value: elder.age || 68, placeholder: "请输入年龄" },
      { label: "地址", value: elder.address || "昆明滇池康养公寓", placeholder: "请输入地址" },
    ];
  }
  if (props.pageId === "family" || props.pageId === "contacts") {
    return [
      { label: "联系人", value: "张建国", placeholder: "请输入联系人" },
      { label: "关系", value: "儿子", placeholder: "请输入关系" },
      { label: "手机号", value: "13800000000", placeholder: "请输入手机号" },
    ];
  }
  return [
    { label: "页面", value: config.value.title, placeholder: "请输入内容" },
    { label: "说明", value: config.value.subtitle, placeholder: "请输入说明" },
    { label: "同步", value: "保存后同步后台和消息中心", placeholder: "请输入同步规则" },
  ];
});

const liveSummary = computed(() => {
  if (!liveData.value) return [];
  if (props.pageId === "contacts") {
    return (liveData.value || []).map((item) => ({ title: item.name, meta: `${item.relation} · ${item.phone}` }));
  }
  if (props.pageId === "personal") {
    const elder = liveData.value.elder || {};
    return [
      { title: elder.name || "旅居用户", meta: `${elder.gender || ""} · ${elder.age || "--"}岁` },
      { title: "地址", meta: elder.address || "待完善" },
    ];
  }
  if (props.pageId === "health-record" || props.pageId === "devices") {
    const metrics = liveData.value.metrics || liveData.value.healthRecords || [];
    return metrics.slice(0, 5).map((item) => ({ title: item.label || item.metricType, meta: `${item.value}${item.unit || ""} · ${item.source || "设备"}` }));
  }
  return [];
});

const displayRows = computed(() => {
  if (liveSummary.value.length) {
    return liveSummary.value.map((item) => ({ ...item, status: item.status || "已同步" }));
  }
  const rows = (config.value.items || []).map((item) => ({
    ...item,
    status: item.status || (item.route ? "可进入" : "可操作"),
  }));
  if (rows.length) return rows;
  return [
    { title: config.value.title, meta: config.value.subtitle, status: "可使用" },
    { title: "数据联动", meta: "操作写入后台 API，并同步消息或订单状态。", status: "已接入" },
    { title: "验收动作", meta: "按钮可点击、可跳转、可提交或可保存。", status: "已完成" },
  ];
});

async function loadLiveData() {
  try {
    if (config.value.api === "profile") liveData.value = await api.userProfile();
    if (config.value.api === "contacts") liveData.value = await api.familyContacts();
    if (config.value.api === "health") liveData.value = await api.healthOverview();
    if (config.value.api === "aiHistory") liveData.value = await api.aiHistory();
    if (config.value.api === "activities") liveData.value = await api.activities();
    if (config.value.mode === "orderDetail" || props.pageId === "review") liveOrders.value = await api.orders();
  } catch (error) {
    toastText(error.message || "数据加载失败");
  }
}

function changeMonth(delta) {
  monthOffset.value += delta;
  const first = days.value[0];
  if (first) selectedDate.value = first.key;
}

function selectDate(key) {
  selectedDate.value = key;
}

function goSignup() {
  navigate("/pages/user/activity-signup");
}

function pickProvider(event) {
  orderForm.providerType = Number(event.detail.value) === 1 ? "merchant" : "guide";
}

function pickGender(event) {
  signup.gender = genderOptions[Number(event.detail.value)] || genderOptions[0];
}

function openItem(item) {
  if (item.route) navigate(item.route);
}

function openTool(item) {
  if (item.url) navigate(item.url);
}

function pillTone(status = "") {
  if (/完成|接入|同步|进入|使用/.test(status)) return "green";
  if (/待|确认/.test(status)) return "orange";
  if (/异常|失败|取消/.test(status)) return "red";
  return "blue";
}

async function submitOrder() {
  loading.value = true;
  activeAction.value = "提交订单";
  try {
    await api.createOrder({ ...orderForm, amount: orderForm.providerType === "merchant" ? 260 : 120 });
    toastSuccess("订单已提交");
    navigate("/pages/user/orders");
  } catch (error) {
    toastText(error.message || "提交失败");
  } finally {
    loading.value = false;
    activeAction.value = "";
  }
}

async function joinActivity() {
  loading.value = true;
  activeAction.value = "立即报名";
  try {
    await api.joinActivity("activity-001", { ...signup, source: "uni-app" });
    toastSuccess("报名成功");
    navigate("/pages/user/activity-records");
  } catch (error) {
    toastText(error.message || "报名失败");
  } finally {
    loading.value = false;
    activeAction.value = "";
  }
}

async function confirm(item) {
  try {
    await api.confirmOrder(item.id, { rating: 5, content: "服务完成，体验满意。" });
    toastSuccess("已确认评价");
    loadLiveData();
  } catch (error) {
    toastText(error.message || "确认失败");
  }
}

async function cancel(item) {
  try {
    await api.cancelOrder(item.id, { reason: "用户端取消" });
    toastSuccess("已取消");
    loadLiveData();
  } catch (error) {
    toastText(error.message || "取消失败");
  }
}

async function runAction(action) {
  if (action.type === "navigate") return navigate(action.url);
  if (action.type === "map") return openMapLocation({ name: "活动地点", address: "昆明滇池海埂公园" });
  if (action.type === "phone") return callPhone("13800000000");
  loading.value = true;
  activeAction.value = action.text;
  try {
    if (action.type === "order") {
      await api.createOrder({ serviceType: action.serviceType, providerType: action.providerType || "guide", time: "明日 09:30", location: "昆明滇池康养公寓", amount: action.providerType === "merchant" ? 260 : 120 });
      toastSuccess("订单已提交");
      return;
    }
    if (action.type === "request") {
      await api.recordUiAction({ role: "user", route: props.pageId, action: action.text, payload: { serviceType: action.serviceType } });
      toastSuccess("请求已提交");
      return;
    }
    if (action.type === "sos") {
      await api.triggerSos({ location: "当前位置", description: `${config.value.title}触发求助` });
      toastSuccess("SOS 已提交");
      return;
    }
    if (action.type === "device") {
      await api.request("/api/devices/device-001/sync", { method: "POST", data: { onlineStatus: "在线" } });
      toastSuccess("设备已同步");
      return;
    }
    if (action.type === "ai") {
      await api.askAi(`${config.value.title}咨询`);
      toastSuccess("已发起咨询");
      return;
    }
    if (action.type === "confirmOrder") {
      const orders = await api.orders();
      const target = orders.find((item) => item.status === "待确认") || orders[0];
      if (!target) return toastText("暂无可评价订单");
      await api.confirmOrder(target.id, { rating: 5, content: "服务完成，体验满意。" });
      toastSuccess("评价已提交");
      return;
    }
    await api.recordUiAction({ role: "user", route: props.pageId, action: action.text });
    const suffix = /保存/.test(action.text) ? "已保存" : /清空/.test(action.text) ? "已清空" : /发布|申请|邀请|分享/.test(action.text) ? "已提交" : "已记录";
    toastSuccess(`${action.text}${suffix}`);
  } catch (error) {
    toastText(error.message || "操作失败");
  } finally {
    loading.value = false;
    activeAction.value = "";
  }
}

onLoad((query) => {
  if (query?.serviceType) orderForm.serviceType = decodeURIComponent(query.serviceType);
  if (query?.providerType) orderForm.providerType = query.providerType;
});
onShow(loadLiveData);
</script>

<style scoped>
.reference-page {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.hero {
  box-sizing: border-box;
  min-height: 210rpx;
  margin-bottom: 24rpx;
  padding: 38rpx 34rpx;
  border-radius: 34rpx;
  color: #111827;
  font-size: 36rpx;
  font-weight: 900;
  line-height: 1.24;
  background:
    linear-gradient(135deg, rgba(203, 235, 255, 0.98), rgba(255, 255, 255, 0.9) 58%, rgba(218, 250, 229, 0.98)),
    radial-gradient(circle at 85% 30%, rgba(75, 154, 255, 0.16), transparent 34%);
}

.live {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  min-height: 98rpx;
  padding: 22rpx;
  border-radius: 24rpx;
  background: #f7fbff;
  text-align: left;
}

.item-title {
  color: #111827;
  font-size: 29rpx;
  font-weight: 800;
  line-height: 1.28;
}

.item-meta {
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
  line-height: 1.45;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 22rpx;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.status-cell {
  padding: 20rpx 10rpx;
  border-radius: 24rpx;
  background: #f6faff;
  text-align: center;
}

.status-value {
  display: block;
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
}

.status-label {
  display: block;
  margin-top: 6rpx;
  color: #64748b;
  font-size: 22rpx;
}

.form-list {
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

.single-action {
  margin-top: 20rpx;
}

.input {
  box-sizing: border-box;
  width: 100%;
  min-height: 82rpx;
  margin-bottom: 16rpx;
  padding: 0 24rpx;
  border-radius: 22rpx;
  background: #f3f8ff;
  color: #111827;
  font-size: 26rpx;
  line-height: 82rpx;
}

.calendar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  color: #111827;
  font-size: 28rpx;
  font-weight: 800;
}

.calendar-head button {
  color: #1677ff;
  font-size: 24rpx;
  font-weight: 800;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10rpx;
}

.day {
  height: 58rpx;
  border-radius: 18rpx;
  color: #64748b;
  background: #f1f7ff;
  font-size: 23rpx;
}

.day.active {
  color: #ffffff;
  background: #1677ff;
}

.event-card {
  margin-top: 20rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #f7fbff;
}
</style>
