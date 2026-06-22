<template>
  <YlPage title="订单详情" subtitle="查看客户、地点、内容与预计收入">
    <YlOrderCard v-if="task" :item="task.order || task">
      <template #actions>
        <YlPrimaryButton v-if="task.status === '待接单'" text="接单" @click="run('accept')" />
        <YlPrimaryButton v-if="task.status === '已接单'" text="开始服务" @click="run('start')" />
        <YlPrimaryButton v-if="task.status === '服务中'" text="完成服务" @click="run('complete')" />
      </template>
    </YlOrderCard>
    <YlCard title="服务说明">
      <text class="text">{{ task?.order?.note || "请提前联系客户，按预约时间到达服务地点。" }}</text>
    </YlCard>
    <YlPrimaryButton text="异常上报" ghost @click="report" />
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";
import { navigate } from "../../common/router";

const id = ref("");
const tasks = ref([]);
const task = computed(() => tasks.value.find((item) => item.id === id.value) || tasks.value[0]);

async function load() {
  try {
    const dashboard = await api.guideDashboard();
    tasks.value = dashboard.tasks || [];
  } catch (error) {
    toastText(error.message || "订单详情加载失败");
  }
}

async function run(action) {
  if (!task.value) return;
  try {
    await api.taskAction(task.value.id, action, { evidence: "uni-app 端提交服务记录" });
    toastSuccess(action === "accept" ? "接单成功" : action === "start" ? "已开始服务" : "服务完成已提交");
    load();
  } catch (error) {
    toastText(error.message || "订单状态处理失败");
  }
}

function report() {
  navigate(`/pages/guide/exception?taskId=${task.value?.id || ""}`);
}

onLoad((query) => {
  id.value = query?.id || "";
});
onShow(load);
</script>

<style scoped>
.text {
  color: #64748b;
  font-size: 26rpx;
  line-height: 1.55;
}
</style>
