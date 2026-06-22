# 4.2 首页需求

本工程已按 `4.2 首页需求` 建立接口契约、首页运行数据和自动验收脚本。当前用户端首页继续保持参考图高保真结构，同时通过接口水合当前城市、消息未读、Banner 配置和入口可用状态。

## 需求矩阵

| 功能点 | 详细需求 | 验收标准 | 当前接口 |
| --- | --- | --- | --- |
| 顶部区域 | 显示 Logo、当前城市、消息/通知入口。城市首期默认弥勒/昆明，可手动切换。 | 顶部信息完整，消息入口可进入消息列表。 | `GET /api/user/home-requirements`、`POST /api/user/home-city`、`GET /api/messages?role=user` |
| Banner | 展示旅居生活主题图与项目口号，支持后台配置。 | 可从后台替换 Banner 图片与文案。 | `GET /api/user/home-requirements`、`GET/PUT /api/admin/content/home` |
| 快捷服务 | 安全守护、健康服务、旅居管家、政策指南四个快捷入口。 | 点击进入对应页面，无法跳转的动作必须写入真实业务记录并返回明确结果。 | `GET /api/user/home-requirements`、`POST /api/ui/actions` |
| 功能宫格 | 旅居目的地、活动日历、社群交流、旅居打卡、本地美食、交通出行、优选商城、志愿服务。 | 功能名称与图标清晰，至少 P0 入口可用。 | `GET /api/user/home-requirements`、`POST /api/service-requests` |
| 活动推荐 | 展示 3-4 个推荐活动，包含图片、标签、时间、地点、报名人数。 | 活动从后台配置，用户可进入详情。 | `GET /api/user/home-requirements`、`GET /api/activities`、`GET/POST /api/admin/activities` |
| 底部导航 | 首页、发现/旅居管家、人工向导、消息、我的。 | 各 Tab 跳转正常。 | `GET /api/user/home-requirements`、`POST /api/ui/actions` |

## 工程位置

- 需求契约：`server/lib/user-home-requirements.js`
- 首页需求接口：`GET /api/user/home-requirements`
- 当前城市切换：`POST /api/user/home-city`
- 后台首页内容配置：`GET/PUT /api/admin/content/home`
- 用户端首页：`/user/#home`
- 自动验收脚本：`npm run test:user-home`

## 当前实现边界

- 顶部 Logo、当前城市和消息入口已可通过接口验证，城市可在弥勒/昆明等配置城市中手动切换。
- Banner 图片、标题和口号已支持后台接口替换，前端首页加载后会水合最新配置。
- 四个快捷服务、八个功能宫格、活动推荐和底部 Tab 已纳入 4.2 契约，路由和运行状态可自动验收。
- 活动推荐读取真实活动数据，后台活动新增/上下线后可进入首页推荐池。

## 验收脚本

```bash
npm run test:user-home
```

脚本会启动临时服务和临时数据目录，验证需求行、首页聚合数据、城市切换、后台 Banner 替换、活动推荐字段、底部导航和裸路径别名。
