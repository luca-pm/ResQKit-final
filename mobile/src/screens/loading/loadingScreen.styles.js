import {
  StyleSheet,
} from "react-native";

import { COLORS,
  RADIUS,
  SPACING, FONTS } from "../../design";

export default StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      COLORS.background,
  },

  content: {
    flex: 1,

    alignItems: "center",

    justifyContent:
      "center",

    paddingHorizontal:
      SPACING.xl,
  },

  logoCircle: {
    width: 92,
    height: 92,

    borderRadius:
      RADIUS.round,

    alignItems:
      "center",

    justifyContent:
      "center",

    backgroundColor:
      COLORS.white,

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  title: {
    marginTop:
      SPACING.md,

    fontSize: 30,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.text,
  },

  loader: {
    marginTop:
      SPACING.xl,
  },

  loadingText: {
    marginTop:
      SPACING.lg,

    fontSize: 16,

    fontWeight:
      "600",

    color:
      COLORS.text,
  },

  description: {
    marginTop:
      SPACING.sm,

    maxWidth: 280,

    fontSize: 13,

    lineHeight: 19,

    textAlign:
      "center",

    color:
      COLORS.textSecondary,
  },
});