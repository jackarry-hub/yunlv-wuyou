<template>
  <YlPage title="云旅无忧" :subtitle="cityText">
    <template #action>
      <button class="switch-role" @click="openRoleSelector">切换角色</button>
    </template>
    <view class="hero">
      <text class="hero-title">旅居生活 从心出发</text>
      <text class="hero-sub">发现美好 · 结识同伴 · 乐享晚年</text>
    </view>
    <YlCard title="快捷服务">
      <YlActionGrid :items="quickActions" @select="handleQuick" />
    </YlCard>
    <YlCard title="活动推荐">
      <view class="activity-list">
        <button v-for="item in activities" :key="item.id" class="activity" @click="openActivity(item)">
          <text class="activity-title">{{ item.title }}</text>
          <text class="activity-meta">{{ item.time }} · {{ item.location }}</text>
        </button>
      </view>
    </YlCard>
    <YlCard title="进行中订单">
      <YlOrderCard v-for="item in activeOrders" :key="item.id" :item="item" />
      <text v-if="!activeOrders.length" class="empty">暂无进行中订单</text>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastText } from "../../common/api";
import { navigate, openRoleSelector } from "../../common/router";

const home = ref({});
const loading = ref(false);

const quickActions = [
  { text: "安全守护", sub: "SOS", icon: "安", tone: "green", url: "/pages/user/emergency" },
  { text: "健康服务", sub: "档案", icon: "健", tone: "blue", url: "/pages/user/profile" },
  { text: "人工向导", sub: "下单", icon: "导", tone: "orange", url: "/pages/user/assistant" },
  { text: "活动地图", sub: "报名", icon: "活", tone: "purple", url: "/pages/user/activity-map" },
  { text: "我的订单", sub: "追踪", icon: "订", tone: "blue", url: "/pages/user/orders" },
  { text: "消息中心", sub: "通知", icon: "消", tone: "green", url: "/pages/user/messages" },
  { text: "个人资料", sub: "维护", icon: "我", tone: "orange", url: "/pages/user/profile" },
  { text: "一键下单", sub: "服务", icon: "单", tone: "purple", url: "/pages/user/order-create" },
];

const cityText = computed(() => {
  const city = home.value?.homeRequirements?.currentCity || home.value?.profile?.elder?.city || "昆明";
  return `当前城市 ${city}`;
});
const activities = computed(() => home.value?.activities || []);
const activeOrders = computed(() => home.value?.activeOrders || []);

async function load() {
  loading.value = true;
  try {
    home.value = await api.userHome();
  } catch (error) {
    toastText(error.message || "首页加载失败");
  } finally {
    loading.value = false;
  }
}

function handleQuick(item) {
  navigate(item.url);
}

function openActivity(item) {
  navigate(`/pages/user/activity-map?id=${item.id || ""}`);
}

onShow(load);
</script>

<style scoped>
.switch-role {
  color: #1677ff;
  font-size: 24rpx;
  font-weight: 800;
}

.hero {
  box-sizing: border-box;
  min-height: 260rpx;
  margin-bottom: 24rpx;
  padding: 42rpx 34rpx;
  border-radius: 34rpx;
  background: linear-gradient(135deg, #cceaff, #f8fbff 58%, #d9fbe7);
}

.hero-title {
  display: block;
  color: #159260;
  font-size: 48rpx;
  font-weight: 900;
}

.hero-sub {
  display: block;
  margin-top: 18rpx;
  color: #1677ff;
  font-size: 28rpx;
  font-weight: 700;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.activity {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 22rpx;
  border-radius: 22rpx;
  background: #f8fbff;
}

.activity-title {
  color: #111827;
  font-size: 28rpx;
  font-weight: 800;
}

.activity-meta,
.empty {
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
}
</style>
