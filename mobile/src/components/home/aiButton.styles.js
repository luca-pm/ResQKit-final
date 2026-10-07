import { StyleSheet } from "react-native";

import {
  COLORS,
  SHADOWS,
  SPACING,
  RADIUS,
  SIZES,
} from "../../design";

export default StyleSheet.create({
  container: {
    position: "absolute",

    right: SPACING.lg,

    bottom: 20,

    minHeight: SIZES.buttonHeight,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primary,

    paddingVertical: 14,

    paddingHorizontal: 18,

    borderRadius: 999,

    ...SHADOWS.medium,
  },

  text: {
    color: COLORS.white,

    fontWeight: "700",

    fontSize: 16,

    marginLeft: 10,
  },
});