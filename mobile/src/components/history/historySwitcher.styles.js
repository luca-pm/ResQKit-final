import {
  StyleSheet,
} from "react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
} from "../../design";

export default StyleSheet.create({
  container: {
    flexDirection: "row",

    marginHorizontal:
      SPACING.lg,

    marginBottom:
      SPACING.md,
  },

  button: {
    flex: 1,

    minHeight: 52,

    paddingHorizontal:
      SPACING.xs,

    paddingVertical: 10,

    borderRadius:
      RADIUS.md,

    backgroundColor:
      COLORS.surface,

    alignItems: "center",

    justifyContent:
      "center",

    marginHorizontal: 4,
  },

  active: {
    backgroundColor:
      COLORS.primary,
  },

  text: {
    fontSize: 12,

    lineHeight: 16,

    fontWeight: "600",

    textAlign: "center",

    color:
      COLORS.text,
  },

  activeText: {
    color:
      COLORS.white,
  },
});