import AsyncStorage from "@react-native-async-storage/async-storage";
import { KIT_ITEMS } from "../data/kitItems";

export const STORAGE_KEYS = {
  authToken: "resqkit.auth.token",
  user: "resqkit.user.v2",
  vehicle: "resqkit.vehicle.v2",
  device: "resqkit.device.v2",
  consent: "resqkit.consent.v1",
  safetyProfile: "resqkit.profile.v1",
  settings: "resqkit.settings.v1",
  incident: "resqkit.incident.v2",
  retained: "resqkit.retained.v2",
  institutionalLog: "resqkit.institutional_log.v1",
  chatHistory: "resqkit.chat_history.v1",
};

export const DEFAULT_CONSENT = {
  disclaimerAcknowledged: false,
  disclaimerAt: null,
  healthDataConsent: false,
  healthDataConsentAt: null,
  noticeVersion: "2026.09",
};

export const DEFAULT_SAFETY_PROFILE = {
  displayName: "",
  bloodType: "",
  allergies: "",
  conditions: "",
  medications: "",
  implants: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  language: "Română",
};

export const DEFAULT_SETTINGS = {
  retention: "7d",
  realDataMode: false,
  uiLanguage: "ro",
  notifications: {
    // Persistate local; backend-ul colegului nu are serviciu push conectat.
    push: false,
    urgentAlerts: false,
    expiryReminders: false,
  },
};

export const RETENTION_MS = {
  session: 0,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export async function getJSON(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function setJSON(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeKey(key) {
  await AsyncStorage.removeItem(key);
}

export function newVictim(index = 0) {
  return {
    id: `victim-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    label: "",
    number: index + 1,
    ageProfile: "",
    situation: "",
    protocolNodeId: null,
    status: "pending",
    notes: "",
    responsive: "",
    breathing: "",
    chokingFlag: "",
    bleedingFlag: "",
    injuries: [],
    triageUpdatedAt: null,
    completedSteps: [],
  };
}

export function newIncident() {
  const victim = newVictim(0);
  return {
    id: `incident-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    called112: "not_confirmed",
    context: "other",
    latitude: null,
    longitude: null,
    accuracy: null,
    locationFixAt: null,
    locationNote: "",
    reporterName: "",
    reporterPhone: "",
    includeReporterData: false,
    handoffVictimId: null,
    hazards: [],
    kitItems: KIT_ITEMS.map((item) => item.code),
    kitSource: "default_full",
    kitReviewedAt: null,
    safetyAcknowledgedAt: null,
    backendSessionId: null,
    sessionCode: null,
    interviewAnswers: [],
    interviewIndex: 0,
    interviewDraft: "",
    ceimReport: null,
    ceimDegraded: false,
    victims: [victim],
    activeVictimId: victim.id,
    includeHealthData: false,
    contentPackVersion: "2026.09-protocols",
  };
}

export async function loadAppData() {
  const [consent, safetyProfile, settings, incident, retained, institutionalLog, chats] = await Promise.all([
    getJSON(STORAGE_KEYS.consent, DEFAULT_CONSENT),
    getJSON(STORAGE_KEYS.safetyProfile, DEFAULT_SAFETY_PROFILE),
    getJSON(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
    getJSON(STORAGE_KEYS.incident, null),
    sweepRetained(),
    getJSON(STORAGE_KEYS.institutionalLog, []),
    getJSON(STORAGE_KEYS.chatHistory, []),
  ]);
  return { consent, safetyProfile, settings, incident, retained, institutionalLog, chats };
}

export async function closeAndRetainIncident(incident, retention) {
  await removeKey(STORAGE_KEYS.incident);
  const ms = RETENTION_MS[retention] ?? RETENTION_MS["7d"];
  if (!incident || ms <= 0) return sweepRetained();
  const closedAt = new Date();
  const record = {
    id: incident.id,
    incident,
    closedAt: closedAt.toISOString(),
    expiresAt: new Date(closedAt.getTime() + ms).toISOString(),
    retention,
  };
  const current = await getJSON(STORAGE_KEYS.retained, []);
  const next = [record, ...current.filter((item) => item.id !== record.id)];
  await setJSON(STORAGE_KEYS.retained, next);
  return sweepRetained();
}

export async function sweepRetained() {
  const current = await getJSON(STORAGE_KEYS.retained, []);
  const now = Date.now();
  const live = current.filter((item) => new Date(item.expiresAt).getTime() > now);
  if (live.length !== current.length) await setJSON(STORAGE_KEYS.retained, live);
  return live;
}

export async function deleteRetainedIncident(id) {
  const current = await getJSON(STORAGE_KEYS.retained, []);
  const next = current.filter((item) => item.id !== id);
  await setJSON(STORAGE_KEYS.retained, next);
  return next;
}

export async function appendInstitutionalLog(entry) {
  const current = await getJSON(STORAGE_KEYS.institutionalLog, []);
  const next = [...current, entry].slice(-100);
  await setJSON(STORAGE_KEYS.institutionalLog, next);
  return next;
}

export async function appendChatConversation(conversation) {
  const current = await getJSON(STORAGE_KEYS.chatHistory, []);
  const next = [conversation, ...current.filter((item) => item.id !== conversation.id)].slice(0, 50);
  await setJSON(STORAGE_KEYS.chatHistory, next);
  return next;
}

export async function clearAllLocalAppData({ keepAuth = true } = {}) {
  const keys = Object.values(STORAGE_KEYS).filter((key) => keepAuth ? key !== STORAGE_KEYS.authToken : true);
  await AsyncStorage.multiRemove(keys);
}
