# 4.3 智能管家需求

本工程已按 `4.3 智能管家需求` 建立接口契约、用户端联动模块和自动验收脚本。当前实现为本地意图识别与友好话术生成，真实大模型、知识库和系统语音识别可在同一接口边界内替换。

## 需求矩阵

| 功能点 | 详细需求 | 优先级 | 验收标准 | 当前接口 |
| --- | --- | --- | --- | --- |
| AI 问答 | 支持用户输入文字问题，围绕天气、旅居地、住宿、活动、交通、政策、健康常识等回答。 | P0 | 返回时间不超过 5 秒；回答带友好语气。 | `POST /api/ai/chat` |
| 语音互动 | 支持按住说话/语音转文字；首期可接入系统语音识别或预留。 | P1 | 语音识别成功后进入 AI 对话。 | `POST /api/ai/voice/transcribe` |
| 快捷问题 | 提供常见问题卡片，如推荐旅居地、最近活动、天气、预订公寓等。 | P0 | 点击后自动发起问题并返回答案。 | `GET /api/ai/quick-questions`、`POST /api/ai/quick-questions/{id}/ask` |
| 服务推荐 | AI回答中可推荐活动、人工向导、商户服务等。 | P1 | 答案中可出现可点击服务入口。 | `GET /api/ai/recommendations`、`POST /api/service-requests` |
| 服务记录 | 保留对话历史和服务咨询记录。 | P1 | 用户可查看最近对话。 | `GET /api/ai/history`、`GET /api/ai/service-records` |

## 工程位置

- 需求契约：`server/lib/ai-steward-requirements.js`
- 需求聚合接口：`GET /api/ai/steward-requirements`
- 用户端联动入口：`/user/#assistant`
- 前端联动逻辑：`apps/shared/business-bridge.js`
- 自动验收脚本：`npm run test:ai-steward`

## 当前实现边界

- P0 已实现：文字问答、快捷问题、5 秒内响应标记、友好语气标记。
- P1 已实现为可验收闭环：语音样例转写后自动进入 AI 对话；AI 回答可附带活动、向导或商户服务入口；历史记录和服务咨询记录可查询。
- 真实大模型、真实语音识别、知识库召回和多轮上下文增强仍按 P2 预留，不影响首期演示和试运营闭环。

## 验收脚本

```bash
npm run test:ai-steward
```

脚本会启动临时服务和临时数据目录，验证需求行、快捷问题、语音转文字、服务推荐、服务记录、裸路径接口和 `/api/reference` 聚合输出。
