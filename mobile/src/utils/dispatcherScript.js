// "What to say to 112" script (port of the zip's lib/brief.ts buildDispatcherScript).
// Built only from what the bystander entered; nothing here is sent anywhere.

const CONTEXT_PHRASES = {
  road: { ro: "pe un drum, accident rutier", en: "on a road, a traffic incident" },
  office: { ro: "într-o clădire", en: "inside a building" },
  maritime: { ro: "pe apă", en: "on the water" },
  mountain: { ro: "pe munte, într-o zonă izolată", en: "in the mountains, a remote area" },
};

export function formatCoords(incident, language = "ro") {
  const en = language === "en";
  if (incident?.latitude == null || incident?.longitude == null) {
    return en ? "No satellite fix captured" : "Nicio poziție GPS capturată";
  }
  const acc = incident.accuracy ? ` (±${Math.round(incident.accuracy)} m)` : "";
  return `${incident.latitude.toFixed(5)}, ${incident.longitude.toFixed(5)}${acc}`;
}

export function buildDispatcherScript(incident, language = "ro") {
  const en = language === "en";
  const victims = incident?.victims || [];
  const count = Math.max(victims.length, 1);
  const place = CONTEXT_PHRASES[incident?.context]?.[en ? "en" : "ro"];
  const lines = [];

  lines.push(en ? "Say to the 112 operator:" : "Spune operatorului 112:");
  lines.push("");
  lines.push(en
    ? `"I need an ambulance. The incident is ${place || "at my current position"}."`
    : `„Am nevoie de o ambulanță. Incidentul este ${place || "la poziția mea actuală"}.”`);
  if (incident?.latitude != null && incident?.longitude != null) {
    lines.push(en
      ? `"My coordinates are ${formatCoords(incident, language)}."`
      : `„Coordonatele mele sunt ${formatCoords(incident, language)}.”`);
  } else {
    lines.push(en ? '"I will describe my exact position now."' : "„Vă descriu acum poziția exactă.”");
  }
  if (incident?.locationNote) {
    lines.push(en ? `"Landmark: ${incident.locationNote}."` : `„Reper: ${incident.locationNote}.”`);
  }
  lines.push(en
    ? `"There ${count === 1 ? "is 1 injured person" : `are ${count} injured people`}."`
    : `„${count === 1 ? "Este 1 persoană rănită" : `Sunt ${count} persoane rănite`}.”`);
  if (victims.some((v) => v.breathing === "no")) {
    lines.push(en
      ? '"A person is NOT breathing." Say this first, it changes their response.'
      : "„O persoană NU respiră.” Spune asta primul, schimbă modul în care intervin.");
  }
  lines.push("");
  lines.push(en
    ? "Then stay on the line and follow the operator's instructions."
    : "Apoi rămâi pe linie și urmează instrucțiunile operatorului.");
  return lines.join("\n");
}
