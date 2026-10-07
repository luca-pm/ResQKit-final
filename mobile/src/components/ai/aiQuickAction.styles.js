import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from "../../design";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.white,

    borderRadius: RADIUS.lg,

    padding: SPACING.md,

    marginBottom: SPACING.md,

    ...SHADOWS.small,
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius: RADIUS.md,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primaryLight,

    marginRight: SPACING.md,
  },

  title: {
    flex: 1,

    fontSize: 16,
    fontWeight: "600",

    color: COLORS.text,
  },
});