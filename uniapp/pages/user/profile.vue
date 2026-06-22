<template>
  <YlPage title="我的" subtitle="个人资料可编辑，保存后同步后台老人档案">
    <YlCard title="用户资料">
      <view class="profile-summary">
        <view class="avatar">
          <text>{{ avatarText }}</text>
        </view>
        <view class="summary-copy">
          <text class="name">{{ displayName }}</text>
          <text class="meta">{{ displayMeta }}</text>
          <text class="health">{{ healthMeta }}</text>
        </view>
      </view>
    </YlCard>

    <YlCard title="基础资料">
      <view class="form-grid">
        <view class="field">
          <text class="label">昵称</text>
          <input v-model="form.nickname" class="input" placeholder="请输入昵称" />
        </view>
        <view class="field">
          <text class="label">手机号</text>
          <input v-model="form.phone" class="input" type="number" maxlength="11" placeholder="请输入手机号" />
        </view>
        <view class="field">
          <text class="label">真实姓名</text>
          <input v-model="form.name" class="input" placeholder="请输入真实姓名" />
        </view>
        <view class="field">
          <text class="label">性别</text>
          <picker :range="genderOptions" @change="pickGender">
            <view class="input picker-value">{{ form.gender || "请选择" }}</view>
          </picker>
        </view>
        <view class="field">
          <text class="label">年龄</text>
          <input v-model="form.age" class="input" type="number" placeholder="请输入年龄" />
        </view>
        <view class="field">
          <text class="label">旅居城市</text>
          <input v-model="form.city" class="input" placeholder="请输入城市" />
        </view>
      </view>
      <view class="field field--full">
        <text class="label">常住地址</text>
        <input v-model="form.address" class="input" placeholder="请输入常住地址" />
      </view>
    </YlCard>

    <YlCard title="健康资料">
      <view class="form-grid">
        <view class="field">
          <text class="label">血型</text>
          <input v-model="form.bloodType" class="input" placeholder="如 A 型" />
        </view>
        <view class="field">
          <text class="label">风险等级</text>
          <input v-model="form.riskLevel" class="input" placeholder="如 低风险" />
        </view>
      </view>
      <view class="field field--full">
        <text class="label">过敏史</text>
        <input v-model="form.allergies" class="input" placeholder="请输入过敏史" />
      </view>
      <view class="field field--full">
        <text class="label">常用药</text>
        <input v-model="form.medicines" class="input" placeholder="请输入常用药" />
      </view>
      <view class="field field--full">
        <text class="label">健康标签</text>
        <input v-model="form.healthTagsText" class="input" placeholder="用顿号或逗号分隔，如 高血压、糖尿病" />
      </view>
    </YlCard>

    <view class="actions">
      <YlPrimaryButton text="保存资料" loading-text="保存中" :loading="saving" @click="saveProfile" />
      <YlPrimaryButton text="恢复服务端资料" ghost :disabled="saving" @click="load" />
    </view>

    <YlCard title="常用入口">
      <YlActionGrid :items="items" @select="open" />
    </YlCard>
    <YlPrimaryButton text="切换角色端" ghost @click="openRoleSelector" />
  </YlPage>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastSuccess, toastText } from "../../common/api";
import { navigate, openRoleSelector } from "../../common/router";

const genderOptions = ["女", "男", "其他"];
const profile = ref({});
const saving = ref(false);
const form = reactive({
  nickname: "",
  phone: "",
  name: "",
  gender: "",
  age: "",
  city: "",
  address: "",
  bloodType: "",
  allergies: "",
  medicines: "",
  riskLevel: "",
  healthTagsText: "",
});

const items = [
  { text: "我的订单", icon: "订", tone: "blue", url: "/pages/user/orders" },
  { text: "消息中心", icon: "消", tone: "green", url: "/pages/user/messages" },
  { text: "紧急求助", icon: "SOS", tone: "orange", url: "/pages/user/emergency" },
  { text: "活动地图", icon: "活", tone: "purple", url: "/pages/user/activity-map" },
];

const elder = computed(() => profile.value?.elderProfile || profile.value?.elder || {});
const user = computed(() => profile.value?.user || {});
const displayName = computed(() => form.name || elder.value.name || form.nickname || user.value.nickname || "旅居用户");
const avatarText = computed(() => (displayName.value || "旅").slice(0, 1));
const displayMeta = computed(() => {
  const age = form.age || elder.value.age || "--";
  const city = form.city || elder.value.city || "城市待完善";
  return `${age}岁 · ${city}`;
});
const healthMeta = computed(() => {
  const bloodType = form.bloodType || elder.value.bloodType || "血型待完善";
  const riskLevel = form.riskLevel || elder.value.riskLevel || "风险待评估";
  return `${bloodType} · ${riskLevel}`;
});

function applyProfile(data = {}) {
  profile.value = data;
  const nextUser = data.user || {};
  const nextElder = data.elderProfile || data.elder || {};
  form.nickname = nextUser.nickname || "";
  form.phone = nextUser.phone || "";
  form.name = nextElder.name || "";
  form.gender = nextElder.gender || "";
  form.age = nextElder.age === undefined || nextElder.age === null ? "" : String(nextElder.age);
  form.city = nextElder.city || "";
  form.address = nextElder.address || "";
  form.bloodType = nextElder.bloodType || "";
  form.allergies = nextElder.allergies || "";
  form.medicines = nextElder.medicines || "";
  form.riskLevel = nextElder.riskLevel || "";
  form.healthTagsText = Array.isArray(nextElder.healthTags) ? nextElder.healthTags.join("、") : "";
}

async function load() {
  try {
    applyProfile(await api.userProfile());
  } catch (error) {
    toastText(error.message || "资料加载失败");
  }
}

function pickGender(event) {
  form.gender = genderOptions[Number(event.detail.value)] || genderOptions[0];
}

function parseHealthTags(value) {
  return value
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function validate() {
  const age = Number(form.age);
  if (!form.nickname.trim()) return "请填写昵称";
  if (!/^1\d{10}$/.test(form.phone.trim())) return "请填写 11 位手机号";
  if (!form.name.trim()) return "请填写真实姓名";
  if (!Number.isFinite(age) || age < 1 || age > 120) return "请填写有效年龄";
  if (!form.city.trim()) return "请填写旅居城市";
  if (!form.address.trim()) return "请填写常住地址";
  return "";
}

async function saveProfile() {
  const errorMessage = validate();
  if (errorMessage) {
    toastText(errorMessage);
    return;
  }
  saving.value = true;
  try {
    await api.updateUserProfile({
      nickname: form.nickname.trim(),
      phone: form.phone.trim(),
    });
    await api.updateElderProfile({
      name: form.name.trim(),
      gender: form.gender || "女",
      age: Number(form.age),
      city: form.city.trim(),
      address: form.address.trim(),
      bloodType: form.bloodType.trim(),
      allergies: form.allergies.trim(),
      medicines: form.medicines.trim(),
      riskLevel: form.riskLevel.trim(),
      healthTags: parseHealthTags(form.healthTagsText),
    });
    await load();
    toastSuccess("资料已保存");
  } catch (error) {
    toastText(error.message || "资料保存失败");
  } finally {
    saving.value = false;
  }
}

function open(item) {
  navigate(item.url);
}

onShow(load);
</script>

<style scoped>
.profile-summary {
  display: flex;
  align-items: center;
  gap: 22rpx;
}

.avatar {
  display: flex;
  flex: 0 0 104rpx;
  align-items: center;
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  border-radius: 32rpx;
  color: #ffffff;
  font-size: 42rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #1677ff, #36c878);
}

.summary-copy {
  min-width: 0;
  flex: 1;
}

.name {
  display: block;
  color: #111827;
  font-size: 36rpx;
  font-weight: 900;
}

.meta,
.health {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.4;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.field {
  min-width: 0;
}

.field--full {
  margin-top: 18rpx;
}

.label {
  display: block;
  margin-bottom: 10rpx;
  color: #475569;
  font-size: 22rpx;
  font-weight: 800;
}

.input {
  box-sizing: border-box;
  width: 100%;
  min-height: 78rpx;
  padding: 0 20rpx;
  border-radius: 20rpx;
  background: #f1f7ff;
  color: #111827;
  font-size: 25rpx;
  line-height: 78rpx;
}

.picker-value {
  color: #111827;
}

.actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18rpx;
  margin-bottom: 24rpx;
}
</style>
