<template>
  <YlPage title="云旅无忧" subtitle="请选择角色登录正式移动端" :tabs="false">
    <YlCard title="登录角色">
      <view class="role-list">
        <button v-for="item in roles" :key="item.key" class="role-item" @click="select(item.key)">
          <view>
            <text class="role-title">{{ item.title }}</text>
            <text class="role-desc">{{ item.description }}</text>
          </view>
          <YlStatusPill :text="currentRole === item.key ? '当前' : item.label" :tone="currentRole === item.key ? 'green' : 'blue'" />
        </button>
      </view>
    </YlCard>
    <YlPrimaryButton :loading="loading" text="登录并进入" @click="submit" />
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { api, toastText } from "../../common/api";
import { homeOfRole, roleDefinitions } from "../../common/roles";
import { appState, setRole } from "../../store/app-store";

const roles = roleDefinitions;
const selectedRole = ref(appState.role);
const loading = ref(false);
const currentRole = computed(() => selectedRole.value);

function select(role) {
  selectedRole.value = role;
  setRole(role);
}

async function submit() {
  loading.value = true;
  try {
    await api.login(selectedRole.value);
    uni.reLaunch({ url: homeOfRole(selectedRole.value) });
  } catch (error) {
    toastText(error.message || "登录失败");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.role-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.role-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 24rpx;
  border: 1rpx solid #dbe7f5;
  border-radius: 22rpx;
  background: #f8fbff;
  text-align: left;
}

.role-title {
  display: block;
  color: #111827;
  font-size: 30rpx;
  font-weight: 800;
}

.role-desc {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.45;
}
</style>
