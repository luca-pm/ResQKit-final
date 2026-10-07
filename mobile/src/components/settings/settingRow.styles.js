import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
} from "../../design";

export default StyleSheet.create({
  container: {
    minHeight: 58,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingVertical: SPACING.sm,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  left: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginLeft: SPACING.md,

    fontSize: 16,
    fontWeight: "600",

    color: COLORS.text,
  },

  value: {
    marginRight: SPACING.sm,

    fontSize: 14,

    color: COLORS.textSecondary,
  },

  dangerText: {
    color: COLORS.destructive,
  },
});