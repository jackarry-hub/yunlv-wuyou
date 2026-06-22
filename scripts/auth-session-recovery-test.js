const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const bridge = fs.readFileSync(path.join(root, "apps", "shared", "business-bridge.js"), "utf8");
const sharedApi = fs.readFileSync(path.join(root, "apps", "shared", "api.js"), "utf8");

assert.match(bridge, /response\.status === 401/);
assert.match(bridge, /sessions\.delete\(normalizedRole\)/);
assert.match(bridge, /const refreshedSession = await ensureAuth\(normalizedRole\)/);
assert.match(bridge, /response = await fetch\(apiUrl\(path\), init\)/);
assert.match(bridge, /const authRequests = new Map\(\)/);
assert.match(bridge, /if \(inflight\) return inflight/);
assert.match(sharedApi, /response\.status === 401/);
assert.match(sharedApi, /await api\.login\(role\)/);

console.log("auth session recovery contract ok");
