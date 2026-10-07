import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../design";
export default StyleSheet.create({
  container: { gap: SPACING.sm },
  title: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  description: { color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.sm },
  camera: { height: 260, borderRadius: RADIUS.lg, overflow: "hidden" },
  actions: { gap: SPACING.xs },
  results: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs },
  chip: { marginTop: SPACING.xs },
  sceneNote: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 19 },
});
