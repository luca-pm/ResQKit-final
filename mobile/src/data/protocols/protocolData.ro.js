export const AGE_PROFILES = [
  { id: "infant", label: "Nou-născut sau sugar (sub 1 an)", icon: "baby-face-outline" },
  { id: "child", label: "Copil (1-8 ani)", icon: "human-child" },
  { id: "adult", label: "Adult sau peste 8 ani", icon: "account" },
];

export const SITUATIONS = [
  { id: "svb", label: "Nu răspunde / nu respiră normal / nu știu ce are", icon: "heart-pulse" },
  { id: "choking", label: "Se sufocă, are ceva blocat pe gât", icon: "account-alert-outline" },
  { id: "bleeding", label: "Sângerează abundent / are o rană", icon: "water" },
  { id: "burn", label: "Arsură", icon: "fire" },
  { id: "electric", label: "Electrocutare", icon: "flash-alert-outline" },
  { id: "drowning", label: "Înec", icon: "waves" },
  { id: "trauma", label: "Cădere sau accident auto/moto, posibilă fractură", icon: "car-emergency" },
];

const finalAction = { label: "Continuă spre predarea informațiilor", kind: "handoff" };
const call112Action = { label: "Sună la 112", kind: "call112" };

const adult = {
  "adult-2": {
    title: "Victima reacționează?",
    text: "Scutur-o ușor de umăr. Întreabă cu voce tare: «Mă auziți? Deschideți ochii!»",
    actions: [
      { label: "DA, reacționează", next: "adult-3a" },
      { label: "NU reacționează", next: "adult-3b" },
    ],
  },
  "adult-3a": {
    title: "Nu o mișca din poziția găsită",
    text: "Las-o exact așa cum ai găsit-o. Nu o forța să se ridice. Verifică din nou zona pentru pericole. Încearcă să înțelegi de ce stă în poziția respectivă, poate indica o leziune.",
    actions: [call112Action, { label: "Starea s-a schimbat", next: "adult-2" }, finalAction],
  },
  "adult-3b": {
    title: "Strigă după ajutor",
    text: "Cere ajutor de la cei din jur. Așază victima pe spate, pe o suprafață dreaptă.",
    actions: [{ label: "Continuă", next: "adult-4" }],
  },
  "adult-4": {
    title: "Eliberează căile aeriene",
    text: "Pune o mână pe fruntea victimei și împinge ușor capul pe spate. Cu două degete de la cealaltă mână, ridică bărbia. Îndepărtează orice obiect vizibil din gură.",
    warning: "Dacă suspectezi traumă de coloană cervicală: nu face hiperextensia capului. Ridică doar mandibula, fără să miști gâtul.",
    actions: [{ label: "Am eliberat căile aeriene", next: "adult-5" }],
  },
  "adult-5": {
    title: "Victima respiră?",
    text: "Timp de maximum 10 secunde: privește dacă i se ridică pieptul, ascultă zgomotul respirației, simte aerul pe obrazul tău.",
    actions: [
      { label: "DA, respiră normal", next: "adult-6a" },
      { label: "NU respiră sau respiră anormal", next: "adult-6b" },
    ],
  },
  "adult-6a": {
    title: "Pune-o în poziția laterală de siguranță",
    text: "Urmează pașii video/animați pentru poziția laterală de siguranță. Capul în hiperextensie, gura ușor deschisă spre sol.",
    actions: [call112Action, { label: "Starea s-a schimbat", next: "adult-5" }, finalAction],
  },
  "adult-6b": {
    title: "Sună imediat la 112",
    text: "Spune dispeceratului locația ta, ce s-a întâmplat și câte persoane sunt rănite. Dacă poți, pune telefonul pe difuzor și continuă.",
    actions: [
      { label: "Sună la 112", kind: "call112" },
      { label: "Am sunat, începe resuscitarea", next: "adult-7" },
    ],
  },
  "adult-7": {
    title: "Resuscitare cardio-pulmonară",
    text: "Pune podul unei palme în jumătatea inferioară a sternului. Cealaltă mână deasupra. Coatele întinse. Apasă la 5-6 cm adâncime, ritm 100 pe minut. După fiecare 30 de compresii: 2 ventilații.",
    warning: "Dacă apare tuse, mișcare spontană, vărsătură sau victima deschide ochii, oprește-te și reevaluează.",
    cpr: { label: "30:2", bpm: 100 },
    actions: [{ label: "Continuă ciclul 30:2", next: "adult-7" }, { label: "Vezi când te oprești", next: "adult-8" }],
  },
  "adult-8": {
    title: "Continuă până când...",
    text: "Sosește ajutorul calificat și preia manevrele, SAU victima începe să respire normal, SAU tu, salvatorul, ești epuizat și nu mai poți continua.",
    actions: [
      { label: "Victima a revenit / respiră", next: "adult-6a" },
      { label: "Ajutorul a sosit", kind: "handoff" },
    ],
  },
};

const child = {
  "child-2": {
    title: "Copilul reacționează?",
    text: "Scutură-l ușor de umăr. Întreabă cu voce tare: «Mă auzi? Deschide ochii!»",
    actions: [{ label: "DA, reacționează", next: "child-3a" }, { label: "NU reacționează", next: "child-3b" }],
  },
  "child-3a": {
    title: "Lasă copilul în poziția găsită",
    text: "Nu-l mișca. Caută eventuale leziuni vizibile. Acordă primul ajutor pentru ce găsești.",
    actions: [call112Action, { label: "Starea s-a schimbat", next: "child-2" }, finalAction],
  },
  "child-3b": {
    title: "Strigă după ajutor",
    text: "Cere ajutor de la cei din jur. Așază copilul pe spate, pe o suprafață dreaptă.",
    actions: [{ label: "Continuă", next: "child-4" }],
  },
  "child-4": {
    title: "Eliberează căile aeriene",
    text: "Extinde ușor capul pe spate, aliniat cu trunchiul. Ridică bărbia cu două degete.",
    warning: "Dacă se suspectează traumă: nu extinde capul. Ridică doar mandibula, fără să miști gâtul.",
    actions: [{ label: "Am eliberat căile aeriene", next: "child-5" }],
  },
  "child-5": {
    title: "Copilul respiră?",
    text: "Timp de maximum 10 secunde: privește pieptul, ascultă respirația, simte aerul pe obrazul tău.",
    note: "O frecvență peste 60 respirații/minut este un semn de alarmă în documentul sursă.",
    actions: [{ label: "DA, respiră normal", next: "child-6a" }, { label: "NU respiră sau respiră anormal", next: "child-6b" }],
  },
  "child-6a": {
    title: "Pune-l în poziția laterală de siguranță",
    text: "Urmează pașii video/animați pentru poziția laterală de siguranță, identică cu cea de la adult.",
    actions: [call112Action, finalAction],
  },
  "child-6b": {
    title: "Fă 5 ventilații inițiale",
    text: "Pensează nasul, etanșează gura peste gura copilului, suflă 1-1,5 secunde, lasă pieptul să revină. Repetă de 5 ori. Verifică dacă apar semne de viață: mișcări, tuse, respirație.",
    actions: [{ label: "Nu sunt semne de viață, începe RCP", next: "child-7" }],
  },
  "child-7": {
    title: "Ești singur sau are cineva să te ajute?",
    text: "Alege situația corectă. Numărul de salvatori schimbă raportul compresii : ventilații și momentul apelării la 112.",
    actions: [
      { label: "Sunt singur", next: "child-7-single" },
      { label: "Suntem 2 salvatori", next: "child-7-two" },
    ],
  },
  "child-7-single": {
    title: "Resuscitare cardio-pulmonară — un salvator",
    text: "Fă 1 minut de resuscitare, apoi sună la 112. Raport 30 compresii : 2 ventilații. Compresiile se fac cu o singură mână, cu podul palmei în jumătatea inferioară a sternului. Adâncime 1/3 din diametrul toracelui. Ritm 100-120/minut.",
    warning: "Dacă apare tuse, mișcare spontană, vărsătură sau copilul deschide ochii, oprește-te și reevaluează.",
    cpr: { label: "30:2 · 100-120/min", bpm: 110 },
    actions: [
      { label: "Continuă ciclul 30:2", next: "child-7-single" },
      { label: "Am făcut 1 minut — sună la 112", kind: "call112" },
      { label: "Vezi când te oprești", next: "child-8" },
    ],
  },
  "child-7-two": {
    title: "Resuscitare cardio-pulmonară — doi salvatori",
    text: "Unul sună imediat la 112, celălalt începe resuscitarea. Raport 15 compresii : 2 ventilații. Compresiile se fac cu o singură mână, cu podul palmei în jumătatea inferioară a sternului. Adâncime 1/3 din diametrul toracelui. Ritm 100-120/minut.",
    warning: "Dacă apare tuse, mișcare spontană, vărsătură sau copilul deschide ochii, oprește-te și reevaluează.",
    cpr: { label: "15:2 · 100-120/min", bpm: 110 },
    actions: [
      { label: "Sună la 112", kind: "call112" },
      { label: "Continuă ciclul 15:2", next: "child-7-two" },
      { label: "Vezi când te oprești", next: "child-8" },
    ],
  },
  "child-8": {
    title: "Continuă până când...",
    text: "Sosește ajutorul calificat și preia manevrele, SAU copilul începe să respire normal, SAU tu, salvatorul, ești epuizat și nu mai poți continua.",
    actions: [{ label: "Copilul a revenit / respiră", next: "child-6a" }, { label: "Ajutorul a sosit", kind: "handoff" }],
  },
};

const infant = {
  "infant-2": {
    title: "Sugarul reacționează?",
    text: "Atinge-l ușor, cheamă-l pe nume. Observă dacă mișcă, plânge sau deschide ochii.",
    actions: [{ label: "DA, reacționează", next: "infant-3a" }, { label: "NU reacționează", next: "infant-3b" }],
  },
  "infant-3a": {
    title: "Ia sugarul în brațe",
    text: "Caută eventuale leziuni vizibile. Acordă primul ajutor pentru ce găsești.",
    actions: [call112Action, { label: "Starea s-a schimbat", next: "infant-2" }, finalAction],
  },
  "infant-3b": {
    title: "Strigă după ajutor",
    text: "Cere ajutor de la cei din jur. Așază sugarul pe spate, pe o suprafață dreaptă. Dacă ai la îndemână un prosop sau o pătură, pune-o sub cap și gât pentru aliniere.",
    actions: [{ label: "Continuă", next: "infant-4" }],
  },
  "infant-4": {
    title: "Eliberează căile aeriene, cu grijă",
    text: "Extinde ușor capul, fără să forțezi. Fața trebuie să rămână aliniată cu suprafața, nu împinsă mult pe spate. Ridică ușor bărbia.",
    warning: "Dacă se suspectează traumă: nu extinde capul deloc. Ridică doar mandibula, fără să miști gâtul.",
    actions: [{ label: "Am eliberat căile aeriene", next: "infant-5" }],
  },
  "infant-5": {
    title: "Sugarul respiră?",
    text: "Timp de maximum 10 secunde: privește pieptul, ascultă respirația, simte aerul pe obrazul tău.",
    note: "O frecvență peste 60 respirații/minut este un semn de alarmă în documentul sursă.",
    actions: [{ label: "DA, respiră normal", next: "infant-6a" }, { label: "NU respiră sau respiră anormal", next: "infant-6b" }],
  },
  "infant-6a": {
    title: "Pune-l în poziție laterală, cu sprijin",
    text: "Semidecubit lateral, cu sprijin pe o parte și capul în poziție neutră. Dacă situația permite, îl poți ține în brațe în această poziție.",
    actions: [call112Action, finalAction],
  },
  "infant-6b": {
    title: "Fă 5 ventilații inițiale",
    text: "Acoperă cu gura ta atât gura, cât și nasul sugarului, etanș. Suflă ușor, 1-1,5 secunde, doar cât să vezi pieptul ridicându-se. Repetă de 5 ori. Verifică dacă apar semne de viață.",
    actions: [{ label: "Nu sunt semne de viață, începe RCP", next: "infant-7" }],
  },
  "infant-7": {
    title: "Resuscitare cardio-pulmonară",
    text: "Dacă ești singur, fă 1 minut de resuscitare, apoi sună la 112. Dacă sunteți 2 salvatori, unul sună imediat cât celălalt începe resuscitarea. Raport 15 compresii : 2 ventilații. Folosește 2 degete în jumătatea inferioară a sternului. Adâncime 1/3 din diametrul toracelui. Ritm 100-120/minut. După fiecare 15 compresii: 2 ventilații gură la gură și nas.",
    warning: "Dacă apare tuse, mișcare spontană, vărsătură sau sugarul deschide ochii, oprește-te și reevaluează.",
    cpr: { label: "15:2", bpm: 110 },
    actions: [{ label: "Continuă ciclul", next: "infant-7" }, { label: "Vezi când te oprești", next: "infant-8" }],
  },
  "infant-8": {
    title: "Continuă până când...",
    text: "Sosește ajutorul calificat și preia manevrele, SAU sugarul începe să respire normal, SAU tu, salvatorul, ești epuizat și nu mai poți continua.",
    actions: [{ label: "Sugarul a revenit / respiră", next: "infant-6a" }, { label: "Ajutorul a sosit", kind: "handoff" }],
  },
};

const special = {
  "obs-1": {
    title: "Victima poate tuși sau vorbi?",
    text: "Evaluează dacă poate tuși eficient, vorbi sau scoate un sunet.",
    actions: [{ label: "DA, tușește și poate scoate un sunet", next: "obs-2" }, { label: "NU, nu poate vorbi, respira sau tuși", next: "obs-3" }],
  },
  "obs-2": {
    title: "Încurajeaz-o să tușească",
    text: "Nu îi lovi spatele și nu-i băga degetele în gură. Rămâi lângă ea și monitorizeaz-o; obstrucția se poate agrava în orice moment.",
    actions: [{ label: "S-a agravat", next: "obs-3" }, { label: "Ajutorul a sosit", kind: "handoff" }],
  },
  "obs-3": {
    title: "5 lovituri între omoplați",
    text: "Apleac-o ușor înainte, aplică 5 lovituri ferme între omoplați cu podul palmei. Verifică după fiecare dacă s-a eliberat calea aeriană.",
    actions: [{ label: "Nu s-a eliberat", next: "obs-4" }],
  },
  "obs-4": {
    title: "Continuă manevrele potrivite vârstei",
    dynamicText: true,
    actions: [{ label: "Repetă secvența", next: "obs-3" }, { label: "Victima a devenit inconștientă", kind: "svb" }],
  },
  "hem-1": {
    title: "Apasă direct pe rană",
    text: "Folosește o compresă curată sau o cârpă curată. Apasă ferm și continuu.",
    warning: "Dacă rana este la nivelul craniului, NU apăsa direct.",
    actions: [
      { label: "Nu se oprește", next: "hem-2" },
      { label: "S-a oprit — sună la 112", kind: "call112_handoff" },
      { label: "Organe ieșite prin rană", next: "hem-4" },
    ],
  },
  "hem-2": {
    title: "Ridică membrul afectat",
    text: "Menține presiunea și ridică membrul deasupra nivelului inimii, dacă nu suspectezi o fractură în zonă.",
    actions: [{ label: "Tot nu se oprește", next: "hem-3" }],
  },
  "hem-3": {
    title: "Garou doar dacă nimic altceva nu funcționează",
    text: "Aplică-l deasupra rănii, cât mai strâns cât să oprească sângerarea. Notează ora exactă pe un bilet vizibil pe victimă. Nu-l mai slăbi tu, lasă asta echipajului medical.",
    warning: "Acest pas este prezentat în documentul furnizat ca ultimă variantă. Urmează indicațiile dispeceratului 112.",
    actions: [call112Action, finalAction],
  },
  "hem-4": {
    title: "Organe ieșite prin rană? Nu le repune",
    text: "Acoperă cu un pansament umed. Îndoaie ușor genunchii victimei, ca să reduci tensiunea din abdomen.",
    actions: [call112Action, finalAction],
  },
  "burn-1": {
    title: "Cum s-a produs arsura?",
    text: "Alege cauza care se potrivește cel mai bine.",
    actions: [{ label: "Flacără sau lichid fierbinte", next: "burn-2a" }, { label: "Substanță chimică", next: "burn-2b" }, { label: "Curent electric", next: "elec-1" }],
  },
  "burn-2a": {
    title: "Răcește cu jet de apă",
    text: "Ține zona sub jet de apă, chiar dacă flacăra pare deja stinsă. Îndepărtează hainele care nu sunt lipite de piele.",
    actions: [{ label: "Continuă", next: "burn-3" }],
  },
  "burn-2b": {
    title: "Spală mult timp cu apă",
    text: "Ține zona sub jet de apă o perioadă mai lungă, ca să elimini complet substanța.",
    actions: [{ label: "Continuă", next: "burn-3" }],
  },
  "burn-3": {
    title: "Nu pune unsori sau gheață",
    text: "Acoperă arsura cu un pansament curat, umezit, sau o cârpă curată. Acoperă restul corpului pentru a preveni pierderea de căldură.",
    warning: "Arsurile la față, gât, mâini, zone de flexie sau peste 30% din corp sunt descrise în document ca urgențe majore. Sună la 112 dacă nu ai făcut-o deja.",
    actions: [call112Action, finalAction],
  },
  "elec-1": {
    title: "Oprește sursa de curent",
    text: "Nu te apropia de victimă înainte de asta. Dacă nu poți opri curentul, documentul indică îndepărtarea folosind un obiect uscat, neconductor, stând pe o suprafață uscată.",
    warning: "Documentul indică evaluare medicală chiar dacă victima pare bine.",
    actions: [{ label: "Curentul este oprit / victima este departe de sursă", kind: "svb" }],
  },
  "drown-1": {
    title: "Nu intra în apă fără echipament potrivit",
    text: "Dacă nu știi să înoți sau nu ai echipamentul necesar, cheamă ajutor specializat.",
    actions: [{ label: "Am scos victima", next: "drown-2" }],
  },
  "drown-2": {
    title: "Suspectează leziune de coloană",
    text: "Menține gâtul și spatele aliniate. Mișc-o în bloc, fără să-i îndoi gâtul.",
    note: "Documentul furnizat indică evaluare medicală și observație chiar dacă victima își revine.",
    actions: [{ label: "Continuă cu verificarea stării", kind: "svb" }],
  },
  "trauma-1": {
    title: "Nu încerca să îndrepți nimic",
    text: "Dacă suspectezi o fractură sau luxație, imobilizează provizoriu în poziția găsită, fără să tragi sau să repoziționezi.",
    actions: [{ label: "Continuă", next: "trauma-2" }],
  },
  "trauma-2": {
    title: "Nu scoate casca, dacă victima respiră normal",
    text: "Scoate casca doar dacă blochează căile aeriene sau trebuie să faci RCP.",
    actions: [{ label: "Continuă cu verificarea conștienței și respirației", kind: "svb" }],
  },
};

export const PROTOCOLS = { ...adult, ...child, ...infant, ...special };

export function getSvbStart(ageProfile) {
  if (ageProfile === "infant") return "infant-2";
  if (ageProfile === "child") return "child-2";
  return "adult-2";
}

export function getSituationStart(situation, ageProfile) {
  if (situation === "svb") return getSvbStart(ageProfile);
  if (situation === "choking") return "obs-1";
  if (situation === "bleeding") return "hem-1";
  if (situation === "burn") return "burn-1";
  if (situation === "electric") return "elec-1";
  if (situation === "drowning") return "drown-1";
  if (situation === "trauma") return "trauma-1";
  return getSvbStart(ageProfile);
}

export function getDynamicProtocolText(nodeId, ageProfile) {
  if (nodeId !== "obs-4") return null;
  if (ageProfile === "infant") {
    return "NU face compresii abdominale la sugar. Alternează 5 lovituri interscapulare cu 5 compresii toracice, ținând sugarul cu capul mai jos decât trunchiul, pe antebraț.";
  }
  return "Aplică 5 compresii abdominale: stai în spatele victimei, pumnul deasupra buricului, trage brusc spre tine și în sus, de 5 ori.";
}
