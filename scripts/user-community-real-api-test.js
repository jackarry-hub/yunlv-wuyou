const assert = require("node:assert/strict");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const cssPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "styles.css");
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

async function request(baseUrl, route, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  return { response, payload };
}

async function json(baseUrl, route, options = {}) {
  const { response, payload } = await request(baseUrl, route, options);
  if (!response.ok || !payload.success) throw new Error(`${route} failed: ${JSON.stringify(payload)}`);
  return payload.data;
}

async function main() {
  const source = fs.readFileSync(appPath, "utf8");
  const styles = fs.readFileSync(cssPath, "utf8");
  const shell = fs.readFileSync(indexPath, "utf8");
  const lastCssRule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = [...styles.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "g"))];
    return matches.at(-1)?.[1] || "";
  };

  assert.match(source, /"community": hydrateCommunityFromApi/, "社区页路由必须触发真实接口水合");
  assert.match(source, /async function hydrateCommunityFromApi/, "社区页必须保留独立真实接口水合函数");
  assert.match(source, /function scheduleCommunityHydration/, "社区页空状态必须主动调度真实接口，不能停留在 0 数据");
  assert.match(source, /if \(needsHydration\) scheduleCommunityHydration\(\);/, "社区页渲染必须在缺少接口状态时触发真实数据请求");
  assert.match(source, /userApi\(`\/api\/user\/community\$\{params\.toString\(\)/, "社区页必须调用 /api/user/community 并支持筛选参数");
  assert.match(source, /data-community-group-id="\$\{attr\(group\.id\)\}"/, "社群卡片必须携带真实社群 ID");
  assert.match(source, /data-community-post-id="\$\{attr\(post\.id\)\}"/, "动态卡片必须携带真实动态 ID");
  assert.match(source, /\/api\/user\/community\/groups\/\$\{encodeURIComponent\(groupId\)\}\/join/, "加入社群必须调用真实接口");
  assert.match(source, /\/api\/user\/community\/posts\/\$\{encodeURIComponent\(postId\)\}\/like/, "动态点赞必须调用真实接口");
  assert.match(source, /\/api\/user\/community\/posts\/\$\{encodeURIComponent\(postId\)\}\/comments/, "提交评论必须调用真实接口");
  assert.match(source, /userApi\("\/api\/user\/community\/posts"/, "发布动态必须调用真实接口");
  assert.match(source, /userApi\("\/api\/user\/community\/draft"/, "保存草稿必须调用真实接口");
  assert.match(source, /if \(await handleCommunityAction\(actionButton, actionName\)\) return;/, "社区页异步动作必须等待真实接口完成");
  assert.match(source, /async function directUserApiRequest/, "用户端 API 客户端缺失时必须有同源真实接口兜底请求器");
  assert.match(source, /XMLHttpRequest/, "用户端兜底 API 客户端必须支持 XHR，避免只依赖 fetch 或桥接脚本");
  assert.match(source, /const DEFAULT_REMOTE_API_BASE = "https:\/\/yunlv-wuyou-mvp\.onrender\.com"/, "用户端直接 API 客户端必须保留公网静态页远端接口地址");
  assert.match(source, /function userApi\(path, options = \{\}\) \{\s+return directUserApiRequest\(path, options, "elder"\);\s+\}/, "用户端页面数据请求必须绕过易卡住的桥接请求，直接走真实接口客户端");
  assert(shell.includes("app.js?v=user-transport-real-api-20260620"), "用户端 H5 入口必须刷新脚本版本，避免旧社区页缓存");
  assert.match(styles, /\.screen-community \.ref-community-post p\s*\{[^}]*max-width:\s*100%/s, "社区动态正文在手机端必须占满内容列，不能被图片挤到半宽");
  assert.match(styles, /\.screen-community \.ref-community-post-images\s*\{[^}]*position:\s*static[^}]*width:\s*100%/s, "社区动态图片必须在正文下方自适应排布，不能绝对定位到右侧造成裁切");
  assert.doesNotMatch(lastCssRule(".screen-community .ref-community-post > div"), /92px|grid-template-areas:\s*"text image"/, "社区动态最终覆盖不能恢复正文 + 固定图片列布局");
  assert.match(lastCssRule(".screen-community .ref-community-post-images"), /width:\s*100%\s*!important/, "社区动态最终图片规则必须占满内容列宽度");
  assert.doesNotMatch(lastCssRule(".screen-community .ref-community-post-images"), /width:\s*92px|repeat\(2/, "社区动态最终图片规则不能退回固定 92px 双列缩略图");

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-user-community-"));
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

    const page = await json(baseUrl, "/api/user/community", { token });
    assert.equal(page.sourceEndpoint, "/api/user/community");
    assert(Array.isArray(page.groups) && page.groups.length >= 4, "社区聚合接口必须返回热门社群");
    assert(Array.isArray(page.posts) && page.posts.length >= 3, "社区聚合接口必须返回最新动态");
    assert(page.groups.every((group) => group.id && group.title && group.joinEndpoint), "社群必须返回可操作 ID 与加入接口");
    assert(page.posts.every((post) => post.id && post.author && post.groupName && post.likeEndpoint && post.commentEndpoint), "动态必须返回可操作 ID 与互动接口");

    const interest = await json(baseUrl, `/api/user/community?filter=${encodeURIComponent("兴趣圈")}`, { token });
    assert(interest.groups.length + interest.posts.length >= 1, "兴趣圈筛选必须返回真实社群或动态");
    assert([...interest.groups, ...interest.posts].every((item) => (item.tags || []).includes("兴趣圈")), "社区筛选必须由接口标签结果驱动");

    const group = page.groups.find((item) => !item.joined) || page.groups[0];
    const joined = await json(baseUrl, `/api/user/community/groups/${encodeURIComponent(group.id)}/join`, {
      method: "POST",
      token,
      body: { source: "community-test" },
    });
    assert.equal(joined.group.id, group.id);
    assert.equal(joined.group.joined, true, "加入社群后接口必须返回已加入状态");

    const draft = await json(baseUrl, "/api/user/community/draft", {
      method: "POST",
      token,
      body: { groupId: group.id, content: "社区页真实接口草稿", publicVisible: true, syncFamily: false, allowComments: true },
    });
    assert.equal(draft.draft.content, "社区页真实接口草稿");

    const created = await json(baseUrl, "/api/user/community/posts", {
      method: "POST",
      token,
      body: { groupId: group.id, content: "社区页真实接口发布动态", imageAdded: true, publicVisible: true, syncFamily: true, allowComments: true },
    });
    assert.equal(created.post.content, "社区页真实接口发布动态");
    assert.equal(created.post.author, login.user.nickname);
    assert.equal(created.post.commentsCount, 0);
    assert.equal(created.post.liked, false);
    assert(created.page.posts.some((post) => post.id === created.post.id), "发布后的聚合页必须包含新动态");

    const liked = await json(baseUrl, `/api/user/community/posts/${encodeURIComponent(created.post.id)}/like`, {
      method: "POST",
      token,
      body: { liked: true },
    });
    assert.equal(liked.post.liked, true);
    assert.equal(liked.post.likesCount, created.post.likesCount + 1, "点赞必须持久化计数");

    const commented = await json(baseUrl, `/api/user/community/posts/${encodeURIComponent(created.post.id)}/comments`, {
      method: "POST",
      token,
      body: { content: "社区页真实接口评论" },
    });
    assert.equal(commented.comment.content, "社区页真实接口评论");
    assert.equal(commented.post.commentsCount, 1);

    const after = await json(baseUrl, "/api/user/community", { token });
    const persisted = after.posts.find((post) => post.id === created.post.id);
    assert(persisted, "新发布动态必须持久化到社区列表");
    assert.equal(persisted.liked, true);
    assert.equal(persisted.comments.length, 1);
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("user community real api ok");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
