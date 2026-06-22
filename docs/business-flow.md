# 3. 总体业务流程

本工程已按 `3. 总体业务流程` 建立跨端流程契约、运行数据接口和自动验收脚本。该流程不是单独页面，而是串联用户端、设备、管理后台、人工向导端、商户端、家属端和数据中台的主业务闭环。

## 流程矩阵

| 步骤 | 流程动作 | 系统处理 | 涉及端口 | 当前接口 |
| --- | --- | --- | --- | --- |
| 1 | 需求发起 | 用户手动下单、设备异常预警、定期服务需求触发 | 用户端 / 设备 | `POST /api/orders`、`POST /api/service-requests`、`POST /api/alerts/sos`、`POST /api/devices/{id}/sync` |
| 2 | 智能分析 | 平台识别需求类型、紧急程度、地理位置、服务偏好 | 平台中枢 / 管理后台 | `GET /api/guide/order-requirements`、`GET /api/admin/dispatch/candidates`、`GET /api/admin/dispatch/pending` |
| 3 | 任务分配 | 轻服务分配人工向导，专业服务分配商户，必要时管理员介入 | 管理端 / 人工向导端 / 商户端 | `POST /api/tasks/dispatch`、`POST /api/guide/tasks/claim-next`、`GET /api/guide/dashboard`、`GET /api/merchant/dashboard` |
| 4 | 服务执行 | 向导或商户接单，联系用户，上门/远程/到店完成服务 | 人工向导端 / 商户端 / 用户端 | `POST /api/tasks/{id}/accept`、`POST /api/tasks/{id}/start`、`POST /api/tasks/{id}/complete`、`POST /api/merchant/orders/{id}/complete` |
| 5 | 反馈上报 | 上传服务结果、异常记录、图片/文字备注、完成状态 | 人工向导端 / 商户端 | `POST /api/tasks/{id}/complete`、`POST /api/guide/exception`、`POST /api/merchant/exception` |
| 6 | 结果反馈 | 用户和家属查看服务完成情况并评价 | 用户端 / 家属端 | `GET /api/orders`、`GET /api/orders/{id}`、`POST /api/orders/{id}/confirm`、`GET /api/messages`、`GET /api/reviews` |
| 7 | 数据沉淀 | 沉淀用户数据、健康数据、服务数据、评价数据，优化推荐和调度 | 管理后台 / 数据中台 | `GET /api/admin/data-loop`、`GET /api/admin/database/schema`、`GET /api/admin/screens` |

## 工程位置

- 流程契约：`server/lib/business-flow.js`
- 总体业务流程接口：`GET /api/business-flow/overview`
- 裸路径接口：`GET /business-flow/overview`
- 总参考接口：`GET /api/reference`
- 自动验收脚本：`npm run test:business-flow`

## 当前实现边界

- 7 个流程步骤均已映射到现有订单、服务请求、SOS、设备异常、派单、履约、评价、消息和数据沉淀接口。
- 接口返回每步运行期统计，例如待派单、任务数、服务中任务、异常记录、待确认订单、健康记录和评价记录。
- 当前使用模拟数据库完成可演示、可试运营、可验收的闭环；真实定期服务调度、外部设备协议、推荐优化算法按 P2 预留。

## 验收脚本

```bash
npm run test:business-flow
```

脚本会启动临时服务和临时数据目录，验证 7 个图示步骤、接口映射、运行期统计、裸路径别名、参考接口，并真实跑一条“用户下单 -> 后台派单 -> 向导接单 -> 完成服务 -> 用户确认评价”的闭环。
