const ro = [
  { id: "faq-1", question: "Ce este ResQKit?", answer: "ResQKit este o aplicație de prim ajutor: te ajută să suni la 112, să faci triajul victimelor și să urmezi protocoale pas cu pas, cu ghiduri și asistentul ResQ AI." },
  { id: "faq-3", question: "Am nevoie de cont?", answer: "Nu. Toată ghidarea de urgență funcționează fără cont. Contul este opțional și servește doar pentru arhivarea incidentelor și sincronizarea kiturilor." },
  { id: "faq-6", question: "Unde găsesc ghidurile de prim ajutor?", answer: "Ghidurile sunt disponibile în secțiunea Ghiduri. Poți selecta categoria dorită și apoi tipul situației pentru a vedea pașii recomandați." },
  { id: "faq-7", question: "Ce reprezintă nivelurile de severitate din ghiduri?", answer: "Nivelurile de severitate ajută la diferențierea situațiilor. Verde indică un nivel scăzut, galben un nivel mediu, iar roșu indică o situație cu prioritate ridicată." },
  { id: "faq-8", question: "Unde pot vedea istoricul intervențiilor?", answer: "Deschide tab-ul Istoric. Acolo găsești intervențiile păstrate pe telefon, cele arhivate în cont și conversațiile anterioare cu ResQ AI." },
  { id: "faq-9", question: "Ce este ResQ AI?", answer: "ResQ AI este asistentul din aplicație, conceput pentru a oferi informații și suport contextual. Pentru situații critice, instrucțiunile serviciilor de urgență și ale personalului specializat au prioritate." },
  { id: "faq-10", question: "Cum schimb limba aplicației?", answer: "Limba poate fi modificată din Setări, în secțiunea Limbă. Poți comuta între română și engleză." },
];

const en = [
  { id: "faq-1", question: "What is ResQKit?", answer: "ResQKit is a first-aid app: it helps you call 112, triage the injured and follow step-by-step protocols, with guides and the ResQ AI assistant." },
  { id: "faq-3", question: "Do I need an account?", answer: "No. All emergency guidance works without an account. An account is optional and is only used to archive incidents and sync your kits." },
  { id: "faq-6", question: "Where can I find the first-aid guides?", answer: "The guides are available in the Guides section. Choose a category and then the relevant situation to view the recommended steps." },
  { id: "faq-7", question: "What do the severity levels in the guides mean?", answer: "Severity levels help distinguish situations. Green indicates low priority, yellow medium priority, and red a high-priority situation." },
  { id: "faq-8", question: "Where can I see intervention history?", answer: "Open the History tab. There you can see interventions kept on this phone, those archived to your account, and previous ResQ AI conversations." },
  { id: "faq-9", question: "What is ResQ AI?", answer: "ResQ AI is the in-app assistant designed to provide information and contextual support. In critical situations, instructions from emergency services and qualified personnel take priority." },
  { id: "faq-10", question: "How do I change the app language?", answer: "You can change the language from Settings, under Language. You can switch between Romanian and English." },
];

export const faqItems = ro;
export function getFaqItems(language = "ro") {
  return String(language).toLowerCase().startsWith("en") ? en : ro;
}
