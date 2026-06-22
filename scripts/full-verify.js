const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const python = process.env.PYTHON || "python3";
const outDir = path.join(root, "artifacts", "full-verify", "latest");

const steps = [
  {
    name: "existing-check",
    command: npm,
    args: ["run", "check"],
    purpose: "API、业务规则、UniApp 工程约束、路由审计、冒烟与验收闭环",
  },
  {
    name: "build-artifacts",
    command: npm,
    args: ["run", "test:build-artifacts"],
    purpose: "四端静态构建产物和统一预览入口完整性",
  },
  {
    name: "render-quality",
    command: npm,
    args: ["run", "test:render-quality"],
    purpose: "用户/向导/商户 App 级视口与后台 Web 视口渲染质量",
  },
  {
    name: "visual-screenshots",
    command: npm,
    args: ["run", "audit:visual"],
    purpose: "209 张参考图逐页截图巡检",
  },
  {
    name: "visual-reference-diff",
    command: python,
    args: ["scripts/visual-reference-diff.py"],
    purpose: "逐页生成参考图、当前图、增强差异图报告",
  },
];

function runStep(step) {
  const startedAt = Date.now();
  console.log(`\n[verify] ${step.name}: ${step.purpose}`);
  const result = spawnSync(step.command, step.args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
    env: process.env,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return {
    name: step.name,
    purpose: step.purpose,
    command: [step.command, ...step.args].join(" "),
    status: result.status,
    signal: result.signal,
    durationMs: Date.now() - startedAt,
    passed: result.status === 0,
  };
}

function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const results = [];
  for (const step of steps) {
    const result = runStep(step);
    results.push(result);
    fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
    if (!result.passed) {
      console.error(`\n[verify] failed at ${result.name}`);
      console.error(`report: ${path.join(outDir, "report.json")}`);
      process.exit(1);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    passed: true,
    results,
    artifacts: {
      fullVerify: path.relative(root, path.join(outDir, "report.json")),
      renderQuality: "artifacts/render-quality/latest/report.json",
      visualAudit: "artifacts/visual-audit/latest/report.html",
      visualDiff: "artifacts/visual-diff/latest/report.html",
      staticPreview: "dist-preview/index.html",
    },
  };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log("\n[verify] full verification ok");
  console.log(`report: ${path.join(outDir, "report.json")}`);
}

main();
