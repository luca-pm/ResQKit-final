import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../design";

export default StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.emergencyTint,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  textWrap: { flex: 1 },
  title: { color: COLORS.error, fontFamily: FONTS.display, fontWeight: "normal", fontSize: 14 },
  text: { marginTop: 3, color: COLORS.text, fontSize: 13, lineHeight: 18 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginTop: SPACING.sm },
  action: { flexGrow: 1 },
});
