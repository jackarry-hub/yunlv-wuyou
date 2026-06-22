const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const indexPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(baseUrl, output) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {}
    await delay(120);
  }
  throw new Error(`server did not start\n${output()}`);
}

async function json(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(appPath, "utf8");
  const shell = fs.readFileSync(indexPath, "utf8");

  assert.match(source, /"volunteer": hydrateVolunteerFromApi/, "志愿服务页必须接入真实接口水合");
  assert.match(source, /async function hydrateVolunteerFromApi/, "志愿服务页必须保留独立真实接口水合函数");
  assert.match(source, /userApi\("\/api\/user\/volunteer"\)/, "志愿服务页必须读取 /api/user/volunteer");
  assert.match(source, /data-volunteer-demand-id="\$\{attr\(demand\.id\)\}"/, "志愿需求卡片必须携带真实需求 ID");
  assert.match(source, /data-volunteer-team-id="\$\{attr\(team\.id\)\}"/, "志愿团队卡片必须携带真实团队 ID");
  assert.match(source, /\/api\/user\/volunteer\/help-requests/, "发布求助必须调用真实志愿求助接口");
  assert.match(source, /\/api\/user\/volunteer\/demands\/\$\{encodeURIComponent\(demandId\)\}\/respond/, "响应需求必须调用真实响应接口");
  assert.match(source, /\/api\/user\/volunteer\/teams\/\$\{encodeURIComponent\(teamId\)\}\/contact/, "联系志愿队必须调用真实联系接口");
  assert.match(source, /\/api\/user\/volunteer\/applications/, "成为志愿者必须调用真实申请接口");
  assert.match(source, /\/api\/user\/volunteer\/records/, "志愿服务记录必须来自真实记录接口");
  assert.match(source, /if \(await handleVolunteerAction\(actionButton, actionName\)\) return;/, "志愿服务动作必须等待真实接口完成");
  assert.match(source, /team\.contacted \? "已联系" : "联系"/, "已联系状态必须来自真实团队联系记录");
  assert.match(source, /data-volunteer-request-no="\$\{attr\(team\.requestNo \|\| ""\)\}"/, "志愿团队卡片必须携带真实联系工单号");
  assert.match(source, /\$\{team\.contacted \? "disabled" : ""\}/, "已联系团队必须禁用按钮，避免重复提交联系请求");
  assert.match(source, /const contactMessage = `已向\$\{apiText\(data\.team\?\.title \|\| name\)\}发送联系请求：\$\{apiText\(data\.request\?\.requestNo, "已生成"\)\}`;/, "联系成功反馈必须显示团队名称和真实工单号");
  assert(shell.includes("user-volunteer-real-api-20260620"), "用户端 H5 入口必须刷新志愿页脚本版本，避免旧页面缓存");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-volunteer-"));
  let logs = "";
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), YUNLV_RUNTIME_DIR: runtimeDir },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  child.stderr.on("data", (chunk) => { logs += chunk.toString(); });

  try {
    await waitForServer(baseUrl, () => logs);
    const login = await json(baseUrl, "/api/auth/login", { method: "POST", body: { role: "elder" } });
    const token = login.token;

    const page = await json(baseUrl, "/api/user/volunteer", { token });
    assert.equal(page.sourceEndpoint, "/api/user/volunteer");
    assert(Array.isArray(page.actions) && page.actions.length >= 4, "志愿服务接口必须返回首页动作");
    assert(Array.isArray(page.demands) && page.demands.length >= 4, "志愿服务接口必须返回服务需求");
    assert(Array.isArray(page.teams) && page.teams.length >= 2, "志愿服务接口必须返回志愿团队");
    assert(Array.isArray(page.records) && page.records.length >= 2, "志愿服务接口必须返回服务记录");
    assert(page.demands.every((demand) => demand.id && demand.title && demand.respondEndpoint && demand.contactEndpoint), "每个志愿需求必须有真实 ID 与操作接口");
    assert(page.teams.every((team) => team.id && team.title && team.contactEndpoint), "每个志愿团队必须有真实 ID 与联系接口");
    assert.equal(page.endpoints.helpRequest, "/api/user/volunteer/help-requests");
    assert.equal(page.endpoints.application, "/api/user/volunteer/applications");
    assert.equal(page.endpoints.records, "/api/user/volunteer/records");

    const help = await json(baseUrl, "/api/user/volunteer/help-requests", {
      method: "POST",
      token,
      body: {
        type: "陪同散步",
        place: "湖泉社区",
        time: "30分钟内可服务",
        phone: "13800005678",
        description: "希望志愿者陪同湖边慢走",
        priority: "P1",
        source: "volunteer-test",
      },
    });
    assert.equal(help.request.route, "volunteer");
    assert.equal(help.request.action, "发布志愿求助需求");
    assert(help.demand.id && help.page.demands.some((demand) => demand.id === help.demand.id), "发布求助后页面数据必须包含新需求");

    const application = await json(baseUrl, "/api/user/volunteer/applications", {
      method: "POST",
      token,
      body: { skills: ["陪伴服务"], availableTime: "周末上午", source: "volunteer-test" },
    });
    assert.equal(application.request.route, "volunteer");
    assert.equal(application.request.action, "成为志愿者");
    assert.equal(application.record.status, "待审核");

    const targetDemand = page.demands[0];
    const responded = await json(baseUrl, `/api/user/volunteer/demands/${encodeURIComponent(targetDemand.id)}/respond`, {
      method: "POST",
      token,
      body: { source: "volunteer-test" },
    });
    assert.equal(responded.demand.id, targetDemand.id);
    assert.equal(responded.demand.responded, true);
    assert.equal(responded.record.demandId, targetDemand.id);
    assert.equal(responded.action.route, "volunteer");

    const team = page.teams[0];
    const contact = await json(baseUrl, `/api/user/volunteer/teams/${encodeURIComponent(team.id)}/contact`, {
      method: "POST",
      token,
      body: { source: "volunteer-test" },
    });
    assert.equal(contact.request.route, "volunteer");
    assert.equal(contact.request.action, "联系志愿队");
    assert.equal(contact.request.payload.teamId, team.id);
    assert.equal(contact.team.contacted, true);
    assert.equal(contact.team.requestNo, contact.request.requestNo);
    assert(contact.page.teams.some((item) => item.id === team.id && item.contacted === true && item.requestNo === contact.request.requestNo), "联系志愿队后页面数据必须保留已联系状态和工单号");

    const records = await json(baseUrl, "/api/user/volunteer/records", { token });
    assert(records.records.some((record) => record.id === responded.record.id), "响应需求后服务记录必须包含响应记录");
    assert(records.records.some((record) => record.id === application.record.id), "志愿者申请后服务记录必须包含申请记录");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user volunteer real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
