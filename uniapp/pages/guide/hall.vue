<template>
  <YlPage title="接单大厅" subtitle="上线接单、查看待接订单并抢单/接单">
    <YlCard title="今日概览">
      <view class="stats">
        <view><text class="num">{{ stats.pendingOrders || 0 }}</text><text class="label">待接单</text></view>
        <view><text class="num">{{ stats.activeTasks || 0 }}</text><text class="label">服务中</text></view>
        <view><text class="num">¥{{ stats.todayIncome || 0 }}</text><text class="label">今日收入</text></view>
      </view>
      <view class="actions">
        <YlPrimaryButton text="切换上线状态" ghost @click="toggleOnline" />
        <YlPrimaryButton text="接下一单" @click="claim" />
      </view>
    </YlCard>

    <YlCard title="服务类型筛选">
      <scroll-view class="type-strip" scroll-x>
        <button
          v-for="item in serviceTypes"
          :key="item"
          class="type-chip"
          :class="{ 'type-chip--active': activeServiceType === item }"
          @click="selectServiceType(item)"
        >
          <text>{{ item }}</text>
          <text class="type-count">{{ serviceTypeCount(item) }}</text>
        </button>
      </scroll-view>
      <view class="filter-summary">
        <text>{{ activeServiceType }} · {{ taskCards.length }} 单</text>
        <button class="refresh" @click="load">刷新</button>
      </view>
    </YlCard>

    <YlOrderCard v-for="item in taskCards" :key="item.id" :item="item.order || item">
      <template #actions>
        <YlPrimaryButton v-if="item.status === '待接单'" text="接单" @click="taskAction(item, 'accept')" />
        <YlPrimaryButton text="查看" ghost @click="openDetail(item)" />
      </template>
    </YlOrderCard>
    <YlCard v-if="!taskCards.length">
      <text class="empty">当前服务类型暂无待处理订单</text>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";
import { navigate } from "../../common/router";

const serviceTypes = ["全部", "陪伴就医", "导游游览", "护工护理", "接送出行", "帮办代办", "生活陪伴"];
const dashboard = ref({});
const activeServiceType = ref("全部");
const stats = computed(() => dashboard.value.stats || {});
const allTasks = computed(() => dashboard.value.tasks || []);
const taskCards = computed(() => allTasks.value.filter((item) => matchesServiceType(item, activeServiceType.value)));

function taskServiceType(item) {
  return item.order?.requirementCategory || item.order?.serviceType || item.serviceType || "未分类";
}

function matchesServiceType(item, serviceType) {
  if (!serviceType || serviceType === "全部") return true;
  return taskServiceType(item) === serviceType || item.order?.serviceType === serviceType;
}

function serviceTypeCount(serviceType) {
  if (serviceType === "全部") return allTasks.value.length;
  return allTasks.value.filter((item) => matchesServiceType(item, serviceType)).length;
}

async function load() {
  try {
    dashboard.value = await api.guideDashboard();
  } catch (error) {
    toastText(error.message || "接单大厅加载失败");
  }
}

function selectServiceType(item) {
  activeServiceType.value = item;
}

async function toggleOnline() {
  try {
    const result = await api.setGuideOnline({ guideId: "guide-001" });
    toastSuccess(result.onlineStatus === "在线" ? "已上线接单" : "已停止接单");
    load();
  } catch (error) {
    toastText(error.message || "接单开关保存失败");
  }
}

async function claim() {
  try {
    const payload = activeServiceType.value === "全部" ? {} : { serviceType: activeServiceType.value };
    await api.claimGuideTask(payload);
    toastSuccess("接单成功");
    load();
  } catch (error) {
    toastText(error.message || `暂无可接${activeServiceType.value === "全部" ? "" : activeServiceType.value}订单`);
  }
}

async function taskAction(item, action) {
  try {
    await api.taskAction(item.id, action);
    toastSuccess(action === "accept" ? "接单成功" : action === "start" ? "已开始服务" : "服务完成已提交");
    load();
  } catch (error) {
    toastText(error.message || "任务操作失败");
  }
}

function openDetail(item) {
  navigate(`/pages/guide/order-detail?id=${item.id}`);
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
  font-size: 36rpx;
  font-weight: 900;
}

.label {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 24rpx;
}

.type-strip {
  width: 100%;
  white-space: nowrap;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  min-width: 150rpx;
  min-height: 62rpx;
  margin-right: 14rpx;
  padding: 0 22rpx;
  border-radius: 999rpx;
  color: #475569;
  font-size: 24rpx;
  font-weight: 800;
  background: #f1f7ff;
}

.type-chip--active {
  color: #ffffff;
  background: linear-gradient(135deg, #1677ff, #36c878);
}

.type-count {
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  color: #1677ff;
  font-size: 20rpx;
  line-height: 32rpx;
  text-align: center;
  background: #ffffff;
}

.filter-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18rpx;
  color: #64748b;
  font-size: 23rpx;
}

.refresh {
  color: #1677ff;
  font-size: 23rpx;
  font-weight: 800;
}

.empty {
  color: #64748b;
  font-size: 25rpx;
}
</style>
