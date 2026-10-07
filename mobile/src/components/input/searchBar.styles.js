import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
} from "../../design";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    height: 42,

    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,

    paddingHorizontal: SPACING.md,

    backgroundColor: COLORS.white,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
  },

  input: {
    flex: 1,

    height: "100%",

    marginLeft: SPACING.sm,
    paddingVertical: 0,

    fontSize: 15,
    color: COLORS.text,
  },

  clearButton: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: SPACING.xs,
  },
});
