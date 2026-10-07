import {
  StyleSheet,
} from "react-native";

import { COLORS,
  SPACING,
  RADIUS, FONTS } from "../../design";

export default StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      COLORS.background,
  },

  flex: {
    flex: 1,
  },

  content: {
    flexGrow: 1,

    justifyContent:
      "center",

    paddingHorizontal:
      SPACING.lg,

    paddingVertical:
      SPACING.xl,
  },

  iconContainer: {
    width: 88,
    height: 88,

    alignSelf: "center",

    alignItems: "center",

    justifyContent:
      "center",

    borderRadius:
      RADIUS.round,

    backgroundColor:
      COLORS.primaryLight,

    marginBottom:
      SPACING.lg,
  },

  title: {
    fontSize: 28,

    fontFamily: FONTS.display, fontWeight: "normal",

    textAlign: "center",

    color:
      COLORS.text,

    marginBottom:
      SPACING.sm,
  },

  subtitle: {
    fontSize: 15,

    lineHeight: 22,

    textAlign: "center",

    color:
      COLORS.textSecondary,
  },

  input: {
    marginTop:
      SPACING.xl,

    marginBottom:
      SPACING.sm,
  },

  error: {
    marginBottom:
      SPACING.md,

    textAlign: "center",

    fontSize: 14,

    color:
      COLORS.destructive,
  },

  helperText: {
    marginTop:
      SPACING.md,

    paddingHorizontal:
      SPACING.md,

    textAlign: "center",

    fontSize: 13,

    lineHeight: 19,

    color:
      COLORS.textSecondary,
  },

  successContainer: {
    alignItems: "stretch",
  },

  successIcon: {
    width: 88,
    height: 88,

    alignSelf: "center",

    alignItems: "center",

    justifyContent:
      "center",

    borderRadius:
      RADIUS.round,

    backgroundColor:
      COLORS.white,

    marginBottom:
      SPACING.lg,
  },

  email: {
    marginVertical:
      SPACING.xs,

    textAlign: "center",

    fontSize: 15,

    fontWeight: "700",

    color:
      COLORS.text,
  },

  backButton: {
    marginTop:
      SPACING.xl,
  },

  resend: {
    marginTop:
      SPACING.lg,

    textAlign: "center",

    fontSize: 14,

    fontWeight: "600",

    color:
      COLORS.primary,
  },
});