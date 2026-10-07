import { apiRequest } from "./apiClient";

function isEnglish(language) {
  return String(language || "ro").toLowerCase().startsWith("en");
}

const ageLabel = (age, language) => {
  const en = isEnglish(language);
  if (age === "infant") return en ? "newborn/infant under 1 year" : "nou-născut/sugar sub 1 an";
  if (age === "child") return en ? "child 1-8 years" : "copil 1-8 ani";
  if (age === "adult") return en ? "adult/over 8 years" : "adult/peste 8 ani";
  return en ? "age not specified" : "vârstă neprecizată";
};

const situationLabel = (situation, language) => {
  const en = isEnglish(language);
  const labels = en ? {
    svb: "unresponsive / abnormal breathing / unclear situation",
    choking: "airway obstruction",
    bleeding: "bleeding / wound",
    burn: "burn",
    electric: "electric shock",
    drowning: "drowning",
    trauma: "fall / crash / possible fracture",
  } : {
    svb: "nu răspunde / respirație anormală / situație neclară",
    choking: "obstrucție a căilor aeriene",
    bleeding: "hemoragie / rană",
    burn: "arsură",
    electric: "electrocutare",
    drowning: "înec",
    trauma: "cădere / accident / posibilă fractură",
  };
  return labels[situation] || situation || (en ? "situation not specified" : "situație neprecizată");
};

export function buildIncidentBrief(incident, profile = {}, includeHealth = false, language = "ro", options = {}) {
  const en = isEnglish(language);
  if (!incident) return en ? "There is no active session." : "Nu există o sesiune activă.";
  const locale = en ? "en-US" : "ro-RO";
  const selectedVictimId = options?.victimId || null;
  const includeReporter = options?.includeReporter !== false;
  const selectedVictims = selectedVictimId
    ? (incident.victims || []).filter((victim) => victim.id === selectedVictimId)
    : (incident.victims || []);
  const called112 = incident.called112 === "called"
    ? (en ? "call started/confirmed" : "apel inițiat/confirmat")
    : incident.called112 === "already_called"
      ? (en ? "already called by someone else" : "apelat deja de altcineva")
      : (en ? "not confirmed" : "neconfirmat");

  const lines = en ? [
    "RESQKIT — CREW HANDOFF SUMMARY",
    `Session started: ${new Date(incident.startedAt).toLocaleString(locale)}`,
    `112 call status: ${called112}`,
    `Incident context: ${incident.context || "not recorded"}`,
    includeReporter ? `Reporter: ${incident.reporterName || "not recorded"}${incident.reporterPhone ? ` · ${incident.reporterPhone}` : ""}` : "Reporter: not shared",
    "",
    "LOCATION",
    incident.latitude != null && incident.longitude != null
      ? `Coordinates: ${Number(incident.latitude).toFixed(5)}, ${Number(incident.longitude).toFixed(5)}${incident.accuracy ? ` (±${Math.round(incident.accuracy)} m)` : ""}`
      : "Coordinates: not recorded",
    `Landmark/description: ${incident.locationNote || "not recorded"}`,
    "",
    `PEOPLE: ${selectedVictimId ? selectedVictims.length : (incident.victims?.length || 1)}`,
  ] : [
    "RESQKIT — REZUMAT PENTRU ECHIPAJ",
    `Sesiune începută: ${new Date(incident.startedAt).toLocaleString(locale)}`,
    `Status apel 112: ${called112}`,
    `Context incident: ${incident.context || "neînregistrat"}`,
    includeReporter ? `Persoană care raportează: ${incident.reporterName || "neînregistrată"}${incident.reporterPhone ? ` · ${incident.reporterPhone}` : ""}` : "Persoană care raportează: nepartajată",
    "",
    "LOCAȚIE",
    incident.latitude != null && incident.longitude != null
      ? `Coordonate: ${Number(incident.latitude).toFixed(5)}, ${Number(incident.longitude).toFixed(5)}${incident.accuracy ? ` (±${Math.round(incident.accuracy)} m)` : ""}`
      : "Coordonate: neînregistrate",
    `Reper/descriere: ${incident.locationNote || "neînregistrat"}`,
    "",
    `VICTIME: ${selectedVictimId ? selectedVictims.length : (incident.victims?.length || 1)}`,
  ];

  selectedVictims.forEach((victim, index) => {
    const defaultLabel = en ? `Person ${index + 1}` : `Victima ${index + 1}`;
    lines.push(`${index + 1}. ${victim.label || defaultLabel} — ${ageLabel(victim.ageProfile, language)} — ${situationLabel(victim.situation, language)}`);
    if (victim.completedSteps?.length) {
      lines.push(`${en ? "   Recorded steps" : "   Pași înregistrați"}: ${victim.completedSteps.map((s) => s.title).join("; ")}`);
    }
  });

  lines.push("", en ? "OBSERVED HAZARDS" : "PERICOLE OBSERVATE");
  lines.push(incident.hazards?.length ? incident.hazards.join(", ") : (en ? "no hazard selected" : "niciun pericol selectat"));
  lines.push("", en ? "RESQKIT MATERIALS" : "MATERIALE RESQKIT");
  lines.push(incident.kitItems?.length ? incident.kitItems.join(", ") : (en ? "not recorded" : "neînregistrate"));
  lines.push("", en ? "HEALTH DATA FROM PROFILE" : "DATE MEDICALE DIN PROFIL");

  if (!includeHealth) {
    lines.push(en ? "not shared" : "nu sunt partajate");
  } else {
    if (profile.bloodType) lines.push(`${en ? "Blood type" : "Grupă sanguină"}: ${profile.bloodType}`);
    if (profile.allergies) lines.push(`${en ? "Allergies" : "Alergii"}: ${profile.allergies}`);
    if (profile.conditions) lines.push(`${en ? "Conditions" : "Afecțiuni"}: ${profile.conditions}`);
    if (profile.medications) lines.push(`${en ? "Medications" : "Medicamente"}: ${profile.medications}`);
    if (profile.implants) lines.push(`${en ? "Implants/devices" : "Implanturi/dispozitive"}: ${profile.implants}`);
    if (!profile.bloodType && !profile.allergies && !profile.conditions && !profile.medications && !profile.implants) {
      lines.push(en ? "no health data completed" : "nu există date medicale completate");
    }
  }

  lines.push("", `Content pack: ${incident.contentPackVersion || "2026.09-protocols"}`);
  lines.push(en
    ? "ResQKit is an assistance tool; follow instructions from the 112 operator and medical personnel."
    : "ResQKit este un instrument de asistență; urmează indicațiile operatorului 112 și ale personalului medical.");
  return lines.join("\n");
}


export async function polishIncidentBrief(briefText) {
  const result = await apiRequest("/api/v1/resqkit/polish_brief", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ brief_text: briefText }),
  });
  return result?.spoken || result?.polished_brief || result?.brief || result?.text || result?.result || "";
}
