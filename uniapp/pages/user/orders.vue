<template>
  <YlPage title="我的订单" subtitle="订单状态追踪、确认完成和取消">
    <YlOrderCard v-for="item in orders" :key="item.id" :item="item">
      <template #actions>
        <YlPrimaryButton v-if="item.status === '待确认'" text="确认评价" @click="confirm(item)" />
        <YlPrimaryButton v-if="canCancel(item)" text="取消" ghost @click="cancel(item)" />
      </template>
    </YlOrderCard>
    <YlCard v-if="!orders.length">
      <text class="empty">暂无订单</text>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";

const orders = ref([]);

async function load() {
  try {
    orders.value = await api.orders();
  } catch (error) {
    toastText(error.message || "订单加载失败");
  }
}

function canCancel(item) {
  return !["已完成", "已取消", "待确认"].includes(item.status);
}

async function confirm(item) {
  try {
    await api.confirmOrder(item.id, { rating: 5, content: "服务完成，体验满意。" });
    toastSuccess("已确认评价");
    load();
  } catch (error) {
    toastText(error.message || "确认失败");
  }
}

async function cancel(item) {
  try {
    await api.cancelOrder(item.id, { reason: "用户端取消" });
    toastSuccess("已取消");
    load();
  } catch (error) {
    toastText(error.message || "取消失败");
  }
}

onShow(load);
</script>

<style scoped>
.empty {
  color: #64748b;
  font-size: 25rpx;
}
</style>
