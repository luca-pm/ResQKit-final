import {
  StyleSheet,
} from "react-native";

import {
  COLORS,
  RADIUS,
  SPACING,
} from "../../design";

export default StyleSheet.create({
  card: {
    marginHorizontal:
      SPACING.lg,

    marginBottom:
      SPACING.md,

    padding:
      SPACING.md,

    borderRadius:
      RADIUS.lg,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    backgroundColor:
      COLORS.white,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius:
      RADIUS.md,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.surface,

    marginRight:
      SPACING.md,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",

    color:
      COLORS.text,
  },

  date: {
    marginTop:
      SPACING.xs,

    fontSize: 12,

    color:
      COLORS.textSecondary,
  },

  description: {
    marginTop:
      SPACING.md,

    fontSize: 14,
    lineHeight: 20,

    color:
      COLORS.textSecondary,
  },

  statusContainer: {
    alignSelf: "flex-start",

    marginTop:
      SPACING.md,

    paddingHorizontal:
      SPACING.sm,

    paddingVertical:
      SPACING.xs,

    borderRadius:
      RADIUS.round,

    backgroundColor:
      COLORS.surface,
  },

  statusText: {
    fontSize: 12,

    fontWeight: "700",

    color:
      COLORS.primary,
  },

  detailsContainer: {
    marginTop:
      SPACING.md,

    paddingTop:
      SPACING.md,

    borderTopWidth: 1,

    borderTopColor:
      COLORS.border,

    gap: SPACING.sm,
  },

  detailRow: {
    flexDirection: "row",

    alignItems: "flex-start",
  },

  bullet: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginTop: 7,

    marginRight:
      SPACING.sm,

    backgroundColor:
      COLORS.primary,
  },

  detailText: {
    flex: 1,

    fontSize: 13,
    lineHeight: 19,

    color:
      COLORS.textSecondary,
  },
});