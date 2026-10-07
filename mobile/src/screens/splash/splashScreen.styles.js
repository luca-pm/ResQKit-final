import { StyleSheet } from "react-native";

import { COLORS,
  RADIUS,
  SPACING, FONTS } from "../../design";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },

  logoContainer: {
    alignItems: "center",
  },

  logoCircle: {
    width: 112,
    height: 112,

    borderRadius: RADIUS.round,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primaryDark,

    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },

  logoText: {
    marginTop: SPACING.lg,

    fontSize: 38,
    fontFamily: FONTS.display, fontWeight: "normal",

    letterSpacing: 0.5,

    color: COLORS.white,
  },

  tagline: {
    marginTop: SPACING.sm,

    fontSize: 15,
    lineHeight: 22,

    textAlign: "center",

    color: "rgba(255,255,255,0.82)",
  },

  footer: {
    marginBottom: SPACING.xl,

    fontSize: 12,
    letterSpacing: 0.8,

    textAlign: "center",

    color: "rgba(255,255,255,0.65)",
  },
});