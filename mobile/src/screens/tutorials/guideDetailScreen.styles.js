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

  headerRow: {
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

  description: {
    fontSize: 15,

    lineHeight: 22,

    color:
      COLORS.text,
  },

  sectionTitle: {
    marginBottom:
      SPACING.lg,

    fontSize: 20,

    fontFamily: FONTS.display, fontWeight: "normal",

    color:
      COLORS.text,
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

    flexShrink: 0,

    alignItems: "center",

    justifyContent:
      "center",

    borderRadius:
      RADIUS.round,

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

    paddingTop: 4,

    fontSize: 15,

    lineHeight: 21,

    color:
      COLORS.text,
  },

  emergencyCard: {
    marginHorizontal:
      SPACING.lg,

    marginTop:
      SPACING.lg,

    borderWidth: 1,

    borderColor:
      "#F3B5B5",
  },

  emergencyHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom:
      SPACING.sm,

    gap: SPACING.sm,
  },

  emergencyTitle: {
    fontSize: 17,

    fontWeight: "700",

    color:
      COLORS.error,
  },

  emergencyText: {
    fontSize: 14,

    lineHeight: 20,

    color:
      COLORS.text,
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
    textAlign: "center",

    fontSize: 14,

    color:
      COLORS.textSecondary,
  },
});