# 云旅无忧 MVP 交付说明

## 交付范围

本目录已整合为一个可本地运行的三端工程化 MVP，并保留管理后台与原始 UI 原型：

- 用户端：正式交付为微信小程序、iOS App、Android App，对齐用户端参考图首页与 40 个页面，体验入口为 `uniapp/dist/build/mp-weixin` 和 `uniapp/dist/build/app`。
- 人工向导端：正式交付为小程序/App 内人工向导角色端，覆盖上线状态、派单任务、接单、开始服务、完成上报、消息通知，体验入口同上。
- 商户端：正式交付为小程序/App 内商户角色端，覆盖商户资料、服务项目、预约报价、确认服务、完成上报、结算消息，体验入口同上。
- 管理后台：`/admin/`，API 驱动后台，覆盖订单、异常、审计、派单候选和模拟数据库状态。
- 原始 UI 原型：`/prototype/user/`、`/prototype/guide/`、`/prototype/merchant/`、`/prototype/admin/`。
- 集成工作台：`/`，用于查看 API、管理后台和演示数据状态；移动端不再通过 H5 工作台验收。
- 模拟后端 API：`/api/*`，使用 `.runtime/mock-db.json` 保存运行期数据。
- 首期交付范围：`docs/initial-delivery-scope.md`、`server/lib/initial-delivery-scope.js` 按 1.2 建立用户端、人工向导端、商户端、管理后台、硬件数据和 AI 能力六项交付范围契约。
- MVP 交付总验收：`docs/mvp-delivery-completion.md`、`server/lib/mvp-delivery-completion.js` 将以上所有 P0/P1/P2 边界聚合为 13 项机器验收清单。
- 两周 MVP 原则：`docs/mvp-principles.md`、`server/lib/mvp-principles.js` 按 1.3 建立可演示、可试运营、可验收优先，真实硬件、支付结算、医保/医院深度接口、复杂 AI 诊断首期预留或模拟的边界契约。
- 角色与端口划分：`docs/role-endpoint-division.md`、`server/lib/role-endpoint-division.js` 按第 2 节建立用户/老人、家属、人工向导、商户、平台运营/管理员的定位、任务、端口、权限和接口契约。
- 总体业务流程：`docs/business-flow.md`、`server/lib/business-flow.js` 按第 3 节建立需求发起、智能分析、任务分配、服务执行、反馈上报、结果反馈和数据沉淀流程契约。
- 跨端协同通知：`docs/collaboration-notifications.md`、`server/lib/collaboration-notifications.js` 按第 8 节建立场景、触发端、接收端和处理规则。
- 系统模块架构：`docs/system-modules.md`、`server/lib/system-modules.js` 按 9.1 模块架构建立模块契约。
- 技术选型架构：`docs/technology-stack.md`、`server/lib/technology-stack.js` 按移动端、后台、后端、数据库、地图、AI、对象存储和部署建议建立架构契约。
- 用户端功能总览：`docs/user-function-overview.md`、`server/lib/user-function-overview.js` 按 4.1 建立首页、智能管家、活动地图、紧急求助、智能设备、小云机器人、旅居管家/人工向导、订单消息和我的模块契约。
- 首页需求：`docs/user-home-requirements.md`、`server/lib/user-home-requirements.js` 按 4.2 建立顶部区域、Banner、快捷服务、功能宫格、活动推荐和底部导航契约。
- 向导端功能总览：`docs/guide-function-overview.md`、`server/lib/guide-function-overview.js` 按登录认证、首页工作台、上线接单、接单大厅、订单详情、服务中、异常上报、我的订单、收入评价和帮助中心建立模块契约。
- 旅居管家与人工向导下单需求：`docs/guide-order-requirements.md`、`server/lib/guide-order-requirements.js` 按 4.7 建立陪伴就医、导游游览、护工护理、接送出行、帮办代办、生活陪伴的下单字段契约。
- 人工向导端订单状态流：`docs/guide-order-status-flow.md`、`server/lib/guide-order-status-flow.js` 按 5.1 建立待接单、已接单、服务中、待确认、已完成、已取消状态流契约。
- 智能管家需求：`docs/ai-steward-requirements.md`、`server/lib/ai-steward-requirements.js` 按 4.3 建立 AI 问答、语音互动、快捷问题、服务推荐和服务记录闭环。
- 活动地图需求：`docs/activity-map-requirements.md`、`server/lib/activity-map-requirements.js` 按 4.4 建立弥勒区域地图点、分类筛选、活动卡片、附近推荐、报名和取消报名闭环。
- 紧急求助需求：`docs/emergency-help-requirements.md`、`server/lib/emergency-help-requirements.js` 按 4.5 建立一键 SOS、通知链路、位置上传、紧急联系人、快速求助和健康信息闭环。
- 商户端功能总览：`docs/merchant-function-overview.md`、`server/lib/merchant-function-overview.js` 按商户入驻、服务管理、订单预约、报价、执行、评价、统计和结算建立模块契约。
- 商户服务分类建议：`docs/merchant-service-categories.md`、`server/lib/merchant-service-categories.js` 按 6.1 建立医疗卫生、康养护理、生活服务、交通出行、文旅体验、餐饮与本地美食、殡葬服务分类契约。
- MVP 图示接口：`docs/mvp-api-list.md` 中的裸路径接口已全部支持，并与 `/api/*` 共用同一套处理逻辑。
- 核心数据表：`docs/core-data-tables.md`、`database/schema.sql`、`server/lib/database-schema.js` 按 10.1 表建议建立表契约。
- 管理后台功能总览：`docs/admin-function-overview.md`、`server/lib/admin-function-overview.js` 按 7.1 建立后台模块、功能需求、优先级和验收标准。
- 管理端数据大屏：`docs/admin-data-screens.md`、`server/lib/admin-data-screens.js` 按 7.2 建立旅居养老作战大屏和人工向导调配大屏。
- 共享前端层：`apps/shared/`，提供 API client、格式化、状态徽标、消息提示和基础样式。
- 模拟上线基线：`server/lib/mock-database.js`、`server/lib/auth.js`、`server/lib/state-machine.js` 分别封装模拟数据库、HMAC JWT 鉴权权限和业务状态机。
- 部署配置：`.env.example`、`Dockerfile`、`deploy/docker-compose.yml`、`docs/deployment.md`。
- 优先级交付：`docs/priority-delivery.md` 按 P0/P1/P2 对应核心闭环、增强功能和二期预留接口。

## 启动方式

```bash
npm start
```

默认地址：

```text
http://localhost:5173/
```

移动端体验地址不是 H5 URL：

```text
微信开发者工具导入: /Users/chm/Desktop/云旅无忧/uniapp/dist/build/mp-weixin
App 构建资源: /Users/chm/Desktop/云旅无忧/uniapp/dist/build/app
```

如需重置演示数据：

```bash
npm run reset:data
npm start
```

如需执行端到端冒烟校验：

```bash
npm run smoke
```

如需执行完整开发层检查：

```bash
npm run check
```

`YUNLV_RUNTIME_DIR` 可指定运行期数据目录，便于测试环境隔离。

## 关键接口

图示 `10.2 API 接口清单（MVP）` 已按裸路径实现，同时保留 `/api` 前缀工程路径。示例：`/orders` 与 `/api/orders` 等价，完整清单见 `docs/mvp-api-list.md`。

- `GET /api/health`：服务状态。
- `GET /api/reference`：端口、原型和交付范围。
- `POST /auth/login` / `POST /api/auth/login`：模拟登录。
- `POST /auth/wechat-login` / `POST /api/auth/wechat-login`：微信登录模拟入口。
- `GET /api/messages?role=user|guide|merchant|admin`：角色消息。
- `GET /delivery/initial-scope`：1.2 首期交付范围、六项范围运行状态、端口路由、API 和数据对象映射，也支持 `/api` 前缀。
- `GET /admin/mvp-delivery/completion`：MVP 交付级总验收，覆盖首期范围、用户端、向导端、商户端、管理后台、数据闭环、协同通知、部署和验收脚本，也支持 `/api` 前缀。
- `GET /mvp/principles`：1.3 两周 MVP 原则、首期交付边界、高依赖能力预留状态和验收结果，也支持 `/api` 前缀。
- `GET /roles/endpoint-division`：第 2 节角色与端口划分、五类角色运行状态、端口路由、权限和 API 映射，也支持 `/api` 前缀。
- `GET /business-flow/overview`：第 3 节总体业务流程、7 步流程运行数据和验收状态，也支持 `/api` 前缀。
- `GET /user/functions/overview`：4.1 用户端功能总览、模块路由、接口映射和运行数据，也支持 `/api` 前缀。
- `GET /user/home-requirements`、`POST /user/home-city`、`GET/PUT /admin/content/home`：4.2 首页需求、当前城市切换、Banner 和城市配置，也支持 `/api` 前缀。
- `GET /api/services`：服务项目列表，可按 `providerType`、`status`、`category` 过滤。
- `GET/PUT /user/profile` / `GET/PUT /api/user/profile`：用户资料。
- `GET/PUT /elder/profile` / `GET/PUT /api/elder/profile`：老人档案。
- `GET /api/user/home`：用户端首页聚合数据。
- `GET /activities`、`GET /activities/map-requirements`、`GET /activities/map`、`GET /activities/{id}`、`POST /activities/{id}/join`、`POST /activities/{id}/cancel`：4.4 活动地图、分类筛选、详情卡片、报名和取消报名，也支持 `/api` 前缀。
- `GET/POST /api/service-requests`、`POST /api/service-requests/{id}/handle`：非标准订单类服务请求创建与后台处理。
- `GET /ai/steward-requirements`、`POST /ai/chat`、`GET /ai/history`、`GET /ai/quick-questions`、`POST /ai/quick-questions/{id}/ask`、`POST /ai/voice/transcribe`、`GET /ai/recommendations`、`GET /ai/service-records`：4.3 智能管家问答、快捷问题、语音转文字、服务推荐和服务记录，也支持 `/api` 前缀。
- `POST /orders`、`GET /orders`、`GET /orders/{id}`、`POST /orders/{id}/cancel`：订单创建、查询和取消，也支持 `/api` 前缀。
- `POST /api/orders/{id}/confirm`：用户确认评价，属于核心闭环增强接口。
- `POST /tasks/dispatch`、`POST /tasks/{id}/accept|complete`：派单与履约状态流转，也支持 `/api` 前缀。
- `POST /api/tasks/{id}/start`：显式开始服务增强接口；若按图示只调用 `accept -> complete`，服务端会自动补齐开始服务状态。
- `GET /api/guide/dashboard`、`GET /api/guide/functions/overview`、`GET /api/guide/order-requirements`、`GET /api/guide/order-status-flow`、`POST /api/guide/online`、`POST /api/guide/tasks/claim-next`、`POST /api/guide/tasks/{id}/decline|ignore|cancel`：向导端工作台、功能总览、下单需求、订单状态流、上线状态、抢单接单、拒绝/忽略和申请取消。
- `GET /devices`、`POST /devices/bind`、`GET /health/overview`：设备绑定和健康概览，也支持 `/api` 前缀。
- `GET /devices/robot-requirements`、`POST /devices/help-request`、`POST /api/devices/{id}/action`：4.6 智能设备与小云机器人需求、守护开关、家人通话和帮助任务。
- `GET /alerts/emergency-requirements`、`POST /alerts/sos`、`POST /alerts/quick-help`、`GET /alerts`、`POST /alerts/{id}/handle`：4.5 紧急求助需求、SOS、快速求助和异常处理，也支持 `/api` 前缀。
- `GET/POST /family-contacts`、`PUT/DELETE /family-contacts/{id}`、`POST /family-contacts/{id}/call`：紧急联系人查询、新增、编辑、删除和拨打记录，也支持 `/api` 前缀。
- `GET/POST /merchant/services`、`GET /merchant/orders`：商户服务与订单，也支持 `/api` 前缀。
- `GET /api/merchant/dashboard`、`GET /api/merchant/functions/overview`、`GET /api/merchant/service-categories`、`POST /api/merchant/orders/{id}/quote|confirm|reject|reschedule|complete`：商户工作台、功能总览、服务分类建议和订单履约增强接口。
- `GET /admin/dashboard`、`GET /admin/orders`、`GET /admin/alerts`：后台看板、订单、异常，也支持 `/api` 前缀。
- `GET /api/admin/system/collaboration`：第 8 节跨端协同与通知规则、运行期消息统计和校验结果。
- `GET /api/admin/system/modules`：9.1 系统模块架构、能力、API、数据表和校验结果。
- `GET /api/admin/system/technology`：技术选型与部署架构、当前实现状态、生产替换项和校验结果。
- `GET /api/admin/functions/overview`：7.1 管理后台功能总览、模块运行状态和校验结果。
- `GET /api/admin/screens`：7.2 管理端数据大屏、实时指标、图表列表和校验结果。
- `GET /api/admin/priority/status`：P0/P1/P2 交付状态。
- `GET /api/integrations/status`、`POST /api/integrations/{id}/request`：P2 外部资源接入预留。
- `GET /api/admin/database/status`、`POST /api/admin/database/snapshot`：模拟数据库状态和快照。
- `GET /api/admin/database/schema`：10.1 核心数据表契约、字段映射和当前数据校验结果。

## 开发层模拟上线能力

- 数据库：仍使用 JSON 文件，但已经由数据库适配层统一读写、初始化、快照和状态统计。
- 数据表契约：已按 10.1 建立 `user`、`elder_profile`、`family_contact`、`guide`、`merchant`、`service_item`、`order`、`task`、`activity`、`device`、`health_record`、`alert`、`ai_chat` 13 张核心表，并提供 SQL 建表脚本和自动校验。
- 首期交付范围：已按 1.2 固化用户端、人工向导端、商户端、管理后台、硬件数据和 AI 能力六项范围，接口返回每项范围的端口、API、数据对象和运行状态。
- 两周 MVP 原则：已按 1.3 固化首期边界，核心闭环必须可演示/可试运营/可验收，硬件、支付结算、医保/医院深度接口、复杂 AI 诊断仅做接口预留或模拟。
- 角色与端口划分：已按第 2 节建立用户/老人、家属、人工向导、商户、平台运营/管理员五类角色契约，接口返回端口路由、权限点、API、数据表和运行时账号状态。
- 模块架构契约：已按 9.1 建立用户与权限、订单与任务、服务资源、设备与健康、AI 管家、通知、运营后台 7 个模块，并提供接口和自动校验。
- 技术架构契约：已建立移动端、管理后台、后端服务、数据库、地图、AI、对象存储、部署 8 层技术选型矩阵，并提供接口和自动校验。
- 总体业务流程：已按第 3 节建立 7 步跨端业务流程接口，覆盖需求发起、智能分析、任务分配、服务执行、反馈上报、结果反馈和数据沉淀，运行数据来自订单、任务、异常、消息、健康、评价等真实模拟库。
- 跨端协同通知：已建立用户下单、SOS、设备异常、向导接单、商户确认、服务完成、异常上报 7 个协同规则，并补齐真实站内消息触发。
- 用户端功能总览：已按 4.1 建立用户端 9 个模块总览接口，P0 模块全部具备用户端路由、接口映射和运行数据统计，首页会水合总览版本和 P0 就绪状态。
- 首页需求：已按 4.2 建立首页接口，用户端 `/user/#home` 支持当前城市、未读消息、Banner 后台配置、快捷服务、功能宫格、活动推荐和底部导航真实校验。
- 向导端功能总览：已建立向导 P0/P1 功能矩阵，工作台 `/guide/#14` 读取 `/api/guide/functions/overview` 展示运行状态，上线接单、抢单、服务中、异常上报均关联真实 API。
- 旅居管家与人工向导下单需求：已按 4.7 建立 6 类服务字段契约，用户端真实统一下单表单读取 `/api/guide/order-requirements`，提交后订单进入后台待派单与向导任务列表。
- 人工向导端订单状态流：已按 5.1 建立状态流接口，`/guide/#03` 读取 `/api/guide/order-status-flow` 展示六个状态；拒绝、忽略、申请取消会真实写入任务、订单、消息和审计。
- 智能管家需求：已按 4.3 建立智能管家接口，用户端 `/user/#assistant` 支持文字问答、快捷问题、语音转文字样例、服务推荐入口和最近对话记录。
- 活动地图需求：已按 4.4 建立活动地图接口，用户端 `/user/#activity-map` 支持地图点、分类筛选、点位卡片、附近推荐、活动报名和取消报名真实数据联动。
- 紧急求助需求：已按 4.5 建立紧急求助接口，用户端 `/user/#emergency` 支持二次确认 SOS、联系人 CRUD、快速求助、定位显示和急救健康信息保存。
- 商户端功能总览：已建立商户 P0/P1 功能矩阵，工作台读取 `/api/merchant/functions/overview` 展示运行状态，订单支持报价、确认、拒绝、改期和完成。
- 商户服务分类：已按 6.1 建立七类服务分类和合规备注，商户端 `/merchant/#31` 读取 `/api/merchant/service-categories` 完成真实选择。
- 鉴权权限：所有非公开 API 都经过模拟 JWT 和权限点校验，未登录返回 401，越权返回 403。
- 状态机：订单、任务、异常流转在服务端校验，非法跳转返回 409。
- 后台联动：新版 `/admin/` 直接读取真实 API 数据，后台首页已接 `/api/admin/functions/overview`，管理端数据大屏已接 `/api/admin/screens`，旧静态后台可从 `/prototype/admin/` 查看。
- 测试：`scripts/api-contract-test.js` 覆盖鉴权、越权和非法状态流转；`scripts/smoke-test.js` 覆盖三端闭环。

## 演示账号

当前为本地模拟登录，`POST /api/auth/login` 按 `role` 返回对应角色：

- `elder`：用户/老人。
- `family`：家属。
- `guide`：人工向导。
- `merchant`：商户。
- `admin`：平台管理员。

## 验收流程

1. 执行 `npm run check`，确认接口、数据表契约、权限、状态机、三端页面和核心业务流可用。
2. 打开 `/` 查看集成工作台与 API 状态。
3. 分别打开 `/user/#home`、`/guide/`、`/merchant/`、`/admin/` 检查四端页面。
4. 打开 `/api/delivery/initial-scope`，确认 1.2 首期交付范围六项校验为通过。
5. 打开 `/api/admin/mvp-delivery/completion`，确认 13 项总验收全部通过、`outstanding` 为空。
6. 打开 `/api/mvp/principles`，确认 1.3 两周 MVP 原则校验为通过，高依赖能力均为预留或模拟。
6. 打开 `/api/roles/endpoint-division`，确认第 2 节角色与端口划分五类角色校验为通过。
7. 打开 `/api/business-flow/overview`，确认第 3 节总体业务流程 7 步校验为通过。
8. 打开 `/api/user/functions/overview`，确认 4.1 用户端功能总览校验为通过；在 `/user/#home` 检查页面已水合 `4.1-user-function-overview-v1`。
9. 打开 `/api/user/home-requirements`，确认 4.2 首页需求校验为通过；在 `/user/#home` 检查城市、消息入口、Banner、快捷入口和底部 Tab。
10. 在集成工作台依次点击：用户下单、后台派单、向导接单、开始服务、完成上报、用户确认。
11. 在用户端提交商户服务订单，再到商户端完成报价、确认预约、完成上报。
12. 点击触发 SOS，确认异常列表和后台指标同步更新。
13. 在 AI 管家输入活动、健康、就医、SOS、政策相关问题，点击快捷问题和语音样例，确认 5 秒内返回友好答案、推荐服务入口可点击、最近对话会沉淀。
14. 打开 `/api/admin/system/collaboration`，确认第 8 节跨端协同通知机制校验为通过。
15. 打开 `/api/admin/system/modules`，确认 9.1 系统模块架构校验为通过。
16. 打开 `/api/admin/system/technology`，确认技术选型架构校验为通过。
17. 打开 `/api/admin/functions/overview`，确认 7.1 管理后台功能总览校验为通过。
18. 打开 `/api/admin/screens`，确认 7.2 管理端数据大屏校验为通过。
19. 打开 `/api/guide/functions/overview`，确认向导端功能总览校验为通过。
20. 打开 `/api/guide/order-requirements`，确认 4.7 旅居管家与人工向导下单需求校验为通过。
21. 打开 `/api/guide/order-status-flow`，确认 5.1 人工向导端订单状态流校验为通过。
22. 打开 `/api/ai/steward-requirements`，确认 4.3 智能管家需求校验为通过。
23. 打开 `/api/activities/map-requirements`，确认 4.4 活动地图需求校验为通过；打开 `/api/alerts/emergency-requirements`，确认 4.5 紧急求助需求校验为通过。
24. 打开 `/api/merchant/functions/overview`，确认商户端功能总览校验为通过。
25. 打开 `/api/merchant/service-categories`，确认 6.1 商户服务分类建议校验为通过。
26. 打开 `/api/admin/database/schema`，确认 10.1 核心数据表契约校验为通过。
27. 打开 `/api/admin/priority/status`，确认 P0/P1 为已完成、P2 为已预留入口/接口。

## MVP 边界

- 真实硬件接入、短信/电话、微信订阅消息、支付、地图 SDK、对象存储和真实大模型调用均已保留接口边界，当前使用模拟数据。
- 三端和后台已从静态原型提升为 API 驱动的本地工程，已具备模拟鉴权、模拟数据库和状态机，但仍未接入真实数据库、真实身份系统和生产级构建链。
- 四端 UI 参考图仍保留为静态原型，后续可逐步替换为 uni-app/Taro/Vue3 等生产工程。
- 模拟数据写入 `.runtime/mock-db.json`，适合演示和联调，不作为生产数据库。
