<template>
  <YlPage title="提交订单" subtitle="统一下单表单，进入后台派单和执行闭环">
    <YlCard title="服务信息">
      <view class="form">
        <input v-model="form.serviceType" class="input" placeholder="服务类型，如陪伴就医" />
        <picker :range="providerOptions" @change="pickProvider">
          <view class="input">执行方：{{ form.providerType === "merchant" ? "商户" : "人工向导" }}</view>
        </picker>
        <input v-model="form.time" class="input" placeholder="服务时间" />
        <input v-model="form.location" class="input" placeholder="服务地点" />
        <input v-model="form.note" class="input" placeholder="补充需求" />
      </view>
    </YlCard>
    <YlPrimaryButton text="提交订单" :loading="loading" @click="submit" />
  </YlPage>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";
import { navigate } from "../../common/router";

const providerOptions = ["人工向导", "商户"];
const loading = ref(false);
const form = reactive({
  serviceType: "陪伴就医",
  providerType: "guide",
  time: "明日 09:30",
  location: "昆明滇池康养公寓",
  note: "老人行动较慢，请提前联系家属",
});

function pickProvider(event) {
  form.providerType = Number(event.detail.value) === 1 ? "merchant" : "guide";
}

async function submit() {
  loading.value = true;
  try {
    await api.createOrder({ ...form, amount: form.providerType === "merchant" ? 260 : 120 });
    toastSuccess("订单已提交");
    navigate("/pages/user/orders");
  } catch (error) {
    toastText(error.message || "提交失败");
  } finally {
    loading.value = false;
  }
}

onLoad((query) => {
  if (query.serviceType) form.serviceType = decodeURIComponent(query.serviceType);
  if (query.providerType) form.providerType = query.providerType;
});
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.input {
  box-sizing: border-box;
  min-height: 84rpx;
  padding: 0 22rpx;
  border-radius: 20rpx;
  background: #f1f7ff;
  color: #111827;
  font-size: 26rpx;
  line-height: 84rpx;
}
</style>
