<template>
  <button class="yl-btn" :class="{ 'yl-btn--ghost': ghost, 'yl-btn--danger': danger }" :disabled="disabled || loading" @click="$emit('click')">
    <text>{{ loading ? loadingText : text }}</text>
  </button>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  loadingText: { type: String, default: "处理中" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  ghost: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
});

defineEmits(["click"]);
</script>

<style scoped>
.yl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 78rpx;
  padding: 0 26rpx;
  border-radius: 22rpx;
  color: #ffffff;
  font-size: 27rpx;
  font-weight: 800;
  background: linear-gradient(135deg, #1677ff, #36c878);
  box-shadow: 0 12rpx 24rpx rgba(22, 119, 255, 0.16);
}

.yl-btn--ghost {
  color: #1677ff;
  border: 1rpx solid #c8dcf5;
  background: #f3f9ff;
  box-shadow: none;
}

.yl-btn--danger {
  background: linear-gradient(135deg, #ff5b5b, #ff8a65);
}

.yl-btn[disabled] {
  opacity: 0.62;
}

.yl-btn text {
  white-space: nowrap;
}
</style>
