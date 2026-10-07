import { Pressable, View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import {
  COLORS,
} from "../../design";

import styles from "./aiQuickAction.styles";

export default function AIQuickAction({
  title,
  icon,
  onPress,
}) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={26}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={COLORS.textSecondary}
      />
    </Pressable>
  );
}