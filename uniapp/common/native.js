import { toastText } from "./api";

export function getCurrentLocation() {
  return new Promise((resolve) => {
    uni.getLocation({
      type: "gcj02",
      success: resolve,
      fail() {
        resolve({ latitude: 24.8801, longitude: 102.8329, accuracy: 80, mocked: true });
      },
    });
  });
}

export function openMapLocation(point = {}) {
  const latitude = Number(point.latitude || point.lat || point.position?.[1] || 24.8801);
  const longitude = Number(point.longitude || point.lng || point.position?.[0] || 102.8329);
  uni.openLocation({
    latitude,
    longitude,
    name: point.name || point.title || "活动地点",
    address: point.address || point.place || "",
    fail() {
      toastText("地图权限或设备能力不可用，请检查定位权限");
    },
  });
}

export function callPhone(phoneNumber) {
  if (!phoneNumber) {
    toastText("暂无可拨打号码");
    return;
  }
  uni.makePhoneCall({
    phoneNumber,
    fail() {
      toastText("拨号权限或设备能力不可用，请检查电话权限");
    },
  });
}

export function sharePayload(payload) {
  return {
    title: payload.title || "云旅无忧",
    path: payload.path || "/pages/user/home",
    imageUrl: payload.imageUrl || "",
  };
}

/**
 * 使用浏览器 Web Speech API 进行语音识别（H5环境）
 * 返回 Promise<string>，识别成功返回文字，失败抛出错误
 */
export function startSpeechRecognition(options = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timeout = null;

    // #ifdef H5
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      reject(new Error("当前浏览器不支持语音识别，请使用Chrome/Edge/Safari浏览器"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = options.lang || "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        recognition.stop();
        reject(new Error("语音识别超时，请重新尝试"));
      }
    }, options.timeout || 15000);

    recognition.onresult = (event) => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);
      const transcript = event.results[0]?.[0]?.transcript || "";
      if (transcript.trim()) {
        resolve(transcript.trim());
      } else {
        reject(new Error("未识别到语音内容，请重新说话"));
      }
    };

    recognition.onerror = (event) => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);
      const errorMap = {
        "not-allowed": "麦克风权限被拒绝，请在浏览器设置中允许麦克风访问",
        "no-speech": "未检测到语音，请靠近麦克风重新说话",
        "audio-capture": "未检测到麦克风设备，请检查设备连接",
        "network": "网络连接异常，语音识别需要网络支持",
        "aborted": "语音识别已取消",
      };
      reject(new Error(errorMap[event.error] || `语音识别失败：${event.error}`));
    };

    recognition.onend = () => {
      if (!settled) {
        settled = true;
        if (timeout) clearTimeout(timeout);
        reject(new Error("语音识别结束但未获取结果，请重新尝试"));
      }
    };

    try {
      recognition.start();
    } catch (error) {
      settled = true;
      if (timeout) clearTimeout(timeout);
      reject(new Error("语音识别启动失败：" + (error.message || "未知错误")));
    }
    // #endif

    // #ifndef H5
    // 非H5环境使用uni原生录音（小程序/App）
    const recorderManager = uni.getRecorderManager();
    recorderManager.onStop((res) => {
      if (settled) return;
      settled = true;
      // 原生环境返回音频文件路径，需后端处理
      resolve(res.tempFilePath || "");
    });
    recorderManager.onError((err) => {
      if (settled) return;
      settled = true;
      reject(new Error(err.errMsg || "录音失败"));
    });
    recorderManager.start({
      duration: options.timeout || 15000,
      format: "mp3",
      sampleRate: 16000,
      numberOfChannels: 1,
    });
    // 自动停止
    setTimeout(() => {
      if (!settled) recorderManager.stop();
    }, options.duration || 10000);
    // #endif
  });
}

/**
 * 停止正在进行的语音识别（H5环境）
 */
export function checkSpeechRecognitionSupport() {
  // #ifdef H5
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  // #endif
  // #ifndef H5
  return true;
  // #endif
}
