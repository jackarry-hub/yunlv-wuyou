<template>
  <YlPage title="紧急求助" subtitle="一键 SOS、位置上传、通知联系人和后台">
    <YlCard>
      <view class="sos-box">
        <button class="sos" :disabled="loading" @click="trigger">SOS</button>
        <text class="sos-text">点击后生成求助记录并通知后台/联系人</text>
      </view>
    </YlCard>
    <YlCard title="紧急联系人">
      <button v-for="item in contacts" :key="item.id" class="contact" @click="call(item)">
        <view>
          <text class="name">{{ item.name }}</text>
          <text class="phone">{{ item.relation }} · {{ item.phone }}</text>
        </view>
        <text class="call">拨打</text>
      </button>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";
import { callPhone, getCurrentLocation } from "../../common/native";

const contacts = ref([]);
const loading = ref(false);

async function load() {
  try {
    contacts.value = await api.familyContacts();
  } catch (error) {
    toastText(error.message || "联系人加载失败");
  }
}

async function trigger() {
  loading.value = true;
  try {
    const location = await getCurrentLocation();
    await api.triggerSos({
      location: "当前位置",
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      description: "用户端 uni-app 一键 SOS 触发",
    });
    toastSuccess("SOS 已提交");
  } catch (error) {
    toastText(error.message || "SOS 提交失败");
  } finally {
    loading.value = false;
  }
}

function call(item) {
  callPhone(item.phone);
}

onShow(load);
</script>

<style scoped>
.sos-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.sos {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 260rpx;
  height: 260rpx;
  border-radius: 130rpx;
  color: #ffffff;
  font-size: 68rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #ff4d4f, #ff8a65);
  box-shadow: 0 18rpx 42rpx rgba(239, 68, 68, 0.28);
}

.sos-text,
.phone {
  color: #64748b;
  font-size: 24rpx;
}

.contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #edf2f7;
  text-align: left;
}

.name {
  display: block;
  color: #111827;
  font-size: 29rpx;
  font-weight: 800;
}

.call {
  color: #1677ff;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
