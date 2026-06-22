const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const publicBaseUrl = process.env.PUBLIC_AUDIT_BASE_URL || "http://47.109.79.175";
const mode = process.env.PUBLIC_AUDIT_MODE || "both";
const batchSize = positiveInt(process.env.PUBLIC_AUDIT_PAGE_BATCH_SIZE, 5);
const batchFrom = positiveInt(process.env.PUBLIC_AUDIT_PAGE_BATCH_FROM, 1);
const batchTo = positiveInt(process.env.PUBLIC_AUDIT_PAGE_BATCH_TO, null);
const levelFrom = positiveInt(process.env.PUBLIC_AUDIT_LEVEL_FROM, 1);
const levelTo = positiveInt(process.env.PUBLIC_AUDIT_LEVEL_TO, 9);
const stopAfterEmptyLevel = process.env.PUBLIC_AUDIT_STOP_AFTER_EMPTY_LEVEL !== "0";
const outputRoot = path.join(root, "artifacts", "public-batched-audit", "latest");
const sourceDirs = {
  click: path.join(root, "artifacts", "deep-click", "latest"),
  render: path.join(root, "artifacts", "render-quality", "latest"),
};

const apps = [
  { key: "user", name: "用户端", expected: 40 },
  { key: "guide", name: "向导端", expected: 46 },
  { key: "merchant", name: "商户端", expected: 70 },
  { key: "admin", name: "管理后台", expected: 53 },
];

function positiveInt(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`Expected positive integer, got ${value}`);
  }
  return number;
}

function selectedModes() {
  if (mode === "both") return ["click", "render"];
  const modes = mode.split(",").map((item) => item.trim()).filter(Boolean);
  const invalid = modes.filter((item) => !["click", "render"].includes(item));
  if (invalid.length) throw new Error(`Unknown PUBLIC_AUDIT_MODE: ${invalid.join(",")}`);
  return modes;
}

function selectedApps() {
  const requested = process.env.PUBLIC_AUDIT_APP || "";
  if (!requested) return apps;
  const keys = requested.split(",").map((item) => item.trim()).filter(Boolean);
  const filtered = apps.filter((app) => keys.includes(app.key));
  if (!filtered.length) throw new Error(`Unknown PUBLIC_AUDIT_APP: ${requested}`);
  return filtered;
}

function batchesFor(app) {
  return Math.ceil(app.expected / batchSize);
}

function reportPath(kind) {
  return path.join(sourceDirs[kind], "report.json");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function resetOutput() {
  if (process.env.PUBLIC_AUDIT_RESUME === "1") return;
  fs.rmSync(outputRoot, { recursive: true, force: true });
}

function copyLatest(kind, app, level, batch) {
  const src = sourceDirs[kind];
  if (!fs.existsSync(src)) return;
  const dest = path.join(outputRoot, kind, app.key, `level-${level}`, `batch-${String(batch).padStart(2, "0")}`);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function batchSummary(kind, report) {
  if (kind === "click") {
    return {
      checked: report.totals?.checked || 0,
      discoveryClicks: report.totals?.discoveryClicks || 0,
      failures: report.totals?.failures || 0,
      records: report.totals?.states || 0,
    };
  }
  return {
    checked: report.total || 0,
    discoveryClicks: 0,
    failures: report.issueCount || 0,
    records: report.total || 0,
  };
}

function commandFor(kind, app, level, batch) {
  if (kind === "click") {
    return {
      script: "scripts/deep-click-audit.js",
      env: {
        DEEP_CLICK_BASE_URL: publicBaseUrl,
        DEEP_CLICK_APP: app.key,
        DEEP_CLICK_LEVEL: String(level),
        DEEP_CLICK_PAGE_BATCH_SIZE: String(batchSize),
        DEEP_CLICK_PAGE_BATCH_INDEX: String(batch),
        DEEP_CLICK_CONCURRENCY: process.env.DEEP_CLICK_CONCURRENCY || "2",
        DEEP_CLICK_NAV_ATTEMPTS: process.env.DEEP_CLICK_NAV_ATTEMPTS || "5",
        DEEP_CLICK_ITEM_ATTEMPTS: process.env.DEEP_CLICK_ITEM_ATTEMPTS || "2",
        DEEP_CLICK_NAV_TIMEOUT_MS: process.env.DEEP_CLICK_NAV_TIMEOUT_MS || "20000",
        DEEP_CLICK_RENDER_TIMEOUT_MS: process.env.DEEP_CLICK_RENDER_TIMEOUT_MS || "12000",
        DEEP_CLICK_BLOCK_ASSETS: process.env.DEEP_CLICK_BLOCK_ASSETS || "1",
      },
    };
  }
  return {
    script: "scripts/page-render-quality-test.js",
    env: {
      RENDER_QUALITY_BASE_URL: publicBaseUrl,
      RENDER_APP: app.key,
      RENDER_LEVEL: String(level),
      RENDER_PAGE_BATCH_SIZE: String(batchSize),
      RENDER_PAGE_BATCH_INDEX: String(batch),
      RENDER_NAV_TIMEOUT_MS: process.env.RENDER_NAV_TIMEOUT_MS || "30000",
      RENDER_CLICK_TIMEOUT_MS: process.env.RENDER_CLICK_TIMEOUT_MS || "7000",
      RENDER_AFTER_CLICK_MS: process.env.RENDER_AFTER_CLICK_MS || "220",
      RENDER_BLOCK_ASSETS: process.env.RENDER_BLOCK_ASSETS || "1",
    },
  };
}

function runNode(script, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script], {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: ["ignore", "inherit", "inherit"],
    });
    child.on("close", (code, signal) => resolve({ code, signal }));
  });
}

function writeAggregate(results) {
  fs.mkdirSync(outputRoot, { recursive: true });
  fs.writeFileSync(
    path.join(outputRoot, "summary.json"),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      baseUrl: publicBaseUrl,
      mode,
      batchSize,
      batchFrom,
      batchTo,
      levelFrom,
      levelTo,
      stopAfterEmptyLevel,
      results,
      totals: {
        batches: results.length,
        checked: results.reduce((sum, item) => sum + item.checked, 0),
        discoveryClicks: results.reduce((sum, item) => sum + item.discoveryClicks, 0),
        failures: results.reduce((sum, item) => sum + item.failures, 0),
      },
    }, null, 2),
  );
}

async function runKind(kind, app, results) {
  const totalBatches = batchesFor(app);
  const firstBatch = Math.max(1, batchFrom);
  const lastBatch = Math.min(batchTo || totalBatches, totalBatches);
  if (firstBatch > lastBatch) throw new Error(`No batches selected for ${app.key}: ${firstBatch}-${lastBatch}`);
  for (let level = levelFrom; level <= levelTo; level += 1) {
    let levelChecked = 0;
    let levelFailures = 0;
    for (let batch = firstBatch; batch <= lastBatch; batch += 1) {
      const label = `${kind} ${app.key} level=${level} batch=${batch}/${totalBatches}`;
      console.log(`\n[public-batched-audit] ${label}`);
      const command = commandFor(kind, app, level, batch);
      const result = await runNode(command.script, command.env);
      copyLatest(kind, app, level, batch);
      const report = fs.existsSync(reportPath(kind)) ? readJson(reportPath(kind)) : null;
      const summary = report ? batchSummary(kind, report) : { checked: 0, discoveryClicks: 0, failures: 1, records: 0 };
      const row = {
        kind,
        app: app.key,
        appName: app.name,
        level,
        batch,
        pagesInApp: app.expected,
        pageBatchSize: batchSize,
        code: result.code,
        signal: result.signal,
        ...summary,
      };
      results.push(row);
      writeAggregate(results);
      levelChecked += row.checked;
      levelFailures += row.failures;
      if (result.code !== 0 || row.failures > 0) {
        throw new Error(`${label} failed; saved report under ${outputRoot}`);
      }
    }
    console.log(`[public-batched-audit] ${kind} ${app.key} level=${level} checked=${levelChecked} failures=${levelFailures}`);
    if (stopAfterEmptyLevel && firstBatch === 1 && lastBatch === totalBatches && level > levelFrom && levelChecked === 0 && levelFailures === 0) {
      console.log(`[public-batched-audit] ${kind} ${app.key} stopped after empty level ${level}`);
      break;
    }
  }
}

async function main() {
  if (levelFrom > levelTo) throw new Error("PUBLIC_AUDIT_LEVEL_FROM must be <= PUBLIC_AUDIT_LEVEL_TO");
  resetOutput();
  const results = [];
  for (const kind of selectedModes()) {
    for (const app of selectedApps()) {
      await runKind(kind, app, results);
    }
  }
  writeAggregate(results);
  console.log(`\n[public-batched-audit] ok: ${path.join(outputRoot, "summary.json")}`);
}

main().catch((error) => {
  console.error(`\n[public-batched-audit] ${error.message}`);
  process.exitCode = 1;
});
