import { apiRequest } from "./apiClient";

export async function listArchivedIncidents() {
  const data = await apiRequest("/api/v1/entities/incident_records?sort=-occurred_at&limit=100", { method: "GET" });
  return data?.items || data || [];
}

export async function getArchivedIncident(id) {
  return apiRequest(`/api/v1/entities/incident_records/${id}`, { method: "GET" });
}

export async function archiveIncident(incident, briefText = "", retentionChoice = "7d") {
  const active = incident.victims?.find((v) => v.id === incident.activeVictimId) || incident.victims?.[0];
  return apiRequest("/api/v1/entities/incident_records", {
    method: "POST",
    body: JSON.stringify({
      context_type: active?.situation || "other",
      occurred_at: incident.startedAt,
      location_summary: incident.locationNote || null,
      latitude: incident.latitude,
      longitude: incident.longitude,
      location_accuracy: incident.accuracy,
      victim_count: incident.victims?.length || 1,
      triage_summary: JSON.stringify((incident.victims || []).map((v) => ({ label: v.label, age: v.ageProfile, situation: v.situation, status: v.status }))),
      hazards: JSON.stringify(incident.hazards || []),
      kit_items: JSON.stringify(incident.kitItems || []),
      procedure_id: active?.protocolNodeId || null,
      interventions: JSON.stringify((incident.victims || []).flatMap((v) => v.completedSteps || [])),
      includes_health_data: Boolean(incident.includeHealthData),
      called_112: incident.called112 || "not_confirmed",
      brief_text: briefText || null,
      content_pack_version: incident.contentPackVersion || "2026.09-protocols",
      retention_choice: retentionChoice,
    }),
  });
}

export async function deleteArchivedIncident(id) {
  return apiRequest(`/api/v1/entities/incident_records/${id}`, { method: "DELETE" });
}
