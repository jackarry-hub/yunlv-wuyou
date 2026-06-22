<template>
  <YlPage title="活动报名" subtitle="填写报名信息，咨询、分享和导航都可直接使用">
    <view class="activity-hero">
      <text class="hero-status">报名中</text>
      <text class="hero-title">{{ activity.title }}</text>
      <text class="hero-meta">{{ activity.time }} · {{ activity.place }}</text>
    </view>

    <YlCard title="报名信息">
      <view class="form-grid">
        <view class="field">
          <text>姓名</text>
          <input v-model="form.name" placeholder="请输入姓名" />
        </view>
        <view class="field">
          <text>性别</text>
          <picker :range="genderOptions" @change="pickGender">
            <view class="picker-value">{{ form.gender }}</view>
          </picker>
        </view>
        <view class="field">
          <text>年龄</text>
          <input v-model="form.age" type="number" placeholder="请输入年龄" />
        </view>
        <view class="field">
          <text>人数</text>
          <input v-model="form.peopleCount" type="number" placeholder="同行人数" />
        </view>
        <view class="field field-wide">
          <text>电话</text>
          <input v-model="form.phone" type="number" placeholder="请输入联系电话" />
        </view>
      </view>
      <view class="submit-row">
        <YlPrimaryButton text="立即报名" :loading="loading" @click="submit" />
      </view>
    </YlCard>

    <YlCard title="活动服务">
      <view class="service-actions">
        <YlPrimaryButton text="咨询" ghost :loading="loading && activeAction === 'consult'" @click="consult" />
        <YlPrimaryButton text="分享" ghost @click="prepareShare" />
        <YlPrimaryButton text="导航" ghost @click="openNavigation" />
      </view>
      <text v-if="actionStatus" class="action-status">{{ actionStatus }}</text>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";
import { openMapLocation, sharePayload } from "../../common/native";
import { navigate } from "../../common/router";

const genderOptions = ["女", "男"];
const loading = ref(false);
const activeAction = ref("");
const actionStatus = ref("");
const shareData = ref(sharePayload({ title: "云旅无忧活动报名", path: "/pages/user/activity-signup" }));
const activity = reactive({
  id: "activity-001",
  title: "湖泉生态园晨练打卡",
  time: "06-05 07:00",
  place: "湖泉生态园",
  latitude: 24.4096,
  longitude: 103.4377,
});
const form = reactive({
  name: "张晓丽",
  gender: "女",
  age: 68,
  peopleCount: 1,
  phone: "13800000000",
});

function pickGender(event) {
  form.gender = genderOptions[Number(event.detail.value)] || genderOptions[0];
}

async function submit() {
  loading.value = true;
  activeAction.value = "submit";
  try {
    await api.joinActivity(activity.id, {
      name: form.name,
      gender: form.gender,
      age: Number(form.age),
      peopleCount: Number(form.peopleCount),
      phone: form.phone,
      source: "uni-app",
    });
    actionStatus.value = "报名成功，已生成活动报名记录";
    toastSuccess("报名成功");
    navigate("/pages/user/activity-records");
  } catch (error) {
    toastText(error.message || "报名失败，请检查信息");
  } finally {
    loading.value = false;
    activeAction.value = "";
  }
}

async function consult() {
  loading.value = true;
  activeAction.value = "consult";
  try {
    await api.askAi(`咨询活动：${activity.title}`);
    actionStatus.value = "正在进入人工向导，可继续询问报名、集合和交通安排";
    navigate(`/pages/user/assistant?question=${encodeURIComponent(activity.title)}`);
  } catch (error) {
    toastText(error.message || "咨询发送失败");
  } finally {
    loading.value = false;
    activeAction.value = "";
  }
}

function prepareShare() {
  shareData.value = sharePayload({
    title: activity.title,
    path: `/pages/user/activity-signup?id=${activity.id}`,
  });
  actionStatus.value = "活动分享卡片已生成，可发送给家人或朋友";
  uni.showShareMenu({
    withShareTicket: true,
    success() {
      toastSuccess("活动分享卡片已生成");
    },
    fail() {
      toastText("活动分享卡片已生成，可通过系统菜单发送");
    },
  });
}

function openNavigation() {
  actionStatus.value = "正在打开地图并定位活动地点";
  openMapLocation(activity);
}

onLoad((query) => {
  if (query?.id) activity.id = query.id;
  if (query?.date) activity.time = `${query.date} 07:00`;
});

onShareAppMessage(() => shareData.value);
</script>

<style scoped>
.activity-hero {
  display: flex;
  flex-direction: column;
  min-height: 250rpx;
  box-sizing: border-box;
  margin-bottom: 24rpx;
  padding: 34rpx;
  border-radius: 36rpx;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(31, 147, 255, 0.9), rgba(62, 202, 128, 0.88)),
    radial-gradient(circle at 86% 22%, rgba(255, 255, 255, 0.32), transparent 30%);
  box-shadow: 0 18rpx 40rpx rgba(22, 119, 255, 0.16);
}

.hero-status {
  width: max-content;
  padding: 9rpx 18rpx;
  border-radius: 999rpx;
  color: #1677ff;
  background: #ffffff;
  font-size: 23rpx;
  font-weight: 800;
}

.hero-title {
  margin-top: 34rpx;
  font-size: 42rpx;
  font-weight: 900;
  line-height: 1.18;
}

.hero-meta {
  margin-top: 16rpx;
  font-size: 25rpx;
  font-weight: 700;
  opacity: 0.92;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.field {
  box-sizing: border-box;
  min-height: 128rpx;
  padding: 20rpx 22rpx;
  border-radius: 24rpx;
  background: #f6faff;
}

.field-wide {
  grid-column: 1 / -1;
}

.field text {
  display: block;
  color: #64748b;
  font-size: 23rpx;
  font-weight: 700;
}

.field input,
.picker-value {
  min-height: 54rpx;
  margin-top: 10rpx;
  color: #111827;
  font-size: 29rpx;
  font-weight: 800;
  line-height: 54rpx;
}

.submit-row {
  margin-top: 22rpx;
}

.service-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.action-status {
  display: block;
  margin-top: 18rpx;
  padding: 16rpx 18rpx;
  border-radius: 18rpx;
  color: #1677ff;
  background: #eef6ff;
  font-size: 23rpx;
  font-weight: 800;
}
</style>
