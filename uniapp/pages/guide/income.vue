<template>
  <YlPage title="今日收入" subtitle="收入、评价和结算记录">
    <YlCard title="收入概览">
      <view class="stats">
        <view><text class="num">¥{{ income.todayIncome || 0 }}</text><text class="label">今日收入</text></view>
        <view><text class="num">¥{{ income.monthIncome || 0 }}</text><text class="label">本月收入</text></view>
        <view><text class="num">{{ income.completedCount || 0 }}</text><text class="label">完成单量</text></view>
      </view>
    </YlCard>
    <YlCard title="收入明细">
      <view v-for="item in records" :key="item.id || item.orderNo" class="record">
        <text>{{ item.orderNo || item.title }}</text>
        <text>¥{{ item.amount || item.income || 0 }}</text>
      </view>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastText } from "../../common/api";

const income = ref({});
const records = computed(() => income.value.records || income.value.orders || []);

async function load() {
  try {
    income.value = await api.guideIncome();
  } catch (error) {
    toastText(error.message || "收入加载失败");
  }
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
  font-size: 32rpx;
  font-weight: 900;
}

.label {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 22rpx;
}

.record {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #edf2f7;
  color: #111827;
  font-size: 25rpx;
}
</style>
