import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from "../../design";

export default StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,

    backgroundColor: COLORS.background,
  },

  container: {
    minHeight: 56,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: SPACING.sm,

    borderRadius: RADIUS.xl,

    backgroundColor: COLORS.white,

    ...SHADOWS.small,
  },

  actionButton: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,

    maxHeight: 110,

    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,

    fontSize: 15,

    color: COLORS.text,
  },

  sendButton: {
    width: 40,
    height: 40,

    borderRadius: RADIUS.round,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primary,
  },

  sendButtonDisabled: {
     opacity: 0.45,
  },
});