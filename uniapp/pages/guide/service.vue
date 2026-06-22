<template>
  <YlPage title="服务中" subtitle="路线导航、联系客户、服务清单和完成上报">
    <YlOrderCard v-if="activeTask" :item="activeTask.order || activeTask">
      <template #actions>
        <YlPrimaryButton v-if="activeTask.status === '已接单'" text="开始服务" @click="run('start')" />
        <YlPrimaryButton text="完成服务" @click="run('complete')" />
      </template>
    </YlOrderCard>
    <YlCard title="服务清单">
      <view class="checks">
        <label v-for="item in checks" :key="item" class="check">
          <checkbox :value="item" :checked="done.includes(item)" @click="toggle(item)" />
          <text>{{ item }}</text>
        </label>
      </view>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";

const tasks = ref([]);
const done = ref([]);
const checks = ["已联系客户", "已到达服务地点", "已完成核心服务", "已上传服务记录"];
const activeTask = computed(() => tasks.value.find((item) => ["已接单", "服务中"].includes(item.status)) || tasks.value[0]);

async function load() {
  try {
    const dashboard = await api.guideDashboard();
    tasks.value = dashboard.tasks || [];
  } catch (error) {
    toastText(error.message || "服务任务加载失败");
  }
}

function toggle(item) {
  done.value = done.value.includes(item) ? done.value.filter((v) => v !== item) : [...done.value, item];
}

async function run(action) {
  if (!activeTask.value) return toastText("暂无服务任务");
  try {
    await api.taskAction(activeTask.value.id, action, { evidence: done.value.join("、") || "服务过程记录" });
    toastSuccess(action === "complete" ? "服务完成已提交" : "已开始服务");
    load();
  } catch (error) {
    toastText(error.message || "服务状态处理失败");
  }
}

onShow(load);
</script>

<style scoped>
.checks {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.check {
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: #111827;
  font-size: 26rpx;
}
</style>
