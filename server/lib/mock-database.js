const fs = require("fs");
const path = require("path");
const { validateCoreTables } = require("./database-schema");

const collections = [
  "users",
  "guides",
  "merchants",
  "services",
  "activities",
  "devices",
  "healthRecords",
  "orders",
  "tasks",
  "alerts",
  "messages",
  "aiHistory",
  "auditLogs",
  "reviews",
  "uiActions",
  "activitySignups",
  "serviceRequests",
];

const defaultUserAvatars = {
  elder: "/user/assets/avatar-user.jpg",
  family: "/user/assets/avatar-daughter.jpg",
  guide: "/guide/assets/guide-avatar-li.png",
  merchant: "/merchant/assets/brand-logo.png",
  admin: "/user/assets/home-logo-ref.png",
};

function base64(value) {
  return Buffer.from(String(value ?? ""), "utf8").toString("base64");
}

function sqlText(value) {
  if (value === null || value === undefined) return "NULL";
  return `CONVERT(FROM_BASE64('${base64(value)}') USING utf8mb4)`;
}

function sqlJson(value) {
  return `CONVERT(FROM_BASE64('${base64(JSON.stringify(value ?? null))}') USING utf8mb4)`;
}

function sqlNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : String(fallback);
}

function sqlBool(value) {
  return value ? "1" : "0";
}

function sqlDate(value) {
  return value ? sqlText(value) : "NULL";
}

function applySchemaDefaults(db) {
  if (Array.isArray(db.users)) {
    db.users.forEach((user) => {
      if (!user.avatar) user.avatar = defaultUserAvatars[user.role] || "/user/assets/avatar-user.jpg";
    });
  }
  return db;
}

function createJsonDatabase(options) {
  const runtimeDir = options.runtimeDir;
  const seedFile = options.seedFile;
  const dbFile = path.join(runtimeDir, "mock-db.json");
  const backupDir = path.join(runtimeDir, "backups");

  function ensure() {
    if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });
    if (!fs.existsSync(dbFile)) fs.copyFileSync(seedFile, dbFile);
  }

  function read() {
    ensure();
    const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    collections.forEach((collection) => {
      if (!Array.isArray(db[collection])) db[collection] = [];
    });
    db.counters = db.counters || {};
    return applySchemaDefaults(db);
  }

  function write(db) {
    ensure();
    const payload = JSON.stringify(db, null, 2);
    const tmpFile = `${dbFile}.${process.pid}.tmp`;
    fs.writeFileSync(tmpFile, payload);
    fs.renameSync(tmpFile, dbFile);
  }

  function transaction(mutator) {
    const db = read();
    const result = mutator(db);
    write(db);
    return result;
  }

  function snapshot(label = "manual") {
    ensure();
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const safeLabel = String(label).replace(/[^a-z0-9_-]/gi, "-").slice(0, 40) || "manual";
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const target = path.join(backupDir, `${stamp}-${safeLabel}.json`);
    fs.copyFileSync(dbFile, target);
    return target;
  }

  function reset() {
    ensure();
    fs.copyFileSync(seedFile, dbFile);
    return status();
  }

  function status() {
    const db = read();
    const stats = Object.fromEntries(collections.map((collection) => [collection, db[collection].length]));
    const coreTableContract = validateCoreTables(db);
    return {
      driver: "json-file",
      mode: "mock-production",
      schemaVersion: coreTableContract.version,
      runtimeDir,
      dbFile,
      seedFile,
      collections: stats,
      coreTables: coreTableContract.tables,
      schemaValid: coreTableContract.valid,
      missingFields: coreTableContract.missingFields,
      counters: db.counters,
      updatedAt: fs.statSync(dbFile).mtime.toISOString(),
    };
  }

  return { dbFile, ensure, read, write, transaction, snapshot, reset, status };
}


module.exports = { createJsonDatabase };
