<template>
  <YlPage title="人工向导" subtitle="可咨询、推荐服务并直接发起下单">
    <YlCard title="智能问答">
      <view class="chat-box">
        <view v-for="item in history" :key="item.id || item.question" class="chat-item">
          <text class="question">问：{{ item.question }}</text>
          <text class="answer">答：{{ item.answer }}</text>
        </view>
      </view>
      <input class="input" v-model="question" placeholder="请输入旅居、服务或健康问题" />
      <view class="actions">
        <YlPrimaryButton text="发送" :loading="loading" @click="ask" />
        <YlPrimaryButton :text="voiceLoading ? '识别中...' : '语音提问'" :loading="voiceLoading" ghost @click="voice" />
      </view>
    </YlCard>
    <YlCard title="快捷问题">
      <button v-for="item in quickQuestions" :key="item.id || item.question" class="quick" @click="askQuick(item)">
        {{ item.question || item.title }}
      </button>
    </YlCard>
    <YlCard title="人工向导服务">
      <YlActionGrid :items="services" @select="createOrder" />
    </YlCard>
  </YlPage>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { api, toastText } from "../../common/api";
import { navigate } from "../../common/router";
import { startSpeechRecognition, checkSpeechRecognitionSupport } from "../../common/native";

const question = ref("推荐适合老年人的旅居服务");
const history = ref([]);
const quickQuestions = ref([]);
const loading = ref(false);
const services = [
  { text: "陪伴就医", sub: "挂号陪诊", icon: "医", tone: "blue" },
  { text: "导游游览", sub: "路线讲解", icon: "游", tone: "green" },
  { text: "护工护理", sub: "日常照护", icon: "护", tone: "orange" },
  { text: "接送出行", sub: "站点接送", icon: "车", tone: "purple" },
];

async function load() {
  try {
    const [questions, records] = await Promise.all([api.aiQuickQuestions(), api.aiHistory()]);
    quickQuestions.value = questions.questions || questions || [];
    history.value = records.records || records.history || records || [];
  } catch (error) {
    toastText(error.message || "人工向导加载失败");
  }
}

async function ask() {
  if (!question.value.trim()) return toastText("请输入问题");
  loading.value = true;
  try {
    const result = await api.askAi(question.value);
    history.value.unshift(result);
    question.value = "";
  } catch (error) {
    toastText(error.message || "发送失败");
  } finally {
    loading.value = false;
  }
}

function askQuick(item) {
  question.value = item.question || item.title;
  ask();
}

const voiceLoading = ref(false);

async function voice() {
  if (voiceLoading.value) return;

  // 检查浏览器是否支持语音识别
  if (!checkSpeechRecognitionSupport()) {
    toastText("当前浏览器不支持语音识别，请使用Chrome/Edge/Safari");
    return;
  }

  voiceLoading.value = true;
  toastText("请开始说话...");
  try {
    // 使用浏览器Web Speech API进行实时语音识别
    const transcript = await startSpeechRecognition({ lang: "zh-CN", timeout: 15000 });
    // 将识别结果发送到后端AI对话
    const result = await api.transcribeVoice({ transcript, source: "webSpeech" });
    question.value = result.transcript || result.chat?.question || transcript;
    // 如果后端已经返回了AI回答，直接展示
    if (result.chat) {
      history.value.unshift(result.chat);
      question.value = "";
    } else {
      await ask();
    }
  } catch (error) {
    toastText(error.message || "语音识别失败");
  } finally {
    voiceLoading.value = false;
  }
}

function createOrder(item) {
  api.recordUiAction({ role: "user", route: "assistant", action: `选择${item.text}`, payload: { serviceType: item.text } }).catch(() => {});
  navigate(`/pages/user/order-create?serviceType=${encodeURIComponent(item.text)}&providerType=guide`);
}

onShow(load);
</script>

<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  max-height: 420rpx;
}

.chat-item {
  padding: 18rpx;
  border-radius: 20rpx;
  background: #f8fbff;
}

.question,
.answer {
  display: block;
  color: #111827;
  font-size: 24rpx;
  line-height: 1.5;
}

.answer {
  margin-top: 8rpx;
  color: #64748b;
}

.input {
  height: 82rpx;
  margin-top: 20rpx;
  padding: 0 22rpx;
  border-radius: 22rpx;
  background: #f1f7ff;
  font-size: 26rpx;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 18rpx;
}

.quick {
  display: block;
  width: 100%;
  margin-bottom: 14rpx;
  padding: 20rpx;
  border-radius: 18rpx;
  background: #f8fbff;
  color: #111827;
  font-size: 25rpx;
  text-align: left;
}
</style>
