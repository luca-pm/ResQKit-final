import { apiRequest } from "./apiClient";

export async function listRegisteredKits() {
  const data = await apiRequest("/api/v1/entities/registered_kits?sort=-updated_at&limit=100", { method: "GET" });
  return data?.items || data || [];
}

export async function createRegisteredKit(data) {
  return apiRequest("/api/v1/entities/registered_kits", { method: "POST", body: JSON.stringify(data) });
}

export async function updateRegisteredKit(id, data) {
  return apiRequest(`/api/v1/entities/registered_kits/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteRegisteredKit(id) {
  return apiRequest(`/api/v1/entities/registered_kits/${id}`, { method: "DELETE" });
}
