import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../design";
import styles from "./historyItem.styles";

function getIcon(type) {
  if (type === "intervention") return "car-emergency";
  if (type === "operator") return "account-voice";
  if (type === "ai") return "robot-outline";
  return "history";
}

export default function HistoryItem({ item, onPress }) {
  if (!item) return null;
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.card, pressed && onPress ? { opacity: 0.75 } : null]}>
      <View style={styles.topRow}>
        <View style={styles.iconContainer}><MaterialCommunityIcons name={getIcon(item.type)} size={24} color={COLORS.primary} /></View>
        <View style={styles.headerContent}><Text style={styles.title}>{item.title}</Text><Text style={styles.date}>{item.date} • {item.time}</Text></View>
        {onPress ? <MaterialCommunityIcons name="chevron-right" size={22} color={COLORS.textSecondary} /> : null}
      </View>
      <Text style={styles.description}>{item.description}</Text>
      {item.status ? <View style={styles.statusContainer}><Text style={styles.statusText}>{item.status}</Text></View> : null}
      {Array.isArray(item.details) && item.details.length ? <View style={styles.detailsContainer}>{item.details.map((detail, index) => <View key={`${item.id}-${index}`} style={styles.detailRow}><View style={styles.bullet} /><Text style={styles.detailText}>{detail}</Text></View>)}</View> : null}
    </Pressable>
  );
}
