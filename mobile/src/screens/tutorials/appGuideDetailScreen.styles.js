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

  content: {
    paddingBottom:
      SPACING.xxxl,
  },

  card: {
    marginHorizontal:
      SPACING.lg,

    marginTop:
      SPACING.lg,
  },

  introHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom:
      SPACING.md,
  },

  iconContainer: {
    width: 52,
    height: 52,

    alignItems: "center",
    justifyContent: "center",

    borderRadius:
      RADIUS.md,

    backgroundColor:
      COLORS.primaryLight,

    marginRight:
      SPACING.md,
  },

  title: {
    flex: 1,

    fontSize: 20,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.text,
  },

  description: {
    fontSize: 15,

    lineHeight: 22,

    color:
      COLORS.textSecondary,
  },

  sectionTitle: {
    fontSize: 19,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.text,

    marginBottom:
      SPACING.lg,
  },

  step: {
    flexDirection: "row",

    alignItems:
      "flex-start",

    marginBottom:
      SPACING.lg,
  },

  stepNumber: {
    width: 32,
    height: 32,

    borderRadius:
      RADIUS.round,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.primary,

    marginRight:
      SPACING.md,
  },

  stepNumberText: {
    fontSize: 13,

    fontWeight: "700",

    color:
      COLORS.white,
  },

  stepText: {
    flex: 1,

    fontSize: 15,

    lineHeight: 21,

    color:
      COLORS.text,

    paddingTop: 4,
  },

  notFoundContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent:
      "center",

    paddingHorizontal:
      SPACING.lg,

    gap: SPACING.md,
  },

  notFound: {
    fontSize: 15,

    textAlign: "center",

    color:
      COLORS.textSecondary,
  },
});