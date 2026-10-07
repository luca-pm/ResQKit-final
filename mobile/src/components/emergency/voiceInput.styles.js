import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../design";

export default StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  listening: { borderColor: COLORS.error, backgroundColor: COLORS.emergencyTint },
  unavailable: { opacity: 0.7 },
  text: { color: COLORS.text, fontSize: 13, fontWeight: "700" },
  listeningText: { color: COLORS.error },
  hint: { marginTop: SPACING.xs, color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },
});
