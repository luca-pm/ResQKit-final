export const TRIAGE_INJURIES = [
  { id: "bleeding", ro: "Sângerare abundentă", en: "Heavy bleeding" },
  { id: "choking", ro: "Sufocare / cale aeriană blocată", en: "Choking / airway blocked" },
  { id: "burn", ro: "Arsură", en: "Burn or scald" },
  { id: "fracture", ro: "Fractură suspectată", en: "Suspected fracture" },
  { id: "head_spine", ro: "Leziune cap / coloană", en: "Head or spine injury" },
  { id: "chest", ro: "Durere toracică / dificultăți de respirație", en: "Chest pain / breathing difficulty" },
  { id: "cold", ro: "Expunere la frig", en: "Cold exposure" },
  { id: "unknown", ro: "Nu sunt sigur", en: "Not sure" },
];

export function victimUrgencyRank(victim = {}) {
  if (victim.breathing === "no") return 0;
  if (victim.responsive === "no") return 1;
  if (
    victim.chokingFlag === "yes" ||
    victim.bleedingFlag === "yes" ||
    victim.injuries?.includes("bleeding") ||
    victim.injuries?.includes("choking")
  ) return 2;
  return 3;
}

export function rankVictims(victims = []) {
  return victims
    .map((victim, index) => ({ victim, index }))
    .sort((a, b) => victimUrgencyRank(a.victim) - victimUrgencyRank(b.victim) || a.index - b.index)
    .map(({ victim }) => victim);
}

export function urgencyLabel(rank, language = "ro") {
  const en = String(language).toLowerCase().startsWith("en");
  if (rank === 0) return en ? "Immediate" : "Imediat";
  if (rank === 1) return en ? "Very urgent" : "Foarte urgent";
  if (rank === 2) return en ? "Urgent" : "Urgent";
  return en ? "Assess" : "De evaluat";
}
