# 7.2 管理端数据大屏

本页对应“7.2 管理端数据大屏”，已按 MVP 可演示版本落到后台真实接口和管理端页面。

## 大屏清单

| 大屏 | 核心指标 | 用途 |
| --- | --- | --- |
| 旅居养老作战数据大屏 | 老人总数、在线人数、健康状态分布、设备在线、异常预警、SOS、服务工单、满意度 | 监控旅居老人整体安全、健康和服务情况。 |
| 人工向导工作调配大屏 | 向导总数、在线/服务中/空闲、待派单、今日服务量、服务时段、异常处理、排行 | 用于实时派单、资源调度和服务质量管理。 |

## 工程实现

- 后台聚合模块：`server/lib/admin-data-screens.js`
- 总览接口：`GET /api/admin/screens`
- 养老作战大屏接口：`GET /api/admin/screens/elder-care`
- 向导调配大屏接口：`GET /api/admin/screens/guide-dispatch`
- 管理端页面：`/admin/#operation-screen`、`/admin/#elder-screen`、`/admin/#guide-screen`
- 自动验收：`npm run test:admin-screens`

## 当前数据来源

- 老人、健康、设备、异常、订单、服务请求、评价来自模拟数据库。
- 向导在线状态、任务、待派单、服务时段、排行来自向导、订单和任务数据。
- 后续接真实数据库时，保留接口结构，只替换 `admin-data-screens` 的数据读取层。
