const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js");
const indexPath = path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "index.html");

const source = fs.readFileSync(appPath, "utf8");
const shell = fs.readFileSync(indexPath, "utf8");

assert.match(source, /let policyActiveFilter = "全部";/, "政策指南页必须维护当前筛选状态");
assert.match(source, /const POLICY_FILTERS = \["全部", "医保报销", "老年优待", "居住服务", "交通出行", "安全提醒"\];/, "政策指南页必须集中定义筛选项");
assert.match(source, /event\.target\.closest\("\[data-policy-filter\]"\)/, "政策指南筛选按钮必须进入真实筛选处理逻辑");
assert.match(source, /policyActiveFilter = policyFilter\.dataset\.policyFilter \|\| "全部";/, "点击政策筛选必须更新当前筛选项");
assert.match(source, /recordUserInteraction\(`筛选政策：\$\{policyActiveFilter\}`/, "政策筛选必须记录真实筛选动作，而不是只触发通用选择反馈");
assert.match(source, /let visiblePolicies = policyActiveFilter === "全部"\s+\? policies\s+:\s+policies\.filter\(\(item\) => item\.tag === policyActiveFilter\);/, "政策列表必须按当前筛选项过滤");
assert.match(source, /data-policy-filter="\$\{attr\(filter\)\}"/, "政策筛选按钮必须携带 data-policy-filter");
assert.match(source, /aria-pressed="\$\{filter === policyActiveFilter \? "true" : "false"\}"/, "政策筛选按钮必须反映当前选中状态");
assert.match(source, /data-policy-filter-status/, "政策指南页必须展示筛选后的结果状态");
assert.match(source, /暂无\$\{apiText\(policyActiveFilter\)\}政策/, "无结果筛选必须显示空状态，不能保持旧列表");
assert.match(source, /let policySearchQuery = "";/, "政策指南页必须维护搜索关键词状态");
assert.match(source, /let policySearchComposing = false;/, "政策搜索必须维护中文输入法组合状态");
assert.match(source, /event\.target\.closest\("\[data-policy-search\]"\)/, "政策搜索框输入必须进入真实搜索处理逻辑");
assert.match(source, /document\.addEventListener\("compositionstart"[\s\S]*policySearchComposing = true;/, "政策搜索必须在中文输入法组合开始时暂停重渲染");
assert.match(source, /document\.addEventListener\("compositionend"[\s\S]*policySearchComposing = false;[\s\S]*filterPoliciesFromSearchInput\(policySearch\);/, "政策搜索必须在中文输入法组合结束后再执行筛选");
assert.match(source, /if \(\(event\.isComposing \|\| policySearchComposing\) && policySearch && currentId\(\) === "policies"\) return;/, "政策搜索 input 事件必须跳过中文输入法组合过程，避免输入框被重建");
assert.match(source, /policySearchQuery = policySearch\.value\.trim\(\);/, "政策搜索输入必须更新搜索关键词");
assert.match(source, /<input data-policy-search type="search" value="\$\{attr\(policySearchQuery\)\}" placeholder="搜索政策、医保、交通"/, "政策搜索框必须是可输入 search 控件，不能只是静态文案");
assert.match(source, /const keyword = policySearchQuery\.trim\(\);/, "政策列表渲染必须读取搜索关键词");
assert.match(source, /visiblePolicies = keyword\s+\? visiblePolicies\.filter\(\(item\) => policySearchMatch\(item, keyword\)\)\s+:\s+visiblePolicies;/, "政策列表必须按搜索关键词过滤");
assert.match(source, /function policySearchMatch\(item, keyword\)/, "政策搜索必须集中匹配标题、正文、标签、来源等字段");
assert.match(source, /暂无匹配“\$\{apiText\(keyword\)\}”的政策/, "政策搜索无结果必须显示明确空状态");
assert(shell.includes("user-policy-search-filter-20260621"), "用户端入口必须刷新 app.js 版本，避免政策搜索继续使用旧缓存");
assert(shell.includes("user-policy-search-ime-20260621"), "用户端入口必须刷新 app.js 版本，避免中文输入法修复继续使用旧缓存");

console.log("user policies filter ok");
