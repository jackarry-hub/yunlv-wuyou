# 4.1 用户端功能总览

本工程已按 `4.1 用户端功能总览` 建立用户端模块契约、运行数据接口和自动验收脚本。4.1 是用户端总览层，负责串联 4.2 首页、4.3 智能管家、4.4 活动地图、4.5 紧急求助、4.6 智能设备与小云机器人、4.7 旅居管家/人工向导下单、订单消息和我的档案。

## 模块矩阵

| 模块 | 核心功能 | 优先级 | 首期验收重点 | 当前接口 |
| --- | --- | --- | --- | --- |
| 首页 | 城市定位、旅居服务入口、活动推荐、功能宫格、底部导航 | P0 | 用户能快速找到安全守护、健康服务、旅居管家、活动入口。 | `GET /api/user/home`、`GET /api/user/home-requirements`、`POST /api/user/home-city` |
| 智能管家 | AI 聊天、语音互动、快捷问题、旅居咨询、服务推荐 | P0 | 可输入/语音提问，返回可读答案，可推荐服务。 | `GET /api/ai/steward-requirements`、`POST /api/ai/chat`、`POST /api/ai/voice/transcribe` |
| 活动地图 | 地图活动点、活动筛选、附近活动、活动详情、报名 | P0 | 地图展示活动位置，用户可查看和报名。 | `GET /api/activities/map-requirements`、`GET /api/activities/map`、`POST /api/activities/{id}/join` |
| 紧急求助 | SOS、一键拨打、位置上传、紧急联系人、健康信息 | P0 | 一键求助后生成记录并通知联系人/后台。 | `GET /api/alerts/emergency-requirements`、`POST /api/alerts/sos`、`GET/POST /api/family-contacts` |
| 智能设备 | 设备状态、今日健康概览、手环/机器人联动、设备设置 | P0 | 展示健康数据、连接状态、设备电量、设备功能。 | `GET /api/devices`、`GET /api/health/overview`、`GET /api/devices/robot-requirements` |
| 健康档案 | 个人健康资料、健康趋势、用药提醒、家属授权、设备同步 | P0 | 所有展示与编辑数据来自持久化接口，授权和设备同步可追踪。 | `GET/PUT /api/health/record`、`POST /api/health/record/sync`、`PUT /api/user/personal` |
| 小云机器人 | 语音对话、活动提醒、摔倒检测、异常检测、家人通话、寻求帮助 | P0 | 能展示守护状态、功能开关、守护记录。 | `GET /api/devices/robot-requirements`、`POST /api/devices/help-request`、`POST /api/devices/{id}/action` |
| 旅居管家/人工向导 | 服务分类、向导推荐、下单、订单跟踪 | P0 | 用户可选择陪伴就医、导游游览、护工护理等服务并提交订单。 | `GET /api/guide/order-requirements`、`GET /api/services`、`POST /api/orders` |
| 订单与消息 | 订单列表、订单详情、进度提醒、系统消息、评价 | P0 | 用户可查看订单状态并评价。 | `GET /api/orders`、`GET /api/orders/{id}`、`POST /api/orders/{id}/confirm`、`GET /api/messages` |
| 我的 | 个人资料、家属绑定、健康档案、紧急联系人、设置 | P1 | 可维护基础档案、家属共享权限、绑定邀请和联系人。 | `GET/PUT /api/user/profile`、`GET/PUT /api/elder/profile`、`GET /api/user/family`、`PUT /api/user/family/permissions`、`POST /api/user/family/invitations`、`GET/POST /api/family-contacts` |

## 工程位置

- 需求契约：`server/lib/user-function-overview.js`
- 用户端功能总览接口：`GET /api/user/functions/overview`
- 裸路径接口：`GET /user/functions/overview`
- 用户端首页聚合：`GET /api/user/home`
- 用户端首页：`/user/#home`
- 自动验收脚本：`npm run test:user-functions`

## 当前实现边界

- 4.1 总览接口会返回 9 个用户端模块、P0/P1 数量、每个模块的用户端路由、接口映射和运行数据。
- P0 模块已全部具备路由与接口映射；运行数据从模拟数据库实时统计，不使用静态假结论。
- 用户端首页加载时会水合 4.1 总览版本和 P0 就绪状态，用于页面级验收。
- 真实硬件、真实地图 SDK、短信电话和真实大模型仍按外部资源接入预留。

## 验收脚本

```bash
npm run test:user-functions
```

脚本会启动临时服务和临时数据目录，验证图示模块行、P0/P1 优先级、接口运行数据、裸路径别名、用户首页聚合、参考接口和浏览器水合字段。
