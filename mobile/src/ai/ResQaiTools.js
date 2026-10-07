import { useFrontendTool } from "@copilotkit/react-native/headless";
import { z } from "zod";

import useApp from "../hooks/useApp";
import { ROUTES } from "../constants/routes";
import { woundGuides } from "../mock/guides";
import { getTutorialById } from "../mock/tutorials";
import { getAppTutorialById } from "../mock/appTutorials";
import {
  getDynamicProtocolText,
  getProtocolNode,
} from "../data/protocols/protocolData";
import { buildIncidentBrief } from "../services/briefService";
import i18n from "../localization/i18n";

const FIRST_AID_TUTORIAL_IDS = [
  "small-cut",
  "deep-cut",
  "minor-burn",
  "severe-burn",
  "heavy-bleeding",
  "nosebleed",
  "suspected-fracture",
  "open-fracture",
  "adult-cpr",
  "choking-adult",
  "suspected-poisoning",
  "severe-allergic-reaction",
  "car-accident",
];

const FIRST_AID_CATEGORY_IDS = [
  "cuts",
  "burns",
  "bleeding",
  "fractures",
  "cpr",
  "choking",
  "poisoning",
  "allergicReaction",
  "carAccident",
];

const APP_GUIDE_IDS = [
  "gettingStarted",
  "home",
  "ai",
  "settings",
];

function activeVictimFor(incident) {
  if (!incident) return null;
  return (
    incident.victims?.find(
      (victim) => victim.id === incident.activeVictimId
    ) ||
    incident.victims?.[0] ||
    null
  );
}

function emergencyResumeTarget(incident) {
  if (!incident) return ROUTES.INCIDENT_START;

  if (
    incident.called112 !== "called" &&
    incident.called112 !== "already_called"
  ) {
    return ROUTES.CALL_112_GATE;
  }

  const active = activeVictimFor(incident);
  if (active?.protocolNodeId && active.status !== "done") return ROUTES.PROTOCOL;
  return ROUTES.VICTIMS;
}

function safeToolResult(payload) {
  return JSON.stringify(payload);
}

function localText(language, ro, en) {
  return String(language || "ro").toLowerCase().startsWith("en") ? en : ro;
}

function queueNavigation(setAiNavigationAction, action) {
  setAiNavigationAction({
    id: `ai-nav-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...action,
  });
}

export default function ResQAITools() {
  const {
    incident,
    setAiNavigationAction,
  } = useApp();

  const language = i18n.language || "ro";

  // ==================================================
  // KNOWLEDGE RETRIEVAL — FIRST AID
  // ==================================================

  useFrontendTool(
    {
      name: "getFirstAidGuideContent",
      description:
        "Returnează conținutul exact al unui ghid de prim ajutor stocat în ResQKit. Folosește acest tool înainte să redai pași procedurali pentru un ghid disponibil, ca să nu inventezi instrucțiuni din memoria modelului.",
      parameters: z.object({
        tutorialId: z
          .enum(FIRST_AID_TUTORIAL_IDS)
          .describe("ID-ul exact al ghidului de prim ajutor."),
      }),
      handler: async ({ tutorialId }) => {
        const tutorial = getTutorialById(tutorialId, language);

        if (!tutorial) {
          return safeToolResult({
            success: false,
            reason: "tutorial_not_found",
            tutorialId,
          });
        }

        queueNavigation(setAiNavigationAction, {
          kind: "route",
          route: ROUTES.GUIDE_DETAIL,
          params: { tutorialId: tutorial.id },
          title: localText(language, `Ghid: ${tutorial.title}`, `Guide: ${tutorial.title}`),
          description: localText(
            language,
            "Dacă vrei să vezi ghidul complet în aplicație, îl poți deschide de aici.",
            "If you want to view the full guide in the app, you can open it here."
          ),
          buttonLabel: localText(language, "Vezi ghidul complet", "View full guide"),
        });

        return safeToolResult({
          success: true,
          source: "resqkit_validated_content",
          id: tutorial.id,
          category: tutorial.category,
          title: tutorial.title,
          severity: tutorial.severity,
          duration: tutorial.duration,
          description: tutorial.description,
          steps: tutorial.steps,
          navigationPending: true,
        });
      },
    },
    [language]
  );

  // ==================================================
  // KNOWLEDGE RETRIEVAL — APP GUIDE
  // ==================================================

  useFrontendTool(
    {
      name: "getAppGuideContent",
      description:
        "Returnează conținutul exact al unui tutorial despre aplicația ResQKit. Folosește-l când utilizatorul cere pași concreți pentru folosirea aplicației.",
      parameters: z.object({
        tutorialId: z
          .enum(APP_GUIDE_IDS)
          .describe("ID-ul tutorialului aplicației."),
      }),
      handler: async ({ tutorialId }) => {
        const tutorial = getAppTutorialById(tutorialId, language);

        if (!tutorial) {
          return safeToolResult({
            success: false,
            reason: "app_tutorial_not_found",
            tutorialId,
          });
        }

        queueNavigation(setAiNavigationAction, {
          kind: "route",
          route: ROUTES.APP_GUIDE_DETAIL,
          params: { tutorialId: tutorial.id },
          title: localText(language, `Tutorial: ${tutorial.title}`, `Tutorial: ${tutorial.title}`),
          description: localText(
            language,
            "Dacă vrei să vezi toți pașii în aplicație, poți deschide tutorialul complet.",
            "If you want to see all steps in the app, you can open the full tutorial."
          ),
          buttonLabel: localText(language, "Vezi tutorialul complet", "View full tutorial"),
        });

        return safeToolResult({
          success: true,
          source: "resqkit_app_guide",
          id: tutorial.id,
          title: tutorial.title,
          description: tutorial.description,
          steps: tutorial.steps,
          navigationPending: true,
        });
      },
    },
    [language]
  );

  // ==================================================
  // OPEN GUIDES
  // ==================================================

  useFrontendTool(
    {
      name: "openGuides",
      description:
        "Deschide pagina generală Guides din aplicația ResQKit. Folosește acest tool când utilizatorul cere pagina de ghiduri, fără să indice o situație medicală specifică.",
      parameters: z.object({
        section: z
          .enum(["wounds", "app"])
          .optional()
          .describe(
            "wounds pentru ghidurile de prim ajutor, app pentru ghidurile aplicației."
          ),
      }),
      handler: async ({ section }) => {
        const guideType = section === "app" ? "app" : "wounds";
        const destination = localText(
          language,
          guideType === "app" ? "Ghidurile aplicației" : "Ghidurile de prim ajutor",
          guideType === "app" ? "App guides" : "First-aid guides"
        );

        queueNavigation(setAiNavigationAction, {
          kind: "tab",
          tab: ROUTES.GUIDES,
          params: { guideType },
          title: localText(language, `Redirecționare către ${destination}`, `Go to ${destination}`),
          description: localText(
            language,
            "Apasă butonul când ești gata. Conversația rămâne disponibilă când revii la ResQ AI.",
            "Tap the button when you are ready. The conversation will still be here when you return to ResQ AI."
          ),
          buttonLabel: localText(language, `Deschide ${destination}`, `Open ${destination}`),
        });

        return safeToolResult({
          success: true,
          navigationPending: true,
          destination,
          rule: "Nu spune că pagina a fost deja deschisă. Utilizatorul trebuie să apese butonul de redirecționare.",
        });
      },
    },
    [language]
  );

  // ==================================================
  // OPEN SPECIFIC FIRST-AID GUIDE
  // ==================================================

  useFrontendTool(
    {
      name: "openFirstAidGuide",
      description:
        "Deschide o categorie sau un ghid specific de prim ajutor din ResQKit. Dacă severitatea nu este suficient de clară, folosește categoryId și nu ghici tutorialId.",
      parameters: z.object({
        categoryId: z
          .enum(FIRST_AID_CATEGORY_IDS)
          .optional()
          .describe("Categoria generală de prim ajutor."),
        tutorialId: z
          .enum(FIRST_AID_TUTORIAL_IDS)
          .optional()
          .describe(
            "Ghidul exact, numai când descrierea utilizatorului oferă suficiente indicii."
          ),
      }),
      handler: async ({ categoryId, tutorialId }) => {
        if (tutorialId) {
          const tutorial = getTutorialById(tutorialId, language);

          if (!tutorial) {
            return safeToolResult({
              success: false,
              reason: "tutorial_not_found",
              tutorialId,
            });
          }

          queueNavigation(setAiNavigationAction, {
            kind: "route",
            route: ROUTES.GUIDE_DETAIL,
            params: { tutorialId: tutorial.id },
            title: localText(language, `Ghid recomandat: ${tutorial.title}`, `Recommended guide: ${tutorial.title}`),
            description: localText(
              language,
              "Poți deschide ghidul ResQKit și continua de acolo.",
              "You can open the ResQKit guide and continue from there."
            ),
            buttonLabel: localText(language, "Deschide ghidul", "Open guide"),
          });

          return safeToolResult({
            success: true,
            navigationPending: true,
            destination: tutorial.title,
            tutorialId: tutorial.id,
            rule: "Nu spune că ghidul a fost deja deschis. Utilizatorul trebuie să apese butonul de redirecționare.",
          });
        }

        if (categoryId) {
          const guide = woundGuides.find((item) => item.id === categoryId);

          if (!guide) {
            return safeToolResult({
              success: false,
              reason: "category_not_found",
              categoryId,
            });
          }

          const categoryTitle = i18n.t(guide.titleKey);

          queueNavigation(setAiNavigationAction, {
            kind: "route",
            route: ROUTES.GUIDE_CATEGORY,
            params: { categoryId: guide.id, categoryTitle },
            title: localText(language, `Categorie recomandată: ${categoryTitle}`, `Recommended category: ${categoryTitle}`),
            description: localText(
              language,
              "Descrierea nu este suficientă pentru a presupune severitatea. Poți vedea opțiunile din această categorie.",
              "There is not enough information to assume severity. You can view the options in this category."
            ),
            buttonLabel: localText(language, `Deschide ${categoryTitle}`, `Open ${categoryTitle}`),
          });

          return safeToolResult({
            success: true,
            navigationPending: true,
            destination: categoryTitle,
            categoryId: guide.id,
            rule: "Nu spune că pagina a fost deja deschisă. Utilizatorul trebuie să apese butonul de redirecționare.",
          });
        }

        return safeToolResult({
          success: false,
          reason: "missing_guide_target",
        });
      },
    },
    [language]
  );

  // ==================================================
  // OPEN SPECIFIC APP GUIDE
  // ==================================================

  useFrontendTool(
    {
      name: "openAppGuide",
      description:
        "Deschide un tutorial specific despre folosirea aplicației ResQKit.",
      parameters: z.object({
        tutorialId: z.enum(APP_GUIDE_IDS),
      }),
      handler: async ({ tutorialId }) => {
        const tutorial = getAppTutorialById(tutorialId, language);
        if (!tutorial) {
          return safeToolResult({
            success: false,
            reason: "app_tutorial_not_found",
            tutorialId,
          });
        }

        queueNavigation(setAiNavigationAction, {
          kind: "route",
          route: ROUTES.APP_GUIDE_DETAIL,
          params: { tutorialId },
          title: localText(language, `Tutorial: ${tutorial.title}`, `Tutorial: ${tutorial.title}`),
          description: localText(
            language,
            "Apasă butonul pentru a vedea tutorialul complet din aplicație.",
            "Tap the button to view the full tutorial in the app."
          ),
          buttonLabel: localText(language, "Deschide tutorialul", "Open tutorial"),
        });

        return safeToolResult({
          success: true,
          navigationPending: true,
          destination: tutorial.title,
          tutorialId,
          rule: "Nu spune că tutorialul a fost deja deschis. Utilizatorul trebuie să apese butonul de redirecționare.",
        });
      },
    },
    [language]
  );

  // ==================================================
  // EMERGENCY — OPEN START SCREEN
  // ==================================================

  useFrontendTool(
    {
      name: "openEmergencyStart",
      description:
        "Deschide ecranul de început al unei intervenții ResQKit. Acest tool NU pornește și NU înlocuiește singur o sesiune; utilizatorul confirmă în interfață.",
      parameters: z.object({}),
      handler: async () => {
        queueNavigation(setAiNavigationAction, {
          kind: "route",
          route: ROUTES.INCIDENT_START,
          title: localText(language, "Începe o intervenție", "Start an intervention"),
          description: localText(
            language,
            "Vei ajunge la ecranul de pornire. Sesiunea nu începe și nu se înlocuiește până când confirmi în interfață.",
            "You will go to the start screen. The session will not start or be replaced until you confirm in the interface."
          ),
          buttonLabel: localText(language, "Mergi la intervenție", "Go to intervention"),
        });
        return safeToolResult({
          success: true,
          navigationPending: true,
          destination: "IncidentStart",
          requiresUserConfirmation: true,
        });
      },
    },
    [language]
  );

  // ==================================================
  // EMERGENCY — CONTINUE ACTIVE SESSION
  // ==================================================

  useFrontendTool(
    {
      name: "continueEmergencySession",
      description:
        "Continuă navigarea într-o sesiune de urgență deja existentă. Alege ecranul potrivit din starea deterministă a aplicației, fără să modifice răspunsurile medicale.",
      parameters: z.object({}),
      handler: async () => {
        if (!incident) {
          return safeToolResult({ success: false, reason: "no_active_incident" });
        }

        const target = emergencyResumeTarget(incident);
        const params =
          target === ROUTES.KIT_PREPARATION
            ? { nextRoute: ROUTES.PROTOCOL }
            : undefined;

        queueNavigation(setAiNavigationAction, {
          kind: "route",
          route: target,
          params,
          title: localText(language, "Continuă sesiunea activă", "Continue active session"),
          description: localText(
            language,
            "Apasă butonul pentru a reveni exact la punctul potrivit din intervenție.",
            "Tap the button to return to the appropriate point in the intervention."
          ),
          buttonLabel: localText(language, "Continuă sesiunea", "Continue session"),
        });

        return safeToolResult({
          success: true,
          navigationPending: true,
          destination: target,
          activeIncident: true,
        });
      },
    },
    [incident?.id, incident?.updatedAt]
  );

  // ==================================================
  // EMERGENCY — CURRENT FIXED PROTOCOL STEP
  // ==================================================

  useFrontendTool(
    {
      name: "getCurrentEmergencyStep",
      description:
        "Returnează pasul determinist curent din protocolul sesiunii active. Folosește acest tool când utilizatorul întreabă «ce fac acum?», «care este pasul curent?» sau cere explicarea pasului din intervenție.",
      parameters: z.object({}),
      handler: async () => {
        const active = activeVictimFor(incident);

        if (!incident || !active?.protocolNodeId) {
          return safeToolResult({
            success: false,
            reason: "no_current_protocol_step",
            suggestedAction: "continueEmergencySession",
          });
        }

        const node = getProtocolNode(active.protocolNodeId, language);
        if (!node) {
          return safeToolResult({
            success: false,
            reason: "protocol_node_not_found",
            nodeId: active.protocolNodeId,
          });
        }

        const text = node.dynamicText
          ? getDynamicProtocolText(
              active.protocolNodeId,
              active.ageProfile,
              language
            )
          : node.text;

        return safeToolResult({
          success: true,
          source: "resqkit_fixed_protocol",
          victim: {
            id: active.id,
            label: active.label || null,
            ageProfile: active.ageProfile || null,
            situation: active.situation || null,
          },
          nodeId: active.protocolNodeId,
          title: node.title,
          text: text || null,
          warning: node.warning || null,
          note: node.note || null,
          actions: (node.actions || []).map((action) => ({
            label: action.label,
            kind: action.kind || null,
          })),
          rule:
            "AI-ul poate explica acest pas, dar utilizatorul trebuie să apese opțiunea corespunzătoare în interfața protocolului.",
        });
      },
    },
    [incident?.id, incident?.updatedAt, language]
  );

  // ==================================================
  // EMERGENCY — OPEN CURRENT PROTOCOL
  // ==================================================

  useFrontendTool(
    {
      name: "openCurrentProtocol",
      description:
        "Deschide ecranul protocolului curent dacă sesiunea are deja vârstă, situație și pas de protocol stabilite. Nu marchează niciun pas ca finalizat.",
      parameters: z.object({}),
      handler: async () => {
        const active = activeVictimFor(incident);
        if (!incident || !active?.protocolNodeId) {
          return safeToolResult({
            success: false,
            reason: "no_current_protocol",
            suggestedAction: "continueEmergencySession",
          });
        }

        queueNavigation(setAiNavigationAction, {
          kind: "route",
          route: ROUTES.PROTOCOL,
          title: localText(language, "Protocolul curent", "Current protocol"),
          description: localText(language, "Poți reveni la pasul curent al intervenției.", "You can return to the current intervention step."),
          buttonLabel: localText(language, "Deschide protocolul", "Open protocol"),
        });
        return safeToolResult({
          success: true,
          navigationPending: true,
          destination: "Protocol",
          protocolNodeId: active.protocolNodeId,
        });
      },
    },
    [incident?.id, incident?.updatedAt]
  );

  // ==================================================
  // EMERGENCY — OPEN PEOPLE / TRIAGE / HANDOFF / REPORT
  // ==================================================

  useFrontendTool(
    {
      name: "openEmergencyVictims",
      description:
        "Deschide lista victimelor din sesiunea de urgență activă. Nu schimbă ordinea sau prioritatea victimelor.",
      parameters: z.object({}),
      handler: async () => {
        if (!incident) {
          return safeToolResult({ success: false, reason: "no_active_incident" });
        }
        queueNavigation(setAiNavigationAction, { kind: "route", route: ROUTES.VICTIMS, title: localText(language, "Victimele sesiunii", "People in this session"), description: localText(language, "Poți vedea lista victimelor înregistrate în sesiunea activă.", "You can view the people recorded in the active session."), buttonLabel: localText(language, "Arată victimele", "Show people") });
        return safeToolResult({ success: true, navigationPending: true, destination: "Victims" });
      },
    },
    [incident?.id]
  );

  useFrontendTool(
    {
      name: "openEmergencyTriage",
      description:
        "Deschide ecranul de triaj rapid pentru victima activă. Tool-ul doar navighează; AI-ul NU completează răspunsurile de triaj.",
      parameters: z.object({}),
      handler: async () => {
        const active = activeVictimFor(incident);
        if (!incident || !active) {
          return safeToolResult({ success: false, reason: "no_active_victim" });
        }
        queueNavigation(setAiNavigationAction, { kind: "route", route: ROUTES.TRIAGE, title: localText(language, "Triaj rapid", "Quick triage"), description: localText(language, "Triajul trebuie completat manual de utilizator.", "Triage must be completed manually by the user."), buttonLabel: localText(language, "Deschide triajul", "Open triage") });
        return safeToolResult({
          success: true,
          navigationPending: true,
          destination: "Triage",
          requiresUserInput: true,
        });
      },
    },
    [incident?.id, incident?.activeVictimId]
  );

  useFrontendTool(
    {
      name: "openEmergencyHandoff",
      description:
        "Deschide ecranul de predare a informațiilor pentru sesiunea activă. Nu încheie sesiunea și nu transmite automat date.",
      parameters: z.object({}),
      handler: async () => {
        if (!incident) {
          return safeToolResult({ success: false, reason: "no_active_incident" });
        }
        queueNavigation(setAiNavigationAction, { kind: "route", route: ROUTES.HANDOFF, title: localText(language, "Predarea informațiilor", "Handoff information"), description: localText(language, "Poți deschide ecranul de predare fără să închei sesiunea.", "You can open the handoff screen without ending the session."), buttonLabel: localText(language, "Deschide predarea", "Open handoff") });
        return safeToolResult({ success: true, navigationPending: true, destination: "Handoff" });
      },
    },
    [incident?.id]
  );

  useFrontendTool(
    {
      name: "openEmergencyReport",
      description:
        "Deschide raportul sesiunii active. Nu arhivează și nu închide sesiunea.",
      parameters: z.object({}),
      handler: async () => {
        if (!incident) {
          return safeToolResult({ success: false, reason: "no_active_incident" });
        }
        queueNavigation(setAiNavigationAction, { kind: "route", route: ROUTES.REPORT, title: localText(language, "Raportul incidentului", "Incident report"), description: localText(language, "Poți consulta raportul fără să închizi sesiunea.", "You can view the report without closing the session."), buttonLabel: localText(language, "Deschide raportul", "Open report") });
        return safeToolResult({ success: true, navigationPending: true, destination: "Report" });
      },
    },
    [incident?.id]
  );

  // ==================================================
  // EMERGENCY — DETERMINISTIC BRIEF FOR AI SUMMARY
  // ==================================================

  useFrontendTool(
    {
      name: "getActiveIncidentBrief",
      description:
        "Returnează rezumatul determinist al sesiunii active, fără date medicale personale din profil. Folosește-l dacă utilizatorul cere un rezumat, handoff verbal sau recapitularea incidentului. Nu adăuga fapte care nu sunt în textul returnat.",
      parameters: z.object({}),
      handler: async () => {
        if (!incident) {
          return safeToolResult({
            success: false,
            reason: "no_active_incident",
          });
        }

        const brief = buildIncidentBrief(
          incident,
          {},
          false,
          language,
          { includeReporter: false }
        );

        return safeToolResult({
          success: true,
          source: "resqkit_deterministic_brief",
          brief,
          rule:
            "Poți reformula mai fluent, dar nu adăuga fapte, diagnostice sau valori care nu apar în brief.",
        });
      },
    },
    [incident?.id, incident?.updatedAt, language]
  );

  // ==================================================
  // RESQKIT DEVICE STATUS
  // No hardware is connected to the app yet (see the zip's progress doc
  // §6.2): a fake battery reading on a first-aid kit is a safety claim, so
  // the model must never be handed one.
  // ==================================================

  useFrontendTool(
    {
      name: "getResQKitStatus",
      description:
        "Spune dacă aplicația poate citi starea dispozitivului ResQKit. În această versiune nu există integrare hardware: nu inventa niciodată nivelul bateriei sau starea conexiunii.",
      parameters: z.object({}),
      handler: async () =>
        safeToolResult({
          hardwareConnected: false,
          battery: null,
          reason: "no_hardware_integration",
          message: "Aplicația nu este conectată la un dispozitiv ResQKit. Verifică direct trusa fizică.",
        }),
    },
    []
  );

  return null;
}
