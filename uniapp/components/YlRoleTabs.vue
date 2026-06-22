<template>
  <view class="tabs">
    <button v-for="item in tabs" :key="item.url" class="tab" :class="{ active: activeUrl === item.url }" @click="go(item.url)">
      <text class="tab-icon">{{ item.icon }}</text>
      <text>{{ item.text }}</text>
    </button>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { appState } from "../store/app-store";

const tabMap = {
  elder: [
    { text: "首页", icon: "⌂", url: "/pages/user/home" },
    { text: "人工向导", icon: "☏", url: "/pages/user/assistant" },
    { text: "活动", icon: "⌖", url: "/pages/user/activity-map" },
    { text: "订单", icon: "▤", url: "/pages/user/orders" },
    { text: "我的", icon: "○", url: "/pages/user/profile" },
  ],
  guide: [
    { text: "接单", icon: "▦", url: "/pages/guide/hall" },
    { text: "订单", icon: "▤", url: "/pages/guide/order-detail" },
    { text: "服务", icon: "✓", url: "/pages/guide/service" },
    { text: "异常", icon: "!", url: "/pages/guide/exception" },
    { text: "收入", icon: "¥", url: "/pages/guide/income" },
  ],
  merchant: [
    { text: "工作台", icon: "⌂", url: "/pages/merchant/workbench" },
    { text: "服务", icon: "＋", url: "/pages/merchant/services" },
    { text: "订单", icon: "▤", url: "/pages/merchant/orders" },
    { text: "报价", icon: "¥", url: "/pages/merchant/quote" },
    { text: "评价", icon: "☆", url: "/pages/merchant/reviews" },
  ],
};

const tabs = computed(() => tabMap[appState.role] || tabMap.elder);
const activeUrl = computed(() => {
  const pages = getCurrentPages();
  const route = pages[pages.length - 1]?.route || "";
  return `/${route}`;
});

function go(url) {
  if (activeUrl.value === url) return;
  uni.redirectTo({ url });
}
</script>

<style scoped>
.tabs {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 12rpx 14rpx calc(12rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #dbe7f5;
  border-radius: 30rpx 30rpx 0 0;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -10rpx 30rpx rgba(36, 91, 150, 0.1);
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  color: #64748b;
  font-size: 22rpx;
  font-weight: 700;
}

.tab.active {
  color: #1fbf6b;
}

.tab-icon {
  font-size: 34rpx;
  line-height: 1;
}
</style>
