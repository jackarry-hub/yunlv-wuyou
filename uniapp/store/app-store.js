import { reactive } from "vue";
import { homeOfRole, messageRoleOf, normalizeRole, roleMap } from "../common/roles";

const ROLE_KEY = "yunlv.role";
const SESSION_KEY = "yunlv.session";

function readStorage(key, fallback = null) {
  try {
    const value = uni.getStorageSync(key);
    return value || fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    uni.setStorageSync(key, value);
  } catch (error) {
    // Runtime state still works if platform storage is temporarily unavailable.
  }
}

export const appState = reactive({
  role: "elder",
  session: null,
  profile: null,
  loading: false,
  lastError: "",
});

export function bootstrapStore() {
  appState.role = normalizeRole(readStorage(ROLE_KEY, "elder"));
  appState.session = readStorage(SESSION_KEY, null);
}

export function setRole(role) {
  appState.role = normalizeRole(role);
  writeStorage(ROLE_KEY, appState.role);
}

export function setSession(session) {
  appState.session = session || null;
  writeStorage(SESSION_KEY, appState.session);
}

export function clearSession() {
  appState.session = null;
  writeStorage(SESSION_KEY, "");
}

export function setProfile(profile) {
  appState.profile = profile || null;
}

export function setError(error) {
  appState.lastError = error?.message || String(error || "");
}

export function currentRoleDefinition() {
  return roleMap[normalizeRole(appState.role)];
}

export function currentMessageRole() {
  return messageRoleOf(appState.role);
}

export function currentHome() {
  return homeOfRole(appState.role);
}
