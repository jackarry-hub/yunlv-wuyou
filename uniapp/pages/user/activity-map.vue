<template>
  <YlPage title="活动地图" subtitle="地图点、分类筛选、活动报名和导航">
    <view class="filters">
      <button v-for="item in categories" :key="item" class="filter" :class="{ active: category === item }" @click="setCategory(item)">{{ item }}</button>
    </view>
    <YlCard title="附近活动">
      <button v-for="item in points" :key="item.id || item.title" class="activity" @click="selected = item">
        <view>
          <text class="activity-title">{{ item.title }}</text>
          <text class="activity-meta">{{ item.time }} · {{ item.location || item.place }} · {{ item.distance || "" }}</text>
        </view>
        <YlStatusPill :text="item.status || '可报名'" tone="green" />
      </button>
    </YlCard>
    <YlCard v-if="selected" title="活动操作">
      <text class="selected">{{ selected.title }}</text>
      <view class="actions">
        <YlPrimaryButton text="立即报名" :loading="loading" @click="join" />
        <YlPrimaryButton text="导航" ghost @click="navigateMap" />
      </view>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { api, toastText } from "../../common/api";
import { getCurrentLocation, openMapLocation } from "../../common/native";
import { navigate } from "../../common/router";

const category = ref("全部");
const categories = ["全部", "文化体验", "康养健身", "休闲娱乐", "自然观光", "学习讲座"];
const points = ref([]);
const selected = ref(null);
const loading = ref(false);

async function load() {
  try {
    const location = await getCurrentLocation();
    const result = await api.activityMap({ category: category.value, lat: location.latitude, lng: location.longitude });
    points.value = result.points || result.activities || result || [];
    if (!selected.value) selected.value = points.value[0] || null;
  } catch (error) {
    toastText(error.message || "活动地图加载失败");
  }
}

function setCategory(item) {
  category.value = item;
  selected.value = null;
  load();
}

async function join() {
  if (!selected.value?.id) return toastText("请选择活动");
  await api.recordUiAction({ role: "user", route: "activity-map", action: "打开活动报名", payload: { activityId: selected.value.id } }).catch(() => {});
  navigate(`/pages/user/activity-signup?id=${selected.value.id}`);
}

function navigateMap() {
  if (!selected.value) return;
  openMapLocation(selected.value);
}

onLoad((query) => {
  if (query?.id) selected.value = { id: query.id };
});
onShow(load);
</script>

<style scoped>
.filters {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
  overflow-x: auto;
}

.filter {
  flex: 0 0 auto;
  padding: 16rpx 22rpx;
  border-radius: 999rpx;
  color: #64748b;
  font-size: 24rpx;
  background: #ffffff;
}

.filter.active {
  color: #ffffff;
  background: #1677ff;
}

.activity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  width: 100%;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #edf2f7;
  text-align: left;
}

.activity-title,
.selected {
  display: block;
  color: #111827;
  font-size: 28rpx;
  font-weight: 800;
}

.activity-meta {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 22rpx;
}
</style>
