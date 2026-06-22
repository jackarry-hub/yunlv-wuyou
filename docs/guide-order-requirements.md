# 4.7 旅居管家与人工向导下单需求

本工程已按图示 `4.7 旅居管家与人工向导下单需求` 建立后端契约、接口和用户端真实下单表单。该契约用于约束用户端创建人工向导类订单时必须采集的字段，并把订单同步到后台待派单与向导任务列表。

## 服务分类

| 服务分类 | 功能描述 | 订单字段 | 优先级 |
| --- | --- | --- | --- |
| 陪伴就医 | 挂号取号、陪同就诊、检查缴费、取药等 | 服务时间、医院、老人信息、备注 | P0 |
| 导游游览 | 景点讲解、路线规划、拍照陪同、行程安排 | 目的地、时间、人数、交通需求 | P0 |
| 护工护理 | 日常照护、康复协助、陪伴护理、生活照料 | 护理时长、护理要求、健康备注 | P0 |
| 接送出行 | 机场/高铁站接送、日常出行、代驾陪同 | 起点、终点、时间、人数 | P1 |
| 帮办代办 | 证件办理、业务代办、生活缴费、快递代取 | 代办事项、材料、时间 | P1 |
| 生活陪伴 | 聊天解闷、散步购物、棋牌娱乐、情感陪伴 | 服务地点、时长、需求说明 | P1 |

## 工程接入

- 契约模块：`server/lib/guide-order-requirements.js`
- 查询接口：`GET /api/guide/order-requirements`
- 图示裸路径：`GET /guide/order-requirements`
- 创建订单：`POST /api/orders`
- 用户端入口：`/user/#guide` 与 `/user/#order-submit` 的真实统一下单表单
- 自动验收脚本：`npm run test:guide-requirements`

## 当前行为

- 用户端统一下单表单从 `/api/guide/order-requirements` 读取 6 类服务和字段要求。
- `POST /api/orders` 在 `strictRequirements=true` 时会校验当前服务分类的必填字段。
- `护工护理` 按图示归入人工向导 P0 服务，不再被旧关键词规则误判为商户服务。
- 创建成功的订单会保存 `requirementCategory`、`requirementPriority`、`orderFields`、`fieldLabels`，后台派单与向导任务列表读取同一笔真实数据。
