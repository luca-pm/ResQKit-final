const ro = [
  { id: "gettingStarted", title: "Introducere", icon: "rocket-launch-outline", description: "Află cum este organizată aplicația ResQKit și care sunt funcțiile principale.", steps: ["Aplicația funcționează și fără cont; contul este opțional, pentru arhivare.", "Într-o urgență, sună întâi la 112 din pagina Acasă.", "Apasă „Pornește ghidarea” pentru triaj și protocoale pas cu pas.", "Completează din timp Profilul de siguranță și Kiturile mele.", "Folosește ResQKit AI pentru întrebări și suport suplimentar."] },
  { id: "home", title: "Pagina Acasă", icon: "home-outline", description: "Pagina Acasă pune pe primul loc apelul la 112 și intervenția ghidată.", steps: ["Apasă „Sună la 112” dacă cineva este rănit.", "Apasă „Pornește ghidarea” pentru a începe o intervenție.", "Dacă ai un incident activ, îl poți continua sau încheia de pe card.", "Folosește scurtăturile „Pregătește-te acum” pentru profil, kituri, reglementări și exersare.", "Folosește bara de căutare pentru a găsi rapid ghiduri."] },
  { id: "ai", title: "Asistent AI", icon: "robot-outline", description: "Asistentul AI ResQKit te ajută cu întrebări despre aplicație și îți poate oferi ghidare suplimentară.", steps: ["Deschide tab-ul ResQKit AI.", "Scrie întrebarea în câmpul de mesaj.", "Poți folosi sugestiile rapide disponibile.", "Citește cu atenție răspunsurile primite.", "În situații de urgență reală, contactează serviciile de urgență."] },
  { id: "settings", title: "Cont și setări", icon: "cog-outline", description: "Din tab-ul Cont te conectezi și ajungi la setările aplicației.", steps: ["Deschide tab-ul Cont.", "Conectează-te sau deschide Date personale pentru a-ți modifica numele.", "Deschide Setări pentru profil, consimțământ, kituri și limbă.", "Din Setări avansate poți activa modul cu date reale."] },
];

const en = [
  { id: "gettingStarted", title: "Getting started", icon: "rocket-launch-outline", description: "Learn how the ResQKit app is organized and what the main features are.", steps: ["The app works without an account; an account is optional, for archiving.", "In an emergency, call 112 first from Home.", "Tap ‘Start guided help’ for triage and step-by-step protocols.", "Fill in your Safety Profile and My Kits ahead of time.", "Use ResQKit AI for questions and additional support."] },
  { id: "home", title: "Home screen", icon: "home-outline", description: "Home puts calling 112 and guided help first.", steps: ["Tap ‘Call 112’ if someone is hurt.", "Tap ‘Start guided help’ to begin an intervention.", "If an incident is active, continue or end it from its card.", "Use the ‘Prepare now’ shortcuts for your profile, kits, regulations and practice.", "Use the search bar to find guides quickly."] },
  { id: "ai", title: "AI Assistant", icon: "robot-outline", description: "The ResQKit AI assistant helps with questions about the app and can provide additional guidance.", steps: ["Open the ResQKit AI tab.", "Type your question in the message field.", "You can use the available quick suggestions.", "Read the answers carefully.", "In a real emergency, contact emergency services."] },
  { id: "settings", title: "Account and settings", icon: "cog-outline", description: "From the Account tab you sign in and reach the app settings.", steps: ["Open the Account tab.", "Sign in, or open Personal info to change your name.", "Open Settings for your profile, consent, kits and language.", "Advanced settings lets you turn on Real data mode."] },
];

export const appTutorials = ro;
export function getAppTutorialById(id, language = "ro") {
  const list = String(language).toLowerCase().startsWith("en") ? en : ro;
  return list.find((tutorial) => tutorial.id === id);
}
