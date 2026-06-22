<template>
  <YlPage title="评价售后" subtitle="查看用户评价、跟进售后反馈">
    <YlCard v-for="item in reviews" :key="item.id">
      <view class="review">
        <view>
          <text class="title">{{ item.orderNo || item.serviceType || "服务评价" }}</text>
          <text class="meta">{{ item.content || item.comment || "用户已完成评价" }}</text>
        </view>
        <YlStatusPill :text="`${item.rating || 5}分`" tone="green" />
      </view>
    </YlCard>
    <YlCard v-if="!reviews.length">
      <text class="meta">暂无评价</text>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastText } from "../../common/api";

const reviews = ref([]);

async function load() {
  try {
    reviews.value = await api.merchantReviews({ merchantId: "merchant-001" });
  } catch (error) {
    toastText(error.message || "评价加载失败");
  }
}

onShow(load);
</script>

<style scoped>
.review {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.title {
  display: block;
  color: #111827;
  font-size: 28rpx;
  font-weight: 800;
}

.meta {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.45;
}
</style>
