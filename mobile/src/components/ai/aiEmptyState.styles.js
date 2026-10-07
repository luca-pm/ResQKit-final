import { StyleSheet } from "react-native";

import { COLORS,
  SPACING,
  RADIUS, FONTS } from "../../design";

export default StyleSheet.create({
  container: {
    alignItems: "center",

    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },

  iconContainer: {
    width: 72,
    height: 72,

    borderRadius: RADIUS.round,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primaryLight,

    marginBottom: SPACING.md,
  },

  title: {
    fontSize: 24,
    fontFamily: FONTS.display, fontWeight: "normal",

    color: COLORS.text,

    textAlign: "center",
  },

  subtitle: {
    marginTop: SPACING.sm,

    fontSize: 16,

    color: COLORS.textSecondary,

    textAlign: "center",
  },

  emergencyNote: {
    marginTop: SPACING.md,

    fontSize: 12,

   lineHeight: 18,

    textAlign: "center",

    color: COLORS.textSecondary,
  },
});