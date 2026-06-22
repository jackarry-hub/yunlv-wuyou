# 1.2 首期交付范围

本工程已按 `1.2 首期交付范围` 建立可查询的交付范围契约。范围不仅是项目说明，也接入了服务端接口、端口路由、API 映射、数据对象和自动化验收脚本。

## 范围矩阵

| 范围 | 内容 | 交付要求 |
| --- | --- | --- |
| 用户端 | 微信小程序、iOS App、Android App | 统一体验，覆盖首页、AI 管家、活动地图、紧急求助、智能硬件、旅居管家、订单、消息、我的。 |
| 人工向导端 | 小程序/App 内人工向导角色端 | 覆盖接单大厅、订单详情、服务中、异常上报、我的订单、今日收入、上线接单设置。 |
| 商户端 | 小程序/App 内商户角色端 | 覆盖服务发布、订单预约、确认报价、服务执行、完成上报、评价售后。 |
| 管理后台 | PC Web 管理后台 | 覆盖用户、老人、人工向导、商户、服务、订单、活动、异常、设备、数据看板、系统配置。 |
| 硬件数据 | 小云机器人、智能手环及扩展智能设备 | 首期以模拟数据/接口预留为主，支持后续真实设备接入。 |
| AI 能力 | 智能管家问答、服务推荐、异常解释 | 首期以通用大模型+预设知识库+规则推荐实现。 |

## 工程映射

| 范围 | 主要端口 | 关键接口 |
| --- | --- | --- |
| 用户端 | `/user/` | `/api/user/home`、`/api/ai/chat`、`/api/activities/map`、`/api/alerts/sos`、`/api/devices`、`/api/orders`、`/api/messages` |
| 人工向导端 | `/guide/` | `/api/guide/dashboard`、`/api/guide/tasks/claim-next`、`/api/tasks/{id}/accept`、`/api/tasks/{id}/start`、`/api/tasks/{id}/complete`、`/api/guide/exception` |
| 商户端 | `/merchant/` | `/api/merchant/services`、`/api/merchant/orders`、`/api/merchant/orders/{id}/quote`、`/api/merchant/orders/{id}/confirm`、`/api/merchant/orders/{id}/complete` |
| 管理后台 | `/admin/` | `/api/admin/dashboard`、`/api/admin/users`、`/api/admin/guides`、`/api/admin/merchants`、`/api/admin/orders`、`/api/admin/alerts`、`/api/admin/screens` |
| 硬件数据 | `/user/#devices`、`/admin/#devices` | `/api/devices`、`/api/devices/robot-requirements`、`/api/health/overview`、`/api/integrations/hardware/request` |
| AI 能力 | `/user/#assistant` | `/api/ai/steward-requirements`、`/api/ai/chat`、`/api/ai/recommendations`、`/api/ai/service-records`、`/api/integrations/llm/request` |

## 工程位置

- 范围契约：`server/lib/initial-delivery-scope.js`
- 查询接口：`GET /api/delivery/initial-scope`
- 图示裸路径：`GET /delivery/initial-scope`
- 总参考接口：`GET /api/reference`
- 自动验收脚本：`npm run test:initial-scope`

## 当前边界

- 正式交付端必须为微信小程序、iOS App、Android App，其中人工向导端和商户端作为小程序/App 内角色端承载；现有 UI 参考资料仅用于迁移对照。
- 硬件数据首期用模拟设备、健康数据和接口预留，真实设备协议后续替换接入。
- AI 能力首期用本地意图、预设知识库和规则推荐模拟，真实大模型和复杂诊断按 P2 接入。
