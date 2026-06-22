<template>
  <text class="yl-pill" :class="`yl-pill--${tone}`">{{ text }}</text>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  tone: { type: String, default: "blue" },
});
</script>

<style scoped>
.yl-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 700;
}

.yl-pill--blue {
  color: #1677ff;
  background: #e8f2ff;
}

.yl-pill--green {
  color: #1b9b5e;
  background: #e8f8ef;
}

.yl-pill--orange {
  color: #f97316;
  background: #fff1df;
}

.yl-pill--red {
  color: #ef4444;
  background: #ffe8e8;
}
</style>
