import { StyleSheet } from "react-native";

import { COLORS,
  RADIUS,
  SPACING, FONTS } from "../../design";

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

  intro: {
    marginBottom: SPACING.lg,
  },

  title: {
    fontSize: 20,
    fontFamily: FONTS.display, fontWeight: "normal",
    color: COLORS.text,
  },

  description: {
    marginTop: SPACING.xs,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },

  infoCard: {
    marginBottom: SPACING.xl,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    marginRight: SPACING.md,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  infoValue: {
    marginTop: SPACING.xs,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },

  sectionTitle: {
    marginBottom: SPACING.md,
    fontSize: 18,
    fontFamily: FONTS.display, fontWeight: "normal",
    color: COLORS.text,
  },

  label: {
    marginBottom: SPACING.sm,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  input: {
    minHeight: 48,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    fontSize: 15,
    color: COLORS.text,
  },

  messageInput: {
    minHeight: 130,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },

  note: {
    marginTop: SPACING.lg,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: COLORS.textSecondary,
  },
});