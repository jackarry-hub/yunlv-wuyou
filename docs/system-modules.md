# 9.1 系统模块架构

本工程已按 `9.1 系统模块架构` 建立模块契约。模块契约不是单独文档，而是接入了服务端接口和自动化验收脚本。

## 模块矩阵

| 模块 | 服务能力 | 主要 API | 关联数据表 |
| --- | --- | --- | --- |
| 用户与权限服务 | 手机号登录、微信登录、角色权限、角色与端口划分、用户端功能总览、首页需求、城市切换、首页消息入口、用户资料、家属绑定、共享权限、绑定邀请、紧急联系人 | `/auth/login`、`/auth/wechat-login`、`/roles/endpoint-division`、`/user/functions/overview`、`/user/home-requirements`、`/user/home-city`、`/user/profile`、`/elder/profile`、`/user/family`、`/user/family/permissions`、`/user/family/invitations`、`/family-contacts`、`/family-contacts/{id}`、`/family-contacts/{id}/call` | `user`、`elder_profile`、`family_contact`、`family_invitation` |
| 订单与任务服务 | 订单创建、向导下单需求、任务拆分、派单、接单、向导状态流、状态流转、评价 | `/orders`、`/tasks/dispatch`、`/tasks/{id}/accept`、`/tasks/{id}/start`、`/tasks/{id}/complete`、`/guide/order-requirements`、`/guide/order-status-flow`、`/guide/tasks/{id}/decline`、`/guide/tasks/{id}/ignore`、`/guide/tasks/{id}/cancel`、`/merchant/orders/{id}/reject`、`/merchant/orders/{id}/reschedule`、`/orders/{id}/confirm` | `order`、`task`、`review` |
| 服务资源服务 | 人工向导、向导功能、向导下单分类、商户、服务项目、服务分类、活动、活动地图、活动分类、活动卡片、附近推荐、活动报名取消、价格、服务区域 | `/guides`、`/guide/functions/overview`、`/guide/order-requirements`、`/guide/online`、`/guide/tasks/claim-next`、`/merchants`、`/services`、`/activities`、`/activities/map-requirements`、`/activities/map`、`/activities/{id}`、`/activities/{id}/join`、`/activities/{id}/cancel`、`/merchant/services`、`/merchant/functions/overview`、`/merchant/service-categories` | `guide`、`merchant`、`service_item`、`activity` |
| 设备与健康数据服务 | 设备绑定、健康数据、异常记录、设备状态、设备联动、小云机器人、守护功能、家人通话、帮助任务、紧急求助、通知链路、位置上传、快速求助、急救健康信息 | `/devices`、`/devices/bind`、`/devices/robot-requirements`、`/devices/help-request`、`/health/overview`、`/alerts/emergency-requirements`、`/alerts/sos`、`/alerts/quick-help`、`/alerts` | `device`、`health_record`、`alert` |
| AI 管家服务 | AI问答、语音互动、快捷问题、服务推荐、服务记录、问答、知识库、推荐、上下文记录 | `/ai/steward-requirements`、`/ai/chat`、`/ai/history`、`/ai/quick-questions`、`/ai/quick-questions/{id}/ask`、`/ai/voice/transcribe`、`/ai/recommendations`、`/ai/service-records` | `ai_chat`、`activity`、`service_item`、`health_record` |
| 通知服务 | 站内消息、短信、电话接口预留、微信订阅消息、App Push | `/messages`、`/messages/read-all`、`/integrations/sms/request` | `message`、`integration_request` |
| 运营后台服务 | 首期交付范围、两周 MVP 原则、角色端口、总体业务流程、功能总览、用户、人员、商户、订单、异常、首页内容配置、内容、数据大屏、数据、系统配置 | `/delivery/initial-scope`、`/mvp/principles`、`/roles/endpoint-division`、`/business-flow/overview`、`/admin/dashboard`、`/admin/content/home`、`/admin/functions/overview`、`/admin/users`、`/admin/guides`、`/admin/merchants`、`/admin/orders`、`/admin/alerts`、`/admin/screens`、`/admin/database/schema` | 10.1 核心数据表与审计数据 |

## 工程位置

- 模块契约：`server/lib/system-modules.js`
- 首期交付范围接口：`GET /api/delivery/initial-scope`
- 两周 MVP 原则接口：`GET /api/mvp/principles`
- 角色与端口划分接口：`GET /api/roles/endpoint-division`
- 总体业务流程接口：`GET /api/business-flow/overview`
- 用户端功能总览接口：`GET /api/user/functions/overview`
- 首页需求接口：`GET /api/user/home-requirements`
- 首页城市切换接口：`POST /api/user/home-city`
- 首页内容配置接口：`GET/PUT /api/admin/content/home`
- 后台查询接口：`GET /api/admin/system/modules`
- 向导端功能总览接口：`GET /api/guide/functions/overview`
- 旅居管家与人工向导下单需求接口：`GET /api/guide/order-requirements`
- 人工向导端订单状态流接口：`GET /api/guide/order-status-flow`
- 紧急求助需求接口：`GET /api/alerts/emergency-requirements`
- 智能设备与小云机器人需求接口：`GET /api/devices/robot-requirements`
- 商户端功能总览接口：`GET /api/merchant/functions/overview`
- 商户服务分类接口：`GET /api/merchant/service-categories`
- 活动地图需求接口：`GET /api/activities/map-requirements`
- 智能管家需求接口：`GET /api/ai/steward-requirements`
- 总参考接口：`GET /api/reference`
- 自动验收脚本：`npm run test:modules`

## 当前实现边界

- 首期交付范围、两周 MVP 原则、角色与端口划分、总体业务流程、用户与权限、用户端功能总览、首页需求、订单任务、服务资源、活动地图、紧急求助、设备健康、AI 管家、运营后台已能驱动演示闭环。
- 通知服务当前已实现站内消息；短信、电话、微信订阅消息、App Push 按 P2 集成预留。
- AI 管家当前已按 4.3 建立问答、快捷问题、语音转文字预留、服务推荐和服务记录；真实知识库与大模型按 P2 集成预留。
