import { Pressable, View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { COLORS } from "../../design";

import styles from "./settingRow.styles";

export default function SettingRow({
  icon,
  title,
  value,
  onPress,
  danger = false,
}) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.left}>
        <MaterialCommunityIcons
          name={icon}
          size={23}
          color={danger ? COLORS.destructive : COLORS.primary}
        />

        <Text
          style={[
            styles.title,
            danger && styles.dangerText,
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        {value ? (
          <Text style={styles.value}>
            {value}
          </Text>
        ) : null}

        {!danger && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={COLORS.textSecondary}
          />
        )}
      </View>
    </Pressable>
  );
}