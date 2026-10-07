import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { COLORS } from "../../design";
import styles from "./guideCard.styles";

export default function GuideCard({
  title,
  icon = "medical-bag",
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={26}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={COLORS.textSecondary}
      />
    </Pressable>
  );
}
