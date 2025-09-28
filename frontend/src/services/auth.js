const ACCESS_KEY  = "ts_access";
const REFRESH_KEY = "ts_refresh";
const USER_KEY    = "ts_user";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export function setSession({ access, refresh, user }) {
  if (access)  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  if (user)    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccess()  { return localStorage.getItem(ACCESS_KEY)  || ""; }
export function getRefresh() { return localStorage.getItem(REFRESH_KEY) || ""; }
export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
  catch { return null; }
}
export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function decodeJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch { return null; }
}

export function isExpired(token, offsetSec = 30) {
  const p = decodeJwt(token);
  if (!p?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return p.exp - offsetSec <= now;
}
