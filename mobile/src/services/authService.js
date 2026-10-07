import { apiRequest, clearAuthToken, setAuthToken } from "./apiClient";

export async function login(email, password) {
  const result = await apiRequest("/api/v1/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
  await setAuthToken(result.token);
  return getCurrentUser();
}

export async function register({ email, password, name }) {
  const result = await apiRequest("/api/v1/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password, name }),
  });
  await setAuthToken(result.token);
  return getCurrentUser();
}

export async function getCurrentUser() {
  return apiRequest("/api/v1/auth/me", { method: "GET" });
}

export async function logout() {
  try { await apiRequest("/api/v1/auth/logout", { method: "POST" }); } catch {}
  await clearAuthToken();
}
