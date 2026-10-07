import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../design";
export default StyleSheet.create({
  card: { marginBottom: SPACING.md, padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, flexDirection: "row", alignItems: "center", ...SHADOWS.small },
  selected: { borderColor: COLORS.primary, borderWidth: 2 },
  danger: { borderColor: COLORS.error },
  icon: { width: 48, height: 48, borderRadius: RADIUS.round, backgroundColor: COLORS.primaryLight, alignItems: "center", justifyContent: "center", marginRight: SPACING.md },
  dangerIcon: { backgroundColor: "#FDE8E8" },
  content: { flex: 1 },
  title: { color: COLORS.text, fontSize: 16, fontWeight: "700", lineHeight: 22 },
  description: { color: COLORS.textSecondary, marginTop: 4, fontSize: 13, lineHeight: 18 },
});
