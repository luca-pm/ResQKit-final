import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

import styles from "./severityBadge.styles";

export default function SeverityBadge({
  severity = "low",
}) {
  const { t } = useTranslation();

  const label =
    severity === "high"
      ? t("guides.severity.high")
      : severity === "medium"
      ? t("guides.severity.medium")
      : t("guides.severity.low");

  return (
    <View
      style={[
        styles.container,
        severity === "low" && styles.low,
        severity === "medium" && styles.medium,
        severity === "high" && styles.high,
      ]}
    >
      <Text
        style={[
          styles.text,
          severity === "low" && styles.lowText,
          severity === "medium" && styles.mediumText,
          severity === "high" && styles.highText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}