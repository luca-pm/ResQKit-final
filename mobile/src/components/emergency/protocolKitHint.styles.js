import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../design";

export default StyleSheet.create({
  container: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.surface,
  },
  heading: { flexDirection: "row", alignItems: "center", gap: SPACING.xs, marginBottom: SPACING.sm },
  title: { color: COLORS.text, fontFamily: FONTS.display, fontWeight: "normal", fontSize: 14 },
  present: { color: COLORS.success, fontWeight: "700", lineHeight: 20 },
  missing: { color: COLORS.textSecondary, lineHeight: 20 },
  muted: { marginTop: 4, color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
  fallbackBox: { marginTop: SPACING.sm, padding: SPACING.sm, borderRadius: RADIUS.sm, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  fallback: { color: COLORS.text, fontSize: 13, lineHeight: 19 },
});
