<template>
  <YlPage title="活动日历" :subtitle="`${monthTitle} · ${selectedDateText}`">
    <YlCard title="选择日期">
      <view class="calendar-head">
        <button @click="changeMonth(-1)">上月</button>
        <text>{{ monthTitle }}</text>
        <button @click="changeMonth(1)">下月</button>
      </view>
      <text class="calendar-status">{{ calendarStatus }}</text>
      <view class="week-row">
        <text v-for="item in weekDays" :key="item">{{ item }}</text>
      </view>
      <view class="day-grid">
        <button
          v-for="item in calendarDays"
          :key="item.key || item.placeholder"
          class="day"
          :class="{ active: selectedDate === item.key, marked: item.hasEvent, muted: !item.key }"
          :disabled="!item.key"
          @click="selectDate(item.key)"
        >
          <text>{{ item.day }}</text>
          <view v-if="item.hasEvent" class="dot" />
        </button>
      </view>
    </YlCard>

    <YlCard :title="selectedDateText">
      <view class="event-list">
        <view v-for="item in selectedEvents" :key="item.id" class="event-card">
          <view>
            <text class="event-title">{{ item.title }}</text>
            <text class="event-meta">{{ item.time }} · {{ item.place }}</text>
          </view>
          <YlStatusPill :text="item.status" tone="green" />
          <view class="event-actions">
            <YlPrimaryButton text="去报名" @click="goSignup(item)" />
            <YlPrimaryButton :text="item.reminded ? '取消提醒' : '活动提醒'" ghost @click="toggleReminder(item)" />
          </view>
        </view>
      </view>
    </YlCard>
  </YlPage>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { api, toastText } from "../../common/api";
import { navigate } from "../../common/router";

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
const currentMonth = ref(startOfMonth(new Date()));
const selectedDate = ref(dateKey(new Date()));
const remoteActivities = ref([]);
const reminderState = ref({});
const calendarStatus = ref("请选择日期查看当天活动");

const seedEvents = [
  { id: "activity-001", dayOffset: 0, title: "湖泉生态园晨练打卡", time: "07:00", place: "湖泉生态园", status: "报名中", reminded: false },
  { id: "activity-002", dayOffset: 2, title: "非遗陶艺体验", time: "15:00", place: "可邑小镇非遗工坊", status: "报名中", reminded: true },
  { id: "activity-003", dayOffset: 5, title: "健康知识讲座", time: "10:00", place: "云旅之家活动室", status: "即将开始", reminded: false },
];

const monthTitle = computed(() => `${currentMonth.value.getFullYear()}年${currentMonth.value.getMonth() + 1}月`);
const selectedDateText = computed(() => {
  const date = parseDateKey(selectedDate.value);
  return `${date.getMonth() + 1}月${date.getDate()}日活动`;
});

const normalizedEvents = computed(() => {
  const fromApi = remoteActivities.value.map((activity, index) => ({
    id: activity.id || `remote-${index}`,
    date: normalizeActivityDate(activity, index),
    title: activity.title || "旅居活动",
    time: activity.time || "待确认时间",
    place: activity.location || activity.place || "待确认地点",
    status: activity.status || "报名中",
    reminded: Boolean(reminderState.value[activity.id || `remote-${index}`]),
  }));
  if (fromApi.length) return fromApi;
  return seedEvents.map((event) => ({
    ...event,
    date: dateKey(offsetDate(new Date(), event.dayOffset)),
    reminded: reminderState.value[event.id] ?? event.reminded,
  }));
});

const selectedEvents = computed(() => {
  const matched = normalizedEvents.value.filter((item) => item.date === selectedDate.value);
  return matched.length ? matched : normalizedEvents.value.slice(0, 2);
});

const markedDates = computed(() => new Set(normalizedEvents.value.map((item) => item.date)));
const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const first = new Date(year, month, 1);
  const total = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: first.getDay() }, (_, index) => ({ placeholder: `blank-${index}`, day: "" }));
  const days = Array.from({ length: total }, (_, index) => {
    const day = index + 1;
    const key = dateKey(new Date(year, month, day));
    return { day, key, hasEvent: markedDates.value.has(key) };
  });
  return [...blanks, ...days];
});

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function offsetDate(date, offset) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function normalizeActivityDate(activity, index) {
  const match = String(activity.time || "").match(/(\d{1,2})[-/.月](\d{1,2})/);
  if (match) {
    const year = currentMonth.value.getFullYear();
    return dateKey(new Date(year, Number(match[1]) - 1, Number(match[2])));
  }
  return dateKey(offsetDate(new Date(), index));
}

function changeMonth(delta) {
  const next = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + delta, 1);
  currentMonth.value = next;
  selectedDate.value = dateKey(next);
  calendarStatus.value = `${monthTitle.value}活动已加载`;
}

function selectDate(key) {
  selectedDate.value = key;
  calendarStatus.value = `${selectedDateText.value}已展示`;
}

function goSignup(item) {
  navigate(`/pages/user/activity-signup?id=${item.id}&date=${selectedDate.value}`);
}

async function toggleReminder(item) {
  const next = !item.reminded;
  reminderState.value = { ...reminderState.value, [item.id]: next };
  try {
    await api.recordUiAction({
      role: "user",
      route: "activity-calendar",
      action: next ? "开启活动提醒" : "取消活动提醒",
      payload: { activityId: item.id, date: selectedDate.value },
    });
    calendarStatus.value = next ? "活动开始前30分钟提醒已开启" : "活动提醒已取消";
  } catch (error) {
    reminderState.value = { ...reminderState.value, [item.id]: item.reminded };
    toastText(error.message || "活动提醒保存失败");
  }
}

async function loadActivities() {
  try {
    const result = await api.activities();
    remoteActivities.value = Array.isArray(result) ? result : result.activities || [];
  } catch (error) {
    toastText(error.message || "活动日历加载失败");
  }
}

onLoad((query) => {
  if (query?.date) selectedDate.value = query.date;
  currentMonth.value = startOfMonth(parseDateKey(selectedDate.value));
  loadActivities();
});
</script>

<style scoped>
.calendar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.calendar-head text {
  color: #111827;
  font-size: 31rpx;
  font-weight: 900;
}

.calendar-status {
  display: block;
  margin-bottom: 18rpx;
  padding: 14rpx 18rpx;
  border-radius: 18rpx;
  color: #1677ff;
  background: #eef6ff;
  font-size: 23rpx;
  font-weight: 800;
}

.calendar-head button {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  color: #1677ff;
  background: #eef6ff;
  font-size: 24rpx;
  font-weight: 800;
}

.week-row,
.day-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10rpx;
}

.week-row {
  margin-bottom: 10rpx;
  color: #94a3b8;
  font-size: 22rpx;
  text-align: center;
}

.day {
  position: relative;
  height: 66rpx;
  border-radius: 20rpx;
  color: #334155;
  background: #f5f9ff;
  font-size: 24rpx;
  font-weight: 800;
}

.day.active {
  color: #ffffff;
  background: linear-gradient(135deg, #1677ff, #32c878);
}

.day.muted {
  opacity: 0;
}

.dot {
  position: absolute;
  left: 50%;
  bottom: 8rpx;
  width: 7rpx;
  height: 7rpx;
  margin-left: -3rpx;
  border-radius: 50%;
  background: #32c878;
}

.day.active .dot {
  background: #ffffff;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.event-card {
  padding: 22rpx;
  border-radius: 26rpx;
  background: #f7fbff;
}

.event-title {
  display: block;
  color: #111827;
  font-size: 29rpx;
  font-weight: 850;
}

.event-meta {
  display: block;
  margin-top: 8rpx;
  color: #64748b;
  font-size: 23rpx;
}

.event-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14rpx;
  margin-top: 18rpx;
}
</style>
