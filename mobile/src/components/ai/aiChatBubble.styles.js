import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
} from "../../design";

export default StyleSheet.create({
  row: {
    width: "100%",

    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },

  userRow: {
    alignItems: "flex-end",
  },

  aiRow: {
    alignItems: "flex-start",
  },

  bubble: {
    maxWidth: "82%",

    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,

    borderRadius: RADIUS.lg,
  },

  userBubble: {
    backgroundColor: COLORS.primary,

    borderBottomRightRadius: 4,
  },

  aiBubble: {
    backgroundColor: COLORS.primaryLight,

    borderBottomLeftRadius: 4,
  },

  message: {
    fontSize: 15,
    lineHeight: 21,
  },

  userText: {
    color: COLORS.white,
  },

  aiText: {
    color: COLORS.text,
  },
});