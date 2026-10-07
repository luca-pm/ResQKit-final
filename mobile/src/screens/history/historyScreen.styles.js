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
    paddingTop:
      SPACING.md,

    paddingBottom:
      SPACING.xxxl,
  },

  emptyContent: {
    flexGrow: 1,
  },

  intro: {
    marginHorizontal:
      SPACING.lg,

    marginTop:
      SPACING.lg,

    marginBottom:
      SPACING.lg,
  },

  introTitle: {
    fontSize: 20,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.text,
  },

  introDescription: {
    marginTop:
      SPACING.xs,

    fontSize: 14,
    lineHeight: 20,

    color:
      COLORS.textSecondary,
  },

  emptyContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal:
      SPACING.xl,

    paddingVertical:
      SPACING.xxxl,
  },

  emptyIcon: {
    width: 70,
    height: 70,

    borderRadius:
      RADIUS.round,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
      COLORS.surface,

    marginBottom:
      SPACING.md,
  },

  emptyTitle: {
    fontSize: 16,

    fontWeight: "600",

    textAlign: "center",

    color:
      COLORS.textSecondary,
  },
});