const crypto = require("crypto");

const rolePermissions = {
  elder: [
    "user:read",
    "user:write",
    "activity:read",
    "activity:join",
    "service:read",
    "order:read",
    "order:create",
    "order:cancel",
    "order:confirm",
    "ai:chat",
    "alert:create",
    "alert:read",
    "guide:read",
    "merchant:read",
    "health:read",
    "message:read",
    "message:write",
    "ui:action",
  ],
  family: ["user:read", "order:read", "alert:read", "guide:read", "merchant:read", "health:read", "message:read", "message:write", "ui:action"],
  guide: [
    "guide:read",
    "guide:write",
    "task:read",
    "task:write",
    "order:read",
    "order:confirm",
    "message:read",
    "message:write",
    "ui:action",
  ],
  merchant: [
    "merchant:read",
    "merchant:write",
    "merchant:service:write",
    "merchant:order:write",
    "order:read",
    "message:read",
    "message:write",
    "ui:action",
  ],
  admin: [
    "admin:read",
    "admin:write",
    "user:read",
    "user:write",
    "activity:read",
    "activity:join",
    "service:read",
    "order:read",
    "order:create",
    "order:cancel",
    "order:confirm",
    "task:read",
    "task:write",
    "alert:read",
    "alert:create",
    "alert:write",
    "health:read",
    "message:read",
    "message:write",
    "ai:chat",
    "guide:read",
    "guide:write",
    "merchant:read",
    "merchant:write",
    "merchant:service:write",
    "merchant:order:write",
    "system:read",
    "ui:action",
  ],
};

const roleLabels = {
  elder: "用户",
  family: "家属",
  guide: "人工向导",
  merchant: "商户",
  admin: "平台管理员",
};

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function parseBase64url(input) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload, secret) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verify(token, secret) {
  try {
    const parts = String(token || "").split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    if (signature.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const payload = JSON.parse(parseBase64url(body));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

function issueToken(user, secret) {
  const now = Math.floor(Date.now() / 1000);
  const permissions = rolePermissions[user.role] || [];
  return {
    token: sign(
      {
        sub: user.id,
        role: user.role,
        name: user.nickname,
        permissions,
        iat: now,
        exp: now + 60 * 60 * 8,
      },
      secret,
    ),
    permissions,
  };
}

function getBearerToken(req) {
  const value = req.headers.authorization || "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

function getAuth(req, secret) {
  const token = getBearerToken(req);
  if (!token) return null;
  return verify(token, secret);
}

function hasPermission(auth, permission) {
  if (!permission) return true;
  return Boolean(auth?.permissions?.includes(permission));
}

module.exports = {
  getAuth,
  hasPermission,
  issueToken,
  roleLabels,
  rolePermissions,
};
