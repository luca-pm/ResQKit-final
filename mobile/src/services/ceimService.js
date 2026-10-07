import { apiRequest } from "./apiClient";

const situationToInjury = (situation) => {
  if (situation === "bleeding") return "bleeding";
  if (situation === "choking") return "choking";
  if (situation === "burn") return "burn";
  if (situation === "trauma") return "trauma";
  return situation || null;
};

export function buildKnownFacts(incident) {
  const active = incident?.victims?.find((v) => v.id === incident.activeVictimId) || incident?.victims?.[0] || {};
  return {
    incident_type: active.situation || null,
    called_112: incident?.called112 || null,
    latitude: incident?.latitude ?? null,
    longitude: incident?.longitude ?? null,
    accuracy_m: incident?.accuracy ?? null,
    location_note: incident?.locationNote || null,
    victim_count: incident?.victims?.length || 1,
    // From the fixed triage buttons, never AI-sourced (zip CEIM rule).
    responsive: active.responsive || null,
    breathing: active.breathing || null,
    injury: situationToInjury(active.situation),
    age_band: active.ageProfile || null,
    trapped: null,
    hazards: incident?.hazards || [],
    kit_items: incident?.kitItems || [],
  };
}

export async function generateCEIM(incident) {
  const payload = {
    known_facts: buildKnownFacts(incident),
    interview_answers: (incident.interviewAnswers || []).map((item) => ({
      prompt_id: item.promptId,
      prompt_text: item.promptText,
      answer_text: item.answerText,
    })),
    content_pack_version: incident.contentPackVersion || "2026.09-protocols",
  };
  return apiRequest("/api/v1/resqkit/ceim/generate", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

const INTERVIEW_PROMPTS_RO = [
  { id: "scene_description", prompt: "În cuvintele tale, ce s-a întâmplat și ce vezi acum?" },
  { id: "victim_condition", prompt: "Descrie cum arată și cum se comportă victima acum, dincolo de opțiunile deja selectate." },
  { id: "hazards_observed", prompt: "Ce pericole observi în jur: trafic, foc, lichide, obiecte instabile, apă, mulțime?" },
  { id: "access_detail", prompt: "Este cineva blocat sau greu de atins? Ce împiedică accesul salvatorilor?" },
  { id: "anything_else", prompt: "Mai este ceva important pe care echipajul ar trebui să îl știe?" },
];

const INTERVIEW_PROMPTS_EN = [
  { id: "scene_description", prompt: "In your own words, what happened and what do you see now?" },
  { id: "victim_condition", prompt: "Describe how the person looks and behaves now, beyond the options already selected." },
  { id: "hazards_observed", prompt: "What hazards do you see nearby: traffic, fire, liquids, unstable objects, water, crowds?" },
  { id: "access_detail", prompt: "Is anyone trapped or difficult to reach? What is blocking access for rescuers?" },
  { id: "anything_else", prompt: "Is there anything else important the emergency crew should know?" },
];

export const INTERVIEW_PROMPTS = INTERVIEW_PROMPTS_RO;
export function getInterviewPrompts(language = "ro") {
  return String(language).toLowerCase().startsWith("en") ? INTERVIEW_PROMPTS_EN : INTERVIEW_PROMPTS_RO;
}
