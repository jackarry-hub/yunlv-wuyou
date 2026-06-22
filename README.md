# 云旅无忧三端工程化 MVP

本项目是云旅无忧 AI 智慧旅居平台的本地可运行工程，包含用户端、人工向导端、商户端、管理后台和模拟后端 API。

## 目录

```text
apps/
  shared/      三端共享 API client、UI 工具和基础样式
  guide/       人工向导角色端旧参考实现，上线状态、任务接单、开始服务、完成上报
  merchant/    商户角色端旧参考实现，服务项目、预约报价、确认预约、完成上报
uniapp/        正式 uni-app 跨端工程，输出微信小程序、iOS App、Android App
  admin/       API 驱动管理后台，订单、异常、审计、模拟数据库状态
public/        集成工作台
data/          初始 mock 数据
server/lib/    模拟数据库、鉴权和状态机
scripts/       工程校验脚本
docs/          交付说明与验收截图
```

正式交付要求用户端输出微信小程序、iOS App、Android App，人工向导端和商户端作为小程序/App 内角色端承载。现有 UI 参考资料和旧参考实现仅用于迁移对照。

## 模拟上线基线

- 模拟数据库：`server/lib/mock-database.js` 统一封装 JSON 数据读写、快照和状态检查。
- 模拟鉴权：`server/lib/auth.js` 使用 HMAC JWT 和角色权限表，覆盖 elder、family、guide、merchant、admin。
- 状态机：`server/lib/state-machine.js` 限制订单、任务、异常的非法流转。
- 后台联动：`/admin/` 已改为 API 驱动后台，管理端数据大屏已接 `/api/admin/screens`，旧后台原型迁移到 `/prototype/admin/`。
- 部署配置：`.env.example`、`Dockerfile`、`deploy/docker-compose.yml`、`docs/deployment.md`。
- 优先级交付：`docs/priority-delivery.md` 按 P0/P1/P2 说明已完成闭环、增强功能和二期预留接口。
- 跨端协同通知：`docs/collaboration-notifications.md` 按第 8 节定义跨端触发、接收端和通知处理规则。
- 管理后台功能总览：`docs/admin-function-overview.md` 按 7.1 定义后台模块、功能需求、优先级和验收标准。
- 管理端数据大屏：`docs/admin-data-screens.md` 按 7.2 定义旅居养老作战大屏和人工向导调配大屏。
- 系统模块架构：`docs/system-modules.md` 按 9.1 模块架构定义模块、能力、接口和数据表覆盖。
- 技术选型架构：`docs/technology-stack.md` 定义移动端、后台、后端、数据库、地图、AI、对象存储和部署方案。
- uni-app 正式工程：`docs/uniapp-formal-engineering.md` 定义微信小程序、iOS App、Android App 与角色端工程骨架。
- MVP 接口清单：`docs/mvp-api-list.md` 按图示裸路径实现，同时兼容现有 `/api/*` 工程路径。
- 核心数据表：`docs/core-data-tables.md` 和 `database/schema.sql` 按 10.1 表建议定义表名、关键字段和 SQL 建表脚本。

## 启动

```bash
npm start
```

## 公网试运营地址

> 以下入口部署在云服务器上，使用同一个 Node API 和 MySQL 数据库，支持用户端、向导端、商户端、管理后台四端真实联动。

| 入口 | 地址 |
| --- | --- |
| 统一入口 | **[http://47.109.79.175/](http://47.109.79.175/)** |
| 用户端 | **[http://47.109.79.175/user/](http://47.109.79.175/user/)** |
| 向导端 | **[http://47.109.79.175/guide/](http://47.109.79.175/guide/)** |
| 商户端 | **[http://47.109.79.175/merchant/](http://47.109.79.175/merchant/)** |
| 管理后台 | **[http://47.109.79.175/admin/](http://47.109.79.175/admin/)** |
| API 健康检查 | **[http://47.109.79.175/api/health](http://47.109.79.175/api/health)** |

正式交付仍按需求书保留 uni-app 工程，输出微信小程序、iOS App、Android App，以及小程序/App 内的人工向导和商户角色端。

## 校验

```bash
npm run smoke
```

冒烟测试会使用临时运行期目录，不会污染 `.runtime/mock-db.json`。

完整检查：

```bash
npm run check
```

包含鉴权/权限/状态机契约测试和端到端冒烟测试。

图示 API 清单验收：

```bash
npm run test:mvp-api
```

核心数据表验收：

```bash
npm run test:db-schema
```

系统模块架构验收：

```bash
npm run test:modules
```

技术选型架构验收：

```bash
npm run test:technology
```

跨端协同通知验收：

```bash
npm run test:collaboration
```

管理后台功能总览验收：

```bash
npm run test:admin-functions
```

管理端数据大屏验收：

```bash
npm run test:admin-screens
```

优先级验收：

```text
GET /api/admin/system/collaboration
GET /api/admin/system/modules
GET /api/admin/system/technology
GET /api/admin/functions/overview
GET /api/admin/screens
GET /api/admin/priority/status
GET /api/integrations/status
GET /api/admin/database/schema
```

## 运行期数据

默认运行期数据写入：

```text
.runtime/mock-db.json
```

重置本地演示数据：

```bash
npm run reset:data
```

也可以用环境变量指定运行期目录：

```bash
YUNLV_RUNTIME_DIR=/tmp/yunlv-runtime npm start
```
