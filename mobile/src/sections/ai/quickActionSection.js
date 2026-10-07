import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

import AIQuickAction from "../../components/ai/aiQuickAction";

import styles from "./quickActionSection.styles";

export default function QuickActionsSection({
  hasActiveIncident = false,
  onStartEmergency,
  onContinueEmergency,
  onExplainCurrentStep,
  onAnalyzeWound,
  onFirstAid,
  onAskQuestion,
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("ai.quickSuggestions")}</Text>

      {hasActiveIncident ? (
        <>
          <AIQuickAction
            title={t("ai.continueEmergency")}
            icon="ambulance"
            onPress={onContinueEmergency}
          />

          <AIQuickAction
            title={t("ai.explainCurrentStep")}
            icon="clipboard-pulse-outline"
            onPress={onExplainCurrentStep}
          />
        </>
      ) : (
        <AIQuickAction
          title={t("ai.startEmergency")}
          icon="car-emergency"
          onPress={onStartEmergency}
        />
      )}

      <AIQuickAction
        title={t("ai.analyzeWound")}
        icon="camera-outline"
        onPress={onAnalyzeWound}
      />

      <AIQuickAction
        title={t("ai.firstAid")}
        icon="medical-bag"
        onPress={onFirstAid}
      />

      <AIQuickAction
        title={t("ai.askQuestion")}
        icon="message-question-outline"
        onPress={onAskQuestion}
      />
    </View>
  );
}
