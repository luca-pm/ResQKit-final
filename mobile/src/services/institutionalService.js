import { apiRequest, websocketUrl } from "./apiClient";

export async function createInstitutionalSession(contextType = null) {
  return apiRequest("/api/v1/incident_sessions", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ context_type: contextType }),
  });
}

export async function appendSessionEvent(sessionId, eventType, payload = {}) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}/events`, {
    method: "POST",
    auth: false,
    body: JSON.stringify({ event_type: eventType, payload }),
  });
}

export async function updateInstitutionalSession(sessionId, patch) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}`, {
    method: "PATCH",
    auth: false,
    body: JSON.stringify(patch),
  });
}

export async function terminateInstitutionalSession(sessionId) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}/terminate`, { method: "POST", auth: false });
}

export async function requestPvr(sessionId) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}/pvr/request`, { method: "POST", auth: false });
}

export async function buildNgProtocol(sessionId, incident) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}/ng_protocol/build`, {
    method: "POST",
    auth: false,
    body: JSON.stringify({
      latitude: incident.latitude ?? undefined,
      longitude: incident.longitude ?? undefined,
      accuracy_m: incident.accuracy ?? undefined,
    }),
  });
}

export async function buildEdxlSitrep(sessionId) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}/edxl_sitrep/build`, { method: "POST", auth: false });
}

export function testSessionStream(sessionId, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    let finished = false;
    const socket = new WebSocket(websocketUrl(`/api/v1/incident_sessions/${sessionId}/stream`));
    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      try { socket.close(); } catch {}
      reject(new Error("WebSocket timeout"));
    }, timeoutMs);
    socket.onopen = () => socket.send(JSON.stringify({ type: "ping" }));
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "pong") {
          socket.send(JSON.stringify({ type: "close" }));
          if (!finished) { finished = true; clearTimeout(timer); resolve(true); }
        }
      } catch {}
    };
    socket.onerror = () => {
      if (!finished) { finished = true; clearTimeout(timer); reject(new Error("WebSocket error")); }
    };
    socket.onclose = () => {
      if (!finished) { finished = true; clearTimeout(timer); resolve(true); }
    };
  });
}

export async function getSessionTranscript(sessionId) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}/transcript`, { method: "GET", auth: false });
}

export async function listPreCallQuestions() {
  return apiRequest("/api/v1/pre_call/questions", { method: "GET", auth: false });
}

export async function askPreCallQuestion(sessionId) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}/pre_call/ask`, { method: "POST", auth: false });
}

export async function respondPreCallQuestion(sessionId, questionId, answer = null, skipped = false) {
  return apiRequest(`/api/v1/incident_sessions/${sessionId}/pre_call/respond`, {
    method: "POST",
    auth: false,
    body: JSON.stringify({ question_id: questionId, answer, skipped }),
  });
}
