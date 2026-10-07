import { apiRequest } from "./apiClient";

export async function getProfile() {
  return apiRequest("/api/v1/users/profile", { method: "GET" });
}

export async function updateProfile(name) {
  return apiRequest("/api/v1/users/profile", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}
