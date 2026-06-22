# MVP API 接口清单

本项目已按 `10.2 API 接口清单（MVP）` 实现接口。所有接口同时支持两种路径：

- 图示裸路径：`/orders`
- 工程路径：`/api/orders`

前端仍默认调用 `/api/*`，验收或第三方联调可直接按图示裸路径调用。

| 接口组 | 方法 | 图示接口 | 工程等价接口 | 说明 |
| --- | --- | --- | --- | --- |
| 认证 | POST | `/auth/login` | `/api/auth/login` | 登录、获取 Token |
| 认证 | POST | `/auth/wechat-login` | `/api/auth/wechat-login` | 微信登录、获取 Token |
| 交付范围 | GET | `/delivery/initial-scope` | `/api/delivery/initial-scope` | 首期交付范围 |
| MVP 原则 | GET | `/mvp/principles` | `/api/mvp/principles` | 两周 MVP 原则与首期边界 |
| 角色端口 | GET | `/roles/endpoint-division` | `/api/roles/endpoint-division` | 角色与端口划分 |
| 业务流程 | GET | `/business-flow/overview` | `/api/business-flow/overview` | 总体业务流程与运行数据 |
| 用户 | GET | `/user/functions/overview` | `/api/user/functions/overview` | 用户端功能总览与运行数据 |
| 用户 | GET | `/user/home-requirements` | `/api/user/home-requirements` | 首页需求与运行数据 |
| 用户 | POST | `/user/home-city` | `/api/user/home-city` | 首页当前城市手动切换 |
| 用户 | GET/PUT | `/user/profile` | `/api/user/profile` | 用户资料 |
| 用户 | GET/PUT | `/elder/profile` | `/api/elder/profile` | 老人档案 |
| 用户 | GET | `/user/device-management` | `/api/user/device-management` | 用户设备管理页面聚合数据与操作能力 |
| 活动 | GET | `/activities` | `/api/activities` | 活动列表 |
| 活动 | GET | `/activities/map-requirements` | `/api/activities/map-requirements` | 活动地图需求与运行数据 |
| 活动 | GET | `/activities/map` | `/api/activities/map` | 活动地图点位 |
| 活动 | GET | `/user/activity-records` | `/api/user/activity-records` | 用户活动报名记录聚合、筛选和操作能力 |
| 活动 | GET | `/activities/{id}` | `/api/activities/{id}` | 活动详情、参与人数、当前用户报名状态 |
| 活动 | POST | `/activities/{id}/join` | `/api/activities/{id}/join` | 活动报名 |
| 活动 | POST | `/activities/{id}/cancel` | `/api/activities/{id}/cancel` | 取消活动报名 |
| 用户 | GET/POST | `/user/destinations` | `/api/user/destinations` | 用户旅居目的地聚合、详情、收藏与咨询 |
| 用户 | GET/POST/DELETE | `/user/service-records` | `/api/user/service-records` | 用户服务记录聚合、详情、删除与清空 |
| AI 管家 | GET | `/ai/steward-requirements` | `/api/ai/steward-requirements` | 智能管家需求与运行数据 |
| AI 管家 | POST | `/ai/chat` | `/api/ai/chat` | AI 问答 |
| AI 管家 | GET | `/ai/history` | `/api/ai/history` | 问答历史 |
| AI 管家 | GET | `/ai/quick-questions` | `/api/ai/quick-questions` | 快捷问题 |
| AI 管家 | POST | `/ai/quick-questions/{id}/ask` | `/api/ai/quick-questions/{id}/ask` | 快捷问题自动提问 |
| AI 管家 | POST | `/ai/voice/transcribe` | `/api/ai/voice/transcribe` | 语音转文字并进入 AI 对话 |
| AI 管家 | GET | `/ai/recommendations` | `/api/ai/recommendations` | 服务推荐入口 |
| AI 管家 | GET | `/ai/service-records` | `/api/ai/service-records` | 服务咨询记录 |
| 订单 | POST | `/orders` | `/api/orders` | 创建订单 |
| 订单 | GET | `/orders` | `/api/orders` | 查询订单列表 |
| 订单 | GET | `/user/orders` | `/api/user/orders` | 用户订单页真实搜索、筛选和操作能力聚合 |
| 订单 | GET | `/orders/{id}` | `/api/orders/{id}` | 查询订单详情 |
| 订单 | POST | `/orders/{id}/cancel` | `/api/orders/{id}/cancel` | 取消订单 |
| 派单 | POST | `/tasks/dispatch` | `/api/tasks/dispatch` | 后台派单 |
| 派单 | POST | `/tasks/{id}/accept` | `/api/tasks/{id}/accept` | 执行方接单 |
| 派单 | POST | `/tasks/{id}/complete` | `/api/tasks/{id}/complete` | 完成服务 |
| 设备 | GET | `/devices` | `/api/devices` | 设备列表 |
| 设备 | POST | `/devices/bind` | `/api/devices/bind` | 绑定设备 |
| 设备 | GET | `/health/overview` | `/api/health/overview` | 设备和健康概览 |
| 设备 | GET/PUT | `/health/record` | `/api/health/record` | 用户健康档案聚合、查询与编辑 |
| 设备 | POST | `/health/record/sync` | `/api/health/record/sync` | 同步健康设备采集数据与时间 |
| 设备 | GET/POST | `/user/health-services` | `/api/user/health-services` | 用户健康服务聚合、快捷动作、预约与咨询 |
| 设备 | GET | `/devices/robot-requirements` | `/api/devices/robot-requirements` | 智能设备与小云机器人需求 |
| 设备 | POST | `/devices/help-request` | `/api/devices/help-request` | 智能设备帮助任务 |
| SOS | POST | `/alerts/sos` | `/api/alerts/sos` | 紧急求助 |
| SOS | GET | `/alerts/emergency-requirements` | `/api/alerts/emergency-requirements` | 紧急求助需求与运行数据 |
| SOS | POST | `/alerts/quick-help` | `/api/alerts/quick-help` | 快速求助任务 |
| SOS | GET | `/alerts` | `/api/alerts` | 异常列表 |
| SOS | POST | `/alerts/{id}/handle` | `/api/alerts/{id}/handle` | 异常处理 |
| 用户 | GET/POST | `/family-contacts` | `/api/family-contacts` | 紧急联系人列表与新增 |
| 用户 | PUT/DELETE | `/family-contacts/{id}` | `/api/family-contacts/{id}` | 紧急联系人编辑与删除 |
| 用户 | POST | `/family-contacts/{id}/call` | `/api/family-contacts/{id}/call` | 拨打紧急联系人 |
| 用户 | GET | `/user/family` | `/api/user/family` | 家属关怀页面聚合数据 |
| 用户 | PUT | `/user/family/permissions` | `/api/user/family/permissions` | 更新家属共享权限 |
| 用户 | POST | `/user/family/invitations` | `/api/user/family/invitations` | 创建家属绑定邀请与二维码 |
| 商户 | GET/POST | `/merchant/services` | `/api/merchant/services` | 商户服务 |
| 商户 | GET | `/merchant/orders` | `/api/merchant/orders` | 商户订单 |
| 商户 | GET | `/merchant/functions/overview` | `/api/merchant/functions/overview` | 商户功能总览 |
| 商户 | GET | `/merchant/service-categories` | `/api/merchant/service-categories` | 商户服务分类建议 |
| 向导 | GET | `/guide/functions/overview` | `/api/guide/functions/overview` | 向导端功能总览 |
| 向导 | GET | `/guide/order-requirements` | `/api/guide/order-requirements` | 旅居管家与人工向导下单需求 |
| 向导 | GET | `/guide/order-status-flow` | `/api/guide/order-status-flow` | 人工向导端订单状态流 |
| 向导 | POST | `/guide/tasks/{id}/decline` | `/api/guide/tasks/{id}/decline` | 向导拒绝接单 |
| 向导 | POST | `/guide/tasks/{id}/ignore` | `/api/guide/tasks/{id}/ignore` | 向导忽略任务 |
| 向导 | POST | `/guide/tasks/{id}/cancel` | `/api/guide/tasks/{id}/cancel` | 向导申请取消 |
| 后台 | GET | `/admin/dashboard` | `/api/admin/dashboard` | 后台数据概览 |
| 后台 | GET/PUT | `/admin/content/home` | `/api/admin/content/home` | 首页 Banner 与城市配置 |
| 后台 | GET | `/admin/orders` | `/api/admin/orders` | 后台订单 |
| 后台 | GET | `/admin/alerts` | `/api/admin/alerts` | 后台异常 |

## 验收脚本

```bash
npm run test:mvp-api
```

该脚本会启动临时服务和临时数据目录，逐条验证图示裸路径接口，不污染本地 `.runtime/mock-db.json`。
