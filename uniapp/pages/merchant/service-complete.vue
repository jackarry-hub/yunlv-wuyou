<template>
  <YlPage title="完成服务" subtitle="上传完成说明并回传用户端确认评价">
    <YlCard title="完成上报">
      <picker :range="orderNames" @change="pickOrder">
        <view class="input">{{ selectedOrder?.orderNo || "请选择订单" }}</view>
      </picker>
      <textarea v-model="evidence" class="textarea" placeholder="服务完成说明" />
    </YlCard>
    <YlPrimaryButton text="提交完成" :loading="loading" @click="submit" />
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";

const orders = ref([]);
const index = ref(0);
const evidence = ref("已按预约完成服务，用户现场确认服务过程正常。");
const loading = ref(false);
const selectedOrder = computed(() => orders.value[index.value]);
const orderNames = computed(() => orders.value.map((item) => `${item.orderNo} ${item.serviceType}`));

async function load() {
  try {
    const rows = await api.merchantOrders({ merchantId: "merchant-001" });
    orders.value = rows.filter((item) => item.status === "服务中");
    if (index.value >= orders.value.length) index.value = 0;
  } catch (error) {
    toastText(error.message || "订单加载失败");
  }
}

function pickOrder(event) {
  index.value = Number(event.detail.value);
}

async function submit() {
  if (!selectedOrder.value) return toastText("请选择订单");
  loading.value = true;
  try {
    await api.merchantOrderAction(selectedOrder.value.id, "complete", { merchantId: "merchant-001", evidence: evidence.value });
    toastSuccess("服务完成已提交");
    load();
  } catch (error) {
    toastText(error.message || "完成上报提交失败");
  } finally {
    loading.value = false;
  }
}

onShow(load);
</script>

<style scoped>
.input,
.textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 84rpx;
  margin-bottom: 16rpx;
  padding: 0 22rpx;
  border-radius: 20rpx;
  background: #f1f7ff;
  font-size: 26rpx;
  line-height: 84rpx;
}

.textarea {
  min-height: 200rpx;
  padding-top: 20rpx;
  line-height: 1.5;
}
</style>
