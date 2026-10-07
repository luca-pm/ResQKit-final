import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
} from "../../design";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    width: "100%",

    paddingVertical: SPACING.sm,
  },

  label: {
    flex: 1,

    paddingRight: SPACING.md,

    fontSize: 14,
    fontWeight: "500",

    color: COLORS.textSecondary,
  },

  value: {
    flex: 1.4,

    fontSize: 14,
    fontWeight: "600",

    color: COLORS.text,

    textAlign: "right",

    flexShrink: 1,
  },
});