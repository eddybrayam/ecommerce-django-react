// src/services/api.js

import axios from "axios";
import { API_BASE, getAccess, getRefresh, setSession, isExpired, clearSession } from "./auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

// -------------------------
// Helpers de tokens
// -------------------------
export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
}
export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("me");
}
export function getAccessToken() {
  return localStorage.getItem("access") || "";
}

// -------------------------
// Helper fetch (para llamadas simples)
// -------------------------
async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.detail ||
      (typeof data === "object"
        ? Object.values(data).flat().join(" ")
        : "Error de servidor");
    throw new Error(msg);
  }
  return data;
}

// -------------------------
// Autenticación base
// -------------------------
export async function loginWithPassword(email, password) {
  // SimpleJWT por defecto espera username + password
  return request(`/api/token/`, {
    method: "POST",
    body: { username: email, password },
  });
}

// 🔹 Registro de cliente (flujo de tu compañero: devuelve tokens altiro)
export async function registerClient(payload) {
  // payload: { first_name, last_name, email, address, dni, phone, password, password2 }
  return request(`/api/accounts/register/client/`, { method: "POST", body: payload });
}

// 🔹 Registro con verificación de correo (tu flujo: usuario inactivo + email)
export async function registerWithEmail(payload) {
  // payload con: username, first_name, last_name, email, address, dni, phone, password, password2
  return request(`/api/accounts/register/`, { method: "POST", body: payload });
}

export async function loginWithGoogle(credential) {
  return request(`/api/accounts/oauth/google/`, {
    method: "POST",
    body: { credential },
  });
}

export async function getMe() {
  return request(`/api/accounts/me/`, { auth: true });
}

// -------------------------
// Axios (para manejo de refresh automático)
// -------------------------
export { BASE_URL };
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

let refreshingPromise = null;

async function refreshAccess() {
  const refresh = getRefresh();
  if (!refresh) throw new Error("No refresh token");
  const r = await api.post("/api/token/refresh/", { refresh });

  const { access } = r.data || {};
  if (!access) throw new Error("No access in refresh");
  setSession({ access, refresh });
  return access;
}

api.interceptors.request.use(async (config) => {
  let token = getAccess();

  // Si el access está vencido, refresca antes de enviar el request
  if (token && isExpired(token)) {
    refreshingPromise =
      refreshingPromise || refreshAccess().finally(() => {
        refreshingPromise = null;
      });
    token = await refreshingPromise;
  }

  if (token) config.headers.Authorization = `Bearer ${getAccess()}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { response, config } = error || {};
    if (response?.status === 401 && !config.__isRetry) {
      try {
        const newAccess = await (refreshingPromise || refreshAccess());
        config.headers.Authorization = `Bearer ${newAccess}`;
        config.__isRetry = true;
        return api.request(config);
      } catch (e) {
        clearSession();
        // opcional: window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// -------------------------
// 🔹 Funciones añadidas (verificación de correo)
// -------------------------

// Reenviar email de verificación
export async function resendVerification(email) {
  return request(`/api/accounts/resend-verification/`, {
    method: "POST",
    body: { email },
  });
}

// Verificar email con uid + token (link directo)
export async function verifyEmail(uidb64, token) {
  return request(`/api/accounts/verify-email/${uidb64}/${token}/`, {
    method: "GET",
  });
}

// Verificar email con query params (si usas ?uidb64=...&token=...)
export async function verifyEmailByQuery(uidb64, token) {
  return request(`/api/accounts/verify-email/?uidb64=${uidb64}&token=${token}`, {
    method: "GET",
  });
}
