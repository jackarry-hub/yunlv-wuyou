# 5.1 人工向导端订单状态流

本工程已按 `5.1 人工向导端订单状态流` 建立状态流契约、服务端状态机映射和自动化验收脚本。该状态流复用订单与任务状态，不额外制造一套前端假状态。

## 状态矩阵

| 状态 | 触发动作 | 可执行操作 |
| --- | --- | --- |
| 待接单 | 平台派单/订单进入大厅 | 查看详情、接单、拒绝/忽略 |
| 已接单 | 人工向导确认接单 | 联系客户、查看路线、申请取消、开始服务 |
| 服务中 | 点击开始服务/到达服务地点 | 导航、电话、上传过程记录、异常上报、完成服务 |
| 待确认 | 人工向导提交完成 | 等待用户/后台确认 |
| 已完成 | 用户确认或后台确认 | 查看评价、进入结算 |
| 已取消 | 用户取消、向导取消、后台取消 | 查看取消原因 |

## 工程位置

- 状态流契约：`server/lib/guide-order-status-flow.js`
- 状态机映射：`server/lib/state-machine.js`
- 查询接口：`GET /api/guide/order-status-flow`
- 图示裸路径：`GET /guide/order-status-flow`
- 向导拒绝任务：`POST /api/guide/tasks/{id}/decline`
- 向导忽略任务：`POST /api/guide/tasks/{id}/ignore`
- 向导申请取消：`POST /api/guide/tasks/{id}/cancel`
- 向导端展示入口：`/guide/#03`
- 总参考接口：`GET /api/reference` 中的 `guideOrderStatusFlow`
- 自动验收脚本：`npm run test:guide-flow`

## 状态流说明

- `待接单 -> 已接单`：后台派单后执行 `POST /api/tasks/{id}/accept`，或向导在大厅执行 `POST /api/guide/tasks/claim-next`。
- `待接单 -> 已取消`：向导拒绝任务执行 `POST /api/guide/tasks/{id}/decline`，会写入拒绝原因、消息和审计。
- `待接单 -> 待接单`：向导忽略任务执行 `POST /api/guide/tasks/{id}/ignore`，不改变任务状态，但会写入忽略原因和后台消息。
- `已接单 -> 服务中`：向导点击开始服务执行 `POST /api/tasks/{id}/start`。
- `已接单/服务中 -> 已取消`：向导申请取消执行 `POST /api/guide/tasks/{id}/cancel`，会写入取消原因并同步用户与后台。
- `服务中 -> 待确认`：向导完成服务执行 `POST /api/tasks/{id}/complete`。
- `待确认 -> 已完成`：用户或后台确认执行 `POST /api/orders/{id}/confirm`，同时写入评价和收入数据。
