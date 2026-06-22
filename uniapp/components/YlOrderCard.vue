<template>
  <YlCard>
    <view class="order-head">
      <view>
        <text class="order-title">{{ item.serviceType || item.title || "服务订单" }}</text>
        <text class="order-no">{{ item.orderNo || item.id }}</text>
      </view>
      <YlStatusPill :text="item.status || '待处理'" :tone="tone" />
    </view>
    <view class="order-lines">
      <text>时间：{{ item.time || item.appointmentTime || "待确认" }}</text>
      <text>地点：{{ item.location || item.address || "待确认" }}</text>
      <text v-if="item.amount !== undefined">金额：¥{{ item.amount }}</text>
    </view>
    <view class="order-actions">
      <slot name="actions" />
    </view>
  </YlCard>
</template>

<script setup>
import { computed } from "vue";
import YlCard from "./YlCard.vue";
import YlStatusPill from "./YlStatusPill.vue";

const props = defineProps({
  item: { type: Object, required: true },
});

const tone = computed(() => {
  const status = props.item.status || "";
  if (/完成/.test(status)) return "green";
  if (/取消|异常|拒绝/.test(status)) return "red";
  if (/待/.test(status)) return "orange";
  return "blue";
});
</script>

<style scoped>
.order-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.order-title {
  display: block;
  color: #111827;
  font-size: 31rpx;
  font-weight: 800;
}

.order-no {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 22rpx;
}

.order-lines {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 18rpx;
  color: #64748b;
  font-size: 24rpx;
}

.order-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 22rpx;
}
</style>
