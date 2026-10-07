// Port of the zip's lib/institutionalActions.ts. Every call is simulated
// (nothing leaves the phone) unless settings.realDataMode is on, and every
// call is written to the Institutional actions trace either way.
import {
  appendSessionEvent,
  createInstitutionalSession,
  requestPvr,
  testSessionStream,
  updateInstitutionalSession,
} from "./institutionalService";

const fakeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

async function safely(action, log, fn) {
  try {
    const { detail, result } = await fn();
    log({ action, mode: "real", detail, ok: true });
    return result;
  } catch (error) {
    log({ action, mode: "real", detail: error?.message || String(error), ok: false });
    return null;
  }
}

// onSession(id, joinCode) stores the session on the incident.
export async function ensureSession(incident, realDataMode, log, onSession) {
  const cached = incident?.backendSessionId;
  // A simulated id must never be reused against real endpoints.
  if (cached && !(realDataMode && cached.startsWith("sim-"))) return cached;

  if (!realDataMode) {
    const id = fakeId("sim-session");
    log({ action: "session.create", mode: "simulated", detail: `Simulated session ${id} (no data sent)`, ok: true });
    // No join code when simulated: no dashboard could ever pair with it.
    onSession(id, null);
    return id;
  }

  return safely("session.create", log, async () => {
    const session = await createInstitutionalSession(incident?.context || null);
    onSession(session.id, session.join_code || null);
    return { detail: `Created backend session ${session.id} (join code ${session.join_code})`, result: session.id };
  });
}

export async function connectNg112(incident, realDataMode, status, log, onSession) {
  const sessionId = await ensureSession(incident, realDataMode, log, onSession);
  if (!sessionId) return;
  if (!realDataMode) {
    log({ action: "ng112.connect", mode: "simulated", detail: `Simulated NG112 connection (${status}), no real emergency channel contacted`, ok: true });
    return;
  }
  await safely("ng112.connect", log, async () => {
    await updateInstitutionalSession(sessionId, { called_112: status });
    return { detail: `Backend session ${sessionId} marked called_112=${status}`, result: true };
  });
}

async function logEvent(incident, realDataMode, log, onSession, action, eventType, payload, summary) {
  const sessionId = await ensureSession(incident, realDataMode, log, onSession);
  if (!sessionId) return;
  if (!realDataMode) {
    log({ action, mode: "simulated", detail: `Simulated log of ${summary}`, ok: true });
    return;
  }
  await safely(action, log, async () => {
    await appendSessionEvent(sessionId, eventType, payload);
    return { detail: `Logged ${summary} to backend session ${sessionId}`, result: true };
  });
}

export function logTriageAnswer(incident, realDataMode, field, value, log, onSession) {
  return logEvent(incident, realDataMode, log, onSession, "triage.answer", "triage_answer", { field, value }, `${field}=${value}`);
}

export function logKitSelection(incident, realDataMode, kitItems, kitSource, log, onSession) {
  const summary = `kit=[${kitItems.length ? kitItems.join(", ") : "none"}]`;
  return logEvent(incident, realDataMode, log, onSession, "kit.confirm", "kit_confirmed", { kit_items: kitItems, source: kitSource }, summary);
}

// Connectivity test only: no microphone is opened.
export async function testInstitutionalVoiceChannel(incident, realDataMode, log, onSession) {
  const sessionId = await ensureSession(incident, realDataMode, log, onSession);
  if (!sessionId) return;

  if (!realDataMode) {
    log({ action: "pvr.request", mode: "simulated", detail: "Simulated PVR request, no audio captured", ok: true });
    log({ action: "stream.connect", mode: "simulated", detail: "Simulated websocket connect (no socket opened)", ok: true });
    await new Promise((resolve) => setTimeout(resolve, 250));
    log({ action: "stream.terminate", mode: "simulated", detail: "Simulated websocket terminated (reason: client_close)", ok: true });
    return;
  }

  await safely("pvr.request", log, async () => {
    await requestPvr(sessionId);
    return { detail: `Requested PVR on backend session ${sessionId}`, result: true };
  });
  await safely("stream.connect", log, async () => {
    await testSessionStream(sessionId);
    return { detail: `Websocket ping/pong round-trip on session ${sessionId}`, result: true };
  });
}
