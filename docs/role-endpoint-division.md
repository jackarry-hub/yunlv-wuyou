# 2. 角色与端口划分

本工程已按 `2. 角色与端口划分` 建立运行时角色契约。角色边界不仅写在文档里，也接入了服务端接口、权限点、端口路由和自动化验收脚本。

## 角色矩阵

| 角色 | 本质定位 | 核心任务 | 使用端 |
| --- | --- | --- | --- |
| 用户/老人 | 服务需求发起者与健康数据主体 | 查看健康、预约服务、参加活动、一键求助、接收反馈 | 微信小程序 / iOS App / Android App |
| 家属 | 远程关怀与紧急联系人 | 查看老人状态、接收预警、跟进服务记录、参与决策 | 微信小程序 / iOS App / Android App |
| 人工向导 | 接单执行者（轻服务） | 接收任务、上门陪护、导游游览、陪伴就医、服务反馈 | 小程序/App 内人工向导角色端 |
| 商户 | 专业服务提供方（重服务） | 医疗卫生、康养护理、生活服务、殡葬等专业服务承接 | 小程序/App 内商户角色端 |
| 平台运营/管理员 | 平台中枢与调度管理者 | 监控数据、调度任务、管理人员/商户/服务/异常 | 管理后台 |

## 工程映射

| 角色 | 端口路由 | 主要接口 | 权限来源 |
| --- | --- | --- | --- |
| 用户/老人 | `/user/`、`/user/#home`、`/user/#assistant`、`/user/#activity-map`、`/user/#emergency`、`/user/#orders`、`/user/#messages` | `/user/profile`、`/elder/profile`、`/health/overview`、`/activities`、`/orders`、`/alerts/sos`、`/messages` | `server/lib/auth.js` 的 `elder` 权限 |
| 家属 | `/user/#family`、`/user/#profile`、`/user/#health`、`/user/#orders`、`/user/#messages` | `/user/profile`、`/elder/profile`、`/health/overview`、`/family-contacts`、`/orders`、`/alerts`、`/messages` | `server/lib/auth.js` 的 `family` 权限 |
| 人工向导 | `/guide/`、`/guide/#14`、`/guide/#01`、`/guide/#03`、`/guide/#07`、`/guide/#44` | `/guide/dashboard`、`/guide/functions/overview`、`/guide/order-requirements`、`/guide/tasks/claim-next`、`/tasks/{id}/accept`、`/tasks/{id}/complete` | `server/lib/auth.js` 的 `guide` 权限 |
| 商户 | `/merchant/`、`/merchant/#15`、`/merchant/#16`、`/merchant/#19`、`/merchant/#24`、`/merchant/#31` | `/merchant/dashboard`、`/merchant/functions/overview`、`/merchant/service-categories`、`/merchant/services`、`/merchant/orders`、`/merchant/orders/{id}/complete` | `server/lib/auth.js` 的 `merchant` 权限 |
| 平台运营/管理员 | `/admin/`、`/admin/#dashboard`、`/admin/#orders`、`/admin/#dispatch`、`/admin/#alerts`、`/admin/#users` | `/admin/dashboard`、`/admin/users`、`/admin/guides`、`/admin/merchants`、`/admin/orders`、`/tasks/dispatch`、`/admin/alerts` | `server/lib/auth.js` 的 `admin` 权限 |

## 工程位置

- 角色契约：`server/lib/role-endpoint-division.js`
- 查询接口：`GET /api/roles/endpoint-division`
- 图示裸路径：`GET /roles/endpoint-division`
- 总参考接口：`GET /api/reference`
- 自动验收脚本：`npm run test:role-endpoints`

## 当前实现边界

- 用户/老人、家属、人工向导、商户、平台运营/管理员五类角色均有账号、端口、权限和 API 映射。
- 用户与家属正式交付端为微信小程序、iOS App、Android App，沿用同一套 API 和权限契约。
- 人工向导、商户正式交付为小程序/App 内角色端，接单、服务、派单、审核、异常处理等能力接入统一 API 与状态机。
- 企业级 IAM、组织权限、App 打包和小程序发布可在现有角色契约上替换接入。
