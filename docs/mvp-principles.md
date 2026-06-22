# 1.3 两周 MVP 原则

本工程已按 `1.3 两周 MVP 原则` 建立首期交付边界。原则不是口头说明，而是接入了服务端接口、P2 预留能力、后台参考接口和自动化验收脚本。

## 原则清单

| 原则 | 首期处理方式 | 工程证据 |
| --- | --- | --- |
| 先完成可演示、可试运营、可验收的核心闭环，不追求首期全量商业化。 | P0/P1 核心闭环优先 | `/api/business-flow/overview`、`/api/admin/priority/status`、`npm run check`、`npm run acceptance` |
| 真实硬件、支付结算、医保/医院深度接口、复杂 AI 诊断等高依赖能力首期仅做接口预留或模拟。 | P2 接口预留或模拟 | `/api/integrations/status`、`/api/integrations/{id}/request` |
| 前端优先采用跨端技术栈，减少微信小程序、iOS、Android 三端重复开发。 | 跨端技术栈优先 | 正式交付采用 uni-app/Taro，输出微信小程序、iOS App、Android App，并承载人工向导/商户角色端。 |
| 管理后台优先满足运营、调度、异常处理和数据查看，复杂 BI 分析后续迭代。 | 后台运营与调度优先 | `/admin/`、`/api/admin/dashboard`、`/api/admin/dispatch/pending`、`/api/admin/alerts` |

## 高依赖能力边界

| 能力 | 首期方式 | 预留接口 | 后续替换边界 |
| --- | --- | --- | --- |
| 真实硬件 | 接口预留/设备数据模拟 | `/api/integrations/hardware/request` | 真实手环、机器人协议和设备云后续替换接入。 |
| 支付结算 | 接口预留/金额与结算数据模拟 | `/api/integrations/payment/request` | 真实支付、退款、结算和对账后续接支付服务商。 |
| 医保/医院深度接口 | 接口预留/服务预约与就医陪同模拟 | `/api/integrations/medical-hospital/request` | 医保、医院 HIS/预约/挂号接口后续按合规要求接入。 |
| 复杂 AI 诊断 | 接口预留/健康科普与服务推荐模拟 | `/api/integrations/ai-diagnosis/request` | 首期不提供医疗诊断结论；后续仅在具备资质、审核和免责声明后接入辅助能力。 |

## 工程位置

- 原则契约：`server/lib/mvp-principles.js`
- 查询接口：`GET /api/mvp/principles`
- 图示裸路径：`GET /mvp/principles`
- P2 预留接口：`GET /api/integrations/status`
- 总参考接口：`GET /api/reference`
- 自动验收脚本：`npm run test:mvp-principles`

## 验收标准

- 四条原则文本必须与第 1.3 节图示一致。
- 核心闭环必须具备订单、任务、异常、消息等运行数据。
- 真实硬件、支付结算、医保/医院深度接口、复杂 AI 诊断必须只处于接口预留或模拟状态。
- 三端移动入口必须复用共享 API 能力，后续可迁移跨端技术栈。
- 后台必须覆盖运营、调度、异常处理和数据查看，不把复杂 BI 作为首期阻塞项。
