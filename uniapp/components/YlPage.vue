<template>
  <view class="yl-page">
    <view class="yl-page__safe">
      <view class="yl-page__header" v-if="title || subtitle">
        <view class="yl-page__copy">
          <text class="yl-page__title">{{ title }}</text>
          <text class="yl-page__subtitle" v-if="subtitle">{{ subtitle }}</text>
        </view>
        <slot name="action" />
      </view>
      <slot />
    </view>
    <YlRoleTabs v-if="tabs" />
  </view>
</template>

<script setup>
import YlRoleTabs from "./YlRoleTabs.vue";

defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  tabs: { type: Boolean, default: true },
});
</script>

<style scoped>
.yl-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: calc(142rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(circle at 15% 0%, rgba(206, 234, 255, 0.86), transparent 34%),
    linear-gradient(180deg, #f1f8ff 0%, #f7fbff 46%, #eef6ff 100%);
}

.yl-page__safe {
  width: 100%;
  max-width: 750rpx;
  min-height: calc(100vh - 142rpx);
  box-sizing: border-box;
  margin: 0 auto;
  padding: 26rpx 24rpx 0;
}

.yl-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 22rpx;
  padding: 2rpx 2rpx 0;
}

.yl-page__copy {
  min-width: 0;
  flex: 1;
}

.yl-page__title {
  display: block;
  color: #111827;
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1.18;
}

.yl-page__subtitle {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.45;
}
</style>
