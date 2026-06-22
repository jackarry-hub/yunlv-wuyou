# 10.1 核心数据表

本工程已按 `10.1 核心数据表建议` 建立数据表契约。当前演示环境仍使用 JSON 模拟数据库，表契约负责把图示表名和关键字段映射到现有运行数据；后续切换真实数据库时可直接参考 `database/schema.sql` 建表。

## 表契约

| 数据表/对象 | 当前 mock 数据源 | 关键字段 |
| --- | --- | --- |
| `user` | `users` | `id, phone, nickname, role, avatar, status` |
| `elder_profile` | `elderProfile` | `user_id, name, gender, age, health_tags, address` |
| `family_contact` | `familyContacts` | `elder_id, name, relation, phone, is_default` |
| `guide` | `guides` | `user_id, real_name, service_types, area, status, rating` |
| `merchant` | `merchants` | `name, type, license, contact, address, status` |
| `service_item` | `services` | `provider_type, provider_id, title, category, price, status` |
| `order` | `orders` | `order_no, user_id, service_type, provider_type, status, amount, time, location` |
| `task` | `tasks` | `order_id, assignee_type, assignee_id, status, dispatch_rule` |
| `activity` | `activities` | `title, category, time, location, coordinates, quota, status` |
| `device` | `devices` | `device_id, type, user_id, battery, online_status` |
| `health_record` | `healthRecords` | `elder_id, metric_type, value, unit, source, recorded_at` |
| `alert` | `alerts` | `elder_id, type, level, location, status, handled_by` |
| `ai_chat` | `aiHistory` | `user_id, question, answer, intent, created_at` |

## 工程位置

- 表结构契约：`server/lib/database-schema.js`
- SQL 建表脚本：`database/schema.sql`
- 数据状态接口：`GET /api/admin/database/status`
- 数据表 schema 接口：`GET /api/admin/database/schema`
- 自动验收脚本：`npm run test:db-schema`

## 说明

- `user` 和 `order` 按图示保留原名，SQL 中使用双引号避免与数据库关键字冲突。
- 当前 JSON 数据使用驼峰字段，表契约中保留 snake_case 目标字段和 mock 字段映射。
- `health_tags`、`service_types`、`coordinates` 当前以 JSON/数组形式存储，真实数据库可按 PostgreSQL `jsonb` 或 MySQL `json` 实现。
- `id`、`created_at`、`updated_at` 是工程补充字段，便于真实数据库主键、审计和增量同步。
