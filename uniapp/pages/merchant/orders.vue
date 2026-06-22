<template>
  <YlPage title="预约订单" subtitle="接收预约、确认或拒绝用户服务需求">
    <YlOrderCard v-for="item in orders" :key="item.id" :item="item">
      <template #actions>
        <YlPrimaryButton v-if="canConfirm(item)" text="确认预约" @click="action(item, 'confirm')" />
        <YlPrimaryButton v-if="canConfirm(item)" text="拒绝" ghost @click="action(item, 'reject')" />
        <YlPrimaryButton v-if="item.status === '待服务'" text="开始服务" @click="action(item, 'start')" />
        <YlPrimaryButton v-if="item.status === '服务中'" text="完成上报" @click="action(item, 'complete')" />
      </template>
    </YlOrderCard>
  </YlPage>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";

const orders = ref([]);

async function load() {
  try {
    orders.value = await api.merchantOrders({ merchantId: "merchant-001" });
  } catch (error) {
    toastText(error.message || "预约订单加载失败");
  }
}

function canConfirm(item) {
  return ["待派单", "待报价", "已报价"].includes(item.status);
}

async function action(item, name) {
  try {
    await api.merchantOrderAction(item.id, name, { merchantId: "merchant-001" });
    const successText = { confirm: "已确认预约", reject: "已拒绝预约", start: "已开始服务", complete: "完成上报已提交" };
    toastSuccess(successText[name] || "订单已更新");
    load();
  } catch (error) {
    toastText(error.message || "预约订单处理失败");
  }
}

onShow(load);
</script>
