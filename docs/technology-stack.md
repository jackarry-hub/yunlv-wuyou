# 技术选型与部署架构

本工程已按技术选型建议建立架构契约。当前目标是可演示、可试运营、可验收，因此部分生产级组件采用接口预留或本地模拟实现。

## 技术层级

| 层级 | 建议方案 | 当前 MVP 实现 | 状态 |
| --- | --- | --- | --- |
| 用户端与角色端跨端移动应用 | uni-app（优先）/ Taro（备选） | uni-app 正式工程骨架 + shared API client | 输出微信小程序、iOS App、Android App，人工向导/商户作为小程序/App 内角色端 |
| 管理后台 | Vue3 + Element Plus / React + Ant Design | API 驱动 PC Web 后台 | 试运营可验收，生产建议 Vue3 + Element Plus |
| 后端服务 | Node.js NestJS / Java Spring Boot / Python FastAPI | Node.js http server + 模块化 lib | 核心 REST API 已实现，生产建议升级 NestJS 或 Spring Boot |
| 数据库 | MySQL/PostgreSQL + Redis | JSON mock database + 核心表契约 + SQL 建表脚本 | 试运营数据闭环可验收，生产需迁移 PostgreSQL/MySQL + Redis |
| 地图服务 | 腾讯地图 / 高德地图 | 活动地图 API + 高德地图接入预留 | 地图点位已驱动，真实定位/路线能力按 P2 接入 |
| AI 能力 | 大模型 API + 知识库 + 规则引擎 | 本地意图模拟 + AI 历史记录 + LLM 接口预留 | 试运营可演示，生产需接入真实大模型和知识库 |
| 对象存储 | 阿里云 OSS / 腾讯云 COS | 本地静态资源 + 上传动作/凭证字段预留 | 本地演示可用，生产需接 OSS/COS |
| 部署 | 云服务器 + Docker + Nginx + HTTPS | Dockerfile + docker-compose + 部署文档 | 内网/本地演示配置已具备，生产需补域名、HTTPS 和 CI/CD |

## 工程位置

- 技术架构契约：`server/lib/technology-stack.js`
- 后台查询接口：`GET /api/admin/system/technology`
- 集成预留接口：`GET /api/integrations/status`
- 部署文档：`docs/deployment.md`
- 自动验收脚本：`npm run test:technology`

## 生产替换顺序

1. 移动端使用 uni-app/Taro 跨端工程；优先使用 uni-app 输出微信小程序、iOS App、Android App，人工向导和商户作为 App/小程序内角色端。
2. 后台迁移到 Vue3 + Element Plus。
3. 后端从单文件 HTTP 服务拆到 NestJS/Spring Boot/FastAPI 项目结构。
4. 数据层从 JSON mock database 迁移到 PostgreSQL/MySQL，并接入 Redis。
5. 地图、AI、对象存储、短信/电话、App Push 接入真实第三方服务。
6. 云服务器部署 Docker 镜像，配置 Nginx、HTTPS、域名和 CI/CD。
