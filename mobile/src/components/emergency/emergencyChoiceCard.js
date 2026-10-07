import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../design";
import styles from "./emergencyChoiceCard.styles";

export default function EmergencyChoiceCard({ icon = "chevron-right", title, description, onPress, selected = false, danger = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.selected, danger && styles.danger]}>
      <View style={[styles.icon, danger && styles.dangerIcon]}>
        <MaterialCommunityIcons name={icon} size={26} color={danger ? COLORS.error : COLORS.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
    </Pressable>
  );
}
