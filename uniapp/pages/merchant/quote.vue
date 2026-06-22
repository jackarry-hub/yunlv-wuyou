<template>
  <YlPage title="报价确认" subtitle="对复杂服务提交服务方案和报价">
    <YlCard title="选择订单">
      <picker :range="orderNames" @change="pickOrder">
        <view class="input">{{ selectedOrder?.orderNo || "请选择订单" }}</view>
      </picker>
      <input v-model="amount" class="input" type="number" placeholder="报价金额" />
      <textarea v-model="plan" class="textarea" placeholder="服务方案说明" />
    </YlCard>
    <YlPrimaryButton text="提交报价" :loading="loading" @click="submit" />
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";

const orders = ref([]);
const index = ref(0);
const amount = ref(360);
const plan = ref("基础护理评估 + 上门服务 + 完成凭证上传");
const loading = ref(false);
const selectedOrder = computed(() => orders.value[index.value]);
const orderNames = computed(() => orders.value.map((item) => `${item.orderNo} ${item.serviceType}`));

async function load() {
  try {
    orders.value = await api.merchantOrders({ merchantId: "merchant-001" });
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
    await api.merchantOrderAction(selectedOrder.value.id, "quote", { amount: Number(amount.value), plan: plan.value });
    toastSuccess("报价已提交");
    load();
  } catch (error) {
    toastText(error.message || "报价失败");
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
  min-height: 180rpx;
  padding-top: 20rpx;
  line-height: 1.5;
}
</style>
