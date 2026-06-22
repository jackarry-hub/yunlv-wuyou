<template>
  <YlPage title="异常上报" subtitle="客户临时取消、失联、时间变更或突发情况">
    <YlCard title="异常信息">
      <view class="form">
        <picker :range="types" @change="pick">
          <view class="input">异常类型：{{ form.type }}</view>
        </picker>
        <input v-model="form.location" class="input" placeholder="发生地点" />
        <textarea v-model="form.description" class="textarea" placeholder="请描述异常原因和当前处理情况" />
      </view>
    </YlCard>
    <YlPrimaryButton text="提交异常" :loading="loading" @click="submit" />
  </YlPage>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";

const types = ["客户临时取消", "客户失联", "时间变更", "突发情况", "其他问题"];
const loading = ref(false);
const form = reactive({
  taskId: "",
  type: "客户临时取消",
  level: "中",
  location: "服务地点",
  description: "客户临时调整安排，请后台协助跟进。",
});

function pick(event) {
  form.type = types[Number(event.detail.value)] || types[0];
}

async function submit() {
  loading.value = true;
  try {
    await api.reportGuideException({ ...form });
    toastSuccess("异常已上报");
  } catch (error) {
    toastText(error.message || "上报失败");
  } finally {
    loading.value = false;
  }
}

onLoad((query) => {
  form.taskId = query?.taskId || "";
});
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.input,
.textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 84rpx;
  padding: 0 22rpx;
  border-radius: 20rpx;
  background: #f1f7ff;
  color: #111827;
  font-size: 26rpx;
  line-height: 84rpx;
}

.textarea {
  min-height: 180rpx;
  padding-top: 20rpx;
  line-height: 1.5;
}
</style>
