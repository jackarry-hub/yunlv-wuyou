# 移动端可体验版本交付说明

本次交付已生成 uni-app 移动端体验构建产物，覆盖用户端、人工向导端、商户端。

## 构建产物

| 目标 | 产物目录 | 体验方式 |
| --- | --- | --- |
| 微信小程序 | `uniapp/dist/build/mp-weixin` | 使用微信开发者工具导入该目录，可在开发者工具和真机预览中体验 |
| iOS/Android App 资源 | `uniapp/dist/build/app` | 使用 HBuilderX 导入该目录运行或继续云打包 |

## 三端入口

移动端采用同一个 uni-app 工程，登录后通过角色进入对应端：

- 用户端：`pages/user/home`
- 人工向导端：`pages/guide/hall`
- 商户端：`pages/merchant/workbench`

也可以通过角色选择页进入：

- 登录页：`pages/auth/login`
- 角色切换：`pages/role/select`

## 后端地址配置

开发/体验环境通过 `VITE_API_BASE_URL` 配置后端地址。

参考文件：

```bash
uniapp/.env.example
```

当前示例：

```bash
VITE_API_BASE_URL=https://api.example.com
```

真机体验时需要改为可访问的 HTTPS API 地址。

## 本地重新构建

```bash
cd uniapp
npm install --cache ./.npm-cache
npm run build:mp-weixin
npm run build:app
```

构建脚本：

- `npm run build:mp-weixin`
- `npm run build:app`

## 重要边界

- `mp-weixin` 是微信开发者工具可导入的小程序体验目录，不是微信后台已上传审核版本。
- `app` 是 HBuilderX 可运行/可云打包资源，不是已签名的 `.apk` 或 `.ipa` 安装包。
- 生成正式 Android APK / iOS IPA 还需要：
  - Android 签名证书或 HBuilderX 云打包配置。
  - iOS Apple Developer 证书、描述文件和 Bundle ID。
  - 正式 HTTPS API 域名。
  - 微信小程序 AppID、合法域名配置和上传权限。
