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
    paddingHorizontal:
      SPACING.lg,

    paddingTop:
      SPACING.lg,

    paddingBottom:
      SPACING.xxxl,
  },

  header: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom:
      SPACING.lg,
  },

  logoCircle: {
    width: 48,
    height: 48,

    borderRadius:
      RADIUS.round,

    alignItems: "center",

    justifyContent:
      "center",

    backgroundColor:
      COLORS.white,

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  brand: {
    marginLeft:
      SPACING.sm,

    fontSize: 22,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.primary,
  },

  title: {
    fontSize: 30,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.text,
  },

  subtitle: {
    marginTop:
      SPACING.sm,

    marginBottom:
      SPACING.lg,

    fontSize: 15,

    lineHeight: 21,

    color:
      COLORS.textSecondary,
  },

  card: {
    marginBottom:
      SPACING.lg,
  },

  sectionDescription: {
    marginTop:
      -SPACING.sm,

    marginBottom:
      SPACING.md,

    fontSize: 13,

    lineHeight: 19,

    color:
      COLORS.textSecondary,
  },

  input: {
    marginBottom:
      SPACING.md,
  },

  vinCounter: {
    marginTop:
      -SPACING.sm,

    textAlign: "right",

    fontSize: 12,

    color:
      COLORS.textSecondary,
  },

  error: {
    marginBottom:
      SPACING.md,

    fontSize: 13,

    lineHeight: 18,

    textAlign: "center",

    color:
      COLORS.destructive,
  },

  button: {
    marginBottom:
      SPACING.lg,
  },

  loginContainer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "center",
  },

  loginText: {
    fontSize: 14,

    color:
      COLORS.textSecondary,
  },

  loginLink: {
    fontSize: 14,

    fontWeight:
      "700",

    color:
      COLORS.primary,
  },
});