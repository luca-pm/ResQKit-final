import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../design";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },

  notificationCard: {
    marginBottom: SPACING.md,
  },

  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconWrap: {
    width: 44,
    height: 44,

    alignItems: "center",
    justifyContent: "center",

    marginRight: SPACING.md,

    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },

  notificationBody: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  notificationDescription: {
    marginTop: SPACING.xs,

    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",

    paddingTop: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
  },

  emptyIconWrap: {
    width: 84,
    height: 84,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
  },

  emptyTitle: {
    marginTop: SPACING.lg,

    fontSize: 20,
    fontFamily: FONTS.display, fontWeight: "normal",
    color: COLORS.text,
  },

  emptyDescription: {
    marginTop: SPACING.sm,

    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
});
