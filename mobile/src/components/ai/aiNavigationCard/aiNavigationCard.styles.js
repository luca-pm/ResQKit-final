import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../../design";

export default StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: "flex-start",
  },
  card: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  button: {
    minHeight: 54,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    flex: 1,
    marginRight: SPACING.sm,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
});
