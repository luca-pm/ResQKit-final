import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { TouchableOpacity, Text, View } from "react-native";

import styles from "./aiButton.styles";

export default function FloatingAIButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name="robot-outline"
        size={26}
        color="white"
      />

      <Text style={styles.text}>
        ResQ AI
      </Text>
    </TouchableOpacity>
  );
}