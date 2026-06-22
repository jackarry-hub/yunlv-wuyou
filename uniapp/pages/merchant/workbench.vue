<template>
  <YlPage title="商户工作台" subtitle="服务、订单、结算和评价概览">
    <YlCard title="今日经营">
      <view class="stats">
        <view><text class="num">{{ stats.activeOrders || 0 }}</text><text class="label">服务中</text></view>
        <view><text class="num">{{ stats.serviceCount || 0 }}</text><text class="label">服务项目</text></view>
        <view><text class="num">¥{{ stats.settlementPending || 0 }}</text><text class="label">待结算</text></view>
      </view>
    </YlCard>
    <YlCard title="经营工具">
      <YlActionGrid :items="items" @select="open" />
    </YlCard>
    <YlCard title="最新预约">
      <YlOrderCard v-for="item in orders.slice(0, 3)" :key="item.id" :item="item" />
    </YlCard>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastText } from "../../common/api";
import { navigate } from "../../common/router";

const dashboard = ref({});
const stats = computed(() => dashboard.value.stats || {});
const orders = computed(() => dashboard.value.orders || []);
const items = [
  { text: "发布服务", icon: "服", tone: "blue", url: "/pages/merchant/services" },
  { text: "预约订单", icon: "订", tone: "green", url: "/pages/merchant/orders" },
  { text: "报价确认", icon: "价", tone: "orange", url: "/pages/merchant/quote" },
  { text: "完成服务", icon: "完", tone: "purple", url: "/pages/merchant/service-complete" },
  { text: "评价售后", icon: "评", tone: "blue", url: "/pages/merchant/reviews" },
];

async function load() {
  try {
    dashboard.value = await api.merchantDashboard();
  } catch (error) {
    toastText(error.message || "工作台加载失败");
  }
}

function open(item) {
  navigate(item.url);
}

onShow(load);
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  text-align: center;
}

.num {
  display: block;
  color: #111827;
  font-size: 34rpx;
  font-weight: 900;
}

.label {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
}
</style>
