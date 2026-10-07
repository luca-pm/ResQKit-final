import { useMemo } from "react";
import { useAgentContext } from "@copilotkit/react-native/headless";

import useLocale from "../hooks/useLocale";
import { woundTutorials, getTutorialById } from "../mock/tutorials";
import { appTutorials, getAppTutorialById } from "../mock/appTutorials";

export default function KnowledgeAIContext() {
  const { language } = useLocale();

  const value = useMemo(() => {
    const firstAidGuides = woundTutorials
      .map((item) => getTutorialById(item.id, language))
      .filter(Boolean)
      .map((tutorial) => ({
        id: tutorial.id,
        category: tutorial.category,
        title: tutorial.title,
        severity: tutorial.severity,
      }));

    const appGuides = appTutorials
      .map((item) => getAppTutorialById(item.id, language))
      .filter(Boolean)
      .map((tutorial) => ({
        id: tutorial.id,
        title: tutorial.title,
      }));

    const isEnglish = String(language || "ro").toLowerCase().startsWith("en");

    return {
      language,
      responseLanguage: isEnglish ? "English" : "Romanian",
      firstAidGuides,
      appGuides,
      guidance: isEnglish
        ? "Reply only in English. This is only a catalog. For exact steps use getFirstAidGuideContent or getAppGuideContent and do not fill gaps from memory."
        : "Răspunde numai în română. Acesta este doar catalogul. Pentru pași exacți folosește getFirstAidGuideContent sau getAppGuideContent și nu completa golurile din memorie.",
    };
  }, [language]);

  useAgentContext({
    description:
      "Catalogul ResQKit și limba curentă a aplicației. Câmpul responseLanguage este obligatoriu pentru limba răspunsului final. Folosește ID-urile catalogului și cere conținutul exact prin tool înainte de instrucțiuni procedurale.",
    value,
  });

  return null;
}
