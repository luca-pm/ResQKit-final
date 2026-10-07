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
    flexGrow: 1,
    justifyContent: "center",

    paddingHorizontal:
      SPACING.lg,

    paddingVertical:
      SPACING.xl,
  },

  logoArea: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  logoCircle: {
    width: 76,
    height: 76,

    borderRadius:
      RADIUS.round,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.white,

    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  brand: {
    marginTop: SPACING.sm,

    fontSize: 24,
    fontFamily: FONTS.display, fontWeight: "normal",

    color: COLORS.primary,
  },

  title: {
    fontSize: 30,
    fontFamily: FONTS.display, fontWeight: "normal",

    color: COLORS.text,

    marginBottom:
      SPACING.sm,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 21,

    color:
      COLORS.textSecondary,

    marginBottom:
      SPACING.xl,
  },

  form: {
    width: "100%",
  },

  input: {
    marginBottom:
      SPACING.md,
  },

  error: {
    marginBottom:
      SPACING.md,

    fontSize: 13,
    lineHeight: 18,

    color: COLORS.destructive,
  },

  forgotPassword: {
    alignSelf: "flex-end",

    marginBottom:
      SPACING.lg,

    fontSize: 14,
    fontWeight: "600",

    color:
      COLORS.primary,
  },

  button: {
    marginTop: SPACING.xs,
  },

  registerContainer: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    marginTop:
      SPACING.lg,
  },

  registerText: {
    fontSize: 14,

    color:
      COLORS.textSecondary,
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "700",

    color:
      COLORS.primary,
  },
});