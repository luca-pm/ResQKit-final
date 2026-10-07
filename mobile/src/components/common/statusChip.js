import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

import styles from "./statusChip.styles";

export default function StatusChip({
  connected = false,
}) {
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        connected
          ? styles.connected
          : styles.disconnected,
      ]}
    >
      <View
        style={[
          styles.dot,
          connected
            ? styles.connectedDot
            : styles.disconnectedDot,
        ]}
      />

      <Text
        style={[
          styles.text,
          connected
            ? styles.connectedText
            : styles.disconnectedText,
        ]}
      >
        {connected
          ? t("common.connected")
          : t("common.disconnected")}
      </Text>
    </View>
  );
}