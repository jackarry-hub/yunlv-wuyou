<template>
  <YlPage title="角色切换" subtitle="用户端、人工向导端、商户端共用同一套移动工程" :tabs="false">
    <YlCard>
      <button v-for="item in roles" :key="item.key" class="role-row" @click="change(item.key)">
        <view>
          <text class="role-title">{{ item.label }}</text>
          <text class="role-desc">{{ item.description }}</text>
        </view>
        <text class="role-arrow">进入</text>
      </button>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { roleDefinitions } from "../../common/roles";
import { switchRole } from "../../common/router";

const roles = roleDefinitions;

function change(role) {
  switchRole(role);
}
</script>

<style scoped>
.role-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 26rpx 0;
  border-bottom: 1rpx solid #edf2f7;
  text-align: left;
}

.role-row:last-child {
  border-bottom: 0;
}

.role-title {
  display: block;
  color: #111827;
  font-size: 31rpx;
  font-weight: 800;
}

.role-desc {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.4;
}

.role-arrow {
  flex: 0 0 auto;
  color: #1677ff;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
