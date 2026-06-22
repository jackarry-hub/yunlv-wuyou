# 云旅无忧 Bug 清单

> 版本：v1.2 | 日期：2026-06-14 | 状态：MVP公网部署验证完成

---

## Bug 统计

| 等级 | 数量 | 说明 |
|------|------|------|
| P0 致命 | 0 | 系统不可用 |
| P1 严重 | 0 | 核心功能不可用 |
| P2 一般 | 1 | 功能异常但有替代方案 |
| P3 轻微 | 3 | 体验问题或边缘场景 |
| **合计（遗留）** | **4** | |

---

## 公网部署验证结果

> 部署时间：2026-06-14 23:56 CST
> 部署方式：仅上传 `server.js` + `server/lib/auth.js`（增量部署）
> 服务器：47.109.79.175 (Ubuntu) | 服务管理：systemd `yunlv-wuyou.service`
> 四端验证：**28/28 项全部通过**

### 用户端（8/8 通过）

| # | 功能 | 接口 | 结果 |
|---|------|------|------|
| 1 | AI管家对话 | `POST /api/ai/chat` | ✅ |
| 2 | 快捷问题 | `GET /api/ai/quick-questions` | ✅ 7条 |
| 3 | 向导列表 | `GET /api/guides` | ✅ 5名 |
| 4 | 创建订单 | `POST /api/orders` | ✅ |
| 5 | 订单列表 | `GET /api/orders` | ✅ 22条 |
| 6 | SOS紧急求助 | `POST /api/alerts/sos` | ✅ |
| 7 | 快捷求助 | `GET /api/alerts/quick-help` | ✅ 5项 |
| 8 | 个人资料 | `GET /api/user/profile` | ✅ |

### 向导端（7/7 通过）

| # | 功能 | 接口 | 结果 |
|---|------|------|------|
| 1 | 工作台 | `GET /api/guide/dashboard` | ✅ |
| 2 | 统计 | `GET /api/guide/stats` | ✅ |
| 3 | 接单分类 | `GET /api/guide/categories` | ✅ 6个 |
| 4 | 任务列表 | `GET /api/guide/tasks` | ✅ 5条 |
| 5 | 抢单 | `POST /api/guide/claim-next` | ✅ |
| 6 | 订单状态流转 | `POST /api/guide/orders/{id}/confirm\|start\|complete` | ✅ |
| 7 | 订单状态流文档 | `GET /api/guide/order-status-flow` | ✅ |

### 商户端（5/5 通过）

| # | 功能 | 接口 | 结果 |
|---|------|------|------|
| 1 | 工作台 | `GET /api/merchant/dashboard` | ✅ |
| 2 | 服务列表 | `GET /api/merchant/services` | ✅ 5项 |
| 3 | 服务分类 | `GET /api/merchant/categories` | ✅ 7个 |
| 4 | 订单列表 | `GET /api/merchant/orders` | ✅ 10条 |
| 5 | 处理订单 | `POST /api/merchant/orders/{id}` | ✅ |

### 管理后台（8/8 通过）

| # | 功能 | 接口 | 结果 |
|---|------|------|------|
| 1 | Dashboard | `GET /api/admin/dashboard` | ✅ |
| 2 | 订单管理 | `GET /api/admin/orders` | ✅ 22条 |
| 3 | 告警管理 | `GET /api/admin/alerts` | ✅ 13条 |
| 4 | 向导管理 | `GET /api/admin/guides` | ✅ 5名 |
| 5 | 商户管理 | `GET /api/admin/merchants` | ✅ 4家 |
| 6 | 用户管理 | `GET /api/admin/users` | ✅ 3人 |
| 7 | 服务管理(GET) | `GET /api/admin/services` | ✅ 7项 |
| 8 | 服务管理(POST) | `POST /api/admin/services` | ✅ |
| 9 | 调度管理 | `GET /api/admin/dispatch` | ✅ |

### 四端数据共享验证

| 验证项 | 结果 |
|--------|------|
| 用户端创建订单 → 管理后台可见 | ✅ |
| 管理后台可见 → 向导端抢单 | ✅ |
| 向导接单后 → 用户端订单状态实时同步 | ✅ |
| 四端共用同一后端数据库 | ✅ |

---

## 已修复 Bug（本轮全部已部署到公网并验证通过）

| Bug ID | 模块 | 标题 | 修复内容 | 修复日期 | 公网验证 |
|--------|------|------|----------|----------|----------|
| BUG-001 | 用户端 | `/api/guides` 权限不足 | `auth.js`: elder/family 角色添加 `guide:read`、`merchant:read` | 2026-06-14 | ✅ |
| BUG-006 | 商户端 | `POST /api/merchant/orders/{id}` 路由缺失 | `server.js`: 新增商户订单通用处理路由 | 2026-06-14 | ✅ |
| BUG-007 | 管理后台 | `POST /api/admin/services` 路由缺失 | `server.js`: 新增服务创建接口 | 2026-06-14 | ✅ |
| BUG-008 | 向导端 | `GET /api/guide/tasks` 路由缺失 | `server.js`: 新增独立任务列表路由，复用 `computeGuideDashboard()` | 2026-06-14 | ✅ |
| BUG-009 | 向导端 | `GET /api/guide/categories` 路由缺失 | `server.js`: 新增接单分类路由，复用 `guideOrderRequirementsForApi()` | 2026-06-14 | ✅ |
| BUG-010 | 向导端 | `/api/guide/claim-next` 别名缺失 | `server.js`: 添加别名指向 `/api/guide/tasks/claim-next` | 2026-06-14 | ✅ |
| BUG-011 | 向导端 | `/api/guide/orders/{id}/confirm\|start\|complete` 路由缺失 | `server.js`: 新增向导订单状态流转路由+幂等处理 | 2026-06-14 | ✅ |
| BUG-012 | 向导端 | guide 角色缺少 `order:confirm` 权限 | `auth.js`: guide 角色添加 `order:confirm` 权限 | 2026-06-14 | ✅ |
| BUG-013 | 用户端 | `GET /api/alerts/quick-help` 路由缺失 | `server.js`: 新增 GET 路由返回快捷求助渠道列表 | 2026-06-14 | ✅ |
| BUG-014 | 商户端 | `/api/merchant/categories` 别名缺失 | `server.js`: 添加别名指向 `/api/merchant/service-categories` | 2026-06-14 | ✅ |
| BUG-015 | 管理后台 | `/api/admin/dispatch` 别名缺失 | `server.js`: 添加别名指向 `/api/admin/dispatch/pending` | 2026-06-14 | ✅ |
| BUG-016 | 用户端 | elder 角色缺少 `alert:read` 权限 | `auth.js`: elder 角色添加 `alert:read` 权限 | 2026-06-14 | ✅ |

---

## 遗留 Bug（非阻塞）

### P2 一般

| Bug ID | 模块 | 标题 | 描述 | 复现步骤 | 状态 | 备注 |
|--------|------|------|------|----------|------|------|
| BUG-002 | 管理后台 | 批量操作无二次确认 | 后台批量删除/禁用操作缺少二次确认弹窗 | 1.管理员登录 2.选择多条记录 3.点击批量操作 | 已确认 | MVP阶段风险可控，二期优化 |

### P3 轻微

| Bug ID | 模块 | 标题 | 描述 | 复现步骤 | 状态 | 备注 |
|--------|------|------|------|----------|------|------|
| BUG-003 | 用户端/AI管家 | AI回复偶尔超时 | 当DeepSeek API Key未配置时，AI仅返回模拟回复 | 1.未配置API Key 2.发送问题 | 设计如此 | MVP预期行为，有模拟兜底 |
| BUG-004 | 移动端 | 个别机型底部安全区域遮挡 | 部分Android全面屏底部TabBar可能被系统导航栏遮挡 | 特定机型 | 待验证 | uni-app SafeArea组件可解决 |
| BUG-005 | 通用 | 时区未统一 | 服务器时间戳使用本地时区，未强制UTC+8 | 部署到非中国时区服务器 | 已确认 | MVP阶段默认部署在国内服务器 |

---

## 修改文件清单

| 文件 | 修改内容 | 变更量 |
|------|----------|--------|
| `server.js` | 新增路由、路由别名、白名单、幂等处理 | +190行 |
| `server/lib/auth.js` | 角色权限补充（elder/guide/family） | +8行 |

---

## 说明

1. 所有 P0/P1 级别 Bug 均已在开发阶段修复
2. BUG-001~016 共 12 个问题已在 2026-06-14 公网验证中发现并修复，**全部部署到公网服务器并验证通过**
3. 当前遗留 4 个 Bug 均为非阻塞性问题，不影响核心业务流程
4. P2 Bug 计划在二期迭代中修复
5. P3 Bug 视优先级在后续版本中处理
