# 4.5 紧急求助需求

本工程已按 `4.5 紧急求助需求` 接入可演示、可验收的真实闭环：用户端点击一键 SOS 需要二次确认，触发后写入异常记录，并同步后台、家属、用户消息。

| 功能点 | 详细需求 | 优先级 | 验收标准 | 工程实现 |
| --- | --- | --- | --- | --- |
| 一键 SOS | 页面显著展示一键紧急求助按钮，点击后二次确认或长按触发。 | P0 | 触发后生成求助记录。 | `POST /api/alerts/sos`，用户端按钮二次确认后调用 |
| 通知链路 | 向紧急联系人、平台后台发送求助信息，包含姓名、位置、时间、电话。 | P0 | 后台和联系人均可看到求助记录。 | SOS 入库后生成后台、家属、用户站内消息，短信/电话/App Push 预留 |
| 位置上传 | 获取用户当前位置，显示地址与定位精度。 | P0 | 地图或地址显示正常。 | `GET /api/alerts/emergency-requirements` 返回地址、坐标和精度；SOS 携带位置快照 |
| 紧急联系人 | 可添加儿子、女儿、老伴等紧急联系人，支持拨打电话。 | P0 | 联系人可新增、编辑、删除。 | `GET/POST /api/family-contacts`、`PUT/DELETE /api/family-contacts/{id}`、`POST /api/family-contacts/{id}/call` |
| 快速求助 | 呼叫救护车、报警求助、联系医院、人工客服/人工向导。 | P1 | 按钮可拨号或生成对应求助任务。 | `POST /api/alerts/quick-help` 生成快速求助服务请求，返回拨号号码或向导任务 |
| 健康信息 | 展示血型、慢性病、过敏史、常用药物，供急救参考。 | P1 | 用户可编辑健康信息。 | 用户端急救健康表单写回 `PUT /api/elder/profile` |

## 接口

- `GET /api/alerts/emergency-requirements` / `GET /alerts/emergency-requirements`：返回 4.5 需求契约、联系人、定位、通知链路、健康信息、最近求助记录。
- `POST /api/alerts/sos` / `POST /alerts/sos`：生成 SOS 告警，写入位置、电话、联系人快照和健康快照，并同步消息。
- `POST /api/alerts/quick-help` / `POST /alerts/quick-help`：生成救护车、报警、医院、客服或人工向导快速求助任务。
- `GET/POST /api/family-contacts` / `GET/POST /family-contacts`：查询、新增紧急联系人。
- `PUT/DELETE /api/family-contacts/{id}` / `PUT/DELETE /family-contacts/{id}`：编辑、删除紧急联系人。
- `POST /api/family-contacts/{id}/call` / `POST /family-contacts/{id}/call`：生成紧急联系人拨打记录。

## 验收

```bash
npm run test:emergency-help
```

该脚本会启动临时服务，校验需求契约、SOS 入库、通知消息、联系人 CRUD、快速求助任务和健康信息编辑。
