import * as ro from "./protocolData.ro";
import * as en from "./protocolData.en";
import { normalizeLanguage } from "../../hooks/useLocale";

function bundle(language) {
  return normalizeLanguage(language) === "en" ? en : ro;
}

export function getAgeProfiles(language) {
  return bundle(language).AGE_PROFILES;
}

export function getSituations(language) {
  return bundle(language).SITUATIONS;
}

export function getProtocolNode(nodeId, language) {
  return bundle(language).PROTOCOLS[nodeId];
}

export function getDynamicProtocolText(nodeId, ageProfile, language) {
  return bundle(language).getDynamicProtocolText(nodeId, ageProfile);
}

export function getSvbStart(ageProfile) {
  return ro.getSvbStart(ageProfile);
}

export function getSituationStart(situation, ageProfile) {
  return ro.getSituationStart(situation, ageProfile);
}

// CPR fast path: the "not breathing" node of each age's protocol, so children
// and infants still get their 5 initial rescue breaths before compressions.
export function getCprStart(ageProfile) {
  if (ageProfile === "infant") return "infant-6b";
  if (ageProfile === "child") return "child-6b";
  return "adult-6b";
}

// Picks the situation from triage answers, like the zip's routeProcedure().
// Returns null when triage doesn't settle it, so the user chooses manually
// (e.g. electric shock, or drowning vs. plain SVB at sea).
export function routeSituation(victim = {}, context = "other") {
  const injuries = victim.injuries || [];
  if (victim.breathing === "no" || victim.responsive === "no") {
    return context === "maritime" ? null : "svb";
  }
  if (injuries.includes("choking") || victim.chokingFlag === "yes") return "choking";
  if (injuries.includes("bleeding") || victim.bleedingFlag === "yes") return "bleeding";
  if (injuries.includes("burn")) return "burn";
  if (injuries.includes("fracture") || injuries.includes("head_spine")) return "trauma";
  return null;
}
