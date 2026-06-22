# uni-app 正式跨端工程

本工程从本次迭代开始以 `uniapp/` 作为正式移动端交付工程。

## 交付端

| 端 | 交付形态 | 工程位置 |
| --- | --- | --- |
| 用户端 | 微信小程序、iOS App、Android App | `uniapp/pages/user/*` |
| 人工向导端 | 小程序/App 内人工向导角色端 | `uniapp/pages/guide/*` |
| 商户端 | 小程序/App 内商户角色端 | `uniapp/pages/merchant/*` |
| 管理后台 | PC Web 管理后台 | 继续按后台工程和 API 演进 |

## 已落地骨架

- `uniapp/manifest.json`：配置微信小程序、App、定位/地图权限。
- `uniapp/pages.json`：注册登录、角色切换、用户端 01-40、向导端 01-46、商户端 01-70 页面。
- `uniapp/common/api.js`：统一 API client，通过 `VITE_API_BASE_URL` 指向后端服务。
- `uniapp/store/app-store.js`：统一登录态、角色态、当前用户资料。
- `uniapp/common/roles.js`：统一用户、人工向导、商户角色定义。
- `uniapp/common/native.js`：封装定位、地图、拨号等小程序/App 能力。
- `uniapp/common/user-pages.js`：用户端参考页配置和真实动作映射。
- `uniapp/common/role-reference-pages.js`：向导端、商户端参考页配置和真实动作映射。
- `uniapp/components/*`：通用页面、卡片、按钮、状态、订单卡、角色导航组件。

## P0 闭环页面

用户端：

- 首页：`pages/user/home`
- 人工向导/AI 咨询：`pages/user/assistant`
- 活动地图：`pages/user/activity-map`
- 紧急求助：`pages/user/emergency`
- 统一下单：`pages/user/order-create`
- 订单追踪/确认评价：`pages/user/orders`
- 消息中心：`pages/user/messages`
- 我的：`pages/user/profile`

人工向导端：

- 接单大厅：`pages/guide/hall`
- 订单详情：`pages/guide/order-detail`
- 服务中：`pages/guide/service`
- 异常上报：`pages/guide/exception`
- 今日收入：`pages/guide/income`

商户端：

- 工作台：`pages/merchant/workbench`
- 服务发布/管理：`pages/merchant/services`
- 预约订单：`pages/merchant/orders`
- 报价确认：`pages/merchant/quote`
- 完成服务：`pages/merchant/service-complete`
- 评价售后：`pages/merchant/reviews`

## 用户端 01-40 覆盖

用户端参考图 01-40 已全部进入正式 `uniapp/pages/user` 路由清单；其中首页、人工向导、活动地图、紧急求助、订单、消息、我的等 P0 页面为独立闭环页面，其余参考页统一接入 `YlUserReferencePage`，先保证页面可进入、按钮可点击、可跳转动作走真实路由，服务动作走订单/SOS/活动报名/设备同步/AI/记录接口。

## 向导端 01-46 覆盖

向导端参考图 01-46 已全部进入正式 `uniapp/pages/guide` 路由清单；接单大厅、订单详情、服务中、异常上报、今日收入等 P0 页面为独立闭环页面，其余参考页统一接入 `YlRoleReferencePage`，动作接入向导 dashboard、收入、抢单、任务状态推进、异常上报、消息已读和操作记录接口。

## 商户端 01-70 覆盖

商户端参考图 01-70 已全部进入正式 `uniapp/pages/merchant` 路由清单；工作台、服务管理、预约订单、报价确认、完成服务、评价售后等 P0 页面为独立闭环页面，其余参考页统一接入 `YlRoleReferencePage`，动作接入商户 dashboard、服务创建、预约确认、报价、完成、异常、评价、消息已读和操作记录接口。

后续继续按参考图逐页精修视觉，还原每页图标、图片、字号、间距和状态栏/底栏细节。

## 构建目标

```bash
cd uniapp
npm run dev:mp-weixin
npm run build:mp-weixin
npm run build:app
```

`uniapp/.env.example` 提供后端 API 域名配置：

```bash
VITE_API_BASE_URL=https://api.example.com
```

## 自动验收

根目录执行：

```bash
npm run test:uniapp
npm run check
```

专项脚本 `scripts/uniapp-formal-engineering-test.js` 会检查：

- 微信小程序和 App 构建脚本存在。
- 正式移动工程没有非需求书端构建目标。
- `manifest.json` 含小程序/App 配置和定位权限。
- 登录、角色切换、用户端 01-40、向导端 01-46、商户端 01-70 页面均存在。
- API client 覆盖认证、用户、活动、SOS、订单、消息、向导任务、商户服务/订单/评价接口。

## 后续补全顺序

1. 用户端 01-40 继续逐页按参考图做高保真视觉校准。
2. 向导端 01-46 继续逐页按参考图做高保真视觉校准。
3. 商户端 01-70 继续逐页按参考图做高保真视觉校准。
4. 补齐页面级截图验收、真机权限、微信分享、地图导航、电话拨号、相机/上传等平台能力验收。
