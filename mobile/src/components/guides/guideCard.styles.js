import { StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../design";

export default StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 76,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
    marginRight: SPACING.md,
  },

  title: {
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    color: COLORS.text,
    marginRight: SPACING.sm,
  },

  pressed: {
    opacity: 0.72,
  },
});
