import {
  StyleSheet,
} from "react-native";

import { COLORS,
  SPACING, FONTS } from "../../design";

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

  topRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    marginBottom:
      SPACING.md,
  },

  durationContainer: {
    flexDirection: "row",

    alignItems: "center",

    gap: SPACING.xs,
  },

  duration: {
    fontSize: 13,

    color:
      COLORS.textSecondary,
  },

  titleRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",
  },

  title: {
    flex: 1,

    paddingRight:
      SPACING.sm,

    fontSize: 18,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.text,
  },

  description: {
    marginTop:
      SPACING.sm,

    fontSize: 14,

    lineHeight: 20,

    color:
      COLORS.textSecondary,
  },

  emptyContainer: {
    alignItems: "center",

    justifyContent:
      "center",

    paddingHorizontal:
      SPACING.xl,

    paddingTop:
      SPACING.xxxl,
  },

  empty: {
    marginTop:
      SPACING.md,

    textAlign: "center",

    fontSize: 14,

    lineHeight: 20,

    color:
      COLORS.textSecondary,
  },
});