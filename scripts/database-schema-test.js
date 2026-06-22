const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { coreTableSchemas, schemaForApi, validateCoreTables } = require("../server/lib/database-schema");
const { createJsonDatabase } = require("../server/lib/mock-database");

const root = path.resolve(__dirname, "..");
const seedFile = path.join(root, "data", "mock-db.json");
const schemaSqlFile = path.join(root, "database", "schema.sql");
const mysqlMigrationFile = path.join(root, "database", "migrations", "001_initial_mysql.sql");

const expectedTables = [
  "user",
  "elder_profile",
  "family_contact",
  "guide",
  "merchant",
  "service_item",
  "order",
  "task",
  "activity",
  "device",
  "health_record",
  "alert",
  "ai_chat",
];

function assertSqlContainsTable(sql, table) {
  const quoted = table === "user" || table === "order";
  const signature = quoted ? `CREATE TABLE IF NOT EXISTS "${table}"` : `CREATE TABLE IF NOT EXISTS ${table}`;
  assert(sql.includes(signature), `schema.sql should contain ${signature}`);
}

function main() {
  assert.deepEqual(
    coreTableSchemas.map((table) => table.table),
    expectedTables,
    "core table order should follow 10.1 data table recommendation",
  );

  const apiSchema = schemaForApi();
  assert.equal(apiSchema.length, expectedTables.length);
  apiSchema.forEach((table) => {
    assert(table.keyFields.length >= 5, `${table.table} should expose key fields`);
  });

  const seed = JSON.parse(fs.readFileSync(seedFile, "utf8"));
  const validation = validateCoreTables(seed);
  assert.equal(validation.valid, true, JSON.stringify(validation.missingFields, null, 2));
  validation.tables.forEach((table) => {
    assert(table.rowCount >= 1, `${table.table} should have seed rows for demo and acceptance`);
  });

  const sql = fs.readFileSync(schemaSqlFile, "utf8");
  expectedTables.forEach((table) => assertSqlContainsTable(sql, table));

  const mysqlMigration = fs.readFileSync(mysqlMigrationFile, "utf8");
  [
    "schema_migrations",
    "app_state",
    "users",
    "elder_profiles",
    "family_contacts",
    "guides",
    "merchants",
    "services",
    "activities",
    "devices",
    "health_records",
    "orders",
    "tasks",
    "alerts",
    "messages",
    "ai_chats",
    "audit_logs",
    "reviews",
    "ui_actions",
    "activity_signups",
    "service_requests",
  ].forEach((table) => {
    assert(mysqlMigration.includes(`CREATE TABLE IF NOT EXISTS ${table}`), `MySQL migration should contain ${table}`);
  });

  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "yunlv-db-schema-"));
  try {
    const database = createJsonDatabase({ runtimeDir, seedFile });
    database.ensure();
    const status = database.status();
    assert.equal(status.schemaValid, true);
    assert.equal(status.schemaVersion, "10.1-core-tables-v1");
    assert.equal(status.coreTables.length, expectedTables.length);
  } finally {
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  }

  console.log("database schema ok");
}

main();
