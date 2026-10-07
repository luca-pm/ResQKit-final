import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageService";
import { resolveServiceUrl } from "./devHost";

export const API_BASE_URL = resolveServiceUrl(process.env.EXPO_PUBLIC_API_BASE_URL, 8001);

export async function getAuthToken() {
  return AsyncStorage.getItem(STORAGE_KEYS.authToken);
}

export async function setAuthToken(token) {
  if (!token) return AsyncStorage.removeItem(STORAGE_KEYS.authToken);
  return AsyncStorage.setItem(STORAGE_KEYS.authToken, token);
}

export async function clearAuthToken() {
  return AsyncStorage.removeItem(STORAGE_KEYS.authToken);
}

export async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();
  const { auth = true, ...fetchOptions } = options;
  const headers = { ...(fetchOptions.headers || {}) };
  if (!(fetchOptions.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token && auth !== false) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...fetchOptions, headers });
  let data = null;
  const text = await response.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!response.ok) {
    const detail = typeof data === "object" && data?.detail ? data.detail : null;
    const error = new Error(detail || `Server error (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export function websocketUrl(path) {
  const base = API_BASE_URL.replace(/^http/i, "ws");
  return `${base}${path}`;
}

export async function backendHealth() {
  return apiRequest("/api/v1/resqkit/health", { method: "GET", auth: false });
}
