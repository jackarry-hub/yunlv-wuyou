<template>
  <YlPage title="服务管理" subtitle="发布服务、上下架并等待后台审核">
    <YlCard title="新增服务">
      <view class="form">
        <input v-model="form.title" class="input" placeholder="服务名称" />
        <input v-model="form.category" class="input" placeholder="服务分类" />
        <input v-model="form.price" class="input" type="number" placeholder="价格" />
        <input v-model="form.description" class="input" placeholder="服务说明" />
      </view>
      <view class="submit">
        <YlPrimaryButton text="提交服务" :loading="loading" @click="submit" />
      </view>
    </YlCard>
    <YlCard title="已发布服务">
      <view v-for="item in services" :key="item.id" class="service">
        <view>
          <text class="title">{{ item.title }}</text>
          <text class="meta">{{ item.category }} · ¥{{ item.price }}/{{ item.unit || "次" }}</text>
        </view>
        <button class="status" @click="toggle(item)">{{ item.status }}</button>
      </view>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";

const services = ref([]);
const loading = ref(false);
const form = reactive({ title: "康复护理服务", category: "康养护理", price: 260, description: "上门康复护理与照护记录" });

async function load() {
  try {
    services.value = await api.merchantServices({ merchantId: "merchant-001" });
  } catch (error) {
    toastText(error.message || "服务加载失败");
  }
}

async function submit() {
  loading.value = true;
  try {
    await api.createMerchantService({ ...form, price: Number(form.price), providerId: "merchant-001" });
    toastSuccess("服务已提交审核");
    load();
  } catch (error) {
    toastText(error.message || "提交失败");
  } finally {
    loading.value = false;
  }
}

async function toggle(item) {
  try {
    const nextStatus = item.status === "上架" ? "下架" : "上架";
    await api.setMerchantServiceStatus(item.id, { status: nextStatus });
    toastSuccess(`服务已${nextStatus}`);
    load();
  } catch (error) {
    toastText(error.message || "服务上下架失败");
  }
}

onShow(load);
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.input {
  box-sizing: border-box;
  height: 82rpx;
  padding: 0 22rpx;
  border-radius: 20rpx;
  background: #f1f7ff;
  font-size: 26rpx;
}

.submit {
  margin-top: 20rpx;
}

.service {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #edf2f7;
}

.title {
  display: block;
  color: #111827;
  font-size: 28rpx;
  font-weight: 800;
}

.meta {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
}

.status {
  color: #1677ff;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
