import { View, Text } from "react-native";

import styles from "./infoRow.styles";

export default function InfoRow({
  label,
  value,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text
        style={styles.value}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}