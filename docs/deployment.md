# 模拟上线部署说明

当前部署配置用于试点前的本地或内网演示，不代表最终生产架构。

## 环境变量

复制 `.env.example` 并替换密钥：

```bash
cp .env.example .env
```

关键变量：

- `PORT`：服务监听端口。
- `YUNLV_RUNTIME_DIR`：运行期 JSON 数据目录。
- `YUNLV_SEED_DB`：初始化数据文件。
- `YUNLV_AUTH_SECRET`：模拟 JWT 签名密钥，试点环境必须替换。
- `DEEPSEEK_API_KEY`：DeepSeek API 密钥，只配置在 Node 后端环境变量中，不写入前端静态文件。
- `DEEPSEEK_MODEL`：默认 `deepseek-chat`。
- `DB_CLIENT`：生产环境使用 `mysql`，本地无 MySQL 时可保持 `json`。
- `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD`：MySQL 连接信息。
- `DB_POOL_SIZE`：MySQL 连接池大小，默认 `10`。

## Docker Compose

```bash
cd deploy
docker compose up --build
```

## 公网试运营入口

当前公网环境部署在云服务器上，前端、Node API 和 MySQL 数据库同源运行，用于四端真实业务联动验收。正式移动端仍按需求书使用 uni-app 输出微信小程序、iOS App、Android App。

| 入口 | 地址 |
| --- | --- |
| 统一入口 | **[http://47.109.79.175/](http://47.109.79.175/)** |
| 用户端 | **[http://47.109.79.175/user/](http://47.109.79.175/user/)** |
| 向导端 | **[http://47.109.79.175/guide/](http://47.109.79.175/guide/)** |
| 商户端 | **[http://47.109.79.175/merchant/](http://47.109.79.175/merchant/)** |
| 管理后台 | **[http://47.109.79.175/admin/](http://47.109.79.175/admin/)** |
| API 健康检查 | **[http://47.109.79.175/api/health](http://47.109.79.175/api/health)** |

移动端正式体验构建产物：

```text
微信小程序: uniapp/dist/build/mp-weixin
iOS/Android App: uniapp/dist/build/app
```

## Render 部署

1. 将项目推送到 GitHub。
2. 在 Render 新建 Blueprint，选择该 GitHub 仓库。
3. Render 会读取根目录 `render.yaml`，执行 `npm run check` 并启动 `npm start`。
4. 在 Render 服务的 Environment 中填写 `DEEPSEEK_API_KEY`。
5. 部署完成后，将 Render 分配的域名代入上面的四个路径。

## 发布前检查

```bash
npm run check
```

检查范围：

- 服务端与测试脚本语法检查。
- API 鉴权、权限和状态机契约测试。
- 三端页面、核心业务流和模拟数据库状态冒烟测试。

## 当前数据库模式

- 服务器生产环境使用 MySQL。
- Node 后端通过 `mysql2/promise` 连接池访问 MySQL，不再通过命令行 `mysql` 同步写入。
- 启动时自动执行 `database/migrations/*.sql`，执行记录写入 `schema_migrations`。
- 业务状态写入 `app_state` 作为兼容快照，同时拆分同步到 `users`、`elder_profiles`、`family_contacts`、`guides`、`merchants`、`services`、`activities`、`devices`、`health_records`、`orders`、`tasks`、`alerts`、`messages`、`ai_chats`、`audit_logs`、`reviews`、`ui_actions`、`activity_signups`、`service_requests` 等关系表。
- 服务端读取时优先从关系表恢复核心业务集合，`app_state` 保留为兜底。
- 鉴权是本地 HMAC JWT 模拟，通过 `YUNLV_AUTH_SECRET` 签名。
- 后台、三端和工作台已接入真实 API，但支付、短信、硬件、地图和大模型仍是接口边界。
