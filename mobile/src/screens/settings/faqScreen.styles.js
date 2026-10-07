import { StyleSheet } from "react-native";

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

  intro: {
    marginBottom:
      SPACING.lg,
  },

  title: {
    fontSize: 20,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.text,
  },

  description: {
    marginTop:
      SPACING.xs,

    fontSize: 14,

    lineHeight: 20,

    color:
      COLORS.textSecondary,
  },

  searchContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom:
      SPACING.lg,

    paddingHorizontal:
      SPACING.md,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.white,
  },

  searchInput: {
    flex: 1,

    paddingHorizontal:
      SPACING.sm,

    paddingVertical: 13,

    fontSize: 15,

    color:
      COLORS.text,
  },

  emptyContainer: {
    alignItems: "center",

    paddingVertical:
      SPACING.xxxl,
  },

  emptyTitle: {
    marginTop:
      SPACING.md,

    fontSize: 17,

    fontWeight: "700",

    color:
      COLORS.text,
  },

  emptyDescription: {
    marginTop:
      SPACING.xs,

    fontSize: 14,

    color:
      COLORS.textSecondary,
  },
});