const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
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

const relationTables = {
  users: {
    collection: "users",
    columns: ["id", "phone", "nickname", "role", "avatar", "status", "payload"],
    values: (item) => [item.id, item.phone, item.nickname, item.role, item.avatar, item.status, item],
  },
  elder_profiles: {
    collection: "elderProfile",
    singleton: true,
    columns: ["id", "user_id", "name", "gender", "age", "city", "health_tags", "address", "payload"],
    values: (item) => [item.id, item.userId, item.name, item.gender, Number(item.age || 0), item.city, (item.healthTags || []).join(","), item.address, item],
  },
  family_contacts: {
    collection: "familyContacts",
    columns: ["id", "elder_id", "name", "relation", "phone", "is_default", "payload"],
    values: (item) => [item.id, item.elderId, item.name, item.relation, item.phone, item.isDefault ? 1 : 0, item],
  },
  guides: {
    collection: "guides",
    columns: ["id", "user_id", "real_name", "service_types", "area", "status", "online_status", "current_status", "rating", "payload"],
    values: (item) => [item.id, item.userId, item.realName, (item.serviceTypes || []).join(","), item.area, item.status, item.onlineStatus, item.currentStatus, Number(item.rating || 0), item],
  },
  merchants: {
    collection: "merchants",
    columns: ["id", "name", "type", "license", "contact", "phone", "address", "status", "rating", "payload"],
    values: (item) => [item.id, item.name, item.type, item.license, item.contact, item.phone, item.address, item.status, Number(item.rating || 0), item],
  },
  services: {
    collection: "services",
    columns: ["id", "provider_type", "provider_id", "title", "category", "price", "unit", "status", "payload"],
    values: (item) => [item.id, item.providerType, item.providerId, item.title, item.category, Number(item.price || 0), item.unit, item.status, item],
  },
  activities: {
    collection: "activities",
    columns: ["id", "title", "category", "time", "location", "quota", "joined", "status", "cover", "payload"],
    values: (item) => [item.id, item.title, item.category, item.time, item.location, Number(item.quota || 0), Number(item.joined || 0), item.status, item.cover, item],
  },
  devices: {
    collection: "devices",
    columns: ["id", "device_id", "type", "user_id", "battery", "online_status", "last_sync", "location", "payload"],
    values: (item) => [item.id, item.deviceId, item.type, item.userId, Number(item.battery || 0), item.onlineStatus, item.lastSync, item.location, item],
  },
  health_records: {
    collection: "healthRecords",
    columns: ["id", "elder_id", "metric_type", "label", "value", "unit", "status", "source", "recorded_at", "payload"],
    values: (item) => [item.id, item.elderId, item.metricType, item.label, item.value, item.unit, item.status, item.source, item.recordedAt, item],
  },
  orders: {
    collection: "orders",
    columns: ["id", "order_no", "user_id", "elder_name", "service_type", "provider_type", "provider_id", "assignee_name", "status", "amount", "time", "location", "source", "created_at", "payload"],
    values: (item) => [item.id, item.orderNo, item.userId, item.elderName, item.serviceType, item.providerType, item.providerId, item.assigneeName, item.status, Number(item.amount || 0), item.time, item.location, item.source, item.createdAt, item],
  },
  tasks: {
    collection: "tasks",
    columns: ["id", "task_no", "order_id", "assignee_type", "assignee_id", "assignee_name", "status", "dispatch_rule", "created_at", "payload"],
    values: (item) => [item.id, item.taskNo, item.orderId, item.assigneeType, item.assigneeId, item.assigneeName, item.status, item.dispatchRule, item.createdAt, item],
  },
  alerts: {
    collection: "alerts",
    columns: ["id", "elder_id", "elder_name", "type", "level", "location", "status", "description", "handled_by", "created_at", "payload"],
    values: (item) => [item.id, item.elderId, item.elderName, item.type, item.level, item.location, item.status, item.description, item.handledBy, item.createdAt, item],
  },
  messages: {
    collection: "messages",
    columns: ["id", "to_role", "title", "content", "read_status", "created_at", "payload"],
    values: (item) => [item.id, item.toRole, item.title, item.content, item.read ? 1 : 0, item.createdAt, item],
  },
  ai_chats: {
    collection: "aiHistory",
    columns: ["id", "user_id", "question", "answer", "intent", "created_at", "payload"],
    values: (item) => [item.id, item.userId, item.question, item.answer, item.intent, item.createdAt, item],
  },
  audit_logs: {
    collection: "auditLogs",
    columns: ["id", "actor", "action", "target", "result", "created_at", "payload"],
    values: (item) => [item.id, item.actor, item.action, item.target, item.result, item.createdAt, item],
  },
  reviews: {
    collection: "reviews",
    columns: ["id", "order_id", "order_no", "provider_type", "provider_id", "assignee_name", "rating", "content", "created_at", "payload"],
    values: (item) => [item.id, item.orderId, item.orderNo, item.providerType, item.providerId, item.assigneeName, Number(item.rating || 0), item.content, item.createdAt, item],
  },
  ui_actions: {
    collection: "uiActions",
    columns: ["id", "role", "route", "action", "created_at", "payload"],
    values: (item) => [item.id, item.role, item.route, item.action, item.createdAt, item],
  },
  activity_signups: {
    collection: "activitySignups",
    columns: ["id", "activity_id", "user_id", "elder_name", "gender", "age", "phone", "count", "status", "created_at", "payload"],
    values: (item) => [item.id, item.activityId, item.userId, item.elderName, item.gender, Number(item.age || 0), item.phone, Number(item.count || 1), item.status, item.createdAt, item],
  },
  service_requests: {
    collection: "serviceRequests",
    columns: ["id", "request_no", "role", "user_id", "elder_name", "route", "action", "type", "provider_type", "status", "priority", "description", "created_at", "handled_by", "payload"],
    values: (item) => [item.id, item.requestNo, item.role, item.userId, item.elderName, item.route, item.action, item.type, item.providerType, item.status, item.priority, item.description, item.createdAt, item.handledBy, item],
  },
};

function applySchemaDefaults(db) {
  if (Array.isArray(db.users)) {
    db.users.forEach((user) => {
      if (!user.avatar) user.avatar = defaultUserAvatars[user.role] || "/user/assets/avatar-user.jpg";
    });
  }
  return db;
}

function normalize(db) {
  collections.forEach((collection) => {
    if (!Array.isArray(db[collection])) db[collection] = [];
  });
  db.counters = db.counters || {};
  return applySchemaDefaults(db);
}

function migrationFiles(root) {
  const dir = path.join(root, "database", "migrations");
  return fs.readdirSync(dir)
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort()
    .map((file) => ({ version: file.replace(/\.sql$/, ""), file: path.join(dir, file) }));
}

function parsePayload(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "object") return value;
  return JSON.parse(String(value));
}

function createMysqlPoolDatabase(options) {
  const runtimeDir = options.runtimeDir;
  const seedFile = options.seedFile;
  const root = options.root || path.resolve(__dirname, "..", "..");
  const backupDir = path.join(runtimeDir, "backups");
  const config = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || "yunlv_wuyou",
    user: process.env.DB_USER || "yunlv",
    password: process.env.DB_PASSWORD || "",
    stateId: process.env.DB_STATE_ID || "main",
    connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  };
  const dbFile = `mysql://${config.host}:${config.port}/${config.database}`;
  const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    connectionLimit: config.connectionLimit,
    waitForConnections: true,
    charset: "utf8mb4",
    multipleStatements: true,
    namedPlaceholders: false,
    dateStrings: true,
  });
  let ensured = false;

  async function withConnection(handler) {
    const connection = await pool.getConnection();
    try {
      return await handler(connection);
    } finally {
      connection.release();
    }
  }

  async function migrate(connection) {
    for (const migration of migrationFiles(root)) {
      const [rows] = await connection.query("SELECT version FROM schema_migrations WHERE version = ?", [migration.version]);
      if (rows.length) continue;
      const sql = fs.readFileSync(migration.file, "utf8");
      await connection.query(sql);
      await connection.query("INSERT INTO schema_migrations (version) VALUES (?)", [migration.version]);
    }
  }

  async function ensure() {
    if (ensured) return;
    if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });
    await withConnection(async (connection) => {
      await connection.query("CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(64) PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
      await migrate(connection);
      const [rows] = await connection.query("SELECT COUNT(*) AS count FROM app_state WHERE id = ?", [config.stateId]);
      if (!Number(rows[0]?.count || 0)) {
        const seed = normalize(JSON.parse(fs.readFileSync(seedFile, "utf8")));
        await writeWithConnection(connection, seed);
      } else {
        const [existing] = await connection.query("SELECT COUNT(*) AS count FROM users");
        if (!Number(existing[0]?.count || 0)) {
          const db = await readWithConnection(connection, { hydrate: false });
          await syncRelationalTables(connection, db);
        }
      }
    });
    ensured = true;
  }

  async function readPayloadRows(connection, table) {
    const [rows] = await connection.query(`SELECT payload FROM ${table} ORDER BY updated_at DESC`);
    return rows.map((row) => parsePayload(row.payload)).filter(Boolean);
  }

  async function hydrateFromRelationalTables(connection, db) {
    for (const [table, definition] of Object.entries(relationTables)) {
      const rows = await readPayloadRows(connection, table);
      if (definition.singleton) {
        if (rows.length) db[definition.collection] = rows[0];
      } else {
        db[definition.collection] = rows;
      }
    }
    return normalize(db);
  }

  async function readWithConnection(connection, options = {}) {
    const [rows] = await connection.query("SELECT payload FROM app_state WHERE id = ?", [config.stateId]);
    if (!rows.length) {
      const seed = normalize(JSON.parse(fs.readFileSync(seedFile, "utf8")));
      await writeWithConnection(connection, seed);
      return seed;
    }
    const db = normalize(parsePayload(rows[0].payload));
    if (options.hydrate === false) return db;
    return hydrateFromRelationalTables(connection, db);
  }

  async function syncTable(connection, table, definition, rows) {
    await connection.query(`DELETE FROM ${table}`);
    if (!rows.length) return;
    const columns = definition.columns;
    const placeholders = `(${columns.map(() => "?").join(", ")})`;
    const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${rows.map(() => placeholders).join(", ")}`;
    const values = rows.flatMap((item) => definition.values(item).map((value, index) => {
      const column = columns[index];
      return column === "payload" ? JSON.stringify(value) : value ?? null;
    }));
    await connection.query(sql, values);
  }

  async function syncRelationalTables(connection, db) {
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    try {
      for (const [table, definition] of Object.entries(relationTables)) {
        const rows = definition.singleton
          ? (db[definition.collection] ? [db[definition.collection]] : [])
          : (db[definition.collection] || []);
        await syncTable(connection, table, definition, rows);
      }
    } finally {
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }

  async function writeWithConnection(connection, db) {
    const normalized = normalize(db);
    await connection.query(
      "INSERT INTO app_state (id, payload) VALUES (?, ?) ON DUPLICATE KEY UPDATE payload = VALUES(payload)",
      [config.stateId, JSON.stringify(normalized)],
    );
    await syncRelationalTables(connection, normalized);
  }

  async function read() {
    await ensure();
    return withConnection((connection) => readWithConnection(connection));
  }

  async function write(db) {
    await ensure();
    await withConnection(async (connection) => {
      await connection.beginTransaction();
      try {
        await writeWithConnection(connection, db);
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    });
  }

  async function transaction(mutator) {
    await ensure();
    return withConnection(async (connection) => {
      await connection.beginTransaction();
      try {
        const db = await readWithConnection(connection);
        const result = await mutator(db);
        await writeWithConnection(connection, db);
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    });
  }

  async function snapshot(label = "manual") {
    await ensure();
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const safeLabel = String(label).replace(/[^a-z0-9_-]/gi, "-").slice(0, 40) || "manual";
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const target = path.join(backupDir, `${stamp}-${safeLabel}.json`);
    fs.writeFileSync(target, JSON.stringify(await read(), null, 2));
    return target;
  }

  async function reset() {
    const seed = normalize(JSON.parse(fs.readFileSync(seedFile, "utf8")));
    await write(seed);
    return status();
  }

  async function status() {
    await ensure();
    const db = await read();
    const stats = Object.fromEntries(collections.map((collection) => [collection, db[collection].length]));
    const coreTableContract = validateCoreTables(db);
    const [updatedRows] = await pool.query("SELECT DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') AS updatedAt FROM app_state WHERE id = ?", [config.stateId]);
    const [tableRows] = await pool.query(
      `SELECT table_name AS tableName, table_rows AS rowCount
       FROM information_schema.tables
       WHERE table_schema = DATABASE()
         AND table_name IN (${Object.keys(relationTables).map(() => "?").join(", ")})
       ORDER BY table_name`,
      Object.keys(relationTables),
    );
    const [migrationRows] = await pool.query("SELECT version, DATE_FORMAT(applied_at, '%Y-%m-%dT%H:%i:%s.000Z') AS appliedAt FROM schema_migrations ORDER BY version");
    return {
      driver: "mysql-pool",
      mode: "mysql-production-connection-pool",
      schemaVersion: coreTableContract.version,
      runtimeDir,
      dbFile,
      seedFile,
      pool: { host: config.host, port: config.port, database: config.database, connectionLimit: config.connectionLimit },
      migrations: migrationRows,
      collections: stats,
      coreTables: coreTableContract.tables,
      schemaValid: coreTableContract.valid,
      missingFields: coreTableContract.missingFields,
      counters: db.counters,
      relationalTables: tableRows.map((row) => ({ table: row.tableName, rows: Number(row.rowCount || 0) })),
      updatedAt: updatedRows[0]?.updatedAt || null,
    };
  }

  return { dbFile, ensure, read, write, transaction, snapshot, reset, status, close: () => pool.end() };
}

module.exports = { createMysqlPoolDatabase };
