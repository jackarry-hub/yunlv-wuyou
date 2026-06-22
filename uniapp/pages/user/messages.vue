<template>
  <YlPage title="消息中心" subtitle="订单、活动、设备、系统消息">
    <template #action>
      <button class="read-all" @click="readAll">全部已读</button>
    </template>
    <view class="filters">
      <button v-for="item in filters" :key="item" class="filter" :class="{ active: current === item }" @click="current = item">{{ item }}</button>
    </view>
    <YlCard>
      <button v-for="item in shown" :key="item.id" class="message">
        <view>
          <text class="title">{{ item.title }}</text>
          <text class="content">{{ item.content }}</text>
        </view>
        <YlStatusPill :text="item.read ? '已读' : '未读'" :tone="item.read ? 'green' : 'orange'" />
      </button>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";

const filters = ["全部", "服务", "活动", "设备", "系统"];
const current = ref("全部");
const messages = ref([]);
const shown = computed(() => {
  if (current.value === "全部") return messages.value;
  return messages.value.filter((item) => `${item.title}${item.content}${item.scenario}`.includes(current.value));
});

async function load() {
  try {
    messages.value = await api.messages("user");
  } catch (error) {
    toastText(error.message || "消息加载失败");
  }
}

async function readAll() {
  try {
    await api.markAllMessagesRead("user");
    messages.value = messages.value.map((item) => ({ ...item, read: true }));
    toastSuccess("已全部标记已读");
    load();
  } catch (error) {
    toastText(error.message || "全部已读处理失败");
  }
}

onShow(load);
</script>

<style scoped>
.read-all {
  color: #1677ff;
  font-size: 24rpx;
  font-weight: 800;
}

.filters {
  display: flex;
  gap: 12rpx;
  margin-bottom: 18rpx;
}

.filter {
  padding: 14rpx 20rpx;
  border-radius: 999rpx;
  color: #64748b;
  background: #ffffff;
  font-size: 24rpx;
}

.filter.active {
  color: #ffffff;
  background: #1677ff;
}

.message {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
  width: 100%;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #edf2f7;
  text-align: left;
}

.title {
  display: block;
  color: #111827;
  font-size: 28rpx;
  font-weight: 800;
}

.content {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
  line-height: 1.45;
}
</style>
