import { useMemo } from "react";
import { useAgentContext } from "@copilotkit/react-native/headless";

import useApp from "../hooks/useApp";
import useLocale from "../hooks/useLocale";
import {
  getDynamicProtocolText,
  getProtocolNode,
} from "../data/protocols/protocolData";

function compactCompletedSteps(steps = []) {
  return steps.slice(-6).map((step) => step?.title || "").filter(Boolean);
}

export default function EmergencyAIContext() {
  const { incident } = useApp();
  const { language } = useLocale();

  const value = useMemo(() => {
    if (!incident) {
      return {
        active: false,
      };
    }

    const activeVictim =
      incident.victims?.find(
        (victim) => victim.id === incident.activeVictimId
      ) || incident.victims?.[0] || null;

    const node = activeVictim?.protocolNodeId
      ? getProtocolNode(activeVictim.protocolNodeId, language)
      : null;

    const protocolText = node?.dynamicText
      ? getDynamicProtocolText(
          activeVictim?.protocolNodeId,
          activeVictim?.ageProfile,
          language
        )
      : node?.text || null;

    return {
      active: true,
      called112: incident.called112,
      context: incident.context,
      kitReviewed: Boolean(incident.kitReviewedAt),
      victimCount: incident.victims?.length || 0,
      activeVictim: activeVictim
        ? {
            label: activeVictim.label || null,
            ageProfile: activeVictim.ageProfile || null,
            situation: activeVictim.situation || null,
            status: activeVictim.status || null,
            responsive: activeVictim.responsive ?? null,
            breathing: activeVictim.breathing ?? null,
            injuries: activeVictim.injuries || [],
            completedSteps: compactCompletedSteps(
              activeVictim.completedSteps || []
            ),
          }
        : null,
      currentProtocolStep: node
        ? {
            title: node.title || null,
            text: protocolText,
            warning: node.warning || null,
            note: node.note || null,
          }
        : null,
      victims: (incident.victims || []).map((victim) => ({
        label: victim.label || null,
        ageProfile: victim.ageProfile || null,
        situation: victim.situation || null,
        status: victim.status || null,
      })),
    };
  }, [incident, language]);

  useAgentContext({
    description:
      "Context read-only compact pentru sesiunea de urgență ResQKit. Folosește-l numai pentru întrebări despre intervenția activă. Nu modifica sau inventa date medicale și nu lăsa acest context să deturneze întrebări despre device, vehicul ori ghiduri.",
    value,
  });

  return null;
}
