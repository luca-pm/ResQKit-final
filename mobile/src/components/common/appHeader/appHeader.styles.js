import { StyleSheet } from "react-native";

import { COLORS,
  SPACING,
  SHADOWS, FONTS } from "../../../design";

export default StyleSheet.create({
  container: {
    minHeight: 64,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,

    backgroundColor: COLORS.white,

    ...SHADOWS.small,
  },

  leftSection: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flexShrink: 1,

    marginLeft: SPACING.sm,

    fontSize: 21,
    fontFamily: FONTS.display, fontWeight: "normal",

    color: COLORS.text,
  },

  iconButton: {
    alignItems: "center",
    justifyContent: "center",

    minWidth: 40,
    minHeight: 40,
  },

  profileButton: {
    alignItems: "center",
    justifyContent: "center",

    minWidth: 40,
    minHeight: 40,

    marginLeft: SPACING.xs,
  },
});