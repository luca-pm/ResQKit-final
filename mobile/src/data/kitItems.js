export const KIT_ITEMS = [
  { code: "sterile_gauze", ro: "Comprese sterile", en: "Sterile gauze", icon: "bandage" },
  { code: "clean_cloth", ro: "Material textil curat", en: "Clean cloth", icon: "texture-box" },
  { code: "tourniquet", ro: "Garou", en: "Tourniquet", icon: "minus-box-outline" },
  { code: "burn_dressing", ro: "Pansament curat pentru arsură", en: "Clean burn dressing", icon: "bandage" },
  { code: "thermal_blanket", ro: "Folie / pătură de supraviețuire", en: "Emergency blanket", icon: "weather-sunny" },
  { code: "gloves", ro: "Mănuși", en: "Gloves", icon: "hand-back-left-outline" },
  { code: "cpr_shield", ro: "Barieră pentru ventilație", en: "CPR breathing barrier", icon: "shield-outline" },
  { code: "aed", ro: "Defibrilator AED în apropiere", en: "Nearby AED", icon: "heart-flash" },
];

export function getKitItemLabel(code, language = "ro") {
  const item = KIT_ITEMS.find((entry) => entry.code === code);
  if (!item) return code;
  return String(language).toLowerCase().startsWith("en") ? item.en : item.ro;
}

const AVAILABILITY_BY_NODE = {
  "hem-1": {
    useful: ["sterile_gauze", "clean_cloth", "gloves"],
    fallback: {
      ro: "Dacă nu ai compresă, documentul permite folosirea unei cârpe curate pentru presiune directă.",
      en: "If gauze is unavailable, the project protocol allows a clean cloth for direct pressure.",
    },
  },
  "hem-3": {
    useful: ["tourniquet", "gloves"],
    fallback: {
      ro: "Dacă nu ai garou, continuă presiunea directă și urmează instrucțiunile dispeceratului 112. Nu improviza un dispozitiv pe care protocolul nu îl descrie.",
      en: "If no tourniquet is available, continue direct pressure and follow the 112 dispatcher's instructions. Do not improvise a device that is not described by the protocol.",
    },
  },
  "hem-4": {
    useful: ["sterile_gauze", "clean_cloth", "gloves"],
    fallback: {
      ro: "Dacă nu ai pansament, folosește cel mai curat material disponibil fără a repune organele în plagă.",
      en: "If no dressing is available, use the cleanest available material without returning exposed organs into the wound.",
    },
  },
  "burn-3": {
    useful: ["burn_dressing", "sterile_gauze", "clean_cloth", "thermal_blanket"],
    fallback: {
      ro: "Protocolul permite un pansament curat umezit sau o cârpă curată; pentru restul corpului folosește ce ai disponibil pentru a limita pierderea de căldură.",
      en: "The protocol allows a clean damp dressing or clean cloth; use available covering for the rest of the body to limit heat loss.",
    },
  },
};

export function getAvailabilityForNode(nodeId, selected = [], language = "ro") {
  const rule = AVAILABILITY_BY_NODE[nodeId];
  if (!rule) return null;
  const useful = rule.useful || [];
  const present = useful.filter((code) => selected.includes(code));
  const missing = useful.filter((code) => !selected.includes(code));
  return {
    present,
    missing,
    fallback: rule.fallback
      ? String(language).toLowerCase().startsWith("en")
        ? rule.fallback.en
        : rule.fallback.ro
      : null,
  };
}
