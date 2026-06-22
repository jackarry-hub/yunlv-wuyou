<template>
  <view class="yl-card">
    <view class="yl-card__head" v-if="title || $slots.action">
      <text class="yl-card__title" v-if="title">{{ title }}</text>
      <slot name="action" />
    </view>
    <slot />
  </view>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
});
</script>

<style scoped>
.yl-card {
  box-sizing: border-box;
  margin-bottom: 24rpx;
  padding: 30rpx 28rpx;
  border: 1rpx solid rgba(210, 225, 241, 0.88);
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14rpx 34rpx rgba(35, 78, 125, 0.075);
}

.yl-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.yl-card__title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 850;
  line-height: 1.24;
}
</style>
