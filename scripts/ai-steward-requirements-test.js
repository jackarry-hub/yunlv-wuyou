const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const {
  AI_STEWARD_REQUIREMENTS_VERSION,
  aiStewardRequirements,
  aiStewardRequirementsForApi,
  normalizeVoiceTranscript,
  quickQuestions,
  serviceRecommendationsForIntent,
  validateAiStewardRequirements,
} = require("../server/lib/ai-steward-requirements");

const root = path.resolve(__dirname, "..");

const expectedRows = [
  ["AI 问答", "支持用户输入文字问题，围绕天气、旅居地、住宿、活动、交通、政策、健康常识等回答。", "P0"],
  ["语音互动", "支持按住说话并调用浏览器系统语音识别；未返回真实识别结果时明确提示不可识别。", "P1"],
  ["快捷问题", "提供常见问题卡片，如推荐旅居地、最近活动、天气、预订公寓等。", "P0"],
  ["服务推荐", "AI回答中可推荐活动、人工向导、商户服务等。", "P1"],
  ["服务记录", "保留对话历史和服务咨询记录。", "P1"],
];

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {
      await delay(120);
    }
  }
  throw new Error(`server did not start\n${output()}`);
}

async function json(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(`${options.method || "GET"} ${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  assert.deepEqual(
    aiStewardRequirements.map((item) => [item.feature, item.detail, item.priority]),
    expectedRows,
    "4.3 智能管家需求应与图示一致",
  );
  assert.equal(validateAiStewardRequirements().valid, true);
  assert(quickQuestions.some((item) => item.title === "推荐旅居地"));
  assert(quickQuestions.some((item) => item.title === "最近活动"));
  assert(quickQuestions.some((item) => item.title === "天气建议"));
  assert(quickQuestions.some((item) => item.title === "预订公寓"));
  assert.equal(normalizeVoiceTranscript({ transcript: "明天上午能安排陪伴就医服务吗？" }).source, "webSpeech");
  assert.equal(normalizeVoiceTranscript({}).transcript, "");

  const seed = JSON.parse(fs.readFileSync(path.join(root, "data/mock-db.json"), "utf8"));
  const direct = aiStewardRequirementsForApi(seed);
  assert.equal(direct.version, AI_STEWARD_REQUIREMENTS_VERSION);
  assert.equal(direct.requirementCount, 5);
  assert.equal(direct.p0Count, 2);
  assert.equal(direct.p1Count, 3);
  assert.equal(direct.runtime.maxResponseMs, 5000);
  assert(direct.runtime.supportedTopics.includes("天气"));
  assert(direct.voiceInteraction.requires.includes("浏览器 SpeechRecognition/webkitSpeechRecognition 支持"));
  assert(serviceRecommendationsForIntent("general", seed).length >= 2);

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-ai-steward-"));
  let logs = "";
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), YUNLV_RUNTIME_DIR: runtimeDir },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    logs += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    logs += chunk.toString();
  });

  try {
    await waitForServer(baseUrl, () => logs);
    const elder = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });

    const health = await json(baseUrl, "/api/health");
    assert(health.apiGroups.includes("ai-steward-requirements"));

    const requirements = await json(baseUrl, "/api/ai/steward-requirements", { token: elder.token });
    assert.equal(requirements.validation.valid, true);
    assert.equal(requirements.requirementCount, 5);
    assert.equal(requirements.runtime.maxResponseMs, 5000);
    assert(requirements.quickQuestions.some((item) => item.id === "booking"));

    const bareRequirements = await json(baseUrl, "/ai/steward-requirements", { token: elder.token });
    assert.equal(bareRequirements.version, AI_STEWARD_REQUIREMENTS_VERSION);

    const quickList = await json(baseUrl, "/api/ai/quick-questions", { token: elder.token });
    assert(quickList.some((item) => item.id === "weather"));

    const weatherChat = await json(baseUrl, "/api/ai/chat", {
      method: "POST",
      token: elder.token,
      body: { question: "今天弥勒天气适合参加户外活动吗？" },
    });
    assert.equal(weatherChat.intent, "weather");
    assert.equal(weatherChat.friendlyTone, true);
    assert(weatherChat.responseTimeMs <= 5000);
    assert(weatherChat.answer.includes("建议") || weatherChat.answer.includes("适合"));
    assert(weatherChat.recommendations.length >= 1);

    const quickChat = await json(baseUrl, "/api/ai/quick-questions/activities/ask", {
      method: "POST",
      token: elder.token,
      body: {},
    });
    assert.equal(quickChat.quickQuestion.title, "最近活动");
    assert.equal(quickChat.chat.source, "quickQuestion");
    assert.equal(quickChat.chat.intent, "activity_recommendation");
    assert(quickChat.chat.recommendations.some((item) => item.type === "activity"));

    const voiceChat = await json(baseUrl, "/api/ai/voice/transcribe", {
      method: "POST",
      token: elder.token,
      body: { transcript: "明天上午能安排陪伴就医服务吗？", source: "webSpeech" },
    });
    assert(voiceChat.transcript.includes("就医"));
    assert.equal(voiceChat.chat.source, "voice");
    assert.equal(voiceChat.chat.intent, "medical_companion");

    const emptyVoiceResponse = await fetch(`${baseUrl}/api/ai/voice/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${elder.token}` },
      body: JSON.stringify({}),
    });
    const emptyVoicePayload = await emptyVoiceResponse.json();
    assert.equal(emptyVoiceResponse.status, 400);
    assert.equal(emptyVoicePayload.success, false);

    const recommendations = await json(baseUrl, "/api/ai/recommendations?intent=medical_companion", { token: elder.token });
    assert(recommendations.recommendations.some((item) => item.type === "guide"));

    const requestItem = await json(baseUrl, "/api/service-requests", {
      method: "POST",
      token: elder.token,
      body: {
        role: "user",
        route: "assistant",
        action: "AI推荐服务入口",
        type: recommendations.recommendations[0].requestType || "陪伴就医",
        providerType: "guide",
        priority: "P1",
        description: "4.3 验收：用户从智能管家推荐入口点击服务",
      },
    });
    assert.equal(requestItem.status, "待处理");

    const serviceRecords = await json(baseUrl, "/api/ai/service-records", { token: elder.token });
    assert(serviceRecords.summary.totalConversations >= 3);
    assert(serviceRecords.summary.voiceRecords >= 1);
    assert(serviceRecords.summary.quickQuestionRecords >= 1);
    assert(serviceRecords.consultationRequests.some((item) => item.id === requestItem.id));

    const reference = await json(baseUrl, "/api/reference");
    assert.equal(reference.aiStewardRequirements.architecturePath, "/api/ai/steward-requirements");
  } finally {
    child.kill();
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("ai steward requirements ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
