import { currentHome, setRole } from "../store/app-store";
import { homeOfRole, normalizeRole } from "./roles";

export function navigate(url) {
  uni.navigateTo({ url });
}

export function redirect(url) {
  uni.redirectTo({ url });
}

export function goHome() {
  uni.reLaunch({ url: currentHome() });
}

export function switchRole(role) {
  const normalized = normalizeRole(role);
  setRole(normalized);
  uni.reLaunch({ url: homeOfRole(normalized) });
}

export function openRoleSelector() {
  uni.navigateTo({ url: "/pages/role/select" });
}

export function backOrHome() {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
    return;
  }
  goHome();
}

