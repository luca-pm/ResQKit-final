import { StyleSheet } from "react-native";

import { COLORS,
  SPACING, FONTS } from "../../design";

export default StyleSheet.create({
  title: {
    fontSize: 22,

    fontFamily: FONTS.display, fontWeight: "normal",

    color: COLORS.text,

    marginBottom: SPACING.md,
  },
});