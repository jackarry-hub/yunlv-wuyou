<template>
  <view class="yl-grid">
    <button v-for="item in items" :key="item.text" class="yl-grid__item" @click="$emit('select', item)">
      <view class="yl-grid__icon" :class="`yl-grid__icon--${item.tone || 'blue'}`">
        <text>{{ item.icon || item.text.slice(0, 1) }}</text>
      </view>
      <text class="yl-grid__text">{{ item.text }}</text>
      <text class="yl-grid__sub" v-if="item.sub">{{ item.sub }}</text>
    </button>
  </view>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
});

defineEmits(["select"]);
</script>

<style scoped>
.yl-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24rpx 18rpx;
}

.yl-grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.yl-grid__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86rpx;
  height: 86rpx;
  border-radius: 28rpx;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 900;
}

.yl-grid__icon--green {
  background: linear-gradient(135deg, #52d273, #27b863);
}

.yl-grid__icon--blue {
  background: linear-gradient(135deg, #60a5fa, #1677ff);
}

.yl-grid__icon--orange {
  background: linear-gradient(135deg, #ffbd4a, #ff7a45);
}

.yl-grid__icon--purple {
  background: linear-gradient(135deg, #b985ff, #8b5cf6);
}

.yl-grid__text {
  color: #111827;
  font-size: 25rpx;
  font-weight: 750;
}

.yl-grid__sub {
  color: #8a95a6;
  font-size: 21rpx;
}
</style>
